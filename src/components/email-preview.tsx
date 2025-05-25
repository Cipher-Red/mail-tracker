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
      <div className="border border-border rounded-md overflow-hidden shadow-md dark:shadow-none" data-unique-id="00bcace5-bfd5-4548-a437-5181fa1d4797" data-file-name="components/email-preview.tsx">
      <div className="bg-muted p-3 border-b border-border dark:bg-card/60" data-unique-id="7f283bb5-dc31-45f9-a9f4-ffbf76f4447a" data-file-name="components/email-preview.tsx">
        <div className="mb-3" data-unique-id="60bbaee0-3d4a-4f8f-9c72-d05e0e47a84a" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="592cc0a7-9658-49bc-9350-f02604805f06" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="6a881806-c780-4b16-b12b-22bf31360633" data-file-name="components/email-preview.tsx">From: </span></span>
          <span className="text-sm" data-unique-id="3da49bde-1ded-4364-a8a4-2672f4dc5ef2" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="19db3f81-0c0d-4e9e-b8c4-b9a9e14fe29e" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{senderInfo.name} &lt;{senderInfo.email}&gt;</span></span>
        </div>
        <div className="mb-3" data-unique-id="b4ce25df-d68b-4d36-8aee-ea7349305b1f" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="5045b75e-b925-463a-aed5-d2cc1bc4fc07" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="0c0fb3e1-3f18-47b0-81fa-023f8708211d" data-file-name="components/email-preview.tsx">To: </span></span>
          <span className="text-sm" data-unique-id="69e0f28f-8762-485b-9373-eb401fe5dc7c" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{previewData.customerName}<span className="editable-text" data-unique-id="a7cf42f7-0339-475b-918f-c0be1aacacc2" data-file-name="components/email-preview.tsx"> &lt;customer@example.com&gt;</span></span>
        </div>
        <div className="mb-2" data-unique-id="6677cce3-6a9c-4efc-ac79-0816f2f888bc" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="7e40755b-22db-43d8-b819-e0dfcc31bada" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="8670d154-ba15-4e60-a67e-8514d22bb382" data-file-name="components/email-preview.tsx">Subject: </span></span>
          <span className="text-sm font-medium" data-unique-id="a0f39602-c996-467c-aa19-bb3bf06e353b" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{processedSubject}</span>
        </div>
        <div data-unique-id="449fc341-fb9c-48f8-89be-fbb40a95d759" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="b3f35fdf-3af6-4965-b38f-f6983d961f53" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="d6f22df6-abd4-4902-a793-1e2e6f5e9eae" data-file-name="components/email-preview.tsx">Preheader: </span></span>
          <span className="text-xs italic" data-unique-id="fb34c51b-5570-4b77-920a-3cc0b6d1d67c" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{template.preheader}</span>
        </div>
      </div>

      <div className="p-4 bg-card" data-unique-id="e0153b99-fc7a-4494-a10f-2a01aa6ba558" data-file-name="components/email-preview.tsx">
        <div className="flex justify-end space-x-2 mb-4" data-unique-id="36c2b4d5-ade6-4f6f-aecf-e523b1753d2b" data-file-name="components/email-preview.tsx">
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
          }} className="flex items-center px-3 py-1 text-xs bg-secondary hover:bg-secondary/90 rounded-md transition-colors" title="Download HTML" data-unique-id="87e933d0-45bc-40f6-9dd1-96a8904744bc" data-file-name="components/email-preview.tsx">
            <Download className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="36a9a4d8-eade-4b09-92dc-1cd16cfc037b" data-file-name="components/email-preview.tsx">
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
          }} className="flex items-center px-3 py-1 text-xs bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy HTML with formatting preserved" data-unique-id="3990796f-4e9c-4a5a-9dbe-0629f5c9e729" data-file-name="components/email-preview.tsx">
            <Copy className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="5cc3d94b-99dd-460e-9d13-31ab47801d46" data-file-name="components/email-preview.tsx">
            Copy HTML
          </span></button>
          <button onClick={() => {
            const testEmail = prompt("Enter an email address to send a test email to:", "");
            if (testEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
              sendTestEmail(testEmail);
            } else if (testEmail) {
              alert("Please enter a valid email address");
            }
          }} className="flex items-center px-3 py-1 text-xs bg-primary text-white hover:bg-primary/90 rounded-md transition-colors" title="Send Test Email" data-unique-id="3cde95bf-18bd-4ccd-8c98-d7c582979f80" data-file-name="components/email-preview.tsx">
            <Mail className="h-3 w-3 mr-1" />
            <span data-unique-id="f61525c8-c099-4d1f-87b2-29754e4a8621" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="5ff249f0-0467-43ff-829f-9e0a20cc73cf" data-file-name="components/email-preview.tsx">Test Send</span></span>
          </button>
        </div>
        <div className="border-b border-border pb-4 mb-4" data-unique-id="43474ab7-a3da-482b-ab50-8ab997df8d7d" data-file-name="components/email-preview.tsx">
          <img src="https://picsum.photos/200" alt="Detroit Axle" className="h-10 object-contain mb-4" data-unique-id="64244a5a-e4f4-4237-b452-2337fde4640c" data-file-name="components/email-preview.tsx" />
        </div>
        <div className="email-content whitespace-pre-wrap" data-unique-id="ad9b86a8-dd54-443c-bf43-5a7248bc8eae" data-file-name="components/email-preview.tsx" data-dynamic-text="true">
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
                parts.push(<span key={`${i}-${match.index}`} className="inline-flex items-center" data-unique-id="90c4430a-1f52-444b-bc25-4f494eb55609" data-file-name="components/email-preview.tsx">
                    <a href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNumber}`} target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium" data-unique-id="6fd121b2-8cb2-4b2f-b5c8-8c2b81d4c0fd" data-file-name="components/email-preview.tsx" data-dynamic-text="true">
                      {trackingNumber}
                    </a>
                    <button onClick={() => {
                    try {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(trackingNumber).then(() => toast.success('Tracking number copied!', {
                          duration: 2000
                        })).catch(err => {
                          console.error('Failed to copy with clipboard API:', err);
                          // Fall back to execCommand method if clipboard API fails
                          fallbackCopy(trackingNumber);
                        });
                      } else {
                        fallbackCopy(trackingNumber);
                      }
                    } catch (err) {
                      console.error('Copy operation failed:', err);
                      toast.error('Failed to copy. Please select and copy manually.');
                    }
                    function fallbackCopy(text) {
                      const textArea = document.createElement('textarea');
                      textArea.value = text;
                      textArea.style.position = 'fixed'; // Make the textarea out of the viewport
                      textArea.style.left = '-9999px';
                      textArea.style.top = '0';
                      document.body.appendChild(textArea);
                      textArea.focus();
                      textArea.select();
                      try {
                        const successful = document.execCommand('copy');
                        if (successful) {
                          toast.success('Tracking number copied!', {
                            duration: 2000
                          });
                        } else {
                          toast.error('Failed to copy. Please try again.');
                        }
                      } catch (err) {
                        console.error('Fallback copy failed:', err);
                        toast.error('Failed to copy tracking number. Please copy it manually.');
                      }
                      document.body.removeChild(textArea);
                    }
                  }} className="ml-1 p-0.5 rounded-full hover:bg-accent/20 inline-flex" title="Copy tracking number" data-unique-id="c78076d5-e152-4764-b128-6552f199633b" data-file-name="components/email-preview.tsx">
                      <Copy className="h-3 w-3 text-primary" data-unique-id="b7e2663b-ee03-4700-97cb-fce0e979cb6e" data-file-name="components/email-preview.tsx" data-dynamic-text="true" />
                    </button>
                    <button onClick={() => {
                    const trackingUrl = `https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNumber}`;
                    try {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(trackingUrl).then(() => toast.success('Tracking link copied!', {
                          duration: 2000
                        })).catch(err => {
                          console.error('Failed to copy with clipboard API:', err);
                          // Fall back to execCommand method if clipboard API fails
                          fallbackCopy(trackingUrl);
                        });
                      } else {
                        fallbackCopy(trackingUrl);
                      }
                    } catch (err) {
                      console.error('Copy operation failed:', err);
                      toast.error('Failed to copy. Please select and copy manually.');
                    }
                    function fallbackCopy(text) {
                      const textArea = document.createElement('textarea');
                      textArea.value = text;
                      textArea.style.position = 'fixed';
                      textArea.style.left = '-9999px';
                      textArea.style.top = '0';
                      document.body.appendChild(textArea);
                      textArea.focus();
                      textArea.select();
                      try {
                        const successful = document.execCommand('copy');
                        if (successful) {
                          toast.success('Tracking link copied!', {
                            duration: 2000
                          });
                        } else {
                          toast.error('Failed to copy. Please try again.');
                        }
                      } catch (err) {
                        console.error('Fallback copy failed:', err);
                        toast.error('Failed to copy link. Please copy it manually.');
                      }
                      document.body.removeChild(textArea);
                    }
                  }} className="ml-1 p-0.5 rounded-full hover:bg-accent/20 inline-flex" title="Copy FedEx link" data-unique-id="5fd52f78-1f8d-479d-b3ee-5194590c5fb8" data-file-name="components/email-preview.tsx">
                      <svg className="h-3 w-3 text-[#4D148C]" viewBox="0 0 24 24" fill="currentColor" data-unique-id="fb82309b-2f29-4d61-b3b1-e0de62a60b9b" data-file-name="components/email-preview.tsx">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 5a3 3 0 11-3 3 3 3 0 013-3zm0 11.13c-2.03-.31-3.88-1.47-5.14-3.13h10.28c-1.26 1.66-3.11 2.82-5.14 3.13z" data-unique-id="66ae6496-74d7-4769-9e17-f943cff3a526" data-file-name="components/email-preview.tsx" data-dynamic-text="true" />
                      </svg>
                    </button>
                    <button onClick={() => {
                    const trackingUrl = `https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNumber}`;
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(trackingUrl).then(() => toast.success('Tracking link copied!', {
                        duration: 2000
                      })).catch(err => console.error('Failed to copy link:', err));
                    }
                  }} className="ml-1 p-0.5 rounded-full hover:bg-accent/20 inline-flex" title="Copy FedEx link" data-unique-id="8a874918-3c85-466f-b70f-b0112b1e2a15" data-file-name="components/email-preview.tsx">
                      <svg className="h-3 w-3 text-[#4D148C]" viewBox="0 0 24 24" fill="currentColor" data-unique-id="36c70829-626a-4038-baec-bdc5ee03dd34" data-file-name="components/email-preview.tsx">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 5a3 3 0 11-3 3 3 3 0 013-3zm0 11.13c-2.03-.31-3.88-1.47-5.14-3.13h10.28c-1.26 1.66-3.11 2.82-5.14 3.13z" data-unique-id="0ffa7ffe-8a43-4170-acec-825b80b3c1dc" data-file-name="components/email-preview.tsx" data-dynamic-text="true" />
                      </svg>
                    </button>
                  </span>);
                lastIndex = match.index + match[0].length;
              }

              // Add any remaining text
              parts.push(line.substring(lastIndex));
              return <p key={i} className="mb-3" data-unique-id="a21eac73-2c9a-4a51-a8a1-354b55e53aed" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{parts}</p>;
            }
            return <p key={i} className={`${line.trim() === "" ? "h-4" : "mb-3"}`} data-unique-id="cf00a840-5505-42e6-aa9d-a7b65d8eb8f4" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{line}</p>;
          })}
        </div>
        <div className="mt-6 pt-4 border-t border-border text-sm text-muted-foreground" data-unique-id="e21c5437-97dc-4e9a-a97f-1b93fe5f7ebb" data-file-name="components/email-preview.tsx">
          <p className="mb-2" data-unique-id="f5bbba3a-a19f-4d6d-99e2-a6572d53541a" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="d5a7fa6e-f9eb-489d-bae2-98a17e26487e" data-file-name="components/email-preview.tsx">Detroit Axle</span></p>
          <p className="mb-2" data-unique-id="3c6364b3-0827-47b8-8a81-ba3386807534" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="653aab97-7e11-497a-9bf4-c52e29f2e709" data-file-name="components/email-preview.tsx">Customer Support: 888-583-0255</span></p>
          <p data-unique-id="694760a0-922b-43dc-b54d-42aa79bb517e" data-file-name="components/email-preview.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="38cacf6f-0a54-4a15-8ffa-84668c892313" data-file-name="components/email-preview.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="35228b1b-0942-4ee5-8091-1323e9898eba" data-file-name="components/email-preview.tsx"> Detroit Axle. All rights reserved.</span></p>
        </div>
      </div>
    </div>
    </>;
}