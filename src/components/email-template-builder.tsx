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
import AITemplateGenerator from "@/components/ai-template-generator";
import { HelpCircle, Info, FileText, Library, BarChart, Send, Users, Sparkles } from "lucide-react";
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
        const storedTemplate = typeof window !== 'undefined' ? window.localStorage.getItem('activeEmailTemplate') : null;
        if (storedTemplate) {
          // Track template loaded from storage
          import('@/lib/utils').then(({
            trackActivity
          }) => {
            trackActivity('template.loaded', {
              source: 'localStorage'
            });
          });
          return JSON.parse(storedTemplate);
        }
      } catch (error) {
        console.error('Error loading template from localStorage:', error);
      }
    }

    // Default template if not found in localStorage
    return {
      id: "default",
      name: "Order Shipped",
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
        const storedInfo = typeof window !== 'undefined' ? window.localStorage.getItem('emailSenderInfo') : null;
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
      <div className="container mx-auto py-8 px-4 max-w-7xl" data-unique-id="3c669354-e716-4e5b-85f1-acbd44a0ff58" data-file-name="components/email-template-builder.tsx">
        <header className="mb-8" data-unique-id="900cd782-74d0-42a7-82c4-44165e9dd26a" data-file-name="components/email-template-builder.tsx">
          <div className="flex justify-between items-center" data-unique-id="697f52f1-e49d-41c5-b1f6-bf7e8a4fb081" data-file-name="components/email-template-builder.tsx">
            <motion.div initial={{
            opacity: 0,
            y: -20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} data-unique-id="6b1862f9-97e5-43c1-ae3f-edde19b69067" data-file-name="components/email-template-builder.tsx">
              <h1 className="text-3xl font-bold text-primary" data-unique-id="f4f9762a-fc3b-4eac-9bd9-0fc72e6182a1" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="94f42b5e-5542-4a6c-87d3-e9bc16aa1bd2" data-file-name="components/email-template-builder.tsx">
                Detroit Axle Email Template Builder
              </span></h1>
              <p className="text-muted-foreground mt-2" data-unique-id="c5b879f7-8700-444a-9fc4-5603fc1fce6c" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="be1a770a-680a-4035-9fba-a790934f564e" data-file-name="components/email-template-builder.tsx">
                Create and manage email templates for customer order updates
              </span></p>
            </motion.div>
            <div className="flex items-center gap-3" data-unique-id="8a6e180e-047b-4920-abb2-9de2bef165ef" data-file-name="components/email-template-builder.tsx">
              <Tooltip content="Click here to learn how to use this application">
                <button onClick={() => setShowHelpModal(true)} className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground" data-unique-id="5b94b7a9-9851-4c0d-85de-4e3b1bb9f5bd" data-file-name="components/email-template-builder.tsx">
                  <HelpCircle size={16} />
                  <span data-unique-id="61a15e3d-897b-41ae-a65f-745236a43276" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="5f43137f-d59b-4b60-b923-b7ebd61f6b26" data-file-name="components/email-template-builder.tsx">Help</span></span>
                </button>
              </Tooltip>
              <ThemeToggle />
            </div>
          </div>
        </header>

      <Tabs defaultValue={defaultTab} className="w-full" data-unique-id="a0028c86-c804-478d-b40a-6c0537833543" data-file-name="components/email-template-builder.tsx">
        <div className="bg-card p-4 rounded-lg shadow-sm mb-6" data-unique-id="ae22447a-41b0-4f07-98b5-30b1f3cc43a1" data-file-name="components/email-template-builder.tsx">
          <TabsList className="w-full flex justify-between bg-transparent space-x-2">
            <TabsTrigger value="editor" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="f0380aca-c04c-4e6f-b8b3-7b908bce5199" data-file-name="components/email-template-builder.tsx">
                <FileText className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="7ac20cde-df18-4f5c-a352-9e0807c37fc9" data-file-name="components/email-template-builder.tsx">
                Template Editor
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="ai-generator" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="772d6c72-2f89-47e4-bb97-3e7ced36ca62" data-file-name="components/email-template-builder.tsx">
                <Sparkles className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="692065e1-c471-40cc-9249-5234ac3c1b6c" data-file-name="components/email-template-builder.tsx">
                AI Generator
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="customers" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="d54d443e-572f-4b09-b0e5-c383a7e795b7" data-file-name="components/email-template-builder.tsx">
                <Users className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="4029e6a7-0360-449a-917f-3453a8d9a89d" data-file-name="components/email-template-builder.tsx">
                Customers
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="bulkUpload" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="01bdaf36-18fc-4390-a8ca-0abf86bf6cbd" data-file-name="components/email-template-builder.tsx">
                <Send className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="7e738db8-d527-4b63-ace6-02d98e9cd90b" data-file-name="components/email-template-builder.tsx">
                Send Emails
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="library" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="55ace68a-aa60-40c4-8aa0-edefb65fbed1" data-file-name="components/email-template-builder.tsx">
                <Library className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="c13ed30e-308c-47ef-b316-eb908fe32ad1" data-file-name="components/email-template-builder.tsx">
                Templates
              </span></span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className={cn("grid gap-8", "lg:grid-cols-2")} data-unique-id="bd310b74-9fd9-409a-b4d2-91f7ff19ac87" data-file-name="components/email-template-builder.tsx">
          <div className="space-y-6" data-unique-id="6b27d4a9-2a1f-4dd0-8c18-af274b6ec7ca" data-file-name="components/email-template-builder.tsx">
            <TabsContent value="editor">
              <div id="tour-template-editor" data-unique-id="c75890cd-933f-4a4e-9028-e4e8c6954f13" data-file-name="components/email-template-builder.tsx">
                <TemplateEditor template={activeTemplate} onChange={setActiveTemplate} />
              </div>
            </TabsContent>
            
            <TabsContent value="ai-generator">
              <AITemplateGenerator onTemplateGenerated={setActiveTemplate} />
            </TabsContent>
            
            <TabsContent value="customers">
              <div id="tour-customers" data-unique-id="ddb0a4b4-140f-4e57-97c2-57e885d24785" data-file-name="components/email-template-builder.tsx">
                <CustomerManagement />
              </div>
            </TabsContent>
            
            <TabsContent value="bulkUpload">
              <div className="space-y-4" data-unique-id="67867df1-9a61-493f-8ada-ca2dfd7906c5" data-file-name="components/email-template-builder.tsx">
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

          <div className="bg-card p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl" id="tour-email-preview" data-unique-id="ac455915-d8eb-4ac2-a735-9161c3ba951a" data-file-name="components/email-template-builder.tsx">
            <h2 className="text-lg font-medium mb-4" data-unique-id="7ea01508-0219-4813-9812-7c3bb89508f8" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="1ee842da-f895-40e6-b129-520a9125f209" data-file-name="components/email-template-builder.tsx">Email Preview</span></h2>
            <EmailPreview template={activeTemplate} senderInfo={senderInfo} />
          </div>
        </div>
      </Tabs>
      </div>
      <FeatureTour />
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </>;
}