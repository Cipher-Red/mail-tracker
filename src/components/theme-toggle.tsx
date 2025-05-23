'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { Tooltip } from '@/components/tooltip';
export function ThemeToggle() {
  const {
    theme,
    setTheme,
    resolvedTheme
  } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [showThemeTooltip, setShowThemeTooltip] = useState(false);
  useEffect(() => {
    setIsMounted(true);

    // Show theme tooltip after user has been on site for 10 seconds
    // if they haven't interacted with theme toggle yet
    const hasSeenThemeTooltip = localStorage.getItem('hasSeenThemeTooltip') === 'true';
    if (!hasSeenThemeTooltip) {
      const timer = setTimeout(() => {
        setShowThemeTooltip(true);
        setTimeout(() => {
          setShowThemeTooltip(false);
          localStorage.setItem('hasSeenThemeTooltip', 'true');
        }, 5000); // Hide after 5 seconds
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, []);
  if (!isMounted) {
    return <div className="w-9 h-9" data-unique-id="4979a7fa-51e9-4b26-84f9-477d9a3e52df" data-file-name="components/theme-toggle.tsx"></div>;
  }
  const handleToggle = () => {
    if (theme === 'light') setTheme('dark');else if (theme === 'dark') setTheme('system');else setTheme('light');

    // Hide tooltip and mark as seen when user clicks the toggle
    setShowThemeTooltip(false);
    localStorage.setItem('hasSeenThemeTooltip', 'true');
  };
  const variants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      rotate: -30
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 15
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      rotate: 30,
      transition: {
        duration: 0.2
      }
    }
  };
  return <div className="relative" data-unique-id="64eb1ea4-133c-4518-aec6-04a755084b98" data-file-name="components/theme-toggle.tsx" data-dynamic-text="true">
      <motion.button id="theme-toggle-button" whileTap={{
      scale: 0.95
    }} onClick={handleToggle} className={`w-9 h-9 flex items-center justify-center rounded-md border ${resolvedTheme === 'dark' ? 'border-slate-700' : 'border-border'} bg-background text-foreground hover:bg-accent transition-colors relative overflow-hidden`} title={`Current theme: ${theme}. Click to switch.`} aria-label={`Switch theme, current theme is ${theme}`} data-unique-id="09bb3cfa-7e6b-4af9-9d9c-d84baa21b450" data-file-name="components/theme-toggle.tsx">
        <AnimatePresence mode="wait">
          <motion.div key={theme} initial="hidden" animate="visible" exit="exit" variants={variants} className="absolute" data-unique-id="bdc04e56-666f-40e6-a5b2-49b0e9551d7f" data-file-name="components/theme-toggle.tsx" data-dynamic-text="true">
            {theme === 'dark' ? <Moon size={18} /> : theme === 'light' ? <Sun size={18} /> : <Laptop size={18} />}
          </motion.div>
        </AnimatePresence>
      </motion.button>
      
      {/* Theme Change Tutorial Tooltip */}
      <AnimatePresence>
        {showThemeTooltip && <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -10
      }} className="absolute top-full mt-2 right-0 z-50 w-64 bg-card border border-border rounded-md shadow-lg p-3" data-unique-id="3bddf2b5-2949-4484-99bb-26ef8785691a" data-file-name="components/theme-toggle.tsx">
            <div className="text-sm" data-unique-id="94aa0039-42ab-4e07-a40e-74f254c7a81e" data-file-name="components/theme-toggle.tsx">
              <p className="font-medium" data-unique-id="26412d89-b044-4797-b7c6-8ac5f9faabc8" data-file-name="components/theme-toggle.tsx"><span className="editable-text" data-unique-id="313c76a9-7f8f-44f9-b37f-e06acb23e89a" data-file-name="components/theme-toggle.tsx">Prefer dark mode?</span></p>
              <p className="text-xs text-muted-foreground mt-1" data-unique-id="06cdd4d7-2cd9-4854-86a6-00b29ba306aa" data-file-name="components/theme-toggle.tsx"><span className="editable-text" data-unique-id="496d30b9-938b-44a5-8f1a-7d9da552b645" data-file-name="components/theme-toggle.tsx">
                Click this button to switch between light, dark, and system themes.
              </span></p>
            </div>
          </motion.div>}
      </AnimatePresence>
    </div>;
}