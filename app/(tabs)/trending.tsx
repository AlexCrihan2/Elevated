import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  RefreshControl,
  Alert,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TranslationWidget from '@/components/ui/TranslationWidget';
import { useTheme } from '@/contexts/ThemeContext';

interface TrendingPost {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    location: string;
  };
  content: string;
  timestamp: string;
  category: string;
  country: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  trending: boolean;
  breaking: boolean;
  viral: boolean;
}

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  country: string;
  publishedAt: string;
  category: string;
  trending: boolean;
  breaking: boolean;
}

const COUNTRIES = [
  { code: 'US', name: 'United States', shortName: 'USA' },
  { code: 'UK', name: 'United Kingdom', shortName: 'UK' },
  { code: 'FR', name: 'France', shortName: 'France' },
  { code: 'DE', name: 'Germany', shortName: 'Germany' },
  { code: 'JP', name: 'Japan', shortName: 'Japan' },
  { code: 'BR', name: 'Brazil', shortName: 'Brazil' },
  { code: 'IN', name: 'India', shortName: 'India' },
  { code: 'CN', name: 'China', shortName: 'China' },
  { code: 'RU', name: 'Russia', shortName: 'Russia' },
  { code: 'AU', name: 'Australia', shortName: 'Australia' },
  { code: 'CA', name: 'Canada', shortName: 'Canada' },
  { code: 'IT', name: 'Italy', shortName: 'Italy' },
  { code: 'ES', name: 'Spain', shortName: 'Spain' },
  { code: 'KR', name: 'South Korea', shortName: 'S.Korea' },
];

const TRENDING_CONTENT: TrendingPost[] = [
  {
    id: '1',
    user: {
      name: 'Tech Daily News',
      username: 'techdaily',
      avatar: '👨‍💻',
      verified: true,
      location: 'Stanford Medical Center, CA'
    },
    content: '🚀 BREAKING: Revolutionary AI breakthrough promises to change healthcare forever! New algorithm detects rare diseases with 98% accuracy in early trials. This could save millions of lives worldwide.',
    timestamp: '2h ago',
    category: 'technology',
    country: 'US',
    engagement: { likes: 15420, comments: 892, shares: 2340, views: 89000 },
    trending: true,
    breaking: true,
    viral: false
  },
  {
    id: '2',
    user: {
      name: 'Global Climate News',
      username: 'climatenews',
      avatar: '🌍',
      verified: true,
      location: 'Arctic Research Station, Greenland'
    },
    content: '🌍 URGENT: Climate summit reaches historic agreement on emissions reduction. 195 countries commit to 50% reduction by 2030. This is the action we\'ve been waiting for!',
    timestamp: '4h ago',
    category: 'environment',
    country: 'GLOBAL',
    engagement: { likes: 34890, comments: 2145, shares: 8734, views: 156000 },
    trending: true,
    breaking: true,
    viral: true
  },
  {
    id: '3',
    user: {
      name: 'Space Exploration Daily',
      username: 'spaceexplore',
      avatar: '🚀',
      verified: true,
      location: 'NASA Kennedy Space Center'
    },
    content: '✨ DISCOVERY: James Webb telescope finds potentially habitable exoplanet just 40 light-years away! Water vapor and oxygen detected in atmosphere. Are we alone in the universe?',
    timestamp: '6h ago',
    category: 'science',
    country: 'US',
    engagement: { likes: 67230, comments: 4567, shares: 12890, views: 234000 },
    trending: true,
    breaking: false,
    viral: true
  },
  {
    id: '4',
    user: {
      name: 'France Actualités',
      username: 'francenews',
      avatar: '🇫🇷',
      verified: true,
      location: 'Paris, France'
    },
    content: '🇫🇷 Le gouvernement français annonce un nouveau plan pour l\'énergie renouvelable. Objectif : 100% d\'énergie verte d\'ici 2035. Un tournant historique pour la France!',
    timestamp: '1h ago',
    category: 'politics',
    country: 'FR',
    engagement: { likes: 23450, comments: 1567, shares: 4567, views: 78000 },
    trending: true,
    breaking: true,
    viral: false
  },
  {
    id: '5',
    user: {
      name: '東京テックニュース',
      username: 'tokyotech',
      avatar: '🇯🇵',
      verified: true,
      location: 'Tokyo, Japan'
    },
    content: '🇯🇵 日本の研究者が量子コンピュータの新ブレークスルーを達成！従来の1000倍高速な処理が可能に。世界の技術革新における日本のリーダーシップを証明。',
    timestamp: '3h ago',
    category: 'technology',
    country: 'JP',
    engagement: { likes: 45670, comments: 2890, shares: 8930, views: 123000 },
    trending: true,
    breaking: false,
    viral: true
  },
  {
    id: '6',
    user: {
      name: 'Brasil Esportes',
      username: 'brazilesportes',
      avatar: '🇧🇷',
      verified: true,
      location: 'São Paulo, Brazil'
    },
    content: '🇧🇷 INCRÍVEL! Brasil conquista medalha de ouro nos Jogos Pan-Americanos! Seleção feminina faz história com vitória épica. Todo o país celebra! ⚽🏆',
    timestamp: '30m ago',
    category: 'sports',
    country: 'BR',
    engagement: { likes: 78990, comments: 5670, shares: 15670, views: 189000 },
    trending: true,
    breaking: true,
    viral: true
  },
  {
    id: '7',
    user: {
      name: 'India Tech Updates',
      username: 'indiatech',
      avatar: '🇮🇳',
      verified: true,
      location: 'Bangalore, India'
    },
    content: '🇮🇳 Major breakthrough in renewable energy! Indian scientists develop new solar panel technology with 50% higher efficiency. This could revolutionize clean energy globally.',
    timestamp: '5h ago',
    category: 'technology',
    country: 'IN',
    engagement: { likes: 34560, comments: 2340, shares: 6780, views: 98000 },
    trending: true,
    breaking: false,
    viral: false
  },
  {
    id: '8',
    user: {
      name: 'Deutschland Nachrichten',
      username: 'deutschlandnews',
      avatar: '🇩🇪',
      verified: true,
      location: 'Berlin, Germany'
    },
    content: '🇩🇪 Deutschland führt revolutionäres Bildungssystem ein! KI-gestützte personalisierte Lernprogramme zeigen 300% Verbesserung der Lernergebnisse.',
    timestamp: '7h ago',
    category: 'education',
    country: 'DE',
    engagement: { likes: 29870, comments: 1890, shares: 4560, views: 67000 },
    trending: true,
    breaking: false,
    viral: false
  }
];

