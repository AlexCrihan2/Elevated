import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar,
  SafeAreaView, TextInput, FlatList, Image, Animated, Dimensions, Modal, Alert
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  online: boolean;
  isGroup?: boolean;
  verified?: boolean;
  isFacebook?: boolean;
  facebookPhoto?: string;
  members?: GroupMember[];
  description?: string;
}

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'member';
  online: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
  photo?: string;
  type?: 'text' | 'photo' | 'facebook_post';
  facebookPost?: {
    content: string;
    photo: string;
    likes: number;
    comments: number;
  };
  reactions?: string[];
}

interface FacebookNotification {
  id: string;
  type: 'post' | 'photo' | 'story' | 'live';
  author: string;
  authorAvatar: string;
  content: string;
  photo?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  platform: 'facebook';
  seen: boolean;
}

const mockGroupMembers: GroupMember[] = [
  { id: '1', name: 'Alice Johnson', avatar: '👩‍🎨', role: 'admin', online: true },
  { id: '2', name: 'Bob Smith', avatar: '👨‍💻', role: 'member', online: true },
  { id: '3', name: 'Carol Davis', avatar: '👩‍🔬', role: 'member', online: false },
  { id: '4', name: 'David Wilson', avatar: '👨‍🎓', role: 'member', online: true },
];

const facebookNotifications: FacebookNotification[] = [
  {
    id: 'fb1',
    type: 'photo',
    author: 'Alex Thompson',
    authorAvatar: '👨‍💼',
    content: 'Just posted a new photo from the summit! 🏔️ Amazing views from the top. The journey was tough but totally worth it!',
    photo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    timestamp: '2 min ago',
    likes: 247,
    comments: 38,
    shares: 12,
    platform: 'facebook',
    seen: false,
  },
  {
    id: 'fb2',
    type: 'post',
    author: 'Alex Thompson',
    authorAvatar: '👨‍💼',
    content: 'Excited to announce my new project launching next week! Stay tuned for something amazing. #innovation #tech #launch',
    photo: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80',
    timestamp: '1 hour ago',
    likes: 512,
    comments: 87,
    shares: 34,
    platform: 'facebook',
    seen: false,
  },
  {
    id: 'fb3',
    type: 'story',
    author: 'Alex Thompson',
    authorAvatar: '👨‍💼',
    content: 'Morning routine vibes ☀️ Starting the day with gratitude and coffee!',
    photo: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
    timestamp: '3 hours ago',
    likes: 189,
    comments: 22,
    shares: 5,
    platform: 'facebook',
    seen: true,
  },
  {
    id: 'fb4',
    type: 'live',
    author: 'Alex Thompson',
    authorAvatar: '👨‍💼',
    content: 'LIVE: Q&A Session - Ask me anything about entrepreneurship and building successful startups!',
    timestamp: 'Yesterday',
    likes: 1024,
    comments: 203,
    shares: 67,
    platform: 'facebook',
    seen: true,
  },
];

