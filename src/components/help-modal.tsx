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
    }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose} data-unique-id="4261e018-6c89-4b4b-930b-35d0ee42c1d1" data-file-name="components/help-modal.tsx">
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
      }} className="bg-background rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="7f00bac2-c141-46b6-9630-4dda45b1b64c" data-file-name="components/help-modal.tsx">
            <div className="flex justify-between items-center p-6 border-b border-border" data-unique-id="677ddd1d-4cf6-42ab-9662-dcbea3e2a35d" data-file-name="components/help-modal.tsx">
              <h2 className="text-2xl font-semibold" data-unique-id="bbd94054-6611-447e-bb4b-bac11268eef0" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="038b170c-9236-41b3-811a-e4766f2c676e" data-file-name="components/help-modal.tsx">Help & Getting Started</span></h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-accent" data-unique-id="8b3efd3c-f76e-4116-a81f-420a55f017ff" data-file-name="components/help-modal.tsx">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-74px)]" data-unique-id="fcf9a963-5f91-4181-99b4-9f764ec2f208" data-file-name="components/help-modal.tsx">
              <h3 className="text-lg font-medium mb-4" data-unique-id="06812dbb-4100-4364-bb4b-c58cd32178c1" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="287ffd36-5d43-4e4e-90ae-01a0801c2b8e" data-file-name="components/help-modal.tsx">Welcome to Detroit Axle Email Builder!</span></h3>
              <p className="text-muted-foreground mb-6" data-unique-id="e80ce7b8-da47-464c-8eb1-4a16c4deb434" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="38c108ff-f811-46aa-954d-63331690818d" data-file-name="components/help-modal.tsx">
                This application helps you create, manage, and send professional email templates to your customers.
                Here's how to get the most out of it:
              </span></p>
              
              <FeatureHighlight title="Creating Email Templates" description="Design professional emails with customizable variables" defaultOpen={true} completionKey="create-template">
                <div className="space-y-3" data-unique-id="d0b1b496-3eec-4b41-b336-a92d5fb9e9bc" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="2a2fd929-80c7-4bd8-8b6b-128a70b978a0" data-file-name="components/help-modal.tsx">
                    <FileText className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="b7621142-461a-40ca-99f6-471f4415b430" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="cd4e84ac-da4c-4446-b8d9-e40015af9528" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="542dcace-df0c-4f6f-b51c-7e1f2950369e" data-file-name="components/help-modal.tsx">Using the Template Editor</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="a880d105-12b8-4abc-86ee-89a877965509" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="d0ccf621-4740-481e-a2ab-74947aec1c81" data-file-name="components/help-modal.tsx">
                        The template editor allows you to create and customize email templates.
                        You can use variables like </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="8b2adb53-df95-401e-a202-856e05145569" data-file-name="components/help-modal.tsx">{'{{customerName}}'}</code><span className="editable-text" data-unique-id="aa754bb9-abbd-4018-a3f6-eeefcd906619" data-file-name="components/help-modal.tsx"> and
                        </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="3014a50e-6651-49fb-8c95-034ff2af1484" data-file-name="components/help-modal.tsx">{'{{orderNumber}}'}</code><span className="editable-text" data-unique-id="be5dc433-4e9e-4de2-aaf0-da68f965ca58" data-file-name="components/help-modal.tsx"> that will be replaced with actual customer data when sending.
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start" data-unique-id="b7d6bc6b-8f5d-4142-98ea-92925f95fab4" data-file-name="components/help-modal.tsx">
                    <Search className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="cafe379a-7a84-4db0-9c0e-31dd337424be" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="22e73794-b21a-4f49-9432-d76318aa79a2" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="be4be003-eaee-42c5-aee0-1de687e4b19d" data-file-name="components/help-modal.tsx">Preview Your Templates</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="8e7fc452-aed0-4295-9392-09a965b1e005" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="331fcd25-ac64-4618-bc36-99f9ea081fad" data-file-name="components/help-modal.tsx">
                        Use the preview panel on the right to see how your email will look in real-time as you make changes.
                        You can also send a test email to yourself to see exactly how it will appear in an email client.
                      </span></p>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Managing Customers" description="Add, organize and import customer data" completionKey="manage-customers">
                <div className="space-y-3" data-unique-id="51e48ed7-177e-4c18-b4fe-81600615c976" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="f1e11971-e8bd-46f6-85de-ab24c6833f65" data-file-name="components/help-modal.tsx">
                    <Users className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="cb925b07-cc58-4a92-9466-1e67bd1d6f2c" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="a95475b1-b77f-4c71-a133-9af48eb74598" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="0d4e6888-d7fc-4f77-8b7f-bda311de65e6" data-file-name="components/help-modal.tsx">Customer Database</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="86e26f85-eb9c-431b-bc4d-93c5908864cf" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="16c100ed-914f-46fc-879d-7d1acce197ef" data-file-name="components/help-modal.tsx">
                        Add customers manually or import them from Excel. You can add details like name, email,
                        company, tags, and custom notes. Your customer data is stored locally in your browser.
                      </span></p>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Sending Emails" description="Send personalized emails to your customers" completionKey="send-emails">
                <div className="space-y-3" data-unique-id="572fbcfd-ac4d-495f-8689-5a49b499b6a7" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="24fede58-88d5-4d86-9fee-6a83fd6e3db3" data-file-name="components/help-modal.tsx">
                    <Send className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="cda75020-d1f9-457e-8d34-fa22c7c37ac5" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="79b66fc2-6634-4a76-9c3a-c9eacec7f584" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="f825e46a-a6b0-4113-9832-802cea4e2eb1" data-file-name="components/help-modal.tsx">Sending Bulk Emails</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="2bcd282d-a6f2-4218-834b-77adf6b99719" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="f48bbf22-58a8-4d50-8234-eba7d69f83f4" data-file-name="components/help-modal.tsx">
                        Select customers from your database or import them from Excel to send personalized emails.
                        Each email will be customized with the customer's specific information.
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="bg-accent/20 p-4 rounded-md border border-border mt-2" data-unique-id="d5183691-a449-419a-aa13-9a029d1909e5" data-file-name="components/help-modal.tsx">
                    <p className="text-sm font-medium" data-unique-id="5f3a1843-a855-414d-9de7-db134f09ea2d" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="65381dd1-3cc1-4dac-ab4e-b0b74042a65e" data-file-name="components/help-modal.tsx">Email Configuration Required</span></p>
                    <p className="text-xs text-muted-foreground mt-1" data-unique-id="355370b6-f0bc-4928-991f-4d3785282f71" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="4d858cef-fe46-4096-ab02-99746269ffff" data-file-name="components/help-modal.tsx">
                      To send real emails, you'll need to set up an email service API key in your environment variables.
                      See the documentation for how to set this up.
                    </span></p>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Theme Customization" description="Switch between light and dark mode" isNew={true} completionKey="theme">
                <div className="space-y-3" data-unique-id="8cd560b0-2b54-4a95-87d1-3556a1250be0" data-file-name="components/help-modal.tsx">
                  <p className="text-sm text-muted-foreground" data-unique-id="79fe9455-02fb-47d7-b6b2-b4fd6e52154a" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="ce0acbe1-5426-48f9-afed-16d6aca88342" data-file-name="components/help-modal.tsx">
                    You can switch between light and dark mode by clicking the theme toggle button in the top-right corner.
                    The application will remember your preference for future visits.
                  </span></p>
                  
                  <div className="flex items-center justify-center space-x-4 my-4" data-unique-id="1889f56a-6242-403d-ad07-a39b30da32fb" data-file-name="components/help-modal.tsx">
                    <div className="flex flex-col items-center" data-unique-id="df493a77-1c33-425c-a17c-81a73a35f597" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-white border border-border flex items-center justify-center mb-1" data-unique-id="f244003f-ce2e-4916-9499-0968e6930309" data-file-name="components/help-modal.tsx">
                        <Sun className="w-8 h-8 text-amber-500" />
                      </div>
                      <span className="text-xs" data-unique-id="1ecd6b80-3d11-46c8-9335-e9d8c7bd7801" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="049fed05-36ee-4f84-b264-40a80393fdc8" data-file-name="components/help-modal.tsx">Light Mode</span></span>
                    </div>
                    
                    <div className="flex flex-col items-center" data-unique-id="7b6d5381-5780-4b6d-b2f8-b44771dab706" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-[#121212] border border-border flex items-center justify-center mb-1" data-unique-id="b2a996d2-2024-4042-8911-5aae6c7a55bc" data-file-name="components/help-modal.tsx">
                        <Moon className="w-8 h-8 text-sky-400" />
                      </div>
                      <span className="text-xs" data-unique-id="a194b513-5d1b-4f06-9336-1387bc107710" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="b666b12b-0f45-4c7d-aa39-3c1b3ed79166" data-file-name="components/help-modal.tsx">Dark Mode</span></span>
                    </div>
                    
                    <div className="flex flex-col items-center" data-unique-id="e562465a-b0da-47ad-aa13-a0e51eb53c29" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-gradient-to-br from-white to-[#121212] border border-border flex items-center justify-center mb-1" data-unique-id="60f52278-0ed0-4b57-8cc3-15fb4e2ce6db" data-file-name="components/help-modal.tsx">
                        <Laptop className="w-8 h-8 text-primary" />
                      </div>
                      <span className="text-xs" data-unique-id="b7ea9286-2255-401d-9331-303395be3b5c" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="4a5dad43-819e-49a6-bfdd-be643cec8dcf" data-file-name="components/help-modal.tsx">System Preference</span></span>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
            </div>
            
            <div className="p-6 border-t border-border flex justify-between items-center" data-unique-id="93a348db-5a03-4032-9a36-5d858141edf2" data-file-name="components/help-modal.tsx">
              <p className="text-sm text-muted-foreground" data-unique-id="f0057efc-3bea-4c37-929d-92dfde51688c" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="c8a9b35f-9f9f-485e-bcb7-d2218a30621d" data-file-name="components/help-modal.tsx">
                Questions or feedback? Contact support@detroitaxle.com
              </span></p>
              <button onClick={() => {
            onClose();
            if (typeof window !== 'undefined') {
              localStorage.setItem('helpModalClosed', 'true');
            }
          }} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors" data-unique-id="c7c50fda-3836-4f5b-bc10-8c0e7575b60b" data-file-name="components/help-modal.tsx">
                <span className="editable-text" data-unique-id="d26cfe0f-e86f-4c67-9607-80a07d488d23" data-file-name="components/help-modal.tsx">Close</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>;
}

// Add missing imports to fix build errors
import { Moon, Sun, Laptop } from 'lucide-react';