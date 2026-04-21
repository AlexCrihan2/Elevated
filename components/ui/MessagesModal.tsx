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

interface Message {
  id: string;
  sender: {
    name: string;
    avatar: string;
    verified?: boolean;
  };
  content: string;
  timestamp: string;
  unread: boolean;
  type: 'text' | 'image' | 'voice' | 'video';
  onReply: () => void;
}

interface MessagesModalProps {
  visible: boolean;
  onClose: () => void;
  messageCount: number;
  onMessageCountChange: (count: number) => void;
}

export default function MessagesModal({ 
  visible, 
  onClose, 
  messageCount, 
  onMessageCountChange 
}: MessagesModalProps) {
  const { theme, isDark } = useTheme();
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread' | 'groups'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showReplyInput, setShowReplyInput] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [composeText, setComposeText] = useState('');
  const [composeTo, setComposeTo] = useState('');

  // Mock messages data - Mixed with and without badges
  const messages: Message[] = [
    // WITH BADGES (Unread messages - show red badge)
    {
      id: '1',
      sender: {
        name: 'Dr. Sarah Mitchell',
        avatar: '👩‍⚕️',
        verified: true
      },
      content: 'Thanks for sharing that research article! The gene therapy results are fascinating. Would love to collaborate on a follow-up study.',
      timestamp: '2 min ago',
      unread: true,
      type: 'text',
      actionText: 'Reply',
      onReply: () => {
        setShowReplyInput('1');
        setReplyText('');
      }
    },
    {
      id: '2',
      sender: {
        name: 'Alex Chen',
        avatar: '👨‍💻',
        verified: true
      },
      content: 'Love your comment on the AI post! The coding assistant is getting better with each update. Beta access is available if you\'re interested.',
      timestamp: '15 min ago',
      unread: true,
      type: 'text',
      actionText: 'Reply',
      onReply: () => {
        setShowReplyInput('2');
        setReplyText('');
      }
    },
    {
      id: '3',
      sender: {
        name: 'Maya Rodriguez',
        avatar: '🎨',
        verified: false
      },
      content: 'Your art critique was incredibly insightful! I\'ve implemented your suggestions and the piece looks so much better now.',
      timestamp: '1 hour ago',
      unread: true,
      type: 'text',
      actionText: 'Reply',
      onReply: () => {
        setShowReplyInput('3');
        setReplyText('');
      }
    },
    {
      id: '4',
      sender: {
        name: 'Chef Marco',
        avatar: '👨‍🍳',
        verified: false
      },
      content: 'Recipe exchange sounds great! I have some Mediterranean dishes that would pair perfectly with your fusion techniques.',
      timestamp: '2 hours ago',
      unread: true,
      type: 'text',
      actionText: 'Reply',
      onReply: () => {
        setShowReplyInput('4');
        setReplyText('');
      }
    },
    // WITHOUT BADGES (Read messages - no red badge)
    {
      id: '5',
      sender: {
        name: 'Emma Thompson',
        avatar: '📚',
        verified: false
      },
      content: 'The book club discussion was amazing! Your insights on the character development really opened up new perspectives for everyone.',
      timestamp: '5 hours ago',
      unread: false,
      type: 'text',
      actionText: 'Reply',
      onReply: () => {
        setShowReplyInput('5');
        setReplyText('');
      }
    },
    {
      id: '6',
      sender: {
        name: 'Tech Community',
        avatar: '💻',
        verified: true
      },
      content: 'Welcome to Tech Community! You\'ve been invited to our upcoming AI workshop. 🚀',
      timestamp: '1 day ago',
      unread: false,
      type: 'text',
      actionText: 'Reply',
      onReply: () => {
        setShowReplyInput('6');
        setReplyText('');
      }
    },
    {
      id: '7',
      sender: {
        name: 'Lisa Park',
        avatar: '🎭',
        verified: false
      },
      content: 'Your theater review was spot on! Would love to discuss more about the performance over coffee sometime.',
      timestamp: '2 days ago',
      unread: false,
      type: 'text',
      actionText: 'Reply',
      onReply: () => {
        setShowReplyInput('7');
        setReplyText('');
      }
    }
  ];

  const tabs = [
    { 
      key: 'all', 
      label: 'All Messages', 
      icon: 'chat-bubble-outline', 
      count: messages.length 
    },
    { 
      key: 'unread', 
      label: 'Unread', 
      icon: 'mark-chat-unread', 
      count: messages.filter(m => m.unread).length 
    },
    { 
      key: 'groups', 
      label: 'Groups', 
      icon: 'group', 
      count: messages.filter(m => m.sender.name.includes('Community')).length 
    }
  ];

  const getFilteredMessages = () => {
    let filtered = messages;
    
    if (selectedTab === 'unread') {
      filtered = filtered.filter(message => message.unread);
    } else if (selectedTab === 'groups') {
      filtered = filtered.filter(message => message.sender.name.includes('Community'));
    }
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(message =>
        message.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const handleMarkAllRead = () => {
    Alert.alert(
      'Mark All as Read',
      'This will mark all messages as read. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Mark All Read', 
          onPress: () => {
            onMessageCountChange(0);
            Alert.alert('✅ Done', 'All messages marked as read');
          }
        }
      ]
    );
  };

  const handleSendReply = () => {
    if (replyText.trim() && showReplyInput) {
      const message = messages.find(m => m.id === showReplyInput);
      Alert.alert(
        '✅ Message Sent',
        `Your reply "${replyText.trim()}" has been sent to ${message?.sender.name}!`
      );
      setReplyText('');
      setShowReplyInput(null);
      // Mark message as read
      if (message?.unread) {
        onMessageCountChange(Math.max(0, messageCount - 1));
      }
    }
  };

  const handleSendCompose = () => {
    if (composeText.trim() && composeTo.trim()) {
      Alert.alert(
        '✅ Message Sent',
        `Your message "${composeText.trim()}" has been sent to ${composeTo.trim()}!`
      );
      setComposeText('');
      setComposeTo('');
      setShowComposeModal(false);
    } else {
      Alert.alert('Error', 'Please fill in both recipient and message fields.');
    }
  };

  const handleReplyToAll = () => {
    const unreadMessages = messages.filter(m => m.unread);
    Alert.alert(
      'Reply to All Recent Messages',
      `This will open individual reply inputs for ${unreadMessages.length} recent conversations so you can write personalized responses.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start Replying', 
          onPress: () => {
            Alert.alert('Reply Mode', 'Tap any message to write your own personalized reply!');
          }
        }
      ]
    );
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return 'image';
      case 'voice': return 'mic';
      case 'video': return 'videocam';
      default: return 'chat-bubble-outline';
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <TouchableOpacity
      style={[
        styles.messageItem,
        { 
          backgroundColor: item.unread ? theme.colors.inputBackground : theme.colors.surface,
          borderBottomColor: theme.colors.border 
        }
      ]}
      onPress={item.onReply}
    >
      <View style={styles.messageAvatar}>
        <Text style={styles.messageAvatarText}>{item.sender.avatar}</Text>
        {/* RED BADGE: Only show on unread messages */}
        {item.unread && (
          <View style={styles.unreadDot}>
            <Text style={styles.unreadDotText}>●</Text>
          </View>
        )}
        {/* NO BADGE: Read messages have clean avatars */}
      </View>
      
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <View style={styles.senderInfo}>
            <Text style={[styles.senderName, { color: theme.colors.text }]} numberOfLines={1}>
              {item.sender.name}
            </Text>
            {item.sender.verified && (
              <MaterialIcons name="verified" size={14} color="#1DA1F2" />
            )}
          </View>
          <Text style={[styles.messageTimestamp, { color: theme.colors.textSecondary }]}>
            {item.timestamp}
          </Text>
        </View>
        
        <View style={styles.messagePreview}>
          <MaterialIcons 
            name={getMessageTypeIcon(item.type) as any} 
            size={16} 
            color={theme.colors.textSecondary} 
          />
          <Text 
            style={[
              styles.messageText, 
              { 
                color: item.unread ? theme.colors.text : theme.colors.textSecondary,
                fontWeight: item.unread ? '600' : '400'
              }
            ]} 
            numberOfLines={2}
          >
            {item.content}
          </Text>
        </View>
      </View>
      
      <View style={styles.messageActions}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          onPress={item.onReply}
          activeOpacity={0.8}
        >
          <MaterialIcons name="reply" size={14} color="white" />
          <Text style={styles.actionButtonText}>{item.actionText || 'Reply'}</Text>
        </TouchableOpacity>
      </View>
      
      {/* Reply Input Field */}
      {showReplyInput === item.id && (
        <View style={[styles.replyContainer, { backgroundColor: theme.colors.inputBackground, borderColor: theme.colors.border }]}>
          <TextInput
            style={[styles.replyInput, { color: theme.colors.text }]}
            placeholder={`Write your reply to ${item.sender.name}...`}
            placeholderTextColor={theme.colors.placeholder}
            value={replyText}
            onChangeText={setReplyText}
            multiline
            autoFocus
          />
          <View style={styles.replyActions}>
            <TouchableOpacity 
              style={[styles.replyButton, styles.cancelButton, { backgroundColor: theme.colors.surface }]}
              onPress={() => {
                setShowReplyInput(null);
                setReplyText('');
              }}
            >
              <Text style={[styles.replyButtonText, { color: theme.colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.replyButton, styles.sendButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleSendReply}
              disabled={!replyText.trim()}
            >
              <MaterialIcons name="send" size={16} color="white" />
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
              <Text style={[styles.titleText, { color: theme.colors.text }]}>Messages</Text>
              {messageCount > 0 && (
                <View style={styles.headerBadge}>
                  <Text style={styles.headerBadgeText}>{messageCount}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity style={styles.headerAction} onPress={() => setShowComposeModal(true)}>
              <MaterialIcons name="edit" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          
          {/* Search Input */}
          <View style={[styles.searchContainer, { backgroundColor: theme.colors.inputBackground }]}>
            <MaterialIcons name="search" size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Search messages..."
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
              onPress={handleReplyToAll}
            >
              <MaterialIcons name="reply-all" size={16} color={theme.colors.primary} />
              <Text style={[styles.actionBtnText, { color: theme.colors.primary }]}>Reply All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: theme.colors.inputBackground }]}
              onPress={handleMarkAllRead}
            >
              <MaterialIcons name="mark-chat-read" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.actionBtnText, { color: theme.colors.textSecondary }]}>Mark Read</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages List */}
        <View style={styles.messagesContainer}>
          {getFilteredMessages().length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="chat-bubble-outline" size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                {searchQuery.trim() ? 'No messages found' : 'No messages yet'}
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                {searchQuery.trim() 
                  ? 'Try different keywords or check other tabs'
                  : 'Start a conversation with someone to see messages here'
                }
              </Text>
            </View>
          ) : (
            <FlatList
              data={getFilteredMessages()}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.messagesList}
            />
          )}
        </View>
        
        {/* Compose New Message Modal */}
        <Modal
          visible={showComposeModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowComposeModal(false)}
        >
          <View style={styles.composeOverlay}>
            <View style={[styles.composeModal, { backgroundColor: theme.colors.surface }]}>
              <View style={[styles.composeHeader, { borderBottomColor: theme.colors.border }]}>
                <Text style={[styles.composeTitle, { color: theme.colors.text }]}>New Message</Text>
                <TouchableOpacity onPress={() => setShowComposeModal(false)}>
                  <MaterialIcons name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.composeContent}>
                <View style={[styles.composeInputContainer, { backgroundColor: theme.colors.inputBackground }]}>
                  <Text style={[styles.composeLabel, { color: theme.colors.textSecondary }]}>To:</Text>
                  <TextInput
                    style={[styles.composeToInput, { color: theme.colors.text }]}
                    placeholder="Enter recipient name or @username"
                    placeholderTextColor={theme.colors.placeholder}
                    value={composeTo}
                    onChangeText={setComposeTo}
                  />
                </View>
                
                <View style={[styles.composeMessageContainer, { backgroundColor: theme.colors.inputBackground }]}>
                  <TextInput
                    style={[styles.composeMessageInput, { color: theme.colors.text }]}
                    placeholder="Write your message here..."
                    placeholderTextColor={theme.colors.placeholder}
                    value={composeText}
                    onChangeText={setComposeText}
                    multiline
                    textAlignVertical="top"
                  />
                </View>
              </View>
              
              <View style={styles.composeFooter}>
                <TouchableOpacity 
                  style={[styles.composeButton, styles.composeCancelButton, { backgroundColor: theme.colors.inputBackground }]}
                  onPress={() => setShowComposeModal(false)}
                >
                  <Text style={[styles.composeButtonText, { color: theme.colors.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.composeButton, styles.composeSendButton, { 
                    backgroundColor: (!composeText.trim() || !composeTo.trim()) ? theme.colors.inputBackground : theme.colors.primary 
                  }]}
                  onPress={handleSendCompose}
                  disabled={!composeText.trim() || !composeTo.trim()}
                >
                  <MaterialIcons 
                    name="send" 
                    size={16} 
                    color={(!composeText.trim() || !composeTo.trim()) ? theme.colors.textSecondary : 'white'} 
                  />
                  <Text style={[
                    styles.composeButtonText, 
                    { color: (!composeText.trim() || !composeTo.trim()) ? theme.colors.textSecondary : 'white' }
                  ]}>
                    Send Message
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderBottomWidth: 0.5,
    gap: 12,
  },
  messageAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  messageAvatarText: {
    fontSize: 24,
  },
  unreadDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
  },
  unreadDotText: {
    color: 'white',
    fontSize: 8,
    fontWeight: '900',
    textAlign: 'center',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  messageTimestamp: {
    fontSize: 12,
    marginLeft: 8,
  },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
    flex: 1,
  },
  messageActions: {
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
  // Reply input styles
  replyContainer: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  replyInput: {
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  replyActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  replyButton: {
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
    // backgroundColor handled by theme
  },
  replyButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  // Compose modal styles
  composeOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  composeModal: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  composeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  composeTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  composeContent: {
    padding: 20,
  },
  composeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  composeLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  composeToInput: {
    flex: 1,
    fontSize: 14,
  },
  composeMessageContainer: {
    padding: 12,
    borderRadius: 12,
    minHeight: 120,
  },
  composeMessageInput: {
    fontSize: 14,
    minHeight: 100,
  },
  composeFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    gap: 12,
  },
  composeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 6,
  },
  composeCancelButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  composeSendButton: {
    // backgroundColor handled by theme
  },
  composeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});