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
  }} className="h-screen sticky top-0 bg-gray-800 border-r border-gray-700 flex flex-col" data-unique-id="9edf3d77-4983-4e14-9d10-ac6f6e1392aa" data-file-name="components/admin/sidebar.tsx">
      <div className="p-4 flex items-center justify-between border-b border-gray-700" data-unique-id="4883a5e7-52de-4676-ad86-297b724b113e" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
        {expanded && <motion.h1 initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="text-xl font-bold text-indigo-400" data-unique-id="3591eb36-2191-4e59-8e00-96c426c71306" data-file-name="components/admin/sidebar.tsx"><span className="editable-text" data-unique-id="1ef2082f-5835-4be9-949a-52dadc6cea48" data-file-name="components/admin/sidebar.tsx">
            Admin Panel
          </span></motion.h1>}
        
        <button onClick={() => setExpanded(!expanded)} className={`p-2 rounded-md hover:bg-gray-700 ${!expanded ? 'mx-auto' : ''}`} data-unique-id="d10c95ee-3be7-4a03-89f4-e27e89bda779" data-file-name="components/admin/sidebar.tsx">
          <motion.div animate={{
          rotate: expanded ? 0 : 180
        }} transition={{
          duration: 0.2
        }} data-unique-id="0119e789-9284-4636-bd5d-2f3ce7c9bcd0" data-file-name="components/admin/sidebar.tsx">
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </motion.div>
        </button>
      </div>
      
      <div className="flex-1 py-6 flex flex-col" data-unique-id="c12a4cd2-b1c5-4151-91e1-bb1262b20eab" data-file-name="components/admin/sidebar.tsx">
        <nav className="space-y-1 px-2" data-unique-id="0f83db34-c7e1-4507-a1d5-2fe1a516087d" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
          {navItems.map(item => {
          // Skip items that require superadmin if user is not superadmin
          if (item.requiresSuperAdmin && currentUser?.role !== 'superadmin') {
            return null;
          }
          const isActive = pathname === item.href;
          return <Link key={item.href} href={item.href} className={`
                  flex items-center px-3 py-3 rounded-md transition-colors
                  ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                `} data-unique-id="da3cc48c-3b97-4274-af25-82fb41017995" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
                <span className="text-lg" data-unique-id="3bfbced7-b4b5-4ec7-9c5c-5d12ab84097d" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">{item.icon}</span>
                {expanded && <motion.span initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} exit={{
              opacity: 0
            }} className="ml-3 text-sm font-medium" data-unique-id="016e8c30-a535-4811-8a07-5784bd7f37c3" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
                    {item.name}
                  </motion.span>}
              </Link>;
        })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-700" data-unique-id="fc3ba176-4d8b-416f-bfa7-802eb078e117" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
        {expanded && currentUser && <div className="mb-4 px-2 py-3 bg-gray-700/30 rounded-md" data-unique-id="a5479494-d202-4009-9cc1-1dbbfcfb1e91" data-file-name="components/admin/sidebar.tsx">
            <div className="text-sm font-medium text-gray-200" data-unique-id="f785d76a-a5a0-473f-a3af-d9fd4deb309e" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
              {currentUser.username}
            </div>
            <div className="text-xs text-gray-400" data-unique-id="96ad0d39-1c1b-462a-bf7d-58ed4c24ea42" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
              {currentUser.role}
            </div>
          </div>}
        
        <button onClick={logout} className={`
            flex items-center text-sm px-3 py-3 w-full rounded-md
            text-red-400 hover:bg-red-700/20 hover:text-red-300 transition-colors
          `} data-unique-id="f469e1f8-6046-409b-9ffd-63e7688d8537" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
          <LogOut className="h-5 w-5" />
          {expanded && <span className="ml-3" data-unique-id="95b7ec50-6d04-4c49-8d08-d4cd80ea2b84" data-file-name="components/admin/sidebar.tsx"><span className="editable-text" data-unique-id="5db7accf-a282-43ef-8ce4-59172c6f9342" data-file-name="components/admin/sidebar.tsx">Sign Out</span></span>}
        </button>
      </div>
    </motion.div>;
}