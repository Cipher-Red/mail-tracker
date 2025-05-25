'use client';

import { useState, useEffect, useRef } from 'react';
import { setLocalStorage } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Users, FileText, BarChart } from 'lucide-react';
export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if user has seen welcome modal
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome') === 'true';

    // Delay showing the modal slightly to ensure smooth rendering
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeModal = () => {
    setIsClosing(true);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Delay the actual closing to allow the animation to complete
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      if (typeof window !== 'undefined') {
        try {
          setLocalStorage('hasSeenWelcome', 'true');
        } catch (e) {
          console.error('Failed to save welcome modal status to localStorage', e);
        }
      }
    }, 200);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  const steps = [{
    title: "Welcome to Detroit Axle Email Builder",
    description: "Create, manage, and send professionally designed emails to your customers with ease.",
    icon: <Mail className="w-12 h-12 text-primary" />
  }, {
    title: "Manage Your Customers",
    description: "Easily add, organize, and manage your customer database right from the app.",
    icon: <Users className="w-12 h-12 text-primary" />
  }, {
    title: "Create Beautiful Templates",
    description: "Design professional email templates with our easy-to-use template editor.",
    icon: <FileText className="w-12 h-12 text-primary" />
  }, {
    title: "Track Performance",
    description: "Analyze email performance with comprehensive analytics and insights.",
    icon: <BarChart className="w-12 h-12 text-primary" />
  }];
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      closeModal();
    }
  };
  if (!isOpen) return null;
  return <AnimatePresence mode="wait">
      <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} data-unique-id="3a701e3c-224a-405e-b4bf-0bded605d1a2" data-file-name="components/welcome-modal.tsx">
          <motion.div className="bg-background rounded-lg shadow-xl max-w-md w-full mx-4" initial={{
        scale: 0.9,
        opacity: 0
      }} animate={{
        scale: 1,
        opacity: 1
      }} exit={{
        scale: 0.9,
        opacity: 0
      }} transition={{
        type: "spring",
        damping: 25,
        stiffness: 300
      }} data-unique-id="b6324f6b-a0bf-40c5-9adf-026f15678b39" data-file-name="components/welcome-modal.tsx">
            <div className="flex justify-between items-center px-6 py-4 border-b border-border" data-unique-id="ce2e60f7-cdaf-4d7f-9687-705212cbb0fd" data-file-name="components/welcome-modal.tsx">
              <h2 className="text-xl font-semibold text-foreground" data-unique-id="435a5edc-1f99-48c2-aa7d-70b2a770b6b9" data-file-name="components/welcome-modal.tsx"><span className="editable-text" data-unique-id="db0cb66f-bf4a-44ed-91cb-dbd99b082eb6" data-file-name="components/welcome-modal.tsx">Getting Started</span></h2>
              <button onClick={e => {
            e.stopPropagation();
            closeModal();
          }} className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-accent/20 transition-colors" aria-label="Close welcome modal" data-unique-id="3e5875db-bd5a-4a84-8741-e65e2572a6d3" data-file-name="components/welcome-modal.tsx">
                <X size={20} />
              </button>
            </div>
            
            <div className="px-6 py-8" data-unique-id="0c78b3c4-9d52-4c21-9d7c-646be114a143" data-file-name="components/welcome-modal.tsx">
              <div className="flex flex-col items-center text-center" data-unique-id="d833262e-82b6-4db6-9f1d-232b90d7fd6d" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
                {steps[currentStep].icon}
                <h3 className="mt-4 text-lg font-medium text-foreground" data-unique-id="148df166-188c-4c99-8cf1-34d43ecf04cd" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
                  {steps[currentStep].title}
                </h3>
                <p className="mt-2 text-muted-foreground" data-unique-id="b48cae0e-509e-4881-8b23-f587d1ae3198" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
                  {steps[currentStep].description}
                </p>
              </div>
              
              <div className="flex justify-center mt-6" data-unique-id="cad1865d-d5fd-4b21-b132-154a434b4556" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
                {steps.map((_, i) => <div key={i} className={`w-2 h-2 mx-1 rounded-full ${i === currentStep ? 'bg-primary' : 'bg-border'}`} data-unique-id="cb6bf72c-a5cd-4953-bb58-e1ee3344b1ab" data-file-name="components/welcome-modal.tsx" />)}
              </div>
            </div>
            
            <div className="flex justify-between items-center px-6 py-4 border-t border-border" data-unique-id="69cad1dc-d234-4911-b6cc-29744653b7d2" data-file-name="components/welcome-modal.tsx">
              <button onClick={closeModal} className="text-sm text-muted-foreground hover:text-foreground" data-unique-id="92a0c037-e3d3-4ee6-b0cf-3269f996a866" data-file-name="components/welcome-modal.tsx"><span className="editable-text" data-unique-id="8a86230a-27ab-41e1-9901-90096e6e66af" data-file-name="components/welcome-modal.tsx">
                Skip
              </span></button>
              <button onClick={nextStep} className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors" data-unique-id="b970acd9-e9d3-4303-9f1e-dcff94cd318b" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
                {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>;
}