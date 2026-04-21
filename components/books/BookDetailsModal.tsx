import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { currencyService } from '@/services/currencyService';
import { localizationService } from '@/services/localizationService';

const { width, height } = Dimensions.get('window');

interface BookDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  book: any;
  selectedCurrency: string;
}

// AI-generated project stories and extensions
const generateProjectStory = (book: any) => {
  // Safety check for null/undefined book
  if (!book || !book.id) {
    return {
      story: 'Project information is currently being loaded...',
      extensions: [],
      timeline: []
    };
  }

  const stories: {[key: string]: any} = {
    'book-1': {
      story: `🧘‍♀️ **The Art of Mindfulness: A Journey Within**

Dr. Sarah Chen's groundbreaking work began during her residency at Stanford Medical Center, where she witnessed countless patients struggling with anxiety and chronic stress. Inspired by ancient meditation practices and modern neuroscience, she embarked on a 5-year research project combining brain imaging technology with traditional mindfulness techniques.

**The Discovery:**
Through extensive fMRI studies with over 2,000 participants, Dr. Chen discovered that specific mindfulness protocols could rewire neural pathways in just 8 weeks. Her revolutionary "Neural Mindfulness Method" showed 89% improvement in stress reduction and 76% enhancement in cognitive function.

**The Innovation:**
This book isn't just theory—it's a practical system backed by AI-assisted guided meditations, biometric feedback integration, and personalized progress tracking. Each chapter includes interactive exercises that adapt to your stress levels in real-time.

**Real Impact:**
"This methodology helped me overcome 15 years of chronic anxiety in just 2 months." - Maria K., Beta Reader
"My productivity increased 300% after implementing Dr. Chen's techniques." - James T., CEO`,
      
      extensions: [
        {
          name: 'Interactive Meditation App',
          type: 'Mobile Application',
          size: '45MB',
          description: 'AI-powered guided meditations with biometric integration',
          icon: '📱',
          downloadUrl: '#'
        },
        {
          name: 'Neural Mapping Visualizer',
          type: 'WebGL Application',
          size: '12MB',
          description: '3D brain visualization showing mindfulness impact on neural pathways',
          icon: '🧠',
          downloadUrl: '#'
        },
        {
          name: 'Mindfulness Progress Tracker',
          type: 'Excel Template',
          size: '2MB',
          description: 'Track your daily practice and measure improvements',
          icon: '📊',
          downloadUrl: '#'
        },
        {
          name: 'Breathing Pattern Audio Files',
          type: 'Audio Pack (MP3)',
          size: '180MB',
          description: '12 scientifically-tuned breathing exercises',
          icon: '🎵',
          downloadUrl: '#'
        },
        {
          name: 'Research Paper Collection',
          type: 'PDF Bundle',
          size: '8MB',
          description: 'Complete academic research behind the methodology',
          icon: '📚',
          downloadUrl: '#'
        }
      ],
      
      timeline: [
        { year: '2019', event: 'Initial research began at Stanford' },
        { year: '2020', event: 'First breakthrough in neural mapping' },
        { year: '2021', event: 'Clinical trials with 2,000 participants' },
        { year: '2022', event: 'AI algorithm development' },
        { year: '2023', event: 'Book completion and beta testing' },
        { year: '2024', event: 'Global publication and app launch' }
      ]
    },
    
    'book-2': {
      story: `💻 **Modern JavaScript Complete Guide: From Zero to AI Integration**

Alex Thompson, former Google Senior Engineer and creator of 15+ open-source libraries, spent 3 years developing the most comprehensive JavaScript curriculum ever created. This isn't just another coding book—it's a complete ecosystem for mastering modern web development.

**The Challenge:**
After mentoring 500+ developers, Alex noticed a critical gap: traditional JavaScript courses taught syntax but missed real-world application, modern frameworks, and emerging AI integration patterns.

**The Solution:**
This guide includes live code environments, AI-assisted debugging tools, and real-time collaboration features. Every concept is taught through building actual production applications.

**Cutting-Edge Features:**
- Interactive code editor with AI pair programming
- Real-time collaboration with global developer community  
- Automatic code review and optimization suggestions
- Integration with GPT-4 for advanced problem solving
- Live deployment pipeline to cloud platforms

**Success Stories:**
"Landed my dream job at Meta after completing Chapter 12." - Kevin L.
"Built a startup using the microservices patterns from this book - now valued at $2M." - Sarah M.`,
      
      extensions: [
        {
          name: 'Live Code Environment',
          type: 'Web Platform',
          size: 'Cloud Based',
          description: 'Browser-based IDE with AI assistance and real-time collaboration',
          icon: '💻',
          downloadUrl: '#'
        },
        {
          name: 'Project Starter Templates',
          type: 'GitHub Repository',
          size: '250MB',
          description: '50+ production-ready project templates',
          icon: '🚀',
          downloadUrl: '#'
        },
        {
          name: 'AI Coding Assistant Extension',
          type: 'VS Code Extension',
          size: '15MB',
          description: 'Personal AI tutor integrated into your code editor',
          icon: '🤖',
          downloadUrl: '#'
        },
        {
          name: 'Video Course Series',
          type: 'Video Collection',
          size: '4.2GB',
          description: '120 hours of hands-on coding tutorials',
          icon: '🎥',
          downloadUrl: '#'
        },
        {
          name: 'Developer Community Access',
          type: 'Discord Server',
          size: 'N/A',
          description: 'Private community with Alex and 10,000+ developers',
          icon: '👥',
          downloadUrl: '#'
        }
      ],
      
      timeline: [
        { year: '2021', event: 'Curriculum design and structure planning' },
        { year: '2022', event: 'AI integration research and prototype development' },
        { year: '2023', event: 'Beta testing with 1,000+ developers' },
        { year: '2024', event: 'Live platform launch and community building' }
      ]
    },
    
    'book-3': {
      story: `🎧 **The Psychology of Success: Rewiring Your Mind for Achievement**

Maria Rodriguez's journey from poverty to building a $100M company inspired her to decode the psychological patterns of high achievers. After interviewing 500+ successful entrepreneurs and conducting neurological studies, she discovered the "Success Neural Framework."

**The Research:**
Working with Harvard's Psychology Department, Maria identified 7 key mental patterns shared by top performers across industries. Using advanced EEG monitoring, her team mapped how successful thinking literally changes brain structure.

**Revolutionary Findings:**
- Success mindset can be programmed in 90 days
- Specific daily rituals create "achievement neural pathways"  
- Failure actually accelerates success when processed correctly
- Visualization techniques increase performance by 340%

**The Audio Experience:**
This isn't just an audiobook—it's an immersive neural training system with binaural beats, subliminal programming, and guided visualization sessions scientifically designed to reprogram your subconscious mind for success.

**Transformations:**
"Increased my income by 500% in 6 months using Chapter 4's techniques." - Robert K.
"Finally broke through my 10-year plateau and launched my dream business." - Lisa H.`,
      
      extensions: [
        {
          name: 'Neural Training Audio System',
          type: 'Audio Program',
          size: '890MB',
          description: 'Binaural beats and subliminal programming for success mindset',
          icon: '🧠',
          downloadUrl: '#'
        },
        {
          name: 'Success Visualization VR Experience',
          type: 'VR Application',
          size: '1.2GB',
          description: 'Immersive virtual reality success visualization sessions',
          icon: '🥽',
          downloadUrl: '#'
        },
        {
          name: 'Daily Success Tracker App',
          type: 'Mobile App',
          size: '67MB',
          description: 'Track habits, mindset shifts, and achievement progress',
          icon: '📈',
          downloadUrl: '#'
        },
        {
          name: 'Entrepreneur Interview Archives',
          type: 'Video Library',
          size: '3.8GB',
          description: '500+ full interviews with successful entrepreneurs',
          icon: '🎬',
          downloadUrl: '#'
        },
        {
          name: 'Success Psychology Assessment',
          type: 'Web Platform',
          size: 'Cloud Based',
          description: 'AI-powered psychological assessment and personalized recommendations',
          icon: '🔍',
          downloadUrl: '#'
        }
      ],
      
      timeline: [
        { year: '2020', event: 'Entrepreneur interview project launched' },
        { year: '2021', event: 'Harvard partnership and neurological studies' },
        { year: '2022', event: 'Success Neural Framework discovery' },
        { year: '2023', event: 'Audio system development and testing' },
        { year: '2024', event: 'VR experience creation and global launch' }
      ]
    },
    
    'book-4': {
      story: `🌍 **Climate Change Solutions: A Blueprint for Planetary Recovery**

Dr. James Wilson, former NASA climate scientist and IPCC contributor, presents the most comprehensive action plan for reversing climate change. After analyzing 10,000+ research papers and climate models, he's identified 50 breakthrough technologies that could restore our planet within 30 years.

**The Mission:**
Frustrated by doom-and-gloom climate narratives, Dr. Wilson dedicated 4 years to identifying real, actionable solutions. His team used AI to analyze every published climate paper from 1990-2024, discovering overlooked breakthrough technologies.

**Game-Changing Discoveries:**
- Ocean thermal energy could power the entire planet
- Atmospheric carbon capture using engineered algae
- Revolutionary solar paint increases efficiency by 400%
- Quantum weather prediction prevents natural disasters

**The Interactive Experience:**
This digital book includes climate simulation software, carbon footprint calculators, and augmented reality visualizations showing climate solutions in action. Readers can literally see how their actions impact global climate models.

**Global Impact:**
"Implemented Dr. Wilson's urban planning solutions - our city reduced emissions by 60%." - Mayor Sarah T.
"His agricultural techniques helped our farm become carbon-negative while increasing yields 200%." - Farmer John M.`,
      
      extensions: [
        {
          name: 'Climate Simulation Software',
          type: 'Desktop Application',
          size: '340MB',
          description: 'Model climate scenarios and test solutions in real-time',
          icon: '🌡️',
          downloadUrl: '#'
        },
        {
          name: 'AR Climate Visualizer',
          type: 'Mobile AR App',
          size: '180MB',
          description: 'See climate solutions in your environment using augmented reality',
          icon: '📱',
          downloadUrl: '#'
        },
        {
          name: 'Carbon Calculator API',
          type: 'Developer API',
          size: 'Cloud Based',
          description: 'Integrate precise carbon calculations into any application',
          icon: '⚡',
          downloadUrl: '#'
        },
        {
          name: 'Breakthrough Technologies Database',
          type: 'Interactive Web Portal',
          size: 'Cloud Based',
          description: 'Searchable database of 500+ climate solutions with implementation guides',
          icon: '🔬',
          downloadUrl: '#'
        },
        {
          name: 'NASA Climate Data Archive',
          type: 'Data Repository',
          size: '12GB',
          description: 'Complete climate datasets used in the research',
          icon: '🛰️',
          downloadUrl: '#'
        }
      ],
      
      timeline: [
        { year: '2020', event: 'NASA data analysis project initiated' },
        { year: '2021', event: 'AI-powered research paper analysis completed' },
        { year: '2022', event: 'Breakthrough technology identification' },
        { year: '2023', event: 'Climate simulation software development' },
        { year: '2024', event: 'AR visualization and global solution database launch' }
      ]
    },
    
    'book-5': {
      story: `✍️ **Creative Writing Mastery: From Blank Page to Bestseller**

Emma Davis transformed from a struggling writer to a bestselling author of 12 novels in just 5 years. Now she reveals her revolutionary "Neural Story Architecture" - a scientific approach to storytelling that guarantees reader engagement.

**The Breakthrough:**
After studying 10,000+ bestselling books using AI text analysis, Emma discovered hidden patterns in successful narratives. Her "Story DNA" system identifies exactly what makes readers unable to put books down.

**The Science of Storytelling:**
- Neurological triggers that create emotional addiction
- Mathematical formulas for perfect pacing
- AI-assisted character development that feels human
- Predictive analytics for market success

**Revolutionary Tools:**
This isn't just instruction—it's a complete writing ecosystem with AI co-writing assistants, automated editing, and real-time reader engagement prediction. Write stories that are scientifically designed to succeed.

**Success Stories:**
"Used Emma's system to write my first novel - it became a Amazon #1 bestseller in 3 months." - Mike R.
"Her AI tools helped me overcome 5 years of writer's block and complete my trilogy." - Janet K.`,
      
      extensions: [
        {
          name: 'AI Writing Assistant Platform',
          type: 'Web Application',
          size: 'Cloud Based',
          description: 'Advanced AI co-writer with genre-specific training',
          icon: '🤖',
          downloadUrl: '#'
        },
        {
          name: 'Story DNA Analyzer',
          type: 'Desktop Software',
          size: '120MB',
          description: 'Analyze any text for narrative effectiveness and reader engagement',
          icon: '🧬',
          downloadUrl: '#'
        },
        {
          name: 'Character Psychology Generator',
          type: 'Web Tool',
          size: 'Cloud Based',
          description: 'Create psychologically complex characters using personality science',
          icon: '👥',
          downloadUrl: '#'
        },
        {
          name: 'Bestseller Template Library',
          type: 'Document Collection',
          size: '45MB',
          description: '200+ proven story structures from bestselling novels',
          icon: '📋',
          downloadUrl: '#'
        },
        {
          name: 'Writer Community Platform',
          type: 'Social Platform',
          size: 'Cloud Based',
          description: 'Connect with 50,000+ writers using Emma\'s methodology',
          icon: '🌐',
          downloadUrl: '#'
        }
      ],
      
      timeline: [
        { year: '2019', event: 'Bestseller analysis project started' },
        { year: '2020', event: 'Story DNA patterns discovered' },
        { year: '2021', event: 'AI writing assistant development' },
        { year: '2022', event: 'Beta testing with 1,000+ writers' },
        { year: '2023', event: 'Platform refinement and success validation' },
        { year: '2024', event: 'Global launch and writer community building' }
      ]
    }
  };

  return stories[book.id] || {
    story: `This innovative project represents a breakthrough in ${book.category.toLowerCase()} research and development. The author has spent years developing cutting-edge methodologies and tools that revolutionize the field.`,
    extensions: [
      {
        name: 'Digital Resources Pack',
        type: 'Mixed Media',
        size: '100MB',
        description: 'Comprehensive digital resources and tools',
        icon: '📦',
        downloadUrl: '#'
      }
    ],
    timeline: [
      { year: '2023', event: 'Project development began' },
      { year: '2024', event: 'Research completion and publication' }
    ]
  };
};

