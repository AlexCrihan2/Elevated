import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Switch,
  Slider,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import audioTranslationService, { AI_VOICES } from '@/services/audioTranslationService';

interface VoiceSettingsProps {
  visible: boolean;
  onClose: () => void;
  darkMode?: boolean;
}

export default function VoiceSettings({ visible, onClose, darkMode = false }: VoiceSettingsProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [autoPlay, setAutoPlay] = useState(true);
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [voicePitch, setVoicePitch] = useState(1.0);
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [testingVoiceId, setTestingVoiceId] = useState<string>('');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  ];

  useEffect(() => {
    const preferredVoice = audioTranslationService.getPreferredVoice(selectedLanguage);
    setSelectedVoice(preferredVoice?.id || '');
  }, [selectedLanguage]);

  const getVoicesForCurrentLanguage = () => {
    return audioTranslationService.getVoicesForLanguage(selectedLanguage);
  };

  const handleVoiceSelection = (voiceId: string) => {
    setSelectedVoice(voiceId);
    audioTranslationService.setPreferredVoice(selectedLanguage, voiceId);
  };

  const testVoice = async (voiceId: string) => {
    if (isTestingVoice) {
      audioTranslationService.stopAudio();
      setIsTestingVoice(false);
      setTestingVoiceId('');
      return;
    }

    setIsTestingVoice(true);
    setTestingVoiceId(voiceId);

    const voice = audioTranslationService.getVoiceById(voiceId);
    const testText = getTestText(selectedLanguage);

    try {
      await audioTranslationService.playAudioTranslation(
        testText,
        selectedLanguage,
        voiceId,
        undefined,
        () => {
          setIsTestingVoice(false);
          setTestingVoiceId('');
        }
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to play voice sample');
      setIsTestingVoice(false);
      setTestingVoiceId('');
    }
  };

  const getTestText = (languageCode: string): string => {
    const testTexts: { [key: string]: string } = {
      'en': 'Hello! This is a sample of my voice. I can help you understand content in your preferred language with natural speech.',
      'es': '¡Hola! Esta es una muestra de mi voz. Puedo ayudarte a entender contenido en tu idioma preferido con habla natural.',
      'fr': 'Bonjour ! Ceci est un échantillon de ma voix. Je peux vous aider à comprendre le contenu dans votre langue préférée avec une parole naturelle.',
      'de': 'Hallo! Dies ist eine Probe meiner Stimme. Ich kann Ihnen helfen, Inhalte in Ihrer bevorzugten Sprache mit natürlicher Sprache zu verstehen.',
      'ja': 'こんにちは！これは私の声のサンプルです。自然な音声でお好みの言語でコンテンツを理解するお手伝いができます。',
      'zh': '你好！这是我声音的样本。我可以帮助您用自然语音理解您首选语言的内容。',
      'ar': 'مرحبا! هذه عينة من صوتي. يمكنني مساعدتك في فهم المحتوى بلغتك المفضلة بكلام طبيعي.',
      'ru': 'Привет! Это образец моего голоса. Я могу помочь вам понять контент на предпочитаемом языке с естественной речью.',
      'it': 'Ciao! Questo è un campione della mia voce. Posso aiutarti a capire i contenuti nella tua lingua preferita con un linguaggio naturale.',
      'pt': 'Olá! Esta é uma amostra da minha voz. Posso ajudá-lo a entender o conteúdo no seu idioma preferido com fala natural.',
      'ko': '안녕하세요! 이것은 제 목소리 샘플입니다. 자연스러운 음성으로 선호하는 언어로 콘텐츠를 이해하는 데 도움을 드릴 수 있습니다.',
      'hi': 'नमस्ते! यह मेरी आवाज़ का नमूना है। मैं प्राकृतिक भाषण के साथ आपकी पसंदीदा भाषा में सामग्री समझने में आपकी सहायता कर सकता हूँ।',
    };
    
    return testTexts[languageCode] || testTexts['en'];
  };

  const getVoiceStats = () => {
    return audioTranslationService.getVoiceStats();
  };

  const renderVoiceCard = (voice: any) => {
    const isSelected = selectedVoice === voice.id;
    const isTesting = testingVoiceId === voice.id;
    
    return (
      <TouchableOpacity
        key={voice.id}
        style={[
          styles.voiceCard,
          darkMode && styles.voiceCardDark,
          isSelected && styles.voiceCardSelected,
          isSelected && darkMode && styles.voiceCardSelectedDark
        ]}
        onPress={() => handleVoiceSelection(voice.id)}
      >
        <View style={styles.voiceHeader}>
          <View style={styles.voiceInfo}>
            <View style={styles.voiceNameRow}>
              <Text style={[
                styles.voiceName,
                darkMode && styles.voiceNameDark,
                isSelected && styles.voiceNameSelected
              ]}>
                {voice.name}
              </Text>
              {voice.premium && (
                <View style={styles.premiumBadge}>
                  <MaterialIcons name="star" size={12} color="#FFD700" />
                  <Text style={styles.premiumText}>Premium</Text>
                </View>
              )}
            </View>
            
            <Text style={[styles.voiceDetails, darkMode && styles.voiceDetailsDark]}>
              {voice.gender} • {voice.age} • {voice.accent}
            </Text>
            
            {voice.personality && (
              <Text style={[styles.voicePersonality, darkMode && styles.voicePersonalityDark]}>
                {voice.personality}
              </Text>
            )}
          </View>
          
          <TouchableOpacity
            style={[
              styles.playButton,
              isTesting && styles.playButtonActive
            ]}
            onPress={() => testVoice(voice.id)}
          >
            <MaterialIcons 
              name={isTesting ? "stop" : "play-arrow"} 
              size={24} 
              color={isTesting ? "#EF4444" : "#10B981"} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.voiceMetrics}>
          <View style={styles.metric}>
            <Text style={[styles.metricLabel, darkMode && styles.metricLabelDark]}>Quality</Text>
            <View style={styles.qualityBar}>
              <View 
                style={[
                  styles.qualityFill, 
                  { width: `${voice.naturalness * 100}%` }
                ]} 
              />
            </View>
            <Text style={[styles.metricValue, darkMode && styles.metricValueDark]}>
              {Math.round(voice.naturalness * 100)}%
            </Text>
          </View>
          
          <View style={styles.emotionTags}>
            {voice.emotion && (
              <View style={[styles.emotionTag, { backgroundColor: getEmotionColor(voice.emotion) }]}>
                <Text style={styles.emotionText}>{voice.emotion}</Text>
              </View>
            )}
          </View>
        </View>
        
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <MaterialIcons name="check-circle" size={20} color="#10B981" />
            <Text style={[styles.selectedText, darkMode && styles.selectedTextDark]}>
              Selected
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      'neutral': '#6B7280',
      'happy': '#F59E0B',
      'calm': '#10B981',
      'excited': '#EF4444',
      'sad': '#8B5CF6'
    };
    return colors[emotion] || '#6B7280';
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, darkMode && styles.containerDark]}>
        {/* Header */}
        <View style={[styles.header, darkMode && styles.headerDark]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color={darkMode ? '#F9FAFB' : '#1F2937'} />
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, darkMode && styles.headerTitleDark]}>
            🎙️ AI Voice Settings
          </Text>
          
          <View style={styles.placeholder} />
        </View>

        {/* Language Selector */}
        <View style={[styles.section, darkMode && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>
            Select Language
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageChip,
                  darkMode && styles.languageChipDark,
                  selectedLanguage === lang.code && styles.languageChipSelected,
                  selectedLanguage === lang.code && darkMode && styles.languageChipSelectedDark
                ]}
                onPress={() => setSelectedLanguage(lang.code)}
              >
                <Text style={styles.languageFlag}>{lang.flag}</Text>
                <Text style={[
                  styles.languageText,
                  darkMode && styles.languageTextDark,
                  selectedLanguage === lang.code && styles.languageTextSelected
                ]}>
                  {lang.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Voice Selection */}
        <View style={[styles.section, darkMode && styles.sectionDark]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>
              AI Voices ({getVoicesForCurrentLanguage().length})
            </Text>
            <Text style={[styles.sectionSubtitle, darkMode && styles.sectionSubtitleDark]}>
              {getVoicesForCurrentLanguage().filter(v => v.premium).length} Premium voices
            </Text>
          </View>
          
          <ScrollView style={styles.voicesContainer} showsVerticalScrollIndicator={true}>
            {getVoicesForCurrentLanguage().map(renderVoiceCard)}
          </ScrollView>
        </View>

        {/* Audio Settings */}
        <View style={[styles.section, darkMode && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>
            Audio Settings
          </Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, darkMode && styles.settingLabelDark]}>
                Auto-play translations
              </Text>
              <Text style={[styles.settingDescription, darkMode && styles.settingDescriptionDark]}>
                Automatically play audio when translating
              </Text>
            </View>
            <Switch
              value={autoPlay}
              onValueChange={setAutoPlay}
              trackColor={{ false: '#E5E7EB', true: '#10B981' }}
              thumbColor={autoPlay ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>
        </View>

        {/* Statistics */}
        <View style={[styles.section, darkMode && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDark]}>
            Voice Statistics
          </Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, darkMode && styles.statCardDark]}>
              <Text style={[styles.statNumber, darkMode && styles.statNumberDark]}>
                {AI_VOICES.length}
              </Text>
              <Text style={[styles.statLabel, darkMode && styles.statLabelDark]}>
                Total Voices
              </Text>
            </View>
            
            <View style={[styles.statCard, darkMode && styles.statCardDark]}>
              <Text style={[styles.statNumber, darkMode && styles.statNumberDark]}>
                {languages.length}
              </Text>
              <Text style={[styles.statLabel, darkMode && styles.statLabelDark]}>
                Languages
              </Text>
            </View>
            
            <View style={[styles.statCard, darkMode && styles.statCardDark]}>
              <Text style={[styles.statNumber, darkMode && styles.statNumberDark]}>
                {AI_VOICES.filter(v => v.premium).length}
              </Text>
              <Text style={[styles.statLabel, darkMode && styles.statLabelDark]}>
                Premium Voices
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#1F2937',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerDark: {
    borderBottomColor: '#374151',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerTitleDark: {
    color: '#F9FAFB',
  },
  placeholder: {
    width: 40,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionDark: {},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  sectionTitleDark: {
    color: '#F9FAFB',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  sectionSubtitleDark: {
    color: '#9CA3AF',
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
  },
  languageChipDark: {
    backgroundColor: '#374151',
  },
  languageChipSelected: {
    backgroundColor: '#3B82F6',
  },
  languageChipSelectedDark: {
    backgroundColor: '#60A5FA',
  },
  languageFlag: {
    fontSize: 16,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  languageTextDark: {
    color: '#F9FAFB',
  },
  languageTextSelected: {
    color: '#FFFFFF',
  },
  voicesContainer: {
    maxHeight: 300,
  },
  voiceCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  voiceCardDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  voiceCardSelected: {
    backgroundColor: '#EBF4FF',
    borderColor: '#3B82F6',
  },
  voiceCardSelectedDark: {
    backgroundColor: '#1E3A8A',
    borderColor: '#60A5FA',
  },
  voiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  voiceInfo: {
    flex: 1,
  },
  voiceNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  voiceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  voiceNameDark: {
    color: '#F9FAFB',
  },
  voiceNameSelected: {
    color: '#3B82F6',
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
  voiceDetails: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  voiceDetailsDark: {
    color: '#9CA3AF',
  },
  voicePersonality: {
    fontSize: 11,
    color: '#8B5CF6',
    fontStyle: 'italic',
  },
  voicePersonalityDark: {
    color: '#A78BFA',
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  playButtonActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  voiceMetrics: {
    marginBottom: 8,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    width: 50,
  },
  metricLabelDark: {
    color: '#9CA3AF',
  },
  qualityBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  qualityFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  metricValue: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '500',
    width: 40,
    textAlign: 'right',
  },
  metricValueDark: {
    color: '#F9FAFB',
  },
  emotionTags: {
    flexDirection: 'row',
    gap: 4,
  },
  emotionTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  emotionText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectedText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  selectedTextDark: {
    color: '#34D399',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingLabelDark: {
    color: '#F9FAFB',
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  settingDescriptionDark: {
    color: '#9CA3AF',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statCardDark: {
    backgroundColor: '#374151',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  statNumberDark: {
    color: '#F9FAFB',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  statLabelDark: {
    color: '#9CA3AF',
  },
});