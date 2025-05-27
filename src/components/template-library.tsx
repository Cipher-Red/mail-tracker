"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Library, Plus, Trash2, FileEdit, Copy, Check, Upload, Download } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { getLocalStorage, setLocalStorage } from "@/lib/utils";
import { downloadTemplate, TemplateData } from "@/lib/email-utils";
type TemplateProps = {
  id: string;
  name: string;
  subject: string;
  preheader: string;
  content: string;
};
interface TemplateLibraryProps {
  activeTemplate: TemplateProps;
  onSelect: (template: TemplateProps) => void;
}
export default function TemplateLibrary({
  activeTemplate,
  onSelect
}: TemplateLibraryProps) {
  const [templates, setTemplates] = useState<TemplateProps[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Load templates with improved error handling and validation
  useEffect(() => {
    try {
      // Load templates from localStorage
      const savedTemplates = getLocalStorage<TemplateProps[]>("emailTemplates", []);

      // Validate templates structure
      const validTemplates = savedTemplates.filter(template => template && typeof template === 'object' && template.id && template.name && template.subject && template.content);
      if (validTemplates.length > 0) {
        setTemplates(validTemplates);
        setSelectedId(activeTemplate.id);
      } else {
        // Create default templates if none exist or if all were invalid
        const defaultTemplates = [{
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
        }, {
          id: "cancellation",
          name: "Order Cancellation",
          subject: "Your Detroit Axle Order Cancellation",
          preheader: "Information about your cancelled order",
          content: `Dear {{customerName}},

We're writing to confirm that your order #{{orderNumber}} has been cancelled as requested.

Cancellation Details:
- Order Number: {{orderNumber}}
- Date Cancelled: ${new Date().toLocaleDateString()}

If you requested a refund, please allow 3-5 business days for the amount to be credited back to your original payment method.

If you did not request this cancellation or if you have any questions, please contact our customer support team at 888-583-0255 immediately.

Thank you for your understanding.

Best regards,
Detroit Axle Customer Support Team`
        }, {
          id: "outofstock",
          name: "Out of Stock Notification",
          subject: "Out of Stock Notice - Detroit Axle Order",
          preheader: "Important information about your order",
          content: `Dear {{customerName}},

We apologize, but one or more items from your recent order #{{orderNumber}} are currently out of stock.

Order Details:
- Order Number: {{orderNumber}}
- Out of Stock Item(s): {{items}}

We have the following options available:
1. Wait for the item(s) to be restocked (estimated time: 2-3 weeks)
2. Replace with an alternative product
3. Receive a partial refund for the unavailable items

Please reply to this email or contact our customer support team at 888-583-0255 to let us know your preference.

We sincerely apologize for any inconvenience this may cause.

Best regards,
Detroit Axle Customer Support Team`
        }];
        setTemplates(defaultTemplates);
        setSelectedId(defaultTemplates[0].id);
        setLocalStorage("emailTemplates", defaultTemplates);
      }
    } catch (error) {
      console.error("Error loading templates:", error);

      // Reset to default on error
      const defaultTemplate = {
        id: "default",
        name: "Default Template",
        subject: "Your Detroit Axle Order Update",
        preheader: "Track your recent order from Detroit Axle",
        content: "Dear {{customerName}},\n\nThank you for your order."
      };
      setTemplates([defaultTemplate]);
      setSelectedId(defaultTemplate.id);

      // Try to fix the localStorage
      try {
        setLocalStorage("emailTemplates", [defaultTemplate]);
      } catch (storageError) {
        console.error("Failed to save default template:", storageError);
      }
    }
  }, [activeTemplate.id]);
  const createTemplate = () => {
    const newTemplate: TemplateProps = {
      id: uuidv4(),
      name: "New Template",
      subject: "Your Detroit Axle Order",
      preheader: "",
      content: "Dear {{customerName}},\n\nThank you for your order.\n\nOrder #: {{orderNumber}}\nTracking #: {{trackingNumber}}\n\nBest regards,\nDetroit Axle"
    };
    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    setLocalStorage("emailTemplates", updatedTemplates);

    // Select and load the new template
    setSelectedId(newTemplate.id);
    onSelect(newTemplate);
  };
  const deleteTemplate = (id: string) => {
    const updatedTemplates = templates.filter(t => t.id !== id);
    setTemplates(updatedTemplates);
    setLocalStorage("emailTemplates", updatedTemplates);

    // If we deleted the selected template, select another one
    if (id === selectedId && updatedTemplates.length > 0) {
      setSelectedId(updatedTemplates[0].id);
      onSelect(updatedTemplates[0]);
    }
  };
  const duplicateTemplate = (template: TemplateProps) => {
    const duplicatedTemplate = {
      ...template,
      id: uuidv4(),
      name: `${template.name} (Copy)`
    };
    const updatedTemplates = [...templates, duplicatedTemplate];
    setTemplates(updatedTemplates);
    setLocalStorage("emailTemplates", updatedTemplates);

    // Show success message and clear it after 2 seconds
    setCopySuccess(template.id);
    setTimeout(() => setCopySuccess(null), 2000);
  };
  const importTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const templateData = JSON.parse(e.target?.result as string) as TemplateData;

        // Ensure the imported data has all required fields
        if (!templateData.id || !templateData.name || !templateData.subject || !templateData.content) {
          alert("Invalid template format. Make sure the file contains all required template fields.");
          return;
        }

        // Generate a new ID to avoid conflicts
        const newTemplate: TemplateProps = {
          ...templateData,
          id: uuidv4()
        };
        const updatedTemplates = [...templates, newTemplate];
        setTemplates(updatedTemplates);
        setLocalStorage("emailTemplates", updatedTemplates);

        // Select the newly imported template
        setSelectedId(newTemplate.id);
        onSelect(newTemplate);
        alert(`Template "${newTemplate.name}" imported successfully!`);
      } catch (error) {
        alert("Error importing template. Please make sure the file is a valid JSON template.");
        console.error("Import error:", error);
      }
    };
    reader.readAsText(file);

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const handleTemplateSelect = (template: TemplateProps) => {
    setSelectedId(template.id);
    onSelect(template);
  };
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} transition={{
    duration: 0.3
  }} className="bg-card rounded-lg shadow-lg p-6" data-unique-id="4ea07b84-c139-497a-bb07-e96503517853" data-file-name="components/template-library.tsx">
      <div className="flex justify-between items-center mb-6" data-unique-id="a86ba64c-e57b-410b-9da1-b5f505323f9d" data-file-name="components/template-library.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="d1238073-8a10-47d2-ae6f-a3f61a886504" data-file-name="components/template-library.tsx">
          <Library className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="811b6325-8d8d-48d0-826c-d7b4a47e8822" data-file-name="components/template-library.tsx"> Template Library
        </span></h2>
        <div className="flex space-x-2" data-unique-id="b951c96c-c645-49b0-aae2-9411b6b472f6" data-file-name="components/template-library.tsx">
          <input type="file" ref={fileInputRef} onChange={importTemplate} accept="application/json" className="hidden" id="template-import" data-unique-id="c9031e66-d0fb-4320-9940-1ea8e6b92d2c" data-file-name="components/template-library.tsx" />
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors text-sm" data-unique-id="8a23997b-14a1-4989-b09e-8cb47c39514b" data-file-name="components/template-library.tsx">
            <Upload className="mr-1.5 h-4 w-4" /><span className="editable-text" data-unique-id="e5bf5279-d9d5-4f04-8259-c85a77d8c483" data-file-name="components/template-library.tsx">
            Import
          </span></button>
          <button onClick={createTemplate} className="flex items-center px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm" data-unique-id="c4ae118d-ac69-487a-8340-eec8b5e3b4da" data-file-name="components/template-library.tsx">
            <Plus className="mr-1.5 h-4 w-4" /><span className="editable-text" data-unique-id="42a3bc41-f0dd-4f3a-9e0f-e37e024460f8" data-file-name="components/template-library.tsx">
            New Template
          </span></button>
        </div>
      </div>
      
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2" data-unique-id="73c214d7-fb1e-4755-b47f-25e77d0b741e" data-file-name="components/template-library.tsx" data-dynamic-text="true">
        {templates.length === 0 ? <div className="text-center py-8 text-muted-foreground" data-unique-id="4df2fae5-2748-48aa-9e15-ea0847d97a92" data-file-name="components/template-library.tsx"><span className="editable-text" data-unique-id="032ddfd4-6ec2-421b-b6ed-553888907e6e" data-file-name="components/template-library.tsx">
            No saved templates found.
          </span></div> : templates.map(template => <div key={template.id} className={`p-4 border rounded-md transition-all duration-200 cursor-pointer hover:shadow-md ${selectedId === template.id ? "border-primary bg-primary/10 dark:bg-primary/20 shadow-md" : "border-border hover:border-primary/30 dark:hover:border-primary/40"}`} onClick={() => handleTemplateSelect(template)} data-unique-id="8a7ba632-f18d-42c9-896f-525e6fb69697" data-file-name="components/template-library.tsx">
              <div className="flex justify-between items-start" data-unique-id="3f9b067c-4be4-4c7e-b58d-061c2b2c89f2" data-file-name="components/template-library.tsx">
                <div data-unique-id="7963b3e5-f778-444f-890c-34dc08e0085a" data-file-name="components/template-library.tsx">
                  <h3 className="font-medium" data-unique-id="ea40187a-6556-40e3-a16a-f0eeaf40a1b5" data-file-name="components/template-library.tsx" data-dynamic-text="true">
                    {template.name}
                    {selectedId === template.id && <span className="ml-2 inline-flex items-center text-xs text-primary" data-unique-id="613cb9a9-aabf-4db9-9671-5810e0db364b" data-file-name="components/template-library.tsx">
                        <Check className="h-3 w-3 mr-0.5" /><span className="editable-text" data-unique-id="4c34895f-c506-435a-ab20-31f7c317e55f" data-file-name="components/template-library.tsx"> Active
                      </span></span>}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1" data-unique-id="ad79e7db-c178-4234-8c3c-a96617a99d26" data-file-name="components/template-library.tsx" data-dynamic-text="true">
                    {template.subject}
                  </p>
                </div>
                <div className="flex space-x-1" data-unique-id="57a55f06-ffe8-4dcc-bdd9-462883b3da8d" data-file-name="components/template-library.tsx">
                  <button onClick={e => {
              e.stopPropagation();
              handleTemplateSelect(template);
            }} className="p-1 rounded-md hover:bg-accent" data-unique-id="918b69b5-7da3-4cfc-b607-59bf791c7ce4" data-file-name="components/template-library.tsx">
                    <FileEdit className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <div className="relative" data-unique-id="2e2869cd-e27b-4e9e-99e5-e9616e479013" data-file-name="components/template-library.tsx" data-dynamic-text="true">
                    <button onClick={e => {
                e.stopPropagation();
                duplicateTemplate(template);
              }} className="p-1 rounded-md hover:bg-accent" title="Duplicate template" data-unique-id="abdde51e-17a2-4355-b46b-c4349fb9ec1f" data-file-name="components/template-library.tsx">
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    </button>
                    {copySuccess === template.id && <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap" data-unique-id="25dbc83d-3ca3-44a5-9e6f-1bcbcfed2b24" data-file-name="components/template-library.tsx"><span className="editable-text" data-unique-id="835759a8-80ad-4838-b736-7ed7daa468f7" data-file-name="components/template-library.tsx">
                        Copied!
                      </span></span>}
                  </div>
                  <button onClick={e => {
              e.stopPropagation();
              downloadTemplate(template);
            }} className="p-1 rounded-md hover:bg-accent" title="Download template" data-unique-id="41bb21ba-0d0d-4bc7-aa6f-a8675d7b1368" data-file-name="components/template-library.tsx">
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button onClick={e => {
              e.stopPropagation();
              deleteTemplate(template.id);
            }} className="p-1 rounded-md hover:bg-accent" data-unique-id="72c61050-c88f-4401-b5d7-6658b394347a" data-file-name="components/template-library.tsx">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                </div>
              </div>
            </div>)}
      </div>
    </motion.div>;
}