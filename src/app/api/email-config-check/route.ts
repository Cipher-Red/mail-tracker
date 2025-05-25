import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import { testSendGridConnection } from '../send-email/route';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const testConnection = searchParams.get('test') === 'true';
    
    const apiKey = process.env.SENDGRID_API_KEY;
    const hasApiKey = !!apiKey;
    const isPlaceholder = apiKey && (
      apiKey === 'SG.your_sendgrid_api_key_here' || 
      apiKey === 'SG_your_sendgrid_api_key_here' ||
      apiKey === 'SG.your_actual_api_key_here' ||
      apiKey.includes('your_') ||
      apiKey.includes('placeholder') ||
      apiKey.includes('SG_')
    );
    
    // If we need to test the connection
    if (testConnection) {
      if (!hasApiKey || isPlaceholder) {
        return NextResponse.json({
          configured: false,
          testSuccess: false,
          message: 'Cannot test connection: No valid API key configured'
        });
      }
      
      const connectionSuccess = await testSendGridConnection();
      
      return NextResponse.json({
        configured: true,
        testSuccess: connectionSuccess,
        message: connectionSuccess 
          ? 'SendGrid connection test successful!' 
          : 'SendGrid connection test failed - invalid API key or insufficient permissions.',
      });
    }
    
    // Standard configuration check
    if (hasApiKey && !isPlaceholder) {
      return NextResponse.json({
        configured: true,
        placeholder: false,
        message: 'SendGrid API key is configured.'
      });
    } else if (isPlaceholder) {
      return NextResponse.json({
        configured: false,
        placeholder: true,
        message: 'SendGrid API key appears to be a placeholder. Please replace it with your actual API key.'
      });
    } else {
      return NextResponse.json({
        configured: false,
        placeholder: false,
        message: 'SendGrid API key is not configured. Please add it to your .env.local file.'
      });
    }
  } catch (error) {
    return NextResponse.json({
      configured: false,
      message: error instanceof Error ? error.message : 'Unknown error checking configuration',
      error: true
    });
  }
}
