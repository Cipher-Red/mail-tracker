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
  }} className="bg-card rounded-lg shadow-md p-6" data-unique-id="0c6bf32c-814b-44ff-a3e8-a21f65825e42" data-file-name="components/template-editor.tsx">
      <div className="flex justify-between items-center mb-6" data-unique-id="868a3934-d1e3-4a15-9643-f440c1023b53" data-file-name="components/template-editor.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="752a9617-c6a1-4945-8d95-b1b3efdf4281" data-file-name="components/template-editor.tsx">
          <Edit className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="f637eaf1-d0af-44b0-940b-8469f811d91f" data-file-name="components/template-editor.tsx"> Template Editor
        </span></h2>
        <div className="flex space-x-2" data-unique-id="d90e56f2-dc2f-46b4-a06e-5229fccf9869" data-file-name="components/template-editor.tsx">
          <button onClick={() => {
          const html = generateHtmlEmail(template);
          copyToClipboard(html);
          alert("HTML copied to clipboard!");
        }} className="flex items-center px-3 py-2 bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy rendered HTML" data-unique-id="b060896c-080c-4d28-9631-98bd1011f6cd" data-file-name="components/template-editor.tsx">
            <Copy className="h-4 w-4" />
          </button>
          <button onClick={() => downloadTemplate(template)} className="flex items-center px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" title="Download as JSON" data-unique-id="47d78a11-2d01-4317-844a-ceb655b2c9c2" data-file-name="components/template-editor.tsx">
            <Download className="h-4 w-4" />
          </button>
          <button onClick={saveTemplate} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="eb18119f-8439-4296-98c9-2b933a46237e" data-file-name="components/template-editor.tsx" data-dynamic-text="true">
            <Save className="mr-2 h-4 w-4" />
            {isSaved ? "Saved!" : "Save Template"}
          </button>
        </div>
      </div>
      
      <div className="space-y-5" data-unique-id="172f7945-1453-42c1-983c-dd3b0e7a1c81" data-file-name="components/template-editor.tsx">
        <div data-unique-id="6754cf59-499c-4772-abc1-335ecc9ad636" data-file-name="components/template-editor.tsx">
          <label htmlFor="templateName" className="block text-sm font-medium mb-1" data-unique-id="8d05a827-0991-4d41-ada8-e585fda2fd9f" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="e33a4fa9-7d2e-4130-ada3-a5790d2edd08" data-file-name="components/template-editor.tsx">
            Template Name
          </span></label>
          <input id="templateName" type="text" value={template.name} onChange={e => handleChange("name", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="e6cc5622-01b1-4a30-9aa5-f458e9d9160f" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="61d0f983-55c7-4092-a2a7-467b856895bb" data-file-name="components/template-editor.tsx">
          <label htmlFor="subject" className="block text-sm font-medium mb-1" data-unique-id="90502813-a21c-42ff-9571-80c0384ccb50" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="0648d104-5be4-4901-9a8b-e0dc7079d498" data-file-name="components/template-editor.tsx">
            Email Subject
          </span></label>
          <input id="subject" type="text" value={template.subject} onChange={e => handleChange("subject", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="fec324d2-0c0e-4bd8-8c89-f1804f915501" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="d45fc5ba-419a-47d6-b4d0-2a652f08ccff" data-file-name="components/template-editor.tsx">
          <label htmlFor="preheader" className="block text-sm font-medium mb-1" data-unique-id="beaafaaa-4b22-4879-906b-d0a539519ec7" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="7ae05376-6dfd-43bd-b7bc-8cefcf060117" data-file-name="components/template-editor.tsx">
            Preheader Text
          </span></label>
          <input id="preheader" type="text" value={template.preheader} onChange={e => handleChange("preheader", e.target.value)} placeholder="Brief text that appears in email clients" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="af0f40ff-8d3f-4539-a31b-7f2ec59b34dd" data-file-name="components/template-editor.tsx" />
          <p className="text-xs text-muted-foreground mt-1" data-unique-id="f271181e-2d84-4e19-9d13-68155302e555" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="047c514b-284f-4814-833b-bb26d6232787" data-file-name="components/template-editor.tsx">
            This text will show up in email clients as a preview
          </span></p>
        </div>
        
        <div data-unique-id="83b0cc76-4ebf-41b6-b0ab-2956852791ae" data-file-name="components/template-editor.tsx">
          <label htmlFor="emailContent" className="block text-sm font-medium mb-1" data-unique-id="194f2bf4-15a8-4899-803a-b5a6d7ba4d25" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="1ba85e51-995d-4a81-a1a0-ff6ac38cb1fd" data-file-name="components/template-editor.tsx">
            Email Content
          </span></label>
          <textarea id="emailContent" rows={12} value={template.content} onChange={e => handleChange("content", e.target.value)} className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y font-mono text-sm" data-unique-id="f68a6cfc-16be-40a9-a631-18b2dfb71835" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div className="bg-accent/20 p-4 rounded-md" data-unique-id="9cd947ea-8e9d-4ed1-a358-114a50b08507" data-file-name="components/template-editor.tsx">
          <h3 className="flex items-center text-sm font-medium mb-2" data-unique-id="c5db67f7-e205-4134-9da4-9fe5af87825d" data-file-name="components/template-editor.tsx">
            <AlertCircle className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="7ca7a197-57d6-4a7a-be1a-df50cf1c8100" data-file-name="components/template-editor.tsx">
            Available Variables
          </span></h3>
          <ul className="grid grid-cols-2 gap-2 text-sm" data-unique-id="0edc7ad1-bee9-4b85-8836-8ffef11f7dcd" data-file-name="components/template-editor.tsx">
            <li className="font-mono" data-unique-id="202cedde-8fc2-46c6-8f2b-9ce172e87664" data-file-name="components/template-editor.tsx">{"{{customerName}}"}</li>
            <li className="font-mono" data-unique-id="8e6f9016-8cc0-45a8-a5a1-25bd1143619b" data-file-name="components/template-editor.tsx">{"{{orderNumber}}"}</li>
            <li className="font-mono" data-unique-id="7cc8d7ca-c24c-454e-bb5f-e76ee97c53e0" data-file-name="components/template-editor.tsx">{"{{trackingNumber}}"}</li>
            <li className="font-mono" data-unique-id="551645d2-6117-4476-b574-c4d0012e2f12" data-file-name="components/template-editor.tsx">{"{{address}}"}</li>
            <li className="font-mono" data-unique-id="173f6d36-7f8a-4532-9d83-c6d619df7c8b" data-file-name="components/template-editor.tsx">{"{{orderDate}}"}</li>
            <li className="font-mono" data-unique-id="fb476931-46dd-4a22-a571-62709aca382a" data-file-name="components/template-editor.tsx">{"{{items}}"}</li>
          </ul>
        </div>
      </div>
    </motion.div>;
}