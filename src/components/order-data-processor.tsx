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
  }} className="max-w-7xl mx-auto" data-unique-id="eb568258-b9b9-4a0d-afe9-1c944c315ff0" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
      <Toaster position="top-center" toastOptions={{
      duration: 3000
    }} />
      
      <div className="mb-8" data-unique-id="38ab42db-6ab7-40cf-a822-d31d0b30de73" data-file-name="components/order-data-processor.tsx">
        <h1 className="text-3xl font-bold text-primary mb-2" data-unique-id="bb314baa-8f54-4881-acfb-668cf5d07d7f" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="1bf1ba0a-41aa-483b-8833-e769e46260e8" data-file-name="components/order-data-processor.tsx">
          Order Data Processor
        </span></h1>
        <p className="text-muted-foreground" data-unique-id="48778c0d-3aae-43fa-9d06-38f2d9649025" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="1035aeff-b31c-4ff2-a76b-85c3c3bac9a5" data-file-name="components/order-data-processor.tsx">
          Upload Excel (.xlsx) or CSV (.csv) files to clean and validate customer order data. This tool processes files
          with the same structure as "orderheader_rob-tracking-numbers_20250522_1513.xlsx".
        </span></p>
        
        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-md p-4" data-unique-id="214e0b24-424e-40c2-92b9-bd3cc7f99b68" data-file-name="components/order-data-processor.tsx">
          <h2 className="text-sm font-medium text-blue-800 flex items-center" data-unique-id="152b7b88-c9fc-4be3-941e-2be52f87c327" data-file-name="components/order-data-processor.tsx">
            <FileQuestion className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="11c3d990-0aed-4a01-9cf3-8c0e2313237d" data-file-name="components/order-data-processor.tsx">
            Expected File Format
          </span></h2>
          <p className="mt-1 text-xs text-blue-700" data-unique-id="0920f7bd-f531-4916-9cec-7aba66d9c117" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="992e9659-2712-4db8-8ee8-ab5a2c15ff0f" data-file-name="components/order-data-processor.tsx">
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
    }} className="mt-8" data-unique-id="cbf22f94-de08-447e-a176-8694a8f992cc" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
          <div className="flex justify-between items-center mb-6" data-unique-id="9759d05e-8514-4700-ac97-7732d18434e5" data-file-name="components/order-data-processor.tsx">
            <div data-unique-id="18a5d1fa-5c58-4cdc-8cd9-d9b40ed658d5" data-file-name="components/order-data-processor.tsx">
              <h2 className="text-xl font-semibold flex items-center" data-unique-id="59ef7597-9310-46bb-99bf-cdb1318dddeb" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                <FileSpreadsheet className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="c20e3c74-62b2-453f-b507-67527ada3fe5" data-file-name="components/order-data-processor.tsx">
                Processed Orders (</span>{data.length}<span className="editable-text" data-unique-id="015588cf-9788-4329-b7c0-a3ee928ffba4" data-file-name="components/order-data-processor.tsx">)
              </span></h2>
              
              <div className="mt-2 flex flex-wrap gap-3" data-unique-id="29adebd5-c197-4614-b3c8-c93b9d01e918" data-file-name="components/order-data-processor.tsx">
                <div className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full" data-unique-id="19276120-4ce8-48ce-a0d9-f399a785d74d" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="2dc8b427-c3d8-4012-9895-c632c2551d5c" data-file-name="components/order-data-processor.tsx">
                  Total: </span>{processingStats.total}
                </div>
                <div className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full" data-unique-id="a18cf16d-1cc9-4c5b-9f53-9177b70e10bf" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="5f6c222e-3c0d-4f93-81e9-7dec5eba9941" data-file-name="components/order-data-processor.tsx">
                  Processed: </span>{processingStats.processed}
                </div>
                <div className="text-sm bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full" data-unique-id="d3e48554-e0be-41ba-a369-94b2eaf898f6" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="9fdbaa7f-c448-46aa-ac3f-f5545403ad04" data-file-name="components/order-data-processor.tsx">
                  Filtered: </span>{processingStats.filtered}
                </div>
                <div className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded-full" data-unique-id="732f9b01-675b-41db-a654-afbb9d9c900b" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="1e633557-28f7-412a-8c5f-4401e0e13a99" data-file-name="components/order-data-processor.tsx">
                  Invalid: </span>{processingStats.invalid}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3" data-unique-id="770a3e8f-1e41-4623-a1b3-8e338678249a" data-file-name="components/order-data-processor.tsx">
              <button onClick={sendEmailsToCustomers} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="81e2ddea-8635-4123-a4c4-275c4b2330bf" data-file-name="components/order-data-processor.tsx">
                <Mail className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="99c91f45-d6be-4cca-9f46-7c0c672a23be" data-file-name="components/order-data-processor.tsx">
                Create Emails
              </span></button>
              
              <button onClick={exportProcessedData} className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="d63d32c7-a735-44ae-92c6-3477a6b65a30" data-file-name="components/order-data-processor.tsx">
                <DownloadIcon className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="303b3ed1-41c7-4dbc-be13-0c611d8c57a1" data-file-name="components/order-data-processor.tsx">
                Export Data
              </span></button>
            </div>
          </div>
          
          {/* Display Table */}
          <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden" data-unique-id="70eb47d3-657b-4ce2-b93e-c427ba79bb9d" data-file-name="components/order-data-processor.tsx">
            <DataTable data={data} />
          </div>
          
          {/* Warning about filtered data */}
          {/* Processing Statistics */}
          <div className="mt-6 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4" data-unique-id="d7a648a2-fcf7-48de-9cde-98a5ef79b355" data-file-name="components/order-data-processor.tsx">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100" data-unique-id="b7cfda57-0ab2-4b60-a2b8-0facbd7e8ad4" data-file-name="components/order-data-processor.tsx">
              <div className="font-medium text-sm text-blue-800 mb-1" data-unique-id="308d7809-291b-4cf6-aec6-dcd0a93dfac5" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="fe46f025-a81d-45d4-98e5-0b5acd61be76" data-file-name="components/order-data-processor.tsx">Total Records</span></div>
              <div className="text-2xl font-bold text-blue-900" data-unique-id="aeee0fa1-8564-47cf-a816-0bc8a7697155" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{processingStats.total}</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-100" data-unique-id="92726e52-6676-425e-ad6d-9de8a98fe2bd" data-file-name="components/order-data-processor.tsx">
              <div className="font-medium text-sm text-green-800 mb-1" data-unique-id="706a1321-4f11-43cc-b5c8-b795a5e37aa4" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="aee34bc6-c757-4a3e-b746-8b1292e1b5ae" data-file-name="components/order-data-processor.tsx">Processed</span></div>
              <div className="text-2xl font-bold text-green-900" data-unique-id="f710d317-f8ac-406c-ba2d-74aca5476981" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{processingStats.processed}</div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100" data-unique-id="1417c869-73b8-42ca-b40a-dbc800130fdf" data-file-name="components/order-data-processor.tsx">
              <div className="font-medium text-sm text-yellow-800 mb-1" data-unique-id="c5dc1c88-beee-43f1-a830-3debe0738a35" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="5246a838-74a5-4e95-959c-5080602a6fdc" data-file-name="components/order-data-processor.tsx">Filtered</span></div>
              <div className="text-2xl font-bold text-yellow-900" data-unique-id="af36e7aa-36b0-4138-bc4c-ec96060c86ed" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{processingStats.filtered}</div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg border border-red-100" data-unique-id="cfb63d7a-941c-4fbd-a09b-297b603cc4be" data-file-name="components/order-data-processor.tsx">
              <div className="font-medium text-sm text-red-800 mb-1" data-unique-id="54ee5a8b-e8c3-4d8f-8be0-8237023e5e18" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="ff85101c-87f3-447d-9a09-8f706c38e944" data-file-name="components/order-data-processor.tsx">Invalid</span></div>
              <div className="text-2xl font-bold text-red-900" data-unique-id="578e1097-d47e-4f20-bd99-250bfaedc0a8" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{processingStats.invalid}</div>
            </div>
          </div>

          {processingStats.filtered > 0 && <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md" data-unique-id="ac609e78-7ce7-456a-a44f-e114e2f1f911" data-file-name="components/order-data-processor.tsx">
              <div className="flex items-center" data-unique-id="80d822d0-6918-4b4c-a007-0f2b3adbd7e6" data-file-name="components/order-data-processor.tsx">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-yellow-800 font-medium" data-unique-id="3416dcf2-e0cb-4d90-9613-9169e2867edb" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="8c2db4a2-4930-44b9-9107-3d9558363ea1" data-file-name="components/order-data-processor.tsx">Some entries were filtered out</span></p>
              </div>
              <p className="text-sm text-yellow-700 mt-1" data-unique-id="9eebd9c1-62ca-4dba-a628-cd2e770e8fa0" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                {processingStats.filtered}<span className="editable-text" data-unique-id="e8e49289-4c11-4bb9-8fb6-1782f4156430" data-file-name="components/order-data-processor.tsx"> entries were filtered out because they didn't meet the requirements:
              </span></p>
              <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside space-y-1" data-unique-id="02d176c6-780e-4cdb-a0d5-6b97fc96cbc6" data-file-name="components/order-data-processor.tsx">
                <li data-unique-id="b86221e0-8b50-4804-b514-9644666bd64e" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="8474cc55-09e7-4231-ad2d-0f2dbd817472" data-file-name="components/order-data-processor.tsx">Order Status must be "New"</span></li>
                <li data-unique-id="c3571fda-16ff-467e-9e57-3cda3de451ab" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="f8eaf50b-a717-403f-8674-80db624be66b" data-file-name="components/order-data-processor.tsx">Shipping Status must be "Shipped"</span></li>
                <li data-unique-id="e4512429-e026-4d8f-afc6-00fa5eb483c7" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="90552156-5f56-47df-8440-deea63f469f0" data-file-name="components/order-data-processor.tsx">Required fields (Customer Order Number, Ship To Name, Ship To Line1, Ship To State/Province) must be present</span></li>
              </ul>
            </div>}
            
          {processingStats.invalid > 0 && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md" data-unique-id="17fae90d-45fd-4b5f-b56a-c620de13fe3c" data-file-name="components/order-data-processor.tsx">
              <div className="flex items-center" data-unique-id="f19adf7b-f8ad-4459-99ec-169f25a0d55d" data-file-name="components/order-data-processor.tsx">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-800 font-medium" data-unique-id="0bab5129-eb03-4bfc-aa7a-60f2d2e8459f" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="41ff188d-a998-4ae6-9fe5-f8de39d504b4" data-file-name="components/order-data-processor.tsx">Invalid records skipped</span></p>
              </div>
              <p className="text-sm text-red-700 mt-1" data-unique-id="22365aa7-e2f5-484c-bce4-ec78a7e3387b" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                {processingStats.invalid}<span className="editable-text" data-unique-id="f7fa01e3-7b71-4aa4-b324-715e8ffe7305" data-file-name="components/order-data-processor.tsx"> records were skipped due to missing required fields:
              </span></p>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1" data-unique-id="9ea99722-52eb-47c5-b1f2-62744943977c" data-file-name="components/order-data-processor.tsx">
                <li data-unique-id="eb34bf46-b65a-4287-aacd-06c67d328e66" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="dc00d924-fe10-4856-ba81-d45449aa7d1d" data-file-name="components/order-data-processor.tsx">Customer Order Number</span></li>
                <li data-unique-id="89ea5824-94b6-40af-8920-a6fbf8691f02" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="1d9ad463-235f-41d5-ad75-c609e915f2da" data-file-name="components/order-data-processor.tsx">Ship To Name</span></li>
                <li data-unique-id="babe571c-6f5f-4c9f-a73e-18921d781f19" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="c71e1dc6-7b04-4a6f-8a2a-0f38b54998b7" data-file-name="components/order-data-processor.tsx">Ship To Line1</span></li>
                <li data-unique-id="dfa184e8-d1db-4cbc-9646-6f7a175f2026" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="17ce74e7-8d06-4179-a72e-77a25ea9c44f" data-file-name="components/order-data-processor.tsx">Ship To State Province</span></li>
              </ul>
            </div>}
        </motion.div>}
    </motion.div>;
}