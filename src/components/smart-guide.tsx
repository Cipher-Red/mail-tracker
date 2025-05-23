'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LightbulbIcon, X, ThumbsUp, Check, AlertCircle } from 'lucide-react';
interface SmartGuideProps {
  id: string;
  title: string;
  content: React.ReactNode;
  shown?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  type?: 'tip' | 'success' | 'info' | 'warning';
  persistent?: boolean;
  showOnce?: boolean;
  delay?: number; // milliseconds
}
export function SmartGuide({
  id,
  title,
  content,
  shown = true,
  position = 'bottom',
  type = 'tip',
  persistent = false,
  showOnce = true,
  delay = 0
}: SmartGuideProps) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if this guide has been dismissed before
    const hasBeenShown = localStorage.getItem(`guide-${id}-shown`) === 'true';
    const hasBeenDismissed = localStorage.getItem(`guide-${id}-dismissed`) === 'true';

    // Only show if it hasn't been dismissed (or if not persistent)
    const shouldShow = shown && (!showOnce || !hasBeenDismissed);
    if (shouldShow) {
      // Apply delay if specified
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Mark as shown
        if (typeof window !== 'undefined') {
          localStorage.setItem(`guide-${id}-shown`, 'true');
        }
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [id, shown, showOnce, delay]);
  const handleDismiss = () => {
    setIsVisible(false);

    // If persistent is false, mark as dismissed so it doesn't show again
    if (!persistent && showOnce && typeof window !== 'undefined') {
      localStorage.setItem(`guide-${id}-dismissed`, 'true');
    }
  };

  // Determine icon based on type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'info':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        // tip
        return <LightbulbIcon className="h-5 w-5 text-amber-400" />;
    }
  };

  // Determine colors based on type
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800';
      case 'warning':
        return 'bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800';
      default:
        // tip
        return 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/40';
    }
  };

  // Determine position styles
  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return 'bottom-full mb-2';
      case 'right':
        return 'left-full ml-2';
      case 'left':
        return 'right-full mr-2';
      default:
        // bottom
        return 'top-full mt-2';
    }
  };
  if (!isVisible) return null;
  return <AnimatePresence>
      <motion.div initial={{
      opacity: 0,
      y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0,
      x: position === 'left' ? 10 : position === 'right' ? -10 : 0
    }} animate={{
      opacity: 1,
      y: 0,
      x: 0
    }} exit={{
      opacity: 0,
      scale: 0.9
    }} transition={{
      duration: 0.2
    }} className={`absolute z-50 ${getPositionStyles()} max-w-xs w-max pointer-events-auto`} data-unique-id="a3bf7a89-7a39-46f5-acf3-ce67e2cb8be3" data-file-name="components/smart-guide.tsx">
        <div className={`rounded-lg shadow-lg border ${getTypeStyles()} p-3`} data-unique-id="3f4baacd-1c90-468c-8aea-6c958cefa217" data-file-name="components/smart-guide.tsx" data-dynamic-text="true">
          <div className="flex justify-between items-start" data-unique-id="b4222ab2-f491-4f64-8858-c6e5b951d199" data-file-name="components/smart-guide.tsx">
            <div className="flex items-start" data-unique-id="28a59458-2037-4c34-8809-c0a04f951397" data-file-name="components/smart-guide.tsx">
              <div className="flex-shrink-0 mr-2 mt-0.5" data-unique-id="03968652-1d5b-494a-8ef2-dd39be45e81a" data-file-name="components/smart-guide.tsx" data-dynamic-text="true">
                {getIcon()}
              </div>
              <div data-unique-id="84ba7f50-84e6-498e-b21a-f7e6c4df41d6" data-file-name="components/smart-guide.tsx">
                <h4 className="text-sm font-medium" data-unique-id="c8c3469a-72c8-4955-b8ff-27fdfa8a723c" data-file-name="components/smart-guide.tsx" data-dynamic-text="true">{title}</h4>
                <div className="text-xs mt-1 text-gray-600 dark:text-gray-300" data-unique-id="2ef8631d-0e40-48ea-ac16-5342a4ddd1c6" data-file-name="components/smart-guide.tsx" data-dynamic-text="true">
                  {content}
                </div>
              </div>
            </div>
            <button onClick={handleDismiss} className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" data-unique-id="4a84e909-4d1f-4b85-a65d-f7524d53883b" data-file-name="components/smart-guide.tsx">
              <X size={14} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          {/* Show additional button for tips */}
          {type === 'tip' && <div className="flex justify-end mt-2" data-unique-id="8fec319b-9bfb-484b-995c-cbf588e509b8" data-file-name="components/smart-guide.tsx">
              <button onClick={handleDismiss} className="flex items-center text-xs text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300" data-unique-id="b112aa8f-4624-4f3a-bc65-941547fc52da" data-file-name="components/smart-guide.tsx">
                <ThumbsUp className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="83eda787-2e7e-4cb4-ab9b-63007a99def5" data-file-name="components/smart-guide.tsx">
                Got it
              </span></button>
            </div>}
        </div>
      </motion.div>
    </AnimatePresence>;
}