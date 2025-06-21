'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package2, AlertTriangle, CheckCircle, Clock, Truck, Bell } from 'lucide-react';
interface ToastNotification {
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
interface NotificationToastProps {
  notifications: ToastNotification[];
  onRemove: (id: string) => void;
}
export default function NotificationToast({
  notifications,
  onRemove
}: NotificationToastProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<ToastNotification[]>([]);
  useEffect(() => {
    setVisibleNotifications(notifications);

    // Auto-remove notifications after their duration
    notifications.forEach(notification => {
      const duration = notification.duration || getDurationByPriority(notification.priority);
      setTimeout(() => {
        onRemove(notification.id);
      }, duration);
    });
  }, [notifications, onRemove]);
  const getDurationByPriority = (priority: ToastNotification['priority']) => {
    switch (priority) {
      case 'urgent':
        return 10000;
      // 10 seconds
      case 'high':
        return 8000;
      // 8 seconds
      case 'medium':
        return 6000;
      // 6 seconds
      case 'low':
        return 4000;
      // 4 seconds
      default:
        return 6000;
    }
  };
  const getNotificationIcon = (type: ToastNotification['type']) => {
    switch (type) {
      case 'new_return':
        return <Package2 className="h-5 w-5" />;
      case 'status_change':
        return <CheckCircle className="h-5 w-5" />;
      case 'urgent_issue':
        return <AlertTriangle className="h-5 w-5" />;
      case 'arrival_due':
        return <Truck className="h-5 w-5" />;
      case 'inspection_due':
        return <Clock className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };
  const getNotificationStyles = (priority: ToastNotification['priority']) => {
    switch (priority) {
      case 'urgent':
        return {
          bg: 'bg-red-50 border-red-200',
          icon: 'text-red-600',
          title: 'text-red-900',
          message: 'text-red-700',
          button: 'hover:bg-red-100'
        };
      case 'high':
        return {
          bg: 'bg-orange-50 border-orange-200',
          icon: 'text-orange-600',
          title: 'text-orange-900',
          message: 'text-orange-700',
          button: 'hover:bg-orange-100'
        };
      case 'medium':
        return {
          bg: 'bg-blue-50 border-blue-200',
          icon: 'text-blue-600',
          title: 'text-blue-900',
          message: 'text-blue-700',
          button: 'hover:bg-blue-100'
        };
      case 'low':
        return {
          bg: 'bg-gray-50 border-gray-200',
          icon: 'text-gray-600',
          title: 'text-gray-900',
          message: 'text-gray-700',
          button: 'hover:bg-gray-100'
        };
      default:
        return {
          bg: 'bg-gray-50 border-gray-200',
          icon: 'text-gray-600',
          title: 'text-gray-900',
          message: 'text-gray-700',
          button: 'hover:bg-gray-100'
        };
    }
  };
  return <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm" data-unique-id="b0f28fa2-26f7-4505-a24f-dd0423a45402" data-file-name="components/notification-toast.tsx">
      <AnimatePresence>
        {visibleNotifications.map(notification => {
        const styles = getNotificationStyles(notification.priority);
        return <motion.div key={notification.id} initial={{
          opacity: 0,
          x: 300,
          scale: 0.9
        }} animate={{
          opacity: 1,
          x: 0,
          scale: 1
        }} exit={{
          opacity: 0,
          x: 300,
          scale: 0.9
        }} transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30
        }} className={`${styles.bg} border rounded-lg shadow-lg p-4 backdrop-blur-sm`} data-unique-id="75162b11-a26d-4ad1-9d77-410586026775" data-file-name="components/notification-toast.tsx" data-dynamic-text="true">
              <div className="flex items-start space-x-3" data-unique-id="7e53b14d-38e4-4dfd-800c-b9c5071ee377" data-file-name="components/notification-toast.tsx">
                <div className={`${styles.icon} mt-0.5`} data-unique-id="14a12943-f234-4dd1-bfb6-cc883cbe54d1" data-file-name="components/notification-toast.tsx" data-dynamic-text="true">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0" data-unique-id="4bbca45e-a053-4c2e-bdb7-7166c12de202" data-file-name="components/notification-toast.tsx" data-dynamic-text="true">
                  <h4 className={`text-sm font-semibold ${styles.title}`} data-unique-id="1857a980-682c-4217-9251-2d82200477a5" data-file-name="components/notification-toast.tsx" data-dynamic-text="true">
                    {notification.title}
                  </h4>
                  <p className={`text-sm mt-1 ${styles.message}`} data-unique-id="41ac092d-9fa7-4d89-9e3b-8f82a22d5227" data-file-name="components/notification-toast.tsx" data-dynamic-text="true">
                    {notification.message}
                  </p>
                  
                  {notification.action && <button onClick={notification.action.onClick} className={`text-xs font-medium mt-2 px-2 py-1 rounded ${styles.button} transition-colors`} data-unique-id="dff52a4d-7672-4221-ae20-2fe417872c55" data-file-name="components/notification-toast.tsx" data-dynamic-text="true">
                      {notification.action.label}
                    </button>}
                </div>
                
                <button onClick={() => onRemove(notification.id)} className={`p-1 rounded-full ${styles.button} transition-colors`} data-unique-id="0bf7350d-3e87-494d-9ac3-b48d95da115c" data-file-name="components/notification-toast.tsx">
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              {/* Progress bar for auto-dismiss */}
              <motion.div className="mt-3 h-1 bg-black bg-opacity-10 rounded-full overflow-hidden" initial={{
            width: '100%'
          }} animate={{
            width: '0%'
          }} transition={{
            duration: (notification.duration || getDurationByPriority(notification.priority)) / 1000,
            ease: 'linear'
          }} data-unique-id="d59278f9-7618-4c86-b7aa-cfba46353b3e" data-file-name="components/notification-toast.tsx">
                <div className={`h-full ${styles.icon.replace('text-', 'bg-')} opacity-60`} data-unique-id="1fe6ff57-4550-4ed9-8be9-d9dcec8069b1" data-file-name="components/notification-toast.tsx" />
              </motion.div>
            </motion.div>;
      })}
      </AnimatePresence>
    </div>;
}