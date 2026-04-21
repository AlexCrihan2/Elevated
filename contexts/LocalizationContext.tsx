import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform, I18nManager } from 'react-native';
import { localizationService, LANGUAGES } from '@/services/localizationService';
import { getUserPreferredLanguage, saveUserPreferredLanguage, getUserSettings } from '@/services/userPreferences';

interface LocalizationContextType {
  currentLanguage: string;
  isRTL: boolean;
  changeLanguage: (languageCode: string) => void;
  t: (key: string) => string;
  availableLanguages: typeof LANGUAGES;
  formatNumber: (number: number) => string;
  formatDate: (date: Date) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  getLanguageInfo: (code: string) => any;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

interface LocalizationProviderProps {
  children: ReactNode;
}

export function LocalizationProvider({ children }: LocalizationProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    // Load user's preferred language on app start
    const loadLanguage = async () => {
      try {
        const preferredLang = getUserPreferredLanguage();
        if (preferredLang && preferredLang !== currentLanguage) {
          await changeLanguage(preferredLang);
        }
      } catch (error) {
        console.error('Error loading preferred language:', error);
      }
    };

    loadLanguage();
  }, []);

  const changeLanguage = async (languageCode: string) => {
    try {
      // Validate language code
      const languageInfo = localizationService.getLanguageInfo(languageCode);
      if (!languageInfo) {
        console.warn(`Language ${languageCode} not supported, falling back to English`);
        languageCode = 'en';
      }

      // Update localization service
      localizationService.setLanguage(languageCode);
      
      // Update local state
      setCurrentLanguage(languageCode);
      
      // Update RTL setting
      const isRTLLanguage = localizationService.isRTL(languageCode);
      setIsRTL(isRTLLanguage);
      
      // Update RTL in React Native
      if (Platform.OS !== 'web') {
        if (isRTLLanguage !== I18nManager.isRTL) {
          I18nManager.allowRTL(isRTLLanguage);
          I18nManager.forceRTL(isRTLLanguage);
          // Note: In production, you might want to restart the app here
          // for RTL changes to take full effect
        }
      } else {
        // For web, update document direction
        if (typeof document !== 'undefined') {
          document.documentElement.dir = isRTLLanguage ? 'rtl' : 'ltr';
          document.documentElement.lang = languageCode;
        }
      }
      
      // Save preference
      saveUserPreferredLanguage(languageCode);
      
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const t = (key: string): string => {
    return localizationService.translate(key);
  };

  const formatNumber = (number: number): string => {
    try {
      // Use Intl.NumberFormat with current language
      return new Intl.NumberFormat(currentLanguage).format(number);
    } catch (error) {
      // Fallback to default formatting
      return number.toString();
    }
  };

  const formatDate = (date: Date): string => {
    try {
      // Use Intl.DateTimeFormat with current language
      return new Intl.DateTimeFormat(currentLanguage, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    } catch (error) {
      // Fallback to ISO string
      return date.toLocaleDateString();
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    try {
      // Use Intl.NumberFormat for currency formatting
      return new Intl.NumberFormat(currentLanguage, {
        style: 'currency',
        currency: currency,
      }).format(amount);
    } catch (error) {
      // Fallback to basic formatting
      return `${currency} ${amount.toFixed(2)}`;
    }
  };

  const getLanguageInfo = (code: string) => {
    return localizationService.getLanguageInfo(code);
  };

  const contextValue: LocalizationContextType = {
    currentLanguage,
    isRTL,
    changeLanguage,
    t,
    availableLanguages: LANGUAGES,
    formatNumber,
    formatDate,
    formatCurrency,
    getLanguageInfo,
  };

  return (
    <LocalizationContext.Provider value={contextValue}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
}

// Hook for translation only (convenience)
export function useTranslation() {
  const { t } = useLocalization();
  return { t };
}

// Hook for RTL support
export function useRTL() {
  const { isRTL } = useLocalization();
  return { isRTL };
}