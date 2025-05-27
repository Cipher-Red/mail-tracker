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
  return <div className="mb-6 border border-border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300" data-unique-id="014aaa4c-bf9e-4ea2-ab7f-d288a4993b76" data-file-name="components/feature-highlight.tsx">
      <button onClick={() => setIsOpen(!isOpen)} className={`w-full p-4 text-left flex justify-between items-center ${isOpen ? 'bg-accent/20' : 'bg-background'} hover:bg-accent/20 transition-colors`} data-unique-id="f97b695d-bb39-4e4a-bdb8-97b807b35786" data-file-name="components/feature-highlight.tsx">
        <div className="flex items-center" data-unique-id="14b70a73-2626-4849-b093-183d89e7d245" data-file-name="components/feature-highlight.tsx">
          <Lightbulb className={`mr-2 ${isNew ? 'text-primary' : 'text-muted-foreground'}`} size={20} />
          <div data-unique-id="21837555-fa06-430c-af7f-4c8c03bd71e1" data-file-name="components/feature-highlight.tsx">
            <div className="flex items-center" data-unique-id="f52bf5a2-214e-4ab9-9cae-d9f412f0c825" data-file-name="components/feature-highlight.tsx" data-dynamic-text="true">
              <h3 className="font-medium text-foreground" data-unique-id="7cdc3262-ebcc-499f-ab1b-34e85ec52878" data-file-name="components/feature-highlight.tsx" data-dynamic-text="true">{title}</h3>
              {isNew && <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold uppercase bg-primary text-white rounded" data-unique-id="13292e3c-c56e-46ea-ad82-5c2faf89b45e" data-file-name="components/feature-highlight.tsx"><span className="editable-text" data-unique-id="4b5e22d3-b416-4387-9edb-04ed968811b7" data-file-name="components/feature-highlight.tsx">
                  New
                </span></span>}
            </div>
            <p className="text-sm text-muted-foreground" data-unique-id="bd792835-3345-43ca-8536-4b623f60acdf" data-file-name="components/feature-highlight.tsx" data-dynamic-text="true">{description}</p>
          </div>
        </div>
        <div className="flex items-center" data-unique-id="4f93d3a1-9805-4870-8855-a363d086a6cb" data-file-name="components/feature-highlight.tsx" data-dynamic-text="true">
          {isComplete && <span className="mr-2 text-xs text-green-500 font-medium" data-unique-id="5dbf4573-dca4-42e5-81a5-8238c3a6dd66" data-file-name="components/feature-highlight.tsx"><span className="editable-text" data-unique-id="607f21fd-fcbd-48e2-8f5a-d3d2eee1c31f" data-file-name="components/feature-highlight.tsx">Completed</span></span>}
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
      }} data-unique-id="548583db-37d3-476c-a57c-8c874d318306" data-file-name="components/feature-highlight.tsx">
            <div className="p-4 border-t border-border bg-card" data-unique-id="d1937465-b39f-4961-9239-4075ad6b650a" data-file-name="components/feature-highlight.tsx" data-dynamic-text="true">
              {children}
              
              {completionKey && !isComplete && <div className="mt-4 flex justify-end" data-unique-id="aed9ca0b-2194-4e2d-aaf5-90ff3e87065e" data-file-name="components/feature-highlight.tsx">
                  <button onClick={markComplete} className="text-sm text-primary hover:underline focus:outline-none" data-unique-id="09da654c-d673-48d9-90ea-cce100e938f9" data-file-name="components/feature-highlight.tsx"><span className="editable-text" data-unique-id="e5fa45bd-ef1f-41f7-8087-76b528261718" data-file-name="components/feature-highlight.tsx">
                    Mark as completed
                  </span></button>
                </div>}
            </div>
          </motion.div>}
      </AnimatePresence>
    </div>;
}