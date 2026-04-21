
// AI Debug Hook - Platform Intelligence Access
import { useContext } from 'react';
import { AIDebugContext } from '@/contexts/AIDebugContext';

export function useAIDebug() {
  const context = useContext(AIDebugContext);
  if (!context) {
    throw new Error('useAIDebug must be used within AIDebugProvider');
  }
  return context;
}
