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
      <div className="container mx-auto py-8 px-4" data-unique-id="b7818466-9fcb-46e4-afcc-3bba7723999f" data-file-name="components/email-template-builder.tsx">
        <header className="mb-8" data-unique-id="dc83a848-f1b9-43df-b151-1a8eb565b413" data-file-name="components/email-template-builder.tsx">
          <div className="flex justify-between items-center" data-unique-id="e51cce7e-122b-4c65-a8c8-1432bf398ea0" data-file-name="components/email-template-builder.tsx">
            <motion.div initial={{
            opacity: 0,
            y: -20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} data-unique-id="6cb0998d-1a43-47ec-b2c8-5f18d49f16b9" data-file-name="components/email-template-builder.tsx">
              <h1 className="text-3xl font-bold text-primary" data-unique-id="e3326afd-fab3-4c27-bc63-1010712ec27b" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="e4dd1315-c6af-4543-8f36-93814d198208" data-file-name="components/email-template-builder.tsx">
                Detroit Axle Email Template Builder
              </span></h1>
              <p className="text-muted-foreground mt-2" data-unique-id="18a1159b-51af-4013-abf3-8e3c1bfc7aa7" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="7f9e6fdb-a673-4103-9d8f-498bd5450b08" data-file-name="components/email-template-builder.tsx">
                Create and manage email templates for customer order updates
              </span></p>
            </motion.div>
            <div className="flex items-center gap-3" data-unique-id="3c5620af-61c6-47e8-b444-7e0ae4a6e175" data-file-name="components/email-template-builder.tsx">
              <Tooltip content="Click here to learn how to use this application">
                <button onClick={() => setShowHelpModal(true)} className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground" data-unique-id="4d17f2a8-e74a-4579-a966-aa7bcad84516" data-file-name="components/email-template-builder.tsx">
                  <HelpCircle size={16} />
                  <span data-unique-id="58401f38-fdb1-43e3-8e77-ef8741988c5d" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="4d964b20-869c-4e50-afb9-3449081cfd12" data-file-name="components/email-template-builder.tsx">Help</span></span>
                </button>
              </Tooltip>
              <ThemeToggle />
            </div>
          </div>
        </header>

      <Tabs defaultValue={defaultTab} className="w-full" data-unique-id="abee4496-70b9-4a96-8fe3-1c33bbb5737e" data-file-name="components/email-template-builder.tsx">
        <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm mb-6" data-unique-id="064d021a-fbb7-4246-89c4-620d6ff09462" data-file-name="components/email-template-builder.tsx">
          <TabsList className="w-full flex justify-between bg-transparent space-x-2">
            <TabsTrigger value="editor" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="202d0594-e478-4771-8c27-043741fb8eff" data-file-name="components/email-template-builder.tsx">
                <FileText className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="92b81935-b18e-4f0c-977e-eccfae00c960" data-file-name="components/email-template-builder.tsx">
                Template Editor
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="customers" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="4c06dda2-2f94-4c1b-8574-f1983e2ebc2e" data-file-name="components/email-template-builder.tsx">
                <Users className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="f1cf843b-2841-45df-9e55-9eddbb710f50" data-file-name="components/email-template-builder.tsx">
                Customers
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="bulkUpload" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="2d136a86-79bb-4ecf-a8b6-34caf49526d6" data-file-name="components/email-template-builder.tsx">
                <Send className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="eb99ff2a-3701-4762-93d3-499d8c2a3774" data-file-name="components/email-template-builder.tsx">
                Send Emails
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="library" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="60c12bac-7d6f-4a47-b2c7-5d56c1d3a28e" data-file-name="components/email-template-builder.tsx">
                <Library className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="ef461608-6e9a-4948-974a-8fc5327a6824" data-file-name="components/email-template-builder.tsx">
                Templates
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="analytics" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="13d2a01c-d8dc-4f08-bb83-f07e69879c3f" data-file-name="components/email-template-builder.tsx">
                <BarChart className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="9cfe60e4-7bf9-4085-bc72-089f7570df17" data-file-name="components/email-template-builder.tsx">
                Analytics
              </span></span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className={cn("grid gap-8", "lg:grid-cols-2")} data-unique-id="858cbd03-26d8-428c-aefa-ab99eeaa4123" data-file-name="components/email-template-builder.tsx">
          <div className="space-y-6" data-unique-id="aeca0f68-6274-41c2-92f9-15bf5d4b577a" data-file-name="components/email-template-builder.tsx">
            <TabsContent value="editor">
              <div id="tour-template-editor" data-unique-id="edf1982b-a22c-4ff5-8b4c-002770cc45f7" data-file-name="components/email-template-builder.tsx">
                <TemplateEditor template={activeTemplate} onChange={setActiveTemplate} />
              </div>
            </TabsContent>
            
            <TabsContent value="customers">
              <div id="tour-customers" data-unique-id="2d369054-8246-415f-9e49-6a9f5d910644" data-file-name="components/email-template-builder.tsx">
                <CustomerManagement />
              </div>
            </TabsContent>
            
            <TabsContent value="bulkUpload">
              <div className="space-y-4" data-unique-id="d70eacee-b398-4b84-b674-ee6233bc49aa" data-file-name="components/email-template-builder.tsx">
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

          <div className="bg-white dark:bg-card p-6 rounded-lg shadow-md" id="tour-email-preview" data-unique-id="51a3122e-6ff1-4ddc-9ede-26b19a046fff" data-file-name="components/email-template-builder.tsx">
            <h2 className="text-lg font-medium mb-4" data-unique-id="bd57800e-5229-4781-bfa2-4e36c4d62ccc" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="c7a8ab3c-98c1-4d11-a34d-ccb0feb95719" data-file-name="components/email-template-builder.tsx">Email Preview</span></h2>
            <EmailPreview template={activeTemplate} senderInfo={senderInfo} />
          </div>
        </div>
      </Tabs>
      </div>
      <FeatureTour />
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </>;
}