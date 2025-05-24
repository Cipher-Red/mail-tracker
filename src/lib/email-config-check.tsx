'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
export default function EmailConfigCheck() {
  const [configStatus, setConfigStatus] = useState<{
    sendgrid: 'checking' | 'configured' | 'missing' | 'placeholder' | 'error';
    message: string;
  }>({
    sendgrid: 'checking',
    message: 'Checking SendGrid configuration...'
  });
  useEffect(() => {
    const checkConfiguration = async () => {
      try {
        // Check if the API is properly configured
        const response = await fetch('/api/email-config-check', {
          method: 'GET'
        });
        const result = await response.json();
        if (response.ok && result.configured) {
          setConfigStatus({
            sendgrid: 'configured',
            message: 'SendGrid API is properly configured.'
          });
        } else if (result.message && result.message.includes('placeholder')) {
          setConfigStatus({
            sendgrid: 'placeholder',
            message: 'Your SendGrid API key is still set to the placeholder value.'
          });
        } else {
          setConfigStatus({
            sendgrid: 'missing',
            message: result.message || 'SendGrid API key is missing or invalid.'
          });
        }
      } catch (error) {
        setConfigStatus({
          sendgrid: 'error',
          message: 'Failed to check SendGrid configuration. API route may not be available.'
        });
      }
    };
    checkConfiguration();
  }, []);
  const renderIcon = () => {
    switch (configStatus.sendgrid) {
      case 'configured':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'missing':
      case 'placeholder':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-blue-500 animate-pulse" />;
    }
  };
  const getColorClass = () => {
    switch (configStatus.sendgrid) {
      case 'configured':
        return 'bg-green-50 border-green-200';
      case 'missing':
      case 'placeholder':
        return 'bg-red-50 border-red-200';
      case 'error':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };
  return <div className={`p-4 rounded-md border ${getColorClass()} flex items-start`} data-unique-id="7c408bba-7ba5-4160-becf-ec6c1f196e2d" data-file-name="lib/email-config-check.tsx">
      <div className="mr-3 mt-0.5" data-unique-id="52a0ee53-f773-4b5f-858a-b35444824741" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">{renderIcon()}</div>
      <div data-unique-id="47baee84-0288-4b3c-8755-4fa22635ae2d" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">
        <h3 className="font-medium text-sm" data-unique-id="205cf2e5-15d1-4c9e-9b2e-7e3be8a8181a" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="fe5632b4-552c-4e33-94f7-d1c11840d62c" data-file-name="lib/email-config-check.tsx">Email Configuration Status</span></h3>
        <p className="text-sm mt-1" data-unique-id="df28bab8-7a3a-4eb7-8f7c-2e32830baa39" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">{configStatus.message}</p>
        {(configStatus.sendgrid === 'missing' || configStatus.sendgrid === 'placeholder') && <div className="mt-2 text-sm" data-unique-id="0fe19e71-cf4b-487d-8130-bb18c63abccc" data-file-name="lib/email-config-check.tsx">
            <p data-unique-id="76501b00-80c6-42f0-a0b8-308d4d9e0113" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="7a32ccb8-8b99-45c3-969e-360e8691d37a" data-file-name="lib/email-config-check.tsx">You have two options:</span></p>
            
            <div className="mt-2" data-unique-id="f8c19a80-e917-4bb3-b43e-7241d598b4e6" data-file-name="lib/email-config-check.tsx">
              <h4 className="font-medium" data-unique-id="b4b59f63-b107-4624-a1d2-0fbe12ce81d3" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="63a89c4b-38e6-4556-95c8-e92a80cad365" data-file-name="lib/email-config-check.tsx">Option 1: Configure SendGrid</span></h4>
              <ol className="list-decimal ml-5 mt-1 space-y-1" data-unique-id="bbf60155-bca0-4c7c-b7a5-606ef6b6cbdf" data-file-name="lib/email-config-check.tsx">
                <li data-unique-id="caf901d4-0c14-4943-8354-f3cbac39d2fc" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="3fac6614-8b8a-4fc8-9a70-f85eac497c67" data-file-name="lib/email-config-check.tsx">Create a </span><a href="https://signup.sendgrid.com/" className="text-blue-600 hover:underline flex items-center inline-flex" target="_blank" rel="noopener noreferrer" data-unique-id="27359296-2e10-4bdb-a1de-3e09ece905f8" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="74e9b09f-3309-48f7-a50e-4d2cbd4170f0" data-file-name="lib/email-config-check.tsx">SendGrid account </span><ExternalLink className="h-3 w-3 ml-1" /></a><span className="editable-text" data-unique-id="d090f5ff-9e55-403c-8df6-ebb1263485a6" data-file-name="lib/email-config-check.tsx"> if you don't have one</span></li>
                <li data-unique-id="459ae57f-1b78-41de-8e08-1fc212bf5aa1" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="767b1f0a-1626-4e11-b209-92f93269b0a0" data-file-name="lib/email-config-check.tsx">Get an API key from the SendGrid dashboard</span></li>
                <li data-unique-id="ed9892b4-138a-430d-bdfa-47051b275139" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="46cf29b6-142b-4533-9daf-7b6467100fea" data-file-name="lib/email-config-check.tsx">Add the API key to your .env.local file as SENDGRID_API_KEY</span></li>
                <li data-unique-id="8946a880-96de-4a69-ba99-16fdf5a01163" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="4cc9a153-bba1-4276-ac43-e7711aa6c764" data-file-name="lib/email-config-check.tsx">Restart your development server</span></li>
              </ol>
              <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono" data-unique-id="7ba7ae53-ba35-49d2-85d6-d4d7a9839050" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="785bcbb5-4fee-4a09-9c24-0037c6917b55" data-file-name="lib/email-config-check.tsx">
                SENDGRID_API_KEY=SG.your_actual_key_here_no_quotes
              </span></div>
            </div>
            
            <div className="mt-4" data-unique-id="42d0517a-29a1-432e-99e3-c46422e43be1" data-file-name="lib/email-config-check.tsx">
              <h4 className="font-medium" data-unique-id="d3d1bb14-b00f-46e8-bd7f-44f14c9ccdf5" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="da1f1474-88a9-4586-b9c9-39dc2f1b6645" data-file-name="lib/email-config-check.tsx">Option 2: Use Manual Email Sending</span></h4>
              <p className="text-sm mt-1" data-unique-id="cad072b6-1250-44f2-8b54-caeb3cc51476" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="8a691c24-bdb4-44db-b274-edd1bf6eb5e2" data-file-name="lib/email-config-check.tsx">
                You can use the manual email sending mode which doesn't require an API key. 
                This will let you review emails and send them through your own email client.
              </span></p>
            </div>
          </div>}
      </div>
    </div>;
}