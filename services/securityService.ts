import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';
import CryptoJS from 'crypto-js';

// Master Security Configuration
const SECURITY_CONFIG = {
  ENCRYPTION_KEY: 'SECURE_APP_2024_MASTER_KEY_DO_NOT_SHARE',
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  REQUEST_TIMEOUT: 10000, // 10 seconds
  MAX_INPUT_LENGTH: 1000,
  ALLOWED_DOMAINS: ['supabase.co', 'your-app-domain.com'],
  RATE_LIMIT_WINDOW: 60 * 1000, // 1 minute
  RATE_LIMIT_MAX_REQUESTS: 60
};

// ================================
// 1. ENCRYPTION & DECRYPTION LAYER
// ================================
class EncryptionService {
  private static key = SECURITY_CONFIG.ENCRYPTION_KEY;

  static encrypt(data: string): string {
    try {
      return CryptoJS.AES.encrypt(data, this.key).toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Data encryption failed');
    }
  }

  static decrypt(encryptedData: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.key);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      if (!decrypted) throw new Error('Invalid encrypted data');
      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Data decryption failed');
    }
  }

  static hashPassword(password: string, salt?: string): { hash: string; salt: string } {
    const passwordSalt = salt || CryptoJS.lib.WordArray.random(128/8).toString();
    const hash = CryptoJS.PBKDF2(password, passwordSalt, { keySize: 256/32, iterations: 10000 }).toString();
    return { hash, salt: passwordSalt };
  }

  static verifyPassword(password: string, hash: string, salt: string): boolean {
    const { hash: newHash } = this.hashPassword(password, salt);
    return newHash === hash;
  }

  static generateSecureToken(): string {
    return CryptoJS.lib.WordArray.random(32).toString();
  }

  static generateSignature(data: any, timestamp: number): string {
    const payload = JSON.stringify(data) + timestamp.toString();
    return CryptoJS.HmacSHA256(payload, this.key).toString();
  }
}

// ================================
// 2. SECURE STORAGE LAYER
// ================================
class SecureStorageService {
  static async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // Use localStorage as fallback for web
        const encrypted = EncryptionService.encrypt(value);
        localStorage.setItem(`secure_${key}`, encrypted);
        return;
      }
      
      const encrypted = EncryptionService.encrypt(value);
      await SecureStore.setItemAsync(key, encrypted);
    } catch (error) {
      console.error('Secure storage set failed:', error);
      throw new Error('Failed to store secure data');
    }
  }

  static async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        // Use localStorage as fallback for web
        const encrypted = localStorage.getItem(`secure_${key}`);
        if (!encrypted) return null;
        return EncryptionService.decrypt(encrypted);
      }
      
      const encrypted = await SecureStore.getItemAsync(key);
      if (!encrypted) return null;
      return EncryptionService.decrypt(encrypted);
    } catch (error) {
      console.error('Secure storage get failed:', error);
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // Use localStorage as fallback for web
        localStorage.removeItem(`secure_${key}`);
        return;
      }
      
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Secure storage removal failed:', error);
    }
  }

  static async setUserData(userId: string, data: any): Promise<void> {
    const encryptedData = EncryptionService.encrypt(JSON.stringify(data));
    if (Platform.OS === 'web') {
      localStorage.setItem(`secure_user_${userId}`, encryptedData);
    } else {
      await SecureStore.setItemAsync(`user_${userId}`, encryptedData);
    }
  }

  static async getUserData(userId: string): Promise<any | null> {
    try {
      let encrypted: string | null;
      if (Platform.OS === 'web') {
        encrypted = localStorage.getItem(`secure_user_${userId}`);
      } else {
        encrypted = await SecureStore.getItemAsync(`user_${userId}`);
      }
      
      if (!encrypted) return null;
      const decrypted = EncryptionService.decrypt(encrypted);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('User data retrieval failed:', error);
      return null;
    }
  }
}

// ================================
// 3. INPUT VALIDATION & SANITIZATION
// ================================
class InputValidationService {
  static sanitizeText(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    return input
      .trim()
      .substring(0, SECURITY_CONFIG.MAX_INPUT_LENGTH)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/eval\s*\(/gi, '')
      .replace(/alert\s*\(/gi, '')
      .replace(/document\./gi, '')
      .replace(/window\./gi, '')
      .replace(/[<>]/g, '');
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  }

  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) errors.push('Password must be at least 8 characters');
    if (!/[a-z]/.test(password)) errors.push('Password must contain lowercase letter');
    if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase letter');
    if (!/[0-9]/.test(password)) errors.push('Password must contain number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Password must contain special character');
    
