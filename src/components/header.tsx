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
  }} className="sticky top-0 z-40 bg-background border-b border-border" data-unique-id="de722fb9-e8f5-4e29-8062-9cb92b41c6cb" data-file-name="components/header.tsx">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between" data-unique-id="e1e04b6e-fbd2-4134-b410-71c97ddcccd3" data-file-name="components/header.tsx">
        <div className="flex items-center" data-unique-id="c614cbdb-329a-4141-b5c8-c686c0e81e3a" data-file-name="components/header.tsx">
          <Link href="/" className="flex items-center space-x-2" data-unique-id="ccda82bd-8434-451b-915c-d62a9676e1b1" data-file-name="components/header.tsx">
            <span className="font-bold text-xl text-primary" data-unique-id="213937a3-3da1-459f-8f3e-6b4266c38924" data-file-name="components/header.tsx"><span className="editable-text" data-unique-id="5361385c-a7ec-443b-8a5e-6f357a4a6c44" data-file-name="components/header.tsx">Detroit Axle</span></span>
            <span className="text-sm text-muted-foreground" data-unique-id="63abbc23-ee63-4407-bae2-88dbd65779ef" data-file-name="components/header.tsx"><span className="editable-text" data-unique-id="333dbbad-e037-4541-99f4-3dcde8bc2732" data-file-name="components/header.tsx">Tools</span></span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4" data-unique-id="d97a5b91-ef17-47b8-b567-e6f233f6761c" data-file-name="components/header.tsx">
          <MainNav />
          <ThemeToggle />
        </div>
      </div>
    </motion.header>;
}