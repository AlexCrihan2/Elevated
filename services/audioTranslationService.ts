interface VoiceOption {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'neutral';
  age: 'young' | 'adult' | 'mature';
  accent: string;
  language: string;
  premium: boolean;
  naturalness: number;
  speed: number;
  pitch: number;
  emotion?: 'neutral' | 'happy' | 'sad' | 'excited' | 'calm';
  personality?: string;
}

interface AudioTranslationResponse {
  audioUrl: string;
  duration: number;
  voice: VoiceOption;
  text: string;
  language: string;
}

export const AI_VOICES: VoiceOption[] = [
  // English Voices
  { id: 'sarah-en', name: 'Sarah Mitchell', gender: 'female', age: 'adult', accent: 'American', language: 'en', premium: false, naturalness: 0.95, speed: 1.0, pitch: 1.0, emotion: 'neutral', personality: 'Professional news anchor with clear articulation' },
  { id: 'david-en', name: 'David Chen', gender: 'male', age: 'adult', accent: 'British', language: 'en', premium: true, naturalness: 0.97, speed: 1.0, pitch: 0.9, emotion: 'calm', personality: 'Distinguished professor with warm tone' },
  { id: 'emma-en', name: 'Emma Watson', gender: 'female', age: 'young', accent: 'Australian', language: 'en', premium: false, naturalness: 0.92, speed: 1.1, pitch: 1.1, emotion: 'happy', personality: 'Energetic presenter with friendly voice' },
  { id: 'james-en', name: 'James Rodriguez', gender: 'male', age: 'mature', accent: 'Canadian', language: 'en', premium: true, naturalness: 0.96, speed: 0.9, pitch: 0.8, emotion: 'neutral', personality: 'Experienced narrator with deep voice' },
  { id: 'zoe-en', name: 'Zoe Parker', gender: 'female', age: 'young', accent: 'American', language: 'en', premium: false, naturalness: 0.94, speed: 1.2, pitch: 1.2, emotion: 'excited', personality: 'Dynamic podcaster with animated delivery' },
  { id: 'alex-en', name: 'Alex Thompson', gender: 'neutral', age: 'adult', accent: 'Neutral', language: 'en', premium: true, naturalness: 0.98, speed: 1.0, pitch: 1.0, emotion: 'neutral', personality: 'AI assistant with perfect clarity' },

  // Spanish Voices
  { id: 'maria-es', name: 'María García', gender: 'female', age: 'adult', accent: 'Spanish', language: 'es', premium: false, naturalness: 0.93, speed: 1.0, pitch: 1.0, emotion: 'neutral', personality: 'Elegant Spanish broadcaster' },
  { id: 'carlos-es', name: 'Carlos Mendoza', gender: 'male', age: 'adult', accent: 'Mexican', language: 'es', premium: true, naturalness: 0.95, speed: 0.9, pitch: 0.9, emotion: 'calm', personality: 'Sophisticated Mexican narrator' },
  { id: 'lucia-es', name: 'Lucía Fernández', gender: 'female', age: 'young', accent: 'Argentinian', language: 'es', premium: false, naturalness: 0.91, speed: 1.1, pitch: 1.1, emotion: 'happy', personality: 'Vibrant Argentinian speaker' },
  { id: 'diego-es', name: 'Diego Ruiz', gender: 'male', age: 'mature', accent: 'Colombian', language: 'es', premium: true, naturalness: 0.94, speed: 1.0, pitch: 0.8, emotion: 'neutral', personality: 'Distinguished Colombian voice' },

  // French Voices  
  { id: 'sophie-fr', name: 'Sophie Dubois', gender: 'female', age: 'adult', accent: 'Parisian', language: 'fr', premium: false, naturalness: 0.94, speed: 1.0, pitch: 1.0, emotion: 'neutral', personality: 'Refined Parisian speaker' },
  { id: 'jean-fr', name: 'Jean-Luc Martin', gender: 'male', age: 'mature', accent: 'French', language: 'fr', premium: true, naturalness: 0.96, speed: 0.9, pitch: 0.9, emotion: 'calm', personality: 'Distinguished French intellectual' },
  { id: 'amelie-fr', name: 'Amélie Laurent', gender: 'female', age: 'young', accent: 'Canadian French', language: 'fr', premium: false, naturalness: 0.92, speed: 1.1, pitch: 1.1, emotion: 'happy', personality: 'Charming Quebec voice' },
  { id: 'pierre-fr', name: 'Pierre Moreau', gender: 'male', age: 'adult', accent: 'Belgian', language: 'fr', premium: true, naturalness: 0.95, speed: 1.0, pitch: 0.8, emotion: 'neutral', personality: 'Cultured Belgian narrator' },

  // German Voices
  { id: 'anna-de', name: 'Anna Schmidt', gender: 'female', age: 'adult', accent: 'German', language: 'de', premium: false, naturalness: 0.93, speed: 1.0, pitch: 1.0, emotion: 'neutral', personality: 'Clear German announcer' },
  { id: 'hans-de', name: 'Hans Weber', gender: 'male', age: 'mature', accent: 'Austrian', language: 'de', premium: true, naturalness: 0.95, speed: 0.9, pitch: 0.9, emotion: 'calm', personality: 'Sophisticated Austrian speaker' },
  { id: 'lisa-de', name: 'Lisa Mueller', gender: 'female', age: 'young', accent: 'Swiss German', language: 'de', premium: false, naturalness: 0.91, speed: 1.1, pitch: 1.1, emotion: 'happy', personality: 'Friendly Swiss presenter' },
  { id: 'klaus-de', name: 'Klaus Fischer', gender: 'male', age: 'adult', accent: 'Bavarian', language: 'de', premium: true, naturalness: 0.94, speed: 1.0, pitch: 0.8, emotion: 'neutral', personality: 'Authoritative Bavarian voice' },

  // Japanese Voices
  { id: 'yuki-ja', name: 'Yuki Tanaka', gender: 'female', age: 'adult', accent: 'Tokyo', language: 'ja', premium: false, naturalness: 0.94, speed: 1.0, pitch: 1.0, emotion: 'neutral', personality: 'Polite Tokyo broadcaster' },
  { id: 'hiroshi-ja', name: 'Hiroshi Sato', gender: 'male', age: 'mature', accent: 'Kansai', language: 'ja', premium: true, naturalness: 0.96, speed: 0.9, pitch: 0.9, emotion: 'calm', personality: 'Wise Kansai narrator' },
  { id: 'sakura-ja', name: 'Sakura Yamamoto', gender: 'female', age: 'young', accent: 'Kyoto', language: 'ja', premium: false, naturalness: 0.92, speed: 1.1, pitch: 1.2, emotion: 'happy', personality: 'Cheerful Kyoto speaker' },
  { id: 'kenji-ja', name: 'Kenji Nakamura', gender: 'male', age: 'adult', accent: 'Hokkaido', language: 'ja', premium: true, naturalness: 0.95, speed: 1.0, pitch: 0.8, emotion: 'neutral', personality: 'Strong Hokkaido voice' },

  // Chinese Voices
  { id: 'li-zh', name: 'Li Wei', gender: 'female', age: 'adult', accent: 'Mandarin', language: 'zh', premium: false, naturalness: 0.93, speed: 1.0, pitch: 1.0, emotion: 'neutral', personality: 'Standard Mandarin speaker' },
  { id: 'chen-zh', name: 'Chen Ming', gender: 'male', age: 'mature', accent: 'Beijing', language: 'zh', premium: true, naturalness: 0.95, speed: 0.9, pitch: 0.9, emotion: 'calm', personality: 'Authoritative Beijing voice' },
  { id: 'xiao-zh', name: 'Xiao Mei', gender: 'female', age: 'young', accent: 'Shanghai', language: 'zh', premium: false, naturalness: 0.91, speed: 1.1, pitch: 1.1, emotion: 'happy', personality: 'Modern Shanghai presenter' },
  { id: 'wang-zh', name: 'Wang Lei', gender: 'male', age: 'adult', accent: 'Guangdong', language: 'zh', premium: true, naturalness: 0.94, speed: 1.0, pitch: 0.8, emotion: 'neutral', personality: 'Distinguished Cantonese speaker' },

  // Arabic Voices
  { id: 'aisha-ar', name: 'Aisha Al-Rashid', gender: 'female', age: 'adult', accent: 'Modern Standard', language: 'ar', premium: false, naturalness: 0.92, speed: 1.0, pitch: 1.0, emotion: 'neutral', personality: 'Classical Arabic broadcaster' },
  { id: 'omar-ar', name: 'Omar Hassan', gender: 'male', age: 'mature', accent: 'Egyptian', language: 'ar', premium: true, naturalness: 0.94, speed: 0.9, pitch: 0.9, emotion: 'calm', personality: 'Eloquent Egyptian narrator' },
  { id: 'fatima-ar', name: 'Fatima Al-Zahra', gender: 'female', age: 'young', accent: 'Lebanese', language: 'ar', premium: false, naturalness: 0.90, speed: 1.1, pitch: 1.1, emotion: 'happy', personality: 'Energetic Lebanese voice' },
  { id: 'khalid-ar', name: 'Khalid Al-Mansouri', gender: 'male', age: 'adult', accent: 'Gulf', language: 'ar', premium: true, naturalness: 0.93, speed: 1.0, pitch: 0.8, emotion: 'neutral', personality: 'Prestigious Gulf speaker' },

  // Russian Voices
  { id: 'katya-ru', name: 'Katya Volkov', gender: 'female', age: 'adult', accent: 'Moscow', language: 'ru', premium: false, naturalness: 0.93, speed: 1.0, pitch: 1.0, emotion: 'neutral', personality: 'Standard Moscow broadcaster' },
  { id: 'dmitri-ru', name: 'Dmitri Petrov', gender: 'male', age: 'mature', accent: 'St. Petersburg', language: 'ru', premium: true, naturalness: 0.95, speed: 0.9, pitch: 0.9, emotion: 'calm', personality: 'Cultured St. Petersburg voice' },
  { id: 'anya-ru', name: 'Anya Kozlova', gender: 'female', age: 'young', accent: 'Siberian', language: 'ru', premium: false, naturalness: 0.91, speed: 1.1, pitch: 1.1, emotion: 'happy', personality: 'Spirited Siberian speaker' },
  { id: 'boris-ru', name: 'Boris Orlov', gender: 'male', age: 'adult', accent: 'Ukrainian Russian', language: 'ru', premium: true, naturalness: 0.94, speed: 1.0, pitch: 0.8, emotion: 'neutral', personality: 'Distinguished Ukrainian Russian' },

  // Italian Voices
  { id: 'giulia-it', name: 'Giulia Romano', gender: 'female', age: 'adult', accent: 'Roman', language: 'it', premium: false, naturalness: 0.94, speed: 1.0, pitch: 1.0, emotion: 'neutral', personality: 'Elegant Roman speaker' },
  { id: 'marco-it', name: 'Marco Bianchi', gender: 'male', age: 'mature', accent: 'Milanese', language: 'it', premium: true, naturalness: 0.96, speed: 0.9, pitch: 0.9, emotion: 'calm', personality: 'Sophisticated Milanese voice' },
  { id: 'sofia-it', name: 'Sofia Rossi', gender: 'female', age: 'young', accent: 'Neapolitan', language: 'it', premium: false, naturalness: 0.92, speed: 1.1, pitch: 1.2, emotion: 'happy', personality: 'Vibrant Neapolitan presenter' },
  { id: 'lorenzo-it', name: 'Lorenzo Ferrari', gender: 'male', age: 'adult', accent: 'Tuscan', language: 'it', premium: true, naturalness: 0.95, speed: 1.0, pitch: 0.8, emotion: 'neutral', personality: 'Classic Tuscan narrator' },

  // Portuguese Voices
  { id: 'isabella-pt', name: 'Isabella Silva', gender: 'female', age: 'adult', accent: 'Brazilian', language: 'pt', premium: false, naturalness: 0.93, speed: 1.0, pitch: 1.0, emotion: 'neutral', personality: 'Warm Brazilian broadcaster' },
  { id: 'rafael-pt', name: 'Rafael Santos', gender: 'male', age: 'mature', accent: 'Portuguese', language: 'pt', premium: true, naturalness: 0.95, speed: 0.9, pitch: 0.9, emotion: 'calm', personality: 'Distinguished Portuguese speaker' },
  { id: 'camila-pt', name: 'Camila Oliveira', gender: 'female', age: 'young', accent: 'Paulista', language: 'pt', premium: false, naturalness: 0.91, speed: 1.1, pitch: 1.1, emotion: 'happy', personality: 'Energetic São Paulo voice' },
  { id: 'pedro-pt', name: 'Pedro Costa', gender: 'male', age: 'adult', accent: 'Carioca', language: 'pt', premium: true, naturalness: 0.94, speed: 1.0, pitch: 0.8, emotion: 'neutral', personality: 'Charismatic Rio narrator' },

  // Korean Voices
  { id: 'jin-ko', name: 'Jin Park', gender: 'female', age: 'adult', accent: 'Seoul', language: 'ko', premium: false, naturalness: 0.93, speed: 1.0, pitch: 1.0, emotion: 'neutral', personality: 'Professional Seoul broadcaster' },
  { id: 'min-ko', name: 'Min-jun Kim', gender: 'male', age: 'mature', accent: 'Busan', language: 'ko', premium: true, naturalness: 0.95, speed: 0.9, pitch: 0.9, emotion: 'calm', personality: 'Seasoned Busan narrator' },
  { id: 'hana-ko', name: 'Hana Lee', gender: 'female', age: 'young', accent: 'Jeju', language: 'ko', premium: false, naturalness: 0.91, speed: 1.1, pitch: 1.2, emotion: 'happy', personality: 'Cheerful Jeju presenter' },
  { id: 'junho-ko', name: 'Jun-ho Choi', gender: 'male', age: 'adult', accent: 'Daegu', language: 'ko', premium: true, naturalness: 0.94, speed: 1.0, pitch: 0.8, emotion: 'neutral', personality: 'Authoritative Daegu voice' },

  // Hindi Voices
  { id: 'priya-hi', name: 'Priya Sharma', gender: 'female', age: 'adult', accent: 'Delhi', language: 'hi', premium: false, naturalness: 0.92, speed: 1.0, pitch: 1.0, emotion: 'neutral', personality: 'Standard Hindi broadcaster' },
  { id: 'arjun-hi', name: 'Arjun Gupta', gender: 'male', age: 'mature', accent: 'Mumbai', language: 'hi', premium: true, naturalness: 0.94, speed: 0.9, pitch: 0.9, emotion: 'calm', personality: 'Experienced Mumbai narrator' },
  { id: 'kavya-hi', name: 'Kavya Patel', gender: 'female', age: 'young', accent: 'Gujarati Hindi', language: 'hi', premium: false, naturalness: 0.90, speed: 1.1, pitch: 1.1, emotion: 'happy', personality: 'Spirited Gujarati speaker' },
  { id: 'vikram-hi', name: 'Vikram Singh', gender: 'male', age: 'adult', accent: 'Punjabi Hindi', language: 'hi', premium: true, naturalness: 0.93, speed: 1.0, pitch: 0.8, emotion: 'neutral', personality: 'Strong Punjabi voice' },
];

