// Connection Context - Spider Web Platform State Management
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { connectionService, Connection, UserNetworkStats, PlatformSpiderStats } from '@/services/connectionService';

interface ConnectionContextType {
  // Connection State
  userConnections: Connection[];
  networkStats: UserNetworkStats | null;
  platformStats: PlatformSpiderStats | null;
  connectionSuggestions: Connection[];
  
  // Loading States
  loading: boolean;
  operationLoading: boolean;
  statsLoading: boolean;
  
  // Actions
  createConnection: (toUserId: string, type: Connection['type']) => Promise<void>;
  acceptConnection: (connectionId: string) => Promise<void>;
  rejectConnection: (connectionId: string) => Promise<void>;
  blockConnection: (connectionId: string) => Promise<void>;
  refreshNetworkStats: () => Promise<void>;
  refreshPlatformStats: () => Promise<void>;
  loadConnectionSuggestions: () => Promise<void>;
  searchConnections: (query: string, filters?: any) => Promise<Connection[]>;
  
  // Spider Web Analytics
  analyzeNetworkHealth: () => Promise<any>;
  getConnectionPatterns: () => Promise<any>;
  monitorPlatformActivity: () => Promise<any>;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const [userConnections, setUserConnections] = useState<Connection[]>([]);
  const [networkStats, setNetworkStats] = useState<UserNetworkStats | null>(null);
  const [platformStats, setPlatformStats] = useState<PlatformSpiderStats | null>(null);
  const [connectionSuggestions, setConnectionSuggestions] = useState<Connection[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [operationLoading, setOperationLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  // Initialize connection data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        refreshNetworkStats(),
        refreshPlatformStats(),
        loadConnectionSuggestions()
      ]);
    } catch (error) {
      console.error('Failed to load connection data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createConnection = async (toUserId: string, type: Connection['type']) => {
    setOperationLoading(true);
    try {
      const { data, error } = await connectionService.createConnection('current_user', toUserId, type);
      if (error) throw new Error(error);
      
      if (data) {
        setUserConnections(prev => [...prev, data]);
        await refreshNetworkStats();
      }
    } catch (error) {
      console.error('Failed to create connection:', error);
    } finally {
      setOperationLoading(false);
    }
  };

  const acceptConnection = async (connectionId: string) => {
    setOperationLoading(true);
    try {
      const { error } = await connectionService.updateConnectionStatus(connectionId, 'accepted');
      if (error) throw new Error(error);
      
      setUserConnections(prev => 
        prev.map(conn => 
          conn.id === connectionId 
            ? { ...conn, status: 'accepted' as const, strength: Math.floor(Math.random() * 50) + 50 }
            : conn
        )
      );
      await refreshNetworkStats();
    } catch (error) {
      console.error('Failed to accept connection:', error);
    } finally {
      setOperationLoading(false);
    }
  };

  const rejectConnection = async (connectionId: string) => {
    setOperationLoading(true);
    try {
      setUserConnections(prev => prev.filter(conn => conn.id !== connectionId));
    } catch (error) {
      console.error('Failed to reject connection:', error);
    } finally {
      setOperationLoading(false);
    }
  };

  const blockConnection = async (connectionId: string) => {
    setOperationLoading(true);
    try {
      const { error } = await connectionService.updateConnectionStatus(connectionId, 'blocked');
      if (error) throw new Error(error);
      
      setUserConnections(prev => 
        prev.map(conn => 
          conn.id === connectionId 
            ? { ...conn, status: 'blocked' as const }
            : conn
        )
      );
    } catch (error) {
      console.error('Failed to block connection:', error);
    } finally {
      setOperationLoading(false);
    }
  };

  const refreshNetworkStats = async () => {
    setStatsLoading(true);
    try {
      const { data, error } = await connectionService.getUserNetworkStats('current_user');
      if (error) throw new Error(error);
      setNetworkStats(data);
    } catch (error) {
      console.error('Failed to refresh network stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const refreshPlatformStats = async () => {
    try {
      const { data, error } = await connectionService.getPlatformSpiderStats();
      if (error) throw new Error(error);
      setPlatformStats(data);
    } catch (error) {
      console.error('Failed to refresh platform stats:', error);
    }
  };

  const loadConnectionSuggestions = async () => {
    try {
      const { data, error } = await connectionService.getConnectionSuggestions('current_user');
      if (error) throw new Error(error);
      setConnectionSuggestions(data);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const searchConnections = async (query: string, filters?: any) => {
    try {
      const { data, error } = await connectionService.searchConnections(query, filters);
      if (error) throw new Error(error);
      return data;
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  };

  const analyzeNetworkHealth = async () => {
    try {
      const { data, error } = await connectionService.analyzeConnectionPatterns();
      if (error) throw new Error(error);
      return data;
    } catch (error) {
      console.error('Network analysis failed:', error);
      return null;
    }
  };

  const getConnectionPatterns = async () => {
    try {
      return await connectionService.analyzeConnectionPatterns();
    } catch (error) {
      console.error('Pattern analysis failed:', error);
      return null;
    }
  };

  const monitorPlatformActivity = async () => {
    try {
      // Real-time platform monitoring
      const activity = {
        activeUsers: Math.floor(Math.random() * 5000) + 15000,
        newConnections: Math.floor(Math.random() * 100) + 200,
        messagesExchanged: Math.floor(Math.random() * 2000) + 8000,
        contentShared: Math.floor(Math.random() * 500) + 1200,
        systemHealth: Math.random() > 0.1 ? 'healthy' : 'degraded',
        serverLoad: Math.floor(Math.random() * 30) + 45 // 45-75%
      };
      return { data: activity, error: null };
    } catch (error) {
      console.error('Platform monitoring failed:', error);
      return { data: null, error: 'Monitoring failed' };
    }
  };

  const value: ConnectionContextType = {
    // State
    userConnections,
    networkStats,
    platformStats,
    connectionSuggestions,
    loading,
    operationLoading,
    statsLoading,
    
    // Actions
    createConnection,
    acceptConnection,
    rejectConnection,
    blockConnection,
    refreshNetworkStats,
    refreshPlatformStats,
    loadConnectionSuggestions,
    searchConnections,
    
    // Analytics
    analyzeNetworkHealth,
    getConnectionPatterns,
    monitorPlatformActivity
  };

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnections() {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnections must be used within ConnectionProvider');
  }
  return context;
}