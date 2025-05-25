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
  return <div data-unique-id="2c80903d-4762-44a1-a6a5-80d549396885" data-file-name="components/file-uploader.tsx">
      <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${getBorderColor()}
          ${isDragActive ? 'bg-primary/5' : 'bg-white hover:bg-accent/5'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `} data-unique-id="450b9c62-b347-436c-a9c8-d45d21ea15c1" data-file-name="components/file-uploader.tsx">
        <input {...getInputProps()} data-unique-id="1b1757e6-5f21-411f-9b9b-da33059d26c5" data-file-name="components/file-uploader.tsx" />
        <div className="flex flex-col items-center justify-center text-center" data-unique-id="eaec1d71-29d7-456a-bdcf-01adce4e75da" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
          {isProcessing ? <div className="flex flex-col items-center space-y-4" data-unique-id="689228ba-6317-4e2e-abb7-e1b7d2dbc72c" data-file-name="components/file-uploader.tsx">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-lg font-medium text-primary" data-unique-id="7d57e35a-3276-456c-be0c-4f6351d9e5a2" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="d73b0fea-c2cb-4e74-8560-3981458590c6" data-file-name="components/file-uploader.tsx">Processing file...</span></p>
              <p className="text-sm text-muted-foreground" data-unique-id="2cdc5361-3f89-460c-b751-69d8c4bb1262" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="cde6cf57-a9f1-4b6d-817e-5481e26d7de1" data-file-name="components/file-uploader.tsx">This may take a moment depending on file size</span></p>
            </div> : acceptedFiles.length > 0 ? <motion.div initial={{
          scale: 0.9
        }} animate={{
          scale: 1
        }} className="flex flex-col items-center space-y-4" data-unique-id="5fd68d39-7f1a-4aa6-ac6a-02450a6120f4" data-file-name="components/file-uploader.tsx">
              <div className="p-4 bg-primary/10 rounded-full" data-unique-id="74537829-38af-4b17-9000-a23d7b3e1a8a" data-file-name="components/file-uploader.tsx">
                <File className="h-10 w-10 text-primary" />
              </div>
              <div data-unique-id="f11af85a-063e-4313-8a5f-2a473d699774" data-file-name="components/file-uploader.tsx">
                <p className="text-lg font-medium" data-unique-id="a4b1fb59-8362-4ec5-8fa2-53489ff9d4b4" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">{acceptedFiles[0].name}</p>
                <p className="text-sm text-muted-foreground" data-unique-id="cd8b857c-de3e-4c0b-bca6-7607e512e6eb" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
                  {(acceptedFiles[0].size / 1024 / 1024).toFixed(2)}<span className="editable-text" data-unique-id="f6e319e9-166a-48f6-b43b-135cb03a95ac" data-file-name="components/file-uploader.tsx"> MB
                </span></p>
              </div>
              <button onClick={e => {
            e.stopPropagation();
            // Reset the dropzone state by resetting the form
            e.currentTarget.form?.reset();
            // Force re-render the component to clear the UI
            getRootProps().onClick?.(new MouseEvent('click') as any);
          }} className="mt-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" data-unique-id="c4dc87c5-0f3d-47a1-a4ce-9f0764a7a41d" data-file-name="components/file-uploader.tsx">
                <X className="h-4 w-4" />
              </button>
            </motion.div> : <div className="flex flex-col items-center space-y-4" data-unique-id="ecc5779a-193a-4bb9-b69d-c01e8d77ce35" data-file-name="components/file-uploader.tsx">
              <div className="p-4 bg-primary/10 rounded-full" data-unique-id="78aebaf4-8c52-458a-8268-5da8e8249b04" data-file-name="components/file-uploader.tsx">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <div data-unique-id="582b521e-31e8-4b86-85cb-bcefd86f73e1" data-file-name="components/file-uploader.tsx">
                <p className="text-lg font-medium" data-unique-id="d56a9397-49c1-411d-ba5b-508f07c0a24e" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="5d54e6ce-f070-4b12-8850-bc7b2cb50e98" data-file-name="components/file-uploader.tsx">Drop file here or click to upload</span></p>
                <p className="text-sm text-muted-foreground" data-unique-id="9c1743a0-74e1-4ec2-846b-f1af36690593" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="741a85a5-bf58-4d1f-be15-961b408802d7" data-file-name="components/file-uploader.tsx">
                  Support for .xlsx, .xls, and .csv files
                </span></p>
              </div>
            </div>}
        </div>
      </div>
    </div>;
}