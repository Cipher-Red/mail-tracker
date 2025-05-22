import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import sgMail from '@sendgrid/mail';
import { rateLimit } from '@/lib/rate-limit';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const isPlaceholder = apiKey.includes('your_') || apiKey.includes('placeholder');
  
  if (isPlaceholder) {
    console.error('SENDGRID_API_KEY appears to be a placeholder. Please set a real API key.');
  } else {
    sgMail.setApiKey(apiKey);
    console.log('SendGrid API initialized successfully');
  }
} else {
  console.error('SENDGRID_API_KEY is not set. Email sending will not work.');
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
    const batchSize = 10;
    const results = [];
    
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      
      try {
        // Send emails in parallel within each batch
        const batchPromises = batch.map(email => 
          sgMail.send({
            to: email.to,
            from: {
              email: email.from.email,
              name: email.from.name
            },
            subject: email.subject,
            html: email.html,
            text: email.text || '',
          })
        );
        
        const batchResults = await Promise.allSettled(batchPromises);
        
        // Process results
        batchResults.forEach((result, index) => {
          const emailIndex = i + index;
          if (result.status === 'fulfilled') {
            results.push({
              email: emails[emailIndex].to,
              status: 'success'
            });
          } else {
            results.push({
              email: emails[emailIndex].to,
              status: 'failed',
              error: result.reason?.message || 'Unknown error'
            });
          }
        });
        
        // Add a small delay between batches to avoid rate limits
        if (i + batchSize < emails.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
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
