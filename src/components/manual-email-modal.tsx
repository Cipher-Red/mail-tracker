'use client';

import { useState } from 'react';
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
  return <AnimatePresence>
      {isOpen && currentEmail && <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} transition={{
      duration: 0.2
    }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto" data-unique-id="93650a35-2eb0-4a5c-adef-d81f88a88495" data-file-name="components/manual-email-modal.tsx">
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
      }} className="bg-background w-full max-w-4xl rounded-lg shadow-xl overflow-hidden" data-unique-id="2c74eaf6-00bd-4ee9-8215-001adceb4809" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
            {/* Modal Header */}
            <div className="bg-primary text-primary-foreground p-6" data-unique-id="5b10a1a7-5091-411a-b039-744b172a0f94" data-file-name="components/manual-email-modal.tsx">
              <div className="flex justify-between items-center" data-unique-id="3cffe567-d70d-49a0-8931-5b0aae92e428" data-file-name="components/manual-email-modal.tsx">
                <h3 className="text-xl font-medium flex items-center" data-unique-id="02210e4a-b477-4730-ab62-b1163f22016a" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="a52f9a72-91c2-46ce-b5b5-5961c55e7050" data-file-name="components/manual-email-modal.tsx">
                  Email Review & Manual Send
                </span></h3>
                <button onClick={onClose} className="text-primary-foreground opacity-70 hover:opacity-100" data-unique-id="75249240-5b8e-40be-a92d-47ea870389d5" data-file-name="components/manual-email-modal.tsx">
                  <X size={24} />
                </button>
              </div>
              
              <p className="text-primary-foreground/80 text-sm mt-1" data-unique-id="7a2531ea-f4bc-4cc6-8ed5-90e47e5c757f" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="0e582c66-49d8-4beb-9c96-eb121997eded" data-file-name="components/manual-email-modal.tsx">
                Review email details, copy content to your email client, and mark as sent when complete.
              </span></p>
              
              <div className="flex items-center justify-between mt-6" data-unique-id="d7c809a0-6df8-422f-87c4-6252f8cd6f52" data-file-name="components/manual-email-modal.tsx">
                <div data-unique-id="2a1a1cd6-d1f0-4057-a598-c8b2c4b0658e" data-file-name="components/manual-email-modal.tsx">
                  <span className="text-sm text-primary-foreground/90" data-unique-id="bbcff730-a1a6-4382-a527-7cd301fcede8" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="e87271ab-7974-4f85-9497-4dc191d6fab8" data-file-name="components/manual-email-modal.tsx">
                    Email </span>{currentEmailIndex + 1}<span className="editable-text" data-unique-id="83a2b600-a4c9-4a05-873d-5a70a294d2c1" data-file-name="components/manual-email-modal.tsx"> of </span>{totalEmails}<span className="editable-text" data-unique-id="0c4d936a-e4f0-4a92-9ae8-5c273141f0ed" data-file-name="components/manual-email-modal.tsx"> (</span>{completionPercentage}<span className="editable-text" data-unique-id="d4b1191a-3956-4b6e-9df7-35ec53ab7d82" data-file-name="components/manual-email-modal.tsx">% complete)
                  </span></span>
                </div>
                
                <div className="flex items-center space-x-2" data-unique-id="41cb4e3d-4e0f-4375-8937-0f7d4d9a5bfe" data-file-name="components/manual-email-modal.tsx">
                  <button onClick={onPrevious} disabled={currentEmailIndex === 0} className="p-1.5 rounded hover:bg-primary-foreground/10 disabled:opacity-40" data-unique-id="71d1aacb-eee3-4d38-a106-659f22972389" data-file-name="components/manual-email-modal.tsx">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={onNext} disabled={currentEmailIndex === totalEmails - 1} className="p-1.5 rounded hover:bg-primary-foreground/10 disabled:opacity-40" data-unique-id="4d347e42-6d5e-42d5-8604-dc1c9d62597b" data-file-name="components/manual-email-modal.tsx">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="w-full bg-primary-foreground/20 h-2 mt-3 rounded-full" data-unique-id="1759cd62-0840-4ee2-a792-ef8dcf79b8f3" data-file-name="components/manual-email-modal.tsx">
                <div className="bg-primary-foreground h-2 rounded-full transition-all duration-300" style={{
              width: `${completionPercentage}%`
            }} data-unique-id="b6701b82-e902-4e2a-ab7e-4903255dd0b2" data-file-name="components/manual-email-modal.tsx"></div>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6" data-unique-id="cd119a0e-28c8-4c59-9655-5f66863a20cb" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
              {/* Recipient information */}
              <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="2eaa0b73-2718-486d-8bae-a00d8e59b5d9" data-file-name="components/manual-email-modal.tsx">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="580501d9-0677-4a15-8c9f-3a902ec0cf9a" data-file-name="components/manual-email-modal.tsx">
                  <div data-unique-id="5dc31a08-3b8a-4e55-954e-5794031de17a" data-file-name="components/manual-email-modal.tsx">
                    <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="2f02cde0-354f-47cd-9d6c-bab1d8b4b031" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="9a1a6d06-e3af-4ba1-b05d-a2a41cbab34f" data-file-name="components/manual-email-modal.tsx">To:</span></div>
                    <div className="flex items-center justify-between" data-unique-id="cb24196e-53b8-4336-83ee-4f37c5d22e20" data-file-name="components/manual-email-modal.tsx">
                      <div className="text-base" data-unique-id="5e5dd4b3-4554-44b6-b69f-af252db709c1" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.to}</div>
                      <button onClick={() => handleCopy(currentEmail.to || '', 'recipient')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy recipient" data-unique-id="14aa854f-1c39-4017-9c2f-fe0bce7000e5" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                        {copySuccess === 'recipient' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div data-unique-id="db5e86aa-3922-42ee-b35c-497721021420" data-file-name="components/manual-email-modal.tsx">
                    <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="fb09c887-f80b-4dca-bb9c-89d109172d95" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="8775a8f0-f3f7-4c61-a246-591f8a3e10c4" data-file-name="components/manual-email-modal.tsx">From:</span></div>
                    <div className="flex items-center justify-between" data-unique-id="9074f80e-00fa-4d20-acb2-05cf55842359" data-file-name="components/manual-email-modal.tsx">
                      <div className="text-base" data-unique-id="96888a7f-5817-4d7a-828d-ac283042d8e6" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.from}</div>
                      <button onClick={() => handleCopy(currentEmail.from || '', 'sender')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy sender" data-unique-id="d8a0064d-701d-4528-a30c-7bbc9983fb1d" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                        {copySuccess === 'sender' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Subject line */}
              <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="3ca5aa55-8552-409b-a008-a4d8861c5b33" data-file-name="components/manual-email-modal.tsx">
                <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="f25a3cc2-dabc-4d8c-a836-fe40b6db8740" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="d00df56a-2996-4ba4-8042-34b834c2a42c" data-file-name="components/manual-email-modal.tsx">Subject:</span></div>
                <div className="flex items-center justify-between" data-unique-id="fad9960e-4cf8-4744-af25-52b424d5f6da" data-file-name="components/manual-email-modal.tsx">
                  <div className="text-base font-medium" data-unique-id="e08d2fff-a252-416f-9c8a-3f366eb96ee6" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.subject}</div>
                  <button onClick={() => handleCopy(currentEmail.subject || '', 'subject')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy subject" data-unique-id="04d38e79-0382-470a-ba97-99b0e5555dca" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                    {copySuccess === 'subject' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              {/* Email content */}
              <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="23ffa005-026e-41f8-9ec7-6f2c0027f9bd" data-file-name="components/manual-email-modal.tsx">
                <div className="flex items-center justify-between mb-3" data-unique-id="90a6b760-0abe-4099-b321-2dff96ea48bf" data-file-name="components/manual-email-modal.tsx">
                  <div className="text-xs font-medium uppercase text-muted-foreground" data-unique-id="cbadd156-3c0a-4c46-a7eb-f9e480e03965" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="575f29ed-46f9-4f69-a176-d6c00a9ef8e9" data-file-name="components/manual-email-modal.tsx">Email Content:</span></div>
                  <div className="flex items-center space-x-2" data-unique-id="0c9494a9-af53-475c-a707-787aeb038390" data-file-name="components/manual-email-modal.tsx">
                    <button onClick={() => handleCopy(currentEmail.content || '', 'content')} className="flex items-center text-xs text-primary p-1.5 px-2.5 rounded hover:bg-accent/20" title="Copy plain text content" data-unique-id="47b2c4e6-f0f6-49a3-baf6-fe3747c7bcc2" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                      {copySuccess === 'content' ? <><Check className="h-3 w-3 mr-1.5" />Copied!</> : <><Copy className="h-3 w-3 mr-1.5" />Copy Text</>}
                    </button>
                    
                    <button onClick={() => handleCopy(currentEmail.html || '', 'html')} className="flex items-center text-xs text-primary p-1.5 px-2.5 rounded hover:bg-accent/20" title="Copy HTML content" data-unique-id="a8161dce-1b68-48ad-8390-b8d6a4ed6434" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                      {copySuccess === 'html' ? <><Check className="h-3 w-3 mr-1.5" />Copied!</> : <><Copy className="h-3 w-3 mr-1.5" />Copy HTML</>}
                    </button>
                  </div>
                </div>
                
                <div className="border border-border rounded-lg p-5 max-h-80 overflow-y-auto bg-accent/5" data-unique-id="3da4e8f6-f7ff-4b2d-97e9-5681f26dab5c" data-file-name="components/manual-email-modal.tsx">
                  <div className="whitespace-pre-wrap text-base" data-unique-id="93f96fc5-2c47-4cd2-ba36-36a0bfa5d9bd" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                    {currentEmail.content.split('\n').map((line, i) => <div key={i} className={line.trim() === "" ? "h-4" : "mb-3"} data-unique-id="0d13497a-5b58-4a06-93fb-69e2a40a779e" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{line}</div>)}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t border-border flex items-center justify-between" data-unique-id="75d3fd64-6e0f-4fb6-be1d-735d5b287216" data-file-name="components/manual-email-modal.tsx">
              <button onClick={onOpenInEmailClient} className="flex items-center px-4 py-2.5 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="fdac5a8d-370e-4f5a-944e-a2b98cc1e1ac" data-file-name="components/manual-email-modal.tsx">
                <ExternalLink className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="d6239a93-9f78-481d-905c-2c07317a397b" data-file-name="components/manual-email-modal.tsx">
                Open in Email Client
              </span></button>
              
              <button onClick={onMarkAsSent} disabled={isSent} className={`flex items-center px-5 py-2.5 rounded-md transition-colors ${isSent ? "bg-green-100 text-green-700 cursor-default dark:bg-green-900/30 dark:text-green-400" : "bg-primary text-primary-foreground hover:bg-primary/90"}`} data-unique-id="f0103362-2ca5-46cb-bb0a-fc3f71d08ae0" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
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
        </motion.div>}
    </AnimatePresence>;
}