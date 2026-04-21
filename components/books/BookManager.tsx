import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Book {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  type: 'ebook' | 'audiobook';
  status: 'draft' | 'published' | 'under-review';
  sales: number;
  rating: number;
  reviews: number;
  createdAt: string;
}

interface BookManagerProps {
  visible: boolean;
  onClose: () => void;
}

const sampleBooks: Book[] = [
  {
    id: 'user-book-1',
    title: 'My Research Journey in AI',
    description: 'A comprehensive guide to my 10-year research experience in artificial intelligence and machine learning.',
    price: '$24.99',
    category: 'Technology',
    type: 'ebook',
    status: 'published',
    sales: 342,
    rating: 4.7,
    reviews: 89,
    createdAt: '2024-01-15'
  },
  {
    id: 'user-book-2',
    title: 'Sustainable Architecture Handbook',
    description: 'Practical approaches to green building design and environmental sustainability in architecture.',
    price: '$19.99',
    category: 'Design',
    type: 'audiobook',
    status: 'published',
    sales: 156,
    rating: 4.5,
    reviews: 34,
    createdAt: '2024-02-20'
  },
  {
    id: 'user-book-3',
    title: 'Medical Innovation Ethics',
    description: 'Exploring ethical considerations in modern medical research and breakthrough treatments.',
    price: '$29.99',
    category: 'Health',
    type: 'ebook',
    status: 'draft',
    sales: 0,
    rating: 0,
    reviews: 0,
    createdAt: '2024-03-01'
  },
];

const categories = ['Technology', 'Health', 'Environment', 'Design', 'Business', 'Science'];

