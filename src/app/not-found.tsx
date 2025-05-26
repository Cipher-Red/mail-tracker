// This is a server component that doesn't rely on theme context
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
export default function NotFound() {
  return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900" data-unique-id="5471741e-af7f-4eda-bf18-85ecd5f7e7d6" data-file-name="app/not-found.tsx">
      <div className="max-w-md w-full p-8" data-unique-id="6e6744be-1196-476a-9211-fb0b09407f1c" data-file-name="app/not-found.tsx">
        <div className="text-center" data-unique-id="5d5d0634-1898-4249-9250-1191936aea81" data-file-name="app/not-found.tsx">
          <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-400" data-unique-id="52e07d4d-7694-41de-86c7-0754081a1dec" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="1cb1d3f2-ef9e-4fc6-90d2-e48d66747aa0" data-file-name="app/not-found.tsx">404</span></h1>
          <h2 className="text-2xl font-medium mt-4 text-slate-800 dark:text-slate-200" data-unique-id="729b50d0-e2e2-4da1-8833-aee5287d65a4" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="83061b12-1d53-4a07-9bb6-6625e2289493" data-file-name="app/not-found.tsx">Page Not Found</span></h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400" data-unique-id="4bce9733-a039-4f04-8ff0-f6140572f85f" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="f3155268-982d-4b60-bdaa-4c282585b179" data-file-name="app/not-found.tsx">
            The page you are looking for doesn't exist or has been moved.
          </span></p>
          
          <Link href="/" className="mt-8 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" data-unique-id="e9f784be-3b57-4272-8d30-9575faec6913" data-file-name="app/not-found.tsx">
            <ArrowLeft className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="1267ca7a-2085-4cc7-835d-65acd8075af3" data-file-name="app/not-found.tsx">
            Back to Home
          </span></Link>
        </div>
      </div>
    </div>;
}