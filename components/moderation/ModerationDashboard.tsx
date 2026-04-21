import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface Report {
  id: string;
  type: 'post' | 'user' | 'story' | 'livestream' | 'comment';
  contentId: string;
  reportedBy: string;
  reportedUser: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  content?: string;
}

interface ModerationAction {
  id: string;
  type: 'warning' | 'suspension' | 'ban' | 'content_removal' | 'content_flag';
  targetUser: string;
  targetContent?: string;
  reason: string;
  duration?: string;
  moderator: string;
  timestamp: string;
}

interface ModerationDashboardProps {
  visible: boolean;
  onClose: () => void;
  userRole: 'admin' | 'moderator' | 'user';
}

export default function ModerationDashboard({ visible, onClose, userRole }: ModerationDashboardProps) {
  const [activeTab, setActiveTab] = useState<'reports' | 'ai-moderation' | 'actions' | 'analytics' | 'settings'>('reports');
  const [reports, setReports] = useState<Report[]>([]);
  const [actions, setActions] = useState<ModerationAction[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<string>('');
  const [actionReason, setActionReason] = useState('');
  const [actionDuration, setActionDuration] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [aiModerationEnabled, setAiModerationEnabled] = useState(true);
  const [aiSeverityThreshold, setAiSeverityThreshold] = useState(0.7);

  // Mock data
  useEffect(() => {
    setReports([
      {
        id: '1',
        type: 'post',
        contentId: 'post_123',
        reportedBy: 'john.doe',
        reportedUser: 'toxic_user',
        reason: 'harassment',
        description: 'User is sending threatening messages and harassment',
        status: 'pending',
        severity: 'high',
        timestamp: '2 hours ago',
        content: 'This is inappropriate content that violates community guidelines...'
      },
      {
        id: '2',
        type: 'user',
        contentId: 'user_456',
        reportedBy: 'jane.smith',
        reportedUser: 'spam_account',
        reason: 'spam',
        description: 'Account posting repetitive promotional content',
        status: 'pending',
        severity: 'medium',
        timestamp: '4 hours ago',
      },
      {
        id: '3',
        type: 'story',
        contentId: 'story_789',
        reportedBy: 'mike.wilson',
        reportedUser: 'fake_news',
        reason: 'misinformation',
        description: 'Story contains false medical information',
        status: 'reviewed',
        severity: 'critical',
        timestamp: '1 day ago',
        content: 'False medical claims about treatments...'
      },
    ]);

    setActions([
      {
        id: '1',
        type: 'warning',
        targetUser: 'toxic_user',
        reason: 'First warning for harassment',
        moderator: 'admin',
        timestamp: '1 hour ago'
      },
      {
        id: '2',
        type: 'content_removal',
        targetUser: 'spam_account',
        targetContent: 'post_456',
        reason: 'Spam content removed',
        moderator: 'moderator_1',
        timestamp: '3 hours ago'
      }
    ]);
  }, []);

  const handleTakeAction = (report: Report) => {
    setSelectedReport(report);
    setShowActionModal(true);
  };

  const executeAction = () => {
    if (!selectedReport || !actionType || !actionReason) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newAction: ModerationAction = {
      id: Date.now().toString(),
      type: actionType as any,
      targetUser: selectedReport.reportedUser,
      targetContent: selectedReport.contentId,
      reason: actionReason,
      duration: actionDuration || undefined,
      moderator: 'current_moderator',
      timestamp: 'Just now'
    };

    setActions(prev => [newAction, ...prev]);
    
    // Update report status
    setReports(prev => prev.map(report => 
      report.id === selectedReport.id 
        ? { ...report, status: 'resolved' as const }
        : report
    ));

    setShowActionModal(false);
    setSelectedReport(null);
    setActionType('');
    setActionReason('');
    setActionDuration('');

    Alert.alert('Success', 'Moderation action executed successfully');
  };

  const filteredReports = reports.filter(report => {
    if (filterStatus !== 'all' && report.status !== filterStatus) return false;
    if (filterSeverity !== 'all' && report.severity !== filterSeverity) return false;
    return true;
  });

  const renderAiModerationTab = () => (
    <ScrollView style={styles.tabContent}>
      {/* AI Moderation Header */}
      <View style={styles.aiModerationHeader}>
        <View style={styles.aiHeaderLeft}>
          <MaterialIcons name="psychology" size={32} color="#8B5CF6" />
          <View style={styles.aiHeaderText}>
            <Text style={styles.aiModerationTitle}>AI Auto-Moderation</Text>
            <View style={styles.aiStatusContainer}>
              <View style={[styles.aiStatusDot, { backgroundColor: aiModerationEnabled ? '#10B981' : '#EF4444' }]} />
              <Text style={styles.aiStatusText}>{aiModerationEnabled ? 'Active' : 'Disabled'}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.aiToggleButton, { backgroundColor: aiModerationEnabled ? '#10B981' : '#EF4444' }]}
          onPress={() => setAiModerationEnabled(!aiModerationEnabled)}
        >
          <MaterialIcons 
            name={aiModerationEnabled ? 'toggle-on' : 'toggle-off'} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
      </View>

      {/* AI Performance Metrics */}
      <View style={styles.aiMetricsGrid}>
        <View style={styles.aiMetricCard}>
          <MaterialIcons name="flash-on" size={24} color="#F59E0B" />
          <Text style={styles.aiMetricValue}>2.3ms</Text>
          <Text style={styles.aiMetricLabel}>Avg Response Time</Text>
        </View>
        
        <View style={styles.aiMetricCard}>
          <MaterialIcons name="check-circle" size={24} color="#10B981" />
          <Text style={styles.aiMetricValue}>97.8%</Text>
          <Text style={styles.aiMetricLabel}>Accuracy Rate</Text>
        </View>
        
        <View style={styles.aiMetricCard}>
          <MaterialIcons name="block" size={24} color="#EF4444" />
          <Text style={styles.aiMetricValue}>1,247</Text>
          <Text style={styles.aiMetricLabel}>Auto-Blocked Today</Text>
        </View>
        
        <View style={styles.aiMetricCard}>
          <MaterialIcons name="schedule" size={24} color="#3B82F6" />
          <Text style={styles.aiMetricValue}>24/7</Text>
          <Text style={styles.aiMetricLabel}>Uptime</Text>
        </View>
      </View>

      {/* AI Configuration */}
      <View style={styles.aiConfigSection}>
        <Text style={styles.sectionTitle}>AI Configuration</Text>
        
        {/* Severity Threshold */}
        <View style={styles.configCard}>
          <View style={styles.configHeader}>
            <MaterialIcons name="tune" size={20} color="#8B5CF6" />
            <Text style={styles.configTitle}>Severity Threshold</Text>
          </View>
          <Text style={styles.configDesc}>Content with confidence score above this threshold will be auto-moderated</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>Conservative</Text>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderFill, { width: `${aiSeverityThreshold * 100}%` }]} />
              <View style={[styles.sliderThumb, { left: `${aiSeverityThreshold * 100 - 2}%` }]} />
            </View>
            <Text style={styles.sliderLabel}>Aggressive</Text>
          </View>
          <Text style={styles.thresholdValue}>Current: {Math.round(aiSeverityThreshold * 100)}%</Text>
        </View>
        
        {/* Auto Actions */}
        <View style={styles.configCard}>
          <View style={styles.configHeader}>
            <MaterialIcons name="smart-toy" size={20} color="#8B5CF6" />
            <Text style={styles.configTitle}>Automated Actions</Text>
          </View>
          <View style={styles.autoActionsList}>
            <View style={styles.autoActionItem}>
              <MaterialIcons name="visibility-off" size={16} color="#F59E0B" />
              <Text style={styles.autoActionText}>Hide suspicious content</Text>
              <View style={styles.autoActionStatus}>
                <MaterialIcons name="check-circle" size={16} color="#10B981" />
              </View>
            </View>
            
            <View style={styles.autoActionItem}>
              <MaterialIcons name="flag" size={16} color="#EF4444" />
              <Text style={styles.autoActionText}>Flag for human review</Text>
              <View style={styles.autoActionStatus}>
                <MaterialIcons name="check-circle" size={16} color="#10B981" />
              </View>
            </View>
            
            <View style={styles.autoActionItem}>
              <MaterialIcons name="notifications" size={16} color="#3B82F6" />
              <Text style={styles.autoActionText}>Notify moderators instantly</Text>
              <View style={styles.autoActionStatus}>
                <MaterialIcons name="check-circle" size={16} color="#10B981" />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Real-time AI Activity */}
      <View style={styles.aiActivitySection}>
        <Text style={styles.sectionTitle}>Real-time AI Activity</Text>
        
        <View style={styles.activityFeed}>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <MaterialIcons name="block" size={16} color="#EF4444" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Toxic comment blocked</Text>
              <Text style={styles.activityDesc}>Confidence: 94% • 2 seconds ago</Text>
            </View>
            <TouchableOpacity style={styles.reviewButton}>
              <Text style={styles.reviewButtonText}>Review</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <MaterialIcons name="flag" size={16} color="#F59E0B" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Spam post flagged</Text>
              <Text style={styles.activityDesc}>Confidence: 87% • 1 minute ago</Text>
            </View>
            <TouchableOpacity style={styles.reviewButton}>
              <Text style={styles.reviewButtonText}>Review</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <MaterialIcons name="visibility-off" size={16} color="#8B5CF6" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Inappropriate image hidden</Text>
              <Text style={styles.activityDesc}>Confidence: 91% • 3 minutes ago</Text>
            </View>
            <TouchableOpacity style={styles.reviewButton}>
              <Text style={styles.reviewButtonText}>Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* AI vs Human Comparison */}
      <View style={styles.comparisonSection}>
        <Text style={styles.sectionTitle}>AI vs Human Moderation</Text>
        
        <View style={styles.comparisonGrid}>
          <View style={styles.comparisonCard}>
            <View style={styles.comparisonHeader}>
              <MaterialIcons name="psychology" size={20} color="#8B5CF6" />
              <Text style={styles.comparisonTitle}>AI Moderation</Text>
            </View>
            <View style={styles.comparisonStats}>
              <View style={styles.comparisonStat}>
                <Text style={styles.comparisonValue}>1,247</Text>
                <Text style={styles.comparisonLabel}>Actions Today</Text>
              </View>
              <View style={styles.comparisonStat}>
                <Text style={styles.comparisonValue}>2.3ms</Text>
                <Text style={styles.comparisonLabel}>Avg Response</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.comparisonCard}>
            <View style={styles.comparisonHeader}>
              <MaterialIcons name="person" size={20} color="#10B981" />
              <Text style={styles.comparisonTitle}>Human Moderation</Text>
            </View>
            <View style={styles.comparisonStats}>
              <View style={styles.comparisonStat}>
                <Text style={styles.comparisonValue}>89</Text>
                <Text style={styles.comparisonLabel}>Actions Today</Text>
              </View>
              <View style={styles.comparisonStat}>
                <Text style={styles.comparisonValue}>4.2min</Text>
                <Text style={styles.comparisonLabel}>Avg Response</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* AI Training Data */}
      <View style={styles.trainingSection}>
        <Text style={styles.sectionTitle}>AI Training & Learning</Text>
        
        <View style={styles.trainingCard}>
          <View style={styles.trainingHeader}>
            <MaterialIcons name="school" size={20} color="#3B82F6" />
            <Text style={styles.trainingTitle}>Model Performance</Text>
          </View>
          
          <View style={styles.trainingMetrics}>
            <View style={styles.trainingMetric}>
              <Text style={styles.trainingMetricLabel}>Training Data</Text>
              <Text style={styles.trainingMetricValue}>2.4M samples</Text>
            </View>
            
            <View style={styles.trainingMetric}>
              <Text style={styles.trainingMetricLabel}>Last Updated</Text>
              <Text style={styles.trainingMetricValue}>2 hours ago</Text>
            </View>
            
            <View style={styles.trainingMetric}>
              <Text style={styles.trainingMetricLabel}>Continuous Learning</Text>
              <Text style={styles.trainingMetricValue}>Active</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.retrainButton}>
            <MaterialIcons name="refresh" size={16} color="#3B82F6" />
            <Text style={styles.retrainButtonText}>Retrain Model</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderReportsTab = () => (
    <View style={styles.tabContent}>
      {/* Filters */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filtersTitle}>Filters</Text>
        <View style={styles.filtersRow}>
          <TouchableOpacity 
            style={[styles.filterChip, filterStatus === 'all' && styles.filterChipActive]}
            onPress={() => setFilterStatus('all')}
          >
            <Text style={[styles.filterChipText, filterStatus === 'all' && styles.filterChipTextActive]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterChip, filterStatus === 'pending' && styles.filterChipActive]}
            onPress={() => setFilterStatus('pending')}
          >
            <Text style={[styles.filterChipText, filterStatus === 'pending' && styles.filterChipTextActive]}>Pending</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterChip, filterStatus === 'reviewed' && styles.filterChipActive]}
            onPress={() => setFilterStatus('reviewed')}
          >
            <Text style={[styles.filterChipText, filterStatus === 'reviewed' && styles.filterChipTextActive]}>Reviewed</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.filtersRow}>
          <TouchableOpacity 
            style={[styles.filterChip, filterSeverity === 'critical' && styles.filterChipActive]}
            onPress={() => setFilterSeverity('critical')}
          >
            <Text style={[styles.filterChipText, filterSeverity === 'critical' && styles.filterChipTextActive]}>🔴 Critical</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterChip, filterSeverity === 'high' && styles.filterChipActive]}
            onPress={() => setFilterSeverity('high')}
          >
            <Text style={[styles.filterChipText, filterSeverity === 'high' && styles.filterChipTextActive]}>🟡 High</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterChip, filterSeverity === 'medium' && styles.filterChipActive]}
            onPress={() => setFilterSeverity('medium')}
          >
            <Text style={[styles.filterChipText, filterSeverity === 'medium' && styles.filterChipTextActive]}>🟢 Medium</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Reports List */}
      <ScrollView style={styles.reportsList}>
        {filteredReports.map((report) => (
          <View key={report.id} style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <View style={styles.reportInfo}>
                <Text style={styles.reportType}>{report.type.toUpperCase()}</Text>
                <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(report.severity) }]}>
                  <Text style={styles.severityText}>{report.severity}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
                  <Text style={styles.statusText}>{report.status}</Text>
                </View>
              </View>
              <Text style={styles.reportTime}>{report.timestamp}</Text>
            </View>

            <View style={styles.reportDetails}>
              <Text style={styles.reportReason}>Reason: {report.reason}</Text>
              <Text style={styles.reportUsers}>
                Reported User: <Text style={styles.username}>{report.reportedUser}</Text>
              </Text>
              <Text style={styles.reportUsers}>
                Reported By: <Text style={styles.username}>{report.reportedBy}</Text>
              </Text>
              <Text style={styles.reportDescription}>{report.description}</Text>
              
              {report.content && (
                <View style={styles.contentPreview}>
                  <Text style={styles.contentLabel}>Content:</Text>
                  <Text style={styles.contentText}>{report.content}</Text>
                </View>
              )}
            </View>

            {report.status === 'pending' && (
              <View style={styles.reportActions}>
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.actionBtnPrimary]}
                  onPress={() => handleTakeAction(report)}
                >
                  <MaterialIcons name="gavel" size={16} color="white" />
                  <Text style={styles.actionBtnText}>Take Action</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.actionBtnSecondary]}
                  onPress={() => {
                    setReports(prev => prev.map(r => 
                      r.id === report.id ? { ...r, status: 'dismissed' as const } : r
                    ));
                  }}
                >
                  <MaterialIcons name="close" size={16} color="#6B7280" />
                  <Text style={[styles.actionBtnText, { color: '#6B7280' }]}>Dismiss</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderActionsTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Recent Human Moderation Actions</Text>
      {actions.map((action) => (
        <View key={action.id} style={styles.actionCard}>
          <View style={styles.actionHeader}>
            <View style={styles.actionTypeContainer}>
              <MaterialIcons 
                name={getActionIcon(action.type)} 
                size={20} 
                color={getActionColor(action.type)} 
              />
              <Text style={[styles.actionType, { color: getActionColor(action.type) }]}>
                {action.type.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
            <Text style={styles.actionTime}>{action.timestamp}</Text>
          </View>
          
          <Text style={styles.actionTarget}>Target: {action.targetUser}</Text>
          {action.targetContent && (
            <Text style={styles.actionContent}>Content: {action.targetContent}</Text>
          )}
          <Text style={styles.actionReason}>Reason: {action.reason}</Text>
          {action.duration && (
            <Text style={styles.actionDuration}>Duration: {action.duration}</Text>
          )}
          <Text style={styles.actionModerator}>By: {action.moderator}</Text>
        </View>
      ))}
    </ScrollView>
  );

  const renderAnalyticsTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Moderation Analytics</Text>
      
      <View style={styles.analyticsGrid}>
        <View style={styles.analyticsCard}>
          <MaterialIcons name="report" size={24} color="#EF4444" />
          <Text style={styles.analyticsNumber}>24</Text>
          <Text style={styles.analyticsLabel}>Pending Reports</Text>
        </View>
        
        <View style={styles.analyticsCard}>
          <MaterialIcons name="done" size={24} color="#10B981" />
          <Text style={styles.analyticsNumber}>156</Text>
          <Text style={styles.analyticsLabel}>Resolved Today</Text>
        </View>
        
        <View style={styles.analyticsCard}>
          <MaterialIcons name="block" size={24} color="#F59E0B" />
          <Text style={styles.analyticsNumber}>8</Text>
          <Text style={styles.analyticsLabel}>Active Bans</Text>
        </View>
        
        <View style={styles.analyticsCard}>
          <MaterialIcons name="trending-up" size={24} color="#3B82F6" />
          <Text style={styles.analyticsNumber}>92%</Text>
          <Text style={styles.analyticsLabel}>Resolution Rate</Text>
        </View>
      </View>

      <View style={styles.trendsSection}>
        <Text style={styles.sectionSubtitle}>Report Trends</Text>
        <View style={styles.trendItem}>
          <Text style={styles.trendLabel}>Harassment Reports</Text>
          <View style={styles.trendBar}>
            <View style={[styles.trendFill, { width: '65%', backgroundColor: '#EF4444' }]} />
          </View>
          <Text style={styles.trendPercent}>+15%</Text>
        </View>
        
        <View style={styles.trendItem}>
          <Text style={styles.trendLabel}>Spam Reports</Text>
          <View style={styles.trendBar}>
            <View style={[styles.trendFill, { width: '45%', backgroundColor: '#F59E0B' }]} />
          </View>
          <Text style={styles.trendPercent}>-8%</Text>
        </View>
        
        <View style={styles.trendItem}>
          <Text style={styles.trendLabel}>Misinformation</Text>
          <View style={styles.trendBar}>
            <View style={[styles.trendFill, { width: '30%', backgroundColor: '#8B5CF6' }]} />
          </View>
          <Text style={styles.trendPercent}>+22%</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderSettingsTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Moderation Settings</Text>
      
      <View style={styles.settingsSection}>
        <Text style={styles.settingsSubtitle}>Auto-Moderation</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>AI Content Filter</Text>
            <Text style={styles.settingDescription}>Automatically flag inappropriate content</Text>
          </View>
          <View style={styles.settingToggle}>
            <Text style={styles.toggleLabel}>Enabled</Text>
          </View>
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Spam Detection</Text>
            <Text style={styles.settingDescription}>Auto-detect and limit spam content</Text>
          </View>
          <View style={styles.settingToggle}>
            <Text style={styles.toggleLabel}>Enabled</Text>
          </View>
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Profanity Filter</Text>
            <Text style={styles.settingDescription}>Block posts with offensive language</Text>
          </View>
          <View style={styles.settingToggle}>
            <Text style={styles.toggleLabel}>Strict</Text>
          </View>
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.settingsSubtitle}>Community Guidelines</Text>
        
        <TouchableOpacity style={styles.guidelineItem}>
          <MaterialIcons name="edit" size={20} color="#3B82F6" />
          <Text style={styles.guidelineText}>Edit Community Rules</Text>
          <MaterialIcons name="arrow-forward-ios" size={16} color="#9CA3AF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.guidelineItem}>
          <MaterialIcons name="policy" size={20} color="#3B82F6" />
          <Text style={styles.guidelineText}>Update Terms of Service</Text>
          <MaterialIcons name="arrow-forward-ios" size={16} color="#9CA3AF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.guidelineItem}>
          <MaterialIcons name="security" size={20} color="#3B82F6" />
          <Text style={styles.guidelineText}>Privacy Settings</Text>
          <MaterialIcons name="arrow-forward-ios" size={16} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#DC2626';
      case 'high': return '#F59E0B';
      case 'medium': return '#10B981';
      case 'low': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'reviewed': return '#3B82F6';
      case 'resolved': return '#10B981';
      case 'dismissed': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'warning': return 'warning';
      case 'suspension': return 'pause-circle-outline';
      case 'ban': return 'block';
      case 'content_removal': return 'delete';
      case 'content_flag': return 'flag';
      default: return 'gavel';
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'warning': return '#F59E0B';
      case 'suspension': return '#8B5CF6';
      case 'ban': return '#DC2626';
      case 'content_removal': return '#EF4444';
      case 'content_flag': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  if (userRole === 'user') {
    console.log('ModerationDashboard: User role is user, not rendering');
    return null; // Non-moderators can't access this
  }

  console.log('ModerationDashboard rendering, visible:', visible, 'userRole:', userRole);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Moderation Dashboard</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'reports' && styles.tabActive]}
            onPress={() => setActiveTab('reports')}
          >
            <MaterialIcons name="report" size={20} color={activeTab === 'reports' ? '#3B82F6' : '#9CA3AF'} />
            <Text style={[styles.tabText, activeTab === 'reports' && styles.tabTextActive]}>Reports</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'ai-moderation' && styles.tabActive]}
            onPress={() => setActiveTab('ai-moderation')}
          >
            <MaterialIcons name="psychology" size={20} color={activeTab === 'ai-moderation' ? '#3B82F6' : '#9CA3AF'} />
            <Text style={[styles.tabText, activeTab === 'ai-moderation' && styles.tabTextActive]}>AI Auto-Mod</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'actions' && styles.tabActive]}
            onPress={() => setActiveTab('actions')}
          >
            <MaterialIcons name="history" size={20} color={activeTab === 'actions' ? '#3B82F6' : '#9CA3AF'} />
            <Text style={[styles.tabText, activeTab === 'actions' && styles.tabTextActive]}>Human Actions</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'analytics' && styles.tabActive]}
            onPress={() => setActiveTab('analytics')}
          >
            <MaterialIcons name="analytics" size={20} color={activeTab === 'analytics' ? '#3B82F6' : '#9CA3AF'} />
            <Text style={[styles.tabText, activeTab === 'analytics' && styles.tabTextActive]}>Analytics</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'settings' && styles.tabActive]}
            onPress={() => setActiveTab('settings')}
          >
            <MaterialIcons name="settings" size={20} color={activeTab === 'settings' ? '#3B82F6' : '#9CA3AF'} />
            <Text style={[styles.tabText, activeTab === 'settings' && styles.tabTextActive]}>Settings</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'reports' && renderReportsTab()}
        {activeTab === 'ai-moderation' && renderAiModerationTab()}
        {activeTab === 'actions' && renderActionsTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
        {activeTab === 'settings' && renderSettingsTab()}

        {/* Action Modal */}
        <Modal visible={showActionModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.actionModal}>
              <Text style={styles.modalTitle}>Take Moderation Action</Text>
              
              <Text style={styles.modalLabel}>Action Type</Text>
              <View style={styles.actionTypeGrid}>
                <TouchableOpacity 
                  style={[styles.actionTypeChip, actionType === 'warning' && styles.actionTypeChipActive]}
                  onPress={() => setActionType('warning')}
                >
                  <Text style={[styles.actionTypeText, actionType === 'warning' && styles.actionTypeTextActive]}>Warning</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionTypeChip, actionType === 'suspension' && styles.actionTypeChipActive]}
                  onPress={() => setActionType('suspension')}
                >
                  <Text style={[styles.actionTypeText, actionType === 'suspension' && styles.actionTypeTextActive]}>Suspension</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionTypeChip, actionType === 'ban' && styles.actionTypeChipActive]}
                  onPress={() => setActionType('ban')}
                >
                  <Text style={[styles.actionTypeText, actionType === 'ban' && styles.actionTypeTextActive]}>Ban</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionTypeChip, actionType === 'content_removal' && styles.actionTypeChipActive]}
                  onPress={() => setActionType('content_removal')}
                >
                  <Text style={[styles.actionTypeText, actionType === 'content_removal' && styles.actionTypeTextActive]}>Remove Content</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.modalLabel}>Reason</Text>
              <TextInput
                style={styles.reasonInput}
                value={actionReason}
                onChangeText={setActionReason}
                placeholder="Enter reason for this action..."
                multiline
                numberOfLines={3}
              />

              {(actionType === 'suspension' || actionType === 'ban') && (
                <>
                  <Text style={styles.modalLabel}>Duration</Text>
                  <TextInput
                    style={styles.durationInput}
                    value={actionDuration}
                    onChangeText={setActionDuration}
                    placeholder="e.g., 7 days, 30 days, permanent"
                  />
                </>
              )}

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.modalCancelBtn}
                  onPress={() => setShowActionModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modalConfirmBtn}
                  onPress={executeAction}
                >
                  <Text style={styles.modalConfirmText}>Execute Action</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  tabTextActive: {
    color: '#3B82F6',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  
  // AI Moderation Styles
  aiModerationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aiHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  aiHeaderText: {
    marginLeft: 12,
  },
  aiModerationTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 4,
  },
  aiStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  aiStatusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A5568',
  },
  aiToggleButton: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  
  aiMetricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  aiMetricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  aiMetricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
    marginTop: 8,
  },
  aiMetricLabel: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
    marginTop: 4,
  },
  
  aiConfigSection: {
    marginBottom: 24,
  },
  configCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  configHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  configTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginLeft: 8,
  },
  configDesc: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 16,
    lineHeight: 20,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#718096',
    width: 80,
  },
  sliderTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginHorizontal: 12,
    position: 'relative',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 16,
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  thresholdValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
    textAlign: 'center',
  },
  
  autoActionsList: {
    gap: 12,
  },
  autoActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    padding: 12,
    borderRadius: 8,
  },
  autoActionText: {
    flex: 1,
    fontSize: 14,
    color: '#4A5568',
    marginLeft: 8,
  },
  autoActionStatus: {
    marginLeft: 8,
  },
  
  aiActivitySection: {
    marginBottom: 24,
  },
  activityFeed: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F7FAFC',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F7FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 2,
  },
  activityDesc: {
    fontSize: 12,
    color: '#718096',
  },
  reviewButton: {
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  reviewButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  
  comparisonSection: {
    marginBottom: 24,
  },
  comparisonGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  comparisonCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  comparisonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  comparisonTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginLeft: 8,
  },
  comparisonStats: {
    gap: 12,
  },
  comparisonStat: {
    alignItems: 'center',
  },
  comparisonValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
  },
  comparisonLabel: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
  },
  
  trainingSection: {
    marginBottom: 24,
  },
  trainingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  trainingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  trainingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginLeft: 8,
  },
  trainingMetrics: {
    gap: 12,
    marginBottom: 16,
  },
  trainingMetric: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F7FAFC',
  },
  trainingMetricLabel: {
    fontSize: 14,
    color: '#4A5568',
  },
  trainingMetricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },
  retrainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBF8FF',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  retrainButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
    marginLeft: 4,
  },
  
  // Existing styles continued...
  filtersContainer: {
    marginBottom: 16,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  filterChipActive: {
    backgroundColor: '#EBF5FF',
    borderColor: '#3B82F6',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#3B82F6',
  },
  reportsList: {
    flex: 1,
  },
  reportCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reportInfo: {
    flexDirection: 'row',
    gap: 8,
  },
  reportType: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  severityText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase',
  },
  reportTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  reportDetails: {
    marginBottom: 12,
  },
  reportReason: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  reportUsers: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  username: {
    fontWeight: '600',
    color: '#3B82F6',
  },
  reportDescription: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 6,
    lineHeight: 18,
  },
  contentPreview: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
  },
  contentLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  contentText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  reportActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  actionBtnPrimary: {
    backgroundColor: '#DC2626',
  },
  actionBtnSecondary: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionType: {
    fontSize: 14,
    fontWeight: '700',
  },
  actionTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  actionTarget: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 2,
  },
  actionContent: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 2,
  },
  actionReason: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 2,
  },
  actionDuration: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 2,
  },
  actionModerator: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  analyticsCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  analyticsNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  analyticsLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  trendsSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  trendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  trendLabel: {
    width: 120,
    fontSize: 13,
    color: '#4B5563',
  },
  trendBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 12,
  },
  trendFill: {
    height: '100%',
    borderRadius: 4,
  },
  trendPercent: {
    width: 40,
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    textAlign: 'right',
  },
  settingsSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingsSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  settingToggle: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  toggleLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  guidelineText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  actionModal: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  actionTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionTypeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  actionTypeChipActive: {
    backgroundColor: '#EBF5FF',
    borderColor: '#3B82F6',
  },
  actionTypeText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  actionTypeTextActive: {
    color: '#3B82F6',
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    height: 80,
  },
  durationInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#DC2626',
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
});