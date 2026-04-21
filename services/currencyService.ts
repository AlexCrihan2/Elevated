
// Currency conversion service with real-time exchange rates
interface ExchangeRates {
  [key: string]: number;
}

interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  decimals: number;
}

// Comprehensive list of world currencies
export const CURRENCIES: CurrencyInfo[] = [
  // Major currencies
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', decimals: 2 },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', decimals: 2 },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', decimals: 2 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', decimals: 0 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', decimals: 2 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', decimals: 2 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', decimals: 2 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', decimals: 2 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭', decimals: 2 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷', decimals: 0 },
  
  // Asian currencies
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', decimals: 2 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰', decimals: 2 },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭', decimals: 2 },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾', decimals: 2 },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩', decimals: 0 },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭', decimals: 2 },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳', decimals: 0 },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', flag: '🇵🇰', decimals: 2 },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', flag: '🇧🇩', decimals: 2 },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: '₨', flag: '🇱🇰', decimals: 2 },
  
  // Middle Eastern currencies
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪', decimals: 2 },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦', decimals: 2 },
  { code: 'QAR', name: 'Qatari Riyal', symbol: '﷼', flag: '🇶🇦', decimals: 2 },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك', flag: '🇰🇼', decimals: 3 },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: 'ب.د', flag: '🇧🇭', decimals: 3 }, // Corrected symbol
  { code: 'OMR', name: 'Omani Rial', symbol: '﷼', flag: '🇴🇲', decimals: 3 },
  { code: 'JOD', name: 'Jordanian Dinar', symbol: 'د.ا', flag: '🇯🇴', decimals: 3 },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', flag: '🇮🇱', decimals: 2 },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷', decimals: 2 },
  { code: 'IRR', name: 'Iranian Rial', symbol: '﷼', flag: '🇮🇷', decimals: 0 },
  
  // European currencies
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴', decimals: 2 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪', decimals: 2 },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰', decimals: 2 },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱', decimals: 2 },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿', decimals: 2 },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', flag: '🇭🇺', decimals: 0 },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei', flag: '🇷🇴', decimals: 2 },
  { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв', flag: '🇧🇬', decimals: 2 },
  { code: 'HRK', name: 'Croatian Kuna', symbol: 'kn', flag: '🇭🇷', decimals: 2 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺', decimals: 2 },
  { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴', flag: '🇺🇦', decimals: 2 },
  
  // African currencies
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦', decimals: 2 },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬', decimals: 2 },
  { code: 'EGP', name: 'Egyptian Pound', symbol: '£', flag: '🇪🇬', decimals: 2 },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'د.م.', flag: '🇲🇦', decimals: 2 },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪', decimals: 2 },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', flag: '🇬🇭', decimals: 2 },
  { code: 'TND', name: 'Tunisian Dinar', symbol: 'د.ت', flag: '🇹🇳', decimals: 3 },
  { code: 'DZD', name: 'Algerian Dinar', symbol: 'د.ج', flag: '🇩🇿', decimals: 2 },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', flag: '🇺🇬', decimals: 0 },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', flag: '🇹🇿', decimals: 0 },
  
  // American currencies
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽', decimals: 2 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', decimals: 2 },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$', flag: '🇦🇷', decimals: 2 },
  { code: 'CLP', name: 'Chilean Peso', symbol: '$', flag: '🇨🇱', decimals: 0 },
  { code: 'COP', name: 'Colombian Peso', symbol: '$', flag: '🇨🇴', decimals: 0 },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', flag: '🇵🇪', decimals: 2 },
  { code: 'UYU', name: 'Uruguayan Peso', symbol: '$U', flag: '🇺🇾', decimals: 2 },
  { code: 'BOB', name: 'Bolivian Boliviano', symbol: 'Bs', flag: '🇧🇴', decimals: 2 },
  { code: 'PYG', name: 'Paraguayan Guarani', symbol: '₲', flag: '🇵🇾', decimals: 0 },
  { code: 'VES', name: 'Venezuelan Bolívar', symbol: 'Bs.S', flag: '🇻🇪', decimals: 2 },
  
  // Oceania currencies
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿', decimals: 2 },
  { code: 'FJD', name: 'Fijian Dollar', symbol: 'FJ$', flag: '🇫🇯', decimals: 2 },
  
  // Other important currencies
  { code: 'XAU', name: 'Gold Ounce', symbol: 'Au', flag: '🥇', decimals: 4 },
  { code: 'XAG', name: 'Silver Ounce', symbol: 'Ag', flag: '🥈', decimals: 4 },
  { code: 'BTC', name: 'Bitcoin', symbol: '₿', flag: '₿', decimals: 8 },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', flag: 'Ξ', decimals: 6 },
];

