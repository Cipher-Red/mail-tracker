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
      <div className="container mx-auto py-8 px-4 max-w-7xl" data-unique-id="a8af2cac-0f4b-4d34-b335-003e185ad1d6" data-file-name="components/email-template-builder.tsx">
        <header className="mb-8" data-unique-id="c04665f7-0831-4196-899a-64fda30be243" data-file-name="components/email-template-builder.tsx">
          <div className="flex justify-between items-center" data-unique-id="17fdf6b2-de06-47f2-86ae-6280b65dc3a2" data-file-name="components/email-template-builder.tsx">
            <motion.div initial={{
            opacity: 0,
            y: -20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} data-unique-id="08fbac32-6a4d-4ef2-8f6a-688a97869a96" data-file-name="components/email-template-builder.tsx">
              <h1 className="text-3xl font-bold text-primary" data-unique-id="7f06b2ed-45f6-4373-8168-237565f26e44" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="9459b3bd-5144-44b5-811d-5a114a432971" data-file-name="components/email-template-builder.tsx">
                Detroit Axle Email Template Builder
              </span></h1>
              <p className="text-muted-foreground mt-2" data-unique-id="21778f92-26aa-4e67-b7a4-d1e617d5d0b2" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="f598eb81-30c2-4ef7-b1a1-62d3b6f3ac9b" data-file-name="components/email-template-builder.tsx">
                Create and manage email templates for customer order updates
              </span></p>
            </motion.div>
            <div className="flex items-center gap-3" data-unique-id="caeac60a-c2d5-4bc8-8038-9c60386a47b9" data-file-name="components/email-template-builder.tsx">
              <Tooltip content="Click here to learn how to use this application">
                <button onClick={() => setShowHelpModal(true)} className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground" data-unique-id="872f4f86-520b-4da3-9485-c7bbc7abb69e" data-file-name="components/email-template-builder.tsx">
                  <HelpCircle size={16} />
                  <span data-unique-id="7b528d69-1cc0-4e2b-a7ff-8c8c4bd71482" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="20a97d1c-afeb-4690-8f5f-fa0c5158bb3b" data-file-name="components/email-template-builder.tsx">Help</span></span>
                </button>
              </Tooltip>
              <ThemeToggle />
            </div>
          </div>
        </header>

      <Tabs defaultValue={defaultTab} className="w-full" data-unique-id="9bcaa6b2-3c97-4636-95c5-32cc379d49eb" data-file-name="components/email-template-builder.tsx">
        <div className="bg-card p-4 rounded-lg shadow-sm mb-6" data-unique-id="a3f0c314-c038-44c6-842a-343dda5981ae" data-file-name="components/email-template-builder.tsx">
          <TabsList className="w-full flex justify-between bg-transparent space-x-2">
            <TabsTrigger value="editor" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="d6a1a3f1-65ac-4699-9a0c-1f6baf6f5074" data-file-name="components/email-template-builder.tsx">
                <FileText className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="3aea6bc5-d5bb-4768-83b7-cfc29a1a5f67" data-file-name="components/email-template-builder.tsx">
                Template Editor
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="ai-generator" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="d3de50fb-f151-4914-9c38-ee389d819e8a" data-file-name="components/email-template-builder.tsx">
                <Sparkles className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="ce330bd2-45c8-4b54-91cf-a8ef781a9d01" data-file-name="components/email-template-builder.tsx">
                AI Generator
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="customers" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="9f492df1-d070-4d27-be5c-8331fb52946f" data-file-name="components/email-template-builder.tsx">
                <Users className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="f9bdf509-e258-45b2-9641-400b865e2adf" data-file-name="components/email-template-builder.tsx">
                Customers
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="bulkUpload" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="e5dddb75-64ec-4366-85eb-0e96e84aae60" data-file-name="components/email-template-builder.tsx">
                <Send className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="6ada878e-d643-48e4-8e56-6169cbaf28a4" data-file-name="components/email-template-builder.tsx">
                Send Emails
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="library" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="9225cbf7-9acb-4faf-9d23-96384e5a74d2" data-file-name="components/email-template-builder.tsx">
                <Library className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="affcfb35-0f9c-4b5f-89b1-19d6a3b2bfcf" data-file-name="components/email-template-builder.tsx">
                Templates
              </span></span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className={cn("grid gap-8", "lg:grid-cols-2")} data-unique-id="54b47fdd-3cae-4016-b345-6fa2b6a1aabb" data-file-name="components/email-template-builder.tsx">
          <div className="space-y-6" data-unique-id="d9fc9427-e162-4d63-a8a8-46439a2416e6" data-file-name="components/email-template-builder.tsx">
            <TabsContent value="editor">
              <div id="tour-template-editor" data-unique-id="506889c8-afe7-4868-bf23-2de954e073d3" data-file-name="components/email-template-builder.tsx">
                <TemplateEditor template={activeTemplate} onChange={setActiveTemplate} />
              </div>
            </TabsContent>
            
            <TabsContent value="ai-generator">
              <AITemplateGenerator onTemplateGenerated={setActiveTemplate} />
            </TabsContent>
            
            <TabsContent value="customers">
              <div id="tour-customers" data-unique-id="579aa44b-70f7-4c4a-aba5-4718387c8f95" data-file-name="components/email-template-builder.tsx">
                <CustomerManagement />
              </div>
            </TabsContent>
            
            <TabsContent value="bulkUpload">
              <div className="space-y-4" data-unique-id="2c714d84-483d-4b50-9e95-69f958be9908" data-file-name="components/email-template-builder.tsx">
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

          <div className="bg-card p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl" id="tour-email-preview" data-unique-id="894b0697-b461-4ebb-8721-571e3db0af26" data-file-name="components/email-template-builder.tsx">
            <h2 className="text-lg font-medium mb-4" data-unique-id="5bffa495-139e-445d-864f-27d55dcfcdb4" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="484820b5-030b-406c-abd3-d452597425db" data-file-name="components/email-template-builder.tsx">Email Preview</span></h2>
            <EmailPreview template={activeTemplate} senderInfo={senderInfo} />
          </div>
        </div>
      </Tabs>
      </div>
      <FeatureTour />
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </>;
}