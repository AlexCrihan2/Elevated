import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Dimensions, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LiveTranslationOverlay from '@/components/ui/LiveTranslationOverlay';

// Mock API since liveStreamApi import was missing
interface LiveStreamData {
  id: string;
  title: string;
  viewerCount: number;
}

interface LiveSubtitle {
  id: string;
  timestamp: number;
  text: string;
  language: string;
  confidence: number;
}

interface LiveStreamViewerProps {
  visible: boolean;
  onClose: () => void;
  streamData?: LiveStreamData;
}

const { width, height } = Dimensions.get('window');

const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸', confidence: 0.95 },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', confidence: 0.92 },
  { code: 'fr', name: 'French', flag: '🇫🇷', confidence: 0.89 },
  { code: 'de', name: 'German', flag: '🇩🇪', confidence: 0.91 },
  { code: 'it', name: 'Italian', flag: '🇮🇹', confidence: 0.88 },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷', confidence: 0.90 },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', confidence: 0.87 },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', confidence: 0.85 },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', confidence: 0.86 },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', confidence: 0.83 },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', confidence: 0.84 },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', confidence: 0.82 }
];

export default function LiveStreamViewer({ visible, onClose, streamData }: LiveStreamViewerProps) {
  const insets = useSafeAreaInsets();
  const [subtitles, setSubtitles] = useState<LiveSubtitle[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState(supportedLanguages[0]);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(true);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [translationConfidence, setTranslationConfidence] = useState(0.95);
  const [showTranslationOverlay, setShowTranslationOverlay] = useState(false);
  const [liveText, setLiveText] = useState('');

  useEffect(() => {
    if (!visible || !streamData) return;

    setViewerCount(streamData.viewerCount);

    // Simulate live subtitle generation with AI translation
    const subtitleInterval = setInterval(async () => {
      if (isTranscribing && captionsEnabled) {
        const newSubtitle = await generateLiveSubtitle();
        setSubtitles(prev => [...prev.slice(-3), newSubtitle]); // Keep last 4 subtitles
        setLiveText(newSubtitle.text); // Update live text for translation overlay
      }
    }, 4000);

    // Update viewer count periodically
    const viewerInterval = setInterval(async () => {
      if (streamData?.id) {
        const variation = Math.floor(Math.random() * 200) - 100; // +/- 100 viewers
        setViewerCount(prev => Math.max(1, prev + variation));
      }
    }, 8000);

    return () => {
      clearInterval(subtitleInterval);
      clearInterval(viewerInterval);
    };
  }, [visible, streamData, currentLanguage, isTranscribing, captionsEnabled]);

  const generateLiveSubtitle = async (): Promise<LiveSubtitle> => {
    const sampleTexts = {
      en: [
        "Welcome everyone to today's presentation on advanced AI applications.",
        "Let's dive into the technical implementation details.",
        "The results show significant improvements in accuracy and performance.",
        "Thank you for the great questions from our audience."
      ],
      es: [
        "Bienvenidos a la presentación de hoy sobre aplicaciones avanzadas de IA.",
        "Profundicemos en los detalles de implementación técnica.",
        "Los resultados muestran mejoras significativas en precisión y rendimiento.",
        "Gracias por las excelentes preguntas de nuestra audiencia."
      ],
      fr: [
        "Bienvenue à tous à la présentation d'aujourd'hui sur les applications avancées de l'IA.",
        "Plongeons dans les détails de mise en œuvre technique.",
        "Les résultats montrent des améliorations significatives en précision et performance.",
        "Merci pour les excellentes questions de notre audience."
      ],
      de: [
        "Willkommen zur heutigen Präsentation über fortgeschrittene KI-Anwendungen.",
        "Lassen Sie uns in die technischen Implementierungsdetails eintauchen.",
        "Die Ergebnisse zeigen signifikante Verbesserungen in Genauigkeit und Leistung.",
        "Vielen Dank für die großartigen Fragen unserer Zuhörer."
      ]
    };

    const texts = sampleTexts[currentLanguage.code as keyof typeof sampleTexts] || sampleTexts.en;
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    
    // Simulate varying confidence based on language and complexity
    const confidence = currentLanguage.confidence * (0.85 + Math.random() * 0.15);
    setTranslationConfidence(confidence);

    return {
      id: Date.now().toString(),
      timestamp: Date.now(),
      text: randomText,
      language: currentLanguage.code,
      confidence: confidence
    };
  };

  const selectLanguage = (language: typeof supportedLanguages[0]) => {
    setCurrentLanguage(language);
    setShowLanguageSelector(false);
    setSubtitles([]); // Clear existing subtitles when changing language
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return '#059669';
    if (confidence >= 0.8) return '#D69E2E';
    return '#E53E3E';
  };

  if (!streamData) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <StatusBar hidden={true} />
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="keyboard-arrow-down" size={28} color="white" />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
            <Text style={styles.viewerCount}>{viewerCount.toLocaleString()} watching</Text>
          </View>

          <TouchableOpacity style={styles.moreButton}>
            <MaterialIcons name="more-vert" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Video Area - Enhanced Simulation */}
        <View style={styles.videoContainer}>
          <View style={styles.videoBackground}>
            {/* Animated Gradient Background */}
            <View style={styles.gradientBackground} />
            
            {/* Professional Content Simulation */}
            <View style={styles.professionalOverlay}>
              <View style={styles.presentationCard}>
                <View style={styles.cardHeader}>
                  <MaterialIcons name="business" size={32} color="#3182CE" />
                  <Text style={styles.companyName}>TechCorp Solutions</Text>
                </View>
                
                <View style={styles.presentationContent}>
                  <Text style={styles.presentationTitle}>Q3 Results & AI Innovation</Text>
                  <View style={styles.metricsGrid}>
                    <View style={styles.metric}>
                      <Text style={styles.metricValue}>+47%</Text>
                      <Text style={styles.metricLabel}>Growth</Text>
                    </View>
                    <View style={styles.metric}>
                      <Text style={styles.metricValue}>15.2K</Text>
                      <Text style={styles.metricLabel}>Users</Text>
                    </View>
                    <View style={styles.metric}>
                      <Text style={styles.metricValue}>$2.4M</Text>
                      <Text style={styles.metricLabel}>Revenue</Text>
                    </View>
                  </View>
                  
                  {/* Charts Simulation */}
                  <View style={styles.chartArea}>
                    <View style={styles.chartBar} />
                    <View style={[styles.chartBar, { height: 40, backgroundColor: '#10B981' }]} />
                    <View style={[styles.chartBar, { height: 60, backgroundColor: '#3182CE' }]} />
                    <View style={[styles.chartBar, { height: 35, backgroundColor: '#F59E0B' }]} />
                    <View style={[styles.chartBar, { height: 70, backgroundColor: '#8B5CF6' }]} />
                  </View>
                </View>
              </View>
              
              {/* Speaker Simulation */}
              <View style={styles.speakerContainer}>
                <View style={styles.speakerAvatar}>
                  <MaterialIcons name="person" size={24} color="white" />
                </View>
                <View style={styles.speakerInfo}>
                  <Text style={styles.speakerName}>Dr. Sarah Johnson</Text>
                  <Text style={styles.speakerTitle}>Chief Technology Officer</Text>
                </View>
              </View>
            </View>
            
            {/* Live Streaming Indicators */}
            <View style={styles.streamingIndicators}>
              <View style={styles.recordingIndicator}>
                <View style={[styles.recordingDot, { backgroundColor: '#EF4444' }]} />
                <Text style={styles.recordingText}>Recording</Text>
              </View>
              
              <View style={styles.qualityIndicator}>
                <MaterialIcons name="hd" size={20} color="#10B981" />
                <Text style={styles.qualityText}>1080p</Text>
              </View>
            </View>
          </View>

          {/* Multilingual Subtitles Overlay */}
          {captionsEnabled && isTranscribing && subtitles.length > 0 && (
            <View style={styles.subtitlesOverlay}>
              {subtitles.slice(-2).map((subtitle) => (
                <View key={subtitle.id} style={styles.subtitleContainer}>
                  <View style={styles.subtitleHeader}>
                    <View style={styles.languageIndicator}>
                      <Text style={styles.languageFlag}>{currentLanguage.flag}</Text>
                      <Text style={styles.languageCode}>{currentLanguage.code.toUpperCase()}</Text>
                    </View>
                    <View style={styles.confidenceIndicator}>
                      <View 
                        style={[styles.confidenceDot, 
                        { backgroundColor: getConfidenceColor(subtitle.confidence) }]} 
                      />
                      <Text style={styles.confidenceText}>
                        {(subtitle.confidence * 100).toFixed(0)}%
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.subtitleText}>{subtitle.text}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Enhanced Controls */}
          <View style={styles.controls}>
            <TouchableOpacity 
              onPress={() => setCaptionsEnabled(!captionsEnabled)}
              style={[styles.controlButton, captionsEnabled && styles.controlButtonActive]}
            >
              <MaterialIcons 
                name={captionsEnabled ? "closed-caption" : "closed-caption-off"} 
                size={20} 
                color={captionsEnabled ? "white" : "#718096"} 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setShowLanguageSelector(true)}
              style={styles.languageButton}
            >
              <Text style={styles.languageFlag}>{currentLanguage.flag}</Text>
              <Text style={styles.languageText}>{currentLanguage.code.toUpperCase()}</Text>
              <MaterialIcons name="expand-more" size={16} color="white" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setIsTranscribing(!isTranscribing)}
              style={[styles.controlButton, isTranscribing && styles.controlButtonActive]}
            >
              <MaterialIcons 
                name={isTranscribing ? "mic" : "mic-off"} 
                size={20} 
                color={isTranscribing ? "white" : "#718096"} 
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton}>
              <MaterialIcons name="volume-up" size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setShowTranslationOverlay(!showTranslationOverlay)}
              style={[styles.controlButton, showTranslationOverlay && styles.controlButtonActive]}
            >
              <MaterialIcons name="translate" size={20} color={showTranslationOverlay ? "white" : "#718096"} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton}>
              <MaterialIcons name="fullscreen" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Professional Chat Area */}
        <View style={[styles.chatContainer, { paddingBottom: insets.bottom }]}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle}>Professional Discussion</Text>
            <View style={styles.translationStatus}>
              <MaterialIcons name="translate" size={16} color="#8B5CF6" />
              <Text style={styles.translationStatusText}>
                AI Translation: {(translationConfidence * 100).toFixed(0)}%
              </Text>
            </View>
          </View>
          
          <ScrollView style={styles.chatMessages}>
            {[
              { user: 'Dr. Sarah Johnson', message: 'Excellent presentation on AI applications!', time: '2s', verified: true },
              { user: 'Prof. Michael Chen', message: 'The technical implementation is fascinating', time: '5s', verified: true },
              { user: 'Industry Expert', message: 'When will this technology be available commercially?', time: '8s', verified: false },
              { user: 'Research Fellow', message: 'Great insights on the performance metrics', time: '12s', verified: true },
            ].map((msg, index) => (
              <View key={index} style={styles.chatMessage}>
                <View style={styles.chatUserContainer}>
                  <Text style={styles.chatUser}>{msg.user}</Text>
                  {msg.verified && (
                    <MaterialIcons name="verified" size={12} color="#3182CE" />
                  )}
                </View>
                <Text style={styles.chatText}>{msg.message}</Text>
                <Text style={styles.chatTime}>{msg.time}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Enhanced Language Selector Modal */}
        <Modal 
          visible={showLanguageSelector} 
          transparent 
          animationType="fade"
          onRequestClose={() => setShowLanguageSelector(false)}
        >
          <View style={styles.languageModalOverlay}>
            <View style={styles.languageModal}>
              <View style={styles.languageModalHeader}>
                <View style={styles.modalTitleContainer}>
                  <MaterialIcons name="translate" size={24} color="#8B5CF6" />
                  <Text style={styles.languageModalTitle}>AI Translation Language</Text>
                </View>
                <TouchableOpacity onPress={() => setShowLanguageSelector(false)}>
                  <MaterialIcons name="close" size={24} color="#2D3748" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.languageList}>
                {supportedLanguages.map((language) => (
                  <TouchableOpacity
                    key={language.code}
                    onPress={() => selectLanguage(language)}
                    style={[
                      styles.languageOption,
                      currentLanguage.code === language.code && styles.languageOptionSelected
                    ]}
                  >
                    <View style={styles.languageOptionLeft}>
                      <Text style={styles.languageFlag}>{language.flag}</Text>
                      <View style={styles.languageDetails}>
                        <Text style={styles.languageName}>{language.name}</Text>
                        <Text style={styles.languageCode}>
                          {language.code.toUpperCase()} • {(language.confidence * 100).toFixed(0)}% accuracy
                        </Text>
                      </View>
                    </View>
                    {currentLanguage.code === language.code && (
                      <MaterialIcons name="check-circle" size={20} color="#3182CE" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <View style={styles.modalFooter}>
                <View style={styles.aiPoweredBadge}>
                  <MaterialIcons name="auto-fix-high" size={16} color="#8B5CF6" />
                  <Text style={styles.aiPoweredText}>Powered by Advanced AI Translation</Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {/* Live Translation Overlay */}
        <LiveTranslationOverlay
          isVisible={showTranslationOverlay}
          onClose={() => setShowTranslationOverlay(false)}
          liveText={liveText}
          streamType="video"
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.9)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  closeButton: {
    padding: 4,
  },
  headerInfo: {
    alignItems: 'center',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
    marginRight: 6,
  },
  liveText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewerCount: {
    color: '#E2E8F0',
    fontSize: 14,
  },
  moreButton: {
    padding: 4,
  },
  videoContainer: {
    height: height * 0.65,
    position: 'relative',
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0F172A',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'linear-gradient(135deg, #1E3A8A 0%, #3730A3 50%, #1E40AF 100%)',
    opacity: 0.1,
  },
  professionalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  presentationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  companyName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 12,
  },
  presentationContent: {
    alignItems: 'center',
  },
  presentationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
    marginBottom: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#059669',
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'end',
    height: 80,
    gap: 8,
    marginTop: 12,
  },
  chartBar: {
    width: 20,
    height: 50,
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  speakerContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
  },
  speakerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  speakerInfo: {
    flex: 1,
  },
  speakerName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  speakerTitle: {
    color: '#D1D5DB',
    fontSize: 12,
    marginTop: 2,
  },
  streamingIndicators: {
    position: 'absolute',
    top: 20,
    right: 20,
    gap: 8,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  recordingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  qualityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  qualityText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  subtitlesOverlay: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
  },
  subtitleContainer: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#3182CE',
  },
  subtitleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  languageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageFlag: {
    fontSize: 16,
    marginRight: 6,
  },
  languageCode: {
    color: '#3182CE',
    fontSize: 12,
    fontWeight: '600',
  },
  confidenceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  confidenceText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '500',
  },
  subtitleText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 18,
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'column',
  },
  controlButton: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
    borderRadius: 25,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonActive: {
    backgroundColor: '#3182CE',
  },
  languageButton: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
    alignItems: 'center',
    minWidth: 60,
    flexDirection: 'row',
  },
  languageText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    marginHorizontal: 4,
  },
  chatContainer: {
    backgroundColor: '#F7FAFC',
    height: height * 0.35,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingTop: 16,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  chatTitle: {
    color: '#2D3748',
    fontSize: 18,
    fontWeight: '600',
  },
  translationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  translationStatusText: {
    color: '#8B5CF6',
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 4,
  },
  chatMessages: {
    paddingHorizontal: 16,
  },
  chatMessage: {
    marginBottom: 12,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3182CE',
  },
  chatUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatUser: {
    color: '#3182CE',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  chatText: {
    color: '#2D3748',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 4,
  },
  chatTime: {
    color: '#718096',
    fontSize: 12,
  },
  languageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  languageModal: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: height * 0.7,
  },
  languageModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageModalTitle: {
    color: '#2D3748',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  languageList: {
    maxHeight: 400,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F7FAFC',
  },
  languageOptionSelected: {
    backgroundColor: '#EBF8FF',
  },
  languageOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  languageDetails: {
    marginLeft: 12,
  },
  languageName: {
    color: '#2D3748',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'center',
  },
  aiPoweredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  aiPoweredText: {
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});