class CurrencyService {
  private static instance: CurrencyService;
  private exchangeRates: ExchangeRates = {};
  private baseCurrency = 'USD';
  private lastUpdate = 0;
  private updateInterval = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    this.initializeRates();
  }

  public static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService();
    }
    return CurrencyService.instance;
  }

  private async initializeRates() {
    // Initialize with mock rates for immediate functionality
    this.exchangeRates = {
      'USD': 1.00,
      'EUR': 0.85,
      'GBP': 0.73,
      'JPY': 110.0,
      'CNY': 6.45,
      'INR': 74.5,
      'AUD': 1.35,
      'CAD': 1.25,
      'CHF': 0.92,
      'KRW': 1180.0,
      'SGD': 1.35,
      'HKD': 7.8,
      'THB': 33.0,
      'MYR': 4.2,
      'IDR': 14300.0,
      'PHP': 50.5,
      'VND': 23000.0,
      'PKR': 160.0,
      'BDT': 85.0,
      'LKR': 200.0,
      'AED': 3.67,
      'SAR': 3.75,
      'QAR': 3.64,
      'KWD': 0.30,
      'BHD': 0.377,
      'OMR': 0.385,
      'JOD': 0.71,
      'ILS': 3.2,
      'TRY': 8.5,
      'IRR': 42000.0,
      'NOK': 8.5,
      'SEK': 8.8,
      'DKK': 6.3,
      'PLN': 3.9,
      'CZK': 22.0,
      'HUF': 300.0,
      'RON': 4.2,
      'BGN': 1.66,
      'HRK': 6.4,
      'RUB': 75.0,
      'UAH': 27.0,
      'ZAR': 14.5,
      'NGN': 410.0,
      'EGP': 15.7,
      'MAD': 9.0,
      'KES': 110.0,
      'GHS': 6.1,
      'TND': 2.8,
      'DZD': 135.0,
      'UGX': 3600.0,
      'TZS': 2300.0,
      'MXN': 20.0,
      'BRL': 5.2,
      'ARS': 98.0,
      'CLP': 800.0,
      'COP': 3800.0,
      'PEN': 3.9,
      'UYU': 44.0,
      'BOB': 6.9,
      'PYG': 6900.0,
      'VES': 4200000.0,
      'NZD': 1.42,
      'FJD': 2.1,
      'XAU': 0.0005, // 1/2000 (approx $2000/oz)
      'XAG': 0.04,   // 1/25 (approx $25/oz)
      'BTC': 0.000025, // 1/40000 (approx $40k)
      'ETH': 0.0004,   // 1/2500 (approx $2.5k)
    };
    
    this.lastUpdate = Date.now();
    
    // Try to fetch real rates
    try {
      await this.fetchExchangeRates();
    } catch (error) {
      console.log('Using mock exchange rates - real API not available');
    }
  }

  private async fetchExchangeRates() {
    try {
      // Using a free API service (you might want to use a paid service for production)
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${this.baseCurrency}`);
      const data = await response.json();
      
      if (data.rates) {
        this.exchangeRates = { ...this.exchangeRates, ...data.rates };
        this.lastUpdate = Date.now();
      }
    } catch (error) {
      console.warn('Failed to fetch real exchange rates, using cached/mock rates');
    }
  }

  public async convert(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    // Update rates if they're stale
    if (Date.now() - this.lastUpdate > this.updateInterval) {
      await this.fetchExchangeRates();
    }

    const fromRate = this.exchangeRates[fromCurrency] || 1;
    const toRate = this.exchangeRates[toCurrency] || 1;
    
    // Convert from source currency to USD, then to target currency
    const usdAmount = amount / fromRate;
    const convertedAmount = usdAmount * toRate;
    
    return Math.round(convertedAmount * 100) / 100; // Round to 2 decimals
  }

  public formatPrice(amount: number, currencyCode: string): string {
    const currency = CURRENCIES.find(c => c.code === currencyCode);
    if (!currency) return `${amount} ${currencyCode}`;

    const formattedAmount = amount.toLocaleString(undefined, {
      minimumFractionDigits: currency.decimals,
      maximumFractionDigits: currency.decimals
    });

    return `${currency.symbol}${formattedAmount}`;
  }

  public getCurrencyInfo(code: string): CurrencyInfo | undefined {
    return CURRENCIES.find(c => c.code === code);
  }

  public getAllCurrencies(): CurrencyInfo[] {
    return CURRENCIES;
  }

  public getPopularCurrencies(): CurrencyInfo[] {
    const popular = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'INR', 'AUD', 'CAD', 'CHF', 'KRW'];
    return CURRENCIES.filter(c => popular.includes(c.code));
  }

  public searchCurrencies(query: string): CurrencyInfo[] {
    const lowerQuery = query.toLowerCase();
    return CURRENCIES.filter(c => 
      c.code.toLowerCase().includes(lowerQuery) ||
      c.name.toLowerCase().includes(lowerQuery)
    );
  }
}

export const currencyService = CurrencyService.getInstance();
