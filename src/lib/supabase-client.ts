'use client';

import { getLocalStorage, setLocalStorage } from '@/lib/utils';

// Mock Supabase client implementation 
export const supabase = null;

// Storage helper functions that use local storage
export const uploadFile = async (bucket: string, path: string, file: File) => {
  console.info('Mock file upload to local storage');
  return { path }; // Mock return
};

export const getFileUrl = (bucket: string, path: string) => {
  return `/mock-storage/${bucket}/${path}`;
};

// Authentication helper functions
export const signIn = async (email: string, password: string) => {
  // Return mock session for development
  return {
    user: { 
      id: 'local-user', 
      email,
      user_metadata: { name: 'Local User' }
    },
    session: { 
      access_token: 'mock-token',
      expires_at: Date.now() + 3600000 // 1 hour from now
    }
  };
};

export const signOut = async () => {
  console.info('User signed out from mock session');
  return;
};

// Realtime subscription helper
export const subscribeToChanges = (
  table: string,
  callback: (payload: any) => void
) => {
  // Return mock unsubscribe function
  return () => {
    console.info(`Unsubscribed from ${table} changes (mock)`);
  };
};

// Log user activity to localStorage
export const logActivity = async (action: string, details: Record<string, any> = {}) => {
  try {
    // Get current date/time
    const timestamp = new Date().toISOString();
    
    // Create activity log entry
    const logEntry = {
      id: `local-${Date.now()}`,
      user_id: 'local-user',
      user_email: 'anonymous',
      action,
      details,
      ip_address: null,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      created_at: timestamp,
    };
    
    // Store in localStorage
    if (typeof window !== 'undefined') {
      try {
        const existingLogs = getLocalStorage('activity-logs', []);
        existingLogs.unshift(logEntry); // Add to beginning
        const logsToKeep = existingLogs.slice(0, 1000); // Keep last 1000 logs
        setLocalStorage('activity-logs', logsToKeep);
      } catch (err) {
        console.warn('Could not save activity log to localStorage:', err);
      }
    }
    
    // Also log to console in development
    console.info('Activity log:', action, details);
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
};
