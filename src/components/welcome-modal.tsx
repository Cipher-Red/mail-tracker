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
    }} data-unique-id="6ba736cc-f572-42d3-bb70-88b1a0892907" data-file-name="components/welcome-modal.tsx">
          <motion.div className="bg-card rounded-lg shadow-xl max-w-md w-full mx-4" initial={{
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
      }} data-unique-id="c15437f4-5be5-4a06-aac2-bc3d9848eae8" data-file-name="components/welcome-modal.tsx">
            <div className="flex justify-between items-center px-6 py-4 border-b border-border" data-unique-id="f010bdfa-2083-4101-8d47-18ee4de3de3c" data-file-name="components/welcome-modal.tsx">
              <h2 className="text-xl font-semibold text-foreground" data-unique-id="d44072eb-e863-422e-a125-b91e00b478ee" data-file-name="components/welcome-modal.tsx"><span className="editable-text" data-unique-id="3dc76a4c-eef2-4877-86a3-946b46214139" data-file-name="components/welcome-modal.tsx">Getting Started</span></h2>
              <button onClick={e => {
            e.stopPropagation();
            closeModal();
          }} className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-accent/20 transition-colors" aria-label="Close welcome modal" data-unique-id="2f241e53-7055-45c4-a968-6cc5888f1300" data-file-name="components/welcome-modal.tsx">
                <X size={20} />
              </button>
            </div>
            
            <div className="px-6 py-8" data-unique-id="d66274d8-85da-4d53-82a2-96ee2ef84e7d" data-file-name="components/welcome-modal.tsx">
              <div className="flex flex-col items-center text-center" data-unique-id="deceeb8b-8951-4882-9b50-8994a0344d4c" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
                {steps[currentStep].icon}
                <h3 className="mt-4 text-lg font-medium text-foreground" data-unique-id="28f0afc0-489d-4cda-915c-d51cf54493e8" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
                  {steps[currentStep].title}
                </h3>
                <p className="mt-2 text-muted-foreground" data-unique-id="8b6a26a1-dc1a-4e06-81b7-8e10bc530784" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
                  {steps[currentStep].description}
                </p>
              </div>
              
              <div className="flex justify-center mt-6" data-unique-id="1c3c19e0-af32-4e00-a5a4-c9e7dcbd3f80" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
                {steps.map((_, i) => <div key={i} className={`w-2 h-2 mx-1 rounded-full ${i === currentStep ? 'bg-primary' : 'bg-border'}`} data-unique-id="2a908841-f16b-4b45-bfa1-dcbcdbbd6d7b" data-file-name="components/welcome-modal.tsx" />)}
              </div>
            </div>
            
            <div className="flex justify-between items-center px-6 py-4 border-t border-border" data-unique-id="6c0f4aa2-5e41-4d2c-9d29-d7cfa6636104" data-file-name="components/welcome-modal.tsx">
              <button onClick={closeModal} className="text-sm text-muted-foreground hover:text-foreground" data-unique-id="8c5e96fc-58b6-49e8-8f40-e2133fd140f7" data-file-name="components/welcome-modal.tsx"><span className="editable-text" data-unique-id="4baacba3-010d-4409-86ef-03b0f65a8af1" data-file-name="components/welcome-modal.tsx">
                Skip
              </span></button>
              <button onClick={nextStep} className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors" data-unique-id="b3e78e9c-5522-4fc5-a4e3-67a2c2f113a4" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
                {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>;
}