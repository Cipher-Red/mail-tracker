"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Save, AlertCircle, Download, Copy } from "lucide-react";
import { getLocalStorage, setLocalStorage } from "@/lib/utils";
import { downloadTemplate, copyToClipboard, generateHtmlEmail, TemplateData } from "@/lib/email-utils";
type TemplateProps = TemplateData;
interface TemplateEditorProps {
  template: TemplateProps;
  onChange: (template: TemplateProps) => void;
}
export default function TemplateEditor({
  template,
  onChange
}: TemplateEditorProps) {
  const [isSaved, setIsSaved] = useState(false);
  const handleChange = (field: keyof TemplateProps, value: string) => {
    onChange({
      ...template,
      [field]: value
    });
    setIsSaved(false);
  };
  const saveTemplate = () => {
    // Save to localStorage
    const savedTemplates = getLocalStorage<TemplateProps[]>("emailTemplates", []);
    const existingIndex = savedTemplates.findIndex((t: TemplateProps) => t.id === template.id);
    if (existingIndex >= 0) {
      savedTemplates[existingIndex] = template;
    } else {
      savedTemplates.push(template);
    }
    setLocalStorage("emailTemplates", savedTemplates);
    setIsSaved(true);

    // Track template save action
    import('@/lib/utils').then(({
      trackActivity
    }) => {
      trackActivity('template.saved', {
        templateId: template.id,
        templateName: template.name,
        isUpdate: existingIndex >= 0
      });
    });

    // Reset saved status after 2 seconds
    setTimeout(() => setIsSaved(false), 2000);
  };
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} transition={{
    duration: 0.3
  }} className="bg-card rounded-lg shadow-md p-6" data-unique-id="cacdca4b-efa7-4734-bbc8-917f3a371a22" data-file-name="components/template-editor.tsx">
      <div className="flex justify-between items-center mb-6" data-unique-id="38923682-4a2e-423b-80dc-3b8721290b8a" data-file-name="components/template-editor.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="22306ba2-3f08-4a0a-a86e-44679ac5058f" data-file-name="components/template-editor.tsx">
          <Edit className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="370b75d6-4aba-40d4-9417-45c41341e1b2" data-file-name="components/template-editor.tsx"> Template Editor
        </span></h2>
        <div className="flex space-x-2" data-unique-id="c0a6d7e0-32f9-4e0f-86d2-599e8cdad90d" data-file-name="components/template-editor.tsx">
          <button onClick={() => {
          const html = generateHtmlEmail(template);
          copyToClipboard(html);
          alert("HTML copied to clipboard!");
        }} className="flex items-center px-3 py-2 bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy rendered HTML" data-unique-id="77dc389a-e937-4e7b-8e7a-79f9aa8b340f" data-file-name="components/template-editor.tsx">
            <Copy className="h-4 w-4" />
          </button>
          <button onClick={() => downloadTemplate(template)} className="flex items-center px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" title="Download as JSON" data-unique-id="9da98364-bee8-4fe2-b84e-b7e3339ac480" data-file-name="components/template-editor.tsx">
            <Download className="h-4 w-4" />
          </button>
          <button onClick={saveTemplate} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="b0d6da85-0f41-4fe7-a4f4-244a24498124" data-file-name="components/template-editor.tsx" data-dynamic-text="true">
            <Save className="mr-2 h-4 w-4" />
            {isSaved ? "Saved!" : "Save Template"}
          </button>
        </div>
      </div>
      
      <div className="space-y-5" data-unique-id="70e6426f-fa6f-4915-a89f-838d88dfe2a0" data-file-name="components/template-editor.tsx">
        <div data-unique-id="8040ca97-8a2a-46b9-abea-bd083ec1d147" data-file-name="components/template-editor.tsx">
          <label htmlFor="templateName" className="block text-sm font-medium mb-1" data-unique-id="29495485-b22c-4018-a19f-29cd565fc37a" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="31542add-cece-44c0-90bf-e8c3e40f0d9b" data-file-name="components/template-editor.tsx">
            Template Name
          </span></label>
          <input id="templateName" type="text" value={template.name} onChange={e => handleChange("name", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="5c3e4364-64b5-44de-976b-5f9d8ef07d11" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="1693ed7e-bb4c-40e2-a37a-6bdab491b2da" data-file-name="components/template-editor.tsx">
          <label htmlFor="subject" className="block text-sm font-medium mb-1" data-unique-id="f1965002-fcb0-4ac8-8a9e-b3fc71b9c279" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="8ae0f76a-e6ca-4224-8856-a6e69a04668e" data-file-name="components/template-editor.tsx">
            Email Subject
          </span></label>
          <input id="subject" type="text" value={template.subject} onChange={e => handleChange("subject", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="3a9cf312-8398-4c49-a58b-0a253f9d6d12" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="8b2be1d6-8bb8-4156-a8aa-4a889304e3e7" data-file-name="components/template-editor.tsx">
          <label htmlFor="preheader" className="block text-sm font-medium mb-1" data-unique-id="3b6f8b0b-dae1-4700-b927-cbd589a08496" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="3828022e-bfb2-44eb-b248-7a497b0735e1" data-file-name="components/template-editor.tsx">
            Preheader Text
          </span></label>
          <input id="preheader" type="text" value={template.preheader} onChange={e => handleChange("preheader", e.target.value)} placeholder="Brief text that appears in email clients" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="284fa531-0d57-4e33-9248-166535642d4f" data-file-name="components/template-editor.tsx" />
          <p className="text-xs text-muted-foreground mt-1" data-unique-id="1ec84671-d61a-47db-99fe-e43e0fb31fdb" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="bbe34fad-b420-4541-a522-d4cd2edaba3e" data-file-name="components/template-editor.tsx">
            This text will show up in email clients as a preview
          </span></p>
        </div>
        
        <div data-unique-id="b3186913-36f8-4bb7-bf6e-d64d9f134156" data-file-name="components/template-editor.tsx">
          <label htmlFor="emailContent" className="block text-sm font-medium mb-1" data-unique-id="2028fb0d-31b1-4b6e-a934-f9f2b463ab79" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="ce717370-d2f5-4504-9aa8-35727d697e2c" data-file-name="components/template-editor.tsx">
            Email Content
          </span></label>
          <textarea id="emailContent" rows={12} value={template.content} onChange={e => handleChange("content", e.target.value)} className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y font-mono text-sm" data-unique-id="7b36a16d-b5b1-44da-9bad-202402e381d3" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div className="bg-accent/20 p-4 rounded-md" data-unique-id="49455372-0e95-405a-bc52-e2940b4e8213" data-file-name="components/template-editor.tsx">
          <h3 className="flex items-center text-sm font-medium mb-2" data-unique-id="c3b36371-543e-45b0-9795-1df4ca816488" data-file-name="components/template-editor.tsx">
            <AlertCircle className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="13c90cf3-f503-4d83-8789-7f631e3b6a77" data-file-name="components/template-editor.tsx">
            Available Variables
          </span></h3>
          <ul className="grid grid-cols-2 gap-2 text-sm" data-unique-id="90a60c22-ef9a-4b7f-bd24-8477780c58bb" data-file-name="components/template-editor.tsx">
            <li className="font-mono" data-unique-id="1758b70c-6266-4c21-88af-25285b499998" data-file-name="components/template-editor.tsx">{"{{customerName}}"}</li>
            <li className="font-mono" data-unique-id="45b02588-de79-43f9-b3e6-fa27d9b76a9e" data-file-name="components/template-editor.tsx">{"{{orderNumber}}"}</li>
            <li className="font-mono" data-unique-id="56d191e4-fa22-4f7f-90ed-832100392c15" data-file-name="components/template-editor.tsx">{"{{trackingNumber}}"}</li>
            <li className="font-mono" data-unique-id="14dda1bd-8b37-49f0-bb34-a8b06f48251f" data-file-name="components/template-editor.tsx">{"{{address}}"}</li>
            <li className="font-mono" data-unique-id="b73c07b5-48e6-4d38-b06f-18196611cc65" data-file-name="components/template-editor.tsx">{"{{orderDate}}"}</li>
            <li className="font-mono" data-unique-id="0b692a18-f019-4dc3-a7b5-6402ce4324ac" data-file-name="components/template-editor.tsx">{"{{items}}"}</li>
            <li className="font-mono" data-unique-id="3758ba06-8321-4c20-8c84-9457c7eda7b2" data-file-name="components/template-editor.tsx">{"{{orderTotal}}"}</li>
          </ul>
        </div>
      </div>
    </motion.div>;
}