export default function BookDetailsModal({
  visible,
  onClose,
  book,
  selectedCurrency
}: BookDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('story');
  const [convertedPrice, setConvertedPrice] = useState<string>('');
  const [convertedOriginalPrice, setConvertedOriginalPrice] = useState<string>('');

  // Always call useEffect before any early returns to maintain hook order
  useEffect(() => {
    if (book) {
      convertPrices();
    }
  }, [book, selectedCurrency]);

  // Early return if no book data AFTER all hooks are called
  if (!book) return null;

  const projectData = generateProjectStory(book);

  const convertPrices = async () => {
    if (!book) return;
    
    if (selectedCurrency === 'USD') {
      setConvertedPrice(book.price);
      setConvertedOriginalPrice(book.originalPrice || '');
      return;
    }

    try {
      const price = parseFloat(book.price.replace(/[^0-9.]/g, ''));
      const converted = await currencyService.convert(price, 'USD', selectedCurrency);
      setConvertedPrice(currencyService.formatPrice(converted, selectedCurrency));

      if (book.originalPrice) {
        const originalPrice = parseFloat(book.originalPrice.replace(/[^0-9.]/g, ''));
        const convertedOriginal = await currencyService.convert(originalPrice, 'USD', selectedCurrency);
        setConvertedOriginalPrice(currencyService.formatPrice(convertedOriginal, selectedCurrency));
      }
    } catch (error) {
      console.error('Price conversion failed:', error);
      setConvertedPrice(book.price);
      setConvertedOriginalPrice(book.originalPrice || '');
    }
  };

  const tabs = [
    { id: 'story', label: 'Project Story', icon: 'auto-stories' },
    { id: 'extensions', label: 'Extensions', icon: 'extension' },
    { id: 'timeline', label: 'Timeline', icon: 'timeline' },
    { id: 'details', label: 'Details', icon: 'info' }
  ];

  const renderStoryContent = () => (
    <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.aiIndicator}>
        <MaterialIcons name="psychology" size={16} color="#8B5CF6" />
        <Text style={styles.aiIndicatorText}>AI-Generated Project Story</Text>
      </View>
      <Text style={styles.storyContent}>{projectData.story}</Text>
    </ScrollView>
  );

  const renderExtensionsContent = () => (
    <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Attached Extensions & Resources</Text>
      {projectData.extensions.map((extension: any, index: number) => (
        <View key={index} style={styles.extensionItem}>
          <View style={styles.extensionIcon}>
            <Text style={styles.extensionEmoji}>{extension.icon}</Text>
          </View>
          <View style={styles.extensionInfo}>
            <Text style={styles.extensionName}>{extension.name}</Text>
            <Text style={styles.extensionType}>{extension.type}</Text>
            <Text style={styles.extensionDescription}>{extension.description}</Text>
            <View style={styles.extensionMeta}>
              <Text style={styles.extensionSize}>Size: {extension.size}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.downloadButton}>
            <MaterialIcons name="download" size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

  const renderTimelineContent = () => (
    <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Development Timeline</Text>
      {projectData.timeline.map((item: any, index: number) => (
        <View key={index} style={styles.timelineItem}>
          <View style={styles.timelineYear}>
            <Text style={styles.timelineYearText}>{item.year}</Text>
          </View>
          <View style={styles.timelineLine}>
            <View style={styles.timelineDot} />
            {index < projectData.timeline.length - 1 && <View style={styles.timelineConnector} />}
          </View>
          <View style={styles.timelineContent}>
            <Text style={styles.timelineEvent}>{item.event}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderDetailsContent = () => (
    <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Book Details</Text>
      
      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Author</Text>
          <Text style={styles.detailValue}>{book.author}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Category</Text>
          <Text style={styles.detailValue}>{book.category}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Type</Text>
          <Text style={styles.detailValue}>{book.type === 'audiobook' ? 'Audiobook' : 'E-book'}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Rating</Text>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={16} color="#FFD700" />
            <Text style={styles.detailValue}>{book.rating} ({book.reviews} reviews)</Text>
          </View>
        </View>
        
        {book.duration && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>{book.duration}</Text>
          </View>
        )}
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Price</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>{convertedPrice}</Text>
            {convertedOriginalPrice && (
              <Text style={styles.originalPrice}>{convertedOriginalPrice}</Text>
            )}
          </View>
        </View>
        
        {book.bestseller && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Status</Text>
            <View style={styles.bestsellerBadge}>
              <MaterialIcons name="star" size={14} color="#FF6B35" />
              <Text style={styles.bestsellerText}>Bestseller</Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{book.title}</Text>
          <TouchableOpacity style={styles.shareButton}>
            <MaterialIcons name="share" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Book Preview */}
        <View style={styles.bookPreview}>
          <View style={styles.bookCoverLarge}>
            <Text style={styles.bookEmojiLarge}>{book.cover}</Text>
            {book.type === 'audiobook' && (
              <View style={styles.audioIndicatorLarge}>
                <MaterialIcons name="headphones" size={16} color="white" />
              </View>
            )}
          </View>
          <View style={styles.bookInfoPreview}>
            <Text style={styles.bookTitleLarge}>{book.title}</Text>
            <Text style={styles.bookAuthorLarge}>by {book.author}</Text>
            <View style={styles.bookMetaPreview}>
              <View style={styles.ratingPreview}>
                <MaterialIcons name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>{book.rating}</Text>
              </View>
              <Text style={styles.categoryBadge}>{book.category}</Text>
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.tabList}>
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  style={[styles.tab, activeTab === tab.id && styles.activeTab]}
                  onPress={() => setActiveTab(tab.id)}
                >
                  <MaterialIcons 
                    name={tab.icon as any} 
                    size={18} 
                    color={activeTab === tab.id ? '#3B82F6' : '#6B7280'} 
                  />
                  <Text style={[
                    styles.tabText,
                    activeTab === tab.id && styles.activeTabText
                  ]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === 'story' && renderStoryContent()}
          {activeTab === 'extensions' && renderExtensionsContent()}
          {activeTab === 'timeline' && renderTimelineContent()}
          {activeTab === 'details' && renderDetailsContent()}
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.purchaseButton}>
            <MaterialIcons name="shopping-cart" size={20} color="white" />
            <Text style={styles.purchaseButtonText}>
              Purchase {convertedPrice}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.previewButton}>
            <MaterialIcons name="preview" size={20} color="#3B82F6" />
            <Text style={styles.previewButtonText}>Preview</Text>
          </TouchableOpacity>
        </View>
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
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  shareButton: {
    padding: 4,
  },
  bookPreview: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  bookCoverLarge: {
    width: 80,
    height: 120,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    position: 'relative',
  },
  bookEmojiLarge: {
    fontSize: 32,
  },
  audioIndicatorLarge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    padding: 4,
  },
  bookInfoPreview: {
    flex: 1,
    justifyContent: 'center',
  },
  bookTitleLarge: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  bookAuthorLarge: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  bookMetaPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  categoryBadge: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3B82F6',
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabList: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    gap: 6,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#3B82F6',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 16,
    gap: 6,
  },
  aiIndicatorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  storyContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  extensionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  extensionIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  extensionEmoji: {
    fontSize: 24,
  },
  extensionInfo: {
    flex: 1,
  },
  extensionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  extensionType: {
    fontSize: 14,
    color: '#3B82F6',
    marginBottom: 4,
  },
  extensionDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 4,
  },
  extensionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  extensionSize: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  downloadButton: {
    padding: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineYear: {
    width: 60,
    alignItems: 'center',
  },
  timelineYearText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  timelineLine: {
    width: 20,
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginBottom: 4,
  },
  timelineConnector: {
    width: 2,
    flex: 1,
    backgroundColor: '#D1D5DB',
  },
  timelineContent: {
    flex: 1,
    paddingTop: -4,
  },
  timelineEvent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  detailsGrid: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
  originalPrice: {
    fontSize: 14,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  bestsellerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  bestsellerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B35',
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  purchaseButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  purchaseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  previewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBF4FF',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  previewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
});