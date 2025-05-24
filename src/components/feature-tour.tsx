'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
interface TourStep {
  elementId: string;
  title: string;
  description: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
}
export function FeatureTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });

  // Add an offset to ensure tooltip doesn't overlap with elements
  const POSITION_OFFSET = 20;
  const tourSteps: TourStep[] = [{
    elementId: 'tour-template-editor',
    title: 'Template Editor',
    description: 'Create and customize your email templates. Add variables like customer name and order details.',
    position: 'bottom'
  }, {
    elementId: 'tour-customers',
    title: 'Customer Management',
    description: 'Add, edit and organize your customer database. Import customers from Excel or add them manually.',
    position: 'bottom'
  }, {
    elementId: 'tour-email-preview',
    title: 'Email Preview',
    description: 'See how your emails will look before sending them. Test with real customer data.',
    position: 'left'
  }];

  // Memoize the positioning function to avoid unnecessary recalculations
  const positionTooltip = useCallback(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const currentTourStep = tourSteps[currentStep];
    if (!currentTourStep) return;

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      try {
        // Safe access to document
        if (typeof document === 'undefined') return;

        // Get element safely after document check
        let element;
        if (typeof document !== 'undefined') {
          element = document.getElementById(currentTourStep.elementId);
        }
        if (!element) {
          console.warn(`Element with ID ${currentTourStep.elementId} not found`);
          return;
        }
        const rect = element.getBoundingClientRect();

        // Safe access to window and document for scroll position
        let scrollTop = 0;
        let scrollLeft = 0;
        if (typeof window !== 'undefined') {
          scrollTop = window.scrollY || (typeof document !== 'undefined' ? document.documentElement.scrollTop : 0);
          scrollLeft = window.scrollX || (typeof document !== 'undefined' ? document.documentElement.scrollLeft : 0);
        }
        const {
          position: tooltipPosition = 'bottom'
        } = currentTourStep;
        let x = 0;
        let y = 0;

        // Calculate position with scroll offset
        switch (tooltipPosition) {
          case 'top':
            x = rect.left + rect.width / 2 + scrollLeft;
            y = rect.top - POSITION_OFFSET + scrollTop;
            break;
          case 'right':
            x = rect.right + POSITION_OFFSET + scrollLeft;
            y = rect.top + rect.height / 2 + scrollTop;
            break;
          case 'bottom':
            x = rect.left + rect.width / 2 + scrollLeft;
            y = rect.bottom + POSITION_OFFSET + scrollTop;
            break;
          case 'left':
            x = rect.left - POSITION_OFFSET + scrollLeft;
            y = rect.top + rect.height / 2 + scrollTop;
            break;
        }

        // Update position state
        setPosition({
          x,
          y
        });

        // Ensure the element is in view
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      } catch (e) {
        console.error('Error positioning tooltip:', e);
      }
    });
  }, [currentStep, tourSteps]);
  // Setup effects for initialization and positioning
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasTakenTour = localStorage.getItem('hasTakenTour') === 'true';
      // Additional check for whether elements are ready
      const areElementsReady = tourSteps.every(step => document.getElementById(step.elementId));
      if (!hasTakenTour && areElementsReady) {
        // Start the tour after a delay to ensure UI is fully rendered
        const timer = setTimeout(() => {
          setIsVisible(true);
          positionTooltip();
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [positionTooltip, tourSteps]);

  // Reposition tooltip when step changes or visibility changes
  useEffect(() => {
    if (isVisible) {
      positionTooltip();

      // Add window resize listener to reposition on window size changes
      window.addEventListener('resize', positionTooltip);
      window.addEventListener('scroll', positionTooltip);
      return () => {
        window.removeEventListener('resize', positionTooltip);
        window.removeEventListener('scroll', positionTooltip);
      };
    }
  }, [currentStep, isVisible, positionTooltip]);
  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      endTour();
    }
  };
  const endTour = () => {
    setIsVisible(false);

    // Safe localStorage access
    const saveToLocalStorage = () => {
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem('hasTakenTour', 'true');
        } catch (e) {
          console.error('Failed to save tour completion status to localStorage', e);
        }
      }
    };
    saveToLocalStorage();
  };
  if (!isVisible) return null;
  const currentTourStep = tourSteps[currentStep];
  if (!currentTourStep) return null;
  const {
    title,
    description,
    position: tooltipPosition = 'bottom'
  } = currentTourStep;

  // Calculate tooltip styles based on position
  const tooltipStyles: React.CSSProperties = {
    position: 'fixed',
    // Use fixed instead of absolute to stay in place during scrolling
    zIndex: 50
  };
  switch (tooltipPosition) {
    case 'top':
      tooltipStyles.left = `${position.x}px`;
      tooltipStyles.top = `${position.y}px`;
      tooltipStyles.transform = 'translate(-50%, -100%)';
      break;
    case 'right':
      tooltipStyles.left = `${position.x}px`;
      tooltipStyles.top = `${position.y}px`;
      tooltipStyles.transform = 'translate(0, -50%)';
      break;
    case 'bottom':
      tooltipStyles.left = `${position.x}px`;
      tooltipStyles.top = `${position.y}px`;
      tooltipStyles.transform = 'translate(-50%, 0)';
      break;
    case 'left':
      tooltipStyles.left = `${position.x}px`;
      tooltipStyles.top = `${position.y}px`;
      tooltipStyles.transform = 'translate(-100%, -50%)';
      break;
  }
  return <div className="fixed inset-0 z-[100] pointer-events-none" data-unique-id="12fda27b-aa6f-4ae1-82d0-0ead5a371f44" data-file-name="components/feature-tour.tsx">
      <AnimatePresence>
        <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} exit={{
        opacity: 0,
        scale: 0.9
      }} style={tooltipStyles} className="max-w-xs pointer-events-auto" data-unique-id="869a260e-7395-41bc-9fa5-21d480c21203" data-file-name="components/feature-tour.tsx">
          <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-4" data-unique-id="da51a4ae-227a-41e1-8dd7-4661be7d0b91" data-file-name="components/feature-tour.tsx">
            <div className="flex justify-between items-center mb-2" data-unique-id="ae3a4f4f-ef3f-4cda-84d2-e74a6edecbc1" data-file-name="components/feature-tour.tsx">
              <h3 className="font-medium" data-unique-id="69eefd2b-b793-4434-904d-6b4395c974bb" data-file-name="components/feature-tour.tsx" data-dynamic-text="true">{title}</h3>
              <button onClick={endTour} className="text-primary-foreground opacity-70 hover:opacity-100" data-unique-id="5871ab90-c71e-408f-b4b4-ab9a8c0c9a39" data-file-name="components/feature-tour.tsx">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm mb-3" data-unique-id="08d04956-6705-449a-b53f-c25d7127729a" data-file-name="components/feature-tour.tsx" data-dynamic-text="true">{description}</p>
            <div className="flex justify-between items-center" data-unique-id="0194d416-25c5-4cac-a527-8fad11c4c83f" data-file-name="components/feature-tour.tsx">
              <div className="text-xs opacity-70" data-unique-id="9de1610e-b235-448a-9c04-b9eb8962bcf8" data-file-name="components/feature-tour.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="e4bf39ab-8775-41a0-b24f-07c67a6a3280" data-file-name="components/feature-tour.tsx">
                Step </span>{currentStep + 1}<span className="editable-text" data-unique-id="05aa0331-96f0-430d-8979-f36602ee509d" data-file-name="components/feature-tour.tsx"> of </span>{tourSteps.length}
              </div>
              <button onClick={nextStep} className="flex items-center text-sm px-3 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30" data-unique-id="d79d5b5f-369a-48cc-8474-3e7d61fd8edf" data-file-name="components/feature-tour.tsx" data-dynamic-text="true">
                {currentStep < tourSteps.length - 1 ? <>Next <ArrowRight size={14} className="ml-1" /></> : 'Finish'}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>;
}