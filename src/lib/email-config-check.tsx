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
  return <div className={`p-4 rounded-md border ${getColorClass()} flex items-start`} data-unique-id="74c95215-dc52-4391-9a76-db6488a66630" data-file-name="lib/email-config-check.tsx">
      <div className="mr-3 mt-0.5" data-unique-id="338d3f1e-2edf-4aaf-85a4-22a7efd2244f" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">{renderIcon()}</div>
      <div data-unique-id="494adf22-461c-4789-924f-4fa8b18e1c72" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">
        <h3 className="font-medium text-sm" data-unique-id="56065e4c-05f0-4916-ada2-1288681c0593" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="d67e345b-a3ad-4f15-8ec1-ebb954a91f57" data-file-name="lib/email-config-check.tsx">Email Configuration Status</span></h3>
        <p className="text-sm mt-1" data-unique-id="c9050d51-f600-4282-8734-b1f1a2505d74" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">{configStatus.message}</p>
        {(configStatus.sendgrid === 'missing' || configStatus.sendgrid === 'placeholder') && <div className="mt-2 text-sm" data-unique-id="d26e6c8d-30d0-4397-9f82-da426868dbab" data-file-name="lib/email-config-check.tsx">
            <p data-unique-id="ecab8bbe-7b4b-4afd-8bfe-e5e411da43d5" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="03649ac6-473d-42e1-9436-a0bf03869dff" data-file-name="lib/email-config-check.tsx">You have two options:</span></p>
            
            <div className="mt-2" data-unique-id="f4292802-5981-4874-bed8-a3f0c9644408" data-file-name="lib/email-config-check.tsx">
              <h4 className="font-medium" data-unique-id="81fac3b9-8404-4f3f-af8e-e195b165f7da" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="8223b880-f9de-41e0-98dd-afbf0d5fda3d" data-file-name="lib/email-config-check.tsx">Option 1: Configure SendGrid</span></h4>
              <ol className="list-decimal ml-5 mt-1 space-y-1" data-unique-id="82774d51-a9a9-4c1e-a837-99a1d2c50a62" data-file-name="lib/email-config-check.tsx">
                <li data-unique-id="2c42e719-4382-4ea9-9dfb-9e472e8e4ed1" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="40475a64-a9e8-4b0c-a973-89ea4c4e0c6d" data-file-name="lib/email-config-check.tsx">Create a </span><a href="https://signup.sendgrid.com/" className="text-blue-600 hover:underline flex items-center inline-flex" target="_blank" rel="noopener noreferrer" data-unique-id="69ac7ef0-c708-4eb7-a2e4-8449809817b8" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="57ad21b6-0e22-4e51-8ed6-88aad4331b8c" data-file-name="lib/email-config-check.tsx">SendGrid account </span><ExternalLink className="h-3 w-3 ml-1" /></a><span className="editable-text" data-unique-id="60b49984-02e1-40b1-9faa-9d47943baefc" data-file-name="lib/email-config-check.tsx"> if you don't have one</span></li>
                <li data-unique-id="e8b1b259-70c0-494d-9219-28737c0578eb" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="09640316-903a-41a2-80d0-258faf4e3519" data-file-name="lib/email-config-check.tsx">Get an API key from the SendGrid dashboard</span></li>
                <li data-unique-id="353059fb-eb1d-46d0-8929-ddeee3f95d4e" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="e6e0e800-e8e7-440f-a5f6-b156c7e26358" data-file-name="lib/email-config-check.tsx">Add the API key to your .env.local file as SENDGRID_API_KEY</span></li>
                <li data-unique-id="17d17c0e-4e70-461e-be46-702ff6be2649" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="ab198cf5-7356-476e-81bd-db959c87c383" data-file-name="lib/email-config-check.tsx">Restart your development server</span></li>
              </ol>
              <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono" data-unique-id="517d3fdf-a230-4f18-956d-2b1147b0a001" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="1bfbb627-68fc-47f6-b80c-ce48d40a9a95" data-file-name="lib/email-config-check.tsx">
                SENDGRID_API_KEY=SG.your_actual_key_here_no_quotes
              </span></div>
            </div>
            
            <div className="mt-4" data-unique-id="4979b0f1-d22e-4a05-8c1c-a043eb4848ad" data-file-name="lib/email-config-check.tsx">
              <h4 className="font-medium" data-unique-id="4f98fa67-43ab-495c-823b-5605e95f89ff" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="9b97a089-c731-4903-895b-23032925c921" data-file-name="lib/email-config-check.tsx">Option 2: Use Manual Email Sending</span></h4>
              <p className="text-sm mt-1" data-unique-id="b48f2557-9acd-4a7c-8c1d-6ea52969b02d" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="55a9c65c-e46d-40ac-8090-c6b186c5aa05" data-file-name="lib/email-config-check.tsx">
                You can use the manual email sending mode which doesn't require an API key. 
                This will let you review emails and send them through your own email client.
              </span></p>
            </div>
          </div>}
      </div>
    </div>;
}