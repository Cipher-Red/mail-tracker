// This is a server component that doesn't rely on theme context
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
export default function NotFound() {
  return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900" data-unique-id="36b619b5-d58a-4057-ba6d-c61507e2a75c" data-file-name="app/not-found.tsx">
      <div className="max-w-md w-full p-8" data-unique-id="28741d18-47ff-489f-abee-26c8556f647a" data-file-name="app/not-found.tsx">
        <div className="text-center" data-unique-id="237510e8-0b5a-4bd2-8c77-7187703e53d2" data-file-name="app/not-found.tsx">
          <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-400" data-unique-id="bac0801f-dd4a-441f-a1d0-37cf24ad4f49" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="2ed57479-2176-450a-859f-4a97d4b322b5" data-file-name="app/not-found.tsx">404</span></h1>
          <h2 className="text-2xl font-medium mt-4 text-slate-800 dark:text-slate-200" data-unique-id="a9ca1892-a21a-4eac-a7e0-40b3e3c941af" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="86afb2e0-cdfa-4489-98e9-237ac9dd4342" data-file-name="app/not-found.tsx">Page Not Found</span></h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400" data-unique-id="db7b45dd-8d8d-4af3-92af-06369ba6be8c" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="3d8c5c4e-38ba-45f2-9aae-16462c327eaf" data-file-name="app/not-found.tsx">
            The page you are looking for doesn't exist or has been moved.
          </span></p>
          
          <Link href="/" className="mt-8 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" data-unique-id="c640c5bc-f28a-408d-b0d1-f05e2d9e5c8f" data-file-name="app/not-found.tsx">
            <ArrowLeft className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="b84de8eb-98fe-4e7d-bb60-65be21c36ee2" data-file-name="app/not-found.tsx">
            Back to Home
          </span></Link>
        </div>
      </div>
    </div>;
}