'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileUp, FileSpreadsheet, AlertCircle, DownloadIcon, Mail, FileCheck, FileQuestion, Loader2, AlertOctagon } from 'lucide-react';
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

          // Check if workbook has any sheets
          if (workbook.SheetNames.length === 0) {
            toast.error('The file does not contain any worksheets.');
            setIsProcessing(false);
            return;
          }

          // Check available sheet names and try to find one that matches expected format
          const sheetName = workbook.SheetNames.find(name => name.toLowerCase().includes('export') || name.toLowerCase().includes('data') || name.toLowerCase().includes('order')) || workbook.SheetNames[0];
          const ws = workbook.Sheets[sheetName];

          // Convert to JSON
          const rawJsonData = XLSX.utils.sheet_to_json<RawOrderData>(ws);

          // Validate that we have data
          if (!rawJsonData || rawJsonData.length === 0) {
            toast.error('No data found in the file. Please check the format.');
            setIsProcessing(false);
            return;
          }

          // Check for required columns
          const firstRow = rawJsonData[0];
          const requiredColumns = ['Customer Order Number', 'customerOrderNumber', 'Ship To Name', 'shipToName'];

          // Check if at least one of the required column pairs exists
          const hasRequiredColumns = requiredColumns.some(col => col in firstRow);
          if (!hasRequiredColumns) {
            toast.error('File is missing required columns. Please check the format.');
            setIsProcessing(false);
            return;
          }
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
            toast.error('No valid orders found after filtering. Check if orders have "New" status and "Shipped" shipping status.');
          }
        } catch (error) {
          console.error('Error parsing file:', error);
          toast.error('Failed to parse file. Please check the format and ensure it matches the expected structure.');
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
  }} className="max-w-7xl mx-auto" data-unique-id="fbaf8134-eee0-41a6-ad92-3ce1f4739d81" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
      <Toaster position="top-center" toastOptions={{
      duration: 3000
    }} />
      
      <div className="mb-8" data-unique-id="123b7a52-71d7-42ff-bde5-ad120304fc88" data-file-name="components/order-data-processor.tsx">
        <h1 className="text-3xl font-bold text-primary mb-2" data-unique-id="98b6dd36-0f82-4018-88e8-0b87780298b5" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="f1923696-9ce3-4993-8987-32509e35e4ba" data-file-name="components/order-data-processor.tsx">
          Order Data Processor
        </span></h1>
        <p className="text-muted-foreground" data-unique-id="46213db9-2c16-42e0-a9d2-89689ec65059" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="25df9b62-95b7-4966-af79-d69d8c329880" data-file-name="components/order-data-processor.tsx">
          Upload Excel (.xlsx) or CSV (.csv) files to clean and validate customer order data. This tool processes files
          with the same structure as "orderheader_rob-tracking-numbers_20250522_1513.xlsx".
        </span></p>
        
        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-md p-4" data-unique-id="d64191e6-dfba-40dc-a403-33097496cdbd" data-file-name="components/order-data-processor.tsx">
          <h2 className="text-sm font-medium text-blue-800 flex items-center" data-unique-id="37a8bfa6-4c0e-4e0c-8f2a-27383c5cb13c" data-file-name="components/order-data-processor.tsx">
            <FileQuestion className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="ef79da63-849d-4a30-870d-8ceebeeb5964" data-file-name="components/order-data-processor.tsx">
            Expected File Format
          </span></h2>
          <p className="mt-1 text-xs text-blue-700" data-unique-id="6807b94e-5503-4cd1-b047-fccce5cee92d" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="c5463b73-48bb-40bb-8b6b-c296a46d3731" data-file-name="components/order-data-processor.tsx">
            Your file should contain columns like: Customer Order Number, Ship To Name, Ship To Phone, 
            Ship To Line1, Ship To City, Ship To State Province, Ship To Postal Code, Order Total, 
            Actual Ship Date, Tracking Link(s), Order Source, and Order Summary.
          </span></p>
        </div>
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
    }} className="mt-8" data-unique-id="a811a683-f384-4671-b693-67daffc8d3e7" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
          <div className="flex justify-between items-center mb-6" data-unique-id="a9a82b00-6c40-4a74-b460-bed110060032" data-file-name="components/order-data-processor.tsx">
            <div data-unique-id="bcdc3110-33b8-4401-b059-5215666fa452" data-file-name="components/order-data-processor.tsx">
              <h2 className="text-xl font-semibold flex items-center" data-unique-id="d74e6bb0-451a-4e79-8816-b2cbc908f4cb" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                <FileSpreadsheet className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="35d93cf6-3453-412f-9cc9-df566474407a" data-file-name="components/order-data-processor.tsx">
                Processed Orders (</span>{data.length}<span className="editable-text" data-unique-id="78a88661-f0d9-4df2-9417-182b7337e362" data-file-name="components/order-data-processor.tsx">)
              </span></h2>
              
              <div className="mt-2 flex flex-wrap gap-3" data-unique-id="e09a4296-0dd9-424e-8594-85bbaf91f70c" data-file-name="components/order-data-processor.tsx">
                <div className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full" data-unique-id="3980b3b3-99c6-4389-9534-48aa533b764b" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="e786c4f4-229e-4318-9031-4974fb2e6c8a" data-file-name="components/order-data-processor.tsx">
                  Total: </span>{processingStats.total}
                </div>
                <div className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full" data-unique-id="b70e37e5-2347-4292-b6f9-d3989beb84b8" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="a9293b02-2df2-4622-a418-64241ebd1a9c" data-file-name="components/order-data-processor.tsx">
                  Processed: </span>{processingStats.processed}
                </div>
                <div className="text-sm bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full" data-unique-id="2aa373b6-b34a-46b1-962b-eb9d08e4f50a" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="3f3218f9-c4d8-4d7b-9884-4353480947aa" data-file-name="components/order-data-processor.tsx">
                  Filtered: </span>{processingStats.filtered}
                </div>
                <div className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded-full" data-unique-id="812a2382-20d3-4834-865b-c89e8e5dea1a" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="9e69ce1a-53cf-4a4b-a3a5-5069050b9311" data-file-name="components/order-data-processor.tsx">
                  Invalid: </span>{processingStats.invalid}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3" data-unique-id="ba09fcfd-6507-4c44-8ff6-fc2038e77e92" data-file-name="components/order-data-processor.tsx">
              <button onClick={sendEmailsToCustomers} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="579d603e-ae03-4618-9d9a-6baba3cb48c4" data-file-name="components/order-data-processor.tsx">
                <Mail className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="0fb2366d-e03e-44d2-bca5-3d5d295f4988" data-file-name="components/order-data-processor.tsx">
                Create Emails
              </span></button>
              
              <button onClick={exportProcessedData} className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="ad1222de-635a-4ed5-a6f3-bc2a31c4afb3" data-file-name="components/order-data-processor.tsx">
                <DownloadIcon className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="50914158-efdd-48c9-a0b4-6611d3516fa4" data-file-name="components/order-data-processor.tsx">
                Export Data
              </span></button>
            </div>
          </div>
          
          {/* Display Table */}
          <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden" data-unique-id="c98ce00d-2154-415f-b728-2f12077fb298" data-file-name="components/order-data-processor.tsx">
            <DataTable data={data} />
          </div>
          
          {/* Warning about filtered data */}
          {/* Processing Statistics */}
          <div className="mt-6 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4" data-unique-id="30b4ef14-90c6-496a-8f73-b100222867ce" data-file-name="components/order-data-processor.tsx">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100" data-unique-id="a153b81a-a7c4-4b03-bef8-063f9416573b" data-file-name="components/order-data-processor.tsx">
              <div className="font-medium text-sm text-blue-800 mb-1" data-unique-id="97a5dc25-b788-4c9d-987b-938918086ac0" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="4e75b24e-431c-417e-8f48-bd360e2ca1c4" data-file-name="components/order-data-processor.tsx">Total Records</span></div>
              <div className="text-2xl font-bold text-blue-900" data-unique-id="59237145-4660-4fb8-8c38-33266e283e67" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{processingStats.total}</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-100" data-unique-id="66bdd683-50b4-473a-b65e-bd1b35b24817" data-file-name="components/order-data-processor.tsx">
              <div className="font-medium text-sm text-green-800 mb-1" data-unique-id="99c2e29f-1f49-439b-9607-5ca772a7a0a3" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="0eff1c19-c2e2-44f4-9260-cad1da7ddfe7" data-file-name="components/order-data-processor.tsx">Processed</span></div>
              <div className="text-2xl font-bold text-green-900" data-unique-id="fd891638-ca70-4a7d-a4e7-c37ee4d39689" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{processingStats.processed}</div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100" data-unique-id="ba975e92-b486-4ac1-ab63-bb53903bf7c3" data-file-name="components/order-data-processor.tsx">
              <div className="font-medium text-sm text-yellow-800 mb-1" data-unique-id="c92b2e31-6c66-4c9e-8b7c-2f13e9853f6b" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="aeb709bd-e80d-402a-af97-b2b2f6d32900" data-file-name="components/order-data-processor.tsx">Filtered</span></div>
              <div className="text-2xl font-bold text-yellow-900" data-unique-id="5ddaaa5f-aee5-4d70-a94e-5c60ebe76d29" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{processingStats.filtered}</div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg border border-red-100" data-unique-id="660efa19-97f4-40f2-b34d-ef3af4d023e9" data-file-name="components/order-data-processor.tsx">
              <div className="font-medium text-sm text-red-800 mb-1" data-unique-id="e8d1acd4-5504-482e-bd79-a11b3462d2b0" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="497677ad-2f8c-4beb-8a52-3f65c018739b" data-file-name="components/order-data-processor.tsx">Invalid</span></div>
              <div className="text-2xl font-bold text-red-900" data-unique-id="a63b4b2f-5c4e-4457-844d-95f9f8f5a7cd" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{processingStats.invalid}</div>
            </div>
          </div>

          {processingStats.filtered > 0 && <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md" data-unique-id="ca9e2c91-f2bb-40ad-94e6-4eed7268f9ee" data-file-name="components/order-data-processor.tsx">
              <div className="flex items-center" data-unique-id="e93a8bcb-25e5-4edc-8f8e-f628c7664b8a" data-file-name="components/order-data-processor.tsx">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-yellow-800 font-medium" data-unique-id="7a9e126e-5497-401f-ab0e-759113c8ae61" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="08080ab6-d134-4dbd-bc3b-d3f425f9aff1" data-file-name="components/order-data-processor.tsx">Some entries were filtered out</span></p>
              </div>
              <p className="text-sm text-yellow-700 mt-1" data-unique-id="f229d898-fab7-4030-8b82-396776b08d5d" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                {processingStats.filtered}<span className="editable-text" data-unique-id="e5ce3f47-9241-4d5e-8510-9dbc910e9c17" data-file-name="components/order-data-processor.tsx"> entries were filtered out because they didn't meet the requirements:
              </span></p>
              <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside space-y-1" data-unique-id="ad1b413f-ffdb-4d52-aaaa-bd7e5244adc9" data-file-name="components/order-data-processor.tsx">
                <li data-unique-id="80163f34-3d51-43c4-a315-3b16f22160ab" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="a324bf2e-dcb4-459d-a0f4-48614ad8273f" data-file-name="components/order-data-processor.tsx">Order Status must be "New"</span></li>
                <li data-unique-id="e0f42ede-0f1e-491f-af08-46728953af32" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="1e725ff1-24a9-4613-be47-933913f375c9" data-file-name="components/order-data-processor.tsx">Shipping Status must be "Shipped"</span></li>
                <li data-unique-id="73cb3f95-b006-42bc-947c-08313789f541" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="372dda29-b2a6-4dea-a106-54eaed9ba699" data-file-name="components/order-data-processor.tsx">Required fields (Customer Order Number, Ship To Name, Ship To Line1, Ship To State/Province) must be present</span></li>
              </ul>
            </div>}
            
          {processingStats.invalid > 0 && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md" data-unique-id="db74b6e8-3d67-4322-8f7b-2ac0b472fc2e" data-file-name="components/order-data-processor.tsx">
              <div className="flex items-center" data-unique-id="2fb75742-52e4-4557-bcea-3d46129da368" data-file-name="components/order-data-processor.tsx">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-800 font-medium" data-unique-id="2337e9b0-2be4-4caa-9b03-333eb96bba89" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="0a5662cf-f5ca-4a96-8843-c0343a566ee4" data-file-name="components/order-data-processor.tsx">Invalid records skipped</span></p>
              </div>
              <p className="text-sm text-red-700 mt-1" data-unique-id="205d35c2-e16e-4ef9-8d0e-0531060d6c56" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                {processingStats.invalid}<span className="editable-text" data-unique-id="192d07ef-c40f-45d1-9111-a49043ca4008" data-file-name="components/order-data-processor.tsx"> records were skipped due to missing required fields:
              </span></p>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1" data-unique-id="8add0ba4-4727-404d-ba1d-2c1dc6c23e28" data-file-name="components/order-data-processor.tsx">
                <li data-unique-id="422203bd-65f2-44d9-a0ff-90f6d77ed45d" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="ade2d556-3305-49e9-9b6d-a6e8ce7e4f33" data-file-name="components/order-data-processor.tsx">Customer Order Number</span></li>
                <li data-unique-id="aa04faf5-138e-4b72-b198-2955ea55c0c1" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="bd4bdda9-f26a-4ca0-94cc-36538c085bb9" data-file-name="components/order-data-processor.tsx">Ship To Name</span></li>
                <li data-unique-id="41742461-5911-48dc-8b4a-ceef5864c230" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="b1145064-434c-4c3d-87d1-fb5b98d02599" data-file-name="components/order-data-processor.tsx">Ship To Line1</span></li>
                <li data-unique-id="4a02d70d-2d15-4066-8802-9f94581bbdbf" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="37991093-0d73-48a3-9eba-4acc5479c692" data-file-name="components/order-data-processor.tsx">Ship To State Province</span></li>
              </ul>
            </div>}
        </motion.div>}
    </motion.div>;
}