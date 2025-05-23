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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="354295cc-8912-4f89-bde0-eff755dec3dc" data-file-name="components/template-editor.tsx">
      <div className="flex justify-between items-center mb-6" data-unique-id="3324845b-e2e6-46f6-b6bf-f02a32bc750b" data-file-name="components/template-editor.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="cd57b7b2-1bb8-4eb7-b33c-074c29691292" data-file-name="components/template-editor.tsx">
          <Edit className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="95f83586-f039-4cf3-a100-bb7ca84647e2" data-file-name="components/template-editor.tsx"> Template Editor
        </span></h2>
        <div className="flex space-x-2" data-unique-id="4e70c4cc-c773-4ed5-90fe-be24ab11d548" data-file-name="components/template-editor.tsx">
          <button onClick={() => {
          const html = generateHtmlEmail(template);
          copyToClipboard(html);
          alert("HTML copied to clipboard!");
        }} className="flex items-center px-3 py-2 bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy rendered HTML" data-unique-id="4b720255-cb2f-426b-810f-ddcb869b060b" data-file-name="components/template-editor.tsx">
            <Copy className="h-4 w-4" />
          </button>
          <button onClick={() => downloadTemplate(template)} className="flex items-center px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" title="Download as JSON" data-unique-id="68f8cb6a-e7d1-4bcb-972a-8f6f9f84927e" data-file-name="components/template-editor.tsx">
            <Download className="h-4 w-4" />
          </button>
          <button onClick={saveTemplate} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="b3fc1ca1-e6e2-4486-a681-940c253d0dd9" data-file-name="components/template-editor.tsx" data-dynamic-text="true">
            <Save className="mr-2 h-4 w-4" />
            {isSaved ? "Saved!" : "Save Template"}
          </button>
        </div>
      </div>
      
      <div className="space-y-5" data-unique-id="27183c27-0cf9-4809-bf1f-5b62eefa2617" data-file-name="components/template-editor.tsx">
        <div data-unique-id="73d622ef-5f87-4935-8f8f-e3bcc99bf9e2" data-file-name="components/template-editor.tsx">
          <label htmlFor="templateName" className="block text-sm font-medium mb-1" data-unique-id="fee08bac-4b9e-4d0e-a7d1-df320a15e05e" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="e020d992-0b44-40f3-b6ce-d8235aafd0b0" data-file-name="components/template-editor.tsx">
            Template Name
          </span></label>
          <input id="templateName" type="text" value={template.name} onChange={e => handleChange("name", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="04c04fbf-9db8-4902-a9bc-4c364a542e79" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="1097a2e0-a235-4624-bcd2-f46aa40ae7c4" data-file-name="components/template-editor.tsx">
          <label htmlFor="subject" className="block text-sm font-medium mb-1" data-unique-id="1fa6735c-a89c-4be6-9f67-7c0e4ae3b0c1" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="a0cf49e7-3974-42ea-84a4-558a1d14c041" data-file-name="components/template-editor.tsx">
            Email Subject
          </span></label>
          <input id="subject" type="text" value={template.subject} onChange={e => handleChange("subject", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="ae657aed-c756-40de-80ce-a79233a1bc70" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="d5f8ffd1-270e-4b5f-ad94-74ff34e43565" data-file-name="components/template-editor.tsx">
          <label htmlFor="preheader" className="block text-sm font-medium mb-1" data-unique-id="a0f66a83-cd57-4fa0-8e77-b9295482b222" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="26ff72c2-0eb0-47d1-8dd1-b0993abf3d4e" data-file-name="components/template-editor.tsx">
            Preheader Text
          </span></label>
          <input id="preheader" type="text" value={template.preheader} onChange={e => handleChange("preheader", e.target.value)} placeholder="Brief text that appears in email clients" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="02f941c8-6bae-4d69-9158-e149db6822d2" data-file-name="components/template-editor.tsx" />
          <p className="text-xs text-muted-foreground mt-1" data-unique-id="7655c832-5a72-4c78-800c-ab4603c62d74" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="3c2ceda9-3230-4840-b315-66e6193c305b" data-file-name="components/template-editor.tsx">
            This text will show up in email clients as a preview
          </span></p>
        </div>
        
        <div data-unique-id="aa78d71d-6102-4adb-a6b5-4b0096ad76af" data-file-name="components/template-editor.tsx">
          <label htmlFor="emailContent" className="block text-sm font-medium mb-1" data-unique-id="8907d466-798a-4de3-9563-b2a3b216bc5e" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="6adb67d3-4dd0-4ae7-85f3-5998c6bd4663" data-file-name="components/template-editor.tsx">
            Email Content
          </span></label>
          <textarea id="emailContent" rows={12} value={template.content} onChange={e => handleChange("content", e.target.value)} className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-y font-mono text-sm" data-unique-id="4db78753-fc7a-4d61-9905-dfd766904e2b" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div className="bg-accent/20 p-4 rounded-md" data-unique-id="605cd3b0-4176-4b39-8d35-1508379fb1b9" data-file-name="components/template-editor.tsx">
          <h3 className="flex items-center text-sm font-medium mb-2" data-unique-id="ecfd87cb-c8fb-40a1-8e93-c2eb5cfd9ab7" data-file-name="components/template-editor.tsx">
            <AlertCircle className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="4af5967e-4766-43d6-8acb-dd67c4d217a4" data-file-name="components/template-editor.tsx">
            Available Variables
          </span></h3>
          <ul className="grid grid-cols-2 gap-2 text-sm" data-unique-id="e891e3ea-97a1-4e37-a702-fa29b48e33b9" data-file-name="components/template-editor.tsx">
            <li className="font-mono" data-unique-id="a9b241d4-f239-4f96-9bbd-c8f0f32c8ee8" data-file-name="components/template-editor.tsx">{"{{customerName}}"}</li>
            <li className="font-mono" data-unique-id="663959c6-7f5c-4050-8ab7-521aca5a72d4" data-file-name="components/template-editor.tsx">{"{{orderNumber}}"}</li>
            <li className="font-mono" data-unique-id="2fa5ca3d-275c-483a-a75c-daf26ce885ba" data-file-name="components/template-editor.tsx">{"{{trackingNumber}}"}</li>
            <li className="font-mono" data-unique-id="8b86b0d0-b589-44bd-a4ef-5bb47e12b196" data-file-name="components/template-editor.tsx">{"{{address}}"}</li>
            <li className="font-mono" data-unique-id="831c00c0-25a5-42b8-99d2-1b02a2c51258" data-file-name="components/template-editor.tsx">{"{{orderDate}}"}</li>
            <li className="font-mono" data-unique-id="34c6934a-8b1f-4589-8599-93d084b516c1" data-file-name="components/template-editor.tsx">{"{{items}}"}</li>
          </ul>
        </div>
      </div>
    </motion.div>;
}