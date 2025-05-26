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
    return <div className="w-9 h-9" data-unique-id="aafab12d-bee4-48b7-b56b-767eb9eb7f49" data-file-name="components/theme-toggle.tsx"></div>;
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
  return <div className="relative" data-unique-id="025329e6-f0a4-406a-9668-423bd3bd8beb" data-file-name="components/theme-toggle.tsx">
      <motion.button id="theme-toggle-button" whileTap={{
      scale: 0.85
    }} whileHover={{
      scale: 1.05
    }} onClick={handleToggle} className={`w-9 h-9 flex items-center justify-center rounded-md border ${resolvedTheme === 'dark' ? 'border-slate-700' : 'border-border'} bg-background text-foreground hover:bg-accent transition-all duration-300 relative overflow-hidden shadow-md hover:shadow-lg`} title={`Current theme: ${theme}. Click to switch.`} aria-label={`Switch theme, current theme is ${theme}`} data-unique-id="93196a84-7dc1-4efc-ad75-601ae9967b9f" data-file-name="components/theme-toggle.tsx">
        <AnimatePresence mode="wait">
          <motion.div key={theme} initial="hidden" animate="visible" exit="exit" variants={variants} className="absolute" data-unique-id="cc3163bb-588b-452c-89e6-be3d35a81aa1" data-file-name="components/theme-toggle.tsx" data-dynamic-text="true">
            {theme === 'dark' ? <Moon size={18} /> : theme === 'light' ? <Sun size={18} /> : <Laptop size={18} />}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </div>;
}