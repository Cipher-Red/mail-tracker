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

    // Check for order data from the order processor
    try {
      const orderData = localStorage.getItem('orderDataForEmails');
      if (orderData) {
        setHasOrderData(true);
      }
    } catch (error) {
      console.error("Error checking for order data:", error);
    }
  }, []);

  // Function to import order data from the order processor
  const importOrderData = () => {
    try {
      if (typeof window === 'undefined') return;

      // Safely access localStorage
      const storage = typeof window !== 'undefined' ? window.localStorage : null;
      const orderDataString = storage?.getItem('orderDataForEmails');
      if (!orderDataString) {
        alert("No order data available. Please process orders first.");
        return;
      }
      const orderData = JSON.parse(orderDataString);

      // Convert order data to customer format
      const newCustomers: CustomerData[] = orderData.map((order: any) => ({
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        name: order.shipToName || '',
        email: order.shipToEmail || `customer-${order.customerOrderNumber}@example.com`,
        // Fallback if no email
        orderNumber: order.customerOrderNumber || '',
        trackingNumber: Array.isArray(order.trackingNumbers) && order.trackingNumbers.length > 0 ? order.trackingNumbers[0] : '',
        address: `${order.shipToLine1}, ${order.shipToCity}, ${order.shipToStateProvince} ${order.shipToPostalCode}`,
        orderDate: order.actualShipDate || new Date().toISOString().split('T')[0],
        items: order.orderSummary || ''
      }));

      // Add to existing customers
      setCustomers([...customers, ...newCustomers]);

      // Clear the order data to prevent duplicate imports
      if (typeof window !== 'undefined') {
        // Additional safety check to ensure localStorage is available
        const storage = window.localStorage;
        storage.removeItem('orderDataForEmails');
      }
      setHasOrderData(false);
      alert(`${newCustomers.length} customers imported from order data!`);
    } catch (error) {
      console.error("Error importing order data:", error);
      alert("Error importing order data. Please try again.");
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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="ccad07e5-a9d2-4d64-a4f2-a767b66db624" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
      <div className="mb-6" data-unique-id="31eeb6e5-c81c-46c7-a866-58288097c544" data-file-name="components/bulk-email-upload.tsx">
        <h2 className="text-xl font-medium mb-2" data-unique-id="fe875b7c-e7b1-4a1d-99cc-7684222f9881" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="2c45d48a-1a85-4250-94fd-c337c8edd59a" data-file-name="components/bulk-email-upload.tsx">Bulk Email Sender</span></h2>
        <p className="text-muted-foreground" data-unique-id="23da0ca0-7ca4-45d9-8f28-3655e9b04c49" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="6fd56bd1-0324-4b87-ad48-0ee91c3e6c98" data-file-name="components/bulk-email-upload.tsx">
          Upload customer data or select saved customers to send bulk emails
        </span></p>
      </div>
      
      {/* Sending mode selector */}
      <div className="mb-6" data-unique-id="ac3d7325-2ba4-4bde-928b-2d693e73e6ed" data-file-name="components/bulk-email-upload.tsx">
        <div className="bg-white p-5 border border-border rounded-md shadow-sm" data-unique-id="018f072d-bf26-43c2-80e8-1c386aa2b4d3" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium mb-4 text-base flex items-center" data-unique-id="63499130-b605-4a84-b24b-7ac33c918bf2" data-file-name="components/bulk-email-upload.tsx">
            <Mail className="mr-2 h-5 w-5 text-primary" /><span className="editable-text" data-unique-id="24b2148f-f933-4fb7-996f-9d113a1fd388" data-file-name="components/bulk-email-upload.tsx">
            Email Sending Method
          </span></h3>
          
          <div className="grid grid-cols-2 gap-4" data-unique-id="38bc0392-57db-4c51-8709-7fbf1a9e4efa" data-file-name="components/bulk-email-upload.tsx">
            <button onClick={() => setManualSendMode(false)} disabled={!isEmailServiceAvailable} className={`p-4 rounded-md border ${!manualSendMode ? 'border-primary bg-primary/5' : 'border-border'} flex flex-col items-center text-center transition-all ${!isEmailServiceAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}`} data-unique-id="39c949b3-5efc-4404-96c2-068b1f14d048" data-file-name="components/bulk-email-upload.tsx">
              <Send className="h-8 w-8 text-primary mb-2" />
              <div className="font-medium mb-1" data-unique-id="32d54ff8-f25b-44fe-b6af-6c1b81339bb2" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="6ad16638-daf3-43cd-9fb7-40741e9f13f3" data-file-name="components/bulk-email-upload.tsx">Automated Sending</span></div>
              <div className="text-xs text-muted-foreground" data-unique-id="a0ee856d-f124-40c0-8ced-dfc9ae3c89f6" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {isEmailServiceAvailable ? "Emails will be sent automatically via the system" : "Email service not configured"}
              </div>
            </button>
            
            <button onClick={() => setManualSendMode(true)} className={`p-4 rounded-md border ${manualSendMode ? 'border-primary bg-primary/5' : 'border-border'} flex flex-col items-center text-center transition-all hover:border-primary/50`} data-unique-id="380b5c2c-2e89-463b-af1a-54741f4597b7" data-file-name="components/bulk-email-upload.tsx">
              <ExternalLink className="h-8 w-8 text-primary mb-2" />
              <div className="font-medium mb-1" data-unique-id="4c9c2e27-ab37-4f87-b8df-b24e8d53703f" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="7807db92-757b-4321-a2d5-98d43881d6b3" data-file-name="components/bulk-email-upload.tsx">Manual Sending</span></div>
              <div className="text-xs text-muted-foreground" data-unique-id="6d519fd9-7772-450b-9350-01082cb79778" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="bad8fceb-0f1a-4334-9f81-6eec633948bf" data-file-name="components/bulk-email-upload.tsx">
                Review and send emails through your own email client
              </span></div>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 space-y-4" data-unique-id="601055ce-8861-46ec-bc56-51ba3d0882bf" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
        <div className="bg-white p-5 border border-border rounded-md shadow-sm" data-unique-id="50ef6f40-803c-431f-8935-572827708e12" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="116439ee-8591-4835-8722-ac96b8451062" data-file-name="components/bulk-email-upload.tsx">
            <UserRound className="mr-2 h-4 w-4 text-primary" />
            <span className="editable-text" data-unique-id="918fde5c-09c4-4bf2-a8fe-dcf86e5311e2" data-file-name="components/bulk-email-upload.tsx">Employee Sender Information</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2" data-unique-id="039ed084-0880-426a-a202-bd9a9eb62aaf" data-file-name="components/bulk-email-upload.tsx">
            <div data-unique-id="cdc3487e-5e58-4fb4-8df6-38ca311b2bbe" data-file-name="components/bulk-email-upload.tsx">
              <label htmlFor="senderName" className="block text-sm font-medium mb-1" data-unique-id="08c19ec4-2338-4550-b4ad-f26ba011a2e7" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="366ec772-9bd2-487d-af06-021eefcfd640" data-file-name="components/bulk-email-upload.tsx">Employee Name</span>
              </label>
              <input id="senderName" type="text" value={senderName} onChange={e => {
              setSenderName(e.target.value);
              handleSenderInfoChange();
            }} placeholder="John Smith" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="b2048899-4806-4518-8c37-be14fb878441" data-file-name="components/bulk-email-upload.tsx" />
            </div>
            
            <div data-unique-id="0561e13a-b6e1-4af6-aff6-fd0c2259d911" data-file-name="components/bulk-email-upload.tsx">
              <label htmlFor="senderEmail" className="block text-sm font-medium mb-1" data-unique-id="1ddb0272-fde1-40cf-9ca5-401c25fe35f0" data-file-name="components/bulk-email-upload.tsx">
                <Mail className="inline-block h-3 w-3 mr-1 text-muted-foreground" />
                <span className="editable-text" data-unique-id="8bc75fb1-a749-49cd-91d0-afd2f0478693" data-file-name="components/bulk-email-upload.tsx">Employee Email</span>
              </label>
              <input id="senderEmail" type="email" value={senderEmail} onChange={e => {
              setSenderEmail(e.target.value);
              handleSenderInfoChange();
            }} placeholder="employee@detroitaxle.com" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="73bbf821-38f9-4153-898b-e104712ac53c" data-file-name="components/bulk-email-upload.tsx" />
              <p className="text-xs text-muted-foreground mt-1" data-unique-id="c624a9e8-dcca-4d94-b7a6-c462a049e7d6" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="6ae00d78-28d3-4b78-99f2-1fa4c2d26a7e" data-file-name="components/bulk-email-upload.tsx">This employee will appear as the sender of all emails</span>
              </p>
            </div>
          </div>
        </div>
        
      {/* Import Order Data Alert - Show when order data is available */}
      {hasOrderData && <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md animate-pulse" data-unique-id="ad99b5e1-9678-4bc9-9bde-3e03e60f8913" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center justify-between" data-unique-id="c26436dc-766d-464b-a2c9-6f94befd27bb" data-file-name="components/bulk-email-upload.tsx">
            <div className="flex items-center" data-unique-id="9865fded-c99b-4cd3-957c-492b3c65e399" data-file-name="components/bulk-email-upload.tsx">
              <PackageCheck className="h-5 w-5 text-blue-500 mr-3" />
              <div data-unique-id="4f091282-182d-45b1-b304-bce2a00e99d9" data-file-name="components/bulk-email-upload.tsx">
                <h4 className="font-medium text-blue-700" data-unique-id="6d2fdfdb-c9e4-4412-8af2-e7e845874ab2" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="34914d99-e624-4795-b0ca-0da7bdc267b7" data-file-name="components/bulk-email-upload.tsx">Order Data Available</span></h4>
                <p className="text-sm text-blue-600" data-unique-id="deefa174-a295-40d4-98c0-ba1cfef4f6dd" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="73a60e26-1b1b-4990-99b7-5b4936b13c4d" data-file-name="components/bulk-email-upload.tsx">
                  Order data from the Order Processor is ready to be imported for email sending
                </span></p>
              </div>
            </div>
            
            <button onClick={importOrderData} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" data-unique-id="70812495-9538-4781-8f06-f205625135e1" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="e48f8e68-e3f4-4c29-9d64-1c97931c6396" data-file-name="components/bulk-email-upload.tsx">
              Import Order Data
            </span></button>
          </div>
        </div>}
    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" data-unique-id="319f1d29-a99a-4b46-843f-ff994316ec92" data-file-name="components/bulk-email-upload.tsx">
          <div className="bg-white p-5 border border-border rounded-md shadow-sm" data-unique-id="3d4292ff-fb65-467c-97fa-25df88d8ac43" data-file-name="components/bulk-email-upload.tsx">
            <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="6a2f4aca-9bcb-40c3-b3d0-485bec9bb9d8" data-file-name="components/bulk-email-upload.tsx">
              <Users className="mr-2 h-4 w-4 text-primary" />
              <span className="editable-text" data-unique-id="b4f0da5b-84f6-45ae-bea5-10a2322dfecb" data-file-name="components/bulk-email-upload.tsx">Select Saved Customers</span>
            </h3>
            
            <div className="flex flex-col space-y-4" data-unique-id="a522a496-4d2b-4f87-ab65-e6038c2e6b95" data-file-name="components/bulk-email-upload.tsx">
              <p className="text-sm" data-unique-id="45767d37-2840-4614-b187-2237fe608a52" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {savedCustomers.length > 0 ? `You have ${savedCustomers.length} saved customers` : "No saved customers found. Add customers in the Customers tab."}
              </p>
              
              <button onClick={() => setShowCustomerSelector(true)} disabled={savedCustomers.length === 0} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50" data-unique-id="9d0017c5-4daf-4eb9-9e32-351f127861cb" data-file-name="components/bulk-email-upload.tsx">
                <PlusCircle className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="3f2e14a4-f1e4-4e27-b734-b88f6e137bb1" data-file-name="components/bulk-email-upload.tsx">
                Select Customers
              </span></button>
            </div>
          </div>
          
          <div className="bg-white p-5 border border-border rounded-md shadow-sm" data-unique-id="a793baa6-4efc-4576-96f3-89211aee9235" data-file-name="components/bulk-email-upload.tsx">
            <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="ea468199-8ae3-4985-974e-dfef22acab21" data-file-name="components/bulk-email-upload.tsx">
              <FileSpreadsheet className="mr-2 h-4 w-4 text-primary" />
              <span className="editable-text" data-unique-id="b02ee58c-4784-411c-85d7-c38fedbbb6d9" data-file-name="components/bulk-email-upload.tsx">Customer Data Import</span>
            </h3>
            
            <div className="flex flex-col space-y-4" data-unique-id="09e151a9-e3c4-428f-a9c5-33265063db38" data-file-name="components/bulk-email-upload.tsx">
              <input type="file" ref={fileInputRef} accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" id="excel-upload" data-unique-id="ce1d22d8-c149-4a7e-82aa-71179263756c" data-file-name="components/bulk-email-upload.tsx" />
              
              <div className="flex items-center space-x-2" data-unique-id="1c8b4673-ac46-4736-a3e6-cafd0a8a764d" data-file-name="components/bulk-email-upload.tsx">
                <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50" data-unique-id="ddfeec3d-d188-4d52-8fb2-b9453dc0ad4c" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
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
              }} className="text-primary underline text-sm hover:text-primary/90" data-unique-id="e70125de-de41-46d2-9246-84fbb6343b57" data-file-name="components/bulk-email-upload.tsx">
                  <span className="editable-text" data-unique-id="073c051f-df72-4e2c-97d8-f6826d8408ca" data-file-name="components/bulk-email-upload.tsx">Download Excel Template</span>
                </button>
              </div>
              
              <p className="text-xs text-muted-foreground" data-unique-id="21553fe7-11b4-4486-9a04-7dc3503b3336" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="aaff2ffc-1605-47a5-859a-5d1e00a4b3bb" data-file-name="components/bulk-email-upload.tsx">Upload an Excel file (.xlsx or .xls) with customer information</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6" data-unique-id="99899654-52b5-4997-b9fb-ea0ee85d6ddb" data-file-name="components/bulk-email-upload.tsx">
        <div className="flex justify-between items-center mb-3" data-unique-id="5eb80de9-010b-40dc-bb9a-3bd2077b45ae" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium" data-unique-id="5ee98e46-2a16-4dcd-a9d7-00bd21dd7889" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="78d68e42-347d-46d3-90f7-6034d6477d34" data-file-name="components/bulk-email-upload.tsx">Customer Data</span></h3>
          <button onClick={addCustomer} className="text-sm text-primary hover:underline" data-unique-id="e69ddc93-0b60-4f03-8dde-556e20a4b83c" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="90e92c61-31c9-4d43-9f18-30a283821aea" data-file-name="components/bulk-email-upload.tsx">
            + Add Customer
          </span></button>
        </div>
        
        <div className="border border-border rounded-md overflow-hidden" data-unique-id="e7264626-63a9-4a95-a36d-a3a6e6086d7a" data-file-name="components/bulk-email-upload.tsx">
          <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="9dfadb25-ba94-4a9b-bab9-22bc049fe1f7" data-file-name="components/bulk-email-upload.tsx">
            <div className="col-span-3" data-unique-id="35e2e76f-f89c-445a-b2da-403f412e120e" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="40a6d761-0531-4db0-9dfe-d3135e6e2892" data-file-name="components/bulk-email-upload.tsx">Name</span></div>
            <div className="col-span-3" data-unique-id="9db4d334-8767-4916-b03c-a7e4df23d4f4" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="ccbc384e-ca9f-410a-81e5-d186af6b045b" data-file-name="components/bulk-email-upload.tsx">Order Number</span></div>
            <div className="col-span-3" data-unique-id="af7a2152-9302-43c0-a37a-19086ad09ca3" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="38565621-0a9a-41b6-bfae-18663574d2d2" data-file-name="components/bulk-email-upload.tsx">Tracking Number</span></div>
            <div className="col-span-2" data-unique-id="50975790-b577-4683-a2c5-822c8aa33628" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="60affa08-1209-4c8b-8b4d-7e528d8577a1" data-file-name="components/bulk-email-upload.tsx">Status</span></div>
            <div className="col-span-1" data-unique-id="76344614-4607-465d-83b2-6d4981257bd6" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="50cb152f-cd2e-41b1-8bf6-9819b2e9aab5" data-file-name="components/bulk-email-upload.tsx">Actions</span></div>
          </div>
          
          <div className="max-h-64 overflow-y-auto" data-unique-id="a756ba2c-939a-4a3c-8dd0-f93c535ab403" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {customers.map(customer => <div key={customer.id} className="grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm" data-unique-id="155a840f-aade-48f8-9eab-6b895ce91abb" data-file-name="components/bulk-email-upload.tsx">
                <div className="col-span-3" data-unique-id="d77cc775-6403-4f45-9008-828040472e47" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.name} onChange={e => updateCustomer(customer.id, "name", e.target.value)} placeholder="Customer Name" className="w-full p-1 border border-border rounded text-sm" data-unique-id="80aaa726-5283-4750-9a34-5a09a164f899" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-3" data-unique-id="cdfea49a-4b3b-45d1-a056-89fb710a1819" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.orderNumber} onChange={e => updateCustomer(customer.id, "orderNumber", e.target.value)} placeholder="Order #" className="w-full p-1 border border-border rounded text-sm" data-unique-id="18b349ba-2777-482a-bbd9-2b8d7a21451c" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-3" data-unique-id="8c7622de-1210-48bc-8e6e-6690e81d8140" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.trackingNumber} onChange={e => updateCustomer(customer.id, "trackingNumber", e.target.value)} placeholder="Tracking #" className="w-full p-1 border border-border rounded text-sm" data-unique-id="6300189e-ac53-482f-b06b-682068682f35" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-2" data-unique-id="47450a34-6d7a-4757-8e52-c2cd8d13b298" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                  {sentStatus[customer.id] ? <span className="flex items-center text-green-600" data-unique-id="4cb47be6-cd6c-4047-9bfb-ba5643f416a0" data-file-name="components/bulk-email-upload.tsx">
                      <Check className="h-4 w-4 mr-1" />
                      <span data-unique-id="fda6d177-e48a-49d5-959b-0688435df531" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="8f4b94c6-796d-4f51-96a4-093d6d6fde66" data-file-name="components/bulk-email-upload.tsx">Sent</span></span>
                    </span> : failedEmails && failedEmails[customer.id] ? <span className="flex items-center text-red-600" title={failedEmails[customer.id]} data-unique-id="9c36548a-ea50-4af6-b7d2-13148ff5bf1d" data-file-name="components/bulk-email-upload.tsx">
                      <X className="h-4 w-4 mr-1" />
                      <span data-unique-id="77956e79-7c10-4d5c-afe8-859f4d63b274" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="b2d9403c-63d8-4f4c-966d-a6f239afbe2a" data-file-name="components/bulk-email-upload.tsx">Failed</span></span>
                    </span> : <span className="text-muted-foreground" data-unique-id="c0a1a4b5-d08f-41ec-b836-006ece3d0859" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="6232d517-2c8c-44b1-b10f-c43ebca9e95c" data-file-name="components/bulk-email-upload.tsx">
                      Pending
                    </span></span>}
                </div>
                <div className="col-span-1 flex justify-end" data-unique-id="7bdb8a07-1e01-4c46-ba12-7a80a68a375f" data-file-name="components/bulk-email-upload.tsx">
                  <button onClick={() => removeCustomer(customer.id)} className="text-destructive hover:bg-destructive/10 p-1 rounded" data-unique-id="9f6e334c-6815-4636-ba24-424364157e3f" data-file-name="components/bulk-email-upload.tsx">
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
      {manualSendMode && customers.length > 0 && Object.keys(reviewedEmails).length > 0 && <div className="mb-6 p-4 border border-primary/20 rounded-md bg-accent/5" data-unique-id="c8ffa44a-05a8-4c63-8c64-c362b695056d" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center justify-between" data-unique-id="97173952-3602-4b28-b8f3-1ff7e67ec5ae" data-file-name="components/bulk-email-upload.tsx">
            <div data-unique-id="b0587e37-432a-4e97-8390-54e815075cff" data-file-name="components/bulk-email-upload.tsx">
              <h3 className="font-medium flex items-center" data-unique-id="3d529cf9-bfa4-403a-b5ed-092c5c85d553" data-file-name="components/bulk-email-upload.tsx">
                <Eye className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="1862f480-2f79-4b1e-acd1-b9bccfcc7a6c" data-file-name="components/bulk-email-upload.tsx">
                Email Preview & Manual Send
              </span></h3>
              <p className="text-sm text-muted-foreground mt-1" data-unique-id="dc95d257-d71e-4317-a4ec-7f70c49917f0" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {getCompletionPercentage()}<span className="editable-text" data-unique-id="cd09e880-c77b-4790-a3da-5dd59e25ae75" data-file-name="components/bulk-email-upload.tsx">% complete (</span>{Object.values(sentStatus).filter(Boolean).length}<span className="editable-text" data-unique-id="7703703f-a001-477d-8890-4c651bf1a89f" data-file-name="components/bulk-email-upload.tsx"> of </span>{customers.length}<span className="editable-text" data-unique-id="e0953d42-a5cf-4c56-9c27-4ab89005c26c" data-file-name="components/bulk-email-upload.tsx"> emails sent)
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
        }} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="ff8bf7fe-5a70-4047-9042-62110535ea4f" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="ef1507c0-5760-40f3-9d47-1c98eb6af268" data-file-name="components/bulk-email-upload.tsx">
              Continue Sending Emails
            </span></button>
          </div>
          
          <div className="w-full bg-gray-200 h-2 mt-4 rounded-full" data-unique-id="940feb61-28f8-4ce6-8c6d-da47143d66bf" data-file-name="components/bulk-email-upload.tsx">
            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{
          width: `${getCompletionPercentage()}%`
        }} data-unique-id="dc2c79a4-c35e-44f1-9e03-95c6b62419a9" data-file-name="components/bulk-email-upload.tsx"></div>
          </div>
        </div>}
      
      {manualSendMode ? <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md" data-unique-id="ede5384e-1848-42b2-8535-5ff7dbbe122b" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="c0d26b0b-0b5f-4b40-aa97-e37017fc1d11" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-amber-600" />
            <p className="text-amber-800 font-medium" data-unique-id="3018c85e-1953-49bc-95e3-0acab75da172" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="e884f665-f3a0-4109-8ca4-332c470d15dd" data-file-name="components/bulk-email-upload.tsx">Manual Email Sending Mode</span></p>
          </div>
          <p className="mt-1 text-sm text-amber-700" data-unique-id="7d95eeaf-b753-4924-8f1d-75ce8358a123" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="aec185a2-be9d-46a9-8556-0ee75a33b5d5" data-file-name="components/bulk-email-upload.tsx">
            You are in manual email sending mode. After clicking "Send Emails", you'll be guided through 
            reviewing each email. You can copy the content and send it using your own email client.
          </span></p>
          <p className="mt-1 text-sm text-amber-700" data-unique-id="beb24eee-a658-43f2-8ac1-098e3568b1be" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="b2215a29-f992-45ea-b826-2a2efa5c409f" data-file-name="components/bulk-email-upload.tsx">
            Don't forget to mark emails as sent after you've sent them to keep track of your progress.
          </span></p>
        </div> : sendingError ? <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md" data-unique-id="3aa18d1b-8ca6-484a-9f28-0b3be8b8f66b" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="55b8c4e6-f69c-436a-bb7a-b1de6ee277ab" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
            <p className="text-red-800 font-medium" data-unique-id="2e8d1414-9bc2-4b98-be2e-d220a99d1e14" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="15383313-4e4e-43a0-ae3b-42345e05f435" data-file-name="components/bulk-email-upload.tsx">Error Sending Emails</span></p>
          </div>
          <p className="mt-1 text-sm text-red-700" data-unique-id="5b4a670f-75dd-4430-a9ad-8515e173c75d" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {sendingError}
          </p>
          <div className="mt-2 text-xs text-red-600" data-unique-id="82121748-3467-46e7-8c3f-f55dedd30eb5" data-file-name="components/bulk-email-upload.tsx">
            <button className="underline" onClick={() => {
          setManualSendMode(true);
          alert("Switched to manual sending mode. You'll be able to send emails through your own email client.");
        }} data-unique-id="cc4e2db0-c45b-4ff6-8ed3-b23a4e14bd82" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="a93f4bdf-8975-4391-ba0f-bb5cc26ba902" data-file-name="components/bulk-email-upload.tsx">
              Switch to manual sending mode
            </span></button>
            <span className="mx-2" data-unique-id="9c9b13d8-b6cc-4d56-9f47-2d62f6567e29" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="359ba058-c064-474f-b570-fec964935c14" data-file-name="components/bulk-email-upload.tsx">•</span></span>
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
        }} data-unique-id="554a1940-e2a7-4dbd-8fa2-ab247a011664" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="3e542891-9e16-45fc-b5cf-c3d498dedc23" data-file-name="components/bulk-email-upload.tsx">
              Show Debug Info
            </span></button>
          </div>
        </div> : <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md" data-unique-id="a1f1a980-0c41-426c-8ef7-c90257e710e6" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="f7353b9d-c9b7-4b80-b3fe-b70eeb86e705" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
            <p className="text-blue-800 font-medium" data-unique-id="d0f75fca-7968-4acc-8e02-a7855e1183c1" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
              {isEmailServiceAvailable ? "Email Sending Enabled" : "Email Service Not Configured"}
            </p>
          </div>
          <p className="mt-1 text-sm text-blue-700" data-unique-id="a9f81df6-33c5-461b-8926-4fd75062ae25" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {isEmailServiceAvailable ? "This application is now connected to a real email service. Emails will be sent to the customer email addresses provided. Please ensure all email addresses are valid and have opted in to receive communications." : "The email service is not configured properly. You can use manual mode to send emails through your own email client."}
          </p>
        </div>}
      
      {sendingProgress > 0 && sendingProgress < 100 && <div className="mb-4" data-unique-id="8edf41dc-9d85-4a18-b1b1-11150f74f007" data-file-name="components/bulk-email-upload.tsx">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden" data-unique-id="9925ac1c-9c26-4818-957e-e5abdb5efbc9" data-file-name="components/bulk-email-upload.tsx">
            <div className="h-full bg-primary transition-all duration-300 ease-out" style={{
          width: `${sendingProgress}%`
        }} data-unique-id="9833f5b4-1f3c-47f8-93e4-bac2b4864d80" data-file-name="components/bulk-email-upload.tsx"></div>
          </div>
          <p className="text-xs text-right mt-1 text-gray-500" data-unique-id="a4b42e33-965a-4be1-abc2-d52a1855e4dd" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="638b466a-f6a1-4c86-ba23-5538e7bbe139" data-file-name="components/bulk-email-upload.tsx">Sending email: </span>{sendingProgress}<span className="editable-text" data-unique-id="09046a18-2f0e-4e52-ba73-24fc33f3892f" data-file-name="components/bulk-email-upload.tsx">% complete</span></p>
        </div>}
      
      <div className="flex items-center justify-between" data-unique-id="c7356c19-ef01-4ed6-8fd2-6454750fe11f" data-file-name="components/bulk-email-upload.tsx">
        <div className="flex items-center text-sm text-muted-foreground" data-unique-id="ce2ca8f8-d0c0-4f12-9d83-e2d924284110" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
          <AlertCircle className="h-4 w-4 mr-1" />
          {customers.length}<span className="editable-text" data-unique-id="8ec88f6c-d95e-45df-a42a-5fedc2c61211" data-file-name="components/bulk-email-upload.tsx"> customers loaded
        </span></div>
        
        <button onClick={sendEmails} disabled={isSending || customers.length === 0} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50" data-unique-id="ca2607e0-9381-449b-b57f-c01286ecff51" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
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
    }} data-unique-id="bec6dcaf-1b83-47c6-a96a-048f85cffd85" data-file-name="components/bulk-email-upload.tsx">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()} data-unique-id="290da3c5-4e93-43bd-8049-e3fde19f42e5" data-file-name="components/bulk-email-upload.tsx">
            <div className="flex justify-between items-center border-b border-border p-4" data-unique-id="c34c72c3-ccc0-484d-ae49-2b0e663de2d4" data-file-name="components/bulk-email-upload.tsx">
              <h3 className="font-medium text-lg" data-unique-id="9941e3dd-b543-4db2-9874-69b65816f523" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="019c0970-1622-40ec-a075-67c86cc53ae2" data-file-name="components/bulk-email-upload.tsx">Select Customers</span></h3>
              <button onClick={() => {
            setShowCustomerSelector(false);
            setSelectedCustomerIds([]);
          }} className="p-1 rounded-full hover:bg-accent/20" data-unique-id="324c38da-8e24-427d-a7f2-9da6447a0fb7" data-file-name="components/bulk-email-upload.tsx">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto" data-unique-id="3ea8e92a-2624-4d3d-b471-22dac6730bee" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
              {savedCustomers.length === 0 ? <div className="text-center py-8 text-muted-foreground" data-unique-id="46873767-5e71-40e4-9890-2750a26f8436" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="5dd1d74b-1451-4853-a42f-d38c6cbcfe6b" data-file-name="components/bulk-email-upload.tsx">
                  No saved customers found. Add customers in the Customers tab.
                </span></div> : <div data-unique-id="98f331e5-6a02-4bf6-ba27-e7cc53142ddc" data-file-name="components/bulk-email-upload.tsx">
                  <div className="mb-4 flex justify-between items-center" data-unique-id="b7dd11b7-454f-4fcb-bff1-780183303722" data-file-name="components/bulk-email-upload.tsx">
                    <div className="text-sm text-muted-foreground" data-unique-id="9e1b7b11-e76a-4f5f-8dee-69d92c6ae580" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                      {selectedCustomerIds.length}<span className="editable-text" data-unique-id="efaa29f9-4fa3-416b-81d5-cef2d51c847f" data-file-name="components/bulk-email-upload.tsx"> of </span>{savedCustomers.length}<span className="editable-text" data-unique-id="27a1285a-a019-46ba-b9c1-d2257e89ea11" data-file-name="components/bulk-email-upload.tsx"> customers selected
                    </span></div>
                    <button onClick={() => setSelectedCustomerIds(savedCustomers.map(c => c.id))} className="text-sm text-primary" data-unique-id="2fb0bb24-665e-43ec-80f1-c04f74d3d6d1" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="51f7c79d-06ec-478f-8c7e-d0014dea25e2" data-file-name="components/bulk-email-upload.tsx">
                      Select All
                    </span></button>
                  </div>
                  
                  <div className="border border-border rounded-md overflow-hidden" data-unique-id="d7db32c7-c499-47e3-b71c-f9ba6f5cbec8" data-file-name="components/bulk-email-upload.tsx">
                    <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="08976e57-f2a1-420d-b742-632deb71df49" data-file-name="components/bulk-email-upload.tsx">
                      <div className="col-span-1" data-unique-id="829d7320-ba92-402b-b22a-8789545e47ff" data-file-name="components/bulk-email-upload.tsx"></div>
                      <div className="col-span-4" data-unique-id="81ffc4c6-fdf1-4acb-af7d-a78f5a6027e7" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="5026a4a2-982f-459a-b84f-06a9ceb7fc42" data-file-name="components/bulk-email-upload.tsx">Name</span></div>
                      <div className="col-span-4" data-unique-id="1fe9b5ef-502f-4900-9c75-181930fba8f6" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="639f8a5e-c6de-4579-99d7-c00af249f96b" data-file-name="components/bulk-email-upload.tsx">Email</span></div>
                      <div className="col-span-3" data-unique-id="8959349b-d6e5-45ff-b5e3-286ae6634639" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="56688605-cf2a-4680-9684-4947bee6933a" data-file-name="components/bulk-email-upload.tsx">Company</span></div>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto" data-unique-id="9fb59a78-f43a-4131-b884-969ba234f1e0" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                      {savedCustomers.map(customer => <div key={customer.id} onClick={() => toggleCustomerSelection(customer.id)} className={`grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm cursor-pointer ${selectedCustomerIds.includes(customer.id) ? 'bg-accent/20' : 'hover:bg-accent/5'}`} data-unique-id="7958119c-1498-41be-8573-6ec06fa88799" data-file-name="components/bulk-email-upload.tsx">
                          <div className="col-span-1" data-unique-id="fb4ac0fb-1f27-406c-be6d-36aa1f824650" data-file-name="components/bulk-email-upload.tsx">
                            <input type="checkbox" checked={selectedCustomerIds.includes(customer.id)} onChange={e => {
                      e.stopPropagation();
                      toggleCustomerSelection(customer.id);
                    }} className="rounded border-gray-300" data-unique-id="fa66454e-7b74-4c50-8a22-93fe6fc1d7fa" data-file-name="components/bulk-email-upload.tsx" />
                          </div>
                          <div className="col-span-4 truncate" data-unique-id="e90cf8ed-e65a-42d6-a97b-1ac366bc00c7" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.name}</div>
                          <div className="col-span-4 truncate" data-unique-id="b494777e-de47-4433-820a-2459919ceda7" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.email}</div>
                          <div className="col-span-3 truncate" data-unique-id="c39ffde6-b1d1-4453-b070-50a377a36fdc" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.company || '—'}</div>
                        </div>)}
                    </div>
                  </div>
                </div>}
            </div>
            
            <div className="border-t border-border p-4 flex justify-end space-x-2" data-unique-id="61c7eeaa-1c6b-4d1f-9c16-3f5bb4f893d5" data-file-name="components/bulk-email-upload.tsx">
              <button onClick={() => {
            setShowCustomerSelector(false);
            setSelectedCustomerIds([]);
          }} className="px-4 py-2 border border-border rounded-md hover:bg-accent/10" data-unique-id="57fe8524-0f8b-431c-b1d3-314ca66c67cd" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="c0d315bc-05e5-432a-94cd-4561fd542a04" data-file-name="components/bulk-email-upload.tsx">
                Cancel
              </span></button>
              <button onClick={addSelectedCustomersToEmailList} disabled={selectedCustomerIds.length === 0} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50" data-unique-id="8d2c7346-f563-4446-9c1d-35c6627b0f6f" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="cd60f11e-2b93-4eab-bc89-7c4b7d3839ad" data-file-name="components/bulk-email-upload.tsx">
                Add </span>{selectedCustomerIds.length}<span className="editable-text" data-unique-id="fc2c4182-ccce-48d6-8a9e-7954835c6b87" data-file-name="components/bulk-email-upload.tsx"> Customers
              </span></button>
            </div>
          </div>
        </div>}
    </motion.div>;
}