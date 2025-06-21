'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
export default function EmailConfigCheck() {
  const [isVerifying, setIsVerifying] = useState(false);
  const checkConfiguration = async () => {
    try {
      // Show checking toast
      const checkingToastId = toast.loading('Checking email configuration...');

      // API call to check SendGrid configuration
      const response = await fetch('/api/email-config-check');
      const data = await response.json();
      toast.dismiss(checkingToastId);
      if (data.configured) {
        toast.success('SendGrid is properly configured for bulk email sending.', {
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
          duration: 4000
        });
      } else if (data.placeholder) {
        toast.error('SendGrid API key appears to be a placeholder. Please replace it with your actual API key.', {
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          duration: 5000
        });
      } else {
        toast.error('SendGrid API key is not configured. You can still use manual email sending mode.', {
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          duration: 5000
        });
      }
    } catch (error) {
      toast.error('Failed to check email configuration. You can still use manual email sending mode.', {
        icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
        duration: 5000
      });
    } finally {
      setIsVerifying(false);
    }
  };
  const verifyConnection = async () => {
    try {
      setIsVerifying(true);
      const verifyToastId = toast.loading('Verifying SendGrid connection...');
      const response = await fetch('/api/email-config-check?test=true');
      const data = await response.json();
      toast.dismiss(verifyToastId);
      if (data.testSuccess) {
        toast.success('SendGrid connection verified successfully! You can now send bulk emails.', {
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
          duration: 4000
        });
      } else {
        toast.error('SendGrid connection test failed. Please check your API key.', {
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          duration: 5000
        });
      }
    } catch (error) {
      toast.error('Error testing SendGrid connection. Please try again.', {
        icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
        duration: 5000
      });
    } finally {
      setIsVerifying(false);
    }
  };
  useEffect(() => {
    // Run configuration check when component mounts
    checkConfiguration();
  }, []);
  return <>
      <Toaster position="top-center" toastOptions={{
      className: 'bg-card text-card-foreground',
      style: {
        border: '1px solid rgba(var(--border), 0.2)',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        padding: '0.75rem 1rem',
        maxWidth: '24rem'
      }
    }} />
      
      <div className="flex justify-end mb-4" data-unique-id="4824dd9c-66d8-4d38-947a-a485a74a9121" data-file-name="lib/email-config-check.tsx">
        <button onClick={verifyConnection} disabled={isVerifying} className="text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-md flex items-center hover:bg-primary/20 transition-colors disabled:opacity-50" data-unique-id="04f71441-64cf-475e-a443-69c37a51a59b" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">
          {isVerifying ? <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />}
          <span className="editable-text" data-unique-id="40b20591-45ff-47fb-b131-841e33df444e" data-file-name="lib/email-config-check.tsx">Verify Email Connection</span>
        </button>
      </div>
    </>;
}