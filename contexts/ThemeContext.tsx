import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';

interface ThemeColors {
  primary: string;
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  notification: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  accent: string;
  shadow: string;
  overlay: string;
  inputBackground: string;
  placeholder: string;
  tabBar: string;
  headerBackground: string;
  headerText: string;
  buttonPrimary: string;
  buttonSecondary: string;
  buttonText: string;
  linkText: string;
  iconActive: string;
  iconInactive: string;
}

interface Theme {
  colors: ThemeColors;
  dark: boolean;
}

const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#1877F2',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    notification: '#EF4444',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
    accent: '#8B5CF6',
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.5)',
    inputBackground: '#F3F4F6',
    placeholder: '#9CA3AF',
    tabBar: '#FFFFFF',
    headerBackground: '#FFFFFF',
    headerText: '#1F2937',
    buttonPrimary: '#1877F2',
    buttonSecondary: '#F3F4F6',
    buttonText: '#FFFFFF',
    linkText: '#3B82F6',
    iconActive: '#1877F2',
    iconInactive: '#6B7280',
  },
};

const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#60A5FA',
    background: '#000000',
    surface: '#1F2937',
    card: '#374151',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    border: '#4B5563',
    notification: '#F87171',
    error: '#F87171',
    success: '#34D399',
    warning: '#FBBF24',
    info: '#60A5FA',
    accent: '#A78BFA',
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.8)',
    inputBackground: '#4B5563',
    placeholder: '#9CA3AF',
    tabBar: '#1F2937',
    headerBackground: '#1F2937',
    headerText: '#F9FAFB',
    buttonPrimary: '#60A5FA',
    buttonSecondary: '#4B5563',
    buttonText: '#F9FAFB',
    linkText: '#60A5FA',
    iconActive: '#60A5FA',
    iconInactive: '#9CA3AF',
  },
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setDarkMode: (dark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(false);

  // Load theme preference from storage
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Save theme preference when it changes
  useEffect(() => {
    saveThemePreference(isDark);
  }, [isDark]);

  const loadThemePreference = () => {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('app_theme');
        if (saved !== null) {
          setIsDark(JSON.parse(saved));
        } else {
          // Default to system preference if available
          if (Platform.OS === 'web' && window.matchMedia) {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDark(systemPrefersDark);
          }
        }
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const saveThemePreference = (dark: boolean) => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('app_theme', JSON.stringify(dark));
      }
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const setDarkMode = (dark: boolean) => {
    setIsDark(dark);
  };

  const theme = isDark ? darkTheme : lightTheme;

  const contextValue: ThemeContextType = {
    theme,
    isDark,
    toggleTheme,
    setDarkMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Helper function to create themed styles
export function createThemedStyles<T>(styleFunction: (theme: Theme) => T) {
  return (theme: Theme): T => styleFunction(theme);
}

// Helper hook for themed StyleSheet
export function useThemedStyles<T>(styleFunction: (theme: Theme) => T): T {
  const { theme } = useTheme();
  return styleFunction(theme);
}