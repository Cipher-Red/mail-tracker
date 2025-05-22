'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Users, FileText, BarChart } from 'lucide-react';
export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
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
  const closeModal = () => {
    setIsOpen(false);
    const saveToLocalStorage = () => {
      if (typeof window !== 'undefined') {
        try {
          const storage = window.localStorage;
          storage.setItem('hasSeenWelcome', 'true');
        } catch (e) {
          console.error('Failed to save welcome modal status to localStorage', e);
        }
      }
    };
    saveToLocalStorage();
  };
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
  return <AnimatePresence>
      {isOpen && <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} data-unique-id="2a99e41d-5dbc-40a8-8ba9-01a040b85afe" data-file-name="components/welcome-modal.tsx">
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
      }} data-unique-id="a1168082-7054-4aa5-8f79-aa845b9eca71" data-file-name="components/welcome-modal.tsx">
            <div className="flex justify-between items-center px-6 py-4 border-b border-border" data-unique-id="c8cd660f-21cb-468b-b305-48a100b79160" data-file-name="components/welcome-modal.tsx">
              <h2 className="text-xl font-semibold text-foreground" data-unique-id="98fdfc9f-faf9-4af4-94f8-6b18ad78fcc6" data-file-name="components/welcome-modal.tsx"><span className="editable-text" data-unique-id="46cd990c-64e3-47bf-a608-fc01cedd4643" data-file-name="components/welcome-modal.tsx">Getting Started</span></h2>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground" data-unique-id="2b674610-83bf-485f-85dc-d3539427bd03" data-file-name="components/welcome-modal.tsx">
                <X size={20} />
              </button>
            </div>
            
            <div className="px-6 py-8" data-unique-id="9f2ba167-f80f-4e11-8cd4-7814a06c8eb4" data-file-name="components/welcome-modal.tsx">
              <div className="flex flex-col items-center text-center" data-unique-id="52d4f973-8a81-4b83-ab4b-98508ddeaabf" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
                {steps[currentStep].icon}
                <h3 className="mt-4 text-lg font-medium text-foreground" data-unique-id="228601b2-d173-43d8-b98d-90b5340df3db" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
                  {steps[currentStep].title}
                </h3>
                <p className="mt-2 text-muted-foreground" data-unique-id="7e6b1e70-fe51-4a02-866f-93675d8d89f1" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
                  {steps[currentStep].description}
                </p>
              </div>
              
              <div className="flex justify-center mt-6" data-unique-id="c27a2bf2-da1d-4707-854a-d8677dfe1ab4" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
                {steps.map((_, i) => <div key={i} className={`w-2 h-2 mx-1 rounded-full ${i === currentStep ? 'bg-primary' : 'bg-border'}`} data-unique-id="eb7d8ca2-c741-4106-9150-348653e792c1" data-file-name="components/welcome-modal.tsx" />)}
              </div>
            </div>
            
            <div className="flex justify-between items-center px-6 py-4 border-t border-border" data-unique-id="c1901ef0-d731-4040-894d-67de983da24f" data-file-name="components/welcome-modal.tsx">
              <button onClick={closeModal} className="text-sm text-muted-foreground hover:text-foreground" data-unique-id="1b2735e4-ac23-41b8-8bc9-623441fa04e8" data-file-name="components/welcome-modal.tsx"><span className="editable-text" data-unique-id="ccc0f1f6-859c-40e7-93b3-cfbf0f719158" data-file-name="components/welcome-modal.tsx">
                Skip
              </span></button>
              <button onClick={nextStep} className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors" data-unique-id="95d5259b-9b65-41f3-8af4-50d4284ab8f1" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
                {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
              </button>
            </div>
          </motion.div>
        </motion.div>}
    </AnimatePresence>;
}