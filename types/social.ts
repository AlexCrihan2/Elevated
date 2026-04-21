export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  verified: boolean;
  followers: number;
  following: number;
  location?: string;
  bio?: string;
  isLive?: boolean;
  liveViewers?: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: User;
  content: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
  replyTo?: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  content: string;
  hashtags: string[];
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'gif';
  attachments?: {
    name: string;
    size: number;
    type: string;
    uri: string;
  }[];
  poll?: {
    question: string;
    options: { text: string; votes: number }[];
    duration: number;
    totalVotes: number;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
  aiAnalysis?: {
    detectedObjects: string[];
    sceneType: string;
    mood: string;
    confidence: number;
    categories: string[];
  };
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isLive?: boolean;
  liveViewers?: number;
  createdAt: string;
  location?: string;
}

export interface Community {
  id: string;
  name: string;
  category: string;
  memberCount: number;
  isVerified: boolean;
  description: string;
  avatar: string;
}

export interface TrendingTopic {
  id: string;
  hashtag: string;
  category: string;
  postCount: number;
  trend: 'up' | 'down' | 'stable';
  country: string;
}

export interface AnalyticsData {
  period: '1d' | '7d' | '1m' | '6m' | '1y' | 'all';
  views: number;
  likes: number;
  comments: number;
  shares: number;
  followers: number;
  engagement: number;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  author: User;
  likes: number;
  price?: number;
  imageUrl?: string;
}

export interface LiveStream {
  id: string;
  user: User;
  title: string;
  description: string;
  viewers: number;
  hashtags: string[];
  isActive: boolean;
  startedAt: string;
  thumbnailUrl?: string;
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'live';
  user: User;
  content: string;
  isRead: boolean;
  createdAt: string;
}