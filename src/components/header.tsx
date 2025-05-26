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
  }} className="sticky top-0 z-40 bg-background border-b border-border" data-unique-id="13ea1164-02df-4af4-a0df-a3a3bbf116d4" data-file-name="components/header.tsx">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between" data-unique-id="75253bf7-acd2-4c32-b5f9-59ce3b0c794c" data-file-name="components/header.tsx">
        <div className="flex items-center" data-unique-id="cbcc7a89-05e5-4b57-bf1b-a6a6479c123f" data-file-name="components/header.tsx">
          <Link href="/" className="flex items-center space-x-2" data-unique-id="ec4f003c-4b68-4ada-98e3-642e1a1a96e6" data-file-name="components/header.tsx">
            <span className="font-bold text-xl text-primary" data-unique-id="c70637f6-a138-4e11-b06c-1cd8e189b950" data-file-name="components/header.tsx"><span className="editable-text" data-unique-id="02f4b65e-0178-48bb-8dee-a9a77eaab8f7" data-file-name="components/header.tsx">Detroit Axle</span></span>
            <span className="text-sm text-muted-foreground" data-unique-id="aa03ad17-d15e-4893-9498-2e1e489f6173" data-file-name="components/header.tsx"><span className="editable-text" data-unique-id="1b0d0890-da1a-475e-b6ad-23742469dd74" data-file-name="components/header.tsx">Tools</span></span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4" data-unique-id="0af39944-3d20-4cf0-9db8-55a025b261c6" data-file-name="components/header.tsx">
          <MainNav />
          <ThemeToggle />
        </div>
      </div>
    </motion.header>;
}