import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Animated,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LiveStream {
  id: string;
  title: string;
  streamer: string;
  viewers: number;
  category: string;
  isLive: boolean;
  duration: string;
  thumbnail: string;
  language: string;
}

interface Comment {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
}

interface Subtitle {
  id: string;
  text: string;
  timestamp: number;
  speaker: string;
  confidence: number;
}

interface SmartTake {
  id: string;
  content: string;
  type: 'insight' | 'summary' | 'prediction' | 'analysis';
  timestamp: number;
  relevance: number;
}

interface Translation {
  original: string;
  translated: string;
  language: string;
  confidence: number;
}

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
];

const { width, height } = Dimensions.get('window');

interface LiveStreamAppProps {
  selectedStreamId?: string;
  onClose?: () => void;
}

export default function LiveStreamScreen({ selectedStreamId, onClose }: LiveStreamAppProps = {}) {
  const insets = useSafeAreaInsets();
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [smartTakes, setSmartTakes] = useState<SmartTake[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null);
  const [translation, setTranslation] = useState<Translation | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [aiAnalysisEnabled, setAiAnalysisEnabled] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const takeOpacity = useRef(new Animated.Value(0)).current;

  // Auto-select stream if provided
  useEffect(() => {
    if (selectedStreamId && !selectedStream) {
      const stream = liveStreams.find(s => s.id === selectedStreamId);
      if (stream) {
        setSelectedStream(stream);
      }
    }
  }, [selectedStreamId]);

  // Mock comments data
  const [mockComments] = useState<Comment[]>([
    {
      id: 'comment-1',
      user: 'TechEnthusiast',
      avatar: '👨‍💻',
      content: 'Great insights on AI ethics!',
      timestamp: '2m ago',
      likes: 12
    },
    {
      id: 'comment-2', 
      user: 'DataScientist',
      avatar: '👩‍🔬',
      content: 'The healthcare applications are fascinating',
      timestamp: '5m ago',
      likes: 8
    },
    {
      id: 'comment-3',
      user: 'StudentDev',
      avatar: '👨‍🎓',
      content: 'Taking notes on all of this!',
      timestamp: '7m ago', 
      likes: 3
    }
  ]);

  useEffect(() => {
    setComments(mockComments);
  }, []);

  const [liveStreams] = useState<LiveStream[]>([
    {
      id: 'stream-1',
      title: 'Tech Conference 2024: AI Revolution',
      streamer: 'TechGuru',
      viewers: 15420,
      category: 'Technology',
      isLive: true,
      duration: '2:34:15',
      thumbnail: '',
      language: 'en'
    },
    {
      id: 'stream-2',
      title: 'Climate Change Discussion Panel',
      streamer: 'ScienceDaily',
      viewers: 8750,
      category: 'Science',
      isLive: true,
      duration: '1:18:42',
      thumbnail: '',
      language: 'en'
    },
    {
      id: 'stream-3',
      title: 'Global Economics Roundtable',
      streamer: 'EconExpert',
      viewers: 12300,
      category: 'Business',
      isLive: true,
      duration: '45:23',
      thumbnail: '',
      language: 'en'
    }
  ]);

  // Simulate real-time subtitles
  useEffect(() => {
    if (!selectedStream) return;

    const subtitleInterval = setInterval(() => {
      const mockSubtitles: Subtitle[] = [
        {
          id: 'sub-1',
          text: 'Artificial intelligence is transforming how we approach complex problems.',
          timestamp: Date.now(),
          speaker: selectedStream.streamer,
          confidence: 0.95
        },
        {
          id: 'sub-2',
          text: 'The integration of machine learning in healthcare shows promising results.',
          timestamp: Date.now() + 3000,
          speaker: selectedStream.streamer,
          confidence: 0.92
        },
        {
          id: 'sub-3',
          text: 'We need to consider the ethical implications of AI development.',
          timestamp: Date.now() + 6000,
          speaker: selectedStream.streamer,
          confidence: 0.88
        }
      ];

      const randomSubtitle = mockSubtitles[Math.floor(Math.random() * mockSubtitles.length)];
      setCurrentSubtitle(randomSubtitle);
      setSubtitles(prev => [...prev.slice(-4), randomSubtitle]);

      // Animate subtitle appearance
      Animated.sequence([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleOpacity, {
          toValue: 0.8,
          duration: 2700,
          useNativeDriver: true,
        })
      ]).start();

      // Generate AI translation if language is different
      if (selectedLanguage !== selectedStream.language) {
        generateTranslation(randomSubtitle.text);
      }

    }, 4000);

    return () => clearInterval(subtitleInterval);
  }, [selectedStream, selectedLanguage]);

  const generateTranslation = async (text: string) => {
    // Simulate AI translation
    const translations: { [key: string]: string } = {
      'es': 'La inteligencia artificial está transformando cómo abordamos problemas complejos.',
      'fr': 'L\'intelligence artificielle transforme notre approche des problèmes complexes.',
      'de': 'Künstliche Intelligenz verändert unseren Umgang mit komplexen Problemen.',
      'ja': '人工知能は複雑な問題へのアプローチを変革しています。',
      'ko': '인공지능은 복잡한 문제에 접근하는 방식을 변화시키고 있습니다.',
      'zh': '人工智能正在改变我们处理复杂问题的方式。',
      'ar': 'الذكاء الاصطناعي يغير طريقة تعاملنا مع المشاكل المعقدة.'
    };

    const translatedText = translations[selectedLanguage] || text;
    
    setTranslation({
      original: text,
      translated: translatedText,
      language: selectedLanguage,
      confidence: 0.89
    });
  };

  const formatViewers = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getSmartTakeIcon = (type: string) => {
    switch (type) {
      case 'insight': return 'lightbulb';
      case 'summary': return 'summarize';
      case 'prediction': return 'trending-up';
      case 'analysis': return 'analytics';
      default: return 'psychology';
    }
  };

  const getSmartTakeColor = (type: string) => {
    switch (type) {
      case 'insight': return '#F59E0B';
      case 'summary': return '#3B82F6';
      case 'prediction': return '#10B981';
      case 'analysis': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const handleSendComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: `comment-${Date.now()}`,
        user: 'You',
        avatar: '👤',
        content: newComment.trim(),
        timestamp: 'now',
        likes: 0
      };
      setComments(prev => [comment, ...prev]);
      setNewComment('');
    }
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  if (!selectedStream) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Live Streams</Text>
          <TouchableOpacity 
            style={styles.languageButton}
            onPress={() => setShowLanguageModal(true)}
          >
            <MaterialIcons name="translate" size={20} color="#6B7280" />
            <Text style={styles.languageText}>
              {LANGUAGES.find(l => l.code === selectedLanguage)?.flag}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.streamList}>
          <Text style={styles.sectionTitle}>Live Now</Text>
          
          {liveStreams.map((stream) => (
            <TouchableOpacity
              key={stream.id}
              style={styles.streamCard}
              onPress={() => setSelectedStream(stream)}
            >
              <View style={styles.streamThumbnail}>
                <View style={styles.liveBadge}>
                  <View style={styles.liveIndicator} />
                  <Text style={styles.liveBadgeText}>LIVE</Text>
                </View>
                <Text style={styles.durationText}>{stream.duration}</Text>
              </View>

              <View style={styles.streamInfo}>
                <Text style={styles.streamTitle} numberOfLines={2}>
                  {stream.title}
                </Text>
                <Text style={styles.streamStreamer}>{stream.streamer}</Text>
                
                <View style={styles.streamMeta}>
                  <View style={styles.viewerCount}>
                    <MaterialIcons name="visibility" size={14} color="#6B7280" />
                    <Text style={styles.viewerText}>
                      {formatViewers(stream.viewers)} watching
                    </Text>
                  </View>
                  <Text style={styles.categoryText}>{stream.category}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Language Selection Modal */}
        <Modal
          visible={showLanguageModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowLanguageModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.languageModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Translation Language</Text>
                <TouchableOpacity
                  style={styles.modalClose}
                  onPress={() => setShowLanguageModal(false)}
                >
                  <MaterialIcons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.languageList}>
                {LANGUAGES.map((lang) => (
                  <TouchableOpacity
                    key={lang.code}
                    style={[
                      styles.languageOption,
                      selectedLanguage === lang.code && styles.languageOptionSelected
                    ]}
                    onPress={() => {
                      setSelectedLanguage(lang.code);
                      setShowLanguageModal(false);
                    }}
                  >
                    <Text style={styles.languageFlag}>{lang.flag}</Text>
                    <Text style={styles.languageName}>{lang.name}</Text>
                    {selectedLanguage === lang.code && (
                      <MaterialIcons name="check" size={20} color="#3B82F6" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.fullScreenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar hidden={true} />
      {/* Full Screen Video Player */}
      <View style={styles.fullScreenVideo}>
        {/* Video Content */}
        <View style={styles.videoContent}>
          <MaterialIcons name="play-circle-filled" size={80} color="rgba(255,255,255,0.8)" />
          <Text style={styles.videoPlaceholderText}>{selectedStream.title}</Text>
        </View>

        {/* Top Controls Overlay */}
        <View style={[styles.topOverlay, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (onClose) {
                onClose();
              } else {
                setSelectedStream(null);
              }
            }}
          >
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.streamInfo}>
            <View style={styles.liveIndicatorContainer}>
              <View style={styles.liveIndicatorDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
            <Text style={styles.viewerCount}>
              {formatViewers(selectedStream.viewers)} watching
            </Text>
          </View>

          <View style={styles.topControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setAudioEnabled(!audioEnabled)}
            >
              <MaterialIcons 
                name={audioEnabled ? "volume-up" : "volume-off"} 
                size={20} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setSubtitlesEnabled(!subtitlesEnabled)}
            >
              <MaterialIcons 
                name={subtitlesEnabled ? "subtitles" : "subtitles-off"} 
                size={20} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setShowLanguageModal(true)}
            >
              <MaterialIcons name="translate" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Subtitles Overlay */}
        {subtitlesEnabled && currentSubtitle && (
          <Animated.View 
            style={[
              styles.subtitleOverlay,
              { opacity: subtitleOpacity }
            ]}
          >
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitleText}>
                {translation && selectedLanguage !== selectedStream.language 
                  ? translation.translated 
                  : currentSubtitle.text}
              </Text>
              {translation && (
                <View style={styles.translationInfo}>
                  <MaterialIcons name="translate" size={12} color="#3B82F6" />
                  <Text style={styles.translationInfoText}>
                    {LANGUAGES.find(l => l.code === selectedLanguage)?.name} • {Math.round(translation.confidence * 100)}%
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>
        )}
      </View>

      {/* Bottom Controls Bar */}
      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.bottomControlButton}>
          <MaterialIcons name="favorite-border" size={24} color="#FFFFFF" />
          <Text style={styles.controlLabel}>Like</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bottomControlButton}>
          <MaterialIcons name="share" size={24} color="#FFFFFF" />
          <Text style={styles.controlLabel}>Share</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.bottomControlButton}
          onPress={() => setAiAnalysisEnabled(!aiAnalysisEnabled)}
        >
          <MaterialIcons 
            name={aiAnalysisEnabled ? "psychology" : "psychology-alt"} 
            size={24} 
            color={aiAnalysisEnabled ? "#3B82F6" : "#FFFFFF"} 
          />
          <Text style={styles.controlLabel}>AI Insights</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bottomControlButton}>
          <MaterialIcons name="more-horiz" size={24} color="#FFFFFF" />
          <Text style={styles.controlLabel}>More</Text>
        </TouchableOpacity>
      </View>

      {/* Comments Section */}
      <View style={[styles.commentsSection, { paddingBottom: insets.bottom }]}>
        <View style={styles.commentsHeader}>
          <MaterialIcons name="chat-bubble-outline" size={20} color="#6B7280" />
          <Text style={styles.commentsTitle}>Live Chat ({comments.length})</Text>
          {aiAnalysisEnabled && (
            <View style={styles.aiLiveIndicator}>
              <View style={styles.aiLiveDot} />
              <Text style={styles.aiLiveText}>AI</Text>
            </View>
          )}
        </View>

        <ScrollView style={styles.commentsList} showsVerticalScrollIndicator={false}>
          {comments.map((comment) => (
            <View key={comment.id} style={styles.commentItem}>
              <Text style={styles.commentAvatar}>{comment.avatar}</Text>
              <View style={styles.commentContent}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentUser}>{comment.user}</Text>
                  <Text style={styles.commentTime}>{comment.timestamp}</Text>
                </View>
                <Text style={styles.commentText}>{comment.content}</Text>
                <View style={styles.commentActions}>
                  <TouchableOpacity 
                    style={styles.commentAction}
                    onPress={() => handleLikeComment(comment.id)}
                  >
                    <MaterialIcons name="favorite-border" size={14} color="#6B7280" />
                    <Text style={styles.commentActionText}>{comment.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.commentAction}>
                    <MaterialIcons name="reply" size={14} color="#6B7280" />
                    <Text style={styles.commentActionText}>Reply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Comment Input */}
        <View style={styles.commentInput}>
          <TextInput
            style={styles.commentTextInput}
            placeholder="Add a comment..."
            placeholderTextColor="#9CA3AF"
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, !newComment.trim() && styles.sendButtonDisabled]}
            onPress={handleSendComment}
            disabled={!newComment.trim()}
          >
            <MaterialIcons 
              name="send" 
              size={20} 
              color={newComment.trim() ? "#3B82F6" : "#9CA3AF"} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.languageModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Translation Language</Text>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setShowLanguageModal(false)}
              >
                <MaterialIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.languageList}>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageOption,
                    selectedLanguage === lang.code && styles.languageOptionSelected
                  ]}
                  onPress={() => {
                    setSelectedLanguage(lang.code);
                    setShowLanguageModal(false);
                  }}
                >
                  <Text style={styles.languageFlag}>{lang.flag}</Text>
                  <Text style={styles.languageName}>{lang.name}</Text>
                  {selectedLanguage === lang.code && (
                    <MaterialIcons name="check" size={20} color="#3B82F6" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  fullScreenVideo: {
    height: height * 0.65, // 65% of screen for video
    backgroundColor: '#1A1A1A',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 10,
  },
  streamInfo: {
    flex: 1,
    marginLeft: 16,
  },
  liveIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  liveIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 8,
  },
  liveText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '700',
  },
  viewerCount: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
  topControls: {
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitleOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    zIndex: 5,
  },
  subtitleContainer: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 8,
    padding: 16,
  },
  subtitleText: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '500',
  },
  translationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 6,
  },
  translationInfoText: {
    color: 'rgba(59,130,246,1)',
    fontSize: 12,
    fontWeight: '500',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  bottomControlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  controlLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  commentsSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    maxHeight: height * 0.30, // 30% max for comments
    minHeight: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FAFAFA',
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  aiLiveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  aiLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
  },
  aiLiveText: {
    fontSize: 11,
    color: '#3B82F6',
    fontWeight: '600',
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  commentItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  commentAvatar: {
    fontSize: 24,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  commentTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  commentText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    gap: 16,
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentActionText: {
    fontSize: 12,
    color: '#6B7280',
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
  },
  commentTextInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
    maxHeight: 80,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  // Existing styles for modal and language selection
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  languageText: {
    fontSize: 16,
  },
  streamList: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  streamCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  streamThumbnail: {
    width: 120,
    height: 90,
    backgroundColor: '#1F2937',
    justifyContent: 'space-between',
    padding: 8,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    gap: 4,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  liveBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    alignSelf: 'flex-end',
  },
  streamTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  streamStreamer: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  streamMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewerText: {
    fontSize: 12,
    color: '#6B7280',
  },
  categoryText: {
    fontSize: 11,
    color: '#9CA3AF',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlaceholderText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
    marginTop: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  languageModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.6,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalClose: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageList: {
    flex: 1,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  languageOptionSelected: {
    backgroundColor: '#F0F9FF',
  },
  languageFlag: {
    fontSize: 20,
  },
  languageName: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
});