'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUp, FileSpreadsheet, AlertCircle, DownloadIcon, Mail, Search, X, Eye, Edit, Save, ExternalLink, Phone, Home, Calendar, Package, MapPin, DollarSign, Info } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useDropzone } from 'react-dropzone';
import toast, { Toaster } from 'react-hot-toast';
import FileUploader from '@/components/file-uploader';
import DataTable from '@/components/data-table';
import { cleanAndValidateData } from '@/lib/data-processor';
import { saveAs } from 'file-saver';
import { useRouter } from 'next/navigation';

// Define the raw data structure from the uploaded file
export interface RawOrderData {
  [key: string]: any;
}

// Define the cleaned and structured data format
export interface CleanedOrderData {
  customerOrderNumber: string;
  shipToName: string;
  shipToPhone: string;
  shipToLine1: string;
  shipToCity: string;
  shipToStateProvince: string;
  shipToPostalCode: string;
  orderTotal: number;
  actualShipDate: string;
  trackingNumbers: string[];
  orderSource: string;
  orderSummary: string;
  shipToEmail?: string; // Added field for customer email
}
export default function OrderDataProcessor() {
  const router = useRouter();
  const [data, setData] = useState<CleanedOrderData[]>([]);
  const [rawData, setRawData] = useState<RawOrderData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStats, setProcessingStats] = useState({
    total: 0,
    processed: 0,
    filtered: 0,
    invalid: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<CleanedOrderData | null>(null);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState('');
  // Function to open customer details
  const showCustomerDetails = (order: CleanedOrderData) => {
    setSelectedOrder(order);
    setTempEmail(order.shipToEmail || '');
  };

  // Function to save customer email
  const saveCustomerEmail = () => {
    if (selectedOrder) {
      const updatedData = data.map(order => order.customerOrderNumber === selectedOrder.customerOrderNumber ? {
        ...order,
        shipToEmail: tempEmail
      } : order);
      setData(updatedData);
      setSelectedOrder({
        ...selectedOrder,
        shipToEmail: tempEmail
      });
      setIsEditingEmail(false);
      toast.success('Customer email updated successfully');
    }
  };

  // Filter data based on search query (order number)
  const filteredData = data.filter(order => searchQuery ? order.customerOrderNumber.toLowerCase().includes(searchQuery.toLowerCase()) : true);

  // Function to process uploaded files
  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = e => {
        const result = e.target?.result;
        if (!result) {
          toast.error('Failed to read file content');
          setIsProcessing(false);
          return;
        }
        try {
          // Parse the file data based on file type
          const workbook = XLSX.read(result, {
            type: 'binary'
          });

          // Get first worksheet
          const wsname = workbook.SheetNames[0];
          const ws = workbook.Sheets[wsname];

          // Convert to JSON
          const rawJsonData = XLSX.utils.sheet_to_json<RawOrderData>(ws);
          setRawData(rawJsonData);

          // Process the data through our cleaning and validation functions
          const {
            cleanedData,
            stats
          } = cleanAndValidateData(rawJsonData);
          setData(cleanedData);
          setProcessingStats(stats);
          if (cleanedData.length > 0) {
            toast.success(`Successfully processed ${cleanedData.length} orders`);
          } else {
            toast.error('No valid orders found after filtering');
          }
        } catch (error) {
          console.error('Error parsing file:', error);
          toast.error('Failed to parse file. Please check the format.');
        }
        setIsProcessing(false);
      };
      reader.onerror = () => {
        toast.error('Error reading file');
        setIsProcessing(false);
      };

      // Read the file as binary
      reader.readAsBinaryString(file);
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('An error occurred while processing the file');
      setIsProcessing(false);
    }
  }, []);
  const exportProcessedData = () => {
    if (data.length === 0) {
      toast.error('No data to export');
      return;
    }
    try {
      // Create a new workbook
      const wb = XLSX.utils.book_new();

      // Convert JSON to worksheet
      const ws = XLSX.utils.json_to_sheet(data);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Processed Orders');

      // Generate Excel file
      const excelBuffer = XLSX.write(wb, {
        bookType: 'xlsx',
        type: 'array'
      });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      // Save file
      saveAs(blob, 'processed_orders.xlsx');
      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  };

  // Send processed order data to email system
  const sendEmailsToCustomers = () => {
    if (data.length === 0) {
      toast.error('No order data to email');
      return;
    }
    try {
      // Save order data to localStorage for the email system to use
      if (typeof window !== 'undefined') {
        // Additional safety check to ensure localStorage is available
        const storage = window.localStorage;
        storage.setItem('orderDataForEmails', JSON.stringify(data));
      }
      toast.success(`${data.length} orders ready for email sending`);

      // Navigate to the email sender page
      setTimeout(() => {
        router.push('/?tab=bulkUpload');
      }, 1500);
    } catch (error) {
      console.error('Error preparing data for emails:', error);
      toast.error('Failed to prepare data for emails');
    }
  };
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} transition={{
    duration: 0.3
  }} className="max-w-7xl mx-auto" data-unique-id="b2acc9f9-ebdf-4ad2-89f6-2ff7f9797837" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
      <Toaster position="top-center" toastOptions={{
      duration: 3000
    }} />
      
      <div className="mb-8" data-unique-id="838ab130-7213-4d7e-a850-d910b2ad1b74" data-file-name="components/order-data-processor.tsx">
        <h1 className="text-3xl font-bold text-primary mb-2" data-unique-id="bed3ed9b-5a2d-4085-95d7-73b0b53d4338" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="0ef8042b-5f4f-4400-9346-f1cb5ab7cfea" data-file-name="components/order-data-processor.tsx">
          Order Data Processor
        </span></h1>
        <p className="text-muted-foreground" data-unique-id="42bdc6fd-0e97-416b-b569-31f161285bb7" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="d774f22d-52c8-4906-a77e-265b7cf11952" data-file-name="components/order-data-processor.tsx">
          Upload Excel (.xlsx) or CSV (.csv) files to clean and validate customer order data
        </span></p>
      </div>
      
      {/* File Upload Section */}
      <FileUploader onFileAccepted={processFile} isProcessing={isProcessing} />
      
      {/* Results Section */}
      {data.length > 0 && <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.4,
      delay: 0.2
    }} className="mt-8" data-unique-id="1f74ec1e-1cf8-4e6a-a055-6a996b3645ec" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
          <div className="flex justify-between items-center mb-6" data-unique-id="a5ffbf62-d9d3-424e-bbc6-f203ae1040f5" data-file-name="components/order-data-processor.tsx">
            <div data-unique-id="da488bba-946e-43f7-abd4-1411a276d444" data-file-name="components/order-data-processor.tsx">
              <h2 className="text-xl font-semibold flex items-center" data-unique-id="bd7668f1-9296-4152-b21b-13c6ee4d17f4" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                <FileSpreadsheet className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="c89a96df-21b7-4a8c-8fe6-c5b5ae527f56" data-file-name="components/order-data-processor.tsx">
                Processed Orders (</span>{data.length}<span className="editable-text" data-unique-id="98c07504-eca6-4f3e-a1c5-4fd542d711c6" data-file-name="components/order-data-processor.tsx">)
              </span></h2>
              
              <div className="mt-2 flex flex-wrap gap-3" data-unique-id="3e713822-149e-49e7-9b4d-99055642a9cb" data-file-name="components/order-data-processor.tsx">
                <div className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full" data-unique-id="daf1515b-c6f4-47c0-89f3-98717d11d327" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="8dd06082-3427-4b3e-bf25-3474f9a4f515" data-file-name="components/order-data-processor.tsx">
                  Total: </span>{processingStats.total}
                </div>
                <div className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full" data-unique-id="de51a950-fb88-4bbc-ba9b-3b599b98cd69" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="a44817d9-f0ae-4feb-b568-0fcdc0ab525a" data-file-name="components/order-data-processor.tsx">
                  Processed: </span>{processingStats.processed}
                </div>
                <div className="text-sm bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full" data-unique-id="34cbb299-a553-4f70-9235-899e2ed2fb64" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="ef9e2713-ec1f-4887-8473-90d12e37240b" data-file-name="components/order-data-processor.tsx">
                  Filtered: </span>{processingStats.filtered}
                </div>
                <div className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded-full" data-unique-id="293b3e98-6592-4d9b-9bc2-e0e966fd80b5" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="d6e28caa-978d-437a-9c92-5e27ec89ba30" data-file-name="components/order-data-processor.tsx">
                  Invalid: </span>{processingStats.invalid}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3" data-unique-id="88a74a8a-afd8-47c5-9966-1d12d3b5ceb2" data-file-name="components/order-data-processor.tsx">
              <button onClick={sendEmailsToCustomers} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="87ad83ce-fd72-4176-94d9-5345502f32d7" data-file-name="components/order-data-processor.tsx">
                <Mail className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="fad6882a-e475-4c04-89bc-88f8ae629db8" data-file-name="components/order-data-processor.tsx">
                Create Emails
              </span></button>
              
              <button onClick={exportProcessedData} className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="d3cd850c-90f2-4f45-bfab-f94baaba65d8" data-file-name="components/order-data-processor.tsx">
                <DownloadIcon className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="5e57eb53-9304-4730-8ee9-ab4b816f9521" data-file-name="components/order-data-processor.tsx">
                Export Data
              </span></button>
            </div>
          </div>

          {/* Search by Order Number */}
          <div className="mb-6 relative" data-unique-id="5e719b99-c34a-4c41-8e67-ba4d3c65581d" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
            <div className="relative" data-unique-id="e55fe7dd-f0b7-4813-8933-107cec0c4fef" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by order number..." className="pl-10 pr-4 py-2 w-full border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" data-unique-id="6d6c59d4-5e98-4e5a-9207-f9f458c76376" data-file-name="components/order-data-processor.tsx" />
              {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground" data-unique-id="030c043a-0a8a-4f87-91c2-bc8a0854f17d" data-file-name="components/order-data-processor.tsx">
                  <X className="h-4 w-4" />
                </button>}
            </div>
            {searchQuery && <div className="mt-2 text-sm text-muted-foreground" data-unique-id="32123c14-ac2e-47e0-84e1-84167c0f01d5" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="1524bf35-5991-4e3c-8a11-9eb95b13b0d6" data-file-name="components/order-data-processor.tsx">
                Found </span>{filteredData.length}<span className="editable-text" data-unique-id="9a611e5f-6e19-4d7f-884f-76e65d69ab57" data-file-name="components/order-data-processor.tsx"> orders matching "</span>{searchQuery}<span className="editable-text" data-unique-id="50876fef-9f43-4cf6-b967-02309dafa374" data-file-name="components/order-data-processor.tsx">"
              </span></div>}
          </div>
          
          {/* Display Table */}
          <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden" data-unique-id="72d4a4e4-84d1-4239-9cec-5c549293469b" data-file-name="components/order-data-processor.tsx">
            <DataTable data={filteredData} onRowClick={showCustomerDetails} actionColumn={row => <button onClick={() => showCustomerDetails(row)} className="p-2 rounded-full hover:bg-accent/20" title="View Customer Details" data-unique-id="a629c95b-633e-4b6d-9cad-5dff457c97cd" data-file-name="components/order-data-processor.tsx">
                    <Eye className="h-4 w-4 text-primary" />
                  </button>} renderCell={(key, value, row) => {
          // Make tracking numbers clickable
          if (key === 'trackingNumbers' && Array.isArray(value)) {
            return <div className="space-y-1" data-unique-id="b9c6b357-ed99-46bb-b700-cfd821fad2db" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                      {value.map((num, idx) => <a key={idx} href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${num}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:underline" data-unique-id="8ee5c1ad-ab47-462a-a744-1aab13cf2a94" data-file-name="components/order-data-processor.tsx">
                          <span className="mr-1" data-unique-id="0e5570b4-3feb-4142-a13e-f561510de524" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{num.length > 15 ? `${num.slice(0, 15)}...` : num}</span>
                          <ExternalLink className="h-3 w-3" data-unique-id="4bae2be0-8b6f-4b5a-a552-16e4804f330b" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                        </a>)}
                    </div>;
          }
          return null; // Use default rendering for other cells
        }} />
          </div>
          
          {/* Warning about filtered data */}
          {processingStats.filtered > 0 && <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md" data-unique-id="4bf7dd7b-c5c2-46eb-8ce5-e4c277325d13" data-file-name="components/order-data-processor.tsx">
              <div className="flex items-center" data-unique-id="3e773b92-5479-4549-8190-8d33c76cbf26" data-file-name="components/order-data-processor.tsx">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-yellow-800 font-medium" data-unique-id="691877b1-93f2-46b3-9b0f-fd77fc5c1c35" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="0465af2e-f90d-4fbd-8dc4-a009d3391c79" data-file-name="components/order-data-processor.tsx">Some entries were filtered out</span></p>
              </div>
              <p className="text-sm text-yellow-700 mt-1" data-unique-id="a58357ee-9120-404e-8cd2-f37b87553224" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                {processingStats.filtered}<span className="editable-text" data-unique-id="8f55d727-511c-4dbb-99ee-657122873339" data-file-name="components/order-data-processor.tsx"> entries were filtered out because they didn't meet the requirements
                (non-"New" order status, non-"Shipped" shipping status, or missing required fields).
              </span></p>
            </div>}
        </motion.div>}

      {/* Customer Detail Card Modal */}
      <AnimatePresence>
        {selectedOrder && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)} data-unique-id="87efbf0f-1a2a-4448-8537-fd6d93aabab0" data-file-name="components/order-data-processor.tsx">
            <motion.div initial={{
          scale: 0.95,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.95,
          opacity: 0
        }} transition={{
          type: "spring",
          damping: 25,
          stiffness: 300
        }} className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="2a65b8b2-d59b-4f12-b714-d703ab2521b9" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
              {/* Header */}
              <div className="bg-primary text-white p-6" data-unique-id="f6dc3e75-2bbf-4b12-8271-8c2ade4d795c" data-file-name="components/order-data-processor.tsx">
                <div className="flex justify-between items-start" data-unique-id="c4f135ad-4005-4035-bcf8-e384a4bc4177" data-file-name="components/order-data-processor.tsx">
                  <div data-unique-id="4e4cba08-92cf-4ad5-8985-b41b9b779ac3" data-file-name="components/order-data-processor.tsx">
                    <h2 className="text-xl font-semibold" data-unique-id="e4ff442c-64ca-4dd0-adaf-783ca9fb574f" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="7aec2a20-3da9-47cc-ad48-362428d42b0d" data-file-name="components/order-data-processor.tsx">Customer Order #</span>{selectedOrder.customerOrderNumber}</h2>
                    <p className="text-primary-foreground/80 mt-1" data-unique-id="11a01d58-933d-467b-b9fd-5b160f2e58a0" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="8f86cc41-9d02-4477-b3fb-2d850bf5bd75" data-file-name="components/order-data-processor.tsx">Shipped on </span>{new Date(selectedOrder.actualShipDate).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="text-white hover:bg-white/10 rounded-full p-2 transition-colors" data-unique-id="e8dab666-15e2-4df4-ae27-0e9edcdf2aaf" data-file-name="components/order-data-processor.tsx">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto" data-unique-id="4308d447-11da-4161-a02c-e5f0de30365c" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="9d36b5d9-bf59-492b-ada6-a353e5411337" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                  {/* Customer Information */}
                  <div className="space-y-4" data-unique-id="4e711ad8-b467-4744-81fa-49546c5d44b4" data-file-name="components/order-data-processor.tsx">
                    <div className="flex items-start" data-unique-id="91fe3ca0-29ea-4e47-8f17-7f39d3c57009" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="f52e2c4f-9239-48b9-bd95-92f9ba3a25da" data-file-name="components/order-data-processor.tsx">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="e38bee50-0d32-4329-aba5-9523b452112b" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="2ad10d4c-58ab-4122-a8b4-3011624d8d60" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="0f1705b8-cdca-4bb3-95bf-4d28b53c663e" data-file-name="components/order-data-processor.tsx">Customer Name</span></h3>
                        <p className="text-lg font-medium" data-unique-id="4a5abc3e-21d2-429c-8ec2-529992aa1df7" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start" data-unique-id="b60719f9-ebc0-44dc-8c4d-fca693cdeef7" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="7dfff60e-9354-4f68-b929-61ffcf1f0d16" data-file-name="components/order-data-processor.tsx">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1" data-unique-id="ecbf7e1c-3a32-4de1-8c35-5acee4507335" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="55740344-a23b-4139-860a-23c11e55e7f4" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="3742b895-4c48-4387-97f9-b08bc7c5b15c" data-file-name="components/order-data-processor.tsx">Email Address</span></h3>
                        {isEditingEmail ? <div className="flex items-center mt-1" data-unique-id="6f30a3f0-1fae-4dd1-84da-6baf354fb33a" data-file-name="components/order-data-processor.tsx">
                            <input type="email" value={tempEmail} onChange={e => setTempEmail(e.target.value)} className="flex-1 border border-border rounded-md px-2 py-1 text-sm" placeholder="Enter customer email" data-unique-id="86639a30-0209-4e5d-9b31-e326d84b2ed4" data-file-name="components/order-data-processor.tsx" />
                            <button onClick={saveCustomerEmail} className="ml-2 p-1 bg-primary text-white rounded-md" title="Save email" data-unique-id="d9f61161-3a5d-409e-a53e-49e3c54e6a94" data-file-name="components/order-data-processor.tsx">
                              <Save className="h-4 w-4" />
                            </button>
                            <button onClick={() => {
                        setIsEditingEmail(false);
                        setTempEmail(selectedOrder.shipToEmail || '');
                      }} className="ml-1 p-1 bg-secondary text-secondary-foreground rounded-md" title="Cancel" data-unique-id="dc508794-4990-465e-aed4-71b7567b5358" data-file-name="components/order-data-processor.tsx">
                              <X className="h-4 w-4" />
                            </button>
                          </div> : <div className="flex items-center" data-unique-id="458dc02f-8570-443e-8c6e-45b12056f67f" data-file-name="components/order-data-processor.tsx">
                            <p className="text-lg" data-unique-id="62837ed8-39f9-49c9-ad3b-e464be4551fe" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToEmail || 'No email provided'}</p>
                            <button onClick={() => setIsEditingEmail(true)} className="ml-2 p-1 hover:bg-accent/20 rounded-md" title="Edit email" data-unique-id="aab57159-89f8-481b-ba63-2dc6df43cfaf" data-file-name="components/order-data-processor.tsx">
                              <Edit className="h-4 w-4 text-primary" />
                            </button>
                          </div>}
                      </div>
                    </div>
                    
                    <div className="flex items-start" data-unique-id="872d84a9-573f-4569-bb1b-bb0bd114ad3d" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="46c3d97d-d0ca-402f-a569-2910898354cc" data-file-name="components/order-data-processor.tsx">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="93eb0444-65ad-42b9-9d76-52758016608c" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="2e21b045-65b8-4675-bfda-f5624226d905" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="aaf06b8a-a1c5-4c42-98b1-95123b877823" data-file-name="components/order-data-processor.tsx">Phone Number</span></h3>
                        <p className="text-lg" data-unique-id="0fd364f3-1c7e-4f1a-a761-9582ac726568" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToPhone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Information */}
                  <div className="space-y-4" data-unique-id="b0659833-9f87-4e89-9a94-c11e6c62436a" data-file-name="components/order-data-processor.tsx">
                    <div className="flex items-start" data-unique-id="d2636da5-afde-4058-893c-2bff705e1aa3" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="a0f6c8b3-0af6-48e2-9781-d55988cd9337" data-file-name="components/order-data-processor.tsx">
                        <Home className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="794f3d06-55bc-43cd-8e15-e3190274dfed" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="abb43a7e-8d66-4f12-85f0-fe37475dd742" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="2349ce1c-2b09-496b-b2a2-5d9135c08c25" data-file-name="components/order-data-processor.tsx">Shipping Address</span></h3>
                        <p className="text-lg" data-unique-id="9f994acc-60f3-455c-8258-b4058be9e20f" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToLine1}</p>
                        <p className="text-lg" data-unique-id="76248a76-8152-4727-ad9f-9e3e3397ef45" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToCity}<span className="editable-text" data-unique-id="75b66d37-2598-4a83-baf8-cd09f714403d" data-file-name="components/order-data-processor.tsx">, </span>{selectedOrder.shipToStateProvince} {selectedOrder.shipToPostalCode}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start" data-unique-id="94725d3c-581e-4a6d-b0dd-b35365daef8a" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="ae0bfd6e-bf05-48b7-8e2a-cad1ea697b6b" data-file-name="components/order-data-processor.tsx">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="5dbe72c0-7a7e-41a3-a959-a6757228c293" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="d8ce95ae-06ee-41c3-bd02-b57771bcc767" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="8274585f-0ea1-4154-ae3e-f8b18ad4952b" data-file-name="components/order-data-processor.tsx">Order Total</span></h3>
                        <p className="text-lg font-medium" data-unique-id="48ebfc3f-35ad-4d1e-a541-afd79225488f" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="3002fb58-0d51-4d13-b95b-6f286cc40314" data-file-name="components/order-data-processor.tsx">$</span>{selectedOrder.orderTotal.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start" data-unique-id="bd9c8262-5324-404b-a32b-a2275f95577e" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="8cc204bd-9fe3-46ba-a2bd-ad509f5249c1" data-file-name="components/order-data-processor.tsx">
                        <Info className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="b5c51f6e-7628-439c-b0ec-c87e479d7e2b" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="443d5ec7-f8b8-46a6-8b7e-2353d1f5408c" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="9eadbe99-8686-41c6-a434-435f9355bff8" data-file-name="components/order-data-processor.tsx">Order Source</span></h3>
                        <p className="text-lg" data-unique-id="59efb028-7154-470d-b53b-d4b3b831c70a" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.orderSource || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracking Information */}
                <div className="mt-6 pt-6 border-t border-border" data-unique-id="e54f424a-9319-44d5-bcb0-ef21f8131415" data-file-name="components/order-data-processor.tsx">
                  <h3 className="text-lg font-medium mb-4" data-unique-id="d8e2e976-2928-45e9-93f7-48f72fb3659e" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="2fc7f332-5771-4c6f-b787-9debfc79b3dc" data-file-name="components/order-data-processor.tsx">Tracking Information</span></h3>
                  <div className="space-y-3" data-unique-id="e21737ce-9503-4c90-b4be-819d67d11f39" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                    {selectedOrder.trackingNumbers.map((number, index) => <div key={index} className="flex items-center p-3 bg-accent/10 rounded-md" data-unique-id="5dd24904-b8af-4fda-840d-e64c950f24a1" data-file-name="components/order-data-processor.tsx">
                        <MapPin className="h-5 w-5 text-primary mr-3" data-unique-id="8ebbb4cf-634a-4be8-8b71-9c05c3264246" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                        <span className="font-medium mr-2" data-unique-id="87e22ca2-14f9-42ac-a5de-3c3190c6e584" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="6c6d12d5-ba6a-4772-88dd-05c4408d658c" data-file-name="components/order-data-processor.tsx">Tracking #</span>{index + 1}<span className="editable-text" data-unique-id="6d5a0485-e8d7-4d48-8062-5805f4f92370" data-file-name="components/order-data-processor.tsx">:</span></span>
                        <a href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${number}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center" data-unique-id="cf34a7c3-5738-49b7-8b7f-986a13acf0e0" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                          {number}
                          <ExternalLink className="ml-1 h-4 w-4" data-unique-id="b8329ffd-0023-446b-bef7-4838f4340f9f" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                        </a>
                      </div>)}
                    {selectedOrder.trackingNumbers.length === 0 && <p className="text-muted-foreground italic" data-unique-id="086e3e86-084e-4106-b0b0-6a8f83b0142a" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="9fe425d1-3632-44a7-a6e0-995741e1a64f" data-file-name="components/order-data-processor.tsx">No tracking numbers available</span></p>}
                  </div>
                </div>

                {/* Order Summary */}
                {selectedOrder.orderSummary && <div className="mt-6 pt-6 border-t border-border" data-unique-id="e0117749-34fb-4f0e-a236-3c6ec2ec128e" data-file-name="components/order-data-processor.tsx">
                    <h3 className="text-lg font-medium mb-2" data-unique-id="55f509d6-8b04-4e60-b4ca-83754c0b2da9" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="9483ab5d-fad1-46a3-8703-bf0171ac6263" data-file-name="components/order-data-processor.tsx">Order Summary</span></h3>
                    <div className="p-4 bg-accent/10 rounded-md" data-unique-id="63e3c30b-a3f4-4180-933d-c52ca754fa9d" data-file-name="components/order-data-processor.tsx">
                      <p data-unique-id="5efe15fc-8354-4bc0-b75d-1fd071d3cec0" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.orderSummary}</p>
                    </div>
                  </div>}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border bg-muted/30 flex justify-end" data-unique-id="eac7620d-c2af-41ba-84b5-13dc9509208c" data-file-name="components/order-data-processor.tsx">
                <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="08f2b1a2-fd8b-46c8-a6ff-a6af4a7acabd" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="7056bc9c-b0d7-4ecc-9ba3-6cd71aff465e" data-file-name="components/order-data-processor.tsx">
                  Close
                </span></button>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
    </motion.div>;
}