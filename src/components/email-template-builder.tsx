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
      <div className="container mx-auto py-8 px-4 max-w-7xl" data-unique-id="6235711c-4cd1-4dca-928e-251756d96fd9" data-file-name="components/email-template-builder.tsx">
        <header className="mb-8" data-unique-id="7c509167-b0bd-4cce-9338-47f79456be46" data-file-name="components/email-template-builder.tsx">
          <div className="flex justify-between items-center" data-unique-id="1aeedbb2-8855-4e0d-9566-496e92be404f" data-file-name="components/email-template-builder.tsx">
            <motion.div initial={{
            opacity: 0,
            y: -20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} data-unique-id="571a9f78-eddb-4867-b2fc-28a97b5684ce" data-file-name="components/email-template-builder.tsx">
              <h1 className="text-3xl font-bold text-primary" data-unique-id="0c4c1fa8-80b6-4435-a630-dd5827f14991" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="5eef6db9-2800-4dd2-a418-022739c35a78" data-file-name="components/email-template-builder.tsx">
                Detroit Axle Email Template Builder
              </span></h1>
              <p className="text-muted-foreground mt-2" data-unique-id="0cfcad57-8457-40c5-9ab6-abc52cefde7f" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="fd8c3007-314f-4af7-9fae-a5af8e24dc76" data-file-name="components/email-template-builder.tsx">
                Create and manage email templates for customer order updates
              </span></p>
            </motion.div>
            <div className="flex items-center gap-3" data-unique-id="74d3f34c-be3c-4694-b459-32be29ae7702" data-file-name="components/email-template-builder.tsx">
              <Tooltip content="Click here to learn how to use this application">
                <button onClick={() => setShowHelpModal(true)} className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground" data-unique-id="5bf49efa-473c-49fd-9d1a-b0a1b42174e1" data-file-name="components/email-template-builder.tsx">
                  <HelpCircle size={16} />
                  <span data-unique-id="a1a1c1f8-926a-4556-aaa1-6a6bcb9f3fce" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="9fe0efea-194f-46f0-b892-a42aa6761a81" data-file-name="components/email-template-builder.tsx">Help</span></span>
                </button>
              </Tooltip>
              <ThemeToggle />
            </div>
          </div>
        </header>

      <Tabs defaultValue={defaultTab} className="w-full" data-unique-id="462e82ed-77db-4e03-a17e-eaedc95c08a5" data-file-name="components/email-template-builder.tsx">
        <div className="bg-card p-4 rounded-lg shadow-sm mb-6" data-unique-id="aec1acd3-862b-4e47-9204-e93027c756cc" data-file-name="components/email-template-builder.tsx">
          <TabsList className="w-full flex justify-between bg-transparent space-x-2">
            <TabsTrigger value="editor" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="73101a2a-c34b-43cc-b282-fef168e7b4eb" data-file-name="components/email-template-builder.tsx">
                <FileText className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="58188202-7d4f-426b-a354-647516f4058c" data-file-name="components/email-template-builder.tsx">
                Template Editor
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="customers" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="c9a5e83d-ee1a-4c81-9f5d-8f63ce6b7d04" data-file-name="components/email-template-builder.tsx">
                <Users className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="35904147-9270-477e-99ee-366026a3fcf9" data-file-name="components/email-template-builder.tsx">
                Customers
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="bulkUpload" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="6fe00bed-0add-4665-84db-15995680433f" data-file-name="components/email-template-builder.tsx">
                <Send className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="1c24653b-1197-40fc-b029-3dd3657819c0" data-file-name="components/email-template-builder.tsx">
                Send Emails
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="library" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="5ee4e96f-e805-487b-80e1-5d187c0488b6" data-file-name="components/email-template-builder.tsx">
                <Library className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="14af8fc2-df1c-4b34-89bd-75e5141bdedf" data-file-name="components/email-template-builder.tsx">
                Templates
              </span></span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className={cn("grid gap-8", "lg:grid-cols-2")} data-unique-id="9899ade4-6002-4231-8902-9e6848a2a327" data-file-name="components/email-template-builder.tsx">
          <div className="space-y-6" data-unique-id="7a9df55d-717e-4cd6-bd84-dd66a92ee9cc" data-file-name="components/email-template-builder.tsx">
            <TabsContent value="editor">
              <div id="tour-template-editor" data-unique-id="a06e2f4e-17c2-495a-9448-23449d2d51ac" data-file-name="components/email-template-builder.tsx">
                <TemplateEditor template={activeTemplate} onChange={setActiveTemplate} />
              </div>
            </TabsContent>
            
            <TabsContent value="customers">
              <div id="tour-customers" data-unique-id="71c925e4-3a2f-4773-88ea-73848f9a9aad" data-file-name="components/email-template-builder.tsx">
                <CustomerManagement />
              </div>
            </TabsContent>
            
            <TabsContent value="bulkUpload">
              <div className="space-y-4" data-unique-id="b2bebacf-403c-44a2-8f47-c027186545cd" data-file-name="components/email-template-builder.tsx">
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

          <div className="bg-card p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl" id="tour-email-preview" data-unique-id="afcf6811-844a-41ce-a236-11cf7abdff30" data-file-name="components/email-template-builder.tsx">
            <h2 className="text-lg font-medium mb-4" data-unique-id="fabd7ecf-27c6-49f7-8a42-1955f69d1902" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="b565aae7-a38c-467b-9c56-49647e2199cd" data-file-name="components/email-template-builder.tsx">Email Preview</span></h2>
            <EmailPreview template={activeTemplate} senderInfo={senderInfo} />
          </div>
        </div>
      </Tabs>
      </div>
      <FeatureTour />
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </>;
}