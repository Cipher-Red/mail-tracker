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
  return <div className={`p-4 rounded-md border ${getColorClass()} flex items-start`} data-unique-id="1ca9456d-f961-4b4c-ab0d-144874cda0ce" data-file-name="lib/email-config-check.tsx">
      <div className="mr-3 mt-0.5" data-unique-id="5f0459e7-695c-4707-a162-b9cefc6fefc3" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">{renderIcon()}</div>
      <div data-unique-id="f9d5fc6a-527a-47ba-a703-9afa6973f00d" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">
        <h3 className="font-medium text-sm" data-unique-id="6d2cf3ee-8826-409d-8aaf-af26725c5ec8" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="e922d8eb-13dd-467d-8ca8-f7545f60e432" data-file-name="lib/email-config-check.tsx">Email Configuration Status</span></h3>
        <p className="text-sm mt-1" data-unique-id="e620bc64-0da5-4acf-ac44-7142e09a58d3" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">{configStatus.message}</p>
        {(configStatus.sendgrid === 'missing' || configStatus.sendgrid === 'placeholder') && <div className="mt-2 text-sm" data-unique-id="cbd21020-ca5f-43f5-9215-0fde132902b5" data-file-name="lib/email-config-check.tsx">
            <p data-unique-id="08df100d-dd31-446a-bc3c-990ca16e4bf3" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="f0d90d02-6278-41d7-b19e-346377480850" data-file-name="lib/email-config-check.tsx">To fix this issue:</span></p>
            <ol className="list-decimal ml-5 mt-1 space-y-1" data-unique-id="147eef4b-2933-4643-a99c-2202e171bdc0" data-file-name="lib/email-config-check.tsx">
              <li data-unique-id="8649d75d-c906-413d-8402-635063b8e2ff" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="e2ee4f6a-9a22-41f7-91f0-15767a082116" data-file-name="lib/email-config-check.tsx">Create a </span><a href="https://signup.sendgrid.com/" className="text-blue-600 hover:underline flex items-center" target="_blank" rel="noopener noreferrer" data-unique-id="2ba9d9eb-4c9c-4a03-af3c-04880b863c7e" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="6b554585-b1a8-4a1a-89c1-a9f9cf6065a0" data-file-name="lib/email-config-check.tsx">SendGrid account </span><ExternalLink className="h-3 w-3 ml-1" /></a><span className="editable-text" data-unique-id="a7fd7661-dd25-47f1-97ed-83fb27171ee8" data-file-name="lib/email-config-check.tsx"> if you don't have one</span></li>
              <li data-unique-id="96c02ad9-8cb4-44c6-a81a-c22fc8dfd465" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="c082a868-76c7-45f1-9211-98725e18ab3d" data-file-name="lib/email-config-check.tsx">Get an API key from the SendGrid dashboard</span></li>
              <li data-unique-id="3136e0ac-6ff0-4a1a-9a1a-03fe83d7538d" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="bf1640a7-97c2-4120-924c-9d777a5b171e" data-file-name="lib/email-config-check.tsx">Add the API key to your .env.local file as SENDGRID_API_KEY</span></li>
              <li data-unique-id="f173a779-fc24-4ed2-95e9-6c5997ccefc4" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="43b79d43-cf2f-49a9-8c3b-2fad22d96949" data-file-name="lib/email-config-check.tsx">Restart your development server</span></li>
            </ol>
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono" data-unique-id="5e566f13-9220-44e9-996b-a726795eb734" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="c04983b2-f231-4626-98f8-b9a9020e4b2c" data-file-name="lib/email-config-check.tsx">
              SENDGRID_API_KEY=SG.your_actual_key_here_no_quotes
            </span></div>
          </div>}
      </div>
    </div>;
}