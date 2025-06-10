'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, Copy, Download, RefreshCw } from 'lucide-react';
import { generateText, getTextProviders } from '@/lib/api/util';
import { TemplateData } from '@/lib/email-utils';
interface AITemplateGeneratorProps {
  onTemplateGenerated: (template: TemplateData) => void;
}
export default function AITemplateGenerator({
  onTemplateGenerated
}: AITemplateGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash-exp');
  const [generatedTemplate, setGeneratedTemplate] = useState<TemplateData | null>(null);
  const availableModels = getTextProviders();
  const generateTemplate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const systemPrompt = `You are an expert email template designer for Detroit Axle, an automotive parts company. 
      Create a professional email template based on the user's request. 
      
      Return ONLY a JSON object with this exact structure:
      {
        "name": "Template Name",
        "subject": "Email Subject Line",
        "preheader": "Brief preview text",
        "content": "Email body content with variables like {{customerName}}, {{orderNumber}}, {{trackingNumber}}, {{address}}, {{orderDate}}, {{items}}, {{orderTotal}}"
      }
      
      Make the content professional, friendly, and appropriate for automotive parts customers. Include relevant variables where appropriate.`;
      const fullPrompt = `${systemPrompt}\n\nUser request: ${prompt}`;
      const result = await generateText(fullPrompt, selectedModel);

      // Parse the JSON response
      const templateData = JSON.parse(result.text.trim());
      const newTemplate: TemplateData = {
        id: `ai-${Date.now()}`,
        name: templateData.name,
        subject: templateData.subject,
        preheader: templateData.preheader || '',
        content: templateData.content
      };
      setGeneratedTemplate(newTemplate);
    } catch (error) {
      console.error('Error generating template:', error);
      alert('Failed to generate template. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  const useTemplate = () => {
    if (generatedTemplate) {
      onTemplateGenerated(generatedTemplate);
      setGeneratedTemplate(null);
      setPrompt('');
    }
  };
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200" data-unique-id="151921fc-ddb1-4eb7-8d98-f0f55d18f786" data-file-name="components/ai-template-generator.tsx">
      <div className="flex items-center mb-4" data-unique-id="d5f04bed-b29c-4725-9d43-9ffb5f2856a3" data-file-name="components/ai-template-generator.tsx">
        <Sparkles className="h-6 w-6 text-purple-600 mr-2" />
        <h3 className="text-xl font-semibold text-gray-800" data-unique-id="6655a868-5f48-4d26-8742-d2c31f3e48f1" data-file-name="components/ai-template-generator.tsx"><span className="editable-text" data-unique-id="3c840002-e1ff-40b0-b74a-8b5abb483baa" data-file-name="components/ai-template-generator.tsx">AI Template Generator</span></h3>
      </div>

      <div className="space-y-4" data-unique-id="287b0014-513a-44b3-93d6-23512c8cd8ca" data-file-name="components/ai-template-generator.tsx" data-dynamic-text="true">
        <div data-unique-id="70c346d3-bda8-47cc-ad22-e6f4487c9c5b" data-file-name="components/ai-template-generator.tsx">
          <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="468ec266-4f89-45da-884d-93c93c49d98e" data-file-name="components/ai-template-generator.tsx"><span className="editable-text" data-unique-id="aee6cfc6-94dc-4064-b676-a47754a0e176" data-file-name="components/ai-template-generator.tsx">
            AI Model
          </span></label>
          <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" data-unique-id="810829e8-da9d-475b-9063-870ddaf9e747" data-file-name="components/ai-template-generator.tsx" data-dynamic-text="true">
            {availableModels.map(model => <option key={model} value={model} data-unique-id="50f8c34e-0a0b-4bf0-bc8f-cb43af4f7e81" data-file-name="components/ai-template-generator.tsx" data-dynamic-text="true">
                {model === 'gemini-2.0-flash-exp' ? 'Gemini 2.0 Flash' : model === 'gemini-1.5-pro' ? 'Gemini 1.5 Pro' : model}
              </option>)}
          </select>
        </div>

        <div data-unique-id="ff0b8cef-c802-4e18-9376-51c0070b4877" data-file-name="components/ai-template-generator.tsx">
          <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="fb810bb0-4676-48b9-a027-cdcb706f7703" data-file-name="components/ai-template-generator.tsx"><span className="editable-text" data-unique-id="14e74316-6cfa-46d9-8b5d-49a7609be9a6" data-file-name="components/ai-template-generator.tsx">
            Describe the email template you want to create
          </span></label>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="e.g., Create a shipping confirmation email for automotive parts orders with tracking information..." rows={4} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none" data-unique-id="390472de-8e6f-4240-b68d-b0c54eec4022" data-file-name="components/ai-template-generator.tsx" />
        </div>

        <button onClick={generateTemplate} disabled={isGenerating || !prompt.trim()} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" data-unique-id="405e73ca-c281-47af-a4db-0afa9e33ad49" data-file-name="components/ai-template-generator.tsx" data-dynamic-text="true">
          {isGenerating ? <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Generating Template...
            </> : <>
              <Sparkles className="h-5 w-5 mr-2" />
              Generate Template
            </>}
        </button>

        {generatedTemplate && <motion.div initial={{
        opacity: 0,
        scale: 0.95
      }} animate={{
        opacity: 1,
        scale: 1
      }} className="mt-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm" data-unique-id="ae2fa8d0-077f-4242-aa35-6ffc8098cdeb" data-file-name="components/ai-template-generator.tsx">
            <h4 className="font-semibold text-gray-800 mb-2" data-unique-id="de12a7bb-298d-445e-98d9-c3ad2bb43a42" data-file-name="components/ai-template-generator.tsx"><span className="editable-text" data-unique-id="8b585faf-7d21-456b-92f9-443623ede477" data-file-name="components/ai-template-generator.tsx">Generated Template</span></h4>
            <div className="space-y-2 text-sm" data-unique-id="a4a7ff9a-c5a8-4e7d-af99-338fc4c4034c" data-file-name="components/ai-template-generator.tsx">
              <div data-unique-id="f35f5560-1f43-4910-989f-780ac1c1cf20" data-file-name="components/ai-template-generator.tsx">
                <span className="font-medium text-gray-600" data-unique-id="4baa7067-2c50-4a9c-a717-23deb0e6891a" data-file-name="components/ai-template-generator.tsx"><span className="editable-text" data-unique-id="a400548f-4c46-43a6-8a70-6e590afac296" data-file-name="components/ai-template-generator.tsx">Name:</span></span>
                <span className="ml-2 text-gray-800" data-unique-id="8e391989-de01-4c7c-8926-4a30be1d4e97" data-file-name="components/ai-template-generator.tsx" data-dynamic-text="true">{generatedTemplate.name}</span>
              </div>
              <div data-unique-id="dec009f3-4c9b-4b7a-abc8-85ebbd52fa00" data-file-name="components/ai-template-generator.tsx">
                <span className="font-medium text-gray-600" data-unique-id="69560c99-c783-4c73-a09b-fe4531dc5a0f" data-file-name="components/ai-template-generator.tsx"><span className="editable-text" data-unique-id="854d4366-4950-41e9-8512-9c21ba8882c8" data-file-name="components/ai-template-generator.tsx">Subject:</span></span>
                <span className="ml-2 text-gray-800" data-unique-id="003bc72d-0c3f-4031-919b-45774a1e929f" data-file-name="components/ai-template-generator.tsx" data-dynamic-text="true">{generatedTemplate.subject}</span>
              </div>
              <div data-unique-id="c885f37b-a80c-44b8-bb3a-cdd464bf33a6" data-file-name="components/ai-template-generator.tsx">
                <span className="font-medium text-gray-600" data-unique-id="fef6d669-18e6-4d1f-869d-ea38aedb9722" data-file-name="components/ai-template-generator.tsx"><span className="editable-text" data-unique-id="e6746a64-809e-4fbe-80d6-7dd67a9f82c0" data-file-name="components/ai-template-generator.tsx">Content Preview:</span></span>
                <div className="ml-2 text-gray-800 bg-gray-50 p-2 rounded mt-1 max-h-32 overflow-y-auto" data-unique-id="3eaf24dc-e180-4775-9eff-6ac9c2876cd3" data-file-name="components/ai-template-generator.tsx" data-dynamic-text="true">
                  {generatedTemplate.content.substring(0, 200)}<span className="editable-text" data-unique-id="798547e6-aed8-4b87-aa46-49047d153b0b" data-file-name="components/ai-template-generator.tsx">...
                </span></div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4" data-unique-id="a0c0b3b8-2784-4b56-a4ff-49e875b07041" data-file-name="components/ai-template-generator.tsx">
              <button onClick={useTemplate} className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center" data-unique-id="aef2fbf4-fef7-4be1-90f5-3275ff056b12" data-file-name="components/ai-template-generator.tsx">
                <Copy className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="b2b7124e-cc87-4c60-b75b-449383eaac2f" data-file-name="components/ai-template-generator.tsx">
                Use This Template
              </span></button>
              <button onClick={() => setGeneratedTemplate(null)} className="px-4 py-2 text-gray-600 hover:text-gray-800" data-unique-id="7d90bdbd-be7c-457f-9ad6-7424cc2c307d" data-file-name="components/ai-template-generator.tsx">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </motion.div>}
      </div>
    </motion.div>;
}