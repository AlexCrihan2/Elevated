import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleButtonProps {
  size?: number;
  style?: any;
}

export default function ThemeToggleButton({ size = 24, style }: ThemeToggleButtonProps) {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: theme.colors.inputBackground },
        style
      ]}
      onPress={toggleTheme}
    >
      <MaterialIcons
        name={isDark ? 'light-mode' : 'dark-mode'}
        size={size}
        color={theme.colors.text}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});