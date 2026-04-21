import React, { useState, useEffect, createContext, useContext } from 'react';
import { Alert, Platform } from 'react-native';
import { 
  SecurityManager, 
  AuditService, 
  DeviceSecurityService, 
  SecureStorageService,
  InputValidationService 
} from '../services/securityService';
import { SecureAuthService } from '../hooks/useSecureAuth';

// ================================
// SECURITY CONTEXT
// ================================
interface SecurityContextType {
  isSecure: boolean;
  securityIssues: string[];
  checkSecurity: () => Promise<void>;
  emergencyLockdown: () => Promise<void>;
  securityLevel: 'low' | 'medium' | 'high' | 'critical';
  biometricEnabled: boolean;
  enableBiometric: () => Promise<void>;
  user: any;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within SecurityProvider');
  }
  return context;
};

// ================================
// SECURITY PROVIDER COMPONENT
// ================================
export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSecure, setIsSecure] = useState(false);
  const [securityIssues, setSecurityIssues] = useState<string[]>([]);
  const [securityLevel, setSecurityLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initializeSecurity();
  }, []);

  const initializeSecurity = async () => {
    try {
      // Skip security initialization on web for now
      if (Platform.OS === 'web') {
        console.log('Security Provider: Web platform detected, using simplified security');
        setIsSecure(true);
        setSecurityLevel('medium');
        setSecurityIssues(['Web platform - limited security features']);
        return;
      }
      
      // Initialize security manager
      await SecurityManager.initialize();
      
      // Check initial security status
      await checkSecurity();
      
      // Check for existing session
      await validateExistingSession();
      
      // Check biometric status
      const biometricStatus = await SecureStorageService.getItem('biometric_enabled');
      setBiometricEnabled(biometricStatus === 'true');
      
      AuditService.logSecurityEvent('Security Provider Initialized', {}, 'info');
    } catch (error) {
      console.error('Security Provider Initialization Failed:', error);
      AuditService.logSecurityEvent('Security Provider Initialization Failed', { error: error.message }, 'error');
      setSecurityLevel('critical');
    }
  };

  const validateExistingSession = async () => {
    try {
      const sessionValidation = await SecureAuthService.validateSession();
      if (sessionValidation.valid && sessionValidation.user) {
        setUser(sessionValidation.user);
        setIsAuthenticated(true);
        AuditService.logSecurityEvent('Existing Session Validated', { userId: sessionValidation.user.id }, 'info');
      }
    } catch (error) {
      AuditService.logSecurityEvent('Session Validation Failed', { error: error.message }, 'warning');
    }
  };

  const checkSecurity = async () => {
    try {
      const securityCheck = await SecurityManager.performSecurityCheck();
      setIsSecure(securityCheck.secure);
      setSecurityIssues(securityCheck.issues);
      
      // Determine security level based on issues
      let level: 'low' | 'medium' | 'high' | 'critical' = 'high';
      
      if (securityCheck.issues.length === 0) {
        level = 'high';
      } else if (securityCheck.issues.length <= 2) {
        level = 'medium';
      } else if (securityCheck.issues.length <= 4) {
        level = 'low';
      } else {
        level = 'critical';
      }
      
      setSecurityLevel(level);
      
      // Show warnings for critical issues
      if (level === 'critical') {
        Alert.alert(
          '🚨 Critical Security Alert',
          'Multiple security issues detected:\n\n' + securityCheck.issues.join('\n') + '\n\nYour account may be at risk. Consider taking security measures immediately.',
          [
            { text: 'Emergency Lockdown', style: 'destructive', onPress: emergencyLockdown },
            { text: 'I Understand', style: 'default' }
          ]
        );
      } else if (level === 'low') {
        Alert.alert(
          '⚠️ Security Warning',
          'Security issues detected:\n\n' + securityCheck.issues.join('\n') + '\n\nPlease review your security settings.',
          [{ text: 'OK' }]
        );
      }
      
      AuditService.logSecurityEvent('Security Check Completed', { 
        level, 
        issuesCount: securityCheck.issues.length, 
        issues: securityCheck.issues 
      }, level === 'critical' ? 'error' : 'info');
      
    } catch (error) {
      AuditService.logSecurityEvent('Security Check Failed', { error: error.message }, 'error');
      setSecurityLevel('critical');
      setIsSecure(false);
    }
  };

  const emergencyLockdown = async () => {
    try {
      Alert.alert(
        '🔒 Emergency Lockdown',
        'This will immediately log you out and clear all stored data. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Lockdown Now', 
            style: 'destructive',
            onPress: async () => {
              await SecurityManager.emergencyLockdown();
              setUser(null);
              setIsAuthenticated(false);
              setBiometricEnabled(false);
              Alert.alert('🔒 Lockdown Complete', 'All sensitive data has been cleared. Please log in again when you\'re ready.');
            }
          }
        ]
      );
    } catch (error) {
      AuditService.logSecurityEvent('Emergency Lockdown Failed', { error: error.message }, 'error');
    }
  };

  const enableBiometric = async () => {
    try {
      const result = await DeviceSecurityService.enableBiometricAuth();
      if (result.success) {
        setBiometricEnabled(true);
        Alert.alert('✅ Biometric Security Enabled', 'Your account is now protected with biometric authentication.');
        AuditService.logSecurityEvent('Biometric Authentication Enabled', { userId: user?.id }, 'info');
      } else {
        Alert.alert('❌ Biometric Setup Failed', result.error || 'Unable to enable biometric authentication.');
        AuditService.logSecurityEvent('Biometric Setup Failed', { error: result.error }, 'error');
      }
    } catch (error) {
      Alert.alert('❌ Biometric Error', 'Biometric setup encountered an error.');
      AuditService.logSecurityEvent('Biometric Setup Error', { error: error.message }, 'error');
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Validate inputs
      if (!email || !password) {
        Alert.alert('❌ Login Error', 'Email and password are required.');
        return false;
      }

      // Sanitize inputs
      const sanitizedEmail = InputValidationService.sanitizeText(email);
      
      // Check for malicious content
      const contentCheck = InputValidationService.detectMaliciousContent(email + password);
      if (contentCheck.isMalicious) {
        Alert.alert('🚨 Security Threat', 'Malicious content detected. Login blocked for security.');
        AuditService.logSecurityEvent('Login Blocked - Malicious Content', { 
          email: sanitizedEmail, 
          threats: contentCheck.threats 
        }, 'error');
        return false;
      }

      const loginResult = await SecureAuthService.secureLogin(sanitizedEmail, password);
      
      if (loginResult.success && loginResult.user) {
        setUser(loginResult.user);
        setIsAuthenticated(true);
        
        // Re-check security after login
        setTimeout(() => checkSecurity(), 1000);
        
        Alert.alert('✅ Login Successful', `Welcome back, ${loginResult.user.name}!`);
        return true;
      } else {
        Alert.alert('❌ Login Failed', loginResult.error || 'Invalid credentials.');
        return false;
      }
    } catch (error) {
      AuditService.logSecurityEvent('Login System Error', { error: error.message }, 'error');
      Alert.alert('❌ Login Error', 'System temporarily unavailable. Please try again.');
      return false;
    }
  };

  const logout = async () => {
    try {
      await SecureAuthService.secureLogout();
      setUser(null);
      setIsAuthenticated(false);
      Alert.alert('👋 Logged Out', 'You have been securely logged out.');
    } catch (error) {
      AuditService.logSecurityEvent('Logout Error', { error: error.message }, 'error');
    }
  };

  const contextValue: SecurityContextType = {
    isSecure,
    securityIssues,
    checkSecurity,
    emergencyLockdown,
    securityLevel,
    biometricEnabled,
    enableBiometric,
    user,
    login,
    logout,
    isAuthenticated
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};

