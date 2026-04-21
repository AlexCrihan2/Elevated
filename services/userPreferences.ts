import { Platform } from 'react-native';

// Utility to get user's preferred language from storage
export const getUserPreferredLanguage = (): string => {
  try {
    // Check if we're in a web environment
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      const preferredLang = localStorage.getItem('preferred_language');
      if (preferredLang) {
        return preferredLang;
      }
      
      // Fallback: check app settings
      const settings = localStorage.getItem('app_settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        return parsed.preferredLanguage || 'en';
      }
    }
    
    // For React Native (iOS/Android), we'd use AsyncStorage here
    // But for now, return default
    return 'en';
  } catch (error) {
    console.error('Error getting preferred language:', error);
    return 'en'; // Default to English on error
  }
};

// Utility to save preferred language
export const saveUserPreferredLanguage = (languageCode: string): void => {
  try {
    // Check if we're in a web environment
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      localStorage.setItem('preferred_language', languageCode);
      
      // Also update in app_settings
      const settings = localStorage.getItem('app_settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        parsed.preferredLanguage = languageCode;
        localStorage.setItem('app_settings', JSON.stringify(parsed));
      } else {
        // Create new settings object if it doesn't exist
        const newSettings = {
          preferredLanguage: languageCode,
          autoTranslate: true,
          autoPlayAudio: false,
          darkMode: false,
          notifications: true,
          highQualityAudio: true,
          offlineMode: false,
          dataUsage: 'normal',
          autoDetectLanguage: true,
          translationQuality: 'balanced'
        };
        localStorage.setItem('app_settings', JSON.stringify(newSettings));
      }
    }
    
    // For React Native (iOS/Android), we'd use AsyncStorage here
  } catch (error) {
    console.error('Error saving preferred language:', error);
  }
};

// Utility to get auto-translate setting
export const getAutoTranslateSetting = (): boolean => {
  try {
    // Check if we're in a web environment
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      const settings = localStorage.getItem('app_settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        return parsed.autoTranslate ?? true;
      }
    }
    
    // For React Native (iOS/Android), we'd use AsyncStorage here
    return true; // Default to enabled
  } catch (error) {
    console.error('Error getting auto-translate setting:', error);
    return true; // Default to enabled on error
  }
};

// Utility to get all user settings
export const getUserSettings = () => {
  try {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      const settings = localStorage.getItem('app_settings');
      if (settings) {
        return JSON.parse(settings);
      }
    }
    
    // Return default settings
    return {
      autoTranslate: true,
      autoPlayAudio: false,
      darkMode: false,
      notifications: true,
      highQualityAudio: true,
      offlineMode: false,
      dataUsage: 'normal',
      preferredLanguage: 'en',
      autoDetectLanguage: true,
      translationQuality: 'balanced'
    };
  } catch (error) {
    console.error('Error getting user settings:', error);
    return {
      autoTranslate: true,
      autoPlayAudio: false,
      darkMode: false,
      notifications: true,
      highQualityAudio: true,
      offlineMode: false,
      dataUsage: 'normal',
      preferredLanguage: 'en',
      autoDetectLanguage: true,
      translationQuality: 'balanced'
    };
  }
};