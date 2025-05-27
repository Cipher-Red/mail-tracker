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
    }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose} data-unique-id="2456a27f-7e96-4104-9489-8ae952f5b0f7" data-file-name="components/help-modal.tsx">
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
      }} className="bg-card rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden backdrop-blur-sm" onClick={e => e.stopPropagation()} data-unique-id="be31d226-2704-42ab-a7dd-31c21a7bd442" data-file-name="components/help-modal.tsx">
            <div className="flex justify-between items-center p-6 border-b border-border" data-unique-id="b2a1bfb6-b7f0-44a1-953d-b59177118eab" data-file-name="components/help-modal.tsx">
              <h2 className="text-2xl font-semibold" data-unique-id="82ac2a00-3927-458d-8296-41417c7bead3" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="97786ca8-fdc7-4244-90bc-64a5fe7bb601" data-file-name="components/help-modal.tsx">Help & Getting Started</span></h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-accent" data-unique-id="fa39296d-fe84-4522-8f1e-11872b3f09e2" data-file-name="components/help-modal.tsx">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-74px)]" data-unique-id="a77d3695-02aa-4fe2-8368-9c1ba91c6f31" data-file-name="components/help-modal.tsx">
              <h3 className="text-lg font-medium mb-4" data-unique-id="7f29155e-7243-4259-b1c9-f20faa333859" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="4c6a4632-3824-4862-9518-369234a7d545" data-file-name="components/help-modal.tsx">Welcome to Detroit Axle Email Builder!</span></h3>
              <p className="text-muted-foreground mb-6" data-unique-id="fb737df1-e88c-4014-b3bb-518a9776e781" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="5a78e9b3-fd2a-4a60-915c-4291ed4f5ef7" data-file-name="components/help-modal.tsx">
                This application helps you create, manage, and send professional email templates to your customers.
                Here's how to get the most out of it:
              </span></p>
              
              <FeatureHighlight title="Creating Email Templates" description="Design professional emails with customizable variables" defaultOpen={true} completionKey="create-template">
                <div className="space-y-3" data-unique-id="d6349149-309f-4086-8685-f042e1297fe6" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="4f7bb6eb-eefe-46a2-824d-23be0c30d43e" data-file-name="components/help-modal.tsx">
                    <FileText className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="2edffd3b-6577-47fb-9b43-d7aff27ef609" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="3d0171b0-ffa4-4420-9f22-6497a4f2cc23" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="3167eed1-9778-45a7-a7d1-4b39d22a1ba8" data-file-name="components/help-modal.tsx">Using the Template Editor</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="22215def-f3e1-4f80-a01e-58e3ade21996" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="9596e4c0-0bd0-4a39-a17d-1e1983b72081" data-file-name="components/help-modal.tsx">
                        The template editor allows you to create and customize email templates.
                        You can use variables like </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="6bb635d9-757c-4c61-8cd1-ba9d9fafd963" data-file-name="components/help-modal.tsx">{'{{customerName}}'}</code><span className="editable-text" data-unique-id="d9e894d4-0aeb-49dc-8ca6-2cea3d855c80" data-file-name="components/help-modal.tsx"> and
                        </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="e37ce646-1491-401d-bf23-8e0fd9cbfa4b" data-file-name="components/help-modal.tsx">{'{{orderNumber}}'}</code><span className="editable-text" data-unique-id="61046fe8-9a36-4112-9294-98505119b579" data-file-name="components/help-modal.tsx"> that will be replaced with actual customer data when sending.
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start" data-unique-id="f42b8925-8786-445a-a325-0d728066c316" data-file-name="components/help-modal.tsx">
                    <Search className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="7b60dac2-9c82-4938-a0b6-03b56092edb4" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="6e176856-775e-4256-8643-5a1823fcdcb9" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="16369e4a-e237-4684-9654-8dade03ba828" data-file-name="components/help-modal.tsx">Preview Your Templates</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="849fe46f-4707-4b7b-8b83-6195d4c25666" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="07a7ec27-4f6d-47d8-b26e-4ea8b54bb98d" data-file-name="components/help-modal.tsx">
                        Use the preview panel on the right to see how your email will look in real-time as you make changes.
                        You can also send a test email to yourself to see exactly how it will appear in an email client.
                      </span></p>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Managing Customers" description="Add, organize and import customer data" completionKey="manage-customers">
                <div className="space-y-3" data-unique-id="383b15ff-6e93-4c10-baeb-9e7a5fbfb387" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="61a91732-e911-4902-b1ef-e2055ad829ff" data-file-name="components/help-modal.tsx">
                    <Users className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="2f8eb512-5909-4075-a692-b045b3330a21" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="fb68193e-0e73-4999-8526-da5379c2f213" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="bd11764f-c80d-441f-bc57-0be4428756aa" data-file-name="components/help-modal.tsx">Customer Database</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="d508becc-5aeb-407e-9104-ff25b8ee0e3c" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="4fb25e69-9e99-4ada-88fa-e7751631fe80" data-file-name="components/help-modal.tsx">
                        Add customers manually or import them from Excel. You can add details like name, email,
                        company, tags, and custom notes. Your customer data is stored locally in your browser.
                      </span></p>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Sending Emails" description="Send personalized emails to your customers" completionKey="send-emails">
                <div className="space-y-3" data-unique-id="38d41ef5-33aa-4011-87a0-cbfd9a36e98b" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="70dcb3b9-6dd2-421e-81c2-55be7d54605e" data-file-name="components/help-modal.tsx">
                    <Send className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="c9866389-fab6-4f0a-adc8-3de07b764976" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="fd21214e-1f12-46a4-8a52-f52dc8ec226d" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="735df588-073a-41a7-8019-9fd05f459f03" data-file-name="components/help-modal.tsx">Sending Bulk Emails</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="b8f45675-30c7-4b28-9f5a-99ccd8a3d4a2" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="d537d5cc-bd31-437b-b4cc-194ed7b81da1" data-file-name="components/help-modal.tsx">
                        Select customers from your database or import them from Excel to send personalized emails.
                        Each email will be customized with the customer's specific information.
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="bg-accent/20 p-4 rounded-md border border-border mt-2" data-unique-id="2b4910b5-1218-4fab-981c-885075fd5a56" data-file-name="components/help-modal.tsx">
                    <p className="text-sm font-medium" data-unique-id="46939ab1-e125-41d9-b5fd-cb182b35ccd1" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="337f6d64-e39d-4236-a549-5ba75fc093fe" data-file-name="components/help-modal.tsx">Email Configuration Required</span></p>
                    <p className="text-xs text-muted-foreground mt-1" data-unique-id="439fc853-aa0a-4718-b09f-04d1ebca8412" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="1daef425-5530-41a2-94d8-2620ca9f2a47" data-file-name="components/help-modal.tsx">
                      To send real emails, you'll need to set up an email service API key in your environment variables.
                      See the documentation for how to set this up.
                    </span></p>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Theme Customization" description="Switch between light and dark mode" isNew={true} completionKey="theme">
                <div className="space-y-3" data-unique-id="3c13fc25-b33a-494b-9483-60c54588153d" data-file-name="components/help-modal.tsx">
                  <p className="text-sm text-muted-foreground" data-unique-id="7bc058a9-fcfe-4057-8613-b233f63abb2e" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="522d045a-63d3-40c2-97b5-3fad43e8a055" data-file-name="components/help-modal.tsx">
                    You can switch between light and dark mode by clicking the theme toggle button in the top-right corner.
                    The application will remember your preference for future visits.
                  </span></p>
                  
                  <div className="flex items-center justify-center space-x-4 my-4" data-unique-id="79ffbaf8-ef67-4cb4-abd0-45e97404b541" data-file-name="components/help-modal.tsx">
                    <div className="flex flex-col items-center" data-unique-id="01816c33-857a-47de-8e98-33ee89dc91be" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-white border border-border flex items-center justify-center mb-1" data-unique-id="3a22d49e-3ac7-4807-ac95-942bc9365211" data-file-name="components/help-modal.tsx">
                        <Sun className="w-8 h-8 text-amber-500" />
                      </div>
                      <span className="text-xs" data-unique-id="469823b5-e183-48cc-b859-7f258e7efa2d" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="8f87cce9-b3fe-485e-bfeb-fae62f7c998e" data-file-name="components/help-modal.tsx">Light Mode</span></span>
                    </div>
                    
                    <div className="flex flex-col items-center" data-unique-id="c16df50d-0685-4676-a8c7-8f21c71eed57" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-[#121212] border border-border flex items-center justify-center mb-1" data-unique-id="bdb0b173-411c-4dc6-b2ac-d86b3943e97d" data-file-name="components/help-modal.tsx">
                        <Moon className="w-8 h-8 text-sky-400" />
                      </div>
                      <span className="text-xs" data-unique-id="15787dea-3d13-4670-8683-8ad82997ae5a" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="feefac06-067e-4305-a808-287e1dd7bbe7" data-file-name="components/help-modal.tsx">Dark Mode</span></span>
                    </div>
                    
                    <div className="flex flex-col items-center" data-unique-id="9ee5332f-c134-43d4-ab1b-b48237229421" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-gradient-to-br from-white to-[#121212] border border-border flex items-center justify-center mb-1" data-unique-id="019f1a9b-449b-4819-bb9b-1279bd00d644" data-file-name="components/help-modal.tsx">
                        <Laptop className="w-8 h-8 text-primary" />
                      </div>
                      <span className="text-xs" data-unique-id="3cb3179a-0227-41f8-8b4c-eee229bb2668" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="c28cbd40-e1b5-4c53-81f9-31912fb3c165" data-file-name="components/help-modal.tsx">System Preference</span></span>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
            </div>
            
            <div className="p-6 border-t border-border flex justify-between items-center" data-unique-id="765dbc1c-7295-4359-a54d-4391693f3220" data-file-name="components/help-modal.tsx">
              <p className="text-sm text-muted-foreground" data-unique-id="3b74b25a-085c-4f84-a794-85d2ea96c441" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="65e45f66-4e40-4f69-b19e-4c42e8043a52" data-file-name="components/help-modal.tsx">
                Questions or feedback? Contact support@detroitaxle.com
              </span></p>
              <button onClick={() => {
            onClose();
            if (typeof window !== 'undefined') {
              localStorage.setItem('helpModalClosed', 'true');
            }
          }} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors" data-unique-id="1efcf679-3a3c-42c3-84c0-b3ac2d1da1f3" data-file-name="components/help-modal.tsx">
                <span className="editable-text" data-unique-id="c971e66b-0a18-4eb2-a3df-5090bec7df6a" data-file-name="components/help-modal.tsx">Close</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>;
}

// Add missing imports to fix build errors
import { Moon, Sun, Laptop } from 'lucide-react';