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
    return <div className="min-h-screen flex items-center justify-center bg-gray-900" data-unique-id="df15317e-573a-4aa7-885f-388894f7b7e8" data-file-name="app/admin/layout.tsx">
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
    return <div className="min-h-screen flex items-center justify-center bg-gray-900" data-unique-id="aa743b26-faa8-4ef4-8318-8677ec2d7c6c" data-file-name="app/admin/layout.tsx">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
      </div>;
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center" data-unique-id="99a7244f-1cbe-4f7f-9644-e5ca055ed6f2" data-file-name="app/admin/layout.tsx">
        <AdminLoginForm />
      </div>;
  }

  // Render admin layout with sidebar for authenticated users
  return <div className="flex min-h-screen bg-gray-900 text-gray-100" data-unique-id="32a9ad34-cffd-4f3c-a5b9-c35d2c10472e" data-file-name="app/admin/layout.tsx">
      <AdminSidebar />
      <motion.main initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.3
    }} className="flex-1 p-8" data-unique-id="2020b079-2861-43a8-8460-cf7f2fd5c128" data-file-name="app/admin/layout.tsx" data-dynamic-text="true">
        {children}
      </motion.main>
    </div>;
}