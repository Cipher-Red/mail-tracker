// This is a server component that doesn't rely on theme context
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
export default function NotFound() {
  return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900" data-unique-id="3b53d152-8e12-4976-8a09-ff4395d06c1c" data-file-name="app/not-found.tsx">
      <div className="max-w-md w-full p-8" data-unique-id="5a15f9f1-8369-4eab-b3fa-9af529c86419" data-file-name="app/not-found.tsx">
        <div className="text-center" data-unique-id="e5004c06-cb82-4322-8765-7e733b62ada2" data-file-name="app/not-found.tsx">
          <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-400" data-unique-id="c63d7470-bdb7-40af-a37c-40eeac751c76" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="655af8ac-7577-4294-922c-be8bc62d87e2" data-file-name="app/not-found.tsx">404</span></h1>
          <h2 className="text-2xl font-medium mt-4 text-slate-800 dark:text-slate-200" data-unique-id="5674cc7c-c5c3-49a5-a097-7dd6d6361121" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="6195ea93-66fd-47fb-8a65-ad8afd0b8d8e" data-file-name="app/not-found.tsx">Page Not Found</span></h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400" data-unique-id="a1b886e9-9b8d-4c89-aeb2-11a1ebb50445" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="0ce510e0-0465-4500-b316-987016be427b" data-file-name="app/not-found.tsx">
            The page you are looking for doesn't exist or has been moved.
          </span></p>
          
          <Link href="/" className="mt-8 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" data-unique-id="cde50033-ee82-4195-939f-34a9646afb2f" data-file-name="app/not-found.tsx">
            <ArrowLeft className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="114f0e5b-65e4-415b-8911-6f1ef9ce7ced" data-file-name="app/not-found.tsx">
            Back to Home
          </span></Link>
        </div>
      </div>
    </div>;
}