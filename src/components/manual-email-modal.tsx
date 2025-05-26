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
      }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose} data-unique-id="3239c770-a84b-4b80-a445-2bf4c5d62c3f" data-file-name="components/manual-email-modal.tsx">
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
        }} className="bg-background w-full max-w-4xl rounded-lg shadow-xl overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="9e1d3216-4313-4731-b3da-f770d6ce38ea" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
            {/* Modal Header */}
            <div className="bg-primary text-primary-foreground p-6" data-unique-id="2ae47cbf-dd83-4507-9816-94f6d0c2a83a" data-file-name="components/manual-email-modal.tsx">
              <div className="flex justify-between items-center" data-unique-id="de73b303-df72-4397-bc07-e25bd0a955a5" data-file-name="components/manual-email-modal.tsx">
                <h3 className="text-xl font-medium flex items-center" data-unique-id="9bd45529-d8d0-454d-ad10-c392c7cff449" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="76511d4c-bfd1-42cd-ad8e-837dd1632f18" data-file-name="components/manual-email-modal.tsx">
                  Email Review & Manual Send
                </span></h3>
                <button onClick={onClose} className="text-primary-foreground opacity-70 hover:opacity-100 p-2 rounded-full hover:bg-primary-foreground/20 transition-colors" aria-label="Close modal" data-unique-id="b543ed54-4336-47fe-ad09-7c6abff9db32" data-file-name="components/manual-email-modal.tsx">
                  <X size={24} />
                </button>
              </div>
              
              <p className="text-primary-foreground/80 text-sm mt-1" data-unique-id="fc0aeef9-c32a-4b7b-8046-2e3d072ce333" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="4204220c-b73d-4dbb-8a89-9ae694a1c68a" data-file-name="components/manual-email-modal.tsx">
                Review email details, copy content to your email client, and mark as sent when complete.
              </span></p>
              
              <div className="flex items-center justify-between mt-6" data-unique-id="d694f319-5966-4696-980d-5484c2181320" data-file-name="components/manual-email-modal.tsx">
                <div data-unique-id="cdef3755-12a4-4912-9a3f-763bec3fa7b8" data-file-name="components/manual-email-modal.tsx">
                  <span className="text-sm text-primary-foreground/90" data-unique-id="e8ed8c41-7ea5-4fcb-b159-af42bc379922" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="2e229b7f-23e0-4e38-8d76-9fca78fea741" data-file-name="components/manual-email-modal.tsx">
                    Email </span>{currentEmailIndex + 1}<span className="editable-text" data-unique-id="73119773-f3d2-44bd-a3fb-814f1263ed08" data-file-name="components/manual-email-modal.tsx"> of </span>{totalEmails}<span className="editable-text" data-unique-id="8a6c7efe-63a8-4f7e-a733-e5cfd3ad0293" data-file-name="components/manual-email-modal.tsx"> (</span>{completionPercentage}<span className="editable-text" data-unique-id="8ff1fcec-8639-4bdc-85af-55c882e30211" data-file-name="components/manual-email-modal.tsx">% complete)
                  </span></span>
                </div>
                
                <div className="flex items-center space-x-2" data-unique-id="0e6e3d6b-690c-484d-8f8b-926a49cc3d7b" data-file-name="components/manual-email-modal.tsx">
                  <button onClick={onPrevious} disabled={currentEmailIndex === 0} className="p-1.5 rounded hover:bg-primary-foreground/10 disabled:opacity-40" data-unique-id="80cb794d-512b-444f-bee4-b7a0fc0771d2" data-file-name="components/manual-email-modal.tsx">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={onNext} disabled={currentEmailIndex === totalEmails - 1} className="p-1.5 rounded hover:bg-primary-foreground/10 disabled:opacity-40" data-unique-id="98e1e3f1-b786-45b6-b810-57400f3b98c3" data-file-name="components/manual-email-modal.tsx">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="w-full bg-primary-foreground/20 h-2 mt-3 rounded-full" data-unique-id="e0187107-a652-4078-b554-19f8f2177c71" data-file-name="components/manual-email-modal.tsx">
                <div className="bg-primary-foreground h-2 rounded-full transition-all duration-300" style={{
                width: `${completionPercentage}%`
              }} data-unique-id="923b5c05-c246-4af1-a1f4-184081d4c33f" data-file-name="components/manual-email-modal.tsx"></div>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6" data-unique-id="230728f2-97b0-4c85-81b0-8a13957bb067" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
              {/* Recipient information */}
              <div className="bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="6e68f612-ad8f-4475-a704-b9df0a129da5" data-file-name="components/manual-email-modal.tsx">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="492963c8-3af2-42d5-ab19-667b292b784e" data-file-name="components/manual-email-modal.tsx">
                  <div data-unique-id="77d4e706-8f8d-4a93-874c-b7d30ed3d78e" data-file-name="components/manual-email-modal.tsx">
                    <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="f0076af9-4ecb-4746-a841-c7cc6757c217" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="59d12915-a867-449e-8069-0bee4f81a425" data-file-name="components/manual-email-modal.tsx">To:</span></div>
                    <div className="flex items-center justify-between" data-unique-id="c81d64ba-8168-41d4-bd08-a628a34fb1e1" data-file-name="components/manual-email-modal.tsx">
                      <div className="text-base" data-unique-id="28b7d5a7-ffee-46b8-a0e1-a7fe8dc52edc" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.to}</div>
                      <button onClick={() => handleCopy(currentEmail.to || '', 'recipient')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy recipient" data-unique-id="02c9b09a-be87-464f-8550-bbf9c7e4886b" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                        {copySuccess === 'recipient' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div data-unique-id="fbe01a28-976f-4e1e-9123-94e3733df73f" data-file-name="components/manual-email-modal.tsx">
                    <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="b528e87e-46b2-4ba3-8f8d-961b8791d6dc" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="cb0472db-2d58-412d-90c6-9972c350accf" data-file-name="components/manual-email-modal.tsx">From:</span></div>
                    <div className="flex items-center justify-between" data-unique-id="4f89dcb3-b70c-4f64-8f01-141e04ede197" data-file-name="components/manual-email-modal.tsx">
                      <div className="text-base" data-unique-id="38583315-462f-4c5c-98c9-d40b69f230c0" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.from}</div>
                      <button onClick={() => handleCopy(currentEmail.from || '', 'sender')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy sender" data-unique-id="379904b8-5c9d-419d-91d8-ddd76a53dae9" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                        {copySuccess === 'sender' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Template selector */}
              {availableTemplates.length > 0 && <div className="bg-card p-4 rounded-lg shadow-sm border border-border mb-4" data-unique-id="8a392e3d-b0be-445e-9a38-32875a38b26b" data-file-name="components/manual-email-modal.tsx">
                  <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="83cf6b00-56d1-4bc8-90a0-fc0d4da2b580" data-file-name="components/manual-email-modal.tsx">
                    <span className="editable-text" data-unique-id="588363d7-dfcc-4433-a00d-7c9c1c5f57fb" data-file-name="components/manual-email-modal.tsx">Email Template:</span>
                  </div>
                  <div className="relative" data-unique-id="e41bb49b-afaf-456b-ba44-67207ed435b6" data-file-name="components/manual-email-modal.tsx">
                    <select value={currentTemplateId || ''} onChange={e => onSelectTemplate?.(e.target.value)} className="w-full p-2 pr-8 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background" disabled={isSent} data-unique-id="8936d9de-ddb6-49b0-a751-9472bc324f95" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                      {availableTemplates.map(template => <option key={template.id} value={template.id} data-unique-id="5a08d35d-9d47-4412-9682-97415855c68a" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{template.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
                  </div>
                </div>}
              
              {/* Subject line */}
              <div className="bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="e1f0972f-5d46-4406-a28e-2a2ba9057f98" data-file-name="components/manual-email-modal.tsx">
                <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="244aa95e-ea6c-4c34-8b62-2cd476383fca" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="dd0097bb-ebc5-41c9-89d2-a061e109180a" data-file-name="components/manual-email-modal.tsx">Subject:</span></div>
                <div className="flex items-center justify-between" data-unique-id="a49457cc-6867-4230-9596-71d7a2c558e7" data-file-name="components/manual-email-modal.tsx">
                  <div className="text-base font-medium" data-unique-id="77a70b4a-a4b2-4271-9c60-ed7afcfb86f9" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.subject}</div>
                  <button onClick={() => handleCopy(currentEmail.subject || '', 'subject')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy subject" data-unique-id="8c1dbbbf-56a1-4aee-a26e-5a49fee8e14d" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                    {copySuccess === 'subject' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              {/* Email content */}
              <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="bcfa3a0a-efb3-4ad3-9c9c-ae7a9bf1f823" data-file-name="components/manual-email-modal.tsx">
                <div className="flex items-center justify-between mb-3" data-unique-id="6a6dfda4-3a70-4ca9-9c41-6a6581177025" data-file-name="components/manual-email-modal.tsx">
                  <div className="text-xs font-medium uppercase text-muted-foreground" data-unique-id="f819b3bc-cf90-49c1-805e-1ce16f25f981" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="6d8d879a-4909-42f6-96ce-600991be856a" data-file-name="components/manual-email-modal.tsx">Email Content:</span></div>
                  <div className="flex items-center space-x-2" data-unique-id="2d735865-6d5f-4e84-82e4-69336daeed4e" data-file-name="components/manual-email-modal.tsx">
                    <button onClick={() => handleCopy(currentEmail.content || '', 'content')} className="flex items-center text-xs text-primary p-1.5 px-2.5 rounded hover:bg-accent/20" title="Copy plain text content" data-unique-id="cbe91bb4-61ae-4119-9064-4296f5f6ca0d" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                      {copySuccess === 'content' ? <><Check className="h-3 w-3 mr-1.5" />Copied!</> : <><Copy className="h-3 w-3 mr-1.5" />Copy Text</>}
                    </button>
                    
                    <button onClick={() => handleCopy(currentEmail.html || '', 'html')} className="flex items-center text-xs text-primary p-1.5 px-2.5 rounded hover:bg-accent/20" title="Copy HTML content" data-unique-id="05a0f825-a72b-44a1-98da-c1d7c0590b88" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                      {copySuccess === 'html' ? <><Check className="h-3 w-3 mr-1.5" />Copied!</> : <><Copy className="h-3 w-3 mr-1.5" />Copy HTML</>}
                    </button>
                  </div>
                </div>
                
                <div className="border border-border rounded-lg p-5 max-h-80 overflow-y-auto bg-accent/5 dark:bg-card/60" data-unique-id="57c71763-6ff0-4fb8-9028-24a16e6b119f" data-file-name="components/manual-email-modal.tsx">
                  <div className="whitespace-pre-wrap text-base" data-unique-id="bb802d98-d3e2-40d9-a0cc-6d8a9391c89a" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
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
                        parts.push(<span key={`${i}-${match.index}`} className="inline-flex items-center" data-unique-id="25634ccb-7092-4479-80dc-328e949ca5c8" data-file-name="components/manual-email-modal.tsx">
                        <a href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNum}`} target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium" data-unique-id="f3b9ce95-bda9-46d4-b232-8820e0b87f5e" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
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
                          }} className="ml-1 p-0.5 rounded-full hover:bg-accent/20 inline-flex" title="Copy tracking number" data-unique-id="6fbb83ca-6339-4d1a-9896-1ee33ed2c77c" data-file-name="components/manual-email-modal.tsx">
                          <Copy className="h-3 w-3 text-primary" data-unique-id="3d817206-bbee-48d5-9eb4-f56cef167849" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true" />
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
                          }} className="ml-1 p-0.5 rounded-full hover:bg-accent/20 inline-flex" title="Copy FedEx link" data-unique-id="5cac2e0e-7761-47b1-a557-d82b41af7f23" data-file-name="components/manual-email-modal.tsx">
                          <svg className="h-3 w-3 text-[#4D148C]" viewBox="0 0 24 24" fill="currentColor" data-unique-id="1f9c3e0c-58bc-4ed2-a945-8e58e29996c6" data-file-name="components/manual-email-modal.tsx">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 5a3 3 0 11-3 3 3 3 0 013-3zm0 11.13c-2.03-.31-3.88-1.47-5.14-3.13h10.28c-1.26 1.66-3.11 2.82-5.14 3.13z" data-unique-id="5d63c20f-51ab-4483-837f-50e89c8b92bc" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true" />
                          </svg>
                        </button>
                      </span>);
                        lastIndex = match.index + match[0].length;
                      }

                      // Add any remaining text
                      parts.push(line.substring(lastIndex));
                      return <div key={i} className="mb-3" data-unique-id="00d007bf-8350-4ffb-8388-f3e8391163be" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{parts}</div>;
                    }
                    return <div key={i} className={line.trim() === "" ? "h-4" : "mb-3"} data-unique-id="3963891a-3c0f-4450-bb23-47394704c77e" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{line}</div>;
                  })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t border-border flex items-center justify-between" data-unique-id="e31f246d-d174-4452-8552-3f3f831a5dd5" data-file-name="components/manual-email-modal.tsx">
              <button onClick={onOpenInEmailClient} className="flex items-center px-4 py-2.5 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="991bc9d1-92ed-4cb5-a2a2-193847e2b73e" data-file-name="components/manual-email-modal.tsx">
                <ExternalLink className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="9649df12-fb58-4073-b5a3-0b1f30023000" data-file-name="components/manual-email-modal.tsx">
                Open in Email Client
              </span></button>
              
              <button onClick={onMarkAsSent} disabled={isSent} className={`flex items-center px-5 py-2.5 rounded-md transition-colors ${isSent ? "bg-green-100 text-green-700 cursor-default dark:bg-green-900/30 dark:text-green-400" : "bg-primary text-primary-foreground hover:bg-primary/90"}`} data-unique-id="0cb04f68-aa23-439c-a486-d2dc9206ec5d" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
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