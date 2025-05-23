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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="0632657c-b0ea-4b00-b276-2e8161f07fdf" data-file-name="components/template-editor.tsx">
      <div className="flex justify-between items-center mb-6" data-unique-id="fb3aca8f-6208-42e9-b0d1-3121c09e499f" data-file-name="components/template-editor.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="1dfbbf00-e7a2-4e97-a22f-5bc946350fc0" data-file-name="components/template-editor.tsx">
          <Edit className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="1db10621-defe-44ca-b6cd-6d840a2248de" data-file-name="components/template-editor.tsx"> Template Editor
        </span></h2>
        <div className="flex space-x-2" data-unique-id="91062596-e906-4b51-a8e9-a592b01fc47b" data-file-name="components/template-editor.tsx">
          <button onClick={() => {
          const html = generateHtmlEmail(template);
          copyToClipboard(html);
          alert("HTML copied to clipboard!");
        }} className="flex items-center px-3 py-2 bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy rendered HTML" data-unique-id="83e86cc3-c305-4bbc-9600-75d5a552bc21" data-file-name="components/template-editor.tsx">
            <Copy className="h-4 w-4" />
          </button>
          <button onClick={() => downloadTemplate(template)} className="flex items-center px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" title="Download as JSON" data-unique-id="e322e7aa-6e4e-4277-a89c-f81a08f745ac" data-file-name="components/template-editor.tsx">
            <Download className="h-4 w-4" />
          </button>
          <button onClick={saveTemplate} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="910ca316-c45c-4c47-9dd3-5ca8cab81213" data-file-name="components/template-editor.tsx" data-dynamic-text="true">
            <Save className="mr-2 h-4 w-4" />
            {isSaved ? "Saved!" : "Save Template"}
          </button>
        </div>
      </div>
      
      <div className="space-y-5" data-unique-id="5d2d82e9-d3ec-43ea-a17d-723283a683c9" data-file-name="components/template-editor.tsx">
        <div data-unique-id="6da8701d-6bfd-458d-8966-c113f5272af6" data-file-name="components/template-editor.tsx">
          <label htmlFor="templateName" className="block text-sm font-medium mb-1" data-unique-id="4295b5b4-c9a8-4a8c-9882-1129c8e2634d" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="543c2822-9855-460d-8a7a-6ef3f0f6d742" data-file-name="components/template-editor.tsx">
            Template Name
          </span></label>
          <input id="templateName" type="text" value={template.name} onChange={e => handleChange("name", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="f77206d1-64fd-4bae-a8d6-13263a0720ea" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="9f616e5d-0f4e-40f6-b872-896b7b273d17" data-file-name="components/template-editor.tsx">
          <label htmlFor="subject" className="block text-sm font-medium mb-1" data-unique-id="91bd0bd8-3fae-4c33-b590-939f31fe46eb" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="0a1dcb8d-6b19-43d3-9554-13f386184f04" data-file-name="components/template-editor.tsx">
            Email Subject
          </span></label>
          <input id="subject" type="text" value={template.subject} onChange={e => handleChange("subject", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="913b4222-6b0b-4b35-b050-9964a118be35" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="cff2622d-886c-4690-8255-a83e99429f31" data-file-name="components/template-editor.tsx">
          <label htmlFor="preheader" className="block text-sm font-medium mb-1" data-unique-id="eb9af955-3b4a-41cf-89fd-6ae4fa38f8e7" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="760572e3-9969-4dc6-8440-879654303976" data-file-name="components/template-editor.tsx">
            Preheader Text
          </span></label>
          <input id="preheader" type="text" value={template.preheader} onChange={e => handleChange("preheader", e.target.value)} placeholder="Brief text that appears in email clients" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="58a869c3-657b-476f-9049-8e925de313d7" data-file-name="components/template-editor.tsx" />
          <p className="text-xs text-muted-foreground mt-1" data-unique-id="79fd820e-d985-4e34-b8a5-8241bc8495cd" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="cfb1cc58-9103-4251-8d16-218d8236add4" data-file-name="components/template-editor.tsx">
            This text will show up in email clients as a preview
          </span></p>
        </div>
        
        <div data-unique-id="e70f5e87-47e5-4d92-9dfb-c5f6a081ec7f" data-file-name="components/template-editor.tsx">
          <label htmlFor="emailContent" className="block text-sm font-medium mb-1" data-unique-id="2e47e8be-36f1-4996-b033-15bcd33627f2" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="5293ef07-00ee-4fea-9223-cff5bfbaea80" data-file-name="components/template-editor.tsx">
            Email Content
          </span></label>
          <textarea id="emailContent" rows={12} value={template.content} onChange={e => handleChange("content", e.target.value)} className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-y font-mono text-sm" data-unique-id="215b820e-4d42-4371-b859-406adae9e5cd" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div className="bg-accent/20 p-4 rounded-md" data-unique-id="7d78c8dc-9fd3-4fb4-95aa-1cdf070d6c12" data-file-name="components/template-editor.tsx">
          <h3 className="flex items-center text-sm font-medium mb-2" data-unique-id="0760f784-a52b-4939-ba37-04ae1580ff4b" data-file-name="components/template-editor.tsx">
            <AlertCircle className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="d9e1b54f-851f-4834-b08b-dfaae7ed30d5" data-file-name="components/template-editor.tsx">
            Available Variables
          </span></h3>
          <ul className="grid grid-cols-2 gap-2 text-sm" data-unique-id="d99aa8e9-1f54-4255-802e-9482c459b15c" data-file-name="components/template-editor.tsx">
            <li className="font-mono" data-unique-id="9717fe68-0c6f-4b1d-a1e2-4f70fb5bd144" data-file-name="components/template-editor.tsx">{"{{customerName}}"}</li>
            <li className="font-mono" data-unique-id="8c6e0ccb-a383-4759-a2e8-8cdbc3c5ab06" data-file-name="components/template-editor.tsx">{"{{orderNumber}}"}</li>
            <li className="font-mono" data-unique-id="9eb8fc61-b391-4f11-9d31-4a9b848fc940" data-file-name="components/template-editor.tsx">{"{{trackingNumber}}"}</li>
            <li className="font-mono" data-unique-id="1fec7097-5496-420c-b04c-f01cb7eac234" data-file-name="components/template-editor.tsx">{"{{address}}"}</li>
            <li className="font-mono" data-unique-id="ca2ead21-3a3a-402c-ba51-d5e0b14b3b70" data-file-name="components/template-editor.tsx">{"{{orderDate}}"}</li>
            <li className="font-mono" data-unique-id="82c95a1d-f63c-4038-8fe7-23e0fb8a8f59" data-file-name="components/template-editor.tsx">{"{{items}}"}</li>
          </ul>
        </div>
      </div>
    </motion.div>;
}