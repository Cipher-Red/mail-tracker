import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';

// Create a limiter: 50 requests per IP per hour for analytics
const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 100, // Max 100 users per interval
  limit: 50, // 50 requests per interval
});

export async function GET(req: NextRequest) {
  try {
    // Apply rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    try {
      await limiter.check(ip, 1);
    } catch (error) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // In a real implementation, this would fetch data from a database
    // For now, we'll return mock data
    
    // Get date range from query params or use default (last 7 days)
    const searchParams = req.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '7', 10);
    
    // Generate mock data for the requested date range
    const dailySends = generateMockDailyData(days);
    
    // Calculate totals
    const totalSent = dailySends.reduce((sum, day) => sum + day.sent, 0);
    const totalFailed = dailySends.reduce((sum, day) => sum + day.failed, 0);
    const deliveryRate = totalSent + totalFailed > 0 
      ? parseFloat(((totalSent / (totalSent + totalFailed)) * 100).toFixed(1))
      : 0;
    
    return NextResponse.json({
      success: true,
      data: {
        totalSent,
        totalFailed,
        deliveryRate,
        dailySends,
        deliveryIssues: [
          { issue: 'Invalid email address', percentage: 42 },
          { issue: 'Mailbox full', percentage: 27 },
          { issue: 'Spam filters', percentage: 18 },
          { issue: 'Other', percentage: 13 },
        ]
      }
    });
  } catch (error) {
    console.error('Error in email analytics API:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper function to generate mock daily data
function generateMockDailyData(days: number) {
  const result = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate random numbers for sent and failed
    const sent = Math.floor(Math.random() * 300) + 100; // Between 100-400
    const failed = Math.floor(Math.random() * 20) + 1; // Between 1-20
    
    result.push({
      date: date.toISOString().split('T')[0],
      sent,
      failed
    });
  }
  
  return result;
}
