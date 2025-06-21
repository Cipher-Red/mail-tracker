'use client';
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUp, FileSpreadsheet, AlertCircle, DownloadIcon, Mail, Search, X, Eye, Edit, Save, ExternalLink, Phone, Home, Calendar, Package, MapPin, DollarSign, Info, Trash2, Copy, Archive, BarChart3 } from 'lucide-react';
import * as XLSX from 'xlsx';
import ExcelArchivesManager from '@/components/excel-archives-manager';
import OrderAnalyticsDashboard from '@/components/order-analytics-dashboard';
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
  const [showAnalytics, setShowAnalytics] = useState(false);
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
    if (typeof window === 'undefined') return;
    const confirmDelete = confirm('Are you sure you want to remove this order from the dataset?');
    if (confirmDelete) {
      setData(prevData => prevData.filter(order => order.customerOrderNumber !== orderToRemove.customerOrderNumber || order.shipToName !== orderToRemove.shipToName));

      // Also update localStorage to persist the removal
      try {
        const lastProcessedOrders = typeof window !== 'undefined' ? window.localStorage.getItem('lastProcessedOrders') : null;
        if (lastProcessedOrders) {
          const parsedOrders = JSON.parse(lastProcessedOrders);
          const updatedOrders = parsedOrders.filter((order: CleanedOrderData) => order.customerOrderNumber !== orderToRemove.customerOrderNumber || order.shipToName !== orderToRemove.shipToName);
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('lastProcessedOrders', JSON.stringify(updatedOrders));
          }
        }
      } catch (err) {
        console.warn('Could not update localStorage:', err);
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
      // Only run on client side
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        return;
      }
      try {
        const textArea = typeof document !== 'undefined' ? document.createElement('textarea') : null;
        if (!textArea) return;
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '0';
        if (typeof document !== 'undefined') {
          document.body.appendChild(textArea);
        }
        textArea.focus();
        textArea.select();
        const successful = typeof document !== 'undefined' ? document.execCommand('copy') : false;
        if (successful) {
          toast.success(`Order #${text} copied to clipboard!`, {
            duration: 2000,
            position: 'bottom-center'
          });
        } else {
          toast.error('Failed to copy order number');
        }
        if (typeof document !== 'undefined') {
          document.body.removeChild(textArea);
        }
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
      const toastId = toast.loading('Archiving Excel data...', {
        id: 'archiving'
      });

      // Get the file information from state or use a default name
      const filename = currentFileName || `order-data-${new Date().toISOString().slice(0, 10)}.xlsx`;

      // Create a more robust file object with proper size calculation
      const fileToArchive = new File([new Blob([])],
      // We'll create the actual blob content later
      filename, {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      // Convert data back to Excel format
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(rawData);
      XLSX.utils.book_append_sheet(wb, ws, 'Orders');
      const excelBuffer = XLSX.write(wb, {
        bookType: 'xlsx',
        type: 'array'
      });

      // Create a proper Blob for the file
      const excelBlob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      // Override the empty file with actual content
      Object.defineProperty(fileToArchive, 'size', {
        value: excelBlob.size,
        writable: false
      });

      // Get arrayBuffer from blob to convert to base64
      const arrayBuffer = await excelBlob.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }

      // Convert to base64 for storage
      const base64data = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + btoa(binary);

      // Use the excelArchiveService to store the file
      try {
        console.log('Archiving Excel file', fileToArchive.name, 'size:', fileToArchive.size);
        const {
          excelArchiveService
        } = await import('@/lib/excel-archive-service');
        const archiveResult = await excelArchiveService.archiveExcelFile(fileToArchive, base64data, {
          rowCount: rawData.length,
          columnCount: Object.keys(rawData[0] || {}).length,
          description: `Order data archived on ${new Date().toLocaleString()}`,
          sheets: ['Orders'],
          orderCount: rawData.length
        });
        if (archiveResult) {
          toast.success('Excel data archived successfully to Supabase and database', {
            id: toastId,
            duration: 3000
          });

          // Track successful archiving
          import('@/lib/utils').then(({
            trackActivity
          }) => {
            trackActivity('order.excel_archived', {
              fileName: fileToArchive.name,
              fileSize: fileToArchive.size,
              recordCount: rawData.length,
              storedId: archiveResult.id
            });
          });
        }
      } catch (err) {
        console.error('Error archiving Excel data:', err);
        toast.error(`Failed to archive Excel data: ${err instanceof Error ? err.message : 'Unknown error'}`, {
          id: toastId,
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error archiving Excel data:', error);
      toast.error(`Failed to archive Excel data: ${error instanceof Error ? error.message : 'Unknown error'}`, {
        id: 'archiving',
        duration: 5000
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
      reader.readAsArrayBuffer(file);
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
            window.localStorage.setItem('lastProcessedOrders', JSON.stringify(cleanedData));
            window.localStorage.setItem('lastProcessedDate', new Date().toISOString());
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
  }} className="w-full max-w-[100%] mx-auto px-2" data-unique-id="92792b84-5c62-40fc-8606-c4cd73119041" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
      <Toaster position="top-center" toastOptions={{
      duration: 3000
    }} />
      
      <div className="mb-8" data-unique-id="3290b252-bb3a-42e3-8946-6a0bab48434f" data-file-name="components/order-data-processor.tsx">
        <h1 className="text-3xl font-bold text-primary mb-2" data-unique-id="8ded0aff-57b6-46a6-8f74-60561fa04ee0" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="502290d5-e5cd-45b4-9356-47bf1449a065" data-file-name="components/order-data-processor.tsx">
          Order Data Processor
        </span></h1>
        <p className="text-muted-foreground" data-unique-id="da0c6ba9-25b5-402e-8eb7-949bbf257b69" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="29f87352-eaf4-4230-915a-5a95b0a49411" data-file-name="components/order-data-processor.tsx">
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
    }} className="mt-8" data-unique-id="c17957cf-efc2-4b8a-8dc0-2e8a0fe781b4" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
          <div className="flex justify-between items-center mb-6" data-unique-id="9be947de-3ae2-48c0-9026-f8701a3aa85c" data-file-name="components/order-data-processor.tsx">
            <div data-unique-id="4bd4d82b-aa37-4dc4-b148-e7e8af153c78" data-file-name="components/order-data-processor.tsx">
              <h2 className="text-xl font-semibold flex items-center" data-unique-id="cded5192-add4-480a-8519-6fa3af60ae0a" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                <FileSpreadsheet className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="e1b76fd8-4145-4731-b730-ba97fbdba72d" data-file-name="components/order-data-processor.tsx">
                Processed Orders (</span>{data.length}<span className="editable-text" data-unique-id="184aeccd-3395-49ef-bb0a-8d31929d75d5" data-file-name="components/order-data-processor.tsx">)
              </span></h2>
              
              <div className="mt-2 flex flex-wrap gap-3" data-unique-id="bf885f6d-7275-49fc-a04f-69dceec5afbb" data-file-name="components/order-data-processor.tsx">
                <div className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full" data-unique-id="ba77dd0b-23c5-41e3-9d3c-3b1cd39b9c0f" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="4d5d97f8-8517-47dd-b641-4bea0b7bf9bd" data-file-name="components/order-data-processor.tsx">
                  Total: </span>{processingStats.total}
                </div>
                <div className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full" data-unique-id="6a6b704c-1302-40d3-bbce-b6cddb7216a5" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="d0d87f00-0067-42f6-ba0e-1cbde1e6a4c4" data-file-name="components/order-data-processor.tsx">
                  Processed: </span>{processingStats.processed}
                </div>
                <div className="text-sm bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full" data-unique-id="653622dd-3dd1-4c29-b350-b553438cf7a4" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="d422bd7b-eb48-475e-a987-f619c5b7d58f" data-file-name="components/order-data-processor.tsx">
                  Filtered: </span>{processingStats.filtered}
                </div>
                <div className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded-full" data-unique-id="ac0d4f11-beaf-4110-9133-3d3ab0ab17b6" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="5a6bebed-0b15-4736-a0a3-44eadaeddf5f" data-file-name="components/order-data-processor.tsx">
                  Invalid: </span>{processingStats.invalid}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3" data-unique-id="11fe5dd0-965c-46f8-b1ac-7b516bb2a824" data-file-name="components/order-data-processor.tsx">
              <button onClick={sendEmailsToCustomers} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="71facd3b-713f-4616-833a-2bea80f772ef" data-file-name="components/order-data-processor.tsx">
                <Mail className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="c5fbe605-9fa2-4319-ab54-bd809b5ab46a" data-file-name="components/order-data-processor.tsx">
                Create Emails
              </span></button>
              
              <button onClick={() => setShowAnalytics(!showAnalytics)} className={`flex items-center px-4 py-2 ${showAnalytics ? 'bg-purple-600' : 'bg-green-600'} text-white rounded-md hover:${showAnalytics ? 'bg-purple-700' : 'bg-green-700'} transition-colors`} data-unique-id="7ae0dafd-99a1-4520-a3a9-90c93de8846c" data-file-name="components/order-data-processor.tsx">
                <BarChart3 className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="5ac71990-ba2e-453d-be24-e7f3c860537c" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
              </span></button>
              
              <button onClick={exportProcessedData} className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="6472df81-567e-44a4-9ba0-4b9507f7aee1" data-file-name="components/order-data-processor.tsx">
                <DownloadIcon className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="66a16da2-4828-4622-9cc5-fe089aa57990" data-file-name="components/order-data-processor.tsx">
                Export Data
              </span></button>
              
              <button onClick={cleanAllOrders} className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors" data-unique-id="5e847735-0fb2-420f-89f5-113de6dad60a" data-file-name="components/order-data-processor.tsx">
                <Trash2 className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="86b71f9e-584e-49c7-9795-d1dd1147f314" data-file-name="components/order-data-processor.tsx">
                Clean All
              </span></button>
              
              <button onClick={archiveCurrentExcel} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors ml-3" data-unique-id="cdc16817-8a95-4063-ba2e-3991e7266ee2" data-file-name="components/order-data-processor.tsx">
                <Archive className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="b00091f9-a245-4a31-b87a-ab682a9ff642" data-file-name="components/order-data-processor.tsx">
                Archive Data
              </span></button>
              
              <button onClick={() => setShowArchives(!showArchives)} className={`flex items-center px-4 py-2 ${showArchives ? 'bg-amber-600' : 'bg-blue-600'} text-white rounded-md hover:${showArchives ? 'bg-amber-700' : 'bg-blue-700'} transition-colors ml-3`} data-unique-id="78a17ff2-d879-4b0e-9c15-46b643ac73b2" data-file-name="components/order-data-processor.tsx">
                <FileSpreadsheet className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="8582da94-d347-4bb3-a752-ef426a8edd89" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                {showArchives ? 'Hide Archives' : 'Show Archives'}
              </span></button>
            </div>
          </div>

          {/* Analytics Section */}
          <AnimatePresence>
            {showAnalytics && <motion.div initial={{
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
        }} className="mb-6 mt-4" data-unique-id="d7c3e5bc-e92e-4aa3-826c-f5cd0ab03569" data-file-name="components/order-data-processor.tsx">
                <div className="bg-card border border-border rounded-lg p-6 shadow-md" data-unique-id="8db1ada4-f31d-44d0-865d-53bf7e08da82" data-file-name="components/order-data-processor.tsx">
                  <h3 className="text-lg font-medium mb-4 flex items-center" data-unique-id="1d0c4387-75a2-46b3-830a-6e343768fe2f" data-file-name="components/order-data-processor.tsx">
                    <BarChart3 className="mr-2 h-5 w-5 text-green-500" />
                    <span className="editable-text" data-unique-id="c9ff91a2-1e5b-4850-b803-a9ed6b0939c6" data-file-name="components/order-data-processor.tsx">Order Analytics</span>
                  </h3>
                  <OrderAnalyticsDashboard orders={data} />
                </div>
              </motion.div>}
          </AnimatePresence>

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
        }} className="mb-6 mt-4" data-unique-id="1d088523-300e-4509-bb94-0309b51669bf" data-file-name="components/order-data-processor.tsx">
                <div className="bg-card border border-border rounded-lg p-4 shadow-md" data-unique-id="d3b062a3-8c98-40f0-a4c0-22915279123a" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                  <h3 className="text-lg font-medium mb-4 flex items-center" data-unique-id="a2240c26-f51f-44fa-963f-8b9dce97f1a2" data-file-name="components/order-data-processor.tsx">
                    <Archive className="mr-2 h-5 w-5 text-amber-500" />
                    <span className="editable-text" data-unique-id="bddd5f41-695c-4f18-8a3e-b2ca99f3ff22" data-file-name="components/order-data-processor.tsx">Archived Excel Files</span>
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
          <div className="mb-6 relative" data-unique-id="578721eb-6202-4293-9745-0c91a1ffe525" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
            <div className="relative" data-unique-id="bd429678-4f8f-4741-9e3f-ff4c861b110a" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by order number..." className="pl-10 pr-4 py-2 w-full border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" data-unique-id="1938ae06-063a-41d5-8171-c1d162b20f59" data-file-name="components/order-data-processor.tsx" />
              {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground" data-unique-id="965575de-0b33-4c5f-94d8-cf37e7464720" data-file-name="components/order-data-processor.tsx">
                  <X className="h-4 w-4" />
                </button>}
            </div>
            {searchQuery && <div className="mt-2 text-sm text-muted-foreground" data-unique-id="faf97720-0f96-4420-804f-bd9a93924d25" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="ef9f80aa-997e-489d-92b2-29bf5990bc68" data-file-name="components/order-data-processor.tsx">
                Found </span>{filteredData.length}<span className="editable-text" data-unique-id="f86f27bb-2113-4d86-ac37-ed71766a115f" data-file-name="components/order-data-processor.tsx"> orders matching "</span>{searchQuery}<span className="editable-text" data-unique-id="59e499a2-f00f-4a4b-b57a-5c307b8f81f1" data-file-name="components/order-data-processor.tsx">"
              </span></div>}
          </div>
          
          {/* Display Table */}
          <div className="bg-card rounded-lg border border-border shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl" data-unique-id="6051bcd7-2d11-4e19-827b-c65b1cd61c56" data-file-name="components/order-data-processor.tsx">
            <DataTable data={filteredData} onRowClick={showCustomerDetails} actionColumn={row => <div className="flex space-x-1" data-unique-id="6ea52f3c-ba60-41d9-8227-98c36bcc69cc" data-file-name="components/order-data-processor.tsx">
                  <button onClick={() => showCustomerDetails(row)} className="p-2 rounded-full hover:bg-accent/20" title="View Customer Details" data-unique-id="43bce105-a189-4c16-946f-295a28718105" data-file-name="components/order-data-processor.tsx">
                    <Eye className="h-4 w-4 text-primary" />
                  </button>
                  <button onClick={e => {
            e.stopPropagation();
            openOrderInShipStation(row.customerOrderNumber);
          }} className="p-2 rounded-full hover:bg-accent/20" title="Open in ShipStation" data-unique-id="d07d16ea-c548-4834-ab3f-aa4b473c0294" data-file-name="components/order-data-processor.tsx">
                    <ExternalLink className="h-4 w-4 text-blue-500" />
                  </button>
                  <button onClick={e => {
            e.stopPropagation();
            copyOrderNumber(row.customerOrderNumber);
          }} className="p-2 rounded-full hover:bg-accent/20" title="Copy order number" data-unique-id="bc3fb5ef-4152-4282-a61b-229720add13b" data-file-name="components/order-data-processor.tsx">
                    <Copy className="h-4 w-4 text-gray-600" />
                  </button>
                  <button onClick={e => {
            e.stopPropagation();
            removeOrder(row);
          }} className="p-2 rounded-full hover:bg-red-100 transition-colors" title="Remove order" data-unique-id="621838e0-2168-4481-8cd6-f16a91f224c9" data-file-name="components/order-data-processor.tsx">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>} renderCell={(key, value, row) => {
          // Make tracking numbers clickable
          if (key === 'trackingNumbers' && Array.isArray(value)) {
            return <div className="space-y-1" data-unique-id="da807d17-dbbb-4f1f-a0b6-a097ea47303a" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                    {value.map((num, idx) => <a key={idx} href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${num}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:underline" data-unique-id="aa9c0f5b-30e7-4994-84eb-65c4cbe5cbcb" data-file-name="components/order-data-processor.tsx">
                      <span className="mr-1" data-unique-id="bbe91b6a-68c2-4655-8fad-47be280ab3d5" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{num.length > 15 ? `${num.slice(0, 15)}...` : num}</span>
                      <ExternalLink className="h-3 w-3" data-unique-id="df0ce486-9db6-42fa-bea5-4e9b989c6465" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                    </a>)}
                  </div>;
          }

          // Make order number clickable
          if (key === 'customerOrderNumber') {
            const orderLink = `https://ship.shipstation.com/orders/awaiting-shipment/order/${row.id || 'unknown'}/active/${value}`;
            return <a href={orderLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" onClick={e => e.stopPropagation()} data-unique-id="36504137-075e-4034-a5b6-0fb586efeed7" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                      {value}
                    </a>;
          }
          return null; // Use default rendering for other cells
        }} />
          </div>
          
          {/* Warning about filtered data */}
          {processingStats.filtered > 0 && <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md" data-unique-id="23d5c8a9-ecaf-465e-ad7f-88db0fe63dd1" data-file-name="components/order-data-processor.tsx">
              <div className="flex items-center" data-unique-id="a72eb319-6f87-4983-a2b9-b0ac6bc10f51" data-file-name="components/order-data-processor.tsx">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-yellow-800 font-medium" data-unique-id="9010a7ce-be6a-429f-a177-846497524c07" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="e62d8af2-9820-4646-b510-64b1807f7b02" data-file-name="components/order-data-processor.tsx">Some entries were filtered out</span></p>
              </div>
              <p className="text-sm text-yellow-700 mt-1" data-unique-id="ee80ee6f-71ad-40bf-8036-ab8454f78475" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                {processingStats.filtered}<span className="editable-text" data-unique-id="d7a79a34-59e7-4393-a55c-6ef789d85706" data-file-name="components/order-data-processor.tsx"> entries were filtered out because they didn't meet the requirements
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
      }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)} data-unique-id="52a22955-a2ea-42d7-a7c1-fa600141ee25" data-file-name="components/order-data-processor.tsx">
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
        }} className="bg-card rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="b83cf889-407b-4e0a-a222-81621cf0a36e" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
              {/* Header */}
              <div className="bg-primary text-white p-6" data-unique-id="93766624-66cd-4dfb-a9f1-cd313c035225" data-file-name="components/order-data-processor.tsx">
                <div className="flex justify-between items-start" data-unique-id="57d63f2a-6951-47cb-a7cf-544deb3ea0a5" data-file-name="components/order-data-processor.tsx">
                  <div data-unique-id="9eee714b-7bb8-4070-b613-31a8a7280e72" data-file-name="components/order-data-processor.tsx">
                    <div className="flex items-center" data-unique-id="ae40e6b7-ac68-49bd-a7ba-b18e8c67214b" data-file-name="components/order-data-processor.tsx">
                      <h2 className="text-xl font-semibold" data-unique-id="201d1ad0-e3ff-4f00-907f-b261b99ed370" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="0819e925-fc15-49ed-912e-71fb2bbdffea" data-file-name="components/order-data-processor.tsx">Customer Order #</span>{selectedOrder.customerOrderNumber}</h2>
                      <button onClick={() => copyOrderNumber(selectedOrder.customerOrderNumber)} className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors" title="Copy order number" data-unique-id="37143353-3f41-4382-9fe8-65d5d736f6fd" data-file-name="components/order-data-processor.tsx">
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-primary-foreground/80 mt-1" data-unique-id="dc04b60d-cbf4-49dd-814a-e5c32c30ed1d" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="f95a9238-7d55-4a38-a216-191a9bcd244d" data-file-name="components/order-data-processor.tsx">Shipped on </span>{new Date(selectedOrder.actualShipDate).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="text-white hover:bg-white/10 rounded-full p-2 transition-colors" data-unique-id="76cf286b-19c1-48c3-8ee3-db3a5970ef0a" data-file-name="components/order-data-processor.tsx">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto" data-unique-id="052deefe-4e23-4fc8-8970-9b1fdff2f9e2" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="e763c79b-eda6-472b-9831-9834f8ed3543" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                  {/* Customer Information */}
                  <div className="space-y-4" data-unique-id="c698e8cf-9b55-4057-8f07-3a48e569afdf" data-file-name="components/order-data-processor.tsx">
                    <div className="flex items-start" data-unique-id="25343dee-cafd-456d-b95d-c7238f954f19" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="98d948d8-1576-497c-8796-8a4d813f8e4e" data-file-name="components/order-data-processor.tsx">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="6b3411b4-0c81-425e-8696-cd8332272b25" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="005a8ec1-ae0e-499a-8e27-9858a44b9642" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="f17e9b02-2540-409c-8012-56ea66d7fdbf" data-file-name="components/order-data-processor.tsx">Customer Name</span></h3>
                        <p className="text-lg font-medium" data-unique-id="7be15815-ba0d-455d-b682-e1c149d33bad" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start" data-unique-id="2d7564c2-c15c-4d3f-a05d-99b89b57d1d1" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="af3f297b-942b-4549-af63-028f03dc7db1" data-file-name="components/order-data-processor.tsx">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1" data-unique-id="6bdddc5b-c1a6-4ebc-9004-e788b577afcc" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="f3835629-503c-48db-9376-7d5119e382cb" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="eb337102-2846-45a3-920d-7ef06596fec4" data-file-name="components/order-data-processor.tsx">Email Address</span></h3>
                        {isEditingEmail ? <div className="flex items-center mt-1" data-unique-id="68dfe53b-7165-466a-beb0-c5cc213d0c15" data-file-name="components/order-data-processor.tsx">
                            <input type="email" value={tempEmail} onChange={e => setTempEmail(e.target.value)} className="flex-1 border border-border rounded-md px-2 py-1 text-sm" placeholder="Enter customer email" data-unique-id="0b8c6b5a-fbd9-4edf-ae29-5982675c258d" data-file-name="components/order-data-processor.tsx" />
                            <button onClick={saveCustomerEmail} className="ml-2 p-1 bg-primary text-white rounded-md" title="Save email" data-unique-id="d56fcbe2-b29e-47a5-ae07-14f5ae557fbd" data-file-name="components/order-data-processor.tsx">
                              <Save className="h-4 w-4" />
                            </button>
                            <button onClick={() => {
                        setIsEditingEmail(false);
                        setTempEmail(selectedOrder.shipToEmail || '');
                      }} className="ml-1 p-1 bg-secondary text-secondary-foreground rounded-md" title="Cancel" data-unique-id="5b8c8106-1257-4b7f-a151-9d4a6bca1a5a" data-file-name="components/order-data-processor.tsx">
                              <X className="h-4 w-4" />
                            </button>
                          </div> : <div className="flex items-center" data-unique-id="cb87e4d4-e4cc-4f7d-9551-98173bebd8ec" data-file-name="components/order-data-processor.tsx">
                            <p className="text-lg" data-unique-id="baa7e2f2-31cb-447b-a05f-277cc9e05d14" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToEmail || 'No email provided'}</p>
                            <button onClick={() => setIsEditingEmail(true)} className="ml-2 p-1 hover:bg-accent/20 rounded-md" title="Edit email" data-unique-id="5dd62f1f-ede7-4754-aa02-d985e764c838" data-file-name="components/order-data-processor.tsx">
                              <Edit className="h-4 w-4 text-primary" />
                            </button>
                          </div>}
                      </div>
                    </div>
                    
                    <div className="flex items-start" data-unique-id="3a40ffcd-2091-4da9-a022-77ded5bfb960" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="08838f4d-f57f-4faf-82b3-9cabb73d1321" data-file-name="components/order-data-processor.tsx">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="02028971-e4b7-4f85-bc5a-f414394e2698" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="7e398d0b-0c54-474c-9596-af0dffa944ea" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="e146483d-6a88-4af2-86f2-89e6066e56de" data-file-name="components/order-data-processor.tsx">Phone Number</span></h3>
                        <p className="text-lg" data-unique-id="62f69209-51fa-401e-8a80-00665fb9b5b8" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToPhone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Information */}
                  <div className="space-y-4" data-unique-id="0b5298af-3445-4bb3-acac-8011573ebcb5" data-file-name="components/order-data-processor.tsx">
                    <div className="flex items-start" data-unique-id="4af2ba62-be7a-4cc8-9f64-27523156f9f6" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="adfc8dc1-ecf4-4302-92c2-95f76368ad4e" data-file-name="components/order-data-processor.tsx">
                        <Home className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="7a57bcc4-6d8c-48bd-b5f6-a2902da7ef2a" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="5b3b3410-a54a-46d0-a7d0-a47a4a062f6d" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="2261e0f3-fa3b-4ce9-b873-7380f086d08c" data-file-name="components/order-data-processor.tsx">Shipping Address</span></h3>
                        <p className="text-lg" data-unique-id="4ca795ac-f01d-4189-b488-9578f800fd4d" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToLine1}</p>
                        <p className="text-lg" data-unique-id="42355694-3884-4a1b-a59e-4d038eb68d17" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToCity}<span className="editable-text" data-unique-id="6f537ea5-cf0a-43ac-a571-cdb39ced5f76" data-file-name="components/order-data-processor.tsx">, </span>{selectedOrder.shipToStateProvince} {selectedOrder.shipToPostalCode}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start" data-unique-id="bb349488-2644-4582-a30e-1852c355925f" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="a9b3224f-9f1c-443c-ad2d-7581f7eddd79" data-file-name="components/order-data-processor.tsx">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="07c1325c-62ce-4a91-a3e2-2feeaa52c019" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="719701ec-e074-4059-a931-701981c428c6" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="7f1c63ee-a36e-4877-aa00-a019dc8c6b3d" data-file-name="components/order-data-processor.tsx">Order Total</span></h3>
                        <p className="text-lg font-medium" data-unique-id="15ce0a45-29c0-4eed-bbed-5664ec89b21f" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="9ae32d19-7d79-4e7e-84b8-15a099a79b3c" data-file-name="components/order-data-processor.tsx">$</span>{selectedOrder.orderTotal.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start" data-unique-id="c49b5f71-af63-4616-b781-9fce4cbd8b98" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="983b8431-1841-4ee4-a1d6-818b32802f04" data-file-name="components/order-data-processor.tsx">
                        <Info className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="4719407e-0aa0-4f38-b8fc-7dd066027b44" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="74cac469-5467-46a1-b4f2-9cfc3717818d" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="768e5a5e-b968-41c7-af24-835a19eaac1e" data-file-name="components/order-data-processor.tsx">Order Source</span></h3>
                        <p className="text-lg" data-unique-id="374bd527-d6bc-4793-ae02-9c86122bf172" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.orderSource || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracking Information */}
                <div className="mt-6 pt-6 border-t border-border" data-unique-id="bbd45589-ca55-410e-9d3e-19f40ddc0d4e" data-file-name="components/order-data-processor.tsx">
                  <h3 className="text-lg font-medium mb-4" data-unique-id="17c0e69a-d50b-4a5f-af8f-22f2cd1a13d8" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="bee4ea82-d414-4f4f-b312-f43d3b6c0d24" data-file-name="components/order-data-processor.tsx">Tracking Information</span></h3>
                  <div className="space-y-3" data-unique-id="56500936-72fd-4f83-8724-af4589d2a160" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                    {selectedOrder.trackingNumbers.map((number, index) => <div key={index} className="flex items-center p-3 bg-accent/10 rounded-md" data-unique-id="7195d973-ab9e-47a5-bb09-8ba0d210a8d2" data-file-name="components/order-data-processor.tsx">
                        <MapPin className="h-5 w-5 text-primary mr-3" data-unique-id="5920143d-ff5b-4acc-843c-92b3f2ab863c" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                        <span className="font-medium mr-2" data-unique-id="81d2ea94-37a5-4269-b0db-6ac70a764f13" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="60b9f441-3735-4de9-a0f0-b5249f914265" data-file-name="components/order-data-processor.tsx">Tracking #</span>{index + 1}<span className="editable-text" data-unique-id="9fad8769-d47a-4f86-9ff2-e04ad3854772" data-file-name="components/order-data-processor.tsx">:</span></span>
                        <div className="flex items-center flex-wrap" data-unique-id="6a1972b6-9fa2-44dc-8f00-ce9c17732b04" data-file-name="components/order-data-processor.tsx">
                          <a href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${number}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center" data-unique-id="bdc3a8ef-ae2a-4631-be27-65fc347477c3" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                            {number}
                            <ExternalLink className="ml-1 h-4 w-4" data-unique-id="9aceeb4c-d068-4153-8c45-b38ebd35ffd4" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                          </a>
                          <button onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(number).then(() => toast.success('Tracking number copied!')).catch(err => console.error('Failed to copy tracking number:', err));
                      }
                    }} className="ml-2 p-1 rounded-full hover:bg-accent/20 transition-colors" title="Copy tracking number" data-unique-id="001874d6-53f2-48ee-8f65-aeb699a679a3" data-file-name="components/order-data-processor.tsx">
                            <Copy className="h-4 w-4 text-primary" data-unique-id="70283a8d-84d4-4cd2-af74-3ffff117726e" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                          </button>
                          <button onClick={() => {
                      const trackingUrl = `https://www.fedex.com/apps/fedextrack/?tracknumbers=${number}`;
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(trackingUrl).then(() => toast.success('Tracking link copied!')).catch(err => console.error('Failed to copy tracking link:', err));
                      }
                    }} className="ml-1 p-1 rounded-full hover:bg-accent/20 transition-colors" title="Copy FedEx link" data-unique-id="138ba2f4-1caa-419c-a219-8238a52dfd7d" data-file-name="components/order-data-processor.tsx">
                            <svg className="h-4 w-4 text-[#4D148C]" viewBox="0 0 24 24" fill="currentColor" data-unique-id="a16bcd9f-b45b-41c3-a896-612c2440b0ab" data-file-name="components/order-data-processor.tsx">
                              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 5a3 3 0 11-3 3 3 3 0 013-3zm0 11.13c-2.03-.31-3.88-1.47-5.14-3.13h10.28c-1.26 1.66-3.11 2.82-5.14 3.13z" data-unique-id="b87abb08-541a-4d0c-bb6d-507c6cf3727e" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                            </svg>
                          </button>
                        </div>
                      </div>)}
                    {selectedOrder.trackingNumbers.length === 0 && <p className="text-muted-foreground italic" data-unique-id="62c9998e-d008-444c-920e-ff304adaa49d" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="773a1d6b-4692-4cad-b3df-a795b23a7d2a" data-file-name="components/order-data-processor.tsx">No tracking numbers available</span></p>}
                  </div>
                </div>

                {/* Order Summary */}
                {selectedOrder.orderSummary && <div className="mt-6 pt-6 border-t border-border" data-unique-id="ed4b994d-2804-4055-9369-3da31e8d553f" data-file-name="components/order-data-processor.tsx">
                    <h3 className="text-lg font-medium mb-2" data-unique-id="b6eb513d-d622-4c00-8c56-d955cc99c6dc" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="72dd4500-0d4f-4577-a85f-729daa65cde9" data-file-name="components/order-data-processor.tsx">Order Summary</span></h3>
                    <div className="p-4 bg-accent/10 rounded-md" data-unique-id="e852e3d7-97a6-445c-a318-de16f6a9d34f" data-file-name="components/order-data-processor.tsx">
                      <p data-unique-id="e3eed646-7536-48d3-a281-72b6a1950cbd" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.orderSummary}</p>
                    </div>
                  </div>}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border bg-muted/30 flex justify-end" data-unique-id="850d995c-0e9a-494e-99b5-38b00adb8a57" data-file-name="components/order-data-processor.tsx">
                <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="d1dad070-5f6f-40e9-9d0d-a8d5d1dcccb5" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="8123b3cd-01be-477d-8014-b4bbf8085d2f" data-file-name="components/order-data-processor.tsx">
                  Close
                </span></button>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
    </motion.div>;
}