'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
export default function EmailConfigCheck() {
  const [configStatus, setConfigStatus] = useState<{
    sendgrid: 'checking' | 'configured' | 'missing' | 'placeholder' | 'error';
    message: string;
  }>({
    sendgrid: 'checking',
    message: 'Checking SendGrid configuration...'
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const checkConfiguration = async () => {
    try {
      setConfigStatus({
        sendgrid: 'checking',
        message: 'Checking SendGrid configuration...'
      });

      // API call to check SendGrid configuration
      const response = await fetch('/api/email-config-check');
      const data = await response.json();
      if (data.configured) {
        setConfigStatus({
          sendgrid: 'configured',
          message: 'SendGrid is properly configured for bulk email sending.'
        });
      } else if (data.placeholder) {
        setConfigStatus({
          sendgrid: 'placeholder',
          message: 'SendGrid API key appears to be a placeholder. Please replace it with your actual API key.'
        });
      } else {
        setConfigStatus({
          sendgrid: 'missing',
          message: 'SendGrid API key is not configured. You can still use manual email sending mode.'
        });
      }
    } catch (error) {
      setConfigStatus({
        sendgrid: 'error',
        message: 'Failed to check email configuration. You can still use manual email sending mode.'
      });
    } finally {
      setIsVerifying(false);
    }
  };
  const verifyConnection = async () => {
    try {
      setIsVerifying(true);
      const response = await fetch('/api/email-config-check?test=true');
      const data = await response.json();
      if (data.testSuccess) {
        setConfigStatus({
          sendgrid: 'configured',
          message: 'SendGrid connection verified successfully! You can now send bulk emails.'
        });
      } else {
        setConfigStatus({
          sendgrid: 'error',
          message: 'SendGrid connection test failed. Please check your API key.'
        });
      }
    } catch (error) {
      setConfigStatus({
        sendgrid: 'error',
        message: 'Error testing SendGrid connection. Please try again.'
      });
    } finally {
      setIsVerifying(false);
    }
  };
  useEffect(() => {
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
  return <div className={`p-4 rounded-md border ${getColorClass()} flex items-start`} data-unique-id="e4afff6a-b783-4fb0-8583-d8158963e345" data-file-name="lib/email-config-check.tsx">
      <div className="mr-3 mt-0.5" data-unique-id="871085e4-51da-4497-9cff-ae641c98425a" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">{renderIcon()}</div>
      <div className="flex-1" data-unique-id="c0face59-168a-4b00-a618-92e75095edbb" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">
        <div className="flex justify-between items-center" data-unique-id="d600b70d-2d3c-407e-9c67-6aad9642d068" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">
          <h3 className="font-medium text-sm" data-unique-id="1223706d-ee47-425f-be6b-bfdea24841f8" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="781cd6bf-3332-43b0-8aa7-672a4ab5a87a" data-file-name="lib/email-config-check.tsx">Email Configuration Status</span></h3>
          {configStatus.sendgrid === 'configured' && <button onClick={verifyConnection} disabled={isVerifying} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded flex items-center hover:bg-primary/20 transition-colors disabled:opacity-50" data-unique-id="e54746f6-e93c-49f5-8ec2-d1e66d8b67b5" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">
              {isVerifying ? <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> : <CheckCircle2 className="h-3 w-3 mr-1" />}<span className="editable-text" data-unique-id="e4dcd16d-4095-4ca3-91e8-2da5fa2f75f0" data-file-name="lib/email-config-check.tsx">
              Verify Connection
            </span></button>}
        </div>
        <p className="text-sm mt-1" data-unique-id="55dbad43-694e-4a16-9805-315108d2d425" data-file-name="lib/email-config-check.tsx" data-dynamic-text="true">{configStatus.message}</p>
        
        {(configStatus.sendgrid === 'missing' || configStatus.sendgrid === 'placeholder') && <div className="mt-2 text-sm" data-unique-id="67f430fa-ca27-4f2f-a1e6-3782cbc0b3c6" data-file-name="lib/email-config-check.tsx">
            <p data-unique-id="5b8576a1-9bbc-4aaf-b61e-3da6e7765f0e" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="4b3e6a42-c4f4-4a4a-91d1-5075319c536e" data-file-name="lib/email-config-check.tsx">You have two options:</span></p>
            
            <div className="mt-2 border-l-2 border-blue-500 pl-3" data-unique-id="39d8addb-bfa0-48e7-a3ab-bb45557bbbb2" data-file-name="lib/email-config-check.tsx">
              <h4 className="font-medium text-blue-700" data-unique-id="533161fd-ae4e-48f1-9de4-c2e326a5a1f4" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="fd84f209-6467-4898-a8dc-06e98ad0ca89" data-file-name="lib/email-config-check.tsx">Option 1: Configure SendGrid for Bulk Emails</span></h4>
              <ol className="list-decimal ml-5 mt-1 space-y-1" data-unique-id="e2f5536e-628e-4990-aec5-40aa59af5f30" data-file-name="lib/email-config-check.tsx">
                <li data-unique-id="e6df8783-d921-4ec8-a569-a507dc308277" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="362abbbc-33c8-4445-9f84-165f5df393ac" data-file-name="lib/email-config-check.tsx">Create a </span><a href="https://signup.sendgrid.com/" className="text-blue-600 hover:underline flex items-center inline-flex" target="_blank" rel="noopener noreferrer" data-unique-id="da3a9fd3-b757-4fd3-a44b-53b51c0b6a65" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="cd69dcfb-130a-4367-b123-9fcc12f76c4b" data-file-name="lib/email-config-check.tsx">SendGrid account </span><ExternalLink className="h-3 w-3 ml-1" /></a><span className="editable-text" data-unique-id="0b00c85e-d806-4fdf-9be7-ce506197b6b1" data-file-name="lib/email-config-check.tsx"> if you don't have one</span></li>
                <li data-unique-id="2feff8e4-a478-458c-a64d-02b7fe060f8b" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="56888855-2f52-4a04-adc4-d10962f8925c" data-file-name="lib/email-config-check.tsx">Get an API key with Mail Send permissions from the SendGrid dashboard</span></li>
                <li data-unique-id="85d5e396-8374-46b2-993c-49b1732796e8" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="4b2451d9-229b-43bb-946d-31d5bb5c67a4" data-file-name="lib/email-config-check.tsx">Add the API key to your .env.local file as SENDGRID_API_KEY</span></li>
                <li data-unique-id="b5e3636b-a58d-4cf7-bcd5-56c8d2a67f43" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="019307fd-931a-4710-9632-07746b0575d1" data-file-name="lib/email-config-check.tsx">Restart your development server</span></li>
              </ol>
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs font-mono" data-unique-id="250cc260-7016-4527-a417-1246092001b2" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="7a9c35d7-501e-4275-8eda-b0bfe13ccc54" data-file-name="lib/email-config-check.tsx">
                SENDGRID_API_KEY=SG.your_actual_key_here_no_quotes
              </span></div>
              <a href="https://docs.sendgrid.com/ui/account-and-settings/api-keys" target="_blank" rel="noopener noreferrer" className="mt-2 text-xs text-blue-600 hover:underline flex items-center w-fit" data-unique-id="88fa9cea-0e7f-4a2d-990d-ced116ded951" data-file-name="lib/email-config-check.tsx">
                <ExternalLink className="h-3 w-3 mr-1" /><span className="editable-text" data-unique-id="1c7a1a97-3596-43e2-84d8-044003ba1239" data-file-name="lib/email-config-check.tsx">
                Learn how to create SendGrid API keys
              </span></a>
            </div>
            
            <div className="mt-4 border-l-2 border-amber-500 pl-3" data-unique-id="8ea60489-13b0-4e7c-b02f-1e377cc71897" data-file-name="lib/email-config-check.tsx">
              <h4 className="font-medium text-amber-700" data-unique-id="c7f555a3-c295-43e6-be69-ebeb5c0f24d9" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="cd9f9cbe-4b2a-47ae-9dd9-acf2c521fad7" data-file-name="lib/email-config-check.tsx">Option 2: Use Manual Email Sending</span></h4>
              <p className="text-sm mt-1" data-unique-id="6b6871d3-9789-4c22-9a81-3dc58479065c" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="16ea2c63-2ef9-4f55-9b2f-dccc1769fbdb" data-file-name="lib/email-config-check.tsx">
                You can use the manual email sending mode which doesn't require an API key. 
                This will let you review emails and send them through your own email client.
              </span></p>
              <p className="text-xs mt-2 text-amber-600" data-unique-id="1849c8f4-6982-47b0-a7f2-e41fed7abfbc" data-file-name="lib/email-config-check.tsx"><span className="editable-text" data-unique-id="b065f54d-b9e8-443e-a890-891da17078a7" data-file-name="lib/email-config-check.tsx">
                With manual mode, tracking links will be properly preserved when copied.
              </span></p>
            </div>
          </div>}
      </div>
    </div>;
}