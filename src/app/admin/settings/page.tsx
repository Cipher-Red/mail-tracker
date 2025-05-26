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
  return <div className="space-y-6" data-unique-id="ff3f9ab0-a35f-410f-b3fc-88bf27423ed3" data-file-name="app/admin/settings/page.tsx">
      <div className="flex justify-between items-center" data-unique-id="c32d3f5a-1aa8-4674-bc0a-93980394132a" data-file-name="app/admin/settings/page.tsx">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3" data-unique-id="ed1e0fd0-575c-4135-99dc-b29be4bfd399" data-file-name="app/admin/settings/page.tsx">
          <Settings className="h-8 w-8 text-indigo-400" /><span className="editable-text" data-unique-id="79b2c201-fae6-4e2e-a02f-d938c65554f2" data-file-name="app/admin/settings/page.tsx">
          Admin Settings
        </span></h1>
      </div>
      
      <div className="bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="bd339e15-162c-4ee7-9594-8882640905c0" data-file-name="app/admin/settings/page.tsx">
        <h2 className="text-xl font-semibold text-white mb-6" data-unique-id="82cb31c3-7609-46bb-8457-d34f5a884d19" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="b986962a-cc35-4407-8564-5dc6d75a943c" data-file-name="app/admin/settings/page.tsx">Activity Tracking</span></h2>
        
        <div className="space-y-6" data-unique-id="9550f6fb-a5eb-4262-93a5-941f06d82497" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">
          <div className="flex justify-between items-center p-4 rounded-lg border border-gray-700 bg-gray-700/30" data-unique-id="e03482a6-3331-4c5f-a853-bca6cc2af47a" data-file-name="app/admin/settings/page.tsx">
            <div data-unique-id="3c6dc7ee-3e0b-4663-b2c6-a4b7c43f422e" data-file-name="app/admin/settings/page.tsx">
              <h3 className="text-lg font-medium text-white mb-1" data-unique-id="4be22416-a3e6-40f8-a37b-943c1a4354f3" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="2942ffaa-0c4c-4cd2-92ff-2efaad3a3b18" data-file-name="app/admin/settings/page.tsx">Enable Activity Tracking</span></h3>
              <p className="text-sm text-gray-400" data-unique-id="180f60f5-2656-4f7d-8888-1edc924f6b7f" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="489fe9e5-ffcc-4a64-b989-49f2b0d33df7" data-file-name="app/admin/settings/page.tsx">
                Track user actions and system events across the application
              </span></p>
            </div>
            
            <button onClick={toggleTracking} className="text-2xl" aria-label={trackingEnabled ? "Disable tracking" : "Enable tracking"} data-unique-id="b463d6e2-dadd-426d-b725-479351d8ddf7" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">
              {trackingEnabled ? <ToggleRight className="h-8 w-8 text-green-400" /> : <ToggleLeft className="h-8 w-8 text-gray-500" />}
            </button>
          </div>
          
          <div className="flex justify-between items-center p-4 rounded-lg border border-gray-700 bg-gray-700/30" data-unique-id="3fe2cab4-d27d-44d5-bda2-ea0d65c10c46" data-file-name="app/admin/settings/page.tsx">
            <div data-unique-id="5657629b-c46f-4a26-816b-bb3c810d9217" data-file-name="app/admin/settings/page.tsx">
              <h3 className="text-lg font-medium text-white mb-1 flex items-center" data-unique-id="8dd16cd0-32c0-4d37-b05c-572236b22fc1" data-file-name="app/admin/settings/page.tsx">
                <ShieldAlert className="h-5 w-5 text-amber-400 mr-2" />
                <span className="editable-text" data-unique-id="6403cc9b-86af-40b0-bc06-a363e575e42a" data-file-name="app/admin/settings/page.tsx">Allow Demo Login</span>
              </h3>
              <p className="text-sm text-gray-400" data-unique-id="752f6d84-8c7b-4017-9dfa-74e86b28107d" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="23f28d9e-3f27-4d0d-ad7c-2f93cd97259f" data-file-name="app/admin/settings/page.tsx">
                Enable or disable the demo login functionality (password: demo123)
              </span></p>
            </div>
            
            <button onClick={() => setDemoLoginEnabled(!demoLoginEnabled)} className="text-2xl" aria-label={demoLoginEnabled ? "Disable demo login" : "Enable demo login"} data-unique-id="6df0bedb-24e7-4c45-b3f1-649430112d05" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">
              {demoLoginEnabled ? <ToggleRight className="h-8 w-8 text-green-400" /> : <ToggleLeft className="h-8 w-8 text-gray-500" />}
            </button>
          </div>
          
          <div className="flex justify-between items-center p-4 rounded-lg border border-gray-700 bg-gray-700/30" data-unique-id="536b3d77-f6d2-4f75-bc0e-f410cc3ef9bc" data-file-name="app/admin/settings/page.tsx">
            <div data-unique-id="2ab55cb6-2b22-4bd6-9630-49376f134ba9" data-file-name="app/admin/settings/page.tsx">
              <h3 className="text-lg font-medium text-white mb-1" data-unique-id="17052082-d20f-436c-9675-8607a13e81ba" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="6fcaed25-7dda-4fe2-8bf7-ff60494e490e" data-file-name="app/admin/settings/page.tsx">Clear Activity Logs</span></h3>
              <p className="text-sm text-gray-400" data-unique-id="fb1289b2-1296-4ef2-a4bb-bf863134c929" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="1ea45099-1a11-4523-b932-c671f8b494a1" data-file-name="app/admin/settings/page.tsx">
                Permanently remove all activity logs from the system
              </span></p>
            </div>
            
            <button onClick={handleClearLogs} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center" data-unique-id="a5ac2aac-1876-42f2-b4b4-96009a959c8b" data-file-name="app/admin/settings/page.tsx">
              <Trash2 className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="55ca1749-49ec-4ae5-a2e6-9d0f7fffa44c" data-file-name="app/admin/settings/page.tsx">
              Clear Logs
            </span></button>
          </div>
          
          <div className="flex justify-between items-center p-4 rounded-lg border border-gray-700 bg-gray-700/30" data-unique-id="ef58fc93-3f9b-4022-b728-65a03485e0ac" data-file-name="app/admin/settings/page.tsx">
            <div data-unique-id="a33b99dd-9021-4bdf-9605-c648bc0eb877" data-file-name="app/admin/settings/page.tsx">
              <h3 className="text-lg font-medium text-white mb-1" data-unique-id="a8f4d183-a7f4-4e22-90cf-db66c4d552cf" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="2382fb9b-6f03-421a-971a-b7e25529320f" data-file-name="app/admin/settings/page.tsx">Refresh Activity Data</span></h3>
              <p className="text-sm text-gray-400" data-unique-id="0f06d4d0-4852-45dc-89f1-ea6d701a1eab" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="58faa894-ebb0-4116-bc18-247f089c27c0" data-file-name="app/admin/settings/page.tsx">
                Fetch latest activity logs from the database
              </span></p>
            </div>
            
            <button onClick={() => fetchAllLogs()} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md" data-unique-id="a54f0787-e77a-493c-bc22-b116587f1a30" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="633cbca6-8da1-40bf-8837-5d55653f576f" data-file-name="app/admin/settings/page.tsx">
              Refresh Data
            </span></button>
          </div>
          
          {/* Account Information */}
          <div className="pt-6 mt-6 border-t border-gray-700" data-unique-id="e8e9ef06-8a7e-4d6e-a2a9-a0468f85d614" data-file-name="app/admin/settings/page.tsx">
            <h2 className="text-xl font-semibold text-white mb-4" data-unique-id="3b795445-d216-4e4a-9921-a530dd0b433f" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="a45cebb2-0068-46c2-8bb2-dd89c7cc4ae0" data-file-name="app/admin/settings/page.tsx">Account Information</span></h2>
            
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg border border-gray-700 bg-gray-700/30" data-unique-id="d020e1ff-7653-43d8-a9ff-2d71e8dc7e24" data-file-name="app/admin/settings/page.tsx">
              <div data-unique-id="306b73e4-f570-4018-a66f-d850edb7ce63" data-file-name="app/admin/settings/page.tsx">
                <h3 className="text-sm font-medium text-gray-400" data-unique-id="3fc65d28-caa2-421d-b157-68eac035ae5e" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="6f642317-819d-4b6c-990c-5fe3926ea547" data-file-name="app/admin/settings/page.tsx">Username</span></h3>
                <p className="text-base text-white mt-1" data-unique-id="d5873d06-2c82-4dc9-a4b2-06c3bdaee743" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">{currentUser?.username}</p>
              </div>
              <div data-unique-id="02fda5ee-2da5-4d31-a7ba-4b07f33fdb95" data-file-name="app/admin/settings/page.tsx">
                <h3 className="text-sm font-medium text-gray-400" data-unique-id="6a9f2016-c1ce-4691-9691-95ac418c1d15" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="af8d7e26-6cd0-4303-80b2-5e8d298c18e7" data-file-name="app/admin/settings/page.tsx">Role</span></h3>
                <p className="text-base text-white mt-1" data-unique-id="265382c2-912f-48d9-bebc-8b0fe005d5d8" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">{currentUser?.role}</p>
              </div>
              <div data-unique-id="fb758124-7abc-4783-837b-1ef68fa037ff" data-file-name="app/admin/settings/page.tsx">
                <h3 className="text-sm font-medium text-gray-400" data-unique-id="ec6664ba-d8b6-48bf-b02b-dc69f73ebbb3" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="b59e9bdb-1caf-40b9-8c05-28814a9f35d8" data-file-name="app/admin/settings/page.tsx">Email</span></h3>
                <p className="text-base text-white mt-1" data-unique-id="66a47b3d-dc20-45f0-9ef9-497d14d77366" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">{currentUser?.email}</p>
              </div>
              <div data-unique-id="1c2304c0-2ff4-4948-8a0a-28195777b5f0" data-file-name="app/admin/settings/page.tsx">
                <h3 className="text-sm font-medium text-gray-400" data-unique-id="e80b9f23-4abf-4ac6-92b8-543710469010" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="476d3c6c-ec71-4495-ac42-22f4ca4b2feb" data-file-name="app/admin/settings/page.tsx">Joined</span></h3>
                <p className="text-base text-white mt-1" data-unique-id="a1d9d9e4-c415-4e96-acee-d6bf269e19e2" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">
                  {currentUser?.created_at ? new Date(currentUser.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Save Section */}
          <div className="pt-6 flex items-center justify-between" data-unique-id="22477366-ed5e-4b9c-b051-adbf7d88397c" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">
            {saveMessage && <motion.div initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} className={`flex items-center px-4 py-2 rounded-md ${saveMessage.type === 'success' ? 'bg-green-900/30 text-green-400 border border-green-800/40' : 'bg-red-900/30 text-red-400 border border-red-800/40'}`} data-unique-id="ba690b2b-1a12-4f0f-9f35-3554e2d0b8f9" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">
                {saveMessage.type === 'success' ? <CheckCircle className="h-4 w-4 mr-2" /> : <AlertTriangle className="h-4 w-4 mr-2" />}
                {saveMessage.text}
              </motion.div>}
            
            <button onClick={saveSettings} disabled={isSaving} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center" data-unique-id="a13a449c-d8c3-438e-b19c-fd000aeda64b" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">
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