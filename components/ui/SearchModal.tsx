import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,
  FlatList,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

interface SearchResult {
  id: string;
  type: 'people' | 'news' | 'projects' | 'hashtags';
  title: string;
  subtitle: string;
  avatar?: string;
  verified?: boolean;
  followers?: number;
  onPress: () => void;
}

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SearchModal({ visible, onClose }: SearchModalProps) {
  const { theme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'people' | 'news' | 'projects' | 'hashtags'>('all');

  // Mock search results
  const searchResults: SearchResult[] = [
    {
      id: '1',
      type: 'people',
      title: 'Dr. Sarah Mitchell',
      subtitle: 'Medical Researcher • 245K followers',
      avatar: '👩‍⚕️',
      verified: true,
      followers: 245000,
      onPress: () => Alert.alert('Profile', 'Opening Dr. Sarah Mitchell\'s profile')
    },
    {
      id: '2',
      type: 'people',
      title: 'Alex Chen',
      subtitle: 'AI Engineer • 89K followers',
      avatar: '👨‍💻',
      verified: true,
      followers: 89000,
      onPress: () => Alert.alert('Profile', 'Opening Alex Chen\'s profile')
    },
    {
      id: '3',
      type: 'news',
      title: 'Gene Therapy Breakthrough',
      subtitle: 'Revolutionary treatment restores vision in 47 patients',
      avatar: '🧬',
      onPress: () => Alert.alert('News', 'Opening gene therapy article')
    },
    {
      id: '4',
      type: 'news',
      title: 'Climate Study Results',
      subtitle: 'New research shows promising environmental data',
      avatar: '🌍',
      onPress: () => Alert.alert('News', 'Opening climate study article')
    },
    {
      id: '5',
      type: 'projects',
      title: 'CRISPR Research Project',
      subtitle: 'Gene editing advancement for medical applications',
      avatar: '🔬',
      onPress: () => Alert.alert('Project', 'Opening CRISPR research project')
    },
    {
      id: '6',
      type: 'projects',
      title: 'AI Assistant Development',
      subtitle: 'Advanced coding assistant with 15+ languages',
      avatar: '🤖',
      onPress: () => Alert.alert('Project', 'Opening AI assistant project')
    },
    {
      id: '7',
      type: 'hashtags',
      title: '#AI',
      subtitle: '12.5K posts • Trending in Technology',
      avatar: '🔗',
      onPress: () => Alert.alert('Hashtag', 'Opening #AI posts')
    },
    {
      id: '8',
      type: 'hashtags',
      title: '#Science',
      subtitle: '8.9K posts • Trending in Research',
      avatar: '🔗',
      onPress: () => Alert.alert('Hashtag', 'Opening #Science posts')
    }
  ];

  const tabs = [
    { key: 'all', label: 'All', icon: 'search', count: searchResults.length },
    { key: 'people', label: 'People', icon: 'person', count: searchResults.filter(r => r.type === 'people').length },
    { key: 'news', label: 'News', icon: 'article', count: searchResults.filter(r => r.type === 'news').length },
    { key: 'projects', label: 'Projects', icon: 'work', count: searchResults.filter(r => r.type === 'projects').length },
    { key: 'hashtags', label: 'Tags', icon: 'tag', count: searchResults.filter(r => r.type === 'hashtags').length }
  ];

  const getFilteredResults = () => {
    let filtered = searchResults;
    
    if (selectedTab !== 'all') {
      filtered = filtered.filter(result => result.type === selectedTab);
    }
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(result =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'people': return 'person';
      case 'news': return 'article';
      case 'projects': return 'work';
      case 'hashtags': return 'tag';
      default: return 'search';
    }
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={[styles.resultItem, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}
      onPress={item.onPress}
    >
      <View style={styles.resultAvatar}>
        <Text style={styles.resultAvatarText}>{item.avatar}</Text>
      </View>
      
      <View style={styles.resultContent}>
        <View style={styles.resultHeader}>
          <Text style={[styles.resultTitle, { color: theme.colors.text }]} numberOfLines={1}>
            {item.title}
          </Text>
          {item.verified && (
            <MaterialIcons name="verified" size={16} color="#1DA1F2" />
          )}
          <MaterialIcons 
            name={getTypeIcon(item.type) as any} 
            size={14} 
            color={theme.colors.textSecondary} 
            style={styles.typeIcon}
          />
        </View>
        <Text style={[styles.resultSubtitle, { color: theme.colors.textSecondary }]} numberOfLines={1}>
          {item.subtitle}
        </Text>
      </View>
      
      <MaterialIcons name="chevron-right" size={20} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.headerBackground, borderBottomColor: theme.colors.border }]}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialIcons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Search</Text>
            <View style={styles.headerPlaceholder} />
          </View>
          
          {/* Search Input */}
          <View style={[styles.searchContainer, { backgroundColor: theme.colors.inputBackground }]}>
            <MaterialIcons name="search" size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Search for people, news, projects, tags..."
              placeholderTextColor={theme.colors.placeholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialIcons name="clear" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Tabs */}
        <View style={[styles.tabsContainer, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tab,
                  { backgroundColor: selectedTab === tab.key ? theme.colors.primary : 'transparent' }
                ]}
                onPress={() => setSelectedTab(tab.key as any)}
              >
                <MaterialIcons 
                  name={tab.icon as any} 
                  size={18} 
                  color={selectedTab === tab.key ? 'white' : theme.colors.textSecondary} 
                />
                <Text style={[
                  styles.tabLabel,
                  { color: selectedTab === tab.key ? 'white' : theme.colors.textSecondary }
                ]}>
                  {tab.label}
                </Text>
                <View style={[
                  styles.tabBadge,
                  { backgroundColor: selectedTab === tab.key ? 'rgba(255,255,255,0.2)' : theme.colors.inputBackground }
                ]}>
                  <Text style={[
                    styles.tabBadgeText,
                    { color: selectedTab === tab.key ? 'white' : theme.colors.textSecondary }
                  ]}>
                    {tab.count}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Search Results */}
        <View style={styles.resultsContainer}>
          {getFilteredResults().length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="search-off" size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                {searchQuery.trim() ? 'No results found' : 'Start searching'}
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                {searchQuery.trim() 
                  ? `Try different keywords or browse ${selectedTab === 'all' ? 'all categories' : selectedTab}`
                  : 'Enter keywords to find people, news, projects, and hashtags'
                }
              </Text>
            </View>
          ) : (
            <FlatList
              data={getFilteredResults()}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.resultsList}
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 16,
    borderBottomWidth: 0.5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerPlaceholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  tabsContainer: {
    borderBottomWidth: 0.5,
    paddingVertical: 12,
  },
  tabs: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  typeIcon: {
    marginLeft: 'auto',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsList: {
    padding: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderBottomWidth: 0.5,
    gap: 12,
  },
  resultAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultAvatarText: {
    fontSize: 24,
  },
  resultContent: {
    flex: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  resultSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});