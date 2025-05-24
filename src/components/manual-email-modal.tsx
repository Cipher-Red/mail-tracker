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
    }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose} data-unique-id="73d4e7b1-6ac3-4908-95e5-226d1de89271" data-file-name="components/manual-email-modal.tsx">
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
      }} className="bg-background w-full max-w-4xl rounded-lg shadow-xl overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="526aeb97-4388-4671-89b4-222d9abf8356" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
            {/* Modal Header */}
            <div className="bg-primary text-primary-foreground p-6" data-unique-id="03878196-829c-4508-9102-012faf097122" data-file-name="components/manual-email-modal.tsx">
              <div className="flex justify-between items-center" data-unique-id="9b2cbcdd-bcf8-4ddf-8cc4-fba946eedb4f" data-file-name="components/manual-email-modal.tsx">
                <h3 className="text-xl font-medium flex items-center" data-unique-id="86ced6b7-f830-4853-9ee7-eabaf11bb97f" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="dd569916-e91e-4662-91ff-8bd0214359da" data-file-name="components/manual-email-modal.tsx">
                  Email Review & Manual Send
                </span></h3>
                <button onClick={onClose} className="text-primary-foreground opacity-70 hover:opacity-100 p-2 rounded-full hover:bg-primary-foreground/20 transition-colors" aria-label="Close modal" data-unique-id="107be977-ffbe-4494-b8cf-e96948f5a98e" data-file-name="components/manual-email-modal.tsx">
                  <X size={24} />
                </button>
              </div>
              
              <p className="text-primary-foreground/80 text-sm mt-1" data-unique-id="52affde7-e272-46e8-9f29-772369bc1c79" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="15b3b636-2755-4611-9fff-dbbd5e5f2bfb" data-file-name="components/manual-email-modal.tsx">
                Review email details, copy content to your email client, and mark as sent when complete.
              </span></p>
              
              <div className="flex items-center justify-between mt-6" data-unique-id="ef314b36-a34e-414b-9dfb-8f1e7a293690" data-file-name="components/manual-email-modal.tsx">
                <div data-unique-id="1365c639-6772-44a8-a513-b41c9c49915d" data-file-name="components/manual-email-modal.tsx">
                  <span className="text-sm text-primary-foreground/90" data-unique-id="e81b0608-e0e3-4f93-aee1-777bef403d08" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="0f706c07-1697-494b-b1a4-a005f716e8a1" data-file-name="components/manual-email-modal.tsx">
                    Email </span>{currentEmailIndex + 1}<span className="editable-text" data-unique-id="14fecca5-9a24-479b-bb5a-5dccec1ec622" data-file-name="components/manual-email-modal.tsx"> of </span>{totalEmails}<span className="editable-text" data-unique-id="f1bb3213-5815-4ca4-a697-6acaff8fc375" data-file-name="components/manual-email-modal.tsx"> (</span>{completionPercentage}<span className="editable-text" data-unique-id="691df010-dfac-4d19-98a0-232cb1f73c49" data-file-name="components/manual-email-modal.tsx">% complete)
                  </span></span>
                </div>
                
                <div className="flex items-center space-x-2" data-unique-id="d8f610f6-3ae4-4f11-a686-5850d49553e7" data-file-name="components/manual-email-modal.tsx">
                  <button onClick={onPrevious} disabled={currentEmailIndex === 0} className="p-1.5 rounded hover:bg-primary-foreground/10 disabled:opacity-40" data-unique-id="0d9b78cb-8d8f-4fcc-82b4-c3dbbd5fa207" data-file-name="components/manual-email-modal.tsx">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={onNext} disabled={currentEmailIndex === totalEmails - 1} className="p-1.5 rounded hover:bg-primary-foreground/10 disabled:opacity-40" data-unique-id="71a313b5-609f-48c2-b85e-132b424a3891" data-file-name="components/manual-email-modal.tsx">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="w-full bg-primary-foreground/20 h-2 mt-3 rounded-full" data-unique-id="30a28850-aa60-4593-8430-50185ba5ddc2" data-file-name="components/manual-email-modal.tsx">
                <div className="bg-primary-foreground h-2 rounded-full transition-all duration-300" style={{
              width: `${completionPercentage}%`
            }} data-unique-id="85d1a7b4-85d0-4ccb-81a9-c32e4323188a" data-file-name="components/manual-email-modal.tsx"></div>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6" data-unique-id="4a7aff06-f18a-4dbb-85a4-42793926c366" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
              {/* Recipient information */}
              <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="6bf05a47-2eeb-4ca3-ae2c-d31d8268eee3" data-file-name="components/manual-email-modal.tsx">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="2ea73e38-2198-421b-a3ee-1ef45bb724ea" data-file-name="components/manual-email-modal.tsx">
                  <div data-unique-id="0e293098-a94b-46d8-a467-4ef6ebcdc399" data-file-name="components/manual-email-modal.tsx">
                    <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="489ca307-4067-4ee9-9e3c-b2d1b3c0a043" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="1c478e60-627d-4d33-b931-1d4e9ca7be40" data-file-name="components/manual-email-modal.tsx">To:</span></div>
                    <div className="flex items-center justify-between" data-unique-id="5bd121ac-e043-425d-9eac-0ac781f86b99" data-file-name="components/manual-email-modal.tsx">
                      <div className="text-base" data-unique-id="b9a9a14b-562b-4e51-876a-53268f2fc573" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.to}</div>
                      <button onClick={() => handleCopy(currentEmail.to || '', 'recipient')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy recipient" data-unique-id="fec88682-2888-4b0d-b0a1-d6f344c88917" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                        {copySuccess === 'recipient' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div data-unique-id="091403bd-5e3d-4b59-984b-179cc649c08c" data-file-name="components/manual-email-modal.tsx">
                    <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="008a0dcc-1442-4e9d-89c7-7c036c31f4d3" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="c0396fcb-34c8-49f9-aec5-da45e9f33e4d" data-file-name="components/manual-email-modal.tsx">From:</span></div>
                    <div className="flex items-center justify-between" data-unique-id="e3611df6-4c5b-48ec-b2e3-73fdc12e4716" data-file-name="components/manual-email-modal.tsx">
                      <div className="text-base" data-unique-id="8d837024-604c-49d2-b8c5-73cc1ee8765f" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.from}</div>
                      <button onClick={() => handleCopy(currentEmail.from || '', 'sender')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy sender" data-unique-id="c9e15e63-2c2b-4f77-a20f-6bcb44576a4e" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                        {copySuccess === 'sender' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Subject line */}
              <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="e03338d3-9727-44c1-b9ae-d761353c3dc5" data-file-name="components/manual-email-modal.tsx">
                <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="ed64c262-c24d-48d2-8363-296f7eefca60" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="1d1df8ae-7570-4bc0-a201-938c482d9777" data-file-name="components/manual-email-modal.tsx">Subject:</span></div>
                <div className="flex items-center justify-between" data-unique-id="c8d514b7-ead0-4ca7-86a6-3377c6c83745" data-file-name="components/manual-email-modal.tsx">
                  <div className="text-base font-medium" data-unique-id="ff7e0193-f559-4ba4-a9db-32c7f6acc1b0" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.subject}</div>
                  <button onClick={() => handleCopy(currentEmail.subject || '', 'subject')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy subject" data-unique-id="df1ec439-0175-4183-baad-101ca8758f33" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                    {copySuccess === 'subject' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              {/* Email content */}
              <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="64f21e18-9235-4c3c-b3cc-75c68c950217" data-file-name="components/manual-email-modal.tsx">
                <div className="flex items-center justify-between mb-3" data-unique-id="5333c4f2-7f33-4359-bea9-b29fcc7d834d" data-file-name="components/manual-email-modal.tsx">
                  <div className="text-xs font-medium uppercase text-muted-foreground" data-unique-id="4e31e490-2e77-4a8a-a328-5422ef039170" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="850e7b09-f0e5-43d6-80b8-1fa4370574b4" data-file-name="components/manual-email-modal.tsx">Email Content:</span></div>
                  <div className="flex items-center space-x-2" data-unique-id="3cc705f1-9153-4dba-9db3-6e138d39c2c8" data-file-name="components/manual-email-modal.tsx">
                    <button onClick={() => handleCopy(currentEmail.content || '', 'content')} className="flex items-center text-xs text-primary p-1.5 px-2.5 rounded hover:bg-accent/20" title="Copy plain text content" data-unique-id="61de723f-1c75-4eea-9a22-1c56d47cb0a5" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                      {copySuccess === 'content' ? <><Check className="h-3 w-3 mr-1.5" />Copied!</> : <><Copy className="h-3 w-3 mr-1.5" />Copy Text</>}
                    </button>
                    
                    <button onClick={() => handleCopy(currentEmail.html || '', 'html')} className="flex items-center text-xs text-primary p-1.5 px-2.5 rounded hover:bg-accent/20" title="Copy HTML content" data-unique-id="bbfcbf9a-fa50-4af9-b64d-7c5a5fd9cd71" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                      {copySuccess === 'html' ? <><Check className="h-3 w-3 mr-1.5" />Copied!</> : <><Copy className="h-3 w-3 mr-1.5" />Copy HTML</>}
                    </button>
                  </div>
                </div>
                
                <div className="border border-border rounded-lg p-5 max-h-80 overflow-y-auto bg-accent/5" data-unique-id="2ddbaa97-a490-439a-91ce-6a5065ff0fc2" data-file-name="components/manual-email-modal.tsx">
                  <div className="whitespace-pre-wrap text-base" data-unique-id="926a6656-c29d-433f-932a-af13227ce1c9" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
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
                      parts.push(<a key={`${i}-${match.index}`} href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNum}`} target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium" data-unique-id="a7f0c71c-2194-4090-b92f-3c34bd3381bc" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                              {trackingNum}
                            </a>);
                      lastIndex = match.index + match[0].length;
                    }

                    // Add any remaining text
                    parts.push(line.substring(lastIndex));
                    return <div key={i} className="mb-3" data-unique-id="46f02a70-d0e1-4354-9e35-6b40861c60ce" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{parts}</div>;
                  }
                  return <div key={i} className={line.trim() === "" ? "h-4" : "mb-3"} data-unique-id="5766a582-13a9-49e5-8784-f45040044e51" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{line}</div>;
                })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t border-border flex items-center justify-between" data-unique-id="d7bcc51c-f1cf-4cf2-9830-32417a1f5df6" data-file-name="components/manual-email-modal.tsx">
              <button onClick={onOpenInEmailClient} className="flex items-center px-4 py-2.5 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="a912a57a-48c7-4bec-b1ec-17bbd6f72d31" data-file-name="components/manual-email-modal.tsx">
                <ExternalLink className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="07a36a11-ec16-4db7-89cf-290beba36dd7" data-file-name="components/manual-email-modal.tsx">
                Open in Email Client
              </span></button>
              
              <button onClick={onMarkAsSent} disabled={isSent} className={`flex items-center px-5 py-2.5 rounded-md transition-colors ${isSent ? "bg-green-100 text-green-700 cursor-default dark:bg-green-900/30 dark:text-green-400" : "bg-primary text-primary-foreground hover:bg-primary/90"}`} data-unique-id="c83fa01f-0ce1-4d69-a81e-cf5d20007af9" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
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