class AudioTranslationService {
  private selectedVoices: { [language: string]: string } = {};
  private audioCache = new Map<string, string>();
  private isPlaying = false;
  private currentAudio: HTMLAudioElement | null = null;

  constructor() {
    // Set default voices for each language
    this.selectedVoices = {
      'en': 'sarah-en',
      'es': 'maria-es',
      'fr': 'sophie-fr',
      'de': 'anna-de',
      'ja': 'yuki-ja',
      'zh': 'li-zh',
      'ar': 'aisha-ar',
      'ru': 'katya-ru',
      'it': 'giulia-it',
      'pt': 'isabella-pt',
      'ko': 'jin-ko',
      'hi': 'priya-hi'
    };
  }

  // Get voices for a specific language
  getVoicesForLanguage(languageCode: string): VoiceOption[] {
    return AI_VOICES.filter(voice => voice.language === languageCode);
  }

  // Get all available voices
  getAllVoices(): VoiceOption[] {
    return AI_VOICES;
  }

  // Get voice by ID
  getVoiceById(voiceId: string): VoiceOption | null {
    return AI_VOICES.find(voice => voice.id === voiceId) || null;
  }

  // Set preferred voice for a language
  setPreferredVoice(languageCode: string, voiceId: string): void {
    const voice = this.getVoiceById(voiceId);
    if (voice && voice.language === languageCode) {
      this.selectedVoices[languageCode] = voiceId;
      // Save to local storage
      if (typeof Storage !== 'undefined') {
        localStorage.setItem('preferred_voices', JSON.stringify(this.selectedVoices));
      }
    }
  }

