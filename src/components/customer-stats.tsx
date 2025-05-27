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
  }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" data-unique-id="c0d7e14c-d878-4f7f-bc2e-b50fc46a596e" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">
      {stats.map((stat, i) => <motion.div key={stat.title} initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.3,
      delay: 0.1 * i
    }} className={`${stat.color} p-4 rounded-lg shadow-sm flex justify-between items-center`} data-unique-id="9baf8034-2ee1-4119-9230-74cda35ccee5" data-file-name="components/customer-stats.tsx">
          <div data-unique-id="75c77696-79ee-45d8-a62a-dd3b790fc8a1" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">
            <h3 className="text-sm font-medium mb-1" data-unique-id="92ee41b1-eb60-4012-a6db-b2976b5cc6c6" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">{stat.title}</h3>
            <p className="text-2xl font-bold" data-unique-id="a1206fec-1404-4d43-96d1-dabc34d50b01" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">{stat.value}</p>
            {stat.percentage !== undefined && <p className="text-xs mt-1" data-unique-id="44b9303e-1113-4e3e-bcd8-1b5615585a7e" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">{stat.percentage}<span className="editable-text" data-unique-id="bdba7651-c2cb-4d92-8544-5c7aaaad47cf" data-file-name="components/customer-stats.tsx">% of total</span></p>}
          </div>
          <div className="rounded-full p-2 bg-white bg-opacity-30" data-unique-id="2a7dca2f-cd02-4dec-a5f3-c973981f20ea" data-file-name="components/customer-stats.tsx" data-dynamic-text="true">
            {stat.icon}
          </div>
        </motion.div>)}
    </motion.div>;
}