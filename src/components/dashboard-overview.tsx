'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Users, Package, FileSpreadsheet, BarChart3, Settings, ArrowRight, TrendingUp, Clock, CheckCircle } from 'lucide-react';
interface DashboardStats {
  totalCustomers: number;
  totalOrders: number;
  emailsSent: number;
  templatesCreated: number;
  returnedParts: number;
}
export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalOrders: 0,
    emailsSent: 0,
    templatesCreated: 0,
    returnedParts: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Load stats from localStorage for now
    const loadStats = () => {
      try {
        const customers = JSON.parse(localStorage.getItem('emailCustomers') || '[]');
        const orders = JSON.parse(localStorage.getItem('lastProcessedOrders') || '[]');
        const templates = JSON.parse(localStorage.getItem('emailTemplates') || '[]');
        const returnedParts = JSON.parse(localStorage.getItem('returnedParts') || '[]');
        setStats({
          totalCustomers: customers.length,
          totalOrders: orders.length,
          emailsSent: 156,
          // Mock data
          templatesCreated: templates.length,
          returnedParts: returnedParts.length
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, []);
  const quickActions = [{
    title: 'Create Email Template',
    description: 'Design professional email templates',
    href: '/?tab=editor',
    icon: Mail,
    color: 'bg-blue-500',
    gradient: 'from-blue-500 to-blue-600'
  }, {
    title: 'Manage Customers',
    description: 'Add and organize customer data',
    href: '/?tab=customers',
    icon: Users,
    color: 'bg-green-500',
    gradient: 'from-green-500 to-green-600'
  }, {
    title: 'Process Orders',
    description: 'Import and manage order data',
    href: '/order-processor',
    icon: Package,
    color: 'bg-purple-500',
    gradient: 'from-purple-500 to-purple-600'
  }, {
    title: 'Track Returns',
    description: 'Monitor returned parts status',
    href: '/returned-parts-tracking',
    icon: FileSpreadsheet,
    color: 'bg-orange-500',
    gradient: 'from-orange-500 to-orange-600'
  }];
  const statCards = [{
    title: 'Total Customers',
    value: stats.totalCustomers,
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    change: '+12%'
  }, {
    title: 'Orders Processed',
    value: stats.totalOrders,
    icon: Package,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    change: '+8%'
  }, {
    title: 'Emails Sent',
    value: stats.emailsSent,
    icon: Mail,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    change: '+24%'
  }, {
    title: 'Templates Created',
    value: stats.templatesCreated,
    icon: FileSpreadsheet,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    change: '+5%'
  }];
  if (isLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center" data-unique-id="31b59fdd-5b3a-461e-b71f-b5858e1e0dba" data-file-name="components/dashboard-overview.tsx">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" data-unique-id="528a1558-44f2-4de1-9a80-42e53f871558" data-file-name="components/dashboard-overview.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" data-unique-id="ebb42c3e-d84e-467f-a658-8e94eadec600" data-file-name="components/dashboard-overview.tsx">
      <div className="container mx-auto px-6 py-8" data-unique-id="a54f3526-ece0-48c5-b1c7-baaa37d49781" data-file-name="components/dashboard-overview.tsx" data-dynamic-text="true">
        {/* Header */}
        <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="mb-8" data-unique-id="1a829234-5b8e-422c-b885-2412a29d0f37" data-file-name="components/dashboard-overview.tsx">
          <h1 className="text-4xl font-bold text-gray-900 mb-2" data-unique-id="eef2e939-066b-4014-9069-826aab3d593f" data-file-name="components/dashboard-overview.tsx"><span className="editable-text" data-unique-id="996487e0-9d02-4f9f-83cf-0f4b1fea3ad3" data-file-name="components/dashboard-overview.tsx">
            Detroit Axle Dashboard
          </span></h1>
          <p className="text-lg text-gray-600" data-unique-id="a14d403e-a8a6-41b5-a5c6-62e949a349b7" data-file-name="components/dashboard-overview.tsx"><span className="editable-text" data-unique-id="3a70f391-14c6-467c-8f53-5b115f9aded7" data-file-name="components/dashboard-overview.tsx">
            Manage your email templates, customers, and orders all in one place
          </span></p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-unique-id="563324d7-b9dd-4499-a45d-75e297520876" data-file-name="components/dashboard-overview.tsx" data-dynamic-text="true">
          {statCards.map((stat, index) => <motion.div key={stat.title} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: index * 0.1
        }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow" data-unique-id="7b18c10f-8ef9-437d-b021-2e40daba9ae3" data-file-name="components/dashboard-overview.tsx">
              <div className="flex items-center justify-between" data-unique-id="381c2e90-9ad9-47e9-b6b9-1e5b777c0217" data-file-name="components/dashboard-overview.tsx">
                <div data-unique-id="15ef584d-d83b-43e2-bff8-30ab2a866692" data-file-name="components/dashboard-overview.tsx">
                  <p className="text-sm font-medium text-gray-600 mb-1" data-unique-id="7d915c01-f52d-4824-b827-5567678ed0f6" data-file-name="components/dashboard-overview.tsx" data-dynamic-text="true">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900" data-unique-id="c77a8663-7c06-4f3a-8f06-58be95e0ff4e" data-file-name="components/dashboard-overview.tsx" data-dynamic-text="true">
                    {stat.value.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2" data-unique-id="b8d78f79-201f-4e7e-8418-f1991e1293bf" data-file-name="components/dashboard-overview.tsx">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" data-unique-id="d1dd0a26-f8a0-453b-9e43-3331558ccb53" data-file-name="components/dashboard-overview.tsx" data-dynamic-text="true" />
                    <span className="text-sm text-green-600 font-medium" data-unique-id="c8cc13ce-83a5-43b6-9241-c490e6f65145" data-file-name="components/dashboard-overview.tsx" data-dynamic-text="true">
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1" data-unique-id="1987d9cb-67df-4ad5-9a72-43ab5208e9d1" data-file-name="components/dashboard-overview.tsx"><span className="editable-text" data-unique-id="239113bc-f18f-4ef8-938c-7d53c5dbf1cd" data-file-name="components/dashboard-overview.tsx">vs last month</span></span>
                  </div>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`} data-unique-id="4a3504b8-1c17-48a0-9809-9f720583ee13" data-file-name="components/dashboard-overview.tsx">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} data-unique-id="6df76fbe-5584-4707-8a28-457223db3271" data-file-name="components/dashboard-overview.tsx" data-dynamic-text="true" />
                </div>
              </div>
            </motion.div>)}
        </div>

        {/* Quick Actions */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.4
      }} className="mb-8" data-unique-id="eb9af83b-df0e-4342-802b-f0188d1d2af1" data-file-name="components/dashboard-overview.tsx">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6" data-unique-id="fbe17635-37de-4d8c-8f1b-570230aa541e" data-file-name="components/dashboard-overview.tsx"><span className="editable-text" data-unique-id="b0f30496-a5d0-4423-98bd-7648d70286c8" data-file-name="components/dashboard-overview.tsx">
            Quick Actions
          </span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-unique-id="4aba8395-a759-46b3-9658-3018b5779501" data-file-name="components/dashboard-overview.tsx" data-dynamic-text="true">
            {quickActions.map((action, index) => <Link key={action.title} href={action.href} data-unique-id="aca9f8ae-f153-4085-85b4-587abc1c9eeb" data-file-name="components/dashboard-overview.tsx">
                <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.5 + index * 0.1
            }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group" data-unique-id="86102f08-0aaa-4b47-96a8-8387329872a2" data-file-name="components/dashboard-overview.tsx">
                  <div className={`w-12 h-12 bg-gradient-to-r ${action.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`} data-unique-id="205668dd-5235-4ceb-99cb-edfa02c10ca4" data-file-name="components/dashboard-overview.tsx">
                    <action.icon className="h-6 w-6 text-white" data-unique-id="9fdc6252-e06c-4ede-8ec3-f5a4da685de2" data-file-name="components/dashboard-overview.tsx" data-dynamic-text="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2" data-unique-id="a0a1db1a-55ac-4449-a90c-33e45c114727" data-file-name="components/dashboard-overview.tsx" data-dynamic-text="true">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4" data-unique-id="3c1d95b7-d9fa-4dea-b948-07332eb2c4bb" data-file-name="components/dashboard-overview.tsx" data-dynamic-text="true">
                    {action.description}
                  </p>
                  <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700" data-unique-id="73b697a8-4f12-4350-9a5b-6887f3faf19d" data-file-name="components/dashboard-overview.tsx"><span className="editable-text" data-unique-id="17d452e6-601d-436a-8742-a93857d5a33f" data-file-name="components/dashboard-overview.tsx">
                    Get Started
                    </span><ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" data-unique-id="12096b7c-b1f6-4b7e-b4fd-f83adffe1e9a" data-file-name="components/dashboard-overview.tsx" data-dynamic-text="true" />
                  </div>
                </motion.div>
              </Link>)}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.8
      }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-unique-id="51e5e5d6-e7b8-4055-a6c3-ed641a9bda16" data-file-name="components/dashboard-overview.tsx">
          <div className="flex items-center justify-between mb-6" data-unique-id="8e9d0cf1-f711-4221-a775-0df86bcfc7e0" data-file-name="components/dashboard-overview.tsx">
            <h2 className="text-2xl font-semibold text-gray-900" data-unique-id="8b48b0b4-03dc-49fe-ba4b-0e59bd6f195c" data-file-name="components/dashboard-overview.tsx"><span className="editable-text" data-unique-id="32af9163-e792-4fff-bebb-0cf722385daa" data-file-name="components/dashboard-overview.tsx">
              Recent Activity
            </span></h2>
            <Link href="/admin/activity" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center" data-unique-id="2e1fd2b5-fe67-4429-8538-48ad930c6937" data-file-name="components/dashboard-overview.tsx"><span className="editable-text" data-unique-id="9cedbb66-86a7-411b-b96e-402dbefae0ef" data-file-name="components/dashboard-overview.tsx">
              View All
              </span><ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="space-y-4" data-unique-id="a1cc6ce0-859f-44e0-88b7-85d50727d24f" data-file-name="components/dashboard-overview.tsx" data-dynamic-text="true">
            {[{
            action: 'Email template created',
            description: 'Order Shipped template was created',
            time: '2 hours ago',
            icon: Mail,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
          }, {
            action: 'Customer data imported',
            description: '25 new customers added from Excel',
            time: '4 hours ago',
            icon: Users,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
          }, {
            action: 'Order batch processed',
            description: '150 orders processed successfully',
            time: '6 hours ago',
            icon: Package,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
          }].map((activity, index) => <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg" data-unique-id="7e43c61f-80ad-4fdb-b1b3-f1105d1e73ce" data-file-name="components/dashboard-overview.tsx">
                <div className={`${activity.bgColor} p-2 rounded-lg mr-4`} data-unique-id="3a71557e-fc5d-4931-9a83-8240235e435f" data-file-name="components/dashboard-overview.tsx">
                  <activity.icon className={`h-5 w-5 ${activity.color}`} data-unique-id="8ff86d02-adee-4f31-9a09-92a83ff792ee" data-file-name="components/dashboard-overview.tsx" data-dynamic-text="true" />
                </div>
                <div className="flex-1" data-unique-id="97308634-6d98-4af8-b943-54cfe9bd5c10" data-file-name="components/dashboard-overview.tsx">
                  <p className="font-medium text-gray-900" data-unique-id="2bc9053d-f4d3-4e9a-b020-d64fab55a28a" data-file-name="components/dashboard-overview.tsx" data-dynamic-text="true">{activity.action}</p>
                  <p className="text-sm text-gray-600" data-unique-id="82969760-4763-48e7-9621-7f56c1bd8bf3" data-file-name="components/dashboard-overview.tsx" data-dynamic-text="true">{activity.description}</p>
                </div>
                <div className="flex items-center text-sm text-gray-500" data-unique-id="4b8e7bf3-ef33-4735-b341-02e33317c635" data-file-name="components/dashboard-overview.tsx" data-dynamic-text="true">
                  <Clock className="h-4 w-4 mr-1" data-unique-id="5e54ab5c-295d-40cb-91da-13756982bfe0" data-file-name="components/dashboard-overview.tsx" data-dynamic-text="true" />
                  {activity.time}
                </div>
              </div>)}
          </div>
        </motion.div>
      </div>
    </div>;
}