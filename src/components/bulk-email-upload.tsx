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
  }} className="bg-card rounded-lg shadow-md p-6" data-unique-id="75bdfe5f-c878-4c5a-82ee-5cea06290da9" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
      <div className="mb-6" data-unique-id="2c229596-5c05-4592-bb97-6409f23bef27" data-file-name="components/bulk-email-upload.tsx">
        <h2 className="text-xl font-medium mb-2" data-unique-id="2f134e72-6f34-46c3-ab02-b19b82ebffb1" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="1084b119-c922-40ed-a15c-825e9f55aa7a" data-file-name="components/bulk-email-upload.tsx">Bulk Email Sender</span></h2>
        <p className="text-muted-foreground" data-unique-id="338c8060-8782-456b-9fa1-5aa1597e5f13" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="a232838b-835e-439b-9e7d-cf857abdb772" data-file-name="components/bulk-email-upload.tsx">
          Upload customer data or select saved customers to send bulk emails
        </span></p>
      </div>
      
      {/* Sending mode selector */}
      <div className="mb-6" data-unique-id="c2fc456f-dbf2-4e27-a862-c771daf1917b" data-file-name="components/bulk-email-upload.tsx">
        <div className="bg-card p-5 border border-border rounded-md shadow-sm" data-unique-id="fb5e61e5-dcb6-4113-aaf5-745137a94b84" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium mb-4 text-base flex items-center" data-unique-id="0dddd611-f04d-4618-a4ee-97eed5829b6b" data-file-name="components/bulk-email-upload.tsx">
            <Mail className="mr-2 h-5 w-5 text-primary" /><span className="editable-text" data-unique-id="6d910422-bfe5-4d64-a5c1-6f2dd557b0df" data-file-name="components/bulk-email-upload.tsx">
            Email Sending Method
          </span></h3>
          
          <div className="grid grid-cols-2 gap-4" data-unique-id="6e0a01ba-0060-42ab-bef3-6c6de8a4e026" data-file-name="components/bulk-email-upload.tsx">
            <button onClick={() => setManualSendMode(false)} disabled={!isEmailServiceAvailable} className={`p-4 rounded-md border ${!manualSendMode ? 'border-primary bg-primary/5' : 'border-border'} flex flex-col items-center text-center transition-all ${!isEmailServiceAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}`} data-unique-id="5c4f8ffd-c358-416f-aaa2-183b064eaf3c" data-file-name="components/bulk-email-upload.tsx">
              <Send className="h-8 w-8 text-primary mb-2" />
              <div className="font-medium mb-1" data-unique-id="6f492eac-0efc-4ab3-b6d3-f66a413b3da0" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="e7768a09-a6b0-4b26-819e-58e298ab480e" data-file-name="components/bulk-email-upload.tsx">Automated Sending</span></div>
              <div className="text-xs text-muted-foreground" data-unique-id="01743e44-5dea-496c-a399-28c7df5da9c0" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {isEmailServiceAvailable ? "Emails will be sent automatically via the system" : "Email service not configured"}
              </div>
            </button>
            
            <button onClick={() => setManualSendMode(true)} className={`p-4 rounded-md border ${manualSendMode ? 'border-primary bg-primary/5' : 'border-border'} flex flex-col items-center text-center transition-all hover:border-primary/50`} data-unique-id="c8eaf1e7-ea4a-4099-be4a-eafc043e02c8" data-file-name="components/bulk-email-upload.tsx">
              <ExternalLink className="h-8 w-8 text-primary mb-2" />
              <div className="font-medium mb-1" data-unique-id="79339a29-08bd-4e69-b54d-49b7bea76843" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="fce8d885-0944-4a70-ba0d-c900a9d14bee" data-file-name="components/bulk-email-upload.tsx">Manual Sending</span></div>
              <div className="text-xs text-muted-foreground" data-unique-id="a5e832e0-087d-4e78-8ed1-f904808bbb6b" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="769bb71b-8b86-492d-bca2-cf2053257a11" data-file-name="components/bulk-email-upload.tsx">
                Review and send emails through your own email client
              </span></div>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 space-y-4" data-unique-id="71dfd99f-7434-4415-b393-d9c2cc854ea1" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
        <div className="bg-card p-5 border border-border rounded-md shadow-sm" data-unique-id="f2b91aef-78e4-4436-8ba6-7e71a51b8b93" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="b7fb77b5-a317-4279-9496-373c1d5a24fc" data-file-name="components/bulk-email-upload.tsx">
            <UserRound className="mr-2 h-4 w-4 text-primary" />
            <span className="editable-text" data-unique-id="d9302096-e4ff-41da-b171-1d30833b82d9" data-file-name="components/bulk-email-upload.tsx">Employee Sender Information</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2" data-unique-id="f72876b3-5c4c-4ea7-8a17-5f91afb15277" data-file-name="components/bulk-email-upload.tsx">
            <div data-unique-id="12339542-2db0-47d9-9f44-41c050d2fb6d" data-file-name="components/bulk-email-upload.tsx">
              <label htmlFor="senderName" className="block text-sm font-medium mb-1" data-unique-id="61c5bd22-d2fc-469a-a7a7-e6ea1f702e72" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="c36cca37-9d95-4ce4-b1ec-788111624033" data-file-name="components/bulk-email-upload.tsx">Employee Name</span>
              </label>
              <input id="senderName" type="text" value={senderName} onChange={e => {
              setSenderName(e.target.value);
              setTimeout(() => handleSenderInfoChange(), 0); // Ensure state is updated before callback
            }} placeholder="John Smith" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="646631c2-8f8c-4d50-9b79-5b72d3954f75" data-file-name="components/bulk-email-upload.tsx" />
            </div>
            
            <div data-unique-id="2bc2fbce-3574-48bc-ac06-cdc801cb4013" data-file-name="components/bulk-email-upload.tsx">
              <label htmlFor="senderEmail" className="block text-sm font-medium mb-1" data-unique-id="c46cb8a2-f2e6-45fb-b761-3d6898f22ce4" data-file-name="components/bulk-email-upload.tsx">
                <Mail className="inline-block h-3 w-3 mr-1 text-muted-foreground" />
                <span className="editable-text" data-unique-id="7ce29304-7c0c-47d5-bbd5-81c0a2f182c5" data-file-name="components/bulk-email-upload.tsx">Employee Email</span>
              </label>
              <input id="senderEmail" type="email" value={senderEmail} onChange={e => {
              setSenderEmail(e.target.value);
              setTimeout(() => handleSenderInfoChange(), 0); // Ensure state is updated before callback
            }} placeholder="employee@detroitaxle.com" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="550a7ba2-79f3-4a07-ac2b-c6e7df5b4c6c" data-file-name="components/bulk-email-upload.tsx" />
              <p className="text-xs text-muted-foreground mt-1" data-unique-id="bd58c8f2-ec15-4403-8873-c5b8f05ff54c" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="ce983952-9eda-4e7f-8e08-c03252180d75" data-file-name="components/bulk-email-upload.tsx">This employee will appear as the sender of all emails</span>
              </p>
            </div>
          </div>
        </div>
        
      {/* Import Order Data Alert - Show when order data is available */}
      {hasOrderData && <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md animate-pulse" data-unique-id="b12a8688-dba6-436b-84ec-0a8ceeba0a46" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center justify-between" data-unique-id="7def083e-732d-40f5-b796-b41839bbfdf3" data-file-name="components/bulk-email-upload.tsx">
            <div className="flex items-center" data-unique-id="307090b3-f900-437c-ae27-a0a0a133797f" data-file-name="components/bulk-email-upload.tsx">
              <PackageCheck className="h-5 w-5 text-blue-500 mr-3" />
              <div data-unique-id="eadf4f53-58ad-40c9-87a2-e252b4a5fc2a" data-file-name="components/bulk-email-upload.tsx">
                <h4 className="font-medium text-blue-700" data-unique-id="217fc898-46f9-441e-afd7-8765f956bafe" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="a06b9bda-ce73-44a6-83a7-61dc7540ab0d" data-file-name="components/bulk-email-upload.tsx">Order Data Available</span></h4>
                <p className="text-sm text-blue-600" data-unique-id="df5e04bb-f039-4c14-a2dc-24af9f9d96ba" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="1e219a97-1b4d-487a-851c-b3a7f080a329" data-file-name="components/bulk-email-upload.tsx">
                  Order data from the Order Processor is ready to be imported for email sending
                </span></p>
              </div>
            </div>
            
            <button onClick={importOrderData} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" data-unique-id="3a04c3ea-195b-4803-ada8-609202a18cc2" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="4968fb98-c966-4de8-a695-2872aac9ada7" data-file-name="components/bulk-email-upload.tsx">
              Import Order Data
            </span></button>
          </div>
        </div>}
    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" data-unique-id="2cad9b6f-af38-48c9-954f-f24349fc94f9" data-file-name="components/bulk-email-upload.tsx">
          <div className="bg-card p-5 border border-border rounded-md shadow-sm" data-unique-id="69679943-6d77-4d17-b8ce-39514dfa9c69" data-file-name="components/bulk-email-upload.tsx">
            <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="d1503e20-3e6b-4329-af09-ddd9e80bbc17" data-file-name="components/bulk-email-upload.tsx">
              <Users className="mr-2 h-4 w-4 text-primary" />
              <span className="editable-text" data-unique-id="ead6d066-5f6d-4050-a61e-e8fc71426a67" data-file-name="components/bulk-email-upload.tsx">Select Saved Customers</span>
            </h3>
            
            <div className="flex flex-col space-y-4" data-unique-id="6c9be0ea-07a5-4a26-ad49-2525022e563a" data-file-name="components/bulk-email-upload.tsx">
              <p className="text-sm" data-unique-id="b4dcd461-5f64-4266-a5c7-49df5e429ac9" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {savedCustomers.length > 0 ? `You have ${savedCustomers.length} saved customers` : "No saved customers found. Add customers in the Customers tab."}
              </p>
              
              <button onClick={() => setShowCustomerSelector(true)} disabled={savedCustomers.length === 0} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50" data-unique-id="86f0ce5f-51b6-4285-a0ed-9b661e132b5a" data-file-name="components/bulk-email-upload.tsx">
                <PlusCircle className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="ccccb960-e662-4bba-ace3-152a6576c798" data-file-name="components/bulk-email-upload.tsx">
                Select Customers
              </span></button>
            </div>
          </div>
          
          <div className="bg-card p-5 border border-border rounded-md shadow-sm" data-unique-id="d323201d-3170-48cc-8646-4b71c2ade9b1" data-file-name="components/bulk-email-upload.tsx">
            <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="9f086b77-0bb7-438f-88f5-a7e2908252c3" data-file-name="components/bulk-email-upload.tsx">
              <FileSpreadsheet className="mr-2 h-4 w-4 text-primary" />
              <span className="editable-text" data-unique-id="33b2b6fc-3dca-4161-82be-115b40ce0892" data-file-name="components/bulk-email-upload.tsx">Customer Data Import</span>
            </h3>
            
            <div className="flex flex-col space-y-4" data-unique-id="e2b2ef35-ffe4-48d6-bcd2-1aab5b3f42d7" data-file-name="components/bulk-email-upload.tsx">
              <input type="file" ref={fileInputRef} accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" id="excel-upload" data-unique-id="a7f411b1-ab7f-402d-8d73-4a39a06cb7f6" data-file-name="components/bulk-email-upload.tsx" />
              
              <div className="flex items-center space-x-2" data-unique-id="c04182b1-f67b-4dc8-b74e-ff96cb1122ae" data-file-name="components/bulk-email-upload.tsx">
                <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50" data-unique-id="5141e4a7-4053-46f4-9332-efd37720b7e5" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
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
              }} className="text-primary underline text-sm hover:text-primary/90" data-unique-id="b397d7ff-b771-44e6-8c8f-80b9d88add61" data-file-name="components/bulk-email-upload.tsx">
                  <span className="editable-text" data-unique-id="9fda07c8-e756-4266-84dc-b4f7822d1609" data-file-name="components/bulk-email-upload.tsx">Download Excel Template</span>
                </button>
              </div>
              
              <p className="text-xs text-muted-foreground" data-unique-id="3cae0829-74e1-47ef-8b6d-2796d4eee6c7" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="0f739a43-29ba-4416-88c9-dda6cd996841" data-file-name="components/bulk-email-upload.tsx">Upload an Excel file (.xlsx or .xls) with customer information</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6" data-unique-id="2539668e-b149-436f-ad40-4702b240b503" data-file-name="components/bulk-email-upload.tsx">
        <div className="flex justify-between items-center mb-3" data-unique-id="9c951c69-6375-40b0-82cb-018b989745ec" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium" data-unique-id="b706b3dc-2eec-41ce-829c-b4db6b7f256a" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="40380b2e-559c-4483-8dbf-8a9535c7ccce" data-file-name="components/bulk-email-upload.tsx">Customer Data</span></h3>
          <button onClick={addCustomer} className="text-sm text-primary hover:underline" data-unique-id="40f7d674-464b-4118-8ee2-483c0cddcf56" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="02a2bd96-cd21-49f5-8538-5406ecf4a1a9" data-file-name="components/bulk-email-upload.tsx">
            + Add Customer
          </span></button>
        </div>
        
        <div className="border border-border rounded-md overflow-hidden" data-unique-id="df3072da-029f-4518-93fd-297d978719ef" data-file-name="components/bulk-email-upload.tsx">
          <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="0ffc65e0-d426-4aaf-85bc-9e63b75c8f5b" data-file-name="components/bulk-email-upload.tsx">
            <div className="col-span-3" data-unique-id="72a8a247-0e6f-4347-b21b-1a1924a2da0e" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="c804bf6d-9f49-4571-b689-a9bfe5afa691" data-file-name="components/bulk-email-upload.tsx">Name</span></div>
            <div className="col-span-3" data-unique-id="2c1cf002-c12b-48b5-9d63-72ac5ea2abe2" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="562d28a0-46a2-40ad-9ccf-012ee0350947" data-file-name="components/bulk-email-upload.tsx">Order Number</span></div>
            <div className="col-span-3" data-unique-id="c5133baa-22d4-497f-8191-a512654f408e" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="f3dc8a1a-406f-418f-8e0a-fbd8ba1772db" data-file-name="components/bulk-email-upload.tsx">Tracking Number</span></div>
            <div className="col-span-2" data-unique-id="18c68949-0458-4d58-aa34-b541feb0f3fc" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="a9faed86-cf39-4aed-9fa9-6fbbfef8d8d5" data-file-name="components/bulk-email-upload.tsx">Status</span></div>
            <div className="col-span-1" data-unique-id="65ae8d96-41fe-4fcd-95c6-5aeb92f4be72" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="8e5db56a-09d5-4daa-97ae-61f0b81e726d" data-file-name="components/bulk-email-upload.tsx">Actions</span></div>
          </div>
          
          <div className="max-h-64 overflow-y-auto" data-unique-id="16d9f639-f59a-43bb-8e29-29d775a54983" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {customers.map(customer => <div key={customer.id} className="grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm" data-unique-id="7b4c588d-cd8a-4bc8-9d4d-c01df981bbba" data-file-name="components/bulk-email-upload.tsx">
                <div className="col-span-3" data-unique-id="c132b68b-a965-4c81-b81a-4a03e453d909" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.name} onChange={e => updateCustomer(customer.id, "name", e.target.value)} placeholder="Customer Name" className="w-full p-1 border border-border rounded text-sm" data-unique-id="d1fe36c3-fa03-4401-ae9f-fd3aa16a20e3" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-3" data-unique-id="cbd2533c-a428-4c85-87d9-96b3987ac3f7" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.orderNumber} onChange={e => updateCustomer(customer.id, "orderNumber", e.target.value)} placeholder="Order #" className="w-full p-1 border border-border rounded text-sm" data-unique-id="e645f4e4-5af2-4d6c-b3f3-7a6b4f7db031" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-3" data-unique-id="009f3aaf-e857-4f27-8ba0-6a04b186a854" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.trackingNumber} onChange={e => updateCustomer(customer.id, "trackingNumber", e.target.value)} placeholder="Tracking #" className="w-full p-1 border border-border rounded text-sm" data-unique-id="3b79eeee-ae5d-431b-b75c-97051f8b77f1" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-2" data-unique-id="05e8dad7-dc7f-450d-ba41-8fe71596fec9" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                  {sentStatus[customer.id] ? <span className="flex items-center text-green-600" data-unique-id="8e471a79-a80b-4ab8-934e-2b91173453c2" data-file-name="components/bulk-email-upload.tsx">
                      <Check className="h-4 w-4 mr-1" />
                      <span data-unique-id="9ea10a65-75ac-461e-a99b-a1853e3c6afc" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="48210a9e-e500-4a8b-ba30-3519b7436dae" data-file-name="components/bulk-email-upload.tsx">Sent</span></span>
                    </span> : failedEmails && failedEmails[customer.id] ? <span className="flex items-center text-red-600" title={failedEmails[customer.id]} data-unique-id="3a2ceea8-c856-4781-9652-db8c45e37dc1" data-file-name="components/bulk-email-upload.tsx">
                      <X className="h-4 w-4 mr-1" />
                      <span data-unique-id="f278fc14-4639-4835-8114-2079243cd2f5" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="4153f64d-f1de-40eb-adfe-2e8de4ff0032" data-file-name="components/bulk-email-upload.tsx">Failed</span></span>
                    </span> : <span className="text-muted-foreground" data-unique-id="0c02ca47-c631-4d63-9da4-f96c1110c462" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="853bf92b-5a77-4592-85ef-7436b1edfedd" data-file-name="components/bulk-email-upload.tsx">
                      Pending
                    </span></span>}
                </div>
                <div className="col-span-1 flex justify-end" data-unique-id="f6440a67-75f9-4a6f-ac34-04560aaa1157" data-file-name="components/bulk-email-upload.tsx">
                  <button onClick={() => removeCustomer(customer.id)} className="text-destructive hover:bg-destructive/10 p-1 rounded" data-unique-id="3e6a27fe-063d-43a6-ae15-8d2d3330b4bd" data-file-name="components/bulk-email-upload.tsx">
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
      {manualSendMode && customers.length > 0 && Object.keys(reviewedEmails).length > 0 && <div className="mb-6 p-4 border border-primary/20 rounded-md bg-accent/5" data-unique-id="c43af606-2562-4289-8883-d5c509fc6b39" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center justify-between" data-unique-id="e84b2ba5-ec8c-4abe-98e8-a48a4f3b62aa" data-file-name="components/bulk-email-upload.tsx">
            <div data-unique-id="bd7be573-b892-4cb8-b885-b33c5f55b06c" data-file-name="components/bulk-email-upload.tsx">
              <h3 className="font-medium flex items-center" data-unique-id="3c81284d-e856-460c-9323-37bfa2febaa0" data-file-name="components/bulk-email-upload.tsx">
                <Eye className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="c4ee6280-924b-47cf-929f-e5a8976e38e7" data-file-name="components/bulk-email-upload.tsx">
                Email Preview & Manual Send
              </span></h3>
              <p className="text-sm text-muted-foreground mt-1" data-unique-id="892ec4b5-5ef0-401b-8f53-0853fea38f3d" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {getCompletionPercentage()}<span className="editable-text" data-unique-id="e7d9ba95-cbe2-45c9-ab61-4dfe1ce20cb6" data-file-name="components/bulk-email-upload.tsx">% complete (</span>{Object.values(sentStatus).filter(Boolean).length}<span className="editable-text" data-unique-id="f50a27ee-e967-46af-abb2-d0f4beebd275" data-file-name="components/bulk-email-upload.tsx"> of </span>{customers.length}<span className="editable-text" data-unique-id="bf0e5fb8-b567-446f-a366-62d7fe63d0af" data-file-name="components/bulk-email-upload.tsx"> emails sent)
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
        }} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="cd51ea7e-0f22-4b5e-ad60-3fd6fae52875" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="d164f3e7-0b7e-49dc-8875-e3467badf0c4" data-file-name="components/bulk-email-upload.tsx">
              Continue Sending Emails
            </span></button>
          </div>
          
          <div className="w-full bg-gray-200 h-2 mt-4 rounded-full" data-unique-id="138f9a6c-50c6-4436-9ce0-7f750dedfafc" data-file-name="components/bulk-email-upload.tsx">
            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{
          width: `${getCompletionPercentage()}%`
        }} data-unique-id="a7351498-d2ca-4d7c-a47d-296fb9277df1" data-file-name="components/bulk-email-upload.tsx"></div>
          </div>
        </div>}
      
      {manualSendMode ? <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md" data-unique-id="120f643a-6853-41ae-8372-1e559177f930" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="093aede7-ae87-444b-9109-093ec9ab3fc2" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-amber-600" />
            <p className="text-amber-800 font-medium" data-unique-id="652724e9-f58e-4ca6-9bef-b2ede989e831" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="ab215c9a-c405-4321-9ce6-d251e388bf3d" data-file-name="components/bulk-email-upload.tsx">Manual Email Sending Mode</span></p>
          </div>
          <p className="mt-1 text-sm text-amber-700" data-unique-id="797b68be-3a85-465a-9f32-205c15a16acb" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="ff9f3c35-a771-46ee-9bea-152583a14da4" data-file-name="components/bulk-email-upload.tsx">
            You are in manual email sending mode. After clicking "Send Emails", you'll be guided through 
            reviewing each email. You can copy the content and send it using your own email client.
          </span></p>
          <p className="mt-1 text-sm text-amber-700" data-unique-id="e6f44667-63c7-439e-b9ef-68367086b536" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="ab1313fb-3549-4c8a-bf7e-2370dd1f86f8" data-file-name="components/bulk-email-upload.tsx">
            Don't forget to mark emails as sent after you've sent them to keep track of your progress.
          </span></p>
        </div> : sendingError ? <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md" data-unique-id="033fed09-5edd-42d2-a608-fe67be055276" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="91ace33c-3f10-4b0a-8e77-fe607d86ab3c" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
            <p className="text-red-800 font-medium" data-unique-id="418304c6-6055-4a91-9ab0-94449d9dff66" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="14cb6a67-de32-447b-9107-f215499b7094" data-file-name="components/bulk-email-upload.tsx">Error Sending Emails</span></p>
          </div>
          <p className="mt-1 text-sm text-red-700" data-unique-id="06441d0a-8124-4c51-a107-a6c17a627232" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {sendingError}
          </p>
          <div className="mt-2 text-xs text-red-600" data-unique-id="ec6f37b2-1484-4dc4-a2f5-80fc44c7fbd8" data-file-name="components/bulk-email-upload.tsx">
            <button className="underline" onClick={() => {
          setManualSendMode(true);
          alert("Switched to manual sending mode. You'll be able to send emails through your own email client.");
        }} data-unique-id="09ef79fd-09dd-42d7-a622-93c8f4db5224" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="2bc5059e-8cb3-4cc0-852e-b3be7d4bb823" data-file-name="components/bulk-email-upload.tsx">
              Switch to manual sending mode
            </span></button>
            <span className="mx-2" data-unique-id="25ca2450-6b29-4983-94e2-8d6331224ccf" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="997d4722-81e3-4815-a5ad-136554ac18d7" data-file-name="components/bulk-email-upload.tsx">•</span></span>
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
        }} data-unique-id="07eb0365-5d6d-47c8-96ab-4b221970ede9" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="df8f7cac-577d-4ff7-a82d-c257f03e1aac" data-file-name="components/bulk-email-upload.tsx">
              Show Debug Info
            </span></button>
          </div>
        </div> : <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md" data-unique-id="d9667565-c856-4708-8246-c096ce7dfb79" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="93cfb0ff-230c-447b-82e9-8311641ace78" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
            <p className="text-blue-800 font-medium" data-unique-id="f8bb0d0f-6f30-477b-8740-641b82103ae8" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
              {isEmailServiceAvailable ? "Email Sending Enabled" : "Email Service Not Configured"}
            </p>
          </div>
          <p className="mt-1 text-sm text-blue-700" data-unique-id="88dc26f7-6594-4aff-ac41-613798c80d98" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {isEmailServiceAvailable ? "This application is now connected to a real email service. Emails will be sent to the customer email addresses provided. Please ensure all email addresses are valid and have opted in to receive communications." : "The email service is not configured properly. You can use manual mode to send emails through your own email client."}
          </p>
        </div>}
      
      {sendingProgress > 0 && sendingProgress < 100 && <div className="mb-4" data-unique-id="9dc01dbc-9702-4ae7-b9b6-820d185f24d8" data-file-name="components/bulk-email-upload.tsx">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden" data-unique-id="3fe59c12-f17e-455c-8529-81d52a3a382a" data-file-name="components/bulk-email-upload.tsx">
            <div className="h-full bg-primary transition-all duration-300 ease-out" style={{
          width: `${sendingProgress}%`
        }} data-unique-id="fd6cf947-24c3-4e14-aea8-26267646e59d" data-file-name="components/bulk-email-upload.tsx"></div>
          </div>
          <p className="text-xs text-right mt-1 text-gray-500" data-unique-id="cda29137-13d9-408e-a953-422200b8d331" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="399d2b49-1cb8-442f-bb24-a945dddbeac0" data-file-name="components/bulk-email-upload.tsx">Sending email: </span>{sendingProgress}<span className="editable-text" data-unique-id="a56cd8d1-aaed-44a2-b9ba-ee7924d06fb2" data-file-name="components/bulk-email-upload.tsx">% complete</span></p>
        </div>}
      
      <div className="flex items-center justify-between" data-unique-id="8da0f011-301c-483f-946e-8d345fecc434" data-file-name="components/bulk-email-upload.tsx">
        <div className="flex items-center text-sm text-muted-foreground" data-unique-id="e8e63cf5-55b8-4e34-9901-21baaaaad8e0" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
          <AlertCircle className="h-4 w-4 mr-1" />
          {customers.length}<span className="editable-text" data-unique-id="20930c3b-dc00-4010-ab6e-1d8ba12468d9" data-file-name="components/bulk-email-upload.tsx"> customers loaded
        </span></div>
        
        <button onClick={sendEmails} disabled={isSending || customers.length === 0} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50" data-unique-id="dc7b192d-d576-4d34-bb85-4eae65471ec0" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
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
    }} data-unique-id="81ca9f9c-2ab2-444a-8cb1-710a25b05fb9" data-file-name="components/bulk-email-upload.tsx">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()} data-unique-id="59f25edb-5ab6-44c8-a431-54f76d9d0560" data-file-name="components/bulk-email-upload.tsx">
            <div className="flex justify-between items-center border-b border-border p-4" data-unique-id="4af39c48-5f3e-4a91-a1a0-cf4b502156dd" data-file-name="components/bulk-email-upload.tsx">
              <h3 className="font-medium text-lg" data-unique-id="08762565-fa4c-40fd-ac87-15c85711e9f0" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="f1187870-ca2c-4ebf-bf00-ae2a2bd93a9c" data-file-name="components/bulk-email-upload.tsx">Select Customers</span></h3>
              <button onClick={() => {
            setShowCustomerSelector(false);
            setSelectedCustomerIds([]);
          }} className="p-1 rounded-full hover:bg-accent/20" data-unique-id="c43ddcca-966a-4347-a5e4-6bdcc98955d9" data-file-name="components/bulk-email-upload.tsx">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto" data-unique-id="fe899485-3338-4bdc-8a84-e10396632c40" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
              {savedCustomers.length === 0 ? <div className="text-center py-8 text-muted-foreground" data-unique-id="108efd63-f57a-493f-9e03-a79bb50d22d4" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="56140620-8645-47f3-8fe5-81473b92aef7" data-file-name="components/bulk-email-upload.tsx">
                  No saved customers found. Add customers in the Customers tab.
                </span></div> : <div data-unique-id="f2cdce11-ccf5-40e9-a5a8-498c1f069660" data-file-name="components/bulk-email-upload.tsx">
                  <div className="mb-4 flex justify-between items-center" data-unique-id="d93193b0-0019-4394-acd8-77a5ec3b108f" data-file-name="components/bulk-email-upload.tsx">
                    <div className="text-sm text-muted-foreground" data-unique-id="fe18dcdc-6e61-4747-a44e-ba2266ae5f99" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                      {selectedCustomerIds.length}<span className="editable-text" data-unique-id="db3cb0e3-b0bc-4f0f-8d33-9111bc2371bc" data-file-name="components/bulk-email-upload.tsx"> of </span>{savedCustomers.length}<span className="editable-text" data-unique-id="b22b937f-8cc7-4fcd-b836-36c1e337478b" data-file-name="components/bulk-email-upload.tsx"> customers selected
                    </span></div>
                    <button onClick={() => setSelectedCustomerIds(savedCustomers.map(c => c.id))} className="text-sm text-primary" data-unique-id="7a6a4ebf-05f6-4615-8744-fce20da92ebe" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="38d87fb8-a8a3-4624-be97-f7e7c4fecfdf" data-file-name="components/bulk-email-upload.tsx">
                      Select All
                    </span></button>
                  </div>
                  
                  <div className="border border-border rounded-md overflow-hidden" data-unique-id="718f3bc7-38a0-41a6-a461-9fb308cf634a" data-file-name="components/bulk-email-upload.tsx">
                    <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="f911cb3f-ea0a-476d-94e1-9f6010a56ee6" data-file-name="components/bulk-email-upload.tsx">
                      <div className="col-span-1" data-unique-id="5f3cd758-16f1-4574-be3e-78b69450cdb4" data-file-name="components/bulk-email-upload.tsx"></div>
                      <div className="col-span-4" data-unique-id="3c6a4989-7f5a-4e96-8a5f-29601cd524e9" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="99013254-d749-45c4-a5a4-f9fd2b3d48ab" data-file-name="components/bulk-email-upload.tsx">Name</span></div>
                      <div className="col-span-4" data-unique-id="32c3ace8-cd56-4cb9-b479-30541a7d0d25" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="a775a577-3b62-4e5b-a180-7e5bfa24a10e" data-file-name="components/bulk-email-upload.tsx">Email</span></div>
                      <div className="col-span-3" data-unique-id="966b9935-e948-41e9-9d0d-f1186f8ae86a" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="09595d0c-0897-45ff-9a58-d4c5f2ad17f5" data-file-name="components/bulk-email-upload.tsx">Company</span></div>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto" data-unique-id="19bc926f-c76c-4134-8575-295cdc6f940b" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                      {savedCustomers.map(customer => <div key={customer.id} onClick={() => toggleCustomerSelection(customer.id)} className={`grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm cursor-pointer ${selectedCustomerIds.includes(customer.id) ? 'bg-accent/20' : 'hover:bg-accent/5'}`} data-unique-id="b3fcd894-a56f-4a2c-b60a-d87c2cced5bd" data-file-name="components/bulk-email-upload.tsx">
                          <div className="col-span-1" data-unique-id="446b37f3-b8d2-4603-b79a-c3aacf708795" data-file-name="components/bulk-email-upload.tsx">
                            <input type="checkbox" checked={selectedCustomerIds.includes(customer.id)} onChange={e => {
                      e.stopPropagation();
                      toggleCustomerSelection(customer.id);
                    }} className="rounded border-gray-300" data-unique-id="b0a4cf55-5977-4a0a-ac7c-279e80618dc1" data-file-name="components/bulk-email-upload.tsx" />
                          </div>
                          <div className="col-span-4 truncate" data-unique-id="6c8fdd46-5d93-4bad-8ebd-2326f53511cb" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.name}</div>
                          <div className="col-span-4 truncate" data-unique-id="3c0d2589-ca8f-481e-93a0-f147e5b3aa62" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.email}</div>
                          <div className="col-span-3 truncate" data-unique-id="16150c62-73a3-40b6-9b5c-d1c3c20bbd7c" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.company || '—'}</div>
                        </div>)}
                    </div>
                  </div>
                </div>}
            </div>
            
            <div className="border-t border-border p-4 flex justify-end space-x-2" data-unique-id="a9b6eb51-a5db-4c90-acfe-792063eb5e25" data-file-name="components/bulk-email-upload.tsx">
              <button onClick={() => {
            setShowCustomerSelector(false);
            setSelectedCustomerIds([]);
          }} className="px-4 py-2 border border-border rounded-md hover:bg-accent/10" data-unique-id="9563d80c-624f-4f99-9187-5333ed5aada8" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="78dd577b-c67f-462c-96c2-1491f16daa87" data-file-name="components/bulk-email-upload.tsx">
                Cancel
              </span></button>
              <button onClick={addSelectedCustomersToEmailList} disabled={selectedCustomerIds.length === 0} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50" data-unique-id="9d6f1627-afef-4fda-b4a6-735691238778" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="28542c16-1f35-4a4a-8609-7f0d81d36983" data-file-name="components/bulk-email-upload.tsx">
                Add </span>{selectedCustomerIds.length}<span className="editable-text" data-unique-id="01b94eeb-2af7-4e53-94a0-5560b27567b8" data-file-name="components/bulk-email-upload.tsx"> Customers
              </span></button>
            </div>
          </div>
        </div>}
    </motion.div>;
}