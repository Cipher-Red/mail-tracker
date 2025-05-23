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
    }} data-unique-id="9ed923f2-746c-41b6-a623-e8bc77864174" data-file-name="components/welcome-modal.tsx">
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
      }} data-unique-id="640d9653-83f9-4727-a49f-623a484cf486" data-file-name="components/welcome-modal.tsx">
            <div className="flex justify-between items-center px-6 py-4 border-b border-border" data-unique-id="ff2d03d3-7841-4d68-aa3d-6f78a0d9ea22" data-file-name="components/welcome-modal.tsx">
              <h2 className="text-xl font-semibold text-foreground" data-unique-id="52bd2cd0-33b4-4534-b69b-3c5467bedea3" data-file-name="components/welcome-modal.tsx"><span className="editable-text" data-unique-id="2ad319b9-ad65-4073-9585-4574de301088" data-file-name="components/welcome-modal.tsx">Getting Started</span></h2>
              <button onClick={e => {
            e.stopPropagation();
            closeModal();
          }} className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-accent/20 transition-colors" aria-label="Close welcome modal" data-unique-id="c9a97492-4145-4f34-82f8-b1d97485442a" data-file-name="components/welcome-modal.tsx">
                <X size={20} />
              </button>
            </div>
            
            <div className="px-6 py-8" data-unique-id="75987259-f05c-45ae-9d51-807280499322" data-file-name="components/welcome-modal.tsx">
              <div className="flex flex-col items-center text-center" data-unique-id="56423e4b-907b-4439-839b-32b651481849" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
                {steps[currentStep].icon}
                <h3 className="mt-4 text-lg font-medium text-foreground" data-unique-id="43a99721-0e14-4141-ba65-ef004e9bfdc1" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
                  {steps[currentStep].title}
                </h3>
                <p className="mt-2 text-muted-foreground" data-unique-id="50e5696e-c887-46cb-96e9-3a90808495f3" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
                  {steps[currentStep].description}
                </p>
              </div>
              
              <div className="flex justify-center mt-6" data-unique-id="b4fa18ef-a2f1-4970-adf4-c7beb3bbd9a2" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
                {steps.map((_, i) => <div key={i} className={`w-2 h-2 mx-1 rounded-full ${i === currentStep ? 'bg-primary' : 'bg-border'}`} data-unique-id="58478d59-6db3-43e6-a992-bcd5b3397d45" data-file-name="components/welcome-modal.tsx" />)}
              </div>
            </div>
            
            <div className="flex justify-between items-center px-6 py-4 border-t border-border" data-unique-id="5e12ddd3-1d39-4c43-a6d0-0914a555affe" data-file-name="components/welcome-modal.tsx">
              <button onClick={closeModal} className="text-sm text-muted-foreground hover:text-foreground" data-unique-id="b9243503-e326-493a-b5ea-64a0caea4644" data-file-name="components/welcome-modal.tsx"><span className="editable-text" data-unique-id="a12cf298-bfcc-412b-896d-f89e8f926a55" data-file-name="components/welcome-modal.tsx">
                Skip
              </span></button>
              <button onClick={nextStep} className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors" data-unique-id="493e9cad-d312-42ae-b1af-9b9751f8d2c2" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
                {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>;
}