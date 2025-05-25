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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="4ddf034f-79ca-4d5c-9052-310bed8cc26d" data-file-name="components/template-editor.tsx">
      <div className="flex justify-between items-center mb-6" data-unique-id="fd5721b4-e282-4aa1-875f-4f56c4bf9c27" data-file-name="components/template-editor.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="694d7fb5-525f-4847-af75-d62c08e1d79d" data-file-name="components/template-editor.tsx">
          <Edit className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="b29e4cd3-5394-4fc9-9c87-da15e604f77d" data-file-name="components/template-editor.tsx"> Template Editor
        </span></h2>
        <div className="flex space-x-2" data-unique-id="6c62ef29-e5c4-4da0-b7e7-d634d05a40d6" data-file-name="components/template-editor.tsx">
          <button onClick={() => {
          const html = generateHtmlEmail(template);
          copyToClipboard(html);
          alert("HTML copied to clipboard!");
        }} className="flex items-center px-3 py-2 bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy rendered HTML" data-unique-id="f87955d9-4d72-4800-b246-9a2bf81028d4" data-file-name="components/template-editor.tsx">
            <Copy className="h-4 w-4" />
          </button>
          <button onClick={() => downloadTemplate(template)} className="flex items-center px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" title="Download as JSON" data-unique-id="825f0e1b-b970-497d-be7a-132753f37470" data-file-name="components/template-editor.tsx">
            <Download className="h-4 w-4" />
          </button>
          <button onClick={saveTemplate} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="284880c7-e01b-4e4e-8c7f-a856e4f0f32b" data-file-name="components/template-editor.tsx" data-dynamic-text="true">
            <Save className="mr-2 h-4 w-4" />
            {isSaved ? "Saved!" : "Save Template"}
          </button>
        </div>
      </div>
      
      <div className="space-y-5" data-unique-id="5fac492b-46d8-4772-ac36-bc444f5a19cd" data-file-name="components/template-editor.tsx">
        <div data-unique-id="38321f23-084c-43fe-b671-445198bbcdec" data-file-name="components/template-editor.tsx">
          <label htmlFor="templateName" className="block text-sm font-medium mb-1" data-unique-id="95574633-2419-4cf1-ad91-7044d000a5b5" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="ec6a473f-3803-4ad7-91ff-8274bd4e33ed" data-file-name="components/template-editor.tsx">
            Template Name
          </span></label>
          <input id="templateName" type="text" value={template.name} onChange={e => handleChange("name", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="7496a777-ec1e-409c-a07b-20fa549675cf" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="a3320996-c0d0-4364-a715-12dba85f88dd" data-file-name="components/template-editor.tsx">
          <label htmlFor="subject" className="block text-sm font-medium mb-1" data-unique-id="7e03c016-abc0-4aae-9a82-a29cd1e149d6" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="e9c0f1e8-f1c0-42e3-bd14-b166b2c7df86" data-file-name="components/template-editor.tsx">
            Email Subject
          </span></label>
          <input id="subject" type="text" value={template.subject} onChange={e => handleChange("subject", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="76404d15-6f39-47f6-89c3-9b1fe55301da" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="2e02c800-7fdf-4395-b5be-8669716ea86f" data-file-name="components/template-editor.tsx">
          <label htmlFor="preheader" className="block text-sm font-medium mb-1" data-unique-id="67f7de71-316f-4624-a64e-489593d7b1ee" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="dc1e80b8-54fa-4904-b819-865cc5465c83" data-file-name="components/template-editor.tsx">
            Preheader Text
          </span></label>
          <input id="preheader" type="text" value={template.preheader} onChange={e => handleChange("preheader", e.target.value)} placeholder="Brief text that appears in email clients" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="425e314f-93cf-4e2c-8911-369d48980b48" data-file-name="components/template-editor.tsx" />
          <p className="text-xs text-muted-foreground mt-1" data-unique-id="bdce9159-0908-4870-a838-6123e6d790a4" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="1aedf2b6-d6ed-42a9-9d31-83a942681b7b" data-file-name="components/template-editor.tsx">
            This text will show up in email clients as a preview
          </span></p>
        </div>
        
        <div data-unique-id="a744d392-a1d6-4890-bada-d7e3f35fe823" data-file-name="components/template-editor.tsx">
          <label htmlFor="emailContent" className="block text-sm font-medium mb-1" data-unique-id="e39422f1-50aa-4631-b6cf-b00cc3f2b26b" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="a196cfe6-138d-4b9e-b5dd-71ad6b35660d" data-file-name="components/template-editor.tsx">
            Email Content
          </span></label>
          <textarea id="emailContent" rows={12} value={template.content} onChange={e => handleChange("content", e.target.value)} className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-y font-mono text-sm" data-unique-id="89f80936-549d-4c86-a74a-a84941665aff" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div className="bg-accent/20 p-4 rounded-md" data-unique-id="fb9ac334-893b-47d2-a248-4fc043580616" data-file-name="components/template-editor.tsx">
          <h3 className="flex items-center text-sm font-medium mb-2" data-unique-id="32a468c7-5845-4fc8-af7b-9ff8ad0bff6d" data-file-name="components/template-editor.tsx">
            <AlertCircle className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="cd0d1432-ae49-4793-8086-2bd14aa2fc2e" data-file-name="components/template-editor.tsx">
            Available Variables
          </span></h3>
          <ul className="grid grid-cols-2 gap-2 text-sm" data-unique-id="ea3ae121-3356-41a4-9036-2ce69dc69d26" data-file-name="components/template-editor.tsx">
            <li className="font-mono" data-unique-id="5c1919f5-b435-470e-8fa6-df7e92c90dcb" data-file-name="components/template-editor.tsx">{"{{customerName}}"}</li>
            <li className="font-mono" data-unique-id="f11abbca-52e8-4154-9142-74c7fcf4ea4b" data-file-name="components/template-editor.tsx">{"{{orderNumber}}"}</li>
            <li className="font-mono" data-unique-id="f0417443-3203-44ee-95df-0f0cf1fe1754" data-file-name="components/template-editor.tsx">{"{{trackingNumber}}"}</li>
            <li className="font-mono" data-unique-id="9a9ba108-977b-4045-88a6-258c6e192ce0" data-file-name="components/template-editor.tsx">{"{{address}}"}</li>
            <li className="font-mono" data-unique-id="42dac0a0-fc56-4087-a7b5-7e2e0cddd6d6" data-file-name="components/template-editor.tsx">{"{{orderDate}}"}</li>
            <li className="font-mono" data-unique-id="90733a8d-ff6b-40e0-870e-7efade8fc746" data-file-name="components/template-editor.tsx">{"{{items}}"}</li>
          </ul>
        </div>
      </div>
    </motion.div>;
}