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
      <div className="container mx-auto py-8 px-4 max-w-7xl" data-unique-id="6cd98437-0bd7-404c-a340-b6473c0acfa7" data-file-name="components/email-template-builder.tsx">
        <header className="mb-8" data-unique-id="a16785b0-5ac3-498a-838f-798b9aca490e" data-file-name="components/email-template-builder.tsx">
          <div className="flex justify-between items-center" data-unique-id="19b60868-be1f-48be-896e-4bc796dd8030" data-file-name="components/email-template-builder.tsx">
            <motion.div initial={{
            opacity: 0,
            y: -20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} data-unique-id="341e4357-855d-4b6c-a6e2-52e8252cba58" data-file-name="components/email-template-builder.tsx">
              <h1 className="text-3xl font-bold text-primary" data-unique-id="dc0a4dd9-6611-47e3-b897-e2ba4bea3aea" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="9385ad6e-6067-49fd-98cb-6152bea6cac1" data-file-name="components/email-template-builder.tsx">
                Detroit Axle Email Template Builder
              </span></h1>
              <p className="text-muted-foreground mt-2" data-unique-id="ce70e7fc-fddc-46d4-af4b-13e5a03d674b" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="bf51915a-f86f-499f-ab11-0e7b8a4c46f5" data-file-name="components/email-template-builder.tsx">
                Create and manage email templates for customer order updates
              </span></p>
            </motion.div>
            <div className="flex items-center gap-3" data-unique-id="62eed395-5dcf-4545-ba98-0331cb0f0c8f" data-file-name="components/email-template-builder.tsx">
              <Tooltip content="Click here to learn how to use this application">
                <button onClick={() => setShowHelpModal(true)} className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground" data-unique-id="75bcf703-236b-4b47-9308-d7cf35b48891" data-file-name="components/email-template-builder.tsx">
                  <HelpCircle size={16} />
                  <span data-unique-id="cf28f752-363f-4882-9ba5-97e0e9328752" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="10416735-e404-46f5-8cd3-33147e25667b" data-file-name="components/email-template-builder.tsx">Help</span></span>
                </button>
              </Tooltip>
              <ThemeToggle />
            </div>
          </div>
        </header>

      <Tabs defaultValue={defaultTab} className="w-full" data-unique-id="f41ea666-cd20-4b4c-bfc7-859bb3b2a9b0" data-file-name="components/email-template-builder.tsx">
        <div className="bg-card p-4 rounded-lg shadow-sm mb-6" data-unique-id="ccf68d6f-a909-4eb5-a97d-788d4b411f34" data-file-name="components/email-template-builder.tsx">
          <TabsList className="w-full flex justify-between bg-transparent space-x-2">
            <TabsTrigger value="editor" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="bec33c26-b36b-4571-a2c1-0577ce69e02b" data-file-name="components/email-template-builder.tsx">
                <FileText className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="b6eccd47-c7d4-4b0e-aa8e-e051cbd9e8a8" data-file-name="components/email-template-builder.tsx">
                Template Editor
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="customers" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="252dfff1-4dd6-4b5c-bd22-f68c7abe3067" data-file-name="components/email-template-builder.tsx">
                <Users className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="ea9633da-cafe-42c2-b316-afd4dfbae03b" data-file-name="components/email-template-builder.tsx">
                Customers
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="bulkUpload" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="76a4bcd2-cdf7-47db-ba60-e925289d345f" data-file-name="components/email-template-builder.tsx">
                <Send className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="d2c218c4-6087-4e52-a09d-723b47f5bfb8" data-file-name="components/email-template-builder.tsx">
                Send Emails
              </span></span>
            </TabsTrigger>
            
            <TabsTrigger value="library" className="flex-1 py-3 text-base">
              <span className="flex items-center justify-center" data-unique-id="db2bfe82-861e-4eb7-95d6-fdbd1c53bafa" data-file-name="components/email-template-builder.tsx">
                <Library className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="9a2d81e5-ed14-4353-8081-94b25e9eb028" data-file-name="components/email-template-builder.tsx">
                Templates
              </span></span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className={cn("grid gap-8", "lg:grid-cols-2")} data-unique-id="02a9e236-6dc1-40ef-835a-8f8f9b79b7df" data-file-name="components/email-template-builder.tsx">
          <div className="space-y-6" data-unique-id="77307a00-9da8-410e-95f3-e6165160ae06" data-file-name="components/email-template-builder.tsx">
            <TabsContent value="editor">
              <div id="tour-template-editor" data-unique-id="bcc7e403-e82b-4984-8ec1-dbcdfa6a0ae1" data-file-name="components/email-template-builder.tsx">
                <TemplateEditor template={activeTemplate} onChange={setActiveTemplate} />
              </div>
            </TabsContent>
            
            <TabsContent value="customers">
              <div id="tour-customers" data-unique-id="57f05834-ceec-45ee-a01b-fd81de254a44" data-file-name="components/email-template-builder.tsx">
                <CustomerManagement />
              </div>
            </TabsContent>
            
            <TabsContent value="bulkUpload">
              <div className="space-y-4" data-unique-id="9071654f-cc3b-4e1f-a205-02f845292f3b" data-file-name="components/email-template-builder.tsx">
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

          <div className="bg-card p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl" id="tour-email-preview" data-unique-id="daa2847b-36c7-4ae3-b550-1fcb4a4ec30a" data-file-name="components/email-template-builder.tsx">
            <h2 className="text-lg font-medium mb-4" data-unique-id="de326dbc-6713-4689-a12d-dfce7120d98e" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="bbb9a9b9-a659-442b-8d57-82bc266479c5" data-file-name="components/email-template-builder.tsx">Email Preview</span></h2>
            <EmailPreview template={activeTemplate} senderInfo={senderInfo} />
          </div>
        </div>
      </Tabs>
      </div>
      <FeatureTour />
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </>;
}