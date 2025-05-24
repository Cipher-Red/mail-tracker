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
  return <div className="border border-border rounded-md overflow-hidden" data-unique-id="d916551d-4419-4804-9227-4f6f715ac6d9" data-file-name="components/email-preview.tsx">
      <div className="bg-muted p-3 border-b border-border" data-unique-id="0504a7ba-59b3-4009-83bc-4e763457ac1d" data-file-name="components/email-preview.tsx">
        <div className="mb-3" data-unique-id="5e08e7f5-0041-4cdd-9e9a-6756ffea2ffc" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="8dde2efb-b46e-4d6b-947c-565ce0aaea63" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="d3fbd67b-71e5-44f8-8583-a97f4be7245c" data-file-name="components/email-preview.tsx">From: </span></span>
          <span className="text-sm" data-unique-id="5a15d5d8-b0c2-4a3c-bf7a-c07e12fef346" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="d7396185-755e-4b38-abb7-e875511cd3cd" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{senderInfo.name} &lt;{senderInfo.email}&gt;</span></span>
        </div>
        <div className="mb-3" data-unique-id="5561accd-2c41-4e8f-bfe6-fcb11bdc18bd" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="ddbccd1a-f21e-4aac-a154-d0638d3d65db" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="a9cb44e4-e3a0-4d07-b722-1f539d664ed2" data-file-name="components/email-preview.tsx">To: </span></span>
          <span className="text-sm" data-unique-id="55f05b9e-7e72-4606-9573-356324c9b4b1" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{previewData.customerName}<span className="editable-text" data-unique-id="61f955b3-f6c3-44d8-893f-fc7a992d88db" data-file-name="components/email-preview.tsx"> &lt;customer@example.com&gt;</span></span>
        </div>
        <div className="mb-2" data-unique-id="993b0933-0932-4808-a71d-7771c6b7e21a" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="b3ccca0f-ecb6-439c-9e81-e1448b2c9da1" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="52650ddc-b846-44c5-b449-de26b2ea785d" data-file-name="components/email-preview.tsx">Subject: </span></span>
          <span className="text-sm font-medium" data-unique-id="bd93a2b7-dcb4-4eac-a7d9-c574f363d6dd" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{processedSubject}</span>
        </div>
        <div data-unique-id="bc18fc81-c61b-4183-9ceb-3e26653c40b5" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="70fb468c-2c3c-4b3a-a409-01906fde2e77" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="08892c54-f0a5-461c-8650-b9d73b2c0d37" data-file-name="components/email-preview.tsx">Preheader: </span></span>
          <span className="text-xs italic" data-unique-id="bde15278-f277-4070-afaf-a11ae3390091" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{template.preheader}</span>
        </div>
      </div>

      <div className="p-4 bg-white" data-unique-id="14f4aee7-bb14-427c-ba51-7eb1da564aa9" data-file-name="components/email-preview.tsx">
        <div className="flex justify-end space-x-2 mb-4" data-unique-id="4a3ef07f-2313-46b9-855c-fdce898d9796" data-file-name="components/email-preview.tsx">
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
        }} className="flex items-center px-3 py-1 text-xs bg-secondary hover:bg-secondary/90 rounded-md transition-colors" title="Download HTML" data-unique-id="94d54452-acb4-499c-ade8-2e2d5214458d" data-file-name="components/email-preview.tsx">
            <Download className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="18d17b3e-f683-420c-8139-259e797f637a" data-file-name="components/email-preview.tsx">
            HTML
          </span></button>
          <button onClick={() => {
          const html = generateHtmlEmail(template, previewData);
          navigator.clipboard.writeText(html);
          alert("HTML copied to clipboard!");
        }} className="flex items-center px-3 py-1 text-xs bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy HTML" data-unique-id="da5fbfbb-8e16-493d-8104-d133f78bbb2c" data-file-name="components/email-preview.tsx">
            <Copy className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="1d6d0cf0-3a9f-42ae-a313-474a4acbed8d" data-file-name="components/email-preview.tsx">
            Copy
          </span></button>
          <button onClick={() => {
          const testEmail = prompt("Enter an email address to send a test email to:", "");
          if (testEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
            sendTestEmail(testEmail);
          } else if (testEmail) {
            alert("Please enter a valid email address");
          }
        }} className="flex items-center px-3 py-1 text-xs bg-primary text-white hover:bg-primary/90 rounded-md transition-colors" title="Send Test Email" data-unique-id="7795ecd2-936b-4356-9e60-406af9a00929" data-file-name="components/email-preview.tsx">
            <Mail className="h-3 w-3 mr-1" />
            <span data-unique-id="13573ae4-3f57-4a7c-9114-6319da1bfbfe" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="8909dba2-981e-4178-bb23-5555e067d151" data-file-name="components/email-preview.tsx">Test Send</span></span>
          </button>
        </div>
        <div className="border-b border-border pb-4 mb-4" data-unique-id="95cec7bd-65ae-458e-b41b-51ed1d1f39c7" data-file-name="components/email-preview.tsx">
          <img src="https://picsum.photos/200" alt="Detroit Axle" className="h-10 object-contain mb-4" data-unique-id="a1aaa409-ec71-4bbf-aab4-30678bb4864d" data-file-name="components/email-preview.tsx" />
        </div>
        <div className="email-content whitespace-pre-wrap" data-unique-id="9928e047-5571-4940-8d4e-ebbf1bf78ef9" data-file-name="components/email-preview.tsx" data-dynamic-text="true">
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
              parts.push(<a key={`${i}-${match.index}`} href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${match[0]}`} target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium" data-unique-id="0d4dd58d-45dc-4f6c-bda1-e120a0ca13df" data-file-name="components/email-preview.tsx" data-dynamic-text="true">
                    {match[0]}
                  </a>);
              lastIndex = match.index + match[0].length;
            }

            // Add any remaining text
            parts.push(line.substring(lastIndex));
            return <p key={i} className="mb-3" data-unique-id="e2c7fde5-97b1-4e4e-9917-2092c8240769" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{parts}</p>;
          }
          return <p key={i} className={`${line.trim() === "" ? "h-4" : "mb-3"}`} data-unique-id="7641e31b-b1ce-443f-9af3-d3e58e1a5f3f" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{line}</p>;
        })}
        </div>
        <div className="mt-6 pt-4 border-t border-border text-sm text-muted-foreground" data-unique-id="9c8567a9-9874-48cf-8492-0d885d6f0b71" data-file-name="components/email-preview.tsx">
          <p className="mb-2" data-unique-id="91ab3450-34a7-4cc9-9026-7f2b3d44661f" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="2d5d1fa0-74b3-4378-9634-a86687f95f56" data-file-name="components/email-preview.tsx">Detroit Axle</span></p>
          <p className="mb-2" data-unique-id="6e4e9e0d-b7fe-4813-a097-32e81b150b0e" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="bc02e931-0a07-4a17-b785-c26487a83ffb" data-file-name="components/email-preview.tsx">Customer Support: 888-583-0255</span></p>
          <p data-unique-id="4322220d-601c-49bd-9db4-bcc0c264d674" data-file-name="components/email-preview.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="f0f77453-779d-4b83-a78d-88ab332c3d13" data-file-name="components/email-preview.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="5bfd44a0-8d5e-4eb8-a3f0-f9f0d7e4350f" data-file-name="components/email-preview.tsx"> Detroit Axle. All rights reserved.</span></p>
        </div>
      </div>
    </div>;
}