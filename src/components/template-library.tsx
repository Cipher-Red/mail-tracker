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
        // Create default template if none exist or if all were invalid
        const defaultTemplate = {
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
        setTemplates([defaultTemplate]);
        setSelectedId(defaultTemplate.id);
        setLocalStorage("emailTemplates", [defaultTemplate]);
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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="0d6b3d09-435f-424f-83a0-99f9134deb7b" data-file-name="components/template-library.tsx">
      <div className="flex justify-between items-center mb-6" data-unique-id="46305306-9159-4030-90bb-6e7ca46ab580" data-file-name="components/template-library.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="67d8203e-f2ed-4320-a8b5-0d74bcf42e4a" data-file-name="components/template-library.tsx">
          <Library className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="e42f9d88-b562-4f46-8710-e780e487b19f" data-file-name="components/template-library.tsx"> Template Library
        </span></h2>
        <div className="flex space-x-2" data-unique-id="79b541d7-edbb-4d1f-9fe3-808cef4ff1b6" data-file-name="components/template-library.tsx">
          <input type="file" ref={fileInputRef} onChange={importTemplate} accept="application/json" className="hidden" id="template-import" data-unique-id="95b75292-89c0-49ef-a84b-1b649e386d27" data-file-name="components/template-library.tsx" />
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors text-sm" data-unique-id="5f6e8d7f-a9fa-4cf0-9c7a-b4700e9d0d4d" data-file-name="components/template-library.tsx">
            <Upload className="mr-1.5 h-4 w-4" /><span className="editable-text" data-unique-id="53c690a9-8120-4baf-b521-fe336049c600" data-file-name="components/template-library.tsx">
            Import
          </span></button>
          <button onClick={createTemplate} className="flex items-center px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm" data-unique-id="2f8dc870-e53c-4abe-b836-b322f6f25107" data-file-name="components/template-library.tsx">
            <Plus className="mr-1.5 h-4 w-4" /><span className="editable-text" data-unique-id="e1998ad6-be3a-4137-a686-f5e25b4eaa7a" data-file-name="components/template-library.tsx">
            New Template
          </span></button>
        </div>
      </div>
      
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2" data-unique-id="09cc41f2-c7c9-4d4a-a66e-89c81369590f" data-file-name="components/template-library.tsx" data-dynamic-text="true">
        {templates.length === 0 ? <div className="text-center py-8 text-muted-foreground" data-unique-id="0cedbc28-99cb-4a11-a215-7cf731b62d51" data-file-name="components/template-library.tsx"><span className="editable-text" data-unique-id="ea0f47cc-150e-447b-97dc-4f19c2569158" data-file-name="components/template-library.tsx">
            No saved templates found.
          </span></div> : templates.map(template => <div key={template.id} className={`p-4 border rounded-md transition-colors cursor-pointer ${selectedId === template.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`} onClick={() => handleTemplateSelect(template)} data-unique-id="76ed1323-58e2-43d2-a4da-087df6a2e283" data-file-name="components/template-library.tsx">
              <div className="flex justify-between items-start" data-unique-id="f446751e-3fe2-4a94-b992-bbd3e970d36e" data-file-name="components/template-library.tsx">
                <div data-unique-id="b0543127-607c-4988-8ad6-68ce1944a99b" data-file-name="components/template-library.tsx">
                  <h3 className="font-medium" data-unique-id="9bd92256-243a-448c-914c-2c53d24b29ba" data-file-name="components/template-library.tsx" data-dynamic-text="true">
                    {template.name}
                    {selectedId === template.id && <span className="ml-2 inline-flex items-center text-xs text-primary" data-unique-id="3d0f863b-704e-44f4-b39d-c80b70bf5d95" data-file-name="components/template-library.tsx">
                        <Check className="h-3 w-3 mr-0.5" /><span className="editable-text" data-unique-id="478ffa46-ccfb-4595-b7ca-a395c0a1e3d6" data-file-name="components/template-library.tsx"> Active
                      </span></span>}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1" data-unique-id="9d72dc3c-db68-416f-8b80-8c3e658e3129" data-file-name="components/template-library.tsx" data-dynamic-text="true">
                    {template.subject}
                  </p>
                </div>
                <div className="flex space-x-1" data-unique-id="79e66d8e-0aa0-458b-9306-6a03a9f08990" data-file-name="components/template-library.tsx">
                  <button onClick={e => {
              e.stopPropagation();
              handleTemplateSelect(template);
            }} className="p-1 rounded-md hover:bg-accent" data-unique-id="dd853de9-afbc-437a-a791-583146d34631" data-file-name="components/template-library.tsx">
                    <FileEdit className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <div className="relative" data-unique-id="20d672cf-ce80-4358-857b-3f5ea110aa54" data-file-name="components/template-library.tsx" data-dynamic-text="true">
                    <button onClick={e => {
                e.stopPropagation();
                duplicateTemplate(template);
              }} className="p-1 rounded-md hover:bg-accent" title="Duplicate template" data-unique-id="793fd662-f056-4045-9a8c-245e61140cfd" data-file-name="components/template-library.tsx">
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    </button>
                    {copySuccess === template.id && <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap" data-unique-id="2b6151c2-e987-4960-8ce8-05be4f326562" data-file-name="components/template-library.tsx"><span className="editable-text" data-unique-id="74c688e1-cf65-4a15-b373-e2c3bc372685" data-file-name="components/template-library.tsx">
                        Copied!
                      </span></span>}
                  </div>
                  <button onClick={e => {
              e.stopPropagation();
              downloadTemplate(template);
            }} className="p-1 rounded-md hover:bg-accent" title="Download template" data-unique-id="7e6d5be0-d4b5-48f0-8391-4f55be9aa857" data-file-name="components/template-library.tsx">
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button onClick={e => {
              e.stopPropagation();
              deleteTemplate(template.id);
            }} className="p-1 rounded-md hover:bg-accent" data-unique-id="24c18905-74f7-4255-8c2a-37cffeab1957" data-file-name="components/template-library.tsx">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                </div>
              </div>
            </div>)}
      </div>
    </motion.div>;
}