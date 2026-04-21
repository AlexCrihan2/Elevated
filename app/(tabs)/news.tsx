import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  RefreshControl,
  Dimensions,
  Platform,
  TextInput,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { newsApiService } from '../../services/newsApi';
import { useNews } from '../../hooks/useNews';

import { useTheme } from '@/contexts/ThemeContext';
import Animated, { 
  useSharedValue, 
  withTiming, 
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  withSpring,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Country {
  code: string;
  name: string;
  flag: string;
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  source: string;
  author?: string;
  publishedAt: string;
  url: string;
  imageUrl?: string;
  category: string;
  country: string;
  language: string;
  readTime: string;
  verified: boolean;
  priority: 'high' | 'medium' | 'low';
  bias?: 'left' | 'center' | 'right';
  reliability?: 'high' | 'medium' | 'low';
  factCheck?: boolean;
  crossReferences?: number;
  fullContent?: {
    content: string;
    author?: string;
    readTime?: string;
  };
}

const COUNTRIES: Country[] = [
  { code: 'us', name: 'United States', flag: '🇺🇸' },
  { code: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'ca', name: 'Canada', flag: '🇨🇦' },
  { code: 'au', name: 'Australia', flag: '🇦🇺' },
  { code: 'de', name: 'Germany', flag: '🇩🇪' },
  { code: 'fr', name: 'France', flag: '🇫🇷' },
  { code: 'jp', name: 'Japan', flag: '🇯🇵' },
  { code: 'kr', name: 'South Korea', flag: '🇰🇷' },
  { code: 'in', name: 'India', flag: '🇮🇳' },
  { code: 'br', name: 'Brazil', flag: '🇧🇷' },
  { code: 'mx', name: 'Mexico', flag: '🇲🇽' },
  { code: 'ar', name: 'Argentina', flag: '🇦🇷' },
  { code: 'it', name: 'Italy', flag: '🇮🇹' },
  { code: 'es', name: 'Spain', flag: '🇪🇸' },
  { code: 'ru', name: 'Russia', flag: '🇷🇺' },
  { code: 'cn', name: 'China', flag: '🇨🇳' },
  { code: 'ae', name: 'UAE', flag: '🇦🇪' },
  { code: 'pt', name: 'Portugal', flag: '🇵🇹' },
];

const CATEGORIES = [
  { id: 'general', name: 'All News', icon: 'public', color: '#3B82F6' },
  { id: 'breaking', name: 'Breaking', icon: 'new-releases', color: '#EF4444' },
  // Core News Categories
  { id: 'business', name: 'Business', icon: 'business-center', color: '#059669' },
  { id: 'technology', name: 'Technology', icon: 'computer', color: '#7C3AED' },
  { id: 'sports', name: 'Sports', icon: 'sports-soccer', color: '#F59E0B' },
  { id: 'health', name: 'Health', icon: 'local-hospital', color: '#10B981' },
  { id: 'science', name: 'Science', icon: 'science', color: '#6366F1' },
  { id: 'entertainment', name: 'Entertainment', icon: 'movie', color: '#EC4899' },
  { id: 'politics', name: 'Politics', icon: 'account-balance', color: '#1D4ED8' },
  { id: 'education', name: 'Education', icon: 'school', color: '#3B82F6' },
  
  // Extended Trending Categories from Trending Page
  { id: 'environment', name: 'Environment', icon: 'eco', color: '#10B981' },
  { id: 'culture', name: 'Culture', icon: 'palette', color: '#60A5FA' },
  { id: 'travel', name: 'Travel', icon: 'flight', color: '#3B82F6' },
  { id: 'food', name: 'Food & Cooking', icon: 'restaurant', color: '#F59E0B' },
  { id: 'fashion', name: 'Fashion & Style', icon: 'style', color: '#EC4899' },
  { id: 'music', name: 'Music & Audio', icon: 'music-note', color: '#8B5CF6' },
  { id: 'gaming', name: 'Gaming', icon: 'games', color: '#7C3AED' },
  { id: 'lifestyle', name: 'Lifestyle', icon: 'home', color: '#1E40AF' },
  { id: 'automotive', name: 'Automotive', icon: 'directions-car', color: '#2563EB' },
  { id: 'finance', name: 'Finance', icon: 'monetization-on', color: '#059669' },
  { id: 'crypto', name: 'Cryptocurrency', icon: 'currency-bitcoin', color: '#F59E0B' },
  { id: 'nature', name: 'Nature & Wildlife', icon: 'nature', color: '#10B981' },
  { id: 'photography', name: 'Photography', icon: 'photo-camera', color: '#6366F1' },
  { id: 'art', name: 'Art & Design', icon: 'brush', color: '#EC4899' },
  { id: 'fitness', name: 'Fitness & Wellness', icon: 'fitness-center', color: '#8B5CF6' },
  { id: 'parenting', name: 'Parenting & Family', icon: 'child-care', color: '#1E40AF' },
  { id: 'pets', name: 'Pets & Animals', icon: 'pets', color: '#F59E0B' },
  { id: 'startups', name: 'Startups & Innovation', icon: 'lightbulb', color: '#7C3AED' },
  { id: 'weather', name: 'Weather & Climate', icon: 'wb-sunny', color: '#F59E0B' },
  { id: 'social', name: 'Social Issues', icon: 'group', color: '#3B82F6' },
  { id: 'history', name: 'History', icon: 'history-edu', color: '#6366F1' },
  { id: 'language', name: 'Language Learning', icon: 'translate', color: '#10B981' },
  { id: 'books', name: 'Books & Literature', icon: 'menu-book', color: '#8B5CF6' },
  { id: 'diy', name: 'DIY & Crafts', icon: 'build', color: '#F59E0B' },
  { id: 'space', name: 'Space & Astronomy', icon: 'explore', color: '#3B82F6' },
  { id: 'psychology', name: 'Psychology', icon: 'psychology', color: '#EC4899' },
  { id: 'spirituality', name: 'Spirituality', icon: 'self-improvement', color: '#7C3AED' },
  { id: 'comedy', name: 'Comedy & Humor', icon: 'sentiment-very-satisfied', color: '#F59E0B' },
  { id: 'productivity', name: 'Productivity', icon: 'trending-up', color: '#059669' },
  { id: 'relationships', name: 'Relationships', icon: 'favorite', color: '#EC4899' },
  { id: 'career', name: 'Career Development', icon: 'work', color: '#3B82F6' },
  { id: 'real-estate', name: 'Real Estate', icon: 'home-work', color: '#6366F1' },
  { id: 'gardening', name: 'Gardening', icon: 'local-florist', color: '#10B981' },
  { id: 'meditation', name: 'Meditation & Mindfulness', icon: 'spa', color: '#8B5CF6' },
  { id: 'volunteering', name: 'Volunteering', icon: 'volunteer-activism', color: '#F59E0B' },
  { id: 'economics', name: 'Economics', icon: 'trending-up', color: '#059669' },
  { id: 'law', name: 'Law & Legal', icon: 'gavel', color: '#6366F1' },
  { id: 'military', name: 'Military & Defense', icon: 'security', color: '#3B82F6' },
  { id: 'religion', name: 'Religion & Faith', icon: 'church', color: '#7C3AED' },
  { id: 'energy', name: 'Energy & Power', icon: 'bolt', color: '#F59E0B' },
  { id: 'transportation', name: 'Transportation', icon: 'train', color: '#10B981' },
  { id: 'agriculture', name: 'Agriculture', icon: 'agriculture', color: '#10B981' },
  { id: 'mining', name: 'Mining & Resources', icon: 'terrain', color: '#6366F1' },
  { id: 'construction', name: 'Construction', icon: 'construction', color: '#F59E0B' },
  { id: 'manufacturing', name: 'Manufacturing', icon: 'precision-manufacturing', color: '#3B82F6' },
  { id: 'retail', name: 'Retail & Commerce', icon: 'storefront', color: '#EC4899' },
  { id: 'media', name: 'Media & Broadcasting', icon: 'radio', color: '#8B5CF6' }
];

const CREATE_NEWS_TYPES = [
  { 
    id: 'breaking', 
    title: 'Breaking News', 
    subtitle: 'Urgent & Important', 
    icon: 'campaign',
    gradient: ['#EF4444', '#DC2626'],
    description: 'Share breaking news and urgent updates'
  },
  { 
    id: 'tech', 
    title: 'Tech News', 
    subtitle: 'Innovation & Updates', 
    icon: 'computer',
    gradient: ['#7C3AED', '#6D28D9'],
    description: 'Technology trends and developments'
  },
  { 
    id: 'sports', 
    title: 'Sports News', 
    subtitle: 'Live Updates', 
    icon: 'sports',
    gradient: ['#F59E0B', '#D97706'],
    description: 'Sports events and athlete news'
  },
  { 
    id: 'world', 
    title: 'World News', 
    subtitle: 'Global Coverage', 
    icon: 'public',
    gradient: ['#3B82F6', '#2563EB'],
    description: 'International news and events'
  },
  { 
    id: 'article', 
    title: 'Feature Article', 
    subtitle: 'In-Depth Analysis', 
    icon: 'article',
    gradient: ['#10B981', '#059669'],
    description: 'Detailed reports and analysis'
  },
  { 
    id: 'custom', 
    title: 'Custom Story', 
    subtitle: 'Your Perspective', 
    icon: 'edit',
    gradient: ['#8B5CF6', '#7C3AED'],
    description: 'Share your own story or opinion'
  },
];

export default function NewsScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const scrollY = useSharedValue(0);
  
  // State management
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showCreateNewsModal, setShowCreateNewsModal] = useState(false);
  const [showAllCategoriesModal, setShowAllCategoriesModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [aiProcessing, setAiProcessing] = useState<{[key: string]: boolean}>({});
  const [aiAnalysis, setAiAnalysis] = useState<{[key: string]: any}>({});
  const [showRSSModal, setShowRSSModal] = useState(false);
  const [rssUrl, setRssUrl] = useState('');
  const [rssFeeds, setRssFeeds] = useState<NewsItem[]>([]);
  const [loadingRSS, setLoadingRSS] = useState(false);
  
  // News data from hook
  const { news, loading, error, refreshNews } = useNews({
    country: selectedCountry.code.toLowerCase(),
    category: selectedCategory === 'general' ? undefined : selectedCategory
  });
  
  // Animation values
  const headerScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);
  
  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 100],
      [0, -20],
      Extrapolate.CLAMP
    );
    
    const scale = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0.95],
      Extrapolate.CLAMP
    );
    
    return {
      transform: [{ translateY }, { scale }],
      opacity: interpolate(scrollY.value, [0, 100], [1, 0.9], Extrapolate.CLAMP),
    };
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshNews();
    setRefreshing(false);
  }, [refreshNews]);

  const openArticle = (article: NewsItem) => {
    setSelectedArticle({
      ...article,
      fullContent: {
        content: article.summary || 'Full article content would be loaded here with additional details, quotes, and comprehensive coverage of the story.',
        author: article.source,
        readTime: article.readTime
      }
    });
  };

  const handleCreateNews = (type: string) => {
    setShowCreateNewsModal(false);
    // AI-powered news creation with automatic routing
    Alert.alert('AI News Creator', `🤖 AI is creating and routing your ${type} news story:\n\n• AI Content Generation\n• Smart Category Detection\n• Audience Targeting\n• SEO Optimization\n• Fact Checking\n• Auto-Publishing to optimal channels`);
  };

  // AI Processing Functions
  const processWithAI = async (article: NewsItem) => {
    const articleId = article.id;
    setAiProcessing(prev => ({ ...prev, [articleId]: true }));
    
    // Simulate AI processing
    setTimeout(() => {
      const analysis = {
        sentiment: ['Positive', 'Neutral', 'Negative'][Math.floor(Math.random() * 3)],
        credibilityScore: Math.floor(Math.random() * 40) + 60, // 60-100%
        keywords: ['Breaking', 'Technology', 'Innovation', 'Global', 'Impact'],
        aiSummary: `AI Analysis: This article discusses ${article.category} developments with ${['high', 'medium', 'low'][Math.floor(Math.random() * 3)]} impact potential. Key insights extracted automatically.`,
        suggestedActions: ['Share', 'Bookmark', 'Translate', 'Fact-check'],
        routingRecommendation: {
          channels: ['Social Media', 'Email Newsletter', 'Push Notification'],
          timing: 'Optimal posting time: Peak hours detected',
          audience: 'Target audience: Tech enthusiasts, News followers'
        }
      };
      
      setAiAnalysis(prev => ({ ...prev, [articleId]: analysis }));
      setAiProcessing(prev => ({ ...prev, [articleId]: false }));
    }, 2000);
  };

  const routeWithAI = (article: NewsItem) => {
    const channels = ['📱 Social Media', '📧 Email Newsletter', '🔔 Push Notifications', '📺 Video Platform', '📰 News Feed', '🎯 Targeted Ads'];
    const selectedChannels = channels.slice(0, Math.floor(Math.random() * 3) + 2);
    
    Alert.alert(
      '🤖 AI Smart Routing',
      `AI has analyzed this ${article.category} post and recommends publishing to:\n\n${selectedChannels.join('\n')}\n\n📊 Predicted reach: ${Math.floor(Math.random() * 50000) + 10000} users\n🎯 Engagement score: ${Math.floor(Math.random() * 30) + 70}%\n⏰ Best time: ${Math.floor(Math.random() * 12) + 1}:00 ${Math.random() > 0.5 ? 'PM' : 'AM'}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Route Now', onPress: () => Alert.alert('Success', '🚀 Post routed to all recommended channels!') }
      ]
    );
  };

  // RSS Feed Functions
  const parseRSSFeed = async (url: string): Promise<NewsItem[]> => {
    try {
      // Simple RSS parsing - in production you'd use a proper RSS parser
      const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      if (data.status !== 'ok') {
        throw new Error('Failed to parse RSS feed');
      }
      
      return data.items.map((item: any, index: number) => ({
        id: `rss-${Date.now()}-${index}`,
        title: item.title,
        summary: item.description?.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
        content: item.content,
        source: data.feed?.title || 'RSS Feed',
        author: item.author || data.feed?.title,
        publishedAt: item.pubDate,
        url: item.link,
        imageUrl: item.thumbnail,
        category: 'rss',
        country: selectedCountry.code,
        language: 'en',
        readTime: '2 min read',
        verified: false,
        priority: 'medium' as const,
        bias: 'center' as const,
        reliability: 'medium' as const,
        factCheck: false,
        crossReferences: 0
      }));
    } catch (error) {
      console.error('RSS parsing error:', error);
      throw error;
    }
  };
  
  const loadRSSFeed = async () => {
    if (!rssUrl.trim()) {
      Alert.alert('Error', 'Please enter a valid RSS URL');
      return;
    }
    
    setLoadingRSS(true);
    try {
      const feedItems = await parseRSSFeed(rssUrl);
      setRssFeeds(prev => [...feedItems, ...prev]);
      setRssUrl('');
      setShowRSSModal(false);
      Alert.alert('Success', `Added ${feedItems.length} items from RSS feed!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to load RSS feed. Please check the URL and try again.');
    } finally {
      setLoadingRSS(false);
    }
  };
  
  const addQuickRSSFeed = (url: string, name: string) => {
    setRssUrl(url);
    loadRSSFeed();
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const filteredNews = [...news, ...rssFeeds].filter(item => 
    selectedCategory === 'general' || item.category === selectedCategory
  );

  // Modern button component
  const ModernButton = ({ 
    title, 
    subtitle, 
    icon, 
    onPress, 
    gradient = ['#3B82F6', '#2563EB'],
    style = {}
  }: {
    title: string;
    subtitle?: string;
    icon: string;
    onPress: () => void;
    gradient?: string[];
    style?: any;
  }) => {
    const scale = useSharedValue(1);
    
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));
    
    const handlePressIn = () => {
      scale.value = withSpring(0.96);
    };
    
    const handlePressOut = () => {
      scale.value = withSpring(1);
    };
    
    return (
      <Animated.View style={[animatedStyle, style]}>
        <TouchableOpacity
          style={[styles.modernButton, { backgroundColor: gradient[0] }]}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <View style={styles.modernButtonContent}>
            <View style={styles.modernButtonIconContainer}>
              <MaterialIcons name={icon as any} size={24} color="#FFFFFF" />
            </View>
            <View style={styles.modernButtonTextContainer}>
              <Text style={styles.modernButtonTitle}>{title}</Text>
              {subtitle && <Text style={styles.modernButtonSubtitle}>{subtitle}</Text>}
            </View>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#FFFFFF" opacity={0.7} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // News item button component
  const NewsItemButton = ({ item }: { item: NewsItem }) => {
    const scale = useSharedValue(1);
    const isProcessing = aiProcessing[item.id];
    const analysis = aiAnalysis[item.id];
    
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));
    
    const handlePressIn = () => {
      scale.value = withSpring(0.98);
    };
    
    const handlePressOut = () => {
      scale.value = withSpring(1);
    };
    
    return (
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          style={[
            styles.newsItemButton, 
            { 
              backgroundColor: isDark ? '#374151' : '#FFFFFF',
              borderColor: isDark ? '#4B5563' : '#F3F4F6'
            }
          ]}
          onPress={() => openArticle(item)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <View style={styles.newsItemContent}>
            {/* AI Processing Indicator */}
            {isProcessing && (
              <View style={styles.aiProcessingBanner}>
                <MaterialIcons name="psychology" size={16} color="#8B5CF6" />
                <Text style={styles.aiProcessingText}>🤖 AI Analyzing Content...</Text>
                <MaterialIcons name="sync" size={16} color="#8B5CF6" />
              </View>
            )}
            
            {/* AI Analysis Results */}
            {analysis && (
              <View style={styles.aiAnalysisContainer}>
                <View style={styles.aiAnalysisHeader}>
                  <MaterialIcons name="psychology" size={16} color="#8B5CF6" />
                  <Text style={styles.aiAnalysisTitle}>AI Analysis</Text>
                  <View style={[styles.sentimentBadge, { 
                    backgroundColor: analysis.sentiment === 'Positive' ? '#10B981' : 
                                   analysis.sentiment === 'Negative' ? '#EF4444' : '#6B7280'
                  }]}>
                    <Text style={styles.sentimentText}>{analysis.sentiment}</Text>
                  </View>
                </View>
                
                <Text style={styles.aiSummaryText}>{analysis.aiSummary}</Text>
                
                <View style={styles.aiMetricsRow}>
                  <View style={styles.credibilityScore}>
                    <MaterialIcons name="verified" size={14} color="#3B82F6" />
                    <Text style={styles.credibilityText}>Credibility: {analysis.credibilityScore}%</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.routeButton}
                    onPress={() => routeWithAI(item)}
                  >
                    <MaterialIcons name="route" size={14} color="#FFFFFF" />
                    <Text style={styles.routeButtonText}>AI Route</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            
            <View style={styles.newsItemHeader}>
              <View style={styles.newsItemMeta}>
                <Text style={[styles.newsItemSource, { color: theme.colors.primary }]}>{item.source}</Text>
                <View style={styles.newsItemDot} />
                <Text style={[styles.newsItemTime, { color: theme.colors.textSecondary }]}>{formatTimeAgo(item.publishedAt)}</Text>
              </View>
              <View style={styles.headerActions}>
                <View style={[styles.categoryBadge, { backgroundColor: CATEGORIES.find(c => c.id === item.category)?.color || '#6B7280' }]}>
                  <Text style={styles.categoryBadgeText}>{item.category.toUpperCase()}</Text>
                </View>
                {!analysis && (
                  <TouchableOpacity 
                    style={styles.aiAnalyzeButton}
                    onPress={() => processWithAI(item)}
                    disabled={isProcessing}
                  >
                    <MaterialIcons name="psychology" size={16} color={isProcessing ? '#9CA3AF' : '#8B5CF6'} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            
            <Text style={[styles.newsItemTitle, { color: theme.colors.text }]} numberOfLines={2}>
              {item.title}
            </Text>
            
            {item.summary && (
              <Text style={[styles.newsItemDescription, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                {item.summary}
              </Text>
            )}
            
            <View style={styles.newsItemFooter}>
              <View style={styles.newsItemTags}>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
                  <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
                </View>
                {analysis && (
                  <View style={styles.aiProcessedBadge}>
                    <MaterialIcons name="psychology" size={10} color="#FFFFFF" />
                    <Text style={styles.aiProcessedText}>AI ANALYZED</Text>
                  </View>
                )}
              </View>
              <MaterialIcons name="arrow-forward" size={20} color={theme.colors.textSecondary} />
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <Animated.View style={[styles.header, headerAnimatedStyle, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>News Center</Text>
            <View style={styles.headerSubtitleRow}>
              <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
                Live from {selectedCountry.flag} {selectedCountry.name}
              </Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.rssButton, { backgroundColor: '#F59E0B' }]}
              onPress={() => setShowRSSModal(true)}
            >
              <MaterialIcons name="rss-feed" size={18} color="#FFFFFF" />
              <Text style={styles.rssButtonText}>RSS</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.translateButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => Alert.alert('Page Translation', 'Translating entire news page content...')}
            >
              <Text style={styles.translateFlag}>🌐</Text>
              <MaterialIcons name="translate" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.countryButton, { backgroundColor: theme.colors.surface }]}
              onPress={() => setShowCountryModal(true)}
            >
              <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
              <MaterialIcons name="expand-more" size={20} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        onScroll={(event) => {
          scrollY.value = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        {/* Create News Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <MaterialIcons name="add-circle" size={20} color="#3B82F6" />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Create News</Text>
            </View>
            <TouchableOpacity onPress={() => setShowCreateNewsModal(true)}>
              <Text style={[styles.sectionAction, { color: theme.colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.createNewsScroll}>
            {CREATE_NEWS_TYPES.slice(0, 4).map((type) => (
              <ModernButton
                key={type.id}
                title={type.title}
                subtitle={type.subtitle}
                icon={type.icon}
                gradient={type.gradient}
                onPress={() => handleCreateNews(type.id)}
                style={styles.createNewsButton}
              />
            ))}
          </ScrollView>
        </View>

        {/* Categories Section - Enhanced Grid Layout */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <MaterialIcons name="category" size={20} color="#3B82F6" />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Categories ({CATEGORIES.length})</Text>
            </View>
            <TouchableOpacity onPress={() => Alert.alert('Categories', `Showing all ${CATEGORIES.length} news categories from trending topics`)}>
              <Text style={[styles.sectionAction, { color: theme.colors.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesHorizontalScroll}>
            <View style={styles.categoriesGrid}>
              {CATEGORIES.slice(0, 12).map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    { backgroundColor: theme.colors.surface },
                    selectedCategory === category.id && { 
                      backgroundColor: category.color,
                      transform: [{ scale: 1.02 }]
                    }
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <MaterialIcons 
                    name={category.icon as any} 
                    size={18} 
                    color={selectedCategory === category.id ? '#FFFFFF' : category.color} 
                  />
                  <Text style={[
                    styles.categoryButtonText,
                    { color: theme.colors.text },
                    selectedCategory === category.id && { color: '#FFFFFF' }
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          
          {/* Show More Categories Button */}
          <TouchableOpacity 
            style={[styles.showMoreButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            onPress={() => setShowAllCategoriesModal(true)}
          >
            <MaterialIcons name="apps" size={20} color={theme.colors.primary} />
            <Text style={[styles.showMoreText, { color: theme.colors.primary }]}>
              Show All {CATEGORIES.length} Categories
            </Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* News Feed Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <MaterialIcons name="psychology" size={20} color="#8B5CF6" />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>AI News Hub</Text>
            </View>
            <TouchableOpacity onPress={() => Alert.alert('AI Features', '🤖 AI analyzes every post for:\n\n• Sentiment Analysis\n• Credibility Scoring\n• Smart Routing\n• Content Optimization\n• Audience Targeting\n• Performance Prediction')}>
              <Text style={[styles.sectionAction, { color: '#8B5CF6' }]}>AI Features</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <MaterialIcons name="sync" size={32} color={theme.colors.primary} />
              <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
                Loading latest news...
              </Text>
            </View>
          ) : filteredNews.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="article" size={48} color={theme.colors.textSecondary} opacity={0.5} />
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                No news available for this category
              </Text>
            </View>
          ) : (
            <View style={styles.newsList}>
              {filteredNews.map((item, index) => (
                <NewsItemButton key={`${item.id}-${index}`} item={item} />
              ))}
            </View>
          )}
        </View>
      </Animated.ScrollView>

      {/* Country Selection Modal */}
      <Modal
        visible={showCountryModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCountryModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
            <TouchableOpacity onPress={() => setShowCountryModal(false)}>
              <MaterialIcons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Select Country</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <ScrollView style={styles.countriesScroll}>
            {COUNTRIES.map((country) => (
              <TouchableOpacity
                key={country.code}
                style={[
                  styles.countryOption,
                  { backgroundColor: theme.colors.surface },
                  selectedCountry.code === country.code && { backgroundColor: theme.colors.primary + '20' }
                ]}
                onPress={() => {
                  setSelectedCountry(country);
                  setShowCountryModal(false);
                }}
              >
                <Text style={styles.countryOptionFlag}>{country.flag}</Text>
                <Text style={[styles.countryOptionName, { color: theme.colors.text }]}>
                  {country.name}
                </Text>
                {selectedCountry.code === country.code && (
                  <MaterialIcons name="check" size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* RSS Modal */}
      <Modal
        visible={showRSSModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowRSSModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
            <TouchableOpacity onPress={() => setShowRSSModal(false)}>
              <MaterialIcons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Add RSS Feed</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <ScrollView style={styles.rssModalScroll}>
            {/* RSS URL Input */}
            <View style={styles.rssInputSection}>
              <Text style={[styles.rssSectionTitle, { color: theme.colors.text }]}>Enter RSS URL</Text>
              <View style={[styles.rssInputContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <MaterialIcons name="rss-feed" size={20} color={theme.colors.primary} />
                <TextInput
                  style={[styles.rssInput, { color: theme.colors.text }]}
                  placeholder="https://example.com/feed.xml"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={rssUrl}
                  onChangeText={setRssUrl}
                  autoCapitalize="none"
                  keyboardType="url"
                />
              </View>
              <TouchableOpacity 
                style={[styles.addRssButton, { backgroundColor: theme.colors.primary }]}
                onPress={loadRSSFeed}
                disabled={loadingRSS}
              >
                {loadingRSS ? (
                  <MaterialIcons name="sync" size={20} color="#FFFFFF" />
                ) : (
                  <MaterialIcons name="add" size={20} color="#FFFFFF" />
                )}
                <Text style={styles.addRssButtonText}>
                  {loadingRSS ? 'Loading...' : 'Add RSS Feed'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Quick RSS Feeds */}
            <View style={styles.quickRssSection}>
              <Text style={[styles.rssSectionTitle, { color: theme.colors.text }]}>Popular RSS Feeds</Text>
              
              {[
                { name: 'BBC News', url: 'http://feeds.bbci.co.uk/news/rss.xml', icon: '🌍' },
                { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', icon: '💻' },
                { name: 'Reuters', url: 'https://www.reutersagency.com/feed/?taxonomy=best-regions&post_type=best', icon: '📰' },
                { name: 'Hacker News', url: 'https://hnrss.org/frontpage', icon: '⚡' },
                { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', icon: '🔥' },
                { name: 'Wired', url: 'https://www.wired.com/feed/rss', icon: '🤖' }
              ].map((feed) => (
                <TouchableOpacity
                  key={feed.name}
                  style={[styles.quickRssButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                  onPress={() => addQuickRSSFeed(feed.url, feed.name)}
                >
                  <View style={styles.quickRssButtonContent}>
                    <Text style={styles.quickRssIcon}>{feed.icon}</Text>
                    <View style={styles.quickRssTextContainer}>
                      <Text style={[styles.quickRssName, { color: theme.colors.text }]}>{feed.name}</Text>
                      <Text style={[styles.quickRssUrl, { color: theme.colors.textSecondary }]} numberOfLines={1}>{feed.url}</Text>
                    </View>
                    <MaterialIcons name="add-circle" size={24} color={theme.colors.primary} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            
            {/* RSS Info */}
            <View style={styles.rssInfoSection}>
              <Text style={[styles.rssSectionTitle, { color: theme.colors.text }]}>About RSS</Text>
              <Text style={[styles.rssInfoText, { color: theme.colors.textSecondary }]}>
                RSS (Really Simple Syndication) lets you follow your favorite news sources and blogs in one place. Simply paste any RSS feed URL above or choose from popular feeds.
              </Text>
              <Text style={[styles.rssInfoText, { color: theme.colors.textSecondary }]}>
                📡 Real-time updates{"\n"}
                🔄 Auto-refresh content{"\n"}
                📰 Multiple sources{"\n"}
                🎯 Custom categories
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* All Categories Modal */}
      <Modal
        visible={showAllCategoriesModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAllCategoriesModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
            <TouchableOpacity onPress={() => setShowAllCategoriesModal(false)}>
              <MaterialIcons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>All Categories ({CATEGORIES.length})</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <ScrollView style={styles.allCategoriesScroll}>
            <View style={styles.allCategoriesGrid}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryModalButton,
                    { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                    selectedCategory === category.id && { 
                      backgroundColor: category.color,
                      borderColor: category.color
                    }
                  ]}
                  onPress={() => {
                    setSelectedCategory(category.id);
                    setShowAllCategoriesModal(false);
                  }}
                >
                  <View style={[
                    styles.categoryModalIconContainer,
                    { backgroundColor: selectedCategory === category.id ? 'rgba(255,255,255,0.2)' : category.color + '20' }
                  ]}>
                    <MaterialIcons 
                      name={category.icon as any} 
                      size={24} 
                      color={selectedCategory === category.id ? '#FFFFFF' : category.color} 
                    />
                  </View>
                  <View style={styles.categoryModalTextContainer}>
                    <Text style={[
                      styles.categoryModalName,
                      { color: theme.colors.text },
                      selectedCategory === category.id && { color: '#FFFFFF' }
                    ]}>
                      {category.name}
                    </Text>
                    <Text style={[
                      styles.categoryModalId,
                      { color: theme.colors.textSecondary },
                      selectedCategory === category.id && { color: 'rgba(255,255,255,0.7)' }
                    ]}>
                      #{category.id}
                    </Text>
                  </View>
                  {selectedCategory === category.id && (
                    <MaterialIcons name="check-circle" size={20} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>
      <Modal
        visible={showCreateNewsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreateNewsModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
            <TouchableOpacity onPress={() => setShowCreateNewsModal(false)}>
              <MaterialIcons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Create News</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <ScrollView style={styles.createNewsModalScroll}>
            {CREATE_NEWS_TYPES.map((type) => (
              <ModernButton
                key={type.id}
                title={type.title}
                subtitle={type.description}
                icon={type.icon}
                gradient={type.gradient}
                onPress={() => handleCreateNews(type.id)}
                style={styles.createNewsModalButton}
              />
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Article Modal */}
      <Modal
        visible={!!selectedArticle}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setSelectedArticle(null)}
      >
        {selectedArticle && (
          <View style={[styles.articleModal, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.articleHeader, { paddingTop: insets.top + 10 }]}>
              <TouchableOpacity
                style={styles.articleCloseButton}
                onPress={() => setSelectedArticle(null)}
              >
                <MaterialIcons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
              <Text style={[styles.articleSource, { color: theme.colors.textSecondary }]}>
                {selectedArticle.source}
              </Text>
            </View>
            
            <ScrollView style={styles.articleContent}>
              <Text style={[styles.articleTitle, { color: theme.colors.text }]}>
                {selectedArticle.title}
              </Text>
              
              <Text style={[styles.articleText, { color: theme.colors.textSecondary }]}>
                {selectedArticle.fullContent?.content}
              </Text>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  rssButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  rssButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  translateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  translateFlag: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  countryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  countryFlag: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: '600',
  },
  createNewsScroll: {
    paddingLeft: 20,
  },
  createNewsButton: {
    marginRight: 12,
    width: SCREEN_WIDTH * 0.7,
  },
  modernButton: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  modernButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modernButtonIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modernButtonTextContainer: {
    flex: 1,
  },
  modernButtonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modernButtonSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  categoriesHorizontalScroll: {
    paddingLeft: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 20,
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: '600',
  },
  allCategoriesScroll: {
    flex: 1,
    padding: 20,
  },
  allCategoriesGrid: {
    gap: 12,
  },
  categoryModalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 2,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryModalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryModalTextContainer: {
    flex: 1,
  },
  categoryModalName: {
    fontSize: 16,
    fontWeight: '700',
  },
  categoryModalId: {
    fontSize: 12,
    marginTop: 2,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    minWidth: 120,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  newsCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  newsList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  newsItemButton: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  newsItemContent: {
    gap: 8,
  },
  newsItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  newsItemSource: {
    fontSize: 12,
    fontWeight: '600',
  },
  newsItemDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#9CA3AF',
  },
  newsItemTime: {
    fontSize: 12,
  },
  categoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  newsItemTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  newsItemDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  newsItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  newsItemTags: {
    flexDirection: 'row',
    gap: 6,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // AI Analysis Styles
  aiProcessingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3E8FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  aiProcessingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  aiAnalysisContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#8B5CF6',
  },
  aiAnalysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  aiAnalysisTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B5CF6',
    flex: 1,
  },
  sentimentBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  sentimentText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  aiSummaryText: {
    fontSize: 11,
    color: '#4B5563',
    lineHeight: 16,
    marginBottom: 8,
  },
  aiMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  credibilityScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  credibilityText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3B82F6',
  },
  routeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  routeButtonText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  aiAnalyzeButton: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#F3E8FF',
  },
  aiProcessedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  aiProcessedText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  // RSS Styles
  rssModalScroll: {
    flex: 1,
    padding: 20,
  },
  rssInputSection: {
    marginBottom: 24,
  },
  rssSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  rssInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    gap: 12,
  },
  rssInput: {
    flex: 1,
    fontSize: 14,
  },
  addRssButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  addRssButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  quickRssSection: {
    marginBottom: 24,
  },
  quickRssButton: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    padding: 12,
  },
  quickRssButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quickRssIcon: {
    fontSize: 24,
  },
  quickRssTextContainer: {
    flex: 1,
  },
  quickRssName: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickRssUrl: {
    fontSize: 12,
    marginTop: 2,
  },
  rssInfoSection: {
    marginBottom: 24,
  },
  rssInfoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  countriesScroll: {
    flex: 1,
    padding: 20,
  },
  countryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  countryOptionFlag: {
    fontSize: 24,
  },
  countryOptionName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  createNewsModalScroll: {
    flex: 1,
    padding: 20,
  },
  createNewsModalButton: {
    marginBottom: 12,
    width: '100%',
  },
  articleModal: {
    flex: 1,
  },
  articleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  articleCloseButton: {
    padding: 4,
  },
  articleSource: {
    fontSize: 14,
    fontWeight: '600',
  },
  articleContent: {
    flex: 1,
    padding: 20,
  },
  articleTitle: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 32,
    marginBottom: 16,
  },
  articleText: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 16,
  },
});