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
  return <div className="mb-6 border border-border rounded-lg overflow-hidden" data-unique-id="dd3771e6-08b5-46d1-ab24-e53c006540f0" data-file-name="components/feature-highlight.tsx">
      <button onClick={() => setIsOpen(!isOpen)} className={`w-full p-4 text-left flex justify-between items-center ${isOpen ? 'bg-accent/20' : 'bg-background'} hover:bg-accent/20 transition-colors`} data-unique-id="176247cc-55e6-4de8-9e29-93239ebcbf64" data-file-name="components/feature-highlight.tsx">
        <div className="flex items-center" data-unique-id="b4eb7820-d928-4cf2-b899-eefb897ada4d" data-file-name="components/feature-highlight.tsx">
          <Lightbulb className={`mr-2 ${isNew ? 'text-primary' : 'text-muted-foreground'}`} size={20} />
          <div data-unique-id="2e259d9f-12ac-41fa-8a28-663ef1e5f9e3" data-file-name="components/feature-highlight.tsx">
            <div className="flex items-center" data-unique-id="8dafd6d8-18f9-4207-bf52-abedf0a415c5" data-file-name="components/feature-highlight.tsx" data-dynamic-text="true">
              <h3 className="font-medium text-foreground" data-unique-id="6794da97-9fb7-4c31-81ad-d837bef69674" data-file-name="components/feature-highlight.tsx" data-dynamic-text="true">{title}</h3>
              {isNew && <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold uppercase bg-primary text-white rounded" data-unique-id="bf59c57e-d7c6-4ecf-88e7-df452ef51b8e" data-file-name="components/feature-highlight.tsx"><span className="editable-text" data-unique-id="7be0860a-d109-456d-8000-6dbd7c95cefa" data-file-name="components/feature-highlight.tsx">
                  New
                </span></span>}
            </div>
            <p className="text-sm text-muted-foreground" data-unique-id="69c0e9e5-811a-431e-adc6-1959a60d9554" data-file-name="components/feature-highlight.tsx" data-dynamic-text="true">{description}</p>
          </div>
        </div>
        <div className="flex items-center" data-unique-id="995dd6ca-8a16-42a1-9858-afc258b23ac6" data-file-name="components/feature-highlight.tsx" data-dynamic-text="true">
          {isComplete && <span className="mr-2 text-xs text-green-500 font-medium" data-unique-id="dec72746-3c31-455f-8cdc-a2fdd11772fd" data-file-name="components/feature-highlight.tsx"><span className="editable-text" data-unique-id="b2421542-253f-4ee0-9bf0-b467bbbe98a7" data-file-name="components/feature-highlight.tsx">Completed</span></span>}
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
      }} data-unique-id="ddc8116d-2f04-4e51-a882-f8e2dc26aa9b" data-file-name="components/feature-highlight.tsx">
            <div className="p-4 border-t border-border bg-card" data-unique-id="268d06c6-83a4-4357-99b1-3dee9bb7c5f8" data-file-name="components/feature-highlight.tsx" data-dynamic-text="true">
              {children}
              
              {completionKey && !isComplete && <div className="mt-4 flex justify-end" data-unique-id="cfa89d0f-850b-48da-809e-c698669fa760" data-file-name="components/feature-highlight.tsx">
                  <button onClick={markComplete} className="text-sm text-primary hover:underline focus:outline-none" data-unique-id="5d971bf8-93aa-4d9b-b013-853172b5cb68" data-file-name="components/feature-highlight.tsx"><span className="editable-text" data-unique-id="6194e138-59ee-4cb1-8f86-f5f4d3c5b1df" data-file-name="components/feature-highlight.tsx">
                    Mark as completed
                  </span></button>
                </div>}
            </div>
          </motion.div>}
      </AnimatePresence>
    </div>;
}