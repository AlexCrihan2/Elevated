// Internationalization service with comprehensive language support
interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

interface TranslationKey {
  [key: string]: string | TranslationKey;
}

interface Translations {
  [languageCode: string]: TranslationKey;
}

// Comprehensive list of world languages with updated flags for diversity
export const LANGUAGES: LanguageInfo[] = [
  // Major world languages
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', flag: '🇹🇼' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇦🇪', rtl: true },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  
  // European languages
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', flag: '🇷🇸' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', flag: '🇱🇻' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', flag: '🇱🇹' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' },
  { code: 'be', name: 'Belarusian', nativeName: 'Беларуская', flag: '🇧🇾' },
  
  // Asian languages
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino', flag: '🇵🇭' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', rtl: true },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', rtl: true },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', rtl: true },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', flag: '🇱🇰' },
  { code: 'my', name: 'Myanmar', nativeName: 'မြန်မာ', flag: '🇲🇲' },
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ', flag: '🇰🇭' },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ', flag: '🇱🇦' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული', flag: '🇬🇪' },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն', flag: '🇦🇲' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', flag: '🇦🇿' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ тілі', flag: '🇰🇿' },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча', flag: '🇰🇬' },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbek tili', flag: '🇺🇿' },
  { code: 'tk', name: 'Turkmen', nativeName: 'Türkmen dili', flag: '🇹🇲' },
  { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ', flag: '🇹🇯' },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол хэл', flag: '🇲🇳' },
  
  // African languages
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', flag: '🇳🇬' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦' },
  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa', flag: '🇿🇦' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦' },
  { code: 'so', name: 'Somali', nativeName: 'Soomaali', flag: '🇸🇴' },
  
  // American languages
  { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', flag: '🇧🇷' },
  { code: 'es-MX', name: 'Spanish (Mexico)', nativeName: 'Español (México)', flag: '🇲🇽' },
  { code: 'es-AR', name: 'Spanish (Argentina)', nativeName: 'Español (Argentina)', flag: '🇦🇷' },
  { code: 'qu', name: 'Quechua', nativeName: 'Runa Simi', flag: '🇵🇪' },
  { code: 'gn', name: 'Guarani', nativeName: 'Avañe\'ẽ', flag: '🇵🇾' },
  
  // Other important languages
  { code: 'mt', name: 'Maltese', nativeName: 'Malti', flag: '🇲🇹' },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', flag: '🇮🇪' },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', flag: '🇮🇸' },
  { code: 'fo', name: 'Faroese', nativeName: 'Føroyskt', flag: '🇫🇴' },
  { code: 'eu', name: 'Basque', nativeName: 'Euskera', flag: '🇪🇸' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', flag: '🇪🇸' },
  { code: 'gl', name: 'Galician', nativeName: 'Galego', flag: '🇪🇸' },
];

