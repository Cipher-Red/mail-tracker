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
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, {
            type: 'array'
          });
          if (workbook.SheetNames.length === 0) {
            throw new Error('No worksheets found in the Excel file');
          }
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          setProcessingProgress(40);
          if (jsonData.length === 0) {
            throw new Error('No data found in the Excel file');
          }

          // Validate the data using our validation utility
          setProcessingProgress(60);
          const validation = validateReturnedPartsData(jsonData);
          setValidationResult(validation);
          if (!validation.isValid) {
            setProcessingProgress(100);
            toast.error(`Validation failed: ${validation.errors.length} errors found`);
            setTimeout(() => setProcessingProgress(0), 1000);
            setIsProcessing(false);
            return;
          }

          // Convert only valid rows to ReturnedPart format
          setProcessingProgress(80);
          const convertedParts: ReturnedPart[] = validation.validRows.map((row: any, index) => ({
            id: `import-${Date.now()}-${index}`,
            partName: (row.partName || row['Part Name'] || row.part_name || row['Ship To Name'] || '').toString().trim(),
            partNumber: (row.partNumber || row['Part Number'] || row.part_number || 'N/A').toString().trim(),
            customerName: (row.customerName || row['Customer Name'] || row.customer_name || row['Ship To Name'] || '').toString().trim(),
            customerEmail: (row.customerEmail || row['Customer Email'] || row.customer_email || row['Ship To Email'] || '').toString().trim(),
            orderNumber: (row.orderNumber || row['Order Number'] || row.order_number || row['Customer Order Number'] || '').toString().trim(),
            returnReason: (row.returnReason || row['Return Reason'] || row.return_reason || 'Other').toString().trim(),
            trackingNumber: (row.trackingNumber || row['Tracking Number'] || row.tracking_number || row['Tracking Link(s)'] || '').toString().trim(),
            shippedDate: formatDate(row.shippedDate || row['Shipped Date'] || row.shipped_date || row['Actual Ship Date']),
            expectedArrival: formatDate(row.expectedArrival || row['Expected Arrival'] || row.expected_arrival),
            status: normalizeStatus(row.status || row['Status'] || row['Return Status'] || 'shipped'),
            notes: (row.notes || row.Notes || row['Order Summary'] || '').toString().trim(),
            createdAt: new Date().toISOString()
          }));
          setProcessedData(convertedParts);
          setProcessingStats({
            total: jsonData.length,
            valid: validation.validRows.length,
            invalid: validation.invalidRows.length,
            warnings: validation.warnings.length
          });
          setProcessingProgress(100);

          // Show success message with validation summary
          if (validation.warnings.length > 0) {
            toast.success(`Processed ${convertedParts.length} parts with ${validation.warnings.length} warnings`);
          } else {
            toast.success(`Successfully processed ${convertedParts.length} returned parts`);
          }
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
      reader.readAsArrayBuffer(file);
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
      'Part Name': 'Front Brake Pad Set',
      'Part Number': 'BP-12345',
      'Customer Name': 'John Smith',
      'Customer Email': 'john.smith@email.com',
      'Order Number': 'ORD-12345678',
      'Return Reason': 'Defective',
      'Tracking Number': 'TRK123456789',
      'Shipped Date': '2024-01-15',
      'Expected Arrival': '2024-01-18',
      'Status': 'shipped',
      'Notes': 'Customer reported grinding noise'
    }, {
      'Part Name': 'Oil Filter',
      'Part Number': 'OF-67890',
      'Customer Name': 'Sarah Johnson',
      'Customer Email': 'sarah.johnson@email.com',
      'Order Number': 'ORD-87654321',
      'Return Reason': 'Wrong Part',
      'Tracking Number': 'TRK987654321',
      'Shipped Date': '2024-01-16',
      'Expected Arrival': '2024-01-19',
      'Status': 'in_transit',
      'Notes': 'Ordered wrong filter size'
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
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" data-unique-id="50912f43-7027-4587-9929-65ae77aaa356" data-file-name="components/excel-returned-parts-processor.tsx">
      <motion.div initial={{
      opacity: 0,
      scale: 0.95
    }} animate={{
      opacity: 1,
      scale: 1
    }} exit={{
      opacity: 0,
      scale: 0.95
    }} className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden" data-unique-id="75901924-d017-44d6-a352-3548d6a48192" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50" data-unique-id="7c3cfe43-6094-4bf9-82c9-2a267b329cd9" data-file-name="components/excel-returned-parts-processor.tsx">
          <div data-unique-id="5bcfa980-5867-46dc-a084-61bbf6e8e97c" data-file-name="components/excel-returned-parts-processor.tsx">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center" data-unique-id="3a61eff9-36ad-4323-9cc9-445051472a7d" data-file-name="components/excel-returned-parts-processor.tsx">
              <FileSpreadsheet className="mr-3 h-6 w-6 text-orange-600" /><span className="editable-text" data-unique-id="9e4c2407-67f4-4f50-b5cb-4c0c5a2fc044" data-file-name="components/excel-returned-parts-processor.tsx">
              Import Returned Parts from Excel
            </span></h2>
            <p className="text-sm text-gray-600 mt-1" data-unique-id="e18d3528-2553-49ba-995a-51675b9bb0bd" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="c961d85f-61e0-419a-b20e-30e689f4bd33" data-file-name="components/excel-returned-parts-processor.tsx">
              Upload an Excel file to import multiple returned parts at once
            </span></p>
          </div>
          <button onClick={() => {
          resetForm();
          onClose();
        }} className="p-2 rounded-full hover:bg-white/50 transition-colors" data-unique-id="3de89175-d50c-4e12-a734-c2eebb5fd7f8" data-file-name="components/excel-returned-parts-processor.tsx">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto" data-unique-id="690c8862-5027-4f82-b39f-3ec436227b52" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" data-unique-id="233cfd73-e420-4de6-9f78-9fb3e34d4769" data-file-name="components/excel-returned-parts-processor.tsx">
            <div className="flex items-start" data-unique-id="36264843-ab8e-4492-bab6-19e526a438e3" data-file-name="components/excel-returned-parts-processor.tsx">
              <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="text-sm" data-unique-id="f64d66ab-d5f3-4668-ab46-dea9e1b56a4c" data-file-name="components/excel-returned-parts-processor.tsx">
                <h3 className="font-medium text-blue-900 mb-2" data-unique-id="e41e3a78-cb64-4f52-a884-693c8811ae80" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="2eea3892-0486-433d-aa7d-218fd27a7050" data-file-name="components/excel-returned-parts-processor.tsx">Excel File Requirements:</span></h3>
                <div className="text-blue-800 space-y-2" data-unique-id="2b7bac29-97da-4317-9029-9c2adbe296cd" data-file-name="components/excel-returned-parts-processor.tsx">
                  <div data-unique-id="4132f49f-9c29-4970-aefc-a8efbcbcf1f8" data-file-name="components/excel-returned-parts-processor.tsx">
                    <p data-unique-id="a2f29325-b004-4200-91bf-b3a35386470f" data-file-name="components/excel-returned-parts-processor.tsx"><strong data-unique-id="d0d274cb-afc9-4905-948f-4045cadc1009" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="ff475b93-b008-4d43-aeb0-5558f2e1a043" data-file-name="components/excel-returned-parts-processor.tsx">Required columns:</span></strong></p>
                    <ul className="ml-4 mt-1 space-y-1" data-unique-id="5acf67be-ca11-48ca-90e0-d4afa65e4081" data-file-name="components/excel-returned-parts-processor.tsx">
                      <li data-unique-id="eff46fbe-0930-4f05-9cdf-e72db5d92438" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="c973e172-247b-4f02-a742-0f6be00fe824" data-file-name="components/excel-returned-parts-processor.tsx">• </span><strong data-unique-id="46972255-e5ca-4af8-8552-eccc10051183" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="a5e4ecfc-0a56-4035-8f57-df599162f91d" data-file-name="components/excel-returned-parts-processor.tsx">partName</span></strong><span className="editable-text" data-unique-id="41348c14-1ba5-4c60-ac32-921836954a4a" data-file-name="components/excel-returned-parts-processor.tsx"> - 2-100 characters</span></li>
                      <li data-unique-id="67ad82ff-775a-4ce8-ad64-e3683414bf1a" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="1df181ba-6d80-4123-97a6-17de5700dc5d" data-file-name="components/excel-returned-parts-processor.tsx">• </span><strong data-unique-id="aa1789ab-f9a1-405c-9d85-9aa457f428af" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="7e4610a2-18f1-4a81-b4da-17b757a509f9" data-file-name="components/excel-returned-parts-processor.tsx">partNumber</span></strong><span className="editable-text" data-unique-id="22ecce90-b7f4-449a-bb77-153a35f815aa" data-file-name="components/excel-returned-parts-processor.tsx"> - 3-20 alphanumeric characters</span></li>
                      <li data-unique-id="29dafe81-4c04-421c-bf9b-ba01906812f7" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="d2e4ce81-7e23-4b1e-91d1-0b3d360c8f99" data-file-name="components/excel-returned-parts-processor.tsx">• </span><strong data-unique-id="9e76f5f5-9bf8-4960-8368-10c892dcc90c" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="b6e3f201-aa33-4804-bd9b-8cb38000cb93" data-file-name="components/excel-returned-parts-processor.tsx">customerName</span></strong><span className="editable-text" data-unique-id="e0c3ba39-0a1c-4cfc-a186-cec60b351c0a" data-file-name="components/excel-returned-parts-processor.tsx"> - Minimum 2 characters</span></li>
                      <li data-unique-id="e5a4d302-3674-4e46-8dbb-c94e58410176" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="059e02b6-c75f-4210-9661-d906ae1f9f1f" data-file-name="components/excel-returned-parts-processor.tsx">• </span><strong data-unique-id="d5def4f4-5742-4b68-a533-a0fa3b2649ed" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="1fb86901-7e74-48fb-9b0d-949ffe16b73a" data-file-name="components/excel-returned-parts-processor.tsx">orderNumber</span></strong><span className="editable-text" data-unique-id="1f0ce08f-34e5-48d6-a668-efc0cadd4695" data-file-name="components/excel-returned-parts-processor.tsx"> - 3-30 alphanumeric characters</span></li>
                    </ul>
                  </div>
                  
                  <div data-unique-id="36eb71be-cc61-4c07-a5a8-8afc72da1830" data-file-name="components/excel-returned-parts-processor.tsx">
                    <p data-unique-id="184b9b11-494f-4b28-b4fe-2f6cff26f046" data-file-name="components/excel-returned-parts-processor.tsx"><strong data-unique-id="c98882d1-4f4c-4c4b-8a47-a48f1afd9a9d" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="9b8954be-46ed-4287-a552-b1ad49473284" data-file-name="components/excel-returned-parts-processor.tsx">Optional columns:</span></strong></p>
                    <ul className="ml-4 mt-1 space-y-1" data-unique-id="e8f106a5-82b0-470c-ab07-088bb987c02a" data-file-name="components/excel-returned-parts-processor.tsx">
                      <li data-unique-id="b7726b4a-4891-48e4-80de-5bff3c658dbc" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="70757c87-6bd7-4259-a950-b7710a82fff1" data-file-name="components/excel-returned-parts-processor.tsx">• </span><strong data-unique-id="94edb01f-d60f-470a-a005-f2674f083ed7" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="7fa011c6-fd05-401d-a227-9049d3dde60e" data-file-name="components/excel-returned-parts-processor.tsx">returnReason</span></strong><span className="editable-text" data-unique-id="123e572d-6254-4216-b4e1-d59a9a9fc2a5" data-file-name="components/excel-returned-parts-processor.tsx"> - Defective, Wrong Part, Customer Return, Warranty, Quality Issue, Other</span></li>
                      <li data-unique-id="d8b6403b-2432-4bec-b172-33fb9ec6bfb4" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="6a8fc26c-a3db-4798-819e-b5b560558b5a" data-file-name="components/excel-returned-parts-processor.tsx">• </span><strong data-unique-id="5d74417e-ca89-4dac-8073-513b92935c90" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="724ea8da-5b83-46be-86d4-0cd366d136a2" data-file-name="components/excel-returned-parts-processor.tsx">trackingNumber</span></strong><span className="editable-text" data-unique-id="3f7ca8c9-c161-46b0-a8e6-59977daaddfd" data-file-name="components/excel-returned-parts-processor.tsx"> - 10-30 alphanumeric characters</span></li>
                      <li data-unique-id="7dd6247c-1b2c-4078-a87e-9d6b7a6b2899" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="ca879695-219c-40d3-ab61-ea2f01da886b" data-file-name="components/excel-returned-parts-processor.tsx">• </span><strong data-unique-id="63d673ce-2629-4998-9835-bd5646f8f052" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="857d9672-bd5e-4811-995e-91acbd80c609" data-file-name="components/excel-returned-parts-processor.tsx">shippedDate</span></strong><span className="editable-text" data-unique-id="0c211a33-360b-4a52-af6f-a4cbfa85c98e" data-file-name="components/excel-returned-parts-processor.tsx"> - Date format (YYYY-MM-DD, MM/DD/YYYY, or Excel date)</span></li>
                      <li data-unique-id="6b615fbf-b9cb-4cf1-ac87-6994bd11e9c9" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="636c326a-04c4-4f25-9bd1-e6371897cdc6" data-file-name="components/excel-returned-parts-processor.tsx">• </span><strong data-unique-id="e6906a9f-e0a5-4a5d-808c-34e37a551e03" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="069a8130-7656-4b44-b4ed-23fea2d389b3" data-file-name="components/excel-returned-parts-processor.tsx">expectedArrival</span></strong><span className="editable-text" data-unique-id="794dc370-eaa9-4449-bac2-737818006749" data-file-name="components/excel-returned-parts-processor.tsx"> - Date format (must be after shipped date)</span></li>
                      <li data-unique-id="26cafe8a-4202-4fb0-a7ac-2bdd717accba" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="695ade02-0416-4af7-a867-844524958e25" data-file-name="components/excel-returned-parts-processor.tsx">• </span><strong data-unique-id="97f0e5e5-08a8-468a-b21d-f467c2814419" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="0f216864-01ce-41e8-97b3-50c7d2a3bc5e" data-file-name="components/excel-returned-parts-processor.tsx">status</span></strong><span className="editable-text" data-unique-id="6494b467-f691-40b9-bb9e-6cc0d0c73611" data-file-name="components/excel-returned-parts-processor.tsx"> - shipped, in_transit, arrived, inspecting, inspected</span></li>
                      <li data-unique-id="b79d57b6-a25c-47fa-bc8b-d9da640d3d2a" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="12359ddd-3683-4584-9978-9a3400b48536" data-file-name="components/excel-returned-parts-processor.tsx">• </span><strong data-unique-id="83e6ebb4-3dad-4003-9627-1d6303f9adde" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="1f164fa1-3cb3-4fe6-bea8-88da1160c513" data-file-name="components/excel-returned-parts-processor.tsx">notes</span></strong><span className="editable-text" data-unique-id="ef67258e-f8bd-4f71-acb9-de719c05be38" data-file-name="components/excel-returned-parts-processor.tsx"> - Maximum 500 characters</span></li>
                    </ul>
                  </div>
                  
                  <div className="mt-3 p-2 bg-blue-100 border border-blue-300 rounded text-blue-800" data-unique-id="4cfe6297-418f-47e3-9e9b-0205f7cbe742" data-file-name="components/excel-returned-parts-processor.tsx">
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                    <strong data-unique-id="83d89e6e-ca6b-49c7-bfa6-b7a5db1b5ffd" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="9c0e981d-69bb-4a42-a69e-a28e2ba6c0c2" data-file-name="components/excel-returned-parts-processor.tsx">Validation:</span></strong><span className="editable-text" data-unique-id="f52ab010-6259-4fab-b37a-71e324d328da" data-file-name="components/excel-returned-parts-processor.tsx"> All data will be validated for format, length, and consistency before import.
                  </span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${isDragActive ? 'border-orange-400 bg-orange-50 scale-[1.02]' : isDragReject ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50 hover:scale-[1.01]'} ${isProcessing ? 'pointer-events-none opacity-60' : ''}`} data-unique-id="b60dfaf8-2fac-422c-90f8-981fbd6208e6" data-file-name="components/excel-returned-parts-processor.tsx">
            <input {...getInputProps()} data-unique-id="5eb30006-d953-4649-a741-5862f4afb850" data-file-name="components/excel-returned-parts-processor.tsx" />
            
            <AnimatePresence mode="wait">
              {isProcessing ? <motion.div key="processing" initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} exit={{
              opacity: 0
            }} className="flex flex-col items-center" data-unique-id="76439c93-46f6-4cd8-b95d-0c3ae52c5744" data-file-name="components/excel-returned-parts-processor.tsx">
                  <Loader2 className="h-12 w-12 text-orange-500 animate-spin mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2" data-unique-id="64f2d81c-7c5a-460c-9a1a-d30424ba8c9b" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="9ce6e97a-8512-4068-967e-fecd369cd389" data-file-name="components/excel-returned-parts-processor.tsx">
                    Processing </span>{fileName}<span className="editable-text" data-unique-id="edab1baf-f2f6-4a0b-8c84-0ea60e372427" data-file-name="components/excel-returned-parts-processor.tsx">...
                  </span></p>
                  <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mb-2" data-unique-id="dfa55b1a-68f1-4ebb-8fc3-5dacf822cc3b" data-file-name="components/excel-returned-parts-processor.tsx">
                    <motion.div className="h-full bg-orange-500 rounded-full" initial={{
                  width: 0
                }} animate={{
                  width: `${processingProgress}%`
                }} transition={{
                  duration: 0.3
                }} data-unique-id="8b9e7cec-c0b5-4b59-9bbc-daa7723a6c95" data-file-name="components/excel-returned-parts-processor.tsx" />
                  </div>
                  <p className="text-sm text-gray-500" data-unique-id="3f1624a8-8d70-4355-a458-65a582c8bb94" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">{Math.round(processingProgress)}<span className="editable-text" data-unique-id="ba1fffd1-ab8f-4f07-b5e7-1496963b0a2f" data-file-name="components/excel-returned-parts-processor.tsx">% complete</span></p>
                </motion.div> : <motion.div key="upload" initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} exit={{
              opacity: 0
            }} className="flex flex-col items-center" data-unique-id="aabe745f-283e-4f73-ab51-23a12eef2acd" data-file-name="components/excel-returned-parts-processor.tsx">
                  <div className="p-4 bg-orange-100 rounded-full mb-4" data-unique-id="57746260-d3b4-4534-987d-633402f987ed" data-file-name="components/excel-returned-parts-processor.tsx">
                    <Upload className="h-8 w-8 text-orange-600" />
                  </div>
                  <p className="text-lg font-medium text-gray-700 mb-2" data-unique-id="768caf4d-3e9c-4f9a-9fc8-85cdddda959e" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
                    {isDragActive ? 'Drop your Excel file here' : 'Drag & drop your Excel file here'}
                  </p>
                  <p className="text-sm text-gray-500 mb-4" data-unique-id="5f0accb5-c1ff-46a2-88a6-59cc3b2ffe71" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="9fadbefe-9b44-4c65-b7a8-6ef653566027" data-file-name="components/excel-returned-parts-processor.tsx">
                    or click to browse (.xlsx, .xls files supported)
                  </span></p>
                  <button type="button" className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium" data-unique-id="b134ffcc-62dc-482f-b550-bbd90a499a6d" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="4f6fd2db-9de6-4a29-a30e-9813fe12129b" data-file-name="components/excel-returned-parts-processor.tsx">
                    Select Excel File
                  </span></button>
                </motion.div>}
            </AnimatePresence>
          </div>

          {/* Template Download */}
          <div className="flex justify-center" data-unique-id="915165f7-4183-4f9d-8e1a-e9af545adf40" data-file-name="components/excel-returned-parts-processor.tsx">
            <button onClick={downloadTemplate} className="flex items-center px-4 py-2 text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors" data-unique-id="e6dfb7dd-453c-44e4-9b84-88ab0e2fa1b6" data-file-name="components/excel-returned-parts-processor.tsx">
              <Download className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="54225457-f59a-4959-8411-ad970490ae1f" data-file-name="components/excel-returned-parts-processor.tsx">
              Download Excel Template
            </span></button>
          </div>

          {/* Validation Results */}
          {validationResult && !isProcessing && <div className="mb-6" data-unique-id="6133d449-2a76-431a-9ccf-0b0208a4ab63" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
              {/* Validation Summary */}
              <div className={`p-4 rounded-lg border ${validationResult.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`} data-unique-id="8f75b9cf-d746-429c-865b-3606d179dde5" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
                <div className="flex items-start justify-between" data-unique-id="bb1d8f1c-e323-4fa8-b380-cf574014c636" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
                  <div className="flex items-center" data-unique-id="00ae738b-8533-432c-b33c-2999b41fcc08" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
                    {validationResult.isValid ? <CheckCircle className="h-5 w-5 text-green-600 mr-3" /> : <AlertCircle className="h-5 w-5 text-red-600 mr-3" />}
                    <div data-unique-id="d094155c-7e2d-41b5-a0e0-fc2535aa94d7" data-file-name="components/excel-returned-parts-processor.tsx">
                      <p className={`font-medium ${validationResult.isValid ? 'text-green-800' : 'text-red-800'}`} data-unique-id="c4706cdd-6efc-4b36-8d0b-8f25e222f490" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
                        {validationResult.isValid ? 'Validation Passed' : 'Validation Failed'}
                      </p>
                      <p className={`text-sm mt-1 ${validationResult.isValid ? 'text-green-600' : 'text-red-600'}`} data-unique-id="4b80919d-8c66-492d-bea4-4b22276413c1" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
                        {getValidationSummary(validationResult)}
                      </p>
                    </div>
                  </div>
                  
                  {(validationResult.errors.length > 0 || validationResult.warnings.length > 0) && <button onClick={() => setShowValidationDetails(!showValidationDetails)} className="text-sm text-blue-600 hover:text-blue-800 underline" data-unique-id="40cc9a48-20d8-4c86-b350-0323436a3fc5" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
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
            }} className="mt-4 pt-4 border-t border-gray-200" data-unique-id="e57452e7-b48f-4801-8207-5b3e401636c8" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
                    {/* Errors */}
                    {validationResult.errors.length > 0 && <div className="mb-4" data-unique-id="29cbc4bf-0fc3-4979-9dd9-1f25b65ef95b" data-file-name="components/excel-returned-parts-processor.tsx">
                        <h4 className="font-medium text-red-800 mb-2 flex items-center" data-unique-id="21a2f1be-f3fa-4e95-8069-ddf3919f6536" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
                          <AlertCircle className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="436b3856-1e58-4384-b49b-0aa3305237c5" data-file-name="components/excel-returned-parts-processor.tsx">
                          Errors (</span>{validationResult.errors.length}<span className="editable-text" data-unique-id="9eb59ab9-79e3-44e8-ab62-6881accbbc83" data-file-name="components/excel-returned-parts-processor.tsx">)
                        </span></h4>
                        <div className="bg-red-100 p-3 rounded text-sm text-red-700 max-h-40 overflow-y-auto" data-unique-id="f4bbe031-8a34-4f5a-a660-251115ef8e4a" data-file-name="components/excel-returned-parts-processor.tsx">
                          <pre className="whitespace-pre-wrap font-mono text-xs" data-unique-id="87f36261-99b9-4017-9b27-cc375efa51de" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
                            {formatValidationErrors(validationResult.errors)}
                          </pre>
                        </div>
                      </div>}

                    {/* Warnings */}
                    {validationResult.warnings.length > 0 && <div data-unique-id="679f3503-4692-4ae1-aa56-4a3c479aad8c" data-file-name="components/excel-returned-parts-processor.tsx">
                        <h4 className="font-medium text-amber-800 mb-2 flex items-center" data-unique-id="04ccd376-d347-4a74-93c5-6d965b6c1d52" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
                          <AlertTriangle className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="38545bfd-84b5-47bb-948b-17bea0411dc3" data-file-name="components/excel-returned-parts-processor.tsx">
                          Warnings (</span>{validationResult.warnings.length}<span className="editable-text" data-unique-id="8c8f41c7-e66d-410d-925a-2f3d2249d707" data-file-name="components/excel-returned-parts-processor.tsx">)
                        </span></h4>
                        <div className="bg-amber-100 p-3 rounded text-sm text-amber-700 max-h-40 overflow-y-auto" data-unique-id="35ee99d9-b792-43b8-a400-7ae1ff195039" data-file-name="components/excel-returned-parts-processor.tsx">
                          <pre className="whitespace-pre-wrap font-mono text-xs" data-unique-id="3afe1e01-cb73-4d5a-a245-72f0a7c25398" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
                            {formatValidationErrors(validationResult.warnings)}
                          </pre>
                        </div>
                      </div>}
                  </motion.div>}
              </div>
            </div>}

          {/* Processing Stats */}
          {processingStats.total > 0 && <div className="grid grid-cols-4 gap-4" data-unique-id="34122e7e-33c5-4072-8ae4-1a9cf90d8573" data-file-name="components/excel-returned-parts-processor.tsx">
              <div className="bg-gray-50 rounded-lg p-4 text-center" data-unique-id="d87dc94e-5f34-4a90-ae88-3b479aa375a6" data-file-name="components/excel-returned-parts-processor.tsx">
                <div className="text-2xl font-bold text-gray-700" data-unique-id="83dca1e9-0d58-46e1-9991-fa2b216191ae" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">{processingStats.total}</div>
                <div className="text-sm text-gray-500" data-unique-id="f3548f10-7d05-4024-8796-f5446ea17e9b" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="a078bc49-0d81-4e2b-a22b-55902d941719" data-file-name="components/excel-returned-parts-processor.tsx">Total Rows</span></div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center" data-unique-id="1e0fbe4d-db03-46aa-a414-1239ef75b8e6" data-file-name="components/excel-returned-parts-processor.tsx">
                <div className="text-2xl font-bold text-green-700" data-unique-id="859ae62e-e3d4-419d-9744-2f21f36c7f2d" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">{processingStats.valid}</div>
                <div className="text-sm text-green-600" data-unique-id="f2996a73-ae56-47db-b71a-b47925d99a16" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="6d22c5f9-f4c6-4ece-a312-e47fd7b0a4a5" data-file-name="components/excel-returned-parts-processor.tsx">Valid</span></div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center" data-unique-id="77dc0eda-7a39-46f7-8536-9b5ed4df3dfa" data-file-name="components/excel-returned-parts-processor.tsx">
                <div className="text-2xl font-bold text-red-700" data-unique-id="8f8b7dbd-7ebd-4bec-8cee-704b1dc56201" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">{processingStats.invalid}</div>
                <div className="text-sm text-red-600" data-unique-id="1af35d17-fba8-4442-8f95-b51f1be1ee1c" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="8d59b892-b21c-4939-9908-1d55acbaf4be" data-file-name="components/excel-returned-parts-processor.tsx">Invalid</span></div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center" data-unique-id="cbe13d7b-79a0-4462-b9d0-b1d43a373de0" data-file-name="components/excel-returned-parts-processor.tsx">
                <div className="text-2xl font-bold text-yellow-700" data-unique-id="f4dffc0b-a35f-4e06-b3f1-0f509a33e478" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">{processingStats.warnings}</div>
                <div className="text-sm text-yellow-600" data-unique-id="c94a9a8a-eb8c-4680-a4ca-7266b7f85d71" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="f569a60d-8460-416c-8208-dadf3a9ffcde" data-file-name="components/excel-returned-parts-processor.tsx">Warnings</span></div>
              </div>
            </div>}

          {/* Success Summary */}
          {processedData.length > 0 && <div className="bg-green-50 border border-green-200 rounded-lg p-4" data-unique-id="cd2d3557-efd4-4eb5-87a6-3fb9b2556d26" data-file-name="components/excel-returned-parts-processor.tsx">
              <div className="flex items-center mb-3" data-unique-id="47666c25-e508-4b44-b674-504cdebcbc63" data-file-name="components/excel-returned-parts-processor.tsx">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="font-medium text-green-800" data-unique-id="2c0fd39e-cdab-4d59-960d-cd95705f124a" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="21774025-ab05-467b-9d66-0782849f71b3" data-file-name="components/excel-returned-parts-processor.tsx">
                  Ready to Import (</span>{processedData.length}<span className="editable-text" data-unique-id="258ffd4d-bd7d-4c8b-a537-953e0387262c" data-file-name="components/excel-returned-parts-processor.tsx"> parts)
                </span></h3>
              </div>
              <div className="text-sm text-green-700" data-unique-id="9eb63f3c-1f9a-4dbe-a2b8-51708524f368" data-file-name="components/excel-returned-parts-processor.tsx">
                <p className="mb-3" data-unique-id="08266876-2766-46a9-921d-74c1e228e749" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="5606fa73-d0ac-4eb0-8937-4aa4fce46b1e" data-file-name="components/excel-returned-parts-processor.tsx">Preview of parts to be imported:</span></p>
                <div className="bg-white rounded border max-h-48 overflow-y-auto" data-unique-id="62c32fbe-5875-4e53-936e-60f58de293e4" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
                  {processedData.slice(0, 5).map((part, index) => <div key={index} className="p-3 border-b last:border-b-0 hover:bg-gray-50" data-unique-id="8bc0bf3f-65a1-4a37-8aaf-755bfea30861" data-file-name="components/excel-returned-parts-processor.tsx">
                      <div className="flex justify-between items-start" data-unique-id="f1f8d028-f53f-4120-aac5-e3393bbf3883" data-file-name="components/excel-returned-parts-processor.tsx">
                        <div data-unique-id="117f8ba9-d398-4aed-8d7e-4fd6df374780" data-file-name="components/excel-returned-parts-processor.tsx">
                          <div className="font-medium text-gray-900" data-unique-id="dcc740bd-da66-4972-a37b-8e35f7af7442" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">{part.partName}</div>
                          <div className="text-sm text-gray-600" data-unique-id="b7938588-be88-4c82-a2d3-21fb531f6e79" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="86470aea-e628-4b98-8813-415d88dd0ae7" data-file-name="components/excel-returned-parts-processor.tsx">
                            Part #: </span>{part.partNumber}<span className="editable-text" data-unique-id="b4a3e0d5-caee-447d-81ce-a0de82642aa1" data-file-name="components/excel-returned-parts-processor.tsx"> | Customer: </span>{part.customerName}
                          </div>
                          <div className="text-xs text-gray-500" data-unique-id="39656d98-6475-4309-aea0-ccad433889a4" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="017ebab2-92ee-40cf-b5d8-6f4f45a4231c" data-file-name="components/excel-returned-parts-processor.tsx">
                            Order: </span>{part.orderNumber}<span className="editable-text" data-unique-id="cdd4bbfb-1e6b-430b-8696-efe35208e435" data-file-name="components/excel-returned-parts-processor.tsx"> | Reason: </span>{part.returnReason}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500" data-unique-id="96134be7-280e-443c-80ed-276a6d7a4770" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
                          {part.trackingNumber && <div data-unique-id="1dc00c73-3646-457c-8f36-326b1796fbad" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="b27ed811-3c63-4d69-85fd-51e26eda4b1d" data-file-name="components/excel-returned-parts-processor.tsx">Track: </span>{part.trackingNumber}</div>}
                        </div>
                      </div>
                    </div>)}
                  {processedData.length > 5 && <div className="p-3 text-center text-sm text-gray-500 bg-gray-50" data-unique-id="5ffdafe5-6dfd-4405-8de8-3575060e46ff" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="3b5b6f44-4949-4612-9e4b-e8227bc5fe6e" data-file-name="components/excel-returned-parts-processor.tsx">
                      ... and </span>{processedData.length - 5}<span className="editable-text" data-unique-id="b0371baf-97e1-4204-a6ef-c8a2c8a6e01a" data-file-name="components/excel-returned-parts-processor.tsx"> more parts
                    </span></div>}
                </div>
              </div>
            </div>}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50" data-unique-id="e929db81-effa-45f7-91c3-09e096731f39" data-file-name="components/excel-returned-parts-processor.tsx">
          <div className="text-sm text-gray-600" data-unique-id="774c4460-8be6-451b-8570-d12eeca8dc67" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true">
            {fileName && <div className="flex items-center" data-unique-id="00cec80e-c11a-4e6d-8436-1fd945115843" data-file-name="components/excel-returned-parts-processor.tsx">
                <File className="h-4 w-4 mr-2" />
                <span data-unique-id="71465a57-40f4-4af3-9042-22ecd27b83ac" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="f394b9ee-1970-40bd-9b73-299175ea5956" data-file-name="components/excel-returned-parts-processor.tsx">File: </span>{fileName}</span>
              </div>}
          </div>
          <div className="flex space-x-3" data-unique-id="1ceb36d2-2b79-4bf4-9576-b3fcff4c3eac" data-file-name="components/excel-returned-parts-processor.tsx">
            <button onClick={() => {
            resetForm();
            onClose();
          }} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" data-unique-id="58e024bd-a94b-4481-8dfe-2343a6dfe16f" data-file-name="components/excel-returned-parts-processor.tsx"><span className="editable-text" data-unique-id="b46971f5-e41e-42dd-8f1e-08302e48c167" data-file-name="components/excel-returned-parts-processor.tsx">
              Cancel
            </span></button>
            <button onClick={handleImport} disabled={processedData.length === 0 || isProcessing} className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium" data-unique-id="fd17233c-0172-418a-af4d-ffdc77e41c62" data-file-name="components/excel-returned-parts-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="28625445-9923-4c28-a5fc-c6891332335a" data-file-name="components/excel-returned-parts-processor.tsx">
              Import </span>{processedData.length > 0 ? `${processedData.length} ` : ''}<span className="editable-text" data-unique-id="89c2af23-192f-4665-b43b-62802d3125c5" data-file-name="components/excel-returned-parts-processor.tsx">Parts
            </span></button>
          </div>
        </div>
      </motion.div>
    </div>;
}