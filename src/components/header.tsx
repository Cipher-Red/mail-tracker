'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ThemeToggle } from './theme-toggle';
import { MainNav } from './main-nav';
export function Header() {
  return <motion.header initial={{
    y: -10,
    opacity: 0
  }} animate={{
    y: 0,
    opacity: 1
  }} transition={{
    duration: 0.3
  }} className="sticky top-0 z-40 bg-background border-b border-border" data-unique-id="82a2ef1f-f36e-4827-bca1-1d8db40cfcbc" data-file-name="components/header.tsx">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between" data-unique-id="388b19b5-7dfa-4367-b73f-8dc6674f958f" data-file-name="components/header.tsx">
        <div className="flex items-center" data-unique-id="5fbfc82e-5c92-41ae-b535-c8b72d8f6b39" data-file-name="components/header.tsx">
          <Link href="/" className="flex items-center space-x-2" data-unique-id="2d57df02-62df-4c69-90ab-497a68a75746" data-file-name="components/header.tsx">
            <span className="font-bold text-xl text-primary" data-unique-id="aeaf32a6-9053-4be8-8a0d-ed7ceb495b1a" data-file-name="components/header.tsx"><span className="editable-text" data-unique-id="054ca1b5-1232-4337-9bbd-bd08fca2c665" data-file-name="components/header.tsx">Detroit Axle</span></span>
            <span className="text-sm text-muted-foreground" data-unique-id="9f4b90c5-fd7d-4b57-9221-5e9db6ead5fa" data-file-name="components/header.tsx"><span className="editable-text" data-unique-id="3540416a-86ca-4fcc-aeed-3727bc5f769f" data-file-name="components/header.tsx">Tools</span></span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4" data-unique-id="024dbbb6-8d2b-4d7c-81a3-ac1f6d6a4f4c" data-file-name="components/header.tsx">
          <MainNav />
          <ThemeToggle />
        </div>
      </div>
    </motion.header>;
}