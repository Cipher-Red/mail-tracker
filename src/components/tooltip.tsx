'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
  disabled?: boolean;
}
export function Tooltip({
  content,
  children,
  side = 'top',
  delay = 300,
  disabled = false
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Don't show tooltips on mobile devices
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const showTooltip = () => {
    if (disabled || isMobile) return;
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };
  const hideTooltip = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  // Hide tooltip when scrolling or resizing
  useEffect(() => {
    if (isVisible) {
      const handleScrollOrResize = () => hideTooltip();
      window.addEventListener('scroll', handleScrollOrResize);
      window.addEventListener('resize', handleScrollOrResize);
      return () => {
        window.removeEventListener('scroll', handleScrollOrResize);
        window.removeEventListener('resize', handleScrollOrResize);
      };
    }
  }, [isVisible]);
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2'
  };
  const arrows = {
    top: 'bottom-[-6px] left-1/2 -translate-x-1/2 border-t-muted-foreground border-l-transparent border-r-transparent border-b-transparent',
    right: 'left-[-6px] top-1/2 -translate-y-1/2 border-r-muted-foreground border-t-transparent border-b-transparent border-l-transparent',
    bottom: 'top-[-6px] left-1/2 -translate-x-1/2 border-b-muted-foreground border-l-transparent border-r-transparent border-t-transparent',
    left: 'right-[-6px] top-1/2 -translate-y-1/2 border-l-muted-foreground border-t-transparent border-b-transparent border-r-transparent'
  };
  return <div className="relative inline-block" onMouseEnter={showTooltip} onMouseLeave={hideTooltip} data-unique-id="e8113f97-9afa-4d81-b731-62d0343b57cd" data-file-name="components/tooltip.tsx" data-dynamic-text="true">
      {children}
      <AnimatePresence>
        {isVisible && <motion.div initial={{
        opacity: 0,
        scale: 0.95
      }} animate={{
        opacity: 1,
        scale: 1
      }} exit={{
        opacity: 0,
        scale: 0.95
      }} transition={{
        duration: 0.15
      }} className={`absolute z-50 pointer-events-none ${positions[side]}`} data-unique-id="5b947e3a-a8b9-4cab-a113-3227aecda47f" data-file-name="components/tooltip.tsx">
            <div className="bg-muted-foreground text-white text-xs py-1.5 px-3 rounded whitespace-nowrap max-w-[200px] shadow-lg backdrop-blur-sm bg-opacity-90" data-unique-id="6474b621-68aa-4e72-8ef6-4914fdd757fe" data-file-name="components/tooltip.tsx" data-dynamic-text="true">
              {content}
              <div className={`absolute border-4 ${arrows[side]}`} data-unique-id="8bc9cb08-373d-4809-b095-531927ab62ef" data-file-name="components/tooltip.tsx"></div>
            </div>
          </motion.div>}
      </AnimatePresence>
    </div>;
}