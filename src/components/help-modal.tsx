'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, FileText, Users, Send, Search, Moon, Sun, Laptop, FileSpreadsheet, Layers, Settings, HelpCircle, Lightbulb } from 'lucide-react';
import { FeatureHighlight } from './feature-highlight';
interface HelpModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}
export function HelpModal({
  isOpen: propIsOpen,
  onClose: propOnClose
}: HelpModalProps) {
  const [isOpen, setIsOpen] = useState(propIsOpen || false);
  const [activeSection, setActiveSection] = useState("getting-started");

  // Handle both prop-based opening and event-based opening
  useEffect(() => {
    // Update internal state when props change
    if (propIsOpen !== undefined) {
      setIsOpen(propIsOpen);
    }

    // Listen for custom event to open the help modal from other components
    const handleOpenHelpModal = () => {
      setIsOpen(true);
    };

    // Safe event listener for browser environment
    if (typeof window !== 'undefined') {
      window.addEventListener('openHelpModal', handleOpenHelpModal);
      return () => window.removeEventListener('openHelpModal', handleOpenHelpModal);
    }
  }, [propIsOpen]);
  const onClose = () => {
    setIsOpen(false);
    if (propOnClose) propOnClose();
  };

  // Force close modal if open state changes to false
  useEffect(() => {
    if (!isOpen) {
      const modalElement = document.getElementById('help-modal-backdrop');
      if (modalElement) {
        modalElement.style.display = 'none';
      }
    }
  }, [isOpen]);
  if (!isOpen) return null;
  const sections = [{
    id: "getting-started",
    title: "Getting Started",
    icon: <HelpCircle className="w-4 h-4" />
  }, {
    id: "email-templates",
    title: "Email Templates",
    icon: <Mail className="w-4 h-4" />
  }, {
    id: "order-processing",
    title: "Order Processing",
    icon: <FileSpreadsheet className="w-4 h-4" />
  }, {
    id: "customers",
    title: "Customer Management",
    icon: <Users className="w-4 h-4" />
  }, {
    id: "theme",
    title: "Theme Settings",
    icon: <Settings className="w-4 h-4" />
  }];
  const scrollToSection = (id: string) => {
    if (typeof document !== 'undefined') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
    setActiveSection(id);
  };
  return <AnimatePresence>
      <motion.div id="help-modal-backdrop" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} transition={{
      duration: 0.2
    }} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose} data-unique-id="36401de8-0a68-4bae-b027-62adae113b92" data-file-name="components/help-modal.tsx">
        <motion.div initial={{
        scale: 0.95,
        opacity: 0
      }} animate={{
        scale: 1,
        opacity: 1
      }} exit={{
        scale: 0.95,
        opacity: 0
      }} transition={{
        type: 'spring',
        damping: 25,
        stiffness: 300
      }} className="bg-background rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col lg:flex-row" onClick={e => e.stopPropagation()} data-unique-id="90101d6b-c1a4-4d20-a27c-a22104bd4d7f" data-file-name="components/help-modal.tsx" data-dynamic-text="true">
          {/* Sidebar navigation for sections */}
          <div className="w-full lg:w-64 border-r border-border bg-accent/10 p-0 lg:p-0" data-unique-id="c958c189-1313-497f-b38c-4a34a0d304f0" data-file-name="components/help-modal.tsx">
            <div className="lg:sticky lg:top-0" data-unique-id="5a6720c2-69e2-4efc-b4f0-73c2238209ec" data-file-name="components/help-modal.tsx">
              <div className="p-4 border-b border-border" data-unique-id="b8ef85b4-7512-4f31-bffb-1ba8ee5cc1cf" data-file-name="components/help-modal.tsx">
                <h3 className="font-semibold" data-unique-id="05631218-1069-46cb-8105-b28ccf534e11" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="54a0f7d6-db14-4436-aa15-ef4298e67865" data-file-name="components/help-modal.tsx">Help Center</span></h3>
                <p className="text-xs text-muted-foreground mt-1" data-unique-id="d38971a9-0047-480f-b9ad-cf41c4418479" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="3215767e-0eb3-49d8-a540-e3b3aa8f4f8b" data-file-name="components/help-modal.tsx">Find guides and information</span></p>
              </div>
              
              <nav className="flex lg:flex-col p-2 lg:p-2 overflow-x-auto lg:overflow-x-visible" data-unique-id="3375fd42-b357-491a-9a64-24ffaebcb7f2" data-file-name="components/help-modal.tsx" data-dynamic-text="true">
                {sections.map(section => <button key={section.id} className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors mb-0 lg:mb-1 mr-2 lg:mr-0 whitespace-nowrap ${activeSection === section.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-accent/50'}`} onClick={() => scrollToSection(section.id)} data-unique-id="4c87d938-1760-44e9-bdac-f4d9c4d2705f" data-file-name="components/help-modal.tsx" data-dynamic-text="true">
                    <span className="mr-2" data-unique-id="55d65b0b-b70e-4bdf-8e00-4c593cda948d" data-file-name="components/help-modal.tsx" data-dynamic-text="true">{section.icon}</span>
                    {section.title}
                  </button>)}
              </nav>
              
              <div className="hidden lg:block p-4 mt-4 border-t border-border" data-unique-id="c47a55f7-8b43-465b-b95e-cbabc88e2a29" data-file-name="components/help-modal.tsx">
                <div className="text-xs text-muted-foreground" data-unique-id="2bd1aa9a-c36d-4a15-9413-997ebfc5f515" data-file-name="components/help-modal.tsx">
                  <p className="font-medium mb-1" data-unique-id="3538ac15-cfab-447b-8b45-53d3029d596c" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="13edfc7f-ffec-474b-b85a-01d9dba7575e" data-file-name="components/help-modal.tsx">Need more help?</span></p>
                  <p data-unique-id="8af585e4-d59c-464a-8906-d859a7c32ce0" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="2f0b082d-7971-4832-901e-fe755e3d210b" data-file-name="components/help-modal.tsx">Contact our support team at:</span></p>
                  <a href="mailto:support@detroitaxle.com" className="text-primary hover:underline" data-unique-id="6baf2843-d925-41d2-8cdb-eeaa13db6536" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="ed9921f8-378b-432f-bd61-1f1144bcf53f" data-file-name="components/help-modal.tsx">
                    support@detroitaxle.com
                  </span></a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex-1 overflow-y-auto max-h-[90vh] lg:max-h-[90vh]" data-unique-id="8f6807a2-60ea-4198-95f7-6d4481b71b11" data-file-name="components/help-modal.tsx" data-dynamic-text="true">
            <div className="flex justify-between items-center p-4 lg:p-6 border-b border-border sticky top-0 bg-background z-10" data-unique-id="ebed6323-61e9-43b5-af5d-642a10934170" data-file-name="components/help-modal.tsx">
              <h2 className="text-xl font-semibold" data-unique-id="15b44fef-6174-4493-bfea-5c98a6f1757d" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="b1f4175f-82d1-4942-9775-1caf4f41446a" data-file-name="components/help-modal.tsx">Detroit Axle Tool Guide</span></h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-accent" data-unique-id="1a4c9b61-2801-425e-a7a6-408212de0f84" data-file-name="components/help-modal.tsx">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 lg:p-6 space-y-8" data-unique-id="2364133e-58e0-4184-972a-bf43bda8e085" data-file-name="components/help-modal.tsx" data-dynamic-text="true">
              {/* Getting Started Section */}
              <section id="getting-started" className="scroll-mt-16" data-unique-id="e861e2b2-6191-4156-b697-3b4db98a3269" data-file-name="components/help-modal.tsx">
                <div className="flex items-center mb-4" data-unique-id="b089fe0b-616b-46ac-8177-de0c22d89d0b" data-file-name="components/help-modal.tsx">
                  <HelpCircle className="w-6 h-6 text-primary mr-2" />
                  <h3 className="text-lg font-medium" data-unique-id="dddcedd5-9503-4600-99bc-28ebf09fb0ff" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="3beeb10c-0013-4dfa-850a-596a9308e92a" data-file-name="components/help-modal.tsx">Getting Started</span></h3>
                </div>
                
                <p className="text-muted-foreground mb-6" data-unique-id="51950530-0220-4a21-a829-c670be9e08df" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="9b603be1-fc0c-47d2-947b-2faa4dcd21c2" data-file-name="components/help-modal.tsx">
                  Welcome to Detroit Axle Tools! This application helps you manage your customer communications
                  and order processing with powerful, easy-to-use tools.
                </span></p>
                
                <div className="bg-accent/10 rounded-lg p-4 border border-border mb-6" data-unique-id="340a103f-0e7f-4e9c-b607-ba1318982fe3" data-file-name="components/help-modal.tsx">
                  <h4 className="font-medium mb-2" data-unique-id="cb9a4bbc-c18f-4479-b492-8147331a7b51" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="8a2025b8-358a-4a4a-a154-bd1fd72be429" data-file-name="components/help-modal.tsx">Quick Start</span></h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm" data-unique-id="40bf432c-4163-4ee2-bfb5-093660fd800a" data-file-name="components/help-modal.tsx">
                    <li data-unique-id="07b931f6-bc1a-4f6f-8930-19f0e41c798c" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="3cf7e32c-9432-4916-9ff5-445c2eaba75b" data-file-name="components/help-modal.tsx">Use the </span><strong data-unique-id="6a53c692-889d-4579-9fe6-239bb6725cca" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="8a435a19-8580-4eee-a744-3bb5bdce26bd" data-file-name="components/help-modal.tsx">Email Builder</span></strong><span className="editable-text" data-unique-id="20d05a4e-935a-416a-8596-a9954cda0761" data-file-name="components/help-modal.tsx"> to create professional templates</span></li>
                    <li data-unique-id="12958b60-4927-4b46-9320-1ef78411f210" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="9f398240-39d7-4b09-923d-dcad46199540" data-file-name="components/help-modal.tsx">Process your order data using the </span><strong data-unique-id="dc129bad-42a7-499a-8230-ad0f4e4497ca" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="f877dc4f-65eb-455f-afd3-97dd0509fb44" data-file-name="components/help-modal.tsx">Order Processor</span></strong></li>
                    <li data-unique-id="481f6644-c4e4-4ea5-997c-0b2c9630979e" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="1d996555-bc23-423b-bb7f-7532abb9673d" data-file-name="components/help-modal.tsx">Import customer information or use the processed order data</span></li>
                    <li data-unique-id="f557a97e-0e4d-46db-b1b4-e7d23e760917" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="02d91326-ba7f-405d-b2c3-5d04b44be0cf" data-file-name="components/help-modal.tsx">Send personalized emails to your customers</span></li>
                  </ol>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" data-unique-id="f87b6742-42c7-426f-8ada-40c465a4e282" data-file-name="components/help-modal.tsx">
                  <div className="border border-border rounded-lg p-4" data-unique-id="58e01280-c19b-48cb-9c06-578ee79ce800" data-file-name="components/help-modal.tsx">
                    <h4 className="font-medium mb-2 flex items-center" data-unique-id="9585912f-9b52-446d-995e-6d0cd12f6490" data-file-name="components/help-modal.tsx">
                      <Layers className="w-4 h-4 mr-2 text-primary" /><span className="editable-text" data-unique-id="00f6e63e-3440-4b1a-a5d0-1bcb26e25948" data-file-name="components/help-modal.tsx">
                      Main Features
                    </span></h4>
                    <ul className="space-y-2 text-sm" data-unique-id="45425d71-1088-4711-9245-a3ad4aecfbc6" data-file-name="components/help-modal.tsx">
                      <li className="flex items-start" data-unique-id="68a17312-8d7f-4613-ae2c-b287516314db" data-file-name="components/help-modal.tsx">
                        <div className="rounded-full bg-primary/10 p-1 mr-2 mt-0.5" data-unique-id="7c958ea5-bbe9-4e0e-8a2f-928d198a9d4f" data-file-name="components/help-modal.tsx">
                          <Mail className="w-3 h-3 text-primary" />
                        </div>
                        <span data-unique-id="3f135ed2-005d-4ce9-9bb2-e2cd5eed5736" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="b7564643-fc36-4eea-9791-bb912219fbfd" data-file-name="components/help-modal.tsx">Email template creation and management</span></span>
                      </li>
                      <li className="flex items-start" data-unique-id="c7b8c988-c26c-4906-b92e-9c89399be5b9" data-file-name="components/help-modal.tsx">
                        <div className="rounded-full bg-primary/10 p-1 mr-2 mt-0.5" data-unique-id="a081898f-0554-4068-a57d-2620079380c7" data-file-name="components/help-modal.tsx">
                          <FileSpreadsheet className="w-3 h-3 text-primary" />
                        </div>
                        <span data-unique-id="ce1d82c8-4f75-45fb-8c3d-e2700a240c81" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="e1e2c0ce-284b-47b0-bc2c-2dac88eb380d" data-file-name="components/help-modal.tsx">Order data processing and validation</span></span>
                      </li>
                      <li className="flex items-start" data-unique-id="93e2d57e-8108-418c-bb68-3a6a6180c332" data-file-name="components/help-modal.tsx">
                        <div className="rounded-full bg-primary/10 p-1 mr-2 mt-0.5" data-unique-id="64d0f6ba-634e-4d58-9577-2aba52197f24" data-file-name="components/help-modal.tsx">
                          <Users className="w-3 h-3 text-primary" />
                        </div>
                        <span data-unique-id="b3874b08-f571-4a9b-aa6e-c65d8479ab6f" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="0a704221-5959-4fcc-9ac2-3b31311e24ba" data-file-name="components/help-modal.tsx">Customer database management</span></span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border border-border rounded-lg p-4" data-unique-id="bf20a083-61be-4aa6-9daa-e70303ffd63e" data-file-name="components/help-modal.tsx">
                    <h4 className="font-medium mb-2 flex items-center" data-unique-id="e27737b3-7f03-4f2b-86af-855e36e6acf1" data-file-name="components/help-modal.tsx">
                      <HelpCircle className="w-4 h-4 mr-2 text-primary" /><span className="editable-text" data-unique-id="ce1d4ec7-1b4f-4caa-9502-72e6bb150730" data-file-name="components/help-modal.tsx">
                      Getting Help
                    </span></h4>
                    <ul className="space-y-3 text-sm" data-unique-id="83d512e7-a592-4ccb-a764-9ddd50f6b495" data-file-name="components/help-modal.tsx">
                      <li data-unique-id="2d6a10ae-743e-4e6f-bb0a-87098317349e" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="caf2d16a-8d24-4545-9fe6-096f3b1bd6a7" data-file-name="components/help-modal.tsx">Use the </span><strong data-unique-id="0e08353e-73ca-4967-ac85-bfb50385bfa9" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="e196504b-3c3f-406c-8ac9-1708e9e1919c" data-file-name="components/help-modal.tsx">Feature Tour</span></strong><span className="editable-text" data-unique-id="ec6e6ee6-9eb0-4e65-8467-4b86bbed46b1" data-file-name="components/help-modal.tsx"> to learn about key features</span></li>
                      <li data-unique-id="8db558d9-835e-46ba-9424-670a92b90cb7" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="f601a596-9244-4e04-8822-823fe25f8ae5" data-file-name="components/help-modal.tsx">Click the </span><strong data-unique-id="9d6ab590-a6a7-40fa-b83e-a04e5f40bcef" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="1c581737-7588-41c5-8371-5a690a975a85" data-file-name="components/help-modal.tsx">Help icon</span></strong><span className="editable-text" data-unique-id="dd688bd0-a313-4b2e-8dba-55702fe54eac" data-file-name="components/help-modal.tsx"> in the top right corner anytime</span></li>
                      <li data-unique-id="f85ceb5d-457b-4895-802a-1e0f964a53ac" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="543f52ad-a24b-42de-adce-31c7f4d03946" data-file-name="components/help-modal.tsx">Hover over elements to see helpful tooltips</span></li>
                      <li data-unique-id="9ef85633-e99b-4d14-81be-a5ec69431cf2" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="a66287d0-590c-44f3-8b6c-afbcaabf5873" data-file-name="components/help-modal.tsx">Look for </span><span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full" data-unique-id="2093914f-4f0a-40ee-b314-01f719c3b3ef" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="be1150fc-5d0b-4d0a-8ce4-097b8b70cae2" data-file-name="components/help-modal.tsx">💡 Tips</span></span><span className="editable-text" data-unique-id="1fc00adf-a593-4ce2-83ab-c845848c8ee5" data-file-name="components/help-modal.tsx"> throughout the interface</span></li>
                    </ul>
                  </div>
                </div>
              </section>
              
              {/* Email Templates Section */}
              <section id="email-templates" className="scroll-mt-16" data-unique-id="3d79cd78-2814-43d0-a9e6-be56bac4e9ac" data-file-name="components/help-modal.tsx">
                <div className="flex items-center mb-4" data-unique-id="70820d73-8d4c-4675-9730-9d04b08fb0bd" data-file-name="components/help-modal.tsx">
                  <Mail className="w-6 h-6 text-primary mr-2" />
                  <h3 className="text-lg font-medium" data-unique-id="94d379c6-97f8-45d9-a6f4-3f39cb5d68a7" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="9ccc5556-1e65-4d7c-bbb7-e09a8a2d3bf0" data-file-name="components/help-modal.tsx">Email Templates</span></h3>
                </div>
                
                <p className="text-muted-foreground mb-4" data-unique-id="e03f1482-b67c-4406-a0f1-1ef7600ca708" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="e796286f-918d-4191-8955-a07d2a31ee66" data-file-name="components/help-modal.tsx">
                  Create and customize professional email templates for your customers.
                </span></p>

                <FeatureHighlight title="Creating Email Templates" description="Design professional emails with customizable variables" defaultOpen={true}>
                  <div className="space-y-3" data-unique-id="f9384338-c316-4568-bfbd-222693977e63" data-file-name="components/help-modal.tsx">
                    <div className="flex items-start" data-unique-id="ccedae1a-aea6-4ec2-8ad6-784b108ce95f" data-file-name="components/help-modal.tsx">
                      <FileText className="mr-3 mt-1 text-primary" size={20} />
                      <div data-unique-id="a5811250-a506-499f-bc13-b3710a276a65" data-file-name="components/help-modal.tsx">
                        <p className="font-medium" data-unique-id="9f9e13c7-d276-4711-8380-7ae230db3011" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="48bcfb5d-4c04-4f44-807c-7f8c1a4680fe" data-file-name="components/help-modal.tsx">Using the Template Editor</span></p>
                        <p className="text-sm text-muted-foreground" data-unique-id="bce3baa2-7027-4f0b-86cc-85ac07778ac7" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="37a3ea8b-7700-41c5-99d8-af4325dcd851" data-file-name="components/help-modal.tsx">
                          The template editor allows you to create and customize email templates.
                          You can use variables like </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="dd6e76f9-1b54-4bba-865a-a672f1b5fbb0" data-file-name="components/help-modal.tsx">{'{{customerName}}'}</code><span className="editable-text" data-unique-id="e850e389-389b-41e4-99b0-71945711cc37" data-file-name="components/help-modal.tsx"> and
                          </span><code className="text-xs px-1 py-0.5 bg-accent rounded" data-unique-id="b051a2ae-a13d-4bca-947d-64f8715acefb" data-file-name="components/help-modal.tsx">{'{{orderNumber}}'}</code><span className="editable-text" data-unique-id="1b0fe5aa-db7d-4f32-a4c4-d8eea6443af9" data-file-name="components/help-modal.tsx"> that will be replaced with actual customer data when sending.
                        </span></p>
                      </div>
                    </div>
                    
                    <div className="flex items-start" data-unique-id="af4d30da-ead3-4aeb-9c68-db4faf8b33b9" data-file-name="components/help-modal.tsx">
                      <Search className="mr-3 mt-1 text-primary" size={20} />
                      <div data-unique-id="0ac36015-5923-49a0-8a8e-4e892110f236" data-file-name="components/help-modal.tsx">
                        <p className="font-medium" data-unique-id="7ba1b2b0-1352-46e8-a862-61229203b914" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="ad6eebdb-0751-4627-8c0c-9952fd093388" data-file-name="components/help-modal.tsx">Preview Your Templates</span></p>
                        <p className="text-sm text-muted-foreground" data-unique-id="66def534-de91-4e51-958c-b7dc993f4abf" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="72ebc1d2-59c6-42d3-8585-270ca2f09b59" data-file-name="components/help-modal.tsx">
                          Use the preview panel on the right to see how your email will look in real-time as you make changes.
                          You can also send a test email to yourself to see exactly how it will appear in an email client.
                        </span></p>
                      </div>
                    </div>
                  </div>
                </FeatureHighlight>
                
                <div className="mt-4 bg-accent/10 rounded-lg p-4 border border-border" data-unique-id="eb12bb43-fe68-49f3-b239-44ffb5d0f65c" data-file-name="components/help-modal.tsx">
                  <h4 className="font-medium mb-2" data-unique-id="765e2c1d-601b-4595-9f17-4a8d088cb7e2" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="eab7a020-7b39-4532-af7b-51dc8eb8b00a" data-file-name="components/help-modal.tsx">Available Variables</span></h4>
                  <div className="grid grid-cols-2 gap-2 text-sm" data-unique-id="9354f956-a6b6-49bd-a96c-73450fa06e7e" data-file-name="components/help-modal.tsx">
                    <div className="flex items-center" data-unique-id="8dafa1e6-3a2a-4689-a6f6-f169dff51613" data-file-name="components/help-modal.tsx">
                      <code className="text-xs px-1 py-0.5 bg-accent rounded mr-2" data-unique-id="5bb1e5e9-4cb1-4be3-992e-a7b95e3a1bea" data-file-name="components/help-modal.tsx">{'{{customerName}}'}</code>
                      <span className="text-muted-foreground" data-unique-id="e4de168a-9838-4c7c-b2e6-edb62521db6c" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="d50e833c-17f3-45a2-a9f6-06077717b7b5" data-file-name="components/help-modal.tsx">Customer's full name</span></span>
                    </div>
                    <div className="flex items-center" data-unique-id="04f63ea7-ee01-489b-815b-c328168a78ab" data-file-name="components/help-modal.tsx">
                      <code className="text-xs px-1 py-0.5 bg-accent rounded mr-2" data-unique-id="21f50aa5-f0e3-442a-aff6-742ddb28337c" data-file-name="components/help-modal.tsx">{'{{orderNumber}}'}</code>
                      <span className="text-muted-foreground" data-unique-id="420e2148-10f6-4e02-826b-60f60cd7b0a4" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="051626ff-ac84-4a24-a79a-3790a7b261e2" data-file-name="components/help-modal.tsx">Order identifier</span></span>
                    </div>
                    <div className="flex items-center" data-unique-id="ec1e1ef9-2585-49c6-bb42-618365d2aa49" data-file-name="components/help-modal.tsx">
                      <code className="text-xs px-1 py-0.5 bg-accent rounded mr-2" data-unique-id="af17c5c7-5685-48be-bf54-0c43f73c9190" data-file-name="components/help-modal.tsx">{'{{trackingNumber}}'}</code>
                      <span className="text-muted-foreground" data-unique-id="565f3ac8-71ec-46ea-bc00-b4ef20346d3a" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="8af46143-bd7a-44af-aedf-ef4009cb072d" data-file-name="components/help-modal.tsx">Shipping tracking number</span></span>
                    </div>
                    <div className="flex items-center" data-unique-id="3a551788-bfc9-4779-9022-75ff6801b73a" data-file-name="components/help-modal.tsx">
                      <code className="text-xs px-1 py-0.5 bg-accent rounded mr-2" data-unique-id="7f1a43d2-488d-43bb-b073-beee4c56104f" data-file-name="components/help-modal.tsx">{'{{address}}'}</code>
                      <span className="text-muted-foreground" data-unique-id="65c2b1ba-4be8-4dee-9ade-491135c0416c" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="8ea64a78-af40-4c9a-bcae-115664daffef" data-file-name="components/help-modal.tsx">Shipping address</span></span>
                    </div>
                    <div className="flex items-center" data-unique-id="e55f80d7-a038-40cc-8f11-7dc5792da139" data-file-name="components/help-modal.tsx">
                      <code className="text-xs px-1 py-0.5 bg-accent rounded mr-2" data-unique-id="bf33b7e1-f602-4815-b0ef-94c405d5c720" data-file-name="components/help-modal.tsx">{'{{orderDate}}'}</code>
                      <span className="text-muted-foreground" data-unique-id="8ef1f795-4abd-46d2-818a-a080a4005831" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="8c1c5190-9808-470c-9e11-3e5175d37a49" data-file-name="components/help-modal.tsx">Date of order</span></span>
                    </div>
                    <div className="flex items-center" data-unique-id="dd826160-6194-4437-aa83-865745093f75" data-file-name="components/help-modal.tsx">
                      <code className="text-xs px-1 py-0.5 bg-accent rounded mr-2" data-unique-id="ad4312fb-68a3-4849-886f-7f73f5837f55" data-file-name="components/help-modal.tsx">{'{{items}}'}</code>
                      <span className="text-muted-foreground" data-unique-id="fd8ab4d3-2d4c-4fdc-b19f-4f14a5641952" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="6dfeb063-d866-45b6-afb3-eb93221d3bdb" data-file-name="components/help-modal.tsx">Items in the order</span></span>
                    </div>
                  </div>
                </div>
              </section>
              
              {/* Order Processing Section */}
              <section id="order-processing" className="scroll-mt-16" data-unique-id="39c06f36-d7b1-4f06-86c5-12bf3358d680" data-file-name="components/help-modal.tsx">
                <div className="flex items-center mb-4" data-unique-id="5ea4cc76-abd0-4d11-a9a4-03753aa48858" data-file-name="components/help-modal.tsx">
                  <FileSpreadsheet className="w-6 h-6 text-primary mr-2" />
                  <h3 className="text-lg font-medium" data-unique-id="d8de3ca2-6951-4f69-a7ac-14979ff72f02" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="9cbb7887-2bf5-410a-93c7-52e7f4c37a61" data-file-name="components/help-modal.tsx">Order Processing</span></h3>
                </div>
                
                <p className="text-muted-foreground mb-4" data-unique-id="5c39b47f-ceb0-4b59-b744-267522ad7198" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="927a6672-c9f9-4d8f-888d-67eff15573b9" data-file-name="components/help-modal.tsx">
                  Upload, clean and validate order data from Excel or CSV files.
                </span></p>
                
                <div className="space-y-4" data-unique-id="584b5b81-a53b-4ef6-b035-e93ab6086982" data-file-name="components/help-modal.tsx">
                  <div className="border border-border rounded-lg p-4" data-unique-id="cc8a0d59-9371-43ee-be02-75990e8b2237" data-file-name="components/help-modal.tsx">
                    <h4 className="font-medium mb-2" data-unique-id="3baa112b-5c62-4a3f-9f17-a077aa8cc312" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="30f76200-1540-4a9d-8229-19dcb4be55e6" data-file-name="components/help-modal.tsx">Supported File Formats</span></h4>
                    <ul className="list-disc list-inside text-sm space-y-2" data-unique-id="cf46a31a-06f2-42dd-a55e-fce0e271fa71" data-file-name="components/help-modal.tsx">
                      <li data-unique-id="65cfd0be-d4c2-42d9-b24b-716926208ec3" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="963da163-9fbe-4390-93bc-1b8da917b755" data-file-name="components/help-modal.tsx">Excel (.xlsx, .xls) files</span></li>
                      <li data-unique-id="1253293c-68b8-46f4-96ef-f8b47a7069e0" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="80c862cc-e107-4684-b93e-ff8380c9ebf7" data-file-name="components/help-modal.tsx">CSV (.csv) files</span></li>
                    </ul>
                    <p className="text-xs text-muted-foreground mt-2" data-unique-id="cb2de063-09f5-4929-b229-748ae61f8ea6" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="70e91a8c-0bf4-487a-aeae-0d87358879d7" data-file-name="components/help-modal.tsx">
                      Files should contain columns like: Customer Order Number, Ship To Name, Ship To Phone, 
                      Ship To Address, City, State, ZIP, Order Total, etc.
                    </span></p>
                  </div>
                  
                  <div className="border border-border rounded-lg p-4" data-unique-id="8bbb8283-875f-4a0a-ac90-b3cc8450c58a" data-file-name="components/help-modal.tsx">
                    <h4 className="font-medium mb-2" data-unique-id="05b09fc9-a638-47e2-9818-af270013a5bf" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="492cf7be-9990-476b-9d7f-c8bcb43ef26c" data-file-name="components/help-modal.tsx">Data Cleaning Process</span></h4>
                    <ol className="list-decimal list-inside text-sm space-y-1" data-unique-id="c7f929e7-bab8-4778-af87-803fdce06b69" data-file-name="components/help-modal.tsx">
                      <li data-unique-id="bfcda9d5-a538-4d2e-b6a3-f5aaa16ac09f" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="324cca52-ad95-4934-becb-1370a7a2ccb6" data-file-name="components/help-modal.tsx">Validates required fields (order number, name, address)</span></li>
                      <li data-unique-id="61dfa537-7a0e-4010-b891-3fcb64c0cb0b" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="683df516-4684-4496-a155-6459d3883ac6" data-file-name="components/help-modal.tsx">Formats phone numbers consistently</span></li>
                      <li data-unique-id="c6c0283c-504b-45d6-b73d-1f12d70015db" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="40aa9f0d-972d-44f6-92d3-f1ef0be0a381" data-file-name="components/help-modal.tsx">Standardizes dates to YYYY-MM-DD format</span></li>
                      <li data-unique-id="740e474a-b49a-44f2-be73-f4466d938384" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="4b4d0dfb-b51b-49ab-8e8d-198f83a287af" data-file-name="components/help-modal.tsx">Extracts tracking numbers from complex formats</span></li>
                      <li data-unique-id="e56f5b30-b08d-43ef-baf1-1f466fd09ef5" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="552bbe91-3594-4793-8056-414f434616ed" data-file-name="components/help-modal.tsx">Filters out invalid or incomplete orders</span></li>
                    </ol>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 p-4 rounded-lg" data-unique-id="9bb88257-3edb-4f78-9443-8261d1032281" data-file-name="components/help-modal.tsx">
                    <h4 className="font-medium flex items-center" data-unique-id="5eede1f4-8609-4632-8a88-e26665347bcf" data-file-name="components/help-modal.tsx">
                      <Send className="w-4 h-4 mr-2" /><span className="editable-text" data-unique-id="fb77fe27-fbdc-4534-a861-a11f55f8b701" data-file-name="components/help-modal.tsx">
                      Tip: Sending Emails from Order Data
                    </span></h4>
                    <p className="text-sm mt-1" data-unique-id="e8e8843e-8c59-458f-b010-c3c4f5d8b5bf" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="43933515-6a60-4054-90f5-6b45130cfb86" data-file-name="components/help-modal.tsx">
                      After processing your order data, use the "Create Emails" button to send
                      order updates to your customers automatically with tracking information.
                    </span></p>
                  </div>
                </div>
              </section>
              
              {/* Customer Management Section */}
              <section id="customers" className="scroll-mt-16" data-unique-id="6809d2ce-0847-44c3-ac9a-74db90f61468" data-file-name="components/help-modal.tsx">
                <div className="flex items-center mb-4" data-unique-id="e2dbd3a9-5e03-4df6-ba72-0418e5d5a4f2" data-file-name="components/help-modal.tsx">
                  <Users className="w-6 h-6 text-primary mr-2" />
                  <h3 className="text-lg font-medium" data-unique-id="b79f7243-87d7-4095-8ef6-82ed4cd8d1fb" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="8925abd1-e008-4b89-b149-8f0f23e21160" data-file-name="components/help-modal.tsx">Customer Management</span></h3>
                </div>
                
                <p className="text-muted-foreground mb-4" data-unique-id="23420fe2-95cc-47e6-b1c1-c9c14727db9b" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="ce6bd31b-e5d8-4ce9-965e-f290e83a7c21" data-file-name="components/help-modal.tsx">
                  Keep track of all your customers in one centralized database.
                </span></p>
                
                <FeatureHighlight title="Managing Customers" description="Add, organize and import customer data">
                  <div className="space-y-3" data-unique-id="057acd94-3ecb-4eef-a6ae-93d5046bf50b" data-file-name="components/help-modal.tsx">
                    <div className="flex items-start" data-unique-id="63ab9a5d-10a5-4899-8983-8e1bfa4a7fbb" data-file-name="components/help-modal.tsx">
                      <Users className="mr-3 mt-1 text-primary" size={20} />
                      <div data-unique-id="c9763ca5-8ed4-4fd9-9581-46107247d007" data-file-name="components/help-modal.tsx">
                        <p className="font-medium" data-unique-id="b0150f17-9303-4e2a-bcd4-7e29b643b41b" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="7050962d-2388-4798-bfe5-1d6901212920" data-file-name="components/help-modal.tsx">Customer Database</span></p>
                        <p className="text-sm text-muted-foreground" data-unique-id="4b2a1580-27f0-4da2-9289-99c3a93aa9fd" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="fe1e45c3-316a-4ec8-ae77-704630960d0b" data-file-name="components/help-modal.tsx">
                          Add customers manually or import them from Excel. You can add details like name, email,
                          company, tags, and custom notes. Your customer data is stored locally in your browser.
                        </span></p>
                      </div>
                    </div>
                  </div>
                </FeatureHighlight>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4" data-unique-id="70c59d5a-9a7b-4236-958c-1449b09feccd" data-file-name="components/help-modal.tsx">
                  <div className="border border-border rounded-lg p-4" data-unique-id="c497f7d8-9b75-499d-b938-7fd49f4d98cd" data-file-name="components/help-modal.tsx">
                    <h4 className="font-medium mb-2" data-unique-id="5dc5c653-8c12-4afe-94a3-7f7e02ea6196" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="f092c944-aa30-4b39-988a-3d835e66171c" data-file-name="components/help-modal.tsx">Customer Import</span></h4>
                    <p className="text-sm mb-2" data-unique-id="af866949-1a93-442b-91f2-356ada3ceda6" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="ec664305-ce08-4700-b4c1-988625065878" data-file-name="components/help-modal.tsx">
                      You can import customers from:
                    </span></p>
                    <ul className="list-disc list-inside text-sm space-y-1" data-unique-id="2f2b95cb-0d56-4050-81b4-e2472494c91b" data-file-name="components/help-modal.tsx">
                      <li data-unique-id="3b80e7a0-fc7a-48ab-aff5-a0620921f9e1" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="12ea51ee-3bcd-48bc-9120-1acc7fbc1566" data-file-name="components/help-modal.tsx">Excel files with customer data</span></li>
                      <li data-unique-id="d0e72c21-0758-47b8-a4a9-127287e3f00f" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="7dcae6c4-5d9d-4de8-991d-8abfed3e93de" data-file-name="components/help-modal.tsx">Processed order data</span></li>
                      <li data-unique-id="3adb6f0d-d617-4b46-8916-2a9143f075f2" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="9925a395-871f-4e1d-99f7-58807916f5c6" data-file-name="components/help-modal.tsx">Manual entry</span></li>
                    </ul>
                  </div>
                  
                  <div className="border border-border rounded-lg p-4" data-unique-id="cb744c3d-d518-4d58-8d2c-064f8b330549" data-file-name="components/help-modal.tsx">
                    <h4 className="font-medium mb-2" data-unique-id="1486f2c7-d4a4-47eb-a003-7b17a43a3df3" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="5fa5e24a-f1cb-4e2c-a223-a625b2bf7c7a" data-file-name="components/help-modal.tsx">Customer Organization</span></h4>
                    <p className="text-sm mb-2" data-unique-id="ed7a7f3e-966a-4bc0-adb2-4850db2e056c" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="64a1403b-ef16-4761-afd0-927879d61f3f" data-file-name="components/help-modal.tsx">
                      Keep your customers organized with:
                    </span></p>
                    <ul className="list-disc list-inside text-sm space-y-1" data-unique-id="622efda6-51a2-4af9-bd6b-9218b8b5b1dc" data-file-name="components/help-modal.tsx">
                      <li data-unique-id="54019b9c-41db-47aa-9732-33bc1449ef42" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="41bfd59a-6561-4c62-a065-8eab96b1afdd" data-file-name="components/help-modal.tsx">Tags for categorizing customers</span></li>
                      <li data-unique-id="e02a9b31-0f0e-497e-bbee-38c25cbf0b53" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="39f7f047-1c30-4775-9c31-d2b8337d180b" data-file-name="components/help-modal.tsx">Search and filter capabilities</span></li>
                      <li data-unique-id="997db5c8-8a73-47b3-866b-0f82f1100745" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="dbf10951-369e-42ec-8230-ee63b3975d0d" data-file-name="components/help-modal.tsx">Customer notes and custom fields</span></li>
                      <li data-unique-id="719ef42e-b9bc-4596-8522-578451d1bd33" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="990bf3f1-5205-48ad-9392-4b81d1fb10ec" data-file-name="components/help-modal.tsx">Export functionality</span></li>
                    </ul>
                  </div>
                </div>
              </section>
              
              {/* Theme Settings Section */}
              <section id="theme" className="scroll-mt-16" data-unique-id="ffb24897-fa32-4a02-b2d4-57871ec2a629" data-file-name="components/help-modal.tsx">
                <div className="flex items-center mb-4" data-unique-id="3ddddf37-fc7d-4f30-9ccd-20c3836694a3" data-file-name="components/help-modal.tsx">
                  <Settings className="w-6 h-6 text-primary mr-2" />
                  <h3 className="text-lg font-medium" data-unique-id="e2b1d2dc-ba21-4444-9d3c-b2d7ec8700b4" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="d3f0e2d0-d31e-4356-a550-94626fdc3883" data-file-name="components/help-modal.tsx">Theme & Preferences</span></h3>
                </div>
                
                <p className="text-muted-foreground mb-4" data-unique-id="8ae997ba-3f00-408b-b4bc-7b595fba5bfd" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="4fc62c46-76d8-40a9-9c6e-be2c7d65b22c" data-file-name="components/help-modal.tsx">
                  Customize your experience with theme preferences and help settings.
                </span></p>
                
                <FeatureHighlight title="Theme Customization" description="Switch between light and dark mode" isNew={true}>
                  <div className="space-y-3" data-unique-id="40b5919a-2d73-4601-8a47-8e07d2e87ef5" data-file-name="components/help-modal.tsx">
                    <p className="text-sm text-muted-foreground" data-unique-id="054034ed-9b0e-4807-9c21-b92a6d72f95a" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="d4c88eff-f256-4fd0-bcf5-f74abe8d572a" data-file-name="components/help-modal.tsx">
                      You can switch between light and dark mode by clicking the theme toggle button in the top-right corner.
                      The application will remember your preference for future visits.
                    </span></p>
                    
                    <div className="flex items-center justify-center space-x-4 my-4" data-unique-id="c14453c9-c9b9-4452-b39d-2c80bcdc21ae" data-file-name="components/help-modal.tsx">
                      <div className="flex flex-col items-center" data-unique-id="c6d3ad98-26d5-477b-8779-b3f436840cf4" data-file-name="components/help-modal.tsx">
                        <div className="w-16 h-16 rounded-md bg-white border border-border flex items-center justify-center mb-1" data-unique-id="17a9b7c6-4124-49dd-94ff-0e5e697b627c" data-file-name="components/help-modal.tsx">
                          <Sun className="w-8 h-8 text-amber-500" />
                        </div>
                        <span className="text-xs" data-unique-id="d496986d-6591-45e6-a274-6eddb438a88f" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="bc70549c-012c-4b09-8796-5d8d70cc9aa6" data-file-name="components/help-modal.tsx">Light Mode</span></span>
                      </div>
                      
                      <div className="flex flex-col items-center" data-unique-id="87346f0f-6e14-4504-ab18-fb049e63545e" data-file-name="components/help-modal.tsx">
                        <div className="w-16 h-16 rounded-md bg-[#0F172A] border border-border flex items-center justify-center mb-1" data-unique-id="472d7600-5c8f-411f-bd1a-5e752c5d1cd4" data-file-name="components/help-modal.tsx">
                          <Moon className="w-8 h-8 text-blue-400" />
                        </div>
                        <span className="text-xs" data-unique-id="6f3a3b0d-b9cc-49c8-a7b2-3bd602beca04" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="073214f7-fb2f-497d-9c1b-5618c418d409" data-file-name="components/help-modal.tsx">Dark Mode</span></span>
                      </div>
                      
                      <div className="flex flex-col items-center" data-unique-id="96b0c700-da93-40f4-bbfc-a891269f98e8" data-file-name="components/help-modal.tsx">
                        <div className="w-16 h-16 rounded-md bg-gradient-to-br from-white to-[#0F172A] border border-border flex items-center justify-center mb-1" data-unique-id="13434028-dd24-442c-865c-c0661759dcb4" data-file-name="components/help-modal.tsx">
                          <Laptop className="w-8 h-8 text-primary" />
                        </div>
                        <span className="text-xs" data-unique-id="3d735854-2619-4afd-bde1-f8c178fafa21" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="af2dbad5-406a-44da-994e-d1a9b1d5714a" data-file-name="components/help-modal.tsx">System Preference</span></span>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/50" data-unique-id="95411077-040b-4725-b4b5-3cfd2fc5d422" data-file-name="components/help-modal.tsx">
                      <h4 className="font-medium text-blue-800 dark:text-blue-300 flex items-center" data-unique-id="9a4fa605-01e0-4977-83f9-27d69247c207" data-file-name="components/help-modal.tsx">
                        <Lightbulb className="w-4 h-4 mr-2" /><span className="editable-text" data-unique-id="73fe2915-77db-4544-92a8-500e0aae251a" data-file-name="components/help-modal.tsx">
                        Dark Mode Benefits
                      </span></h4>
                      <ul className="mt-2 text-sm text-blue-700 dark:text-blue-300 list-disc list-inside space-y-1" data-unique-id="872ac961-ed90-4519-80a1-fa0dd9f25986" data-file-name="components/help-modal.tsx">
                        <li data-unique-id="22c79723-9bd4-4e0c-9bb3-7bda07e45835" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="92512d7f-8dc3-44aa-a1b6-d9d5f1180f53" data-file-name="components/help-modal.tsx">Reduces eye strain in low-light environments</span></li>
                        <li data-unique-id="cafbeeac-77c9-4b69-86c4-d35e86422313" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="03984ae8-541b-4ad7-a4d6-55153d26b4f0" data-file-name="components/help-modal.tsx">May increase battery life on OLED screens</span></li>
                        <li data-unique-id="bc89c4ae-9305-4c71-b392-02c5de642256" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="107bb61e-92e4-443f-ad00-de2e702c222c" data-file-name="components/help-modal.tsx">Reduces blue light emission which can help with sleep</span></li>
                        <li data-unique-id="8cd14112-a594-4d1f-b6b4-9420a069f7f2" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="6572b646-34a4-4df5-8ac9-8a37cf0896f1" data-file-name="components/help-modal.tsx">Creates a modern, professional look</span></li>
                      </ul>
                    </div>
                  </div>
                </FeatureHighlight>
                
                <div className="mt-4 bg-accent/10 p-4 rounded-lg border border-border" data-unique-id="22d07dc0-02d6-43c2-a454-ba102b37eeb8" data-file-name="components/help-modal.tsx">
                  <h4 className="font-medium mb-2 flex items-center" data-unique-id="4a97dc98-c1a6-4302-bbc6-634e0333fb42" data-file-name="components/help-modal.tsx">
                    <HelpCircle className="w-4 h-4 mr-2 text-primary" /><span className="editable-text" data-unique-id="ab16fbdb-1c8e-4834-bcce-8bc6334a74eb" data-file-name="components/help-modal.tsx">
                    Customizing Your Experience
                  </span></h4>
                  <p className="text-sm mb-3" data-unique-id="4c0e513b-1469-47cf-bb0e-d66300a5288d" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="8f0f4298-1254-427e-a293-e16259eb334d" data-file-name="components/help-modal.tsx">
                    You can personalize your experience using the preferences panel:
                  </span></p>
                  <ol className="list-decimal list-inside text-sm space-y-1" data-unique-id="8daf9581-8445-4aa1-b5fb-8b0770669691" data-file-name="components/help-modal.tsx">
                    <li data-unique-id="da5eebf7-c443-4901-a066-4a05c584b953" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="745e08c4-7f96-4e46-9740-dd5c6f62ea5a" data-file-name="components/help-modal.tsx">Click the </span><strong data-unique-id="bc7e2bd3-6df9-4f9d-acef-d912ace29264" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="2d7b8605-256e-42fd-a04c-fe10213d49ca" data-file-name="components/help-modal.tsx">Settings icon</span></strong><span className="editable-text" data-unique-id="4d2cd001-eadb-443e-9361-6feb0f5af290" data-file-name="components/help-modal.tsx"> in the top right corner</span></li>
                    <li data-unique-id="eba74d21-4de7-4650-9bd2-9e277f6a7538" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="ece8ac8d-5852-453f-bc24-d3ab0560b7e1" data-file-name="components/help-modal.tsx">Choose your preferred theme: Light, Dark, or System</span></li>
                    <li data-unique-id="974aa920-07b6-4d37-86a7-0b1f81972986" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="a73fb860-489d-4ac0-84c8-559ea46874ab" data-file-name="components/help-modal.tsx">Toggle tutorials and tooltips on or off</span></li>
                    <li data-unique-id="48e5235d-f6e4-4122-b9f6-1909d7d2a412" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="d3a39ab1-ce77-4228-ae29-cf5cd4e1581e" data-file-name="components/help-modal.tsx">Reset all tutorials if you want to see them again</span></li>
                  </ol>
                </div>
              </section>
            </div>
            
            {/* Footer */}
            <div className="p-4 lg:p-6 border-t border-border flex justify-between items-center mt-4" data-unique-id="5f4a5e64-653b-44e0-8220-06e3fb9ee096" data-file-name="components/help-modal.tsx">
              <p className="text-sm text-muted-foreground" data-unique-id="ee63b5ef-2f82-43b5-a91b-01b17bbd308a" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="b25be1d5-93dc-49c6-97d6-d44497716557" data-file-name="components/help-modal.tsx">
                Questions or feedback? Contact support@detroitaxle.com
              </span></p>
              <button onClick={() => {
              onClose();
              if (typeof window !== 'undefined') {
                localStorage.setItem('helpModalClosed', 'true');
              }
            }} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors" data-unique-id="9ba68793-4e1d-4348-ad32-fc5f5a6b9e86" data-file-name="components/help-modal.tsx"><span className="editable-text" data-unique-id="360e1a89-139a-4b75-9ff1-18629616082e" data-file-name="components/help-modal.tsx">
                Close
              </span></button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>;
}