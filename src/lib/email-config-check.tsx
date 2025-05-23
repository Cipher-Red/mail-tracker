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
  return <div className={`p-4 rounded-md border ${getColorClass()} flex items-start`} data-unique-id="92c599a8-d2d7-4658-90e5-8834369de19c" data-file-name="lib/email-config-check.tsx">
      <div className="mr-3 mt-0.5" data-unique-id="4bce8443-f604-43bb-9291-8ba1a48c84bc" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">{renderIcon()}</div>
      <div data-unique-id="558ad565-56d6-44e6-b469-dcf252a1645a" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">
        <h3 className="font-medium text-sm" data-unique-id="1a8bd759-2b6c-40ec-b823-4ac04f489bb3" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="9f4773b3-f420-480a-8f27-0a6a378c7e3f" data-file-name="lib/email-config-check.tsx">Email Configuration Status</span></h3>
        <p className="text-sm mt-1" data-unique-id="b42d57cc-a961-4b9b-be97-4e4e97abd72d" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">{configStatus.message}</p>
        {(configStatus.sendgrid === 'missing' || configStatus.sendgrid === 'placeholder') && <div className="mt-2 text-sm" data-unique-id="798cbabf-dd68-46ed-9d84-9eb8a0d26a12" data-file-name="lib/email-config-check.tsx">
            <p data-unique-id="f5b64b68-c68a-4c28-a2b2-1a0aabe78178" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="e773c6cb-329c-4bc5-9dd7-2d472eb7cb8d" data-file-name="lib/email-config-check.tsx">You have two options:</span></p>
            
            <div className="mt-2" data-unique-id="5afd2768-f0bc-4409-a98c-121efae0e76a" data-file-name="lib/email-config-check.tsx">
              <h4 className="font-medium" data-unique-id="515fc7c2-174e-420c-9796-c33c2d442dcd" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="c61116d6-6a91-4905-9727-7762f816896b" data-file-name="lib/email-config-check.tsx">Option 1: Configure SendGrid</span></h4>
              <ol className="list-decimal ml-5 mt-1 space-y-1" data-unique-id="90c51a99-000d-48a9-a9e0-32e2d5e93d64" data-file-name="lib/email-config-check.tsx">
                <li data-unique-id="bc93e6fe-de2a-4c9c-81bd-f105e08b4693" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="155ef84e-0faf-4478-bdb2-a6f7475c2f7a" data-file-name="lib/email-config-check.tsx">Create a </span><a href="https://signup.sendgrid.com/" className="text-blue-600 hover:underline flex items-center inline-flex" target="_blank" rel="noopener noreferrer" data-unique-id="5931c950-a1c6-4d16-8c58-62bded0ebed1" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="1a94ed52-1635-4dbe-ac0f-27fedc6bed9f" data-file-name="lib/email-config-check.tsx">SendGrid account </span><ExternalLink className="h-3 w-3 ml-1" /></a><span className="editable-text" data-unique-id="a4956ac9-39d3-49bc-a898-28cff89f623e" data-file-name="lib/email-config-check.tsx"> if you don't have one</span></li>
                <li data-unique-id="a592beb0-0228-4fcf-aa7f-8388dcb88c76" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="745c9a57-7503-401f-90fd-323535be516c" data-file-name="lib/email-config-check.tsx">Get an API key from the SendGrid dashboard</span></li>
                <li data-unique-id="9d556e64-bfd1-4835-884f-ceff75953c57" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="05b7156e-845c-41f3-b566-2d7cc0b95510" data-file-name="lib/email-config-check.tsx">Add the API key to your .env.local file as SENDGRID_API_KEY</span></li>
                <li data-unique-id="382a607a-7a8e-4930-b4ae-c90082e99e26" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="dd624bbe-e075-445c-b17c-63cabe87763e" data-file-name="lib/email-config-check.tsx">Restart your development server</span></li>
              </ol>
              <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono" data-unique-id="fe84df27-47b6-4cd0-a928-55c961d3447d" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="ab99da9a-b165-4e3e-a641-91e8e47a5e40" data-file-name="lib/email-config-check.tsx">
                SENDGRID_API_KEY=SG.your_actual_key_here_no_quotes
              </span></div>
            </div>
            
            <div className="mt-4" data-unique-id="202271b9-39dc-4ffe-8024-8dbf6c6b8eeb" data-file-name="lib/email-config-check.tsx">
              <h4 className="font-medium" data-unique-id="fe92bbab-002d-48a4-83c1-55ac55c500e8" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="cf698799-164c-486a-9784-ca12cb85c731" data-file-name="lib/email-config-check.tsx">Option 2: Use Manual Email Sending</span></h4>
              <p className="text-sm mt-1" data-unique-id="04a0e2b4-ff9b-4486-9b0e-c6548bac948d" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="03511908-b518-4735-919b-35a12b7dc097" data-file-name="lib/email-config-check.tsx">
                You can use the manual email sending mode which doesn't require an API key. 
                This will let you review emails and send them through your own email client.
              </span></p>
            </div>
          </div>}
      </div>
    </div>;
}