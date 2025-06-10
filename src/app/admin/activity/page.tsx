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
  return <div className="space-y-6" data-unique-id="77ff77c7-af1f-4c1a-9071-1f507bddec84" data-file-name="app/admin/activity/page.tsx">
      <div className="flex justify-between items-center" data-unique-id="99f5529b-d8c5-43a5-9129-0815feb9327d" data-file-name="app/admin/activity/page.tsx">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3" data-unique-id="7d2efc15-92b9-48c3-9eb2-d53c5a29c391" data-file-name="app/admin/activity/page.tsx">
          <Activity className="h-8 w-8 text-indigo-400" /><span className="editable-text" data-unique-id="10df06e8-21e3-4a07-af00-3ce89a162fc9" data-file-name="app/admin/activity/page.tsx">
          User Activity Logs
        </span></h1>
        
        <div className="flex gap-2" data-unique-id="21da1105-1b13-4438-a1bd-cfb81164048a" data-file-name="app/admin/activity/page.tsx">
          <button onClick={() => fetchAllLogs()} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center" data-unique-id="dd15af6b-69d8-44b0-97cd-d854ede77e6a" data-file-name="app/admin/activity/page.tsx">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /><span className="editable-text" data-unique-id="04a4228d-7b90-4759-95f9-57c9393cedca" data-file-name="app/admin/activity/page.tsx">
            Refresh
          </span></button>
          
          <button onClick={exportLogs} className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center" data-unique-id="803fa2eb-81dd-429d-8fc9-ed6f5a72d442" data-file-name="app/admin/activity/page.tsx">
            <Download className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="3780d323-4246-49c9-8e73-96eefbbaa48f" data-file-name="app/admin/activity/page.tsx">
            Export CSV
          </span></button>
          
          <button onClick={() => {
          if (window.confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
            clearLogs();
          }
        }} className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center" data-unique-id="c1cc8b63-c882-4a2f-a7cb-70a28701d507" data-file-name="app/admin/activity/page.tsx">
            <Trash2 className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="9617e74d-e5da-4ee4-b696-915f0c95b214" data-file-name="app/admin/activity/page.tsx">
            Clear Logs
          </span></button>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="500b57aa-ff61-4f9c-b611-3b2b8c6b2c10" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
        <div className="flex flex-wrap gap-4 mb-6" data-unique-id="6a4ce02b-bf08-4599-bbff-5f61007bdf09" data-file-name="app/admin/activity/page.tsx">
          <div className="flex-1" data-unique-id="7f59e599-e30e-40cf-bdd0-353ef5925d7b" data-file-name="app/admin/activity/page.tsx">
            <div className="relative" data-unique-id="a034b551-dca8-4b7d-ba9d-e61aa454d521" data-file-name="app/admin/activity/page.tsx">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input type="text" value={searchTerm} onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }} placeholder="Search logs by action, user, or details..." className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" data-unique-id="2acc0826-6b6c-4335-a2e0-49c40c9ca884" data-file-name="app/admin/activity/page.tsx" />
            </div>
          </div>
          
          <div className="flex gap-2" data-unique-id="963b052e-b6a3-4a75-83fd-e83b4fce87d9" data-file-name="app/admin/activity/page.tsx">
            <div className="w-48" data-unique-id="9ca16c86-bf68-4e72-be4b-3434f54a5094" data-file-name="app/admin/activity/page.tsx">
              <div className="flex items-center bg-gray-700 border border-gray-600 rounded-lg overflow-hidden" data-unique-id="81623f96-a529-411d-b3fd-f7ae83b3a277" data-file-name="app/admin/activity/page.tsx">
                <Filter className="ml-3 text-gray-400 h-4 w-4" />
                <select value={filter} onChange={e => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }} className="w-full bg-transparent text-white py-2.5 pl-2 pr-8 appearance-none focus:outline-none" data-unique-id="5ff1dcdb-ed28-408a-ad30-1cbdf04bc766" data-file-name="app/admin/activity/page.tsx">
                  <option value="all" data-unique-id="5d3e81d8-8f25-4b43-a522-7f30d896154f" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="352e25a2-13cf-4801-8b86-ec4882d44104" data-file-name="app/admin/activity/page.tsx">All Activities</span></option>
                  <option value="email" data-unique-id="013b945e-2728-453b-806c-46b8b01abc99" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="f95d0aeb-8d6d-4f42-ba16-49708c2a36a0" data-file-name="app/admin/activity/page.tsx">Email Activities</span></option>
                  <option value="order" data-unique-id="d9071045-8dd3-4eff-8725-05f4b68ced54" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="471d028c-e46f-4f83-b869-a03aabc0d486" data-file-name="app/admin/activity/page.tsx">Order Activities</span></option>
                  <option value="user" data-unique-id="4b7a8faf-0f95-4af4-84a5-e44082cd2f05" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="b553a345-4e88-4446-ace0-1d6240fbd264" data-file-name="app/admin/activity/page.tsx">User Activities</span></option>
                  <option value="auth" data-unique-id="89b9a189-30fc-4347-9e2e-98192bf9d406" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="6b43bcb2-1c44-443e-a34f-103965918a10" data-file-name="app/admin/activity/page.tsx">Authentication</span></option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {isLoading ? <div className="flex flex-col items-center justify-center py-12" data-unique-id="0c0256fe-23fe-4766-8487-76a2b23126de" data-file-name="app/admin/activity/page.tsx">
            <RefreshCw className="h-12 w-12 animate-spin text-indigo-500 mb-4" />
            <p className="text-gray-400" data-unique-id="f7eebd1e-009a-4605-a9c5-38a533d9d187" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="94900486-7da7-4719-a9c0-540cecff5f88" data-file-name="app/admin/activity/page.tsx">Loading activity logs...</span></p>
          </div> : paginatedLogs.length > 0 ? <>
            <div className="overflow-x-auto" data-unique-id="e0e92bc3-0078-4191-a740-d62694818375" data-file-name="app/admin/activity/page.tsx">
              <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden" data-unique-id="59cea8f1-8943-411f-a755-f3d984685136" data-file-name="app/admin/activity/page.tsx">
                <thead className="bg-gray-700" data-unique-id="e72e452b-3257-4367-adc5-c96c397dd2b4" data-file-name="app/admin/activity/page.tsx">
                  <tr data-unique-id="9fe82c68-52d4-4b5b-8474-4111aafac70c" data-file-name="app/admin/activity/page.tsx">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" data-unique-id="a7769a53-536d-4633-984b-1360a7691263" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="5c1c2d57-8fb8-41e7-bd73-064df9da829f" data-file-name="app/admin/activity/page.tsx">User</span></th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" data-unique-id="14836b1a-00d4-43cd-9984-c620edb14e19" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="cd6fbb8c-feae-42fa-a626-26de2c1a54b4" data-file-name="app/admin/activity/page.tsx">Action</span></th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" data-unique-id="3c764836-f0b1-44b2-a96b-fdb3191781bf" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="87efcbcb-1d6b-45f3-a982-44c254b68703" data-file-name="app/admin/activity/page.tsx">Details</span></th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" data-unique-id="efede2b8-ffa5-49ec-91f1-67edc4d90ff8" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="e68edf0b-ecd7-4486-a79f-82416c96c920" data-file-name="app/admin/activity/page.tsx">Timestamp</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700" data-unique-id="ecfdd3a5-783b-43db-a9c5-d0facf41d0b2" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
                  {paginatedLogs.map((log, index) => <ActivityLogRow key={log.id || index} log={log} data-unique-id="5271f697-ac23-4eec-b214-39b9465bdfdc" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true" />)}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-6" data-unique-id="d4dd7101-ee3c-4ad2-83cc-4e76ef9ba9fa" data-file-name="app/admin/activity/page.tsx">
              <div className="text-sm text-gray-400" data-unique-id="db09fa4c-d4df-4b12-ac9a-60a4a2b8d409" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="61b7ca12-4bc8-4947-9312-b10ce98a7cea" data-file-name="app/admin/activity/page.tsx">
                Showing </span>{(currentPage - 1) * itemsPerPage + 1}<span className="editable-text" data-unique-id="98b50294-d490-4a70-8cb8-6af20647d609" data-file-name="app/admin/activity/page.tsx"> to </span>{Math.min(currentPage * itemsPerPage, filteredLogs.length)}<span className="editable-text" data-unique-id="d994b866-9cd4-4e82-a256-189e6c57bc3a" data-file-name="app/admin/activity/page.tsx"> of </span>{filteredLogs.length}<span className="editable-text" data-unique-id="7d30b601-bb91-48e1-b5a1-d0ad4cc0042a" data-file-name="app/admin/activity/page.tsx"> logs
              </span></div>
              
              <div className="flex gap-2" data-unique-id="14a7e752-a9a8-450f-af1f-a1e82644f9db" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed" data-unique-id="5749bf07-a364-40bd-b16a-14ea1845afae" data-file-name="app/admin/activity/page.tsx">
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
              return <button key={pageNum} onClick={() => handlePageChange(pageNum)} className={`w-10 h-10 rounded-md ${currentPage === pageNum ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`} data-unique-id="9827e1ab-8bcb-485d-99cd-7ec232a6b8dd" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
                      {pageNum}
                    </button>;
            })}
                
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed" data-unique-id="93d4bf29-60f4-47a2-9a05-947b9de11964" data-file-name="app/admin/activity/page.tsx">
                  <ChevronRight className="h-5 w-5 text-gray-300" />
                </button>
              </div>
            </div>
          </> : <div className="flex flex-col items-center justify-center py-12" data-unique-id="46378b40-f08b-4eab-9094-4866f7a9fabc" data-file-name="app/admin/activity/page.tsx">
            <AlertCircle className="h-12 w-12 text-gray-500 mb-4" />
            <p className="text-gray-400 mb-2" data-unique-id="e1790150-6741-4a22-b418-58f514527347" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="22c40f0f-0bb4-4a2f-a562-539f42bb24e9" data-file-name="app/admin/activity/page.tsx">No activity logs found</span></p>
            <p className="text-gray-500 text-sm" data-unique-id="bf0ad72a-a612-4651-94eb-9f9725f1f5df" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="788d0986-c1e3-4efe-9dfc-1c70465ccb96" data-file-name="app/admin/activity/page.tsx">Try adjusting your search terms or filters</span></p>
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
  }} className="hover:bg-gray-700/50 cursor-pointer" onClick={() => hasDetails && setExpanded(!expanded)} data-unique-id="8aa39faf-b372-4b36-b062-c35cf07cca18" data-file-name="app/admin/activity/page.tsx">
      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="7c70ff9f-efed-458f-a790-654f22a54839" data-file-name="app/admin/activity/page.tsx">
        <div className="flex items-center" data-unique-id="b55058b8-952d-4bcf-b25f-54cb543fed92" data-file-name="app/admin/activity/page.tsx">
          <div className="h-8 w-8 rounded-full bg-indigo-700/20 flex items-center justify-center mr-3" data-unique-id="04792aea-ecb9-4db9-9fa9-ceb7d63a010e" data-file-name="app/admin/activity/page.tsx">
            <User className="h-4 w-4 text-indigo-400" />
          </div>
          <div data-unique-id="2c3a853f-23cb-4fdb-a77d-b2ae2cfac1d2" data-file-name="app/admin/activity/page.tsx">
            <div className="text-sm font-medium text-white" data-unique-id="f4ae22e2-c379-4bbb-bba1-34a3efff0af6" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
              {log.user_email || 'Anonymous'}
            </div>
            <div className="text-xs text-gray-400" data-unique-id="0954de89-fdc1-458b-82db-be3e696c564b" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
              {log.user_id || 'No ID'}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4" data-unique-id="9676c0fc-222c-405b-bcd7-b8e700dd8268" data-file-name="app/admin/activity/page.tsx">
        <div className="text-sm text-white" data-unique-id="b63388d3-051f-42a6-99d0-24e2d12fa3ec" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">{log.action}</div>
      </td>
      <td className="px-6 py-4" data-unique-id="25e4dc80-c579-4958-9f21-4d7d03ac61d4" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
        {hasDetails ? <div className="text-sm" data-unique-id="8a6a8b7f-a2ec-42ba-88c2-8955961a0963" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
            <button className="text-indigo-400 hover:text-indigo-300 flex items-center" data-unique-id="e0db8898-637c-4d11-8c8e-46efda53858f" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
              {expanded ? 'Hide' : 'Show'}<span className="editable-text" data-unique-id="cbb633ad-cb78-4cff-ac23-26132fc65211" data-file-name="app/admin/activity/page.tsx"> Details
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
        }} className="mt-2 bg-gray-900/50 p-3 rounded text-xs text-gray-300 max-w-lg" data-unique-id="04f1138c-0575-4129-a972-645bac4668d1" data-file-name="app/admin/activity/page.tsx">
                <div className="space-y-1" data-unique-id="460b17d5-a762-403e-83e0-23c054eb42ca" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
                  {Object.entries(log.details).map(([key, value]) => <div key={key} data-unique-id="a0985c31-f15f-4f74-8d28-168df2bdaef0" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
                      <span className="text-gray-400" data-unique-id="87d32d94-98b1-454d-9e1c-37e43f435b88" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">{key}<span className="editable-text" data-unique-id="7d89669e-f647-4ea5-ac9c-a0552aa89e55" data-file-name="app/admin/activity/page.tsx">: </span></span>
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </div>)}
                </div>
              </motion.div>}
          </div> : <span className="text-sm text-gray-500" data-unique-id="5c021f06-bd8f-4d6c-b1be-1e2864eb05f6" data-file-name="app/admin/activity/page.tsx"><span className="editable-text" data-unique-id="0d27a1dc-d184-4c6e-89e7-4db10e5f4bff" data-file-name="app/admin/activity/page.tsx">No details available</span></span>}
      </td>
      <td className="px-6 py-4 whitespace-nowrap" data-unique-id="afe50452-4575-41de-8514-b3ae97690bfb" data-file-name="app/admin/activity/page.tsx">
        <div className="flex items-center text-sm text-gray-300" data-unique-id="b84906d2-9ef6-4730-b71a-0d531694e000" data-file-name="app/admin/activity/page.tsx" data-dynamic-text="true">
          <Calendar className="h-4 w-4 mr-2 text-gray-400" data-unique-id="1455d264-9ec9-4ba5-835a-6b505f54f887" data-file-name="app/admin/activity/page.tsx" />
          {formattedDate}
        </div>
      </td>
    </motion.tr>;
}