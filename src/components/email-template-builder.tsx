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
      <div className="container mx-auto py-8 px-4" data-unique-id="a1ed26f2-2d4a-4ba9-a393-139fd63f87da" data-file-name="components/email-template-builder.tsx">
        <header className="mb-8" data-unique-id="7fb54a0f-aa67-4cf1-8f1e-a16ce7c48f84" data-file-name="components/email-template-builder.tsx">
          <div className="flex justify-between items-center" data-unique-id="e608bacd-9e9a-475b-8973-9f0a4dd2ae65" data-file-name="components/email-template-builder.tsx">
            <motion.div initial={{
            opacity: 0,
            y: -20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} data-unique-id="5e0c45fd-8e41-43a5-86e6-802d4b8c3e67" data-file-name="components/email-template-builder.tsx">
              <h1 className="text-3xl font-bold text-primary" data-unique-id="e6cc69fc-6c80-44ee-9171-63f4bb5e39e7" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="3ddc7fb3-2f41-4407-a4c7-aa5e780ae131" data-file-name="components/email-template-builder.tsx">
                Detroit Axle Email Template Builder
              </span></h1>
              <p className="text-muted-foreground mt-2" data-unique-id="5f4b5597-84fe-45f7-81db-00dc3b0ad15d" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="a39f7c39-62b7-4bbd-9735-039eb3d113b6" data-file-name="components/email-template-builder.tsx">
                Create and manage email templates for customer order updates
              </span></p>
            </motion.div>
            <div className="flex items-center gap-3" data-unique-id="4495a20a-7b67-4a32-96ff-447941ba2e0b" data-file-name="components/email-template-builder.tsx">
              <Tooltip content="Click here to learn how to use this application">
                <button onClick={() => setShowHelpModal(true)} className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground" data-unique-id="0346e876-9145-48b3-81c0-2eeae9cf0a26" data-file-name="components/email-template-builder.tsx">
                  <HelpCircle size={16} />
                  <span data-unique-id="0133d6b9-2a5e-4a24-a342-a61be5b699e0" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="c6af4102-eee3-4497-881a-4d4054a973a1" data-file-name="components/email-template-builder.tsx">Help</span></span>
                </button>
              </Tooltip>
              <ThemeToggle />
            </div>
          </div>
        </header>

      <Tabs defaultValue={defaultTab} className="w-full" data-unique-id="dba0da6f-27a7-4a69-88a9-815dd5c43fe6" data-file-name="components/email-template-builder.tsx">
        <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm mb-6" data-unique-id="993176a8-5050-4bad-95d9-1fbcacd78ca9" data-file-name="components/email-template-builder.tsx">
          <TabsList className="w-full flex justify-between bg-transparent space-x-2">
            <TabsTrigger value="editor" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="1a12f87e-2634-42ff-bc16-c893cae84db7" data-file-name="components/email-template-builder.tsx">
                <FileText className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="d6998dfd-2704-48b8-a63d-d630a940aac1" data-file-name="components/email-template-builder.tsx">
                Template Editor
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="customers" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="4243d6c6-14a9-4f9d-b354-516d346f2986" data-file-name="components/email-template-builder.tsx">
                <Users className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="6d650563-9c96-4690-a6fb-d00a2b03fa7a" data-file-name="components/email-template-builder.tsx">
                Customers
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="bulkUpload" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="1c9eda72-2873-4cb3-9190-b06b7ed64bc6" data-file-name="components/email-template-builder.tsx">
                <Send className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="04f61645-139e-4876-bc4d-7e08600974d2" data-file-name="components/email-template-builder.tsx">
                Send Emails
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="library" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="7d1b3692-5437-4541-b993-df0aaab89865" data-file-name="components/email-template-builder.tsx">
                <Library className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="1fa08ce2-bcdf-4f24-8dcd-173b732bed6e" data-file-name="components/email-template-builder.tsx">
                Templates
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="analytics" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="c9f3ebe1-d5e3-4967-b0dd-31aba8fb3d8a" data-file-name="components/email-template-builder.tsx">
                <BarChart className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="584e7ece-e876-4555-b13a-9b1dcb898ce5" data-file-name="components/email-template-builder.tsx">
                Analytics
              </span></span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className={cn("grid gap-8", "lg:grid-cols-2")} data-unique-id="b8ebe043-4a3c-43eb-bbc1-c8f054aebe4f" data-file-name="components/email-template-builder.tsx">
          <div className="space-y-6" data-unique-id="0181ea05-8b4b-4a69-910e-2ad780002017" data-file-name="components/email-template-builder.tsx">
            <TabsContent value="editor">
              <div id="tour-template-editor" data-unique-id="0c6721a9-d6eb-469d-847b-edb6c0cfceea" data-file-name="components/email-template-builder.tsx">
                <TemplateEditor template={activeTemplate} onChange={setActiveTemplate} />
              </div>
            </TabsContent>
            
            <TabsContent value="customers">
              <div id="tour-customers" data-unique-id="047db89b-5bd7-4e86-81b7-20281b1a2b9f" data-file-name="components/email-template-builder.tsx">
                <CustomerManagement />
              </div>
            </TabsContent>
            
            <TabsContent value="bulkUpload">
              <div className="space-y-4" data-unique-id="d16311cd-7018-4197-bacd-85e72242b268" data-file-name="components/email-template-builder.tsx">
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

          <div className="bg-white dark:bg-card p-6 rounded-lg shadow-md" id="tour-email-preview" data-unique-id="3fd9792f-99c9-4939-9fd3-9473a8622763" data-file-name="components/email-template-builder.tsx">
            <h2 className="text-lg font-medium mb-4" data-unique-id="e4bb78d8-e86c-4c16-9096-5c891a078cea" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="6dd4b839-ba73-4151-9d35-b130f45dbe1e" data-file-name="components/email-template-builder.tsx">Email Preview</span></h2>
            <EmailPreview template={activeTemplate} senderInfo={senderInfo} />
          </div>
        </div>
      </Tabs>
      </div>
      <FeatureTour />
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </>;
}