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
  return <div data-unique-id="7359456b-1098-4fc3-a7ee-69d4e218dc30" data-file-name="components/file-uploader.tsx">
      <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${getBorderColor()}
          ${isDragActive ? 'bg-primary/5' : 'bg-white hover:bg-accent/5'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `} data-unique-id="a975da99-92ce-4c61-9452-d107ccdd823b" data-file-name="components/file-uploader.tsx">
        <input {...getInputProps()} data-unique-id="596a41ea-e162-447c-8d47-9a8513299b3e" data-file-name="components/file-uploader.tsx" />
        <div className="flex flex-col items-center justify-center text-center" data-unique-id="e264b87d-fb2f-4abe-b8a3-dcca396d313e" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
          {isProcessing ? <div className="flex flex-col items-center space-y-4" data-unique-id="2d592474-b863-43c0-b4b4-6b5fa2687a2f" data-file-name="components/file-uploader.tsx">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-lg font-medium text-primary" data-unique-id="c6ab9d7a-0acd-4ab8-b2e4-18b5508194cf" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="0d17f253-49ac-4560-8526-8ceea03eb060" data-file-name="components/file-uploader.tsx">Processing file...</span></p>
              <p className="text-sm text-muted-foreground" data-unique-id="4918114d-14a1-41fe-8d4e-d2c3f7d43c96" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="c2e355b3-55e3-4113-b0ed-e009cd883957" data-file-name="components/file-uploader.tsx">This may take a moment depending on file size</span></p>
            </div> : acceptedFiles.length > 0 ? <motion.div initial={{
          scale: 0.9
        }} animate={{
          scale: 1
        }} className="flex flex-col items-center space-y-4" data-unique-id="d7976f30-4e56-4c4c-8aaa-2de3da1ee73c" data-file-name="components/file-uploader.tsx">
              <div className="p-4 bg-primary/10 rounded-full" data-unique-id="a8d2a2cb-810a-48fa-8505-ad6b95db1693" data-file-name="components/file-uploader.tsx">
                <File className="h-10 w-10 text-primary" />
              </div>
              <div data-unique-id="9bd685a3-c777-4a93-958f-a49bcf017bd0" data-file-name="components/file-uploader.tsx">
                <p className="text-lg font-medium" data-unique-id="8254daec-632b-4150-a712-aa9d8bdd638d" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">{acceptedFiles[0].name}</p>
                <p className="text-sm text-muted-foreground" data-unique-id="f86c7f77-143b-416f-976e-d1530b2957e0" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
                  {(acceptedFiles[0].size / 1024 / 1024).toFixed(2)}<span className="editable-text" data-unique-id="f924c842-c7c4-4201-a144-4a60eb6d2a6c" data-file-name="components/file-uploader.tsx"> MB
                </span></p>
              </div>
              <button onClick={e => {
            e.stopPropagation();
            // Reset the dropzone state by resetting the form
            e.currentTarget.form?.reset();
            // Force re-render the component to clear the UI
            getRootProps().onClick?.(new MouseEvent('click') as any);
          }} className="mt-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" data-unique-id="5a26a505-92ee-4160-bfde-28eb9615a905" data-file-name="components/file-uploader.tsx">
                <X className="h-4 w-4" />
              </button>
            </motion.div> : <div className="flex flex-col items-center space-y-4" data-unique-id="eade5367-6db8-457e-b8a6-21a8605e1ca3" data-file-name="components/file-uploader.tsx">
              <div className="p-4 bg-primary/10 rounded-full" data-unique-id="b4668059-d7b1-4671-acf6-ab34334d1f18" data-file-name="components/file-uploader.tsx">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <div data-unique-id="560e95b4-dfc2-46e5-941f-553c50d593cc" data-file-name="components/file-uploader.tsx">
                <p className="text-lg font-medium" data-unique-id="3a4737d3-afef-48cc-861b-29edda2961ef" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="4d025b50-3f66-4945-bf98-ac0b4e55e1f0" data-file-name="components/file-uploader.tsx">Drop file here or click to upload</span></p>
                <p className="text-sm text-muted-foreground" data-unique-id="a66fb5d6-af19-4c79-89c7-6c36b78e0b85" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="7821a161-59ac-4bac-b496-f4ed5a384ddc" data-file-name="components/file-uploader.tsx">
                  Support for .xlsx, .xls, and .csv files
                </span></p>
              </div>
            </div>}
        </div>
      </div>
    </div>;
}