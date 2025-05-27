'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useActivityStore } from '@/lib/activity-store';
import { useAdminAuth } from '@/lib/admin-auth';
import { Settings, ToggleLeft, ToggleRight, Save, AlertTriangle, CheckCircle, Loader2, Trash2, ShieldAlert } from 'lucide-react';
export default function SettingsPage() {
  const {
    currentUser,
    isDemoLoginEnabled,
    toggleDemoLogin
  } = useAdminAuth();
  const {
    isTracking,
    fetchAllLogs,
    clearLogs
  } = useActivityStore();
  const [trackingEnabled, setTrackingEnabled] = useState(isTracking);
  const [demoLoginEnabled, setDemoLoginEnabled] = useState(isDemoLoginEnabled);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Toggle activity tracking
  const toggleTracking = () => {
    setTrackingEnabled(!trackingEnabled);
  };

  // Initialize demo login state
  useEffect(() => {
    setDemoLoginEnabled(isDemoLoginEnabled);
  }, [isDemoLoginEnabled]);

  // Save settings
  const saveSettings = async () => {
    try {
      setIsSaving(true);
      setSaveMessage(null);

      // Update tracking setting in store
      useActivityStore.setState({
        isTracking: trackingEnabled
      });

      // Update demo login setting
      toggleDemoLogin(demoLoginEnabled);

      // Show success message
      setSaveMessage({
        type: 'success',
        text: 'Settings saved successfully'
      });

      // Clear message after a delay
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage({
        type: 'error',
        text: 'Failed to save settings'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle clearing all logs
  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear all activity logs? This action cannot be undone.')) {
      clearLogs();
      setSaveMessage({
        type: 'success',
        text: 'All activity logs cleared'
      });

      // Clear message after a delay
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    }
  };
  return <div className="space-y-6" data-unique-id="029a9305-47c7-459c-bf73-70515e047bf4" data-file-name="app/admin/settings/page.tsx">
      <div className="flex justify-between items-center" data-unique-id="954f1c54-33c0-4b12-83e3-1dd8f9249f01" data-file-name="app/admin/settings/page.tsx">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3" data-unique-id="a5f4b491-ed69-47e0-babe-d7375b44d9d4" data-file-name="app/admin/settings/page.tsx">
          <Settings className="h-8 w-8 text-indigo-400" /><span className="editable-text" data-unique-id="4d52f6fd-d8f3-48ed-8bb5-b01f47f51ce4" data-file-name="app/admin/settings/page.tsx">
          Admin Settings
        </span></h1>
      </div>
      
      <div className="bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="ee7be8ad-4ecb-457b-b6c9-b71f7bf4adef" data-file-name="app/admin/settings/page.tsx">
        <h2 className="text-xl font-semibold text-white mb-6" data-unique-id="c03348b1-cf47-4d77-a1de-0f41d8f3a766" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="8b21651a-3a28-4dc1-8602-e6a959541342" data-file-name="app/admin/settings/page.tsx">Activity Tracking</span></h2>
        
        <div className="space-y-6" data-unique-id="0b851cc2-1967-43ee-bb0e-8c8f2416e46c" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">
          <div className="flex justify-between items-center p-4 rounded-lg border border-gray-700 bg-gray-700/30" data-unique-id="762987f3-dc2c-4e83-a550-45b45b95395b" data-file-name="app/admin/settings/page.tsx">
            <div data-unique-id="6153c093-e2a7-4cfa-b2b6-c94e6ec9bb5e" data-file-name="app/admin/settings/page.tsx">
              <h3 className="text-lg font-medium text-white mb-1" data-unique-id="5ebe2fbd-d734-4704-9717-7e1346e24f89" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="14065746-0770-4cdf-af1d-0c6dbfdd57be" data-file-name="app/admin/settings/page.tsx">Enable Activity Tracking</span></h3>
              <p className="text-sm text-gray-400" data-unique-id="923c9061-859e-4e13-8aec-b614ce4cd994" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="d0670388-29cb-48fd-a6c9-13220dd6ce8e" data-file-name="app/admin/settings/page.tsx">
                Track user actions and system events across the application
              </span></p>
            </div>
            
            <button onClick={toggleTracking} className="text-2xl" aria-label={trackingEnabled ? "Disable tracking" : "Enable tracking"} data-unique-id="cfa574c1-3a02-440e-b15a-baff8a6128e2" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">
              {trackingEnabled ? <ToggleRight className="h-8 w-8 text-green-400" /> : <ToggleLeft className="h-8 w-8 text-gray-500" />}
            </button>
          </div>
          
          <div className="flex justify-between items-center p-4 rounded-lg border border-gray-700 bg-gray-700/30" data-unique-id="7386e3fc-9ea5-4292-90de-8d0f51516c9f" data-file-name="app/admin/settings/page.tsx">
            <div data-unique-id="64dfbde3-d70b-47a6-a516-d554663cfafb" data-file-name="app/admin/settings/page.tsx">
              <h3 className="text-lg font-medium text-white mb-1 flex items-center" data-unique-id="cd3be3cc-5354-4cfc-b8bc-13761bbe7c00" data-file-name="app/admin/settings/page.tsx">
                <ShieldAlert className="h-5 w-5 text-amber-400 mr-2" />
                <span className="editable-text" data-unique-id="eb3a593f-a245-4f44-baf9-a6820fd10fb1" data-file-name="app/admin/settings/page.tsx">Allow Demo Login</span>
              </h3>
              <p className="text-sm text-gray-400" data-unique-id="d1077800-fb35-4d3f-a2b9-2cf3f8ade19c" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="6fe285a0-c06f-4a0e-bb67-e361337b8472" data-file-name="app/admin/settings/page.tsx">
                Enable or disable the demo login functionality (password: demo123)
              </span></p>
            </div>
            
            <button onClick={() => setDemoLoginEnabled(!demoLoginEnabled)} className="text-2xl" aria-label={demoLoginEnabled ? "Disable demo login" : "Enable demo login"} data-unique-id="e98541f3-7c74-48ed-9361-d97b1557cd08" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">
              {demoLoginEnabled ? <ToggleRight className="h-8 w-8 text-green-400" /> : <ToggleLeft className="h-8 w-8 text-gray-500" />}
            </button>
          </div>
          
          <div className="flex justify-between items-center p-4 rounded-lg border border-gray-700 bg-gray-700/30" data-unique-id="2d5d0498-d206-4325-bb1f-9e95ab966b2b" data-file-name="app/admin/settings/page.tsx">
            <div data-unique-id="b02380e7-416a-4865-9765-04c652fd5f6a" data-file-name="app/admin/settings/page.tsx">
              <h3 className="text-lg font-medium text-white mb-1" data-unique-id="ac13821b-207c-466b-8f8a-b726daaf77a2" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="28c11a75-03d4-486c-aa87-c24b022b0734" data-file-name="app/admin/settings/page.tsx">Clear Activity Logs</span></h3>
              <p className="text-sm text-gray-400" data-unique-id="b53eec5e-ae7e-4bf7-92cf-b2c97c1c50fa" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="91be47aa-2567-4ce3-857c-7a0c256b790d" data-file-name="app/admin/settings/page.tsx">
                Permanently remove all activity logs from the system
              </span></p>
            </div>
            
            <button onClick={handleClearLogs} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center" data-unique-id="7b21bee6-cabe-43ef-ba8f-c2652b1dd86a" data-file-name="app/admin/settings/page.tsx">
              <Trash2 className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="36f22c56-1a21-43fe-9a6f-a54cfb308be6" data-file-name="app/admin/settings/page.tsx">
              Clear Logs
            </span></button>
          </div>
          
          <div className="flex justify-between items-center p-4 rounded-lg border border-gray-700 bg-gray-700/30" data-unique-id="9f48733b-4009-46b4-8c11-c1a774532270" data-file-name="app/admin/settings/page.tsx">
            <div data-unique-id="26198373-ea98-4e3e-b737-8d26106394fe" data-file-name="app/admin/settings/page.tsx">
              <h3 className="text-lg font-medium text-white mb-1" data-unique-id="8983293f-503c-4e32-92b7-15f7a6d792b7" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="170ef6b9-7d93-4000-872a-8f99096cd93a" data-file-name="app/admin/settings/page.tsx">Refresh Activity Data</span></h3>
              <p className="text-sm text-gray-400" data-unique-id="411322b0-ab68-4b10-a4be-a0a846767ef4" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="0fefbe38-432f-4e23-8155-8ce9067a766f" data-file-name="app/admin/settings/page.tsx">
                Fetch latest activity logs from the database
              </span></p>
            </div>
            
            <button onClick={() => fetchAllLogs()} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md" data-unique-id="593531fb-43f4-48b5-ae4f-fcc8b60cabbb" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="ad52cf90-1ded-4f35-9326-353505251c31" data-file-name="app/admin/settings/page.tsx">
              Refresh Data
            </span></button>
          </div>
          
          {/* Account Information */}
          <div className="pt-6 mt-6 border-t border-gray-700" data-unique-id="ef4e149c-5e79-4894-8b10-5bade75641ca" data-file-name="app/admin/settings/page.tsx">
            <h2 className="text-xl font-semibold text-white mb-4" data-unique-id="cd89ad88-d3b4-4aae-85a3-07d0a798b6df" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="8bf99443-d24c-4a60-9ed0-c91b9cfd0161" data-file-name="app/admin/settings/page.tsx">Account Information</span></h2>
            
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg border border-gray-700 bg-gray-700/30" data-unique-id="a1458ca7-f252-40c2-a85e-7869a47e4f7d" data-file-name="app/admin/settings/page.tsx">
              <div data-unique-id="35114a2f-e800-449a-b324-2a0f9aef1edc" data-file-name="app/admin/settings/page.tsx">
                <h3 className="text-sm font-medium text-gray-400" data-unique-id="ff7d9413-ff81-476e-9374-8bda2edfbf99" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="2f07e539-d5bb-4ee8-b603-6bc4582fd97d" data-file-name="app/admin/settings/page.tsx">Username</span></h3>
                <p className="text-base text-white mt-1" data-unique-id="35222b0a-75bb-48bc-ad1e-7d5c0426564b" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">{currentUser?.username}</p>
              </div>
              <div data-unique-id="9ddebce0-d95f-4418-8c1d-4738d9a34fcc" data-file-name="app/admin/settings/page.tsx">
                <h3 className="text-sm font-medium text-gray-400" data-unique-id="abc0dd99-4d04-4eb0-b934-23c4fb19df97" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="3b96e65e-3cde-42c4-aa8c-74ddee7578e5" data-file-name="app/admin/settings/page.tsx">Role</span></h3>
                <p className="text-base text-white mt-1" data-unique-id="8dafda1f-5f0a-4d74-bd03-596b4de62cb3" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">{currentUser?.role}</p>
              </div>
              <div data-unique-id="6238ae39-c547-4678-bad7-812e2e614663" data-file-name="app/admin/settings/page.tsx">
                <h3 className="text-sm font-medium text-gray-400" data-unique-id="fdcb0b43-0c6f-4273-bd07-28146767413f" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="e7a52ef0-b738-4dae-9c9d-d0d6bf47f535" data-file-name="app/admin/settings/page.tsx">Email</span></h3>
                <p className="text-base text-white mt-1" data-unique-id="a6b27a3d-63fd-44dd-b46a-66c6c167a0d8" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">{currentUser?.email}</p>
              </div>
              <div data-unique-id="76320d1b-2a74-45a1-9775-53d738bd7333" data-file-name="app/admin/settings/page.tsx">
                <h3 className="text-sm font-medium text-gray-400" data-unique-id="cd4605a6-6ddf-44d0-b3ec-54e90cc27a0e" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="22f4fcd0-dbeb-43bf-8f04-20dcafdb6f0b" data-file-name="app/admin/settings/page.tsx">Joined</span></h3>
                <p className="text-base text-white mt-1" data-unique-id="4acdf9dd-6737-4f60-96ce-f5944b9225e8" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">
                  {currentUser?.created_at ? new Date(currentUser.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Save Section */}
          <div className="pt-6 flex items-center justify-between" data-unique-id="5631e74f-8e1e-4829-be3c-c30da3ff9ff8" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">
            {saveMessage && <motion.div initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} className={`flex items-center px-4 py-2 rounded-md ${saveMessage.type === 'success' ? 'bg-green-900/30 text-green-400 border border-green-800/40' : 'bg-red-900/30 text-red-400 border border-red-800/40'}`} data-unique-id="be019861-56a8-411f-9a63-e1258ba62b47" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">
                {saveMessage.type === 'success' ? <CheckCircle className="h-4 w-4 mr-2" /> : <AlertTriangle className="h-4 w-4 mr-2" />}
                {saveMessage.text}
              </motion.div>}
            
            <button onClick={saveSettings} disabled={isSaving} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center" data-unique-id="f3107f15-f4e8-4eb4-970c-9a86669c10da" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">
              {isSaving ? <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </> : <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </>}
            </button>
          </div>
        </div>
      </div>
    </div>;
}