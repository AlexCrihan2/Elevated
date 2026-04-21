import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, runOnJS, withTiming } from 'react-native-reanimated';

interface Story {
  id: string;
  user: string;
  avatar: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'live';
  duration: number;
  timestamp: string;
  views: number;
  filters?: string[];
  music?: string;
  appleMusicTrack?: {
    title: string;
    artist: string;
    genre: string;
    duration: string;
  };
  location?: string;
  mentions?: string[];
  hashtags?: string[];
  stickers?: Array<{id: string, sticker: string, x: number, y: number, size: number}>;
  isLive?: boolean;
  liveData?: {
    streamer: string;
    viewers: number;
    category: string;
    liveTitle: string;
  };
}

interface AdvancedStoryViewerProps {
  visible: boolean;
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

export default function AdvancedStoryViewer({ visible, stories, initialIndex, onClose }: AdvancedStoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showNavigationIndicators, setShowNavigationIndicators] = useState(false);
  const [muted, setMuted] = useState(false);
  const progressInterval = useRef<NodeJS.Timeout>();
  
  // Animated values for gestures
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const reactions = ['❤️', '😂', '😮', '😢', '😡', '👍', '🔥', '💯'];
  const navigationIndicators = ['⬅️ Prev Story', '➡️ Next Story', '⬆️ Next Person', '⬇️ Exit Stories'];

  // Group stories by user
  const storyGroups = stories.reduce((groups: any[], story) => {
    const existingGroup = groups.find(group => group.user === story.user);
    if (existingGroup) {
      existingGroup.stories.push(story);
    } else {
      groups.push({ user: story.user, avatar: story.avatar, stories: [story] });
    }
    return groups;
  }, []);

  const currentGroup = storyGroups[currentUserIndex];
  const currentStory = currentGroup?.stories[currentIndex] || stories[0];