    return { valid: errors.length === 0, errors };
  }

  static validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone.trim());
  }

  static detectMaliciousContent(content: string): { isMalicious: boolean; threats: string[] } {
    const threats: string[] = [];
    const patterns = [
      { pattern: /<script/i, threat: 'Script injection detected' },
      { pattern: /javascript:/i, threat: 'JavaScript protocol detected' },
      { pattern: /on\w+=/i, threat: 'Event handler injection detected' },
      { pattern: /eval\(/i, threat: 'Code evaluation detected' },
      { pattern: /document\./i, threat: 'DOM manipulation detected' },
      { pattern: /window\./i, threat: 'Window object access detected' },
      { pattern: /\.\.\//g, threat: 'Path traversal detected' },
      { pattern: /union\s+select/i, threat: 'SQL injection detected' },
      { pattern: /exec\s*\(/i, threat: 'Code execution detected' }
    ];

    patterns.forEach(({ pattern, threat }) => {
      if (pattern.test(content)) {
        threats.push(threat);
      }
    });

    return { isMalicious: threats.length > 0, threats };
  }

  static validateURL(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return SECURITY_CONFIG.ALLOWED_DOMAINS.some(domain => 
        urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
      );
    } catch {
      return false;
    }
  }
}

// ================================
// 4. RATE LIMITING SYSTEM
// ================================
class RateLimitService {
  private static attempts = new Map<string, { count: number; firstAttempt: number; locked: boolean }>();
  private static loginAttempts = new Map<string, { count: number; firstAttempt: number; locked: boolean }>();

  static checkRateLimit(identifier: string, maxRequests: number = SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const windowStart = now - SECURITY_CONFIG.RATE_LIMIT_WINDOW;
    
    let userAttempts = this.attempts.get(identifier);
    
    if (!userAttempts || userAttempts.firstAttempt < windowStart) {
      userAttempts = { count: 1, firstAttempt: now, locked: false };
      this.attempts.set(identifier, userAttempts);
      return { allowed: true, remaining: maxRequests - 1 };
    }

    if (userAttempts.count >= maxRequests) {
      userAttempts.locked = true;
      return { allowed: false, remaining: 0 };
    }

    userAttempts.count++;
    return { allowed: true, remaining: maxRequests - userAttempts.count };
  }

  static checkLoginAttempts(identifier: string): { allowed: boolean; remaining: number; lockoutTime?: number } {
    const now = Date.now();
    let userAttempts = this.loginAttempts.get(identifier);

    if (!userAttempts) {
      userAttempts = { count: 1, firstAttempt: now, locked: false };
      this.loginAttempts.set(identifier, userAttempts);
      return { allowed: true, remaining: SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS - 1 };
    }

    // Check if lockout period has expired
    if (userAttempts.locked && (now - userAttempts.firstAttempt) > SECURITY_CONFIG.LOCKOUT_DURATION) {
      userAttempts = { count: 1, firstAttempt: now, locked: false };
      this.loginAttempts.set(identifier, userAttempts);
      return { allowed: true, remaining: SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS - 1 };
    }

    // Check if still locked
    if (userAttempts.locked) {
      const lockoutRemaining = SECURITY_CONFIG.LOCKOUT_DURATION - (now - userAttempts.firstAttempt);
      return { allowed: false, remaining: 0, lockoutTime: Math.ceil(lockoutRemaining / 1000 / 60) };
    }

    // Increment attempts
    userAttempts.count++;
    
    if (userAttempts.count >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
      userAttempts.locked = true;
      return { allowed: false, remaining: 0, lockoutTime: SECURITY_CONFIG.LOCKOUT_DURATION / 1000 / 60 };
    }

    return { allowed: true, remaining: SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS - userAttempts.count };
  }

  static resetLoginAttempts(identifier: string): void {
    this.loginAttempts.delete(identifier);
  }

  static clearExpiredAttempts(): void {
    const now = Date.now();
    const windowStart = now - SECURITY_CONFIG.RATE_LIMIT_WINDOW;
    
    // Clear rate limit attempts
    for (const [key, value] of this.attempts.entries()) {
      if (value.firstAttempt < windowStart) {
        this.attempts.delete(key);
      }
    }

    // Clear login attempts
    for (const [key, value] of this.loginAttempts.entries()) {
      if (value.locked && (now - value.firstAttempt) > SECURITY_CONFIG.LOCKOUT_DURATION) {
        this.loginAttempts.delete(key);
      }
    }
  }
}

// ================================
// 5. DEVICE SECURITY CHECKS
// ================================
class DeviceSecurityService {
  static async checkDeviceSecurity(): Promise<{ secure: boolean; issues: string[] }> {
    const issues: string[] = [];
    
    try {
      if (Platform.OS === 'web') {
        // Web-specific security checks
        if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
          issues.push('Connection is not secure (HTTPS required)');
        }
        if (__DEV__) issues.push('Development mode is enabled');
        return { secure: issues.length === 0, issues };
      }
      
      // Check if device is jailbroken/rooted
      const isRooted = await this.detectRootedDevice();
      if (isRooted) issues.push('Device appears to be rooted/jailbroken');
      
      // Check if debugging is enabled
      if (__DEV__) issues.push('Development mode is enabled');
      
      // Check biometric security
      const biometricAvailable = await LocalAuthentication.hasHardwareAsync();
      const biometricEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (!biometricAvailable) issues.push('No biometric security hardware');
      if (biometricAvailable && !biometricEnrolled) issues.push('No biometric credentials enrolled');
      
      // Check device integrity
      const deviceInfo = await this.getDeviceFingerprint();
      if (!deviceInfo.secure) issues.push('Device integrity compromised');
      
      return { secure: issues.length === 0, issues };
    } catch (error) {
      issues.push('Security check failed');
      return { secure: false, issues };
    }
  }

  static async detectRootedDevice(): Promise<boolean> {
    if (Platform.OS === 'web') {
      return false; // Web doesn't have rooting concept
    }
    
    // This is a basic check - in production, you'd use a native module for better detection
    try {
      const suspiciousApps = [
        'com.noshufou.android.su',
        'com.thirdparty.superuser',
        'eu.chainfire.supersu',
        'com.koushikdutta.superuser',
        'com.zachspong.temprootremovejb',
        'com.ramdroid.appquarantine'
      ];
      
      // Check for common root paths (would need native implementation)
      const rootPaths = [
        '/system/app/Superuser.apk',
        '/sbin/su',
        '/system/bin/su',
        '/system/xbin/su',
        '/data/local/xbin/su',
        '/data/local/bin/su',
        '/system/sd/xbin/su',
        '/system/bin/failsafe/su',
        '/data/local/su'
      ];
      
      // For now, return false as we can't check files without native code
      // In production, implement native security checks
      return false;
    } catch {
      return false;
    }
  }

  static async getDeviceFingerprint(): Promise<{ fingerprint: string; secure: boolean }> {
    try {
      if (Platform.OS === 'web') {
        // Web-specific fingerprinting
        const deviceInfo = {
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform,
          cookieEnabled: navigator.cookieEnabled.toString(),
          buildVersion: 'web',
        };
        
        const fingerprintData = Object.values(deviceInfo).join('|');
        const fingerprint = CryptoJS.SHA256(fingerprintData).toString();
        
        const secure = window.location.protocol === 'https:' && !__DEV__;
        return { fingerprint, secure };
      }
      
      const deviceInfo = {
        modelName: Device.modelName || 'unknown',
        osName: Device.osName || 'unknown',
        osVersion: Device.osVersion || 'unknown',
        brand: Device.brand || 'unknown',
        appVersion: Application.nativeApplicationVersion || 'unknown',
        buildVersion: Application.nativeBuildVersion || 'unknown'
      };
      
      const fingerprintData = Object.values(deviceInfo).join('|');
      const fingerprint = CryptoJS.SHA256(fingerprintData).toString();
      
      // Basic security checks
      const secure = deviceInfo.modelName !== 'unknown' && 
                    deviceInfo.osName !== 'unknown' &&
                    !__DEV__;
      
      return { fingerprint, secure };
    } catch (error) {
      console.error('Device fingerprint failed:', error);
      return { fingerprint: 'unknown', secure: false };
    }
  }

  static async enableBiometricAuth(): Promise<{ success: boolean; error?: string }> {
    try {
      if (Platform.OS === 'web') {
        return { success: false, error: 'Biometric authentication not available on web' };
      }
      
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        return { success: false, error: 'No biometric hardware available' };
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        return { success: false, error: 'No biometric credentials enrolled' };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to secure your account',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false
      });

      if (result.success) {
        await SecureStorageService.setItem('biometric_enabled', 'true');
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Authentication failed' };
      }
    } catch (error) {
      return { success: false, error: 'Biometric setup failed' };
    }
  }
}

