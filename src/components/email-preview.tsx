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
  return <div className="border border-border rounded-md overflow-hidden" data-unique-id="214e13ae-775c-4fd9-be4a-b1a530ba559b" data-file-name="components/email-preview.tsx">
      <div className="bg-muted p-3 border-b border-border" data-unique-id="27520f6a-ba67-43c2-91ee-75c33fe9e2fc" data-file-name="components/email-preview.tsx">
        <div className="mb-3" data-unique-id="fd0cb3a8-5d58-48b5-915e-adba69700d24" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="767c9014-8978-4843-96dd-759fb97418cc" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="7ba57df3-c3d2-450e-b5d8-26d17f82cbe4" data-file-name="components/email-preview.tsx">From: </span></span>
          <span className="text-sm" data-unique-id="4f4050fd-632b-4e9f-863f-4f00b5af11b5" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="8d8484e7-c1fb-458d-a19e-7eac83cc63ac" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{senderInfo.name} &lt;{senderInfo.email}&gt;</span></span>
        </div>
        <div className="mb-3" data-unique-id="b5fb5304-f141-48b3-b2c5-94c63f91d674" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="897a2b0b-d8b0-49e6-9b30-6e9fcf74f742" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="76cc8889-33c6-46b6-90a5-b4405fcbaa16" data-file-name="components/email-preview.tsx">To: </span></span>
          <span className="text-sm" data-unique-id="5280437b-742f-485f-83eb-dc48649309e4" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{previewData.customerName}<span className="editable-text" data-unique-id="d15ab062-9ab7-47b4-b7b5-2d237f3ac418" data-file-name="components/email-preview.tsx"> &lt;customer@example.com&gt;</span></span>
        </div>
        <div className="mb-2" data-unique-id="2f84c295-d2d6-4a53-803e-b8531f491f8b" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="3cdb1a16-4920-4449-a538-eace54a40b8d" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="37afd008-7dc1-4554-a277-bc17f050a2fd" data-file-name="components/email-preview.tsx">Subject: </span></span>
          <span className="text-sm font-medium" data-unique-id="fbb22c4d-7de6-4b5b-8817-c2493968f3a4" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{processedSubject}</span>
        </div>
        <div data-unique-id="0a148ca9-4d4c-48e9-8da9-94f3fd82dba2" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="49641b0a-b2a1-41b5-a66f-33e7b139869e" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="7c56c246-9d1d-42d9-9dcf-ee76ee38aaa8" data-file-name="components/email-preview.tsx">Preheader: </span></span>
          <span className="text-xs italic" data-unique-id="904f3fa2-870d-4c54-8b5c-35d00a9d8a62" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{template.preheader}</span>
        </div>
      </div>

      <div className="p-4 bg-white" data-unique-id="cb958f5e-625b-414a-9c58-b3a87616c3dd" data-file-name="components/email-preview.tsx">
        <div className="flex justify-end space-x-2 mb-4" data-unique-id="8bc03aca-d72f-4f64-97e9-1c2b98e32af3" data-file-name="components/email-preview.tsx">
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
        }} className="flex items-center px-3 py-1 text-xs bg-secondary hover:bg-secondary/90 rounded-md transition-colors" title="Download HTML" data-unique-id="84dc633f-6350-434b-a677-93b15a78c0cb" data-file-name="components/email-preview.tsx">
            <Download className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="88a43aa7-e4cd-42a3-a736-536fdecade5f" data-file-name="components/email-preview.tsx">
            HTML
          </span></button>
          <button onClick={() => {
          const html = generateHtmlEmail(template, previewData);
          navigator.clipboard.writeText(html);
          alert("HTML copied to clipboard!");
        }} className="flex items-center px-3 py-1 text-xs bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy HTML" data-unique-id="d63bc90a-ac1b-4c06-bd27-eae7566f781b" data-file-name="components/email-preview.tsx">
            <Copy className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="056ab940-5f2f-4878-b33d-f2614f8f1dbe" data-file-name="components/email-preview.tsx">
            Copy
          </span></button>
          <button onClick={() => {
          const testEmail = prompt("Enter an email address to send a test email to:", "");
          if (testEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
            sendTestEmail(testEmail);
          } else if (testEmail) {
            alert("Please enter a valid email address");
          }
        }} className="flex items-center px-3 py-1 text-xs bg-primary text-white hover:bg-primary/90 rounded-md transition-colors" title="Send Test Email" data-unique-id="5f3f5e83-614d-49c2-81e2-525400aa522b" data-file-name="components/email-preview.tsx">
            <Mail className="h-3 w-3 mr-1" />
            <span data-unique-id="d2778da2-a935-4451-bf7a-815b1eadd5fe" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="eade613d-f168-486c-9b68-de4d06be541d" data-file-name="components/email-preview.tsx">Test Send</span></span>
          </button>
        </div>
        <div className="border-b border-border pb-4 mb-4" data-unique-id="8b25ef7b-c866-43b2-b36e-a22751e23a81" data-file-name="components/email-preview.tsx">
          <img src="https://picsum.photos/200" alt="Detroit Axle" className="h-10 object-contain mb-4" data-unique-id="df405665-93dc-4d40-85e4-e6877446a1c4" data-file-name="components/email-preview.tsx" />
        </div>
        <div className="email-content whitespace-pre-wrap" data-unique-id="51283567-f30a-47a9-9c77-bbe4cad78b5e" data-file-name="components/email-preview.tsx" data-dynamic-text="true">
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
              parts.push(<a key={`${i}-${match.index}`} href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${match[0]}`} target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium" data-unique-id="457672d8-f4e4-44ab-b582-4cfbd313cc53" data-file-name="components/email-preview.tsx" data-dynamic-text="true">
                    {match[0]}
                  </a>);
              lastIndex = match.index + match[0].length;
            }

            // Add any remaining text
            parts.push(line.substring(lastIndex));
            return <p key={i} className="mb-3" data-unique-id="1ae13fc3-9156-4e12-ac38-96bfe4845b44" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{parts}</p>;
          }
          return <p key={i} className={`${line.trim() === "" ? "h-4" : "mb-3"}`} data-unique-id="78e74690-eb93-4f3d-bfcc-09c7b99c233a" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{line}</p>;
        })}
        </div>
        <div className="mt-6 pt-4 border-t border-border text-sm text-muted-foreground" data-unique-id="b52ec838-369a-43e8-b535-06260ef63200" data-file-name="components/email-preview.tsx">
          <p className="mb-2" data-unique-id="48d4062c-b09a-45cf-860d-2717396aad2d" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="577bd274-115a-4531-bd12-af4ef0682d36" data-file-name="components/email-preview.tsx">Detroit Axle</span></p>
          <p className="mb-2" data-unique-id="7e23e8fb-4e94-48fd-868e-6155ba3f7bfa" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="12787be9-0fb5-48e4-95ef-d6e338321b7c" data-file-name="components/email-preview.tsx">Customer Support: 888-583-0255</span></p>
          <p data-unique-id="625c8fda-96fe-4916-aaba-ef9b38640de8" data-file-name="components/email-preview.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="1a7c4747-14c7-4af5-b196-d1e19a7538bb" data-file-name="components/email-preview.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="9b3dbfad-f5f8-4b1b-8126-c928a6712dd3" data-file-name="components/email-preview.tsx"> Detroit Axle. All rights reserved.</span></p>
        </div>
      </div>
    </div>;
}