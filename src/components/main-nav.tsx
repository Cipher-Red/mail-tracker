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
      <nav className="hidden md:flex items-center space-x-1" data-unique-id="a2ba387f-b523-4f7c-ae47-828d13bc6a7a" data-file-name="components/main-nav.tsx" data-dynamic-text="true">
        {routes.map(route => <Link key={route.href} href={route.href} className={`
              flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors
              ${route.active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}
            `} data-unique-id="fdcd9f73-817a-4bde-aa36-c5f75c330261" data-file-name="components/main-nav.tsx" data-dynamic-text="true">
            <span className="mr-2" data-unique-id="8b4c0d8f-30ac-4f4d-8eee-9ed1063937e7" data-file-name="components/main-nav.tsx" data-dynamic-text="true">{route.icon}</span>
            {route.label}
          </Link>)}
      </nav>
      
      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center" data-unique-id="628a392f-2ea1-49be-b511-5345d6604c29" data-file-name="components/main-nav.tsx">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md hover:bg-accent/50" data-unique-id="36efce02-944e-4759-a19d-4fb1ba64f52a" data-file-name="components/main-nav.tsx" data-dynamic-text="true">
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
    }} className="md:hidden absolute top-16 right-0 left-0 z-50 bg-background border-b border-border shadow-lg" data-unique-id="7147ef82-da13-4ae0-b661-d45876b0d75e" data-file-name="components/main-nav.tsx">
          <div className="py-2" data-unique-id="263dc979-7001-47ad-8fae-7f38a7c1c779" data-file-name="components/main-nav.tsx" data-dynamic-text="true">
            {routes.map(route => <Link key={route.href} href={route.href} onClick={() => setMobileMenuOpen(false)} className={`
                  flex items-center px-6 py-3 w-full text-left
                  ${route.active ? 'bg-primary/10 text-primary' : 'hover:bg-accent/50'}
                `} data-unique-id="27653db4-60c5-4110-ba27-e2eb2ed1ab95" data-file-name="components/main-nav.tsx" data-dynamic-text="true">
                <span className="mr-3" data-unique-id="fec9e750-e8d5-4385-b55d-6b87314b76f9" data-file-name="components/main-nav.tsx" data-dynamic-text="true">{route.icon}</span>
                {route.label}
              </Link>)}
          </div>
        </motion.div>}
    </>;
}