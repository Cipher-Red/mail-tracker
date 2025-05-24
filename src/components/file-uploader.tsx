'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, File, X, Loader2 } from 'lucide-react';
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
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles
  } = useDropzone({
    onDrop,
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
  return <div data-unique-id="cfc17fc9-fc6e-4a35-aebb-f48f8ef88ad9" data-file-name="components/file-uploader.tsx">
      <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${getBorderColor()}
          ${isDragActive ? 'bg-primary/5' : 'bg-white hover:bg-accent/5'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `} data-unique-id="0defa525-7567-4437-82ab-7bd61b4c4511" data-file-name="components/file-uploader.tsx">
        <input {...getInputProps()} data-unique-id="ddf32751-391c-4ee0-9fd7-213553da808e" data-file-name="components/file-uploader.tsx" />
        <div className="flex flex-col items-center justify-center text-center" data-unique-id="f056d997-a40c-4b53-81fb-a74d4328b1a1" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
          {isProcessing ? <div className="flex flex-col items-center space-y-4" data-unique-id="11b291b6-6aa8-427d-b50f-0d7e9adfba56" data-file-name="components/file-uploader.tsx">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-lg font-medium text-primary" data-unique-id="686dfd5a-af88-4a93-bf41-eee579d490b3" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="a9a842c3-4660-4afe-a614-98f5d50f4743" data-file-name="components/file-uploader.tsx">Processing file...</span></p>
              <p className="text-sm text-muted-foreground" data-unique-id="888aac1c-12bd-41c0-82a6-d9f8fe8e286a" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="52eb2e53-8522-449c-8ead-939700eddcc9" data-file-name="components/file-uploader.tsx">This may take a moment depending on file size</span></p>
            </div> : acceptedFiles.length > 0 ? <motion.div initial={{
          scale: 0.9
        }} animate={{
          scale: 1
        }} className="flex flex-col items-center space-y-4" data-unique-id="de992070-38ca-4633-80e3-ce321a21b1a8" data-file-name="components/file-uploader.tsx">
              <div className="p-4 bg-primary/10 rounded-full" data-unique-id="d1bd4de9-9845-40d5-b102-19eeb5247f40" data-file-name="components/file-uploader.tsx">
                <File className="h-10 w-10 text-primary" />
              </div>
              <div data-unique-id="422b9cff-3699-428c-ad65-13bb088579b0" data-file-name="components/file-uploader.tsx">
                <p className="text-lg font-medium" data-unique-id="dac27f10-da76-43e9-b536-afcc74bd66d0" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">{acceptedFiles[0].name}</p>
                <p className="text-sm text-muted-foreground" data-unique-id="38d6b4fc-bb62-46fd-ab32-1b7b7f7640dc" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
                  {(acceptedFiles[0].size / 1024 / 1024).toFixed(2)}<span className="editable-text" data-unique-id="93b0c9fa-59e8-4537-9c9b-2197aa24d44a" data-file-name="components/file-uploader.tsx"> MB
                </span></p>
              </div>
              <button onClick={e => {
            e.stopPropagation();
            // Reset the dropzone state by resetting the form
            e.currentTarget.form?.reset();
            // Force re-render the component to clear the UI
            getRootProps().onClick?.(new MouseEvent('click') as any);
          }} className="mt-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" data-unique-id="0253e63e-f4b3-4a20-87eb-c77194cfbfcb" data-file-name="components/file-uploader.tsx">
                <X className="h-4 w-4" />
              </button>
            </motion.div> : <div className="flex flex-col items-center space-y-4" data-unique-id="537e4d5a-95ac-408b-ac62-39d6714492cf" data-file-name="components/file-uploader.tsx">
              <div className="p-4 bg-primary/10 rounded-full" data-unique-id="e599330b-5e87-4718-a154-29b8b6cc7ca8" data-file-name="components/file-uploader.tsx">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <div data-unique-id="9c657cbd-72ee-4704-998f-bce1593db5c0" data-file-name="components/file-uploader.tsx">
                <p className="text-lg font-medium" data-unique-id="92a96643-1ea2-4a1b-bb00-9aa469089ad5" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="cd27388d-3e18-4758-a236-899e78b73f22" data-file-name="components/file-uploader.tsx">Drop file here or click to upload</span></p>
                <p className="text-sm text-muted-foreground" data-unique-id="22902e20-cf94-4fbb-b066-47243b6ac4ea" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="124aeb13-dc36-453f-9cc5-1697b0884a7f" data-file-name="components/file-uploader.tsx">
                  Support for .xlsx, .xls, and .csv files
                </span></p>
              </div>
            </div>}
        </div>
      </div>
    </div>;
}