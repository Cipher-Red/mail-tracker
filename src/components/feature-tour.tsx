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
  return <div className="fixed inset-0 z-[100] pointer-events-none" data-unique-id="47f72ffd-5432-4b74-9093-e997af636e37" data-file-name="components/feature-tour.tsx">
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
      }} style={tooltipStyles} className="max-w-xs pointer-events-auto" data-unique-id="498ad1b9-03e2-45ca-ae68-f91246d06f8b" data-file-name="components/feature-tour.tsx">
          <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-4" data-unique-id="e3a5ef0e-a210-4c8c-9ca7-dde4fea66e55" data-file-name="components/feature-tour.tsx">
            <div className="flex justify-between items-center mb-2" data-unique-id="cfd0ea3d-cc64-4093-8e85-3536074d8b50" data-file-name="components/feature-tour.tsx">
              <h3 className="font-medium" data-unique-id="ca0937f1-98e7-423e-aa19-45452e0323d7" data-file-name="components/feature-tour.tsx" data-dynamic-text="true">{title}</h3>
              <button onClick={endTour} className="text-primary-foreground opacity-70 hover:opacity-100" data-unique-id="abc809ab-1052-44cd-9564-cbc012f550c2" data-file-name="components/feature-tour.tsx">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm mb-3" data-unique-id="f2b0bef1-6721-4a5f-8fda-be572740e331" data-file-name="components/feature-tour.tsx" data-dynamic-text="true">{description}</p>
            <div className="flex justify-between items-center" data-unique-id="10bee0e7-b8b0-4ae8-95a4-8235fe128871" data-file-name="components/feature-tour.tsx">
              <div className="text-xs opacity-70" data-unique-id="5b865ed2-e4fe-4088-8f13-be1351bb6018" data-file-name="components/feature-tour.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="4e6b3700-83ad-49e9-b4b1-d6182af05365" data-file-name="components/feature-tour.tsx">
                Step </span>{currentStep + 1}<span className="editable-text" data-unique-id="b5c86ac4-5cfb-4f26-b95f-763108dffdb9" data-file-name="components/feature-tour.tsx"> of </span>{tourSteps.length}
              </div>
              <button onClick={nextStep} className="flex items-center text-sm px-3 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30" data-unique-id="daae5128-3ae6-42b6-a213-360524068a91" data-file-name="components/feature-tour.tsx" data-dynamic-text="true">
                {currentStep < tourSteps.length - 1 ? <>Next <ArrowRight size={14} className="ml-1" /></> : 'Finish'}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>;
}