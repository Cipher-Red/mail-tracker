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
      <div className="border border-border rounded-md overflow-hidden shadow-md dark:shadow-none" data-unique-id="7426a981-f75b-43df-a819-babcc7d64d78" data-file-name="components/email-preview.tsx">
      <div className="bg-muted p-3 border-b border-border dark:bg-card/60" data-unique-id="c1742797-a79a-4e6a-a704-94cba3edc052" data-file-name="components/email-preview.tsx">
        <div className="mb-3" data-unique-id="940b9532-f909-4054-a8c0-a13fe52023e8" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="cd58cbd7-5f2f-47a9-b7b2-6092271e999e" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="956acc22-7167-4322-bc1a-814dfe7e4980" data-file-name="components/email-preview.tsx">From: </span></span>
          <span className="text-sm" data-unique-id="d05cb1ce-9ef6-4ad6-af6e-80f343673299" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="8f3a22af-22c9-43a3-bf22-5ee00c984fd7" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{senderInfo.name} &lt;{senderInfo.email}&gt;</span></span>
        </div>
        <div className="mb-3" data-unique-id="9ec07e69-7816-429c-b60b-341ac2034109" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="3d7a3283-f93d-4ee6-8760-10de30830a55" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="74969026-84c5-447f-a45b-1386a3dcb8cd" data-file-name="components/email-preview.tsx">To: </span></span>
          <span className="text-sm" data-unique-id="8295d1d8-1ddd-4d96-abd9-debc23883246" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{previewData.customerName}<span className="editable-text" data-unique-id="e3267a36-abbd-4541-8203-23ee37b589f1" data-file-name="components/email-preview.tsx"> &lt;customer@example.com&gt;</span></span>
        </div>
        <div className="mb-2" data-unique-id="004e3573-2439-4394-8787-d12ea2358fd5" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="e03fb268-92fd-42e0-8b3d-c889a3a91b86" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="853c0191-246b-4ba7-86d0-bd637f082bc6" data-file-name="components/email-preview.tsx">Subject: </span></span>
          <span className="text-sm font-medium" data-unique-id="59ee60aa-48b9-489f-b82e-aacad93958ee" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{processedSubject}</span>
        </div>
        <div data-unique-id="90e2cbb5-ce83-4b00-9597-7072650fb049" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="12799f9a-e62a-453e-9232-1bd889dbb19f" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="a3da33ed-66f4-4dd3-942d-c0c96d330d31" data-file-name="components/email-preview.tsx">Preheader: </span></span>
          <span className="text-xs italic" data-unique-id="85068887-6eb6-48bf-845b-6eecb33ff403" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{template.preheader}</span>
        </div>
      </div>

      <div className="p-4 bg-card" data-unique-id="82b4b58f-ae57-496f-93e3-af80d4836241" data-file-name="components/email-preview.tsx">
        <div className="flex justify-end space-x-2 mb-4" data-unique-id="9df86d25-13ad-4f42-a3e0-6df586ee8e1c" data-file-name="components/email-preview.tsx">
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
          }} className="flex items-center px-3 py-1 text-xs bg-secondary hover:bg-secondary/90 rounded-md transition-colors" title="Download HTML" data-unique-id="6b2a30b9-658b-497e-befa-b583847925a0" data-file-name="components/email-preview.tsx">
            <Download className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="337a7a75-2589-4ab1-a130-799684fe17f7" data-file-name="components/email-preview.tsx">
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
          }} className="flex items-center px-3 py-1 text-xs bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy HTML with formatting preserved" data-unique-id="267e28e0-686d-4bd1-8298-c81dd92ae76c" data-file-name="components/email-preview.tsx">
            <Copy className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="b216e0ac-d6c2-46d2-b4d8-4a88a4400bb9" data-file-name="components/email-preview.tsx">
            Copy HTML
          </span></button>
          <button onClick={() => {
            const testEmail = prompt("Enter an email address to send a test email to:", "");
            if (testEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
              sendTestEmail(testEmail);
            } else if (testEmail) {
              alert("Please enter a valid email address");
            }
          }} className="flex items-center px-3 py-1 text-xs bg-primary text-white hover:bg-primary/90 rounded-md transition-colors" title="Send Test Email" data-unique-id="feab802a-7f80-4078-94b4-5eca00be513c" data-file-name="components/email-preview.tsx">
            <Mail className="h-3 w-3 mr-1" />
            <span data-unique-id="3d182e09-11af-4488-ac2e-4ac218cc2414" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="ec1fe757-6a73-4dfb-866d-731d43ee5e43" data-file-name="components/email-preview.tsx">Test Send</span></span>
          </button>
        </div>
        <div className="border-b border-border pb-4 mb-4" data-unique-id="a4c31e46-9962-446e-a7ab-1af6c1d946b1" data-file-name="components/email-preview.tsx">
        </div>
        <div className="email-content whitespace-pre-wrap" data-unique-id="095e5831-fbfc-44b0-958a-f7cec547aec4" data-file-name="components/email-preview.tsx" data-dynamic-text="true">
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
                parts.push(<span key={`${i}-${match.index}`} className="inline-flex items-center" data-unique-id="99b2d50c-8ac0-4cd4-9538-181dc6b2d2c1" data-file-name="components/email-preview.tsx">
                    <a href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNumber}`} target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium" data-unique-id="daa55669-bec4-4734-8b49-c3d3ef6c5a8c" data-file-name="components/email-preview.tsx" data-dynamic-text="true">
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
                  }} className="ml-1 p-0.5 rounded-full hover:bg-accent/20 inline-flex" title="Copy tracking number" data-unique-id="09d1e0af-09e6-4416-8efa-d4808362ae0d" data-file-name="components/email-preview.tsx">
                      <Copy className="h-3 w-3 text-primary" data-unique-id="9ef5feed-c7fe-4130-b8c0-69a2207de260" data-file-name="components/email-preview.tsx" data-dynamic-text="true" />
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
                  }} className="ml-1 p-0.5 rounded-full hover:bg-accent/20 inline-flex" title="Copy FedEx link" data-unique-id="1512daf6-ab8e-4b13-9c39-e333791e4ef8" data-file-name="components/email-preview.tsx">
                      <svg className="h-3 w-3 text-[#4D148C]" viewBox="0 0 24 24" fill="currentColor" data-unique-id="7a5df32e-fab4-4e6b-8b80-e34126ab15b4" data-file-name="components/email-preview.tsx">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 5a3 3 0 11-3 3 3 3 0 013-3zm0 11.13c-2.03-.31-3.88-1.47-5.14-3.13h10.28c-1.26 1.66-3.11 2.82-5.14 3.13z" data-unique-id="1f4d0ed6-522e-40cb-98e2-972dec855c23" data-file-name="components/email-preview.tsx" data-dynamic-text="true" />
                      </svg>
                    </button>
                    <button onClick={() => {
                    const trackingUrl = `https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNumber}`;
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(trackingUrl).then(() => toast.success('Tracking link copied!', {
                        duration: 2000
                      })).catch(err => console.error('Failed to copy link:', err));
                    }
                  }} className="ml-1 p-0.5 rounded-full hover:bg-accent/20 inline-flex" title="Copy FedEx link" data-unique-id="0c5ce90c-da86-46e0-8413-5377aeb9fe93" data-file-name="components/email-preview.tsx">
                      <svg className="h-3 w-3 text-[#4D148C]" viewBox="0 0 24 24" fill="currentColor" data-unique-id="ebf47245-4c80-472e-92f6-38c6560ba6a2" data-file-name="components/email-preview.tsx">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 5a3 3 0 11-3 3 3 3 0 013-3zm0 11.13c-2.03-.31-3.88-1.47-5.14-3.13h10.28c-1.26 1.66-3.11 2.82-5.14 3.13z" data-unique-id="25325e24-ce02-411e-bb06-fe5779647b9c" data-file-name="components/email-preview.tsx" data-dynamic-text="true" />
                      </svg>
                    </button>
                  </span>);
                lastIndex = match.index + match[0].length;
              }

              // Add any remaining text
              parts.push(line.substring(lastIndex));
              return <p key={i} className="mb-3" data-unique-id="9a84db94-124e-460d-b5bc-4da5cc3639f3" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{parts}</p>;
            }
            return <p key={i} className={`${line.trim() === "" ? "h-4" : "mb-3"}`} data-unique-id="2fbcf646-9955-4c9d-a230-43d908f82963" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{line}</p>;
          })}
        </div>
        <div className="mt-6 pt-4 border-t border-border text-sm text-muted-foreground" data-unique-id="db4c4f70-f1b9-4d03-8822-7eb470eea68a" data-file-name="components/email-preview.tsx">
          <p className="mb-2" data-unique-id="1b18408c-a03f-4468-9ce2-811d191b8d1e" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="08dc0a17-e370-4962-8b2f-ffe2bf41df55" data-file-name="components/email-preview.tsx">Detroit Axle</span></p>
          <p className="mb-2" data-unique-id="a34910fa-b6ee-4215-8728-de2b683e41ed" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="d48da867-fbf8-4234-9e84-2b4768671bea" data-file-name="components/email-preview.tsx">Customer Support: 888-583-0255</span></p>
          <p data-unique-id="310c994e-e657-4031-88f3-1444a655e274" data-file-name="components/email-preview.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="ed13431e-ad40-4336-afe5-f906d089bb7a" data-file-name="components/email-preview.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="0c5268e3-a9e0-475a-9e3f-cc205c45e2b9" data-file-name="components/email-preview.tsx"> Detroit Axle. All rights reserved.</span></p>
        </div>
      </div>
    </div>
    </>;
}