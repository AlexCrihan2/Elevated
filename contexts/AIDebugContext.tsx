// AI Debug Context - Platform Intelligence Management
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { aiDebugService, DebugSession, PlatformHealth } from '@/services/aiDebugService';

interface AIDebugContextType {
  // Debug State
  debugSessions: DebugSession[];
  platformHealth: PlatformHealth | null;
  isMonitoring: boolean;
  autoFixEnabled: boolean;
  
  // Loading States
  loading: boolean;
  
  // Actions
  reportIssue: (description: string, type?: DebugSession['type']) => Promise<string>;
  retryFix: (sessionId: string) => Promise<boolean>;
  clearResolvedSessions: () => void;
  toggleAutoFix: (enabled: boolean) => void;
  toggleMonitoring: (enabled: boolean) => void;
  refreshData: () => Promise<void>;
  
  // Health Monitoring
  getSystemHealth: () => Promise<PlatformHealth>;
  checkConnections: () => Promise<boolean>;
}

const AIDebugContext = createContext<AIDebugContextType | undefined>(undefined);

export function AIDebugProvider({ children }: { children: ReactNode }) {
  const [debugSessions, setDebugSessions] = useState<DebugSession[]>([]);
  const [platformHealth, setPlatformHealth] = useState<PlatformHealth | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [autoFixEnabled, setAutoFixEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  // Initialize AI debug system
  useEffect(() => {
    initializeDebugSystem();
    
    // Set up periodic health checks
    const healthCheckInterval = setInterval(async () => {
      try {
        const health = await aiDebugService.assessPlatformHealth();
        setPlatformHealth(health);
      } catch (error) {
        console.error('Health check failed:', error);
      }
    }, 30000); // Every 30 seconds

    // Set up debug session monitoring
    const sessionCheckInterval = setInterval(() => {
      const sessions = aiDebugService.getDebugSessions(100);
      setDebugSessions(sessions);
    }, 5000); // Every 5 seconds

    return () => {
      clearInterval(healthCheckInterval);
      clearInterval(sessionCheckInterval);
    };
  }, []);

  const initializeDebugSystem = async () => {
    setLoading(true);
    try {
      // Load initial data
      const sessions = aiDebugService.getDebugSessions(50);
      const health = await aiDebugService.assessPlatformHealth();
      
      setDebugSessions(sessions);
      setPlatformHealth(health);

      // Set initial configurations
      aiDebugService.toggleAutoFix(autoFixEnabled);
      aiDebugService.toggleMonitoring(isMonitoring);

      console.log('🤖 AI Debug System initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AI Debug System:', error);
      
      // Report the initialization failure
      await aiDebugService.captureError({
        type: 'system',
        severity: 'high',
        source: 'AI Debug System',
        description: 'Failed to initialize debug system',
        context: { error: error.message }
      });
    } finally {
      setLoading(false);
    }
  };

  const reportIssue = async (description: string, type: DebugSession['type'] = 'user_issue'): Promise<string> => {
    try {
      const sessionId = await aiDebugService.reportIssue(description, type);
      
      // Refresh sessions to show the new issue
      const sessions = aiDebugService.getDebugSessions(100);
      setDebugSessions(sessions);
      
      return sessionId;
    } catch (error) {
      console.error('Failed to report issue:', error);
      throw error;
    }
  };

  const retryFix = async (sessionId: string): Promise<boolean> => {
    try {
      const result = await aiDebugService.retryFix(sessionId);
      
      // Refresh sessions to show updated status
      const sessions = aiDebugService.getDebugSessions(100);
      setDebugSessions(sessions);
      
      return result;
    } catch (error) {
      console.error('Failed to retry fix:', error);
      return false;
    }
  };

  const clearResolvedSessions = () => {
    try {
      aiDebugService.clearResolvedSessions();
      
      // Refresh sessions to reflect changes
      const sessions = aiDebugService.getDebugSessions(100);
      setDebugSessions(sessions);
    } catch (error) {
      console.error('Failed to clear resolved sessions:', error);
    }
  };

  const toggleAutoFix = (enabled: boolean) => {
    try {
      setAutoFixEnabled(enabled);
      aiDebugService.toggleAutoFix(enabled);
      
      console.log(`🔧 Auto-fix ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Failed to toggle auto-fix:', error);
    }
  };

  const toggleMonitoring = (enabled: boolean) => {
    try {
      setIsMonitoring(enabled);
      aiDebugService.toggleMonitoring(enabled);
      
      console.log(`👁️ Monitoring ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Failed to toggle monitoring:', error);
    }
  };

  const refreshData = async () => {
    try {
      const sessions = aiDebugService.getDebugSessions(100);
      const health = await aiDebugService.assessPlatformHealth();
      
      setDebugSessions(sessions);
      setPlatformHealth(health);
    } catch (error) {
      console.error('Failed to refresh debug data:', error);
    }
  };

  const getSystemHealth = async (): Promise<PlatformHealth> => {
    try {
      const health = await aiDebugService.assessPlatformHealth();
      setPlatformHealth(health);
      return health;
    } catch (error) {
      console.error('Failed to get system health:', error);
      throw error;
    }
  };

  const checkConnections = async (): Promise<boolean> => {
    try {
      // Simulate connection check
      const testRequests = [
        fetch('/api/health-check').catch(() => ({ ok: false })),
        // Add more connection tests as needed
      ];

      const results = await Promise.allSettled(testRequests);
      const successfulRequests = results.filter(result => 
        result.status === 'fulfilled' && result.value.ok
      );

      const connectionHealth = successfulRequests.length / testRequests.length;
      
      if (connectionHealth < 0.5) {
        await reportIssue('Connection health degraded', 'connection');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Connection check failed:', error);
      await reportIssue('Connection check failed', 'connection');
      return false;
    }
  };

  const value: AIDebugContextType = {
    // State
    debugSessions,
    platformHealth,
    isMonitoring,
    autoFixEnabled,
    loading,
    
    // Actions
    reportIssue,
    retryFix,
    clearResolvedSessions,
    toggleAutoFix,
    toggleMonitoring,
    refreshData,
    
    // Health
    getSystemHealth,
    checkConnections
  };

  return (
    <AIDebugContext.Provider value={value}>
      {children}
    </AIDebugContext.Provider>
  );
}

export function useAIDebug() {
  const context = useContext(AIDebugContext);
  if (!context) {
    throw new Error('useAIDebug must be used within AIDebugProvider');
  }
  return context;
}