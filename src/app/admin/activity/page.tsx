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
  return <div className="space-y-6" data-unique-id="a12589ec-f53e-4151-b01f-ba9663fa468b" data-file-name="app/admin/activity/page.tsx">
      <div className="flex justify-between items-center" data-unique-id="f01bc33d-fd48-4feb-8ab0-71a937cb6c56" data-file-name="app/admin/activity/page.tsx">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3" data-unique-id="e4ce0045-231f-4847-bf4e-5cccc19665f8" data-file-name="app/admin/activity/page.tsx">
          <Activity className="h-8 w-8 text-indigo-400" /><span className="editable-text" data-unique-id="10dcfe52-a5cc-499c-8692-5e3e317bd872" data-file-name="app/admin/activity/page.tsx">
          User Activity Logs
        </span></h1>
        
        <div className="flex gap-2" data-unique-id="9f89fd4a-163f-4a77-95b5-7286e0ddc97c" data-file-name="app/admin/activity/page.tsx">
          <button onClick={() => fetchAllLogs()} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center" data-unique-id="8075cba4-537b-40ab-8c2b-2b6f1be64139" data-file-name="app/admin/activity/page.tsx">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /><span className="editable-text" data-unique-id="34ee6f6c-b573-4a99-973d-fd0e925f051b" data-file-name="app/admin/activity/page.tsx">
            Refresh
          </span></button>
          
          <button onClick={exportLogs} className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center" data-unique-id="e73a0b36-f1d9-4b31-9570-b4d6ce8c4334" data-file-name="app/admin/activity/page.tsx">
            <Download className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="be6385a7-3c26-4b39-9dfe-8b6115a4b601" data-file-name="app/admin/activity/page.tsx">
            Export CSV
          </span></button>
          
          <button onClick={() => {
          if (window.confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
            clearLogs();
          }
        }} className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center" data-unique-id="6dd878eb-0e8c-466f-9185-26dd1754b56f" data-file-name="app/admin/activity/page.tsx">
            <Trash2 className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="316f2953-a507-45f7-b697-dcc7aa2fcdbd" data-file-name="app/admin/activity/page.tsx">
            Clear Logs
          </span></button>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="f5398151-53b6-4cbf-bb7c-2035bcd0a18d" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
        <div className="flex flex-wrap gap-4 mb-6" data-unique-id="c89c8447-d454-417f-8598-fd5fe6a693d9" data-file-name="app/admin/activity/page.tsx">
          <div className="flex-1" data-unique-id="907b9eb0-88b0-4551-8175-5e84dd04c944" data-file-name="app/admin/activity/page.tsx">
            <div className="relative" data-unique-id="a7cb1d65-7843-4c4b-99c6-7c811739b5b1" data-file-name="app/admin/activity/page.tsx">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input type="text" value={searchTerm} onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }} placeholder="Search logs by action, user, or details..." className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" data-unique-id="d0d4d032-e67b-4eed-9c80-e8d100c3768e" data-file-name="app/admin/activity/page.tsx" />
            </div>
          </div>
          
          <div className="flex gap-2" data-unique-id="2a15ab50-bd26-4c9f-9b89-d1b7c1ae328b" data-file-name="app/admin/activity/page.tsx">
            <div className="w-48" data-unique-id="b551eece-5cef-4ef4-abcc-f353602b4394" data-file-name="app/admin/activity/page.tsx">
              <div className="flex items-center bg-gray-700 border border-gray-600 rounded-lg overflow-hidden" data-unique-id="bf5c19a8-5ffe-4754-9331-267ae1569062" data-file-name="app/admin/activity/page.tsx">
                <Filter className="ml-3 text-gray-400 h-4 w-4" />
                <select value={filter} onChange={e => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }} className="w-full bg-transparent text-white py-2.5 pl-2 pr-8 appearance-none focus:outline-none" data-unique-id="3ecfaf74-3dd3-4764-98ac-3614c9657179" data-file-name="app/admin/activity/page.tsx">
                  <option value="all" data-unique-id="253ec304-5016-4af9-b523-5b3e2fe2a8af" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="d14c3fda-9103-40da-b0f2-658971b7fc2e" data-file-name="app/admin/activity/page.tsx">All Activities</span></option>
                  <option value="email" data-unique-id="4fe7e354-e26c-47d5-ab66-1f4bf496a504" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="8669b660-c2ca-45bb-ac43-aef06f8260ad" data-file-name="app/admin/activity/page.tsx">Email Activities</span></option>
                  <option value="order" data-unique-id="ed24296e-da28-4fb0-a84b-c76435d666c9" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="7bf25771-1311-4aca-b9f1-4f8bbfca6cda" data-file-name="app/admin/activity/page.tsx">Order Activities</span></option>
                  <option value="user" data-unique-id="f90f9c92-fb34-4567-b629-18e868e24a5e" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="b98d118d-11d3-4f18-b153-911ea526a4a0" data-file-name="app/admin/activity/page.tsx">User Activities</span></option>
                  <option value="auth" data-unique-id="d1c41e48-ea58-4581-bc23-e2ec909447d9" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="0b849265-4d3e-4166-9e88-d3c34878e856" data-file-name="app/admin/activity/page.tsx">Authentication</span></option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {isLoading ? <div className="flex flex-col items-center justify-center py-12" data-unique-id="60c0c6ff-9c7e-44b0-865b-427dc7c55962" data-file-name="app/admin/activity/page.tsx">
            <RefreshCw className="h-12 w-12 animate-spin text-indigo-500 mb-4" />
            <p className="text-gray-400" data-unique-id="efdf3148-32b1-41a5-8f22-d0a80ab5db07" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="97b3b4b5-1852-4730-82b3-4e53336279aa" data-file-name="app/admin/activity/page.tsx">Loading activity logs...</span></p>
          </div> : paginatedLogs.length > 0 ? <>
            <div className="overflow-x-auto" data-unique-id="5af13a38-df69-45b6-a164-fd6daf82e5b4" data-file-name="app/admin/activity/page.tsx">
              <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden" data-unique-id="a6910731-8822-4281-81da-e3d6fadca24c" data-file-name="app/admin/activity/page.tsx">
                <thead className="bg-gray-700" data-unique-id="692e412e-fb74-404c-975c-68fd70890b7e" data-file-name="app/admin/activity/page.tsx">
                  <tr data-unique-id="b784db01-45f8-432d-8162-336d97ee00bb" data-file-name="app/admin/activity/page.tsx">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" data-unique-id="9657fae6-4e9c-4914-b745-d5e4af8c1ccf" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="2c2f1ba1-124b-4a5a-bbd2-1245b28c9949" data-file-name="app/admin/activity/page.tsx">User</span></th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" data-unique-id="6ec99fe0-e5a4-472d-acfc-86db91202bb9" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="db0834a4-c08a-4fe9-b721-b543291fa0ac" data-file-name="app/admin/activity/page.tsx">Action</span></th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" data-unique-id="5e51f73d-5b2b-4b72-8a29-0b014dddef4a" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="2c462df9-5821-4ba6-9ba7-08a542d1ad85" data-file-name="app/admin/activity/page.tsx">Details</span></th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" data-unique-id="976b7603-fec2-4190-b7b1-ca9dbe57a2e7" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="e9920117-ec86-4209-bf8f-67c54126e1d2" data-file-name="app/admin/activity/page.tsx">Timestamp</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700" data-unique-id="c9b03f64-98ff-4300-a6e2-6a51e3b23d6c" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
                  {paginatedLogs.map((log, index) => <ActivityLogRow key={log.id || index} log={log} data-unique-id="fbee93af-03f4-46ae-86ae-0f1513e1fcd6" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true" />)}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-6" data-unique-id="8a062020-350a-4645-8bda-0899ee2385d5" data-file-name="app/admin/activity/page.tsx">
              <div className="text-sm text-gray-400" data-unique-id="2e009b00-47a8-4886-ac7d-910f94f3db60" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="383b9fa2-9a22-4f5c-a68f-2c6263dbfe3a" data-file-name="app/admin/activity/page.tsx">
                Showing </span>{(currentPage - 1) * itemsPerPage + 1}<span className="editable-text" data-unique-id="56e0e83d-11af-4c95-8fad-53f03a174ab8" data-file-name="app/admin/activity/page.tsx"> to </span>{Math.min(currentPage * itemsPerPage, filteredLogs.length)}<span className="editable-text" data-unique-id="07710686-6b67-4325-b5a2-a78a10c40b7a" data-file-name="app/admin/activity/page.tsx"> of </span>{filteredLogs.length}<span className="editable-text" data-unique-id="a0d041e0-4818-4da2-99c6-0cd6b54dad3e" data-file-name="app/admin/activity/page.tsx"> logs
              </span></div>
              
              <div className="flex gap-2" data-unique-id="587a1161-784f-4f08-9912-bf736bc97ee1" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed" data-unique-id="7d34138e-73b7-419b-a956-c86e8596ba77" data-file-name="app/admin/activity/page.tsx">
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
              return <button key={pageNum} onClick={() => handlePageChange(pageNum)} className={`w-10 h-10 rounded-md ${currentPage === pageNum ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`} data-unique-id="073a30cd-e0f8-4354-8b5c-7d4bbe9a0bde" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
                      {pageNum}
                    </button>;
            })}
                
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed" data-unique-id="15952c63-ae5e-41c0-a66c-13d5fdf6f0dd" data-file-name="app/admin/activity/page.tsx">
                  <ChevronRight className="h-5 w-5 text-gray-300" />
                </button>
              </div>
            </div>
          </> : <div className="flex flex-col items-center justify-center py-12" data-unique-id="e77a2d3e-4b80-4e17-b002-1652039305c2" data-file-name="app/admin/activity/page.tsx">
            <AlertCircle className="h-12 w-12 text-gray-500 mb-4" />
            <p className="text-gray-400 mb-2" data-unique-id="c9055760-338d-499b-8475-898566d7bba6" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="eb0e8020-cfd0-4a82-a1df-ad23e823e9df" data-file-name="app/admin/activity/page.tsx">No activity logs found</span></p>
            <p className="text-gray-500 text-sm" data-unique-id="6a87237c-80d5-4a3e-a72d-5ab20be4b292" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="b613cfd3-4659-4d28-a9c9-e475e10ed2a3" data-file-name="app/admin/activity/page.tsx">Try adjusting your search terms or filters</span></p>
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
  }} className="hover:bg-gray-700/50 cursor-pointer" onClick={() => hasDetails && setExpanded(!expanded)} data-unique-id="73932c2e-850c-4dff-b750-7a64fc982ce3" data-file-name="app/admin/activity/page.tsx">
      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="5f1f6a31-ec67-471e-bd3e-9d65c2d5c71c" data-file-name="app/admin/activity/page.tsx">
        <div className="flex items-center" data-unique-id="97ffb9f9-b2dc-41a1-883c-f4fc5fd6c5a3" data-file-name="app/admin/activity/page.tsx">
          <div className="h-8 w-8 rounded-full bg-indigo-700/20 flex items-center justify-center mr-3" data-unique-id="7877e142-7b60-4090-8bf8-3e19421eca48" data-file-name="app/admin/activity/page.tsx">
            <User className="h-4 w-4 text-indigo-400" />
          </div>
          <div data-unique-id="e6928266-9146-4551-ac59-72901e0a66c2" data-file-name="app/admin/activity/page.tsx">
            <div className="text-sm font-medium text-white" data-unique-id="5e5eebd6-8b3b-40a1-ae68-6d26d5d72747" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
              {log.user_email || 'Anonymous'}
            </div>
            <div className="text-xs text-gray-400" data-unique-id="d0d5a5cd-345f-41b7-8634-c74d8ec64f05" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
              {log.user_id || 'No ID'}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4" data-unique-id="e5b9664c-9206-40a0-a3d9-4ab8901863d9" data-file-name="app/admin/activity/page.tsx">
        <div className="text-sm text-white" data-unique-id="faffb506-822e-4309-8186-4f9b5ee33e6e" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">{log.action}</div>
      </td>
      <td className="px-6 py-4" data-unique-id="6019b860-a742-40b6-8e5f-f0153bb08ebe" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
        {hasDetails ? <div className="text-sm" data-unique-id="9bb3b433-86c8-4335-bf7e-6b519080da71" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
            <button className="text-indigo-400 hover:text-indigo-300 flex items-center" data-unique-id="e0632c18-2571-498f-8d9b-b8e6c8172e8f" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
              {expanded ? 'Hide' : 'Show'}<span className="editable-text" data-unique-id="7eb2a79e-954f-4295-834e-0ed05716d2fd" data-file-name="app/admin/activity/page.tsx"> Details
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
        }} className="mt-2 bg-gray-900/50 p-3 rounded text-xs text-gray-300 max-w-lg" data-unique-id="a8189aea-ee57-445c-bb81-a25977aeada0" data-file-name="app/admin/activity/page.tsx">
                <div className="space-y-1" data-unique-id="e267c896-9617-4b88-ba1d-c0d6e0e91a38" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
                  {Object.entries(log.details).map(([key, value]) => <div key={key} data-unique-id="44e39a89-e103-46b8-a66d-5d5afee691c0" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
                      <span className="text-gray-400" data-unique-id="9cb6f54d-7089-4fe2-8a35-ec058da21f8c" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">{key}<span className="editable-text" data-unique-id="eac1dc3d-7aa9-45e0-90eb-90237fec0ae4" data-file-name="app/admin/activity/page.tsx">: </span></span>
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </div>)}
                </div>
              </motion.div>}
          </div> : <span className="text-sm text-gray-500" data-unique-id="d93f5514-9a82-4376-94b6-f00ce4edff53" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="dab8211f-a6fb-41cf-901a-91679da30de8" data-file-name="app/admin/activity/page.tsx">No details available</span></span>}
      </td>
      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="fc9a98a6-7332-41ee-9a4b-8057d6301e2f" data-file-name="app/admin/activity/page.tsx">
        <div className="flex items-center text-sm text-gray-300" data-unique-id="aa0aa169-7983-4ca0-9c5b-5eaea8be787f" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
          <Calendar className="h-4 w-4 mr-2 text-gray-400" data-unique-id="7ac48148-c367-4920-bea8-f054845dba36" data-file-name="app/admin/activity/page.tsx" />
          {formattedDate}
        </div>
      </td>
    </motion.tr>;
}