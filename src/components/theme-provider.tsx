'use client';

import { createContext, useContext, useEffect, useState } from 'react';
type Theme = 'light' | 'dark' | 'system';
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark'; // Always resolves to actual theme (light/dark)
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export function ThemeProvider({
  children,
  defaultTheme = 'system'
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage only once on component mount
  useEffect(() => {
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setTheme(savedTheme);
      }
      setMounted(true);
    }
  }, []);

  // Apply theme changes to document and localStorage when theme changes
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    let actualTheme: 'light' | 'dark';
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      actualTheme = systemTheme;
    } else {
      actualTheme = theme as 'light' | 'dark';
    }

    // Update resolved theme
    setResolvedTheme(actualTheme);

    // Update classes on document
    root.classList.remove('light', 'dark');
    root.classList.add(actualTheme);

    // Add data attribute for CSS selector compatibility
    root.setAttribute('data-theme', actualTheme);

    // Store theme preference in localStorage
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  }, [theme, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system' || !mounted) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = document.documentElement;
      const systemTheme = mediaQuery.matches ? 'dark' : 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
      setResolvedTheme(systemTheme);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  // Skip rendering any UI until mounted to prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }
  return <ThemeContext.Provider value={{
    theme,
    setTheme,
    resolvedTheme
  }}>
      {children}
    </ThemeContext.Provider>;
}
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}