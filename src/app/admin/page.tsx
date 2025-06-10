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
  return <div className="space-y-8" data-unique-id="27474971-e87d-4fc2-97d1-382d07e23d1f" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center" data-unique-id="cdf3c14d-5613-4c90-96d4-7b25ecafffcd" data-file-name="app/admin/page.tsx">
        <h1 className="text-3xl font-bold text-white" data-unique-id="17a15718-dd7a-4c2d-946e-69007892d242" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="82d7002e-eb5b-47ca-b23b-f54b01295ed0" data-file-name="app/admin/page.tsx">Admin Dashboard</span></h1>
        <span className="px-3 py-1 bg-indigo-900/50 border border-indigo-800/60 rounded-md text-indigo-300 text-sm" data-unique-id="7f41e4a1-e082-4aa4-be71-6ad27fb00b71" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
          {new Date().toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
        </span>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-unique-id="313eff0b-883d-433c-8b28-4f87b6d03f76" data-file-name="app/admin/page.tsx">
        <StatsCard title="Total Users" value={stats.totalUsers} icon={<Users className="h-8 w-8" />} color="bg-blue-600" />
        <StatsCard title="Total Emails Sent" value={stats.totalEmails} icon={<Mail className="h-8 w-8" />} color="bg-green-600" />
        <StatsCard title="Orders Processed" value={stats.totalOrders} icon={<FileText className="h-8 w-8" />} color="bg-purple-600" />
        <StatsCard title="Active Users" value={stats.activeUsers} icon={<Activity className="h-8 w-8" />} color="bg-amber-600" />
      </div>
      
      {/* Activity and DataStore sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-unique-id="20768316-f98a-49b5-af41-0eaae92e10fd" data-file-name="app/admin/page.tsx">
        <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.2
      }} className="lg:col-span-2 bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="c16ca329-d1bd-4a91-b7de-96fce2c70eec" data-file-name="app/admin/page.tsx">
          <div className="flex justify-between items-center mb-6" data-unique-id="df333527-dedd-4861-a64b-07f407abb821" data-file-name="app/admin/page.tsx">
            <h2 className="text-xl font-semibold text-white flex items-center" data-unique-id="457eb938-2118-413f-a898-a23dbfd86cdc" data-file-name="app/admin/page.tsx">
              <Activity className="h-5 w-5 mr-2 text-indigo-400" /><span className="editable-text" data-unique-id="b5d95b8f-06b2-4e46-99b0-c75d5bbcaf04" data-file-name="app/admin/page.tsx">
              Recent Activity
            </span></h2>
            <a href="/admin/activity" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center" data-unique-id="a723c837-ec89-410e-ab04-4820d18cb800" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="9863dd6a-b30d-4368-867f-8192cd16fed8" data-file-name="app/admin/page.tsx">
              View All </span><ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          
          <div className="space-y-4" data-unique-id="caa5b87d-f556-431e-98a1-cecd81a9d319" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
            {recentActivity.length > 0 ? recentActivity.map((log, index) => <div key={index} className="flex items-start gap-3 p-3 bg-gray-700/40 rounded-lg" data-unique-id="673b265b-ab1a-4203-a221-1d471e3538c5" data-file-name="app/admin/page.tsx">
                  <div className="w-10 h-10 rounded-full bg-indigo-800/30 flex items-center justify-center" data-unique-id="49e7fc80-ac49-49cf-996a-f7c856a4bc45" data-file-name="app/admin/page.tsx">
                    <Activity className="w-5 h-5 text-indigo-400" data-unique-id="53699c8f-f78b-4947-942d-4a25d3b4f487" data-file-name="app/admin/page.tsx" data-dynamic-text="true" />
                  </div>
                  <div data-unique-id="7e4f26b3-acd1-44c3-8f80-e190125147b2" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
                    <div className="flex items-center" data-unique-id="d284a36a-7ea3-4624-b140-1e278cf3442d" data-file-name="app/admin/page.tsx">
                      <span className="font-medium text-gray-200" data-unique-id="0a86bde0-cc68-474f-90ad-9b09920b1840" data-file-name="app/admin/page.tsx" data-dynamic-text="true">{log.action}</span>
                      <span className="ml-2 text-xs px-2 py-0.5 bg-gray-700 rounded-full text-gray-300" data-unique-id="cdddadd6-d01d-4cd1-9a94-b2132164dc81" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
                        {log.user_email || 'Anonymous'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1" data-unique-id="29fdde45-9826-45cf-8ff5-434c7467073b" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                    {log.details && Object.keys(log.details).length > 0 && <div className="mt-2 text-xs text-gray-400" data-unique-id="d53b9770-a9ea-4d7e-81f5-77db9a1d3cda" data-file-name="app/admin/page.tsx">
                        <div className="bg-gray-800/80 p-2 rounded" data-unique-id="7211b7d2-c891-4d83-a4f2-f0333c22e49b" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
                          {Object.entries(log.details).filter(([key]) => key !== 'timestamp' && key !== 'user_agent').map(([key, value]) => <div key={key} data-unique-id="626ab9ad-9bde-4103-adef-85a5114844bf" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
                                <span className="text-gray-500" data-unique-id="878b6812-52ce-4df8-aad2-c91fada8bc7e" data-file-name="app/admin/page.tsx" data-dynamic-text="true">{key}<span className="editable-text" data-unique-id="babebefb-f407-43e4-bd81-17d3aa55e472" data-file-name="app/admin/page.tsx">:</span></span> {String(value)}
                              </div>)}
                        </div>
                      </div>}
                  </div>
                </div>) : <div className="text-center py-8 text-gray-400" data-unique-id="a8ec5861-6191-4018-a760-b0a17cb5bf81" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="f9378e7a-e4d7-43bf-82f5-bac74130cfe9" data-file-name="app/admin/page.tsx">
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
      }} className="bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="bd96f09e-2bd0-45c9-a438-63fcce0dde10" data-file-name="app/admin/page.tsx">
          <div className="flex justify-between items-center mb-6" data-unique-id="75ca80f7-fe87-4272-83cf-d5474e1b1a89" data-file-name="app/admin/page.tsx">
            <h2 className="text-xl font-semibold text-white flex items-center" data-unique-id="aaf27406-55bd-4a56-989a-cb99661aba3b" data-file-name="app/admin/page.tsx">
              <Database className="h-5 w-5 mr-2 text-indigo-400" /><span className="editable-text" data-unique-id="255eb226-7a70-4da4-a426-b9a31ae47395" data-file-name="app/admin/page.tsx">
              Data Storage
            </span></h2>
            <a href="/admin/database" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center" data-unique-id="dc8d1966-d712-4b2a-8d3a-8b74513baeca" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="1a8cb8c5-4840-4e61-9019-9a5ec85c446e" data-file-name="app/admin/page.tsx">
              Manage </span><ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          
          <div className="space-y-4" data-unique-id="7392269c-109e-40ab-ae24-274de00f9de3" data-file-name="app/admin/page.tsx">
            <DataStorageItem name="Customers" count={43} status="Synced" icon={<Users className="h-4 w-4" />} />
            <DataStorageItem name="Templates" count={12} status="Synced" icon={<FileText className="h-4 w-4" />} />
            <DataStorageItem name="Orders" count={87} status="Pending" icon={<Database className="h-4 w-4" />} isPending={true} />
            
            <div className="pt-4 mt-4 border-t border-gray-700" data-unique-id="a4e6d490-1840-48a8-a0a6-983f434ae996" data-file-name="app/admin/page.tsx">
              <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors" data-unique-id="c66e7045-09c0-4c7d-b494-3287a3849586" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="4f4d7435-0e42-475d-8436-12dcfea15191" data-file-name="app/admin/page.tsx">
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
    }} className="bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="822e0f64-7c3f-464a-a50a-d55e081b7fe8" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
        <div className="flex justify-between items-center mb-6" data-unique-id="376eb505-cf47-4a9f-813d-79b3f7d20476" data-file-name="app/admin/page.tsx">
          <h2 className="text-xl font-semibold text-white flex items-center" data-unique-id="52f77afd-eaf6-4408-b52b-154c10b57fcd" data-file-name="app/admin/page.tsx">
            <BarChart3 className="h-5 w-5 mr-2 text-indigo-400" /><span className="editable-text" data-unique-id="3fe404ac-4ddf-4e42-a44a-db8fed21bf23" data-file-name="app/admin/page.tsx">
            Usage Analytics
          </span></h2>
        </div>
        
        {/* Mock chart visualization - in a real app you'd use a charting library */}
        <div className="h-64 w-full" data-unique-id="93df856b-0ab6-42f7-b6ab-32ca63a6a8d1" data-file-name="app/admin/page.tsx">
          <div className="h-full flex items-end justify-between" data-unique-id="9b81bc4a-826c-4e84-a710-936ab094168a" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
            {[35, 45, 30, 65, 85, 45, 30].map((value, i) => <div key={i} className="h-full flex flex-col justify-end items-center" data-unique-id="a265029b-e0db-473a-9586-a6a2bdd8f928" data-file-name="app/admin/page.tsx">
                <div className="w-12 bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-t" style={{
              height: `${value}%`
            }} data-unique-id="33fcdbc7-7fd2-44e9-8208-8534173ab3b7" data-file-name="app/admin/page.tsx"></div>
                <span className="text-xs text-gray-400 mt-2" data-unique-id="603eab61-3259-4ec3-a469-37e8d1d65548" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>)}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-6 text-sm text-gray-400" data-unique-id="203012ac-8150-4c2e-87b7-0b2699fd4b77" data-file-name="app/admin/page.tsx">
          <span data-unique-id="f84a3ed9-25a4-451f-b60e-6dcfdd4a6928" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="2243a8f3-51e4-4b11-9179-4881d7ca9b39" data-file-name="app/admin/page.tsx">Last 7 days</span></span>
          <div className="flex items-center" data-unique-id="d2a5e4bd-45cd-4824-9ac3-a40374af4ca3" data-file-name="app/admin/page.tsx">
            <span className="flex items-center mr-4" data-unique-id="d266b681-fa08-48ac-bdaa-876452228e18" data-file-name="app/admin/page.tsx">
              <SmilePlus className="h-4 w-4 mr-1 text-green-500" /><span className="editable-text" data-unique-id="50c1505f-fe93-4fd3-a344-f98a1b16c610" data-file-name="app/admin/page.tsx"> 32% increase
            </span></span>
            <span data-unique-id="c0188529-f69f-4a4a-a4c2-1671f6d80aa0" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="08d75438-bfea-4fe7-a36a-792f2efeb283" data-file-name="app/admin/page.tsx">Total interactions: 458</span></span>
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
  }} className={`${color} rounded-xl shadow-lg p-6 flex items-center`} data-unique-id="3c33faba-e213-447d-8f45-6ff3188a275a" data-file-name="app/admin/page.tsx">
      <div className="p-4 bg-white/10 rounded-xl" data-unique-id="6effc79f-5cbd-4dc8-beab-da1f52042758" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
        {icon}
      </div>
      <div className="ml-4" data-unique-id="d9028ab7-b45c-48b0-9070-ffe1ae4e5e17" data-file-name="app/admin/page.tsx">
        <h3 className="text-gray-100 text-sm font-medium" data-unique-id="4191f141-1222-41e6-9fb8-7f8d370c5c6d" data-file-name="app/admin/page.tsx" data-dynamic-text="true">{title}</h3>
        <p className="text-white text-2xl font-bold" data-unique-id="090ab669-8ce7-4ec2-be53-519cc9a56e61" data-file-name="app/admin/page.tsx" data-dynamic-text="true">{value.toLocaleString()}</p>
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
  return <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg" data-unique-id="81679d81-a60f-4c22-b046-2692df044624" data-file-name="app/admin/page.tsx">
      <div className="flex items-center" data-unique-id="d5440c8e-ac3e-409b-a6e2-009401fa2006" data-file-name="app/admin/page.tsx">
        <span className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3" data-unique-id="fddee0c6-7b05-445e-aef4-1aaa2eeb9399" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
          {icon}
        </span>
        <div data-unique-id="41cf9e1f-3f1b-4804-8681-a2ed51c4bd13" data-file-name="app/admin/page.tsx">
          <div className="font-medium text-gray-200" data-unique-id="533d515c-a000-47db-afe8-c8c4448a8c00" data-file-name="app/admin/page.tsx" data-dynamic-text="true">{name}</div>
          <div className="text-xs text-gray-400" data-unique-id="04db8663-6c71-4baa-9845-6f3763040a7f" data-file-name="app/admin/page.tsx" data-dynamic-text="true">{count.toLocaleString()}<span className="editable-text" data-unique-id="ebb59290-44b5-420c-b67f-084fd8525f7f" data-file-name="app/admin/page.tsx"> records</span></div>
        </div>
      </div>
      <div className={`flex items-center text-sm ${isPending ? 'text-amber-400' : 'text-green-400'}`} data-unique-id="27d80221-0230-426b-8095-51bcf6fdde28" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
        {isPending ? <XCircle className="h-4 w-4 mr-1" /> : <CheckCircle2 className="h-4 w-4 mr-1" />}
        {status}
      </div>
    </div>;
}