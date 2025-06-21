// This is a server component that doesn't rely on theme context
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
export default function NotFound() {
  return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900" data-unique-id="02d1d760-ea5d-4e49-ba46-d024408d60ea" data-file-name="app/not-found.tsx">
      <div className="max-w-md w-full p-8" data-unique-id="2b66d06e-6bcb-4db2-8154-19e60e71478b" data-file-name="app/not-found.tsx">
        <div className="text-center" data-unique-id="d5a71ddd-8976-4167-bf4c-2175850c8a64" data-file-name="app/not-found.tsx">
          <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-400" data-unique-id="fe72fb14-7176-41f9-8e3e-a8d3f68cf73c" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="0c435c70-ec25-4a6e-b7ef-5e1cfec5d356" data-file-name="app/not-found.tsx">404</span></h1>
          <h2 className="text-2xl font-medium mt-4 text-slate-800 dark:text-slate-200" data-unique-id="7a6f7828-d02e-41ef-9300-aa10089c2930" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="9491ea1e-8955-4aef-84b5-f7aa68d98fe3" data-file-name="app/not-found.tsx">Page Not Found</span></h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400" data-unique-id="c4e18a38-9b36-43b6-8830-616ea4c0d616" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="f01820b8-7593-48a1-a66f-98d5d308352b" data-file-name="app/not-found.tsx">
            The page you are looking for doesn't exist or has been moved.
          </span></p>
          
          <Link href="/" className="mt-8 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" data-unique-id="415afd59-cac9-42b9-9ef6-190e80554871" data-file-name="app/not-found.tsx">
            <ArrowLeft className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="a4d71b69-0316-4c1a-8047-e7fbae94f399" data-file-name="app/not-found.tsx">
            Back to Home
          </span></Link>
        </div>
      </div>
    </div>;
}