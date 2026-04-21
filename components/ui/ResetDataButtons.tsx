import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ResetDataButtonsProps {
  onResetPosts: () => void;
  onResetNews: () => void;
  onResetTags: () => void;
}

export default function ResetDataButtons({ onResetPosts, onResetNews, onResetTags }: ResetDataButtonsProps) {
  const [resetting, setResetting] = useState(false);

  const handleResetAll = async () => {
    setResetting(true);
    try {
      onResetPosts();
      onResetNews();
      onResetTags();
      Alert.alert('Success!', 'All posts, news, and person tags have been reset with fresh mood and weather data!');
    } catch (error) {
      Alert.alert('Error', 'Failed to reset data');
    } finally {
      setResetting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔄 Reset Data with Mood & Weather</Text>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.resetButton, { backgroundColor: '#FF6B47' }]}
          onPress={onResetPosts}
          disabled={resetting}
        >
          <MaterialIcons name="refresh" size={16} color="white" />
          <Text style={styles.buttonText}>Reset Posts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.resetButton, { backgroundColor: '#8B5CF6' }]}
          onPress={onResetNews}
          disabled={resetting}
        >
          <MaterialIcons name="newspaper" size={16} color="white" />
          <Text style={styles.buttonText}>Reset News</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.resetButton, { backgroundColor: '#10B981' }]}
          onPress={onResetTags}
          disabled={resetting}
        >
          <MaterialIcons name="people" size={16} color="white" />
          <Text style={styles.buttonText}>Reset Tags</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={[styles.resetAllButton, { backgroundColor: '#EF4444' }]}
        onPress={handleResetAll}
        disabled={resetting}
      >
        <MaterialIcons name={resetting ? 'hourglass-empty' : 'refresh'} size={20} color="white" />
        <Text style={styles.resetAllText}>{resetting ? 'Resetting All...' : 'Reset Everything'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  resetButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  resetAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  resetAllText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
});