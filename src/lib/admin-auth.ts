'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from './supabase-client';

// Initial admin user
const INITIAL_ADMIN = {
  username: 'Qais',
  // This is already hashed for security, equivalent to 'Dna3@2u'
  passwordHash: '$2b$10$XcNm9AHH9.2Ko9GDZphyX.8.OeSf9oZ1Oix4vXLKH/y5Rd.MGVzIO',
  role: 'superadmin' as 'superadmin',
  email: 'admin@example.com',
  created_at: new Date().toISOString(),
};

// Interface for admin users
export interface AdminUser {
  id?: string;
  username: string;
  passwordHash: string;
  role: 'admin' | 'superadmin';
  email: string;
  created_at: string;
  created_by?: string;
  last_login?: string;
}

// Admin auth state
interface AdminAuthState {
  currentUser: AdminUser | null;
  isAuthenticated: boolean;
  users: AdminUser[];
  error: string | null;
  isLoading: boolean;
  isDemoLoginEnabled: boolean;
  
  // Auth actions
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (user: Omit<AdminUser, 'passwordHash' | 'created_at'>, password: string) => Promise<boolean>;
  deleteUser: (username: string) => Promise<boolean>;
  initialize: () => Promise<void>;
  toggleDemoLogin: (enabled: boolean) => void;
}

// Create admin auth store
export const useAdminAuth = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      users: [INITIAL_ADMIN],
      error: null,
      isLoading: false,
      isDemoLoginEnabled: true,
      
      // Initialize admin data
      initialize: async () => {
        try {
          set({ isLoading: true });
          
          // Fallback to local state
          // Nothing to do, we already have the initial admin
          
        } catch (err) {
          console.error('Admin auth initialization error:', err);
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Login function
      login: async (username, password) => {
        try {
          set({ isLoading: true, error: null });
          
          // Check against default superadmin
          if (username === INITIAL_ADMIN.username && password === 'Dna3@2u') {
            const updatedUser = {
              ...INITIAL_ADMIN,
              last_login: new Date().toISOString()
            };
            
            set({
              currentUser: updatedUser,
              isAuthenticated: true,
              error: null
            });
            return true;
          }
          
          // Fallback to local users
          const users = get().users;
          const user = users.find(u => u.username === username);
          
          if (!user) {
            set({ error: 'User not found' });
            return false;
          }
          
          // For demo purposes - check if demo login is enabled
          const isDemoLoginEnabled = get().isDemoLoginEnabled;
          const isDemo = password === 'demo123';
          
          if (!isDemo && password !== 'Dna3@2u') {
            set({ error: 'Invalid password' });
            return false;
          }
          
          if (isDemo && !isDemoLoginEnabled) {
            set({ error: 'Demo login has been disabled by administrator' });
            return false;
          }
          
          // Login successful
          const updatedUser = {
            ...user,
            last_login: new Date().toISOString()
          };
          
          set({
            currentUser: updatedUser,
            isAuthenticated: true,
            error: null
          });
          
          return true;
        } catch (err) {
          console.error('Login error:', err);
          set({ error: 'Login failed. Please try again.' });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Logout function
      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },
      
      // Add new admin user (only superadmin can do this)
      addUser: async (userData, password) => {
        try {
          set({ isLoading: true, error: null });
          
          const currentUser = get().currentUser;
          
          // Check if current user is superadmin
          if (!currentUser || currentUser.role !== 'superadmin') {
            set({ error: 'Only superadmins can add users' });
            return false;
          }
          
          // Check if username is already taken
          const users = get().users;
          if (users.some(user => user.username === userData.username)) {
            set({ error: 'Username already exists' });
            return false;
          }
          
          // Create new user (no real hashing for demo)
          const newUser: AdminUser = {
            username: userData.username,
            passwordHash: 'demo-hash', // In real app, would hash the password
            role: userData.role,
            email: userData.email,
            created_at: new Date().toISOString(),
            created_by: currentUser.username,
          };
          
          // Update local state
          set({ users: [...users, newUser] });
          return true;
        } catch (err) {
          console.error('Error adding user:', err);
          set({ error: 'Failed to add user' });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Delete user (only superadmin can do this)
      deleteUser: async (username) => {
        try {
          set({ isLoading: true, error: null });
          
          const currentUser = get().currentUser;
          
          // Check if current user is superadmin
          if (!currentUser || currentUser.role !== 'superadmin') {
            set({ error: 'Only superadmins can delete users' });
            return false;
          }
          
          // Cannot delete superadmin or yourself
          if (username === 'Qais' || username === currentUser.username) {
            set({ error: 'Cannot delete this user' });
            return false;
          }
          
          // Update local state
          const users = get().users;
          const updatedUsers = users.filter(user => user.username !== username);
          set({ users: updatedUsers });
          
          return true;
        } catch (err) {
          console.error('Error deleting user:', err);
          set({ error: 'Failed to delete user' });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Toggle demo login
      toggleDemoLogin: (enabled) => {
        set({ isDemoLoginEnabled: enabled });
      }
    }),
    {
      name: 'admin-auth-store',
    }
  )
);
