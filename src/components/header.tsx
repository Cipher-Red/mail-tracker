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
  }} className="sticky top-0 z-40 bg-background border-b border-border" data-unique-id="e90c1d99-ffe5-4017-b813-d5666acccb7b" data-file-name="components/header.tsx">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between" data-unique-id="167d30c3-57b3-4fcf-b1ab-30361b3c8241" data-file-name="components/header.tsx">
        <div className="flex items-center" data-unique-id="dadddac7-1677-4653-b659-45cbf3b19217" data-file-name="components/header.tsx">
          <Link href="/" className="flex items-center space-x-2" data-unique-id="12d51083-d5ec-4e02-a841-ea5494c01f1e" data-file-name="components/header.tsx">
            <span className="font-bold text-xl text-primary" data-unique-id="1069aaab-e6e0-4539-816b-b18daaa91499" data-file-name="components/header.tsx"><span className="editable-text" data-unique-id="1b9afbee-6973-4c72-8e56-71f0cd9e92c2" data-file-name="components/header.tsx">Detroit Axle</span></span>
            <span className="text-sm text-muted-foreground" data-unique-id="3702cb04-eafc-4e5e-b252-4a3159cac249" data-file-name="components/header.tsx"><span className="editable-text" data-unique-id="996768d1-f335-47b5-a889-3c32035c1a82" data-file-name="components/header.tsx">Tools</span></span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4" data-unique-id="7c2f8fe7-75ce-47ac-92cf-b18486f77370" data-file-name="components/header.tsx">
          <MainNav />
          <ThemeToggle />
        </div>
      </div>
    </motion.header>;
}