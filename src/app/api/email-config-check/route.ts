import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.SENDGRID_API_KEY;
    const hasApiKey = !!apiKey;
    const isPlaceholder = apiKey && (
      apiKey === 'SG.your_sendgrid_api_key_here' || 
      apiKey === 'SG.your_actual_api_key_here' ||
      apiKey.includes('your_') ||
      apiKey.includes('placeholder')
    );
    
    if (hasApiKey && !isPlaceholder) {
      return NextResponse.json({
        configured: true,
        message: 'SendGrid API key is configured.'
      });
    } else if (isPlaceholder) {
      return NextResponse.json({
        configured: false,
        message: 'SendGrid API key appears to be a placeholder. Please replace it with your actual API key.'
      });
    } else {
      return NextResponse.json({
        configured: false,
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
