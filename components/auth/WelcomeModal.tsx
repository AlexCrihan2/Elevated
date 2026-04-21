import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface WelcomeModalProps {
  visible: boolean;
  onComplete: () => void;
  userName?: string;
}

const { width, height } = Dimensions.get('window');

export default function WelcomeModal({ visible, onComplete, userName = "Professional" }: WelcomeModalProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  // Spectrum animation values
  const spectrum1 = useRef(new Animated.Value(0)).current;
  const spectrum2 = useRef(new Animated.Value(0)).current;
  const spectrum3 = useRef(new Animated.Value(0)).current;
  const spectrum4 = useRef(new Animated.Value(0)).current;
  const spectrum5 = useRef(new Animated.Value(0)).current;
  
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (visible) {
      // Reset all animations
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.3);
      slideAnim.setValue(50);
      rotateAnim.setValue(0);
      spectrum1.setValue(0);
      spectrum2.setValue(0);
      spectrum3.setValue(0);
      spectrum4.setValue(0);
      spectrum5.setValue(0);
      
      // Start welcome sequence
      startWelcomeAnimation();
    }
  }, [visible]);

  const startWelcomeAnimation = () => {
    // Phase 1: Spectrum entrance
    Animated.stagger(100, [
      Animated.spring(spectrum1, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(spectrum2, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(spectrum3, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(spectrum4, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(spectrum5, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowContent(true);
      startContentAnimation();
    });

    // Continuous spectrum pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startContentAnimation = () => {
    // Phase 2: Content entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleContinue = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onComplete();
    });
  };

  const getSpectrumStyle = (animValue: Animated.Value, delay: number = 0, colorIndex: number) => {
    const scale = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const rotate = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [`${delay}deg`, `${delay + 360}deg`],
    });

    const colors = [
      '#FF6B6B', // Red
      '#4ECDC4', // Teal
      '#FECA57', // Yellow
      '#5F27CD', // Purple
      '#00D2D3', // Cyan
    ];

    return {
      backgroundColor: colors[colorIndex % colors.length],
      transform: [
        { scale },
        { rotate },
      ],
    };
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="none"
      statusBarTranslucent
    >
      <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />
      
      <View style={styles.container}>
        {/* Animated Background */}
        <View style={styles.background} />

        {/* Spectrum Visualization */}
        <View style={styles.spectrumContainer}>
          {[spectrum1, spectrum2, spectrum3, spectrum4, spectrum5].map((spectrum, index) => (
            <Animated.View
              key={index}
              style={[
                styles.spectrumRing,
                {
                  width: 80 + (index * 40),
                  height: 80 + (index * 40),
                  borderRadius: (80 + (index * 40)) / 2,
                },
                getSpectrumStyle(spectrum, index * 72, index),
              ]}
            />
          ))}
        </View>

        {/* Floating Particles */}
        <View style={styles.particlesContainer}>
          {Array.from({ length: 20 }, (_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.particle,
                {
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.6],
                  }),
                  transform: [
                    {
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 50],
                        outputRange: [0, (Math.random() - 0.5) * 100],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>

        {/* Welcome Content */}
        {showContent && (
          <Animated.View
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  { translateY: slideAnim },
                ],
              },
            ]}
          >
            {/* Welcome Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.iconBackground}>
                <MaterialIcons name="celebration" size={48} color="#FFFFFF" />
              </View>
            </View>

            {/* Welcome Text */}
            <View style={styles.textContainer}>
              <Text style={styles.welcomeTitle}>Welcome to Elevated!</Text>
              <Text style={styles.welcomeSubtitle}>
                Hi {userName}, you're now part of our professional community
              </Text>
              <Text style={styles.welcomeDescription}>
                Discover, connect, and grow with industry leaders, researchers, and innovators worldwide.
              </Text>
            </View>

            {/* Features Preview */}
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: '#4ECDC4' }]}>
                  <MaterialIcons name="network-check" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.featureText}>Professional Network</Text>
              </View>
              
              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: '#FF6B6B' }]}>
                  <MaterialIcons name="psychology" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.featureText}>AI-Powered Insights</Text>
              </View>
              
              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: '#FECA57' }]}>
                  <MaterialIcons name="live-tv" size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.featureText}>Live Streaming</Text>
              </View>
            </View>

            {/* Continue Button */}
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueText}>Get Started</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Skip Option */}
            <TouchableOpacity style={styles.skipButton} onPress={handleContinue}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Background Pattern */}
        <View style={styles.patternOverlay}>
          {Array.from({ length: 6 }, (_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.patternCircle,
                {
                  left: (i % 2) * (width / 2) + Math.random() * 100 - 50,
                  top: Math.floor(i / 2) * (height / 3) + Math.random() * 100 - 50,
                  opacity: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.1],
                  }),
                  transform: [
                    {
                      scale: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#667eea',
  },
  spectrumContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: height * 0.15,
  },
  spectrumRing: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
    opacity: 0.8,
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: height * 0.1,
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconBackground: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  welcomeSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  welcomeDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 48,
    paddingHorizontal: 20,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 16,
  },
  continueButton: {
    width: '80%',
    marginBottom: 16,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  continueText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  patternOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  patternCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});