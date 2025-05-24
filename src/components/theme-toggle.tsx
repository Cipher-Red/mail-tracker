'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
export function ThemeToggle() {
  const {
    theme,
    setTheme,
    resolvedTheme
  } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <div className="w-9 h-9" data-unique-id="46000251-ae37-4ea8-8362-1a340346ec4a" data-file-name="components/theme-toggle.tsx"></div>;
  }
  const handleToggle = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
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
  return <div className="relative" data-unique-id="6333b29d-a56f-469d-a727-691d90e86c8c" data-file-name="components/theme-toggle.tsx">
      <motion.button id="theme-toggle-button" whileTap={{
      scale: 0.95
    }} onClick={handleToggle} className={`w-9 h-9 flex items-center justify-center rounded-md border ${resolvedTheme === 'dark' ? 'border-slate-700' : 'border-border'} bg-background text-foreground hover:bg-accent transition-colors relative overflow-hidden`} title={`Current theme: ${theme}. Click to switch.`} aria-label={`Switch theme, current theme is ${theme}`} data-unique-id="8e2b04cf-831c-4d87-aef6-d6ef58d1f4ff" data-file-name="components/theme-toggle.tsx">
        <AnimatePresence mode="wait">
          <motion.div key={theme} initial="hidden" animate="visible" exit="exit" variants={variants} className="absolute" data-unique-id="4640e77a-312b-4195-b2d6-1d3bb3b5fa41" data-file-name="components/theme-toggle.tsx" data-dynamic-text="true">
            {theme === 'dark' ? <Moon size={18} /> : theme === 'light' ? <Sun size={18} /> : <Laptop size={18} />}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </div>;
}