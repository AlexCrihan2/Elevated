import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, TextInput, Modal, Alert, RefreshControl, Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { Image } from 'expo-image';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, FadeIn } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

interface TagPerson {
  id: string;
  name: string;
  avatar: string;
  followers: number;
  verified: boolean;
  role: string;
}

interface Tag {
  id: string;
  name: string;
  count: number;
  category: string;
  trending: boolean;
  color: string;
  description?: string;
  longDescription?: string;
  relatedTags?: string[];
  weeklyGrowth?: string;
  topContributors?: TagPerson[];
  posts: TagPost[];
}

interface TagPost {
  id: string;
  title: string;
  author: string;
  timestamp: string;
  engagement: { likes: number; comments: number; shares: number };
  thumbnail?: string;
}

const TOP_CONTRIBUTORS: TagPerson[] = [
  { id: 'p1', name: 'Dr. Sarah Chen', avatar: '👩‍🔬', followers: 245600, verified: true, role: 'Research Scientist' },
  { id: 'p2', name: 'Alex Thompson', avatar: '👨‍💻', followers: 89200, verified: true, role: 'AI Engineer' },
  { id: 'p3', name: 'Maria Rodriguez', avatar: '👩‍🎓', followers: 132000, verified: false, role: 'Data Analyst' },
  { id: 'p4', name: 'James Wilson', avatar: '👨‍🏫', followers: 56800, verified: true, role: 'Professor' },
  { id: 'p5', name: 'Emma Davis', avatar: '👩‍🎨', followers: 78400, verified: false, role: 'Content Creator' },
  { id: 'p6', name: 'Chris Park', avatar: '👨‍💼', followers: 43200, verified: true, role: 'Tech Lead' },
];

