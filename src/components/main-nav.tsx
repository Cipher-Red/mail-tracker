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
      <nav className="hidden md:flex items-center space-x-1" data-unique-id="999fe130-2ba6-474d-936f-63e62be032df" data-file-name="components/main-nav.tsx" data-dynamic-text="true">
        {routes.map(route => <Link key={route.href} href={route.href} className={`
              flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors
              ${route.active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}
            `} data-unique-id="44e01a1d-c7e6-4ef4-ba4b-4d1d3504a188" data-file-name="components/main-nav.tsx" data-dynamic-text="true">
            <span className="mr-2" data-unique-id="0faaa1dc-7aa1-4330-8b37-e333fa040e63" data-file-name="components/main-nav.tsx" data-dynamic-text="true">{route.icon}</span>
            {route.label}
          </Link>)}
      </nav>
      
      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center" data-unique-id="7aa91c6b-a18b-4d12-af9b-407963f7c527" data-file-name="components/main-nav.tsx">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md hover:bg-accent/50" data-unique-id="b8412bb4-4dae-4d02-8987-fa9b4c618979" data-file-name="components/main-nav.tsx" data-dynamic-text="true">
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
    }} className="md:hidden absolute top-16 right-0 left-0 z-50 bg-background border-b border-border shadow-lg" data-unique-id="d096c83a-b278-4c9f-8161-e51b16ec387e" data-file-name="components/main-nav.tsx">
          <div className="py-2" data-unique-id="3a40b1bc-cc93-4bac-bc18-cd06bc8df26f" data-file-name="components/main-nav.tsx" data-dynamic-text="true">
            {routes.map(route => <Link key={route.href} href={route.href} onClick={() => setMobileMenuOpen(false)} className={`
                  flex items-center px-6 py-3 w-full text-left
                  ${route.active ? 'bg-primary/10 text-primary' : 'hover:bg-accent/50'}
                `} data-unique-id="ecf189d1-d696-4d6c-a204-c895fbf454f0" data-file-name="components/main-nav.tsx" data-dynamic-text="true">
                <span className="mr-3" data-unique-id="23dfd987-6de2-4958-926c-bcf2d161bd58" data-file-name="components/main-nav.tsx" data-dynamic-text="true">{route.icon}</span>
                {route.label}
              </Link>)}
          </div>
        </motion.div>}
    </>;
}