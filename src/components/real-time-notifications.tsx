'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Package2, AlertTriangle, CheckCircle, Clock, Truck } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { useNotificationStore } from '@/lib/notification-store';
interface RealTimeNotificationsProps {
  onNotificationClick?: (notification: any) => void;
}
export default function RealTimeNotifications({
  onNotificationClick
}: RealTimeNotificationsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification
  } = useNotificationStore();

  // Set up real-time subscription for returned parts changes
  useEffect(() => {
    if (!supabase) return;
    const channel = supabase.channel('returned_parts_changes').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'returned_parts'
    }, payload => {
      // Handle real-time changes here
      console.log('Real-time change detected:', payload);
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_return':
        return <Package2 className="h-4 w-4" />;
      case 'status_change':
        return <CheckCircle className="h-4 w-4" />;
      case 'urgent_issue':
        return <AlertTriangle className="h-4 w-4" />;
      case 'arrival_due':
        return <Truck className="h-4 w-4" />;
      case 'inspection_due':
        return <Clock className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };
  return <div className="relative" data-unique-id="cb3b333c-b0f9-4ef8-8318-293e34cfe236" data-file-name="components/real-time-notifications.tsx" data-dynamic-text="true">
      {/* Notification Bell */}
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-full hover:bg-gray-100 transition-colors" data-unique-id="63848d32-82fd-44db-abec-fcb0361b5747" data-file-name="components/real-time-notifications.tsx" data-dynamic-text="true">
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && <motion.span initial={{
        scale: 0
      }} animate={{
        scale: 1
      }} className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium" data-unique-id="1134176c-5a4e-494f-aecc-74a4437ecc09" data-file-name="components/real-time-notifications.tsx" data-dynamic-text="true">
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>}
      </button>

      {/* Notifications Panel */}
      <AnimatePresence>
        {isOpen && <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} data-unique-id="d26bc293-7dc1-421c-b796-e6c595a34155" data-file-name="components/real-time-notifications.tsx" />
            
            {/* Panel */}
            <motion.div initial={{
          opacity: 0,
          scale: 0.95,
          y: -10
        }} animate={{
          opacity: 1,
          scale: 1,
          y: 0
        }} exit={{
          opacity: 0,
          scale: 0.95,
          y: -10
        }} className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden" data-unique-id="1f45fcd4-c3ac-4651-aee3-2625fe0ba877" data-file-name="components/real-time-notifications.tsx" data-dynamic-text="true">
              {/* Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between" data-unique-id="756f332a-9176-4935-b2a3-b80d6ad75bf2" data-file-name="components/real-time-notifications.tsx">
                <h3 className="font-semibold text-gray-900" data-unique-id="be97b2bc-ec6d-4180-b552-16d297c0e8ee" data-file-name="components/real-time-notifications.tsx"><span className="editable-text" data-unique-id="7c096b2f-4d57-4f4c-8baf-71ba79c12dfa" data-file-name="components/real-time-notifications.tsx">Notifications</span></h3>
                <div className="flex items-center space-x-2" data-unique-id="a537e69c-d0e2-4e90-a8e5-21c5a9dcba67" data-file-name="components/real-time-notifications.tsx" data-dynamic-text="true">
                  {unreadCount > 0 && <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:text-blue-800" data-unique-id="f6195473-0b43-4438-9a9a-49e52f0b4d6c" data-file-name="components/real-time-notifications.tsx"><span className="editable-text" data-unique-id="5c0ddd0f-9aac-478d-9e2d-b183233807ec" data-file-name="components/real-time-notifications.tsx">
                      Mark all read
                    </span></button>}
                  <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-gray-100" data-unique-id="d371c29a-b0cc-444a-92e1-cf0a5bd1e318" data-file-name="components/real-time-notifications.tsx">
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto" data-unique-id="56627425-c81d-4263-bb6b-fc13a4a8e06d" data-file-name="components/real-time-notifications.tsx" data-dynamic-text="true">
                {notifications.length === 0 ? <div className="p-8 text-center text-gray-500" data-unique-id="c4c4cd1f-7ed3-4aad-8e87-e12c9ad74d79" data-file-name="components/real-time-notifications.tsx">
                    <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm" data-unique-id="2cdcd996-4961-4bee-90e5-c93115db764c" data-file-name="components/real-time-notifications.tsx"><span className="editable-text" data-unique-id="d100c292-904b-4849-b26e-846b650cd021" data-file-name="components/real-time-notifications.tsx">No notifications yet</span></p>
                  </div> : <div className="divide-y divide-gray-100" data-unique-id="c7293fe5-1f6e-4261-9177-a489f6fd25c8" data-file-name="components/real-time-notifications.tsx" data-dynamic-text="true">
                    {notifications.map(notification => <motion.div key={notification.id} initial={{
                opacity: 0,
                x: 20
              }} animate={{
                opacity: 1,
                x: 0
              }} className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50' : ''}`} onClick={() => {
                markAsRead(notification.id);
                onNotificationClick?.(notification);
              }} data-unique-id="45ccb4e9-16e6-4e91-aa00-ecfafd46c894" data-file-name="components/real-time-notifications.tsx">
                        <div className="flex items-start space-x-3" data-unique-id="a4d85fb2-9613-4efc-9c12-ea4935860746" data-file-name="components/real-time-notifications.tsx" data-dynamic-text="true">
                          <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`} data-unique-id="27ea8ac6-d2a1-4e8e-8cc7-967e908a7f5b" data-file-name="components/real-time-notifications.tsx" data-dynamic-text="true">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0" data-unique-id="8a709407-58de-480a-951e-ffadb8874ca8" data-file-name="components/real-time-notifications.tsx">
                            <div className="flex items-center justify-between" data-unique-id="d58f4446-0f66-4650-adef-84e8ec7a40db" data-file-name="components/real-time-notifications.tsx">
                              <p className="text-sm font-medium text-gray-900 truncate" data-unique-id="abcee878-2a5b-41f4-92a2-feafbab72d0b" data-file-name="components/real-time-notifications.tsx" data-dynamic-text="true">
                                {notification.title}
                              </p>
                              <button onClick={e => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }} className="p-1 rounded-full hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity" data-unique-id="92c28bfa-da2d-45a6-9a45-0c00614f8beb" data-file-name="components/real-time-notifications.tsx">
                                <X className="h-3 w-3 text-gray-400" />
                              </button>
                            </div>
                            <p className="text-sm text-gray-600 mt-1" data-unique-id="76979bf7-6cc8-4101-b7ee-9ab85bd7e590" data-file-name="components/real-time-notifications.tsx" data-dynamic-text="true">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1" data-unique-id="06a27f29-1ec3-4a8b-94c3-e2f800a8bca1" data-file-name="components/real-time-notifications.tsx" data-dynamic-text="true">
                              {formatTimestamp(notification.timestamp)}
                            </p>
                          </div>
                          {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" data-unique-id="94848fdc-dfd5-4a3d-bd67-0ba7601fa8e7" data-file-name="components/real-time-notifications.tsx" />}
                        </div>
                      </motion.div>)}
                  </div>}
              </div>
            </motion.div>
          </>}
      </AnimatePresence>
    </div>;
}