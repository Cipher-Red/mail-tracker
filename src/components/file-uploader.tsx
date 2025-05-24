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
  return <div data-unique-id="00c0117d-929c-47e8-a3a7-eb2cebebc1eb" data-file-name="components/file-uploader.tsx">
      <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${getBorderColor()}
          ${isDragActive ? 'bg-primary/5' : 'bg-white hover:bg-accent/5'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `} data-unique-id="bef30da3-8aef-4608-a165-7a38a907e12c" data-file-name="components/file-uploader.tsx">
        <input {...getInputProps()} data-unique-id="a1736791-940e-4b7e-9fc1-af4dc0ca87c6" data-file-name="components/file-uploader.tsx" />
        <div className="flex flex-col items-center justify-center text-center" data-unique-id="7a58e44e-4824-4546-becf-7d3595f38782" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
          {isProcessing ? <div className="flex flex-col items-center space-y-4" data-unique-id="f7918b0c-502b-4bf6-82a1-eda9a3513f12" data-file-name="components/file-uploader.tsx">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-lg font-medium text-primary" data-unique-id="a4cf645e-d91b-40ec-9f7f-c5864d2dce3d" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="f1b10f19-655a-4936-9e9d-6c69a9ee15bd" data-file-name="components/file-uploader.tsx">Processing file...</span></p>
              <p className="text-sm text-muted-foreground" data-unique-id="2673bd07-5e04-4d31-8268-c4ef006a9b00" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="75830bde-dd03-4b76-9b86-ddcd1ae75404" data-file-name="components/file-uploader.tsx">This may take a moment depending on file size</span></p>
            </div> : acceptedFiles.length > 0 ? <motion.div initial={{
          scale: 0.9
        }} animate={{
          scale: 1
        }} className="flex flex-col items-center space-y-4" data-unique-id="b3479e0b-6eb0-432a-8890-b6614d92dd96" data-file-name="components/file-uploader.tsx">
              <div className="p-4 bg-primary/10 rounded-full" data-unique-id="6a546b67-7b2a-4582-acf4-c75928c55858" data-file-name="components/file-uploader.tsx">
                <File className="h-10 w-10 text-primary" />
              </div>
              <div data-unique-id="03080146-e556-4d52-a12e-3b4064d12b3b" data-file-name="components/file-uploader.tsx">
                <p className="text-lg font-medium" data-unique-id="605ae226-a89d-4d68-a978-958fbbb40d91" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">{acceptedFiles[0].name}</p>
                <p className="text-sm text-muted-foreground" data-unique-id="693fd03f-ae22-47bd-8420-2401f7babe4d" data-file-name="components/file-uploader.tsx" data-dynamic-text="true">
                  {(acceptedFiles[0].size / 1024 / 1024).toFixed(2)}<span className="editable-text" data-unique-id="409053b8-13f5-4680-a807-92e5334714f4" data-file-name="components/file-uploader.tsx"> MB
                </span></p>
              </div>
              <button onClick={e => {
            e.stopPropagation();
            // Reset the dropzone state by resetting the form
            e.currentTarget.form?.reset();
            // Force re-render the component to clear the UI
            getRootProps().onClick?.(new MouseEvent('click') as any);
          }} className="mt-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" data-unique-id="32faeb08-205d-49c7-83ba-353e2cf3bdb3" data-file-name="components/file-uploader.tsx">
                <X className="h-4 w-4" />
              </button>
            </motion.div> : <div className="flex flex-col items-center space-y-4" data-unique-id="90a13ca6-62f6-4859-9bb8-40c88fb62aec" data-file-name="components/file-uploader.tsx">
              <div className="p-4 bg-primary/10 rounded-full" data-unique-id="9ec805bf-a057-4c9b-8a8f-c547fbead7fc" data-file-name="components/file-uploader.tsx">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <div data-unique-id="c279d2e1-3874-4d61-8f4a-6452ab3c0a4d" data-file-name="components/file-uploader.tsx">
                <p className="text-lg font-medium" data-unique-id="0d20daa8-161e-4648-94b0-873bdad10554" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="ccc707f6-8344-43a9-8074-4c8d1c9f12dc" data-file-name="components/file-uploader.tsx">Drop file here or click to upload</span></p>
                <p className="text-sm text-muted-foreground" data-unique-id="2d12f089-6c41-4228-96e6-f47f061ff501" data-file-name="components/file-uploader.tsx"><span className="editable-text" data-unique-id="ab3c2415-40e2-40ec-903e-9c1b44cc8979" data-file-name="components/file-uploader.tsx">
                  Support for .xlsx, .xls, and .csv files
                </span></p>
              </div>
            </div>}
        </div>
      </div>
    </div>;
}