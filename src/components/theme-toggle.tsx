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
    return <div className="w-9 h-9" data-unique-id="d95ccfdf-4cc9-4ace-9aaf-78cf6fc06450" data-file-name="components/theme-toggle.tsx"></div>;
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
  return <div className="relative" data-unique-id="40ba9f8d-745b-40f0-9a25-821ac882f9cd" data-file-name="components/theme-toggle.tsx">
      <motion.button id="theme-toggle-button" whileTap={{
      scale: 0.85
    }} whileHover={{
      scale: 1.05
    }} onClick={handleToggle} className={`w-9 h-9 flex items-center justify-center rounded-md border ${resolvedTheme === 'dark' ? 'border-slate-700' : 'border-border'} bg-background text-foreground hover:bg-accent transition-all duration-300 relative overflow-hidden shadow-md hover:shadow-lg`} title={`Current theme: ${theme}. Click to switch.`} aria-label={`Switch theme, current theme is ${theme}`} data-unique-id="50e71e9d-bb75-4bc6-ab29-d4be1f2af86f" data-file-name="components/theme-toggle.tsx">
        <AnimatePresence mode="wait">
          <motion.div key={theme} initial="hidden" animate="visible" exit="exit" variants={variants} className="absolute" data-unique-id="09ed5f7e-688b-4949-9a72-a5e8bfc1307c" data-file-name="components/theme-toggle.tsx" data-dynamic-text="true">
            {theme === 'dark' ? <Moon size={18} /> : theme === 'light' ? <Sun size={18} /> : <Laptop size={18} />}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </div>;
}