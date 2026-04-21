import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import AdvancedStoryViewer from '@/components/stories/AdvancedStoryViewer';
import StoryCreator from '@/components/stories/StoryCreator';

interface Story {
  id: string;
  user: string;
  avatar: string;
  isOwn: boolean;
  hasNew: boolean;
  isLive?: boolean;
  content: string;
  type: 'text' | 'image' | 'video' | 'live';
  duration: number;
  timestamp: string;
  views: number;
}

interface StoriesToolbarProps {
  stories: Story[];
  onStoryCreated?: (story: any) => void;
}

export default function StoriesToolbar({ stories, onStoryCreated }: StoriesToolbarProps) {
  const { theme, isDark } = useTheme();
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [showStoryCreator, setShowStoryCreator] = useState(false);

  const handleStoryPress = (index: number, story: Story) => {
    console.log('Story pressed:', story.user, story.isOwn);
    
    if (story.isOwn) {
      // Open the story creator
      setShowStoryCreator(true);
    } else {
      // Find the correct index in the viewable stories array
      const viewableStories = stories.filter(s => !s.isOwn);
      const viewableIndex = viewableStories.findIndex(s => s.id === story.id);
      console.log('Opening story viewer - viewableIndex:', viewableIndex, 'total viewable:', viewableStories.length);
      setSelectedStoryIndex(viewableIndex >= 0 ? viewableIndex : 0);
      setShowStoryViewer(true);
    }
  };

  const handleStoryCreated = (newStory: any) => {
    console.log('Story created:', newStory);
    setShowStoryCreator(false);
    Alert.alert('Success', 'Your story has been posted!');
    // Call the parent callback if provided
    onStoryCreated?.(newStory);
  };

  const renderStory = ({ item, index }: { item: Story; index: number }) => (
    <TouchableOpacity 
      style={styles.storyItem}
      onPress={() => handleStoryPress(index, item)}
    >
      <View style={[
        styles.storyAvatar,
        item.hasNew && !item.isOwn && styles.storyAvatarNew,
        item.isOwn && styles.storyAvatarOwn,
        item.isLive && styles.storyAvatarLive,
      ]}>
        <Text style={styles.storyAvatarText}>{item.avatar}</Text>
        
        {item.isOwn && (
          <View style={styles.addStoryButton}>
            <MaterialIcons name="add" size={12} color="white" />
          </View>
        )}
        {item.isLive && (
          <View style={styles.liveIndicator}>
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
      </View>
      
      <Text style={[styles.storyText, { color: theme.colors.text }]} numberOfLines={1}>
        {item.user}
      </Text>
    </TouchableOpacity>
  );

  // Filter out own story for the viewer and ensure proper format
  const viewableStories = stories.filter(s => !s.isOwn).map(story => ({
    ...story,
    views: story.views || Math.floor(Math.random() * 1000) + 100,
    duration: story.duration || 5,
    timestamp: story.timestamp || '2h ago'
  }));
  
  console.log('StoriesToolbar - viewableStories count:', viewableStories.length, 'showStoryViewer:', showStoryViewer);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Stories</Text>
        <View style={styles.headerRight}>
          <Text style={[styles.liveCount, { color: theme.colors.textSecondary }]}>
            {stories.filter(s => s.isLive).length} live
          </Text>
          <View style={[styles.liveDot, { backgroundColor: stories.some(s => s.isLive) ? '#EF4444' : theme.colors.textSecondary }]} />
        </View>
      </View>
      
      <FlatList
        data={stories}
        renderItem={renderStory}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesContainer}
      />

      {showStoryViewer && viewableStories.length > 0 && (
        <AdvancedStoryViewer
          visible={showStoryViewer}
          onClose={() => {
            console.log('Closing story viewer');
            setShowStoryViewer(false);
          }}
          stories={viewableStories}
          initialIndex={selectedStoryIndex}
        />
      )}
      
      <StoryCreator
        visible={showStoryCreator}
        onClose={() => setShowStoryCreator(false)}
        onCreateStory={handleStoryCreated}
      />
    </View>
  );
}

