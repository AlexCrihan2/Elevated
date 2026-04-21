import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

/**
 * A platform-agnostic storage service that uses AsyncStorage for mobile
 * and localStorage for web.
 */
const StorageService = {
  /**
   * Saves a value to storage
   * @param key The key to store the value under
   * @param value The value to store (will be JSON stringified)
   */
  async setItem(key: string, value: any): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      if (Platform.OS === 'web') {
        localStorage.setItem(key, stringValue);
      } else {
        await AsyncStorage.setItem(key, stringValue);
      }
    } catch (error) {
      console.error(`Error saving to storage (${key}):`, error);
    }
  },

  /**
   * Retrieves a value from storage
   * @param key The key to retrieve
   * @param defaultValue Optional default value if the key doesn't exist
   */
  async getItem<T>(key: string, defaultValue: T | null = null): Promise<T | null> {
    try {
      let value: string | null = null;
      if (Platform.OS === 'web') {
        value = localStorage.getItem(key);
      } else {
        value = await AsyncStorage.getItem(key);
      }

      if (value === null) {
        return defaultValue;
      }

      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error reading from storage (${key}):`, error);
      return defaultValue;
    }
  },

  /**
   * Removes an item from storage
   * @param key The key to remove
   */
  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing from storage (${key}):`, error);
    }
  },

  /**
   * Clears all items from storage
   */
  async clear(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.clear();
      } else {
        await AsyncStorage.clear();
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
};

export default StorageService;
