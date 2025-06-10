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
      }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose} data-unique-id="717b4183-2288-4ae0-a4e9-366afc0e823d" data-file-name="components/manual-email-modal.tsx">
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
        }} className="bg-background w-full max-w-4xl rounded-lg shadow-xl overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="bedec1ed-eb07-4c40-b8ed-0546a0348841" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
            {/* Modal Header */}
            <div className="bg-primary text-primary-foreground p-6" data-unique-id="87085b67-c0b8-4d4a-a1b4-9cfb80a318d1" data-file-name="components/manual-email-modal.tsx">
              <div className="flex justify-between items-center" data-unique-id="2fbc6c58-65ab-4430-a805-b200d89dbd16" data-file-name="components/manual-email-modal.tsx">
                <h3 className="text-xl font-medium flex items-center" data-unique-id="c067aa64-27f7-40bb-aa9b-9ee0f19e74df" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="b60bf48d-331a-4ba8-abdd-079563793bd5" data-file-name="components/manual-email-modal.tsx">
                  Email Review & Manual Send
                </span></h3>
                <button onClick={onClose} className="text-primary-foreground opacity-70 hover:opacity-100 p-2 rounded-full hover:bg-primary-foreground/20 transition-colors" aria-label="Close modal" data-unique-id="9ad4102b-bec3-42c9-a20a-dfa6e681fd62" data-file-name="components/manual-email-modal.tsx">
                  <X size={24} />
                </button>
              </div>
              
              <p className="text-primary-foreground/80 text-sm mt-1" data-unique-id="3625df19-ebc6-469a-9641-8dd3b628da6e" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="ce45ace5-26d1-4d14-8e2e-6c6da15d8425" data-file-name="components/manual-email-modal.tsx">
                Review email details, copy content to your email client, and mark as sent when complete.
              </span></p>
              
              <div className="flex items-center justify-between mt-6" data-unique-id="e2caeb72-e50e-449e-a831-c1ccc1968429" data-file-name="components/manual-email-modal.tsx">
                <div data-unique-id="ee2a9213-bb16-4dc0-b026-aed31af91ed4" data-file-name="components/manual-email-modal.tsx">
                  <span className="text-sm text-primary-foreground/90" data-unique-id="951fccd9-d2f5-4f5f-b61b-15cb9178299d" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="5ccec3df-64ae-48ee-bf1e-335788d31388" data-file-name="components/manual-email-modal.tsx">
                    Email </span>{currentEmailIndex + 1}<span className="editable-text" data-unique-id="f88868a0-2816-43d9-bf58-fede22b6d125" data-file-name="components/manual-email-modal.tsx"> of </span>{totalEmails}<span className="editable-text" data-unique-id="6272ca00-e7bf-4658-bfdf-99de92cc031f" data-file-name="components/manual-email-modal.tsx"> (</span>{completionPercentage}<span className="editable-text" data-unique-id="beed1451-1273-42b8-9b20-1f15e59bfad8" data-file-name="components/manual-email-modal.tsx">% complete)
                  </span></span>
                </div>
                
                <div className="flex items-center space-x-2" data-unique-id="9e06a611-237b-4927-8cc1-5c88fc7c1c2d" data-file-name="components/manual-email-modal.tsx">
                  <button onClick={onPrevious} disabled={currentEmailIndex === 0} className="p-1.5 rounded hover:bg-primary-foreground/10 disabled:opacity-40" data-unique-id="3d982161-f5cb-44fa-a1bb-805cb2f2f6cb" data-file-name="components/manual-email-modal.tsx">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={onNext} disabled={currentEmailIndex === totalEmails - 1} className="p-1.5 rounded hover:bg-primary-foreground/10 disabled:opacity-40" data-unique-id="5090851f-ccef-45ae-8886-8d7437c39f08" data-file-name="components/manual-email-modal.tsx">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="w-full bg-primary-foreground/20 h-2 mt-3 rounded-full" data-unique-id="396aee2c-8bca-46f7-82ca-421339d14f4b" data-file-name="components/manual-email-modal.tsx">
                <div className="bg-primary-foreground h-2 rounded-full transition-all duration-300" style={{
                width: `${completionPercentage}%`
              }} data-unique-id="23cb016b-3f8e-43e8-9d9d-e19b6ec4d2d6" data-file-name="components/manual-email-modal.tsx"></div>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6" data-unique-id="d343d0be-ad92-4c58-abe0-92577feffd67" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
              {/* Recipient information */}
              <div className="bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="1ed0750e-30bb-4eb5-986a-f169bb124a34" data-file-name="components/manual-email-modal.tsx">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="609e62ed-2235-4ff9-8a17-a1f0c1d86f08" data-file-name="components/manual-email-modal.tsx">
                  <div data-unique-id="03888df4-14b6-47dc-9b9f-745b802edd13" data-file-name="components/manual-email-modal.tsx">
                    <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="e936e91d-b703-41d5-9f30-54844724e56b" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="444272f8-795c-4a8b-9f1b-a3d987e5765b" data-file-name="components/manual-email-modal.tsx">To:</span></div>
                    <div className="flex items-center justify-between" data-unique-id="76494f90-697c-4ad0-b356-bb8276350e9d" data-file-name="components/manual-email-modal.tsx">
                      <div className="text-base" data-unique-id="3ac984ad-a49b-499f-955f-be936e5d2769" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.to}</div>
                      <button onClick={() => handleCopy(currentEmail.to || '', 'recipient')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy recipient" data-unique-id="55182bf9-810b-445e-8017-b1c4ef5e10be" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                        {copySuccess === 'recipient' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div data-unique-id="58777e82-0cfa-4f36-bd61-4ee7f358414b" data-file-name="components/manual-email-modal.tsx">
                    <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="0407bf4c-c0a3-445c-a51c-3599ba6d5e16" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="121b9ae2-50c3-4a62-8d18-c3b63f527c11" data-file-name="components/manual-email-modal.tsx">From:</span></div>
                    <div className="flex items-center justify-between" data-unique-id="583b2329-87e6-41af-9769-f210f4fd71c6" data-file-name="components/manual-email-modal.tsx">
                      <div className="text-base" data-unique-id="b5906b0b-18c9-4be3-9cd4-41e414ef1500" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.from}</div>
                      <button onClick={() => handleCopy(currentEmail.from || '', 'sender')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy sender" data-unique-id="a8b51cdd-f097-4be8-9386-b01086e5a78e" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                        {copySuccess === 'sender' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Template selector */}
              {availableTemplates.length > 0 && <div className="bg-card p-4 rounded-lg shadow-sm border border-border mb-4" data-unique-id="1a61db9d-b38d-4bc9-a59a-06c5076e4df6" data-file-name="components/manual-email-modal.tsx">
                  <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="0709c700-bae4-48e6-a0e7-41bd5aca6e18" data-file-name="components/manual-email-modal.tsx">
                    <span className="editable-text" data-unique-id="a86d5756-6184-448a-b61c-85097596c991" data-file-name="components/manual-email-modal.tsx">Email Template:</span>
                  </div>
                  <div className="relative" data-unique-id="741164f2-6d6d-4aea-99f5-a2707e23c486" data-file-name="components/manual-email-modal.tsx">
                    <select value={currentTemplateId || ''} onChange={e => onSelectTemplate?.(e.target.value)} className="w-full p-2 pr-8 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background" disabled={isSent} data-unique-id="0410e4d1-e216-4834-805a-862833ad67c8" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                      {availableTemplates.map(template => <option key={template.id} value={template.id} data-unique-id="098c8fd7-d329-4b5d-91cf-e7a6bdfd6799" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{template.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
                  </div>
                </div>}
              
              {/* Subject line */}
              <div className="bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="2b672a1f-0f28-4eeb-a6f0-f13324253d95" data-file-name="components/manual-email-modal.tsx">
                <div className="text-xs font-medium uppercase text-muted-foreground mb-1" data-unique-id="abce48aa-8ba0-4951-b032-316a2fcdf163" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="77391595-8916-40fc-9a2a-670d04b98a2a" data-file-name="components/manual-email-modal.tsx">Subject:</span></div>
                <div className="flex items-center justify-between" data-unique-id="77b7710f-15f8-47b4-975c-c7132241f978" data-file-name="components/manual-email-modal.tsx">
                  <div className="text-base font-medium" data-unique-id="06693b3c-01c2-48a3-8ff8-05028ff5dd4c" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{currentEmail.subject}</div>
                  <button onClick={() => handleCopy(currentEmail.subject || '', 'subject')} className="text-primary p-1.5 rounded hover:bg-accent/20" title="Copy subject" data-unique-id="f393ba53-e2e9-473e-9686-7abcbaab988d" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                    {copySuccess === 'subject' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Tracking Numbers */}
              {currentEmail.customer?.trackingNumber && <div className="bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="81e66729-3187-4880-9ab1-d78b357d4381" data-file-name="components/manual-email-modal.tsx">
                  <div className="flex items-center justify-between mb-3" data-unique-id="21d3a325-e002-4290-ab3e-04b91a52f45d" data-file-name="components/manual-email-modal.tsx">
                    <div className="text-xs font-medium uppercase text-muted-foreground flex items-center" data-unique-id="1eb16417-0ddc-497d-b89c-056b2aed5266" data-file-name="components/manual-email-modal.tsx">
                      <Truck className="h-4 w-4 mr-1" />
                      <span className="editable-text" data-unique-id="84aed712-f1f3-4dc0-8b45-6200f0de1451" data-file-name="components/manual-email-modal.tsx">Tracking Numbers:</span>
                    </div>
                  </div>
                  <div className="space-y-2" data-unique-id="bfa7d6c7-b277-4dd3-a869-3b6a489c19ce" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                    {(() => {
                  const trackingNumbers = Array.isArray(currentEmail.customer.trackingNumber) ? currentEmail.customer.trackingNumber : [currentEmail.customer.trackingNumber].filter(Boolean);
                  return trackingNumbers.map((trackingNum: string, index: number) => <div key={index} className="flex items-center justify-between p-3 bg-accent/10 rounded-md border border-border/50" data-unique-id="94ea7bcf-fbf0-4c06-9211-de2fef2a33db" data-file-name="components/manual-email-modal.tsx">
                          <div className="flex items-center space-x-3" data-unique-id="4c640363-1e84-4a5d-be85-7766c54c96d0" data-file-name="components/manual-email-modal.tsx">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center" data-unique-id="41d148eb-8487-45b6-8453-46044dbbf228" data-file-name="components/manual-email-modal.tsx">
                              <Truck className="h-4 w-4 text-primary" data-unique-id="2cf09c7b-6977-4da3-95a3-d938f3d71bdd" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true" />
                            </div>
                            <div data-unique-id="9903daf7-0eb8-4927-88f5-68b05115dba3" data-file-name="components/manual-email-modal.tsx">
                              <div className="font-medium text-sm" data-unique-id="26ab3ec8-e252-4525-ad17-cd66dbb21e56" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{trackingNum}</div>
                              <div className="text-xs text-muted-foreground" data-unique-id="316dcd82-2e7d-405d-a1cd-f7722f428cb8" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="becbe3a9-ef9e-4337-bffe-5fe2de906d4e" data-file-name="components/manual-email-modal.tsx">FedEx Tracking</span></div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2" data-unique-id="32a65e8e-9336-445a-8255-7a143507fce7" data-file-name="components/manual-email-modal.tsx">
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
                      }} className="p-2 rounded-full hover:bg-accent/20 transition-colors flex items-center justify-center" title="Copy tracking number" data-unique-id="274b48be-7809-4d92-b4cd-46218f2ebdb1" data-file-name="components/manual-email-modal.tsx">
                              <Copy className="h-4 w-4 text-primary" data-unique-id="6b8f7295-4a72-494d-a561-6e2226ab88a4" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true" />
                            </button>
                            <button onClick={e => {
                        e.stopPropagation();
                        const trackingUrl = `https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNum}`;
                        window.open(trackingUrl, '_blank', 'noopener,noreferrer');
                      }} className="p-2 rounded-full hover:bg-accent/20 transition-colors flex items-center justify-center" title="Open FedEx tracking" data-unique-id="fed260c4-c92e-4941-b180-97c77abbc315" data-file-name="components/manual-email-modal.tsx">
                              <ExternalLink className="h-4 w-4 text-blue-600" data-unique-id="d9cd804f-3bc6-48ba-8aa7-6471076c0ed5" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true" />
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
                      }} className="px-2 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded text-xs text-blue-700 transition-colors" title="Copy FedEx tracking link" data-unique-id="3a001183-77f5-4688-b733-3fe0bffbb9b3" data-file-name="components/manual-email-modal.tsx">
                              <Copy className="h-3 w-3 mr-1" data-unique-id="c1336ef8-1b5d-4025-bce9-ed8692083bf1" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true" /><span className="editable-text" data-unique-id="8c6b4686-32a2-4dcd-ab7d-833cd9d85c8e" data-file-name="components/manual-email-modal.tsx">
                              Copy Link
                            </span></button>
                          </div>
                        </div>);
                })()}
                  </div>
                </div>}
              
              {/* Email content */}
              <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm border border-border" data-unique-id="e51306bc-4dde-4801-922b-d36d4cffa2a4" data-file-name="components/manual-email-modal.tsx">
                <div className="flex items-center justify-between mb-3" data-unique-id="eaad07b2-5a26-4dbf-806c-77cbd7da8e11" data-file-name="components/manual-email-modal.tsx">
                  <div className="text-xs font-medium uppercase text-muted-foreground" data-unique-id="bb432767-4d63-4a0c-8794-087b65fa5253" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="b8f912f0-0959-4ea5-9235-1d2451027843" data-file-name="components/manual-email-modal.tsx">Email Content:</span></div>
                  <div className="flex items-center space-x-2" data-unique-id="e7e6a8ea-02d2-4e29-918c-51d2972d2d14" data-file-name="components/manual-email-modal.tsx">
                    <button onClick={() => handleCopy(currentEmail.content || '', 'content')} className="flex items-center text-xs text-primary p-1.5 px-2.5 rounded hover:bg-accent/20" title="Copy plain text content" data-unique-id="dda8523e-c427-4ddf-98ab-e6646530cf3e" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                      {copySuccess === 'content' ? <><Check className="h-3 w-3 mr-1.5" />Copied!</> : <><Copy className="h-3 w-3 mr-1.5" />Copy Text</>}
                    </button>
                    
                    <button onClick={() => handleCopy(currentEmail.html || '', 'html')} className="flex items-center text-xs text-primary p-1.5 px-2.5 rounded hover:bg-accent/20" title="Copy HTML content" data-unique-id="046ce31a-b959-4122-a901-5c3d40534656" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                      {copySuccess === 'html' ? <><Check className="h-3 w-3 mr-1.5" />Copied!</> : <><Copy className="h-3 w-3 mr-1.5" />Copy HTML</>}
                    </button>
                  </div>
                </div>
                
                <div className="border border-border rounded-lg p-5 max-h-80 overflow-y-auto bg-accent/5 dark:bg-card/60" data-unique-id="dbbd6b84-d2d3-4574-9ce7-7008eb80158c" data-file-name="components/manual-email-modal.tsx">
                  <div className="whitespace-pre-wrap text-base" data-unique-id="a02c1733-1923-42b9-820c-8c2d863f3b31" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
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
                        parts.push(<span key={`${i}-${match.index}`} className="inline-flex items-center" data-unique-id="89caa373-4fb7-44fe-9155-32c12a949beb" data-file-name="components/manual-email-modal.tsx">
                        <a href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNum}`} target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium" data-unique-id="a543287b-c2e4-40ea-8878-92a8f5731584" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
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
                          }} className="ml-1 p-0.5 rounded-full hover:bg-accent/20 inline-flex" title="Copy tracking number" data-unique-id="6ed24768-9af3-4024-9400-a7fd2f851a8c" data-file-name="components/manual-email-modal.tsx">
                          <Copy className="h-3 w-3 text-primary" data-unique-id="3d4b5827-7579-4882-86ad-c99e0bedebc4" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true" />
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
                          }} className="ml-1 p-0.5 rounded-full hover:bg-accent/20 inline-flex" title="Copy FedEx link" data-unique-id="3e8d772a-6d10-48ce-b32b-439c56eabef6" data-file-name="components/manual-email-modal.tsx">
                          <svg className="h-3 w-3 text-[#4D148C]" viewBox="0 0 24 24" fill="currentColor" data-unique-id="d1a7ad40-1ba5-48d6-ae6d-1f34d9237301" data-file-name="components/manual-email-modal.tsx">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 5a3 3 0 11-3 3 3 3 0 013-3zm0 11.13c-2.03-.31-3.88-1.47-5.14-3.13h10.28c-1.26 1.66-3.11 2.82-5.14 3.13z" data-unique-id="c836b257-127d-422a-9b10-0bde3f267a54" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true" />
                          </svg>
                        </button>
                      </span>);
                        lastIndex = match.index + match[0].length;
                      }

                      // Add any remaining text
                      parts.push(line.substring(lastIndex));
                      return <div key={i} className="mb-3" data-unique-id="3451f24f-9a53-4a91-aa3f-1be5a9d34db0" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{parts}</div>;
                    }
                    // Make survey link clickable
                    else if (line.includes('https://feed-back-dax.netlify.app')) {
                      return <div key={i} className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/30 rounded border border-blue-200 dark:border-blue-800" data-unique-id="168a5a30-0f46-4f59-aa46-5999bc94ea60" data-file-name="components/manual-email-modal.tsx">
                        <div className="font-medium mb-1 text-blue-700 dark:text-blue-300" data-unique-id="2b30e6ea-7ab6-41bd-b68d-e1a1f1625470" data-file-name="components/manual-email-modal.tsx"><span className="editable-text" data-unique-id="6009012f-15fe-4448-bd37-6c205832710f" data-file-name="components/manual-email-modal.tsx">Customer Feedback Survey</span></div>
                        <div data-unique-id="d34f23e8-bd19-4e2a-bfbe-78e68afd65da" data-file-name="components/manual-email-modal.tsx">
                          <a href="https://feed-back-dax.netlify.app" target="_blank" rel="noopener noreferrer" className="text-primary underline flex items-center" data-unique-id="38fdabf7-e521-4095-aa1c-6bf85eed2a1f" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
                            {line}
                            <ExternalLink className="h-3.5 w-3.5 ml-1" data-unique-id="5c418758-0ab2-4845-908c-18814322adf1" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true" />
                          </a>
                        </div>
                      </div>;
                    }
                    return <div key={i} className={line.trim() === "" ? "h-4" : "mb-3"} data-unique-id="5201258f-d293-42c0-a069-607e6099e1bb" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">{line}</div>;
                  })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t border-border flex items-center justify-between" data-unique-id="9e1387a7-bd6b-4fba-a85c-71df997cb3ba" data-file-name="components/manual-email-modal.tsx">
              <button onClick={onOpenInEmailClient} className="flex items-center px-4 py-2.5 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="53738e7c-bc3a-4206-93b0-ae2542fb5589" data-file-name="components/manual-email-modal.tsx">
                <ExternalLink className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="31bf6294-9736-41c1-ba1a-a6d5d4799700" data-file-name="components/manual-email-modal.tsx">
                Open in Email Client
              </span></button>
              
              <button onClick={onMarkAsSent} disabled={isSent} className={`flex items-center px-5 py-2.5 rounded-md transition-colors ${isSent ? "bg-green-100 text-green-700 cursor-default dark:bg-green-900/30 dark:text-green-400" : "bg-primary text-primary-foreground hover:bg-primary/90"}`} data-unique-id="3fe341e8-f42e-468d-8c1d-f851c8c512e7" data-file-name="components/manual-email-modal.tsx" data-dynamic-text="true">
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