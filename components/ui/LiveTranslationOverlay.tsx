import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import translationService, { SUPPORTED_LANGUAGES } from '@/services/translationService';

interface LiveTranslationOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  liveText: string;
  darkMode?: boolean;
  streamType?: 'video' | 'audio' | 'chat';
}

export default function LiveTranslationOverlay({
  isVisible,
  onClose,
  liveText,
  darkMode = false,
  streamType = 'video'
}: LiveTranslationOverlayProps) {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['es', 'fr', 'de']);
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [translationHistory, setTranslationHistory] = useState<Array<{
    original: string;
    translations: { [key: string]: string };
    timestamp: Date;
  }>>([]);

  // Animation values
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  // Auto-translate live text when it changes
  useEffect(() => {
    if (autoTranslate && liveText && liveText.length > 10) {
      handleLiveTranslation(liveText);
    }
  }, [liveText, autoTranslate, selectedLanguages]);

  const handleLiveTranslation = async (text: string) => {
    if (!text || isTranslating) return;

    setIsTranslating(true);
    const newTranslations: { [key: string]: string } = {};

    try {
      // Translate to all selected languages simultaneously
      const translationPromises = selectedLanguages.map(async (langCode) => {
        const result = await translationService.translateText(
          text,
          langCode,
          undefined,
          streamType === 'video' ? 'entertainment' : 'general'
        );
        return { langCode, translation: result.translatedText };
      });

      const results = await Promise.all(translationPromises);
      results.forEach(({ langCode, translation }) => {
        newTranslations[langCode] = translation;
      });

      setTranslations(newTranslations);
      
      // Add to history
      setTranslationHistory(prev => [{
        original: text,
        translations: newTranslations,
        timestamp: new Date()
      }, ...prev.slice(0, 9)]); // Keep last 10 translations

    } catch (error) {
      console.error('Live translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const toggleLanguage = (langCode: string) => {
    setSelectedLanguages(prev => {
      if (prev.includes(langCode)) {
        return prev.filter(code => code !== langCode);
      } else if (prev.length < 5) { // Max 5 languages for performance
        return [...prev, langCode];
      }
      return prev;
    });
  };

  const getLanguageDisplay = (langCode: string) => {
    const lang = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
    return lang ? { flag: lang.flag, name: lang.name } : { flag: '🌐', name: langCode.toUpperCase() };
  };

  const getStreamIcon = () => {
    switch (streamType) {
      case 'video': return 'video-camera-front';
      case 'audio': return 'mic';
      case 'chat': return 'chat';
      default: return 'translate';
    }
  };

  if (!isVisible) return null;

  return (
    <Animated.View 
      style={[
        styles.overlay,
        darkMode && styles.overlayDark,
        {
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim,
        }
      ]}
    >
      {/* Header */}
      <View style={[styles.header, darkMode && styles.headerDark]}>
        <View style={styles.headerLeft}>
          <MaterialIcons 
            name={getStreamIcon() as any} 
            size={20} 
            color={darkMode ? '#60A5FA' : '#3B82F6'} 
          />
          <Text style={[styles.headerTitle, darkMode && styles.headerTitleDark]}>
            Live AI Translation
          </Text>
          <View style={[styles.liveIndicator, isTranslating && styles.liveIndicatorActive]}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={24} color={darkMode ? '#F9FAFB' : '#374151'} />
        </TouchableOpacity>
      </View>

      {/* Auto-translate Toggle */}
      <View style={[styles.controls, darkMode && styles.controlsDark]}>
        <TouchableOpacity
          style={[
            styles.autoToggle,
            autoTranslate && styles.autoToggleActive,
            darkMode && styles.autoToggleDark,
            autoTranslate && darkMode && styles.autoToggleActiveDark
          ]}
          onPress={() => setAutoTranslate(!autoTranslate)}
        >
          <MaterialIcons 
            name={autoTranslate ? 'auto-awesome' : 'pause'} 
            size={16} 
            color={autoTranslate ? '#FFFFFF' : (darkMode ? '#9CA3AF' : '#6B7280')} 
          />
          <Text style={[
            styles.autoToggleText,
            autoTranslate && styles.autoToggleTextActive,
            darkMode && styles.autoToggleTextDark,
            autoTranslate && darkMode && styles.autoToggleTextActiveDark
          ]}>
            {autoTranslate ? 'Auto ON' : 'Auto OFF'}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.languageCount, darkMode && styles.languageCountDark]}>
          {selectedLanguages.length}/5 Languages
        </Text>
      </View>

      {/* Language Selection */}
      <View style={[styles.languageSelection, darkMode && styles.languageSelectionDark]}>
        <Text style={[styles.sectionLabel, darkMode && styles.sectionLabelDark]}>
          Select Translation Languages
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.languageScroll}
        >
          {SUPPORTED_LANGUAGES.slice(0, 20).map((language) => {
            const isSelected = selectedLanguages.includes(language.code);
            return (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageChip,
                  isSelected && styles.languageChipSelected,
                  darkMode && styles.languageChipDark,
                  isSelected && darkMode && styles.languageChipSelectedDark
                ]}
                onPress={() => toggleLanguage(language.code)}
              >
                <Text style={styles.languageFlag}>{language.flag}</Text>
                <Text style={[
                  styles.languageChipText,
                  isSelected && styles.languageChipTextSelected,
                  darkMode && styles.languageChipTextDark,
                  isSelected && darkMode && styles.languageChipTextSelectedDark
                ]}>
                  {language.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Current Translation */}
      {liveText && (
        <View style={[styles.currentTranslation, darkMode && styles.currentTranslationDark]}>
          <Text style={[styles.sectionLabel, darkMode && styles.sectionLabelDark]}>
            Current Live Content
          </Text>
          <View style={[styles.originalTextBox, darkMode && styles.originalTextBoxDark]}>
            <Text style={[styles.originalText, darkMode && styles.originalTextDark]}>
              {liveText}
            </Text>
          </View>
          
          {isTranslating && (
            <View style={styles.translatingIndicator}>
              <ActivityIndicator size="small" color="#3B82F6" />
              <Text style={[styles.translatingText, darkMode && styles.translatingTextDark]}>
                Translating to {selectedLanguages.length} languages...
              </Text>
            </View>
          )}

          {Object.keys(translations).length > 0 && (
            <View style={styles.translationResults}>
              {selectedLanguages.map((langCode) => {
                const langInfo = getLanguageDisplay(langCode);
                const translation = translations[langCode];
                
                if (!translation) return null;
                
                return (
                  <View
                    key={langCode}
                    style={[styles.translationItem, darkMode && styles.translationItemDark]}
                  >
                    <View style={styles.translationHeader}>
                      <Text style={styles.translationFlag}>{langInfo.flag}</Text>
                      <Text style={[styles.translationLang, darkMode && styles.translationLangDark]}>
                        {langInfo.name}
                      </Text>
                    </View>
                    <Text style={[styles.translationText, darkMode && styles.translationTextDark]}>
                      {translation}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      )}

      {/* Translation History */}
      {translationHistory.length > 0 && (
        <View style={[styles.historySection, darkMode && styles.historySectionDark]}>
          <Text style={[styles.sectionLabel, darkMode && styles.sectionLabelDark]}>
            Recent Translations
          </Text>
          <ScrollView style={styles.historyScroll} showsVerticalScrollIndicator={false}>
            {translationHistory.map((item, index) => (
              <View key={index} style={[styles.historyItem, darkMode && styles.historyItemDark]}>
                <Text style={[styles.historyTimestamp, darkMode && styles.historyTimestampDark]}>
                  {item.timestamp.toLocaleTimeString()}
                </Text>
                <Text style={[styles.historyOriginal, darkMode && styles.historyOriginalDark]} numberOfLines={2}>
                  {item.original}
                </Text>
                <Text style={[styles.historyTranslations, darkMode && styles.historyTranslationsDark]}>
                  Translated to {Object.keys(item.translations).length} languages
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  overlayDark: {
    backgroundColor: '#1E293B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerDark: {
    borderBottomColor: '#374151',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerTitleDark: {
    color: '#F9FAFB',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    gap: 4,
  },
  liveIndicatorActive: {
    backgroundColor: '#10B981',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
  },
  controlsDark: {
    backgroundColor: '#0F172A',
  },
  autoToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    gap: 6,
  },
  autoToggleDark: {
    backgroundColor: '#374151',
  },
  autoToggleActive: {
    backgroundColor: '#3B82F6',
  },
  autoToggleActiveDark: {
    backgroundColor: '#60A5FA',
  },
  autoToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  autoToggleTextDark: {
    color: '#9CA3AF',
  },
  autoToggleTextActive: {
    color: '#FFFFFF',
  },
  autoToggleTextActiveDark: {
    color: '#FFFFFF',
  },
  languageCount: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  languageCountDark: {
    color: '#9CA3AF',
  },
  languageSelection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  languageSelectionDark: {
    borderBottomColor: '#374151',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  sectionLabelDark: {
    color: '#D1D5DB',
  },
  languageScroll: {
    maxHeight: 60,
  },
  languageChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    marginRight: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  languageChipDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  languageChipSelected: {
    backgroundColor: '#EBF4FF',
    borderColor: '#3B82F6',
  },
  languageChipSelectedDark: {
    backgroundColor: '#1E3A8A',
    borderColor: '#60A5FA',
  },
  languageFlag: {
    fontSize: 16,
  },
  languageChipText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  languageChipTextDark: {
    color: '#D1D5DB',
  },
  languageChipTextSelected: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  languageChipTextSelectedDark: {
    color: '#60A5FA',
  },
  currentTranslation: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  currentTranslationDark: {
    borderBottomColor: '#374151',
  },
  originalTextBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  originalTextBoxDark: {
    backgroundColor: '#0F172A',
    borderColor: '#374151',
  },
  originalText: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
  },
  originalTextDark: {
    color: '#F9FAFB',
  },
  translatingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  translatingText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  translatingTextDark: {
    color: '#9CA3AF',
  },
  translationResults: {
    gap: 8,
  },
  translationItem: {
    backgroundColor: '#EBF4FF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  translationItemDark: {
    backgroundColor: '#1E3A8A',
    borderColor: '#2563EB',
  },
  translationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  translationFlag: {
    fontSize: 14,
  },
  translationLang: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  translationLangDark: {
    color: '#60A5FA',
  },
  translationText: {
    fontSize: 13,
    color: '#1F2937',
    lineHeight: 18,
  },
  translationTextDark: {
    color: '#F9FAFB',
  },
  historySection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flex: 1,
  },
  historySectionDark: {},
  historyScroll: {
    maxHeight: 150,
  },
  historyItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  historyItemDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  historyTimestamp: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 4,
  },
  historyTimestampDark: {
    color: '#9CA3AF',
  },
  historyOriginal: {
    fontSize: 12,
    color: '#1F2937',
    marginBottom: 4,
  },
  historyOriginalDark: {
    color: '#F9FAFB',
  },
  historyTranslations: {
    fontSize: 10,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  historyTranslationsDark: {
    color: '#9CA3AF',
  },
});