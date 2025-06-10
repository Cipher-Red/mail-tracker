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
    }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose} data-unique-id="a8478401-cf9a-48cb-abcc-ad3327afa1f5" data-file-name="components/help-modal.tsx">
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
      }} className="bg-card rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden backdrop-blur-sm" onClick={e => e.stopPropagation()} data-unique-id="a33f053d-33f3-4447-8e7f-342b8dbecf18" data-file-name="components/help-modal.tsx">
            <div className="flex justify-between items-center p-6 border-b border-border" data-unique-id="3fffd0b3-2c9a-4ad5-afa0-6a5627102829" data-file-name="components/help-modal.tsx">
              <h2 className="text-2xl font-semibold" data-unique-id="bdd0e722-deb0-48b8-b8bc-8526464540ec" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="995aba92-a945-4b74-9e37-c7ef312bc051" data-file-name="components/help-modal.tsx">Help & Getting Started</span></h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-accent" data-unique-id="09d09438-3404-43c7-8eee-f84866a67de9" data-file-name="components/help-modal.tsx">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-74px)]" data-unique-id="b9f66bfd-cf91-4805-a7f0-4a67d18915e8" data-file-name="components/help-modal.tsx">
              <h3 className="text-lg font-medium mb-4" data-unique-id="0937c96b-39cb-416d-aad0-f29383ee84cd" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="48dda83e-064c-48fb-addc-9bde10f58276" data-file-name="components/help-modal.tsx">Welcome to Detroit Axle Email Builder!</span></h3>
              <p className="text-muted-foreground mb-6" data-unique-id="d45fec29-bc93-4843-80ae-926a33e7f846" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="9fec61d3-872f-4cba-b3a2-076271537515" data-file-name="components/help-modal.tsx">
                This application helps you create, manage, and send professional email templates to your customers.
                Here's how to get the most out of it:
              </span></p>
              
              <FeatureHighlight title="Creating Email Templates" description="Design professional emails with customizable variables" defaultOpen={true} completionKey="create-template">
                <div className="space-y-3" data-unique-id="b57296da-00b4-44b7-922f-db5c4e661920" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="7f8d3a8c-dbed-4d61-b8ad-a6636fd4c5a7" data-file-name="components/help-modal.tsx">
                    <FileText className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="ffe0427f-5923-421d-ad54-9ad113e56d4b" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="8b5c79d8-d992-4ce2-bcc1-4b90c66e99fd" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="22148a0e-3bef-4b9d-ab49-74db52a0e391" data-file-name="components/help-modal.tsx">Using the Template Editor</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="3928d855-24c6-4d73-817a-831e74e1bd31" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="6d2cab30-67de-4491-9cb2-87ff52870f6b" data-file-name="components/help-modal.tsx">
                        The template editor allows you to create and customize email templates.
                        You can use variables like </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="1bc95402-fadf-44e7-a020-a22e3090f915" data-file-name="components/help-modal.tsx">{'{{customerName}}'}</code><span className="editable-text" data-unique-id="ac7c558d-d0f4-4603-980b-bb8ef1230b01" data-file-name="components/help-modal.tsx"> and
                        </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="e4137e5c-c9a0-40de-a7a6-2ab049b0a611" data-file-name="components/help-modal.tsx">{'{{orderNumber}}'}</code><span className="editable-text" data-unique-id="8309db5e-1361-4422-9322-a7662e344522" data-file-name="components/help-modal.tsx"> that will be replaced with actual customer data when sending.
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start" data-unique-id="2d316945-53bd-44d9-a5be-cd86f3d97a0e" data-file-name="components/help-modal.tsx">
                    <Search className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="b9b78dc6-25ca-40bc-94f2-5bb4a44dc8af" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="96a4f72d-aae3-4782-bc89-221b5ebe2c24" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="881e5734-ba73-4df4-86b3-d856029e574b" data-file-name="components/help-modal.tsx">Preview Your Templates</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="e8514b61-b690-46de-bc96-1ed75ac5e3b0" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="344c5690-f950-4053-9cc3-a3405ab69a88" data-file-name="components/help-modal.tsx">
                        Use the preview panel on the right to see how your email will look in real-time as you make changes.
                        You can also send a test email to yourself to see exactly how it will appear in an email client.
                      </span></p>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Managing Customers" description="Add, organize and import customer data" completionKey="manage-customers">
                <div className="space-y-3" data-unique-id="6082b4fa-8f3d-4321-a75b-bd558a4310ec" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="4b100422-eef0-41c1-b595-0cb9f67b67a3" data-file-name="components/help-modal.tsx">
                    <Users className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="f2badad2-a8d2-4a9e-ae0c-3aa142d328fd" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="ccfa9187-d29e-4639-a1fb-6d8a4e4f481c" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="a6c56545-8199-4198-aa83-7e11c2c2c518" data-file-name="components/help-modal.tsx">Customer Database</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="5501a3ba-0e68-4f34-8fea-9fc069b2044f" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="32756b9e-825e-4390-aae8-70489b6f564f" data-file-name="components/help-modal.tsx">
                        Add customers manually or import them from Excel. You can add details like name, email,
                        company, tags, and custom notes. Your customer data is stored locally in your browser.
                      </span></p>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Sending Emails" description="Send personalized emails to your customers" completionKey="send-emails">
                <div className="space-y-3" data-unique-id="cb8b7a4a-f08f-470d-bcf8-0193f4f0c7c6" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="767cc9e4-c606-474b-8064-31d872f0bcc5" data-file-name="components/help-modal.tsx">
                    <Send className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="06bcd9d8-65b2-4907-a249-a72ec41fbcda" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="eafd31da-8df8-4d86-b6ac-7ed7c25404ed" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="539d546f-23bd-4dc5-a686-f356de88dbae" data-file-name="components/help-modal.tsx">Sending Bulk Emails</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="b645f318-6a78-4f18-b2af-bed2b2355eb0" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="cd7f5528-bdab-4700-9fbc-1c1fcf8fb4ea" data-file-name="components/help-modal.tsx">
                        Select customers from your database or import them from Excel to send personalized emails.
                        Each email will be customized with the customer's specific information.
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="bg-accent/20 p-4 rounded-md border border-border mt-2" data-unique-id="bb07c4d7-0018-4b3e-ac8b-d4c5df5e186e" data-file-name="components/help-modal.tsx">
                    <p className="text-sm font-medium" data-unique-id="105b50df-575d-4b0a-a1ed-30d960719d04" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="e70d40f6-0b04-483d-bfd1-d7400482584d" data-file-name="components/help-modal.tsx">Email Configuration Required</span></p>
                    <p className="text-xs text-muted-foreground mt-1" data-unique-id="6cccbaa3-ae93-4db0-80e8-db5e13b9f61e" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="593d55ec-6478-4a47-b60e-5d25e32a9f30" data-file-name="components/help-modal.tsx">
                      To send real emails, you'll need to set up an email service API key in your environment variables.
                      See the documentation for how to set this up.
                    </span></p>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Theme Customization" description="Switch between light and dark mode" isNew={true} completionKey="theme">
                <div className="space-y-3" data-unique-id="4c769161-7f41-44a4-9c13-2cb0dc46226a" data-file-name="components/help-modal.tsx">
                  <p className="text-sm text-muted-foreground" data-unique-id="4c4dfc4c-b068-4a8e-87d6-82b10fca1452" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="30fbb55c-326b-4937-985e-e5c142342d30" data-file-name="components/help-modal.tsx">
                    You can switch between light and dark mode by clicking the theme toggle button in the top-right corner.
                    The application will remember your preference for future visits.
                  </span></p>
                  
                  <div className="flex items-center justify-center space-x-4 my-4" data-unique-id="907fcc66-393d-45e4-880b-e66bbd801c91" data-file-name="components/help-modal.tsx">
                    <div className="flex flex-col items-center" data-unique-id="6ca9722c-5aec-46f0-b64e-a528349911a7" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-white border border-border flex items-center justify-center mb-1" data-unique-id="45d36690-48b5-446c-b8ba-5ab52eaadf93" data-file-name="components/help-modal.tsx">
                        <Sun className="w-8 h-8 text-amber-500" />
                      </div>
                      <span className="text-xs" data-unique-id="113c6307-0e9c-4337-9908-2891fc049338" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="619ea370-5cf9-40f7-b664-41489fa60e90" data-file-name="components/help-modal.tsx">Light Mode</span></span>
                    </div>
                    
                    <div className="flex flex-col items-center" data-unique-id="8a0d1db1-d942-4e98-a48d-f047eb589b81" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-[#121212] border border-border flex items-center justify-center mb-1" data-unique-id="152e47da-a826-454d-aabf-8a82fcd200fe" data-file-name="components/help-modal.tsx">
                        <Moon className="w-8 h-8 text-sky-400" />
                      </div>
                      <span className="text-xs" data-unique-id="8ef852b9-97fd-45af-9668-983071a52ab5" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="ecc16d9c-6348-42c0-82f3-c37ad942ea97" data-file-name="components/help-modal.tsx">Dark Mode</span></span>
                    </div>
                    
                    <div className="flex flex-col items-center" data-unique-id="929f11d1-b26d-46ab-884f-c09f2d0e0b87" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-gradient-to-br from-white to-[#121212] border border-border flex items-center justify-center mb-1" data-unique-id="4e3d84aa-70ae-43de-8d0f-13de0affae14" data-file-name="components/help-modal.tsx">
                        <Laptop className="w-8 h-8 text-primary" />
                      </div>
                      <span className="text-xs" data-unique-id="22a22d7f-1ed3-4353-aa8e-056d10e3f610" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="a7ce9b85-e251-48d7-8fcc-68400936d879" data-file-name="components/help-modal.tsx">System Preference</span></span>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
            </div>
            
            <div className="p-6 border-t border-border flex justify-between items-center" data-unique-id="647161a1-502b-4694-a264-657bb4af81e9" data-file-name="components/help-modal.tsx">
              <p className="text-sm text-muted-foreground" data-unique-id="4d5d0ad1-1776-4717-b4b9-2303cfd365af" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="408f3d02-45e7-4a55-bbce-3f559c3297e3" data-file-name="components/help-modal.tsx">
                Questions or feedback? Contact support@detroitaxle.com
              </span></p>
              <button onClick={() => {
            onClose();
            if (typeof window !== 'undefined') {
              localStorage.setItem('helpModalClosed', 'true');
            }
          }} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors" data-unique-id="29f6fbdf-9f17-4cf5-8587-e1e2c7b3fbf2" data-file-name="components/help-modal.tsx">
                <span className="editable-text" data-unique-id="5700f814-cac0-46b8-9f61-339a0b8db981" data-file-name="components/help-modal.tsx">Close</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>;
}

// Add missing imports to fix build errors
import { Moon, Sun, Laptop } from 'lucide-react';