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
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export function ThemeProvider({
  children,
  defaultTheme = 'system'
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (defaultTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(systemTheme);
    }
  }, [defaultTheme]);
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    } else {
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  return <ThemeContext.Provider value={{
    theme,
    setTheme
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