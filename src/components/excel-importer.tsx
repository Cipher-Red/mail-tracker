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
  }} className="bg-card border border-border rounded-lg p-6 shadow-md" data-unique-id="01c911e2-6742-474c-a8cb-62fb80b78f47" data-file-name="components/excel-importer.tsx" data-dynamic-text="true">
      <div className="flex items-center mb-4" data-unique-id="1825f6eb-b8e9-4641-9eca-1f124c7d8d45" data-file-name="components/excel-importer.tsx">
        <FileSpreadsheet className="h-5 w-5 text-primary mr-2" />
        <h3 className="text-lg font-medium" data-unique-id="a36bcd7b-403b-4770-9447-fc004eff8840" data-file-name="components/excel-importer.tsx"><span className="editable-text" data-unique-id="5148bb5d-3769-4989-9f1d-27f6324e7bd8" data-file-name="components/excel-importer.tsx">Import Excel Data</span></h3>
      </div>

      {/* File Upload Area */}
      <div className="mb-4" data-unique-id="c6f53ca2-f8d9-4f10-9edb-dd0f5839b586" data-file-name="components/excel-importer.tsx">
        <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" disabled={isImporting} data-unique-id="a1683f29-000a-49fa-82ea-e19c27bb0135" data-file-name="components/excel-importer.tsx" />
        
        <div onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isImporting ? 'border-gray-300 bg-gray-50 cursor-not-allowed' : 'border-primary/30 hover:border-primary/50 hover:bg-primary/5'}`} data-unique-id="06db254b-65a0-41d6-99d9-84a48860bb6d" data-file-name="components/excel-importer.tsx" data-dynamic-text="true">
          {isImporting ? <div className="flex flex-col items-center" data-unique-id="a89509a1-35ea-4d23-a648-cb0fca99b793" data-file-name="components/excel-importer.tsx">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" data-unique-id="82d7feb1-1b19-4e47-b347-7b305d5e6fe1" data-file-name="components/excel-importer.tsx"></div>
              <p className="text-sm text-muted-foreground" data-unique-id="87b6c47c-172b-45b2-b060-85f413869317" data-file-name="components/excel-importer.tsx"><span className="editable-text" data-unique-id="85b96990-95c0-431e-a9ec-7e9150322ea6" data-file-name="components/excel-importer.tsx">Processing Excel file...</span></p>
            </div> : <div className="flex flex-col items-center" data-unique-id="7be4c57b-ad51-435c-85e7-d1e778fe4944" data-file-name="components/excel-importer.tsx">
              <Upload className="h-8 w-8 text-primary mb-2" />
              <p className="text-sm font-medium mb-1" data-unique-id="c84e9c1b-be4e-42aa-b7ae-0f63c75f9752" data-file-name="components/excel-importer.tsx"><span className="editable-text" data-unique-id="d2b3b94f-f498-444d-968f-6fbcd8ed8b91" data-file-name="components/excel-importer.tsx">Click to upload Excel file</span></p>
              <p className="text-xs text-muted-foreground" data-unique-id="526d8e9d-b911-47d0-8c2f-19da9689b9ae" data-file-name="components/excel-importer.tsx"><span className="editable-text" data-unique-id="5340201e-d700-4e99-9854-2773b3a1b0c5" data-file-name="components/excel-importer.tsx">Supports .xlsx and .xls files</span></p>
            </div>}
        </div>
      </div>

      {/* Expected Format */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg" data-unique-id="9156667e-ec3d-4d42-ae5a-bf54c15f9b9c" data-file-name="components/excel-importer.tsx">
        <h4 className="text-sm font-medium text-blue-800 mb-2" data-unique-id="2c70d8a5-9557-487b-ba27-e0271366f8cc" data-file-name="components/excel-importer.tsx"><span className="editable-text" data-unique-id="764e7fbb-cef3-4f22-943e-d39ddf08101b" data-file-name="components/excel-importer.tsx">Expected Excel Columns:</span></h4>
        <div className="text-xs text-blue-700 grid grid-cols-2 gap-1" data-unique-id="3fa1513b-cf49-43f0-953c-bee3972eb469" data-file-name="components/excel-importer.tsx">
          <span data-unique-id="18232dc1-c844-4041-893c-9671ea5a5f3d" data-file-name="components/excel-importer.tsx"><span className="editable-text" data-unique-id="7c69e17a-fbab-4ed0-8c43-56939038dbba" data-file-name="components/excel-importer.tsx">• Customer</span></span>
          <span data-unique-id="43fbd2de-da0a-4bca-865d-39816c18f8d6" data-file-name="components/excel-importer.tsx"><span className="editable-text" data-unique-id="d3bb5602-0bcc-48dd-b533-6811cac0036d" data-file-name="components/excel-importer.tsx">• Date</span></span>
          <span data-unique-id="7f5ea494-eeec-4aa3-91ee-aeb0df6fd7c1" data-file-name="components/excel-importer.tsx"><span className="editable-text" data-unique-id="1db9634c-3d10-4d3c-bb40-a383ca96422e" data-file-name="components/excel-importer.tsx">• Push/Pull</span></span>
          <span data-unique-id="801dbba5-0f8b-4f07-9cf1-1ba038b4c800" data-file-name="components/excel-importer.tsx"><span className="editable-text" data-unique-id="b237bf7a-ff97-4de4-a8be-8d5922bd2584" data-file-name="components/excel-importer.tsx">• Notes</span></span>
          <span data-unique-id="db6bce41-de7e-47bb-8cd3-d0cb1ae52f90" data-file-name="components/excel-importer.tsx"><span className="editable-text" data-unique-id="20544144-c110-4a0f-b5f1-c103b837f3a9" data-file-name="components/excel-importer.tsx">• Team</span></span>
          <span data-unique-id="063475d7-0252-4f69-99d6-d612a74693fa" data-file-name="components/excel-importer.tsx"><span className="editable-text" data-unique-id="f973e6fa-3e50-4f99-8970-402aa8c2c649" data-file-name="components/excel-importer.tsx">• Owner</span></span>
          <span data-unique-id="8ca9483a-1fd5-4a9a-a0ef-a5a079848fee" data-file-name="components/excel-importer.tsx"><span className="editable-text" data-unique-id="a4acedf1-d356-49a4-a0e2-9f4061519c81" data-file-name="components/excel-importer.tsx">• Progress</span></span>
          <span data-unique-id="5fa3b256-fa6d-41a1-9d93-98d17ab7f2f2" data-file-name="components/excel-importer.tsx"><span className="editable-text" data-unique-id="e76db2bd-b829-443d-92ad-ee745f46035b" data-file-name="components/excel-importer.tsx">• Type</span></span>
        </div>
      </div>

      {/* Status Messages */}
      {importStatus === 'success' && <motion.div initial={{
      opacity: 0,
      scale: 0.95
    }} animate={{
      opacity: 1,
      scale: 1
    }} className="flex items-center p-3 bg-green-50 text-green-700 rounded-lg border border-green-200" data-unique-id="40afba28-b3dd-4e73-ac9c-b90d931e38e9" data-file-name="components/excel-importer.tsx">
          <CheckCircle className="h-4 w-4 mr-2" />
          <span className="text-sm" data-unique-id="51674099-f242-4692-9e49-025463d1073f" data-file-name="components/excel-importer.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="924873ca-057f-4e08-b0c1-656ed1f098a2" data-file-name="components/excel-importer.tsx">Successfully imported </span>{importedCount}<span className="editable-text" data-unique-id="99958c15-fa6c-4889-a870-9ed75c50435e" data-file-name="components/excel-importer.tsx"> entries!</span></span>
        </motion.div>}

      {importStatus === 'error' && <motion.div initial={{
      opacity: 0,
      scale: 0.95
    }} animate={{
      opacity: 1,
      scale: 1
    }} className="flex items-start p-3 bg-red-50 text-red-700 rounded-lg border border-red-200" data-unique-id="a8204859-4336-42b4-bb03-11a0c7688667" data-file-name="components/excel-importer.tsx">
          <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm" data-unique-id="3c45c0eb-9cf7-404f-a1e3-29723c109cc4" data-file-name="components/excel-importer.tsx">
            <p className="font-medium" data-unique-id="2f3525b3-47a8-4cd3-91bf-ab0cea7ffe80" data-file-name="components/excel-importer.tsx"><span className="editable-text" data-unique-id="d310d816-cedc-4f00-98b8-887fb8592937" data-file-name="components/excel-importer.tsx">Import Failed</span></p>
            <p data-unique-id="0adf4109-0ed8-4e97-8a00-0b446fb668fa" data-file-name="components/excel-importer.tsx" data-dynamic-text="true">{errorMessage}</p>
          </div>
        </motion.div>}
    </motion.div>;
}