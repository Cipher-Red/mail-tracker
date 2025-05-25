"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Toaster } from "react-hot-toast";
import { generateHtmlEmail, copyRichEmailContent } from "@/lib/email-utils";
import { Download, Copy, Mail } from "lucide-react";
import toast from 'react-hot-toast';
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
  return <>
      <Toaster position="top-center" />
      <div className="border border-border rounded-md overflow-hidden" data-unique-id="44719a3e-9120-4ed7-9d71-a3abf59ef06a" data-file-name="components/email-preview.tsx">
      <div className="bg-muted p-3 border-b border-border" data-unique-id="2f973131-99d5-40d5-bf43-59c292762c21" data-file-name="components/email-preview.tsx">
        <div className="mb-3" data-unique-id="03628626-bbb3-42b6-88ff-d0c991a63118" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="83143f08-815e-483a-9f78-70e0c01f4d77" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="0b02b333-b393-4a0b-92c4-b5f0ad2a3d4b" data-file-name="components/email-preview.tsx">From: </span></span>
          <span className="text-sm" data-unique-id="33bffe9f-0164-4310-8996-faa48915c0d5" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="bdeec0e0-6ade-4e1d-9a2c-cc58001d65c6" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{senderInfo.name} &lt;{senderInfo.email}&gt;</span></span>
        </div>
        <div className="mb-3" data-unique-id="a3fcfc50-6b79-45f2-9f5a-7a9888cd5f31" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="26f4ba95-cfb9-4ec7-9dbf-4a3d299b96cb" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="a6eaad69-d5f6-404e-96f2-e1b61608b965" data-file-name="components/email-preview.tsx">To: </span></span>
          <span className="text-sm" data-unique-id="39ca304a-0e88-4cbb-bcb8-619129f1bbe3" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{previewData.customerName}<span className="editable-text" data-unique-id="85df6168-56bc-4c69-85b7-ab7ed1044930" data-file-name="components/email-preview.tsx"> &lt;customer@example.com&gt;</span></span>
        </div>
        <div className="mb-2" data-unique-id="ea929099-759f-4684-b327-0b71b4b2ff7d" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="1cad6c90-9fed-40f5-b539-616f94c958f7" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="604917a2-ec09-4639-93c8-5fcb37d5f446" data-file-name="components/email-preview.tsx">Subject: </span></span>
          <span className="text-sm font-medium" data-unique-id="2c858cf0-ab9d-4538-bff2-15c4ee65eff7" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{processedSubject}</span>
        </div>
        <div data-unique-id="9f6c751d-373d-4e4d-aaf0-0600dd4214d5" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="cc8eadb7-0652-4e7d-b894-348c40412a5a" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="f772af47-bb15-4cd9-9c1b-af54a2797d13" data-file-name="components/email-preview.tsx">Preheader: </span></span>
          <span className="text-xs italic" data-unique-id="98cf5ae5-6581-43c1-9bf4-b03ef0674408" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{template.preheader}</span>
        </div>
      </div>

      <div className="p-4 bg-white" data-unique-id="d8f873f3-e14c-4124-bcf8-db715fd7a4c2" data-file-name="components/email-preview.tsx">
        <div className="flex justify-end space-x-2 mb-4" data-unique-id="edbdc4fc-a7b6-4081-87b2-0572e1db589a" data-file-name="components/email-preview.tsx">
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
          }} className="flex items-center px-3 py-1 text-xs bg-secondary hover:bg-secondary/90 rounded-md transition-colors" title="Download HTML" data-unique-id="bd9e3233-d906-4639-819a-3a0a9594fee6" data-file-name="components/email-preview.tsx">
            <Download className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="adc3250f-47a9-4999-b423-394d430b19ce" data-file-name="components/email-preview.tsx">
            HTML
          </span></button>
          <button onClick={async () => {
            const html = generateHtmlEmail(template, previewData);
            const success = await copyRichEmailContent(html);
            if (success) {
              toast.success("Email HTML copied to clipboard with formatting preserved!");
            } else {
              toast.error("Failed to copy HTML with formatting. Simple text copied instead.");
            }
          }} className="flex items-center px-3 py-1 text-xs bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy HTML with formatting preserved" data-unique-id="a5c2ce78-43e1-40e4-a400-1648a6e14eda" data-file-name="components/email-preview.tsx">
            <Copy className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="3d921c4c-7692-4029-a5d1-64363b51ccef" data-file-name="components/email-preview.tsx">
            Copy HTML
          </span></button>
          <button onClick={() => {
            const testEmail = prompt("Enter an email address to send a test email to:", "");
            if (testEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
              sendTestEmail(testEmail);
            } else if (testEmail) {
              alert("Please enter a valid email address");
            }
          }} className="flex items-center px-3 py-1 text-xs bg-primary text-white hover:bg-primary/90 rounded-md transition-colors" title="Send Test Email" data-unique-id="46c7af8a-c98e-4d5b-ba75-e57787c99cc8" data-file-name="components/email-preview.tsx">
            <Mail className="h-3 w-3 mr-1" />
            <span data-unique-id="2bd79e9b-5ba3-4aac-8cc0-d4aae6bf8533" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="f1526958-9acb-4c65-8a81-2b80c2d116c3" data-file-name="components/email-preview.tsx">Test Send</span></span>
          </button>
        </div>
        <div className="border-b border-border pb-4 mb-4" data-unique-id="597a4e19-4e32-463e-a908-d1bab1c618be" data-file-name="components/email-preview.tsx">
          <img src="https://picsum.photos/200" alt="Detroit Axle" className="h-10 object-contain mb-4" data-unique-id="8b40199b-0f02-43a1-87d1-cd65084569db" data-file-name="components/email-preview.tsx" />
        </div>
        <div className="email-content whitespace-pre-wrap" data-unique-id="a4b131b7-06a7-4677-8985-236aaa954736" data-file-name="components/email-preview.tsx" data-dynamic-text="true">
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

                // Add the tracking number as a clickable link with copy button
                const trackingNumber = match[0];
                parts.push(<span key={`${i}-${match.index}`} className="inline-flex items-center" data-unique-id="319034ae-1c8e-44f0-bb56-81791dea0603" data-file-name="components/email-preview.tsx">
                    <a href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNumber}`} target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium" data-unique-id="3f46afc6-aa76-4e16-b5f2-5dd3387fa9ed" data-file-name="components/email-preview.tsx" data-dynamic-text="true">
                      {trackingNumber}
                    </a>
                    <button onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(trackingNumber).then(() => toast.success('Tracking number copied!', {
                        duration: 2000
                      })).catch(err => console.error('Failed to copy:', err));
                    }
                  }} className="ml-1 p-0.5 rounded-full hover:bg-accent/20 inline-flex" title="Copy tracking number" data-unique-id="c35a200f-3aff-4099-85df-aa3c9cc24447" data-file-name="components/email-preview.tsx">
                      <Copy className="h-3 w-3 text-primary" data-unique-id="ac0a7a19-f4f9-410f-85a1-bc639b33eadf" data-file-name="components/email-preview.tsx" data-dynamic-text="true" />
                    </button>
                    <button onClick={() => {
                    const trackingUrl = `https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNumber}`;
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(trackingUrl).then(() => toast.success('Tracking link copied!', {
                        duration: 2000
                      })).catch(err => console.error('Failed to copy link:', err));
                    }
                  }} className="ml-1 p-0.5 rounded-full hover:bg-accent/20 inline-flex" title="Copy FedEx link" data-unique-id="95ed87a8-68ca-40c8-9bf4-0224a7efba84" data-file-name="components/email-preview.tsx">
                      <svg className="h-3 w-3 text-[#4D148C]" viewBox="0 0 24 24" fill="currentColor" data-unique-id="b4343116-7275-4813-a8ef-a43757216bf1" data-file-name="components/email-preview.tsx">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 5a3 3 0 11-3 3 3 3 0 013-3zm0 11.13c-2.03-.31-3.88-1.47-5.14-3.13h10.28c-1.26 1.66-3.11 2.82-5.14 3.13z" data-unique-id="3f66b06c-76c1-4b5f-ba64-9fda79b668c9" data-file-name="components/email-preview.tsx" data-dynamic-text="true" />
                      </svg>
                    </button>
                  </span>);
                lastIndex = match.index + match[0].length;
              }

              // Add any remaining text
              parts.push(line.substring(lastIndex));
              return <p key={i} className="mb-3" data-unique-id="40ca44e8-7e28-4646-8301-e2cda3553713" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{parts}</p>;
            }
            return <p key={i} className={`${line.trim() === "" ? "h-4" : "mb-3"}`} data-unique-id="182d4824-7968-4156-afcb-0bcdbef32228" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{line}</p>;
          })}
        </div>
        <div className="mt-6 pt-4 border-t border-border text-sm text-muted-foreground" data-unique-id="dc47f80e-41f9-4ae5-bf1b-2367e0929493" data-file-name="components/email-preview.tsx">
          <p className="mb-2" data-unique-id="c89b5ac4-fff3-4605-9d6b-9615b0b27f0a" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="413a159b-06f4-4ffc-8d22-791b167528c1" data-file-name="components/email-preview.tsx">Detroit Axle</span></p>
          <p className="mb-2" data-unique-id="d6b8e7d3-e615-427f-873d-89f4596b1aef" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="20cd4cca-6bde-4729-a30a-c307a082069d" data-file-name="components/email-preview.tsx">Customer Support: 888-583-0255</span></p>
          <p data-unique-id="c0a6e0c2-9a1a-43fc-ad1d-a39a9f331b3e" data-file-name="components/email-preview.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="23bf30bf-5426-4f16-9a12-3e428958ff33" data-file-name="components/email-preview.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="3693797d-b1a0-499e-b32a-4c5e764f4411" data-file-name="components/email-preview.tsx"> Detroit Axle. All rights reserved.</span></p>
        </div>
      </div>
    </div>
    </>;
}