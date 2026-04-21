
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { currencyService, CURRENCIES } from '@/services/currencyService';
import { localizationService } from '@/services/localizationService';

interface CurrencySelectorProps {
  visible: boolean;
  onClose: () => void;
  selectedCurrency: string;
  onSelectCurrency: (currencyCode: string) => void;
  showConverter?: boolean;
}

export default function CurrencySelector({
  visible,
  onClose,
  selectedCurrency,
  onSelectCurrency,
  showConverter = true
}: CurrencySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCurrencies, setFilteredCurrencies] = useState(CURRENCIES);
  const [showPopular, setShowPopular] = useState(true);
  const [converterAmount, setConverterAmount] = useState('100');
  const [converterFrom, setConverterFrom] = useState('USD');
  const [converterTo, setConverterTo] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [isConverting, setIsConverting] = useState(false);

  const popularCurrencies = currencyService.getPopularCurrencies();

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = currencyService.searchCurrencies(searchQuery);
      setFilteredCurrencies(filtered);
      setShowPopular(false);
    } else {
      setFilteredCurrencies(CURRENCIES);
      setShowPopular(true);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (showConverter && converterAmount) {
      handleConversion();
    }
  }, [converterAmount, converterFrom, converterTo]);

  const handleConversion = async () => {
    if (!converterAmount || isNaN(parseFloat(converterAmount))) return;
    
    setIsConverting(true);
    try {
      const amount = parseFloat(converterAmount);
      const result = await currencyService.convert(amount, converterFrom, converterTo);
      setConvertedAmount(result);
    } catch (error) {
      console.error('Conversion failed:', error);
    } finally {
      setIsConverting(false);
    }
  };

  const handleCurrencySelect = (currencyCode: string) => {
    onSelectCurrency(currencyCode);
    onClose();
  };

  const renderCurrencyItem = (currency: any, isPopular = false) => {
    const isSelected = currency.code === selectedCurrency;
    
    return (
      <TouchableOpacity
        key={currency.code}
        style={[
          styles.currencyItem,
          isSelected && styles.selectedCurrency,
          isPopular && styles.popularCurrency
        ]}
        onPress={() => handleCurrencySelect(currency.code)}
      >
        <View style={styles.currencyLeft}>
          <Text style={styles.currencyFlag}>{currency.flag}</Text>
          <View style={styles.currencyInfo}>
            <Text style={[styles.currencyCode, isSelected && styles.selectedText]}>
              {currency.code}
            </Text>
            <Text style={[styles.currencyName, isSelected && styles.selectedText]}>
              {currency.name}
            </Text>
          </View>
        </View>
        <View style={styles.currencyRight}>
          <Text style={[styles.currencySymbol, isSelected && styles.selectedText]}>
            {currency.symbol}
          </Text>
          {isSelected && (
            <MaterialIcons name="check" size={20} color="#0095F6" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {localizationService?.translate('select_currency') || 'Select Currency'}
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search currencies..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#8E8E93"
          />
        </View>

        {/* Currency Converter */}
        {showConverter && (
          <View style={styles.converterSection}>
            <Text style={styles.converterTitle}>
              {localizationService?.translate('currency') || 'Currency'} Converter
            </Text>
            
            <View style={styles.converterRow}>
              <View style={styles.converterInput}>
                <TextInput
                  style={styles.amountInput}
                  value={converterAmount}
                  onChangeText={setConverterAmount}
                  placeholder="Amount"
                  keyboardType="numeric"
                />
                <TouchableOpacity 
                  style={styles.currencyButton}
                  onPress={() => setConverterFrom(converterFrom === 'USD' ? 'EUR' : 'USD')}
                >
                  <Text style={styles.currencyButtonText}>{converterFrom}</Text>
                  <MaterialIcons name="expand-more" size={16} color="#666" />
                </TouchableOpacity>
              </View>
              
              <MaterialIcons name="swap-horiz" size={24} color="#0095F6" style={styles.swapIcon} />
              
              <View style={styles.converterInput}>
                <Text style={styles.convertedAmount}>
                  {isConverting ? '...' : convertedAmount.toFixed(2)}
                </Text>
                <TouchableOpacity 
                  style={styles.currencyButton}
                  onPress={() => setConverterTo(converterTo === 'EUR' ? 'USD' : 'EUR')}
                >
                  <Text style={styles.currencyButtonText}>{converterTo}</Text>
                  <MaterialIcons name="expand-more" size={16} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
            
            <Text style={styles.exchangeRateText}>
              1 {converterFrom} = {(convertedAmount / parseFloat(converterAmount || '1')).toFixed(4)} {converterTo}
            </Text>
          </View>
        )}

        <ScrollView style={styles.currencyList} showsVerticalScrollIndicator={false}>
          {/* Popular Currencies */}
          {showPopular && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Popular Currencies</Text>
              </View>
              {popularCurrencies.map(currency => renderCurrencyItem(currency, true))}
              
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>All Currencies</Text>
              </View>
            </>
          )}
          
          {/* Currency List */}
          {filteredCurrencies.map(currency => renderCurrencyItem(currency))}
          
          {filteredCurrencies.length === 0 && (
            <View style={styles.emptyState}>
              <MaterialIcons name="search-off" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No currencies found</Text>
              <Text style={styles.emptySubtext}>Try a different search term</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
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
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  converterSection: {
    backgroundColor: '#F8F9FA',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  converterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  converterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  converterInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  amountInput: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  convertedAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  currencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  currencyButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  swapIcon: {
    marginHorizontal: 4,
  },
  exchangeRateText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  currencyList: {
    flex: 1,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8F9FA',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedCurrency: {
    backgroundColor: '#E3F2FD',
  },
  popularCurrency: {
    borderLeftWidth: 3,
    borderLeftColor: '#0095F6',
  },
  currencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  currencyFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  currencyName: {
    fontSize: 14,
    color: '#666',
  },
  currencyRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    minWidth: 30,
    textAlign: 'right',
  },
  selectedText: {
    color: '#0095F6',
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
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
