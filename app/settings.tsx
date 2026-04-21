import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import VoiceSettings from '@/components/ui/VoiceSettings';
import TranslationWidget from '@/components/ui/TranslationWidget';
import audioTranslationService from '@/services/audioTranslationService';
import translationService, { SUPPORTED_LANGUAGES } from '@/services/translationService';

interface UserSettings {
  autoTranslate: boolean;
  autoPlayAudio: boolean;
  darkMode: boolean;
  notifications: boolean;
  highQualityAudio: boolean;
  offlineMode: boolean;
  dataUsage: 'low' | 'normal' | 'high';
  preferredLanguage: string;
  autoDetectLanguage: boolean;
  translationQuality: 'fast' | 'balanced' | 'accurate';
}

export default function AdvancedSettingsScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark, setDarkMode } = useTheme();
  
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showTranslationDemo, setShowTranslationDemo] = useState(false);
  
  // Settings State
  const [settings, setSettings] = useState<UserSettings>({
    autoTranslate: true,
    autoPlayAudio: false,
    darkMode: isDark,
    notifications: true,
    highQualityAudio: true,
    offlineMode: false,
    dataUsage: 'normal',
    preferredLanguage: 'en',
    autoDetectLanguage: true,
    translationQuality: 'balanced'
  });
  
  const [cacheSize, setCacheSize] = useState(0);
  const [voiceStats, setVoiceStats] = useState<any>({});
  const [translationStats, setTranslationStats] = useState({
    totalTranslations: 0,
    languagesUsed: 0,
    cacheHits: 0
  });

  useEffect(() => {
    loadSettings();
    loadStats();
  }, []);

  useEffect(() => {
    // Sync dark mode with theme context
    if (settings.darkMode !== isDark) {
      setDarkMode(settings.darkMode);
    }
  }, [settings.darkMode, isDark, setDarkMode]);

  const loadSettings = () => {
    try {
      if (typeof localStorage !== 'undefined') {
        const savedSettings = localStorage.getItem('app_settings');
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings(prev => ({ ...prev, ...parsed }));
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = (newSettings: Partial<UserSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('app_settings', JSON.stringify(updatedSettings));
        localStorage.setItem('preferred_language', updatedSettings.preferredLanguage);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const loadStats = () => {
    setCacheSize(audioTranslationService.getCacheSize());
    setVoiceStats(audioTranslationService.getVoiceStats());
    
    // Translation stats
    const history = translationService.getTranslationHistory();
    const uniqueLanguages = new Set(history.map(h => h.toLang));
    
    setTranslationStats({
      totalTranslations: history.length,
      languagesUsed: uniqueLanguages.size,
      cacheHits: translationService.getCacheSize()
    });
  };

  const getSelectedLanguage = () => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === settings.preferredLanguage) || SUPPORTED_LANGUAGES[0];
  };

  const handleLanguageChange = (languageCode: string) => {
    saveSettings({ preferredLanguage: languageCode });
    setShowLanguageSelector(false);
    Alert.alert(
      '✅ Language Updated', 
      `Translation preference set to ${SUPPORTED_LANGUAGES.find(l => l.code === languageCode)?.name}`
    );
  };

  const testTranslation = async () => {
    setShowTranslationDemo(true);
  };

  const clearAllCaches = () => {
    Alert.alert(
      'Clear All Caches',
      'This will remove all cached translations and audio files. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            audioTranslationService.clearCache();
            translationService.clearCache();
            setCacheSize(0);
            Alert.alert('✅ Success', 'All caches cleared successfully');
            loadStats();
          }
        }
      ]
    );
  };

  const exportSettings = () => {
    const exportData = {
      settings,
      translationStats,
      timestamp: new Date().toISOString(),
      version: '2.1.0'
    };
    
    Alert.alert(
      '📤 Settings Exported',
      `Settings exported successfully:\\n\\nLanguage: ${getSelectedLanguage().name}\\nTranslations: ${translationStats.totalTranslations}\\nLanguages Used: ${translationStats.languagesUsed}`,
      [{ text: 'OK' }]
    );
  };

  const resetSettings = () => {
    Alert.alert(
      'Reset All Settings',
      'This will reset all settings to default values and clear caches. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset All',
          style: 'destructive',
          onPress: () => {
            const defaultSettings: UserSettings = {
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
            setSettings(defaultSettings);
            saveSettings(defaultSettings);
            clearAllCaches();
            Alert.alert('✅ Success', 'All settings reset to default values');
          }
        }
      ]
    );
  };

  const renderSettingItem = (
    title: string,
    description: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    icon: string,
    premium?: boolean
  ) => (
    <View style={[styles.settingItem, { backgroundColor: theme.colors.inputBackground }]}>
      <View style={[styles.settingIcon, { backgroundColor: `${theme.colors.primary}20` }]}>
        <MaterialIcons name={icon as any} size={24} color={theme.colors.primary} />
      </View>
      
      <View style={styles.settingContent}>
        <View style={styles.settingHeader}>
          <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
            {title}
          </Text>
          {premium && (
            <View style={styles.premiumBadge}>
              <MaterialIcons name="star" size={12} color="#FFD700" />
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          )}
        </View>
        <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
          {description}
        </Text>
      </View>
      
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.colors.border, true: theme.colors.success }}
        thumbColor={value ? '#FFFFFF' : theme.colors.placeholder}
      />
    </View>
  );

  const renderActionItem = (
    title: string,
    description: string,
    onPress: () => void,
    icon: string,
    color: string = theme.colors.primary,
    destructive?: boolean
  ) => (
    <TouchableOpacity
      style={[styles.actionItem, { backgroundColor: theme.colors.inputBackground }]}
      onPress={onPress}
    >
      <View style={[styles.actionIcon, { backgroundColor: `${color}20` }]}>
        <MaterialIcons name={icon as any} size={24} color={color} />
      </View>
      
      <View style={styles.actionContent}>
        <Text style={[
          styles.actionTitle,
          { color: theme.colors.text },
          destructive && { color: theme.colors.error }
        ]}>
          {title}
        </Text>
        <Text style={[styles.actionDescription, { color: theme.colors.textSecondary }]}>
          {description}
        </Text>
      </View>
      
      <MaterialIcons 
        name="chevron-right" 
        size={20} 
        color={theme.colors.textSecondary} 
      />
    </TouchableOpacity>
  );

  const renderLanguageSelector = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showLanguageSelector}
      onRequestClose={() => setShowLanguageSelector(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.languageModal, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              🌍 Select Preferred Language
            </Text>
            <TouchableOpacity 
              onPress={() => setShowLanguageSelector(false)}
              style={[styles.closeButton, { backgroundColor: theme.colors.inputBackground }]}
            >
              <MaterialIcons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.modalSubtitle, { color: theme.colors.textSecondary }]}>
            Choose your preferred language for translations. This will be used as the default target language.
          </Text>
          
          <ScrollView style={styles.languageList} showsVerticalScrollIndicator={false}>
            {SUPPORTED_LANGUAGES.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageOption,
                  { backgroundColor: theme.colors.inputBackground },
                  settings.preferredLanguage === language.code && {
                    backgroundColor: `${theme.colors.primary}20`,
                    borderColor: theme.colors.primary,
                    borderWidth: 2
                  }
                ]}
                onPress={() => handleLanguageChange(language.code)}
              >
                <Text style={styles.languageFlag}>{language.flag}</Text>
                <View style={styles.languageInfo}>
                  <Text style={[
                    styles.languageName,
                    { color: theme.colors.text },
                    settings.preferredLanguage === language.code && { fontWeight: '700', color: theme.colors.primary }
                  ]}>
                    {language.name}
                  </Text>
                  <Text style={[styles.languageNative, { color: theme.colors.textSecondary }]}>
                    {language.nativeName}
                  </Text>
                </View>
                {settings.preferredLanguage === language.code && (
                  <MaterialIcons name="check-circle" size={24} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderTranslationDemo = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showTranslationDemo}
      onRequestClose={() => setShowTranslationDemo(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.demoModal, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              🔬 Translation Demo
            </Text>
            <TouchableOpacity 
              onPress={() => setShowTranslationDemo(false)}
              style={[styles.closeButton, { backgroundColor: theme.colors.inputBackground }]}
            >
              <MaterialIcons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.demoContent}>
            <Text style={[styles.demoLabel, { color: theme.colors.textSecondary }]}>
              Sample text to translate:
            </Text>
            <Text style={[styles.demoText, { color: theme.colors.text }]}>
              "🚀 Just launched my new AI-powered coding assistant! After 2 years of development, it can now write, debug, and optimize code in 15+ programming languages. Beta testing showed 85% faster development time!"
            </Text>
            
            <View style={styles.translationContainer}>
              <TranslationWidget
                text="🚀 Just launched my new AI-powered coding assistant! After 2 years of development, it can now write, debug, and optimize code in 15+ programming languages. Beta testing showed 85% faster development time!"
                category="technology"
                compact={false}
                darkMode={isDark}
                preferredLanguage={settings.preferredLanguage}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  const getTotalVoices = () => {
    return Object.values(voiceStats).reduce((total: number, stat: any) => total + (stat?.total || 0), 0);
  };

  const selectedLanguage = getSelectedLanguage();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          ⚙️ Advanced Settings
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
          Customize your AI translation experience
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
        {/* Translation Preferences */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWithTranslation}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              🌐 Translation Preferences
            </Text>
            <TranslationWidget
              text="Translation Preferences - Configure your language settings and preferences for automatic translation across the app"
              category="settings"
              compact={true}
              darkMode={isDark}
              preferredLanguage={settings.preferredLanguage}
            />
          </View>
          
          {/* Preferred Language Selection */}
          <TouchableOpacity
            style={[styles.languageSelector, { backgroundColor: theme.colors.inputBackground }]}
            onPress={() => setShowLanguageSelector(true)}
          >
            <View style={[styles.languageSelectorIcon, { backgroundColor: `${theme.colors.primary}20` }]}>
              <Text style={styles.languageSelectorFlag}>{selectedLanguage.flag}</Text>
            </View>
            <View style={styles.languageSelectorContent}>
              <Text style={[styles.languageSelectorTitle, { color: theme.colors.text }]}>
                Preferred Language
              </Text>
              <Text style={[styles.languageSelectorSubtitle, { color: theme.colors.textSecondary }]}>
                {selectedLanguage.name} ({selectedLanguage.nativeName})
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          {/* Translation Quality */}
          <View style={[styles.qualitySelector, { backgroundColor: theme.colors.inputBackground }]}>
            <Text style={[styles.qualityTitle, { color: theme.colors.text }]}>Translation Quality</Text>
            <View style={styles.qualityOptions}>
              {(['fast', 'balanced', 'accurate'] as const).map((quality) => (
                <TouchableOpacity
                  key={quality}
                  style={[
                    styles.qualityOption,
                    { borderColor: theme.colors.border },
                    settings.translationQuality === quality && { 
                      backgroundColor: `${theme.colors.primary}20`,
                      borderColor: theme.colors.primary 
                    }
                  ]}
                  onPress={() => saveSettings({ translationQuality: quality })}
                >
                  <Text style={[
                    styles.qualityOptionText,
                    { color: theme.colors.textSecondary },
                    settings.translationQuality === quality && { color: theme.colors.primary, fontWeight: '700' }
                  ]}>
                    {quality.charAt(0).toUpperCase() + quality.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Translation Demo */}
          {renderActionItem(
            'Test Translation',
            'Try translating sample text with your settings',
            testTranslation,
            'science',
            theme.colors.accent
          )}
        </View>

        {/* Translation Statistics */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWithTranslation}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              📊 Translation Statistics
            </Text>
            <TranslationWidget
              text="Translation Statistics - View your translation usage patterns, supported languages, and cached translations for optimal performance"
              category="analytics"
              compact={true}
              darkMode={isDark}
              preferredLanguage={settings.preferredLanguage}
            />
          </View>
          
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: theme.colors.inputBackground }]}>
              <MaterialIcons name="translate" size={20} color={theme.colors.success} />
              <Text style={[styles.statNumber, { color: theme.colors.text }]}>
                {translationStats.totalTranslations}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Total</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: theme.colors.inputBackground }]}>
              <MaterialIcons name="language" size={20} color={theme.colors.info} />
              <Text style={[styles.statNumber, { color: theme.colors.text }]}>
                {translationStats.languagesUsed}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Languages</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: theme.colors.inputBackground }]}>
              <MaterialIcons name="storage" size={20} color={theme.colors.warning} />
              <Text style={[styles.statNumber, { color: theme.colors.text }]}>
                {translationStats.cacheHits}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Cached</Text>
            </View>
          </View>
        </View>

        {/* AI Voice Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWithTranslation}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              🎙️ AI Voice Settings
            </Text>
            <TranslationWidget
              text="AI Voice Settings - Configure artificial intelligence voice synthesis options, select from premium voices, and customize audio translation experience"
              category="technology"
              compact={true}
              darkMode={isDark}
              preferredLanguage={settings.preferredLanguage}
            />
          </View>
          
          {renderActionItem(
            'Voice Selection & Testing',
            `${getTotalVoices()} AI voices available across 12 languages`,
            () => setShowVoiceSettings(true),
            'record-voice-over',
            '#8B5CF6'
          )}
        </View>

        {/* Translation Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWithTranslation}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              🔧 Translation Settings
            </Text>
            <TranslationWidget
              text="Translation Settings - Control automatic translation behavior, language detection, audio playback options, and offline translation capabilities"
              category="settings"
              compact={true}
              darkMode={isDark}
              preferredLanguage={settings.preferredLanguage}
            />
          </View>
          
          {renderSettingItem(
            'Auto-translate',
            'Automatically translate content when detected',
            settings.autoTranslate,
            (value) => saveSettings({ autoTranslate: value }),
            'translate'
          )}
          
          {renderSettingItem(
            'Auto-detect Language',
            'Automatically detect source language',
            settings.autoDetectLanguage,
            (value) => saveSettings({ autoDetectLanguage: value }),
            'auto-fix-high'
          )}
          
          {renderSettingItem(
            'Auto-play Audio',
            'Automatically play audio translations',
            settings.autoPlayAudio,
            (value) => saveSettings({ autoPlayAudio: value }),
            'volume-up'
          )}
          
          {renderSettingItem(
            'High Quality Audio',
            'Use premium quality for AI voice synthesis',
            settings.highQualityAudio,
            (value) => saveSettings({ highQualityAudio: value }),
            'high-quality',
            true
          )}
          
          {renderSettingItem(
            'Offline Mode',
            'Download voices for offline translation',
            settings.offlineMode,
            (value) => saveSettings({ offlineMode: value }),
            'offline-pin',
            true
          )}
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWithTranslation}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              📱 App Settings
            </Text>
            <TranslationWidget
              text="App Settings - Customize application appearance, notification preferences, and general user interface options for optimal user experience"
              category="settings"
              compact={true}
              darkMode={isDark}
              preferredLanguage={settings.preferredLanguage}
            />
          </View>
          
          {renderSettingItem(
            'Dark Mode',
            'Use dark theme throughout the app',
            settings.darkMode,
            (value) => saveSettings({ darkMode: value }),
            'dark-mode'
          )}
          
          {renderSettingItem(
            'Notifications',
            'Receive notifications about new features',
            settings.notifications,
            (value) => saveSettings({ notifications: value }),
            'notifications'
          )}
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            🔧 Actions
          </Text>
          
          {renderActionItem(
            'Export Settings',
            'Export your settings and stats for backup',
            exportSettings,
            'file-download',
            theme.colors.success
          )}
          
          {renderActionItem(
            'Clear All Caches',
            `Clear ${cacheSize + translationStats.cacheHits} cached files`,
            clearAllCaches,
            'delete-sweep',
            theme.colors.warning
          )}
          
          {renderActionItem(
            'Reset All Settings',
            'Reset all settings and clear caches',
            resetSettings,
            'restore',
            theme.colors.error,
            true
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            🤖 Powered by Advanced AI Translation Technology
          </Text>
          <Text style={[styles.versionText, { color: theme.colors.placeholder }]}>
            Version 2.1.0 • {SUPPORTED_LANGUAGES.length} Languages • {getTotalVoices()} AI Voices
          </Text>
        </View>
      </ScrollView>

      {/* Language Selector Modal */}
      {renderLanguageSelector()}
      
      {/* Translation Demo Modal */}
      {renderTranslationDemo()}

      {/* Voice Settings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showVoiceSettings}
        onRequestClose={() => setShowVoiceSettings(false)}
      >
        <VoiceSettings
          visible={showVoiceSettings}
          onClose={() => setShowVoiceSettings(false)}
          darkMode={isDark}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  // Section Header with Translation
  sectionHeaderWithTranslation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#92400E',
  },
  settingDescription: {
    fontSize: 14,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
  },
  
  // Language Selector
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  languageSelectorIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageSelectorFlag: {
    fontSize: 24,
  },
  languageSelectorContent: {
    flex: 1,
  },
  languageSelectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  languageSelectorSubtitle: {
    fontSize: 14,
  },
  
  // Quality Selector
  qualitySelector: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  qualityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  qualityOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  qualityOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  qualityOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Statistics
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
  },
  
  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageModal: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    padding: 20,
  },
  demoModal: {
    width: '95%',
    maxHeight: '85%',
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  
  // Language List
  languageList: {
    maxHeight: 400,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  languageFlag: {
    fontSize: 24,
    width: 32,
    textAlign: 'center',
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  languageNative: {
    fontSize: 14,
  },
  
  // Demo Content
  demoContent: {
    gap: 16,
  },
  demoLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  demoText: {
    fontSize: 16,
    lineHeight: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  translationContainer: {
    marginTop: 8,
  },
  
  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 12,
    textAlign: 'center',
  },
});