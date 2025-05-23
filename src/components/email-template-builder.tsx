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
import { FileText, Library, BarChart, Send, Users, MessageSquare, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
export default function EmailTemplateBuilder() {
  // Access theme information
  const {
    resolvedTheme
  } = useTheme();

  // Check if we came from the order processor
  const [defaultTab, setDefaultTab] = useState<string>("editor");
  const [showTabTips, setShowTabTips] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("editor");
  const [showFeatureTip, setShowFeatureTip] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check URL parameters for tab selection
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
      setDefaultTab(tabParam);
      setActiveTab(tabParam);
    }

    // Check if order data exists - if yes, default to bulkUpload
    const orderData = localStorage.getItem('orderDataForEmails');
    if (orderData) {
      setDefaultTab("bulkUpload");
      setActiveTab("bulkUpload");
    }

    // Check if we should show tab tips
    const hasSeenTabTips = localStorage.getItem('hasSeenTabTips') === 'true';
    if (!hasSeenTabTips) {
      setTimeout(() => {
        setShowTabTips(true);
        setTimeout(() => {
          setShowTabTips(false);
          localStorage.setItem('hasSeenTabTips', 'true');
        }, 8000);
      }, 1500);
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
- Estimated Delivery: {{estimatedDeliveryDate}}

You can track your package using the tracking number above for the most up-to-date delivery information.

If you have any questions or concerns about your order, please don't hesitate to contact our customer support team at 888-583-0255.

Thank you for choosing Detroit Axle!

Best regards,
Detroit Axle Customer Support Team`
  });
  const [senderInfo, setSenderInfo] = useState({
    name: "Detroit Axle Support",
    email: "employee@detroitaxle.com"
  });

  // Show feature tips for first-time users
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasUsedApp = localStorage.getItem('hasUsedApp') === 'true';
    if (!hasUsedApp) {
      // Show feature tips sequentially
      const showTips = async () => {
        // Wait for initial UI to settle
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Show editor tip
        setShowFeatureTip("editor");
        await new Promise(resolve => setTimeout(resolve, 6000));
        setShowFeatureTip(null);

        // Show preview tip
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShowFeatureTip("preview");
        await new Promise(resolve => setTimeout(resolve, 6000));
        setShowFeatureTip(null);

        // Mark as having used app
        localStorage.setItem('hasUsedApp', 'true');
      };
      showTips();
    }
  }, []);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  return <>
      <WelcomeModal />
      <div className="container mx-auto py-8 px-4" data-unique-id="44b66c55-8cc0-40ff-be0d-958ce189fc4b" data-file-name="components/email-template-builder.tsx" data-dynamic-text="true">
        <header className="mb-8" data-unique-id="0dc5ad7b-5527-4ebb-97ab-645340ba15f0" data-file-name="components/email-template-builder.tsx">
          <div className="flex justify-between items-center" data-unique-id="07882cb0-cee7-42c9-a57b-a3a09c9a4ee3" data-file-name="components/email-template-builder.tsx" data-dynamic-text="true">
            <motion.div initial={{
            opacity: 0,
            y: -20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} data-unique-id="a01f13ae-85c0-4e69-9821-b9a1c42ef211" data-file-name="components/email-template-builder.tsx">
              <h1 className="text-3xl font-bold text-primary" data-unique-id="fb58ef25-64b0-4d71-af1f-6876bdc6ec73" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="9b9c91d4-8b59-46e5-ba8c-a0bad3d3e3c9" data-file-name="components/email-template-builder.tsx">
                Detroit Axle Email Template Builder
              </span></h1>
              <p className="text-muted-foreground mt-2" data-unique-id="26d31e7d-e00a-4c14-a995-0c6825cad3a6" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="3f32c197-8222-4495-be80-1dcdc91a4f8b" data-file-name="components/email-template-builder.tsx">
                Create and manage email templates for customer order updates
              </span></p>
            </motion.div>
            
            {/* Feature tip - only shows once for new users */}
            <AnimatedFeatureTip show={showFeatureTip === "preview"} position="left" text="Email preview updates in real-time as you edit your template" />
          </div>
        </header>

        {/* Main tabs interface */}
        <Tabs defaultValue={defaultTab} className="w-full" onValueChange={handleTabChange} data-unique-id="73541c46-2987-47c4-82f7-ab2ac9948ee6" data-file-name="components/email-template-builder.tsx" data-dynamic-text="true">
          {/* Tab navigation with tooltips for first-time users */}
          <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm mb-6 relative" data-unique-id="8c9007b4-11fa-4df1-9fc1-6cf62b822c21" data-file-name="components/email-template-builder.tsx">
            <TabsList className="w-full flex justify-between bg-transparent space-x-2">
              <TabsTrigger value="editor" className="relative flex-1 py-3 text-base">
                <span className="flex items-center justify-center" data-unique-id="1b19fa9b-6fee-427d-88b0-d0dc508a82c9" data-file-name="components/email-template-builder.tsx">
                  <FileText className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="b6389cbf-4e3d-47a3-8d9d-97fd5171310c" data-file-name="components/email-template-builder.tsx">
                  Template Editor
                </span></span>
                
                {showTabTips && activeTab === "editor" && <motion.div initial={{
                opacity: 0,
                y: 10
              }} animate={{
                opacity: 1,
                y: 0
              }} className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs py-1.5 px-2.5 rounded whitespace-nowrap z-50" data-unique-id="8117d5ef-becf-49ba-94c4-8db2f3cb4a0b" data-file-name="components/email-template-builder.tsx">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 border-8 border-transparent border-b-primary" data-unique-id="915bd508-15c6-4084-bfb7-d8a445fcd7cc" data-file-name="components/email-template-builder.tsx"></div><span className="editable-text" data-unique-id="976a3a39-e3c2-4df1-b403-1ec6d33a9ac2" data-file-name="components/email-template-builder.tsx">
                    Create and edit email templates here
                  </span></motion.div>}
              </TabsTrigger>
              
              <TabsTrigger value="customers" className="flex-1 py-3 text-base">
                <span className="flex items-center justify-center" data-unique-id="fbeca309-46bf-4e56-9e4c-894a765fc80c" data-file-name="components/email-template-builder.tsx">
                  <Users className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="a378e025-acf9-4a14-ab11-79bffc12657b" data-file-name="components/email-template-builder.tsx">
                  Customers
                </span></span>
              </TabsTrigger>
              
              <TabsTrigger value="bulkUpload" className="flex-1 py-3 text-base">
                <span className="flex items-center justify-center" data-unique-id="76ac9c66-7cab-4458-afba-c6bd9d2db20e" data-file-name="components/email-template-builder.tsx">
                  <Send className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="af8d8043-97db-49e5-bf1d-30f32a67409c" data-file-name="components/email-template-builder.tsx">
                  Send Emails
                </span></span>
              </TabsTrigger>
              
              <TabsTrigger value="library" className="flex-1 py-3 text-base">
                <span className="flex items-center justify-center" data-unique-id="384d4c5d-1a23-4e66-a63f-a911d6af8b4b" data-file-name="components/email-template-builder.tsx">
                  <Library className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="d42f3d28-aca1-4cc0-86bb-b8a38a843ef2" data-file-name="components/email-template-builder.tsx">
                  Templates
                </span></span>
              </TabsTrigger>
              
              <TabsTrigger value="analytics" className="flex-1 py-3 text-base">
                <span className="flex items-center justify-center" data-unique-id="403860fb-af6d-4080-94ab-1c2c6a16d0d2" data-file-name="components/email-template-builder.tsx">
                  <BarChart className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="03b4d3f9-6ddd-4d69-bbc3-2979896734d9" data-file-name="components/email-template-builder.tsx">
                  Analytics
                </span></span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Main content area */}
          <div className={cn("grid gap-8", "lg:grid-cols-2")} data-unique-id="fa0a79c9-ed52-4aea-af04-95eaadfc096f" data-file-name="components/email-template-builder.tsx" data-dynamic-text="true">
            <div className="space-y-6" data-unique-id="7c4de3e7-70ff-4c1d-a2fa-f6b57273a661" data-file-name="components/email-template-builder.tsx">
              <TabsContent value="editor">
                <div id="tour-template-editor" className="relative" data-unique-id="2435f211-34c9-49fe-b12a-96c8f8efd82a" data-file-name="components/email-template-builder.tsx" data-dynamic-text="true">
                  <TemplateEditor template={activeTemplate} onChange={setActiveTemplate} />
                  
                  {/* Feature tip - only shows once for new users */}
                  <AnimatedFeatureTip show={showFeatureTip === "editor"} position="right" text="Create your template here - use the variables like {{customerName}} to personalize emails" />
                </div>
              </TabsContent>
              
              <TabsContent value="customers">
                <div id="tour-customers" data-unique-id="17fd2b93-72cd-451a-af6c-a86c148409a5" data-file-name="components/email-template-builder.tsx">
                  <CustomerManagement />
                </div>
              </TabsContent>
              
              <TabsContent value="bulkUpload">
                <div className="space-y-4" data-unique-id="75c17350-9acf-43fd-8926-2c5891138faf" data-file-name="components/email-template-builder.tsx">
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

            {/* Email Preview Panel */}
            <div className="bg-white dark:bg-card p-6 rounded-lg shadow-md" id="tour-email-preview" data-unique-id="da42ac34-17cf-4904-8a8a-d7e834ac3aad" data-file-name="components/email-template-builder.tsx">
              <h2 className="text-lg font-medium mb-4" data-unique-id="45803ab5-1cbd-47a4-9fc9-6f37ae1b2079" data-file-name="components/email-template-builder.tsx"><span className="editable-text" data-unique-id="aeba608f-a294-407a-b837-c15e7f2589ab" data-file-name="components/email-template-builder.tsx">Email Preview</span></h2>
              <EmailPreview template={activeTemplate} senderInfo={senderInfo} />
            </div>
          </div>
        </Tabs>
      </div>
      
      {/* Feature tour system for new users */}
      <FeatureTour />
      
      {/* Help modal - can be triggered from header */}
      <HelpModal />
    </>;
}

// Animated feature tip component for first-time user guidance
function AnimatedFeatureTip({
  show,
  text,
  position = 'right'
}: {
  show: boolean;
  text: string;
  position?: 'left' | 'right' | 'top' | 'bottom';
}) {
  if (!show) return null;

  // Position styling
  const positionStyles = {
    right: '-right-4 top-1/2 transform -translate-y-1/2 translate-x-full',
    left: '-left-4 top-1/2 transform -translate-y-1/2 -translate-x-full',
    top: 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-full',
    bottom: 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full'
  };

  // Arrow position
  const arrowStyles = {
    right: 'left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90',
    left: 'right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 rotate-270',
    top: 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-180',
    bottom: 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-0'
  };
  return <motion.div initial={{
    opacity: 0,
    x: position === 'right' ? -20 : position === 'left' ? 20 : 0,
    y: position === 'top' ? 20 : position === 'bottom' ? -20 : 0
  }} animate={{
    opacity: 1,
    x: 0,
    y: 0
  }} exit={{
    opacity: 0
  }} className={`absolute z-30 max-w-xs ${positionStyles[position]}`} data-unique-id="50b55244-5092-4300-8053-033532192bf1" data-file-name="components/email-template-builder.tsx">
      <div className="bg-primary text-white px-4 py-3 rounded-lg shadow-lg relative flex items-center" data-unique-id="ba7e884b-021c-4184-a2d5-2b7070566d8b" data-file-name="components/email-template-builder.tsx" data-dynamic-text="true">
        <Info className="h-5 w-5 mr-2 flex-shrink-0" />
        <p className="text-sm" data-unique-id="8cd90fb0-5ec4-4e90-8c3b-a70e14c25895" data-file-name="components/email-template-builder.tsx" data-dynamic-text="true">{text}</p>
        
        {/* Arrow pointing to the element */}
        <div className={`absolute w-3 h-3 bg-primary transform rotate-45 ${arrowStyles[position]}`} data-unique-id="4e8c0bd5-6acd-48ab-b31e-e78a2566035a" data-file-name="components/email-template-builder.tsx"></div>
      </div>
    </motion.div>;
}