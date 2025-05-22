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
      <div className="container mx-auto py-8 px-4" data-unique-id="563aafd5-312e-4056-a457-e83ab9f1d8aa" data-file-name="components/email-template-builder.tsx">
        <header className="mb-8" data-unique-id="257f22d8-07ca-4013-ba0f-cef468ec3ee2" data-file-name="components/email-template-builder.tsx">
          <div className="flex justify-between items-center" data-unique-id="7873bc08-b4eb-48da-b265-8c96ee9c7f72" data-file-name="components/email-template-builder.tsx">
            <motion.div initial={{
            opacity: 0,
            y: -20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} data-unique-id="8c5b5dca-48bf-430f-9742-07f057cb8549" data-file-name="components/email-template-builder.tsx">
              <h1 className="text-3xl font-bold text-primary" data-unique-id="c19a6c6d-340f-48e7-81fe-1590a66d189e" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="6a005744-aa5c-4751-aae5-d551f9784be8" data-file-name="components/email-template-builder.tsx">
                Detroit Axle Email Template Builder
              </span></h1>
              <p className="text-muted-foreground mt-2" data-unique-id="18c84c11-69c5-4bfa-921d-5578b444f597" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="6cb2382a-1a91-472e-b0fb-4c4f3900fa5e" data-file-name="components/email-template-builder.tsx">
                Create and manage email templates for customer order updates
              </span></p>
            </motion.div>
            <div className="flex items-center gap-3" data-unique-id="f1a8debb-a3c8-4bf3-ba56-dadc5e696d76" data-file-name="components/email-template-builder.tsx">
              <Tooltip content="Click here to learn how to use this application">
                <button onClick={() => setShowHelpModal(true)} className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground" data-unique-id="9fdfbccc-8de1-4af7-957f-e16190bf726d" data-file-name="components/email-template-builder.tsx">
                  <HelpCircle size={16} />
                  <span data-unique-id="2880beca-7f67-40c8-a0f3-c2940592dc27" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="226dce0e-0165-491f-b65e-094e4a1d8bb3" data-file-name="components/email-template-builder.tsx">Help</span></span>
                </button>
              </Tooltip>
              <ThemeToggle />
            </div>
          </div>
        </header>

      <Tabs defaultValue="editor" className="w-full" data-unique-id="3502a778-1003-4b52-a263-fa8ec57e7799" data-file-name="components/email-template-builder.tsx">
        <TabsList className="mb-6">
          <Tooltip content="Create and edit email templates" side="bottom" delay={500} disabled={tooltipsDisabled}>
            <TabsTrigger value="editor"><span className="editable-text" data-unique-id="5f5b3077-6064-4049-a399-c5923c4f0571" data-file-name="components/email-template-builder.tsx">Template Editor</span></TabsTrigger>
          </Tooltip>
          
          <Tooltip content="Manage your customer database" side="bottom" delay={500} disabled={tooltipsDisabled}>
            <TabsTrigger value="customers"><span className="editable-text" data-unique-id="9d68a0db-ceea-4080-925c-5016856aadba" data-file-name="components/email-template-builder.tsx">Customers</span></TabsTrigger>
          </Tooltip>
          
          <Tooltip content="Send emails to your customers" side="bottom" delay={500} disabled={tooltipsDisabled}>
            <TabsTrigger value="bulkUpload"><span className="editable-text" data-unique-id="9b8934bb-94dd-4885-bdbf-ab43ad565a09" data-file-name="components/email-template-builder.tsx">Send Emails</span></TabsTrigger>
          </Tooltip>
          
          <Tooltip content="Browse and manage saved templates" side="bottom" delay={500} disabled={tooltipsDisabled}>
            <TabsTrigger value="library"><span className="editable-text" data-unique-id="5a52a9a9-b6ee-43f6-b9ae-3689f2847e7d" data-file-name="components/email-template-builder.tsx">Template Library</span></TabsTrigger>
          </Tooltip>
          
          <Tooltip content="View email performance metrics" side="bottom" delay={500} disabled={tooltipsDisabled}>
            <TabsTrigger value="analytics"><span className="editable-text" data-unique-id="b51acfd1-c547-4bc4-94a3-946edcf35056" data-file-name="components/email-template-builder.tsx">Analytics</span></TabsTrigger>
          </Tooltip>
        </TabsList>

        <div className={cn("grid gap-8", "lg:grid-cols-2")} data-unique-id="43f98d87-8660-4e20-946a-85a6abfe9aeb" data-file-name="components/email-template-builder.tsx">
          <div className="space-y-6" data-unique-id="8234b3a9-39f5-43ed-a416-0158f460df52" data-file-name="components/email-template-builder.tsx">
            <TabsContent value="editor">
              <div id="tour-template-editor" data-unique-id="d58fdabf-ad4c-4caf-aea9-6ac85b666135" data-file-name="components/email-template-builder.tsx">
                <TemplateEditor template={activeTemplate} onChange={setActiveTemplate} />
              </div>
            </TabsContent>
            
            <TabsContent value="customers">
              <div id="tour-customers" data-unique-id="b8da994f-a6a2-42c5-91da-34ff9f80819d" data-file-name="components/email-template-builder.tsx">
                <CustomerManagement />
              </div>
            </TabsContent>
            
            <TabsContent value="bulkUpload">
              <div className="space-y-4" data-unique-id="6cfd859c-0eb8-49f1-8fc8-935aad06e6e2" data-file-name="components/email-template-builder.tsx">
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

          <div className="bg-white dark:bg-card p-6 rounded-lg shadow-md" id="tour-email-preview" data-unique-id="ba9bb19f-5597-43e5-aabe-859ebd296fab" data-file-name="components/email-template-builder.tsx">
            <h2 className="text-lg font-medium mb-4" data-unique-id="e2e07116-827f-486c-9489-47414384ac91" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="7f85f819-caa5-43ab-83c4-e430e0a480aa" data-file-name="components/email-template-builder.tsx">Email Preview</span></h2>
            <EmailPreview template={activeTemplate} senderInfo={senderInfo} />
          </div>
        </div>
      </Tabs>
      </div>
      <FeatureTour />
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </>;
}