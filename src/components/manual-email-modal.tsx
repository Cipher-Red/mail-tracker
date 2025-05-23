'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import copy from 'clipboard-copy';
interface ManualEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: {
    customer: any;
    subject: string;
    content: string;
    html: string;
    to: string;
    from: string;
  } | null;
  currentEmailIndex: number;
  totalEmails: number;
  completionPercentage: number;
  onPrevious: () => void;
  onNext: () => void;
  onMarkAsSent: () => void;
  onOpenInEmailClient: () => void;
  isSent: boolean;
}
export function ManualEmailModal({
  isOpen,
  onClose,
  currentEmail,
  currentEmailIndex,
  totalEmails,
  completionPercentage,
  onPrevious,
  onNext,
  onMarkAsSent,
  onOpenInEmailClient,
  isSent
}: ManualEmailModalProps) {
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const handleCopy = (text: string, type: string) => {
    copy(text);
    setCopySuccess(type);
    setTimeout(() => setCopySuccess(null), 2000);
  };
  // Force close modal if open state changes to false
  useEffect(() => {
    if (!isOpen) {
      const modalElement = document.getElementById('manual-email-modal-backdrop');
      if (modalElement) {
        modalElement.style.display = 'none';
      }
    }
  }, [isOpen]);
  if (!isOpen || !currentEmail) return null;
  return <AnimatePresence mode="wait">
      <motion.div id="manual-email-modal-backdrop" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} transition={{
      duration: 0.2
    }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose} data-unique-id="6c9ed673-5d34-4ea5-b1a4-31e6d7096fb9" data-file-name="components/manual-email-modal.tsx">
          <motion.div initial={{
        scale: 0.95,
        opacity: 0
      }} animate={{
        scale: 1,
        opacity: 1
      }} exit={{
        scale: 0.95,
        opacity: 0
      }} transition={{
        duration: 0.2
      }} className="bg-background w-full max-w-4xl rounded-lg shadow-xl overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="bc882334-b0bf-4c4a-9a4c-1f89b88a3c91" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
            {/* Modal Header */}
            <div className="bg-primary text-primary-foreground p-6" data-unique-id="7758440d-811e-4645-9b00-b1a7a13cc4fb" data-file-name="components/manual-email-modal.tsx">
              <div className="flex justify-between items-center" data-unique-id="c39c3bf8-b8fa-461c-950c-e17a03c30a1d" data-file-name="components/manual-email-modal.tsx">
                <h3 className="text-xl font-medium flex items-center" data-unique-id="6f373d38-6352-4638-a205-2a5b9959e814" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="8033cb48-a637-4eee-83c4-10dcbceac9f2" data-file-name="components/manual-email-modal.tsx">
                  Email Review & Manual Send
                </span></h3>
                <button onClick={onClose} className="text-primary-foreground opacity-70 hover:opacity-100 p-2 rounded-full hover:bg-primary-foreground/20 transition-colors" aria-label="Close modal" data-unique-id="75c9c8d5-ce3d-4b65-91c1-f64468051162" data-file-name="components/manual-email-modal.tsx">
                  <X size={24} />
                </button>
              </div>
              
              <p className="text-primary-foreground/80 text-sm mt-1" data-unique-id="38e3a58e-e2cc-4054-ad28-883717674443" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="b0aec3d3-e8c4-4be1-9285-8b4343751e71" data-file-name="components/manual-email-modal.tsx">
                Review email details, copy content to your email client, and mark as sent when complete.
              </span></p>
              
              <div className="flex items-center justify-between mt-6" data-unique-id="c83a065e-6148-4372-a849-9e489a6d41ac" data-file-name="components/manual-email-modal.tsx">
                <div data-unique-id="ca50f096-e6ff-4696-ae70-80431856d7aa" data-file-name="components/manual-email-modal.tsx">
                  <span className="text-sm text-primary-foreground/90" data-unique-id="143c5ace-84da-4ab7-b493-8bdf8092a3cd" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="fa4790f1-e8b5-48eb-ab97-fb21232db7f0" data-file-name="components/manual-email-modal.tsx">
                    Email </span>{currentEmailIndex + 1}<span className="editable-text" data-unique-id="84a39d18-fa1d-4a29-9abc-98f280cb8e89" data-file-name="components/manual-email-modal.tsx"> of </span>{totalEmails}<span className="editable-text" data-unique-id="cfa2a97b-df27-4289-955e-d1c17ad10d58" data-file-name="components/manual-email-modal.tsx"> (</span>{completionPercentage}<span className="editable-text" data-unique-id="7f2e4f71-99fc-409a-8583-b64624b55ca7" data-file-name="components/manual-email-modal.tsx">% complete)
                  </span></span>
                </div>
                
                <div className="flex items-center space-x-2" data-unique-id="df92a5b0-21fc-4093-8eca-dcdba395eb2f" data-file-name="components/manual-email-modal.tsx">
                  <button onClick={onPrevious} disabled={currentEmailIndex === 0} className="p-1.5 rounded hover:bg-primary-foreground/10 disabled:opacity-40" data-unique-id="4fd3510a-f04e-4eaf-a527-ea2dbd214c63" data-file-name="components/manual-email-modal.tsx">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={onNext} disabled={currentEmailIndex === totalEmails - 1} className="p-1.5 rounded hover:bg-primary-foreground/10 disabled:opacity-40" data-unique-id="f66a5b7d-8bba-46d2-b865-2e9b7c704e29" data-file-name="components/manual-email-modal.tsx">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="w-full bg-primary-foreground/20 h-2 mt-3 rounded-full" data-unique-id="8a826100-e133-4886-8381-2c25b3b0ae4d" data-file-name="components/manual-email-modal.tsx">
                <div className="bg-primary-foreground h-2 rounded-full transition-all duration-300" style={{
              width: `${completionPercentage}%`
            }} data-unique-id="72794bd4-cdcd-4bec-a99f-cd8c64527f06" data-file-name="components/manual-email-modal.tsx"></div>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6" data-unique-id="9059e705-1e17-46e5-b781-c1fac60b8325" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
              {/* Recipient information */}
              <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="ce31ba58-27dd-47d2-96e2-c56eb0cc4452" data-file-name="components/manual-email-modal.tsx">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="eca1733a-9efa-4b37-9caa-af77059c0ecd" data-file-name="components/manual-email-modal.tsx">
                  <div data-unique-id="7fde83df-ad57-448b-9234-7cd56a85a62c" data-file-name="components/manual-email-modal.tsx">
                    <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="96535329-794e-42b8-942f-df0702be9eda" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="cf257f3a-353d-4151-8c3b-e312230cabe7" data-file-name="components/manual-email-modal.tsx">To:</span></div>
                    <div className="flex items-center justify-between" data-unique-id="9d213820-36ff-41d6-8505-8987ee0bcc19" data-file-name="components/manual-email-modal.tsx">
                      <div className="text-base" data-unique-id="97d1c684-ed68-483c-b8d1-931c7cdae247" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.to}</div>
                      <button onClick={() => handleCopy(currentEmail.to || '', 'recipient')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy recipient" data-unique-id="e449d31f-60c6-4e31-8b26-2ae4e42a9769" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                        {copySuccess === 'recipient' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div data-unique-id="f545953c-1983-4c23-8eda-6ec7a3c45682" data-file-name="components/manual-email-modal.tsx">
                    <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="17386994-ee35-48ad-9132-31fce2488bea" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="96bba81c-f6fc-46a0-8fd3-561884893f56" data-file-name="components/manual-email-modal.tsx">From:</span></div>
                    <div className="flex items-center justify-between" data-unique-id="193239ba-f503-405d-9b61-fd60e91f9e03" data-file-name="components/manual-email-modal.tsx">
                      <div className="text-base" data-unique-id="6348e4eb-3afc-4369-b730-0de6303cbd9b" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.from}</div>
                      <button onClick={() => handleCopy(currentEmail.from || '', 'sender')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy sender" data-unique-id="5f9420f1-556f-4f2a-af09-f2458d7b8e25" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                        {copySuccess === 'sender' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Subject line */}
              <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="595529e9-c45e-44d0-bc30-66ee8c4cf92a" data-file-name="components/manual-email-modal.tsx">
                <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="adc76896-a05c-41cd-93e2-7aebab9dda65" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="b791487a-186a-45f9-aaff-54515b0773fb" data-file-name="components/manual-email-modal.tsx">Subject:</span></div>
                <div className="flex items-center justify-between" data-unique-id="4a2556c2-8a9d-404f-9ea3-9310024bf9eb" data-file-name="components/manual-email-modal.tsx">
                  <div className="text-base font-medium" data-unique-id="37d5aaf5-586c-49fa-b41a-54e98480e67a" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.subject}</div>
                  <button onClick={() => handleCopy(currentEmail.subject || '', 'subject')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy subject" data-unique-id="75b24a0c-1295-4bdb-8091-1ab22b9470f3" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                    {copySuccess === 'subject' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              {/* Email content */}
              <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="ce55e706-17d9-4841-bcb4-ca9189a9af0e" data-file-name="components/manual-email-modal.tsx">
                <div className="flex items-center justify-between mb-3" data-unique-id="e94f6191-d00a-40e7-8737-78c6240ef003" data-file-name="components/manual-email-modal.tsx">
                  <div className="text-xs font-medium uppercase text-muted-foreground" data-unique-id="b3952f42-66ee-41e0-b790-0bc11f7b7c09" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="def740e3-8fb4-491f-a408-0fa8aa1439c9" data-file-name="components/manual-email-modal.tsx">Email Content:</span></div>
                  <div className="flex items-center space-x-2" data-unique-id="68a2b643-740e-4db7-b283-699f5a6ea6ba" data-file-name="components/manual-email-modal.tsx">
                    <button onClick={() => handleCopy(currentEmail.content || '', 'content')} className="flex items-center text-xs text-primary p-1.5 px-2.5 rounded hover:bg-accent/20" title="Copy plain text content" data-unique-id="59888788-c7fa-4d47-968a-66d01122f43e" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                      {copySuccess === 'content' ? <><Check className="h-3 w-3 mr-1.5" />Copied!</> : <><Copy className="h-3 w-3 mr-1.5" />Copy Text</>}
                    </button>
                    
                    <button onClick={() => handleCopy(currentEmail.html || '', 'html')} className="flex items-center text-xs text-primary p-1.5 px-2.5 rounded hover:bg-accent/20" title="Copy HTML content" data-unique-id="30eb01a0-7968-4b7a-b45a-cbdeb79b3971" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                      {copySuccess === 'html' ? <><Check className="h-3 w-3 mr-1.5" />Copied!</> : <><Copy className="h-3 w-3 mr-1.5" />Copy HTML</>}
                    </button>
                  </div>
                </div>
                
                <div className="border border-border rounded-lg p-5 max-h-80 overflow-y-auto bg-accent/5" data-unique-id="116ee7b4-93c4-4897-b01b-8e1b63e2808b" data-file-name="components/manual-email-modal.tsx">
                  <div className="whitespace-pre-wrap text-base" data-unique-id="9338c659-3cb8-4f64-8f4a-ac3a0936c70c" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                    {currentEmail.content.split('\n').map((line, i) => {
                  // Make tracking numbers clickable
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
                      const trackingNum = match[0];
                      parts.push(<a key={`${i}-${match.index}`} href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNum}`} target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium" data-unique-id="185203c8-22c0-4690-8497-0fc8b69cd0fa" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                              {trackingNum}
                            </a>);
                      lastIndex = match.index + match[0].length;
                    }

                    // Add any remaining text
                    parts.push(line.substring(lastIndex));
                    return <div key={i} className="mb-3" data-unique-id="5be8bf23-d0d8-4c44-9ad6-518be0e15573" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{parts}</div>;
                  }
                  return <div key={i} className={line.trim() === "" ? "h-4" : "mb-3"} data-unique-id="d703d349-ff63-4a3a-87c0-b0f80ada287d" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{line}</div>;
                })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t border-border flex items-center justify-between" data-unique-id="a3812020-8342-41fb-bf55-85c7f0069d2e" data-file-name="components/manual-email-modal.tsx">
              <button onClick={onOpenInEmailClient} className="flex items-center px-4 py-2.5 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="296da00f-1829-4be1-9e2d-097c8913bea8" data-file-name="components/manual-email-modal.tsx">
                <ExternalLink className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="f233512a-036e-4b97-b2b6-707f7606e9e8" data-file-name="components/manual-email-modal.tsx">
                Open in Email Client
              </span></button>
              
              <button onClick={onMarkAsSent} disabled={isSent} className={`flex items-center px-5 py-2.5 rounded-md transition-colors ${isSent ? "bg-green-100 text-green-700 cursor-default dark:bg-green-900/30 dark:text-green-400" : "bg-primary text-primary-foreground hover:bg-primary/90"}`} data-unique-id="dca37045-8fcd-42f8-b50b-1bd470b331c8" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                {isSent ? <>
                    <Check className="mr-2 h-4 w-4" />
                    Marked as Sent
                  </> : <>
                    <Check className="mr-2 h-4 w-4" />
                    Mark as Sent
                  </>}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>;
}