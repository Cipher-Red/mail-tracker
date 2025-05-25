// This is a server component that doesn't rely on theme context
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
export default function NotFound() {
  return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900" data-unique-id="04311bf3-40b5-4632-a4c2-1f1a38be23dd" data-file-name="app/not-found.tsx">
      <div className="max-w-md w-full p-8" data-unique-id="8bfec40b-7756-4ba2-9f41-b229333717b3" data-file-name="app/not-found.tsx">
        <div className="text-center" data-unique-id="8624e6e2-d1e9-4107-b316-882dc3ce2cdb" data-file-name="app/not-found.tsx">
          <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-400" data-unique-id="ff51edc8-aed8-4de9-9ed0-71206c02e1a9" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="cec4b370-3139-4edb-96c4-b49c66b7ff31" data-file-name="app/not-found.tsx">404</span></h1>
          <h2 className="text-2xl font-medium mt-4 text-slate-800 dark:text-slate-200" data-unique-id="65a2d47c-66ba-4b61-a476-7fb7b665f59c" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="88d95600-c432-424b-99c6-9befe232c981" data-file-name="app/not-found.tsx">Page Not Found</span></h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400" data-unique-id="b7a3a2ed-cb2e-4416-ac02-541ba16e014b" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="d9bb127b-7089-4187-9661-fcb28dd97dfc" data-file-name="app/not-found.tsx">
            The page you are looking for doesn't exist or has been moved.
          </span></p>
          
          <Link href="/" className="mt-8 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" data-unique-id="4c16ee0e-a612-4c5c-b587-2544cc01d600" data-file-name="app/not-found.tsx">
            <ArrowLeft className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="ceb88781-fad0-4726-a885-09509d8ec99c" data-file-name="app/not-found.tsx">
            Back to Home
          </span></Link>
        </div>
      </div>
    </div>;
}