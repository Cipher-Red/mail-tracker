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
    }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose} data-unique-id="b8011175-f3d4-4e35-b273-52cff03bc3cb" data-file-name="components/help-modal.tsx">
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
      }} className="bg-background rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="20b50058-c6a0-4842-95f3-177bba7b9d5d" data-file-name="components/help-modal.tsx">
            <div className="flex justify-between items-center p-6 border-b border-border" data-unique-id="15bc044a-4651-49c5-9ec1-1779b394c549" data-file-name="components/help-modal.tsx">
              <h2 className="text-2xl font-semibold" data-unique-id="13fd2ad3-6f6e-45c8-9b7c-b6494f8c6630" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="57e17d5d-c858-4bf4-b83b-c1bd5b53e663" data-file-name="components/help-modal.tsx">Help & Getting Started</span></h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-accent" data-unique-id="b35c7668-a3b2-44bf-9e45-375e5d46cd79" data-file-name="components/help-modal.tsx">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-74px)]" data-unique-id="094c12ec-f5e2-4e5a-abc6-3bfb61c3ad95" data-file-name="components/help-modal.tsx">
              <h3 className="text-lg font-medium mb-4" data-unique-id="8fd8cf11-addc-46f4-b5d4-ffdfd83ab4a5" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="6ebecf38-0651-419d-a554-8d2f4c91fc4c" data-file-name="components/help-modal.tsx">Welcome to Detroit Axle Email Builder!</span></h3>
              <p className="text-muted-foreground mb-6" data-unique-id="ddf35cc9-317a-4c5a-8b00-a827e5de61b4" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="ebc1b300-0cae-45b0-b0dc-1b16ec2dff81" data-file-name="components/help-modal.tsx">
                This application helps you create, manage, and send professional email templates to your customers.
                Here's how to get the most out of it:
              </span></p>
              
              <FeatureHighlight title="Creating Email Templates" description="Design professional emails with customizable variables" defaultOpen={true} completionKey="create-template">
                <div className="space-y-3" data-unique-id="14246564-275d-4700-8478-a77c06dd8822" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="3374f9d8-5454-445a-91ca-9f5d92b76f36" data-file-name="components/help-modal.tsx">
                    <FileText className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="095888d6-2feb-4fc6-9ab2-882d94c34623" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="b2734ffa-cb6d-4981-99e9-274586956e1a" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="41aad915-b794-46ab-9324-665153298752" data-file-name="components/help-modal.tsx">Using the Template Editor</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="e655389d-d40f-4770-80be-0130ccd8992d" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="741e0446-1c40-4a5f-ad72-6b6939be1f17" data-file-name="components/help-modal.tsx">
                        The template editor allows you to create and customize email templates.
                        You can use variables like </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="f098768a-ed38-42f7-9d11-49d85835b2b8" data-file-name="components/help-modal.tsx">{'{{customerName}}'}</code><span className="editable-text" data-unique-id="84e9edad-9ee7-4df2-b524-2da20a52a47b" data-file-name="components/help-modal.tsx"> and
                        </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="2decbefd-ccff-4e8e-8367-9afad603df2a" data-file-name="components/help-modal.tsx">{'{{orderNumber}}'}</code><span className="editable-text" data-unique-id="00c9bb98-75a4-4f39-b071-57fb1b12275f" data-file-name="components/help-modal.tsx"> that will be replaced with actual customer data when sending.
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start" data-unique-id="8927a829-aaf1-46d6-adfc-4c9319c3a2e4" data-file-name="components/help-modal.tsx">
                    <Search className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="cffa3d9c-6c72-4b5d-8432-ecf6b33ee176" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="36813e77-ef7a-437c-b79a-c082cdcd82bb" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="54388579-33b6-42c3-93b2-317ea3a37138" data-file-name="components/help-modal.tsx">Preview Your Templates</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="c7514f35-fed8-41d6-84ab-24e3d3f5b18f" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="3a8c2bc7-ecf6-4129-a7b5-1bef267a0cec" data-file-name="components/help-modal.tsx">
                        Use the preview panel on the right to see how your email will look in real-time as you make changes.
                        You can also send a test email to yourself to see exactly how it will appear in an email client.
                      </span></p>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Managing Customers" description="Add, organize and import customer data" completionKey="manage-customers">
                <div className="space-y-3" data-unique-id="773b8654-4cf6-433a-bfa9-fddc00a71b0c" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="2468e602-34df-425f-9983-55b1599a7fd1" data-file-name="components/help-modal.tsx">
                    <Users className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="3e907cda-bd19-464d-99c3-e5a290b0daf8" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="a2b11106-e53f-4a2d-a3ac-9d40c30d64a9" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="01b7fa0c-3c5c-4b36-805d-50af5a0f33fa" data-file-name="components/help-modal.tsx">Customer Database</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="eccf7395-5320-4637-bdf7-f2a850d84714" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="3762b401-7734-4d00-a2f6-f3c8c5cfe297" data-file-name="components/help-modal.tsx">
                        Add customers manually or import them from Excel. You can add details like name, email,
                        company, tags, and custom notes. Your customer data is stored locally in your browser.
                      </span></p>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Sending Emails" description="Send personalized emails to your customers" completionKey="send-emails">
                <div className="space-y-3" data-unique-id="da907234-4e96-433b-82aa-5776445e47c3" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="0e67f0c6-6970-49e2-a093-050be3a6f9ed" data-file-name="components/help-modal.tsx">
                    <Send className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="0ed20f1b-432d-4420-a82f-4582a74cf36b" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="feed4f4e-292c-49f1-ade4-e81729d51cf9" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="6419c4de-7a46-4f2a-8524-487650a1fbef" data-file-name="components/help-modal.tsx">Sending Bulk Emails</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="dcfa9ac2-5d11-4ed3-9e45-710d0028b63d" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="b2c9c45c-4e54-48d8-be02-928fe4b5a2e3" data-file-name="components/help-modal.tsx">
                        Select customers from your database or import them from Excel to send personalized emails.
                        Each email will be customized with the customer's specific information.
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="bg-accent/20 p-4 rounded-md border border-border mt-2" data-unique-id="205330b1-b7ef-496b-ae91-9931386b17fc" data-file-name="components/help-modal.tsx">
                    <p className="text-sm font-medium" data-unique-id="56fcda9f-684a-458f-bb36-555aec50c5f1" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="3fa38810-80fc-4409-b2e3-d9cd7b6d7ff3" data-file-name="components/help-modal.tsx">Email Configuration Required</span></p>
                    <p className="text-xs text-muted-foreground mt-1" data-unique-id="25001ed6-841a-40b4-8a9e-5ebc88cc9e36" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="b4facdd5-a0c0-46ae-9f14-626378963240" data-file-name="components/help-modal.tsx">
                      To send real emails, you'll need to set up an email service API key in your environment variables.
                      See the documentation for how to set this up.
                    </span></p>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Theme Customization" description="Switch between light and dark mode" isNew={true} completionKey="theme">
                <div className="space-y-3" data-unique-id="f900a2a5-8ba0-49c2-b98a-7d68c6af5030" data-file-name="components/help-modal.tsx">
                  <p className="text-sm text-muted-foreground" data-unique-id="60822e4f-d11f-4a5e-a7e3-2e763360d97a" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="864651d0-972e-43b6-86db-ff6a88a82a27" data-file-name="components/help-modal.tsx">
                    You can switch between light and dark mode by clicking the theme toggle button in the top-right corner.
                    The application will remember your preference for future visits.
                  </span></p>
                  
                  <div className="flex items-center justify-center space-x-4 my-4" data-unique-id="8a054006-0800-428b-8252-c61d9971e0eb" data-file-name="components/help-modal.tsx">
                    <div className="flex flex-col items-center" data-unique-id="36d39966-ae5c-438d-b49b-f80da9acdcfd" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-white border border-border flex items-center justify-center mb-1" data-unique-id="80405db4-3baa-4bf3-88dd-4872af646293" data-file-name="components/help-modal.tsx">
                        <Sun className="w-8 h-8 text-amber-500" />
                      </div>
                      <span className="text-xs" data-unique-id="3b432bff-58f9-43e4-bad1-f158fbba2e42" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="eaa8cad9-6528-4a15-b38d-83c13facf52c" data-file-name="components/help-modal.tsx">Light Mode</span></span>
                    </div>
                    
                    <div className="flex flex-col items-center" data-unique-id="6620d349-36e0-409a-8112-1be0f74c6f75" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-[#121212] border border-border flex items-center justify-center mb-1" data-unique-id="938dbd39-9105-4ced-ad96-57bcd0f8e6e9" data-file-name="components/help-modal.tsx">
                        <Moon className="w-8 h-8 text-sky-400" />
                      </div>
                      <span className="text-xs" data-unique-id="97d12bba-4e50-42ca-ac2c-9cc6267cd1fd" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="68f711f6-c211-4b49-a6d8-6b902d43a4f9" data-file-name="components/help-modal.tsx">Dark Mode</span></span>
                    </div>
                    
                    <div className="flex flex-col items-center" data-unique-id="e6a709d7-106e-4d73-9275-45cdabb967e7" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-gradient-to-br from-white to-[#121212] border border-border flex items-center justify-center mb-1" data-unique-id="3c812df4-5ce3-4fe1-a09a-2209a58576a6" data-file-name="components/help-modal.tsx">
                        <Laptop className="w-8 h-8 text-primary" />
                      </div>
                      <span className="text-xs" data-unique-id="7dbd64dd-cfae-46a2-8bb9-493546f25022" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="eaefe436-795a-45e1-8e83-af219b626e00" data-file-name="components/help-modal.tsx">System Preference</span></span>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
            </div>
            
            <div className="p-6 border-t border-border flex justify-between items-center" data-unique-id="31b2e326-8931-4d95-9536-59385d2c8bb5" data-file-name="components/help-modal.tsx">
              <p className="text-sm text-muted-foreground" data-unique-id="ce202206-bf65-4387-b0d5-08f32a72e5a3" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="f30c4b4a-1a70-4545-ae18-3ab060d7ce51" data-file-name="components/help-modal.tsx">
                Questions or feedback? Contact support@detroitaxle.com
              </span></p>
              <button onClick={() => {
            onClose();
            if (typeof window !== 'undefined') {
              localStorage.setItem('helpModalClosed', 'true');
            }
          }} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors" data-unique-id="780420aa-e50d-4df1-b4ab-6f83096bc397" data-file-name="components/help-modal.tsx">
                <span className="editable-text" data-unique-id="aa067245-09cd-4f3c-8abf-978e008a6f3f" data-file-name="components/help-modal.tsx">Close</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>;
}

// Add missing imports to fix build errors
import { Moon, Sun, Laptop } from 'lucide-react';