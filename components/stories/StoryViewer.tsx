import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity,
  StatusBar,
  Animated 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface StoryViewerProps {
  visible: boolean;
  story: any;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function StoryViewer({ visible, story, onClose, onNext, onPrevious }: StoryViewerProps) {
  const insets = useSafeAreaInsets();
  const [progress, setProgress] = useState(new Animated.Value(0));
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!visible || !story) return;

    // Reset progress
    progress.setValue(0);
    
    // Animate progress bar
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: story.duration * 1000, // Convert seconds to milliseconds
      useNativeDriver: false,
    });

    if (!isPaused) {
      animation.start(() => {
        if (onNext) {
          onNext();
        } else {
          onClose();
        }
      });
    }

    return () => {
      animation.stop();
    };
  }, [visible, story, isPaused]);

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  if (!story) return null;

  return (
    <Modal visible={visible} animationType="fade" presentationStyle="fullScreen">
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.container}>
        
        {/* Progress Bar */}
        <View style={[styles.progressContainer, { paddingTop: insets.top + 8 }]}>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill,
                {
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  })
                }
              ]} 
            />
          </View>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Text style={styles.userAvatar}>{story.avatar}</Text>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{story.user}</Text>
              <Text style={styles.timestamp}>{story.timestamp}</Text>
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
            <TouchableOpacity onPress={onClose} style={styles.headerButton}>
              <MaterialIcons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Story Content */}
        <View style={styles.storyContent}>
          <TouchableOpacity 
            style={styles.storyArea}
            onPress={handlePause}
          >
            {story.type === 'text' ? (
              <View style={[
                styles.textStory,
                story.background && getBackgroundStyle(story.background)
              ]}>
                <Text 
                  style={[
                    styles.storyText,
                    {
                      fontSize: story.textSize || 20,
                      textAlign: story.textAlign || 'center',
                      fontFamily: story.font || 'System'
                    }
                  ]}
                >
                  {story.content}
                </Text>
                
                {/* Stickers */}
                {story.stickers && story.stickers.map((sticker: any) => (
                  <View
                    key={sticker.id}
                    style={[
                      styles.storySticker,
                      {
                        left: `${sticker.x * 100}%`,
                        top: `${sticker.y * 100}%`,
                        transform: [{ scale: sticker.size }]
                      }
                    ]}
                  >
                    <Text style={styles.stickerText}>{sticker.sticker}</Text>
                  </View>
                ))}
                
              </View>
            ) : (
              <View style={styles.mediaStory}>
                <MaterialIcons 
                  name={story.type === 'video' ? 'play-circle-filled' : 'image'} 
                  size={80} 
                  color="rgba(255,255,255,0.7)" 
                />
                <Text style={styles.mediaPlaceholder}>
                  {story.type === 'video' ? 'Video Story' : 'Photo Story'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Bottom Info */}
        {(story.location || story.music) && (
          <View style={styles.bottomInfo}>
            {story.location && (
              <View style={styles.locationInfo}>
                <MaterialIcons name="location-on" size={16} color="white" />
                <Text style={styles.locationText}>{story.location}</Text>
              </View>
            )}
            {story.music && (
              <View style={styles.musicInfo}>
                <MaterialIcons name="music-note" size={16} color="white" />
                <Text style={styles.musicText}>{story.music}</Text>
              </View>
            )}
          </View>
        )}

        {/* Navigation Areas */}
        {onPrevious && (
          <TouchableOpacity 
            style={styles.previousArea} 
            onPress={onPrevious}
          />
        )}
        {onNext && (
          <TouchableOpacity 
            style={styles.nextArea} 
            onPress={onNext}
          />
        )}
        
      </View>
    </Modal>
  );
}

const getBackgroundStyle = (background: any) => {
  // Simple background color fallback for React Native
  const backgrounds: { [key: string]: string } = {
    gradient1: '#FF6B6B',
    gradient2: '#667eea',
    gradient3: '#56ab2f',
    gradient4: '#f12711',
    gradient5: '#667eea',
    gradient6: '#f093fb',
    solid1: '#000000',
    solid2: '#ffffff',
    solid3: '#3B82F6',
    solid4: '#EF4444',
  };
  
  return { backgroundColor: backgrounds[background] || '#000000' };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  progressContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
  },
  progressBar: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    fontSize: 32,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    padding: 8,
  },
  storyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyArea: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStory: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    position: 'relative',
  },
  storyText: {
    color: 'white',
    fontWeight: '500',
    lineHeight: 1.4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  storySticker: {
    position: 'absolute',
  },
  stickerText: {
    fontSize: 32,
  },
  mediaStory: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaPlaceholder: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 18,
    marginTop: 16,
    fontWeight: '500',
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    gap: 8,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    color: 'white',
    fontSize: 14,
  },
  musicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  musicText: {
    color: 'white',
    fontSize: 14,
  },
  previousArea: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '30%',
  },
  nextArea: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '30%',
  },
});