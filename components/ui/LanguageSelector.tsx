
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalization } from '@/contexts/LocalizationContext';
import { LANGUAGES } from '@/services/localizationService';
import { useTheme } from '@/contexts/ThemeContext';

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

export default function LanguageSelector({
  visible,
  onClose
}: LanguageSelectorProps) {
  const { currentLanguage, changeLanguage, getLanguageInfo, t } = useLocalization();
  const { theme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLanguages, setFilteredLanguages] = useState(LANGUAGES);
  const [showPopular, setShowPopular] = useState(true);

  const popularLanguages = [
    'en', 'es', 'fr', 'de', 'zh', 'ja', 'ko', 'hi', 'ar', 'pt', 'ru'
  ].map(code => LANGUAGES.find(lang => lang.code === code)).filter(Boolean);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = LANGUAGES.filter(lang =>
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLanguages(filtered);
      setShowPopular(false);
    } else {
      setFilteredLanguages(LANGUAGES);
      setShowPopular(true);
    }
  }, [searchQuery]);

  const handleLanguageSelect = async (languageCode: string) => {
    await changeLanguage(languageCode);
    onClose();
  };

  const renderLanguageItem = (language: any, isPopular = false) => {
    const isSelected = language.code === currentLanguage;
    
    return (
      <TouchableOpacity
        key={language.code}
        style={[
          styles.languageItem,
          { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border },
          isSelected && { backgroundColor: theme.colors.primary + '20', borderColor: theme.colors.primary },
          isPopular && { borderLeftWidth: 3, borderLeftColor: '#FF9500' }
        ]}
        onPress={() => handleLanguageSelect(language.code)}
      >
        <View style={styles.languageLeft}>
          <Text style={styles.languageFlag}>{language.flag}</Text>
          <View style={styles.languageInfo}>
            <Text style={[styles.languageName, { color: isSelected ? theme.colors.primary : theme.colors.text }]}>
              {language.name}
            </Text>
            <Text style={[styles.languageNative, { color: isSelected ? theme.colors.primary : theme.colors.textSecondary }]}>
              {language.nativeName}
            </Text>
          </View>
        </View>
        <View style={styles.languageRight}>
          <Text style={[styles.languageCode, { color: isSelected ? theme.colors.primary : theme.colors.textSecondary }]}>
            {language.code.toUpperCase()}
          </Text>
          {isSelected && (
            <MaterialIcons name="check-circle" size={20} color={theme.colors.primary} />
          )}
          {language.rtl && (
            <View style={styles.rtlBadge}>
              <Text style={styles.rtlText}>RTL</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.headerBackground, borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            {t('select_language')}
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Search */}
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.inputBackground }]}>
          <MaterialIcons name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search languages..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>

        {/* Language Stats */}
        <View style={[styles.statsContainer, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{LANGUAGES.length}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Languages</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{LANGUAGES.filter(l => l.rtl).length}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>RTL</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{popularLanguages.length}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Popular</Text>
          </View>
        </View>

        <ScrollView style={styles.languageList} showsVerticalScrollIndicator={false}>
          {/* Popular Languages */}
          {showPopular && (
            <>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="star" size={16} color="#FF9500" />
                <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Popular Languages</Text>
              </View>
              {popularLanguages.map(language => renderLanguageItem(language, true))}
              
              <View style={styles.sectionHeader}>
                <MaterialIcons name="public" size={16} color={theme.colors.textSecondary} />
                <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>All Languages</Text>
              </View>
            </>
          )}
          
          {/* Language List */}
          {filteredLanguages.map(language => renderLanguageItem(language))}
          
          {filteredLanguages.length === 0 && (
            <View style={styles.emptyState}>
              <MaterialIcons name="translate" size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyText, { color: theme.colors.text }]}>No languages found</Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>Try a different search term</Text>
            </View>
          )}
          
          {/* Footer Info */}
          <View style={styles.footerInfo}>
            <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
              <MaterialIcons name="info" size={20} color={theme.colors.primary} />
              <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                Language changes apply immediately. Interface elements will update to the selected language.
              </Text>
            </View>
            
            <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
              <MaterialIcons name="format-textdirection-r-to-l" size={20} color="#FF9500" />
              <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                RTL (Right-to-Left) languages automatically adjust the app layout direction.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

// Quick language selector button component
interface LanguageSelectorButtonProps {
  onPress: () => void;
}

export function LanguageSelectorButton({ onPress }: LanguageSelectorButtonProps) {
  const { currentLanguage, getLanguageInfo } = useLocalization();
  const { theme } = useTheme();
  
  const currentLangInfo = getLanguageInfo(currentLanguage);
  
  return (
    <TouchableOpacity 
      style={[styles.languageButton, { backgroundColor: theme.colors.inputBackground, borderColor: theme.colors.border }]}
      onPress={onPress}
    >
      <Text style={styles.languageButtonFlag}>{currentLangInfo?.flag || '🌐'}</Text>
      <Text style={[styles.languageButtonCode, { color: theme.colors.text }]}>{currentLanguage.toUpperCase()}</Text>
      <MaterialIcons name="arrow-drop-down" size={16} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 32,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    marginHorizontal: 16,
  },
  languageList: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
  },
  languageNative: {
    fontSize: 14,
  },
  languageRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageCode: {
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 30,
    textAlign: 'center',
  },
  rtlBadge: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rtlText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  footerInfo: {
    padding: 16,
    gap: 12,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  },
  // Language selector button styles
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
    minWidth: 70,
  },
  languageButtonFlag: {
    fontSize: 16,
  },
  languageButtonCode: {
    fontSize: 12,
    fontWeight: '600',
  },
});
