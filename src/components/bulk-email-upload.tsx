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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="e4349cba-c186-4271-be9f-c3086d2e26a9" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
      <div className="mb-6" data-unique-id="5527ce4e-01ac-482b-8fa9-22afc94187f4" data-file-name="components/bulk-email-upload.tsx">
        <h2 className="text-xl font-medium mb-2" data-unique-id="5cd00af3-fb14-4467-9352-35038bea5c50" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="eed50c48-be4a-490e-a884-9958a7ead04a" data-file-name="components/bulk-email-upload.tsx">Bulk Email Sender</span></h2>
        <p className="text-muted-foreground" data-unique-id="3fa80c04-5b5d-40db-b4c8-ab9722183177" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="4125c89f-5a95-462a-a19b-d4752d67144d" data-file-name="components/bulk-email-upload.tsx">
          Upload customer data or select saved customers to send bulk emails
        </span></p>
      </div>
      
      {/* Sending mode selector */}
      <div className="mb-6" data-unique-id="011696f1-f341-4798-9cbf-7dc20636976c" data-file-name="components/bulk-email-upload.tsx">
        <div className="bg-white p-5 border border-border rounded-md shadow-sm" data-unique-id="9377a648-a440-4e8f-a833-cdd066cdcfa4" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium mb-4 text-base flex items-center" data-unique-id="84cfceea-b682-421c-8f1f-cb1efbbea6a2" data-file-name="components/bulk-email-upload.tsx">
            <Mail className="mr-2 h-5 w-5 text-primary" /><span className="editable-text" data-unique-id="1ed9d0a0-aba0-4747-b3f0-082ea84f42d0" data-file-name="components/bulk-email-upload.tsx">
            Email Sending Method
          </span></h3>
          
          <div className="grid grid-cols-2 gap-4" data-unique-id="e46b83fe-e3c4-4183-8bd6-ab023a939da3" data-file-name="components/bulk-email-upload.tsx">
            <button onClick={() => setManualSendMode(false)} disabled={!isEmailServiceAvailable} className={`p-4 rounded-md border ${!manualSendMode ? 'border-primary bg-primary/5' : 'border-border'} flex flex-col items-center text-center transition-all ${!isEmailServiceAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}`} data-unique-id="fdfe94ac-1179-4de6-b40a-6b4939ed436b" data-file-name="components/bulk-email-upload.tsx">
              <Send className="h-8 w-8 text-primary mb-2" />
              <div className="font-medium mb-1" data-unique-id="97ce0b24-bb6f-4bf3-b93c-ee56afc41a05" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="73e4023d-ca95-4165-bbda-fa63f736b9a1" data-file-name="components/bulk-email-upload.tsx">Automated Sending</span></div>
              <div className="text-xs text-muted-foreground" data-unique-id="6a1866bf-bb3f-40b5-a5db-7fd48fb36dd8" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {isEmailServiceAvailable ? "Emails will be sent automatically via the system" : "Email service not configured"}
              </div>
            </button>
            
            <button onClick={() => setManualSendMode(true)} className={`p-4 rounded-md border ${manualSendMode ? 'border-primary bg-primary/5' : 'border-border'} flex flex-col items-center text-center transition-all hover:border-primary/50`} data-unique-id="39536d09-7edd-459f-8297-1fd726e8c3ac" data-file-name="components/bulk-email-upload.tsx">
              <ExternalLink className="h-8 w-8 text-primary mb-2" />
              <div className="font-medium mb-1" data-unique-id="38b43e50-05db-4ab1-9e27-dd33f4f95963" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="b58be4a0-a13a-42ed-b7f4-422c07903260" data-file-name="components/bulk-email-upload.tsx">Manual Sending</span></div>
              <div className="text-xs text-muted-foreground" data-unique-id="e7267041-4ae3-454f-9632-70e4da6d9723" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="eeb9582c-e507-4e17-b9ed-210ab01a2eaf" data-file-name="components/bulk-email-upload.tsx">
                Review and send emails through your own email client
              </span></div>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 space-y-4" data-unique-id="26711f79-888b-44f4-8965-af63feb91d22" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
        <div className="bg-white p-5 border border-border rounded-md shadow-sm" data-unique-id="090d9776-a1c7-4829-98f0-03138a0c7bcd" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="ef6df379-2177-4442-ba3c-6725abe699aa" data-file-name="components/bulk-email-upload.tsx">
            <UserRound className="mr-2 h-4 w-4 text-primary" />
            <span className="editable-text" data-unique-id="55959c9f-934f-4ffa-9e9c-0feeffb34d64" data-file-name="components/bulk-email-upload.tsx">Employee Sender Information</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2" data-unique-id="ca3fa8e8-1bca-4a92-9cb9-47b63af789e2" data-file-name="components/bulk-email-upload.tsx">
            <div data-unique-id="fb564452-1db0-4c4f-b151-c6bb369f1976" data-file-name="components/bulk-email-upload.tsx">
              <label htmlFor="senderName" className="block text-sm font-medium mb-1" data-unique-id="6ee6a872-578a-4943-aab7-4a7c387a5f45" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="3bccfa9c-04c8-43b2-8c51-fad83ee669c2" data-file-name="components/bulk-email-upload.tsx">Employee Name</span>
              </label>
              <input id="senderName" type="text" value={senderName} onChange={e => {
              setSenderName(e.target.value);
              handleSenderInfoChange();
            }} placeholder="John Smith" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="1a82df30-56c2-4598-a42c-c00de93f6d9f" data-file-name="components/bulk-email-upload.tsx" />
            </div>
            
            <div data-unique-id="6791fbd1-0752-4a95-b2d0-145b111293ca" data-file-name="components/bulk-email-upload.tsx">
              <label htmlFor="senderEmail" className="block text-sm font-medium mb-1" data-unique-id="85ecf518-97cf-4ea9-85bc-e9c9a3ccc543" data-file-name="components/bulk-email-upload.tsx">
                <Mail className="inline-block h-3 w-3 mr-1 text-muted-foreground" />
                <span className="editable-text" data-unique-id="158ca1d8-3b57-4f50-ab8f-7fbdc7f307d4" data-file-name="components/bulk-email-upload.tsx">Employee Email</span>
              </label>
              <input id="senderEmail" type="email" value={senderEmail} onChange={e => {
              setSenderEmail(e.target.value);
              handleSenderInfoChange();
            }} placeholder="employee@detroitaxle.com" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="1bc06b83-f3c2-483f-bc9f-ca582dbdea60" data-file-name="components/bulk-email-upload.tsx" />
              <p className="text-xs text-muted-foreground mt-1" data-unique-id="bfcc398b-3075-4982-955c-f668706a2906" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="7b4ad465-d42b-41df-97ff-6a2142b9c450" data-file-name="components/bulk-email-upload.tsx">This employee will appear as the sender of all emails</span>
              </p>
            </div>
          </div>
        </div>
        
      {/* Import Order Data Alert - Show when order data is available */}
      {hasOrderData && <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md animate-pulse" data-unique-id="813f78d1-8249-459d-b615-78f1c01e0501" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center justify-between" data-unique-id="8b2f0471-71d4-42d5-858d-2b94bfe7c72c" data-file-name="components/bulk-email-upload.tsx">
            <div className="flex items-center" data-unique-id="e5457053-6117-4248-9dda-7fb11b5135cc" data-file-name="components/bulk-email-upload.tsx">
              <PackageCheck className="h-5 w-5 text-blue-500 mr-3" />
              <div data-unique-id="7d25537e-a8a9-4ed9-adbb-607fc68cf628" data-file-name="components/bulk-email-upload.tsx">
                <h4 className="font-medium text-blue-700" data-unique-id="5c0aaa7b-e7c5-49dc-838d-23100cb18b5c" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="f8c9adfa-b9d2-4d58-b5ce-970d392bd7cf" data-file-name="components/bulk-email-upload.tsx">Order Data Available</span></h4>
                <p className="text-sm text-blue-600" data-unique-id="271f342c-2776-4fc0-a47b-2f29e15b2f8a" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="e9fa5f67-5aeb-4210-b1de-113b4b3c0e02" data-file-name="components/bulk-email-upload.tsx">
                  Order data from the Order Processor is ready to be imported for email sending
                </span></p>
              </div>
            </div>
            
            <button onClick={importOrderData} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" data-unique-id="7699deb2-c97b-448b-8fde-2f3d0acac939" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="e093ed20-1d71-4905-a284-489689373987" data-file-name="components/bulk-email-upload.tsx">
              Import Order Data
            </span></button>
          </div>
        </div>}
    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" data-unique-id="2cd7b647-de29-4c3a-8b8a-fd7d0db23f7e" data-file-name="components/bulk-email-upload.tsx">
          <div className="bg-white p-5 border border-border rounded-md shadow-sm" data-unique-id="cf32b40b-d9a7-4a92-bb34-3dd8e3293bb2" data-file-name="components/bulk-email-upload.tsx">
            <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="4d7d30d0-4521-42bc-97c4-1e667cd5d3e7" data-file-name="components/bulk-email-upload.tsx">
              <Users className="mr-2 h-4 w-4 text-primary" />
              <span className="editable-text" data-unique-id="420d46ce-8c0f-448a-8f6f-3cb90cb6aedf" data-file-name="components/bulk-email-upload.tsx">Select Saved Customers</span>
            </h3>
            
            <div className="flex flex-col space-y-4" data-unique-id="ac167303-ce18-4869-97bc-d35d3ba89566" data-file-name="components/bulk-email-upload.tsx">
              <p className="text-sm" data-unique-id="8fe189bf-de0f-4956-a706-e6862da60a8e" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {savedCustomers.length > 0 ? `You have ${savedCustomers.length} saved customers` : "No saved customers found. Add customers in the Customers tab."}
              </p>
              
              <button onClick={() => setShowCustomerSelector(true)} disabled={savedCustomers.length === 0} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50" data-unique-id="7233c2e3-2d9c-491f-bb51-b6c5fe7e1c66" data-file-name="components/bulk-email-upload.tsx">
                <PlusCircle className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="255b6d20-7526-43c1-b3e3-7262ed8b5a60" data-file-name="components/bulk-email-upload.tsx">
                Select Customers
              </span></button>
            </div>
          </div>
          
          <div className="bg-white p-5 border border-border rounded-md shadow-sm" data-unique-id="ab3f766a-f925-49f0-a915-888d4fa06bdb" data-file-name="components/bulk-email-upload.tsx">
            <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="a208ea93-66ad-467f-b036-2c64af83091d" data-file-name="components/bulk-email-upload.tsx">
              <FileSpreadsheet className="mr-2 h-4 w-4 text-primary" />
              <span className="editable-text" data-unique-id="a01fbc89-6420-4d9f-a2f4-c4176b377a8d" data-file-name="components/bulk-email-upload.tsx">Customer Data Import</span>
            </h3>
            
            <div className="flex flex-col space-y-4" data-unique-id="ca4c1f3a-d134-45d5-9bc0-b1722733f8a3" data-file-name="components/bulk-email-upload.tsx">
              <input type="file" ref={fileInputRef} accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" id="excel-upload" data-unique-id="15242645-610d-45d7-9cb6-7d003b159f25" data-file-name="components/bulk-email-upload.tsx" />
              
              <div className="flex items-center space-x-2" data-unique-id="1bdf2655-6216-4d34-b9ff-01a827076cac" data-file-name="components/bulk-email-upload.tsx">
                <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50" data-unique-id="df92b759-dec3-4df6-9875-6c8adb732b50" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
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
              }} className="text-primary underline text-sm hover:text-primary/90" data-unique-id="ff00a383-6439-43e1-a323-8015b7e8025a" data-file-name="components/bulk-email-upload.tsx">
                  <span className="editable-text" data-unique-id="68e2c433-aa5a-4fd8-9f50-7cbad0a26855" data-file-name="components/bulk-email-upload.tsx">Download Excel Template</span>
                </button>
              </div>
              
              <p className="text-xs text-muted-foreground" data-unique-id="2b6ca7f4-6158-494b-8085-9a2ac3d2bdb2" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="c42e7985-634c-4158-979c-7d43f6bf9fca" data-file-name="components/bulk-email-upload.tsx">Upload an Excel file (.xlsx or .xls) with customer information</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6" data-unique-id="81c5b69d-5cbf-4544-b246-4162c1e65731" data-file-name="components/bulk-email-upload.tsx">
        <div className="flex justify-between items-center mb-3" data-unique-id="deb5e97f-3ee6-4e67-8a13-3a3f98777c8d" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium" data-unique-id="eb355bf8-357e-4759-839e-2d5f32feca43" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="b0fa6e58-c25f-46fb-8875-6f2f40fe462b" data-file-name="components/bulk-email-upload.tsx">Customer Data</span></h3>
          <button onClick={addCustomer} className="text-sm text-primary hover:underline" data-unique-id="53a5fab7-c509-421d-adac-8555cdbd53e5" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="b3119efa-c3d6-4a52-b454-9981057f873f" data-file-name="components/bulk-email-upload.tsx">
            + Add Customer
          </span></button>
        </div>
        
        <div className="border border-border rounded-md overflow-hidden" data-unique-id="1872dc9f-3e52-4c6b-abcf-f6d57800e840" data-file-name="components/bulk-email-upload.tsx">
          <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="9ae3fe4d-6766-4874-afe3-22e018c52167" data-file-name="components/bulk-email-upload.tsx">
            <div className="col-span-3" data-unique-id="f9ca9ba7-a72a-4da1-8e43-c4b5b1459592" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="1e93438d-5273-4b61-8a15-9a10223fca8c" data-file-name="components/bulk-email-upload.tsx">Name</span></div>
            <div className="col-span-3" data-unique-id="0b803fea-90d9-47ab-b228-0990b3717744" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="817dcc5c-dc7e-413f-ac82-3d5a8d5773e5" data-file-name="components/bulk-email-upload.tsx">Order Number</span></div>
            <div className="col-span-3" data-unique-id="c1864cc8-6a6c-4a33-845a-1cab7a1ed124" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="8d69b4f3-9079-4163-936a-bf8154ffba33" data-file-name="components/bulk-email-upload.tsx">Tracking Number</span></div>
            <div className="col-span-2" data-unique-id="02fc716e-ad73-41be-8719-21ad140182ee" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="8c0619b9-a798-4198-8fb0-e64af0f1236f" data-file-name="components/bulk-email-upload.tsx">Status</span></div>
            <div className="col-span-1" data-unique-id="6b058ec6-49d8-4126-8aa2-80fa97762cb6" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="13943ec9-dd9d-45ac-83e2-1af1b5750b37" data-file-name="components/bulk-email-upload.tsx">Actions</span></div>
          </div>
          
          <div className="max-h-64 overflow-y-auto" data-unique-id="7ff5636a-cccc-4f71-b7d0-942f7015b5f3" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {customers.map(customer => <div key={customer.id} className="grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm" data-unique-id="be6b7108-d6e9-452f-b73c-0987ec97a2b9" data-file-name="components/bulk-email-upload.tsx">
                <div className="col-span-3" data-unique-id="23a83074-e4d9-42f9-b39c-fcf008d0cc79" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.name} onChange={e => updateCustomer(customer.id, "name", e.target.value)} placeholder="Customer Name" className="w-full p-1 border border-border rounded text-sm" data-unique-id="a66b8382-6778-46eb-82fe-07b6eb0c39c9" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-3" data-unique-id="7c06e494-ca5b-4bbd-9313-d98524638fb7" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.orderNumber} onChange={e => updateCustomer(customer.id, "orderNumber", e.target.value)} placeholder="Order #" className="w-full p-1 border border-border rounded text-sm" data-unique-id="d90d3e77-d0bc-4903-b58a-e655c47722d1" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-3" data-unique-id="1960da06-b7a5-4f29-892c-c23b83a073fb" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.trackingNumber} onChange={e => updateCustomer(customer.id, "trackingNumber", e.target.value)} placeholder="Tracking #" className="w-full p-1 border border-border rounded text-sm" data-unique-id="f1f1422e-d90e-40df-b9a7-8ebddf876366" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-2" data-unique-id="8492989d-41e3-4cb2-92b1-f259645541c9" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                  {sentStatus[customer.id] ? <span className="flex items-center text-green-600" data-unique-id="53a3c584-44fa-4e8a-88ab-c135b4a3ba21" data-file-name="components/bulk-email-upload.tsx">
                      <Check className="h-4 w-4 mr-1" />
                      <span data-unique-id="851f171f-80e9-459a-8a63-5a8b120de067" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="4d3b1e41-b300-4fe3-8f4e-456ac3502c23" data-file-name="components/bulk-email-upload.tsx">Sent</span></span>
                    </span> : failedEmails && failedEmails[customer.id] ? <span className="flex items-center text-red-600" title={failedEmails[customer.id]} data-unique-id="5119c65d-b44a-4167-b12c-353e3759071e" data-file-name="components/bulk-email-upload.tsx">
                      <X className="h-4 w-4 mr-1" />
                      <span data-unique-id="be90683a-6c38-48ec-ad24-f7fb03d487fb" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="1bfa22d0-91a6-43e1-b118-52ba443485f0" data-file-name="components/bulk-email-upload.tsx">Failed</span></span>
                    </span> : <span className="text-muted-foreground" data-unique-id="e4b97b9c-5990-4537-9fca-887d65cc1476" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="65b6a9e6-6634-4bde-aff6-3c71288ccac3" data-file-name="components/bulk-email-upload.tsx">
                      Pending
                    </span></span>}
                </div>
                <div className="col-span-1 flex justify-end" data-unique-id="49eb9926-e0ee-4c3d-bcb8-9aa84b1f0738" data-file-name="components/bulk-email-upload.tsx">
                  <button onClick={() => removeCustomer(customer.id)} className="text-destructive hover:bg-destructive/10 p-1 rounded" data-unique-id="153b6b7a-c836-4be5-9a11-f7b06bb4d620" data-file-name="components/bulk-email-upload.tsx">
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
      {manualSendMode && customers.length > 0 && Object.keys(reviewedEmails).length > 0 && <div className="mb-6 p-4 border border-primary/20 rounded-md bg-accent/5" data-unique-id="db57814d-cfef-464c-9584-fb21142e7a25" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center justify-between" data-unique-id="56c69a00-32fd-4a09-91ea-06c93ab148aa" data-file-name="components/bulk-email-upload.tsx">
            <div data-unique-id="de9c4c0f-7c96-4833-9e53-19ba274dc9ff" data-file-name="components/bulk-email-upload.tsx">
              <h3 className="font-medium flex items-center" data-unique-id="59f1dd5b-8af8-4bb0-80af-a9b37762ba39" data-file-name="components/bulk-email-upload.tsx">
                <Eye className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="4105095c-3052-4671-8dbc-287f1f0c5edf" data-file-name="components/bulk-email-upload.tsx">
                Email Preview & Manual Send
              </span></h3>
              <p className="text-sm text-muted-foreground mt-1" data-unique-id="f2611c9b-f381-46c8-a57f-279426c8b53b" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {getCompletionPercentage()}<span className="editable-text" data-unique-id="5134fe99-60ab-4a1f-bac9-8162da669543" data-file-name="components/bulk-email-upload.tsx">% complete (</span>{Object.values(sentStatus).filter(Boolean).length}<span className="editable-text" data-unique-id="f2a2ec3b-f0fd-4fd3-9cf1-7cb768f7b3d8" data-file-name="components/bulk-email-upload.tsx"> of </span>{customers.length}<span className="editable-text" data-unique-id="174d10d1-c1fb-48f9-a709-569f16913535" data-file-name="components/bulk-email-upload.tsx"> emails sent)
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
        }} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="502d5aeb-b8de-4a9d-adc6-6636f166f677" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="5fe33e12-9929-4256-877f-41fb87a2e013" data-file-name="components/bulk-email-upload.tsx">
              Continue Sending Emails
            </span></button>
          </div>
          
          <div className="w-full bg-gray-200 h-2 mt-4 rounded-full" data-unique-id="cb5bc0d9-e414-47b3-aed6-df79b20da9e4" data-file-name="components/bulk-email-upload.tsx">
            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{
          width: `${getCompletionPercentage()}%`
        }} data-unique-id="6a8ba0ff-cfd5-40f6-bfa1-64856703ae4f" data-file-name="components/bulk-email-upload.tsx"></div>
          </div>
        </div>}
      
      {manualSendMode ? <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md" data-unique-id="5fd9b01b-95e4-4b03-ad6d-dc89c2b7e357" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="e908ae5c-bee8-4830-9790-28a54a1acea2" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-amber-600" />
            <p className="text-amber-800 font-medium" data-unique-id="69c68d79-35a7-4dd0-b861-7ecbf4c61862" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="fd21621a-d11e-492d-baaa-06c0c60bece1" data-file-name="components/bulk-email-upload.tsx">Manual Email Sending Mode</span></p>
          </div>
          <p className="mt-1 text-sm text-amber-700" data-unique-id="f19884f1-1851-4705-87d6-ba30f2a6833b" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="62a188f3-2ea7-465f-b752-44a1a30cd4c4" data-file-name="components/bulk-email-upload.tsx">
            You are in manual email sending mode. After clicking "Send Emails", you'll be guided through 
            reviewing each email. You can copy the content and send it using your own email client.
          </span></p>
          <p className="mt-1 text-sm text-amber-700" data-unique-id="3e1b5f66-de75-4886-91e0-d3f4c2d19cfe" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="f1f40613-23c2-4299-9ec8-fee1c7f7c2a8" data-file-name="components/bulk-email-upload.tsx">
            Don't forget to mark emails as sent after you've sent them to keep track of your progress.
          </span></p>
        </div> : sendingError ? <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md" data-unique-id="37bb5faf-7567-4026-825f-13f93873a94f" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="0cb583b4-4e80-4599-a271-4f4e88472ca2" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
            <p className="text-red-800 font-medium" data-unique-id="dbc89805-8b2a-499f-b7a2-f68141a7d1ee" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="b62f62b5-3ed6-421b-8226-2a9d0a4f5dc5" data-file-name="components/bulk-email-upload.tsx">Error Sending Emails</span></p>
          </div>
          <p className="mt-1 text-sm text-red-700" data-unique-id="6ffdf66d-47fd-4778-9db1-efe73c9d3812" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {sendingError}
          </p>
          <div className="mt-2 text-xs text-red-600" data-unique-id="43c62ecc-bc2d-403f-8e85-bb37ec6800bb" data-file-name="components/bulk-email-upload.tsx">
            <button className="underline" onClick={() => {
          setManualSendMode(true);
          alert("Switched to manual sending mode. You'll be able to send emails through your own email client.");
        }} data-unique-id="8a3bf043-5552-4c73-8672-53098585fa1b" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="9fe7d374-8567-4c2e-b4da-1beac7f9abc7" data-file-name="components/bulk-email-upload.tsx">
              Switch to manual sending mode
            </span></button>
            <span className="mx-2" data-unique-id="e31aa270-af56-4507-8784-7f9153123d53" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="f65a9877-cb07-426e-a5ff-70c75fb60653" data-file-name="components/bulk-email-upload.tsx">•</span></span>
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
        }} data-unique-id="f65ac118-0f50-4345-beb3-e60955a16313" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="82751b9f-008d-4cdb-86ec-0d3cd637f677" data-file-name="components/bulk-email-upload.tsx">
              Show Debug Info
            </span></button>
          </div>
        </div> : <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md" data-unique-id="dcb0ce0a-2d03-4163-b4a5-124b13044d3f" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="01bf5fd5-6107-4209-92a2-b95ef04c7ea8" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
            <p className="text-blue-800 font-medium" data-unique-id="0b6abff1-2df2-47b1-8883-d6dd281765df" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
              {isEmailServiceAvailable ? "Email Sending Enabled" : "Email Service Not Configured"}
            </p>
          </div>
          <p className="mt-1 text-sm text-blue-700" data-unique-id="0e0d6170-1edf-4b19-8860-9fc979b3ec4a" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {isEmailServiceAvailable ? "This application is now connected to a real email service. Emails will be sent to the customer email addresses provided. Please ensure all email addresses are valid and have opted in to receive communications." : "The email service is not configured properly. You can use manual mode to send emails through your own email client."}
          </p>
        </div>}
      
      {sendingProgress > 0 && sendingProgress < 100 && <div className="mb-4" data-unique-id="d6f8490b-dead-4213-8b94-69dfb635324f" data-file-name="components/bulk-email-upload.tsx">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden" data-unique-id="cf6c4315-9c1e-4c99-8d19-2df2ff939731" data-file-name="components/bulk-email-upload.tsx">
            <div className="h-full bg-primary transition-all duration-300 ease-out" style={{
          width: `${sendingProgress}%`
        }} data-unique-id="4be6eb69-6c20-47be-8b56-577bcc1ef4b1" data-file-name="components/bulk-email-upload.tsx"></div>
          </div>
          <p className="text-xs text-right mt-1 text-gray-500" data-unique-id="8f3add42-f0a9-4af9-b7b0-bb42348c9edb" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="31a0550e-46f1-4e76-983b-53911574d13b" data-file-name="components/bulk-email-upload.tsx">Sending email: </span>{sendingProgress}<span className="editable-text" data-unique-id="e46bb15a-bfcc-4ad3-8c2d-ac95cfe819c2" data-file-name="components/bulk-email-upload.tsx">% complete</span></p>
        </div>}
      
      <div className="flex items-center justify-between" data-unique-id="df2f2ed9-76dc-4bc1-b62a-263f92187795" data-file-name="components/bulk-email-upload.tsx">
        <div className="flex items-center text-sm text-muted-foreground" data-unique-id="287eac46-2071-4676-bafb-fa14b29b242a" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
          <AlertCircle className="h-4 w-4 mr-1" />
          {customers.length}<span className="editable-text" data-unique-id="1a1e84de-6e68-4a3e-ba46-33c74f37a4ff" data-file-name="components/bulk-email-upload.tsx"> customers loaded
        </span></div>
        
        <button onClick={sendEmails} disabled={isSending || customers.length === 0} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50" data-unique-id="0002b35b-0057-414a-9a4d-8a512fb1656a" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
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
    }} data-unique-id="a9f172c0-a33d-4eed-b086-09d50d54764b" data-file-name="components/bulk-email-upload.tsx">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()} data-unique-id="249b4cfa-8725-41b2-919c-e84ba636696e" data-file-name="components/bulk-email-upload.tsx">
            <div className="flex justify-between items-center border-b border-border p-4" data-unique-id="dc7a4498-24c6-4e16-bd10-8ea4318beffd" data-file-name="components/bulk-email-upload.tsx">
              <h3 className="font-medium text-lg" data-unique-id="3e9f5cbf-90fb-437c-811e-8783147c5bc8" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="d415e20b-a537-4cbd-8330-b9d03d41e6aa" data-file-name="components/bulk-email-upload.tsx">Select Customers</span></h3>
              <button onClick={() => {
            setShowCustomerSelector(false);
            setSelectedCustomerIds([]);
          }} className="p-1 rounded-full hover:bg-accent/20" data-unique-id="762a767d-8d59-4029-899a-130e3b476ec3" data-file-name="components/bulk-email-upload.tsx">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto" data-unique-id="7e4db5b8-b987-4327-b619-ee27eea88bbe" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
              {savedCustomers.length === 0 ? <div className="text-center py-8 text-muted-foreground" data-unique-id="0d874dfd-27bf-4cbb-b1e2-777391e21deb" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="f8c5747e-f72a-48a3-a866-e031e462cce1" data-file-name="components/bulk-email-upload.tsx">
                  No saved customers found. Add customers in the Customers tab.
                </span></div> : <div data-unique-id="ede48260-7b7f-4298-8f2d-8c7eaf02d271" data-file-name="components/bulk-email-upload.tsx">
                  <div className="mb-4 flex justify-between items-center" data-unique-id="d621d1fe-01b7-4464-9e6f-771a26b94d57" data-file-name="components/bulk-email-upload.tsx">
                    <div className="text-sm text-muted-foreground" data-unique-id="25f730bb-4c5c-4ec1-8723-7d4e212bc4ff" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                      {selectedCustomerIds.length}<span className="editable-text" data-unique-id="6feb422c-0435-4213-9a55-202c7b5df3aa" data-file-name="components/bulk-email-upload.tsx"> of </span>{savedCustomers.length}<span className="editable-text" data-unique-id="fce3f274-1c9c-422f-b693-8efea72697ce" data-file-name="components/bulk-email-upload.tsx"> customers selected
                    </span></div>
                    <button onClick={() => setSelectedCustomerIds(savedCustomers.map(c => c.id))} className="text-sm text-primary" data-unique-id="6e5e3bb1-99bd-4cd1-aa80-3328c76cea6e" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="b1c9e699-9301-422b-b3c7-4ce4e043e8e5" data-file-name="components/bulk-email-upload.tsx">
                      Select All
                    </span></button>
                  </div>
                  
                  <div className="border border-border rounded-md overflow-hidden" data-unique-id="08f34d97-0115-4cf3-9938-e65ddbde70ae" data-file-name="components/bulk-email-upload.tsx">
                    <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="d6a62622-fcbc-444f-8f30-1ff9558df9a2" data-file-name="components/bulk-email-upload.tsx">
                      <div className="col-span-1" data-unique-id="4471f3b4-eae0-42f5-8f4a-e17fde616340" data-file-name="components/bulk-email-upload.tsx"></div>
                      <div className="col-span-4" data-unique-id="0502ee54-b615-4afd-b604-1790b8494a5a" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="f7adf814-6813-4245-b0c7-ffa5b878b58f" data-file-name="components/bulk-email-upload.tsx">Name</span></div>
                      <div className="col-span-4" data-unique-id="f811b12b-4b83-4c8b-86f6-43bb98c283ac" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="98bf2a76-d0d5-4665-aa69-d0e5c51f06b7" data-file-name="components/bulk-email-upload.tsx">Email</span></div>
                      <div className="col-span-3" data-unique-id="2961266f-abe9-4985-8430-51a47593fc50" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="876fc75c-766c-4d4c-b24e-6957eb0108d2" data-file-name="components/bulk-email-upload.tsx">Company</span></div>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto" data-unique-id="612da409-3e26-41b5-a440-b33e3d605997" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                      {savedCustomers.map(customer => <div key={customer.id} onClick={() => toggleCustomerSelection(customer.id)} className={`grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm cursor-pointer ${selectedCustomerIds.includes(customer.id) ? 'bg-accent/20' : 'hover:bg-accent/5'}`} data-unique-id="34fc1618-5eaa-45a9-a21f-b1c5dd775a2f" data-file-name="components/bulk-email-upload.tsx">
                          <div className="col-span-1" data-unique-id="388d1601-4ee0-45c4-ba65-4da1eeba2b7c" data-file-name="components/bulk-email-upload.tsx">
                            <input type="checkbox" checked={selectedCustomerIds.includes(customer.id)} onChange={e => {
                      e.stopPropagation();
                      toggleCustomerSelection(customer.id);
                    }} className="rounded border-gray-300" data-unique-id="e0d1a1c9-4165-49cd-bec0-7c7e01a3fef5" data-file-name="components/bulk-email-upload.tsx" />
                          </div>
                          <div className="col-span-4 truncate" data-unique-id="79ab0058-25bb-4818-9709-594f17fb1784" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.name}</div>
                          <div className="col-span-4 truncate" data-unique-id="d0088b96-701e-414b-9fe7-7c53c7ea0f83" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.email}</div>
                          <div className="col-span-3 truncate" data-unique-id="829399fe-0cb1-4da8-919a-423432fff5e3" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.company || '—'}</div>
                        </div>)}
                    </div>
                  </div>
                </div>}
            </div>
            
            <div className="border-t border-border p-4 flex justify-end space-x-2" data-unique-id="b020242c-a418-4ef5-951c-236b1272bc59" data-file-name="components/bulk-email-upload.tsx">
              <button onClick={() => {
            setShowCustomerSelector(false);
            setSelectedCustomerIds([]);
          }} className="px-4 py-2 border border-border rounded-md hover:bg-accent/10" data-unique-id="6671b50a-edd2-44cc-9c45-5249325d7438" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="b200938d-b963-44cc-85d7-053eb40f36a3" data-file-name="components/bulk-email-upload.tsx">
                Cancel
              </span></button>
              <button onClick={addSelectedCustomersToEmailList} disabled={selectedCustomerIds.length === 0} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50" data-unique-id="8e04ba3b-5fe1-402c-85c2-884872130c05" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="f5be4481-c85b-45a4-9a27-c42bb73061b3" data-file-name="components/bulk-email-upload.tsx">
                Add </span>{selectedCustomerIds.length}<span className="editable-text" data-unique-id="b60d42f7-6190-42a9-8729-9940328968c7" data-file-name="components/bulk-email-upload.tsx"> Customers
              </span></button>
            </div>
          </div>
        </div>}
    </motion.div>;
}