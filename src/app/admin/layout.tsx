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
    return <div className="min-h-screen flex items-center justify-center bg-gray-900" data-unique-id="85f7367e-736f-4b05-adaa-23089a8ca4e2" data-file-name="app/admin/layout.tsx">
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
    return <div className="min-h-screen flex items-center justify-center bg-gray-900" data-unique-id="2777f353-a6e5-4888-90ed-626f3393f693" data-file-name="app/admin/layout.tsx">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
      </div>;
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center" data-unique-id="d1a1f47c-3d3b-4ba4-8a7b-59de80c94926" data-file-name="app/admin/layout.tsx">
        <AdminLoginForm />
      </div>;
  }

  // Render admin layout with sidebar for authenticated users
  return <div className="flex min-h-screen bg-gray-900 text-gray-100" data-unique-id="49e347ba-d6c9-49d0-a475-28e660304e78" data-file-name="app/admin/layout.tsx">
      <AdminSidebar />
      <motion.main initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.3
    }} className="flex-1 p-8" data-unique-id="1d6e7b9b-882b-49ff-85ec-a0d86a9da0ab" data-file-name="app/admin/layout.tsx" data-dynamic-text="true">
        {children}
      </motion.main>
    </div>;
}