// ================================
// 6. NETWORK SECURITY LAYER
// ================================
class NetworkSecurityService {
  static async makeSecureRequest(url: string, options: RequestInit = {}): Promise<Response> {
    try {
      // Validate URL
      if (!InputValidationService.validateURL(url)) {
        throw new Error('Invalid or untrusted URL');
      }

      // Get device fingerprint
      const { fingerprint } = await DeviceSecurityService.getDeviceFingerprint();
      
      // Generate request signature
      const timestamp = Date.now();
      const requestData = {
        method: options.method || 'GET',
        url,
        timestamp,
        body: options.body || ''
      };
      const signature = EncryptionService.generateSignature(requestData, timestamp);

      // Add security headers
      const secureHeaders = {
        ...options.headers,
        'X-Device-ID': fingerprint,
        'X-App-Version': Application.nativeApplicationVersion || '1.0.0',
        'X-Request-ID': EncryptionService.generateSecureToken(),
        'X-Timestamp': timestamp.toString(),
        'X-Signature': signature,
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block'
      };

      const secureOptions: RequestInit = {
        ...options,
        headers: secureHeaders,
        timeout: SECURITY_CONFIG.REQUEST_TIMEOUT
      };

      // Make request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), SECURITY_CONFIG.REQUEST_TIMEOUT);
      
      const response = await fetch(url, {
        ...secureOptions,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Validate response
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Check content type
      const contentType = response.headers.get('content-type');
      if (contentType && !contentType.includes('application/json') && !contentType.includes('text/')) {
        console.warn('Unexpected content type:', contentType);
      }

      return response;
    } catch (error) {
      console.error('Secure request failed:', error);
      throw error;
    }
  }

  static validateSSLCertificate(response: Response): boolean {
    // In a real app, you'd implement certificate pinning here
    // For now, trust the system's certificate validation
    return true;
  }

  static sanitizeResponseData(data: any): any {
    if (typeof data === 'string') {
      return InputValidationService.sanitizeText(data);
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeResponseData(item));
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          sanitized[key] = this.sanitizeResponseData(data[key]);
        }
      }
      return sanitized;
    }
    
