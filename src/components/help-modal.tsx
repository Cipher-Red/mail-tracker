'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, FileText, Users, Send, Search } from 'lucide-react';
import { FeatureHighlight } from './feature-highlight';
interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export function HelpModal({
  isOpen,
  onClose
}: HelpModalProps) {
  // Force close modal if open state changes to false
  useEffect(() => {
    if (!isOpen) {
      const modalElement = document.getElementById('help-modal-backdrop');
      if (modalElement) {
        modalElement.style.display = 'none';
      }
    }
  }, [isOpen]);
  if (!isOpen) return null;
  return <AnimatePresence>
      <motion.div id="help-modal-backdrop" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} transition={{
      duration: 0.2
    }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose} data-unique-id="9af1f3b9-bd84-4216-9ac3-1402e8dcfa82" data-file-name="components/help-modal.tsx">
          <motion.div initial={{
        scale: 0.95,
        opacity: 0
      }} animate={{
        scale: 1,
        opacity: 1
      }} exit={{
        scale: 0.95,
        opacity: 0
      }} transition={{
        type: 'spring',
        damping: 25,
        stiffness: 300
      }} className="bg-card rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden backdrop-blur-sm" onClick={e => e.stopPropagation()} data-unique-id="e945dda6-c7fd-48a2-9dbf-7b21b518d6ce" data-file-name="components/help-modal.tsx">
            <div className="flex justify-between items-center p-6 border-b border-border" data-unique-id="5463f61f-c820-44a3-94e7-4750b1f72d1c" data-file-name="components/help-modal.tsx">
              <h2 className="text-2xl font-semibold" data-unique-id="c8c3a72e-35fc-42bb-8c44-6337abbe3dba" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="4cae6a9f-7203-440a-8013-48023f3e0ce8" data-file-name="components/help-modal.tsx">Help & Getting Started</span></h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-accent" data-unique-id="64540ac6-c4d4-4b35-9a36-a7e5853e5f17" data-file-name="components/help-modal.tsx">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-74px)]" data-unique-id="fcbba575-8edc-4181-bab2-f2de7217592e" data-file-name="components/help-modal.tsx">
              <h3 className="text-lg font-medium mb-4" data-unique-id="f7c48e2e-48ee-468b-98ad-7f9b6bd91423" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="f08f4efd-dc1b-4b19-aec9-83447bf05417" data-file-name="components/help-modal.tsx">Welcome to Detroit Axle Email Builder!</span></h3>
              <p className="text-muted-foreground mb-6" data-unique-id="f83ccbf9-2eb4-44a4-9df8-8f145e461208" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="1368e3f3-895f-42d0-8f8e-2c75af2900b2" data-file-name="components/help-modal.tsx">
                This application helps you create, manage, and send professional email templates to your customers.
                Here's how to get the most out of it:
              </span></p>
              
              <FeatureHighlight title="Creating Email Templates" description="Design professional emails with customizable variables" defaultOpen={true} completionKey="create-template">
                <div className="space-y-3" data-unique-id="a75810d2-3fa7-4374-a405-71399dae880a" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="edc40422-f31a-4954-b492-2a05a0966d4a" data-file-name="components/help-modal.tsx">
                    <FileText className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="30c428c6-ea87-4494-b832-d9a829258048" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="a1216e0d-4663-49e5-a66e-6cd8718ad05f" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="1ae50874-fcd6-4505-bd11-8f67457559f2" data-file-name="components/help-modal.tsx">Using the Template Editor</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="6b3f92db-2575-44bc-b4f8-3ea73663dce5" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="97ffcb0b-009e-41a3-aca5-54a58af74789" data-file-name="components/help-modal.tsx">
                        The template editor allows you to create and customize email templates.
                        You can use variables like </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="7441cd1b-50aa-41f9-a85a-9b680908e24f" data-file-name="components/help-modal.tsx">{'{{customerName}}'}</code><span className="editable-text" data-unique-id="21f57730-e9cd-4dfb-8d14-85d7e4bdbfd9" data-file-name="components/help-modal.tsx"> and
                        </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="db831dca-6c11-4cbd-bc72-fd95bf2f1f1e" data-file-name="components/help-modal.tsx">{'{{orderNumber}}'}</code><span className="editable-text" data-unique-id="1242643b-3908-4615-acf2-e5dece795cb4" data-file-name="components/help-modal.tsx"> that will be replaced with actual customer data when sending.
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start" data-unique-id="09c0d3e1-36cc-4ed4-b5b2-fcea8a4ae7fa" data-file-name="components/help-modal.tsx">
                    <Search className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="2e78f487-e2e5-4e9d-8584-b7f8666ef3c9" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="fd15adbd-bcbc-4d49-8c5f-a278d40d2a07" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="f65b0c35-95ec-46d4-9f53-8e1fab6d10e3" data-file-name="components/help-modal.tsx">Preview Your Templates</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="ddf1146a-4736-4e55-959e-8ff0fc476601" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="560facc1-7916-46b2-8fe9-10a7d0198f01" data-file-name="components/help-modal.tsx">
                        Use the preview panel on the right to see how your email will look in real-time as you make changes.
                        You can also send a test email to yourself to see exactly how it will appear in an email client.
                      </span></p>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Managing Customers" description="Add, organize and import customer data" completionKey="manage-customers">
                <div className="space-y-3" data-unique-id="ae26932e-c4e3-4455-a6fe-a22cfc501f33" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="8965a302-1c99-4ab2-bf94-56ed062829cc" data-file-name="components/help-modal.tsx">
                    <Users className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="8b018b5e-6211-47c8-ae74-9934646a997a" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="51687022-612f-45fd-8c44-a0199d0f4d94" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="68071c58-fbb1-4ca6-8291-56f386d0a818" data-file-name="components/help-modal.tsx">Customer Database</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="2191c00a-126d-49a4-a238-7b748551fb20" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="548adc83-042f-42ee-9520-68b4801a601e" data-file-name="components/help-modal.tsx">
                        Add customers manually or import them from Excel. You can add details like name, email,
                        company, tags, and custom notes. Your customer data is stored locally in your browser.
                      </span></p>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Sending Emails" description="Send personalized emails to your customers" completionKey="send-emails">
                <div className="space-y-3" data-unique-id="2c5e1845-0cb3-4f46-8631-64b1f97e95e6" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="2cac95ca-f6f7-47e7-8ca8-3144394c064a" data-file-name="components/help-modal.tsx">
                    <Send className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="7131479f-48ea-4023-b462-14e204878491" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="d5ef0fb8-de4e-4b06-8afc-b9bb1e90742c" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="37328589-eb6c-461f-ab41-368c2aac2877" data-file-name="components/help-modal.tsx">Sending Bulk Emails</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="0a3f42a3-cb30-4f0f-839d-b206a026890f" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="05a671de-58a5-4d2f-818e-0cab5fcbf6ff" data-file-name="components/help-modal.tsx">
                        Select customers from your database or import them from Excel to send personalized emails.
                        Each email will be customized with the customer's specific information.
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="bg-accent/20 p-4 rounded-md border border-border mt-2" data-unique-id="898acebc-f39c-49c0-ab56-e3c8986adb29" data-file-name="components/help-modal.tsx">
                    <p className="text-sm font-medium" data-unique-id="8adf28a4-b8d8-49a6-941b-136e0fdb91f5" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="b6229d53-c7e4-4a04-be24-9111f593c8ca" data-file-name="components/help-modal.tsx">Email Configuration Required</span></p>
                    <p className="text-xs text-muted-foreground mt-1" data-unique-id="6a704f30-b3e8-4821-8f4d-08c9ff13304a" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="ae352cb1-5076-43d9-9b0f-4791ec1fb480" data-file-name="components/help-modal.tsx">
                      To send real emails, you'll need to set up an email service API key in your environment variables.
                      See the documentation for how to set this up.
                    </span></p>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Theme Customization" description="Switch between light and dark mode" isNew={true} completionKey="theme">
                <div className="space-y-3" data-unique-id="72b4c5ef-c8a0-46ee-a2c5-6b9d40ece0f2" data-file-name="components/help-modal.tsx">
                  <p className="text-sm text-muted-foreground" data-unique-id="a074d8ce-27c2-46ae-80e3-ab5e8be3630e" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="dd46d4d9-106b-4e2f-84a4-4468e856a9f1" data-file-name="components/help-modal.tsx">
                    You can switch between light and dark mode by clicking the theme toggle button in the top-right corner.
                    The application will remember your preference for future visits.
                  </span></p>
                  
                  <div className="flex items-center justify-center space-x-4 my-4" data-unique-id="691fbf7a-a4e3-40f5-9e68-48adc328891c" data-file-name="components/help-modal.tsx">
                    <div className="flex flex-col items-center" data-unique-id="aca07a39-38ca-46d0-ad91-30969fac5fea" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-white border border-border flex items-center justify-center mb-1" data-unique-id="5f6bc419-cb4f-4717-9e6f-4e36fd298d99" data-file-name="components/help-modal.tsx">
                        <Sun className="w-8 h-8 text-amber-500" />
                      </div>
                      <span className="text-xs" data-unique-id="baa50553-cc17-4d1d-a7f9-b7ad8ea458d0" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="c1c6b400-3cd0-44a9-b305-f3cc1b44890b" data-file-name="components/help-modal.tsx">Light Mode</span></span>
                    </div>
                    
                    <div className="flex flex-col items-center" data-unique-id="5777180a-0d8e-45ae-8e37-6c0c8b182e6c" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-[#121212] border border-border flex items-center justify-center mb-1" data-unique-id="05db0c29-b1b7-43b4-9700-96a3df1018c4" data-file-name="components/help-modal.tsx">
                        <Moon className="w-8 h-8 text-sky-400" />
                      </div>
                      <span className="text-xs" data-unique-id="291caa7f-32e3-4730-9011-55c18ae2bf60" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="4604bdc8-09a9-4596-aeae-9a72fc240eee" data-file-name="components/help-modal.tsx">Dark Mode</span></span>
                    </div>
                    
                    <div className="flex flex-col items-center" data-unique-id="e0833afc-dca6-43aa-b1a1-7da73b093876" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-gradient-to-br from-white to-[#121212] border border-border flex items-center justify-center mb-1" data-unique-id="7647b8b0-a192-4df0-9409-2ac6a8d6bd36" data-file-name="components/help-modal.tsx">
                        <Laptop className="w-8 h-8 text-primary" />
                      </div>
                      <span className="text-xs" data-unique-id="68b1299f-a35e-4fa8-b805-d490ab5c5854" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="afb6ddff-9850-47ca-9578-1a84bdadc716" data-file-name="components/help-modal.tsx">System Preference</span></span>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
            </div>
            
            <div className="p-6 border-t border-border flex justify-between items-center" data-unique-id="115995cf-97d8-42fe-a4c5-6aa8ba0deb8e" data-file-name="components/help-modal.tsx">
              <p className="text-sm text-muted-foreground" data-unique-id="4d5e4099-0fd0-4bbb-9035-9b37a019cbcd" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="4693770c-c505-46f6-a3e6-b2db9adbc4fd" data-file-name="components/help-modal.tsx">
                Questions or feedback? Contact support@detroitaxle.com
              </span></p>
              <button onClick={() => {
            onClose();
            if (typeof window !== 'undefined') {
              localStorage.setItem('helpModalClosed', 'true');
            }
          }} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors" data-unique-id="00ffdb20-d783-45fe-87f9-ea3c52ef4e89" data-file-name="components/help-modal.tsx">
                <span className="editable-text" data-unique-id="e74bb727-2962-43b3-8006-5bb2a7172423" data-file-name="components/help-modal.tsx">Close</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>;
}

// Add missing imports to fix build errors
import { Moon, Sun, Laptop } from 'lucide-react';