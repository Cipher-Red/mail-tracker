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
  return <div className="border border-border rounded-md overflow-hidden" data-unique-id="a0a44a8d-93bb-481a-9a08-48825d316d71" data-file-name="components/email-preview.tsx">
      <div className="bg-muted p-3 border-b border-border" data-unique-id="441838fb-62cc-4471-98a7-59ef63ccadd7" data-file-name="components/email-preview.tsx">
        <div className="mb-3" data-unique-id="7e180656-c26e-47cd-88dd-c66f07be69a7" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="39cb8248-5b6f-499e-9324-9ce76d1d32a8" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="e1054948-ebe0-4709-81f0-91d9042f0f48" data-file-name="components/email-preview.tsx">From: </span></span>
          <span className="text-sm" data-unique-id="037f0d97-a1b4-4415-8e0f-8dc5a73f2cf1" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="7e128176-a9b2-4e0c-bb38-36990534284a" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{senderInfo.name} &lt;{senderInfo.email}&gt;</span></span>
        </div>
        <div className="mb-3" data-unique-id="27b06645-1239-412c-bac5-f962137be6d0" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="3ea5e5af-03d8-4799-a1ba-eee54b39ce4a" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="3ff10f80-b4a3-4644-acd0-5b9271ec2068" data-file-name="components/email-preview.tsx">To: </span></span>
          <span className="text-sm" data-unique-id="44865854-5dc0-46b5-92b6-47e1a3cebc04" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{previewData.customerName}<span className="editable-text" data-unique-id="47591d38-d630-4b3b-9b50-a97b28354752" data-file-name="components/email-preview.tsx"> &lt;customer@example.com&gt;</span></span>
        </div>
        <div className="mb-2" data-unique-id="13b87255-31c0-4c65-a019-bb5402be6d40" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="f09661fa-fc42-4cfd-9b3e-87d6adc5ce27" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="94cd274c-be1b-4e3a-8c67-6db50358e3a1" data-file-name="components/email-preview.tsx">Subject: </span></span>
          <span className="text-sm font-medium" data-unique-id="a716fe2c-f60b-4209-9724-15ec93e49f26" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{processedSubject}</span>
        </div>
        <div data-unique-id="86c9d29d-190a-4f4d-8278-33786d0ea6d6" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="e55e1201-3cd7-42fa-8e87-09f6a10a4839" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="f1a5f88e-6b7a-4abb-ba6c-509104b1f1c2" data-file-name="components/email-preview.tsx">Preheader: </span></span>
          <span className="text-xs italic" data-unique-id="b3a63483-0f16-4e77-9e79-1fe2796b5ed1" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{template.preheader}</span>
        </div>
      </div>

      <div className="p-4 bg-white" data-unique-id="14057bfb-0b1b-4c9a-9033-f846a5ea3445" data-file-name="components/email-preview.tsx">
        <div className="flex justify-end space-x-2 mb-4" data-unique-id="5c6d20c3-d9d6-4c5d-8ed5-81c8b9c780f3" data-file-name="components/email-preview.tsx">
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
        }} className="flex items-center px-3 py-1 text-xs bg-secondary hover:bg-secondary/90 rounded-md transition-colors" title="Download HTML" data-unique-id="88570a4b-f864-4798-92f0-9aa9f92d9ff0" data-file-name="components/email-preview.tsx">
            <Download className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="dc7bf4df-dc32-4388-b5b9-a7be77308690" data-file-name="components/email-preview.tsx">
            HTML
          </span></button>
          <button onClick={() => {
          const html = generateHtmlEmail(template, previewData);
          navigator.clipboard.writeText(html);
          alert("HTML copied to clipboard!");
        }} className="flex items-center px-3 py-1 text-xs bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy HTML" data-unique-id="506837b9-b01b-43d9-8e5d-f3a0278158ce" data-file-name="components/email-preview.tsx">
            <Copy className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="0885e137-6759-44a6-a1c9-650697c91130" data-file-name="components/email-preview.tsx">
            Copy
          </span></button>
          <button onClick={() => {
          const testEmail = prompt("Enter an email address to send a test email to:", "");
          if (testEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
            sendTestEmail(testEmail);
          } else if (testEmail) {
            alert("Please enter a valid email address");
          }
        }} className="flex items-center px-3 py-1 text-xs bg-primary text-white hover:bg-primary/90 rounded-md transition-colors" title="Send Test Email" data-unique-id="484b246e-a3db-40f9-ae5e-0b9653dd0db3" data-file-name="components/email-preview.tsx">
            <Mail className="h-3 w-3 mr-1" />
            <span data-unique-id="3a1e94b6-0fb0-4d59-8c1b-52e678d0f800" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="4f80bb95-b9f4-4983-b1d4-604be09416a6" data-file-name="components/email-preview.tsx">Test Send</span></span>
          </button>
        </div>
        <div className="border-b border-border pb-4 mb-4" data-unique-id="f98cc00d-6128-448f-8f94-66a101029b34" data-file-name="components/email-preview.tsx">
          <img src="https://picsum.photos/200" alt="Detroit Axle" className="h-10 object-contain mb-4" data-unique-id="e5b0e80a-9a08-47b7-8804-7e6d8c0d8223" data-file-name="components/email-preview.tsx" />
        </div>
        <div className="email-content whitespace-pre-wrap" data-unique-id="8b966e3a-fa8c-49fc-ac49-2e0b77148eef" data-file-name="components/email-preview.tsx" data-dynamic-text="true">
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
              parts.push(<a key={`${i}-${match.index}`} href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${match[0]}`} target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium" data-unique-id="afdaf570-9ed1-48e9-b459-4afa189819d3" data-file-name="components/email-preview.tsx" data-dynamic-text="true">
                    {match[0]}
                  </a>);
              lastIndex = match.index + match[0].length;
            }

            // Add any remaining text
            parts.push(line.substring(lastIndex));
            return <p key={i} className="mb-3" data-unique-id="06e585bf-161a-44aa-87d1-1ca5d96f8cfd" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{parts}</p>;
          }
          return <p key={i} className={`${line.trim() === "" ? "h-4" : "mb-3"}`} data-unique-id="60732bcf-b56f-4d1b-9236-7e5c46b5a9ab" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{line}</p>;
        })}
        </div>
        <div className="mt-6 pt-4 border-t border-border text-sm text-muted-foreground" data-unique-id="abd9b3db-6abe-4f9f-a346-7041b8dba0a5" data-file-name="components/email-preview.tsx">
          <p className="mb-2" data-unique-id="3448e042-fccb-4d81-91cf-4336a473d3b0" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="2cc240c8-3080-433c-887c-94fde2effa08" data-file-name="components/email-preview.tsx">Detroit Axle</span></p>
          <p className="mb-2" data-unique-id="441669ea-b99f-44f6-a794-5387b895348a" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="09358170-3d46-4485-a788-027ccb1b74c2" data-file-name="components/email-preview.tsx">Customer Support: 888-583-0255</span></p>
          <p data-unique-id="285070df-72bc-4967-aa7a-4ebc86d9e77d" data-file-name="components/email-preview.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="efb99d1f-2f3f-4a4b-8981-030700c4d96e" data-file-name="components/email-preview.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="af91fe8b-786b-4f8d-94b5-8fa11ee7fda3" data-file-name="components/email-preview.tsx"> Detroit Axle. All rights reserved.</span></p>
        </div>
      </div>
    </div>;
}