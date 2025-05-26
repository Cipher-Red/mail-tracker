'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAdminAuth } from '@/lib/admin-auth';
import { LayoutDashboard, Users, ActivityIcon, Settings, LogOut, ChevronRight, Database } from 'lucide-react';
export default function AdminSidebar() {
  const {
    currentUser,
    logout
  } = useAdminAuth();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);
  const navItems = [{
    name: 'Dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: '/admin'
  }, {
    name: 'User Activity',
    icon: <ActivityIcon className="h-5 w-5" />,
    href: '/admin/activity'
  }, {
    name: 'User Management',
    icon: <Users className="h-5 w-5" />,
    href: '/admin/users',
    requiresSuperAdmin: true
  }, {
    name: 'Database',
    icon: <Database className="h-5 w-5" />,
    href: '/admin/database'
  }, {
    name: 'Settings',
    icon: <Settings className="h-5 w-5" />,
    href: '/admin/settings'
  }];
  return <motion.div animate={{
    width: expanded ? 250 : 70
  }} className="h-screen sticky top-0 bg-gray-800 border-r border-gray-700 flex flex-col" data-unique-id="a8b8ae3a-e691-4dd2-be57-e1dc457b9195" data-file-name="components/admin/sidebar.tsx">
      <div className="p-4 flex items-center justify-between border-b border-gray-700" data-unique-id="b30da604-619a-484d-980d-6a27a7bc1233" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
        {expanded && <motion.h1 initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="text-xl font-bold text-indigo-400" data-unique-id="5533c2ab-81e7-4be8-9867-1aeb35f46644" data-file-name="components/admin/sidebar.tsx"><span className="editable-text" data-unique-id="f6ebc92d-d8df-4abd-9e86-e41d81eb3f4f" data-file-name="components/admin/sidebar.tsx">
            Admin Panel
          </span></motion.h1>}
        
        <button onClick={() => setExpanded(!expanded)} className={`p-2 rounded-md hover:bg-gray-700 ${!expanded ? 'mx-auto' : ''}`} data-unique-id="e7fb610f-d9f6-4960-bf6c-d3ee8a1d2f0a" data-file-name="components/admin/sidebar.tsx">
          <motion.div animate={{
          rotate: expanded ? 0 : 180
        }} transition={{
          duration: 0.2
        }} data-unique-id="c2c0ee09-a18c-47b3-99f1-261110e2e879" data-file-name="components/admin/sidebar.tsx">
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </motion.div>
        </button>
      </div>
      
      <div className="flex-1 py-6 flex flex-col" data-unique-id="df5a4163-679f-402f-87a1-56bf94929c88" data-file-name="components/admin/sidebar.tsx">
        <nav className="space-y-1 px-2" data-unique-id="359251a6-6f2c-47b0-8716-59126a277a4f" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
          {navItems.map(item => {
          // Skip items that require superadmin if user is not superadmin
          if (item.requiresSuperAdmin && currentUser?.role !== 'superadmin') {
            return null;
          }
          const isActive = pathname === item.href;
          return <Link key={item.href} href={item.href} className={`
                  flex items-center px-3 py-3 rounded-md transition-colors
                  ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                `} data-unique-id="bb2366da-f160-4fc0-a6a9-34a3a60d60d5" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
                <span className="text-lg" data-unique-id="0b4eeda9-85c7-447c-b1fe-ba8284483e73" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">{item.icon}</span>
                {expanded && <motion.span initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} exit={{
              opacity: 0
            }} className="ml-3 text-sm font-medium" data-unique-id="7ad81347-6aec-4604-8d84-dd97665ef44f" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
                    {item.name}
                  </motion.span>}
              </Link>;
        })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-700" data-unique-id="17592d54-86aa-4de9-8d45-e758d571ff20" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
        {expanded && currentUser && <div className="mb-4 px-2 py-3 bg-gray-700/30 rounded-md" data-unique-id="8130e087-2b42-4901-90b6-6912cec1eb13" data-file-name="components/admin/sidebar.tsx">
            <div className="text-sm font-medium text-gray-200" data-unique-id="f40cbbe4-c134-4cdc-82dc-c2ac5ff7861d" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
              {currentUser.username}
            </div>
            <div className="text-xs text-gray-400" data-unique-id="021c1b32-dabf-473c-8665-46b977fe8a69" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
              {currentUser.role}
            </div>
          </div>}
        
        <button onClick={logout} className={`
            flex items-center text-sm px-3 py-3 w-full rounded-md
            text-red-400 hover:bg-red-700/20 hover:text-red-300 transition-colors
          `} data-unique-id="8ad41f1a-fd3f-4ff6-9677-b567aedc0096" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
          <LogOut className="h-5 w-5" />
          {expanded && <span className="ml-3" data-unique-id="c69f0e35-e48a-450b-9acf-12f2b3998ef2" data-file-name="components/admin/sidebar.tsx"><span className="editable-text" data-unique-id="9bb2e6a2-df33-4cea-bce8-52253bbdb2db" data-file-name="components/admin/sidebar.tsx">Sign Out</span></span>}
        </button>
      </div>
    </motion.div>;
}