export default function BookManager({ visible, onClose }: BookManagerProps) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'published' | 'drafts' | 'create'>('published');
  const [books, setBooks] = useState<Book[]>(sampleBooks);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Technology',
    type: 'ebook' as 'ebook' | 'audiobook',
    audioNarration: false,
  });

  const handleCreateBook = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      category: 'Technology',
      type: 'ebook',
      audioNarration: false,
    });
    setEditingBook(null);
    setShowCreateForm(true);
  };

  const handleEditBook = (book: Book) => {
    setFormData({
      title: book.title,
      description: book.description,
      price: book.price,
      category: book.category,
      type: book.type,
      audioNarration: book.type === 'audiobook',
    });
    setEditingBook(book);
    setShowCreateForm(true);
  };

  const handleSaveBook = () => {
    if (!formData.title || !formData.description || !formData.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const bookData = {
      ...formData,
      type: formData.audioNarration ? 'audiobook' : 'ebook',
      id: editingBook ? editingBook.id : `user-book-${Date.now()}`,
      status: 'draft' as const,
      sales: editingBook ? editingBook.sales : 0,
      rating: editingBook ? editingBook.rating : 0,
      reviews: editingBook ? editingBook.reviews : 0,
      createdAt: editingBook ? editingBook.createdAt : new Date().toISOString().split('T')[0],
    };

    if (editingBook) {
      setBooks(prev => prev.map(book => 
        book.id === editingBook.id ? { ...bookData, status: editingBook.status } : book
      ));
    } else {
      setBooks(prev => [...prev, bookData]);
    }

    setShowCreateForm(false);
    Alert.alert('Success', editingBook ? 'Book updated successfully!' : 'Book created successfully!');
  };

  const handlePublishBook = (bookId: string) => {
    Alert.alert(
      'Publish Book',
      'Are you sure you want to publish this book? It will be available for purchase.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Publish',
          onPress: () => {
            setBooks(prev => prev.map(book => 
              book.id === bookId ? { ...book, status: 'published' } : book
            ));
            Alert.alert('Success', 'Book published successfully!');
          }
        }
      ]
    );
  };

  const handleDeleteBook = (bookId: string) => {
    Alert.alert(
      'Delete Book',
      'Are you sure you want to delete this book? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setBooks(prev => prev.filter(book => book.id !== bookId));
            Alert.alert('Success', 'Book deleted successfully!');
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return '#10B981';
      case 'draft': return '#F59E0B';
      case 'under-review': return '#3B82F6';
      default: return '#718096';
    }
  };

  const publishedBooks = books.filter(book => book.status === 'published');
  const draftBooks = books.filter(book => book.status === 'draft' || book.status === 'under-review');

  const renderBookCard = (book: Book) => (
    <View key={book.id} style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.bookCover}>
          <Text style={styles.bookEmoji}>📚</Text>
          <View style={styles.typeIndicator}>
            <MaterialIcons 
              name={book.type === 'audiobook' ? 'headphones' : 'menu-book'} 
              size={12} 
              color="white" 
            />
          </View>
        </View>
        
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookCategory}>{book.category} • {book.type === 'audiobook' ? 'Audiobook' : 'eBook'}</Text>
          <Text style={styles.bookDescription} numberOfLines={2}>{book.description}</Text>
          
          <View style={styles.bookMeta}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(book.status) }]}>
              <Text style={styles.statusText}>{book.status.charAt(0).toUpperCase() + book.status.slice(1)}</Text>
            </View>
            <Text style={styles.bookPrice}>{book.price}</Text>
          </View>
        </View>
      </View>
      
      {book.status === 'published' && (
        <View style={styles.bookStats}>
          <View style={styles.statItem}>
            <MaterialIcons name="shopping-cart" size={16} color="#718096" />
            <Text style={styles.statText}>{book.sales} sold</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialIcons name="star" size={16} color="#F59E0B" />
            <Text style={styles.statText}>{book.rating} ({book.reviews} reviews)</Text>
          </View>
        </View>
      )}
      
      <View style={styles.bookActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleEditBook(book)}
        >
          <MaterialIcons name="edit" size={16} color="#3B82F6" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        
        {book.status === 'draft' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.publishButton]}
            onPress={() => handlePublishBook(book.id)}
          >
            <MaterialIcons name="publish" size={16} color="white" />
            <Text style={[styles.actionButtonText, { color: 'white' }]}>Publish</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteBook(book.id)}
        >
          <MaterialIcons name="delete" size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCreateForm = () => (
    <Modal visible={showCreateForm} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.createFormContainer, { paddingTop: insets.top }]}>
        <View style={styles.formHeader}>
          <TouchableOpacity onPress={() => setShowCreateForm(false)}>
            <MaterialIcons name="close" size={24} color="#4A5568" />
          </TouchableOpacity>
          <Text style={styles.formTitle}>{editingBook ? 'Edit Book' : 'Create New Book'}</Text>
          <TouchableOpacity onPress={handleSaveBook}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.formContent}>
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Title *</Text>
            <TextInput
              style={styles.formInput}
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
              placeholder="Enter book title"
              placeholderTextColor="#A0AEC0"
            />
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Description *</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              placeholder="Describe your book"
              placeholderTextColor="#A0AEC0"
              multiline
              numberOfLines={4}
            />
          </View>
          
          <View style={styles.formRow}>
            <View style={[styles.formSection, { flex: 1, marginRight: 12 }]}>
              <Text style={styles.formLabel}>Price *</Text>
              <TextInput
                style={styles.formInput}
                value={formData.price}
                onChangeText={(text) => setFormData(prev => ({ ...prev, price: text }))}
                placeholder="$19.99"
                placeholderTextColor="#A0AEC0"
                keyboardType="numeric"
              />
            </View>
            
            <View style={[styles.formSection, { flex: 1 }]}>
              <Text style={styles.formLabel}>Category *</Text>
              <View style={styles.categorySelector}>
                <Text style={styles.selectedCategory}>{formData.category}</Text>
                <MaterialIcons name="keyboard-arrow-down" size={20} color="#718096" />
              </View>
            </View>
          </View>
          
          <View style={styles.formSection}>
            <View style={styles.switchContainer}>
              <View style={styles.switchInfo}>
                <Text style={styles.switchLabel}>Audio Narration</Text>
                <Text style={styles.switchDescription}>Include professional audio narration</Text>
              </View>
              <Switch
                value={formData.audioNarration}
                onValueChange={(value) => setFormData(prev => ({ ...prev, audioNarration: value }))}
              />
            </View>
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Upload Content</Text>
            <TouchableOpacity style={styles.uploadButton}>
              <MaterialIcons name="cloud-upload" size={24} color="#3B82F6" />
              <Text style={styles.uploadButtonText}>Upload Manuscript (PDF, DOC)</Text>
            </TouchableOpacity>
            
            {formData.audioNarration && (
              <TouchableOpacity style={[styles.uploadButton, { marginTop: 12 }]}>
                <MaterialIcons name="mic" size={24} color="#10B981" />
                <Text style={styles.uploadButtonText}>Upload Audio Files (MP3, WAV)</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>Keywords (Optional)</Text>
            <TextInput
              style={styles.formInput}
              placeholder="AI, machine learning, technology..."
              placeholderTextColor="#A0AEC0"
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  if (!visible) return null;

  console.log('BookManager rendering, visible:', visible);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#4A5568" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Books</Text>
          <TouchableOpacity onPress={handleCreateBook}>
            <MaterialIcons name="add" size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>
        
        {/* Tab Navigation */}
        <View style={styles.tabNavigation}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'published' && styles.activeTab]}
            onPress={() => setActiveTab('published')}
          >
            <Text style={[styles.tabText, activeTab === 'published' && styles.activeTabText]}>
              Published ({publishedBooks.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'drafts' && styles.activeTab]}
            onPress={() => setActiveTab('drafts')}
          >
            <Text style={[styles.tabText, activeTab === 'drafts' && styles.activeTabText]}>
              Drafts ({draftBooks.length})
            </Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content}>
          {activeTab === 'published' ? (
            publishedBooks.length > 0 ? (
              publishedBooks.map(renderBookCard)
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateEmoji}>📖</Text>
                <Text style={styles.emptyStateTitle}>No Published Books</Text>
                <Text style={styles.emptyStateDesc}>Start writing and publish your first book!</Text>
                <TouchableOpacity style={styles.createButton} onPress={handleCreateBook}>
                  <Text style={styles.createButtonText}>Create Your First Book</Text>
                </TouchableOpacity>
              </View>
            )
          ) : (
            draftBooks.length > 0 ? (
              draftBooks.map(renderBookCard)
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateEmoji}>✍️</Text>
                <Text style={styles.emptyStateTitle}>No Drafts</Text>
                <Text style={styles.emptyStateDesc}>All your book drafts will appear here</Text>
              </View>
            )
          )}
        </ScrollView>
        
        {renderCreateForm()}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    color: '#2D3748',
    fontSize: 18,
    fontWeight: '700',
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: '#F7FAFC',
    margin: 20,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    color: '#718096',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#3B82F6',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  bookCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bookCover: {
    width: 60,
    height: 80,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  bookEmoji: {
    fontSize: 24,
  },
  typeIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 6,
    padding: 2,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    color: '#2D3748',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  bookCategory: {
    color: '#718096',
    fontSize: 12,
    marginBottom: 8,
  },
  bookDescription: {
    color: '#4A5568',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  bookMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  bookPrice: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '700',
  },
  bookStats: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    color: '#718096',
    fontSize: 12,
    marginLeft: 4,
  },
  bookActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  publishButton: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  actionButtonText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    color: '#2D3748',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyStateDesc: {
    color: '#718096',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  createButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Create Form Styles
  createFormContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  formTitle: {
    color: '#2D3748',
    fontSize: 18,
    fontWeight: '700',
  },
  saveButton: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  formContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formSection: {
    marginVertical: 16,
  },
  formRow: {
    flexDirection: 'row',
  },
  formLabel: {
    color: '#2D3748',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2D3748',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categorySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedCategory: {
    color: '#2D3748',
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchInfo: {
    flex: 1,
  },
  switchLabel: {
    color: '#2D3748',
    fontSize: 16,
    fontWeight: '600',
  },
  switchDescription: {
    color: '#718096',
    fontSize: 14,
    marginTop: 2,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});