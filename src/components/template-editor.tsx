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
  }} className="bg-card rounded-lg shadow-md p-6" data-unique-id="087c558c-0e96-4e03-9c1a-73a8fc5db3d7" data-file-name="components/template-editor.tsx">
      <div className="flex justify-between items-center mb-6" data-unique-id="6dbe4cdd-863f-4c8a-a6eb-4224abdcb2c8" data-file-name="components/template-editor.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="9c395077-3a94-49df-97d4-0f19ff3cf1ea" data-file-name="components/template-editor.tsx">
          <Edit className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="c6271e8b-8ea7-41a9-ab47-55d372389640" data-file-name="components/template-editor.tsx"> Template Editor
        </span></h2>
        <div className="flex space-x-2" data-unique-id="1d902ea7-d550-4e2c-a4e0-620a7892f830" data-file-name="components/template-editor.tsx">
          <button onClick={() => {
          const html = generateHtmlEmail(template);
          copyToClipboard(html);
          alert("HTML copied to clipboard!");
        }} className="flex items-center px-3 py-2 bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy rendered HTML" data-unique-id="cb4260e7-b2d3-456b-a3d1-0984b02a70cb" data-file-name="components/template-editor.tsx">
            <Copy className="h-4 w-4" />
          </button>
          <button onClick={() => downloadTemplate(template)} className="flex items-center px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" title="Download as JSON" data-unique-id="d1e0fdfb-32c2-4545-abc0-fce8652b081c" data-file-name="components/template-editor.tsx">
            <Download className="h-4 w-4" />
          </button>
          <button onClick={saveTemplate} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="d61f754b-84d5-4e83-946d-6253421059e4" data-file-name="components/template-editor.tsx" data-dynamic-text="true">
            <Save className="mr-2 h-4 w-4" />
            {isSaved ? "Saved!" : "Save Template"}
          </button>
        </div>
      </div>
      
      <div className="space-y-5" data-unique-id="cc5710dc-47cd-4de4-a193-7d6e32bf260c" data-file-name="components/template-editor.tsx">
        <div data-unique-id="ab2830cd-bcc9-46db-aad0-b609b628f506" data-file-name="components/template-editor.tsx">
          <label htmlFor="templateName" className="block text-sm font-medium mb-1" data-unique-id="93f428dc-4f9b-41a6-9b2e-a0b70e401749" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="68b95990-213d-48f6-b969-95747da631f2" data-file-name="components/template-editor.tsx">
            Template Name
          </span></label>
          <input id="templateName" type="text" value={template.name} onChange={e => handleChange("name", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="22072419-8631-46bb-a8ae-90ec97fbfe8d" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="97ac4989-382a-44b6-8fa6-84d343c3c1c0" data-file-name="components/template-editor.tsx">
          <label htmlFor="subject" className="block text-sm font-medium mb-1" data-unique-id="75465ded-6c63-4451-b517-07f39afc665c" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="1227aec7-dfd4-4747-b077-8d12fb0c735e" data-file-name="components/template-editor.tsx">
            Email Subject
          </span></label>
          <input id="subject" type="text" value={template.subject} onChange={e => handleChange("subject", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="88f74398-11e3-4f48-8f3d-08f2ebb048d0" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="e57376df-ff95-4bc9-b40a-dd06cde001b8" data-file-name="components/template-editor.tsx">
          <label htmlFor="preheader" className="block text-sm font-medium mb-1" data-unique-id="57922ce9-2120-48af-a9f4-d3bfa6aa82ab" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="3c24ca23-63f2-4421-bfbb-8314f5894133" data-file-name="components/template-editor.tsx">
            Preheader Text
          </span></label>
          <input id="preheader" type="text" value={template.preheader} onChange={e => handleChange("preheader", e.target.value)} placeholder="Brief text that appears in email clients" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="07bd044a-45c7-474f-b7c6-fc5365b6c949" data-file-name="components/template-editor.tsx" />
          <p className="text-xs text-muted-foreground mt-1" data-unique-id="c8e808d8-0409-4028-981f-c1683c1bcf01" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="4d7f9440-2c11-4491-85f6-5bcc47be359a" data-file-name="components/template-editor.tsx">
            This text will show up in email clients as a preview
          </span></p>
        </div>
        
        <div data-unique-id="61a572de-b6a6-4876-806f-b0c094a34c8d" data-file-name="components/template-editor.tsx">
          <label htmlFor="emailContent" className="block text-sm font-medium mb-1" data-unique-id="8fa7851c-b8ab-4f22-a155-ccbbcd2f7679" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="43ba1546-54f6-4039-8f96-92e3354585a8" data-file-name="components/template-editor.tsx">
            Email Content
          </span></label>
          <textarea id="emailContent" rows={12} value={template.content} onChange={e => handleChange("content", e.target.value)} className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y font-mono text-sm" data-unique-id="265b858e-0720-4851-9112-8e5ead0fdfc1" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div className="bg-accent/20 p-4 rounded-md" data-unique-id="f6f99704-8fd9-4d8f-b269-7d1fce556126" data-file-name="components/template-editor.tsx">
          <h3 className="flex items-center text-sm font-medium mb-2" data-unique-id="aa92e486-9565-4fd9-995e-800408dd2712" data-file-name="components/template-editor.tsx">
            <AlertCircle className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="ca2bcab6-7b1b-46d7-a290-0c11011e2487" data-file-name="components/template-editor.tsx">
            Available Variables
          </span></h3>
          <ul className="grid grid-cols-2 gap-2 text-sm" data-unique-id="40064613-bf8d-4713-91d6-bff72e4a5a9e" data-file-name="components/template-editor.tsx">
            <li className="font-mono" data-unique-id="059ac266-49d5-4f69-8a74-4a2c158519e0" data-file-name="components/template-editor.tsx">{"{{customerName}}"}</li>
            <li className="font-mono" data-unique-id="58200e05-ba4a-413a-882d-c69267cc19d2" data-file-name="components/template-editor.tsx">{"{{orderNumber}}"}</li>
            <li className="font-mono" data-unique-id="e439e3d2-5591-4ecc-91d6-f65c45f73823" data-file-name="components/template-editor.tsx">{"{{trackingNumber}}"}</li>
            <li className="font-mono" data-unique-id="38540bf2-4434-4710-acbe-7950e57d875a" data-file-name="components/template-editor.tsx">{"{{address}}"}</li>
            <li className="font-mono" data-unique-id="d7422959-4435-498e-9458-269bbdffa928" data-file-name="components/template-editor.tsx">{"{{orderDate}}"}</li>
            <li className="font-mono" data-unique-id="9d6dbf4f-a6e1-456a-8075-4f5f34ac409d" data-file-name="components/template-editor.tsx">{"{{items}}"}</li>
            <li className="font-mono" data-unique-id="e8cbae1a-0255-44b0-a1c4-f5072a8fd561" data-file-name="components/template-editor.tsx">{"{{orderTotal}}"}</li>
          </ul>
        </div>
      </div>
    </motion.div>;
}