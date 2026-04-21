import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
  selectedLanguage: Language;
  onSelectLanguage: (language: Language) => void;
  languages: Language[];
}

export default function LanguageSelector({ 
  visible, 
  onClose, 
  selectedLanguage, 
  onSelectLanguage, 
  languages 
}: LanguageSelectorProps) {
  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Caption Language</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#2D3748" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.languageList}>
            {languages.map((language) => (
              <TouchableOpacity
                key={language.code}
                onPress={() => {
                  onSelectLanguage(language);
                  onClose();
                }}
                style={[
                  styles.languageOption,
                  selectedLanguage.code === language.code && styles.selectedOption
                ]}
              >
                <Text style={styles.flag}>{language.flag}</Text>
                <Text style={styles.languageName}>{language.name}</Text>
                {selectedLanguage.code === language.code && (
                  <MaterialIcons name="check" size={20} color="#3182CE" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    color: '#2D3748',
    fontSize: 18,
    fontWeight: '600',
  },
  languageList: {
    flex: 1,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F7FAFC',
  },
  selectedOption: {
    backgroundColor: '#EBF8FF',
  },
  flag: {
    fontSize: 24,
    marginRight: 16,
  },
  languageName: {
    color: '#2D3748',
    fontSize: 16,
    flex: 1,
  },
});