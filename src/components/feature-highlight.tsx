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
  return <div className="mb-6 border border-border rounded-lg overflow-hidden" data-unique-id="a72df86f-fce1-46af-8cba-71471588e570" data-file-name="components/feature-highlight.tsx">
      <button onClick={() => setIsOpen(!isOpen)} className={`w-full p-4 text-left flex justify-between items-center ${isOpen ? 'bg-accent/20' : 'bg-background'} hover:bg-accent/20 transition-colors`} data-unique-id="ca5be588-1dca-4d44-b6e4-1329fe996b45" data-file-name="components/feature-highlight.tsx">
        <div className="flex items-center" data-unique-id="ebfcff6a-fe50-4380-99d6-6fc1805893f4" data-file-name="components/feature-highlight.tsx">
          <Lightbulb className={`mr-2 ${isNew ? 'text-primary' : 'text-muted-foreground'}`} size={20} />
          <div data-unique-id="6fb80f30-c768-4500-bbb1-781da5201e1e" data-file-name="components/feature-highlight.tsx">
            <div className="flex items-center" data-unique-id="6d680833-84b0-4cf1-9472-31e8a07cdf9e" data-file-name="components/feature-highlight.tsx" data-dynamic-text="true">
              <h3 className="font-medium text-foreground" data-unique-id="b0942919-18ba-4918-b8d6-591e97df98de" data-file-name="components/feature-highlight.tsx" data-dynamic-text="true">{title}</h3>
              {isNew && <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold uppercase bg-primary text-white rounded" data-unique-id="a4e80495-4d56-40f7-bcb3-900f64f8bfde" data-file-name="components/feature-highlight.tsx"><span className="editable-text" data-unique-id="868d43a4-6aee-46f2-beae-8ba80426855e" data-file-name="components/feature-highlight.tsx">
                  New
                </span></span>}
            </div>
            <p className="text-sm text-muted-foreground" data-unique-id="e833698e-16de-4a96-88f5-a849f94415c4" data-file-name="components/feature-highlight.tsx" data-dynamic-text="true">{description}</p>
          </div>
        </div>
        <div className="flex items-center" data-unique-id="160c8d8d-dbe5-4625-b8ac-1db1ae2ba431" data-file-name="components/feature-highlight.tsx" data-dynamic-text="true">
          {isComplete && <span className="mr-2 text-xs text-green-500 font-medium" data-unique-id="85763fab-fc03-466d-a05c-4c6394282b30" data-file-name="components/feature-highlight.tsx"><span className="editable-text" data-unique-id="ef33878a-05c3-4ec8-9244-a13a3909e7ac" data-file-name="components/feature-highlight.tsx">Completed</span></span>}
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
      }} data-unique-id="e9941ca4-a935-4cb4-9e30-1b495b90b4ca" data-file-name="components/feature-highlight.tsx">
            <div className="p-4 border-t border-border bg-card" data-unique-id="eaabb2ee-9b61-44b0-8633-de954779fbee" data-file-name="components/feature-highlight.tsx" data-dynamic-text="true">
              {children}
              
              {completionKey && !isComplete && <div className="mt-4 flex justify-end" data-unique-id="425c1cdf-c4e1-41d8-8dbc-58e71644a6c1" data-file-name="components/feature-highlight.tsx">
                  <button onClick={markComplete} className="text-sm text-primary hover:underline focus:outline-none" data-unique-id="29b7dfc2-80cc-4b32-8497-00664d796a70" data-file-name="components/feature-highlight.tsx"><span className="editable-text" data-unique-id="6758d99d-81b4-482b-aa7b-600fd5035183" data-file-name="components/feature-highlight.tsx">
                    Mark as completed
                  </span></button>
                </div>}
            </div>
          </motion.div>}
      </AnimatePresence>
    </div>;
}