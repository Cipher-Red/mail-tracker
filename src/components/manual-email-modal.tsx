'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, ExternalLink, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
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
  availableTemplates?: Array<{
    id: string;
    name: string;
  }>;
  onSelectTemplate?: (templateId: string) => void;
  currentTemplateId?: string;
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
  isSent,
  availableTemplates = [],
  onSelectTemplate,
  currentTemplateId
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
      }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose} data-unique-id="a2b7a0b6-caa1-4b38-9e8a-8550adbce053" data-file-name="components/manual-email-modal.tsx">
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
        }} className="bg-background w-full max-w-4xl rounded-lg shadow-xl overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="d9dbd97a-e25b-4ee9-ac00-771dfdeb106e" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
            {/* Modal Header */}
            <div className="bg-primary text-primary-foreground p-6" data-unique-id="a10e62b1-3e73-4bd9-a143-7636c805d4b3" data-file-name="components/manual-email-modal.tsx">
              <div className="flex justify-between items-center" data-unique-id="e688bf1a-c4df-4eec-b7d6-ceebf58acc28" data-file-name="components/manual-email-modal.tsx">
                <h3 className="text-xl font-medium flex items-center" data-unique-id="00358c58-3325-4d60-80de-0f5ce9240066" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="c6650ff6-efd8-4125-a899-5f46aaced293" data-file-name="components/manual-email-modal.tsx">
                  Email Review & Manual Send
                </span></h3>
                <button onClick={onClose} className="text-primary-foreground opacity-70 hover:opacity-100 p-2 rounded-full hover:bg-primary-foreground/20 transition-colors" aria-label="Close modal" data-unique-id="04fa75ae-532a-4977-b957-2ba9b1b522ff" data-file-name="components/manual-email-modal.tsx">
                  <X size={24} />
                </button>
              </div>
              
              <p className="text-primary-foreground/80 text-sm mt-1" data-unique-id="b5cb2268-a37e-4db4-a864-b28af73886c4" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="8f4bf712-a0a6-43ce-9f7b-3084dd42823f" data-file-name="components/manual-email-modal.tsx">
                Review email details, copy content to your email client, and mark as sent when complete.
              </span></p>
              
              <div className="flex items-center justify-between mt-6" data-unique-id="27456f26-e05a-4977-a48e-112f40e9da72" data-file-name="components/manual-email-modal.tsx">
                <div data-unique-id="83852ebc-c9ae-465f-8d7a-1743dc0aae6c" data-file-name="components/manual-email-modal.tsx">
                  <span className="text-sm text-primary-foreground/90" data-unique-id="e20d2e88-1b06-4a20-96aa-68fb21303cfd" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="8224d108-d48d-40f6-ab9c-0941344f8aaa" data-file-name="components/manual-email-modal.tsx">
                    Email </span>{currentEmailIndex + 1}<span className="editable-text" data-unique-id="a25b43c6-fddb-48ab-8342-18dabb68e393" data-file-name="components/manual-email-modal.tsx"> of </span>{totalEmails}<span className="editable-text" data-unique-id="a123c365-67a2-4ab8-956d-d08c2e4c89c6" data-file-name="components/manual-email-modal.tsx"> (</span>{completionPercentage}<span className="editable-text" data-unique-id="e724eb3c-c9f5-4f35-b237-7fd449b68d27" data-file-name="components/manual-email-modal.tsx">% complete)
                  </span></span>
                </div>
                
                <div className="flex items-center space-x-2" data-unique-id="ba2f7ff8-4e57-4182-8b46-b0c02d2cde67" data-file-name="components/manual-email-modal.tsx">
                  <button onClick={onPrevious} disabled={currentEmailIndex === 0} className="p-1.5 rounded hover:bg-primary-foreground/10 disabled:opacity-40" data-unique-id="b0b56783-d09b-49e2-bc5d-d7aa4e91d7a2" data-file-name="components/manual-email-modal.tsx">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={onNext} disabled={currentEmailIndex === totalEmails - 1} className="p-1.5 rounded hover:bg-primary-foreground/10 disabled:opacity-40" data-unique-id="c478bb09-3d6c-44f6-835f-ece35d1e85af" data-file-name="components/manual-email-modal.tsx">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="w-full bg-primary-foreground/20 h-2 mt-3 rounded-full" data-unique-id="575dd941-5f40-46c6-b72f-333c0d1b4ffd" data-file-name="components/manual-email-modal.tsx">
                <div className="bg-primary-foreground h-2 rounded-full transition-all duration-300" style={{
                width: `${completionPercentage}%`
              }} data-unique-id="eab7c3c0-9cdc-4a5f-8d7e-28002ea03748" data-file-name="components/manual-email-modal.tsx"></div>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6" data-unique-id="098d68f6-6c37-40b6-910d-24d26660f77c" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
              {/* Recipient information */}
              <div className="bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="16eb974b-5bf4-419b-8876-c396ff9424f2" data-file-name="components/manual-email-modal.tsx">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="507b82e8-32a3-496c-8e52-ec3b89eeac3b" data-file-name="components/manual-email-modal.tsx">
                  <div data-unique-id="f5cf7e02-fa97-44d9-8488-05bd73f67ef2" data-file-name="components/manual-email-modal.tsx">
                    <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="68d895ab-059b-4f54-97a9-147d35f1f701" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="aa598cdf-51c1-493f-b984-b04f34b4ed90" data-file-name="components/manual-email-modal.tsx">To:</span></div>
                    <div className="flex items-center justify-between" data-unique-id="1d2632cc-e4de-4487-9320-77915e7a2175" data-file-name="components/manual-email-modal.tsx">
                      <div className="text-base" data-unique-id="f876a57d-e3f5-4d86-bed0-6f630496dfe0" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.to}</div>
                      <button onClick={() => handleCopy(currentEmail.to || '', 'recipient')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy recipient" data-unique-id="7bc37104-e0fb-4638-bf67-7840bbcf5862" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                        {copySuccess === 'recipient' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div data-unique-id="05de247d-db2a-442a-9dcd-5e330d2073d9" data-file-name="components/manual-email-modal.tsx">
                    <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="96209a82-d641-4fca-a025-639fe7c21964" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="9805763f-fbc9-42b8-a564-77c676aaf5f5" data-file-name="components/manual-email-modal.tsx">From:</span></div>
                    <div className="flex items-center justify-between" data-unique-id="fd65b6bc-2a79-4420-9a4c-56241d5a1d07" data-file-name="components/manual-email-modal.tsx">
                      <div className="text-base" data-unique-id="c740379c-087b-47ec-af3f-fbcc5029c7ca" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.from}</div>
                      <button onClick={() => handleCopy(currentEmail.from || '', 'sender')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy sender" data-unique-id="ae95e9b7-b00f-4625-b84f-a3e7332fcea9" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                        {copySuccess === 'sender' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Template selector */}
              {availableTemplates.length > 0 && <div className="bg-card p-4 rounded-lg shadow-sm border border-border mb-4" data-unique-id="6631d933-5208-4a51-854a-fdf872e1c031" data-file-name="components/manual-email-modal.tsx">
                  <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="6b9bd700-928f-495d-b0a9-fe314898dbd7" data-file-name="components/manual-email-modal.tsx">
                    <span className="editable-text" data-unique-id="9b349047-bdc4-4bf6-9a97-79b274545aea" data-file-name="components/manual-email-modal.tsx">Email Template:</span>
                  </div>
                  <div className="relative" data-unique-id="d0d36fc8-035f-46a9-84b4-f50d4f6ad200" data-file-name="components/manual-email-modal.tsx">
                    <select value={currentTemplateId || ''} onChange={e => onSelectTemplate?.(e.target.value)} className="w-full p-2 pr-8 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background" disabled={isSent} data-unique-id="99db857c-06d9-4cfd-ab6f-e3546347eea6" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                      {availableTemplates.map(template => <option key={template.id} value={template.id} data-unique-id="4411e78a-a466-42b3-a537-640e9ff2c947" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{template.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
                  </div>
                </div>}
              
              {/* Subject line */}
              <div className="bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="b1e1d04a-c462-42b0-a199-ca731d7d748e" data-file-name="components/manual-email-modal.tsx">
                <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="8faa07fe-11ba-4080-b0ab-2bee9fac1724" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="606ed07e-e097-4518-8329-8628fe6fd1b2" data-file-name="components/manual-email-modal.tsx">Subject:</span></div>
                <div className="flex items-center justify-between" data-unique-id="9f05fe55-49b1-4dfe-a41f-deba87985faf" data-file-name="components/manual-email-modal.tsx">
                  <div className="text-base font-medium" data-unique-id="7081d202-524c-4e1c-9d7b-b4f08bac8b69" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.subject}</div>
                  <button onClick={() => handleCopy(currentEmail.subject || '', 'subject')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy subject" data-unique-id="b0ba1db5-c358-4016-a477-973c6f78715b" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                    {copySuccess === 'subject' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              {/* Email content */}
              <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="877cf0fa-ea66-4642-a867-1a0212eba2d8" data-file-name="components/manual-email-modal.tsx">
                <div className="flex items-center justify-between mb-3" data-unique-id="7a173910-d5d5-40d3-ac25-15ec3870f214" data-file-name="components/manual-email-modal.tsx">
                  <div className="text-xs font-medium uppercase text-muted-foreground" data-unique-id="88d6398a-905b-4b0a-9021-656176650d48" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="b72b75db-7a99-4981-af6f-bbe91bdd9464" data-file-name="components/manual-email-modal.tsx">Email Content:</span></div>
                  <div className="flex items-center space-x-2" data-unique-id="d9e2bdb5-4404-4059-8bc2-b4214059cb65" data-file-name="components/manual-email-modal.tsx">
                    <button onClick={() => handleCopy(currentEmail.content || '', 'content')} className="flex items-center text-xs text-primary p-1.5 px-2.5 rounded hover:bg-accent/20" title="Copy plain text content" data-unique-id="646b996a-dc60-45c1-9a96-a7c5dcd9a733" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                      {copySuccess === 'content' ? <><Check className="h-3 w-3 mr-1.5" />Copied!</> : <><Copy className="h-3 w-3 mr-1.5" />Copy Text</>}
                    </button>
                    
                    <button onClick={() => handleCopy(currentEmail.html || '', 'html')} className="flex items-center text-xs text-primary p-1.5 px-2.5 rounded hover:bg-accent/20" title="Copy HTML content" data-unique-id="e97018fd-4c5c-453c-b47a-16a135e01804" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                      {copySuccess === 'html' ? <><Check className="h-3 w-3 mr-1.5" />Copied!</> : <><Copy className="h-3 w-3 mr-1.5" />Copy HTML</>}
                    </button>
                  </div>
                </div>
                
                <div className="border border-border rounded-lg p-5 max-h-80 overflow-y-auto bg-accent/5 dark:bg-card/60" data-unique-id="6ef98873-6ec5-4b6f-93d4-98348dd01766" data-file-name="components/manual-email-modal.tsx">
                  <div className="whitespace-pre-wrap text-base" data-unique-id="399c3f62-4f1e-452c-827a-92487a4bf72d" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
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
                        parts.push(<span key={`${i}-${match.index}`} className="inline-flex items-center" data-unique-id="d6e04917-f59e-4beb-91ba-98f4b5664a04" data-file-name="components/manual-email-modal.tsx">
                        <a href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNum}`} target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium" data-unique-id="ed526aa6-7481-485b-b14b-8483e1bfded8" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
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
                          }} className="ml-1 p-0.5 rounded-full hover:bg-accent/20 inline-flex" title="Copy tracking number" data-unique-id="d840af27-5fcf-47af-9c08-7acd4aca70df" data-file-name="components/manual-email-modal.tsx">
                          <Copy className="h-3 w-3 text-primary" data-unique-id="2c6f75ef-436f-4de9-8b9f-8e0ae937e246" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true" />
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
                          }} className="ml-1 p-0.5 rounded-full hover:bg-accent/20 inline-flex" title="Copy FedEx link" data-unique-id="d5a2c19b-2260-4908-96b6-9c177631d140" data-file-name="components/manual-email-modal.tsx">
                          <svg className="h-3 w-3 text-[#4D148C]" viewBox="0 0 24 24" fill="currentColor" data-unique-id="5ef65138-b039-46ce-9677-dcd5a3e6b935" data-file-name="components/manual-email-modal.tsx">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 5a3 3 0 11-3 3 3 3 0 013-3zm0 11.13c-2.03-.31-3.88-1.47-5.14-3.13h10.28c-1.26 1.66-3.11 2.82-5.14 3.13z" data-unique-id="7d4b9f77-d971-45cb-bcc2-230fc5368d7e" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true" />
                          </svg>
                        </button>
                      </span>);
                        lastIndex = match.index + match[0].length;
                      }

                      // Add any remaining text
                      parts.push(line.substring(lastIndex));
                      return <div key={i} className="mb-3" data-unique-id="538a8dff-7810-45a8-9a41-97b83414584c" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{parts}</div>;
                    }
                    // Make survey link clickable
                    else if (line.includes('https://feed-back-dax.netlify.app')) {
                      return <div key={i} className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/30 rounded border border-blue-200 dark:border-blue-800" data-unique-id="62d3edd7-69bf-4017-9252-fa256b40564a" data-file-name="components/manual-email-modal.tsx">
                        <div className="font-medium mb-1 text-blue-700 dark:text-blue-300" data-unique-id="bca7ce6f-d29b-4228-83fa-462fc807fddb" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="54ca54f1-f19a-4345-b1a7-376473d8288e" data-file-name="components/manual-email-modal.tsx">Customer Feedback Survey</span></div>
                        <div data-unique-id="9a408fd0-b1b3-4b14-82c6-99185b926da7" data-file-name="components/manual-email-modal.tsx">
                          <a href="https://feed-back-dax.netlify.app" target="_blank" rel="noopener noreferrer" className="text-primary underline flex items-center" data-unique-id="40a4dc26-db16-45bb-96da-70e020b52509" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                            {line}
                            <ExternalLink className="h-3.5 w-3.5 ml-1" data-unique-id="0bab95c7-dcf2-4360-aae9-473b883e497e" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true" />
                          </a>
                        </div>
                      </div>;
                    }
                    return <div key={i} className={line.trim() === "" ? "h-4" : "mb-3"} data-unique-id="fdc6c321-ffb8-455c-818a-17f68f8150c3" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{line}</div>;
                  })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t border-border flex items-center justify-between" data-unique-id="6faf49e5-1a2a-421c-80a9-22fa03b44529" data-file-name="components/manual-email-modal.tsx">
              <button onClick={onOpenInEmailClient} className="flex items-center px-4 py-2.5 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="3ccce48f-cda7-487d-b308-f69b3d343912" data-file-name="components/manual-email-modal.tsx">
                <ExternalLink className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="48769372-be32-4c70-abed-b532c3e26c18" data-file-name="components/manual-email-modal.tsx">
                Open in Email Client
              </span></button>
              
              <button onClick={onMarkAsSent} disabled={isSent} className={`flex items-center px-5 py-2.5 rounded-md transition-colors ${isSent ? "bg-green-100 text-green-700 cursor-default dark:bg-green-900/30 dark:text-green-400" : "bg-primary text-primary-foreground hover:bg-primary/90"}`} data-unique-id="5deac2dc-1a65-438c-96af-d1c286a9fca1" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
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