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
  return <div className="space-y-6" data-unique-id="5f3a64ff-2a6b-493f-bd87-7860d2a1b37e" data-file-name="app/admin/settings/page.tsx">
      <div className="flex justify-between items-center" data-unique-id="7079cb59-be6f-4734-b0d1-792428944f5d" data-file-name="app/admin/settings/page.tsx">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3" data-unique-id="78ac098b-4fca-4885-9737-213d6c474283" data-file-name="app/admin/settings/page.tsx">
          <Settings className="h-8 w-8 text-indigo-400" /><span className="editable-text" data-unique-id="8c73a06c-84a8-478e-996b-77af6f73a5f6" data-file-name="app/admin/settings/page.tsx">
          Admin Settings
        </span></h1>
      </div>
      
      <div className="bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="1c9967ac-d1b8-468d-bb63-7787af6cbca0" data-file-name="app/admin/settings/page.tsx">
        <h2 className="text-xl font-semibold text-white mb-6" data-unique-id="10e5c4df-e927-4e1b-ac34-29713a4298f4" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="9af55541-95ce-4a44-a7dc-9ca8f431fa8b" data-file-name="app/admin/settings/page.tsx">Activity Tracking</span></h2>
        
        <div className="space-y-6" data-unique-id="5b36c10e-d34c-4819-826f-9c0dda3780f9" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">
          <div className="flex justify-between items-center p-4 rounded-lg border border-gray-700 bg-gray-700/30" data-unique-id="cb6c4809-f037-4f66-aa06-1ddba278159d" data-file-name="app/admin/settings/page.tsx">
            <div data-unique-id="25fdbfe1-43c3-43e7-902d-53b2d5ee6aac" data-file-name="app/admin/settings/page.tsx">
              <h3 className="text-lg font-medium text-white mb-1" data-unique-id="6330b162-6b2b-440a-b504-1ce4f9788a10" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="633126a8-e997-49b5-b8e0-4b10b0ba10eb" data-file-name="app/admin/settings/page.tsx">Enable Activity Tracking</span></h3>
              <p className="text-sm text-gray-400" data-unique-id="aeceafb1-71c1-4dcc-ad11-5393385c3a27" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="f69ca975-c91f-4436-bf8c-add41b79bae4" data-file-name="app/admin/settings/page.tsx">
                Track user actions and system events across the application
              </span></p>
            </div>
            
            <button onClick={toggleTracking} className="text-2xl" aria-label={trackingEnabled ? "Disable tracking" : "Enable tracking"} data-unique-id="470da4b2-f183-4cf4-aaf1-693fcc7a3b97" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">
              {trackingEnabled ? <ToggleRight className="h-8 w-8 text-green-400" /> : <ToggleLeft className="h-8 w-8 text-gray-500" />}
            </button>
          </div>
          
          <div className="flex justify-between items-center p-4 rounded-lg border border-gray-700 bg-gray-700/30" data-unique-id="0b64212b-f59d-4195-afd6-371a49f43efb" data-file-name="app/admin/settings/page.tsx">
            <div data-unique-id="8b68ce95-7803-44c9-a3b5-7756e86fdd87" data-file-name="app/admin/settings/page.tsx">
              <h3 className="text-lg font-medium text-white mb-1 flex items-center" data-unique-id="e5d8bf44-3b85-48a2-9f20-62ca815ef826" data-file-name="app/admin/settings/page.tsx">
                <ShieldAlert className="h-5 w-5 text-amber-400 mr-2" />
                <span className="editable-text" data-unique-id="c7865589-e7a4-46b8-b9f2-c7b0ab1d0f19" data-file-name="app/admin/settings/page.tsx">Allow Demo Login</span>
              </h3>
              <p className="text-sm text-gray-400" data-unique-id="0ce2f64a-b3dd-4d16-ae91-cb740adb6a79" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="7e1d7603-77c6-4edf-8f88-0ab68ccad4c1" data-file-name="app/admin/settings/page.tsx">
                Enable or disable the demo login functionality (password: demo123)
              </span></p>
            </div>
            
            <button onClick={() => setDemoLoginEnabled(!demoLoginEnabled)} className="text-2xl" aria-label={demoLoginEnabled ? "Disable demo login" : "Enable demo login"} data-unique-id="98a0e2fe-6765-4955-83b7-eba33cbd1ae5" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">
              {demoLoginEnabled ? <ToggleRight className="h-8 w-8 text-green-400" /> : <ToggleLeft className="h-8 w-8 text-gray-500" />}
            </button>
          </div>
          
          <div className="flex justify-between items-center p-4 rounded-lg border border-gray-700 bg-gray-700/30" data-unique-id="76d47bf1-6b2f-4c83-85d3-9c79a513f419" data-file-name="app/admin/settings/page.tsx">
            <div data-unique-id="e3ce72f1-2a85-4d8f-824f-7ef5afcf7695" data-file-name="app/admin/settings/page.tsx">
              <h3 className="text-lg font-medium text-white mb-1" data-unique-id="6816043d-af52-4e92-94a2-91175d26d02a" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="dae726aa-9439-40a6-bd4b-d43d0e4baca9" data-file-name="app/admin/settings/page.tsx">Clear Activity Logs</span></h3>
              <p className="text-sm text-gray-400" data-unique-id="844618d6-42eb-4c0a-878d-9c26f71c2588" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="1bebccd7-a369-44b7-bb48-0f37d6f8be5b" data-file-name="app/admin/settings/page.tsx">
                Permanently remove all activity logs from the system
              </span></p>
            </div>
            
            <button onClick={handleClearLogs} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center" data-unique-id="6896a83b-91ce-472e-97f7-0794d7ef645d" data-file-name="app/admin/settings/page.tsx">
              <Trash2 className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="d7ca7bff-b0f7-44cd-9b9d-7d205330d955" data-file-name="app/admin/settings/page.tsx">
              Clear Logs
            </span></button>
          </div>
          
          <div className="flex justify-between items-center p-4 rounded-lg border border-gray-700 bg-gray-700/30" data-unique-id="1472ff40-1c93-4eb2-b09a-992d8a6e61f1" data-file-name="app/admin/settings/page.tsx">
            <div data-unique-id="4aac85cb-8c7d-4e40-8703-c026920c80a7" data-file-name="app/admin/settings/page.tsx">
              <h3 className="text-lg font-medium text-white mb-1" data-unique-id="1403049a-1161-4996-8e3c-5c665de4e2fb" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="73e7a3d8-4860-4038-a38c-2cda64f1c363" data-file-name="app/admin/settings/page.tsx">Refresh Activity Data</span></h3>
              <p className="text-sm text-gray-400" data-unique-id="1f87903f-69a8-424d-859f-1c6235a72f52" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="1ff3f60a-073a-48cf-b18c-918961d9f5b0" data-file-name="app/admin/settings/page.tsx">
                Fetch latest activity logs from the database
              </span></p>
            </div>
            
            <button onClick={() => fetchAllLogs()} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md" data-unique-id="7d5ef162-40e0-4ff9-924e-d226caade849" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="06a08c15-f5d5-4c4c-939e-ee91553b0656" data-file-name="app/admin/settings/page.tsx">
              Refresh Data
            </span></button>
          </div>
          
          {/* Account Information */}
          <div className="pt-6 mt-6 border-t border-gray-700" data-unique-id="0fcbf0d0-5db7-4267-884d-e448b1b5eb45" data-file-name="app/admin/settings/page.tsx">
            <h2 className="text-xl font-semibold text-white mb-4" data-unique-id="a8b7fdbe-5e96-497c-a047-ca252679ba5a" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="ba653c87-691c-4a66-b5b9-6dec80fdef1e" data-file-name="app/admin/settings/page.tsx">Account Information</span></h2>
            
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg border border-gray-700 bg-gray-700/30" data-unique-id="5c458e34-365f-41ec-9415-7e61c4b80efa" data-file-name="app/admin/settings/page.tsx">
              <div data-unique-id="96a92d3c-e43a-4aef-8205-ee32ec72f297" data-file-name="app/admin/settings/page.tsx">
                <h3 className="text-sm font-medium text-gray-400" data-unique-id="fe6b62fe-6ba3-4237-a5f8-38f0a194a117" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="5c373d2e-a1a4-4b2d-befb-a3de16aeb139" data-file-name="app/admin/settings/page.tsx">Username</span></h3>
                <p className="text-base text-white mt-1" data-unique-id="316f236a-53ff-445c-bd3f-3a0495022e5c" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">{currentUser?.username}</p>
              </div>
              <div data-unique-id="1d6526f3-3ecc-45cd-af90-5a673f1a66d5" data-file-name="app/admin/settings/page.tsx">
                <h3 className="text-sm font-medium text-gray-400" data-unique-id="1615166a-defa-4407-b107-f483e2ddc7d8" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="a636c56a-9858-4954-ae31-7e782d527032" data-file-name="app/admin/settings/page.tsx">Role</span></h3>
                <p className="text-base text-white mt-1" data-unique-id="a0c024ba-81ac-4ebf-9f22-69127529f47e" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">{currentUser?.role}</p>
              </div>
              <div data-unique-id="25b2a618-bb26-4976-bef9-cc8c072ed067" data-file-name="app/admin/settings/page.tsx">
                <h3 className="text-sm font-medium text-gray-400" data-unique-id="bc57f77f-029d-47c0-9a66-f468147e534a" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="3e0f4ccc-8ad0-4fa2-ad05-63265cdd0e1a" data-file-name="app/admin/settings/page.tsx">Email</span></h3>
                <p className="text-base text-white mt-1" data-unique-id="8704f342-cc28-48e2-aa7c-0ee6a58e59f7" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">{currentUser?.email}</p>
              </div>
              <div data-unique-id="a1c1e8e6-d163-49fb-a915-6729d9617ab0" data-file-name="app/admin/settings/page.tsx">
                <h3 className="text-sm font-medium text-gray-400" data-unique-id="f63d9431-58c6-4b1f-bb56-d8a12597770f" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="0340b682-f9c6-4755-b25a-3c2c638b18b9" data-file-name="app/admin/settings/page.tsx">Joined</span></h3>
                <p className="text-base text-white mt-1" data-unique-id="d2db9634-00a1-4833-9056-c4e287cb6109" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">
                  {currentUser?.created_at ? new Date(currentUser.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Save Section */}
          <div className="pt-6 flex items-center justify-between" data-unique-id="e6801bef-01fd-41bf-a7c3-f756f8f17751" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">
            {saveMessage && <motion.div initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} className={`flex items-center px-4 py-2 rounded-md ${saveMessage.type === 'success' ? 'bg-green-900/30 text-green-400 border border-green-800/40' : 'bg-red-900/30 text-red-400 border border-red-800/40'}`} data-unique-id="dc8bb68a-a2a7-4c1f-a48f-99dff92c7998" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">
                {saveMessage.type === 'success' ? <CheckCircle className="h-4 w-4 mr-2" /> : <AlertTriangle className="h-4 w-4 mr-2" />}
                {saveMessage.text}
              </motion.div>}
            
            <button onClick={saveSettings} disabled={isSaving} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center" data-unique-id="d14f484d-da25-4b90-a6cd-b6e569d72ccc" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">
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