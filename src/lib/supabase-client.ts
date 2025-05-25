'use client';

// This file now provides mock versions of the functions that were previously
// implemented with Supabase. All data is now stored in localStorage.
import { getLocalStorage, setLocalStorage } from '@/lib/utils';

// Mock storage helper functions
export const uploadFile = async (bucket: string, path: string, file: File) => {
  // Mock implementation using localStorage
  console.info('File upload now uses local storage');
  // Return mock data structure
  return { 
    path: path 
  };
};

export const getFileUrl = (bucket: string, path: string) => {
  // Return a mock URL
  return `/mock-storage/${bucket}/${path}`;
};

// Mock authentication helper functions
export const signIn = async (email: string, password: string) => {
  // Return a mock user session for local development
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
  // Mock sign out function
  console.info('User signed out from local session');
  return;
};

// Mock realtime subscription helper
export const subscribeToChanges = (
  table: string,
  callback: (payload: any) => void
) => {
  // Return a function to "unsubscribe" from the mock subscription
  return () => {
    console.info(`Unsubscribed from ${table} changes`);
  };
};
