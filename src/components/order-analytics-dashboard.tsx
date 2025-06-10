'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Package, DollarSign, Calendar, Users, MapPin } from 'lucide-react';
import { CleanedOrderData } from './order-data-processor';
interface OrderAnalyticsDashboardProps {
  orders: CleanedOrderData[];
}
const COLORS = ['#0063A5', '#2A9187', '#D9B64E', '#E67E33', '#8B5CF6', '#EF4444'];
export default function OrderAnalyticsDashboard({
  orders
}: OrderAnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState('7d');

  // Calculate analytics data
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.orderTotal, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Orders by state
  const ordersByState = orders.reduce((acc, order) => {
    const state = order.shipToStateProvince;
    acc[state] = (acc[state] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const stateData = Object.entries(ordersByState).map(([state, count]) => ({
    state,
    count
  })).sort((a, b) => b.count - a.count).slice(0, 10);

  // Orders by source
  const ordersBySource = orders.reduce((acc, order) => {
    const source = order.orderSource || 'Unknown';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const sourceData = Object.entries(ordersBySource).map(([source, count]) => ({
    source,
    count
  }));

  // Daily orders (last 30 days)
  const dailyOrders = orders.reduce((acc, order) => {
    const date = new Date(order.actualShipDate).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const dailyData = Object.entries(dailyOrders).map(([date, count]) => ({
    date,
    count
  })).sort((a, b) => a.date.localeCompare(b.date)).slice(-30);

  // Revenue by day
  const dailyRevenue = orders.reduce((acc, order) => {
    const date = new Date(order.actualShipDate).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + order.orderTotal;
    return acc;
  }, {} as Record<string, number>);
  const revenueData = Object.entries(dailyRevenue).map(([date, revenue]) => ({
    date,
    revenue
  })).sort((a, b) => a.date.localeCompare(b.date)).slice(-30);
  return <div className="space-y-6" data-unique-id="b99b15a0-5355-4d6a-af51-f94fc13b168c" data-file-name="components/order-analytics-dashboard.tsx" data-dynamic-text="true">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-unique-id="80b83091-a4a9-48df-a004-bcea724bd575" data-file-name="components/order-analytics-dashboard.tsx">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white" data-unique-id="9334cb7b-1b7d-439a-97a6-d3c171b3fe86" data-file-name="components/order-analytics-dashboard.tsx">
          <div className="flex items-center justify-between" data-unique-id="058b4e36-8a83-4eb6-b27e-6194ebe11922" data-file-name="components/order-analytics-dashboard.tsx">
            <div data-unique-id="3b2f6dea-aa25-4233-8680-159fb654196e" data-file-name="components/order-analytics-dashboard.tsx">
              <p className="text-blue-100 text-sm" data-unique-id="7833a3b5-4ac4-4469-91e8-8f689c23874e" data-file-name="components/order-analytics-dashboard.tsx"><span className="editable-text" data-unique-id="b0cd531d-82d4-4787-9f6b-b80172161bec" data-file-name="components/order-analytics-dashboard.tsx">Total Orders</span></p>
              <p className="text-3xl font-bold" data-unique-id="a6ebd955-6ef6-4894-a6a9-858f82d2b437" data-file-name="components/order-analytics-dashboard.tsx" data-dynamic-text="true">{totalOrders.toLocaleString()}</p>
            </div>
            <Package className="h-12 w-12 text-blue-200" />
          </div>
        </motion.div>

        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.1
      }} className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white" data-unique-id="a9c4fda6-0ad7-4707-adf5-16413a4630d7" data-file-name="components/order-analytics-dashboard.tsx">
          <div className="flex items-center justify-between" data-unique-id="89625007-7871-4f8f-83ae-4f7178eff1c9" data-file-name="components/order-analytics-dashboard.tsx">
            <div data-unique-id="93384ec2-80da-4e69-a582-0b33c6ca8830" data-file-name="components/order-analytics-dashboard.tsx">
              <p className="text-green-100 text-sm" data-unique-id="ddaaa788-343d-43bd-a786-debc53e2957c" data-file-name="components/order-analytics-dashboard.tsx"><span className="editable-text" data-unique-id="9f1cbf4f-3218-4f2f-ac23-51663932147e" data-file-name="components/order-analytics-dashboard.tsx">Total Revenue</span></p>
              <p className="text-3xl font-bold" data-unique-id="ba57bc2a-47b3-47d4-b27f-e585a2f0458f" data-file-name="components/order-analytics-dashboard.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="701b1101-eef2-4784-a5ab-c0f134d199e7" data-file-name="components/order-analytics-dashboard.tsx">$</span>{totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-12 w-12 text-green-200" />
          </div>
        </motion.div>

        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.2
      }} className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white" data-unique-id="e55c46ff-f9c9-437c-a5eb-41ca7a196d54" data-file-name="components/order-analytics-dashboard.tsx">
          <div className="flex items-center justify-between" data-unique-id="5385c882-5add-4852-909a-c165b992c8ff" data-file-name="components/order-analytics-dashboard.tsx">
            <div data-unique-id="3e0bd665-1f73-40f7-a7dc-5434ded4a9cd" data-file-name="components/order-analytics-dashboard.tsx">
              <p className="text-purple-100 text-sm" data-unique-id="147cc5b6-3ac1-47f6-9aca-bd5f0091eb29" data-file-name="components/order-analytics-dashboard.tsx"><span className="editable-text" data-unique-id="ce603fad-f349-4c78-9898-4ae9c94d8029" data-file-name="components/order-analytics-dashboard.tsx">Avg Order Value</span></p>
              <p className="text-3xl font-bold" data-unique-id="3dc0f9ff-2654-459f-9e89-6e9e64082ad7" data-file-name="components/order-analytics-dashboard.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="be49d6fb-98b1-438b-aab2-69def944d246" data-file-name="components/order-analytics-dashboard.tsx">$</span>{averageOrderValue.toFixed(0)}</p>
            </div>
            <TrendingUp className="h-12 w-12 text-purple-200" />
          </div>
        </motion.div>

        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.3
      }} className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white" data-unique-id="e09e4a41-c769-4d09-9f83-928f440ceb06" data-file-name="components/order-analytics-dashboard.tsx">
          <div className="flex items-center justify-between" data-unique-id="934970ff-bb21-49f4-a81e-ce75013976b9" data-file-name="components/order-analytics-dashboard.tsx">
            <div data-unique-id="80fe5f74-47ca-476d-8cb5-00a1a20421fb" data-file-name="components/order-analytics-dashboard.tsx">
              <p className="text-orange-100 text-sm" data-unique-id="2b5f7cd8-91bc-4ed3-8ef8-12134f4eaac8" data-file-name="components/order-analytics-dashboard.tsx"><span className="editable-text" data-unique-id="fefaf414-60bd-4547-8953-ca60158ef863" data-file-name="components/order-analytics-dashboard.tsx">Unique States</span></p>
              <p className="text-3xl font-bold" data-unique-id="62aec474-d3d0-40ae-ae5c-30d71d194dc6" data-file-name="components/order-analytics-dashboard.tsx" data-dynamic-text="true">{Object.keys(ordersByState).length}</p>
            </div>
            <MapPin className="h-12 w-12 text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-unique-id="20e4f4fd-cce6-447b-9d5f-c7701e2c1809" data-file-name="components/order-analytics-dashboard.tsx" data-dynamic-text="true">
        {/* Daily Orders Chart */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.4
      }} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200" data-unique-id="c6d24aa6-56e2-4cf3-a9ed-d40239cfd0cf" data-file-name="components/order-analytics-dashboard.tsx">
          <h3 className="text-lg font-semibold text-gray-800 mb-4" data-unique-id="fbd2a4ba-22df-436b-bdcd-524ecafddec4" data-file-name="components/order-analytics-dashboard.tsx"><span className="editable-text" data-unique-id="08c13b64-37c5-4ae1-b7fd-5d7af70f6814" data-file-name="components/order-analytics-dashboard.tsx">Daily Orders (Last 30 Days)</span></h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{
              fontSize: 12
            }} tickFormatter={value => new Date(value).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })} />
              <YAxis />
              <Tooltip labelFormatter={value => new Date(value).toLocaleDateString()} formatter={value => [value, 'Orders']} />
              <Line type="monotone" dataKey="count" stroke="#0063A5" strokeWidth={3} dot={{
              fill: '#0063A5'
            }} />
            </LineChart>
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
      }} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200" data-unique-id="e4d5614c-b19c-47b3-a479-945acb771826" data-file-name="components/order-analytics-dashboard.tsx">
          <h3 className="text-lg font-semibold text-gray-800 mb-4" data-unique-id="37a20a53-f542-4f79-bbbe-8df1f197c873" data-file-name="components/order-analytics-dashboard.tsx"><span className="editable-text" data-unique-id="d1efb4cb-7a06-4b22-8aa1-d7b267b83209" data-file-name="components/order-analytics-dashboard.tsx">Daily Revenue (Last 30 Days)</span></h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{
              fontSize: 12
            }} tickFormatter={value => new Date(value).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })} />
              <YAxis tickFormatter={value => `$${value.toLocaleString()}`} />
              <Tooltip labelFormatter={value => new Date(value).toLocaleDateString()} formatter={value => [`$${value.toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#2A9187" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top States */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.6
      }} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200" data-unique-id="f089cce0-5d0a-4a04-aa5c-ae39cc1ae1cd" data-file-name="components/order-analytics-dashboard.tsx">
          <h3 className="text-lg font-semibold text-gray-800 mb-4" data-unique-id="0345efcf-9295-4e4b-ac3a-d6cdc25a1b46" data-file-name="components/order-analytics-dashboard.tsx"><span className="editable-text" data-unique-id="6b096d9d-afb4-403f-af36-1a8730a6f4af" data-file-name="components/order-analytics-dashboard.tsx">Top States by Orders</span></h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stateData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="state" type="category" width={50} />
              <Tooltip formatter={value => [value, 'Orders']} />
              <Bar dataKey="count" fill="#D9B64E" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Order Sources */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.7
      }} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200" data-unique-id="7b65093f-f6be-4a32-848a-b61a749d3717" data-file-name="components/order-analytics-dashboard.tsx">
          <h3 className="text-lg font-semibold text-gray-800 mb-4" data-unique-id="f60c71c1-196f-454c-9b93-6110083bb9ee" data-file-name="components/order-analytics-dashboard.tsx"><span className="editable-text" data-unique-id="cd14a84c-8a35-4bc4-a326-815284b97293" data-file-name="components/order-analytics-dashboard.tsx">Orders by Source</span></h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={sourceData} cx="50%" cy="50%" labelLine={false} label={({
              source,
              percent
            }) => `${source} (${(percent * 100).toFixed(0)}%)`} outerRadius={80} fill="#8884d8" dataKey="count">
                {sourceData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} data-unique-id="31a1b6c7-8c8b-4806-943e-c3c6c3999cf9" data-file-name="components/order-analytics-dashboard.tsx" data-dynamic-text="true" />)}
              </Pie>
              <Tooltip formatter={value => [value, 'Orders']} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>;
}