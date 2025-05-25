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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="a13152f3-5994-4cb2-8599-4ab7fa100d4a" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
      <div className="mb-6" data-unique-id="57730572-8c7e-4033-a027-91a7fa6c539a" data-file-name="components/bulk-email-upload.tsx">
        <h2 className="text-xl font-medium mb-2" data-unique-id="d503182f-7953-45d0-a76b-4b18f44411e5" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="61132e34-26e5-4ab6-9e53-e2c716b691be" data-file-name="components/bulk-email-upload.tsx">Bulk Email Sender</span></h2>
        <p className="text-muted-foreground" data-unique-id="05b5f571-8186-470b-826e-1c2c7a4a30b2" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="de75170c-0130-4efa-be4f-ae98319d8701" data-file-name="components/bulk-email-upload.tsx">
          Upload customer data or select saved customers to send bulk emails
        </span></p>
      </div>
      
      {/* Sending mode selector */}
      <div className="mb-6" data-unique-id="a270f55c-140c-4ee1-99b6-37d5cba52feb" data-file-name="components/bulk-email-upload.tsx">
        <div className="bg-white p-5 border border-border rounded-md shadow-sm" data-unique-id="4da896ae-7b4f-4a64-9550-c58355bed569" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium mb-4 text-base flex items-center" data-unique-id="2a67e054-7d88-4fbf-a7bf-6bbcfdf68a97" data-file-name="components/bulk-email-upload.tsx">
            <Mail className="mr-2 h-5 w-5 text-primary" /><span className="editable-text" data-unique-id="8b680536-693a-474c-a8dd-85ae0a7ef836" data-file-name="components/bulk-email-upload.tsx">
            Email Sending Method
          </span></h3>
          
          <div className="grid grid-cols-2 gap-4" data-unique-id="1c45db72-cc55-4cf5-bad7-ef16b8846dd6" data-file-name="components/bulk-email-upload.tsx">
            <button onClick={() => setManualSendMode(false)} disabled={!isEmailServiceAvailable} className={`p-4 rounded-md border ${!manualSendMode ? 'border-primary bg-primary/5' : 'border-border'} flex flex-col items-center text-center transition-all ${!isEmailServiceAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}`} data-unique-id="099e8b29-912c-41cb-a825-235c9cffe10f" data-file-name="components/bulk-email-upload.tsx">
              <Send className="h-8 w-8 text-primary mb-2" />
              <div className="font-medium mb-1" data-unique-id="422b214b-f03b-4a19-b0bb-5930d8814784" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="b97a2f4f-f08c-4dd3-acf1-02d2d8793145" data-file-name="components/bulk-email-upload.tsx">Automated Sending</span></div>
              <div className="text-xs text-muted-foreground" data-unique-id="97c8963e-6966-4ea1-b32e-5dd120cc47c2" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {isEmailServiceAvailable ? "Emails will be sent automatically via the system" : "Email service not configured"}
              </div>
            </button>
            
            <button onClick={() => setManualSendMode(true)} className={`p-4 rounded-md border ${manualSendMode ? 'border-primary bg-primary/5' : 'border-border'} flex flex-col items-center text-center transition-all hover:border-primary/50`} data-unique-id="e7899fee-6e63-4696-b94b-e8bedd5649a2" data-file-name="components/bulk-email-upload.tsx">
              <ExternalLink className="h-8 w-8 text-primary mb-2" />
              <div className="font-medium mb-1" data-unique-id="8c383dba-3fb6-4cb2-9455-8aa15b9167fb" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="04b59f7f-972d-4630-af37-f08c35dd5aa9" data-file-name="components/bulk-email-upload.tsx">Manual Sending</span></div>
              <div className="text-xs text-muted-foreground" data-unique-id="94b80fcb-292e-440f-8742-92dc8eeecfe1" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="5df01ac1-04fe-4a36-ab4f-7c70035a0b1b" data-file-name="components/bulk-email-upload.tsx">
                Review and send emails through your own email client
              </span></div>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 space-y-4" data-unique-id="508c2533-7874-45d3-8010-616277f65aba" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
        <div className="bg-white p-5 border border-border rounded-md shadow-sm" data-unique-id="0b85c78a-f407-43bf-bdfa-9dc246526177" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="ad393df2-4fd8-4daf-a716-3364647f1a39" data-file-name="components/bulk-email-upload.tsx">
            <UserRound className="mr-2 h-4 w-4 text-primary" />
            <span className="editable-text" data-unique-id="722a2f2b-67d6-4815-b8d9-e8f4e4fc0466" data-file-name="components/bulk-email-upload.tsx">Employee Sender Information</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2" data-unique-id="053efa81-1faa-4e6b-a02b-f4c66b20becc" data-file-name="components/bulk-email-upload.tsx">
            <div data-unique-id="120e2936-06b7-443d-a68f-65e7f0ea3788" data-file-name="components/bulk-email-upload.tsx">
              <label htmlFor="senderName" className="block text-sm font-medium mb-1" data-unique-id="6f473f6d-1bcf-4e24-a803-657f9c1d96ba" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="6286cf18-8860-486f-a1f0-bdbe7976f998" data-file-name="components/bulk-email-upload.tsx">Employee Name</span>
              </label>
              <input id="senderName" type="text" value={senderName} onChange={e => {
              setSenderName(e.target.value);
              handleSenderInfoChange();
            }} placeholder="John Smith" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="b12f6281-75d7-43c5-8f38-9fda2c9abf2c" data-file-name="components/bulk-email-upload.tsx" />
            </div>
            
            <div data-unique-id="97008f41-d627-4395-8e12-8d5b2ab91df7" data-file-name="components/bulk-email-upload.tsx">
              <label htmlFor="senderEmail" className="block text-sm font-medium mb-1" data-unique-id="22bf41c9-f9be-48dd-a842-5cb946fad4f2" data-file-name="components/bulk-email-upload.tsx">
                <Mail className="inline-block h-3 w-3 mr-1 text-muted-foreground" />
                <span className="editable-text" data-unique-id="13981819-a4c2-4840-89c5-04d2d5407f1a" data-file-name="components/bulk-email-upload.tsx">Employee Email</span>
              </label>
              <input id="senderEmail" type="email" value={senderEmail} onChange={e => {
              setSenderEmail(e.target.value);
              handleSenderInfoChange();
            }} placeholder="employee@detroitaxle.com" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="908bb1a3-a8b9-4069-ab7c-7ccd263499d3" data-file-name="components/bulk-email-upload.tsx" />
              <p className="text-xs text-muted-foreground mt-1" data-unique-id="2c5105f6-1ebf-4d78-8902-a059c3a590e0" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="b6813002-bfd5-4a95-86f5-47d67f6103da" data-file-name="components/bulk-email-upload.tsx">This employee will appear as the sender of all emails</span>
              </p>
            </div>
          </div>
        </div>
        
      {/* Import Order Data Alert - Show when order data is available */}
      {hasOrderData && <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md animate-pulse" data-unique-id="17f9a5dd-6e98-4cf0-819f-3a0618206ec8" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center justify-between" data-unique-id="94c83126-bd83-4996-9e1f-c062c3339988" data-file-name="components/bulk-email-upload.tsx">
            <div className="flex items-center" data-unique-id="29f6571a-0684-4b8f-8607-d9546029b18b" data-file-name="components/bulk-email-upload.tsx">
              <PackageCheck className="h-5 w-5 text-blue-500 mr-3" />
              <div data-unique-id="ad39a815-91e0-4a9b-bc22-c758e3abed56" data-file-name="components/bulk-email-upload.tsx">
                <h4 className="font-medium text-blue-700" data-unique-id="1247b5cc-56fe-4dd5-9ec0-28f0b1392ea2" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="cd5ba0b0-ce0d-43ff-82ad-698c89227ab4" data-file-name="components/bulk-email-upload.tsx">Order Data Available</span></h4>
                <p className="text-sm text-blue-600" data-unique-id="62cd91ed-1b18-4745-b84c-30b29d995434" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="83ce120b-9080-4450-ad28-0671e1992316" data-file-name="components/bulk-email-upload.tsx">
                  Order data from the Order Processor is ready to be imported for email sending
                </span></p>
              </div>
            </div>
            
            <button onClick={importOrderData} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" data-unique-id="421410b6-6cc3-4fd9-9865-a5112951c101" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="de5119d9-dd72-4824-801e-efc244f9df17" data-file-name="components/bulk-email-upload.tsx">
              Import Order Data
            </span></button>
          </div>
        </div>}
    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" data-unique-id="eda4fe1f-c2a3-41d2-a061-eb84181b48bc" data-file-name="components/bulk-email-upload.tsx">
          <div className="bg-white p-5 border border-border rounded-md shadow-sm" data-unique-id="e571097f-a4e7-4559-8b57-6c6a82dd6a63" data-file-name="components/bulk-email-upload.tsx">
            <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="fcde988a-7849-4aa2-9826-c01d3300a24d" data-file-name="components/bulk-email-upload.tsx">
              <Users className="mr-2 h-4 w-4 text-primary" />
              <span className="editable-text" data-unique-id="7cb28240-af4f-474a-a3e5-2cf7ff5cc59f" data-file-name="components/bulk-email-upload.tsx">Select Saved Customers</span>
            </h3>
            
            <div className="flex flex-col space-y-4" data-unique-id="65129c7b-e6d2-4321-a1b7-a48e746579f0" data-file-name="components/bulk-email-upload.tsx">
              <p className="text-sm" data-unique-id="38883b03-844a-4907-861a-15077ea40ef0" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {savedCustomers.length > 0 ? `You have ${savedCustomers.length} saved customers` : "No saved customers found. Add customers in the Customers tab."}
              </p>
              
              <button onClick={() => setShowCustomerSelector(true)} disabled={savedCustomers.length === 0} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50" data-unique-id="eb4ffe14-5de0-4eae-9b51-0a0c0da7e9d6" data-file-name="components/bulk-email-upload.tsx">
                <PlusCircle className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="d208b985-e59e-493f-82e2-64a965d3c5ae" data-file-name="components/bulk-email-upload.tsx">
                Select Customers
              </span></button>
            </div>
          </div>
          
          <div className="bg-white p-5 border border-border rounded-md shadow-sm" data-unique-id="87a18385-192c-4720-8c1a-8d6cf79286a5" data-file-name="components/bulk-email-upload.tsx">
            <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="f60d9402-b766-4f12-bb29-9358b19f8af4" data-file-name="components/bulk-email-upload.tsx">
              <FileSpreadsheet className="mr-2 h-4 w-4 text-primary" />
              <span className="editable-text" data-unique-id="c4da73cd-e7e2-4f85-b05e-dabc390ed8c0" data-file-name="components/bulk-email-upload.tsx">Customer Data Import</span>
            </h3>
            
            <div className="flex flex-col space-y-4" data-unique-id="dc8ad7b6-7066-48c6-aaf0-d0f331a3a63b" data-file-name="components/bulk-email-upload.tsx">
              <input type="file" ref={fileInputRef} accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" id="excel-upload" data-unique-id="44fcff5c-9793-4b51-8a51-fd20cc9e318a" data-file-name="components/bulk-email-upload.tsx" />
              
              <div className="flex items-center space-x-2" data-unique-id="83eed795-95d9-49c2-9e96-869e1e317935" data-file-name="components/bulk-email-upload.tsx">
                <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50" data-unique-id="6f55dab5-e59c-4b4b-a2e8-d4e8e7de0f28" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
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
              }} className="text-primary underline text-sm hover:text-primary/90" data-unique-id="31f135d6-4c29-45fd-9c5a-aa632e287919" data-file-name="components/bulk-email-upload.tsx">
                  <span className="editable-text" data-unique-id="d635f34f-2c89-46d9-a04b-7a4f1ea069b1" data-file-name="components/bulk-email-upload.tsx">Download Excel Template</span>
                </button>
              </div>
              
              <p className="text-xs text-muted-foreground" data-unique-id="7b86fda3-25e1-40c0-9fe7-a4646034159e" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="23f98500-a880-475b-8ec6-dbf10516528a" data-file-name="components/bulk-email-upload.tsx">Upload an Excel file (.xlsx or .xls) with customer information</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6" data-unique-id="1c66e525-0cbc-4be1-ac2b-85905eda979f" data-file-name="components/bulk-email-upload.tsx">
        <div className="flex justify-between items-center mb-3" data-unique-id="66ca6da8-a705-441f-8996-85b9a35ef145" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium" data-unique-id="0afbfc21-fc14-4990-8540-e31801ef8a69" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="845f9027-c605-433c-b225-0abaa81dd479" data-file-name="components/bulk-email-upload.tsx">Customer Data</span></h3>
          <button onClick={addCustomer} className="text-sm text-primary hover:underline" data-unique-id="d0130bb3-7936-4b2b-8721-15c930bf706c" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="f690b4ee-ba43-4ce3-9c9c-474c849618d9" data-file-name="components/bulk-email-upload.tsx">
            + Add Customer
          </span></button>
        </div>
        
        <div className="border border-border rounded-md overflow-hidden" data-unique-id="4c08cbcb-4663-4ea5-aa09-5414eee09418" data-file-name="components/bulk-email-upload.tsx">
          <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="733f1793-1ac9-45a1-a45c-07614aff0b40" data-file-name="components/bulk-email-upload.tsx">
            <div className="col-span-3" data-unique-id="1d9752ff-ab64-419d-b097-625b82ca3215" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="e8afcc44-0596-48b7-82ed-37b43b2c5c94" data-file-name="components/bulk-email-upload.tsx">Name</span></div>
            <div className="col-span-3" data-unique-id="6fbd564e-6757-4981-af41-342439ee3dec" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="386fe51c-c0f3-4d20-a39a-23892dd1bd59" data-file-name="components/bulk-email-upload.tsx">Order Number</span></div>
            <div className="col-span-3" data-unique-id="3dc46cb1-f0d3-4bc9-b563-24bae16b156f" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="84501496-5562-49da-8f8a-f014dce2e3f1" data-file-name="components/bulk-email-upload.tsx">Tracking Number</span></div>
            <div className="col-span-2" data-unique-id="70156298-0736-45f6-a84b-6c1ca7197081" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="47250bb8-ce5e-4b2d-87a4-90560e10479c" data-file-name="components/bulk-email-upload.tsx">Status</span></div>
            <div className="col-span-1" data-unique-id="4fcbc583-6d8e-4a70-8017-676dce86cb64" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="7c78970f-a52e-4b6b-8980-1d2b2d86dc40" data-file-name="components/bulk-email-upload.tsx">Actions</span></div>
          </div>
          
          <div className="max-h-64 overflow-y-auto" data-unique-id="a88e4297-e7fd-40ad-8533-a19b625baaa4" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {customers.map(customer => <div key={customer.id} className="grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm" data-unique-id="47a9563c-6e51-4a41-a5bc-d9e5bf8a2034" data-file-name="components/bulk-email-upload.tsx">
                <div className="col-span-3" data-unique-id="e5fd4c14-caea-47ae-aeab-fcf15b91d4d7" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.name} onChange={e => updateCustomer(customer.id, "name", e.target.value)} placeholder="Customer Name" className="w-full p-1 border border-border rounded text-sm" data-unique-id="c334a247-9b59-4ff7-bb56-27ad2585ebfd" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-3" data-unique-id="7ff435b3-6855-4844-9a88-f980a16e3710" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.orderNumber} onChange={e => updateCustomer(customer.id, "orderNumber", e.target.value)} placeholder="Order #" className="w-full p-1 border border-border rounded text-sm" data-unique-id="48eaca7e-4698-459d-933e-b866b09b27cd" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-3" data-unique-id="c4e398c6-617a-44ea-b7c0-667426aff1f2" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.trackingNumber} onChange={e => updateCustomer(customer.id, "trackingNumber", e.target.value)} placeholder="Tracking #" className="w-full p-1 border border-border rounded text-sm" data-unique-id="99383aba-913e-49b9-8252-50bd09b3e964" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-2" data-unique-id="a22ee202-5933-4702-9216-bb4f53f8e87b" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                  {sentStatus[customer.id] ? <span className="flex items-center text-green-600" data-unique-id="dfafd658-eaeb-4e7c-8414-8efc6f28695f" data-file-name="components/bulk-email-upload.tsx">
                      <Check className="h-4 w-4 mr-1" />
                      <span data-unique-id="a539a2ee-dd57-4f31-a0ce-2a7c4ce9a88f" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="1830ad3a-32ce-4eb2-97db-e102a606e7c3" data-file-name="components/bulk-email-upload.tsx">Sent</span></span>
                    </span> : failedEmails && failedEmails[customer.id] ? <span className="flex items-center text-red-600" title={failedEmails[customer.id]} data-unique-id="f5f8c5c2-b77f-4bd4-a0ee-7f82c042d838" data-file-name="components/bulk-email-upload.tsx">
                      <X className="h-4 w-4 mr-1" />
                      <span data-unique-id="37552a3b-d849-4504-bc08-f098a8a6a4d1" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="eb87d7f5-457a-4402-9b5c-8654eb592db8" data-file-name="components/bulk-email-upload.tsx">Failed</span></span>
                    </span> : <span className="text-muted-foreground" data-unique-id="c5651241-9a85-4c1d-af7a-cba89ca7e712" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="fa39db2d-d2e3-4b70-ac37-2e67999fe969" data-file-name="components/bulk-email-upload.tsx">
                      Pending
                    </span></span>}
                </div>
                <div className="col-span-1 flex justify-end" data-unique-id="3a166b1d-c89d-4981-bdfa-17d508db91cd" data-file-name="components/bulk-email-upload.tsx">
                  <button onClick={() => removeCustomer(customer.id)} className="text-destructive hover:bg-destructive/10 p-1 rounded" data-unique-id="fb23e76c-5a0b-4003-9238-1e07beeb3958" data-file-name="components/bulk-email-upload.tsx">
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
      {manualSendMode && customers.length > 0 && Object.keys(reviewedEmails).length > 0 && <div className="mb-6 p-4 border border-primary/20 rounded-md bg-accent/5" data-unique-id="cdbb1d54-ec0c-4167-9e4e-6c9fb5df855f" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center justify-between" data-unique-id="3a09650d-da3a-4443-b0e1-30184ffa78e2" data-file-name="components/bulk-email-upload.tsx">
            <div data-unique-id="f562016e-28e1-4e27-b69e-6cf5e08a234b" data-file-name="components/bulk-email-upload.tsx">
              <h3 className="font-medium flex items-center" data-unique-id="a9bb4343-7b4d-46ab-804b-d722816c8ca7" data-file-name="components/bulk-email-upload.tsx">
                <Eye className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="703d0816-1f6f-438f-b99f-030af5aba18b" data-file-name="components/bulk-email-upload.tsx">
                Email Preview & Manual Send
              </span></h3>
              <p className="text-sm text-muted-foreground mt-1" data-unique-id="5e23d172-d5b4-4121-a951-fd664439bd7a" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {getCompletionPercentage()}<span className="editable-text" data-unique-id="c34f90b6-c1a4-4803-9c22-269fe85afd49" data-file-name="components/bulk-email-upload.tsx">% complete (</span>{Object.values(sentStatus).filter(Boolean).length}<span className="editable-text" data-unique-id="e8066e18-6b35-4318-a941-79d87dda2ec3" data-file-name="components/bulk-email-upload.tsx"> of </span>{customers.length}<span className="editable-text" data-unique-id="0382957e-0619-4537-9127-a92d29c77df9" data-file-name="components/bulk-email-upload.tsx"> emails sent)
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
        }} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="e220b05f-ec1b-435b-b133-c489eb72c25a" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="75b255bb-bc6c-4e6b-8663-ac11b3e2ccdd" data-file-name="components/bulk-email-upload.tsx">
              Continue Sending Emails
            </span></button>
          </div>
          
          <div className="w-full bg-gray-200 h-2 mt-4 rounded-full" data-unique-id="b32b3020-5ef3-4378-8e14-423f3a847540" data-file-name="components/bulk-email-upload.tsx">
            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{
          width: `${getCompletionPercentage()}%`
        }} data-unique-id="91017690-461a-41b6-aee1-13ccbc9ffa01" data-file-name="components/bulk-email-upload.tsx"></div>
          </div>
        </div>}
      
      {manualSendMode ? <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md" data-unique-id="c06b5789-3074-40ab-9bee-aec5a92387c3" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="6632543d-8781-483e-b3d6-0f6e87f41263" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-amber-600" />
            <p className="text-amber-800 font-medium" data-unique-id="bc810642-33b2-4319-9512-419d56795a2d" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="19d3be45-6c0c-4baf-b7d2-a37903e6585b" data-file-name="components/bulk-email-upload.tsx">Manual Email Sending Mode</span></p>
          </div>
          <p className="mt-1 text-sm text-amber-700" data-unique-id="730655c3-73f4-47ac-84c6-d38fa9dd731f" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="bd6dad19-b55a-4151-ad06-ad30ade46984" data-file-name="components/bulk-email-upload.tsx">
            You are in manual email sending mode. After clicking "Send Emails", you'll be guided through 
            reviewing each email. You can copy the content and send it using your own email client.
          </span></p>
          <p className="mt-1 text-sm text-amber-700" data-unique-id="20115766-5d9c-4c66-975a-1b5af5a4bfc5" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="09ee6c4f-56ed-4480-998b-9a4ea466e6af" data-file-name="components/bulk-email-upload.tsx">
            Don't forget to mark emails as sent after you've sent them to keep track of your progress.
          </span></p>
        </div> : sendingError ? <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md" data-unique-id="9934afce-e439-4812-a370-f4a32995bb36" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="d0bdaba0-1052-4fe5-9579-de3ad6d63711" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
            <p className="text-red-800 font-medium" data-unique-id="5a207e4a-38d8-4f7e-9e31-d331cb77a8d1" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="451a5261-1a57-4aa2-a6cb-43a27c85ed25" data-file-name="components/bulk-email-upload.tsx">Error Sending Emails</span></p>
          </div>
          <p className="mt-1 text-sm text-red-700" data-unique-id="f53bb03d-f29c-467a-881a-f19917fe2b59" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {sendingError}
          </p>
          <div className="mt-2 text-xs text-red-600" data-unique-id="37ba0028-c22b-422b-bf59-de9e23425205" data-file-name="components/bulk-email-upload.tsx">
            <button className="underline" onClick={() => {
          setManualSendMode(true);
          alert("Switched to manual sending mode. You'll be able to send emails through your own email client.");
        }} data-unique-id="fe460889-f21a-468d-bf83-8a0e789192d1" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="3f239cde-5859-4193-9946-1bcd06688700" data-file-name="components/bulk-email-upload.tsx">
              Switch to manual sending mode
            </span></button>
            <span className="mx-2" data-unique-id="e7aa2f08-8e4d-4498-8acd-d62f2789855e" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="c46efb98-6cf0-454b-ad04-bec797de0df5" data-file-name="components/bulk-email-upload.tsx">•</span></span>
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
        }} data-unique-id="1c1fbea8-a5fe-403b-8d74-457850f39dfa" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="7591bf87-27e3-46dc-a0f2-6a69a6ac5df6" data-file-name="components/bulk-email-upload.tsx">
              Show Debug Info
            </span></button>
          </div>
        </div> : <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md" data-unique-id="b987339a-f6ec-42dc-b395-8bf6880f2b13" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="db587057-75c9-4937-b1d6-bd674bb19192" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
            <p className="text-blue-800 font-medium" data-unique-id="08ae0601-b25a-4b7e-a318-f78f02364dca" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
              {isEmailServiceAvailable ? "Email Sending Enabled" : "Email Service Not Configured"}
            </p>
          </div>
          <p className="mt-1 text-sm text-blue-700" data-unique-id="1d5396e0-31f1-4d7b-9879-428552e3753a" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {isEmailServiceAvailable ? "This application is now connected to a real email service. Emails will be sent to the customer email addresses provided. Please ensure all email addresses are valid and have opted in to receive communications." : "The email service is not configured properly. You can use manual mode to send emails through your own email client."}
          </p>
        </div>}
      
      {sendingProgress > 0 && sendingProgress < 100 && <div className="mb-4" data-unique-id="87d63648-bc2d-4fd2-b68d-d697e6ae81f6" data-file-name="components/bulk-email-upload.tsx">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden" data-unique-id="419e215a-ccf0-4528-8e44-feefc49f6257" data-file-name="components/bulk-email-upload.tsx">
            <div className="h-full bg-primary transition-all duration-300 ease-out" style={{
          width: `${sendingProgress}%`
        }} data-unique-id="ba787f41-b84b-402d-8313-d7d3da3f12e1" data-file-name="components/bulk-email-upload.tsx"></div>
          </div>
          <p className="text-xs text-right mt-1 text-gray-500" data-unique-id="2207de6d-7477-4b51-9c3a-39056492125e" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="0e97c20e-058b-4de4-83b7-6ae828de63d4" data-file-name="components/bulk-email-upload.tsx">Sending email: </span>{sendingProgress}<span className="editable-text" data-unique-id="6c7f41e8-4333-4575-8fcd-38d132608d29" data-file-name="components/bulk-email-upload.tsx">% complete</span></p>
        </div>}
      
      <div className="flex items-center justify-between" data-unique-id="b029bfad-55d2-4034-9e0c-aa494d03571b" data-file-name="components/bulk-email-upload.tsx">
        <div className="flex items-center text-sm text-muted-foreground" data-unique-id="98b7e2c3-2314-4b23-8dfd-3932c0f66f69" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
          <AlertCircle className="h-4 w-4 mr-1" />
          {customers.length}<span className="editable-text" data-unique-id="570a14af-282c-4b64-ab71-02fa5b97f769" data-file-name="components/bulk-email-upload.tsx"> customers loaded
        </span></div>
        
        <button onClick={sendEmails} disabled={isSending || customers.length === 0} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50" data-unique-id="760b7d0a-4943-48db-9343-57138b53411a" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
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
    }} data-unique-id="fde05fbd-f9ec-4964-82e4-474266e58d9e" data-file-name="components/bulk-email-upload.tsx">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()} data-unique-id="f9c37e93-d39c-4e2d-abae-601351f693aa" data-file-name="components/bulk-email-upload.tsx">
            <div className="flex justify-between items-center border-b border-border p-4" data-unique-id="cd8e8993-579e-4a07-a725-6fe58175b355" data-file-name="components/bulk-email-upload.tsx">
              <h3 className="font-medium text-lg" data-unique-id="1cd397e5-ba0b-44f9-a7c7-f1c1167d0a58" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="04471f73-5b34-4363-92f7-0216468fe6cb" data-file-name="components/bulk-email-upload.tsx">Select Customers</span></h3>
              <button onClick={() => {
            setShowCustomerSelector(false);
            setSelectedCustomerIds([]);
          }} className="p-1 rounded-full hover:bg-accent/20" data-unique-id="977bcfe5-0500-41bd-ac92-01c083303b97" data-file-name="components/bulk-email-upload.tsx">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto" data-unique-id="504e89f3-fd86-45f4-b17d-4b9bb4e80594" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
              {savedCustomers.length === 0 ? <div className="text-center py-8 text-muted-foreground" data-unique-id="c6f7a4c4-20cc-45b8-a713-d94cff2fb3e3" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="f8e94ea5-7bfe-4699-9a04-55d084914b73" data-file-name="components/bulk-email-upload.tsx">
                  No saved customers found. Add customers in the Customers tab.
                </span></div> : <div data-unique-id="de7f6823-ab4f-46df-bee2-78e97d3488da" data-file-name="components/bulk-email-upload.tsx">
                  <div className="mb-4 flex justify-between items-center" data-unique-id="90551b72-746d-4f36-b7e0-36b8b7eaf296" data-file-name="components/bulk-email-upload.tsx">
                    <div className="text-sm text-muted-foreground" data-unique-id="1cba5f51-e0e3-4ab3-a674-5a9edb7914e4" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                      {selectedCustomerIds.length}<span className="editable-text" data-unique-id="b7e1fc15-06c6-43ef-92ee-080cf19b2541" data-file-name="components/bulk-email-upload.tsx"> of </span>{savedCustomers.length}<span className="editable-text" data-unique-id="a909da9d-37cf-4ef5-ad7d-04390d8ec14f" data-file-name="components/bulk-email-upload.tsx"> customers selected
                    </span></div>
                    <button onClick={() => setSelectedCustomerIds(savedCustomers.map(c => c.id))} className="text-sm text-primary" data-unique-id="8b56b8df-b5da-47f4-b60f-ac17890c2b5f" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="5c2503cd-f3cd-46b7-bf93-c4206e13e90a" data-file-name="components/bulk-email-upload.tsx">
                      Select All
                    </span></button>
                  </div>
                  
                  <div className="border border-border rounded-md overflow-hidden" data-unique-id="1c175096-8ee6-47a8-855c-1934cc1e2f01" data-file-name="components/bulk-email-upload.tsx">
                    <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="5c0b43e3-55c7-4cd5-bed1-2ac41025aa5a" data-file-name="components/bulk-email-upload.tsx">
                      <div className="col-span-1" data-unique-id="c4df4546-d350-4e3c-aaf8-d5e9b9204170" data-file-name="components/bulk-email-upload.tsx"></div>
                      <div className="col-span-4" data-unique-id="c179a4ff-e148-4399-b059-7f531ec47911" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="d873065b-4d9b-4276-a1b7-c29ebf48e15c" data-file-name="components/bulk-email-upload.tsx">Name</span></div>
                      <div className="col-span-4" data-unique-id="11e46871-7386-4f8b-8a1f-ee85d0b5d3eb" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="039dd97f-2dfd-4b66-b1eb-6208e0c90ccd" data-file-name="components/bulk-email-upload.tsx">Email</span></div>
                      <div className="col-span-3" data-unique-id="3739c750-034b-4a4c-a026-ec788dcb3aa6" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="2b726976-ec89-45d1-bc9c-3869b3d72061" data-file-name="components/bulk-email-upload.tsx">Company</span></div>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto" data-unique-id="8e346b59-75b0-40af-8a67-f0738464facd" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                      {savedCustomers.map(customer => <div key={customer.id} onClick={() => toggleCustomerSelection(customer.id)} className={`grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm cursor-pointer ${selectedCustomerIds.includes(customer.id) ? 'bg-accent/20' : 'hover:bg-accent/5'}`} data-unique-id="7938d8ce-ccda-438e-bf1a-6942833e329b" data-file-name="components/bulk-email-upload.tsx">
                          <div className="col-span-1" data-unique-id="4b8aa330-9d39-4414-9a42-85d3bad590b9" data-file-name="components/bulk-email-upload.tsx">
                            <input type="checkbox" checked={selectedCustomerIds.includes(customer.id)} onChange={e => {
                      e.stopPropagation();
                      toggleCustomerSelection(customer.id);
                    }} className="rounded border-gray-300" data-unique-id="08bd3242-01a7-4be0-96a4-3b3816cd3940" data-file-name="components/bulk-email-upload.tsx" />
                          </div>
                          <div className="col-span-4 truncate" data-unique-id="3234710b-465f-47da-bb04-f7073b5c0ea8" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.name}</div>
                          <div className="col-span-4 truncate" data-unique-id="70ae56b1-0f01-4773-baf0-86a890e44c91" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.email}</div>
                          <div className="col-span-3 truncate" data-unique-id="56d749d4-f96d-43b4-ad23-4246784c1c69" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.company || '—'}</div>
                        </div>)}
                    </div>
                  </div>
                </div>}
            </div>
            
            <div className="border-t border-border p-4 flex justify-end space-x-2" data-unique-id="72565f38-3a64-4c22-a41a-dae5529a5f7a" data-file-name="components/bulk-email-upload.tsx">
              <button onClick={() => {
            setShowCustomerSelector(false);
            setSelectedCustomerIds([]);
          }} className="px-4 py-2 border border-border rounded-md hover:bg-accent/10" data-unique-id="af51484f-6c90-4bf8-ad15-b93ae1517274" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="3f28f4bb-0ca4-45d4-88a8-0c1d4dc3f23a" data-file-name="components/bulk-email-upload.tsx">
                Cancel
              </span></button>
              <button onClick={addSelectedCustomersToEmailList} disabled={selectedCustomerIds.length === 0} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50" data-unique-id="d9f3056f-cd9d-4d10-8805-5262a8d8a3fc" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="bf00a1a9-73cf-4320-b462-3ae33997100b" data-file-name="components/bulk-email-upload.tsx">
                Add </span>{selectedCustomerIds.length}<span className="editable-text" data-unique-id="5b82c772-21d5-47f8-9e2e-ff984ecdeb03" data-file-name="components/bulk-email-upload.tsx"> Customers
              </span></button>
            </div>
          </div>
        </div>}
    </motion.div>;
}