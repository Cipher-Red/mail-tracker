'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUp, FileSpreadsheet, AlertCircle, DownloadIcon, Mail, Search, X, Eye, Edit, Save, ExternalLink, Phone, Home, Calendar, Package, MapPin, DollarSign, Info, Trash2, Copy } from 'lucide-react';
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
  id?: string;
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
  orderStatus?: string;
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
  // State for pagination
  const [paginationState, setPaginationState] = useState({
    page: 0,
    pageSize: 10,
    totalItems: 0
  });

  // Function to fetch orders with pagination support
  const fetchOrders = useCallback(async (page = 0, pageSize = 10) => {
    try {
      setIsProcessing(true);

      // Calculate offset based on page and pageSize
      const offset = page * pageSize;

      // Include pagination parameters in the request
      const response = await fetch(`/api/orders?limit=${pageSize}&offset=${offset}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const result = await response.json();
      if (result.orders && Array.isArray(result.orders)) {
        // Transform the data to match our CleanedOrderData format
        const transformedOrders: CleanedOrderData[] = result.orders.map((order: any) => ({
          id: order.id?.toString() || '',
          customerOrderNumber: order.customerOrderNumber || '',
          shipToName: order.shippingAddress?.shipToName || '',
          shipToPhone: order.shippingAddress?.shipToPhone || '',
          shipToEmail: order.shippingAddress?.shipToEmail || '',
          shipToLine1: order.shippingAddress?.shipToLine1 || '',
          shipToCity: order.shippingAddress?.shipToCity || '',
          shipToStateProvince: order.shippingAddress?.shipToStateProvince || '',
          shipToPostalCode: order.shippingAddress?.shipToPostalCode || '',
          orderTotal: order.orderTotal || 0,
          actualShipDate: order.actualShipDate || new Date().toISOString(),
          trackingNumbers: order.tracking?.map((t: any) => t.trackingNumber) || [],
          orderSource: order.orderSource || '',
          orderSummary: order.orderSummary || ''
        }));
        setData(transformedOrders);
        setPaginationState({
          page,
          pageSize,
          totalItems: result.pagination?.total || transformedOrders.length
        });

        // Store pagination state in localStorage for persistence across page refreshes
        if (typeof window !== 'undefined') {
          try {
            if (typeof window !== 'undefined') {
              window.localStorage.setItem('orderProcessorPagination', JSON.stringify({
                page,
                pageSize,
                totalItems: result.pagination?.total || transformedOrders.length
              }));
            }
          } catch (err) {
            console.error('Error storing pagination state:', err);
          }
        }
        setProcessingStats({
          total: result.pagination?.total || transformedOrders.length,
          processed: transformedOrders.length,
          filtered: 0,
          invalid: 0
        });
        toast.success(`Loaded ${transformedOrders.length} orders`);
      } else {
        toast.error('No orders found');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(`Error fetching orders: ${error instanceof Error ? error.message : 'Unknown error'}`);

      // Try to recover from localStorage if API fails
      try {
        if (typeof window !== 'undefined') {
          let lastProcessedOrders = null;
          if (typeof window !== 'undefined') {
            lastProcessedOrders = window.localStorage.getItem('lastProcessedOrders');
          }
          if (lastProcessedOrders) {
            const savedOrders = JSON.parse(lastProcessedOrders);
            if (Array.isArray(savedOrders) && savedOrders.length > 0) {
              setData(savedOrders);
              setProcessingStats({
                total: savedOrders.length,
                processed: savedOrders.length,
                filtered: 0,
                invalid: 0
              });
              toast.success(`Recovered ${savedOrders.length} orders from your last session`);
            }
          }
        }
      } catch (storageError) {
        console.error("Failed to recover orders from local storage:", storageError);
      }
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Load orders when component mounts, with stored pagination if available
  useEffect(() => {
    // Try to load pagination state from localStorage
    if (typeof window !== 'undefined') {
      try {
        const storedPagination = localStorage.getItem('orderProcessorPagination');
        if (storedPagination) {
          const parsedPagination = JSON.parse(storedPagination);
          setPaginationState(parsedPagination);
          fetchOrders(parsedPagination.page, parsedPagination.pageSize);
        } else {
          fetchOrders();
        }
      } catch (error) {
        console.error('Error loading pagination state:', error);
        fetchOrders();
      }
    } else {
      fetchOrders();
    }
  }, [fetchOrders]);

  // Function to open customer details
  const showCustomerDetails = (order: CleanedOrderData) => {
    setSelectedOrder(order);
    setTempEmail(order.shipToEmail || '');
  };

  // Function to open order in ShipStation (updated URL format)
  const openOrderInShipStation = (orderNumber: string) => {
    const url = `https://ship.shipstation.com/orders/all-orders-search-result?quickSearch=${orderNumber}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Function to remove an order from the dataset
  const removeOrder = (orderToRemove: CleanedOrderData) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this order from the dataset?');
    if (confirmDelete) {
      setData(prevData => prevData.filter(order => order.customerOrderNumber !== orderToRemove.customerOrderNumber || order.shipToName !== orderToRemove.shipToName));

      // Also update localStorage to persist the removal
      if (typeof window !== 'undefined') {
        try {
          const lastProcessedOrders = localStorage.getItem('lastProcessedOrders');
          if (lastProcessedOrders) {
            const parsedOrders = JSON.parse(lastProcessedOrders);
            const updatedOrders = parsedOrders.filter((order: CleanedOrderData) => order.customerOrderNumber !== orderToRemove.customerOrderNumber || order.shipToName !== orderToRemove.shipToName);
            localStorage.setItem('lastProcessedOrders', JSON.stringify(updatedOrders));
          }
        } catch (err) {
          console.warn('Could not update localStorage:', err);
        }
      }
      toast.success(`Order #${orderToRemove.customerOrderNumber} has been removed`);
    }
  };

  // Function to copy order number to clipboard
  const copyOrderNumber = (orderNumber: string) => {
    // Only run on client side
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(orderNumber).then(() => {
          toast.success(`Order #${orderNumber} copied to clipboard!`, {
            duration: 2000,
            position: 'bottom-center'
          });
        }).catch(err => {
          console.error('Failed to copy order number:', err);
          toast.error('Failed to copy order number');
        });
      }
    }
  };

  // Function to save customer email
  const saveCustomerEmail = async () => {
    if (selectedOrder) {
      try {
        // Show loading toast
        toast.loading('Updating customer email...', {
          id: 'update-email'
        });

        // Find the order identifier - use customerOrderNumber if ID is not available
        const orderId = selectedOrder.id;
        const customerOrderNumber = selectedOrder.customerOrderNumber;
        if (!orderId && !customerOrderNumber) {
          throw new Error('No order identifier found');
        }
        if (orderId) {
          // Update the shipping address with the new email using ID
          const response = await fetch(`/api/orders/${orderId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              shippingAddress: {
                shipToEmail: tempEmail
              }
            })
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update email');
          }
        } else {
          // If no ID but we have customerOrderNumber, update based on that
          // This is a fallback that doesn't require an API call
          console.log('Updating email using customer order number as identifier');
        }

        // Always update local state regardless of API success
        // This ensures the UI is updated even if the backend update fails
        const updatedData = data.map(order => order.customerOrderNumber === selectedOrder.customerOrderNumber ? {
          ...order,
          shipToEmail: tempEmail
        } : order);
        setData(updatedData);
        setSelectedOrder({
          ...selectedOrder,
          shipToEmail: tempEmail
        });

        // Save updated data to localStorage as fallback
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem('lastProcessedOrders', JSON.stringify(updatedData));
          } catch (err) {
            console.warn('Could not save updated orders to localStorage:', err);
          }
        }
        setIsEditingEmail(false);
        toast.success('Customer email updated successfully', {
          id: 'update-email'
        });
      } catch (error) {
        console.error('Error updating customer email:', error);
        toast.error(`Failed to update email: ${error instanceof Error ? error.message : 'Unknown error'}`, {
          id: 'update-email'
        });
      }
    }
  };

  // Filter data based on search query (order number)
  const filteredData = data.filter(order => searchQuery ? order.customerOrderNumber.toLowerCase().includes(searchQuery.toLowerCase()) : true);

  // Function to process uploaded files
  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = async e => {
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
          if (!wsname) {
            toast.error('No worksheets found in file');
            setIsProcessing(false);
            return;
          }
          const ws = workbook.Sheets[wsname];

          // Convert to JSON
          const rawJsonData = XLSX.utils.sheet_to_json<RawOrderData>(ws);
          if (rawJsonData.length === 0) {
            toast.error('No data found in file');
            setIsProcessing(false);
            return;
          }
          setRawData(rawJsonData);

          // Check if this is an exported file from our system
          const isExportedFile = rawJsonData.some(row => row.exportFormat === 'DetroitAxleOrderData-v1.0' || row._trackingNumbersArray !== undefined);
          let cleanedData;
          let stats;
          if (isExportedFile) {
            // Handle our exported format
            toast.success('Detected Detroit Axle export format, using optimized import...');

            // Convert exported format back to our internal format
            cleanedData = rawJsonData.map((row: any) => {
              // Handle tracking numbers array that was serialized for export
              let trackingNumbers = [];
              if (row._trackingNumbersArray) {
                try {
                  trackingNumbers = JSON.parse(row._trackingNumbersArray);
                } catch (e) {
                  console.error('Failed to parse tracking numbers array:', e);
                  // Fallback: try to split the string by commas
                  const trackingStr = row.trackingNumbers || '';
                  trackingNumbers = trackingStr.split(',').map((t: string) => t.trim()).filter(Boolean);
                }
              } else if (row.trackingNumbers) {
                // Fallback: try to split the string by commas
                const trackingStr = row.trackingNumbers || '';
                trackingNumbers = trackingStr.split(',').map((t: string) => t.trim()).filter(Boolean);
              }
              return {
                id: row.id || undefined,
                // Don't assign if not present
                customerOrderNumber: row.customerOrderNumber,
                shipToName: row.shipToName,
                shipToPhone: row.shipToPhone || '',
                shipToEmail: row.shipToEmail || '',
                shipToLine1: row.shipToLine1,
                shipToCity: row.shipToCity,
                shipToStateProvince: row.shipToStateProvince,
                shipToPostalCode: row.shipToPostalCode,
                orderTotal: Number(row.orderTotal) || 0,
                actualShipDate: row.actualShipDate || new Date().toISOString(),
                trackingNumbers: trackingNumbers,
                orderSource: row.orderSource || '',
                orderSummary: row.orderSummary || '',
                orderStatus: row.orderStatus || 'new'
              };
            });
            stats = {
              total: rawJsonData.length,
              processed: cleanedData.length,
              filtered: 0,
              invalid: rawJsonData.length - cleanedData.length
            };
          } else {
            // Process the data through our cleaning and validation functions for regular import
            ({
              cleanedData,
              stats
            } = cleanAndValidateData(rawJsonData));
          }

          // Save the processed data
          if (cleanedData.length > 0) {
            try {
              // Show processing toast
              toast.loading('Saving orders...', {
                id: 'saving-orders'
              });

              // Send data to API endpoint
              const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(cleanedData)
              });
              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save orders');
              }
              const savedOrders = await response.json();

              // Update the local state with the saved data
              setData(cleanedData);
              setProcessingStats(stats);

              // Store successfully processed data in localStorage as backup
              if (typeof window !== 'undefined') {
                try {
                  if (typeof window !== 'undefined') {
                    window.localStorage.setItem('lastProcessedOrders', JSON.stringify(cleanedData));
                    window.localStorage.setItem('lastProcessedDate', new Date().toISOString());
                  }
                } catch (err) {
                  console.warn('Could not save to localStorage:', err);
                }
              }
              toast.success(`Successfully processed and saved ${cleanedData.length} orders`, {
                id: 'saving-orders'
              });
            } catch (error) {
              console.error('Error saving orders:', error);
              toast.error(`Error saving orders: ${error instanceof Error ? error.message : 'Unknown error'}`, {
                id: 'saving-orders'
              });

              // Set the data anyway so user can see what was processed
              setData(cleanedData);
              setProcessingStats(stats);
            }
          } else {
            toast.error('No valid orders found after filtering');
          }
        } catch (error) {
          console.error('Error parsing file:', error);
          toast.error(`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
  // Clean all orders from the system
  const cleanAllOrders = () => {
    if (data.length === 0) {
      toast.error('No orders to clean');
      return;
    }

    // Show confirmation dialog
    if (confirm('Are you sure you want to remove ALL orders from the system? This action cannot be undone.')) {
      try {
        // Clear orders from state
        setData([]);
        setProcessingStats({
          total: 0,
          processed: 0,
          filtered: 0,
          invalid: 0
        });

        // Clear orders from localStorage
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.removeItem('lastProcessedOrders');
            window.localStorage.removeItem('lastProcessedDate');
            window.localStorage.removeItem('orderProcessorPagination');
            window.localStorage.removeItem('orderDataForEmails');
            // Also clear from API storage
            fetch('/api/orders/clean', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json'
              }
            });
          } catch (err) {
            console.warn('Could not clear localStorage:', err);
          }
        }
        toast.success('All orders have been removed from the system');
      } catch (error) {
        console.error('Error clearing orders:', error);
        toast.error(`Failed to clean orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };
  const exportProcessedData = async () => {
    if (data.length === 0) {
      toast.error('No data to export');
      return;
    }
    try {
      toast.loading('Preparing export...', {
        id: 'export'
      });

      // Use the current data in state, which is already up-to-date from localStorage
      let exportData = data.map(order => {
        // Format data for better compatibility with import process
        return {
          id: order.id || '',
          customerOrderNumber: order.customerOrderNumber,
          shipToName: order.shipToName,
          shipToPhone: order.shipToPhone,
          shipToEmail: order.shipToEmail || '',
          shipToLine1: order.shipToLine1,
          shipToCity: order.shipToCity,
          shipToStateProvince: order.shipToStateProvince,
          shipToPostalCode: order.shipToPostalCode,
          orderTotal: order.orderTotal,
          // Format date consistently for import compatibility
          actualShipDate: order.actualShipDate ? new Date(order.actualShipDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          // Join tracking numbers for Excel display, but keep the array format in a hidden field
          trackingNumbers: Array.isArray(order.trackingNumbers) ? order.trackingNumbers.join(', ') : order.trackingNumbers || '',
          // Add this hidden field for proper array import later
          _trackingNumbersArray: JSON.stringify(order.trackingNumbers || []),
          orderStatus: order.orderStatus || 'new',
          orderSource: order.orderSource || '',
          orderSummary: order.orderSummary || '',
          // Add export metadata
          exportedAt: new Date().toISOString(),
          exportFormat: 'DetroitAxleOrderData-v1.0' // Version tracking for import compatibility
        };
      });

      // Create a new workbook
      const wb = XLSX.utils.book_new();

      // Convert JSON to worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);

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
      const filename = `detroit-axle-orders-${new Date().toISOString().split('T')[0]}.xlsx`;
      saveAs(blob, filename);

      // Save export data to localStorage for potential recovery
      if (typeof window !== 'undefined') {
        try {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('lastExportedOrders', JSON.stringify(data));
            window.localStorage.setItem('lastExportDate', new Date().toISOString());
          }
        } catch (err) {
          console.warn('Could not save export data to localStorage:', err);
        }
      }
      toast.success(`Data exported successfully as ${filename}`, {
        id: 'export'
      });
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Failed to export data: ${error instanceof Error ? error.message : 'Unknown error'}`, {
        id: 'export'
      });
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
  }} className="w-full max-w-[100%] mx-auto px-2" data-unique-id="774504d2-8ab3-46f0-94ca-f7c880c1fbb3" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
      <Toaster position="top-center" toastOptions={{
      duration: 3000
    }} />
      
      <div className="mb-8" data-unique-id="f02d62e5-5bb3-4bf6-a520-2546ff76566a" data-file-name="components/order-data-processor.tsx">
        <h1 className="text-3xl font-bold text-primary mb-2" data-unique-id="465c4239-8aef-42d4-80dd-1488cb5d2c92" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="772d4bb7-8aad-4c21-a928-832a1ad46e3e" data-file-name="components/order-data-processor.tsx">
          Order Data Processor
        </span></h1>
        <p className="text-muted-foreground" data-unique-id="ca88014a-465f-48ab-a758-660ca5e69173" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="975a52f2-5366-4016-afd6-715b5f60b608" data-file-name="components/order-data-processor.tsx">
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
    }} className="mt-8" data-unique-id="e3cf2bfc-1d64-48ce-b2c4-4944e649257d" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
          <div className="flex justify-between items-center mb-6" data-unique-id="84d45646-daec-4d96-97a9-8231d8fb902d" data-file-name="components/order-data-processor.tsx">
            <div data-unique-id="a1d5c8ff-2807-417f-b0f1-03bfe1d7cec8" data-file-name="components/order-data-processor.tsx">
              <h2 className="text-xl font-semibold flex items-center" data-unique-id="55c0c350-aa20-4bec-b952-ad57058d08e8" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                <FileSpreadsheet className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="11d60fae-b4bf-40de-8754-f1ab41623e7b" data-file-name="components/order-data-processor.tsx">
                Processed Orders (</span>{data.length}<span className="editable-text" data-unique-id="5134ee79-e750-4f66-80cf-2a1b81519e60" data-file-name="components/order-data-processor.tsx">)
              </span></h2>
              
              <div className="mt-2 flex flex-wrap gap-3" data-unique-id="a150bb9a-dcf5-4198-a497-95155f4ec2f8" data-file-name="components/order-data-processor.tsx">
                <div className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full" data-unique-id="0f97f8af-5711-4401-bd8d-4e82caa11538" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="4ff9867c-a04f-46cc-a9d5-26cdad0576d6" data-file-name="components/order-data-processor.tsx">
                  Total: </span>{processingStats.total}
                </div>
                <div className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full" data-unique-id="e17d9dc2-2da7-41fb-82ce-3f2b10e48dd5" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="bd9d83ae-4152-44bc-831d-2f045846be0b" data-file-name="components/order-data-processor.tsx">
                  Processed: </span>{processingStats.processed}
                </div>
                <div className="text-sm bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full" data-unique-id="5b7f68e7-787e-4c68-a494-ae238ef5a92b" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="8ef5436d-16e0-4f31-b5e2-67659d183b45" data-file-name="components/order-data-processor.tsx">
                  Filtered: </span>{processingStats.filtered}
                </div>
                <div className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded-full" data-unique-id="9a68eb43-091b-4541-be8b-e13c1af50d61" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="aeeff8a1-9f3a-48f3-aba9-7570a947153e" data-file-name="components/order-data-processor.tsx">
                  Invalid: </span>{processingStats.invalid}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3" data-unique-id="ca9361df-4ae6-42c3-a871-0ee1136452ee" data-file-name="components/order-data-processor.tsx">
              <button onClick={sendEmailsToCustomers} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="2bc90f65-d97d-431c-9f62-f8ac149a96fb" data-file-name="components/order-data-processor.tsx">
                <Mail className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="662f6056-825a-40d2-b3d1-f3ad5a21a5d0" data-file-name="components/order-data-processor.tsx">
                Create Emails
              </span></button>
              
              <button onClick={exportProcessedData} className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="ba0de093-2a9e-49d1-8c15-abd3b024d9bf" data-file-name="components/order-data-processor.tsx">
                <DownloadIcon className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="7606fec4-4320-4f30-8e1c-91e87cd1ca82" data-file-name="components/order-data-processor.tsx">
                Export Data
              </span></button>
              
              <button onClick={cleanAllOrders} className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors" data-unique-id="f8461d66-e46c-4573-bc1e-eaf25b605b41" data-file-name="components/order-data-processor.tsx">
                <Trash2 className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="71eeff24-9e29-4139-be8f-252ad4542479" data-file-name="components/order-data-processor.tsx">
                Clean All
              </span></button>
            </div>
          </div>

          {/* Search by Order Number */}
          <div className="mb-6 relative" data-unique-id="ae57e173-ea81-44db-855f-2637e5456020" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
            <div className="relative" data-unique-id="7b98c29f-b7f8-4875-870d-4211d98e5586" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by order number..." className="pl-10 pr-4 py-2 w-full border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" data-unique-id="707538f2-2c80-4df2-a92d-7d7122c8f1c7" data-file-name="components/order-data-processor.tsx" />
              {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground" data-unique-id="d227bedf-900b-40a9-807d-650d8fb614a2" data-file-name="components/order-data-processor.tsx">
                  <X className="h-4 w-4" />
                </button>}
            </div>
            {searchQuery && <div className="mt-2 text-sm text-muted-foreground" data-unique-id="25ba813f-4b4f-4ec8-b1bc-62edf22aad65" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="02f2fa48-2d10-441f-a87e-93714fb6193b" data-file-name="components/order-data-processor.tsx">
                Found </span>{filteredData.length}<span className="editable-text" data-unique-id="aaf26ed4-275f-4f09-85eb-709756fd4f4c" data-file-name="components/order-data-processor.tsx"> orders matching "</span>{searchQuery}<span className="editable-text" data-unique-id="17af4768-b04a-446e-9fe3-b40b55694da8" data-file-name="components/order-data-processor.tsx">"
              </span></div>}
          </div>
          
          {/* Display Table */}
          <div className="bg-card rounded-lg border border-border shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl" data-unique-id="0ebc5cbb-d799-480f-9ebb-146cc60cf097" data-file-name="components/order-data-processor.tsx">
            <DataTable data={filteredData} onRowClick={showCustomerDetails} actionColumn={row => <div className="flex space-x-1" data-unique-id="bc50ed66-94fe-44e4-9fc3-81c6ae7ea752" data-file-name="components/order-data-processor.tsx">
                  <button onClick={() => showCustomerDetails(row)} className="p-2 rounded-full hover:bg-accent/20" title="View Customer Details" data-unique-id="2384bb54-dc61-4428-91d0-c4e462ac8e03" data-file-name="components/order-data-processor.tsx">
                    <Eye className="h-4 w-4 text-primary" />
                  </button>
                  <button onClick={e => {
            e.stopPropagation();
            openOrderInShipStation(row.customerOrderNumber);
          }} className="p-2 rounded-full hover:bg-accent/20" title="Open in ShipStation" data-unique-id="9d26c5ef-9ddd-41f1-a210-dbe89153224b" data-file-name="components/order-data-processor.tsx">
                    <ExternalLink className="h-4 w-4 text-blue-500" />
                  </button>
                  <button onClick={e => {
            e.stopPropagation();
            copyOrderNumber(row.customerOrderNumber);
          }} className="p-2 rounded-full hover:bg-accent/20" title="Copy order number" data-unique-id="df127b20-99f8-4987-97c1-5afd336f8be6" data-file-name="components/order-data-processor.tsx">
                    <Copy className="h-4 w-4 text-gray-600" />
                  </button>
                  <button onClick={e => {
            e.stopPropagation();
            removeOrder(row);
          }} className="p-2 rounded-full hover:bg-red-100 transition-colors" title="Remove order" data-unique-id="56070652-55fb-40f7-8d15-a0eddc008860" data-file-name="components/order-data-processor.tsx">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>} renderCell={(key, value, row) => {
          // Make tracking numbers clickable
          if (key === 'trackingNumbers' && Array.isArray(value)) {
            return <div className="space-y-1" data-unique-id="ae210653-37b1-47d8-a367-a7e0dada8359" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                    {value.map((num, idx) => <a key={idx} href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${num}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:underline" data-unique-id="19329a9e-baf3-4835-bfd7-ac7bcacc954f" data-file-name="components/order-data-processor.tsx">
                      <span className="mr-1" data-unique-id="2309edb2-8dcb-4452-ad3a-dcf4697f18f2" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{num.length > 15 ? `${num.slice(0, 15)}...` : num}</span>
                      <ExternalLink className="h-3 w-3" data-unique-id="d599f696-2c04-4599-834d-05f15c1cd8d5" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                    </a>)}
                  </div>;
          }

          // Make order number clickable
          if (key === 'customerOrderNumber') {
            const orderLink = `https://ship.shipstation.com/orders/awaiting-shipment/order/${row.id || 'unknown'}/active/${value}`;
            return <a href={orderLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" onClick={e => e.stopPropagation()} data-unique-id="98814874-5449-4d8e-a4e1-18a2a2a8ad89" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                      {value}
                    </a>;
          }
          return null; // Use default rendering for other cells
        }} />
          </div>
          
          {/* Warning about filtered data */}
          {processingStats.filtered > 0 && <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md" data-unique-id="f33aa174-27a4-470e-a408-de404a08d5b5" data-file-name="components/order-data-processor.tsx">
              <div className="flex items-center" data-unique-id="ea9bb663-847c-4b32-8579-51d3d4533071" data-file-name="components/order-data-processor.tsx">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-yellow-800 font-medium" data-unique-id="3ff6c47c-8581-43df-91e8-3cc5693f61c5" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="aa065a46-e53e-400e-b2c0-863901f38edb" data-file-name="components/order-data-processor.tsx">Some entries were filtered out</span></p>
              </div>
              <p className="text-sm text-yellow-700 mt-1" data-unique-id="aa6b395c-8288-4154-83b9-ab5c9fc8c87c" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                {processingStats.filtered}<span className="editable-text" data-unique-id="45e485f3-3c45-44b3-9b90-577b31398c62" data-file-name="components/order-data-processor.tsx"> entries were filtered out because they didn't meet the requirements
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
      }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)} data-unique-id="3eb42501-65be-4679-9e15-f7e998b57f68" data-file-name="components/order-data-processor.tsx">
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
        }} className="bg-card rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="9fcdbd9b-07c5-4bd7-bba5-d9f7e151ebd2" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
              {/* Header */}
              <div className="bg-primary text-white p-6" data-unique-id="145dc313-3b52-46a4-b216-3eea119a7e0b" data-file-name="components/order-data-processor.tsx">
                <div className="flex justify-between items-start" data-unique-id="9e3372dc-837b-4ef6-b906-5636d55ce0b9" data-file-name="components/order-data-processor.tsx">
                  <div data-unique-id="6a902125-7a43-4120-b060-daa63eec6c33" data-file-name="components/order-data-processor.tsx">
                    <div className="flex items-center" data-unique-id="8e400c30-c47c-494f-869c-8f15ed259ded" data-file-name="components/order-data-processor.tsx">
                      <h2 className="text-xl font-semibold" data-unique-id="458f6ed0-8875-4981-813d-42d0da5b2dc6" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="9416edc1-5d14-4d71-8415-8051cfdcc4db" data-file-name="components/order-data-processor.tsx">Customer Order #</span>{selectedOrder.customerOrderNumber}</h2>
                      <button onClick={() => copyOrderNumber(selectedOrder.customerOrderNumber)} className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors" title="Copy order number" data-unique-id="38a6d0f6-a327-48e5-a47c-de70f9a30300" data-file-name="components/order-data-processor.tsx">
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-primary-foreground/80 mt-1" data-unique-id="6ef69519-59af-49f0-beec-e6669ace38f2" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="100e1de7-1d31-41fc-845a-75ada4e9c7e5" data-file-name="components/order-data-processor.tsx">Shipped on </span>{new Date(selectedOrder.actualShipDate).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="text-white hover:bg-white/10 rounded-full p-2 transition-colors" data-unique-id="c280ae03-32e2-42c8-9712-71584c902a15" data-file-name="components/order-data-processor.tsx">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto" data-unique-id="b361c3f8-e055-433f-9219-2ca3fa28e85d" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="31675786-35bd-4b53-a51a-6aa988d241f8" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                  {/* Customer Information */}
                  <div className="space-y-4" data-unique-id="db90a75f-57a6-45de-b24b-09503f6c593e" data-file-name="components/order-data-processor.tsx">
                    <div className="flex items-start" data-unique-id="b727f9c6-f883-4414-97d3-d88d35c37055" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="816a315c-1a66-4e4c-b9f0-3b52a7841091" data-file-name="components/order-data-processor.tsx">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="8aca2429-6bfd-4e1b-b772-6f093c14a707" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="64d7a1db-b80e-472b-8fc5-346a50e38073" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="98120e23-9f8d-4e71-85be-f3689b5b3fdd" data-file-name="components/order-data-processor.tsx">Customer Name</span></h3>
                        <p className="text-lg font-medium" data-unique-id="c953695c-24df-4147-86a0-fc97fb7f9a08" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start" data-unique-id="247ee1fd-a931-4cbf-be1e-acc87b253cd7" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="6eee3b7c-b97a-4e40-ac84-34e6ea0e5fb6" data-file-name="components/order-data-processor.tsx">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1" data-unique-id="ae52af8b-8895-4212-97ed-13538020e779" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="5fd34f50-738c-4d8e-ad61-f8bcba7f9ec8" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="8f29aea0-02b7-4586-bd3f-6fc9536abc2c" data-file-name="components/order-data-processor.tsx">Email Address</span></h3>
                        {isEditingEmail ? <div className="flex items-center mt-1" data-unique-id="d2ca7a53-b8a8-429c-b3cf-85fc5bfdb6a4" data-file-name="components/order-data-processor.tsx">
                            <input type="email" value={tempEmail} onChange={e => setTempEmail(e.target.value)} className="flex-1 border border-border rounded-md px-2 py-1 text-sm" placeholder="Enter customer email" data-unique-id="209eefa7-31fb-4bdf-bfea-49ba2d1ab4bb" data-file-name="components/order-data-processor.tsx" />
                            <button onClick={saveCustomerEmail} className="ml-2 p-1 bg-primary text-white rounded-md" title="Save email" data-unique-id="22606e67-08f9-4c9c-b64e-82413c21cd04" data-file-name="components/order-data-processor.tsx">
                              <Save className="h-4 w-4" />
                            </button>
                            <button onClick={() => {
                        setIsEditingEmail(false);
                        setTempEmail(selectedOrder.shipToEmail || '');
                      }} className="ml-1 p-1 bg-secondary text-secondary-foreground rounded-md" title="Cancel" data-unique-id="1f2014d3-d02e-48a7-8706-abffacb28944" data-file-name="components/order-data-processor.tsx">
                              <X className="h-4 w-4" />
                            </button>
                          </div> : <div className="flex items-center" data-unique-id="bc616945-9858-47f7-ab96-3bf23be28869" data-file-name="components/order-data-processor.tsx">
                            <p className="text-lg" data-unique-id="cda1a351-1e55-46de-8ef7-0d6c0a87b49b" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToEmail || 'No email provided'}</p>
                            <button onClick={() => setIsEditingEmail(true)} className="ml-2 p-1 hover:bg-accent/20 rounded-md" title="Edit email" data-unique-id="38961638-6d0f-452b-b597-e0dc9a61af25" data-file-name="components/order-data-processor.tsx">
                              <Edit className="h-4 w-4 text-primary" />
                            </button>
                          </div>}
                      </div>
                    </div>
                    
                    <div className="flex items-start" data-unique-id="6145dae4-6857-43d0-b2b6-101ecd6bfbea" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="fe3b7df7-c9d4-4c66-b0d7-1433f8ff2181" data-file-name="components/order-data-processor.tsx">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="7ec3d35a-a3b7-46b5-96f3-22c61ba605bb" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="273fac0d-66dc-479a-a7f3-dc39816de240" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="ce6b6373-bf47-4f3f-a85b-e85c48de7eb9" data-file-name="components/order-data-processor.tsx">Phone Number</span></h3>
                        <p className="text-lg" data-unique-id="86936e65-db92-43af-9f5d-96745d0b0b72" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToPhone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Information */}
                  <div className="space-y-4" data-unique-id="2b2d25f3-cf6a-4846-b833-bd4a2d62bc55" data-file-name="components/order-data-processor.tsx">
                    <div className="flex items-start" data-unique-id="6a2b6398-f7a5-4e89-b07f-a24752826fae" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="ab021ec8-01f1-4039-acbc-d66e7f6de730" data-file-name="components/order-data-processor.tsx">
                        <Home className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="22d9cb88-866e-4dda-b25f-f548b1b92265" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="10dfd349-fdc9-4c47-8f92-8cad86271ac1" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="a93d4414-06c7-4fd7-992e-ff8d1d8c3a32" data-file-name="components/order-data-processor.tsx">Shipping Address</span></h3>
                        <p className="text-lg" data-unique-id="02de296d-1989-49cc-9582-67738c5dd9af" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToLine1}</p>
                        <p className="text-lg" data-unique-id="2364ce35-48b1-4ff5-aa39-525d036d41ad" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToCity}<span className="editable-text" data-unique-id="f34d51a6-c172-43dd-883f-90d1806666b5" data-file-name="components/order-data-processor.tsx">, </span>{selectedOrder.shipToStateProvince} {selectedOrder.shipToPostalCode}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start" data-unique-id="1e85a8d4-5041-4371-a248-d52e2ae8cc28" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="77644316-a48a-44ca-990c-e24357ab1afc" data-file-name="components/order-data-processor.tsx">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="69b9089c-8dca-4e44-9a45-259bd5562ab8" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="a5493191-fac7-4673-9245-e829ee7642ad" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="8c59030a-6a61-40e5-95fe-daa39d0a8436" data-file-name="components/order-data-processor.tsx">Order Total</span></h3>
                        <p className="text-lg font-medium" data-unique-id="bdaf555a-f6f1-4720-9551-671d2dac5526" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="428353f8-7d02-497d-8c6c-d5c508432b09" data-file-name="components/order-data-processor.tsx">$</span>{selectedOrder.orderTotal.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start" data-unique-id="ad7b677a-3d77-4192-a78d-93f460af41f3" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="11886a03-6228-40de-a512-ec4226d3e823" data-file-name="components/order-data-processor.tsx">
                        <Info className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="e19cf828-a993-4b28-8f26-8f5a8d600cbb" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="29046e89-62c6-4d6c-aa88-fc6495e2907f" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="5c50cd06-364e-4e97-bbf2-f6fffbce6f78" data-file-name="components/order-data-processor.tsx">Order Source</span></h3>
                        <p className="text-lg" data-unique-id="894a5471-6e33-4159-a8e3-ec7c6eb8d1ea" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.orderSource || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracking Information */}
                <div className="mt-6 pt-6 border-t border-border" data-unique-id="acb00575-7b94-4374-8759-966a5cd01c3c" data-file-name="components/order-data-processor.tsx">
                  <h3 className="text-lg font-medium mb-4" data-unique-id="8814ff37-f7ff-4449-9574-78fa48508ca8" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="d7fa60b3-c8f2-4245-9a23-af16c4089713" data-file-name="components/order-data-processor.tsx">Tracking Information</span></h3>
                  <div className="space-y-3" data-unique-id="d0174f69-d479-44f1-8172-da9304449a7c" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                    {selectedOrder.trackingNumbers.map((number, index) => <div key={index} className="flex items-center p-3 bg-accent/10 rounded-md" data-unique-id="f605063c-f7a3-4b6c-addd-fba5a7e14071" data-file-name="components/order-data-processor.tsx">
                        <MapPin className="h-5 w-5 text-primary mr-3" data-unique-id="f3c4f706-4ef5-424d-961c-ec01f05e08ef" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                        <span className="font-medium mr-2" data-unique-id="45a2d393-bd36-4ccc-9444-23353e569982" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="43763b51-0602-483e-b815-c58b4567e0e0" data-file-name="components/order-data-processor.tsx">Tracking #</span>{index + 1}<span className="editable-text" data-unique-id="5a62c0c6-770e-4a96-93c7-2167d1d7520d" data-file-name="components/order-data-processor.tsx">:</span></span>
                        <div className="flex items-center flex-wrap" data-unique-id="17ad4eee-7ac3-4bbf-920c-c1ff64c7d664" data-file-name="components/order-data-processor.tsx">
                          <a href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${number}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center" data-unique-id="18ec3f93-5760-4d71-9e6c-1216768fe616" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                            {number}
                            <ExternalLink className="ml-1 h-4 w-4" data-unique-id="b8bff0f1-2ea9-4183-a4ec-e411562b0584" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                          </a>
                          <button onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(number).then(() => toast.success('Tracking number copied!')).catch(err => console.error('Failed to copy tracking number:', err));
                      }
                    }} className="ml-2 p-1 rounded-full hover:bg-accent/20 transition-colors" title="Copy tracking number" data-unique-id="18706c32-5d9d-4555-9482-4d30da686168" data-file-name="components/order-data-processor.tsx">
                            <Copy className="h-4 w-4 text-primary" data-unique-id="4a00a0b9-6562-4842-8ac5-b6a85cdeb0cd" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                          </button>
                          <button onClick={() => {
                      const trackingUrl = `https://www.fedex.com/apps/fedextrack/?tracknumbers=${number}`;
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(trackingUrl).then(() => toast.success('Tracking link copied!')).catch(err => console.error('Failed to copy tracking link:', err));
                      }
                    }} className="ml-1 p-1 rounded-full hover:bg-accent/20 transition-colors" title="Copy FedEx link" data-unique-id="b80a2556-838c-4456-9263-5578f07a9e2e" data-file-name="components/order-data-processor.tsx">
                            <svg className="h-4 w-4 text-[#4D148C]" viewBox="0 0 24 24" fill="currentColor" data-unique-id="9ce30d52-739f-4270-98bb-7a1fd9845342" data-file-name="components/order-data-processor.tsx">
                              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 5a3 3 0 11-3 3 3 3 0 013-3zm0 11.13c-2.03-.31-3.88-1.47-5.14-3.13h10.28c-1.26 1.66-3.11 2.82-5.14 3.13z" data-unique-id="9dbd3137-4085-4582-bdad-e64787ffb9d4" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                            </svg>
                          </button>
                        </div>
                      </div>)}
                    {selectedOrder.trackingNumbers.length === 0 && <p className="text-muted-foreground italic" data-unique-id="2041fea3-d459-43d4-9f26-ccd5a4f3b773" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="1da4208b-e0b8-43ed-84ee-cae38d00f7c0" data-file-name="components/order-data-processor.tsx">No tracking numbers available</span></p>}
                  </div>
                </div>

                {/* Order Summary */}
                {selectedOrder.orderSummary && <div className="mt-6 pt-6 border-t border-border" data-unique-id="a78fff17-7dc7-4cd6-9a97-8855d849267d" data-file-name="components/order-data-processor.tsx">
                    <h3 className="text-lg font-medium mb-2" data-unique-id="35b2fa52-541c-44ed-8422-c60801e69b23" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="25dc864a-7004-47ec-9883-f8fb1cc2f5b6" data-file-name="components/order-data-processor.tsx">Order Summary</span></h3>
                    <div className="p-4 bg-accent/10 rounded-md" data-unique-id="0551aa4c-1379-4620-a619-3a4b28f92b0f" data-file-name="components/order-data-processor.tsx">
                      <p data-unique-id="5d056c21-f1db-492c-b703-d949c5d81942" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.orderSummary}</p>
                    </div>
                  </div>}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border bg-muted/30 flex justify-end" data-unique-id="7473a8c4-ce8e-4ca9-b180-07f5778f9b4f" data-file-name="components/order-data-processor.tsx">
                <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="6175398d-16e1-4272-bbd2-08b29e949cb8" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="bb455be0-3ae0-4476-adcf-94ec3a653c7f" data-file-name="components/order-data-processor.tsx">
                  Close
                </span></button>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
    </motion.div>;
}