// Base translations - can be extended
// Add Nordic/Scandinavian languages to translations
const translations: Translations = {
  da: {
    // Navigation
    home: 'Hjem',
    news: 'Nyheder',
    trending: 'Trending',
    market: 'Marked',
    chat: 'Chat',
    profile: 'Profil',
    
    // Common actions
    buy: 'Køb',
    sell: 'Sælg',
    donate: 'Donér',
    add_to_cart: 'Tilføj til kurv',
    purchase: 'Køb',
    checkout: 'Til betaling',
    
    // Currency
    currency: 'Valuta',
    select_currency: 'Vælg valuta',
    price: 'Pris',
    total: 'Total',
    discount: 'Rabat',
    tax: 'Skat',
    
    // Book marketplace
    books: 'Bøger',
    audiobooks: 'Lydbøger',
    ebooks: 'E-bøger',
    bestseller: 'Bestseller',
    featured: 'Fremhævet',
    author: 'Forfatter',
    rating: 'Vurdering',
    reviews: 'Anmeldelser',
    duration: 'Varighed',
    
    // Stories and social
    your_story: 'Din historie',
    create_story: 'Opret historie',
    add_story: 'Tilføj historie',
    live: 'LIVE',
    watching: 'ser',
    
    // Settings
    settings: 'Indstillinger',
    language: 'Sprog',
    select_language: 'Vælg sprog',
    preferences: 'Præferencer',
    
    // Donation
    donate_amount: 'Donationsbeløb',
    support_project: 'Støt dette projekt',
    thank_you: 'Tak',
    
    // Errors and messages
    error: 'Fejl',
    success: 'Succes',
    loading: 'Indlæser...',
    try_again: 'Prøv igen',
  },
  
  no: {
    // Navigation
    home: 'Hjem',
    news: 'Nyheter',
    trending: 'Trending',
    market: 'Marked',
    chat: 'Chat',
    profile: 'Profil',
    
    // Common actions
    buy: 'Kjøp',
    sell: 'Selg',
    donate: 'Doner',
    add_to_cart: 'Legg til i kurv',
    purchase: 'Kjøp',
    checkout: 'Til betaling',
    
    // Currency
    currency: 'Valuta',
    select_currency: 'Velg valuta',
    price: 'Pris',
    total: 'Total',
    discount: 'Rabatt',
    tax: 'Skatt',
    
    // Book marketplace
    books: 'Bøker',
    audiobooks: 'Lydbøker',
    ebooks: 'E-bøker',
    bestseller: 'Bestselger',
    featured: 'Fremhevet',
    author: 'Forfatter',
    rating: 'Vurdering',
    reviews: 'Anmeldelser',
    duration: 'Varighet',
    
    // Stories and social
    your_story: 'Din historie',
    create_story: 'Opprett historie',
    add_story: 'Legg til historie',
    live: 'LIVE',
    watching: 'ser',
    
    // Settings
    settings: 'Innstillinger',
    language: 'Språk',
    select_language: 'Velg språk',
    preferences: 'Preferanser',
    
    // Donation
    donate_amount: 'Donasjonsbeløp',
    support_project: 'Støtt dette prosjektet',
    thank_you: 'Takk',
    
    // Errors and messages
    error: 'Feil',
    success: 'Suksess',
    loading: 'Laster...',
    try_again: 'Prøv igjen',
  },
  
  sv: {
    // Navigation
    home: 'Hem',
    news: 'Nyheter',
    trending: 'Trending',
    market: 'Marknad',
    chat: 'Chatt',
    profile: 'Profil',
    
    // Common actions
    buy: 'Köp',
    sell: 'Sälj',
    donate: 'Donera',
    add_to_cart: 'Lägg till i varukorg',
    purchase: 'Köp',
    checkout: 'Till betalning',
    
    // Currency
    currency: 'Valuta',
    select_currency: 'Välj valuta',
    price: 'Pris',
    total: 'Total',
    discount: 'Rabatt',
    tax: 'Skatt',
    
    // Book marketplace
    books: 'Böcker',
    audiobooks: 'Ljudböcker',
    ebooks: 'E-böcker',
    bestseller: 'Bästsäljare',
    featured: 'Utvalda',
    author: 'Författare',
    rating: 'Betyg',
    reviews: 'Recensioner',
    duration: 'Varaktighet',
    
    // Stories and social
    your_story: 'Din berättelse',
    create_story: 'Skapa berättelse',
    add_story: 'Lägg till berättelse',
    live: 'LIVE',
    watching: 'tittar',
    
    // Settings
    settings: 'Inställningar',
    language: 'Språk',
    select_language: 'Välj språk',
    preferences: 'Inställningar',
    
    // Donation
    donate_amount: 'Donationsbelopp',
    support_project: 'Stöd detta projekt',
    thank_you: 'Tack',
    
    // Errors and messages
    error: 'Fel',
    success: 'Framgång',
    loading: 'Laddar...',
    try_again: 'Försök igen',
  },
  
  fi: {
    // Navigation
    home: 'Koti',
    news: 'Uutiset',
    trending: 'Trending',
    market: 'Markkinat',
    chat: 'Chat',
    profile: 'Profiili',
    
    // Common actions
    buy: 'Osta',
    sell: 'Myy',
    donate: 'Lahjoita',
    add_to_cart: 'Lisää koriin',
    purchase: 'Ostaa',
    checkout: 'Kassalle',
    
    // Currency
    currency: 'Valuutta',
    select_currency: 'Valitse valuutta',
    price: 'Hinta',
    total: 'Yhteensä',
    discount: 'Alennus',
    tax: 'Vero',
    
    // Book marketplace
    books: 'Kirjat',
    audiobooks: 'Äänikirjat',
    ebooks: 'E-kirjat',
    bestseller: 'Bestseller',
    featured: 'Suositellut',
    author: 'Kirjailija',
    rating: 'Arvostelu',
    reviews: 'Arvostelut',
    duration: 'Kesto',
    
    // Stories and social
    your_story: 'Sinun tarinasi',
    create_story: 'Luo tarina',
    add_story: 'Lisää tarina',
    live: 'LIVE',
    watching: 'katsoo',
    
    // Settings
    settings: 'Asetukset',
    language: 'Kieli',
    select_language: 'Valitse kieli',
    preferences: 'Mieltymykset',
    
    // Donation
    donate_amount: 'Lahjoitussumma',
    support_project: 'Tue tätä projektia',
    thank_you: 'Kiitos',
    
    // Errors and messages
    error: 'Virhe',
    success: 'Onnistui',
    loading: 'Ladataan...',
    try_again: 'Yritä uudelleen',
  },
  
  en: {
    // Navigation
    home: 'Home',
    news: 'News',
    trending: 'Trending',
    market: 'Market',
    chat: 'Chat',
    profile: 'Profile',
    
    // Common actions
    buy: 'Buy',
    sell: 'Sell',
    donate: 'Donate',
    add_to_cart: 'Add to Cart',
    purchase: 'Purchase',
    checkout: 'Checkout',
    
    // Currency
    currency: 'Currency',
    select_currency: 'Select Currency',
    price: 'Price',
    total: 'Total',
    discount: 'Discount',
    tax: 'Tax',
    
    // Book marketplace
    books: 'Books',
    audiobooks: 'Audiobooks',
    ebooks: 'E-books',
    bestseller: 'Bestseller',
    featured: 'Featured',
    author: 'Author',
    rating: 'Rating',
    reviews: 'Reviews',
    duration: 'Duration',
    
    // Stories and social
    your_story: 'Your Story',
    create_story: 'Create Story',
    add_story: 'Add Story',
    live: 'LIVE',
    watching: 'watching',
    
    // Settings
    settings: 'Settings',
    language: 'Language',
    select_language: 'Select Language',
    preferences: 'Preferences',
    
    // Donation
    donate_amount: 'Donation Amount',
    support_project: 'Support This Project',
    thank_you: 'Thank You',
    
    // Errors and messages
    error: 'Error',
    success: 'Success',
    loading: 'Loading...',
    try_again: 'Try Again',
  },
  
  es: {
    // Navigation
    home: 'Inicio',
    news: 'Noticias',
    trending: 'Tendencias',
    market: 'Mercado',
    chat: 'Chat',
    profile: 'Perfil',
    
    // Common actions
    buy: 'Comprar',
    sell: 'Vender',
    donate: 'Donar',
    add_to_cart: 'Añadir al Carrito',
    purchase: 'Compra',
    checkout: 'Pagar',
    
    // Currency
    currency: 'Moneda',
    select_currency: 'Seleccionar Moneda',
    price: 'Precio',
    total: 'Total',
    discount: 'Descuento',
    tax: 'Impuesto',
    
    // Book marketplace
    books: 'Libros',
    audiobooks: 'Audiolibros',
    ebooks: 'Libros Electrónicos',
    bestseller: 'Más Vendido',
    featured: 'Destacado',
    author: 'Autor',
    rating: 'Calificación',
    reviews: 'Reseñas',
    duration: 'Duración',
    
    // Stories and social
    your_story: 'Tu Historia',
    create_story: 'Crear Historia',
    add_story: 'Añadir Historia',
    live: 'EN VIVO',
    watching: 'viendo',
    
    // Settings
    settings: 'Configuración',
    language: 'Idioma',
    select_language: 'Seleccionar Idioma',
    preferences: 'Preferencias',
    
    // Donation
    donate_amount: 'Cantidad de Donación',
    support_project: 'Apoyar Este Proyecto',
    thank_you: 'Gracias',
    
    // Errors and messages
    error: 'Error',
    success: 'Éxito',
    loading: 'Cargando...',
    try_again: 'Intentar Nuevamente',
  },
  
  fr: {
    // Navigation
    home: 'Accueil',
    news: 'Actualités',
    trending: 'Tendances',
    market: 'Marché',
    chat: 'Chat',
    profile: 'Profil',
    
    // Common actions
    buy: 'Acheter',
    sell: 'Vendre',
    donate: 'Faire un Don',
    add_to_cart: 'Ajouter au Panier',
    purchase: 'Achat',
    checkout: 'Commande',
    
    // Currency
    currency: 'Devise',
    select_currency: 'Sélectionner la Devise',
    price: 'Prix',
    total: 'Total',
    discount: 'Remise',
    tax: 'Taxe',
    
    // Book marketplace
    books: 'Livres',
    audiobooks: 'Livres Audio',
    ebooks: 'Livres Électroniques',
    bestseller: 'Best-seller',
    featured: 'En Vedette',
    author: 'Auteur',
    rating: 'Note',
    reviews: 'Avis',
    duration: 'Durée',
    
    // Stories and social
    your_story: 'Votre Histoire',
    create_story: 'Créer une Histoire',
    add_story: 'Ajouter une Histoire',
    live: 'EN DIRECT',
    watching: 'regardent',
    
    // Settings
    settings: 'Paramètres',
    language: 'Langue',
    select_language: 'Sélectionner la Langue',
    preferences: 'Préférences',
    
    // Donation
    donate_amount: 'Montant du Don',
    support_project: 'Soutenir Ce Projet',
    thank_you: 'Merci',
    
    // Errors and messages
    error: 'Erreur',
    success: 'Succès',
    loading: 'Chargement...',
    try_again: 'Réessayer',
  },
  
  de: {
    // Navigation
    home: 'Startseite',
    news: 'Nachrichten',
    trending: 'Trending',
    market: 'Markt',
    chat: 'Chat',
    profile: 'Profil',
    
    // Common actions
    buy: 'Kaufen',
    sell: 'Verkaufen',
    donate: 'Spenden',
    add_to_cart: 'In den Warenkorb',
    purchase: 'Kauf',
    checkout: 'Zur Kasse',
    
    // Currency
    currency: 'Währung',
    select_currency: 'Währung Auswählen',
    price: 'Preis',
    total: 'Gesamt',
    discount: 'Rabatt',
    tax: 'Steuer',
    
    // Book marketplace
    books: 'Bücher',
    audiobooks: 'Hörbücher',
    ebooks: 'E-Books',
    bestseller: 'Bestseller',
    featured: 'Empfohlen',
    author: 'Autor',
    rating: 'Bewertung',
    reviews: 'Rezensionen',
    duration: 'Dauer',
    
    // Stories and social
    your_story: 'Deine Story',
    create_story: 'Story Erstellen',
    add_story: 'Story Hinzufügen',
    live: 'LIVE',
    watching: 'schauen zu',
    
    // Settings
    settings: 'Einstellungen',
    language: 'Sprache',
    select_language: 'Sprache Auswählen',
    preferences: 'Präferenzen',
    
    // Donation
    donate_amount: 'Spendenbetrag',
    support_project: 'Dieses Projekt Unterstützen',
    thank_you: 'Danke',
    
    // Errors and messages
    error: 'Fehler',
    success: 'Erfolg',
    loading: 'Wird geladen...',
    try_again: 'Erneut Versuchen',
  },
  
  zh: {
    // Navigation
    home: '首页',
    news: '新闻',
    trending: '热门',
    market: '市场',
    chat: '聊天',
    profile: '个人资料',
    
    // Common actions
    buy: '购买',
    sell: '出售',
    donate: '捐赠',
    add_to_cart: '加入购物车',
    purchase: '购买',
    checkout: '结账',
    
    // Currency
    currency: '货币',
    select_currency: '选择货币',
    price: '价格',
    total: '总计',
    discount: '折扣',
    tax: '税费',
    
    // Book marketplace
    books: '图书',
    audiobooks: '有声书',
    ebooks: '电子书',
    bestseller: '畅销书',
    featured: '推荐',
    author: '作者',
    rating: '评分',
    reviews: '评论',
    duration: '时长',
    
    // Stories and social
    your_story: '你的故事',
    create_story: '创建故事',
    add_story: '添加故事',
    live: '直播',
    watching: '正在观看',
    
    // Settings
    settings: '设置',
    language: '语言',
    select_language: '选择语言',
    preferences: '偏好设置',
    
    // Donation
    donate_amount: '捐赠金额',
    support_project: '支持此项目',
    thank_you: '谢谢',
    
    // Errors and messages
    error: '错误',
    success: '成功',
    loading: '加载中...',
    try_again: '重试',
  },
  
  hi: {
    // Navigation
    home: 'होम',
    news: 'समाचार',
    trending: 'ट्रेंडिंग',
    market: 'बाज़ार',
    chat: 'चैट',
    profile: 'प्रोफ़ाइल',
    
    // Common actions
    buy: 'खरीदें',
    sell: 'बेचें',
    donate: 'दान करें',
    add_to_cart: 'कार्ट में जोड़ें',
    purchase: 'खरीदारी',
    checkout: 'चेकआउट',
    
    // Currency
    currency: 'मुद्रा',
    select_currency: 'मुद्रा चुनें',
    price: 'मूल्य',
    total: 'कुल',
    discount: 'छूट',
    tax: 'कर',
    
    // Book marketplace
    books: 'पुस्तकें',
    audiobooks: 'ऑडियो पुस्तकें',
    ebooks: 'ई-पुस्तकें',
    bestseller: 'बेस्टसेलर',
    featured: 'फीचर्ड',
    author: 'लेखक',
    rating: 'रेटिंग',
    reviews: 'समीक्षाएं',
    duration: 'अवधि',
    
    // Stories and social
    your_story: 'आपकी कहानी',
    create_story: 'कहानी बनाएं',
    add_story: 'कहानी जोड़ें',
    live: 'लाइव',
    watching: 'देख रहे हैं',
    
    // Settings
    settings: 'सेटिंग्स',
    language: 'भाषा',
    select_language: 'भाषा चुनें',
    preferences: 'प्राथमिकताएं',
    
    // Donation
    donate_amount: 'दान राशि',
    support_project: 'इस प्रोजेक्ट का समर्थन करें',
    thank_you: 'धन्यवाद',
    
    // Errors and messages
    error: 'त्रुटि',
    success: 'सफलता',
    loading: 'लोड हो रहा है...',
    try_again: 'फिर कोशिश करें',
  },
  
  ar: {
    // Navigation
    home: 'الرئيسية',
    news: 'الأخبار',
    trending: 'الرائج',
    market: 'السوق',
    chat: 'الدردشة',
    profile: 'الملف الشخصي',
    
    // Common actions
    buy: 'شراء',
    sell: 'بيع',
    donate: 'تبرع',
    add_to_cart: 'أضف إلى السلة',
    purchase: 'شراء',
    checkout: 'الدفع',
    
    // Currency
    currency: 'العملة',
    select_currency: 'اختر العملة',
    price: 'السعر',
    total: 'المجموع',
    discount: 'خصم',
    tax: 'ضريبة',
    
    // Book marketplace
    books: 'الكتب',
    audiobooks: 'الكتب الصوتية',
    ebooks: 'الكتب الإلكترونية',
    bestseller: 'الأكثر مبيعاً',
    featured: 'مميز',
    author: 'المؤلف',
    rating: 'التقييم',
    reviews: 'المراجعات',
    duration: 'المدة',
    
    // Stories and social
    your_story: 'قصتك',
    create_story: 'إنشاء قصة',
    add_story: 'إضافة قصة',
    live: 'مباشر',
    watching: 'يشاهدون',
    
    // Settings
    settings: 'الإعدادات',
    language: 'اللغة',
    select_language: 'اختر اللغة',
    preferences: 'التفضيلات',
    
    // Donation
    donate_amount: 'مبلغ التبرع',
    support_project: 'ادعم هذا المشروع',
    thank_you: 'شكراً لك',
    
    // Errors and messages
    error: 'خطأ',
    success: 'نجح',
    loading: 'جارٍ التحميل...',
    try_again: 'حاول مرة أخرى',
  },
  
  ja: {
    // Navigation
    home: 'ホーム',
    news: 'ニュース',
    trending: 'トレンド',
    market: 'マーケット',
    chat: 'チャット',
    profile: 'プロフィール',
    
    // Common actions
    buy: '購入',
    sell: '販売',
    donate: '寄付',
    add_to_cart: 'カートに追加',
    purchase: '購入',
    checkout: 'チェックアウト',
    
    // Currency
    currency: '通貨',
    select_currency: '通貨を選択',
    price: '価格',
    total: '合計',
    discount: '割引',
    tax: '税',
    
    // Book marketplace
    books: '本',
    audiobooks: 'オーディオブック',
    ebooks: '電子書籍',
    bestseller: 'ベストセラー',
    featured: '注目',
    author: '著者',
    rating: '評価',
    reviews: 'レビュー',
    duration: '時間',
    
    // Stories and social
    your_story: 'あなたのストーリー',
    create_story: 'ストーリーを作成',
    add_story: 'ストーリーを追加',
    live: 'ライブ',
    watching: '視聴中',
    
    // Settings
    settings: '設定',
    language: '言語',
    select_language: '言語を選択',
    preferences: '設定',
    
    // Donation
    donate_amount: '寄付金額',
    support_project: 'このプロジェクトを支援',
    thank_you: 'ありがとう',
    
    // Errors and messages
    error: 'エラー',
    success: '成功',
    loading: '読み込み中...',
    try_again: 'もう一度試す',
  },
};

