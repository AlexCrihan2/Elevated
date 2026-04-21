
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Animated,
  Dimensions
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AIAssistantProps {
  visible: boolean;
  onClose: () => void;
}

export default function FloatingAIAssistant({ visible, onClose }: AIAssistantProps) {
  const [message, setMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{role: string; content: string}>>([
    {
      role: 'ai',
      content: '👋 Hi! I\'m your AI Assistant! I can help you with:\n\n🎨 Generate creative content\n📝 Write posts & captions\n🎯 Suggest hashtags\n🖼️ Analyze images\n💡 Give you ideas\n🚀 Boost engagement\n\nHow can I help you today?'
    }
  ]);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const quickActions = [
    { id: 'content', icon: 'create', label: 'Write Post', color: '#3B82F6', gradient: ['#3B82F6', '#2563EB'] },
    { id: 'image', icon: 'image', label: 'Generate Image', color: '#8B5CF6', gradient: ['#8B5CF6', '#7C3AED'] },
    { id: 'hashtags', icon: 'local-offer', label: 'Smart Hashtags', color: '#10B981', gradient: ['#10B981', '#059669'] },
    { id: 'analyze', icon: 'analytics', label: 'Analyze Post', color: '#F59E0B', gradient: ['#F59E0B', '#D97706'] },
    { id: 'ideas', icon: 'lightbulb', label: 'Content Ideas', color: '#EF4444', gradient: ['#EF4444', '#DC2626'] },
    { id: 'optimize', icon: 'tune', label: 'Optimize', color: '#06B6D4', gradient: ['#06B6D4', '#0891B2'] }
  ];

  const aiFeatures = [
    {
      id: 'voice',
      title: 'Voice Assistant',
      description: 'Talk to AI naturally',
      icon: 'mic',
      color: '#F59E0B'
    },
    {
      id: 'vision',
      title: 'AI Vision',
      description: 'Understand any image',
      icon: 'remove-red-eye',
      color: '#8B5CF6'
    },
    {
      id: 'translate',
      title: 'Smart Translate',
      description: '150+ languages instantly',
      icon: 'translate',
      color: '#3B82F6'
    },
    {
      id: 'trends',
      title: 'Trend Predictor',
      description: 'Know what\'s viral next',
      icon: 'trending-up',
      color: '#10B981'
    },
    {
      id: 'schedule',
      title: 'Best Time AI',
      description: 'Post when audience peaks',
      icon: 'schedule',
      color: '#EF4444'
    },
    {
      id: 'competitor',
      title: 'Competitor Intel',
      description: 'See what works for others',
      icon: 'insights',
      color: '#06B6D4'
    }
  ];

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage('');
    
    // Add user message
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    
    setIsThinking(true);
    
    // Simulate AI response
    setTimeout(() => {
      let aiResponse = '';
      
      if (userMessage.toLowerCase().includes('post') || userMessage.toLowerCase().includes('write')) {
        aiResponse = '✨ I can help you create an amazing post! Here are some ideas:\n\n1️⃣ **Inspirational Quote**: "Success is not final, failure is not fatal..."\n\n2️⃣ **Personal Story**: Share your journey and connect emotionally\n\n3️⃣ **Question to Audience**: "What\'s your biggest challenge today?"\n\n4️⃣ **Behind the Scenes**: Show your process\n\n5️⃣ **Value Content**: Share 3 actionable tips\n\nWhich style interests you? 🎯';
      } else if (userMessage.toLowerCase().includes('hashtag')) {
        aiResponse = '🎯 Smart Hashtag Analysis Complete!\n\n**Trending Now**: #motivation #success #growth\n\n**High Engagement**: #mindset #goals #inspiration\n\n**Niche Specific**: #entrepreneurlife #startupjourney\n\n**Viral Potential**: 87% with these combinations!\n\nRecommended: Use 5-8 hashtags mixing trending + niche for maximum reach! 🚀';
      } else if (userMessage.toLowerCase().includes('image') || userMessage.toLowerCase().includes('picture')) {
        aiResponse = '🎨 AI Image Generation Ready!\n\nI can create:\n• Professional graphics\n• Social media posts\n• Infographics\n• Memes & GIFs\n• Logo designs\n• Banner images\n\nDescribe what you want and I\'ll generate it in seconds! Example: "Modern tech startup banner with blue gradient" 🖼️';
      } else if (userMessage.toLowerCase().includes('idea')) {
        aiResponse = '💡 Trending Content Ideas Just for You:\n\n1. **60-Second Tutorial**: Quick how-to that people can immediately use\n\n2. **Myth Busting**: Debunk common misconceptions in your niche\n\n3. **Day in the Life**: Behind-the-scenes authentic content\n\n4. **Ask Me Anything**: Interactive Q&A session\n\n5. **Transformation Story**: Show before/after with real results\n\nAll have 90%+ engagement potential! 🔥';
      } else {
        aiResponse = `🤖 I understand! "${userMessage}"\n\nI'm analyzing your request with AI...\n\n✓ Intent recognized\n✓ Context understood\n✓ Best solution identified\n\nI can help you with:\n\n📝 Creating content\n🎨 Generating visuals\n📊 Analytics insights\n🚀 Growth strategies\n💬 Engagement tips\n\nWhat would you like me to do? 🎯`;
      }
      
      setChatHistory(prev => [...prev, { role: 'ai', content: aiResponse }]);
      setIsThinking(false);
    }, 2000);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      transparent={false}
    >
      <View style={styles.container}>
        {/* Animated Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <View style={styles.aiAvatar}>
              <Ionicons name="sparkles" size={24} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.headerTitle}>AI Assistant</Text>
              <View style={styles.statusContainer}>
                <View style={styles.onlineDot} />
                <Text style={styles.statusText}>Online & Ready</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity style={styles.moreButton}>
            <MaterialIcons name="more-vert" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.quickActionsScroll}
          contentContainerStyle={styles.quickActionsContent}
        >
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.quickAction, { backgroundColor: action.color }]}
              onPress={() => {
                setChatHistory(prev => [...prev, 
                  { role: 'user', content: `Help me with ${action.label}` }
                ]);
                sendMessage();
              }}
            >
              <MaterialIcons name={action.icon as any} size={24} color="#FFFFFF" />
              <Text style={styles.quickActionText}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* AI Features Grid */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>🚀 AI Superpowers</Text>
          <View style={styles.featuresGrid}>
            {aiFeatures.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                style={[styles.featureCard, selectedFeature === feature.id && styles.featureCardActive]}
                onPress={() => setSelectedFeature(feature.id)}
              >
                <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                  <MaterialIcons name={feature.icon as any} size={24} color={feature.color} />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Chat History */}
        <ScrollView 
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
        >
          {chatHistory.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                msg.role === 'user' ? styles.userMessage : styles.aiMessage
              ]}
            >
              {msg.role === 'ai' && (
                <View style={styles.aiMessageHeader}>
                  <Ionicons name="sparkles" size={16} color="#8B5CF6" />
                  <Text style={styles.aiLabel}>AI</Text>
                </View>
              )}
              <Text style={[
                styles.messageText,
                msg.role === 'user' ? styles.userMessageText : styles.aiMessageText
              ]}>
                {msg.content}
              </Text>
            </View>
          ))}
          
          {isThinking && (
            <View style={[styles.messageBubble, styles.aiMessage]}>
              <View style={styles.thinkingContainer}>
                <ActivityIndicator size="small" color="#8B5CF6" />
                <Text style={styles.thinkingText}>AI is thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TouchableOpacity style={styles.inputAction}>
              <MaterialIcons name="camera-alt" size={22} color="#6B7280" />
            </TouchableOpacity>
            
            <TextInput
              style={styles.input}
              placeholder="Ask AI anything..."
              placeholderTextColor="#9CA3AF"
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
            />
            
            <TouchableOpacity style={styles.inputAction}>
              <MaterialIcons name="mic" size={22} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Ionicons name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 60,
    backgroundColor: '#8B5CF6',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  aiAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  quickActionsScroll: {
    maxHeight: 100,
    marginTop: 16,
  },
  quickActionsContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  quickAction: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
  },
  featuresSection: {
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureCard: {
    width: (SCREEN_WIDTH - 48) / 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  featureCardActive: {
    borderColor: '#8B5CF6',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 9,
    color: '#6B7280',
    textAlign: 'center',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatContent: {
    paddingVertical: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    marginBottom: 12,
    borderRadius: 16,
    padding: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#3B82F6',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  aiMessageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  aiLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8B5CF6',
    marginLeft: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: '#1F2937',
  },
  thinkingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  thinkingText: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  inputAction: {
    padding: 4,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
});
