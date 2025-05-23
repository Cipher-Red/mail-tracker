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
    }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose} data-unique-id="b836297b-1249-44cd-8b2d-a8f548ab0d89" data-file-name="components/help-modal.tsx">
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
      }} className="bg-background rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="8c620bed-5472-450a-abfc-24dabd877957" data-file-name="components/help-modal.tsx">
            <div className="flex justify-between items-center p-6 border-b border-border" data-unique-id="24761b02-5fe5-42da-ade1-5a4cd4c3bf0f" data-file-name="components/help-modal.tsx">
              <h2 className="text-2xl font-semibold" data-unique-id="ccb4c14b-ce80-4ac6-b4ea-43c1880d86c8" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="b27e86a5-3317-4801-ae1e-fe241caf39e6" data-file-name="components/help-modal.tsx">Help & Getting Started</span></h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-accent" data-unique-id="5caf9126-6179-41b9-afef-c03d7ff3a22e" data-file-name="components/help-modal.tsx">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-74px)]" data-unique-id="fec8cf78-2bb5-49db-b7b8-f413d6bb7bb5" data-file-name="components/help-modal.tsx">
              <h3 className="text-lg font-medium mb-4" data-unique-id="680e96ff-d443-4d02-88b5-6753736c412e" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="e9f3e250-ff90-4907-971f-ac5701c1e448" data-file-name="components/help-modal.tsx">Welcome to Detroit Axle Email Builder!</span></h3>
              <p className="text-muted-foreground mb-6" data-unique-id="de378e32-2be4-4e98-80d7-6fca55589047" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="47fc839e-1d08-4e5e-9186-c872d1f81bf8" data-file-name="components/help-modal.tsx">
                This application helps you create, manage, and send professional email templates to your customers.
                Here's how to get the most out of it:
              </span></p>
              
              <FeatureHighlight title="Creating Email Templates" description="Design professional emails with customizable variables" defaultOpen={true} completionKey="create-template">
                <div className="space-y-3" data-unique-id="60f9663a-ab7c-432e-964e-a6d9aab697ae" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="361fa46e-1cfa-41e5-bfef-669c3eb3c5e2" data-file-name="components/help-modal.tsx">
                    <FileText className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="967a896a-4bef-4361-8258-7b402d28e14c" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="500f9400-8729-4dab-90cd-b6ab062c208f" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="134a6291-a3e3-4431-bc31-a1e22e4b698b" data-file-name="components/help-modal.tsx">Using the Template Editor</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="4b3e0dcb-c35e-4aaa-9725-71e05bb1e407" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="f8d0c330-9c15-413e-be02-6dee8badffb3" data-file-name="components/help-modal.tsx">
                        The template editor allows you to create and customize email templates.
                        You can use variables like </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="2d319e7a-b1c6-4480-8697-7721514f71e7" data-file-name="components/help-modal.tsx">{'{{customerName}}'}</code><span className="editable-text" data-unique-id="cb24e102-b411-4126-8622-743b3cc330c3" data-file-name="components/help-modal.tsx"> and
                        </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="7d03ae06-19d6-450c-8557-179028af84c7" data-file-name="components/help-modal.tsx">{'{{orderNumber}}'}</code><span className="editable-text" data-unique-id="bb28fc5d-a0c0-4ccf-b204-a79c2c258c45" data-file-name="components/help-modal.tsx"> that will be replaced with actual customer data when sending.
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start" data-unique-id="48de89c5-9d46-4319-892d-ed7bf922d62c" data-file-name="components/help-modal.tsx">
                    <Search className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="e886aa8d-5a38-49e8-90c5-b8a7dc6e18ab" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="1c9a3885-0b86-4040-bdee-389a6cb10d4d" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="7f130cbd-d87e-480b-b0cf-5856f91fa75d" data-file-name="components/help-modal.tsx">Preview Your Templates</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="1f1d64c9-3670-4de5-9b19-dd30547d7752" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="57b5a365-49b7-4c3a-b70a-0113e7ebd90e" data-file-name="components/help-modal.tsx">
                        Use the preview panel on the right to see how your email will look in real-time as you make changes.
                        You can also send a test email to yourself to see exactly how it will appear in an email client.
                      </span></p>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Managing Customers" description="Add, organize and import customer data" completionKey="manage-customers">
                <div className="space-y-3" data-unique-id="7563dbd7-a25f-4903-8e36-3e842c02a71a" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="623284e2-cf76-49dc-8470-c6737ae22db4" data-file-name="components/help-modal.tsx">
                    <Users className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="d6872bea-9bb4-4ab2-852a-2b9c572ef3ef" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="2e5b4f73-3df1-4e5f-a38b-0171c4169ce2" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="8c58cbae-607c-4d31-b082-517933b4203b" data-file-name="components/help-modal.tsx">Customer Database</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="9ea6c9c1-10b1-4445-8f9a-0284d9af5a5c" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="9340853f-8e6d-45c1-bffc-c515c6520883" data-file-name="components/help-modal.tsx">
                        Add customers manually or import them from Excel. You can add details like name, email,
                        company, tags, and custom notes. Your customer data is stored locally in your browser.
                      </span></p>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Sending Emails" description="Send personalized emails to your customers" completionKey="send-emails">
                <div className="space-y-3" data-unique-id="78516d93-909c-4f41-bfc5-0afc143cae0d" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="d8df8871-d3dd-4126-850c-11b0b0cfb0dd" data-file-name="components/help-modal.tsx">
                    <Send className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="5432cad8-0009-4c4e-8d4c-1d3ab2099d53" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="21ec6965-5cab-4831-a25c-ff3e104c2761" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="04e8c895-7f36-4113-bd7b-209fbce91891" data-file-name="components/help-modal.tsx">Sending Bulk Emails</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="f4b602dc-a07a-4134-b886-cf5f76c07a0c" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="316c29dc-47b6-4215-8a95-b568b4c081cf" data-file-name="components/help-modal.tsx">
                        Select customers from your database or import them from Excel to send personalized emails.
                        Each email will be customized with the customer's specific information.
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="bg-accent/20 p-4 rounded-md border border-border mt-2" data-unique-id="92d9fb60-d4b6-4f73-ae4e-6a98763ade1e" data-file-name="components/help-modal.tsx">
                    <p className="text-sm font-medium" data-unique-id="9b27f9fb-43df-4dbd-980b-8c9d6533a09c" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="bda94fe3-44ef-49e8-9c2b-71e6683d807a" data-file-name="components/help-modal.tsx">Email Configuration Required</span></p>
                    <p className="text-xs text-muted-foreground mt-1" data-unique-id="7d2e6f3b-8702-4e3d-af23-db2032aa7264" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="ad67bad0-342f-4d4e-a1c1-e39b4e4604b6" data-file-name="components/help-modal.tsx">
                      To send real emails, you'll need to set up an email service API key in your environment variables.
                      See the documentation for how to set this up.
                    </span></p>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Theme Customization" description="Switch between light and dark mode" isNew={true} completionKey="theme">
                <div className="space-y-3" data-unique-id="710e5855-2a4a-4f48-8e4f-32bd0d531ada" data-file-name="components/help-modal.tsx">
                  <p className="text-sm text-muted-foreground" data-unique-id="048efd98-f213-417d-8e98-10062f349298" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="f05d1221-37ee-4f2f-b85f-c7d620ba6bd6" data-file-name="components/help-modal.tsx">
                    You can switch between light and dark mode by clicking the theme toggle button in the top-right corner.
                    The application will remember your preference for future visits.
                  </span></p>
                  
                  <div className="flex items-center justify-center space-x-4 my-4" data-unique-id="e6ad6414-74e0-4570-b01d-9db355bb9191" data-file-name="components/help-modal.tsx">
                    <div className="flex flex-col items-center" data-unique-id="cd2b0aa3-36d2-4a88-b82c-c479f81ffac3" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-white border border-border flex items-center justify-center mb-1" data-unique-id="2786a6fb-e290-4548-a1e4-e7f44891d610" data-file-name="components/help-modal.tsx">
                        <Sun className="w-8 h-8 text-amber-500" />
                      </div>
                      <span className="text-xs" data-unique-id="44752058-722c-437a-b984-33f4c612a841" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="3c8cc280-2bb9-40a2-9a7e-ba3f105c7a63" data-file-name="components/help-modal.tsx">Light Mode</span></span>
                    </div>
                    
                    <div className="flex flex-col items-center" data-unique-id="83ac604d-1054-45f4-8678-a70ada94a4fc" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-[#121212] border border-border flex items-center justify-center mb-1" data-unique-id="d34d56b8-9189-40b9-8ce2-f21169c9674d" data-file-name="components/help-modal.tsx">
                        <Moon className="w-8 h-8 text-sky-400" />
                      </div>
                      <span className="text-xs" data-unique-id="7f5fc6c6-6713-4f29-ab44-1bbc37bafb66" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="59fe05fb-97bd-4fd0-9268-979b5daa0eb0" data-file-name="components/help-modal.tsx">Dark Mode</span></span>
                    </div>
                    
                    <div className="flex flex-col items-center" data-unique-id="84b4b968-b9a2-4752-a6b6-560455c1b7a9" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-gradient-to-br from-white to-[#121212] border border-border flex items-center justify-center mb-1" data-unique-id="d11fd8fe-76af-4fa9-b286-17f966e87efb" data-file-name="components/help-modal.tsx">
                        <Laptop className="w-8 h-8 text-primary" />
                      </div>
                      <span className="text-xs" data-unique-id="c282d532-dc6a-42f3-a704-cfdde7352eb5" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="c3039573-6bfb-4cdb-a637-6023b446cdb7" data-file-name="components/help-modal.tsx">System Preference</span></span>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
            </div>
            
            <div className="p-6 border-t border-border flex justify-between items-center" data-unique-id="1687b33f-1de3-4aa8-af2d-9855d7901edc" data-file-name="components/help-modal.tsx">
              <p className="text-sm text-muted-foreground" data-unique-id="55acfa61-4852-4917-a604-ec6a4828df7c" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="1944bf4b-dd30-439a-a4b3-d868ede1e96f" data-file-name="components/help-modal.tsx">
                Questions or feedback? Contact support@detroitaxle.com
              </span></p>
              <button onClick={() => {
            onClose();
            if (typeof window !== 'undefined') {
              localStorage.setItem('helpModalClosed', 'true');
            }
          }} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors" data-unique-id="efc8b8c4-3cbf-4746-9f5e-41d284543e99" data-file-name="components/help-modal.tsx">
                <span className="editable-text" data-unique-id="9b150962-c6e3-4376-8c78-8ee3ec3e2ab1" data-file-name="components/help-modal.tsx">Close</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>;
}

// Add missing imports to fix build errors
import { Moon, Sun, Laptop } from 'lucide-react';