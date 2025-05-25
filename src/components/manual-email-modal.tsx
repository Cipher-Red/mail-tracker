'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import copy from 'clipboard-copy';
import toast, { Toaster } from 'react-hot-toast';
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
  if (!isOpen || !currentEmail) {
    return null;
  }
  return <>
      <Toaster position="top-center" />
      <AnimatePresence mode="wait">
      <motion.div id="manual-email-modal-backdrop" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.2
      }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose} data-unique-id="f305d78c-dcdf-4ead-ae1d-69491e93d545" data-file-name="components/manual-email-modal.tsx">
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
        }} className="bg-background w-full max-w-4xl rounded-lg shadow-xl overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="ccc1f771-8916-4774-bec4-278799de8582" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
            {/* Modal Header */}
            <div className="bg-primary text-primary-foreground p-6" data-unique-id="11ac91d1-474a-402e-a3b5-4ed590591181" data-file-name="components/manual-email-modal.tsx">
              <div className="flex justify-between items-center" data-unique-id="7d69b52f-5589-4f5f-9052-d6680c20d43c" data-file-name="components/manual-email-modal.tsx">
                <h3 className="text-xl font-medium flex items-center" data-unique-id="c7d7299a-0a77-404c-9c97-709253e8c2a7" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="e81fcaec-45dc-43a4-9d2d-2b57526025a9" data-file-name="components/manual-email-modal.tsx">
                  Email Review & Manual Send
                </span></h3>
                <button onClick={onClose} className="text-primary-foreground opacity-70 hover:opacity-100 p-2 rounded-full hover:bg-primary-foreground/20 transition-colors" aria-label="Close modal" data-unique-id="79a816eb-115a-4a06-952b-dfbf6929c858" data-file-name="components/manual-email-modal.tsx">
                  <X size={24} />
                </button>
              </div>
              
              <p className="text-primary-foreground/80 text-sm mt-1" data-unique-id="62788851-af0c-4a77-8446-143842d024a6" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="f2ed0424-0937-49db-9834-965c0db13aa5" data-file-name="components/manual-email-modal.tsx">
                Review email details, copy content to your email client, and mark as sent when complete.
              </span></p>
              
              <div className="flex items-center justify-between mt-6" data-unique-id="01b527eb-c771-4e47-ab46-494b8366c791" data-file-name="components/manual-email-modal.tsx">
                <div data-unique-id="198f2a39-3c19-47e6-8193-3fd8ddfd119c" data-file-name="components/manual-email-modal.tsx">
                  <span className="text-sm text-primary-foreground/90" data-unique-id="1dd74907-5025-419c-a829-d80496cab273" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="2c9b1c47-3a4f-4f18-a817-aa2856144085" data-file-name="components/manual-email-modal.tsx">
                    Email </span>{currentEmailIndex + 1}<span className="editable-text" data-unique-id="6901f6ec-db9b-4322-9e71-85b195f12636" data-file-name="components/manual-email-modal.tsx"> of </span>{totalEmails}<span className="editable-text" data-unique-id="591e6377-7aa0-4391-a334-c2797f655d4a" data-file-name="components/manual-email-modal.tsx"> (</span>{completionPercentage}<span className="editable-text" data-unique-id="bcc9efa1-906b-4753-998a-e6512a26b7ac" data-file-name="components/manual-email-modal.tsx">% complete)
                  </span></span>
                </div>
                
                <div className="flex items-center space-x-2" data-unique-id="e5f80d6b-e28c-431d-85a4-320e1b1d0d1f" data-file-name="components/manual-email-modal.tsx">
                  <button onClick={onPrevious} disabled={currentEmailIndex === 0} className="p-1.5 rounded hover:bg-primary-foreground/10 disabled:opacity-40" data-unique-id="694b721c-6156-4ddc-93a0-e2e4e0038363" data-file-name="components/manual-email-modal.tsx">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={onNext} disabled={currentEmailIndex === totalEmails - 1} className="p-1.5 rounded hover:bg-primary-foreground/10 disabled:opacity-40" data-unique-id="734e81ad-5b7f-440f-8771-c56678cc222e" data-file-name="components/manual-email-modal.tsx">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="w-full bg-primary-foreground/20 h-2 mt-3 rounded-full" data-unique-id="c28bb854-6b7b-4aaa-a39d-326de6ae6423" data-file-name="components/manual-email-modal.tsx">
                <div className="bg-primary-foreground h-2 rounded-full transition-all duration-300" style={{
                width: `${completionPercentage}%`
              }} data-unique-id="03144a0c-324b-48c7-b212-b485ceee8b39" data-file-name="components/manual-email-modal.tsx"></div>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6" data-unique-id="ed714c7e-19f1-4905-840d-e3f30548d4d5" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
              {/* Recipient information */}
              <div className="bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="ba09bee4-4070-4d94-af42-732fd5367eb9" data-file-name="components/manual-email-modal.tsx">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="5de817f6-98aa-4c63-8129-6994662f11fb" data-file-name="components/manual-email-modal.tsx">
                  <div data-unique-id="257af7ec-06fe-4359-9984-a64da1e33538" data-file-name="components/manual-email-modal.tsx">
                    <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="c08d6100-144e-45d3-9d11-1ffaa81c2da8" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="79132d97-ef61-4946-b946-8cbadad45a33" data-file-name="components/manual-email-modal.tsx">To:</span></div>
                    <div className="flex items-center justify-between" data-unique-id="fcbaf51f-8582-40dc-b4a3-8e8e0b35366c" data-file-name="components/manual-email-modal.tsx">
                      <div className="text-base" data-unique-id="9b8e9abd-6d08-4461-95ce-1099dbe5a8cf" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.to}</div>
                      <button onClick={() => handleCopy(currentEmail.to || '', 'recipient')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy recipient" data-unique-id="6efdba4a-60e2-4db9-8e76-771bc89e461b" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                        {copySuccess === 'recipient' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div data-unique-id="510d677b-03ea-4c42-99aa-984195323c05" data-file-name="components/manual-email-modal.tsx">
                    <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="526b326f-cc6c-42f4-9086-9f14a3a1a665" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="a14e2569-6e57-45a4-97d2-d2d410176c2a" data-file-name="components/manual-email-modal.tsx">From:</span></div>
                    <div className="flex items-center justify-between" data-unique-id="9919fde6-2827-4938-9913-acc2833e1b40" data-file-name="components/manual-email-modal.tsx">
                      <div className="text-base" data-unique-id="f135dcc1-5b16-4588-90a2-bf057b40ceb4" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.from}</div>
                      <button onClick={() => handleCopy(currentEmail.from || '', 'sender')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy sender" data-unique-id="79d48807-4138-4f17-bd67-264fb2e57b36" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                        {copySuccess === 'sender' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Subject line */}
              <div className="bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="41107c9b-7a34-4a3b-bece-86cec320009f" data-file-name="components/manual-email-modal.tsx">
                <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="919a4b7d-a422-44d5-8108-a37cfccc4814" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="f8626bb7-eb2d-4251-806e-01e60c1e9c3a" data-file-name="components/manual-email-modal.tsx">Subject:</span></div>
                <div className="flex items-center justify-between" data-unique-id="1e0afe78-9cc6-407a-bfd5-c87fb105cdc3" data-file-name="components/manual-email-modal.tsx">
                  <div className="text-base font-medium" data-unique-id="8a1246a6-598d-4c77-9804-deafa7d3b3ea" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.subject}</div>
                  <button onClick={() => handleCopy(currentEmail.subject || '', 'subject')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy subject" data-unique-id="f9c0590c-1e73-437a-8903-48880efbe236" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                    {copySuccess === 'subject' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              {/* Email content */}
              <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="2e09c0b8-1014-4e9a-8db5-16225ee858a8" data-file-name="components/manual-email-modal.tsx">
                <div className="flex items-center justify-between mb-3" data-unique-id="ff19e323-7d96-4c4b-b694-b9981d6dc58b" data-file-name="components/manual-email-modal.tsx">
                  <div className="text-xs font-medium uppercase text-muted-foreground" data-unique-id="6f3bc3a6-5870-4ee9-924e-a088c6b510b5" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="8aa2176c-9e32-4e34-81ab-9d17a37f7591" data-file-name="components/manual-email-modal.tsx">Email Content:</span></div>
                  <div className="flex items-center space-x-2" data-unique-id="988d9f0e-7c8f-4f22-b44f-13cd231a4c61" data-file-name="components/manual-email-modal.tsx">
                    <button onClick={() => handleCopy(currentEmail.content || '', 'content')} className="flex items-center text-xs text-primary p-1.5 px-2.5 rounded hover:bg-accent/20" title="Copy plain text content" data-unique-id="011a7851-4d90-493f-822a-f3373dbdb13b" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                      {copySuccess === 'content' ? <><Check className="h-3 w-3 mr-1.5" />Copied!</> : <><Copy className="h-3 w-3 mr-1.5" />Copy Text</>}
                    </button>
                    
                    <button onClick={() => handleCopy(currentEmail.html || '', 'html')} className="flex items-center text-xs text-primary p-1.5 px-2.5 rounded hover:bg-accent/20" title="Copy HTML content" data-unique-id="3813276b-2548-4c04-9b0d-3bf4f189ea50" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                      {copySuccess === 'html' ? <><Check className="h-3 w-3 mr-1.5" />Copied!</> : <><Copy className="h-3 w-3 mr-1.5" />Copy HTML</>}
                    </button>
                  </div>
                </div>
                
                <div className="border border-border rounded-lg p-5 max-h-80 overflow-y-auto bg-accent/5 dark:bg-card/60" data-unique-id="a2d46fb4-1e5b-4f5b-a649-7aa6d5119272" data-file-name="components/manual-email-modal.tsx">
                  <div className="whitespace-pre-wrap text-base" data-unique-id="0f114833-1f7c-43ef-bd35-6cc11f1a4928" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
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

                        // Add the tracking number as a clickable link with copy buttons
                        const trackingNum = match[0];
                        parts.push(<span key={`${i}-${match.index}`} className="inline-flex items-center" data-unique-id="619db0b6-ee1d-46a1-87e9-0a38ec8f9b8d" data-file-name="components/manual-email-modal.tsx">
                        <a href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNum}`} target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium" data-unique-id="08411840-f92c-426e-ae19-8cedcc4c0473" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                          {trackingNum}
                        </a>
                        <button onClick={e => {
                            e.stopPropagation();
                            try {
                              if (navigator.clipboard) {
                                navigator.clipboard.writeText(trackingNum).then(() => toast.success('Tracking number copied!', {
                                  duration: 2000
                                })).catch(err => {
                                  console.error('Clipboard API failed:', err);
                                  fallbackCopy(trackingNum);
                                });
                              } else {
                                fallbackCopy(trackingNum);
                              }
                            } catch (err) {
                              console.error('Copy operation failed:', err);
                              toast.error('Failed to copy. Please try again.');
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
                                  toast.success('Tracking number copied!', {
                                    duration: 2000
                                  });
                                } else {
                                  toast.error('Failed to copy. Please try again.');
                                }
                              } catch (err) {
                                console.error('Fallback copy failed:', err);
                                toast.error('Failed to copy. Please copy manually.');
                              }
                              document.body.removeChild(textArea);
                            }
                          }} className="ml-1 p-0.5 rounded-full hover:bg-accent/20 inline-flex" title="Copy tracking number" data-unique-id="015db0b8-280e-470a-b615-5a5896bc4f9e" data-file-name="components/manual-email-modal.tsx">
                          <Copy className="h-3 w-3 text-primary" data-unique-id="18440c26-ccc1-4e37-a7a5-30abaef603b1" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true" />
                        </button>
                        <button onClick={e => {
                            e.stopPropagation();
                            const trackingUrl = `https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNum}`;
                            try {
                              if (navigator.clipboard) {
                                navigator.clipboard.writeText(trackingUrl).then(() => toast.success('Tracking link copied!', {
                                  duration: 2000,
                                  icon: '🔗'
                                })).catch(err => {
                                  console.error('Clipboard API failed:', err);
                                  fallbackCopy(trackingUrl);
                                });
                              } else {
                                fallbackCopy(trackingUrl);
                              }
                            } catch (err) {
                              console.error('Copy operation failed:', err);
                              toast.error('Failed to copy link. Please try again.');
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
                                    duration: 2000,
                                    icon: '🔗'
                                  });
                                } else {
                                  toast.error('Failed to copy link. Please try again.');
                                }
                              } catch (err) {
                                console.error('Fallback copy failed:', err);
                                toast.error('Failed to copy link. Please copy manually.');
                              }
                              document.body.removeChild(textArea);
                            }
                          }} className="ml-1 p-0.5 rounded-full hover:bg-accent/20 inline-flex" title="Copy FedEx link" data-unique-id="222723d4-7024-4e69-aded-89365263c82c" data-file-name="components/manual-email-modal.tsx">
                          <svg className="h-3 w-3 text-[#4D148C]" viewBox="0 0 24 24" fill="currentColor" data-unique-id="555124b7-bf24-4f88-9298-3408b4d1785b" data-file-name="components/manual-email-modal.tsx">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 5a3 3 0 11-3 3 3 3 0 013-3zm0 11.13c-2.03-.31-3.88-1.47-5.14-3.13h10.28c-1.26 1.66-3.11 2.82-5.14 3.13z" data-unique-id="d9c3bbee-cc41-41ed-b384-536bb98b5c54" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true" />
                          </svg>
                        </button>
                      </span>);
                        lastIndex = match.index + match[0].length;
                      }

                      // Add any remaining text
                      parts.push(line.substring(lastIndex));
                      return <div key={i} className="mb-3" data-unique-id="56e6e3f6-52d4-4c4b-b90a-f00998cc87e2" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{parts}</div>;
                    }
                    return <div key={i} className={line.trim() === "" ? "h-4" : "mb-3"} data-unique-id="94d9a074-bbf0-46fe-ad7a-7aa239a5bdd6" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{line}</div>;
                  })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t border-border flex items-center justify-between" data-unique-id="8155f679-e587-4dfb-a506-a8ef39ecfb0a" data-file-name="components/manual-email-modal.tsx">
              <button onClick={onOpenInEmailClient} className="flex items-center px-4 py-2.5 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="fc2a64fc-1878-40ef-ad14-55fd62f0afbe" data-file-name="components/manual-email-modal.tsx">
                <ExternalLink className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="00a7f8c1-0404-494b-b745-d37006a278e8" data-file-name="components/manual-email-modal.tsx">
                Open in Email Client
              </span></button>
              
              <button onClick={onMarkAsSent} disabled={isSent} className={`flex items-center px-5 py-2.5 rounded-md transition-colors ${isSent ? "bg-green-100 text-green-700 cursor-default dark:bg-green-900/30 dark:text-green-400" : "bg-primary text-primary-foreground hover:bg-primary/90"}`} data-unique-id="b999ea2d-3d3b-4032-b33e-f0671ba06233" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
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
      </AnimatePresence>
    </>;
}