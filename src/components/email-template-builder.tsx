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
      <div className="container mx-auto py-8 px-4" data-unique-id="51187c6f-57b2-4545-859b-080dd69bc136" data-file-name="components/email-template-builder.tsx">
        <header className="mb-8" data-unique-id="9bae2d6a-6939-4bdf-b5fa-bbd68332afd3" data-file-name="components/email-template-builder.tsx">
          <div className="flex justify-between items-center" data-unique-id="950ba7fa-4c1c-4fd8-a18a-51c26abef1cd" data-file-name="components/email-template-builder.tsx">
            <motion.div initial={{
            opacity: 0,
            y: -20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} data-unique-id="b01c1e20-3a63-470a-ac1e-0d939a7d8549" data-file-name="components/email-template-builder.tsx">
              <h1 className="text-3xl font-bold text-primary" data-unique-id="5e68c44b-3e7c-4a2c-80e1-7f8b0a8b14cb" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="ed8bb6b2-b82d-4371-9602-8a460beef32a" data-file-name="components/email-template-builder.tsx">
                Detroit Axle Email Template Builder
              </span></h1>
              <p className="text-muted-foreground mt-2" data-unique-id="71046e9c-f15c-4671-a4f7-369bfcbad2f3" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="5eea2c51-c4cb-471e-82d8-34f9dc7aa86b" data-file-name="components/email-template-builder.tsx">
                Create and manage email templates for customer order updates
              </span></p>
            </motion.div>
            <div className="flex items-center gap-3" data-unique-id="7d1f80ba-bc94-4229-854c-32b51098cfe2" data-file-name="components/email-template-builder.tsx">
              <Tooltip content="Click here to learn how to use this application">
                <button onClick={() => setShowHelpModal(true)} className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground" data-unique-id="3a42be20-320d-4b05-93e7-901bf2034ec9" data-file-name="components/email-template-builder.tsx">
                  <HelpCircle size={16} />
                  <span data-unique-id="d8cfe18b-2209-4d3b-8825-234251052c8e" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="be472afb-106f-48a5-8deb-20dbcf65a17d" data-file-name="components/email-template-builder.tsx">Help</span></span>
                </button>
              </Tooltip>
              <ThemeToggle />
            </div>
          </div>
        </header>

      <Tabs defaultValue={defaultTab} className="w-full" data-unique-id="136967c0-ae8b-43d1-b232-a0811751373c" data-file-name="components/email-template-builder.tsx">
        <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm mb-6" data-unique-id="d7adccae-187f-4be6-add3-f8aa9733ab31" data-file-name="components/email-template-builder.tsx">
          <TabsList className="w-full flex justify-between bg-transparent space-x-2">
            <TabsTrigger value="editor" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="bdb3a52a-591e-40b3-8cdf-30dc8b10fa9a" data-file-name="components/email-template-builder.tsx">
                <FileText className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="9471f1ac-2371-4025-ac45-b80c6a8d0456" data-file-name="components/email-template-builder.tsx">
                Template Editor
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="customers" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="b1796772-1056-49ed-9120-69e47709b17b" data-file-name="components/email-template-builder.tsx">
                <Users className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="9d8bdf33-9043-4330-8875-d55723f9fe8d" data-file-name="components/email-template-builder.tsx">
                Customers
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="bulkUpload" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="7d82f598-7740-426a-95e3-87d5f94dc020" data-file-name="components/email-template-builder.tsx">
                <Send className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="5b0bac52-d55e-4fa9-a192-c5fc0de8af4b" data-file-name="components/email-template-builder.tsx">
                Send Emails
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="library" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="e638e363-1212-4128-9fde-4ccc04dc4b10" data-file-name="components/email-template-builder.tsx">
                <Library className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="d1bbbbb0-971f-4cbf-bd2a-4735b205b7bb" data-file-name="components/email-template-builder.tsx">
                Templates
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="analytics" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="7bb2cf59-af1c-4204-b1bb-d387182f707a" data-file-name="components/email-template-builder.tsx">
                <BarChart className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="bd9325d6-db14-4b2c-bdac-339966167a92" data-file-name="components/email-template-builder.tsx">
                Analytics
              </span></span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className={cn("grid gap-8", "lg:grid-cols-2")} data-unique-id="e5f4d88a-ad16-4563-9a67-fe7ca3d6e8ff" data-file-name="components/email-template-builder.tsx">
          <div className="space-y-6" data-unique-id="10beebff-0eca-43f5-9f33-cd03f931f898" data-file-name="components/email-template-builder.tsx">
            <TabsContent value="editor">
              <div id="tour-template-editor" data-unique-id="bd794019-3b5e-4f11-bc07-59a52e0ba418" data-file-name="components/email-template-builder.tsx">
                <TemplateEditor template={activeTemplate} onChange={setActiveTemplate} />
              </div>
            </TabsContent>
            
            <TabsContent value="customers">
              <div id="tour-customers" data-unique-id="052cb070-d20b-460b-a94e-1026245e8cf5" data-file-name="components/email-template-builder.tsx">
                <CustomerManagement />
              </div>
            </TabsContent>
            
            <TabsContent value="bulkUpload">
              <div className="space-y-4" data-unique-id="42a2ab7d-f0a0-4f66-a275-a043cf087d18" data-file-name="components/email-template-builder.tsx">
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

          <div className="bg-white dark:bg-card p-6 rounded-lg shadow-md" id="tour-email-preview" data-unique-id="d433582c-6222-4456-8672-0d42155eba28" data-file-name="components/email-template-builder.tsx">
            <h2 className="text-lg font-medium mb-4" data-unique-id="e5ad04a1-0b0f-4165-a7be-20605a87a6e8" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="3899c28b-4148-4af7-9115-cfadebedf7d7" data-file-name="components/email-template-builder.tsx">Email Preview</span></h2>
            <EmailPreview template={activeTemplate} senderInfo={senderInfo} />
          </div>
        </div>
      </Tabs>
      </div>
      <FeatureTour />
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </>;
}