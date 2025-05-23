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
  return <div className="mb-6" data-unique-id="92af6fbf-acdc-4cd5-b920-5f9d84b0fb5b" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
      <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${getBorderColor()}
          ${isDragActive ? 'bg-primary/5' : 'bg-white hover:bg-accent/5'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `} data-unique-id="99771ac1-45a7-4ca7-ba68-0836d4c975b0" data-file-name="components/file-uploader.tsx">
        <input {...getInputProps()} data-unique-id="d372b929-6158-4db9-be3f-5503afc5310a" data-file-name="components/file-uploader.tsx" />
        <div className="flex flex-col items-center justify-center text-center" data-unique-id="4b2c652e-83b0-4402-8660-bbbcfeafd050" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
          {isProcessing ? <div className="flex flex-col items-center space-y-4" data-unique-id="5ba8a7f6-c11e-44b4-9084-15eda199d56f" data-file-name="components/file-uploader.tsx">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-lg font-medium text-primary" data-unique-id="eba2c33a-84c4-408a-9a21-7c2b16c28fe3" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="8f964e7f-178b-4e4b-9b32-1ba85a4f0fce" data-file-name="components/file-uploader.tsx">Processing file...</span></p>
              <p className="text-sm text-muted-foreground" data-unique-id="f4e2ab48-0f15-453e-88dc-af6c0c009472" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="3496496f-8985-4a1e-8422-14124c326c19" data-file-name="components/file-uploader.tsx">This may take a moment depending on file size</span></p>
            </div> : acceptedFiles.length > 0 ? <motion.div initial={{
          scale: 0.9
        }} animate={{
          scale: 1
        }} className="flex flex-col items-center space-y-4" data-unique-id="c5f42284-89c4-47b1-b218-dc7f040808ce" data-file-name="components/file-uploader.tsx">
              <div className="p-4 bg-primary/10 rounded-full" data-unique-id="9ce16c05-326f-49cb-8d28-f1287a8ad3c1" data-file-name="components/file-uploader.tsx">
                <File className="h-10 w-10 text-primary" />
              </div>
              <div data-unique-id="4187614c-b5e6-4e6d-95c3-381f14ce9eb5" data-file-name="components/file-uploader.tsx">
                <p className="text-lg font-medium" data-unique-id="673549cd-20df-49df-8aa6-ea9ac53d8934" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">{acceptedFiles[0].name}</p>
                <p className="text-sm text-muted-foreground" data-unique-id="a4458a16-0f6e-44ca-998f-902ea1e15dda" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
                  {(acceptedFiles[0].size / 1024 / 1024).toFixed(2)}<span className="editable-text" data-unique-id="b29bb554-e714-45f9-874c-7825424a1ced" data-file-name="components/file-uploader.tsx"> MB
                </span></p>
              </div>
              <button onClick={e => {
            e.stopPropagation();
            // Reset the dropzone state by resetting the form
            e.currentTarget.form?.reset();
            // Force re-render the component to clear the UI
            getRootProps().onClick?.(new MouseEvent('click') as any);
          }} className="mt-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" data-unique-id="e56b02be-09f3-464e-b2a8-65e88dab5caf" data-file-name="components/file-uploader.tsx">
                <X className="h-4 w-4" />
              </button>
            </motion.div> : <div className="flex flex-col items-center space-y-4" data-unique-id="dae6a882-2879-4592-8b24-fd4a329a55df" data-file-name="components/file-uploader.tsx">
              <div className="p-4 bg-primary/10 rounded-full" data-unique-id="284bc99f-613e-4cc9-81b3-01355a08d59a" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
                {isDragActive ? <FilePlus2 className="h-10 w-10 text-primary animate-pulse" /> : <FileSpreadsheet className="h-10 w-10 text-primary" />}
              </div>
              <div data-unique-id="b08003f7-8ee8-4366-8fb5-61ae2d16df0a" data-file-name="components/file-uploader.tsx">
                <p className="text-lg font-medium" data-unique-id="e8fbe753-f7c0-44c3-b1e1-a2899fdf1e89" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="85035caa-09e4-4f76-a199-c169fb325eb7" data-file-name="components/file-uploader.tsx">Drop file here or click to upload</span></p>
                <p className="text-sm text-muted-foreground" data-unique-id="0068cd26-7a5f-4de8-847a-992ada4d3b56" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="51582567-083d-4e5b-a229-0ae80f79dadc" data-file-name="components/file-uploader.tsx">
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
    }} className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm flex items-center" data-unique-id="4b499d68-8895-44ba-81c1-c2c3f7251f15" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
          <AlertOctagon className="mr-2 h-5 w-5 text-red-500" />
          {fileError}
        </motion.div>}
      
      <div className="mt-4" data-unique-id="a09095e3-004d-4a09-a2c1-ba646a3893e0" data-file-name="components/file-uploader.tsx">
        <h3 className="text-sm font-medium mb-2" data-unique-id="e1f3c68b-b864-405c-8d83-a2c5f8c2e346" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="48e28190-7680-473b-8f2a-2cfbc26668a7" data-file-name="components/file-uploader.tsx">Example File Format</span></h3>
        <div className="bg-accent/10 p-3 rounded-md overflow-x-auto" data-unique-id="5ac05ff1-c06e-4489-869a-b878459e5d72" data-file-name="components/file-uploader.tsx">
          <table className="w-full text-xs" data-unique-id="11670ff9-9808-46a4-9fab-1199a8967d49" data-file-name="components/file-uploader.tsx">
            <thead className="border-b" data-unique-id="f8167998-7959-4628-9093-4c849cdb9166" data-file-name="components/file-uploader.tsx">
              <tr data-unique-id="3f705319-fdf0-4927-8c19-35e2a44fb0d8" data-file-name="components/file-uploader.tsx">
                <th className="py-1 px-2 text-left" data-unique-id="bb8d5ab2-9d5a-4487-9a58-5946671b8515" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="770e2f8b-be06-4548-ac8c-5388171b32d3" data-file-name="components/file-uploader.tsx">Customer Order Number</span></th>
                <th className="py-1 px-2 text-left" data-unique-id="24ec1e83-acc8-4c53-b049-348aec4849c2" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="3eeff0e9-fb0c-468b-bb5f-b9e7d05bc43d" data-file-name="components/file-uploader.tsx">Ship To Name</span></th>
                <th className="py-1 px-2 text-left" data-unique-id="91ad6c25-5b56-455e-a6cb-8007ba7189e9" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="d1c6987f-f907-4d46-82cb-f669ac4d4ed6" data-file-name="components/file-uploader.tsx">Ship To Line1</span></th>
                <th className="py-1 px-2 text-left" data-unique-id="67770158-137d-4759-b696-1a39ff9c9b1c" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="706a8b3f-8c90-4759-a61c-e612269ceec2" data-file-name="components/file-uploader.tsx">Ship To City</span></th>
                <th className="py-1 px-2 text-left" data-unique-id="9668ac3e-40f1-4ef4-aaad-db04f20d7041" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="cf26e6eb-1eee-4f11-b081-3dec3ac280f7" data-file-name="components/file-uploader.tsx">Tracking Link(s)</span></th>
              </tr>
            </thead>
            <tbody data-unique-id="13beed71-9ffb-4fd4-9e74-6ee058d201f3" data-file-name="components/file-uploader.tsx">
              <tr data-unique-id="273a6bcb-2262-43ca-b5d3-c043ac2e057a" data-file-name="components/file-uploader.tsx">
                <td className="py-1 px-2" data-unique-id="1226f97a-31cf-4966-bdd5-29c347ffa019" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="79e6ac17-f6b2-4b99-984a-fff612b0760e" data-file-name="components/file-uploader.tsx">2158891</span></td>
                <td className="py-1 px-2" data-unique-id="a8e167d4-4210-49bc-8d6a-5dae03334300" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="53c1debc-1aa3-4c82-a013-8850e664f731" data-file-name="components/file-uploader.tsx">Darrell Demas</span></td>
                <td className="py-1 px-2" data-unique-id="46a74465-a069-49c1-9994-532c951866ad" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="84f9de6b-6930-4412-9b78-2de779ba16a5" data-file-name="components/file-uploader.tsx">238 Daisy St</span></td>
                <td className="py-1 px-2" data-unique-id="940fe933-4676-4252-81d1-ab8ecd868ace" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="edf227b7-12ba-4eab-ba64-3870ddec67a3" data-file-name="components/file-uploader.tsx">Casper</span></td>
                <td className="py-1 px-2" data-unique-id="fcf784b4-6592-4272-9872-8dc6a1261b1a" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="93688dfb-43f3-495f-928a-2b5dc46c2e68" data-file-name="components/file-uploader.tsx">FEDEX2=Parcel=288916622855</span></td>
              </tr>
              <tr data-unique-id="a4abb1c0-3595-4640-a843-c0f4818aeb48" data-file-name="components/file-uploader.tsx">
                <td className="py-1 px-2" data-unique-id="c7634647-8b80-4d36-82df-bdfab511dbda" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="8f6e0b52-b095-432b-8561-b99cb0661e46" data-file-name="components/file-uploader.tsx">112-3534996-0461851</span></td>
                <td className="py-1 px-2" data-unique-id="4859ca24-3d4f-4ede-8557-f6f3d82b0894" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="6f41c6e3-c12b-4c5c-85eb-56e17ab8c4c5" data-file-name="components/file-uploader.tsx">Luis A R Eckerson</span></td>
                <td className="py-1 px-2" data-unique-id="6b8af6c1-b733-4364-82c6-7b69679a4e32" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="77aa5057-ba0a-45fc-b9c3-78a7e54846d9" data-file-name="components/file-uploader.tsx">452 Oak Ave</span></td>
                <td className="py-1 px-2" data-unique-id="98101dd5-454a-4af6-bd07-8782a6fdd973" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="1db9f8a1-cb53-4fa4-9249-12214ced3522" data-file-name="components/file-uploader.tsx">Palmdale</span></td>
                <td className="py-1 px-2" data-unique-id="b7e40fcf-cae5-46c1-8536-1986b2ab84a5" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="acd1065e-a3dc-4a98-a140-cc27b94334b6" data-file-name="components/file-uploader.tsx">FEDEX2=Parcel=293847582910</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>;
}