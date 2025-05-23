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
import { HelpCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
export default function EmailTemplateBuilder() {
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
      <div className="container mx-auto py-8 px-4" data-unique-id="10940cf3-0324-423e-9dde-a6e1259bce64" data-file-name="components/email-template-builder.tsx">
        <header className="mb-8" data-unique-id="d75d8c45-3aa9-4d6f-bc03-1e40da27f444" data-file-name="components/email-template-builder.tsx">
          <div className="flex justify-between items-center" data-unique-id="9cbb5014-37bb-46bb-8d16-e5c4f7fd79ad" data-file-name="components/email-template-builder.tsx">
            <motion.div initial={{
            opacity: 0,
            y: -20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} data-unique-id="689fa27e-676e-4533-972f-798232a4fb55" data-file-name="components/email-template-builder.tsx">
              <h1 className="text-3xl font-bold text-primary" data-unique-id="c81d415b-b666-4c7e-bebc-9ed6a5618f21" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="82babaaf-b2ee-4a5a-8c62-097fc41b4c07" data-file-name="components/email-template-builder.tsx">
                Detroit Axle Email Template Builder
              </span></h1>
              <p className="text-muted-foreground mt-2" data-unique-id="27b99808-6bbe-4ab8-8c33-79624f05658d" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="9876c83a-4861-41d1-9bab-d1acb47e1ae3" data-file-name="components/email-template-builder.tsx">
                Create and manage email templates for customer order updates
              </span></p>
            </motion.div>
            <div className="flex items-center gap-3" data-unique-id="63ed05b7-0c3a-4f30-b31b-6620b9721169" data-file-name="components/email-template-builder.tsx">
              <Tooltip content="Click here to learn how to use this application">
                <button onClick={() => setShowHelpModal(true)} className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground" data-unique-id="5e4c9ef5-d70c-4417-9aa3-4876f69d62df" data-file-name="components/email-template-builder.tsx">
                  <HelpCircle size={16} />
                  <span data-unique-id="5873659e-0575-49f9-a5de-ea572efc324a" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="ffff45bf-0dad-4d17-9adc-4f9edfbdf004" data-file-name="components/email-template-builder.tsx">Help</span></span>
                </button>
              </Tooltip>
              <ThemeToggle />
            </div>
          </div>
        </header>

      <Tabs defaultValue="editor" className="w-full" data-unique-id="a1ff7d6d-dfe8-4497-b8e7-db10d73018be" data-file-name="components/email-template-builder.tsx">
        <TabsList className="mb-6">
          <Tooltip content="Create and edit email templates" side="bottom" delay={500} disabled={tooltipsDisabled}>
            <TabsTrigger value="editor"><span className="editable-text" data-unique-id="7ce58781-79f3-4b83-a650-981af20af261" data-file-name="components/email-template-builder.tsx">Template Editor</span></TabsTrigger>
          </Tooltip>
          
          <Tooltip content="Manage your customer database" side="bottom" delay={500} disabled={tooltipsDisabled}>
            <TabsTrigger value="customers"><span className="editable-text" data-unique-id="d78fad1d-b84f-4a23-9d72-444c3be479b2" data-file-name="components/email-template-builder.tsx">Customers</span></TabsTrigger>
          </Tooltip>
          
          <Tooltip content="Send emails to your customers" side="bottom" delay={500} disabled={tooltipsDisabled}>
            <TabsTrigger value="bulkUpload"><span className="editable-text" data-unique-id="6b177f78-ffa7-4f97-b297-b023bd384267" data-file-name="components/email-template-builder.tsx">Send Emails</span></TabsTrigger>
          </Tooltip>
          
          <Tooltip content="Browse and manage saved templates" side="bottom" delay={500} disabled={tooltipsDisabled}>
            <TabsTrigger value="library"><span className="editable-text" data-unique-id="efc7d952-e5f7-46d0-bd6f-3f9af8013a56" data-file-name="components/email-template-builder.tsx">Template Library</span></TabsTrigger>
          </Tooltip>
          
          <Tooltip content="View email performance metrics" side="bottom" delay={500} disabled={tooltipsDisabled}>
            <TabsTrigger value="analytics"><span className="editable-text" data-unique-id="6db92d34-bf25-4cfe-810c-2e2e50e12852" data-file-name="components/email-template-builder.tsx">Analytics</span></TabsTrigger>
          </Tooltip>
        </TabsList>

        <div className={cn("grid gap-8", "lg:grid-cols-2")} data-unique-id="c3c0ff53-7c67-4874-b5ae-3ce2932495f1" data-file-name="components/email-template-builder.tsx">
          <div className="space-y-6" data-unique-id="ca4284c3-1f62-4d51-a84a-5e691944ee34" data-file-name="components/email-template-builder.tsx">
            <TabsContent value="editor">
              <div id="tour-template-editor" data-unique-id="0cc52d49-a5de-49ea-aa0d-980cbbaffb82" data-file-name="components/email-template-builder.tsx">
                <TemplateEditor template={activeTemplate} onChange={setActiveTemplate} />
              </div>
            </TabsContent>
            
            <TabsContent value="customers">
              <div id="tour-customers" data-unique-id="76ec59d9-7a7a-4491-a21b-8f5d2f95e3f1" data-file-name="components/email-template-builder.tsx">
                <CustomerManagement />
              </div>
            </TabsContent>
            
            <TabsContent value="bulkUpload">
              <div className="space-y-4" data-unique-id="3c653645-7076-477e-bc8c-9a0d9eb9f8c9" data-file-name="components/email-template-builder.tsx">
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

          <div className="bg-white dark:bg-card p-6 rounded-lg shadow-md" id="tour-email-preview" data-unique-id="7337009b-bd79-4c03-be62-7d3821f0e9b4" data-file-name="components/email-template-builder.tsx">
            <h2 className="text-lg font-medium mb-4" data-unique-id="ffe826de-095e-4419-b8b8-ccd49875e632" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="7b612b70-774d-4123-958b-ec5daa0d3911" data-file-name="components/email-template-builder.tsx">Email Preview</span></h2>
            <EmailPreview template={activeTemplate} senderInfo={senderInfo} />
          </div>
        </div>
      </Tabs>
      </div>
      <FeatureTour />
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </>;
}