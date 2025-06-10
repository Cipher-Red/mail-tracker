'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'new_return' | 'status_change' | 'urgent_issue' | 'arrival_due' | 'inspection_due';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  partId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  data?: any;
}

export interface ToastNotification {
  id: string;
  type: 'new_return' | 'status_change' | 'urgent_issue' | 'arrival_due' | 'inspection_due';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationState {
  notifications: Notification[];
  toastNotifications: ToastNotification[];
  unreadCount: number;
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  addToastNotification: (notification: Omit<ToastNotification, 'id'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  removeToastNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      toastNotifications: [],
      unreadCount: 0,
      
      addNotification: (notificationData) => {
        const notification: Notification = {
          ...notificationData,
          id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          read: false
        };
        
        set(state => ({
          notifications: [notification, ...state.notifications.slice(0, 49)], // Keep only last 50
          unreadCount: state.unreadCount + 1
        }));
        
        // Also add as toast notification for immediate visibility
        get().addToastNotification({
          type: notification.type,
          title: notification.title,
          message: notification.message,
          priority: notification.priority
        });
      },
      
      addToastNotification: (notificationData) => {
        const toastNotification: ToastNotification = {
          ...notificationData,
          id: `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        
        set(state => ({
          toastNotifications: [...state.toastNotifications, toastNotification]
        }));
      },
      
      markAsRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1)
        }));
      },
      
      markAllAsRead: () => {
        set(state => ({
          notifications: state.notifications.map(n => ({ ...n, read: true })),
          unreadCount: 0
        }));
      },
      
      removeNotification: (id) => {
        set(state => {
          const notification = state.notifications.find(n => n.id === id);
          const wasUnread = notification && !notification.read;
          
          return {
            notifications: state.notifications.filter(n => n.id !== id),
            unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
          };
        });
      },
      
      removeToastNotification: (id) => {
        set(state => ({
          toastNotifications: state.toastNotifications.filter(n => n.id !== id)
        }));
      },
      
      clearAllNotifications: () => {
        set({
          notifications: [],
          toastNotifications: [],
          unreadCount: 0
        });
      }
    }),
    {
      name: 'notification-store',
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount
      })
    }
  )
);
