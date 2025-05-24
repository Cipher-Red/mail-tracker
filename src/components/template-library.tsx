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
  useEffect(() => {
    // Load templates from localStorage on component mount
    const savedTemplates = getLocalStorage<TemplateProps[]>("emailTemplates", []);
    if (savedTemplates.length > 0) {
      setTemplates(savedTemplates);
      setSelectedId(activeTemplate.id);
    } else {
      // Create default template if none exist
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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="4f35467a-8263-4b98-957c-c3e3d690b929" data-file-name="components/template-library.tsx">
      <div className="flex justify-between items-center mb-6" data-unique-id="88d307fb-9791-4c25-92be-27c590c50443" data-file-name="components/template-library.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="4e6ad883-1363-4bd6-a47c-52262c768ce6" data-file-name="components/template-library.tsx">
          <Library className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="20b073e1-d9e4-4507-a2a5-d5cb7df1b085" data-file-name="components/template-library.tsx"> Template Library
        </span></h2>
        <div className="flex space-x-2" data-unique-id="f4986008-c53f-425f-a10d-a649dbe11167" data-file-name="components/template-library.tsx">
          <input type="file" ref={fileInputRef} onChange={importTemplate} accept="application/json" className="hidden" id="template-import" data-unique-id="4a15bae2-0dcb-4a19-a796-90696a1f3c7e" data-file-name="components/template-library.tsx" />
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors text-sm" data-unique-id="94b21a08-aa5f-4c84-97dc-ed98660554a5" data-file-name="components/template-library.tsx">
            <Upload className="mr-1.5 h-4 w-4" /><span className="editable-text" data-unique-id="39dd9967-ec85-49fd-a485-a49d6a2199ba" data-file-name="components/template-library.tsx">
            Import
          </span></button>
          <button onClick={createTemplate} className="flex items-center px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm" data-unique-id="4d52d7e0-8b8d-492f-b61e-9c5bad3c35b2" data-file-name="components/template-library.tsx">
            <Plus className="mr-1.5 h-4 w-4" /><span className="editable-text" data-unique-id="959c0ed1-b54f-499a-b159-5dbf8683be94" data-file-name="components/template-library.tsx">
            New Template
          </span></button>
        </div>
      </div>
      
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2" data-unique-id="74a28c3a-b0bc-4c65-b836-58c5c8fb624a" data-file-name="components/template-library.tsx" data-dynamic-text="true">
        {templates.length === 0 ? <div className="text-center py-8 text-muted-foreground" data-unique-id="7197734d-ee48-4123-bb32-0d4e8d7a2a46" data-file-name="components/template-library.tsx"><span className="editable-text" data-unique-id="6f0d8680-28cc-4ede-9784-589534df4953" data-file-name="components/template-library.tsx">
            No saved templates found.
          </span></div> : templates.map(template => <div key={template.id} className={`p-4 border rounded-md transition-colors cursor-pointer ${selectedId === template.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`} onClick={() => handleTemplateSelect(template)} data-unique-id="f32e54bd-180b-4b4c-aa2d-e19367c4a412" data-file-name="components/template-library.tsx">
              <div className="flex justify-between items-start" data-unique-id="e6abeaaf-ac78-435c-b9fd-b58696ade825" data-file-name="components/template-library.tsx">
                <div data-unique-id="c804c58d-96f6-4a26-8c00-08fef11c4f44" data-file-name="components/template-library.tsx">
                  <h3 className="font-medium" data-unique-id="a706b460-889c-4dd6-95f7-ad1a60dea3f6" data-file-name="components/template-library.tsx" data-dynamic-text="true">
                    {template.name}
                    {selectedId === template.id && <span className="ml-2 inline-flex items-center text-xs text-primary" data-unique-id="a0c46e20-12e8-4aa8-9a83-16350ae19ca5" data-file-name="components/template-library.tsx">
                        <Check className="h-3 w-3 mr-0.5" /><span className="editable-text" data-unique-id="895a6ee5-a74a-4b61-8ab4-b21f2bb71b09" data-file-name="components/template-library.tsx"> Active
                      </span></span>}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1" data-unique-id="b6cc9168-9618-4ab2-be9d-ead62a7b3c4a" data-file-name="components/template-library.tsx" data-dynamic-text="true">
                    {template.subject}
                  </p>
                </div>
                <div className="flex space-x-1" data-unique-id="a1b0bf36-f2a6-461e-95f6-bf6ce329d4ff" data-file-name="components/template-library.tsx">
                  <button onClick={e => {
              e.stopPropagation();
              handleTemplateSelect(template);
            }} className="p-1 rounded-md hover:bg-accent" data-unique-id="d76f6110-e020-41b9-893b-b3b0fc8e3796" data-file-name="components/template-library.tsx">
                    <FileEdit className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <div className="relative" data-unique-id="fe47adb6-ea24-4699-ab46-cff72eec444c" data-file-name="components/template-library.tsx" data-dynamic-text="true">
                    <button onClick={e => {
                e.stopPropagation();
                duplicateTemplate(template);
              }} className="p-1 rounded-md hover:bg-accent" title="Duplicate template" data-unique-id="10be7a6d-0d40-4b3a-9a6d-ff85cd05f9ea" data-file-name="components/template-library.tsx">
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    </button>
                    {copySuccess === template.id && <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap" data-unique-id="6a237518-b3ad-4c44-a528-bcb367a97f30" data-file-name="components/template-library.tsx"><span className="editable-text" data-unique-id="76bcf6c6-dac7-429b-97bf-0d15092d99b2" data-file-name="components/template-library.tsx">
                        Copied!
                      </span></span>}
                  </div>
                  <button onClick={e => {
              e.stopPropagation();
              downloadTemplate(template);
            }} className="p-1 rounded-md hover:bg-accent" title="Download template" data-unique-id="484ca090-2a66-4829-a5bb-00d21b41ef98" data-file-name="components/template-library.tsx">
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button onClick={e => {
              e.stopPropagation();
              deleteTemplate(template.id);
            }} className="p-1 rounded-md hover:bg-accent" data-unique-id="72e676b5-ada2-43ac-a685-0e0a8c836706" data-file-name="components/template-library.tsx">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                </div>
              </div>
            </div>)}
      </div>
    </motion.div>;
}