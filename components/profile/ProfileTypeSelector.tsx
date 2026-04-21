import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export type ProfileType = 'researcher' | 'business' | 'creator';

interface ProfileTypeConfig {
  type: ProfileType;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string[];
  features: string[];
  aiFeatures: string[];
  exclusiveFeatures: string[];
}

const profileTypes: ProfileTypeConfig[] = [
  {
    type: 'researcher',
    title: 'Researcher',
    description: 'For academics, scientists, and research professionals',
    icon: 'science',
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#3B82F6'],
    features: [
      'Research Publication Manager',
      'Citation Tracking',
      'Collaboration Network',
      'Grant Opportunities',
      'Peer Review System',
      'Research Analytics',
      'Conference Calendar',
      'Lab Management Tools'
    ],
    aiFeatures: [
      'AI Research Assistant',
      'Smart Literature Review',
      'Hypothesis Generator',
      'Data Analysis AI',
      'Research Trend Prediction',
      'Citation Recommendation',
      'Methodology Suggestion'
    ],
    exclusiveFeatures: [
      'Research Impact Score',
      'Academic Reputation Tracking',
      'Institutional Collaboration Hub',
      'Research Funding Matcher'
    ]
  },
  {
    type: 'business',
    title: 'Business',
    description: 'For entrepreneurs, executives, and business professionals',
    icon: 'business-center',
    color: '#059669',
    gradient: ['#059669', '#0D9488'],
    features: [
      'Business Analytics Dashboard',
      'Market Research Tools',
      'Networking Hub',
      'Investment Tracker',
      'Team Management',
      'Client Relationship Manager',
      'Revenue Analytics',
      'Competitive Intelligence'
    ],
    aiFeatures: [
      'AI Business Advisor',
      'Market Prediction AI',
      'Customer Behavior Analysis',
      'Risk Assessment AI',
      'Growth Strategy Generator',
      'Financial Forecasting',
      'Competitor Analysis AI'
    ],
    exclusiveFeatures: [
      'Business Valuation Tool',
      'Investor Matching System',
      'Strategic Partnership Finder',
      'Business Intelligence Suite'
    ]
  },
  {
    type: 'creator',
    title: 'Content Creator',
    description: 'For influencers, artists, and content professionals',
    icon: 'create',
    color: '#DC2626',
    gradient: ['#DC2626', '#F59E0B'],
    features: [
      'Content Calendar',
      'Engagement Analytics',
      'Brand Partnership Hub',
      'Monetization Tools',
      'Audience Insights',
      'Content Library',
      'Collaboration Platform',
      'Performance Metrics'
    ],
    aiFeatures: [
      'AI Content Generator',
      'Trend Prediction AI',
      'Engagement Optimizer',
      'Hashtag Generator AI',
      'Caption Writer AI',
      'Visual Style Analyzer',
      'Audience Growth AI'
    ],
    exclusiveFeatures: [
      'Creator Economy Dashboard',
      'Brand Deal Negotiator',
      'Content Monetization Suite',
      'Viral Content Predictor'
    ]
  }
];

interface ProfileTypeSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelectType: (type: ProfileType) => void;
  currentType?: ProfileType;
}