const mockChats: Chat[] = [
  {
    id: 'fb-notif',
    name: 'Alex Thompson • Facebook',
    avatar: '👨‍💼',
    lastMessage: '📸 Posted a new photo',
    timestamp: '2m',
    unreadCount: 3,
    online: true,
    verified: true,
    isFacebook: true,
    facebookPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
  },
  {
    id: '1',
    name: 'AlexHub Community',
    avatar: '🌐',
    lastMessage: 'Welcome to AlexHub! Connect and share.',
    timestamp: '5m',
    unreadCount: 5,
    online: true,
    isGroup: true,
    verified: true,
    members: mockGroupMembers,
    description: 'Official AlexHub community hub',
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    avatar: '👩‍🎨',
    lastMessage: 'Your latest post is amazing! 🔥',
    timestamp: '15m',
    unreadCount: 1,
    online: true,
    verified: false,
  },
  {
    id: '3',
    name: 'Tech Creators Hub',
    avatar: '🚀',
    lastMessage: 'New opportunities available this week',
    timestamp: '1h',
    unreadCount: 0,
    online: false,
    isGroup: true,
    members: mockGroupMembers.slice(0, 3),
    description: 'Professional network for tech creators',
  },
  {
    id: '4',
    name: 'Michael Brown',
    avatar: '👨‍🔬',
    lastMessage: 'Loved the live stream yesterday!',
    timestamp: '2h',
    unreadCount: 0,
    online: true,
    verified: true,
  },
  {
    id: '5',
    name: 'Global Creators',
    avatar: '🌍',
    lastMessage: 'Monthly challenge starts tomorrow',
    timestamp: '1d',
    unreadCount: 2,
    online: false,
    isGroup: true,
    members: mockGroupMembers.slice(1, 4),
    description: 'Connecting creators worldwide',
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Hey! Just saw your latest Facebook post - incredible! 🔥',
    sender: 'other',
    timestamp: '10:30 AM',
    type: 'text',
    reactions: ['❤️', '🔥'],
  },
  {
    id: '2',
    text: 'Thank you so much! I worked really hard on that content 😊',
    sender: 'me',
    timestamp: '10:32 AM',
    type: 'text',
  },
  {
    id: 'fb-share',
    text: 'Check out my latest Facebook post!',
    sender: 'other',
    timestamp: '10:33 AM',
    type: 'facebook_post',
    facebookPost: {
      content: 'Just posted a new photo from the summit! 🏔️ Amazing views from the top.',
      photo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
      likes: 247,
      comments: 38,
    },
  },
  {
    id: '3',
    text: 'The engagement on your posts is always incredible. What is your secret?',
    sender: 'other',
    timestamp: '10:35 AM',
    type: 'text',
  },
  {
    id: '4',
    text: 'Consistency and authenticity! Always show the real you 💪',
    sender: 'me',
    timestamp: '10:36 AM',
    type: 'text',
    reactions: ['👏'],
  },
];

