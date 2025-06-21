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
      <div className="border border-border rounded-md overflow-hidden shadow-md dark:shadow-none" data-unique-id="5fff5484-a69e-4d52-b067-a5cf8ab2b1ab" data-file-name="components/email-preview.tsx">
      <div className="bg-muted p-3 border-b border-border dark:bg-card/60" data-unique-id="95b65312-311a-4d26-9493-74db73f4f60b" data-file-name="components/email-preview.tsx">
        <div className="mb-3" data-unique-id="59b173af-1846-4b82-bd69-f13487cbf2f3" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="80a677e7-d1ee-4543-9a29-502250f366e8" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="624e9d1b-7266-402e-b2f0-c83f0444ac59" data-file-name="components/email-preview.tsx">From: </span></span>
          <span className="text-sm" data-unique-id="3321ddf2-24c4-4341-b61d-c7dd8ee144a6" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="c912b174-44e2-412a-9d1d-8c4fc9800573" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{senderInfo.name} &lt;{senderInfo.email}&gt;</span></span>
        </div>
        <div className="mb-3" data-unique-id="f4086833-a729-4c4d-b57d-5d3e5364c938" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="b3f58d1e-f661-4354-b359-d24ebcd11d5a" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="16697b98-d552-48a4-9799-089e3c6bc53b" data-file-name="components/email-preview.tsx">To: </span></span>
          <span className="text-sm" data-unique-id="6f9d5cbd-46f6-4ae4-9e0d-f873dc26ba29" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{previewData.customerName}<span className="editable-text" data-unique-id="be8e08af-2e06-4ad5-8639-73bc3b02efdc" data-file-name="components/email-preview.tsx"> &lt;customer@example.com&gt;</span></span>
        </div>
        <div className="mb-2" data-unique-id="a492de1a-c32e-417a-b959-86ca6b14265b" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="e3e6c2eb-938f-4347-afde-9026afcf8051" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="8f898fca-9505-4fc7-a653-97c5fb5dbcea" data-file-name="components/email-preview.tsx">Subject: </span></span>
          <span className="text-sm font-medium" data-unique-id="d66d8517-8510-4c16-b834-3451059de60a" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{processedSubject}</span>
        </div>
        <div data-unique-id="152be03f-233e-4c14-b7c7-aa355f37328c" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="ce8ae5ef-b9c9-454b-bfe4-d5257a08b539" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="9d151536-ab35-4d34-9d4d-e678536498cd" data-file-name="components/email-preview.tsx">Preheader: </span></span>
          <span className="text-xs italic" data-unique-id="762f6e32-6320-4119-9bbc-187683597525" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{template.preheader}</span>
        </div>
      </div>

      <div className="p-4 bg-card" data-unique-id="a9505a5a-3aa5-431e-8fe4-95f813608010" data-file-name="components/email-preview.tsx">
        <div className="flex justify-end space-x-2 mb-4" data-unique-id="0b12485d-f157-4a86-959f-43538ecdae67" data-file-name="components/email-preview.tsx">
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
          }} className="flex items-center px-3 py-1 text-xs bg-secondary hover:bg-secondary/90 rounded-md transition-colors" title="Download HTML" data-unique-id="878006e0-4da7-469d-bfc9-c20d222293af" data-file-name="components/email-preview.tsx">
            <Download className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="34cf6d29-70f8-49cd-80e8-00e8096e812d" data-file-name="components/email-preview.tsx">
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
          }} className="flex items-center px-3 py-1 text-xs bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy HTML with formatting preserved" data-unique-id="3c51808e-6ff8-46ac-be57-325d77201bc8" data-file-name="components/email-preview.tsx">
            <Copy className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="3a06cc92-ebbb-438e-b497-e8d691ea3bff" data-file-name="components/email-preview.tsx">
            Copy HTML
          </span></button>
          <button onClick={() => {
            const testEmail = prompt("Enter an email address to send a test email to:", "");
            if (testEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
              sendTestEmail(testEmail);
            } else if (testEmail) {
              alert("Please enter a valid email address");
            }
          }} className="flex items-center px-3 py-1 text-xs bg-primary text-white hover:bg-primary/90 rounded-md transition-colors" title="Send Test Email" data-unique-id="e6beb52c-ba63-4823-9fc6-4455154e8d5b" data-file-name="components/email-preview.tsx">
            <Mail className="h-3 w-3 mr-1" />
            <span data-unique-id="d79ac20e-0fbc-41d5-ab47-ddaa9ca85909" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="9696ffc2-c722-42d2-bdee-26737b2273fa" data-file-name="components/email-preview.tsx">Test Send</span></span>
          </button>
        </div>
        <div className="border-b border-border pb-4 mb-4" data-unique-id="dfaab189-5144-45b7-bf64-cf528d59324c" data-file-name="components/email-preview.tsx">
        </div>
        <div className="email-content whitespace-pre-wrap" data-unique-id="c81485e6-b5b0-4da4-b730-bbb7db66bf0c" data-file-name="components/email-preview.tsx" data-dynamic-text="true">
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
                parts.push(<span key={`${i}-${match.index}`} className="inline-flex items-center" data-unique-id="daf63f19-6823-469f-a86e-00ea33545fbc" data-file-name="components/email-preview.tsx">
                    <a href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNumber}`} target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium" data-unique-id="a2522940-1083-4192-8749-d5575090dccf" data-file-name="components/email-preview.tsx" data-dynamic-text="true">
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
                  }} className="ml-1 p-0.5 rounded-full hover:bg-accent/20 inline-flex" title="Copy tracking number" data-unique-id="07686b87-0195-4422-b177-c3b715d6e794" data-file-name="components/email-preview.tsx">
                      <Copy className="h-3 w-3 text-primary" data-unique-id="3c5785b6-3a7d-432e-9269-ec6aad11789c" data-file-name="components/email-preview.tsx" data-dynamic-text="true" />
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
                  }} className="ml-1 p-0.5 rounded-full hover:bg-accent/20 inline-flex" title="Copy FedEx link" data-unique-id="7f1a2ffd-2cab-4ec2-a544-b32fb7c63dfd" data-file-name="components/email-preview.tsx">
                      <svg className="h-3 w-3 text-[#4D148C]" viewBox="0 0 24 24" fill="currentColor" data-unique-id="3bd0c76f-579d-4d5b-86ef-d598ba4d225e" data-file-name="components/email-preview.tsx">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 5a3 3 0 11-3 3 3 3 0 013-3zm0 11.13c-2.03-.31-3.88-1.47-5.14-3.13h10.28c-1.26 1.66-3.11 2.82-5.14 3.13z" data-unique-id="efadeac5-bac6-4a42-9147-47cdf0646279" data-file-name="components/email-preview.tsx" data-dynamic-text="true" />
                      </svg>
                    </button>
                    <button onClick={() => {
                    const trackingUrl = `https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNumber}`;
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(trackingUrl).then(() => toast.success('Tracking link copied!', {
                        duration: 2000
                      })).catch(err => console.error('Failed to copy link:', err));
                    }
                  }} className="ml-1 p-0.5 rounded-full hover:bg-accent/20 inline-flex" title="Copy FedEx link" data-unique-id="10713775-98a9-4d51-a215-5f77f29393f8" data-file-name="components/email-preview.tsx">
                      <svg className="h-3 w-3 text-[#4D148C]" viewBox="0 0 24 24" fill="currentColor" data-unique-id="6f0e2098-42a8-4dbf-a277-0f2ea5ddf034" data-file-name="components/email-preview.tsx">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 5a3 3 0 11-3 3 3 3 0 013-3zm0 11.13c-2.03-.31-3.88-1.47-5.14-3.13h10.28c-1.26 1.66-3.11 2.82-5.14 3.13z" data-unique-id="8a8649cf-af00-40e6-8dbe-c371a6869eae" data-file-name="components/email-preview.tsx" data-dynamic-text="true" />
                      </svg>
                    </button>
                  </span>);
                lastIndex = match.index + match[0].length;
              }

              // Add any remaining text
              parts.push(line.substring(lastIndex));
              return <p key={i} className="mb-3" data-unique-id="afb4fb9c-7738-4141-9fab-b73a748e895d" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{parts}</p>;
            }
            return <p key={i} className={`${line.trim() === "" ? "h-4" : "mb-3"}`} data-unique-id="6c498c4e-cf11-4ca7-adee-be5dc3566a1a" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{line}</p>;
          })}
        </div>
        <div className="mt-6 pt-4 border-t border-border text-sm text-muted-foreground" data-unique-id="269d4e03-f27a-4369-ad5a-d150fc1f3f58" data-file-name="components/email-preview.tsx">
          <p className="mb-2" data-unique-id="3cc68f92-a40b-4f9a-b03f-baa67f683158" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="0fdbfd9d-bce4-49ba-acd7-68bbed4951a7" data-file-name="components/email-preview.tsx">Detroit Axle</span></p>
          <p className="mb-2" data-unique-id="a7028ae6-0b5f-4283-9e29-e0510bc2f02e" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="ddc9209c-c9c6-4084-ad6b-9641453ca5cd" data-file-name="components/email-preview.tsx">Customer Support: 888-583-0255</span></p>
          <p data-unique-id="27dab4f1-3f1a-4418-95b9-3cf301a4a6bd" data-file-name="components/email-preview.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="2dcfae19-0716-4ab8-b678-78178b4fc936" data-file-name="components/email-preview.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="80779c31-da9b-44e4-b8e0-d11ddc0cddaf" data-file-name="components/email-preview.tsx"> Detroit Axle. All rights reserved.</span></p>
        </div>
      </div>
    </div>
    </>;
}