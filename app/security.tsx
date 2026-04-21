import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, TextInput, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SecurityDashboard, useSecurityContext } from '../contexts/SecurityContext';
import { AuditService } from '../services/securityService';

interface SecurityLog {
  timestamp: number;
  event: string;
  data: any;
  severity: 'info' | 'warning' | 'error';
}

export default function SecurityScreen() {
  const {
    isSecure,
    securityIssues,
    checkSecurity,
    emergencyLockdown,
    securityLevel,
    biometricEnabled,
    enableBiometric,
    user,
    isAuthenticated
  } = useSecurityContext();

  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [securitySettings, setSecuritySettings] = useState({
    autoLock: true,
    encryptStorage: true,
    secureKeyboard: true,
    antiScreenshot: true,
    vpnDetection: true,
    malwareScanning: true,
    networkMonitoring: true,
    deviceIntegrity: true
  });

  useEffect(() => {
    loadSecurityLogs();
    const interval = setInterval(loadSecurityLogs, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSecurityLogs = () => {
    const logs = AuditService.getSecurityLogs();
    setSecurityLogs(logs.slice(-20)); // Show last 20 logs
  };

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'high': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'low': return '#EF4444';
      case 'critical': return '#7C2D12';
      default: return '#6B7280';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return '#3B82F6';
      case 'warning': return '#F59E0B';
      case 'error': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'info': return 'info';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'help';
    }
  };

  const handleSettingChange = (key: string, value: boolean) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
    
    // Show notification for important security changes
    if (key === 'encryptStorage' && !value) {
      Alert.alert(
        '⚠️ Security Warning',
        'Disabling storage encryption will make your data vulnerable. Are you sure?',
        [
          { text: 'Cancel', onPress: () => setSecuritySettings(prev => ({ ...prev, [key]: true })) },
          { text: 'Disable', style: 'destructive' }
        ]
      );
    }

    AuditService.logSecurityEvent(`Security Setting Changed: ${key}`, { 
      setting: key, 
      newValue: value,
      userId: user?.id 
    }, value ? 'info' : 'warning');
  };

  const clearSecurityLogs = () => {
    Alert.alert(
      'Clear Security Logs',
      'This will permanently delete all security logs. Continue?',
      [
        { text: 'Cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            AuditService.clearLogs();
            setSecurityLogs([]);
            Alert.alert('✅ Logs Cleared', 'All security logs have been cleared.');
          }
        }
      ]
    );
  };

  const exportSecurityReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      securityLevel,
      isSecure,
      issues: securityIssues,
      biometricEnabled,
      settings: securitySettings,
      recentLogs: securityLogs.slice(-10)
    };

    // In a real app, this would export to a file or send to email
    Alert.alert(
      '📊 Security Report Generated',
      `Security Level: ${securityLevel.toUpperCase()}\nIssues: ${securityIssues.length}\nBiometric: ${biometricEnabled ? 'Enabled' : 'Disabled'}\nLogs: ${securityLogs.length} entries`,
      [{ text: 'OK' }]
    );

    AuditService.logSecurityEvent('Security Report Generated', { reportData: report }, 'info');
  };

  const runFullSecurityScan = async () => {
    Alert.alert(
      '🔍 Full Security Scan',
      'This will perform a comprehensive security check of your device and app. This may take a few minutes.',
      [
        { text: 'Cancel' },
        { 
          text: 'Start Scan',
          onPress: async () => {
            AuditService.logSecurityEvent('Full Security Scan Started', { userId: user?.id }, 'info');
            
            // Simulate comprehensive scan
            Alert.alert('🔄 Scanning...', 'Performing security analysis...');
            
            setTimeout(async () => {
              await checkSecurity();
              Alert.alert(
                '✅ Scan Complete',
                `Security scan completed.\n\nSecurity Level: ${securityLevel.toUpperCase()}\nIssues Found: ${securityIssues.length}\n\nCheck the Security Dashboard for details.`
              );
              
              AuditService.logSecurityEvent('Full Security Scan Completed', { 
                level: securityLevel,
                issuesFound: securityIssues.length,
                userId: user?.id 
              }, 'info');
            }, 3000);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={true}
        scrollEnabled={true}
        nestedScrollEnabled={true}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>🔐 Security Center</Text>
            <Text style={styles.headerSubtitle}>Complete Protection Dashboard</Text>
          </View>
          <View style={[styles.securityBadge, { backgroundColor: getSecurityLevelColor(securityLevel) + '15' }]}>
            <Text style={[styles.securityBadgeText, { color: getSecurityLevelColor(securityLevel) }]}>
              {securityLevel.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Security Dashboard */}
        <View style={styles.dashboardContainer}>
          <SecurityDashboard />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚀 Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionButton} onPress={runFullSecurityScan}>
              <MaterialIcons name="security" size={24} color="#3B82F6" />
              <Text style={styles.quickActionText}>Full Security Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionButton} onPress={checkSecurity}>
              <MaterialIcons name="refresh" size={24} color="#10B981" />
              <Text style={styles.quickActionText}>Quick Check</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionButton} onPress={exportSecurityReport}>
              <MaterialIcons name="assessment" size={24} color="#F59E0B" />
              <Text style={styles.quickActionText}>Generate Report</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionButton} onPress={emergencyLockdown}>
              <MaterialIcons name="lock" size={24} color="#EF4444" />
              <Text style={styles.quickActionText}>Emergency Lock</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Security Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⚙️ Security Settings</Text>
            <TouchableOpacity onPress={() => setShowAdvanced(!showAdvanced)}>
              <Text style={styles.toggleText}>
                {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingsGrid}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <MaterialIcons name="lock-clock" size={20} color="#3B82F6" />
                <Text style={styles.settingTitle}>Auto Lock</Text>
                <Text style={styles.settingDescription}>Lock app when inactive</Text>
              </View>
              <Switch
                value={securitySettings.autoLock}
                onValueChange={(value) => handleSettingChange('autoLock', value)}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <MaterialIcons name="enhanced-encryption" size={20} color="#10B981" />
                <Text style={styles.settingTitle}>Storage Encryption</Text>
                <Text style={styles.settingDescription}>Encrypt all stored data</Text>
              </View>
              <Switch
                value={securitySettings.encryptStorage}
                onValueChange={(value) => handleSettingChange('encryptStorage', value)}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <MaterialIcons name="keyboard" size={20} color="#8B5CF6" />
                <Text style={styles.settingTitle}>Secure Keyboard</Text>
                <Text style={styles.settingDescription}>Prevent keyloggers</Text>
              </View>
              <Switch
                value={securitySettings.secureKeyboard}
                onValueChange={(value) => handleSettingChange('secureKeyboard', value)}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <MaterialIcons name="screenshot-monitor" size={20} color="#EF4444" />
                <Text style={styles.settingTitle}>Screenshot Protection</Text>
                <Text style={styles.settingDescription}>Block screenshots</Text>
              </View>
              <Switch
                value={securitySettings.antiScreenshot}
                onValueChange={(value) => handleSettingChange('antiScreenshot', value)}
              />
            </View>

            {showAdvanced && (
              <>
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <MaterialIcons name="vpn-lock" size={20} color="#F59E0B" />
                    <Text style={styles.settingTitle}>VPN Detection</Text>
                    <Text style={styles.settingDescription}>Detect VPN usage</Text>
                  </View>
                  <Switch
                    value={securitySettings.vpnDetection}
                    onValueChange={(value) => handleSettingChange('vpnDetection', value)}
                  />
                </View>

                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <MaterialIcons name="bug-report" size={20} color="#DC2626" />
                    <Text style={styles.settingTitle}>Malware Scanning</Text>
                    <Text style={styles.settingDescription}>Real-time threat detection</Text>
                  </View>
                  <Switch
                    value={securitySettings.malwareScanning}
                    onValueChange={(value) => handleSettingChange('malwareScanning', value)}
                  />
                </View>

                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <MaterialIcons name="network-check" size={20} color="#059669" />
                    <Text style={styles.settingTitle}>Network Monitoring</Text>
                    <Text style={styles.settingDescription}>Monitor network traffic</Text>
                  </View>
                  <Switch
                    value={securitySettings.networkMonitoring}
                    onValueChange={(value) => handleSettingChange('networkMonitoring', value)}
                  />
                </View>

                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <MaterialIcons name="verified-user" size={20} color="#7C3AED" />
                    <Text style={styles.settingTitle}>Device Integrity</Text>
                    <Text style={styles.settingDescription}>Check device tampering</Text>
                  </View>
                  <Switch
                    value={securitySettings.deviceIntegrity}
                    onValueChange={(value) => handleSettingChange('deviceIntegrity', value)}
                  />
                </View>
              </>
            )}
          </View>
        </View>

        {/* Security Logs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📋 Security Activity Log</Text>
            <TouchableOpacity onPress={clearSecurityLogs}>
              <Text style={styles.clearText}>Clear Logs</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.logsContainer}>
            {securityLogs.length === 0 ? (
              <View style={styles.emptyLogs}>
                <MaterialIcons name="security" size={48} color="#D1D5DB" />
                <Text style={styles.emptyTitle}>No Security Events</Text>
                <Text style={styles.emptySubtitle}>Security logs will appear here</Text>
              </View>
            ) : (
              securityLogs.slice().reverse().map((log, index) => (
                <View key={index} style={styles.logItem}>
                  <View style={styles.logHeader}>
                    <View style={styles.logSeverity}>
                      <MaterialIcons 
                        name={getSeverityIcon(log.severity) as any} 
                        size={16} 
                        color={getSeverityColor(log.severity)} 
                      />
                      <Text style={[styles.logSeverityText, { color: getSeverityColor(log.severity) }]}>
                        {log.severity.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.logTimestamp}>
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </Text>
                  </View>
                  <Text style={styles.logEvent}>{log.event}</Text>
                  {log.data && Object.keys(log.data).length > 0 && (
                    <Text style={styles.logData}>
                      {JSON.stringify(log.data, null, 2).substring(0, 100)}
                      {JSON.stringify(log.data).length > 100 && '...'}
                    </Text>
                  )}
                </View>
              ))
            )}
          </View>
        </View>

        {/* Security Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Security Best Practices</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tipItem}>
              <MaterialIcons name="lock" size={20} color="#3B82F6" />
              <Text style={styles.tipText}>Use strong, unique passwords for all accounts</Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialIcons name="fingerprint" size={20} color="#10B981" />
              <Text style={styles.tipText}>Enable biometric authentication when available</Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialIcons name="update" size={20} color="#F59E0B" />
              <Text style={styles.tipText}>Keep your device updated with security patches</Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialIcons name="wifi-protected-setup" size={20} color="#8B5CF6" />
              <Text style={styles.tipText}>Be cautious on public Wi-Fi networks</Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialIcons name="visibility-off" size={20} color="#EF4444" />
              <Text style={styles.tipText}>Don't share sensitive information in public</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  securityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  securityBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  dashboardContainer: {
    // No additional styling needed as SecurityDashboard has its own styles
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  toggleText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  clearText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },
  settingsGrid: {
    gap: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  settingDescription: {
    fontSize: 12,
    color: '#6B7280',
    position: 'absolute',
    top: 20,
    left: 32,
  },
  logsContainer: {
    maxHeight: 400,
  },
  emptyLogs: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#D1D5DB',
    marginTop: 4,
  },
  logItem: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logSeverity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  logSeverityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  logTimestamp: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  logEvent: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  logData: {
    fontSize: 11,
    color: '#6B7280',
    fontFamily: 'monospace',
  },
  tipsContainer: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
});