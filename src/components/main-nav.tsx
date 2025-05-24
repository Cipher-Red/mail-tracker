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
      <nav className="hidden md:flex items-center space-x-1" data-unique-id="0364d0f8-2e35-47a8-bc46-b0ecc4ea896c" data-file-name="components/main-nav.tsx" data-dynamic-text="true">
        {routes.map(route => <Link key={route.href} href={route.href} className={`
              flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors
              ${route.active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}
            `} data-unique-id="63acdb6d-784a-466f-a628-d350d73700cc" data-file-name="components/main-nav.tsx" data-dynamic-text="true">
            <span className="mr-2" data-unique-id="4830fa7d-a06b-4f83-b45b-1f04e13389b2" data-file-name="components/main-nav.tsx" data-dynamic-text="true">{route.icon}</span>
            {route.label}
          </Link>)}
      </nav>
      
      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center" data-unique-id="765b10b9-d643-4598-a49e-40951accdec2" data-file-name="components/main-nav.tsx">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md hover:bg-accent/50" data-unique-id="a4bdacc6-5e25-47ab-b8c5-dfe30f7d9a15" data-file-name="components/main-nav.tsx" data-dynamic-text="true">
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
    }} className="md:hidden absolute top-16 right-0 left-0 z-50 bg-background border-b border-border shadow-lg" data-unique-id="1ced279c-ffde-4784-a976-1124c2cb2afd" data-file-name="components/main-nav.tsx">
          <div className="py-2" data-unique-id="959cd261-5352-46ce-87e0-03f889c2f54a" data-file-name="components/main-nav.tsx" data-dynamic-text="true">
            {routes.map(route => <Link key={route.href} href={route.href} onClick={() => setMobileMenuOpen(false)} className={`
                  flex items-center px-6 py-3 w-full text-left
                  ${route.active ? 'bg-primary/10 text-primary' : 'hover:bg-accent/50'}
                `} data-unique-id="3ff60977-3e09-49f5-a50c-d984ea70d54f" data-file-name="components/main-nav.tsx" data-dynamic-text="true">
                <span className="mr-3" data-unique-id="3e51ae7b-2971-45d0-a322-f9c4c77c56d0" data-file-name="components/main-nav.tsx" data-dynamic-text="true">{route.icon}</span>
                {route.label}
              </Link>)}
          </div>
        </motion.div>}
    </>;
}