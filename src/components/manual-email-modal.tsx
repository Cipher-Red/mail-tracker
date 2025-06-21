'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, ExternalLink, ChevronLeft, ChevronRight, ChevronDown, Truck, AlertCircle } from 'lucide-react';
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
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [trackingError, setTrackingError] = useState<string | null>(null);
  const [isTrackingValid, setIsTrackingValid] = useState<boolean>(true);
  const handleCopy = (text: string, type: string) => {
    copy(text);
    setCopySuccess(type);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  // Initialize tracking number from current email
  useEffect(() => {
    if (currentEmail?.customer) {
      setTrackingNumber(currentEmail.customer.trackingNumber || '');
      setTrackingError(null);
      setIsTrackingValid(true);
    }
  }, [currentEmail]);

  // Validate tracking number
  const validateTrackingNumber = (value: string): boolean => {
    if (!value.trim()) {
      setTrackingError('Tracking number is required');
      return false;
    }

    // Check for valid tracking number format (alphanumeric, 8-30 characters)
    const trackingRegex = /^[A-Z0-9]{8,30}$/i;
    if (!trackingRegex.test(value.trim())) {
      setTrackingError('Tracking number must be 8-30 alphanumeric characters');
      return false;
    }
    setTrackingError(null);
    return true;
  };

  // Handle tracking number change
  const handleTrackingNumberChange = (value: string) => {
    setTrackingNumber(value);
    const isValid = validateTrackingNumber(value);
    setIsTrackingValid(isValid);
    if (isValid && currentEmail) {
      // Update the email content with new tracking number
      currentEmail.customer.trackingNumber = value.trim();
      // Regenerate email content would happen in parent component
      toast.success('Tracking number updated');
    }
  };

  // Handle tracking number blur for final validation
  const handleTrackingBlur = () => {
    if (trackingNumber.trim()) {
      validateTrackingNumber(trackingNumber);
    }
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
      }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose} data-unique-id="dfd86735-3a19-4cf5-b180-04e7ea51611c" data-file-name="components/manual-email-modal.tsx">
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
        }} className="bg-background w-full max-w-4xl rounded-lg shadow-xl overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="68aa6e26-9b9f-49b3-bcec-10e6bd2f9e58" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
            {/* Modal Header */}
            <div className="bg-primary text-primary-foreground p-6" data-unique-id="c5855fc7-a890-458b-ac98-6a90cce79c27" data-file-name="components/manual-email-modal.tsx">
              <div className="flex justify-between items-center" data-unique-id="590abb94-3bc2-483c-a9f0-d9d7bb696101" data-file-name="components/manual-email-modal.tsx">
                <h3 className="text-xl font-medium flex items-center" data-unique-id="12686f37-f6f2-4585-af0f-a4d31c215b9c" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="01e04477-e70a-4290-bf41-d5336e5ab22d" data-file-name="components/manual-email-modal.tsx">
                  Email Review & Manual Send
                </span></h3>
                <button onClick={onClose} className="text-primary-foreground opacity-70 hover:opacity-100 p-2 rounded-full hover:bg-primary-foreground/20 transition-colors" aria-label="Close modal" data-unique-id="798d1a56-23dc-4fa2-90bf-d0124d9b12db" data-file-name="components/manual-email-modal.tsx">
                  <X size={24} />
                </button>
              </div>
              
              <p className="text-primary-foreground/80 text-sm mt-1" data-unique-id="1dfd023f-4a46-4c97-a07b-fdf054a37816" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="cfec20c5-e21e-4eba-a775-d52ad5ae921e" data-file-name="components/manual-email-modal.tsx">
                Review email details, copy content to your email client, and mark as sent when complete.
              </span></p>
              
              <div className="flex items-center justify-between mt-6" data-unique-id="b8e397ef-9df5-48c7-bc2a-beca1e994d2e" data-file-name="components/manual-email-modal.tsx">
                <div data-unique-id="d049e97e-9684-484e-a45a-50805af09029" data-file-name="components/manual-email-modal.tsx">
                  <span className="text-sm text-primary-foreground/90" data-unique-id="5c2a543d-487c-4098-869a-c0e3f19f03f2" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="936c9576-5b17-4abf-b0fc-420d9d1b411b" data-file-name="components/manual-email-modal.tsx">
                    Email </span>{currentEmailIndex + 1}<span className="editable-text" data-unique-id="f0bf0cde-7737-441a-b821-a65d3927ef26" data-file-name="components/manual-email-modal.tsx"> of </span>{totalEmails}<span className="editable-text" data-unique-id="72f0dc02-dc06-455c-9ba2-1070258e8be6" data-file-name="components/manual-email-modal.tsx"> (</span>{completionPercentage}<span className="editable-text" data-unique-id="ed512077-bc03-43dc-b261-2f6b81452bbc" data-file-name="components/manual-email-modal.tsx">% complete)
                  </span></span>
                </div>
                
                <div className="flex items-center space-x-2" data-unique-id="ed8fbf6e-85c2-41c0-ab43-4630ff2f385f" data-file-name="components/manual-email-modal.tsx">
                  <button onClick={onPrevious} disabled={currentEmailIndex === 0} className="p-1.5 rounded hover:bg-primary-foreground/10 disabled:opacity-40" data-unique-id="4f5542e9-6e45-43d3-bedf-8d5d36ce1365" data-file-name="components/manual-email-modal.tsx">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={onNext} disabled={currentEmailIndex === totalEmails - 1} className="p-1.5 rounded hover:bg-primary-foreground/10 disabled:opacity-40" data-unique-id="e5644fe4-0880-450c-98a2-7f0ba8a58c2f" data-file-name="components/manual-email-modal.tsx">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="w-full bg-primary-foreground/20 h-2 mt-3 rounded-full" data-unique-id="69fa0ecb-f4bc-47e0-a44e-f562f2985036" data-file-name="components/manual-email-modal.tsx">
                <div className="bg-primary-foreground h-2 rounded-full transition-all duration-300" style={{
                width: `${completionPercentage}%`
              }} data-unique-id="69e1e7ec-87de-4f43-8128-c4a740221139" data-file-name="components/manual-email-modal.tsx"></div>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6" data-unique-id="05c65aea-a066-4ccb-bdf3-6f31258a483f" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
              {/* Recipient information */}
              <div className="bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="e5e35123-1989-427e-be7a-a630ffd687e7" data-file-name="components/manual-email-modal.tsx">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="9af822a4-f33d-43cf-8e29-04aea640dab3" data-file-name="components/manual-email-modal.tsx">
                  <div data-unique-id="a7d36c98-2313-4fea-a506-b0fcb99c5e40" data-file-name="components/manual-email-modal.tsx">
                    <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="dca38ef3-425b-4a94-805a-6bd359467ef4" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="ed3642bd-ac21-4635-98e4-eb5a7a839d40" data-file-name="components/manual-email-modal.tsx">To:</span></div>
                    <div className="flex items-center justify-between" data-unique-id="1ac140ac-9dab-4cd1-b6b0-0ef89a9a372e" data-file-name="components/manual-email-modal.tsx">
                      <div className="text-base" data-unique-id="c8f8af3e-d933-46f3-b4f9-cec5ae4d5192" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.to}</div>
                      <button onClick={() => handleCopy(currentEmail.to || '', 'recipient')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy recipient" data-unique-id="9b1e3ac5-5e43-4ae3-9fe1-33f61068361f" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                        {copySuccess === 'recipient' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div data-unique-id="8888a188-3b38-4d5b-b417-8bef968f06ac" data-file-name="components/manual-email-modal.tsx">
                    <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="0cd9ead8-cea3-49c0-ad02-81cb1a9ecafa" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="489c8193-2d49-4e3b-b464-02fd26993e91" data-file-name="components/manual-email-modal.tsx">From:</span></div>
                    <div className="flex items-center justify-between" data-unique-id="43a51ff5-77cc-48e3-8b3c-bcb9ee239631" data-file-name="components/manual-email-modal.tsx">
                      <div className="text-base" data-unique-id="9f561908-4892-4dd5-9e6f-8fb6a975928b" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.from}</div>
                      <button onClick={() => handleCopy(currentEmail.from || '', 'sender')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy sender" data-unique-id="3441f037-06ff-43a7-809b-0648e9705da4" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                        {copySuccess === 'sender' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Template selector */}
              {availableTemplates.length > 0 && <div className="bg-card p-4 rounded-lg shadow-sm border border-border mb-4" data-unique-id="73018f63-6ef8-40dd-b878-d7466c4b7597" data-file-name="components/manual-email-modal.tsx">
                  <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="d79ef5ca-6593-4eb6-ae63-4a25529705f1" data-file-name="components/manual-email-modal.tsx">
                    <span className="editable-text" data-unique-id="720e2e34-3b4f-4ae0-8373-c1846980da8f" data-file-name="components/manual-email-modal.tsx">Email Template:</span>
                  </div>
                  <div className="relative" data-unique-id="97a0832c-63dd-419a-aa93-5ef7f8f958f0" data-file-name="components/manual-email-modal.tsx">
                    <select value={currentTemplateId || ''} onChange={e => onSelectTemplate?.(e.target.value)} className="w-full p-2 pr-8 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background" disabled={isSent} data-unique-id="9eb72e46-cac0-4cbb-b88f-ffe9953e20c0" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                      {availableTemplates.map(template => <option key={template.id} value={template.id} data-unique-id="fa7449a4-acf5-4d36-9bbb-0292b1f6a3a3" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{template.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
                  </div>
                </div>}
              
              {/* Subject line */}
              <div className="bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="a37e4380-8ba2-4675-8a49-b0f0af958da5" data-file-name="components/manual-email-modal.tsx">
                <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="e71b4c82-c8e8-49c4-996f-28e70d2ec8e3" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="0f473fea-46b4-4486-bf27-3dfcf83f3f1c" data-file-name="components/manual-email-modal.tsx">Subject:</span></div>
                <div className="flex items-center justify-between" data-unique-id="ca204340-e09f-45b5-a756-d9d41d5f4078" data-file-name="components/manual-email-modal.tsx">
                  <div className="text-base font-medium" data-unique-id="2f74bacb-7cae-46bd-b266-28673c203aee" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.subject}</div>
                  <button onClick={() => handleCopy(currentEmail.subject || '', 'subject')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy subject" data-unique-id="330e37d1-6714-4ada-97f8-6c3b80f73110" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                    {copySuccess === 'subject' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Tracking Numbers */}
              {currentEmail.customer?.trackingNumber && <div className="bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="cfad2668-fd6e-464d-84db-1e2526965b37" data-file-name="components/manual-email-modal.tsx">
                  <div className="flex items-center justify-between mb-3" data-unique-id="6ddf3eb9-eedf-4e40-9c2e-a57a0b752af0" data-file-name="components/manual-email-modal.tsx">
                    <div className="text-xs font-medium uppercase text-muted-foreground flex items-center" data-unique-id="080a4e74-aca6-4c1f-ac93-7178fcbe8f17" data-file-name="components/manual-email-modal.tsx">
                      <Truck className="h-4 w-4 mr-1" />
                      <span className="editable-text" data-unique-id="3c10b782-8962-4d22-a3d2-9acca56a415b" data-file-name="components/manual-email-modal.tsx">Tracking Numbers:</span>
                    </div>
                  </div>
                  <div className="space-y-2" data-unique-id="a3dd029e-5ec4-46df-8a8d-da00f050bc70" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                    {(() => {
                  const trackingNumbers = Array.isArray(currentEmail.customer.trackingNumber) ? currentEmail.customer.trackingNumber : [currentEmail.customer.trackingNumber].filter(Boolean);
                  return trackingNumbers.map((trackingNum: string, index: number) => <div key={index} className="flex items-center justify-between p-3 bg-accent/10 rounded-md border border-border/50" data-unique-id="373a467f-4fc9-4c56-9bc0-82ddd33f1b40" data-file-name="components/manual-email-modal.tsx">
                          <div className="flex items-center space-x-3" data-unique-id="a31643ce-6a39-46a9-8bad-750f365e040e" data-file-name="components/manual-email-modal.tsx">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center" data-unique-id="330230a2-5c36-4ee0-938d-6bb4cdb73a02" data-file-name="components/manual-email-modal.tsx">
                              <Truck className="h-4 w-4 text-primary" data-unique-id="8e9990da-b0eb-43f0-898f-aab6fae9966d" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true" />
                            </div>
                            <div data-unique-id="e573a84e-332d-43df-99f3-33ecf9c38c10" data-file-name="components/manual-email-modal.tsx">
                              <div className="font-medium text-sm" data-unique-id="6d5d1016-e0fc-465c-bf1d-c77128bce854" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{trackingNum}</div>
                              <div className="text-xs text-muted-foreground" data-unique-id="a86d78f1-d0c6-4d08-93ad-4e9b5d450b00" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="81407665-38e8-4f59-88de-41fc97fc8355" data-file-name="components/manual-email-modal.tsx">FedEx Tracking</span></div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2" data-unique-id="77a1e549-650e-4dfa-b601-8d2957f93919" data-file-name="components/manual-email-modal.tsx">
                            <button onClick={e => {
                        e.stopPropagation();
                        try {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(trackingNum).then(() => {
                              toast.success('Tracking number copied!', {
                                duration: 2000
                              });
                            }).catch(err => {
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
                        function fallbackCopy(text: string) {
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
                      }} className="p-2 rounded-full hover:bg-accent/20 transition-colors flex items-center justify-center" title="Copy tracking number" data-unique-id="11f4a1f7-9438-4fd5-a3b5-b4c9dc798e1d" data-file-name="components/manual-email-modal.tsx">
                              <Copy className="h-4 w-4 text-primary" data-unique-id="e2651888-aa27-4e80-8903-f8b935c2a505" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true" />
                            </button>
                            <button onClick={e => {
                        e.stopPropagation();
                        const trackingUrl = `https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNum}`;
                        window.open(trackingUrl, '_blank', 'noopener,noreferrer');
                      }} className="p-2 rounded-full hover:bg-accent/20 transition-colors flex items-center justify-center" title="Open FedEx tracking" data-unique-id="4b8d0ceb-e086-4155-9dc4-dc1a1b4b5bc1" data-file-name="components/manual-email-modal.tsx">
                              <ExternalLink className="h-4 w-4 text-blue-600" data-unique-id="20046cde-8d3a-4db0-8d3e-76e6fdae33b5" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true" />
                            </button>
                            <button onClick={e => {
                        e.stopPropagation();
                        const trackingUrl = `https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNum}`;
                        try {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(trackingUrl).then(() => {
                              toast.success('FedEx tracking link copied!', {
                                duration: 2000,
                                icon: '🔗'
                              });
                            }).catch(err => {
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
                        function fallbackCopy(text: string) {
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
                              toast.success('FedEx tracking link copied!', {
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
                      }} className="px-2 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded text-xs text-blue-700 transition-colors" title="Copy FedEx tracking link" data-unique-id="a1753e6f-d968-41fa-bf21-37fd1a957e3c" data-file-name="components/manual-email-modal.tsx">
                              <Copy className="h-3 w-3 mr-1" data-unique-id="72ebc0a1-80bf-4f50-b104-5d79b74942fb" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true" /><span className="editable-text" data-unique-id="0490299c-7961-4ce8-ab06-1adea66a6f98" data-file-name="components/manual-email-modal.tsx">
                              Copy Link
                            </span></button>
                          </div>
                        </div>);
                })()}
                  </div>
                </div>}
              
              {/* Email content */}
              <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="1a9ca75b-aae1-4cd6-8310-b0e2b7620c94" data-file-name="components/manual-email-modal.tsx">
                <div className="flex items-center justify-between mb-3" data-unique-id="f8e51560-fcb4-462a-9bde-3237d9e5f224" data-file-name="components/manual-email-modal.tsx">
                  <div className="text-xs font-medium uppercase text-muted-foreground" data-unique-id="e750807e-d164-490b-92f1-2db6b3a5305d" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="1d975efe-b39e-439a-9597-0b8bcd64495f" data-file-name="components/manual-email-modal.tsx">Email Content:</span></div>
                  <div className="flex items-center space-x-2" data-unique-id="a51cd534-7a94-4075-8788-a069c5e96b63" data-file-name="components/manual-email-modal.tsx">
                    <button onClick={() => handleCopy(currentEmail.content || '', 'content')} className="flex items-center text-xs text-primary p-1.5 px-2.5 rounded hover:bg-accent/20" title="Copy plain text content" data-unique-id="55f781f7-d88f-4d46-8bde-aeb2b5f88d0e" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                      {copySuccess === 'content' ? <><Check className="h-3 w-3 mr-1.5" />Copied!</> : <><Copy className="h-3 w-3 mr-1.5" />Copy Text</>}
                    </button>
                    
                    <button onClick={() => handleCopy(currentEmail.html || '', 'html')} className="flex items-center text-xs text-primary p-1.5 px-2.5 rounded hover:bg-accent/20" title="Copy HTML content" data-unique-id="6a8de375-7008-48cb-9f58-4b72388fdcab" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                      {copySuccess === 'html' ? <><Check className="h-3 w-3 mr-1.5" />Copied!</> : <><Copy className="h-3 w-3 mr-1.5" />Copy HTML</>}
                    </button>
                  </div>
                </div>
                
                <div className="border border-border rounded-lg p-5 max-h-80 overflow-y-auto bg-accent/5 dark:bg-card/60" data-unique-id="2705bee7-6487-4cfb-8371-da70b82b111c" data-file-name="components/manual-email-modal.tsx">
                  <div className="whitespace-pre-wrap text-base" data-unique-id="d7c91055-798b-4d3d-b7df-e587a7c180c5" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
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
                        parts.push(<span key={`${i}-${match.index}`} className="inline-flex items-center" data-unique-id="dac1cbfb-f154-4d0d-a7df-cbe473669b3d" data-file-name="components/manual-email-modal.tsx">
                        <a href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNum}`} target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium" data-unique-id="a5a88bcf-c416-4a2e-b22b-422e43e71c70" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
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
                          }} className="ml-1 p-0.5 rounded-full hover:bg-accent/20 inline-flex" title="Copy tracking number" data-unique-id="c6506836-1cec-4345-a42f-6884571e60fb" data-file-name="components/manual-email-modal.tsx">
                          <Copy className="h-3 w-3 text-primary" data-unique-id="5216084f-958a-4712-80a4-4e7c275881a4" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true" />
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
                          }} className="ml-1 p-0.5 rounded-full hover:bg-accent/20 inline-flex" title="Copy FedEx link" data-unique-id="6575f3df-1c6b-4120-8807-8a26e8afdb64" data-file-name="components/manual-email-modal.tsx">
                          <svg className="h-3 w-3 text-[#4D148C]" viewBox="0 0 24 24" fill="currentColor" data-unique-id="98499477-69b3-4b56-9054-e0a814570f3e" data-file-name="components/manual-email-modal.tsx">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 5a3 3 0 11-3 3 3 3 0 013-3zm0 11.13c-2.03-.31-3.88-1.47-5.14-3.13h10.28c-1.26 1.66-3.11 2.82-5.14 3.13z" data-unique-id="9a07458d-403b-4f78-a367-582ce34d8454" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true" />
                          </svg>
                        </button>
                      </span>);
                        lastIndex = match.index + match[0].length;
                      }

                      // Add any remaining text
                      parts.push(line.substring(lastIndex));
                      return <div key={i} className="mb-3" data-unique-id="adfb7341-a5bc-4519-a383-f90a8d027a95" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{parts}</div>;
                    }
                    // Make survey link clickable
                    else if (line.includes('https://feed-back-dax.netlify.app')) {
                      return <div key={i} className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/30 rounded border border-blue-200 dark:border-blue-800" data-unique-id="3a848c84-5954-4250-9e75-419070782198" data-file-name="components/manual-email-modal.tsx">
                        <div className="font-medium mb-1 text-blue-700 dark:text-blue-300" data-unique-id="f909c89f-d1f8-4d4a-a063-81137d34747c" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="82637d0b-1300-41ed-9c80-a931ef999a64" data-file-name="components/manual-email-modal.tsx">Customer Feedback Survey</span></div>
                        <div data-unique-id="eeed51ed-c31d-4609-b00c-0e9758c1b90d" data-file-name="components/manual-email-modal.tsx">
                          <a href="https://feed-back-dax.netlify.app" target="_blank" rel="noopener noreferrer" className="text-primary underline flex items-center" data-unique-id="b598d2d5-2bde-4221-9721-f517d43645bb" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                            {line}
                            <ExternalLink className="h-3.5 w-3.5 ml-1" data-unique-id="87558fee-4e03-4421-835c-5a5e7dd84b3d" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true" />
                          </a>
                        </div>
                      </div>;
                    }
                    return <div key={i} className={line.trim() === "" ? "h-4" : "mb-3"} data-unique-id="dd269cc8-d3df-4f4c-ad36-30617946cf6c" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{line}</div>;
                  })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t border-border flex items-center justify-between" data-unique-id="90a58a25-e35a-4fd8-bd69-b934da8e79e2" data-file-name="components/manual-email-modal.tsx">
              <button onClick={onOpenInEmailClient} className="flex items-center px-4 py-2.5 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="d273ec6c-399d-4c73-a47f-0710f650b306" data-file-name="components/manual-email-modal.tsx">
                <ExternalLink className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="82a8a9fb-974c-468e-889f-282514b760c8" data-file-name="components/manual-email-modal.tsx">
                Open in Email Client
              </span></button>
              
              <button onClick={onMarkAsSent} disabled={isSent} className={`flex items-center px-5 py-2.5 rounded-md transition-colors ${isSent ? "bg-green-100 text-green-700 cursor-default dark:bg-green-900/30 dark:text-green-400" : "bg-primary text-primary-foreground hover:bg-primary/90"}`} data-unique-id="676269fd-0564-416a-8246-4910dc07c213" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
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