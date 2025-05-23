'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, X, ChevronRight } from 'lucide-react';
import { useTheme } from './theme-provider';
export function DarkModeGuide() {
  const {
    resolvedTheme,
    setTheme
  } = useTheme();
  const [showGuide, setShowGuide] = useState(false);
  const [step, setStep] = useState(0);
  const [firstTimeUser, setFirstTimeUser] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if user has seen the guide before
    const hasSeenDarkModeGuide = localStorage.getItem('hasSeenDarkModeGuide') === 'true';

    // Check if this might be a first-time user
    const isFirstVisit = !localStorage.getItem('hasVisitedBefore');
    if (isFirstVisit) {
      localStorage.setItem('hasVisitedBefore', 'true');
      setFirstTimeUser(true);

      // Show guide after a delay for first time users
      const timer = setTimeout(() => {
        if (!hasSeenDarkModeGuide) {
          setShowGuide(true);
        }
      }, 10000); // Show after 10 seconds for new users

      return () => clearTimeout(timer);
    } else {
      // Monitor theme changes for returning users
      const hasChangedTheme = localStorage.getItem('lastTheme') !== resolvedTheme;
      if (hasChangedTheme && !hasSeenDarkModeGuide) {
        const timer = setTimeout(() => {
          setShowGuide(true);
        }, 1500); // Show shortly after theme change

        return () => clearTimeout(timer);
      }
    }

    // Update last theme
    localStorage.setItem('lastTheme', resolvedTheme || 'light');
  }, [resolvedTheme]);
  const closeGuide = () => {
    setShowGuide(false);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('hasSeenDarkModeGuide', 'true');
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
    }
  };
  const nextStep = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      closeGuide();
    }
  };
  if (!showGuide) return null;
  const steps = [{
    title: `Welcome to ${resolvedTheme === 'dark' ? 'Dark' : 'Light'} Mode`,
    content: resolvedTheme === 'dark' ? "You're using dark mode, which is easier on the eyes in low-light environments and can help reduce eye strain." : "You're currently using light mode. Did you know you can switch to dark mode for low-light environments?",
    icon: resolvedTheme === 'dark' ? <Moon className="h-6 w-6 text-blue-400" /> : <Sun className="h-6 w-6 text-amber-400" />
  }, {
    title: "Quick Theme Tips",
    content: "You can change your theme anytime by clicking the theme toggle icon in the top right corner of the screen.",
    icon: <div className="flex space-x-2" data-unique-id="f7277bae-c970-4c4d-9dcd-b4362025fd57" data-file-name="components/dark-mode-guide.tsx">
        <Sun className="h-5 w-5 text-amber-400" />
        <Moon className="h-5 w-5 text-blue-400" />
      </div>
  }, {
    title: "Theme Preference",
    content: "Your theme preference is saved automatically. We'll remember your choice for your next visit.",
    icon: <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10" data-unique-id="0dfcdc36-d9a1-4a1d-8239-f65baa5cc61b" data-file-name="components/dark-mode-guide.tsx">
        <ChevronRight className="h-4 w-4 text-primary" />
      </div>
  }];
  return <AnimatePresence>
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} exit={{
      opacity: 0,
      y: 10
    }} className="fixed bottom-4 right-4 z-50 max-w-sm" data-unique-id="cc374ff9-5bac-4b44-bd1c-5e694300d82e" data-file-name="components/dark-mode-guide.tsx">
        <div className={`rounded-lg shadow-lg border p-4 ${resolvedTheme === 'dark' ? 'bg-card border-border' : 'bg-white border-gray-200'}`} data-unique-id="fc09d554-f1e3-4423-90a2-6dd3d25ad152" data-file-name="components/dark-mode-guide.tsx">
          <div className="flex justify-between items-start" data-unique-id="972a36c4-b32a-424d-9816-b4cc255824d7" data-file-name="components/dark-mode-guide.tsx">
            <div className="flex items-center" data-unique-id="8341d744-f442-4376-a561-fef8e36e5669" data-file-name="components/dark-mode-guide.tsx" data-dynamic-text="true">
              {steps[step].icon}
              <h3 className="font-medium text-lg ml-2" data-unique-id="7a5c0372-a6d4-4544-bfca-d33c1dfe00e5" data-file-name="components/dark-mode-guide.tsx" data-dynamic-text="true">{steps[step].title}</h3>
            </div>
            <button onClick={closeGuide} className="p-1 rounded-full hover:bg-accent/50 transition-colors" data-unique-id="320bf8c7-48d4-4aa2-8110-9ba82dcbe3a6" data-file-name="components/dark-mode-guide.tsx">
              <X size={16} />
            </button>
          </div>
          
          <p className="mt-2 text-sm text-muted-foreground" data-unique-id="ab99edea-d10c-47e4-8894-ce00f2735146" data-file-name="components/dark-mode-guide.tsx" data-dynamic-text="true">
            {steps[step].content}
          </p>
          
          <div className="mt-4 flex items-center justify-between" data-unique-id="d3914320-efa0-4d30-aa9d-a59dfc14b96c" data-file-name="components/dark-mode-guide.tsx">
            <div className="flex space-x-1" data-unique-id="d85bd548-f380-4464-b623-6171bdbce907" data-file-name="components/dark-mode-guide.tsx" data-dynamic-text="true">
              {steps.map((_, idx) => <div key={idx} className={`w-2 h-2 rounded-full transition-all ${idx === step ? 'bg-primary' : 'bg-accent'}`} data-unique-id="0653c23e-6584-42e8-8495-afd50b5d32b8" data-file-name="components/dark-mode-guide.tsx" />)}
            </div>
            
            <div className="flex space-x-2" data-unique-id="58420212-c482-47c4-a3be-9b03689a8379" data-file-name="components/dark-mode-guide.tsx" data-dynamic-text="true">
              {resolvedTheme === 'light' && step === 0 && <button onClick={() => {
              setTheme('dark');
              nextStep();
            }} className="px-3 py-1.5 text-xs bg-slate-800 text-white rounded" data-unique-id="cc0fa7d2-7264-4e4e-94ee-095cd620b729" data-file-name="components/dark-mode-guide.tsx"><span className="editable-text" data-unique-id="d41d82aa-ef66-4ed0-bfbb-315b444a5043" data-file-name="components/dark-mode-guide.tsx">
                  Try Dark Mode
                </span></button>}
              <button onClick={nextStep} className="px-3 py-1.5 text-xs bg-primary text-white rounded" data-unique-id="9e13141c-1c40-435b-80c2-76430a12e285" data-file-name="components/dark-mode-guide.tsx" data-dynamic-text="true">
                {step < 2 ? 'Next Tip' : 'Got it'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>;
}