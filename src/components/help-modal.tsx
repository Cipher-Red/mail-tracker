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
    }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose} data-unique-id="82371c1b-b358-4792-96af-2982ecbf6bc9" data-file-name="components/help-modal.tsx">
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
      }} className="bg-background rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="6c966320-f6b8-46ea-9b71-c9ab2355228a" data-file-name="components/help-modal.tsx">
            <div className="flex justify-between items-center p-6 border-b border-border" data-unique-id="e24efe5d-eec3-4a07-b431-ae7ef8d01645" data-file-name="components/help-modal.tsx">
              <h2 className="text-2xl font-semibold" data-unique-id="360ce362-a805-4783-b0d8-953eb0af556d" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="6aa33f3a-a3c5-4433-ac63-85c601b7b792" data-file-name="components/help-modal.tsx">Help & Getting Started</span></h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-accent" data-unique-id="46d5524f-d4bd-4797-b8d4-41eb17ecdb49" data-file-name="components/help-modal.tsx">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-74px)]" data-unique-id="178a1d9f-4da5-42b9-9bed-4d16d5a803de" data-file-name="components/help-modal.tsx">
              <h3 className="text-lg font-medium mb-4" data-unique-id="36e85c1d-fc6e-424f-9e35-4c33732ab3b2" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="49cdb8a9-67a7-445d-a751-27fb47835fe0" data-file-name="components/help-modal.tsx">Welcome to Detroit Axle Email Builder!</span></h3>
              <p className="text-muted-foreground mb-6" data-unique-id="c74275e8-8f52-4776-bf0c-13583a352a2b" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="de9c24c6-ede8-44b4-8181-b3280b1ea4b2" data-file-name="components/help-modal.tsx">
                This application helps you create, manage, and send professional email templates to your customers.
                Here's how to get the most out of it:
              </span></p>
              
              <FeatureHighlight title="Creating Email Templates" description="Design professional emails with customizable variables" defaultOpen={true} completionKey="create-template">
                <div className="space-y-3" data-unique-id="617a2f21-7669-459c-8c30-c64313f97a88" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="ff88949d-7671-4cbb-8228-b4ae625845e4" data-file-name="components/help-modal.tsx">
                    <FileText className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="0c8c889b-0ef1-4bc0-a646-3357ec7c6a73" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="75736714-f219-487d-8d15-4b78fcefbc85" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="5e818d61-f516-4024-9cdf-555197832e9d" data-file-name="components/help-modal.tsx">Using the Template Editor</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="9e788378-c515-476d-a98f-97e4b165bbec" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="30886a7f-9f77-42e9-94e4-179a1dc7aa46" data-file-name="components/help-modal.tsx">
                        The template editor allows you to create and customize email templates.
                        You can use variables like </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="a762f76a-ee4a-44f4-8593-154fe115f411" data-file-name="components/help-modal.tsx">{'{{customerName}}'}</code><span className="editable-text" data-unique-id="12752061-6abe-4445-9ebd-9274f4edee3b" data-file-name="components/help-modal.tsx"> and
                        </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="24c97a0d-a1e8-491f-8d76-74f55bb61235" data-file-name="components/help-modal.tsx">{'{{orderNumber}}'}</code><span className="editable-text" data-unique-id="461f519a-cbba-479d-bce2-714be8b258dd" data-file-name="components/help-modal.tsx"> that will be replaced with actual customer data when sending.
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start" data-unique-id="616a9099-ae8a-4806-a8a6-00c9d6102a33" data-file-name="components/help-modal.tsx">
                    <Search className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="93ccbeea-c362-4692-a283-1727e5e9d352" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="3fafeb82-db86-4b57-9c40-bbfefd9719be" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="d308a31c-b9d8-48cd-ae83-a23a23d8b65d" data-file-name="components/help-modal.tsx">Preview Your Templates</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="d701ee13-df0a-4c1f-a292-04c93d74daee" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="fdc65fc9-4780-427e-88ed-9c6fc4401143" data-file-name="components/help-modal.tsx">
                        Use the preview panel on the right to see how your email will look in real-time as you make changes.
                        You can also send a test email to yourself to see exactly how it will appear in an email client.
                      </span></p>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Managing Customers" description="Add, organize and import customer data" completionKey="manage-customers">
                <div className="space-y-3" data-unique-id="98142917-23ad-45db-9b9e-1f693d9357fb" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="b88046e6-cd7d-4994-883d-e46bd90bdf8a" data-file-name="components/help-modal.tsx">
                    <Users className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="b1b5d10b-67be-4cfa-9136-a0fd9e8a3ae7" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="52613f21-661d-4241-854f-2727cc40e42b" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="1fb69f51-871f-4ab9-bcd7-e2964298b08a" data-file-name="components/help-modal.tsx">Customer Database</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="2b6f196b-d978-416e-a2e5-5e377d0ac226" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="9bbf455d-da59-47e1-9bfd-00aa0658d60d" data-file-name="components/help-modal.tsx">
                        Add customers manually or import them from Excel. You can add details like name, email,
                        company, tags, and custom notes. Your customer data is stored locally in your browser.
                      </span></p>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Sending Emails" description="Send personalized emails to your customers" completionKey="send-emails">
                <div className="space-y-3" data-unique-id="0c6eb181-9d8c-475a-b2f1-6df1408a1e35" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="880e1b30-9009-4d13-ba38-b3ad2cab4b95" data-file-name="components/help-modal.tsx">
                    <Send className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="266fbb42-6fac-40dc-8b57-f694723aa3b6" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="9dfbef19-a15f-4270-8402-556c5cd818bf" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="b0aa8b8e-f114-43a5-9093-b1341e66a86a" data-file-name="components/help-modal.tsx">Sending Bulk Emails</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="eb95a86e-a8e6-409a-b764-846a5bf3213a" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="7735ede0-4ec6-409a-aa57-bf03a691ad27" data-file-name="components/help-modal.tsx">
                        Select customers from your database or import them from Excel to send personalized emails.
                        Each email will be customized with the customer's specific information.
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="bg-accent/20 p-4 rounded-md border border-border mt-2" data-unique-id="f13216c3-0f68-413f-a7f2-0cd62b309276" data-file-name="components/help-modal.tsx">
                    <p className="text-sm font-medium" data-unique-id="78aec105-fca0-49ca-94bc-155c4772cf7b" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="4c132cae-b51b-4da9-ac00-ef2b675a3145" data-file-name="components/help-modal.tsx">Email Configuration Required</span></p>
                    <p className="text-xs text-muted-foreground mt-1" data-unique-id="dc92004b-39db-446b-ba4d-46997c4b65f9" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="252bd122-c7b5-4c6b-ad8b-2c74dffe6d0b" data-file-name="components/help-modal.tsx">
                      To send real emails, you'll need to set up an email service API key in your environment variables.
                      See the documentation for how to set this up.
                    </span></p>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Theme Customization" description="Switch between light and dark mode" isNew={true} completionKey="theme">
                <div className="space-y-3" data-unique-id="d7fb152d-03f2-474c-b988-70ca2aa1bcfb" data-file-name="components/help-modal.tsx">
                  <p className="text-sm text-muted-foreground" data-unique-id="a4d5eb48-e66b-4d94-87d0-3dc1ea9eac4c" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="41592b9a-d62c-4a98-81ae-3061227ffecb" data-file-name="components/help-modal.tsx">
                    You can switch between light and dark mode by clicking the theme toggle button in the top-right corner.
                    The application will remember your preference for future visits.
                  </span></p>
                  
                  <div className="flex items-center justify-center space-x-4 my-4" data-unique-id="cbd2ce5d-a932-4cd1-acc1-d43eb10c94fb" data-file-name="components/help-modal.tsx">
                    <div className="flex flex-col items-center" data-unique-id="f35438a9-9e09-4d71-9310-ec1a3402f674" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-white border border-border flex items-center justify-center mb-1" data-unique-id="5998eb54-6c38-4847-b4d3-ea4df7e36a2f" data-file-name="components/help-modal.tsx">
                        <Sun className="w-8 h-8 text-amber-500" />
                      </div>
                      <span className="text-xs" data-unique-id="78fa55db-c084-477b-b1e2-8203829ee564" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="08335b63-09da-4d13-9649-cbaf24020052" data-file-name="components/help-modal.tsx">Light Mode</span></span>
                    </div>
                    
                    <div className="flex flex-col items-center" data-unique-id="385e1ff0-82a2-4107-ba68-24a6555ba094" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-[#121212] border border-border flex items-center justify-center mb-1" data-unique-id="a2fcb671-7149-4cb9-9771-69420c662e72" data-file-name="components/help-modal.tsx">
                        <Moon className="w-8 h-8 text-sky-400" />
                      </div>
                      <span className="text-xs" data-unique-id="4d7e8a2d-cf2b-4370-934d-40c9c7b03134" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="4e260f11-3bbd-40b4-82c6-4ccaea1d53db" data-file-name="components/help-modal.tsx">Dark Mode</span></span>
                    </div>
                    
                    <div className="flex flex-col items-center" data-unique-id="ab059667-495a-47b4-91f8-42109084ae55" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-gradient-to-br from-white to-[#121212] border border-border flex items-center justify-center mb-1" data-unique-id="8dedc47f-e12c-4c8c-8533-21e0bdfc9914" data-file-name="components/help-modal.tsx">
                        <Laptop className="w-8 h-8 text-primary" />
                      </div>
                      <span className="text-xs" data-unique-id="8f8b95b2-5b6c-48fe-948e-7136cf796d1d" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="189b318a-4ff6-4346-a715-263bc69d9ca4" data-file-name="components/help-modal.tsx">System Preference</span></span>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
            </div>
            
            <div className="p-6 border-t border-border flex justify-between items-center" data-unique-id="2e862029-2729-49b6-8b65-24819e7bc6e1" data-file-name="components/help-modal.tsx">
              <p className="text-sm text-muted-foreground" data-unique-id="7b56a42e-1021-4bac-915a-0712fe626dbd" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="3ea9da39-041e-4c1e-ab39-8716ea517ce8" data-file-name="components/help-modal.tsx">
                Questions or feedback? Contact support@detroitaxle.com
              </span></p>
              <button onClick={() => {
            onClose();
            if (typeof window !== 'undefined') {
              localStorage.setItem('helpModalClosed', 'true');
            }
          }} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors" data-unique-id="3d09b82e-a004-4bee-b7a4-45446b2966d7" data-file-name="components/help-modal.tsx">
                <span className="editable-text" data-unique-id="4fe6c418-f5cf-4ca2-998e-fdf4a9806cbf" data-file-name="components/help-modal.tsx">Close</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>;
}

// Add missing imports to fix build errors
import { Moon, Sun, Laptop } from 'lucide-react';