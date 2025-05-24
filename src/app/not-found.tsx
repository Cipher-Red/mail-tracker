// This is a server component that doesn't rely on theme context
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
export default function NotFound() {
  return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900" data-unique-id="febc836b-c8c0-4316-9f56-becc2c608ee5" data-file-name="app/not-found.tsx">
      <div className="max-w-md w-full p-8" data-unique-id="166144d8-f403-4ca1-bfe8-3244946ec4ed" data-file-name="app/not-found.tsx">
        <div className="text-center" data-unique-id="9c9852e5-9be6-4ea3-b220-5b5e14d1a283" data-file-name="app/not-found.tsx">
          <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-400" data-unique-id="c37a7c74-5f93-40ff-8f53-da29e0534f8a" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="baad4cc2-97b8-467c-93d5-b052755deaf0" data-file-name="app/not-found.tsx">404</span></h1>
          <h2 className="text-2xl font-medium mt-4 text-slate-800 dark:text-slate-200" data-unique-id="70177e9c-3534-4493-b9b2-955d13960fb9" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="47750782-db66-469c-99a4-909b23b688ea" data-file-name="app/not-found.tsx">Page Not Found</span></h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400" data-unique-id="08d59a36-6f53-4a37-ac7d-bf35d7c4995a" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="247f7a85-4c2a-4c36-87ed-72a1336ed35a" data-file-name="app/not-found.tsx">
            The page you are looking for doesn't exist or has been moved.
          </span></p>
          
          <Link href="/" className="mt-8 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" data-unique-id="ace8d953-16b6-444b-b733-fcf5e6d53d0f" data-file-name="app/not-found.tsx">
            <ArrowLeft className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="0486e537-c17c-4494-bfa5-b04e4ed1024e" data-file-name="app/not-found.tsx">
            Back to Home
          </span></Link>
        </div>
      </div>
    </div>;
}