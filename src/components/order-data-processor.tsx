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
  }} className="max-w-7xl mx-auto" data-unique-id="ade3c12c-1040-41c8-92d1-3556e2090cd1" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
      <Toaster position="top-center" toastOptions={{
      duration: 3000
    }} />
      
      <div className="mb-8" data-unique-id="0f18d313-35af-464c-9d17-5fc42a874d66" data-file-name="components/order-data-processor.tsx">
        <h1 className="text-3xl font-bold text-primary mb-2" data-unique-id="cb8b72ea-bd91-48f2-b5ce-5eb82ba2977c" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="5674e9fe-f152-4b63-92bb-0b1b1bb11f7a" data-file-name="components/order-data-processor.tsx">
          Order Data Processor
        </span></h1>
        <p className="text-muted-foreground" data-unique-id="abf0328d-3272-413b-9122-ed8b279a407c" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="070f951b-8b83-4b33-b17b-14f707e09313" data-file-name="components/order-data-processor.tsx">
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
    }} className="mt-8" data-unique-id="e86eb45c-8922-49b1-92ef-5b73aa805f43" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
          <div className="flex justify-between items-center mb-6" data-unique-id="1b1c5554-ecd6-46a6-9165-0868826d68bd" data-file-name="components/order-data-processor.tsx">
            <div data-unique-id="907912b7-44a5-463f-b99c-34c9c35ff23b" data-file-name="components/order-data-processor.tsx">
              <h2 className="text-xl font-semibold flex items-center" data-unique-id="54f00ad1-73f3-4312-8fd5-acbed91c7ed4" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                <FileSpreadsheet className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="f64cbb81-53e5-4e27-8163-2f754569c979" data-file-name="components/order-data-processor.tsx">
                Processed Orders (</span>{data.length}<span className="editable-text" data-unique-id="b3b77b86-65de-442b-a64d-83a4503d1c05" data-file-name="components/order-data-processor.tsx">)
              </span></h2>
              
              <div className="mt-2 flex flex-wrap gap-3" data-unique-id="bb028bc7-d352-4e27-b231-a3b9f0043cf5" data-file-name="components/order-data-processor.tsx">
                <div className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full" data-unique-id="d731c3d5-b77e-49f4-ae0e-a2ccb0909073" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="af9c8e15-5f85-4efc-ba03-4e867d6049d4" data-file-name="components/order-data-processor.tsx">
                  Total: </span>{processingStats.total}
                </div>
                <div className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full" data-unique-id="99c08db5-6aae-4fd4-8b7e-1235903bf9f5" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="37de0be0-6d62-4148-85ad-db74bb03de1d" data-file-name="components/order-data-processor.tsx">
                  Processed: </span>{processingStats.processed}
                </div>
                <div className="text-sm bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full" data-unique-id="8c2b489d-c09a-4df3-85aa-4a6f8c21fa27" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="641b7ab0-3975-4047-b23a-0aee7a2855fb" data-file-name="components/order-data-processor.tsx">
                  Filtered: </span>{processingStats.filtered}
                </div>
                <div className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded-full" data-unique-id="80e89d4b-e5b6-43a0-b8ab-9323846f539c" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="e49ee552-5789-4e00-9e5b-2dae8735e71b" data-file-name="components/order-data-processor.tsx">
                  Invalid: </span>{processingStats.invalid}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3" data-unique-id="56617456-dbcb-41b0-8dc5-dd0c8d72749f" data-file-name="components/order-data-processor.tsx">
              <button onClick={sendEmailsToCustomers} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="5558ab8a-9648-4417-98d2-d14976ade1b2" data-file-name="components/order-data-processor.tsx">
                <Mail className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="e5803614-078f-45c6-9230-4e9c7aa47a82" data-file-name="components/order-data-processor.tsx">
                Create Emails
              </span></button>
              
              <button onClick={exportProcessedData} className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="a3e0aafc-bea5-482e-bbdb-e8ebb0359388" data-file-name="components/order-data-processor.tsx">
                <DownloadIcon className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="cea75cef-3978-4aab-93b8-6327958bfc38" data-file-name="components/order-data-processor.tsx">
                Export Data
              </span></button>
            </div>
          </div>
          
          {/* Display Table */}
          <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden" data-unique-id="eb30e078-d71e-4040-b2e5-1af7d6118df5" data-file-name="components/order-data-processor.tsx">
            <DataTable data={data} />
          </div>
          
          {/* Warning about filtered data */}
          {processingStats.filtered > 0 && <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md" data-unique-id="20ce8cbb-8e56-4da9-8107-80f7654868cc" data-file-name="components/order-data-processor.tsx">
              <div className="flex items-center" data-unique-id="71dfe684-4aed-4e8e-a6c5-35aeebaa72e4" data-file-name="components/order-data-processor.tsx">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-yellow-800 font-medium" data-unique-id="27f701ce-fb04-467d-a3d0-9ee50958b10b" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="756005ce-98db-4468-83c3-01fe74140c24" data-file-name="components/order-data-processor.tsx">Some entries were filtered out</span></p>
              </div>
              <p className="text-sm text-yellow-700 mt-1" data-unique-id="40759291-6a1c-450d-8c60-954d1ad49f08" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                {processingStats.filtered}<span className="editable-text" data-unique-id="8da85679-8c64-4c47-b6a6-d10a92f1458d" data-file-name="components/order-data-processor.tsx"> entries were filtered out because they didn't meet the requirements
                (non-"New" order status, non-"Shipped" shipping status, or missing required fields).
              </span></p>
            </div>}
        </motion.div>}
    </motion.div>;
}