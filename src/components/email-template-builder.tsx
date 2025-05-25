"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TemplateEditor from "@/components/template-editor";
import BulkEmailUpload from "@/components/bulk-email-upload";
import EmailPreview from "@/components/email-preview";
import TemplateLibrary from "@/components/template-library";
import CustomerManagement from "@/components/customer-management";
import EmailConfigCheck from "@/lib/email-config-check";
import { ThemeToggle } from "@/components/theme-toggle";
import { Tooltip } from "@/components/tooltip";
import { FeatureTour } from "@/components/feature-tour";
import { HelpModal } from "@/components/help-modal";
import { HelpCircle, Info, FileText, Library, BarChart, Send, Users } from "lucide-react";
import { cn } from "@/lib/utils";
export default function EmailTemplateBuilder() {
  // Check if we came from the order processor
  const [defaultTab, setDefaultTab] = useState<string>("editor");
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check URL parameters for tab selection
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam) {
        setDefaultTab(tabParam);
      }

      // Check if order data exists - if yes, default to bulkUpload
      const orderData = localStorage.getItem('orderDataForEmails');
      if (orderData) {
        setDefaultTab("bulkUpload");
      }
    }
  }, []);
  // Get active template from localStorage or use default
  const getStoredTemplate = () => {
    if (typeof window !== 'undefined') {
      try {
        const storedTemplate = localStorage.getItem('activeEmailTemplate');
        if (storedTemplate) {
          return JSON.parse(storedTemplate);
        }
      } catch (error) {
        console.error('Error loading template from localStorage:', error);
      }
    }

    // Default template if not found in localStorage
    return {
      id: "default",
      name: "Default Template",
      subject: "Your Detroit Axle Order Update",
      preheader: "Track your recent order from Detroit Axle",
      content: `Dear {{customerName}},

Thank you for your recent order with Detroit Axle. We're pleased to inform you that your order has been shipped and is on its way to you.

Order Details:
- Order Number: {{orderNumber}}
- Tracking Number: {{trackingNumber}}
- Shipping Address: {{address}}

You can track your package using the tracking number above.

If you have any questions or concerns about your order, please don't hesitate to contact our customer support team at 888-583-0255.

Thank you for choosing Detroit Axle!

Best regards,
Detroit Axle Customer Support Team`
    };
  };
  const [activeTemplate, setActiveTemplate] = useState(getStoredTemplate());

  // Save active template to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('activeEmailTemplate', JSON.stringify(activeTemplate));
      } catch (error) {
        console.error('Error saving template to localStorage:', error);
      }
    }
  }, [activeTemplate]);
  // Save sender info to localStorage for persistence
  const loadSavedSenderInfo = () => {
    if (typeof window !== 'undefined') {
      try {
        const storedInfo = localStorage.getItem('emailSenderInfo');
        if (storedInfo) {
          return JSON.parse(storedInfo);
        }
      } catch (error) {
        console.error('Error loading sender info from localStorage:', error);
      }
    }
    return {
      name: "Detroit Axle Support",
      email: "employee@detroitaxle.com"
    };
  };
  const [senderInfo, setSenderInfo] = useState(loadSavedSenderInfo());
  const [showHelp, setShowHelp] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [tooltipsDisabled, setTooltipsDisabled] = useState(false);

  // Properly coordinate help features for new users
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome') === 'true';
    const hasTakenTour = localStorage.getItem('hasTakenTour') === 'true';
    const hasUsedApp = localStorage.getItem('hasUsedApp') === 'true';

    // Update tooltips disabled state
    setTooltipsDisabled(hasUsedApp === true);

    // Show help button for all users
    setShowHelp(true);

    // Only show tooltips if user hasn't completed welcome or tour
    if (!hasUsedApp && hasSeenWelcome && hasTakenTour) {
      // Show tooltips only after welcome and tour are complete
      const timer = setTimeout(() => {
        localStorage.setItem('hasUsedApp', 'true');
        setTooltipsDisabled(true);
      }, 60000); // 1 minute

      return () => clearTimeout(timer);
    }
  }, []);
  return <>
      <div className="container mx-auto py-8 px-4 max-w-7xl" data-unique-id="b49c951d-16bc-419a-a646-269d10638863" data-file-name="components/email-template-builder.tsx">
        <header className="mb-8" data-unique-id="7bc0cc7f-f36c-46c8-a56f-5ba0b14a3ac0" data-file-name="components/email-template-builder.tsx">
          <div className="flex justify-between items-center" data-unique-id="379264d0-1422-4d44-9178-0e4aa13dacfd" data-file-name="components/email-template-builder.tsx">
            <motion.div initial={{
            opacity: 0,
            y: -20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} data-unique-id="1bf89ffb-89ab-49e8-a7cb-5efd492ae8ec" data-file-name="components/email-template-builder.tsx">
              <h1 className="text-3xl font-bold text-primary" data-unique-id="46310dc5-5333-4c9e-b4cd-e2f233e6fdcd" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="c03fd2c7-eca0-4b7f-9a8e-e5e6cd38595a" data-file-name="components/email-template-builder.tsx">
                Detroit Axle Email Template Builder
              </span></h1>
              <p className="text-muted-foreground mt-2" data-unique-id="239e6dc4-6912-45b0-86ce-4fe0732a2b12" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="57452124-45ce-4089-9f42-c3a86a461bee" data-file-name="components/email-template-builder.tsx">
                Create and manage email templates for customer order updates
              </span></p>
            </motion.div>
            <div className="flex items-center gap-3" data-unique-id="f3f461a9-e3f5-41c9-a3c4-beefbc974093" data-file-name="components/email-template-builder.tsx">
              <Tooltip content="Click here to learn how to use this application">
                <button onClick={() => setShowHelpModal(true)} className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground" data-unique-id="292fa0bc-6272-4666-83af-d10f6a4ab88b" data-file-name="components/email-template-builder.tsx">
                  <HelpCircle size={16} />
                  <span data-unique-id="3b034281-da42-4180-a75e-5ccb81f9fffa" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="fc17f508-f6fb-48e4-9120-8862ded2193c" data-file-name="components/email-template-builder.tsx">Help</span></span>
                </button>
              </Tooltip>
              <ThemeToggle />
            </div>
          </div>
        </header>

      <Tabs defaultValue={defaultTab} className="w-full" data-unique-id="7c10521c-3a29-492c-8835-123057815a37" data-file-name="components/email-template-builder.tsx">
        <div className="bg-card p-4 rounded-lg shadow-sm mb-6" data-unique-id="adef5519-1cf2-4773-8690-b73a23a40c20" data-file-name="components/email-template-builder.tsx">
          <TabsList className="w-full flex justify-between bg-transparent space-x-2">
            <TabsTrigger value="editor" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="f1067437-0efb-4aa3-bc1d-6015fa9e6056" data-file-name="components/email-template-builder.tsx">
                <FileText className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="ee135020-80d6-45a6-942c-5e11d089d670" data-file-name="components/email-template-builder.tsx">
                Template Editor
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="customers" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="38d6c0c0-2253-44e9-8208-2503543ae547" data-file-name="components/email-template-builder.tsx">
                <Users className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="389e7d80-0008-4213-997b-1fa76904ab67" data-file-name="components/email-template-builder.tsx">
                Customers
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="bulkUpload" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="fd628560-a734-4b6e-be63-7e99b6ff330e" data-file-name="components/email-template-builder.tsx">
                <Send className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="ae5d4599-47d2-4760-892d-811572696a55" data-file-name="components/email-template-builder.tsx">
                Send Emails
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="library" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="b12dd733-c03e-4e65-8ab4-cf04ca9e4072" data-file-name="components/email-template-builder.tsx">
                <Library className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="8fe67ef4-cc8e-42a1-a917-1f24cf20fe20" data-file-name="components/email-template-builder.tsx">
                Templates
              </span></span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className={cn("grid gap-8", "lg:grid-cols-2")} data-unique-id="c878fa45-9b95-4b18-ac31-642ef059f160" data-file-name="components/email-template-builder.tsx">
          <div className="space-y-6" data-unique-id="097e6b1e-923c-4482-8af9-900d1d7f7744" data-file-name="components/email-template-builder.tsx">
            <TabsContent value="editor">
              <div id="tour-template-editor" data-unique-id="0b9bbe3d-20e4-4d65-b74c-a63f129cdd91" data-file-name="components/email-template-builder.tsx">
                <TemplateEditor template={activeTemplate} onChange={setActiveTemplate} />
              </div>
            </TabsContent>
            
            <TabsContent value="customers">
              <div id="tour-customers" data-unique-id="ea6acf7e-6933-4ef7-a26e-f41fb9140c96" data-file-name="components/email-template-builder.tsx">
                <CustomerManagement />
              </div>
            </TabsContent>
            
            <TabsContent value="bulkUpload">
              <div className="space-y-4" data-unique-id="672c72b0-94a4-46a0-a759-f860a786fadf" data-file-name="components/email-template-builder.tsx">
                <EmailConfigCheck />
                <BulkEmailUpload template={activeTemplate} onSenderEmailChange={info => {
                  setSenderInfo(info);
                  // Save to localStorage for persistence
                  if (typeof window !== 'undefined') {
                    try {
                      localStorage.setItem('emailSenderInfo', JSON.stringify(info));
                    } catch (error) {
                      console.error('Error saving sender info to localStorage:', error);
                    }
                  }
                }} />
              </div>
            </TabsContent>
            
            <TabsContent value="library">
              <TemplateLibrary activeTemplate={activeTemplate} onSelect={setActiveTemplate} />
            </TabsContent>
            
          </div>

          <div className="bg-card p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl" id="tour-email-preview" data-unique-id="5290c62e-c03b-4797-bf50-31d630f22881" data-file-name="components/email-template-builder.tsx">
            <h2 className="text-lg font-medium mb-4" data-unique-id="e6c34fc1-7040-46a7-9247-79339af741d4" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="be35fdaa-7e04-41e8-9407-0ef8deb3899d" data-file-name="components/email-template-builder.tsx">Email Preview</span></h2>
            <EmailPreview template={activeTemplate} senderInfo={senderInfo} />
          </div>
        </div>
      </Tabs>
      </div>
      <FeatureTour />
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </>;
}