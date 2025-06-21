'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Package2, Eye, Clock, X } from 'lucide-react';
interface Notification {
  id: string;
  type: 'arrival' | 'inspection';
  partId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}
interface NotificationCenterProps {
  notifications: Notification[];
}
export default function NotificationCenter({
  notifications
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());
  const unreadCount = notifications.filter(n => !readNotifications.has(n.id)).length;
  const markAsRead = (id: string) => {
    setReadNotifications(prev => new Set([...prev, id]));
  };
  const markAllAsRead = () => {
    setReadNotifications(new Set(notifications.map(n => n.id)));
  };
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'arrival':
        return <Package2 className="h-4 w-4 text-blue-600" />;
      case 'inspection':
        return <Eye className="h-4 w-4 text-purple-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };
  return <div className="relative" data-unique-id="b3e661bc-409b-4019-b536-5f5320ff5ed7" data-file-name="components/notification-center.tsx" data-dynamic-text="true">
      {/* Notification Bell */}
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors" data-unique-id="320aab39-3fbb-423f-b329-5eb9571127b4" data-file-name="components/notification-center.tsx" data-dynamic-text="true">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium" data-unique-id="c9b574bd-7abe-4f1e-91cc-4841aae44aca" data-file-name="components/notification-center.tsx" data-dynamic-text="true">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} data-unique-id="b2e85afe-bbd5-4f00-8992-9792551d5b1f" data-file-name="components/notification-center.tsx" />
            
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
        }} className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden" data-unique-id="8cc4d359-2257-40d4-a3d1-15a80afebabd" data-file-name="components/notification-center.tsx" data-dynamic-text="true">
              {/* Header */}
              <div className="p-4 border-b border-gray-100" data-unique-id="c23cdda0-3dbb-48b7-b625-f7c519a64e81" data-file-name="components/notification-center.tsx">
                <div className="flex items-center justify-between" data-unique-id="830321ea-642b-44b9-a55b-de66765e89f2" data-file-name="components/notification-center.tsx" data-dynamic-text="true">
                  <h3 className="font-semibold text-gray-800" data-unique-id="22c33b86-3538-4569-b650-626b18d14cb0" data-file-name="components/notification-center.tsx"><span className="editable-text" data-unique-id="ce30965e-c988-464f-bf46-76b722e5d901" data-file-name="components/notification-center.tsx">Notifications</span></h3>
                  {notifications.length > 0 && <button onClick={markAllAsRead} className="text-sm text-orange-600 hover:text-orange-700" data-unique-id="bbd1e683-1ead-4c4b-bafa-06784ea726df" data-file-name="components/notification-center.tsx"><span className="editable-text" data-unique-id="5edc8cdf-1a64-469f-b9b9-0509ec4d75f5" data-file-name="components/notification-center.tsx">
                      Mark all read
                    </span></button>}
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto" data-unique-id="95dcd88e-f6d9-495a-8416-3909a2fd96d5" data-file-name="components/notification-center.tsx" data-dynamic-text="true">
                {notifications.length === 0 ? <div className="p-6 text-center text-gray-500" data-unique-id="89e07b20-0b64-4845-9e89-12d7c310d0e7" data-file-name="components/notification-center.tsx">
                    <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm" data-unique-id="6ca14ebf-fecd-4aec-9fdd-7b05f4c27ac5" data-file-name="components/notification-center.tsx"><span className="editable-text" data-unique-id="19004acb-023a-48f1-81f5-bd80fc491c22" data-file-name="components/notification-center.tsx">No notifications yet</span></p>
                  </div> : notifications.map(notification => {
              const isRead = readNotifications.has(notification.id);
              return <div key={notification.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${!isRead ? 'bg-orange-50' : ''}`} onClick={() => markAsRead(notification.id)} data-unique-id="a539754d-72d1-4be4-be87-7e54a1c153f9" data-file-name="components/notification-center.tsx">
                        <div className="flex items-start gap-3" data-unique-id="8c4b0983-6ca8-493a-adb8-7a36db9841f6" data-file-name="components/notification-center.tsx">
                          <div className="mt-1" data-unique-id="629894c9-e42e-4a33-8f79-fa6e18c8df26" data-file-name="components/notification-center.tsx" data-dynamic-text="true">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0" data-unique-id="d38ff927-e966-4fec-b1ac-79a0f2c8f6a3" data-file-name="components/notification-center.tsx">
                            <div className="flex items-center justify-between" data-unique-id="f49255eb-7798-4229-909a-4ad3a41cdb8d" data-file-name="components/notification-center.tsx" data-dynamic-text="true">
                              <p className="font-medium text-gray-800 text-sm" data-unique-id="29373490-5cc0-4b2c-91ad-1fb6dbd57b69" data-file-name="components/notification-center.tsx" data-dynamic-text="true">
                                {notification.title}
                              </p>
                              {!isRead && <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" data-unique-id="965ec2ba-14a2-4fe4-92b9-cc8ab6329cd5" data-file-name="components/notification-center.tsx" />}
                            </div>
                            <p className="text-sm text-gray-600 mt-1" data-unique-id="0d6c8568-423b-4bf5-b8c9-8be2dbf2e3dc" data-file-name="components/notification-center.tsx" data-dynamic-text="true">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2" data-unique-id="a8e7a2ca-0c1b-4c5f-bf82-84465aec55a0" data-file-name="components/notification-center.tsx">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <p className="text-xs text-gray-500" data-unique-id="a3b9503a-cb41-4abc-adc6-785c72cc3139" data-file-name="components/notification-center.tsx" data-dynamic-text="true">
                                {formatTimestamp(notification.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>;
            })}
              </div>

              {/* Footer */}
              {notifications.length > 0 && <div className="p-3 border-t border-gray-100 bg-gray-50" data-unique-id="f0621a0f-587d-4ec2-a180-8b6d2c80fc65" data-file-name="components/notification-center.tsx">
                  <p className="text-xs text-gray-500 text-center" data-unique-id="ee06c1f3-d1ad-40b7-ba4c-ef1e2fed49ea" data-file-name="components/notification-center.tsx" data-dynamic-text="true">
                    {unreadCount}<span className="editable-text" data-unique-id="aa0d74e3-7ee0-4ee9-9461-8880373c658f" data-file-name="components/notification-center.tsx"> unread notification</span>{unreadCount !== 1 ? 's' : ''}
                  </p>
                </div>}
            </motion.div>
          </>}
      </AnimatePresence>
    </div>;
}