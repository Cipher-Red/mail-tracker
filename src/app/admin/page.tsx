'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useActivityStore } from '@/lib/activity-store';
import { Users, Activity, Database, Mail, FileText, CheckCircle2, XCircle, ChevronRight, BarChart3, SmilePlus } from 'lucide-react';
export default function AdminDashboard() {
  const {
    logs,
    fetchAllLogs
  } = useActivityStore();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEmails: 0,
    totalOrders: 0,
    activeUsers: 0
  });

  // Fetch activity logs
  useEffect(() => {
    fetchAllLogs();

    // Fetch some mock stats for the dashboard
    const fetchStats = async () => {
      try {
        // In a real app, this would fetch from Supabase
        setStats({
          totalUsers: logs.filter(log => log.action.includes('login') || log.action.includes('register')).length || 12,
          totalEmails: logs.filter(log => log.action.includes('email')).length || 256,
          totalOrders: logs.filter(log => log.action.includes('order')).length || 87,
          activeUsers: 18
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, [fetchAllLogs]);

  // Get recent activity (last 5)
  const recentActivity = logs.slice(0, 5);
  return <div className="space-y-8" data-unique-id="22aaf916-430f-4e4c-b19d-6929ac2707e8" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center" data-unique-id="9c1b9647-f92f-4560-a279-e22436b5751e" data-file-name="app/admin/page.tsx">
        <h1 className="text-3xl font-bold text-white" data-unique-id="8782ed76-fabf-41c4-a398-c5d43c4806e4" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="c366644c-7307-4d8f-aa58-905ec564fb7a" data-file-name="app/admin/page.tsx">Admin Dashboard</span></h1>
        <span className="px-3 py-1 bg-indigo-900/50 border border-indigo-800/60 rounded-md text-indigo-300 text-sm" data-unique-id="00ffe2b8-8946-4c8d-9bec-5d5501a16a7d" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
          {new Date().toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
        </span>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-unique-id="85bb725b-c0c5-48c9-bb49-fe415fbe03d9" data-file-name="app/admin/page.tsx">
        <StatsCard title="Total Users" value={stats.totalUsers} icon={<Users className="h-8 w-8" />} color="bg-blue-600" />
        <StatsCard title="Total Emails Sent" value={stats.totalEmails} icon={<Mail className="h-8 w-8" />} color="bg-green-600" />
        <StatsCard title="Orders Processed" value={stats.totalOrders} icon={<FileText className="h-8 w-8" />} color="bg-purple-600" />
        <StatsCard title="Active Users" value={stats.activeUsers} icon={<Activity className="h-8 w-8" />} color="bg-amber-600" />
      </div>
      
      {/* Activity and DataStore sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-unique-id="687af90b-e5c1-4955-b010-c18043eb5f18" data-file-name="app/admin/page.tsx">
        <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.2
      }} className="lg:col-span-2 bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="66c683b6-a45d-4e09-a602-8abfbfefb9d9" data-file-name="app/admin/page.tsx">
          <div className="flex justify-between items-center mb-6" data-unique-id="d1dfe5a2-4ca6-4297-8029-8ec400f676b2" data-file-name="app/admin/page.tsx">
            <h2 className="text-xl font-semibold text-white flex items-center" data-unique-id="c24b8fdf-34dc-46e9-88d6-8f98ab24879c" data-file-name="app/admin/page.tsx">
              <Activity className="h-5 w-5 mr-2 text-indigo-400" /><span className="editable-text" data-unique-id="967f61cd-8626-479d-b273-ebe8dba1a6f7" data-file-name="app/admin/page.tsx">
              Recent Activity
            </span></h2>
            <a href="/admin/activity" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center" data-unique-id="af0c477c-c87b-41e0-a32d-78090ef68345" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="18cc4350-32f2-4cb8-ad86-eb61a52ed0b8" data-file-name="app/admin/page.tsx">
              View All </span><ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          
          <div className="space-y-4" data-unique-id="2fe43895-80b8-4fc3-8ba1-1682db1ab758" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
            {recentActivity.length > 0 ? recentActivity.map((log, index) => <div key={index} className="flex items-start gap-3 p-3 bg-gray-700/40 rounded-lg" data-unique-id="89185bf2-dc38-4958-bc54-e92e5e984e6a" data-file-name="app/admin/page.tsx">
                  <div className="w-10 h-10 rounded-full bg-indigo-800/30 flex items-center justify-center" data-unique-id="e5416856-7861-4a8f-8ddc-4e6877ee2843" data-file-name="app/admin/page.tsx">
                    <Activity className="w-5 h-5 text-indigo-400" data-unique-id="ef9fc544-21d1-4030-b1f1-5adc1e2847c9" data-file-name="app/admin/page.tsx" data-dynamic-text="true" />
                  </div>
                  <div data-unique-id="2f41114b-eeb7-4b11-9bd9-e42b7f4acbd3" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
                    <div className="flex items-center" data-unique-id="1267d8bb-a3d5-4c95-b2a6-e1dbdb648bed" data-file-name="app/admin/page.tsx">
                      <span className="font-medium text-gray-200" data-unique-id="ff6026d8-6bb6-4564-aae1-147bbef3b8c3" data-file-name="app/admin/page.tsx" data-dynamic-text="true">{log.action}</span>
                      <span className="ml-2 text-xs px-2 py-0.5 bg-gray-700 rounded-full text-gray-300" data-unique-id="39791c23-197c-4dce-ad79-ee1d6df2a849" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
                        {log.user_email || 'Anonymous'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1" data-unique-id="80821ffa-a501-4c1c-8fc9-e6cc67b5f652" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                    {log.details && Object.keys(log.details).length > 0 && <div className="mt-2 text-xs text-gray-400" data-unique-id="2e352a4d-d07a-4a88-aaba-f0bfcee04d74" data-file-name="app/admin/page.tsx">
                        <div className="bg-gray-800/80 p-2 rounded" data-unique-id="3b5f082f-e524-46f5-996a-0f5c269ffa80" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
                          {Object.entries(log.details).filter(([key]) => key !== 'timestamp' && key !== 'user_agent').map(([key, value]) => <div key={key} data-unique-id="d4daf2c2-7f9d-4e47-afa9-c10273f3ca92" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
                                <span className="text-gray-500" data-unique-id="087c1146-762d-441c-8a1e-fd4b607f35c4" data-file-name="app/admin/page.tsx" data-dynamic-text="true">{key}<span className="editable-text" data-unique-id="184a28fd-54d8-4837-93bb-e14196d4ac9f" data-file-name="app/admin/page.tsx">:</span></span> {String(value)}
                              </div>)}
                        </div>
                      </div>}
                  </div>
                </div>) : <div className="text-center py-8 text-gray-400" data-unique-id="c0be29d4-5890-49ec-ab9d-aad7cbf95e06" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="cf28f818-0b20-4d02-9b14-63eaaff9f297" data-file-name="app/admin/page.tsx">
                No recent activity found
              </span></div>}
          </div>
        </motion.div>
        
        <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.3
      }} className="bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="4d4c9793-bf1e-4f16-9ce7-360f514fbd83" data-file-name="app/admin/page.tsx">
          <div className="flex justify-between items-center mb-6" data-unique-id="fae15d77-c03d-409c-b550-9f4afdadcb91" data-file-name="app/admin/page.tsx">
            <h2 className="text-xl font-semibold text-white flex items-center" data-unique-id="6ca69442-cb6b-4e80-a8a2-8bc03099c8dd" data-file-name="app/admin/page.tsx">
              <Database className="h-5 w-5 mr-2 text-indigo-400" /><span className="editable-text" data-unique-id="a5672fe4-5c7c-4bf5-b5dd-2c6396cc5afc" data-file-name="app/admin/page.tsx">
              Data Storage
            </span></h2>
            <a href="/admin/database" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center" data-unique-id="7c3a8370-1c00-4cae-9aa1-5a2b2cb998ce" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="f72628a3-c932-4f11-a1b6-d985e757f7ed" data-file-name="app/admin/page.tsx">
              Manage </span><ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          
          <div className="space-y-4" data-unique-id="fd48ddef-55d5-4c1c-9192-db20d9f2d812" data-file-name="app/admin/page.tsx">
            <DataStorageItem name="Customers" count={43} status="Synced" icon={<Users className="h-4 w-4" />} />
            <DataStorageItem name="Templates" count={12} status="Synced" icon={<FileText className="h-4 w-4" />} />
            <DataStorageItem name="Orders" count={87} status="Pending" icon={<Database className="h-4 w-4" />} isPending={true} />
            
            <div className="pt-4 mt-4 border-t border-gray-700" data-unique-id="3a3cd7db-b3d1-4bf6-9ef3-dc70d2ad84fb" data-file-name="app/admin/page.tsx">
              <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors" data-unique-id="772be754-51da-4ec2-a0d6-c86e3211f48a" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="0a0936cf-d5bd-400c-8862-38d48f4cf206" data-file-name="app/admin/page.tsx">
                Sync All Data
              </span></button>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Usage Analytics Chart */}
      <motion.div initial={{
      opacity: 0,
      y: 10
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 0.4
    }} className="bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="a3c46517-2d33-4ec9-b349-8b9bbf21852f" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
        <div className="flex justify-between items-center mb-6" data-unique-id="13d69039-52c1-4c06-bf5c-87da0d51efc3" data-file-name="app/admin/page.tsx">
          <h2 className="text-xl font-semibold text-white flex items-center" data-unique-id="c55ef69c-3787-41b3-94d6-d92ac63c4dfd" data-file-name="app/admin/page.tsx">
            <BarChart3 className="h-5 w-5 mr-2 text-indigo-400" /><span className="editable-text" data-unique-id="2d2c9c7f-37b6-4c2a-adaa-fde072285c86" data-file-name="app/admin/page.tsx">
            Usage Analytics
          </span></h2>
        </div>
        
        {/* Mock chart visualization - in a real app you'd use a charting library */}
        <div className="h-64 w-full" data-unique-id="8c115094-fd7d-49f5-8834-746b2aa800f0" data-file-name="app/admin/page.tsx">
          <div className="h-full flex items-end justify-between" data-unique-id="facc13ec-ae11-4223-8a65-e0ee5d6cf619" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
            {[35, 45, 30, 65, 85, 45, 30].map((value, i) => <div key={i} className="h-full flex flex-col justify-end items-center" data-unique-id="95c29c76-16d7-4d23-85db-af107aa1474d" data-file-name="app/admin/page.tsx">
                <div className="w-12 bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-t" style={{
              height: `${value}%`
            }} data-unique-id="4dd56528-c53c-4951-ad92-38bbd52b4c3e" data-file-name="app/admin/page.tsx"></div>
                <span className="text-xs text-gray-400 mt-2" data-unique-id="fd5a7ac3-efd1-4d58-9028-35d8fd4bb993" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>)}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-6 text-sm text-gray-400" data-unique-id="fe1ca502-c535-4077-b1c0-0bdea425853b" data-file-name="app/admin/page.tsx">
          <span data-unique-id="af04fba6-c8c9-42f2-847a-bb3f4d2745c9" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="7592a181-9428-40dc-b6f7-98bf801d8e8c" data-file-name="app/admin/page.tsx">Last 7 days</span></span>
          <div className="flex items-center" data-unique-id="0c60e9d1-48dd-4400-9821-a05f87722f61" data-file-name="app/admin/page.tsx">
            <span className="flex items-center mr-4" data-unique-id="49940c2a-1c1a-4c43-94bc-10f4a62a4307" data-file-name="app/admin/page.tsx">
              <SmilePlus className="h-4 w-4 mr-1 text-green-500" /><span className="editable-text" data-unique-id="338c9c47-6173-4e77-8fc2-0a6737b41b3f" data-file-name="app/admin/page.tsx"> 32% increase
            </span></span>
            <span data-unique-id="0034117c-7062-4460-93c2-72b9433fc87f" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="524f2dad-06ea-441a-8188-5ca3f9b8af7d" data-file-name="app/admin/page.tsx">Total interactions: 458</span></span>
          </div>
        </div>
      </motion.div>
    </div>;
}
function StatsCard({
  title,
  value,
  icon,
  color
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return <motion.div initial={{
    opacity: 0,
    y: 10
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.3
  }} className={`${color} rounded-xl shadow-lg p-6 flex items-center`} data-unique-id="3b60fa38-f26f-4b3a-a78d-575b7e48bdc3" data-file-name="app/admin/page.tsx">
      <div className="p-4 bg-white/10 rounded-xl" data-unique-id="8c6d66a0-52e4-4dcf-aa9c-40d3ef1bb67e" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
        {icon}
      </div>
      <div className="ml-4" data-unique-id="7fe044a2-2945-4419-bf59-c0695730cc95" data-file-name="app/admin/page.tsx">
        <h3 className="text-gray-100 text-sm font-medium" data-unique-id="e86ab30e-b779-476b-a82c-f8ad2013cd92" data-file-name="app/admin/page.tsx" data-dynamic-text="true">{title}</h3>
        <p className="text-white text-2xl font-bold" data-unique-id="6a3a0f47-3ee1-4750-a976-ea1cfe6c0793" data-file-name="app/admin/page.tsx" data-dynamic-text="true">{value.toLocaleString()}</p>
      </div>
    </motion.div>;
}
function DataStorageItem({
  name,
  count,
  status,
  icon,
  isPending = false
}: {
  name: string;
  count: number;
  status: string;
  icon: React.ReactNode;
  isPending?: boolean;
}) {
  return <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg" data-unique-id="be62ecd7-ac8c-40a0-8010-647e0c692d37" data-file-name="app/admin/page.tsx">
      <div className="flex items-center" data-unique-id="63956416-ca56-433f-97b7-b0ff4837dcd9" data-file-name="app/admin/page.tsx">
        <span className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3" data-unique-id="6d605e98-2758-4034-b34f-f96f0880c89b" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
          {icon}
        </span>
        <div data-unique-id="332d2036-f6f8-4dba-a1ae-e8630b046b39" data-file-name="app/admin/page.tsx">
          <div className="font-medium text-gray-200" data-unique-id="8135290a-05e6-41c1-8c1c-c065daaff762" data-file-name="app/admin/page.tsx" data-dynamic-text="true">{name}</div>
          <div className="text-xs text-gray-400" data-unique-id="9e077dc8-420d-48bc-8cb0-f63133fedcc2" data-file-name="app/admin/page.tsx" data-dynamic-text="true">{count.toLocaleString()}<span className="editable-text" data-unique-id="ed990af7-25b2-453e-9e0d-e57340293c08" data-file-name="app/admin/page.tsx"> records</span></div>
        </div>
      </div>
      <div className={`flex items-center text-sm ${isPending ? 'text-amber-400' : 'text-green-400'}`} data-unique-id="e70f680f-a66c-4f3a-a754-657fc5c40fa3" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
        {isPending ? <XCircle className="h-4 w-4 mr-1" /> : <CheckCircle2 className="h-4 w-4 mr-1" />}
        {status}
      </div>
    </div>;
}