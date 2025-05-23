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
  return <div className="fixed inset-0 z-[100] pointer-events-none" data-unique-id="06a631db-4773-497d-97c7-b8f470c9805f" data-file-name="components/feature-tour.tsx">
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
      }} style={tooltipStyles} className="max-w-xs pointer-events-auto" data-unique-id="e22b45a0-f1e3-4ff5-92f0-345c6ea990f8" data-file-name="components/feature-tour.tsx">
          <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-4" data-unique-id="25aaf4c6-dde0-487b-814b-582c754bdccc" data-file-name="components/feature-tour.tsx">
            <div className="flex justify-between items-center mb-2" data-unique-id="d9868a15-2aeb-4afa-9451-68d613af4b80" data-file-name="components/feature-tour.tsx">
              <h3 className="font-medium" data-unique-id="b4eccd2f-7362-42f7-b355-37f117eb04b5" data-file-name="components/feature-tour.tsx" data-dynamic-text="true">{title}</h3>
              <button onClick={endTour} className="text-primary-foreground opacity-70 hover:opacity-100" data-unique-id="1a8db646-a972-42e9-b3ca-e533797bdc1e" data-file-name="components/feature-tour.tsx">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm mb-3" data-unique-id="199abc2c-5a29-443d-ba74-590e0d4cfc78" data-file-name="components/feature-tour.tsx" data-dynamic-text="true">{description}</p>
            <div className="flex justify-between items-center" data-unique-id="c48b2b53-c4fb-4b2c-8a1a-3268d9dd2fb0" data-file-name="components/feature-tour.tsx">
              <div className="text-xs opacity-70" data-unique-id="49a75200-940c-40ce-8ace-176860312261" data-file-name="components/feature-tour.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="a6fd7010-90db-46c9-8d14-bb73c811e7e2" data-file-name="components/feature-tour.tsx">
                Step </span>{currentStep + 1}<span className="editable-text" data-unique-id="83082d6c-9e08-479d-bc3e-79930b275abd" data-file-name="components/feature-tour.tsx"> of </span>{tourSteps.length}
              </div>
              <button onClick={nextStep} className="flex items-center text-sm px-3 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30" data-unique-id="e25b02b4-740c-4103-8598-c0c7f77bb2ef" data-file-name="components/feature-tour.tsx" data-dynamic-text="true">
                {currentStep < tourSteps.length - 1 ? <>Next <ArrowRight size={14} className="ml-1" /></> : 'Finish'}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>;
}