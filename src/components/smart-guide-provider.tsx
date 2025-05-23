'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SmartGuide } from './smart-guide';
interface GuideItem {
  id: string;
  title: string;
  content: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  type?: 'tip' | 'success' | 'info' | 'warning';
  persistent?: boolean;
  showOnce?: boolean;
  delay?: number;
  condition?: () => boolean;
  elementId?: string;
}
interface SmartGuideContextType {
  showGuide: (guideId: string) => void;
  hideGuide: (guideId: string) => void;
  registerGuide: (guide: GuideItem) => void;
  resetAllGuides: () => void;
}
const SmartGuideContext = createContext<SmartGuideContextType | undefined>(undefined);
export function useSmartGuide() {
  const context = useContext(SmartGuideContext);
  if (context === undefined) {
    throw new Error('useSmartGuide must be used within a SmartGuideProvider');
  }
  return context;
}
interface SmartGuideProviderProps {
  children: ReactNode;
  initialGuides?: GuideItem[];
}
export function SmartGuideProvider({
  children,
  initialGuides = []
}: SmartGuideProviderProps) {
  const [guides, setGuides] = useState<GuideItem[]>(initialGuides);
  const [activeGuides, setActiveGuides] = useState<Record<string, boolean>>({});

  // Add built-in guides
  useEffect(() => {
    const builtInGuides: GuideItem[] = [{
      id: 'welcome-to-dark-mode',
      title: 'Dark Mode Enabled',
      content: 'You\'ve switched to dark mode. This can reduce eye strain in low-light environments. Toggle the theme button again to switch back to light mode.',
      position: 'bottom',
      type: 'info',
      showOnce: true,
      delay: 1000,
      condition: () => {
        if (typeof window === 'undefined') return false;
        return document.documentElement.classList.contains('dark');
      }
    }, {
      id: 'theme-customization',
      title: 'Customize Your Experience',
      content: 'Click the settings icon to access more theme options and preferences.',
      position: 'bottom',
      type: 'tip',
      showOnce: true,
      delay: 3000,
      elementId: 'theme-toggle-button'
    }, {
      id: 'template-editor-tip',
      title: 'Personalize Your Emails',
      content: 'Use variables like {{customerName}} and {{orderNumber}} to create dynamic emails that automatically fill in with customer data.',
      position: 'right',
      type: 'tip',
      showOnce: true,
      delay: 5000,
      elementId: 'tour-template-editor'
    }];
    setGuides(prevGuides => [...prevGuides, ...builtInGuides]);
  }, []);

  // Check conditions for showing guides
  useEffect(() => {
    guides.forEach(guide => {
      if (guide.condition && guide.condition()) {
        setActiveGuides(prev => ({
          ...prev,
          [guide.id]: true
        }));
      }
    });

    // Check for element-based guides
    guides.forEach(guide => {
      if (guide.elementId && typeof document !== 'undefined') {
        const element = document.getElementById(guide.elementId);
        if (element) {
          const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
              setActiveGuides(prev => ({
                ...prev,
                [guide.id]: true
              }));
            }
          }, {
            threshold: 0.5
          });
          observer.observe(element);
          return () => observer.disconnect();
        }
      }
    });
  }, [guides]);
  const showGuide = (guideId: string) => {
    setActiveGuides(prev => ({
      ...prev,
      [guideId]: true
    }));
  };
  const hideGuide = (guideId: string) => {
    setActiveGuides(prev => ({
      ...prev,
      [guideId]: false
    }));
  };
  const registerGuide = (guide: GuideItem) => {
    setGuides(prev => [...prev, guide]);
  };
  const resetAllGuides = () => {
    if (typeof window !== 'undefined') {
      // Clear all guide-related localStorage items
      const storage = window.localStorage;
      Object.keys(storage).forEach(key => {
        if (key.startsWith('guide-')) {
          storage.removeItem(key);
        }
      });

      // Reset active guides
      setActiveGuides({});
    }
  };
  return <SmartGuideContext.Provider value={{
    showGuide,
    hideGuide,
    registerGuide,
    resetAllGuides
  }}>
      {children}
      
      {/* Render active guides */}
      {guides.map(guide => activeGuides[guide.id] ? <SmartGuide key={guide.id} id={guide.id} title={guide.title} content={guide.content} position={guide.position} type={guide.type} persistent={guide.persistent} showOnce={guide.showOnce} delay={guide.delay} /> : null)}
    </SmartGuideContext.Provider>;
}