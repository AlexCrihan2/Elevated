import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Modal,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

interface LoginPageProps {
  visible: boolean;
  onLoginSuccess: () => void;
}

export default function LoginPage({ visible, onLoginSuccess }: LoginPageProps) {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const buttonPressAnim = useRef(new Animated.Value(1)).current;
  const socialButtonsAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (visible) {
      // Entry animation sequence
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(socialButtonsAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Continuous pulse animation
      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseLoop.start();
      
      return () => pulseLoop.stop();
    } else {
      // Reset animations when not visible
      fadeAnim.setValue(0);
      slideAnim.setValue(height);
      scaleAnim.setValue(0.8);
      socialButtonsAnim.setValue(0);
    }
  }, [visible]);
  
  useEffect(() => {
    // Continuous rotation animation
    const rotateLoop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    );
    if (visible) {
      rotateLoop.start();
    }
    return () => rotateLoop.stop();
  }, [visible]);
  
  const handleSocialPress = (provider: string) => {
    Animated.sequence([
      Animated.timing(buttonPressAnim, {
        toValue: 0.98,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(buttonPressAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
    
    handleSocialLogin(provider);
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    
    // Simulate social login API call
    setTimeout(() => {
      setIsLoading(false);
      // Directly call onLoginSuccess without showing alert
      onLoginSuccess();
    }, 1500);
  };

  const handleGuestLogin = () => {
    Alert.alert(
      'Guest Mode', 
      'You will have limited access to features. Continue as guest?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue as Guest', onPress: () => {
          setIsLoading(true);
          // Simulate guest login process
          setTimeout(() => {
            setIsLoading(false);
            onLoginSuccess();
          }, 500);
        }}
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="none" presentationStyle="fullScreen">
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View 
          style={[
            styles.container, 
            { 
              paddingTop: insets.top,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
          
          {/* Floating background elements */}
          <Animated.View 
            style={[
              styles.floatingCircle1,
              { 
                transform: [{
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg']
                  })
                }]
              }
            ]}
          />
          <Animated.View 
            style={[
              styles.floatingCircle2,
              { 
                transform: [{
                  scale: pulseAnim
                }]
              }
            ]}
          />
          
          <BlurView intensity={20} style={styles.blurContainer}>
            {/* Content */}
            <Animated.View 
              style={[
                styles.content,
                {
                  transform: [{ scale: scaleAnim }]
                }
              ]}
            >
              <View style={styles.formContainer}>
                {/* Animated Title */}
                <Animated.View 
                  style={[
                    styles.titleContainer,
                    {
                      opacity: socialButtonsAnim,
                      transform: [{
                        translateY: socialButtonsAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [50, 0]
                        })
                      }]
                    }
                  ]}
                >
                  <Animated.Text 
                    style={[
                      styles.title,
                      {
                        transform: [{
                          scale: pulseAnim.interpolate({
                            inputRange: [1, 1.05],
                            outputRange: [1, 1.02]
                          })
                        }]
                      }
                    ]}
                  >
                    🚀 Welcome to Elevated
                  </Animated.Text>
                  <Text style={styles.subtitle}>
                    Choose your preferred sign-in method to connect with professionals worldwide
                  </Text>
                </Animated.View>

                {/* Social Login Options */}
                <Animated.View 
                  style={[
                    styles.socialButtons,
                    {
                      opacity: socialButtonsAnim,
                      transform: [{
                        translateY: socialButtonsAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [50, 0]
                        })
                      }]
                    }
                  ]}
                >
                  {/* Google Login */}
                  <Animated.View
                    style={{
                      transform: [{ scale: buttonPressAnim }]
                    }}
                  >
                    <TouchableOpacity 
                      style={[styles.socialButton, styles.googleButton]}
                      onPress={() => handleSocialPress('Google')}
                      disabled={isLoading}
                    >
                      <MaterialIcons name="account-circle" size={24} color="#4285F4" />
                      <Text style={[styles.socialButtonText, { color: '#4285F4' }]}>🚀 Continue with Google</Text>
                    </TouchableOpacity>
                  </Animated.View>
                  
                  {/* Apple Login */}
                  <Animated.View
                    style={{
                      transform: [{ scale: buttonPressAnim }]
                    }}
                  >
                    <TouchableOpacity 
                      style={[styles.socialButton, styles.appleButton]}
                      onPress={() => handleSocialPress('Apple')}
                      disabled={isLoading}
                    >
                      <MaterialIcons name="smartphone" size={24} color="#000000" />
                      <Text style={[styles.socialButtonText, { color: '#000000' }]}>🍎 Continue with Apple</Text>
                    </TouchableOpacity>
                  </Animated.View>

                  {/* Guest Login */}
                  <Animated.View
                    style={{
                      transform: [{ scale: buttonPressAnim }]
                    }}
                  >
                    <TouchableOpacity 
                      style={[styles.socialButton, styles.guestButton]}
                      onPress={handleGuestLogin}
                      disabled={isLoading}
                    >
                      <MaterialIcons name="person" size={24} color="#6B7280" />
                      <Text style={[styles.socialButtonText, { color: '#6B7280' }]}>👤 Continue as Guest</Text>
                    </TouchableOpacity>
                  </Animated.View>

                </Animated.View>
                
                {/* Loading Overlay */}
                {isLoading && (
                  <Animated.View style={styles.loadingOverlay}>
                    <View style={styles.loadingContent}>
                      <ActivityIndicator size="large" color="white" />
                      <Text style={styles.loadingText}>Signing you in...</Text>
                    </View>
                  </Animated.View>
                )}
              </View>
            </Animated.View>

            {/* Demo Notice */}
            <Animated.View 
              style={[
                styles.demoNotice,
                {
                  opacity: socialButtonsAnim
                }
              ]}
            >
              <MaterialIcons name="info" size={16} color="rgba(255, 255, 255, 0.9)" />
              <Text style={styles.demoText}>
                🎯 Demo Mode: Choose any login method to continue
              </Text>
            </Animated.View>
          </BlurView>
        </Animated.View>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  blurContainer: {
    flex: 1,
  },
  floatingCircle1: {
    position: 'absolute',
    top: 100,
    right: 50,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  floatingCircle2: {
    position: 'absolute',
    bottom: 150,
    left: 30,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  titleContainer: {
    marginBottom: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 20,
    fontWeight: '500',
  },
  socialButtons: {
    gap: 20,
    paddingVertical: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    gap: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    minHeight: 64,
  },
  googleButton: {
    borderColor: '#4285F4',
    backgroundColor: 'rgba(248, 250, 255, 0.95)',
  },
  appleButton: {
    borderColor: '#000000',
    backgroundColor: 'rgba(250, 250, 250, 0.95)',
  },
  guestButton: {
    borderColor: '#6B7280',
    backgroundColor: 'rgba(249, 250, 251, 0.95)',
  },
  socialButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContent: {
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    paddingHorizontal: 32,
    paddingVertical: 24,
    borderRadius: 16,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  demoNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 32,
    marginBottom: 32,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  demoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    textAlign: 'center',
  },
});