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
  return <div data-unique-id="86a96b63-7b5e-4794-ab2d-27869718c0ff" data-file-name="components/file-uploader.tsx">
      <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${getBorderColor()}
          ${isDragActive ? 'bg-primary/5' : 'bg-white hover:bg-accent/5'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `} data-unique-id="7fbbcff1-ee3b-4807-b03b-92c135eb2cf4" data-file-name="components/file-uploader.tsx">
        <input {...getInputProps()} data-unique-id="5392397b-23cf-4336-b3f5-51899d08ddb2" data-file-name="components/file-uploader.tsx" />
        <div className="flex flex-col items-center justify-center text-center" data-unique-id="d288c1a6-eb66-4c5c-a0da-8632c6ba0494" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
          {isProcessing ? <div className="flex flex-col items-center space-y-4" data-unique-id="2f508d32-ea91-4efc-8f15-c428f1f3b02f" data-file-name="components/file-uploader.tsx">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-lg font-medium text-primary" data-unique-id="5c312f1c-c228-4108-9882-1052531f8a6c" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="4ab58784-5f1e-48c1-8925-04f5fafd72b5" data-file-name="components/file-uploader.tsx">Processing file...</span></p>
              <p className="text-sm text-muted-foreground" data-unique-id="172e25ee-9b88-40fb-8cfd-011f6e85dde7" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="0a0cceef-4f16-47ef-99fc-e5335eb45f21" data-file-name="components/file-uploader.tsx">This may take a moment depending on file size</span></p>
            </div> : acceptedFiles.length > 0 ? <motion.div initial={{
          scale: 0.9
        }} animate={{
          scale: 1
        }} className="flex flex-col items-center space-y-4" data-unique-id="3e4787b6-74e6-4291-8165-6e41aa935f29" data-file-name="components/file-uploader.tsx">
              <div className="p-4 bg-primary/10 rounded-full" data-unique-id="db0c41b9-12f2-44be-81a9-fd98dc2bb7ea" data-file-name="components/file-uploader.tsx">
                <File className="h-10 w-10 text-primary" />
              </div>
              <div data-unique-id="a1409737-a5c7-47e9-bdf5-b33546d6fca6" data-file-name="components/file-uploader.tsx">
                <p className="text-lg font-medium" data-unique-id="38890f1a-6607-4cf6-926a-454575c4e951" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">{acceptedFiles[0].name}</p>
                <p className="text-sm text-muted-foreground" data-unique-id="efcdd629-3a42-4225-934a-fae80ac28268" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
                  {(acceptedFiles[0].size / 1024 / 1024).toFixed(2)}<span className="editable-text" data-unique-id="5372be1a-9f42-4925-8426-743efcb4eaae" data-file-name="components/file-uploader.tsx"> MB
                </span></p>
              </div>
              <button onClick={e => {
            e.stopPropagation();
            // Reset the dropzone state by resetting the form
            e.currentTarget.form?.reset();
            // Force re-render the component to clear the UI
            getRootProps().onClick?.(new MouseEvent('click') as any);
          }} className="mt-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" data-unique-id="abf487fe-2af8-470e-b19e-55fa32a89bad" data-file-name="components/file-uploader.tsx">
                <X className="h-4 w-4" />
              </button>
            </motion.div> : <div className="flex flex-col items-center space-y-4" data-unique-id="50e1ce77-b385-48e6-a929-d428ca5c456d" data-file-name="components/file-uploader.tsx">
              <div className="p-4 bg-primary/10 rounded-full" data-unique-id="82606dae-bf7e-4bb7-81b5-84758d774987" data-file-name="components/file-uploader.tsx">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <div data-unique-id="6e80cc4f-d2a4-4cf8-9a0b-5fac5e23ff71" data-file-name="components/file-uploader.tsx">
                <p className="text-lg font-medium" data-unique-id="0a301a73-3906-4ae6-9dd6-ae68c455a47b" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="aa788d80-bd43-457a-b51b-0334cbbd3176" data-file-name="components/file-uploader.tsx">Drop file here or click to upload</span></p>
                <p className="text-sm text-muted-foreground" data-unique-id="75e45d56-d486-4b67-b52d-f32729982d19" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="04714185-e5c2-4cec-a93a-555678a718d1" data-file-name="components/file-uploader.tsx">
                  Support for .xlsx, .xls, and .csv files
                </span></p>
              </div>
            </div>}
        </div>
      </div>
    </div>;
}