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
  return <div className="space-y-8" data-unique-id="fe7eeced-cd46-4c00-9e47-5295c64ece5a" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center" data-unique-id="93da8235-a40c-463a-9873-7e48901cff94" data-file-name="app/admin/page.tsx">
        <h1 className="text-3xl font-bold text-white" data-unique-id="3678aa59-a775-40b2-88b7-19e61e2c90fc" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="1d7eb48d-1513-4557-93af-7671d9c8f796" data-file-name="app/admin/page.tsx">Admin Dashboard</span></h1>
        <span className="px-3 py-1 bg-indigo-900/50 border border-indigo-800/60 rounded-md text-indigo-300 text-sm" data-unique-id="641c58f5-cc65-425d-a3ea-96eef3dff26b" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
          {new Date().toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
        </span>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-unique-id="3c37ced2-18cc-4153-b63e-7923fe88febc" data-file-name="app/admin/page.tsx">
        <StatsCard title="Total Users" value={stats.totalUsers} icon={<Users className="h-8 w-8" />} color="bg-blue-600" />
        <StatsCard title="Total Emails Sent" value={stats.totalEmails} icon={<Mail className="h-8 w-8" />} color="bg-green-600" />
        <StatsCard title="Orders Processed" value={stats.totalOrders} icon={<FileText className="h-8 w-8" />} color="bg-purple-600" />
        <StatsCard title="Active Users" value={stats.activeUsers} icon={<Activity className="h-8 w-8" />} color="bg-amber-600" />
      </div>
      
      {/* Activity and DataStore sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-unique-id="6e9528c1-d5f3-4eb8-8dc1-f560a144ee79" data-file-name="app/admin/page.tsx">
        <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.2
      }} className="lg:col-span-2 bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="dae48233-5521-4f3a-a098-f278a3fb8ec9" data-file-name="app/admin/page.tsx">
          <div className="flex justify-between items-center mb-6" data-unique-id="8d5d0fdc-b185-4e19-8ee1-af5665f42001" data-file-name="app/admin/page.tsx">
            <h2 className="text-xl font-semibold text-white flex items-center" data-unique-id="5e915111-8a90-43c1-b5cf-5fd303faac6c" data-file-name="app/admin/page.tsx">
              <Activity className="h-5 w-5 mr-2 text-indigo-400" /><span className="editable-text" data-unique-id="540bdc2d-0033-43b2-ab92-4b729fcc62e1" data-file-name="app/admin/page.tsx">
              Recent Activity
            </span></h2>
            <a href="/admin/activity" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center" data-unique-id="d09f31b1-7bb1-4b5e-834e-2925928a7107" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="cbeb2baa-107b-49cd-b0fd-d5bb8712a2ce" data-file-name="app/admin/page.tsx">
              View All </span><ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          
          <div className="space-y-4" data-unique-id="0da1761d-4784-4586-aef0-2661888fd9de" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
            {recentActivity.length > 0 ? recentActivity.map((log, index) => <div key={index} className="flex items-start gap-3 p-3 bg-gray-700/40 rounded-lg" data-unique-id="6e11ce65-2438-4233-982c-486ea78cb0e4" data-file-name="app/admin/page.tsx">
                  <div className="w-10 h-10 rounded-full bg-indigo-800/30 flex items-center justify-center" data-unique-id="71bff633-cef0-425c-83c5-27a0614c853d" data-file-name="app/admin/page.tsx">
                    <Activity className="w-5 h-5 text-indigo-400" data-unique-id="45e377eb-7803-4542-af71-aefa5701bc81" data-file-name="app/admin/page.tsx" data-dynamic-text="true" />
                  </div>
                  <div data-unique-id="6d0855df-abb1-45ca-9772-0985561ca67f" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
                    <div className="flex items-center" data-unique-id="7b677c11-11f6-424c-807c-13d1a1f1bbdf" data-file-name="app/admin/page.tsx">
                      <span className="font-medium text-gray-200" data-unique-id="fdc5d349-eefd-47f7-863c-d0f2b2bbf0f8" data-file-name="app/admin/page.tsx" data-dynamic-text="true">{log.action}</span>
                      <span className="ml-2 text-xs px-2 py-0.5 bg-gray-700 rounded-full text-gray-300" data-unique-id="099ddb48-158e-47e0-85ad-2b90b4fc5572" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
                        {log.user_email || 'Anonymous'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1" data-unique-id="55fe0619-9701-4b6a-8e2d-fda5f9cd6925" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                    {log.details && Object.keys(log.details).length > 0 && <div className="mt-2 text-xs text-gray-400" data-unique-id="f0bb01f3-12dc-47ff-b779-73c034aecfb7" data-file-name="app/admin/page.tsx">
                        <div className="bg-gray-800/80 p-2 rounded" data-unique-id="64f809b3-5cb5-4ec0-957c-566f070e221f" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
                          {Object.entries(log.details).filter(([key]) => key !== 'timestamp' && key !== 'user_agent').map(([key, value]) => <div key={key} data-unique-id="f062c228-54af-4c0d-b165-e3aa5b2a2617" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
                                <span className="text-gray-500" data-unique-id="0267c96e-00df-492d-bec8-5bbcdf7bf0d8" data-file-name="app/admin/page.tsx" data-dynamic-text="true">{key}<span className="editable-text" data-unique-id="826e85a8-6ba4-4611-af69-7ddda0cf824b" data-file-name="app/admin/page.tsx">:</span></span> {String(value)}
                              </div>)}
                        </div>
                      </div>}
                  </div>
                </div>) : <div className="text-center py-8 text-gray-400" data-unique-id="abb54ca7-f0a8-4b98-8fa5-8be77be11ab2" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="e2203ef9-2a4e-4090-ba67-47c5e04de1a4" data-file-name="app/admin/page.tsx">
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
      }} className="bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="e6f95503-074c-42c1-a599-08c75bfee23d" data-file-name="app/admin/page.tsx">
          <div className="flex justify-between items-center mb-6" data-unique-id="4ac24a25-3953-4791-a70b-4355cbb0b1a2" data-file-name="app/admin/page.tsx">
            <h2 className="text-xl font-semibold text-white flex items-center" data-unique-id="19613bb5-7307-40a4-8827-f7e03be1aead" data-file-name="app/admin/page.tsx">
              <Database className="h-5 w-5 mr-2 text-indigo-400" /><span className="editable-text" data-unique-id="fb71f338-9225-477d-b760-c244bf6c9e86" data-file-name="app/admin/page.tsx">
              Data Storage
            </span></h2>
            <a href="/admin/database" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center" data-unique-id="d7cbe0da-73e8-4281-90a2-adce7a0ffac3" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="4629c61f-a7ef-49c1-9018-226ab8326e33" data-file-name="app/admin/page.tsx">
              Manage </span><ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          
          <div className="space-y-4" data-unique-id="e147f422-6649-42aa-b556-7d9d8caa0b4d" data-file-name="app/admin/page.tsx">
            <DataStorageItem name="Customers" count={43} status="Synced" icon={<Users className="h-4 w-4" />} />
            <DataStorageItem name="Templates" count={12} status="Synced" icon={<FileText className="h-4 w-4" />} />
            <DataStorageItem name="Orders" count={87} status="Pending" icon={<Database className="h-4 w-4" />} isPending={true} />
            
            <div className="pt-4 mt-4 border-t border-gray-700" data-unique-id="710e8864-f5fb-48ed-9ddb-e04526f8b0d1" data-file-name="app/admin/page.tsx">
              <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors" data-unique-id="419e9a57-bc23-468b-a4e4-bc9ba9c2e7b8" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="ff67c9a9-89ae-47c7-a52f-e30a553055ba" data-file-name="app/admin/page.tsx">
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
    }} className="bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="e3039b46-7619-499c-a889-a24f6ac3a474" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
        <div className="flex justify-between items-center mb-6" data-unique-id="9e531e7a-85cc-4bed-9608-7f9e3d518a86" data-file-name="app/admin/page.tsx">
          <h2 className="text-xl font-semibold text-white flex items-center" data-unique-id="d03035e3-804c-4c84-a068-f06073db918d" data-file-name="app/admin/page.tsx">
            <BarChart3 className="h-5 w-5 mr-2 text-indigo-400" /><span className="editable-text" data-unique-id="79595cde-0116-4288-8293-7d738d7f3136" data-file-name="app/admin/page.tsx">
            Usage Analytics
          </span></h2>
        </div>
        
        {/* Mock chart visualization - in a real app you'd use a charting library */}
        <div className="h-64 w-full" data-unique-id="36e7b3e9-aeff-41c3-b6c0-db88689ce8b6" data-file-name="app/admin/page.tsx">
          <div className="h-full flex items-end justify-between" data-unique-id="e5517160-52da-4bf9-8df2-dbf630c7377a" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
            {[35, 45, 30, 65, 85, 45, 30].map((value, i) => <div key={i} className="h-full flex flex-col justify-end items-center" data-unique-id="179ea9a7-0961-44b7-b0bd-ef237ca2de68" data-file-name="app/admin/page.tsx">
                <div className="w-12 bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-t" style={{
              height: `${value}%`
            }} data-unique-id="22a972b7-63a4-4c06-bb9e-ce881b686e5a" data-file-name="app/admin/page.tsx"></div>
                <span className="text-xs text-gray-400 mt-2" data-unique-id="dd1048f9-549c-4202-9b87-cd06532930e3" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>)}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-6 text-sm text-gray-400" data-unique-id="9b840ad3-0698-4da3-98ee-3119b2eadbbd" data-file-name="app/admin/page.tsx">
          <span data-unique-id="9dee3cc8-9c1e-4453-a663-4eb0d0b5eba3" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="cb73035e-72f0-4f7a-b396-ffb35ec8b1c0" data-file-name="app/admin/page.tsx">Last 7 days</span></span>
          <div className="flex items-center" data-unique-id="112388a8-080f-4f57-aead-04532f512861" data-file-name="app/admin/page.tsx">
            <span className="flex items-center mr-4" data-unique-id="e71456e9-6c27-484c-aa9a-5ca66c767a8f" data-file-name="app/admin/page.tsx">
              <SmilePlus className="h-4 w-4 mr-1 text-green-500" /><span className="editable-text" data-unique-id="306c9379-fef0-4b24-9973-c523a347a1d3" data-file-name="app/admin/page.tsx"> 32% increase
            </span></span>
            <span data-unique-id="06a8b5ea-12da-4374-a21d-414755860119" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="dfc5a18d-035a-4ab6-a2ff-ff549fd48ca6" data-file-name="app/admin/page.tsx">Total interactions: 458</span></span>
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
  }} className={`${color} rounded-xl shadow-lg p-6 flex items-center`} data-unique-id="fd5a3777-7b3a-4af1-a8f9-c52cde33eb5c" data-file-name="app/admin/page.tsx">
      <div className="p-4 bg-white/10 rounded-xl" data-unique-id="9fbe1a4b-950e-4afc-88e8-886783d797d0" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
        {icon}
      </div>
      <div className="ml-4" data-unique-id="b2070191-f489-4c56-9bec-0f65fd7a3bf3" data-file-name="app/admin/page.tsx">
        <h3 className="text-gray-100 text-sm font-medium" data-unique-id="0258ee16-bd7a-4853-8701-8f9fc54c0d4c" data-file-name="app/admin/page.tsx" data-dynamic-text="true">{title}</h3>
        <p className="text-white text-2xl font-bold" data-unique-id="dc73ece7-d11b-4cd4-abcd-d314dc6437f7" data-file-name="app/admin/page.tsx" data-dynamic-text="true">{value.toLocaleString()}</p>
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
  return <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg" data-unique-id="ea0ad8ec-fa73-481c-914d-9335b95d18bb" data-file-name="app/admin/page.tsx">
      <div className="flex items-center" data-unique-id="b477b3a7-8ebb-4fa7-839a-716b4de7c138" data-file-name="app/admin/page.tsx">
        <span className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3" data-unique-id="4b156349-5a3f-41f1-8702-b88480217cc8" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
          {icon}
        </span>
        <div data-unique-id="f503339f-cfcf-4f46-b6dc-77a25fdbc881" data-file-name="app/admin/page.tsx">
          <div className="font-medium text-gray-200" data-unique-id="413a5e24-11eb-4413-88e4-85ad0379178b" data-file-name="app/admin/page.tsx" data-dynamic-text="true">{name}</div>
          <div className="text-xs text-gray-400" data-unique-id="bb073add-5375-43d4-9821-bb73f259b292" data-file-name="app/admin/page.tsx" data-dynamic-text="true">{count.toLocaleString()}<span className="editable-text" data-unique-id="6bf2a07b-cd26-418b-968b-af778d67bd38" data-file-name="app/admin/page.tsx"> records</span></div>
        </div>
      </div>
      <div className={`flex items-center text-sm ${isPending ? 'text-amber-400' : 'text-green-400'}`} data-unique-id="e9b7b3c5-fe09-4d5c-adfc-8d4d88b6df96" data-file-name="app/admin/page.tsx" data-dynamic-text="true">
        {isPending ? <XCircle className="h-4 w-4 mr-1" /> : <CheckCircle2 className="h-4 w-4 mr-1" />}
        {status}
      </div>
    </div>;
}