export default function ProfileTypeSelector({ 
  visible, 
  onClose, 
  onSelectType, 
  currentType 
}: ProfileTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<ProfileType | null>(currentType || null);
  const [showDetails, setShowDetails] = useState(false);
  const [detailType, setDetailType] = useState<ProfileTypeConfig | null>(null);

  const handleSelectType = (type: ProfileType) => {
    setSelectedType(type);
  };

  const handleConfirm = () => {
    if (selectedType) {
      onSelectType(selectedType);
      onClose();
    }
  };

  const handleShowDetails = (type: ProfileTypeConfig) => {
    setDetailType(type);
    setShowDetails(true);
  };

  const getGradientStyle = (colors: string[]) => ({
    backgroundColor: colors[0], // Fallback for React Native
    // Note: Linear gradients would need additional library like react-native-linear-gradient
  });

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#2D3748" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Choose Your Profile Type</Text>
          <TouchableOpacity 
            onPress={handleConfirm} 
            disabled={!selectedType}
            style={[styles.confirmButton, !selectedType && styles.confirmButtonDisabled]}
          >
            <Text style={[styles.confirmButtonText, !selectedType && styles.confirmButtonTextDisabled]}>
              Confirm
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.subtitle}>
            Select the profile type that best matches your professional focus. 
            This will customize your entire experience and unlock specialized features.
          </Text>

          {/* Profile Type Cards */}
          <View style={styles.typeContainer}>
            {profileTypes.map((type) => (
              <TouchableOpacity
                key={type.type}
                style={[
                  styles.typeCard,
                  getGradientStyle(type.gradient),
                  selectedType === type.type && styles.typeCardSelected
                ]}
                onPress={() => handleSelectType(type.type)}
              >
                <View style={styles.typeHeader}>
                  <View style={styles.typeIcon}>
                    <MaterialIcons name={type.icon as any} size={32} color="white" />
                  </View>
                  <TouchableOpacity 
                    style={styles.detailsButton}
                    onPress={() => handleShowDetails(type)}
                  >
                    <MaterialIcons name="info-outline" size={20} color="white" />
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.typeTitle}>{type.title}</Text>
                <Text style={styles.typeDescription}>{type.description}</Text>

                <View style={styles.featurePreview}>
                  <Text style={styles.featurePreviewTitle}>Key Features:</Text>
                  {type.features.slice(0, 3).map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <MaterialIcons name="check-circle" size={16} color="rgba(255,255,255,0.8)" />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                  <Text style={styles.moreFeatures}>+{type.features.length - 3} more features</Text>
                </View>

                {selectedType === type.type && (
                  <View style={styles.selectedIndicator}>
                    <MaterialIcons name="check-circle" size={24} color="white" />
                    <Text style={styles.selectedText}>Selected</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.aiPoweredSection}>
            <View style={styles.aiHeader}>
              <MaterialIcons name="auto-awesome" size={24} color="#8B5CF6" />
              <Text style={styles.aiTitle}>AI-Powered Experience</Text>
            </View>
            <Text style={styles.aiDescription}>
              Each profile type includes specialized AI features tailored to your profession, 
              helping you achieve your goals more efficiently.
            </Text>
          </View>
        </ScrollView>

        {/* Details Modal */}
        <Modal visible={showDetails} transparent animationType="fade">
          <View style={styles.detailsOverlay}>
            <TouchableOpacity 
              style={styles.detailsBackground}
              onPress={() => setShowDetails(false)}
            />
            <ScrollView style={styles.detailsModal} showsVerticalScrollIndicator={false}>
              {detailType && (
                <>
                  <View style={[styles.detailsHeader, getGradientStyle(detailType.gradient)]}>
                    <TouchableOpacity 
                      style={styles.detailsClose}
                      onPress={() => setShowDetails(false)}
                    >
                      <MaterialIcons name="close" size={24} color="white" />
                    </TouchableOpacity>
                    
                    <View style={styles.detailsTypeIcon}>
                      <MaterialIcons name={detailType.icon as any} size={48} color="white" />
                    </View>
                    <Text style={styles.detailsTypeTitle}>{detailType.title}</Text>
                    <Text style={styles.detailsTypeDescription}>{detailType.description}</Text>
                  </View>

                  <View style={styles.detailsContent}>
                    {/* Core Features */}
                    <View style={styles.detailsSection}>
                      <Text style={styles.detailsSectionTitle}>Core Features</Text>
                      {detailType.features.map((feature, index) => (
                        <View key={index} style={styles.detailsFeatureItem}>
                          <MaterialIcons name="check-circle" size={20} color={detailType.color} />
                          <Text style={styles.detailsFeatureText}>{feature}</Text>
                        </View>
                      ))}
                    </View>

                    {/* AI Features */}
                    <View style={styles.detailsSection}>
                      <View style={styles.aiSectionHeader}>
                        <MaterialIcons name="auto-awesome" size={20} color="#8B5CF6" />
                        <Text style={styles.detailsSectionTitle}>AI-Powered Features</Text>
                      </View>
                      {detailType.aiFeatures.map((feature, index) => (
                        <View key={index} style={styles.detailsFeatureItem}>
                          <MaterialIcons name="psychology" size={20} color="#8B5CF6" />
                          <Text style={styles.detailsFeatureText}>{feature}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Exclusive Features */}
                    <View style={styles.detailsSection}>
                      <View style={styles.exclusiveSectionHeader}>
                        <MaterialIcons name="star" size={20} color="#F59E0B" />
                        <Text style={styles.detailsSectionTitle}>Exclusive Features</Text>
                      </View>
                      {detailType.exclusiveFeatures.map((feature, index) => (
                        <View key={index} style={styles.detailsFeatureItem}>
                          <MaterialIcons name="star" size={20} color="#F59E0B" />
                          <Text style={styles.detailsFeatureText}>{feature}</Text>
                        </View>
                      ))}
                    </View>

                    <TouchableOpacity 
                      style={[styles.selectTypeButton, getGradientStyle(detailType.gradient)]}
                      onPress={() => {
                        handleSelectType(detailType.type);
                        setShowDetails(false);
                      }}
                    >
                      <Text style={styles.selectTypeButtonText}>
                        Select {detailType.title}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </Modal>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  confirmButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
  },
  confirmButtonDisabled: {
    backgroundColor: '#CBD5E0',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  confirmButtonTextDisabled: {
    color: '#9CA3AF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  typeContainer: {
    gap: 16,
    marginBottom: 24,
  },
  typeCard: {
    borderRadius: 16,
    padding: 20,
    position: 'relative',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  typeCardSelected: {
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  typeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  typeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsButton: {
    padding: 8,
  },
  typeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  typeDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
    lineHeight: 22,
  },
  featurePreview: {
    marginBottom: 16,
  },
  featurePreviewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 8,
  },
  moreFeatures: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
    marginTop: 4,
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  aiPoweredSection: {
    backgroundColor: '#F3E8FF',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B5CF6',
    marginLeft: 8,
  },
  aiDescription: {
    fontSize: 14,
    color: '#6B46C1',
    lineHeight: 20,
  },
  detailsOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  detailsBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  detailsModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  detailsHeader: {
    padding: 24,
    paddingTop: 40,
    alignItems: 'center',
    position: 'relative',
  },
  detailsClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  detailsTypeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  detailsTypeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  detailsTypeDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  detailsContent: {
    padding: 24,
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  aiSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exclusiveSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailsFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailsFeatureText: {
    fontSize: 14,
    color: '#4A5568',
    marginLeft: 12,
    flex: 1,
  },
  selectTypeButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  selectTypeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});