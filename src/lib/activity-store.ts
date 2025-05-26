'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { logActivity as logActivityToStorage } from './supabase-client';

// Activity log interface
export interface ActivityLog {
  id?: string;
  user_id: string;
  user_email: string;
  action: string;
  details: Record<string, any>;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: string;
}

// Activity tracking state
interface ActivityState {
  logs: ActivityLog[];
  isTracking: boolean;
  
  // Actions
  trackActivity: (action: string, details?: Record<string, any>) => void;
  clearLogs: () => void;
  fetchAllLogs: () => Promise<void>;
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set, get) => ({
      logs: [],
      isTracking: true,
      
      trackActivity: (action, details = {}) => {
        // Only track if tracking is enabled
        if (!get().isTracking) return;
        
        try {
          // Gather context info
          const contextDetails = {
            ...details,
            user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
            timestamp: new Date().toISOString(),
          };
          
          // Create activity log
          const activityLog: ActivityLog = {
            id: `local-${Date.now()}`,
            user_id: 'anonymous', // We don't have user auth in the main app
            user_email: 'anonymous',
            action,
            details: contextDetails,
            created_at: new Date().toISOString(),
          };
          
          // Update local state
          set(state => ({
            logs: [activityLog, ...state.logs.slice(0, 999)] // Keep last 1000 logs locally
          }));
          
          // Log to storage mock
          logActivityToStorage(action, contextDetails);
        } catch (err) {
          console.error('Error tracking activity:', err);
        }
      },
      
      clearLogs: () => {
        set({ logs: [] });
      },
      
      fetchAllLogs: async () => {
        // Just return the logs we already have in local state
        // In a real app, this would fetch from an API
        return Promise.resolve();
      }
    }),
    {
      name: 'activity-logs-store',
    }
  )
);
