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
      <div className="container mx-auto py-8 px-4" data-unique-id="61f2030f-8e16-432a-85ec-95a1c4d358fc" data-file-name="components/email-template-builder.tsx">
        <header className="mb-8" data-unique-id="9a721ff8-1a53-4777-b450-ca4039abe0eb" data-file-name="components/email-template-builder.tsx">
          <div className="flex justify-between items-center" data-unique-id="fcf415cb-b1aa-4d4f-a58f-0151a77844c0" data-file-name="components/email-template-builder.tsx">
            <motion.div initial={{
            opacity: 0,
            y: -20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} data-unique-id="62711003-4c12-4939-a3ef-e483dc8cbc4b" data-file-name="components/email-template-builder.tsx">
              <h1 className="text-3xl font-bold text-primary" data-unique-id="f352fbf9-3397-4127-a228-f32d91a552a9" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="42bbc3b3-faa1-435d-a741-fc134c0d1cf0" data-file-name="components/email-template-builder.tsx">
                Detroit Axle Email Template Builder
              </span></h1>
              <p className="text-muted-foreground mt-2" data-unique-id="d8f155aa-cedd-42ec-8bf6-71c4a4a9162b" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="9d6b9d07-d485-4739-9eba-431eeec6c164" data-file-name="components/email-template-builder.tsx">
                Create and manage email templates for customer order updates
              </span></p>
            </motion.div>
            <div className="flex items-center gap-3" data-unique-id="7c41ff6c-1137-446a-b849-0d0f2043a105" data-file-name="components/email-template-builder.tsx">
              <Tooltip content="Click here to learn how to use this application">
                <button onClick={() => setShowHelpModal(true)} className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground" data-unique-id="72f5a77e-f70c-4e12-a11d-b8cb0285ba2e" data-file-name="components/email-template-builder.tsx">
                  <HelpCircle size={16} />
                  <span data-unique-id="fa9a63fd-f5c9-4360-8154-6a101cf64c28" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="210016d0-3461-401e-a4a5-f43c037055de" data-file-name="components/email-template-builder.tsx">Help</span></span>
                </button>
              </Tooltip>
              <ThemeToggle />
            </div>
          </div>
        </header>

      <Tabs defaultValue={defaultTab} className="w-full" data-unique-id="0ba62ef1-9e79-4431-94a6-fb406d7da4a8" data-file-name="components/email-template-builder.tsx">
        <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm mb-6" data-unique-id="683f1b42-df34-4364-8004-8d65d5aabeac" data-file-name="components/email-template-builder.tsx">
          <TabsList className="w-full flex justify-between bg-transparent space-x-2">
            <TabsTrigger value="editor" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="81bb6ace-cdf0-4978-85b5-348d4185eac7" data-file-name="components/email-template-builder.tsx">
                <FileText className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="c0195c75-28f0-4a30-a5e1-068c1db758f6" data-file-name="components/email-template-builder.tsx">
                Template Editor
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="customers" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="ecc81db1-e665-49bc-9b0b-cfb83b36e1cf" data-file-name="components/email-template-builder.tsx">
                <Users className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="6e3640c4-cc4e-49ec-ab3b-4cf368edc8b8" data-file-name="components/email-template-builder.tsx">
                Customers
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="bulkUpload" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="5bb30ff3-d584-412d-bb4f-8610369e251c" data-file-name="components/email-template-builder.tsx">
                <Send className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="e64569ca-b5b4-424b-87f2-ed6800d3d7ad" data-file-name="components/email-template-builder.tsx">
                Send Emails
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="library" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="d6c36181-148f-4464-b9e8-85078985c541" data-file-name="components/email-template-builder.tsx">
                <Library className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="5331f56d-a9db-4bbd-9a90-bce0ddc111d1" data-file-name="components/email-template-builder.tsx">
                Templates
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="analytics" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="27b334ce-4f5a-472d-a241-07a0efbe950f" data-file-name="components/email-template-builder.tsx">
                <BarChart className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="f22ad3c3-ddb9-4a4e-8d7f-12ee2cf18e3c" data-file-name="components/email-template-builder.tsx">
                Analytics
              </span></span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className={cn("grid gap-8", "lg:grid-cols-2")} data-unique-id="6b192282-56dd-46a4-a77c-6b864ba841a6" data-file-name="components/email-template-builder.tsx">
          <div className="space-y-6" data-unique-id="3aad6e80-7a9d-4450-8995-5a62b7c42dac" data-file-name="components/email-template-builder.tsx">
            <TabsContent value="editor">
              <div id="tour-template-editor" data-unique-id="74371084-dea7-4e56-90a6-acaaca7fcd85" data-file-name="components/email-template-builder.tsx">
                <TemplateEditor template={activeTemplate} onChange={setActiveTemplate} />
              </div>
            </TabsContent>
            
            <TabsContent value="customers">
              <div id="tour-customers" data-unique-id="85b2417f-b31d-483b-8d5e-3dd2abf10c1c" data-file-name="components/email-template-builder.tsx">
                <CustomerManagement />
              </div>
            </TabsContent>
            
            <TabsContent value="bulkUpload">
              <div className="space-y-4" data-unique-id="f4973fa4-b21f-46a1-81ea-e81b1115eeba" data-file-name="components/email-template-builder.tsx">
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

          <div className="bg-white dark:bg-card p-6 rounded-lg shadow-md" id="tour-email-preview" data-unique-id="a278dcfe-5c1c-447b-9cd2-b6df46b2ffe0" data-file-name="components/email-template-builder.tsx">
            <h2 className="text-lg font-medium mb-4" data-unique-id="2d94ffef-57b2-4b28-b211-fca60a345f73" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="b0fc7b9b-c51b-40cc-b17c-027cbc25c705" data-file-name="components/email-template-builder.tsx">Email Preview</span></h2>
            <EmailPreview template={activeTemplate} senderInfo={senderInfo} />
          </div>
        </div>
      </Tabs>
      </div>
      <FeatureTour />
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </>;
}