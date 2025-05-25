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
  return <div data-unique-id="9b9c8eb3-98e1-4921-a3e4-81916bf014c9" data-file-name="components/file-uploader.tsx">
      <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300
          ${getBorderColor()}
          ${isDragActive ? 'bg-primary/5 scale-[1.02] shadow-lg' : 'bg-card/60 hover:bg-accent/5 hover:scale-[1.01] hover:shadow-md'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `} data-unique-id="f6fd3593-1a28-4549-9936-98f7b9d858fc" data-file-name="components/file-uploader.tsx">
        <input {...getInputProps()} data-unique-id="d4e91491-9798-4271-8aa8-17f35951f00e" data-file-name="components/file-uploader.tsx" />
        <div className="flex flex-col items-center justify-center text-center" data-unique-id="30dfe41c-4009-44ff-ba7a-c05c698a9db8" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
          {isProcessing ? <div className="flex flex-col items-center space-y-4" data-unique-id="4bfd2275-903c-4c8f-b60a-6bc6d466c70f" data-file-name="components/file-uploader.tsx">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-lg font-medium text-primary" data-unique-id="04ef6dd3-2142-4b4e-a328-bab4737af41f" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="e86895df-e98e-4de9-be82-1416dbe26ba4" data-file-name="components/file-uploader.tsx">Processing file...</span></p>
              <p className="text-sm text-muted-foreground" data-unique-id="826163a6-cca8-41df-b4e6-901e5b1ad617" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="773685d9-03a3-4e6a-a7a3-f7a9eecf46b7" data-file-name="components/file-uploader.tsx">This may take a moment depending on file size</span></p>
            </div> : acceptedFiles.length > 0 ? <motion.div initial={{
          scale: 0.9
        }} animate={{
          scale: 1
        }} className="flex flex-col items-center space-y-4" data-unique-id="1bb877a1-6da7-4455-b5cb-ce1484076f10" data-file-name="components/file-uploader.tsx">
              <div className="p-4 bg-primary/10 rounded-full" data-unique-id="e8571d5a-8bd7-4077-a883-190b2ebbcdbd" data-file-name="components/file-uploader.tsx">
                <File className="h-10 w-10 text-primary" />
              </div>
              <div data-unique-id="6804964b-41ce-4dff-a6a1-43bd268fd7db" data-file-name="components/file-uploader.tsx">
                <p className="text-lg font-medium" data-unique-id="2d7acf3f-23f4-41ea-8fcb-72bcb4405ad4" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">{acceptedFiles[0].name}</p>
                <p className="text-sm text-muted-foreground" data-unique-id="18b252c1-245c-4f76-8862-2977ba49c876" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
                  {(acceptedFiles[0].size / 1024 / 1024).toFixed(2)}<span className="editable-text" data-unique-id="48aa772f-765d-435a-a171-ca946562cbde" data-file-name="components/file-uploader.tsx"> MB
                </span></p>
              </div>
              <button onClick={e => {
            e.stopPropagation();
            // Reset the dropzone state by resetting the form
            e.currentTarget.form?.reset();
            // Force re-render the component to clear the UI
            getRootProps().onClick?.(new MouseEvent('click') as any);
          }} className="mt-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" data-unique-id="b1c58701-c990-492e-b8f1-58914e584d44" data-file-name="components/file-uploader.tsx">
                <X className="h-4 w-4" />
              </button>
            </motion.div> : <div className="flex flex-col items-center space-y-4" data-unique-id="1fd49760-7c05-463c-b542-4afbc4a9c9e3" data-file-name="components/file-uploader.tsx">
              <div className="p-4 bg-primary/10 rounded-full" data-unique-id="df73986e-629c-403a-afd4-b2cfd2959d80" data-file-name="components/file-uploader.tsx">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <div data-unique-id="cc8c0ef7-defe-4b0d-bce5-ec60b0e52db6" data-file-name="components/file-uploader.tsx">
                <p className="text-lg font-medium" data-unique-id="c6c041bf-af7e-48e6-8c89-f41dd027ad79" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="25883c7a-118a-4ded-86bf-cfafc6be7429" data-file-name="components/file-uploader.tsx">Drop file here or click to upload</span></p>
                <p className="text-sm text-muted-foreground" data-unique-id="9349d3bb-c811-40b2-9248-f1a08d8b5087" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="569020a2-1fad-4aff-9a73-b0ff380e0356" data-file-name="components/file-uploader.tsx">
                  Support for .xlsx, .xls, and .csv files
                </span></p>
              </div>
            </div>}
        </div>
      </div>
    </div>;
}