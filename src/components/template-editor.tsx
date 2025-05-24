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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="5e2f0a4a-9010-4117-82c5-9f45a77f8eb4" data-file-name="components/template-editor.tsx">
      <div className="flex justify-between items-center mb-6" data-unique-id="b933502f-82f7-4222-9754-43502b34aaad" data-file-name="components/template-editor.tsx">
        <h2 className="text-xl font-medium flex items-center" data-unique-id="1548a843-f793-48c9-960c-9b5cf89390ac" data-file-name="components/template-editor.tsx">
          <Edit className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="ebe397e2-d503-4b11-96b3-592c82bd43e2" data-file-name="components/template-editor.tsx"> Template Editor
        </span></h2>
        <div className="flex space-x-2" data-unique-id="57e7cf07-1379-48da-96d1-dc8a4fd7f3a1" data-file-name="components/template-editor.tsx">
          <button onClick={() => {
          const html = generateHtmlEmail(template);
          copyToClipboard(html);
          alert("HTML copied to clipboard!");
        }} className="flex items-center px-3 py-2 bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy rendered HTML" data-unique-id="9a6b32ee-7bfd-44c9-81a6-20fe756f33d1" data-file-name="components/template-editor.tsx">
            <Copy className="h-4 w-4" />
          </button>
          <button onClick={() => downloadTemplate(template)} className="flex items-center px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" title="Download as JSON" data-unique-id="7b478ba9-910d-4f49-aff1-9503bfed6ded" data-file-name="components/template-editor.tsx">
            <Download className="h-4 w-4" />
          </button>
          <button onClick={saveTemplate} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="8d57e192-48e2-4afb-849e-00fdac439d74" data-file-name="components/template-editor.tsx" data-dynamic-text="true">
            <Save className="mr-2 h-4 w-4" />
            {isSaved ? "Saved!" : "Save Template"}
          </button>
        </div>
      </div>
      
      <div className="space-y-5" data-unique-id="392782fb-77d9-4cc0-963a-77a74f543201" data-file-name="components/template-editor.tsx">
        <div data-unique-id="8635f694-d2f7-4316-98ab-faab38eeb6f4" data-file-name="components/template-editor.tsx">
          <label htmlFor="templateName" className="block text-sm font-medium mb-1" data-unique-id="4643fb5a-ea53-4916-8600-bfc8bfc372fe" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="b4147139-c1c9-4028-9da4-a378a9acdde7" data-file-name="components/template-editor.tsx">
            Template Name
          </span></label>
          <input id="templateName" type="text" value={template.name} onChange={e => handleChange("name", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="dc4aba9b-f895-4f5f-8203-bdfd34c9e4b4" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="17d1afa8-93a8-4935-a335-bc654c2c07bd" data-file-name="components/template-editor.tsx">
          <label htmlFor="subject" className="block text-sm font-medium mb-1" data-unique-id="01aa2b76-4c93-4ca0-b887-6983439c878d" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="57d6d90c-e1dc-4fbf-b5be-a3f0178ed862" data-file-name="components/template-editor.tsx">
            Email Subject
          </span></label>
          <input id="subject" type="text" value={template.subject} onChange={e => handleChange("subject", e.target.value)} className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="f398ac19-fa25-4b2f-aae2-bf281b4de6d5" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div data-unique-id="ea4a891f-a693-40da-af17-a57d2ea53a08" data-file-name="components/template-editor.tsx">
          <label htmlFor="preheader" className="block text-sm font-medium mb-1" data-unique-id="a743c183-cf78-4f32-8ed8-17bdef8c5dfa" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="65439c1b-9561-47fc-ae14-aa704d2264da" data-file-name="components/template-editor.tsx">
            Preheader Text
          </span></label>
          <input id="preheader" type="text" value={template.preheader} onChange={e => handleChange("preheader", e.target.value)} placeholder="Brief text that appears in email clients" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="a7f1460b-2295-497f-bd00-2d60844fa442" data-file-name="components/template-editor.tsx" />
          <p className="text-xs text-muted-foreground mt-1" data-unique-id="daba95f9-daa6-4468-b1e8-41a1cb90bab1" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="00d59ba3-c3dc-45a8-a102-c6abd611854b" data-file-name="components/template-editor.tsx">
            This text will show up in email clients as a preview
          </span></p>
        </div>
        
        <div data-unique-id="c5b95fef-a6c7-45cc-80dc-5a0d23be544e" data-file-name="components/template-editor.tsx">
          <label htmlFor="emailContent" className="block text-sm font-medium mb-1" data-unique-id="360f0a96-5310-4399-ac44-c1a0c9f6035f" data-file-name="components/template-editor.tsx"><span className="editable-text" data-unique-id="f0e15b48-6d6f-4c64-b5ed-7674acae45b1" data-file-name="components/template-editor.tsx">
            Email Content
          </span></label>
          <textarea id="emailContent" rows={12} value={template.content} onChange={e => handleChange("content", e.target.value)} className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-y font-mono text-sm" data-unique-id="e4f7e1ae-bf08-44f5-8505-d1426ad04782" data-file-name="components/template-editor.tsx" />
        </div>
        
        <div className="bg-accent/20 p-4 rounded-md" data-unique-id="b20958e1-1a6c-44b8-907b-bbed065d4858" data-file-name="components/template-editor.tsx">
          <h3 className="flex items-center text-sm font-medium mb-2" data-unique-id="17aece21-183e-48a0-959e-7cddc01d4c14" data-file-name="components/template-editor.tsx">
            <AlertCircle className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="757ff6ff-bd7e-42f3-8df2-f0182318e44b" data-file-name="components/template-editor.tsx">
            Available Variables
          </span></h3>
          <ul className="grid grid-cols-2 gap-2 text-sm" data-unique-id="1e08689f-5515-466c-bb76-1c7efd1996c3" data-file-name="components/template-editor.tsx">
            <li className="font-mono" data-unique-id="3eef769c-b569-4902-8f6d-19f007176aa0" data-file-name="components/template-editor.tsx">{"{{customerName}}"}</li>
            <li className="font-mono" data-unique-id="7e9f99bb-12c5-4dbc-b5c1-82fb05505e6c" data-file-name="components/template-editor.tsx">{"{{orderNumber}}"}</li>
            <li className="font-mono" data-unique-id="b96eba1d-933d-4565-bfea-b8e87acf1335" data-file-name="components/template-editor.tsx">{"{{trackingNumber}}"}</li>
            <li className="font-mono" data-unique-id="12d4de74-d1f0-49c0-9e6b-df0b13aaf1b5" data-file-name="components/template-editor.tsx">{"{{address}}"}</li>
            <li className="font-mono" data-unique-id="7b2b479f-69f1-436f-969d-e6ff36f42145" data-file-name="components/template-editor.tsx">{"{{orderDate}}"}</li>
            <li className="font-mono" data-unique-id="3f2ed6b9-e774-4c08-b8ea-0a196a51d3a9" data-file-name="components/template-editor.tsx">{"{{items}}"}</li>
          </ul>
        </div>
      </div>
    </motion.div>;
}