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
  return <div className={`p-4 rounded-md border ${getColorClass()} flex items-start`} data-unique-id="f53c5a6c-1ecc-4368-8908-2c9edcd82a0a" data-file-name="lib/email-config-check.tsx">
      <div className="mr-3 mt-0.5" data-unique-id="c155b182-375f-4b27-aa5e-049a9575d70f" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">{renderIcon()}</div>
      <div data-unique-id="29697a83-4fcd-4e03-b5e5-d6e19cf617eb" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">
        <h3 className="font-medium text-sm" data-unique-id="8388ec50-6cb0-4822-b3a6-fd4aad1c0257" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="b4d3f266-76f5-4b74-aaab-f93067085d3d" data-file-name="lib/email-config-check.tsx">Email Configuration Status</span></h3>
        <p className="text-sm mt-1" data-unique-id="2a1ce661-f28a-4144-bbae-6fbc3d9ca8f0" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">{configStatus.message}</p>
        {(configStatus.sendgrid === 'missing' || configStatus.sendgrid === 'placeholder') && <div className="mt-2 text-sm" data-unique-id="73723af9-9bcd-4df0-a45a-320638af7db3" data-file-name="lib/email-config-check.tsx">
            <p data-unique-id="cad0742e-4708-4149-83ad-62774d1b3a76" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="d81d5d37-a0b8-457c-83af-ed021e41d407" data-file-name="lib/email-config-check.tsx">You have two options:</span></p>
            
            <div className="mt-2" data-unique-id="79dd716e-47be-47f1-9020-e9c0def0bd93" data-file-name="lib/email-config-check.tsx">
              <h4 className="font-medium" data-unique-id="26b66f39-27c1-4e6e-bd93-83b052218de4" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="4d99bf07-2a9f-4537-be05-4a146820b375" data-file-name="lib/email-config-check.tsx">Option 1: Configure SendGrid</span></h4>
              <ol className="list-decimal ml-5 mt-1 space-y-1" data-unique-id="c8642ea2-6e03-42dc-bdb6-0a4782a11589" data-file-name="lib/email-config-check.tsx">
                <li data-unique-id="3ebce35d-1542-48f6-b212-7f59b22dbc13" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="24f8dc3d-2fc4-43ff-b22f-5961bfb03f37" data-file-name="lib/email-config-check.tsx">Create a </span><a href="https://signup.sendgrid.com/" className="text-blue-600 hover:underline flex items-center inline-flex" target="_blank" rel="noopener noreferrer" data-unique-id="d94cdb39-e56b-4988-908c-305600250f45" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="33cf0636-e9dc-42b8-b35f-8e53f7b58e02" data-file-name="lib/email-config-check.tsx">SendGrid account </span><ExternalLink className="h-3 w-3 ml-1" /></a><span className="editable-text" data-unique-id="9a562329-f210-4b77-8093-95f00e90549b" data-file-name="lib/email-config-check.tsx"> if you don't have one</span></li>
                <li data-unique-id="67003512-3fb7-4089-b146-37c4b98b0c9c" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="07f6d123-844a-4011-9f56-1f7ce76ac6d8" data-file-name="lib/email-config-check.tsx">Get an API key from the SendGrid dashboard</span></li>
                <li data-unique-id="c64e114a-6706-4357-bc14-f5d9f1391a13" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="1ff359c9-6a18-4c88-9843-fc0c838d9479" data-file-name="lib/email-config-check.tsx">Add the API key to your .env.local file as SENDGRID_API_KEY</span></li>
                <li data-unique-id="5eff6307-22b2-4907-8008-10fb7eb1f2e5" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="ddb39da7-07ee-4eee-b8e2-3ada4914d953" data-file-name="lib/email-config-check.tsx">Restart your development server</span></li>
              </ol>
              <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono" data-unique-id="86aed420-2623-4bd6-964e-4057395b60d3" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="fa228117-3633-4b5a-85b1-e5ba255207ed" data-file-name="lib/email-config-check.tsx">
                SENDGRID_API_KEY=SG.your_actual_key_here_no_quotes
              </span></div>
            </div>
            
            <div className="mt-4" data-unique-id="d7e2e11e-9d01-42cf-8a45-3de4da819376" data-file-name="lib/email-config-check.tsx">
              <h4 className="font-medium" data-unique-id="f104a2a9-ed64-4ed3-9e83-6269638b9a2c" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="0aabe971-c884-4c2c-846c-9d152c90e719" data-file-name="lib/email-config-check.tsx">Option 2: Use Manual Email Sending</span></h4>
              <p className="text-sm mt-1" data-unique-id="8f2289cd-b4c9-4e21-9de4-19e9ca577d69" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="355073d4-e2ee-4e8b-b8a3-562335cf61ae" data-file-name="lib/email-config-check.tsx">
                You can use the manual email sending mode which doesn't require an API key. 
                This will let you review emails and send them through your own email client.
              </span></p>
            </div>
          </div>}
      </div>
    </div>;
}