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
  return <div data-unique-id="79539cc1-a2d1-443f-91f0-a41f8a5048b5" data-file-name="components/file-uploader.tsx">
      <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300
          ${getBorderColor()}
          ${isDragActive ? 'bg-primary/5 scale-[1.02] shadow-lg' : 'bg-card/60 hover:bg-accent/5 hover:scale-[1.01] hover:shadow-md'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `} data-unique-id="ef10a955-b1c1-4c07-895d-56e79806271a" data-file-name="components/file-uploader.tsx">
        <input {...getInputProps()} data-unique-id="6c843a68-43b2-41b9-84b9-f63e423f4934" data-file-name="components/file-uploader.tsx" />
        <div className="flex flex-col items-center justify-center text-center" data-unique-id="984e6ace-7728-45ef-8e64-f5defb89bb3c" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
          {isProcessing ? <div className="flex flex-col items-center space-y-4" data-unique-id="d1bcd416-d21d-46c3-851a-aaf138cc9865" data-file-name="components/file-uploader.tsx">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-lg font-medium text-primary" data-unique-id="1a4ef1c2-1531-4c7e-a04a-bfb1663017cf" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="eead281e-2eda-4628-a038-c4f6b47440db" data-file-name="components/file-uploader.tsx">Processing file...</span></p>
              <p className="text-sm text-muted-foreground" data-unique-id="682f3731-908b-4e81-b2d7-fb25b6afe303" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="2066e638-4208-474d-9c87-a83dbbea11d5" data-file-name="components/file-uploader.tsx">This may take a moment depending on file size</span></p>
            </div> : acceptedFiles.length > 0 ? <motion.div initial={{
          scale: 0.9
        }} animate={{
          scale: 1
        }} className="flex flex-col items-center space-y-4" data-unique-id="eeafe504-0a63-40e9-adc4-36afdcea1ac1" data-file-name="components/file-uploader.tsx">
              <div className="p-4 bg-primary/10 rounded-full" data-unique-id="4e6bb104-c9d8-4110-a9da-4cb836f41071" data-file-name="components/file-uploader.tsx">
                <File className="h-10 w-10 text-primary" />
              </div>
              <div data-unique-id="cd99cc5c-8e38-42e7-9d25-4a192cfb2809" data-file-name="components/file-uploader.tsx">
                <p className="text-lg font-medium" data-unique-id="295628d2-3419-4fc7-8eb3-8ce5bd4856e6" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">{acceptedFiles[0].name}</p>
                <p className="text-sm text-muted-foreground" data-unique-id="d18aa726-97b1-4378-abba-170ac6220a07" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
                  {(acceptedFiles[0].size / 1024 / 1024).toFixed(2)}<span className="editable-text" data-unique-id="d916aad1-2d3d-4c45-b2c1-01ba0e325b5f" data-file-name="components/file-uploader.tsx"> MB
                </span></p>
              </div>
              <button onClick={e => {
            e.stopPropagation();
            // Reset the dropzone state by resetting the form
            e.currentTarget.form?.reset();
            // Force re-render the component to clear the UI
            getRootProps().onClick?.(new MouseEvent('click') as any);
          }} className="mt-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" data-unique-id="8c1f3752-c264-41d8-8ff2-6b379311df13" data-file-name="components/file-uploader.tsx">
                <X className="h-4 w-4" />
              </button>
            </motion.div> : <div className="flex flex-col items-center space-y-4" data-unique-id="d46d7877-f51b-4250-9c61-fbae0ad10f1c" data-file-name="components/file-uploader.tsx">
              <div className="p-4 bg-primary/10 rounded-full" data-unique-id="242b8d98-3bdd-469e-bbc9-30c473e49b43" data-file-name="components/file-uploader.tsx">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <div data-unique-id="b8f1af0f-dab5-465e-bdb5-ec9b366bdadb" data-file-name="components/file-uploader.tsx">
                <p className="text-lg font-medium" data-unique-id="4482113a-4c6f-4283-9920-1ef192d4adbb" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="e51cad43-8dab-4d0d-88a0-04164924cb86" data-file-name="components/file-uploader.tsx">Drop file here or click to upload</span></p>
                <p className="text-sm text-muted-foreground" data-unique-id="55181e8b-6588-454e-af1c-9f507b56e351" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="b8d39ca4-e1e5-46e5-bd60-30733886a742" data-file-name="components/file-uploader.tsx">
                  Support for .xlsx, .xls, and .csv files
                </span></p>
              </div>
            </div>}
        </div>
      </div>
    </div>;
}