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
  return <div className="relative" data-unique-id="332d7ba3-329e-4690-a4f0-77b8e0c15c72" data-file-name="components/notification-center.tsx" data-dynamic-text="true">
      {/* Notification Bell */}
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors" data-unique-id="971c3765-a94c-4058-92e9-46557e932519" data-file-name="components/notification-center.tsx" data-dynamic-text="true">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium" data-unique-id="6b33abe7-679b-4ce4-99fe-4afc665effdd" data-file-name="components/notification-center.tsx" data-dynamic-text="true">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} data-unique-id="166e2b69-4c03-424a-9f03-989543ecbbfe" data-file-name="components/notification-center.tsx" />
            
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
        }} className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden" data-unique-id="6ead8a1a-fb00-4332-8272-e863799cf545" data-file-name="components/notification-center.tsx" data-dynamic-text="true">
              {/* Header */}
              <div className="p-4 border-b border-gray-100" data-unique-id="339d9a8a-0142-49ae-a3de-a05d4f96844c" data-file-name="components/notification-center.tsx">
                <div className="flex items-center justify-between" data-unique-id="9ee2d9a5-3792-41e1-bba5-0b6fab24178d" data-file-name="components/notification-center.tsx" data-dynamic-text="true">
                  <h3 className="font-semibold text-gray-800" data-unique-id="c621737b-ce52-4716-9d62-b884a03ca5d7" data-file-name="components/notification-center.tsx"><span className="editable-text" data-unique-id="1632fe5c-e0d9-43b0-84e1-f0ab92b2e894" data-file-name="components/notification-center.tsx">Notifications</span></h3>
                  {notifications.length > 0 && <button onClick={markAllAsRead} className="text-sm text-orange-600 hover:text-orange-700" data-unique-id="a50a2c9d-c642-4c2a-a7bd-a1051c393db6" data-file-name="components/notification-center.tsx"><span className="editable-text" data-unique-id="59bcb750-1c8b-419e-a93a-dd8ad77ae4f9" data-file-name="components/notification-center.tsx">
                      Mark all read
                    </span></button>}
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto" data-unique-id="d8cbfad7-c6fa-4415-8dc3-bf83c8384fdd" data-file-name="components/notification-center.tsx" data-dynamic-text="true">
                {notifications.length === 0 ? <div className="p-6 text-center text-gray-500" data-unique-id="26a267e3-6633-44d3-b0e2-8983eedfb7b0" data-file-name="components/notification-center.tsx">
                    <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm" data-unique-id="fe76f298-e816-45d9-905d-9861c76d2c6a" data-file-name="components/notification-center.tsx"><span className="editable-text" data-unique-id="fe73f357-cce2-49a7-851f-9524473ef21c" data-file-name="components/notification-center.tsx">No notifications yet</span></p>
                  </div> : notifications.map(notification => {
              const isRead = readNotifications.has(notification.id);
              return <div key={notification.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${!isRead ? 'bg-orange-50' : ''}`} onClick={() => markAsRead(notification.id)} data-unique-id="3c01e406-81e7-4e9e-9497-0f12cb8df537" data-file-name="components/notification-center.tsx">
                        <div className="flex items-start gap-3" data-unique-id="00827cdd-ccf9-43f3-87f6-796f43fbf7c5" data-file-name="components/notification-center.tsx">
                          <div className="mt-1" data-unique-id="546873d4-9f53-4b2d-9c58-984963dfa171" data-file-name="components/notification-center.tsx" data-dynamic-text="true">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0" data-unique-id="2eeafdc6-37e3-4a50-8fd1-1435b60f87b0" data-file-name="components/notification-center.tsx">
                            <div className="flex items-center justify-between" data-unique-id="0b715c33-2e3e-4c2f-93ba-4506d6761af2" data-file-name="components/notification-center.tsx" data-dynamic-text="true">
                              <p className="font-medium text-gray-800 text-sm" data-unique-id="715e42e1-e152-40e5-8faf-9583ad066781" data-file-name="components/notification-center.tsx" data-dynamic-text="true">
                                {notification.title}
                              </p>
                              {!isRead && <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" data-unique-id="17b97e6a-7aeb-4907-ac5f-67c49373af09" data-file-name="components/notification-center.tsx" />}
                            </div>
                            <p className="text-sm text-gray-600 mt-1" data-unique-id="f71da163-22d6-4e9e-bb80-3897cc1402cf" data-file-name="components/notification-center.tsx" data-dynamic-text="true">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2" data-unique-id="a9a8c77b-acad-4dcf-b6f0-53dd47ceb1b6" data-file-name="components/notification-center.tsx">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <p className="text-xs text-gray-500" data-unique-id="cde592f8-59b5-4928-9fc5-a8f77450f8da" data-file-name="components/notification-center.tsx" data-dynamic-text="true">
                                {formatTimestamp(notification.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>;
            })}
              </div>

              {/* Footer */}
              {notifications.length > 0 && <div className="p-3 border-t border-gray-100 bg-gray-50" data-unique-id="8d46faec-1b84-4f28-9ad6-8c5dab6f2953" data-file-name="components/notification-center.tsx">
                  <p className="text-xs text-gray-500 text-center" data-unique-id="18b189dc-fc7d-4c28-b410-579cfa7d0170" data-file-name="components/notification-center.tsx" data-dynamic-text="true">
                    {unreadCount}<span className="editable-text" data-unique-id="941bedd9-6908-47bd-a353-cb5ea8e61615" data-file-name="components/notification-center.tsx"> unread notification</span>{unreadCount !== 1 ? 's' : ''}
                  </p>
                </div>}
            </motion.div>
          </>}
      </AnimatePresence>
    </div>;
}