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
    }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose} data-unique-id="7bd248ae-ff38-4c50-b07d-4b1d56a81732" data-file-name="components/help-modal.tsx">
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
      }} className="bg-background rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="06fe16f4-8678-4bf7-9186-8e0b58be4c93" data-file-name="components/help-modal.tsx">
            <div className="flex justify-between items-center p-6 border-b border-border" data-unique-id="7c417efa-72f7-47b0-b47a-38a62f9014bf" data-file-name="components/help-modal.tsx">
              <h2 className="text-2xl font-semibold" data-unique-id="124e60b3-e3fe-41dd-99ab-2e1821a0be50" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="df726319-bcec-4af2-89bf-0d0ab7b34740" data-file-name="components/help-modal.tsx">Help & Getting Started</span></h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-accent" data-unique-id="45ac5fca-3fee-45f9-b64d-7f75f1746610" data-file-name="components/help-modal.tsx">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-74px)]" data-unique-id="a66bf8bb-b85b-4515-afed-caa2f1d5d82d" data-file-name="components/help-modal.tsx">
              <h3 className="text-lg font-medium mb-4" data-unique-id="df443267-04c3-4ef6-8245-836b4f9bd076" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="333e7178-21bf-4849-adb5-1fb53f1837d8" data-file-name="components/help-modal.tsx">Welcome to Detroit Axle Email Builder!</span></h3>
              <p className="text-muted-foreground mb-6" data-unique-id="dc818a7b-5a12-4c7c-99d1-06ea00806693" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="daad4cde-6fd5-4648-8a01-280493f1f03a" data-file-name="components/help-modal.tsx">
                This application helps you create, manage, and send professional email templates to your customers.
                Here's how to get the most out of it:
              </span></p>
              
              <FeatureHighlight title="Creating Email Templates" description="Design professional emails with customizable variables" defaultOpen={true} completionKey="create-template">
                <div className="space-y-3" data-unique-id="a4700b64-60ba-4160-8ce4-97357e418e13" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="8fe47bdd-9a53-4c01-9e8b-6b270ec5686d" data-file-name="components/help-modal.tsx">
                    <FileText className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="ef19edd4-1fef-484e-bfed-bbce4b4eb392" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="7fb90d3b-0003-4899-8ed2-0d54dd5a9d8a" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="8a9f2297-a0a8-42ad-a430-61018d204cbe" data-file-name="components/help-modal.tsx">Using the Template Editor</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="2d489ca0-2c79-4e94-9460-24c5dd264bb0" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="834bbf48-9d7d-4bd6-a23b-cc4e2cca475c" data-file-name="components/help-modal.tsx">
                        The template editor allows you to create and customize email templates.
                        You can use variables like </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="31f98d0f-63de-4ea4-b6af-68e089b05ac1" data-file-name="components/help-modal.tsx">{'{{customerName}}'}</code><span className="editable-text" data-unique-id="571ce029-db5c-486f-ace4-8de69e2944dc" data-file-name="components/help-modal.tsx"> and
                        </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="9558b1a4-0228-4ff7-b46d-54be01a56462" data-file-name="components/help-modal.tsx">{'{{orderNumber}}'}</code><span className="editable-text" data-unique-id="b44e0912-47ea-4701-9011-d248e18d6910" data-file-name="components/help-modal.tsx"> that will be replaced with actual customer data when sending.
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start" data-unique-id="f7aa32a4-5639-4699-a488-e4cebfd59bb2" data-file-name="components/help-modal.tsx">
                    <Search className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="401469a4-02f7-40c1-a2ed-e5e7cf347bf1" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="30573c8e-7e28-4613-9d62-fe6d277a4e89" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="dc7be17b-ad23-4e4b-a8c5-227fcb1e247e" data-file-name="components/help-modal.tsx">Preview Your Templates</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="f600532a-505d-43bb-8037-93075e0e0ad0" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="8d913370-617b-4f29-ba62-952fa84561b0" data-file-name="components/help-modal.tsx">
                        Use the preview panel on the right to see how your email will look in real-time as you make changes.
                        You can also send a test email to yourself to see exactly how it will appear in an email client.
                      </span></p>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Managing Customers" description="Add, organize and import customer data" completionKey="manage-customers">
                <div className="space-y-3" data-unique-id="1943493d-4d57-49df-994e-4511c59dd4e6" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="d4f9d388-5b5b-4760-8403-70be5696bb17" data-file-name="components/help-modal.tsx">
                    <Users className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="093ee6a2-9389-4257-ad1c-3d22c43580ea" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="b294ac86-945a-49d6-9a97-68f8fa914d78" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="53b91f1c-23ef-4d76-9480-c6702296d68e" data-file-name="components/help-modal.tsx">Customer Database</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="cc45e229-09a8-41cc-80df-8d91a930fec9" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="4a386208-26aa-48c2-87e1-561c3aa6ff8d" data-file-name="components/help-modal.tsx">
                        Add customers manually or import them from Excel. You can add details like name, email,
                        company, tags, and custom notes. Your customer data is stored locally in your browser.
                      </span></p>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Sending Emails" description="Send personalized emails to your customers" completionKey="send-emails">
                <div className="space-y-3" data-unique-id="807e0027-7977-44a5-9c65-a30531b58b08" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="71492c2e-69e4-4e0c-a119-9f7ba358aad1" data-file-name="components/help-modal.tsx">
                    <Send className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="dfddfd6c-9982-4b72-a08a-1f98b809bdef" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="430a24c5-d298-49f3-bb96-a58558504493" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="f9b81dae-61af-4463-b37f-0ca445d628d3" data-file-name="components/help-modal.tsx">Sending Bulk Emails</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="d49ecaae-7e01-4039-98de-1c2ee07db3d2" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="68cbee22-1c31-4cf9-acf5-8708b4426ae6" data-file-name="components/help-modal.tsx">
                        Select customers from your database or import them from Excel to send personalized emails.
                        Each email will be customized with the customer's specific information.
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="bg-accent/20 p-4 rounded-md border border-border mt-2" data-unique-id="d41194f7-1f35-47f3-aa6c-2667d21b2cd3" data-file-name="components/help-modal.tsx">
                    <p className="text-sm font-medium" data-unique-id="ce68e510-83f9-4caf-aa0a-08e2d8e5cda3" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="7718a284-15fa-4ac5-bc89-7b3fcc1121b9" data-file-name="components/help-modal.tsx">Email Configuration Required</span></p>
                    <p className="text-xs text-muted-foreground mt-1" data-unique-id="85f4f198-51de-4372-aad6-420651830dc1" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="964b333f-15f7-4a66-aa96-1037d8bd4612" data-file-name="components/help-modal.tsx">
                      To send real emails, you'll need to set up an email service API key in your environment variables.
                      See the documentation for how to set this up.
                    </span></p>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Theme Customization" description="Switch between light and dark mode" isNew={true} completionKey="theme">
                <div className="space-y-3" data-unique-id="8eaa533b-b452-4b34-80d6-2c9f5632963e" data-file-name="components/help-modal.tsx">
                  <p className="text-sm text-muted-foreground" data-unique-id="6518eaab-422a-41a1-bfd7-986a27974d6c" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="1a80e3d1-0928-4aeb-9dd3-b06d21409129" data-file-name="components/help-modal.tsx">
                    You can switch between light and dark mode by clicking the theme toggle button in the top-right corner.
                    The application will remember your preference for future visits.
                  </span></p>
                  
                  <div className="flex items-center justify-center space-x-4 my-4" data-unique-id="f811551c-d258-4f60-bbe5-21bb169b655b" data-file-name="components/help-modal.tsx">
                    <div className="flex flex-col items-center" data-unique-id="e8c0d973-14b3-44a4-a77a-33f42f7400a3" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-white border border-border flex items-center justify-center mb-1" data-unique-id="959d6eee-54a6-4792-8b49-b96b9f1e33fa" data-file-name="components/help-modal.tsx">
                        <Sun className="w-8 h-8 text-amber-500" />
                      </div>
                      <span className="text-xs" data-unique-id="169586f2-b528-40f5-8343-bbe1aa22455c" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="d0f774b8-fe23-462d-9b31-25886d89930c" data-file-name="components/help-modal.tsx">Light Mode</span></span>
                    </div>
                    
                    <div className="flex flex-col items-center" data-unique-id="39a82406-79f4-4a82-99c6-52d59e356c2f" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-[#121212] border border-border flex items-center justify-center mb-1" data-unique-id="83d25869-5bde-4174-8af0-e059320824c1" data-file-name="components/help-modal.tsx">
                        <Moon className="w-8 h-8 text-sky-400" />
                      </div>
                      <span className="text-xs" data-unique-id="6075f817-aea1-4ae2-84e0-db797a5b02d8" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="31d4a586-027b-4914-9461-e985fc4eceed" data-file-name="components/help-modal.tsx">Dark Mode</span></span>
                    </div>
                    
                    <div className="flex flex-col items-center" data-unique-id="c7374734-bf9e-441e-a637-89d284f08c49" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-gradient-to-br from-white to-[#121212] border border-border flex items-center justify-center mb-1" data-unique-id="918bccc1-42a4-47b0-851f-565ac7ed9e4e" data-file-name="components/help-modal.tsx">
                        <Laptop className="w-8 h-8 text-primary" />
                      </div>
                      <span className="text-xs" data-unique-id="a461f36c-336d-496f-9d2c-f8afed70036f" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="952c2974-f101-43fe-ac2d-87be45cf3030" data-file-name="components/help-modal.tsx">System Preference</span></span>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
            </div>
            
            <div className="p-6 border-t border-border flex justify-between items-center" data-unique-id="ff041d38-0e9f-4d81-8f03-c300c528ad67" data-file-name="components/help-modal.tsx">
              <p className="text-sm text-muted-foreground" data-unique-id="05f49494-d250-4109-8368-6a7f8c99c579" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="e1c23d82-2c53-4f8c-a9dc-dafac69a5a74" data-file-name="components/help-modal.tsx">
                Questions or feedback? Contact support@detroitaxle.com
              </span></p>
              <button onClick={() => {
            onClose();
            if (typeof window !== 'undefined') {
              localStorage.setItem('helpModalClosed', 'true');
            }
          }} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors" data-unique-id="fb63ab62-3aeb-45e3-ac46-4cd2a7689110" data-file-name="components/help-modal.tsx">
                <span className="editable-text" data-unique-id="c3783642-e47c-4462-aacd-30c526703922" data-file-name="components/help-modal.tsx">Close</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>;
}

// Add missing imports to fix build errors
import { Moon, Sun, Laptop } from 'lucide-react';