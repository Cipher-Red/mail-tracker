'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Mail, Package, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
interface AnalyticsData {
  emailsSent: {
    date: string;
    count: number;
  }[];
  customerGrowth: {
    month: string;
    customers: number;
  }[];
  ordersByStatus: {
    status: string;
    count: number;
    color: string;
  }[];
  templateUsage: {
    name: string;
    usage: number;
  }[];
}
export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData>({
    emailsSent: [],
    customerGrowth: [],
    ordersByStatus: [],
    templateUsage: []
  });
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  useEffect(() => {
    // Generate mock analytics data
    const generateMockData = () => {
      const emailsSent = Array.from({
        length: 30
      }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        }),
        count: Math.floor(Math.random() * 50) + 10
      }));
      const customerGrowth = [{
        month: 'Jan',
        customers: 120
      }, {
        month: 'Feb',
        customers: 145
      }, {
        month: 'Mar',
        customers: 180
      }, {
        month: 'Apr',
        customers: 220
      }, {
        month: 'May',
        customers: 280
      }, {
        month: 'Jun',
        customers: 340
      }];
      const ordersByStatus = [{
        status: 'Completed',
        count: 450,
        color: '#10B981'
      }, {
        status: 'Processing',
        count: 120,
        color: '#F59E0B'
      }, {
        status: 'Shipped',
        count: 80,
        color: '#3B82F6'
      }, {
        status: 'Cancelled',
        count: 25,
        color: '#EF4444'
      }];
      const templateUsage = [{
        name: 'Order Shipped',
        usage: 85
      }, {
        name: 'Welcome Email',
        usage: 65
      }, {
        name: 'Order Confirmation',
        usage: 92
      }, {
        name: 'Return Request',
        usage: 45
      }, {
        name: 'Newsletter',
        usage: 38
      }];
      setData({
        emailsSent,
        customerGrowth,
        ordersByStatus,
        templateUsage
      });
    };
    generateMockData();
  }, [timeRange]);
  const metrics = [{
    title: 'Total Revenue',
    value: '$45,231',
    change: '+12.5%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  }, {
    title: 'Active Customers',
    value: '2,847',
    change: '+8.2%',
    trend: 'up',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  }, {
    title: 'Email Open Rate',
    value: '68.4%',
    change: '-2.1%',
    trend: 'down',
    icon: Mail,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  }, {
    title: 'Orders This Month',
    value: '1,234',
    change: '+15.3%',
    trend: 'up',
    icon: Package,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  }];
  return <div className="space-y-6" data-unique-id="423d27cf-427f-44a7-b5a1-d1769cd579fd" data-file-name="components/analytics-dashboard.tsx" data-dynamic-text="true">
      {/* Header */}
      <div className="flex items-center justify-between" data-unique-id="89148dc2-b579-436f-8a35-ffeb06490963" data-file-name="components/analytics-dashboard.tsx">
        <div data-unique-id="7c8854e7-1987-4897-b61d-5b3890bb91ca" data-file-name="components/analytics-dashboard.tsx">
          <h1 className="text-3xl font-bold text-gray-900" data-unique-id="aea44b53-ed2a-41c4-8c69-bf7e121a7042" data-file-name="components/analytics-dashboard.tsx"><span className="editable-text" data-unique-id="9744d0ba-a2fc-400d-8755-32894d63c31d" data-file-name="components/analytics-dashboard.tsx">Analytics Dashboard</span></h1>
          <p className="text-gray-600 mt-1" data-unique-id="1f9feb6d-3910-4a24-b1f1-bd3b0fb7fc26" data-file-name="components/analytics-dashboard.tsx"><span className="editable-text" data-unique-id="8d89f9ac-0506-4221-aee3-74e91dd5721c" data-file-name="components/analytics-dashboard.tsx">Track your business performance and insights</span></p>
        </div>
        
        <div className="flex items-center space-x-2" data-unique-id="52d5b8fb-7d77-4e34-a677-1214a771bb76" data-file-name="components/analytics-dashboard.tsx" data-dynamic-text="true">
          {(['7d', '30d', '90d'] as const).map(range => <button key={range} onClick={() => setTimeRange(range)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeRange === range ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} data-unique-id="a39d7373-7dfb-40ae-a386-ba84f1e78c75" data-file-name="components/analytics-dashboard.tsx" data-dynamic-text="true">
              {range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </button>)}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-unique-id="b4b994d4-bf87-4116-b3fd-412b8319fd9d" data-file-name="components/analytics-dashboard.tsx" data-dynamic-text="true">
        {metrics.map((metric, index) => <motion.div key={metric.title} initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: index * 0.1
      }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-unique-id="18bac078-687d-433a-8a7d-c66b3a37fda2" data-file-name="components/analytics-dashboard.tsx">
            <div className="flex items-center justify-between" data-unique-id="0fa3d6b5-e28e-411e-be6c-435394d567a3" data-file-name="components/analytics-dashboard.tsx">
              <div data-unique-id="c0883319-8dd2-44d4-ae62-24c4e4b03818" data-file-name="components/analytics-dashboard.tsx">
                <p className="text-sm font-medium text-gray-600 mb-1" data-unique-id="8597f83b-e754-4c3a-884c-e70daa0b2cd6" data-file-name="components/analytics-dashboard.tsx" data-dynamic-text="true">
                  {metric.title}
                </p>
                <p className="text-2xl font-bold text-gray-900" data-unique-id="b34ec835-84d1-47a2-ac00-c54fb7a7712d" data-file-name="components/analytics-dashboard.tsx" data-dynamic-text="true">
                  {metric.value}
                </p>
                <div className="flex items-center mt-2" data-unique-id="eae2b9db-e626-40a1-a15b-08eb9df61d3e" data-file-name="components/analytics-dashboard.tsx" data-dynamic-text="true">
                  {metric.trend === 'up' ? <ArrowUp className="h-4 w-4 text-green-500 mr-1" data-unique-id="52893617-5acb-4388-b1be-027bc786fc3a" data-file-name="components/analytics-dashboard.tsx" data-dynamic-text="true" /> : <ArrowDown className="h-4 w-4 text-red-500 mr-1" data-unique-id="53dd520c-b9e8-4272-8949-ddad4f569882" data-file-name="components/analytics-dashboard.tsx" data-dynamic-text="true" />}
                  <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} data-unique-id="70a1ce4d-e63f-4400-877c-9a18b32ab2b4" data-file-name="components/analytics-dashboard.tsx" data-dynamic-text="true">
                    {metric.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1" data-unique-id="b3499169-f7d6-4f1f-a92b-cefec99454ea" data-file-name="components/analytics-dashboard.tsx"><span className="editable-text" data-unique-id="612ff159-bec0-4c3b-9dc5-358f7770a4fa" data-file-name="components/analytics-dashboard.tsx">vs last period</span></span>
                </div>
              </div>
              <div className={`${metric.bgColor} p-3 rounded-lg`} data-unique-id="1a8bf5f4-c9d7-4e94-a115-3a347534f6dd" data-file-name="components/analytics-dashboard.tsx">
                <metric.icon className={`h-6 w-6 ${metric.color}`} data-unique-id="cff45699-9e5f-4fb6-802d-9ccd873b26fe" data-file-name="components/analytics-dashboard.tsx" data-dynamic-text="true" />
              </div>
            </div>
          </motion.div>)}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-unique-id="a0fdcf8c-7d67-4925-b435-cab886306936" data-file-name="components/analytics-dashboard.tsx" data-dynamic-text="true">
        {/* Email Activity Chart */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.4
      }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-unique-id="4c12c8d2-ffea-4ba5-86b3-588edde16d87" data-file-name="components/analytics-dashboard.tsx">
          <h3 className="text-lg font-semibold text-gray-900 mb-4" data-unique-id="55329854-5f8d-431c-9089-c5f154741a9b" data-file-name="components/analytics-dashboard.tsx"><span className="editable-text" data-unique-id="76c542f6-96b0-4acb-ac1b-107344eed37b" data-file-name="components/analytics-dashboard.tsx">Email Activity</span></h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.emailsSent}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }} />
              <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} dot={{
              fill: '#3B82F6',
              strokeWidth: 2,
              r: 4
            }} activeDot={{
              r: 6,
              stroke: '#3B82F6',
              strokeWidth: 2
            }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Customer Growth Chart */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.5
      }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-unique-id="a65005dc-fa24-4719-9758-90779d994736" data-file-name="components/analytics-dashboard.tsx">
          <h3 className="text-lg font-semibold text-gray-900 mb-4" data-unique-id="b3106420-f847-4124-9da5-87d2cccb5655" data-file-name="components/analytics-dashboard.tsx"><span className="editable-text" data-unique-id="e93d97e4-80ab-4702-8ef2-0e825271052a" data-file-name="components/analytics-dashboard.tsx">Customer Growth</span></h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.customerGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }} />
              <Bar dataKey="customers" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Order Status Distribution */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.6
      }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-unique-id="fa8cb5e5-7465-404a-91b4-b58fae6c7d95" data-file-name="components/analytics-dashboard.tsx">
          <h3 className="text-lg font-semibold text-gray-900 mb-4" data-unique-id="b5bdacf8-ea6a-4d2d-b82d-e522194cb6f7" data-file-name="components/analytics-dashboard.tsx"><span className="editable-text" data-unique-id="76cfc1e6-4d91-4117-b652-6d4f62415361" data-file-name="components/analytics-dashboard.tsx">Order Status Distribution</span></h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.ordersByStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="count">
                {data.ordersByStatus.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} data-unique-id="146808bb-967b-4156-aad2-73699f7c3ff7" data-file-name="components/analytics-dashboard.tsx" data-dynamic-text="true" />)}
              </Pie>
              <Tooltip contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4" data-unique-id="ab73f105-6224-485d-bc7e-94aa54bfacb4" data-file-name="components/analytics-dashboard.tsx" data-dynamic-text="true">
            {data.ordersByStatus.map(item => <div key={item.status} className="flex items-center" data-unique-id="8675b383-d0eb-431e-9607-34abac326200" data-file-name="components/analytics-dashboard.tsx">
                <div className="w-3 h-3 rounded-full mr-2" style={{
              backgroundColor: item.color
            }} data-unique-id="b4fa6063-3f8f-4bd2-90d9-0a15b986d259" data-file-name="components/analytics-dashboard.tsx" />
                <span className="text-sm text-gray-600" data-unique-id="7c14d4a1-81f9-44d2-9775-4554da1d28ec" data-file-name="components/analytics-dashboard.tsx" data-dynamic-text="true">
                  {item.status}<span className="editable-text" data-unique-id="33dc84a7-af50-4a4a-a33b-e73519e6dd2d" data-file-name="components/analytics-dashboard.tsx"> (</span>{item.count}<span className="editable-text" data-unique-id="b49a273e-5c64-457a-9140-2d661bb7bc04" data-file-name="components/analytics-dashboard.tsx">)
                </span></span>
              </div>)}
          </div>
        </motion.div>

        {/* Template Usage */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.7
      }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-unique-id="d805e159-bb30-42bd-bf10-d7ffa1e5e2b9" data-file-name="components/analytics-dashboard.tsx">
          <h3 className="text-lg font-semibold text-gray-900 mb-4" data-unique-id="29ba4e6e-f303-4907-bd81-16ac751e65d1" data-file-name="components/analytics-dashboard.tsx"><span className="editable-text" data-unique-id="63b752de-e3da-43ff-8c4b-a4eaa1d29c5c" data-file-name="components/analytics-dashboard.tsx">Template Usage</span></h3>
          <div className="space-y-4" data-unique-id="f4f683c2-6b60-4a26-b971-4a8b52735ae8" data-file-name="components/analytics-dashboard.tsx" data-dynamic-text="true">
            {data.templateUsage.map((template, index) => <div key={template.name} className="flex items-center justify-between" data-unique-id="a754c5e8-2e7f-4fec-8d7c-518516c5d1ce" data-file-name="components/analytics-dashboard.tsx">
                <span className="text-sm font-medium text-gray-700" data-unique-id="323700a8-c678-4d0e-be8f-8a7304ba7b1c" data-file-name="components/analytics-dashboard.tsx" data-dynamic-text="true">
                  {template.name}
                </span>
                <div className="flex items-center space-x-3" data-unique-id="6e5c60be-2c73-48b7-b0e7-f91cdeaf8786" data-file-name="components/analytics-dashboard.tsx">
                  <div className="w-24 bg-gray-200 rounded-full h-2" data-unique-id="77d776b5-7d9c-4b9f-b8bd-85cf6d8c1fdd" data-file-name="components/analytics-dashboard.tsx">
                    <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{
                  width: `${template.usage}%`
                }} data-unique-id="595164d2-8dd4-4cd3-9048-74aab747c9d2" data-file-name="components/analytics-dashboard.tsx" />
                  </div>
                  <span className="text-sm text-gray-600 w-8" data-unique-id="1e56bb63-adaf-4ab5-9111-6d2a8f6cba79" data-file-name="components/analytics-dashboard.tsx" data-dynamic-text="true">
                    {template.usage}<span className="editable-text" data-unique-id="fd8f2660-64d2-4e69-a500-4f142241e601" data-file-name="components/analytics-dashboard.tsx">%
                  </span></span>
                </div>
              </div>)}
          </div>
        </motion.div>
      </div>
    </div>;
}