import { 
  SecurityManager, 
  InputValidationService, 
  RateLimitService, 
  SecureStorageService,
  AuditService,
  DeviceSecurityService 
} from '../services/securityService';
import { Alert } from 'react-native';

// ================================
// SECURE AUTHENTICATION HOOKS
// ================================
class SecureAuthService {
  private static currentUser: any = null;
  private static authToken: string | null = null;

  static async secureLogin(email: string, password: string): Promise<{ success: boolean; error?: string; user?: any }> {
    try {
      // Rate limiting check
      const rateCheck = RateLimitService.checkLoginAttempts(email);
      if (!rateCheck.allowed) {
        const message = rateCheck.lockoutTime 
          ? `Account locked. Try again in ${rateCheck.lockoutTime} minutes.`
          : 'Too many login attempts. Please try again later.';
        
        AuditService.logSecurityEvent('Login Blocked - Rate Limited', { email, remaining: rateCheck.remaining }, 'warning');
        return { success: false, error: message };
      }

      // Input validation
      const sanitizedEmail = InputValidationService.sanitizeText(email);
      if (!InputValidationService.validateEmail(sanitizedEmail)) {
        AuditService.logSecurityEvent('Login Failed - Invalid Email', { email: sanitizedEmail }, 'warning');
        return { success: false, error: 'Invalid email format' };
      }

      // Password validation
      const passwordValidation = InputValidationService.validatePassword(password);
      if (!passwordValidation.valid) {
        AuditService.logSecurityEvent('Login Failed - Weak Password', { email: sanitizedEmail }, 'warning');
        return { success: false, error: 'Password does not meet security requirements' };
      }

      // Device security check
      const deviceCheck = await DeviceSecurityService.checkDeviceSecurity();
      if (!deviceCheck.secure) {
        AuditService.logSecurityEvent('Login Warning - Device Security Issues', { 
          email: sanitizedEmail, 
          issues: deviceCheck.issues 
        }, 'warning');
        
        // Show warning but allow login
        Alert.alert(
          'Security Warning',
          'Your device has security issues that may compromise your account safety:\n\n' + 
          deviceCheck.issues.join('\n') + 
          '\n\nProceed with caution.',
          [{ text: 'I Understand', style: 'default' }]
        );
      }

      // Malicious content detection
      const contentCheck = InputValidationService.detectMaliciousContent(email + password);
      if (contentCheck.isMalicious) {
        AuditService.logSecurityEvent('Login Blocked - Malicious Content', { 
          email: sanitizedEmail, 
          threats: contentCheck.threats 
        }, 'error');
        
        await SecurityManager.emergencyLockdown();
        return { success: false, error: 'Security threat detected. Account temporarily locked.' };
      }

      // Simulate login API call with security measures
      const loginResult = await this.performSecureLogin(sanitizedEmail, password);
      
      if (loginResult.success) {
        // Reset failed attempts on successful login
        RateLimitService.resetLoginAttempts(email);
        
        // Store secure session
        await this.establishSecureSession(loginResult.user, loginResult.token);
        
        AuditService.logSecurityEvent('Login Successful', { 
          email: sanitizedEmail, 
          userId: loginResult.user.id 
        }, 'info');
        
        // Reset session timer
        SecurityManager.resetSessionTimer();
        
        return { success: true, user: loginResult.user };
      } else {
        AuditService.logSecurityEvent('Login Failed - Invalid Credentials', { email: sanitizedEmail }, 'warning');
        return { success: false, error: loginResult.error || 'Invalid credentials' };
      }

    } catch (error) {
      AuditService.logSecurityEvent('Login Error - System Failure', { 
        email, 
        error: error.message 
      }, 'error');
      
      return { success: false, error: 'Login system temporarily unavailable' };
    }
  }

