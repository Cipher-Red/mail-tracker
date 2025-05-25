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
    }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose} data-unique-id="1f69aa81-2643-40ff-bd0b-3bbe0bd11c84" data-file-name="components/manual-email-modal.tsx">
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
      }} className="bg-background w-full max-w-4xl rounded-lg shadow-xl overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="35a266ee-8fd4-46ad-ba98-fc9b0e79be25" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
            {/* Modal Header */}
            <div className="bg-primary text-primary-foreground p-6" data-unique-id="85f873ef-d2d6-4271-b77c-14b6326f2237" data-file-name="components/manual-email-modal.tsx">
              <div className="flex justify-between items-center" data-unique-id="bfe97c7e-27ae-46ff-bdc4-53e39f906f9b" data-file-name="components/manual-email-modal.tsx">
                <h3 className="text-xl font-medium flex items-center" data-unique-id="188ef385-60af-4ee1-a591-2e2b9da9677a" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="c57e41fc-bb48-4956-bcf8-c91a994dd281" data-file-name="components/manual-email-modal.tsx">
                  Email Review & Manual Send
                </span></h3>
                <button onClick={onClose} className="text-primary-foreground opacity-70 hover:opacity-100 p-2 rounded-full hover:bg-primary-foreground/20 transition-colors" aria-label="Close modal" data-unique-id="d4f870db-8517-4fe1-8f0b-32a8c2b8a60d" data-file-name="components/manual-email-modal.tsx">
                  <X size={24} />
                </button>
              </div>
              
              <p className="text-primary-foreground/80 text-sm mt-1" data-unique-id="02a42e39-8663-4e4c-82de-1dc101a34be9" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="b179fc52-e1ee-4d40-8015-645d2120ece8" data-file-name="components/manual-email-modal.tsx">
                Review email details, copy content to your email client, and mark as sent when complete.
              </span></p>
              
              <div className="flex items-center justify-between mt-6" data-unique-id="9842b277-4a3a-457c-a3e8-7e78638e890e" data-file-name="components/manual-email-modal.tsx">
                <div data-unique-id="550ceb5a-f7a0-41a2-a034-2f8a9b21eb6e" data-file-name="components/manual-email-modal.tsx">
                  <span className="text-sm text-primary-foreground/90" data-unique-id="bf533c08-e435-40c6-b6de-88ec40fd6423" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="44d2a913-f0cc-4bf1-9eb3-c29b37e404f3" data-file-name="components/manual-email-modal.tsx">
                    Email </span>{currentEmailIndex + 1}<span className="editable-text" data-unique-id="36a7a4b1-943b-4493-9dee-43de1a1ca8ac" data-file-name="components/manual-email-modal.tsx"> of </span>{totalEmails}<span className="editable-text" data-unique-id="807fe146-8479-4105-a5d2-475f1935c02d" data-file-name="components/manual-email-modal.tsx"> (</span>{completionPercentage}<span className="editable-text" data-unique-id="b5e68f9d-e800-4fb5-b05d-c4eecb2817fb" data-file-name="components/manual-email-modal.tsx">% complete)
                  </span></span>
                </div>
                
                <div className="flex items-center space-x-2" data-unique-id="4beb7b9e-0408-4580-aab5-a5729f9a0342" data-file-name="components/manual-email-modal.tsx">
                  <button onClick={onPrevious} disabled={currentEmailIndex === 0} className="p-1.5 rounded hover:bg-primary-foreground/10 disabled:opacity-40" data-unique-id="fca14ea4-b31e-4675-8743-065c4ceb347b" data-file-name="components/manual-email-modal.tsx">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={onNext} disabled={currentEmailIndex === totalEmails - 1} className="p-1.5 rounded hover:bg-primary-foreground/10 disabled:opacity-40" data-unique-id="58c4fbce-e90d-47ec-bfd4-dd821006f5e2" data-file-name="components/manual-email-modal.tsx">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="w-full bg-primary-foreground/20 h-2 mt-3 rounded-full" data-unique-id="daca0b5a-5989-4746-a931-6c3bcdbaecd8" data-file-name="components/manual-email-modal.tsx">
                <div className="bg-primary-foreground h-2 rounded-full transition-all duration-300" style={{
              width: `${completionPercentage}%`
            }} data-unique-id="6f50a890-4692-47ec-a5b6-baff1e1d28e0" data-file-name="components/manual-email-modal.tsx"></div>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6" data-unique-id="5164a7f4-eb6e-43eb-bcaf-e9d623d57401" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
              {/* Recipient information */}
              <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="96e5582f-d471-4746-b53c-b3014eee36ab" data-file-name="components/manual-email-modal.tsx">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="ebcc7ebb-ccf7-42b3-b846-ea696d69ced4" data-file-name="components/manual-email-modal.tsx">
                  <div data-unique-id="c297f85f-d9fe-437f-9998-49fc022a222e" data-file-name="components/manual-email-modal.tsx">
                    <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="230e8047-bbc3-41d6-815f-7e7fb7b7b802" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="9aa4836a-51b6-4388-bc5f-706717253a26" data-file-name="components/manual-email-modal.tsx">To:</span></div>
                    <div className="flex items-center justify-between" data-unique-id="2a748175-b467-4e8a-92ed-bfd7bb2fc055" data-file-name="components/manual-email-modal.tsx">
                      <div className="text-base" data-unique-id="a29aa3f3-44cf-4567-81ef-3e5bbb52946b" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.to}</div>
                      <button onClick={() => handleCopy(currentEmail.to || '', 'recipient')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy recipient" data-unique-id="a3cbdbc7-dd7c-489e-b105-918b7aae976c" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                        {copySuccess === 'recipient' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div data-unique-id="5ee0dd62-f4a0-4168-98eb-4d42224aaeb3" data-file-name="components/manual-email-modal.tsx">
                    <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="fcb70c2d-0125-4fde-9fe1-7c4f4918e2ad" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="b25d5813-94bc-44ea-9c5b-a141c70e1638" data-file-name="components/manual-email-modal.tsx">From:</span></div>
                    <div className="flex items-center justify-between" data-unique-id="d44baec6-60dd-4f84-88da-27dfb067eae4" data-file-name="components/manual-email-modal.tsx">
                      <div className="text-base" data-unique-id="47fba06b-f18d-470f-ad62-dd39a60bcbb0" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.from}</div>
                      <button onClick={() => handleCopy(currentEmail.from || '', 'sender')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy sender" data-unique-id="7906e3c8-80b4-4b89-8ed8-c34dc90119ae" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                        {copySuccess === 'sender' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Subject line */}
              <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="9b99287f-86c2-4347-b5bd-8c07bf10fc70" data-file-name="components/manual-email-modal.tsx">
                <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="988a088a-482f-4f96-b836-20dc8eec54c9" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="a8b2ebe3-7301-48b3-b6b7-7a8ab1b62818" data-file-name="components/manual-email-modal.tsx">Subject:</span></div>
                <div className="flex items-center justify-between" data-unique-id="d7ec1fe1-ae64-478a-8d2f-92e1f560de8d" data-file-name="components/manual-email-modal.tsx">
                  <div className="text-base font-medium" data-unique-id="6f42a613-6191-4207-8070-eff9e283c14d" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.subject}</div>
                  <button onClick={() => handleCopy(currentEmail.subject || '', 'subject')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy subject" data-unique-id="6385e77d-e679-4e0b-b049-2ddafadfd9d7" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                    {copySuccess === 'subject' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              {/* Email content */}
              <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="316bc353-da3e-4a46-a3ae-846fa0d50895" data-file-name="components/manual-email-modal.tsx">
                <div className="flex items-center justify-between mb-3" data-unique-id="d68385e7-91b6-46b3-a073-3adebd22b04a" data-file-name="components/manual-email-modal.tsx">
                  <div className="text-xs font-medium uppercase text-muted-foreground" data-unique-id="5e83dcb8-181a-4a8b-b781-f11f15117315" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="0be0c774-117c-43c8-a08f-06ab4063afdb" data-file-name="components/manual-email-modal.tsx">Email Content:</span></div>
                  <div className="flex items-center space-x-2" data-unique-id="4fedf544-7d93-4165-b403-fc3af7f338c4" data-file-name="components/manual-email-modal.tsx">
                    <button onClick={() => handleCopy(currentEmail.content || '', 'content')} className="flex items-center text-xs text-primary p-1.5 px-2.5 rounded hover:bg-accent/20" title="Copy plain text content" data-unique-id="65380521-ef9b-46c7-9a9e-299082194eb9" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                      {copySuccess === 'content' ? <><Check className="h-3 w-3 mr-1.5" />Copied!</> : <><Copy className="h-3 w-3 mr-1.5" />Copy Text</>}
                    </button>
                    
                    <button onClick={() => handleCopy(currentEmail.html || '', 'html')} className="flex items-center text-xs text-primary p-1.5 px-2.5 rounded hover:bg-accent/20" title="Copy HTML content" data-unique-id="29823d2d-c204-402d-9642-95e98d0bb875" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                      {copySuccess === 'html' ? <><Check className="h-3 w-3 mr-1.5" />Copied!</> : <><Copy className="h-3 w-3 mr-1.5" />Copy HTML</>}
                    </button>
                  </div>
                </div>
                
                <div className="border border-border rounded-lg p-5 max-h-80 overflow-y-auto bg-accent/5" data-unique-id="c5f02e51-4379-4623-a94e-34223c7d4c68" data-file-name="components/manual-email-modal.tsx">
                  <div className="whitespace-pre-wrap text-base" data-unique-id="fe76569a-bacc-46be-9581-6087f8abe1c9" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
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
                      parts.push(<a key={`${i}-${match.index}`} href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNum}`} target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium" data-unique-id="594bacac-4ed7-4ac1-98db-b1619b5315dd" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                              {trackingNum}
                            </a>);
                      lastIndex = match.index + match[0].length;
                    }

                    // Add any remaining text
                    parts.push(line.substring(lastIndex));
                    return <div key={i} className="mb-3" data-unique-id="2cd29de3-feca-45d9-9632-8ca707f62b9c" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{parts}</div>;
                  }
                  return <div key={i} className={line.trim() === "" ? "h-4" : "mb-3"} data-unique-id="60c24486-ddc6-439f-b8c1-179d8b9eeb67" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{line}</div>;
                })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t border-border flex items-center justify-between" data-unique-id="6d89ffe0-5f30-448c-93cb-c4eee3c56374" data-file-name="components/manual-email-modal.tsx">
              <button onClick={onOpenInEmailClient} className="flex items-center px-4 py-2.5 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="9f180660-0967-42c3-b684-d0b645e3dbdf" data-file-name="components/manual-email-modal.tsx">
                <ExternalLink className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="07309198-615c-4c51-93c1-f32509debdb7" data-file-name="components/manual-email-modal.tsx">
                Open in Email Client
              </span></button>
              
              <button onClick={onMarkAsSent} disabled={isSent} className={`flex items-center px-5 py-2.5 rounded-md transition-colors ${isSent ? "bg-green-100 text-green-700 cursor-default dark:bg-green-900/30 dark:text-green-400" : "bg-primary text-primary-foreground hover:bg-primary/90"}`} data-unique-id="6b2719cc-76f0-479d-8a40-7d9c8cf99444" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
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