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
  }} className="sticky top-0 z-40 bg-background border-b border-border" data-unique-id="2425ee02-7902-4123-9c28-168a08ed9a7b" data-file-name="components/header.tsx">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between" data-unique-id="c3a83fd9-2edb-4e09-93d7-054c095af229" data-file-name="components/header.tsx">
        <div className="flex items-center" data-unique-id="f9009bb2-c9e9-45d9-bb0d-7d997ad05ac8" data-file-name="components/header.tsx">
          <Link href="/" className="flex items-center space-x-2" data-unique-id="d723897b-a331-4723-b664-8be0d78b91d7" data-file-name="components/header.tsx">
            <span className="font-bold text-xl text-primary" data-unique-id="be5d499d-0394-4479-9cc1-13d6cf67a8af" data-file-name="components/header.tsx"><span className="editable-text" data-unique-id="0bb428fa-202b-45a8-8d29-a36d76406842" data-file-name="components/header.tsx">Detroit Axle</span></span>
            <span className="text-sm text-muted-foreground" data-unique-id="35f1de64-f94c-4caf-acdb-93d2da0089cd" data-file-name="components/header.tsx"><span className="editable-text" data-unique-id="1d2c030a-59f5-46b9-8905-53d26a47e805" data-file-name="components/header.tsx">Tools</span></span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4" data-unique-id="8acd9de6-ca36-4c17-abe4-c0fec945ceaa" data-file-name="components/header.tsx">
          <MainNav />
          <ThemeToggle />
        </div>
      </div>
    </motion.header>;
}