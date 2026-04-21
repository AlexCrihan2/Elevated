// Connection Service - Spider Web Platform Connections
export interface Connection {
  id: string;
  fromUserId: string;
  toUserId: string;
  type: 'follow' | 'friend' | 'collaborate' | 'mentor' | 'student';
  status: 'pending' | 'accepted' | 'blocked';
  strength: number; // 1-100 connection strength
  createdAt: string;
  lastInteraction: string;
  metadata?: {
    mutualConnections?: number;
    sharedInterests?: string[];
    interactionScore?: number;
  };
}

export interface UserNetworkStats {
  totalConnections: number;
  connectionsByType: Record<string, number>;
  networkReach: number;
  influenceScore: number;
  mutualConnections: Connection[];
  suggestedConnections: Connection[];
}

export interface PlatformSpiderStats {
  totalUsers: number;
  totalConnections: number;
  averageConnections: number;
  networkDensity: number;
  clusteringCoefficient: number;
  strongestNodes: Array<{userId: string, connections: number, influence: number}>;
  weakestLinks: Array<{connectionId: string, strength: number}>;
  networkHealth: 'excellent' | 'good' | 'fair' | 'poor';
}

class ConnectionService {
  // Mock data for spider web connections
  private connections: Connection[] = [
    {
      id: 'conn_1',
      fromUserId: 'user_1',
      toUserId: 'user_2',
      type: 'follow',
      status: 'accepted',
      strength: 85,
      createdAt: new Date().toISOString(),
      lastInteraction: new Date().toISOString(),
      metadata: { mutualConnections: 12, sharedInterests: ['tech', 'news'], interactionScore: 78 }
    },
    {
      id: 'conn_2',
      fromUserId: 'user_1',
      toUserId: 'user_3',
      type: 'friend',
      status: 'accepted',
      strength: 92,
      createdAt: new Date().toISOString(),
      lastInteraction: new Date().toISOString(),
      metadata: { mutualConnections: 25, sharedInterests: ['music', 'travel'], interactionScore: 89 }
    },
    {
      id: 'conn_3',
      fromUserId: 'user_2',
      toUserId: 'user_4',
      type: 'collaborate',
      status: 'accepted',
      strength: 76,
      createdAt: new Date().toISOString(),
      lastInteraction: new Date().toISOString(),
      metadata: { mutualConnections: 8, sharedInterests: ['business', 'tech'], interactionScore: 65 }
    },
    {
      id: 'conn_4',
      fromUserId: 'user_3',
      toUserId: 'user_5',
      type: 'mentor',
      status: 'accepted',
      strength: 94,
      createdAt: new Date().toISOString(),
      lastInteraction: new Date().toISOString(),
      metadata: { mutualConnections: 15, sharedInterests: ['education', 'career'], interactionScore: 95 }
    },
    {
      id: 'conn_5',
      fromUserId: 'user_4',
      toUserId: 'user_1',
      type: 'follow',
      status: 'pending',
      strength: 0,
      createdAt: new Date().toISOString(),
      lastInteraction: new Date().toISOString(),
      metadata: { mutualConnections: 3, sharedInterests: ['sports'], interactionScore: 45 }
    }
  ];