    return data;
  }
}

// ================================
// 7. AUDIT & MONITORING SERVICE
// ================================
class AuditService {
  private static logs: Array<{ timestamp: number; event: string; data: any; severity: 'info' | 'warning' | 'error' }> = [];

  static logSecurityEvent(event: string, data: any = {}, severity: 'info' | 'warning' | 'error' = 'info'): void {
    const logEntry = {
      timestamp: Date.now(),
      event,
      data: this.sanitizeLogData(data),
      severity
    };
    
    this.logs.push(logEntry);
    
    // Keep only last 1000 logs
    if (this.logs.length > 1000) {
      this.logs.shift();
    }
    
    // Log to console in development
    if (__DEV__) {
      console.log(`[SECURITY ${severity.toUpperCase()}] ${event}:`, data);
    }
    
    // In production, send critical events to monitoring service
    if (severity === 'error' && !__DEV__) {
      this.reportSecurityIncident(logEntry);
    }
  }

  private static sanitizeLogData(data: any): any {
    const sanitized = JSON.parse(JSON.stringify(data));
    
    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'key', 'secret', 'credential'];
    
    function removeSensitive(obj: any): any {
      if (typeof obj !== 'object' || obj === null) return obj;
      
      for (const key in obj) {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
          obj[key] = '[REDACTED]';
        } else if (typeof obj[key] === 'object') {
          obj[key] = removeSensitive(obj[key]);
        }
      }
      return obj;
    }
    
    return removeSensitive(sanitized);
  }

  private static async reportSecurityIncident(incident: any): Promise<void> {
    try {
      // In production, send to your monitoring service
      // await NetworkSecurityService.makeSecureRequest('/api/security/incident', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(incident)
      // });
    } catch (error) {
      console.error('Failed to report security incident:', error);
    }
  }

  static getSecurityLogs(): Array<any> {
    return [...this.logs];
  }

  static clearLogs(): void {
    this.logs = [];
  }
}

