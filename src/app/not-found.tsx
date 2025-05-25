// This is a server component that doesn't rely on theme context
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
export default function NotFound() {
  return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900" data-unique-id="6acfb9cc-911e-4225-841d-47ef3502c29a" data-file-name="app/not-found.tsx">
      <div className="max-w-md w-full p-8" data-unique-id="161c56b1-5bbe-4dd6-930c-a61f13c9bfde" data-file-name="app/not-found.tsx">
        <div className="text-center" data-unique-id="c126c907-47ee-46d7-a7e7-b29e8f3c810c" data-file-name="app/not-found.tsx">
          <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-400" data-unique-id="bfb649bb-3206-476f-8212-461b9f2ea038" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="a78d5123-92c3-469b-9c77-c9c70fe5d40a" data-file-name="app/not-found.tsx">404</span></h1>
          <h2 className="text-2xl font-medium mt-4 text-slate-800 dark:text-slate-200" data-unique-id="449169ba-ec5c-4953-b81f-de3eb9a9c091" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="1d1ee324-ca14-47e9-a0e0-02d21f38b55d" data-file-name="app/not-found.tsx">Page Not Found</span></h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400" data-unique-id="2ff90c39-98bc-47e7-8cbc-38d586a10399" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="c7a35981-21c4-4d1c-be01-f31e8dc2a1b0" data-file-name="app/not-found.tsx">
            The page you are looking for doesn't exist or has been moved.
          </span></p>
          
          <Link href="/" className="mt-8 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" data-unique-id="b7a5ae02-07c6-40df-925d-9fe8e9e8b956" data-file-name="app/not-found.tsx">
            <ArrowLeft className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="517e1d51-104e-4bd6-bef6-0803f225ea85" data-file-name="app/not-found.tsx">
            Back to Home
          </span></Link>
        </div>
      </div>
    </div>;
}