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
  }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" data-unique-id="4ee8de0e-a5f4-4d5b-a6b7-42fb5f47e70d" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">
      {stats.map((stat, i) => <motion.div key={stat.title} initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.3,
      delay: 0.1 * i
    }} className={`${stat.color} p-4 rounded-lg shadow-sm flex justify-between items-center`} data-unique-id="f6d0c6e6-f451-4d5d-a7a3-84f350de07f2" data-file-name="components/customer-stats.tsx">
          <div data-unique-id="31a4efcf-e998-4757-bec6-154c743de045" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">
            <h3 className="text-sm font-medium mb-1" data-unique-id="60714766-fd33-47dd-8a70-3ae6d544ae33" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">{stat.title}</h3>
            <p className="text-2xl font-bold" data-unique-id="7cbc6557-bd1a-4ac6-a83a-d38059975a48" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">{stat.value}</p>
            {stat.percentage !== undefined && <p className="text-xs mt-1" data-unique-id="3b93f019-7106-4b63-9208-bcbb13648be8" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">{stat.percentage}<span className="editable-text" data-unique-id="314a1e28-8c2b-467d-bc30-31afd5b946ac" data-file-name="components/customer-stats.tsx">% of total</span></p>}
          </div>
          <div className="rounded-full p-2 bg-white bg-opacity-30" data-unique-id="00fbbfdf-cdc6-42e8-8732-321f3b12e8c9" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">
            {stat.icon}
          </div>
        </motion.div>)}
    </motion.div>;
}