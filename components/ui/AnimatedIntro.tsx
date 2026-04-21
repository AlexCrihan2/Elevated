import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  runOnJS,
  Easing,
  interpolate,
  withRepeat,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface AnimatedIntroProps {
  onComplete: () => void;
}

export default function AnimatedIntro({ onComplete }: AnimatedIntroProps) {
  // Animation values
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const logoRotation = useSharedValue(0);
  
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(50);
  
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(30);
  
  const particleOpacity = useSharedValue(0);
  const particleScale = useSharedValue(0.5);
  
  const backgroundOpacity = useSharedValue(1);
  const containerScale = useSharedValue(1);
  
  const progressWidth = useSharedValue(0);
  const progressOpacity = useSharedValue(0);
  
  const orb1Position = useSharedValue(0);
  const orb2Position = useSharedValue(0);
  const orb3Position = useSharedValue(0);

  useEffect(() => {
    // Start the animation sequence
    startIntroAnimation();
  }, []);

  const startIntroAnimation = () => {
    // Phase 1: Logo entrance with spring
    logoScale.value = withDelay(300, withSpring(1, {
      damping: 12,
      stiffness: 100,
    }));
    
    logoOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
    
    logoRotation.value = withDelay(500, withSequence(
      withTiming(360, { duration: 1000, easing: Easing.out(Easing.cubic) }),
      withRepeat(withTiming(360, { duration: 3000, easing: Easing.linear }), -1)
    ));

    // Phase 2: Floating orbs
    orb1Position.value = withDelay(800, withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ), -1
    ));
    
    orb2Position.value = withDelay(1200, withRepeat(
      withSequence(
        withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.sin) })
      ), -1
    ));
    
    orb3Position.value = withDelay(1600, withRepeat(
      withSequence(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.sin) })
      ), -1
    ));

    // Phase 3: Title and subtitle
    titleOpacity.value = withDelay(1000, withTiming(1, { duration: 600 }));
    titleTranslateY.value = withDelay(1000, withSpring(0, {
      damping: 10,
      stiffness: 100,
    }));
    
    subtitleOpacity.value = withDelay(1400, withTiming(1, { duration: 600 }));
    subtitleTranslateY.value = withDelay(1400, withSpring(0, {
      damping: 10,
      stiffness: 100,
    }));

    // Phase 4: Particles
    particleOpacity.value = withDelay(1800, withTiming(1, { duration: 500 }));
    particleScale.value = withDelay(1800, withSpring(1, {
      damping: 8,
      stiffness: 120,
    }));

    // Phase 5: Progress bar
    progressOpacity.value = withDelay(2200, withTiming(1, { duration: 400 }));
    progressWidth.value = withDelay(2400, withTiming(1, { 
      duration: 1500,
      easing: Easing.out(Easing.cubic)
    }));

    // Phase 6: Exit animation
    setTimeout(() => {
      // Zoom out effect
      containerScale.value = withTiming(0.9, { 
        duration: 500,
        easing: Easing.in(Easing.cubic)
      });
      
      backgroundOpacity.value = withTiming(0, { 
        duration: 500,
        easing: Easing.in(Easing.cubic)
      }, () => {
        runOnJS(onComplete)();
      });
    }, 4000);
  };

  // Logo animation styles
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotation.value}deg` }
    ],
    opacity: logoOpacity.value,
  }));

  // Title animation styles
  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  // Subtitle animation styles
  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  // Particles animation styles
  const particleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: particleOpacity.value,
    transform: [{ scale: particleScale.value }],
  }));

  // Background animation styles
  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
    transform: [{ scale: containerScale.value }],
  }));

  // Progress animation styles
  const progressAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progressOpacity.value,
  }));

  const progressBarAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  // Floating orbs animation styles
  const orb1AnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(orb1Position.value, [0, 1], [0, -30]);
    const translateX = interpolate(orb1Position.value, [0, 1], [0, 20]);
    return {
      transform: [
        { translateY },
        { translateX }
      ],
      opacity: interpolate(orb1Position.value, [0, 0.5, 1], [0.3, 1, 0.3]),
    };
  });

  const orb2AnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(orb2Position.value, [0, 1], [0, 40]);
    const translateX = interpolate(orb2Position.value, [0, 1], [0, -25]);
    return {
      transform: [
        { translateY },
        { translateX }
      ],
      opacity: interpolate(orb2Position.value, [0, 0.5, 1], [0.2, 0.8, 0.2]),
    };
  });

  const orb3AnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(orb3Position.value, [0, 1], [0, -20]);
    const translateX = interpolate(orb3Position.value, [0, 1], [0, 15]);
    return {
      transform: [
        { translateY },
        { translateX }
      ],
      opacity: interpolate(orb3Position.value, [0, 0.5, 1], [0.4, 0.9, 0.4]),
    };
  });

  return (
    <Animated.View style={[styles.container, backgroundAnimatedStyle]}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Background gradient effect with View */}
      <View style={styles.backgroundGradient} />

      {/* Floating orbs */}
      <Animated.View style={[styles.orb1, orb1AnimatedStyle]}>
        <View style={[styles.orbGradient, { backgroundColor: '#3B82F6' }]} />
      </Animated.View>
      
      <Animated.View style={[styles.orb2, orb2AnimatedStyle]}>
        <View style={[styles.orbGradient, { backgroundColor: '#8B5CF6' }]} />
      </Animated.View>
      
      <Animated.View style={[styles.orb3, orb3AnimatedStyle]}>
        <View style={[styles.orbGradient, { backgroundColor: '#10B981' }]} />
      </Animated.View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Logo */}
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <View style={styles.logoBackground}>
            <View style={styles.logoGradient}>
              <MaterialIcons name="auto-awesome" size={60} color="white" />
            </View>
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View style={titleAnimatedStyle}>
          <Text style={styles.title}>Elevated</Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View style={subtitleAnimatedStyle}>
          <Text style={styles.subtitle}>
            Elevated Social Experience
          </Text>
        </Animated.View>

        {/* Animated particles */}
        <Animated.View style={[styles.particlesContainer, particleAnimatedStyle]}>
          {[...Array(12)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.particle,
                {
                  left: `${10 + (index * 7)}%`,
                  top: `${30 + (index % 3) * 15}%`,
                },
                {
                  backgroundColor: index % 3 === 0 ? '#3B82F6' : 
                                 index % 3 === 1 ? '#8B5CF6' : 
                                 '#10B981'
                }
              ]}
            />
          ))}
        </Animated.View>
      </View>

      {/* Progress bar */}
      <Animated.View style={[styles.progressContainer, progressAnimatedStyle]}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, progressBarAnimatedStyle]}>
            <View style={styles.progressGradient} />
          </Animated.View>
        </View>
        <Text style={styles.progressText}>Initializing...</Text>
      </Animated.View>

      {/* Bottom decoration */}
      <View style={styles.bottomDecoration}>
        <View style={styles.decorationDot} />
        <View style={[styles.decorationDot, styles.decorationDotActive]} />
        <View style={styles.decorationDot} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
  },
  particlesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 100,
    left: 40,
    right: 40,
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 3,
    backgroundColor: '#E5E7EB',
    borderRadius: 1.5,
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    borderRadius: 1.5,
  },
  progressGradient: {
    flex: 1,
    borderRadius: 1.5,
    backgroundColor: '#3B82F6',
  },
  progressText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  bottomDecoration: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  decorationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
  },
  decorationDotActive: {
    backgroundColor: '#3B82F6',
  },
  orb1: {
    position: 'absolute',
    top: '20%',
    left: '15%',
    width: 80,
    height: 80,
  },
  orb2: {
    position: 'absolute',
    top: '60%',
    right: '10%',
    width: 60,
    height: 60,
  },
  orb3: {
    position: 'absolute',
    top: '80%',
    left: '25%',
    width: 40,
    height: 40,
  },
  orbGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    opacity: 0.1,
  },
});