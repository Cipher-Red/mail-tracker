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
    }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose} data-unique-id="5271ee50-defc-42df-b775-58e9ef466da3" data-file-name="components/help-modal.tsx">
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
      }} className="bg-card rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden backdrop-blur-sm" onClick={e => e.stopPropagation()} data-unique-id="1d0cec5d-f030-474f-b3ad-8eb760d0a8dc" data-file-name="components/help-modal.tsx">
            <div className="flex justify-between items-center p-6 border-b border-border" data-unique-id="b74d9f9d-c2fe-41f8-9b0a-72639250d719" data-file-name="components/help-modal.tsx">
              <h2 className="text-2xl font-semibold" data-unique-id="56a9716f-9bda-4020-93eb-55866ce30215" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="80eac3da-ed6e-432f-a47a-f2497acab898" data-file-name="components/help-modal.tsx">Help & Getting Started</span></h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-accent" data-unique-id="07ae305f-e52f-4726-ae75-c5b2861786c5" data-file-name="components/help-modal.tsx">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-74px)]" data-unique-id="f071995b-c713-4e49-8ff6-31cbdd2cc9a0" data-file-name="components/help-modal.tsx">
              <h3 className="text-lg font-medium mb-4" data-unique-id="88b5e043-f36b-40d7-a369-ef49bc04c444" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="27fe0071-5cf5-4ae7-b567-523458d4eb47" data-file-name="components/help-modal.tsx">Welcome to Detroit Axle Email Builder!</span></h3>
              <p className="text-muted-foreground mb-6" data-unique-id="0d8c88dc-2bfb-42e9-94b2-00f2ffedc4a8" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="e82d3364-25c7-44ea-a8ff-7126e0ada140" data-file-name="components/help-modal.tsx">
                This application helps you create, manage, and send professional email templates to your customers.
                Here's how to get the most out of it:
              </span></p>
              
              <FeatureHighlight title="Creating Email Templates" description="Design professional emails with customizable variables" defaultOpen={true} completionKey="create-template">
                <div className="space-y-3" data-unique-id="ae825439-f3e9-4d77-889c-a81a763abd16" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="d5cb0ccc-6b00-446e-af5f-bd75feaca517" data-file-name="components/help-modal.tsx">
                    <FileText className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="aae4093d-bc3f-46aa-9b7c-6397a0bdc660" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="9d50638b-59cd-4942-974d-3842d801486e" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="52fd8bc1-936b-4baa-9377-810c2b25151e" data-file-name="components/help-modal.tsx">Using the Template Editor</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="c1e34e22-c17d-4547-b16a-03c6440071f3" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="800c13b5-87e9-44d2-991c-3f168794b7d6" data-file-name="components/help-modal.tsx">
                        The template editor allows you to create and customize email templates.
                        You can use variables like </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="d22c5707-099a-4df3-a207-0cc43b1ecb57" data-file-name="components/help-modal.tsx">{'{{customerName}}'}</code><span className="editable-text" data-unique-id="867575c2-825c-4016-9792-f5a64d63aa65" data-file-name="components/help-modal.tsx"> and
                        </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="83539b0f-7904-4f6a-a55f-9e54785aa567" data-file-name="components/help-modal.tsx">{'{{orderNumber}}'}</code><span className="editable-text" data-unique-id="c983d2b1-b510-4007-b1bf-b6cb33447dde" data-file-name="components/help-modal.tsx"> that will be replaced with actual customer data when sending.
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start" data-unique-id="48c38271-f300-45e3-8ecc-df000ba552b1" data-file-name="components/help-modal.tsx">
                    <Search className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="0eff15a0-044d-4f04-b199-552f977457c8" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="5f6b8207-1e81-4809-a8d2-74b9f926ec5c" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="e6c06918-f7b7-46f6-a383-f3a1a47a9fd3" data-file-name="components/help-modal.tsx">Preview Your Templates</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="8b5f967a-38bf-414a-a6db-d99516015ae9" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="d3d5353b-56ea-4d46-ae63-a11f67d94b29" data-file-name="components/help-modal.tsx">
                        Use the preview panel on the right to see how your email will look in real-time as you make changes.
                        You can also send a test email to yourself to see exactly how it will appear in an email client.
                      </span></p>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Managing Customers" description="Add, organize and import customer data" completionKey="manage-customers">
                <div className="space-y-3" data-unique-id="57296621-9742-4433-bc99-35e3031d7402" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="3584df12-44ad-4bb8-bcf2-ad111c34b3e3" data-file-name="components/help-modal.tsx">
                    <Users className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="c262cea6-fab8-4ddb-88da-792b39dbef0a" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="84cd8135-6c1a-49ed-91aa-8d957f9b4161" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="07a55f7f-ce59-4763-8adf-fae8a0211c80" data-file-name="components/help-modal.tsx">Customer Database</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="e81fc7a8-b58e-4392-badd-5490dd34db29" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="abfe0de4-a096-4d83-b79d-dbf16bfdc0bb" data-file-name="components/help-modal.tsx">
                        Add customers manually or import them from Excel. You can add details like name, email,
                        company, tags, and custom notes. Your customer data is stored locally in your browser.
                      </span></p>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Sending Emails" description="Send personalized emails to your customers" completionKey="send-emails">
                <div className="space-y-3" data-unique-id="e2a82ad0-24f9-472c-8178-f294a68d7672" data-file-name="components/help-modal.tsx">
                  <div className="flex items-start" data-unique-id="bfbd31c4-0163-4e58-853b-536dd1d7e6cf" data-file-name="components/help-modal.tsx">
                    <Send className="mr-3 mt-1 text-primary" size={20} />
                    <div data-unique-id="eb6c1767-4568-48f8-b63d-fc487fbd1050" data-file-name="components/help-modal.tsx">
                      <p className="font-medium" data-unique-id="ec0d1df3-e9c3-4631-8595-821c8e19d7af" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="2831c503-b972-4395-a689-8f76e8870e2f" data-file-name="components/help-modal.tsx">Sending Bulk Emails</span></p>
                      <p className="text-sm text-muted-foreground" data-unique-id="6c17fa49-1462-4340-ab31-83f226187d01" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="621d4118-02c9-40dc-9f89-e7a8a681318e" data-file-name="components/help-modal.tsx">
                        Select customers from your database or import them from Excel to send personalized emails.
                        Each email will be customized with the customer's specific information.
                      </span></p>
                    </div>
                  </div>
                  
                  <div className="bg-accent/20 p-4 rounded-md border border-border mt-2" data-unique-id="2c862711-8c66-470c-bea6-acdf40be4cc2" data-file-name="components/help-modal.tsx">
                    <p className="text-sm font-medium" data-unique-id="7dffab81-3e7b-4811-b8ce-b6062aed4c1a" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="abc171da-aa8d-4cb6-abde-d2c224b64a0f" data-file-name="components/help-modal.tsx">Email Configuration Required</span></p>
                    <p className="text-xs text-muted-foreground mt-1" data-unique-id="e4f188eb-5e7b-43b0-b3d6-4b89043d9172" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="2bfb7e34-4af1-4fcf-bb0a-e219da3e5ffa" data-file-name="components/help-modal.tsx">
                      To send real emails, you'll need to set up an email service API key in your environment variables.
                      See the documentation for how to set this up.
                    </span></p>
                  </div>
                </div>
              </FeatureHighlight>
              
              <FeatureHighlight title="Theme Customization" description="Switch between light and dark mode" isNew={true} completionKey="theme">
                <div className="space-y-3" data-unique-id="22525ab6-95ff-432a-8871-f8b677ae0301" data-file-name="components/help-modal.tsx">
                  <p className="text-sm text-muted-foreground" data-unique-id="fb0cd583-c856-4746-91c2-da8d19cb4aaa" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="9b0312d4-918f-45c4-a0dc-52eb04dc8fb9" data-file-name="components/help-modal.tsx">
                    You can switch between light and dark mode by clicking the theme toggle button in the top-right corner.
                    The application will remember your preference for future visits.
                  </span></p>
                  
                  <div className="flex items-center justify-center space-x-4 my-4" data-unique-id="126d62ef-527d-45d2-946d-7eb558ba7d3b" data-file-name="components/help-modal.tsx">
                    <div className="flex flex-col items-center" data-unique-id="1b21a1be-80f9-4b5b-b5eb-0f9668dc65a6" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-white border border-border flex items-center justify-center mb-1" data-unique-id="b0a0641d-304a-4b0e-8665-407160c57a65" data-file-name="components/help-modal.tsx">
                        <Sun className="w-8 h-8 text-amber-500" />
                      </div>
                      <span className="text-xs" data-unique-id="0a84bf12-5b75-4755-ba5e-ee1501b9ce1a" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="f3d2cf51-4559-4c8a-bb65-037e6f2b2fad" data-file-name="components/help-modal.tsx">Light Mode</span></span>
                    </div>
                    
                    <div className="flex flex-col items-center" data-unique-id="ba695fb4-a82c-491f-8973-9a11229c9a5c" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-[#121212] border border-border flex items-center justify-center mb-1" data-unique-id="41fb4289-d3bc-4799-b2d9-bb51d28bcbd1" data-file-name="components/help-modal.tsx">
                        <Moon className="w-8 h-8 text-sky-400" />
                      </div>
                      <span className="text-xs" data-unique-id="8066035f-bea2-4a12-82b6-12babc913c38" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="b8d5a822-bf64-4af0-867b-b20c61f9701b" data-file-name="components/help-modal.tsx">Dark Mode</span></span>
                    </div>
                    
                    <div className="flex flex-col items-center" data-unique-id="bfa2fdef-671f-474f-b1c8-51e5f83cf38d" data-file-name="components/help-modal.tsx">
                      <div className="w-16 h-16 rounded-md bg-gradient-to-br from-white to-[#121212] border border-border flex items-center justify-center mb-1" data-unique-id="c6bda17f-0914-4381-b7c5-1352bc54e8d3" data-file-name="components/help-modal.tsx">
                        <Laptop className="w-8 h-8 text-primary" />
                      </div>
                      <span className="text-xs" data-unique-id="4aef6d5c-849c-454d-a22a-10805c9a97c7" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="1053764a-a45d-4e60-8d16-cc9d23d8d897" data-file-name="components/help-modal.tsx">System Preference</span></span>
                    </div>
                  </div>
                </div>
              </FeatureHighlight>
            </div>
            
            <div className="p-6 border-t border-border flex justify-between items-center" data-unique-id="8b719855-15ef-4986-b823-a3c47feb1aad" data-file-name="components/help-modal.tsx">
              <p className="text-sm text-muted-foreground" data-unique-id="2f773300-d12e-4684-8afa-7f1a67e93a09" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="23a3b14e-02ea-474d-9acc-25fbdbcb72c7" data-file-name="components/help-modal.tsx">
                Questions or feedback? Contact support@detroitaxle.com
              </span></p>
              <button onClick={() => {
            onClose();
            if (typeof window !== 'undefined') {
              localStorage.setItem('helpModalClosed', 'true');
            }
          }} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors" data-unique-id="c72b4043-92e3-4ca6-a3a1-aee238a8db4e" data-file-name="components/help-modal.tsx">
                <span className="editable-text" data-unique-id="e689a8c3-aa84-47ea-81ea-b84afaf7a030" data-file-name="components/help-modal.tsx">Close</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>;
}

// Add missing imports to fix build errors
import { Moon, Sun, Laptop } from 'lucide-react';