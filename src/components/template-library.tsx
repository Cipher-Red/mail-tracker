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
  }} className="bg-card rounded-lg shadow-lg p-6" data-unique-id="2399f14a-b9a6-43e6-816f-ede0ae3cc0a5" data-file-name="components/template-library.tsx">
      <div className="flex justify-between items-center mb-6" data-unique-id="1894c134-5a7f-4a98-bd72-b1b3162d0802" data-file-name="components/template-library.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="b337e0d0-d1e6-4520-9b87-729f847351f1" data-file-name="components/template-library.tsx">
          <Library className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="028db42a-ddcd-4780-9cf8-cb7e5af01fef" data-file-name="components/template-library.tsx"> Template Library
        </span></h2>
        <div className="flex space-x-2" data-unique-id="4daf52a0-7283-4f48-a654-ba230102c432" data-file-name="components/template-library.tsx">
          <input type="file" ref={fileInputRef} onChange={importTemplate} accept="application/json" className="hidden" id="template-import" data-unique-id="fd8a28bd-d426-428f-a4d0-8289329308a4" data-file-name="components/template-library.tsx" />
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors text-sm" data-unique-id="a98e7536-c4aa-4855-94c6-af67d24b703d" data-file-name="components/template-library.tsx">
            <Upload className="mr-1.5 h-4 w-4" /><span className="editable-text" data-unique-id="141e8a07-0614-4c5a-82fe-75815acb3762" data-file-name="components/template-library.tsx">
            Import
          </span></button>
          <button onClick={createTemplate} className="flex items-center px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm" data-unique-id="6d8dfba6-27df-4d11-90ca-b5da613aa392" data-file-name="components/template-library.tsx">
            <Plus className="mr-1.5 h-4 w-4" /><span className="editable-text" data-unique-id="4ae230ed-43a0-42aa-9d0d-d05abe3afbc1" data-file-name="components/template-library.tsx">
            New Template
          </span></button>
        </div>
      </div>
      
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2" data-unique-id="c5f60270-338b-47e0-b295-0010ec3aa23f" data-file-name="components/template-library.tsx" data-dynamic-text="true">
        {templates.length === 0 ? <div className="text-center py-8 text-muted-foreground" data-unique-id="1afd29c1-75df-4db9-8b97-33c343b5b131" data-file-name="components/template-library.tsx"><span className="editable-text" data-unique-id="07c28b13-3b3f-412a-951a-4d5090efac55" data-file-name="components/template-library.tsx">
            No saved templates found.
          </span></div> : templates.map(template => <div key={template.id} className={`p-4 border rounded-md transition-all duration-200 cursor-pointer hover:shadow-md ${selectedId === template.id ? "border-primary bg-primary/10 dark:bg-primary/20 shadow-md" : "border-border hover:border-primary/30 dark:hover:border-primary/40"}`} onClick={() => handleTemplateSelect(template)} data-unique-id="0f64546d-9d91-4938-ad44-d146b336f7d8" data-file-name="components/template-library.tsx">
              <div className="flex justify-between items-start" data-unique-id="5357790a-c9a9-4352-8d03-9e63fa923137" data-file-name="components/template-library.tsx">
                <div data-unique-id="d474f5be-444f-41c5-b78a-e965ba4495eb" data-file-name="components/template-library.tsx">
                  <h3 className="font-medium" data-unique-id="902f0fd4-2e02-4eaa-9bd9-f0af0091febf" data-file-name="components/template-library.tsx" data-dynamic-text="true">
                    {template.name}
                    {selectedId === template.id && <span className="ml-2 inline-flex items-center text-xs text-primary" data-unique-id="e0a9a06d-f492-45f1-ab2d-d600fa7d3aa9" data-file-name="components/template-library.tsx">
                        <Check className="h-3 w-3 mr-0.5" /><span className="editable-text" data-unique-id="984bde6e-3c20-4565-a8f1-e90f831fb450" data-file-name="components/template-library.tsx"> Active
                      </span></span>}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1" data-unique-id="68bf9118-995f-4884-9d7b-0b818e5e7237" data-file-name="components/template-library.tsx" data-dynamic-text="true">
                    {template.subject}
                  </p>
                </div>
                <div className="flex space-x-1" data-unique-id="c7f124d9-abbe-4f2d-bf33-1ff6793e3ef1" data-file-name="components/template-library.tsx">
                  <button onClick={e => {
              e.stopPropagation();
              handleTemplateSelect(template);
            }} className="p-1 rounded-md hover:bg-accent" data-unique-id="dc8f00c0-93d1-4d7a-924b-12ac9597606b" data-file-name="components/template-library.tsx">
                    <FileEdit className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <div className="relative" data-unique-id="5f1cd883-e633-4479-b986-a367975ecf37" data-file-name="components/template-library.tsx" data-dynamic-text="true">
                    <button onClick={e => {
                e.stopPropagation();
                duplicateTemplate(template);
              }} className="p-1 rounded-md hover:bg-accent" title="Duplicate template" data-unique-id="5b15fad7-f9e2-44ea-86e9-cd524e0f3920" data-file-name="components/template-library.tsx">
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    </button>
                    {copySuccess === template.id && <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap" data-unique-id="4f90df1b-423b-4087-84da-2039d2c5d04e" data-file-name="components/template-library.tsx"><span className="editable-text" data-unique-id="c6e54677-2eae-400a-bc3f-2e82a1268d69" data-file-name="components/template-library.tsx">
                        Copied!
                      </span></span>}
                  </div>
                  <button onClick={e => {
              e.stopPropagation();
              downloadTemplate(template);
            }} className="p-1 rounded-md hover:bg-accent" title="Download template" data-unique-id="aa1a3583-75a5-4e20-a452-7d3b7158b770" data-file-name="components/template-library.tsx">
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button onClick={e => {
              e.stopPropagation();
              deleteTemplate(template.id);
            }} className="p-1 rounded-md hover:bg-accent" data-unique-id="28a73b84-8afb-4e1f-81a3-2a388a046b78" data-file-name="components/template-library.tsx">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                </div>
              </div>
            </div>)}
      </div>
    </motion.div>;
}