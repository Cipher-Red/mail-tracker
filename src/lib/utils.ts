import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Check if we're in a browser environment
export const isBrowser = typeof window !== 'undefined';

// Safe localStorage getter
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (!isBrowser) return defaultValue;
  try {
    const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage`, error);
    return defaultValue;
  }
}

// Safe localStorage setter
export function setLocalStorage<T>(key: string, value: T): void {
  if (!isBrowser) return;
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error(`Error setting item ${key} in localStorage`, error);
  }
}

/**
 * Safely copy text to clipboard with fallback for older browsers
 */
export function copyToClipboard(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!isBrowser) {
      resolve(false);
      return;
    }
    
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
          .then(() => resolve(true))
          .catch((err) => {
            console.error('Clipboard API failed:', err);
            const success = fallbackCopyToClipboard(text);
            resolve(success);
          });
      } else {
        const success = fallbackCopyToClipboard(text);
        resolve(success);
      }
    } catch (err) {
      console.error('Copy operation failed:', err);
      resolve(false);
    }
  });
}

/**
 * Fallback method for copying to clipboard using document.execCommand
 */
function fallbackCopyToClipboard(text: string): boolean {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make the textarea out of viewport
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Fallback copy failed:', err);
    return false;
  }
}

/**
 * Track user activity (lazy loads the activity store)
 */
export function trackActivity(action: string, details: Record<string, any> = {}): void {
  // Use dynamic import to avoid SSR issues and circular dependencies
  if (isBrowser) {
    // Add browser context information
    const contextDetails = {
      ...details,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };
    
    // Lazy import activity store
    import('./activity-store').then(({ useActivityStore }) => {
      useActivityStore.getState().trackActivity(action, contextDetails);
    }).catch(err => {
      console.error('Failed to load activity store:', err);
    });
  }
}
