'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, FileText, Menu, X, Filter, Package2, Activity, HelpCircle } from 'lucide-react';
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
  }, {
    href: '/data-explorer',
    icon: <Filter className="h-5 w-5" />,
    label: 'Data Explorer',
    active: pathname === '/data-explorer'
  }, {
    href: '/returned-parts-tracking',
    icon: <Package2 className="h-5 w-5" />,
    label: 'Returned Parts',
    active: pathname === '/returned-parts-tracking'
  }, {
    href: '/realtime-sync',
    icon: <Activity className="h-5 w-5" />,
    label: 'Real-time Sync',
    active: pathname === '/realtime-sync'
  }];
  return <>
      <nav className="hidden md:flex items-center space-x-1" data-unique-id="c2b71bcd-38b9-4329-b032-a5f0c2c70228" data-file-name="components/main-nav.tsx" data-dynamic-text="true">
        {routes.map(route => <Link key={route.href} href={route.href} className={`
              flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors
              ${route.active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}
            `} data-unique-id="e9031277-50e8-408a-9526-0448225b6912" data-file-name="components/main-nav.tsx" data-dynamic-text="true">
            <span className="mr-2" data-unique-id="858c64f0-19a3-4794-aa8f-77355a04f361" data-file-name="components/main-nav.tsx" data-dynamic-text="true">{route.icon}</span>
            {route.label}
          </Link>)}
      </nav>
      
      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center" data-unique-id="c257fd82-2f67-499b-8c37-8bf4a6455fcb" data-file-name="components/main-nav.tsx">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md hover:bg-accent/50" data-unique-id="48644d40-4f27-4d21-b1e2-24956612ea59" data-file-name="components/main-nav.tsx" data-dynamic-text="true">
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
    }} className="md:hidden absolute top-16 right-0 left-0 z-50 bg-background border-b border-border shadow-lg" data-unique-id="b711342d-8628-4221-a1e7-53f36b1ff99a" data-file-name="components/main-nav.tsx">
          <div className="py-2" data-unique-id="4041caf9-3c6c-44eb-aae3-5c20ae7df4a3" data-file-name="components/main-nav.tsx" data-dynamic-text="true">
            {routes.map(route => <Link key={route.href} href={route.href} onClick={() => setMobileMenuOpen(false)} className={`
                  flex items-center px-6 py-3 w-full text-left
                  ${route.active ? 'bg-primary/10 text-primary' : 'hover:bg-accent/50'}
                `} data-unique-id="9d19b27e-8820-4819-abc1-19c2263cb65b" data-file-name="components/main-nav.tsx" data-dynamic-text="true">
                <span className="mr-3" data-unique-id="63d37d78-e935-40f0-b134-4c9b2814e6b6" data-file-name="components/main-nav.tsx" data-dynamic-text="true">{route.icon}</span>
                {route.label}
              </Link>)}
          </div>
        </motion.div>}
    </>;
}