const POPULAR_TAGS: Tag[] = [
  {
    id: '1', name: 'Technology', count: 15420, category: 'tech', trending: true, color: '#0EA5E9', weeklyGrowth: '+12.4%',
    description: 'Latest technology trends and innovations',
    longDescription: 'Explore cutting-edge developments in artificial intelligence, software engineering, hardware breakthroughs, and the digital transformation reshaping industries worldwide. From quantum computing to edge AI, this tag covers it all.',
    relatedTags: ['AI', 'Programming', 'Gadgets', 'Startups', 'Cloud'],
    topContributors: TOP_CONTRIBUTORS,
    posts: [
      { id: '1', title: 'Revolutionary AI breakthrough changes everything we know about machine learning', author: 'Dr. Sarah Chen', timestamp: '2h ago', engagement: { likes: 2340, comments: 156, shares: 89 } },
      { id: '2', title: 'New smartphone features that will blow your mind in 2025', author: 'Tech Insider', timestamp: '4h ago', engagement: { likes: 1890, comments: 234, shares: 167 } },
      { id: '12', title: 'Quantum computing reaches new milestone with 1000-qubit processor', author: 'Quantum Lab', timestamp: '6h ago', engagement: { likes: 3120, comments: 198, shares: 445 } },
    ]
  },
  {
    id: '2', name: 'Health', count: 12860, category: 'health', trending: false, color: '#10B981', weeklyGrowth: '+8.1%',
    description: 'Health tips, medical breakthroughs, and wellness advice',
    longDescription: 'Comprehensive coverage of medical research, fitness routines, mental health support, nutrition science, and preventive care strategies. Join millions discovering healthier lifestyles through evidence-based content.',
    relatedTags: ['Fitness', 'Medicine', 'Wellness', 'Nutrition', 'MentalHealth'],
    topContributors: TOP_CONTRIBUTORS.slice(0, 4),
    posts: [
      { id: '3', title: 'Scientists discover new treatment that could cure common diseases', author: 'Medical Journal', timestamp: '1h ago', engagement: { likes: 3420, comments: 289, shares: 445 } },
      { id: '13', title: 'Daily walking reduces risk of heart disease by 35%', author: 'Health Weekly', timestamp: '5h ago', engagement: { likes: 2890, comments: 167, shares: 334 } },
    ]
  },
  {
    id: '3', name: 'Sports', count: 9450, category: 'sports', trending: true, color: '#6366F1', weeklyGrowth: '+19.7%',
    description: 'Live sports updates and athletic achievements worldwide',
    longDescription: 'Real-time match updates, athlete spotlights, coaching insights, and deep dives into the science of athletic performance. From grassroots to elite professional leagues across all major sports.',
    relatedTags: ['Football', 'Basketball', 'Olympics', 'Esports', 'Athletics'],
    topContributors: TOP_CONTRIBUTORS.slice(1, 5),
    posts: [
      { id: '4', title: 'Underdog team wins championship in stunning comeback victory', author: 'Sports Network', timestamp: '30m ago', engagement: { likes: 5670, comments: 423, shares: 892 } },
      { id: '14', title: 'New world record broken at international athletics championship', author: 'Sports Today', timestamp: '3h ago', engagement: { likes: 4230, comments: 312, shares: 567 } },
    ]
  },
  {
    id: '4', name: 'Science', count: 8730, category: 'science', trending: false, color: '#8B5CF6', weeklyGrowth: '+6.3%',
    description: 'Scientific discoveries and research findings that matter',
    longDescription: 'From particle physics to climate science, explore peer-reviewed discoveries, lab breakthroughs, and thought-provoking science journalism. Perfect for curious minds eager to understand our universe.',
    relatedTags: ['Physics', 'Biology', 'Chemistry', 'Space', 'Environment'],
    topContributors: TOP_CONTRIBUTORS.slice(2, 6),
    posts: [
      { id: '5', title: 'Space telescope reveals breathtaking images of distant galaxies', author: 'Space Agency', timestamp: '6h ago', engagement: { likes: 4230, comments: 167, shares: 334 } },
      { id: '15', title: 'New study reveals surprising benefits of meditation on brain chemistry', author: 'Neuro Research', timestamp: '8h ago', engagement: { likes: 2890, comments: 223, shares: 445 } },
    ]
  },
  {
    id: '5', name: 'Travel', count: 7210, category: 'travel', trending: true, color: '#F59E0B', weeklyGrowth: '+14.2%',
    description: 'Travel destinations and cultural experiences around the globe',
    longDescription: 'Discover hidden gems, practical travel hacks, cultural immersion guides, and breathtaking photography from every corner of the world. Whether budget backpacking or luxury escapes, inspiration awaits.',
    relatedTags: ['Adventure', 'Culture', 'Food', 'Photography', 'Backpacking'],
    topContributors: TOP_CONTRIBUTORS.slice(0, 3),
    posts: [
      { id: '6', title: 'Hidden paradise destinations you never knew existed', author: 'Travel Explorer', timestamp: '3h ago', engagement: { likes: 2890, comments: 445, shares: 567 } },
      { id: '16', title: 'Budget guide to Southeast Asia: 30 days for under $1000', author: 'Budget Traveler', timestamp: '7h ago', engagement: { likes: 3450, comments: 289, shares: 678 } },
    ]
  },
  {
    id: '6', name: 'Food', count: 6890, category: 'food', trending: false, color: '#EF4444', weeklyGrowth: '+5.8%',
    description: 'Culinary adventures, recipes, and global food culture',
    longDescription: 'Explore global cuisines, cooking techniques, restaurant reviews, and the science behind flavor. From street food discoveries to fine dining experiences, food lovers will find endless inspiration here.',
    relatedTags: ['Recipes', 'Cooking', 'Restaurants', 'Vegan', 'Baking'],
    topContributors: TOP_CONTRIBUTORS.slice(3, 6),
    posts: [
      { id: '7', title: 'Michelin-starred chef reveals secret cooking techniques', author: 'Chef Magazine', timestamp: '5h ago', engagement: { likes: 1670, comments: 234, shares: 123 } },
      { id: '17', title: '10 regional dishes you must try before you die', author: 'Foodie World', timestamp: '9h ago', engagement: { likes: 2340, comments: 345, shares: 234 } },
    ]
  },
  {
    id: '7', name: 'Fashion', count: 5560, category: 'fashion', trending: true, color: '#EC4899', weeklyGrowth: '+22.1%',
    description: 'Fashion trends, style inspiration, and the latest from runways',
    longDescription: 'Stay ahead of fashion with trend forecasts, sustainable style guides, designer spotlights, and accessible styling tips. From haute couture to everyday wearable fashion for every body and budget.',
    relatedTags: ['Style', 'Beauty', 'Trends', 'Sustainable', 'Streetwear'],
    topContributors: TOP_CONTRIBUTORS.slice(1, 4),
    posts: [
      { id: '8', title: 'Fashion week highlights: trends that will define the year', author: 'Style Magazine', timestamp: '7h ago', engagement: { likes: 3450, comments: 567, shares: 789 } },
      { id: '18', title: 'Sustainable fashion brands making a real difference in 2025', author: 'EcoFashion', timestamp: '11h ago', engagement: { likes: 2560, comments: 312, shares: 456 } },
    ]
  },
  {
    id: '8', name: 'Music', count: 4870, category: 'music', trending: false, color: '#06B6D4', weeklyGrowth: '+9.4%',
    description: 'Music news, artist spotlights, and the latest releases',
    longDescription: 'Discover emerging artists, album reviews, concert highlights, music theory insights, and the business side of the music industry. Every genre from classical to electronic, hip-hop to indie.',
    relatedTags: ['Artists', 'Albums', 'Concerts', 'Playlist', 'Production'],
    topContributors: TOP_CONTRIBUTORS.slice(0, 4),
    posts: [
      { id: '9', title: 'Rising artist breaks streaming records with debut album', author: 'Music News', timestamp: '4h ago', engagement: { likes: 2890, comments: 345, shares: 456 } },
      { id: '19', title: 'The evolution of electronic music: a 50-year journey', author: 'Sound Archive', timestamp: '12h ago', engagement: { likes: 1890, comments: 156, shares: 234 } },
    ]
  },
  {
    id: '9', name: 'Gaming', count: 4250, category: 'gaming', trending: true, color: '#3B82F6', weeklyGrowth: '+16.8%',
    description: 'Gaming news, reviews, and esports coverage worldwide',
    longDescription: 'From AAA game launches to indie gems, esports tournaments, game development insights, and gaming culture. The ultimate destination for gamers of all levels across every platform.',
    relatedTags: ['Esports', 'Reviews', 'Streaming', 'VR', 'IndieGames'],
    topContributors: TOP_CONTRIBUTORS.slice(2, 6),
    posts: [
      { id: '10', title: 'New gaming console breaks all previous sales records', author: 'Gaming Weekly', timestamp: '1h ago', engagement: { likes: 3890, comments: 456, shares: 234 } },
      { id: '20', title: 'Esports team wins $5M prize at world championship', author: 'Esports Arena', timestamp: '3h ago', engagement: { likes: 5670, comments: 678, shares: 892 } },
    ]
  },
  {
    id: '10', name: 'Photography', count: 3890, category: 'photography', trending: false, color: '#84CC16', weeklyGrowth: '+7.2%',
    description: 'Photography tips, gear reviews, and stunning visual captures',
    longDescription: 'Master the art of photography with expert tutorials, gear comparisons, post-processing techniques, and portfolio showcases. Discover masters of the craft and find your own visual voice.',
    relatedTags: ['Camera', 'Editing', 'Portrait', 'Landscape', 'Street'],
    topContributors: TOP_CONTRIBUTORS,
    posts: [
      { id: '11', title: 'Professional photographer shares secrets of perfect lighting', author: 'Photo Pro', timestamp: '5h ago', engagement: { likes: 2340, comments: 178, shares: 345 } },
      { id: '21', title: 'Best mirrorless cameras of 2025 reviewed and ranked', author: 'Camera Weekly', timestamp: '8h ago', engagement: { likes: 1890, comments: 234, shares: 167 } },
    ]
  }
];

