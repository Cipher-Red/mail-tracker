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
  return <div className="border border-border rounded-md overflow-hidden" data-unique-id="7fe70590-5536-4e30-8790-0bd1701228a6" data-file-name="components/email-preview.tsx">
      <div className="bg-muted p-3 border-b border-border" data-unique-id="b653c083-8a0e-45bd-a75c-05f6c7ff92ca" data-file-name="components/email-preview.tsx">
        <div className="mb-3" data-unique-id="2973a5e6-d9e8-444b-9d2b-3e15b6607ad4" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="ca7580bd-766a-4e26-9043-de55ad7ffdcd" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="e32f0bd9-ae9c-44bf-a881-da215075a009" data-file-name="components/email-preview.tsx">From: </span></span>
          <span className="text-sm" data-unique-id="ebef7657-2a24-471e-94b4-82d394b21d05" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="200f3865-7a5a-42cf-aab2-7896cd6bb512" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{senderInfo.name} &lt;{senderInfo.email}&gt;</span></span>
        </div>
        <div className="mb-3" data-unique-id="577f99bf-42db-4db6-8658-c96b3e50a476" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="b8dd775f-930f-4580-a3b2-043e60fa3aa6" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="35fa426c-b12c-4637-a377-dc5aa375540e" data-file-name="components/email-preview.tsx">To: </span></span>
          <span className="text-sm" data-unique-id="4d0ad93b-58c3-4566-98ef-67026e2007b8" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{previewData.customerName}<span className="editable-text" data-unique-id="49187285-62be-4b37-a47f-e0af4ed06b4e" data-file-name="components/email-preview.tsx"> &lt;customer@example.com&gt;</span></span>
        </div>
        <div className="mb-2" data-unique-id="c44c04c6-9bf7-4db3-a5b4-5e8f9b0d5b60" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="e0420699-3ab7-4588-84e3-cdc0f87acd50" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="5a855bc6-016f-4616-b6ff-cb7f18e0318a" data-file-name="components/email-preview.tsx">Subject: </span></span>
          <span className="text-sm font-medium" data-unique-id="cd6fb469-f348-4075-8f6c-e5591dbe17d3" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{processedSubject}</span>
        </div>
        <div data-unique-id="c82e62c4-967e-472a-8110-6a2769e93591" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="6de64052-bf21-4ab2-b64f-24bba031153e" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="583d0be3-d78e-493a-aaa9-3d0670eedd0d" data-file-name="components/email-preview.tsx">Preheader: </span></span>
          <span className="text-xs italic" data-unique-id="786b7ecc-1a72-426d-9009-433dda3cbf95" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{template.preheader}</span>
        </div>
      </div>

      <div className="p-4 bg-white" data-unique-id="ef0e09f1-a7b4-4d39-813a-aab170b67867" data-file-name="components/email-preview.tsx">
        <div className="flex justify-end space-x-2 mb-4" data-unique-id="ff78d650-a10b-4732-ba91-0f0f214eccf2" data-file-name="components/email-preview.tsx">
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
        }} className="flex items-center px-3 py-1 text-xs bg-secondary hover:bg-secondary/90 rounded-md transition-colors" title="Download HTML" data-unique-id="ef415b88-acd8-4d41-a28f-fe99ff7cb0cc" data-file-name="components/email-preview.tsx">
            <Download className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="950d0e30-b874-4164-9c86-221d1ae831e5" data-file-name="components/email-preview.tsx">
            HTML
          </span></button>
          <button onClick={() => {
          const html = generateHtmlEmail(template, previewData);
          navigator.clipboard.writeText(html);
          alert("HTML copied to clipboard!");
        }} className="flex items-center px-3 py-1 text-xs bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy HTML" data-unique-id="52bc2764-16cf-4b81-8e7d-d4a57359765e" data-file-name="components/email-preview.tsx">
            <Copy className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="22a16ad4-1ce1-4ab1-afb2-2b4d7528175f" data-file-name="components/email-preview.tsx">
            Copy
          </span></button>
          <button onClick={() => {
          const testEmail = prompt("Enter an email address to send a test email to:", "");
          if (testEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
            sendTestEmail(testEmail);
          } else if (testEmail) {
            alert("Please enter a valid email address");
          }
        }} className="flex items-center px-3 py-1 text-xs bg-primary text-white hover:bg-primary/90 rounded-md transition-colors" title="Send Test Email" data-unique-id="16adfdd6-a314-494e-adfc-9e9d67a1e105" data-file-name="components/email-preview.tsx">
            <Mail className="h-3 w-3 mr-1" />
            <span data-unique-id="b8439566-71e0-4cea-ab2f-6cd05980fedb" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="95b7eedf-9fd3-4f17-a7ff-9c170765184b" data-file-name="components/email-preview.tsx">Test Send</span></span>
          </button>
        </div>
        <div className="border-b border-border pb-4 mb-4" data-unique-id="f2b09230-ac6b-4bd0-b1be-0f2cfbf1ba9b" data-file-name="components/email-preview.tsx">
          <img src="https://picsum.photos/200" alt="Detroit Axle" className="h-10 object-contain mb-4" data-unique-id="e049a6bd-aed7-4ebd-81c4-79a17f17a2de" data-file-name="components/email-preview.tsx" />
        </div>
        <div className="email-content whitespace-pre-wrap" data-unique-id="b5e8428c-1d90-44c8-a90e-3be450a21564" data-file-name="components/email-preview.tsx" data-dynamic-text="true">
          {processedContent.split("\n").map((line, i) => {
          // Make tracking numbers clickable in preview
          if (line.includes('Tracking Number:') || line.includes('trackingNumber')) {
            const trackingNumberRegex = /\b([A-Z0-9]{8,30})\b/g;
            const parts = [];
            let lastIndex = 0;
            let match;

            // Find all tracking numbers in the line
            while ((match = trackingNumberRegex.exec(line)) !== null) {
              // Add text before the match
              parts.push(line.substring(lastIndex, match.index));

              // Add the tracking number as a clickable link
              parts.push(<a key={`${i}-${match.index}`} href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${match[0]}`} target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium" data-unique-id="3cdf758c-5fcc-4026-bb76-a0f04721de16" data-file-name="components/email-preview.tsx" data-dynamic-text="true">
                    {match[0]}
                  </a>);
              lastIndex = match.index + match[0].length;
            }

            // Add any remaining text
            parts.push(line.substring(lastIndex));
            return <p key={i} className="mb-3" data-unique-id="3ef10a42-7d50-4913-9598-a2ebdb01771b" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{parts}</p>;
          }
          return <p key={i} className={`${line.trim() === "" ? "h-4" : "mb-3"}`} data-unique-id="d304bf50-953a-4182-a4ab-3c57c3ef062f" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{line}</p>;
        })}
        </div>
        <div className="mt-6 pt-4 border-t border-border text-sm text-muted-foreground" data-unique-id="27520b06-f295-4d38-b673-56d730058f7a" data-file-name="components/email-preview.tsx">
          <p className="mb-2" data-unique-id="f780d7a7-c4b5-41d0-b1d9-baf0265c93ec" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="f06e2d89-6381-4038-a7b4-7771242d308e" data-file-name="components/email-preview.tsx">Detroit Axle</span></p>
          <p className="mb-2" data-unique-id="bc88d2d1-afa6-48be-a155-c8f8af4303da" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="ab12303d-e63f-46e7-8b15-e5223e442629" data-file-name="components/email-preview.tsx">Customer Support: 888-583-0255</span></p>
          <p data-unique-id="1223ce83-354c-49bf-9d70-90331101a436" data-file-name="components/email-preview.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="d50b0709-623e-4c9b-981b-00b70393fb94" data-file-name="components/email-preview.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="19a049d5-ce5f-4537-8117-e7dbe3daf46a" data-file-name="components/email-preview.tsx"> Detroit Axle. All rights reserved.</span></p>
        </div>
      </div>
    </div>;
}