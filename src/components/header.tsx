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
  }} className="sticky top-0 z-40 bg-background border-b border-border" data-unique-id="39270284-7571-4d9b-91a6-c78db82f2db7" data-file-name="components/header.tsx">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between" data-unique-id="2aef5ad9-2857-416f-afe8-f995b69c7473" data-file-name="components/header.tsx">
        <div className="flex items-center" data-unique-id="42249bd2-17c0-49cf-be0a-f28d7ad35d7a" data-file-name="components/header.tsx">
          <Link href="/" className="flex items-center space-x-2" data-unique-id="d1c2fa2b-0196-4e78-9a0e-ab3c8949cb3b" data-file-name="components/header.tsx">
            <span className="font-bold text-xl text-primary" data-unique-id="07709a17-fb33-44b5-9f57-02f795ce5a22" data-file-name="components/header.tsx"><span className="editable-text" data-unique-id="a7e27365-a573-4e7d-a66c-c3bd88b74ee7" data-file-name="components/header.tsx">Detroit Axle</span></span>
            <span className="text-sm text-muted-foreground" data-unique-id="fad76c7c-ed55-49c2-a879-c6a0075f6e1c" data-file-name="components/header.tsx"><span className="editable-text" data-unique-id="e2d37c7e-563b-47ef-a11d-9e0083ddc2a8" data-file-name="components/header.tsx">Tools</span></span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4" data-unique-id="ebc77542-d392-4e6d-a549-8cab65f6c4bc" data-file-name="components/header.tsx">
          <MainNav />
          <ThemeToggle />
        </div>
      </div>
    </motion.header>;
}