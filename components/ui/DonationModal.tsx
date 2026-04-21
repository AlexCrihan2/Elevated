
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { currencyService } from '@/services/currencyService';
import { localizationService } from '@/services/localizationService';
import CurrencySelector from '@/components/ui/CurrencySelector';

interface DonationModalProps {
  visible: boolean;
  onClose: () => void;
  projectTitle?: string;
  creatorName?: string;
  onDonationComplete?: (amount: number, currency: string) => void;
}

const PRESET_AMOUNTS = {
  USD: [5, 10, 25, 50, 100],
  EUR: [5, 10, 20, 40, 80],
  GBP: [5, 10, 20, 40, 80],
  JPY: [500, 1000, 2500, 5000, 10000],
  CNY: [30, 60, 150, 300, 600],
  INR: [100, 300, 750, 1500, 3000],
  BRL: [25, 50, 125, 250, 500],
};

export default function DonationModal({
  visible,
  onClose,
  projectTitle = 'This Project',
  creatorName = 'Creator',
  onDonationComplete
}: DonationModalProps) {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPresetAmount, setSelectedPresetAmount] = useState<number | null>(null);
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [convertedAmounts, setConvertedAmounts] = useState<{[key: string]: number}>({});
  const [totalInUSD, setTotalInUSD] = useState(0);

  const currencyInfo = currencyService.getCurrencyInfo(selectedCurrency);
  const presetAmounts = PRESET_AMOUNTS[selectedCurrency as keyof typeof PRESET_AMOUNTS] || PRESET_AMOUNTS.USD;

  const currentAmount = selectedPresetAmount || parseFloat(customAmount) || 0;

  useEffect(() => {
    if (currentAmount > 0) {
      updateConversions();
    }
  }, [currentAmount, selectedCurrency]);

  const updateConversions = async () => {
    if (currentAmount <= 0) return;

    try {
      // Convert to USD for reference
      const usdAmount = await currencyService.convert(currentAmount, selectedCurrency, 'USD');
      setTotalInUSD(usdAmount);

      // Convert to major currencies for display
      const conversions: {[key: string]: number} = {};
      const majorCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'INR'];
      
      for (const currency of majorCurrencies) {
        if (currency !== selectedCurrency) {
          const converted = await currencyService.convert(currentAmount, selectedCurrency, currency);
          conversions[currency] = converted;
        }
      }
      
      setConvertedAmounts(conversions);
    } catch (error) {
      console.error('Failed to convert amounts:', error);
    }
  };

  const handlePresetAmountSelect = (amount: number) => {
    setSelectedPresetAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (text: string) => {
    setCustomAmount(text);
    setSelectedPresetAmount(null);
  };

  const handleDonate = async () => {
    if (currentAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please select or enter a valid donation amount.');
      return;
    }

    setProcessingPayment(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would integrate with payment processors like:
      // - Stripe
      // - PayPal
      // - Razorpay (for India)
      // - Alipay (for China)
      // - etc.
      
      onDonationComplete?.(currentAmount, selectedCurrency);
      
      Alert.alert(
        localizationService?.translate('thank_you') || 'Thank You',
        `Your donation of ${currencyService.formatPrice(currentAmount, selectedCurrency)} has been processed successfully!`,
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      Alert.alert(
        localizationService?.translate('error') || 'Error',
        'Payment processing failed. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setProcessingPayment(false);
    }
  };

  const renderPresetAmount = (amount: number) => {
    const isSelected = selectedPresetAmount === amount;
    return (
      <TouchableOpacity
        key={amount}
        style={[styles.presetAmountButton, isSelected && styles.selectedPresetAmount]}
        onPress={() => handlePresetAmountSelect(amount)}
      >
        <Text style={[styles.presetAmountText, isSelected && styles.selectedPresetAmountText]}>
          {currencyService.formatPrice(amount, selectedCurrency)}
        </Text>
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
            {localizationService?.translate('support_project') || 'Support This Project'}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Project Info */}
          <View style={styles.projectInfo}>
            <View style={styles.projectIcon}>
              <MaterialIcons name="favorite" size={32} color="#FF6B6B" />
            </View>
            <Text style={styles.projectTitle}>Support "{projectTitle}"</Text>
            <Text style={styles.projectSubtitle}>by {creatorName}</Text>
            <Text style={styles.projectDescription}>
              Your donation helps support the development and maintenance of this project. Every contribution makes a difference!
            </Text>
          </View>

          {/* Currency Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {localizationService?.translate('currency') || 'Currency'}
            </Text>
            <TouchableOpacity 
              style={styles.currencySelector}
              onPress={() => setShowCurrencySelector(true)}
            >
              <View style={styles.currencyInfo}>
                <Text style={styles.currencyFlag}>{currencyInfo?.flag}</Text>
                <View>
                  <Text style={styles.currencyCode}>{selectedCurrency}</Text>
                  <Text style={styles.currencyName}>{currencyInfo?.name}</Text>
                </View>
              </View>
              <MaterialIcons name="expand-more" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Preset Amounts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Select</Text>
            <View style={styles.presetAmounts}>
              {presetAmounts.map(amount => renderPresetAmount(amount))}
            </View>
          </View>

          {/* Custom Amount */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Custom Amount</Text>
            <View style={styles.customAmountContainer}>
              <Text style={styles.currencySymbol}>{currencyInfo?.symbol}</Text>
              <TextInput
                style={styles.customAmountInput}
                value={customAmount}
                onChangeText={handleCustomAmountChange}
                placeholder="Enter amount"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Amount Summary */}
          {currentAmount > 0 && (
            <View style={styles.amountSummary}>
              <Text style={styles.summaryTitle}>Donation Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Amount:</Text>
                <Text style={styles.summaryAmount}>
                  {currencyService.formatPrice(currentAmount, selectedCurrency)}
                </Text>
              </View>
              
              {totalInUSD > 0 && selectedCurrency !== 'USD' && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Equivalent in USD:</Text>
                  <Text style={styles.summaryEquivalent}>
                    {currencyService.formatPrice(totalInUSD, 'USD')}
                  </Text>
                </View>
              )}

              {/* Currency Conversions */}
              {Object.keys(convertedAmounts).length > 0 && (
                <View style={styles.conversions}>
                  <Text style={styles.conversionsTitle}>Other Currencies:</Text>
                  {Object.entries(convertedAmounts).map(([currency, amount]) => (
                    <Text key={currency} style={styles.conversionText}>
                      {currency}: {currencyService.formatPrice(amount, currency)}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Impact Information */}
          <View style={styles.impactSection}>
            <Text style={styles.impactTitle}>🌟 Your Impact</Text>
            <View style={styles.impactItems}>
              <View style={styles.impactItem}>
                <MaterialIcons name="code" size={20} color="#0095F6" />
                <Text style={styles.impactText}>Supports active development</Text>
              </View>
              <View style={styles.impactItem}>
                <MaterialIcons name="bug-report" size={20} color="#0095F6" />
                <Text style={styles.impactText}>Helps fix bugs and issues</Text>
              </View>
              <View style={styles.impactItem}>
                <MaterialIcons name="new-releases" size={20} color="#0095F6" />
                <Text style={styles.impactText}>Enables new features</Text>
              </View>
              <View style={styles.impactItem}>
                <MaterialIcons name="security" size={20} color="#0095F6" />
                <Text style={styles.impactText}>Maintains security updates</Text>
              </View>
            </View>
          </View>

          {/* Payment Methods Info */}
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>Secure Payment</Text>
            <View style={styles.paymentMethods}>
              <View style={styles.paymentMethod}>
                <MaterialIcons name="credit-card" size={24} color="#666" />
                <Text style={styles.paymentMethodText}>Credit/Debit Cards</Text>
              </View>
              <View style={styles.paymentMethod}>
                <MaterialIcons name="account-balance-wallet" size={24} color="#666" />
                <Text style={styles.paymentMethodText}>Digital Wallets</Text>
              </View>
              <View style={styles.paymentMethod}>
                <MaterialIcons name="account-balance" size={24} color="#666" />
                <Text style={styles.paymentMethodText}>Bank Transfer</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Donate Button */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={[
              styles.donateButton,
              (currentAmount <= 0 || processingPayment) && styles.donateButtonDisabled
            ]}
            onPress={handleDonate}
            disabled={currentAmount <= 0 || processingPayment}
          >
            {processingPayment ? (
              <View style={styles.loadingContainer}>
                <MaterialIcons name="hourglass-empty" size={20} color="white" />
                <Text style={styles.donateButtonText}>Processing...</Text>
              </View>
            ) : (
              <View style={styles.donateContent}>
                <MaterialIcons name="favorite" size={20} color="white" />
                <Text style={styles.donateButtonText}>
                  Donate {currentAmount > 0 ? currencyService.formatPrice(currentAmount, selectedCurrency) : ''}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          
          <Text style={styles.securityNote}>
            🔒 Secure payment processing • No fees for donations
          </Text>
        </View>

        {/* Currency Selector Modal */}
        <CurrencySelector
          visible={showCurrencySelector}
          onClose={() => setShowCurrencySelector(false)}
          selectedCurrency={selectedCurrency}
          onSelectCurrency={setSelectedCurrency}
          showConverter={true}
        />
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
  content: {
    flex: 1,
    padding: 16,
  },
  projectInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  projectIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 4,
  },
  projectSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  projectDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  currencyFlag: {
    fontSize: 24,
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
  presetAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  presetAmountButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    minWidth: 80,
    alignItems: 'center',
  },
  selectedPresetAmount: {
    backgroundColor: '#0095F6',
    borderColor: '#0095F6',
  },
  presetAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  selectedPresetAmountText: {
    color: '#FFFFFF',
  },
  customAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginRight: 8,
  },
  customAmountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    paddingVertical: 16,
  },
  amountSummary: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0095F6',
  },
  summaryEquivalent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  conversions: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
  },
  conversionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  conversionText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  impactSection: {
    backgroundColor: '#F0F7FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  impactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  impactItems: {
    gap: 8,
  },
  impactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  impactText: {
    fontSize: 14,
    color: '#666',
  },
  paymentInfo: {
    marginBottom: 24,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  paymentMethod: {
    alignItems: 'center',
    gap: 4,
  },
  paymentMethodText: {
    fontSize: 12,
    color: '#666',
  },
  bottomSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
  },
  donateButton: {
    backgroundColor: '#0095F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  donateButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  donateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  donateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  securityNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