  // Get preferred voice for a language
  getPreferredVoice(languageCode: string): VoiceOption | null {
    // Load from local storage on first use
    if (typeof Storage !== 'undefined') {
      const saved = localStorage.getItem('preferred_voices');
      if (saved) {
        this.selectedVoices = { ...this.selectedVoices, ...JSON.parse(saved) };
      }
    }

    const voiceId = this.selectedVoices[languageCode];
    return voiceId ? this.getVoiceById(voiceId) : null;
  }

  // Generate audio for text with AI voice
  async generateAudio(
    text: string, 
    languageCode: string, 
    voiceId?: string
  ): Promise<AudioTranslationResponse> {
    // Use provided voice or get preferred voice
    const voice = voiceId 
      ? this.getVoiceById(voiceId)
      : this.getPreferredVoice(languageCode) || this.getVoicesForLanguage(languageCode)[0];

    if (!voice) {
      throw new Error(`No voice available for language: ${languageCode}`);
    }

    // Create cache key
    const cacheKey = `${text}_${voice.id}`;
    
    // Check cache first
    if (this.audioCache.has(cacheKey)) {
      return {
        audioUrl: this.audioCache.get(cacheKey)!,
        duration: this.estimateAudioDuration(text, voice),
        voice,
        text,
        language: languageCode
      };
    }

    // Simulate API call to generate audio
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Generate mock audio URL (in real implementation, this would be from TTS API)
    const audioUrl = this.generateMockAudioUrl(text, voice);
    
    // Cache the result
    this.audioCache.set(cacheKey, audioUrl);

    return {
      audioUrl,
      duration: this.estimateAudioDuration(text, voice),
      voice,
      text,
      language: languageCode
    };
  }