export default function AlexHubScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'groups' | 'direct' | 'facebook'>('all');
  const [showFBNotifications, setShowFBNotifications] = useState(false);
  const [fbNotifications, setFbNotifications] = useState<FacebookNotification[]>(facebookNotifications);
  const [showPostNotification, setShowPostNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<FacebookNotification | null>(null);
  const [showReactions, setShowReactions] = useState<string | null>(null);

  // Notification animation
  const notifSlideAnim = useRef(new Animated.Value(-200)).current;
  const notifOpacity = useRef(new Animated.Value(0)).current;

  // Simulate incoming Facebook post notification
  useEffect(() => {
    const timer = setTimeout(() => {
      const newNotif = facebookNotifications[0];
      setCurrentNotification(newNotif);
      showNotificationBanner();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const showNotificationBanner = () => {
    setShowPostNotification(true);
    Animated.parallel([
      Animated.spring(notifSlideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.timing(notifOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      dismissNotification();
    }, 5000);
  };

  const dismissNotification = () => {
    Animated.parallel([
      Animated.timing(notifSlideAnim, {
        toValue: -200,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(notifOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setShowPostNotification(false));
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      text: messageText.trim(),
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
    };
    setMessages(prev => [...prev, newMsg]);
    setMessageText('');
  };

  const markFBNotifSeen = (id: string) => {
    setFbNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, seen: true } : n)
    );
  };

  const unreadFBCount = fbNotifications.filter(n => !n.seen).length;

  const getFilteredChats = () => {
    let chats = mockChats;
    if (activeTab === 'groups') chats = chats.filter(c => c.isGroup);
    else if (activeTab === 'direct') chats = chats.filter(c => !c.isGroup && !c.isFacebook);
    else if (activeTab === 'facebook') chats = chats.filter(c => c.isFacebook);
    if (searchQuery) {
      chats = chats.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return chats;
  };

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={[
        styles.chatItem,
        {
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
          borderColor: isDark ? '#334155' : '#E5E7EB',
        },
        item.isFacebook && styles.facebookChatItem,
      ]}
      onPress={() => {
        if (item.isFacebook) setShowFBNotifications(true);
        else setSelectedChat(item);
      }}
    >
      <View style={styles.avatarContainer}>
        {item.facebookPhoto ? (
          <Image source={{ uri: item.facebookPhoto }} style={styles.avatarImage} />
        ) : (
          <LinearGradient
            colors={item.isFacebook ? ['#1877F2', '#3B5998'] : item.isGroup ? ['#667eea', '#764ba2'] : ['#f093fb', '#f5576c']}
            style={styles.avatarGradient}
          >
            <Text style={styles.avatarText}>{item.avatar}</Text>
          </LinearGradient>
        )}
        {item.online && !item.isGroup && (
          <View style={[styles.onlineIndicator, item.isFacebook && styles.fbOnlineIndicator]} />
        )}
        {item.isFacebook && (
          <View style={styles.facebookBadge}>
            <FontAwesome5 name="facebook" size={10} color="#FFFFFF" />
          </View>
        )}
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <View style={styles.chatNameRow}>
            <Text style={[styles.chatName, { color: isDark ? '#F1F5F9' : '#1F2937' }]} numberOfLines={1}>
              {item.name}
            </Text>
            {item.verified && (
              <MaterialIcons name="verified" size={14} color="#1877F2" style={styles.verifiedIcon} />
            )}
          </View>
          <Text style={[styles.timestamp, { color: isDark ? '#94A3B8' : '#9CA3AF' }]}>{item.timestamp}</Text>
        </View>
        <View style={styles.chatFooter}>
          <Text
            style={[
              styles.lastMessage,
              { color: isDark ? '#94A3B8' : '#6B7280' },
              item.unreadCount > 0 && { color: isDark ? '#E2E8F0' : '#111827', fontWeight: '600' },
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={[styles.unreadBadge, item.isFacebook && styles.fbUnreadBadge]}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: Message }) => {
    if (item.type === 'facebook_post' && item.facebookPost) {
      return (
        <View style={[styles.messageContainer, styles.otherMessage]}>
          <View style={styles.fbPostCard}>
            <View style={styles.fbPostHeader}>
              <FontAwesome5 name="facebook" size={16} color="#1877F2" />
              <Text style={styles.fbPostLabel}>Facebook Post</Text>
            </View>
            {item.facebookPost.photo ? (
              <Image source={{ uri: item.facebookPost.photo }} style={styles.fbPostImage} />
            ) : null}
            <Text style={styles.fbPostContent} numberOfLines={3}>{item.facebookPost.content}</Text>
            <View style={styles.fbPostStats}>
              <View style={styles.fbPostStat}>
                <MaterialIcons name="thumb-up" size={14} color="#1877F2" />
                <Text style={styles.fbPostStatText}>{item.facebookPost.likes}</Text>
              </View>
              <View style={styles.fbPostStat}>
                <MaterialIcons name="chat-bubble-outline" size={14} color="#6B7280" />
                <Text style={styles.fbPostStatText}>{item.facebookPost.comments}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.messageTime}>{item.timestamp}</Text>
        </View>
      );
    }

    return (
      <View style={[styles.messageContainer, item.sender === 'me' ? styles.myMessage : styles.otherMessage]}>
        <TouchableOpacity
          style={[
            styles.messageBubble,
            item.sender === 'me' ? styles.myMessageBubble : [styles.otherMessageBubble, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }],
          ]}
          onLongPress={() => setShowReactions(item.id)}
        >
          <Text style={[styles.messageText, item.sender === 'me' ? styles.myMessageText : { color: isDark ? '#F1F5F9' : '#1F2937' }]}>
            {item.text}
          </Text>
        </TouchableOpacity>
        {item.reactions && item.reactions.length > 0 && (
          <View style={[styles.reactionsContainer, item.sender === 'me' && styles.reactionsRight]}>
            <Text style={styles.reactionsText}>{item.reactions.join(' ')}</Text>
          </View>
        )}
        <Text style={[styles.messageTime, item.sender === 'me' && styles.myMessageTime]}>
          {item.timestamp}
        </Text>
      </View>
    );
  };

  const renderFBNotification = (notif: FacebookNotification) => (
    <TouchableOpacity
      key={notif.id}
      style={[
        styles.fbNotifCard,
        !notif.seen && styles.fbNotifUnread,
        { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' },
      ]}
      onPress={() => markFBNotifSeen(notif.id)}
    >
      <View style={styles.fbNotifLeft}>
        <View style={styles.fbNotifAvatarWrap}>
          <LinearGradient colors={['#1877F2', '#3B5998']} style={styles.fbNotifAvatar}>
            <Text style={{ fontSize: 20 }}>{notif.authorAvatar}</Text>
          </LinearGradient>
          <View style={styles.fbNotifTypeBadge}>
            {notif.type === 'photo' && <MaterialIcons name="photo" size={10} color="#FFF" />}
            {notif.type === 'post' && <MaterialIcons name="article" size={10} color="#FFF" />}
            {notif.type === 'story' && <MaterialIcons name="auto-stories" size={10} color="#FFF" />}
            {notif.type === 'live' && <MaterialIcons name="live-tv" size={10} color="#FFF" />}
          </View>
        </View>
      </View>

      <View style={styles.fbNotifContent}>
        <View style={styles.fbNotifHeader}>
          <Text style={[styles.fbNotifAuthor, { color: isDark ? '#F1F5F9' : '#1F2937' }]}>
            {notif.author}
          </Text>
          {!notif.seen && <View style={styles.fbUnreadDot} />}
        </View>
        <Text style={[styles.fbNotifText, { color: isDark ? '#CBD5E1' : '#6B7280' }]} numberOfLines={2}>
          {notif.content}
        </Text>
        {notif.photo ? (
          <Image source={{ uri: notif.photo }} style={styles.fbNotifPhoto} />
        ) : null}
        <View style={styles.fbNotifStats}>
          <View style={styles.fbNotifStat}>
            <MaterialIcons name="thumb-up" size={12} color="#1877F2" />
            <Text style={styles.fbNotifStatText}>{notif.likes}</Text>
          </View>
          <View style={styles.fbNotifStat}>
            <MaterialIcons name="chat-bubble-outline" size={12} color="#6B7280" />
            <Text style={styles.fbNotifStatText}>{notif.comments}</Text>
          </View>
          <View style={styles.fbNotifStat}>
            <MaterialIcons name="share" size={12} color="#6B7280" />
            <Text style={styles.fbNotifStatText}>{notif.shares}</Text>
          </View>
          <Text style={[styles.fbNotifTime, { color: isDark ? '#64748B' : '#9CA3AF' }]}>{notif.timestamp}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* ── FACEBOOK POST NOTIFICATION BANNER ── */}
      {showPostNotification && currentNotification && (
        <Animated.View
          style={[
            styles.notifBanner,
            {
              transform: [{ translateY: notifSlideAnim }],
              opacity: notifOpacity,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.notifBannerInner}
            onPress={() => {
              dismissNotification();
              setShowFBNotifications(true);
            }}
          >
            <LinearGradient colors={['#1877F2', '#3B5998']} style={styles.notifBannerGradient}>
              <View style={styles.notifBannerLeft}>
                <View style={styles.notifBannerIconWrap}>
                  <FontAwesome5 name="facebook" size={18} color="#FFFFFF" />
                </View>
                <View style={styles.notifBannerTextWrap}>
                  <Text style={styles.notifBannerTitle} numberOfLines={1}>
                    {currentNotification.author} posted on Facebook
                  </Text>
                  <Text style={styles.notifBannerBody} numberOfLines={2}>
                    {currentNotification.content}
                  </Text>
                </View>
              </View>
              {currentNotification.photo ? (
                <Image source={{ uri: currentNotification.photo }} style={styles.notifBannerPhoto} />
              ) : null}
              <TouchableOpacity style={styles.notifBannerClose} onPress={dismissNotification}>
                <MaterialIcons name="close" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}

      {!selectedChat && !showFBNotifications ? (
        /* ── CHAT LIST ── */
        <View style={styles.chatListContainer}>
          {/* AlexHub Header */}
          <LinearGradient colors={['#1877F2', '#764ba2']} style={styles.alexHubHeader}>
            <View style={styles.headerTop}>
              <View style={styles.headerBrand}>
                <View style={styles.headerLogo}>
                  <Text style={styles.headerLogoText}>A</Text>
                </View>
                <View>
                  <Text style={styles.headerBrandName}>AlexHub</Text>
                  <Text style={styles.headerBrandSub}>Your connected world</Text>
                </View>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={styles.headerAction}
                  onPress={() => setShowFBNotifications(true)}
                >
                  <FontAwesome5 name="facebook-messenger" size={22} color="#FFFFFF" />
                  {unreadFBCount > 0 && (
                    <View style={styles.headerActionBadge}>
                      <Text style={styles.headerActionBadgeText}>{unreadFBCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerAction}>
                  <MaterialIcons name="edit" size={22} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Search */}
            <View style={styles.headerSearch}>
              <MaterialIcons name="search" size={18} color="#94A3B8" />
              <TextInput
                style={styles.headerSearchInput}
                placeholder="Search AlexHub..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </LinearGradient>

          {/* Tabs */}
          <View style={[styles.tabsBar, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderBottomColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
            {[
              { key: 'all', label: 'All', icon: 'apps' },
              { key: 'facebook', label: 'Facebook', icon: null, fbIcon: true },
              { key: 'groups', label: 'Groups', icon: 'group' },
              { key: 'direct', label: 'Direct', icon: 'person' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, activeTab === tab.key && styles.activeTab]}
                onPress={() => setActiveTab(tab.key as any)}
              >
                {tab.fbIcon ? (
                  <FontAwesome5 name="facebook" size={14} color={activeTab === tab.key ? '#FFFFFF' : '#6B7280'} />
                ) : (
                  <MaterialIcons name={tab.icon as any} size={14} color={activeTab === tab.key ? '#FFFFFF' : '#6B7280'} />
                )}
                <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                  {tab.label}
                </Text>
                {tab.key === 'facebook' && unreadFBCount > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{unreadFBCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Online Users */}
          <View style={[styles.onlineBar, { backgroundColor: isDark ? '#0F172A' : '#FFFFFF', borderBottomColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.onlineBarContent}>
              {mockChats.filter(c => c.online).map((c) => (
                <TouchableOpacity key={c.id} style={styles.onlineUser} onPress={() => setSelectedChat(c)}>
                  <LinearGradient
                    colors={c.isFacebook ? ['#1877F2', '#3B5998'] : ['#667eea', '#764ba2']}
                    style={styles.onlineUserAvatar}
                  >
                    <Text style={{ fontSize: 18 }}>{c.avatar}</Text>
                    <View style={styles.onlineDot} />
                  </LinearGradient>
                  <Text style={[styles.onlineUserName, { color: isDark ? '#CBD5E1' : '#374151' }]} numberOfLines={1}>
                    {c.name.split(' ')[0]}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Chat List */}
          <FlatList
            data={getFilteredChats()}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.chatList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : showFBNotifications ? (
        /* ── FACEBOOK NOTIFICATIONS PANEL ── */
        <View style={{ flex: 1 }}>
          <LinearGradient colors={['#1877F2', '#3B5998']} style={styles.fbPanelHeader}>
            <TouchableOpacity style={styles.fbPanelBack} onPress={() => setShowFBNotifications(false)}>
              <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View>
              <Text style={styles.fbPanelTitle}>Facebook Posts</Text>
              <Text style={styles.fbPanelSub}>Alex Thompson's activity</Text>
            </View>
            <View style={styles.fbPanelIcon}>
              <FontAwesome5 name="facebook" size={22} color="#FFFFFF" />
            </View>
          </LinearGradient>

          <ScrollView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
            contentContainerStyle={styles.fbNotifList}
            showsVerticalScrollIndicator={false}
          >
            <Text style={[styles.fbNotifSectionTitle, { color: isDark ? '#94A3B8' : '#6B7280' }]}>
              Recent Posts & Activity
            </Text>
            {fbNotifications.map(renderFBNotification)}
          </ScrollView>
        </View>
      ) : (
        /* ── CHAT DETAIL ── */
        <View style={{ flex: 1, backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }}>
          {/* Chat Header */}
          <LinearGradient colors={['#1877F2', '#764ba2']} style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setSelectedChat(null)} style={styles.chatHeaderBack}>
              <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.chatHeaderInfo}>
              <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.chatHeaderAvatar}>
                <Text style={{ fontSize: 18 }}>{selectedChat?.avatar}</Text>
              </LinearGradient>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={styles.chatHeaderName}>{selectedChat?.name}</Text>
                  {selectedChat?.verified && <MaterialIcons name="verified" size={14} color="#60A5FA" />}
                </View>
                <Text style={styles.chatHeaderStatus}>
                  {selectedChat?.online ? '🟢 Active now' : 'Last seen recently'}
                </Text>
              </View>
            </View>
            <View style={styles.chatHeaderActions}>
              <TouchableOpacity style={styles.chatHeaderBtn}>
                <MaterialIcons name="videocam" size={22} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.chatHeaderBtn}>
                <MaterialIcons name="call" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Messages */}
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Input */}
          <View style={[styles.inputBar, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderTopColor: isDark ? '#334155' : '#E2E8F0' }]}>
            <TouchableOpacity style={styles.inputBarBtn}>
              <MaterialIcons name="add-circle" size={28} color="#1877F2" />
            </TouchableOpacity>
            <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#0F172A' : '#F1F5F9' }]}>
              <TextInput
                style={[styles.input, { color: isDark ? '#F1F5F9' : '#1F2937' }]}
                placeholder="Message..."
                placeholderTextColor={isDark ? '#64748B' : '#9CA3AF'}
                value={messageText}
                onChangeText={setMessageText}
                multiline
              />
              <TouchableOpacity>
                <MaterialIcons name="emoji-emotions" size={22} color={isDark ? '#64748B' : '#9CA3AF'} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.sendBtn, { backgroundColor: messageText.trim() ? '#1877F2' : (isDark ? '#1E293B' : '#F1F5F9') }]}
              onPress={handleSendMessage}
              disabled={!messageText.trim()}
            >
              <MaterialIcons name="send" size={20} color={messageText.trim() ? '#FFFFFF' : (isDark ? '#475569' : '#D1D5DB')} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Notification Banner
  notifBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  notifBannerInner: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#1877F2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  notifBannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  notifBannerLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  notifBannerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBannerTextWrap: { flex: 1 },
  notifBannerTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', marginBottom: 2 },
  notifBannerBody: { color: 'rgba(255,255,255,0.85)', fontSize: 12, lineHeight: 16 },
  notifBannerPhoto: { width: 52, height: 52, borderRadius: 10, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  notifBannerClose: { padding: 4 },

  // Chat List
  chatListContainer: { flex: 1 },
  alexHubHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerBrand: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogoText: { fontSize: 22, fontWeight: '900', color: '#FFFFFF' },
  headerBrandName: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  headerBrandSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  headerActions: { flexDirection: 'row', gap: 12 },
  headerAction: { position: 'relative', padding: 6 },
  headerActionBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActionBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '700' },
  headerSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  headerSearchInput: { flex: 1, color: '#FFFFFF', fontSize: 15 },

  // Tabs
  tabsBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'transparent',
    gap: 4,
    position: 'relative',
  },
  activeTab: { backgroundColor: '#1877F2' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  activeTabText: { color: '#FFFFFF' },
  tabBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tabBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '700' },

  // Online Bar
  onlineBar: { paddingVertical: 10, borderBottomWidth: 1 },
  onlineBarContent: { paddingHorizontal: 16, gap: 16 },
  onlineUser: { alignItems: 'center', width: 56 },
  onlineUserAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    position: 'relative',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  onlineUserName: { fontSize: 11, fontWeight: '500', textAlign: 'center' },

  // Chat List
  chatList: { paddingHorizontal: 12, paddingVertical: 8, gap: 8, paddingBottom: 100 },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  facebookChatItem: { borderColor: '#1877F2', borderWidth: 1.5 },
  avatarContainer: { position: 'relative', marginRight: 12 },
  avatarImage: { width: 52, height: 52, borderRadius: 26 },
  avatarGradient: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 22 },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  fbOnlineIndicator: { backgroundColor: '#1877F2' },
  facebookBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#1877F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatContent: { flex: 1 },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  chatNameRow: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 4 },
  chatName: { fontSize: 15, fontWeight: '700', flex: 1 },
  verifiedIcon: {},
  timestamp: { fontSize: 11 },
  chatFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lastMessage: { fontSize: 13, flex: 1 },
  unreadBadge: {
    backgroundColor: '#1877F2',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  fbUnreadBadge: { backgroundColor: '#EF4444' },
  unreadText: { color: '#FFF', fontSize: 11, fontWeight: '700' },

  // Facebook Notifications Panel
  fbPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  fbPanelBack: { padding: 4 },
  fbPanelTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  fbPanelSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  fbPanelIcon: { marginLeft: 'auto' },
  fbNotifList: { padding: 12, gap: 10 },
  fbNotifSectionTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 },
  fbNotifCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
  },
  fbNotifUnread: { borderLeftWidth: 3, borderLeftColor: '#1877F2' },
  fbNotifLeft: {},
  fbNotifAvatarWrap: { position: 'relative' },
  fbNotifAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fbNotifTypeBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#1877F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  fbNotifContent: { flex: 1 },
  fbNotifHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  fbNotifAuthor: { fontSize: 15, fontWeight: '700' },
  fbUnreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#1877F2' },
  fbNotifText: { fontSize: 13, lineHeight: 18, marginBottom: 8 },
  fbNotifPhoto: { width: '100%', height: 150, borderRadius: 12, marginBottom: 8 },
  fbNotifStats: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  fbNotifStat: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  fbNotifStatText: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  fbNotifTime: { fontSize: 11, marginLeft: 'auto' },

  // Chat Detail
  chatHeaderBack: { marginRight: 12 },
  chatHeaderInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  chatHeaderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatHeaderName: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  chatHeaderStatus: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  chatHeaderActions: { flexDirection: 'row', gap: 8 },
  chatHeaderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Messages
  messagesContent: { padding: 16, paddingBottom: 24 },
  messageContainer: { marginBottom: 12, maxWidth: '80%' },
  myMessage: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  otherMessage: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  messageBubble: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 2 },
  myMessageBubble: { backgroundColor: '#1877F2' },
  otherMessageBubble: { backgroundColor: '#F1F5F9' },
  messageText: { fontSize: 15, lineHeight: 20 },
  myMessageText: { color: '#FFFFFF' },
  messageTime: { fontSize: 11, color: '#94A3B8' },
  myMessageTime: { textAlign: 'right' },
  reactionsContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reactionsRight: { alignSelf: 'flex-end' },
  reactionsText: { fontSize: 14 },

  // Facebook Post Card
  fbPostCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    maxWidth: SCREEN_WIDTH * 0.72,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  fbPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  fbPostLabel: { fontSize: 12, fontWeight: '700', color: '#1877F2' },
  fbPostImage: { width: '100%', height: 150 },
  fbPostContent: { fontSize: 13, color: '#374151', lineHeight: 18, padding: 10 },
  fbPostStats: { flexDirection: 'row', gap: 12, padding: 10, paddingTop: 0 },
  fbPostStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  fbPostStatText: { fontSize: 12, color: '#6B7280', fontWeight: '500' },

  // Input Bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 8,
  },
  inputBarBtn: { paddingBottom: 6 },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
    maxHeight: 100,
  },
  input: { flex: 1, fontSize: 15, maxHeight: 80 },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
