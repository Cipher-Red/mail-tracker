'use client';
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ThemeToggle } from './theme-toggle';
import { MainNav } from './main-nav';
import { UserPreferences } from './user-preferences';
import { HelpCircle, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { Tooltip } from './tooltip';
import { useSmartGuide } from './smart-guide-provider';
export function Header() {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const {
    resetAllGuides
  } = useSmartGuide();
  const openHelpModal = () => {
    if (typeof window !== 'undefined') {
      // Use custom event to communicate with help-modal component
      const event = new CustomEvent('openHelpModal');
      window.dispatchEvent(event);
    }
  };

  // Function to restart all guides
  const restartGuides = () => {
    resetAllGuides();
    alert("All guides have been reset. You'll see them as you navigate through the app.");
  };
  return <motion.header initial={{
    y: -10,
    opacity: 0
  }} animate={{
    y: 0,
    opacity: 1
  }} transition={{
    duration: 0.3
  }} className="sticky top-0 z-40 bg-background border-b border-border" data-unique-id="50a5274b-2b1d-4211-8c44-a1729834c047" data-file-name="components/header.tsx">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between" data-unique-id="1d9810bc-5d4f-4331-b76e-e024849c569c" data-file-name="components/header.tsx">
        <div className="flex items-center" data-unique-id="bb486d52-d567-47d4-a98c-f38dd137d9dd" data-file-name="components/header.tsx">
          <Link href="/" className="flex items-center space-x-2" data-unique-id="6f896cb3-b4b7-4a46-9698-58309504a3b2" data-file-name="components/header.tsx">
            <span className="font-bold text-xl text-primary" data-unique-id="d1e2822a-1d1a-4dec-bac1-5e4a21fc4759" data-file-name="components/header.tsx"><span className="editable-text" data-unique-id="2c176257-fa8c-4d57-b3d5-508336985e27" data-file-name="components/header.tsx">Detroit Axle</span></span>
            <span className="text-sm text-muted-foreground" data-unique-id="62e46ac9-2b62-4555-a4af-b307dc43ad18" data-file-name="components/header.tsx"><span className="editable-text" data-unique-id="694b2800-f42d-4939-9284-d9babe5bb2a3" data-file-name="components/header.tsx">Tools</span></span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-3" data-unique-id="507c90d7-6b7f-4088-a554-c81a97a57c65" data-file-name="components/header.tsx">
          <MainNav />
          
          <Tooltip content="Get help with the application">
            <button onClick={openHelpModal} className="w-9 h-9 flex items-center justify-center rounded-md border border-border bg-background text-foreground hover:bg-accent transition-colors" aria-label="Open help" data-unique-id="9c60f7b7-4913-45da-b35c-fffbee46d946" data-file-name="components/header.tsx">
              <HelpCircle size={18} />
            </button>
          </Tooltip>
          
          <Tooltip content="Reset all guides & tutorials">
            <button onClick={restartGuides} className="w-9 h-9 flex items-center justify-center rounded-md border border-border bg-background text-foreground hover:bg-accent transition-colors" aria-label="Reset guides" data-unique-id="b02f8d94-fa04-4515-a420-c646d1114ec6" data-file-name="components/header.tsx">
              <Lightbulb size={18} />
            </button>
          </Tooltip>
          
          <UserPreferences />
          <ThemeToggle />
        </div>
      </div>
    </motion.header>;
}