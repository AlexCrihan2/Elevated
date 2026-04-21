import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, ScrollView, Image, Dimensions, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAlert } from '@/template';

const { width: screenWidth } = Dimensions.get('window');

const THEME = {
  background: '#000000',
  surface: '#1A1A1A',
  surfaceSecondary: '#262626',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textTertiary: '#666666',
  accent: '#FF3040',
  accentSecondary: '#FF6B35',
  blue: '#0095F6',
  green: '#00D4AA',
  purple: '#A855F7',
  yellow: '#FFD60A',
  pink: '#E91E63',
  border: '#333333',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

interface RadioStation {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  genre: string;
  plays: number;
  cover: string;
  preview_url: string;
  source: 'radio';
  frequency?: string;
  country?: string;
  type?: string;
}

interface StudioPostCreatorProps {
  visible: boolean;
  onClose: () => void;
  onCreatePost: (post: any) => void;
}

export default function StudioPostCreator({ visible, onClose, onCreatePost }: StudioPostCreatorProps) {
  const { showAlert } = useAlert();
  const [postContent, setPostContent] = useState('');
  const [selectedRadio, setSelectedRadio] = useState<RadioStation | null>(null);
  const [showRadioSelection, setShowRadioSelection] = useState(false);
  const [favoriteRadios, setFavoriteRadios] = useState<RadioStation[]>([]);
  const [radioSearchQuery, setRadioSearchQuery] = useState('');
  const [radioResults, setRadioResults] = useState<RadioStation[]>([]);
  const [selectedRadioCategory, setSelectedRadioCategory] = useState('favorites');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  // Load favorite radio stations
  useEffect(() => {
    if (showRadioSelection) {
      loadFavoriteRadios();
    }
  }, [showRadioSelection]);

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const loadFavoriteRadios = () => {
    // Sample favorite radio stations
    const favorites: RadioStation[] = [
      {
        id: 'fav_1',
        title: 'BBC Radio 1',
        artist: 'United Kingdom • Public',
        album: 'Pop/Chart • 97.7 FM',
        duration: 'LIVE',
        genre: 'Pop/Chart',
        plays: 15000000,
        cover: 'https://via.placeholder.com/50x50/E74C3C/FFFFFF?text=BBC1',
        preview_url: '',
        source: 'radio',
        frequency: '97.7 FM',
        country: 'UK',
        type: 'Public'
      },
      {
        id: 'fav_2',
        title: 'KCRW',
        artist: 'United States • Public',
        album: 'Indie/Alternative • 89.9 FM',
        duration: 'LIVE',
        genre: 'Indie/Alternative',
        plays: 2500000,
        cover: 'https://via.placeholder.com/50x50/3498DB/FFFFFF?text=KCRW',
        preview_url: '',
        source: 'radio',
        frequency: '89.9 FM',
        country: 'US',
        type: 'Public'
      },
      {
        id: 'fav_3',
        title: 'Radio Paradise',
        artist: 'Global • Internet',
        album: 'Eclectic/Alternative • Stream',
        duration: 'LIVE',
        genre: 'Eclectic/Alternative',
        plays: 1200000,
        cover: 'https://via.placeholder.com/50x50/9B59B6/FFFFFF?text=RP',
        preview_url: '',
        source: 'radio',
        frequency: 'Stream',
        country: 'Global',
        type: 'Internet'
      },
      {
        id: 'fav_4',
        title: 'NPR News',
        artist: 'United States • Public',
        album: 'News/Talk • 90.9 FM',
        duration: 'LIVE',
        genre: 'News/Talk',
        plays: 8500000,
        cover: 'https://via.placeholder.com/50x50/E67E22/FFFFFF?text=NPR',
        preview_url: '',
        source: 'radio',
        frequency: '90.9 FM',
        country: 'US',
        type: 'Public'
      },
      {
        id: 'fav_5',
        title: 'NTS Radio',
        artist: 'United Kingdom • Internet',
        album: 'Underground/Electronic • Stream',
        duration: 'LIVE',
        genre: 'Underground/Electronic',
        plays: 850000,
        cover: 'https://via.placeholder.com/50x50/1ABC9C/FFFFFF?text=NTS',
        preview_url: '',
        source: 'radio',
        frequency: 'Stream',
        country: 'UK',
        type: 'Internet'
      },
      {
        id: 'fav_6',
        title: 'Jazz24',
        artist: 'United States • Internet',
        album: 'Jazz/Blues • Stream',
        duration: 'LIVE',
        genre: 'Jazz/Blues',
        plays: 680000,
        cover: 'https://via.placeholder.com/50x50/F39C12/FFFFFF?text=J24',
        preview_url: '',
        source: 'radio',
        frequency: 'Stream',
        country: 'US',
        type: 'Internet'
      },
      {
        id: 'fav_7',
        title: 'SomaFM Groove Salad',
        artist: 'United States • Internet',
        album: 'Ambient/Chillout • Stream',
        duration: 'LIVE',
        genre: 'Ambient/Chillout',
        plays: 950000,
        cover: 'https://via.placeholder.com/50x50/2ECC71/FFFFFF?text=SOMA',
        preview_url: '',
        source: 'radio',
        frequency: 'Stream',
        country: 'US',
        type: 'Internet'
      },
      {
        id: 'fav_8',
        title: 'France Inter',
        artist: 'France • Public',
        album: 'News/Culture • 87.8 FM',
        duration: 'LIVE',
        genre: 'News/Culture',
        plays: 5200000,
        cover: 'https://via.placeholder.com/50x50/E74C3C/FFFFFF?text=FI',
        preview_url: '',
        source: 'radio',
        frequency: '87.8 FM',
        country: 'France',
        type: 'Public'
      }
    ];

    setFavoriteRadios(favorites);
    setRadioResults(favorites);
  };

  const generateRandomRadios = (): RadioStation[] => {
    const genres = ['Pop', 'Rock', 'Jazz', 'Electronic', 'Classical', 'Hip-Hop', 'Country', 'News/Talk'];
    const countries = ['US', 'UK', 'DE', 'FR', 'IT', 'ES', 'CA', 'AU'];
    const types = ['Commercial', 'Public', 'Internet', 'Community'];
    
    const stations: RadioStation[] = [];
    
    for (let i = 0; i < 20; i++) {
      const genre = genres[Math.floor(Math.random() * genres.length)];
      const country = countries[Math.floor(Math.random() * countries.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      
      stations.push({
        id: `discover_${i}`,
        title: `${genre} Radio ${country}`,
        artist: `${country} • ${type}`,
        album: `${genre} • ${type === 'Internet' ? 'Stream' : (Math.random() * 20 + 88).toFixed(1) + ' FM'}`,
        duration: 'LIVE',
        genre,
        plays: Math.floor(Math.random() * 2000000) + 100000,
        cover: `https://via.placeholder.com/50x50/${getRandomColor()}/FFFFFF?text=${genre.substring(0, 3).toUpperCase()}`,
        preview_url: '',
        source: 'radio',
        frequency: type === 'Internet' ? 'Stream' : (Math.random() * 20 + 88).toFixed(1) + ' FM',
        country,
        type
      });
    }
    
    return stations;
  };

  const getRandomColor = (): string => {
    const colors = ['E74C3C', '3498DB', '9B59B6', 'E67E22', '1ABC9C', 'F39C12', '2ECC71', 'E91E63'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    if (!selectedRadio) {
      showAlert('Select Radio Station', 'Please select a radio station to record from.');
      return;
    }

    setIsRecording(true);
    showAlert('Recording Started', `Now recording from ${selectedRadio.title}. Tap the stop button when finished.`);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    
    if (recordingDuration < 5) {
      showAlert('Recording Too Short', 'Recording must be at least 5 seconds long.');
      return;
    }

    showAlert(
      'Save Recording?',
      `Your ${formatDuration(recordingDuration)} recording from ${selectedRadio?.title} is ready to share.`,
      [
        { text: 'Discard', style: 'cancel' },
        { text: 'Save & Share', onPress: handleCreatePost }
      ]
    );
  };

  const handleCreatePost = () => {
    if (!postContent.trim() && !selectedRadio) {
      showAlert('Add Content', 'Please add some content or select a radio station to share.');
      return;
    }

    const postData = {
      id: Date.now().toString(),
      content: postContent.trim(),
      radioStation: selectedRadio,
      recording: isRecording || recordingDuration > 0 ? {
        duration: recordingDuration,
        station: selectedRadio?.title,
        timestamp: Date.now()
      } : null,
      timestamp: Date.now(),
      type: 'studio_post',
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0
      }
    };

    onCreatePost(postData);
    
    showAlert('Studio Post Created!', 'Your post with radio content has been shared to your timeline.');
    
    // Reset form
    setPostContent('');
    setSelectedRadio(null);
    setIsRecording(false);
    setRecordingDuration(0);
    onClose();
  };

  const filteredRadios = radioResults.filter(radio =>
    radioSearchQuery === '' ||
    radio.title.toLowerCase().includes(radioSearchQuery.toLowerCase()) ||
    radio.genre.toLowerCase().includes(radioSearchQuery.toLowerCase()) ||
    radio.country?.toLowerCase().includes(radioSearchQuery.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="formSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color={THEME.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Studio Post</Text>
          <TouchableOpacity onPress={handleCreatePost} style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Post Content Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's happening in your studio?</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="Share what you're listening to, your thoughts, or studio moments..."
              placeholderTextColor={THEME.textSecondary}
              value={postContent}
              onChangeText={setPostContent}
              multiline
              maxLength={500}
            />
            <Text style={styles.charCount}>{postContent.length}/500</Text>
          </View>

          {/* Radio Station Selection */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Radio</Text>
              <TouchableOpacity 
                style={styles.selectButton}
                onPress={() => setShowRadioSelection(true)}
              >
                <MaterialIcons name="radio" size={16} color={THEME.text} />
                <Text style={styles.selectButtonText}>
                  {selectedRadio ? 'Change Station' : 'Select Station'}
                </Text>
              </TouchableOpacity>
            </View>

            {selectedRadio && (
              <View style={styles.selectedRadio}>
                <Image source={{ uri: selectedRadio.cover }} style={styles.radioLogo} />
                <View style={styles.radioInfo}>
                  <Text style={styles.radioTitle}>{selectedRadio.title}</Text>
                  <Text style={styles.radioDetails}>{selectedRadio.artist}</Text>
                  <Text style={styles.radioGenre}>{selectedRadio.genre} • {selectedRadio.frequency}</Text>
                </View>
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              </View>
            )}
          </View>

          {/* Recording Section */}
          {selectedRadio && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Studio Recording</Text>
              <Text style={styles.sectionDescription}>
                Record live audio from your selected radio station to share with your post
              </Text>

              <View style={styles.recordingControls}>
                {!isRecording ? (
                  <TouchableOpacity 
                    style={styles.recordButton}
                    onPress={handleStartRecording}
                  >
                    <MaterialIcons name="fiber-manual-record" size={24} color={THEME.text} />
                    <Text style={styles.recordButtonText}>Start Recording</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.recordingActive}>
                    <TouchableOpacity 
                      style={styles.stopButton}
                      onPress={handleStopRecording}
                    >
                      <MaterialIcons name="stop" size={24} color={THEME.text} />
                      <Text style={styles.stopButtonText}>Stop Recording</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.recordingStatus}>
                      <View style={styles.recordingIndicator}>
                        <View style={styles.recordingDot} />
                        <Text style={styles.recordingText}>REC</Text>
                      </View>
                      <Text style={styles.recordingDuration}>{formatDuration(recordingDuration)}</Text>
                    </View>
                  </View>
                )}
              </View>

              {recordingDuration > 0 && !isRecording && (
                <View style={styles.recordingPreview}>
                  <MaterialIcons name="audiotrack" size={20} color={THEME.green} />
                  <Text style={styles.recordingPreviewText}>
                    Recording ready: {formatDuration(recordingDuration)} from {selectedRadio.title}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Studio Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Studio Features</Text>
            <View style={styles.studioFeatures}>
              <TouchableOpacity style={styles.featureButton}>
                <MaterialIcons name="equalizer" size={20} color={THEME.text} />
                <Text style={styles.featureText}>Audio EQ</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.featureButton}>
                <MaterialIcons name="tune" size={20} color={THEME.text} />
                <Text style={styles.featureText}>Audio Effects</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.featureButton}>
                <MaterialIcons name="volume-up" size={20} color={THEME.text} />
                <Text style={styles.featureText}>Volume</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.featureButton}>
                <MaterialIcons name="schedule" size={20} color={THEME.text} />
                <Text style={styles.featureText}>Schedule</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Radio Selection Modal */}
        <Modal 
          visible={showRadioSelection} 
          animationType="slide" 
          presentationStyle="formSheet"
        >
          <View style={styles.radioModal}>
            <View style={styles.radioHeader}>
              <TouchableOpacity onPress={() => setShowRadioSelection(false)}>
                <MaterialIcons name="close" size={24} color={THEME.text} />
              </TouchableOpacity>
              <Text style={styles.radioHeaderTitle}>Select Radio Station</Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={styles.radioSearch}>
              <MaterialIcons name="search" size={20} color={THEME.textSecondary} />
              <TextInput
                style={styles.radioSearchInput}
                placeholder="Search stations, genres, countries..."
                placeholderTextColor={THEME.textSecondary}
                value={radioSearchQuery}
                onChangeText={setRadioSearchQuery}
              />
            </View>

            <View style={styles.radioTabs}>
              <TouchableOpacity
                style={[styles.radioTab, selectedRadioCategory === 'favorites' && styles.activeRadioTab]}
                onPress={() => {
                  setSelectedRadioCategory('favorites');
                  setRadioResults(favoriteRadios);
                }}
              >
                <Text style={[styles.radioTabText, selectedRadioCategory === 'favorites' && styles.activeRadioTabText]}>
                  Favorites
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.radioTab, selectedRadioCategory === 'discover' && styles.activeRadioTab]}
                onPress={() => {
                  setSelectedRadioCategory('discover');
                  setRadioResults(generateRandomRadios());
                }}
              >
                <Text style={[styles.radioTabText, selectedRadioCategory === 'discover' && styles.activeRadioTabText]}>
                  Discover
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.radioList}>
              {filteredRadios.map((radio) => (
                <TouchableOpacity
                  key={radio.id}
                  style={[
                    styles.radioItem,
                    selectedRadio?.id === radio.id && styles.selectedRadioItem
                  ]}
                  onPress={() => {
                    setSelectedRadio(radio);
                    setShowRadioSelection(false);
                  }}
                >
                  <Image source={{ uri: radio.cover }} style={styles.radioItemLogo} />
                  <View style={styles.radioItemInfo}>
                    <Text style={styles.radioItemTitle}>{radio.title}</Text>
                    <Text style={styles.radioItemDetails}>{radio.artist}</Text>
                    <Text style={styles.radioItemGenre}>{radio.genre} • {radio.frequency}</Text>
                  </View>
                  <View style={styles.radioItemRight}>
                    <View style={styles.liveIndicatorSmall}>
                      <View style={styles.liveDotSmall} />
                      <Text style={styles.liveTextSmall}>LIVE</Text>
                    </View>
                    <Text style={styles.radioListeners}>
                      {(radio.plays / 1000000).toFixed(1)}M listeners
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Modal>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  headerTitle: {
    color: THEME.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  shareButton: {
    backgroundColor: THEME.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shareButtonText: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionDescription: {
    color: THEME.textSecondary,
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  contentInput: {
    backgroundColor: THEME.surface,
    borderRadius: 12,
    padding: 16,
    color: THEME.text,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    color: THEME.textTertiary,
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  selectButtonText: {
    color: THEME.text,
    fontSize: 12,
    fontWeight: '500',
  },
  selectedRadio: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.surface,
    borderRadius: 12,
    padding: 16,
  },
  radioLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  radioInfo: {
    flex: 1,
  },
  radioTitle: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: '600',
  },
  radioDetails: {
    color: THEME.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  radioGenre: {
    color: THEME.textTertiary,
    fontSize: 12,
    marginTop: 4,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.accent,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.text,
  },
  liveText: {
    color: THEME.text,
    fontSize: 10,
    fontWeight: 'bold',
  },
  recordingControls: {
    alignItems: 'center',
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  recordButtonText: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: '600',
  },
  recordingActive: {
    alignItems: 'center',
    gap: 16,
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.surface,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    borderWidth: 2,
    borderColor: THEME.accent,
  },
  stopButtonText: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: '600',
  },
  recordingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.accent,
  },
  recordingText: {
    color: THEME.accent,
    fontSize: 12,
    fontWeight: 'bold',
  },
  recordingDuration: {
    color: THEME.text,
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  recordingPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.surface,
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    gap: 8,
  },
  recordingPreviewText: {
    color: THEME.green,
    fontSize: 14,
    fontWeight: '500',
  },
  studioFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
    minWidth: (screenWidth - 56) / 2,
  },
  featureText: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: '500',
  },
  // Radio Selection Modal Styles
  radioModal: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  radioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  radioHeaderTitle: {
    color: THEME.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  radioSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 16,
    gap: 8,
  },
  radioSearchInput: {
    flex: 1,
    color: THEME.text,
    fontSize: 16,
  },
  radioTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  radioTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeRadioTab: {
    borderBottomColor: THEME.accent,
  },
  radioTabText: {
    color: THEME.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  activeRadioTabText: {
    color: THEME.text,
    fontWeight: '600',
  },
  radioList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  selectedRadioItem: {
    backgroundColor: THEME.accent + '20',
    borderWidth: 1,
    borderColor: THEME.accent,
  },
  radioItemLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  radioItemInfo: {
    flex: 1,
  },
  radioItemTitle: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: '600',
  },
  radioItemDetails: {
    color: THEME.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  radioItemGenre: {
    color: THEME.textTertiary,
    fontSize: 12,
    marginTop: 4,
  },
  radioItemRight: {
    alignItems: 'flex-end',
  },
  liveIndicatorSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.accent,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 3,
    marginBottom: 4,
  },
  liveDotSmall: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME.text,
  },
  liveTextSmall: {
    color: THEME.text,
    fontSize: 8,
    fontWeight: 'bold',
  },
  radioListeners: {
    color: THEME.textTertiary,
    fontSize: 11,
  },
});