  private static async performSecureLogin(email: string, password: string): Promise<{ success: boolean; user?: any; token?: string; error?: string }> {
    try {
      // In a real app, this would call your Supabase auth
      // For now, simulate secure authentication
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login (replace with real Supabase auth)
      if (email === 'demo@secure.com' && password === 'SecurePass123!') {
        const user = {
          id: '12345',
          email: email,
          name: 'Secure User',
          verified: true,
          lastLogin: new Date().toISOString()
        };
        
        const token = 'secure_jwt_token_here';
        return { success: true, user, token };
      } else {
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      return { success: false, error: 'Authentication service error' };
    }
  }

  private static async establishSecureSession(user: any, token: string): Promise<void> {
    try {
      this.currentUser = user;
      this.authToken = token;
      
      // Store encrypted session data
      await SecureStorageService.setUserData(user.id, {
        user,
        sessionStart: Date.now(),
        deviceFingerprint: (await DeviceSecurityService.getDeviceFingerprint()).fingerprint
      });
      
      await SecureStorageService.setItem('auth_token', token);
      await SecureStorageService.setItem('user_session', JSON.stringify({
        userId: user.id,
        loginTime: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      }));
      
    } catch (error) {
      AuditService.logSecurityEvent('Session Establishment Failed', { error: error.message }, 'error');
      throw error;
    }
  }

  static async validateSession(): Promise<{ valid: boolean; user?: any; error?: string }> {
    try {
      const sessionData = await SecureStorageService.getItem('user_session');
      if (!sessionData) {
        return { valid: false, error: 'No active session' };
      }

      const session = JSON.parse(sessionData);
      if (Date.now() > session.expiresAt) {
        await this.secureLogout();
        return { valid: false, error: 'Session expired' };
      }

      // Validate device fingerprint
      const { fingerprint } = await DeviceSecurityService.getDeviceFingerprint();
      const userData = await SecureStorageService.getUserData(session.userId);
      
      if (userData && userData.deviceFingerprint !== fingerprint) {
        AuditService.logSecurityEvent('Session Validation Failed - Device Mismatch', { 
          userId: session.userId,
          expectedFingerprint: userData.deviceFingerprint,
          actualFingerprint: fingerprint
        }, 'error');
        
        await this.secureLogout();
        return { valid: false, error: 'Device security verification failed' };
      }

      // Reset session timer on successful validation
      SecurityManager.resetSessionTimer();
      
      return { valid: true, user: userData?.user };
    } catch (error) {
      AuditService.logSecurityEvent('Session Validation Error', { error: error.message }, 'error');
      return { valid: false, error: 'Session validation failed' };
    }
  }

  static async secureLogout(): Promise<void> {
    try {
      const userId = this.currentUser?.id;
      
      AuditService.logSecurityEvent('User Logout Initiated', { userId }, 'info');
      
      // Clear all session data
      await SecureStorageService.removeItem('auth_token');
      await SecureStorageService.removeItem('user_session');
      
      if (userId) {
        await SecureStorageService.removeItem(`user_${userId}`);
      }
      
      // Clear in-memory data
      this.currentUser = null;
      this.authToken = null;
      
      AuditService.logSecurityEvent('User Logout Completed', { userId }, 'info');
    } catch (error) {
      AuditService.logSecurityEvent('Logout Error', { error: error.message }, 'error');
    }
  }

  static getCurrentUser(): any {
    return this.currentUser;
  }

  static getAuthToken(): string | null {
    return this.authToken;
  }

  static async enableTwoFactorAuth(): Promise<{ success: boolean; error?: string; qrCode?: string }> {
    try {
      if (!this.currentUser) {
        return { success: false, error: 'No authenticated user' };
      }

      // In a real app, generate TOTP secret and QR code
      const secret = Math.random().toString(36).substring(2, 15);
      const qrCode = `otpauth://totp/SecureApp:${this.currentUser.email}?secret=${secret}&issuer=SecureApp`;
      
      await SecureStorageService.setItem('2fa_secret', secret);
      await SecureStorageService.setItem('2fa_enabled', 'true');
      
      AuditService.logSecurityEvent('2FA Enabled', { userId: this.currentUser.id }, 'info');
      
      return { success: true, qrCode };
    } catch (error) {
      AuditService.logSecurityEvent('2FA Setup Failed', { error: error.message }, 'error');
      return { success: false, error: '2FA setup failed' };
    }
  }
}

// ================================
// SECURE DATA MANAGEMENT
// ================================
class SecureDataService {
  static async secureApiCall(endpoint: string, options: RequestInit = {}): Promise<any> {
    try {
      // Rate limiting
      const rateCheck = RateLimitService.checkRateLimit(endpoint);
      if (!rateCheck.allowed) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      // Get auth token
      const token = SecureAuthService.getAuthToken();
      if (!token && !endpoint.includes('/public/')) {
        throw new Error('Authentication required');
      }

      // Add auth header
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers
      };

      // Validate and sanitize request body
      let body = options.body;
      if (body && typeof body === 'string') {
        try {
          const parsedBody = JSON.parse(body);
          const sanitizedBody = this.sanitizeRequestData(parsedBody);
          body = JSON.stringify(sanitizedBody);
        } catch {
          // Body is not JSON, sanitize as text
          body = InputValidationService.sanitizeText(body);
        }
      }

      // Make secure request
      const response = await NetworkSecurityService.makeSecureRequest(endpoint, {
        ...options,
        headers,
        body
      });

      const data = await response.json();
      
      // Sanitize response
      const sanitizedData = NetworkSecurityService.sanitizeResponseData(data);
      
      AuditService.logSecurityEvent('API Call Successful', { endpoint, method: options.method || 'GET' }, 'info');
      
      return sanitizedData;
    } catch (error) {
      AuditService.logSecurityEvent('API Call Failed', { 
        endpoint, 
        method: options.method || 'GET', 
        error: error.message 
      }, 'error');
      
      throw error;
    }
  }