export default function TrendingScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  
  // State management
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeFeature, setActiveFeature] = useState<string>('trending-now');
  const [filteredContent, setFilteredContent] = useState<TrendingPost[]>(TRENDING_CONTENT);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [textSize, setTextSize] = useState(16);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [categoriesVisible, setCategoriesVisible] = useState(true);
  const [countriesVisible, setCountriesVisible] = useState(true);
  const [featuresVisible, setFeaturesVisible] = useState(true);

  // Comprehensive categories for trending content - Modern Blue Theme
  const categories = [
    { id: 'all', name: 'All Posts', icon: 'apps', color: '#1E40AF' },
    { id: 'technology', name: 'Technology', icon: 'computer', color: '#2563EB' },
    { id: 'environment', name: 'Environment', icon: 'eco', color: '#3B82F6' },
    { id: 'science', name: 'Science', icon: 'science', color: '#60A5FA' },
    { id: 'politics', name: 'Politics', icon: 'account-balance', color: '#1D4ED8' },
    { id: 'sports', name: 'Sports', icon: 'sports-soccer', color: '#2D7CFC' },
    { id: 'health', name: 'Health', icon: 'local-hospital', color: '#1E3A8A' },
    { id: 'education', name: 'Education', icon: 'school', color: '#3B82F6' },
    { id: 'business', name: 'Business', icon: 'business', color: '#1E40AF' },
    { id: 'entertainment', name: 'Entertainment', icon: 'movie', color: '#2563EB' },
    { id: 'culture', name: 'Culture', icon: 'palette', color: '#60A5FA' },
    { id: 'travel', name: 'Travel', icon: 'flight', color: '#3B82F6' },
    { id: 'food', name: 'Food & Cooking', icon: 'restaurant', color: '#1D4ED8' },
    { id: 'fashion', name: 'Fashion & Style', icon: 'style', color: '#2D7CFC' },
    { id: 'music', name: 'Music & Audio', icon: 'music-note', color: '#1E3A8A' },
    { id: 'gaming', name: 'Gaming', icon: 'games', color: '#3B82F6' },
    { id: 'lifestyle', name: 'Lifestyle', icon: 'home', color: '#1E40AF' },
    { id: 'automotive', name: 'Automotive', icon: 'directions-car', color: '#2563EB' },
    { id: 'finance', name: 'Finance', icon: 'monetization-on', color: '#60A5FA' },
    { id: 'crypto', name: 'Cryptocurrency', icon: 'currency-bitcoin', color: '#3B82F6' },
    { id: 'nature', name: 'Nature & Wildlife', icon: 'nature', color: '#1D4ED8' },
    { id: 'photography', name: 'Photography', icon: 'photo-camera', color: '#2D7CFC' },
    { id: 'art', name: 'Art & Design', icon: 'brush', color: '#1E3A8A' },
    { id: 'fitness', name: 'Fitness & Wellness', icon: 'fitness-center', color: '#3B82F6' },
    { id: 'parenting', name: 'Parenting & Family', icon: 'child-care', color: '#1E40AF' },
    { id: 'pets', name: 'Pets & Animals', icon: 'pets', color: '#2563EB' },
    { id: 'news', name: 'Breaking News', icon: 'newspaper', color: '#60A5FA' },
    { id: 'startups', name: 'Startups & Innovation', icon: 'lightbulb', color: '#3B82F6' },
    { id: 'weather', name: 'Weather & Climate', icon: 'wb-sunny', color: '#1D4ED8' },
    { id: 'social', name: 'Social Issues', icon: 'group', color: '#2D7CFC' },
    { id: 'history', name: 'History', icon: 'history-edu', color: '#1E3A8A' },
    { id: 'language', name: 'Language Learning', icon: 'translate', color: '#3B82F6' },
    { id: 'books', name: 'Books & Literature', icon: 'menu-book', color: '#1E40AF' },
    { id: 'diy', name: 'DIY & Crafts', icon: 'build', color: '#2563EB' },
    { id: 'space', name: 'Space & Astronomy', icon: 'explore', color: '#60A5FA' },
    { id: 'psychology', name: 'Psychology', icon: 'psychology', color: '#3B82F6' },
    { id: 'spirituality', name: 'Spirituality', icon: 'self-improvement', color: '#1D4ED8' },
    { id: 'comedy', name: 'Comedy & Humor', icon: 'sentiment-very-satisfied', color: '#2D7CFC' },
    { id: 'productivity', name: 'Productivity', icon: 'trending-up', color: '#1E3A8A' },
    { id: 'relationships', name: 'Relationships', icon: 'favorite', color: '#3B82F6' },
    { id: 'career', name: 'Career Development', icon: 'work', color: '#1E40AF' },
    { id: 'real-estate', name: 'Real Estate', icon: 'home-work', color: '#2563EB' },
    { id: 'gardening', name: 'Gardening', icon: 'local-florist', color: '#60A5FA' },
    { id: 'meditation', name: 'Meditation & Mindfulness', icon: 'spa', color: '#3B82F6' },
    { id: 'volunteering', name: 'Volunteering', icon: 'volunteer-activism', color: '#1D4ED8' }
  ];

  // Filter content based on selections
  useEffect(() => {
    let content = [...TRENDING_CONTENT];
    
    // Filter by country
    if (selectedCountry !== 'ALL') {
      content = content.filter(post => post.country === selectedCountry);
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      content = content.filter(post => post.category === selectedCategory);
    }
    
    // Filter by feature
    switch (activeFeature) {
      case 'breaking-news':
        content = content.filter(post => post.breaking);
        break;
      case 'viral-content':
        content = content.filter(post => post.viral);
        break;
      case 'trending-now':
        content = content.filter(post => post.trending);
        break;
      case 'tech-news':
        content = content.filter(post => post.category === 'technology');
        break;
      case 'sports-live':
        content = content.filter(post => post.category === 'sports');
        break;
      default:
        break;
    }
    
    setFilteredContent(content);
  }, [selectedCountry, selectedCategory, activeFeature]);

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('Refreshed', 'Content updated with latest trending posts');
    }, 1000);
  };

  // Feature button actions
  const handleFeaturePress = (featureId: string) => {
    setActiveFeature(featureId);
    
    // Show different content based on feature
    switch (featureId) {
      case 'trending-now':
        setSelectedCategory('all');
        break;
      case 'breaking-news':
        setSelectedCategory('all');
        break;
      case 'tech-news':
        setSelectedCategory('technology');
        break;
      case 'sports-live':
        setSelectedCategory('sports');
        break;
      case 'viral-content':
        setSelectedCategory('all');
        break;
    }
  };

  // Quick action handlers
  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'dark-mode':
        Alert.alert('Theme', 'Use the theme toggle in the header to switch themes');
        break;
      case 'text-size':
        const newSize = textSize === 16 ? 18 : textSize === 18 ? 20 : 16;
        setTextSize(newSize);
        Alert.alert('Text Size', `Font size set to ${newSize}px`);
        break;
      case 'refresh-all':
        onRefresh();
        break;
      case 'notifications':
        Alert.alert('Notifications', 'Push notifications enabled for trending content');
        break;
    }
  };

  // Post interactions
  const handleLike = (postId: string) => {
    const newLiked = new Set(likedPosts);
    if (newLiked.has(postId)) {
      newLiked.delete(postId);
    } else {
      newLiked.add(postId);
    }
    setLikedPosts(newLiked);
  };

  const handleBookmark = (postId: string) => {
    const newBookmarks = new Set(bookmarkedPosts);
    if (newBookmarks.has(postId)) {
      newBookmarks.delete(postId);
    } else {
      newBookmarks.add(postId);
    }
    setBookmarkedPosts(newBookmarks);
  };

  const handleShare = (post: TrendingPost) => {
    Alert.alert('Share Post', post.content.substring(0, 100) + '...', [
      { text: 'Copy Link', onPress: () => Alert.alert('Copied', 'Link copied to clipboard') },
      { text: 'Share to Twitter', onPress: () => Alert.alert('Twitter', 'Opening Twitter share') },
      { text: 'Share to Facebook', onPress: () => Alert.alert('Facebook', 'Opening Facebook share') },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  // Format numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Render post item
  const renderPost = ({ item }: { item: TrendingPost }) => (
    <View style={[styles.postCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userAvatar}>{item.user.avatar}</Text>
          <View style={styles.userDetails}>
            <View style={styles.userNameRow}>
              <Text style={[styles.userName, { color: theme.colors.text }]}>{item.user.name}</Text>
              {item.user.verified && <MaterialIcons name="verified" size={16} color="#1DA1F2" />}
            </View>
            <Text style={styles.userLocation}>{item.user.location}</Text>
          </View>
        </View>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>

      {/* Post Badges */}
      <View style={styles.badgeContainer}>
        {item.trending && (
          <View style={[styles.badge, styles.trendingBadge]}>
            <MaterialIcons name="trending-up" size={12} color="#FFFFFF" />
            <Text style={styles.badgeText}>TRENDING</Text>
          </View>
        )}
        {item.breaking && (
          <View style={[styles.badge, styles.breakingBadge]}>
            <MaterialIcons name="notification-important" size={12} color="#FFFFFF" />
            <Text style={styles.badgeText}>BREAKING</Text>
          </View>
        )}
        {item.viral && (
          <View style={[styles.badge, styles.viralBadge]}>
            <MaterialIcons name="local-fire-department" size={12} color="#FFFFFF" />
            <Text style={styles.badgeText}>VIRAL</Text>
          </View>
        )}
      </View>

      {/* Post Content */}
      <Text style={[styles.postContent, { fontSize: textSize, color: theme.colors.text }]}>
        {item.content}
      </Text>

      {/* Engagement Stats */}
      <View style={styles.engagementRow}>
        <View style={styles.engagementStats}>
          <Text style={styles.engagementText}>{formatNumber(item.engagement.likes)} likes</Text>
          <Text style={styles.engagementText}>{formatNumber(item.engagement.comments)} comments</Text>
          <Text style={styles.engagementText}>{formatNumber(item.engagement.shares)} shares</Text>
          <Text style={styles.engagementText}>{formatNumber(item.engagement.views)} views</Text>
        </View>
      </View>

      {/* Translation Widget */}
      <View style={styles.translationContainer}>
        <TranslationWidget 
          text={item.content}
          category={item.category}
          compact={true}
          darkMode={isDark}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleLike(item.id)}
        >
          <MaterialIcons 
            name={likedPosts.has(item.id) ? "thumb-up" : "thumb-up-off-alt"} 
            size={20} 
            color={likedPosts.has(item.id) ? "#1877F2" : "#65676B"} 
          />
          <Text style={[styles.actionText, likedPosts.has(item.id) && styles.actionTextActive]}>Like</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="chat-bubble-outline" size={20} color="#65676B" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleShare(item)}
        >
          <MaterialIcons name="share" size={20} color="#65676B" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleBookmark(item.id)}
        >
          <MaterialIcons 
            name={bookmarkedPosts.has(item.id) ? "bookmark" : "bookmark-border"} 
            size={20} 
            color={bookmarkedPosts.has(item.id) ? "#F59E0B" : "#65676B"} 
          />
          <Text style={[styles.actionText, bookmarkedPosts.has(item.id) && styles.actionTextBookmarked]}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>🌟 Trending Hub</Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
          Discover trending stories from around the world
        </Text>
        <View style={styles.headerStats}>
          <Text style={[styles.statsText, { color: theme.colors.textSecondary }]}>
            {filteredContent.length} trending posts • {selectedCountry === 'ALL' ? 'Global' : selectedCountry}
          </Text>
        </View>
      </View>

      {/* Feature Controls */}
      <View style={[styles.featureControls, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.filterSectionTitle, { color: theme.colors.text }]}>Features</Text>
          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={() => setFeaturesVisible(!featuresVisible)}
          >
            <MaterialIcons 
              name={featuresVisible ? 'expand-less' : 'expand-more'} 
              size={24} 
              color={theme.colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>
        
        {featuresVisible && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { id: 'trending-now', title: 'Trending Now', icon: 'trending-up', color: '#EF4444' },
              { id: 'breaking-news', title: 'Breaking News', icon: 'notification-important', color: '#DC2626' },
              { id: 'viral-content', title: 'Viral Content', icon: 'local-fire-department', color: '#F97316' },
              { id: 'tech-news', title: 'Tech News', icon: 'computer', color: '#8B5CF6' },
              { id: 'sports-live', title: 'Sports Live', icon: 'sports-soccer', color: '#06B6D4' },
            ].map((feature) => (
              <TouchableOpacity
                key={feature.id}
                style={[
                  styles.featureButton,
                  { backgroundColor: feature.color },
                  activeFeature === feature.id && styles.featureButtonActive
                ]}
                onPress={() => handleFeaturePress(feature.id)}
              >
                <MaterialIcons name={feature.icon as any} size={18} color="white" />
                <Text style={styles.featureButtonText}>{feature.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Categories Filter */}
      <View style={[styles.categoryFilter, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <TouchableOpacity 
          style={styles.categoryHeaderButton}
          onPress={() => setCategoriesVisible(!categoriesVisible)}
        >
          <View style={styles.categoryHeaderContent}>
            <View style={styles.categoryBubble}>
              <MaterialIcons name="category" size={18} color="white" />
            </View>
            <Text style={[styles.categoryHeaderText, { color: theme.colors.text }]}>Categories ({categories.length})</Text>
            <MaterialIcons 
              name={categoriesVisible ? 'expand-less' : 'expand-more'} 
              size={24} 
              color={theme.colors.primary} 
            />
          </View>
        </TouchableOpacity>
        
        {categoriesVisible && (
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryBubble,
                  { backgroundColor: selectedCategory === category.id ? category.color : '#EBF4FF' },
                  selectedCategory === category.id && styles.categoryBubbleActive
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <MaterialIcons 
                  name={category.icon as any} 
                  size={12} 
                  color={selectedCategory === category.id ? 'white' : category.color} 
                />
                <Text style={[
                  styles.categoryBubbleText,
                  { color: selectedCategory === category.id ? 'white' : '#1E40AF' }
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Language Filter - Minimal */}
      <View style={[styles.languageFilter, { backgroundColor: theme.colors.inputBackground, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity style={[styles.languageOnlyButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <MaterialIcons name="language" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.languageOnlyText, { color: theme.colors.textSecondary }]}>All Languages</Text>
        </TouchableOpacity>
      </View>

      {/* Country Filter */}
      <View style={[styles.countryFilter, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.filterSectionTitle, { color: theme.colors.text }]}>Countries</Text>
          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={() => setCountriesVisible(!countriesVisible)}
          >
            <MaterialIcons 
              name={countriesVisible ? 'expand-less' : 'expand-more'} 
              size={24} 
              color={theme.colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>
        
        {countriesVisible && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.countryButton,
                { backgroundColor: theme.colors.inputBackground, borderColor: theme.colors.border },
                selectedCountry === 'ALL' && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
              ]}
              onPress={() => setSelectedCountry('ALL')}
            >
              <Text style={[
                styles.countryButtonText,
                { color: theme.colors.textSecondary },
                selectedCountry === 'ALL' && { color: '#FFFFFF' }
              ]}>
                All Countries
              </Text>
            </TouchableOpacity>
            
            {COUNTRIES.map((country) => (
              <TouchableOpacity
                key={country.code}
                style={[
                  styles.countryButton,
                  { backgroundColor: theme.colors.inputBackground, borderColor: theme.colors.border },
                  selectedCountry === country.code && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
                ]}
                onPress={() => setSelectedCountry(country.code)}
              >
                <Text style={[
                  styles.countryButtonText,
                  { color: theme.colors.textSecondary },
                  selectedCountry === country.code && { color: '#FFFFFF' }
                ]}>
                  {country.shortName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Content List */}
      <FlatList
        data={filteredContent}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.contentList}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />

      {/* Footer Stats */}
      <View style={[styles.footer, { backgroundColor: theme.colors.background, borderTopColor: theme.colors.border }]}>
        <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
          📊 {filteredContent.length} posts • 
          💾 {bookmarkedPosts.size} bookmarked • 
          👍 {likedPosts.size} liked
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerDark: {
    backgroundColor: '#0F172A', // Modern dark blue for dark mode
  },
  // Header with consistent styling
  header: {
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
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  headerStats: {
    alignItems: 'center',
  },
  statsText: {
    fontSize: 12,
  },
  // Filter sections with consistent styling
  featureControls: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
  },
  featureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    gap: 4,
  },
  featureButtonActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  featureButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickActions: {
    backgroundColor: '#F0E8D6', // Light beige
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD6C8',
  },
  quickActionsDark: {
    backgroundColor: '#DDD6C8',
    borderBottomColor: '#C8B299',
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginRight: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  quickActionText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  countryFilter: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
  },
  languageFilter: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  languageOnlyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  languageOnlyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  toggleButton: {
    padding: 4,
  },
  categoryFilter: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
  },
  categoryHeaderButton: {
    paddingVertical: 4,
  },
  categoryHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  categoryBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 3,
    marginBottom: 4,
  },
  categoryBubbleActive: {
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryBubbleText: {
    fontSize: 9,
    fontWeight: '600',
  },
  countryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  countryButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  contentList: {
    paddingHorizontal: 0, // Remove padding since cards have their own margins
    paddingBottom: 100,
  },
  postCard: {
    borderRadius: 16, // Match home page border radius
    padding: 20,
    marginHorizontal: 16, // Add margins like home page
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    fontSize: 32,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
  },
  userLocation: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  trendingBadge: {
    backgroundColor: '#EF4444',
  },
  breakingBadge: {
    backgroundColor: '#DC2626',
  },
  viralBadge: {
    backgroundColor: '#F97316',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  engagementRow: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 12,
    marginBottom: 12,
  },
  engagementStats: {
    flexDirection: 'row',
    gap: 16,
  },
  engagementText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#65676B',
    fontWeight: '600',
  },
  actionTextActive: {
    color: '#1877F2',
  },
  actionTextBookmarked: {
    color: '#F59E0B',
  },
  translationContainer: {
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E7EB',
  },
  footer: {
    padding: 12,
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
});