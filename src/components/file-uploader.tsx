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
  return <div data-unique-id="9d896a5b-f3d6-4793-9ce6-ca20a8f7c7cc" data-file-name="components/file-uploader.tsx">
      <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300
          ${getBorderColor()}
          ${isDragActive ? 'bg-primary/5 scale-[1.02] shadow-lg' : 'bg-card/60 hover:bg-accent/5 hover:scale-[1.01] hover:shadow-md'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `} data-unique-id="7ac694c4-d8f9-41f5-815f-fabd0cfda91c" data-file-name="components/file-uploader.tsx">
        <input {...getInputProps()} data-unique-id="b83f13aa-f90d-43f5-a58b-12d9848cda18" data-file-name="components/file-uploader.tsx" />
        <div className="flex flex-col items-center justify-center text-center" data-unique-id="855203d0-33dd-441f-b275-37d73a9f6dab" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
          {isProcessing ? <div className="flex flex-col items-center space-y-4" data-unique-id="cae8a1fb-e644-44ba-a8c4-2c67aa76c193" data-file-name="components/file-uploader.tsx">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-lg font-medium text-primary" data-unique-id="74621b8a-8d0e-4a33-ae7b-6461a037ef62" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="a3de5b33-9ec6-4ada-b4a9-af78afcba615" data-file-name="components/file-uploader.tsx">Processing file...</span></p>
              <p className="text-sm text-muted-foreground" data-unique-id="7e35cc66-9bd1-45d5-9cc2-b3f06e1e0e3f" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="e98add74-66ed-4b61-a5a5-60fab019ec70" data-file-name="components/file-uploader.tsx">This may take a moment depending on file size</span></p>
            </div> : acceptedFiles.length > 0 ? <motion.div initial={{
          scale: 0.9
        }} animate={{
          scale: 1
        }} className="flex flex-col items-center space-y-4" data-unique-id="c69d1568-be9f-4ad5-b5e2-09e4cdbbb1c5" data-file-name="components/file-uploader.tsx">
              <div className="p-4 bg-primary/10 rounded-full" data-unique-id="1e7e9244-cb3c-447b-8cd2-2d3f9a478ec9" data-file-name="components/file-uploader.tsx">
                <File className="h-10 w-10 text-primary" />
              </div>
              <div data-unique-id="6dc0831e-8f21-48a0-9c4e-62589102c6f3" data-file-name="components/file-uploader.tsx">
                <p className="text-lg font-medium" data-unique-id="327ca5c3-3a1e-4108-ac82-4f35a3c85c58" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">{acceptedFiles[0].name}</p>
                <p className="text-sm text-muted-foreground" data-unique-id="30ef943b-5fec-427e-a9bf-08dd113f0c4c" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
                  {(acceptedFiles[0].size / 1024 / 1024).toFixed(2)}<span className="editable-text" data-unique-id="c265a4bb-c185-45a5-9ad8-7b790efd8d3d" data-file-name="components/file-uploader.tsx"> MB
                </span></p>
              </div>
              <button onClick={e => {
            e.stopPropagation();
            // Reset the dropzone state by resetting the form
            e.currentTarget.form?.reset();
            // Force re-render the component to clear the UI
            getRootProps().onClick?.(new MouseEvent('click') as any);
          }} className="mt-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" data-unique-id="e18bc6f6-94c8-4b91-bbe1-c1f33729b594" data-file-name="components/file-uploader.tsx">
                <X className="h-4 w-4" />
              </button>
            </motion.div> : <div className="flex flex-col items-center space-y-4" data-unique-id="c534de06-f97f-4ec2-9009-3877beb63255" data-file-name="components/file-uploader.tsx">
              <div className="p-4 bg-primary/10 rounded-full" data-unique-id="b507b174-6951-4615-99a2-1a4a4ff3a1a2" data-file-name="components/file-uploader.tsx">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <div data-unique-id="c7300487-34a9-4f71-94f5-73e8a2d3e8d8" data-file-name="components/file-uploader.tsx">
                <p className="text-lg font-medium" data-unique-id="51e2abfe-bbd4-4ada-b9d7-d7e4a3b8d28a" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="82d7eb5e-1f5c-475a-bec8-3439d172f244" data-file-name="components/file-uploader.tsx">Drop file here or click to upload</span></p>
                <p className="text-sm text-muted-foreground" data-unique-id="f6433ab7-c208-4d10-ac4b-c483fb6ed95b" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="ec13eb41-acb3-4ba7-9381-519d26c1153b" data-file-name="components/file-uploader.tsx">
                  Support for .xlsx, .xls, and .csv files
                </span></p>
              </div>
            </div>}
        </div>
      </div>
    </div>;
}