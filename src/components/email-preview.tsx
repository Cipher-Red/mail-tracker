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
  return <div className="border border-border rounded-md overflow-hidden" data-unique-id="28b5caa3-5f89-4260-993d-f5c4ddf639f5" data-file-name="components/email-preview.tsx">
      <div className="bg-muted p-3 border-b border-border" data-unique-id="6052898f-a1c5-4af0-8d10-6071a8b371a1" data-file-name="components/email-preview.tsx">
        <div className="mb-3" data-unique-id="8b291669-4837-48ad-9546-b40bfd0f7658" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="8bceea49-f03b-4b68-8178-452c3893ad07" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="10e59606-9ee8-4ed5-a8e2-a6f713595c1c" data-file-name="components/email-preview.tsx">From: </span></span>
          <span className="text-sm" data-unique-id="005e7221-92c8-4f15-a931-ac5a2b837fe7" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="077eaabd-2784-47d5-935b-94591b785346" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{senderInfo.name} &lt;{senderInfo.email}&gt;</span></span>
        </div>
        <div className="mb-3" data-unique-id="d2f7e821-ca59-464d-8236-29caf74659ea" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="40565564-b06a-4b73-bb10-c50c47217870" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="ce66323a-bb48-4b07-84ea-4e9d4411ba1c" data-file-name="components/email-preview.tsx">To: </span></span>
          <span className="text-sm" data-unique-id="ef11156a-0cdc-400a-9925-1390ed62d4c5" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{previewData.customerName}<span className="editable-text" data-unique-id="fa4e3aa4-fe7a-4b52-8c84-50f550df8ccd" data-file-name="components/email-preview.tsx"> &lt;customer@example.com&gt;</span></span>
        </div>
        <div className="mb-2" data-unique-id="1a564c4d-04ff-4682-83b7-0aa4cc7fa664" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="cac8cf14-84dd-4c69-87e2-b9ba99b5a6f1" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="aa80fd85-6822-4020-b67d-80c45179aaf8" data-file-name="components/email-preview.tsx">Subject: </span></span>
          <span className="text-sm font-medium" data-unique-id="6200149a-61ce-427c-9eb5-787dba8afe35" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{processedSubject}</span>
        </div>
        <div data-unique-id="fbe8a30c-72aa-4212-8cab-7e920d6caa9e" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="29a539e9-a683-4868-a969-4905c9ba8876" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="365aef87-eab4-4241-978b-f709e6eaeee9" data-file-name="components/email-preview.tsx">Preheader: </span></span>
          <span className="text-xs italic" data-unique-id="1d996428-b0f7-4e36-8cd7-4d8fdafc858d" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{template.preheader}</span>
        </div>
      </div>

      <div className="p-4 bg-white" data-unique-id="604028bb-b95a-4941-9224-05906846198d" data-file-name="components/email-preview.tsx">
        <div className="flex justify-end space-x-2 mb-4" data-unique-id="3eba571e-3e5b-433a-b6b1-8670441add81" data-file-name="components/email-preview.tsx">
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
        }} className="flex items-center px-3 py-1 text-xs bg-secondary hover:bg-secondary/90 rounded-md transition-colors" title="Download HTML" data-unique-id="57d1b7e9-bb9e-43df-927b-0471394eb21c" data-file-name="components/email-preview.tsx">
            <Download className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="16b149fc-adc5-44d9-b34f-77fe7b3f5b69" data-file-name="components/email-preview.tsx">
            HTML
          </span></button>
          <button onClick={() => {
          const html = generateHtmlEmail(template, previewData);
          navigator.clipboard.writeText(html);
          alert("HTML copied to clipboard!");
        }} className="flex items-center px-3 py-1 text-xs bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy HTML" data-unique-id="fb2284b3-c668-4346-b9a0-a4e0f73b673c" data-file-name="components/email-preview.tsx">
            <Copy className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="67d97189-89b1-475a-95d7-22e0242e95d4" data-file-name="components/email-preview.tsx">
            Copy
          </span></button>
          <button onClick={() => {
          const testEmail = prompt("Enter an email address to send a test email to:", "");
          if (testEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
            sendTestEmail(testEmail);
          } else if (testEmail) {
            alert("Please enter a valid email address");
          }
        }} className="flex items-center px-3 py-1 text-xs bg-primary text-white hover:bg-primary/90 rounded-md transition-colors" title="Send Test Email" data-unique-id="cfc55537-5a0c-4327-97c5-aa5732ed9123" data-file-name="components/email-preview.tsx">
            <Mail className="h-3 w-3 mr-1" />
            <span data-unique-id="0e135bfb-5d0a-4377-8337-8bcf62cd323e" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="275583b2-648d-4df4-a67b-b5cf04ee2193" data-file-name="components/email-preview.tsx">Test Send</span></span>
          </button>
        </div>
        <div className="border-b border-border pb-4 mb-4" data-unique-id="bf8a097c-d602-4ae2-8919-65d3f03d2309" data-file-name="components/email-preview.tsx">
          <img src="https://picsum.photos/200" alt="Detroit Axle" className="h-10 object-contain mb-4" data-unique-id="2388e7b7-0713-4ee4-aa48-94573c9ee3e9" data-file-name="components/email-preview.tsx" />
        </div>
        <div className="email-content whitespace-pre-wrap" data-unique-id="7e021ec6-7d05-4b28-9bea-e23b29e74e24" data-file-name="components/email-preview.tsx" data-dynamic-text="true">
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
              parts.push(<a key={`${i}-${match.index}`} href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${match[0]}`} target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium" data-unique-id="b9117806-48fa-47d6-8fab-0231e3fab556" data-file-name="components/email-preview.tsx" data-dynamic-text="true">
                    {match[0]}
                  </a>);
              lastIndex = match.index + match[0].length;
            }

            // Add any remaining text
            parts.push(line.substring(lastIndex));
            return <p key={i} className="mb-3" data-unique-id="c876b38c-c843-4576-9fc6-52c372e85633" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{parts}</p>;
          }
          return <p key={i} className={`${line.trim() === "" ? "h-4" : "mb-3"}`} data-unique-id="7afbfce0-eb30-484b-88a3-d298946476d8" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{line}</p>;
        })}
        </div>
        <div className="mt-6 pt-4 border-t border-border text-sm text-muted-foreground" data-unique-id="f535680f-e3b5-40ed-b24a-4ec57ff3c052" data-file-name="components/email-preview.tsx">
          <p className="mb-2" data-unique-id="f6aba0df-b2dd-4a69-8b3f-6fa8f2728160" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="01b5cfab-3246-40e9-8405-c03cf0fc577b" data-file-name="components/email-preview.tsx">Detroit Axle</span></p>
          <p className="mb-2" data-unique-id="c7c49341-af93-40f5-961e-d8031d475632" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="5d49589e-e6f8-461f-b9ca-a215c68edb11" data-file-name="components/email-preview.tsx">Customer Support: 888-583-0255</span></p>
          <p data-unique-id="dcad81cc-5859-4a68-98f1-aa7aab0e2f13" data-file-name="components/email-preview.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="c63027f6-1702-48cf-a9d7-a541da816e16" data-file-name="components/email-preview.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="1641edad-38d7-4caf-8275-a1325735f490" data-file-name="components/email-preview.tsx"> Detroit Axle. All rights reserved.</span></p>
        </div>
      </div>
    </div>;
}