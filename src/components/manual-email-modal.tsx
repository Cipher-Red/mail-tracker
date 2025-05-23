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
    }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose} data-unique-id="9e2f77c1-0606-41c0-9836-6bb4e5540ed7" data-file-name="components/manual-email-modal.tsx">
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
      }} className="bg-background w-full max-w-4xl rounded-lg shadow-xl overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="11b6cb69-9281-473c-b564-80ace09596b5" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
            {/* Modal Header */}
            <div className="bg-primary text-primary-foreground p-6" data-unique-id="33a0a3c1-13ae-4585-bbb8-a092a1be949e" data-file-name="components/manual-email-modal.tsx">
              <div className="flex justify-between items-center" data-unique-id="4385c551-352f-4ff3-bf11-3a4f9d044e70" data-file-name="components/manual-email-modal.tsx">
                <h3 className="text-xl font-medium flex items-center" data-unique-id="4cdb8129-0a59-41f1-93b9-364f85358d0b" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="d80fd368-5561-422b-9045-9d9d89956149" data-file-name="components/manual-email-modal.tsx">
                  Email Review & Manual Send
                </span></h3>
                <button onClick={onClose} className="text-primary-foreground opacity-70 hover:opacity-100 p-2 rounded-full hover:bg-primary-foreground/20 transition-colors" aria-label="Close modal" data-unique-id="79cf59df-9a31-427b-9def-4909a211cc15" data-file-name="components/manual-email-modal.tsx">
                  <X size={24} />
                </button>
              </div>
              
              <p className="text-primary-foreground/80 text-sm mt-1" data-unique-id="a349d0b0-3043-4b5e-bfa4-c0963ff9f06a" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="569fe613-13a5-45dc-8d9f-5661b8859c19" data-file-name="components/manual-email-modal.tsx">
                Review email details, copy content to your email client, and mark as sent when complete.
              </span></p>
              
              <div className="flex items-center justify-between mt-6" data-unique-id="d2c8f142-13c2-4cc6-a4ea-578b84ff58fb" data-file-name="components/manual-email-modal.tsx">
                <div data-unique-id="e3b37683-5b28-4661-986c-91ab904de3db" data-file-name="components/manual-email-modal.tsx">
                  <span className="text-sm text-primary-foreground/90" data-unique-id="fb38c9ca-c6de-4e31-a63c-a41ba4530a37" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="a92bf47c-4e3e-4842-88b5-589761284077" data-file-name="components/manual-email-modal.tsx">
                    Email </span>{currentEmailIndex + 1}<span className="editable-text" data-unique-id="103dbafc-9f17-413b-9ad1-a4533edeabd6" data-file-name="components/manual-email-modal.tsx"> of </span>{totalEmails}<span className="editable-text" data-unique-id="9f73f691-f99e-4677-9564-65d816246bee" data-file-name="components/manual-email-modal.tsx"> (</span>{completionPercentage}<span className="editable-text" data-unique-id="e34ddf2b-1cac-4727-a78f-fa0fd966dd04" data-file-name="components/manual-email-modal.tsx">% complete)
                  </span></span>
                </div>
                
                <div className="flex items-center space-x-2" data-unique-id="f29007f0-b873-4891-8f5a-2eefe54e2df2" data-file-name="components/manual-email-modal.tsx">
                  <button onClick={onPrevious} disabled={currentEmailIndex === 0} className="p-1.5 rounded hover:bg-primary-foreground/10 disabled:opacity-40" data-unique-id="d24e9f49-1ed4-43ea-b824-616d92a2ba7b" data-file-name="components/manual-email-modal.tsx">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={onNext} disabled={currentEmailIndex === totalEmails - 1} className="p-1.5 rounded hover:bg-primary-foreground/10 disabled:opacity-40" data-unique-id="b7b5a8db-d692-4140-a0f0-5373c1020b3c" data-file-name="components/manual-email-modal.tsx">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="w-full bg-primary-foreground/20 h-2 mt-3 rounded-full" data-unique-id="5a82427c-f5da-4261-831e-b5f956fa8c34" data-file-name="components/manual-email-modal.tsx">
                <div className="bg-primary-foreground h-2 rounded-full transition-all duration-300" style={{
              width: `${completionPercentage}%`
            }} data-unique-id="b5eef90d-6cc2-47cc-a0da-06328696ceee" data-file-name="components/manual-email-modal.tsx"></div>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6" data-unique-id="6022f2bf-1c6b-4c8d-b4f8-725ad5019408" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
              {/* Recipient information */}
              <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="62bafd37-c08a-4757-97cc-28f07aba5a59" data-file-name="components/manual-email-modal.tsx">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="3b8e80d1-c82d-4dd2-bd62-767459fe2e7d" data-file-name="components/manual-email-modal.tsx">
                  <div data-unique-id="c56632cd-27c5-4b8e-80d7-00ae574d9298" data-file-name="components/manual-email-modal.tsx">
                    <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="c02fe00a-b91c-47b5-b659-f04291a955fe" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="fda13031-5d18-4e61-aecd-cf9ad7a42cac" data-file-name="components/manual-email-modal.tsx">To:</span></div>
                    <div className="flex items-center justify-between" data-unique-id="49a14ca7-aaf8-4fd5-9beb-4ba9394ac2b4" data-file-name="components/manual-email-modal.tsx">
                      <div className="text-base" data-unique-id="464a83fa-7d98-47fd-bb9e-3736d466dcf8" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.to}</div>
                      <button onClick={() => handleCopy(currentEmail.to || '', 'recipient')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy recipient" data-unique-id="b0768f7a-ca5d-49c5-abfb-7d7d207d692c" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                        {copySuccess === 'recipient' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div data-unique-id="017e2afc-3969-4d5f-86df-3f5fcac3e17f" data-file-name="components/manual-email-modal.tsx">
                    <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="343a1995-e4a4-427f-bc7c-3f3d397c2fe4" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="5ccb35ae-3328-4bee-8d37-5abd6bb22b3d" data-file-name="components/manual-email-modal.tsx">From:</span></div>
                    <div className="flex items-center justify-between" data-unique-id="7ef89c03-0413-4964-8f96-81732828a80c" data-file-name="components/manual-email-modal.tsx">
                      <div className="text-base" data-unique-id="51f8deb0-e2ab-42db-ad0e-58c07b25ffb5" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.from}</div>
                      <button onClick={() => handleCopy(currentEmail.from || '', 'sender')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy sender" data-unique-id="015f19c0-1840-47ab-ab0e-35d05fd35755" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                        {copySuccess === 'sender' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Subject line */}
              <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="67aae1b6-9489-4730-bbeb-699712279976" data-file-name="components/manual-email-modal.tsx">
                <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="6683d1c5-9537-42f3-93c7-f37889c1814e" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="1fa87327-5718-4593-91e1-d50693073243" data-file-name="components/manual-email-modal.tsx">Subject:</span></div>
                <div className="flex items-center justify-between" data-unique-id="36941233-8e07-4654-b47d-6e1a2680389a" data-file-name="components/manual-email-modal.tsx">
                  <div className="text-base font-medium" data-unique-id="371590a4-eb9f-433d-9779-285c0c333469" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.subject}</div>
                  <button onClick={() => handleCopy(currentEmail.subject || '', 'subject')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy subject" data-unique-id="8a6e7318-d2c4-4de0-bcd3-34c9dbfe1fa7" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                    {copySuccess === 'subject' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              {/* Email content */}
              <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="28c9975b-3ba0-49ce-ae26-1aa0f8916e60" data-file-name="components/manual-email-modal.tsx">
                <div className="flex items-center justify-between mb-3" data-unique-id="16754ac2-7926-4b9a-965f-04ddbad17920" data-file-name="components/manual-email-modal.tsx">
                  <div className="text-xs font-medium uppercase text-muted-foreground" data-unique-id="634005df-0bb5-4dd9-9d50-9d21ebb2db37" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="c36a72be-93b4-46a5-bc06-b2bb4cb81c93" data-file-name="components/manual-email-modal.tsx">Email Content:</span></div>
                  <div className="flex items-center space-x-2" data-unique-id="67e3a742-7ec7-4ca7-9f1d-46b4962b533b" data-file-name="components/manual-email-modal.tsx">
                    <button onClick={() => handleCopy(currentEmail.content || '', 'content')} className="flex items-center text-xs text-primary p-1.5 px-2.5 rounded hover:bg-accent/20" title="Copy plain text content" data-unique-id="766b3bc3-81f6-49f5-8f8a-12fd11938ff2" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                      {copySuccess === 'content' ? <><Check className="h-3 w-3 mr-1.5" />Copied!</> : <><Copy className="h-3 w-3 mr-1.5" />Copy Text</>}
                    </button>
                    
                    <button onClick={() => handleCopy(currentEmail.html || '', 'html')} className="flex items-center text-xs text-primary p-1.5 px-2.5 rounded hover:bg-accent/20" title="Copy HTML content" data-unique-id="609bba47-a3c4-437b-b35b-d817b608fb66" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                      {copySuccess === 'html' ? <><Check className="h-3 w-3 mr-1.5" />Copied!</> : <><Copy className="h-3 w-3 mr-1.5" />Copy HTML</>}
                    </button>
                  </div>
                </div>
                
                <div className="border border-border rounded-lg p-5 max-h-80 overflow-y-auto bg-accent/5" data-unique-id="2c1f39d6-7bc8-4896-b478-15c1ce359611" data-file-name="components/manual-email-modal.tsx">
                  <div className="whitespace-pre-wrap text-base" data-unique-id="cf9e3bb9-a28f-4bf4-881a-b3d9e5423215" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
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
                      parts.push(<a key={`${i}-${match.index}`} href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNum}`} target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium" data-unique-id="5637f1c7-5109-4c09-990d-d9a7e38d6bea" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                              {trackingNum}
                            </a>);
                      lastIndex = match.index + match[0].length;
                    }

                    // Add any remaining text
                    parts.push(line.substring(lastIndex));
                    return <div key={i} className="mb-3" data-unique-id="9c92a583-bfd4-4c3e-ba21-358a8debd4d6" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{parts}</div>;
                  }
                  return <div key={i} className={line.trim() === "" ? "h-4" : "mb-3"} data-unique-id="da3133ca-7a02-4aba-9f9c-ca783084030d" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{line}</div>;
                })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t border-border flex items-center justify-between" data-unique-id="9a48b9e8-76de-462c-b63d-0fe137e770c0" data-file-name="components/manual-email-modal.tsx">
              <button onClick={onOpenInEmailClient} className="flex items-center px-4 py-2.5 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="2081be38-8538-4bf3-8340-b72aaac62bb5" data-file-name="components/manual-email-modal.tsx">
                <ExternalLink className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="588d69ec-feb1-409c-ad25-6f8baf71d0f3" data-file-name="components/manual-email-modal.tsx">
                Open in Email Client
              </span></button>
              
              <button onClick={onMarkAsSent} disabled={isSent} className={`flex items-center px-5 py-2.5 rounded-md transition-colors ${isSent ? "bg-green-100 text-green-700 cursor-default dark:bg-green-900/30 dark:text-green-400" : "bg-primary text-primary-foreground hover:bg-primary/90"}`} data-unique-id="f49b494d-efc7-4027-a52c-0094fc05451a" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
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