'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useDataExplorerStore } from '@/lib/data-explorer-store';
import { v4 as uuidv4 } from 'uuid';
interface ExcelImporterProps {
  onImportComplete?: () => void;
}
interface ActionEntry {
  id: string;
  date: string;
  orderId: string;
  parts: string;
  sku: string;
  trackingNumber: string;
  pushPull: 'Push' | 'Pull';
  agentName: string;
  whAction: string;
  notes: string;
  urgent: boolean;
  createdAt: string;
}
export default function ExcelImporter({
  onImportComplete
}: ExcelImporterProps) {
  const {
    importFromExcel
  } = useDataExplorerStore();
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [importedCount, setImportedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    setImportStatus('idle');
    setErrorMessage('');
    try {
      // Import XLSX dynamically to avoid SSR issues
      const XLSX = await import('xlsx');
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, {
            type: 'binary'
          });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          // Map Excel data to our ActionEntry format
          const mappedData: ActionEntry[] = jsonData.map((row: any) => ({
            id: uuidv4(),
            date: formatDate(row.Date || row.date || new Date().toISOString()),
            orderId: row.OrderId || row.orderId || `ORD-${Date.now()}`,
            parts: row.Parts || row.parts || '',
            sku: row.SKU || row.sku || '',
            trackingNumber: row.TrackingNumber || row.trackingNumber || '',
            pushPull: (row['Push/Pull'] || row.pushPull || row.PushPull || 'Push') as 'Push' | 'Pull',
            agentName: row.AgentName || row.agentName || '',
            whAction: row.WHAction || row.whAction || '',
            notes: row.Notes || row.notes || '',
            urgent: Boolean(row.Urgent || row.urgent || false),
            createdAt: new Date().toISOString(),
            // Legacy fields for backward compatibility
            customer: row.Customer || row.customer || '',
            team: row.Team || row.team || '',
            owner: row.Owner || row.owner || '',
            progress: row.Progress || row.progress || '0%',
            type: row.Type || row.type || ''
          }));

          // Filter out rows with missing required data
          const validData = mappedData.filter(item => item.agentName && item.notes);
          if (validData.length === 0) {
            throw new Error('No valid data found. Please ensure your Excel file has AgentName and Notes columns.');
          }

          // Import the data
          importFromExcel(validData);
          setImportedCount(validData.length);
          setImportStatus('success');
          if (onImportComplete) {
            onImportComplete();
          }
        } catch (error) {
          console.error('Error parsing Excel file:', error);
          setErrorMessage(error instanceof Error ? error.message : 'Failed to parse Excel file');
          setImportStatus('error');
        } finally {
          setIsImporting(false);
        }
      };
      reader.onerror = () => {
        setErrorMessage('Failed to read the file');
        setImportStatus('error');
        setIsImporting(false);
      };
      reader.readAsBinaryString(file);
    } catch (error) {
      setErrorMessage('Failed to load Excel parser');
      setImportStatus('error');
      setIsImporting(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const formatDate = (dateValue: any): string => {
    if (!dateValue) return new Date().toISOString().split('T')[0];

    // Handle Excel date numbers
    if (typeof dateValue === 'number') {
      // Excel dates are stored as days since 1900-01-01
      const excelEpoch = new Date(1899, 11, 30); // Excel's epoch (with leap year bug compensation)
      const date = new Date(excelEpoch.getTime() + dateValue * 24 * 60 * 60 * 1000);
      return date.toISOString().split('T')[0];
    }

    // Handle string dates
    try {
      return new Date(dateValue).toISOString().split('T')[0];
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  };
  return <motion.div initial={{
    opacity: 0,
    y: 10
  }} animate={{
    opacity: 1,
    y: 0
  }} className="bg-card border border-border rounded-lg p-6 shadow-md" data-unique-id="b48213bf-c57a-43c5-9c70-c8549f7e67dd" data-file-name="components/excel-importer.tsx" data-dynamic-text="true">
      <div className="flex items-center mb-4" data-unique-id="2f00d489-db0e-4e60-a67f-1bfa6d4c98eb" data-file-name="components/excel-importer.tsx">
        <FileSpreadsheet className="h-5 w-5 text-primary mr-2" />
        <h3 className="text-lg font-medium" data-unique-id="53fe4fc4-54e7-42d4-86cd-183f790fa482" data-file-name="components/excel-importer.tsx"><span className="editable-text" data-unique-id="b47a2a12-634b-4f2b-a225-7cdd5086e9a3" data-file-name="components/excel-importer.tsx">Import Excel Data</span></h3>
      </div>

      {/* File Upload Area */}
      <div className="mb-4" data-unique-id="b111c9bc-be51-442d-9346-d674469ee270" data-file-name="components/excel-importer.tsx">
        <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" disabled={isImporting} data-unique-id="bd876b6e-c487-4868-a7bb-5e4cf9d9c2e7" data-file-name="components/excel-importer.tsx" />
        
        <div onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isImporting ? 'border-gray-300 bg-gray-50 cursor-not-allowed' : 'border-primary/30 hover:border-primary/50 hover:bg-primary/5'}`} data-unique-id="1fe212b4-030e-4ced-b2d6-e1d956b83474" data-file-name="components/excel-importer.tsx" data-dynamic-text="true">
          {isImporting ? <div className="flex flex-col items-center" data-unique-id="067008af-4d0e-426f-bd29-8f804a9c8767" data-file-name="components/excel-importer.tsx">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" data-unique-id="af5e80ad-9ad4-44ba-a032-be43665372f2" data-file-name="components/excel-importer.tsx"></div>
              <p className="text-sm text-muted-foreground" data-unique-id="4b9740fc-d85c-4667-af9b-75f25f06aaea" data-file-name="components/excel-importer.tsx"><span className="editable-text" data-unique-id="a332cb71-edb6-456e-a7f9-eb41731ebd1b" data-file-name="components/excel-importer.tsx">Processing Excel file...</span></p>
            </div> : <div className="flex flex-col items-center" data-unique-id="0f54467b-2cb3-46cf-8d8e-6757c5a8be2b" data-file-name="components/excel-importer.tsx">
              <Upload className="h-8 w-8 text-primary mb-2" />
              <p className="text-sm font-medium mb-1" data-unique-id="e1f5a0c6-2aa5-4c77-9917-2638d078edca" data-file-name="components/excel-importer.tsx"><span className="editable-text" data-unique-id="6d08d7b0-7926-4d9a-91fc-4df524429c86" data-file-name="components/excel-importer.tsx">Click to upload Excel file</span></p>
              <p className="text-xs text-muted-foreground" data-unique-id="bee8b50a-e0e5-48c4-b870-98964fdde528" data-file-name="components/excel-importer.tsx"><span className="editable-text" data-unique-id="2f205007-c343-4be8-8165-5ece92c2e3a4" data-file-name="components/excel-importer.tsx">Supports .xlsx and .xls files</span></p>
            </div>}
        </div>
      </div>

      {/* Expected Format */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg" data-unique-id="4c924aa7-afc9-4c18-ae7b-6abfac17ae84" data-file-name="components/excel-importer.tsx">
        <h4 className="text-sm font-medium text-blue-800 mb-2" data-unique-id="36b03e40-ba84-4a67-8bfc-c6e0380a3c29" data-file-name="components/excel-importer.tsx"><span className="editable-text" data-unique-id="ac54c7f6-ab79-48ef-b4af-dbfe4e8ed6d2" data-file-name="components/excel-importer.tsx">Expected Excel Columns:</span></h4>
        <div className="text-xs text-blue-700 grid grid-cols-2 gap-1" data-unique-id="8e176cd1-6313-466e-b6f6-13e98cf52972" data-file-name="components/excel-importer.tsx">
          <span data-unique-id="5bc15356-0727-4ad8-bb37-75cfbd374acd" data-file-name="components/excel-importer.tsx"><span className="editable-text" data-unique-id="f08f8afb-6e94-471e-bc3a-cc4f6c7fecc0" data-file-name="components/excel-importer.tsx">• Customer</span></span>
          <span data-unique-id="4c5b4fba-75a4-438a-b5f6-8a576e5b07e8" data-file-name="components/excel-importer.tsx"><span className="editable-text" data-unique-id="7430525e-95f2-4cf2-804c-f0681e53c3c5" data-file-name="components/excel-importer.tsx">• Date</span></span>
          <span data-unique-id="0fe7191b-0157-42e2-816b-63cb0cfdd6e1" data-file-name="components/excel-importer.tsx"><span className="editable-text" data-unique-id="d470617a-6d24-40cf-9c0a-ca5d6f354c79" data-file-name="components/excel-importer.tsx">• Push/Pull</span></span>
          <span data-unique-id="cb9e596b-53bf-4f79-97b8-88843d51cb0b" data-file-name="components/excel-importer.tsx"><span className="editable-text" data-unique-id="fa064f43-3346-4dd1-b6c8-601c71856c71" data-file-name="components/excel-importer.tsx">• Notes</span></span>
          <span data-unique-id="a39b2ff2-82bc-4b65-91a5-9a7b6bf3d958" data-file-name="components/excel-importer.tsx"><span className="editable-text" data-unique-id="cd8af405-c315-44c0-889e-2c4c3e2d8d9b" data-file-name="components/excel-importer.tsx">• Team</span></span>
          <span data-unique-id="361edb33-3a0b-4e44-886f-33978bbce5d0" data-file-name="components/excel-importer.tsx"><span className="editable-text" data-unique-id="b20f89ee-d22b-40cc-a7a3-ae43bf6a5a74" data-file-name="components/excel-importer.tsx">• Owner</span></span>
          <span data-unique-id="96e3d6e1-6d43-4eb7-bff5-5cb4939e8ac6" data-file-name="components/excel-importer.tsx"><span className="editable-text" data-unique-id="905089fa-467c-4253-97ab-f46eccb8fa42" data-file-name="components/excel-importer.tsx">• Progress</span></span>
          <span data-unique-id="bbfbe6a1-b6ad-44aa-920d-6047b95f3873" data-file-name="components/excel-importer.tsx"><span className="editable-text" data-unique-id="51b7f2f1-138b-48d1-aa00-2e93745c76cd" data-file-name="components/excel-importer.tsx">• Type</span></span>
        </div>
      </div>

      {/* Status Messages */}
      {importStatus === 'success' && <motion.div initial={{
      opacity: 0,
      scale: 0.95
    }} animate={{
      opacity: 1,
      scale: 1
    }} className="flex items-center p-3 bg-green-50 text-green-700 rounded-lg border border-green-200" data-unique-id="0b38feb5-c129-4856-a449-20ad59bc86be" data-file-name="components/excel-importer.tsx">
          <CheckCircle className="h-4 w-4 mr-2" />
          <span className="text-sm" data-unique-id="df11e8a9-a3f6-49b7-b0a2-d2f14b02060e" data-file-name="components/excel-importer.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="b3705b2e-094b-4da9-ad84-6de55bc06b0c" data-file-name="components/excel-importer.tsx">Successfully imported </span>{importedCount}<span className="editable-text" data-unique-id="9399c806-6b98-4c72-97d1-cbe938fc4cd8" data-file-name="components/excel-importer.tsx"> entries!</span></span>
        </motion.div>}

      {importStatus === 'error' && <motion.div initial={{
      opacity: 0,
      scale: 0.95
    }} animate={{
      opacity: 1,
      scale: 1
    }} className="flex items-start p-3 bg-red-50 text-red-700 rounded-lg border border-red-200" data-unique-id="15556c71-9207-4972-89ef-3a7a63177f99" data-file-name="components/excel-importer.tsx">
          <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm" data-unique-id="2ba23247-23d7-41f2-9ebc-06e756a36559" data-file-name="components/excel-importer.tsx">
            <p className="font-medium" data-unique-id="f80a9cc8-bfc8-443b-afd2-0583ce315bb1" data-file-name="components/excel-importer.tsx"><span className="editable-text" data-unique-id="c0bda761-7329-40a4-84c9-1528f9688ecc" data-file-name="components/excel-importer.tsx">Import Failed</span></p>
            <p data-unique-id="0455393e-abc2-4b0d-97b3-3731fda2bf60" data-file-name="components/excel-importer.tsx" data-dynamic-text="true">{errorMessage}</p>
          </div>
        </motion.div>}
    </motion.div>;
}