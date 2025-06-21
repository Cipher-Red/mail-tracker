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
  const [selectedModel, setSelectedModel] = useState('claude-bedrock');
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
  }} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200" data-unique-id="d1c9c465-bb75-4882-9d90-504cdef0f29d" data-file-name="components/ai-template-generator.tsx">
      <div className="flex items-center mb-4" data-unique-id="c687c7d0-3620-45c0-b4c2-fcbef38645c1" data-file-name="components/ai-template-generator.tsx">
        <Sparkles className="h-6 w-6 text-purple-600 mr-2" />
        <h3 className="text-xl font-semibold text-gray-800" data-unique-id="11d92cd5-9c41-4aee-ba42-0f417c1d4e3f" data-file-name="components/ai-template-generator.tsx"><span className="editable-text" data-unique-id="d0965198-bcba-431b-a85b-a90d3d0aee5b" data-file-name="components/ai-template-generator.tsx">AI Template Generator</span></h3>
      </div>

      <div className="space-y-4" data-unique-id="5557a7c0-4716-4131-97a5-818384120c5b" data-file-name="components/ai-template-generator.tsx" data-dynamic-text="true">
        <div data-unique-id="5892440d-8115-4e52-b392-749f69dfdb72" data-file-name="components/ai-template-generator.tsx">
          <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="7479be89-9f64-4a7f-ae05-e54e35cd2c91" data-file-name="components/ai-template-generator.tsx"><span className="editable-text" data-unique-id="b81ec2d2-9234-4821-a123-e4a5d8654712" data-file-name="components/ai-template-generator.tsx">
            AI Model
          </span></label>
          <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" data-unique-id="682044d8-1492-4734-a351-d1584707dc70" data-file-name="components/ai-template-generator.tsx" data-dynamic-text="true">
            {availableModels.map(model => <option key={model} value={model} data-unique-id="eb4973ec-ca49-4d41-bc1a-fff99a8cbff4" data-file-name="components/ai-template-generator.tsx" data-dynamic-text="true">
                {model === 'claude-bedrock' ? 'Claude (Bedrock)' : model}
              </option>)}
          </select>
        </div>

        <div data-unique-id="034c0aee-ee88-4f7d-9729-394e9b756e49" data-file-name="components/ai-template-generator.tsx">
          <label className="block text-sm font-medium text-gray-700 mb-2" data-unique-id="ab16f21e-ec27-4ed4-a228-03239669c240" data-file-name="components/ai-template-generator.tsx"><span className="editable-text" data-unique-id="8ec71b13-41a2-4557-be21-ef09f0970be7" data-file-name="components/ai-template-generator.tsx">
            Describe the email template you want to create
          </span></label>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="e.g., Create a shipping confirmation email for automotive parts orders with tracking information..." rows={4} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none" data-unique-id="2ddf77b6-afbc-434f-b69d-9924c499476c" data-file-name="components/ai-template-generator.tsx" />
        </div>

        <button onClick={generateTemplate} disabled={isGenerating || !prompt.trim()} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" data-unique-id="f97751c6-4111-4bfa-8269-8217fbca0c6f" data-file-name="components/ai-template-generator.tsx" data-dynamic-text="true">
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
      }} className="mt-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm" data-unique-id="fcf722bb-fef0-4934-b43e-6c7d5f1f7d6e" data-file-name="components/ai-template-generator.tsx">
            <h4 className="font-semibold text-gray-800 mb-2" data-unique-id="44fe9dc1-50e6-4552-9603-cd594fc4696b" data-file-name="components/ai-template-generator.tsx"><span className="editable-text" data-unique-id="169e81ff-74fa-4a6c-9606-3123f85c6e8a" data-file-name="components/ai-template-generator.tsx">Generated Template</span></h4>
            <div className="space-y-2 text-sm" data-unique-id="3f3b66a5-787e-45a5-8c22-cf116578003d" data-file-name="components/ai-template-generator.tsx">
              <div data-unique-id="28fc88ff-9201-41fc-bd20-01901b03ddb5" data-file-name="components/ai-template-generator.tsx">
                <span className="font-medium text-gray-600" data-unique-id="386db9bc-9336-4549-81a4-4ea98a205182" data-file-name="components/ai-template-generator.tsx"><span className="editable-text" data-unique-id="5b650787-a1d9-4a22-9933-b74cea3473dc" data-file-name="components/ai-template-generator.tsx">Name:</span></span>
                <span className="ml-2 text-gray-800" data-unique-id="b379fa13-8696-4b8b-9284-d0a4c70635e3" data-file-name="components/ai-template-generator.tsx" data-dynamic-text="true">{generatedTemplate.name}</span>
              </div>
              <div data-unique-id="27e113d0-cd59-426b-b4e3-5377f52bf561" data-file-name="components/ai-template-generator.tsx">
                <span className="font-medium text-gray-600" data-unique-id="1d570495-3609-4261-b48d-0ea6d28e8e53" data-file-name="components/ai-template-generator.tsx"><span className="editable-text" data-unique-id="e7809e59-ff10-467b-a949-61d1d0900c20" data-file-name="components/ai-template-generator.tsx">Subject:</span></span>
                <span className="ml-2 text-gray-800" data-unique-id="cdd53413-aedd-488c-956d-9dc6bbdc6783" data-file-name="components/ai-template-generator.tsx" data-dynamic-text="true">{generatedTemplate.subject}</span>
              </div>
              <div data-unique-id="53de5a4f-1ce7-417e-8e05-eff23ee90ecb" data-file-name="components/ai-template-generator.tsx">
                <span className="font-medium text-gray-600" data-unique-id="c59ea5af-3a2a-4f60-b074-ce87d4532881" data-file-name="components/ai-template-generator.tsx"><span className="editable-text" data-unique-id="f36af311-910f-4c92-9508-70d0253a470d" data-file-name="components/ai-template-generator.tsx">Content Preview:</span></span>
                <div className="ml-2 text-gray-800 bg-gray-50 p-2 rounded mt-1 max-h-32 overflow-y-auto" data-unique-id="964068ed-8507-454d-8cf0-5af1ee3d7f23" data-file-name="components/ai-template-generator.tsx" data-dynamic-text="true">
                  {generatedTemplate.content.substring(0, 200)}<span className="editable-text" data-unique-id="f7de634d-0ddf-48ae-b053-92be36f73f11" data-file-name="components/ai-template-generator.tsx">...
                </span></div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4" data-unique-id="9864ec31-1249-40cf-8ee5-ca979cc1d57b" data-file-name="components/ai-template-generator.tsx">
              <button onClick={useTemplate} className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center" data-unique-id="675cf72c-2c24-4737-8d74-a7547ee1d79e" data-file-name="components/ai-template-generator.tsx">
                <Copy className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="a573ab36-4fc7-4cb0-98c1-00e2846e0ceb" data-file-name="components/ai-template-generator.tsx">
                Use This Template
              </span></button>
              <button onClick={() => setGeneratedTemplate(null)} className="px-4 py-2 text-gray-600 hover:text-gray-800" data-unique-id="4f5df9f3-626c-40d1-a1e0-d1513b8e3429" data-file-name="components/ai-template-generator.tsx">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </motion.div>}
      </div>
    </motion.div>;
}