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
  return <div className="space-y-6" data-unique-id="87acdf16-0faf-4162-bffe-f82d19e4f821" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center" data-unique-id="fcba5439-bfd8-4a8a-90c1-c6ac6dfe3def" data-file-name="app/admin/database/page.tsx">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3" data-unique-id="cbddf746-d489-4fbb-a785-553844965c52" data-file-name="app/admin/database/page.tsx">
          <Database className="h-8 w-8 text-indigo-400" /><span className="editable-text" data-unique-id="92ca801c-ae58-47b3-95cc-e4e41608aa1d" data-file-name="app/admin/database/page.tsx">
          Database Management
        </span></h1>
      </div>
      
      {/* Supabase Connection Status */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="abd6fb1a-1a1a-4732-914d-34cd5bfbe99d" data-file-name="app/admin/database/page.tsx">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center" data-unique-id="278fa258-f9bb-4d2d-bf74-38410890e28e" data-file-name="app/admin/database/page.tsx">
          <Database className="h-5 w-5 mr-2 text-indigo-400" /><span className="editable-text" data-unique-id="6d31cdc9-ceef-41c0-bf51-5035cd21bf36" data-file-name="app/admin/database/page.tsx">
          Supabase Connection Status
        </span></h2>
        
        <div className="p-4 rounded-lg border border-gray-700 bg-gray-700/30" data-unique-id="a90a4808-d3a8-4caf-bb83-a24a27fabef5" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">
          {isCheckingConnection ? <div className="flex items-center justify-center py-4" data-unique-id="ac675940-6196-43f8-b497-d56a3822f6f2" data-file-name="app/admin/database/page.tsx">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-400 mr-3" />
              <span className="text-gray-300" data-unique-id="607a4151-f49d-4a1e-922e-253b94c4ef81" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="2810906e-c486-4af9-87bb-d7b528b830f6" data-file-name="app/admin/database/page.tsx">Checking connection...</span></span>
            </div> : isSupabaseAvailable ? <div className="flex items-center text-green-400" data-unique-id="a420cf88-0a61-4535-ab4d-02244a7c88cf" data-file-name="app/admin/database/page.tsx">
              <Check className="h-6 w-6 mr-2" />
              <div data-unique-id="79bb12e1-cd97-43b6-8819-84eb43342e34" data-file-name="app/admin/database/page.tsx">
                <p className="font-medium" data-unique-id="a284e69d-36a6-4457-b95a-4b177a27cdcf" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="ecca7053-fb43-49d5-b17e-d0d47d2089c8" data-file-name="app/admin/database/page.tsx">Connected to Supabase</span></p>
                <p className="text-sm text-gray-300 mt-1" data-unique-id="3d10f20c-614a-4945-893a-f692d97416f5" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="ed3d15ef-d6c6-4452-8cf0-96db8967eae7" data-file-name="app/admin/database/page.tsx">
                  Database synchronization is available
                </span></p>
              </div>
            </div> : <div className="flex items-center text-red-400" data-unique-id="6da20f15-9483-44bf-8772-b29bd18e91d4" data-file-name="app/admin/database/page.tsx">
              <X className="h-6 w-6 mr-2" />
              <div data-unique-id="f383ac0a-b578-48df-ad25-519afcc671bc" data-file-name="app/admin/database/page.tsx">
                <p className="font-medium" data-unique-id="26b06c8c-4d38-4467-b560-c5872c08b53b" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="d75ed7ea-5a1f-42bc-92d3-22bc2a23165a" data-file-name="app/admin/database/page.tsx">Not Connected to Supabase</span></p>
                <p className="text-sm text-gray-300 mt-1" data-unique-id="fd532a4f-047a-4921-966e-42b553bf3c9c" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="77b6a9b1-6015-4ae2-a09e-1df2ca65e87a" data-file-name="app/admin/database/page.tsx">
                  Ensure you've configured the NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
                  environment variables.
                </span></p>
              </div>
            </div>}
        </div>
      </div>
      
      {/* Data Sync Controls */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="564dd33a-7bf3-48dd-86c8-c3837be9c22a" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">
        <div className="flex justify-between items-center mb-6" data-unique-id="41ec3fbd-998f-44a1-9a48-179843775968" data-file-name="app/admin/database/page.tsx">
          <h2 className="text-xl font-semibold text-white flex items-center" data-unique-id="17529c76-1f84-4e12-b1a2-8c435786b756" data-file-name="app/admin/database/page.tsx">
            <Upload className="h-5 w-5 mr-2 text-indigo-400" /><span className="editable-text" data-unique-id="24a3bfbf-9953-4b2b-85e3-a63612ebf3e5" data-file-name="app/admin/database/page.tsx">
            Data Synchronization
          </span></h2>
          
          <button disabled={!isSupabaseAvailable || Object.values(syncState).some(s => s.status === 'syncing')} onClick={syncAll} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed" data-unique-id="41b65b3f-c01f-419f-bd09-247a56952e4f" data-file-name="app/admin/database/page.tsx">
            <RefreshCw className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="87a6abd3-d16d-4f98-95e0-a25652675794" data-file-name="app/admin/database/page.tsx">
            Sync All Data
          </span></button>
        </div>
        
        <div className="space-y-4" data-unique-id="50a3be5c-d881-4ebf-ac75-dab196fd1148" data-file-name="app/admin/database/page.tsx">
          <DataSyncItem title="Customer Data" description="User profiles and contact information" status={syncState.customers.status} message={syncState.customers.message} lastSynced={syncState.customers.lastSynced} count={syncState.customers.count} onSync={() => syncToSupabase('customers')} isDisabled={!isSupabaseAvailable || syncState.customers.status === 'syncing'} />
          
          <DataSyncItem title="Email Templates" description="Saved email templates and designs" status={syncState.templates.status} message={syncState.templates.message} lastSynced={syncState.templates.lastSynced} count={syncState.templates.count} onSync={() => syncToSupabase('templates')} isDisabled={!isSupabaseAvailable || syncState.templates.status === 'syncing'} />
          
          <DataSyncItem title="Orders" description="Customer orders and tracking information" status={syncState.orders.status} message={syncState.orders.message} lastSynced={syncState.orders.lastSynced} count={syncState.orders.count} onSync={() => syncToSupabase('orders')} isDisabled={!isSupabaseAvailable || syncState.orders.status === 'syncing'} />
          
          <DataSyncItem title="Activity Logs" description="User interaction and system event logs" status={syncState.activity_logs.status} message={syncState.activity_logs.message} lastSynced={syncState.activity_logs.lastSynced} count={syncState.activity_logs.count} onSync={() => syncToSupabase('activity_logs')} isDisabled={!isSupabaseAvailable || syncState.activity_logs.status === 'syncing'} />
        </div>
        
        {!isSupabaseAvailable && <div className="mt-6 p-4 bg-amber-900/20 border border-amber-700/30 rounded-lg" data-unique-id="91c8e945-91c3-43d7-87b2-9a92a2dfb724" data-file-name="app/admin/database/page.tsx">
            <div className="flex items-start" data-unique-id="62ba3e81-ee8f-4c03-8945-38723f5df6a1" data-file-name="app/admin/database/page.tsx">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
              <div data-unique-id="ba59c170-a3ed-4313-b2c0-a12901bcd544" data-file-name="app/admin/database/page.tsx">
                <p className="text-amber-400 font-medium" data-unique-id="fdf2996c-87bc-4e90-96aa-ca5a56ad4f36" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="12c52924-38c8-4a71-b9b1-086cd3709fb5" data-file-name="app/admin/database/page.tsx">Supabase Connection Required</span></p>
                <p className="text-sm text-amber-300/80 mt-1" data-unique-id="bed3e71d-b17a-40cd-8ef0-f1269d79e4c0" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="34bf52df-9783-475b-a79d-bae11cd06a61" data-file-name="app/admin/database/page.tsx">
                  To enable data synchronization, you need to configure your Supabase connection.
                  Add the following environment variables to your project:
                </span></p>
                <div className="mt-3 p-3 bg-gray-900/50 rounded font-mono text-xs text-amber-300/90" data-unique-id="6f1bfbcb-2fb1-42c3-970e-d81ef43b4821" data-file-name="app/admin/database/page.tsx">
                  <p data-unique-id="c1434dd8-0e23-4d2c-91d3-32fee171fae3" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="8748d4d1-4270-4119-8621-497837a52bdd" data-file-name="app/admin/database/page.tsx">NEXT_PUBLIC_SUPABASE_URL=your-project-url</span></p>
                  <p data-unique-id="81afde60-e510-4047-8ce4-00342dc17901" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="ce1a9588-ed5c-4860-9615-4d756d5cc68f" data-file-name="app/admin/database/page.tsx">NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key</span></p>
                </div>
              </div>
            </div>
          </div>}
      </div>
      
      {/* Database Management */}
      {isSupabaseAvailable && <div className="bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="313885ae-4225-40b5-9ae2-32ed24ddc55c" data-file-name="app/admin/database/page.tsx">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center" data-unique-id="3f824efa-b6b8-4017-90fd-a4bc6b011d56" data-file-name="app/admin/database/page.tsx">
            <Database className="h-5 w-5 mr-2 text-indigo-400" /><span className="editable-text" data-unique-id="6771d854-e81f-4472-8131-d6a9830a5320" data-file-name="app/admin/database/page.tsx">
            Database Management
          </span></h2>
          
          <div className="space-y-4" data-unique-id="5cf03d7c-cf25-465c-84f0-6fdf0a3d761e" data-file-name="app/admin/database/page.tsx">
            <div className="p-4 border border-gray-700 rounded-lg" data-unique-id="bf686506-072c-40ee-ab4d-a95e06e8aa1d" data-file-name="app/admin/database/page.tsx">
              <h3 className="text-lg font-medium text-white mb-2" data-unique-id="005559dd-9daa-4a3d-8326-70ba4a5310b1" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="abf70b80-5e3b-4276-b646-ae6184099db6" data-file-name="app/admin/database/page.tsx">Export Database</span></h3>
              <p className="text-sm text-gray-400 mb-4" data-unique-id="198aeba7-2164-4f4b-b851-1ec974fbe640" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="035025b6-91f7-4f08-80d5-170ce5f02061" data-file-name="app/admin/database/page.tsx">
                Download a backup of all your data from Supabase. This includes all tables and records.
              </span></p>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center" onClick={() => alert('This feature would export a full Supabase database backup')} data-unique-id="a21c9957-843c-4aba-be01-0a4e0ba5df07" data-file-name="app/admin/database/page.tsx">
                <Download className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="a5a4893b-0fde-4593-8d79-38e5bfe8de04" data-file-name="app/admin/database/page.tsx">
                Export Database
              </span></button>
            </div>
            
            <div className="p-4 border border-gray-700 rounded-lg bg-red-900/10" data-unique-id="1a75ad2b-02d5-4996-b31d-7decfa7b4b22" data-file-name="app/admin/database/page.tsx">
              <h3 className="text-lg font-medium text-white mb-2" data-unique-id="6098be35-b57d-4e9c-b21f-6bf5b3182c52" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="4552676e-da06-4c99-85e3-289463ca912e" data-file-name="app/admin/database/page.tsx">Danger Zone</span></h3>
              <p className="text-sm text-gray-400 mb-4" data-unique-id="b83b2cc2-13db-4061-9f2d-129dcf0653b1" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="c335d004-151e-4da9-9d47-333d15616c73" data-file-name="app/admin/database/page.tsx">
                These actions cannot be undone. Be careful when performing these operations.
              </span></p>
              <div className="flex space-x-4" data-unique-id="2ef36461-9785-4306-93c5-b83713769bef" data-file-name="app/admin/database/page.tsx">
                <button className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-md flex items-center" onClick={() => {
              if (window.confirm('Are you sure you want to clear all Supabase data? This action cannot be undone.')) {
                alert('This would clear all Supabase data in a real implementation');
              }
            }} data-unique-id="6eabcc4c-6aea-4c57-ab7d-7b21b2cf5ea0" data-file-name="app/admin/database/page.tsx">
                  <Trash2 className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="1a598100-0315-4b2a-9935-15e5383d3658" data-file-name="app/admin/database/page.tsx">
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
  }} className="p-5 bg-gray-700/30 border border-gray-700 rounded-lg" data-unique-id="8475bef8-be29-44bc-845d-f3a66ddabd4e" data-file-name="app/admin/database/page.tsx">
      <div className="flex justify-between" data-unique-id="0befb270-8a03-472a-a979-f30081685032" data-file-name="app/admin/database/page.tsx">
        <div data-unique-id="f0256f84-8f8b-4139-9e9c-0c5d887e4eed" data-file-name="app/admin/database/page.tsx">
          <h3 className="text-lg font-medium text-white" data-unique-id="ea41bdab-bf32-4eda-90d4-2ef208f7abe5" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">{title}</h3>
          <p className="text-sm text-gray-400 mt-1" data-unique-id="3533fa3c-3632-429d-ae73-abe6d596a952" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">{description}</p>
          
          <div className="mt-3 flex items-center space-x-4" data-unique-id="4c32c6a5-2dca-4a4b-ab20-dbbf8d0f0c1a" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">
            <div className={`flex items-center ${getStatusColor()}`} data-unique-id="27e1ca08-760d-4887-8e8e-a84a8eab2287" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">
              {status === 'syncing' ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <div className="h-2 w-2 rounded-full bg-current mr-2" data-unique-id="00a5ca6a-f5d7-4406-8d37-8c8806f00bff" data-file-name="app/admin/database/page.tsx"></div>}
              <span className="text-sm capitalize" data-unique-id="76d33cdb-e411-4677-a81d-849d8198e65f" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">{status}</span>
            </div>
            
            {message && <span className="text-sm text-gray-400" data-unique-id="bf2782a3-a220-4349-a2db-ec4de5fe3b67" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">{message}</span>}
          </div>
        </div>
        
        <div className="flex flex-col items-end" data-unique-id="d4fab44c-7b56-4ec1-8f0f-98636c5cd1d9" data-file-name="app/admin/database/page.tsx">
          <button onClick={onSync} disabled={isDisabled} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed" data-unique-id="3dc5549c-aa54-4078-90b2-6eba83e46082" data-file-name="app/admin/database/page.tsx">
            <Upload className="h-3.5 w-3.5 mr-1.5" /><span className="editable-text" data-unique-id="5f9015b7-ada0-4935-ad26-19e4d29e5f71" data-file-name="app/admin/database/page.tsx">
            Sync
          </span></button>
          
          <div className="mt-3 text-right" data-unique-id="bf7e1d4c-dfca-4b0c-860b-0eaf74f40695" data-file-name="app/admin/database/page.tsx">
            <div className="text-sm text-gray-400" data-unique-id="a93b3a23-07d1-4adb-9c14-550ede5636c9" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">
              {count}<span className="editable-text" data-unique-id="242b2508-a538-45aa-9d3a-779fe2feac00" data-file-name="app/admin/database/page.tsx"> records
            </span></div>
            <div className="text-xs text-gray-500 mt-1" data-unique-id="211c5ed1-3f87-4c76-9cf9-c2ecbc5d3286" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="6c12ff08-b876-49be-ad29-6205410944d4" data-file-name="app/admin/database/page.tsx">
              Last synced: </span>{formattedLastSynced}
            </div>
          </div>
        </div>
      </div>
    </motion.div>;
}