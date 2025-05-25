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
      <div className="border border-border rounded-md overflow-hidden shadow-md dark:shadow-none" data-unique-id="584d1eea-d672-4211-931b-d23f2f88393d" data-file-name="components/email-preview.tsx">
      <div className="bg-muted p-3 border-b border-border dark:bg-card/60" data-unique-id="cd3ef202-4e4d-41b8-83db-c2cad9210e38" data-file-name="components/email-preview.tsx">
        <div className="mb-3" data-unique-id="f533d01e-2d24-4236-8d7a-4eb920b2acc9" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="eb88a8a7-79d2-4b90-a3e8-368bd05362db" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="86cfe9f5-301e-4dab-898b-056b6c80a47d" data-file-name="components/email-preview.tsx">From: </span></span>
          <span className="text-sm" data-unique-id="563940ea-f1bf-418d-97eb-2db1c057ad07" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="76979ceb-2495-4a56-9ae7-3f4527d61d5b" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{senderInfo.name} &lt;{senderInfo.email}&gt;</span></span>
        </div>
        <div className="mb-3" data-unique-id="008cc518-2d3f-4521-9b3c-9a999aadc4d5" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="8959ab98-84e8-44a5-b155-19e1bed2e551" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="26465900-8ccc-4be7-bc99-50a43d6f3c59" data-file-name="components/email-preview.tsx">To: </span></span>
          <span className="text-sm" data-unique-id="4f73eb74-6bed-4dcb-a45a-8c5cee1d8a7b" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{previewData.customerName}<span className="editable-text" data-unique-id="de2cfddc-47b6-475f-8c08-7a9466c30bf4" data-file-name="components/email-preview.tsx"> &lt;customer@example.com&gt;</span></span>
        </div>
        <div className="mb-2" data-unique-id="63a29817-7c0a-46e1-9512-4fc365ed061c" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="f71b0c69-062f-4d9a-a396-0cb32dc3b375" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="5b9a551b-9dd2-4ef8-8cc3-bff3fb89164d" data-file-name="components/email-preview.tsx">Subject: </span></span>
          <span className="text-sm font-medium" data-unique-id="fb929f7a-28b5-4aa1-a1ff-5c7f1f70686d" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{processedSubject}</span>
        </div>
        <div data-unique-id="cbd70907-74ad-4f6d-9041-4032985999b7" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="03012336-7e8c-40f5-91b2-99762087bf8b" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="472164f2-ebc3-485c-adae-b8ec484c72a6" data-file-name="components/email-preview.tsx">Preheader: </span></span>
          <span className="text-xs italic" data-unique-id="d25a6516-9f8a-4ddd-83e6-e50e9aba8b5b" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{template.preheader}</span>
        </div>
      </div>

      <div className="p-4 bg-card" data-unique-id="3cdabafc-0617-40a0-81de-aa82ad927507" data-file-name="components/email-preview.tsx">
        <div className="flex justify-end space-x-2 mb-4" data-unique-id="3762cdd8-354e-49b5-8166-d5a0d41158aa" data-file-name="components/email-preview.tsx">
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
          }} className="flex items-center px-3 py-1 text-xs bg-secondary hover:bg-secondary/90 rounded-md transition-colors" title="Download HTML" data-unique-id="b6ea82b8-3cb9-49b1-83d8-b08daffa7dbf" data-file-name="components/email-preview.tsx">
            <Download className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="ae69e4a6-f765-4d4c-a875-ff85c679a8e0" data-file-name="components/email-preview.tsx">
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
          }} className="flex items-center px-3 py-1 text-xs bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy HTML with formatting preserved" data-unique-id="5e4fc13c-92e1-4cda-a487-8a52ed4b52f9" data-file-name="components/email-preview.tsx">
            <Copy className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="6f9edb6f-66ad-464f-8293-3f5709b05822" data-file-name="components/email-preview.tsx">
            Copy HTML
          </span></button>
          <button onClick={() => {
            const testEmail = prompt("Enter an email address to send a test email to:", "");
            if (testEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
              sendTestEmail(testEmail);
            } else if (testEmail) {
              alert("Please enter a valid email address");
            }
          }} className="flex items-center px-3 py-1 text-xs bg-primary text-white hover:bg-primary/90 rounded-md transition-colors" title="Send Test Email" data-unique-id="42b4a270-1806-40a6-b805-ee8d36a45a62" data-file-name="components/email-preview.tsx">
            <Mail className="h-3 w-3 mr-1" />
            <span data-unique-id="9ac7a7ad-33aa-4904-b372-85d052fc566e" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="aa9d9a46-5f18-4c05-a365-1607343111b7" data-file-name="components/email-preview.tsx">Test Send</span></span>
          </button>
        </div>
        <div className="border-b border-border pb-4 mb-4" data-unique-id="fb6f5c40-d529-4bf6-9496-ae9292e21604" data-file-name="components/email-preview.tsx">
          <img src="https://picsum.photos/200" alt="Detroit Axle" className="h-10 object-contain mb-4" data-unique-id="a586fadd-1928-49b8-a7dd-483323e65adb" data-file-name="components/email-preview.tsx" />
        </div>
        <div className="email-content whitespace-pre-wrap" data-unique-id="e75d104f-e7e4-459c-b09c-2e047ab0e4c6" data-file-name="components/email-preview.tsx" data-dynamic-text="true">
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
                parts.push(<span key={`${i}-${match.index}`} className="inline-flex items-center" data-unique-id="c9a34ed8-0b76-4cee-8641-174fd8c2b154" data-file-name="components/email-preview.tsx">
                    <a href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNumber}`} target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium" data-unique-id="aeaf02a2-d0a5-4f65-9a8c-ca9cf30d2ca1" data-file-name="components/email-preview.tsx" data-dynamic-text="true">
                      {trackingNumber}
                    </a>
                    <button onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(trackingNumber).then(() => toast.success('Tracking number copied!', {
                        duration: 2000
                      })).catch(err => console.error('Failed to copy:', err));
                    }
                  }} className="ml-1 p-0.5 rounded-full hover:bg-accent/20 inline-flex" title="Copy tracking number" data-unique-id="ef33a4f3-bf5c-404f-97dc-cbd29f32785e" data-file-name="components/email-preview.tsx">
                      <Copy className="h-3 w-3 text-primary" data-unique-id="70b6be9e-0fa5-4480-939e-a649af1c4109" data-file-name="components/email-preview.tsx" data-dynamic-text="true" />
                    </button>
                    <button onClick={() => {
                    const trackingUrl = `https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNumber}`;
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(trackingUrl).then(() => toast.success('Tracking link copied!', {
                        duration: 2000
                      })).catch(err => console.error('Failed to copy link:', err));
                    }
                  }} className="ml-1 p-0.5 rounded-full hover:bg-accent/20 inline-flex" title="Copy FedEx link" data-unique-id="8ca8d962-91ee-4fef-b0ab-3772996687e5" data-file-name="components/email-preview.tsx">
                      <svg className="h-3 w-3 text-[#4D148C]" viewBox="0 0 24 24" fill="currentColor" data-unique-id="f72a1c83-687b-4539-a575-9e5ac10484bc" data-file-name="components/email-preview.tsx">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 5a3 3 0 11-3 3 3 3 0 013-3zm0 11.13c-2.03-.31-3.88-1.47-5.14-3.13h10.28c-1.26 1.66-3.11 2.82-5.14 3.13z" data-unique-id="8fe5a977-a321-445f-bf05-990bf1504f4a" data-file-name="components/email-preview.tsx" data-dynamic-text="true" />
                      </svg>
                    </button>
                  </span>);
                lastIndex = match.index + match[0].length;
              }

              // Add any remaining text
              parts.push(line.substring(lastIndex));
              return <p key={i} className="mb-3" data-unique-id="150873c5-6343-40fc-95f0-82573ab2d9ea" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{parts}</p>;
            }
            return <p key={i} className={`${line.trim() === "" ? "h-4" : "mb-3"}`} data-unique-id="ed3a738d-8e84-44e5-adcb-9ff147a8b6ca" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{line}</p>;
          })}
        </div>
        <div className="mt-6 pt-4 border-t border-border text-sm text-muted-foreground" data-unique-id="3789f814-9dac-4386-8d43-2580211cdc23" data-file-name="components/email-preview.tsx">
          <p className="mb-2" data-unique-id="a5b9c3ad-34b0-42d2-91f8-62d6e51e8d09" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="a4d0f66a-0362-45dc-ad40-e15d2e255660" data-file-name="components/email-preview.tsx">Detroit Axle</span></p>
          <p className="mb-2" data-unique-id="3e5a7d95-af91-4d1a-9b32-e6cfffee3a5b" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="1ba5efbe-4818-452f-b26d-d805729d04a8" data-file-name="components/email-preview.tsx">Customer Support: 888-583-0255</span></p>
          <p data-unique-id="556730a4-3648-4a50-bc7a-91e040e46959" data-file-name="components/email-preview.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="a7ba995b-8674-46f7-87c9-938b7929260e" data-file-name="components/email-preview.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="6fa57043-7e2e-49a1-bce0-4cbf1338b3bf" data-file-name="components/email-preview.tsx"> Detroit Axle. All rights reserved.</span></p>
        </div>
      </div>
    </div>
    </>;
}