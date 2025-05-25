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
  }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" data-unique-id="e70cf520-1e78-4551-969a-b25cf29b220d" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">
      {stats.map((stat, i) => <motion.div key={stat.title} initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.3,
      delay: 0.1 * i
    }} className={`${stat.color} p-4 rounded-lg shadow-sm flex justify-between items-center`} data-unique-id="65a3bc64-15b5-48f2-b8c9-a968e86b5068" data-file-name="components/customer-stats.tsx">
          <div data-unique-id="d145a259-3cf4-4c3c-bb78-1f7eba841ebd" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">
            <h3 className="text-sm font-medium mb-1" data-unique-id="e29ab313-6b69-4789-8693-e3176dc7b95f" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">{stat.title}</h3>
            <p className="text-2xl font-bold" data-unique-id="35976a6b-3bb6-474f-a6b8-c9b61224ae33" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">{stat.value}</p>
            {stat.percentage !== undefined && <p className="text-xs mt-1" data-unique-id="f24fa43b-8a46-416d-b5b6-9b46468c9439" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">{stat.percentage}<span className="editable-text" data-unique-id="344e4c30-ec6b-47b3-bf6d-1f4dbc291a63" data-file-name="components/customer-stats.tsx">% of total</span></p>}
          </div>
          <div className="rounded-full p-2 bg-white bg-opacity-30" data-unique-id="6395d2fe-d37b-4718-bb46-831c8be98f50" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">
            {stat.icon}
          </div>
        </motion.div>)}
    </motion.div>;
}