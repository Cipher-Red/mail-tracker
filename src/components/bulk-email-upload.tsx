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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="edb3eff1-22ba-48ad-a336-cf3fa0114ad1" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
      <div className="mb-6" data-unique-id="323ec568-9b16-45ea-89b1-59af97eef848" data-file-name="components/bulk-email-upload.tsx">
        <h2 className="text-xl font-medium mb-2" data-unique-id="8ec85185-6b6b-46f9-a384-331f59fed93a" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="7aad0938-d060-4280-93c6-50a71db5e7f8" data-file-name="components/bulk-email-upload.tsx">Bulk Email Sender</span></h2>
        <p className="text-muted-foreground" data-unique-id="a5581eaf-7955-4566-99ce-f44bc6d90cea" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="f64fcb02-3bd0-47dd-8053-e1337f597914" data-file-name="components/bulk-email-upload.tsx">
          Upload customer data or select saved customers to send bulk emails
        </span></p>
      </div>
      
      {/* Sending mode selector */}
      <div className="mb-6" data-unique-id="a9930292-f947-433b-9c46-961fec7799ff" data-file-name="components/bulk-email-upload.tsx">
        <div className="bg-white p-5 border border-border rounded-md shadow-sm" data-unique-id="30589b4a-9340-4904-8f9e-591334f92ba0" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium mb-4 text-base flex items-center" data-unique-id="1a56b0b3-91cd-4f91-be6e-648706ca59c9" data-file-name="components/bulk-email-upload.tsx">
            <Mail className="mr-2 h-5 w-5 text-primary" /><span className="editable-text" data-unique-id="4fb6e1f6-da7b-472a-8ff1-f453d65e2dd4" data-file-name="components/bulk-email-upload.tsx">
            Email Sending Method
          </span></h3>
          
          <div className="grid grid-cols-2 gap-4" data-unique-id="7b8eacdc-5b71-421a-9191-9034e03fd6ca" data-file-name="components/bulk-email-upload.tsx">
            <button onClick={() => setManualSendMode(false)} disabled={!isEmailServiceAvailable} className={`p-4 rounded-md border ${!manualSendMode ? 'border-primary bg-primary/5' : 'border-border'} flex flex-col items-center text-center transition-all ${!isEmailServiceAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}`} data-unique-id="8905e0df-3a8c-4a0b-9c11-beb139d18510" data-file-name="components/bulk-email-upload.tsx">
              <Send className="h-8 w-8 text-primary mb-2" />
              <div className="font-medium mb-1" data-unique-id="63fcd7b5-56ee-4d0a-81e3-3467657f997d" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="68d053da-ba59-4f9d-96a2-720e4ba54ad6" data-file-name="components/bulk-email-upload.tsx">Automated Sending</span></div>
              <div className="text-xs text-muted-foreground" data-unique-id="6e7da617-d463-4463-a704-22b8381badf3" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {isEmailServiceAvailable ? "Emails will be sent automatically via the system" : "Email service not configured"}
              </div>
            </button>
            
            <button onClick={() => setManualSendMode(true)} className={`p-4 rounded-md border ${manualSendMode ? 'border-primary bg-primary/5' : 'border-border'} flex flex-col items-center text-center transition-all hover:border-primary/50`} data-unique-id="4f77f076-6a1f-453a-9735-4208db043a7b" data-file-name="components/bulk-email-upload.tsx">
              <ExternalLink className="h-8 w-8 text-primary mb-2" />
              <div className="font-medium mb-1" data-unique-id="070447b2-a25f-4ca1-8841-d663f95e59d7" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="0867813c-e738-4f39-978f-39371a40936d" data-file-name="components/bulk-email-upload.tsx">Manual Sending</span></div>
              <div className="text-xs text-muted-foreground" data-unique-id="e70c8525-d87a-434a-8c53-c5a3a7ccf6fb" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="ff0794e1-4b6b-4fdc-93ad-d8741c08ccea" data-file-name="components/bulk-email-upload.tsx">
                Review and send emails through your own email client
              </span></div>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 space-y-4" data-unique-id="d125feaa-f336-4978-ae3e-67ea048da872" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
        <div className="bg-white p-5 border border-border rounded-md shadow-sm" data-unique-id="971cbf03-1bb4-4b45-bd99-9686cdee0707" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="947c3e5a-8248-4ec1-a8e9-4de61e718271" data-file-name="components/bulk-email-upload.tsx">
            <UserRound className="mr-2 h-4 w-4 text-primary" />
            <span className="editable-text" data-unique-id="f8162354-1fca-4171-8dc6-2e5150183cbd" data-file-name="components/bulk-email-upload.tsx">Employee Sender Information</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2" data-unique-id="b4f0931a-c61d-4797-87be-fd47c00fe855" data-file-name="components/bulk-email-upload.tsx">
            <div data-unique-id="f6eb6ac9-1c25-486b-b6e8-04ec83a3d6f5" data-file-name="components/bulk-email-upload.tsx">
              <label htmlFor="senderName" className="block text-sm font-medium mb-1" data-unique-id="051adc86-9d91-4ecd-99a0-616f09d4beea" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="8056b320-f49d-496e-8f7a-7df5748d0f05" data-file-name="components/bulk-email-upload.tsx">Employee Name</span>
              </label>
              <input id="senderName" type="text" value={senderName} onChange={e => {
              setSenderName(e.target.value);
              handleSenderInfoChange();
            }} placeholder="John Smith" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="0f05bbd9-c574-414d-9c2b-0e1818e0fffe" data-file-name="components/bulk-email-upload.tsx" />
            </div>
            
            <div data-unique-id="d285807d-e2bb-417d-af5e-e7159bc74534" data-file-name="components/bulk-email-upload.tsx">
              <label htmlFor="senderEmail" className="block text-sm font-medium mb-1" data-unique-id="6c9ad285-2401-48ab-9862-10151136f092" data-file-name="components/bulk-email-upload.tsx">
                <Mail className="inline-block h-3 w-3 mr-1 text-muted-foreground" />
                <span className="editable-text" data-unique-id="078f0b18-83f5-433e-978e-d64e72627d35" data-file-name="components/bulk-email-upload.tsx">Employee Email</span>
              </label>
              <input id="senderEmail" type="email" value={senderEmail} onChange={e => {
              setSenderEmail(e.target.value);
              handleSenderInfoChange();
            }} placeholder="employee@detroitaxle.com" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="eae0ab0d-cf18-4b99-9a2e-722dbdbb5601" data-file-name="components/bulk-email-upload.tsx" />
              <p className="text-xs text-muted-foreground mt-1" data-unique-id="1afb5854-722b-4770-adca-4e413d8495bf" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="5261116f-33bc-4e79-95a7-5e280abc4b32" data-file-name="components/bulk-email-upload.tsx">This employee will appear as the sender of all emails</span>
              </p>
            </div>
          </div>
        </div>
        
      {/* Import Order Data Alert - Show when order data is available */}
      {hasOrderData && <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md animate-pulse" data-unique-id="fa0e4223-6353-4826-9f46-9be441cfaaae" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center justify-between" data-unique-id="d29d7abd-45f1-4df9-8b17-40be7517ed67" data-file-name="components/bulk-email-upload.tsx">
            <div className="flex items-center" data-unique-id="0a7d17ae-16d9-42ea-a366-e660b6008816" data-file-name="components/bulk-email-upload.tsx">
              <PackageCheck className="h-5 w-5 text-blue-500 mr-3" />
              <div data-unique-id="e9e3b717-7add-4550-a90f-7563250ae4c1" data-file-name="components/bulk-email-upload.tsx">
                <h4 className="font-medium text-blue-700" data-unique-id="5bc49fe6-27f0-49e7-83ca-cb8a33e327c0" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="39918229-c046-4eb6-83ad-a04522861667" data-file-name="components/bulk-email-upload.tsx">Order Data Available</span></h4>
                <p className="text-sm text-blue-600" data-unique-id="7ca9ebd3-567b-4cca-861a-5277fdd2b74f" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="a382e0c6-69df-4edb-8065-7d05044ed796" data-file-name="components/bulk-email-upload.tsx">
                  Order data from the Order Processor is ready to be imported for email sending
                </span></p>
              </div>
            </div>
            
            <button onClick={importOrderData} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" data-unique-id="456d11bc-6b9a-4257-bc95-6bd722e98d32" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="54cf9c14-b699-4792-8d13-328eb8b417b3" data-file-name="components/bulk-email-upload.tsx">
              Import Order Data
            </span></button>
          </div>
        </div>}
    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" data-unique-id="0708a9cb-6553-4bee-94ed-9668efd23ada" data-file-name="components/bulk-email-upload.tsx">
          <div className="bg-white p-5 border border-border rounded-md shadow-sm" data-unique-id="321a34dd-9aba-458d-a5aa-e93f4271b337" data-file-name="components/bulk-email-upload.tsx">
            <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="01fabea9-ff0e-4e53-8ed2-cdc7da5f672d" data-file-name="components/bulk-email-upload.tsx">
              <Users className="mr-2 h-4 w-4 text-primary" />
              <span className="editable-text" data-unique-id="2c3229ea-76e4-408f-872b-677f0effc50d" data-file-name="components/bulk-email-upload.tsx">Select Saved Customers</span>
            </h3>
            
            <div className="flex flex-col space-y-4" data-unique-id="685d76ba-7c56-488c-9667-6c0a0fddd10d" data-file-name="components/bulk-email-upload.tsx">
              <p className="text-sm" data-unique-id="c238139d-4d7e-4974-819b-3210b261e93a" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {savedCustomers.length > 0 ? `You have ${savedCustomers.length} saved customers` : "No saved customers found. Add customers in the Customers tab."}
              </p>
              
              <button onClick={() => setShowCustomerSelector(true)} disabled={savedCustomers.length === 0} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50" data-unique-id="155fae4b-b425-4d58-bafd-ede92fd00d7c" data-file-name="components/bulk-email-upload.tsx">
                <PlusCircle className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="f507f2e6-aa9d-4d82-978d-8c2686d95b16" data-file-name="components/bulk-email-upload.tsx">
                Select Customers
              </span></button>
            </div>
          </div>
          
          <div className="bg-white p-5 border border-border rounded-md shadow-sm" data-unique-id="82e729b2-570e-40f6-bb73-7eaf81dce840" data-file-name="components/bulk-email-upload.tsx">
            <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="4d787450-f52a-4493-aaeb-ab29261d2690" data-file-name="components/bulk-email-upload.tsx">
              <FileSpreadsheet className="mr-2 h-4 w-4 text-primary" />
              <span className="editable-text" data-unique-id="da2b13eb-c1e8-43e1-9495-5ba86c627fe6" data-file-name="components/bulk-email-upload.tsx">Customer Data Import</span>
            </h3>
            
            <div className="flex flex-col space-y-4" data-unique-id="642545aa-7cb5-4852-a105-c85936e2344e" data-file-name="components/bulk-email-upload.tsx">
              <input type="file" ref={fileInputRef} accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" id="excel-upload" data-unique-id="1a317cf9-7096-4036-8292-ee1c3c67a927" data-file-name="components/bulk-email-upload.tsx" />
              
              <div className="flex items-center space-x-2" data-unique-id="f80c7de4-a734-479a-acf8-ce96f3cd12dd" data-file-name="components/bulk-email-upload.tsx">
                <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50" data-unique-id="7e839696-e641-489b-83dc-3ac77c094a8e" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
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
              }} className="text-primary underline text-sm hover:text-primary/90" data-unique-id="be41e75c-eba2-43c6-995c-4e5decf0e0a3" data-file-name="components/bulk-email-upload.tsx">
                  <span className="editable-text" data-unique-id="220ad1bc-91da-4d96-af39-80ebd9a14734" data-file-name="components/bulk-email-upload.tsx">Download Excel Template</span>
                </button>
              </div>
              
              <p className="text-xs text-muted-foreground" data-unique-id="823693be-f9ba-4ade-8a0a-0b54d0ae1f75" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="5f9feb72-88af-46cb-8e18-ff26bd912065" data-file-name="components/bulk-email-upload.tsx">Upload an Excel file (.xlsx or .xls) with customer information</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6" data-unique-id="a2d1a5f6-2f36-46b2-aa6c-1ba6276532ac" data-file-name="components/bulk-email-upload.tsx">
        <div className="flex justify-between items-center mb-3" data-unique-id="d6f51a76-92a2-4326-a267-903cdd973e94" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium" data-unique-id="76cd58fc-a90e-4e2c-b684-14deeed3de79" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="99a2f78f-1766-4295-8b94-7a074cd91e32" data-file-name="components/bulk-email-upload.tsx">Customer Data</span></h3>
          <button onClick={addCustomer} className="text-sm text-primary hover:underline" data-unique-id="f8d4b1b0-9878-4d9f-951b-87cb1512a052" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="0e143c01-6d08-437e-94a7-580ddc7bbc2f" data-file-name="components/bulk-email-upload.tsx">
            + Add Customer
          </span></button>
        </div>
        
        <div className="border border-border rounded-md overflow-hidden" data-unique-id="754884e8-0dd9-4bf0-a705-0ad70e771b58" data-file-name="components/bulk-email-upload.tsx">
          <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="aece0535-46fc-40f8-9cb1-c10d00be9310" data-file-name="components/bulk-email-upload.tsx">
            <div className="col-span-3" data-unique-id="15499737-56c8-404e-8b2f-3c6d672f58f8" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="706ba5d3-af9d-4185-929e-3a5c58d5012a" data-file-name="components/bulk-email-upload.tsx">Name</span></div>
            <div className="col-span-3" data-unique-id="37519639-f2b8-4946-a1da-6f3cbcb6ed97" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="c40486bf-9b51-45e3-a465-8119c8b725ff" data-file-name="components/bulk-email-upload.tsx">Order Number</span></div>
            <div className="col-span-3" data-unique-id="5f14608e-9e46-4d5d-b2b6-8116bb8f6c7d" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="3c217bdb-da2e-449d-bb1f-06f8fc3adadd" data-file-name="components/bulk-email-upload.tsx">Tracking Number</span></div>
            <div className="col-span-2" data-unique-id="9e761dc6-97af-479c-b9ff-265c7cb851ec" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="c43524fa-5ccf-4d66-8874-170767353ea3" data-file-name="components/bulk-email-upload.tsx">Status</span></div>
            <div className="col-span-1" data-unique-id="484b0599-4cf6-4383-a9a1-8b7c52b55254" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="8498e727-a8a4-4dcd-8129-81fc5f387cf3" data-file-name="components/bulk-email-upload.tsx">Actions</span></div>
          </div>
          
          <div className="max-h-64 overflow-y-auto" data-unique-id="9548e657-50a6-4ccb-82ae-cce7b00f49c6" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {customers.map(customer => <div key={customer.id} className="grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm" data-unique-id="5b34da32-012d-4edf-aafa-fd0f63bbf01e" data-file-name="components/bulk-email-upload.tsx">
                <div className="col-span-3" data-unique-id="8bd4b66e-9fd0-4907-96ac-415d6ec377bb" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.name} onChange={e => updateCustomer(customer.id, "name", e.target.value)} placeholder="Customer Name" className="w-full p-1 border border-border rounded text-sm" data-unique-id="203f9355-464f-465f-a1e9-ee0db3f2bb60" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-3" data-unique-id="7a8a2b3c-5d99-4b04-b8f6-0fbc5d6d7f2c" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.orderNumber} onChange={e => updateCustomer(customer.id, "orderNumber", e.target.value)} placeholder="Order #" className="w-full p-1 border border-border rounded text-sm" data-unique-id="c94126a7-1d54-4140-b45b-aa7354b6fcae" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-3" data-unique-id="5a52142a-cf2c-4ddc-ac40-97fbb722e996" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.trackingNumber} onChange={e => updateCustomer(customer.id, "trackingNumber", e.target.value)} placeholder="Tracking #" className="w-full p-1 border border-border rounded text-sm" data-unique-id="8fa96a25-ee1f-4072-bc5b-557d97be9ebc" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-2" data-unique-id="e206e6bc-3a42-4739-9f6c-331176e95cd9" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                  {sentStatus[customer.id] ? <span className="flex items-center text-green-600" data-unique-id="6de1c5ca-9610-4652-a7e2-c8c21968bb1a" data-file-name="components/bulk-email-upload.tsx">
                      <Check className="h-4 w-4 mr-1" />
                      <span data-unique-id="fe43883e-a71d-4f90-b52d-50d44f07d5de" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="8c40ba21-9556-4a12-b706-dde14cc89585" data-file-name="components/bulk-email-upload.tsx">Sent</span></span>
                    </span> : failedEmails && failedEmails[customer.id] ? <span className="flex items-center text-red-600" title={failedEmails[customer.id]} data-unique-id="69937dd8-f34a-40b8-891d-c81d320957f8" data-file-name="components/bulk-email-upload.tsx">
                      <X className="h-4 w-4 mr-1" />
                      <span data-unique-id="f0a48522-90d9-4425-acc4-fe66b0b181c8" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="0c7391ef-e65a-40e5-b453-db6f27870f70" data-file-name="components/bulk-email-upload.tsx">Failed</span></span>
                    </span> : <span className="text-muted-foreground" data-unique-id="f1ebef8e-8cf3-4884-aaaa-db02ba9efef6" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="a481eeba-d2d7-4779-a8ad-e2e10d3826ac" data-file-name="components/bulk-email-upload.tsx">
                      Pending
                    </span></span>}
                </div>
                <div className="col-span-1 flex justify-end" data-unique-id="2f87060c-5143-4d4c-9261-3d62a71fea73" data-file-name="components/bulk-email-upload.tsx">
                  <button onClick={() => removeCustomer(customer.id)} className="text-destructive hover:bg-destructive/10 p-1 rounded" data-unique-id="00edc129-e4a3-4698-88d8-295c7db1d2a1" data-file-name="components/bulk-email-upload.tsx">
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
      {manualSendMode && customers.length > 0 && Object.keys(reviewedEmails).length > 0 && <div className="mb-6 p-4 border border-primary/20 rounded-md bg-accent/5" data-unique-id="d5fa5ad5-34eb-48e6-86fb-af2d1a125b5d" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center justify-between" data-unique-id="4d54d471-c119-450e-9bcb-8efd8c627541" data-file-name="components/bulk-email-upload.tsx">
            <div data-unique-id="b89e6696-d5e2-4a43-8a88-3e3164b1f3d4" data-file-name="components/bulk-email-upload.tsx">
              <h3 className="font-medium flex items-center" data-unique-id="607bcf4f-8c3c-4dc0-b31f-2a5b47547293" data-file-name="components/bulk-email-upload.tsx">
                <Eye className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="8a3a32ff-3f61-4075-8d74-8f08c5cb89b6" data-file-name="components/bulk-email-upload.tsx">
                Email Preview & Manual Send
              </span></h3>
              <p className="text-sm text-muted-foreground mt-1" data-unique-id="48909b12-18c5-420c-ab45-8f27ac39c3f0" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {getCompletionPercentage()}<span className="editable-text" data-unique-id="dfdb6e86-bce7-4f19-82e6-78129b74a8b0" data-file-name="components/bulk-email-upload.tsx">% complete (</span>{Object.values(sentStatus).filter(Boolean).length}<span className="editable-text" data-unique-id="879bd3e9-d694-464b-9a87-631ef09b06bd" data-file-name="components/bulk-email-upload.tsx"> of </span>{customers.length}<span className="editable-text" data-unique-id="7eaa96f6-4006-44b0-a230-6402a3651e12" data-file-name="components/bulk-email-upload.tsx"> emails sent)
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
        }} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="f924db86-4456-4657-b707-87e56c4f4dad" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="2b7f49f9-ee6e-4c15-907d-a8e131b010f0" data-file-name="components/bulk-email-upload.tsx">
              Continue Sending Emails
            </span></button>
          </div>
          
          <div className="w-full bg-gray-200 h-2 mt-4 rounded-full" data-unique-id="e513ac55-9d83-49cf-ba53-612d7d781961" data-file-name="components/bulk-email-upload.tsx">
            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{
          width: `${getCompletionPercentage()}%`
        }} data-unique-id="512cd97b-8a15-4c74-a086-28ee2c93a27e" data-file-name="components/bulk-email-upload.tsx"></div>
          </div>
        </div>}
      
      {manualSendMode ? <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md" data-unique-id="be56f2ed-0e3a-4591-b7bf-af46a021030b" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="2ee76bfd-f684-461c-9eb1-6997c039971b" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-amber-600" />
            <p className="text-amber-800 font-medium" data-unique-id="754c0670-36d5-48a3-9167-7fa32f41e287" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="6012d696-8ef3-4ce7-b816-f0c4ecf4b243" data-file-name="components/bulk-email-upload.tsx">Manual Email Sending Mode</span></p>
          </div>
          <p className="mt-1 text-sm text-amber-700" data-unique-id="45eac8eb-1af9-45aa-8f32-09c2a7ba613a" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="7e4bcbfa-b19c-4875-973f-373036ba1092" data-file-name="components/bulk-email-upload.tsx">
            You are in manual email sending mode. After clicking "Send Emails", you'll be guided through 
            reviewing each email. You can copy the content and send it using your own email client.
          </span></p>
          <p className="mt-1 text-sm text-amber-700" data-unique-id="a392de69-af99-499c-bf68-038158d610e7" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="994d61ae-5762-4ebb-a39f-b6a59300bf92" data-file-name="components/bulk-email-upload.tsx">
            Don't forget to mark emails as sent after you've sent them to keep track of your progress.
          </span></p>
        </div> : sendingError ? <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md" data-unique-id="0e99d857-d008-4664-9481-5761cb863609" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="1e1986f4-7d24-4f13-94e3-2ce9b784b882" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
            <p className="text-red-800 font-medium" data-unique-id="92b9dcaf-8569-48d5-b2d0-23e17d943a04" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="0469e7c1-b7fe-418f-b926-99262278823d" data-file-name="components/bulk-email-upload.tsx">Error Sending Emails</span></p>
          </div>
          <p className="mt-1 text-sm text-red-700" data-unique-id="1e3b1788-d77e-49b9-8135-4c4cc2199bd2" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {sendingError}
          </p>
          <div className="mt-2 text-xs text-red-600" data-unique-id="237395b1-8a95-4928-b8f1-782ba5a38983" data-file-name="components/bulk-email-upload.tsx">
            <button className="underline" onClick={() => {
          setManualSendMode(true);
          alert("Switched to manual sending mode. You'll be able to send emails through your own email client.");
        }} data-unique-id="50951d59-a379-4856-b6e0-82ff95496083" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="8d7ab2ea-3f34-4395-a4d9-b3e3abd2d0be" data-file-name="components/bulk-email-upload.tsx">
              Switch to manual sending mode
            </span></button>
            <span className="mx-2" data-unique-id="0e0c5255-6835-41ec-b43c-f2fa42de10c6" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="4e81689e-7d23-4bf5-8d7e-c66378dc376c" data-file-name="components/bulk-email-upload.tsx">•</span></span>
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
        }} data-unique-id="ba1a6ad9-ed6e-4a46-8a4a-26e9b781c260" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="6ca88ebc-9300-4268-9c2b-170ca3134956" data-file-name="components/bulk-email-upload.tsx">
              Show Debug Info
            </span></button>
          </div>
        </div> : <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md" data-unique-id="9a540a61-2288-4006-8f86-42ae00c0ed91" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="0255012f-6066-4974-9f25-3a11b49134e2" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
            <p className="text-blue-800 font-medium" data-unique-id="d9043aea-4358-4a1c-8544-94c7cf748a0d" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
              {isEmailServiceAvailable ? "Email Sending Enabled" : "Email Service Not Configured"}
            </p>
          </div>
          <p className="mt-1 text-sm text-blue-700" data-unique-id="220fcc64-abef-4c0b-8eb2-e1e4ecf159d9" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {isEmailServiceAvailable ? "This application is now connected to a real email service. Emails will be sent to the customer email addresses provided. Please ensure all email addresses are valid and have opted in to receive communications." : "The email service is not configured properly. You can use manual mode to send emails through your own email client."}
          </p>
        </div>}
      
      {sendingProgress > 0 && sendingProgress < 100 && <div className="mb-4" data-unique-id="8dcee678-de58-41d2-98af-6ad745ea15fa" data-file-name="components/bulk-email-upload.tsx">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden" data-unique-id="fcc58507-9b30-4560-b3cd-f20b47eab4bb" data-file-name="components/bulk-email-upload.tsx">
            <div className="h-full bg-primary transition-all duration-300 ease-out" style={{
          width: `${sendingProgress}%`
        }} data-unique-id="0744e192-2a9e-4667-b0d4-fc36dbbd1f67" data-file-name="components/bulk-email-upload.tsx"></div>
          </div>
          <p className="text-xs text-right mt-1 text-gray-500" data-unique-id="9bd1a12b-b977-4c23-871a-96002c5d3123" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="c27cf594-3497-4840-8d84-b0128c5c949f" data-file-name="components/bulk-email-upload.tsx">Sending email: </span>{sendingProgress}<span className="editable-text" data-unique-id="52f7cac0-bc52-411a-a0b3-fcd44a3eeb11" data-file-name="components/bulk-email-upload.tsx">% complete</span></p>
        </div>}
      
      <div className="flex items-center justify-between" data-unique-id="ca218fa5-5891-478e-84fc-75c86ad36077" data-file-name="components/bulk-email-upload.tsx">
        <div className="flex items-center text-sm text-muted-foreground" data-unique-id="3e6357b9-055a-4f25-9abb-5833ba048f8f" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
          <AlertCircle className="h-4 w-4 mr-1" />
          {customers.length}<span className="editable-text" data-unique-id="35409e27-a013-4fa2-b242-80884c792cc2" data-file-name="components/bulk-email-upload.tsx"> customers loaded
        </span></div>
        
        <button onClick={sendEmails} disabled={isSending || customers.length === 0} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50" data-unique-id="1d39c7f5-bd7c-43b9-a4ca-f50c98abe9d3" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
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
    }} data-unique-id="8393e47b-62bb-483c-bbcc-c01578dcd56f" data-file-name="components/bulk-email-upload.tsx">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()} data-unique-id="08f959eb-25dc-4501-9eff-32cc9c2967a1" data-file-name="components/bulk-email-upload.tsx">
            <div className="flex justify-between items-center border-b border-border p-4" data-unique-id="70b47c4a-6f46-4a53-a2ee-2a7a132e5bc3" data-file-name="components/bulk-email-upload.tsx">
              <h3 className="font-medium text-lg" data-unique-id="9169b730-3cc8-4e8a-9a7c-8268c3dc09c9" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="98c28f93-5c68-4a15-ae9e-ec3fb83d723b" data-file-name="components/bulk-email-upload.tsx">Select Customers</span></h3>
              <button onClick={() => {
            setShowCustomerSelector(false);
            setSelectedCustomerIds([]);
          }} className="p-1 rounded-full hover:bg-accent/20" data-unique-id="3d5be70f-ea4c-46ad-8a07-160e2eedf761" data-file-name="components/bulk-email-upload.tsx">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto" data-unique-id="b1a9a61a-152f-49c8-a150-b34c0c5c06db" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
              {savedCustomers.length === 0 ? <div className="text-center py-8 text-muted-foreground" data-unique-id="387ab149-e2fa-4762-8470-b27a06837688" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="59cb1e66-e098-4ea6-bb7d-ea318c318165" data-file-name="components/bulk-email-upload.tsx">
                  No saved customers found. Add customers in the Customers tab.
                </span></div> : <div data-unique-id="f63d2e95-5f18-4894-b69d-ca99a20b9fb8" data-file-name="components/bulk-email-upload.tsx">
                  <div className="mb-4 flex justify-between items-center" data-unique-id="ab5a2dc3-464a-4437-b92e-3b4dba20c2b8" data-file-name="components/bulk-email-upload.tsx">
                    <div className="text-sm text-muted-foreground" data-unique-id="bac43455-e3d6-48d0-b420-5a53f5d3a72c" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                      {selectedCustomerIds.length}<span className="editable-text" data-unique-id="dfbda9af-5fe1-4a94-9363-e76183f3d861" data-file-name="components/bulk-email-upload.tsx"> of </span>{savedCustomers.length}<span className="editable-text" data-unique-id="882496cc-6e77-4e0a-98ed-6c67d8e49da1" data-file-name="components/bulk-email-upload.tsx"> customers selected
                    </span></div>
                    <button onClick={() => setSelectedCustomerIds(savedCustomers.map(c => c.id))} className="text-sm text-primary" data-unique-id="14836204-1999-4112-8252-518d86a96f3f" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="4f8ab926-4db9-4dbe-aeef-5947ee2be3f7" data-file-name="components/bulk-email-upload.tsx">
                      Select All
                    </span></button>
                  </div>
                  
                  <div className="border border-border rounded-md overflow-hidden" data-unique-id="3d92c603-53f9-4d3a-87c8-e89e6338884b" data-file-name="components/bulk-email-upload.tsx">
                    <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="79428d00-aaff-49a4-b87e-cbe8f8d9bbb4" data-file-name="components/bulk-email-upload.tsx">
                      <div className="col-span-1" data-unique-id="6508f2b8-3d4c-443a-b380-f4481d1e9a69" data-file-name="components/bulk-email-upload.tsx"></div>
                      <div className="col-span-4" data-unique-id="ac3008df-1af9-422f-bf18-97d31f3ac2b1" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="a69bdc52-8544-4d9a-9cbf-7021ee90a705" data-file-name="components/bulk-email-upload.tsx">Name</span></div>
                      <div className="col-span-4" data-unique-id="f67b1e05-413c-40d7-9ea5-a85352097da2" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="d1604d5f-f407-4240-b279-84bf5a488e51" data-file-name="components/bulk-email-upload.tsx">Email</span></div>
                      <div className="col-span-3" data-unique-id="119c33e3-9c4e-46a8-b413-66f17fe3a42f" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="134085f1-e887-4064-8ddb-0dd6eee757ca" data-file-name="components/bulk-email-upload.tsx">Company</span></div>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto" data-unique-id="22a39a5f-9ab4-4875-9916-a3e0ef86f90c" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                      {savedCustomers.map(customer => <div key={customer.id} onClick={() => toggleCustomerSelection(customer.id)} className={`grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm cursor-pointer ${selectedCustomerIds.includes(customer.id) ? 'bg-accent/20' : 'hover:bg-accent/5'}`} data-unique-id="8d3720ac-1783-4753-9bb3-d60ce3cedd09" data-file-name="components/bulk-email-upload.tsx">
                          <div className="col-span-1" data-unique-id="3816c276-8d2c-4857-b14a-c86f6186fbc9" data-file-name="components/bulk-email-upload.tsx">
                            <input type="checkbox" checked={selectedCustomerIds.includes(customer.id)} onChange={e => {
                      e.stopPropagation();
                      toggleCustomerSelection(customer.id);
                    }} className="rounded border-gray-300" data-unique-id="e9edc9e6-a27f-41db-a702-368b113abac1" data-file-name="components/bulk-email-upload.tsx" />
                          </div>
                          <div className="col-span-4 truncate" data-unique-id="949311ff-243b-49e2-8e15-9995c4efe74f" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.name}</div>
                          <div className="col-span-4 truncate" data-unique-id="acf70789-7385-447c-a514-8cec853383eb" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.email}</div>
                          <div className="col-span-3 truncate" data-unique-id="fd86c652-04dd-4538-85b6-22da415d8281" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.company || '—'}</div>
                        </div>)}
                    </div>
                  </div>
                </div>}
            </div>
            
            <div className="border-t border-border p-4 flex justify-end space-x-2" data-unique-id="8f0f9bbb-54b3-40d8-aa0f-53ec63c2ed61" data-file-name="components/bulk-email-upload.tsx">
              <button onClick={() => {
            setShowCustomerSelector(false);
            setSelectedCustomerIds([]);
          }} className="px-4 py-2 border border-border rounded-md hover:bg-accent/10" data-unique-id="8f16b68a-c36f-4cc9-bce1-afd47212bba2" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="ba3d96d2-8272-46ed-bd00-b499e956a1e2" data-file-name="components/bulk-email-upload.tsx">
                Cancel
              </span></button>
              <button onClick={addSelectedCustomersToEmailList} disabled={selectedCustomerIds.length === 0} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50" data-unique-id="a4152662-a353-4af9-8fe1-ff0ab25bc6bb" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="f9ee677c-f884-44be-ae4e-e06ac004642a" data-file-name="components/bulk-email-upload.tsx">
                Add </span>{selectedCustomerIds.length}<span className="editable-text" data-unique-id="feb6819b-be70-48cc-8b3c-7e23fc46a024" data-file-name="components/bulk-email-upload.tsx"> Customers
              </span></button>
            </div>
          </div>
        </div>}
    </motion.div>;
}