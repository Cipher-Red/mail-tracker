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
  return <div className="space-y-6" data-unique-id="dc5e9190-f4d0-4301-8025-49df7e03bfda" data-file-name="components/order-analytics-dashboard.tsx" data-dynamic-text="true">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-unique-id="a991ae05-4917-465c-a959-f2fe021d9157" data-file-name="components/order-analytics-dashboard.tsx">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white" data-unique-id="ed77673a-a4b2-41b2-9c4d-b54ecfb33e95" data-file-name="components/order-analytics-dashboard.tsx">
          <div className="flex items-center justify-between" data-unique-id="8f3cfb01-3cab-4c27-aa0d-7c1eee534301" data-file-name="components/order-analytics-dashboard.tsx">
            <div data-unique-id="79746b76-72e9-4361-9b12-1b1ed2e130a0" data-file-name="components/order-analytics-dashboard.tsx">
              <p className="text-blue-100 text-sm" data-unique-id="5ef272f9-1010-4902-a410-b225af7636a1" data-file-name="components/order-analytics-dashboard.tsx"><span className="editable-text" data-unique-id="2006f374-ee9b-43f8-a5a5-159c2dc613fb" data-file-name="components/order-analytics-dashboard.tsx">Total Orders</span></p>
              <p className="text-3xl font-bold" data-unique-id="48abc430-9865-409f-8443-b8210c42ab79" data-file-name="components/order-analytics-dashboard.tsx" data-dynamic-text="true">{totalOrders.toLocaleString()}</p>
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
      }} className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white" data-unique-id="8142c836-8532-4335-8db4-b712d32fa107" data-file-name="components/order-analytics-dashboard.tsx">
          <div className="flex items-center justify-between" data-unique-id="e304c4c5-fdae-4b24-8f5a-2f6165e71855" data-file-name="components/order-analytics-dashboard.tsx">
            <div data-unique-id="7d1c059a-f342-4bab-be4d-9377ff2978eb" data-file-name="components/order-analytics-dashboard.tsx">
              <p className="text-green-100 text-sm" data-unique-id="aac5b522-f8e5-47dd-a28a-c9a3a06ea2ac" data-file-name="components/order-analytics-dashboard.tsx"><span className="editable-text" data-unique-id="49a4868c-2c08-4f9e-b281-85ed793c0e78" data-file-name="components/order-analytics-dashboard.tsx">Total Revenue</span></p>
              <p className="text-3xl font-bold" data-unique-id="5317b330-25d9-44a7-8daa-7f76c9eb057f" data-file-name="components/order-analytics-dashboard.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="ed4937bd-23c6-4f79-908d-4d3c55acadb6" data-file-name="components/order-analytics-dashboard.tsx">$</span>{totalRevenue.toLocaleString()}</p>
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
      }} className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white" data-unique-id="a4b5c90d-1815-4d51-908c-53510d03941c" data-file-name="components/order-analytics-dashboard.tsx">
          <div className="flex items-center justify-between" data-unique-id="22168661-7bf8-465b-a79c-f3954db6be6a" data-file-name="components/order-analytics-dashboard.tsx">
            <div data-unique-id="990ddca2-1cf4-4a7c-b78c-34d786883238" data-file-name="components/order-analytics-dashboard.tsx">
              <p className="text-purple-100 text-sm" data-unique-id="0e7ee81c-5d97-4022-8270-f3040c9e7dbb" data-file-name="components/order-analytics-dashboard.tsx"><span className="editable-text" data-unique-id="148f3a01-6d67-4e38-a927-041f2b7c3831" data-file-name="components/order-analytics-dashboard.tsx">Avg Order Value</span></p>
              <p className="text-3xl font-bold" data-unique-id="9b9ab90a-4526-487e-980e-141eb7abe9b1" data-file-name="components/order-analytics-dashboard.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="a5affd7a-4a02-4d78-b616-cb9e94dfbef5" data-file-name="components/order-analytics-dashboard.tsx">$</span>{averageOrderValue.toFixed(0)}</p>
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
      }} className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white" data-unique-id="dab579da-c59f-4018-a992-5bd70a0576d4" data-file-name="components/order-analytics-dashboard.tsx">
          <div className="flex items-center justify-between" data-unique-id="195ce4a8-6b88-41f5-bff9-ce92cc7e1ae7" data-file-name="components/order-analytics-dashboard.tsx">
            <div data-unique-id="c7ff90d7-a923-409f-b63f-ada4721ed983" data-file-name="components/order-analytics-dashboard.tsx">
              <p className="text-orange-100 text-sm" data-unique-id="ea7a3ab7-8aad-4650-b70f-b86c3e5cdb19" data-file-name="components/order-analytics-dashboard.tsx"><span className="editable-text" data-unique-id="78d60f57-2698-4908-8fc0-92c0665f50c4" data-file-name="components/order-analytics-dashboard.tsx">Unique States</span></p>
              <p className="text-3xl font-bold" data-unique-id="a06dac88-eb74-41fd-8eb6-504105c42786" data-file-name="components/order-analytics-dashboard.tsx" data-dynamic-text="true">{Object.keys(ordersByState).length}</p>
            </div>
            <MapPin className="h-12 w-12 text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-unique-id="48eb010d-26f5-45ba-915b-1bff7f9bf6fa" data-file-name="components/order-analytics-dashboard.tsx" data-dynamic-text="true">
        {/* Daily Orders Chart */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.4
      }} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200" data-unique-id="95ae079b-fa03-4728-93b5-d7b88f20b4c6" data-file-name="components/order-analytics-dashboard.tsx">
          <h3 className="text-lg font-semibold text-gray-800 mb-4" data-unique-id="56f79b39-34ec-4b00-a008-0a2a888e1775" data-file-name="components/order-analytics-dashboard.tsx"><span className="editable-text" data-unique-id="22f313b6-0dc9-4515-93ab-689bedeffa3f" data-file-name="components/order-analytics-dashboard.tsx">Daily Orders (Last 30 Days)</span></h3>
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
      }} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200" data-unique-id="66e1b407-cd15-4bdb-88cc-73d2aaabcfaf" data-file-name="components/order-analytics-dashboard.tsx">
          <h3 className="text-lg font-semibold text-gray-800 mb-4" data-unique-id="5f146234-448a-425e-9b1f-646888e63b38" data-file-name="components/order-analytics-dashboard.tsx"><span className="editable-text" data-unique-id="eccbdcbf-488d-4496-b856-b15dd5452dad" data-file-name="components/order-analytics-dashboard.tsx">Daily Revenue (Last 30 Days)</span></h3>
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
      }} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200" data-unique-id="7acd8d37-a9e9-434c-8752-00e1ecf57249" data-file-name="components/order-analytics-dashboard.tsx">
          <h3 className="text-lg font-semibold text-gray-800 mb-4" data-unique-id="1def50ed-5878-47cd-98a6-3941be065d28" data-file-name="components/order-analytics-dashboard.tsx"><span className="editable-text" data-unique-id="242368e9-4b30-40ec-a21d-270ea4cafe6f" data-file-name="components/order-analytics-dashboard.tsx">Top States by Orders</span></h3>
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
      }} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200" data-unique-id="9d1b34d5-353e-4d81-a99e-b79903a722f0" data-file-name="components/order-analytics-dashboard.tsx">
          <h3 className="text-lg font-semibold text-gray-800 mb-4" data-unique-id="9f9c408a-e740-4d95-a163-9363b40896c6" data-file-name="components/order-analytics-dashboard.tsx"><span className="editable-text" data-unique-id="b09cc8cc-73c3-49ec-96f4-e48ee1549c4b" data-file-name="components/order-analytics-dashboard.tsx">Orders by Source</span></h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={sourceData} cx="50%" cy="50%" labelLine={false} label={({
              source,
              percent
            }) => `${source} (${(percent * 100).toFixed(0)}%)`} outerRadius={80} fill="#8884d8" dataKey="count">
                {sourceData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} data-unique-id="39201fa2-c780-44f2-b66d-4f73276fa7c7" data-file-name="components/order-analytics-dashboard.tsx" data-dynamic-text="true" />)}
              </Pie>
              <Tooltip formatter={value => [value, 'Orders']} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>;
}