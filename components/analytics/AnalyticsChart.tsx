import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const weeklyData = [
  { day: 'Mon', views: 1200, engagement: 340, posts: 15 },
  { day: 'Tue', views: 1580, engagement: 420, posts: 23 },
  { day: 'Wed', views: 2100, engagement: 580, posts: 31 },
  { day: 'Thu', views: 1890, engagement: 490, posts: 27 },
  { day: 'Fri', views: 2450, engagement: 650, posts: 34 },
  { day: 'Sat', views: 1920, engagement: 520, posts: 19 },
  { day: 'Sun', views: 1670, engagement: 380, posts: 22 },
];

export default function AnalyticsChart() {
  const maxViews = Math.max(...weeklyData.map(d => d.views));
  const maxEngagement = Math.max(...weeklyData.map(d => d.engagement));
  
  const chartWidth = width - 80;
  const chartHeight = 120;
  const barWidth = chartWidth / weeklyData.length - 8;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weekly Analytics</Text>
        <View style={styles.fractalHeader}>
          <Text style={styles.headerEmoji}>📊</Text>
          <Text style={styles.headerEmoji}>📈</Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <View style={styles.quickStat}>
          <Text style={styles.statEmoji}>👀</Text>
          <Text style={styles.statValue}>12.8K</Text>
          <Text style={styles.statLabel}>Total Views</Text>
        </View>
        <View style={styles.quickStat}>
          <Text style={styles.statEmoji}>💝</Text>
          <Text style={styles.statValue}>3.4K</Text>
          <Text style={styles.statLabel}>Engagement</Text>
        </View>
        <View style={styles.quickStat}>
          <Text style={styles.statEmoji}>📝</Text>
          <Text style={styles.statValue}>171</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
      </View>

      {/* Mini Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>7-Day Overview</Text>
        
        <View style={styles.chart}>
          {weeklyData.map((data, index) => {
            const viewsHeight = (data.views / maxViews) * chartHeight;
            const engagementHeight = (data.engagement / maxEngagement) * chartHeight;
            
            return (
              <View key={data.day} style={styles.barContainer}>
                <View style={styles.barGroup}>
                  {/* Views Bar */}
                  <View 
                    style={[
                      styles.bar, 
                      styles.viewsBar,
                      { height: viewsHeight }
                    ]} 
                  />
                  {/* Engagement Bar */}
                  <View 
                    style={[
                      styles.bar, 
                      styles.engagementBar,
                      { height: engagementHeight }
                    ]} 
                  />
                </View>
                <Text style={styles.dayLabel}>{data.day}</Text>
                
                {/* Mini fractal for each day */}
                <View style={styles.dayFractal}>
                  {data.posts > 25 && <Text style={styles.dayEmoji}>🔥</Text>}
                  {data.views > 2000 && <Text style={styles.dayEmoji}>⭐</Text>}
                </View>
              </View>
            );
          })}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.viewsColor]} />
            <Text style={styles.legendText}>Views</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.engagementColor]} />
            <Text style={styles.legendText}>Engagement</Text>
          </View>
        </View>
      </View>

      {/* Performance Indicators */}
      <View style={styles.performanceSection}>
        <View style={styles.performanceItem}>
          <View style={styles.performanceFractal}>
            <Text style={styles.performanceEmoji}>📈</Text>
            <Text style={styles.performanceMini}>✨</Text>
          </View>
          <View style={styles.performanceContent}>
            <Text style={styles.performanceValue}>+23%</Text>
            <Text style={styles.performanceLabel}>vs last week</Text>
          </View>
        </View>

        <View style={styles.performanceItem}>
          <View style={styles.performanceFractal}>
            <Text style={styles.performanceEmoji}>🎯</Text>
            <Text style={styles.performanceMini}>💫</Text>
          </View>
          <View style={styles.performanceContent}>
            <Text style={styles.performanceValue}>87%</Text>
            <Text style={styles.performanceLabel}>engagement rate</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#2D3748',
    fontSize: 16,
    fontWeight: '600',
  },
  fractalHeader: {
    flexDirection: 'row',
  },
  headerEmoji: {
    fontSize: 16,
    marginLeft: 4,
    opacity: 0.7,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickStat: {
    alignItems: 'center',
    flex: 1,
  },
  statEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  statValue: {
    color: '#2D3748',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    color: '#718096',
    fontSize: 11,
  },
  chartContainer: {
    marginBottom: 16,
  },
  chartTitle: {
    color: '#4A5568',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'center',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barGroup: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
  },
  bar: {
    width: 8,
    marginHorizontal: 1,
    borderRadius: 4,
  },
  viewsBar: {
    backgroundColor: '#3B82F6',
  },
  engagementBar: {
    backgroundColor: '#10B981',
  },
  dayLabel: {
    color: '#718096',
    fontSize: 10,
    marginTop: 4,
  },
  dayFractal: {
    flexDirection: 'row',
    marginTop: 2,
  },
  dayEmoji: {
    fontSize: 8,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  viewsColor: {
    backgroundColor: '#3B82F6',
  },
  engagementColor: {
    backgroundColor: '#10B981',
  },
  legendText: {
    color: '#718096',
    fontSize: 11,
  },
  performanceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  performanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    padding: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  performanceFractal: {
    position: 'relative',
    marginRight: 8,
  },
  performanceEmoji: {
    fontSize: 16,
  },
  performanceMini: {
    position: 'absolute',
    top: -4,
    right: -4,
    fontSize: 8,
  },
  performanceContent: {
    flex: 1,
  },
  performanceValue: {
    color: '#2D3748',
    fontSize: 14,
    fontWeight: 'bold',
  },
  performanceLabel: {
    color: '#718096',
    fontSize: 10,
  },
});