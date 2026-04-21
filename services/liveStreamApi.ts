export interface LiveStreamData {
  id: string;
  title: string;
  viewerCount: number;
  isActive: boolean;
  subtitles: LiveSubtitle[];
  language: string;
}

export interface LiveSubtitle {
  id: string;
  timestamp: number;
  text: string;
  language: string;
  confidence: number;
}

export interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

export const liveStreamApi = {
  // Available languages for AI translation
  supportedLanguages: [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' }
  ],

  // Start live stream with AI features
  async startLiveStream(title: string, language: string = 'en'): Promise<LiveStreamData> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: Date.now().toString(),
      title,
      viewerCount: Math.floor(Math.random() * 1000) + 50,
      isActive: true,
      subtitles: [],
      language
    };
  },

  // AI speech-to-text transcription
  async transcribeSpeech(audioData: string, targetLanguage: string = 'en'): Promise<LiveSubtitle> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const sampleTexts = {
      en: "Welcome to my live stream! Today we're building something amazing.",
      es: "¡Bienvenidos a mi transmisión en vivo! Hoy estamos construyendo algo increíble.",
      fr: "Bienvenue sur mon live ! Aujourd'hui nous construisons quelque chose d'incroyable.",
      de: "Willkommen zu meinem Livestream! Heute bauen wir etwas Fantastisches.",
      it: "Benvenuti al mio live stream! Oggi stiamo costruendo qualcosa di fantastico.",
      pt: "Bem-vindos à minha transmissão ao vivo! Hoje estamos construindo algo incrível.",
      ja: "私のライブストリームへようこそ！今日は素晴らしいものを作っています。",
      ko: "제 라이브 스트림에 오신 것을 환영합니다! 오늘 우리는 놀라운 것을 만들고 있습니다.",
      zh: "欢迎来到我的直播！今天我们正在构建一些令人惊叹的东西。",
      ar: "مرحبا بكم في البث المباشر! اليوم نحن نبني شيئا مذهلا."
    };
    
    return {
      id: Date.now().toString(),
      timestamp: Date.now(),
      text: sampleTexts[targetLanguage as keyof typeof sampleTexts] || sampleTexts.en,
      language: targetLanguage,
      confidence: 0.92
    };
  },

  // Real-time subtitle translation
  async translateSubtitle(text: string, fromLanguage: string, toLanguage: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simulate AI translation
    if (fromLanguage === toLanguage) return text;
    
    const translations: Record<string, Record<string, string>> = {
      en: {
        es: "Texto traducido al español",
        fr: "Texte traduit en français",
        de: "Ins Deutsche übersetzter Text"
      }
    };
    
    return translations[fromLanguage]?.[toLanguage] || text;
  },

  // Get live viewer updates
  async getLiveViewers(streamId: string): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return Math.floor(Math.random() * 5000) + 1000;
  }
};