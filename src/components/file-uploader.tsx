'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, File, X, Loader2, FileSpreadsheet, FilePlus2, AlertOctagon } from 'lucide-react';
interface FileUploaderProps {
  onFileAccepted: (file: File) => void;
  isProcessing: boolean;
}
export default function FileUploader({
  onFileAccepted,
  isProcessing
}: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileAccepted(acceptedFiles[0]);
    }
  }, [onFileAccepted]);
  const [fileError, setFileError] = useState<string | null>(null);
  const onDropHandler = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    // Reset any previous errors
    setFileError(null);
    if (fileRejections.length > 0) {
      const error = fileRejections[0].errors[0];
      if (error.code === 'file-invalid-type') {
        setFileError('Invalid file type. Please upload an Excel or CSV file.');
      } else {
        setFileError('There was a problem with the file. Please try again.');
      }
      return;
    }
    if (acceptedFiles.length > 0) {
      onDrop(acceptedFiles);
    }
  }, [onDrop]);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles
  } = useDropzone({
    onDrop: onDropHandler,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: false,
    disabled: isProcessing
  });
  const getBorderColor = () => {
    if (isDragAccept) return 'border-green-400';
    if (isDragReject) return 'border-red-400';
    if (isDragActive) return 'border-blue-400';
    return 'border-border';
  };
  return <div className="mb-6" data-unique-id="7adb3083-d4f7-4e4b-8fb3-bca2f4a61434" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
      <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${getBorderColor()}
          ${isDragActive ? 'bg-primary/5' : 'bg-white hover:bg-accent/5'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `} data-unique-id="13876c3f-b889-45d8-a4e6-bf5d0ab23841" data-file-name="components/file-uploader.tsx">
        <input {...getInputProps()} data-unique-id="996eb614-1980-4205-ae5d-35e1dba24fd9" data-file-name="components/file-uploader.tsx" />
        <div className="flex flex-col items-center justify-center text-center" data-unique-id="8ec4a979-1af7-44a9-aa12-62ba3084fea0" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
          {isProcessing ? <div className="flex flex-col items-center space-y-4" data-unique-id="69a4fba3-470d-4ad3-8948-ab46c2b171d0" data-file-name="components/file-uploader.tsx">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-lg font-medium text-primary" data-unique-id="ca4253b2-0631-4796-8557-b8044c9479fa" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="96b32b73-142d-4942-b82b-150381cb356d" data-file-name="components/file-uploader.tsx">Processing file...</span></p>
              <p className="text-sm text-muted-foreground" data-unique-id="c4efe18e-e7b3-4127-a0c3-f5c90593a86e" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="3287013e-7e28-4254-9e2c-f66d45c986db" data-file-name="components/file-uploader.tsx">This may take a moment depending on file size</span></p>
            </div> : acceptedFiles.length > 0 ? <motion.div initial={{
          scale: 0.9
        }} animate={{
          scale: 1
        }} className="flex flex-col items-center space-y-4" data-unique-id="3b3028d6-3817-4231-bf16-7345a63018f6" data-file-name="components/file-uploader.tsx">
              <div className="p-4 bg-primary/10 rounded-full" data-unique-id="bb764a3f-73d9-47ad-8fb5-b6bcd9f6e7b6" data-file-name="components/file-uploader.tsx">
                <File className="h-10 w-10 text-primary" />
              </div>
              <div data-unique-id="9d865ec4-eb68-4c73-8912-0112bf0326a4" data-file-name="components/file-uploader.tsx">
                <p className="text-lg font-medium" data-unique-id="c90f1425-fe14-4e25-a41d-ba70afa45899" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">{acceptedFiles[0].name}</p>
                <p className="text-sm text-muted-foreground" data-unique-id="c77e37a1-c9b9-40ca-9810-349d98c5a96e" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
                  {(acceptedFiles[0].size / 1024 / 1024).toFixed(2)}<span className="editable-text" data-unique-id="247ac330-6e13-4e99-9b17-e065a98e377a" data-file-name="components/file-uploader.tsx"> MB
                </span></p>
              </div>
              <button onClick={e => {
            e.stopPropagation();
            // Reset the dropzone state by resetting the form
            e.currentTarget.form?.reset();
            // Force re-render the component to clear the UI
            getRootProps().onClick?.(new MouseEvent('click') as any);
          }} className="mt-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" data-unique-id="cb6ca228-f3e8-4885-a312-e762a48f9e6b" data-file-name="components/file-uploader.tsx">
                <X className="h-4 w-4" />
              </button>
            </motion.div> : <div className="flex flex-col items-center space-y-4" data-unique-id="fd02ebad-543a-4cc6-bbb1-4c2a0974d2e2" data-file-name="components/file-uploader.tsx">
              <div className="p-4 bg-primary/10 rounded-full" data-unique-id="40210eb1-3106-421c-8ee6-e49a454ae593" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
                {isDragActive ? <FilePlus2 className="h-10 w-10 text-primary animate-pulse" /> : <FileSpreadsheet className="h-10 w-10 text-primary" />}
              </div>
              <div data-unique-id="a99a1d4f-da94-4117-9db1-c2ab42de8a91" data-file-name="components/file-uploader.tsx">
                <p className="text-lg font-medium" data-unique-id="d3e781e5-f861-431f-88e1-d382baffb4fc" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="6dc3d68a-3046-4350-acda-97fb4eea1f03" data-file-name="components/file-uploader.tsx">Drop file here or click to upload</span></p>
                <p className="text-sm text-muted-foreground" data-unique-id="d290d9ea-91ec-419f-b7ac-09e7fa9c5f62" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="ac07b848-fbf4-4e32-bc06-8dc02328a2ca" data-file-name="components/file-uploader.tsx">
                  Support for .xlsx, .xls, and .csv files
                </span></p>
              </div>
            </div>}
        </div>
      </div>
      
      {fileError && <motion.div initial={{
      opacity: 0,
      y: -10
    }} animate={{
      opacity: 1,
      y: 0
    }} className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm flex items-center" data-unique-id="2eb3ddb3-28e7-49db-b54e-3b8e024ed086" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
          <AlertOctagon className="mr-2 h-5 w-5 text-red-500" />
          {fileError}
        </motion.div>}
      
      <div className="mt-4" data-unique-id="3d0923c2-5e51-4bfc-9871-add60328d233" data-file-name="components/file-uploader.tsx">
        <h3 className="text-sm font-medium mb-2" data-unique-id="d8df1ed6-bee6-4e10-a0b1-09ec770456a1" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="7995c794-d499-4930-9f4e-aa6244513c14" data-file-name="components/file-uploader.tsx">Example File Format</span></h3>
        <div className="bg-accent/10 p-3 rounded-md overflow-x-auto" data-unique-id="39de4731-17f5-4198-b53c-28b86160f32f" data-file-name="components/file-uploader.tsx">
          <table className="w-full text-xs" data-unique-id="e5c60507-139a-4710-a95b-b3fa8d82b7bf" data-file-name="components/file-uploader.tsx">
            <thead className="border-b" data-unique-id="e2b4d3a6-d833-4aea-b6ee-47749dd7c9bd" data-file-name="components/file-uploader.tsx">
              <tr data-unique-id="9375ef3e-93f6-4e8c-b254-1576e0e95016" data-file-name="components/file-uploader.tsx">
                <th className="py-1 px-2 text-left" data-unique-id="ed3b2e21-c71e-4953-aa31-f2d54ed13e8e" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="3a751291-c0bd-4928-bd79-11888b0e8e5e" data-file-name="components/file-uploader.tsx">Customer Order Number</span></th>
                <th className="py-1 px-2 text-left" data-unique-id="79d3773f-e4d7-4e01-bff3-d881292ae24b" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="f7a8edc0-c8c8-4c18-b87a-7e60a71c255e" data-file-name="components/file-uploader.tsx">Ship To Name</span></th>
                <th className="py-1 px-2 text-left" data-unique-id="89612fe1-a4ce-4ae5-8763-07a00254282d" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="2cddc199-23b2-4d0a-b5ac-60243969c1fd" data-file-name="components/file-uploader.tsx">Ship To Line1</span></th>
                <th className="py-1 px-2 text-left" data-unique-id="b2c70657-c639-4fa6-b1ff-dec4ff90d0c2" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="30d30d13-a3e5-4440-8a2c-c817526b8f01" data-file-name="components/file-uploader.tsx">Ship To City</span></th>
                <th className="py-1 px-2 text-left" data-unique-id="e45907a0-454c-4d2c-8d1e-c9d73007b558" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="9e61029a-00ba-45e3-bdcc-c8b6bf2fcf17" data-file-name="components/file-uploader.tsx">Tracking Link(s)</span></th>
              </tr>
            </thead>
            <tbody data-unique-id="f19c7dfe-6be7-4337-b1af-d0bcdcebfd20" data-file-name="components/file-uploader.tsx">
              <tr data-unique-id="2b4e8bb8-a34d-40bd-a28d-439b9ddb9bc7" data-file-name="components/file-uploader.tsx">
                <td className="py-1 px-2" data-unique-id="4c79c2db-0cc3-48ce-a1f3-464e5fa7f31c" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="17f97019-8e5f-42c2-8904-97f7b9cf5cf8" data-file-name="components/file-uploader.tsx">2158891</span></td>
                <td className="py-1 px-2" data-unique-id="37d01ae3-7b95-4135-ad4d-fccb633dcc3d" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="f43e5404-c6e3-4500-82b0-c1742fb0b5d7" data-file-name="components/file-uploader.tsx">Darrell Demas</span></td>
                <td className="py-1 px-2" data-unique-id="6330cd76-468f-4202-a2ba-6c38c0494eab" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="8f99d1e5-2307-4340-8039-76a25874a05f" data-file-name="components/file-uploader.tsx">238 Daisy St</span></td>
                <td className="py-1 px-2" data-unique-id="5b16ea00-0888-4112-9dfe-8e3027c9c1cd" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="4b46d8bb-bf5a-488c-968e-4ebf0fe13083" data-file-name="components/file-uploader.tsx">Casper</span></td>
                <td className="py-1 px-2" data-unique-id="bfbf4f27-6e6f-4605-9f4a-130c03f96c6c" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="a9c8a0ff-207e-40d7-b931-953504c848d3" data-file-name="components/file-uploader.tsx">FEDEX2=Parcel=288916622855</span></td>
              </tr>
              <tr data-unique-id="640930ec-bd2b-4bb8-9d26-a67fa4e637ea" data-file-name="components/file-uploader.tsx">
                <td className="py-1 px-2" data-unique-id="7e8ae087-8abb-4778-89b0-9fce18dae882" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="1dfeffa2-be85-43cb-aba4-d1646c8d97af" data-file-name="components/file-uploader.tsx">112-3534996-0461851</span></td>
                <td className="py-1 px-2" data-unique-id="3a8da426-1783-4f25-a4b2-b88ff662f8e0" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="263a4d92-ec62-42e5-b02e-6f69b8c16934" data-file-name="components/file-uploader.tsx">Luis A R Eckerson</span></td>
                <td className="py-1 px-2" data-unique-id="a25456e6-9fa8-4ed0-9688-3464765127c6" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="9ee061f6-1c96-44a5-a655-de30621233e6" data-file-name="components/file-uploader.tsx">452 Oak Ave</span></td>
                <td className="py-1 px-2" data-unique-id="7e26cf1d-c923-4f07-a51d-9f486f34ae01" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="c4335c4c-611c-4c5b-bb43-d01542f7b8ed" data-file-name="components/file-uploader.tsx">Palmdale</span></td>
                <td className="py-1 px-2" data-unique-id="a8975267-a868-4d3d-943f-2c9d111af3bd" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="5c72df4e-14db-4abf-b5fc-97f336f9b32e" data-file-name="components/file-uploader.tsx">FEDEX2=Parcel=293847582910</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>;
}