// ================================
// 8. MASTER SECURITY MANAGER
// ================================
class SecurityManager {
  private static initialized = false;
  private static sessionTimer: NodeJS.Timeout | null = null;

  static async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      AuditService.logSecurityEvent('Security Manager Initialization Started');
      
      // Skip advanced security features on web
      if (Platform.OS === 'web') {
        console.log('Security Manager: Web platform detected, using simplified security');
        this.initialized = true;
        AuditService.logSecurityEvent('Security Manager Initialized Successfully (Web Mode)');
        return;
      }
      
      // Check device security
      const deviceSecurity = await DeviceSecurityService.checkDeviceSecurity();
      if (!deviceSecurity.secure) {
        AuditService.logSecurityEvent('Device Security Issues Detected', deviceSecurity.issues, 'warning');
      }
      
      // Start cleanup intervals
      setInterval(() => {
        RateLimitService.clearExpiredAttempts();
      }, 60000); // Clean every minute
      
      // Initialize session management
      this.startSessionTimer();
      
      this.initialized = true;
      AuditService.logSecurityEvent('Security Manager Initialized Successfully');
    } catch (error) {
      AuditService.logSecurityEvent('Security Manager Initialization Failed', { error: error.message }, 'error');
      throw error;
    }
  }

  private static startSessionTimer(): void {
    if (this.sessionTimer) clearTimeout(this.sessionTimer);
    
    this.sessionTimer = setTimeout(() => {
      this.handleSessionTimeout();
    }, SECURITY_CONFIG.SESSION_TIMEOUT);
  }

  private static async handleSessionTimeout(): Promise<void> {
    AuditService.logSecurityEvent('Session Timeout - User Logged Out', {}, 'info');
    
    // Clear sensitive data
    await SecureStorageService.removeItem('auth_token');
    await SecureStorageService.removeItem('user_session');
    
    // Redirect to login (implement in your app)
    // NavigationService.navigate('Login');
  }

  static resetSessionTimer(): void {
    this.startSessionTimer();
  }

  static async performSecurityCheck(): Promise<{ secure: boolean; issues: string[] }> {
    const issues: string[] = [];
    
    try {
      // Check device security
      const deviceCheck = await DeviceSecurityService.checkDeviceSecurity();
      if (!deviceCheck.secure) {
        issues.push(...deviceCheck.issues);
      }
      
      // Check for suspicious activity (implement based on your needs)
      const logs = AuditService.getSecurityLogs();
      const recentErrors = logs.filter(log => 
        log.severity === 'error' && 
        Date.now() - log.timestamp < 5 * 60 * 1000 // Last 5 minutes
      );
      
      if (recentErrors.length > 10) {
        issues.push('High number of security errors detected');
      }
      
      return { secure: issues.length === 0, issues };
    } catch (error) {
      issues.push('Security check failed');
      return { secure: false, issues };
    }
  }

  static async emergencyLockdown(): Promise<void> {
    AuditService.logSecurityEvent('Emergency Lockdown Initiated', {}, 'error');
    
    try {
      // Clear all sensitive data
      await SecureStorageService.removeItem('auth_token');
      await SecureStorageService.removeItem('user_session');
      await SecureStorageService.removeItem('biometric_enabled');
      
      // Clear caches
      AuditService.clearLogs();
      
      // Force logout (implement in your app)
      // AuthService.forceLogout();
      
    } catch (error) {
      console.error('Emergency lockdown failed:', error);
    }
  }
}

// Export all security services
export {
  SecurityManager,
  EncryptionService,
  SecureStorageService,
  InputValidationService,
  RateLimitService,
  DeviceSecurityService,
  NetworkSecurityService,
  AuditService,
  SECURITY_CONFIG
};

// Initialize security on import
SecurityManager.initialize().catch(console.error);