  // Play audio translation
  async playAudioTranslation(
    text: string, 
    languageCode: string, 
    voiceId?: string,
    onProgress?: (currentTime: number, duration: number) => void,
    onComplete?: () => void
  ): Promise<void> {
    try {
      // Stop any currently playing audio
      this.stopAudio();

      // Generate audio
      const audioData = await this.generateAudio(text, languageCode, voiceId);
      
      // Create and play audio
      if (typeof Audio !== 'undefined') {
        this.currentAudio = new Audio(audioData.audioUrl);
        this.isPlaying = true;

        // Set up event listeners
        this.currentAudio.addEventListener('timeupdate', () => {
          if (this.currentAudio && onProgress) {
            onProgress(this.currentAudio.currentTime, this.currentAudio.duration || audioData.duration);
          }
        });

        this.currentAudio.addEventListener('ended', () => {
          this.isPlaying = false;
          this.currentAudio = null;
          if (onComplete) onComplete();
        });

        this.currentAudio.addEventListener('error', (error) => {
          console.error('Audio playback error:', error);
          this.isPlaying = false;
          this.currentAudio = null;
        });

        // Start playback
        await this.currentAudio.play();
      } else {
        // Mobile/React Native implementation would use different audio library
        console.log('Audio playback not supported in this environment');
        
        // Simulate playback for mobile
        if (onProgress && onComplete) {
          const duration = audioData.duration;
          const interval = setInterval(() => {
            const currentTime = Date.now() % (duration * 1000) / 1000;
            onProgress(currentTime, duration);
            
            if (currentTime >= duration - 0.1) {
              clearInterval(interval);
              this.isPlaying = false;
              onComplete();
            }
          }, 100);

          setTimeout(() => {
            clearInterval(interval);
            this.isPlaying = false;
            if (onComplete) onComplete();
          }, duration * 1000);
        }
      }
    } catch (error) {
      console.error('Failed to play audio translation:', error);
      this.isPlaying = false;
      throw error;
    }
  }

