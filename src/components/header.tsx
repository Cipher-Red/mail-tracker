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
  }} className="sticky top-0 z-40 bg-background border-b border-border" data-unique-id="036b627d-750a-4680-aa89-f538989a5963" data-file-name="components/header.tsx">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between" data-unique-id="5c972982-7285-4b31-aba9-8c5ae6ba61d3" data-file-name="components/header.tsx">
        <div className="flex items-center" data-unique-id="94039cc5-8941-415a-8d58-e548c4b9bc1c" data-file-name="components/header.tsx">
          <Link href="/" className="flex items-center space-x-2" data-unique-id="41ba1cd5-39fe-458b-9d3b-ead41e9f1255" data-file-name="components/header.tsx">
            <span className="font-bold text-xl text-primary" data-unique-id="bf13161e-e79f-411f-b877-c19ab0dec5bf" data-file-name="components/header.tsx"><span className="editable-text" data-unique-id="dd68d247-1948-4a2d-97cb-d1f1f555639d" data-file-name="components/header.tsx">Detroit Axle</span></span>
            <span className="text-sm text-muted-foreground" data-unique-id="6436bef6-79dc-419e-89fc-b99cce39c605" data-file-name="components/header.tsx"><span className="editable-text" data-unique-id="a784c293-55ee-4ce9-9f51-2d58aaba669a" data-file-name="components/header.tsx">Tools</span></span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4" data-unique-id="fa581d2d-52aa-4195-bbe8-b1444c3b6f14" data-file-name="components/header.tsx">
          <MainNav />
          <ThemeToggle />
        </div>
      </div>
    </motion.header>;
}