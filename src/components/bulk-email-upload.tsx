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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="09ddf80f-51ab-4b51-b7b1-2f3caf197bfe" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
      <div className="mb-6" data-unique-id="60ac98ac-66f8-4dc4-af35-a89ef30a8787" data-file-name="components/bulk-email-upload.tsx">
        <h2 className="text-xl font-medium mb-2" data-unique-id="85150a2f-d90d-48af-8711-9b8e3515967f" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="8dfa8763-2e03-4b82-b5ac-9a9bd662e47c" data-file-name="components/bulk-email-upload.tsx">Bulk Email Sender</span></h2>
        <p className="text-muted-foreground" data-unique-id="443e1a86-b626-480a-9c08-9cef2eac3a42" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="675ffdf5-f6cb-4f13-8cb8-dec15e9572e2" data-file-name="components/bulk-email-upload.tsx">
          Upload customer data or select saved customers to send bulk emails
        </span></p>
      </div>
      
      {/* Sending mode selector */}
      <div className="mb-6" data-unique-id="caed6a6b-b670-4be5-8e79-94ecd3555012" data-file-name="components/bulk-email-upload.tsx">
        <div className="bg-white p-5 border border-border rounded-md shadow-sm" data-unique-id="2eb696dd-a6a0-4375-a6f2-6ea6959d4a26" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium mb-4 text-base flex items-center" data-unique-id="f18f1df7-98d9-404f-ac0f-e1a91ce7de21" data-file-name="components/bulk-email-upload.tsx">
            <Mail className="mr-2 h-5 w-5 text-primary" /><span className="editable-text" data-unique-id="2078ea2b-0d59-46fc-8716-ecf5f8175dee" data-file-name="components/bulk-email-upload.tsx">
            Email Sending Method
          </span></h3>
          
          <div className="grid grid-cols-2 gap-4" data-unique-id="e481ed88-c6b6-4479-b59b-2168ee8a0698" data-file-name="components/bulk-email-upload.tsx">
            <button onClick={() => setManualSendMode(false)} disabled={!isEmailServiceAvailable} className={`p-4 rounded-md border ${!manualSendMode ? 'border-primary bg-primary/5' : 'border-border'} flex flex-col items-center text-center transition-all ${!isEmailServiceAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}`} data-unique-id="b0793f9c-ecc2-404f-8ba8-b87300393c1c" data-file-name="components/bulk-email-upload.tsx">
              <Send className="h-8 w-8 text-primary mb-2" />
              <div className="font-medium mb-1" data-unique-id="3271870b-db6a-4e30-82a5-2f74e71a2ab8" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="2b0f05e4-7960-4d93-873b-7e3d7426a1ea" data-file-name="components/bulk-email-upload.tsx">Automated Sending</span></div>
              <div className="text-xs text-muted-foreground" data-unique-id="f5a7b069-3944-47cb-a973-0eae11c64fc3" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {isEmailServiceAvailable ? "Emails will be sent automatically via the system" : "Email service not configured"}
              </div>
            </button>
            
            <button onClick={() => setManualSendMode(true)} className={`p-4 rounded-md border ${manualSendMode ? 'border-primary bg-primary/5' : 'border-border'} flex flex-col items-center text-center transition-all hover:border-primary/50`} data-unique-id="507d1441-df5b-4d70-bd6e-0e5005eba24d" data-file-name="components/bulk-email-upload.tsx">
              <ExternalLink className="h-8 w-8 text-primary mb-2" />
              <div className="font-medium mb-1" data-unique-id="296876fd-af09-4ea7-b3ed-a01b7ff2a572" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="b12733b5-fe15-4804-83cf-686a4d16a2b3" data-file-name="components/bulk-email-upload.tsx">Manual Sending</span></div>
              <div className="text-xs text-muted-foreground" data-unique-id="e9081017-d88a-406f-9be7-01befbe06441" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="b7437d8a-cdf5-4393-bef9-1174d67c71eb" data-file-name="components/bulk-email-upload.tsx">
                Review and send emails through your own email client
              </span></div>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 space-y-4" data-unique-id="865ce54a-904a-4445-8d14-6503b702d4e9" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
        <div className="bg-white p-5 border border-border rounded-md shadow-sm" data-unique-id="09a5862b-597e-4146-910b-e9fa216385c7" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="8993495e-9ff8-4585-b75a-53feb77b1dfa" data-file-name="components/bulk-email-upload.tsx">
            <UserRound className="mr-2 h-4 w-4 text-primary" />
            <span className="editable-text" data-unique-id="b6812b13-7b25-4793-8878-f30848b1adeb" data-file-name="components/bulk-email-upload.tsx">Employee Sender Information</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2" data-unique-id="46d85fa8-13f7-48f8-bf57-458404ff04e3" data-file-name="components/bulk-email-upload.tsx">
            <div data-unique-id="d96937b4-a523-4556-8410-f875ff5911dd" data-file-name="components/bulk-email-upload.tsx">
              <label htmlFor="senderName" className="block text-sm font-medium mb-1" data-unique-id="74f05db2-bd34-4622-a829-a3326d63e67a" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="e6d33dbc-7774-4dfd-9544-6126752541be" data-file-name="components/bulk-email-upload.tsx">Employee Name</span>
              </label>
              <input id="senderName" type="text" value={senderName} onChange={e => {
              setSenderName(e.target.value);
              handleSenderInfoChange();
            }} placeholder="John Smith" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="3e707487-01fe-4002-9d5d-2e13a5ecff9b" data-file-name="components/bulk-email-upload.tsx" />
            </div>
            
            <div data-unique-id="41d9161b-2dc9-4609-8e44-af9046ad8e30" data-file-name="components/bulk-email-upload.tsx">
              <label htmlFor="senderEmail" className="block text-sm font-medium mb-1" data-unique-id="0e44391e-1a0b-4492-98c9-3979c5ff70c3" data-file-name="components/bulk-email-upload.tsx">
                <Mail className="inline-block h-3 w-3 mr-1 text-muted-foreground" />
                <span className="editable-text" data-unique-id="413ba216-6d0d-4979-8396-36284951fa72" data-file-name="components/bulk-email-upload.tsx">Employee Email</span>
              </label>
              <input id="senderEmail" type="email" value={senderEmail} onChange={e => {
              setSenderEmail(e.target.value);
              handleSenderInfoChange();
            }} placeholder="employee@detroitaxle.com" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="0649a71a-118d-4f2c-a32c-b15d75adfe5d" data-file-name="components/bulk-email-upload.tsx" />
              <p className="text-xs text-muted-foreground mt-1" data-unique-id="26d9949a-0b04-4bcf-950e-38e193503dcf" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="8c7f6aa9-54b4-4436-8bde-8258d6ad7b0c" data-file-name="components/bulk-email-upload.tsx">This employee will appear as the sender of all emails</span>
              </p>
            </div>
          </div>
        </div>
        
      {/* Import Order Data Alert - Show when order data is available */}
      {hasOrderData && <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md animate-pulse" data-unique-id="5d93d7a0-26ae-48fb-a99d-b37d2b9b298e" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center justify-between" data-unique-id="b8136cc1-5f60-42f7-aa27-65b0eedc2ef4" data-file-name="components/bulk-email-upload.tsx">
            <div className="flex items-center" data-unique-id="613d879c-a5bf-4898-850c-48c0defaa47a" data-file-name="components/bulk-email-upload.tsx">
              <PackageCheck className="h-5 w-5 text-blue-500 mr-3" />
              <div data-unique-id="1314dd16-57fd-4f91-bf3e-9bf3a7b458cf" data-file-name="components/bulk-email-upload.tsx">
                <h4 className="font-medium text-blue-700" data-unique-id="993f2bad-7b72-4bfb-90fd-2e900c4545ec" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="31666dbc-f61a-4e55-ab40-2967d1d15bde" data-file-name="components/bulk-email-upload.tsx">Order Data Available</span></h4>
                <p className="text-sm text-blue-600" data-unique-id="1c18b5ba-dc43-429a-aac1-dde0be3f34fb" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="f0573b0f-96b9-4f72-9854-e178216d8d64" data-file-name="components/bulk-email-upload.tsx">
                  Order data from the Order Processor is ready to be imported for email sending
                </span></p>
              </div>
            </div>
            
            <button onClick={importOrderData} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" data-unique-id="36c655ca-e41e-4ae6-b39b-7af5b4e54630" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="85fd3e2f-0b58-4ad8-874c-ff9e22e000ed" data-file-name="components/bulk-email-upload.tsx">
              Import Order Data
            </span></button>
          </div>
        </div>}
    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" data-unique-id="ee762e04-a0c1-4e49-b7a8-83b3136a5740" data-file-name="components/bulk-email-upload.tsx">
          <div className="bg-white p-5 border border-border rounded-md shadow-sm" data-unique-id="1e4b8ec3-270e-43a5-acad-6a17292b9401" data-file-name="components/bulk-email-upload.tsx">
            <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="e82e960a-deaf-48ee-91dc-5fdedc6c2237" data-file-name="components/bulk-email-upload.tsx">
              <Users className="mr-2 h-4 w-4 text-primary" />
              <span className="editable-text" data-unique-id="58c5db71-c482-4a63-8fb1-a5daee623fcc" data-file-name="components/bulk-email-upload.tsx">Select Saved Customers</span>
            </h3>
            
            <div className="flex flex-col space-y-4" data-unique-id="3cbdbc94-c4af-4cc0-820f-e639e9f055f4" data-file-name="components/bulk-email-upload.tsx">
              <p className="text-sm" data-unique-id="1e18173b-053d-43ca-b8f3-d56660b7c238" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {savedCustomers.length > 0 ? `You have ${savedCustomers.length} saved customers` : "No saved customers found. Add customers in the Customers tab."}
              </p>
              
              <button onClick={() => setShowCustomerSelector(true)} disabled={savedCustomers.length === 0} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50" data-unique-id="345d0ff0-fe92-4667-942c-7559321c31e9" data-file-name="components/bulk-email-upload.tsx">
                <PlusCircle className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="9ebfc3d7-300d-4e86-ad1e-9c8315163819" data-file-name="components/bulk-email-upload.tsx">
                Select Customers
              </span></button>
            </div>
          </div>
          
          <div className="bg-white p-5 border border-border rounded-md shadow-sm" data-unique-id="796bb9ca-6b82-4248-a4cf-a075563e133a" data-file-name="components/bulk-email-upload.tsx">
            <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="41150199-ee2f-4dca-9381-6680db50e714" data-file-name="components/bulk-email-upload.tsx">
              <FileSpreadsheet className="mr-2 h-4 w-4 text-primary" />
              <span className="editable-text" data-unique-id="3d352688-886a-4db3-9822-72a52821b274" data-file-name="components/bulk-email-upload.tsx">Customer Data Import</span>
            </h3>
            
            <div className="flex flex-col space-y-4" data-unique-id="339e878f-cff9-4f46-aaf8-24be9b8bf231" data-file-name="components/bulk-email-upload.tsx">
              <input type="file" ref={fileInputRef} accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" id="excel-upload" data-unique-id="20b56c05-c759-4183-bc61-4f55de2d3580" data-file-name="components/bulk-email-upload.tsx" />
              
              <div className="flex items-center space-x-2" data-unique-id="0d72d234-4e38-445c-9a59-56f882e6ea6a" data-file-name="components/bulk-email-upload.tsx">
                <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50" data-unique-id="89b9e6bb-3e80-44c0-b615-3e2daa5281f7" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
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
              }} className="text-primary underline text-sm hover:text-primary/90" data-unique-id="3f4fb393-807e-4bc0-acea-8f2fe211a22d" data-file-name="components/bulk-email-upload.tsx">
                  <span className="editable-text" data-unique-id="937306bd-0a7f-4014-9288-829311bf6d4b" data-file-name="components/bulk-email-upload.tsx">Download Excel Template</span>
                </button>
              </div>
              
              <p className="text-xs text-muted-foreground" data-unique-id="0b6116ef-1f22-4b4c-8332-50d41abdee45" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="c2e88368-bc3d-4506-a61d-ff00e7075542" data-file-name="components/bulk-email-upload.tsx">Upload an Excel file (.xlsx or .xls) with customer information</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6" data-unique-id="21a59bbc-b465-4571-a89b-0eb88616d0ed" data-file-name="components/bulk-email-upload.tsx">
        <div className="flex justify-between items-center mb-3" data-unique-id="ce1155ad-080b-4bab-95c8-ed5eddfe601d" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium" data-unique-id="564307eb-4e65-4b5d-9484-0fc2ea154ae5" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="fb6b8628-137a-4638-a42c-8379984fb181" data-file-name="components/bulk-email-upload.tsx">Customer Data</span></h3>
          <button onClick={addCustomer} className="text-sm text-primary hover:underline" data-unique-id="a1f5fd33-a723-457d-93d8-1a1cc6216e72" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="997b4425-7940-4460-b7d1-f7a05cd965a6" data-file-name="components/bulk-email-upload.tsx">
            + Add Customer
          </span></button>
        </div>
        
        <div className="border border-border rounded-md overflow-hidden" data-unique-id="bdc5d8db-a6c7-417c-92d7-e96f14aa702f" data-file-name="components/bulk-email-upload.tsx">
          <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="9b0bcb70-9ce8-44e0-a046-81aface519e6" data-file-name="components/bulk-email-upload.tsx">
            <div className="col-span-3" data-unique-id="fde8303f-eb5f-4574-b12f-23b8b89279bb" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="8c174ae0-9089-4d51-abb3-f937edeb8fd2" data-file-name="components/bulk-email-upload.tsx">Name</span></div>
            <div className="col-span-3" data-unique-id="bf53a634-d3f4-4636-aff9-976ec35bc167" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="eabe6cdc-6daf-48f8-842e-a99899931f83" data-file-name="components/bulk-email-upload.tsx">Order Number</span></div>
            <div className="col-span-3" data-unique-id="d9f37b48-e771-4783-880e-759b3217e3f6" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="f4b6542d-f340-449d-ba6a-759bbe075163" data-file-name="components/bulk-email-upload.tsx">Tracking Number</span></div>
            <div className="col-span-2" data-unique-id="a0efcce4-689c-4125-b928-d39ffbd44c92" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="b30efd6a-304d-4ccb-8683-1448324a47c1" data-file-name="components/bulk-email-upload.tsx">Status</span></div>
            <div className="col-span-1" data-unique-id="26da26a0-2f39-43c6-af34-4f3bee9fced0" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="e3654ced-d595-4d2b-ad2a-f4f87885f271" data-file-name="components/bulk-email-upload.tsx">Actions</span></div>
          </div>
          
          <div className="max-h-64 overflow-y-auto" data-unique-id="575697e0-6e20-4b3f-b80a-29cd6c53007d" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {customers.map(customer => <div key={customer.id} className="grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm" data-unique-id="6b47ac7e-d3ca-43cc-b3b9-1076c0def18f" data-file-name="components/bulk-email-upload.tsx">
                <div className="col-span-3" data-unique-id="067118c1-8f76-4d1a-83f6-d544e7708157" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.name} onChange={e => updateCustomer(customer.id, "name", e.target.value)} placeholder="Customer Name" className="w-full p-1 border border-border rounded text-sm" data-unique-id="b0f8541d-5520-4c3c-9771-c012faccf95e" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-3" data-unique-id="5029a52e-c386-4238-af00-825403347264" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.orderNumber} onChange={e => updateCustomer(customer.id, "orderNumber", e.target.value)} placeholder="Order #" className="w-full p-1 border border-border rounded text-sm" data-unique-id="af839250-caf9-4d62-bc3e-572e30f15bc6" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-3" data-unique-id="b6ad8d17-98d9-4151-a75d-6bc2102b72bd" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.trackingNumber} onChange={e => updateCustomer(customer.id, "trackingNumber", e.target.value)} placeholder="Tracking #" className="w-full p-1 border border-border rounded text-sm" data-unique-id="a8ecee58-ec61-4a59-8b81-12656be1d8a2" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-2" data-unique-id="9043a6cf-9602-402e-8f87-68c6c4873f36" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                  {sentStatus[customer.id] ? <span className="flex items-center text-green-600" data-unique-id="ae1037fe-39e2-42e7-a910-f3d7ed32d7ae" data-file-name="components/bulk-email-upload.tsx">
                      <Check className="h-4 w-4 mr-1" />
                      <span data-unique-id="e368358b-65af-44b3-9a41-ea7ac3bd672b" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="9eb350ac-a6de-494b-8264-4b01a68f447f" data-file-name="components/bulk-email-upload.tsx">Sent</span></span>
                    </span> : failedEmails && failedEmails[customer.id] ? <span className="flex items-center text-red-600" title={failedEmails[customer.id]} data-unique-id="481fca1e-780f-45d6-bbe5-3819ce6fd1ee" data-file-name="components/bulk-email-upload.tsx">
                      <X className="h-4 w-4 mr-1" />
                      <span data-unique-id="bcfbea92-433a-4e3e-ae57-af458ee8e33d" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="ac39cd1e-6a76-4a2e-bf28-b3e290b8b2da" data-file-name="components/bulk-email-upload.tsx">Failed</span></span>
                    </span> : <span className="text-muted-foreground" data-unique-id="675315b1-f048-4e77-bd67-24302979c259" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="c441e9cc-bfd5-46c9-ab00-5048b31e390f" data-file-name="components/bulk-email-upload.tsx">
                      Pending
                    </span></span>}
                </div>
                <div className="col-span-1 flex justify-end" data-unique-id="092a7b81-4c25-4ee4-9ecb-79cb45f39bba" data-file-name="components/bulk-email-upload.tsx">
                  <button onClick={() => removeCustomer(customer.id)} className="text-destructive hover:bg-destructive/10 p-1 rounded" data-unique-id="0039f011-8609-45ef-a3d4-8d0e1e60afbf" data-file-name="components/bulk-email-upload.tsx">
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
      {manualSendMode && customers.length > 0 && Object.keys(reviewedEmails).length > 0 && <div className="mb-6 p-4 border border-primary/20 rounded-md bg-accent/5" data-unique-id="57103ebb-362e-4418-a12f-322bebba1906" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center justify-between" data-unique-id="021a55ee-7892-4adf-8c79-0180e3720ad8" data-file-name="components/bulk-email-upload.tsx">
            <div data-unique-id="e93237a6-4f93-4ab3-9566-87e8f9c23edc" data-file-name="components/bulk-email-upload.tsx">
              <h3 className="font-medium flex items-center" data-unique-id="dcfc9131-b3ab-4d05-bf06-b0cb4dd1ec02" data-file-name="components/bulk-email-upload.tsx">
                <Eye className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="35b1bfe6-e8df-4bfa-b159-3651ca38a646" data-file-name="components/bulk-email-upload.tsx">
                Email Preview & Manual Send
              </span></h3>
              <p className="text-sm text-muted-foreground mt-1" data-unique-id="865ed04b-8412-4395-95c6-4bd58d11d35a" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {getCompletionPercentage()}<span className="editable-text" data-unique-id="d00877e0-1dea-4357-93a7-b80744cb5b1a" data-file-name="components/bulk-email-upload.tsx">% complete (</span>{Object.values(sentStatus).filter(Boolean).length}<span className="editable-text" data-unique-id="954f1e73-6615-49dd-abc9-7525284a7462" data-file-name="components/bulk-email-upload.tsx"> of </span>{customers.length}<span className="editable-text" data-unique-id="35826bc2-6981-40e5-a2f4-3302bd43895f" data-file-name="components/bulk-email-upload.tsx"> emails sent)
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
        }} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="5cae135b-ead0-4bba-a619-c0523bfb622a" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="090487aa-3413-4f7c-8b61-697b001310c7" data-file-name="components/bulk-email-upload.tsx">
              Continue Sending Emails
            </span></button>
          </div>
          
          <div className="w-full bg-gray-200 h-2 mt-4 rounded-full" data-unique-id="75172856-9b46-499b-ab04-7d4b1c24cfa2" data-file-name="components/bulk-email-upload.tsx">
            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{
          width: `${getCompletionPercentage()}%`
        }} data-unique-id="3590e0fd-96ec-4939-bdb1-b89f9e33e6f2" data-file-name="components/bulk-email-upload.tsx"></div>
          </div>
        </div>}
      
      {manualSendMode ? <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md" data-unique-id="8eee4bdb-33cc-48be-b8b1-9b2dea653af8" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="d32ed162-9d2a-4d8a-8253-2e26f79d0731" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-amber-600" />
            <p className="text-amber-800 font-medium" data-unique-id="5d7d8b44-7545-4549-9d1c-dfc5e8f17073" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="0e84b6ef-ac67-4606-8cf4-53da8b63b2c3" data-file-name="components/bulk-email-upload.tsx">Manual Email Sending Mode</span></p>
          </div>
          <p className="mt-1 text-sm text-amber-700" data-unique-id="56a94536-b29d-4970-9c04-ec65e2903910" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="317df96d-dd68-4f4c-a813-4c1d822684d6" data-file-name="components/bulk-email-upload.tsx">
            You are in manual email sending mode. After clicking "Send Emails", you'll be guided through 
            reviewing each email. You can copy the content and send it using your own email client.
          </span></p>
          <p className="mt-1 text-sm text-amber-700" data-unique-id="23088127-bcf0-4f1c-acf7-203806b1d028" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="3240f0df-4907-4647-8812-98c823f1587f" data-file-name="components/bulk-email-upload.tsx">
            Don't forget to mark emails as sent after you've sent them to keep track of your progress.
          </span></p>
        </div> : sendingError ? <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md" data-unique-id="f5e9504d-c6bc-4f61-806a-e4a1c9145e88" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="5a46bc00-41b4-4613-97e2-45fc30476a94" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
            <p className="text-red-800 font-medium" data-unique-id="3bbc6797-07b5-43ae-baae-700eb2a2cc74" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="e28f58b0-b197-4cb9-8d1b-5e4d324c08a6" data-file-name="components/bulk-email-upload.tsx">Error Sending Emails</span></p>
          </div>
          <p className="mt-1 text-sm text-red-700" data-unique-id="ae427ca2-3347-420c-ad18-348b87a93734" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {sendingError}
          </p>
          <div className="mt-2 text-xs text-red-600" data-unique-id="17a7d1f8-07aa-4876-b277-be01505fab42" data-file-name="components/bulk-email-upload.tsx">
            <button className="underline" onClick={() => {
          setManualSendMode(true);
          alert("Switched to manual sending mode. You'll be able to send emails through your own email client.");
        }} data-unique-id="4ff1bb25-0079-4551-a598-7eda8abfbd25" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="980ca8c6-64e0-412a-b788-17bd63b5d8a2" data-file-name="components/bulk-email-upload.tsx">
              Switch to manual sending mode
            </span></button>
            <span className="mx-2" data-unique-id="27b2779f-01ca-4885-a45f-069e30579859" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="70ae1055-6d5b-4f92-8b0a-e2a26f185017" data-file-name="components/bulk-email-upload.tsx">•</span></span>
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
        }} data-unique-id="faf5b87d-fd14-46d2-a579-1bac3d25ada1" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="879db979-ee15-430e-9f10-f59a2937f7e7" data-file-name="components/bulk-email-upload.tsx">
              Show Debug Info
            </span></button>
          </div>
        </div> : <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md" data-unique-id="e0e26cb9-5265-4e4b-9a89-81c1b847b157" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="df753435-1d53-46be-bf29-a58ce1e393e7" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
            <p className="text-blue-800 font-medium" data-unique-id="c214c0ec-33cb-46cd-bd81-9d01d9979c1e" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
              {isEmailServiceAvailable ? "Email Sending Enabled" : "Email Service Not Configured"}
            </p>
          </div>
          <p className="mt-1 text-sm text-blue-700" data-unique-id="be3367b9-25d3-423b-b71c-1808275abd60" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {isEmailServiceAvailable ? "This application is now connected to a real email service. Emails will be sent to the customer email addresses provided. Please ensure all email addresses are valid and have opted in to receive communications." : "The email service is not configured properly. You can use manual mode to send emails through your own email client."}
          </p>
        </div>}
      
      {sendingProgress > 0 && sendingProgress < 100 && <div className="mb-4" data-unique-id="14b42525-cc78-423b-be89-501e2ee52d4a" data-file-name="components/bulk-email-upload.tsx">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden" data-unique-id="2c177c99-ed7f-4eea-8505-4fed1c26e397" data-file-name="components/bulk-email-upload.tsx">
            <div className="h-full bg-primary transition-all duration-300 ease-out" style={{
          width: `${sendingProgress}%`
        }} data-unique-id="d53b0284-dbd5-4e1f-bbde-4fa9ea73c90f" data-file-name="components/bulk-email-upload.tsx"></div>
          </div>
          <p className="text-xs text-right mt-1 text-gray-500" data-unique-id="5f1e48ff-6e51-48e8-948d-9ee025270909" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="eb708af4-076a-4367-9e7a-9c33a2e61b65" data-file-name="components/bulk-email-upload.tsx">Sending email: </span>{sendingProgress}<span className="editable-text" data-unique-id="680e0e12-0c41-4dee-90e8-898462a12f66" data-file-name="components/bulk-email-upload.tsx">% complete</span></p>
        </div>}
      
      <div className="flex items-center justify-between" data-unique-id="82573184-1447-43d9-bda8-0db5b75c8cb7" data-file-name="components/bulk-email-upload.tsx">
        <div className="flex items-center text-sm text-muted-foreground" data-unique-id="899645c5-b6c9-40d5-990b-dd4731c4414a" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
          <AlertCircle className="h-4 w-4 mr-1" />
          {customers.length}<span className="editable-text" data-unique-id="d6e94d69-c9ee-4737-ad7d-58829e1d10c4" data-file-name="components/bulk-email-upload.tsx"> customers loaded
        </span></div>
        
        <button onClick={sendEmails} disabled={isSending || customers.length === 0} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50" data-unique-id="a376ea06-9e4d-4450-a039-0c79b2a911d1" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
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
    }} data-unique-id="49106e54-2e79-41c3-8c3a-e6838a4181a3" data-file-name="components/bulk-email-upload.tsx">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()} data-unique-id="35bd864b-4607-496b-a268-a4d9751ec148" data-file-name="components/bulk-email-upload.tsx">
            <div className="flex justify-between items-center border-b border-border p-4" data-unique-id="bf15e22a-f455-4180-b14f-12b2f2bbd1da" data-file-name="components/bulk-email-upload.tsx">
              <h3 className="font-medium text-lg" data-unique-id="0b799dc6-3872-4bc8-80a2-c5244545bfa3" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="2f7f1ef5-c280-451a-90a5-994de7af55e6" data-file-name="components/bulk-email-upload.tsx">Select Customers</span></h3>
              <button onClick={() => {
            setShowCustomerSelector(false);
            setSelectedCustomerIds([]);
          }} className="p-1 rounded-full hover:bg-accent/20" data-unique-id="35b5a67b-cf4c-4bf4-9b5f-c2c6812ee839" data-file-name="components/bulk-email-upload.tsx">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto" data-unique-id="39d27f98-1f92-4246-8b8a-850fcf6875b1" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
              {savedCustomers.length === 0 ? <div className="text-center py-8 text-muted-foreground" data-unique-id="873c21e3-28ab-4ac5-97a6-56fa72b97b36" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="d3bad49a-2ff9-4c81-bf1b-9b35e1328755" data-file-name="components/bulk-email-upload.tsx">
                  No saved customers found. Add customers in the Customers tab.
                </span></div> : <div data-unique-id="621dcb92-6e2f-4d45-8ca0-bd3710a96794" data-file-name="components/bulk-email-upload.tsx">
                  <div className="mb-4 flex justify-between items-center" data-unique-id="af7e11f7-6845-4851-bbf6-91ceaec2481b" data-file-name="components/bulk-email-upload.tsx">
                    <div className="text-sm text-muted-foreground" data-unique-id="57204a7a-0083-446c-b7b7-19daded03f92" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                      {selectedCustomerIds.length}<span className="editable-text" data-unique-id="e27b3d88-6115-41b8-b1ce-88c3415d336d" data-file-name="components/bulk-email-upload.tsx"> of </span>{savedCustomers.length}<span className="editable-text" data-unique-id="86ab5c3d-5162-4409-b905-b913551514ca" data-file-name="components/bulk-email-upload.tsx"> customers selected
                    </span></div>
                    <button onClick={() => setSelectedCustomerIds(savedCustomers.map(c => c.id))} className="text-sm text-primary" data-unique-id="78788023-b004-4455-b9f8-0213f25bf24d" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="39ecdd92-b36f-4792-90eb-a560d97baa97" data-file-name="components/bulk-email-upload.tsx">
                      Select All
                    </span></button>
                  </div>
                  
                  <div className="border border-border rounded-md overflow-hidden" data-unique-id="b9d02870-bdda-48cb-b601-c74907be360e" data-file-name="components/bulk-email-upload.tsx">
                    <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="f898703d-9d6e-4708-bf15-88ea5c3c9ed9" data-file-name="components/bulk-email-upload.tsx">
                      <div className="col-span-1" data-unique-id="1a6279a8-17f6-462d-a7ea-510d32baa990" data-file-name="components/bulk-email-upload.tsx"></div>
                      <div className="col-span-4" data-unique-id="f5188dac-0b3f-40ce-9567-e24daf4b4004" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="8775c807-bdcd-4273-a1af-6a7de93e2d76" data-file-name="components/bulk-email-upload.tsx">Name</span></div>
                      <div className="col-span-4" data-unique-id="d45cde56-0c6b-4462-acb0-9ea998bae934" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="57fabcff-ce3e-4eb4-bb79-ed0c0d493795" data-file-name="components/bulk-email-upload.tsx">Email</span></div>
                      <div className="col-span-3" data-unique-id="7fc5f385-e3be-4012-a1f7-49288a3022ad" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="7a06040b-b871-4fd3-867f-1f7523c24dbe" data-file-name="components/bulk-email-upload.tsx">Company</span></div>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto" data-unique-id="a30800fd-c2a0-4bdc-8829-8c8d79414e74" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                      {savedCustomers.map(customer => <div key={customer.id} onClick={() => toggleCustomerSelection(customer.id)} className={`grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm cursor-pointer ${selectedCustomerIds.includes(customer.id) ? 'bg-accent/20' : 'hover:bg-accent/5'}`} data-unique-id="cc0e5b92-edd6-41de-a0b7-df27ba0f9dcb" data-file-name="components/bulk-email-upload.tsx">
                          <div className="col-span-1" data-unique-id="7e386cb2-dfe2-41aa-a0c7-987b99573c08" data-file-name="components/bulk-email-upload.tsx">
                            <input type="checkbox" checked={selectedCustomerIds.includes(customer.id)} onChange={e => {
                      e.stopPropagation();
                      toggleCustomerSelection(customer.id);
                    }} className="rounded border-gray-300" data-unique-id="8274fa21-5155-4d1c-9c1a-56a737271c0e" data-file-name="components/bulk-email-upload.tsx" />
                          </div>
                          <div className="col-span-4 truncate" data-unique-id="96aff685-1c18-4531-bf25-c44388f7f513" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.name}</div>
                          <div className="col-span-4 truncate" data-unique-id="d4b5281f-5100-4a53-98b2-15d024bb697c" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.email}</div>
                          <div className="col-span-3 truncate" data-unique-id="4eaf33de-1486-4061-8d92-61c15d05cfe2" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.company || '—'}</div>
                        </div>)}
                    </div>
                  </div>
                </div>}
            </div>
            
            <div className="border-t border-border p-4 flex justify-end space-x-2" data-unique-id="373a0fde-882e-4d01-9bf2-cb657f74edc1" data-file-name="components/bulk-email-upload.tsx">
              <button onClick={() => {
            setShowCustomerSelector(false);
            setSelectedCustomerIds([]);
          }} className="px-4 py-2 border border-border rounded-md hover:bg-accent/10" data-unique-id="1c471dd5-1b0a-4fa1-a3d8-a4d164b93c0a" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="f7fa7295-a066-42be-a068-824635f4c340" data-file-name="components/bulk-email-upload.tsx">
                Cancel
              </span></button>
              <button onClick={addSelectedCustomersToEmailList} disabled={selectedCustomerIds.length === 0} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50" data-unique-id="57b9a4dc-b6d3-4660-a148-6563c9b13265" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="ea8738ae-3471-4a57-ae95-8da93d3c16f9" data-file-name="components/bulk-email-upload.tsx">
                Add </span>{selectedCustomerIds.length}<span className="editable-text" data-unique-id="ae3dfaa7-211b-4c2e-b7ef-d0c398c56ce2" data-file-name="components/bulk-email-upload.tsx"> Customers
              </span></button>
            </div>
          </div>
        </div>}
    </motion.div>;
}