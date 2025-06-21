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
  }} className="bg-card rounded-lg shadow-md p-6" data-unique-id="b8586192-d1ab-4a1c-a585-485f702bd053" data-file-name="components/template-editor.tsx">
      <div className="flex justify-between items-center mb-6" data-unique-id="e9bc04fb-0565-4aef-94a0-2015a5552eeb" data-file-name="components/template-editor.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="033c42e3-e2d2-4dee-8bfc-c8eac25ad287" data-file-name="components/template-editor.tsx">
          <Edit className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="6a7eed4e-0316-458a-b43f-fd772059d564" data-file-name="components/template-editor.tsx"> Template Editor
        </span></h2>
        <div className="flex space-x-2" data-unique-id="f3feb7e2-6184-47d7-a32d-7b484cd7b9f2" data-file-name="components/template-editor.tsx">
          <button onClick={() => {
          const html = generateHtmlEmail(template);
          copyToClipboard(html);
          alert("HTML copied to clipboard!");
        }} className="flex items-center px-3 py-2 bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy rendered HTML" data-unique-id="916da689-42fc-43b0-ab9a-a2e94b4d6ebc" data-file-name="components/template-editor.tsx">
            <Copy className="h-4 w-4" />
          </button>
          <button onClick={() => downloadTemplate(template)} className="flex items-center px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" title="Download as JSON" data-unique-id="a284eac5-926d-4168-89d3-1626a3397711" data-file-name="components/template-editor.tsx">
            <Download className="h-4 w-4" />
          </button>
          <button onClick={saveTemplate} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="d6fe70dc-d2e1-4a2c-b1b5-105787808ab3" data-file-name="components/template-editor.tsx" data-dynamic-text="true">
            <Save className="mr-2 h-4 w-4" />
            {isSaved ? "Saved!" : "Save Template"}
          </button>
        </div>
      </div>
      
      <div className="space-y-5" data-unique-id="cfbeea7d-4def-4015-9b1d-8e22d91a971f" data-file-name="components/template-editor.tsx">
        <div data-unique-id="b93f7bc1-34ed-47ad-a708-590718a9a421" data-file-name="components/template-editor.tsx">
          <label htmlFor="templateName" className="block text-sm font-medium mb-1" data-unique-id="db1beb18-5370-45b0-a38b-17a38f8d14f2" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="0604fbec-ef79-4ff3-9f51-9bae0af58f23" data-file-name="components/template-editor.tsx">
            Template Name
          </span></label>
          <input id="templateName" type="text" value={template.name} onChange={e => handleChange("name", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="4d5c19e5-4eab-4255-ad17-83820c930200" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="aaf0280b-549c-4a71-a6d3-4d17f0bd51e3" data-file-name="components/template-editor.tsx">
          <label htmlFor="subject" className="block text-sm font-medium mb-1" data-unique-id="fa931b2b-f3f5-4a3a-b6e4-67e190523cee" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="5740d90e-6c4e-4371-a8ea-c16165c1e539" data-file-name="components/template-editor.tsx">
            Email Subject
          </span></label>
          <input id="subject" type="text" value={template.subject} onChange={e => handleChange("subject", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="5391f3ec-5540-4b1b-93f9-dc3ac57e81d6" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="e09a1217-42e8-43e7-b06f-4a8acdcee9a2" data-file-name="components/template-editor.tsx">
          <label htmlFor="preheader" className="block text-sm font-medium mb-1" data-unique-id="dea6f0ec-2587-4953-b214-b94f45a66c1c" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="ed4c53ae-626f-4099-b84e-5037dfdaf130" data-file-name="components/template-editor.tsx">
            Preheader Text
          </span></label>
          <input id="preheader" type="text" value={template.preheader} onChange={e => handleChange("preheader", e.target.value)} placeholder="Brief text that appears in email clients" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="9e4c349d-1bf8-4425-b0bf-bae87ebb047d" data-file-name="components/template-editor.tsx" />
          <p className="text-xs text-muted-foreground mt-1" data-unique-id="bc18620e-8f04-4010-ac32-a4b864e25a52" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="24a35175-3668-4ac6-a9d2-5fbe4e160631" data-file-name="components/template-editor.tsx">
            This text will show up in email clients as a preview
          </span></p>
        </div>
        
        <div data-unique-id="df718ffd-6eb0-4293-8156-8cbda0e38823" data-file-name="components/template-editor.tsx">
          <label htmlFor="emailContent" className="block text-sm font-medium mb-1" data-unique-id="a761f49c-d715-472b-b0d6-4c330a0d8f2c" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="91e92cc7-0fb6-4fcd-b1ad-ff905cbbcfe7" data-file-name="components/template-editor.tsx">
            Email Content
          </span></label>
          <textarea id="emailContent" rows={12} value={template.content} onChange={e => handleChange("content", e.target.value)} className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y font-mono text-sm" data-unique-id="f189e350-ce7c-4cbb-a423-6941fc2869ca" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div className="bg-accent/20 p-4 rounded-md" data-unique-id="bb9e513d-662e-42f8-a456-2cee24fde5db" data-file-name="components/template-editor.tsx">
          <h3 className="flex items-center text-sm font-medium mb-2" data-unique-id="3024fc87-214e-4249-b98f-2a8e74347a30" data-file-name="components/template-editor.tsx">
            <AlertCircle className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="22325754-501e-4316-99f3-d20f8b11575b" data-file-name="components/template-editor.tsx">
            Available Variables
          </span></h3>
          <ul className="grid grid-cols-2 gap-2 text-sm" data-unique-id="457cb650-2cbb-4a62-88d3-8477536ce7f2" data-file-name="components/template-editor.tsx">
            <li className="font-mono" data-unique-id="b1f4ec5f-b2d4-4510-b8a0-8a076a123ac6" data-file-name="components/template-editor.tsx">{"{{customerName}}"}</li>
            <li className="font-mono" data-unique-id="c5306127-4511-49b2-99bb-d2ca76d36052" data-file-name="components/template-editor.tsx">{"{{orderNumber}}"}</li>
            <li className="font-mono" data-unique-id="32a57e4d-60c8-4835-bae8-e38775848e2c" data-file-name="components/template-editor.tsx">{"{{trackingNumber}}"}</li>
            <li className="font-mono" data-unique-id="7679cbe5-bde9-4954-8165-f0746186cba2" data-file-name="components/template-editor.tsx">{"{{address}}"}</li>
            <li className="font-mono" data-unique-id="315602c6-5634-4530-b7c1-8d936624f9ec" data-file-name="components/template-editor.tsx">{"{{orderDate}}"}</li>
            <li className="font-mono" data-unique-id="51c43846-1b95-41a6-8f18-e0b8216ef088" data-file-name="components/template-editor.tsx">{"{{items}}"}</li>
            <li className="font-mono" data-unique-id="af5f4b51-047d-42bc-87e6-8dec5fa281ab" data-file-name="components/template-editor.tsx">{"{{orderTotal}}"}</li>
          </ul>
        </div>
      </div>
    </motion.div>;
}