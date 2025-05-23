'use client';

import { useState, useEffect, useRef } from 'react';
import { setLocalStorage } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Users, FileText, BarChart, Moon, Sun, HelpCircle, FileSpreadsheet, PackageCheck } from 'lucide-react';
export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showAgain, setShowAgain] = useState(true);
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if user has seen welcome modal
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome') === 'true';

    // Delay showing the modal slightly to ensure smooth rendering
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 800);
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
          // Only save as seen if checkbox is checked
          if (showAgain === false) {
            setLocalStorage('hasSeenWelcome', 'true');
          } else {
            // If user wants to see it again, save that we've shown it once
            // but will show again after a few days
            setLocalStorage('welcomeLastShown', Date.now().toString());
          }
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
    title: "Welcome to Detroit Axle Tools",
    description: "This application helps you manage your customer communications and order processing with powerful, easy-to-use tools.",
    icon: <Mail className="w-12 h-12 text-primary" />,
    features: ["Email template creation and management", "Order data processing and validation", "Customer database management", "Email analytics and tracking"]
  }, {
    title: "Email Builder and Templates",
    description: "Create professional email templates for your customers with our easy-to-use editor.",
    icon: <FileText className="w-12 h-12 text-primary" />,
    features: ["Visual email template editor", "Custom variables support (customer name, order #, etc.)", "Save and reuse your favorite templates", "Preview emails before sending"]
  }, {
    title: "Order Data Processing",
    description: "Upload, clean, and validate order data from Excel or CSV files.",
    icon: <FileSpreadsheet className="w-12 h-12 text-primary" />,
    features: ["Import order data from Excel/CSV", "Automatic data cleaning and validation", "FedEx tracking number integration", "Send order updates to customers via email"]
  }, {
    title: "Customer Database",
    description: "Manage your customer information in one centralized location.",
    icon: <Users className="w-12 h-12 text-primary" />,
    features: ["Add and organize customer information", "Import customers from Excel", "Tag and filter customers by category", "Export customer data"]
  }, {
    title: "Personalization & Accessibility",
    description: "Use light and dark modes, get help with tooltips, and access the help center anytime.",
    icon: <HelpCircle className="w-12 h-12 text-primary" />,
    themeDemonstration: true,
    features: ["Toggle between light and dark modes", "Interactive help system and tooltips", "Step-by-step feature tours", "Easy access to help documentation"]
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
      <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} data-unique-id="0ab73ea4-65fe-440a-a6b9-8c8b60a01e52" data-file-name="components/welcome-modal.tsx">
        <motion.div className="bg-background rounded-lg shadow-xl max-w-lg w-full" initial={{
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
      }} data-unique-id="73039649-8be6-4b8d-9d4e-e07759147500" data-file-name="components/welcome-modal.tsx">
          <div className="flex justify-between items-center px-6 py-4 border-b border-border" data-unique-id="f965c9e7-d80f-4a60-aa7b-6c539780bcdf" data-file-name="components/welcome-modal.tsx">
            <h2 className="text-xl font-semibold text-foreground" data-unique-id="25b07042-c1e6-4119-b367-aaafa1b6e560" data-file-name="components/welcome-modal.tsx"><span className="editable-text" data-unique-id="26ec1d64-add4-4ffc-9d0a-e49283667acc" data-file-name="components/welcome-modal.tsx">
              Welcome to Detroit Axle Tools
            </span></h2>
            <button onClick={e => {
            e.stopPropagation();
            closeModal();
          }} className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-accent/20 transition-colors" aria-label="Close welcome modal" data-unique-id="1c2a4a91-21fb-4b6e-8fc0-54d63d825d11" data-file-name="components/welcome-modal.tsx">
              <X size={20} />
            </button>
          </div>
          
          <div className="px-6 py-8" data-unique-id="70f791ca-3e4c-4617-942d-26195961dc94" data-file-name="components/welcome-modal.tsx">
            <div className="flex flex-col items-center text-center" data-unique-id="c5ed66c3-216b-4c93-aded-1c7ac1039033" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
              {steps[currentStep].themeDemonstration ? <div className="flex items-center justify-center space-x-6 mb-4" data-unique-id="86ec6cf9-3fc9-46b0-88ad-9281a876444a" data-file-name="components/welcome-modal.tsx">
                  <div className="flex flex-col items-center" data-unique-id="37d6ee4f-e594-4c89-a49b-9dc2d79251b1" data-file-name="components/welcome-modal.tsx">
                    <div className="w-12 h-12 rounded-full bg-white border border-border flex items-center justify-center" data-unique-id="18597566-beff-4584-ac2e-32f729793d87" data-file-name="components/welcome-modal.tsx">
                      <Sun className="w-6 h-6 text-amber-500" />
                    </div>
                    <span className="mt-2 text-sm" data-unique-id="57ee2b62-ab35-4452-97e2-453e76e9f8b3" data-file-name="components/welcome-modal.tsx"><span className="editable-text" data-unique-id="bf8d2a70-ced0-4ba8-adaf-8db3f4bbf0d2" data-file-name="components/welcome-modal.tsx">Light Mode</span></span>
                  </div>
                  <motion.div animate={{
                x: [0, 10, -10, 10, -10, 0]
              }} transition={{
                duration: 1,
                repeat: 3,
                repeatType: "reverse"
              }} className="text-primary" data-unique-id="11e85f65-bb9a-48b1-b102-06f6d05304b4" data-file-name="components/welcome-modal.tsx">
                    <PackageCheck className="w-8 h-8" />
                  </motion.div>
                  <div className="flex flex-col items-center" data-unique-id="45d3f2d9-30b8-4a9a-a825-37d84b08fe15" data-file-name="components/welcome-modal.tsx">
                    <div className="w-12 h-12 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center" data-unique-id="65720827-fbdd-4d3d-8ee5-49a66f0f1f87" data-file-name="components/welcome-modal.tsx">
                      <Moon className="w-6 h-6 text-blue-400" />
                    </div>
                    <span className="mt-2 text-sm" data-unique-id="d7efb1e1-3355-4077-acc1-4996df073e38" data-file-name="components/welcome-modal.tsx"><span className="editable-text" data-unique-id="a320837a-699e-4f71-a87f-2e969dc57e3f" data-file-name="components/welcome-modal.tsx">Dark Mode</span></span>
                  </div>
                </div> : steps[currentStep].icon}
              
              <h3 className="mt-4 text-lg font-medium text-foreground" data-unique-id="a44790aa-04b2-4590-bdac-2cab3abdec38" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
                {steps[currentStep].title}
              </h3>
              <p className="mt-2 text-muted-foreground" data-unique-id="984b2258-1782-4a2d-93a6-505310307151" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
                {steps[currentStep].description}
              </p>

              {/* Feature bullets */}
              <div className="mt-6 text-left w-full" data-unique-id="e719d3a8-508d-4b43-a063-5a006e1260b2" data-file-name="components/welcome-modal.tsx">
                <ul className="space-y-2" data-unique-id="5adb9f27-f818-4f98-bd1d-481750832357" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
                  {steps[currentStep].features.map((feature, i) => <motion.li key={i} className="flex items-start" initial={{
                  opacity: 0,
                  x: -10
                }} animate={{
                  opacity: 1,
                  x: 0
                }} transition={{
                  delay: i * 0.1
                }} data-unique-id="fa7e63f0-6c64-4ced-b92a-75715ed3dd7c" data-file-name="components/welcome-modal.tsx">
                      <span className="inline-block w-5 h-5 bg-primary/10 rounded-full mr-2 flex-shrink-0 flex items-center justify-center" data-unique-id="a810467c-a088-419b-85dd-2d864115fb86" data-file-name="components/welcome-modal.tsx">
                        <Check className="w-3 h-3 text-primary" data-unique-id="22f2afb2-2f9c-41ab-87d0-c202a71ffb1b" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true" />
                      </span>
                      <span className="text-sm" data-unique-id="e0e455aa-d60b-4a24-87e8-3bf78997c9fc" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">{feature}</span>
                    </motion.li>)}
                </ul>
              </div>
            </div>
            
            <div className="flex justify-center mt-6" data-unique-id="d8ed0f18-ff39-415f-88e6-ecab8292fcbc" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
              {steps.map((_, i) => <div key={i} className={`w-2 h-2 mx-1 rounded-full transition-colors ${i === currentStep ? 'bg-primary' : 'bg-border'}`} onClick={() => setCurrentStep(i)} style={{
              cursor: 'pointer'
            }} data-unique-id="d4014b13-c2a5-4696-b189-683d9ddc485c" data-file-name="components/welcome-modal.tsx" />)}
            </div>
          </div>
          
          <div className="flex justify-between items-center px-6 py-4 border-t border-border" data-unique-id="25a232fa-2371-4c37-843d-f7ddf776da43" data-file-name="components/welcome-modal.tsx">
            <label className="flex items-center text-sm cursor-pointer" data-unique-id="32a246fa-ce3c-47ce-8b0e-7faddcc867e0" data-file-name="components/welcome-modal.tsx">
              <input type="checkbox" checked={!showAgain} onChange={() => setShowAgain(!showAgain)} className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" data-unique-id="d58e24c5-aa6a-4493-9afa-44435dc81d11" data-file-name="components/welcome-modal.tsx" /><span className="editable-text" data-unique-id="8ae2ee9d-cb37-49f8-8b21-b3a9b48782f0" data-file-name="components/welcome-modal.tsx">
              Don't show again
            </span></label>
            <div className="flex space-x-2" data-unique-id="fe574150-787e-4d1b-9d58-b7dbbbb9887e" data-file-name="components/welcome-modal.tsx">
              <button onClick={closeModal} className="px-4 py-2 border border-border text-sm rounded-md hover:bg-accent/10 transition-colors" data-unique-id="3c3e870e-9ba9-44da-a5ac-9eac83db4406" data-file-name="components/welcome-modal.tsx"><span className="editable-text" data-unique-id="b1f6760a-c3dd-4990-a34d-02b046591c0b" data-file-name="components/welcome-modal.tsx">
                Skip
              </span></button>
              <button onClick={nextStep} className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors" data-unique-id="5128fab4-24d8-4d69-a204-e854cce12a16" data-file-name="components/welcome-modal.tsx" data-dynamic-text="true">
                {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>;
}

// Helper icon component for Check mark
function Check(props: {
  className?: string;
}) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={props.className} data-unique-id="70bd3b12-3e96-456e-aa90-58a66e97fbd3" data-file-name="components/welcome-modal.tsx">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>;
}