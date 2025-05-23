'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X } from 'lucide-react';
export function GuidanceButton() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Only show guidance button if user has seen welcome but not completed tour
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome') === 'true';
    const hasTakenTour = localStorage.getItem('hasTakenTour') === 'true';
    const initialHelpShown = localStorage.getItem('initialHelpShown') === 'true';
    if (hasSeenWelcome && !hasTakenTour && !initialHelpShown) {
      // Delay showing the guidance button to not overwhelm new users
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Mark that we've shown guidance at least once
        localStorage.setItem('initialHelpShown', 'true');
      }, 15000); // Show after 15 seconds

      return () => clearTimeout(timer);
    }
  }, []);
  const startTour = () => {
    // Reset tour flag to show the tour again
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hasTakenTour');

      // Dispatch a custom event to trigger the tour
      const event = new CustomEvent('startFeatureTour');
      window.dispatchEvent(event);

      // Hide this button
      setIsVisible(false);
    }
  };
  const dismissGuidance = () => {
    setIsVisible(false);
  };
  if (!isVisible) return null;
  return <AnimatePresence>
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} exit={{
      opacity: 0,
      scale: 0.9
    }} className="fixed bottom-6 right-6 z-50" data-unique-id="cbfd7fb5-a5d5-4999-b95f-41999027ff1c" data-file-name="components/guidance-button.tsx">
        <div className="bg-white dark:bg-card rounded-lg shadow-lg border border-border overflow-hidden max-w-xs" data-unique-id="00670b45-9c01-4dd4-93cb-6fe1b47d4d56" data-file-name="components/guidance-button.tsx">
          <div className="flex justify-between items-center p-3 border-b border-border" data-unique-id="c96ff7d5-2714-45f8-acb3-804b833ef447" data-file-name="components/guidance-button.tsx">
            <h4 className="font-medium text-sm flex items-center" data-unique-id="6526d1aa-ab1f-4517-a62a-685f5cff32af" data-file-name="components/guidance-button.tsx">
              <HelpCircle className="w-4 h-4 mr-2 text-primary" /><span className="editable-text" data-unique-id="8ecdd077-8844-470c-b963-8cfadaf12070" data-file-name="components/guidance-button.tsx">
              Need help getting started?
            </span></h4>
            <button onClick={dismissGuidance} className="text-muted-foreground hover:text-foreground" data-unique-id="5522ea0f-edc9-429d-be3a-83358b1c7d78" data-file-name="components/guidance-button.tsx">
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="p-4" data-unique-id="f219beb2-ce53-4221-902c-3530d43f7cda" data-file-name="components/guidance-button.tsx">
            <p className="text-sm mb-4" data-unique-id="29151aa3-b6f0-4414-8b0e-75bf53735add" data-file-name="components/guidance-button.tsx"><span className="editable-text" data-unique-id="c9ff56c0-070d-47d4-8458-ea508cc5c1db" data-file-name="components/guidance-button.tsx">
              Take a quick tour of the application to learn about all its features.
            </span></p>
            
            <div className="flex justify-end" data-unique-id="128387f5-cc46-4853-aec3-ad27759214c9" data-file-name="components/guidance-button.tsx">
              <button onClick={startTour} className="px-3 py-1.5 text-sm bg-primary text-white rounded hover:bg-primary/90 transition-colors" data-unique-id="6ce37883-cf2b-49ad-a4a4-81abf7dc8ddd" data-file-name="components/guidance-button.tsx"><span className="editable-text" data-unique-id="495f934d-4b3d-4489-871b-f5776af63e01" data-file-name="components/guidance-button.tsx">
                Start Tour
              </span></button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>;
}