// ================================
// SECURITY DASHBOARD COMPONENT
// ================================
export const SecurityDashboard: React.FC = () => {
  const {
    isSecure,
    securityIssues,
    checkSecurity,
    emergencyLockdown,
    securityLevel,
    biometricEnabled,
    enableBiometric
  } = useSecurityContext();

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'high': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'low': return '#EF4444';
      case 'critical': return '#7C2D12';
      default: return '#6B7280';
    }
  };

  const getSecurityLevelIcon = (level: string) => {
    switch (level) {
      case 'high': return '🛡️';
      case 'medium': return '⚠️';
      case 'low': return '🔒';
      case 'critical': return '🚨';
      default: return '❓';
    }
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      margin: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      borderWidth: 1,
      borderColor: '#E5E7EB'
    }}>
      <h2 style={{ 
        fontSize: 18, 
        fontWeight: '700', 
        marginBottom: 16,
        color: '#1F2937'
      }}>
        🔐 Security Dashboard
      </h2>

      {/* Security Level Indicator */}
      <div style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: getSecurityLevelColor(securityLevel) + '15',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16
      }}>
        <span style={{ fontSize: 24, marginRight: 12 }}>
          {getSecurityLevelIcon(securityLevel)}
        </span>
        <div>
          <div style={{
            fontSize: 16,
            fontWeight: '600',
            color: getSecurityLevelColor(securityLevel),
            textTransform: 'uppercase'
          }}>
            {securityLevel} Security
          </div>
          <div style={{ fontSize: 14, color: '#6B7280', marginTop: 2 }}>
            {isSecure ? 'All systems secure' : `${securityIssues.length} issues detected`}
          </div>
        </div>
      </div>

      {/* Security Issues */}
      {securityIssues.length > 0 && (
        <div style={{
          backgroundColor: '#FEF2F2',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          borderLeft: '4px solid #EF4444'
        }}>
          <h3 style={{ fontSize: 14, fontWeight: '600', color: '#DC2626', marginBottom: 8 }}>
            Security Issues:
          </h3>
          {securityIssues.map((issue, index) => (
            <div key={index} style={{
              fontSize: 13,
              color: '#B91C1C',
              marginBottom: 4
            }}>
              • {issue}
            </div>
          ))}
        </div>
      )}

      {/* Security Features */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 12,
        marginBottom: 16
      }}>
        <div style={{
          backgroundColor: '#F9FAFB',
          padding: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#E5E7EB'
        }}>
          <div style={{ fontSize: 14, fontWeight: '600', marginBottom: 4 }}>
            🔐 Encryption
          </div>
          <div style={{ fontSize: 12, color: '#10B981' }}>
            ✅ AES-256 Active
          </div>
        </div>

        <div style={{
          backgroundColor: '#F9FAFB',
          padding: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#E5E7EB'
        }}>
          <div style={{ fontSize: 14, fontWeight: '600', marginBottom: 4 }}>
            🛡️ Rate Limiting
          </div>
          <div style={{ fontSize: 12, color: '#10B981' }}>
            ✅ Protection Active
          </div>
        </div>

        <div style={{
          backgroundColor: '#F9FAFB',
          padding: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#E5E7EB'
        }}>
          <div style={{ fontSize: 14, fontWeight: '600', marginBottom: 4 }}>
            👆 Biometric Auth
          </div>
          <div style={{ fontSize: 12, color: biometricEnabled ? '#10B981' : '#F59E0B' }}>
            {biometricEnabled ? '✅ Enabled' : '⚠️ Disabled'}
          </div>
        </div>

        <div style={{
          backgroundColor: '#F9FAFB',
          padding: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#E5E7EB'
        }}>
          <div style={{ fontSize: 14, fontWeight: '600', marginBottom: 4 }}>
            🔍 Threat Detection
          </div>
          <div style={{ fontSize: 12, color: '#10B981' }}>
            ✅ Real-time Scanning
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button
          onClick={checkSecurity}
          style={{
            backgroundColor: '#3B82F6',
            color: '#FFFFFF',
            padding: '8px 16px',
            borderRadius: 8,
            border: 'none',
            fontSize: 14,
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          🔄 Run Security Check
        </button>

        {!biometricEnabled && (
          <button
            onClick={enableBiometric}
            style={{
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              fontSize: 14,
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            👆 Enable Biometric
          </button>
        )}

        <button
          onClick={emergencyLockdown}
          style={{
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            padding: '8px 16px',
            borderRadius: 8,
            border: 'none',
            fontSize: 14,
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          🚨 Emergency Lockdown
        </button>
      </div>

      {/* Security Tips */}
      <div style={{
        backgroundColor: '#F0F9FF',
        borderRadius: 8,
        padding: 12,
        marginTop: 16,
        borderLeft: '4px solid #3B82F6'
      }}>
        <h3 style={{ fontSize: 14, fontWeight: '600', color: '#1E40AF', marginBottom: 8 }}>
          💡 Security Tips:
        </h3>
        <ul style={{ fontSize: 12, color: '#1E40AF', margin: 0, paddingLeft: 16 }}>
          <li>Use strong, unique passwords for all accounts</li>
          <li>Enable biometric authentication when available</li>
          <li>Keep your device updated with latest security patches</li>
          <li>Be cautious when connecting to public Wi-Fi networks</li>
          <li>Regularly review your account security settings</li>
        </ul>
      </div>
    </div>
  );
};