  private static sanitizeRequestData(data: any): any {
    if (typeof data === 'string') {
      return InputValidationService.sanitizeText(data);
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeRequestData(item));
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          // Check for malicious content
          const contentCheck = InputValidationService.detectMaliciousContent(String(data[key]));
          if (contentCheck.isMalicious) {
            AuditService.logSecurityEvent('Malicious Content Blocked', { 
              key, 
              threats: contentCheck.threats 
            }, 'warning');
            continue; // Skip this field
          }
          
          sanitized[key] = this.sanitizeRequestData(data[key]);
        }
      }
      return sanitized;
    }
    
    return data;
  }

  static async secureFileUpload(file: any, endpoint: string): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // Validate file type and size
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Rate limiting
      const rateCheck = RateLimitService.checkRateLimit(`upload_${endpoint}`);
      if (!rateCheck.allowed) {
        return { success: false, error: 'Upload rate limit exceeded' };
      }

      // Create secure form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('timestamp', Date.now().toString());
      
      // Add device fingerprint for validation
      const { fingerprint } = await DeviceSecurityService.getDeviceFingerprint();
      formData.append('deviceId', fingerprint);

      const response = await NetworkSecurityService.makeSecureRequest(endpoint, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      AuditService.logSecurityEvent('File Upload Successful', { endpoint, fileSize: file.size }, 'info');
      
      return { success: true, url: result.url };
    } catch (error) {
      AuditService.logSecurityEvent('File Upload Failed', { endpoint, error: error.message }, 'error');
      return { success: false, error: 'File upload failed' };
    }
  }

  private static validateFile(file: any): { valid: boolean; error?: string } {
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return { valid: false, error: 'File size exceeds 10MB limit' };
    }

    // Check file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'File type not allowed' };
    }

    return { valid: true };
  }
}

// Export secure services
export {
  SecureAuthService,
  SecureDataService
};