  // Create new connection
  async createConnection(fromUserId: string, toUserId: string, type: Connection['type']): Promise<{data: Connection | null, error: string | null}> {
    try {
      const newConnection: Connection = {
        id: `conn_${Date.now()}`,
        fromUserId,
        toUserId,
        type,
        status: 'pending',
        strength: 0,
        createdAt: new Date().toISOString(),
        lastInteraction: new Date().toISOString(),
        metadata: { mutualConnections: Math.floor(Math.random() * 20), sharedInterests: [], interactionScore: 0 }
      };
      
      this.connections.push(newConnection);
      return { data: newConnection, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to create connection' };
    }
  }

  // Accept/reject connection
  async updateConnectionStatus(connectionId: string, status: Connection['status']): Promise<{error: string | null}> {
    try {
      const connection = this.connections.find(c => c.id === connectionId);
      if (connection) {
        connection.status = status;
        if (status === 'accepted') {
          connection.strength = Math.floor(Math.random() * 50) + 50; // 50-100 for accepted
        }
      }
      return { error: null };
    } catch (error) {
      return { error: 'Failed to update connection status' };
    }
  }

  // Get user's network stats
  async getUserNetworkStats(userId: string): Promise<{data: UserNetworkStats | null, error: string | null}> {
    try {
      const userConnections = this.connections.filter(c => 
        (c.fromUserId === userId || c.toUserId === userId) && c.status === 'accepted'
      );

      const connectionsByType = userConnections.reduce((acc, conn) => {
        acc[conn.type] = (acc[conn.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const mutualConnections = this.connections.filter(c => 
        c.metadata?.mutualConnections && c.metadata.mutualConnections > 10
      );

      const suggestedConnections = this.connections.filter(c => 
        c.status === 'pending' || (c.fromUserId !== userId && c.toUserId !== userId)
      ).slice(0, 10);

      const stats: UserNetworkStats = {
        totalConnections: userConnections.length,
        connectionsByType,
        networkReach: userConnections.reduce((sum, c) => sum + (c.metadata?.mutualConnections || 0), 0),
        influenceScore: Math.floor(userConnections.reduce((sum, c) => sum + c.strength, 0) / Math.max(userConnections.length, 1)),
        mutualConnections: mutualConnections.slice(0, 5),
        suggestedConnections: suggestedConnections.slice(0, 8)
      };

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to get network stats' };
    }
  }

  // Get platform spider web stats
  async getPlatformSpiderStats(): Promise<{data: PlatformSpiderStats | null, error: string | null}> {
    try {
      const totalUsers = 50000; // Mock total users
      const totalConnections = this.connections.filter(c => c.status === 'accepted').length;
      const averageConnections = totalConnections / totalUsers * 1000; // Scaled for demo

      // Calculate network health based on connection density and activity
      const networkDensity = (totalConnections * 2) / (totalUsers * (totalUsers - 1)) * 1000000; // Scaled
      const clusteringCoefficient = Math.random() * 0.3 + 0.2; // 0.2-0.5 realistic range

      let networkHealth: PlatformSpiderStats['networkHealth'] = 'excellent';
      if (networkDensity < 0.1) networkHealth = 'poor';
      else if (networkDensity < 0.3) networkHealth = 'fair';
      else if (networkDensity < 0.6) networkHealth = 'good';

      const strongestNodes = [
        { userId: 'user_influencer_1', connections: 15420, influence: 94 },
        { userId: 'user_celebrity_1', connections: 12890, influence: 91 },
        { userId: 'user_expert_1', connections: 8760, influence: 88 },
        { userId: 'user_creator_1', connections: 6540, influence: 85 },
        { userId: 'user_mentor_1', connections: 4320, influence: 82 }
      ];

      const weakestLinks = this.connections
        .filter(c => c.strength < 30)
        .map(c => ({ connectionId: c.id, strength: c.strength }))
        .slice(0, 5);

      const stats: PlatformSpiderStats = {
        totalUsers,
        totalConnections,
        averageConnections,
        networkDensity,
        clusteringCoefficient,
        strongestNodes,
        weakestLinks,
        networkHealth
      };

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to get platform spider stats' };
    }
  }

  // Get connection suggestions
  async getConnectionSuggestions(userId: string): Promise<{data: Connection[], error: string | null}> {
    try {
      // Mock suggestions based on mutual connections and shared interests
      const suggestions = Array.from({ length: 12 }, (_, i) => ({
        id: `suggestion_${i}`,
        fromUserId: userId,
        toUserId: `suggested_user_${i}`,
        type: ['follow', 'friend', 'collaborate'][Math.floor(Math.random() * 3)] as Connection['type'],
        status: 'pending' as Connection['status'],
        strength: Math.floor(Math.random() * 40) + 60,
        createdAt: new Date().toISOString(),
        lastInteraction: new Date().toISOString(),
        metadata: {
          mutualConnections: Math.floor(Math.random() * 15) + 5,
          sharedInterests: ['technology', 'business', 'travel', 'music'].slice(0, Math.floor(Math.random() * 3) + 1),
          interactionScore: Math.floor(Math.random() * 30) + 70
        }
      }));

      return { data: suggestions, error: null };
    } catch (error) {
      return { data: [], error: 'Failed to get suggestions' };
    }
  }

  // Search connections
  async searchConnections(query: string, filters?: { type?: string, status?: string }): Promise<{data: Connection[], error: string | null}> {
    try {
      let results = [...this.connections];

      if (filters?.type) {
        results = results.filter(c => c.type === filters.type);
      }

      if (filters?.status) {
        results = results.filter(c => c.status === filters.status);
      }

      // Mock search by user ID or connection strength
      if (query) {
        results = results.filter(c => 
          c.fromUserId.toLowerCase().includes(query.toLowerCase()) ||
          c.toUserId.toLowerCase().includes(query.toLowerCase()) ||
          c.type.toLowerCase().includes(query.toLowerCase())
        );
      }

      return { data: results, error: null };
    } catch (error) {
      return { data: [], error: 'Search failed' };
    }
  }

  // Analyze connection patterns
  async analyzeConnectionPatterns(): Promise<{data: any, error: string | null}> {
    try {
      const patterns = {
        mostActiveHours: ['9AM-11AM', '2PM-4PM', '7PM-9PM'],
        popularConnectionTypes: {
          follow: 45,
          friend: 30,
          collaborate: 15,
          mentor: 7,
          student: 3
        },
        geographicDistribution: {
          'North America': 35,
          'Europe': 28,
          'Asia': 22,
          'South America': 8,
          'Africa': 4,
          'Oceania': 3
        },
        growthTrends: {
          daily: '+2.4%',
          weekly: '+16.8%',
          monthly: '+67.2%'
        }
      };

      return { data: patterns, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to analyze patterns' };
    }
  }
}

export const connectionService = new ConnectionService();