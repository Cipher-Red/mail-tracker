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
    }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose} data-unique-id="8dc16f62-46fb-4153-81ea-e9221da1ae55" data-file-name="components/manual-email-modal.tsx">
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
      }} className="bg-background w-full max-w-4xl rounded-lg shadow-xl overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="d3bf1dc2-89a9-41d7-94ad-5bd3439e7bbe" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
            {/* Modal Header */}
            <div className="bg-primary text-primary-foreground p-6" data-unique-id="0b33ed85-ffee-4ef3-93d0-62c7ef74c8fb" data-file-name="components/manual-email-modal.tsx">
              <div className="flex justify-between items-center" data-unique-id="cb3d986a-5ad5-4baf-a301-5121a6ed0151" data-file-name="components/manual-email-modal.tsx">
                <h3 className="text-xl font-medium flex items-center" data-unique-id="8ede46d3-840e-4024-aacc-23a81e9ae11b" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="58716876-7ef5-4a9c-aa96-7709ca2e351b" data-file-name="components/manual-email-modal.tsx">
                  Email Review & Manual Send
                </span></h3>
                <button onClick={onClose} className="text-primary-foreground opacity-70 hover:opacity-100 p-2 rounded-full hover:bg-primary-foreground/20 transition-colors" aria-label="Close modal" data-unique-id="18d93222-f209-4537-a0b6-2c7425c70c53" data-file-name="components/manual-email-modal.tsx">
                  <X size={24} />
                </button>
              </div>
              
              <p className="text-primary-foreground/80 text-sm mt-1" data-unique-id="3f260255-7dac-413d-86a6-2e5a3e117cc3" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="ed7df028-a863-4725-9ab7-5ed48d6fb275" data-file-name="components/manual-email-modal.tsx">
                Review email details, copy content to your email client, and mark as sent when complete.
              </span></p>
              
              <div className="flex items-center justify-between mt-6" data-unique-id="189cf0ed-4dd7-48fe-8b56-50cd17a84062" data-file-name="components/manual-email-modal.tsx">
                <div data-unique-id="07337a61-c508-4726-8e9a-1ee33610b8a6" data-file-name="components/manual-email-modal.tsx">
                  <span className="text-sm text-primary-foreground/90" data-unique-id="e76a4b31-09d1-4b99-9601-1154981ae928" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="0e74713b-1dcf-414f-a595-b1cd0668f7ec" data-file-name="components/manual-email-modal.tsx">
                    Email </span>{currentEmailIndex + 1}<span className="editable-text" data-unique-id="534b1942-673a-4fbb-9005-5ab109b5c3c8" data-file-name="components/manual-email-modal.tsx"> of </span>{totalEmails}<span className="editable-text" data-unique-id="e6ac4f65-6a12-408b-ab41-d21693301fde" data-file-name="components/manual-email-modal.tsx"> (</span>{completionPercentage}<span className="editable-text" data-unique-id="c347b4b2-d9c4-424e-8c69-9085684e554e" data-file-name="components/manual-email-modal.tsx">% complete)
                  </span></span>
                </div>
                
                <div className="flex items-center space-x-2" data-unique-id="9329e2f1-16fb-4efb-b54d-8a4240480ed4" data-file-name="components/manual-email-modal.tsx">
                  <button onClick={onPrevious} disabled={currentEmailIndex === 0} className="p-1.5 rounded hover:bg-primary-foreground/10 disabled:opacity-40" data-unique-id="81cd9986-776d-489b-a91c-762f87e0094b" data-file-name="components/manual-email-modal.tsx">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={onNext} disabled={currentEmailIndex === totalEmails - 1} className="p-1.5 rounded hover:bg-primary-foreground/10 disabled:opacity-40" data-unique-id="7f881602-27b1-48c8-8e67-663e4ad5bc44" data-file-name="components/manual-email-modal.tsx">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="w-full bg-primary-foreground/20 h-2 mt-3 rounded-full" data-unique-id="8a009557-6a75-41e8-8fa3-6d5777153aeb" data-file-name="components/manual-email-modal.tsx">
                <div className="bg-primary-foreground h-2 rounded-full transition-all duration-300" style={{
              width: `${completionPercentage}%`
            }} data-unique-id="57b5dcdf-f003-48e5-8ea1-e46c9a35400d" data-file-name="components/manual-email-modal.tsx"></div>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6" data-unique-id="675dddae-e210-4ed1-b45c-f110f54c1c12" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
              {/* Recipient information */}
              <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="5a1fe22a-a3ca-4052-a78b-2be51092cc5c" data-file-name="components/manual-email-modal.tsx">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="3f0405a7-424a-4b5b-b80b-17d06c61d957" data-file-name="components/manual-email-modal.tsx">
                  <div data-unique-id="945699f9-5545-4047-b9df-c7e734587f16" data-file-name="components/manual-email-modal.tsx">
                    <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="019d5e7e-f639-4835-b3cf-7368e810eea4" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="bab6b20f-cb10-491d-9e7c-630379fa947d" data-file-name="components/manual-email-modal.tsx">To:</span></div>
                    <div className="flex items-center justify-between" data-unique-id="e2ae8e78-fa87-4c30-abbb-5527a39afcc8" data-file-name="components/manual-email-modal.tsx">
                      <div className="text-base" data-unique-id="cd6cabf5-460e-4839-b32e-c1836dbfa33b" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.to}</div>
                      <button onClick={() => handleCopy(currentEmail.to || '', 'recipient')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy recipient" data-unique-id="d7a787c2-2ef3-44bb-9f87-166adfa8993a" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                        {copySuccess === 'recipient' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div data-unique-id="cdbbff20-58dd-4c7e-8eb3-2e97ecd698b7" data-file-name="components/manual-email-modal.tsx">
                    <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="cf1684e9-c30a-47d9-8985-4ccbdc87f523" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="1a45eae4-441b-438b-ab1a-809d05e41148" data-file-name="components/manual-email-modal.tsx">From:</span></div>
                    <div className="flex items-center justify-between" data-unique-id="b9e09563-f30b-40af-952d-6e477450b755" data-file-name="components/manual-email-modal.tsx">
                      <div className="text-base" data-unique-id="4a92b8c2-d3ec-4a85-9b94-1e09f76d0022" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.from}</div>
                      <button onClick={() => handleCopy(currentEmail.from || '', 'sender')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy sender" data-unique-id="766023db-e689-4515-9d09-eb9c51c029e2" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                        {copySuccess === 'sender' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Subject line */}
              <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="6225204f-3981-4167-ba1c-39ac2cfbd96a" data-file-name="components/manual-email-modal.tsx">
                <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="4fbd06f1-c834-4eaf-b09a-0c9e3dbe2ea2" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="8015b1b7-2ccd-44fc-943b-cd68c275c7a6" data-file-name="components/manual-email-modal.tsx">Subject:</span></div>
                <div className="flex items-center justify-between" data-unique-id="cd6c1171-579c-4079-938a-b5d710f54d2a" data-file-name="components/manual-email-modal.tsx">
                  <div className="text-base font-medium" data-unique-id="f954ed94-51c0-4d72-b764-6036c8319a1d" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.subject}</div>
                  <button onClick={() => handleCopy(currentEmail.subject || '', 'subject')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy subject" data-unique-id="86f6802b-389b-43a2-99a0-7246f8a2f4b0" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                    {copySuccess === 'subject' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              {/* Email content */}
              <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="211a3026-1fee-4454-abb4-ecbf95eb9950" data-file-name="components/manual-email-modal.tsx">
                <div className="flex items-center justify-between mb-3" data-unique-id="2ad3e5c5-e2ec-41b7-9483-6162dfb735a9" data-file-name="components/manual-email-modal.tsx">
                  <div className="text-xs font-medium uppercase text-muted-foreground" data-unique-id="857868a6-f4f5-4937-9eb0-6c24eedf67a7" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="fc82108c-db82-494a-bc2a-f1972e6f0382" data-file-name="components/manual-email-modal.tsx">Email Content:</span></div>
                  <div className="flex items-center space-x-2" data-unique-id="c4c43646-f1b9-4e07-b739-48d2725c3c98" data-file-name="components/manual-email-modal.tsx">
                    <button onClick={() => handleCopy(currentEmail.content || '', 'content')} className="flex items-center text-xs text-primary p-1.5 px-2.5 rounded hover:bg-accent/20" title="Copy plain text content" data-unique-id="1c097148-9f75-4bcd-8170-ee3340921c0b" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                      {copySuccess === 'content' ? <><Check className="h-3 w-3 mr-1.5" />Copied!</> : <><Copy className="h-3 w-3 mr-1.5" />Copy Text</>}
                    </button>
                    
                    <button onClick={() => handleCopy(currentEmail.html || '', 'html')} className="flex items-center text-xs text-primary p-1.5 px-2.5 rounded hover:bg-accent/20" title="Copy HTML content" data-unique-id="fc84b65c-8ca5-4241-8c23-d06989a78c1e" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                      {copySuccess === 'html' ? <><Check className="h-3 w-3 mr-1.5" />Copied!</> : <><Copy className="h-3 w-3 mr-1.5" />Copy HTML</>}
                    </button>
                  </div>
                </div>
                
                <div className="border border-border rounded-lg p-5 max-h-80 overflow-y-auto bg-accent/5" data-unique-id="6b12311e-62c6-4cea-87cb-17e94e4c98c4" data-file-name="components/manual-email-modal.tsx">
                  <div className="whitespace-pre-wrap text-base" data-unique-id="862e40ba-1633-4f22-b280-bdf9a1490076" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
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
                      parts.push(<a key={`${i}-${match.index}`} href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNum}`} target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium" data-unique-id="047d2de7-b20a-464d-9893-a6e932b4a0cb" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                              {trackingNum}
                            </a>);
                      lastIndex = match.index + match[0].length;
                    }

                    // Add any remaining text
                    parts.push(line.substring(lastIndex));
                    return <div key={i} className="mb-3" data-unique-id="9425e97b-202b-4da7-bd1f-9a136ecf2a63" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{parts}</div>;
                  }
                  return <div key={i} className={line.trim() === "" ? "h-4" : "mb-3"} data-unique-id="604b3f3a-ab11-4de8-8ca0-cfad8c1cad3a" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{line}</div>;
                })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t border-border flex items-center justify-between" data-unique-id="ea70b829-142f-4cc1-b93a-ab5ab79b9166" data-file-name="components/manual-email-modal.tsx">
              <button onClick={onOpenInEmailClient} className="flex items-center px-4 py-2.5 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="c98a264e-07c8-4503-894e-03f759e0138f" data-file-name="components/manual-email-modal.tsx">
                <ExternalLink className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="1c3faa1d-a1ef-40ca-bf7d-f9d048749011" data-file-name="components/manual-email-modal.tsx">
                Open in Email Client
              </span></button>
              
              <button onClick={onMarkAsSent} disabled={isSent} className={`flex items-center px-5 py-2.5 rounded-md transition-colors ${isSent ? "bg-green-100 text-green-700 cursor-default dark:bg-green-900/30 dark:text-green-400" : "bg-primary text-primary-foreground hover:bg-primary/90"}`} data-unique-id="b4d97b32-e9a6-4c10-890a-a6e3d6f1e26e" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
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