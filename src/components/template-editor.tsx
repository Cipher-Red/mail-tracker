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
  }} className="bg-card rounded-lg shadow-md p-6" data-unique-id="5621bede-f31b-4f3e-a3a5-566ada95b23a" data-file-name="components/template-editor.tsx">
      <div className="flex justify-between items-center mb-6" data-unique-id="4ee2e3bd-051f-4015-811f-905d85e184b4" data-file-name="components/template-editor.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="dc314a7a-8b2b-4a83-9193-913036353fc8" data-file-name="components/template-editor.tsx">
          <Edit className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="5b568f56-f540-4824-af8a-9cdcc06ff25f" data-file-name="components/template-editor.tsx"> Template Editor
        </span></h2>
        <div className="flex space-x-2" data-unique-id="14dd8a0c-0b99-4fd7-81fa-04e74730a1c1" data-file-name="components/template-editor.tsx">
          <button onClick={() => {
          const html = generateHtmlEmail(template);
          copyToClipboard(html);
          alert("HTML copied to clipboard!");
        }} className="flex items-center px-3 py-2 bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy rendered HTML" data-unique-id="4bea12cb-1b53-4392-ac35-50e6994b9749" data-file-name="components/template-editor.tsx">
            <Copy className="h-4 w-4" />
          </button>
          <button onClick={() => downloadTemplate(template)} className="flex items-center px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" title="Download as JSON" data-unique-id="3ab0d3e4-61f7-4ada-93b5-27eedee38acc" data-file-name="components/template-editor.tsx">
            <Download className="h-4 w-4" />
          </button>
          <button onClick={saveTemplate} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="bb634b54-ac52-4694-abdc-df734b47917e" data-file-name="components/template-editor.tsx" data-dynamic-text="true">
            <Save className="mr-2 h-4 w-4" />
            {isSaved ? "Saved!" : "Save Template"}
          </button>
        </div>
      </div>
      
      <div className="space-y-5" data-unique-id="be324971-2d3b-4d59-b4ef-19afee494b16" data-file-name="components/template-editor.tsx">
        <div data-unique-id="f8726fa6-b4f8-4962-b8d7-34d7a37fe3da" data-file-name="components/template-editor.tsx">
          <label htmlFor="templateName" className="block text-sm font-medium mb-1" data-unique-id="2d7f36e0-6436-4a63-abf2-f2e15c413ff5" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="55c3709c-c5fc-438b-a181-5fd9f065bea3" data-file-name="components/template-editor.tsx">
            Template Name
          </span></label>
          <input id="templateName" type="text" value={template.name} onChange={e => handleChange("name", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="53e56c50-5415-405d-b314-7c0537a9f5f9" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="ef572951-c517-49c0-845b-71ee7d4ec7ea" data-file-name="components/template-editor.tsx">
          <label htmlFor="subject" className="block text-sm font-medium mb-1" data-unique-id="06140583-b570-42ef-ab80-1a3d4b3d9975" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="7c475b8a-18a2-4f1d-af39-06c8fc7f1430" data-file-name="components/template-editor.tsx">
            Email Subject
          </span></label>
          <input id="subject" type="text" value={template.subject} onChange={e => handleChange("subject", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="1412223b-d5b4-456c-b689-c066c4132b1d" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="070d9c64-477a-43f1-8ee3-2e6560a20753" data-file-name="components/template-editor.tsx">
          <label htmlFor="preheader" className="block text-sm font-medium mb-1" data-unique-id="1af0c59f-6ef9-4784-87a2-272a6e4adb37" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="ac3a8846-d704-4aa1-a332-7c5472bf1207" data-file-name="components/template-editor.tsx">
            Preheader Text
          </span></label>
          <input id="preheader" type="text" value={template.preheader} onChange={e => handleChange("preheader", e.target.value)} placeholder="Brief text that appears in email clients" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="7bdfa2fe-07bc-496a-854d-52386231d8fd" data-file-name="components/template-editor.tsx" />
          <p className="text-xs text-muted-foreground mt-1" data-unique-id="fb890c67-4b2d-4954-a994-7e0c962bd8f4" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="bd7e1529-bda3-466a-9abf-9543973033f3" data-file-name="components/template-editor.tsx">
            This text will show up in email clients as a preview
          </span></p>
        </div>
        
        <div data-unique-id="6c3be4ad-d0cc-486e-ad56-3fcde11509a5" data-file-name="components/template-editor.tsx">
          <label htmlFor="emailContent" className="block text-sm font-medium mb-1" data-unique-id="8020886b-c7d3-4349-af86-01247f955c29" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="22456b70-2777-4d8f-9aee-5f1585314260" data-file-name="components/template-editor.tsx">
            Email Content
          </span></label>
          <textarea id="emailContent" rows={12} value={template.content} onChange={e => handleChange("content", e.target.value)} className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y font-mono text-sm" data-unique-id="b3d646a2-0216-4616-b51c-0496571b19ee" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div className="bg-accent/20 p-4 rounded-md" data-unique-id="5d4f6cec-a59b-46a8-a8d7-76c6741b65ce" data-file-name="components/template-editor.tsx">
          <h3 className="flex items-center text-sm font-medium mb-2" data-unique-id="87e66be8-3c13-476b-9898-6eed218385dc" data-file-name="components/template-editor.tsx">
            <AlertCircle className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="f16c1304-0a8e-487a-9140-65276f508d1e" data-file-name="components/template-editor.tsx">
            Available Variables
          </span></h3>
          <ul className="grid grid-cols-2 gap-2 text-sm" data-unique-id="bd1c4e2c-dcaf-4603-8735-f3d624d145c7" data-file-name="components/template-editor.tsx">
            <li className="font-mono" data-unique-id="ae44289f-8e75-4116-ae35-40b79527781a" data-file-name="components/template-editor.tsx">{"{{customerName}}"}</li>
            <li className="font-mono" data-unique-id="5412c33e-a5fc-4be8-b0e1-77ad0718b2a5" data-file-name="components/template-editor.tsx">{"{{orderNumber}}"}</li>
            <li className="font-mono" data-unique-id="4c9d8318-c213-4405-9b9d-55ce9f2c6232" data-file-name="components/template-editor.tsx">{"{{trackingNumber}}"}</li>
            <li className="font-mono" data-unique-id="0233860c-2904-497b-96bf-61c84de59578" data-file-name="components/template-editor.tsx">{"{{address}}"}</li>
            <li className="font-mono" data-unique-id="59b96ab0-e5b3-4d05-88a5-6b6201bb467a" data-file-name="components/template-editor.tsx">{"{{orderDate}}"}</li>
            <li className="font-mono" data-unique-id="a49715c3-92a4-4e6a-af12-5ed99077779e" data-file-name="components/template-editor.tsx">{"{{items}}"}</li>
          </ul>
        </div>
      </div>
    </motion.div>;
}