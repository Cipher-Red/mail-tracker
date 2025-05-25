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
  return <div data-unique-id="dfa08fc8-27cb-4ea4-9ff2-9bd1446065e3" data-file-name="components/file-uploader.tsx">
      <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300
          ${getBorderColor()}
          ${isDragActive ? 'bg-primary/5 scale-[1.02] shadow-lg' : 'bg-card/60 hover:bg-accent/5 hover:scale-[1.01] hover:shadow-md'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `} data-unique-id="0dfd7b7c-1d79-4607-b0b8-4670a4a02d49" data-file-name="components/file-uploader.tsx">
        <input {...getInputProps()} data-unique-id="33b9355f-978c-4cf2-8144-62fb8aa5e0c0" data-file-name="components/file-uploader.tsx" />
        <div className="flex flex-col items-center justify-center text-center" data-unique-id="93364ead-839a-4e3d-83b7-3d6b2f1455a2" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
          {isProcessing ? <div className="flex flex-col items-center space-y-4" data-unique-id="83f4e3b0-ac8f-4688-989b-33c1bf3ee969" data-file-name="components/file-uploader.tsx">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-lg font-medium text-primary" data-unique-id="4c2adbba-2aae-4e36-9d0d-0c5127baecfe" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="093ac2e3-6b10-46b1-8e75-c1fc3a91e258" data-file-name="components/file-uploader.tsx">Processing file...</span></p>
              <p className="text-sm text-muted-foreground" data-unique-id="517b2d98-f6df-4232-a681-9b63e3e97658" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="4ecf6a1a-929a-40b0-b150-d545392ce439" data-file-name="components/file-uploader.tsx">This may take a moment depending on file size</span></p>
            </div> : acceptedFiles.length > 0 ? <motion.div initial={{
          scale: 0.9
        }} animate={{
          scale: 1
        }} className="flex flex-col items-center space-y-4" data-unique-id="6c943d79-9866-40db-9791-0270801241c4" data-file-name="components/file-uploader.tsx">
              <div className="p-4 bg-primary/10 rounded-full" data-unique-id="63ebd943-47f1-49ae-b369-7c9173762664" data-file-name="components/file-uploader.tsx">
                <File className="h-10 w-10 text-primary" />
              </div>
              <div data-unique-id="7769d597-48e6-455f-a991-b7dfd953626e" data-file-name="components/file-uploader.tsx">
                <p className="text-lg font-medium" data-unique-id="74e2a51c-ddd0-4c4c-a543-b93eca3675cd" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">{acceptedFiles[0].name}</p>
                <p className="text-sm text-muted-foreground" data-unique-id="ff81f349-2a49-4ffc-92b4-ab6f4d448a3a" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
                  {(acceptedFiles[0].size / 1024 / 1024).toFixed(2)}<span className="editable-text" data-unique-id="8aa9f4bf-06f1-45ff-a1db-a09ef2a3a292" data-file-name="components/file-uploader.tsx"> MB
                </span></p>
              </div>
              <button onClick={e => {
            e.stopPropagation();
            // Reset the dropzone state by resetting the form
            e.currentTarget.form?.reset();
            // Force re-render the component to clear the UI
            getRootProps().onClick?.(new MouseEvent('click') as any);
          }} className="mt-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" data-unique-id="44a7c6fc-a3de-44c6-bbf7-aa391237a00b" data-file-name="components/file-uploader.tsx">
                <X className="h-4 w-4" />
              </button>
            </motion.div> : <div className="flex flex-col items-center space-y-4" data-unique-id="3d9a540d-9f13-4570-9e30-16f9d0ff74d4" data-file-name="components/file-uploader.tsx">
              <div className="p-4 bg-primary/10 rounded-full" data-unique-id="bac527f3-e800-4985-a6ad-d15a1c467275" data-file-name="components/file-uploader.tsx">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <div data-unique-id="38bd9670-e8c1-4cf9-8b96-f56b9676b27d" data-file-name="components/file-uploader.tsx">
                <p className="text-lg font-medium" data-unique-id="36fd4a11-59b9-4207-a447-92f0c234c30d" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="04adf07a-0e92-4f8b-8186-21c5fb32f146" data-file-name="components/file-uploader.tsx">Drop file here or click to upload</span></p>
                <p className="text-sm text-muted-foreground" data-unique-id="1450a960-24ed-41c8-bc8c-5099c2fcda8d" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="89bf7a71-de9e-4e01-a6a0-6239de38e916" data-file-name="components/file-uploader.tsx">
                  Support for .xlsx, .xls, and .csv files
                </span></p>
              </div>
            </div>}
        </div>
      </div>
    </div>;
}