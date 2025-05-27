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
  }} className="h-screen sticky top-0 bg-gray-800 border-r border-gray-700 flex flex-col" data-unique-id="39439e71-e58a-45d1-837a-27001d163c0e" data-file-name="components/admin/sidebar.tsx">
      <div className="p-4 flex items-center justify-between border-b border-gray-700" data-unique-id="44777b59-093a-4f9e-bafb-9c3331da11ae" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
        {expanded && <motion.h1 initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="text-xl font-bold text-indigo-400" data-unique-id="5abbb82d-d622-4714-8de3-753499af7182" data-file-name="components/admin/sidebar.tsx"><span className="editable-text" data-unique-id="178e182e-5452-4f9f-a35a-5b9d8b18dc89" data-file-name="components/admin/sidebar.tsx">
            Admin Panel
          </span></motion.h1>}
        
        <button onClick={() => setExpanded(!expanded)} className={`p-2 rounded-md hover:bg-gray-700 ${!expanded ? 'mx-auto' : ''}`} data-unique-id="3e746356-e586-4e60-8108-45826cf2ebb6" data-file-name="components/admin/sidebar.tsx">
          <motion.div animate={{
          rotate: expanded ? 0 : 180
        }} transition={{
          duration: 0.2
        }} data-unique-id="f95e5511-fcea-459a-bbe7-127d7cc9e555" data-file-name="components/admin/sidebar.tsx">
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </motion.div>
        </button>
      </div>
      
      <div className="flex-1 py-6 flex flex-col" data-unique-id="28134929-0dca-45d6-ae55-6e51bf3bf9f5" data-file-name="components/admin/sidebar.tsx">
        <nav className="space-y-1 px-2" data-unique-id="eaf17719-be22-4bc8-af63-077a134f5763" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
          {navItems.map(item => {
          // Skip items that require superadmin if user is not superadmin
          if (item.requiresSuperAdmin && currentUser?.role !== 'superadmin') {
            return null;
          }
          const isActive = pathname === item.href;
          return <Link key={item.href} href={item.href} className={`
                  flex items-center px-3 py-3 rounded-md transition-colors
                  ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                `} data-unique-id="7f902b71-08c1-47e8-aece-a03188a3972e" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
                <span className="text-lg" data-unique-id="489ed696-8ff3-415c-b38b-e0f8ba7ee4c9" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">{item.icon}</span>
                {expanded && <motion.span initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} exit={{
              opacity: 0
            }} className="ml-3 text-sm font-medium" data-unique-id="00034ebd-e6df-49ef-b863-55fffd80db87" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
                    {item.name}
                  </motion.span>}
              </Link>;
        })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-700" data-unique-id="add5c829-72af-4438-b938-6b984f432084" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
        {expanded && currentUser && <div className="mb-4 px-2 py-3 bg-gray-700/30 rounded-md" data-unique-id="5a85305d-db5f-4b54-a9db-8d143b3ca6ff" data-file-name="components/admin/sidebar.tsx">
            <div className="text-sm font-medium text-gray-200" data-unique-id="ff663e27-98b2-43c1-b9f1-e5c37f619b23" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
              {currentUser.username}
            </div>
            <div className="text-xs text-gray-400" data-unique-id="19e6c2ba-629e-4c5d-8149-6f633ea3d35b" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
              {currentUser.role}
            </div>
          </div>}
        
        <button onClick={logout} className={`
            flex items-center text-sm px-3 py-3 w-full rounded-md
            text-red-400 hover:bg-red-700/20 hover:text-red-300 transition-colors
          `} data-unique-id="2422884a-c2ad-4ab9-a4d4-1ebb01aefd8a" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
          <LogOut className="h-5 w-5" />
          {expanded && <span className="ml-3" data-unique-id="c0d95189-32a4-4f36-86a5-7697c18fffdb" data-file-name="components/admin/sidebar.tsx"><span className="editable-text" data-unique-id="bf40a34b-fd59-4022-9eb8-31e3225476e3" data-file-name="components/admin/sidebar.tsx">Sign Out</span></span>}
        </button>
      </div>
    </motion.div>;
}