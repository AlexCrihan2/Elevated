import { User, Post, Community, TrendingTopic, AnalyticsData, MarketplaceItem, LiveStream, NotificationItem } from '@/types/social';

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'johndoe@example.com',
    username: 'johndoe',
    displayName: 'John Doe',
    verified: true,
    followers: 2500,
    following: 420,
    location: 'San Francisco',
    bio: 'Tech enthusiast & startup founder',
    isLive: true,
    liveViewers: 2300,
    createdAt: '2023-01-15T00:00:00Z'
  },
  {
    id: '2',
    email: 'sarahchen@example.com', 
    username: 'sarahchen',
    displayName: 'Sarah Chen',
    verified: true,
    followers: 1800,
    following: 350,
    location: 'Brooklyn Coffee',
    bio: 'Designer & coffee enthusiast',
    createdAt: '2023-02-20T00:00:00Z'
  }
];

const mockPosts: Post[] = [
  {
    id: '1',
    userId: '1',
    user: mockUsers[0],
    content: 'Just launched my new project! Excited to share what I have been working on for the past few months. The future of social media is here! 🚀',
    hashtags: ['#tech', '#startup', '#innovation', '#socialmedia'],
    likes: 892,
    comments: 234,
    shares: 67,
    isLiked: false,
    createdAt: '2024-09-19T10:30:00Z',
    location: 'San Francisco'
  },
  {
    id: '2',
    userId: '1',
    user: mockUsers[0],
    content: 'LIVE: Building the next generation social platform! Join me as I code and share the journey of creating something amazing.',
    hashtags: ['#live', '#coding', '#development', '#tech'],
    likes: 2300,
    comments: 456,
    shares: 189,
    isLiked: true,
    isLive: true,
    liveViewers: 2300,
    createdAt: '2024-09-20T08:00:00Z',
    location: 'Tech Hub'
  },
  {
    id: '3',
    userId: '2',
    user: mockUsers[1],
    content: 'Spent the weekend exploring local coffee shops and working on some new design concepts. Inspiration is everywhere if you keep your eyes open ☕✨',
    hashtags: ['#design', '#coffee', '#inspiration', '#creative'],
    likes: 156,
    comments: 43,
    shares: 28,
    isLiked: false,
    createdAt: '2024-09-19T15:45:00Z',
    location: 'Brooklyn Coffee'
  }
];

const mockCommunities: Community[] = [
  {
    id: '1',
    name: 'Cancer Cure | Parasite Truth',
    category: 'Health',
    memberCount: 45000,
    isVerified: true,
    description: 'Scientific research and health discussions',
    avatar: '🧬'
  },
  {
    id: '2',
    name: 'Apple',
    category: 'Technology',
    memberCount: 2100000,
    isVerified: true,
    description: 'Official Apple community',
    avatar: '🍎'
  }
];

const mockTrending: TrendingTopic[] = [
  {
    id: '1',
    hashtag: '#TechNews',
    category: 'Technology',
    postCount: 125000,
    trend: 'up',
    country: 'United States'
  },
  {
    id: '2',
    hashtag: '#ClimateChange',
    category: 'Environment',
    postCount: 89000,
    trend: 'up',
    country: 'United States'
  },
  {
    id: '3',
    hashtag: '#WorldCup',
    category: 'Sports',
    postCount: 250000,
    trend: 'down',
    country: 'United States'
  }
];

export const socialApi = {
  // Posts
  async getPosts(): Promise<Post[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPosts;
  },

  async createPost(content: string, hashtags: string[], attachments?: any[]): Promise<Post> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newPost: Post = {
      id: Date.now().toString(),
      userId: '1',
      user: mockUsers[0],
      content,
      hashtags,
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
      attachments: attachments || []
    };
    return newPost;
  },

  async likePost(postId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
  },

  // Communities
  async getCommunities(): Promise<Community[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCommunities;
  },

  // Trending
  async getTrendingTopics(): Promise<TrendingTopic[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTrending;
  },

  // Analytics
  async getAnalytics(period: AnalyticsData['period']): Promise<AnalyticsData> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const baseData = {
      views: 125000,
      likes: 8500,
      comments: 2300,
      shares: 890,
      followers: 2500,
      engagement: 4.2
    };

    const multiplier = {
      '1d': 0.1,
      '7d': 0.3,
      '1m': 0.7,
      '6m': 1.0,
      '1y': 1.5,
      'all': 2.0
    }[period];

    return {
      period,
      views: Math.floor(baseData.views * multiplier),
      likes: Math.floor(baseData.likes * multiplier),
      comments: Math.floor(baseData.comments * multiplier),
      shares: Math.floor(baseData.shares * multiplier),
      followers: Math.floor(baseData.followers * multiplier),
      engagement: baseData.engagement * multiplier
    };
  },

  // AI Hashtag Generation
  async generateHashtags(content: string): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    // Simple keyword extraction simulation
    const keywords = content.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const techKeywords = ['project', 'tech', 'social', 'platform', 'innovation', 'startup', 'code', 'development'];
    const hashtagCandidates = keywords.filter(word => 
      techKeywords.includes(word) || word.length > 6
    ).slice(0, 4);
    
    return hashtagCandidates.map(tag => `#${tag}`);
  }
};