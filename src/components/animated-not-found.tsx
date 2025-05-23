'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
export default function AnimatedNotFound() {
  const {
    resolvedTheme
  } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
  return <div className="min-h-screen flex items-center justify-center bg-background" data-unique-id="a24d4266-0937-43a3-abcd-cfce3c3e57c9" data-file-name="components/animated-not-found.tsx">
      <div className="max-w-md w-full p-8" data-unique-id="3db1d59d-e8e6-4a61-b77c-5c8e2f8b2624" data-file-name="components/animated-not-found.tsx">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="text-center" data-unique-id="46a95cf3-51a2-4380-9703-6a43d59c51ba" data-file-name="components/animated-not-found.tsx">
          <h1 className="text-6xl font-bold text-primary" data-unique-id="42577433-a366-410d-8f61-d14038921c5f" data-file-name="components/animated-not-found.tsx"><span className="editable-text" data-unique-id="6121e6e3-836d-43f7-b7ce-70a058bc8ef6" data-file-name="components/animated-not-found.tsx">404</span></h1>
          <h2 className="text-2xl font-medium mt-4" data-unique-id="e10623f7-1056-4585-904d-9c4176796a52" data-file-name="components/animated-not-found.tsx"><span className="editable-text" data-unique-id="77f37406-e4b0-4bbd-a790-129bfe21e8af" data-file-name="components/animated-not-found.tsx">Page Not Found</span></h2>
          <p className="mt-4 text-muted-foreground" data-unique-id="70e6df83-8e05-45fa-8602-d9afe36ebf13" data-file-name="components/animated-not-found.tsx"><span className="editable-text" data-unique-id="ad63a8a6-d069-4d24-a3fa-da603f922221" data-file-name="components/animated-not-found.tsx">
            The page you are looking for doesn't exist or has been moved.
          </span></p>
          
          <Link href="/" className="mt-8 inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors" data-unique-id="a924749c-6f4b-49e1-ac82-7c777f372b48" data-file-name="components/animated-not-found.tsx">
            <ArrowLeft className="mr-2 h-4 w-4" /><span className="editable-text" data-unique-id="e917bee1-6abf-4974-b15f-467e2c77b278" data-file-name="components/animated-not-found.tsx">
            Back to Home
          </span></Link>
        </motion.div>
      </div>
    </div>;
}