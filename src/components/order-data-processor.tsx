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
  }} className="max-w-7xl mx-auto" data-unique-id="c7913103-1d81-4f66-9af2-0ad7bb72cd7d" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
      <Toaster position="top-center" toastOptions={{
      duration: 3000
    }} />
      
      <div className="mb-8" data-unique-id="44488805-7387-4ed3-93c7-48036879557d" data-file-name="components/order-data-processor.tsx">
        <h1 className="text-3xl font-bold text-primary mb-2" data-unique-id="c163a39e-3b1d-47cf-873a-54e94afdfcf1" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="d3da4b3a-d092-4b5b-ba33-4f85cb096e13" data-file-name="components/order-data-processor.tsx">
          Order Data Processor
        </span></h1>
        <p className="text-muted-foreground" data-unique-id="ca8ab3ec-8774-4f10-acb4-acb2b218741b" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="3a11e47e-b14b-45d8-b224-0c741f14f3b5" data-file-name="components/order-data-processor.tsx">
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
    }} className="mt-8" data-unique-id="11a1479d-c1a8-45a0-9896-d8047321d798" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
          <div className="flex justify-between items-center mb-6" data-unique-id="b325ef19-f87b-45de-b457-df2fcc895228" data-file-name="components/order-data-processor.tsx">
            <div data-unique-id="7f6c3021-1f70-48a2-8adc-b316656c8182" data-file-name="components/order-data-processor.tsx">
              <h2 className="text-xl font-semibold flex items-center" data-unique-id="dd2c148a-520e-4264-9275-5376ed42ce42" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                <FileSpreadsheet className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="4a375f99-795c-495c-bae8-e0108b40f0c8" data-file-name="components/order-data-processor.tsx">
                Processed Orders (</span>{data.length}<span className="editable-text" data-unique-id="bcb2d9c8-72aa-43a1-86cb-45725c08d22a" data-file-name="components/order-data-processor.tsx">)
              </span></h2>
              
              <div className="mt-2 flex flex-wrap gap-3" data-unique-id="558ad27b-262d-41e2-816c-907472a73b24" data-file-name="components/order-data-processor.tsx">
                <div className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full" data-unique-id="724175e0-7cc6-4a4a-8ae9-a14332a2e321" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="4c6dcddd-979d-49c0-b41f-f64d0b85eeaf" data-file-name="components/order-data-processor.tsx">
                  Total: </span>{processingStats.total}
                </div>
                <div className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full" data-unique-id="2f70bb7f-47ae-4668-8ca6-1dd5e7ca5c5f" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="5fc114bd-c7f4-4221-82c6-352269daecb3" data-file-name="components/order-data-processor.tsx">
                  Processed: </span>{processingStats.processed}
                </div>
                <div className="text-sm bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full" data-unique-id="b257d64a-c548-43e4-852c-803b8e98df22" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="5d3f20d5-1dd0-459b-be4f-269a352e8e5d" data-file-name="components/order-data-processor.tsx">
                  Filtered: </span>{processingStats.filtered}
                </div>
                <div className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded-full" data-unique-id="3adec833-1595-49a7-add0-3c2377388a11" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="54c6b7fa-f24e-4fc8-b491-1b610cb3b3c6" data-file-name="components/order-data-processor.tsx">
                  Invalid: </span>{processingStats.invalid}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3" data-unique-id="e06bbd9e-fcea-4ef1-ac9f-519996afd1af" data-file-name="components/order-data-processor.tsx">
              <button onClick={sendEmailsToCustomers} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="df9aeb6d-30ac-4fae-9c38-c0724ec36a90" data-file-name="components/order-data-processor.tsx">
                <Mail className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="20911e59-cb53-4004-8507-4ec54863cfa8" data-file-name="components/order-data-processor.tsx">
                Create Emails
              </span></button>
              
              <button onClick={exportProcessedData} className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="b50fcca9-cc04-4d01-96ea-7c2763f8d9dc" data-file-name="components/order-data-processor.tsx">
                <DownloadIcon className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="1396ddba-8b92-4528-ad1b-5eaf6bc49a70" data-file-name="components/order-data-processor.tsx">
                Export Data
              </span></button>
              
              <button onClick={cleanAllOrders} className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors" data-unique-id="e4afcf36-0fc9-46ef-89fd-3d3f49e4e030" data-file-name="components/order-data-processor.tsx">
                <Trash2 className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="56bfb0c8-d301-4572-866a-eb458f70b56f" data-file-name="components/order-data-processor.tsx">
                Clean All
              </span></button>
            </div>
          </div>

          {/* Search by Order Number */}
          <div className="mb-6 relative" data-unique-id="2527ab1c-8260-4f1f-853c-e7733c72a484" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
            <div className="relative" data-unique-id="3cb0da48-68ff-4e8c-a7de-2df228b12d59" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by order number..." className="pl-10 pr-4 py-2 w-full border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" data-unique-id="9c9df555-d157-4910-91ec-84b03237363c" data-file-name="components/order-data-processor.tsx" />
              {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground" data-unique-id="0e52b94d-a0df-4f4f-80fc-e9c50fce23a1" data-file-name="components/order-data-processor.tsx">
                  <X className="h-4 w-4" />
                </button>}
            </div>
            {searchQuery && <div className="mt-2 text-sm text-muted-foreground" data-unique-id="4a86b3f8-8c42-43ec-82bf-d2d3396ea9c6" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="75309636-91eb-4db3-af00-b66a586d6b10" data-file-name="components/order-data-processor.tsx">
                Found </span>{filteredData.length}<span className="editable-text" data-unique-id="ea94015a-f2cc-4d18-aae2-ed669bfd8bf9" data-file-name="components/order-data-processor.tsx"> orders matching "</span>{searchQuery}<span className="editable-text" data-unique-id="ae95a280-a17e-42b1-92f3-c78228496f49" data-file-name="components/order-data-processor.tsx">"
              </span></div>}
          </div>
          
          {/* Display Table */}
          <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden" data-unique-id="2643947c-689b-4104-b07b-4156c1329f91" data-file-name="components/order-data-processor.tsx">
            <DataTable data={filteredData} onRowClick={showCustomerDetails} actionColumn={row => <div className="flex space-x-1" data-unique-id="e5520c02-5c19-4b84-9e79-62b936116d94" data-file-name="components/order-data-processor.tsx">
                  <button onClick={() => showCustomerDetails(row)} className="p-2 rounded-full hover:bg-accent/20" title="View Customer Details" data-unique-id="945702c1-2e86-4605-beb4-ac6e334a0d0f" data-file-name="components/order-data-processor.tsx">
                    <Eye className="h-4 w-4 text-primary" />
                  </button>
                  <button onClick={e => {
            e.stopPropagation();
            openOrderInShipStation(row.customerOrderNumber);
          }} className="p-2 rounded-full hover:bg-accent/20" title="Open in ShipStation" data-unique-id="661a5c57-68d7-4166-bd4f-41208d479561" data-file-name="components/order-data-processor.tsx">
                    <ExternalLink className="h-4 w-4 text-blue-500" />
                  </button>
                  <button onClick={e => {
            e.stopPropagation();
            copyOrderNumber(row.customerOrderNumber);
          }} className="p-2 rounded-full hover:bg-accent/20" title="Copy order number" data-unique-id="925cba9d-8174-47ef-bd6d-6c57ef5d6c4f" data-file-name="components/order-data-processor.tsx">
                    <Copy className="h-4 w-4 text-gray-600" />
                  </button>
                </div>} renderCell={(key, value, row) => {
          // Make tracking numbers clickable
          if (key === 'trackingNumbers' && Array.isArray(value)) {
            return <div className="space-y-1" data-unique-id="565bebab-19f7-41b0-85e1-cf707eaa75b7" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                    {value.map((num, idx) => <a key={idx} href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${num}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:underline" data-unique-id="204bc3af-9979-4e90-a0f0-00d5f2d941cd" data-file-name="components/order-data-processor.tsx">
                      <span className="mr-1" data-unique-id="aa170c50-a021-40df-86ed-fd6cf6d621a4" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{num.length > 15 ? `${num.slice(0, 15)}...` : num}</span>
                      <ExternalLink className="h-3 w-3" data-unique-id="26511c34-5d10-4892-8724-a9ede3054de2" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                    </a>)}
                  </div>;
          }

          // Make order number clickable
          if (key === 'customerOrderNumber') {
            const orderLink = `https://ship.shipstation.com/orders/awaiting-shipment/order/${row.id || 'unknown'}/active/${value}`;
            return <a href={orderLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" onClick={e => e.stopPropagation()} data-unique-id="3d051623-744d-4867-ab4d-290b35127fde" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                      {value}
                    </a>;
          }
          return null; // Use default rendering for other cells
        }} />
          </div>
          
          {/* Warning about filtered data */}
          {processingStats.filtered > 0 && <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md" data-unique-id="b03b28e2-a7a6-4d8e-8a8f-856ff9dc1c38" data-file-name="components/order-data-processor.tsx">
              <div className="flex items-center" data-unique-id="d55d7bf8-e9a8-4bd6-8bfa-172225c2cf0f" data-file-name="components/order-data-processor.tsx">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-yellow-800 font-medium" data-unique-id="58c2516a-933e-496b-ba73-559f79848afe" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="7d6703fe-f29a-47fe-a381-8cf28b1fad51" data-file-name="components/order-data-processor.tsx">Some entries were filtered out</span></p>
              </div>
              <p className="text-sm text-yellow-700 mt-1" data-unique-id="6bef86a1-f236-4377-bacd-884eea488b27" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                {processingStats.filtered}<span className="editable-text" data-unique-id="f3315684-93aa-4fb5-922a-32a6777a4032" data-file-name="components/order-data-processor.tsx"> entries were filtered out because they didn't meet the requirements
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
      }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)} data-unique-id="d2fb17ea-19dc-420e-af0c-49f072c22bca" data-file-name="components/order-data-processor.tsx">
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
        }} className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="22addd6c-7f1d-44bc-9425-a16b8e4bc816" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
              {/* Header */}
              <div className="bg-primary text-white p-6" data-unique-id="59ede161-1273-4e5d-8f20-dc2fe0f9d1b6" data-file-name="components/order-data-processor.tsx">
                <div className="flex justify-between items-start" data-unique-id="97407884-5dde-438a-a8da-f709c0869983" data-file-name="components/order-data-processor.tsx">
                  <div data-unique-id="f48daf6a-3571-4631-9036-934367ccaa15" data-file-name="components/order-data-processor.tsx">
                    <div className="flex items-center" data-unique-id="9190b352-c19a-4994-b9d5-6c6e832466a2" data-file-name="components/order-data-processor.tsx">
                      <h2 className="text-xl font-semibold" data-unique-id="97d3d4b6-c7a0-4ab4-bb71-3356da4ab34d" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="8d3b9218-8799-4fa8-ba01-017c8fb3823f" data-file-name="components/order-data-processor.tsx">Customer Order #</span>{selectedOrder.customerOrderNumber}</h2>
                      <button onClick={() => copyOrderNumber(selectedOrder.customerOrderNumber)} className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors" title="Copy order number" data-unique-id="a059e20f-79dc-42f2-9be5-95d170c33819" data-file-name="components/order-data-processor.tsx">
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-primary-foreground/80 mt-1" data-unique-id="429b4479-931e-4852-863c-a9ea4c36b8b3" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="deccb881-02c4-43bb-bb3e-4b2d3c5df74c" data-file-name="components/order-data-processor.tsx">Shipped on </span>{new Date(selectedOrder.actualShipDate).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="text-white hover:bg-white/10 rounded-full p-2 transition-colors" data-unique-id="da8853bb-f056-43df-8ed5-9c530d394fc9" data-file-name="components/order-data-processor.tsx">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto" data-unique-id="1db42eda-7f21-4f3b-b140-579ce8782308" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="fe62480e-2121-4fe9-9633-5ed8ca16f736" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                  {/* Customer Information */}
                  <div className="space-y-4" data-unique-id="a57932ad-4c5d-436a-92b3-39402baa1937" data-file-name="components/order-data-processor.tsx">
                    <div className="flex items-start" data-unique-id="d51571be-d097-4f93-95cc-1ad177278a61" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="7d9c2324-4c1b-40c2-a044-32c37d3e187a" data-file-name="components/order-data-processor.tsx">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="20ef9654-f3c2-4e32-a1f2-d63742c45c55" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="7ff812bd-b66d-4151-a211-6e1542e24e34" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="6ca75ca7-8fbe-4851-bc8b-e7d885e5aec0" data-file-name="components/order-data-processor.tsx">Customer Name</span></h3>
                        <p className="text-lg font-medium" data-unique-id="f5624cbd-bc5d-4080-88f5-683b17b9192c" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start" data-unique-id="b7f882fb-a602-46dd-a811-9270e9c0a120" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="7e96d42c-ff4a-47c5-b8c1-85feed7a613f" data-file-name="components/order-data-processor.tsx">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1" data-unique-id="7567f94c-15c7-4369-9ac2-f1d06e2123b4" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="b085601d-edc0-4606-b0d0-7c994682717f" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="4d2a0e77-5c14-44e6-875c-7657391448ae" data-file-name="components/order-data-processor.tsx">Email Address</span></h3>
                        {isEditingEmail ? <div className="flex items-center mt-1" data-unique-id="5d88551e-9491-4ac0-aa1b-ca1f8270a255" data-file-name="components/order-data-processor.tsx">
                            <input type="email" value={tempEmail} onChange={e => setTempEmail(e.target.value)} className="flex-1 border border-border rounded-md px-2 py-1 text-sm" placeholder="Enter customer email" data-unique-id="6fae4217-38e3-4e5e-8bd5-bd2c90a6c294" data-file-name="components/order-data-processor.tsx" />
                            <button onClick={saveCustomerEmail} className="ml-2 p-1 bg-primary text-white rounded-md" title="Save email" data-unique-id="cf331dff-3531-4c4b-aa1c-67fa5dbacf97" data-file-name="components/order-data-processor.tsx">
                              <Save className="h-4 w-4" />
                            </button>
                            <button onClick={() => {
                        setIsEditingEmail(false);
                        setTempEmail(selectedOrder.shipToEmail || '');
                      }} className="ml-1 p-1 bg-secondary text-secondary-foreground rounded-md" title="Cancel" data-unique-id="7877b3a6-5a1d-4690-a0a1-1c8e22fdb90f" data-file-name="components/order-data-processor.tsx">
                              <X className="h-4 w-4" />
                            </button>
                          </div> : <div className="flex items-center" data-unique-id="0b00f54c-12d2-4fe9-aa22-7e905d433382" data-file-name="components/order-data-processor.tsx">
                            <p className="text-lg" data-unique-id="1415c473-27dc-456b-8f54-42de41404ab1" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToEmail || 'No email provided'}</p>
                            <button onClick={() => setIsEditingEmail(true)} className="ml-2 p-1 hover:bg-accent/20 rounded-md" title="Edit email" data-unique-id="585bc1a7-a525-4f64-a8f1-45a0e6b1b587" data-file-name="components/order-data-processor.tsx">
                              <Edit className="h-4 w-4 text-primary" />
                            </button>
                          </div>}
                      </div>
                    </div>
                    
                    <div className="flex items-start" data-unique-id="85f49122-f2f3-472f-9ec2-835ff9df0ee2" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="2e745c1a-b33c-4897-8cb0-f951257897d6" data-file-name="components/order-data-processor.tsx">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="b6930950-bd46-4202-9024-bd9e2fb7003b" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="977b0cc1-128a-4096-9afd-d6849eebb380" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="0bb0a951-59f7-4006-befd-e35def8a576d" data-file-name="components/order-data-processor.tsx">Phone Number</span></h3>
                        <p className="text-lg" data-unique-id="e7afd328-c67f-443f-9e0a-412612675814" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToPhone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Information */}
                  <div className="space-y-4" data-unique-id="31f550db-836c-4014-bc21-754ac11e0ca1" data-file-name="components/order-data-processor.tsx">
                    <div className="flex items-start" data-unique-id="f010f378-f536-48e1-bf8c-8c9186e39dc8" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="41df27af-6d4f-4f51-ab9b-d2f1279d2685" data-file-name="components/order-data-processor.tsx">
                        <Home className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="76eec0e2-f5d7-4eaa-a135-f3fd617574c3" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="457322cf-cd26-4638-bc0a-0cc714001c48" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="4a5b20ba-253c-4a13-9bf5-5a60751190b4" data-file-name="components/order-data-processor.tsx">Shipping Address</span></h3>
                        <p className="text-lg" data-unique-id="72b6bf75-67b7-480e-9df6-f6e6f738359b" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToLine1}</p>
                        <p className="text-lg" data-unique-id="aabc6556-5044-41c6-b066-fef37965f584" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToCity}<span className="editable-text" data-unique-id="47e004ec-de62-4cea-b38d-30b0849e535e" data-file-name="components/order-data-processor.tsx">, </span>{selectedOrder.shipToStateProvince} {selectedOrder.shipToPostalCode}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start" data-unique-id="b53256fe-5325-4e32-abb9-7ebbe13371d5" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="dbb8eeb3-10fc-45c3-8d43-335bbde6701a" data-file-name="components/order-data-processor.tsx">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="2f173e64-6e54-41de-9ccc-7c7a6b54d199" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="b9e2c86c-9ef8-45b0-afd8-ece129307374" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="c3122c0b-76a7-4f41-9cee-62dd19675032" data-file-name="components/order-data-processor.tsx">Order Total</span></h3>
                        <p className="text-lg font-medium" data-unique-id="1d224c0f-887c-454f-bc74-89a3c9d45f25" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="15926cfb-639f-4dd0-9fad-557e30656b4f" data-file-name="components/order-data-processor.tsx">$</span>{selectedOrder.orderTotal.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start" data-unique-id="cd366221-56ed-4e30-97ba-7ee12b6a5795" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="7cd4fd25-98ec-4c62-b2da-8cf777701e6f" data-file-name="components/order-data-processor.tsx">
                        <Info className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="cb770b84-db54-4a2e-ac29-850ebde424a0" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="7d0eac13-fd4c-479a-845d-d130b3fc17ad" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="c068b24d-c8c1-4916-a9f4-5ff3b7582f9e" data-file-name="components/order-data-processor.tsx">Order Source</span></h3>
                        <p className="text-lg" data-unique-id="f483f78e-700d-4f70-ab3b-46eed4de3c35" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.orderSource || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracking Information */}
                <div className="mt-6 pt-6 border-t border-border" data-unique-id="e2fb0447-e027-4294-90bd-f35a6e90ff17" data-file-name="components/order-data-processor.tsx">
                  <h3 className="text-lg font-medium mb-4" data-unique-id="0fb3232e-aeb1-4ad9-8280-caebe56d4166" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="6d2cb55c-5c04-4ab1-8709-cc2587886216" data-file-name="components/order-data-processor.tsx">Tracking Information</span></h3>
                  <div className="space-y-3" data-unique-id="7dc7a310-4cde-4078-aa14-d4369872c45a" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                    {selectedOrder.trackingNumbers.map((number, index) => <div key={index} className="flex items-center p-3 bg-accent/10 rounded-md" data-unique-id="d17aa9fc-0d1a-4f08-b42f-bea53b7a4f8e" data-file-name="components/order-data-processor.tsx">
                        <MapPin className="h-5 w-5 text-primary mr-3" data-unique-id="00fcd9fb-37db-4a1c-add8-8b825bae52c6" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                        <span className="font-medium mr-2" data-unique-id="a9028472-3ccc-4e82-9e95-8b6618e59f81" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="be230dd5-ca46-4b7e-9d2c-448a52c2caf7" data-file-name="components/order-data-processor.tsx">Tracking #</span>{index + 1}<span className="editable-text" data-unique-id="cde62017-09aa-4436-a490-97d7b8697f3d" data-file-name="components/order-data-processor.tsx">:</span></span>
                        <div className="flex items-center flex-wrap" data-unique-id="e6293a2f-2361-4608-8a1f-97d6bdf27328" data-file-name="components/order-data-processor.tsx">
                          <a href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${number}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center" data-unique-id="fde0bdf4-133e-4db2-8b6a-e8ec7e53789f" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                            {number}
                            <ExternalLink className="ml-1 h-4 w-4" data-unique-id="f4f9e86b-eece-44cc-905a-689aa3de02a7" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                          </a>
                          <button onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(number).then(() => toast.success('Tracking number copied!')).catch(err => console.error('Failed to copy tracking number:', err));
                      }
                    }} className="ml-2 p-1 rounded-full hover:bg-accent/20 transition-colors" title="Copy tracking number" data-unique-id="fd39d53a-2b3a-4309-82d2-d83e8dd1bc86" data-file-name="components/order-data-processor.tsx">
                            <Copy className="h-4 w-4 text-primary" data-unique-id="32c0d615-34cc-4e13-9426-be588141ccff" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                          </button>
                          <button onClick={() => {
                      const trackingUrl = `https://www.fedex.com/apps/fedextrack/?tracknumbers=${number}`;
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(trackingUrl).then(() => toast.success('Tracking link copied!')).catch(err => console.error('Failed to copy tracking link:', err));
                      }
                    }} className="ml-1 p-1 rounded-full hover:bg-accent/20 transition-colors" title="Copy FedEx link" data-unique-id="ec622b3a-0a32-4860-a8a4-b1bcfc02e25f" data-file-name="components/order-data-processor.tsx">
                            <svg className="h-4 w-4 text-[#4D148C]" viewBox="0 0 24 24" fill="currentColor" data-unique-id="d50ba770-91a4-43e4-af4d-f57ef21716bd" data-file-name="components/order-data-processor.tsx">
                              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 5a3 3 0 11-3 3 3 3 0 013-3zm0 11.13c-2.03-.31-3.88-1.47-5.14-3.13h10.28c-1.26 1.66-3.11 2.82-5.14 3.13z" data-unique-id="b0acb294-b0d6-4951-bc6e-7fb99e0bb2a4" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                            </svg>
                          </button>
                        </div>
                      </div>)}
                    {selectedOrder.trackingNumbers.length === 0 && <p className="text-muted-foreground italic" data-unique-id="fa277d61-64a0-4630-920f-67a55112b9c9" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="3287d02e-7eb2-447a-9fb8-9fb657ade2e9" data-file-name="components/order-data-processor.tsx">No tracking numbers available</span></p>}
                  </div>
                </div>

                {/* Order Summary */}
                {selectedOrder.orderSummary && <div className="mt-6 pt-6 border-t border-border" data-unique-id="367c38dd-1c84-4771-acc0-f2d23d212994" data-file-name="components/order-data-processor.tsx">
                    <h3 className="text-lg font-medium mb-2" data-unique-id="71399eca-11bd-4968-8c49-cb7b68077c6f" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="a5a9ab05-8f96-4876-86b3-b66c56454cde" data-file-name="components/order-data-processor.tsx">Order Summary</span></h3>
                    <div className="p-4 bg-accent/10 rounded-md" data-unique-id="7f065239-7fc7-456c-ac70-0d38f9ef189e" data-file-name="components/order-data-processor.tsx">
                      <p data-unique-id="a0767981-45d7-49d7-a402-dff8bba64197" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.orderSummary}</p>
                    </div>
                  </div>}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border bg-muted/30 flex justify-end" data-unique-id="9f777209-6495-4e8f-a02a-08ddd392560b" data-file-name="components/order-data-processor.tsx">
                <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="8257f51e-3a55-48fd-a954-dcceb174bdca" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="9062f44e-6406-4e08-bd63-89443cf8ae59" data-file-name="components/order-data-processor.tsx">
                  Close
                </span></button>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
    </motion.div>;
}