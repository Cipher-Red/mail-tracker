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
  return <div className="space-y-6" data-unique-id="4caeacb9-a5b9-4e6e-aa55-43cf01f6383c" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center" data-unique-id="3e4805e4-8d78-4ecc-aae1-f2e278fb9d76" data-file-name="app/admin/database/page.tsx">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3" data-unique-id="3c550153-3e99-48ab-9239-e1c5b1e792bc" data-file-name="app/admin/database/page.tsx">
          <Database className="h-8 w-8 text-indigo-400" /><span className="editable-text" data-unique-id="6103b3ef-3e01-47b2-8c28-14367d82eb8b" data-file-name="app/admin/database/page.tsx">
          Database Management
        </span></h1>
      </div>
      
      {/* Supabase Connection Status */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="4cbc6970-d4f9-4c0f-a371-09b9ffeb272b" data-file-name="app/admin/database/page.tsx">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center" data-unique-id="1870cefb-e9fd-4bc6-ace4-a06634dd3477" data-file-name="app/admin/database/page.tsx">
          <Database className="h-5 w-5 mr-2 text-indigo-400" /><span className="editable-text" data-unique-id="7a04899f-3090-4232-96c9-968b5d34f16e" data-file-name="app/admin/database/page.tsx">
          Supabase Connection Status
        </span></h2>
        
        <div className="p-4 rounded-lg border border-gray-700 bg-gray-700/30" data-unique-id="3b61d9cb-7399-4505-b394-cd1692672bc9" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">
          {isCheckingConnection ? <div className="flex items-center justify-center py-4" data-unique-id="c1b3277f-d0e1-41fa-b7eb-6e86653bfc99" data-file-name="app/admin/database/page.tsx">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-400 mr-3" />
              <span className="text-gray-300" data-unique-id="13ef10e8-d753-4c78-97f6-3604e65c02f3" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="fb7e86bf-711f-4604-be67-bcc465490143" data-file-name="app/admin/database/page.tsx">Checking connection...</span></span>
            </div> : isSupabaseAvailable ? <div className="flex items-center text-green-400" data-unique-id="4238d062-655e-4216-87ea-2894fb0ff4a8" data-file-name="app/admin/database/page.tsx">
              <Check className="h-6 w-6 mr-2" />
              <div data-unique-id="086da297-3952-4069-9e51-1861e31137dd" data-file-name="app/admin/database/page.tsx">
                <p className="font-medium" data-unique-id="6dd86b56-6e4b-4163-a37a-4b19d10d3bac" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="f767a84f-6a7b-46f7-a1c8-4e81dd9faf46" data-file-name="app/admin/database/page.tsx">Connected to Supabase</span></p>
                <p className="text-sm text-gray-300 mt-1" data-unique-id="9280ade9-4429-4a44-992c-4001a9cc206c" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="553f302d-5a01-4ed4-8f48-c3cc5b6b4072" data-file-name="app/admin/database/page.tsx">
                  Database synchronization is available
                </span></p>
              </div>
            </div> : <div className="flex items-center text-red-400" data-unique-id="c1ed8753-4f25-4e8f-8d83-ff0d66699821" data-file-name="app/admin/database/page.tsx">
              <X className="h-6 w-6 mr-2" />
              <div data-unique-id="31b8ebac-73f8-4d11-97eb-98cca5aca777" data-file-name="app/admin/database/page.tsx">
                <p className="font-medium" data-unique-id="57e9aa4f-8265-49c4-89d8-b9c7931b5259" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="7d41af87-a0c4-4c33-9d49-8cb19f65201a" data-file-name="app/admin/database/page.tsx">Not Connected to Supabase</span></p>
                <p className="text-sm text-gray-300 mt-1" data-unique-id="82a46b83-a6ce-449c-814f-e6fba74477d4" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="acd3ccc2-4f11-4304-af65-c27e71a33dac" data-file-name="app/admin/database/page.tsx">
                  Ensure you've configured the NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
                  environment variables.
                </span></p>
              </div>
            </div>}
        </div>
      </div>
      
      {/* Data Sync Controls */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="f9130f08-0b70-4ffa-b7b3-e6e08d58c1ca" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">
        <div className="flex justify-between items-center mb-6" data-unique-id="884c297f-a882-4094-a432-8cb56c92b7ad" data-file-name="app/admin/database/page.tsx">
          <h2 className="text-xl font-semibold text-white flex items-center" data-unique-id="e498c453-ba0a-4943-b662-8956104b82cd" data-file-name="app/admin/database/page.tsx">
            <Upload className="h-5 w-5 mr-2 text-indigo-400" /><span className="editable-text" data-unique-id="01cf85df-ac3c-4a45-8ed2-b7d047fdc543" data-file-name="app/admin/database/page.tsx">
            Data Synchronization
          </span></h2>
          
          <button disabled={!isSupabaseAvailable || Object.values(syncState).some(s => s.status === 'syncing')} onClick={syncAll} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed" data-unique-id="abe0e0f4-267d-44c2-82d3-838a5be3cf9c" data-file-name="app/admin/database/page.tsx">
            <RefreshCw className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="e18fc26c-59b4-4461-8837-2fda397b59a6" data-file-name="app/admin/database/page.tsx">
            Sync All Data
          </span></button>
        </div>
        
        <div className="space-y-4" data-unique-id="a7ad1357-aba3-4af2-9945-5c632510d0b9" data-file-name="app/admin/database/page.tsx">
          <DataSyncItem title="Customer Data" description="User profiles and contact information" status={syncState.customers.status} message={syncState.customers.message} lastSynced={syncState.customers.lastSynced} count={syncState.customers.count} onSync={() => syncToSupabase('customers')} isDisabled={!isSupabaseAvailable || syncState.customers.status === 'syncing'} />
          
          <DataSyncItem title="Email Templates" description="Saved email templates and designs" status={syncState.templates.status} message={syncState.templates.message} lastSynced={syncState.templates.lastSynced} count={syncState.templates.count} onSync={() => syncToSupabase('templates')} isDisabled={!isSupabaseAvailable || syncState.templates.status === 'syncing'} />
          
          <DataSyncItem title="Orders" description="Customer orders and tracking information" status={syncState.orders.status} message={syncState.orders.message} lastSynced={syncState.orders.lastSynced} count={syncState.orders.count} onSync={() => syncToSupabase('orders')} isDisabled={!isSupabaseAvailable || syncState.orders.status === 'syncing'} />
          
          <DataSyncItem title="Activity Logs" description="User interaction and system event logs" status={syncState.activity_logs.status} message={syncState.activity_logs.message} lastSynced={syncState.activity_logs.lastSynced} count={syncState.activity_logs.count} onSync={() => syncToSupabase('activity_logs')} isDisabled={!isSupabaseAvailable || syncState.activity_logs.status === 'syncing'} />
        </div>
        
        {!isSupabaseAvailable && <div className="mt-6 p-4 bg-amber-900/20 border border-amber-700/30 rounded-lg" data-unique-id="4251a186-5a48-4ba0-87ef-80c3b2726405" data-file-name="app/admin/database/page.tsx">
            <div className="flex items-start" data-unique-id="3f83f507-89a8-4ce4-9c03-86825e105900" data-file-name="app/admin/database/page.tsx">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
              <div data-unique-id="2a3d6309-d14e-45fe-bb89-c95084e1a94e" data-file-name="app/admin/database/page.tsx">
                <p className="text-amber-400 font-medium" data-unique-id="45af5035-907f-4aa2-b2e1-8924b2d3031c" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="a2307771-2b68-4e47-8dbf-993f4bcd7371" data-file-name="app/admin/database/page.tsx">Supabase Connection Required</span></p>
                <p className="text-sm text-amber-300/80 mt-1" data-unique-id="adf97229-75bc-4163-87bd-d299bebf7cae" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="099ccb36-df4f-4111-965a-b8b68c4974b1" data-file-name="app/admin/database/page.tsx">
                  To enable data synchronization, you need to configure your Supabase connection.
                  Add the following environment variables to your project:
                </span></p>
                <div className="mt-3 p-3 bg-gray-900/50 rounded font-mono text-xs text-amber-300/90" data-unique-id="af0fe0bc-f438-479a-be8e-a79756fbca33" data-file-name="app/admin/database/page.tsx">
                  <p data-unique-id="784ff3b3-0791-4c7d-8df7-87a3461c3eb2" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="76236771-cef5-4b56-85da-4414da9225e9" data-file-name="app/admin/database/page.tsx">NEXT_PUBLIC_SUPABASE_URL=your-project-url</span></p>
                  <p data-unique-id="a34a337b-7134-4f5e-abe3-268be1a5f5cf" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="0ce1b9ac-449e-4e70-8639-209afdc05411" data-file-name="app/admin/database/page.tsx">NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key</span></p>
                </div>
              </div>
            </div>
          </div>}
      </div>
      
      {/* Database Management */}
      {isSupabaseAvailable && <div className="bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="ac71ddaa-5df0-428a-828a-34e10940bf2e" data-file-name="app/admin/database/page.tsx">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center" data-unique-id="03c957ee-8e8e-48b9-9af2-a83dc8482c10" data-file-name="app/admin/database/page.tsx">
            <Database className="h-5 w-5 mr-2 text-indigo-400" /><span className="editable-text" data-unique-id="fba67775-116a-4489-916e-108d4dcf70b1" data-file-name="app/admin/database/page.tsx">
            Database Management
          </span></h2>
          
          <div className="space-y-4" data-unique-id="801d2b56-46c1-439c-a5ea-81f1f9c0c7fb" data-file-name="app/admin/database/page.tsx">
            <div className="p-4 border border-gray-700 rounded-lg" data-unique-id="e1caeaad-5b94-40e6-8cb2-770fd48703c2" data-file-name="app/admin/database/page.tsx">
              <h3 className="text-lg font-medium text-white mb-2" data-unique-id="dc059a5e-84ce-4578-a425-ec161512dcec" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="b0e9acb0-f264-4538-86f9-c7802495704e" data-file-name="app/admin/database/page.tsx">Export Database</span></h3>
              <p className="text-sm text-gray-400 mb-4" data-unique-id="4099d54a-850a-4db4-ab71-bf7251c3081d" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="d1195d1a-96af-4411-bbca-1047d1e475bc" data-file-name="app/admin/database/page.tsx">
                Download a backup of all your data from Supabase. This includes all tables and records.
              </span></p>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center" onClick={() => alert('This feature would export a full Supabase database backup')} data-unique-id="291ea88b-48d0-4df9-9ae2-a2c4ef1a6e43" data-file-name="app/admin/database/page.tsx">
                <Download className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="f8547edc-6b45-4569-95ec-d5a8298d439f" data-file-name="app/admin/database/page.tsx">
                Export Database
              </span></button>
            </div>
            
            <div className="p-4 border border-gray-700 rounded-lg bg-red-900/10" data-unique-id="6c348385-8b59-45d6-8fec-c3b126b74421" data-file-name="app/admin/database/page.tsx">
              <h3 className="text-lg font-medium text-white mb-2" data-unique-id="a626bf88-4b55-47ed-91cb-aa1490c54462" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="7b33753b-b14a-485c-be3e-467e54ac3f3c" data-file-name="app/admin/database/page.tsx">Danger Zone</span></h3>
              <p className="text-sm text-gray-400 mb-4" data-unique-id="db227975-7752-4024-9e6f-e73ec0911764" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="4d4e6cf6-4f28-4d1a-9d8c-83643c38c668" data-file-name="app/admin/database/page.tsx">
                These actions cannot be undone. Be careful when performing these operations.
              </span></p>
              <div className="flex space-x-4" data-unique-id="66b7bd19-5593-40a9-94e5-182401cd44c7" data-file-name="app/admin/database/page.tsx">
                <button className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-md flex items-center" onClick={() => {
              if (window.confirm('Are you sure you want to clear all Supabase data? This action cannot be undone.')) {
                alert('This would clear all Supabase data in a real implementation');
              }
            }} data-unique-id="2e632a95-dfae-43d3-a4a8-aede25495cb8" data-file-name="app/admin/database/page.tsx">
                  <Trash2 className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="1b5e1bd4-18b4-444c-9659-e3bcd193e936" data-file-name="app/admin/database/page.tsx">
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
  }} className="p-5 bg-gray-700/30 border border-gray-700 rounded-lg" data-unique-id="34b3be1e-d263-482a-a55a-21f5c0892d1f" data-file-name="app/admin/database/page.tsx">
      <div className="flex justify-between" data-unique-id="884446d4-9798-4abc-88c2-4041fde1e47f" data-file-name="app/admin/database/page.tsx">
        <div data-unique-id="d34f2e2d-dad5-4d8b-9df3-c312880009bb" data-file-name="app/admin/database/page.tsx">
          <h3 className="text-lg font-medium text-white" data-unique-id="f4e3adb1-a8a0-4fa5-af56-fe1bd866da22" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">{title}</h3>
          <p className="text-sm text-gray-400 mt-1" data-unique-id="3e898301-dda3-4e3b-9881-6c4b177602bd" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">{description}</p>
          
          <div className="mt-3 flex items-center space-x-4" data-unique-id="ef7fcd91-dc0d-43e5-aa63-6b40bf6074df" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">
            <div className={`flex items-center ${getStatusColor()}`} data-unique-id="31555eb8-0b2b-4ace-bbe8-2e052d9792b2" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">
              {status === 'syncing' ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <div className="h-2 w-2 rounded-full bg-current mr-2" data-unique-id="5d1f1849-6a33-42a0-aa3b-94777dc840e0" data-file-name="app/admin/database/page.tsx"></div>}
              <span className="text-sm capitalize" data-unique-id="b1b213bc-81bc-483f-9f86-da375fbf2c03" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">{status}</span>
            </div>
            
            {message && <span className="text-sm text-gray-400" data-unique-id="ab7582b7-3a51-4c1f-bb96-1877d1b61551" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">{message}</span>}
          </div>
        </div>
        
        <div className="flex flex-col items-end" data-unique-id="792c0c83-dc5c-4567-85c8-2a0d5cf05629" data-file-name="app/admin/database/page.tsx">
          <button onClick={onSync} disabled={isDisabled} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed" data-unique-id="309f9dbd-441f-4b62-bf25-1475f19dc326" data-file-name="app/admin/database/page.tsx">
            <Upload className="h-3.5 w-3.5 mr-1.5" /><span className="editable-text" data-unique-id="2c6f8331-dc12-4553-91e7-6e6d8b293f79" data-file-name="app/admin/database/page.tsx">
            Sync
          </span></button>
          
          <div className="mt-3 text-right" data-unique-id="376ac605-5cde-46d5-abe0-8f7356277db7" data-file-name="app/admin/database/page.tsx">
            <div className="text-sm text-gray-400" data-unique-id="42bc7e40-2c9f-4dab-896d-6a0531aed29a" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">
              {count}<span className="editable-text" data-unique-id="8be1a162-96d3-4a91-8d78-0b2f6cd6e4d0" data-file-name="app/admin/database/page.tsx"> records
            </span></div>
            <div className="text-xs text-gray-500 mt-1" data-unique-id="9d9b9bd5-01fe-43a7-b661-a02483e45e70" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="0bd98e0a-a4fa-4710-9bbe-abdd52274e13" data-file-name="app/admin/database/page.tsx">
              Last synced: </span>{formattedLastSynced}
            </div>
          </div>
        </div>
      </div>
    </motion.div>;
}