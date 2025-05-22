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
  return <div className="fixed inset-0 z-[100] pointer-events-none" data-unique-id="9481ea1e-536d-4b0e-973b-3226ae901365" data-file-name="components/feature-tour.tsx">
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
      }} style={tooltipStyles} className="max-w-xs pointer-events-auto" data-unique-id="89cc2113-3367-4234-9d86-62e49b847385" data-file-name="components/feature-tour.tsx">
          <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-4" data-unique-id="82d88668-01c4-455f-8420-064ddfaaf516" data-file-name="components/feature-tour.tsx">
            <div className="flex justify-between items-center mb-2" data-unique-id="7ba03dae-8c64-4981-8c8f-be30803ef406" data-file-name="components/feature-tour.tsx">
              <h3 className="font-medium" data-unique-id="370ffaca-807a-4250-a327-429ed04e14d0" data-file-name="components/feature-tour.tsx" data-dynamic-text="true">{title}</h3>
              <button onClick={endTour} className="text-primary-foreground opacity-70 hover:opacity-100" data-unique-id="6b0f3c89-72c7-48aa-98a7-e14cdf8d33c6" data-file-name="components/feature-tour.tsx">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm mb-3" data-unique-id="92d7f599-e437-4d08-8372-f61308c7238c" data-file-name="components/feature-tour.tsx" data-dynamic-text="true">{description}</p>
            <div className="flex justify-between items-center" data-unique-id="5a3732b8-5d31-4e46-b848-3df6a6e74c3a" data-file-name="components/feature-tour.tsx">
              <div className="text-xs opacity-70" data-unique-id="b65cd270-10b0-460d-a657-61c9b9130b7f" data-file-name="components/feature-tour.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="58c4b5b3-6d15-4c55-b5bf-4fcab772b16f" data-file-name="components/feature-tour.tsx">
                Step </span>{currentStep + 1}<span className="editable-text" data-unique-id="2f522e51-3e83-4d82-b382-c4eca5cdd16c" data-file-name="components/feature-tour.tsx"> of </span>{tourSteps.length}
              </div>
              <button onClick={nextStep} className="flex items-center text-sm px-3 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30" data-unique-id="7cb6cb8a-4ccf-4f98-b321-0ece63af6c06" data-file-name="components/feature-tour.tsx" data-dynamic-text="true">
                {currentStep < tourSteps.length - 1 ? <>Next <ArrowRight size={14} className="ml-1" /></> : 'Finish'}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>;
}