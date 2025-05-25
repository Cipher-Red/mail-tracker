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
  return <div className="mb-6 border border-border rounded-lg overflow-hidden" data-unique-id="ddb820fd-da1b-4898-85fb-d155c53299fa" data-file-name="components/feature-highlight.tsx">
      <button onClick={() => setIsOpen(!isOpen)} className={`w-full p-4 text-left flex justify-between items-center ${isOpen ? 'bg-accent/20' : 'bg-background'} hover:bg-accent/20 transition-colors`} data-unique-id="ae389e4c-a62b-403c-a08b-4f536234462d" data-file-name="components/feature-highlight.tsx">
        <div className="flex items-center" data-unique-id="c2526bd7-4410-4732-8a26-d623621b093a" data-file-name="components/feature-highlight.tsx">
          <Lightbulb className={`mr-2 ${isNew ? 'text-primary' : 'text-muted-foreground'}`} size={20} />
          <div data-unique-id="6e0fa9b9-980a-46e3-becf-782fedfd425e" data-file-name="components/feature-highlight.tsx">
            <div className="flex items-center" data-unique-id="76dea38f-768a-4005-9a0a-173c7dc1c29a" data-file-name="components/feature-highlight.tsx" data-dynamic-text="true">
              <h3 className="font-medium text-foreground" data-unique-id="9309dfa5-d72d-4dc5-bb71-b19aa4a93af0" data-file-name="components/feature-highlight.tsx" data-dynamic-text="true">{title}</h3>
              {isNew && <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold uppercase bg-primary text-white rounded" data-unique-id="f07990ca-17c4-42ca-95a7-28bc723aa4be" data-file-name="components/feature-highlight.tsx"><span className="editable-text" data-unique-id="74103867-714a-46d3-bc7d-83e585b0ec99" data-file-name="components/feature-highlight.tsx">
                  New
                </span></span>}
            </div>
            <p className="text-sm text-muted-foreground" data-unique-id="eae5f2cd-da68-48a7-81e9-b9506a026205" data-file-name="components/feature-highlight.tsx" data-dynamic-text="true">{description}</p>
          </div>
        </div>
        <div className="flex items-center" data-unique-id="63cb41a6-dcdf-4474-82e9-363b934a3fc5" data-file-name="components/feature-highlight.tsx" data-dynamic-text="true">
          {isComplete && <span className="mr-2 text-xs text-green-500 font-medium" data-unique-id="5f1205d7-e438-4aaa-b8fa-086fc3360c93" data-file-name="components/feature-highlight.tsx"><span className="editable-text" data-unique-id="d9692564-3005-45c8-804d-a00db771cc6b" data-file-name="components/feature-highlight.tsx">Completed</span></span>}
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
      }} data-unique-id="9775b6c8-9d88-4f40-a98a-350369dcab3c" data-file-name="components/feature-highlight.tsx">
            <div className="p-4 border-t border-border bg-card" data-unique-id="c57791bf-6f60-49b9-903f-95278890042e" data-file-name="components/feature-highlight.tsx" data-dynamic-text="true">
              {children}
              
              {completionKey && !isComplete && <div className="mt-4 flex justify-end" data-unique-id="97b7efc8-d66b-41ed-b6fb-93d48b0e7c2f" data-file-name="components/feature-highlight.tsx">
                  <button onClick={markComplete} className="text-sm text-primary hover:underline focus:outline-none" data-unique-id="f6ad5893-36e8-4604-b16a-17795534d14f" data-file-name="components/feature-highlight.tsx"><span className="editable-text" data-unique-id="aba3323b-3281-49d7-8476-1cb538bb33ce" data-file-name="components/feature-highlight.tsx">
                    Mark as completed
                  </span></button>
                </div>}
            </div>
          </motion.div>}
      </AnimatePresence>
    </div>;
}