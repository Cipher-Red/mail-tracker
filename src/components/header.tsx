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
  }} className="sticky top-0 z-40 bg-background border-b border-border" data-unique-id="9095af0f-efd6-4d90-98e6-df5974659092" data-file-name="components/header.tsx">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between" data-unique-id="d2cddc6f-9f70-411d-9daa-4e7ec5b5e3ef" data-file-name="components/header.tsx">
        <div className="flex items-center" data-unique-id="5d5ff0b9-a162-408e-a1a3-50c4535c2459" data-file-name="components/header.tsx">
          <Link href="/" className="flex items-center space-x-2" data-unique-id="94c25d69-1694-4970-8092-97d1e95fcafb" data-file-name="components/header.tsx">
            <span className="font-bold text-xl text-primary" data-unique-id="c5ce300b-0ce1-443f-9ac2-b0cc3fd9d94d" data-file-name="components/header.tsx"><span className="editable-text" data-unique-id="1b18969c-bd35-4434-90ca-0076cf720b46" data-file-name="components/header.tsx">Detroit Axle</span></span>
            <span className="text-sm text-muted-foreground" data-unique-id="00a36cc1-f71e-4e11-8f3d-85fb5bea5490" data-file-name="components/header.tsx"><span className="editable-text" data-unique-id="aa0208e3-8611-4ca1-b49f-bc3703b31d80" data-file-name="components/header.tsx">Tools</span></span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4" data-unique-id="2fe59e9b-99ed-4a98-bd63-c90b038cb124" data-file-name="components/header.tsx">
          <MainNav />
          <ThemeToggle />
        </div>
      </div>
    </motion.header>;
}