'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useActivityStore, ActivityLog } from '@/lib/activity-store';
import { Activity, Search, RefreshCw, Calendar, User, Filter, Download, Trash2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
export default function ActivityLogsPage() {
  const {
    logs,
    fetchAllLogs,
    clearLogs
  } = useActivityStore();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<string>('all');
  const itemsPerPage = 10;

  // Fetch logs when component mounts
  useEffect(() => {
    const loadLogs = async () => {
      setIsLoading(true);
      await fetchAllLogs();
      setIsLoading(false);
    };
    loadLogs();
  }, [fetchAllLogs]);

  // Filter and search logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' || log.action.toLowerCase().includes(searchTerm.toLowerCase()) || log.user_email.toLowerCase().includes(searchTerm.toLowerCase()) || JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || filter === 'email' && log.action.includes('email') || filter === 'order' && log.action.includes('order') || filter === 'user' && log.action.includes('user') || filter === 'auth' && (log.action.includes('login') || log.action.includes('logout'));
    return matchesSearch && matchesFilter;
  });

  // Paginate logs
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Export logs as CSV
  const exportLogs = () => {
    const headers = ['ID', 'User', 'Action', 'Details', 'IP Address', 'User Agent', 'Timestamp'];
    const csvRows = [headers];
    filteredLogs.forEach(log => {
      csvRows.push([log.id?.toString() || '', log.user_email, log.action, JSON.stringify(log.details), log.ip_address || '', log.user_agent || '', new Date(log.created_at).toISOString()]);
    });
    const csvContent = csvRows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `activity_logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return <div className="space-y-6" data-unique-id="44a33fb1-1b53-4c7c-89a7-05811866ab09" data-file-name="app/admin/activity/page.tsx">
      <div className="flex justify-between items-center" data-unique-id="86aef16a-54dc-4878-a296-e818799e5c08" data-file-name="app/admin/activity/page.tsx">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3" data-unique-id="06f42447-892e-45d1-82b4-23ddc1992205" data-file-name="app/admin/activity/page.tsx">
          <Activity className="h-8 w-8 text-indigo-400" /><span className="editable-text" data-unique-id="3e3638ae-d5ca-4871-8cee-4f532985ff54" data-file-name="app/admin/activity/page.tsx">
          User Activity Logs
        </span></h1>
        
        <div className="flex gap-2" data-unique-id="0205f36b-e6c2-4ba0-bc73-9d8712588524" data-file-name="app/admin/activity/page.tsx">
          <button onClick={() => fetchAllLogs()} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center" data-unique-id="8f8fc204-4480-4682-9cc6-6223f77844ba" data-file-name="app/admin/activity/page.tsx">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /><span className="editable-text" data-unique-id="955b0eda-0d62-45e5-98fe-f6d1fa46c785" data-file-name="app/admin/activity/page.tsx">
            Refresh
          </span></button>
          
          <button onClick={exportLogs} className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center" data-unique-id="2a7bbf47-0197-4b19-9696-7404ec682728" data-file-name="app/admin/activity/page.tsx">
            <Download className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="4cc965db-88fe-4870-9857-3b66a16a906a" data-file-name="app/admin/activity/page.tsx">
            Export CSV
          </span></button>
          
          <button onClick={() => {
          if (window.confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
            clearLogs();
          }
        }} className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center" data-unique-id="33bcfef3-378e-4728-a538-9dc0ece4b0e4" data-file-name="app/admin/activity/page.tsx">
            <Trash2 className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="74a39091-d855-4da4-a0ca-0fb3a5dabde2" data-file-name="app/admin/activity/page.tsx">
            Clear Logs
          </span></button>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="cf11704c-8239-40c9-b2d9-3c35a1d709f4" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
        <div className="flex flex-wrap gap-4 mb-6" data-unique-id="502f2dbc-d0e4-4bbd-8a44-c3a90ce4cc66" data-file-name="app/admin/activity/page.tsx">
          <div className="flex-1" data-unique-id="e9d10899-0065-45fb-8752-df55941f8aca" data-file-name="app/admin/activity/page.tsx">
            <div className="relative" data-unique-id="11d15ef4-c5bc-4185-9393-3bc7b069d8db" data-file-name="app/admin/activity/page.tsx">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input type="text" value={searchTerm} onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }} placeholder="Search logs by action, user, or details..." className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" data-unique-id="b2dfb4bf-43a4-4356-8ba4-06b9ae250192" data-file-name="app/admin/activity/page.tsx" />
            </div>
          </div>
          
          <div className="flex gap-2" data-unique-id="5b8dd3ef-91dc-41ee-b62c-efe2e717c513" data-file-name="app/admin/activity/page.tsx">
            <div className="w-48" data-unique-id="9ac97323-62d4-4937-8d33-f84fa6413992" data-file-name="app/admin/activity/page.tsx">
              <div className="flex items-center bg-gray-700 border border-gray-600 rounded-lg overflow-hidden" data-unique-id="50f83440-65f0-4517-b9bb-4e70eaa150c8" data-file-name="app/admin/activity/page.tsx">
                <Filter className="ml-3 text-gray-400 h-4 w-4" />
                <select value={filter} onChange={e => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }} className="w-full bg-transparent text-white py-2.5 pl-2 pr-8 appearance-none focus:outline-none" data-unique-id="b8951b57-2959-4ae7-9d3a-9ae4aaef312a" data-file-name="app/admin/activity/page.tsx">
                  <option value="all" data-unique-id="301d10e4-6623-4a29-b008-26b239603bae" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="01c5dede-5566-4396-a5fc-e2f86c71d964" data-file-name="app/admin/activity/page.tsx">All Activities</span></option>
                  <option value="email" data-unique-id="9be19f62-a923-47f6-bc7f-4f68225a179a" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="5f9a4433-7dfa-4b29-8cdc-896cc7b1c5bd" data-file-name="app/admin/activity/page.tsx">Email Activities</span></option>
                  <option value="order" data-unique-id="0419b7e0-5881-43a2-a6e5-e00c054bf971" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="a7b63b92-8a8d-43fe-b32a-ae11b362a010" data-file-name="app/admin/activity/page.tsx">Order Activities</span></option>
                  <option value="user" data-unique-id="d8106a5a-baa9-42ef-9c6e-d156cf2f584a" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="6f10ea80-480d-4c27-9374-9a3e9866cc49" data-file-name="app/admin/activity/page.tsx">User Activities</span></option>
                  <option value="auth" data-unique-id="dc6c8c14-d52f-4238-8c2e-8efa62952b01" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="8ba417b6-d30b-41c9-ab3a-5cc281203aa4" data-file-name="app/admin/activity/page.tsx">Authentication</span></option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {isLoading ? <div className="flex flex-col items-center justify-center py-12" data-unique-id="0a756c5a-a887-40d6-be3f-bdc7f9ae6802" data-file-name="app/admin/activity/page.tsx">
            <RefreshCw className="h-12 w-12 animate-spin text-indigo-500 mb-4" />
            <p className="text-gray-400" data-unique-id="659991fc-2a8c-4ec5-9f8b-7c8e469a84df" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="95360a9d-2c8e-4533-b3c0-d7faa3b4c6a2" data-file-name="app/admin/activity/page.tsx">Loading activity logs...</span></p>
          </div> : paginatedLogs.length > 0 ? <>
            <div className="overflow-x-auto" data-unique-id="09490165-3037-4a6a-9573-dabdad998c55" data-file-name="app/admin/activity/page.tsx">
              <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden" data-unique-id="b7fd5e63-d2da-434a-a860-b1153d0b37d2" data-file-name="app/admin/activity/page.tsx">
                <thead className="bg-gray-700" data-unique-id="5eef234f-cafd-48c7-9a27-9ca8c26042e4" data-file-name="app/admin/activity/page.tsx">
                  <tr data-unique-id="9b343e12-a38f-4581-a158-a1e5127dda25" data-file-name="app/admin/activity/page.tsx">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" data-unique-id="9e683413-9253-46b3-9655-08f94f7c7d0d" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="aab40d3f-29e6-4915-8688-dafec90d628e" data-file-name="app/admin/activity/page.tsx">User</span></th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" data-unique-id="61779740-09f9-4016-b996-4be9386f854a" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="d935e7f3-9516-4e6f-b237-a521ec63cca0" data-file-name="app/admin/activity/page.tsx">Action</span></th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" data-unique-id="577522c4-51c3-4ee1-841c-5e5f5f2a5b05" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="484b43dd-e3d6-4ece-a996-7f6f45e07ca6" data-file-name="app/admin/activity/page.tsx">Details</span></th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" data-unique-id="f652c8a7-c647-43f3-a501-f013e56ecc8e" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="a465e58b-bfc2-41c1-8756-6ee60f634a0b" data-file-name="app/admin/activity/page.tsx">Timestamp</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700" data-unique-id="af40906e-405e-4715-85fb-307608d0da0a" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
                  {paginatedLogs.map((log, index) => <ActivityLogRow key={log.id || index} log={log} data-unique-id="8e404037-e3a9-4924-bc91-ed0d7c9f55b9" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true" />)}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-6" data-unique-id="d2d7a1c5-e6f6-4328-b7d7-4d62c9296e59" data-file-name="app/admin/activity/page.tsx">
              <div className="text-sm text-gray-400" data-unique-id="f906c07a-0ca0-445e-9edc-411b958155b8" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="4e702b03-5430-4ca5-954f-402d4b0f327f" data-file-name="app/admin/activity/page.tsx">
                Showing </span>{(currentPage - 1) * itemsPerPage + 1}<span className="editable-text" data-unique-id="169454ac-09fe-4e3d-949c-2fdd8ade07f4" data-file-name="app/admin/activity/page.tsx"> to </span>{Math.min(currentPage * itemsPerPage, filteredLogs.length)}<span className="editable-text" data-unique-id="3038365f-227a-4d48-a588-d0000163209e" data-file-name="app/admin/activity/page.tsx"> of </span>{filteredLogs.length}<span className="editable-text" data-unique-id="74ce4df3-9357-473f-93f6-62bf0c91d0c5" data-file-name="app/admin/activity/page.tsx"> logs
              </span></div>
              
              <div className="flex gap-2" data-unique-id="6d51e7b9-78bb-423e-9f2a-b1619c4bfceb" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed" data-unique-id="b5137cb1-acb9-491a-ba1f-9fb48e59bdfb" data-file-name="app/admin/activity/page.tsx">
                  <ChevronLeft className="h-5 w-5 text-gray-300" />
                </button>
                
                {Array.from({
              length: Math.min(5, totalPages)
            }).map((_, i) => {
              // Show pages around the current page
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              if (pageNum > totalPages) return null;
              return <button key={pageNum} onClick={() => handlePageChange(pageNum)} className={`w-10 h-10 rounded-md ${currentPage === pageNum ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`} data-unique-id="006442be-e7cf-4e13-87f9-db82a9def7cf" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
                      {pageNum}
                    </button>;
            })}
                
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed" data-unique-id="65ab9a04-66ef-409c-bcca-52caec64c902" data-file-name="app/admin/activity/page.tsx">
                  <ChevronRight className="h-5 w-5 text-gray-300" />
                </button>
              </div>
            </div>
          </> : <div className="flex flex-col items-center justify-center py-12" data-unique-id="1a74eb8f-7ce9-483f-bb32-402e8865d79b" data-file-name="app/admin/activity/page.tsx">
            <AlertCircle className="h-12 w-12 text-gray-500 mb-4" />
            <p className="text-gray-400 mb-2" data-unique-id="f9d500e6-de69-4742-85eb-d4e8f23848a1" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="02587e16-18aa-4c96-ba60-6919f18c269d" data-file-name="app/admin/activity/page.tsx">No activity logs found</span></p>
            <p className="text-gray-500 text-sm" data-unique-id="ecd7e205-1854-4b95-b9ae-d05be42c7faa" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="5b36b017-d168-4318-8d24-ad82392eaa7c" data-file-name="app/admin/activity/page.tsx">Try adjusting your search terms or filters</span></p>
          </div>}
      </div>
    </div>;
}
function ActivityLogRow({
  log
}: {
  log: ActivityLog;
}) {
  const [expanded, setExpanded] = useState(false);

  // Format the timestamp
  const formattedDate = new Date(log.created_at).toLocaleString();

  // Determine if the details object has meaningful content
  const hasDetails = log.details && Object.keys(log.details).length > 0;
  return <motion.tr initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} transition={{
    duration: 0.3
  }} className="hover:bg-gray-700/50 cursor-pointer" onClick={() => hasDetails && setExpanded(!expanded)} data-unique-id="3b9b5c7a-7c55-4657-8cbc-75010b39992c" data-file-name="app/admin/activity/page.tsx">
      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="7e8e51ab-9ed1-49bb-847b-b8e10e250e53" data-file-name="app/admin/activity/page.tsx">
        <div className="flex items-center" data-unique-id="756ffdfc-a5f6-4412-aa03-33f34c34d64f" data-file-name="app/admin/activity/page.tsx">
          <div className="h-8 w-8 rounded-full bg-indigo-700/20 flex items-center justify-center mr-3" data-unique-id="a13b88cc-cc94-437b-a4de-03e229c1a488" data-file-name="app/admin/activity/page.tsx">
            <User className="h-4 w-4 text-indigo-400" />
          </div>
          <div data-unique-id="55265aa5-ddfb-44b8-bc99-20d94ee4bcea" data-file-name="app/admin/activity/page.tsx">
            <div className="text-sm font-medium text-white" data-unique-id="2e325842-9bf2-4374-bed5-c7defe74a84c" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
              {log.user_email || 'Anonymous'}
            </div>
            <div className="text-xs text-gray-400" data-unique-id="fa40ca98-a4a8-4d88-8e95-c842cfca3785" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
              {log.user_id || 'No ID'}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4" data-unique-id="50161726-81e2-4e2e-a1ac-15e22557f4a3" data-file-name="app/admin/activity/page.tsx">
        <div className="text-sm text-white" data-unique-id="1b1536a4-cee1-4ef4-be11-ce69ed0e639d" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">{log.action}</div>
      </td>
      <td className="px-6 py-4" data-unique-id="9ecee441-432e-4fe7-a545-3aeed669b8e2" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
        {hasDetails ? <div className="text-sm" data-unique-id="31e4b7e7-e81e-494d-81ac-7df75ea828f0" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
            <button className="text-indigo-400 hover:text-indigo-300 flex items-center" data-unique-id="b3b52f94-f464-47df-8ee7-7139cbb73024" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
              {expanded ? 'Hide' : 'Show'}<span className="editable-text" data-unique-id="c3967127-360a-4d0b-a850-c9aadda6260c" data-file-name="app/admin/activity/page.tsx"> Details
            </span></button>
            
            {expanded && <motion.div initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: 'auto'
        }} exit={{
          opacity: 0,
          height: 0
        }} className="mt-2 bg-gray-900/50 p-3 rounded text-xs text-gray-300 max-w-lg" data-unique-id="ccb936e2-9eb1-49a9-bd4b-2787cdff6607" data-file-name="app/admin/activity/page.tsx">
                <div className="space-y-1" data-unique-id="c5108220-2ae1-4b09-bf6d-80d597436996" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
                  {Object.entries(log.details).map(([key, value]) => <div key={key} data-unique-id="d26a09a5-b6f4-41f8-9247-4a89e84d9df5" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
                      <span className="text-gray-400" data-unique-id="deb5bff5-0f5d-461f-b324-b70bf74f769a" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">{key}<span className="editable-text" data-unique-id="090e4766-e0f5-4d84-a425-6c72112fa581" data-file-name="app/admin/activity/page.tsx">: </span></span>
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </div>)}
                </div>
              </motion.div>}
          </div> : <span className="text-sm text-gray-500" data-unique-id="e43194ef-462b-4058-b31f-c0bdf0b08d0d" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="15f7e63c-091b-435d-879c-b318758dde2e" data-file-name="app/admin/activity/page.tsx">No details available</span></span>}
      </td>
      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="8abee91a-6c38-4058-825d-0d8d46f40d67" data-file-name="app/admin/activity/page.tsx">
        <div className="flex items-center text-sm text-gray-300" data-unique-id="c515660c-1d3e-4e0d-9f62-1557e7fa905a" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
          <Calendar className="h-4 w-4 mr-2 text-gray-400" data-unique-id="6b1278b3-f8dc-4bf1-b670-27f0eca90beb" data-file-name="app/admin/activity/page.tsx" />
          {formattedDate}
        </div>
      </td>
    </motion.tr>;
}