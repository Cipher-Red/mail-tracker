'use client';

import { useState, useEffect, useContext } from 'react';
import { useSmartGuide } from './smart-guide-provider';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Moon, Sun, Laptop, HelpCircle, Bell, X, Check } from 'lucide-react';
import { useTheme } from './theme-provider';
export function UserPreferences() {
  const {
    theme,
    setTheme,
    resolvedTheme
  } = useTheme();
  const {
    resetAllGuides
  } = useSmartGuide();
  const [isOpen, setIsOpen] = useState(false);
  const [showTutorials, setShowTutorials] = useState(true);
  const [showTooltips, setShowTooltips] = useState(true);
  const [showContextualTips, setShowContextualTips] = useState(true);
  const [autoDetectTheme, setAutoDetectTheme] = useState(false);
  const [changesSaved, setChangesSaved] = useState(false);

  // Load saved preferences
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedTutorials = localStorage.getItem('showTutorials');
      if (savedTutorials !== null) {
        setShowTutorials(savedTutorials === 'true');
      }
      const savedTooltips = localStorage.getItem('showTooltips');
      if (savedTooltips !== null) {
        setShowTooltips(savedTooltips === 'true');
      }
      const savedContextualTips = localStorage.getItem('showContextualTips');
      if (savedContextualTips !== null) {
        setShowContextualTips(savedContextualTips === 'true');
      }
      const savedAutoDetect = localStorage.getItem('autoDetectTheme');
      if (savedAutoDetect !== null) {
        setAutoDetectTheme(savedAutoDetect === 'true');
      }
    } catch (e) {
      console.error('Error loading preferences:', e);
    }
  }, []);

  // Auto detect time-based theme setting
  useEffect(() => {
    if (autoDetectTheme && typeof window !== 'undefined') {
      const checkTimeForTheme = () => {
        const hours = new Date().getHours();
        // Night hours: 8 PM to 6 AM
        const shouldBeDark = hours >= 20 || hours < 6;

        // Only change if different from current theme
        if (shouldBeDark && resolvedTheme !== 'dark' || !shouldBeDark && resolvedTheme === 'dark') {
          setTheme(shouldBeDark ? 'dark' : 'light');
        }
      };

      // Check immediately
      checkTimeForTheme();

      // Then check every hour
      const interval = setInterval(checkTimeForTheme, 3600000); // 1 hour

      return () => clearInterval(interval);
    }
  }, [autoDetectTheme, resolvedTheme, setTheme]);

  // Save preferences
  const savePreferences = () => {
    if (typeof window === 'undefined') return;
    try {
      if (typeof window !== 'undefined') {
        const storage = window.localStorage;
        storage.setItem('showTutorials', showTutorials.toString());
        storage.setItem('showTooltips', showTooltips.toString());
        storage.setItem('showContextualTips', showContextualTips.toString());
        storage.setItem('autoDetectTheme', autoDetectTheme.toString());
      }

      // Show saved indicator
      setChangesSaved(true);
      setTimeout(() => {
        setChangesSaved(false);
      }, 2000);
    } catch (e) {
      console.error('Error saving preferences:', e);
    }
  };

  // Reset all tutorials and help guides
  const resetHelp = () => {
    if (typeof window === 'undefined') return;
    try {
      // Use the smart guide provider to reset all guides
      resetAllGuides();

      // Clear tour and welcome flags
      if (typeof window !== 'undefined') {
        const storage = window.localStorage;
        storage.removeItem('hasTakenTour');
        storage.removeItem('hasSeenWelcome');
        storage.removeItem('hasSeenThemeTooltip');
        storage.removeItem('welcomeLastShown');
        storage.removeItem('hasSeenDarkModeGuide');
        storage.removeItem('hasVisitedBefore');
      }

      // Reset preferences
      setShowTutorials(true);
      setShowTooltips(true);
      setShowContextualTips(true);

      // Save preferences after reset
      if (typeof window !== 'undefined') {
        const storage = window.localStorage;
        storage.setItem('showTutorials', 'true');
        storage.setItem('showTooltips', 'true');
        storage.setItem('showContextualTips', 'true');
      }

      // Show feedback
      alert('All tutorials and help guides have been reset. Refresh the page to see them again.');
    } catch (e) {
      console.error('Error resetting help guides:', e);
    }
  };
  return <>
      <button onClick={() => setIsOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-md border border-border bg-background text-foreground hover:bg-accent transition-colors" title="User Preferences" aria-label="Open user preferences" data-unique-id="90d4d1f1-ee6a-4f0b-8eff-7a275b93bd5e" data-file-name="components/user-preferences.tsx">
        <Settings size={18} />
      </button>
      
      <AnimatePresence>
        {isOpen && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setIsOpen(false)} data-unique-id="0a030773-f629-41ac-a2da-ccf4bbfa5c06" data-file-name="components/user-preferences.tsx">
            <motion.div initial={{
          scale: 0.95,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.95,
          opacity: 0
        }} className="bg-background rounded-lg shadow-lg w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="c01463ef-d5b9-42bb-9fa9-dc947d8b7358" data-file-name="components/user-preferences.tsx">
              <div className="flex justify-between items-center p-4 border-b border-border" data-unique-id="05b10383-7b4e-4af1-8748-abe827b29c3d" data-file-name="components/user-preferences.tsx">
                <h2 className="text-lg font-medium flex items-center" data-unique-id="7167d8ea-eafb-4215-8892-a814cebb9b71" data-file-name="components/user-preferences.tsx">
                  <Settings size={18} className="mr-2" /><span className="editable-text" data-unique-id="578e3976-d99a-4240-8fb6-60fb027200fa" data-file-name="components/user-preferences.tsx">
                  User Preferences
                </span></h2>
                <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-accent/20" data-unique-id="23dc431f-f393-4e6e-9076-34b7221b3040" data-file-name="components/user-preferences.tsx">
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-5" data-unique-id="ea802761-21c1-4762-907a-18b7c70e5d0a" data-file-name="components/user-preferences.tsx">
                <div className="mb-6" data-unique-id="ff5bb5ba-a99b-49e2-ba78-b3a5aa9c77be" data-file-name="components/user-preferences.tsx">
                  <h3 className="text-sm font-medium mb-3 flex items-center" data-unique-id="0b4873e9-eb90-4c80-acf7-51ae778b3f75" data-file-name="components/user-preferences.tsx">
                    <Laptop size={16} className="mr-2" /><span className="editable-text" data-unique-id="71a1aef9-8ddf-434e-a75e-ac118bb89748" data-file-name="components/user-preferences.tsx">
                    Theme Settings
                  </span></h3>
                  
                  <div className="grid grid-cols-3 gap-3" data-unique-id="bc6a51cf-07bc-4ddb-936d-e4af36419909" data-file-name="components/user-preferences.tsx">
                    <button onClick={() => setTheme('light')} className={`flex flex-col items-center justify-center p-3 rounded-md border ${theme === 'light' ? 'border-primary bg-primary/10' : 'border-border'} transition-colors`} data-unique-id="9b017842-756f-4ae9-b503-a91b40a8b6c6" data-file-name="components/user-preferences.tsx" data-dynamic-text="true">
                      <Sun size={24} className="mb-2 text-amber-500" />
                      <span className="text-sm" data-unique-id="5019901d-cea9-4b1c-a643-19a440f04f77" data-file-name="components/user-preferences.tsx"><span className="editable-text" data-unique-id="7327fb7e-429e-4e20-9607-020469156d4f" data-file-name="components/user-preferences.tsx">Light</span></span>
                      {theme === 'light' && <div className="mt-1 text-primary" data-unique-id="b73b938c-fb54-4911-bb50-1601498ab75e" data-file-name="components/user-preferences.tsx">
                          <Check size={14} />
                        </div>}
                    </button>
                    
                    <button onClick={() => setTheme('dark')} className={`flex flex-col items-center justify-center p-3 rounded-md border ${theme === 'dark' ? 'border-primary bg-primary/10' : 'border-border'} transition-colors`} data-unique-id="99d73fc9-ba26-4a62-af96-8e4a9ae9f206" data-file-name="components/user-preferences.tsx" data-dynamic-text="true">
                      <Moon size={24} className="mb-2 text-blue-400" />
                      <span className="text-sm" data-unique-id="710c3aef-d384-4e0f-84d1-8a623cb9ea16" data-file-name="components/user-preferences.tsx"><span className="editable-text" data-unique-id="f8892bb0-7949-430f-a9ac-e264becf6f7a" data-file-name="components/user-preferences.tsx">Dark</span></span>
                      {theme === 'dark' && <div className="mt-1 text-primary" data-unique-id="3fc372f3-f792-4d77-9739-f5477829d649" data-file-name="components/user-preferences.tsx">
                          <Check size={14} />
                        </div>}
                    </button>
                    
                    <button onClick={() => setTheme('system')} className={`flex flex-col items-center justify-center p-3 rounded-md border ${theme === 'system' ? 'border-primary bg-primary/10' : 'border-border'} transition-colors`} data-unique-id="d105c968-6f78-44fb-a017-18f8b9e4dc14" data-file-name="components/user-preferences.tsx" data-dynamic-text="true">
                      <Laptop size={24} className="mb-2 text-primary" />
                      <span className="text-sm" data-unique-id="286eb544-a0f1-44fd-829e-711e1c42fde2" data-file-name="components/user-preferences.tsx"><span className="editable-text" data-unique-id="f5c665f1-83fd-4ecd-9ebd-ab91f4d4fd75" data-file-name="components/user-preferences.tsx">System</span></span>
                      {theme === 'system' && <div className="mt-1 text-primary" data-unique-id="370b7ee8-2dea-418f-baeb-0b1bc3d761cc" data-file-name="components/user-preferences.tsx">
                          <Check size={14} />
                        </div>}
                    </button>
                  </div>
                </div>
                
                <div className="mb-6" data-unique-id="a6fe5ab6-04e7-42d6-8e31-f704819f36e2" data-file-name="components/user-preferences.tsx">
                  <h3 className="text-sm font-medium mb-3 flex items-center" data-unique-id="04825c38-52b6-4783-b23e-62b5eefbbdfe" data-file-name="components/user-preferences.tsx">
                    <HelpCircle size={16} className="mr-2" /><span className="editable-text" data-unique-id="965a6961-3625-407e-b5f5-fa41ede13a96" data-file-name="components/user-preferences.tsx">
                    Tutorial & Help Settings
                  </span></h3>
                  
                  <div className="space-y-3" data-unique-id="0c6de57d-dac8-49b5-827d-b3356531bf99" data-file-name="components/user-preferences.tsx">
                    <div className="flex items-center justify-between" data-unique-id="ad07b49e-5f4f-4f78-9dd0-245947a33d09" data-file-name="components/user-preferences.tsx">
                      <div data-unique-id="c4a90806-31b6-45b0-b232-931e1ca4cdd9" data-file-name="components/user-preferences.tsx">
                        <div className="font-medium text-sm" data-unique-id="99255ff8-b497-4a6c-a3fc-facae3c558fc" data-file-name="components/user-preferences.tsx"><span className="editable-text" data-unique-id="436f6508-9a6e-4254-bf1b-6e938e735fda" data-file-name="components/user-preferences.tsx">Show Tutorials</span></div>
                        <div className="text-xs text-muted-foreground" data-unique-id="de809d86-8950-4ac5-b966-c03b28ca9db1" data-file-name="components/user-preferences.tsx"><span className="editable-text" data-unique-id="636f1b7b-d869-4411-823e-1114603e6aa0" data-file-name="components/user-preferences.tsx">Display step-by-step tutorials</span></div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer" data-unique-id="60af0a06-11d8-4f69-9fa9-7293b60946e0" data-file-name="components/user-preferences.tsx">
                        <input type="checkbox" checked={showTutorials} onChange={e => setShowTutorials(e.target.checked)} className="sr-only peer" data-unique-id="ee264b8b-3e5d-4f98-b2ee-296ef59c7ad7" data-file-name="components/user-preferences.tsx" />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" data-unique-id="4bb7a21a-cf69-450f-9c25-803da8833746" data-file-name="components/user-preferences.tsx"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between" data-unique-id="43da1194-f8ec-4aa6-8d3c-511438eb515c" data-file-name="components/user-preferences.tsx">
                      <div data-unique-id="562c31df-d824-4f13-a547-acaadaa60e0f" data-file-name="components/user-preferences.tsx">
                        <div className="font-medium text-sm" data-unique-id="fb89e6bd-dc80-4f0b-b313-eda8714236fe" data-file-name="components/user-preferences.tsx"><span className="editable-text" data-unique-id="363d9175-f9b8-42bc-b5e6-4f31536f826d" data-file-name="components/user-preferences.tsx">Show Tooltips</span></div>
                        <div className="text-xs text-muted-foreground" data-unique-id="e132208b-3779-473c-b240-993bb2488960" data-file-name="components/user-preferences.tsx"><span className="editable-text" data-unique-id="522729b2-1e7d-4a60-a44a-31ac0a6f0316" data-file-name="components/user-preferences.tsx">Display helpful tooltips when using the app</span></div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer" data-unique-id="f9798e3d-9c12-4e95-9534-13ef869e95f5" data-file-name="components/user-preferences.tsx">
                        <input type="checkbox" checked={showTooltips} onChange={e => setShowTooltips(e.target.checked)} className="sr-only peer" data-unique-id="3b7a7ac4-160c-4545-afdf-62d687d228fc" data-file-name="components/user-preferences.tsx" />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" data-unique-id="0bdb5af0-54c2-4a08-b6e7-0fd027661ccd" data-file-name="components/user-preferences.tsx"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between" data-unique-id="d5f22316-41df-4ee4-b2d5-668dea00ae99" data-file-name="components/user-preferences.tsx">
                      <div data-unique-id="6b0cbde1-3a49-4965-9d39-b88dd5aa68ff" data-file-name="components/user-preferences.tsx">
                        <div className="font-medium text-sm" data-unique-id="f389400c-c888-470a-858e-d09ca5794ab9" data-file-name="components/user-preferences.tsx"><span className="editable-text" data-unique-id="f6c09e03-0da6-4cc1-81e1-80c44ef95d60" data-file-name="components/user-preferences.tsx">Contextual Tips</span></div>
                        <div className="text-xs text-muted-foreground" data-unique-id="fcc73a88-a7a4-4021-9b29-fb2bad8dec51" data-file-name="components/user-preferences.tsx"><span className="editable-text" data-unique-id="78005b45-e10b-413e-873c-b82672f34ec2" data-file-name="components/user-preferences.tsx">Show helpful tips based on your actions</span></div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer" data-unique-id="20e83b24-247c-4776-9113-db95c7cab2e7" data-file-name="components/user-preferences.tsx">
                        <input type="checkbox" checked={showContextualTips} onChange={e => setShowContextualTips(e.target.checked)} className="sr-only peer" data-unique-id="fbd045f2-80ea-4a6a-bd28-482cd60d799a" data-file-name="components/user-preferences.tsx" />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" data-unique-id="dc1caace-f857-4681-8815-58c7144a7c8b" data-file-name="components/user-preferences.tsx"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-4" data-unique-id="512b6c52-4f8a-4bcd-9069-5d811e72fbc1" data-file-name="components/user-preferences.tsx">
                    <button onClick={resetHelp} className="text-xs text-primary hover:text-primary/80 hover:underline" data-unique-id="02694c65-f7ab-4c87-8c93-55ceddac4b93" data-file-name="components/user-preferences.tsx"><span className="editable-text" data-unique-id="1bf6dee2-c867-45dc-928d-28981e1300dd" data-file-name="components/user-preferences.tsx">
                      Reset all tutorials and help guides
                    </span></button>
                  </div>
                </div>
                
                <div className="mb-6" data-unique-id="e2ac9dbd-9067-41fc-95f2-faea479fdd7a" data-file-name="components/user-preferences.tsx">
                  <h3 className="text-sm font-medium mb-3 flex items-center" data-unique-id="8ac7ce91-fb76-423f-bf37-41df46e49efa" data-file-name="components/user-preferences.tsx">
                    <Moon size={16} className="mr-2" />
                    <span className="editable-text" data-unique-id="c9100138-5a4a-4e4c-bd43-267fffc40cd6" data-file-name="components/user-preferences.tsx">Dark Mode Settings</span>
                  </h3>
                  
                  <div className="space-y-3" data-unique-id="6b9d7ca4-4e0e-47b3-a733-2128703298be" data-file-name="components/user-preferences.tsx">
                    <div className="flex items-center justify-between" data-unique-id="7c661b9b-71d8-4810-9c0b-93e62b5de80d" data-file-name="components/user-preferences.tsx">
                      <div data-unique-id="d8bdb2c8-512c-4ffa-8fde-f24dc0f154e8" data-file-name="components/user-preferences.tsx">
                        <div className="font-medium text-sm" data-unique-id="3f1ba771-11f7-49fb-8937-ad6b3ae467d3" data-file-name="components/user-preferences.tsx"><span className="editable-text" data-unique-id="e92a2ac4-e01d-4c5c-b775-034d6fbb5111" data-file-name="components/user-preferences.tsx">Smart Theme Detection</span></div>
                        <div className="text-xs text-muted-foreground" data-unique-id="f8101c09-92f6-4707-bfef-909099f3ff99" data-file-name="components/user-preferences.tsx"><span className="editable-text" data-unique-id="0f4a4f51-bc8e-4ea0-9981-c53451c38b2e" data-file-name="components/user-preferences.tsx">
                          Automatically switch between light and dark mode based on time of day
                        </span></div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer" data-unique-id="3702eb5a-083a-487c-9031-a7f72dbe23d4" data-file-name="components/user-preferences.tsx">
                        <input type="checkbox" checked={autoDetectTheme} onChange={e => {
                      setAutoDetectTheme(e.target.checked);
                      if (e.target.checked) {
                        // If enabling, set theme to system
                        setTheme('system');
                      }
                    }} className="sr-only peer" data-unique-id="1651117e-097a-44cd-950d-921125042251" data-file-name="components/user-preferences.tsx" />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" data-unique-id="91b50be6-d585-4de3-96bb-08d8a7c813e0" data-file-name="components/user-preferences.tsx"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex flex-col mt-3 px-3 py-2 bg-accent/20 rounded-md" data-unique-id="63468536-5d3c-436c-8c5f-b6b2c405efda" data-file-name="components/user-preferences.tsx">
                    <p className="text-xs text-muted-foreground mb-2" data-unique-id="1dbdb1ac-f866-4125-9b3b-d4cd9114abe6" data-file-name="components/user-preferences.tsx"><span className="editable-text" data-unique-id="5f8eb92d-80a6-49ca-82d1-5b3b3ed03c90" data-file-name="components/user-preferences.tsx">
                      Smart detection uses these rules:
                    </span></p>
                    <ul className="text-xs list-disc list-inside space-y-1 text-muted-foreground" data-unique-id="8d34c1e6-ea1a-4dba-9e69-ad94495cd9a4" data-file-name="components/user-preferences.tsx">
                      <li data-unique-id="e408d81d-38a3-40ff-bd8e-701fdfd3c708" data-file-name="components/user-preferences.tsx"><span className="editable-text" data-unique-id="b702b652-077f-43ba-8204-3906159b6598" data-file-name="components/user-preferences.tsx">6:00 AM - 8:00 PM: Light mode</span></li>
                      <li data-unique-id="44928fe2-a117-429b-b0fc-4247a1c861fc" data-file-name="components/user-preferences.tsx"><span className="editable-text" data-unique-id="43550f4c-10a0-4d25-b913-3b2eef8b55a2" data-file-name="components/user-preferences.tsx">8:00 PM - 6:00 AM: Dark mode</span></li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between items-center" data-unique-id="56299289-8043-4449-8f37-59fae8fd970e" data-file-name="components/user-preferences.tsx">
                  <AnimatePresence>
                    {changesSaved && <motion.div initial={{
                  opacity: 0,
                  y: 10
                }} animate={{
                  opacity: 1,
                  y: 0
                }} exit={{
                  opacity: 0
                }} className="text-sm text-green-600 flex items-center" data-unique-id="fc2c1777-3f81-48ff-af09-ae48573eae44" data-file-name="components/user-preferences.tsx">
                        <Check size={14} className="mr-1" /><span className="editable-text" data-unique-id="b9c95e1c-7302-4e41-9dee-d6327de2288a" data-file-name="components/user-preferences.tsx">
                        Changes saved
                      </span></motion.div>}
                  </AnimatePresence>
                  
                  <div className="flex space-x-2" data-unique-id="c6548792-cf2a-42c8-bb40-2a6726daf8af" data-file-name="components/user-preferences.tsx">
                    <button onClick={() => setIsOpen(false)} className="px-3 py-1.5 text-sm border border-border rounded hover:bg-accent/10" data-unique-id="7cea0261-33a1-4a8a-a6ea-ae6d06221aa9" data-file-name="components/user-preferences.tsx"><span className="editable-text" data-unique-id="db818d92-f296-46f4-b510-07ec51cbed1f" data-file-name="components/user-preferences.tsx">
                      Cancel
                    </span></button>
                    <button onClick={() => {
                  savePreferences();
                  setIsOpen(false);
                }} className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90" data-unique-id="580d6038-dddf-4e98-8079-6429d6a93b25" data-file-name="components/user-preferences.tsx"><span className="editable-text" data-unique-id="ef863bfa-d482-42a3-85ec-5a42759c8f3e" data-file-name="components/user-preferences.tsx">
                      Save & Close
                    </span></button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
    </>;
}