  // Stop audio playback
  stopAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    this.isPlaying = false;
  }

  // Check if audio is currently playing
  isAudioPlaying(): boolean {
    return this.isPlaying;
  }

  // Estimate audio duration based on text length and voice characteristics
  private estimateAudioDuration(text: string, voice: VoiceOption): number {
    const wordsPerMinute = 150 * voice.speed; // Adjust for voice speed
    const words = text.split(' ').length;
    const minutes = words / wordsPerMinute;
    return Math.max(minutes * 60, 1); // Minimum 1 second
  }

  // Generate mock audio URL (replace with real TTS API)
  private generateMockAudioUrl(text: string, voice: VoiceOption): string {
    // In real implementation, this would call a TTS API like:
    // - Google Cloud Text-to-Speech
    // - Amazon Polly
    // - Microsoft Azure Speech Services
    // - ElevenLabs
    // - OpenAI TTS
    
    const params = new URLSearchParams({
      text: text.substring(0, 200), // Limit text length
      voice: voice.id,
      speed: voice.speed.toString(),
      pitch: voice.pitch.toString(),
      emotion: voice.emotion || 'neutral'
    });
    
    return `https://api.mocketts.com/synthesize?${params.toString()}`;
  }

  // Get voice statistics for analytics
  getVoiceStats(): { [language: string]: { total: number; premium: number; male: number; female: number } } {
    const stats: { [language: string]: { total: number; premium: number; male: number; female: number } } = {};
    
    AI_VOICES.forEach(voice => {
      if (!stats[voice.language]) {
        stats[voice.language] = { total: 0, premium: 0, male: 0, female: 0 };
      }
      
      stats[voice.language].total++;
      if (voice.premium) stats[voice.language].premium++;
      if (voice.gender === 'male') stats[voice.language].male++;
      if (voice.gender === 'female') stats[voice.language].female++;
    });
    
    return stats;
  }

  // Clear audio cache
  clearCache(): void {
    this.audioCache.clear();
  }

  // Get cache size
  getCacheSize(): number {
    return this.audioCache.size;
  }
}

export default new AudioTranslationService();