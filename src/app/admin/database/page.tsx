'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase-client';
import { Database, RefreshCw, Upload, Download, Check, AlertTriangle, X, Loader2, ArrowUpDown, Trash2 } from 'lucide-react';

// Types of data that can be synced
type DataType = 'customers' | 'templates' | 'orders' | 'activity_logs';

// Status of sync operation
type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';
interface SyncState {
  [key: string]: {
    status: SyncStatus;
    message: string;
    lastSynced: string | null;
    count: number;
  };
}
export default function DatabasePage() {
  const [syncState, setSyncState] = useState<SyncState>({
    customers: {
      status: 'idle',
      message: '',
      lastSynced: null,
      count: 0
    },
    templates: {
      status: 'idle',
      message: '',
      lastSynced: null,
      count: 0
    },
    orders: {
      status: 'idle',
      message: '',
      lastSynced: null,
      count: 0
    },
    activity_logs: {
      status: 'idle',
      message: '',
      lastSynced: null,
      count: 0
    }
  });
  const [isSupabaseAvailable, setIsSupabaseAvailable] = useState<boolean | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);

  // Check if Supabase is configured properly
  useEffect(() => {
    const checkSupabase = async () => {
      try {
        setIsCheckingConnection(true);

        // Check if Supabase URL and key are set
        if (!supabase || !supabase.from || !supabase.auth) {
          setIsSupabaseAvailable(false);
          return;
        }

        // Try a simple query to verify connection
        const {
          data,
          error
        } = await supabase.from('customers').select('count').limit(1);
        if (error && error.code !== 'PGRST116') {
          // PGRST116 is "relation does not exist" which is fine, it means the connection works
          // but the table doesn't exist yet
          console.error('Supabase connection error:', error);
          setIsSupabaseAvailable(false);
          return;
        }

        // Connection successful
        setIsSupabaseAvailable(true);

        // Get initial counts
        updateCounts();
      } catch (err) {
        console.error('Error checking Supabase connection:', err);
        setIsSupabaseAvailable(false);
      } finally {
        setIsCheckingConnection(false);
      }
    };
    checkSupabase();
  }, []);

  // Update record counts for all tables
  const updateCounts = async () => {
    if (!supabase || !supabase.from) return;

    // Helper function to get count safely
    const getCount = async (table: string): Promise<number> => {
      try {
        const {
          count,
          error
        } = await supabase.from(table).select('*', {
          count: 'exact',
          head: true
        });
        if (error && error.code !== 'PGRST116') {
          console.error(`Error counting ${table}:`, error);
          return 0;
        }
        return count || 0;
      } catch (err) {
        console.error(`Error counting ${table}:`, err);
        return 0;
      }
    };

    // Update count for each table
    const tables: DataType[] = ['customers', 'templates', 'orders', 'activity_logs'];
    for (const table of tables) {
      const count = await getCount(table);
      setSyncState(prev => ({
        ...prev,
        [table]: {
          ...prev[table],
          count
        }
      }));
    }
  };

  // Get data from localStorage
  const getLocalData = (type: DataType) => {
    try {
      if (typeof window === 'undefined') return [];
      switch (type) {
        case 'customers':
          return JSON.parse(localStorage.getItem('app_customers') || '[]');
        case 'templates':
          return JSON.parse(localStorage.getItem('app_email_templates') || '[]');
        case 'orders':
          return JSON.parse(localStorage.getItem('app_orders') || '[]');
        case 'activity_logs':
          return JSON.parse(localStorage.getItem('activity-logs-store') || '{}')?.state?.logs || [];
        default:
          return [];
      }
    } catch (err) {
      console.error(`Error getting ${type} from localStorage:`, err);
      return [];
    }
  };

  // Sync data from localStorage to Supabase
  const syncToSupabase = async (type: DataType) => {
    if (!supabase || !supabase.from || !isSupabaseAvailable) {
      setSyncState(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          status: 'error',
          message: 'Supabase not available'
        }
      }));
      return;
    }
    try {
      // Update status to syncing
      setSyncState(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          status: 'syncing',
          message: 'Syncing data...'
        }
      }));

      // Get data from localStorage
      const localData = getLocalData(type);
      if (!localData || localData.length === 0) {
        setSyncState(prev => ({
          ...prev,
          [type]: {
            ...prev[type],
            status: 'error',
            message: 'No local data found'
          }
        }));
        return;
      }

      // For each item, insert if not exists or update if exists
      for (const item of localData) {
        const {
          data,
          error
        } = await supabase.from(type).upsert(item).select();
        if (error) {
          console.error(`Error upserting ${type}:`, error);
          setSyncState(prev => ({
            ...prev,
            [type]: {
              ...prev[type],
              status: 'error',
              message: `Error: ${error.message}`
            }
          }));
          return;
        }
      }

      // Update status to success
      setSyncState(prev => ({
        ...prev,
        [type]: {
          status: 'success',
          message: `Synced ${localData.length} items`,
          lastSynced: new Date().toISOString(),
          count: localData.length
        }
      }));

      // Update counts
      updateCounts();
    } catch (err) {
      console.error(`Error syncing ${type}:`, err);
      setSyncState(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          status: 'error',
          message: `Error: ${err instanceof Error ? err.message : 'Unknown error'}`
        }
      }));
    }
  };

  // Sync all data types
  const syncAll = async () => {
    const types: DataType[] = ['customers', 'templates', 'orders', 'activity_logs'];
    for (const type of types) {
      await syncToSupabase(type);
    }
  };

  // Render status icon based on status
  const renderStatusIcon = (status: SyncStatus) => {
    switch (status) {
      case 'idle':
        return <ArrowUpDown className="h-5 w-5 text-gray-400" />;
      case 'syncing':
        return <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />;
      case 'success':
        return <Check className="h-5 w-5 text-green-400" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-400" />;
      default:
        return null;
    }
  };
  return <div className="space-y-6" data-unique-id="65c60bd4-20a8-42d7-af85-f7cb6923dc99" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center" data-unique-id="4f543525-49bf-4a4c-8297-b4e9278ba142" data-file-name="app/admin/database/page.tsx">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3" data-unique-id="ba572f37-19be-4d0b-a006-6aefd87b3f3b" data-file-name="app/admin/database/page.tsx">
          <Database className="h-8 w-8 text-indigo-400" /><span className="editable-text" data-unique-id="cbcd916b-69e0-467e-8e62-2b9b51ea1a63" data-file-name="app/admin/database/page.tsx">
          Database Management
        </span></h1>
      </div>
      
      {/* Supabase Connection Status */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="c43fd9b0-ef25-4ced-a2c6-d0edce15e727" data-file-name="app/admin/database/page.tsx">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center" data-unique-id="51132fd1-0886-437e-8ab3-e60197d94a26" data-file-name="app/admin/database/page.tsx">
          <Database className="h-5 w-5 mr-2 text-indigo-400" /><span className="editable-text" data-unique-id="23590227-42d5-4747-a26b-bd7151c60bf4" data-file-name="app/admin/database/page.tsx">
          Supabase Connection Status
        </span></h2>
        
        <div className="p-4 rounded-lg border border-gray-700 bg-gray-700/30" data-unique-id="4b1e16fd-e1a6-4798-b2f2-b62ca40c999e" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">
          {isCheckingConnection ? <div className="flex items-center justify-center py-4" data-unique-id="248709af-9912-4495-9821-d7e756a42b9d" data-file-name="app/admin/database/page.tsx">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-400 mr-3" />
              <span className="text-gray-300" data-unique-id="eda2ac05-24b7-484a-9580-3e3acad1e080" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="00136f3f-355c-47ab-b7d6-eaf9eb2ef4b0" data-file-name="app/admin/database/page.tsx">Checking connection...</span></span>
            </div> : isSupabaseAvailable ? <div className="flex items-center text-green-400" data-unique-id="611e96a5-ddf1-4148-860e-748b66887228" data-file-name="app/admin/database/page.tsx">
              <Check className="h-6 w-6 mr-2" />
              <div data-unique-id="721bd88a-c1f0-41e2-8cae-4a9e4ab6166b" data-file-name="app/admin/database/page.tsx">
                <p className="font-medium" data-unique-id="da87f234-7a5b-4d56-9cb7-c112f29028e0" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="172d53cd-17c0-4e0e-bc76-ba9c95779ff3" data-file-name="app/admin/database/page.tsx">Connected to Supabase</span></p>
                <p className="text-sm text-gray-300 mt-1" data-unique-id="03156e16-f6b9-4d97-83b3-189161f16a3d" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="84de4171-9d8e-4756-b3e9-7299a98159d0" data-file-name="app/admin/database/page.tsx">
                  Database synchronization is available
                </span></p>
              </div>
            </div> : <div className="flex items-center text-red-400" data-unique-id="7325654f-8483-4d7d-b09f-b4a537bc6d92" data-file-name="app/admin/database/page.tsx">
              <X className="h-6 w-6 mr-2" />
              <div data-unique-id="7af3f643-ff4a-43d8-ad31-df5e03dd0826" data-file-name="app/admin/database/page.tsx">
                <p className="font-medium" data-unique-id="ed7dd1f2-fa26-4e30-a080-51c9baa8f04b" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="608c12da-0261-4e54-9588-5c51f30e6a52" data-file-name="app/admin/database/page.tsx">Not Connected to Supabase</span></p>
                <p className="text-sm text-gray-300 mt-1" data-unique-id="72d0d386-3f62-4131-9c51-513370796808" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="071909ff-a8bb-4644-b4e0-e15e7ffc7e4c" data-file-name="app/admin/database/page.tsx">
                  Ensure you've configured the NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
                  environment variables.
                </span></p>
              </div>
            </div>}
        </div>
      </div>
      
      {/* Data Sync Controls */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="3be9ade3-e99c-4385-914f-170ef998ad75" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">
        <div className="flex justify-between items-center mb-6" data-unique-id="bb72f9e3-6f4c-4feb-ad99-5ab44b969ac8" data-file-name="app/admin/database/page.tsx">
          <h2 className="text-xl font-semibold text-white flex items-center" data-unique-id="56ec5ade-088e-4195-9e3f-4b922eb060c8" data-file-name="app/admin/database/page.tsx">
            <Upload className="h-5 w-5 mr-2 text-indigo-400" /><span className="editable-text" data-unique-id="be3060a4-7264-4fc2-83ea-c3f142528b85" data-file-name="app/admin/database/page.tsx">
            Data Synchronization
          </span></h2>
          
          <button disabled={!isSupabaseAvailable || Object.values(syncState).some(s => s.status === 'syncing')} onClick={syncAll} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed" data-unique-id="52f44e74-2272-45a6-9c5b-4181c05a5f8e" data-file-name="app/admin/database/page.tsx">
            <RefreshCw className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="996d1e31-a619-4ec0-936d-0619b8852464" data-file-name="app/admin/database/page.tsx">
            Sync All Data
          </span></button>
        </div>
        
        <div className="space-y-4" data-unique-id="2eb42761-dc36-4aa9-b37c-0b63b9f642b9" data-file-name="app/admin/database/page.tsx">
          <DataSyncItem title="Customer Data" description="User profiles and contact information" status={syncState.customers.status} message={syncState.customers.message} lastSynced={syncState.customers.lastSynced} count={syncState.customers.count} onSync={() => syncToSupabase('customers')} isDisabled={!isSupabaseAvailable || syncState.customers.status === 'syncing'} />
          
          <DataSyncItem title="Email Templates" description="Saved email templates and designs" status={syncState.templates.status} message={syncState.templates.message} lastSynced={syncState.templates.lastSynced} count={syncState.templates.count} onSync={() => syncToSupabase('templates')} isDisabled={!isSupabaseAvailable || syncState.templates.status === 'syncing'} />
          
          <DataSyncItem title="Orders" description="Customer orders and tracking information" status={syncState.orders.status} message={syncState.orders.message} lastSynced={syncState.orders.lastSynced} count={syncState.orders.count} onSync={() => syncToSupabase('orders')} isDisabled={!isSupabaseAvailable || syncState.orders.status === 'syncing'} />
          
          <DataSyncItem title="Activity Logs" description="User interaction and system event logs" status={syncState.activity_logs.status} message={syncState.activity_logs.message} lastSynced={syncState.activity_logs.lastSynced} count={syncState.activity_logs.count} onSync={() => syncToSupabase('activity_logs')} isDisabled={!isSupabaseAvailable || syncState.activity_logs.status === 'syncing'} />
        </div>
        
        {!isSupabaseAvailable && <div className="mt-6 p-4 bg-amber-900/20 border border-amber-700/30 rounded-lg" data-unique-id="e6425c2d-65aa-4ebf-8fc5-86c782e230d4" data-file-name="app/admin/database/page.tsx">
            <div className="flex items-start" data-unique-id="e2e0fe4c-5099-4308-8bfa-95d6cb988fa9" data-file-name="app/admin/database/page.tsx">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
              <div data-unique-id="da04951d-eb6e-4fee-9820-96f6cca1e605" data-file-name="app/admin/database/page.tsx">
                <p className="text-amber-400 font-medium" data-unique-id="191be232-7f8b-4165-b3c2-ace703fa5b8b" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="6932ab46-1c07-45c6-a8b0-d584481fcdf1" data-file-name="app/admin/database/page.tsx">Supabase Connection Required</span></p>
                <p className="text-sm text-amber-300/80 mt-1" data-unique-id="6ed95661-588d-471e-a25e-4e88281f9825" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="03c4ad42-5d3c-4d09-aece-bfd07ea31d5a" data-file-name="app/admin/database/page.tsx">
                  To enable data synchronization, you need to configure your Supabase connection.
                  Add the following environment variables to your project:
                </span></p>
                <div className="mt-3 p-3 bg-gray-900/50 rounded font-mono text-xs text-amber-300/90" data-unique-id="3b716c09-6c04-4853-b360-17489f1bd680" data-file-name="app/admin/database/page.tsx">
                  <p data-unique-id="9c675c44-230c-4e5c-a7f2-a74271631fc3" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="4461e5c6-e243-4361-aa79-1b31bb560459" data-file-name="app/admin/database/page.tsx">NEXT_PUBLIC_SUPABASE_URL=your-project-url</span></p>
                  <p data-unique-id="13334d1c-279b-4cf2-9c4d-67c27559c5df" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="7ad99cf4-d655-4944-a2c9-ca9f501ce000" data-file-name="app/admin/database/page.tsx">NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key</span></p>
                </div>
              </div>
            </div>
          </div>}
      </div>
      
      {/* Database Management */}
      {isSupabaseAvailable && <div className="bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="3e0ddfbb-0815-4e24-be1d-7918f060c388" data-file-name="app/admin/database/page.tsx">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center" data-unique-id="681bca18-2cd4-416d-a900-9919485b8215" data-file-name="app/admin/database/page.tsx">
            <Database className="h-5 w-5 mr-2 text-indigo-400" /><span className="editable-text" data-unique-id="426ea4bc-46ba-4781-9938-fd2db38c85ba" data-file-name="app/admin/database/page.tsx">
            Database Management
          </span></h2>
          
          <div className="space-y-4" data-unique-id="0ee7c589-bcf2-46cd-a5c3-4b04cfd6cf0f" data-file-name="app/admin/database/page.tsx">
            <div className="p-4 border border-gray-700 rounded-lg" data-unique-id="dbb4ffa3-8da0-4d2f-891c-4c519d999d8e" data-file-name="app/admin/database/page.tsx">
              <h3 className="text-lg font-medium text-white mb-2" data-unique-id="78065e97-a559-4d42-8f88-e654208d0dc3" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="d4ec6fe5-1d00-481e-a43b-2b5a8b94ccff" data-file-name="app/admin/database/page.tsx">Export Database</span></h3>
              <p className="text-sm text-gray-400 mb-4" data-unique-id="114e8117-a58b-4731-9ae9-8b45b44ca934" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="3906b95e-cdb5-472f-a5bd-0b65c5a5b97b" data-file-name="app/admin/database/page.tsx">
                Download a backup of all your data from Supabase. This includes all tables and records.
              </span></p>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center" onClick={() => alert('This feature would export a full Supabase database backup')} data-unique-id="67ee1983-9196-4a9d-b2c0-a08e6f9f7ba3" data-file-name="app/admin/database/page.tsx">
                <Download className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="b6dd7bd5-3829-42e7-b7a1-62182a38f96d" data-file-name="app/admin/database/page.tsx">
                Export Database
              </span></button>
            </div>
            
            <div className="p-4 border border-gray-700 rounded-lg bg-red-900/10" data-unique-id="a24e12c5-3ea0-4184-9bc1-e201fb2abaae" data-file-name="app/admin/database/page.tsx">
              <h3 className="text-lg font-medium text-white mb-2" data-unique-id="1d04b317-5acb-41f0-8d6d-ad1b9fc523a4" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="56c7c2e0-3199-4c92-9077-a88276b53f90" data-file-name="app/admin/database/page.tsx">Danger Zone</span></h3>
              <p className="text-sm text-gray-400 mb-4" data-unique-id="998c4c14-064a-4bf3-8d2e-1336f5cd6bc1" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="664396d1-2dce-422c-874d-e47868c2f7bf" data-file-name="app/admin/database/page.tsx">
                These actions cannot be undone. Be careful when performing these operations.
              </span></p>
              <div className="flex space-x-4" data-unique-id="5d3bbfed-a586-444b-b0af-aadc9ae135e3" data-file-name="app/admin/database/page.tsx">
                <button className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-md flex items-center" onClick={() => {
              if (window.confirm('Are you sure you want to clear all Supabase data? This action cannot be undone.')) {
                alert('This would clear all Supabase data in a real implementation');
              }
            }} data-unique-id="fa7b9780-4f50-49b9-86ef-9d131a33f77b" data-file-name="app/admin/database/page.tsx">
                  <Trash2 className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="aba19c7f-1caf-49fa-8b00-1ce0b616f671" data-file-name="app/admin/database/page.tsx">
                  Clear All Data
                </span></button>
              </div>
            </div>
          </div>
        </div>}
    </div>;
}
function DataSyncItem({
  title,
  description,
  status,
  message,
  lastSynced,
  count,
  onSync,
  isDisabled
}: {
  title: string;
  description: string;
  status: SyncStatus;
  message: string;
  lastSynced: string | null;
  count: number;
  onSync: () => void;
  isDisabled: boolean;
}) {
  // Format last synced time
  const formattedLastSynced = lastSynced ? new Date(lastSynced).toLocaleString() : 'Never';

  // Determine status color
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'syncing':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };
  return <motion.div initial={{
    opacity: 0,
    y: 10
  }} animate={{
    opacity: 1,
    y: 0
  }} className="p-5 bg-gray-700/30 border border-gray-700 rounded-lg" data-unique-id="18fed711-4ea6-495f-a277-7079fc226f89" data-file-name="app/admin/database/page.tsx">
      <div className="flex justify-between" data-unique-id="9de2309c-5be4-429a-8184-7869c3f0c901" data-file-name="app/admin/database/page.tsx">
        <div data-unique-id="c99a4883-8097-4243-9b10-dab25847d0b1" data-file-name="app/admin/database/page.tsx">
          <h3 className="text-lg font-medium text-white" data-unique-id="afb33fc6-5aaa-44e1-97a2-cad52a0dcb35" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">{title}</h3>
          <p className="text-sm text-gray-400 mt-1" data-unique-id="b92533c6-92cf-4f2e-bd2c-2788c4b534d5" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">{description}</p>
          
          <div className="mt-3 flex items-center space-x-4" data-unique-id="14a8791c-a9b9-4449-b2d6-6d197b304b66" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">
            <div className={`flex items-center ${getStatusColor()}`} data-unique-id="e34de97e-28ee-4e04-a9ac-8b9891ddb805" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">
              {status === 'syncing' ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <div className="h-2 w-2 rounded-full bg-current mr-2" data-unique-id="6fc91425-8457-45bf-a730-0b0c34430dd3" data-file-name="app/admin/database/page.tsx"></div>}
              <span className="text-sm capitalize" data-unique-id="ed98bbd7-264c-4e06-910c-b6b16f20e3b0" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">{status}</span>
            </div>
            
            {message && <span className="text-sm text-gray-400" data-unique-id="cc84e4ce-76a4-4eb5-b390-162381e10973" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">{message}</span>}
          </div>
        </div>
        
        <div className="flex flex-col items-end" data-unique-id="09586c13-1252-4342-bb35-cdf2ebba61c9" data-file-name="app/admin/database/page.tsx">
          <button onClick={onSync} disabled={isDisabled} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed" data-unique-id="68f23e60-995d-4f85-8bc0-1716739e7e87" data-file-name="app/admin/database/page.tsx">
            <Upload className="h-3.5 w-3.5 mr-1.5" /><span className="editable-text" data-unique-id="84c4470d-121f-49a7-b1cd-124cce576a23" data-file-name="app/admin/database/page.tsx">
            Sync
          </span></button>
          
          <div className="mt-3 text-right" data-unique-id="50a9500d-f75b-4a34-b7ab-b28a2849e459" data-file-name="app/admin/database/page.tsx">
            <div className="text-sm text-gray-400" data-unique-id="d4a513f9-0299-4dce-be25-5c09803ce862" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">
              {count}<span className="editable-text" data-unique-id="e6097714-92a7-487a-8b06-38fbc79f55a9" data-file-name="app/admin/database/page.tsx"> records
            </span></div>
            <div className="text-xs text-gray-500 mt-1" data-unique-id="fcaf3ff9-7c69-4baa-9088-56b5e2782c5e" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="301f9820-4c2b-441d-b16a-fa0321244b6f" data-file-name="app/admin/database/page.tsx">
              Last synced: </span>{formattedLastSynced}
            </div>
          </div>
        </div>
      </div>
    </motion.div>;
}