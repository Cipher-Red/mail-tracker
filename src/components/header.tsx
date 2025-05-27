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
  }} className="sticky top-0 z-40 bg-background border-b border-border" data-unique-id="45373043-2c0a-4383-85f0-2c29a771acb0" data-file-name="components/header.tsx">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between" data-unique-id="0134a7c9-eda2-4895-a884-22ff190a1692" data-file-name="components/header.tsx">
        <div className="flex items-center" data-unique-id="3e15a4a0-3ae8-4241-9a14-7962d79cc825" data-file-name="components/header.tsx">
          <Link href="/" className="flex items-center space-x-2" data-unique-id="075eebe5-a1ec-40f7-ba40-318c813dd3f1" data-file-name="components/header.tsx">
            <span className="font-bold text-xl text-primary" data-unique-id="6e7286d0-3586-461c-bf73-0185c25ae70c" data-file-name="components/header.tsx"><span className="editable-text" data-unique-id="7b2f4424-6e55-4352-8bc4-da13597cd960" data-file-name="components/header.tsx">Detroit Axle</span></span>
            <span className="text-sm text-muted-foreground" data-unique-id="07e60c8d-8abe-4348-aa69-0e7324d25512" data-file-name="components/header.tsx"><span className="editable-text" data-unique-id="59c1d417-25fc-411e-98a5-ede3046d2311" data-file-name="components/header.tsx">Tools</span></span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4" data-unique-id="9b5cc887-6a16-42a3-8dc2-ab1b77a6db89" data-file-name="components/header.tsx">
          <MainNav />
          <ThemeToggle />
        </div>
      </div>
    </motion.header>;
}