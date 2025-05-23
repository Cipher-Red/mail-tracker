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
  return <div className={`p-4 rounded-md border ${getColorClass()} flex items-start`} data-unique-id="a8b07650-8a96-4c55-a73b-267c965e507e" data-file-name="lib/email-config-check.tsx">
      <div className="mr-3 mt-0.5" data-unique-id="b0655140-0144-47cd-bfcc-463ca6fbaa93" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">{renderIcon()}</div>
      <div data-unique-id="7b0a0716-1a0d-438f-a24e-e80a4f3c75aa" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">
        <h3 className="font-medium text-sm" data-unique-id="9ed30f22-71c2-416c-a4dc-28d99f8f2bdb" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="ee16d837-404f-47c7-bfd4-f8bac3d0ed79" data-file-name="lib/email-config-check.tsx">Email Configuration Status</span></h3>
        <p className="text-sm mt-1" data-unique-id="70d77fd8-f0f4-42fa-acf3-a910bcae761a" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">{configStatus.message}</p>
        {(configStatus.sendgrid === 'missing' || configStatus.sendgrid === 'placeholder') && <div className="mt-2 text-sm" data-unique-id="bfc0b019-4f89-4e3d-a9f1-a30ac5b711c2" data-file-name="lib/email-config-check.tsx">
            <p data-unique-id="fd73e299-8ea8-4b02-92ce-0bb93ce68aa1" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="9c85512d-2b28-45bf-85cc-e1ba3424c694" data-file-name="lib/email-config-check.tsx">You have two options:</span></p>
            
            <div className="mt-2" data-unique-id="760e1ccc-1a8d-4257-bbf1-2b4028c604aa" data-file-name="lib/email-config-check.tsx">
              <h4 className="font-medium" data-unique-id="8de4a240-7aec-4b62-b897-d43e7580ea43" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="91244115-5e54-4618-b8a2-badd65db6e20" data-file-name="lib/email-config-check.tsx">Option 1: Configure SendGrid</span></h4>
              <ol className="list-decimal ml-5 mt-1 space-y-1" data-unique-id="00a71025-a9e4-4af5-a317-f8bdfeaeae29" data-file-name="lib/email-config-check.tsx">
                <li data-unique-id="437f3b93-b8c9-43d2-b2af-efd089210fe4" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="7177c46f-707d-4a7b-9f56-347f93c11641" data-file-name="lib/email-config-check.tsx">Create a </span><a href="https://signup.sendgrid.com/" className="text-blue-600 hover:underline flex items-center inline-flex" target="_blank" rel="noopener noreferrer" data-unique-id="43583db9-899f-405c-9a4c-80b42631c7da" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="89484f60-c6d8-45c2-ae4b-ac8edd06b5a0" data-file-name="lib/email-config-check.tsx">SendGrid account </span><ExternalLink className="h-3 w-3 ml-1" /></a><span className="editable-text" data-unique-id="bd8f4bdd-412b-4c15-a71b-2475e7607082" data-file-name="lib/email-config-check.tsx"> if you don't have one</span></li>
                <li data-unique-id="790c475d-1d52-4615-b188-26148fccfc99" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="93d6c484-5e65-41b1-9b96-5472c02ea4dd" data-file-name="lib/email-config-check.tsx">Get an API key from the SendGrid dashboard</span></li>
                <li data-unique-id="bac6d9ac-d43b-45fd-8ce4-57e9a7f8a2d0" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="3fa39802-6c22-4c93-9912-7a8553d01c09" data-file-name="lib/email-config-check.tsx">Add the API key to your .env.local file as SENDGRID_API_KEY</span></li>
                <li data-unique-id="cc7ee6a1-5414-4b3f-94fe-d8a3885b3c3c" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="3789ea79-b9d1-47c9-a869-e000492465db" data-file-name="lib/email-config-check.tsx">Restart your development server</span></li>
              </ol>
              <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono" data-unique-id="5602f90f-ff4b-4e6e-b5f5-5acd8b3ae3f5" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="444bce9f-30bc-4c54-b98f-7f92a59157e8" data-file-name="lib/email-config-check.tsx">
                SENDGRID_API_KEY=SG.your_actual_key_here_no_quotes
              </span></div>
            </div>
            
            <div className="mt-4" data-unique-id="866904b8-9c7e-4362-974f-a3fc93761609" data-file-name="lib/email-config-check.tsx">
              <h4 className="font-medium" data-unique-id="470adf82-1015-4bd5-988b-44220777234e" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="b56ec3c7-1730-4f48-894b-bf71141155c3" data-file-name="lib/email-config-check.tsx">Option 2: Use Manual Email Sending</span></h4>
              <p className="text-sm mt-1" data-unique-id="b88f9c51-1c89-42dd-b733-3759e7274079" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="e2d70ac5-b56b-403c-8f83-7446629d9296" data-file-name="lib/email-config-check.tsx">
                You can use the manual email sending mode which doesn't require an API key. 
                This will let you review emails and send them through your own email client.
              </span></p>
            </div>
          </div>}
      </div>
    </div>;
}