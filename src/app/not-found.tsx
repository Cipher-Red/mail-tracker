// This is a server component that doesn't rely on theme context
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
export default function NotFound() {
  return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900" data-unique-id="57aa960b-b5dd-4a1e-8a00-c1529df26e90" data-file-name="app/not-found.tsx">
      <div className="max-w-md w-full p-8" data-unique-id="be106e35-e0ce-4a8a-8927-90ce8d140483" data-file-name="app/not-found.tsx">
        <div className="text-center" data-unique-id="bdaec9b2-c14e-4c04-93ee-e69a64a14b00" data-file-name="app/not-found.tsx">
          <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-400" data-unique-id="7db8d943-551a-463c-b53a-02fe7f7a72e1" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="4c3c5697-72ad-4c2a-93c3-abcd582e2904" data-file-name="app/not-found.tsx">404</span></h1>
          <h2 className="text-2xl font-medium mt-4 text-slate-800 dark:text-slate-200" data-unique-id="affe9cb6-1d21-473b-9e73-5a95c23dd275" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="3634ac9f-3701-492c-abda-27c979b153dd" data-file-name="app/not-found.tsx">Page Not Found</span></h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400" data-unique-id="e151c1ea-133b-4524-9b4e-19a32f334339" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="4327df4b-20ee-4183-afa9-6b46cf802f16" data-file-name="app/not-found.tsx">
            The page you are looking for doesn't exist or has been moved.
          </span></p>
          
          <Link href="/" className="mt-8 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" data-unique-id="d82de65f-e6aa-41dc-809e-5fd5b9eca7b6" data-file-name="app/not-found.tsx">
            <ArrowLeft className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="0a424b76-bb53-45c3-b11f-c3b7aebeb6a0" data-file-name="app/not-found.tsx">
            Back to Home
          </span></Link>
        </div>
      </div>
    </div>;
}