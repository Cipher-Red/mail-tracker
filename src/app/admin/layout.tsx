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
    return <div className="min-h-screen flex items-center justify-center bg-gray-900" data-unique-id="cb1cfe50-904e-45cf-bec8-538a0fc5aa8a" data-file-name="app/admin/layout.tsx">
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
    return <div className="min-h-screen flex items-center justify-center bg-gray-900" data-unique-id="d135487b-fae0-42cc-b9ce-5c2fd2dd1e76" data-file-name="app/admin/layout.tsx">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
      </div>;
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center" data-unique-id="bfb61f12-d514-4c5e-96c5-110055ed4313" data-file-name="app/admin/layout.tsx">
        <AdminLoginForm />
      </div>;
  }

  // Render admin layout with sidebar for authenticated users
  return <div className="flex min-h-screen bg-gray-900 text-gray-100" data-unique-id="11b1f5cc-9cfa-41cd-b78f-717aef37f4c2" data-file-name="app/admin/layout.tsx">
      <AdminSidebar />
      <motion.main initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.3
    }} className="flex-1 p-8" data-unique-id="656143db-6ecd-490e-9226-6500eda7f6eb" data-file-name="app/admin/layout.tsx" data-dynamic-text="true">
        {children}
      </motion.main>
    </div>;
}