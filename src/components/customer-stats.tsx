'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, Mail, Phone, Clock } from 'lucide-react';
interface CustomerStatsProps {
  customers: any[];
}
export default function CustomerStats({
  customers
}: CustomerStatsProps) {
  // Calculate customer statistics
  const totalCustomers = customers.length;
  const withEmail = customers.filter(c => c.email).length;
  const withPhone = customers.filter(c => c.phone).length;
  const recentlyAdded = customers.filter(c => c.addedAt && new Date().getTime() - new Date(c.addedAt).getTime() < 7 * 24 * 60 * 60 * 1000).length;
  const stats = [{
    title: 'Total Customers',
    value: totalCustomers,
    icon: <Users className="h-5 w-5 text-primary" />,
    color: 'bg-primary/10 text-primary'
  }, {
    title: 'With Email',
    value: withEmail,
    percentage: totalCustomers ? Math.round(withEmail / totalCustomers * 100) : 0,
    icon: <Mail className="h-5 w-5 text-blue-500" />,
    color: 'bg-blue-50 text-blue-700'
  }, {
    title: 'With Phone',
    value: withPhone,
    percentage: totalCustomers ? Math.round(withPhone / totalCustomers * 100) : 0,
    icon: <Phone className="h-5 w-5 text-green-500" />,
    color: 'bg-green-50 text-green-700'
  }, {
    title: 'Added This Week',
    value: recentlyAdded,
    icon: <Clock className="h-5 w-5 text-amber-500" />,
    color: 'bg-amber-50 text-amber-700'
  }];
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.3
  }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" data-unique-id="9d6f95a9-f672-4b07-b100-15928cf8ce67" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">
      {stats.map((stat, i) => <motion.div key={stat.title} initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.3,
      delay: 0.1 * i
    }} className={`${stat.color} p-4 rounded-lg shadow-sm flex justify-between items-center`} data-unique-id="8f8ec490-e697-42b0-bf99-c178395e8976" data-file-name="components/customer-stats.tsx">
          <div data-unique-id="8a908068-4955-407b-9b04-bb7298012b18" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">
            <h3 className="text-sm font-medium mb-1" data-unique-id="bfb49369-6bcd-4750-bcf6-785a0fca0995" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">{stat.title}</h3>
            <p className="text-2xl font-bold" data-unique-id="6c48a7ac-ff68-4dcc-bd7c-6f5edd38a589" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">{stat.value}</p>
            {stat.percentage !== undefined && <p className="text-xs mt-1" data-unique-id="521dd6a3-b2d6-4e57-aa68-1a466bc3bcdc" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">{stat.percentage}<span className="editable-text" data-unique-id="1bc7aa4d-7056-489d-a5b9-b5b26f10c3d0" data-file-name="components/customer-stats.tsx">% of total</span></p>}
          </div>
          <div className="rounded-full p-2 bg-white bg-opacity-30" data-unique-id="428cec76-b369-4e02-a395-3abfd1a8d83d" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">
            {stat.icon}
          </div>
        </motion.div>)}
    </motion.div>;
}