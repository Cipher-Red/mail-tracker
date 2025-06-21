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
  }} className="bg-card rounded-lg shadow-lg p-6" data-unique-id="4994441d-387b-4e19-bb75-98630ca78ec0" data-file-name="components/template-library.tsx">
      <div className="flex justify-between items-center mb-6" data-unique-id="a741cb16-e5f3-48ac-9ac0-5d9de68e27f5" data-file-name="components/template-library.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="7575d323-e45c-448e-bcb7-b5ae7e6a1db1" data-file-name="components/template-library.tsx">
          <Library className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="db7baceb-f529-4f4e-80e7-1fc6a781e8b8" data-file-name="components/template-library.tsx"> Template Library
        </span></h2>
        <div className="flex space-x-2" data-unique-id="59df5869-0a3d-4992-899c-4f43c7797085" data-file-name="components/template-library.tsx">
          <input type="file" ref={fileInputRef} onChange={importTemplate} accept="application/json" className="hidden" id="template-import" data-unique-id="1959cfe8-7c6d-422d-a0de-aab10e3b6bed" data-file-name="components/template-library.tsx" />
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors text-sm" data-unique-id="7bc97692-3c65-4a0d-8fc9-8f19cd42342d" data-file-name="components/template-library.tsx">
            <Upload className="mr-1.5 h-4 w-4" /><span className="editable-text" data-unique-id="f4dc1948-9ad2-4631-b4b7-6789863b3d6c" data-file-name="components/template-library.tsx">
            Import
          </span></button>
          <button onClick={createTemplate} className="flex items-center px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm" data-unique-id="3516972c-895c-4a60-84ef-0905d1bab05b" data-file-name="components/template-library.tsx">
            <Plus className="mr-1.5 h-4 w-4" /><span className="editable-text" data-unique-id="16bd9a4b-ce3d-4caa-a294-d40f29ab036f" data-file-name="components/template-library.tsx">
            New Template
          </span></button>
        </div>
      </div>
      
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2" data-unique-id="53e5f77b-bfbd-4546-a873-f220a2e856be" data-file-name="components/template-library.tsx" data-dynamic-text="true">
        {templates.length === 0 ? <div className="text-center py-8 text-muted-foreground" data-unique-id="3a1d715e-4c55-4fac-a367-3b77d24b2d52" data-file-name="components/template-library.tsx"><span className="editable-text" data-unique-id="f3c804c3-42a3-41d3-82df-338ee0ba85a9" data-file-name="components/template-library.tsx">
            No saved templates found.
          </span></div> : templates.map(template => <div key={template.id} className={`p-4 border rounded-md transition-all duration-200 cursor-pointer hover:shadow-md ${selectedId === template.id ? "border-primary bg-primary/10 dark:bg-primary/20 shadow-md" : "border-border hover:border-primary/30 dark:hover:border-primary/40"}`} onClick={() => handleTemplateSelect(template)} data-unique-id="63d46439-4a6c-4fc1-b6a3-8a2bc419b9f6" data-file-name="components/template-library.tsx">
              <div className="flex justify-between items-start" data-unique-id="482ca489-08e6-45fb-96bf-8fe61e0fcc57" data-file-name="components/template-library.tsx">
                <div data-unique-id="04137507-5253-416d-adf7-d4bceff9398d" data-file-name="components/template-library.tsx">
                  <h3 className="font-medium" data-unique-id="7c86dd24-ca49-43bb-89dd-4401a7401208" data-file-name="components/template-library.tsx" data-dynamic-text="true">
                    {template.name}
                    {selectedId === template.id && <span className="ml-2 inline-flex items-center text-xs text-primary" data-unique-id="4b1e1ce4-1063-40d9-87b1-06bbc1780906" data-file-name="components/template-library.tsx">
                        <Check className="h-3 w-3 mr-0.5" /><span className="editable-text" data-unique-id="65290990-faea-45ed-8373-63677c7cb40c" data-file-name="components/template-library.tsx"> Active
                      </span></span>}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1" data-unique-id="db3f85f8-3717-4e84-b118-75c395b27c06" data-file-name="components/template-library.tsx" data-dynamic-text="true">
                    {template.subject}
                  </p>
                </div>
                <div className="flex space-x-1" data-unique-id="1eb2e6d1-badd-43f9-9965-9d207528221d" data-file-name="components/template-library.tsx">
                  <button onClick={e => {
              e.stopPropagation();
              handleTemplateSelect(template);
            }} className="p-1 rounded-md hover:bg-accent" data-unique-id="e51e1a84-9434-4c79-ab20-322a472bba01" data-file-name="components/template-library.tsx">
                    <FileEdit className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <div className="relative" data-unique-id="2ca4aab6-4129-4de6-8329-b362456dd991" data-file-name="components/template-library.tsx" data-dynamic-text="true">
                    <button onClick={e => {
                e.stopPropagation();
                duplicateTemplate(template);
              }} className="p-1 rounded-md hover:bg-accent" title="Duplicate template" data-unique-id="c3cc1418-1dd1-4a1e-9e47-2f4b612c39d0" data-file-name="components/template-library.tsx">
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    </button>
                    {copySuccess === template.id && <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap" data-unique-id="e5f42e7f-f018-44c1-8350-712c66a215ed" data-file-name="components/template-library.tsx"><span className="editable-text" data-unique-id="dd9c831f-71fc-4b95-badc-02d22c84c6c6" data-file-name="components/template-library.tsx">
                        Copied!
                      </span></span>}
                  </div>
                  <button onClick={e => {
              e.stopPropagation();
              downloadTemplate(template);
            }} className="p-1 rounded-md hover:bg-accent" title="Download template" data-unique-id="0b71ec09-aeb2-4a74-87d6-027b28bc5fec" data-file-name="components/template-library.tsx">
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button onClick={e => {
              e.stopPropagation();
              deleteTemplate(template.id);
            }} className="p-1 rounded-md hover:bg-accent" data-unique-id="cf535e9d-f145-4732-9e51-645252060be7" data-file-name="components/template-library.tsx">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                </div>
              </div>
            </div>)}
      </div>
    </motion.div>;
}