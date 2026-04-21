import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'home', title: 'Home', icon: 'home' },
  { id: 'search', title: 'Search', icon: 'search' },
  { id: 'trending', title: 'Trends', icon: 'trending-up' },
  { id: 'marketplace', title: 'Market', icon: 'store' },
  { id: 'news', title: 'News', icon: 'article' },
  { id: 'notifications', title: 'Alerts', icon: 'notifications' },
  { id: 'profile', title: 'Profile', icon: 'person' }
];

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 8 }]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tab,
            activeTab === tab.id && styles.activeTab
          ]}
          onPress={() => onTabChange(tab.id)}
        >
          <View style={[
            styles.iconContainer,
            activeTab === tab.id && styles.activeIconContainer
          ]}>
            <MaterialIcons 
              name={tab.icon as any} 
              size={20} 
              color={activeTab === tab.id ? '#3182CE' : '#718096'} 
            />
          </View>
          <Text style={[
            styles.tabText,
            { color: activeTab === tab.id ? '#3182CE' : '#718096' }
          ]}>
            {tab.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  activeTab: {
    transform: [{ scale: 1.05 }],
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  activeIconContainer: {
    backgroundColor: '#EBF8FF',
  },
  tabText: {
    fontSize: 10,
    fontWeight: '500',
  },
});