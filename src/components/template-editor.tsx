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
  }} className="bg-card rounded-lg shadow-md p-6" data-unique-id="b803e5fa-55e8-4716-8736-78306e627eb2" data-file-name="components/template-editor.tsx">
      <div className="flex justify-between items-center mb-6" data-unique-id="779b7de2-4ed1-4e52-a6ac-9c3d22e7c186" data-file-name="components/template-editor.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="d6318684-2c95-4e65-9317-c64bf151b5c2" data-file-name="components/template-editor.tsx">
          <Edit className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="98b07260-8450-4caa-96a6-8aa2c4a79b17" data-file-name="components/template-editor.tsx"> Template Editor
        </span></h2>
        <div className="flex space-x-2" data-unique-id="8fd2bfa3-4a67-494b-8d7c-33ed570bed2c" data-file-name="components/template-editor.tsx">
          <button onClick={() => {
          const html = generateHtmlEmail(template);
          copyToClipboard(html);
          alert("HTML copied to clipboard!");
        }} className="flex items-center px-3 py-2 bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy rendered HTML" data-unique-id="6350da20-7dc5-484e-8e00-9dbd0497d806" data-file-name="components/template-editor.tsx">
            <Copy className="h-4 w-4" />
          </button>
          <button onClick={() => downloadTemplate(template)} className="flex items-center px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" title="Download as JSON" data-unique-id="97b9a584-7d29-40ee-b4f0-377cfa9306a0" data-file-name="components/template-editor.tsx">
            <Download className="h-4 w-4" />
          </button>
          <button onClick={saveTemplate} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="49e5b700-6238-4c18-aa5c-813d1b150888" data-file-name="components/template-editor.tsx" data-dynamic-text="true">
            <Save className="mr-2 h-4 w-4" />
            {isSaved ? "Saved!" : "Save Template"}
          </button>
        </div>
      </div>
      
      <div className="space-y-5" data-unique-id="3277d359-ca49-47b7-b3fc-7df796f8e345" data-file-name="components/template-editor.tsx">
        <div data-unique-id="225ad8bc-acd3-4795-9a87-fd3e7c4722a2" data-file-name="components/template-editor.tsx">
          <label htmlFor="templateName" className="block text-sm font-medium mb-1" data-unique-id="b0c72385-8992-43c7-9f3a-6e5314acc89a" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="39bcfc86-a69c-41d5-8c94-4fbc1e2cfea9" data-file-name="components/template-editor.tsx">
            Template Name
          </span></label>
          <input id="templateName" type="text" value={template.name} onChange={e => handleChange("name", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="06534d5d-ad4a-4009-b380-448d958678a0" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="d8188ce6-e433-4d56-8f1a-0179b147901e" data-file-name="components/template-editor.tsx">
          <label htmlFor="subject" className="block text-sm font-medium mb-1" data-unique-id="829f790c-2bba-4a47-a810-cf01a99ffa6e" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="e7fb0abc-7e0f-4805-99a7-ed7a291cb114" data-file-name="components/template-editor.tsx">
            Email Subject
          </span></label>
          <input id="subject" type="text" value={template.subject} onChange={e => handleChange("subject", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="17b126dc-a83d-4033-9be9-a90511ef49a1" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="2a974fc2-a69e-4fdf-981f-2a9dcd439027" data-file-name="components/template-editor.tsx">
          <label htmlFor="preheader" className="block text-sm font-medium mb-1" data-unique-id="df4cd519-65ad-4e3d-b220-6c4067b5fb49" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="10edd40d-1c9e-41c5-a7a3-ccd4770ddf9a" data-file-name="components/template-editor.tsx">
            Preheader Text
          </span></label>
          <input id="preheader" type="text" value={template.preheader} onChange={e => handleChange("preheader", e.target.value)} placeholder="Brief text that appears in email clients" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="c1e519b1-91f7-4202-9fe6-37aeb3a822b4" data-file-name="components/template-editor.tsx" />
          <p className="text-xs text-muted-foreground mt-1" data-unique-id="57a98606-9464-4dc7-b978-687bb94a4ed3" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="92c438c9-2918-4e99-827c-338d4e099f81" data-file-name="components/template-editor.tsx">
            This text will show up in email clients as a preview
          </span></p>
        </div>
        
        <div data-unique-id="c74cd5da-66b2-4cfd-9a64-05b4110f8b51" data-file-name="components/template-editor.tsx">
          <label htmlFor="emailContent" className="block text-sm font-medium mb-1" data-unique-id="a7a2c8c0-3b3b-44d1-b119-e8fddda71150" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="b954b789-cc58-421a-b6af-d1548e9115e5" data-file-name="components/template-editor.tsx">
            Email Content
          </span></label>
          <textarea id="emailContent" rows={12} value={template.content} onChange={e => handleChange("content", e.target.value)} className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y font-mono text-sm" data-unique-id="520495c7-0505-4486-9143-629faa6ec332" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div className="bg-accent/20 p-4 rounded-md" data-unique-id="84f6c7e4-da59-426e-8789-31e9a58c6e01" data-file-name="components/template-editor.tsx">
          <h3 className="flex items-center text-sm font-medium mb-2" data-unique-id="66f127da-4ef7-4e67-bd65-dd8aeb5d76d2" data-file-name="components/template-editor.tsx">
            <AlertCircle className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="245397ca-40ce-4e2e-a77a-2d6b9099a75e" data-file-name="components/template-editor.tsx">
            Available Variables
          </span></h3>
          <ul className="grid grid-cols-2 gap-2 text-sm" data-unique-id="5a423fa3-5ece-4f7f-8fe6-18ce1a92e5f1" data-file-name="components/template-editor.tsx">
            <li className="font-mono" data-unique-id="77ba876f-771f-4830-aa74-62ff0d96573d" data-file-name="components/template-editor.tsx">{"{{customerName}}"}</li>
            <li className="font-mono" data-unique-id="7368969a-b4c6-46cf-bd0e-a12efd40fcb6" data-file-name="components/template-editor.tsx">{"{{orderNumber}}"}</li>
            <li className="font-mono" data-unique-id="35f51bf0-58d7-47da-b391-62a9cc5f157b" data-file-name="components/template-editor.tsx">{"{{trackingNumber}}"}</li>
            <li className="font-mono" data-unique-id="32eccc87-e15e-4c7d-b99d-a88e45b83347" data-file-name="components/template-editor.tsx">{"{{address}}"}</li>
            <li className="font-mono" data-unique-id="d82e369e-8a5c-4f98-9a81-2ae7f7e9d745" data-file-name="components/template-editor.tsx">{"{{orderDate}}"}</li>
            <li className="font-mono" data-unique-id="bd8078b3-de40-4d1f-ab31-c5a8205a6b50" data-file-name="components/template-editor.tsx">{"{{items}}"}</li>
            <li className="font-mono" data-unique-id="86743efe-8b6c-4a4e-a682-edd3c4111dc9" data-file-name="components/template-editor.tsx">{"{{orderTotal}}"}</li>
          </ul>
        </div>
      </div>
    </motion.div>;
}