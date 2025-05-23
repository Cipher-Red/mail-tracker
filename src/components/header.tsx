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
  }} className="sticky top-0 z-40 bg-background border-b border-border" data-unique-id="922274d1-675f-4ea1-8ebb-f257b26064c2" data-file-name="components/header.tsx">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between" data-unique-id="2ad7044e-2754-4aad-a394-7024aeaf23fb" data-file-name="components/header.tsx">
        <div className="flex items-center" data-unique-id="d66ddaa5-bd55-420f-b877-764bcbfb49f5" data-file-name="components/header.tsx">
          <Link href="/" className="flex items-center space-x-2" data-unique-id="41990fbb-195a-4b94-8ec6-000f3d11642c" data-file-name="components/header.tsx">
            <span className="font-bold text-xl text-primary" data-unique-id="9cb7a209-14f2-4bbd-afbc-2a68c337742e" data-file-name="components/header.tsx"><span className="editable-text" data-unique-id="b3507b3c-2bd1-4209-947a-ddec00b8d84a" data-file-name="components/header.tsx">Detroit Axle</span></span>
            <span className="text-sm text-muted-foreground" data-unique-id="3ac86e20-69ed-41d6-abe8-71092cc8ced4" data-file-name="components/header.tsx"><span className="editable-text" data-unique-id="f8635685-5637-4399-a1d6-19a3230c294e" data-file-name="components/header.tsx">Tools</span></span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4" data-unique-id="654b8637-b2fb-4f12-8df9-fd62a0000fcb" data-file-name="components/header.tsx">
          <MainNav />
          <ThemeToggle />
        </div>
      </div>
    </motion.header>;
}