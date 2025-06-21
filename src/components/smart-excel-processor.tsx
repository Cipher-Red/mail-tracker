'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, X, Download, File, Loader2, AlertTriangle, Info, Wand2, RefreshCw } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import Fuse from 'fuse.js';
import { ReturnedPart } from './returned-parts-manager';
import toast from 'react-hot-toast';
interface SmartExcelProcessorProps {
  onPartsProcessed: (parts: ReturnedPart[]) => void;
  isOpen: boolean;
  onClose: () => void;
}
interface ColumnMapping {
  originalName: string;
  mappedTo: string | null;
  confidence: number;
  sampleValues: string[];
}
interface ProcessingStep {
  step: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  message: string;
}
export default function SmartExcelProcessor({
  onPartsProcessed,
  isOpen,
  onClose
}: SmartExcelProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [rawData, setRawData] = useState<any[]>([]);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [processedData, setProcessedData] = useState<ReturnedPart[]>([]);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<'upload' | 'mapping' | 'preview' | 'complete'>('upload');

  // Field mappings for smart detection
  const fieldMappings = {
    partName: ['part name', 'part', 'product', 'item', 'component', 'part_name', 'product_name'],
    partNumber: ['part number', 'part#', 'part_number', 'sku', 'model', 'product_id', 'item_code'],
    customerName: ['customer', 'customer name', 'client', 'customer_name', 'client_name', 'buyer'],
    customerEmail: ['email', 'customer email', 'client email', 'customer_email', 'email_address'],
    orderNumber: ['order', 'order number', 'order#', 'order_number', 'order_id', 'po_number'],
    returnReason: ['reason', 'return reason', 'return_reason', 'issue', 'problem', 'defect'],
    trackingNumber: ['tracking', 'tracking number', 'tracking#', 'tracking_number', 'shipment', 'carrier_tracking'],
    shippedDate: ['shipped', 'ship date', 'shipped_date', 'date_shipped', 'sent_date'],
    expectedArrival: ['expected', 'arrival', 'expected_arrival', 'due_date', 'eta'],
    status: ['status', 'state', 'condition', 'stage'],
    notes: ['notes', 'comments', 'remarks', 'description', 'details']
  };
  const updateProcessingStep = (step: string, status: ProcessingStep['status'], message: string) => {
    setProcessingSteps(prev => {
      const existing = prev.find(p => p.step === step);
      if (existing) {
        return prev.map(p => p.step === step ? {
          ...p,
          status,
          message
        } : p);
      }
      return [...prev, {
        step,
        status,
        message
      }];
    });
  };
  const detectColumnMappings = (headers: string[], sampleData: any[]) => {
    const mappings: ColumnMapping[] = [];

    // Create a fuzzy search instance for each field type
    Object.entries(fieldMappings).forEach(([fieldKey, possibleNames]) => {
      const fuse = new Fuse(possibleNames, {
        threshold: 0.6,
        ignoreLocation: true,
        keys: ['value']
      });
      const fuseData = possibleNames.map(name => ({
        value: name
      }));
      headers.forEach(header => {
        const searchResults = fuse.search(header.toLowerCase());
        if (searchResults.length > 0) {
          const confidence = 1 - searchResults[0].score!;
          const sampleValues = sampleData.slice(0, 3).map(row => String(row[header] || '')).filter(Boolean);
          mappings.push({
            originalName: header,
            mappedTo: fieldKey,
            confidence,
            sampleValues
          });
        }
      });
    });

    // Add unmapped columns
    headers.forEach(header => {
      if (!mappings.find(m => m.originalName === header)) {
        const sampleValues = sampleData.slice(0, 3).map(row => String(row[header] || '')).filter(Boolean);
        mappings.push({
          originalName: header,
          mappedTo: null,
          confidence: 0,
          sampleValues
        });
      }
    });
    return mappings.sort((a, b) => b.confidence - a.confidence);
  };
  const transformAndCleanData = (data: any[], mappings: ColumnMapping[]) => {
    return data.map((row, index) => {
      const transformedPart: Partial<ReturnedPart> = {
        id: `import-${Date.now()}-${index}`,
        createdAt: new Date().toISOString()
      };
      mappings.forEach(mapping => {
        if (mapping.mappedTo && mapping.originalName in row) {
          const rawValue = row[mapping.originalName];
          const cleanedValue = cleanValue(rawValue, mapping.mappedTo);
          if (cleanedValue !== null) {
            (transformedPart as any)[mapping.mappedTo] = cleanedValue;
          }
        }
      });

      // Set defaults for required fields
      transformedPart.partName = transformedPart.partName || 'Imported Part';
      transformedPart.partNumber = transformedPart.partNumber || `PART-${index + 1}`;
      transformedPart.customerName = transformedPart.customerName || 'Unknown Customer';
      transformedPart.customerEmail = transformedPart.customerEmail || '';
      transformedPart.orderNumber = transformedPart.orderNumber || `ORDER-${Date.now()}-${index}`;
      transformedPart.returnReason = transformedPart.returnReason || 'Customer Return';
      transformedPart.trackingNumber = transformedPart.trackingNumber || '';
      transformedPart.shippedDate = transformedPart.shippedDate || new Date().toISOString().split('T')[0];
      transformedPart.expectedArrival = transformedPart.expectedArrival || '';
      transformedPart.status = transformedPart.status || 'shipped';
      transformedPart.notes = transformedPart.notes || '';
      return transformedPart as ReturnedPart;
    });
  };
  const cleanValue = (value: any, fieldType: string): any => {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const stringValue = String(value).trim();
    switch (fieldType) {
      case 'shippedDate':
      case 'expectedArrival':
        return cleanDate(stringValue);
      case 'status':
        return normalizeStatus(stringValue);
      case 'returnReason':
        return normalizeReturnReason(stringValue);
      case 'customerEmail':
        return cleanEmail(stringValue);
      default:
        return stringValue;
    }
  };
  const cleanDate = (dateStr: string): string => {
    if (!dateStr) return '';
    try {
      // Handle Excel serial dates
      if (/^\d+$/.test(dateStr)) {
        const serialDate = parseInt(dateStr);
        if (serialDate > 25569 && serialDate < 100000) {
          const date = new Date((serialDate - 25569) * 86400 * 1000);
          return date.toISOString().split('T')[0];
        }
      }
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch {
      // Ignore parsing errors
    }
    return '';
  };
  const normalizeStatus = (status: string): ReturnedPart['status'] => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('ship')) return 'shipped';
    if (statusLower.includes('transit') || statusLower.includes('transport')) return 'in_transit';
    if (statusLower.includes('arriv') || statusLower.includes('deliver')) return 'arrived';
    if (statusLower.includes('inspect')) return 'inspecting';
    if (statusLower.includes('complet') || statusLower.includes('finish')) return 'inspected';
    return 'shipped';
  };
  const normalizeReturnReason = (reason: string): string => {
    const reasonLower = reason.toLowerCase();
    if (reasonLower.includes('defect') || reasonLower.includes('broken')) return 'Defective';
    if (reasonLower.includes('wrong') || reasonLower.includes('incorrect')) return 'Wrong Part';
    if (reasonLower.includes('warrant')) return 'Warranty';
    if (reasonLower.includes('quality')) return 'Quality Issue';
    return reason || 'Customer Return';
  };
  const cleanEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? email.toLowerCase() : '';
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
    setProcessingSteps([]);
    setCurrentStep('upload');
    setFileName(file.name);
    try {
      updateProcessingStep('Reading File', 'processing', 'Reading Excel file...');
      const reader = new FileReader();
      reader.onload = async e => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, {
            type: 'binary'
          });
          updateProcessingStep('Reading File', 'completed', 'File read successfully');
          updateProcessingStep('Parsing Data', 'processing', 'Extracting data from worksheet...');
          if (workbook.SheetNames.length === 0) {
            throw new Error('No worksheets found in the Excel file');
          }
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          if (jsonData.length === 0) {
            throw new Error('No data found in the Excel file');
          }
          setRawData(jsonData);
          updateProcessingStep('Parsing Data', 'completed', `Extracted ${jsonData.length} rows of data`);
          updateProcessingStep('Analyzing Columns', 'processing', 'Detecting column mappings...');

          // Detect column mappings
          const headers = Object.keys(jsonData[0]);
          const mappings = detectColumnMappings(headers, jsonData.slice(0, 5));
          setColumnMappings(mappings);
          updateProcessingStep('Analyzing Columns', 'completed', `Mapped ${mappings.filter(m => m.mappedTo).length} columns automatically`);
          setCurrentStep('mapping');
        } catch (error) {
          console.error('Excel processing error:', error);
          updateProcessingStep('Parsing Data', 'error', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
          toast.error('Failed to process Excel file');
        }
        setIsProcessing(false);
      };
      reader.onerror = () => {
        updateProcessingStep('Reading File', 'error', 'Failed to read the file');
        setIsProcessing(false);
        toast.error('File reading error');
      };
      reader.readAsBinaryString(file);
    } catch (error) {
      updateProcessingStep('Reading File', 'error', 'An unexpected error occurred');
      setIsProcessing(false);
      toast.error('File processing error');
    }
  }, []);
  const handleMappingChange = (originalName: string, newMapping: string | null) => {
    setColumnMappings(prev => prev.map(mapping => mapping.originalName === originalName ? {
      ...mapping,
      mappedTo: newMapping
    } : mapping));
  };
  const generatePreview = () => {
    setIsProcessing(true);
    updateProcessingStep('Transforming Data', 'processing', 'Applying mappings and cleaning data...');
    setTimeout(() => {
      try {
        const transformed = transformAndCleanData(rawData, columnMappings);
        setProcessedData(transformed);
        updateProcessingStep('Transforming Data', 'completed', `Processed ${transformed.length} returned parts`);
        setCurrentStep('preview');
      } catch (error) {
        updateProcessingStep('Transforming Data', 'error', 'Failed to transform data');
        toast.error('Data transformation failed');
      }
      setIsProcessing(false);
    }, 1000);
  };
  const handleImport = () => {
    if (processedData.length > 0) {
      onPartsProcessed(processedData);
      toast.success(`Successfully imported ${processedData.length} returned parts!`, {
        duration: 5000
      });
      resetProcessor();
      onClose();
    }
  };
  const resetProcessor = () => {
    setRawData([]);
    setColumnMappings([]);
    setProcessedData([]);
    setProcessingSteps([]);
    setFileName('');
    setCurrentStep('upload');
    setIsProcessing(false);
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" data-unique-id="da4395a9-62fd-40ec-8839-8c3d55a390a6" data-file-name="components/smart-excel-processor.tsx">
      <motion.div initial={{
      opacity: 0,
      scale: 0.95
    }} animate={{
      opacity: 1,
      scale: 1
    }} exit={{
      opacity: 0,
      scale: 0.95
    }} className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden" data-unique-id="ad901593-63ee-41e2-b4d8-e6f2ce7af0c3" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50" data-unique-id="2e0ed454-b06b-4fb2-90a0-cd9846e7e218" data-file-name="components/smart-excel-processor.tsx">
          <div data-unique-id="70aa9eb6-f86e-480d-baba-76d1ab4c273e" data-file-name="components/smart-excel-processor.tsx">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center" data-unique-id="70e16450-5f5b-4c7c-a8af-a897135ff8f2" data-file-name="components/smart-excel-processor.tsx">
              <Wand2 className="mr-3 h-6 w-6 text-blue-600" /><span className="editable-text" data-unique-id="b3506605-ac1a-43cb-bf4a-741c582f31c5" data-file-name="components/smart-excel-processor.tsx">
              Smart Excel Processor
            </span></h2>
            <p className="text-sm text-gray-600 mt-1" data-unique-id="a4766617-64ce-4b7c-91cb-30fdc0b76d4a" data-file-name="components/smart-excel-processor.tsx"><span className="editable-text" data-unique-id="91dc1823-bdf4-4794-9ba4-de0c73891d86" data-file-name="components/smart-excel-processor.tsx">
              Import returned parts from any Excel format - we'll figure out the rest
            </span></p>
          </div>
          <button onClick={() => {
          resetProcessor();
          onClose();
        }} className="p-2 rounded-full hover:bg-white/50 transition-colors" data-unique-id="355177be-11d1-4ca3-a7d6-e2af4c5cccd9" data-file-name="components/smart-excel-processor.tsx">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 bg-gray-50 border-b" data-unique-id="7a04d83c-e2b8-434a-ba81-a91271b17df9" data-file-name="components/smart-excel-processor.tsx">
          <div className="flex items-center justify-between" data-unique-id="515f1807-f14a-4a02-97f7-84b539a2cd7d" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true">
            {['upload', 'mapping', 'preview', 'complete'].map((step, index) => <div key={step} className="flex items-center" data-unique-id="52673a5c-521e-4d8e-a787-a54db1155198" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === step ? 'bg-blue-600 text-white' : ['upload', 'mapping', 'preview'].indexOf(currentStep) > index ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`} data-unique-id="30b7f216-61af-4625-a869-ac3170be7ac5" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true">
                  {['upload', 'mapping', 'preview'].indexOf(currentStep) > index ? <CheckCircle className="h-4 w-4" data-unique-id="468aa80c-b364-4bf8-b8e2-c06662071a77" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true" /> : index + 1}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 capitalize" data-unique-id="de8c02e6-04bf-4343-8a90-d9b72bc7a127" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true">
                  {step}
                </span>
                {index < 3 && <div className="w-16 h-0.5 bg-gray-300 mx-4" data-unique-id="3488c21c-fe17-4ee4-aa05-7882387fcba7" data-file-name="components/smart-excel-processor.tsx" />}
              </div>)}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto" data-unique-id="936acbe2-2a5a-4e6d-835d-3f0c46304229" data-file-name="components/smart-excel-processor.tsx">
          <AnimatePresence mode="wait">
            {currentStep === 'upload' && <motion.div key="upload" initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} exit={{
            opacity: 0,
            x: 20
          }} data-unique-id="d78713c5-58ab-4a6e-baf7-7f18432b0994" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true">
                {/* Upload Area */}
                <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${isDragActive ? 'border-blue-400 bg-blue-50 scale-[1.02]' : isDragReject ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:scale-[1.01]'} ${isProcessing ? 'pointer-events-none opacity-60' : ''}`} data-unique-id="04f00168-dc96-40e6-9477-a8478686b814" data-file-name="components/smart-excel-processor.tsx">
                  <input {...getInputProps()} data-unique-id="e976bef1-d6b1-4ae2-8c99-8cd5b8826218" data-file-name="components/smart-excel-processor.tsx" />
                  
                  <AnimatePresence mode="wait">
                    {isProcessing ? <motion.div key="processing" initial={{
                  opacity: 0
                }} animate={{
                  opacity: 1
                }} exit={{
                  opacity: 0
                }} className="flex flex-col items-center" data-unique-id="3a111bd3-b095-4c74-96dc-296d78e33d09" data-file-name="components/smart-excel-processor.tsx">
                        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                        <p className="text-lg font-medium text-gray-700 mb-2" data-unique-id="87f8fe03-914b-4f28-b58e-3821db3cc3d7" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="77713764-6592-4cc5-b4b0-1191b1dfe68e" data-file-name="components/smart-excel-processor.tsx">
                          Processing </span>{fileName}<span className="editable-text" data-unique-id="205fae2c-5de3-4d0a-8dd6-1429d3e46988" data-file-name="components/smart-excel-processor.tsx">...
                        </span></p>
                        <p className="text-sm text-gray-500" data-unique-id="3d51129e-6e46-4fe5-9bd2-2434ad7c0365" data-file-name="components/smart-excel-processor.tsx"><span className="editable-text" data-unique-id="d58f6f69-a4df-43ae-827c-71c445036ac0" data-file-name="components/smart-excel-processor.tsx">AI is analyzing your data</span></p>
                      </motion.div> : <motion.div key="upload" initial={{
                  opacity: 0
                }} animate={{
                  opacity: 1
                }} exit={{
                  opacity: 0
                }} className="flex flex-col items-center" data-unique-id="17425f01-813e-4cf2-9625-6d4deeed84af" data-file-name="components/smart-excel-processor.tsx">
                        <div className="p-4 bg-blue-100 rounded-full mb-4" data-unique-id="c541ac2c-765a-487d-8f9e-30983e2f9b66" data-file-name="components/smart-excel-processor.tsx">
                          <Upload className="h-8 w-8 text-blue-600" />
                        </div>
                        <p className="text-lg font-medium text-gray-700 mb-2" data-unique-id="27b48d3f-bdc8-4213-8f80-ee1aaaffdbc1" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true">
                          {isDragActive ? 'Drop your Excel file here' : 'Upload any Excel file format'}
                        </p>
                        <p className="text-sm text-gray-500 mb-4" data-unique-id="186acce5-f00f-4afa-aac3-b9727455a998" data-file-name="components/smart-excel-processor.tsx"><span className="editable-text" data-unique-id="d6e904d6-dda5-4b4b-97db-ed47feec0b4e" data-file-name="components/smart-excel-processor.tsx">
                          Our AI will automatically detect and map your columns
                        </span></p>
                        <button type="button" className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium" data-unique-id="12563ebc-62dc-454b-99b2-5aed02903b44" data-file-name="components/smart-excel-processor.tsx"><span className="editable-text" data-unique-id="d5569299-bca6-441a-af45-cb9137d401f4" data-file-name="components/smart-excel-processor.tsx">
                          Choose Excel File
                        </span></button>
                      </motion.div>}
                  </AnimatePresence>
                </div>

                {/* Processing Steps */}
                {processingSteps.length > 0 && <div className="mt-6 space-y-2" data-unique-id="bd161996-42d8-4734-9af4-282752d73e22" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true">
                    {processingSteps.map((step, index) => <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg" data-unique-id="43672526-ff1b-4620-8a5c-dd2f665d4748" data-file-name="components/smart-excel-processor.tsx">
                        <div className="mr-3" data-unique-id="130fce3e-2949-4546-8849-535bc29bcee4" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true">
                          {step.status === 'processing' && <Loader2 className="h-4 w-4 animate-spin text-blue-500" data-unique-id="0f37faff-be1c-427c-86f4-63d5c07821dd" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true" />}
                          {step.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" data-unique-id="7b3428ab-0fb1-4644-a556-b924ffb6de36" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true" />}
                          {step.status === 'error' && <AlertCircle className="h-4 w-4 text-red-500" data-unique-id="4d3fd370-ef94-4d8e-bc08-9a00691942d7" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true" />}
                        </div>
                        <div data-unique-id="86a84682-5e73-419d-81fa-8805c3c3b85b" data-file-name="components/smart-excel-processor.tsx">
                          <p className="font-medium text-gray-800" data-unique-id="f9ca57f8-f24e-44ac-bc0b-2124993aaf12" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true">{step.step}</p>
                          <p className="text-sm text-gray-600" data-unique-id="6eba8364-cdf0-4a55-8ac1-d11c88457ce9" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true">{step.message}</p>
                        </div>
                      </div>)}
                  </div>}
              </motion.div>}

            {currentStep === 'mapping' && <motion.div key="mapping" initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} exit={{
            opacity: 0,
            x: 20
          }} data-unique-id="902b5e76-2d99-4745-8258-d3d917dcd09d" data-file-name="components/smart-excel-processor.tsx">
                <div className="mb-6" data-unique-id="14e18784-493a-4cc3-9de3-5d4b8dd413af" data-file-name="components/smart-excel-processor.tsx">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2" data-unique-id="3e6710eb-0e69-4372-bc9a-b0142c557647" data-file-name="components/smart-excel-processor.tsx"><span className="editable-text" data-unique-id="c95a198f-d552-4b41-9bc7-f03194ca3f9e" data-file-name="components/smart-excel-processor.tsx">Column Mapping</span></h3>
                  <p className="text-sm text-gray-600" data-unique-id="4d737f22-df04-4c44-bea7-ce480f56fe4f" data-file-name="components/smart-excel-processor.tsx"><span className="editable-text" data-unique-id="b1893c4a-ff4e-43b4-9bfe-1860bda8bd39" data-file-name="components/smart-excel-processor.tsx">
                    Review and adjust how your Excel columns map to returned part fields
                  </span></p>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto" data-unique-id="7665ae53-1a8b-487f-ab55-c27da5d73009" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true">
                  {columnMappings.map((mapping, index) => <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg" data-unique-id="b015646f-4be4-4468-9b9d-8090668af777" data-file-name="components/smart-excel-processor.tsx">
                      <div className="flex-1" data-unique-id="1abc14e6-c854-40cb-ab9d-8d0679dac971" data-file-name="components/smart-excel-processor.tsx">
                        <div className="flex items-center gap-3" data-unique-id="94241c21-b17f-4ebc-817c-20a742a4736b" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true">
                          <div className="font-medium text-gray-800" data-unique-id="3e13724e-1a3d-417d-baa7-a6f1eef7c4c9" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true">
                            {mapping.originalName}
                          </div>
                          {mapping.confidence > 0.7 && <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full" data-unique-id="63291e05-8c4b-42f4-9404-f5e096c2cb85" data-file-name="components/smart-excel-processor.tsx"><span className="editable-text" data-unique-id="ed9bd1aa-6631-412e-b036-90866a28732b" data-file-name="components/smart-excel-processor.tsx">
                              High Confidence
                            </span></span>}
                          {mapping.confidence > 0.4 && mapping.confidence <= 0.7 && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full" data-unique-id="315b20d5-91b2-44d0-8012-35f437a98f7b" data-file-name="components/smart-excel-processor.tsx"><span className="editable-text" data-unique-id="78360348-7bd6-4f06-b4d4-3fcdb53248fb" data-file-name="components/smart-excel-processor.tsx">
                              Medium Confidence
                            </span></span>}
                        </div>
                        <div className="text-sm text-gray-500 mt-1" data-unique-id="ab8f9707-cc07-415c-acf5-20cf5bfb25f3" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="b2c87f39-90ff-4e86-a3e3-8c93822089b2" data-file-name="components/smart-excel-processor.tsx">
                          Sample: </span>{mapping.sampleValues.slice(0, 2).join(', ')}
                        </div>
                      </div>
                      <div className="ml-4" data-unique-id="4ff7f4e9-8043-4897-aff6-5c22551b70f6" data-file-name="components/smart-excel-processor.tsx">
                        <select value={mapping.mappedTo || ''} onChange={e => handleMappingChange(mapping.originalName, e.target.value || null)} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" data-unique-id="8ff8bd3f-fe0b-4333-84b2-1a17e659b2db" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true">
                          <option value="" data-unique-id="1edcb180-e8cf-4f9e-a198-aaa960b63ef1" data-file-name="components/smart-excel-processor.tsx"><span className="editable-text" data-unique-id="32ab864a-9141-4188-afd0-1bc64c69659c" data-file-name="components/smart-excel-processor.tsx">Don't Import</span></option>
                          {Object.keys(fieldMappings).map(field => <option key={field} value={field} data-unique-id="c9fd692a-c1e3-42b4-a903-6a8d570c4725" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true">
                              {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                            </option>)}
                        </select>
                      </div>
                    </div>)}
                </div>

                <div className="mt-6 flex justify-end gap-3" data-unique-id="616f208c-68c0-4d3d-acfe-88613c7aaca2" data-file-name="components/smart-excel-processor.tsx">
                  <button onClick={() => setCurrentStep('upload')} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50" data-unique-id="a1a333a0-d54c-4197-b118-38e44633a7ae" data-file-name="components/smart-excel-processor.tsx"><span className="editable-text" data-unique-id="e1d36b62-9f9b-439b-9eb0-4e6ce05ba2f6" data-file-name="components/smart-excel-processor.tsx">
                    Back
                  </span></button>
                  <button onClick={generatePreview} disabled={isProcessing} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50" data-unique-id="0431f5ab-ff4c-4215-a6ed-560fc08d920c" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true">
                    {isProcessing ? 'Processing...' : 'Generate Preview'}
                  </button>
                </div>
              </motion.div>}

            {currentStep === 'preview' && <motion.div key="preview" initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} exit={{
            opacity: 0,
            x: 20
          }} data-unique-id="e30a6f92-25cd-4fe1-9b5c-0497a722f019" data-file-name="components/smart-excel-processor.tsx">
                <div className="mb-6" data-unique-id="4b64138a-7607-49fb-90ab-d2351375974e" data-file-name="components/smart-excel-processor.tsx">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2" data-unique-id="231c109c-2dee-43ca-a9d2-cb355a6a9b85" data-file-name="components/smart-excel-processor.tsx"><span className="editable-text" data-unique-id="6c9d3f9a-86d7-446a-a498-1a98badda78e" data-file-name="components/smart-excel-processor.tsx">Import Preview</span></h3>
                  <p className="text-sm text-gray-600" data-unique-id="b931cb60-70b9-48e3-9efd-5e1ec63225bf" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="c3943fb0-95ef-40f4-8a9b-9a54516de9af" data-file-name="components/smart-excel-processor.tsx">
                    Review the processed data before importing (</span>{processedData.length}<span className="editable-text" data-unique-id="6219d474-ee28-4e3b-83e4-648073c767a5" data-file-name="components/smart-excel-processor.tsx"> items)
                  </span></p>
                </div>

                <div className="bg-white border rounded-lg max-h-96 overflow-y-auto" data-unique-id="d2ca715a-d985-470c-ba03-b9e1fecc4716" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true">
                  <div className="grid grid-cols-6 gap-4 p-3 bg-gray-50 text-xs font-medium text-gray-700 border-b" data-unique-id="212e2994-bd75-4a70-9616-787e46112a6f" data-file-name="components/smart-excel-processor.tsx">
                    <div data-unique-id="4a66dac3-6b19-40e5-ba89-c8ffca8483ab" data-file-name="components/smart-excel-processor.tsx"><span className="editable-text" data-unique-id="aeb22daf-efb1-466e-b0da-c15f0ef462f3" data-file-name="components/smart-excel-processor.tsx">Part Name</span></div>
                    <div data-unique-id="bed2ef5c-fd56-4334-9afd-45d163814291" data-file-name="components/smart-excel-processor.tsx"><span className="editable-text" data-unique-id="16b8c4ba-c81b-40af-9337-d336f06c2e02" data-file-name="components/smart-excel-processor.tsx">Customer</span></div>
                    <div data-unique-id="1523bef6-8616-44fa-895b-5ac763ddaa4f" data-file-name="components/smart-excel-processor.tsx"><span className="editable-text" data-unique-id="00312432-0b11-49b6-af72-9079959b8eb3" data-file-name="components/smart-excel-processor.tsx">Order #</span></div>
                    <div data-unique-id="c3dbf650-099f-4708-b6ca-918124a45dc7" data-file-name="components/smart-excel-processor.tsx"><span className="editable-text" data-unique-id="45eeb3eb-aa37-4830-bd61-80dc343c61ae" data-file-name="components/smart-excel-processor.tsx">Tracking</span></div>
                    <div data-unique-id="48d5ea4f-0326-473c-adc7-e176fbf31d7a" data-file-name="components/smart-excel-processor.tsx"><span className="editable-text" data-unique-id="1141f156-7861-4144-a7c7-9484c1149f6d" data-file-name="components/smart-excel-processor.tsx">Status</span></div>
                    <div data-unique-id="ed18bb16-d9c6-423e-8af7-4aafda9a210f" data-file-name="components/smart-excel-processor.tsx"><span className="editable-text" data-unique-id="bec6f28d-c53e-4a1e-b7f3-eee7474fdc71" data-file-name="components/smart-excel-processor.tsx">Return Reason</span></div>
                  </div>
                  {processedData.slice(0, 10).map((part, index) => <div key={index} className="grid grid-cols-6 gap-4 p-3 text-sm border-b hover:bg-gray-50" data-unique-id="68cffabb-63cc-43f3-b83a-d954c77328a3" data-file-name="components/smart-excel-processor.tsx">
                      <div className="truncate" data-unique-id="dd84dc38-5490-42d8-8a2d-150d8d0ee740" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true">{part.partName}</div>
                      <div className="truncate" data-unique-id="550cf3b6-49f9-4772-ac38-c5211d2aafbd" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true">{part.customerName}</div>
                      <div className="truncate" data-unique-id="0f406bb1-277b-475d-882b-7c1df00e627d" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true">{part.orderNumber}</div>
                      <div className="truncate" data-unique-id="b014f88b-3fac-4285-9c20-875042a2f61b" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true">{part.trackingNumber || 'N/A'}</div>
                      <div className="capitalize" data-unique-id="9227617b-7768-48ce-bb1f-a8e876043e0e" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true">{part.status}</div>
                      <div className="truncate" data-unique-id="2433333d-5d4b-4fa0-bc2e-a1d265d62ba2" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true">{part.returnReason}</div>
                    </div>)}
                  {processedData.length > 10 && <div className="p-3 text-center text-sm text-gray-500 bg-gray-50" data-unique-id="b3491914-5744-45f8-ae11-cb2c1d80e763" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="e81a1ea0-3f9b-4433-af69-8ad65973d8ec" data-file-name="components/smart-excel-processor.tsx">
                      ... and </span>{processedData.length - 10}<span className="editable-text" data-unique-id="f5d6aad5-ad71-4896-a5bc-adc6033ea900" data-file-name="components/smart-excel-processor.tsx"> more items
                    </span></div>}
                </div>

                <div className="mt-6 flex justify-between" data-unique-id="dc72d697-13be-41fa-ba07-1f04b641f725" data-file-name="components/smart-excel-processor.tsx">
                  <button onClick={() => setCurrentStep('mapping')} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50" data-unique-id="c93dd16b-166f-4b2f-a463-c50cceab7881" data-file-name="components/smart-excel-processor.tsx"><span className="editable-text" data-unique-id="2572f733-961f-45d9-b067-7850b279571d" data-file-name="components/smart-excel-processor.tsx">
                    Back to Mapping
                  </span></button>
                  <button onClick={handleImport} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium" data-unique-id="40c5fe39-1331-4f5b-89a0-a362a120305e" data-file-name="components/smart-excel-processor.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="a5f4c9df-ef9f-4c81-91e2-8971340d37fd" data-file-name="components/smart-excel-processor.tsx">
                    Import </span>{processedData.length}<span className="editable-text" data-unique-id="2312deb2-1653-4fc5-8b69-82bbafae7e6d" data-file-name="components/smart-excel-processor.tsx"> Parts
                  </span></button>
                </div>
              </motion.div>}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>;
}