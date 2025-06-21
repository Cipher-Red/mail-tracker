'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, X, Download, File, Loader2, AlertTriangle, Info } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { ReturnedPart } from './returned-parts-manager';
import { validateReturnedPartsData, formatValidationErrors, getValidationSummary, ValidationResult as ExcelValidationResult } from './excel-validation-utils';
import toast from 'react-hot-toast';
interface ExcelReturnedPartsProcessorProps {
  onPartsProcessed: (parts: ReturnedPart[]) => void;
  isOpen: boolean;
  onClose: () => void;
}
interface ExcelPartData {
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
  shipToEmail?: string;
  orderStatus?: string;
}
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
interface ProcessingStats {
  total: number;
  valid: number;
  invalid: number;
  warnings: number;
}
export default function ExcelReturnedPartsProcessor({
  onPartsProcessed,
  isOpen,
  onClose
}: ExcelReturnedPartsProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<ReturnedPart[]>([]);
  const [validationResult, setValidationResult] = useState<ExcelValidationResult | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStats, setProcessingStats] = useState<ProcessingStats>({
    total: 0,
    valid: 0,
    invalid: 0,
    warnings: 0
  });
  const [fileName, setFileName] = useState<string>('');
  const [showValidationDetails, setShowValidationDetails] = useState(false);
  const validateReturnedPart = (row: any, rowIndex: number): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required field validation - using order processor format
    if (!row.customerOrderNumber && !row['Customer Order Number']) {
      errors.push(`Row ${rowIndex + 2}: Customer Order Number is required`);
    }
    if (!row.shipToName && !row['Ship To Name']) {
      errors.push(`Row ${rowIndex + 2}: Ship To Name is required`);
    }
    if (!row.shipToLine1 && !row['Ship To Line1'] && !row.shipToAddress && !row.address) {
      errors.push(`Row ${rowIndex + 2}: Ship To Address is required`);
    }
    if (!row.shipToStateProvince && !row['Ship To State Province'] && !row.shipToState && !row.state) {
      errors.push(`Row ${rowIndex + 2}: Ship To State/Province is required`);
    }

    // Optional field warnings
    if (!row.trackingLinks && !row['Tracking Link(s)'] && !row.trackingNumbers) {
      warnings.push(`Row ${rowIndex + 2}: Tracking information is recommended`);
    }
    if (!row.actualShipDate && !row['Actual Ship Date']) {
      warnings.push(`Row ${rowIndex + 2}: Ship date is recommended`);
    }
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };
  const formatDate = (dateValue: any): string | null => {
    if (!dateValue) return null;
    try {
      // Handle Excel date serial numbers
      if (typeof dateValue === 'number') {
        const date = new Date((dateValue - 25569) * 86400 * 1000);
        return date.toISOString().split('T')[0];
      }

      // Handle string dates
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return null;
      return date.toISOString().split('T')[0];
    } catch {
      return null;
    }
  };
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject
  } = useDropzone({
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        toast.error('Please select a valid Excel file (.xlsx or .xls)');
        return;
      }
      if (acceptedFiles.length > 0) {
        processExcelFile(acceptedFiles[0]);
      }
    },
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1,
    disabled: isProcessing
  });
  const processExcelFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    setValidationResult(null);
    setProcessingProgress(0);
    setFileName(file.name);
    try {
      const reader = new FileReader();
      reader.onload = async e => {
        try {
          setProcessingProgress(20);
          const data = e.target?.result;
          const workbook = XLSX.read(data, {
            type: 'binary'
          });
          if (workbook.SheetNames.length === 0) {
            throw new Error('No worksheets found in the Excel file');
          }
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          setProcessingProgress(40);
          console.log('Raw Excel data:', jsonData);
          if (jsonData.length === 0) {
            throw new Error('No data found in the Excel file');
          }
          setProcessingProgress(60);

          // Process the Excel data directly without complex validation
          const convertedParts: ReturnedPart[] = jsonData.map((row: any, index) => {
            // Try different possible column names for customer name
            const customerName = row['Customer Name'] || row['customerName'] || row['Customer'] || row['customer'] || row['Name'] || row['name'] || '';

            // Try different possible column names for order number
            const orderNumber = row['Customer Order Number'] || row['Order Number'] || row['orderNumber'] || row['Order'] || row['order'] || row['OrderNumber'] || '';

            // Try different possible column names for tracking number
            const trackingNumber = row['Tracking Number'] || row['trackingNumber'] || row['Tracking'] || row['tracking'] || row['TrackingNumber'] || '';
            console.log(`Row ${index + 1}:`, {
              customerName,
              orderNumber,
              trackingNumber,
              originalRow: row
            });
            return {
              id: `import-${Date.now()}-${index}`,
              partName: 'Returned Part',
              // Default value
              partNumber: 'N/A',
              // Default value
              customerName: customerName?.toString().trim() || `Customer ${index + 1}`,
              customerEmail: '',
              // Default empty
              orderNumber: orderNumber?.toString().trim() || `ORD-${Date.now()}-${index}`,
              returnReason: 'Customer Return',
              // Default value
              trackingNumber: trackingNumber?.toString().trim() || '',
              shippedDate: new Date().toISOString().split('T')[0],
              // Today's date
              expectedArrival: '',
              // Default empty
              arrivedDate: undefined,
              inspectionDate: undefined,
              status: 'in_transit' as ReturnedPart['status'],
              // Default status
              notes: '',
              // Default empty
              createdAt: new Date().toISOString()
            };
          });

          // Filter out parts with missing required data
          const validParts = convertedParts.filter(part => part.customerName && part.orderNumber && part.trackingNumber);
          setProcessingProgress(80);
          if (validParts.length === 0) {
            throw new Error('No valid returned parts found. Please ensure your Excel file has columns for Customer Name, Order Number, and Tracking Number.');
          }
          setProcessedData(validParts);
          setProcessingStats({
            total: jsonData.length,
            valid: validParts.length,
            invalid: jsonData.length - validParts.length,
            warnings: 0
          });
          setProcessingProgress(100);
          console.log('Processed parts:', validParts);
          toast.success(`Successfully processed ${validParts.length} returned parts from Excel`);
        } catch (error) {
          console.error('Excel processing error:', error);
          setValidationResult({
            isValid: false,
            errors: [{
              row: 0,
              field: 'file',
              value: null,
              error: `Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`,
              severity: 'error' as const
            }],
            warnings: [],
            validRows: [],
            invalidRows: []
          });
          toast.error('Failed to process Excel file');
        }
        setIsProcessing(false);
        setTimeout(() => setProcessingProgress(0), 1000);
      };
      reader.onerror = () => {
        setValidationResult({
          isValid: false,
          errors: [{
            row: 0,
            field: 'file',
            value: null,
            error: 'Failed to read the file. Please try again.',
            severity: 'error' as const
          }],
          warnings: [],
          validRows: [],
          invalidRows: []
        });
        setIsProcessing(false);
        toast.error('File reading error');
      };
      reader.readAsBinaryString(file);
    } catch (error) {
      setValidationResult({
        isValid: false,
        errors: [{
          row: 0,
          field: 'file',
          value: null,
          error: 'An unexpected error occurred while reading the file',
          severity: 'error' as const
        }],
        warnings: [],
        validRows: [],
        invalidRows: []
      });
      setIsProcessing(false);
      toast.error('File reading error');
    }
  }, []);
  const normalizeStatus = (status: any): ReturnedPart['status'] => {
    if (!status) return 'shipped';
    const statusStr = status.toString().toLowerCase().trim();
    const validStatuses: ReturnedPart['status'][] = ['shipped', 'in_transit', 'arrived', 'inspecting', 'inspected'];

    // Direct match
    if (validStatuses.includes(statusStr as ReturnedPart['status'])) {
      return statusStr as ReturnedPart['status'];
    }

    // Fuzzy matching
    if (statusStr.includes('transit') || statusStr.includes('shipping')) return 'in_transit';
    if (statusStr.includes('arrive') || statusStr.includes('delivered')) return 'arrived';
    if (statusStr.includes('inspect')) return 'inspecting';
    if (statusStr.includes('complete') || statusStr.includes('done')) return 'inspected';
    return 'shipped'; // Default fallback
  };
  const handleImport = () => {
    if (processedData.length > 0) {
      onPartsProcessed(processedData);

      // Reset state
      setProcessedData([]);
      setValidationResult(null);
      setProcessingStats({
        total: 0,
        valid: 0,
        invalid: 0,
        warnings: 0
      });
      setFileName('');
      onClose();
      toast.success(`Successfully imported ${processedData.length} returned parts!`, {
        duration: 5000
      });
    }
  };
  const downloadTemplate = () => {
    const templateData = [{
      'Customer Name': 'John Smith',
      'Customer Order Number': 'ORD-12345678',
      'Tracking Number': 'TRK123456789'
    }, {
      'Customer Name': 'Sarah Johnson',
      'Customer Order Number': 'ORD-87654321',
      'Tracking Number': 'TRK987654321'
    }];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(templateData);

    // Set column widths for returned parts format
    const wscols = [{
      wch: 25
    },
    // Part Name
    {
      wch: 15
    },
    // Part Number
    {
      wch: 20
    },
    // Customer Name
    {
      wch: 25
    },
    // Customer Email
    {
      wch: 20
    },
    // Order Number
    {
      wch: 15
    },
    // Return Reason
    {
      wch: 20
    },
    // Tracking Number
    {
      wch: 15
    },
    // Shipped Date
    {
      wch: 15
    },
    // Expected Arrival
    {
      wch: 12
    },
    // Status
    {
      wch: 30
    } // Notes
    ];
    ws['!cols'] = wscols;
    XLSX.utils.book_append_sheet(wb, ws, 'Returned Parts Template');
    XLSX.writeFile(wb, 'returned-parts-import-template.xlsx');
    toast.success('Returned parts template downloaded successfully');
  };
  const resetForm = () => {
    setProcessedData([]);
    setValidationResult(null);
    setProcessingStats({
      total: 0,
      valid: 0,
      invalid: 0,
      warnings: 0
    });
    setFileName('');
    setProcessingProgress(0);
    setShowValidationDetails(false);
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" data-unique-id="2387f5ba-5209-4cbe-b1d4-0da43c330514" data-file-name="components/excel-returned-parts-processor.tsx">
      <motion.div initial={{
      opacity: 0,
      scale: 0.95
    }} animate={{
      opacity: 1,
      scale: 1
    }} exit={{
      opacity: 0,
      scale: 0.95
    }} className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden" data-unique-id="10f09286-c4f6-41af-acad-d92689dd8bb9" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50" data-unique-id="85c91088-5ead-4f0d-ae11-9ecbc844ee4d" data-file-name="components/excel-returned-parts-processor.tsx">
          <div data-unique-id="fa82a02e-a5b4-4b6c-9d3b-a102f009be0d" data-file-name="components/excel-returned-parts-processor.tsx">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center" data-unique-id="6bcae652-13cb-424c-a34b-d085641f2abc" data-file-name="components/excel-returned-parts-processor.tsx">
              <FileSpreadsheet className="mr-3 h-6 w-6 text-orange-600" /><span className="editable-text" data-unique-id="6e9bf613-d53c-433e-9d4f-dcbceaf8708e" data-file-name="components/excel-returned-parts-processor.tsx">
              Import Returned Parts from Excel
            </span></h2>
            <p className="text-sm text-gray-600 mt-1" data-unique-id="bb60c5c5-d925-44e5-b4ad-c5b6c384f1a0" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="0b560553-de48-4b83-a319-b427bc9f447b" data-file-name="components/excel-returned-parts-processor.tsx">
              Upload an Excel file to import multiple returned parts at once
            </span></p>
          </div>
          <button onClick={() => {
          resetForm();
          onClose();
        }} className="p-2 rounded-full hover:bg-white/50 transition-colors" data-unique-id="4b3807bd-3c9f-4b95-b924-e7fe98ff3045" data-file-name="components/excel-returned-parts-processor.tsx">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto" data-unique-id="6ee97a70-f207-4bed-9163-f31795c3d874" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" data-unique-id="3139737a-674d-4abc-9c7f-f0b2e2b72550" data-file-name="components/excel-returned-parts-processor.tsx">
            <div className="flex items-start" data-unique-id="1d69560f-be5b-4ee3-b785-11678576d229" data-file-name="components/excel-returned-parts-processor.tsx">
              <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="text-sm" data-unique-id="9ffc2dfa-aeec-4ad1-8423-e48c59cd023c" data-file-name="components/excel-returned-parts-processor.tsx">
                <h3 className="font-medium text-blue-900 mb-2" data-unique-id="ebb30799-61ad-4588-a62a-92971c52fb77" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="260167d7-8f69-42ae-9c2a-ba9b6e58c262" data-file-name="components/excel-returned-parts-processor.tsx">Excel File Requirements:</span></h3>
                <div className="text-blue-800 space-y-2" data-unique-id="595d5574-9465-42cf-bc53-f58510a72a56" data-file-name="components/excel-returned-parts-processor.tsx">
                  <div data-unique-id="2c3babb3-6dc8-444d-950b-dbf2ed47aa31" data-file-name="components/excel-returned-parts-processor.tsx">
                    <p data-unique-id="5e328e32-e1f0-43c7-9a00-243873c373c1" data-file-name="components/excel-returned-parts-processor.tsx"><strong data-unique-id="b7487df7-90cd-4fda-b97c-8f68b3244b84" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="5868b57d-49a5-474e-a4b7-29936e7bcb54" data-file-name="components/excel-returned-parts-processor.tsx">Required columns:</span></strong></p>
                    <ul className="ml-4 mt-1 space-y-1" data-unique-id="fb562456-cf26-469c-8f5d-7e263f93cc47" data-file-name="components/excel-returned-parts-processor.tsx">
                      <li data-unique-id="ca5084c3-2e18-48e9-ac62-78fcc4ff8dc1" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="276df52f-c962-4eb1-b38b-55eb449acf6e" data-file-name="components/excel-returned-parts-processor.tsx">• </span><strong data-unique-id="373784df-c38b-4d8a-a29a-ce9e924fe9bd" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="b0c63d17-b541-446b-b601-e8b8ef8118e1" data-file-name="components/excel-returned-parts-processor.tsx">partName</span></strong><span className="editable-text" data-unique-id="f1db0eca-fe6f-48d2-bff9-609512bcb4a9" data-file-name="components/excel-returned-parts-processor.tsx"> - 2-100 characters</span></li>
                      <li data-unique-id="38ba885c-8190-4598-8958-4c691e384d2c" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="a6a47f38-c7d9-4896-9958-1917f6f18e9f" data-file-name="components/excel-returned-parts-processor.tsx">• </span><strong data-unique-id="d8127a2d-7c8f-4479-81e7-fafbf729d004" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="51f0ea7f-4bdc-42d5-b006-1ced91767c54" data-file-name="components/excel-returned-parts-processor.tsx">partNumber</span></strong><span className="editable-text" data-unique-id="d5b3f17f-bf77-4173-b561-597824b58fd1" data-file-name="components/excel-returned-parts-processor.tsx"> - 3-20 alphanumeric characters</span></li>
                      <li data-unique-id="0ac920a9-1726-4453-a59f-751244b770e7" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="90944bd3-18e9-4022-81db-bc44744499c2" data-file-name="components/excel-returned-parts-processor.tsx">• </span><strong data-unique-id="69d56b96-fb36-4734-8b56-b4239d769c48" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="78156b80-2d3c-41b8-9705-f71cc53b6e3c" data-file-name="components/excel-returned-parts-processor.tsx">customerName</span></strong><span className="editable-text" data-unique-id="7b30de0c-c2d6-41a9-aea1-d722d0420da2" data-file-name="components/excel-returned-parts-processor.tsx"> - Minimum 2 characters</span></li>
                      <li data-unique-id="08c89ef9-f948-4282-82a3-ea5476bcf18f" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="fd4502e8-5e7b-4f33-86ae-e4956bc17561" data-file-name="components/excel-returned-parts-processor.tsx">• </span><strong data-unique-id="a83b2568-bae2-4170-b332-119ca635f6d3" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="95ddd0a2-2afb-4001-9e74-0a816f37a570" data-file-name="components/excel-returned-parts-processor.tsx">orderNumber</span></strong><span className="editable-text" data-unique-id="e3485b38-b7d0-43d7-afc3-959965730cf1" data-file-name="components/excel-returned-parts-processor.tsx"> - 3-30 alphanumeric characters</span></li>
                    </ul>
                  </div>
                  
                  <div data-unique-id="0b5d7cbe-4ea3-458f-8405-b8224292a2e9" data-file-name="components/excel-returned-parts-processor.tsx">
                    <p data-unique-id="d0f479ba-8b50-41eb-86a8-3d34efe767c2" data-file-name="components/excel-returned-parts-processor.tsx"><strong data-unique-id="143e5dbe-4d0d-4707-85e4-19603c941ad6" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="402403eb-f828-4be3-aca4-d1ec616beabe" data-file-name="components/excel-returned-parts-processor.tsx">Optional columns:</span></strong></p>
                    <ul className="ml-4 mt-1 space-y-1" data-unique-id="a2d447b0-609d-45b7-9966-3c41ec000302" data-file-name="components/excel-returned-parts-processor.tsx">
                      <li data-unique-id="4d59e356-a43e-410b-894e-d2d7abd57e6c" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="9e5ca289-db63-4d8a-8a59-816ab1524a93" data-file-name="components/excel-returned-parts-processor.tsx">• </span><strong data-unique-id="3845386b-fa85-4c1e-9f9a-3ae6ed18149a" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="a3051290-a783-4925-8ff3-c8d2338f3372" data-file-name="components/excel-returned-parts-processor.tsx">returnReason</span></strong><span className="editable-text" data-unique-id="da56d270-00b7-4e88-bae9-9482f6fc2434" data-file-name="components/excel-returned-parts-processor.tsx"> - Defective, Wrong Part, Customer Return, Warranty, Quality Issue, Other</span></li>
                      <li data-unique-id="bdb365a0-5458-4ab6-ac69-320a0c79de45" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="7222627f-cc96-48e9-b36a-279413adc5f1" data-file-name="components/excel-returned-parts-processor.tsx">• </span><strong data-unique-id="56e2110e-81f5-4a59-bef9-1b1ac949f43d" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="694b0d9c-296a-4da1-ac11-2322ab73341f" data-file-name="components/excel-returned-parts-processor.tsx">trackingNumber</span></strong><span className="editable-text" data-unique-id="646ac886-8bc6-41c1-ba9a-a070ecbb539e" data-file-name="components/excel-returned-parts-processor.tsx"> - 10-30 alphanumeric characters</span></li>
                      <li data-unique-id="389076e2-3d2f-4076-9d64-554cc2b2b7c2" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="42dd6679-90e0-4592-9225-a4763779f9c5" data-file-name="components/excel-returned-parts-processor.tsx">• </span><strong data-unique-id="a6ca46be-a868-492e-b780-68efca08dbf7" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="f02a336e-9c94-4b12-99c3-b7a54b5f70a0" data-file-name="components/excel-returned-parts-processor.tsx">shippedDate</span></strong><span className="editable-text" data-unique-id="5aefe412-1546-4ef4-b90e-17a2b1b4c6cb" data-file-name="components/excel-returned-parts-processor.tsx"> - Date format (YYYY-MM-DD, MM/DD/YYYY, or Excel date)</span></li>
                      <li data-unique-id="cee83897-800b-4c9c-b6c6-0d2a94af4ad2" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="cd6a0378-b103-4154-a469-ada3b04e67a6" data-file-name="components/excel-returned-parts-processor.tsx">• </span><strong data-unique-id="e67be971-7d36-4edf-b94a-4dda6e5d72bf" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="949ba6f4-8860-4825-ad82-c9ce9d658dd2" data-file-name="components/excel-returned-parts-processor.tsx">expectedArrival</span></strong><span className="editable-text" data-unique-id="19108e33-58b1-43f4-932b-0f09358a80ac" data-file-name="components/excel-returned-parts-processor.tsx"> - Date format (must be after shipped date)</span></li>
                      <li data-unique-id="3614df52-2c2a-46e1-ae11-c7befea8f6e8" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="c4e92efb-627d-4953-8ef5-f39252040a3c" data-file-name="components/excel-returned-parts-processor.tsx">• </span><strong data-unique-id="762eb875-62f7-49c7-90f6-224ba8f7cb5e" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="f94d1494-29d6-4ae2-a4f2-af6abcebef9a" data-file-name="components/excel-returned-parts-processor.tsx">status</span></strong><span className="editable-text" data-unique-id="1bb3d4f9-8297-42dc-8fe5-cfe59eb31a49" data-file-name="components/excel-returned-parts-processor.tsx"> - shipped, in_transit, arrived, inspecting, inspected</span></li>
                      <li data-unique-id="ef1dd45e-71f1-4c21-82b6-a98f80885442" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="0d6a99f6-7df6-468e-bdda-d9d58e6f5516" data-file-name="components/excel-returned-parts-processor.tsx">• </span><strong data-unique-id="61200422-7ef0-4eb9-9fa4-96102559c38a" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="3a76f9d1-c35a-46ca-864e-b046e5872c75" data-file-name="components/excel-returned-parts-processor.tsx">notes</span></strong><span className="editable-text" data-unique-id="273e9512-d13e-4296-8664-69faab3b5c4e" data-file-name="components/excel-returned-parts-processor.tsx"> - Maximum 500 characters</span></li>
                    </ul>
                  </div>
                  
                  <div className="mt-3 p-2 bg-blue-100 border border-blue-300 rounded text-blue-800" data-unique-id="1bd9553b-192f-46c5-85be-48f69b8a76ae" data-file-name="components/excel-returned-parts-processor.tsx">
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                    <strong data-unique-id="341304c5-ac71-4eac-ab37-c513897f565a" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="e80570ae-2b7a-410e-9c37-ab2f16223bbc" data-file-name="components/excel-returned-parts-processor.tsx">Validation:</span></strong><span className="editable-text" data-unique-id="df6dc91d-ac03-4174-a415-a9a714f7f717" data-file-name="components/excel-returned-parts-processor.tsx"> All data will be validated for format, length, and consistency before import.
                  </span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${isDragActive ? 'border-orange-400 bg-orange-50 scale-[1.02]' : isDragReject ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50 hover:scale-[1.01]'} ${isProcessing ? 'pointer-events-none opacity-60' : ''}`} data-unique-id="24943da0-be20-4393-b57c-a942c52de95a" data-file-name="components/excel-returned-parts-processor.tsx">
            <input {...getInputProps()} data-unique-id="09c93682-bec1-419b-86c1-a8ba05c2ad0d" data-file-name="components/excel-returned-parts-processor.tsx" />
            
            <AnimatePresence mode="wait">
              {isProcessing ? <motion.div key="processing" initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} exit={{
              opacity: 0
            }} className="flex flex-col items-center" data-unique-id="2946ed6c-b381-4961-9580-9cac0be53619" data-file-name="components/excel-returned-parts-processor.tsx">
                  <Loader2 className="h-12 w-12 text-orange-500 animate-spin mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2" data-unique-id="a47bf1aa-9cf2-4ba0-a68a-ecfe574f7584" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="8d52fc43-004f-49d4-bc35-e13b3ce3d762" data-file-name="components/excel-returned-parts-processor.tsx">
                    Processing </span>{fileName}<span className="editable-text" data-unique-id="2ca023a9-df6c-4e97-9b6b-ec84198325aa" data-file-name="components/excel-returned-parts-processor.tsx">...
                  </span></p>
                  <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mb-2" data-unique-id="5b05e702-21c8-46fe-b23a-c58c947d78fb" data-file-name="components/excel-returned-parts-processor.tsx">
                    <motion.div className="h-full bg-orange-500 rounded-full" initial={{
                  width: 0
                }} animate={{
                  width: `${processingProgress}%`
                }} transition={{
                  duration: 0.3
                }} data-unique-id="503b7d83-24f6-4e01-a96b-0f8620f9b888" data-file-name="components/excel-returned-parts-processor.tsx" />
                  </div>
                  <p className="text-sm text-gray-500" data-unique-id="fc984fd9-a721-40e8-b57e-daf16a150b5f" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">{Math.round(processingProgress)}<span className="editable-text" data-unique-id="10705d9f-bd83-4200-ae06-e7c69aa8e846" data-file-name="components/excel-returned-parts-processor.tsx">% complete</span></p>
                </motion.div> : <motion.div key="upload" initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} exit={{
              opacity: 0
            }} className="flex flex-col items-center" data-unique-id="4198c3ac-232c-4cf5-b865-d941d562a7e4" data-file-name="components/excel-returned-parts-processor.tsx">
                  <div className="p-4 bg-orange-100 rounded-full mb-4" data-unique-id="0814c092-cf3b-4564-bd4e-f073f16fdc64" data-file-name="components/excel-returned-parts-processor.tsx">
                    <Upload className="h-8 w-8 text-orange-600" />
                  </div>
                  <p className="text-lg font-medium text-gray-700 mb-2" data-unique-id="b03bc582-1b79-451c-a5d2-d5df69836e94" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
                    {isDragActive ? 'Drop your Excel file here' : 'Drag & drop your Excel file here'}
                  </p>
                  <p className="text-sm text-gray-500 mb-4" data-unique-id="ded83972-2b96-44d7-bd8f-d3aafde13dfb" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="7e2f85fb-7891-47cf-9edc-26a2e04cbd16" data-file-name="components/excel-returned-parts-processor.tsx">
                    or click to browse (.xlsx, .xls files supported)
                  </span></p>
                  <button type="button" className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium" data-unique-id="0793afba-03ca-4f83-bafe-9770dba735eb" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="6475ac7e-db02-4c84-ab70-0ea20d1ced75" data-file-name="components/excel-returned-parts-processor.tsx">
                    Select Excel File
                  </span></button>
                </motion.div>}
            </AnimatePresence>
          </div>

          {/* Template Download */}
          <div className="flex justify-center" data-unique-id="77c30227-6dfc-419d-9624-81e0f5fd6426" data-file-name="components/excel-returned-parts-processor.tsx">
            <button onClick={downloadTemplate} className="flex items-center px-4 py-2 text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors" data-unique-id="4e8d2737-09ec-4f12-9619-05447c26673a" data-file-name="components/excel-returned-parts-processor.tsx">
              <Download className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="1c808ff2-b0b6-4e5e-a88c-25d016b97c43" data-file-name="components/excel-returned-parts-processor.tsx">
              Download Excel Template
            </span></button>
          </div>

          {/* Validation Results */}
          {validationResult && !isProcessing && <div className="mb-6" data-unique-id="47b9f7c4-d1bb-4165-bb3c-d160fa62d1a9" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
              {/* Validation Summary */}
              <div className={`p-4 rounded-lg border ${validationResult.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`} data-unique-id="56dd533f-98a0-4f46-b761-f6fb3571a0e3" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
                <div className="flex items-start justify-between" data-unique-id="d4268c2c-2750-4cc9-b28f-18ec54db9867" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
                  <div className="flex items-center" data-unique-id="379642e9-c23a-45a4-8ea3-2d09cf9b82c8" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
                    {validationResult.isValid ? <CheckCircle className="h-5 w-5 text-green-600 mr-3" /> : <AlertCircle className="h-5 w-5 text-red-600 mr-3" />}
                    <div data-unique-id="b29b96e9-c205-45c9-a9e9-ced94040fbb8" data-file-name="components/excel-returned-parts-processor.tsx">
                      <p className={`font-medium ${validationResult.isValid ? 'text-green-800' : 'text-red-800'}`} data-unique-id="a2be2e2c-6629-4671-8429-421e93a4fbb8" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
                        {validationResult.isValid ? 'Validation Passed' : 'Validation Failed'}
                      </p>
                      <p className={`text-sm mt-1 ${validationResult.isValid ? 'text-green-600' : 'text-red-600'}`} data-unique-id="76d96621-edd0-49c8-b6b8-d74975f40c47" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
                        {getValidationSummary(validationResult)}
                      </p>
                    </div>
                  </div>
                  
                  {(validationResult.errors.length > 0 || validationResult.warnings.length > 0) && <button onClick={() => setShowValidationDetails(!showValidationDetails)} className="text-sm text-blue-600 hover:text-blue-800 underline" data-unique-id="111e76bd-2830-4f2e-ae27-41873649f1df" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
                      {showValidationDetails ? 'Hide Details' : 'Show Details'}
                    </button>}
                </div>

                {/* Validation Details */}
                {showValidationDetails && <motion.div initial={{
              opacity: 0,
              height: 0
            }} animate={{
              opacity: 1,
              height: 'auto'
            }} exit={{
              opacity: 0,
              height: 0
            }} className="mt-4 pt-4 border-t border-gray-200" data-unique-id="00a4f868-c203-45d3-9620-79221ecfdcf1" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
                    {/* Errors */}
                    {validationResult.errors.length > 0 && <div className="mb-4" data-unique-id="48cee4b4-b0a0-4610-ad27-3ad16e587e66" data-file-name="components/excel-returned-parts-processor.tsx">
                        <h4 className="font-medium text-red-800 mb-2 flex items-center" data-unique-id="d5375e2f-da68-4f07-9ce3-628b68daa1b1" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
                          <AlertCircle className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="d861aafd-1932-4a9b-8b76-83d0a8ead53d" data-file-name="components/excel-returned-parts-processor.tsx">
                          Errors (</span>{validationResult.errors.length}<span className="editable-text" data-unique-id="15d83030-eacf-4605-ab4c-7621b889845a" data-file-name="components/excel-returned-parts-processor.tsx">)
                        </span></h4>
                        <div className="bg-red-100 p-3 rounded text-sm text-red-700 max-h-40 overflow-y-auto" data-unique-id="70f350bf-3c2f-4e33-99cc-e7de90910344" data-file-name="components/excel-returned-parts-processor.tsx">
                          <pre className="whitespace-pre-wrap font-mono text-xs" data-unique-id="ec01036c-309d-4a77-834c-b0bee47f69cf" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
                            {formatValidationErrors(validationResult.errors)}
                          </pre>
                        </div>
                      </div>}

                    {/* Warnings */}
                    {validationResult.warnings.length > 0 && <div data-unique-id="846a4a1d-1d5d-495e-881d-e2e332eb6b93" data-file-name="components/excel-returned-parts-processor.tsx">
                        <h4 className="font-medium text-amber-800 mb-2 flex items-center" data-unique-id="3681a43f-6db3-4dba-8dd5-3bdb9b02a8c7" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
                          <AlertTriangle className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="9b4fb3b0-c89c-4d26-8188-6d294b6157f5" data-file-name="components/excel-returned-parts-processor.tsx">
                          Warnings (</span>{validationResult.warnings.length}<span className="editable-text" data-unique-id="014127c9-8c36-450c-a9a1-b532d4175f67" data-file-name="components/excel-returned-parts-processor.tsx">)
                        </span></h4>
                        <div className="bg-amber-100 p-3 rounded text-sm text-amber-700 max-h-40 overflow-y-auto" data-unique-id="ca59d54d-4af7-4446-a8de-dd7863fb2017" data-file-name="components/excel-returned-parts-processor.tsx">
                          <pre className="whitespace-pre-wrap font-mono text-xs" data-unique-id="ef0da769-2615-415d-8cfc-dd01b2eb253c" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
                            {formatValidationErrors(validationResult.warnings)}
                          </pre>
                        </div>
                      </div>}
                  </motion.div>}
              </div>
            </div>}

          {/* Processing Stats */}
          {processingStats.total > 0 && <div className="grid grid-cols-4 gap-4" data-unique-id="c3c7fde0-4022-40ff-8279-6a124e2d6344" data-file-name="components/excel-returned-parts-processor.tsx">
              <div className="bg-gray-50 rounded-lg p-4 text-center" data-unique-id="11d09219-1523-48ee-b4b3-f9c8008cd748" data-file-name="components/excel-returned-parts-processor.tsx">
                <div className="text-2xl font-bold text-gray-700" data-unique-id="88596f8f-791f-4fd0-bb11-236c6b317e51" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">{processingStats.total}</div>
                <div className="text-sm text-gray-500" data-unique-id="69cbbbf9-bb8c-4236-a168-ff11cf32ba97" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="b53cd153-0edd-4034-bdc5-46596e6b99e4" data-file-name="components/excel-returned-parts-processor.tsx">Total Rows</span></div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center" data-unique-id="935e1d4a-6a85-469a-8ee9-856a9cc96b4e" data-file-name="components/excel-returned-parts-processor.tsx">
                <div className="text-2xl font-bold text-green-700" data-unique-id="51c71f48-6eb9-4550-9bfb-2a5d2ddf3c07" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">{processingStats.valid}</div>
                <div className="text-sm text-green-600" data-unique-id="b5b859cb-8000-4518-a8ae-f29751252b05" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="3426e632-732e-48de-8761-b87b7ff2ca37" data-file-name="components/excel-returned-parts-processor.tsx">Valid</span></div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center" data-unique-id="0d1ec5f0-9d4f-4679-a0a1-807f04d8fee6" data-file-name="components/excel-returned-parts-processor.tsx">
                <div className="text-2xl font-bold text-red-700" data-unique-id="48285278-8569-40b7-8940-e74b40c6a27f" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">{processingStats.invalid}</div>
                <div className="text-sm text-red-600" data-unique-id="8820dee6-d9e9-4246-b1bf-de4a5c9eb57b" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="469436b8-42d4-42d1-a283-df6c01f276d7" data-file-name="components/excel-returned-parts-processor.tsx">Invalid</span></div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center" data-unique-id="9b1ae6bf-4437-4df7-9b6e-1aa2ca6eaddc" data-file-name="components/excel-returned-parts-processor.tsx">
                <div className="text-2xl font-bold text-yellow-700" data-unique-id="5c3909d2-26f4-4297-a186-41cbec283043" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">{processingStats.warnings}</div>
                <div className="text-sm text-yellow-600" data-unique-id="2dfb790d-c767-4d72-8fa4-cc5faaf8a25f" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="4dfe2247-5127-4188-9bae-04d94ee1925a" data-file-name="components/excel-returned-parts-processor.tsx">Warnings</span></div>
              </div>
            </div>}

          {/* Success Summary */}
          {processedData.length > 0 && <div className="bg-green-50 border border-green-200 rounded-lg p-4" data-unique-id="60346166-7d80-4904-8e78-716becdd4526" data-file-name="components/excel-returned-parts-processor.tsx">
              <div className="flex items-center mb-3" data-unique-id="d8fec333-9071-4936-ba27-8e585f25081a" data-file-name="components/excel-returned-parts-processor.tsx">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="font-medium text-green-800" data-unique-id="9a70c561-6b3c-48a3-8732-f9220de771bb" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="f97a3561-d48c-4d90-ab26-803a251938ef" data-file-name="components/excel-returned-parts-processor.tsx">
                  Ready to Import (</span>{processedData.length}<span className="editable-text" data-unique-id="fbe3b051-3d21-4245-88f1-b500d280a826" data-file-name="components/excel-returned-parts-processor.tsx"> parts)
                </span></h3>
              </div>
              <div className="text-sm text-green-700" data-unique-id="9a6c7269-46e9-4d38-8f7b-efbb282edbc0" data-file-name="components/excel-returned-parts-processor.tsx">
                <p className="mb-3" data-unique-id="d2686dd6-ff8d-4719-840d-0af362f742ff" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="0db0fb76-936d-482c-8dec-7d7ed6fa4a79" data-file-name="components/excel-returned-parts-processor.tsx">Preview of parts to be imported:</span></p>
                <div className="bg-white rounded border max-h-48 overflow-y-auto" data-unique-id="ba740eb8-6763-42a7-862b-767414c6440c" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
                  {processedData.slice(0, 5).map((part, index) => <div key={index} className="p-3 border-b last:border-b-0 hover:bg-gray-50" data-unique-id="9c97f7de-e1fb-4ae4-bda2-ee6c65936d05" data-file-name="components/excel-returned-parts-processor.tsx">
                      <div className="flex justify-between items-start" data-unique-id="b7ca54e8-f8e0-485b-9f27-3160b23a04cd" data-file-name="components/excel-returned-parts-processor.tsx">
                        <div data-unique-id="3c8850d0-8376-456b-82e1-94494430420e" data-file-name="components/excel-returned-parts-processor.tsx">
                          <div className="font-medium text-gray-900" data-unique-id="b0b660a8-6a49-4393-a6ad-1cdd4466a2d3" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">{part.partName}</div>
                          <div className="text-sm text-gray-600" data-unique-id="c0e11b42-1acc-4996-9d00-00e21299fa0d" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="e8215964-8385-400a-8db2-752fe2e29c2d" data-file-name="components/excel-returned-parts-processor.tsx">
                            Part #: </span>{part.partNumber}<span className="editable-text" data-unique-id="91877da8-c781-4aa4-9363-fb375019b495" data-file-name="components/excel-returned-parts-processor.tsx"> | Customer: </span>{part.customerName}
                          </div>
                          <div className="text-xs text-gray-500" data-unique-id="3011e5fc-7233-4f0e-bfd1-dbd7e3a74b52" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="26fe1275-be58-4c4c-baaa-317d0940159d" data-file-name="components/excel-returned-parts-processor.tsx">
                            Order: </span>{part.orderNumber}<span className="editable-text" data-unique-id="da9b1a25-ec7a-43e8-b5b0-ea9e719e72c6" data-file-name="components/excel-returned-parts-processor.tsx"> | Reason: </span>{part.returnReason}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500" data-unique-id="98ccfca7-5e0f-42d7-83c2-47b18f491bd4" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
                          {part.trackingNumber && <div data-unique-id="33918cc3-5a26-4f8c-b9c2-d1a891df1c3a" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="c8d0659a-4937-4345-a1fb-fdc669063d08" data-file-name="components/excel-returned-parts-processor.tsx">Track: </span>{part.trackingNumber}</div>}
                        </div>
                      </div>
                    </div>)}
                  {processedData.length > 5 && <div className="p-3 text-center text-sm text-gray-500 bg-gray-50" data-unique-id="924a16c6-91c0-4870-ba7f-81c2200eda45" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="6632bcee-0965-467d-a787-9ab5c6571ba4" data-file-name="components/excel-returned-parts-processor.tsx">
                      ... and </span>{processedData.length - 5}<span className="editable-text" data-unique-id="5093b272-a599-4df9-b3ba-d778b5249c1a" data-file-name="components/excel-returned-parts-processor.tsx"> more parts
                    </span></div>}
                </div>
              </div>
            </div>}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50" data-unique-id="a253060d-1f5c-42ea-b681-314caf1ba90b" data-file-name="components/excel-returned-parts-processor.tsx">
          <div className="text-sm text-gray-600" data-unique-id="cf3bad59-5bd3-4176-ad79-574bae6b7934" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
            {fileName && <div className="flex items-center" data-unique-id="3a3fada7-deef-4877-8b5a-5f93dabafc7b" data-file-name="components/excel-returned-parts-processor.tsx">
                <File className="h-4 w-4 mr-2" />
                <span data-unique-id="a8712e4f-8705-4d1c-b5bb-446b79fb9e8c" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="7a51e09c-158b-40c2-aeb7-7cbcc9a68ca3" data-file-name="components/excel-returned-parts-processor.tsx">File: </span>{fileName}</span>
              </div>}
          </div>
          <div className="flex space-x-3" data-unique-id="b66fd2a1-64b6-4cd7-a25e-63cc12f711ea" data-file-name="components/excel-returned-parts-processor.tsx">
            <button onClick={() => {
            resetForm();
            onClose();
          }} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" data-unique-id="d05fda9e-32e3-4439-8899-65927eeca17a" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="89b3d88a-2ceb-46a6-ae16-463389f2246f" data-file-name="components/excel-returned-parts-processor.tsx">
              Cancel
            </span></button>
            <button onClick={handleImport} disabled={processedData.length === 0 || isProcessing} className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium" data-unique-id="910253ab-b08e-4c51-a9a5-b0c1ef2e9ebf" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="dc96dec7-ec30-4a22-8e74-7ec6f52d69de" data-file-name="components/excel-returned-parts-processor.tsx">
              Import </span>{processedData.length > 0 ? `${processedData.length} ` : ''}<span className="editable-text" data-unique-id="8a0af3f6-9911-469e-ac5c-21ed40cc65bd" data-file-name="components/excel-returned-parts-processor.tsx">Parts
            </span></button>
          </div>
        </div>
      </motion.div>
    </div>;
}