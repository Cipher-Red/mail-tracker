"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Send, AlertCircle, Check, X, FileSpreadsheet, UserRound, Mail, Users, PlusCircle, RefreshCw } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from 'xlsx';
import { generateHtmlEmail } from "@/lib/email-utils";
import { getLocalStorage } from "@/lib/utils";
import type { Customer } from "@/components/customer-management";
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
  const handleSenderInfoChange = () => {
    if (onSenderEmailChange) {
      onSenderEmailChange({
        name: senderName,
        email: senderEmail
      });
    }
  };

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
  const processTemplate = (content: string, customer: CustomerData): string => {
    let processed = content;
    Object.entries(customer).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      processed = processed.replace(regex, value || '');
    });
    return processed;
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
  }} className="bg-white rounded-lg shadow-md p-6" data-unique-id="16b6b763-3c05-4e9f-b2d7-3af68f1c9802" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
      <div className="mb-6" data-unique-id="3dd33aa1-8d3a-4d70-a0f3-4e864bb73f1a" data-file-name="components/bulk-email-upload.tsx">
        <h2 className="text-xl font-medium mb-2" data-unique-id="e9caaf08-c8b0-4eae-804e-61eebd51db81" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="95424ae2-1eac-4d0c-8e54-892343c96c48" data-file-name="components/bulk-email-upload.tsx">Bulk Email Sender</span></h2>
        <p className="text-muted-foreground" data-unique-id="951fa037-db7e-4360-afae-62482c3aefca" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="e71e0e1b-4021-4ee7-9dea-bb7743c6a50f" data-file-name="components/bulk-email-upload.tsx">
          Upload customer data or select saved customers to send bulk emails
        </span></p>
      </div>
      
      <div className="mb-6 space-y-4" data-unique-id="08e96932-bc45-48b7-9b95-ce49d22d3628" data-file-name="components/bulk-email-upload.tsx">
        <div className="bg-white p-5 border border-border rounded-md shadow-sm" data-unique-id="5572b3a4-8915-4bd1-a725-5bb2e34fc026" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="e5deedd5-ac1e-46f3-a709-30315000f684" data-file-name="components/bulk-email-upload.tsx">
            <UserRound className="mr-2 h-4 w-4 text-primary" />
            <span className="editable-text" data-unique-id="770c0fa1-2b9c-4c12-8996-f68d3a072ab9" data-file-name="components/bulk-email-upload.tsx">Employee Sender Information</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2" data-unique-id="77b86f0c-7c6b-4f5c-8361-00c79e021a64" data-file-name="components/bulk-email-upload.tsx">
            <div data-unique-id="dc08336f-b0b4-4b50-ae2e-9a28784cbf5a" data-file-name="components/bulk-email-upload.tsx">
              <label htmlFor="senderName" className="block text-sm font-medium mb-1" data-unique-id="29038f98-628b-4ba7-9722-36638b5a27ee" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="d7680d6a-d575-49df-92f8-fc0992e46310" data-file-name="components/bulk-email-upload.tsx">Employee Name</span>
              </label>
              <input id="senderName" type="text" value={senderName} onChange={e => {
              setSenderName(e.target.value);
              handleSenderInfoChange();
            }} placeholder="John Smith" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="17d3cee6-fc72-4bde-a3ee-3046a30ec458" data-file-name="components/bulk-email-upload.tsx" />
            </div>
            
            <div data-unique-id="d431918d-6acb-4139-9574-f2ef9ff87ab5" data-file-name="components/bulk-email-upload.tsx">
              <label htmlFor="senderEmail" className="block text-sm font-medium mb-1" data-unique-id="64db0952-501f-468f-8a8e-116ead194b62" data-file-name="components/bulk-email-upload.tsx">
                <Mail className="inline-block h-3 w-3 mr-1 text-muted-foreground" />
                <span className="editable-text" data-unique-id="4a48c1e5-34b5-4490-8982-c0d2baf5a69f" data-file-name="components/bulk-email-upload.tsx">Employee Email</span>
              </label>
              <input id="senderEmail" type="email" value={senderEmail} onChange={e => {
              setSenderEmail(e.target.value);
              handleSenderInfoChange();
            }} placeholder="employee@detroitaxle.com" className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" data-unique-id="98ac97fd-baad-4ef5-91d3-ae839c3a712c" data-file-name="components/bulk-email-upload.tsx" />
              <p className="text-xs text-muted-foreground mt-1" data-unique-id="9ca09008-bb49-427f-9e5e-62c10282475c" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="c18dc354-a0a4-45e2-a7ab-a714ec37cd7a" data-file-name="components/bulk-email-upload.tsx">This employee will appear as the sender of all emails</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" data-unique-id="e9ec1c12-45ce-48c9-80a0-06b464f6f298" data-file-name="components/bulk-email-upload.tsx">
          <div className="bg-white p-5 border border-border rounded-md shadow-sm" data-unique-id="e2cd8f70-536b-497e-9c0e-afd3a178b16d" data-file-name="components/bulk-email-upload.tsx">
            <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="b383caf8-d710-4c8d-9ec3-c46ed072cf0c" data-file-name="components/bulk-email-upload.tsx">
              <Users className="mr-2 h-4 w-4 text-primary" />
              <span className="editable-text" data-unique-id="a42fb80d-510b-4713-ab92-fe3b79c4e9ed" data-file-name="components/bulk-email-upload.tsx">Select Saved Customers</span>
            </h3>
            
            <div className="flex flex-col space-y-4" data-unique-id="0d35bfe7-f21d-41ae-b470-f8ff9f883fa2" data-file-name="components/bulk-email-upload.tsx">
              <p className="text-sm" data-unique-id="b29e8856-8c5d-47f4-bef7-b85b9f96e31b" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                {savedCustomers.length > 0 ? `You have ${savedCustomers.length} saved customers` : "No saved customers found. Add customers in the Customers tab."}
              </p>
              
              <button onClick={() => setShowCustomerSelector(true)} disabled={savedCustomers.length === 0} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50" data-unique-id="523996d7-1304-4dd4-8445-9bd78adbbcf9" data-file-name="components/bulk-email-upload.tsx">
                <PlusCircle className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="a62bd85c-edc6-4d02-8b7c-0b8e07b4b7d9" data-file-name="components/bulk-email-upload.tsx">
                Select Customers
              </span></button>
            </div>
          </div>
          
          <div className="bg-white p-5 border border-border rounded-md shadow-sm" data-unique-id="9549d0ff-1a00-4bbe-9bf8-d6e32d0691cc" data-file-name="components/bulk-email-upload.tsx">
            <h3 className="font-medium mb-3 text-base flex items-center" data-unique-id="11812834-5465-41c4-b289-d357219ab49e" data-file-name="components/bulk-email-upload.tsx">
              <FileSpreadsheet className="mr-2 h-4 w-4 text-primary" />
              <span className="editable-text" data-unique-id="ba1450c0-eaff-4947-b38d-0a4c2bb0eec7" data-file-name="components/bulk-email-upload.tsx">Customer Data Import</span>
            </h3>
            
            <div className="flex flex-col space-y-4" data-unique-id="f809d17b-0dec-4f39-8612-725a074c3aa4" data-file-name="components/bulk-email-upload.tsx">
              <input type="file" ref={fileInputRef} accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" id="excel-upload" data-unique-id="70709e6d-7bf2-449a-ba3a-1e2bdf9a51f2" data-file-name="components/bulk-email-upload.tsx" />
              
              <div className="flex items-center space-x-2" data-unique-id="82660d55-0a00-408e-b5cf-ec2159b62ca5" data-file-name="components/bulk-email-upload.tsx">
                <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50" data-unique-id="9319137d-2fef-4316-84bd-91a2ffa7f5e4" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
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
              }} className="text-primary underline text-sm hover:text-primary/90" data-unique-id="35bdf4c6-27bf-4c9f-9040-e43f875eec2b" data-file-name="components/bulk-email-upload.tsx">
                  <span className="editable-text" data-unique-id="2ce27e27-abc6-4c3e-9ede-6ee18b61aa1b" data-file-name="components/bulk-email-upload.tsx">Download Excel Template</span>
                </button>
              </div>
              
              <p className="text-xs text-muted-foreground" data-unique-id="2cc62526-9e2c-43e6-af91-572228a071e3" data-file-name="components/bulk-email-upload.tsx">
                <span className="editable-text" data-unique-id="3f96809e-7c78-4885-b866-41dc5d2598fb" data-file-name="components/bulk-email-upload.tsx">Upload an Excel file (.xlsx or .xls) with customer information</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6" data-unique-id="bc988660-6ef6-4e2d-8239-b1f2ad3dce69" data-file-name="components/bulk-email-upload.tsx">
        <div className="flex justify-between items-center mb-3" data-unique-id="60c6ce00-f427-4d84-8466-98e16b109b02" data-file-name="components/bulk-email-upload.tsx">
          <h3 className="font-medium" data-unique-id="76c9501d-57fb-4ded-a1c8-269390b44fd8" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="d6a4116d-f1f6-4e96-9686-3f90c69faaec" data-file-name="components/bulk-email-upload.tsx">Customer Data</span></h3>
          <button onClick={addCustomer} className="text-sm text-primary hover:underline" data-unique-id="6952f237-b38c-4b6a-90fc-fb23bc80353c" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="19cc7ad6-c8d3-4c41-9898-7e3032c02fa5" data-file-name="components/bulk-email-upload.tsx">
            + Add Customer
          </span></button>
        </div>
        
        <div className="border border-border rounded-md overflow-hidden" data-unique-id="6a63b2d8-5178-4a0e-a65d-f1badd8b1692" data-file-name="components/bulk-email-upload.tsx">
          <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="2c6589ed-0958-4922-96cd-26cf9a14fdc6" data-file-name="components/bulk-email-upload.tsx">
            <div className="col-span-3" data-unique-id="a0b7cdd5-c65f-4178-b3bf-ededf4983915" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="a9e4d296-9bbf-41ef-8829-10b7db1014df" data-file-name="components/bulk-email-upload.tsx">Name</span></div>
            <div className="col-span-3" data-unique-id="dba3eed0-9141-4287-98f2-d2893e620358" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="589c4b2b-ae3d-4002-9fd3-aff08517cff1" data-file-name="components/bulk-email-upload.tsx">Order Number</span></div>
            <div className="col-span-3" data-unique-id="440745f4-9892-4062-bd6a-d0728cd34d04" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="679840ee-ef98-4c00-a975-5e9281d085ca" data-file-name="components/bulk-email-upload.tsx">Tracking Number</span></div>
            <div className="col-span-2" data-unique-id="4c89d2ef-4415-4d76-a2c9-3881019be31a" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="cded61ff-4871-44ca-a6ec-d85212957f03" data-file-name="components/bulk-email-upload.tsx">Status</span></div>
            <div className="col-span-1" data-unique-id="5d2834d8-6032-47d0-80f5-fe3ed7405ef8" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="c479aba1-0749-48b5-b36d-d06839fe59e8" data-file-name="components/bulk-email-upload.tsx">Actions</span></div>
          </div>
          
          <div className="max-h-64 overflow-y-auto" data-unique-id="9ffe2042-4712-447d-9fff-2e7aa8ff74e6" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {customers.map(customer => <div key={customer.id} className="grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm" data-unique-id="ace05a0b-b0c1-4bc1-b0a7-83d6e1f7b1df" data-file-name="components/bulk-email-upload.tsx">
                <div className="col-span-3" data-unique-id="b53a245a-b800-45d5-9c7c-1f06352b6169" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.name} onChange={e => updateCustomer(customer.id, "name", e.target.value)} placeholder="Customer Name" className="w-full p-1 border border-border rounded text-sm" data-unique-id="c70684a2-dc16-4b74-8eda-4717b7fa2bea" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-3" data-unique-id="6c409b50-3dfd-4c08-a37b-df5606956be4" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.orderNumber} onChange={e => updateCustomer(customer.id, "orderNumber", e.target.value)} placeholder="Order #" className="w-full p-1 border border-border rounded text-sm" data-unique-id="e1b17479-f674-41fb-af95-f327536df07e" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-3" data-unique-id="d4944d36-9bf4-43d6-a9d5-662a77cd84dc" data-file-name="components/bulk-email-upload.tsx">
                  <input value={customer.trackingNumber} onChange={e => updateCustomer(customer.id, "trackingNumber", e.target.value)} placeholder="Tracking #" className="w-full p-1 border border-border rounded text-sm" data-unique-id="fffb47f5-e1be-4dc1-a864-c4a111d34f6d" data-file-name="components/bulk-email-upload.tsx" />
                </div>
                <div className="col-span-2" data-unique-id="a93c5b9c-03de-438e-b0e0-c30e1ee8eced" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                  {sentStatus[customer.id] ? <span className="flex items-center text-green-600" data-unique-id="2776f802-5c07-4f57-a41d-e4cdcf16cc0b" data-file-name="components/bulk-email-upload.tsx">
                      <Check className="h-4 w-4 mr-1" />
                      <span data-unique-id="8167b0d6-d77f-4b2b-8a91-642f78191e4e" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="43dc0c55-512e-469e-b1c8-e46a7476868c" data-file-name="components/bulk-email-upload.tsx">Sent</span></span>
                    </span> : failedEmails && failedEmails[customer.id] ? <span className="flex items-center text-red-600" title={failedEmails[customer.id]} data-unique-id="e075ee41-738f-4714-936c-48e2cea987ff" data-file-name="components/bulk-email-upload.tsx">
                      <X className="h-4 w-4 mr-1" />
                      <span data-unique-id="5ab3aaf4-449e-4463-bdc9-bf470d5db334" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="af0c2cf4-cc73-4a31-9419-932944612351" data-file-name="components/bulk-email-upload.tsx">Failed</span></span>
                    </span> : <span className="text-muted-foreground" data-unique-id="9fa6f99c-795d-4234-af2c-a814bca8a097" data-file-name="components/bulk-email-upload.tsx">
                      <span className="editable-text" data-unique-id="baf265d3-53b0-4fba-b810-99d73d8e94de" data-file-name="components/bulk-email-upload.tsx">Pending</span>
                    </span>}
                </div>
                <div className="col-span-1 flex justify-end" data-unique-id="7a9a2d7a-c82c-4030-8636-13d48b0754f2" data-file-name="components/bulk-email-upload.tsx">
                  <button onClick={() => removeCustomer(customer.id)} className="text-destructive hover:bg-destructive/10 p-1 rounded" data-unique-id="614726fc-ec6a-4aa4-b719-77bade9bfe9a" data-file-name="components/bulk-email-upload.tsx">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>)}
          </div>
        </div>
      </div>
      
      {sendingError ? <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md" data-unique-id="a5af8dca-a44f-4cb9-b1ac-dc8cdfcc059d" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="89232301-56a1-4083-a149-b6b55c25795a" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
            <p className="text-red-800 font-medium" data-unique-id="02e163a6-56ec-4afd-aa42-b93422766296" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="8307e147-fe30-4561-b8b5-8e011025850d" data-file-name="components/bulk-email-upload.tsx">Error Sending Emails</span></p>
          </div>
          <p className="mt-1 text-sm text-red-700" data-unique-id="2b54461b-f48b-45c1-a4a1-9145b31b6ea9" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
            {sendingError}
          </p>
          <div className="mt-2 text-xs text-red-600" data-unique-id="2e9f485a-efce-4d47-a7ee-b2d8f2dbfaf7" data-file-name="components/bulk-email-upload.tsx">
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
        }} data-unique-id="53cef255-4716-4118-a3b0-7d448273b92c" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="7a14df24-cb82-4cf6-a5d4-aa543e73ba00" data-file-name="components/bulk-email-upload.tsx">
              Show Debug Info
            </span></button>
          </div>
        </div> : <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md" data-unique-id="40ccab39-2859-42f7-85ac-433c4921755a" data-file-name="components/bulk-email-upload.tsx">
          <div className="flex items-center" data-unique-id="b8e2d077-c441-4d9b-bf61-8d0d836cae67" data-file-name="components/bulk-email-upload.tsx">
            <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
            <p className="text-blue-800 font-medium" data-unique-id="9df0dc99-712d-4c0f-a9c7-b52787761490" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="694ba5c4-0c49-4d31-8a25-1b390baea541" data-file-name="components/bulk-email-upload.tsx">Email Sending Enabled</span></p>
          </div>
          <p className="mt-1 text-sm text-blue-700" data-unique-id="705480b9-bf36-44d0-9fde-9d8c43446661" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="921ac193-687c-4ca0-b2c0-f5bf7d2a09dd" data-file-name="components/bulk-email-upload.tsx">
            This application is now connected to a real email service. Emails will be sent to the customer email addresses provided.
            Please ensure all email addresses are valid and have opted in to receive communications.
          </span></p>
        </div>}
      
      {sendingProgress > 0 && sendingProgress < 100 && <div className="mb-4" data-unique-id="30191cd6-2706-46cd-9d70-dcfa89665962" data-file-name="components/bulk-email-upload.tsx">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden" data-unique-id="3bff08fb-c7c7-45b4-817a-a8555da00f4a" data-file-name="components/bulk-email-upload.tsx">
            <div className="h-full bg-primary transition-all duration-300 ease-out" style={{
          width: `${sendingProgress}%`
        }} data-unique-id="11bd3d98-b521-439a-8b0e-0ae8db39d4d9" data-file-name="components/bulk-email-upload.tsx"></div>
          </div>
          <p className="text-xs text-right mt-1 text-gray-500" data-unique-id="f58a4059-aa4f-4fd9-ae4a-008decc96914" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="703f570f-f0a2-49da-8a90-d46c0be8740e" data-file-name="components/bulk-email-upload.tsx">Sending email: </span>{sendingProgress}<span className="editable-text" data-unique-id="89e1ebfd-2232-4b97-9bce-cad3c76d0fc7" data-file-name="components/bulk-email-upload.tsx">% complete</span></p>
        </div>}
      
      <div className="flex items-center justify-between" data-unique-id="b49f35f4-ad00-43fb-bb17-6d8d066ab34f" data-file-name="components/bulk-email-upload.tsx">
        <div className="flex items-center text-sm text-muted-foreground" data-unique-id="0e18dd7d-e70e-450a-a27e-64e4993d8bbb" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
          <AlertCircle className="h-4 w-4 mr-1" />
          {customers.length}<span className="editable-text" data-unique-id="61a171eb-b4bc-4be8-b905-3f87a2c9a330" data-file-name="components/bulk-email-upload.tsx"> customers loaded
        </span></div>
        
        <button onClick={sendEmails} disabled={isSending || customers.length === 0} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50" data-unique-id="1781cb6f-3750-4589-bd98-6129bb8e796f" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
          {isSending ? <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </> : <>
              <Send className="mr-2 h-4 w-4" />
              Send Emails
            </>}
        </button>
      </div>
      
      {/* Customer selector modal */}
      {showCustomerSelector && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-unique-id="f4d32134-346b-4bac-9383-88b02957c9b4" data-file-name="components/bulk-email-upload.tsx">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col" data-unique-id="86bf1219-32d4-4693-8a99-7ccddd109df6" data-file-name="components/bulk-email-upload.tsx">
            <div className="flex justify-between items-center border-b border-border p-4" data-unique-id="ec74e0d3-d57c-48c1-a976-8707094b78c0" data-file-name="components/bulk-email-upload.tsx">
              <h3 className="font-medium text-lg" data-unique-id="897925fe-2f37-468e-97e0-8aa92a0e9780" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="dfe9b351-9dba-4154-b271-d0d0ac10a66f" data-file-name="components/bulk-email-upload.tsx">Select Customers</span></h3>
              <button onClick={() => {
            setShowCustomerSelector(false);
            setSelectedCustomerIds([]);
          }} className="p-1 rounded-full hover:bg-accent/20" data-unique-id="5ce20807-7b14-45f3-9343-acd66914ca2b" data-file-name="components/bulk-email-upload.tsx">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto" data-unique-id="0d3dd3f0-f2c7-4451-8889-032d61494e14" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
              {savedCustomers.length === 0 ? <div className="text-center py-8 text-muted-foreground" data-unique-id="944fde9e-8681-46ea-ba52-38e42bf15080" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="6a212a4f-8dfc-4d2f-a20a-4d3a12074234" data-file-name="components/bulk-email-upload.tsx">
                  No saved customers found. Add customers in the Customers tab.
                </span></div> : <div data-unique-id="7a0fca40-5f1f-465d-bcef-b7340902a6f1" data-file-name="components/bulk-email-upload.tsx">
                  <div className="mb-4 flex justify-between items-center" data-unique-id="850ad858-da4c-4cca-b477-43d25b47a9cd" data-file-name="components/bulk-email-upload.tsx">
                    <div className="text-sm text-muted-foreground" data-unique-id="bc529178-fc33-4e8a-a66d-a8e12d6ab2fa" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                      {selectedCustomerIds.length}<span className="editable-text" data-unique-id="10b21c66-9339-4fa7-9bd8-ad8639015060" data-file-name="components/bulk-email-upload.tsx"> of </span>{savedCustomers.length}<span className="editable-text" data-unique-id="ccad5582-9a77-4287-ab19-1bf899e0ca76" data-file-name="components/bulk-email-upload.tsx"> customers selected
                    </span></div>
                    <button onClick={() => setSelectedCustomerIds(savedCustomers.map(c => c.id))} className="text-sm text-primary" data-unique-id="60e35c92-b23c-40a3-a753-b061c5fe27c6" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="a3bb7783-ce0c-452e-aced-160872573de2" data-file-name="components/bulk-email-upload.tsx">
                      Select All
                    </span></button>
                  </div>
                  
                  <div className="border border-border rounded-md overflow-hidden" data-unique-id="70dc2de0-2da1-4fd5-ad8d-307441fffd9f" data-file-name="components/bulk-email-upload.tsx">
                    <div className="grid grid-cols-12 gap-2 p-3 bg-muted text-xs font-medium" data-unique-id="ef864e47-0a7b-4e55-8e39-8a70910e50b9" data-file-name="components/bulk-email-upload.tsx">
                      <div className="col-span-1" data-unique-id="b1766c4a-6f97-4434-812d-070a80fa4489" data-file-name="components/bulk-email-upload.tsx"></div>
                      <div className="col-span-4" data-unique-id="b70624a6-f646-4db6-9085-ed537480d397" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="3c0062a7-2cbd-4ea2-a51d-d9cedb596ef8" data-file-name="components/bulk-email-upload.tsx">Name</span></div>
                      <div className="col-span-4" data-unique-id="720e6ec8-ef3a-4fa4-b406-9fe0d861f5cf" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="0e1ca914-9393-4726-a6f1-76223f3dea23" data-file-name="components/bulk-email-upload.tsx">Email</span></div>
                      <div className="col-span-3" data-unique-id="b9f99092-891f-4717-bcf9-cacded67e922" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="2780dc8f-6d3c-471d-ace9-0cc41b4f539c" data-file-name="components/bulk-email-upload.tsx">Company</span></div>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto" data-unique-id="ee46ea16-3a50-4145-885d-58955f0e1ad4" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">
                      {savedCustomers.map(customer => <div key={customer.id} onClick={() => toggleCustomerSelection(customer.id)} className={`grid grid-cols-12 gap-2 p-3 border-t border-border items-center text-sm cursor-pointer ${selectedCustomerIds.includes(customer.id) ? 'bg-accent/20' : 'hover:bg-accent/5'}`} data-unique-id="4c128050-d566-40d7-bd0a-23ee7121aef6" data-file-name="components/bulk-email-upload.tsx">
                          <div className="col-span-1" data-unique-id="bade4f09-bd45-4bf8-9b9c-cf9cfd573c24" data-file-name="components/bulk-email-upload.tsx">
                            <input type="checkbox" checked={selectedCustomerIds.includes(customer.id)} onChange={e => {
                      e.stopPropagation();
                      toggleCustomerSelection(customer.id);
                    }} className="rounded border-gray-300" data-unique-id="44afab79-54f6-4bb1-8471-b9eee18b86eb" data-file-name="components/bulk-email-upload.tsx" />
                          </div>
                          <div className="col-span-4 truncate" data-unique-id="b11df95a-1f35-4afb-9d7d-c59f5eba8b02" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.name}</div>
                          <div className="col-span-4 truncate" data-unique-id="7b100383-f941-40d6-8b0f-e67b892ede00" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.email}</div>
                          <div className="col-span-3 truncate" data-unique-id="dad0e77a-179e-4941-bddb-7d498d0edb76" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true">{customer.company || '—'}</div>
                        </div>)}
                    </div>
                  </div>
                </div>}
            </div>
            
            <div className="border-t border-border p-4 flex justify-end space-x-2" data-unique-id="9ecca8d1-1fee-43e4-aef3-b1949e848fb9" data-file-name="components/bulk-email-upload.tsx">
              <button onClick={() => {
            setShowCustomerSelector(false);
            setSelectedCustomerIds([]);
          }} className="px-4 py-2 border border-border rounded-md hover:bg-accent/10" data-unique-id="3b18f4df-a7ad-4b05-bb47-c89f1f7ba786" data-file-name="components/bulk-email-upload.tsx"><span className="editable-text" data-unique-id="f263979b-d651-44df-96d3-6bd27f21d572" data-file-name="components/bulk-email-upload.tsx">
                Cancel
              </span></button>
              <button onClick={addSelectedCustomersToEmailList} disabled={selectedCustomerIds.length === 0} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50" data-unique-id="c0b0d21d-6395-45dd-8eb6-3fd27d7e3532" data-file-name="components/bulk-email-upload.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="56279f73-e104-4794-88ce-9c04904f69f0" data-file-name="components/bulk-email-upload.tsx">
                Add </span>{selectedCustomerIds.length}<span className="editable-text" data-unique-id="4bfd4d68-77ca-4ddf-817d-0edde3b67daa" data-file-name="components/bulk-email-upload.tsx"> Customers
              </span></button>
            </div>
          </div>
        </div>}
    </motion.div>;
}