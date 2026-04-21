import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, StatusBar, SafeAreaView, TextInput, Modal, Switch, Animated, Dimensions } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import TranslationWidget from '@/components/ui/TranslationWidget';
import AnalyticsChart from '@/components/analytics/AnalyticsChart';
import { router } from 'expo-router';
import ProfileTypeSelector, { ProfileType } from '@/components/profile/ProfileTypeSelector';
import AdvancedSettings from '@/components/settings/AdvancedSettings';
import ModerationDashboard from '@/components/moderation/ModerationDashboard';
import BookManager from '@/components/books/BookManager';
import ResetDataButtons from '@/components/ui/ResetDataButtons';
import { useTheme } from '@/contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProfileData {
  id: string;
  name: string;
  username: string;
  bio: string;
  location: string;
  joinDate: string;
  following: number;
  followers: number;
  verified: boolean;
  isPrivate: boolean;
  avatar: string;
  coverImage: string;
  posts: number;
  engagement: number;
  weeklyViews: number;
  profileType: ProfileType;
  level: number;
  achievements: number;
  reputation: number;
}

const profileTabs = [
  { id: 'overview', title: 'Overview', icon: 'dashboard', gradient: ['#667eea', '#764ba2'] as [string,string] },
  { id: 'books', title: 'Books', icon: 'menu-book', gradient: ['#f093fb', '#f5576c'] as [string,string] },
  { id: 'posts', title: 'Posts', icon: 'article', gradient: ['#4facfe', '#00f2fe'] as [string,string] },
  { id: 'research', title: 'Research', icon: 'science', gradient: ['#43e97b', '#38f9d7'] as [string,string] },
  { id: 'analytics', title: 'Analytics', icon: 'analytics', gradient: ['#fa709a', '#fee140'] as [string,string] },
  { id: 'network', title: 'Network', icon: 'people', gradient: ['#30cfd0', '#330867'] as [string,string] },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark, setDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [showSettings, setShowSettings] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showProfileTypeSelector, setShowProfileTypeSelector] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showModeration, setShowModeration] = useState(false);
  const [showBookManager, setShowBookManager] = useState(false);
  const [isAdmin] = useState(true); // In production: check user role from auth context
  
  // Animation values
  const scrollY = new Animated.Value(0);
  const headerScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.5, 1],
    extrapolate: 'clamp',
  });
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.3],
    extrapolate: 'clamp',
  });

  const showNotification = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000);
  };

  const handleSettingsItemPress = (item: string) => {
    console.log('Settings item pressed:', item);
    if (item === 'Advanced Settings') {
      console.log('Opening Advanced Settings');
      setShowSettings(false);
      setShowAdvancedSettings(true);
    } else if (item === 'Moderation Center') {
      console.log('Opening Moderation Center');
      setShowSettings(false);
      setShowModeration(true);
    } else if (item === 'Book Management') {
      console.log('Opening Book Manager');
      setShowSettings(false);
      setShowBookManager(true);
    } else {
      showNotification(`Opening ${item}...`);
    }
  };

  const [profileData, setProfileData] = useState<ProfileData>({
    id: 'profile-user-1',
    name: 'Dr. Alexandra Thompson',
    username: '@alex_thompson',
    bio: 'Senior Research Scientist | Sustainable Technology Innovator | Building the future of green architecture 🌱',
    location: 'San Francisco, CA',
    joinDate: 'March 2021',
    following: 1847,
    followers: 12500,
    verified: true,
    isPrivate: false,
    avatar: '👩‍🔬',
    coverImage: '🏗️',
    posts: 234,
    engagement: 8.7,
    weeklyViews: 15200,
    profileType: 'researcher',
    level: 42,
    achievements: 87,
    reputation: 9250,
  });

  const [settings, setSettings] = useState({
    privateAccount: false,
    readReceipts: true,
    liveSubtitles: true,
    autoTranslate: false,
    pushNotifications: true,
    autoplayVideos: true,
  });

  const handleSettingsChange = (key: string, value: boolean) => {
    if (key === 'darkMode') {
      setDarkMode(value);
    } else {
      setSettings(prev => ({ ...prev, [key]: value }));
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <View style={styles.tabContent}>
            {/* Achievement Stats */}
            <View style={styles.achievementGrid}>
              <View style={[styles.achievementCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.achievementGradient}
                >
                  <Ionicons name="trophy" size={32} color="#FFFFFF" />
                  <Text style={styles.achievementNumber}>{profileData.level}</Text>
                  <Text style={styles.achievementLabel}>Level</Text>
                </LinearGradient>
              </View>
              
              <View style={[styles.achievementCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
                <LinearGradient
                  colors={['#f093fb', '#f5576c']}
                  style={styles.achievementGradient}
                >
                  <Ionicons name="medal" size={32} color="#FFFFFF" />
                  <Text style={styles.achievementNumber}>{profileData.achievements}</Text>
                  <Text style={styles.achievementLabel}>Achievements</Text>
                </LinearGradient>
              </View>
              
              <View style={[styles.achievementCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
                <LinearGradient
                  colors={['#4facfe', '#00f2fe']}
                  style={styles.achievementGradient}
                >
                  <Ionicons name="star" size={32} color="#FFFFFF" />
                  <Text style={styles.achievementNumber}>{profileData.reputation}</Text>
                  <Text style={styles.achievementLabel}>Reputation</Text>
                </LinearGradient>
              </View>
            </View>

            <AnalyticsChart />

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity 
                style={[styles.quickActionCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}
                onPress={() => setShowBookManager(true)}
              >
                <LinearGradient
                  colors={['#8B5CF6', '#A78BFA']}
                  style={styles.quickActionIcon}
                >
                  <MaterialIcons name="menu-book" size={24} color="#FFFFFF" />
                </LinearGradient>
                <Text style={[styles.quickActionTitle, { color: theme.colors.text }]}>Book Publisher</Text>
                <Text style={[styles.quickActionSubtitle, { color: theme.colors.textSecondary }]}>Manage publications</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.quickActionCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}
                onPress={() => setShowModeration(true)}
              >
                <LinearGradient
                  colors={['#DC2626', '#EF4444']}
                  style={styles.quickActionIcon}
                >
                  <MaterialIcons name="gavel" size={24} color="#FFFFFF" />
                </LinearGradient>
                <Text style={[styles.quickActionTitle, { color: theme.colors.text }]}>Moderation</Text>
                <Text style={[styles.quickActionSubtitle, { color: theme.colors.textSecondary }]}>Manage community</Text>
              </TouchableOpacity>
            </View>

            <ResetDataButtons
              onResetPosts={() => showNotification('Posts refreshed!')}
              onResetNews={() => showNotification('News refreshed!')}
              onResetTags={() => showNotification('Tags refreshed!')}
            />
          </View>
        );
      case 'books':
        return (
          <View style={styles.tabContent}>
            <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', marginBottom: 16 }]} onPress={() => setShowBookManager(true)}>
              <LinearGradient colors={['#8B5CF6', '#A78BFA']} style={styles.quickActionIcon}>
                <MaterialIcons name="menu-book" size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={[styles.quickActionTitle, { color: theme.colors.text }]}>Open Book Manager</Text>
              <Text style={[styles.quickActionSubtitle, { color: theme.colors.textSecondary }]}>Manage your publications</Text>
            </TouchableOpacity>
            {[{ title: 'The AI Revolution', category: 'Technology', status: 'Published', sales: 1240 }, { title: 'Sustainable Future', category: 'Science', status: 'Draft', sales: 0 }, { title: 'Mind & Matter', category: 'Psychology', status: 'Published', sales: 876 }].map((book, i) => (
              <View key={i} style={[styles.bookItem, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
                <View style={styles.bookItemIcon}><Text style={{ fontSize: 24 }}>📖</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={[{ fontSize: 15, fontWeight: '700', color: theme.colors.text }]}>{book.title}</Text>
                  <Text style={[{ fontSize: 12, color: theme.colors.textSecondary }]}>{book.category} · {book.status}</Text>
                  {book.sales > 0 && <Text style={[{ fontSize: 12, color: '#10B981', fontWeight: '600' }]}>{book.sales} sales</Text>}
                </View>
                <View style={[styles.bookStatusBadge, { backgroundColor: book.status === 'Published' ? '#ECFDF5' : '#FEF3C7' }]}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: book.status === 'Published' ? '#10B981' : '#F59E0B' }}>{book.status}</Text>
                </View>
              </View>
            ))}
          </View>
        );
      case 'posts':
        return (
          <View style={styles.tabContent}>
            {[{ content: '🧬 BREAKTHROUGH: Our gene therapy trial successfully restored vision! #MedicalBreakthrough', likes: 15420, comments: 892, time: '2h ago' }, { content: '🚀 Just launched my AI coding assistant! 85% faster development time!', likes: 8967, comments: 1205, time: '4h ago' }, { content: '✨ Research paper accepted at Nature journal! Years of work paying off 🙏', likes: 6340, comments: 445, time: '1d ago' }].map((post, i) => (
              <View key={i} style={[styles.postItem, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#E5E7EB' }]}>
                <Text style={[{ fontSize: 14, color: theme.colors.text, lineHeight: 20, marginBottom: 10 }]}>{post.content}</Text>
                <View style={styles.postStats}>
                  <View style={styles.postStat}><MaterialIcons name="thumb-up" size={14} color="#3B82F6" /><Text style={[styles.postStatText, { color: theme.colors.textSecondary }]}>{post.likes.toLocaleString()}</Text></View>
                  <View style={styles.postStat}><MaterialIcons name="chat-bubble-outline" size={14} color="#8B5CF6" /><Text style={[styles.postStatText, { color: theme.colors.textSecondary }]}>{post.comments.toLocaleString()}</Text></View>
                  <Text style={[{ fontSize: 11, color: theme.colors.textSecondary, marginLeft: 'auto' }]}>{post.time}</Text>
                </View>
              </View>
            ))}
          </View>
        );
      case 'research':
        return (
          <View style={styles.tabContent}>
            {[{ title: 'CRISPR Gene Therapy for Leber Congenital Amaurosis', journal: 'Nature Medicine', year: '2024', citations: 234 }, { title: 'Neural Interface Optimization via Quantum Computing', journal: 'Science', year: '2024', citations: 178 }, { title: 'Sustainable Architecture with Bio-inspired Materials', journal: 'Cell', year: '2023', citations: 445 }].map((paper, i) => (
              <View key={i} style={[styles.researchItem, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#E5E7EB' }]}>
                <Text style={[{ fontSize: 14, fontWeight: '700', color: theme.colors.text, lineHeight: 20, marginBottom: 6 }]}>{paper.title}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={[{ fontSize: 12, color: '#3B82F6', fontWeight: '600' }]}>{paper.journal} · {paper.year}</Text>
                  <Text style={[{ fontSize: 12, color: '#10B981', fontWeight: '600' }]}>{paper.citations} citations</Text>
                </View>
              </View>
            ))}
          </View>
        );
      case 'analytics':
        return (
          <View style={styles.tabContent}>
            <AnalyticsChart />
            {[{ label: 'Total Impressions', value: '1.2M', icon: 'visibility', color: '#3B82F6' }, { label: 'Engagement Rate', value: '8.7%', icon: 'trending-up', color: '#10B981' }, { label: 'Profile Views', value: '45.2K', icon: 'person', color: '#8B5CF6' }, { label: 'Weekly Reach', value: '152K', icon: 'public', color: '#F59E0B' }].map((stat, i) => (
              <View key={i} style={[styles.analyticsItem, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
                <View style={[styles.analyticsIcon, { backgroundColor: stat.color + '20' }]}><MaterialIcons name={stat.icon as any} size={22} color={stat.color} /></View>
                <Text style={[{ fontSize: 14, color: theme.colors.text, flex: 1, fontWeight: '600' }]}>{stat.label}</Text>
                <Text style={[{ fontSize: 18, fontWeight: '800', color: stat.color }]}>{stat.value}</Text>
              </View>
            ))}
          </View>
        );
      case 'network':
        return (
          <View style={styles.tabContent}>
            {[{ name: 'Dr. James Wilson', role: 'Collaborator · Quantum Lab', avatar: '👨‍🔬', mutual: 12 }, { name: 'Prof. Sarah Kim', role: 'Mentor · MIT', avatar: '👩‍🏫', mutual: 8 }, { name: 'Alex Chen', role: 'Co-author · Stanford', avatar: '👨‍💻', mutual: 24 }, { name: 'Maria Rodriguez', role: 'Research Partner · CERN', avatar: '👩‍🔭', mutual: 5 }].map((person, i) => (
              <View key={i} style={[styles.networkItem, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#E5E7EB' }]}>
                <View style={[styles.networkAvatar, { backgroundColor: '#667eea20' }]}><Text style={{ fontSize: 22 }}>{person.avatar}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={[{ fontSize: 14, fontWeight: '700', color: theme.colors.text }]}>{person.name}</Text>
                  <Text style={[{ fontSize: 12, color: theme.colors.textSecondary }]}>{person.role}</Text>
                  <Text style={[{ fontSize: 11, color: '#667eea', fontWeight: '600' }]}>{person.mutual} mutual connections</Text>
                </View>
                <TouchableOpacity style={[styles.connectBtn]}>
                  <MaterialIcons name="person-add" size={16} color="#667eea" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
      
      {/* Floating Header */}
      <View style={[styles.floatingHeader, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity 
          style={styles.headerIconButton}
          onPress={() => setShowSettings(true)}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.headerIconGradient}
          >
            <MaterialIcons name="settings" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
        
        <Text style={[styles.floatingHeaderTitle, { color: theme.colors.text }]}>Profile</Text>
        
        <TouchableOpacity 
          style={styles.headerIconButton}
          onPress={() => showNotification('Share profile')}
        >
          <LinearGradient
            colors={['#4facfe', '#00f2fe']}
            style={styles.headerIconGradient}
          >
            <MaterialIcons name="share" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Animated.ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Profile Header with Parallax Effect */}
        <Animated.View 
          style={[
            styles.profileHeader,
            { 
              transform: [{ scale: headerScale }],
              opacity: headerOpacity,
            }
          ]}
        >
          <LinearGradient
            colors={isDark ? ['#1E293B', '#0F172A'] : ['#667eea', '#764ba2']}
            style={styles.coverGradient}
          >
            {/* Floating Status Indicators */}
            <View style={styles.statusIndicators}>
              <View style={styles.statusBadge}>
                <View style={styles.onlineDot} />
                <Text style={styles.statusText}>Online</Text>
              </View>
              
              {profileData.verified && (
                <View style={[styles.statusBadge, styles.verifiedBadge]}>
                  <MaterialIcons name="verified" size={14} color="#10B981" />
                  <Text style={styles.statusText}>Verified</Text>
                </View>
              )}
            </View>

            {/* Avatar with Glow Effect */}
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['#f093fb', '#f5576c']}
                style={styles.avatarGlow}
              >
                <View style={styles.avatarInner}>
                  <Text style={styles.avatarEmoji}>{profileData.avatar}</Text>
                </View>
              </LinearGradient>
              
              {/* Level Badge */}
              <View style={styles.levelBadge}>
                <LinearGradient
                  colors={['#FFD700', '#FFA500']}
                  style={styles.levelBadgeGradient}
                >
                  <Text style={styles.levelBadgeText}>{profileData.level}</Text>
                </LinearGradient>
              </View>
            </View>

            {/* Profile Info */}
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.profileName}>{profileData.name}</Text>
                {profileData.verified && (
                  <MaterialIcons name="verified" size={24} color="#10B981" />
                )}
              </View>
              
              <Text style={styles.profileUsername}>{profileData.username}</Text>
              <Text style={styles.profileBio}>{profileData.bio}</Text>
              
              <View style={styles.profileMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="location" size={16} color="#A78BFA" />
                  <Text style={styles.metaText}>{profileData.location}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="calendar" size={16} color="#A78BFA" />
                  <Text style={styles.metaText}>Joined {profileData.joinDate}</Text>
                </View>
              </View>

              {/* Follow Stats */}
              <View style={styles.followStats}>
                <TouchableOpacity style={styles.followStat}>
                  <Text style={styles.followNumber}>{profileData.following.toLocaleString()}</Text>
                  <Text style={styles.followLabel}>Following</Text>
                </TouchableOpacity>
                
                <View style={styles.statDivider} />
                
                <TouchableOpacity style={styles.followStat}>
                  <Text style={styles.followNumber}>{profileData.followers.toLocaleString()}</Text>
                  <Text style={styles.followLabel}>Followers</Text>
                </TouchableOpacity>
                
                <View style={styles.statDivider} />
                
                <TouchableOpacity style={styles.followStat}>
                  <Text style={styles.followNumber}>{profileData.posts}</Text>
                  <Text style={styles.followLabel}>Posts</Text>
                </TouchableOpacity>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.editButton} onPress={() => setShowSettings(true)}>
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.editButtonGradient}
                  >
                    <MaterialIcons name="edit" size={18} color="#FFFFFF" />
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.shareIconButton}>
                  <LinearGradient
                    colors={['#4facfe', '#00f2fe']}
                    style={styles.shareIconGradient}
                  >
                    <MaterialIcons name="share" size={18} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Modern Tab Navigation */}
        <View style={[styles.tabNavigation, { backgroundColor: theme.colors.surface }]}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabScrollContent}
          >
            {profileTabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabButton,
                  activeTab === tab.id && styles.activeTabButton,
                ]}
                onPress={() => setActiveTab(tab.id)}
              >
                {activeTab === tab.id ? (
                  <LinearGradient
                    colors={tab.gradient}
                    style={styles.tabButtonGradient}
                  >
                    <MaterialIcons name={tab.icon as any} size={20} color="#FFFFFF" />
                    <Text style={styles.tabButtonTextActive}>{tab.title}</Text>
                  </LinearGradient>
                ) : (
                  <>
                    <MaterialIcons name={tab.icon as any} size={20} color={theme.colors.textSecondary} />
                    <Text style={[styles.tabButtonText, { color: theme.colors.textSecondary }]}>{tab.title}</Text>
                  </>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </Animated.ScrollView>

      {/* Enhanced Settings Modal */}
      <Modal
        visible={showSettings}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.settingsModal, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.settingsHeader, { backgroundColor: theme.colors.surface }]}>
            <TouchableOpacity 
              style={styles.settingsCloseButton}
              onPress={() => setShowSettings(false)}
            >
              <MaterialIcons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.settingsTitle, { color: theme.colors.text }]}>Settings</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.settingsContent}>
            {/* Account Section */}
            <View style={styles.settingsSection}>
              <Text style={[styles.settingsSectionTitle, { color: theme.colors.textSecondary }]}>ACCOUNT</Text>
              
              <TouchableOpacity 
                style={[styles.settingsItem, { backgroundColor: theme.colors.inputBackground }]}
                onPress={() => handleSettingsItemPress('Profile Settings')}
              >
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.settingsIcon}
                >
                  <MaterialIcons name="person" size={20} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.settingsItemContent}>
                  <Text style={[styles.settingsItemTitle, { color: theme.colors.text }]}>Edit Profile</Text>
                  <Text style={[styles.settingsItemSubtitle, { color: theme.colors.textSecondary }]}>
                    Update your information
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.settingsItem, { backgroundColor: theme.colors.inputBackground }]}
                onPress={() => handleSettingsItemPress('Book Management')}
              >
                <LinearGradient
                  colors={['#8B5CF6', '#A78BFA']}
                  style={styles.settingsIcon}
                >
                  <MaterialIcons name="menu-book" size={20} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.settingsItemContent}>
                  <Text style={[styles.settingsItemTitle, { color: theme.colors.text }]}>Book Management</Text>
                  <Text style={[styles.settingsItemSubtitle, { color: theme.colors.textSecondary }]}>
                    Manage your publications
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Content Section */}
            <View style={styles.settingsSection}>
              <Text style={[styles.settingsSectionTitle, { color: theme.colors.textSecondary }]}>CONTENT</Text>
              
              <View style={[styles.settingsItem, { backgroundColor: theme.colors.inputBackground }]}>
                <LinearGradient
                  colors={['#4facfe', '#00f2fe']}
                  style={styles.settingsIcon}
                >
                  <MaterialIcons name="dark-mode" size={20} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.settingsItemContent}>
                  <Text style={[styles.settingsItemTitle, { color: theme.colors.text }]}>Dark Mode</Text>
                  <Text style={[styles.settingsItemSubtitle, { color: theme.colors.textSecondary }]}>
                    Use dark theme
                  </Text>
                </View>
                <Switch
                  value={isDark}
                  onValueChange={(value) => handleSettingsChange('darkMode', value)}
                  trackColor={{ false: '#D1D5DB', true: '#667eea' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={[styles.settingsItem, { backgroundColor: theme.colors.inputBackground }]}>
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.settingsIcon}
                >
                  <MaterialIcons name="notifications" size={20} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.settingsItemContent}>
                  <Text style={[styles.settingsItemTitle, { color: theme.colors.text }]}>Push Notifications</Text>
                  <Text style={[styles.settingsItemSubtitle, { color: theme.colors.textSecondary }]}>
                    Receive notifications
                  </Text>
                </View>
                <Switch
                  value={settings.pushNotifications}
                  onValueChange={(value) => handleSettingsChange('pushNotifications', value)}
                  trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            {/* Advanced Section */}
            <View style={styles.settingsSection}>
              <Text style={[styles.settingsSectionTitle, { color: theme.colors.textSecondary }]}>ADVANCED</Text>
              
              <TouchableOpacity 
                style={[styles.settingsItem, { backgroundColor: theme.colors.inputBackground }]}
                onPress={() => handleSettingsItemPress('Advanced Settings')}
              >
                <LinearGradient
                  colors={['#f093fb', '#f5576c']}
                  style={styles.settingsIcon}
                >
                  <MaterialIcons name="tune" size={20} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.settingsItemContent}>
                  <Text style={[styles.settingsItemTitle, { color: theme.colors.text }]}>Advanced Settings</Text>
                  <Text style={[styles.settingsItemSubtitle, { color: theme.colors.textSecondary }]}>
                    Power user options
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>

              {isAdmin && (
              <TouchableOpacity 
                style={[styles.settingsItem, { backgroundColor: theme.colors.inputBackground }]}
                onPress={() => handleSettingsItemPress('Moderation Center')}
              >
                <LinearGradient
                  colors={['#DC2626', '#EF4444']}
                  style={styles.settingsIcon}
                >
                  <MaterialIcons name="gavel" size={20} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.settingsItemContent}>
                  <Text style={[styles.settingsItemTitle, { color: theme.colors.text }]}>Moderation Center</Text>
                  <Text style={[styles.settingsItemSubtitle, { color: theme.colors.textSecondary }]}>
                    Manage community
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
              )}

              <TouchableOpacity 
                style={[styles.settingsItem, { backgroundColor: theme.colors.inputBackground }]}
                onPress={() => router.push('/security')}
              >
                <LinearGradient
                  colors={['#F59E0B', '#EAB308']}
                  style={styles.settingsIcon}
                >
                  <MaterialIcons name="security" size={20} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.settingsItemContent}>
                  <Text style={[styles.settingsItemTitle, { color: theme.colors.text }]}>Security Center</Text>
                  <Text style={[styles.settingsItemSubtitle, { color: theme.colors.textSecondary }]}>
                    Protect your account
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Sign Out */}
            <View style={styles.settingsSection}>
              <TouchableOpacity 
                style={[styles.settingsItem, styles.signOutItem]}
                onPress={() => showNotification('Signing out...')}
              >
                <LinearGradient
                  colors={['#EF4444', '#DC2626']}
                  style={styles.settingsIcon}
                >
                  <MaterialIcons name="logout" size={20} color="#FFFFFF" />
                </LinearGradient>
                <Text style={[styles.settingsItemTitle, { color: '#EF4444' }]}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Advanced Settings Modal */}
      <AdvancedSettings
        visible={showAdvancedSettings}
        onClose={() => setShowAdvancedSettings(false)}
      />

      {/* Moderation Dashboard */}
      <ModerationDashboard 
        visible={showModeration}
        onClose={() => setShowModeration(false)}
        userRole="admin"
      />

      {/* Book Manager */}
      <BookManager
        visible={showBookManager}
        onClose={() => setShowBookManager(false)}
      />

      {/* Floating Alert */}
      {showAlert && (
        <View style={styles.alertContainer}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.alert}
          >
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text style={styles.alertText}>{alertMessage}</Text>
          </LinearGradient>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerIconButton: {
    width: 40,
    height: 40,
  },
  headerIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  floatingHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    overflow: 'hidden',
  },
  coverGradient: {
    paddingTop: 40,
    paddingBottom: 32,
    alignItems: 'center',
  },
  statusIndicators: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  verifiedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  avatarContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  avatarGlow: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 4,
    shadowColor: '#f093fb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarInner: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 48,
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  levelBadgeGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  levelBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  profileInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileUsername: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  profileBio: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  profileMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  followStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    gap: 20,
  },
  followStat: {
    alignItems: 'center',
  },
  followNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  followLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  editButton: {
    flex: 1,
  },
  editButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  shareIconButton: {
    width: 50,
  },
  shareIconGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabNavigation: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    marginTop: 8,
  },
  tabScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  activeTabButton: {},
  tabButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tabButtonTextActive: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tabContent: {
    padding: 16,
  },
  achievementGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  achievementCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementGradient: {
    padding: 16,
    alignItems: 'center',
  },
  achievementNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginVertical: 8,
  },
  achievementLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  comingSoon: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  bookItemIcon: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: '#F3E8FF', alignItems: 'center', justifyContent: 'center',
  },
  bookStatusBadge: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  postItem: {
    borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  postStats: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  postStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  postStatText: { fontSize: 12, fontWeight: '600' },
  researchItem: {
    borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  analyticsItem: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 14, marginBottom: 10, gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  analyticsIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  networkItem: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 12, marginBottom: 10, borderWidth: 1, gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  networkAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  connectBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#667eea20', alignItems: 'center', justifyContent: 'center' },
  settingsModal: {
    flex: 1,
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingsCloseButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  placeholder: {
    width: 40,
  },
  settingsContent: {
    flex: 1,
  },
  settingsSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingsSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsItemContent: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingsItemSubtitle: {
    fontSize: 13,
  },
  signOutItem: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  alertContainer: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  alertText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
});
