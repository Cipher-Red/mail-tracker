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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="75af67f9-d24f-4fd7-9f3d-d5ca33827ec1" data-file-name="components/template-editor.tsx">
      <div className="flex justify-between items-center mb-6" data-unique-id="88ec74ae-8131-4da8-8d7b-3aa38621918c" data-file-name="components/template-editor.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="e7d548c2-274e-4e15-a304-a83ce96868b9" data-file-name="components/template-editor.tsx">
          <Edit className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="e9f9a857-45f8-4211-96fa-069a1c87e8d1" data-file-name="components/template-editor.tsx"> Template Editor
        </span></h2>
        <div className="flex space-x-2" data-unique-id="555e0686-8eff-4a2e-82d1-45dd1c326fff" data-file-name="components/template-editor.tsx">
          <button onClick={() => {
          const html = generateHtmlEmail(template);
          copyToClipboard(html);
          alert("HTML copied to clipboard!");
        }} className="flex items-center px-3 py-2 bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy rendered HTML" data-unique-id="2c1e327d-0ebf-46a1-86f6-a69a64b5efe7" data-file-name="components/template-editor.tsx">
            <Copy className="h-4 w-4" />
          </button>
          <button onClick={() => downloadTemplate(template)} className="flex items-center px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" title="Download as JSON" data-unique-id="85630ace-6339-493b-b071-c0216fc7912e" data-file-name="components/template-editor.tsx">
            <Download className="h-4 w-4" />
          </button>
          <button onClick={saveTemplate} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="1e190563-b906-415e-acc5-54acb3396e01" data-file-name="components/template-editor.tsx" data-dynamic-text="true">
            <Save className="mr-2 h-4 w-4" />
            {isSaved ? "Saved!" : "Save Template"}
          </button>
        </div>
      </div>
      
      <div className="space-y-5" data-unique-id="d7a55882-5fb9-41d5-be7b-5862c53e19b9" data-file-name="components/template-editor.tsx">
        <div data-unique-id="38a0c982-1846-4fc9-830c-0372ad6add9a" data-file-name="components/template-editor.tsx">
          <label htmlFor="templateName" className="block text-sm font-medium mb-1" data-unique-id="c30f03ae-dd07-438a-8f48-dc654e884448" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="30c31304-63c8-4885-ba5d-70e01a3f66cf" data-file-name="components/template-editor.tsx">
            Template Name
          </span></label>
          <input id="templateName" type="text" value={template.name} onChange={e => handleChange("name", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="9f139d48-95ee-4a30-9f4e-d58dc8eafb72" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="5115c09f-fa0b-4be5-8556-e51e9140e7f4" data-file-name="components/template-editor.tsx">
          <label htmlFor="subject" className="block text-sm font-medium mb-1" data-unique-id="9b178dfd-ccfe-43ee-97c8-2e005e24a521" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="da0a14d0-c18c-4359-8541-829b9d88fc3d" data-file-name="components/template-editor.tsx">
            Email Subject
          </span></label>
          <input id="subject" type="text" value={template.subject} onChange={e => handleChange("subject", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="5dc1a6c8-9f40-4539-b763-8613d1334da7" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="98f09c30-8964-44da-b939-1c8e3611c5dc" data-file-name="components/template-editor.tsx">
          <label htmlFor="preheader" className="block text-sm font-medium mb-1" data-unique-id="b38d0b6b-7c67-4eb4-9740-3efbaaddf115" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="5fdcc54a-348a-4d76-8aba-37f85f893784" data-file-name="components/template-editor.tsx">
            Preheader Text
          </span></label>
          <input id="preheader" type="text" value={template.preheader} onChange={e => handleChange("preheader", e.target.value)} placeholder="Brief text that appears in email clients" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="ffba7160-7539-46b4-84eb-aa109ba4f025" data-file-name="components/template-editor.tsx" />
          <p className="text-xs text-muted-foreground mt-1" data-unique-id="223d1954-d4a0-446c-825e-7337bfa3419d" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="5ed67849-f8e1-40b1-947e-e65b2e64863f" data-file-name="components/template-editor.tsx">
            This text will show up in email clients as a preview
          </span></p>
        </div>
        
        <div data-unique-id="28c5f7c3-e017-427e-bc5e-47ac500dc67c" data-file-name="components/template-editor.tsx">
          <label htmlFor="emailContent" className="block text-sm font-medium mb-1" data-unique-id="d6560760-ed1a-4a52-bdf1-bdc5435f3608" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="b15651f6-358e-4388-93cd-a8024d5e5ca7" data-file-name="components/template-editor.tsx">
            Email Content
          </span></label>
          <textarea id="emailContent" rows={12} value={template.content} onChange={e => handleChange("content", e.target.value)} className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-y font-mono text-sm" data-unique-id="1823e3ce-1906-4db8-bff3-d0eed61ec5fd" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div className="bg-accent/20 p-4 rounded-md" data-unique-id="4587fc5d-8239-48ed-b2c8-6e6c78c519cd" data-file-name="components/template-editor.tsx">
          <h3 className="flex items-center text-sm font-medium mb-2" data-unique-id="2c1b2db9-2897-4b89-af24-c6627450131f" data-file-name="components/template-editor.tsx">
            <AlertCircle className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="e4f5a9c9-eac3-453b-9ebb-8d569a22d459" data-file-name="components/template-editor.tsx">
            Available Variables
          </span></h3>
          <ul className="grid grid-cols-2 gap-2 text-sm" data-unique-id="2b96859c-18f7-4015-808c-1f158beeb157" data-file-name="components/template-editor.tsx">
            <li className="font-mono" data-unique-id="abb12570-d7f6-41a3-9bad-4e3478cea050" data-file-name="components/template-editor.tsx">{"{{customerName}}"}</li>
            <li className="font-mono" data-unique-id="1ea5ecb2-4594-478b-b526-bed72212cc4a" data-file-name="components/template-editor.tsx">{"{{orderNumber}}"}</li>
            <li className="font-mono" data-unique-id="d5e106c9-b1ff-4598-b2ca-7db6071b13c0" data-file-name="components/template-editor.tsx">{"{{trackingNumber}}"}</li>
            <li className="font-mono" data-unique-id="0c61ccbf-8236-4847-ac03-a3ab64e462f3" data-file-name="components/template-editor.tsx">{"{{address}}"}</li>
            <li className="font-mono" data-unique-id="899adaad-6f86-4901-b997-f0789ffa9ff4" data-file-name="components/template-editor.tsx">{"{{orderDate}}"}</li>
            <li className="font-mono" data-unique-id="a28e6caa-01a8-471d-bec2-4950c06efe49" data-file-name="components/template-editor.tsx">{"{{items}}"}</li>
          </ul>
        </div>
      </div>
    </motion.div>;
}