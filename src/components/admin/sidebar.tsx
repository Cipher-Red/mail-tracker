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
  }} className="h-screen sticky top-0 bg-gray-800 border-r border-gray-700 flex flex-col" data-unique-id="f98efe91-ce3f-413d-a997-30dbbad8b459" data-file-name="components/admin/sidebar.tsx">
      <div className="p-4 flex items-center justify-between border-b border-gray-700" data-unique-id="6b0a0b3e-a5d8-43a6-a454-cc594bcad79b" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
        {expanded && <motion.h1 initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="text-xl font-bold text-indigo-400" data-unique-id="d550c8b9-3b12-4c53-9716-9954aa3128ca" data-file-name="components/admin/sidebar.tsx"><span className="editable-text" data-unique-id="d391eae0-77c0-40a3-9aed-f96b41881fa6" data-file-name="components/admin/sidebar.tsx">
            Admin Panel
          </span></motion.h1>}
        
        <button onClick={() => setExpanded(!expanded)} className={`p-2 rounded-md hover:bg-gray-700 ${!expanded ? 'mx-auto' : ''}`} data-unique-id="526cdb11-9d2f-406c-93b0-56b6fba311f6" data-file-name="components/admin/sidebar.tsx">
          <motion.div animate={{
          rotate: expanded ? 0 : 180
        }} transition={{
          duration: 0.2
        }} data-unique-id="43c0b3a7-a09f-4610-b859-d1058e774cc9" data-file-name="components/admin/sidebar.tsx">
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </motion.div>
        </button>
      </div>
      
      <div className="flex-1 py-6 flex flex-col" data-unique-id="62235e53-0d46-4aee-b36d-c6afba8af07f" data-file-name="components/admin/sidebar.tsx">
        <nav className="space-y-1 px-2" data-unique-id="e0da8596-9fe9-4fb0-958f-4d7bb2189745" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
          {navItems.map(item => {
          // Skip items that require superadmin if user is not superadmin
          if (item.requiresSuperAdmin && currentUser?.role !== 'superadmin') {
            return null;
          }
          const isActive = pathname === item.href;
          return <Link key={item.href} href={item.href} className={`
                  flex items-center px-3 py-3 rounded-md transition-colors
                  ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                `} data-unique-id="11397361-2ee9-4828-a3db-d853bdf42883" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
                <span className="text-lg" data-unique-id="4bb0afa8-c4e1-4462-bbf7-f0fa42672e72" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">{item.icon}</span>
                {expanded && <motion.span initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} exit={{
              opacity: 0
            }} className="ml-3 text-sm font-medium" data-unique-id="403af9fa-d4a1-4e07-b938-ec0423e90d48" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
                    {item.name}
                  </motion.span>}
              </Link>;
        })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-700" data-unique-id="09c6893c-3df8-49f6-952c-48c0affb04d7" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
        {expanded && currentUser && <div className="mb-4 px-2 py-3 bg-gray-700/30 rounded-md" data-unique-id="811ef664-941b-42a1-98ca-aadd8ca28381" data-file-name="components/admin/sidebar.tsx">
            <div className="text-sm font-medium text-gray-200" data-unique-id="edf72650-b30b-455a-ab89-3b98bf157403" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
              {currentUser.username}
            </div>
            <div className="text-xs text-gray-400" data-unique-id="48559a93-7a12-470f-a12f-7a60ef2999c2" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
              {currentUser.role}
            </div>
          </div>}
        
        <button onClick={logout} className={`
            flex items-center text-sm px-3 py-3 w-full rounded-md
            text-red-400 hover:bg-red-700/20 hover:text-red-300 transition-colors
          `} data-unique-id="f23b9bc8-6ad8-40dc-a67f-db97a61913df" data-file-name="components/admin/sidebar.tsx" data-dynamic-text="true">
          <LogOut className="h-5 w-5" />
          {expanded && <span className="ml-3" data-unique-id="4b9e6190-a3d0-4456-8210-77b396798b66" data-file-name="components/admin/sidebar.tsx"><span className="editable-text" data-unique-id="667dc032-e95f-42e5-b04f-d51439b71e06" data-file-name="components/admin/sidebar.tsx">Sign Out</span></span>}
        </button>
      </div>
    </motion.div>;
}