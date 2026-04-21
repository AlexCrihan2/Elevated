import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  Alert,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useLocalization } from '@/contexts/LocalizationContext';

const { width } = Dimensions.get('window');

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
  forecast: {
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
  }[];
  feelLike: number;
  uvIndex: number;
  visibility: number;
  pressure: number;
}

interface UserMood {
  emoji: string;
  label: string;
  message: string;
  color: string;
}

export default function WeatherScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { t } = useLocalization();
  
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState<UserMood | null>(null);
  const [showMoodSelector, setShowMoodSelector] = useState(false);

  // Mood options to help users feel empowered
  const moodOptions: UserMood[] = [
    { emoji: '😊', label: 'Happy', message: 'You radiate positivity and joy! Your happiness brightens everyone around you.', color: '#FFD700' },
    { emoji: '💪', label: 'Empowered', message: 'You are strong, capable, and ready to conquer any challenge today!', color: '#FF6B47' },
    { emoji: '🌟', label: 'Inspired', message: 'Your creativity and vision can change the world. Keep shining!', color: '#8B5CF6' },
    { emoji: '💖', label: 'Grateful', message: 'Your gratitude creates abundance and attracts beautiful experiences.', color: '#EC4899' },
    { emoji: '🚀', label: 'Motivated', message: 'You have unlimited potential! Today is the day to chase your dreams.', color: '#06B6D4' },
    { emoji: '🧘‍♀️', label: 'Peaceful', message: 'Your inner calm is a superpower. You bring serenity to chaos.', color: '#10B981' },
    { emoji: '🎯', label: 'Focused', message: 'Your clarity and determination will lead you to amazing achievements.', color: '#F59E0B' },
    { emoji: '❤️', label: 'Loved', message: 'You are deeply valued and appreciated. Your presence matters.', color: '#EF4444' }
  ];

  useEffect(() => {
    loadWeatherData();
    
    // Set a random empowering mood if none selected
    if (!selectedMood) {
      const randomMood = moodOptions[Math.floor(Math.random() * moodOptions.length)];
      setSelectedMood(randomMood);
    }
  }, []);

  const loadWeatherData = async () => {
    setLoading(true);
    try {
      // Simulate weather API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockWeather: WeatherData = {
        temperature: Math.floor(Math.random() * 20) + 15, // 15-35°C
        condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Clear'][Math.floor(Math.random() * 5)],
        humidity: Math.floor(Math.random() * 40) + 30, // 30-70%
        windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
        location: 'Your Beautiful City',
        feelLike: Math.floor(Math.random() * 20) + 15,
        uvIndex: Math.floor(Math.random() * 10) + 1,
        visibility: Math.floor(Math.random() * 5) + 10, // 10-15 km
        pressure: Math.floor(Math.random() * 50) + 1000, // 1000-1050 hPa
        forecast: [
          { day: 'Today', high: 25, low: 18, condition: 'Sunny', icon: '☀️' },
          { day: 'Tomorrow', high: 23, low: 16, condition: 'Partly Cloudy', icon: '⛅' },
          { day: 'Friday', high: 27, low: 20, condition: 'Clear', icon: '🌤️' },
          { day: 'Saturday', high: 22, low: 15, condition: 'Cloudy', icon: '☁️' },
          { day: 'Sunday', high: 24, low: 17, condition: 'Sunny', icon: '☀️' }
        ]
      };
      
      setWeather(mockWeather);
    } catch (error) {
      Alert.alert('Weather Error', 'Unable to load weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    const icons = {
      'Sunny': '☀️',
      'Partly Cloudy': '⛅',
      'Cloudy': '☁️',
      'Rainy': '🌧️',
      'Clear': '🌤️'
    };
    return icons[condition as keyof typeof icons] || '🌤️';
  };

  const getWeatherAdvice = (condition: string, temperature: number) => {
    if (condition === 'Sunny' && temperature > 25) {
      return "Perfect day to shine as bright as the sun! ☀️ Stay hydrated and embrace your radiant energy.";
    } else if (condition === 'Rainy') {
      return "Let the rain wash away any worries! 🌧️ You're resilient and beautiful in every weather.";
    } else if (temperature < 15) {
      return "Cool weather, warm heart! ❄️ Your inner warmth can light up any cold day.";
    } else {
      return "Every day is a gift, and you make it special! 🎁 Your presence brightens the world.";
    }
  };

  const renderMoodSelector = () => (
    <View style={styles.moodSection}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        💝 How are you feeling today, beautiful soul?
      </Text>
      <Text style={[styles.empowermentText, { color: theme.colors.textSecondary }]}>
        Your feelings matter and you deserve to be celebrated! Choose your mood and let us lift you up even higher.
      </Text>
      
      <View style={styles.moodGrid}>
        {moodOptions.map((mood, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.moodOption,
              { backgroundColor: selectedMood?.label === mood.label ? mood.color : theme.colors.inputBackground },
              selectedMood?.label === mood.label && styles.selectedMood
            ]}
            onPress={() => {
              setSelectedMood(mood);
              Alert.alert(
                `${mood.emoji} ${mood.label}!`,
                mood.message,
                [{ text: 'Thank you! 💖', style: 'default' }]
              );
            }}
          >
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            <Text style={[
              styles.moodLabel,
              { color: selectedMood?.label === mood.label ? 'white' : theme.colors.text }
            ]}>
              {mood.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedMood && (
        <View style={[styles.selectedMoodCard, { backgroundColor: selectedMood.color + '20' }]}>
          <Text style={styles.selectedMoodEmoji}>{selectedMood.emoji}</Text>
          <Text style={[styles.selectedMoodMessage, { color: theme.colors.text }]}>
            {selectedMood.message}
          </Text>
        </View>
      )}
    </View>
  );

  const renderEmpowermentMessages = () => (
    <View style={styles.empowermentSection}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        ✨ Daily Empowerment
      </Text>
      
      <View style={[styles.empowermentCard, { backgroundColor: theme.colors.surface }]}>
        <Text style={styles.empowermentHeader}>🌟 You Are Amazing!</Text>
        <Text style={[styles.empowermentMessage, { color: theme.colors.text }]}>
          Every interaction you have here matters. Your voice is valuable, your thoughts are important, and your presence makes this community better. You have the power to connect, inspire, and create meaningful conversations.
        </Text>
      </View>

      <View style={[styles.empowermentCard, { backgroundColor: '#E8F5E8' }]}>
        <Text style={styles.empowermentHeader}>💪 You're Empowered to Lead</Text>
        <Text style={[styles.empowermentMessage, { color: '#2D5016' }]}>
          Don't wait for permission to start conversations, share your ideas, or reach out to others. You have everything you need within you to create excellent experiences and meaningful connections.
        </Text>
      </View>

      <View style={[styles.empowermentCard, { backgroundColor: '#FFF4E6' }]}>
        <Text style={styles.empowermentHeader}>🎯 Your Goals Matter</Text>
        <Text style={[styles.empowermentMessage, { color: '#7C2D12' }]}>
          Whether you're here to learn, share, connect, or grow - your goals are valid and achievable. Take the first step, reach out, and watch how the universe responds to your courage.
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingEmoji}>🌤️</Text>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Preparing something beautiful for you...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            🌈 Weather & Wellness
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Your daily dose of weather and encouragement
          </Text>
        </View>

        {/* Weather Card */}
        {weather && (
          <View style={[styles.weatherCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.weatherHeader}>
              <View style={styles.weatherMain}>
                <Text style={styles.weatherIcon}>{getWeatherIcon(weather.condition)}</Text>
                <View>
                  <Text style={[styles.temperature, { color: theme.colors.text }]}>
                    {weather.temperature}°C
                  </Text>
                  <Text style={[styles.condition, { color: theme.colors.textSecondary }]}>
                    {weather.condition}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.refreshButton}
                onPress={loadWeatherData}
              >
                <MaterialIcons name="refresh" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.location, { color: theme.colors.textSecondary }]}>
              📍 {weather.location}
            </Text>

            {/* Weather Details */}
            <View style={styles.weatherDetails}>
              <View style={styles.weatherDetailItem}>
                <Text style={styles.detailIcon}>🌡️</Text>
                <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Feels like</Text>
                <Text style={[styles.detailValue, { color: theme.colors.text }]}>{weather.feelLike}°C</Text>
              </View>
              <View style={styles.weatherDetailItem}>
                <Text style={styles.detailIcon}>💧</Text>
                <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Humidity</Text>
                <Text style={[styles.detailValue, { color: theme.colors.text }]}>{weather.humidity}%</Text>
              </View>
              <View style={styles.weatherDetailItem}>
                <Text style={styles.detailIcon}>💨</Text>
                <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Wind</Text>
                <Text style={[styles.detailValue, { color: theme.colors.text }]}>{weather.windSpeed} km/h</Text>
              </View>
            </View>

            {/* Weather Advice */}
            <View style={[styles.weatherAdvice, { backgroundColor: theme.colors.inputBackground }]}>
              <Text style={[styles.adviceText, { color: theme.colors.text }]}>
                {getWeatherAdvice(weather.condition, weather.temperature)}
              </Text>
            </View>

            {/* Forecast */}
            <View style={styles.forecast}>
              <Text style={[styles.forecastTitle, { color: theme.colors.text }]}>5-Day Forecast</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {weather.forecast.map((day, index) => (
                  <View key={index} style={[styles.forecastDay, { backgroundColor: theme.colors.inputBackground }]}>
                    <Text style={[styles.forecastDayName, { color: theme.colors.textSecondary }]}>{day.day}</Text>
                    <Text style={styles.forecastIcon}>{day.icon}</Text>
                    <Text style={[styles.forecastHigh, { color: theme.colors.text }]}>{day.high}°</Text>
                    <Text style={[styles.forecastLow, { color: theme.colors.textSecondary }]}>{day.low}°</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        {/* Mood Selector */}
        {renderMoodSelector()}

        {/* Empowerment Messages */}
        {renderEmpowermentMessages()}

        {/* Call to Action */}
        <View style={[styles.actionSection, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.actionTitle}>🚀 Ready to Connect?</Text>
          <Text style={styles.actionMessage}>
            You are empowered to start conversations, share your thoughts, and create meaningful connections. The weather is just perfect for new beginnings!
          </Text>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => Alert.alert('Amazing!', 'You\'re ready to make today incredible! Go chat, connect, and shine! ✨')}
          >
            <MaterialIcons name="chat" size={16} color={theme.colors.primary} />
            <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>
              Start Chatting Now!
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  weatherCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherIcon: {
    fontSize: 60,
    marginRight: 16,
  },
  temperature: {
    fontSize: 36,
    fontWeight: '700',
  },
  condition: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  refreshButton: {
    padding: 8,
  },
  location: {
    fontSize: 14,
    marginBottom: 20,
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  weatherDetailItem: {
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  weatherAdvice: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  adviceText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  forecast: {
    marginBottom: 16,
  },
  forecastTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  forecastDay: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 70,
  },
  forecastDayName: {
    fontSize: 12,
    marginBottom: 4,
  },
  forecastIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  forecastHigh: {
    fontSize: 14,
    fontWeight: '600',
  },
  forecastLow: {
    fontSize: 12,
  },
  moodSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  empowermentText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  moodOption: {
    width: (width - 60) / 4,
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  selectedMood: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedMoodCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectedMoodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  selectedMoodMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  empowermentSection: {
    marginBottom: 24,
  },
  empowermentCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  empowermentHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1F2937',
  },
  empowermentMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionSection: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  actionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  actionMessage: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});