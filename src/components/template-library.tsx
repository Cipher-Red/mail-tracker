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
  }} className="bg-card rounded-lg shadow-lg p-6" data-unique-id="646660cf-3552-454d-97b3-341f8c276cf2" data-file-name="components/template-library.tsx">
      <div className="flex justify-between items-center mb-6" data-unique-id="9c3a2f63-27f7-49f3-b2ae-4ea4907800b4" data-file-name="components/template-library.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="a0f29283-a3be-448f-844b-07665adac987" data-file-name="components/template-library.tsx">
          <Library className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="07ea0020-3b7f-487e-8c0f-593cbe31a080" data-file-name="components/template-library.tsx"> Template Library
        </span></h2>
        <div className="flex space-x-2" data-unique-id="dad748a1-bc02-4f66-8418-38b3b5f9751a" data-file-name="components/template-library.tsx">
          <input type="file" ref={fileInputRef} onChange={importTemplate} accept="application/json" className="hidden" id="template-import" data-unique-id="abba82c2-6370-4c47-9e01-16edd8aeb084" data-file-name="components/template-library.tsx" />
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors text-sm" data-unique-id="160b83e3-ad1f-4363-88b7-c50acf39bfad" data-file-name="components/template-library.tsx">
            <Upload className="mr-1.5 h-4 w-4" /><span className="editable-text" data-unique-id="4e651656-fe3c-4fdd-aeb6-04d890233207" data-file-name="components/template-library.tsx">
            Import
          </span></button>
          <button onClick={createTemplate} className="flex items-center px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm" data-unique-id="3c4a62de-8981-4677-89f5-0d69cabba551" data-file-name="components/template-library.tsx">
            <Plus className="mr-1.5 h-4 w-4" /><span className="editable-text" data-unique-id="b7b33f4c-a987-43ad-8a66-ebdb66ea487e" data-file-name="components/template-library.tsx">
            New Template
          </span></button>
        </div>
      </div>
      
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2" data-unique-id="e37e4271-f6b7-4225-b798-da172d821bf2" data-file-name="components/template-library.tsx" data-dynamic-text="true">
        {templates.length === 0 ? <div className="text-center py-8 text-muted-foreground" data-unique-id="74774dc0-5712-4a3c-88fc-a5a23c31b56b" data-file-name="components/template-library.tsx"><span className="editable-text" data-unique-id="f9e40bfa-6c18-4cee-818d-f1b39b6a1a5a" data-file-name="components/template-library.tsx">
            No saved templates found.
          </span></div> : templates.map(template => <div key={template.id} className={`p-4 border rounded-md transition-all duration-200 cursor-pointer hover:shadow-md ${selectedId === template.id ? "border-primary bg-primary/10 dark:bg-primary/20 shadow-md" : "border-border hover:border-primary/30 dark:hover:border-primary/40"}`} onClick={() => handleTemplateSelect(template)} data-unique-id="9e4f8b66-5946-47ed-9b37-de57e1de7639" data-file-name="components/template-library.tsx">
              <div className="flex justify-between items-start" data-unique-id="1511f65f-a332-4aa6-ab17-2f14658d4b44" data-file-name="components/template-library.tsx">
                <div data-unique-id="993996fc-8b3a-4e49-ada6-e4b608a16bc5" data-file-name="components/template-library.tsx">
                  <h3 className="font-medium" data-unique-id="dc48db9b-f411-4011-9a56-c66e181df279" data-file-name="components/template-library.tsx" data-dynamic-text="true">
                    {template.name}
                    {selectedId === template.id && <span className="ml-2 inline-flex items-center text-xs text-primary" data-unique-id="15d20e5e-04c5-4edd-9b15-a0c3a311be65" data-file-name="components/template-library.tsx">
                        <Check className="h-3 w-3 mr-0.5" /><span className="editable-text" data-unique-id="80626a62-3e2f-490e-bbfb-792e6c86edfb" data-file-name="components/template-library.tsx"> Active
                      </span></span>}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1" data-unique-id="50b330b9-2408-4fe4-a1af-178922ad86fa" data-file-name="components/template-library.tsx" data-dynamic-text="true">
                    {template.subject}
                  </p>
                </div>
                <div className="flex space-x-1" data-unique-id="2ff8de3c-9e18-4259-a6f4-a50b5516948e" data-file-name="components/template-library.tsx">
                  <button onClick={e => {
              e.stopPropagation();
              handleTemplateSelect(template);
            }} className="p-1 rounded-md hover:bg-accent" data-unique-id="0def3ccd-0161-42c4-a977-8338ea4a0caf" data-file-name="components/template-library.tsx">
                    <FileEdit className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <div className="relative" data-unique-id="8326a071-e405-488f-8855-d20eb24140cb" data-file-name="components/template-library.tsx" data-dynamic-text="true">
                    <button onClick={e => {
                e.stopPropagation();
                duplicateTemplate(template);
              }} className="p-1 rounded-md hover:bg-accent" title="Duplicate template" data-unique-id="962d6696-179b-4abe-9a61-e4753a7cc1fa" data-file-name="components/template-library.tsx">
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    </button>
                    {copySuccess === template.id && <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap" data-unique-id="337c03d9-3c10-488c-b883-236e8c5bbd57" data-file-name="components/template-library.tsx"><span className="editable-text" data-unique-id="2b9c6755-f4b2-49d3-a9a1-602230722368" data-file-name="components/template-library.tsx">
                        Copied!
                      </span></span>}
                  </div>
                  <button onClick={e => {
              e.stopPropagation();
              downloadTemplate(template);
            }} className="p-1 rounded-md hover:bg-accent" title="Download template" data-unique-id="bb30bd47-3186-4fef-9252-bda9633794bf" data-file-name="components/template-library.tsx">
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button onClick={e => {
              e.stopPropagation();
              deleteTemplate(template.id);
            }} className="p-1 rounded-md hover:bg-accent" data-unique-id="13d22303-a44c-4e56-b97b-b3ccd2e8a67f" data-file-name="components/template-library.tsx">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                </div>
              </div>
            </div>)}
      </div>
    </motion.div>;
}