const CATEGORIES = [
  { id: 'all', name: 'All', icon: 'apps', color: '#0EA5E9' },
  { id: 'tech', name: 'Tech', icon: 'computer', color: '#3B82F6' },
  { id: 'health', name: 'Health', icon: 'favorite', color: '#10B981' },
  { id: 'sports', name: 'Sports', icon: 'sports-soccer', color: '#6366F1' },
  { id: 'science', name: 'Science', icon: 'science', color: '#8B5CF6' },
  { id: 'travel', name: 'Travel', icon: 'flight', color: '#F59E0B' },
  { id: 'food', name: 'Food', icon: 'restaurant', color: '#EF4444' },
  { id: 'fashion', name: 'Fashion', icon: 'style', color: '#EC4899' },
  { id: 'music', name: 'Music', icon: 'music-note', color: '#06B6D4' },
  { id: 'gaming', name: 'Gaming', icon: 'games', color: '#3B82F6' },
  { id: 'photography', name: 'Photo', icon: 'photo-camera', color: '#84CC16' },
  { id: 'education', name: 'Education', icon: 'school', color: '#0EA5E9' },
  { id: 'business', name: 'Business', icon: 'business', color: '#06B6D4' },
  { id: 'art', name: 'Art', icon: 'brush', color: '#EC4899' },
];

function formatFollowers(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return String(n);
}

