// Spider Web Analytics - Platform Connection Monitoring
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useConnections } from '@/contexts/ConnectionContext';

const { width } = Dimensions.get('window');

interface SpiderWebAnalyticsProps {
  visible: boolean;
  onClose: () => void;
}

export default function SpiderWebAnalytics({ visible, onClose }: SpiderWebAnalyticsProps) {
  const { 
    platformStats, 
    networkStats, 
    refreshPlatformStats, 
    monitorPlatformActivity,
    analyzeNetworkHealth,
    getConnectionPatterns,
    statsLoading 
  } = useConnections();

  const [selectedTab, setSelectedTab] = useState<'overview' | 'health' | 'patterns' | 'realtime'>('overview');
  const [realtimeData, setRealtimeData] = useState<any>(null);
  const [healthData, setHealthData] = useState<any>(null);
  const [patternData, setPatternData] = useState<any>(null);

  useEffect(() => {
    if (visible) {
      loadAnalyticsData();
      const interval = setInterval(loadRealtimeData, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [visible, selectedTab]);

  const loadAnalyticsData = async () => {
    try {
      await refreshPlatformStats();
      
      if (selectedTab === 'health') {
        const health = await analyzeNetworkHealth();
        setHealthData(health.data);
      } else if (selectedTab === 'patterns') {
        const patterns = await getConnectionPatterns();
        setPatternData(patterns.data);
      } else if (selectedTab === 'realtime') {
        loadRealtimeData();
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const loadRealtimeData = async () => {
    try {
      const { data } = await monitorPlatformActivity();
      setRealtimeData(data);
    } catch (error) {
      console.error('Failed to load realtime data:', error);
    }
  };

  const getHealthColor = (health?: string) => {
    switch (health) {
      case 'excellent': return '#10B981';
      case 'good': return '#3B82F6';
      case 'fair': return '#F59E0B';
      case 'poor': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const renderOverviewTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>🕸️ Platform Spider Web Overview</Text>
      
      {/* Network Health Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="network-check" size={24} color={getHealthColor(platformStats?.networkHealth)} />
          <Text style={styles.cardTitle}>Network Health Status</Text>
        </View>
        <View style={styles.healthIndicator}>
          <Text style={[styles.healthStatus, { color: getHealthColor(platformStats?.networkHealth) }]}>
            {platformStats?.networkHealth?.toUpperCase() || 'CHECKING...'}
          </Text>
          <Text style={styles.healthDescription}>
            {platformStats?.networkHealth === 'excellent' && 'All systems operational, strong connectivity'}
            {platformStats?.networkHealth === 'good' && 'Network performing well, minor optimization opportunities'}
            {platformStats?.networkHealth === 'fair' && 'Some connection issues detected, monitoring closely'}
            {platformStats?.networkHealth === 'poor' && 'Network issues require immediate attention'}
          </Text>
        </View>
      </View>

      {/* Platform Stats */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🌐 Global Platform Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{platformStats?.totalUsers?.toLocaleString() || '0'}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{platformStats?.totalConnections?.toLocaleString() || '0'}</Text>
            <Text style={styles.statLabel}>Total Connections</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{platformStats?.averageConnections?.toFixed(1) || '0'}</Text>
            <Text style={styles.statLabel}>Avg Connections</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{(platformStats?.networkDensity * 100)?.toFixed(2) || '0'}%</Text>
            <Text style={styles.statLabel}>Network Density</Text>
          </View>
        </View>
      </View>

      {/* Top Influencers */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⭐ Platform Influencers</Text>
        {platformStats?.strongestNodes?.map((node, index) => (
          <View key={index} style={styles.influencerItem}>
            <View style={styles.influencerRank}>
              <Text style={styles.rankText}>#{index + 1}</Text>
            </View>
            <View style={styles.influencerInfo}>
              <Text style={styles.influencerName}>{node.userId}</Text>
              <Text style={styles.influencerStats}>
                {node.connections.toLocaleString()} connections • {node.influence}% influence
              </Text>
            </View>
            <View style={[styles.influenceBar, { width: `${node.influence}%` }]} />
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderHealthTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>🏥 Network Health Analysis</Text>
      
      {/* System Health */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>System Health Metrics</Text>
        <View style={styles.healthMetrics}>
          <View style={styles.metricItem}>
            <MaterialIcons name="speed" size={20} color="#10B981" />
            <Text style={styles.metricLabel}>Response Time</Text>
            <Text style={styles.metricValue}>127ms</Text>
          </View>
          <View style={styles.metricItem}>
            <MaterialIcons name="storage" size={20} color="#3B82F6" />
            <Text style={styles.metricLabel}>Database Load</Text>
            <Text style={styles.metricValue}>68%</Text>
          </View>
          <View style={styles.metricItem}>
            <MaterialIcons name="memory" size={20} color="#F59E0B" />
            <Text style={styles.metricLabel}>Memory Usage</Text>
            <Text style={styles.metricValue}>45%</Text>
          </View>
          <View style={styles.metricItem}>
            <MaterialIcons name="network-wifi" size={20} color="#10B981" />
            <Text style={styles.metricLabel}>Network Latency</Text>
            <Text style={styles.metricValue}>23ms</Text>
          </View>
        </View>
      </View>

      {/* Connection Quality */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Connection Quality Distribution</Text>
        <View style={styles.qualityBars}>
          <View style={styles.qualityBar}>
            <Text style={styles.qualityLabel}>Excellent (90-100)</Text>
            <View style={styles.qualityBarContainer}>
              <View style={[styles.qualityBarFill, { width: '78%', backgroundColor: '#10B981' }]} />
            </View>
            <Text style={styles.qualityPercentage}>78%</Text>
          </View>
          <View style={styles.qualityBar}>
            <Text style={styles.qualityLabel}>Good (70-89)</Text>
            <View style={styles.qualityBarContainer}>
              <View style={[styles.qualityBarFill, { width: '15%', backgroundColor: '#3B82F6' }]} />
            </View>
            <Text style={styles.qualityPercentage}>15%</Text>
          </View>
          <View style={styles.qualityBar}>
            <Text style={styles.qualityLabel}>Fair (50-69)</Text>
            <View style={styles.qualityBarContainer}>
              <View style={[styles.qualityBarFill, { width: '5%', backgroundColor: '#F59E0B' }]} />
            </View>
            <Text style={styles.qualityPercentage}>5%</Text>
          </View>
          <View style={styles.qualityBar}>
            <Text style={styles.qualityLabel}>Poor (0-49)</Text>
            <View style={styles.qualityBarContainer}>
              <View style={[styles.qualityBarFill, { width: '2%', backgroundColor: '#EF4444' }]} />
            </View>
            <Text style={styles.qualityPercentage}>2%</Text>
          </View>
        </View>
      </View>

      {/* Issues & Recommendations */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚠️ Issues & Recommendations</Text>
        <View style={styles.issuesList}>
          <View style={styles.issueItem}>
            <MaterialIcons name="warning" size={16} color="#F59E0B" />
            <Text style={styles.issueText}>3 weak connection clusters detected in Asia-Pacific region</Text>
          </View>
          <View style={styles.issueItem}>
            <MaterialIcons name="info" size={16} color="#3B82F6" />
            <Text style={styles.issueText}>Consider adding connection facilitators in low-density areas</Text>
          </View>
          <View style={styles.issueItem}>
            <MaterialIcons name="trending-up" size={16} color="#10B981" />
            <Text style={styles.issueText}>Network growth rate is healthy at +67% monthly</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderPatternsTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>📊 Connection Patterns</Text>
      
      {/* Activity Patterns */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Peak Activity Times</Text>
        <View style={styles.patternsList}>
          {patternData?.mostActiveHours?.map((time: string, index: number) => (
            <View key={index} style={styles.patternItem}>
              <MaterialIcons name="access-time" size={16} color="#3B82F6" />
              <Text style={styles.patternText}>{time}</Text>
              <Text style={styles.patternValue}>High Activity</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Connection Types */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Connection Type Distribution</Text>
        <View style={styles.typeDistribution}>
          {patternData?.popularConnectionTypes && Object.entries(patternData.popularConnectionTypes).map(([type, percentage]) => (
            <View key={type} style={styles.typeItem}>
              <Text style={styles.typeLabel}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
              <View style={styles.typeBarContainer}>
                <View style={[styles.typeBarFill, { width: `${percentage}%` }]} />
              </View>
              <Text style={styles.typePercentage}>{percentage}%</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Geographic Distribution */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🌍 Geographic Distribution</Text>
        <View style={styles.geoDistribution}>
          {patternData?.geographicDistribution && Object.entries(patternData.geographicDistribution).map(([region, percentage]) => (
            <View key={region} style={styles.geoItem}>
              <Text style={styles.geoLabel}>{region}</Text>
              <View style={styles.geoBarContainer}>
                <View style={[styles.geoBarFill, { width: `${percentage}%` }]} />
              </View>
              <Text style={styles.geoPercentage}>{percentage}%</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderRealtimeTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>⚡ Real-time Monitoring</Text>
      
      {/* Live Activity */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="trending-up" size={24} color="#10B981" />
          <Text style={styles.cardTitle}>Live Platform Activity</Text>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>
        <View style={styles.liveStats}>
          <View style={styles.liveStatItem}>
            <Text style={styles.liveStatValue}>{realtimeData?.activeUsers?.toLocaleString() || '0'}</Text>
            <Text style={styles.liveStatLabel}>Active Users</Text>
          </View>
          <View style={styles.liveStatItem}>
            <Text style={styles.liveStatValue}>{realtimeData?.newConnections || '0'}</Text>
            <Text style={styles.liveStatLabel}>New Connections/hr</Text>
          </View>
          <View style={styles.liveStatItem}>
            <Text style={styles.liveStatValue}>{realtimeData?.messagesExchanged?.toLocaleString() || '0'}</Text>
            <Text style={styles.liveStatLabel}>Messages/hr</Text>
          </View>
          <View style={styles.liveStatItem}>
            <Text style={styles.liveStatValue}>{realtimeData?.contentShared || '0'}</Text>
            <Text style={styles.liveStatLabel}>Content Shared/hr</Text>
          </View>
        </View>
      </View>

      {/* System Status */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>System Status</Text>
        <View style={styles.systemStatus}>
          <View style={styles.statusItem}>
            <MaterialIcons 
              name="circle" 
              size={12} 
              color={realtimeData?.systemHealth === 'healthy' ? '#10B981' : '#EF4444'} 
            />
            <Text style={styles.statusLabel}>System Health</Text>
            <Text style={[styles.statusValue, { 
              color: realtimeData?.systemHealth === 'healthy' ? '#10B981' : '#EF4444' 
            }]}>
              {realtimeData?.systemHealth?.toUpperCase() || 'UNKNOWN'}
            </Text>
          </View>
          <View style={styles.statusItem}>
            <MaterialIcons name="memory" size={12} color="#3B82F6" />
            <Text style={styles.statusLabel}>Server Load</Text>
            <Text style={styles.statusValue}>{realtimeData?.serverLoad || '0'}%</Text>
          </View>
        </View>
      </View>

      {/* Connection Activity Feed */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔄 Recent Connection Activity</Text>
        <View style={styles.activityFeed}>
          <View style={styles.activityItem}>
            <MaterialIcons name="person-add" size={16} color="#10B981" />
            <Text style={styles.activityText}>127 new connections in the last 5 minutes</Text>
            <Text style={styles.activityTime}>Now</Text>
          </View>
          <View style={styles.activityItem}>
            <MaterialIcons name="group" size={16} color="#3B82F6" />
            <Text style={styles.activityText}>45 users joined collaborative projects</Text>
            <Text style={styles.activityTime}>2m ago</Text>
          </View>
          <View style={styles.activityItem}>
            <MaterialIcons name="share" size={16} color="#F59E0B" />
            <Text style={styles.activityText}>289 content items shared across network</Text>
            <Text style={styles.activityTime}>5m ago</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🕷️ Spider Web Analytics</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabNavigation}>
          {[
            { key: 'overview', label: 'Overview', icon: 'dashboard' },
            { key: 'health', label: 'Health', icon: 'favorite' },
            { key: 'patterns', label: 'Patterns', icon: 'analytics' },
            { key: 'realtime', label: 'Live', icon: 'live-tv' }
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
        {selectedTab === 'health' && renderHealthTab()}
        {selectedTab === 'patterns' && renderPatternsTab()}
        {selectedTab === 'realtime' && renderRealtimeTab()}
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
  healthIndicator: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  healthStatus: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  healthDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  influencerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  influencerRank: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  influencerInfo: {
    flex: 1,
  },
  influencerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  influencerStats: {
    fontSize: 12,
    color: '#6B7280',
  },
  influenceBar: {
    position: 'absolute',
    bottom: 0,
    left: 42,
    height: 2,
    backgroundColor: '#8B5CF6',
    borderRadius: 1,
  },
  healthMetrics: {
    gap: 12,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  metricLabel: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  qualityBars: {
    gap: 8,
  },
  qualityBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qualityLabel: {
    fontSize: 12,
    color: '#4B5563',
    width: 100,
  },
  qualityBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  qualityBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  qualityPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    width: 30,
  },
  issuesList: {
    gap: 8,
  },
  issueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  issueText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
  },
  patternsList: {
    gap: 8,
  },
  patternItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  patternText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
  },
  patternValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  typeDistribution: {
    gap: 8,
  },
  typeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeLabel: {
    fontSize: 12,
    color: '#4B5563',
    width: 80,
  },
  typeBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  typeBarFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 3,
  },
  typePercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    width: 30,
  },
  geoDistribution: {
    gap: 8,
  },
  geoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  geoLabel: {
    fontSize: 12,
    color: '#4B5563',
    width: 100,
  },
  geoBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  geoBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  geoPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    width: 30,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#EF4444',
  },
  liveStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  liveStatItem: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  liveStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
  },
  liveStatLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  systemStatus: {
    gap: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  activityFeed: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activityText: {
    flex: 1,
    fontSize: 13,
    color: '#4B5563',
  },
  activityTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
});