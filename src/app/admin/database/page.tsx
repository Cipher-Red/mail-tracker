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
  return <div className="space-y-6" data-unique-id="2008097a-8143-49b8-98d0-4973806d0058" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">
      <div className="flex justify-between items-center" data-unique-id="7ef43596-22aa-45d5-b748-b2a55adca5cd" data-file-name="app/admin/database/page.tsx">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3" data-unique-id="d84868bb-2460-4ef9-abae-b299e5f6ec41" data-file-name="app/admin/database/page.tsx">
          <Database className="h-8 w-8 text-indigo-400" /><span className="editable-text" data-unique-id="17e49aba-9688-4aa4-ae5a-049b41e55492" data-file-name="app/admin/database/page.tsx">
          Database Management
        </span></h1>
      </div>
      
      {/* Supabase Connection Status */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="af369572-3f34-4867-88d9-ac5add71dfed" data-file-name="app/admin/database/page.tsx">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center" data-unique-id="6bce07d3-dd7f-4c23-bc6a-49841f5b4873" data-file-name="app/admin/database/page.tsx">
          <Database className="h-5 w-5 mr-2 text-indigo-400" /><span className="editable-text" data-unique-id="9731a490-5f6d-4237-a0d7-7ea24764c290" data-file-name="app/admin/database/page.tsx">
          Supabase Connection Status
        </span></h2>
        
        <div className="p-4 rounded-lg border border-gray-700 bg-gray-700/30" data-unique-id="1b6f7486-5239-497b-99f3-baca5408a732" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">
          {isCheckingConnection ? <div className="flex items-center justify-center py-4" data-unique-id="bd79e630-0b79-4099-a187-5ad0152ee345" data-file-name="app/admin/database/page.tsx">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-400 mr-3" />
              <span className="text-gray-300" data-unique-id="8cfa42c1-6db5-4a7d-af3e-ec7f81f985d1" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="5483e18b-ebe3-4ab7-93cf-a8b612866d27" data-file-name="app/admin/database/page.tsx">Checking connection...</span></span>
            </div> : isSupabaseAvailable ? <div className="flex items-center text-green-400" data-unique-id="2a1fe5de-b57d-4a05-b966-cd10b8927df4" data-file-name="app/admin/database/page.tsx">
              <Check className="h-6 w-6 mr-2" />
              <div data-unique-id="064b3706-5ad9-4e93-9b5f-6253a7da97e6" data-file-name="app/admin/database/page.tsx">
                <p className="font-medium" data-unique-id="b91fffd9-dff0-4478-8b2f-a3ba50aa6b16" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="1e854595-f784-442e-836f-324b73ad640b" data-file-name="app/admin/database/page.tsx">Connected to Supabase</span></p>
                <p className="text-sm text-gray-300 mt-1" data-unique-id="fde1f245-9d11-4eb9-9ddc-2b604d5aa4d3" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="c89cc1d2-5a11-451e-b0fd-bdbb5321e7c4" data-file-name="app/admin/database/page.tsx">
                  Database synchronization is available
                </span></p>
              </div>
            </div> : <div className="flex items-center text-red-400" data-unique-id="25fd7ae9-39da-4492-a976-18f324dcb996" data-file-name="app/admin/database/page.tsx">
              <X className="h-6 w-6 mr-2" />
              <div data-unique-id="ba0fb3bf-0a87-44be-8129-4e7b9e75873e" data-file-name="app/admin/database/page.tsx">
                <p className="font-medium" data-unique-id="7d626227-c061-4ba1-a5d3-9f5f31ffa80a" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="c0ee5734-0062-4845-b3c1-50f72a9e547f" data-file-name="app/admin/database/page.tsx">Not Connected to Supabase</span></p>
                <p className="text-sm text-gray-300 mt-1" data-unique-id="6abf8e01-9cd8-43b6-8d5b-e7de73f8168d" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="43ea2c96-3e3d-4815-837a-c5b6248f4f73" data-file-name="app/admin/database/page.tsx">
                  Ensure you've configured the NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
                  environment variables.
                </span></p>
              </div>
            </div>}
        </div>
      </div>
      
      {/* Data Sync Controls */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="addd6ed3-c78a-4f16-a524-4481738f50c6" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">
        <div className="flex justify-between items-center mb-6" data-unique-id="3d231462-8117-46ea-ae66-539de391d1b4" data-file-name="app/admin/database/page.tsx">
          <h2 className="text-xl font-semibold text-white flex items-center" data-unique-id="83554443-2227-406b-9b3c-402c7aadae9a" data-file-name="app/admin/database/page.tsx">
            <Upload className="h-5 w-5 mr-2 text-indigo-400" /><span className="editable-text" data-unique-id="e9d59531-a73b-4655-91a8-baff30d5351f" data-file-name="app/admin/database/page.tsx">
            Data Synchronization
          </span></h2>
          
          <button disabled={!isSupabaseAvailable || Object.values(syncState).some(s => s.status === 'syncing')} onClick={syncAll} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed" data-unique-id="e8062196-dc3b-4be0-9f6b-7501aae6fc1c" data-file-name="app/admin/database/page.tsx">
            <RefreshCw className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="4480c9b0-e5d0-46ad-870b-571361303018" data-file-name="app/admin/database/page.tsx">
            Sync All Data
          </span></button>
        </div>
        
        <div className="space-y-4" data-unique-id="4527a0ca-4676-40ef-868a-16431520a92b" data-file-name="app/admin/database/page.tsx">
          <DataSyncItem title="Customer Data" description="User profiles and contact information" status={syncState.customers.status} message={syncState.customers.message} lastSynced={syncState.customers.lastSynced} count={syncState.customers.count} onSync={() => syncToSupabase('customers')} isDisabled={!isSupabaseAvailable || syncState.customers.status === 'syncing'} />
          
          <DataSyncItem title="Email Templates" description="Saved email templates and designs" status={syncState.templates.status} message={syncState.templates.message} lastSynced={syncState.templates.lastSynced} count={syncState.templates.count} onSync={() => syncToSupabase('templates')} isDisabled={!isSupabaseAvailable || syncState.templates.status === 'syncing'} />
          
          <DataSyncItem title="Orders" description="Customer orders and tracking information" status={syncState.orders.status} message={syncState.orders.message} lastSynced={syncState.orders.lastSynced} count={syncState.orders.count} onSync={() => syncToSupabase('orders')} isDisabled={!isSupabaseAvailable || syncState.orders.status === 'syncing'} />
          
          <DataSyncItem title="Activity Logs" description="User interaction and system event logs" status={syncState.activity_logs.status} message={syncState.activity_logs.message} lastSynced={syncState.activity_logs.lastSynced} count={syncState.activity_logs.count} onSync={() => syncToSupabase('activity_logs')} isDisabled={!isSupabaseAvailable || syncState.activity_logs.status === 'syncing'} />
        </div>
        
        {!isSupabaseAvailable && <div className="mt-6 p-4 bg-amber-900/20 border border-amber-700/30 rounded-lg" data-unique-id="9acbe0e5-019c-49b9-8a12-583cf4a23fdd" data-file-name="app/admin/database/page.tsx">
            <div className="flex items-start" data-unique-id="983e95bf-190f-4e3f-8f31-b94c2e02010e" data-file-name="app/admin/database/page.tsx">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
              <div data-unique-id="0df960d4-00d0-48f5-9ad9-0acc187996b6" data-file-name="app/admin/database/page.tsx">
                <p className="text-amber-400 font-medium" data-unique-id="6c9c7780-0305-42d3-90dd-e0696ab4c8d5" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="c6dd6b06-4231-479b-95f4-f427c6d923e5" data-file-name="app/admin/database/page.tsx">Supabase Connection Required</span></p>
                <p className="text-sm text-amber-300/80 mt-1" data-unique-id="1d45f859-565e-4464-a87b-a09293213ab8" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="87cd299e-d1cf-41e5-a5e6-03d815c40fdc" data-file-name="app/admin/database/page.tsx">
                  To enable data synchronization, you need to configure your Supabase connection.
                  Add the following environment variables to your project:
                </span></p>
                <div className="mt-3 p-3 bg-gray-900/50 rounded font-mono text-xs text-amber-300/90" data-unique-id="aee7fb50-97da-4475-a4f9-d3349cd1cabc" data-file-name="app/admin/database/page.tsx">
                  <p data-unique-id="840b1d01-c254-4d5a-b755-8a7abc545648" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="51d2d325-2b70-44c5-87f2-9e1a28cd5438" data-file-name="app/admin/database/page.tsx">NEXT_PUBLIC_SUPABASE_URL=your-project-url</span></p>
                  <p data-unique-id="9ec7bf1f-154f-4fcc-8bc7-6cfe5266e828" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="1ed5b2ba-6a5a-47e7-a88e-0d3b65ae6c68" data-file-name="app/admin/database/page.tsx">NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key</span></p>
                </div>
              </div>
            </div>
          </div>}
      </div>
      
      {/* Database Management */}
      {isSupabaseAvailable && <div className="bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="bd7e9562-f247-4cdf-a7cf-3fbd301138db" data-file-name="app/admin/database/page.tsx">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center" data-unique-id="be999acd-1ab1-4a92-b7c4-f38f518f7cb3" data-file-name="app/admin/database/page.tsx">
            <Database className="h-5 w-5 mr-2 text-indigo-400" /><span className="editable-text" data-unique-id="8ec32313-cf94-4bba-999e-c11bbfff83c7" data-file-name="app/admin/database/page.tsx">
            Database Management
          </span></h2>
          
          <div className="space-y-4" data-unique-id="7fed12f3-6e69-4cee-a52f-9022cd65ab62" data-file-name="app/admin/database/page.tsx">
            <div className="p-4 border border-gray-700 rounded-lg" data-unique-id="e24467de-596c-47b9-96a0-5c8057109261" data-file-name="app/admin/database/page.tsx">
              <h3 className="text-lg font-medium text-white mb-2" data-unique-id="1460dd92-14cb-4183-af39-9855aa556bb2" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="e46240a3-f860-47c0-b591-a127a50d4417" data-file-name="app/admin/database/page.tsx">Export Database</span></h3>
              <p className="text-sm text-gray-400 mb-4" data-unique-id="ea8f6417-738a-430c-8497-ca7154c349ff" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="aa3bf368-ed2d-4591-96af-b03164c9db39" data-file-name="app/admin/database/page.tsx">
                Download a backup of all your data from Supabase. This includes all tables and records.
              </span></p>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center" onClick={() => alert('This feature would export a full Supabase database backup')} data-unique-id="ff3876ea-c937-48db-8a95-d3cf92762c7e" data-file-name="app/admin/database/page.tsx">
                <Download className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="7f4b37d1-6b3d-4ef1-b85d-d8f1e6862d48" data-file-name="app/admin/database/page.tsx">
                Export Database
              </span></button>
            </div>
            
            <div className="p-4 border border-gray-700 rounded-lg bg-red-900/10" data-unique-id="17726caf-de68-4bc2-8d57-89c3536324c5" data-file-name="app/admin/database/page.tsx">
              <h3 className="text-lg font-medium text-white mb-2" data-unique-id="3e6ace74-aae4-4602-aebe-e6e994864f07" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="c7b17a04-53c8-46e9-b54d-45ad04ce18d0" data-file-name="app/admin/database/page.tsx">Danger Zone</span></h3>
              <p className="text-sm text-gray-400 mb-4" data-unique-id="835606ec-2e93-46e6-828d-93e7536e872e" data-file-name="app/admin/database/page.tsx"><span className="editable-text" data-unique-id="3e60783e-90bf-43e8-8c77-15bd5c6b7da1" data-file-name="app/admin/database/page.tsx">
                These actions cannot be undone. Be careful when performing these operations.
              </span></p>
              <div className="flex space-x-4" data-unique-id="7bcc14d6-6224-4ffa-a205-01b2efe70b12" data-file-name="app/admin/database/page.tsx">
                <button className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-md flex items-center" onClick={() => {
              if (window.confirm('Are you sure you want to clear all Supabase data? This action cannot be undone.')) {
                alert('This would clear all Supabase data in a real implementation');
              }
            }} data-unique-id="50e8aedf-9773-4684-b936-5a273bd6c341" data-file-name="app/admin/database/page.tsx">
                  <Trash2 className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="f997501a-49b2-49b9-a1e5-08ec89ebfe96" data-file-name="app/admin/database/page.tsx">
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
  }} className="p-5 bg-gray-700/30 border border-gray-700 rounded-lg" data-unique-id="21afe954-c836-4e82-83a9-014a18f318bc" data-file-name="app/admin/database/page.tsx">
      <div className="flex justify-between" data-unique-id="c29fa499-3e77-4669-b264-2bce15fe128e" data-file-name="app/admin/database/page.tsx">
        <div data-unique-id="7c1bb91d-a248-481c-acf7-9c5955354eab" data-file-name="app/admin/database/page.tsx">
          <h3 className="text-lg font-medium text-white" data-unique-id="ad3369f4-a377-47c1-bb0a-a59f254bd5d6" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">{title}</h3>
          <p className="text-sm text-gray-400 mt-1" data-unique-id="0d7d7dc5-b74d-4cc8-976b-dee3d5474d48" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">{description}</p>
          
          <div className="mt-3 flex items-center space-x-4" data-unique-id="fd29cf22-1454-4996-b575-12ab9ae9ac90" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">
            <div className={`flex items-center ${getStatusColor()}`} data-unique-id="976b94ed-4256-454c-81b6-3943af06edab" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">
              {status === 'syncing' ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <div className="h-2 w-2 rounded-full bg-current mr-2" data-unique-id="2bbb0a6d-aec5-4519-84e6-5ec77c012a9d" data-file-name="app/admin/database/page.tsx"></div>}
              <span className="text-sm capitalize" data-unique-id="73f08a2c-4b1a-4554-92e1-9b90ef2b3fd2" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">{status}</span>
            </div>
            
            {message && <span className="text-sm text-gray-400" data-unique-id="647881ae-4354-4054-a05d-e9a81db0cdb6" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">{message}</span>}
          </div>
        </div>
        
        <div className="flex flex-col items-end" data-unique-id="17b9c391-a9c1-4e54-b4e3-15206d5f5b47" data-file-name="app/admin/database/page.tsx">
          <button onClick={onSync} disabled={isDisabled} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed" data-unique-id="72094e78-7c0f-4822-9477-1d6169f3a553" data-file-name="app/admin/database/page.tsx">
            <Upload className="h-3.5 w-3.5 mr-1.5" /><span className="editable-text" data-unique-id="e5ff85f5-1687-4ae8-8e8d-e9f5a8bd7334" data-file-name="app/admin/database/page.tsx">
            Sync
          </span></button>
          
          <div className="mt-3 text-right" data-unique-id="586b14b8-1c8b-4416-8406-f64a1e714910" data-file-name="app/admin/database/page.tsx">
            <div className="text-sm text-gray-400" data-unique-id="2dce5ab9-79ae-484b-84a5-4dd1020b694d" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true">
              {count}<span className="editable-text" data-unique-id="5fbadc8b-fa24-4daf-81cb-fc3c3ef43e17" data-file-name="app/admin/database/page.tsx"> records
            </span></div>
            <div className="text-xs text-gray-500 mt-1" data-unique-id="9ad30bda-f0f3-4b7f-a267-6e326034cca2" data-file-name="app/admin/database/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="ff26c7ec-f153-4a91-8b4b-d56eb5c23799" data-file-name="app/admin/database/page.tsx">
              Last synced: </span>{formattedLastSynced}
            </div>
          </div>
        </div>
      </div>
    </motion.div>;
}