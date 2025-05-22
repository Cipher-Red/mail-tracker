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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="29977c17-f8b5-4d41-bc43-9d8de722afba" data-file-name="components/template-editor.tsx">
      <div className="flex justify-between items-center mb-6" data-unique-id="9ec69f92-d045-4417-ad9f-5b547f9343dd" data-file-name="components/template-editor.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="1e532e4f-4268-4838-afe9-0176b6ae0f83" data-file-name="components/template-editor.tsx">
          <Edit className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="cc93ae47-f8c8-447c-8f21-e7dbdadb88a2" data-file-name="components/template-editor.tsx"> Template Editor
        </span></h2>
        <div className="flex space-x-2" data-unique-id="67a82bec-a235-4848-9757-4c5e90f88e27" data-file-name="components/template-editor.tsx">
          <button onClick={() => {
          const html = generateHtmlEmail(template);
          copyToClipboard(html);
          alert("HTML copied to clipboard!");
        }} className="flex items-center px-3 py-2 bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy rendered HTML" data-unique-id="1ffa03ff-c16d-4666-9acd-d0982c321a22" data-file-name="components/template-editor.tsx">
            <Copy className="h-4 w-4" />
          </button>
          <button onClick={() => downloadTemplate(template)} className="flex items-center px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" title="Download as JSON" data-unique-id="52f79b27-e3ef-4258-b3bf-6128cdcc062e" data-file-name="components/template-editor.tsx">
            <Download className="h-4 w-4" />
          </button>
          <button onClick={saveTemplate} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="c39685a2-6766-45d3-b509-cbc9b0ba999a" data-file-name="components/template-editor.tsx" data-dynamic-text="true">
            <Save className="mr-2 h-4 w-4" />
            {isSaved ? "Saved!" : "Save Template"}
          </button>
        </div>
      </div>
      
      <div className="space-y-5" data-unique-id="670a5f0c-4678-467e-ac7d-012ac2ca477a" data-file-name="components/template-editor.tsx">
        <div data-unique-id="2ebc6e14-24c8-46f9-a501-d19eef35fecc" data-file-name="components/template-editor.tsx">
          <label htmlFor="templateName" className="block text-sm font-medium mb-1" data-unique-id="1c558caa-14e3-4a0b-9847-f4bc22cc8203" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="4665863d-62fd-4588-add7-d9e6fbb2a239" data-file-name="components/template-editor.tsx">
            Template Name
          </span></label>
          <input id="templateName" type="text" value={template.name} onChange={e => handleChange("name", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="b29a7910-c2e9-4fe4-ba9c-a648459ee2ae" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="fcde4dc8-6eb9-414d-ae68-72f8c714a785" data-file-name="components/template-editor.tsx">
          <label htmlFor="subject" className="block text-sm font-medium mb-1" data-unique-id="6c00d0bc-8c8b-488b-9890-feb3c3364f40" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="811e68ee-1fcd-4f13-97d0-aff66da93f4b" data-file-name="components/template-editor.tsx">
            Email Subject
          </span></label>
          <input id="subject" type="text" value={template.subject} onChange={e => handleChange("subject", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="cef61f0e-1ef2-4dc6-8b28-2f6a8a27bb82" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="bd9edae0-e171-41f1-8fe3-ea33a747b4e8" data-file-name="components/template-editor.tsx">
          <label htmlFor="preheader" className="block text-sm font-medium mb-1" data-unique-id="c47a430d-17e1-4a42-881f-aa43936bf1b0" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="bcde2b06-72d9-43af-8ca4-f93e8f6eebfe" data-file-name="components/template-editor.tsx">
            Preheader Text
          </span></label>
          <input id="preheader" type="text" value={template.preheader} onChange={e => handleChange("preheader", e.target.value)} placeholder="Brief text that appears in email clients" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="0548ace6-7a6c-41da-921e-acbb1f673c03" data-file-name="components/template-editor.tsx" />
          <p className="text-xs text-muted-foreground mt-1" data-unique-id="b56d0359-ca0e-4325-8038-888c3c6b3e3c" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="6d8b4099-88b1-4a81-aaa6-f4b6744cd040" data-file-name="components/template-editor.tsx">
            This text will show up in email clients as a preview
          </span></p>
        </div>
        
        <div data-unique-id="3b071fb5-e279-4fcf-878a-1dbb53f45b1d" data-file-name="components/template-editor.tsx">
          <label htmlFor="emailContent" className="block text-sm font-medium mb-1" data-unique-id="0579b361-e6ca-494e-998a-7e5d97349ed7" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="540d7b53-ab77-4755-a6e5-d02b73331c77" data-file-name="components/template-editor.tsx">
            Email Content
          </span></label>
          <textarea id="emailContent" rows={12} value={template.content} onChange={e => handleChange("content", e.target.value)} className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-y font-mono text-sm" data-unique-id="b9876bf6-6be6-4e74-bcdb-1060929f6c46" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div className="bg-accent/20 p-4 rounded-md" data-unique-id="ba82339c-9f79-4e78-8313-5ae076300b5e" data-file-name="components/template-editor.tsx">
          <h3 className="flex items-center text-sm font-medium mb-2" data-unique-id="c180d37a-ad24-45fa-8206-66234a9f46dd" data-file-name="components/template-editor.tsx">
            <AlertCircle className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="b9bfe88d-4f6a-42ae-b99a-90fae25d87b2" data-file-name="components/template-editor.tsx">
            Available Variables
          </span></h3>
          <ul className="grid grid-cols-2 gap-2 text-sm" data-unique-id="e428e993-6123-4afe-89a4-3069392d4688" data-file-name="components/template-editor.tsx">
            <li className="font-mono" data-unique-id="908a8b77-6bd7-4468-bcb4-1dc188462557" data-file-name="components/template-editor.tsx">{"{{customerName}}"}</li>
            <li className="font-mono" data-unique-id="f71f2ac7-ca78-421e-b9d1-f48c432b384a" data-file-name="components/template-editor.tsx">{"{{orderNumber}}"}</li>
            <li className="font-mono" data-unique-id="b231ba6e-0b38-4931-8c0c-429876f20e25" data-file-name="components/template-editor.tsx">{"{{trackingNumber}}"}</li>
            <li className="font-mono" data-unique-id="3e0d83b1-5120-4e67-97be-e0bfe4d98971" data-file-name="components/template-editor.tsx">{"{{address}}"}</li>
            <li className="font-mono" data-unique-id="22cd921a-d87a-4523-9a34-b9052a8feb93" data-file-name="components/template-editor.tsx">{"{{orderDate}}"}</li>
            <li className="font-mono" data-unique-id="d09fcbc4-d1ef-4b72-9f19-4c1398d8ecdf" data-file-name="components/template-editor.tsx">{"{{items}}"}</li>
          </ul>
        </div>
      </div>
    </motion.div>;
}