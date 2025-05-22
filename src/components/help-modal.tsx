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
    }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose} data-unique-id="a119aa38-f00c-410e-b6ce-0840c9410633" data-file-name="components/help-modal.tsx">
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
      }} className="bg-background rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="00db3c6d-17c5-4a27-a448-6f849caf0b93" data-file-name="components/help-modal.tsx">
            <div className="flex justify-between items-center p-6 border-b border-border" data-unique-id="73c9a9f2-57a7-41f6-8037-29d93a72c9fa" data-file-name="components/help-modal.tsx">
              <h2 className="text-2xl font-semibold" data-unique-id="223030de-6784-4c20-b555-83de1dab0655" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="c53ee4b8-3b47-48db-84e2-ebc183e35b90" data-file-name="components/help-modal.tsx">Help & Getting Started</span></h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-accent" data-unique-id="9b59d721-083a-4ad9-8a57-8b6cbba73aee" data-file-name="components/help-modal.tsx">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-74px)]" data-unique-id="296a9e66-1723-4d28-ab80-deae81f3f4ae" data-file-name="components/help-modal.tsx">
              <h3 className="text-lg font-medium mb-4" data-unique-id="82c12d59-60b0-44cc-b612-2cbbc855489f" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="e4975568-f351-4809-8c1e-77363b5d23b9" data-file-name="components/help-modal.tsx">Welcome to Detroit Axle Email Builder!</span></h3>
              <p className="text-muted-foreground mb-6" data-unique-id="beed15e7-94e1-4df2-93f9-2e5428854f7e" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="ac3c380d-decf-423c-b526-ee22ed4396ea" data-file-name="components/help-modal.tsx">
                This application helps you create, manage, and send professional email templates to your customers.
                Here's how to get the most out of it:
              </span></p>
              
              <FeatureHighlight title="Creating Email Templates" description="Design professional emails with customizable variables" defaultOpen={true} completionKey="create-template">
                <div className="space-y-3" data-unique-id="6e41a3bf-7e40-4ef7-aaa5-0259ec0dbe8d" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="cad56d11-1645-4632-be78-27274ee9b0f5" data-file-name="components/help-modal.tsx">
                    <FileText className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="f44af723-6f2a-43c7-85b1-461f0be95ba0" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="14dfbbfb-ab29-4824-a4e4-a2158f06cdc3" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="b5dbaa1d-6690-40d6-ae1e-531a129a94ff" data-file-name="components/help-modal.tsx">Using the Template Editor</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="40f99b16-1a36-44f4-aba0-5eca298c92d9" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="32292f1e-4043-4231-9085-13906c5cd65d" data-file-name="components/help-modal.tsx">
                        The template editor allows you to create and customize email templates.
                        You can use variables like </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="b55521b9-4b09-4a29-bf2a-8c7e87bed553" data-file-name="components/help-modal.tsx">{'{{customerName}}'}</code><span className="editable-text" data-unique-id="f4ba7f9c-a505-4006-b8d4-32b15907f1ec" data-file-name="components/help-modal.tsx"> and
                        </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="1f47243d-098b-4d6c-ba5c-ad98a0228a4a" data-file-name="components/help-modal.tsx">{'{{orderNumber}}'}</code><span className="editable-text" data-unique-id="238fb7db-0a8e-42f3-9d35-2559d8cd8364" data-file-name="components/help-modal.tsx"> that will be replaced with actual customer data when sending.
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start" data-unique-id="bbb948e2-7b45-4fcd-a947-e77978136f91" data-file-name="components/help-modal.tsx">
                    <Search className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="692c7fa8-4a1e-4e1d-abff-47543f78b2bb" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="36775205-8302-4838-a7de-e37a31241ed0" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="3a700877-021e-4d8e-9234-282006035255" data-file-name="components/help-modal.tsx">Preview Your Templates</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="01f142fb-19da-4200-807e-5f7f2b34c87c" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="4f7ea423-08b5-48e7-9a87-aa6aad7356b7" data-file-name="components/help-modal.tsx">
                        Use the preview panel on the right to see how your email will look in real-time as you make changes.
                        You can also send a test email to yourself to see exactly how it will appear in an email client.
                      </span></p>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Managing Customers" description="Add, organize and import customer data" completionKey="manage-customers">
                <div className="space-y-3" data-unique-id="f05c0fc6-f851-46f0-999c-616712870d17" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="2fb57f44-015d-4682-9d45-61c4072f3f3b" data-file-name="components/help-modal.tsx">
                    <Users className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="771885b7-92c5-4045-8a5b-d5d88977d679" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="4d5b12ce-aa75-4ce5-af64-5b4aa577e4b5" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="f67e8e4b-ae03-4d8c-a2da-b76e33db1894" data-file-name="components/help-modal.tsx">Customer Database</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="cc6a9d91-8704-4982-aa11-1aa3bcf754e0" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="b09be52c-9647-4e37-811b-0d62ab5fe8bd" data-file-name="components/help-modal.tsx">
                        Add customers manually or import them from Excel. You can add details like name, email,
                        company, tags, and custom notes. Your customer data is stored locally in your browser.
                      </span></p>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Sending Emails" description="Send personalized emails to your customers" completionKey="send-emails">
                <div className="space-y-3" data-unique-id="013621bd-1ec4-40a4-810a-9e553b237f99" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="c5e2281c-f943-40da-ad6a-ab03ff2bda9e" data-file-name="components/help-modal.tsx">
                    <Send className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="270c1ba6-a66a-46e4-9b29-8d0ef61a76e9" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="59ecfc15-1193-4d98-95e7-fe5e06b8ddf5" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="1f2fef9e-3965-41db-9533-87be40c0ff37" data-file-name="components/help-modal.tsx">Sending Bulk Emails</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="f6428aab-74fc-469f-8082-1af531fd219c" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="b89c6d96-1a3f-4b21-8a02-c74dd14884da" data-file-name="components/help-modal.tsx">
                        Select customers from your database or import them from Excel to send personalized emails.
                        Each email will be customized with the customer's specific information.
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="bg-accent/20 p-4 rounded-md border border-border mt-2" data-unique-id="95a138ba-c50d-4d8c-8934-dc4f2718f460" data-file-name="components/help-modal.tsx">
                    <p className="text-sm font-medium" data-unique-id="492fdedb-9a4a-470e-ab51-a060b762cf04" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="c36993f6-de5d-4671-9484-c8648108a9cf" data-file-name="components/help-modal.tsx">Email Configuration Required</span></p>
                    <p className="text-xs text-muted-foreground mt-1" data-unique-id="90d83fff-7521-4d35-8e04-40d0d1868943" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="9b698110-a691-463c-bbf5-ee5347b83b62" data-file-name="components/help-modal.tsx">
                      To send real emails, you'll need to set up an email service API key in your environment variables.
                      See the documentation for how to set this up.
                    </span></p>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Theme Customization" description="Switch between light and dark mode" isNew={true} completionKey="theme">
                <div className="space-y-3" data-unique-id="510a2511-26cc-4e8c-bef6-5837d1e4ca38" data-file-name="components/help-modal.tsx">
                  <p className="text-sm text-muted-foreground" data-unique-id="ccfaa545-8c0d-4bff-8fde-183a6bd78bc5" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="209af543-fe82-47cc-8b5c-0fda78c36f7f" data-file-name="components/help-modal.tsx">
                    You can switch between light and dark mode by clicking the theme toggle button in the top-right corner.
                    The application will remember your preference for future visits.
                  </span></p>
                  
                  <div className="flex items-center justify-center space-x-4 my-4" data-unique-id="b33a00b2-9a2b-4ca4-98a7-6a51d3967034" data-file-name="components/help-modal.tsx">
                    <div className="flex flex-col items-center" data-unique-id="c5202c2c-b353-43de-9758-954423bd6406" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-white border border-border flex items-center justify-center mb-1" data-unique-id="302e96a9-390c-4a1e-a956-49e4e6ea611d" data-file-name="components/help-modal.tsx">
                        <Sun className="w-8 h-8 text-amber-500" />
                      </div>
                      <span className="text-xs" data-unique-id="3d1a951c-4f8f-425c-8665-ff572e5c263b" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="b549d2c4-4a6a-4121-96ff-5af1211e4aa3" data-file-name="components/help-modal.tsx">Light Mode</span></span>
                    </div>
                    
                    <div className="flex flex-col items-center" data-unique-id="9d8b7d9d-228a-453b-8096-0f753192df1d" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-[#121212] border border-border flex items-center justify-center mb-1" data-unique-id="3ff23457-91b1-44ed-86c0-27c3579dedd1" data-file-name="components/help-modal.tsx">
                        <Moon className="w-8 h-8 text-sky-400" />
                      </div>
                      <span className="text-xs" data-unique-id="0fff600d-e171-40a5-a74f-05b2ae41e7d5" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="ee0f17d3-bc2a-4f27-a9a0-470fec0759a1" data-file-name="components/help-modal.tsx">Dark Mode</span></span>
                    </div>
                    
                    <div className="flex flex-col items-center" data-unique-id="42d27837-02a2-4eea-8649-3f65ad6990a7" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-gradient-to-br from-white to-[#121212] border border-border flex items-center justify-center mb-1" data-unique-id="fabc329b-c230-4cbf-928b-fadeac22c35b" data-file-name="components/help-modal.tsx">
                        <Laptop className="w-8 h-8 text-primary" />
                      </div>
                      <span className="text-xs" data-unique-id="2f3f1fe9-cd6c-457f-97e6-c2b33f3f27b3" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="e0fdffc0-4f8e-4ee5-bac6-8015bf2049a8" data-file-name="components/help-modal.tsx">System Preference</span></span>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
            </div>
            
            <div className="p-6 border-t border-border flex justify-between items-center" data-unique-id="3c6557ed-543c-4fb3-a137-40556f8fadf3" data-file-name="components/help-modal.tsx">
              <p className="text-sm text-muted-foreground" data-unique-id="7f7e8cce-9478-4844-895a-1629b586b6ac" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="5d93aa39-ecee-4542-86ad-be26f15c1351" data-file-name="components/help-modal.tsx">
                Questions or feedback? Contact support@detroitaxle.com
              </span></p>
              <button onClick={onClose} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors" data-unique-id="0e97efaa-b773-4778-8161-78676998eb42" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="88923786-935b-4569-bd4b-6835b284cbc8" data-file-name="components/help-modal.tsx">
                Close
              </span></button>
            </div>
          </motion.div>
        </motion.div>}
    </AnimatePresence>;
}

// Add missing imports to fix build errors
import { Moon, Sun, Laptop } from 'lucide-react';