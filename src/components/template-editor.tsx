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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="e0aa85b7-d344-4d81-8731-2f5f0440ebc8" data-file-name="components/template-editor.tsx">
      <div className="flex justify-between items-center mb-6" data-unique-id="e8743825-d925-47c2-89e0-9e3af14780b4" data-file-name="components/template-editor.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="9ee2318f-cfd8-4320-95c1-84232d23ff21" data-file-name="components/template-editor.tsx">
          <Edit className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="a4933b96-f1e2-42e5-ac37-44e3c07a2b0c" data-file-name="components/template-editor.tsx"> Template Editor
        </span></h2>
        <div className="flex space-x-2" data-unique-id="58861f9c-914e-42ae-af18-fd0d6954747d" data-file-name="components/template-editor.tsx">
          <button onClick={() => {
          const html = generateHtmlEmail(template);
          copyToClipboard(html);
          alert("HTML copied to clipboard!");
        }} className="flex items-center px-3 py-2 bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy rendered HTML" data-unique-id="cc9ec9a9-ccc9-47de-9e49-45563113aa45" data-file-name="components/template-editor.tsx">
            <Copy className="h-4 w-4" />
          </button>
          <button onClick={() => downloadTemplate(template)} className="flex items-center px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" title="Download as JSON" data-unique-id="194ba2be-2685-41b5-b7db-14ea4e2a4afd" data-file-name="components/template-editor.tsx">
            <Download className="h-4 w-4" />
          </button>
          <button onClick={saveTemplate} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="52099948-f0c1-4ef0-8d2b-312cfa790aef" data-file-name="components/template-editor.tsx" data-dynamic-text="true">
            <Save className="mr-2 h-4 w-4" />
            {isSaved ? "Saved!" : "Save Template"}
          </button>
        </div>
      </div>
      
      <div className="space-y-5" data-unique-id="399077a7-b895-40ee-afb0-2c3f1585ada1" data-file-name="components/template-editor.tsx">
        <div data-unique-id="aac5fb75-ac7c-41dd-94f8-fd691782f009" data-file-name="components/template-editor.tsx">
          <label htmlFor="templateName" className="block text-sm font-medium mb-1" data-unique-id="aa7c7bfc-3f74-432b-8396-aaa96f845a3c" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="d39939c8-f22b-47d3-85d3-637cc7f77807" data-file-name="components/template-editor.tsx">
            Template Name
          </span></label>
          <input id="templateName" type="text" value={template.name} onChange={e => handleChange("name", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="55601a0e-d2ac-460b-990d-5fbb1bed592a" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="82ca90c8-1449-4fb1-bfb3-85a4aeb7f467" data-file-name="components/template-editor.tsx">
          <label htmlFor="subject" className="block text-sm font-medium mb-1" data-unique-id="b0a2a683-996e-4bb4-8960-2c75a1ac68a9" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="891981a1-0952-4831-a19f-da4768014ad5" data-file-name="components/template-editor.tsx">
            Email Subject
          </span></label>
          <input id="subject" type="text" value={template.subject} onChange={e => handleChange("subject", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="bd19296c-0860-4e2c-b9cf-09e9e6e633f1" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="aedd5b50-9511-458c-ab1d-062d61725e73" data-file-name="components/template-editor.tsx">
          <label htmlFor="preheader" className="block text-sm font-medium mb-1" data-unique-id="81d4b150-397d-42f3-afd4-6a6e8730d2f1" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="9b594464-36d7-46d5-afc6-e6504c39b451" data-file-name="components/template-editor.tsx">
            Preheader Text
          </span></label>
          <input id="preheader" type="text" value={template.preheader} onChange={e => handleChange("preheader", e.target.value)} placeholder="Brief text that appears in email clients" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="c3b38e7f-c58e-45f0-9c32-ff45c9bc14b3" data-file-name="components/template-editor.tsx" />
          <p className="text-xs text-muted-foreground mt-1" data-unique-id="93bb6072-6e16-421a-96c9-0a155f9b14e2" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="c8d444d0-c9e6-4d3c-80ae-0fed1f0e7e03" data-file-name="components/template-editor.tsx">
            This text will show up in email clients as a preview
          </span></p>
        </div>
        
        <div data-unique-id="cc633bcc-acd7-42a3-ac86-7d0719e6f9fe" data-file-name="components/template-editor.tsx">
          <label htmlFor="emailContent" className="block text-sm font-medium mb-1" data-unique-id="0aaf2e16-f432-48db-b563-1f3f3db9813b" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="41d962ea-95af-4b7b-bbe2-f5fc8b56a263" data-file-name="components/template-editor.tsx">
            Email Content
          </span></label>
          <textarea id="emailContent" rows={12} value={template.content} onChange={e => handleChange("content", e.target.value)} className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-y font-mono text-sm" data-unique-id="55256bf7-5740-45b6-addf-8ba49c860da2" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div className="bg-accent/20 p-4 rounded-md" data-unique-id="c21fbff6-4b39-4835-9f0e-946679603453" data-file-name="components/template-editor.tsx">
          <h3 className="flex items-center text-sm font-medium mb-2" data-unique-id="5d425241-536a-44eb-a858-0c19fdadc531" data-file-name="components/template-editor.tsx">
            <AlertCircle className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="5e10a937-d6e2-40ea-9fa6-8fe5cc34f423" data-file-name="components/template-editor.tsx">
            Available Variables
          </span></h3>
          <ul className="grid grid-cols-2 gap-2 text-sm" data-unique-id="54e64470-a7f1-4ee3-b3d0-3dc7490125f4" data-file-name="components/template-editor.tsx">
            <li className="font-mono" data-unique-id="51815bee-24d3-40f1-bd9a-235af7edff09" data-file-name="components/template-editor.tsx">{"{{customerName}}"}</li>
            <li className="font-mono" data-unique-id="52850971-7f75-4c9d-96d3-8b2d27335dc9" data-file-name="components/template-editor.tsx">{"{{orderNumber}}"}</li>
            <li className="font-mono" data-unique-id="d3b123b5-b4dc-43d1-8924-703bfff84cc5" data-file-name="components/template-editor.tsx">{"{{trackingNumber}}"}</li>
            <li className="font-mono" data-unique-id="aa194946-dedd-4db7-aad2-d5b50bbb4f74" data-file-name="components/template-editor.tsx">{"{{address}}"}</li>
            <li className="font-mono" data-unique-id="1217f9b5-3f05-4ed7-a354-d8b65ff47205" data-file-name="components/template-editor.tsx">{"{{orderDate}}"}</li>
            <li className="font-mono" data-unique-id="06947035-11f2-4a15-b2a1-3efffd252ee5" data-file-name="components/template-editor.tsx">{"{{items}}"}</li>
          </ul>
        </div>
      </div>
    </motion.div>;
}