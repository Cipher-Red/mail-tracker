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
    }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose} data-unique-id="747386d2-730d-48a9-b7da-488a2a18e07c" data-file-name="components/help-modal.tsx">
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
      }} className="bg-card rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden backdrop-blur-sm" onClick={e => e.stopPropagation()} data-unique-id="bbebe33e-9e42-452c-a56d-7bb9cd5b2c6a" data-file-name="components/help-modal.tsx">
            <div className="flex justify-between items-center p-6 border-b border-border" data-unique-id="7c30e347-a8c8-401e-968c-f15e41040c56" data-file-name="components/help-modal.tsx">
              <h2 className="text-2xl font-semibold" data-unique-id="7f3c623b-1692-4bbb-a208-cf85bd15df60" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="ff00f15a-81aa-4823-b15d-8afbd1221455" data-file-name="components/help-modal.tsx">Help & Getting Started</span></h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-accent" data-unique-id="1719e256-e410-4847-b71e-0db068faef78" data-file-name="components/help-modal.tsx">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-74px)]" data-unique-id="85a2a24d-01f2-40d4-beb2-a1a10a8eef71" data-file-name="components/help-modal.tsx">
              <h3 className="text-lg font-medium mb-4" data-unique-id="a286d91d-3aad-4838-acec-41c638b10867" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="db917dcf-d1bc-4c1b-9c28-b9741fa8f39c" data-file-name="components/help-modal.tsx">Welcome to Detroit Axle Email Builder!</span></h3>
              <p className="text-muted-foreground mb-6" data-unique-id="63c9c1fa-189a-4d11-a60c-882608cdf355" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="d64ce4db-0783-4d23-bc48-c8c27c46df94" data-file-name="components/help-modal.tsx">
                This application helps you create, manage, and send professional email templates to your customers.
                Here's how to get the most out of it:
              </span></p>
              
              <FeatureHighlight title="Creating Email Templates" description="Design professional emails with customizable variables" defaultOpen={true} completionKey="create-template">
                <div className="space-y-3" data-unique-id="cc418501-cb64-4703-a781-d97ae56cfd39" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="997da465-a7d8-4f84-8085-15f1b8d8e26c" data-file-name="components/help-modal.tsx">
                    <FileText className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="11f65282-8d36-4b8e-9106-04a03801606d" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="e37cf49a-ea02-4d9c-b53c-bd1f8b04dc55" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="6f4c4ac0-cf80-441b-8820-e2a509804232" data-file-name="components/help-modal.tsx">Using the Template Editor</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="6f6a469a-b190-4c87-aa85-b749a03ad036" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="b228dfd7-d8bc-4bc7-aeb3-673e168600ae" data-file-name="components/help-modal.tsx">
                        The template editor allows you to create and customize email templates.
                        You can use variables like </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="7c46805a-1bc0-4974-be8d-d08f51fa7007" data-file-name="components/help-modal.tsx">{'{{customerName}}'}</code><span className="editable-text" data-unique-id="7d0b9ef0-0f5a-4d88-ae4b-d64ef45fda13" data-file-name="components/help-modal.tsx"> and
                        </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="c01171e8-8fd1-4168-b025-6be68991922a" data-file-name="components/help-modal.tsx">{'{{orderNumber}}'}</code><span className="editable-text" data-unique-id="6c808449-2413-40fa-be27-4d4c73a0f034" data-file-name="components/help-modal.tsx"> that will be replaced with actual customer data when sending.
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start" data-unique-id="238fb278-831d-4a11-9bb5-04498fb1e180" data-file-name="components/help-modal.tsx">
                    <Search className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="9d66aad1-69c3-4075-8012-f09c60364cf2" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="68f400cd-a6b7-461b-b97d-d4273aa54845" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="c4b11ef3-f1cf-48db-b26d-16f73ca18762" data-file-name="components/help-modal.tsx">Preview Your Templates</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="5bdabda9-3e6b-4b67-baa4-6e267d11d6ba" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="56afb1bd-e3da-4932-a540-58b43d41f516" data-file-name="components/help-modal.tsx">
                        Use the preview panel on the right to see how your email will look in real-time as you make changes.
                        You can also send a test email to yourself to see exactly how it will appear in an email client.
                      </span></p>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Managing Customers" description="Add, organize and import customer data" completionKey="manage-customers">
                <div className="space-y-3" data-unique-id="99872aee-9841-460a-8602-4ee69992c67b" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="1d1404a0-594c-4b05-b4ec-12f1f4fd9f95" data-file-name="components/help-modal.tsx">
                    <Users className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="35b985d9-04e2-4a61-8f22-f58e0494a12f" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="017cf98e-55bc-4805-b8c9-4a6b5f58c4bc" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="be57b81d-f2cc-46c1-bb5a-5fd26eacf094" data-file-name="components/help-modal.tsx">Customer Database</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="c5153c8f-c832-47ce-ad8b-37e4a023aae3" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="e8534d69-fabe-496e-a75c-b27248cf8d26" data-file-name="components/help-modal.tsx">
                        Add customers manually or import them from Excel. You can add details like name, email,
                        company, tags, and custom notes. Your customer data is stored locally in your browser.
                      </span></p>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Sending Emails" description="Send personalized emails to your customers" completionKey="send-emails">
                <div className="space-y-3" data-unique-id="64104987-331d-47ed-9519-39feb175cbd2" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="e4d82a7a-340c-4740-9bc8-d05e146f2157" data-file-name="components/help-modal.tsx">
                    <Send className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="3c1f9a34-1619-426e-bc53-75c0971571e8" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="aa0ff358-b90a-4373-ab12-d39c37e7d917" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="1f0fd7c1-8304-4dcc-a304-a3bd3da4b33d" data-file-name="components/help-modal.tsx">Sending Bulk Emails</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="55b13d76-da04-4b9f-b268-a08ee25a9c4b" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="fd04d18b-f680-47b1-ad57-5770a7dd3d63" data-file-name="components/help-modal.tsx">
                        Select customers from your database or import them from Excel to send personalized emails.
                        Each email will be customized with the customer's specific information.
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="bg-accent/20 p-4 rounded-md border border-border mt-2" data-unique-id="50112959-29c1-43b0-a3d5-6c1956159ba6" data-file-name="components/help-modal.tsx">
                    <p className="text-sm font-medium" data-unique-id="8661f671-e3b6-43ba-878a-d69aa0bc19a6" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="1c90eae9-a7e9-400f-9739-4efb4e0b3eeb" data-file-name="components/help-modal.tsx">Email Configuration Required</span></p>
                    <p className="text-xs text-muted-foreground mt-1" data-unique-id="add7f716-b00e-4378-bc69-615ee5dbe792" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="36c535a3-bc0d-410f-bfa6-994de715451a" data-file-name="components/help-modal.tsx">
                      To send real emails, you'll need to set up an email service API key in your environment variables.
                      See the documentation for how to set this up.
                    </span></p>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Theme Customization" description="Switch between light and dark mode" isNew={true} completionKey="theme">
                <div className="space-y-3" data-unique-id="5eed908b-3643-4df7-934a-ed1a2a4292e5" data-file-name="components/help-modal.tsx">
                  <p className="text-sm text-muted-foreground" data-unique-id="539faae2-3baf-4364-8e14-0b1423ee04b0" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="e42359e8-666e-4798-ab2d-c164ff01c4e1" data-file-name="components/help-modal.tsx">
                    You can switch between light and dark mode by clicking the theme toggle button in the top-right corner.
                    The application will remember your preference for future visits.
                  </span></p>
                  
                  <div className="flex items-center justify-center space-x-4 my-4" data-unique-id="a43fdec8-b5e3-46a2-9344-1f31a7ca48fc" data-file-name="components/help-modal.tsx">
                    <div className="flex flex-col items-center" data-unique-id="05f046e6-1884-4e23-919f-c115e25985a6" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-white border border-border flex items-center justify-center mb-1" data-unique-id="16035a78-a91b-4fc5-962a-0099cc883f0e" data-file-name="components/help-modal.tsx">
                        <Sun className="w-8 h-8 text-amber-500" />
                      </div>
                      <span className="text-xs" data-unique-id="5c410a97-1a49-490c-bea4-384d9db7280f" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="bc99af5b-79a4-42a1-9cd7-5ece635d9533" data-file-name="components/help-modal.tsx">Light Mode</span></span>
                    </div>
                    
                    <div className="flex flex-col items-center" data-unique-id="d7a6bc33-bdeb-42d5-b3be-4dd9483e1621" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-[#121212] border border-border flex items-center justify-center mb-1" data-unique-id="298ea05f-1c1f-46c1-9a46-c6fc2339d804" data-file-name="components/help-modal.tsx">
                        <Moon className="w-8 h-8 text-sky-400" />
                      </div>
                      <span className="text-xs" data-unique-id="67146f67-1bf2-4ada-880b-6c487893db90" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="4c9d9e17-d630-4493-8da0-f7f136e4c76e" data-file-name="components/help-modal.tsx">Dark Mode</span></span>
                    </div>
                    
                    <div className="flex flex-col items-center" data-unique-id="61f66d43-ad27-4ae0-861a-8f2b8126663d" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-gradient-to-br from-white to-[#121212] border border-border flex items-center justify-center mb-1" data-unique-id="38d66e60-396f-4a26-8454-d6ad79eabc11" data-file-name="components/help-modal.tsx">
                        <Laptop className="w-8 h-8 text-primary" />
                      </div>
                      <span className="text-xs" data-unique-id="9dbc3edb-8680-40ae-a9cf-77e35e51b2bb" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="313f6392-fa85-49f9-a1e3-72c954110161" data-file-name="components/help-modal.tsx">System Preference</span></span>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
            </div>
            
            <div className="p-6 border-t border-border flex justify-between items-center" data-unique-id="9ed49c3e-8780-4a82-a63e-1c07fdc500c1" data-file-name="components/help-modal.tsx">
              <p className="text-sm text-muted-foreground" data-unique-id="d773af74-33d1-4ea5-a060-fbcc2e22ad05" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="e767fb13-4d66-4658-85ee-aaaa0e38342d" data-file-name="components/help-modal.tsx">
                Questions or feedback? Contact support@detroitaxle.com
              </span></p>
              <button onClick={() => {
            onClose();
            if (typeof window !== 'undefined') {
              localStorage.setItem('helpModalClosed', 'true');
            }
          }} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors" data-unique-id="4c8b24f5-2d71-4f68-ba62-ef8ee7bd9bff" data-file-name="components/help-modal.tsx">
                <span className="editable-text" data-unique-id="b4709817-83a1-43da-aa57-02609df5932d" data-file-name="components/help-modal.tsx">Close</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>;
}

// Add missing imports to fix build errors
import { Moon, Sun, Laptop } from 'lucide-react';