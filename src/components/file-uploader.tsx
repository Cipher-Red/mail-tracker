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
  return <div data-unique-id="e1b07ec0-f26e-46b4-9919-d072ed69b0e8" data-file-name="components/file-uploader.tsx">
      <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300
          ${getBorderColor()}
          ${isDragActive ? 'bg-primary/5 scale-[1.02] shadow-lg' : 'bg-card/60 hover:bg-accent/5 hover:scale-[1.01] hover:shadow-md'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `} data-unique-id="69a4984f-0c3a-4f76-ae3e-9b7ad8d2873e" data-file-name="components/file-uploader.tsx">
        <input {...getInputProps()} data-unique-id="6b8fe00c-cabb-4f75-a575-f3c02f021364" data-file-name="components/file-uploader.tsx" />
        <div className="flex flex-col items-center justify-center text-center" data-unique-id="fc4d5a5a-48c7-4bb1-9fa4-20eb00f65005" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
          {isProcessing ? <div className="flex flex-col items-center space-y-4" data-unique-id="10af099a-552b-48f4-9985-f2ec08e86fac" data-file-name="components/file-uploader.tsx">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-lg font-medium text-primary" data-unique-id="afa69fbc-c9c3-4bfe-a536-a6d772a87e6f" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="702efeca-a554-4dd4-8e9b-a57fca1c9db5" data-file-name="components/file-uploader.tsx">Processing file...</span></p>
              <p className="text-sm text-muted-foreground" data-unique-id="10e5b231-bb84-45bc-91b0-95652808ebd0" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="86e63f94-36a6-42dc-987c-873e079750c4" data-file-name="components/file-uploader.tsx">This may take a moment depending on file size</span></p>
            </div> : acceptedFiles.length > 0 ? <motion.div initial={{
          scale: 0.9
        }} animate={{
          scale: 1
        }} className="flex flex-col items-center space-y-4" data-unique-id="1c13a67b-f0d6-4b10-9a44-53a2f4d58ee0" data-file-name="components/file-uploader.tsx">
              <div className="p-4 bg-primary/10 rounded-full" data-unique-id="3953c905-1d7c-47ad-af16-4ab9cecf915b" data-file-name="components/file-uploader.tsx">
                <File className="h-10 w-10 text-primary" />
              </div>
              <div data-unique-id="6ba03011-e98b-44f6-b01d-451d5203777c" data-file-name="components/file-uploader.tsx">
                <p className="text-lg font-medium" data-unique-id="0c4bc0de-673d-4a14-8ab3-247d09473a94" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">{acceptedFiles[0].name}</p>
                <p className="text-sm text-muted-foreground" data-unique-id="98c5a8f9-c792-4747-b53d-91ea8144794a" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
                  {(acceptedFiles[0].size / 1024 / 1024).toFixed(2)}<span className="editable-text" data-unique-id="3126323a-da84-4da2-b4c0-969082d77e81" data-file-name="components/file-uploader.tsx"> MB
                </span></p>
              </div>
              <button onClick={e => {
            e.stopPropagation();
            // Reset the dropzone state by resetting the form
            e.currentTarget.form?.reset();
            // Force re-render the component to clear the UI
            getRootProps().onClick?.(new MouseEvent('click') as any);
          }} className="mt-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" data-unique-id="d5d0ba83-1a87-4173-a316-592cecbd8097" data-file-name="components/file-uploader.tsx">
                <X className="h-4 w-4" />
              </button>
            </motion.div> : <div className="flex flex-col items-center space-y-4" data-unique-id="4bffe1a4-c78c-40ff-8643-eefa9c7a2aaf" data-file-name="components/file-uploader.tsx">
              <div className="p-4 bg-primary/10 rounded-full" data-unique-id="58632f26-e858-48b6-9131-734e4fd9bb9d" data-file-name="components/file-uploader.tsx">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <div data-unique-id="de9a819b-7002-430b-b7ca-dd5cfb2bbf5e" data-file-name="components/file-uploader.tsx">
                <p className="text-lg font-medium" data-unique-id="67c46821-722a-4efb-90cf-71c70ccefb1d" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="bf4ec0cb-bcfa-4187-90b7-1abf81df2b5a" data-file-name="components/file-uploader.tsx">Drop file here or click to upload</span></p>
                <p className="text-sm text-muted-foreground" data-unique-id="6b642d01-7fd6-4d71-8f12-e61e4376e165" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="c70899a2-b546-4dfa-8e6b-a50592b23e67" data-file-name="components/file-uploader.tsx">
                  Support for .xlsx, .xls, and .csv files
                </span></p>
              </div>
            </div>}
        </div>
      </div>
    </div>;
}