export default function TagsScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTagDetails, setShowTagDetails] = useState<Tag | null>(null);
  const [tags] = useState<Tag[]>(POPULAR_TAGS);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#0EA5E9');
  const [newTagPhoto, setNewTagPhoto] = useState<string | null>(null);
  const [followedTags, setFollowedTags] = useState<Set<string>>(new Set());

  const handlePickTagPhoto = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Please allow photo access to add a tag photo.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        setNewTagPhoto(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Error', 'Could not open photo picker.');
    }
  };

  const handleFollowTag = (tag: Tag) => {
    const newFollowed = new Set(followedTags);
    if (newFollowed.has(tag.id)) {
      newFollowed.delete(tag.id);
      Alert.alert('Unfollowed', `You unfollowed #${tag.name}`);
    } else {
      newFollowed.add(tag.id);
      Alert.alert('Following!', `Now following #${tag.name}. Posts from this tag will appear in your feed.`);
    }
    setFollowedTags(newFollowed);
  };

  const headerAnim = useSharedValue(0);
  const tagsAnim = useSharedValue(0);

  useEffect(() => {
    headerAnim.value = withTiming(1, { duration: 400 });
    tagsAnim.value = withDelay(200, withTiming(1, { duration: 400 }));
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerAnim.value,
    transform: [{ translateY: (1 - headerAnim.value) * -20 }],
  }));

  const tagsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: tagsAnim.value,
    transform: [{ translateY: (1 - tagsAnim.value) * 20 }],
  }));

  const filteredTags = tags.filter(tag => {
    const categoryMatch = selectedCategory === 'all' || tag.category.toLowerCase() === selectedCategory;
    const searchMatch = tag.name.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const trendingTags = tags.filter(tag => tag.trending).slice(0, 6);

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleCreateTag = () => {
    if (!newTagName.trim()) { Alert.alert('Error', 'Please enter a tag name'); return; }
    const name = newTagName;
    setNewTagName('');
    setNewTagPhoto(null);
    setShowCreateModal(false);
    Alert.alert('Tag Created!', `Your tag "#${name}" has been created${newTagPhoto ? ' with photo' : ''} and is ready to use!`);
  };

  const renderTag = ({ item, index }: { item: Tag; index: number }) => {
    const isFollowed = followedTags.has(item.id);
    return (
      <Animated.View entering={FadeIn.delay(index * 50).duration(300)}>
        <TouchableOpacity
          style={[styles.tagCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#E2E8F0' }]}
          onPress={() => setShowTagDetails(item)}
          activeOpacity={0.85}
        >
          <View style={[styles.tagAccentBar, { backgroundColor: item.color }]} />
          <View style={styles.tagCardInner}>
            <View style={styles.tagTopRow}>
              <View style={styles.tagNameRow}>
                <Text style={[styles.tagName, { color: item.color }]}>#{item.name}</Text>
                {item.trending && (
                  <LinearGradient colors={['#EF4444', '#F97316']} style={styles.trendingBadge}>
                    <MaterialIcons name="local-fire-department" size={10} color="#FFF" />
                    <Text style={styles.trendingBadgeText}>Trending</Text>
                  </LinearGradient>
                )}
              </View>
              <View style={styles.tagCountWrap}>
                <Text style={[styles.tagCount, { color: isDark ? '#94A3B8' : '#6B7280' }]}>{item.count.toLocaleString()} posts</Text>
                {item.weeklyGrowth && <Text style={styles.tagGrowth}>{item.weeklyGrowth} this week</Text>}
              </View>
            </View>

            <Text style={[styles.tagDescription, { color: isDark ? '#CBD5E1' : '#374151' }]}>{item.description}</Text>
            {item.longDescription && (
              <Text style={[styles.tagLongDesc, { color: isDark ? '#94A3B8' : '#6B7280' }]} numberOfLines={2}>{item.longDescription}</Text>
            )}

            {item.relatedTags && (
              <View style={styles.relatedTagsRow}>
                {item.relatedTags.slice(0, 4).map((rt, i) => (
                  <View key={i} style={[styles.relatedTagChip, { backgroundColor: item.color + '18', borderColor: item.color + '40' }]}>
                    <Text style={[styles.relatedTagText, { color: item.color }]}>#{rt}</Text>
                  </View>
                ))}
              </View>
            )}

            {item.topContributors && item.topContributors.length > 0 && (
              <View style={styles.contributorsSection}>
                <Text style={[styles.contributorsLabel, { color: isDark ? '#94A3B8' : '#6B7280' }]}>Top contributors</Text>
                <View style={styles.contributorsRow}>
                  {item.topContributors.slice(0, 5).map((person, i) => (
                    <View key={i} style={[styles.contributorAvatar, { backgroundColor: item.color + '20', marginLeft: i > 0 ? -8 : 0, zIndex: 5 - i }]}>
                      <Text style={styles.contributorEmoji}>{person.avatar}</Text>
                      {person.verified && <View style={styles.contributorVerifiedDot}><MaterialIcons name="verified" size={8} color="#1DA1F2" /></View>}
                    </View>
                  ))}
                  {item.topContributors.length > 5 && (
                    <View style={[styles.contributorMore, { backgroundColor: item.color }]}>
                      <Text style={styles.contributorMoreText}>+{item.topContributors.length - 5}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            <View style={styles.tagFooterRow}>
              <TouchableOpacity
                style={[styles.followTagBtn, { borderColor: item.color, backgroundColor: isFollowed ? item.color : 'transparent' }]}
                onPress={() => handleFollowTag(item)}
              >
                <MaterialIcons name={isFollowed ? 'check' : 'add'} size={14} color={isFollowed ? '#FFFFFF' : item.color} />
                <Text style={[styles.followTagText, { color: isFollowed ? '#FFFFFF' : item.color }]}>
                  {isFollowed ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.viewTagBtn} onPress={() => setShowTagDetails(item)}>
                <Text style={[styles.viewTagText, { color: isDark ? '#94A3B8' : '#6B7280' }]}>View posts</Text>
                <MaterialIcons name="arrow-forward-ios" size={11} color={isDark ? '#94A3B8' : '#6B7280'} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderTagPost = ({ item }: { item: TagPost }) => (
    <TouchableOpacity style={[styles.tagPostCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#E2E8F0' }]}>
      <Text style={[styles.tagPostTitle, { color: isDark ? '#F1F5F9' : '#1F2937' }]} numberOfLines={3}>{item.title}</Text>
      <View style={styles.tagPostMeta}>
        <View style={styles.tagPostAuthorRow}>
          <MaterialIcons name="person" size={12} color="#0EA5E9" />
          <Text style={[styles.tagPostAuthor, { color: isDark ? '#94A3B8' : '#6B7280' }]}>{item.author}</Text>
        </View>
        <Text style={[styles.tagPostTime, { color: isDark ? '#64748B' : '#9CA3AF' }]}>{item.timestamp}</Text>
      </View>
      <View style={styles.tagPostEngagement}>
        <View style={styles.engagementItem}><MaterialIcons name="favorite" size={13} color="#EF4444" /><Text style={styles.engagementText}>{item.engagement.likes.toLocaleString()}</Text></View>
        <View style={styles.engagementItem}><MaterialIcons name="chat-bubble" size={13} color="#0EA5E9" /><Text style={styles.engagementText}>{item.engagement.comments.toLocaleString()}</Text></View>
        <View style={styles.engagementItem}><MaterialIcons name="share" size={13} color="#10B981" /><Text style={styles.engagementText}>{item.engagement.shares.toLocaleString()}</Text></View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F0F9FF' }]}>
      <Animated.View style={[headerAnimatedStyle]}>
        <LinearGradient colors={['#0EA5E9', '#0284C7', '#0369A1']} style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <View style={styles.headerInner}>
            <View>
              <Text style={styles.headerTitle}>Tags</Text>
              <Text style={styles.headerSubtitle}>Explore trending topics</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerBtn} onPress={handleRefresh}>
                <MaterialIcons name="refresh" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.headerBtn, { backgroundColor: 'rgba(255,255,255,0.25)' }]} onPress={() => setShowCreateModal(true)}>
                <MaterialIcons name="add" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <View style={[styles.searchContainer, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#BAE6FD' }]}>
        <MaterialIcons name="search" size={20} color="#0EA5E9" />
        <TextInput
          style={[styles.searchInput, { color: isDark ? '#F1F5F9' : '#1F2937' }]}
          placeholder="Search tags..."
          placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialIcons name="close" size={18} color="#0EA5E9" />
          </TouchableOpacity>
        )}
      </View>

      {trendingTags.length > 0 && (
        <View style={[styles.trendingSection, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#BAE6FD' }]}>
          <View style={styles.trendingHeader}>
            <MaterialIcons name="local-fire-department" size={16} color="#EF4444" />
            <Text style={[styles.trendingTitle, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>Trending Now</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingScroll}>
            {trendingTags.map((tag) => (
              <TouchableOpacity
                key={tag.id}
                style={[styles.trendingChip, { backgroundColor: tag.color + '18', borderColor: tag.color + '50' }]}
                onPress={() => setShowTagDetails(tag)}
              >
                <Text style={[styles.trendingChipName, { color: tag.color }]}>#{tag.name}</Text>
                <Text style={[styles.trendingChipCount, { color: isDark ? '#94A3B8' : '#6B7280' }]}>{tag.count.toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={[styles.categoriesBar, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#BAE6FD' }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryChip, { backgroundColor: selectedCategory === cat.id ? cat.color : (isDark ? '#0F172A' : '#F0F9FF'), borderColor: selectedCategory === cat.id ? cat.color : (isDark ? '#334155' : '#BAE6FD') }]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <MaterialIcons name={cat.icon as any} size={13} color={selectedCategory === cat.id ? '#FFFFFF' : cat.color} />
              <Text style={[styles.categoryChipText, { color: selectedCategory === cat.id ? '#FFFFFF' : (isDark ? '#94A3B8' : '#374151') }]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Animated.View style={[styles.tagsContainer, tagsAnimatedStyle]}>
        <FlatList
          data={filteredTags}
          renderItem={renderTag}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.tagsList}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#0EA5E9" />}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <MaterialIcons name="local-offer" size={56} color="#BAE6FD" />
              <Text style={[styles.emptyTitle, { color: isDark ? '#F1F5F9' : '#1F2937' }]}>No Tags Found</Text>
              <Text style={[styles.emptySubtitle, { color: isDark ? '#94A3B8' : '#6B7280' }]}>{searchQuery ? `No tags match "${searchQuery}"` : 'No tags in this category'}</Text>
              <TouchableOpacity style={styles.createTagBtn} onPress={() => setShowCreateModal(true)}>
                <MaterialIcons name="add" size={18} color="#FFFFFF" />
                <Text style={styles.createTagBtnText}>Create Tag</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </Animated.View>

      {/* Create Modal with Photo Upload */}
      <Modal visible={showCreateModal} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modalContainer, { backgroundColor: isDark ? '#0F172A' : '#F0F9FF' }]}>
          <LinearGradient colors={['#0EA5E9', '#0284C7']} style={styles.modalHeaderGradient}>
            <TouchableOpacity onPress={() => { setShowCreateModal(false); setNewTagPhoto(null); }}>
              <MaterialIcons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.modalTitleText}>Create New Tag</Text>
            <TouchableOpacity onPress={handleCreateTag}>
              <Text style={styles.modalSaveBtn}>Create</Text>
            </TouchableOpacity>
          </LinearGradient>
          <ScrollView style={styles.modalBody}>
            {/* Photo Upload */}
            <Text style={[styles.inputLabel, { color: isDark ? '#CBD5E1' : '#374151' }]}>Tag Photo (Optional)</Text>
            <TouchableOpacity style={[styles.photoUploadBox, { borderColor: newTagColor, backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]} onPress={handlePickTagPhoto}>
              {newTagPhoto ? (
                <Image source={{ uri: newTagPhoto }} style={styles.tagPhotoPreview} contentFit="cover" />
              ) : (
                <View style={styles.photoUploadPlaceholder}>
                  <MaterialIcons name="add-photo-alternate" size={36} color={newTagColor} />
                  <Text style={[styles.photoUploadText, { color: newTagColor }]}>Tap to add photo</Text>
                </View>
              )}
            </TouchableOpacity>
            {newTagPhoto && (
              <TouchableOpacity style={styles.removePhotoBtn} onPress={() => setNewTagPhoto(null)}>
                <MaterialIcons name="close" size={14} color="#EF4444" />
                <Text style={styles.removePhotoText}>Remove photo</Text>
              </TouchableOpacity>
            )}

            <Text style={[styles.inputLabel, { color: isDark ? '#CBD5E1' : '#374151', marginTop: 16 }]}>Tag Name *</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', color: isDark ? '#F1F5F9' : '#1F2937', borderColor: '#0EA5E9' }]}
              placeholder="Enter tag name..."
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              value={newTagName}
              onChangeText={setNewTagName}
              maxLength={30}
            />

            <Text style={[styles.inputLabel, { color: isDark ? '#CBD5E1' : '#374151', marginTop: 16 }]}>Color</Text>
            <View style={styles.colorRow}>
              {['#0EA5E9', '#10B981', '#6366F1', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'].map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorDot, { backgroundColor: color }, newTagColor === color && styles.colorDotSelected]}
                  onPress={() => setNewTagColor(color)}
                >
                  {newTagColor === color && <MaterialIcons name="check" size={14} color="#FFFFFF" />}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Tag Details Modal */}
      <Modal visible={!!showTagDetails} animationType="slide" presentationStyle="pageSheet">
        {showTagDetails ? (
          <View style={[styles.detailsContainer, { backgroundColor: isDark ? '#0F172A' : '#F0F9FF' }]}>
            <LinearGradient colors={[showTagDetails.color, showTagDetails.color + 'CC']} style={[styles.detailsHeader, { paddingTop: insets.top + 8 }]}>
              <TouchableOpacity style={styles.detailsCloseBtn} onPress={() => setShowTagDetails(null)}>
                <MaterialIcons name="arrow-back" size={22} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.detailsHeaderCenter}>
                <Text style={styles.detailsTagName}>#{showTagDetails.name}</Text>
                <Text style={styles.detailsTagCount}>{showTagDetails.count.toLocaleString()} posts · {showTagDetails.weeklyGrowth} this week</Text>
              </View>
              <TouchableOpacity
                style={[styles.detailsFollowBtn, followedTags.has(showTagDetails.id) && { backgroundColor: 'rgba(255,255,255,0.5)' }]}
                onPress={() => handleFollowTag(showTagDetails)}
              >
                <MaterialIcons name={followedTags.has(showTagDetails.id) ? 'check' : 'add'} size={18} color="#FFFFFF" />
                <Text style={styles.detailsFollowText}>{followedTags.has(showTagDetails.id) ? 'Following' : 'Follow'}</Text>
              </TouchableOpacity>
            </LinearGradient>

            <ScrollView style={styles.detailsScrollView} showsVerticalScrollIndicator={false}>
              <View style={[styles.detailsSection, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#BAE6FD' }]}>
                <Text style={[styles.detailsSectionTitle, { color: showTagDetails.color }]}>About this tag</Text>
                <Text style={[styles.detailsDescription, { color: isDark ? '#CBD5E1' : '#374151' }]}>{showTagDetails.longDescription}</Text>
              </View>

              {showTagDetails.relatedTags && (
                <View style={[styles.detailsSection, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#BAE6FD' }]}>
                  <Text style={[styles.detailsSectionTitle, { color: showTagDetails.color }]}>Related tags</Text>
                  <View style={styles.relatedTagsWrap}>
                    {showTagDetails.relatedTags.map((rt, i) => (
                      <View key={i} style={[styles.relatedTagBig, { backgroundColor: showTagDetails.color + '15', borderColor: showTagDetails.color + '40' }]}>
                        <Text style={[styles.relatedTagBigText, { color: showTagDetails.color }]}>#{rt}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {showTagDetails.topContributors && (
                <View style={[styles.detailsSection, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#BAE6FD' }]}>
                  <Text style={[styles.detailsSectionTitle, { color: showTagDetails.color }]}>Top contributors ({showTagDetails.topContributors.length})</Text>
                  {showTagDetails.topContributors.map((person) => (
                    <View key={person.id} style={[styles.contributorRow, { borderBottomColor: isDark ? '#334155' : '#E2E8F0' }]}>
                      <View style={[styles.contributorAvatarLarge, { backgroundColor: showTagDetails.color + '20' }]}>
                        <Text style={styles.contributorEmojiLarge}>{person.avatar}</Text>
                      </View>
                      <View style={styles.contributorInfo}>
                        <View style={styles.contributorNameRow}>
                          <Text style={[styles.contributorName, { color: isDark ? '#F1F5F9' : '#1F2937' }]}>{person.name}</Text>
                          {person.verified && <MaterialIcons name="verified" size={14} color="#1DA1F2" />}
                        </View>
                        <Text style={[styles.contributorRole, { color: isDark ? '#94A3B8' : '#6B7280' }]}>{person.role}</Text>
                      </View>
                      <Text style={[styles.contributorFollowers, { color: showTagDetails.color }]}>{formatFollowers(person.followers)}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={[styles.detailsSection, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#BAE6FD', marginBottom: 100 }]}>
                <Text style={[styles.detailsSectionTitle, { color: showTagDetails.color }]}>Recent posts ({showTagDetails.posts.length})</Text>
                <FlatList
                  data={showTagDetails.posts}
                  renderItem={renderTagPost}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                />
              </View>
            </ScrollView>
          </View>
        ) : null}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 16 },
  headerInner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.75)' },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },

  searchContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 12, marginVertical: 8, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1.5, gap: 10, shadowColor: '#0EA5E9', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  searchInput: { flex: 1, fontSize: 15 },

  trendingSection: { marginHorizontal: 12, marginVertical: 6, borderRadius: 14, padding: 12, borderWidth: 1.5, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
  trendingHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  trendingTitle: { fontSize: 15, fontWeight: '700' },
  trendingScroll: { gap: 8, paddingRight: 8 },
  trendingChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', minWidth: 80 },
  trendingChipName: { fontSize: 13, fontWeight: '700', marginBottom: 1 },
  trendingChipCount: { fontSize: 10, fontWeight: '500' },

  categoriesBar: { marginHorizontal: 12, marginVertical: 6, borderRadius: 14, borderWidth: 1.5, paddingVertical: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
  categoriesScroll: { paddingHorizontal: 12, gap: 6 },
  categoryChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1.5, gap: 4 },
  categoryChipText: { fontSize: 11, fontWeight: '600' },

  tagsContainer: { flex: 1 },
  tagsList: { paddingHorizontal: 12, paddingVertical: 8, paddingBottom: 100 },
  tagCard: { borderRadius: 16, marginBottom: 10, borderWidth: 1.5, overflow: 'hidden', shadowColor: '#0EA5E9', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 3 },
  tagAccentBar: { height: 4 },
  tagCardInner: { padding: 14 },
  tagTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  tagNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  tagName: { fontSize: 17, fontWeight: '800' },
  trendingBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  trendingBadgeText: { fontSize: 9, fontWeight: '700', color: '#FFFFFF' },
  tagCountWrap: { alignItems: 'flex-end' },
  tagCount: { fontSize: 12, fontWeight: '600' },
  tagGrowth: { fontSize: 10, color: '#10B981', fontWeight: '600' },
  tagDescription: { fontSize: 14, fontWeight: '600', marginBottom: 4, lineHeight: 20 },
  tagLongDesc: { fontSize: 12, lineHeight: 17, marginBottom: 10 },
  relatedTagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  relatedTagChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1 },
  relatedTagText: { fontSize: 10, fontWeight: '600' },
  contributorsSection: { marginBottom: 10 },
  contributorsLabel: { fontSize: 11, fontWeight: '600', marginBottom: 6 },
  contributorsRow: { flexDirection: 'row', alignItems: 'center' },
  contributorAvatar: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFFFFF', position: 'relative' },
  contributorEmoji: { fontSize: 16 },
  contributorVerifiedDot: { position: 'absolute', bottom: -2, right: -2 },
  contributorMore: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginLeft: -8 },
  contributorMoreText: { fontSize: 9, fontWeight: '700', color: '#FFFFFF' },
  tagFooterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  followTagBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1.5, gap: 4 },
  followTagText: { fontSize: 12, fontWeight: '700' },
  viewTagBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  viewTagText: { fontSize: 12, fontWeight: '500' },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginTop: 12, marginBottom: 6 },
  emptySubtitle: { fontSize: 13, textAlign: 'center', marginBottom: 20 },
  createTagBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0EA5E9', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, gap: 6 },
  createTagBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },

  modalContainer: { flex: 1 },
  modalHeaderGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16, paddingTop: 56 },
  modalTitleText: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  modalSaveBtn: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  modalBody: { flex: 1, padding: 16 },
  inputLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  textInput: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 },
  colorRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  colorDot: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  colorDotSelected: { borderWidth: 3, borderColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 4 },

  // Photo Upload
  photoUploadBox: { height: 120, borderRadius: 14, borderWidth: 2, borderStyle: 'dashed', overflow: 'hidden', marginBottom: 8, alignItems: 'center', justifyContent: 'center' },
  photoUploadPlaceholder: { alignItems: 'center', justifyContent: 'center', gap: 8 },
  photoUploadText: { fontSize: 13, fontWeight: '600' },
  tagPhotoPreview: { width: '100%', height: '100%' },
  removePhotoBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  removePhotoText: { fontSize: 12, color: '#EF4444', fontWeight: '600' },

  detailsContainer: { flex: 1 },
  detailsHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  detailsCloseBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  detailsHeaderCenter: { flex: 1 },
  detailsTagName: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  detailsTagCount: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  detailsFollowBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, gap: 4 },
  detailsFollowText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  detailsScrollView: { flex: 1 },
  detailsSection: { margin: 12, borderRadius: 16, padding: 14, borderWidth: 1.5, marginBottom: 0 },
  detailsSectionTitle: { fontSize: 14, fontWeight: '800', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  detailsDescription: { fontSize: 14, lineHeight: 22 },
  relatedTagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  relatedTagBig: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1.5 },
  relatedTagBigText: { fontSize: 13, fontWeight: '700' },
  contributorRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1 },
  contributorAvatarLarge: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  contributorEmojiLarge: { fontSize: 22 },
  contributorInfo: { flex: 1 },
  contributorNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  contributorName: { fontSize: 14, fontWeight: '700' },
  contributorRole: { fontSize: 12, marginTop: 1 },
  contributorFollowers: { fontSize: 13, fontWeight: '700' },
  tagPostCard: { borderRadius: 12, padding: 12, borderWidth: 1 },
  tagPostTitle: { fontSize: 14, fontWeight: '600', lineHeight: 20, marginBottom: 8 },
  tagPostMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  tagPostAuthorRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tagPostAuthor: { fontSize: 12, fontWeight: '500' },
  tagPostTime: { fontSize: 11 },
  tagPostEngagement: { flexDirection: 'row', gap: 16 },
  engagementItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  engagementText: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
});
