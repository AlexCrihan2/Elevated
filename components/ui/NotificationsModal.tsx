import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
  TextInput
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

interface Notification {
  id: string;
  type: 'like' | 'follow' | 'comment' | 'share' | 'mention' | 'post';
  user: {
    name: string;
    avatar: string;
    verified?: boolean;
  };
  content: string;
  timestamp: string;
  unread: boolean;
  actionText?: string;
  onAction: () => void;
}

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
  notificationCount: number;
  onNotificationCountChange: (count: number) => void;
}

export default function NotificationsModal({ 
  visible, 
  onClose, 
  notificationCount, 
  onNotificationCountChange 
}: NotificationsModalProps) {
  const { theme, isDark } = useTheme();
  const [selectedTab, setSelectedTab] = useState<'all' | 'interactions' | 'mentions' | 'posts'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showResponseInput, setShowResponseInput] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');

  // Mock notifications data
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'like',
      user: {
        name: 'Alex Chen',
        avatar: '👨‍💻',
        verified: true
      },
      content: 'liked your post about gene therapy breakthrough',
      timestamp: '5 min ago',
      unread: true,
      actionText: 'Thank',
      onAction: () => {
        setShowResponseInput('1');
        setResponseText('');
      }
    },
    {
      id: '2',
      type: 'follow',
      user: {
        name: 'Maya Rodriguez',
        avatar: '🎨',
        verified: false
      },
      content: 'started following you',
      timestamp: '12 min ago',
      unread: true,
      actionText: 'Welcome',
      onAction: () => {
        setShowResponseInput('2');
        setResponseText('');
      }
    },
    {
      id: '3',
      type: 'comment',
      user: {
        name: 'Dr. Sarah Mitchell',
        avatar: '👩‍⚕️',
        verified: true
      },
      content: 'commented: "Amazing research! This could change everything for genetic disorders."',
      timestamp: '25 min ago',
      unread: true,
      actionText: 'Reply',
      onAction: () => {
        setShowResponseInput('3');
        setResponseText('');
      }
    },
    {
      id: '4',
      type: 'share',
      user: {
        name: 'Chef Marco',
        avatar: '👨‍🍳',
        verified: false
      },
      content: 'shared your post about sustainable cooking practices',
      timestamp: '1 hour ago',
      unread: true,
      actionText: 'Thank',
      onAction: () => {
        setShowResponseInput('4');
        setResponseText('');
      }
    },
    {
      id: '5',
      type: 'mention',
      user: {
        name: 'Aisha Patel',
        avatar: '👩‍🔬',
        verified: true
      },
      content: 'mentioned you in a post about climate research collaboration',
      timestamp: '2 hours ago',
      unread: true,
      actionText: 'Respond',
      onAction: () => {
        setShowResponseInput('5');
        setResponseText('');
      }
    },
    {
      id: '6',
      type: 'like',
      user: {
        name: 'Emma Thompson',
        avatar: '📚',
        verified: false
      },
      content: 'liked your comment on the book discussion thread',
      timestamp: '3 hours ago',
      unread: false,
      actionText: 'Thank',
      onAction: () => {
        setShowResponseInput('6');
        setResponseText('');
      }
    },
    {
      id: '7',
      type: 'post',
      user: {
        name: 'Tech Community',
        avatar: '💻',
        verified: true
      },
      content: 'Your AI workshop post has reached 1,000+ views and 50 reactions!',
      timestamp: '5 hours ago',
      unread: false,
      actionText: 'View',
      onAction: () => {
        setShowResponseInput('7');
        setResponseText('');
      }
    },
    {
      id: '8',
      type: 'follow',
      user: {
        name: 'Lisa Park',
        avatar: '🎭',
        verified: false
      },
      content: 'started following you',
      timestamp: '1 day ago',
      unread: false,
      actionText: 'Welcome',
      onAction: () => {
        setShowResponseInput('8');
        setResponseText('');
      }
    },
    {
      id: '9',
      type: 'like',
      user: {
        name: 'David Kim',
        avatar: '🎵',
        verified: false
      },
      content: 'liked your music recommendation post',
      timestamp: '1 day ago',
      unread: false,
      actionText: 'Thank',
      onAction: () => {
        setShowResponseInput('9');
        setResponseText('');
      }
    },
    {
      id: '10',
      type: 'comment',
      user: {
        name: 'Sophie Chen',
        avatar: '🌟',
        verified: true
      },
      content: 'commented: "Your photography tips are incredibly helpful! Thank you for sharing."',
      timestamp: '2 days ago',
      unread: false,
      actionText: 'Reply',
      onAction: () => {
        setShowResponseInput('10');
        setResponseText('');
      }
    }
  ];

  const tabs = [
    { 
      key: 'all', 
      label: 'All', 
      icon: 'notifications', 
      count: notifications.length 
    },
    { 
      key: 'interactions', 
      label: 'Interactions', 
      icon: 'favorite', 
      count: notifications.filter(n => ['like', 'comment', 'share'].includes(n.type)).length 
    },
    { 
      key: 'mentions', 
      label: 'Mentions', 
      icon: 'alternate-email', 
      count: notifications.filter(n => n.type === 'mention').length 
    },
    { 
      key: 'posts', 
      label: 'Posts', 
      icon: 'article', 
      count: notifications.filter(n => n.type === 'post').length 
    }
  ];

  const getFilteredNotifications = () => {
    let filtered = notifications;
    
    if (selectedTab === 'interactions') {
      filtered = filtered.filter(notification => ['like', 'comment', 'share'].includes(notification.type));
    } else if (selectedTab === 'mentions') {
      filtered = filtered.filter(notification => notification.type === 'mention');
    } else if (selectedTab === 'posts') {
      filtered = filtered.filter(notification => notification.type === 'post');
    }
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(notification =>
        notification.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const handleMarkAllRead = () => {
    Alert.alert(
      'Mark All as Read',
      'This will mark all notifications as read. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Mark All Read', 
          onPress: () => {
            onNotificationCountChange(0);
            Alert.alert('✅ Done', 'All notifications cleared');
          }
        }
      ]
    );
  };

  const handleSendResponse = () => {
    if (responseText.trim() && showResponseInput) {
      const notification = notifications.find(n => n.id === showResponseInput);
      Alert.alert(
        '✅ Response Sent',
        `Your response "${responseText.trim()}" has been sent to ${notification?.user.name}!`
      );
      setResponseText('');
      setShowResponseInput(null);
      // Mark notification as read
      if (notification?.unread) {
        onNotificationCountChange(Math.max(0, notificationCount - 1));
      }
    }
  };

  const handleThankAll = () => {
    const interactionCount = notifications.filter(n => ['like', 'comment', 'share', 'follow'].includes(n.type) && n.unread).length;
    Alert.alert(
      'Thank All Recent Interactions',
      `This will open individual response inputs for ${interactionCount} recent interactions so you can write personalized thank you messages.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start Responding', 
          onPress: () => {
            Alert.alert('Response Mode', 'Tap any notification to write your own personalized response!');
          }
        }
      ]
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return 'favorite';
      case 'follow': return 'person-add';
      case 'comment': return 'chat-bubble';
      case 'share': return 'share';
      case 'mention': return 'alternate-email';
      case 'post': return 'trending-up';
      default: return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'like': return '#EF4444';
      case 'follow': return '#10B981';
      case 'comment': return '#3B82F6';
      case 'share': return '#F59E0B';
      case 'mention': return '#8B5CF6';
      case 'post': return '#06B6D4';
      default: return '#6B7280';
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        { 
          backgroundColor: item.unread ? theme.colors.inputBackground : theme.colors.surface,
          borderBottomColor: theme.colors.border 
        }
      ]}
      onPress={item.onAction}
    >
      <View style={styles.notificationAvatar}>
        <Text style={styles.notificationAvatarText}>{item.user.avatar}</Text>
        {item.unread && <View style={styles.unreadDot} />}
        <View style={[styles.typeIndicator, { backgroundColor: getNotificationColor(item.type) }]}>
          <MaterialIcons 
            name={getNotificationIcon(item.type) as any} 
            size={12} 
            color="white" 
          />
        </View>
      </View>
      
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.colors.text }]} numberOfLines={1}>
              {item.user.name}
            </Text>
            {item.user.verified && (
              <MaterialIcons name="verified" size={14} color="#1DA1F2" />
            )}
          </View>
          <Text style={[styles.notificationTimestamp, { color: theme.colors.textSecondary }]}>
            {item.timestamp}
          </Text>
        </View>
        
        <Text 
          style={[
            styles.notificationText, 
            { 
              color: item.unread ? theme.colors.text : theme.colors.textSecondary,
              fontWeight: item.unread ? '500' : '400'
            }
          ]} 
          numberOfLines={2}
        >
          {item.content}
        </Text>
      </View>
      
      <View style={styles.notificationActions}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: getNotificationColor(item.type) }]}
          onPress={item.onAction}
          activeOpacity={0.8}
        >
          <MaterialIcons 
            name={item.type === 'like' ? 'favorite' : item.type === 'comment' ? 'reply' : item.type === 'follow' ? 'waving-hand' : 'send'} 
            size={12} 
            color="white" 
          />
          <Text style={styles.actionButtonText}>{item.actionText || 'View'}</Text>
        </TouchableOpacity>
      </View>
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
            <View style={styles.headerTitle}>
              <Text style={[styles.titleText, { color: theme.colors.text }]}>Notifications</Text>
              {notificationCount > 0 && (
                <View style={styles.headerBadge}>
                  <Text style={styles.headerBadgeText}>{notificationCount > 99 ? '99+' : notificationCount}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity style={styles.headerAction} onPress={() => Alert.alert('Settings', 'Notification settings opened')}>
              <MaterialIcons name="settings" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          {/* Search Input */}
          <View style={[styles.searchContainer, { backgroundColor: theme.colors.inputBackground }]}>
            <MaterialIcons name="search" size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Search notifications..."
              placeholderTextColor={theme.colors.placeholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
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
          <View style={styles.tabs}>
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
                {tab.count > 0 && (
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
                )}
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: theme.colors.inputBackground }]}
              onPress={handleThankAll}
            >
              <MaterialIcons name="favorite" size={16} color="#EF4444" />
              <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>Thank All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: theme.colors.inputBackground }]}
              onPress={handleMarkAllRead}
            >
              <MaterialIcons name="done-all" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.actionBtnText, { color: theme.colors.textSecondary }]}>Mark Read</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications List */}
        <View style={styles.notificationsContainer}>
          {getFilteredNotifications().length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="notifications-none" size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                {searchQuery.trim() ? 'No notifications found' : 'No notifications yet'}
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                {searchQuery.trim() 
                  ? 'Try different keywords or check other tabs'
                  : 'When people interact with your content, you\'ll see notifications here'
                }
              </Text>
            </View>
          ) : (
            <FlatList
              data={getFilteredNotifications()}
              renderItem={renderNotification}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.notificationsList}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  headerBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
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
    minWidth: 18,
    alignItems: 'center',
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  notificationsContainer: {
    flex: 1,
  },
  notificationsList: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderBottomWidth: 0.5,
    gap: 12,
  },
  notificationAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationAvatarText: {
    fontSize: 24,
  },
  unreadDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: 'white',
  },
  typeIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  notificationTimestamp: {
    fontSize: 12,
    marginLeft: 8,
  },
  notificationText: {
    fontSize: 14,
    lineHeight: 18,
  },
  notificationActions: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 70,
    justifyContent: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
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
  // Response input styles
  responseContainer: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  responseInput: {
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  responseActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  responseButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sendButton: {
    // backgroundColor handled by notification type color
  },
  responseButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});