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
  return <div className={`p-4 rounded-md border ${getColorClass()} flex items-start`} data-unique-id="aa70943b-c5a8-4a80-8d5c-f4af58486f50" data-file-name="lib/email-config-check.tsx">
      <div className="mr-3 mt-0.5" data-unique-id="4fcac7ff-17be-4a76-b07d-83c92820d2de" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">{renderIcon()}</div>
      <div data-unique-id="a84b8e30-eb89-47bf-9927-654a1f8a5cd2" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">
        <h3 className="font-medium text-sm" data-unique-id="eb01dcce-a81b-4868-b495-d56d262132c9" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="77708595-7266-435c-a66c-099b278b0a8d" data-file-name="lib/email-config-check.tsx">Email Configuration Status</span></h3>
        <p className="text-sm mt-1" data-unique-id="44c1b499-ad3a-40d4-9fb8-a5c817715a5d" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">{configStatus.message}</p>
        {(configStatus.sendgrid === 'missing' || configStatus.sendgrid === 'placeholder') && <div className="mt-2 text-sm" data-unique-id="9c77e88e-860a-425a-9f76-d255039a94f6" data-file-name="lib/email-config-check.tsx">
            <p data-unique-id="c997b155-780d-431a-95c2-de0ebb187bcc" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="334cc217-54ab-468c-9e79-84c5240eb634" data-file-name="lib/email-config-check.tsx">You have two options:</span></p>
            
            <div className="mt-2" data-unique-id="bb83cbd4-a670-4af3-8a74-f29286259336" data-file-name="lib/email-config-check.tsx">
              <h4 className="font-medium" data-unique-id="f9e2b383-97f3-4aa5-8a92-ffa6b76bf7fa" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="11d3a0d6-174a-4daf-b748-583779546d11" data-file-name="lib/email-config-check.tsx">Option 1: Configure SendGrid</span></h4>
              <ol className="list-decimal ml-5 mt-1 space-y-1" data-unique-id="986a42d2-d130-470a-a527-149317d71be5" data-file-name="lib/email-config-check.tsx">
                <li data-unique-id="6322c37f-8b0c-4960-be77-231ebc423e6e" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="2bd7551d-5704-4184-a276-8ad9140bc1ac" data-file-name="lib/email-config-check.tsx">Create a </span><a href="https://signup.sendgrid.com/" className="text-blue-600 hover:underline flex items-center inline-flex" target="_blank" rel="noopener noreferrer" data-unique-id="70801720-3eaa-4e27-b383-21db9f9e3524" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="25b5d7df-fe49-48e5-af98-b0d762dfd5c0" data-file-name="lib/email-config-check.tsx">SendGrid account </span><ExternalLink className="h-3 w-3 ml-1" /></a><span className="editable-text" data-unique-id="8c983746-b426-4525-b6a5-f2ab44d0c4a8" data-file-name="lib/email-config-check.tsx"> if you don't have one</span></li>
                <li data-unique-id="dbe00cf1-74eb-4fb6-8dbb-53e680c91356" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="23298581-d730-4346-b6c0-be7809b53e65" data-file-name="lib/email-config-check.tsx">Get an API key from the SendGrid dashboard</span></li>
                <li data-unique-id="87e9fc87-0f21-4b1a-9345-97e8c46b7ae4" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="2f79cc11-0512-4648-b450-4d522e8f7f4f" data-file-name="lib/email-config-check.tsx">Add the API key to your .env.local file as SENDGRID_API_KEY</span></li>
                <li data-unique-id="3ea667e5-d863-4cb1-a26e-c1a8351f799b" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="95fe507e-1ed2-427d-b783-77b9ee241e39" data-file-name="lib/email-config-check.tsx">Restart your development server</span></li>
              </ol>
              <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono" data-unique-id="860d00e2-351d-42ce-8458-0a98fd366af9" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="bf8a45c6-e5c1-43e0-9bc6-a3a87b4eac27" data-file-name="lib/email-config-check.tsx">
                SENDGRID_API_KEY=SG.your_actual_key_here_no_quotes
              </span></div>
            </div>
            
            <div className="mt-4" data-unique-id="aab208d2-cc84-4f55-9e4d-fb81c1985543" data-file-name="lib/email-config-check.tsx">
              <h4 className="font-medium" data-unique-id="bca62d62-3dc6-4bd1-a1d2-7ce70130e2d8" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="aa174bcf-75ef-4070-973c-97a7d68594a8" data-file-name="lib/email-config-check.tsx">Option 2: Use Manual Email Sending</span></h4>
              <p className="text-sm mt-1" data-unique-id="2769ae56-e2d1-4341-bd8a-cdb056f2f824" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="0cbd825a-1869-4d96-aedc-8b81ac9396d4" data-file-name="lib/email-config-check.tsx">
                You can use the manual email sending mode which doesn't require an API key. 
                This will let you review emails and send them through your own email client.
              </span></p>
            </div>
          </div>}
      </div>
    </div>;
}