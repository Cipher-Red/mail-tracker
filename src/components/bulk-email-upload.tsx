"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Send, AlertCircle, Check, X, FileSpreadsheet, UserRound, Mail, Users, PlusCircle, RefreshCw, Copy, ExternalLink, ChevronLeft, ChevronRight, Eye, PackageCheck } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from 'xlsx';
import { generateHtmlEmail } from "@/lib/email-utils";
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

  // Load saved customers and check for order data
  useEffect(() => {
    const loadedCustomers = getLocalStorage<Customer[]>('emailCustomers', []);
    setSavedCustomers(loadedCustomers);

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

    // Process template with the customerData object (not the raw customer)
    const processedSubject = processTemplate(template.subject, customerData);
    const processedContent = processTemplate(template.content, customerData);

    // Generate HTML with explicit customer data mapping
    const htmlContent = generateHtmlEmail({
      ...template,
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
  }} className="bg-card rounded-lg shadow-md p-6" data-unique-id="0dac51b7-9748-44cc-9ea2-97ff8b8e2b18" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
      <div className="mb-6" data-unique-id="bcb11f33-72be-498c-86c1-f658659f9fc9" data-file-name="components/bulk-email-upload.tsx">
        <h2 className="text-xl font-medium mb-2" data-unique-id="f56a7f1e-a640-410b-a582-b474ef41a2ae" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="ed50ed5e-f723-485b-a3a8-c48fd5fcc5c9" data-file-name="components/bulk-email-upload.tsx">Bulk Email Sender</span></h2>
        <p className="text-muted-foreground" data-unique-id="cee62e13-83dd-440c-b43e-5161368237df" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="b3039a2e-efe5-4367-a4ef-daeb844065be" data-file-name="components/bulk-email-upload.tsx">
          Upload customer data or select saved customers to send bulk emails
        </span></p>
      </div>
      
      {/* Sending mode selector */}
      <div className="mb-6" data-unique-id="91de57dd-937f-417c-a507-cce0a3b30749" data-file-name="components/bulk-email-upload.tsx">
        <div className="bg-card p-5 border border-border rounded-md shadow-sm" data-unique-id="1a52234c-1740-4305-9693-46697d3a250d" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium mb-4 text-base flex items-center" data-unique-id="3333ac89-5cff-4ba0-bafe-0bddb6b3f332" data-file-name="components/bulk-email-upload.tsx">
            <Mail className="mr-2 h-5 w-5 text-primary" /><span className="editable-text" data-unique-id="beaa9724-45d3-47e6-a000-850aba36740f" data-file-name="components/bulk-email-upload.tsx">
            Email Sending Method
          </span></h3>
          
          <div className="grid grid-cols-2 gap-4" data-unique-id="d7ed269e-5396-468e-85f4-df10af4e7293" data-file-name="components/bulk-email-upload.tsx">
            <button onClick={() => setManualSendMode(false)} disabled={!isEmailServiceAvailable} className={`p-4 rounded-md border ${!manualSendMode ? 'border-primary bg-primary/5' : 'border-border'} flex flex-col items-center text-center transition-all ${!isEmailServiceAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}`} data-unique-id="8ef62d39-af35-4d2b-91c5-2e5bf8e925b3" data-file-name="components/bulk-email-upload.tsx">
              <Send className="h-8 w-8 text-primary mb-2" />
              <div className="font-medium mb-1" data-unique-id="c896c5ea-b6cb-4fb9-93ca-f3a135d557bb" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="9dd250bf-6052-4a73-b65d-c6c039aed668" data-file-name="components/bulk-email-upload.tsx">Automated Sending</span></div>
              <div className="text-xs text-muted-foreground" data-unique-id="a22d41aa-8469-457f-b17e-be7c837613c6" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {isEmailServiceAvailable ? "Emails will be sent automatically via the system" : "Email service not configured"}
              </div>
            </button>
            
            <button onClick={() => setManualSendMode(true)} className={`p-4 rounded-md border ${manualSendMode ? 'border-primary bg-primary/5' : 'border-border'} flex flex-col items-center text-center transition-all hover:border-primary/50`} data-unique-id="475ba7f7-e64d-4699-b4b3-3b6085bab506" data-file-name="components/bulk-email-upload.tsx">
              <ExternalLink className="h-8 w-8 text-primary mb-2" />
              <div className="font-medium mb-1" data-unique-id="254ed62c-e4d8-4413-be89-b06424a1ddbb" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="a027d763-a883-4d9b-b4b1-6c6b3b274886" data-file-name="components/bulk-email-upload.tsx">Manual Sending</span></div>
              <div className="text-xs text-muted-foreground" data-unique-id="866a9616-5d9e-4422-b478-5f67134b1a1c" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="916fd3b7-26ca-4a81-9c5f-f0616aa2c446" data-file-name="components/bulk-email-upload.tsx">
                Review and send emails through your own email client
              </span></div>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 space-y-4" data-unique-id="1d1396bb-be1a-499c-9fb5-11e656f978b7" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
        <div className="bg-card p-5 border border-border rounded-md shadow-sm" data-unique-id="e8fb729d-c01a-4b84-85d5-52d5d83a72d5" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="f886bcf0-b143-439a-a21e-60561ff466d1" data-file-name="components/bulk-email-upload.tsx">
            <UserRound className="mr-2 h-4 w-4 text-primary" />
            <span className="editable-text" data-unique-id="26ddf5eb-b0bf-4308-a633-71b702bda002" data-file-name="components/bulk-email-upload.tsx">Employee Sender Information</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2" data-unique-id="3d030fea-10fd-4348-9e4b-55948997218f" data-file-name="components/bulk-email-upload.tsx">
            <div data-unique-id="f90d0c45-894d-4d14-88b6-119080e41b24" data-file-name="components/bulk-email-upload.tsx">
              <label htmlFor="senderName" className="block text-sm font-medium mb-1" data-unique-id="9a1031bf-d406-4bc0-b40a-a740f2860a15" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="b270d5d3-683e-4aeb-a9f8-1c7cda1b56e8" data-file-name="components/bulk-email-upload.tsx">Employee Name</span>
              </label>
              <input id="senderName" type="text" value={senderName} onChange={e => {
              setSenderName(e.target.value);
              setTimeout(() => handleSenderInfoChange(), 0); // Ensure state is updated before callback
            }} placeholder="John Smith" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="73d5bf86-d09c-4f90-b813-7f8a6f409c98" data-file-name="components/bulk-email-upload.tsx" />
            </div>
            
            <div data-unique-id="5babd3fd-1411-442b-88e8-07bdf9f92daa" data-file-name="components/bulk-email-upload.tsx">
              <label htmlFor="senderEmail" className="block text-sm font-medium mb-1" data-unique-id="962d5d8f-fcd5-4799-8107-413b4c6fecfb" data-file-name="components/bulk-email-upload.tsx">
                <Mail className="inline-block h-3 w-3 mr-1 text-muted-foreground" />
                <span className="editable-text" data-unique-id="ca8b8bb0-f015-49b4-af76-2eb66e5f1573" data-file-name="components/bulk-email-upload.tsx">Employee Email</span>
              </label>
              <input id="senderEmail" type="email" value={senderEmail} onChange={e => {
              setSenderEmail(e.target.value);
              setTimeout(() => handleSenderInfoChange(), 0); // Ensure state is updated before callback
            }} placeholder="employee@detroitaxle.com" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="858b379c-72d1-4e9a-b87f-6db45fd4eefe" data-file-name="components/bulk-email-upload.tsx" />
              <p className="text-xs text-muted-foreground mt-1" data-unique-id="88ca0f71-e064-4278-b2d4-ccbfc4237a70" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="463fb1d1-7037-437f-9e05-6f59b0b28789" data-file-name="components/bulk-email-upload.tsx">This employee will appear as the sender of all emails</span>
              </p>
            </div>
          </div>
        </div>
        
      {/* Import Order Data Alert - Show when order data is available */}
      {hasOrderData && <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md animate-pulse" data-unique-id="cdcc545e-3f5b-485e-a1b0-af3af1776c91" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center justify-between" data-unique-id="84117920-f4a3-495c-a704-707b5c11a902" data-file-name="components/bulk-email-upload.tsx">
            <div className="flex items-center" data-unique-id="ebbf6a08-107b-48cc-9ec4-5bcda3985338" data-file-name="components/bulk-email-upload.tsx">
              <PackageCheck className="h-5 w-5 text-blue-500 mr-3" />
              <div data-unique-id="a351c7a4-f961-46cd-a374-50d05f0516c3" data-file-name="components/bulk-email-upload.tsx">
                <h4 className="font-medium text-blue-700" data-unique-id="c8769519-d3e9-4eb3-a565-cad14b1014c5" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="dd98223a-ebf5-43aa-9966-a0c6ee25e8d4" data-file-name="components/bulk-email-upload.tsx">Order Data Available</span></h4>
                <p className="text-sm text-blue-600" data-unique-id="1b03b87e-acbf-47ff-8c40-9dd30df41c20" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="17aafdff-a81d-47e8-b29a-6d44f2ecec42" data-file-name="components/bulk-email-upload.tsx">
                  Order data from the Order Processor is ready to be imported for email sending
                </span></p>
              </div>
            </div>
            
            <button onClick={importOrderData} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" data-unique-id="ce5b5a26-3f12-40a5-a4de-59340c797e75" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="f659a832-5785-40e6-94b6-f22d55c63fc0" data-file-name="components/bulk-email-upload.tsx">
              Import Order Data
            </span></button>
          </div>
        </div>}
    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" data-unique-id="5db53966-aebd-4d8a-b4ce-09f76c31e294" data-file-name="components/bulk-email-upload.tsx">
          <div className="bg-card p-5 border border-border rounded-md shadow-sm" data-unique-id="1c2a8dbf-5e82-4026-830f-863a292af38d" data-file-name="components/bulk-email-upload.tsx">
            <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="d2716826-5915-442b-97eb-8af135977dd0" data-file-name="components/bulk-email-upload.tsx">
              <Users className="mr-2 h-4 w-4 text-primary" />
              <span className="editable-text" data-unique-id="1ab3b062-549d-4ce5-b6be-31b79703db37" data-file-name="components/bulk-email-upload.tsx">Select Saved Customers</span>
            </h3>
            
            <div className="flex flex-col space-y-4" data-unique-id="826b6232-fb04-4b62-bffd-d4931e4685fe" data-file-name="components/bulk-email-upload.tsx">
              <p className="text-sm" data-unique-id="60798869-14c4-4585-a2a2-e91be0cb3fec" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {savedCustomers.length > 0 ? `You have ${savedCustomers.length} saved customers` : "No saved customers found. Add customers in the Customers tab."}
              </p>
              
              <button onClick={() => setShowCustomerSelector(true)} disabled={savedCustomers.length === 0} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50" data-unique-id="cb45fd27-59d4-48e0-a053-748fb91c5d3e" data-file-name="components/bulk-email-upload.tsx">
                <PlusCircle className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="7fbd8f41-4cd8-4fab-83ca-b85b87e8aab6" data-file-name="components/bulk-email-upload.tsx">
                Select Customers
              </span></button>
            </div>
          </div>
          
          <div className="bg-card p-5 border border-border rounded-md shadow-sm" data-unique-id="499dc90f-60b6-4cff-89fa-a22afc79a37f" data-file-name="components/bulk-email-upload.tsx">
            <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="f5ef9e0a-ad12-49f5-9af7-79f4d71f84fb" data-file-name="components/bulk-email-upload.tsx">
              <FileSpreadsheet className="mr-2 h-4 w-4 text-primary" />
              <span className="editable-text" data-unique-id="2b86b040-8952-4b5e-8856-c40eb08784a0" data-file-name="components/bulk-email-upload.tsx">Customer Data Import</span>
            </h3>
            
            <div className="flex flex-col space-y-4" data-unique-id="02c69acf-f858-43f8-a40f-2e160967ad40" data-file-name="components/bulk-email-upload.tsx">
              <input type="file" ref={fileInputRef} accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" id="excel-upload" data-unique-id="d59ea8a6-7003-4a42-a65b-3e9e557e166f" data-file-name="components/bulk-email-upload.tsx" />
              
              <div className="flex items-center space-x-2" data-unique-id="589d54b1-edb2-42ac-9e79-20b09353b0a9" data-file-name="components/bulk-email-upload.tsx">
                <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50" data-unique-id="29b781d6-258e-41c1-908d-3e033dd8822e" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
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
              }} className="text-primary underline text-sm hover:text-primary/90" data-unique-id="41d51220-15b7-4da6-bc17-3dbdd95c35a9" data-file-name="components/bulk-email-upload.tsx">
                  <span className="editable-text" data-unique-id="d6320a8f-b038-446c-b0f0-1db9ca0102c0" data-file-name="components/bulk-email-upload.tsx">Download Excel Template</span>
                </button>
              </div>
              
              <p className="text-xs text-muted-foreground" data-unique-id="21f12fd9-2754-4b01-9d18-1e60aeda7f83" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="f93bdd67-9169-4889-b5a6-1436c8b08b16" data-file-name="components/bulk-email-upload.tsx">Upload an Excel file (.xlsx or .xls) with customer information</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6" data-unique-id="3ed98400-edc0-41f8-8392-2e8d6753e3e7" data-file-name="components/bulk-email-upload.tsx">
        <div className="flex justify-between items-center mb-3" data-unique-id="52317151-1529-4932-b5df-ddb560ea6483" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium" data-unique-id="59b97097-74cb-4654-80e6-37507a0f7288" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="601c7216-ef92-48b8-b7f6-17a75dfc232f" data-file-name="components/bulk-email-upload.tsx">Customer Data</span></h3>
          <button onClick={addCustomer} className="text-sm text-primary hover:underline" data-unique-id="d39d48b5-1ca4-4f9b-a2a6-8902db7bd18d" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="e53c7818-3e45-4c3c-b4b7-43ea6431a1fd" data-file-name="components/bulk-email-upload.tsx">
            + Add Customer
          </span></button>
        </div>
        
        <div className="border border-border rounded-md overflow-hidden" data-unique-id="478a9d53-1407-429b-8cfb-2ef0f031b248" data-file-name="components/bulk-email-upload.tsx">
          <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="ac91c339-6c7a-41de-99af-04455d813a22" data-file-name="components/bulk-email-upload.tsx">
            <div className="col-span-3" data-unique-id="3c00e0af-8f0b-44e1-8fad-9508ad20556c" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="9664d199-12dc-4b46-b140-99d9f37033d2" data-file-name="components/bulk-email-upload.tsx">Name</span></div>
            <div className="col-span-3" data-unique-id="ac3ab1d7-c178-4017-b2d5-ee86a0a503a1" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="c73df447-4280-4d37-86d7-a6e04a830935" data-file-name="components/bulk-email-upload.tsx">Order Number</span></div>
            <div className="col-span-3" data-unique-id="bacdf4ad-f3d0-4409-8aca-a12f7dbbc20d" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="e3999751-a0c8-4ec0-aa47-62d6fda58d56" data-file-name="components/bulk-email-upload.tsx">Tracking Number</span></div>
            <div className="col-span-2" data-unique-id="5317154e-d0c1-40ed-9fee-6716d5dc3d4d" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="8eacf196-494c-4f8f-a709-038a81868deb" data-file-name="components/bulk-email-upload.tsx">Status</span></div>
            <div className="col-span-1" data-unique-id="3fba43b1-3aa9-4802-b9f3-4f3a7772b9bd" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="c697aeec-8de7-4d0a-a9a8-b73e41de970c" data-file-name="components/bulk-email-upload.tsx">Actions</span></div>
          </div>
          
          <div className="max-h-64 overflow-y-auto" data-unique-id="0f482e7f-c5ee-4cfa-ae8e-605462dd57ad" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {customers.map(customer => <div key={customer.id} className="grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm" data-unique-id="df3d6c0b-a3b3-4add-ab14-2120a711bb9e" data-file-name="components/bulk-email-upload.tsx">
                <div className="col-span-3" data-unique-id="01cd77bb-fff9-4133-adde-92d4e320dc03" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.name} onChange={e => updateCustomer(customer.id, "name", e.target.value)} placeholder="Customer Name" className="w-full p-1 border border-border rounded text-sm" data-unique-id="ee351bab-1fd4-495f-bffe-7a2d20a47545" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-3" data-unique-id="c8c45a27-035e-46e6-bf07-65663d558f41" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.orderNumber} onChange={e => updateCustomer(customer.id, "orderNumber", e.target.value)} placeholder="Order #" className="w-full p-1 border border-border rounded text-sm" data-unique-id="e5a2bda5-0cd0-42ee-85cc-7669f5b1cb4c" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-3" data-unique-id="3d3570b7-c772-418c-813f-ca6e49d99b27" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.trackingNumber} onChange={e => updateCustomer(customer.id, "trackingNumber", e.target.value)} placeholder="Tracking #" className="w-full p-1 border border-border rounded text-sm" data-unique-id="6f0d6076-bc1a-4ede-9ed8-e02d50e36307" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-2" data-unique-id="823fd8b0-0b3d-4c4d-9938-f3979e587d04" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                  {sentStatus[customer.id] ? <span className="flex items-center text-green-600" data-unique-id="7a2fdb49-d269-497a-b6cc-1c3be7854d3c" data-file-name="components/bulk-email-upload.tsx">
                      <Check className="h-4 w-4 mr-1" />
                      <span data-unique-id="88e3d508-892f-431d-833d-99dfb890182d" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="b7757f2d-0c21-4add-81f7-e6db0b6ed917" data-file-name="components/bulk-email-upload.tsx">Sent</span></span>
                    </span> : failedEmails && failedEmails[customer.id] ? <span className="flex items-center text-red-600" title={failedEmails[customer.id]} data-unique-id="97f178c8-f2b0-4fe0-a7dc-b51bf40e7bd2" data-file-name="components/bulk-email-upload.tsx">
                      <X className="h-4 w-4 mr-1" />
                      <span data-unique-id="abcddba3-45ef-4281-85e4-464973aa9103" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="6d7d1f97-9684-46d9-94e0-a57dc8a58f11" data-file-name="components/bulk-email-upload.tsx">Failed</span></span>
                    </span> : <span className="text-muted-foreground" data-unique-id="a930d0ae-727e-452d-a2c8-2ae1efaf8a9c" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="864947a5-3373-405d-8f68-b7f8a7d09800" data-file-name="components/bulk-email-upload.tsx">
                      Pending
                    </span></span>}
                </div>
                <div className="col-span-1 flex justify-end" data-unique-id="ab7fd257-fc7b-474b-9154-23f48fe3ed0f" data-file-name="components/bulk-email-upload.tsx">
                  <button onClick={() => removeCustomer(customer.id)} className="text-destructive hover:bg-destructive/10 p-1 rounded" data-unique-id="f258163d-1e4f-48f9-9697-72541fd3b752" data-file-name="components/bulk-email-upload.tsx">
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
    }} currentEmail={getCurrentEmail()} currentEmailIndex={currentEmailIndex} totalEmails={customers.length} completionPercentage={getCompletionPercentage()} onPrevious={goToPrevEmail} onNext={goToNextEmail} onMarkAsSent={markAsSent} onOpenInEmailClient={openInEmailClient} isSent={customers.length > 0 && currentEmailIndex < customers.length ? !!sentStatus[customers[currentEmailIndex]?.id] : false} />

      {/* Add a button to show the manual email interface when in manual mode */}
      {manualSendMode && customers.length > 0 && Object.keys(reviewedEmails).length > 0 && <div className="mb-6 p-4 border border-primary/20 rounded-md bg-accent/5" data-unique-id="29afa7b1-bd86-467a-bd51-7848cb4e409b" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center justify-between" data-unique-id="ad58b399-c5ba-4e81-a383-fb807f33823e" data-file-name="components/bulk-email-upload.tsx">
            <div data-unique-id="26ef22c5-1148-4f6f-ac88-5a1e75318e11" data-file-name="components/bulk-email-upload.tsx">
              <h3 className="font-medium flex items-center" data-unique-id="4df2a9d4-63fd-4e74-8acf-9a1ce7f93cf0" data-file-name="components/bulk-email-upload.tsx">
                <Eye className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="3778bd3a-da8b-4d9a-9efc-afa258de5711" data-file-name="components/bulk-email-upload.tsx">
                Email Preview & Manual Send
              </span></h3>
              <p className="text-sm text-muted-foreground mt-1" data-unique-id="36512366-7d73-4638-984f-1e3c42126fb3" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {getCompletionPercentage()}<span className="editable-text" data-unique-id="18784ba3-b54f-41c9-8710-1aef775d6d57" data-file-name="components/bulk-email-upload.tsx">% complete (</span>{Object.values(sentStatus).filter(Boolean).length}<span className="editable-text" data-unique-id="eb53d8c7-0767-47a4-b703-e65e30496517" data-file-name="components/bulk-email-upload.tsx"> of </span>{customers.length}<span className="editable-text" data-unique-id="02fda6d0-96da-4a0c-a7f1-22c0c61cf018" data-file-name="components/bulk-email-upload.tsx"> emails sent)
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
        }} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="9c77eb0b-b9d0-4f7d-9f61-105226eb5cc4" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="1b356378-635a-4261-aff0-10855f1951ac" data-file-name="components/bulk-email-upload.tsx">
              Continue Sending Emails
            </span></button>
          </div>
          
          <div className="w-full bg-gray-200 h-2 mt-4 rounded-full" data-unique-id="1b6f3604-9ef2-44c0-ab1e-749b228ff255" data-file-name="components/bulk-email-upload.tsx">
            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{
          width: `${getCompletionPercentage()}%`
        }} data-unique-id="b1028740-2e45-4cf8-8e38-d676df7947fa" data-file-name="components/bulk-email-upload.tsx"></div>
          </div>
        </div>}
      
      {manualSendMode ? <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md" data-unique-id="2bf673e3-45c7-483c-95f4-170f8852608c" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="1b9fa147-1b16-47f4-b900-8b3c1b25721b" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-amber-600" />
            <p className="text-amber-800 font-medium" data-unique-id="7b5e55e7-a378-4df1-88f7-f5b01c0d4b4b" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="bfea48d0-0f72-4557-a5aa-c2962c0722e0" data-file-name="components/bulk-email-upload.tsx">Manual Email Sending Mode</span></p>
          </div>
          <p className="mt-1 text-sm text-amber-700" data-unique-id="4ec435be-1d4c-4d42-bacd-4a82c50074ec" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="8b71beea-4579-481c-9c64-9f8e17ecfadd" data-file-name="components/bulk-email-upload.tsx">
            You are in manual email sending mode. After clicking "Send Emails", you'll be guided through 
            reviewing each email. You can copy the content and send it using your own email client.
          </span></p>
          <p className="mt-1 text-sm text-amber-700" data-unique-id="39200345-b500-4525-91eb-ac75522d688f" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="2e23d475-554e-4697-9782-f287db5d5a24" data-file-name="components/bulk-email-upload.tsx">
            Don't forget to mark emails as sent after you've sent them to keep track of your progress.
          </span></p>
        </div> : sendingError ? <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md" data-unique-id="487b9008-8b52-4e33-9b67-c15b92d04a4d" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="0461c7e3-5e11-456a-8be4-5d6633d39c5b" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
            <p className="text-red-800 font-medium" data-unique-id="2ec69eaf-f85f-4968-b257-078e12d7b937" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="5111c54c-a75c-4d0d-80c8-c8cfad21e0c5" data-file-name="components/bulk-email-upload.tsx">Error Sending Emails</span></p>
          </div>
          <p className="mt-1 text-sm text-red-700" data-unique-id="226957fb-4b3f-4404-b115-f5b21992ace6" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {sendingError}
          </p>
          <div className="mt-2 text-xs text-red-600" data-unique-id="39bb6aa8-799b-481d-87c1-69e807426215" data-file-name="components/bulk-email-upload.tsx">
            <button className="underline" onClick={() => {
          setManualSendMode(true);
          alert("Switched to manual sending mode. You'll be able to send emails through your own email client.");
        }} data-unique-id="1fc83888-1815-483e-9758-18a48dc5f53a" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="8b68a7a0-8988-46b3-937f-3e8b16dc1c78" data-file-name="components/bulk-email-upload.tsx">
              Switch to manual sending mode
            </span></button>
            <span className="mx-2" data-unique-id="3f8ba1ed-a271-4fcc-a49f-0ca9409fa699" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="5e8b1e14-0709-43bc-b472-c9f21a1723e9" data-file-name="components/bulk-email-upload.tsx">•</span></span>
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
        }} data-unique-id="6b8c536a-f849-4b48-ae2a-b6231f181dee" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="9e1fd628-ece0-4f1d-ba97-75564ee07721" data-file-name="components/bulk-email-upload.tsx">
              Show Debug Info
            </span></button>
          </div>
        </div> : <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md" data-unique-id="4905949d-2c9b-4264-bab0-c3ffb72da9a3" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="e7d9a1fb-1939-43b7-8890-d75173d05122" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
            <p className="text-blue-800 font-medium" data-unique-id="2cdc59e3-7ff3-4f40-ae75-8fcf764c0cb1" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
              {isEmailServiceAvailable ? "Email Sending Enabled" : "Email Service Not Configured"}
            </p>
          </div>
          <p className="mt-1 text-sm text-blue-700" data-unique-id="8752058a-1571-4356-bfa5-6a71b9998722" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {isEmailServiceAvailable ? "This application is now connected to a real email service. Emails will be sent to the customer email addresses provided. Please ensure all email addresses are valid and have opted in to receive communications." : "The email service is not configured properly. You can use manual mode to send emails through your own email client."}
          </p>
        </div>}
      
      {sendingProgress > 0 && sendingProgress < 100 && <div className="mb-4" data-unique-id="7dfc77d3-0510-46e4-abb4-b4b9c4e5f154" data-file-name="components/bulk-email-upload.tsx">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden" data-unique-id="a83a1a07-b72c-4cdb-8ecf-b9143c427c67" data-file-name="components/bulk-email-upload.tsx">
            <div className="h-full bg-primary transition-all duration-300 ease-out" style={{
          width: `${sendingProgress}%`
        }} data-unique-id="0fce585a-3570-41c0-8626-a7e488e8aa84" data-file-name="components/bulk-email-upload.tsx"></div>
          </div>
          <p className="text-xs text-right mt-1 text-gray-500" data-unique-id="751aba84-ad24-4839-8b6a-47c7b5876ff0" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="10e375ea-849c-4da7-a231-69ad71a9228f" data-file-name="components/bulk-email-upload.tsx">Sending email: </span>{sendingProgress}<span className="editable-text" data-unique-id="4eb48c10-f874-4459-a6a6-e5026a01fa71" data-file-name="components/bulk-email-upload.tsx">% complete</span></p>
        </div>}
      
      <div className="flex items-center justify-between" data-unique-id="1ccd3458-1cde-41c7-9d35-8aafbfed219b" data-file-name="components/bulk-email-upload.tsx">
        <div className="flex items-center text-sm text-muted-foreground" data-unique-id="136edac4-6097-4256-8af3-407f7cf6e2eb" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
          <AlertCircle className="h-4 w-4 mr-1" />
          {customers.length}<span className="editable-text" data-unique-id="5d51e223-bbab-4063-84bb-483f77bdac8d" data-file-name="components/bulk-email-upload.tsx"> customers loaded
        </span></div>
        
        <button onClick={sendEmails} disabled={isSending || customers.length === 0} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50" data-unique-id="dab9b3b2-8ad3-4abc-a5f3-e0cfb509dfe9" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
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
    }} data-unique-id="cb48252d-72a2-4d86-a2de-403f719fed26" data-file-name="components/bulk-email-upload.tsx">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()} data-unique-id="5afc3c75-0e7b-4d52-bc8c-adafbdf04b6c" data-file-name="components/bulk-email-upload.tsx">
            <div className="flex justify-between items-center border-b border-border p-4" data-unique-id="a8cdb77d-7afd-4b4c-bb04-ee484a1ceecd" data-file-name="components/bulk-email-upload.tsx">
              <h3 className="font-medium text-lg" data-unique-id="c02cb4b3-d02d-4b39-b8a8-581b8d7f98c4" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="1d339115-04a9-459a-a1c7-d20c20c81913" data-file-name="components/bulk-email-upload.tsx">Select Customers</span></h3>
              <button onClick={() => {
            setShowCustomerSelector(false);
            setSelectedCustomerIds([]);
          }} className="p-1 rounded-full hover:bg-accent/20" data-unique-id="9591a39f-5ddf-4da6-bc6b-dec4fe42004a" data-file-name="components/bulk-email-upload.tsx">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto" data-unique-id="3d9d1aa8-55ee-4a8c-912b-c86faf9c15ee" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
              {savedCustomers.length === 0 ? <div className="text-center py-8 text-muted-foreground" data-unique-id="790c1d6e-defd-4218-87dd-3e33c8d5fca8" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="0d9c0ed4-85d5-42a5-ba86-13aa375aa6c0" data-file-name="components/bulk-email-upload.tsx">
                  No saved customers found. Add customers in the Customers tab.
                </span></div> : <div data-unique-id="fe2b7f06-0b55-4fb0-b429-08c6e4df8e40" data-file-name="components/bulk-email-upload.tsx">
                  <div className="mb-4 flex justify-between items-center" data-unique-id="516b75ab-eef2-4dbe-aa76-75e23c54dbef" data-file-name="components/bulk-email-upload.tsx">
                    <div className="text-sm text-muted-foreground" data-unique-id="2ef8532c-96a6-48f5-867d-817dd5920b65" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                      {selectedCustomerIds.length}<span className="editable-text" data-unique-id="45d41655-2224-4235-8987-91487a5ec88d" data-file-name="components/bulk-email-upload.tsx"> of </span>{savedCustomers.length}<span className="editable-text" data-unique-id="a8cc0f60-341e-4991-9408-7ac3591e5dc1" data-file-name="components/bulk-email-upload.tsx"> customers selected
                    </span></div>
                    <button onClick={() => setSelectedCustomerIds(savedCustomers.map(c => c.id))} className="text-sm text-primary" data-unique-id="276cc6fd-436d-4abe-8932-f8a0d8685189" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="b9066f9c-4df8-424d-a52a-16cb20ace1e5" data-file-name="components/bulk-email-upload.tsx">
                      Select All
                    </span></button>
                  </div>
                  
                  <div className="border border-border rounded-md overflow-hidden" data-unique-id="199a03b9-be66-4c6f-9322-401a71c7b40a" data-file-name="components/bulk-email-upload.tsx">
                    <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="76e0cdfa-c3c7-4ed5-ab88-b11cb610ce27" data-file-name="components/bulk-email-upload.tsx">
                      <div className="col-span-1" data-unique-id="08532eed-061a-4fe9-9b35-653602f30399" data-file-name="components/bulk-email-upload.tsx"></div>
                      <div className="col-span-4" data-unique-id="676e521c-510b-408b-8a6e-bc184cdd8495" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="0f8abfb5-9e2f-41e1-aa1f-43d37da19a4d" data-file-name="components/bulk-email-upload.tsx">Name</span></div>
                      <div className="col-span-4" data-unique-id="0f5479f4-a56a-41ad-9fc8-bbaaf4b10fd4" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="f6e36d32-e0fc-4971-9c80-31c88f6ea0f3" data-file-name="components/bulk-email-upload.tsx">Email</span></div>
                      <div className="col-span-3" data-unique-id="0eedd240-4426-44ca-9f23-bf8960a132b0" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="b61da3db-2e13-4f55-9521-f84932b56850" data-file-name="components/bulk-email-upload.tsx">Company</span></div>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto" data-unique-id="a57fdc35-42e4-4dd9-b666-a37a841d6ff3" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                      {savedCustomers.map(customer => <div key={customer.id} onClick={() => toggleCustomerSelection(customer.id)} className={`grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm cursor-pointer ${selectedCustomerIds.includes(customer.id) ? 'bg-accent/20' : 'hover:bg-accent/5'}`} data-unique-id="0296e7f4-797e-4095-b171-13c407b24c9c" data-file-name="components/bulk-email-upload.tsx">
                          <div className="col-span-1" data-unique-id="badb6ec9-914a-4b1e-868b-2fe0eaf24aef" data-file-name="components/bulk-email-upload.tsx">
                            <input type="checkbox" checked={selectedCustomerIds.includes(customer.id)} onChange={e => {
                      e.stopPropagation();
                      toggleCustomerSelection(customer.id);
                    }} className="rounded border-gray-300" data-unique-id="2045d840-1a6e-4652-996b-f2bc464d5d31" data-file-name="components/bulk-email-upload.tsx" />
                          </div>
                          <div className="col-span-4 truncate" data-unique-id="f4f92767-0807-4927-8df8-a0252be82afe" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.name}</div>
                          <div className="col-span-4 truncate" data-unique-id="43cad666-d91c-4fe4-9427-e2a1bdd1eac2" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.email}</div>
                          <div className="col-span-3 truncate" data-unique-id="5f6c7e9b-56f6-4bf6-a41a-e316f6d6b2eb" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.company || '—'}</div>
                        </div>)}
                    </div>
                  </div>
                </div>}
            </div>
            
            <div className="border-t border-border p-4 flex justify-end space-x-2" data-unique-id="0bd33ef8-98f9-47de-b56a-5982ceb30f97" data-file-name="components/bulk-email-upload.tsx">
              <button onClick={() => {
            setShowCustomerSelector(false);
            setSelectedCustomerIds([]);
          }} className="px-4 py-2 border border-border rounded-md hover:bg-accent/10" data-unique-id="bc738e4c-89ef-444e-bc21-1c904d76278f" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="3047746d-c45f-40a3-aa2b-df776d07630b" data-file-name="components/bulk-email-upload.tsx">
                Cancel
              </span></button>
              <button onClick={addSelectedCustomersToEmailList} disabled={selectedCustomerIds.length === 0} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50" data-unique-id="96d81c73-eec6-4c0c-ba88-0f12e3d883d9" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="496e1b52-31d8-445b-a6d0-1988a168e1ff" data-file-name="components/bulk-email-upload.tsx">
                Add </span>{selectedCustomerIds.length}<span className="editable-text" data-unique-id="1b63d661-ec92-4210-b072-b672669fc1e9" data-file-name="components/bulk-email-upload.tsx"> Customers
              </span></button>
            </div>
          </div>
        </div>}
    </motion.div>;
}