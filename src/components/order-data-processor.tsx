'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileUp, FileSpreadsheet, AlertCircle, DownloadIcon, Mail } from 'lucide-react';
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
  }} className="max-w-7xl mx-auto" data-unique-id="930d82bf-2137-485d-a845-c7d00d3f3bbd" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
      <Toaster position="top-center" toastOptions={{
      duration: 3000
    }} />
      
      <div className="mb-8" data-unique-id="284fba25-a1d7-4748-8874-f869bd6177d8" data-file-name="components/order-data-processor.tsx">
        <h1 className="text-3xl font-bold text-primary mb-2" data-unique-id="d3df97aa-328e-4189-ad54-be098af4f006" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="0d034f6d-3281-4e3a-b543-bf23c7eb733a" data-file-name="components/order-data-processor.tsx">
          Order Data Processor
        </span></h1>
        <p className="text-muted-foreground" data-unique-id="41778cff-74fc-4d6b-bd7c-58728b99574e" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="7446c2e0-6f9f-4651-aecf-0ea3f363244b" data-file-name="components/order-data-processor.tsx">
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
    }} className="mt-8" data-unique-id="b068c9dd-240b-4fdd-8ddc-fdd8f32d0234" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
          <div className="flex justify-between items-center mb-6" data-unique-id="f2237bd2-f19a-4d44-a9d7-d805ac394ae0" data-file-name="components/order-data-processor.tsx">
            <div data-unique-id="c09956a2-18f5-42de-bef1-0ef249b535f0" data-file-name="components/order-data-processor.tsx">
              <h2 className="text-xl font-semibold flex items-center" data-unique-id="50169358-6cb8-4116-b60b-d5aed08f6b33" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                <FileSpreadsheet className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="826c6fbb-32f2-408a-abbc-e02c234b709f" data-file-name="components/order-data-processor.tsx">
                Processed Orders (</span>{data.length}<span className="editable-text" data-unique-id="c1e8b96a-9f87-43b6-84f4-78dc52fe2061" data-file-name="components/order-data-processor.tsx">)
              </span></h2>
              
              <div className="mt-2 flex flex-wrap gap-3" data-unique-id="82a3aaed-2130-405f-9bbe-8c4024813efa" data-file-name="components/order-data-processor.tsx">
                <div className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full" data-unique-id="183b9c5c-f629-4df7-a967-f2629352d19a" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="7c198765-abd4-4f51-ae8e-b5e5e8108413" data-file-name="components/order-data-processor.tsx">
                  Total: </span>{processingStats.total}
                </div>
                <div className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full" data-unique-id="2281b293-2328-4a9c-9f4d-99a6c0ed1789" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="8e444ff6-db3f-4b4e-9f34-2ad39f2c3814" data-file-name="components/order-data-processor.tsx">
                  Processed: </span>{processingStats.processed}
                </div>
                <div className="text-sm bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full" data-unique-id="f1c28e99-698b-4c34-8504-e5dab993e7f3" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="08614e85-e458-489c-a8b9-596366154c69" data-file-name="components/order-data-processor.tsx">
                  Filtered: </span>{processingStats.filtered}
                </div>
                <div className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded-full" data-unique-id="9feba5b7-4185-4ca6-be28-d5ceab6558bd" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="268ee405-9762-4bd4-9b40-25e01f81ccbf" data-file-name="components/order-data-processor.tsx">
                  Invalid: </span>{processingStats.invalid}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3" data-unique-id="66688c67-2d67-4587-978c-e6496ccc1252" data-file-name="components/order-data-processor.tsx">
              <button onClick={sendEmailsToCustomers} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="d6dfdfc7-a0ed-4777-8a38-b007b92a133a" data-file-name="components/order-data-processor.tsx">
                <Mail className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="3d76cb55-5303-4d8f-97a2-fe51ad132531" data-file-name="components/order-data-processor.tsx">
                Create Emails
              </span></button>
              
              <button onClick={exportProcessedData} className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="dc83895e-3aa9-49c2-92ee-28fac4619b38" data-file-name="components/order-data-processor.tsx">
                <DownloadIcon className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="bd9360fe-99c8-4e85-b705-fa7ebe3eb5f7" data-file-name="components/order-data-processor.tsx">
                Export Data
              </span></button>
            </div>
          </div>
          
          {/* Display Table */}
          <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden" data-unique-id="a427837a-6392-4dd7-813b-00ddc4c384af" data-file-name="components/order-data-processor.tsx">
            <DataTable data={data} />
          </div>
          
          {/* Warning about filtered data */}
          {processingStats.filtered > 0 && <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md" data-unique-id="e2a1a0d6-1280-4618-847c-85ec58486923" data-file-name="components/order-data-processor.tsx">
              <div className="flex items-center" data-unique-id="356effc9-845f-42c0-bc29-60e52e3c3bc7" data-file-name="components/order-data-processor.tsx">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-yellow-800 font-medium" data-unique-id="6166e348-c502-4375-9bb8-0506f480804f" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="3e642a5b-4740-4d1d-8665-8de23e7053f6" data-file-name="components/order-data-processor.tsx">Some entries were filtered out</span></p>
              </div>
              <p className="text-sm text-yellow-700 mt-1" data-unique-id="08b22ddd-d32b-44d9-8728-2bba05339715" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                {processingStats.filtered}<span className="editable-text" data-unique-id="7881ab07-30c9-496b-9c90-ab2f104cfde5" data-file-name="components/order-data-processor.tsx"> entries were filtered out because they didn't meet the requirements
                (non-"New" order status, non-"Shipped" shipping status, or missing required fields).
              </span></p>
            </div>}
        </motion.div>}
    </motion.div>;
}