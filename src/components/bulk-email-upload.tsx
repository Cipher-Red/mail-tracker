"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Send, AlertCircle, Check, X, FileSpreadsheet, UserRound, Mail, Users, PlusCircle, RefreshCw, Copy, ExternalLink, ChevronLeft, ChevronRight, Eye } from "lucide-react";
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

  // Load saved customers from localStorage
  useEffect(() => {
    const loadedCustomers = getLocalStorage<Customer[]>('emailCustomers', []);
    setSavedCustomers(loadedCustomers);
  }, []);

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

      // No more alerts - the modal will appear automatically
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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="16e71f60-5352-49c9-b288-093533d1c837" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
      <div className="mb-6" data-unique-id="af0df599-1056-41c7-8032-fc59889aa138" data-file-name="components/bulk-email-upload.tsx">
        <h2 className="text-xl font-medium mb-2" data-unique-id="07fc263f-51cc-4ccb-a01a-8f57a9e34e25" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="5fbc5dfd-c35d-4065-873f-ad65478a03bf" data-file-name="components/bulk-email-upload.tsx">Bulk Email Sender</span></h2>
        <p className="text-muted-foreground" data-unique-id="c12d17ea-cb31-4d17-af3c-918940766852" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="24159887-da79-40ab-bc8f-c5843ac7f565" data-file-name="components/bulk-email-upload.tsx">
          Upload customer data or select saved customers to send bulk emails
        </span></p>
      </div>
      
      {/* Sending mode selector */}
      <div className="mb-6" data-unique-id="cb731667-0c35-484f-94b6-f485d44884a6" data-file-name="components/bulk-email-upload.tsx">
        <div className="bg-accent/10 p-4 rounded-md border border-border" data-unique-id="1fab8085-61e2-4ae1-9d59-226f67765cab" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium text-sm mb-2 flex items-center" data-unique-id="90d835ac-1ac6-4246-87ba-a533a4c1fd02" data-file-name="components/bulk-email-upload.tsx">
            <Mail className="mr-2 h-4 w-4 text-primary" /><span className="editable-text" data-unique-id="56fdc08e-fd9c-48b4-a1bc-63b3a0c8e971" data-file-name="components/bulk-email-upload.tsx">
            Email Sending Method
          </span></h3>
          
          <div className="flex items-center space-x-4" data-unique-id="c207ed7f-80f0-4b2b-9313-f88c898b8eb9" data-file-name="components/bulk-email-upload.tsx">
            <label className="flex items-center" data-unique-id="1fe777c7-28ce-4027-96b1-f2edca3a004f" data-file-name="components/bulk-email-upload.tsx">
              <input type="radio" checked={!manualSendMode} onChange={() => setManualSendMode(false)} disabled={!isEmailServiceAvailable} className="mr-2" data-unique-id="d3574057-abe4-4c41-be3d-f62fdcc837d6" data-file-name="components/bulk-email-upload.tsx" />
              <div data-unique-id="eaa1967c-d970-45de-8eb5-07444db23915" data-file-name="components/bulk-email-upload.tsx">
                <div className="text-sm font-medium" data-unique-id="d4a95df3-461b-4f44-be60-48a9c332aee7" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="3f8ed83c-12b1-4cad-b51f-3a6d2141d79d" data-file-name="components/bulk-email-upload.tsx">Automated Sending</span></div>
                <div className="text-xs text-muted-foreground" data-unique-id="691942d8-b6e1-40b0-a742-4e812c1a0551" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                  {isEmailServiceAvailable ? "Emails will be sent automatically via the system" : "Email service not configured"}
                </div>
              </div>
            </label>
            
            <label className="flex items-center" data-unique-id="6f081096-d718-48b8-9d7a-46d34f7c3d01" data-file-name="components/bulk-email-upload.tsx">
              <input type="radio" checked={manualSendMode} onChange={() => setManualSendMode(true)} className="mr-2" data-unique-id="bc55e22d-27ce-4743-be6c-3fe06226f642" data-file-name="components/bulk-email-upload.tsx" />
              <div data-unique-id="89b75ca9-03bf-4e12-8b56-1867cb99411a" data-file-name="components/bulk-email-upload.tsx">
                <div className="text-sm font-medium" data-unique-id="56e5eefc-e999-4011-9a05-38c4395d9283" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="9fbefa1d-d730-4865-aea4-72b451b2e8a0" data-file-name="components/bulk-email-upload.tsx">Manual Sending</span></div>
                <div className="text-xs text-muted-foreground" data-unique-id="e5600a4b-eebe-4882-acdf-a1eacc877486" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="a37d39c3-9880-4192-a0a3-e4fcb53c61d6" data-file-name="components/bulk-email-upload.tsx">
                  Review and send emails through your own email client
                </span></div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="mb-6 space-y-4" data-unique-id="91dd2c6a-7110-408b-b083-2d9e9282a48b" data-file-name="components/bulk-email-upload.tsx">
        <div className="bg-white p-5 border border-border rounded-md shadow-sm" data-unique-id="633cec38-64d8-4f1c-9157-a3e723d1d689" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="1202f068-8f57-4253-b0b3-5ef9910102a2" data-file-name="components/bulk-email-upload.tsx">
            <UserRound className="mr-2 h-4 w-4 text-primary" />
            <span className="editable-text" data-unique-id="93ca57f0-5062-4b52-8655-321e911ef89a" data-file-name="components/bulk-email-upload.tsx">Employee Sender Information</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2" data-unique-id="7d343ba8-d18b-4d9b-82c0-f8f327948b22" data-file-name="components/bulk-email-upload.tsx">
            <div data-unique-id="4a2989c5-4a23-455c-b062-fe59774cc179" data-file-name="components/bulk-email-upload.tsx">
              <label htmlFor="senderName" className="block text-sm font-medium mb-1" data-unique-id="84ad6ece-affe-4c84-a4fb-2fa2cecfa156" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="0b749906-bd63-4038-a0db-2bb9bf966f35" data-file-name="components/bulk-email-upload.tsx">Employee Name</span>
              </label>
              <input id="senderName" type="text" value={senderName} onChange={e => {
              setSenderName(e.target.value);
              handleSenderInfoChange();
            }} placeholder="John Smith" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="ecbc0185-2880-4ff7-a8e0-8b176ad1f14e" data-file-name="components/bulk-email-upload.tsx" />
            </div>
            
            <div data-unique-id="35a72ae1-4b63-42c2-9180-5d264ce13cd1" data-file-name="components/bulk-email-upload.tsx">
              <label htmlFor="senderEmail" className="block text-sm font-medium mb-1" data-unique-id="3de76551-a0f9-4081-b9b5-e8da125f9c0b" data-file-name="components/bulk-email-upload.tsx">
                <Mail className="inline-block h-3 w-3 mr-1 text-muted-foreground" />
                <span className="editable-text" data-unique-id="bec16d74-7159-4c08-80be-8486e14b240c" data-file-name="components/bulk-email-upload.tsx">Employee Email</span>
              </label>
              <input id="senderEmail" type="email" value={senderEmail} onChange={e => {
              setSenderEmail(e.target.value);
              handleSenderInfoChange();
            }} placeholder="employee@detroitaxle.com" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="4981c10d-76cb-4293-babc-fb7dc0ce5562" data-file-name="components/bulk-email-upload.tsx" />
              <p className="text-xs text-muted-foreground mt-1" data-unique-id="d47a93f3-d1b0-4473-a0d7-6fa117e047e5" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="f0d5d3b7-c910-42f4-a2f5-6fe8f6885de4" data-file-name="components/bulk-email-upload.tsx">This employee will appear as the sender of all emails</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" data-unique-id="5e202742-09ad-411f-a020-96e812e9a9bf" data-file-name="components/bulk-email-upload.tsx">
          <div className="bg-white p-5 border border-border rounded-md shadow-sm" data-unique-id="79b0816e-e1a3-40ca-837f-8bc251a80c52" data-file-name="components/bulk-email-upload.tsx">
            <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="a7de0c09-0840-490e-9d10-e654ac72a53d" data-file-name="components/bulk-email-upload.tsx">
              <Users className="mr-2 h-4 w-4 text-primary" />
              <span className="editable-text" data-unique-id="41b62d21-4856-4208-bb97-ed4ce866c16c" data-file-name="components/bulk-email-upload.tsx">Select Saved Customers</span>
            </h3>
            
            <div className="flex flex-col space-y-4" data-unique-id="2828ac95-acc3-43b1-96d7-e9bd93c9c355" data-file-name="components/bulk-email-upload.tsx">
              <p className="text-sm" data-unique-id="b0e86187-b9de-46bf-9fe9-629f000fa067" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {savedCustomers.length > 0 ? `You have ${savedCustomers.length} saved customers` : "No saved customers found. Add customers in the Customers tab."}
              </p>
              
              <button onClick={() => setShowCustomerSelector(true)} disabled={savedCustomers.length === 0} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50" data-unique-id="07f87e00-21a2-4532-ac09-ff5e63d0d35d" data-file-name="components/bulk-email-upload.tsx">
                <PlusCircle className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="1d9fc2f3-251f-43a1-8343-42658c30b81b" data-file-name="components/bulk-email-upload.tsx">
                Select Customers
              </span></button>
            </div>
          </div>
          
          <div className="bg-white p-5 border border-border rounded-md shadow-sm" data-unique-id="1903a6e8-6092-40a6-abf3-54ccc7c05ca0" data-file-name="components/bulk-email-upload.tsx">
            <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="f5166f89-ecc9-4f1e-90f9-3693fd652f18" data-file-name="components/bulk-email-upload.tsx">
              <FileSpreadsheet className="mr-2 h-4 w-4 text-primary" />
              <span className="editable-text" data-unique-id="d1181a14-6999-4cbf-9663-33f57561feb7" data-file-name="components/bulk-email-upload.tsx">Customer Data Import</span>
            </h3>
            
            <div className="flex flex-col space-y-4" data-unique-id="f90e49c9-bf49-491b-b2b9-f703c8e902d9" data-file-name="components/bulk-email-upload.tsx">
              <input type="file" ref={fileInputRef} accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" id="excel-upload" data-unique-id="44955cfa-9c55-4a80-ada2-35fc348b3462" data-file-name="components/bulk-email-upload.tsx" />
              
              <div className="flex items-center space-x-2" data-unique-id="b635c537-86d8-41c4-b820-f9beca5806dd" data-file-name="components/bulk-email-upload.tsx">
                <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50" data-unique-id="e24444ff-9e39-48f4-ab23-23d97f3ffc52" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
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
              }} className="text-primary underline text-sm hover:text-primary/90" data-unique-id="6b73a49c-7c0e-4656-926b-b6a146a553d3" data-file-name="components/bulk-email-upload.tsx">
                  <span className="editable-text" data-unique-id="4dda361d-1c2d-4cb7-971e-5308c8cdcb46" data-file-name="components/bulk-email-upload.tsx">Download Excel Template</span>
                </button>
              </div>
              
              <p className="text-xs text-muted-foreground" data-unique-id="addab61f-217b-43d5-8359-c62ceadde1df" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="fa4daa0e-d627-46ab-a8d7-7b59bb2c2a84" data-file-name="components/bulk-email-upload.tsx">Upload an Excel file (.xlsx or .xls) with customer information</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6" data-unique-id="b10bb7b9-fb3b-4542-a44f-791e1b78d36f" data-file-name="components/bulk-email-upload.tsx">
        <div className="flex justify-between items-center mb-3" data-unique-id="d891aee5-58b5-4b93-aed3-ddf96dc6573d" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium" data-unique-id="0023f426-505e-413a-a326-062007f0cbb5" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="29e235ee-b42b-4d29-aca2-e277c51862f8" data-file-name="components/bulk-email-upload.tsx">Customer Data</span></h3>
          <button onClick={addCustomer} className="text-sm text-primary hover:underline" data-unique-id="55694727-b3ab-4a4e-a17d-e581e1e3ae1c" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="837056be-94c5-438e-ba81-e86aaa4b63de" data-file-name="components/bulk-email-upload.tsx">
            + Add Customer
          </span></button>
        </div>
        
        <div className="border border-border rounded-md overflow-hidden" data-unique-id="ff5aa894-5aff-4ea7-ab33-7ba28dc5eb86" data-file-name="components/bulk-email-upload.tsx">
          <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="cff695f3-dd92-4faa-bf3f-6467115fdec3" data-file-name="components/bulk-email-upload.tsx">
            <div className="col-span-3" data-unique-id="d1c8a897-f735-4c4d-b39e-6e04f798c36b" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="b89a9895-3345-4be0-a3a4-bc580084e7af" data-file-name="components/bulk-email-upload.tsx">Name</span></div>
            <div className="col-span-3" data-unique-id="fd804e1d-c22d-44e8-bda2-3ef70d8f9af0" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="8b9e39d6-6068-4bd5-a521-321e21891353" data-file-name="components/bulk-email-upload.tsx">Order Number</span></div>
            <div className="col-span-3" data-unique-id="35111ed8-9c64-4d3a-840b-7aa36cd5fe8d" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="f2724f52-f3bd-40b0-aa84-42817b2cea7d" data-file-name="components/bulk-email-upload.tsx">Tracking Number</span></div>
            <div className="col-span-2" data-unique-id="0ee377b6-0585-442b-b0db-d018742d3e5a" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="c7010569-4ffb-435d-8b73-8b1c49e32c0a" data-file-name="components/bulk-email-upload.tsx">Status</span></div>
            <div className="col-span-1" data-unique-id="f038f3d1-32e3-46a4-9df7-c02d456e6ba1" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="15f4887a-6d1b-4601-93ef-d9b9cff43331" data-file-name="components/bulk-email-upload.tsx">Actions</span></div>
          </div>
          
          <div className="max-h-64 overflow-y-auto" data-unique-id="95b2b50d-f22b-4705-a253-17ab29360a87" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {customers.map(customer => <div key={customer.id} className="grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm" data-unique-id="9b3f6462-95c7-42e2-838e-baf61e4581bf" data-file-name="components/bulk-email-upload.tsx">
                <div className="col-span-3" data-unique-id="dba0bd04-34e8-4740-a96f-0ed40e266603" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.name} onChange={e => updateCustomer(customer.id, "name", e.target.value)} placeholder="Customer Name" className="w-full p-1 border border-border rounded text-sm" data-unique-id="0edac963-6c98-4004-a7e1-be84f754e9f3" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-3" data-unique-id="58621ccb-4def-44eb-aeeb-ad1b97fdd15a" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.orderNumber} onChange={e => updateCustomer(customer.id, "orderNumber", e.target.value)} placeholder="Order #" className="w-full p-1 border border-border rounded text-sm" data-unique-id="3b01afff-abe1-4f25-a6c7-dcc5f4591b6e" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-3" data-unique-id="c524caf1-13ce-4ec2-a2bf-c3d76692c725" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.trackingNumber} onChange={e => updateCustomer(customer.id, "trackingNumber", e.target.value)} placeholder="Tracking #" className="w-full p-1 border border-border rounded text-sm" data-unique-id="486f2e07-5415-4ac5-b456-4689df2dfabc" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-2" data-unique-id="2d244e03-8f1f-458d-9a08-2ff9b8834615" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                  {sentStatus[customer.id] ? <span className="flex items-center text-green-600" data-unique-id="508b6714-2390-4a60-8885-2a52dd4b9785" data-file-name="components/bulk-email-upload.tsx">
                      <Check className="h-4 w-4 mr-1" />
                      <span data-unique-id="72e17664-c5a0-4a1a-b460-b804f4e2aeaa" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="3e5db24d-57d1-4993-ba35-4e3ee07e7fe6" data-file-name="components/bulk-email-upload.tsx">Sent</span></span>
                    </span> : failedEmails && failedEmails[customer.id] ? <span className="flex items-center text-red-600" title={failedEmails[customer.id]} data-unique-id="c79e4fa8-2d14-4e3c-99d6-954bfa4701a0" data-file-name="components/bulk-email-upload.tsx">
                      <X className="h-4 w-4 mr-1" />
                      <span data-unique-id="e2c47ab6-7118-4a1d-906b-8d5b8933c512" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="8dadeed7-7710-4c27-a073-b13361ae4c32" data-file-name="components/bulk-email-upload.tsx">Failed</span></span>
                    </span> : <span className="text-muted-foreground" data-unique-id="27c2b83f-0992-42c7-bfe3-6a146fb6d7f3" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="fceacbcf-0f81-45d4-acea-b55e4f6ca11b" data-file-name="components/bulk-email-upload.tsx">
                      Pending
                    </span></span>}
                </div>
                <div className="col-span-1 flex justify-end" data-unique-id="45b62a4a-e680-4780-975d-67b951d5a6ce" data-file-name="components/bulk-email-upload.tsx">
                  <button onClick={() => removeCustomer(customer.id)} className="text-destructive hover:bg-destructive/10 p-1 rounded" data-unique-id="9ef388c4-6d7d-4af0-9103-5694fadf8d01" data-file-name="components/bulk-email-upload.tsx">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>)}
          </div>
        </div>
      </div>
      
      {/* Add modal component for manual email review */}
      <ManualEmailModal isOpen={manualSendMode && customers.length > 0 && Object.keys(reviewedEmails).length > 0} onClose={() => {
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
      {manualSendMode && customers.length > 0 && Object.keys(reviewedEmails).length > 0 && <div className="mb-6 p-4 border border-primary/20 rounded-md bg-accent/5" data-unique-id="8c31ce10-a1cb-431b-8ddc-f3215ff280fe" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center justify-between" data-unique-id="5322d0fc-eeac-46d6-b8ed-833d6c504344" data-file-name="components/bulk-email-upload.tsx">
            <div data-unique-id="928111b6-1e3f-49a6-8d46-9cdf046ab42f" data-file-name="components/bulk-email-upload.tsx">
              <h3 className="font-medium flex items-center" data-unique-id="d5022993-3e24-4ba8-aa2c-48714b3f7563" data-file-name="components/bulk-email-upload.tsx">
                <Eye className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="0fd6008e-f2fc-46cd-aaf4-51653fc741c4" data-file-name="components/bulk-email-upload.tsx">
                Email Preview & Manual Send
              </span></h3>
              <p className="text-sm text-muted-foreground mt-1" data-unique-id="f1812169-b734-4024-89f7-777561dc3d87" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {getCompletionPercentage()}<span className="editable-text" data-unique-id="3894deda-1647-42f4-aa2b-d3ac1d852782" data-file-name="components/bulk-email-upload.tsx">% complete (</span>{Object.values(sentStatus).filter(Boolean).length}<span className="editable-text" data-unique-id="01bb59a4-8f12-40e8-9c47-9d8609b039ff" data-file-name="components/bulk-email-upload.tsx"> of </span>{customers.length}<span className="editable-text" data-unique-id="e37c12cf-5d92-4a34-8ea6-063cbbe73ed8" data-file-name="components/bulk-email-upload.tsx"> emails sent)
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
          }
        }} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="5f868ec8-0329-440b-a69b-b4a783fd3203" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="9ceb0a0d-ae81-46b6-81e4-5efa92165c3f" data-file-name="components/bulk-email-upload.tsx">
              Continue Sending Emails
            </span></button>
          </div>
          
          <div className="w-full bg-gray-200 h-2 mt-4 rounded-full" data-unique-id="0e9326c6-7ae6-4e1f-865d-1dc33e4c3af8" data-file-name="components/bulk-email-upload.tsx">
            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{
          width: `${getCompletionPercentage()}%`
        }} data-unique-id="1015cd26-fce4-4fda-a260-815782d93854" data-file-name="components/bulk-email-upload.tsx"></div>
          </div>
        </div>}
      
      {manualSendMode ? <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md" data-unique-id="48721afb-203b-4e73-b779-fc38b28fb272" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="34dfe19d-1569-4421-b855-44ff93008d44" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-amber-600" />
            <p className="text-amber-800 font-medium" data-unique-id="a2098ce8-2940-4d0d-aac6-a55aad4d2beb" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="4c57d50b-1db1-433d-8536-a3cfef882d67" data-file-name="components/bulk-email-upload.tsx">Manual Email Sending Mode</span></p>
          </div>
          <p className="mt-1 text-sm text-amber-700" data-unique-id="0c6ffdb5-930f-4a3f-a984-093cf88a1220" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="e85d3e34-e6b5-4c2a-aa32-d26634db1aa0" data-file-name="components/bulk-email-upload.tsx">
            You are in manual email sending mode. After clicking "Send Emails", you'll be guided through 
            reviewing each email. You can copy the content and send it using your own email client.
          </span></p>
          <p className="mt-1 text-sm text-amber-700" data-unique-id="af757e4f-dffb-4e26-91c1-40d85587d588" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="79f11701-cdec-4f20-8413-5736557bad77" data-file-name="components/bulk-email-upload.tsx">
            Don't forget to mark emails as sent after you've sent them to keep track of your progress.
          </span></p>
        </div> : sendingError ? <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md" data-unique-id="45a5f48c-59f9-4916-965b-0f668ba3e918" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="6ee2275b-5cb2-4e1a-b910-2ec2ec9f12e2" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
            <p className="text-red-800 font-medium" data-unique-id="c5736e73-9413-4645-9674-a383e01bf6ad" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="198534a6-6b2b-4bea-ad10-92aecc8b00d1" data-file-name="components/bulk-email-upload.tsx">Error Sending Emails</span></p>
          </div>
          <p className="mt-1 text-sm text-red-700" data-unique-id="616d88b5-42a2-47a8-b33b-4bdc47f7aad0" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {sendingError}
          </p>
          <div className="mt-2 text-xs text-red-600" data-unique-id="8282fb01-07d6-4bc1-9f18-53af545efc69" data-file-name="components/bulk-email-upload.tsx">
            <button className="underline" onClick={() => {
          setManualSendMode(true);
          alert("Switched to manual sending mode. You'll be able to send emails through your own email client.");
        }} data-unique-id="a1a6fa85-b249-47ee-85f7-f691fae43486" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="a5e2c1ec-cce3-4cad-adfd-065dbfac42d5" data-file-name="components/bulk-email-upload.tsx">
              Switch to manual sending mode
            </span></button>
            <span className="mx-2" data-unique-id="f9b7a8a5-9123-4f05-bc75-7ed5ce6d4432" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="efdda89b-817f-45d0-96eb-5171f44362d2" data-file-name="components/bulk-email-upload.tsx">•</span></span>
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
        }} data-unique-id="62c2d79b-e394-42a8-ac0c-2f124ebb6f98" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="6c4ba887-45cb-4c37-8d42-f6dccba2c4e3" data-file-name="components/bulk-email-upload.tsx">
              Show Debug Info
            </span></button>
          </div>
        </div> : <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md" data-unique-id="8e2efed8-b401-41e5-b737-ea29f02b68da" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="58b9d966-0b8d-4c98-9303-c6f95f7794b5" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
            <p className="text-blue-800 font-medium" data-unique-id="495ca070-f191-4131-870a-2d783a9fe47d" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
              {isEmailServiceAvailable ? "Email Sending Enabled" : "Email Service Not Configured"}
            </p>
          </div>
          <p className="mt-1 text-sm text-blue-700" data-unique-id="26392937-0767-43c9-843b-9ac2de10607a" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {isEmailServiceAvailable ? "This application is now connected to a real email service. Emails will be sent to the customer email addresses provided. Please ensure all email addresses are valid and have opted in to receive communications." : "The email service is not configured properly. You can use manual mode to send emails through your own email client."}
          </p>
        </div>}
      
      {sendingProgress > 0 && sendingProgress < 100 && <div className="mb-4" data-unique-id="d52712c1-f9b4-48d4-836f-17c11612ba67" data-file-name="components/bulk-email-upload.tsx">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden" data-unique-id="85284af0-5d41-4458-a696-e01b7614d725" data-file-name="components/bulk-email-upload.tsx">
            <div className="h-full bg-primary transition-all duration-300 ease-out" style={{
          width: `${sendingProgress}%`
        }} data-unique-id="b9a674ca-9d2c-4537-8413-a9f8c8ab9d1b" data-file-name="components/bulk-email-upload.tsx"></div>
          </div>
          <p className="text-xs text-right mt-1 text-gray-500" data-unique-id="b9efa6e1-2b05-4984-9d9b-dde76b7e4fe4" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="310d0cef-c2fe-46be-863e-0af80348ca21" data-file-name="components/bulk-email-upload.tsx">Sending email: </span>{sendingProgress}<span className="editable-text" data-unique-id="973197a3-ae83-435a-9d99-664a71861051" data-file-name="components/bulk-email-upload.tsx">% complete</span></p>
        </div>}
      
      <div className="flex items-center justify-between" data-unique-id="38053cda-ccf4-4d68-8018-c61167c0bfe8" data-file-name="components/bulk-email-upload.tsx">
        <div className="flex items-center text-sm text-muted-foreground" data-unique-id="05071528-918b-4ea0-bbfd-993456f097e0" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
          <AlertCircle className="h-4 w-4 mr-1" />
          {customers.length}<span className="editable-text" data-unique-id="8b929cf3-1921-4e6c-a202-2428fc7e6579" data-file-name="components/bulk-email-upload.tsx"> customers loaded
        </span></div>
        
        <button onClick={sendEmails} disabled={isSending || customers.length === 0} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50" data-unique-id="9decb574-fe1f-4798-8d60-42710089eb3f" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
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
      {showCustomerSelector && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-unique-id="26e2f9f9-bacc-4670-865c-4f93755c3d5a" data-file-name="components/bulk-email-upload.tsx">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col" data-unique-id="a35f0ec2-817b-44e7-a4c4-b1b9b5361e7c" data-file-name="components/bulk-email-upload.tsx">
            <div className="flex justify-between items-center border-b border-border p-4" data-unique-id="e616f9c7-c26b-4579-b001-c775ea29e046" data-file-name="components/bulk-email-upload.tsx">
              <h3 className="font-medium text-lg" data-unique-id="18002d4a-4895-41cc-ba5b-d6845bc1de0c" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="0bd3afb7-1e15-4384-965b-fea55839a2ca" data-file-name="components/bulk-email-upload.tsx">Select Customers</span></h3>
              <button onClick={() => {
            setShowCustomerSelector(false);
            setSelectedCustomerIds([]);
          }} className="p-1 rounded-full hover:bg-accent/20" data-unique-id="0d2c68b1-7312-4893-b156-e5682fdc6e3f" data-file-name="components/bulk-email-upload.tsx">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto" data-unique-id="3dba2206-a1b4-45dc-a4df-22f3746d6368" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
              {savedCustomers.length === 0 ? <div className="text-center py-8 text-muted-foreground" data-unique-id="1c664b59-5475-458b-ad89-cd6170c995a5" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="678c6e61-92be-4364-a7ba-7f3da8ab13b0" data-file-name="components/bulk-email-upload.tsx">
                  No saved customers found. Add customers in the Customers tab.
                </span></div> : <div data-unique-id="c398bb97-842d-4a49-92cd-1352bd47b492" data-file-name="components/bulk-email-upload.tsx">
                  <div className="mb-4 flex justify-between items-center" data-unique-id="ea56a94b-60fb-4d80-b200-886297ab4563" data-file-name="components/bulk-email-upload.tsx">
                    <div className="text-sm text-muted-foreground" data-unique-id="9b8867f6-dbc7-4cc5-b291-0a477d835ec4" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                      {selectedCustomerIds.length}<span className="editable-text" data-unique-id="6038bb93-15cd-4660-a10d-697c23aaf38c" data-file-name="components/bulk-email-upload.tsx"> of </span>{savedCustomers.length}<span className="editable-text" data-unique-id="ce08234c-784e-4668-a9e8-6be0519b42ea" data-file-name="components/bulk-email-upload.tsx"> customers selected
                    </span></div>
                    <button onClick={() => setSelectedCustomerIds(savedCustomers.map(c => c.id))} className="text-sm text-primary" data-unique-id="5791f57b-f6bf-44b8-8e2f-f8459d8b2100" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="5dded633-e3b7-4c5b-88ff-ce4a26da1148" data-file-name="components/bulk-email-upload.tsx">
                      Select All
                    </span></button>
                  </div>
                  
                  <div className="border border-border rounded-md overflow-hidden" data-unique-id="b9115401-5d55-4d4e-a30c-52fe90725caa" data-file-name="components/bulk-email-upload.tsx">
                    <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="428e8596-aba3-4d93-8f5a-f9236122c77d" data-file-name="components/bulk-email-upload.tsx">
                      <div className="col-span-1" data-unique-id="c9fac723-8a4e-46fb-a0aa-ea03ac5ea449" data-file-name="components/bulk-email-upload.tsx"></div>
                      <div className="col-span-4" data-unique-id="e2ee00ff-6149-469d-8677-149dabe4caea" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="a3c4dcb1-ec89-425a-a122-c0b46698ad65" data-file-name="components/bulk-email-upload.tsx">Name</span></div>
                      <div className="col-span-4" data-unique-id="c594b2df-d368-482e-aefe-b3ae19471a4f" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="f9624bde-1cc5-4279-9767-d6cd56e6ead5" data-file-name="components/bulk-email-upload.tsx">Email</span></div>
                      <div className="col-span-3" data-unique-id="c87b2818-c807-42f5-9be7-331bd1e35196" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="100abbf7-e245-4525-8485-d561be8ff375" data-file-name="components/bulk-email-upload.tsx">Company</span></div>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto" data-unique-id="455c97da-661d-4a8c-beb3-f2a358eedc3c" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                      {savedCustomers.map(customer => <div key={customer.id} onClick={() => toggleCustomerSelection(customer.id)} className={`grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm cursor-pointer ${selectedCustomerIds.includes(customer.id) ? 'bg-accent/20' : 'hover:bg-accent/5'}`} data-unique-id="fefa3120-c647-4558-9f8d-5846a5f2fb44" data-file-name="components/bulk-email-upload.tsx">
                          <div className="col-span-1" data-unique-id="bfc80c7a-c34d-4be7-9930-b60220dda327" data-file-name="components/bulk-email-upload.tsx">
                            <input type="checkbox" checked={selectedCustomerIds.includes(customer.id)} onChange={e => {
                      e.stopPropagation();
                      toggleCustomerSelection(customer.id);
                    }} className="rounded border-gray-300" data-unique-id="26ccc4b2-860a-44e2-b47b-8df1a63d1ffb" data-file-name="components/bulk-email-upload.tsx" />
                          </div>
                          <div className="col-span-4 truncate" data-unique-id="c7855e22-b44a-4ebc-ae53-511c8b8c354e" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.name}</div>
                          <div className="col-span-4 truncate" data-unique-id="940e03ed-0293-4de8-add4-451015bf4ea0" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.email}</div>
                          <div className="col-span-3 truncate" data-unique-id="75ef19b3-b2d4-4757-8593-dd2d60f4fcd0" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.company || '—'}</div>
                        </div>)}
                    </div>
                  </div>
                </div>}
            </div>
            
            <div className="border-t border-border p-4 flex justify-end space-x-2" data-unique-id="4a3ab3bd-ce6d-44aa-bb13-86ae4479594e" data-file-name="components/bulk-email-upload.tsx">
              <button onClick={() => {
            setShowCustomerSelector(false);
            setSelectedCustomerIds([]);
          }} className="px-4 py-2 border border-border rounded-md hover:bg-accent/10" data-unique-id="a6aea02a-1126-416a-a8f5-fe0413737568" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="f3beb90e-d480-4630-b881-652367e9ffde" data-file-name="components/bulk-email-upload.tsx">
                Cancel
              </span></button>
              <button onClick={addSelectedCustomersToEmailList} disabled={selectedCustomerIds.length === 0} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50" data-unique-id="8f833274-9f13-4673-af0e-7e0e0d5d368d" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="c7bf3eda-8151-497f-8558-51955f17e743" data-file-name="components/bulk-email-upload.tsx">
                Add </span>{selectedCustomerIds.length}<span className="editable-text" data-unique-id="002c3efb-28e9-48b0-ba1d-cb1341dbb44e" data-file-name="components/bulk-email-upload.tsx"> Customers
              </span></button>
            </div>
          </div>
        </div>}
    </motion.div>;
}