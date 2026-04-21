import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Switch, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface AdvancedSettingsProps {
  visible: boolean;
  onClose: () => void;
}

interface LiveStreamSettings {
  quality: 'auto' | '720p' | '1080p' | '4K';
  subtitles: boolean;
  autoTranslate: boolean;
  preferredLanguage: string;
  lowLatencyMode: boolean;
  chatEnabled: boolean;
  smartTakesEnabled: boolean;
  autoRecord: boolean;
  backgroundAudio: boolean;
  gestureControls: boolean;
}

interface TabSettings {
  customOrder: string[];
  hiddenTabs: string[];
  badgeNotifications: boolean;
  swipeGestures: boolean;
  tabAnimations: boolean;
  compactMode: boolean;
  autoRefresh: boolean;
  refreshInterval: number; // minutes
}

interface SubscriptionSettings {
  autoSubscribe: boolean;
  notifyNewPosts: boolean;
  digestFrequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  contentTypes: string[];
  priorityUsers: string[];
  quietHours: { start: string; end: string };
  spendingLimit: number;
  monthlyBudget: number;
}

interface SpendingAnalysis {
  trackSpending: boolean;
  categories: string[];
  alerts: boolean;
  budgetWarnings: boolean;
  monthlyReports: boolean;
  exportData: boolean;
  currency: string;
  taxTracking: boolean;
}

interface AnimationSettings {
  enableAnimations: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  parallaxEffects: boolean;
  microInteractions: boolean;
  transitionEffects: boolean;
  loadingAnimations: boolean;
  reducedMotion: boolean;
  customTransitions: boolean;
}

interface AISettings {
  behavior: 'conservative' | 'balanced' | 'aggressive';
  creativity: number;
  responsiveness: number;
  personalization: number;
  learningMode: boolean;
  proactiveAssistance: boolean;
  predictiveAnalytics: boolean;
  contextAwareness: boolean;
  voiceAssistant: boolean;
  smartSuggestions: boolean;
}

