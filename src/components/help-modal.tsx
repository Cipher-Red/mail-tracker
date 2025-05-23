'use client';

import { useState } from 'react';
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
  return <AnimatePresence>
      {isOpen && <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} transition={{
      duration: 0.2
    }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose} data-unique-id="b29ce088-5a22-4499-a700-516f0fd57345" data-file-name="components/help-modal.tsx">
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
      }} className="bg-background rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="8b1a33e8-88c0-434c-8125-11269b9e6faa" data-file-name="components/help-modal.tsx">
            <div className="flex justify-between items-center p-6 border-b border-border" data-unique-id="00f3a2df-7db9-4da0-8bb7-89705c89ef5d" data-file-name="components/help-modal.tsx">
              <h2 className="text-2xl font-semibold" data-unique-id="b74477a7-7f78-43fc-95a7-9c9b840684ff" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="092d74d8-9f9c-4df8-952f-251c51df9958" data-file-name="components/help-modal.tsx">Help & Getting Started</span></h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-accent" data-unique-id="43d3254f-0963-4bbd-9d87-8a6a689a4995" data-file-name="components/help-modal.tsx">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-74px)]" data-unique-id="ce2b844a-2ef2-4c21-848b-359779606ba8" data-file-name="components/help-modal.tsx">
              <h3 className="text-lg font-medium mb-4" data-unique-id="c8f4c110-3516-4e2c-8e10-c28b619a2776" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="419610c2-5ac4-4d5c-add5-a7ae63c176b0" data-file-name="components/help-modal.tsx">Welcome to Detroit Axle Email Builder!</span></h3>
              <p className="text-muted-foreground mb-6" data-unique-id="eee41cbb-5142-45ed-b3ad-a5b3f8437d21" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="3bfb3f68-c05d-4ecd-a948-f654cc7d11b4" data-file-name="components/help-modal.tsx">
                This application helps you create, manage, and send professional email templates to your customers.
                Here's how to get the most out of it:
              </span></p>
              
              <FeatureHighlight title="Creating Email Templates" description="Design professional emails with customizable variables" defaultOpen={true} completionKey="create-template">
                <div className="space-y-3" data-unique-id="21a82eb9-478d-4dc6-a372-668dc69a161e" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="0a9c726e-5a9f-49e8-99d6-466d3f5e5f73" data-file-name="components/help-modal.tsx">
                    <FileText className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="fb0658f6-97d4-4645-9a07-9d1c133818dc" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="f1589ed1-0a70-495d-8113-7a94ed98d3ea" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="25814f77-b6ef-4354-872e-eaa4ea8e3c48" data-file-name="components/help-modal.tsx">Using the Template Editor</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="6a3bbb15-64b6-4f00-b235-7068b33d535b" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="d494ce83-9201-4be0-868f-db14fd05cfcf" data-file-name="components/help-modal.tsx">
                        The template editor allows you to create and customize email templates.
                        You can use variables like </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="87f47b5e-5482-450f-937c-3ecf38c50e9b" data-file-name="components/help-modal.tsx">{'{{customerName}}'}</code><span className="editable-text" data-unique-id="c87fe27b-83c3-44d0-b22d-51e914f1a9d8" data-file-name="components/help-modal.tsx"> and
                        </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="ad1426fe-d659-43bd-a66c-3eb2f6780e84" data-file-name="components/help-modal.tsx">{'{{orderNumber}}'}</code><span className="editable-text" data-unique-id="6dbe6a36-1ba2-4557-ac71-fe4fbb46df25" data-file-name="components/help-modal.tsx"> that will be replaced with actual customer data when sending.
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start" data-unique-id="8faff3bb-3640-47ae-a68b-478af5f86b83" data-file-name="components/help-modal.tsx">
                    <Search className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="2b713b10-0e91-4823-b7b4-010e815ebd85" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="4a905fe1-a305-4b85-b1ab-0d4948cf4dfd" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="83ac5d1f-555d-4f2d-bc30-3655625da389" data-file-name="components/help-modal.tsx">Preview Your Templates</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="58d78d67-a878-4ba9-ba3e-d5910651292c" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="fd3171cb-b0d2-41e9-b481-3c032672a1cd" data-file-name="components/help-modal.tsx">
                        Use the preview panel on the right to see how your email will look in real-time as you make changes.
                        You can also send a test email to yourself to see exactly how it will appear in an email client.
                      </span></p>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Managing Customers" description="Add, organize and import customer data" completionKey="manage-customers">
                <div className="space-y-3" data-unique-id="2a3c932e-ab9c-45ee-8823-58025740a239" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="a51a0d5c-5d48-406a-bd57-f943105a1fb9" data-file-name="components/help-modal.tsx">
                    <Users className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="380c2f6e-2d53-4f0c-9ab4-6f93409e023a" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="b3859a6c-c027-4f81-87b8-b3f6a28b1c85" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="fe3b5cf3-cfad-4e49-afc7-e882df4a25a4" data-file-name="components/help-modal.tsx">Customer Database</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="9cbfe721-1da3-43ea-9684-542008e64fe6" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="55593049-71b4-41be-825e-6700338c97e8" data-file-name="components/help-modal.tsx">
                        Add customers manually or import them from Excel. You can add details like name, email,
                        company, tags, and custom notes. Your customer data is stored locally in your browser.
                      </span></p>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Sending Emails" description="Send personalized emails to your customers" completionKey="send-emails">
                <div className="space-y-3" data-unique-id="5c15d94f-b823-4ea3-a1bd-832c8b148443" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="0d958292-e7a7-447e-aa6c-2f404ef49b37" data-file-name="components/help-modal.tsx">
                    <Send className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="0d125d74-8bbc-4878-bcd4-2b3faf5298d7" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="870a8883-b817-46e2-9311-706a99ec0374" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="10b69b89-807e-4636-b100-f64bed3f2bc4" data-file-name="components/help-modal.tsx">Sending Bulk Emails</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="d078a601-6242-4cbe-ab7b-9e4ddf41b9e4" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="6ef77a67-16c9-4428-9ac8-3a7e60b7ce8c" data-file-name="components/help-modal.tsx">
                        Select customers from your database or import them from Excel to send personalized emails.
                        Each email will be customized with the customer's specific information.
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="bg-accent/20 p-4 rounded-md border border-border mt-2" data-unique-id="2793e950-4a18-49fd-bb6e-809399970943" data-file-name="components/help-modal.tsx">
                    <p className="text-sm font-medium" data-unique-id="88aa79b5-20f2-43d6-a1c1-93d431c9e078" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="958a15e4-f52f-4eb3-975d-489cfc959e5e" data-file-name="components/help-modal.tsx">Email Configuration Required</span></p>
                    <p className="text-xs text-muted-foreground mt-1" data-unique-id="080bc9c7-eefe-4e2c-94bb-e3273c452f87" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="17a8ae1a-a15e-44f4-b905-ca5b1a4ba4d4" data-file-name="components/help-modal.tsx">
                      To send real emails, you'll need to set up an email service API key in your environment variables.
                      See the documentation for how to set this up.
                    </span></p>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Theme Customization" description="Switch between light and dark mode" isNew={true} completionKey="theme">
                <div className="space-y-3" data-unique-id="e93941a8-f5b8-4e96-a121-53ab1c08f00e" data-file-name="components/help-modal.tsx">
                  <p className="text-sm text-muted-foreground" data-unique-id="c0dc36f8-6e91-45ec-a6ce-5c09ac62464b" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="f3ad47ee-c418-4661-ab48-f309e47a852a" data-file-name="components/help-modal.tsx">
                    You can switch between light and dark mode by clicking the theme toggle button in the top-right corner.
                    The application will remember your preference for future visits.
                  </span></p>
                  
                  <div className="flex items-center justify-center space-x-4 my-4" data-unique-id="5dfd4754-e428-49f6-b99b-57f5f6fcd6f0" data-file-name="components/help-modal.tsx">
                    <div className="flex flex-col items-center" data-unique-id="470bf915-6be5-4ad8-8008-4306dcfe3285" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-white border border-border flex items-center justify-center mb-1" data-unique-id="722b6532-0083-4a9a-a377-199ae8dca166" data-file-name="components/help-modal.tsx">
                        <Sun className="w-8 h-8 text-amber-500" />
                      </div>
                      <span className="text-xs" data-unique-id="6594816b-ccfb-4b70-a63f-54f2846f9f83" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="9603b2c5-ef8b-458e-a712-e1495a562f0d" data-file-name="components/help-modal.tsx">Light Mode</span></span>
                    </div>
                    
                    <div className="flex flex-col items-center" data-unique-id="66f448df-165e-4a40-90e0-fac1474cf19f" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-[#121212] border border-border flex items-center justify-center mb-1" data-unique-id="b479a93e-7d63-4b6e-a51b-43fdaed54523" data-file-name="components/help-modal.tsx">
                        <Moon className="w-8 h-8 text-sky-400" />
                      </div>
                      <span className="text-xs" data-unique-id="4ada9c60-b7b1-4191-964a-378705df9494" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="adb0091a-d7b7-4870-93ee-f27cb55646cc" data-file-name="components/help-modal.tsx">Dark Mode</span></span>
                    </div>
                    
                    <div className="flex flex-col items-center" data-unique-id="8610f41d-07f8-4ba0-ac6b-691f160d1b5f" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-gradient-to-br from-white to-[#121212] border border-border flex items-center justify-center mb-1" data-unique-id="122435d8-1644-4747-879c-9fd59f327338" data-file-name="components/help-modal.tsx">
                        <Laptop className="w-8 h-8 text-primary" />
                      </div>
                      <span className="text-xs" data-unique-id="eddddd51-67a3-45df-9414-87f28a7cd4ac" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="0333a5f8-51bf-4db0-9766-57ec52e5d606" data-file-name="components/help-modal.tsx">System Preference</span></span>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
            </div>
            
            <div className="p-6 border-t border-border flex justify-between items-center" data-unique-id="a3c708f4-5c1c-491b-96fc-2a720ba30c09" data-file-name="components/help-modal.tsx">
              <p className="text-sm text-muted-foreground" data-unique-id="fcc8e503-7f5d-4bb9-ac89-e7d6f0487ec1" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="1dd90f01-b599-4959-adb1-59467682fdec" data-file-name="components/help-modal.tsx">
                Questions or feedback? Contact support@detroitaxle.com
              </span></p>
              <button onClick={() => {
            onClose();
            if (typeof window !== 'undefined') {
              localStorage.setItem('helpModalClosed', 'true');
            }
          }} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors" data-unique-id="45d4645d-67c9-4d56-8c6a-41a325c605b0" data-file-name="components/help-modal.tsx">
                <span className="editable-text" data-unique-id="841373da-5443-4009-bba1-2f6f4d8f01db" data-file-name="components/help-modal.tsx">Close</span>
              </button>
            </div>
          </motion.div>
        </motion.div>}
    </AnimatePresence>;
}

// Add missing imports to fix build errors
import { Moon, Sun, Laptop } from 'lucide-react';