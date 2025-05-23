'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, FileText, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
export function MainNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const routes = [{
    href: '/',
    icon: <Mail className="h-5 w-5" />,
    label: 'Email Builder',
    active: pathname === '/'
  }, {
    href: '/order-processor',
    icon: <FileText className="h-5 w-5" />,
    label: 'Order Processor',
    active: pathname === '/order-processor'
  }];
  return <>
      <nav className="hidden md:flex items-center space-x-1" data-unique-id="9cf31ed5-2703-4e9a-885a-11fe8d220197" data-file-name="components/main-nav.tsx" data-dynamic-text="true">
        {routes.map(route => <Link key={route.href} href={route.href} className={`
              flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors
              ${route.active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}
            `} data-unique-id="38e0e087-4929-4886-88f7-7f5aab599b4c" data-file-name="components/main-nav.tsx" data-dynamic-text="true">
            <span className="mr-2" data-unique-id="ed746781-3380-4f11-8137-b622a708d0d7" data-file-name="components/main-nav.tsx" data-dynamic-text="true">{route.icon}</span>
            {route.label}
          </Link>)}
      </nav>
      
      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center" data-unique-id="0f61084d-8de9-4eca-b3ec-094413d98ba0" data-file-name="components/main-nav.tsx">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md hover:bg-accent/50" data-unique-id="b0912d5f-ffbe-4310-843b-f5fccbf773f9" data-file-name="components/main-nav.tsx" data-dynamic-text="true">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && <motion.div initial={{
      opacity: 0,
      y: -20
    }} animate={{
      opacity: 1,
      y: 0
    }} exit={{
      opacity: 0,
      y: -20
    }} className="md:hidden absolute top-16 right-0 left-0 z-50 bg-background border-b border-border shadow-lg" data-unique-id="f3b16be4-a6d9-4f69-95b4-e82a7641e75b" data-file-name="components/main-nav.tsx">
          <div className="py-2" data-unique-id="f43815b8-af6c-4814-bf99-6875ef8fe4d2" data-file-name="components/main-nav.tsx" data-dynamic-text="true">
            {routes.map(route => <Link key={route.href} href={route.href} onClick={() => setMobileMenuOpen(false)} className={`
                  flex items-center px-6 py-3 w-full text-left
                  ${route.active ? 'bg-primary/10 text-primary' : 'hover:bg-accent/50'}
                `} data-unique-id="7795a443-cdf6-487e-b296-2ce22c0caa87" data-file-name="components/main-nav.tsx" data-dynamic-text="true">
                <span className="mr-3" data-unique-id="dcd4d97f-a327-499a-80e5-c6b648cb3613" data-file-name="components/main-nav.tsx" data-dynamic-text="true">{route.icon}</span>
                {route.label}
              </Link>)}
          </div>
        </motion.div>}
    </>;
}