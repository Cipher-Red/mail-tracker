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
  return <div className="border border-border rounded-md overflow-hidden" data-unique-id="3b123510-2750-4f05-a382-10cf84ee78af" data-file-name="components/email-preview.tsx">
      <div className="bg-muted p-3 border-b border-border" data-unique-id="b0b5a7b9-147d-4690-ac3c-e64903cdc896" data-file-name="components/email-preview.tsx">
        <div className="mb-3" data-unique-id="bf1610c7-b07c-4071-bc11-330968b5f47a" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="71542d44-08f5-41b8-a5f2-bace0ec90b5c" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="594c8d20-fde0-43f2-9a77-12d4cfa48e57" data-file-name="components/email-preview.tsx">From: </span></span>
          <span className="text-sm" data-unique-id="5bfc9015-e92e-4ba6-8064-00752dff557e" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="bc8a2002-3f5b-42f7-97ff-4d50a9aa8734" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{senderInfo.name} &lt;{senderInfo.email}&gt;</span></span>
        </div>
        <div className="mb-3" data-unique-id="e899e8e6-aac8-4f6e-af5e-555bc9cacf4a" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="5c1ce9fb-51d4-4b20-9de4-b98485a9ac60" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="2dea72bf-13d4-4ccf-96b4-3463407015d9" data-file-name="components/email-preview.tsx">To: </span></span>
          <span className="text-sm" data-unique-id="d376877f-2f86-4475-9969-8846a1762b0c" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{previewData.customerName}<span className="editable-text" data-unique-id="d1dd6211-148b-497d-9116-3883dba253e9" data-file-name="components/email-preview.tsx"> &lt;customer@example.com&gt;</span></span>
        </div>
        <div className="mb-2" data-unique-id="d026cb2a-0787-4f1d-951f-da3141e27f11" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="00d3d8d1-d4d3-410d-b30e-3fed0bc45553" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="40f13f05-fa63-40c5-a023-f1146b8a93bb" data-file-name="components/email-preview.tsx">Subject: </span></span>
          <span className="text-sm font-medium" data-unique-id="a75e6b88-6995-4a00-b4d3-699bae736630" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{processedSubject}</span>
        </div>
        <div data-unique-id="b6f76ad9-a412-4d5b-86dd-9be272ae58db" data-file-name="components/email-preview.tsx">
          <span className="text-xs text-muted-foreground" data-unique-id="2415fd41-ebf5-4a7d-919e-aa21579f156c" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="651e8fb4-c8c8-4807-84c4-50547c03d8a7" data-file-name="components/email-preview.tsx">Preheader: </span></span>
          <span className="text-xs italic" data-unique-id="61e5d0d9-ce86-4fcc-af39-2a35ceadde72" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{template.preheader}</span>
        </div>
      </div>

      <div className="p-4 bg-white" data-unique-id="fac6a326-a32a-4dbf-bf26-afd872d8ade5" data-file-name="components/email-preview.tsx">
        <div className="flex justify-end space-x-2 mb-4" data-unique-id="dec39cfd-0f1c-45e4-9e02-9fcc15c2f5c6" data-file-name="components/email-preview.tsx">
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
        }} className="flex items-center px-3 py-1 text-xs bg-secondary hover:bg-secondary/90 rounded-md transition-colors" title="Download HTML" data-unique-id="2604a00c-4c0f-4db9-a8da-24ab92709f1f" data-file-name="components/email-preview.tsx">
            <Download className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="b4928b36-15f8-4983-a361-d5d0a0984cac" data-file-name="components/email-preview.tsx">
            HTML
          </span></button>
          <button onClick={() => {
          const html = generateHtmlEmail(template, previewData);
          navigator.clipboard.writeText(html);
          alert("HTML copied to clipboard!");
        }} className="flex items-center px-3 py-1 text-xs bg-accent hover:bg-accent/80 rounded-md transition-colors" title="Copy HTML" data-unique-id="ec01c39e-6b4e-41a5-8365-c505536447c9" data-file-name="components/email-preview.tsx">
            <Copy className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="982d3d71-82b5-4d80-9a0b-1f0c041417eb" data-file-name="components/email-preview.tsx">
            Copy
          </span></button>
          <button onClick={() => {
          const testEmail = prompt("Enter an email address to send a test email to:", "");
          if (testEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
            sendTestEmail(testEmail);
          } else if (testEmail) {
            alert("Please enter a valid email address");
          }
        }} className="flex items-center px-3 py-1 text-xs bg-primary text-white hover:bg-primary/90 rounded-md transition-colors" title="Send Test Email" data-unique-id="7affd0a4-a2a0-4ef6-b24d-db13724dc419" data-file-name="components/email-preview.tsx">
            <Mail className="h-3 w-3 mr-1" />
            <span data-unique-id="7fa0e22b-3b68-4b74-8ef4-088eacb52982" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="c11f20f2-b93b-4ef3-b2fb-fc738f6fde24" data-file-name="components/email-preview.tsx">Test Send</span></span>
          </button>
        </div>
        <div className="border-b border-border pb-4 mb-4" data-unique-id="69a57504-e7d9-46c7-aa88-d9a01f910b4a" data-file-name="components/email-preview.tsx">
          <img src="https://picsum.photos/200" alt="Detroit Axle" className="h-10 object-contain mb-4" data-unique-id="c0735567-d8b3-42fe-a342-51e79b182d27" data-file-name="components/email-preview.tsx" />
        </div>
        <div className="email-content whitespace-pre-wrap" data-unique-id="759af6c3-8560-43b7-a91e-2a028abe2255" data-file-name="components/email-preview.tsx" data-dynamic-text="true">
          {processedContent.split("\n").map((line, i) => <p key={i} className={`${line.trim() === "" ? "h-4" : "mb-3"}`} data-unique-id="768c5692-e786-4507-80ec-121c6d23b6bb" data-file-name="components/email-preview.tsx" data-dynamic-text="true">{line}</p>)}
        </div>
        <div className="mt-6 pt-4 border-t border-border text-sm text-muted-foreground" data-unique-id="ef8ad3dc-ff79-42a7-b0de-b6584cec2df0" data-file-name="components/email-preview.tsx">
          <p className="mb-2" data-unique-id="4f0fdd80-ddb5-411b-a94a-ce6939dd6455" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="54d438ac-2e50-4ec6-b7f7-964846867814" data-file-name="components/email-preview.tsx">Detroit Axle</span></p>
          <p className="mb-2" data-unique-id="3f87fbe9-1785-41c9-ac18-9c9f3dcd57f0" data-file-name="components/email-preview.tsx"><span className="editable-text" data-unique-id="cfc2078d-2dcd-4035-89e3-942674dbd298" data-file-name="components/email-preview.tsx">Customer Support: 888-583-0255</span></p>
          <p data-unique-id="d8a390fb-f293-403b-959f-7e740bfea00e" data-file-name="components/email-preview.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="ab93141e-44c1-439b-88f7-558a2f4772e0" data-file-name="components/email-preview.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="4eeb069f-59f4-49d7-b6ce-2cd5ee3268e6" data-file-name="components/email-preview.tsx"> Detroit Axle. All rights reserved.</span></p>
        </div>
      </div>
    </div>;
}