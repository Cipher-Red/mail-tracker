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
  }} className="sticky top-0 z-40 bg-background border-b border-border" data-unique-id="4fb10851-9963-4508-a87d-bb1f6cac7ac7" data-file-name="components/header.tsx">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between" data-unique-id="93cfa7f0-a0e0-42c6-ab4b-01f586d6794f" data-file-name="components/header.tsx">
        <div className="flex items-center" data-unique-id="0ddad383-6b2a-4f8c-9c4c-0532088b00dd" data-file-name="components/header.tsx">
          <Link href="/" className="flex items-center space-x-2" data-unique-id="13d3e70c-c509-4ec6-8f63-1a9bd43716f8" data-file-name="components/header.tsx">
            <span className="font-bold text-xl text-primary" data-unique-id="1d95d6d6-c2aa-4db0-830d-93ff51c01b5c" data-file-name="components/header.tsx"><span className="editable-text" data-unique-id="69a813fb-f21e-448b-9ad3-2c0333240180" data-file-name="components/header.tsx">Detroit Axle</span></span>
            <span className="text-sm text-muted-foreground" data-unique-id="f30d49d5-03b9-4145-bd8d-cbda477d0b27" data-file-name="components/header.tsx"><span className="editable-text" data-unique-id="6fdfd9a6-8057-4a90-a9aa-4093cf40469c" data-file-name="components/header.tsx">Tools</span></span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4" data-unique-id="a504c41f-4937-4145-a066-13caa83f2e04" data-file-name="components/header.tsx">
          <MainNav />
          <ThemeToggle />
        </div>
      </div>
    </motion.header>;
}