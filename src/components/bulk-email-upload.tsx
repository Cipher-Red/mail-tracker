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
  }} className="bg-card rounded-lg shadow-md p-6" data-unique-id="13877e40-a43e-468a-ba45-75bc68ee31d1" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
      <div className="mb-6" data-unique-id="d5b4b0a6-4802-4cf5-b98a-76026758de54" data-file-name="components/bulk-email-upload.tsx">
        <h2 className="text-xl font-medium mb-2" data-unique-id="9fc27669-1c59-45f2-8313-26a5f8e5b218" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="a5feb281-3859-4225-8790-cf91f95850bb" data-file-name="components/bulk-email-upload.tsx">Bulk Email Sender</span></h2>
        <p className="text-muted-foreground" data-unique-id="5b464b73-25f2-4770-9c87-25489006c8b2" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="da922b33-25e2-408d-96b4-789dae81d95b" data-file-name="components/bulk-email-upload.tsx">
          Upload customer data or select saved customers to send bulk emails
        </span></p>
      </div>
      
      {/* Sending mode selector */}
      <div className="mb-6" data-unique-id="e8ae1e22-22c1-40de-9f5e-4992ebb357fa" data-file-name="components/bulk-email-upload.tsx">
        <div className="bg-card p-5 border border-border rounded-md shadow-sm" data-unique-id="74cc3441-53ec-44c6-8d50-2327c15f6a85" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium mb-4 text-base flex items-center" data-unique-id="d59f543e-71ba-4a32-a69b-f6da438147ed" data-file-name="components/bulk-email-upload.tsx">
            <Mail className="mr-2 h-5 w-5 text-primary" /><span className="editable-text" data-unique-id="6525f81c-1099-4a88-abae-914b1bd5da32" data-file-name="components/bulk-email-upload.tsx">
            Email Sending Method
          </span></h3>
          
          <div className="grid grid-cols-2 gap-4" data-unique-id="ebd757cd-066f-4283-be49-879b2480ae21" data-file-name="components/bulk-email-upload.tsx">
            <button onClick={() => setManualSendMode(false)} disabled={!isEmailServiceAvailable} className={`p-4 rounded-md border ${!manualSendMode ? 'border-primary bg-primary/5' : 'border-border'} flex flex-col items-center text-center transition-all ${!isEmailServiceAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}`} data-unique-id="8f508ea9-ea0c-46c9-bc71-6eb213832637" data-file-name="components/bulk-email-upload.tsx">
              <Send className="h-8 w-8 text-primary mb-2" />
              <div className="font-medium mb-1" data-unique-id="a69bcb90-65a3-4b1b-a26d-f882abced1e4" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="8a2ab55b-404a-4a76-ae96-a44dfb2b14ee" data-file-name="components/bulk-email-upload.tsx">Automated Sending</span></div>
              <div className="text-xs text-muted-foreground" data-unique-id="2221ec5b-1c1f-4ee8-ae77-75416b4e4750" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {isEmailServiceAvailable ? "Emails will be sent automatically via the system" : "Email service not configured"}
              </div>
            </button>
            
            <button onClick={() => setManualSendMode(true)} className={`p-4 rounded-md border ${manualSendMode ? 'border-primary bg-primary/5' : 'border-border'} flex flex-col items-center text-center transition-all hover:border-primary/50`} data-unique-id="6ea1f995-d106-4b94-9a02-1ebf14dba8f2" data-file-name="components/bulk-email-upload.tsx">
              <ExternalLink className="h-8 w-8 text-primary mb-2" />
              <div className="font-medium mb-1" data-unique-id="e0d7965a-e3de-4b82-a25c-badb82964f00" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="47fa1aa8-7c6a-49fa-9afc-25071d0d3a66" data-file-name="components/bulk-email-upload.tsx">Manual Sending</span></div>
              <div className="text-xs text-muted-foreground" data-unique-id="f6db41c7-aa4e-47c3-80fc-5b947ca62d58" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="70c65d3c-0502-4abd-9a8a-1c5600fed49a" data-file-name="components/bulk-email-upload.tsx">
                Review and send emails through your own email client
              </span></div>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 space-y-4" data-unique-id="88ab163f-c645-42b3-b921-665db7743760" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
        <div className="bg-card p-5 border border-border rounded-md shadow-sm" data-unique-id="9166da7c-d3f9-4985-bb7f-4a3b4fb4f4bd" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="c1432a93-5221-416d-b367-3dd2719f5681" data-file-name="components/bulk-email-upload.tsx">
            <UserRound className="mr-2 h-4 w-4 text-primary" />
            <span className="editable-text" data-unique-id="20430aba-343a-49b4-84d4-3eec5aa737c7" data-file-name="components/bulk-email-upload.tsx">Employee Sender Information</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2" data-unique-id="73b9b881-253e-4ae7-94ad-c94dcc426e25" data-file-name="components/bulk-email-upload.tsx">
            <div data-unique-id="2b3e6297-ba13-4c5a-8903-cd0bbdd2ec59" data-file-name="components/bulk-email-upload.tsx">
              <label htmlFor="senderName" className="block text-sm font-medium mb-1" data-unique-id="e17eb3d1-c713-4098-8080-ff785ca960bd" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="52e11f94-f9c8-4448-80a7-7e6ac74c4e14" data-file-name="components/bulk-email-upload.tsx">Employee Name</span>
              </label>
              <input id="senderName" type="text" value={senderName} onChange={e => {
              setSenderName(e.target.value);
              setTimeout(() => handleSenderInfoChange(), 0); // Ensure state is updated before callback
            }} placeholder="John Smith" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="2245e0ea-e9c7-453c-8081-233444a1d4df" data-file-name="components/bulk-email-upload.tsx" />
            </div>
            
            <div data-unique-id="fa0cddea-d679-475b-bd07-081d471d9248" data-file-name="components/bulk-email-upload.tsx">
              <label htmlFor="senderEmail" className="block text-sm font-medium mb-1" data-unique-id="c5543f9e-02bb-4e56-9b29-be21c79f0ba8" data-file-name="components/bulk-email-upload.tsx">
                <Mail className="inline-block h-3 w-3 mr-1 text-muted-foreground" />
                <span className="editable-text" data-unique-id="ff165a92-ac21-491a-9bef-f3902070b5c7" data-file-name="components/bulk-email-upload.tsx">Employee Email</span>
              </label>
              <input id="senderEmail" type="email" value={senderEmail} onChange={e => {
              setSenderEmail(e.target.value);
              setTimeout(() => handleSenderInfoChange(), 0); // Ensure state is updated before callback
            }} placeholder="employee@detroitaxle.com" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30" data-unique-id="d8d96659-3b3c-4855-9413-07869e4435d6" data-file-name="components/bulk-email-upload.tsx" />
              <p className="text-xs text-muted-foreground mt-1" data-unique-id="d87f5c8c-e6c0-4282-880e-4361f502b6b4" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="f3173843-73e3-42a0-84f3-51a4a0b8d11d" data-file-name="components/bulk-email-upload.tsx">This employee will appear as the sender of all emails</span>
              </p>
            </div>
          </div>
          
          <div className="mt-4 flex items-center" data-unique-id="1e499004-60bc-486d-896a-4a9fb2821f15" data-file-name="components/bulk-email-upload.tsx">
            <input type="checkbox" id="includeSurvey" checked={includeSurvey} onChange={() => setIncludeSurvey(!includeSurvey)} className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" data-unique-id="84b86b67-49f5-4731-ad4d-a5c5f1332ca1" data-file-name="components/bulk-email-upload.tsx" />
            <label htmlFor="includeSurvey" className="ml-2 block text-sm" data-unique-id="95d0f4de-536f-46c5-b1bd-4bb2ff39bca5" data-file-name="components/bulk-email-upload.tsx">
              <span className="text-foreground font-medium" data-unique-id="8ff2cef7-6215-4267-8c47-0ea8d0ece9d8" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="8f4a9af4-8feb-4a35-beb1-795d2485e6f4" data-file-name="components/bulk-email-upload.tsx">Include customer feedback survey</span></span>
              <p className="text-xs text-muted-foreground" data-unique-id="41aee6ab-0c0b-4b23-8874-815d6d86f07d" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="f5cb0d15-70af-41cb-85e4-39d67a2966c0" data-file-name="components/bulk-email-upload.tsx">
                Add a link to our customer satisfaction survey: https://feed-back-dax.netlify.app
              </span></p>
            </label>
          </div>
        </div>
        
      {/* Import Order Data Alert - Show when order data is available */}
      {hasOrderData && <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md animate-pulse" data-unique-id="ce582eb3-7aeb-4f06-be57-65ee11553aa6" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center justify-between" data-unique-id="9fef0f5f-3306-4495-9c58-7e16e3b937e0" data-file-name="components/bulk-email-upload.tsx">
            <div className="flex items-center" data-unique-id="097e1df1-f96b-40a6-b12c-d895247545ee" data-file-name="components/bulk-email-upload.tsx">
              <PackageCheck className="h-5 w-5 text-blue-500 mr-3" />
              <div data-unique-id="d2b2a1b6-d0b7-4d83-b89d-1cdc10f92fb9" data-file-name="components/bulk-email-upload.tsx">
                <h4 className="font-medium text-blue-700" data-unique-id="0d8e852c-99b6-4b49-a29b-36450a4581f5" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="129cc63f-da19-47b6-8ac3-65681d4d2c6f" data-file-name="components/bulk-email-upload.tsx">Order Data Available</span></h4>
                <p className="text-sm text-blue-600" data-unique-id="8587190c-09e2-4631-a90c-73f95a92681a" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="7732fbd0-965c-4d97-8f23-13f53f711f3b" data-file-name="components/bulk-email-upload.tsx">
                  Order data from the Order Processor is ready to be imported for email sending
                </span></p>
              </div>
            </div>
            
            <button onClick={importOrderData} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" data-unique-id="12de7a9d-a0db-4ee0-9f3e-338d546f462c" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="4df5faba-7054-4f96-91b2-8bc9a19a4637" data-file-name="components/bulk-email-upload.tsx">
              Import Order Data
            </span></button>
          </div>
        </div>}
    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" data-unique-id="3221ac2a-22e9-4722-aba2-81cf1371d9dc" data-file-name="components/bulk-email-upload.tsx">
          <div className="bg-card p-5 border border-border rounded-md shadow-sm" data-unique-id="09965f9e-2fc2-430c-8fb4-af3d3d404ef9" data-file-name="components/bulk-email-upload.tsx">
            <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="02946a95-c514-43e3-9e7d-b461299c4969" data-file-name="components/bulk-email-upload.tsx">
              <Users className="mr-2 h-4 w-4 text-primary" />
              <span className="editable-text" data-unique-id="49729a0f-e43d-4940-9264-00d1648a196c" data-file-name="components/bulk-email-upload.tsx">Select Saved Customers</span>
            </h3>
            
            <div className="flex flex-col space-y-4" data-unique-id="47000ba3-bd7a-4989-a046-25248ddf2760" data-file-name="components/bulk-email-upload.tsx">
              <p className="text-sm" data-unique-id="cdc52a90-3a8b-42fd-9815-15d32cadfde9" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {savedCustomers.length > 0 ? `You have ${savedCustomers.length} saved customers` : "No saved customers found. Add customers in the Customers tab."}
              </p>
              
              <button onClick={() => setShowCustomerSelector(true)} disabled={savedCustomers.length === 0} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50" data-unique-id="be22605f-e260-4683-9128-234fb59cdf8a" data-file-name="components/bulk-email-upload.tsx">
                <PlusCircle className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="c3e60eed-d434-4449-877a-52679a1ecbba" data-file-name="components/bulk-email-upload.tsx">
                Select Customers
              </span></button>
            </div>
          </div>
          
          <div className="bg-card p-5 border border-border rounded-md shadow-sm" data-unique-id="ab25972f-85bf-4556-b2f4-a857025e1b1a" data-file-name="components/bulk-email-upload.tsx">
            <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="3e3da519-37ad-4401-88e4-f54ae3752f86" data-file-name="components/bulk-email-upload.tsx">
              <FileSpreadsheet className="mr-2 h-4 w-4 text-primary" />
              <span className="editable-text" data-unique-id="fa994a0e-43bd-444a-b4b6-bd53cb976e64" data-file-name="components/bulk-email-upload.tsx">Customer Data Import</span>
            </h3>
            
            <div className="flex flex-col space-y-4" data-unique-id="198d4447-bd04-442c-8e7c-22e66887415d" data-file-name="components/bulk-email-upload.tsx">
              <input type="file" ref={fileInputRef} accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" id="excel-upload" data-unique-id="eda3e5e4-6bcc-484b-8823-2332b27e44a8" data-file-name="components/bulk-email-upload.tsx" />
              
              <div className="flex items-center space-x-2" data-unique-id="c15e93e2-48f8-4e0e-82ff-a2ac60b17c40" data-file-name="components/bulk-email-upload.tsx">
                <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50" data-unique-id="2f6d5b46-b764-40c4-9298-41a351457452" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
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
              }} className="text-primary underline text-sm hover:text-primary/90" data-unique-id="0bfefc49-28bb-4887-8265-89c27f23b5ff" data-file-name="components/bulk-email-upload.tsx">
                  <span className="editable-text" data-unique-id="326565e7-2227-495f-84dc-00d193118b37" data-file-name="components/bulk-email-upload.tsx">Download Excel Template</span>
                </button>
              </div>
              
              <p className="text-xs text-muted-foreground" data-unique-id="eec05bfa-1324-4b62-abe5-97af06e146e3" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="8c556f1f-5166-4ba9-b1ab-66a2c1f457d5" data-file-name="components/bulk-email-upload.tsx">Upload an Excel file (.xlsx or .xls) with customer information</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6" data-unique-id="3454bddd-2f8c-4223-b751-159f374bcd92" data-file-name="components/bulk-email-upload.tsx">
        <div className="flex justify-between items-center mb-3" data-unique-id="689bc4ed-95d2-4af5-919c-644fd93fc37f" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium" data-unique-id="a5e7d8bd-319a-484e-a567-221f7f1072dd" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="0e84f8f0-e0c3-4228-8b10-ea52247e844c" data-file-name="components/bulk-email-upload.tsx">Customer Data</span></h3>
          <button onClick={addCustomer} className="text-sm text-primary hover:underline" data-unique-id="4f597d09-975c-4318-a052-160866b8762f" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="93900046-6328-437f-8489-8fdf3617ba48" data-file-name="components/bulk-email-upload.tsx">
            + Add Customer
          </span></button>
        </div>
        
        <div className="border border-border rounded-md overflow-hidden" data-unique-id="4fd66826-8997-4475-956a-6f909d121d91" data-file-name="components/bulk-email-upload.tsx">
          <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="ac712388-b474-4566-8051-7f378228cd81" data-file-name="components/bulk-email-upload.tsx">
            <div className="col-span-3" data-unique-id="32bfc0aa-f265-445a-a307-7cd52ca630ea" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="6623b3f9-f2a5-45c3-8587-b1982bece05e" data-file-name="components/bulk-email-upload.tsx">Name</span></div>
            <div className="col-span-3" data-unique-id="930e2df9-0ec2-4cf6-860d-0c494876ecc8" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="eefcc062-e39b-487c-b79d-d4663dcd9f32" data-file-name="components/bulk-email-upload.tsx">Order Number</span></div>
            <div className="col-span-3" data-unique-id="8f37aeda-d2dc-4f51-8952-ec6fc4e165e9" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="87f3fece-0daa-4a88-a304-ee55996b98ad" data-file-name="components/bulk-email-upload.tsx">Tracking Number</span></div>
            <div className="col-span-2" data-unique-id="fd09a98f-e5b4-4a95-83c8-f0520bc12ebc" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="77366ad2-3d07-4a6e-86e3-5559b57947b0" data-file-name="components/bulk-email-upload.tsx">Status</span></div>
            <div className="col-span-1" data-unique-id="30376144-4894-4052-a6a4-8a61cd45b60d" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="49ef3442-471b-4513-b592-c838c1c8416f" data-file-name="components/bulk-email-upload.tsx">Actions</span></div>
          </div>
          
          <div className="max-h-64 overflow-y-auto" data-unique-id="f507d9b0-c8c1-4f1d-84a9-1bf470b40958" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {customers.map(customer => <div key={customer.id} className="grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm" data-unique-id="be6fe47a-520c-4235-afec-1ab7d8520320" data-file-name="components/bulk-email-upload.tsx">
                <div className="col-span-3" data-unique-id="1f33ae9e-ca79-404a-badc-1f4db5843ddd" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.name} onChange={e => updateCustomer(customer.id, "name", e.target.value)} placeholder="Customer Name" className="w-full p-1 border border-border rounded text-sm" data-unique-id="d8e20c2d-f746-4b6d-9945-177742cf2751" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-3" data-unique-id="6fcb0934-91bf-4b05-986e-238a3bd0cb2f" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.orderNumber} onChange={e => updateCustomer(customer.id, "orderNumber", e.target.value)} placeholder="Order #" className="w-full p-1 border border-border rounded text-sm" data-unique-id="b93e2942-e319-4dc3-956d-185c690524c5" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-3" data-unique-id="a6315af5-ec91-4589-96ed-f7c8c4b88769" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.trackingNumber} onChange={e => updateCustomer(customer.id, "trackingNumber", e.target.value)} placeholder="Tracking #" className="w-full p-1 border border-border rounded text-sm" data-unique-id="22bcc19c-30e6-460f-b196-cdc658649c74" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-2" data-unique-id="1e90f6b7-1b57-41df-9bfe-f571ecb06067" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                  {sentStatus[customer.id] ? <span className="flex items-center text-green-600" data-unique-id="bb9a53fe-1a88-4632-9fc8-7dc276046afa" data-file-name="components/bulk-email-upload.tsx">
                      <Check className="h-4 w-4 mr-1" />
                      <span data-unique-id="22dbf09b-6da4-4eba-a116-aee3e2f542b6" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="7e7dc5bf-ce05-4eaf-9307-00bb657486cc" data-file-name="components/bulk-email-upload.tsx">Sent</span></span>
                    </span> : failedEmails && failedEmails[customer.id] ? <span className="flex items-center text-red-600" title={failedEmails[customer.id]} data-unique-id="ff102216-300e-41e3-9f99-5dd2e4f3fb6e" data-file-name="components/bulk-email-upload.tsx">
                      <X className="h-4 w-4 mr-1" />
                      <span data-unique-id="739faf60-5f3e-477b-b9c6-39f9fd1f8699" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="f9e912ce-0088-4d71-b8d1-7d3b490dc734" data-file-name="components/bulk-email-upload.tsx">Failed</span></span>
                    </span> : <span className="text-muted-foreground" data-unique-id="9cf3ca75-c154-4067-b12b-d4d7f324f8aa" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="bd87d4e4-5c71-4a1d-bcfb-bcf8bafa87a2" data-file-name="components/bulk-email-upload.tsx">
                      Pending
                    </span></span>}
                </div>
                <div className="col-span-1 flex justify-end" data-unique-id="c7899ff7-76b4-4370-aab2-64d2c48f1725" data-file-name="components/bulk-email-upload.tsx">
                  <button onClick={() => removeCustomer(customer.id)} className="text-destructive hover:bg-destructive/10 p-1 rounded" data-unique-id="0ebba32e-d92d-4ca8-a422-f0ba4a430994" data-file-name="components/bulk-email-upload.tsx">
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
      {manualSendMode && customers.length > 0 && Object.keys(reviewedEmails).length > 0 && <div className="mb-6 p-4 border border-primary/20 rounded-md bg-accent/5" data-unique-id="414c05b7-9c26-405c-ae04-b992fe41292a" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center justify-between" data-unique-id="f5d333d0-99f9-4cc4-95b3-b61236c50107" data-file-name="components/bulk-email-upload.tsx">
            <div data-unique-id="12fc86e7-73be-4c53-bd7c-39e1b1b27355" data-file-name="components/bulk-email-upload.tsx">
              <h3 className="font-medium flex items-center" data-unique-id="88f0f446-ce25-4506-b616-8ee9793ed57d" data-file-name="components/bulk-email-upload.tsx">
                <Eye className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="5a9f618d-685d-4ac5-9b4e-d3088133b5ce" data-file-name="components/bulk-email-upload.tsx">
                Email Preview & Manual Send
              </span></h3>
              <p className="text-sm text-muted-foreground mt-1" data-unique-id="2b45df8d-ccc2-4006-90d0-62311930ff22" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {getCompletionPercentage()}<span className="editable-text" data-unique-id="14734625-64e4-4ae6-96e5-9b9d2ac3b85b" data-file-name="components/bulk-email-upload.tsx">% complete (</span>{Object.values(sentStatus).filter(Boolean).length}<span className="editable-text" data-unique-id="96a85eb9-bde6-4706-b762-39717f7cc717" data-file-name="components/bulk-email-upload.tsx"> of </span>{customers.length}<span className="editable-text" data-unique-id="25e1323c-5700-471d-8918-64841cacdee2" data-file-name="components/bulk-email-upload.tsx"> emails sent)
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
        }} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="3f5fc513-8458-4438-a735-af4614ac28cf" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="cf6fbf65-4655-4830-86be-0ee5c8c1ca7c" data-file-name="components/bulk-email-upload.tsx">
              Continue Sending Emails
            </span></button>
          </div>
          
          <div className="w-full bg-gray-200 h-2 mt-4 rounded-full" data-unique-id="ade8ac9c-09df-40d2-b7be-3bfece9f30de" data-file-name="components/bulk-email-upload.tsx">
            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{
          width: `${getCompletionPercentage()}%`
        }} data-unique-id="7ed9a3c6-02a7-417b-b5dd-3a038ca5d455" data-file-name="components/bulk-email-upload.tsx"></div>
          </div>
        </div>}
      
      {manualSendMode ? <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md" data-unique-id="445a4fd8-d2b5-4f18-8b38-be60bdf427fb" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="6bc766b5-46e5-450f-afd0-bf5424af0501" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-amber-600" />
            <p className="text-amber-800 font-medium" data-unique-id="bba763f6-0ce5-4e46-8de4-164b411d6ecc" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="213c7bec-c2c4-4105-85e1-b7f56e93b3bf" data-file-name="components/bulk-email-upload.tsx">Manual Email Sending Mode</span></p>
          </div>
          <p className="mt-1 text-sm text-amber-700" data-unique-id="4c471a48-ca5b-4ab2-a56b-429f88cea55b" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="83f5662d-f629-448b-ae1b-e0167bfed6d8" data-file-name="components/bulk-email-upload.tsx">
            You are in manual email sending mode. After clicking "Send Emails", you'll be guided through 
            reviewing each email. You can copy the content and send it using your own email client.
          </span></p>
          <p className="mt-1 text-sm text-amber-700" data-unique-id="773fcb69-19be-4d78-be67-c11b19faba77" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="2528f1c6-fd1c-4edd-bb1e-e6797034e80f" data-file-name="components/bulk-email-upload.tsx">
            Don't forget to mark emails as sent after you've sent them to keep track of your progress.
          </span></p>
        </div> : sendingError ? <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md" data-unique-id="4ccc7fbe-0d29-4951-a1dc-c0077d870aa7" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="48aee44b-2309-4e49-be51-b6e24ebfee86" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
            <p className="text-red-800 font-medium" data-unique-id="70538a38-d35b-40d3-96ce-3e956108588e" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="1ee8ebd8-5594-4d92-b3a4-b6c45b1356ce" data-file-name="components/bulk-email-upload.tsx">Error Sending Emails</span></p>
          </div>
          <p className="mt-1 text-sm text-red-700" data-unique-id="8765aca6-42a9-4947-a3e4-2abeabc70ad4" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {sendingError}
          </p>
          <div className="mt-2 text-xs text-red-600" data-unique-id="e82742d2-ca17-4b4a-97eb-7dd26047f712" data-file-name="components/bulk-email-upload.tsx">
            <button className="underline" onClick={() => {
          setManualSendMode(true);
          alert("Switched to manual sending mode. You'll be able to send emails through your own email client.");
        }} data-unique-id="4e1d987a-1669-4505-82b5-fa7691f96145" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="c6312a44-6ace-4ce2-a13d-11137d955012" data-file-name="components/bulk-email-upload.tsx">
              Switch to manual sending mode
            </span></button>
            <span className="mx-2" data-unique-id="17852701-2b19-44f9-b853-cfe2654a3fc3" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="7eadcf14-f95e-4fe8-8fdd-caa24faa4839" data-file-name="components/bulk-email-upload.tsx">•</span></span>
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
        }} data-unique-id="d2aeeceb-8eed-4b5b-a77f-478027b6ed6d" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="05e8dbf1-2f33-433e-9b76-0b709ef013ac" data-file-name="components/bulk-email-upload.tsx">
              Show Debug Info
            </span></button>
          </div>
        </div> : <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md" data-unique-id="29f05a62-e9dc-40d8-8341-38f00f36f290" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="ca25b342-ea67-4426-bd09-3c58e374b284" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
            <p className="text-blue-800 font-medium" data-unique-id="a0413c2a-30e4-44ba-8401-bd463e05e6c7" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
              {isEmailServiceAvailable ? "Email Sending Enabled" : "Email Service Not Configured"}
            </p>
          </div>
          <p className="mt-1 text-sm text-blue-700" data-unique-id="c66c0ec6-d6f2-4cc4-bd5a-ac375f22400a" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {isEmailServiceAvailable ? "This application is now connected to a real email service. Emails will be sent to the customer email addresses provided. Please ensure all email addresses are valid and have opted in to receive communications." : "The email service is not configured properly. You can use manual mode to send emails through your own email client."}
          </p>
        </div>}
      
      {sendingProgress > 0 && sendingProgress < 100 && <div className="mb-4" data-unique-id="d5168092-3042-42d9-b388-6037691e5301" data-file-name="components/bulk-email-upload.tsx">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden" data-unique-id="e74386c4-5a2d-45c8-b0cf-87f66b0aeb55" data-file-name="components/bulk-email-upload.tsx">
            <div className="h-full bg-primary transition-all duration-300 ease-out" style={{
          width: `${sendingProgress}%`
        }} data-unique-id="75fb49ce-ab6e-48b7-97b9-8ac9e5cbb550" data-file-name="components/bulk-email-upload.tsx"></div>
          </div>
          <p className="text-xs text-right mt-1 text-gray-500" data-unique-id="2cb3d83f-95fd-4f3b-9e92-8e45d9c737c4" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="d6dbbba4-3ed4-4ce1-8cf1-b1f9fddda16f" data-file-name="components/bulk-email-upload.tsx">Sending email: </span>{sendingProgress}<span className="editable-text" data-unique-id="1c13d430-0cf3-459b-8870-ddf7220e70a8" data-file-name="components/bulk-email-upload.tsx">% complete</span></p>
        </div>}
      
      <div className="flex items-center justify-between" data-unique-id="7b7fb68c-57cb-43b1-9e98-b796d87461ac" data-file-name="components/bulk-email-upload.tsx">
        <div className="flex items-center text-sm text-muted-foreground" data-unique-id="0c276b9e-7253-412c-aae1-766db3809457" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
          <AlertCircle className="h-4 w-4 mr-1" />
          {customers.length}<span className="editable-text" data-unique-id="65d78124-ef6e-434a-bfba-a72b7cf05518" data-file-name="components/bulk-email-upload.tsx"> customers loaded
        </span></div>
        
        <button onClick={sendEmails} disabled={isSending || customers.length === 0} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50" data-unique-id="a3dc61bc-5cf0-4295-91e5-f514d79b2a85" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
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
    }} data-unique-id="0d5cc29b-3916-4d9f-8b7b-a2f79b02046f" data-file-name="components/bulk-email-upload.tsx">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()} data-unique-id="144960d8-8985-4c3b-8225-7fd8b887a67a" data-file-name="components/bulk-email-upload.tsx">
            <div className="flex justify-between items-center border-b border-border p-4" data-unique-id="d2ff6675-a6ba-4f9d-9d2b-62b0560adf3c" data-file-name="components/bulk-email-upload.tsx">
              <h3 className="font-medium text-lg" data-unique-id="97a34270-d54b-4f30-b8bd-a8aa4da25ca5" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="3249175b-516a-4be7-81b6-53681c662513" data-file-name="components/bulk-email-upload.tsx">Select Customers</span></h3>
              <button onClick={() => {
            setShowCustomerSelector(false);
            setSelectedCustomerIds([]);
          }} className="p-1 rounded-full hover:bg-accent/20" data-unique-id="d8c6a004-378f-4d04-9717-2842661ddaca" data-file-name="components/bulk-email-upload.tsx">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto" data-unique-id="8014f2d7-50bb-4e04-a495-bb83947b762b" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
              {savedCustomers.length === 0 ? <div className="text-center py-8 text-muted-foreground" data-unique-id="5f185732-3877-454a-bc71-7a0ca5528759" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="54136495-7b52-45d2-a84c-1eee87b2047c" data-file-name="components/bulk-email-upload.tsx">
                  No saved customers found. Add customers in the Customers tab.
                </span></div> : <div data-unique-id="85a34993-e110-4df7-a5e5-316fb73d6cd6" data-file-name="components/bulk-email-upload.tsx">
                  <div className="mb-4 flex justify-between items-center" data-unique-id="5bdbb8b6-1ed6-4705-b798-8c5748760206" data-file-name="components/bulk-email-upload.tsx">
                    <div className="text-sm text-muted-foreground" data-unique-id="37938043-6833-41ec-8c66-8af1e78a8951" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                      {selectedCustomerIds.length}<span className="editable-text" data-unique-id="4fb08635-0f7f-4a48-835f-a89f6712dd31" data-file-name="components/bulk-email-upload.tsx"> of </span>{savedCustomers.length}<span className="editable-text" data-unique-id="fbfa0a6e-96b9-43ca-b614-9c3a8f9188b4" data-file-name="components/bulk-email-upload.tsx"> customers selected
                    </span></div>
                    <button onClick={() => setSelectedCustomerIds(savedCustomers.map(c => c.id.toString()))} className="text-sm text-primary" data-unique-id="c82f5837-23de-43de-9ac4-3d5bb3ba01b9" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="9ffaf1aa-002a-42e8-8d87-16d06c08ca96" data-file-name="components/bulk-email-upload.tsx">
                      Select All
                    </span></button>
                  </div>
                  
                  <div className="border border-border rounded-md overflow-hidden" data-unique-id="5e2292c6-9615-4574-93ad-984bb594b788" data-file-name="components/bulk-email-upload.tsx">
                    <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="9edd521b-a4bc-4f53-ba78-326667833581" data-file-name="components/bulk-email-upload.tsx">
                      <div className="col-span-1" data-unique-id="c0afa097-8e68-44bf-860f-97cbced2beeb" data-file-name="components/bulk-email-upload.tsx"></div>
                      <div className="col-span-4" data-unique-id="6a7009f6-d35b-4410-acd5-69895becac6b" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="f58450f6-b004-4d7b-954b-48828526ea56" data-file-name="components/bulk-email-upload.tsx">Name</span></div>
                      <div className="col-span-4" data-unique-id="2964e337-7abc-43f6-acf6-5f65fc5ac20d" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="994bd1e2-e9f6-49db-9283-b5ad283f3f8e" data-file-name="components/bulk-email-upload.tsx">Email</span></div>
                      <div className="col-span-3" data-unique-id="559c4ed0-bbf6-4c8a-abed-cddcf2661d0f" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="d5f87fbf-5247-4c41-9ab6-16e0f7ac0944" data-file-name="components/bulk-email-upload.tsx">Company</span></div>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto" data-unique-id="a59c7c61-1317-4b0a-ae97-d188d56cd7b6" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                      {savedCustomers.map(customer => <div key={customer.id} onClick={() => toggleCustomerSelection(customer.id.toString())} className={`grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm cursor-pointer ${selectedCustomerIds.includes(customer.id.toString()) ? 'bg-accent/20' : 'hover:bg-accent/5'}`} data-unique-id="15351286-143b-4ac6-8fad-7d27401d50a6" data-file-name="components/bulk-email-upload.tsx">
                          <div className="col-span-1" data-unique-id="aed30a3d-9473-4d3b-8f2b-0abefd48c7bb" data-file-name="components/bulk-email-upload.tsx">
                            <input type="checkbox" checked={selectedCustomerIds.includes(customer.id.toString())} onChange={e => {
                      e.stopPropagation();
                      toggleCustomerSelection(customer.id.toString());
                    }} className="rounded border-gray-300" data-unique-id="d7d8b3ee-2a7b-4ca2-835d-8e2daad7075c" data-file-name="components/bulk-email-upload.tsx" />
                          </div>
                          <div className="col-span-4 truncate" data-unique-id="cfe9c8d2-b2d2-4ca5-a183-451d24a883de" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.name}</div>
                          <div className="col-span-4 truncate" data-unique-id="eb10c747-685a-47a1-9392-4b849baabfaa" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.email}</div>
                          <div className="col-span-3 truncate" data-unique-id="c52f7c49-37ad-4a78-92fc-0cdeb5d33e90" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.company || '—'}</div>
                        </div>)}
                    </div>
                  </div>
                </div>}
            </div>
            
            <div className="border-t border-border p-4 flex justify-end space-x-2" data-unique-id="20de3fa1-0edf-46cd-9b2c-2ffe7e826b09" data-file-name="components/bulk-email-upload.tsx">
              <button onClick={() => {
            setShowCustomerSelector(false);
            setSelectedCustomerIds([]);
          }} className="px-4 py-2 border border-border rounded-md hover:bg-accent/10" data-unique-id="53a6cb5c-e4c8-4b1b-a7f7-4af0a3c68bb9" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="d8c1341b-07eb-451b-a174-8f766dfc92d1" data-file-name="components/bulk-email-upload.tsx">
                Cancel
              </span></button>
              <button onClick={addSelectedCustomersToEmailList} disabled={selectedCustomerIds.length === 0} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50" data-unique-id="b7b3b886-a469-45cf-9150-9213d9b05ec3" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="c0274318-26aa-4227-887a-4c10ba2fa886" data-file-name="components/bulk-email-upload.tsx">
                Add </span>{selectedCustomerIds.length}<span className="editable-text" data-unique-id="ef769660-baa5-463d-98ed-8028abfd2698" data-file-name="components/bulk-email-upload.tsx"> Customers
              </span></button>
            </div>
          </div>
        </div>}
    </motion.div>;
}