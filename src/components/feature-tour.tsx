'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, HelpCircle, Mail, Users, FileText } from 'lucide-react';

// Types for tour steps
interface TourStep {
  elementId: string;
  title: string;
  description: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  action?: string;
  highlightElement?: boolean;
}
export function FeatureTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  const [startTour, setStartTour] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const highlightOverlayRef = useRef<HTMLDivElement | null>(null);

  // Add an offset to ensure tooltip doesn't overlap with elements
  const POSITION_OFFSET = 20;

  // Extended tour steps with more context and guidance
  const tourSteps: TourStep[] = [{
    elementId: 'tour-template-editor',
    title: 'Create Email Templates',
    description: 'Design beautiful email templates with our easy-to-use editor. Add customer variables like name and order details to personalize each message.',
    position: 'bottom',
    action: 'Click to edit and customize your templates',
    highlightElement: true
  }, {
    elementId: 'tour-customers',
    title: 'Manage Your Customers',
    description: 'Keep track of all your customers in one place. Import from Excel, add tags, and organize your contact database easily.',
    position: 'bottom',
    action: 'Click to add or edit customer information',
    highlightElement: true
  }, {
    elementId: 'tour-email-preview',
    title: 'Preview Your Emails',
    description: 'See exactly how your emails will look before sending them. Test with sample data to ensure everything is perfect.',
    position: 'left',
    action: 'Your email preview appears here',
    highlightElement: true
  }, {
    elementId: 'tour-send-emails',
    title: 'Send Bulk Emails',
    description: 'Easily send personalized emails to multiple customers at once. You can upload a spreadsheet or use your saved customer database.',
    position: 'top',
    action: 'Switch to this tab to start sending emails',
    highlightElement: true
  }, {
    elementId: 'tour-dark-mode',
    title: 'Customize Your Experience',
    description: 'Switch between light and dark mode based on your preference. Dark mode is easier on the eyes during night work.',
    position: 'left',
    action: 'Click this button to toggle between light and dark mode',
    highlightElement: true
  }];

  // Function to apply highlight effect to the current element
  const highlightCurrentElement = useCallback(() => {
    if (!isVisible || !tourSteps[currentStep]?.highlightElement) {
      if (highlightedElement) {
        setHighlightedElement(null);
      }
      return;
    }
    try {
      const elementId = tourSteps[currentStep].elementId;
      const element = typeof document !== 'undefined' ? document.getElementById(elementId) : null;
      if (element) {
        setHighlightedElement(element);

        // Apply highlight styling
        element.classList.add('relative', 'z-10');

        // Create and position overlay
        if (highlightOverlayRef.current) {
          const rect = element.getBoundingClientRect();
          const overlay = highlightOverlayRef.current;
          overlay.style.position = 'fixed';
          overlay.style.top = `${rect.top - 8}px`;
          overlay.style.left = `${rect.left - 8}px`;
          overlay.style.width = `${rect.width + 16}px`;
          overlay.style.height = `${rect.height + 16}px`;
          overlay.style.backgroundColor = 'var(--highlight)';
          overlay.style.borderRadius = '8px';
          overlay.style.border = '2px solid var(--highlight-border)';
          overlay.style.zIndex = '5';
          overlay.style.pointerEvents = 'none';
          overlay.style.opacity = '1';

          // Add pulsing animation
          overlay.style.animation = 'pulse 2s infinite';
        }
      }
    } catch (e) {
      console.error('Error highlighting element:', e);
    }
  }, [currentStep, isVisible, tourSteps, highlightedElement]);

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

        // Ensure the element is in view with some padding
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });

        // Apply highlight effect
        highlightCurrentElement();
      } catch (e) {
        console.error('Error positioning tooltip:', e);
      }
    });
  }, [currentStep, tourSteps, highlightCurrentElement]);

  // Setup effects for initialization and positioning
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasTakenTour = localStorage.getItem('hasTakenTour') === 'true';

    // Show the "Start Tour" button if user hasn't taken the tour
    if (!hasTakenTour) {
      const timer = setTimeout(() => {
        setStartTour(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Start the tour when user clicks the start button
  const beginTour = useCallback(() => {
    setStartTour(false);
    setIsVisible(true);

    // Small delay to ensure DOM is ready
    setTimeout(() => {
      positionTooltip();
    }, 100);
  }, [positionTooltip]);

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
    // Clean up highlight effects
    if (highlightedElement) {
      highlightedElement.classList.remove('relative', 'z-10');
      setHighlightedElement(null);
    }
    setIsVisible(false);

    // Safe localStorage access
    try {
      if (typeof window !== 'undefined') {
        const storage = window.localStorage;
        if (storage) {
          storage.setItem('hasTakenTour', 'true');
        }
      }
    } catch (e) {
      console.error('Failed to save tour completion status to localStorage', e);
    }
  };

  // Calculate tooltip styles based on position
  const getTooltipStyles = (): React.CSSProperties => {
    if (!isVisible) return {};
    const currentTourStep = tourSteps[currentStep];
    if (!currentTourStep) return {};
    const {
      position: tooltipPosition = 'bottom'
    } = currentTourStep;
    const tooltipStyles: React.CSSProperties = {
      position: 'fixed',
      zIndex: 100
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
    return tooltipStyles;
  };
  return <>
      {/* Highlight overlay div */}
      <div ref={highlightOverlayRef} className="fixed pointer-events-none" data-unique-id="f0170af3-d3f1-4e36-9977-161b522c2373" data-file-name="components/feature-tour.tsx" />

      {/* Start tour button */}
      <AnimatePresence>
        {startTour && <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        scale: 0.8
      }} className="fixed bottom-5 right-5 z-50 pointer-events-auto" data-unique-id="e076fbe7-5249-4883-a13c-708c066cc366" data-file-name="components/feature-tour.tsx">
            <button onClick={beginTour} className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors" data-unique-id="05d4295c-7a80-4d99-91d2-6c467ccf890d" data-file-name="components/feature-tour.tsx">
              <HelpCircle size={18} />
              <span data-unique-id="ba74b62e-2d38-4393-a221-d73c92322210" data-file-name="components/feature-tour.tsx"><span className="editable-text" data-unique-id="fb6b7a18-7b7a-4eae-8626-a591bcb6e5bb" data-file-name="components/feature-tour.tsx">Take a quick tour</span></span>
            </button>
          </motion.div>}
      </AnimatePresence>

      {/* Tour tooltip */}
      <div className="fixed inset-0 z-[100] pointer-events-none" data-unique-id="22c04cc6-badb-4066-97e4-9bf0cc539e0f" data-file-name="components/feature-tour.tsx">
        <AnimatePresence>
          {isVisible && tourSteps[currentStep] && <motion.div initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} exit={{
          opacity: 0,
          scale: 0.9
        }} style={getTooltipStyles()} className="max-w-xs pointer-events-auto" data-unique-id="28d7f402-da9f-458f-bff2-9ee3f2ef61da" data-file-name="components/feature-tour.tsx" data-dynamic-text="true">
              <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-4" data-unique-id="d696a6c7-54a1-42ee-9172-2edefc07570e" data-file-name="components/feature-tour.tsx" data-dynamic-text="true">
                <div className="flex justify-between items-center mb-3" data-unique-id="2e0a5c69-b05f-47e2-a3c8-03c6850c3337" data-file-name="components/feature-tour.tsx">
                  <h3 className="font-medium flex items-center" data-unique-id="8f7f2f9b-8597-414d-a0d8-68b5102710ea" data-file-name="components/feature-tour.tsx" data-dynamic-text="true">
                    {currentStep === 0 && <Mail size={16} className="mr-2" />}
                    {currentStep === 1 && <Users size={16} className="mr-2" />}
                    {currentStep === 2 && <FileText size={16} className="mr-2" />}
                    {tourSteps[currentStep].title}
                  </h3>
                  <button onClick={endTour} className="text-primary-foreground opacity-70 hover:opacity-100 p-1 rounded-full hover:bg-white/10" data-unique-id="41dfbc80-1a06-4a5b-b122-13e14d67fd26" data-file-name="components/feature-tour.tsx">
                    <X size={16} />
                  </button>
                </div>
                
                <p className="text-sm mb-4" data-unique-id="be22c17c-4651-4c45-8312-80e11879c74e" data-file-name="components/feature-tour.tsx" data-dynamic-text="true">{tourSteps[currentStep].description}</p>
                
                {tourSteps[currentStep].action && <div className="bg-white/10 px-3 py-2 text-xs rounded mb-4 font-medium" data-unique-id="77f91bc5-8851-4da7-bf75-9ac4f1acc1f7" data-file-name="components/feature-tour.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="c26eb481-5727-40be-9d57-336c4b02b638" data-file-name="components/feature-tour.tsx">
                    💡 </span>{tourSteps[currentStep].action}
                  </div>}
                
                <div className="flex justify-between items-center" data-unique-id="125b76ed-06a7-4e97-a4bb-471ba77e11a9" data-file-name="components/feature-tour.tsx">
                  <div className="flex space-x-1" data-unique-id="d2c46ffb-d098-4915-9dcc-bb4a20419090" data-file-name="components/feature-tour.tsx" data-dynamic-text="true">
                    {tourSteps.map((_, i) => <div key={i} className={`w-2 h-2 rounded-full transition-all duration-200 ${i === currentStep ? 'bg-white' : 'bg-white/30'}`} data-unique-id="954f6112-f9ff-46e5-8400-21ff17b4b050" data-file-name="components/feature-tour.tsx" />)}
                  </div>
                  
                  <button onClick={nextStep} className="flex items-center text-sm px-3 py-1.5 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors" data-unique-id="76be3847-f066-4594-bb66-cf8bb76fd41f" data-file-name="components/feature-tour.tsx" data-dynamic-text="true">
                    {currentStep < tourSteps.length - 1 ? <>
                        Next <ArrowRight size={14} className="ml-1.5" />
                      </> : 'Finish'}
                  </button>
                </div>
              </div>
              
              {/* Position indicator arrow */}
              <div className="tooltip-arrow" style={{
            ...(tourSteps[currentStep].position === 'bottom' && {
              top: '-4px',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)'
            }),
            ...(tourSteps[currentStep].position === 'top' && {
              bottom: '-4px',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)'
            }),
            ...(tourSteps[currentStep].position === 'left' && {
              right: '-4px',
              top: '50%',
              transform: 'translateY(-50%) rotate(45deg)'
            }),
            ...(tourSteps[currentStep].position === 'right' && {
              left: '-4px',
              top: '50%',
              transform: 'translateY(-50%) rotate(45deg)'
            })
          }} data-unique-id="cb7b20e8-a797-4a33-ac67-b5183120a8b2" data-file-name="components/feature-tour.tsx" />
            </motion.div>}
        </AnimatePresence>
      </div>
      
      {/* Add event listener for forced tour start */}
      <FeatureTourEventHandler onStart={() => {
      setStartTour(false);
      setIsVisible(true);
      // Reset current step
      setCurrentStep(0);

      // Small delay to ensure DOM is ready
      setTimeout(() => {
        positionTooltip();
      }, 100);
    }} />
    </>;
}

// Separate component to handle the event listener
function FeatureTourEventHandler({
  onStart
}: {
  onStart: () => void;
}) {
  useEffect(() => {
    const handleStartTour = () => {
      onStart();
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('startFeatureTour', handleStartTour);
      return () => {
        window.removeEventListener('startFeatureTour', handleStartTour);
      };
    }
  }, [onStart]);
  return null;
}