import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  ActivityIndicator,
  Animated,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import translationService, { SUPPORTED_LANGUAGES } from '@/services/translationService';
import audioTranslationService from '@/services/audioTranslationService';

interface TranslationWidgetProps {
  text: string;
  category?: string;
  style?: any;
  buttonStyle?: any;
  compact?: boolean;
  darkMode?: boolean;
  preferredLanguage?: string;
  autoTranslate?: boolean;
}

export default function TranslationWidget({
  text,
  category = 'general',
  style,
  buttonStyle,
  compact = false,
  darkMode = false,
  preferredLanguage = 'en',
  autoTranslate = false
}: TranslationWidgetProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(preferredLanguage || 'en');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationConfidence, setTranslationConfidence] = useState<number>(0);
  const [sourceLanguage, setSourceLanguage] = useState<string>('');
  const [showOriginal, setShowOriginal] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Auto-translate effect when preferredLanguage changes
  useEffect(() => {
    if (autoTranslate && preferredLanguage && preferredLanguage !== 'en' && text) {
      // Auto-translate to preferred language if not English
      const detectLanguage = () => {
        // Simple detection - if text contains non-Latin characters, don't auto-translate
        if (/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\u0600-\u06ff\u0590-\u05ff\u0400-\u04ff]/.test(text)) {
          return;
        }
        // Auto-translate English text to preferred language
        handleTranslate(preferredLanguage);
      };
      
      const timer = setTimeout(detectLanguage, 1000); // Delay to avoid too frequent calls
      return () => clearTimeout(timer);
    }
  }, [text, preferredLanguage, autoTranslate]);

  const handleTranslate = async (targetLanguage: string) => {
    setIsTranslating(true);
    setSelectedLanguage(targetLanguage);
    setShowOriginal(false);

    // Button press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      const result = await translationService.translateText(
        text,
        targetLanguage,
        undefined,
        category
      );
      
      setTranslatedText(result.translatedText);
      setTranslationConfidence(result.confidence);
      setSourceLanguage(result.sourceLanguage);
      
      // Fade in animation for translated text
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText('Translation failed. Please try again.');
      setTranslationConfidence(0);
    } finally {
      setIsTranslating(false);
    }
  };

  const toggleOriginal = () => {
    setShowOriginal(!showOriginal);
  };

  const playAudioTranslation = async () => {
    if (isPlayingAudio) {
      audioTranslationService.stopAudio();
      setIsPlayingAudio(false);
      setAudioProgress(0);
      return;
    }

    const textToPlay = showOriginal ? text : translatedText;
    const languageToUse = showOriginal ? 'en' : targetLanguage; // Assume original is English
    
    if (!textToPlay) {
      alert('No text available for audio translation');
      return;
    }

    try {
      setIsPlayingAudio(true);
      await audioTranslationService.playAudioTranslation(
        textToPlay,
        languageToUse,
        undefined,
        (currentTime: number, duration: number) => {
          setAudioProgress((currentTime / duration) * 100);
        },
        () => {
          setIsPlayingAudio(false);
          setAudioProgress(0);
        }
      );
    } catch (error) {
      console.error('Audio translation failed:', error);
      setIsPlayingAudio(false);
      setAudioProgress(0);
      alert('Audio translation failed. Please try again.');
    }
  };

  const getLanguageDisplay = (langCode: string) => {
    const lang = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
    return lang ? `${lang.flag} ${lang.name}` : langCode.toUpperCase();
  };

  const renderCompactButton = () => (
    <TouchableOpacity
      style={[
        styles.compactButton,
        darkMode && styles.compactButtonDark,
        buttonStyle
      ]}
      onPress={() => setIsModalVisible(true)}
    >
      <MaterialIcons 
        name="translate" 
        size={16} 
        color={darkMode ? '#60A5FA' : '#3B82F6'} 
      />
      <Text style={[styles.compactButtonText, darkMode && styles.compactButtonTextDark]}>
        Translate
      </Text>
    </TouchableOpacity>
  );

  const renderFullButton = () => (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.translateButton,
          darkMode && styles.translateButtonDark,
          buttonStyle
        ]}
        onPress={() => setIsModalVisible(true)}
      >
        <MaterialIcons 
          name="g-translate" 
          size={20} 
          color={darkMode ? '#60A5FA' : '#3B82F6'} 
        />
        <Text style={[styles.translateButtonText, darkMode && styles.translateButtonTextDark]}>
          AI Translate
        </Text>
        <View style={[styles.languageCount, darkMode && styles.languageCountDark]}>
          <Text style={styles.languageCountText}>{SUPPORTED_LANGUAGES.length}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, style]}>
      {compact ? renderCompactButton() : renderFullButton()}
      
      {/* Translation Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={[styles.modalContainer, darkMode && styles.modalContainerDark]}>
          {/* Modal Header */}
          <View style={[styles.modalHeader, darkMode && styles.modalHeaderDark]}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <MaterialIcons name="close" size={24} color={darkMode ? '#F9FAFB' : '#374151'} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, darkMode && styles.modalTitleDark]}>
              🌐 AI Translation
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Original Text */}
          <View style={[styles.originalTextContainer, darkMode && styles.originalTextContainerDark]}>
            <Text style={[styles.sectionLabel, darkMode && styles.sectionLabelDark]}>
              Original Text ({sourceLanguage ? getLanguageDisplay(sourceLanguage) : 'Auto-detect'})
            </Text>
            <Text style={[styles.originalText, darkMode && styles.originalTextDark]}>
              {text}
            </Text>
          </View>

          {/* Language Selection */}
          <View style={[styles.languageSection, darkMode && styles.languageSectionDark]}>
            <Text style={[styles.sectionLabel, darkMode && styles.sectionLabelDark]}>
              Select Target Language
            </Text>
            <ScrollView 
              style={styles.languageGrid}
              showsVerticalScrollIndicator={true}
            >
              <View style={styles.languageRow}>
                {SUPPORTED_LANGUAGES.map((language) => {
                  const isPreferred = language.code === preferredLanguage;
                  return (
                  <TouchableOpacity
                    key={language.code}
                    style={[
                      styles.languageOption,
                      selectedLanguage === language.code && styles.languageOptionSelected,
                      darkMode && styles.languageOptionDark,
                      selectedLanguage === language.code && darkMode && styles.languageOptionSelectedDark,
                      isPreferred && styles.languageOptionPreferred
                    ]}
                    onPress={() => handleTranslate(language.code)}
                    disabled={isTranslating}
                  >
                    <View style={styles.languageHeader}>
                      <Text style={styles.languageFlag}>{language.flag}</Text>
                      {isPreferred && (
                        <MaterialIcons name="favorite" size={12} color="#EF4444" />
                      )}
                    </View>
                    <Text style={[
                      styles.languageName,
                      selectedLanguage === language.code && styles.languageNameSelected,
                      darkMode && styles.languageNameDark,
                      selectedLanguage === language.code && darkMode && styles.languageNameSelectedDark
                    ]}>
                      {language.name}
                    </Text>
                    <Text style={[
                      styles.languageNative,
                      darkMode && styles.languageNativeDark
                    ]}>
                      {language.nativeName}
                    </Text>
                    {isPreferred && (
                      <Text style={styles.preferredLabel}>Preferred</Text>
                    )}
                  </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          {/* Translation Result */}
          {(isTranslating || translatedText) && (
            <View style={[styles.resultContainer, darkMode && styles.resultContainerDark]}>
              <View style={styles.resultHeader}>
                <Text style={[styles.sectionLabel, darkMode && styles.sectionLabelDark]}>
                  Translation Result
                </Text>
                {translationConfidence > 0 && (
                  <View style={styles.confidenceContainer}>
                    <MaterialIcons 
                      name="verified" 
                      size={16} 
                      color={translationConfidence > 0.9 ? '#10B981' : translationConfidence > 0.8 ? '#F59E0B' : '#EF4444'} 
                    />
                    <Text style={[styles.confidenceText, darkMode && styles.confidenceTextDark]}>
                      {Math.round(translationConfidence * 100)}% confidence
                    </Text>
                  </View>
                )}
              </View>

              {isTranslating ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#3B82F6" />
                  <Text style={[styles.loadingText, darkMode && styles.loadingTextDark]}>
                    Translating with AI...
                  </Text>
                </View>
              ) : (
                <Animated.View style={{ opacity: fadeAnim }}>
                  <View style={[styles.translatedTextContainer, darkMode && styles.translatedTextContainerDark]}>
                    <Text style={[styles.translatedText, darkMode && styles.translatedTextDark]}>
                      {showOriginal ? text : translatedText}
                    </Text>
                  </View>
                  
                  {translatedText && (
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={[styles.actionButton, darkMode && styles.actionButtonDark]}
                        onPress={toggleOriginal}
                      >
                        <MaterialIcons 
                          name={showOriginal ? "visibility" : "visibility-off"} 
                          size={16} 
                          color={darkMode ? '#60A5FA' : '#3B82F6'} 
                        />
                        <Text style={[styles.actionButtonText, darkMode && styles.actionButtonTextDark]}>
                          {showOriginal ? 'Show Translation' : 'Show Original'}
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[styles.actionButton, darkMode && styles.actionButtonDark]}
                        onPress={playAudioTranslation}
                      >
                        <MaterialIcons 
                          name={isPlayingAudio ? "stop" : "volume-up"} 
                          size={16} 
                          color={darkMode ? '#60A5FA' : '#3B82F6'} 
                        />
                        <Text style={[styles.actionButtonText, darkMode && styles.actionButtonTextDark]}>
                          {isPlayingAudio ? 'Stop' : 'Listen'}
                        </Text>
                        {isPlayingAudio && (
                          <View style={styles.audioProgress}>
                            <View 
                              style={[styles.audioProgressFill, { width: `${audioProgress}%` }]} 
                            />
                          </View>
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                </Animated.View>
              )}
            </View>
          )}

          {/* Footer */}
          <View style={[styles.modalFooter, darkMode && styles.modalFooterDark]}>
            <Text style={[styles.footerText, darkMode && styles.footerTextDark]}>
              🤖 Powered by Advanced AI Translation • {SUPPORTED_LANGUAGES.length} Languages
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  compactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#EBF4FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    gap: 4,
  },
  compactButtonDark: {
    backgroundColor: '#1E3A8A',
    borderColor: '#2563EB',
  },
  compactButtonText: {
    fontSize: 11,
    color: '#3B82F6',
    fontWeight: '600',
  },
  compactButtonTextDark: {
    color: '#60A5FA',
  },
  translateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#DBEAFE',
    gap: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  translateButtonDark: {
    backgroundColor: '#1E3A8A',
    borderColor: '#2563EB',
  },
  translateButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '700',
  },
  translateButtonTextDark: {
    color: '#60A5FA',
  },
  languageCount: {
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  languageCountDark: {
    backgroundColor: '#60A5FA',
  },
  languageCountText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalContainerDark: {
    backgroundColor: '#0F172A',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
  },
  modalHeaderDark: {
    borderBottomColor: '#374151',
    backgroundColor: '#1E293B',
  },
  closeButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
  modalTitleDark: {
    color: '#F9FAFB',
  },
  placeholder: {
    width: 40,
  },
  originalTextContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  originalTextContainerDark: {
    borderBottomColor: '#374151',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  sectionLabelDark: {
    color: '#9CA3AF',
  },
  originalText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1F2937',
  },
  originalTextDark: {
    color: '#F9FAFB',
  },
  languageSection: {
    flex: 1,
    padding: 20,
  },
  languageSectionDark: {},
  languageGrid: {
    flex: 1,
  },
  languageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageOption: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  languageOptionDark: {
    backgroundColor: '#1E293B',
    borderColor: '#374151',
  },
  languageOptionSelected: {
    backgroundColor: '#EBF4FF',
    borderColor: '#3B82F6',
  },
  languageOptionSelectedDark: {
    backgroundColor: '#1E3A8A',
    borderColor: '#60A5FA',
  },
  languageOptionPreferred: {
    borderWidth: 2,
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 4,
  },
  languageFlag: {
    fontSize: 24,
  },
  preferredLabel: {
    fontSize: 9,
    color: '#EF4444',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 2,
  },
  languageName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  languageNameDark: {
    color: '#D1D5DB',
  },
  languageNameSelected: {
    color: '#3B82F6',
  },
  languageNameSelectedDark: {
    color: '#60A5FA',
  },
  languageNative: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 2,
  },
  languageNativeDark: {
    color: '#6B7280',
  },
  resultContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
  },
  resultContainerDark: {
    borderTopColor: '#374151',
    backgroundColor: '#1E293B',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  confidenceText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  confidenceTextDark: {
    color: '#9CA3AF',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
  },
  loadingTextDark: {
    color: '#9CA3AF',
  },
  translatedTextContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  translatedTextContainerDark: {
    backgroundColor: '#0F172A',
    borderColor: '#374151',
  },
  translatedText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1F2937',
  },
  translatedTextDark: {
    color: '#F9FAFB',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#EBF4FF',
    borderRadius: 8,
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  actionButtonDark: {
    backgroundColor: '#1E3A8A',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
  },
  actionButtonTextDark: {
    color: '#60A5FA',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  modalFooterDark: {
    borderTopColor: '#374151',
    backgroundColor: '#1E293B',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  footerTextDark: {
    color: '#9CA3AF',
  },
  audioProgress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
  },
  audioProgressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 1,
  },
});