
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { User, Post } from '@/types/social';
import { useSocial } from '@/hooks/useSocial';
import { useAlert } from '@/template';

const { width, height } = Dimensions.get('window');

interface UserProfileModalProps {
  visible: boolean;
  onClose: () => void;
  user: User | null;
}

export default function UserProfileModal({ visible, onClose, user }: UserProfileModalProps) {
  const { posts, currentUser } = useSocial();
  const { showAlert } = useAlert();
  const [isFollowing, setIsFollowing] = useState(false);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'likes'>('posts');
  const [userStats, setUserStats] = useState({
    posts: 0,
    followers: 0,
    following: 0
  });

  useEffect(() => {
    if (user && visible) {
      // Filter posts by this user
      const filteredPosts = posts.filter(post => post.userId === user.id);
      setUserPosts(filteredPosts);
      
      // Set user stats
      setUserStats({
        posts: filteredPosts.length,
        followers: user.followers || 0,
        following: user.following || 0
      });
      
      // Check if current user is following this user (mock logic)
      setIsFollowing(Math.random() > 0.5);
    }
  }, [user, visible, posts]);

  if (!user) return null;

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    const action = isFollowing ? 'Unfollowed' : 'Followed';
    showAlert(action, `You ${action.toLowerCase()} ${user.displayName}`);
    
    // Update follower count
    setUserStats(prev => ({
      ...prev,
      followers: isFollowing ? prev.followers - 1 : prev.followers + 1
    }));
  };

  const handleMessage = () => {
    showAlert('Message', `Send message to ${user.displayName}?`);
  };

  const handleMore = () => {
    showAlert('More Options', 'Block, Report, Share Profile, Copy Link');
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const renderUserPosts = () => {
    if (userPosts.length === 0) {
      return (
        <View style={styles.emptyState}>
          <MaterialIcons name="photo" size={48} color="#9CA3AF" />
          <Text style={styles.emptyStateText}>No posts yet</Text>
        </View>
      );
    }

    return (
      <View style={styles.postsGrid}>
        {userPosts.map((post, index) => (
          <TouchableOpacity key={post.id} style={styles.postThumbnail}>
            <View style={styles.postPreview}>
              <Text style={styles.postPreviewText} numberOfLines={4}>
                {post.content}
              </Text>
            </View>
            <View style={styles.postStats}>
              <View style={styles.postStat}>
                <MaterialIcons name="favorite" size={12} color="#EF4444" />
                <Text style={styles.postStatText}>{formatNumber(post.likes)}</Text>
              </View>
              <View style={styles.postStat}>
                <MaterialIcons name="chat-bubble" size={12} color="#6B7280" />
                <Text style={styles.postStatText}>{formatNumber(post.comments)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderMediaTab = () => (
    <View style={styles.emptyState}>
      <MaterialIcons name="photo-library" size={48} color="#9CA3AF" />
      <Text style={styles.emptyStateText}>No media posts yet</Text>
    </View>
  );

  const renderLikesTab = () => (
    <View style={styles.emptyState}>
      <MaterialIcons name="favorite" size={48} color="#9CA3AF" />
      <Text style={styles.emptyStateText}>Liked posts are private</Text>
    </View>
  );

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      presentationStyle="fullScreen"
    >
      <StatusBar barStyle="light-content" backgroundColor="#111827" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{user.displayName}</Text>
          <TouchableOpacity onPress={handleMore} style={styles.headerButton}>
            <MaterialIcons name="more-vert" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Info */}
          <View style={styles.profileSection}>
            {/* Cover Photo */}
            <View style={styles.coverPhoto}>
              <View style={styles.coverGradient} />
            </View>
            
            {/* Profile Avatar */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                {/* Changed condition: user.avatar is typically a URL, not text for display. 
                    If avatar is not provided, use first char of displayName. */}
                {user.avatar ? (
                  <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarText}>
                    {user.displayName.charAt(0)}
                  </Text>
                )}
              </View>
              
              {user.isLive && (
                <View style={styles.liveIndicator}>
                  <MaterialIcons name="fiber-manual-record" size={8} color="white" />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              )}
            </View>

            {/* User Info */}
            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.displayName}>{user.displayName}</Text>
                {user.verified && (
                  <MaterialIcons name="verified" size={20} color="#3B82F6" />
                )}
              </View>
              
              <Text style={styles.username}>@{user.username}</Text>
              
              {user.bio && (
                <Text style={styles.bio}>{user.bio}</Text>
              )}
              
              <View style={styles.metaInfo}>
                {user.location && (
                  <View style={styles.metaItem}>
                    <MaterialIcons name="location-on" size={14} color="#9CA3AF" />
                    <Text style={styles.metaText}>{user.location}</Text>
                  </View>
                )}
                
                <View style={styles.metaItem}>
                  <MaterialIcons name="calendar-today" size={14} color="#9CA3AF" />
                  <Text style={styles.metaText}>Joined {formatJoinDate(user.createdAt)}</Text>
                </View>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <TouchableOpacity style={styles.stat}>
                <Text style={styles.statNumber}>{formatNumber(userStats.posts)}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.stat}>
                <Text style={styles.statNumber}>{formatNumber(userStats.followers)}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.stat}>
                <Text style={styles.statNumber}>{formatNumber(userStats.following)}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            {currentUser && currentUser.id !== user.id && (
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.actionButton, isFollowing ? styles.followingButton : styles.followButton]}
                  onPress={handleFollow}
                >
                  <MaterialIcons 
                    name={isFollowing ? "person-remove" : "person-add"} 
                    size={18} 
                    color={isFollowing ? "#6B7280" : "white"} 
                  />
                  <Text style={[styles.actionButtonText, isFollowing && styles.followingButtonText]}>
                    {isFollowing ? 'Following' : 'Follow'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
                  <MaterialIcons name="message" size={18} color="white" />
                  <Text style={styles.messageButtonText}>Message</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Content Tabs */}
          <View style={styles.tabsContainer}>
            <View style={styles.tabs}>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
                onPress={() => setActiveTab('posts')}
              >
                <MaterialIcons name="grid-on" size={20} color={activeTab === 'posts' ? '#3B82F6' : '#9CA3AF'} />
                <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>Posts</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'media' && styles.activeTab]}
                onPress={() => setActiveTab('media')}
              >
                <MaterialIcons name="photo-library" size={20} color={activeTab === 'media' ? '#3B82F6' : '#9CA3AF'} />
                <Text style={[styles.tabText, activeTab === 'media' && styles.activeTabText]}>Media</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'likes' && styles.activeTab]}
                onPress={() => setActiveTab('likes')}
              >
                <MaterialIcons name="favorite" size={20} color={activeTab === 'likes' ? '#3B82F6' : '#9CA3AF'} />
                <Text style={[styles.tabText, activeTab === 'likes' && styles.activeTabText]}>Likes</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {activeTab === 'posts' && renderUserPosts()}
            {activeTab === 'media' && renderMediaTab()}
            {activeTab === 'likes' && renderLikesTab()}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    paddingBottom: 20,
  },
  coverPhoto: {
    height: 150,
    backgroundColor: '#1F2937',
    position: 'relative',
  },
  coverGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // The `background` property is for web. For React Native, use `backgroundColor` for solid colors
    // or linear-gradient libraries for gradients. Here, I'm assuming it meant to be a backgroundColor.
    // If a gradient is truly desired, a library like 'react-native-linear-gradient' would be needed.
    backgroundColor: '#3B82F6', // Changed from 'background' to 'backgroundColor' and picked one color
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -40,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#111827',
    overflow: 'hidden', // Added to ensure Image within avatar is clipped by borderRadius
  },
  avatarImage: { // Added style for Image component
    width: '100%',
    height: '100%',
    borderRadius: 40, // Match parent borderRadius
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 8,
    gap: 4,
  },
  liveText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '800',
  },
  userInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  displayName: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },
  username: {
    color: '#9CA3AF',
    fontSize: 16,
    marginBottom: 12,
  },
  bio: {
    color: '#D1D5DB',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  metaInfo: {
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  followButton: {
    backgroundColor: '#3B82F6',
  },
  followingButton: {
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  followingButtonText: {
    color: '#9CA3AF',
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#374151',
    gap: 8,
  },
  messageButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    minHeight: 200,
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
  },
  postThumbnail: {
    width: (width - 52) / 2,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    overflow: 'hidden',
  },
  postPreview: {
    padding: 12,
    minHeight: 80,
  },
  postPreviewText: {
    color: '#D1D5DB',
    fontSize: 12,
    lineHeight: 16,
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 12,
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  postStatText: {
    color: '#9CA3AF',
    fontSize: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    color: '#9CA3AF',
    fontSize: 16,
    marginTop: 12,
  },
});
