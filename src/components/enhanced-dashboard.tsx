'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Mail, Users, Package, DollarSign, Calendar, Clock, Target, Zap } from 'lucide-react';
interface DashboardMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}
interface ChartData {
  name: string;
  value: number;
  emails?: number;
  orders?: number;
  revenue?: number;
  color?: string;
}
export default function EnhancedDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [emailPerformance, setEmailPerformance] = useState<ChartData[]>([]);
  const [revenueData, setRevenueData] = useState<ChartData[]>([]);
  const [customerSegments, setCustomerSegments] = useState<ChartData[]>([]);
  useEffect(() => {
    generateDashboardData();
  }, [timeRange]);
  const generateDashboardData = () => {
    // Generate metrics
    const metricsData: DashboardMetric[] = [{
      title: 'Total Revenue',
      value: '$127,450',
      change: '+18.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }, {
      title: 'Emails Sent',
      value: '8,432',
      change: '+12.5%',
      trend: 'up',
      icon: Mail,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }, {
      title: 'Active Customers',
      value: '2,847',
      change: '+8.7%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }, {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '-0.8%',
      trend: 'down',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }];

    // Generate email performance data
    const emailData: ChartData[] = Array.from({
      length: 30
    }, (_, i) => ({
      name: `Day ${i + 1}`,
      emails: Math.floor(Math.random() * 500) + 100,
      value: Math.floor(Math.random() * 80) + 20
    }));

    // Generate revenue data
    const revenueChartData: ChartData[] = Array.from({
      length: 12
    }, (_, i) => ({
      name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      revenue: Math.floor(Math.random() * 50000) + 20000,
      value: Math.floor(Math.random() * 50000) + 20000
    }));

    // Generate customer segments
    const segmentData: ChartData[] = [{
      name: 'New Customers',
      value: 35,
      color: '#3B82F6'
    }, {
      name: 'Returning',
      value: 45,
      color: '#10B981'
    }, {
      name: 'VIP',
      value: 15,
      color: '#F59E0B'
    }, {
      name: 'Inactive',
      value: 5,
      color: '#EF4444'
    }];
    setMetrics(metricsData);
    setEmailPerformance(emailData);
    setRevenueData(revenueChartData);
    setCustomerSegments(segmentData);
  };
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6" data-unique-id="89c4ec8c-7b3c-411f-8793-e36f0d7bf652" data-file-name="components/enhanced-dashboard.tsx">
      <div className="max-w-7xl mx-auto" data-unique-id="6d229be1-ad90-48e7-b528-35da23b6322a" data-file-name="components/enhanced-dashboard.tsx" data-dynamic-text="true">
        {/* Header */}
        <div className="flex items-center justify-between mb-8" data-unique-id="18738ca3-02a8-4667-919f-ae3dd8511cd7" data-file-name="components/enhanced-dashboard.tsx">
          <div data-unique-id="2ee78a6b-93c5-4583-8e9a-9d45f53ba3fc" data-file-name="components/enhanced-dashboard.tsx">
            <h1 className="text-3xl font-bold text-gray-900" data-unique-id="9b11dc77-95da-4fed-954a-68ce2e5f42fa" data-file-name="components/enhanced-dashboard.tsx"><span className="editable-text" data-unique-id="62c631f1-abaa-40fc-a081-2fc95da3c1ee" data-file-name="components/enhanced-dashboard.tsx">Dashboard Overview</span></h1>
            <p className="text-gray-600 mt-2" data-unique-id="60311399-6ecd-43f0-9577-4ab17010aa59" data-file-name="components/enhanced-dashboard.tsx"><span className="editable-text" data-unique-id="4ba02800-c099-4af0-a1c4-653d2f27b8f9" data-file-name="components/enhanced-dashboard.tsx">Track your email campaigns and business performance</span></p>
          </div>
          
          <div className="flex items-center space-x-3" data-unique-id="ecb9a407-b627-44e9-9be0-a0ada356aa22" data-file-name="components/enhanced-dashboard.tsx" data-dynamic-text="true">
            {(['7d', '30d', '90d'] as const).map(range => <button key={range} onClick={() => setTimeRange(range)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeRange === range ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`} data-unique-id="16416abf-9dac-4e7d-a320-55667f57b323" data-file-name="components/enhanced-dashboard.tsx" data-dynamic-text="true">
                {range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'Last 90 days'}
              </button>)}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-unique-id="74771416-1d1a-489d-b7d2-226039898f31" data-file-name="components/enhanced-dashboard.tsx" data-dynamic-text="true">
          {metrics.map((metric, index) => <motion.div key={metric.title} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: index * 0.1
        }} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow" data-unique-id="78a05692-9c8d-40f9-8728-58890676006a" data-file-name="components/enhanced-dashboard.tsx">
              <div className="flex items-center justify-between" data-unique-id="7449312f-f7f7-40e6-ac8a-9adf75908d19" data-file-name="components/enhanced-dashboard.tsx">
                <div data-unique-id="fbb5c10c-31c9-46ec-91d1-8616f44275ca" data-file-name="components/enhanced-dashboard.tsx">
                  <p className="text-sm font-medium text-gray-600 mb-1" data-unique-id="7a5d82dd-5444-4b87-88b4-c90936b87997" data-file-name="components/enhanced-dashboard.tsx" data-dynamic-text="true">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mb-2" data-unique-id="5a693fde-0e6b-49f3-94eb-f537233b2afd" data-file-name="components/enhanced-dashboard.tsx" data-dynamic-text="true">
                    {metric.value}
                  </p>
                  <div className="flex items-center" data-unique-id="2670fadb-3c96-4a4f-949d-d68974f90d74" data-file-name="components/enhanced-dashboard.tsx" data-dynamic-text="true">
                    {metric.trend === 'up' ? <TrendingUp className="h-4 w-4 text-green-500 mr-1" data-unique-id="51e4643a-0830-4d04-9a9d-f956e8f8f222" data-file-name="components/enhanced-dashboard.tsx" data-dynamic-text="true" /> : <TrendingDown className="h-4 w-4 text-red-500 mr-1" data-unique-id="16360d11-2ca2-4a6e-90d4-8d88192ec249" data-file-name="components/enhanced-dashboard.tsx" data-dynamic-text="true" />}
                    <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} data-unique-id="ecb0c3a4-23e5-477d-b3fe-359f7561ddf5" data-file-name="components/enhanced-dashboard.tsx" data-dynamic-text="true">
                      {metric.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1" data-unique-id="a3659387-363b-4e0a-9445-2b416bf14c98" data-file-name="components/enhanced-dashboard.tsx"><span className="editable-text" data-unique-id="f06aec09-10a4-43c7-9eb6-5caf1a809379" data-file-name="components/enhanced-dashboard.tsx">vs last period</span></span>
                  </div>
                </div>
                <div className={`${metric.bgColor} p-3 rounded-xl`} data-unique-id="273b53e2-d1d4-4ad1-9842-0d0138d5376a" data-file-name="components/enhanced-dashboard.tsx">
                  <metric.icon className={`h-6 w-6 ${metric.color}`} data-unique-id="0d8dd3fe-746f-427c-9570-2ea6b1295a35" data-file-name="components/enhanced-dashboard.tsx" data-dynamic-text="true" />
                </div>
              </div>
            </motion.div>)}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8" data-unique-id="3ea79acc-8c46-4495-8e6b-e2f928972029" data-file-name="components/enhanced-dashboard.tsx" data-dynamic-text="true">
          {/* Email Performance Chart */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.4
        }} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100" data-unique-id="bfa79374-b027-43a4-a5fe-817ae046ace6" data-file-name="components/enhanced-dashboard.tsx">
            <div className="flex items-center justify-between mb-6" data-unique-id="d3ab0abe-95cd-4f38-b697-c9b8c9e81ddd" data-file-name="components/enhanced-dashboard.tsx">
              <h3 className="text-lg font-semibold text-gray-900" data-unique-id="77299001-ecfa-4696-bd14-d31a8800e38e" data-file-name="components/enhanced-dashboard.tsx"><span className="editable-text" data-unique-id="c721298b-ede0-49a6-8130-737df6f62af3" data-file-name="components/enhanced-dashboard.tsx">Email Performance</span></h3>
              <div className="flex items-center space-x-2" data-unique-id="2fa8658b-6905-41d3-a57e-18a167e86623" data-file-name="components/enhanced-dashboard.tsx">
                <div className="w-3 h-3 bg-blue-500 rounded-full" data-unique-id="fa9bf4b2-4410-40f6-967e-f1ff069064f2" data-file-name="components/enhanced-dashboard.tsx"></div>
                <span className="text-sm text-gray-600" data-unique-id="d76e6880-d4d2-4b87-b493-14b8add557b2" data-file-name="components/enhanced-dashboard.tsx"><span className="editable-text" data-unique-id="f16f2f02-0980-4110-b273-709b9f8e006a" data-file-name="components/enhanced-dashboard.tsx">Open Rate</span></span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={emailPerformance}>
                <defs>
                  <linearGradient id="colorEmails" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} />
                <Area type="monotone" dataKey="value" stroke="#3B82F6" fillOpacity={1} fill="url(#colorEmails)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Revenue Chart */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.5
        }} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100" data-unique-id="164c4c04-39d8-4ca6-8af5-8e80ae067846" data-file-name="components/enhanced-dashboard.tsx">
            <div className="flex items-center justify-between mb-6" data-unique-id="3460075c-07e1-45c1-af7f-2715130bccc0" data-file-name="components/enhanced-dashboard.tsx">
              <h3 className="text-lg font-semibold text-gray-900" data-unique-id="45a06930-e45e-4636-a20a-1ef5681dc726" data-file-name="components/enhanced-dashboard.tsx"><span className="editable-text" data-unique-id="97c4a57a-e066-409e-b006-07d9308f9760" data-file-name="components/enhanced-dashboard.tsx">Monthly Revenue</span></h3>
              <div className="flex items-center space-x-2" data-unique-id="8da71f96-f4ed-424c-91a1-5b820611dab5" data-file-name="components/enhanced-dashboard.tsx">
                <div className="w-3 h-3 bg-green-500 rounded-full" data-unique-id="2cd31b9e-984b-49b3-9181-1e850af58c62" data-file-name="components/enhanced-dashboard.tsx"></div>
                <span className="text-sm text-gray-600" data-unique-id="9d03c3e5-7b85-4c52-989c-c7720db011ba" data-file-name="components/enhanced-dashboard.tsx"><span className="editable-text" data-unique-id="9aceae17-e0a7-4c11-9681-cd826b31b0d3" data-file-name="components/enhanced-dashboard.tsx">Revenue</span></span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={value => `$${value / 1000}k`} />
                <Tooltip contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} formatter={value => [`$${value.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Customer Segments and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-unique-id="5bf24818-2dad-4940-8aa4-e74c18e27709" data-file-name="components/enhanced-dashboard.tsx" data-dynamic-text="true">
          {/* Customer Segments */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.6
        }} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100" data-unique-id="25a1d5be-9c66-41b4-9a43-8b4546a7881b" data-file-name="components/enhanced-dashboard.tsx">
            <h3 className="text-lg font-semibold text-gray-900 mb-6" data-unique-id="27e2c936-f486-4cba-9810-99c6489e5d7f" data-file-name="components/enhanced-dashboard.tsx"><span className="editable-text" data-unique-id="2867a1a2-44ec-4590-a308-facb83039ad1" data-file-name="components/enhanced-dashboard.tsx">Customer Segments</span></h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={customerSegments} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {customerSegments.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} data-unique-id="47b32b3e-7ec8-447e-a9ef-0e6010bb55a5" data-file-name="components/enhanced-dashboard.tsx" data-dynamic-text="true" />)}
                </Pie>
                <Tooltip formatter={value => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-4" data-unique-id="7cd17738-4680-4f64-a0e7-68e1a73e935a" data-file-name="components/enhanced-dashboard.tsx" data-dynamic-text="true">
              {customerSegments.map((segment, index) => <div key={segment.name} className="flex items-center" data-unique-id="593492c4-cc85-4db2-b29d-729728e3e26e" data-file-name="components/enhanced-dashboard.tsx">
                  <div className="w-3 h-3 rounded-full mr-2" style={{
                backgroundColor: COLORS[index % COLORS.length]
              }} data-unique-id="f9e5ef84-19b0-423e-a82e-dd55e208af2b" data-file-name="components/enhanced-dashboard.tsx" />
                  <span className="text-sm text-gray-600" data-unique-id="c8247ebd-f27a-47d9-824c-9da63550969b" data-file-name="components/enhanced-dashboard.tsx" data-dynamic-text="true">
                    {segment.name}<span className="editable-text" data-unique-id="326b0871-b292-4001-9951-b07a0906e6b8" data-file-name="components/enhanced-dashboard.tsx"> (</span>{segment.value}<span className="editable-text" data-unique-id="4e52e687-22f7-4e48-8b45-ad466cc52acb" data-file-name="components/enhanced-dashboard.tsx">%)
                  </span></span>
                </div>)}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.7
        }} className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-100" data-unique-id="3e879f18-e5ba-400f-bb66-f7e450d264fb" data-file-name="components/enhanced-dashboard.tsx">
            <h3 className="text-lg font-semibold text-gray-900 mb-6" data-unique-id="191c3591-78b2-4662-8de0-dd638ac0af98" data-file-name="components/enhanced-dashboard.tsx"><span className="editable-text" data-unique-id="f331df6c-7f7f-4860-82e9-2d0e7ec12d8a" data-file-name="components/enhanced-dashboard.tsx">Quick Actions</span></h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-unique-id="7b76ef53-9e8d-49f4-bd97-4b6c9224879f" data-file-name="components/enhanced-dashboard.tsx" data-dynamic-text="true">
              {[{
              icon: Mail,
              label: 'Send Campaign',
              color: 'bg-blue-500'
            }, {
              icon: Users,
              label: 'Add Customers',
              color: 'bg-green-500'
            }, {
              icon: Package,
              label: 'Process Orders',
              color: 'bg-purple-500'
            }, {
              icon: Zap,
              label: 'Automation',
              color: 'bg-orange-500'
            }].map((action, index) => <motion.button key={action.label} whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }} className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all" data-unique-id="1396939c-888a-46a2-ae8a-3500e140b100" data-file-name="components/enhanced-dashboard.tsx">
                  <div className={`${action.color} p-3 rounded-full mb-3`} data-unique-id="3673f250-42bf-47c5-828f-54d27d97703e" data-file-name="components/enhanced-dashboard.tsx">
                    <action.icon className="h-6 w-6 text-white" data-unique-id="daa819f2-332e-45d1-a48c-cc9f3e9a201f" data-file-name="components/enhanced-dashboard.tsx" data-dynamic-text="true" />
                  </div>
                  <span className="text-sm font-medium text-gray-700" data-unique-id="c49f1004-765d-4742-97bb-be37d9123ea5" data-file-name="components/enhanced-dashboard.tsx" data-dynamic-text="true">{action.label}</span>
                </motion.button>)}
            </div>
          </motion.div>
        </div>
      </div>
    </div>;
}