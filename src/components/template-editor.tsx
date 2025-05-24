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

    // Reset saved status after 2 seconds
    setTimeout(() => setIsSaved(false), 2000);
  };
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} transition={{
    duration: 0.3
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="72f78ca6-fa40-491b-9cf0-4e799a83bfa3" data-file-name="components/template-editor.tsx">
      <div className="flex justify-between items-center mb-6" data-unique-id="a9896a11-8ea0-455e-a129-00741dbf819e" data-file-name="components/template-editor.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="bb171b14-1d07-420c-b46f-a9a5148d880e" data-file-name="components/template-editor.tsx">
          <Edit className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="67b6db4d-5a58-426d-ba67-837da5a1575b" data-file-name="components/template-editor.tsx"> Template Editor
        </span></h2>
        <div className="flex space-x-2" data-unique-id="2c65b9ed-0921-4650-b612-6b508f0bb220" data-file-name="components/template-editor.tsx">
          <button onClick={() => {
          const html = generateHtmlEmail(template);
          copyToClipboard(html);
          alert("HTML copied to clipboard!");
        }} className="flex items-center px-3 py-2 bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy rendered HTML" data-unique-id="0c21f9ad-cfe9-43ef-9765-7a448d307515" data-file-name="components/template-editor.tsx">
            <Copy className="h-4 w-4" />
          </button>
          <button onClick={() => downloadTemplate(template)} className="flex items-center px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" title="Download as JSON" data-unique-id="8b46d29b-8926-4697-84e4-b5a1600ef1c8" data-file-name="components/template-editor.tsx">
            <Download className="h-4 w-4" />
          </button>
          <button onClick={saveTemplate} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="d0b3e716-f19f-49ce-b113-75c44b7aae45" data-file-name="components/template-editor.tsx" data-dynamic-text="true">
            <Save className="mr-2 h-4 w-4" />
            {isSaved ? "Saved!" : "Save Template"}
          </button>
        </div>
      </div>
      
      <div className="space-y-5" data-unique-id="2e0dea99-ae28-4ddf-b434-235ff839307d" data-file-name="components/template-editor.tsx">
        <div data-unique-id="423cf022-af48-462c-bb61-a6157ca4b948" data-file-name="components/template-editor.tsx">
          <label htmlFor="templateName" className="block text-sm font-medium mb-1" data-unique-id="bdebfbc3-cf8a-4bbc-9f4d-e3927275d794" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="9177b19c-7c23-4106-92f4-f40ea08c7aa9" data-file-name="components/template-editor.tsx">
            Template Name
          </span></label>
          <input id="templateName" type="text" value={template.name} onChange={e => handleChange("name", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="0a360161-3a81-4ba1-a6b5-36af822f9e39" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="b28be240-5f16-49dd-ad23-35df9a15cc48" data-file-name="components/template-editor.tsx">
          <label htmlFor="subject" className="block text-sm font-medium mb-1" data-unique-id="a36e9e69-25c9-44cb-90cc-c050f61c9fd5" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="a706a9fd-17d2-4e8c-ba0d-8a0b99d2c3ff" data-file-name="components/template-editor.tsx">
            Email Subject
          </span></label>
          <input id="subject" type="text" value={template.subject} onChange={e => handleChange("subject", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="3d4976a6-8227-4f44-bc88-89486cd1d223" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="5cc40cd5-839c-40a6-b81b-2f58a71e2e7e" data-file-name="components/template-editor.tsx">
          <label htmlFor="preheader" className="block text-sm font-medium mb-1" data-unique-id="59e76b03-1a22-4c07-92e4-3676b1eaa668" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="e21ac3ad-25a8-4f19-8b0d-be078d7e1ce3" data-file-name="components/template-editor.tsx">
            Preheader Text
          </span></label>
          <input id="preheader" type="text" value={template.preheader} onChange={e => handleChange("preheader", e.target.value)} placeholder="Brief text that appears in email clients" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="fa1e8d3c-74ce-44d4-ba0a-27b3a533a3bb" data-file-name="components/template-editor.tsx" />
          <p className="text-xs text-muted-foreground mt-1" data-unique-id="590f0983-ae0f-4434-b607-74731029cc5a" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="c2d134a4-4431-48e2-8656-003188d161ee" data-file-name="components/template-editor.tsx">
            This text will show up in email clients as a preview
          </span></p>
        </div>
        
        <div data-unique-id="65f6cf13-267f-4c88-926e-5ecd39ac8249" data-file-name="components/template-editor.tsx">
          <label htmlFor="emailContent" className="block text-sm font-medium mb-1" data-unique-id="884ce129-7ad0-4cda-90a8-992f1d522324" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="95fb7332-84f1-4e4e-82a2-72c9e7a5fee1" data-file-name="components/template-editor.tsx">
            Email Content
          </span></label>
          <textarea id="emailContent" rows={12} value={template.content} onChange={e => handleChange("content", e.target.value)} className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-y font-mono text-sm" data-unique-id="e4b7a843-9814-4c12-a41c-1e0b20f4f4a8" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div className="bg-accent/20 p-4 rounded-md" data-unique-id="933742a5-6712-42ee-bb4f-91ed79dffdd5" data-file-name="components/template-editor.tsx">
          <h3 className="flex items-center text-sm font-medium mb-2" data-unique-id="9bf6d9f6-d857-4ac3-b13a-c2ab556e97c5" data-file-name="components/template-editor.tsx">
            <AlertCircle className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="4eaca831-27dd-4380-b320-021aa54c6cac" data-file-name="components/template-editor.tsx">
            Available Variables
          </span></h3>
          <ul className="grid grid-cols-2 gap-2 text-sm" data-unique-id="57dbd753-cb5d-44c5-be21-83673f7620d5" data-file-name="components/template-editor.tsx">
            <li className="font-mono" data-unique-id="361b77b4-aea5-42e6-bb18-e05734345f9a" data-file-name="components/template-editor.tsx">{"{{customerName}}"}</li>
            <li className="font-mono" data-unique-id="1f772eb1-27fb-455c-8f91-d0695c14ac94" data-file-name="components/template-editor.tsx">{"{{orderNumber}}"}</li>
            <li className="font-mono" data-unique-id="0b3e25a8-4590-4107-8f69-01bbc605628a" data-file-name="components/template-editor.tsx">{"{{trackingNumber}}"}</li>
            <li className="font-mono" data-unique-id="a74927fe-3517-40fd-bc8e-1c4efd30acab" data-file-name="components/template-editor.tsx">{"{{address}}"}</li>
            <li className="font-mono" data-unique-id="eadf8373-2bf2-4fac-aea1-b157fd177e75" data-file-name="components/template-editor.tsx">{"{{orderDate}}"}</li>
            <li className="font-mono" data-unique-id="3dc1f9d9-a652-4a4b-99bc-3ae2d196c0f2" data-file-name="components/template-editor.tsx">{"{{items}}"}</li>
          </ul>
        </div>
      </div>
    </motion.div>;
}