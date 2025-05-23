"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TemplateEditor from "@/components/template-editor";
import BulkEmailUpload from "@/components/bulk-email-upload";
import EmailPreview from "@/components/email-preview";
import TemplateLibrary from "@/components/template-library";
import EmailAnalytics from "@/components/email-analytics";
import CustomerManagement from "@/components/customer-management";
import EmailConfigCheck from "@/lib/email-config-check";
import { WelcomeModal } from "@/components/welcome-modal";
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
  const [activeTemplate, setActiveTemplate] = useState({
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
  });
  const [senderInfo, setSenderInfo] = useState({
    name: "Detroit Axle Support",
    email: "employee@detroitaxle.com"
  });
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
      <WelcomeModal />
      <div className="container mx-auto py-8 px-4" data-unique-id="ef2f4743-d7d0-4d6e-a398-f27deef3b9f1" data-file-name="components/email-template-builder.tsx">
        <header className="mb-8" data-unique-id="f3a6c03c-b430-4fad-8194-d1d41bde0d25" data-file-name="components/email-template-builder.tsx">
          <div className="flex justify-between items-center" data-unique-id="46d2f093-1271-47dd-ac37-0f01c858afed" data-file-name="components/email-template-builder.tsx">
            <motion.div initial={{
            opacity: 0,
            y: -20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} data-unique-id="b1480216-0eb4-4468-bdd1-94f406b44c44" data-file-name="components/email-template-builder.tsx">
              <h1 className="text-3xl font-bold text-primary" data-unique-id="ea8b039c-92a0-455b-a75f-a1f7f72e3acf" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="67ae7a67-73f2-4356-bb1c-8ec76e6cf981" data-file-name="components/email-template-builder.tsx">
                Detroit Axle Email Template Builder
              </span></h1>
              <p className="text-muted-foreground mt-2" data-unique-id="7855623d-67cd-4cab-9cb1-8ab0b105f944" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="008f2114-8f9b-4add-b434-cfe3f57d9caa" data-file-name="components/email-template-builder.tsx">
                Create and manage email templates for customer order updates
              </span></p>
            </motion.div>
            <div className="flex items-center gap-3" data-unique-id="737f2356-4c3e-4c23-9007-9d7b37b9ba3e" data-file-name="components/email-template-builder.tsx">
              <Tooltip content="Click here to learn how to use this application">
                <button onClick={() => setShowHelpModal(true)} className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground" data-unique-id="71efcd0e-8a23-4453-b01a-64619618299a" data-file-name="components/email-template-builder.tsx">
                  <HelpCircle size={16} />
                  <span data-unique-id="fca520a0-b6ee-4a5c-90c9-b324970b822f" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="3d25d484-f269-42e7-b2f1-53f7e804b808" data-file-name="components/email-template-builder.tsx">Help</span></span>
                </button>
              </Tooltip>
              <ThemeToggle />
            </div>
          </div>
        </header>

      <Tabs defaultValue={defaultTab} className="w-full" data-unique-id="f4b28681-4a7c-4337-8b08-c0fad3fa5d52" data-file-name="components/email-template-builder.tsx">
        <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm mb-6" data-unique-id="94c58a7c-30d0-4d31-bcdb-1705aa4667fd" data-file-name="components/email-template-builder.tsx">
          <TabsList className="w-full flex justify-between bg-transparent space-x-2">
            <TabsTrigger value="editor" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="1b92a473-5f96-46f7-ae9a-e7119e99c989" data-file-name="components/email-template-builder.tsx">
                <FileText className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="1b6e7f79-5b4e-4a88-828e-106b73a59d90" data-file-name="components/email-template-builder.tsx">
                Template Editor
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="customers" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="999ee658-872c-4a98-9bc7-0669e9d3d9a3" data-file-name="components/email-template-builder.tsx">
                <Users className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="ec1f5314-4abf-4881-85dd-9ffd0a0fce5d" data-file-name="components/email-template-builder.tsx">
                Customers
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="bulkUpload" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="4386091d-67fa-4b91-82ea-9f62eea3589c" data-file-name="components/email-template-builder.tsx">
                <Send className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="517dbaa9-b656-429e-9eb1-46b0e97db381" data-file-name="components/email-template-builder.tsx">
                Send Emails
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="library" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="1ce596f9-8be2-49ed-8185-2efaa2e650c3" data-file-name="components/email-template-builder.tsx">
                <Library className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="c7b2910c-ceaa-4488-b2c4-83b39b042e83" data-file-name="components/email-template-builder.tsx">
                Templates
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="analytics" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="19d0b131-d9e3-4fe1-bb8a-0836333328dc" data-file-name="components/email-template-builder.tsx">
                <BarChart className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="e197071c-2e86-4670-8cb8-78d25e0cfb89" data-file-name="components/email-template-builder.tsx">
                Analytics
              </span></span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className={cn("grid gap-8", "lg:grid-cols-2")} data-unique-id="acc9dbde-f28e-4299-b3f6-5a0a07f3d84e" data-file-name="components/email-template-builder.tsx">
          <div className="space-y-6" data-unique-id="8f89207a-4c47-4dee-af53-a9ff06e3fd5d" data-file-name="components/email-template-builder.tsx">
            <TabsContent value="editor">
              <div id="tour-template-editor" data-unique-id="5f09a077-41b3-434c-bd91-2e5cc31f7799" data-file-name="components/email-template-builder.tsx">
                <TemplateEditor template={activeTemplate} onChange={setActiveTemplate} />
              </div>
            </TabsContent>
            
            <TabsContent value="customers">
              <div id="tour-customers" data-unique-id="7c05eb9f-a458-475c-854a-3e03713c6d82" data-file-name="components/email-template-builder.tsx">
                <CustomerManagement />
              </div>
            </TabsContent>
            
            <TabsContent value="bulkUpload">
              <div className="space-y-4" data-unique-id="5659373b-dd71-4b8d-b668-3924a75f81fe" data-file-name="components/email-template-builder.tsx">
                <EmailConfigCheck />
                <BulkEmailUpload template={activeTemplate} onSenderEmailChange={info => setSenderInfo(info)} />
              </div>
            </TabsContent>
            
            <TabsContent value="library">
              <TemplateLibrary activeTemplate={activeTemplate} onSelect={setActiveTemplate} />
            </TabsContent>
            
            <TabsContent value="analytics">
              <EmailAnalytics />
            </TabsContent>
          </div>

          <div className="bg-white dark:bg-card p-6 rounded-lg shadow-md" id="tour-email-preview" data-unique-id="6a881ac0-e74e-439c-9907-9f0548219b60" data-file-name="components/email-template-builder.tsx">
            <h2 className="text-lg font-medium mb-4" data-unique-id="2fe50265-75fa-496f-8a33-ae93edfe7098" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="2b74a835-be02-4f0f-ae1e-23dd643b6380" data-file-name="components/email-template-builder.tsx">Email Preview</span></h2>
            <EmailPreview template={activeTemplate} senderInfo={senderInfo} />
          </div>
        </div>
      </Tabs>
      </div>
      <FeatureTour />
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </>;
}