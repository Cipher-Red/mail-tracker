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
  return <div className={`p-4 rounded-md border ${getColorClass()} flex items-start`} data-unique-id="d3d4570d-0ffa-4007-8daa-25ce80de1dde" data-file-name="lib/email-config-check.tsx">
      <div className="mr-3 mt-0.5" data-unique-id="bcb457d6-6625-46ff-8325-4c257f72eb63" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">{renderIcon()}</div>
      <div data-unique-id="4b748cc9-7949-43a9-a034-3b742a5ee5e6" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">
        <h3 className="font-medium text-sm" data-unique-id="3caba7eb-bd08-48f6-a9f3-54aaede04838" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="b3319477-be16-4057-821d-bb3b2e1ebd48" data-file-name="lib/email-config-check.tsx">Email Configuration Status</span></h3>
        <p className="text-sm mt-1" data-unique-id="c86cb530-d655-4a2a-9aab-3ae3b439a72f" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">{configStatus.message}</p>
        {(configStatus.sendgrid === 'missing' || configStatus.sendgrid === 'placeholder') && <div className="mt-2 text-sm" data-unique-id="5d0792e3-0595-443b-b33f-2fdad72fb34a" data-file-name="lib/email-config-check.tsx">
            <p data-unique-id="02720deb-9068-4293-97cb-ce6eb0436ed5" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="afd020c4-12b8-4604-bd3f-632e7ab34a50" data-file-name="lib/email-config-check.tsx">You have two options:</span></p>
            
            <div className="mt-2" data-unique-id="c1ea3797-715f-4124-affc-964bbf534103" data-file-name="lib/email-config-check.tsx">
              <h4 className="font-medium" data-unique-id="d87a0b3a-0cf5-4773-8e3f-f2e75305a6e4" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="826944a5-df4a-4694-b8b1-7489889b46f1" data-file-name="lib/email-config-check.tsx">Option 1: Configure SendGrid</span></h4>
              <ol className="list-decimal ml-5 mt-1 space-y-1" data-unique-id="75cac6c4-a8b8-4ca7-b517-6abe46f06f37" data-file-name="lib/email-config-check.tsx">
                <li data-unique-id="934477ea-8765-45c0-a279-ea9256ffc78d" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="bfd1958f-926b-421c-907a-8fd0428031ee" data-file-name="lib/email-config-check.tsx">Create a </span><a href="https://signup.sendgrid.com/" className="text-blue-600 hover:underline flex items-center inline-flex" target="_blank" rel="noopener noreferrer" data-unique-id="99da483b-99f9-4727-8bf1-2ba89faf3edf" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="53654502-db97-4b77-b264-a8913d6ff8da" data-file-name="lib/email-config-check.tsx">SendGrid account </span><ExternalLink className="h-3 w-3 ml-1" /></a><span className="editable-text" data-unique-id="55d87f45-d2e3-4b4d-8e7a-a57ddd563e7b" data-file-name="lib/email-config-check.tsx"> if you don't have one</span></li>
                <li data-unique-id="a8430bf3-a995-4e7c-85f6-343e266be3fb" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="7688f81e-cac5-40ef-a84e-80ea8be8f2ae" data-file-name="lib/email-config-check.tsx">Get an API key from the SendGrid dashboard</span></li>
                <li data-unique-id="a04bfb61-4212-4622-bf36-8aa6604b2286" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="b5316445-d4e6-42a2-80c8-9e37620ea33d" data-file-name="lib/email-config-check.tsx">Add the API key to your .env.local file as SENDGRID_API_KEY</span></li>
                <li data-unique-id="104e56c4-b7b8-4142-894a-d9fbc44a0667" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="e20b7c8d-1c55-4d83-81a5-b2191d675cfd" data-file-name="lib/email-config-check.tsx">Restart your development server</span></li>
              </ol>
              <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono" data-unique-id="85515eb4-c50d-4385-a619-ea0b75e0e487" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="7e0917b6-c3a4-4ac0-98fb-387b577f1d09" data-file-name="lib/email-config-check.tsx">
                SENDGRID_API_KEY=SG.your_actual_key_here_no_quotes
              </span></div>
            </div>
            
            <div className="mt-4" data-unique-id="f0263aac-38f1-4dee-b53c-6d6eb5ce1b76" data-file-name="lib/email-config-check.tsx">
              <h4 className="font-medium" data-unique-id="fa890b31-89fd-49ab-a12e-c468aa04a86c" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="7e4f50c0-f0a3-42c7-a759-dda3fd530ae5" data-file-name="lib/email-config-check.tsx">Option 2: Use Manual Email Sending</span></h4>
              <p className="text-sm mt-1" data-unique-id="88d0144d-6e1e-4d01-82e4-01c48d5b5707" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="c862d940-cd3c-408f-bd28-8b31f7507814" data-file-name="lib/email-config-check.tsx">
                You can use the manual email sending mode which doesn't require an API key. 
                This will let you review emails and send them through your own email client.
              </span></p>
            </div>
          </div>}
      </div>
    </div>;
}