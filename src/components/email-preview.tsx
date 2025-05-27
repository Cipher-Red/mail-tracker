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
      <div className="border border-border rounded-md overflow-hidden shadow-md dark:shadow-none" data-unique-id="c06e3b80-ad24-4cea-8ca7-065e79784c5f" data-file-name="components/email-preview.tsx">
      <div className="bg-muted p-3 border-b border-border dark:bg-card/60" data-unique-id="d4d39b56-6b89-44e4-aade-5a971f85a5bc" data-file-name="components/email-preview.tsx">
        <div className="mb-3" data-unique-id="aefe388f-8c2b-4f54-ad24-98f509331e66" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="675d841a-2b7d-4b81-a4ea-b0be06305ce0" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="9db4ce45-53e4-4ac2-8967-37c4038073d5" data-file-name="components/email-preview.tsx">From: </span></span>
          <span className="text-sm" data-unique-id="df59918b-d4f4-4808-b33d-f364b74db613" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="e0d62e1e-3adc-4482-be98-16e81aec243b" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{senderInfo.name} &lt;{senderInfo.email}&gt;</span></span>
        </div>
        <div className="mb-3" data-unique-id="60a8569c-eb4f-449c-9f92-7753f0abf269" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="463c66d9-b5e0-4e7e-a1fc-9edfaa9bbb5f" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="f553d09a-db79-4c68-abd3-55de978e6892" data-file-name="components/email-preview.tsx">To: </span></span>
          <span className="text-sm" data-unique-id="4523975c-6f8b-4255-ab44-f487b08bccf0" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{previewData.customerName}<span className="editable-text" data-unique-id="9fa3b75b-0acb-49c9-b1e2-5c1fdba6ab2a" data-file-name="components/email-preview.tsx"> &lt;customer@example.com&gt;</span></span>
        </div>
        <div className="mb-2" data-unique-id="0ce194d4-6e61-40a2-99f8-63bf6c30e2c3" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="d82e3ecc-e8cc-4052-9112-ac933336a9a0" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="6af5acf8-fc9f-4c61-88e8-1561e1e28e96" data-file-name="components/email-preview.tsx">Subject: </span></span>
          <span className="text-sm font-medium" data-unique-id="27aaa3c6-1f48-47a2-9452-e51c89cc18c3" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{processedSubject}</span>
        </div>
        <div data-unique-id="bf8c013c-3430-4165-9299-d21b131fccf5" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="01a1c29b-e5f2-49c2-b703-90b14d393370" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="db50159f-6d88-45ab-a4c3-b3ed2260a2f7" data-file-name="components/email-preview.tsx">Preheader: </span></span>
          <span className="text-xs italic" data-unique-id="9f075c7a-8e05-4ada-b87f-1860a656117f" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{template.preheader}</span>
        </div>
      </div>

      <div className="p-4 bg-card" data-unique-id="48c1d49e-2966-4da5-8dd9-5c53d6dd0d58" data-file-name="components/email-preview.tsx">
        <div className="flex justify-end space-x-2 mb-4" data-unique-id="9450b1ea-1d19-46ec-b769-3e4a72fe5013" data-file-name="components/email-preview.tsx">
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
          }} className="flex items-center px-3 py-1 text-xs bg-secondary hover:bg-secondary/90 rounded-md transition-colors" title="Download HTML" data-unique-id="346aafb0-253a-4c7d-be74-c46d072b7bcb" data-file-name="components/email-preview.tsx">
            <Download className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="05f2a83c-52db-4834-830d-ebcb544072d8" data-file-name="components/email-preview.tsx">
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
          }} className="flex items-center px-3 py-1 text-xs bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy HTML with formatting preserved" data-unique-id="9d254045-94d5-49da-b7b4-60a128cad61c" data-file-name="components/email-preview.tsx">
            <Copy className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="e76cace1-3a7a-410f-a0c7-5e9e1d2f43b8" data-file-name="components/email-preview.tsx">
            Copy HTML
          </span></button>
          <button onClick={() => {
            const testEmail = prompt("Enter an email address to send a test email to:", "");
            if (testEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
              sendTestEmail(testEmail);
            } else if (testEmail) {
              alert("Please enter a valid email address");
            }
          }} className="flex items-center px-3 py-1 text-xs bg-primary text-white hover:bg-primary/90 rounded-md transition-colors" title="Send Test Email" data-unique-id="199ef169-5a97-4403-92a0-858ddc7c2680" data-file-name="components/email-preview.tsx">
            <Mail className="h-3 w-3 mr-1" />
            <span data-unique-id="2ffcebae-828b-48c1-9ba8-0cb4606f3132" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="1340750a-e3da-4f8e-b7fb-837a03d39084" data-file-name="components/email-preview.tsx">Test Send</span></span>
          </button>
        </div>
        <div className="border-b border-border pb-4 mb-4" data-unique-id="320b77c1-2f6e-46ff-990e-274b1dcd54ae" data-file-name="components/email-preview.tsx">
        </div>
        <div className="email-content whitespace-pre-wrap" data-unique-id="ca5b5406-a6c8-464c-8b77-d8903d98affc" data-file-name="components/email-preview.tsx" data-dynamic-text="true">
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
                parts.push(<span key={`${i}-${match.index}`} className="inline-flex items-center" data-unique-id="dffda8ac-0217-43ca-aabc-b4f6f02b1cc1" data-file-name="components/email-preview.tsx">
                    <a href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNumber}`} target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium" data-unique-id="a83d35de-02a9-47d9-b227-0d5e23a385f4" data-file-name="components/email-preview.tsx" data-dynamic-text="true">
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
                  }} className="ml-1 p-0.5 rounded-full hover:bg-accent/20 inline-flex" title="Copy tracking number" data-unique-id="1a3e2ab9-302f-4311-b6b3-2eb091ac53e9" data-file-name="components/email-preview.tsx">
                      <Copy className="h-3 w-3 text-primary" data-unique-id="416c5c80-a66a-4deb-84ec-be7263d6e00d" data-file-name="components/email-preview.tsx" data-dynamic-text="true" />
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
                  }} className="ml-1 p-0.5 rounded-full hover:bg-accent/20 inline-flex" title="Copy FedEx link" data-unique-id="6028b34e-f648-42c9-b6a1-c0f6bcb0954e" data-file-name="components/email-preview.tsx">
                      <svg className="h-3 w-3 text-[#4D148C]" viewBox="0 0 24 24" fill="currentColor" data-unique-id="6cecfea3-4647-4b31-b546-5983d83788e0" data-file-name="components/email-preview.tsx">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 5a3 3 0 11-3 3 3 3 0 013-3zm0 11.13c-2.03-.31-3.88-1.47-5.14-3.13h10.28c-1.26 1.66-3.11 2.82-5.14 3.13z" data-unique-id="0b23e9d8-9289-4f8f-904b-800de2b039ed" data-file-name="components/email-preview.tsx" data-dynamic-text="true" />
                      </svg>
                    </button>
                    <button onClick={() => {
                    const trackingUrl = `https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNumber}`;
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(trackingUrl).then(() => toast.success('Tracking link copied!', {
                        duration: 2000
                      })).catch(err => console.error('Failed to copy link:', err));
                    }
                  }} className="ml-1 p-0.5 rounded-full hover:bg-accent/20 inline-flex" title="Copy FedEx link" data-unique-id="5984d838-ce88-450f-acda-34a3e305988e" data-file-name="components/email-preview.tsx">
                      <svg className="h-3 w-3 text-[#4D148C]" viewBox="0 0 24 24" fill="currentColor" data-unique-id="ead349f6-a4b0-4b2d-80cf-77b3a58a527b" data-file-name="components/email-preview.tsx">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 5a3 3 0 11-3 3 3 3 0 013-3zm0 11.13c-2.03-.31-3.88-1.47-5.14-3.13h10.28c-1.26 1.66-3.11 2.82-5.14 3.13z" data-unique-id="cfe908a1-9a2e-4aa7-9458-ea43692b24e1" data-file-name="components/email-preview.tsx" data-dynamic-text="true" />
                      </svg>
                    </button>
                  </span>);
                lastIndex = match.index + match[0].length;
              }

              // Add any remaining text
              parts.push(line.substring(lastIndex));
              return <p key={i} className="mb-3" data-unique-id="61abeb99-6659-4770-93fc-1067fe3c2030" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{parts}</p>;
            }
            return <p key={i} className={`${line.trim() === "" ? "h-4" : "mb-3"}`} data-unique-id="f002424d-96b2-4b46-a993-36934c3ea9e3" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{line}</p>;
          })}
        </div>
        <div className="mt-6 pt-4 border-t border-border text-sm text-muted-foreground" data-unique-id="0997370f-af22-481c-9828-2dcf6c515fbf" data-file-name="components/email-preview.tsx">
          <p className="mb-2" data-unique-id="ae1a6337-0a4a-4519-8228-8cb881133c93" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="ddb4b890-738d-48ba-ab6b-ee346f8a744c" data-file-name="components/email-preview.tsx">Detroit Axle</span></p>
          <p className="mb-2" data-unique-id="8c6cbd82-7ce5-4d73-ab3e-a83163591685" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="45026e68-4c08-4d3c-858c-e355eb55f9e6" data-file-name="components/email-preview.tsx">Customer Support: 888-583-0255</span></p>
          <p data-unique-id="971db060-9509-4444-a999-da9056150095" data-file-name="components/email-preview.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="750dfe9b-9455-4b6b-b36a-83ac6be2caf8" data-file-name="components/email-preview.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="6dbe8d68-3777-4acd-a255-69dda1bde13a" data-file-name="components/email-preview.tsx"> Detroit Axle. All rights reserved.</span></p>
        </div>
      </div>
    </div>
    </>;
}