'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
export function ThemeToggle() {
  const {
    theme,
    setTheme
  } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return <div className="w-9 h-9" data-unique-id="4c29d1cd-17b6-47cc-8bfe-7f3e26f1b610" data-file-name="components/theme-toggle.tsx"></div>;
  }
  const handleToggle = () => {
    if (theme === 'light') setTheme('dark');else if (theme === 'dark') setTheme('system');else setTheme('light');
  };
  return <motion.button whileTap={{
    scale: 0.95
  }} onClick={handleToggle} className="w-9 h-9 flex items-center justify-center rounded-md border border-border bg-background text-foreground hover:bg-accent transition-colors" title={`Current theme: ${theme}. Click to switch.`} data-unique-id="1d79274b-d497-4a93-b18e-39d411c80f5d" data-file-name="components/theme-toggle.tsx" data-dynamic-text="true">
      {theme === 'dark' ? <Moon size={18} /> : theme === 'light' ? <Sun size={18} /> : <Laptop size={18} />}
    </motion.button>;
}