  // Define handler functions first
  const handlePrevious = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    } else if (currentUserIndex > 0) {
      setCurrentUserIndex(prev => prev - 1);
      const prevGroup = storyGroups[currentUserIndex - 1];
      setCurrentIndex(prevGroup.stories.length - 1);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    
    if (currentIndex < currentGroup.stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      handleNextUser();
    }
  };

  const handleNextUser = () => {
    if (currentUserIndex < storyGroups.length - 1) {
      setCurrentUserIndex(prev => prev + 1);
      setCurrentIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  };

  // Pan gesture handler
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      
      // Show navigation indicators during gesture
      runOnJS(setShowNavigationIndicators)(true);
    })
    .onEnd((event) => {
      const { translationX, translationY, velocityX, velocityY } = event;
      
      runOnJS(setShowNavigationIndicators)(false);
      
      // Determine gesture direction
      const threshold = 50;
      const velocityThreshold = 500;
      
      if (Math.abs(translationX) > Math.abs(translationY)) {
        // Horizontal swipe - previous/next story
        if (translationX > threshold || velocityX > velocityThreshold) {
          // Swipe right - previous story
          runOnJS(handlePrevious)();
        } else if (translationX < -threshold || velocityX < -velocityThreshold) {
          // Swipe left - next story
          runOnJS(handleNext)();
        }
      } else {
        // Vertical swipe - next person/exit
        if (translationY < -threshold || velocityY < -velocityThreshold) {
          // Swipe up - next person
          runOnJS(handleNextUser)();
        } else if (translationY > threshold || velocityY > velocityThreshold) {
          // Swipe down - exit stories
          runOnJS(onClose)();
        }
      }
      
      // Reset position
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value * 0.1 }, // Subtle movement during gesture
        { translateY: translateY.value * 0.1 },
        { scale: scale.value },
      ],
    };
  });

  useEffect(() => {
    if (!visible || isPaused) {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      return;
    }

    if (!currentStory) return;

    const duration = currentStory.isLive ? 30000 : currentStory.duration * 1000; // Live stories last 30s
    const interval = 50;

    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (interval / duration) * 100;
        if (newProgress >= 100) {
          setTimeout(() => {
            if (currentIndex < currentGroup.stories.length - 1) {
              setCurrentIndex(prev => prev + 1);
              setProgress(0);
            } else {
              handleNextUser();
            }
          }, 0);
          return 100;
        }
        return newProgress;
      });
    }, interval);

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentIndex, currentUserIndex, visible, isPaused]);

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReaction = (emoji: string) => {
    console.log('Reaction:', emoji);
    setShowReactions(false);
  };

  if (!currentStory) return null;

  return (
    <Modal visible={visible} animationType="fade" presentationStyle="fullScreen">
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Progress Bars */}
          <View style={styles.progressContainer}>
            {currentGroup?.stories.map((_, index) => (
              <View key={index} style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar,
                    index < currentIndex ? styles.progressBarComplete :
                    index === currentIndex ? { width: `${progress}%` } :
                    styles.progressBarEmpty
                  ]} 
                />
              </View>
            ))}
          </View>

          {/* User Progress Indicators */}
          <View style={styles.userProgressContainer}>
            {storyGroups.map((group, index) => (
              <View key={index} style={[
                styles.userProgressIndicator,
                index === currentUserIndex ? styles.userProgressActive : styles.userProgressInactive
              ]} />
            ))}
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{currentStory.avatar}</Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.username}>
                  {currentStory.user} 
                  {currentStory.isLive && <Text style={styles.liveIndicator}>🔴 LIVE</Text>}
                </Text>
                <Text style={styles.timestamp}>
                  {currentStory.isLive ? 'Live now' : currentStory.timestamp}
                  {currentStory.liveData && ` • ${currentStory.liveData.viewers} watching`}
                </Text>
              </View>
            </View>
            
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handlePause} style={styles.headerButton}>
                <MaterialIcons 
                  name={isPaused ? 'play-arrow' : 'pause'} 
                  size={24} 
                  color="white" 
                />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => setMuted(!muted)} style={styles.headerButton}>
                <MaterialIcons 
                  name={muted ? 'volume-off' : 'volume-up'} 
                  size={24} 
                  color="white" 
                />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => setShowOptions(true)} style={styles.headerButton}>
                <MaterialIcons name="more-horiz" size={24} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={onClose} style={styles.headerButton}>
                <MaterialIcons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Story Content with Gesture Detection */}
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.contentContainer, animatedStyle]}>
              {/* Tap Areas for Quick Navigation */}
              <TouchableOpacity 
                style={styles.leftTapArea} 
                onPress={handlePrevious}
                activeOpacity={1}
              />
              
              <TouchableOpacity 
                style={styles.rightTapArea} 
                onPress={handleNext}
                activeOpacity={1}
              />

              {/* Main Content */}
              <View style={styles.storyContent}>
                {currentStory.type === 'text' ? (
                  <View style={styles.textStoryContainer}>
                    <Text style={styles.textStoryContent}>{currentStory.content}</Text>
                  </View>
                ) : currentStory.type === 'live' ? (
                  <View style={styles.liveStoryContainer}>
                    <View style={styles.livePlaceholder}>
                      <MaterialIcons name="videocam" size={64} color="white" />
                      <Text style={styles.liveTitle}>{currentStory.liveData?.liveTitle || 'Live Stream'}</Text>
                      <Text style={styles.liveCategory}>{currentStory.liveData?.category}</Text>
                      <View style={styles.liveViewerCount}>
                        <MaterialIcons name="visibility" size={16} color="white" />
                        <Text style={styles.liveViewerText}>{currentStory.liveData?.viewers} watching</Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.mediaPlaceholder}>
                    <MaterialIcons 
                      name={currentStory.type === 'video' ? 'videocam' : 'image'} 
                      size={64} 
                      color="white" 
                    />
                    <Text style={styles.mediaPlaceholderText}>
                      {currentStory.type === 'video' ? 'Video Story' : 'Image Story'}
                    </Text>
                  </View>
                )}
                
                {/* Stickers Overlay */}
                {currentStory.stickers && currentStory.stickers.map((stickerItem) => (
                  <View
                    key={stickerItem.id}
                    style={[
                      styles.viewerStickerOverlay,
                      {
                        left: `${stickerItem.x * 100}%`,
                        top: `${stickerItem.y * 100}%`,
                        transform: [{ scale: stickerItem.size }]
                      }
                    ]}
                  >
                    <Text style={styles.viewerStickerText}>{stickerItem.sticker}</Text>
                  </View>
                ))}
              </View>

              {/* Navigation Indicators Overlay */}
              {showNavigationIndicators && (
                <View style={styles.navigationIndicatorsOverlay}>
                  <View style={styles.navigationIndicators}>
                    {navigationIndicators.map((indicator, index) => (
                      <View key={index} style={styles.navigationIndicator}>
                        <Text style={styles.navigationIndicatorText}>{indicator}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Story Metadata */}
              <View style={styles.metadata}>
                {currentStory.location && (
                  <View style={styles.metadataItem}>
                    <MaterialIcons name="location-on" size={16} color="white" />
                    <Text style={styles.metadataText}>{currentStory.location}</Text>
                  </View>
                )}
                
                {currentStory.appleMusicTrack ? (
                  <TouchableOpacity style={styles.appleMusicItem}>
                    <View style={styles.appleMusicIcon}>
                      <MaterialIcons name="library-music" size={16} color="#000" />
                    </View>
                    <View style={styles.appleMusicInfo}>
                      <Text style={styles.appleMusicTitle}>{currentStory.appleMusicTrack.title}</Text>
                      <Text style={styles.appleMusicArtist}>{currentStory.appleMusicTrack.artist}</Text>
                    </View>
                    <View style={styles.appleMusicControls}>
                      <TouchableOpacity style={styles.musicControlButton}>
                        <MaterialIcons name={muted ? "volume-off" : "pause"} size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ) : currentStory.music && (
                  <View style={styles.metadataItem}>
                    <MaterialIcons name="music-note" size={16} color="white" />
                    <Text style={styles.metadataText}>{currentStory.music}</Text>
                  </View>
                )}
                
                {currentStory.hashtags && (
                  <View style={styles.hashtagsContainer}>
                    {currentStory.hashtags.map((hashtag, index) => (
                      <TouchableOpacity key={index} style={styles.hashtag}>
                        <Text style={styles.hashtagText}>{hashtag}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </Animated.View>
          </GestureDetector>

          {/* Bottom Actions */}
          <View style={styles.bottomActions}>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="reply" size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowReactions(true)}
            >
              <MaterialIcons name="favorite-border" size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="send" size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="bookmark-border" size={24} color="white" />
            </TouchableOpacity>
            
            <View style={styles.viewsContainer}>
              <MaterialIcons name="visibility" size={16} color="rgba(255,255,255,0.7)" />
              <Text style={styles.viewsText}>{currentStory.views}</Text>
            </View>
          </View>

          {/* Reactions Overlay */}
          {showReactions && (
            <View style={styles.reactionsOverlay}>
              <TouchableOpacity 
                style={styles.reactionsBackground}
                onPress={() => setShowReactions(false)}
              />
              <View style={styles.reactionsContainer}>
                {reactions.map((emoji, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.reactionButton}
                    onPress={() => handleReaction(emoji)}
                  >
                    <Text style={styles.reactionEmoji}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Options Modal */}
          <Modal visible={showOptions} transparent animationType="slide">
            <View style={styles.optionsOverlay}>
              <TouchableOpacity 
                style={styles.optionsBackground}
                onPress={() => setShowOptions(false)}
              />
              <View style={styles.optionsContainer}>
                <TouchableOpacity style={styles.optionItem}>
                  <MaterialIcons name="report" size={24} color="#EF4444" />
                  <Text style={styles.optionText}>Report Story</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.optionItem}>
                  <MaterialIcons name="block" size={24} color="#EF4444" />
                  <Text style={styles.optionText}>Mute {currentStory.user}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.optionItem}>
                  <MaterialIcons name="copy" size={24} color="#3B82F6" />
                  <Text style={styles.optionText}>Copy Link</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.optionItem}>
                  <MaterialIcons name="share" size={24} color="#3B82F6" />
                  <Text style={styles.optionText}>Share Story</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingTop: 50,
    paddingBottom: 8,
    gap: 4,
  },
  progressBarContainer: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
  },
  progressBarComplete: {
    width: '100%',
  },
  progressBarEmpty: {
    width: '0%',
  },
  userProgressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 4,
    justifyContent: 'center',
  },
  userProgressIndicator: {
    width: 20,
    height: 3,
    borderRadius: 2,
  },
  userProgressActive: {
    backgroundColor: 'white',
  },
  userProgressInactive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  username: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  liveIndicator: {
    fontSize: 12,
    fontWeight: '600',
  },
  timestamp: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  leftTapArea: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: width * 0.3,
    height: '100%',
    zIndex: 10,
  },
  rightTapArea: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: width * 0.3,
    height: '100%',
    zIndex: 10,
  },
  storyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  textStoryContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    padding: 20,
    maxWidth: '90%',
  },
  textStoryContent: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 32,
  },
  liveStoryContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  livePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 16,
    padding: 40,
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  liveTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  liveCategory: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginTop: 8,
  },
  liveViewerCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  liveViewerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  mediaPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 40,
  },
  mediaPlaceholderText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 12,
  },
  navigationIndicatorsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  navigationIndicators: {
    alignItems: 'center',
    gap: 16,
  },
  navigationIndicator: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  navigationIndicatorText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  metadata: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metadataText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 6,
  },
  hashtagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  hashtag: {
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  hashtagText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '500',
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  actionButton: {
    padding: 12,
    marginRight: 8,
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  viewsText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginLeft: 4,
  },
  reactionsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  reactionsBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  reactionsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  reactionButton: {
    padding: 8,
  },
  reactionEmoji: {
    fontSize: 24,
  },
  optionsOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  optionsBackground: {
    flex: 1,
  },
  optionsContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 16,
    color: '#2D3748',
  },
  appleMusicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  appleMusicIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  appleMusicInfo: {
    flex: 1,
  },
  appleMusicTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  appleMusicArtist: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  appleMusicControls: {
    flexDirection: 'row',
    gap: 8,
  },
  musicControlButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerStickerOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  viewerStickerText: {
    fontSize: 32,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});