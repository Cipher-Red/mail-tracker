// This is a server component that doesn't rely on theme context
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
export default function NotFound() {
  return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900" data-unique-id="e517076f-84bc-4cc5-8a8d-dd2e500867cf" data-file-name="app/not-found.tsx">
      <div className="max-w-md w-full p-8" data-unique-id="cf0e074f-ba87-45c7-8c07-580fb2aeae44" data-file-name="app/not-found.tsx">
        <div className="text-center" data-unique-id="0dc8fcbb-4826-4af4-bcbb-4825d7d8a90a" data-file-name="app/not-found.tsx">
          <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-400" data-unique-id="befc174d-e68b-4151-a0c7-df1992d5fa76" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="3a29d7a7-cbbb-4c4c-857f-a8db5c78bb6c" data-file-name="app/not-found.tsx">404</span></h1>
          <h2 className="text-2xl font-medium mt-4 text-slate-800 dark:text-slate-200" data-unique-id="6628853c-cf40-4565-8ab1-18efd3802288" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="ebf35a8a-7d89-46b5-bf52-724f1aa023d3" data-file-name="app/not-found.tsx">Page Not Found</span></h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400" data-unique-id="0793daf4-1aa8-4170-8b25-366bd28b71a7" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="0cac92b7-4db3-47da-b527-d2909fe9a553" data-file-name="app/not-found.tsx">
            The page you are looking for doesn't exist or has been moved.
          </span></p>
          
          <Link href="/" className="mt-8 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" data-unique-id="d49df312-492f-4dd7-9d31-3541959cdcd3" data-file-name="app/not-found.tsx">
            <ArrowLeft className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="1c35480d-7e5c-4196-930f-df01fbda113d" data-file-name="app/not-found.tsx">
            Back to Home
          </span></Link>
        </div>
      </div>
    </div>;
}