export default function AdvancedSettings({ visible, onClose }: AdvancedSettingsProps) {
  const [activeTab, setActiveTab] = useState<'live' | 'tabs' | 'subs' | 'spending' | 'animations' | 'ai'>('live');
  
  const [liveStreamSettings, setLiveStreamSettings] = useState<LiveStreamSettings>({
    quality: 'auto',
    subtitles: true,
    autoTranslate: true,
    preferredLanguage: 'English',
    lowLatencyMode: false,
    chatEnabled: true,
    smartTakesEnabled: true,
    autoRecord: false,
    backgroundAudio: true,
    gestureControls: true,
  });

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
    { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
    { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
  ];

  const [tabSettings, setTabSettings] = useState<TabSettings>({
    customOrder: ['Home', 'Trending', 'Marketplace', 'Subs', 'News', 'Profile', 'Notifications'],
    hiddenTabs: [],
    badgeNotifications: true,
    swipeGestures: true,
    tabAnimations: true,
    compactMode: false,
    autoRefresh: true,
    refreshInterval: 5,
  });

  const [subscriptionSettings, setSubscriptionSettings] = useState<SubscriptionSettings>({
    autoSubscribe: false,
    notifyNewPosts: true,
    digestFrequency: 'daily',
    contentTypes: ['posts', 'research', 'business'],
    priorityUsers: [],
    quietHours: { start: '22:00', end: '08:00' },
    spendingLimit: 100,
    monthlyBudget: 500,
  });

  const [spendingAnalysis, setSpendingAnalysis] = useState<SpendingAnalysis>({
    trackSpending: true,
    categories: ['subscriptions', 'premium-features', 'marketplace', 'tips'],
    alerts: true,
    budgetWarnings: true,
    monthlyReports: true,
    exportData: false,
    currency: 'USD',
    taxTracking: false,
  });

  const [animationSettings, setAnimationSettings] = useState<AnimationSettings>({
    enableAnimations: true,
    animationSpeed: 'normal',
    parallaxEffects: true,
    microInteractions: true,
    transitionEffects: true,
    loadingAnimations: true,
    reducedMotion: false,
    customTransitions: false,
  });

  const [aiSettings, setAISettings] = useState<AISettings>({
    behavior: 'balanced',
    creativity: 70,
    responsiveness: 80,
    personalization: 60,
    learningMode: true,
    proactiveAssistance: true,
    predictiveAnalytics: false,
    contextAwareness: true,
    voiceAssistant: false,
    smartSuggestions: true,
  });

  const updateLiveStreamSetting = (key: keyof LiveStreamSettings, value: any) => {
    setLiveStreamSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateTabSetting = (key: keyof TabSettings, value: any) => {
    setTabSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateSubscriptionSetting = (key: keyof SubscriptionSettings, value: any) => {
    setSubscriptionSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateSpendingSetting = (key: keyof SpendingAnalysis, value: any) => {
    setSpendingAnalysis(prev => ({ ...prev, [key]: value }));
  };

  const updateAnimationSetting = (key: keyof AnimationSettings, value: any) => {
    setAnimationSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateAISetting = (key: keyof AISettings, value: any) => {
    setAISettings(prev => ({ ...prev, [key]: value }));
  };

  const renderLiveStreamSettings = () => (
    <ScrollView style={styles.tabContent}>
      {/* Stream Quality */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stream Quality</Text>
        <Text style={styles.sectionDescription}>
          Choose your preferred streaming quality and performance settings
        </Text>
        
        <View style={styles.qualityOptions}>
          {[
            { value: 'auto', label: 'Auto', desc: 'Adaptive quality based on connection' },
            { value: '720p', label: '720p HD', desc: 'Standard high definition' },
            { value: '1080p', label: '1080p Full HD', desc: 'Full high definition' },
            { value: '4K', label: '4K Ultra HD', desc: 'Ultra high definition (premium)' },
          ].map(({ value, label, desc }) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.qualityOption,
                liveStreamSettings.quality === value && styles.qualityOptionActive
              ]}
              onPress={() => updateLiveStreamSetting('quality', value)}
            >
              <View style={styles.qualityHeader}>
                <Text style={[
                  styles.qualityLabel,
                  liveStreamSettings.quality === value && styles.qualityLabelActive
                ]}>
                  {label}
                </Text>
                {liveStreamSettings.quality === value && (
                  <MaterialIcons name="check-circle" size={20} color="#3B82F6" />
                )}
              </View>
              <Text style={styles.qualityDesc}>{desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Language & Subtitles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Language & Subtitles</Text>
        
        {/* Language Selector */}
        <View style={styles.languageSection}>
          <Text style={styles.languageSectionTitle}>Preferred Language</Text>
          <TouchableOpacity 
            style={styles.languageSelector}
            onPress={() => Alert.alert('Language Selection', 'Choose your preferred language')}
          >
            <View style={styles.languageCurrent}>
              <Text style={styles.languageFlag}>🇺🇸</Text>
              <Text style={styles.languageName}>English</Text>
            </View>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="#9CA3AF" />
          </TouchableOpacity>
          
          <Text style={styles.languageGridTitle}>Available Languages</Text>
          <View style={styles.languageGrid}>
            {languages.slice(0, 8).map((lang) => (
              <TouchableOpacity 
                key={lang.code}
                style={[
                  styles.languageOption,
                  liveStreamSettings.preferredLanguage === lang.name && styles.languageOptionActive
                ]}
                onPress={() => updateLiveStreamSetting('preferredLanguage', lang.name)}
              >
                <Text style={styles.languageFlag}>{lang.flag}</Text>
                <Text style={[
                  styles.languageOptionText,
                  liveStreamSettings.preferredLanguage === lang.name && styles.languageOptionTextActive
                ]}>
                  {lang.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity 
            style={styles.showMoreLanguages}
            onPress={() => Alert.alert('More Languages', 'Additional languages: Portuguese, Russian, Chinese, Japanese, Korean, Arabic, Hindi, Dutch, Swedish, Norwegian')}
          >
            <Text style={styles.showMoreText}>Show More Languages</Text>
            <MaterialIcons name="expand-more" size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>
        
        {[
          { key: 'subtitles', label: 'Enable Subtitles', desc: 'Show subtitles during live streams' },
          { key: 'autoTranslate', label: 'Auto Translate', desc: 'Automatically translate to your language' },
          { key: 'smartTakesEnabled', label: 'Smart Takes', desc: 'AI-generated insights and analysis' },
        ].map(({ key, label, desc }) => (
          <View key={key} style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{label}</Text>
              <Text style={styles.settingDesc}>{desc}</Text>
            </View>
            <Switch
              value={liveStreamSettings[key as keyof LiveStreamSettings] as boolean}
              onValueChange={(value) => updateLiveStreamSetting(key as keyof LiveStreamSettings, value)}
            />
          </View>
        ))}
      </View>

      {/* Stream Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stream Features</Text>
        
        {[
          { key: 'lowLatencyMode', label: 'Low Latency Mode', desc: 'Reduce stream delay (uses more data)' },
          { key: 'chatEnabled', label: 'Live Chat', desc: 'Enable chat during streams' },
          { key: 'autoRecord', label: 'Auto Record', desc: 'Automatically record streams' },
          { key: 'backgroundAudio', label: 'Background Audio', desc: 'Continue audio when app is in background' },
          { key: 'gestureControls', label: 'Gesture Controls', desc: 'Swipe and tap controls during stream' },
        ].map(({ key, label, desc }) => (
          <View key={key} style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{label}</Text>
              <Text style={styles.settingDesc}>{desc}</Text>
            </View>
            <Switch
              value={liveStreamSettings[key as keyof LiveStreamSettings] as boolean}
              onValueChange={(value) => updateLiveStreamSetting(key as keyof LiveStreamSettings, value)}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderTabSettings = () => (
    <ScrollView style={styles.tabContent}>
      {/* Tab Customization */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tab Customization</Text>
        <Text style={styles.sectionDescription}>
          Customize your navigation tabs and behavior
        </Text>
        
        <TouchableOpacity style={styles.customizeButton} onPress={() => Alert.alert('Tab Reorder', 'Drag and drop to reorder tabs')}>
          <MaterialIcons name="reorder" size={20} color="#3B82F6" />
          <Text style={styles.customizeButtonText}>Reorder Tabs</Text>
          <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.customizeButton} onPress={() => Alert.alert('Hide Tabs', 'Select tabs to hide from navigation')}>
          <MaterialIcons name="visibility-off" size={20} color="#3B82F6" />
          <Text style={styles.customizeButtonText}>Hide Tabs</Text>
          <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Tab Behavior */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tab Behavior</Text>
        
        {[
          { key: 'badgeNotifications', label: 'Badge Notifications', desc: 'Show notification badges on tabs' },
          { key: 'swipeGestures', label: 'Swipe Gestures', desc: 'Swipe between tabs' },
          { key: 'tabAnimations', label: 'Tab Animations', desc: 'Animate tab transitions' },
          { key: 'compactMode', label: 'Compact Mode', desc: 'Smaller tab bar design' },
          { key: 'autoRefresh', label: 'Auto Refresh', desc: 'Automatically refresh tab content' },
        ].map(({ key, label, desc }) => (
          <View key={key} style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{label}</Text>
              <Text style={styles.settingDesc}>{desc}</Text>
            </View>
            <Switch
              value={tabSettings[key as keyof TabSettings] as boolean}
              onValueChange={(value) => updateTabSetting(key as keyof TabSettings, value)}
            />
          </View>
        ))}
      </View>

      {/* Refresh Interval */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Auto Refresh Interval</Text>
        <Text style={styles.sectionDescription}>
          How often to refresh content automatically
        </Text>
        
        <View style={styles.sliderGroup}>
          <View style={styles.sliderItem}>
            <Text style={styles.sliderLabel}>Refresh Every</Text>
            <Text style={styles.sliderValue}>{tabSettings.refreshInterval} minutes</Text>
          </View>
          <View style={styles.sliderContainer}>
            <TouchableOpacity 
              onPress={() => updateTabSetting('refreshInterval', Math.max(1, tabSettings.refreshInterval - 1))}
              style={styles.sliderButton}
            >
              <MaterialIcons name="remove" size={20} color="#3B82F6" />
            </TouchableOpacity>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderProgress, { width: `${(tabSettings.refreshInterval / 30) * 100}%` }]} />
            </View>
            <TouchableOpacity 
              onPress={() => updateTabSetting('refreshInterval', Math.min(30, tabSettings.refreshInterval + 1))}
              style={styles.sliderButton}
            >
              <MaterialIcons name="add" size={20} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderSubscriptionSettings = () => (
    <ScrollView style={styles.tabContent}>
      {/* Subscription Behavior */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription Behavior</Text>
        
        {[
          { key: 'autoSubscribe', label: 'Auto Subscribe', desc: 'Automatically subscribe to engaging content' },
          { key: 'notifyNewPosts', label: 'New Post Notifications', desc: 'Notify when subscribed users post' },
        ].map(({ key, label, desc }) => (
          <View key={key} style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{label}</Text>
              <Text style={styles.settingDesc}>{desc}</Text>
            </View>
            <Switch
              value={subscriptionSettings[key as keyof SubscriptionSettings] as boolean}
              onValueChange={(value) => updateSubscriptionSetting(key as keyof SubscriptionSettings, value)}
            />
          </View>
        ))}
      </View>

      {/* Digest Frequency */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Digest Frequency</Text>
        
        <View style={styles.digestOptions}>
          {[
            { value: 'immediate', label: 'Immediate', desc: 'Get notified instantly' },
            { value: 'hourly', label: 'Hourly', desc: 'Digest every hour' },
            { value: 'daily', label: 'Daily', desc: 'Once per day summary' },
            { value: 'weekly', label: 'Weekly', desc: 'Weekly roundup' },
          ].map(({ value, label, desc }) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.digestOption,
                subscriptionSettings.digestFrequency === value && styles.digestOptionActive
              ]}
              onPress={() => updateSubscriptionSetting('digestFrequency', value)}
            >
              <Text style={[
                styles.digestLabel,
                subscriptionSettings.digestFrequency === value && styles.digestLabelActive
              ]}>
                {label}
              </Text>
              <Text style={styles.digestDesc}>{desc}</Text>
              {subscriptionSettings.digestFrequency === value && (
                <MaterialIcons name="check-circle" size={18} color="#3B82F6" style={styles.digestCheck} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Spending Limits */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spending Controls</Text>
        
        <View style={styles.spendingControls}>
          <View style={styles.sliderGroup}>
            <View style={styles.sliderItem}>
              <Text style={styles.sliderLabel}>Daily Spending Limit</Text>
              <Text style={styles.sliderValue}>${subscriptionSettings.spendingLimit}</Text>
            </View>
            <View style={styles.sliderContainer}>
              <TouchableOpacity 
                onPress={() => updateSubscriptionSetting('spendingLimit', Math.max(10, subscriptionSettings.spendingLimit - 10))}
                style={styles.sliderButton}
              >
                <MaterialIcons name="remove" size={20} color="#3B82F6" />
              </TouchableOpacity>
              <View style={styles.sliderTrack}>
                <View style={[styles.sliderProgress, { width: `${(subscriptionSettings.spendingLimit / 500) * 100}%` }]} />
              </View>
              <TouchableOpacity 
                onPress={() => updateSubscriptionSetting('spendingLimit', Math.min(500, subscriptionSettings.spendingLimit + 10))}
                style={styles.sliderButton}
              >
                <MaterialIcons name="add" size={20} color="#3B82F6" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.sliderGroup}>
            <View style={styles.sliderItem}>
              <Text style={styles.sliderLabel}>Monthly Budget</Text>
              <Text style={styles.sliderValue}>${subscriptionSettings.monthlyBudget}</Text>
            </View>
            <View style={styles.sliderContainer}>
              <TouchableOpacity 
                onPress={() => updateSubscriptionSetting('monthlyBudget', Math.max(50, subscriptionSettings.monthlyBudget - 50))}
                style={styles.sliderButton}
              >
                <MaterialIcons name="remove" size={20} color="#3B82F6" />
              </TouchableOpacity>
              <View style={styles.sliderTrack}>
                <View style={[styles.sliderProgress, { width: `${(subscriptionSettings.monthlyBudget / 2000) * 100}%` }]} />
              </View>
              <TouchableOpacity 
                onPress={() => updateSubscriptionSetting('monthlyBudget', Math.min(2000, subscriptionSettings.monthlyBudget + 50))}
                style={styles.sliderButton}
              >
                <MaterialIcons name="add" size={20} color="#3B82F6" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderSpendingAnalysis = () => (
    <ScrollView style={styles.tabContent}>
      {/* Spending Tracking */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spending Tracking</Text>
        
        {[
          { key: 'trackSpending', label: 'Track Spending', desc: 'Monitor all app-related expenses' },
          { key: 'alerts', label: 'Spending Alerts', desc: 'Get notified of spending milestones' },
          { key: 'budgetWarnings', label: 'Budget Warnings', desc: 'Warn when approaching limits' },
          { key: 'monthlyReports', label: 'Monthly Reports', desc: 'Generate detailed spending reports' },
          { key: 'exportData', label: 'Export Data', desc: 'Export spending data to CSV' },
          { key: 'taxTracking', label: 'Tax Tracking', desc: 'Track business expenses for taxes' },
        ].map(({ key, label, desc }) => (
          <View key={key} style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{label}</Text>
              <Text style={styles.settingDesc}>{desc}</Text>
            </View>
            <Switch
              value={spendingAnalysis[key as keyof SpendingAnalysis] as boolean}
              onValueChange={(value) => updateSpendingSetting(key as keyof SpendingAnalysis, value)}
            />
          </View>
        ))}
      </View>

      {/* Spending Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spending Categories</Text>
        <Text style={styles.sectionDescription}>
          Categories tracked for spending analysis
        </Text>
        
        <View style={styles.categoriesList}>
          {spendingAnalysis.categories.map((category, index) => (
            <View key={index} style={styles.categoryChip}>
              <Text style={styles.categoryText}>{category}</Text>
              <TouchableOpacity onPress={() => console.log('Remove category')}>
                <MaterialIcons name="close" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* Currency Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Currency</Text>
        
        <TouchableOpacity style={styles.currencySelector} onPress={() => Alert.alert('Currency', 'Select your preferred currency')}>
          <MaterialIcons name="attach-money" size={20} color="#3B82F6" />
          <Text style={styles.currencyText}>{spendingAnalysis.currency} - US Dollar</Text>
          <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderAnimationSettings = () => (
    <ScrollView style={styles.tabContent}>
      {/* Animation Controls */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Animation Controls</Text>
        
        {[
          { key: 'enableAnimations', label: 'Enable Animations', desc: 'Turn on/off all animations' },
          { key: 'parallaxEffects', label: 'Parallax Effects', desc: 'Depth and scrolling effects' },
          { key: 'microInteractions', label: 'Micro Interactions', desc: 'Small interactive animations' },
          { key: 'transitionEffects', label: 'Transition Effects', desc: 'Page and component transitions' },
          { key: 'loadingAnimations', label: 'Loading Animations', desc: 'Animated loading indicators' },
          { key: 'reducedMotion', label: 'Reduced Motion', desc: 'Accessibility-friendly animations' },
          { key: 'customTransitions', label: 'Custom Transitions', desc: 'Advanced transition effects' },
        ].map(({ key, label, desc }) => (
          <View key={key} style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{label}</Text>
              <Text style={styles.settingDesc}>{desc}</Text>
            </View>
            <Switch
              value={animationSettings[key as keyof AnimationSettings] as boolean}
              onValueChange={(value) => updateAnimationSetting(key as keyof AnimationSettings, value)}
            />
          </View>
        ))}
      </View>

      {/* Animation Speed */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Animation Speed</Text>
        
        <View style={styles.speedOptions}>
          {[
            { value: 'slow', label: 'Slow', desc: 'Relaxed, detailed animations' },
            { value: 'normal', label: 'Normal', desc: 'Standard animation speed' },
            { value: 'fast', label: 'Fast', desc: 'Quick, snappy animations' },
          ].map(({ value, label, desc }) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.speedOption,
                animationSettings.animationSpeed === value && styles.speedOptionActive
              ]}
              onPress={() => updateAnimationSetting('animationSpeed', value)}
            >
              <Text style={[
                styles.speedLabel,
                animationSettings.animationSpeed === value && styles.speedLabelActive
              ]}>
                {label}
              </Text>
              <Text style={styles.speedDesc}>{desc}</Text>
              {animationSettings.animationSpeed === value && (
                <MaterialIcons name="check-circle" size={18} color="#3B82F6" style={styles.speedCheck} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderAISettings = () => (
    <ScrollView style={styles.tabContent}>
      {/* AI Behavior */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Behavior Mode</Text>
        
        <View style={styles.behaviorOptions}>
          {[
            { value: 'conservative', label: 'Conservative', desc: 'Cautious, fact-based responses' },
            { value: 'balanced', label: 'Balanced', desc: 'Optimal mix of creativity and accuracy' },
            { value: 'aggressive', label: 'Aggressive', desc: 'Bold, innovative suggestions' },
          ].map(({ value, label, desc }) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.behaviorOption,
                aiSettings.behavior === value && styles.behaviorOptionActive
              ]}
              onPress={() => updateAISetting('behavior', value)}
            >
              <View style={styles.behaviorHeader}>
                <Text style={[
                  styles.behaviorLabel,
                  aiSettings.behavior === value && styles.behaviorLabelActive
                ]}>
                  {label}
                </Text>
                {aiSettings.behavior === value && (
                  <MaterialIcons name="check-circle" size={20} color="#3B82F6" />
                )}
              </View>
              <Text style={styles.behaviorDesc}>{desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* AI Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Features</Text>
        
        {[
          { key: 'learningMode', label: 'Adaptive Learning', desc: 'AI learns from your interactions' },
          { key: 'proactiveAssistance', label: 'Proactive Assistance', desc: 'AI suggests actions before you ask' },
          { key: 'predictiveAnalytics', label: 'Predictive Analytics', desc: 'AI predicts trends and outcomes' },
          { key: 'contextAwareness', label: 'Context Awareness', desc: 'AI understands your current situation' },
          { key: 'voiceAssistant', label: 'Voice Assistant', desc: 'Voice-activated AI commands' },
          { key: 'smartSuggestions', label: 'Smart Suggestions', desc: 'Intelligent content recommendations' },
        ].map(({ key, label, desc }) => (
          <View key={key} style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{label}</Text>
              <Text style={styles.settingDesc}>{desc}</Text>
            </View>
            <Switch
              value={aiSettings[key as keyof AISettings] as boolean}
              onValueChange={(value) => updateAISetting(key as keyof AISettings, value)}
            />
          </View>
        ))}
      </View>

      {/* AI Personality Tuning */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Personality Tuning</Text>
        
        <View style={styles.sliderGroup}>
          <View style={styles.sliderItem}>
            <Text style={styles.sliderLabel}>Creativity Level</Text>
            <Text style={styles.sliderValue}>{aiSettings.creativity}%</Text>
          </View>
          <View style={styles.sliderContainer}>
            <TouchableOpacity 
              onPress={() => updateAISetting('creativity', Math.max(0, aiSettings.creativity - 10))}
              style={styles.sliderButton}
            >
              <MaterialIcons name="remove" size={20} color="#3B82F6" />
            </TouchableOpacity>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderProgress, { width: `${aiSettings.creativity}%` }]} />
            </View>
            <TouchableOpacity 
              onPress={() => updateAISetting('creativity', Math.min(100, aiSettings.creativity + 10))}
              style={styles.sliderButton}
            >
              <MaterialIcons name="add" size={20} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const tabs = [
    { id: 'live', label: 'Live Stream', icon: 'live-tv' },
    { id: 'tabs', label: 'Tabs', icon: 'tab' },
    { id: 'subs', label: 'Subscriptions', icon: 'subscriptions' },
    { id: 'spending', label: 'Spending', icon: 'account-balance-wallet' },
    { id: 'animations', label: 'Animations', icon: 'animation' },
    { id: 'ai', label: 'AI Settings', icon: 'psychology' },
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#2D3748" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Advanced Settings</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabNavigation}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, activeTab === tab.id && styles.tabActive]}
                onPress={() => setActiveTab(tab.id as any)}
              >
                <MaterialIcons 
                  name={tab.icon as any} 
                  size={18} 
                  color={activeTab === tab.id ? '#3B82F6' : '#718096'} 
                />
                <Text style={[
                  styles.tabLabel,
                  activeTab === tab.id && styles.tabLabelActive
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tab Content */}
        {activeTab === 'live' && renderLiveStreamSettings()}
        {activeTab === 'tabs' && renderTabSettings()}
        {activeTab === 'subs' && renderSubscriptionSettings()}
        {activeTab === 'spending' && renderSpendingAnalysis()}
        {activeTab === 'animations' && renderAnimationSettings()}
        {activeTab === 'ai' && renderAISettings()}
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
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FAFBFC',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: 0.3,
  },
  placeholder: {
    width: 24,
  },
  tabNavigation: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    marginHorizontal: 4,
  },
  tabActive: {
    borderBottomColor: '#3B82F6',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 8,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: '#3B82F6',
  },
  tabContent: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  section: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 24,
    lineHeight: 24,
  },
  qualityOptions: {
    gap: 16,
  },
  qualityOption: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  qualityOptionActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EBF8FF',
  },
  qualityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  qualityLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  qualityLabelActive: {
    color: '#3B82F6',
  },
  qualityDesc: {
    fontSize: 15,
    color: '#718096',
    lineHeight: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 6,
  },
  settingInfo: {
    flex: 1,
    marginRight: 20,
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  settingDesc: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
  },
  customizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  customizeButtonText: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#2D3748',
    marginLeft: 16,
  },
  sliderGroup: {
    marginBottom: 24,
  },
  sliderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sliderLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2D3748',
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3B82F6',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  sliderButton: {
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sliderTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  sliderProgress: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  digestOptions: {
    gap: 12,
  },
  digestOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },
  digestOptionActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EBF8FF',
  },
  digestLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    flex: 1,
  },
  digestLabelActive: {
    color: '#3B82F6',
  },
  digestDesc: {
    fontSize: 14,
    color: '#718096',
    flex: 2,
  },
  digestCheck: {
    position: 'absolute',
    right: 16,
  },
  spendingControls: {
    gap: 20,
  },
  categoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  currencyText: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#2D3748',
    marginLeft: 16,
  },
  speedOptions: {
    gap: 12,
  },
  speedOption: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },
  speedOptionActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EBF8FF',
  },
  speedLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  speedLabelActive: {
    color: '#3B82F6',
  },
  speedDesc: {
    fontSize: 14,
    color: '#718096',
  },
  speedCheck: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  behaviorOptions: {
    gap: 16,
  },
  behaviorOption: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  behaviorOptionActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EBF8FF',
  },
  behaviorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  behaviorLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  behaviorLabelActive: {
    color: '#3B82F6',
  },
  behaviorDesc: {
    fontSize: 15,
    color: '#718096',
    lineHeight: 20,
  },
  // Language-specific styles
  languageSection: {
    marginBottom: 24,
  },
  languageSectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  languageCurrent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2D3748',
  },
  languageGridTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 16,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: '30%',
  },
  languageOptionActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EBF8FF',
  },
  languageOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginLeft: 8,
  },
  languageOptionTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  showMoreLanguages: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  showMoreText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3B82F6',
    marginRight: 6,
  },
});