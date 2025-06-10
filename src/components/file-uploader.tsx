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
  return <div data-unique-id="c1986030-b1db-45a5-824c-30da0918e330" data-file-name="components/file-uploader.tsx">
      <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300
          ${getBorderColor()}
          ${isDragActive ? 'bg-primary/5 scale-[1.02] shadow-lg' : 'bg-card/60 hover:bg-accent/5 hover:scale-[1.01] hover:shadow-md'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `} data-unique-id="2c21ccd1-af46-4551-a59b-c774f0ba74a6" data-file-name="components/file-uploader.tsx">
        <input {...getInputProps()} data-unique-id="a9e76e9b-fa87-48c3-ab90-955ab7841a45" data-file-name="components/file-uploader.tsx" />
        <div className="flex flex-col items-center justify-center text-center" data-unique-id="db479f83-b55b-400d-a9a8-c520927ca17e" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
          {isProcessing ? <div className="flex flex-col items-center space-y-4" data-unique-id="c195f4ad-fe08-4213-bff6-85495dc55dec" data-file-name="components/file-uploader.tsx">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-lg font-medium text-primary" data-unique-id="318bd570-e738-4a56-9d61-c1f661c24b03" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="f70a1252-b550-4003-a9db-15d50b5d8591" data-file-name="components/file-uploader.tsx">Processing file...</span></p>
              <p className="text-sm text-muted-foreground" data-unique-id="a94286fa-f9a3-4366-9a39-c17e21a2c0fa" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="331b24d9-0044-4d8d-8765-abac6a3e8719" data-file-name="components/file-uploader.tsx">This may take a moment depending on file size</span></p>
            </div> : acceptedFiles.length > 0 ? <motion.div initial={{
          scale: 0.9
        }} animate={{
          scale: 1
        }} className="flex flex-col items-center space-y-4" data-unique-id="62df7825-32f1-4256-b0b7-371428479027" data-file-name="components/file-uploader.tsx">
              <div className="p-4 bg-primary/10 rounded-full" data-unique-id="9b617a7f-ac64-4552-8288-1ed47ec5c99c" data-file-name="components/file-uploader.tsx">
                <File className="h-10 w-10 text-primary" />
              </div>
              <div data-unique-id="b1b7af59-edea-449e-96b2-631351339809" data-file-name="components/file-uploader.tsx">
                <p className="text-lg font-medium" data-unique-id="ceaf2525-d4e0-41f1-945c-4eaf2140e023" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">{acceptedFiles[0].name}</p>
                <p className="text-sm text-muted-foreground" data-unique-id="b77d1bb3-a1fa-4911-adbd-e2cb5e3a1547" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
                  {(acceptedFiles[0].size / 1024 / 1024).toFixed(2)}<span className="editable-text" data-unique-id="068ebe44-df86-4f1c-bae2-9075784cd9b5" data-file-name="components/file-uploader.tsx"> MB
                </span></p>
              </div>
              <button onClick={e => {
            e.stopPropagation();
            // Reset the dropzone state by resetting the form
            e.currentTarget.form?.reset();
            // Force re-render the component to clear the UI
            getRootProps().onClick?.(new MouseEvent('click') as any);
          }} className="mt-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" data-unique-id="d246bb0b-8484-4094-b0c9-98e622e3db6f" data-file-name="components/file-uploader.tsx">
                <X className="h-4 w-4" />
              </button>
            </motion.div> : <div className="flex flex-col items-center space-y-4" data-unique-id="8ea1f1cb-1ebf-4ddc-b8bf-66836758499e" data-file-name="components/file-uploader.tsx">
              <div className="p-4 bg-primary/10 rounded-full" data-unique-id="d2aa9a87-6f0c-4ffb-b884-8edc2f7a73d4" data-file-name="components/file-uploader.tsx">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <div data-unique-id="24beef15-8a7d-445a-8f63-a18684ed7acd" data-file-name="components/file-uploader.tsx">
                <p className="text-lg font-medium" data-unique-id="e2c7d6d3-8ae5-470c-9902-7966bec9b769" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="f930b76a-2404-4ee3-9496-d1ce69a1d222" data-file-name="components/file-uploader.tsx">Drop file here or click to upload</span></p>
                <p className="text-sm text-muted-foreground" data-unique-id="c7c13f2a-30ea-4271-a22c-98622b425a4d" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="39edafba-285f-447d-84d1-ef740c6e5b28" data-file-name="components/file-uploader.tsx">
                  Support for .xlsx, .xls, and .csv files
                </span></p>
              </div>
            </div>}
        </div>
      </div>
    </div>;
}