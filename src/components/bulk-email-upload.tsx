"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Send, AlertCircle, Check, X, FileSpreadsheet, UserRound, Mail, Users, PlusCircle, RefreshCw, Copy, ExternalLink, ChevronLeft, ChevronRight, Eye, PackageCheck } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from 'xlsx';
import { generateHtmlEmail, TemplateData } from "@/lib/email-utils";
import toast from 'react-hot-toast';
import { getLocalStorage } from "@/lib/utils";
import type { Customer } from "@/components/customer-management";
import { ManualEmailModal } from "./manual-email-modal";
import copy from 'clipboard-copy';
type CustomerData = {
  id: string;
  name: string;
  email: string;
  orderNumber: string;
  trackingNumber: string;
  address: string;
  orderDate: string;
  items: string;
};
const sampleData: CustomerData[] = [{
  id: "1",
  name: "John Smith",
  email: "john@example.com",
  orderNumber: "ORD-12345678",
  trackingNumber: "TRK-9876543210",
  address: "123 Main St, Detroit, MI 48201",
  orderDate: "May 20, 2025",
  items: "2x Front Wheel Hub Bearing, 1x Control Arm"
}, {
  id: "2",
  name: "Emily Johnson",
  email: "emily@example.com",
  orderNumber: "ORD-87654321",
  trackingNumber: "TRK-1234567890",
  address: "456 Park Ave, Troy, MI 48083",
  orderDate: "May 19, 2025",
  items: "1x Rear Wheel Hub Bearing, 2x Shock Absorbers"
}, {
  id: "3",
  name: "Michael Brown",
  email: "michael@example.com",
  orderNumber: "ORD-11223344",
  trackingNumber: "TRK-5566778899",
  address: "789 Pine St, Warren, MI 48089",
  orderDate: "May 18, 2025",
  items: "4x Brake Rotors, 1x Brake Caliper"
}];
interface BulkEmailUploadProps {
  template: {
    subject: string;
    preheader: string;
    content: string;
  };
  onSenderEmailChange?: (senderInfo: {
    name: string;
    email: string;
  }) => void;
}
export default function BulkEmailUpload({
  template,
  onSenderEmailChange
}: BulkEmailUploadProps) {
  const [customers, setCustomers] = useState<CustomerData[]>(sampleData);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sentStatus, setSentStatus] = useState<Record<string, boolean>>({});
  const [failedEmails, setFailedEmails] = useState<Record<string, string>>({});
  const [senderName, setSenderName] = useState("Detroit Axle Support");
  const [senderEmail, setSenderEmail] = useState("employee@detroitaxle.com");

  // Notify parent component when sender info changes on component mount
  useEffect(() => {
    handleSenderInfoChange();
  }, []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [savedCustomers, setSavedCustomers] = useState<Customer[]>([]);
  const [showCustomerSelector, setShowCustomerSelector] = useState(false);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [sendingError, setSendingError] = useState<string | null>(null);
  const [sendingProgress, setSendingProgress] = useState(0);

  // New state for manual email sending
  const [isEmailServiceAvailable, setIsEmailServiceAvailable] = useState(true);
  const [manualSendMode, setManualSendMode] = useState(false);
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
  const [reviewedEmails, setReviewedEmails] = useState<Record<string, boolean>>({});
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [showManualEmailModal, setShowManualEmailModal] = useState(false);
  const [hasOrderData, setHasOrderData] = useState(false);
  const [includeSurvey, setIncludeSurvey] = useState(false);
  // Define TemplateProps type to match the template structure
  type TemplateProps = {
    id: string;
    name: string;
    subject: string;
    preheader: string;
    content: string;
  };
  const [emailTemplates, setEmailTemplates] = useState<Array<{
    id: string;
    name: string;
  }>>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<Record<string, string>>({});
  const handleSenderInfoChange = () => {
    if (onSenderEmailChange) {
      onSenderEmailChange({
        name: senderName,
        email: senderEmail
      });
    }
  };

  // Check if email service is available
  useEffect(() => {
    const checkEmailService = async () => {
      try {
        const response = await fetch('/api/email-config-check');
        const result = await response.json();
        setIsEmailServiceAvailable(result.configured);
        // Automatically set to manual mode if no email service available
        if (!result.configured) {
          setManualSendMode(true);
        }
      } catch (error) {
        console.error('Error checking email service:', error);
        setIsEmailServiceAvailable(false);
        setManualSendMode(true);
      }
    };
    checkEmailService();
  }, []);

  // Load saved customers, templates, and check for order data
  useEffect(() => {
    const loadedCustomers = getLocalStorage<Customer[]>('emailCustomers', []);
    setSavedCustomers(loadedCustomers);

    // Load templates
    const savedTemplates = getLocalStorage<TemplateProps[]>("emailTemplates", []);
    if (savedTemplates.length > 0) {
      setEmailTemplates(savedTemplates.map(template => ({
        id: template.id,
        name: template.name
      })));
    }

    // Check for order data sources with improved detection
    if (typeof window !== 'undefined') {
      try {
        // Check all possible sources of order data
        const orderDataSources = ['orderDataForEmails', 'lastProcessedOrders', 'lastExportedOrders'];
        for (const source of orderDataSources) {
          const data = localStorage.getItem(source);
          if (data) {
            try {
              const parsed = JSON.parse(data);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setHasOrderData(true);
                // Remember which source has valid data
                localStorage.setItem('activeOrderDataSource', source);
                break;
              }
            } catch (e) {
              console.warn(`Failed to parse ${source}:`, e);
            }
          }
        }
      } catch (error) {
        console.error('Error checking for order data:', error);
      }
    }
  }, []);

  // Function to select a template for a specific email
  const selectTemplateForEmail = (templateId: string) => {
    if (currentEmailIndex >= 0 && currentEmailIndex < customers.length) {
      const customerId = customers[currentEmailIndex].id;
      setSelectedTemplates(prev => ({
        ...prev,
        [customerId]: templateId
      }));

      // Update the preview with the new template
      updateEmailPreview(templateId);
    }
  };

  // Function to update email preview with selected template
  const updateEmailPreview = (templateId: string) => {
    if (!customers.length || currentEmailIndex >= customers.length) return;

    // Find the selected template
    const availableTemplates = getLocalStorage<TemplateData[]>("emailTemplates", []);
    const selectedTemplate = availableTemplates.find(t => t.id === templateId);
    if (!selectedTemplate) return;

    // Force refresh of the current email with new template
    const customer = customers[currentEmailIndex];
    toast.success(`Template changed to: ${selectedTemplate.name}`);
  };

  // Function to import order data from localStorage
  const importOrderData = () => {
    try {
      setIsUploading(true);

      // Get orders directly from localStorage
      if (typeof window === 'undefined') {
        alert("Cannot access localStorage in server environment.");
        return;
      }

      // Try multiple sources for order data with fallbacks
      let orderData;

      // First check for explicitly shared order data
      let orderDataForEmails = null;
      if (typeof window !== 'undefined') {
        orderDataForEmails = localStorage.getItem('orderDataForEmails');
      }
      if (orderDataForEmails) {
        try {
          orderData = JSON.parse(orderDataForEmails);
        } catch (e) {
          console.error('Failed to parse orderDataForEmails:', e);
        }
      }

      // If that fails, try lastProcessedOrders
      if (!orderData) {
        let lastProcessedOrders = null;
        if (typeof window !== 'undefined') {
          lastProcessedOrders = localStorage.getItem('lastProcessedOrders');
        }
        if (lastProcessedOrders) {
          try {
            orderData = JSON.parse(lastProcessedOrders);
          } catch (e) {
            console.error('Failed to parse lastProcessedOrders:', e);
          }
        }
      }

      // If still no data, try lastExportedOrders
      if (!orderData) {
        let lastExportedOrders = null;
        if (typeof window !== 'undefined') {
          lastExportedOrders = localStorage.getItem('lastExportedOrders');
        }
        if (lastExportedOrders) {
          try {
            orderData = JSON.parse(lastExportedOrders);
          } catch (e) {
            console.error('Failed to parse lastExportedOrders:', e);
          }
        }
      }
      if (!orderData || !Array.isArray(orderData) || orderData.length === 0) {
        alert("No order data available in localStorage.");
        setIsUploading(false);
        return;
      }

      // Convert order data to customer format
      const newCustomers: CustomerData[] = orderData.map((order: any) => {
        return {
          id: order.id ? `local-${order.id}` : `local-${Math.random().toString(36).substring(2, 9)}`,
          name: order.shipToName || '',
          email: order.shipToEmail || `customer-${order.customerOrderNumber}@example.com`,
          orderNumber: order.customerOrderNumber || '',
          trackingNumber: Array.isArray(order.trackingNumbers) && order.trackingNumbers.length > 0 ? order.trackingNumbers[0] : typeof order.trackingNumbers === 'string' ? order.trackingNumbers : '',
          address: order.shipToLine1 ? `${order.shipToLine1}, ${order.shipToCity}, ${order.shipToStateProvince} ${order.shipToPostalCode}` : '',
          orderDate: order.actualShipDate ? new Date(order.actualShipDate).toLocaleDateString() : new Date().toLocaleDateString(),
          items: order.orderSummary || ''
        };
      });

      // Add to existing customers
      setCustomers([...customers, ...newCustomers]);

      // Clean up after import
      setHasOrderData(false);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('orderDataForEmails');
      }
      alert(`${newCustomers.length} customers imported successfully!`);
    } catch (error) {
      console.error("Error importing order data:", error);
      alert(`Error importing order data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Add selected saved customers to the email list
  const addSelectedCustomersToEmailList = () => {
    if (selectedCustomerIds.length === 0) {
      alert("Please select at least one customer");
      return;
    }
    const selectedCustomers = savedCustomers.filter(customer => selectedCustomerIds.includes(customer.id)).map(customer => ({
      id: uuidv4(),
      name: customer.name,
      email: customer.email,
      orderNumber: "",
      trackingNumber: "",
      address: customer.address || "",
      orderDate: new Date().toLocaleDateString(),
      items: ""
    }));
    setCustomers([...customers, ...selectedCustomers]);
    setShowCustomerSelector(false);
    setSelectedCustomerIds([]);
  };

  // Toggle customer selection in the selector
  const toggleCustomerSelection = (id: string) => {
    if (selectedCustomerIds.includes(id)) {
      setSelectedCustomerIds(selectedCustomerIds.filter(customerId => customerId !== id));
    } else {
      setSelectedCustomerIds([...selectedCustomerIds, id]);
    }
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setIsUploading(true);

    // Read the Excel file
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, {
          type: 'binary'
        });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        // Map Excel data to CustomerData format
        const newCustomers: CustomerData[] = jsonData.map((row: any) => ({
          id: uuidv4(),
          name: row.name || '',
          email: row.email || '',
          orderNumber: row.orderNumber || '',
          trackingNumber: row.trackingNumber || '',
          address: row.address || '',
          orderDate: row.orderDate || '',
          items: row.items || ''
        }));
        setCustomers(newCustomers);
        setIsUploading(false);

        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        alert("Error parsing Excel file. Please make sure it's a valid Excel file with the correct format.");
        setIsUploading(false);
      }
    };
    reader.onerror = () => {
      alert("Error reading the Excel file. Please try again.");
      setIsUploading(false);
    };
    reader.readAsBinaryString(file);
  };
  const sendEmails = async () => {
    if (manualSendMode) {
      // In manual mode, we just set up the emails for review
      setIsSending(true);
      setSendingProgress(50);

      // Track manual email preparation
      import('@/lib/utils').then(({
        trackActivity
      }) => {
        trackActivity('email.prepare_manual', {
          recipientCount: customers.length,
          senderEmail: senderEmail,
          senderName: senderName
        });
      });

      // Mark all emails as needing review
      const newReviewedEmails: Record<string, boolean> = {};
      const newSentStatus: Record<string, boolean> = {
        ...sentStatus
      };
      customers.forEach(customer => {
        if (!newReviewedEmails[customer.id]) {
          newReviewedEmails[customer.id] = false;
        }
        // Don't reset emails that were already marked as sent
        if (!newSentStatus[customer.id]) {
          newSentStatus[customer.id] = false;
        }
      });
      setReviewedEmails(newReviewedEmails);
      setSentStatus(newSentStatus);

      // Find first unsent email and set it as current
      const firstUnsent = customers.findIndex(c => !sentStatus[c.id]);
      setCurrentEmailIndex(firstUnsent >= 0 ? firstUnsent : 0);
      setSendingProgress(100);
      setIsSending(false);

      // Show the manual email modal
      setShowManualEmailModal(true);
      return;
    }

    // Automatic sending mode using the API
    setIsSending(true);
    setSendingError(null);
    setSendingProgress(0);
    const newSentStatus: Record<string, boolean> = {};
    const failedEmails: Record<string, string> = {};
    try {
      // Prepare email data for each customer
      const emailsToSend = customers.map(customer => {
        // Process template content with customer data
        const processedSubject = processTemplate(template.subject, customer);
        const processedContent = processTemplate(template.content, customer);

        // Generate HTML content
        const htmlContent = generateHtmlEmail({
          ...template,
          id: 'temp-' + customer.id,
          name: 'Generated Template',
          subject: processedSubject,
          content: processedContent
        }, {
          customerName: customer.name,
          orderNumber: customer.orderNumber,
          trackingNumber: customer.trackingNumber,
          address: customer.address,
          orderDate: customer.orderDate,
          items: customer.items
        }, {
          name: senderName,
          email: senderEmail
        });

        // Create plain text version
        const textContent = processedContent.replace(/\n/g, '\r\n');
        return {
          to: customer.email,
          from: {
            email: senderEmail,
            name: senderName
          },
          subject: processedSubject,
          html: htmlContent,
          text: textContent
        };
      });

      // Show progress indicator for better UX
      setSendingProgress(10);

      // Send emails via API
      console.log("Sending emails:", emailsToSend);
      setSendingProgress(30);
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          emails: emailsToSend
        })
      });
      setSendingProgress(70);
      const result = await response.json();
      console.log("Email API response:", result);
      setSendingProgress(90);
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send emails');
      }

      // Update status based on API response
      result.results.forEach((emailResult: {
        email: string;
        status: string;
        error?: string;
      }) => {
        const customer = customers.find(c => c.email === emailResult.email);
        if (customer) {
          if (emailResult.status === 'success') {
            newSentStatus[customer.id] = true;
          } else {
            failedEmails[customer.id] = emailResult.error || 'Failed to send';
          }
        }
      });
      setSentStatus(newSentStatus);

      // Show success message
      setSendingProgress(100);
      alert(`Email sending complete. ${result.totalSent} sent successfully, ${result.totalFailed} failed.`);
    } catch (error) {
      console.error('Error sending emails:', error);
      setSendingError(error instanceof Error ? error.message : 'Unknown error');
      alert(`Error sending emails: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSending(false);
    }
  };

  // Helper function to process template with customer data
  const processTemplate = (content: string, data: Record<string, string>): string => {
    let processed = content;

    // Replace variables with their values
    Object.entries(data).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      processed = processed.replace(regex, value || '');
    });

    // Special case for handling the customer name in both formats
    if (data.name && !processed.includes('{{customerName}}')) {
      processed = processed.replace(/{{name}}/g, data.name || '');
    }

    // Add survey link if option is selected
    if (includeSurvey) {
      processed += `\n\n------------------\n\nWe value your feedback! Please take a moment to complete our customer satisfaction survey:\nhttps://feed-back-dax.netlify.app\n\nThank you for helping us improve our service.`;
    }
    return processed;
  };

  // Helper functions for manual email handling
  const getCurrentEmail = () => {
    if (!customers.length || currentEmailIndex >= customers.length) return null;
    const customer = customers[currentEmailIndex];

    // Create a properly structured data object with all required fields
    const customerData = {
      customerName: customer.name || '',
      orderNumber: customer.orderNumber || '',
      trackingNumber: customer.trackingNumber || '',
      address: customer.address || '',
      orderDate: customer.orderDate || '',
      items: customer.items || ''
    };

    // Check if we have a specific template selected for this customer
    let templateToUse = template;
    const customerId = customer.id;
    const selectedTemplateId = selectedTemplates[customerId];
    if (selectedTemplateId) {
      const availableTemplates = getLocalStorage<TemplateData[]>("emailTemplates", []);
      const customTemplate = availableTemplates.find(t => t.id === selectedTemplateId);
      if (customTemplate) {
        templateToUse = customTemplate;
      }
    }

    // Process template with the customerData object (not the raw customer)
    const processedSubject = processTemplate(templateToUse.subject, customerData);
    const processedContent = processTemplate(templateToUse.content, customerData);

    // Generate HTML with explicit customer data mapping
    const htmlContent = generateHtmlEmail({
      ...templateToUse,
      id: 'temp-' + customer.id,
      name: 'Generated Template',
      subject: processedSubject,
      content: processedContent
    }, customerData, {
      name: senderName,
      email: senderEmail
    });
    return {
      customer,
      subject: processedSubject,
      content: processedContent,
      html: htmlContent,
      to: customer.email,
      from: `${senderName} <${senderEmail}>`
    };
  };

  // Handle copy to clipboard functionality
  const handleCopy = (text: string, type: string) => {
    copy(text);
    setCopySuccess(type);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  // Mark the current email as reviewed and move to next
  const markAsSent = () => {
    if (!customers.length || currentEmailIndex >= customers.length) return;
    const customer = customers[currentEmailIndex];
    const newReviewedEmails = {
      ...reviewedEmails
    };
    newReviewedEmails[customer.id] = true;
    setReviewedEmails(newReviewedEmails);
    const newSentStatus = {
      ...sentStatus
    };
    newSentStatus[customer.id] = true;
    setSentStatus(newSentStatus);

    // Move to next email if there are more
    if (currentEmailIndex < customers.length - 1) {
      setCurrentEmailIndex(currentEmailIndex + 1);
    }
  };

  // Navigation functions for email review
  const goToNextEmail = () => {
    if (currentEmailIndex < customers.length - 1) {
      setCurrentEmailIndex(currentEmailIndex + 1);
    }
  };
  const goToPrevEmail = () => {
    if (currentEmailIndex > 0) {
      setCurrentEmailIndex(currentEmailIndex - 1);
    }
  };

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    if (!customers.length) return 0;
    const sent = Object.values(sentStatus).filter(Boolean).length;
    return Math.round(sent / customers.length * 100);
  };

  // Open default mail client with email populated
  const openInEmailClient = () => {
    const email = getCurrentEmail();
    if (!email) return;

    // Create a simplified plaintext version of the HTML content
    const plainText = email.content.replace(/<[^>]*>/g, '');

    // Construct mailto URL (note: this has limitations on length and doesn't fully support HTML)
    const mailtoUrl = `mailto:${encodeURIComponent(email.to)}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(plainText)}`;

    // Open the mail client - check if window exists (client-side only)
    if (typeof window !== 'undefined') {
      window.open(mailtoUrl);
    }
  };
  const addCustomer = () => {
    const newCustomer: CustomerData = {
      id: uuidv4(),
      name: "",
      email: "",
      orderNumber: "",
      trackingNumber: "",
      address: "",
      orderDate: "",
      items: ""
    };
    setCustomers([...customers, newCustomer]);
  };
  const updateCustomer = (id: string, field: keyof CustomerData, value: string) => {
    setCustomers(customers.map(c => c.id === id ? {
      ...c,
      [field]: value
    } : c));
  };
  const removeCustomer = (id: string) => {
    setCustomers(customers.filter(c => c.id !== id));
  };
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} transition={{
    duration: 0.3
  }} className="bg-card rounded-lg shadow-md p-6" data-unique-id="5944d3f5-bb51-4421-a5cd-fd93a8571c43" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
      <div className="mb-6" data-unique-id="283392e7-3890-4f0e-b919-42d6a3dd3327" data-file-name="components/bulk-email-upload.tsx">
        <h2 className="text-xl font-medium mb-2" data-unique-id="88bb3e81-3aea-4d34-b79b-4c1af3f0137c" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="2accd5c8-84fc-488a-9600-62055a7c978f" data-file-name="components/bulk-email-upload.tsx">Bulk Email Sender</span></h2>
        <p className="text-muted-foreground" data-unique-id="d059d967-d6cc-43c4-ae43-efdf337487ef" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="e37f4725-418d-4d12-9645-4f80a689245b" data-file-name="components/bulk-email-upload.tsx">
          Upload customer data or select saved customers to send bulk emails
        </span></p>
      </div>
      
      {/* Sending mode selector */}
      <div className="mb-6" data-unique-id="7c9a72e1-8d40-43f6-aa49-fc34f305cdc8" data-file-name="components/bulk-email-upload.tsx">
        <div className="bg-card p-5 border border-border rounded-md shadow-sm" data-unique-id="607ab932-0118-4896-a89f-0ba004ce9370" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium mb-4 text-base flex items-center" data-unique-id="a54eb0c6-2f16-4667-af03-4b1c3bd70c5c" data-file-name="components/bulk-email-upload.tsx">
            <Mail className="mr-2 h-5 w-5 text-primary" /><span className="editable-text" data-unique-id="d7f32185-b32c-4f54-872f-2798aa817446" data-file-name="components/bulk-email-upload.tsx">
            Email Sending Method
          </span></h3>
          
          <div className="grid grid-cols-2 gap-4" data-unique-id="fbc7cdb2-5a0b-44b9-a2c9-32acf704f598" data-file-name="components/bulk-email-upload.tsx">
            <button onClick={() => setManualSendMode(false)} disabled={!isEmailServiceAvailable} className={`p-4 rounded-md border ${!manualSendMode ? 'border-primary bg-primary/5' : 'border-border'} flex flex-col items-center text-center transition-all ${!isEmailServiceAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}`} data-unique-id="b979de69-94b8-467a-a2bf-9221d9a9573b" data-file-name="components/bulk-email-upload.tsx">
              <Send className="h-8 w-8 text-primary mb-2" />
              <div className="font-medium mb-1" data-unique-id="0d6a94e2-13dc-4232-a2c6-91672b3c13f6" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="03e8bc59-cb28-4464-90df-32107d882587" data-file-name="components/bulk-email-upload.tsx">Automated Sending</span></div>
              <div className="text-xs text-muted-foreground" data-unique-id="dff3b7ad-e875-4cd2-baf3-2a2861e5e0ed" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {isEmailServiceAvailable ? "Emails will be sent automatically via the system" : "Email service not configured"}
              </div>
            </button>
            
            <button onClick={() => setManualSendMode(true)} className={`p-4 rounded-md border ${manualSendMode ? 'border-primary bg-primary/5' : 'border-border'} flex flex-col items-center text-center transition-all hover:border-primary/50`} data-unique-id="be4fa1ab-d080-4222-aaa6-a5258f6f6ba9" data-file-name="components/bulk-email-upload.tsx">
              <ExternalLink className="h-8 w-8 text-primary mb-2" />
              <div className="font-medium mb-1" data-unique-id="ba3f49d3-caf0-4c64-a1bb-0a2aa78b8812" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="47a01dc5-3f0e-4f66-a4fc-a06d7095f0d4" data-file-name="components/bulk-email-upload.tsx">Manual Sending</span></div>
              <div className="text-xs text-muted-foreground" data-unique-id="282d3852-c2e4-4272-8328-4d4dbcd71a3d" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="bf727774-3c41-4ed7-8c8b-035acd41e1c4" data-file-name="components/bulk-email-upload.tsx">
                Review and send emails through your own email client
              </span></div>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 space-y-4" data-unique-id="4a880567-0aab-497f-99fd-d97b6ce48e76" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
        <div className="bg-card p-5 border border-border rounded-md shadow-sm" data-unique-id="d045cd47-ee4a-462d-9b8e-7690ed1a90f0" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="84b17966-548a-4615-b4a2-7849b9a81394" data-file-name="components/bulk-email-upload.tsx">
            <UserRound className="mr-2 h-4 w-4 text-primary" />
            <span className="editable-text" data-unique-id="49dda0d6-6ed9-4571-887c-3b8eb0d8f027" data-file-name="components/bulk-email-upload.tsx">Employee Sender Information</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2" data-unique-id="676fefec-3a08-4d50-ba94-f6f5455c3d36" data-file-name="components/bulk-email-upload.tsx">
            <div data-unique-id="7be1aeca-c84f-45c4-96c7-9b75ae8ad36a" data-file-name="components/bulk-email-upload.tsx">
              <label htmlFor="senderName" className="block text-sm font-medium mb-1" data-unique-id="242dda70-a6dc-499d-b08a-552682885ffa" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="7f81a085-b72b-475e-997c-01be7ea45faf" data-file-name="components/bulk-email-upload.tsx">Employee Name</span>
              </label>
              <input id="senderName" type="text" value={senderName} onChange={e => {
              setSenderName(e.target.value);
              setTimeout(() => handleSenderInfoChange(), 0); // Ensure state is updated before callback
            }} placeholder="John Smith" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="4c6b31c0-846d-4273-90f3-cad4b5bd57a5" data-file-name="components/bulk-email-upload.tsx" />
            </div>
            
            <div data-unique-id="902489ac-13dd-4401-a245-3bcdc831ff88" data-file-name="components/bulk-email-upload.tsx">
              <label htmlFor="senderEmail" className="block text-sm font-medium mb-1" data-unique-id="86d01058-bea2-42b2-ad0b-6bf93de600d0" data-file-name="components/bulk-email-upload.tsx">
                <Mail className="inline-block h-3 w-3 mr-1 text-muted-foreground" />
                <span className="editable-text" data-unique-id="23768346-673a-4cb5-9648-6f3193e6cb21" data-file-name="components/bulk-email-upload.tsx">Employee Email</span>
              </label>
              <input id="senderEmail" type="email" value={senderEmail} onChange={e => {
              setSenderEmail(e.target.value);
              setTimeout(() => handleSenderInfoChange(), 0); // Ensure state is updated before callback
            }} placeholder="employee@detroitaxle.com" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="e29d9225-606d-4177-8587-808d2b8d8ad5" data-file-name="components/bulk-email-upload.tsx" />
              <p className="text-xs text-muted-foreground mt-1" data-unique-id="967b12e4-0dfc-44e8-886b-5ceda4028760" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="8b3fffb1-f532-485b-a7de-def3b9114428" data-file-name="components/bulk-email-upload.tsx">This employee will appear as the sender of all emails</span>
              </p>
            </div>
          </div>
          
          <div className="mt-4 flex items-center" data-unique-id="4d9a7edc-f942-4d52-877e-ad45bcb1a461" data-file-name="components/bulk-email-upload.tsx">
            <input type="checkbox" id="includeSurvey" checked={includeSurvey} onChange={() => setIncludeSurvey(!includeSurvey)} className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" data-unique-id="6d132e06-ea6f-43c8-8f4a-d8ab735a3442" data-file-name="components/bulk-email-upload.tsx" />
            <label htmlFor="includeSurvey" className="ml-2 block text-sm" data-unique-id="6877cd3f-06d7-444f-8c5a-195e2bfa2b55" data-file-name="components/bulk-email-upload.tsx">
              <span className="text-foreground font-medium" data-unique-id="d34293bf-e887-42bb-9511-37ece2b4d3a2" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="49409078-a970-4a46-9196-1e5dae2d9142" data-file-name="components/bulk-email-upload.tsx">Include customer feedback survey</span></span>
              <p className="text-xs text-muted-foreground" data-unique-id="f039fad7-a09b-4d3a-b5c2-a8deda9adcdc" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="c8755cd1-6acb-4258-8d0b-48e0cfeffc8b" data-file-name="components/bulk-email-upload.tsx">
                Add a link to our customer satisfaction survey: https://feed-back-dax.netlify.app
              </span></p>
            </label>
          </div>
        </div>
        
      {/* Import Order Data Alert - Show when order data is available */}
      {hasOrderData && <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md animate-pulse" data-unique-id="6c4b4b30-b02c-485d-818f-bf0686dada91" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center justify-between" data-unique-id="518c6019-c1ee-4629-a06b-9121d10743ea" data-file-name="components/bulk-email-upload.tsx">
            <div className="flex items-center" data-unique-id="b7d35d8f-756e-4944-adff-793c43cc401f" data-file-name="components/bulk-email-upload.tsx">
              <PackageCheck className="h-5 w-5 text-blue-500 mr-3" />
              <div data-unique-id="ba85c93c-115c-4c21-b0ca-2384285443c0" data-file-name="components/bulk-email-upload.tsx">
                <h4 className="font-medium text-blue-700" data-unique-id="a98275a3-67c4-4f8d-bc04-d79ad70efbc2" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="988067c0-ddc6-4827-9341-254d2feaa8ec" data-file-name="components/bulk-email-upload.tsx">Order Data Available</span></h4>
                <p className="text-sm text-blue-600" data-unique-id="d7965a65-0136-4985-974e-be46e3773b16" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="7a800ae3-0edb-44a2-9edc-56c8074ac6e8" data-file-name="components/bulk-email-upload.tsx">
                  Order data from the Order Processor is ready to be imported for email sending
                </span></p>
              </div>
            </div>
            
            <button onClick={importOrderData} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" data-unique-id="64785b52-f50f-46d7-96b6-639dd3cb712e" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="eef564c6-30bd-4d68-8107-6fa5c8e93f48" data-file-name="components/bulk-email-upload.tsx">
              Import Order Data
            </span></button>
          </div>
        </div>}
    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" data-unique-id="b03229ef-642f-4451-9fe2-6905e674200e" data-file-name="components/bulk-email-upload.tsx">
          <div className="bg-card p-5 border border-border rounded-md shadow-sm" data-unique-id="154e3dd8-284d-4f32-8358-ba7689a88138" data-file-name="components/bulk-email-upload.tsx">
            <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="fd1e3a8d-cde1-4741-bef3-1fcd40ea1ab7" data-file-name="components/bulk-email-upload.tsx">
              <Users className="mr-2 h-4 w-4 text-primary" />
              <span className="editable-text" data-unique-id="1603a125-a02b-4a5d-8e91-aef42451a330" data-file-name="components/bulk-email-upload.tsx">Select Saved Customers</span>
            </h3>
            
            <div className="flex flex-col space-y-4" data-unique-id="36d437be-ed8a-46d9-a93d-dbf392015aec" data-file-name="components/bulk-email-upload.tsx">
              <p className="text-sm" data-unique-id="afb68ff5-8c8e-4a3f-aa52-d73195de22f0" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {savedCustomers.length > 0 ? `You have ${savedCustomers.length} saved customers` : "No saved customers found. Add customers in the Customers tab."}
              </p>
              
              <button onClick={() => setShowCustomerSelector(true)} disabled={savedCustomers.length === 0} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50" data-unique-id="6deacfcc-b6f6-4d48-a4af-c27eefeafd21" data-file-name="components/bulk-email-upload.tsx">
                <PlusCircle className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="c9b4b373-b10e-4275-852d-d0a714930a57" data-file-name="components/bulk-email-upload.tsx">
                Select Customers
              </span></button>
            </div>
          </div>
          
          <div className="bg-card p-5 border border-border rounded-md shadow-sm" data-unique-id="0ababaff-44ec-4f04-a169-e791773b9c68" data-file-name="components/bulk-email-upload.tsx">
            <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="2fc29b98-d916-41c8-9224-ccb93fee8a2e" data-file-name="components/bulk-email-upload.tsx">
              <FileSpreadsheet className="mr-2 h-4 w-4 text-primary" />
              <span className="editable-text" data-unique-id="cf34bf1c-b11b-477a-aec4-ef606dec3971" data-file-name="components/bulk-email-upload.tsx">Customer Data Import</span>
            </h3>
            
            <div className="flex flex-col space-y-4" data-unique-id="4dcf3e0c-e0c6-45a0-abd3-5f49900cf367" data-file-name="components/bulk-email-upload.tsx">
              <input type="file" ref={fileInputRef} accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" id="excel-upload" data-unique-id="e3cc00a6-58a7-434b-ac0b-9e350c442f54" data-file-name="components/bulk-email-upload.tsx" />
              
              <div className="flex items-center space-x-2" data-unique-id="5111f0a1-e162-4219-8e38-ef50e1d5257f" data-file-name="components/bulk-email-upload.tsx">
                <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50" data-unique-id="a7bb697a-bcd1-4d90-9578-a6ab407474fd" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                  <Upload className="mr-2 h-4 w-4" />
                  {isUploading ? "Processing..." : "Upload Excel Sheet"}
                </button>
                
                <button onClick={() => {
                // Create a sample Excel workbook
                const wb = XLSX.utils.book_new();
                const wsData = [["name", "email", "orderNumber", "trackingNumber", "address", "orderDate", "items"], ["John Smith", "john@example.com", "ORD-12345678", "TRK-9876543210", "123 Main St, Detroit, MI 48201", "May 20, 2025", "2x Front Wheel Hub Bearing, 1x Control Arm"], ["Emily Johnson", "emily@example.com", "ORD-87654321", "TRK-1234567890", "456 Park Ave, Troy, MI 48083", "May 19, 2025", "1x Rear Wheel Hub Bearing, 2x Shock Absorbers"]];
                const ws = XLSX.utils.aoa_to_sheet(wsData);
                XLSX.utils.book_append_sheet(wb, ws, "Customers");

                // Generate and download the Excel file
                XLSX.writeFile(wb, "detroit-axle-customer-template.xlsx");
              }} className="text-primary underline text-sm hover:text-primary/90" data-unique-id="a35dad3b-42df-49d1-a355-42e9020713e1" data-file-name="components/bulk-email-upload.tsx">
                  <span className="editable-text" data-unique-id="da51ef19-5155-42f9-879e-b6bba1b0bcae" data-file-name="components/bulk-email-upload.tsx">Download Excel Template</span>
                </button>
              </div>
              
              <p className="text-xs text-muted-foreground" data-unique-id="298d704d-f0a4-4d5a-a74c-813daa5cc704" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="8166861a-d626-47b4-aed1-fee5ec9fa203" data-file-name="components/bulk-email-upload.tsx">Upload an Excel file (.xlsx or .xls) with customer information</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6" data-unique-id="defb0a6f-ee17-4c05-89aa-b76a58884c67" data-file-name="components/bulk-email-upload.tsx">
        <div className="flex justify-between items-center mb-3" data-unique-id="caf63162-1f43-406c-b702-9fb98fd19215" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium" data-unique-id="34320792-518d-4b0a-b636-6068f086a28c" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="ade3a60b-314f-4791-9b7e-7c168ac58394" data-file-name="components/bulk-email-upload.tsx">Customer Data</span></h3>
          <button onClick={addCustomer} className="text-sm text-primary hover:underline" data-unique-id="ac9e9059-39ad-4e12-baa9-efb1f6b7bd6d" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="1c94b365-989b-430a-86fe-a04ccefc4e20" data-file-name="components/bulk-email-upload.tsx">
            + Add Customer
          </span></button>
        </div>
        
        <div className="border border-border rounded-md overflow-hidden" data-unique-id="4fa0f2cb-7275-4ade-af02-351d2348fd8f" data-file-name="components/bulk-email-upload.tsx">
          <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="fc39ebe6-30ec-4494-9bcd-bf2014b5aa6a" data-file-name="components/bulk-email-upload.tsx">
            <div className="col-span-3" data-unique-id="e5f8013c-8632-4516-b948-3cbfb9938aa7" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="d070f259-064f-4c2e-8cab-6e7662bac391" data-file-name="components/bulk-email-upload.tsx">Name</span></div>
            <div className="col-span-3" data-unique-id="5159c886-7cae-4022-8cfa-809b21400696" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="83705c11-c247-42d2-bb6c-3ee1568dcebd" data-file-name="components/bulk-email-upload.tsx">Order Number</span></div>
            <div className="col-span-3" data-unique-id="fd2bd720-50c9-453a-89c8-89d8677f1fb6" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="f2a080b5-0325-441e-a074-c38a44281c5c" data-file-name="components/bulk-email-upload.tsx">Tracking Number</span></div>
            <div className="col-span-2" data-unique-id="3b73c118-2915-4a29-95fd-0bc9b6388b43" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="38abeb48-2a6e-4960-bedc-8582223f96f6" data-file-name="components/bulk-email-upload.tsx">Status</span></div>
            <div className="col-span-1" data-unique-id="e709842e-da81-4936-a26f-2023afd81921" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="7e2cc7ef-bc69-4bea-8800-d9d10cef04e2" data-file-name="components/bulk-email-upload.tsx">Actions</span></div>
          </div>
          
          <div className="max-h-64 overflow-y-auto" data-unique-id="1305622f-127a-4f7d-b7d8-00da6d5548c1" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {customers.map(customer => <div key={customer.id} className="grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm" data-unique-id="8b102daf-89ae-4088-9082-ec066343c3d9" data-file-name="components/bulk-email-upload.tsx">
                <div className="col-span-3" data-unique-id="38157209-eabd-47a9-aabf-7179cffb026b" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.name} onChange={e => updateCustomer(customer.id, "name", e.target.value)} placeholder="Customer Name" className="w-full p-1 border border-border rounded text-sm" data-unique-id="7e1f5ea5-065b-47b6-84ba-a070fe2687cb" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-3" data-unique-id="1af1fb73-b26e-41de-8af9-4913e376907e" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.orderNumber} onChange={e => updateCustomer(customer.id, "orderNumber", e.target.value)} placeholder="Order #" className="w-full p-1 border border-border rounded text-sm" data-unique-id="9a749300-4237-42ec-a087-3b9ec21e373b" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-3" data-unique-id="3b52ab51-6b6f-4b6b-98e1-d734f975c48b" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.trackingNumber} onChange={e => updateCustomer(customer.id, "trackingNumber", e.target.value)} placeholder="Tracking #" className="w-full p-1 border border-border rounded text-sm" data-unique-id="8fc50093-2932-454e-81c7-889450d982fd" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-2" data-unique-id="6f2ba3fe-cdc4-42fd-9763-d7a3cb039c01" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                  {sentStatus[customer.id] ? <span className="flex items-center text-green-600" data-unique-id="c5fbf22e-b5fb-4b88-9692-9b37eaddb2d2" data-file-name="components/bulk-email-upload.tsx">
                      <Check className="h-4 w-4 mr-1" />
                      <span data-unique-id="86b351ed-eae1-42b9-8166-9ac5d28a28c3" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="8e2ff9a9-488f-41f0-98f8-92d8ee12e669" data-file-name="components/bulk-email-upload.tsx">Sent</span></span>
                    </span> : failedEmails && failedEmails[customer.id] ? <span className="flex items-center text-red-600" title={failedEmails[customer.id]} data-unique-id="1048353c-5fee-437b-a760-887f0f0dee66" data-file-name="components/bulk-email-upload.tsx">
                      <X className="h-4 w-4 mr-1" />
                      <span data-unique-id="56d51390-f788-4733-8129-dc5da190cf1f" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="4faceaba-c27f-486e-a9a1-120cafdb22f8" data-file-name="components/bulk-email-upload.tsx">Failed</span></span>
                    </span> : <span className="text-muted-foreground" data-unique-id="7ff8af1f-69de-4fa5-a4ce-666ec57af87b" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="a75a6c7b-884a-49eb-bbdc-40847d18a61f" data-file-name="components/bulk-email-upload.tsx">
                      Pending
                    </span></span>}
                </div>
                <div className="col-span-1 flex justify-end" data-unique-id="d3d9bdf0-26f6-47e4-8c72-ddd58520cce8" data-file-name="components/bulk-email-upload.tsx">
                  <button onClick={() => removeCustomer(customer.id)} className="text-destructive hover:bg-destructive/10 p-1 rounded" data-unique-id="0d6349a7-6a54-4bfe-b67f-649a68274492" data-file-name="components/bulk-email-upload.tsx">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>)}
          </div>
        </div>
      </div>
      
      {/* Add modal component for manual email review */}
      <ManualEmailModal isOpen={showManualEmailModal} onClose={() => {
      setShowManualEmailModal(false);
      // This will keep the emails but close the modal view
      if (customers.length > 0 && currentEmailIndex < customers.length) {
        const newSentStatus = {
          ...sentStatus
        };
        customers.forEach(customer => {
          if (!newSentStatus[customer.id]) {
            newSentStatus[customer.id] = false;
          }
        });
        setSentStatus(newSentStatus);
      }
    }} currentEmail={getCurrentEmail()} currentEmailIndex={currentEmailIndex} totalEmails={customers.length} completionPercentage={getCompletionPercentage()} onPrevious={goToPrevEmail} onNext={goToNextEmail} onMarkAsSent={markAsSent} onOpenInEmailClient={openInEmailClient} isSent={customers.length > 0 && currentEmailIndex < customers.length ? !!sentStatus[customers[currentEmailIndex]?.id] : false} availableTemplates={emailTemplates} onSelectTemplate={selectTemplateForEmail} currentTemplateId={customers.length > 0 && currentEmailIndex < customers.length ? selectedTemplates[customers[currentEmailIndex]?.id] : undefined} />

      {/* Add a button to show the manual email interface when in manual mode */}
      {manualSendMode && customers.length > 0 && Object.keys(reviewedEmails).length > 0 && <div className="mb-6 p-4 border border-primary/20 rounded-md bg-accent/5" data-unique-id="da8e14ba-ad2f-4610-8f1f-6b00c06fa8eb" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center justify-between" data-unique-id="69fdc123-face-485e-95a7-f1f314febb51" data-file-name="components/bulk-email-upload.tsx">
            <div data-unique-id="88ca2b4e-8464-43dc-b9e5-fc9a018c4426" data-file-name="components/bulk-email-upload.tsx">
              <h3 className="font-medium flex items-center" data-unique-id="bc3dfe0c-3a25-47ba-a976-d4f673e73592" data-file-name="components/bulk-email-upload.tsx">
                <Eye className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="a50feda3-fc2d-45df-b04e-78f70684199b" data-file-name="components/bulk-email-upload.tsx">
                Email Preview & Manual Send
              </span></h3>
              <p className="text-sm text-muted-foreground mt-1" data-unique-id="c53d28f7-986b-44f3-94c1-697b1421cce2" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {getCompletionPercentage()}<span className="editable-text" data-unique-id="01137413-3a49-4751-95c1-20c1221c37bb" data-file-name="components/bulk-email-upload.tsx">% complete (</span>{Object.values(sentStatus).filter(Boolean).length}<span className="editable-text" data-unique-id="b9c08383-8643-45d5-8cd3-ebe76db8a9c4" data-file-name="components/bulk-email-upload.tsx"> of </span>{customers.length}<span className="editable-text" data-unique-id="5eec3ce5-074c-47f2-9eb0-879c5ee95f14" data-file-name="components/bulk-email-upload.tsx"> emails sent)
              </span></p>
            </div>
            <button onClick={() => {
          // Reset the modal to show again
          if (reviewedEmails && Object.keys(reviewedEmails).length) {
            // Find the first unsent email
            const unsent = customers.findIndex(c => !sentStatus[c.id]);
            if (unsent >= 0) {
              setCurrentEmailIndex(unsent);
            }
            setShowManualEmailModal(true);
          }
        }} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="bd3a312c-fb85-41d6-b3e7-6dee12ca8413" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="6b344861-0e7c-4036-bf1b-39f7c3a4d675" data-file-name="components/bulk-email-upload.tsx">
              Continue Sending Emails
            </span></button>
          </div>
          
          <div className="w-full bg-gray-200 h-2 mt-4 rounded-full" data-unique-id="05c7c1da-1fb2-4bab-a8c5-0d5ee1ed6def" data-file-name="components/bulk-email-upload.tsx">
            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{
          width: `${getCompletionPercentage()}%`
        }} data-unique-id="9ae46f20-cc11-4b59-9c03-992f31ff0afa" data-file-name="components/bulk-email-upload.tsx"></div>
          </div>
        </div>}
      
      {manualSendMode ? <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md" data-unique-id="2a0b0200-ee27-40fe-b844-f9302417a346" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="42a4717d-ade3-4198-beb6-b34da85dd0b8" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-amber-600" />
            <p className="text-amber-800 font-medium" data-unique-id="648d670c-63d3-4da2-ad62-e9676cc7a371" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="73105e3c-4515-46c3-82bf-da1c6ac3273e" data-file-name="components/bulk-email-upload.tsx">Manual Email Sending Mode</span></p>
          </div>
          <p className="mt-1 text-sm text-amber-700" data-unique-id="38de1c3b-dd4e-49f8-956e-1113bcb93331" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="82031637-4a4a-4a9c-9dda-5d17522d6d25" data-file-name="components/bulk-email-upload.tsx">
            You are in manual email sending mode. After clicking "Send Emails", you'll be guided through 
            reviewing each email. You can copy the content and send it using your own email client.
          </span></p>
          <p className="mt-1 text-sm text-amber-700" data-unique-id="601c8381-9427-4429-bb04-17e755e806e1" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="b16a0100-6414-4d0a-9f3f-3132708a5741" data-file-name="components/bulk-email-upload.tsx">
            Don't forget to mark emails as sent after you've sent them to keep track of your progress.
          </span></p>
        </div> : sendingError ? <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md" data-unique-id="df15e38d-1f90-417c-877d-cd0cd5198c2e" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="e96af541-d8ee-4347-b94e-6a0a71e38a8a" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
            <p className="text-red-800 font-medium" data-unique-id="3cc52666-137d-4176-8508-418cfaebbebc" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="2e43313c-2829-426c-a577-6416056fed55" data-file-name="components/bulk-email-upload.tsx">Error Sending Emails</span></p>
          </div>
          <p className="mt-1 text-sm text-red-700" data-unique-id="19a6b603-acd2-4ecb-9059-964f1e149fd7" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {sendingError}
          </p>
          <div className="mt-2 text-xs text-red-600" data-unique-id="6f60e5cf-4a9c-4cfb-8b62-0e323719de22" data-file-name="components/bulk-email-upload.tsx">
            <button className="underline" onClick={() => {
          setManualSendMode(true);
          alert("Switched to manual sending mode. You'll be able to send emails through your own email client.");
        }} data-unique-id="203fc8ba-f725-419f-9a60-345c511c3922" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="99d2e9ef-592a-43ac-a351-b33c425ea7b3" data-file-name="components/bulk-email-upload.tsx">
              Switch to manual sending mode
            </span></button>
            <span className="mx-2" data-unique-id="604c130f-03d5-4ecd-9861-a737ae3a6bf8" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="3745aad0-6f95-4855-97aa-321f230fcece" data-file-name="components/bulk-email-upload.tsx">•</span></span>
            <button className="underline" onClick={() => {
          const debugInfo = {
            senderInfo: {
              name: senderName,
              email: senderEmail
            },
            apiEndpoint: '/api/send-email',
            error: sendingError,
            customerCount: customers.length,
            timestamp: new Date().toISOString()
          };
          alert("Debug Info: " + JSON.stringify(debugInfo, null, 2));
        }} data-unique-id="81dab3a5-dad9-439d-924e-14603ada42cc" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="8a081306-3054-48c1-9901-17afff3e6927" data-file-name="components/bulk-email-upload.tsx">
              Show Debug Info
            </span></button>
          </div>
        </div> : <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md" data-unique-id="85dc106b-53dc-4165-bfc6-6531dbe10caa" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="23c1b7b6-08e8-4d60-a661-ddf99d4962c2" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
            <p className="text-blue-800 font-medium" data-unique-id="f87bac05-1dd4-461b-8819-3fef5f493ed8" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
              {isEmailServiceAvailable ? "Email Sending Enabled" : "Email Service Not Configured"}
            </p>
          </div>
          <p className="mt-1 text-sm text-blue-700" data-unique-id="82a7d56d-0dbd-457b-9007-776415eaebf9" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {isEmailServiceAvailable ? "This application is now connected to a real email service. Emails will be sent to the customer email addresses provided. Please ensure all email addresses are valid and have opted in to receive communications." : "The email service is not configured properly. You can use manual mode to send emails through your own email client."}
          </p>
        </div>}
      
      {sendingProgress > 0 && sendingProgress < 100 && <div className="mb-4" data-unique-id="7b55d32a-46d5-4494-863f-7ece657711af" data-file-name="components/bulk-email-upload.tsx">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden" data-unique-id="86a26b18-2ffb-4e92-8544-82cd41e50de2" data-file-name="components/bulk-email-upload.tsx">
            <div className="h-full bg-primary transition-all duration-300 ease-out" style={{
          width: `${sendingProgress}%`
        }} data-unique-id="6580b770-9947-4e6f-afaa-04e698bfe6a8" data-file-name="components/bulk-email-upload.tsx"></div>
          </div>
          <p className="text-xs text-right mt-1 text-gray-500" data-unique-id="ec968e1a-cb08-480d-a856-adebb71acc2b" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="895a37f8-2431-4d8c-b2e4-29a8cf328efb" data-file-name="components/bulk-email-upload.tsx">Sending email: </span>{sendingProgress}<span className="editable-text" data-unique-id="cc875024-d161-4235-b04e-d2262827fffc" data-file-name="components/bulk-email-upload.tsx">% complete</span></p>
        </div>}
      
      <div className="flex items-center justify-between" data-unique-id="cad0b08b-aaa4-4556-ab32-215f34b78036" data-file-name="components/bulk-email-upload.tsx">
        <div className="flex items-center text-sm text-muted-foreground" data-unique-id="b0f405d4-7c70-4ac7-a0a7-ec7c23972da1" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
          <AlertCircle className="h-4 w-4 mr-1" />
          {customers.length}<span className="editable-text" data-unique-id="ac3dccd5-8206-4325-b203-6d083a4f79ef" data-file-name="components/bulk-email-upload.tsx"> customers loaded
        </span></div>
        
        <button onClick={sendEmails} disabled={isSending || customers.length === 0} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50" data-unique-id="8ac6fb41-23ca-4507-89c2-5f6bebc58248" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
          {isSending ? <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              {manualSendMode ? "Preparing..." : "Sending..."}
            </> : <>
              <Send className="mr-2 h-4 w-4" />
              {manualSendMode ? "Review & Send Manually" : "Send Emails"}
            </>}
        </button>
      </div>
      
      {/* Customer selector modal */}
      {showCustomerSelector && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => {
      setShowCustomerSelector(false);
      setSelectedCustomerIds([]);
    }} data-unique-id="04da2cfa-40bb-46e0-838f-6cd795c11111" data-file-name="components/bulk-email-upload.tsx">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()} data-unique-id="853812eb-fc3f-410b-82a4-490c347b8839" data-file-name="components/bulk-email-upload.tsx">
            <div className="flex justify-between items-center border-b border-border p-4" data-unique-id="14a22619-1614-4b09-8620-61b23085871e" data-file-name="components/bulk-email-upload.tsx">
              <h3 className="font-medium text-lg" data-unique-id="53e53aca-a5f9-4571-9956-217efb40a8ee" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="3106948c-16a7-4ec7-a587-bdbe65011abb" data-file-name="components/bulk-email-upload.tsx">Select Customers</span></h3>
              <button onClick={() => {
            setShowCustomerSelector(false);
            setSelectedCustomerIds([]);
          }} className="p-1 rounded-full hover:bg-accent/20" data-unique-id="43fb76be-ea0b-4be1-8643-f63c50020296" data-file-name="components/bulk-email-upload.tsx">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto" data-unique-id="7e60650f-c5b3-4133-b6c4-c02922f16790" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
              {savedCustomers.length === 0 ? <div className="text-center py-8 text-muted-foreground" data-unique-id="547b712b-ce93-4530-a3af-be91bf03745a" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="f36a91c8-539e-4d5b-962f-4a3b55125c57" data-file-name="components/bulk-email-upload.tsx">
                  No saved customers found. Add customers in the Customers tab.
                </span></div> : <div data-unique-id="4a8cf0e2-bc63-4cb1-b06b-b835c9fed870" data-file-name="components/bulk-email-upload.tsx">
                  <div className="mb-4 flex justify-between items-center" data-unique-id="3764b423-f918-41f9-82a5-9c78c56005a5" data-file-name="components/bulk-email-upload.tsx">
                    <div className="text-sm text-muted-foreground" data-unique-id="8b0b335f-e480-4d15-afe9-16f29ce8fe8e" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                      {selectedCustomerIds.length}<span className="editable-text" data-unique-id="da157f0e-7dde-4e97-bb3c-504a82f47f44" data-file-name="components/bulk-email-upload.tsx"> of </span>{savedCustomers.length}<span className="editable-text" data-unique-id="73c9f4f4-d5fd-48d7-a4ad-c9a7c1de7e39" data-file-name="components/bulk-email-upload.tsx"> customers selected
                    </span></div>
                    <button onClick={() => setSelectedCustomerIds(savedCustomers.map(c => c.id))} className="text-sm text-primary" data-unique-id="44c57861-34c0-4005-a6e9-25f2bf306f10" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="360a8574-daed-484c-b98b-812bce3b5eeb" data-file-name="components/bulk-email-upload.tsx">
                      Select All
                    </span></button>
                  </div>
                  
                  <div className="border border-border rounded-md overflow-hidden" data-unique-id="1f455f44-0266-4b2f-9043-efdeb9b89853" data-file-name="components/bulk-email-upload.tsx">
                    <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="362fff7b-bc9c-4aba-88fb-0180456c937c" data-file-name="components/bulk-email-upload.tsx">
                      <div className="col-span-1" data-unique-id="6ace7dc4-cfd3-40eb-b17b-22e5a7e13fa4" data-file-name="components/bulk-email-upload.tsx"></div>
                      <div className="col-span-4" data-unique-id="a5da0072-5597-4de3-9297-fdbbbb65a6a5" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="8b049003-196a-4246-ac68-3dc762073e66" data-file-name="components/bulk-email-upload.tsx">Name</span></div>
                      <div className="col-span-4" data-unique-id="0ae66539-360c-46a6-a7b4-4867f6ca0daa" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="23f09aa9-c530-462e-8ec5-c8499fb04199" data-file-name="components/bulk-email-upload.tsx">Email</span></div>
                      <div className="col-span-3" data-unique-id="0777ce77-c010-41e8-b708-45c6b3621894" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="b98b073b-e4d5-41fa-8f78-0f3f7f6fad02" data-file-name="components/bulk-email-upload.tsx">Company</span></div>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto" data-unique-id="473b291a-c4c9-4970-a82d-641a0eec3c4b" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                      {savedCustomers.map(customer => <div key={customer.id} onClick={() => toggleCustomerSelection(customer.id)} className={`grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm cursor-pointer ${selectedCustomerIds.includes(customer.id) ? 'bg-accent/20' : 'hover:bg-accent/5'}`} data-unique-id="a92cc948-6813-4758-9f9b-c400a38909b7" data-file-name="components/bulk-email-upload.tsx">
                          <div className="col-span-1" data-unique-id="f5c539ef-fbce-4ce3-92a5-a817d108798c" data-file-name="components/bulk-email-upload.tsx">
                            <input type="checkbox" checked={selectedCustomerIds.includes(customer.id)} onChange={e => {
                      e.stopPropagation();
                      toggleCustomerSelection(customer.id);
                    }} className="rounded border-gray-300" data-unique-id="a7f8b5fb-3ebf-42ae-ae32-9ec621e3ef0f" data-file-name="components/bulk-email-upload.tsx" />
                          </div>
                          <div className="col-span-4 truncate" data-unique-id="b9354d5b-beed-4d9b-b0af-7c96035aecc2" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.name}</div>
                          <div className="col-span-4 truncate" data-unique-id="57bf7243-7291-410e-baf7-00f3fcea7e79" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.email}</div>
                          <div className="col-span-3 truncate" data-unique-id="6d8bca86-8c3a-488b-910c-0355cb4f4319" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.company || '—'}</div>
                        </div>)}
                    </div>
                  </div>
                </div>}
            </div>
            
            <div className="border-t border-border p-4 flex justify-end space-x-2" data-unique-id="5dca061e-b3eb-47c0-8867-c294df233bf7" data-file-name="components/bulk-email-upload.tsx">
              <button onClick={() => {
            setShowCustomerSelector(false);
            setSelectedCustomerIds([]);
          }} className="px-4 py-2 border border-border rounded-md hover:bg-accent/10" data-unique-id="d2ce97d7-c543-4b34-a618-eb1ba037f0d9" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="6fab6d75-abfe-4ae2-8308-7108137ae705" data-file-name="components/bulk-email-upload.tsx">
                Cancel
              </span></button>
              <button onClick={addSelectedCustomersToEmailList} disabled={selectedCustomerIds.length === 0} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50" data-unique-id="e767b549-faa4-4da9-9fa7-bf9b652dab5a" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="d8dc1ae3-aafb-4b50-897e-243dcdfc360f" data-file-name="components/bulk-email-upload.tsx">
                Add </span>{selectedCustomerIds.length}<span className="editable-text" data-unique-id="1b0d0811-bd73-4a82-b520-f3e598613fe6" data-file-name="components/bulk-email-upload.tsx"> Customers
              </span></button>
            </div>
          </div>
        </div>}
    </motion.div>;
}