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
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('hasSeenWelcome', 'true');
      } catch (e) {
        console.error('Failed to save welcome modal status to localStorage', e);
      }
    }
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
    }} data-unique-id="2ad17b8b-7bf6-4721-8d95-65cb0494d5cb" data-file-name="components/welcome-modal.tsx">
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
      }} data-unique-id="599f0645-4787-4177-a18b-d84daa222694" data-file-name="components/welcome-modal.tsx">
            <div className="flex justify-between items-center px-6 py-4 border-b border-border" data-unique-id="bcbd0110-b977-43de-a94b-fe4d79d21942" data-file-name="components/welcome-modal.tsx">
              <h2 className="text-xl font-semibold text-foreground" data-unique-id="5c93b617-7fa9-471e-be7d-da9fa4d69b03" data-file-name="components/welcome-modal.tsx"><span className="editable-text" data-unique-id="6ed0c793-a473-47c6-88e5-6578c8c9c288" data-file-name="components/welcome-modal.tsx">Getting Started</span></h2>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground" data-unique-id="40634f8f-5a6a-4563-bcae-c66f2127745f" data-file-name="components/welcome-modal.tsx">
                <X size={20} />
              </button>
            </div>
            
            <div className="px-6 py-8" data-unique-id="2e69f651-f50e-4795-b925-311f6f9e360a" data-file-name="components/welcome-modal.tsx">
              <div className="flex flex-col items-center text-center" data-unique-id="650ed043-9a2f-4ae1-862e-1293490009ee" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
                {steps[currentStep].icon}
                <h3 className="mt-4 text-lg font-medium text-foreground" data-unique-id="17c653ac-f26e-4396-a28d-3575af976a6d" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
                  {steps[currentStep].title}
                </h3>
                <p className="mt-2 text-muted-foreground" data-unique-id="bc992e65-fa8a-4ef5-8551-ee07c2a9e732" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
                  {steps[currentStep].description}
                </p>
              </div>
              
              <div className="flex justify-center mt-6" data-unique-id="82543ffe-fd22-4d3b-a827-ebad5c596865" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
                {steps.map((_, i) => <div key={i} className={`w-2 h-2 mx-1 rounded-full ${i === currentStep ? 'bg-primary' : 'bg-border'}`} data-unique-id="e42e9076-2982-489e-95f9-4a12bf3b0891" data-file-name="components/welcome-modal.tsx" />)}
              </div>
            </div>
            
            <div className="flex justify-between items-center px-6 py-4 border-t border-border" data-unique-id="269de658-9bd7-46a2-9b7b-2f3f2e8af10f" data-file-name="components/welcome-modal.tsx">
              <button onClick={closeModal} className="text-sm text-muted-foreground hover:text-foreground" data-unique-id="9800c69f-37d7-409a-8be5-b86bdd24fe3d" data-file-name="components/welcome-modal.tsx"><span className="editable-text" data-unique-id="e1d7ba3a-2c7a-4c7c-b226-0daab99512f9" data-file-name="components/welcome-modal.tsx">
                Skip
              </span></button>
              <button onClick={nextStep} className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors" data-unique-id="86103579-0969-4026-8210-b88392c8fb9f" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
                {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
              </button>
            </div>
          </motion.div>
        </motion.div>}
    </AnimatePresence>;
}