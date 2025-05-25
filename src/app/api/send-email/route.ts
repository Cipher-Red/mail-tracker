import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import sgMail from '@sendgrid/mail';
import { rateLimit } from '@/lib/rate-limit';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const isPlaceholder = apiKey.includes('your_') || apiKey.includes('placeholder') || apiKey.includes('SG_');
  
  if (isPlaceholder) {
    console.error('SENDGRID_API_KEY appears to be a placeholder. Please set a real API key.');
  } else {
    sgMail.setApiKey(apiKey);
    console.log('SendGrid API initialized successfully');
  }
} else {
  console.error('SENDGRID_API_KEY is not set. Email sending will not work.');
}

// Create a test function to verify SendGrid connection
export async function testSendGridConnection(): Promise<boolean> {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      return false;
    }
    
    const apiKey = process.env.SENDGRID_API_KEY;
    if (apiKey.includes('your_') || apiKey.includes('placeholder') || apiKey.includes('SG_')) {
      return false;
    }
    
    // Set API key for testing
    sgMail.setApiKey(apiKey);
    
    // Get SendGrid account information to check if API key is valid
    // This doesn't send an actual email, just verifies the API key works
    try {
      // Use client.request() method instead of sgMail.request()
      const client = require('@sendgrid/client');
      client.setApiKey(apiKey);
      
      const [response] = await client.request({
        method: 'GET',
        url: '/v3/user/credits',
      });
      
      return response.statusCode >= 200 && response.statusCode < 300;
    } catch (error) {
      console.error('SendGrid connection test failed:', error);
      return false;
    }
  } catch (error) {
    console.error('Error testing SendGrid connection:', error);
    return false;
  }
}

// Define validation schema for email request
const EmailRequestSchema = z.object({
  to: z.string().email(),
  from: z.object({
    email: z.string().email(),
    name: z.string().min(1)
  }),
  subject: z.string().min(1),
  html: z.string().min(1),
  text: z.string().optional(),
});

// Define validation schema for bulk email request
const BulkEmailRequestSchema = z.object({
  emails: z.array(EmailRequestSchema).min(1).max(100),
});

// Create a limiter: 100 requests per IP per hour
const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500, // Max 500 users per interval
  limit: 100, // 100 requests per interval
});

export async function POST(req: NextRequest) {
  console.log('Email API route triggered');
  
  try {
    // Apply rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    try {
      await limiter.check(ip, 5); // Allow 5 requests per IP within the time window
    } catch (error) {
      console.error('Rate limit exceeded:', error);
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validationResult = BulkEmailRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { emails } = validationResult.data;

    // Check if SendGrid API key is configured
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SendGrid API key missing when attempting to send email');
      return NextResponse.json(
        { error: 'Email service not configured. Please add your SendGrid API key to the .env.local file.' },
        { status: 503 }
      );
    }
    
    // Check if API key is a placeholder
    const apiKey = process.env.SENDGRID_API_KEY;
    if (apiKey.includes('your_') || apiKey.includes('placeholder')) {
      console.error('SendGrid API key appears to be a placeholder');
      return NextResponse.json(
        { error: 'Email service has a placeholder API key. Please replace it with your actual SendGrid API key.' },
        { status: 503 }
      );
    }

    // Send emails in batches to avoid overwhelming the email service
    const batchSize = parseInt(process.env.EMAIL_BATCH_SIZE || '50'); // Default to 50 if not set
    const results = [];
      
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
        
      try {
        // For SendGrid, we can use personalizations for bulk sending
        // This is more efficient than sending individual emails
        const personalizations = batch.map(email => ({
          to: { email: email.to },
          subject: email.subject,
          substitutions: {
            // Add any custom variables needed
          }
        }));
          
        // Send a single request with multiple recipients
        const msg = {
          personalizations,
          from: {
            email: batch[0].from.email,
            name: batch[0].from.name
          },
          subject: batch[0].subject, // Default subject
          html: batch[0].html, // Default HTML
          text: batch[0].text || '', // Default text
          tracking_settings: {
            click_tracking: { enable: true },
            open_tracking: { enable: true }
          },
          mail_settings: {
            bypass_list_management: { enable: false }
          }
        };
          
        try {
          // Send the batch
          const [response] = await sgMail.send(msg);
            
          // Mark all emails in this batch as successful
          if (response.statusCode >= 200 && response.statusCode < 300) {
            batch.forEach(email => {
              results.push({
                email: email.to,
                status: 'success'
              });
            });
          }
        } catch (sendError: any) {
          // Handle SendGrid specific errors
          console.error('SendGrid API error:', sendError);
            
          if (sendError.response && sendError.response.body && sendError.response.body.errors) {
            const errorDetails = sendError.response.body.errors.map((err: any) => err.message).join('; ');
              
            // Mark all emails in the batch as failed with specific error
            batch.forEach(email => {
              results.push({
                email: email.to,
                status: 'failed',
                error: errorDetails
              });
            });
          } else {
            // Generic error handling
            batch.forEach(email => {
              results.push({
                email: email.to,
                status: 'failed',
                error: sendError.message || 'Unknown SendGrid error'
              });
            });
          }
        }
          
        // Add a small delay between batches to avoid rate limits
        if (i + batchSize < emails.length) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      } catch (error) {
        console.error('Error sending email batch:', error);
          
        // Mark all emails in the failed batch as failed
        batch.forEach(email => {
          results.push({
            email: email.to,
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        });
      }
    }

    // Return results
    return NextResponse.json({
      success: true,
      results,
      totalSent: results.filter(r => r.status === 'success').length,
      totalFailed: results.filter(r => r.status === 'failed').length,
    });
  } catch (error) {
    console.error('Error in email sending API:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
