// AI Debug Dashboard - Platform Self-Healing Interface
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Modal,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { aiDebugService, DebugSession, PlatformHealth } from '@/services/aiDebugService';

const { width } = Dimensions.get('window');

interface AIDebugDashboardProps {
  visible: boolean;
  onClose: () => void;
}

export default function AIDebugDashboard({ visible, onClose }: AIDebugDashboardProps) {
  const [debugSessions, setDebugSessions] = useState<DebugSession[]>([]);
  const [platformHealth, setPlatformHealth] = useState<PlatformHealth | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'sessions' | 'health' | 'settings'>('overview');
  const [selectedSession, setSelectedSession] = useState<DebugSession | null>(null);
  const [showSessionDetails, setShowSessionDetails] = useState(false);
  const [autoFix, setAutoFix] = useState(true);
  const [monitoring, setMonitoring] = useState(true);
  const [reportDescription, setReportDescription] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (visible) {
      loadData();
      const interval = setInterval(loadData, 10000); // Refresh every 10 seconds
      return () => clearInterval(interval);
    }
  }, [visible]);

  const loadData = async () => {
    try {
      const sessions = aiDebugService.getDebugSessions(50);
      const health = await aiDebugService.assessPlatformHealth();
      
      setDebugSessions(sessions);
      setPlatformHealth(health);
    } catch (error) {
      console.error('Failed to load debug data:', error);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getStatusColor = (status: DebugSession['status']) => {
    const colors = {
      pending: '#F59E0B',
      analyzing: '#3B82F6',
      fixing: '#8B5CF6',
      resolved: '#10B981',
      failed: '#EF4444'
    };
    return colors[status] || '#6B7280';
  };

  const getSeverityColor = (severity: DebugSession['severity']) => {
    const colors = {
      low: '#10B981',
      medium: '#F59E0B',
      high: '#F97316',
      critical: '#EF4444'
    };
    return colors[severity];
  };

  const getHealthColor = (health: string) => {
    const colors = {
      excellent: '#10B981',
      good: '#3B82F6',
      fair: '#F59E0B',
      poor: '#F97316',
      critical: '#EF4444'
    };
    return colors[health] || '#6B7280';
  };

  const handleRetryFix = async (sessionId: string) => {
    try {
      Alert.alert(
        'Retry Fix',
        'Attempting to retry automated fix...',
        [{ text: 'OK' }]
      );
      
      const success = await aiDebugService.retryFix(sessionId);
      
      if (success) {
        Alert.alert('Success', 'Issue has been resolved!');
      } else {
        Alert.alert('Failed', 'Automated fix failed. Manual intervention required.');
      }
      
      await loadData();
    } catch (error) {
      Alert.alert('Error', 'Failed to retry fix');
    }
  };

  const handleReportIssue = async () => {
    if (!reportDescription.trim()) {
      Alert.alert('Error', 'Please enter a description of the issue');
      return;
    }

    try {
      await aiDebugService.reportIssue(reportDescription, 'user_issue');
      Alert.alert('Success', 'Issue reported successfully. AI will analyze it shortly.');
      setReportDescription('');
      setShowReportModal(false);
      await loadData();
    } catch (error) {
      Alert.alert('Error', 'Failed to report issue');
    }
  };

  const handleClearResolved = () => {
    Alert.alert(
      'Clear Resolved Issues',
      'This will remove all resolved debug sessions. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            aiDebugService.clearResolvedSessions();
            await loadData();
          }
        }
      ]
    );
  };

  const renderOverviewTab = () => (
    <ScrollView style={styles.tabContent}>
      {/* Platform Health Overview */}
      {platformHealth && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons 
              name="health-and-safety" 
              size={24} 
              color={getHealthColor(platformHealth.overall)} 
            />
            <Text style={styles.cardTitle}>Platform Health</Text>
            <View style={[styles.healthBadge, { backgroundColor: getHealthColor(platformHealth.overall) }]}>
              <Text style={styles.healthBadgeText}>{platformHealth.overall.toUpperCase()}</Text>
            </View>
          </View>
          
          <View style={styles.healthMetrics}>
            {Object.entries(platformHealth.components).map(([component, score]) => (
              <View key={component} style={styles.healthMetric}>
                <Text style={styles.metricLabel}>{component.charAt(0).toUpperCase() + component.slice(1)}</Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${score}%`,
                        backgroundColor: score >= 90 ? '#10B981' : score >= 70 ? '#F59E0B' : '#EF4444'
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.metricValue}>{score.toFixed(1)}%</Text>
              </View>
            ))}
          </View>

          <View style={styles.healthStats}>
            <View style={styles.healthStat}>
              <Text style={styles.healthStatValue}>{platformHealth.activeIssues}</Text>
              <Text style={styles.healthStatLabel}>Active Issues</Text>
            </View>
            <View style={styles.healthStat}>
              <Text style={styles.healthStatValue}>{platformHealth.resolvedToday}</Text>
              <Text style={styles.healthStatLabel}>Resolved Today</Text>
            </View>
            <View style={styles.healthStat}>
              <Text style={styles.healthStatValue}>{platformHealth.uptime.toFixed(2)}%</Text>
              <Text style={styles.healthStatLabel}>Uptime</Text>
            </View>
          </View>
        </View>
      )}

      {/* Recent Issues */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🚨 Recent Issues</Text>
        {debugSessions.slice(0, 5).map((session) => (
          <TouchableOpacity
            key={session.id}
            style={styles.issueItem}
            onPress={() => {
              setSelectedSession(session);
              setShowSessionDetails(true);
            }}
          >
            <View style={styles.issueHeader}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(session.status) }]} />
              <Text style={styles.issueTitle}>{session.description}</Text>
              <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(session.severity) }]}>
                <Text style={styles.severityText}>{session.severity}</Text>
              </View>
            </View>
            <Text style={styles.issueSource}>{session.source} • {new Date(session.timestamp).toLocaleTimeString()}</Text>
            {session.aiAnalysis && (
              <Text style={styles.aiConfidence}>🧠 AI Confidence: {session.aiAnalysis.confidence}%</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* AI Status */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🤖 AI Debug Status</Text>
        <View style={styles.aiStatus}>
          <View style={styles.statusItem}>
            <MaterialIcons name="auto-fix-high" size={20} color={autoFix ? '#10B981' : '#6B7280'} />
            <Text style={styles.statusLabel}>Auto-Fix</Text>
            <Text style={[styles.statusValue, { color: autoFix ? '#10B981' : '#6B7280' }]}>
              {autoFix ? 'Enabled' : 'Disabled'}
            </Text>
          </View>
          <View style={styles.statusItem}>
            <MaterialIcons name="visibility" size={20} color={monitoring ? '#10B981' : '#6B7280'} />
            <Text style={styles.statusLabel}>Monitoring</Text>
            <Text style={[styles.statusValue, { color: monitoring ? '#10B981' : '#6B7280' }]}>
              {monitoring ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚡ Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#3B82F6' }]}
            onPress={() => setShowReportModal(true)}
          >
            <MaterialIcons name="bug-report" size={16} color="white" />
            <Text style={styles.actionButtonText}>Report Issue</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#10B981' }]}
            onPress={refreshData}
          >
            <MaterialIcons name="refresh" size={16} color="white" />
            <Text style={styles.actionButtonText}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#F59E0B' }]}
            onPress={handleClearResolved}
          >
            <MaterialIcons name="clear-all" size={16} color="white" />
            <Text style={styles.actionButtonText}>Clear Resolved</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderSessionsTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>🔍 Debug Sessions ({debugSessions.length})</Text>
      
      {debugSessions.map((session) => (
        <TouchableOpacity
          key={session.id}
          style={styles.sessionCard}
          onPress={() => {
            setSelectedSession(session);
            setShowSessionDetails(true);
          }}
        >
          <View style={styles.sessionHeader}>
            <View style={styles.sessionInfo}>
              <View style={styles.sessionTitleRow}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(session.status) }]} />
                <Text style={styles.sessionTitle}>{session.description}</Text>
              </View>
              <Text style={styles.sessionMeta}>
                {session.source} • {session.type} • {new Date(session.timestamp).toLocaleString()}
              </Text>
            </View>
            <View style={styles.sessionBadges}>
              <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(session.severity) }]}>
                <Text style={styles.severityText}>{session.severity}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(session.status) }]}>
                <Text style={styles.statusBadgeText}>{session.status}</Text>
              </View>
            </View>
          </View>
          
          {session.aiAnalysis && (
            <View style={styles.aiAnalysisPreview}>
              <Text style={styles.analysisText}>🧠 {session.aiAnalysis.rootCause}</Text>
              <Text style={styles.confidenceText}>Confidence: {session.aiAnalysis.confidence}%</Text>
            </View>
          )}
          
          {session.fixes && session.fixes.length > 0 && (
            <View style={styles.fixesPreview}>
              <Text style={styles.fixesText}>
                {session.fixes.length} fix{session.fixes.length > 1 ? 'es' : ''} attempted
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderHealthTab = () => (
    <ScrollView style={styles.tabContent}>
      {platformHealth && (
        <>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📊 System Components</Text>
            {Object.entries(platformHealth.components).map(([component, score]) => (
              <View key={component} style={styles.componentHealth}>
                <View style={styles.componentHeader}>
                  <Text style={styles.componentName}>{component.charAt(0).toUpperCase() + component.slice(1)}</Text>
                  <Text style={styles.componentScore}>{score.toFixed(1)}%</Text>
                </View>
                <View style={styles.componentBar}>
                  <View 
                    style={[
                      styles.componentFill, 
                      { 
                        width: `${score}%`,
                        backgroundColor: score >= 90 ? '#10B981' : score >= 70 ? '#F59E0B' : '#EF4444'
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.componentStatus}>
                  {score >= 90 ? '✅ Excellent' : score >= 70 ? '⚠️ Good' : '❌ Needs Attention'}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>📈 Performance Metrics</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{platformHealth.uptime.toFixed(3)}%</Text>
                <Text style={styles.metricLabel}>Uptime</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{platformHealth.activeIssues}</Text>
                <Text style={styles.metricLabel}>Active Issues</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{platformHealth.resolvedToday}</Text>
                <Text style={styles.metricLabel}>Resolved Today</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{platformHealth.overall}</Text>
                <Text style={styles.metricLabel}>Overall Health</Text>
              </View>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );

  const renderSettingsTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚙️ AI Debug Settings</Text>
        
        <View style={styles.setting}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Auto-Fix</Text>
            <Text style={styles.settingDescription}>
              Automatically attempt to fix issues when AI confidence is high
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.toggle, autoFix && styles.toggleActive]}
            onPress={() => {
              setAutoFix(!autoFix);
              aiDebugService.toggleAutoFix(!autoFix);
            }}
          >
            <View style={[styles.toggleThumb, autoFix && styles.toggleThumbActive]} />
          </TouchableOpacity>
        </View>

        <View style={styles.setting}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Real-time Monitoring</Text>
            <Text style={styles.settingDescription}>
              Continuously monitor for errors and performance issues
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.toggle, monitoring && styles.toggleActive]}
            onPress={() => {
              setMonitoring(!monitoring);
              aiDebugService.toggleMonitoring(!monitoring);
            }}
          >
            <View style={[styles.toggleThumb, monitoring && styles.toggleThumbActive]} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🧹 Maintenance</Text>
        
        <TouchableOpacity 
          style={styles.maintenanceButton}
          onPress={handleClearResolved}
        >
          <MaterialIcons name="delete-sweep" size={20} color="#F59E0B" />
          <Text style={styles.maintenanceButtonText}>Clear Resolved Sessions</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.maintenanceButton}
          onPress={() => Alert.alert('Info', 'This will simulate a platform health check')}
        >
          <MaterialIcons name="health-and-safety" size={20} color="#10B981" />
          <Text style={styles.maintenanceButtonText}>Run Health Check</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.maintenanceButton}
          onPress={() => Alert.alert('Info', 'Debug data exported to console')}
        >
          <MaterialIcons name="download" size={20} color="#3B82F6" />
          <Text style={styles.maintenanceButtonText}>Export Debug Data</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🤖 AI Debug Dashboard</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabNavigation}>
          {[
            { key: 'overview', label: 'Overview', icon: 'dashboard' },
            { key: 'sessions', label: 'Sessions', icon: 'list' },
            { key: 'health', label: 'Health', icon: 'favorite' },
            { key: 'settings', label: 'Settings', icon: 'settings' }
          ].map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, selectedTab === tab.key && styles.activeTab]}
              onPress={() => setSelectedTab(tab.key as any)}
            >
              <MaterialIcons 
                name={tab.icon as any} 
                size={16} 
                color={selectedTab === tab.key ? '#8B5CF6' : '#666'} 
              />
              <Text style={[styles.tabText, selectedTab === tab.key && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {selectedTab === 'overview' && renderOverviewTab()}
        {selectedTab === 'sessions' && renderSessionsTab()}
        {selectedTab === 'health' && renderHealthTab()}
        {selectedTab === 'settings' && renderSettingsTab()}

        {/* Session Details Modal */}
        <Modal
          visible={showSessionDetails}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowSessionDetails(false)}
        >
          <View style={styles.sessionModalOverlay}>
            <View style={styles.sessionModal}>
              <View style={styles.sessionModalHeader}>
                <Text style={styles.sessionModalTitle}>Debug Session Details</Text>
                <TouchableOpacity onPress={() => setShowSessionDetails(false)}>
                  <MaterialIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              {selectedSession && (
                <ScrollView style={styles.sessionModalContent}>
                  <View style={styles.sessionDetail}>
                    <Text style={styles.detailLabel}>Description:</Text>
                    <Text style={styles.detailValue}>{selectedSession.description}</Text>
                  </View>
                  
                  <View style={styles.sessionDetail}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    <Text style={[styles.detailValue, { color: getStatusColor(selectedSession.status) }]}>
                      {selectedSession.status}
                    </Text>
                  </View>

                  {selectedSession.aiAnalysis && (
                    <View style={styles.sessionDetail}>
                      <Text style={styles.detailLabel}>AI Analysis:</Text>
                      <Text style={styles.detailValue}>{selectedSession.aiAnalysis.rootCause}</Text>
                      <Text style={styles.detailSubValue}>
                        Confidence: {selectedSession.aiAnalysis.confidence}%
                      </Text>
                    </View>
                  )}

                  {selectedSession.fixes && selectedSession.fixes.length > 0 && (
                    <View style={styles.sessionDetail}>
                      <Text style={styles.detailLabel}>Applied Fixes:</Text>
                      {selectedSession.fixes.map((fix, index) => (
                        <Text key={index} style={styles.detailValue}>
                          • {fix.description} ({fix.success ? '✅' : '❌'})
                        </Text>
                      ))}
                    </View>
                  )}

                  {selectedSession.status === 'failed' && (
                    <TouchableOpacity
                      style={styles.retryButton}
                      onPress={() => handleRetryFix(selectedSession.id)}
                    >
                      <MaterialIcons name="refresh" size={16} color="white" />
                      <Text style={styles.retryButtonText}>Retry Fix</Text>
                    </TouchableOpacity>
                  )}
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>

        {/* Report Issue Modal */}
        <Modal
          visible={showReportModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowReportModal(false)}
        >
          <View style={styles.reportModalOverlay}>
            <View style={styles.reportModal}>
              <View style={styles.reportModalHeader}>
                <Text style={styles.reportModalTitle}>Report Issue</Text>
                <TouchableOpacity onPress={() => setShowReportModal(false)}>
                  <MaterialIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.reportModalContent}>
                <Text style={styles.reportLabel}>Describe the issue you're experiencing:</Text>
                <TextInput
                  style={styles.reportInput}
                  value={reportDescription}
                  onChangeText={setReportDescription}
                  placeholder="e.g., App crashes when trying to upload photos..."
                  multiline
                  numberOfLines={4}
                />
                
                <View style={styles.reportActions}>
                  <TouchableOpacity
                    style={styles.reportCancelButton}
                    onPress={() => setShowReportModal(false)}
                  >
                    <Text style={styles.reportCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.reportSubmitButton}
                    onPress={handleReportIssue}
                  >
                    <Text style={styles.reportSubmitText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  modal: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#8B5CF6',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    marginLeft: 4,
  },
  activeTabText: {
    color: '#8B5CF6',
  },
  tabContent: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    margin: 20,
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
  healthBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  healthBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  healthMetrics: {
    gap: 12,
  },
  healthMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metricLabel: {
    fontSize: 12,
    color: '#4B5563',
    width: 80,
    textTransform: 'capitalize',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    width: 40,
    textAlign: 'right',
  },
  healthStats: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  healthStat: {
    flex: 1,
    alignItems: 'center',
  },
  healthStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  healthStatLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
  },
  issueItem: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  issueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  issueTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  severityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  severityText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  issueSource: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  aiConfidence: {
    fontSize: 11,
    color: '#8B5CF6',
  },
  aiStatus: {
    gap: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusLabel: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  sessionCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sessionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  sessionMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
  sessionBadges: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  aiAnalysisPreview: {
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  analysisText: {
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 2,
  },
  confidenceText: {
    fontSize: 10,
    color: '#8B5CF6',
  },
  fixesPreview: {
    backgroundColor: '#EFF6FF',
    padding: 6,
    borderRadius: 4,
  },
  fixesText: {
    fontSize: 11,
    color: '#3B82F6',
  },
  componentHealth: {
    marginBottom: 16,
  },
  componentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  componentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textTransform: 'capitalize',
  },
  componentScore: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  componentBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 4,
  },
  componentFill: {
    height: '100%',
    borderRadius: 4,
  },
  componentStatus: {
    fontSize: 12,
    color: '#6B7280',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metric: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#8B5CF6',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  maintenanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
    gap: 8,
  },
  maintenanceButtonText: {
    fontSize: 14,
    color: '#4B5563',
  },
  // Session Modal Styles
  sessionModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionModal: {
    width: width * 0.9,
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
  },
  sessionModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sessionModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  sessionModalContent: {
    padding: 20,
  },
  sessionDetail: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
  },
  detailSubValue: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  // Report Modal Styles
  reportModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportModal: {
    width: width * 0.9,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  reportModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  reportModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  reportModalContent: {
    padding: 20,
  },
  reportLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  reportInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  reportActions: {
    flexDirection: 'row',
    gap: 12,
  },
  reportCancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  reportCancelText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  reportSubmitButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
  },
  reportSubmitText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});