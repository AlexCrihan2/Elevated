import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MoodWeatherIndicatorProps {
  mood?: {
    emoji: string;
    label: string;
  };
  weather?: {
    temperature: number;
    condition: string;
    icon: string;
  };
  compact?: boolean;
}

export default function MoodWeatherIndicator({ mood, weather, compact = false }: MoodWeatherIndicatorProps) {
  if (!mood && !weather) return null;

  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      {mood && (
        <View style={[styles.badge, styles.moodBadge]}>
          <Text style={styles.emoji}>{mood.emoji}</Text>
          <Text style={styles.label}>{mood.label}</Text>
        </View>
      )}
      
      {weather && (
        <View style={[styles.badge, styles.weatherBadge]}>
          <Text style={styles.emoji}>{weather.icon}</Text>
          <Text style={styles.label}>{weather.temperature}°C</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginVertical: 4,
  },
  compactContainer: {
    gap: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  moodBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  weatherBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  emoji: {
    fontSize: 12,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
  },
});