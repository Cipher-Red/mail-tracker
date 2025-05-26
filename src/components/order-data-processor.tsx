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
      try {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(orderNumber).then(() => {
            toast.success(`Order #${orderNumber} copied to clipboard!`, {
              duration: 2000,
              position: 'bottom-center'
            });
          }).catch(err => {
            console.error('Failed to copy order number with Clipboard API:', err);
            // Fall back to execCommand
            fallbackCopy(orderNumber);
          });
        } else {
          fallbackCopy(orderNumber);
        }
      } catch (err) {
        console.error('Copy operation failed:', err);
        toast.error('Failed to copy order number');
      }
    }
    function fallbackCopy(text: string) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        if (successful) {
          toast.success(`Order #${text} copied to clipboard!`, {
            duration: 2000,
            position: 'bottom-center'
          });
        } else {
          toast.error('Failed to copy order number');
        }
        document.body.removeChild(textArea);
      } catch (err) {
        console.error('Fallback copy failed:', err);
        toast.error('Failed to copy order number');
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
  }} className="w-full max-w-[100%] mx-auto px-2" data-unique-id="b6dd3840-1566-438d-8387-972bce43e9e2" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
      <Toaster position="top-center" toastOptions={{
      duration: 3000
    }} />
      
      <div className="mb-8" data-unique-id="1f56dcd0-d17b-4978-b455-1f1749a9d731" data-file-name="components/order-data-processor.tsx">
        <h1 className="text-3xl font-bold text-primary mb-2" data-unique-id="0795b5df-875e-4989-98c6-e5dae74371ea" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="77c36002-bddd-4099-94ca-c41de2c591da" data-file-name="components/order-data-processor.tsx">
          Order Data Processor
        </span></h1>
        <p className="text-muted-foreground" data-unique-id="abafa15c-2619-4547-b770-064394e04977" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="b69c5e09-6408-4088-be2a-1389a4344822" data-file-name="components/order-data-processor.tsx">
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
    }} className="mt-8" data-unique-id="b4b83771-ebc2-428e-8253-5c1792b9b162" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
          <div className="flex justify-between items-center mb-6" data-unique-id="5ed63f34-55c9-42b8-af01-ae54b5e154d4" data-file-name="components/order-data-processor.tsx">
            <div data-unique-id="b5c3053e-f259-43aa-9c12-c1251108cca6" data-file-name="components/order-data-processor.tsx">
              <h2 className="text-xl font-semibold flex items-center" data-unique-id="21670323-e5f4-457b-8351-3064ba4cea99" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                <FileSpreadsheet className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="0c348c03-3fa9-4e10-85b9-5fbefc164cb0" data-file-name="components/order-data-processor.tsx">
                Processed Orders (</span>{data.length}<span className="editable-text" data-unique-id="f296fcf7-895d-4a77-9cc0-67db53baf7d3" data-file-name="components/order-data-processor.tsx">)
              </span></h2>
              
              <div className="mt-2 flex flex-wrap gap-3" data-unique-id="9a548587-6f68-4d6c-9848-5ed282f154de" data-file-name="components/order-data-processor.tsx">
                <div className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full" data-unique-id="c89f8ea7-1b47-45e2-96cd-020a74faa502" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="0d645a09-92c4-46a3-802c-323e8256de20" data-file-name="components/order-data-processor.tsx">
                  Total: </span>{processingStats.total}
                </div>
                <div className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full" data-unique-id="e8e1802e-37a6-4e28-8730-49988593a4ed" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="719bde8c-8258-4662-9bf0-ae08b5885055" data-file-name="components/order-data-processor.tsx">
                  Processed: </span>{processingStats.processed}
                </div>
                <div className="text-sm bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full" data-unique-id="a28c6d75-d0d9-43c8-9610-18cf58d4b9f3" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="da549bae-8b0b-4955-94c9-90c4100f50a7" data-file-name="components/order-data-processor.tsx">
                  Filtered: </span>{processingStats.filtered}
                </div>
                <div className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded-full" data-unique-id="d91680d5-7ea1-4a98-9590-68607aa38ca4" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="6a8cc78a-ee0f-48fe-86c1-6238b61f0f83" data-file-name="components/order-data-processor.tsx">
                  Invalid: </span>{processingStats.invalid}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3" data-unique-id="7caa4ce0-5a82-4219-afa6-4f9e586f1a91" data-file-name="components/order-data-processor.tsx">
              <button onClick={sendEmailsToCustomers} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="16bf3280-1477-4278-9d86-ceb8fc684962" data-file-name="components/order-data-processor.tsx">
                <Mail className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="f72583c0-a7e1-4510-bb74-0739ab8b0d4e" data-file-name="components/order-data-processor.tsx">
                Create Emails
              </span></button>
              
              <button onClick={exportProcessedData} className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="249cb5fb-50b8-4b07-b9f2-5ed3cf3b0b0c" data-file-name="components/order-data-processor.tsx">
                <DownloadIcon className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="674ee853-88d5-43fc-9554-951c1900ba9d" data-file-name="components/order-data-processor.tsx">
                Export Data
              </span></button>
              
              <button onClick={cleanAllOrders} className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors" data-unique-id="a7ea210f-3a95-471a-9347-55a1a4081c64" data-file-name="components/order-data-processor.tsx">
                <Trash2 className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="9179fe65-f13c-4f15-b507-2832b3a0c53f" data-file-name="components/order-data-processor.tsx">
                Clean All
              </span></button>
            </div>
          </div>

          {/* Search by Order Number */}
          <div className="mb-6 relative" data-unique-id="e86108fb-67f5-42d3-94b1-13d3ab27e8b4" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
            <div className="relative" data-unique-id="ddcb6945-2509-4e9c-a1d3-4201b35496f9" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by order number..." className="pl-10 pr-4 py-2 w-full border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" data-unique-id="e395e48f-bec7-47ac-ab31-fbef50259384" data-file-name="components/order-data-processor.tsx" />
              {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground" data-unique-id="54651787-8a2f-43af-bc49-9497a6003814" data-file-name="components/order-data-processor.tsx">
                  <X className="h-4 w-4" />
                </button>}
            </div>
            {searchQuery && <div className="mt-2 text-sm text-muted-foreground" data-unique-id="20ccafc6-715f-49f4-81bc-29b01f0de188" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="e311aaf2-6b52-4871-aea8-f33b4fe8553c" data-file-name="components/order-data-processor.tsx">
                Found </span>{filteredData.length}<span className="editable-text" data-unique-id="46c77e5b-2502-49fa-b87c-34d7c258854b" data-file-name="components/order-data-processor.tsx"> orders matching "</span>{searchQuery}<span className="editable-text" data-unique-id="c77da44c-2de8-4036-9a14-94722932f439" data-file-name="components/order-data-processor.tsx">"
              </span></div>}
          </div>
          
          {/* Display Table */}
          <div className="bg-card rounded-lg border border-border shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl" data-unique-id="a5871717-df9f-4d04-b7f5-2e480b0f84de" data-file-name="components/order-data-processor.tsx">
            <DataTable data={filteredData} onRowClick={showCustomerDetails} actionColumn={row => <div className="flex space-x-1" data-unique-id="aac7dec7-7704-46e7-be97-2319ebf9d279" data-file-name="components/order-data-processor.tsx">
                  <button onClick={() => showCustomerDetails(row)} className="p-2 rounded-full hover:bg-accent/20" title="View Customer Details" data-unique-id="2fa4d390-a782-450f-8f51-5ed3cf3d82a4" data-file-name="components/order-data-processor.tsx">
                    <Eye className="h-4 w-4 text-primary" />
                  </button>
                  <button onClick={e => {
            e.stopPropagation();
            openOrderInShipStation(row.customerOrderNumber);
          }} className="p-2 rounded-full hover:bg-accent/20" title="Open in ShipStation" data-unique-id="f77575c4-246a-4123-ba8b-d984d82fe846" data-file-name="components/order-data-processor.tsx">
                    <ExternalLink className="h-4 w-4 text-blue-500" />
                  </button>
                  <button onClick={e => {
            e.stopPropagation();
            copyOrderNumber(row.customerOrderNumber);
          }} className="p-2 rounded-full hover:bg-accent/20" title="Copy order number" data-unique-id="61ac69ab-8938-4234-9d22-7165d158e983" data-file-name="components/order-data-processor.tsx">
                    <Copy className="h-4 w-4 text-gray-600" />
                  </button>
                  <button onClick={e => {
            e.stopPropagation();
            removeOrder(row);
          }} className="p-2 rounded-full hover:bg-red-100 transition-colors" title="Remove order" data-unique-id="f22eda83-28ac-489b-88e6-10820a22838a" data-file-name="components/order-data-processor.tsx">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>} renderCell={(key, value, row) => {
          // Make tracking numbers clickable
          if (key === 'trackingNumbers' && Array.isArray(value)) {
            return <div className="space-y-1" data-unique-id="ab120270-9bee-468c-acaf-0a7ebffc3963" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                    {value.map((num, idx) => <a key={idx} href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${num}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:underline" data-unique-id="737e2726-49cc-434e-8031-087228522ff9" data-file-name="components/order-data-processor.tsx">
                      <span className="mr-1" data-unique-id="49e98f06-35fb-4a05-81ba-960f4e12e20b" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{num.length > 15 ? `${num.slice(0, 15)}...` : num}</span>
                      <ExternalLink className="h-3 w-3" data-unique-id="6d1d3000-af71-4174-82ed-735fc4bd5b3c" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                    </a>)}
                  </div>;
          }

          // Make order number clickable
          if (key === 'customerOrderNumber') {
            const orderLink = `https://ship.shipstation.com/orders/awaiting-shipment/order/${row.id || 'unknown'}/active/${value}`;
            return <a href={orderLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" onClick={e => e.stopPropagation()} data-unique-id="8902701d-0359-482b-b22b-5b495259a401" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                      {value}
                    </a>;
          }
          return null; // Use default rendering for other cells
        }} />
          </div>
          
          {/* Warning about filtered data */}
          {processingStats.filtered > 0 && <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md" data-unique-id="b0fed035-5a82-45dc-b900-74b9bb2b6590" data-file-name="components/order-data-processor.tsx">
              <div className="flex items-center" data-unique-id="edc04a5c-847f-41ef-aa14-42f89b78d006" data-file-name="components/order-data-processor.tsx">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-yellow-800 font-medium" data-unique-id="507fa294-9665-4f08-afc5-232ea6313a79" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="a2a248a5-bb57-4c4e-a85e-d2a6bac9f28a" data-file-name="components/order-data-processor.tsx">Some entries were filtered out</span></p>
              </div>
              <p className="text-sm text-yellow-700 mt-1" data-unique-id="61ebf184-615c-4d4d-909b-5a1ce46aff56" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                {processingStats.filtered}<span className="editable-text" data-unique-id="9d5ca794-cb47-4031-9b49-a481a29350f8" data-file-name="components/order-data-processor.tsx"> entries were filtered out because they didn't meet the requirements
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
      }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)} data-unique-id="60ff0d73-c248-4311-827b-a40fded24ac0" data-file-name="components/order-data-processor.tsx">
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
        }} className="bg-card rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="f8c74a25-2f8a-48a2-943e-3832ff372faf" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
              {/* Header */}
              <div className="bg-primary text-white p-6" data-unique-id="81133fea-6301-44ed-8785-f6e887941a3c" data-file-name="components/order-data-processor.tsx">
                <div className="flex justify-between items-start" data-unique-id="a3eb14ee-7831-4d46-9e47-faf6b613334c" data-file-name="components/order-data-processor.tsx">
                  <div data-unique-id="1f44f4a1-43ad-4169-8a9e-f88b4852724e" data-file-name="components/order-data-processor.tsx">
                    <div className="flex items-center" data-unique-id="3ea8b032-27cf-47c8-82bb-9490398e3bc5" data-file-name="components/order-data-processor.tsx">
                      <h2 className="text-xl font-semibold" data-unique-id="53e559cb-a1db-45a8-b599-c42dd21183f2" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="da2fac07-c4fe-4638-a393-de4e77f70763" data-file-name="components/order-data-processor.tsx">Customer Order #</span>{selectedOrder.customerOrderNumber}</h2>
                      <button onClick={() => copyOrderNumber(selectedOrder.customerOrderNumber)} className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors" title="Copy order number" data-unique-id="aea13f7a-9c9a-4aef-a437-50784ac29b17" data-file-name="components/order-data-processor.tsx">
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-primary-foreground/80 mt-1" data-unique-id="d871a46c-d4b6-4aae-b5ed-aa9ef3bab051" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="834979da-2746-40b4-b5a6-0fab58c289a0" data-file-name="components/order-data-processor.tsx">Shipped on </span>{new Date(selectedOrder.actualShipDate).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="text-white hover:bg-white/10 rounded-full p-2 transition-colors" data-unique-id="e1383e72-2957-439f-86d5-1ca265e76057" data-file-name="components/order-data-processor.tsx">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto" data-unique-id="06213b4c-aa70-4a4a-9215-03d4e1af7dd4" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="d7bd3b8f-d042-4a71-aec1-82c145f08cac" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                  {/* Customer Information */}
                  <div className="space-y-4" data-unique-id="2049244f-74fe-4111-860d-6192f0185d36" data-file-name="components/order-data-processor.tsx">
                    <div className="flex items-start" data-unique-id="2045480a-653f-48eb-8be8-bd1d022692c4" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="c257998f-48aa-444b-a726-80c833581a51" data-file-name="components/order-data-processor.tsx">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="0e0e4120-0cde-42a7-b1d5-9e3ad307c3f9" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="b5ad3834-2050-47d6-96b5-9ca9c35e73dc" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="a81edc6d-58d2-487f-8b3a-af74fe44e0d1" data-file-name="components/order-data-processor.tsx">Customer Name</span></h3>
                        <p className="text-lg font-medium" data-unique-id="2b8a39c4-d918-473d-90d5-130c1097bab7" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start" data-unique-id="f6117d24-a5fd-4d8d-8d48-2f09ab69d7ac" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="da10de5c-5935-4d21-8992-10523de885a2" data-file-name="components/order-data-processor.tsx">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1" data-unique-id="1bebf2b6-d2ab-4f7c-b77f-a54204baa54e" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="b172e2f3-0554-48c8-bc07-b74ad662e325" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="703c8805-b258-4904-b813-4cd6bcf458c8" data-file-name="components/order-data-processor.tsx">Email Address</span></h3>
                        {isEditingEmail ? <div className="flex items-center mt-1" data-unique-id="946d0adb-e0ae-4fe6-9f45-320d07cfac23" data-file-name="components/order-data-processor.tsx">
                            <input type="email" value={tempEmail} onChange={e => setTempEmail(e.target.value)} className="flex-1 border border-border rounded-md px-2 py-1 text-sm" placeholder="Enter customer email" data-unique-id="d75094f3-1d5e-4a7b-aac4-3246069c5519" data-file-name="components/order-data-processor.tsx" />
                            <button onClick={saveCustomerEmail} className="ml-2 p-1 bg-primary text-white rounded-md" title="Save email" data-unique-id="213017ae-0969-431d-9999-864bf9e53bfd" data-file-name="components/order-data-processor.tsx">
                              <Save className="h-4 w-4" />
                            </button>
                            <button onClick={() => {
                        setIsEditingEmail(false);
                        setTempEmail(selectedOrder.shipToEmail || '');
                      }} className="ml-1 p-1 bg-secondary text-secondary-foreground rounded-md" title="Cancel" data-unique-id="eb1d3ef4-6ba5-49a7-8042-79267a27999e" data-file-name="components/order-data-processor.tsx">
                              <X className="h-4 w-4" />
                            </button>
                          </div> : <div className="flex items-center" data-unique-id="e91d9a46-e9e4-4d94-9126-928ab5e5e732" data-file-name="components/order-data-processor.tsx">
                            <p className="text-lg" data-unique-id="3aa54e29-2754-40f9-879d-12d0afa98d9d" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToEmail || 'No email provided'}</p>
                            <button onClick={() => setIsEditingEmail(true)} className="ml-2 p-1 hover:bg-accent/20 rounded-md" title="Edit email" data-unique-id="2a32cfaa-bee6-41a5-a08d-152886dee6b3" data-file-name="components/order-data-processor.tsx">
                              <Edit className="h-4 w-4 text-primary" />
                            </button>
                          </div>}
                      </div>
                    </div>
                    
                    <div className="flex items-start" data-unique-id="a625fdc5-b9ed-4f5a-bade-23cbcd82e7ec" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="4871a732-5dd3-4282-815d-670d426a5a4b" data-file-name="components/order-data-processor.tsx">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="11ab0ccd-bfc0-49be-8c6d-c493ebe7d197" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="19530a45-1af0-4dc7-83b4-5209240b7cbb" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="e43cae6e-2498-415c-8a52-a07f166655e9" data-file-name="components/order-data-processor.tsx">Phone Number</span></h3>
                        <p className="text-lg" data-unique-id="fef7c7e8-74ea-46ef-a6dc-b574a234acb1" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToPhone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Information */}
                  <div className="space-y-4" data-unique-id="bba43033-1aa2-4ea6-96bd-ea6a0582738d" data-file-name="components/order-data-processor.tsx">
                    <div className="flex items-start" data-unique-id="48ef90f8-687f-4ef2-8c2d-8617af587881" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="07d6b9ec-ffcd-46ec-807c-edd47ce21eae" data-file-name="components/order-data-processor.tsx">
                        <Home className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="126318d6-4522-4df1-9803-5afb82a84618" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="bedf2d7e-c364-4e6f-aaf3-4b81b75626b8" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="f408be5a-1db0-40fa-ae9a-e52d211c8772" data-file-name="components/order-data-processor.tsx">Shipping Address</span></h3>
                        <p className="text-lg" data-unique-id="0ada08b5-a71c-4cce-9396-cc5fdadfa785" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToLine1}</p>
                        <p className="text-lg" data-unique-id="7ce4bc54-5c40-415f-86cc-f8965e6c8103" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToCity}<span className="editable-text" data-unique-id="d7e1eba6-6464-42b7-87cb-5c26b2105f4f" data-file-name="components/order-data-processor.tsx">, </span>{selectedOrder.shipToStateProvince} {selectedOrder.shipToPostalCode}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start" data-unique-id="13c96eb1-0b41-42d3-8617-b608f7f8af30" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="af739178-aeb1-4553-8cc4-6d199a683b11" data-file-name="components/order-data-processor.tsx">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="53a274c9-596e-4a67-b8d9-e024141ab32f" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="d14a1ba1-324b-4b0c-b74f-442e340dc82e" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="2eba4ea1-282e-4e91-9ba6-01b6c27ce26d" data-file-name="components/order-data-processor.tsx">Order Total</span></h3>
                        <p className="text-lg font-medium" data-unique-id="3e35fc11-3ce6-4a52-985a-7428d55bb241" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="46fae381-9b72-410a-b371-277b48532aab" data-file-name="components/order-data-processor.tsx">$</span>{selectedOrder.orderTotal.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start" data-unique-id="ca3083b2-ae8c-4cd1-bd2d-91d54549ec45" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="235fbdb1-cb61-42e3-a2f7-41d3bffebac5" data-file-name="components/order-data-processor.tsx">
                        <Info className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="c35bba2c-0663-419b-88ff-c299b6226755" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="f8b65c31-512c-4493-a353-f1c866c92ea7" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="a02c9284-7de0-4f74-a04e-d1afd361caf5" data-file-name="components/order-data-processor.tsx">Order Source</span></h3>
                        <p className="text-lg" data-unique-id="60e30002-7347-44d9-b951-d34d551be92e" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.orderSource || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracking Information */}
                <div className="mt-6 pt-6 border-t border-border" data-unique-id="1125c757-f328-4b8a-93b4-b68e55f3b562" data-file-name="components/order-data-processor.tsx">
                  <h3 className="text-lg font-medium mb-4" data-unique-id="5eee64ab-877b-4da0-b813-a07bb19e02ac" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="6d12d16c-99d3-4f57-bb42-34e364d3c32a" data-file-name="components/order-data-processor.tsx">Tracking Information</span></h3>
                  <div className="space-y-3" data-unique-id="96e4a230-600a-4d3a-a0af-10346b41aa37" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                    {selectedOrder.trackingNumbers.map((number, index) => <div key={index} className="flex items-center p-3 bg-accent/10 rounded-md" data-unique-id="bcf32a3a-9081-4adb-a3e7-303615a7a027" data-file-name="components/order-data-processor.tsx">
                        <MapPin className="h-5 w-5 text-primary mr-3" data-unique-id="a63717ff-b628-4f70-8f10-cf7c2a984627" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                        <span className="font-medium mr-2" data-unique-id="5a7d6950-9bcf-4236-abd2-adb36052955a" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="fa12f71c-2c56-4a48-aedb-e1bd0dfd9dc2" data-file-name="components/order-data-processor.tsx">Tracking #</span>{index + 1}<span className="editable-text" data-unique-id="502b5b20-4ca9-4367-aa63-c8876853f828" data-file-name="components/order-data-processor.tsx">:</span></span>
                        <div className="flex items-center flex-wrap" data-unique-id="47a9fbd0-1955-49a0-9edc-d12d990be2dc" data-file-name="components/order-data-processor.tsx">
                          <a href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${number}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center" data-unique-id="3da67169-5dde-44f0-b70b-1b0fe5aedce4" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                            {number}
                            <ExternalLink className="ml-1 h-4 w-4" data-unique-id="ed6b90dd-76e7-40a4-9e53-67492dc76a6f" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                          </a>
                          <button onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(number).then(() => toast.success('Tracking number copied!')).catch(err => console.error('Failed to copy tracking number:', err));
                      }
                    }} className="ml-2 p-1 rounded-full hover:bg-accent/20 transition-colors" title="Copy tracking number" data-unique-id="8da69528-b17a-4aa3-aae7-b331595d4816" data-file-name="components/order-data-processor.tsx">
                            <Copy className="h-4 w-4 text-primary" data-unique-id="9eefa331-bf6b-4f3b-9fb9-b5ae2533302b" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                          </button>
                          <button onClick={() => {
                      const trackingUrl = `https://www.fedex.com/apps/fedextrack/?tracknumbers=${number}`;
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(trackingUrl).then(() => toast.success('Tracking link copied!')).catch(err => console.error('Failed to copy tracking link:', err));
                      }
                    }} className="ml-1 p-1 rounded-full hover:bg-accent/20 transition-colors" title="Copy FedEx link" data-unique-id="562eddf0-4067-4efb-b547-656a8bf6f6a3" data-file-name="components/order-data-processor.tsx">
                            <svg className="h-4 w-4 text-[#4D148C]" viewBox="0 0 24 24" fill="currentColor" data-unique-id="e3b631c0-a2f6-4454-bcb0-f7cfd3ce9b4a" data-file-name="components/order-data-processor.tsx">
                              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 5a3 3 0 11-3 3 3 3 0 013-3zm0 11.13c-2.03-.31-3.88-1.47-5.14-3.13h10.28c-1.26 1.66-3.11 2.82-5.14 3.13z" data-unique-id="7fbe712a-0b20-462c-9ffa-d5e048b5a5a2" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                            </svg>
                          </button>
                        </div>
                      </div>)}
                    {selectedOrder.trackingNumbers.length === 0 && <p className="text-muted-foreground italic" data-unique-id="91d1abf4-1163-4309-a58b-0c7a14df3d71" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="c66587ba-2c3f-4975-9c29-caf3633db773" data-file-name="components/order-data-processor.tsx">No tracking numbers available</span></p>}
                  </div>
                </div>

                {/* Order Summary */}
                {selectedOrder.orderSummary && <div className="mt-6 pt-6 border-t border-border" data-unique-id="0ba67a55-0150-46bb-af82-6afc409fa4fe" data-file-name="components/order-data-processor.tsx">
                    <h3 className="text-lg font-medium mb-2" data-unique-id="a34d0f12-0f76-43e5-a1b0-cd1a1f8d0f9a" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="5844d360-6899-45ee-a292-6b6366140af9" data-file-name="components/order-data-processor.tsx">Order Summary</span></h3>
                    <div className="p-4 bg-accent/10 rounded-md" data-unique-id="603434ea-c787-45f5-92f2-f698f4365be2" data-file-name="components/order-data-processor.tsx">
                      <p data-unique-id="40513f48-ed03-4d98-945c-ba97250bf5ba" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.orderSummary}</p>
                    </div>
                  </div>}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border bg-muted/30 flex justify-end" data-unique-id="b667ba6d-075e-477b-be0f-5a4562915a80" data-file-name="components/order-data-processor.tsx">
                <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="bfcce24f-4a67-4896-bd7e-1a619899b57b" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="9f52e62f-7d5b-4f8d-82fb-385b497889d4" data-file-name="components/order-data-processor.tsx">
                  Close
                </span></button>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
    </motion.div>;
}