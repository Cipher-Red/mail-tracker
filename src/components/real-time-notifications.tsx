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
  return <div className="relative" data-unique-id="d445aed5-52a4-4c16-93e0-881d3c71e15f" data-file-name="components/real-time-notifications.tsx" data-dynamic-text="true">
      {/* Notification Bell */}
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-full hover:bg-gray-100 transition-colors" data-unique-id="c7a48b80-0911-4647-8b11-309967857643" data-file-name="components/real-time-notifications.tsx" data-dynamic-text="true">
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && <motion.span initial={{
        scale: 0
      }} animate={{
        scale: 1
      }} className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium" data-unique-id="358a02a9-5cb5-4df5-b554-02a4082eec6b" data-file-name="components/real-time-notifications.tsx" data-dynamic-text="true">
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>}
      </button>

      {/* Notifications Panel */}
      <AnimatePresence>
        {isOpen && <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} data-unique-id="6823fed7-2b90-4b89-9934-c6800bdf2741" data-file-name="components/real-time-notifications.tsx" />
            
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
        }} className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden" data-unique-id="9b6b580e-2a12-4359-aaa7-83e9a6e52fd5" data-file-name="components/real-time-notifications.tsx" data-dynamic-text="true">
              {/* Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between" data-unique-id="5b5c778d-0194-4868-8794-79db54909a9a" data-file-name="components/real-time-notifications.tsx">
                <h3 className="font-semibold text-gray-900" data-unique-id="ef495b18-4970-4304-ac91-5e0a07d699c6" data-file-name="components/real-time-notifications.tsx"><span className="editable-text" data-unique-id="4eff24ce-2ee2-4ca0-b674-2cfd3af5fac5" data-file-name="components/real-time-notifications.tsx">Notifications</span></h3>
                <div className="flex items-center space-x-2" data-unique-id="109a755d-705c-436f-953f-42a2d0226db4" data-file-name="components/real-time-notifications.tsx" data-dynamic-text="true">
                  {unreadCount > 0 && <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:text-blue-800" data-unique-id="7e3e7f64-6fc9-4ff6-8c4c-8c22fb299d3d" data-file-name="components/real-time-notifications.tsx"><span className="editable-text" data-unique-id="c1f8e470-c1b2-4a70-b857-202a9e829cfd" data-file-name="components/real-time-notifications.tsx">
                      Mark all read
                    </span></button>}
                  <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-gray-100" data-unique-id="394c499b-0303-418d-b292-c4aa7e804365" data-file-name="components/real-time-notifications.tsx">
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto" data-unique-id="fb02e75b-55c1-44ec-913a-77607e653e2f" data-file-name="components/real-time-notifications.tsx" data-dynamic-text="true">
                {notifications.length === 0 ? <div className="p-8 text-center text-gray-500" data-unique-id="4381d24b-a964-494e-bd50-801ff940fc1d" data-file-name="components/real-time-notifications.tsx">
                    <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm" data-unique-id="45f33f1c-b064-413e-a2e0-039a42a4d1a4" data-file-name="components/real-time-notifications.tsx"><span className="editable-text" data-unique-id="9bc7db0c-731f-4a11-8714-c4c0f05b71e4" data-file-name="components/real-time-notifications.tsx">No notifications yet</span></p>
                  </div> : <div className="divide-y divide-gray-100" data-unique-id="c61f6d80-8027-4ae3-8a6c-f74f60984573" data-file-name="components/real-time-notifications.tsx" data-dynamic-text="true">
                    {notifications.map(notification => <motion.div key={notification.id} initial={{
                opacity: 0,
                x: 20
              }} animate={{
                opacity: 1,
                x: 0
              }} className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50' : ''}`} onClick={() => {
                markAsRead(notification.id);
                onNotificationClick?.(notification);
              }} data-unique-id="bc79a710-23ca-43e7-b796-abfbd0dc6465" data-file-name="components/real-time-notifications.tsx">
                        <div className="flex items-start space-x-3" data-unique-id="fea3923b-7632-4019-8b63-ba20b967e820" data-file-name="components/real-time-notifications.tsx" data-dynamic-text="true">
                          <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`} data-unique-id="5a02b2db-0e43-4b29-956d-8b51823d835c" data-file-name="components/real-time-notifications.tsx" data-dynamic-text="true">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0" data-unique-id="1d2855c6-721a-4dc7-9473-ab3ab33e3f56" data-file-name="components/real-time-notifications.tsx">
                            <div className="flex items-center justify-between" data-unique-id="409ca19b-ff1b-4044-9b8d-f0ad120c31ed" data-file-name="components/real-time-notifications.tsx">
                              <p className="text-sm font-medium text-gray-900 truncate" data-unique-id="49b93956-34c8-4887-9b95-2ca0b4ff5791" data-file-name="components/real-time-notifications.tsx" data-dynamic-text="true">
                                {notification.title}
                              </p>
                              <button onClick={e => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }} className="p-1 rounded-full hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity" data-unique-id="e622583b-6779-4abc-ab57-458483cb641a" data-file-name="components/real-time-notifications.tsx">
                                <X className="h-3 w-3 text-gray-400" />
                              </button>
                            </div>
                            <p className="text-sm text-gray-600 mt-1" data-unique-id="7525f431-61f5-42e2-b2fd-495fe9035989" data-file-name="components/real-time-notifications.tsx" data-dynamic-text="true">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1" data-unique-id="48e80a1a-9933-4f43-b6d1-0c9810c0b2be" data-file-name="components/real-time-notifications.tsx" data-dynamic-text="true">
                              {formatTimestamp(notification.timestamp)}
                            </p>
                          </div>
                          {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" data-unique-id="e91f07b6-6753-40c7-8896-fa13ee18e85f" data-file-name="components/real-time-notifications.tsx" />}
                        </div>
                      </motion.div>)}
                  </div>}
              </div>
            </motion.div>
          </>}
      </AnimatePresence>
    </div>;
}