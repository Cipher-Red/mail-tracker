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
    }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose} data-unique-id="c40df485-73bc-4970-8018-a15b99b7342b" data-file-name="components/help-modal.tsx">
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
      }} className="bg-card rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden backdrop-blur-sm" onClick={e => e.stopPropagation()} data-unique-id="bcc4e74e-5f94-481b-83ee-444949ab78e0" data-file-name="components/help-modal.tsx">
            <div className="flex justify-between items-center p-6 border-b border-border" data-unique-id="daf5c3d7-410f-49dd-a1f5-628117f9cd6a" data-file-name="components/help-modal.tsx">
              <h2 className="text-2xl font-semibold" data-unique-id="42acc8ca-eb71-4150-8704-929c4299501c" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="cbb3842b-0af3-4739-94f0-a530750e8d74" data-file-name="components/help-modal.tsx">Help & Getting Started</span></h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-accent" data-unique-id="8d78cfdf-4866-4d38-b7a8-1491809bcf58" data-file-name="components/help-modal.tsx">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-74px)]" data-unique-id="35e57f87-2c3a-48f1-9fca-49256d0d1bc4" data-file-name="components/help-modal.tsx">
              <h3 className="text-lg font-medium mb-4" data-unique-id="c40b0f0a-ac8a-4d58-a274-7ccfe9240c6f" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="54de0cf9-38fb-4923-b58a-fb771c00eea5" data-file-name="components/help-modal.tsx">Welcome to Detroit Axle Email Builder!</span></h3>
              <p className="text-muted-foreground mb-6" data-unique-id="9828c94a-16cc-4519-b890-d289124c2ca1" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="ae82763f-7a36-47b8-a7f7-d2b399c119f0" data-file-name="components/help-modal.tsx">
                This application helps you create, manage, and send professional email templates to your customers.
                Here's how to get the most out of it:
              </span></p>
              
              <FeatureHighlight title="Creating Email Templates" description="Design professional emails with customizable variables" defaultOpen={true} completionKey="create-template">
                <div className="space-y-3" data-unique-id="eccb5b2e-a65b-4962-84a2-3e3388c302cc" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="cc49b4d1-87b7-47bd-b3f5-aea0609d02ff" data-file-name="components/help-modal.tsx">
                    <FileText className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="27fd67c3-6fca-4036-85b9-0881fd12fa1d" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="b65fa240-5fc5-4ca6-a8e7-34721e48d946" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="0ee4c95f-5d0d-4250-b7d9-516cedbc850c" data-file-name="components/help-modal.tsx">Using the Template Editor</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="94264f59-e0ab-460d-bc3c-9e1866ecdce3" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="29fa4913-a50e-4a08-84ad-6bdf6984fe5b" data-file-name="components/help-modal.tsx">
                        The template editor allows you to create and customize email templates.
                        You can use variables like </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="bf791080-fcb9-4bf9-83bc-b2882cad5aab" data-file-name="components/help-modal.tsx">{'{{customerName}}'}</code><span className="editable-text" data-unique-id="c4d4f394-4cd5-4d31-81e0-ee9bd03bb901" data-file-name="components/help-modal.tsx"> and
                        </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="80874b9e-da35-4334-a467-80b39789ac77" data-file-name="components/help-modal.tsx">{'{{orderNumber}}'}</code><span className="editable-text" data-unique-id="e26ca537-3343-436b-a031-bc96e7df55d8" data-file-name="components/help-modal.tsx"> that will be replaced with actual customer data when sending.
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start" data-unique-id="1296bb98-c919-400d-a45f-f353c324c292" data-file-name="components/help-modal.tsx">
                    <Search className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="123b0189-0e4a-4ce5-b1cd-5fa386a1694f" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="0d0d1a33-8f4b-483a-a036-ee9915f85e20" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="01deb877-ac4d-445a-8fb9-8514cae9b207" data-file-name="components/help-modal.tsx">Preview Your Templates</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="a2fd6617-85bf-4e57-b6db-2f2f26c15ce3" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="224851ac-d916-4b65-948f-fbc2d3d08908" data-file-name="components/help-modal.tsx">
                        Use the preview panel on the right to see how your email will look in real-time as you make changes.
                        You can also send a test email to yourself to see exactly how it will appear in an email client.
                      </span></p>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Managing Customers" description="Add, organize and import customer data" completionKey="manage-customers">
                <div className="space-y-3" data-unique-id="dadb315f-2be2-4f62-8ea9-7d02bd7a9196" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="bbf989fc-3e48-41aa-9a01-ae7f41aebf62" data-file-name="components/help-modal.tsx">
                    <Users className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="8f633235-9937-4792-a1cb-1fd1f70125c7" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="f110c9d6-5214-42ef-bb45-ca5f6c361060" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="a6d90e9f-858c-46a3-8764-c94d222790e1" data-file-name="components/help-modal.tsx">Customer Database</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="66dc0f3e-3b38-4f0b-a09d-0258920f0a54" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="ef52fbd0-5c6d-457c-b12b-66993dfe5be6" data-file-name="components/help-modal.tsx">
                        Add customers manually or import them from Excel. You can add details like name, email,
                        company, tags, and custom notes. Your customer data is stored locally in your browser.
                      </span></p>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Sending Emails" description="Send personalized emails to your customers" completionKey="send-emails">
                <div className="space-y-3" data-unique-id="d9197384-11ab-495f-9598-445a7f7fe5fc" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="fb1d62b8-0674-4d88-94f3-cd8f15c433e3" data-file-name="components/help-modal.tsx">
                    <Send className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="7194aa08-ca58-405d-ad75-de7d5573fe69" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="2eaf2727-183b-4051-ace9-85a48a373f31" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="243d5b0c-0a3a-4db0-9344-552031288679" data-file-name="components/help-modal.tsx">Sending Bulk Emails</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="13cb710a-3596-464c-baa5-857e8344c4c4" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="57582d1e-53ca-4c5f-a0d6-efd31b758307" data-file-name="components/help-modal.tsx">
                        Select customers from your database or import them from Excel to send personalized emails.
                        Each email will be customized with the customer's specific information.
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="bg-accent/20 p-4 rounded-md border border-border mt-2" data-unique-id="97a34e54-e6fe-4e30-b6af-2569d03deb54" data-file-name="components/help-modal.tsx">
                    <p className="text-sm font-medium" data-unique-id="350bc60b-8452-4d0d-bae4-70ac94a6e156" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="5ed39ca4-b9b8-469b-8fb5-95103527ca4e" data-file-name="components/help-modal.tsx">Email Configuration Required</span></p>
                    <p className="text-xs text-muted-foreground mt-1" data-unique-id="85cde8f4-8479-4218-ae53-87e64121e059" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="8bc78e89-2862-4a46-9055-9646f3a8c3b3" data-file-name="components/help-modal.tsx">
                      To send real emails, you'll need to set up an email service API key in your environment variables.
                      See the documentation for how to set this up.
                    </span></p>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Theme Customization" description="Switch between light and dark mode" isNew={true} completionKey="theme">
                <div className="space-y-3" data-unique-id="1b8b1e84-d279-4785-bb1f-ea3a078a889e" data-file-name="components/help-modal.tsx">
                  <p className="text-sm text-muted-foreground" data-unique-id="bce0643e-b0c4-483d-9aa2-bc3145049304" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="702de1ea-b972-4d79-9e3f-b28e7866525f" data-file-name="components/help-modal.tsx">
                    You can switch between light and dark mode by clicking the theme toggle button in the top-right corner.
                    The application will remember your preference for future visits.
                  </span></p>
                  
                  <div className="flex items-center justify-center space-x-4 my-4" data-unique-id="fdb41b21-5fd2-4037-97e5-0bd96a804612" data-file-name="components/help-modal.tsx">
                    <div className="flex flex-col items-center" data-unique-id="e58a6fea-cffa-4194-8ec4-422a4f2f3172" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-white border border-border flex items-center justify-center mb-1" data-unique-id="582903fa-23ff-4804-8381-1ba94f6c26ab" data-file-name="components/help-modal.tsx">
                        <Sun className="w-8 h-8 text-amber-500" />
                      </div>
                      <span className="text-xs" data-unique-id="692457ed-194e-4a77-a2c1-867b21d1e746" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="28048d38-af97-45fa-a4b6-2928990d2185" data-file-name="components/help-modal.tsx">Light Mode</span></span>
                    </div>
                    
                    <div className="flex flex-col items-center" data-unique-id="362f5958-8360-41d7-952f-7786199f483b" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-[#121212] border border-border flex items-center justify-center mb-1" data-unique-id="73777e0b-2ddb-4bc6-9c4b-9ea50f0f2e18" data-file-name="components/help-modal.tsx">
                        <Moon className="w-8 h-8 text-sky-400" />
                      </div>
                      <span className="text-xs" data-unique-id="54eb6705-66cf-490c-a109-988e4aac75ea" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="a966d031-c2cf-4714-a285-09b807dd546f" data-file-name="components/help-modal.tsx">Dark Mode</span></span>
                    </div>
                    
                    <div className="flex flex-col items-center" data-unique-id="df18be3e-f93b-46f3-9c37-7a59982e987c" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-gradient-to-br from-white to-[#121212] border border-border flex items-center justify-center mb-1" data-unique-id="1a6d874a-b8da-47ee-83b7-70f95d256c41" data-file-name="components/help-modal.tsx">
                        <Laptop className="w-8 h-8 text-primary" />
                      </div>
                      <span className="text-xs" data-unique-id="9dca4318-63c7-4ae0-ad12-7e56c10c96f2" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="3c5b9dda-9839-485b-aea3-a09946ff8981" data-file-name="components/help-modal.tsx">System Preference</span></span>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
            </div>
            
            <div className="p-6 border-t border-border flex justify-between items-center" data-unique-id="35d6a1ed-a893-42dd-b6f1-7bcf956db21a" data-file-name="components/help-modal.tsx">
              <p className="text-sm text-muted-foreground" data-unique-id="db05731a-1a50-4d85-b6be-0ed95bda405b" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="a41236b2-d267-40f4-9a5e-d29d9ba15b6b" data-file-name="components/help-modal.tsx">
                Questions or feedback? Contact support@detroitaxle.com
              </span></p>
              <button onClick={() => {
            onClose();
            if (typeof window !== 'undefined') {
              localStorage.setItem('helpModalClosed', 'true');
            }
          }} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors" data-unique-id="9b0247c6-f5bb-47f3-ace8-63d76d0d8a5e" data-file-name="components/help-modal.tsx">
                <span className="editable-text" data-unique-id="f8c974e9-d66a-4f05-a762-d6e63c31748e" data-file-name="components/help-modal.tsx">Close</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>;
}

// Add missing imports to fix build errors
import { Moon, Sun, Laptop } from 'lucide-react';