"use client";

import { useState } from "react";
import { format } from "date-fns";
import { generateHtmlEmail } from "@/lib/email-utils";
import { Download, Copy, Mail } from "lucide-react";
type PreviewData = {
  customerName: string;
  orderNumber: string;
  trackingNumber: string;
  address: string;
  orderDate: string;
  items: string;
};
const sampleData: PreviewData = {
  customerName: "John Smith",
  orderNumber: "ORD-12345678",
  trackingNumber: "TRK-9876543210",
  address: "123 Main St, Detroit, MI 48201",
  orderDate: format(new Date(), "MMM d, yyyy"),
  items: "2x Front Wheel Hub Bearing, 1x Control Arm"
};
export default function EmailPreview({
  template,
  senderInfo = {
    name: "Detroit Axle Support",
    email: "employee@detroitaxle.com"
  }
}: {
  template: {
    id: string;
    name: string;
    subject: string;
    preheader: string;
    content: string;
  };
  senderInfo?: {
    name: string;
    email: string;
  };
}) {
  const [previewData, setPreviewData] = useState<PreviewData>(sampleData);
  const [isSending, setIsSending] = useState(false);

  // Function to send a test email
  const sendTestEmail = async (toEmail: string) => {
    setIsSending(true);
    try {
      // Process template content with preview data
      const processedSubject = processContent(template.subject);
      const processedContent = processContent(template.content);

      // Generate HTML content
      const htmlContent = generateHtmlEmail({
        ...template,
        subject: processedSubject,
        content: processedContent
      }, previewData, senderInfo);

      // Create plain text version
      const textContent = processedContent.replace(/\n/g, '\r\n');

      // Send email via API
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          emails: [{
            to: toEmail,
            from: {
              email: senderInfo.email,
              name: senderInfo.name
            },
            subject: processedSubject,
            html: htmlContent,
            text: textContent
          }]
        })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send test email');
      }
      alert(`Test email sent to ${toEmail} successfully!`);
    } catch (error) {
      console.error('Error sending test email:', error);
      alert(`Error sending test email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSending(false);
    }
  };

  // Replace template variables with actual data
  const processContent = (content: string) => {
    let processed = content;
    Object.entries(previewData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      processed = processed.replace(regex, value);
    });
    return processed;
  };
  const processedContent = processContent(template.content);
  const processedSubject = processContent(template.subject);
  return <div className="border border-border rounded-md overflow-hidden" data-unique-id="cbf13fdc-7585-4549-87db-1662cf8ab29f" data-file-name="components/email-preview.tsx">
      <div className="bg-muted p-3 border-b border-border" data-unique-id="a3f47db3-37cc-43da-85bb-b872c0c13596" data-file-name="components/email-preview.tsx">
        <div className="mb-3" data-unique-id="6b143f34-acfa-4141-b329-776878723a45" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="b46b39d6-1ce7-434b-878f-b23e5074433c" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="fc56e86f-94b9-4e94-bd30-4227a189ea91" data-file-name="components/email-preview.tsx">From: </span></span>
          <span className="text-sm" data-unique-id="4a9900da-3a52-4742-917d-d4c0f20b4bdc" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="8a37132c-4320-4dad-97f5-97902f64ec73" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{senderInfo.name} &lt;{senderInfo.email}&gt;</span></span>
        </div>
        <div className="mb-3" data-unique-id="41114867-d839-4fd3-ad9c-81f099c42160" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="db382b65-452e-41ed-a4fa-e9ae56f0fdfb" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="cee00e0f-bdcf-4778-8fb0-98b967152147" data-file-name="components/email-preview.tsx">To: </span></span>
          <span className="text-sm" data-unique-id="140645b7-168c-4d6d-8bc3-104e76d56ea2" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{previewData.customerName}<span className="editable-text" data-unique-id="fb346713-02ef-4e41-9578-267452dee257" data-file-name="components/email-preview.tsx"> &lt;customer@example.com&gt;</span></span>
        </div>
        <div className="mb-2" data-unique-id="63d993b8-909c-4007-bd70-3310ae2004d4" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="f4dd8168-6cc1-471a-a2c0-1939abe52278" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="35629502-6181-4f58-9beb-60eb2a8c4760" data-file-name="components/email-preview.tsx">Subject: </span></span>
          <span className="text-sm font-medium" data-unique-id="3b777a89-7bb7-4141-bd4d-aed3c88b6c72" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{processedSubject}</span>
        </div>
        <div data-unique-id="db914b09-3463-4c7f-9cce-fb3136c3c9a8" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="0b8d22e6-e58d-4a63-8f3a-1c95eaf32171" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="a1dda806-c27b-46c0-becb-b24349ac6158" data-file-name="components/email-preview.tsx">Preheader: </span></span>
          <span className="text-xs italic" data-unique-id="0c06b58e-4f6a-4e7e-a20e-a0fa6a09cad2" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{template.preheader}</span>
        </div>
      </div>

      <div className="p-4 bg-white" data-unique-id="4aa7f839-ed82-4914-830d-d6900268741a" data-file-name="components/email-preview.tsx">
        <div className="flex justify-end space-x-2 mb-4" data-unique-id="6970984b-b6d5-4332-84ed-7d287847988b" data-file-name="components/email-preview.tsx">
          <button onClick={() => {
          const html = generateHtmlEmail(template, previewData);
          const blob = new Blob([html], {
            type: 'text/html'
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${template.name.toLowerCase().replace(/\s+/g, '-')}.html`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }} className="flex items-center px-3 py-1 text-xs bg-secondary hover:bg-secondary/90 rounded-md transition-colors" title="Download HTML" data-unique-id="40a4f4c5-9a6e-4c13-87a0-27fb4f0891a6" data-file-name="components/email-preview.tsx">
            <Download className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="e1d89eb3-282b-4df9-97bf-019d0af566cb" data-file-name="components/email-preview.tsx">
            HTML
          </span></button>
          <button onClick={() => {
          const html = generateHtmlEmail(template, previewData);
          navigator.clipboard.writeText(html);
          alert("HTML copied to clipboard!");
        }} className="flex items-center px-3 py-1 text-xs bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy HTML" data-unique-id="8c09f226-d10f-4aae-80e2-b42c3f32b7ca" data-file-name="components/email-preview.tsx">
            <Copy className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="74b50098-78c0-4e94-9843-8ab024fb0a15" data-file-name="components/email-preview.tsx">
            Copy
          </span></button>
          <button onClick={() => {
          const testEmail = prompt("Enter an email address to send a test email to:", "");
          if (testEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
            sendTestEmail(testEmail);
          } else if (testEmail) {
            alert("Please enter a valid email address");
          }
        }} className="flex items-center px-3 py-1 text-xs bg-primary text-white hover:bg-primary/90 rounded-md transition-colors" title="Send Test Email" data-unique-id="56e873c2-19d3-4a34-8a8a-69be7d617f28" data-file-name="components/email-preview.tsx">
            <Mail className="h-3 w-3 mr-1" />
            <span data-unique-id="8b789543-a0ad-49aa-b72e-7d367488a1c1" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="ac22a68c-c3a5-49d6-8ed3-de0554e698c7" data-file-name="components/email-preview.tsx">Test Send</span></span>
          </button>
        </div>
        <div className="border-b border-border pb-4 mb-4" data-unique-id="339db133-74e5-4847-88b8-afd4df331d7d" data-file-name="components/email-preview.tsx">
          <img src="https://picsum.photos/200" alt="Detroit Axle" className="h-10 object-contain mb-4" data-unique-id="ad540e02-4dac-4ac8-b5ad-f9affafb1a11" data-file-name="components/email-preview.tsx" />
        </div>
        <div className="email-content whitespace-pre-wrap" data-unique-id="d858beff-c674-433d-a151-c413b95f106a" data-file-name="components/email-preview.tsx" data-dynamic-text="true">
          {processedContent.split("\n").map((line, i) => <p key={i} className={`${line.trim() === "" ? "h-4" : "mb-3"}`} data-unique-id="9a9bab82-29d5-4e80-a65c-07a9b1a2a336" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{line}</p>)}
        </div>
        <div className="mt-6 pt-4 border-t border-border text-sm text-muted-foreground" data-unique-id="61861438-9621-4034-b3e0-0ae2affaef35" data-file-name="components/email-preview.tsx">
          <p className="mb-2" data-unique-id="0d4664fa-cde6-42ba-87c2-8fe578a2e1ab" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="32b1cf34-d3c5-438a-88f5-151e757aa6c6" data-file-name="components/email-preview.tsx">Detroit Axle</span></p>
          <p className="mb-2" data-unique-id="c1f418ef-d6a3-436a-ad3c-cb7816e3f774" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="a3f9e30a-8922-4ea8-980b-d57d1aa8a414" data-file-name="components/email-preview.tsx">Customer Support: 888-583-0255</span></p>
          <p data-unique-id="d58d88ad-82e1-4292-a37c-8d5457e9bcf9" data-file-name="components/email-preview.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="a2c18a53-eae4-4a96-ad45-db78e1a1a655" data-file-name="components/email-preview.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="abceeda4-4340-4ad5-b9f3-0712b3bc8984" data-file-name="components/email-preview.tsx"> Detroit Axle. All rights reserved.</span></p>
        </div>
      </div>
    </div>;
}