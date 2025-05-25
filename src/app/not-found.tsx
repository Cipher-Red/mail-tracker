// This is a server component that doesn't rely on theme context
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
export default function NotFound() {
  return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900" data-unique-id="5c74d5c5-63d3-4fa4-b1e8-35556370f7ee" data-file-name="app/not-found.tsx">
      <div className="max-w-md w-full p-8" data-unique-id="8d73d00f-d801-463f-b41d-7162efa39f7e" data-file-name="app/not-found.tsx">
        <div className="text-center" data-unique-id="aee8b9f0-6936-481e-b8bf-b02bf6882e4d" data-file-name="app/not-found.tsx">
          <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-400" data-unique-id="7c454693-ec54-4be1-9195-15229f00128d" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="b0e5cce9-7f1f-4065-82de-0edb4715dc6b" data-file-name="app/not-found.tsx">404</span></h1>
          <h2 className="text-2xl font-medium mt-4 text-slate-800 dark:text-slate-200" data-unique-id="8fb73f15-6a18-4e29-beb5-2968747097fe" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="c1c7009e-1927-4394-877e-ffc0e7e42478" data-file-name="app/not-found.tsx">Page Not Found</span></h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400" data-unique-id="eaaf1427-79f4-4b36-8a1b-a07247ec44f4" data-file-name="app/not-found.tsx"><span className="editable-text" data-unique-id="487dc60c-b177-4611-a986-3eaefd2db3f2" data-file-name="app/not-found.tsx">
            The page you are looking for doesn't exist or has been moved.
          </span></p>
          
          <Link href="/" className="mt-8 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" data-unique-id="99eabb48-27b5-4029-bc0b-9443faf128b1" data-file-name="app/not-found.tsx">
            <ArrowLeft className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="c8b5032d-b328-4645-ad96-d765be1598ff" data-file-name="app/not-found.tsx">
            Back to Home
          </span></Link>
        </div>
      </div>
    </div>;
}