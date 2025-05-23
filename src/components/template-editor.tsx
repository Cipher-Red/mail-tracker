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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="e6df2aaf-f49f-4ce6-a7fb-7dab96ed0a58" data-file-name="components/template-editor.tsx">
      <div className="flex justify-between items-center mb-6" data-unique-id="d6108eab-9e00-4a9e-a687-918eda739ed2" data-file-name="components/template-editor.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="45496722-c718-4a30-b11a-749fbe140255" data-file-name="components/template-editor.tsx">
          <Edit className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="38e704df-40a3-4c00-82cb-9a0a1b6969b5" data-file-name="components/template-editor.tsx"> Template Editor
        </span></h2>
        <div className="flex space-x-2" data-unique-id="f7848ea3-9f57-4303-8a3c-3328de9f8ae2" data-file-name="components/template-editor.tsx">
          <button onClick={() => {
          const html = generateHtmlEmail(template);
          copyToClipboard(html);
          alert("HTML copied to clipboard!");
        }} className="flex items-center px-3 py-2 bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy rendered HTML" data-unique-id="90b599b5-8c03-4b78-9f58-db64b38e28d9" data-file-name="components/template-editor.tsx">
            <Copy className="h-4 w-4" />
          </button>
          <button onClick={() => downloadTemplate(template)} className="flex items-center px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" title="Download as JSON" data-unique-id="532be3e9-44cf-4b06-b6a2-21e241854937" data-file-name="components/template-editor.tsx">
            <Download className="h-4 w-4" />
          </button>
          <button onClick={saveTemplate} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="ab71fc75-d80b-4f07-bc1d-1babd33bd922" data-file-name="components/template-editor.tsx" data-dynamic-text="true">
            <Save className="mr-2 h-4 w-4" />
            {isSaved ? "Saved!" : "Save Template"}
          </button>
        </div>
      </div>
      
      <div className="space-y-5" data-unique-id="b24e0466-e734-4044-a818-e65781a5ec99" data-file-name="components/template-editor.tsx">
        <div data-unique-id="5079e1ab-afc3-47f6-af2a-ac2c89ebe0a5" data-file-name="components/template-editor.tsx">
          <label htmlFor="templateName" className="block text-sm font-medium mb-1" data-unique-id="41bf87ab-c60d-4a53-8b3c-9b29a9bf0950" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="18469122-c788-4bf5-af86-4dfad3ea0547" data-file-name="components/template-editor.tsx">
            Template Name
          </span></label>
          <input id="templateName" type="text" value={template.name} onChange={e => handleChange("name", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="c742a4f8-e8a5-4c2c-9fd4-3ac6dc4419cb" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="13fb6649-ffe5-4957-b7f2-ecd85720de77" data-file-name="components/template-editor.tsx">
          <label htmlFor="subject" className="block text-sm font-medium mb-1" data-unique-id="d75eb9d7-b685-48c1-b0ff-229614f3bd82" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="683e0a3f-e343-4099-9d32-2eb6e20e14dd" data-file-name="components/template-editor.tsx">
            Email Subject
          </span></label>
          <input id="subject" type="text" value={template.subject} onChange={e => handleChange("subject", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="7c231dd8-880b-4543-81bf-b5fa6ba5f9e2" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="e99b0a52-2366-4fb0-a2dd-f09ccb359b80" data-file-name="components/template-editor.tsx">
          <label htmlFor="preheader" className="block text-sm font-medium mb-1" data-unique-id="872bb460-ae4a-402a-bb7e-7f49d225ce3c" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="3f8925bd-42b1-49a1-9120-86a51acf7993" data-file-name="components/template-editor.tsx">
            Preheader Text
          </span></label>
          <input id="preheader" type="text" value={template.preheader} onChange={e => handleChange("preheader", e.target.value)} placeholder="Brief text that appears in email clients" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="eab5fd10-dc08-4148-bff9-b12e61018cbd" data-file-name="components/template-editor.tsx" />
          <p className="text-xs text-muted-foreground mt-1" data-unique-id="5e6685cc-72ed-46fc-a20b-ddbfd96116aa" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="0b754505-3418-4c8b-adc9-c51081d01dba" data-file-name="components/template-editor.tsx">
            This text will show up in email clients as a preview
          </span></p>
        </div>
        
        <div data-unique-id="202d39fa-9d1d-422b-8746-d65a40d3f9bc" data-file-name="components/template-editor.tsx">
          <label htmlFor="emailContent" className="block text-sm font-medium mb-1" data-unique-id="c76d257f-9d27-43bd-ba9d-276a369c066d" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="4ce70652-7ae4-49de-8a0a-d9849a049f5f" data-file-name="components/template-editor.tsx">
            Email Content
          </span></label>
          <textarea id="emailContent" rows={12} value={template.content} onChange={e => handleChange("content", e.target.value)} className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-y font-mono text-sm" data-unique-id="0af9670e-4426-4aa2-ad96-4ee50c878673" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div className="bg-accent/20 p-4 rounded-md" data-unique-id="5e0af70a-ef43-4e43-bbf1-138d8621b57c" data-file-name="components/template-editor.tsx">
          <h3 className="flex items-center text-sm font-medium mb-2" data-unique-id="9a60ba17-9c08-4d0b-b8b9-17a07525808b" data-file-name="components/template-editor.tsx">
            <AlertCircle className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="11d5d7d3-404c-46b6-b16f-02e02c6cc186" data-file-name="components/template-editor.tsx">
            Available Variables
          </span></h3>
          <ul className="grid grid-cols-2 gap-2 text-sm" data-unique-id="d57f6dd2-5233-45a3-beee-7fa929b3886a" data-file-name="components/template-editor.tsx">
            <li className="font-mono" data-unique-id="0981cc91-2fcf-4e3f-8810-fa644224f30c" data-file-name="components/template-editor.tsx">{"{{customerName}}"}</li>
            <li className="font-mono" data-unique-id="5689c67b-d1db-4c49-b1ba-f4a4f061f213" data-file-name="components/template-editor.tsx">{"{{orderNumber}}"}</li>
            <li className="font-mono" data-unique-id="e565086f-d78e-4d09-99e5-b94ac0201c38" data-file-name="components/template-editor.tsx">{"{{trackingNumber}}"}</li>
            <li className="font-mono" data-unique-id="a69f68dd-22db-4e48-9d16-fa3eb8be08ed" data-file-name="components/template-editor.tsx">{"{{address}}"}</li>
            <li className="font-mono" data-unique-id="8a219c29-019d-4d78-8c95-92196a31e92e" data-file-name="components/template-editor.tsx">{"{{orderDate}}"}</li>
            <li className="font-mono" data-unique-id="eea88668-ae9f-4e35-8d0f-96c0abcf8deb" data-file-name="components/template-editor.tsx">{"{{items}}"}</li>
          </ul>
        </div>
      </div>
    </motion.div>;
}