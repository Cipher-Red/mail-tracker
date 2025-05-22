"use client";

import { saveAs } from 'file-saver';
import copy from 'copy-to-clipboard';

export interface TemplateData {
  id: string;
  name: string;
  subject: string;
  preheader: string;
  content: string;
}

export const downloadTemplate = (template: TemplateData) => {
  const templateJson = JSON.stringify(template, null, 2);
  const blob = new Blob([templateJson], { type: 'application/json' });
  saveAs(blob, `${template.name.toLowerCase().replace(/\s+/g, '-')}-template.json`);
};

export const copyToClipboard = (text: string): boolean => {
  return copy(text);
};

export interface SenderInfo {
  name: string;
  email: string;
}

export const generateHtmlEmail = (
  template: TemplateData, 
  previewData: Record<string, string> = {},
  senderInfo: SenderInfo = { name: "Detroit Axle Support", email: "employee@detroitaxle.com" }
): string => {
  // Replace variables in template
  let subject = template.subject;
  let content = template.content;
  
  Object.entries(previewData).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    subject = subject.replace(regex, value);
    content = content.replace(regex, value);
  });
  
  // Convert line breaks to HTML
  const htmlContent = content.split("\n").map(line => {
    return line.trim() === "" ? "<br />" : `<p>${line}</p>`;
  }).join("");
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      border-bottom: 1px solid #eaeaea;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eaeaea;
      font-size: 12px;
      color: #666;
    }
    p {
      margin: 0 0 16px;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="https://images.unsplash.com/photo-1612159593345-d117058858d4?auto=format&fit=crop&w=600&h=100&q=80" 
         alt="Detroit Axle" 
         style="height: 40px; object-fit: contain;">
  </div>
  
  <div class="content">
    ${htmlContent}
  </div>
  
  <div class="footer">
    <p>Detroit Axle</p>
    <p>Customer Support: 888-583-0255</p>
    <p>${senderInfo.name} | <a href="mailto:${senderInfo.email}" style="color: #3b82f6; text-decoration: none;">${senderInfo.email}</a></p>
    <p>© ${new Date().getFullYear()} Detroit Axle. All rights reserved.</p>
  </div>
</body>
</html>`;
};
