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
  return <div className="space-y-6" data-unique-id="189ed3e0-0ccd-4d76-8534-ef3bbe491a61" data-file-name="app/admin/activity/page.tsx">
      <div className="flex justify-between items-center" data-unique-id="373fa9a9-303c-4ff5-8804-c7cea8da551d" data-file-name="app/admin/activity/page.tsx">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3" data-unique-id="172969a9-4550-492b-9997-fe19ba7c13ff" data-file-name="app/admin/activity/page.tsx">
          <Activity className="h-8 w-8 text-indigo-400" /><span className="editable-text" data-unique-id="26f2801f-4fb0-4760-9121-bc9384287ecd" data-file-name="app/admin/activity/page.tsx">
          User Activity Logs
        </span></h1>
        
        <div className="flex gap-2" data-unique-id="7dc76a3d-5131-4255-95d4-335f8e685bf5" data-file-name="app/admin/activity/page.tsx">
          <button onClick={() => fetchAllLogs()} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center" data-unique-id="da642553-cd5d-4bcd-8f3d-e446abfc09ec" data-file-name="app/admin/activity/page.tsx">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /><span className="editable-text" data-unique-id="20b172a5-ccec-4be3-9da4-5d52cbf8af95" data-file-name="app/admin/activity/page.tsx">
            Refresh
          </span></button>
          
          <button onClick={exportLogs} className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center" data-unique-id="a0770732-4b89-4502-a7fd-dea8da4db6d8" data-file-name="app/admin/activity/page.tsx">
            <Download className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="14cbd12a-2c18-450c-8fac-2610148341b2" data-file-name="app/admin/activity/page.tsx">
            Export CSV
          </span></button>
          
          <button onClick={() => {
          if (window.confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
            clearLogs();
          }
        }} className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center" data-unique-id="93d51a99-4c41-4fbe-acd8-1ee08c070350" data-file-name="app/admin/activity/page.tsx">
            <Trash2 className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="5f2ccf20-ea3e-4046-85bd-9841781ed92c" data-file-name="app/admin/activity/page.tsx">
            Clear Logs
          </span></button>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="67ea7bc9-f02b-497b-b797-8645ba2ccb0c" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
        <div className="flex flex-wrap gap-4 mb-6" data-unique-id="074791fc-d323-49e1-bc2b-67406e8ece37" data-file-name="app/admin/activity/page.tsx">
          <div className="flex-1" data-unique-id="7c92f33d-f3e1-49ad-ba4a-73143a483bcb" data-file-name="app/admin/activity/page.tsx">
            <div className="relative" data-unique-id="09a8c396-ae8e-48be-88f4-283e29615daa" data-file-name="app/admin/activity/page.tsx">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input type="text" value={searchTerm} onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }} placeholder="Search logs by action, user, or details..." className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" data-unique-id="caf63814-6a55-4890-b4cf-ccbd4b4638ca" data-file-name="app/admin/activity/page.tsx" />
            </div>
          </div>
          
          <div className="flex gap-2" data-unique-id="cb7077c0-4266-48e2-8769-496839f15cd6" data-file-name="app/admin/activity/page.tsx">
            <div className="w-48" data-unique-id="8184e993-a65f-4054-9e1f-d586ed80eeae" data-file-name="app/admin/activity/page.tsx">
              <div className="flex items-center bg-gray-700 border border-gray-600 rounded-lg overflow-hidden" data-unique-id="c0b5bc84-c524-4404-b487-17f165af8c3c" data-file-name="app/admin/activity/page.tsx">
                <Filter className="ml-3 text-gray-400 h-4 w-4" />
                <select value={filter} onChange={e => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }} className="w-full bg-transparent text-white py-2.5 pl-2 pr-8 appearance-none focus:outline-none" data-unique-id="5c77e30d-57ca-4d12-b375-1e26c373b249" data-file-name="app/admin/activity/page.tsx">
                  <option value="all" data-unique-id="c93192aa-e1d8-4f97-ba10-8e0d5af3b966" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="fad6a645-9211-423f-be98-2e548f40c4ee" data-file-name="app/admin/activity/page.tsx">All Activities</span></option>
                  <option value="email" data-unique-id="d02630b7-9d64-47d2-86f0-bab4e27c36f7" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="69e31c0a-9147-40fb-a62f-d6c7c7ab39cc" data-file-name="app/admin/activity/page.tsx">Email Activities</span></option>
                  <option value="order" data-unique-id="9b91d194-9241-471a-b92e-86345f9f1ebb" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="c8a94e7f-e4e1-4fd4-8914-c0c350d1a4aa" data-file-name="app/admin/activity/page.tsx">Order Activities</span></option>
                  <option value="user" data-unique-id="9f516457-c47d-4b65-bddb-b1d866abfaf9" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="9b8bb402-a999-40b4-b30b-bc3f50fc3f3d" data-file-name="app/admin/activity/page.tsx">User Activities</span></option>
                  <option value="auth" data-unique-id="7f6b114d-9eaf-4cc7-a815-e3604b7af640" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="e1aec35b-168e-4910-829c-8fc30ad309f8" data-file-name="app/admin/activity/page.tsx">Authentication</span></option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {isLoading ? <div className="flex flex-col items-center justify-center py-12" data-unique-id="e8e0a8e5-d07f-4092-9176-537388a4842e" data-file-name="app/admin/activity/page.tsx">
            <RefreshCw className="h-12 w-12 animate-spin text-indigo-500 mb-4" />
            <p className="text-gray-400" data-unique-id="7f33aa60-4e75-401d-a575-2e53b1e76376" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="64915c9a-3d6e-4138-a1c2-86a07d3f24da" data-file-name="app/admin/activity/page.tsx">Loading activity logs...</span></p>
          </div> : paginatedLogs.length > 0 ? <>
            <div className="overflow-x-auto" data-unique-id="ae4b2d08-56b9-4655-8529-df95bfb3949f" data-file-name="app/admin/activity/page.tsx">
              <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden" data-unique-id="abfeef14-2f87-4caa-9780-8d5e7ddb0db0" data-file-name="app/admin/activity/page.tsx">
                <thead className="bg-gray-700" data-unique-id="b0d0d998-c7df-47ed-9f62-de8de031c7df" data-file-name="app/admin/activity/page.tsx">
                  <tr data-unique-id="b571925c-5d7c-424d-8904-26a065334ff6" data-file-name="app/admin/activity/page.tsx">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" data-unique-id="402b3961-d380-479d-aa67-5c1754112ed0" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="d49324ed-8a0b-43e5-a953-533bf7fbbfbe" data-file-name="app/admin/activity/page.tsx">User</span></th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" data-unique-id="4b7db908-6bfb-4fbb-82d2-af59448e7c99" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="a2a5c27b-42a3-4a4e-a9fc-875a64b2e3a1" data-file-name="app/admin/activity/page.tsx">Action</span></th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" data-unique-id="06118e14-0cfb-447f-9222-23b02f029352" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="e07fb5c7-1782-4d8f-80fa-1a31f23d6908" data-file-name="app/admin/activity/page.tsx">Details</span></th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" data-unique-id="1bf50e99-55df-47aa-9256-143958cd189d" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="b3c8acce-8a21-42f4-ac11-5be779d94dc6" data-file-name="app/admin/activity/page.tsx">Timestamp</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700" data-unique-id="174ee930-4987-4b28-81d0-7c1b57b92c2c" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
                  {paginatedLogs.map((log, index) => <ActivityLogRow key={log.id || index} log={log} data-unique-id="dae9ecc6-6b39-4e51-9c6b-d54ee72a6a2d" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true" />)}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-6" data-unique-id="a86cee24-2826-4c0e-9f78-bd95c0fbb0f6" data-file-name="app/admin/activity/page.tsx">
              <div className="text-sm text-gray-400" data-unique-id="7d9052c4-4744-4d97-9dff-cdd8d319eedb" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="cf51c513-90a1-43f6-8e80-353e3613bc6b" data-file-name="app/admin/activity/page.tsx">
                Showing </span>{(currentPage - 1) * itemsPerPage + 1}<span className="editable-text" data-unique-id="bfde6da5-9cc7-46c7-a785-c513c8e354a9" data-file-name="app/admin/activity/page.tsx"> to </span>{Math.min(currentPage * itemsPerPage, filteredLogs.length)}<span className="editable-text" data-unique-id="6601f06e-4ad5-4a62-b6b8-b62507296b9b" data-file-name="app/admin/activity/page.tsx"> of </span>{filteredLogs.length}<span className="editable-text" data-unique-id="b18f2492-feae-42b2-a193-fce5a7a19122" data-file-name="app/admin/activity/page.tsx"> logs
              </span></div>
              
              <div className="flex gap-2" data-unique-id="010897c8-7836-4bf1-85ce-50ac7f7b80e3" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed" data-unique-id="04dac934-52f7-49de-983b-6ef5f8d3d6f7" data-file-name="app/admin/activity/page.tsx">
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
              return <button key={pageNum} onClick={() => handlePageChange(pageNum)} className={`w-10 h-10 rounded-md ${currentPage === pageNum ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`} data-unique-id="bba3290b-58ea-49f5-90a2-4b1fecf14646" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
                      {pageNum}
                    </button>;
            })}
                
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed" data-unique-id="168c188b-9c57-4106-a394-0c833054a284" data-file-name="app/admin/activity/page.tsx">
                  <ChevronRight className="h-5 w-5 text-gray-300" />
                </button>
              </div>
            </div>
          </> : <div className="flex flex-col items-center justify-center py-12" data-unique-id="2e36772f-dc88-4cb0-9448-f588b31bf091" data-file-name="app/admin/activity/page.tsx">
            <AlertCircle className="h-12 w-12 text-gray-500 mb-4" />
            <p className="text-gray-400 mb-2" data-unique-id="14013072-133e-4035-b5e5-f3e6ec67b141" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="38e0f365-163e-4e2b-886b-d7426a4ded28" data-file-name="app/admin/activity/page.tsx">No activity logs found</span></p>
            <p className="text-gray-500 text-sm" data-unique-id="c3e87a9e-bbea-40ca-bdb8-1572a02033d9" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="3398735d-e1f4-43ab-a235-55e20c36af42" data-file-name="app/admin/activity/page.tsx">Try adjusting your search terms or filters</span></p>
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
  }} className="hover:bg-gray-700/50 cursor-pointer" onClick={() => hasDetails && setExpanded(!expanded)} data-unique-id="aad267da-55b3-4816-ae2d-6d2008704b7d" data-file-name="app/admin/activity/page.tsx">
      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="92ebadf8-bae4-43b6-ae5c-8e801394028d" data-file-name="app/admin/activity/page.tsx">
        <div className="flex items-center" data-unique-id="4c282708-531e-4838-8219-7c81622ed807" data-file-name="app/admin/activity/page.tsx">
          <div className="h-8 w-8 rounded-full bg-indigo-700/20 flex items-center justify-center mr-3" data-unique-id="bec31d72-8799-4d83-a268-af64f04dc553" data-file-name="app/admin/activity/page.tsx">
            <User className="h-4 w-4 text-indigo-400" />
          </div>
          <div data-unique-id="5e9a839f-47d7-48cf-a7dc-ba09468786cb" data-file-name="app/admin/activity/page.tsx">
            <div className="text-sm font-medium text-white" data-unique-id="bf254217-907a-4c66-be05-bc6e748fe017" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
              {log.user_email || 'Anonymous'}
            </div>
            <div className="text-xs text-gray-400" data-unique-id="bfc87f94-f36d-4114-90f0-761f85fd1810" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
              {log.user_id || 'No ID'}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4" data-unique-id="2dcf5e7e-e953-4359-b891-50e603b9d717" data-file-name="app/admin/activity/page.tsx">
        <div className="text-sm text-white" data-unique-id="16b3dcef-7e6a-4acb-ad0f-74dc0be10f48" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">{log.action}</div>
      </td>
      <td className="px-6 py-4" data-unique-id="f19db4b0-2b96-4990-8085-10254b4df1c6" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
        {hasDetails ? <div className="text-sm" data-unique-id="1d9b028e-9220-4b7e-a52d-87cd3bf0d9e4" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
            <button className="text-indigo-400 hover:text-indigo-300 flex items-center" data-unique-id="1dec84a6-b2de-479b-8726-6a7cfb9bc7f6" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
              {expanded ? 'Hide' : 'Show'}<span className="editable-text" data-unique-id="d602b500-3eee-4806-9f1b-5c29515a3a81" data-file-name="app/admin/activity/page.tsx"> Details
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
        }} className="mt-2 bg-gray-900/50 p-3 rounded text-xs text-gray-300 max-w-lg" data-unique-id="88ded845-f306-4269-9495-5f341c6b3e1f" data-file-name="app/admin/activity/page.tsx">
                <div className="space-y-1" data-unique-id="bdfee578-f552-4876-a8b3-743ddb6c0467" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
                  {Object.entries(log.details).map(([key, value]) => <div key={key} data-unique-id="11b9de31-9523-4aea-8f30-6d2fa4f1dd9a" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
                      <span className="text-gray-400" data-unique-id="9b6601d0-cf32-4841-ac69-148c5a4494e6" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">{key}<span className="editable-text" data-unique-id="18188a05-1218-4cd0-958f-b9f984e31829" data-file-name="app/admin/activity/page.tsx">: </span></span>
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </div>)}
                </div>
              </motion.div>}
          </div> : <span className="text-sm text-gray-500" data-unique-id="fcc3d07d-4734-4da6-8ae7-20ebd7b10858" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="d8201949-2622-4a82-a65d-54f56b28b01d" data-file-name="app/admin/activity/page.tsx">No details available</span></span>}
      </td>
      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="96c772a8-8060-41b6-a584-d7e6efe6e826" data-file-name="app/admin/activity/page.tsx">
        <div className="flex items-center text-sm text-gray-300" data-unique-id="3d60a29c-7a9a-42e8-bdd4-b763276795fd" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
          <Calendar className="h-4 w-4 mr-2 text-gray-400" data-unique-id="9e8d8b8f-8209-4651-8ce1-c2aa5ce24cfc" data-file-name="app/admin/activity/page.tsx" />
          {formattedDate}
        </div>
      </td>
    </motion.tr>;
}