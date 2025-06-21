'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/lib/admin-auth';
import AdminLoginForm from '@/components/admin/login-form';
import AdminSidebar from '@/components/admin/sidebar';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  // Handle mounting to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use auth state inside a separate client component to avoid hydration issues
  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900" data-unique-id="bc1a04f3-5d42-4d36-a020-2a1157987ead" data-file-name="app/admin/layout.tsx">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
      </div>;
  }
  return <AdminContent>{children}</AdminContent>;
}

// Separate client component to handle authentication state
function AdminContent({
  children
}: {
  children: React.ReactNode;
}) {
  const {
    isAuthenticated,
    isLoading
  } = useAdminAuth();
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900" data-unique-id="c12af744-1345-4269-9c5e-60a80d9c77f2" data-file-name="app/admin/layout.tsx">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
      </div>;
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center" data-unique-id="e6e7ffde-d246-40ea-b844-78b63c2b59be" data-file-name="app/admin/layout.tsx">
        <AdminLoginForm />
      </div>;
  }

  // Render admin layout with sidebar for authenticated users
  return <div className="flex min-h-screen bg-gray-900 text-gray-100" data-unique-id="02683673-d6a5-4f75-8773-c1652af0a848" data-file-name="app/admin/layout.tsx">
      <AdminSidebar />
      <motion.main initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.3
    }} className="flex-1 p-8" data-unique-id="35342fc9-ebe8-4224-959b-95e13ececf57" data-file-name="app/admin/layout.tsx" data-dynamic-text="true">
        {children}
      </motion.main>
    </div>;
}