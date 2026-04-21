
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TranslationWidget from '@/components/ui/TranslationWidget';
import { currencyService } from '@/services/currencyService';
import { localizationService } from '@/services/localizationService';
import CurrencySelector from '@/components/ui/CurrencySelector';
import LanguageSelector from '@/components/ui/LanguageSelector';
import DonationModal from '@/components/ui/DonationModal';
import BookDetailsModal from '@/components/books/BookDetailsModal';
import { useTheme } from '@/contexts/ThemeContext';

export default function MarketplaceScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFilter, setSelectedFilter] = useState('featured');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showBookDetails, setShowBookDetails] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [convertedPrices, setConvertedPrices] = useState<{[key: string]: {[key: string]: number | null}}>({}); // Modified: originalPrice can be null
  
  // Sample books data with USD prices
  const books = [
    {
      id: 'book-1',
      title: 'The Art of Mindfulness',
      author: 'Dr. Sarah Chen',
      category: 'Self-Help',
      price: '$12.99',
      originalPrice: '$18.99',
      rating: 4.8,
      reviews: 1247,
      cover: '🧘‍♀️',
      type: 'ebook',
      bestseller: true,
      featured: true
    },
    {
      id: 'book-2',
      title: 'Modern JavaScript Complete Guide',
      author: 'Alex Thompson',
      category: 'Technology',
      price: '$24.99',
      originalPrice: '$34.99',
      rating: 4.9,
      reviews: 2183,
      cover: '💻',
      type: 'ebook',
      bestseller: false,
      featured: true
    },
    {
      id: 'book-3',
      title: 'The Psychology of Success',
      author: 'Maria Rodriguez',
      category: 'Business',
      price: '$19.99',
      originalPrice: '$29.99',
      rating: 4.7,
      reviews: 892,
      cover: '🎧',
      type: 'audiobook',
      bestseller: true,
      featured: false,
      duration: '8h 24m'
    },
    {
      id: 'book-4',
      title: 'Climate Change Solutions',
      author: 'Dr. James Wilson',
      category: 'Science',
      price: '$15.99',
      originalPrice: null, // Corrected: value is null, not a string 'null'
      rating: 4.6,
      reviews: 567,
      cover: '🌍',
      type: 'ebook',
      bestseller: false,
      featured: true
    },
    {
      id: 'book-5',
      title: 'Creative Writing Mastery',
      author: 'Emma Davis',
      category: 'Art',
      price: '$21.99',
      originalPrice: '$31.99',
      rating: 4.5,
      reviews: 334,
      cover: '✍️',
      type: 'ebook',
      bestseller: false,
      featured: false
    }
  ];
  
  // Initialize services
  useEffect(() => {
    if (localizationService) {
      setSelectedLanguage(localizationService?.getCurrentLanguage() || 'en');
    }
    convertAllPrices();
  }, [selectedCurrency]);
  
  const convertAllPrices = async () => {
    if (selectedCurrency === 'USD') {
      setConvertedPrices({});
      return;
    }
    
    const conversions: {[key: string]: {[key: string]: number | null}} = {}; // Modified: originalPrice can be null
    
    for (const book of books) {
      // Ensure book.price and book.originalPrice are treated as strings before replace
      const originalPrice = parseFloat(String(book.price).replace(/[^0-9.]/g, ''));
      const originalOriginalPrice = book.originalPrice ? parseFloat(String(book.originalPrice).replace(/[^0-9.]/g, '')) : null; // Added String() cast
      
      try {
        const convertedPrice = await currencyService.convert(originalPrice, 'USD', selectedCurrency);
        const convertedOriginalPrice = originalOriginalPrice 
          ? await currencyService.convert(originalOriginalPrice, 'USD', selectedCurrency)
          : null;
        
        conversions[book.id] = {
          price: convertedPrice,
          originalPrice: convertedOriginalPrice
        };
      } catch (error) {
        console.error(`Failed to convert price for ${book.id}:`, error);
      }
    }
    
    setConvertedPrices(conversions);
  };

  const formatPrice = (book: any) => {
    if (selectedCurrency === 'USD') {
      return {
        price: book.price,
        originalPrice: book.originalPrice
      };
    }
    
    const converted = convertedPrices[book.id];
    if (!converted) {
      return {
        price: book.price,
        originalPrice: book.originalPrice
      };
    }
    
    return {
      price: currencyService.formatPrice(converted.price as number, selectedCurrency), // Added type assertion
      originalPrice: converted.originalPrice 
        ? currencyService.formatPrice(converted.originalPrice as number, selectedCurrency) // Added type assertion
        : null
    };
  };

  const categories = ['All', 'Fiction', 'Non-Fiction', 'Science', 'Technology', 'Business', 'Self-Help', 'Biography', 'History', 'Art', 'Music', 'Health', 'Cooking'];

  const currencyInfo = currencyService.getCurrencyInfo(selectedCurrency);
  const languageInfo = localizationService?.getLanguageInfo(selectedLanguage) || { flag: '🇺🇸', name: 'English' };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (selectedFilter) {
      case 'price_low':
        return parseFloat(String(a.price).replace(/[^0-9.]/g, '')) - parseFloat(String(b.price).replace(/[^0-9.]/g, '')); // Added String() cast
      case 'price_high':
        return parseFloat(String(b.price).replace(/[^0-9.]/g, '')) - parseFloat(String(a.price).replace(/[^0-9.]/g, '')); // Added String() cast
      case 'rating':
        return b.rating - a.rating;
      case 'bestseller':
        return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
      case 'featured':
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  const renderBookCard = ({ item: book }: { item: any }) => {
    const prices = formatPrice(book);
    
    return (
      <TouchableOpacity 
        style={styles.bookCard}
        onPress={() => {
          setSelectedBook(book);
          setShowBookDetails(true);
        }}
      >
        <View style={styles.bookImageContainer}>
          <View style={styles.bookCover}>
            <Text style={styles.bookEmoji}>{book.cover}</Text>
            {book.type === 'audiobook' && (
              <View style={styles.audioIndicator}>
                <MaterialIcons name="headphones" size={12} color="white" />
              </View>
            )}
          </View>
          {book.bestseller && (
            <View style={styles.bestsellerBadge}>
              <Text style={styles.bestsellerText}>
                {localizationService?.translate('bestseller') || 'Bestseller'}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle} numberOfLines={2}>
            {book.title}
          </Text>
          
          {/* Book Title Translation */}
          <View style={styles.bookTranslationContainer}>
            <TranslationWidget 
              text={`${book.title} by ${book.author}`}
              category="education"
              compact={true}
            />
          </View>
          <Text style={styles.bookAuthor}>
            {localizationService?.translate('author') || 'Author'}: {book.author}
          </Text>
          
          <View style={styles.bookRating}>
            <MaterialIcons name="star" size={12} color="#FFD700" />
            <Text style={styles.ratingText}>{book.rating}</Text>
            <Text style={styles.reviewsText}>({book.reviews})</Text>
          </View>
          
          {book.type === 'audiobook' && book.duration && (
            <Text style={styles.duration}>
              {localizationService?.translate('duration') || 'Duration'}: {book.duration}
            </Text>
          )}
          
          <View style={styles.priceContainer}>
            <Text style={styles.bookPrice}>{prices.price}</Text>
            {prices.originalPrice && (
              <Text style={styles.originalPrice}>{prices.originalPrice}</Text>
            )}
          </View>
          
          <TouchableOpacity style={styles.buyButton}>
            <MaterialIcons name="shopping-cart" size={14} color="white" />
            <Text style={styles.buyButtonText}>
              {localizationService?.translate('buy') || 'Buy'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {localizationService?.translate('market') || 'Market'}
        </Text>
        <View style={styles.headerControls}>
          {/* Currency Selector */}
          <TouchableOpacity 
            style={styles.currencyButton}
            onPress={() => setShowCurrencySelector(true)}
          >
            <Text style={styles.currencyFlag}>{currencyInfo?.flag}</Text>
            <Text style={styles.currencyCode}>{selectedCurrency}</Text>
          </TouchableOpacity>
          
          {/* Language Selector */}
          <TouchableOpacity 
            style={styles.languageButton}
            onPress={() => setShowLanguageSelector(true)}
          >
            <Text style={styles.languageFlag}>{languageInfo?.flag}</Text>
          </TouchableOpacity>
          
          {/* Donation Button */}
          <TouchableOpacity 
            style={styles.donateButton}
            onPress={() => setShowDonationModal(true)}
          >
            <MaterialIcons name="favorite" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${localizationService?.translate('books') || 'books'}...`}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#8E8E93"
        />
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoriesList}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipSelected
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryChipText,
                  selectedCategory === category && styles.categoryChipTextSelected
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <Text style={styles.filterLabel}>Sort by:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filtersList}>
            {[
              { key: 'featured', label: 'Featured' },
              { key: 'price_low', label: 'Price: Low to High' },
              { key: 'price_high', label: 'Price: High to Low' },
              { key: 'rating', label: 'Rating' },
              { key: 'bestseller', label: 'Bestsellers' }
            ].map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterChip,
                  selectedFilter === filter.key && styles.filterChipSelected
                ]}
                onPress={() => setSelectedFilter(filter.key)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedFilter === filter.key && styles.filterChipTextSelected
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Books Grid */}
      <FlatList
        data={sortedBooks}
        renderItem={renderBookCard}
        keyExtractor={(item) => item.id}
        numColumns={3}
        key={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.booksList}
        showsVerticalScrollIndicator={true}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <MaterialIcons name="search-off" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No books found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search or filter criteria
            </Text>
          </View>
        )}
      />

      {/* Modals */}
      <CurrencySelector
        visible={showCurrencySelector}
        onClose={() => setShowCurrencySelector(false)}
        selectedCurrency={selectedCurrency}
        onSelectCurrency={setSelectedCurrency}
        showConverter={true}
      />
      
      <LanguageSelector
        visible={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={setSelectedLanguage}
      />
      
      <DonationModal
        visible={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        projectTitle="Bookstagram Marketplace"
        creatorName="The Development Team"
        onDonationComplete={(amount, currency) => {
          console.log(`Donation completed: ${amount} ${currency}`);
        }}
      />
      
      <BookDetailsModal
        visible={showBookDetails}
        onClose={() => {
          setShowBookDetails(false);
          setSelectedBook(null);
        }}
        book={selectedBook}
        selectedCurrency={selectedCurrency}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Header with home page styling
  header: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  currencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  currencyFlag: {
    fontSize: 16,
  },
  currencyCode: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  languageButton: {
    backgroundColor: '#F8F9FA',
    padding: 6,
    borderRadius: 6,
  },
  languageFlag: {
    fontSize: 16,
  },
  donateButton: {
    backgroundColor: '#FFF0F0',
    padding: 6,
    borderRadius: 6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  categoriesSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoriesList: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryChipSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  categoryChipTextSelected: {
    color: '#FFFFFF',
  },
  filterBar: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginRight: 12,
  },
  filtersList: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  filterChipSelected: {
    backgroundColor: '#1F2937',
    borderColor: '#1F2937',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterChipTextSelected: {
    color: '#FFFFFF',
  },
  booksList: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  bookCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 2,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  bookImageContainer: {
    position: 'relative',
  },
  bookCover: {
    width: '100%',
    height: 70,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bookEmoji: {
    fontSize: 28,
  },
  audioIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    padding: 4,
  },
  bestsellerBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  bestsellerText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  bookInfo: {
    padding: 7,
  },
  bookTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
    lineHeight: 15,
  },
  bookAuthor: {
    fontSize: 9,
    color: '#6B7280',
    marginBottom: 4,
  },
  bookRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 2,
  },
  ratingText: {
    fontSize: 9,
    fontWeight: '500',
    color: '#1F2937',
  },
  reviewsText: {
    fontSize: 9,
    color: '#6B7280',
  },
  duration: {
    fontSize: 8,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  bookPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  originalPrice: {
    fontSize: 9,
    color: '#6B7280',
    textDecorationLine: 'line-through',
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 6,
    paddingVertical: 5,
    gap: 3,
  },
  buyButtonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  bookTranslationContainer: {
    alignItems: 'flex-start',
    marginTop: 4,
    marginBottom: 4,
  },
});
