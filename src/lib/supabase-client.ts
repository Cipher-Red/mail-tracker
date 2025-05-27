'use client';

import { getLocalStorage, setLocalStorage } from '@/lib/utils';
import { createClient } from '@supabase/supabase-js';

// Initialize supabase client if URL and key are available
let supabaseInstance: any = null;

try {
  // Check if environment variables are available for supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey);
    
    // Create the excel-archives bucket if it doesn't exist
    if (typeof window !== 'undefined') {
      // Only run this in the browser
      (async () => {
        try {
          // First check if bucket exists
          const { data: buckets, error: bucketsError } = await supabaseInstance.storage.listBuckets();
          const bucketExists = buckets?.some((bucket: any) => bucket.name === 'excel-archives');
          
          if (!bucketExists) {
            // Create the bucket if it doesn't exist
            const { data, error } = await supabaseInstance.storage.createBucket('excel-archives', {
              public: false,
              fileSizeLimit: 52428800, // 50MB
            });
            
            if (error) {
              console.error('Error creating bucket:', error);
            } else {
              console.log('Created bucket for excel archives');
            }
            
            // Set bucket public to allow downloads without authentication
            const { error: updateError } = await supabaseInstance.storage.updateBucket('excel-archives', {
              public: true,
            });
            
            if (updateError) {
              console.error('Error making bucket public:', updateError);
            }
          }
        } catch (err) {
          console.error('Error setting up Supabase storage:', err);
        }
      })();
    }
  } else {
    console.warn('Supabase credentials not available. Using mock functionality.');
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
}

export const supabase = supabaseInstance;

// Storage helper functions that use Supabase storage or fallback to local
export const uploadFile = async (bucket: string, path: string, file: File) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file);
      
      if (error) throw error;
      
      return { path: data?.path || path };
    } catch (error) {
      console.error('Supabase storage upload error:', error);
      console.info('Falling back to mock file upload');
      return { path }; // Mock return
    }
  }
  
  console.info('Mock file upload to local storage');
  return { path }; // Mock return
};

export const getFileUrl = (bucket: string, path: string) => {
  if (supabase) {
    try {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);
      
      if (data?.publicUrl) {
        return data.publicUrl;
      }
    } catch (error) {
      console.error('Error getting file URL from Supabase:', error);
    }
  }
  
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
