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
    }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose} data-unique-id="7ee0c471-ad21-4c8b-a824-5d0715d14474" data-file-name="components/help-modal.tsx">
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
      }} className="bg-background rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="2a31fbc0-7256-4581-a686-e65687c3a80b" data-file-name="components/help-modal.tsx">
            <div className="flex justify-between items-center p-6 border-b border-border" data-unique-id="1bf8a219-9509-4eb1-a9b4-3efe739787fd" data-file-name="components/help-modal.tsx">
              <h2 className="text-2xl font-semibold" data-unique-id="c6e47298-c282-4bfd-906b-32762eeaca0f" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="d3692d60-81ed-45f5-9a16-dad51a773436" data-file-name="components/help-modal.tsx">Help & Getting Started</span></h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-accent" data-unique-id="a9557bbf-4d5e-416d-838b-c81dd0446ca8" data-file-name="components/help-modal.tsx">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-74px)]" data-unique-id="bdde84f2-93e8-42d5-8dc1-3edb3ab09e89" data-file-name="components/help-modal.tsx">
              <h3 className="text-lg font-medium mb-4" data-unique-id="be3e0e35-8bbf-461f-adda-1267f27f6913" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="40eb6c37-9d9f-4afe-9669-43a18d7842ac" data-file-name="components/help-modal.tsx">Welcome to Detroit Axle Email Builder!</span></h3>
              <p className="text-muted-foreground mb-6" data-unique-id="7d6d5862-d012-49e8-81cb-f05e1062d31b" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="af0e7282-dcd8-4677-bda1-66dd4e9bb003" data-file-name="components/help-modal.tsx">
                This application helps you create, manage, and send professional email templates to your customers.
                Here's how to get the most out of it:
              </span></p>
              
              <FeatureHighlight title="Creating Email Templates" description="Design professional emails with customizable variables" defaultOpen={true} completionKey="create-template">
                <div className="space-y-3" data-unique-id="2cd635ad-1d77-4d8c-9f91-7c37a67873be" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="8399abaa-b34a-4b86-b7c4-9c0f11c3095b" data-file-name="components/help-modal.tsx">
                    <FileText className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="3742f983-080a-489f-b5b2-4afd79c43ea2" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="2b5709d0-b39d-4ac5-a7a9-9eafadad2f6d" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="1ace9139-05e0-4668-8efe-9d3c5ebd6c9a" data-file-name="components/help-modal.tsx">Using the Template Editor</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="6e4e510c-d3b5-4865-8725-3ee4c2f2792e" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="c1fe09aa-356d-4067-b0e4-38e396f26f39" data-file-name="components/help-modal.tsx">
                        The template editor allows you to create and customize email templates.
                        You can use variables like </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="6990b57a-cd51-4334-8dc3-39a623a45587" data-file-name="components/help-modal.tsx">{'{{customerName}}'}</code><span className="editable-text" data-unique-id="b5c96b90-cf44-4646-8be3-09792504746e" data-file-name="components/help-modal.tsx"> and
                        </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="24449b4d-1dc9-4f9d-be24-d781c2dfad61" data-file-name="components/help-modal.tsx">{'{{orderNumber}}'}</code><span className="editable-text" data-unique-id="5ffdc32b-e3ee-4910-a9d2-18b8c49ce530" data-file-name="components/help-modal.tsx"> that will be replaced with actual customer data when sending.
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start" data-unique-id="321a53a2-12f2-4429-b71d-7ec0fea49420" data-file-name="components/help-modal.tsx">
                    <Search className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="b7a949b0-d552-4226-b224-091c9ca1db44" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="8687f718-d6ea-45d4-89eb-fbedbf51fc5f" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="8cbc86a1-1f37-4491-8c43-143be231f889" data-file-name="components/help-modal.tsx">Preview Your Templates</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="4d311589-0182-4a0c-9ab0-04b92f27ebbd" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="627bf30c-af48-46ee-a09c-401ae0dc3604" data-file-name="components/help-modal.tsx">
                        Use the preview panel on the right to see how your email will look in real-time as you make changes.
                        You can also send a test email to yourself to see exactly how it will appear in an email client.
                      </span></p>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Managing Customers" description="Add, organize and import customer data" completionKey="manage-customers">
                <div className="space-y-3" data-unique-id="29debef8-1502-416a-9d14-efdbb7c388c7" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="d6809a46-aefa-4355-9155-ef49adc6389b" data-file-name="components/help-modal.tsx">
                    <Users className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="ec8cef56-136e-4477-9f44-f12a5cf47361" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="2a22c022-f367-4d1d-8843-bd1842830642" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="8a39eacb-9f38-434f-8e67-8552952685d0" data-file-name="components/help-modal.tsx">Customer Database</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="9bbe417f-51c3-463b-b790-cd8c39010fe5" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="47451712-a588-4640-b306-ae33728234fc" data-file-name="components/help-modal.tsx">
                        Add customers manually or import them from Excel. You can add details like name, email,
                        company, tags, and custom notes. Your customer data is stored locally in your browser.
                      </span></p>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Sending Emails" description="Send personalized emails to your customers" completionKey="send-emails">
                <div className="space-y-3" data-unique-id="c356ac7a-ca2a-43b6-8763-64ba0244fdc2" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="7dae8d91-c812-4a47-a591-1d8e204272d9" data-file-name="components/help-modal.tsx">
                    <Send className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="33c5a52b-0562-4bfd-a751-9844f9e08475" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="30db9523-04b3-444a-aaa9-9f404b54123c" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="8a92679a-7b8a-4373-9280-3cbd830177ca" data-file-name="components/help-modal.tsx">Sending Bulk Emails</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="97f18250-358f-49c8-be33-e792a91a02b1" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="c1420d5a-02e9-485a-b736-a81004cb0d86" data-file-name="components/help-modal.tsx">
                        Select customers from your database or import them from Excel to send personalized emails.
                        Each email will be customized with the customer's specific information.
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="bg-accent/20 p-4 rounded-md border border-border mt-2" data-unique-id="1fed5dc9-19b0-4178-9e2f-b678c2cad7ac" data-file-name="components/help-modal.tsx">
                    <p className="text-sm font-medium" data-unique-id="a3b50bc7-6080-409e-afc8-34191b84d173" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="312d308d-88f1-403d-87ed-a5607d2e3de5" data-file-name="components/help-modal.tsx">Email Configuration Required</span></p>
                    <p className="text-xs text-muted-foreground mt-1" data-unique-id="187b04d2-45fa-4ce1-8b44-7ecb4cb0b734" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="f9d2b812-3290-4127-996f-3d582151ca9e" data-file-name="components/help-modal.tsx">
                      To send real emails, you'll need to set up an email service API key in your environment variables.
                      See the documentation for how to set this up.
                    </span></p>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Theme Customization" description="Switch between light and dark mode" isNew={true} completionKey="theme">
                <div className="space-y-3" data-unique-id="e622a6c7-8c55-46be-9163-99ddd5da66e1" data-file-name="components/help-modal.tsx">
                  <p className="text-sm text-muted-foreground" data-unique-id="fa06d248-9755-4c9c-9c45-4738db9ddc54" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="53d16371-e3b1-4aab-8bfd-61576c475a21" data-file-name="components/help-modal.tsx">
                    You can switch between light and dark mode by clicking the theme toggle button in the top-right corner.
                    The application will remember your preference for future visits.
                  </span></p>
                  
                  <div className="flex items-center justify-center space-x-4 my-4" data-unique-id="6fcd41d8-3419-4e15-8659-62ead6d32433" data-file-name="components/help-modal.tsx">
                    <div className="flex flex-col items-center" data-unique-id="43ece29b-08e8-46ab-a1e6-65ccfa876c1b" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-white border border-border flex items-center justify-center mb-1" data-unique-id="46b94376-33ed-42ed-9970-15a83d53119a" data-file-name="components/help-modal.tsx">
                        <Sun className="w-8 h-8 text-amber-500" />
                      </div>
                      <span className="text-xs" data-unique-id="a53c6c89-9778-4c6a-93f2-0856ba0fd295" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="3536ea7d-6b04-4f55-a46b-b5a92031bb38" data-file-name="components/help-modal.tsx">Light Mode</span></span>
                    </div>
                    
                    <div className="flex flex-col items-center" data-unique-id="b6b7a456-d144-4396-92ca-331629da9d6b" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-[#121212] border border-border flex items-center justify-center mb-1" data-unique-id="f442178a-a379-487e-b700-0239f160b950" data-file-name="components/help-modal.tsx">
                        <Moon className="w-8 h-8 text-sky-400" />
                      </div>
                      <span className="text-xs" data-unique-id="d45494c9-2736-4aef-8efe-509db098af74" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="3bd9717c-7ad8-4113-ad21-174274d86ef3" data-file-name="components/help-modal.tsx">Dark Mode</span></span>
                    </div>
                    
                    <div className="flex flex-col items-center" data-unique-id="6780035e-62ea-4178-b608-a697a2778590" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-gradient-to-br from-white to-[#121212] border border-border flex items-center justify-center mb-1" data-unique-id="680bc7e5-9d49-4595-b842-e4cdd0e0d8ce" data-file-name="components/help-modal.tsx">
                        <Laptop className="w-8 h-8 text-primary" />
                      </div>
                      <span className="text-xs" data-unique-id="2d62435e-abcc-46a6-abd1-38e2fc9008d8" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="f1126cd8-544b-4302-9df8-049b58e63705" data-file-name="components/help-modal.tsx">System Preference</span></span>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
            </div>
            
            <div className="p-6 border-t border-border flex justify-between items-center" data-unique-id="b94a2d28-5d3f-485e-ba4a-39a94e726c19" data-file-name="components/help-modal.tsx">
              <p className="text-sm text-muted-foreground" data-unique-id="b639a60b-c15c-437c-82db-c249ea3fca2c" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="a9992f73-c904-4f3b-affa-607cbe66867a" data-file-name="components/help-modal.tsx">
                Questions or feedback? Contact support@detroitaxle.com
              </span></p>
              <button onClick={() => {
            onClose();
            if (typeof window !== 'undefined') {
              localStorage.setItem('helpModalClosed', 'true');
            }
          }} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors" data-unique-id="ffd7e3c3-7cb0-4032-8101-9b5911c28075" data-file-name="components/help-modal.tsx">
                <span className="editable-text" data-unique-id="52613d3a-e12c-48bf-b546-2240ee8f0d2e" data-file-name="components/help-modal.tsx">Close</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>;
}

// Add missing imports to fix build errors
import { Moon, Sun, Laptop } from 'lucide-react';