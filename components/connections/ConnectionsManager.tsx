
// Connections Manager - Spider Web Platform Connections
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useConnections } from '@/contexts/ConnectionContext';
import { Connection } from '@/services/connectionService';

interface ConnectionsManagerProps {
  visible: boolean;
  onClose: () => void;
}

export default function ConnectionsManager({ visible, onClose }: ConnectionsManagerProps) {
  const { 
    userConnections, 
    connectionSuggestions, 
    networkStats,
    createConnection,
    acceptConnection,
    rejectConnection,
    blockConnection,
    searchConnections,
    operationLoading,
    loadConnectionSuggestions
  } = useConnections();

  const [selectedTab, setSelectedTab] = useState<'suggestions' | 'pending' | 'active' | 'search'>('suggestions');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Connection[]>([]);
  const [selectedType, setSelectedType] = useState<Connection['type']>('follow');

  useEffect(() => {
    if (visible) {
      loadConnectionSuggestions();
    }
  }, [visible]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const results = await searchConnections(searchQuery);
      setSearchResults(results);
    } catch (error) {
      Alert.alert('Error', 'Search failed. Please try again.');
    }
  };

  const handleConnect = async (toUserId: string) => {
    try {
      await createConnection(toUserId, selectedType);
      Alert.alert('Success', `${selectedType} request sent!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to send connection request.');
    }
  };

  const handleAccept = async (connectionId: string) => {
    try {
      await acceptConnection(connectionId);
      Alert.alert('Success', 'Connection accepted!');
    } catch (error) {
      Alert.alert('Error', 'Failed to accept connection.');
    }
  };

  const handleReject = async (connectionId: string) => {
    try {
      await rejectConnection(connectionId);
      Alert.alert('Success', 'Connection rejected.');
    } catch (error) {
      Alert.alert('Error', 'Failed to reject connection.');
    }
  };

  const renderConnectionCard = (connection: Connection, showActions: boolean = true) => (
    <View key={connection.id} style={styles.connectionCard}>
      <View style={styles.connectionHeader}>
        <View style={styles.avatarContainer}>
          <MaterialIcons name="person" size={32} color="#8B5CF6" />
          <View style={[styles.typeBadge, { backgroundColor: getTypeColor(connection.type) }]}>
            <Text style={styles.typeBadgeText}>{connection.type[0].toUpperCase()}</Text>
          </View>
        </View>
        <View style={styles.connectionInfo}>
          <Text style={styles.connectionName}>{connection.toUserId}</Text>
          <Text style={styles.connectionType}>{connection.type}</Text>
          {connection.metadata?.mutualConnections && (
            <Text style={styles.mutualConnections}>
              {connection.metadata.mutualConnections} mutual connections
            </Text>
          )}
        </View>
        <View style={styles.connectionStrength}>
          <Text style={styles.strengthValue}>{connection.strength}%</Text>
          <View style={styles.strengthBar}>
            <View style={[styles.strengthFill, { width: `${connection.strength}%` }]} />
          </View>
        </View>
      </View>
      
      {connection.metadata?.sharedInterests && connection.metadata.sharedInterests.length > 0 && (
        <View style={styles.interestsContainer}>
          <Text style={styles.interestsLabel}>Shared interests:</Text>
          <View style={styles.interestsTags}>
            {connection.metadata.sharedInterests.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {showActions && (
        <View style={styles.actionsContainer}>
          {connection.status === 'pending' ? (
            <View style={styles.pendingActions}>
              <TouchableOpacity 
                style={styles.acceptButton} 
                onPress={() => handleAccept(connection.id)}
                disabled={operationLoading}
              >
                <MaterialIcons name="check" size={16} color="white" />
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.rejectButton} 
                onPress={() => handleReject(connection.id)}
                disabled={operationLoading}
              >
                <MaterialIcons name="close" size={16} color="white" />
                <Text style={styles.rejectButtonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          ) : connection.status === 'accepted' ? (
            <View style={styles.acceptedContainer}>
              <MaterialIcons name="check-circle" size={16} color="#10B981" />
              <Text style={styles.acceptedText}>Connected</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.connectButton} 
              onPress={() => handleConnect(connection.toUserId)}
              disabled={operationLoading}
            >
              <MaterialIcons name="person-add" size={16} color="white" />
              <Text style={styles.connectButtonText}>Connect</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  const getTypeColor = (type: Connection['type']) => {
    const colors = {
      follow: '#3B82F6',
      friend: '#10B981',
      collaborate: '#F59E0B',
      mentor: '#8B5CF6',
      student: '#EF4444'
    };
    return colors[type] || '#6B7280';
  };

  const renderSuggestionsTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🎯 Suggested Connections</Text>
        <Text style={styles.sectionSubtitle}>
          Based on your interests and network
        </Text>
      </View>
      
      {connectionSuggestions.map(connection => renderConnectionCard(connection))}
    </ScrollView>
  );

  const renderPendingTab = () => {
    const pendingConnections = userConnections.filter(c => c.status === 'pending');
    
    return (
      <ScrollView style={styles.tabContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>⏳ Pending Requests</Text>
          <Text style={styles.sectionSubtitle}>
            {pendingConnections.length} requests waiting for your response
          </Text>
        </View>
        
        {pendingConnections.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="inbox" size={48} color="#D1D5DB" />
            <Text style={styles.emptyStateText}>No pending requests</Text>
          </View>
        ) : (
          pendingConnections.map(connection => renderConnectionCard(connection))
        )}
      </ScrollView>
    );
  };

  const renderActiveTab = () => {
    const activeConnections = userConnections.filter(c => c.status === 'accepted');
    
    return (
      <ScrollView style={styles.tabContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>✅ Active Connections</Text>
          <Text style={styles.sectionSubtitle}>
            {activeConnections.length} active connections in your network
          </Text>
        </View>

        {/* Network Stats */}
        {networkStats && (
          <View style={styles.networkStatsCard}>
            <Text style={styles.statsTitle}>📊 Your Network Stats</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{networkStats.totalConnections}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{networkStats.networkReach}</Text>
                <Text style={styles.statLabel}>Network Reach</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{networkStats.influenceScore}</Text>
                <Text style={styles.statLabel}>Influence Score</Text>
              </View>
            </View>
          </View>
        )}
        
        {activeConnections.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="people-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyStateText}>No active connections yet</Text>
          </View>
        ) : (
          activeConnections.map(connection => renderConnectionCard(connection, false))
        )}
      </ScrollView>
    );
  };

  const renderSearchTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🔍 Search Connections</Text>
        <Text style={styles.sectionSubtitle}>
          Find and connect with people
        </Text>
      </View>

      {/* Search Form */}
      <View style={styles.searchForm}>
        <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by user ID, interests..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
        </View>

        <View style={styles.connectionTypeSelector}>
          <Text style={styles.selectorLabel}>Connection Type:</Text>
          <View style={styles.typeButtons}>
            {(['follow', 'friend', 'collaborate', 'mentor'] as Connection['type'][]).map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  selectedType === type && styles.selectedTypeButton
                ]}
                onPress={() => setSelectedType(type)}
              >
                <Text style={[
                  styles.typeButtonText,
                  selectedType === type && styles.selectedTypeButtonText
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <MaterialIcons name="search" size={16} color="white" />
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <View style={styles.searchResults}>
          <Text style={styles.resultsTitle}>Search Results ({searchResults.length})</Text>
          {searchResults.map(connection => renderConnectionCard(connection))}
        </View>
      )}
    </ScrollView>
  );

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🕸️ Spider Web Connections</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabNavigation}>
          {[
            { key: 'suggestions', label: 'Suggestions', icon: 'lightbulb' },
            { key: 'pending', label: 'Pending', icon: 'schedule' },
            { key: 'active', label: 'Active', icon: 'check-circle' },
            { key: 'search', label: 'Search', icon: 'search' }
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
        {selectedTab === 'suggestions' && renderSuggestionsTab()}
        {selectedTab === 'pending' && renderPendingTab()}
        {selectedTab === 'active' && renderActiveTab()}
        {selectedTab === 'search' && renderSearchTab()}
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
    fontSize: 11,
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
  sectionHeader: {
    padding: 20,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  connectionCard: {
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
  connectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  typeBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  connectionInfo: {
    flex: 1,
  },
  connectionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  connectionType: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  mutualConnections: {
    fontSize: 11,
    color: '#8B5CF6',
    marginTop: 2,
  },
  connectionStrength: {
    alignItems: 'center',
  },
  strengthValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  strengthBar: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginTop: 2,
  },
  strengthFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
  },
  interestsContainer: {
    marginBottom: 12,
  },
  interestsLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  interestsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  interestTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  interestText: {
    fontSize: 10,
    color: '#4B5563',
  },
  actionsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  pendingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  rejectButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  acceptedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  acceptedText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 12,
  },
  networkStatsCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  searchForm: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
    color: '#1F2937',
  },
  connectionTypeSelector: {
    marginBottom: 16,
  },
  selectorLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  selectedTypeButton: {
    backgroundColor: '#8B5CF6',
  },
  typeButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
    textTransform: 'capitalize',
  },
  selectedTypeButtonText: {
    color: 'white',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  searchResults: {
    marginTop: 16,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginHorizontal: 20,
    marginBottom: 12,
  },
});
