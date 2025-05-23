'use client';

import { ThemeProvider } from "@/components/theme-provider";
import { ReactNode } from "react";
interface ThemeProviderWrapperProps {
  children: ReactNode;
  defaultTheme?: 'light' | 'dark' | 'system';
}
export function ThemeProviderWrapper({
  children,
  defaultTheme = 'system'
}: ThemeProviderWrapperProps) {
  return <ThemeProvider defaultTheme={defaultTheme}>
      {children}
    </ThemeProvider>;
}