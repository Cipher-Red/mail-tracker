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
  }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" data-unique-id="7f121862-ba96-4b0b-aaf0-5d0b03712e47" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">
      {stats.map((stat, i) => <motion.div key={stat.title} initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.3,
      delay: 0.1 * i
    }} className={`${stat.color} p-4 rounded-lg shadow-sm flex justify-between items-center`} data-unique-id="c58b5e83-7059-4d6d-8e78-934a6f4b372c" data-file-name="components/customer-stats.tsx">
          <div data-unique-id="832214ab-0f15-4ba0-ae9c-c426fe0bb318" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">
            <h3 className="text-sm font-medium mb-1" data-unique-id="3e15732d-c78c-4eb7-88d8-6d0b2d5d6f66" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">{stat.title}</h3>
            <p className="text-2xl font-bold" data-unique-id="8f5f6b71-27f0-4888-9ab6-be7592651523" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">{stat.value}</p>
            {stat.percentage !== undefined && <p className="text-xs mt-1" data-unique-id="6fd7b34f-2bfd-4d30-a136-f1bab9925264" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">{stat.percentage}<span className="editable-text" data-unique-id="6714a9a3-2f6e-4bc7-a61f-696071e9ce10" data-file-name="components/customer-stats.tsx">% of total</span></p>}
          </div>
          <div className="rounded-full p-2 bg-white bg-opacity-30" data-unique-id="1fc0c469-7697-4ca3-a836-6e5886e31c33" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">
            {stat.icon}
          </div>
        </motion.div>)}
    </motion.div>;
}