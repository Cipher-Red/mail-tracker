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
      setSelectedTemplates(prev => {
        const newState = {
          ...prev,
          [customerId]: templateId
        };
        // Update the preview after state is set
        setTimeout(() => updateEmailPreview(templateId), 0);
        return newState;
      });
    }
  };

  // Function to update email preview with selected template
  const updateEmailPreview = (templateId: string) => {
    if (!customers.length || currentEmailIndex >= customers.length) return;

    // Find the selected template
    const availableTemplates = getLocalStorage<TemplateData[]>("emailTemplates", []);
    const selectedTemplate = availableTemplates.find(t => t.id === templateId);
    if (!selectedTemplate) return;

    // Force a re-render by updating a timestamp or trigger state
    // This ensures the getCurrentEmail() function is called again with the new template
    setShowManualEmailModal(prev => prev); // Force re-render
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
        orderDataForEmails = window.localStorage.getItem('orderDataForEmails');
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
          lastProcessedOrders = window.localStorage.getItem('lastProcessedOrders');
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
          lastExportedOrders = window.localStorage.getItem('lastExportedOrders');
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
        window.localStorage.removeItem('orderDataForEmails');
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
    const selectedCustomers = savedCustomers.filter(customer => selectedCustomerIds.includes(customer.id.toString())).map(customer => ({
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

    // Validate file type
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      toast.error("Please select a valid Excel file (.xlsx or .xls)");
      return;
    }
    setIsUploading(true);
    toast.loading("Processing Excel file...", {
      id: 'upload'
    });

    // Read the Excel file
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = e.target?.result;
        if (!data) {
          throw new Error("Failed to read file data");
        }
        const workbook = XLSX.read(data, {
          type: 'binary'
        });
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          throw new Error("No worksheets found in the Excel file");
        }
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1
        });
        if (jsonData.length < 2) {
          throw new Error("Excel file must contain at least a header row and one data row");
        }

        // Get headers and data
        const headers = jsonData[0] as string[];
        const dataRows = jsonData.slice(1);

        // Create objects from headers and data
        const processedData = dataRows.map((row: any[]) => {
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] || '';
          });
          return obj;
        });

        // Map Excel data to CustomerData format with better field mapping
        const newCustomers: CustomerData[] = processedData.map((row: any) => ({
          id: uuidv4(),
          name: row.name || row.Name || row.customerName || row['Customer Name'] || '',
          email: row.email || row.Email || row.customerEmail || row['Customer Email'] || '',
          orderNumber: row.orderNumber || row['Order Number'] || row.order || row.Order || '',
          trackingNumber: row.trackingNumber || row['Tracking Number'] || row.tracking || row.Tracking || '',
          address: row.address || row.Address || row.shippingAddress || row['Shipping Address'] || '',
          orderDate: row.orderDate || row['Order Date'] || row.date || row.Date || new Date().toLocaleDateString(),
          items: row.items || row.Items || row.products || row.Products || row.description || row.Description || ''
        }));

        // Filter out completely empty rows
        const validCustomers = newCustomers.filter(customer => customer.name.trim() !== '' || customer.email.trim() !== '');
        if (validCustomers.length === 0) {
          throw new Error("No valid customer data found in the Excel file");
        }
        setCustomers(validCustomers);
        toast.success(`Successfully imported ${validCustomers.length} customers`, {
          id: 'upload'
        });
        setIsUploading(false);

        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        const errorMessage = error instanceof Error ? error.message : "Error parsing Excel file. Please make sure it's a valid Excel file with the correct format.";
        toast.error(errorMessage, {
          id: 'upload'
        });
        setIsUploading(false);
      }
    };
    reader.onerror = () => {
      toast.error("Error reading the Excel file. Please try again.", {
        id: 'upload'
      });
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
      const nextIndex = currentEmailIndex + 1;
      setCurrentEmailIndex(nextIndex);

      // Ensure the modal updates with the new customer's email
      // This helps prevent any state inconsistencies
      setTimeout(() => {
        if (showManualEmailModal) {
          // Force re-render to ensure the new customer's email is displayed
          setShowManualEmailModal(true);
        }
      }, 10);
    }
  };
  const goToPrevEmail = () => {
    if (currentEmailIndex > 0) {
      const prevIndex = currentEmailIndex - 1;
      setCurrentEmailIndex(prevIndex);

      // Ensure the modal updates with the new customer's email
      setTimeout(() => {
        if (showManualEmailModal) {
          // Force re-render to ensure the new customer's email is displayed
          setShowManualEmailModal(true);
        }
      }, 10);
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
  }} className="bg-card rounded-lg shadow-md p-6" data-unique-id="79e3ac0f-9189-46a7-9b28-d90a15a1e0e5" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
      <div className="mb-6" data-unique-id="ad0bfbf2-6e67-4bbc-9a8a-a27c7b038e9a" data-file-name="components/bulk-email-upload.tsx">
        <h2 className="text-xl font-medium mb-2" data-unique-id="e9eb372a-3af8-4f48-abd0-f8ae96b2af08" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="1e1f3c52-2e2d-4131-8076-99baffd35d6f" data-file-name="components/bulk-email-upload.tsx">Bulk Email Sender</span></h2>
        <p className="text-muted-foreground" data-unique-id="9575f4b7-9977-436f-8628-7af3cba3a469" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="dc11ea7f-ed05-49c9-800b-9ad35d26fb34" data-file-name="components/bulk-email-upload.tsx">
          Upload customer data or select saved customers to send bulk emails
        </span></p>
      </div>
      
      {/* Sending mode selector */}
      <div className="mb-6" data-unique-id="0cd1d5e4-e30f-4edc-9214-018be0d8b076" data-file-name="components/bulk-email-upload.tsx">
        <div className="bg-card p-5 border border-border rounded-md shadow-sm" data-unique-id="6024f2c9-483c-4d70-9d06-c1ece6974be1" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium mb-4 text-base flex items-center" data-unique-id="06dfd44f-0e23-4a00-8a4d-ab92bbfbe156" data-file-name="components/bulk-email-upload.tsx">
            <Mail className="mr-2 h-5 w-5 text-primary" /><span className="editable-text" data-unique-id="683d502a-6b2f-4c46-92f0-2bdd30325d48" data-file-name="components/bulk-email-upload.tsx">
            Email Sending Method
          </span></h3>
          
          <div className="grid grid-cols-2 gap-4" data-unique-id="e3a31d7a-9fae-4af2-acd8-22709384f3c3" data-file-name="components/bulk-email-upload.tsx">
            <button onClick={() => setManualSendMode(false)} disabled={!isEmailServiceAvailable} className={`p-4 rounded-md border ${!manualSendMode ? 'border-primary bg-primary/5' : 'border-border'} flex flex-col items-center text-center transition-all ${!isEmailServiceAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}`} data-unique-id="300759db-98c9-4165-80ae-6776110196af" data-file-name="components/bulk-email-upload.tsx">
              <Send className="h-8 w-8 text-primary mb-2" />
              <div className="font-medium mb-1" data-unique-id="511e7c2e-c113-4149-a4b1-cf602e16bcaa" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="f156d06f-554e-47f7-aeeb-34aa75ad542c" data-file-name="components/bulk-email-upload.tsx">Automated Sending</span></div>
              <div className="text-xs text-muted-foreground" data-unique-id="fee7f471-8c64-42c6-a083-e01b77622623" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {isEmailServiceAvailable ? "Emails will be sent automatically via the system" : "Email service not configured"}
              </div>
            </button>
            
            <button onClick={() => setManualSendMode(true)} className={`p-4 rounded-md border ${manualSendMode ? 'border-primary bg-primary/5' : 'border-border'} flex flex-col items-center text-center transition-all hover:border-primary/50`} data-unique-id="d142b339-7a18-4dc2-8d05-4044a6521647" data-file-name="components/bulk-email-upload.tsx">
              <ExternalLink className="h-8 w-8 text-primary mb-2" />
              <div className="font-medium mb-1" data-unique-id="50396633-859d-401c-9b1a-649e535dca3d" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="e1f2dd12-ea23-4df8-b546-b32550679181" data-file-name="components/bulk-email-upload.tsx">Manual Sending</span></div>
              <div className="text-xs text-muted-foreground" data-unique-id="240d5817-7797-4e77-8660-8a398e863dcd" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="678f2ce7-7f7d-461e-911d-9c54075ef0b7" data-file-name="components/bulk-email-upload.tsx">
                Review and send emails through your own email client
              </span></div>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 space-y-4" data-unique-id="a3673a6c-ec94-4575-9ca7-f7a7c5edb1f1" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
        <div className="bg-card p-5 border border-border rounded-md shadow-sm" data-unique-id="4a830049-7180-4f94-8ac8-7186f6a18650" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="1e1c5b91-6784-4049-889d-d201d43f1266" data-file-name="components/bulk-email-upload.tsx">
            <UserRound className="mr-2 h-4 w-4 text-primary" />
            <span className="editable-text" data-unique-id="b6394fc7-2db6-4b6a-b86f-b58d5725f9f4" data-file-name="components/bulk-email-upload.tsx">Employee Sender Information</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2" data-unique-id="dda6a453-665c-47fa-9d90-d69c99a44e41" data-file-name="components/bulk-email-upload.tsx">
            <div data-unique-id="387c6e17-04c5-4a4d-8962-321ad4d1f41b" data-file-name="components/bulk-email-upload.tsx">
              <label htmlFor="senderName" className="block text-sm font-medium mb-1" data-unique-id="76542b26-88b5-4003-a870-4ed7140c799b" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="1b32515f-3321-42e9-8656-af9ba8b38205" data-file-name="components/bulk-email-upload.tsx">Employee Name</span>
              </label>
              <input id="senderName" type="text" value={senderName} onChange={e => {
              setSenderName(e.target.value);
              setTimeout(() => handleSenderInfoChange(), 0); // Ensure state is updated before callback
            }} placeholder="John Smith" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="e2df5773-1842-4b86-816c-5a668bade32c" data-file-name="components/bulk-email-upload.tsx" />
            </div>
            
            <div data-unique-id="3427e6f2-8384-418f-9086-97dae2cb26bb" data-file-name="components/bulk-email-upload.tsx">
              <label htmlFor="senderEmail" className="block text-sm font-medium mb-1" data-unique-id="51c993ad-5feb-4858-b965-5c0d529e6077" data-file-name="components/bulk-email-upload.tsx">
                <Mail className="inline-block h-3 w-3 mr-1 text-muted-foreground" />
                <span className="editable-text" data-unique-id="cb5add8e-fc9b-44bf-8e46-8e915212ffc9" data-file-name="components/bulk-email-upload.tsx">Employee Email</span>
              </label>
              <input id="senderEmail" type="email" value={senderEmail} onChange={e => {
              setSenderEmail(e.target.value);
              setTimeout(() => handleSenderInfoChange(), 0); // Ensure state is updated before callback
            }} placeholder="employee@detroitaxle.com" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="e7eb1345-4aad-4580-bcb0-3986b0317364" data-file-name="components/bulk-email-upload.tsx" />
              <p className="text-xs text-muted-foreground mt-1" data-unique-id="41546331-48d8-4af9-834f-814eb54976cc" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="d1d61a68-58c0-42ca-9003-d6bb8089d005" data-file-name="components/bulk-email-upload.tsx">This employee will appear as the sender of all emails</span>
              </p>
            </div>
          </div>
          
          <div className="mt-4 flex items-center" data-unique-id="df82d299-bee6-4cbd-a5a5-24238598b6fe" data-file-name="components/bulk-email-upload.tsx">
            <input type="checkbox" id="includeSurvey" checked={includeSurvey} onChange={() => setIncludeSurvey(!includeSurvey)} className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" data-unique-id="33b7276c-d3e4-4bbf-8544-c60b3db63b42" data-file-name="components/bulk-email-upload.tsx" />
            <label htmlFor="includeSurvey" className="ml-2 block text-sm" data-unique-id="413aef02-58c9-48aa-8e94-1f983fae5dd2" data-file-name="components/bulk-email-upload.tsx">
              <span className="text-foreground font-medium" data-unique-id="000fa401-757b-4680-a1f3-a2a16c7becdb" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="2acd0d9d-fa5f-42fb-9000-cbe2f54d3d4d" data-file-name="components/bulk-email-upload.tsx">Include customer feedback survey</span></span>
              <p className="text-xs text-muted-foreground" data-unique-id="ad94c27f-35ac-43dc-894e-607a97c3672b" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="3ee7f212-53ef-407e-9078-a1c77589591f" data-file-name="components/bulk-email-upload.tsx">
                Add a link to our customer satisfaction survey: https://feed-back-dax.netlify.app
              </span></p>
            </label>
          </div>
        </div>
        
      {/* Import Order Data Alert - Show when order data is available */}
      {hasOrderData && <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md animate-pulse" data-unique-id="de37880c-3692-4703-b4d4-2f40e397ee9b" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center justify-between" data-unique-id="74c4a43d-5cd5-4d0d-a1f5-c33b4a5ccd82" data-file-name="components/bulk-email-upload.tsx">
            <div className="flex items-center" data-unique-id="deb2aa00-13da-4990-b165-5fc25fe883a9" data-file-name="components/bulk-email-upload.tsx">
              <PackageCheck className="h-5 w-5 text-blue-500 mr-3" />
              <div data-unique-id="dea84f0a-4be8-42fa-80c3-c26dd1df02c6" data-file-name="components/bulk-email-upload.tsx">
                <h4 className="font-medium text-blue-700" data-unique-id="5b0c004d-8fdd-4141-a85b-590084e2979e" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="8753c968-818e-416a-b2ae-444b119e805f" data-file-name="components/bulk-email-upload.tsx">Order Data Available</span></h4>
                <p className="text-sm text-blue-600" data-unique-id="41343c14-b6e3-4aff-bfaf-8a7931470f2d" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="38207bee-620a-45e1-989f-d1384051c959" data-file-name="components/bulk-email-upload.tsx">
                  Order data from the Order Processor is ready to be imported for email sending
                </span></p>
              </div>
            </div>
            
            <button onClick={importOrderData} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" data-unique-id="10451dde-17ad-4f6b-a647-7fc3ce6cbf93" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="4f9697be-a159-4d62-8210-8d00c6c56fb1" data-file-name="components/bulk-email-upload.tsx">
              Import Order Data
            </span></button>
          </div>
        </div>}
    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" data-unique-id="324dcbc5-ce26-4333-b2a7-d725ed6a51b4" data-file-name="components/bulk-email-upload.tsx">
          <div className="bg-card p-5 border border-border rounded-md shadow-sm" data-unique-id="ec41d9d6-f5f4-49a6-936d-7531bdc2862e" data-file-name="components/bulk-email-upload.tsx">
            <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="33657ff6-e561-4e7e-b579-f7c20a8a31ef" data-file-name="components/bulk-email-upload.tsx">
              <Users className="mr-2 h-4 w-4 text-primary" />
              <span className="editable-text" data-unique-id="d763241f-8fc2-49ca-9f0f-f0618881e6ec" data-file-name="components/bulk-email-upload.tsx">Select Saved Customers</span>
            </h3>
            
            <div className="flex flex-col space-y-4" data-unique-id="3771aca1-6007-47e8-b30c-776c6294de9c" data-file-name="components/bulk-email-upload.tsx">
              <p className="text-sm" data-unique-id="85a27582-d85a-4884-bcdf-a24311dffd6f" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {savedCustomers.length > 0 ? `You have ${savedCustomers.length} saved customers` : "No saved customers found. Add customers in the Customers tab."}
              </p>
              
              <button onClick={() => setShowCustomerSelector(true)} disabled={savedCustomers.length === 0} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50" data-unique-id="0801bb29-ae61-496a-a0a4-ba6622524864" data-file-name="components/bulk-email-upload.tsx">
                <PlusCircle className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="cbc40614-2b41-44e9-ad1c-41057c0b9d17" data-file-name="components/bulk-email-upload.tsx">
                Select Customers
              </span></button>
            </div>
          </div>
          
          <div className="bg-card p-5 border border-border rounded-md shadow-sm" data-unique-id="5c605ad2-e233-46b8-94bd-35412b1c3d7f" data-file-name="components/bulk-email-upload.tsx">
            <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="45261a7c-5723-40b0-bc30-c8bedf6f153d" data-file-name="components/bulk-email-upload.tsx">
              <FileSpreadsheet className="mr-2 h-4 w-4 text-primary" />
              <span className="editable-text" data-unique-id="f938c8ff-ca6f-4c1a-a507-65e0591ede87" data-file-name="components/bulk-email-upload.tsx">Customer Data Import</span>
            </h3>
            
            <div className="flex flex-col space-y-4" data-unique-id="e1580017-79d7-41ca-8294-99fc62a3a9c8" data-file-name="components/bulk-email-upload.tsx">
              <input type="file" ref={fileInputRef} accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" id="excel-upload" data-unique-id="bcee28a1-8d57-43c5-9853-0237c97700cd" data-file-name="components/bulk-email-upload.tsx" />
              
              <div className="flex items-center space-x-2" data-unique-id="3048b45f-4537-4e17-b51b-3b4eb836fe7f" data-file-name="components/bulk-email-upload.tsx">
                <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50" data-unique-id="2c80a93a-1f46-4060-a1ec-f5d1581bad36" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
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
              }} className="text-primary underline text-sm hover:text-primary/90" data-unique-id="7ceb545a-3c58-4234-9365-2adc57c8d546" data-file-name="components/bulk-email-upload.tsx">
                  <span className="editable-text" data-unique-id="f5c94cd3-5fae-4994-b863-2698d7aec6c3" data-file-name="components/bulk-email-upload.tsx">Download Excel Template</span>
                </button>
              </div>
              
              <p className="text-xs text-muted-foreground" data-unique-id="c8b30c43-a01d-4e33-b32b-da323d44f170" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="81d0b80f-5d54-4751-872a-fac2d04f537c" data-file-name="components/bulk-email-upload.tsx">Upload an Excel file (.xlsx or .xls) with customer information</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6" data-unique-id="3daa0b48-c089-4afb-b030-93867e4c6d23" data-file-name="components/bulk-email-upload.tsx">
        <div className="flex justify-between items-center mb-3" data-unique-id="72bb7f48-ba4c-46b5-ba6b-7ff82e9705c8" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium" data-unique-id="5f33538a-2983-4529-9937-823a54d16ea7" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="ff410388-915f-4262-baaf-ec5d61c90acc" data-file-name="components/bulk-email-upload.tsx">Customer Data</span></h3>
          <button onClick={addCustomer} className="text-sm text-primary hover:underline" data-unique-id="1962de12-ec8b-4fd0-a301-b90e45a3be54" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="280e485d-20f2-4a6b-bd2f-2be91f550710" data-file-name="components/bulk-email-upload.tsx">
            + Add Customer
          </span></button>
        </div>
        
        <div className="border border-border rounded-md overflow-hidden" data-unique-id="79ec4855-f334-4c50-b76e-c0dacb238b5b" data-file-name="components/bulk-email-upload.tsx">
          <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="ce4b5c9d-234c-4a4c-a8a2-11a7f9ea33a8" data-file-name="components/bulk-email-upload.tsx">
            <div className="col-span-3" data-unique-id="af1b1c29-0c72-49b9-ae1b-28e2174460d5" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="1d480390-0f22-41a6-bac9-54078e4cd3e8" data-file-name="components/bulk-email-upload.tsx">Name</span></div>
            <div className="col-span-3" data-unique-id="2b0fa1ba-9805-43c0-9010-fc20bb9b2483" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="9f55a1ca-8171-48ab-a823-9f2e91c95c6f" data-file-name="components/bulk-email-upload.tsx">Order Number</span></div>
            <div className="col-span-3" data-unique-id="ce94a174-5dd1-4b8e-bd6b-e5114b31c730" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="8ffc3ee8-ae00-4290-bba7-16439f92ea00" data-file-name="components/bulk-email-upload.tsx">Tracking Number</span></div>
            <div className="col-span-2" data-unique-id="bf4ad7ec-2871-4085-a6a8-d0ede5e517fb" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="30f96f88-8274-4a19-a1a0-00f4cedb0ce3" data-file-name="components/bulk-email-upload.tsx">Status</span></div>
            <div className="col-span-1" data-unique-id="97ca18d8-200b-44f1-a122-4fe938851869" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="392de6e5-7cbf-4d94-a556-746473967ce4" data-file-name="components/bulk-email-upload.tsx">Actions</span></div>
          </div>
          
          <div className="max-h-64 overflow-y-auto" data-unique-id="a4160dac-7ad8-480c-ade1-22a3dacdaa11" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {customers.map(customer => <div key={customer.id} className="grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm" data-unique-id="5f0cca39-6739-464e-b7c3-33fe7fc85778" data-file-name="components/bulk-email-upload.tsx">
                <div className="col-span-3" data-unique-id="f6c7a4ab-5a9a-466d-89ce-14f57d8301a8" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.name} onChange={e => updateCustomer(customer.id, "name", e.target.value)} placeholder="Customer Name" className="w-full p-1 border border-border rounded text-sm" data-unique-id="ebf68b0e-2f12-41c8-be3c-99881a6f6a97" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-3" data-unique-id="17432a56-c393-42bd-8363-f6b617e2fe1c" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.orderNumber} onChange={e => updateCustomer(customer.id, "orderNumber", e.target.value)} placeholder="Order #" className="w-full p-1 border border-border rounded text-sm" data-unique-id="e049fccc-eab4-401c-a72c-c678621e7a51" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-3" data-unique-id="7b8141fd-1b5c-4ff0-9614-6a0e37badd9c" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.trackingNumber} onChange={e => updateCustomer(customer.id, "trackingNumber", e.target.value)} placeholder="Tracking #" className="w-full p-1 border border-border rounded text-sm" data-unique-id="87c528a0-5f41-44a4-8d21-864ca75e510c" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-2" data-unique-id="e1852a39-30f0-496d-9bd5-e613a8f116bf" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                  {sentStatus[customer.id] ? <span className="flex items-center text-green-600" data-unique-id="092310b6-9121-4f47-9a97-157ed9039bea" data-file-name="components/bulk-email-upload.tsx">
                      <Check className="h-4 w-4 mr-1" />
                      <span data-unique-id="d5c60e81-fe09-43cc-bd73-00b5b62763de" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="0a25cacc-ff66-4f90-bd17-a8047ca3db6e" data-file-name="components/bulk-email-upload.tsx">Sent</span></span>
                    </span> : failedEmails && failedEmails[customer.id] ? <span className="flex items-center text-red-600" title={failedEmails[customer.id]} data-unique-id="d6e39b4f-62f8-4627-b6f1-fa8d566bdbfa" data-file-name="components/bulk-email-upload.tsx">
                      <X className="h-4 w-4 mr-1" />
                      <span data-unique-id="4829bfc7-281b-4112-b2cc-b8c6e9cb2938" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="5a3f1262-9c80-413e-81c7-6ae29a3ebb7c" data-file-name="components/bulk-email-upload.tsx">Failed</span></span>
                    </span> : <span className="text-muted-foreground" data-unique-id="c7d8a279-a67d-4cb6-8e0b-8578ac05961c" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="badedfb3-a14e-479f-ab02-28d8095e7369" data-file-name="components/bulk-email-upload.tsx">
                      Pending
                    </span></span>}
                </div>
                <div className="col-span-1 flex justify-end" data-unique-id="a0ecc44d-8a6e-462b-9ed9-c791beb6fe70" data-file-name="components/bulk-email-upload.tsx">
                  <button onClick={() => removeCustomer(customer.id)} className="text-destructive hover:bg-destructive/10 p-1 rounded" data-unique-id="5bb8468f-7509-449b-ba42-18c1dfa22645" data-file-name="components/bulk-email-upload.tsx">
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
      {manualSendMode && customers.length > 0 && Object.keys(reviewedEmails).length > 0 && <div className="mb-6 p-4 border border-primary/20 rounded-md bg-accent/5" data-unique-id="8ba8513d-5457-4725-8e21-db04af4104a5" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center justify-between" data-unique-id="94c8eadf-2536-4b01-86ce-8853f75e1d20" data-file-name="components/bulk-email-upload.tsx">
            <div data-unique-id="687654dc-03c0-45ea-aab9-725de99f799f" data-file-name="components/bulk-email-upload.tsx">
              <h3 className="font-medium flex items-center" data-unique-id="c6178bb4-e412-415c-ae11-9075c1ff9881" data-file-name="components/bulk-email-upload.tsx">
                <Eye className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="2575040f-b8a4-4524-b27f-6e7bbd152755" data-file-name="components/bulk-email-upload.tsx">
                Email Preview & Manual Send
              </span></h3>
              <p className="text-sm text-muted-foreground mt-1" data-unique-id="865c3a7b-c8e7-4fc5-86f2-8f081b2112ec" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {getCompletionPercentage()}<span className="editable-text" data-unique-id="9ecadcd2-7a29-4f49-a3cb-6ce35c3108d2" data-file-name="components/bulk-email-upload.tsx">% complete (</span>{Object.values(sentStatus).filter(Boolean).length}<span className="editable-text" data-unique-id="07045eee-a89f-4bbb-bb89-7ea106927d31" data-file-name="components/bulk-email-upload.tsx"> of </span>{customers.length}<span className="editable-text" data-unique-id="0d09d128-2f24-4621-947f-d98955d7fa27" data-file-name="components/bulk-email-upload.tsx"> emails sent)
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
        }} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="7f7add6e-1883-4aff-9cf4-b003ec1d31ca" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="de55ce0b-b472-4a50-aa60-c6d25f320190" data-file-name="components/bulk-email-upload.tsx">
              Continue Sending Emails
            </span></button>
          </div>
          
          <div className="w-full bg-gray-200 h-2 mt-4 rounded-full" data-unique-id="dfc5fd21-b87f-4a77-8e84-5330458f083b" data-file-name="components/bulk-email-upload.tsx">
            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{
          width: `${getCompletionPercentage()}%`
        }} data-unique-id="aa0e8ad5-5bc7-4eaf-a609-9c02bfc64e55" data-file-name="components/bulk-email-upload.tsx"></div>
          </div>
        </div>}
      
      {manualSendMode ? <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md" data-unique-id="1196709e-e1cd-4719-add0-a0c8d2eb17ef" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="8ea2cbef-0192-44cc-8efc-da371e7eeac3" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-amber-600" />
            <p className="text-amber-800 font-medium" data-unique-id="152e3e12-e53c-4cab-b5f2-002c7c625540" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="2d759769-6ca0-48aa-963b-860667de39af" data-file-name="components/bulk-email-upload.tsx">Manual Email Sending Mode</span></p>
          </div>
          <p className="mt-1 text-sm text-amber-700" data-unique-id="8a8960d6-7aea-46c4-8ca3-546315f84ee0" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="0d6a87b6-89e9-4b20-b543-c99afff4f480" data-file-name="components/bulk-email-upload.tsx">
            You are in manual email sending mode. After clicking "Send Emails", you'll be guided through 
            reviewing each email. You can copy the content and send it using your own email client.
          </span></p>
          <p className="mt-1 text-sm text-amber-700" data-unique-id="f8cc62a9-71a4-4844-86bb-6d312025b31c" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="4c3fc80b-6b57-44a5-beeb-3339fb976d3b" data-file-name="components/bulk-email-upload.tsx">
            Don't forget to mark emails as sent after you've sent them to keep track of your progress.
          </span></p>
        </div> : sendingError ? <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md" data-unique-id="42d9f573-2c69-414c-8a69-21922aa0026d" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="1e9528e9-110c-466a-bf90-69705c12c350" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
            <p className="text-red-800 font-medium" data-unique-id="d738b346-2919-48cf-9bcc-9bc7ee0dedac" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="935e980b-fffe-498a-bb7d-ed6d8f0daaef" data-file-name="components/bulk-email-upload.tsx">Error Sending Emails</span></p>
          </div>
          <p className="mt-1 text-sm text-red-700" data-unique-id="5ffddd85-bf00-486a-a8ec-c3353bee5548" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {sendingError}
          </p>
          <div className="mt-2 text-xs text-red-600" data-unique-id="7f275504-5118-4239-8003-aaf80c9c08ea" data-file-name="components/bulk-email-upload.tsx">
            <button className="underline" onClick={() => {
          setManualSendMode(true);
          alert("Switched to manual sending mode. You'll be able to send emails through your own email client.");
        }} data-unique-id="dba72cbf-97d5-443c-a327-04702c011d52" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="184d1237-9d7b-4584-a5b7-1849c6d5b078" data-file-name="components/bulk-email-upload.tsx">
              Switch to manual sending mode
            </span></button>
            <span className="mx-2" data-unique-id="6dcbbb9b-64ce-486c-bda3-a47d586d18c4" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="31d1371e-cf44-47cf-97be-8ad4ce38ffd6" data-file-name="components/bulk-email-upload.tsx">•</span></span>
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
        }} data-unique-id="85e4e83c-3692-43d0-b2db-a4ee149f6b20" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="0701743c-4fed-4924-a9ef-568c8c22dad6" data-file-name="components/bulk-email-upload.tsx">
              Show Debug Info
            </span></button>
          </div>
        </div> : <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md" data-unique-id="4e014214-6c5f-4d0c-bd66-f915b3b2ad29" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="7e59f1fc-82ca-43d4-a487-83d0391b625f" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
            <p className="text-blue-800 font-medium" data-unique-id="84674996-e9ab-4fb8-b173-f8824ffa1651" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
              {isEmailServiceAvailable ? "Email Sending Enabled" : "Email Service Not Configured"}
            </p>
          </div>
          <p className="mt-1 text-sm text-blue-700" data-unique-id="220c792d-45b1-414d-b01c-648b145a433e" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {isEmailServiceAvailable ? "This application is now connected to a real email service. Emails will be sent to the customer email addresses provided. Please ensure all email addresses are valid and have opted in to receive communications." : "The email service is not configured properly. You can use manual mode to send emails through your own email client."}
          </p>
        </div>}
      
      {sendingProgress > 0 && sendingProgress < 100 && <div className="mb-4" data-unique-id="926cea7f-de8d-4277-8952-4c4ff67d0c9d" data-file-name="components/bulk-email-upload.tsx">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden" data-unique-id="1acb4794-2995-44d7-a708-494213dfb466" data-file-name="components/bulk-email-upload.tsx">
            <div className="h-full bg-primary transition-all duration-300 ease-out" style={{
          width: `${sendingProgress}%`
        }} data-unique-id="47218bd3-8e0e-4a63-9bb9-bab71c3af416" data-file-name="components/bulk-email-upload.tsx"></div>
          </div>
          <p className="text-xs text-right mt-1 text-gray-500" data-unique-id="b14b44e6-031a-49d2-9d05-97edda813c58" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="454a7494-4f42-4e73-8734-8532dfe98d47" data-file-name="components/bulk-email-upload.tsx">Sending email: </span>{sendingProgress}<span className="editable-text" data-unique-id="22dd57d3-ec23-4d97-8724-c4c4a4942449" data-file-name="components/bulk-email-upload.tsx">% complete</span></p>
        </div>}
      
      <div className="flex items-center justify-between" data-unique-id="b9154821-1824-4057-8d5e-0205b9561898" data-file-name="components/bulk-email-upload.tsx">
        <div className="flex items-center text-sm text-muted-foreground" data-unique-id="1d8723d2-9221-4f64-9c99-6bccd106c803" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
          <AlertCircle className="h-4 w-4 mr-1" />
          {customers.length}<span className="editable-text" data-unique-id="47572504-1671-4a8c-abd8-cdb25863c000" data-file-name="components/bulk-email-upload.tsx"> customers loaded
        </span></div>
        
        <button onClick={sendEmails} disabled={isSending || customers.length === 0} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50" data-unique-id="878f91cc-b2df-4075-bf63-1bb3319ddc76" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
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
    }} data-unique-id="fcc7c627-c294-438a-b9f8-8a864db8b2ca" data-file-name="components/bulk-email-upload.tsx">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()} data-unique-id="8b9b3a3e-e9fc-4c31-9259-3aa0ca3a20d6" data-file-name="components/bulk-email-upload.tsx">
            <div className="flex justify-between items-center border-b border-border p-4" data-unique-id="a953f032-7320-4a03-b782-efc0a2d709c2" data-file-name="components/bulk-email-upload.tsx">
              <h3 className="font-medium text-lg" data-unique-id="c4233e3a-6a87-41a5-928b-0bac53080d5b" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="e95a27ff-5290-40ba-a508-dea65d427278" data-file-name="components/bulk-email-upload.tsx">Select Customers</span></h3>
              <button onClick={() => {
            setShowCustomerSelector(false);
            setSelectedCustomerIds([]);
          }} className="p-1 rounded-full hover:bg-accent/20" data-unique-id="4658ce70-8850-4092-8e7f-61006b65dda8" data-file-name="components/bulk-email-upload.tsx">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto" data-unique-id="ea7e2479-6481-4613-8e87-79dcf73dba56" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
              {savedCustomers.length === 0 ? <div className="text-center py-8 text-muted-foreground" data-unique-id="b331378d-baa6-4dbc-96c2-c0a6b4384f5b" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="33007a1f-e130-4465-89dc-02c1f8675a42" data-file-name="components/bulk-email-upload.tsx">
                  No saved customers found. Add customers in the Customers tab.
                </span></div> : <div data-unique-id="09a3ea4b-fa3d-44e3-a4de-4f4eb425c55a" data-file-name="components/bulk-email-upload.tsx">
                  <div className="mb-4 flex justify-between items-center" data-unique-id="e1efcad4-e888-4224-b4ca-473e42dee90a" data-file-name="components/bulk-email-upload.tsx">
                    <div className="text-sm text-muted-foreground" data-unique-id="3cf3acd0-3533-4f03-bb73-ba331d950de0" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                      {selectedCustomerIds.length}<span className="editable-text" data-unique-id="330764ab-cedf-433b-b117-306aac18a1a0" data-file-name="components/bulk-email-upload.tsx"> of </span>{savedCustomers.length}<span className="editable-text" data-unique-id="cdc9a951-303d-4cba-b360-f486d869beae" data-file-name="components/bulk-email-upload.tsx"> customers selected
                    </span></div>
                    <button onClick={() => setSelectedCustomerIds(savedCustomers.map(c => c.id.toString()))} className="text-sm text-primary" data-unique-id="a319612d-107c-475a-8ee9-78d24e690d89" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="c6cc0fe6-d18f-4f9c-bb62-3f4365dce7b1" data-file-name="components/bulk-email-upload.tsx">
                      Select All
                    </span></button>
                  </div>
                  
                  <div className="border border-border rounded-md overflow-hidden" data-unique-id="1c74a81a-427d-4c7c-ad35-627dd3eee2e0" data-file-name="components/bulk-email-upload.tsx">
                    <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="a648561d-649e-48bb-9845-349402b9ff96" data-file-name="components/bulk-email-upload.tsx">
                      <div className="col-span-1" data-unique-id="ab819be8-ea92-4a4e-b6e4-7d10f613228b" data-file-name="components/bulk-email-upload.tsx"></div>
                      <div className="col-span-4" data-unique-id="d4786ef1-f1df-4c7d-8c01-890f56f26726" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="03cfcb20-0916-4f00-85d9-b2bbe4312de5" data-file-name="components/bulk-email-upload.tsx">Name</span></div>
                      <div className="col-span-4" data-unique-id="38fa97a1-317f-4986-b173-cfb84e5661ee" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="05905a5a-1c65-4487-9599-74ae6aeac58a" data-file-name="components/bulk-email-upload.tsx">Email</span></div>
                      <div className="col-span-3" data-unique-id="954e3fb6-02fa-4734-9559-8c76714d8141" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="f690e7fb-90aa-4499-90f7-7844c3eb0d8b" data-file-name="components/bulk-email-upload.tsx">Company</span></div>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto" data-unique-id="8c4e1e71-6ae6-4cbe-98d7-c83240e936c3" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                      {savedCustomers.map(customer => <div key={customer.id} onClick={() => toggleCustomerSelection(customer.id.toString())} className={`grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm cursor-pointer ${selectedCustomerIds.includes(customer.id.toString()) ? 'bg-accent/20' : 'hover:bg-accent/5'}`} data-unique-id="899a88a1-30a9-4db1-95e0-dda256d4a8d3" data-file-name="components/bulk-email-upload.tsx">
                          <div className="col-span-1" data-unique-id="7c15454f-d074-46af-a070-a6982dd1ff12" data-file-name="components/bulk-email-upload.tsx">
                            <input type="checkbox" checked={selectedCustomerIds.includes(customer.id.toString())} onChange={e => {
                      e.stopPropagation();
                      toggleCustomerSelection(customer.id.toString());
                    }} className="rounded border-gray-300" data-unique-id="b74af1f2-0618-454f-ad0c-9f60821af3b9" data-file-name="components/bulk-email-upload.tsx" />
                          </div>
                          <div className="col-span-4 truncate" data-unique-id="b80fac1e-c28b-4809-a08c-46b2aedd9332" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.name}</div>
                          <div className="col-span-4 truncate" data-unique-id="81a30986-d4c9-4295-b4ee-b16139a5191d" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.email}</div>
                          <div className="col-span-3 truncate" data-unique-id="6941391b-6f69-4dbf-b408-224d6f03957f" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.company || '—'}</div>
                        </div>)}
                    </div>
                  </div>
                </div>}
            </div>
            
            <div className="border-t border-border p-4 flex justify-end space-x-2" data-unique-id="b94e88ed-661d-4a49-b33e-c04abc7f0bbf" data-file-name="components/bulk-email-upload.tsx">
              <button onClick={() => {
            setShowCustomerSelector(false);
            setSelectedCustomerIds([]);
          }} className="px-4 py-2 border border-border rounded-md hover:bg-accent/10" data-unique-id="4519b9da-d3e1-4f60-9a0a-7c5e24b91d18" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="902e900b-712d-40e8-b586-d272fa076005" data-file-name="components/bulk-email-upload.tsx">
                Cancel
              </span></button>
              <button onClick={addSelectedCustomersToEmailList} disabled={selectedCustomerIds.length === 0} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50" data-unique-id="aaa92861-1f7d-456a-b39f-cabb293f1bd1" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="eeebdeff-d8f9-48de-8a37-12efc774edfd" data-file-name="components/bulk-email-upload.tsx">
                Add </span>{selectedCustomerIds.length}<span className="editable-text" data-unique-id="a55a0fac-9566-4148-b97f-822fca1b79a4" data-file-name="components/bulk-email-upload.tsx"> Customers
              </span></button>
            </div>
          </div>
        </div>}
    </motion.div>;
}