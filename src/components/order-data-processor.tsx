'use client';
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUp, FileSpreadsheet, AlertCircle, DownloadIcon, Mail, Search, X, Eye, Edit, Save, ExternalLink, Phone, Home, Calendar, Package, MapPin, DollarSign, Info, Trash2, Copy, Archive } from 'lucide-react';
import * as XLSX from 'xlsx';
import ExcelArchivesManager from '@/components/excel-archives-manager';
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
  const [showArchives, setShowArchives] = useState(false);
  const [selectedArchive, setSelectedArchive] = useState<any>(null);
  const [currentFileName, setCurrentFileName] = useState<string>('');
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

  // Function to archive current Excel data
  const archiveCurrentExcel = useCallback(async () => {
    if (!rawData.length) {
      toast.error('No Excel data to archive');
      return;
    }
    try {
      // Show loading toast
      toast.loading('Archiving Excel data...', {
        id: 'archiving'
      });

      // Get the file information from state or use a default name
      const fileToArchive = {
        name: currentFileName || `order-data-${new Date().toISOString().slice(0, 10)}.xlsx`,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: new TextEncoder().encode(JSON.stringify(rawData)).length
      };

      // Convert data back to Excel format
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(rawData);
      XLSX.utils.book_append_sheet(wb, ws, 'Orders');
      const excelBuffer = XLSX.write(wb, {
        bookType: 'xlsx',
        type: 'array'
      });

      // Convert to base64 for storage
      const base64data = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + btoa([].reduce.call(new Uint8Array(excelBuffer), (p, c) => p + String.fromCharCode(c), ''));

      // Use the excelArchiveService to store the file
      try {
        const {
          excelArchiveService
        } = await import('@/lib/excel-archive-service');
        await excelArchiveService.archiveExcelFile(fileToArchive as File, base64data, {
          rowCount: rawData.length,
          description: `Order data archived on ${new Date().toLocaleString()}`,
          sheets: ['Orders']
        });
        toast.success('Excel data archived successfully to Supabase and local storage', {
          id: 'archiving'
        });
      } catch (err) {
        console.error('Error importing archive service:', err);
        toast.error('Failed to archive Excel data', {
          id: 'archiving'
        });
      }
    } catch (error) {
      console.error('Error archiving Excel data:', error);
      toast.error('Failed to archive Excel data', {
        id: 'archiving'
      });
    }
  }, [rawData, currentFileName]);

  // Function to process uploaded files
  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    // Store the filename for archive purposes
    setCurrentFileName(file.name);
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
  // Function to load data from an archived file
  const loadArchiveData = useCallback(async (archive: any) => {
    try {
      toast.loading('Loading archived data...', {
        id: 'loading-archive'
      });

      // Get the latest version of the archive (in case it's stored in Supabase)
      const {
        excelArchiveService
      } = await import('@/lib/excel-archive-service');
      const freshArchive = await excelArchiveService.getArchivedExcelFileById(archive.id);
      if (!freshArchive) {
        toast.error('Archive not found', {
          id: 'loading-archive'
        });
        return;
      }
      let binaryString: string;
      let bytes: Uint8Array;

      // Handle data based on format (URL or base64)
      if (freshArchive.data.startsWith('http')) {
        // It's a URL, fetch the data
        const response = await fetch(freshArchive.data);
        if (!response.ok) {
          throw new Error('Failed to fetch archive from Supabase');
        }
        const arrayBuffer = await response.arrayBuffer();
        bytes = new Uint8Array(arrayBuffer);
      } else {
        // It's base64 data
        const base64Data = freshArchive.data;
        const base64Content = base64Data.split(',')[1];
        binaryString = atob(base64Content);
        bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
      }

      // Parse the Excel data
      const workbook = XLSX.read(bytes, {
        type: 'array'
      });
      const wsname = workbook.SheetNames[0];
      const ws = workbook.Sheets[wsname];

      // Convert to JSON
      const parsedData = XLSX.utils.sheet_to_json<RawOrderData>(ws);
      if (parsedData.length === 0) {
        toast.error('No data found in archived file', {
          id: 'loading-archive'
        });
        return;
      }

      // Update state with the loaded data
      setRawData(parsedData);

      // Process the data as if it was freshly uploaded
      const {
        cleanedData,
        stats
      } = cleanAndValidateData(parsedData);
      if (cleanedData.length > 0) {
        setData(cleanedData);
        setProcessingStats(stats);

        // Store in localStorage as usual
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('lastProcessedOrders', JSON.stringify(cleanedData));
            localStorage.setItem('lastProcessedDate', new Date().toISOString());
          } catch (err) {
            console.warn('Could not save to localStorage:', err);
          }
        }
        toast.success(`Successfully loaded ${cleanedData.length} orders from archive`, {
          id: 'loading-archive'
        });
      } else {
        toast.error('No valid orders found in archived file', {
          id: 'loading-archive'
        });
      }

      // Store the current filename
      setCurrentFileName(freshArchive.fileName);

      // Hide the archives panel after loading
      setShowArchives(false);
    } catch (error) {
      console.error('Error loading archived data:', error);
      toast.error(`Error loading archived data: ${error instanceof Error ? error.message : 'Unknown error'}`, {
        id: 'loading-archive'
      });
    }
  }, []);
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
  }} className="w-full max-w-[100%] mx-auto px-2" data-unique-id="7355d434-a9e4-461f-a996-5af01a9aa0f4" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
      <Toaster position="top-center" toastOptions={{
      duration: 3000
    }} />
      
      <div className="mb-8" data-unique-id="b83390e0-3f76-4186-85bd-47c66d811a19" data-file-name="components/order-data-processor.tsx">
        <h1 className="text-3xl font-bold text-primary mb-2" data-unique-id="f5d00173-f57e-456b-b809-16b4d71c6afd" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="0de2977a-536a-405c-b365-419ffb1a3395" data-file-name="components/order-data-processor.tsx">
          Order Data Processor
        </span></h1>
        <p className="text-muted-foreground" data-unique-id="9642d7a1-93c3-4fff-947e-017804dd734e" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="04517258-2094-4e75-aaf9-ae22a77d4238" data-file-name="components/order-data-processor.tsx">
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
    }} className="mt-8" data-unique-id="fa766dfd-1be6-479d-a6ae-39f20b3b99ef" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
          <div className="flex justify-between items-center mb-6" data-unique-id="6d434db0-8c45-43a7-a553-bf10417f8170" data-file-name="components/order-data-processor.tsx">
            <div data-unique-id="6928a7ba-d115-46ba-9708-07af06a0ccd4" data-file-name="components/order-data-processor.tsx">
              <h2 className="text-xl font-semibold flex items-center" data-unique-id="61cc6990-1c9f-47a6-8ec4-fc91d8c72f3d" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                <FileSpreadsheet className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="e028f0d8-46b4-4807-b7c5-05ae8f281e4e" data-file-name="components/order-data-processor.tsx">
                Processed Orders (</span>{data.length}<span className="editable-text" data-unique-id="ea994d0b-4f6c-4704-ad50-060155865a49" data-file-name="components/order-data-processor.tsx">)
              </span></h2>
              
              <div className="mt-2 flex flex-wrap gap-3" data-unique-id="006d170c-a63c-4716-b423-27e70cb1c2f4" data-file-name="components/order-data-processor.tsx">
                <div className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full" data-unique-id="01cd209a-6d8c-40ef-adc4-b63e1c74ae29" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="cfac7e6b-6105-4391-8f1a-64629dfbd7d3" data-file-name="components/order-data-processor.tsx">
                  Total: </span>{processingStats.total}
                </div>
                <div className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full" data-unique-id="7d182ba3-7cb6-4076-a862-6452de2904c3" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="5288ebd3-e7c3-4018-b763-26cfa6535f6e" data-file-name="components/order-data-processor.tsx">
                  Processed: </span>{processingStats.processed}
                </div>
                <div className="text-sm bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full" data-unique-id="4b5291a7-9251-4d20-87f7-f5eb75aa23d7" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="1f3331ec-b61e-4b8d-ab25-0a674c09a6df" data-file-name="components/order-data-processor.tsx">
                  Filtered: </span>{processingStats.filtered}
                </div>
                <div className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded-full" data-unique-id="c0d709c3-5eb2-4630-85e7-92282d5be327" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="cc8897b8-330a-495e-b4b5-ece42d56c45f" data-file-name="components/order-data-processor.tsx">
                  Invalid: </span>{processingStats.invalid}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3" data-unique-id="36aaa65b-1eeb-43ae-810f-591aa0c7597e" data-file-name="components/order-data-processor.tsx">
              <button onClick={sendEmailsToCustomers} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="9765cbf9-51bd-48dc-8e3f-c0573e95c91c" data-file-name="components/order-data-processor.tsx">
                <Mail className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="8e7b4464-7d37-41f7-9b57-a464c07269af" data-file-name="components/order-data-processor.tsx">
                Create Emails
              </span></button>
              
              <button onClick={exportProcessedData} className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="41e092fb-bb2f-4aa3-9afd-b0c032594d14" data-file-name="components/order-data-processor.tsx">
                <DownloadIcon className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="2f538069-05fc-4b9c-a9b1-580af9d866fc" data-file-name="components/order-data-processor.tsx">
                Export Data
              </span></button>
              
              <button onClick={cleanAllOrders} className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors" data-unique-id="3dff15e9-05ed-473f-bc2a-19e2d0cef8d0" data-file-name="components/order-data-processor.tsx">
                <Trash2 className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="4e696d10-6abc-4387-b047-68969228c6d0" data-file-name="components/order-data-processor.tsx">
                Clean All
              </span></button>
              
              <button onClick={archiveCurrentExcel} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors ml-3" data-unique-id="5b3a9a86-71e8-4a95-ae62-f2c884f8c053" data-file-name="components/order-data-processor.tsx">
                <Archive className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="cb37f874-53bf-445b-802c-0940878a299c" data-file-name="components/order-data-processor.tsx">
                Archive Data
              </span></button>
              
              <button onClick={() => setShowArchives(!showArchives)} className={`flex items-center px-4 py-2 ${showArchives ? 'bg-amber-600' : 'bg-blue-600'} text-white rounded-md hover:${showArchives ? 'bg-amber-700' : 'bg-blue-700'} transition-colors ml-3`} data-unique-id="dce53e11-5ae9-4d56-bd40-e4447b335e70" data-file-name="components/order-data-processor.tsx">
                <FileSpreadsheet className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="1c9441d2-93c6-46e0-a560-237f3148c469" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                {showArchives ? 'Hide Archives' : 'Show Archives'}
              </span></button>
            </div>
          </div>

          {/* Archives Section */}
          <AnimatePresence>
            {showArchives && <motion.div initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: 'auto'
        }} exit={{
          opacity: 0,
          height: 0
        }} transition={{
          duration: 0.3
        }} className="mb-6 mt-4" data-unique-id="227d6da7-a138-4789-b4bf-08b0ba91e89d" data-file-name="components/order-data-processor.tsx">
                <div className="bg-card border border-border rounded-lg p-4 shadow-md" data-unique-id="4b1f7958-8bee-4188-8742-a42a6d46a385" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                  <h3 className="text-lg font-medium mb-4 flex items-center" data-unique-id="cee64439-b3ff-4bca-8011-d03b1d965741" data-file-name="components/order-data-processor.tsx">
                    <Archive className="mr-2 h-5 w-5 text-amber-500" />
                    <span className="editable-text" data-unique-id="808facaf-3b06-49e0-b1d9-f60b26244ab1" data-file-name="components/order-data-processor.tsx">Archived Excel Files</span>
                  </h3>
                  
                  {/* Use the existing ExcelArchivesManager component */}
                  <ExcelArchivesManager onSelectArchive={archive => {
              setSelectedArchive(archive);
              loadArchiveData(archive);
            }} compact={true} />
                </div>
              </motion.div>}
          </AnimatePresence>

          {/* Search by Order Number */}
          <div className="mb-6 relative" data-unique-id="3fe1bb03-e8f8-4798-87e5-a9cbcc81c1a3" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
            <div className="relative" data-unique-id="7fd1d1bb-2883-42bb-b53c-a81a0263797b" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by order number..." className="pl-10 pr-4 py-2 w-full border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" data-unique-id="a145727b-ca24-4623-b6c3-e27b10f864ac" data-file-name="components/order-data-processor.tsx" />
              {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground" data-unique-id="cdd8e788-149d-45b2-809a-9042ae3e05ed" data-file-name="components/order-data-processor.tsx">
                  <X className="h-4 w-4" />
                </button>}
            </div>
            {searchQuery && <div className="mt-2 text-sm text-muted-foreground" data-unique-id="9c6730f9-df9c-4682-b2d0-1d46bffa7e6a" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="5c1802d8-c384-4a1b-adfa-43d7f362d706" data-file-name="components/order-data-processor.tsx">
                Found </span>{filteredData.length}<span className="editable-text" data-unique-id="571aed94-6fc2-444f-bfd4-a91fae412630" data-file-name="components/order-data-processor.tsx"> orders matching "</span>{searchQuery}<span className="editable-text" data-unique-id="c55e804e-8818-4ae4-81cc-3594ae7b7e8d" data-file-name="components/order-data-processor.tsx">"
              </span></div>}
          </div>
          
          {/* Display Table */}
          <div className="bg-card rounded-lg border border-border shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl" data-unique-id="856b396a-2833-4ff0-b674-a4046fab6302" data-file-name="components/order-data-processor.tsx">
            <DataTable data={filteredData} onRowClick={showCustomerDetails} actionColumn={row => <div className="flex space-x-1" data-unique-id="725c0cc0-d126-418a-bd9f-2545c09a80e0" data-file-name="components/order-data-processor.tsx">
                  <button onClick={() => showCustomerDetails(row)} className="p-2 rounded-full hover:bg-accent/20" title="View Customer Details" data-unique-id="16baf5e9-7717-411d-9b1d-126e770caab7" data-file-name="components/order-data-processor.tsx">
                    <Eye className="h-4 w-4 text-primary" />
                  </button>
                  <button onClick={e => {
            e.stopPropagation();
            openOrderInShipStation(row.customerOrderNumber);
          }} className="p-2 rounded-full hover:bg-accent/20" title="Open in ShipStation" data-unique-id="ce708d9d-2b9c-478f-9052-5f36a69cb062" data-file-name="components/order-data-processor.tsx">
                    <ExternalLink className="h-4 w-4 text-blue-500" />
                  </button>
                  <button onClick={e => {
            e.stopPropagation();
            copyOrderNumber(row.customerOrderNumber);
          }} className="p-2 rounded-full hover:bg-accent/20" title="Copy order number" data-unique-id="a0fa3a58-35e2-4640-89e5-01f5cf178885" data-file-name="components/order-data-processor.tsx">
                    <Copy className="h-4 w-4 text-gray-600" />
                  </button>
                  <button onClick={e => {
            e.stopPropagation();
            removeOrder(row);
          }} className="p-2 rounded-full hover:bg-red-100 transition-colors" title="Remove order" data-unique-id="02f41a2d-e963-467c-8d64-d14c71b6b32f" data-file-name="components/order-data-processor.tsx">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>} renderCell={(key, value, row) => {
          // Make tracking numbers clickable
          if (key === 'trackingNumbers' && Array.isArray(value)) {
            return <div className="space-y-1" data-unique-id="5ddca76c-89ad-4924-831b-d0581ab26e7b" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                    {value.map((num, idx) => <a key={idx} href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${num}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:underline" data-unique-id="79fe1c3f-5057-4a82-b554-25a3767e9073" data-file-name="components/order-data-processor.tsx">
                      <span className="mr-1" data-unique-id="b73a7fb0-0885-4876-8bb3-3ca35993d35e" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{num.length > 15 ? `${num.slice(0, 15)}...` : num}</span>
                      <ExternalLink className="h-3 w-3" data-unique-id="34a1e4e8-79ef-453a-80a6-e3b93aca0854" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                    </a>)}
                  </div>;
          }

          // Make order number clickable
          if (key === 'customerOrderNumber') {
            const orderLink = `https://ship.shipstation.com/orders/awaiting-shipment/order/${row.id || 'unknown'}/active/${value}`;
            return <a href={orderLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" onClick={e => e.stopPropagation()} data-unique-id="d0c71d6c-069a-4bd5-95e8-717f87106b37" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                      {value}
                    </a>;
          }
          return null; // Use default rendering for other cells
        }} />
          </div>
          
          {/* Warning about filtered data */}
          {processingStats.filtered > 0 && <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md" data-unique-id="1b6809d2-20c5-407b-8be4-e0c9fb00c867" data-file-name="components/order-data-processor.tsx">
              <div className="flex items-center" data-unique-id="7ca8fd71-6c2b-4105-91ee-f252d462b82d" data-file-name="components/order-data-processor.tsx">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-yellow-800 font-medium" data-unique-id="aa347896-5f80-4af7-a938-d9c44e6f2be4" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="97050681-9a85-4859-87c9-a74eb4ebafa3" data-file-name="components/order-data-processor.tsx">Some entries were filtered out</span></p>
              </div>
              <p className="text-sm text-yellow-700 mt-1" data-unique-id="1852fea4-78db-42b9-b264-c8de57987568" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                {processingStats.filtered}<span className="editable-text" data-unique-id="c40509d6-3584-4f92-b133-a714d7d9c69a" data-file-name="components/order-data-processor.tsx"> entries were filtered out because they didn't meet the requirements
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
      }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)} data-unique-id="a4e2d132-5b7e-4c33-b06e-07864831a056" data-file-name="components/order-data-processor.tsx">
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
        }} className="bg-card rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="380e3947-7228-4ac0-9e4f-711b11b63c71" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
              {/* Header */}
              <div className="bg-primary text-white p-6" data-unique-id="a11f73bc-d52b-49db-86c3-8f249cc0650b" data-file-name="components/order-data-processor.tsx">
                <div className="flex justify-between items-start" data-unique-id="e2d60c62-172b-4b80-bb9a-c23e61b33e8e" data-file-name="components/order-data-processor.tsx">
                  <div data-unique-id="0531c2a9-8139-40c2-b264-ab66456dac86" data-file-name="components/order-data-processor.tsx">
                    <div className="flex items-center" data-unique-id="bab73c62-9cc7-4c9f-a46d-9ecccec2644c" data-file-name="components/order-data-processor.tsx">
                      <h2 className="text-xl font-semibold" data-unique-id="d30263e0-c69e-423a-9375-148a8e7a2e08" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="aa9a747a-055b-4af4-833f-c49495b3e764" data-file-name="components/order-data-processor.tsx">Customer Order #</span>{selectedOrder.customerOrderNumber}</h2>
                      <button onClick={() => copyOrderNumber(selectedOrder.customerOrderNumber)} className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors" title="Copy order number" data-unique-id="9aca6c56-851a-4a04-97d6-d618627b0520" data-file-name="components/order-data-processor.tsx">
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-primary-foreground/80 mt-1" data-unique-id="6e452f76-a89b-41e1-aba4-b840eb9c15e8" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="49853338-f9e4-4b6d-9287-76eeb473792d" data-file-name="components/order-data-processor.tsx">Shipped on </span>{new Date(selectedOrder.actualShipDate).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="text-white hover:bg-white/10 rounded-full p-2 transition-colors" data-unique-id="3c7a6c15-7c4d-495c-ae31-dfa4eeae81d1" data-file-name="components/order-data-processor.tsx">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto" data-unique-id="21d62a79-7175-40bc-afe6-982bc674c2c8" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="b524c654-63ca-4c25-8609-0a4547507c59" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                  {/* Customer Information */}
                  <div className="space-y-4" data-unique-id="5111723a-42a1-4ff7-8312-998f8f5f8513" data-file-name="components/order-data-processor.tsx">
                    <div className="flex items-start" data-unique-id="997de87d-48c2-492a-846a-2fb1ff16ea65" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="3d48072e-2e69-40ab-8733-faebb0bfd5e5" data-file-name="components/order-data-processor.tsx">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="30a376d7-4a97-4356-b3eb-8da3b83aa931" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="0e173688-a262-4626-a237-cf68e572317a" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="6c84d192-4a7d-4100-9589-be82174773bf" data-file-name="components/order-data-processor.tsx">Customer Name</span></h3>
                        <p className="text-lg font-medium" data-unique-id="f7ca5a52-7ed5-4d32-b357-d127e745d4b2" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start" data-unique-id="4dfa557a-d4af-4110-8a27-c2aced2a1055" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="6a5e2a2d-2d5d-454d-a064-ab9a2cfa8031" data-file-name="components/order-data-processor.tsx">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1" data-unique-id="1fbc3cdf-c414-4015-aacb-df0e2ecedc92" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="4b4abb80-c826-4a1e-bd34-e8c4927782ac" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="a102d3e6-6ffb-4f22-968c-7a9960deaadb" data-file-name="components/order-data-processor.tsx">Email Address</span></h3>
                        {isEditingEmail ? <div className="flex items-center mt-1" data-unique-id="4372a60a-73f2-4cfd-990b-1b6de98fd184" data-file-name="components/order-data-processor.tsx">
                            <input type="email" value={tempEmail} onChange={e => setTempEmail(e.target.value)} className="flex-1 border border-border rounded-md px-2 py-1 text-sm" placeholder="Enter customer email" data-unique-id="92bd5421-5df3-4787-a6c4-b64a0659f67b" data-file-name="components/order-data-processor.tsx" />
                            <button onClick={saveCustomerEmail} className="ml-2 p-1 bg-primary text-white rounded-md" title="Save email" data-unique-id="6cff1221-3ff2-46dc-b589-6019b1c9677a" data-file-name="components/order-data-processor.tsx">
                              <Save className="h-4 w-4" />
                            </button>
                            <button onClick={() => {
                        setIsEditingEmail(false);
                        setTempEmail(selectedOrder.shipToEmail || '');
                      }} className="ml-1 p-1 bg-secondary text-secondary-foreground rounded-md" title="Cancel" data-unique-id="3c8ba8f1-3d84-402e-a447-1c082c51c317" data-file-name="components/order-data-processor.tsx">
                              <X className="h-4 w-4" />
                            </button>
                          </div> : <div className="flex items-center" data-unique-id="12de369e-4868-43b5-b53d-bc657cb57f91" data-file-name="components/order-data-processor.tsx">
                            <p className="text-lg" data-unique-id="802a8415-bee2-4ef9-a1ba-9c9ec816577b" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToEmail || 'No email provided'}</p>
                            <button onClick={() => setIsEditingEmail(true)} className="ml-2 p-1 hover:bg-accent/20 rounded-md" title="Edit email" data-unique-id="0b362191-fe66-4277-8d39-836470f326aa" data-file-name="components/order-data-processor.tsx">
                              <Edit className="h-4 w-4 text-primary" />
                            </button>
                          </div>}
                      </div>
                    </div>
                    
                    <div className="flex items-start" data-unique-id="9b2a181a-d9f3-4100-b9e6-1f940740642c" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="be6b8afa-fe9c-45d9-b2ca-5e24c5e5e6f4" data-file-name="components/order-data-processor.tsx">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="e4b7ae19-9885-493b-8296-f2be1fa3c890" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="6fbc5740-0f6a-4768-858f-c4558d425a33" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="4777f9ea-3330-4538-94f7-d3a2bf5197d3" data-file-name="components/order-data-processor.tsx">Phone Number</span></h3>
                        <p className="text-lg" data-unique-id="5b232427-14cb-4bf5-b938-ffe505264cb9" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToPhone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Information */}
                  <div className="space-y-4" data-unique-id="72656cb3-4793-41fc-b9e6-5e251bc34844" data-file-name="components/order-data-processor.tsx">
                    <div className="flex items-start" data-unique-id="084b516f-77dd-4560-ac16-536fe9cae8fe" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="36d1de5d-9529-45cf-beee-534d23e4f918" data-file-name="components/order-data-processor.tsx">
                        <Home className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="1cb4f130-1f0b-430d-af06-e8a114ba716e" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="ee9d9212-59b8-4e34-80fe-5307e133c032" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="a855ba05-cda1-4f9d-a6a6-ff3a9f0e97a6" data-file-name="components/order-data-processor.tsx">Shipping Address</span></h3>
                        <p className="text-lg" data-unique-id="c36c99c7-f6a5-4cec-854a-5d3312902266" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToLine1}</p>
                        <p className="text-lg" data-unique-id="a196cf31-76c9-4528-966d-02f12b644141" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToCity}<span className="editable-text" data-unique-id="208579e5-0ed6-4716-9fd2-5c4327beb226" data-file-name="components/order-data-processor.tsx">, </span>{selectedOrder.shipToStateProvince} {selectedOrder.shipToPostalCode}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start" data-unique-id="b3894e6d-fac1-4b48-8894-c166ddae4759" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="9f29d551-d0e0-4020-96b7-a8c61a029648" data-file-name="components/order-data-processor.tsx">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="a50c7c70-71d7-4ad8-87c8-b7f34b298583" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="e0b518b8-e557-489b-962a-5a5e40b11052" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="e33debaa-d2a4-4f91-ae16-a267a0b9ad74" data-file-name="components/order-data-processor.tsx">Order Total</span></h3>
                        <p className="text-lg font-medium" data-unique-id="5ad0dbee-7021-4a5b-b1fb-e562b8884cb9" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="1462b03e-52f1-48f1-859d-d169c9ff9154" data-file-name="components/order-data-processor.tsx">$</span>{selectedOrder.orderTotal.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start" data-unique-id="e8171c5c-cf02-4146-8a56-e7d336fc7750" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="23a90ec2-2816-4fc1-a73a-6ecd36bc6f66" data-file-name="components/order-data-processor.tsx">
                        <Info className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="da805d63-a984-4d73-ac7d-c96bb258850f" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="2e331238-1bde-4b34-8497-4fc1aca988b3" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="92217bb0-4224-43a8-834e-94b4f40ada44" data-file-name="components/order-data-processor.tsx">Order Source</span></h3>
                        <p className="text-lg" data-unique-id="d740a841-c536-414a-8085-481a63e20895" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.orderSource || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracking Information */}
                <div className="mt-6 pt-6 border-t border-border" data-unique-id="e2d99d65-c857-4e20-ae0f-6788db8e629a" data-file-name="components/order-data-processor.tsx">
                  <h3 className="text-lg font-medium mb-4" data-unique-id="e340d12b-9ecc-4ee4-98f9-40ec25397eb7" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="91d7d28d-28a2-4ed7-8753-da2d8e98f2b5" data-file-name="components/order-data-processor.tsx">Tracking Information</span></h3>
                  <div className="space-y-3" data-unique-id="5cbe64ef-1d13-4bf5-a376-6b2cb90a74b1" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                    {selectedOrder.trackingNumbers.map((number, index) => <div key={index} className="flex items-center p-3 bg-accent/10 rounded-md" data-unique-id="2e85e875-d828-4451-a124-0575c27e1310" data-file-name="components/order-data-processor.tsx">
                        <MapPin className="h-5 w-5 text-primary mr-3" data-unique-id="2f666d6a-833f-48fb-898f-d5c09a0540aa" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                        <span className="font-medium mr-2" data-unique-id="8fdedd06-52dc-4dc8-8a43-2948753c04f4" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="0114ccec-6dc5-451a-8258-7c278eb2f726" data-file-name="components/order-data-processor.tsx">Tracking #</span>{index + 1}<span className="editable-text" data-unique-id="3f0635e5-c642-42bb-93f0-af1e105843f6" data-file-name="components/order-data-processor.tsx">:</span></span>
                        <div className="flex items-center flex-wrap" data-unique-id="32c7e2ca-9bfc-424e-8b1d-4a805220a9c6" data-file-name="components/order-data-processor.tsx">
                          <a href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${number}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center" data-unique-id="96536453-ff36-4046-bca1-4f65267c533e" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                            {number}
                            <ExternalLink className="ml-1 h-4 w-4" data-unique-id="f96583af-5615-4ecc-9f7f-9a95110ab3de" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                          </a>
                          <button onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(number).then(() => toast.success('Tracking number copied!')).catch(err => console.error('Failed to copy tracking number:', err));
                      }
                    }} className="ml-2 p-1 rounded-full hover:bg-accent/20 transition-colors" title="Copy tracking number" data-unique-id="2c78217d-8e6f-4dd2-a49c-50e875214570" data-file-name="components/order-data-processor.tsx">
                            <Copy className="h-4 w-4 text-primary" data-unique-id="89153a26-0459-40af-aa40-1f1bbd2c2057" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                          </button>
                          <button onClick={() => {
                      const trackingUrl = `https://www.fedex.com/apps/fedextrack/?tracknumbers=${number}`;
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(trackingUrl).then(() => toast.success('Tracking link copied!')).catch(err => console.error('Failed to copy tracking link:', err));
                      }
                    }} className="ml-1 p-1 rounded-full hover:bg-accent/20 transition-colors" title="Copy FedEx link" data-unique-id="ae177f4e-1625-4c67-947a-69e31cd3d3cb" data-file-name="components/order-data-processor.tsx">
                            <svg className="h-4 w-4 text-[#4D148C]" viewBox="0 0 24 24" fill="currentColor" data-unique-id="608a37c5-f0f4-47fe-adcd-3442a47e979d" data-file-name="components/order-data-processor.tsx">
                              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 5a3 3 0 11-3 3 3 3 0 013-3zm0 11.13c-2.03-.31-3.88-1.47-5.14-3.13h10.28c-1.26 1.66-3.11 2.82-5.14 3.13z" data-unique-id="2b20701a-0737-46d7-a329-621e6931ad02" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                            </svg>
                          </button>
                        </div>
                      </div>)}
                    {selectedOrder.trackingNumbers.length === 0 && <p className="text-muted-foreground italic" data-unique-id="5933fea7-8ed2-4221-84d6-f3ed3fadb659" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="7da1aeba-41a7-4e88-a0a0-f5f9ed02899b" data-file-name="components/order-data-processor.tsx">No tracking numbers available</span></p>}
                  </div>
                </div>

                {/* Order Summary */}
                {selectedOrder.orderSummary && <div className="mt-6 pt-6 border-t border-border" data-unique-id="c3b80a3b-2ca5-4706-9313-59465897108f" data-file-name="components/order-data-processor.tsx">
                    <h3 className="text-lg font-medium mb-2" data-unique-id="c53226e0-6c49-4555-957d-25c5460c7311" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="e2b015b2-ebd5-493c-9233-4c3594953ed7" data-file-name="components/order-data-processor.tsx">Order Summary</span></h3>
                    <div className="p-4 bg-accent/10 rounded-md" data-unique-id="558e42e3-8a4d-4aea-b421-6e1381828e88" data-file-name="components/order-data-processor.tsx">
                      <p data-unique-id="2873a37d-eaed-4531-9142-8e9a4f5578b4" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.orderSummary}</p>
                    </div>
                  </div>}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border bg-muted/30 flex justify-end" data-unique-id="14fd1de3-763d-4e07-b7bb-57beb6cbb32f" data-file-name="components/order-data-processor.tsx">
                <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="2c0a87f4-713a-4e19-8414-a09be74aff99" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="678fa075-7581-4f2d-84db-8ff0101910c5" data-file-name="components/order-data-processor.tsx">
                  Close
                </span></button>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
    </motion.div>;
}