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

export const copyRichEmailContent = async (html: string): Promise<boolean> => {
  try {
    // For modern browsers supporting ClipboardItem
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const nav = navigator;
      const win = window;
      if (nav.clipboard && win.ClipboardItem) {
        // Process the HTML to enhance tracking links before copying
        const processedHtml = enhanceTrackingLinksForCopy(html);
        
        // Create both HTML and text versions for better compatibility
        const htmlBlob = new Blob([processedHtml], { type: 'text/html' });
        
        // Create a better plain text version that includes tracking URLs
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = processedHtml;
        
        // Replace tracking links with a better format in plain text
        const trackingLinks = tempDiv.querySelectorAll('.tracking-link');
        trackingLinks.forEach(link => {
          const trackingNumber = link.getAttribute('data-tracking');
          const trackingUrl = link.getAttribute('href');
          if (trackingNumber && trackingUrl) {
            const textNode = document.createTextNode(`${trackingNumber} (${trackingUrl})`);
            link.parentNode?.replaceChild(textNode, link);
          }
        });
        
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        const textBlob = new Blob([plainText], { type: 'text/plain' });
        
        // Copy both formats to the clipboard
        const data = [
          new win.ClipboardItem({
            'text/html': htmlBlob,
            'text/plain': textBlob
          })
        ];
        
        await nav.clipboard.write(data);
        return true;
      }
    }
    // Fallback to standard copy method
    return copy(html);
  } catch (error) {
    console.error('Error copying rich content:', error);
    // Fallback to simple copy
    return copy(html);
  }
};

// Helper function to enhance tracking links for better copy-paste experience
function enhanceTrackingLinksForCopy(html: string): string {
  if (typeof document === 'undefined') return html;
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Find all tracking links
  const trackingLinks = tempDiv.querySelectorAll('.tracking-link');
  trackingLinks.forEach(link => {
    const trackingNumber = link.getAttribute('data-tracking');
    const href = link.getAttribute('href');
    
    if (trackingNumber && href) {
      // Make sure the link has proper attributes for copying
      link.setAttribute('title', `Track package: ${trackingNumber}`);
      link.setAttribute('data-url', href);
      
      // Add a hidden span with the URL for better plain text copying if it doesn't exist
      if (!link.parentElement?.querySelector('span[style*="font-size:0"]')) {
        const urlSpan = document.createElement('span');
        urlSpan.style.fontSize = '0';
        urlSpan.style.position = 'absolute';
        urlSpan.style.height = '1px';
        urlSpan.style.width = '1px';
        urlSpan.style.overflow = 'hidden';
        urlSpan.textContent = `(${href})`;
        
        // Wrap in a span if not already wrapped
        if (!link.parentElement?.classList.contains('tracking-wrapper')) {
          const wrapper = document.createElement('span');
          wrapper.classList.add('tracking-wrapper');
          wrapper.style.display = 'inline';
          link.parentNode?.insertBefore(wrapper, link);
          wrapper.appendChild(link);
          wrapper.appendChild(urlSpan);
        } else {
          link.parentElement.appendChild(urlSpan);
        }
      }
    }
  });
  
  return tempDiv.innerHTML;
}

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
    // Use empty string instead of undefined/null for replacements
    const safeValue = value !== undefined && value !== null ? value : '';
    subject = subject.replace(regex, safeValue);
    content = content.replace(regex, safeValue);
  });
  
  // Process line breaks and make tracking numbers clickable
  const htmlContent = content.split("\n").map(line => {
    if (line.trim() === "") return "<br />";
    
    // Look for tracking numbers in the line
    const trackingNumberPattern = /\b([A-Z0-9]{8,30})\b/g;
    let processedLine = line;
    
    // Replace tracking numbers with copyable FedEx links
    processedLine = processedLine.replace(trackingNumberPattern, (match) => {
      const trackingUrl = `https://www.fedex.com/apps/fedextrack/?tracknumbers=${match}`;
      // Enhanced link with better copy-paste attributes and a special wrapper span
      return `<span class="tracking-wrapper" style="display:inline;">
        <a href="${trackingUrl}" target="_blank" style="color: #0063A5; text-decoration: underline; font-weight: 500;" data-tracking="${match}" class="tracking-link">${match}</a>
        <span style="font-size:0;position:absolute;height:1px;width:1px;overflow:hidden;">(${trackingUrl})</span>
      </span>`;
    });
    
    return `<p>${processedLine}</p>`;
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
    <h2 style="margin: 0; color: #6366f1;">Detroit Axle</h2>
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
