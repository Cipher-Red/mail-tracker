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

  // Extract FedEx tracking numbers from content
  const extractTrackingNumbers = (content: string): string[] => {
    const trackingRegex = /\b([A-Z0-9]{8,30})\b/g;
    const matches = content.match(trackingRegex) || [];
    return matches.filter(match => match.length >= 8);
  };
  const trackingNumbers = extractTrackingNumbers(processedContent);
  return <>
      <Toaster position="top-center" />
      <div className="border border-border rounded-md overflow-hidden shadow-md dark:shadow-none" data-unique-id="9bbe2056-648c-4925-a64c-cfd2ffea4ff9" data-file-name="components/email-preview.tsx">
      <div className="bg-muted p-3 border-b border-border dark:bg-card/60" data-unique-id="9cfd4357-5082-4d2d-9c55-4faf930a3b48" data-file-name="components/email-preview.tsx">
        <div className="mb-3" data-unique-id="337e5adc-96b4-4a89-bd4c-50e63448b7c9" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="8201fee8-5f4b-4f93-bdb2-6212e1860df9" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="c6af01b8-3436-4e86-b831-2dca39fde747" data-file-name="components/email-preview.tsx">From: </span></span>
          <span className="text-sm" data-unique-id="747226f5-194d-4830-a0a9-5142026b2ddd" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="fab7fc17-c247-4219-8b8a-6171541b9c78" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{senderInfo.name} &lt;{senderInfo.email}&gt;</span></span>
        </div>
        <div className="mb-3" data-unique-id="6c73541e-18da-4539-a1a7-815389fc626f" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="bce16ca4-2986-4621-a6ba-b89fa280bb44" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="3fbb4af9-597a-447f-8219-0d53af3b5225" data-file-name="components/email-preview.tsx">To: </span></span>
          <span className="text-sm" data-unique-id="b86a0432-514d-4926-b6b7-59b9f31a6299" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{previewData.customerName}<span className="editable-text" data-unique-id="a565e106-b390-4f55-9cd8-44cc6cdc7e48" data-file-name="components/email-preview.tsx"> &lt;customer@example.com&gt;</span></span>
        </div>
        <div className="mb-2" data-unique-id="214417c8-f53d-4641-bbf9-75ce67eea13f" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="5edeab36-7e16-470e-9401-e39dc7c1680f" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="007ba74c-1f66-4dc2-8e6d-5ae997090fda" data-file-name="components/email-preview.tsx">Subject: </span></span>
          <span className="text-sm font-medium" data-unique-id="76e9a3f4-9503-4b5e-80df-2861aab63feb" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{processedSubject}</span>
        </div>
        <div data-unique-id="2b9b4794-0b3d-48e1-90a2-22a9158806fa" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="2d974cd0-de2e-486a-b434-e902cc87bee5" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="90449a6c-3f76-428b-8335-28d819d5c708" data-file-name="components/email-preview.tsx">Preheader: </span></span>
          <span className="text-xs italic" data-unique-id="94876889-013f-4a14-8e9a-7fdca6c9da97" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{template.preheader}</span>
        </div>
      </div>

      <div className="p-4 bg-card" data-unique-id="f831697a-2960-442a-a769-81c90b816166" data-file-name="components/email-preview.tsx">
        <div className="flex justify-end space-x-2 mb-4" data-unique-id="934e3e39-ad82-4d06-a3a4-bb422133deea" data-file-name="components/email-preview.tsx">
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
          }} className="flex items-center px-3 py-1 text-xs bg-secondary hover:bg-secondary/90 rounded-md transition-colors" title="Download HTML" data-unique-id="edc03300-2e13-40ad-a43e-a344097b0a1d" data-file-name="components/email-preview.tsx">
            <Download className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="a3f23c19-10d9-4ccc-920c-de69f0c21b0b" data-file-name="components/email-preview.tsx">
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
          }} className="flex items-center px-3 py-1 text-xs bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy HTML with formatting preserved" data-unique-id="4c668c61-f61c-4b0b-8f62-606ec6cae069" data-file-name="components/email-preview.tsx">
            <Copy className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="65ee0825-2957-4fce-9752-5591bb52f2da" data-file-name="components/email-preview.tsx">
            Copy HTML
          </span></button>
          <button onClick={() => {
            const testEmail = prompt("Enter an email address to send a test email to:", "");
            if (testEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
              sendTestEmail(testEmail);
            } else if (testEmail) {
              alert("Please enter a valid email address");
            }
          }} className="flex items-center px-3 py-1 text-xs bg-primary text-white hover:bg-primary/90 rounded-md transition-colors" title="Send Test Email" data-unique-id="b105fbe4-5f84-4370-bc05-34220dd879b2" data-file-name="components/email-preview.tsx">
            <Mail className="h-3 w-3 mr-1" />
            <span data-unique-id="98333160-f0b5-47a0-a901-8653cd3df4a7" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="4f049cb0-ccbb-4fa5-89cb-4aab46ef2e2a" data-file-name="components/email-preview.tsx">Test Send</span></span>
          </button>
        </div>
        <div className="border-b border-border pb-4 mb-4" data-unique-id="47c6932e-d62d-4fd3-895e-2b76caee6f6b" data-file-name="components/email-preview.tsx">
        </div>
        <div className="email-content whitespace-pre-wrap" data-unique-id="201d5def-8e02-4106-bdf9-999602c00817" data-file-name="components/email-preview.tsx" data-dynamic-text="true">
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
                parts.push(<span key={`${i}-${match.index}`} className="inline-flex items-center" data-unique-id="0d0cf435-b290-460f-905c-028064c47774" data-file-name="components/email-preview.tsx">
                    <a href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNumber}`} target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium" data-unique-id="920c6936-34c7-47b8-8b0a-b8124d1f681b" data-file-name="components/email-preview.tsx" data-dynamic-text="true">
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
                  }} className="ml-1 p-0.5 rounded-full hover:bg-accent/20 inline-flex" title="Copy tracking number" data-unique-id="5595ef12-80e0-49db-a4fe-2759258b49d6" data-file-name="components/email-preview.tsx">
                      <Copy className="h-3 w-3 text-primary" data-unique-id="eeeaad01-413e-4af6-b143-1bc5eac9fc5f" data-file-name="components/email-preview.tsx" data-dynamic-text="true" />
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
                    function fallbackCopy(text: string) {
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
                  }} className="ml-1 p-0.5 rounded-full hover:bg-accent/20 inline-flex" title="Copy FedEx link" data-unique-id="e0004342-1fcb-441a-9727-ca8562a5dd75" data-file-name="components/email-preview.tsx">
                      <svg className="h-3 w-3 text-[#4D148C]" viewBox="0 0 24 24" fill="currentColor" data-unique-id="4a1c8c63-8376-4918-9c70-8beecc0d6cd9" data-file-name="components/email-preview.tsx">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 5a3 3 0 11-3 3 3 3 0 013-3zm0 11.13c-2.03-.31-3.88-1.47-5.14-3.13h10.28c-1.26 1.66-3.11 2.82-5.14 3.13z" data-unique-id="d8e7175e-7431-4df7-aaa5-125a286dfdc7" data-file-name="components/email-preview.tsx" data-dynamic-text="true" />
                      </svg>
                    </button>
                    <button onClick={() => {
                    const trackingUrl = `https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNumber}`;
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(trackingUrl).then(() => toast.success('Tracking link copied!', {
                        duration: 2000
                      })).catch(err => console.error('Failed to copy link:', err));
                    }
                  }} className="ml-1 p-0.5 rounded-full hover:bg-accent/20 inline-flex" title="Copy FedEx link" data-unique-id="16e2cfb4-360b-44f7-aa2f-31b39ffabae1" data-file-name="components/email-preview.tsx">
                      <svg className="h-3 w-3 text-[#4D148C]" viewBox="0 0 24 24" fill="currentColor" data-unique-id="8e7fbf82-9eaa-4baa-8249-d4656e54c0e6" data-file-name="components/email-preview.tsx">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 5a3 3 0 11-3 3 3 3 0 013-3zm0 11.13c-2.03-.31-3.88-1.47-5.14-3.13h10.28c-1.26 1.66-3.11 2.82-5.14 3.13z" data-unique-id="98a3bf83-c6ea-4004-b584-53b003f9b02c" data-file-name="components/email-preview.tsx" data-dynamic-text="true" />
                      </svg>
                    </button>
                  </span>);
                lastIndex = match.index + match[0].length;
              }

              // Add any remaining text
              parts.push(line.substring(lastIndex));
              return <p key={i} className="mb-3" data-unique-id="627a1583-6f35-4c7c-915c-f94f9c90c8be" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{parts}</p>;
            }
            return <p key={i} className={`${line.trim() === "" ? "h-4" : "mb-3"}`} data-unique-id="ba94602d-0a7c-4f53-9159-937658c72ba3" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{line}</p>;
          })}
        </div>
        <div className="mt-6 pt-4 border-t border-border text-sm text-muted-foreground" data-unique-id="44bf9b0e-2ca2-4971-8906-6cc9e0091e66" data-file-name="components/email-preview.tsx">
          <p className="mb-2" data-unique-id="3396c881-fb52-4bdf-be3f-40b6a06d59d7" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="b311bc46-fd5e-45bd-b5db-379570daa696" data-file-name="components/email-preview.tsx">Detroit Axle</span></p>
          <p className="mb-2" data-unique-id="05414477-f034-4b7f-a8d5-6a5294bfdfd2" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="561dc24d-e8a1-4d1b-91aa-ae4cca5284d4" data-file-name="components/email-preview.tsx">Customer Support: 888-583-0255</span></p>
          <p data-unique-id="a4f2641a-9940-485a-8df0-8b880c364b9e" data-file-name="components/email-preview.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="001c9804-7796-4614-8468-21251f77e1d4" data-file-name="components/email-preview.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="4cfaeabf-ab2f-41bc-bee8-f779970322d4" data-file-name="components/email-preview.tsx"> Detroit Axle. All rights reserved.</span></p>
        </div>
      </div>
    </div>
    </>;
}