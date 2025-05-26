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
  return <div className="space-y-8" data-unique-id="bcdebb06-6757-44e5-8df7-018973d3f338" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center" data-unique-id="c416badc-af1d-49ed-b080-9824f87a8473" data-file-name="app/admin/page.tsx">
        <h1 className="text-3xl font-bold text-white" data-unique-id="f5fe84d2-6827-477a-9937-03198ad50e49" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="506d59f4-47d6-4d84-a742-09cada6eddb0" data-file-name="app/admin/page.tsx">Admin Dashboard</span></h1>
        <span className="px-3 py-1 bg-indigo-900/50 border border-indigo-800/60 rounded-md text-indigo-300 text-sm" data-unique-id="3c7295bb-de4b-4183-9563-0b404e1c688d" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
          {new Date().toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
        </span>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-unique-id="7f7dd436-fd9a-4b06-b1ea-d2946d732b7f" data-file-name="app/admin/page.tsx">
        <StatsCard title="Total Users" value={stats.totalUsers} icon={<Users className="h-8 w-8" />} color="bg-blue-600" />
        <StatsCard title="Total Emails Sent" value={stats.totalEmails} icon={<Mail className="h-8 w-8" />} color="bg-green-600" />
        <StatsCard title="Orders Processed" value={stats.totalOrders} icon={<FileText className="h-8 w-8" />} color="bg-purple-600" />
        <StatsCard title="Active Users" value={stats.activeUsers} icon={<Activity className="h-8 w-8" />} color="bg-amber-600" />
      </div>
      
      {/* Activity and DataStore sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-unique-id="f2ad5407-0345-4de0-851a-9b1bd3dadfb1" data-file-name="app/admin/page.tsx">
        <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.2
      }} className="lg:col-span-2 bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="56f422f6-49cd-4830-a9f8-099d58c5c15a" data-file-name="app/admin/page.tsx">
          <div className="flex justify-between items-center mb-6" data-unique-id="67d431f2-0885-4156-89f9-2e24966ce499" data-file-name="app/admin/page.tsx">
            <h2 className="text-xl font-semibold text-white flex items-center" data-unique-id="64390d3f-a59e-4d48-8cd5-9ab66dcedc72" data-file-name="app/admin/page.tsx">
              <Activity className="h-5 w-5 mr-2 text-indigo-400" /><span className="editable-text" data-unique-id="a97ddff7-9ee9-4f00-84ab-b7a3d5bff29a" data-file-name="app/admin/page.tsx">
              Recent Activity
            </span></h2>
            <a href="/admin/activity" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center" data-unique-id="879ba8b5-c88b-43da-8dcc-56c986e0b131" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="89a96b9c-a2fc-4b6e-b6c6-d6c74afdbe05" data-file-name="app/admin/page.tsx">
              View All </span><ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          
          <div className="space-y-4" data-unique-id="73e868a4-779d-40f3-8ca0-e7e33222dc6c" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
            {recentActivity.length > 0 ? recentActivity.map((log, index) => <div key={index} className="flex items-start gap-3 p-3 bg-gray-700/40 rounded-lg" data-unique-id="37763723-2b08-47fe-9c35-d1c2cb54a048" data-file-name="app/admin/page.tsx">
                  <div className="w-10 h-10 rounded-full bg-indigo-800/30 flex items-center justify-center" data-unique-id="872d9c2c-08d3-4c60-93ab-99384819f745" data-file-name="app/admin/page.tsx">
                    <Activity className="w-5 h-5 text-indigo-400" data-unique-id="69188013-53b5-43b9-bc41-71a20b0aa553" data-file-name="app/admin/page.tsx" data-dynamic-text="true" />
                  </div>
                  <div data-unique-id="8ee42e0e-dba4-4c67-81e8-f3335b94a1fa" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
                    <div className="flex items-center" data-unique-id="18d97190-f666-48ca-92c6-cbb6702052c2" data-file-name="app/admin/page.tsx">
                      <span className="font-medium text-gray-200" data-unique-id="3b1c3c6c-16eb-4550-ac1e-6c0ffa891f25" data-file-name="app/admin/page.tsx" data-dynamic-text="true">{log.action}</span>
                      <span className="ml-2 text-xs px-2 py-0.5 bg-gray-700 rounded-full text-gray-300" data-unique-id="6267e5b0-46ca-47ae-a464-3bc17007c934" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
                        {log.user_email || 'Anonymous'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1" data-unique-id="cd23d6af-2929-4aaa-8af6-460079302190" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                    {log.details && Object.keys(log.details).length > 0 && <div className="mt-2 text-xs text-gray-400" data-unique-id="fd9b8923-9d1d-4388-8bed-9dd6f3b57028" data-file-name="app/admin/page.tsx">
                        <div className="bg-gray-800/80 p-2 rounded" data-unique-id="59329752-d611-418b-b307-19faa1821526" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
                          {Object.entries(log.details).filter(([key]) => key !== 'timestamp' && key !== 'user_agent').map(([key, value]) => <div key={key} data-unique-id="14cf7e6a-faec-4eff-bb42-df9ed9ec8331" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
                                <span className="text-gray-500" data-unique-id="dcd9dc1a-2e04-40b7-af6c-e42b34e37073" data-file-name="app/admin/page.tsx" data-dynamic-text="true">{key}<span className="editable-text" data-unique-id="a9f66f73-d253-4698-bbd2-a886d114bb48" data-file-name="app/admin/page.tsx">:</span></span> {String(value)}
                              </div>)}
                        </div>
                      </div>}
                  </div>
                </div>) : <div className="text-center py-8 text-gray-400" data-unique-id="3fe38779-4ee6-4e93-93c4-752db56486c2" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="ed113bcb-5009-45fd-9607-aecfe610480f" data-file-name="app/admin/page.tsx">
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
      }} className="bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="cf56cfa0-71c2-4489-a994-5e3357fb3932" data-file-name="app/admin/page.tsx">
          <div className="flex justify-between items-center mb-6" data-unique-id="92d5a0a6-10c5-4e70-95f5-b0ea83422782" data-file-name="app/admin/page.tsx">
            <h2 className="text-xl font-semibold text-white flex items-center" data-unique-id="21ccf80c-b9e6-4104-8772-1fe46e824668" data-file-name="app/admin/page.tsx">
              <Database className="h-5 w-5 mr-2 text-indigo-400" /><span className="editable-text" data-unique-id="313de81f-5035-48e2-9c3a-a033c3822f77" data-file-name="app/admin/page.tsx">
              Data Storage
            </span></h2>
            <a href="/admin/database" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center" data-unique-id="5fd1d680-a377-4c07-a6c7-8ec577d2393e" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="5935a80b-3c34-4d5d-9e8d-db4daae343a9" data-file-name="app/admin/page.tsx">
              Manage </span><ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          
          <div className="space-y-4" data-unique-id="9514a03d-5a4c-41e5-a56a-69a25387f1c2" data-file-name="app/admin/page.tsx">
            <DataStorageItem name="Customers" count={43} status="Synced" icon={<Users className="h-4 w-4" />} />
            <DataStorageItem name="Templates" count={12} status="Synced" icon={<FileText className="h-4 w-4" />} />
            <DataStorageItem name="Orders" count={87} status="Pending" icon={<Database className="h-4 w-4" />} isPending={true} />
            
            <div className="pt-4 mt-4 border-t border-gray-700" data-unique-id="71c70a1f-c03b-47f5-aa85-b43c39e5c165" data-file-name="app/admin/page.tsx">
              <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors" data-unique-id="a874cde7-360f-4ec2-9a11-bcb3a38c6a3d" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="9719d980-1bca-4d78-b9fc-fa4411e9eb1a" data-file-name="app/admin/page.tsx">
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
    }} className="bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="64eb03ec-a94f-45f4-a854-65a9527bba2a" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
        <div className="flex justify-between items-center mb-6" data-unique-id="42ff66a8-81f8-494f-95d7-c06d1ed75745" data-file-name="app/admin/page.tsx">
          <h2 className="text-xl font-semibold text-white flex items-center" data-unique-id="02d4d689-e4b0-4c01-9bb4-a55528c4f8bc" data-file-name="app/admin/page.tsx">
            <BarChart3 className="h-5 w-5 mr-2 text-indigo-400" /><span className="editable-text" data-unique-id="400db232-1dad-48cc-aa82-ffbddc8a37ce" data-file-name="app/admin/page.tsx">
            Usage Analytics
          </span></h2>
        </div>
        
        {/* Mock chart visualization - in a real app you'd use a charting library */}
        <div className="h-64 w-full" data-unique-id="6f1899bf-4b6d-4948-8934-0c1af711cf6f" data-file-name="app/admin/page.tsx">
          <div className="h-full flex items-end justify-between" data-unique-id="99cfe51f-5bb2-4593-837c-7b220595dcc5" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
            {[35, 45, 30, 65, 85, 45, 30].map((value, i) => <div key={i} className="h-full flex flex-col justify-end items-center" data-unique-id="2c4276f3-6148-40f1-898c-e2957c7ae66c" data-file-name="app/admin/page.tsx">
                <div className="w-12 bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-t" style={{
              height: `${value}%`
            }} data-unique-id="c859ecd8-6c75-451e-84c8-f0be3f995c24" data-file-name="app/admin/page.tsx"></div>
                <span className="text-xs text-gray-400 mt-2" data-unique-id="5230a5e0-6401-4d85-b91f-3a3d423117e4" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>)}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-6 text-sm text-gray-400" data-unique-id="d8b4abcf-19e6-415c-9d7a-de741cee2e39" data-file-name="app/admin/page.tsx">
          <span data-unique-id="a3c5382b-ea8e-4d80-8bbe-b775bcbabe6a" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="d1bb2d71-a394-436c-a39d-e39d729fc06b" data-file-name="app/admin/page.tsx">Last 7 days</span></span>
          <div className="flex items-center" data-unique-id="de248a62-ec97-464d-b090-7983e234f691" data-file-name="app/admin/page.tsx">
            <span className="flex items-center mr-4" data-unique-id="39180ec7-6c58-414d-92b7-eb070e5b3a84" data-file-name="app/admin/page.tsx">
              <SmilePlus className="h-4 w-4 mr-1 text-green-500" /><span className="editable-text" data-unique-id="0e3e8ef2-ce9a-4f3d-849e-3f2df8f810e1" data-file-name="app/admin/page.tsx"> 32% increase
            </span></span>
            <span data-unique-id="9b9d781a-85ff-4a4e-b685-87d8efc2f37f" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="0356e8c6-6ee8-4114-a214-2eda68a240f7" data-file-name="app/admin/page.tsx">Total interactions: 458</span></span>
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
  }} className={`${color} rounded-xl shadow-lg p-6 flex items-center`} data-unique-id="589c09cd-740b-49f9-ad44-c6310eb6e249" data-file-name="app/admin/page.tsx">
      <div className="p-4 bg-white/10 rounded-xl" data-unique-id="5a4a76f9-6e77-4468-b332-472d38750d57" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
        {icon}
      </div>
      <div className="ml-4" data-unique-id="3c84d6ab-3f83-4438-a722-c2e8cb3d47ff" data-file-name="app/admin/page.tsx">
        <h3 className="text-gray-100 text-sm font-medium" data-unique-id="116c799a-cce9-4992-a074-d7db0697f5e3" data-file-name="app/admin/page.tsx" data-dynamic-text="true">{title}</h3>
        <p className="text-white text-2xl font-bold" data-unique-id="2956cc61-2c97-4b14-85a7-f1a9093e52f8" data-file-name="app/admin/page.tsx" data-dynamic-text="true">{value.toLocaleString()}</p>
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
  return <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg" data-unique-id="3b4f331c-ec9d-448a-8760-1f84ce4c0904" data-file-name="app/admin/page.tsx">
      <div className="flex items-center" data-unique-id="d1edb8c7-ec70-43c7-8c4f-b862ab0ad91d" data-file-name="app/admin/page.tsx">
        <span className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3" data-unique-id="950c3327-2e8c-4720-aef2-856a855b9aa1" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
          {icon}
        </span>
        <div data-unique-id="63ee4af1-f761-49bc-a87b-39191c05ded6" data-file-name="app/admin/page.tsx">
          <div className="font-medium text-gray-200" data-unique-id="b442a314-697b-44f5-852f-8f2f431cb77c" data-file-name="app/admin/page.tsx" data-dynamic-text="true">{name}</div>
          <div className="text-xs text-gray-400" data-unique-id="fd8ce4ab-db0e-4761-a551-efe67375c63e" data-file-name="app/admin/page.tsx" data-dynamic-text="true">{count.toLocaleString()}<span className="editable-text" data-unique-id="72eef510-3e07-43cb-8cff-b29d2f92bcef" data-file-name="app/admin/page.tsx"> records</span></div>
        </div>
      </div>
      <div className={`flex items-center text-sm ${isPending ? 'text-amber-400' : 'text-green-400'}`} data-unique-id="568f1c5b-bc6d-4582-b8e3-ea13243fb1a1" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
        {isPending ? <XCircle className="h-4 w-4 mr-1" /> : <CheckCircle2 className="h-4 w-4 mr-1" />}
        {status}
      </div>
    </div>;
}