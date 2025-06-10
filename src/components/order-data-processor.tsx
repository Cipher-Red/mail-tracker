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
  }} className="w-full max-w-[100%] mx-auto px-2" data-unique-id="52a47df8-0e00-4dba-801b-3ac28f13163a" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
      <Toaster position="top-center" toastOptions={{
      duration: 3000
    }} />
      
      <div className="mb-8" data-unique-id="0f83c5ef-8596-4d86-83fa-a00f22e74a55" data-file-name="components/order-data-processor.tsx">
        <h1 className="text-3xl font-bold text-primary mb-2" data-unique-id="cc446406-ba34-4434-81f2-fc6aedf82799" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="9cb0aba9-9c80-478f-9cce-70dfffaa39a9" data-file-name="components/order-data-processor.tsx">
          Order Data Processor
        </span></h1>
        <p className="text-muted-foreground" data-unique-id="21269215-54c2-474e-8e51-0015cc7661f0" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="f4eaf16c-7996-4ce3-a122-5d7438845676" data-file-name="components/order-data-processor.tsx">
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
    }} className="mt-8" data-unique-id="e1af0664-64ea-4c42-822d-cbcebc1aa1f3" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
          <div className="flex justify-between items-center mb-6" data-unique-id="b4bf965d-9b01-4aea-858a-8f12653bf9f9" data-file-name="components/order-data-processor.tsx">
            <div data-unique-id="1399fabb-e643-46a2-be22-ba3838880bb9" data-file-name="components/order-data-processor.tsx">
              <h2 className="text-xl font-semibold flex items-center" data-unique-id="416721f4-822c-4bbe-b4af-27b561c72373" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                <FileSpreadsheet className="mr-2 h-5 w-5" /><span className="editable-text" data-unique-id="99917113-bd24-4707-beec-530cff05c114" data-file-name="components/order-data-processor.tsx">
                Processed Orders (</span>{data.length}<span className="editable-text" data-unique-id="30774fb7-8215-4e8f-9065-7677d9128db2" data-file-name="components/order-data-processor.tsx">)
              </span></h2>
              
              <div className="mt-2 flex flex-wrap gap-3" data-unique-id="3d0e9fa3-91d2-4adf-ae6f-edbf7b4bf84d" data-file-name="components/order-data-processor.tsx">
                <div className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full" data-unique-id="627bd3b7-6359-49d6-bf68-280bccb48bce" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="a8faaba2-967d-4a53-a499-b75bc10fa804" data-file-name="components/order-data-processor.tsx">
                  Total: </span>{processingStats.total}
                </div>
                <div className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full" data-unique-id="596dfda4-f0cd-4de8-b40e-ded5e73b50a5" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="962db5ff-44e2-475e-85c3-f5dbd2386508" data-file-name="components/order-data-processor.tsx">
                  Processed: </span>{processingStats.processed}
                </div>
                <div className="text-sm bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full" data-unique-id="3581d7d0-d052-451a-b83b-6c1936c5d68a" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="09e4b9c4-57aa-40b9-8519-93d7d1817a87" data-file-name="components/order-data-processor.tsx">
                  Filtered: </span>{processingStats.filtered}
                </div>
                <div className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded-full" data-unique-id="4da830f7-42e5-4929-baf8-1e98025bcf9d" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="12277abc-281d-406a-b343-5cf8611efd70" data-file-name="components/order-data-processor.tsx">
                  Invalid: </span>{processingStats.invalid}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3" data-unique-id="587d4ef6-7ccd-4f01-b58a-e0cf15589f66" data-file-name="components/order-data-processor.tsx">
              <button onClick={sendEmailsToCustomers} className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="b39b3bbc-feb9-45d0-92e5-6c192799ab6e" data-file-name="components/order-data-processor.tsx">
                <Mail className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="1d526408-c98c-4e74-91a2-9bc71092a529" data-file-name="components/order-data-processor.tsx">
                Create Emails
              </span></button>
              
              <button onClick={() => setShowAnalytics(!showAnalytics)} className={`flex items-center px-4 py-2 ${showAnalytics ? 'bg-purple-600' : 'bg-green-600'} text-white rounded-md hover:${showAnalytics ? 'bg-purple-700' : 'bg-green-700'} transition-colors`} data-unique-id="602f2985-36fe-4706-9aa8-4d3cc6948360" data-file-name="components/order-data-processor.tsx">
                <BarChart3 className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="f00fa559-6899-4c9a-b11e-62a43fdc1d5f" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
              </span></button>
              
              <button onClick={exportProcessedData} className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors" data-unique-id="9ba50b80-1ead-41fe-ac1e-09e8e818545f" data-file-name="components/order-data-processor.tsx">
                <DownloadIcon className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="db2a6d4d-f99f-4e9a-a972-eba62da6d41e" data-file-name="components/order-data-processor.tsx">
                Export Data
              </span></button>
              
              <button onClick={cleanAllOrders} className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors" data-unique-id="5b318786-8c6e-4b53-89b5-ba1d38c7476b" data-file-name="components/order-data-processor.tsx">
                <Trash2 className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="66cde231-b3ba-46be-8d02-66dedddb3e0e" data-file-name="components/order-data-processor.tsx">
                Clean All
              </span></button>
              
              <button onClick={archiveCurrentExcel} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors ml-3" data-unique-id="bca22e62-26b4-48db-85db-ca30ea6cb530" data-file-name="components/order-data-processor.tsx">
                <Archive className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="d0c47f97-2fd0-417e-b19b-c148bc588858" data-file-name="components/order-data-processor.tsx">
                Archive Data
              </span></button>
              
              <button onClick={() => setShowArchives(!showArchives)} className={`flex items-center px-4 py-2 ${showArchives ? 'bg-amber-600' : 'bg-blue-600'} text-white rounded-md hover:${showArchives ? 'bg-amber-700' : 'bg-blue-700'} transition-colors ml-3`} data-unique-id="943fd400-db37-4def-b570-be58ec11c6bb" data-file-name="components/order-data-processor.tsx">
                <FileSpreadsheet className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="47a86f3c-92f3-44ab-ab67-33ffcca73f28" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
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
        }} className="mb-6 mt-4" data-unique-id="b8508245-f4c4-4373-923c-d0904e437897" data-file-name="components/order-data-processor.tsx">
                <div className="bg-card border border-border rounded-lg p-6 shadow-md" data-unique-id="af098fe2-5ca2-4a0b-98de-29c139ae6c78" data-file-name="components/order-data-processor.tsx">
                  <h3 className="text-lg font-medium mb-4 flex items-center" data-unique-id="caed38c2-dffa-48bf-847e-6bb0e622ff99" data-file-name="components/order-data-processor.tsx">
                    <BarChart3 className="mr-2 h-5 w-5 text-green-500" />
                    <span className="editable-text" data-unique-id="785d57d9-6773-4fee-895a-d4ccc348fe73" data-file-name="components/order-data-processor.tsx">Order Analytics</span>
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
        }} className="mb-6 mt-4" data-unique-id="7aba4156-6ed5-472c-b4fb-767be639e37b" data-file-name="components/order-data-processor.tsx">
                <div className="bg-card border border-border rounded-lg p-4 shadow-md" data-unique-id="b7f29c38-d6fd-41bc-843a-ee8b3e46965e" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                  <h3 className="text-lg font-medium mb-4 flex items-center" data-unique-id="5ac7e1c6-e1f8-48ea-bd69-fe32be3422c5" data-file-name="components/order-data-processor.tsx">
                    <Archive className="mr-2 h-5 w-5 text-amber-500" />
                    <span className="editable-text" data-unique-id="13240aa9-09ea-43bd-860d-82b6a5d61cee" data-file-name="components/order-data-processor.tsx">Archived Excel Files</span>
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
          <div className="mb-6 relative" data-unique-id="12a016b8-de07-46fd-ad4a-c4f6e1eb1304" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
            <div className="relative" data-unique-id="9bd28887-fbbd-423a-a26e-dde21764e0bc" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by order number..." className="pl-10 pr-4 py-2 w-full border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" data-unique-id="7ee99c95-a899-46d6-909b-430051df6e03" data-file-name="components/order-data-processor.tsx" />
              {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground" data-unique-id="39ccbf20-7038-42c3-870f-03837f47cd6d" data-file-name="components/order-data-processor.tsx">
                  <X className="h-4 w-4" />
                </button>}
            </div>
            {searchQuery && <div className="mt-2 text-sm text-muted-foreground" data-unique-id="13b4e2b5-1e2f-4b4b-b94b-fe189e9dca40" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="589f4775-5d60-455d-a3bb-76dd91f5f1dc" data-file-name="components/order-data-processor.tsx">
                Found </span>{filteredData.length}<span className="editable-text" data-unique-id="28ef573d-7df9-42e1-a526-54122b25983e" data-file-name="components/order-data-processor.tsx"> orders matching "</span>{searchQuery}<span className="editable-text" data-unique-id="2405a3d0-a5e2-44f1-bb17-47c1cb63afcb" data-file-name="components/order-data-processor.tsx">"
              </span></div>}
          </div>
          
          {/* Display Table */}
          <div className="bg-card rounded-lg border border-border shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl" data-unique-id="08ddc302-99d4-4206-9059-5dfc90318c38" data-file-name="components/order-data-processor.tsx">
            <DataTable data={filteredData} onRowClick={showCustomerDetails} actionColumn={row => <div className="flex space-x-1" data-unique-id="86f81723-7863-41c4-a14f-232ae3b891a7" data-file-name="components/order-data-processor.tsx">
                  <button onClick={() => showCustomerDetails(row)} className="p-2 rounded-full hover:bg-accent/20" title="View Customer Details" data-unique-id="dbe65fa9-1ef9-42ad-bc7c-761ac06edef2" data-file-name="components/order-data-processor.tsx">
                    <Eye className="h-4 w-4 text-primary" />
                  </button>
                  <button onClick={e => {
            e.stopPropagation();
            openOrderInShipStation(row.customerOrderNumber);
          }} className="p-2 rounded-full hover:bg-accent/20" title="Open in ShipStation" data-unique-id="d4f8dd33-c954-4783-88d1-d6f91393c239" data-file-name="components/order-data-processor.tsx">
                    <ExternalLink className="h-4 w-4 text-blue-500" />
                  </button>
                  <button onClick={e => {
            e.stopPropagation();
            copyOrderNumber(row.customerOrderNumber);
          }} className="p-2 rounded-full hover:bg-accent/20" title="Copy order number" data-unique-id="f55f6c52-68ab-497a-acb5-441c9d55f712" data-file-name="components/order-data-processor.tsx">
                    <Copy className="h-4 w-4 text-gray-600" />
                  </button>
                  <button onClick={e => {
            e.stopPropagation();
            removeOrder(row);
          }} className="p-2 rounded-full hover:bg-red-100 transition-colors" title="Remove order" data-unique-id="cb35e14b-7037-4dd6-8a98-80caa76639cf" data-file-name="components/order-data-processor.tsx">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>} renderCell={(key, value, row) => {
          // Make tracking numbers clickable
          if (key === 'trackingNumbers' && Array.isArray(value)) {
            return <div className="space-y-1" data-unique-id="a0e2ae9c-e1ff-4e83-a206-2af0805812e1" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                    {value.map((num, idx) => <a key={idx} href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${num}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:underline" data-unique-id="d24d9451-85ba-4ad7-8882-be79121f4340" data-file-name="components/order-data-processor.tsx">
                      <span className="mr-1" data-unique-id="778d463f-930f-4dc0-bf4b-0355f83ff939" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{num.length > 15 ? `${num.slice(0, 15)}...` : num}</span>
                      <ExternalLink className="h-3 w-3" data-unique-id="5e963a03-666a-4da9-ba90-8ff07d189994" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                    </a>)}
                  </div>;
          }

          // Make order number clickable
          if (key === 'customerOrderNumber') {
            const orderLink = `https://ship.shipstation.com/orders/awaiting-shipment/order/${row.id || 'unknown'}/active/${value}`;
            return <a href={orderLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" onClick={e => e.stopPropagation()} data-unique-id="d7842cee-799b-473f-888b-06cc5c07980d" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                      {value}
                    </a>;
          }
          return null; // Use default rendering for other cells
        }} />
          </div>
          
          {/* Warning about filtered data */}
          {processingStats.filtered > 0 && <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md" data-unique-id="ca628a2a-43dd-4427-aa18-d942ba5ee2b1" data-file-name="components/order-data-processor.tsx">
              <div className="flex items-center" data-unique-id="2129d0a9-da51-47ce-a5f2-3a53ceac9409" data-file-name="components/order-data-processor.tsx">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-yellow-800 font-medium" data-unique-id="746e0bd9-616c-45ae-9e3a-c35dcf8033e4" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="2875fe31-d834-499f-8138-4d0c119f0a67" data-file-name="components/order-data-processor.tsx">Some entries were filtered out</span></p>
              </div>
              <p className="text-sm text-yellow-700 mt-1" data-unique-id="e05543af-2f7e-4761-9aaa-433e351e06c1" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                {processingStats.filtered}<span className="editable-text" data-unique-id="dbd5f2a8-82c5-44b1-95b6-ff46b860efa6" data-file-name="components/order-data-processor.tsx"> entries were filtered out because they didn't meet the requirements
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
      }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)} data-unique-id="e511e70e-1e32-42f4-a549-c9bd9bbfe481" data-file-name="components/order-data-processor.tsx">
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
        }} className="bg-card rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden" onClick={e => e.stopPropagation()} data-unique-id="3672a66d-4c54-45a4-a8a5-09cad23c4adb" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
              {/* Header */}
              <div className="bg-primary text-white p-6" data-unique-id="24d72090-6b2c-42e0-8629-067514567160" data-file-name="components/order-data-processor.tsx">
                <div className="flex justify-between items-start" data-unique-id="82805f8c-57ac-4754-aff9-8a0d3b9190f7" data-file-name="components/order-data-processor.tsx">
                  <div data-unique-id="6b93d914-7808-4c84-801c-1b38b42505e2" data-file-name="components/order-data-processor.tsx">
                    <div className="flex items-center" data-unique-id="b34b266e-e751-44f6-8a7c-cc61bc882142" data-file-name="components/order-data-processor.tsx">
                      <h2 className="text-xl font-semibold" data-unique-id="b433a2cc-320c-4262-b3e7-1dff021498d5" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="8c1f3aae-e16d-4a2b-a698-3491359de04a" data-file-name="components/order-data-processor.tsx">Customer Order #</span>{selectedOrder.customerOrderNumber}</h2>
                      <button onClick={() => copyOrderNumber(selectedOrder.customerOrderNumber)} className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors" title="Copy order number" data-unique-id="9e59fa32-83a2-4c55-b318-aab4d70847f2" data-file-name="components/order-data-processor.tsx">
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-primary-foreground/80 mt-1" data-unique-id="eb883178-0505-4f41-8b5e-df2461833d4f" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="29e15eb8-68ea-46c3-bae7-d14a1a669d6e" data-file-name="components/order-data-processor.tsx">Shipped on </span>{new Date(selectedOrder.actualShipDate).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="text-white hover:bg-white/10 rounded-full p-2 transition-colors" data-unique-id="97added7-61e2-4c1c-9f81-8bac59b336f6" data-file-name="components/order-data-processor.tsx">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto" data-unique-id="68b4c5f1-eb81-4938-ad4a-0153883c2c49" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="24cbea06-44db-4ec8-85ef-fea096a31ba9" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                  {/* Customer Information */}
                  <div className="space-y-4" data-unique-id="dcf3bf71-e663-4c8e-8ab0-22653b57b0c1" data-file-name="components/order-data-processor.tsx">
                    <div className="flex items-start" data-unique-id="4135aae1-e6f8-4889-a581-04079635de01" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="d3459ac1-1ad0-44b6-87cc-c62bfcc8a60d" data-file-name="components/order-data-processor.tsx">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="f056af0f-0cc1-44cc-a3c0-e824715bc3b3" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="0117eb64-f00f-4a9e-8f94-1f94825b1114" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="561dbdb9-fcd2-48a2-8c0b-491175f4d1e4" data-file-name="components/order-data-processor.tsx">Customer Name</span></h3>
                        <p className="text-lg font-medium" data-unique-id="0e74127c-b0e3-462e-9edb-966b37c4e85b" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start" data-unique-id="dcccc85d-5687-48ff-a924-e6285c74ec58" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="8e178d19-4c31-49b5-84f9-12f09a5b96c4" data-file-name="components/order-data-processor.tsx">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1" data-unique-id="fe471c68-0638-435d-80e0-f41f361c7501" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="5389b413-4dbc-4b05-b51f-f09e4bca2172" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="6bbfb85d-e52d-4e62-9f74-2d36743525f9" data-file-name="components/order-data-processor.tsx">Email Address</span></h3>
                        {isEditingEmail ? <div className="flex items-center mt-1" data-unique-id="c7314e83-d510-4e40-ad35-9143141038ee" data-file-name="components/order-data-processor.tsx">
                            <input type="email" value={tempEmail} onChange={e => setTempEmail(e.target.value)} className="flex-1 border border-border rounded-md px-2 py-1 text-sm" placeholder="Enter customer email" data-unique-id="4d358311-851a-419b-a9e1-8996fdabbfc1" data-file-name="components/order-data-processor.tsx" />
                            <button onClick={saveCustomerEmail} className="ml-2 p-1 bg-primary text-white rounded-md" title="Save email" data-unique-id="26f45be8-0452-4848-9e1f-e2a2c5b92d62" data-file-name="components/order-data-processor.tsx">
                              <Save className="h-4 w-4" />
                            </button>
                            <button onClick={() => {
                        setIsEditingEmail(false);
                        setTempEmail(selectedOrder.shipToEmail || '');
                      }} className="ml-1 p-1 bg-secondary text-secondary-foreground rounded-md" title="Cancel" data-unique-id="d36629b6-8db0-4dbb-8249-887be16de0f3" data-file-name="components/order-data-processor.tsx">
                              <X className="h-4 w-4" />
                            </button>
                          </div> : <div className="flex items-center" data-unique-id="55d48167-11f2-4dfe-9661-8cf34bbfec79" data-file-name="components/order-data-processor.tsx">
                            <p className="text-lg" data-unique-id="f1f09a86-dfbd-44c9-b022-83017a4a9d71" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToEmail || 'No email provided'}</p>
                            <button onClick={() => setIsEditingEmail(true)} className="ml-2 p-1 hover:bg-accent/20 rounded-md" title="Edit email" data-unique-id="b094f2c8-c030-4b82-9b73-0841d0a9c93a" data-file-name="components/order-data-processor.tsx">
                              <Edit className="h-4 w-4 text-primary" />
                            </button>
                          </div>}
                      </div>
                    </div>
                    
                    <div className="flex items-start" data-unique-id="2011c33f-ff1c-4c4f-9c69-b94e9454fba5" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="c8bc43b2-e6a6-4217-8eb0-3f3715da893d" data-file-name="components/order-data-processor.tsx">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="44334036-856b-4136-b550-9212cd10e0b5" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="186e68e7-9140-4724-b86a-0939791b242d" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="201022fc-640e-4162-9fae-48c532d10b13" data-file-name="components/order-data-processor.tsx">Phone Number</span></h3>
                        <p className="text-lg" data-unique-id="6214f204-df5e-4033-9c45-f7a344107fdf" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToPhone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Information */}
                  <div className="space-y-4" data-unique-id="773a51c3-a866-4933-a0c5-552cbaa6d44a" data-file-name="components/order-data-processor.tsx">
                    <div className="flex items-start" data-unique-id="4ae5ae55-fb06-4b41-b3d6-4086589e3363" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="5fd935cc-3811-4694-a930-95eeef6a504e" data-file-name="components/order-data-processor.tsx">
                        <Home className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="1e75b199-ed46-4150-ac58-87673f5a450f" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="5045753a-cec4-49c3-843f-3f9bc35f3263" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="b94fce81-c60f-4c84-86fd-3fdbc3608998" data-file-name="components/order-data-processor.tsx">Shipping Address</span></h3>
                        <p className="text-lg" data-unique-id="7b792d25-f2d8-40da-a4d2-0b735adfb5a3" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToLine1}</p>
                        <p className="text-lg" data-unique-id="56e62890-8203-48bb-bd03-e08a9087054a" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.shipToCity}<span className="editable-text" data-unique-id="4c6187b8-9fe1-4554-aa94-ef953823c5fc" data-file-name="components/order-data-processor.tsx">, </span>{selectedOrder.shipToStateProvince} {selectedOrder.shipToPostalCode}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start" data-unique-id="8c6f7984-5e4c-4ca4-9e49-c6f682dcd5dc" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="0fa02ba1-edff-46db-867d-705dfc23dd0d" data-file-name="components/order-data-processor.tsx">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="d59115ed-b11e-4605-8adf-7643f8e0c5dc" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="79b604d6-41ac-43ee-8f2b-f8224659c6b4" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="34b6cd4a-a425-4888-95da-b5bee0f137cc" data-file-name="components/order-data-processor.tsx">Order Total</span></h3>
                        <p className="text-lg font-medium" data-unique-id="5c261aff-cc78-4aa2-a277-9d4b071e846d" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="e4e4accb-9d5c-49d4-8965-4bc27ba871f9" data-file-name="components/order-data-processor.tsx">$</span>{selectedOrder.orderTotal.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start" data-unique-id="60688145-f80b-414f-9fef-9616ad6846a6" data-file-name="components/order-data-processor.tsx">
                      <div className="bg-primary/10 p-2 rounded-full mr-3" data-unique-id="467d0af1-9303-40cf-9dd4-89cfad62b379" data-file-name="components/order-data-processor.tsx">
                        <Info className="h-5 w-5 text-primary" />
                      </div>
                      <div data-unique-id="26dddd53-41f2-46ca-9fd5-4997bf74116d" data-file-name="components/order-data-processor.tsx">
                        <h3 className="text-sm font-medium text-muted-foreground" data-unique-id="30319626-bca3-49e8-a579-75ac86b3e93f" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="0646d902-66b0-48b6-886d-c55cce0bf370" data-file-name="components/order-data-processor.tsx">Order Source</span></h3>
                        <p className="text-lg" data-unique-id="a56a3e85-b3d5-46b2-801a-25066b2d99f1" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.orderSource || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracking Information */}
                <div className="mt-6 pt-6 border-t border-border" data-unique-id="252c06ab-d0ff-45ac-bb97-f9c3ca877015" data-file-name="components/order-data-processor.tsx">
                  <h3 className="text-lg font-medium mb-4" data-unique-id="a0b74921-409a-468c-81a7-66fa35016f0f" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="23d03d4c-a4e6-490e-b9d7-5eadf87a6b5f" data-file-name="components/order-data-processor.tsx">Tracking Information</span></h3>
                  <div className="space-y-3" data-unique-id="d9b8eda4-dbde-4315-95fa-fa980b75e232" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                    {selectedOrder.trackingNumbers.map((number, index) => <div key={index} className="flex items-center p-3 bg-accent/10 rounded-md" data-unique-id="19579dce-5b0f-46ff-8823-c492a0fd2021" data-file-name="components/order-data-processor.tsx">
                        <MapPin className="h-5 w-5 text-primary mr-3" data-unique-id="9aaa2826-3dbd-4457-b569-cc30a9c75012" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                        <span className="font-medium mr-2" data-unique-id="aaa9e913-a4e9-4235-8ae4-f44ce240975a" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="93c47188-0ae6-4cc1-ba47-5f8aba225a0b" data-file-name="components/order-data-processor.tsx">Tracking #</span>{index + 1}<span className="editable-text" data-unique-id="53616ecc-e8c1-4107-8b2c-1276046420ea" data-file-name="components/order-data-processor.tsx">:</span></span>
                        <div className="flex items-center flex-wrap" data-unique-id="bbde9ea0-154b-4519-874e-286d2e346bc0" data-file-name="components/order-data-processor.tsx">
                          <a href={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${number}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center" data-unique-id="686de098-fe0f-4415-8430-512cc5005a45" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">
                            {number}
                            <ExternalLink className="ml-1 h-4 w-4" data-unique-id="d6eb2a17-19c8-42d4-980f-7fb1bc4da5e0" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                          </a>
                          <button onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(number).then(() => toast.success('Tracking number copied!')).catch(err => console.error('Failed to copy tracking number:', err));
                      }
                    }} className="ml-2 p-1 rounded-full hover:bg-accent/20 transition-colors" title="Copy tracking number" data-unique-id="60db2cf8-0654-4c00-b104-4910db91131a" data-file-name="components/order-data-processor.tsx">
                            <Copy className="h-4 w-4 text-primary" data-unique-id="3548f730-96f7-41ed-8407-7dc97406b136" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                          </button>
                          <button onClick={() => {
                      const trackingUrl = `https://www.fedex.com/apps/fedextrack/?tracknumbers=${number}`;
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(trackingUrl).then(() => toast.success('Tracking link copied!')).catch(err => console.error('Failed to copy tracking link:', err));
                      }
                    }} className="ml-1 p-1 rounded-full hover:bg-accent/20 transition-colors" title="Copy FedEx link" data-unique-id="38414f34-def5-449f-8498-55517a34d2a9" data-file-name="components/order-data-processor.tsx">
                            <svg className="h-4 w-4 text-[#4D148C]" viewBox="0 0 24 24" fill="currentColor" data-unique-id="69bbc61b-a706-4d08-872f-68ff0eb9dfc2" data-file-name="components/order-data-processor.tsx">
                              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 5a3 3 0 11-3 3 3 3 0 013-3zm0 11.13c-2.03-.31-3.88-1.47-5.14-3.13h10.28c-1.26 1.66-3.11 2.82-5.14 3.13z" data-unique-id="fece34d2-b7e3-418a-8799-ea293affc738" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true" />
                            </svg>
                          </button>
                        </div>
                      </div>)}
                    {selectedOrder.trackingNumbers.length === 0 && <p className="text-muted-foreground italic" data-unique-id="4a2436d4-4823-4936-b5bb-56d221ff2cd0" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="43acb22e-e30b-4baa-9f81-6a4c2180f031" data-file-name="components/order-data-processor.tsx">No tracking numbers available</span></p>}
                  </div>
                </div>

                {/* Order Summary */}
                {selectedOrder.orderSummary && <div className="mt-6 pt-6 border-t border-border" data-unique-id="3d30500a-da69-4446-9c16-946c6a4ebc5e" data-file-name="components/order-data-processor.tsx">
                    <h3 className="text-lg font-medium mb-2" data-unique-id="7f8e78a5-42fc-404a-8241-8e09ffd80f3a" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="0d88e11a-de0c-4d24-a540-5a531c63f0c1" data-file-name="components/order-data-processor.tsx">Order Summary</span></h3>
                    <div className="p-4 bg-accent/10 rounded-md" data-unique-id="def4a8c5-aebb-4733-af1a-54ecbc010cf5" data-file-name="components/order-data-processor.tsx">
                      <p data-unique-id="62ac8d43-935c-4406-9e37-c4d7a75f51b7" data-file-name="components/order-data-processor.tsx" data-dynamic-text="true">{selectedOrder.orderSummary}</p>
                    </div>
                  </div>}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border bg-muted/30 flex justify-end" data-unique-id="0bb1ce35-6c17-43e6-8d66-6547d3ca685e" data-file-name="components/order-data-processor.tsx">
                <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="5aa52a65-112d-41fe-9b51-0413fd8614ed" data-file-name="components/order-data-processor.tsx"><span className="editable-text" data-unique-id="7b8743d5-1d64-446b-a18b-c999d27521ef" data-file-name="components/order-data-processor.tsx">
                  Close
                </span></button>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
    </motion.div>;
}