class LocalizationService {
  private static instance: LocalizationService;
  private currentLanguage = 'en';
  private fallbackLanguage = 'en';

  private constructor() {
    // Try to detect user's preferred language
    this.detectUserLanguage();
  }

  public static getInstance(): LocalizationService {
    if (!LocalizationService.instance) {
      LocalizationService.instance = new LocalizationService();
    }
    return LocalizationService.instance;
  }

  private detectUserLanguage() {
    try {
      // In React Native, we might use device locale
      // For now, using browser navigator if available
      if (typeof navigator !== 'undefined') {
        const browserLang = navigator.language || navigator.languages?.[0] || 'en';
        const langCode = browserLang.split('-')[0];
        
        if (this.isLanguageSupported(langCode)) {
          this.currentLanguage = langCode;
        }
      }
    } catch (error) {
      console.warn('Could not detect user language, using default');
    }
  }

  public setLanguage(languageCode: string) {
    if (this.isLanguageSupported(languageCode)) {
      this.currentLanguage = languageCode;
    }
  }

  public getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  public isLanguageSupported(languageCode: string): boolean {
    return translations.hasOwnProperty(languageCode);
  }

  public translate(key: string): string {
    const keys = key.split('.');
    let value: any = translations[this.currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && value.hasOwnProperty(k)) {
        value = value[k];
      } else {
        // Fallback to English
        value = translations[this.fallbackLanguage];
        for (const k of keys) {
          if (value && typeof value === 'object' && value.hasOwnProperty(k)) {
            value = value[k];
          } else {
            return key; // Return the key if translation not found
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  }

  public getLanguageInfo(code: string): LanguageInfo | undefined {
    return LANGUAGES.find(lang => lang.code === code);
  }

  public getAllLanguages(): LanguageInfo[] {
    return LANGUAGES;
  }

  public getPopularLanguages(): LanguageInfo[] {
    const popular = ['en', 'da', 'no', 'sv', 'fi', 'es', 'fr', 'de', 'zh', 'hi', 'ar', 'pt', 'ja', 'ko', 'ru'];
    return LANGUAGES.filter(lang => popular.includes(lang.code));
  }

  public searchLanguages(query: string): LanguageInfo[] {
    const lowerQuery = query.toLowerCase();
    return LANGUAGES.filter(lang => 
      lang.code.toLowerCase().includes(lowerQuery) ||
      lang.name.toLowerCase().includes(lowerQuery) ||
      lang.nativeName.toLowerCase().includes(lowerQuery)
    );
  }

  public isRTL(languageCode?: string): boolean {
    const code = languageCode || this.currentLanguage;
    const language = this.getLanguageInfo(code);
    return language?.rtl === true;
  }

  // Helper method to add new translations dynamically
  public addTranslations(languageCode: string, newTranslations: TranslationKey) {
    if (!translations[languageCode]) {
      translations[languageCode] = {};
    }
    translations[languageCode] = { ...translations[languageCode], ...newTranslations };
  }
}

export const localizationService = LocalizationService.getInstance();