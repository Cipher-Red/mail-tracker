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
  return <div className="space-y-6" data-unique-id="357c123e-5efc-4221-9c8f-b74906c3d78e" data-file-name="app/admin/settings/page.tsx">
      <div className="flex justify-between items-center" data-unique-id="bf9e847f-349a-4a2a-9fd8-5590b7b678f9" data-file-name="app/admin/settings/page.tsx">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3" data-unique-id="38761421-da0f-4c42-817a-fef0567512db" data-file-name="app/admin/settings/page.tsx">
          <Settings className="h-8 w-8 text-indigo-400" /><span className="editable-text" data-unique-id="af83efa0-40b3-4fd1-89c3-3af03141a6dd" data-file-name="app/admin/settings/page.tsx">
          Admin Settings
        </span></h1>
      </div>
      
      <div className="bg-gray-800 rounded-xl p-6 shadow-xl" data-unique-id="dbb9c74b-8d7d-4277-bd54-515acd21a0ac" data-file-name="app/admin/settings/page.tsx">
        <h2 className="text-xl font-semibold text-white mb-6" data-unique-id="ed015894-261b-486a-9b27-a4cef4e5c823" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="ce1ffc9a-e81d-47b1-ac91-28f641b5ad6a" data-file-name="app/admin/settings/page.tsx">Activity Tracking</span></h2>
        
        <div className="space-y-6" data-unique-id="b06f0ba3-f4e2-4566-8307-110343fbc855" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">
          <div className="flex justify-between items-center p-4 rounded-lg border border-gray-700 bg-gray-700/30" data-unique-id="851923da-d6b8-4950-ac43-fa08ddb4f4d1" data-file-name="app/admin/settings/page.tsx">
            <div data-unique-id="4fbbb760-f9ce-475f-9a69-cded4086cbc3" data-file-name="app/admin/settings/page.tsx">
              <h3 className="text-lg font-medium text-white mb-1" data-unique-id="fba02deb-4652-47eb-89e5-21bb6a52b8bc" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="a1663b80-fda8-4dbd-9dcb-e5b7655a5898" data-file-name="app/admin/settings/page.tsx">Enable Activity Tracking</span></h3>
              <p className="text-sm text-gray-400" data-unique-id="2ff61f60-9b2d-40c3-aee5-c87d531d0cf9" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="fdea40fd-331b-4b15-95ec-0f91b525d254" data-file-name="app/admin/settings/page.tsx">
                Track user actions and system events across the application
              </span></p>
            </div>
            
            <button onClick={toggleTracking} className="text-2xl" aria-label={trackingEnabled ? "Disable tracking" : "Enable tracking"} data-unique-id="22c674c0-03b4-4ed6-b142-02ff64a66217" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">
              {trackingEnabled ? <ToggleRight className="h-8 w-8 text-green-400" /> : <ToggleLeft className="h-8 w-8 text-gray-500" />}
            </button>
          </div>
          
          <div className="flex justify-between items-center p-4 rounded-lg border border-gray-700 bg-gray-700/30" data-unique-id="5aebf75b-47c9-495c-b4a0-e7027309e40f" data-file-name="app/admin/settings/page.tsx">
            <div data-unique-id="871cd8cb-560f-43e3-8b26-6e783718805b" data-file-name="app/admin/settings/page.tsx">
              <h3 className="text-lg font-medium text-white mb-1 flex items-center" data-unique-id="ab64d49d-c7d8-4275-8743-146da3fc3fae" data-file-name="app/admin/settings/page.tsx">
                <ShieldAlert className="h-5 w-5 text-amber-400 mr-2" />
                <span className="editable-text" data-unique-id="16ea44ce-060a-4f48-9dfc-3c5afc58d5eb" data-file-name="app/admin/settings/page.tsx">Allow Demo Login</span>
              </h3>
              <p className="text-sm text-gray-400" data-unique-id="adc834bf-1ba1-4784-bd1a-505932074796" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="617c051f-5813-4de3-b021-df93881e1cc5" data-file-name="app/admin/settings/page.tsx">
                Enable or disable the demo login functionality (password: demo123)
              </span></p>
            </div>
            
            <button onClick={() => setDemoLoginEnabled(!demoLoginEnabled)} className="text-2xl" aria-label={demoLoginEnabled ? "Disable demo login" : "Enable demo login"} data-unique-id="6ec6c200-486b-4ffe-9da2-b852ee9f0239" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">
              {demoLoginEnabled ? <ToggleRight className="h-8 w-8 text-green-400" /> : <ToggleLeft className="h-8 w-8 text-gray-500" />}
            </button>
          </div>
          
          <div className="flex justify-between items-center p-4 rounded-lg border border-gray-700 bg-gray-700/30" data-unique-id="1968ded5-4d77-496e-9dae-25065ba495bd" data-file-name="app/admin/settings/page.tsx">
            <div data-unique-id="4703d09a-7565-48fe-a9e5-3c9791d55472" data-file-name="app/admin/settings/page.tsx">
              <h3 className="text-lg font-medium text-white mb-1" data-unique-id="43b29c0d-0232-4b3f-9ece-bf9914b5fe4d" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="65280d0e-a2ee-4665-adce-04328938e3c2" data-file-name="app/admin/settings/page.tsx">Clear Activity Logs</span></h3>
              <p className="text-sm text-gray-400" data-unique-id="30312097-acf9-4e58-bb30-03d47999b7ef" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="f705d672-2caf-4c92-b413-1b2cffe69c30" data-file-name="app/admin/settings/page.tsx">
                Permanently remove all activity logs from the system
              </span></p>
            </div>
            
            <button onClick={handleClearLogs} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center" data-unique-id="15b552a1-375c-4f4e-8409-5f1d35261100" data-file-name="app/admin/settings/page.tsx">
              <Trash2 className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="d918b413-5460-4341-bd6b-72456726fb40" data-file-name="app/admin/settings/page.tsx">
              Clear Logs
            </span></button>
          </div>
          
          <div className="flex justify-between items-center p-4 rounded-lg border border-gray-700 bg-gray-700/30" data-unique-id="1ab7941a-9f6b-4f8a-aa44-29c61a312fd2" data-file-name="app/admin/settings/page.tsx">
            <div data-unique-id="f889f324-05fc-45a9-8f1c-edc951b306e9" data-file-name="app/admin/settings/page.tsx">
              <h3 className="text-lg font-medium text-white mb-1" data-unique-id="8c44ee44-f39b-482d-8be7-9a69f5006872" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="d7c9acce-6127-4218-8aa8-2bc40c1718f4" data-file-name="app/admin/settings/page.tsx">Refresh Activity Data</span></h3>
              <p className="text-sm text-gray-400" data-unique-id="8f0f8776-b2e6-441f-a59d-8d074965bfec" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="e94ba7bb-919a-4f4b-9ab1-a2b25591f86c" data-file-name="app/admin/settings/page.tsx">
                Fetch latest activity logs from the database
              </span></p>
            </div>
            
            <button onClick={() => fetchAllLogs()} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md" data-unique-id="35588e5c-fc5f-4e71-a154-52947d90f7b6" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="bde27695-0f53-4488-8c36-da86982346f6" data-file-name="app/admin/settings/page.tsx">
              Refresh Data
            </span></button>
          </div>
          
          {/* Account Information */}
          <div className="pt-6 mt-6 border-t border-gray-700" data-unique-id="81aaacb9-9170-40ab-a732-7a4ef74562ed" data-file-name="app/admin/settings/page.tsx">
            <h2 className="text-xl font-semibold text-white mb-4" data-unique-id="5eb5843e-813a-4402-9e80-fe5f6f034ddd" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="644be952-9f0e-4f26-b833-7ba10271b074" data-file-name="app/admin/settings/page.tsx">Account Information</span></h2>
            
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg border border-gray-700 bg-gray-700/30" data-unique-id="5bb4ccc4-022f-4990-8000-eab516e923a5" data-file-name="app/admin/settings/page.tsx">
              <div data-unique-id="649e3da5-08fb-4c26-ab28-30f0277094b4" data-file-name="app/admin/settings/page.tsx">
                <h3 className="text-sm font-medium text-gray-400" data-unique-id="52605d13-e14c-401f-9579-bda3da90e468" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="cf4eba11-3abe-42e1-9b70-4451c55d71ad" data-file-name="app/admin/settings/page.tsx">Username</span></h3>
                <p className="text-base text-white mt-1" data-unique-id="26e610f9-79dc-4588-9954-e66f31995612" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">{currentUser?.username}</p>
              </div>
              <div data-unique-id="36e028aa-27cc-424e-9207-981ade138d27" data-file-name="app/admin/settings/page.tsx">
                <h3 className="text-sm font-medium text-gray-400" data-unique-id="5811442c-8242-4568-9a42-ca05103b56be" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="9affd666-5089-461f-8de6-f14bdcb55273" data-file-name="app/admin/settings/page.tsx">Role</span></h3>
                <p className="text-base text-white mt-1" data-unique-id="fd11e084-a85f-429b-b041-edebe897ad4e" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">{currentUser?.role}</p>
              </div>
              <div data-unique-id="5a950128-3074-49a4-86d5-6d447d43ba42" data-file-name="app/admin/settings/page.tsx">
                <h3 className="text-sm font-medium text-gray-400" data-unique-id="6bb1ea61-3cd1-46f0-ada6-3d56dc3f182b" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="b618dd80-1c50-4e99-9a88-d4fc36d927b0" data-file-name="app/admin/settings/page.tsx">Email</span></h3>
                <p className="text-base text-white mt-1" data-unique-id="3bcf7591-7c00-43fd-a72a-519cccc3997c" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">{currentUser?.email}</p>
              </div>
              <div data-unique-id="8cc6b3e0-d2dc-4333-9b39-7daa8c483471" data-file-name="app/admin/settings/page.tsx">
                <h3 className="text-sm font-medium text-gray-400" data-unique-id="20163d48-51ee-4b0b-978e-765c928d1a61" data-file-name="app/admin/settings/page.tsx"><span className="editable-text" data-unique-id="043221f4-9a1e-419c-b4a1-3666fd665d7f" data-file-name="app/admin/settings/page.tsx">Joined</span></h3>
                <p className="text-base text-white mt-1" data-unique-id="83695e55-5a0a-4c5b-bb3a-19a4f86c61d4" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">
                  {currentUser?.created_at ? new Date(currentUser.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Save Section */}
          <div className="pt-6 flex items-center justify-between" data-unique-id="e2ff0078-dc24-4c78-a4ea-f06ec830c3cb" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">
            {saveMessage && <motion.div initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} className={`flex items-center px-4 py-2 rounded-md ${saveMessage.type === 'success' ? 'bg-green-900/30 text-green-400 border border-green-800/40' : 'bg-red-900/30 text-red-400 border border-red-800/40'}`} data-unique-id="7ebc2b7f-e4ee-4f74-95d5-6ecf23293942" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">
                {saveMessage.type === 'success' ? <CheckCircle className="h-4 w-4 mr-2" /> : <AlertTriangle className="h-4 w-4 mr-2" />}
                {saveMessage.text}
              </motion.div>}
            
            <button onClick={saveSettings} disabled={isSaving} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center" data-unique-id="3ba0e276-4788-463c-96c6-2cdd27d894df" data-file-name="app/admin/settings/page.tsx" data-dynamic-text="true">
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