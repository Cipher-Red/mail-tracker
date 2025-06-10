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
  }} className="sticky top-0 z-40 bg-background border-b border-border" data-unique-id="b0e84e0e-1565-4deb-9ac7-a03b455d16c3" data-file-name="components/header.tsx">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between" data-unique-id="f3cdb7b0-f32e-4ee0-aa73-75e0fd81931f" data-file-name="components/header.tsx">
        <div className="flex items-center" data-unique-id="b8c80da0-c40c-4b89-bc80-21ed1427c7f2" data-file-name="components/header.tsx">
          <Link href="/" className="flex items-center space-x-2" data-unique-id="2af20821-2630-4d82-805f-679656e5674d" data-file-name="components/header.tsx">
            <span className="font-bold text-xl text-primary" data-unique-id="a6aee92a-9def-4f55-b5ef-b8f6f4998daf" data-file-name="components/header.tsx"><span className="editable-text" data-unique-id="93f05975-6da9-4a19-9223-b298965168ee" data-file-name="components/header.tsx">Detroit Axle</span></span>
            <span className="text-sm text-muted-foreground" data-unique-id="037ad17a-2f60-4206-8b9b-30f20cb322ee" data-file-name="components/header.tsx"><span className="editable-text" data-unique-id="41bc2722-6dcd-4e8e-8630-47de2775d3c2" data-file-name="components/header.tsx">Tools</span></span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4" data-unique-id="d6e5638d-a4f8-4263-8245-82e19a0262f5" data-file-name="components/header.tsx">
          <MainNav />
          <ThemeToggle />
        </div>
      </div>
    </motion.header>;
}