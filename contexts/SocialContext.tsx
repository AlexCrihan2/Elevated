
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Post, User, Comment, AnalyticsData } from '@/types/social';
import { socialApi } from '@/services/socialApi';

interface SocialContextType {
  // Posts
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  updatePost: (postId: string, updates: Partial<Post>) => void;
  resetAllPosts: () => void;
  
  // Comments
  comments: Comment[];
  setComments: (comments: Comment[]) => void;
  addComment: (comment: Comment) => void;
  getCommentsByPostId: (postId: string) => Comment[];
  
  // Stories
  stories: any[];
  setStories: (stories: any[]) => void;
  addStory: (story: any) => void;
  
  // User
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  
  // UI State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Analytics
  analyticsData: AnalyticsData | null;
  setAnalyticsData: (data: AnalyticsData | null) => void;
  
  // Live streaming
  isLiveStreamActive: boolean;
  setIsLiveStreamActive: (active: boolean) => void;
  liveViewers: number;
  setLiveViewers: (viewers: number) => void;
  
  // Subscriptions
  subscriptions: string[];
  subscribeToUser: (username: string) => void;
  unsubscribeFromUser: (username: string) => void;
  refreshPosts: () => Promise<void>;
  
  // Settings
  settings: {
    readReceipts: boolean;
    liveSubtitles: boolean;
    autoTranslate: boolean;
    pushNotifications: boolean;
    darkMode: boolean;
    autoPlayVideos: boolean;
  };
  updateSettings: (updates: Partial<typeof settings>) => void;
}

export const SocialContext = createContext<SocialContextType | undefined>(undefined);

export function SocialProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLiveStreamActive, setIsLiveStreamActive] = useState(false);
  const [liveViewers, setLiveViewers] = useState(0);
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [settings, setSettings] = useState({
    readReceipts: true,
    liveSubtitles: true,
    autoTranslate: false,
    pushNotifications: true,
    darkMode: false,
    autoPlayVideos: true,
  });

  useEffect(() => {
    // Initialize with sample data
    const initializeData = async () => {
      try {
        const samplePosts = await socialApi.getPosts();
        setPosts(samplePosts);
        
        // Set a demo current user if none exists
        if (!currentUser) {
          const demoUser: User = {
            id: 'demo-user',
            email: 'demo@example.com',
            username: 'demo_user',
            displayName: 'Demo User',
            verified: false,
            followers: 42,
            following: 138,
            bio: 'Just testing the app!',
            location: 'Demo City',
            createdAt: new Date().toISOString()
          };
          setCurrentUser(demoUser);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load posts:', error);
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  const addComment = (comment: Comment) => {
    setComments(prev => [comment, ...prev]);
    // Update the post's comment count
    updatePost(comment.postId, { 
      comments: (posts.find(p => p.id === comment.postId)?.comments || 0) + 1 
    });
  };

  const getCommentsByPostId = (postId: string): Comment[] => {
    return comments.filter(comment => comment.postId === postId);
  };

  const resetAllPosts = () => {
    setPosts([]);
    setComments([]);
    setStories([]);
  };

  const addPost = (post: Post) => {
    // Use functional update to ensure proper state management
    setPosts(prevPosts => {
      // Check if post already exists to avoid duplicates
      const existingPost = prevPosts.find(p => p.id === post.id);
      if (existingPost) {
        return prevPosts; // Don't add duplicate
      }
      return [post, ...prevPosts]; // Add new post at the beginning
    });
  };

  const addStory = (story: any) => {
    setStories(prev => [story, ...prev]);
  };

  const updatePost = (postId: string, updates: Partial<Post>) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, ...updates } : post
    ));
  };

  const refreshPosts = async () => {
    try {
      const freshPosts = await socialApi.getPosts();
      setPosts(freshPosts);
    } catch (error) {
      console.error('Failed to refresh posts:', error);
    }
  };

  const subscribeToUser = (username: string) => {
    if (!subscriptions.includes(username)) {
      setSubscriptions(prev => [...prev, username]);
    }
  };

  const unsubscribeFromUser = (username: string) => {
    setSubscriptions(prev => prev.filter(sub => sub !== username));
  };

  const updateSettings = (updates: Partial<typeof settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

    return (
    <SocialContext.Provider value={{
      posts,
      setPosts,
      addPost,
      updatePost,
      resetAllPosts,
      comments,
      setComments,
      addComment,
      getCommentsByPostId,
      stories,
      setStories,
      addStory,
      currentUser,
      setCurrentUser,
      isLoading,
      setIsLoading,
      analyticsData,
      setAnalyticsData,
      isLiveStreamActive,
      setIsLiveStreamActive,
      liveViewers,
      setLiveViewers,
      subscriptions,
      subscribeToUser,
      unsubscribeFromUser,
      refreshPosts,
      settings,
      updateSettings
    }}>
      {children}
    </SocialContext.Provider>
  );
}