// Export the Story interface and sample data
export const sampleStories: Story[] = [
  { 
    id: 'own', 
    user: 'Your Story', 
    avatar: '📷', 
    isOwn: true, 
    hasNew: false,
    content: '',
    type: 'text',
    duration: 5,
    timestamp: 'now',
    views: 0
  },
  { 
    id: '1', 
    user: 'Sarah', 
    avatar: '👩‍⚕️', 
    isOwn: false, 
    hasNew: true,
    content: 'Exciting breakthrough in gene therapy! 🧬',
    type: 'text',
    duration: 5,
    timestamp: '2h ago',
    views: 245
  },
  { 
    id: '2', 
    user: 'Mike', 
    avatar: '👨‍💻', 
    isOwn: false, 
    hasNew: true, 
    isLive: true,
    content: 'Live coding session - building AI assistant!',
    type: 'live',
    duration: 30,
    timestamp: 'Live now',
    views: 89
  },
  { 
    id: '3', 
    user: 'Emma', 
    avatar: '🎨', 
    isOwn: false, 
    hasNew: false,
    content: 'New art piece finished! What do you think?',
    type: 'image',
    duration: 5,
    timestamp: '4h ago',
    views: 156
  },
  { 
    id: '4', 
    user: 'Alex', 
    avatar: '🚀', 
    isOwn: false, 
    hasNew: true,
    content: 'Space mission update from NASA! 🚀🌌',
    type: 'text',
    duration: 5,
    timestamp: '6h ago',
    views: 312
  },
  { 
    id: '5', 
    user: 'Lisa', 
    avatar: '🎭', 
    isOwn: false, 
    hasNew: true,
    content: 'Theater rehearsal behind the scenes',
    type: 'video',
    duration: 15,
    timestamp: '8h ago',
    views: 198
  },
  { 
    id: '6', 
    user: 'David', 
    avatar: '🎵', 
    isOwn: false, 
    hasNew: true,
    content: 'New song preview! 🎵 Dropping next week',
    type: 'video',
    duration: 10,
    timestamp: '10h ago',
    views: 87
  },
  { 
    id: '7', 
    user: 'Maya', 
    avatar: '🌟', 
    isOwn: false, 
    hasNew: false,
    content: 'Beautiful sunset from my balcony',
    type: 'image',
    duration: 5,
    timestamp: '12h ago',
    views: 234
  },
  { 
    id: '8', 
    user: 'Chris', 
    avatar: '⚽', 
    isOwn: false, 
    hasNew: true, 
    isLive: true,
    content: 'Live from the stadium! ⚽ Amazing match!',
    type: 'live',
    duration: 30,
    timestamp: 'Live now',
    views: 456
  },
  { 
    id: '9', 
    user: 'Nina', 
    avatar: '📚', 
    isOwn: false, 
    hasNew: true,
    content: 'Book recommendation of the week 📚✨',
    type: 'text',
    duration: 5,
    timestamp: '1d ago',
    views: 123
  },
  { 
    id: '10', 
    user: 'Tom', 
    avatar: '🍕', 
    isOwn: false, 
    hasNew: false,
    content: 'Homemade pizza night! Recipe in bio 🍕',
    type: 'image',
    duration: 5,
    timestamp: '1d ago',
    views: 98
  }
];

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  storiesContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  storyItem: {
    alignItems: 'center',
    width: 70,
  },
  storyAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    position: 'relative',
    backgroundColor: '#1877F2',
    borderWidth: 2.5,
    borderColor: 'transparent',
  },
  storyAvatarNew: {
    borderColor: '#2563EB',
    backgroundColor: '#1E40AF',
  },
  storyAvatarOwn: {
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
    backgroundColor: '#1D4ED8',
  },
  storyAvatarLive: {
    borderColor: '#EF4444',
    backgroundColor: '#1E3A8A',
  },
  storyAvatarText: {
    fontSize: 24,
  },
  addStoryButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#1877F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  liveIndicator: {
    position: 'absolute',
    bottom: -4,
    backgroundColor: '#EF4444',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderWidth: 2,
    borderColor: 'white',
  },
  liveText: {
    color: 'white',
    fontSize: 7,
    fontWeight: '800',
  },
  storyText: {
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
  },
});