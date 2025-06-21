'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, Lightbulb } from 'lucide-react';
interface FeatureProps {
  title: string;
  description: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  isNew?: boolean;
  completionKey?: string;
}
export function FeatureHighlight({
  title,
  description,
  children,
  defaultOpen = false,
  isNew = false,
  completionKey
}: FeatureProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isComplete, setIsComplete] = useState(false);
  useEffect(() => {
    if (completionKey) {
      const completed = localStorage.getItem(`feature-${completionKey}-completed`) === 'true';
      setIsComplete(completed);
    }
  }, [completionKey]);
  const markComplete = () => {
    if (completionKey) {
      setIsComplete(true);
      const saveToLocalStorage = () => {
        if (typeof window !== 'undefined') {
          try {
            const storage = window.localStorage;
            storage.setItem(`feature-${completionKey}-completed`, 'true');
          } catch (e) {
            console.error('Failed to save completion status to localStorage', e);
          }
        }
      };
      saveToLocalStorage();
    }
  };
  return <div className="mb-6 border border-border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300" data-unique-id="c482d5dd-4481-4cb7-8a94-de8948e06a86" data-file-name="components/feature-highlight.tsx">
      <button onClick={() => setIsOpen(!isOpen)} className={`w-full p-4 text-left flex justify-between items-center ${isOpen ? 'bg-accent/20' : 'bg-background'} hover:bg-accent/20 transition-colors`} data-unique-id="15c5ea89-5f6b-45d7-8152-13b09dce1779" data-file-name="components/feature-highlight.tsx">
        <div className="flex items-center" data-unique-id="626e9856-9311-4d1b-b9bb-41487d941a29" data-file-name="components/feature-highlight.tsx">
          <Lightbulb className={`mr-2 ${isNew ? 'text-primary' : 'text-muted-foreground'}`} size={20} />
          <div data-unique-id="43cf9662-d417-4b7a-add4-e6eaa163a151" data-file-name="components/feature-highlight.tsx">
            <div className="flex items-center" data-unique-id="8d67b8da-12fa-4779-b192-2f38ce68dab3" data-file-name="components/feature-highlight.tsx" data-dynamic-text="true">
              <h3 className="font-medium text-foreground" data-unique-id="0b799703-3c46-4d78-aeb4-9a11ba6cc591" data-file-name="components/feature-highlight.tsx" data-dynamic-text="true">{title}</h3>
              {isNew && <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold uppercase bg-primary text-white rounded" data-unique-id="56e1bd1c-4839-43f4-915b-882515cfaab8" data-file-name="components/feature-highlight.tsx"><span className="editable-text" data-unique-id="737e6f0f-5a0c-44c2-bc6f-95f51183b9c8" data-file-name="components/feature-highlight.tsx">
                  New
                </span></span>}
            </div>
            <p className="text-sm text-muted-foreground" data-unique-id="932ecea9-6310-4c6d-99e6-f14467653239" data-file-name="components/feature-highlight.tsx" data-dynamic-text="true">{description}</p>
          </div>
        </div>
        <div className="flex items-center" data-unique-id="48739c20-c3e4-41d7-9bab-885a1b45b10c" data-file-name="components/feature-highlight.tsx" data-dynamic-text="true">
          {isComplete && <span className="mr-2 text-xs text-green-500 font-medium" data-unique-id="faf92136-d8f8-42a3-aa4c-158b5f111b05" data-file-name="components/feature-highlight.tsx"><span className="editable-text" data-unique-id="01472c12-6c72-4a6f-8f2d-d66b3175e8d6" data-file-name="components/feature-highlight.tsx">Completed</span></span>}
          {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && <motion.div initial={{
        height: 0,
        opacity: 0
      }} animate={{
        height: 'auto',
        opacity: 1
      }} exit={{
        height: 0,
        opacity: 0
      }} transition={{
        duration: 0.2
      }} data-unique-id="bc94fbdb-5239-4024-94d4-7add3e70ae15" data-file-name="components/feature-highlight.tsx">
            <div className="p-4 border-t border-border bg-card" data-unique-id="6789ace4-8aa3-4595-8d34-8c107155b917" data-file-name="components/feature-highlight.tsx" data-dynamic-text="true">
              {children}
              
              {completionKey && !isComplete && <div className="mt-4 flex justify-end" data-unique-id="931deb04-abe2-4805-8c6d-b84e7c923086" data-file-name="components/feature-highlight.tsx">
                  <button onClick={markComplete} className="text-sm text-primary hover:underline focus:outline-none" data-unique-id="da7c6a1b-e696-450c-b959-8e272eb7db6f" data-file-name="components/feature-highlight.tsx"><span className="editable-text" data-unique-id="761de161-0d9f-4f17-b546-75c5cd39220d" data-file-name="components/feature-highlight.tsx">
                    Mark as completed
                  </span></button>
                </div>}
            </div>
          </motion.div>}
      </AnimatePresence>
    </div>;
}