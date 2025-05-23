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
  return <div className="border border-border rounded-md overflow-hidden" data-unique-id="03f10b4e-c0e5-4c17-9562-4aba97f2ed18" data-file-name="components/email-preview.tsx">
      <div className="bg-muted p-3 border-b border-border" data-unique-id="81a36acb-1a67-4fad-a39f-f4a53e291f27" data-file-name="components/email-preview.tsx">
        <div className="mb-3" data-unique-id="15306dd7-ad00-4e6b-b1b0-e9ee4091c43a" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="6d14ca69-c9cc-4288-949e-8ac95845cf08" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="8b00f7cb-08f9-4345-9780-5216c0471b91" data-file-name="components/email-preview.tsx">From: </span></span>
          <span className="text-sm" data-unique-id="82ce442f-be7d-435b-a876-51793d8669df" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="6fcbfa4f-5c9e-4b9d-ac30-39be85557b33" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{senderInfo.name} &lt;{senderInfo.email}&gt;</span></span>
        </div>
        <div className="mb-3" data-unique-id="2d3c20d2-629b-439d-b1f6-480c6e29c28f" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="2733e217-4c94-443b-92b7-403420ad5d71" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="2058f193-bd7e-4b29-811f-38ac54e7c8ed" data-file-name="components/email-preview.tsx">To: </span></span>
          <span className="text-sm" data-unique-id="a8677e7f-ce04-45ac-8f4a-2b13aca69847" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{previewData.customerName}<span className="editable-text" data-unique-id="03fb4c05-cedb-41c2-84d5-a716450b45cd" data-file-name="components/email-preview.tsx"> &lt;customer@example.com&gt;</span></span>
        </div>
        <div className="mb-2" data-unique-id="94cf3f53-ddad-42f2-be86-8ec09a2696f0" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="c193acc1-9470-4ea9-ba59-59edd1e4794a" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="d918a83e-6174-436f-ae68-75add13a913c" data-file-name="components/email-preview.tsx">Subject: </span></span>
          <span className="text-sm font-medium" data-unique-id="80c19e12-940f-4e9e-a80a-beb3568f9ecd" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{processedSubject}</span>
        </div>
        <div data-unique-id="f3f226fd-ed2f-4181-9e88-db1dcead9ef0" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="5fd6e634-efc9-4a81-a5ef-f86bcf8b2618" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="177ca4b6-1c67-4023-bc17-24494b46f308" data-file-name="components/email-preview.tsx">Preheader: </span></span>
          <span className="text-xs italic" data-unique-id="4a8955f5-72e9-4905-8249-f5de2b3134e9" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{template.preheader}</span>
        </div>
      </div>

      <div className="p-4 bg-white" data-unique-id="9b3ff7ac-3e0f-4758-8dd7-af88466ec6fd" data-file-name="components/email-preview.tsx">
        <div className="flex justify-end space-x-2 mb-4" data-unique-id="d1c6f13a-f7b5-4455-90fc-31dbb34b4e10" data-file-name="components/email-preview.tsx">
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
        }} className="flex items-center px-3 py-1 text-xs bg-secondary hover:bg-secondary/90 rounded-md transition-colors" title="Download HTML" data-unique-id="27dbe631-074a-4b91-9dd9-c80b9d7cc14d" data-file-name="components/email-preview.tsx">
            <Download className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="50c05649-444d-44a4-ba52-bc922c69d7a3" data-file-name="components/email-preview.tsx">
            HTML
          </span></button>
          <button onClick={() => {
          const html = generateHtmlEmail(template, previewData);
          navigator.clipboard.writeText(html);
          alert("HTML copied to clipboard!");
        }} className="flex items-center px-3 py-1 text-xs bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy HTML" data-unique-id="1f633481-f7cb-4a00-b4b8-2225b71d7615" data-file-name="components/email-preview.tsx">
            <Copy className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="d2ed3cb0-36cd-47df-bc2c-a9b9821a08bd" data-file-name="components/email-preview.tsx">
            Copy
          </span></button>
          <button onClick={() => {
          const testEmail = prompt("Enter an email address to send a test email to:", "");
          if (testEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
            sendTestEmail(testEmail);
          } else if (testEmail) {
            alert("Please enter a valid email address");
          }
        }} className="flex items-center px-3 py-1 text-xs bg-primary text-white hover:bg-primary/90 rounded-md transition-colors" title="Send Test Email" data-unique-id="486ccfd4-5c52-4fde-9840-94dc25c7738d" data-file-name="components/email-preview.tsx">
            <Mail className="h-3 w-3 mr-1" />
            <span data-unique-id="e6398921-dc8e-47e9-bd35-fffa28358c27" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="61b456cd-47ad-4b97-b940-8b11304d394e" data-file-name="components/email-preview.tsx">Test Send</span></span>
          </button>
        </div>
        <div className="border-b border-border pb-4 mb-4" data-unique-id="6eb2b1c8-5d1d-4fb9-9033-2dc0c67b544f" data-file-name="components/email-preview.tsx">
          <img src="https://picsum.photos/200" alt="Detroit Axle" className="h-10 object-contain mb-4" data-unique-id="7a3f58a6-8aa3-45e6-930a-67a3a4dd96de" data-file-name="components/email-preview.tsx" />
        </div>
        <div className="email-content whitespace-pre-wrap" data-unique-id="ab1749dd-4a39-4ee0-abdb-d825419b89f1" data-file-name="components/email-preview.tsx" data-dynamic-text="true">
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
              parts.push(<a key={`${i}-${match.index}`} href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${match[0]}`} target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium" data-unique-id="09641c67-968b-4add-a5f2-fb96b740dc5e" data-file-name="components/email-preview.tsx" data-dynamic-text="true">
                    {match[0]}
                  </a>);
              lastIndex = match.index + match[0].length;
            }

            // Add any remaining text
            parts.push(line.substring(lastIndex));
            return <p key={i} className="mb-3" data-unique-id="8b646c36-c441-4eb0-9aab-e5c547f30c50" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{parts}</p>;
          }
          return <p key={i} className={`${line.trim() === "" ? "h-4" : "mb-3"}`} data-unique-id="947ba364-2dd0-41c3-a97a-14baaa7071e0" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{line}</p>;
        })}
        </div>
        <div className="mt-6 pt-4 border-t border-border text-sm text-muted-foreground" data-unique-id="70400927-7a5d-40ca-a584-fcbfba99d56e" data-file-name="components/email-preview.tsx">
          <p className="mb-2" data-unique-id="259c00a5-5d04-4996-9356-2b4ea07b05f8" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="222e67f1-35ca-4716-9950-1126e6e24873" data-file-name="components/email-preview.tsx">Detroit Axle</span></p>
          <p className="mb-2" data-unique-id="c40958f7-e63b-490b-bcb4-18c80b409845" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="02bdab0a-d517-4ddb-b599-2a1c183369de" data-file-name="components/email-preview.tsx">Customer Support: 888-583-0255</span></p>
          <p data-unique-id="0f844475-9e5c-4e49-bd4a-939b36d2e5fe" data-file-name="components/email-preview.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="454c96a2-2a85-4c5e-ab8b-3014a4f46619" data-file-name="components/email-preview.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="efb0051d-eaa8-4775-8c20-93647e52e668" data-file-name="components/email-preview.tsx"> Detroit Axle. All rights reserved.</span></p>
        </div>
      </div>
    </div>;
}