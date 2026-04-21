
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Post } from '@/types/social';

interface EnhancedPostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string, comment: string) => void;
  onShare?: (postId: string) => void;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  verified?: boolean;
}

const { width } = Dimensions.get('window');

const MUSTARD_THEME = {
  primary: '#DAA520',
  secondary: '#B8860B',
  background: '#F5F5DC',
  surface: '#FFF8DC',
  text: '#2D1B00',
  textSecondary: '#5D4E37',
  accent: '#FF8C42',
  border: '#DDD8C7'
};

export default function EnhancedPostCard({ post, onLike, onComment, onShare }: EnhancedPostCardProps) {
  const [showLikers, setShowLikers] = useState(false);
  const [showCommenters, setShowCommenters] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [commentCount, setCommentCount] = useState(post.comments || 0);

  // Enhanced emoji reactions
  const reactions = [
    { emoji: '❤️', name: 'Love', color: '#FF4757', count: 45 },
    { emoji: '😂', name: 'Laugh', color: '#FFA502', count: 23 },
    { emoji: '🔥', name: 'Fire', color: '#FF6B35', count: 18 },
    { emoji: '💯', name: 'Perfect', color: '#5F27CD', count: 12 },
    { emoji: '👏', name: 'Clap', color: '#00D2D3', count: 8 }
  ];

  // Mock data for users who interacted
  const likers: User[] = [
    { id: '1', name: 'Sarah Johnson', avatar: '👩‍💼', verified: true },
    { id: '2', name: 'Mike Chen', avatar: '👨‍💻', verified: false },
    { id: '3', name: 'Emma Wilson', avatar: '👩‍🎨', verified: true },
    { id: '4', name: 'Alex Rodriguez', avatar: '👨‍🚀', verified: false },
    { id: '5', name: 'Lisa Park', avatar: '👩‍🔬', verified: true }
  ];

  const commenters: User[] = [
    { id: '1', name: 'John Doe', avatar: '👨‍🎨', verified: false }, // Changed from 👨‍🎯 to 👨‍🎨 as 🎯 is an invalid character in JS strings
    { id: '2', name: 'Jane Smith', avatar: '👩‍🎭', verified: true },
    { id: '3', name: 'Bob Wilson', avatar: '👨‍🎪', verified: false },
    { id: '4', name: 'Alice Brown', avatar: '👩‍🎤', verified: true }
  ];

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
    onLike?.(post.id);
  };

  // Generate user avatars for different interaction types
  const generateUserAvatars = (count: number, type: 'likes' | 'comments' | 'shares') => {
    const avatarSets = {
      likes: ['👩‍💼', '👨‍💻', '👩‍🎨', '👨‍🚀', '👩‍🔬', '👨‍⚕️', '👩‍🏫', '👨‍🎓', '👩‍💻', '👨‍🎨'],
      comments: ['👩‍🎭', '👨‍🎪', '👩‍🎤', '👨‍🎼', '👩‍🎯', '👨‍🏆', '👩‍🏋️', '👨‍🎮', '👩‍🌾', '👨‍🍳'],
      shares: ['👩‍✈️', '👨‍🔧', '👩‍🔬', '👨‍🚒', '👩‍⚖️', '👨‍🌾', '👩‍🚀', '👨‍💼', '👩‍🎨', '👨‍💻']
    };

    const selectedAvatars = [];
    for (let i = 0; i < count; i++) {
      selectedAvatars.push(avatarSets[type][i % avatarSets[type].length]);
    }
    return selectedAvatars;
  };

  const renderUserCard = (user: User) => (
    <View key={user.id} style={styles.userCard}>
      <View style={styles.userAvatar}>
        <Text style={styles.userAvatarText}>{user.avatar}</Text>
      </View>
      <View style={styles.userInfo}>
        <View style={styles.userNameRow}>
          <Text style={styles.userName}>{user.name}</Text>
          {user.verified && (
            <MaterialIcons name="verified" size={16} color={MUSTARD_THEME.primary} />
          )}
        </View>
        <Text style={styles.userHandle}>@{user.name.toLowerCase().replace(' ', '')}</Text>
      </View>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>Follow</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Post Header */}
      <View style={styles.header}>
        <View style={styles.authorInfo}>
          <View style={styles.authorAvatar}>
            <Text style={styles.authorAvatarText}>{post.author.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.authorName}>{post.author}</Text>
            <Text style={styles.timestamp}>{post.timestamp}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <MaterialIcons name="more-horiz" size={24} color={MUSTARD_THEME.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <View style={styles.content}>
        <Text style={styles.contentText}>{post.content}</Text>
        
      {/* User Interaction Avatars */}
      <View style={styles.interactionAvatarsSection}>
        {/* Likes Avatars */}
        {likeCount > 0 && (
          <View style={styles.avatarGroup}>
            <View style={styles.avatarStack}>
              {generateUserAvatars(Math.min(likeCount, 4), 'likes').map((avatar, index) => (
                <TouchableOpacity 
                  key={`like-avatar-${index}`}
                  style={[
                    styles.interactionAvatar,
                    { 
                      zIndex: 4 - index, 
                      marginLeft: index > 0 ? -12 : 0,
                      borderColor: reactions.find(r => r.name === 'Love')?.color || '#FF4757'
                    }
                  ]}
                  onPress={() => setShowLikers(true)}
                >
                  <Text style={styles.avatarEmoji}>{avatar}</Text>
                </TouchableOpacity>
              ))}
              {likeCount > 4 && (
                <TouchableOpacity 
                  style={[styles.interactionAvatar, styles.moreAvatarBubble, { marginLeft: -12 }]}
                  onPress={() => setShowLikers(true)}
                >
                  <Text style={styles.moreAvatarText}>+{likeCount - 4}</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.avatarInfo}>
              <MaterialIcons name="favorite" size={12} color="#FF4757" />
              <Text style={styles.avatarInfoText}>❤️ {likeCount}</Text>
            </View>
          </View>
        )}

        {/* Comments Avatars */}
        {commentCount > 0 && (
          <View style={styles.avatarGroup}>
            <View style={styles.avatarStack}>
              {generateUserAvatars(Math.min(commentCount, 4), 'comments').map((avatar, index) => (
                <TouchableOpacity 
                  key={`comment-avatar-${index}`}
                  style={[
                    styles.interactionAvatar,
                    { 
                      zIndex: 4 - index, 
                      marginLeft: index > 0 ? -12 : 0,
                      borderColor: MUSTARD_THEME.primary
                    }
                  ]}
                  onPress={() => setShowCommenters(true)}
                >
                  <Text style={styles.avatarEmoji}>{avatar}</Text>
                </TouchableOpacity>
              ))}
              {commentCount > 4 && (
                <TouchableOpacity 
                  style={[styles.interactionAvatar, styles.moreAvatarBubble, { marginLeft: -12 }]}
                  onPress={() => setShowCommenters(true)}
                >
                  <Text style={styles.moreAvatarText}>+{commentCount - 4}</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.avatarInfo}>
              <MaterialIcons name="chat-bubble" size={12} color={MUSTARD_THEME.primary} />
              <Text style={styles.avatarInfoText}>💬 {commentCount}</Text>
            </View>
          </View>
        )}

        {/* Shares Avatars */}
        {(post.shares || 0) > 0 && (
          <View style={styles.avatarGroup}>
            <View style={styles.avatarStack}>
              {generateUserAvatars(Math.min(post.shares || 0, 4), 'shares').map((avatar, index) => (
                <TouchableOpacity 
                  key={`share-avatar-${index}`}
                  style={[
                    styles.interactionAvatar,
                    { 
                      zIndex: 4 - index, 
                      marginLeft: index > 0 ? -12 : 0,
                      borderColor: '#8B5CF6'
                    }
                  ]}
                >
                  <Text style={styles.avatarEmoji}>{avatar}</Text>
                </TouchableOpacity>
              ))}
              {(post.shares || 0) > 4 && (
                <TouchableOpacity 
                  style={[styles.interactionAvatar, styles.moreAvatarBubble, { marginLeft: -12 }]}
                >
                  <Text style={styles.moreAvatarText}>+{(post.shares || 0) - 4}</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.avatarInfo}>
              <MaterialIcons name="share" size={12} color="#8B5CF6" />
              <Text style={styles.avatarInfoText}>🔄 {post.shares || 0}</Text>
            </View>
          </View>
        )}
      </View>
      </View>

      {/* Engagement Stats */}
      <View style={styles.stats}>
        <TouchableOpacity 
          style={styles.statItem} 
          onPress={() => setShowLikers(true)}
        >
          <MaterialIcons name="favorite" size={16} color={MUSTARD_THEME.primary} />
          <Text style={styles.statText}>{likeCount} likes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.statItem}
          onPress={() => setShowCommenters(true)}
        >
          <MaterialIcons name="chat-bubble" size={16} color={MUSTARD_THEME.primary} />
          <Text style={styles.statText}>{commentCount} comments</Text>
        </TouchableOpacity>
        
        <View style={styles.statItem}>
          <MaterialIcons name="share" size={16} color={MUSTARD_THEME.primary} />
          <Text style={styles.statText}>{post.shares || 0} shares</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, liked && styles.actionButtonActive]}
          onPress={handleLike}
        >
          <MaterialIcons 
            name={liked ? "favorite" : "favorite-border"} 
            size={24} 
            color={liked ? MUSTARD_THEME.primary : MUSTARD_THEME.textSecondary} 
          />
          <Text style={[styles.actionText, liked && styles.actionTextActive]}>Like</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="chat-bubble-outline" size={24} color={MUSTARD_THEME.textSecondary} />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={() => onShare?.(post.id)}>
          <MaterialIcons name="share" size={24} color={MUSTARD_THEME.textSecondary} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="bookmark-border" size={24} color={MUSTARD_THEME.textSecondary} />
          <Text style={styles.actionText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Likers Modal */}
      <Modal visible={showLikers} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>People who liked this</Text>
            <TouchableOpacity onPress={() => setShowLikers(false)}>
              <MaterialIcons name="close" size={24} color={MUSTARD_THEME.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {likers.map(user => renderUserCard(user))}
          </ScrollView>
        </View>
      </Modal>

      {/* Commenters Modal */}
      <Modal visible={showCommenters} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>People who commented</Text>
            <TouchableOpacity onPress={() => setShowCommenters(false)}>
              <MaterialIcons name="close" size={24} color={MUSTARD_THEME.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {commenters.map(user => renderUserCard(user))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: MUSTARD_THEME.surface,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 16,
    shadowColor: MUSTARD_THEME.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: MUSTARD_THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  authorAvatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: MUSTARD_THEME.text,
  },
  timestamp: {
    fontSize: 12,
    color: MUSTARD_THEME.textSecondary,
    marginTop: 2,
  },
  moreButton: {
    padding: 8,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: MUSTARD_THEME.text,
    marginBottom: 12,
  },
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 8,
  },
  reactionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MUSTARD_THEME.background,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  reactionEmoji: {
    fontSize: 16,
  },
  reactionCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: MUSTARD_THEME.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: MUSTARD_THEME.textSecondary,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: MUSTARD_THEME.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 4,
  },
  actionButtonActive: {
    backgroundColor: `${MUSTARD_THEME.primary}20`,
  },
  actionText: {
    fontSize: 14,
    color: MUSTARD_THEME.textSecondary,
    fontWeight: '500',
  },
  actionTextActive: {
    color: MUSTARD_THEME.primary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: MUSTARD_THEME.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: MUSTARD_THEME.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: MUSTARD_THEME.text,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MUSTARD_THEME.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: MUSTARD_THEME.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: MUSTARD_THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 16,
    color: 'white',
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: MUSTARD_THEME.text,
  },
  userHandle: {
    fontSize: 14,
    color: MUSTARD_THEME.textSecondary,
    marginTop: 2,
  },
  followButton: {
    backgroundColor: MUSTARD_THEME.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  followButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // User Interaction Avatars
  interactionAvatarsSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  interactionAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: MUSTARD_THEME.surface,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: MUSTARD_THEME.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  moreAvatarBubble: {
    backgroundColor: MUSTARD_THEME.primary,
    borderColor: MUSTARD_THEME.primary,
  },
  avatarEmoji: {
    fontSize: 14,
  },
  moreAvatarText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
  avatarInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  avatarInfoText: {
    fontSize: 12,
    color: MUSTARD_THEME.textSecondary,
    fontWeight: '600',
  },
});
