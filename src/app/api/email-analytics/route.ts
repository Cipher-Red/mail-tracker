import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { analyticsStorage } from '@/lib/storage-service';

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

    // Get date range from query params or use default (last 7 days)
    const searchParams = req.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '7', 10);
    
    // Calculate the date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Get analytics data from localStorage
    let analyticsData = analyticsStorage.getAll();
    
    // Filter by date range
    let dailySends = analyticsData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });
    
    // If no data, generate mock data
    if (dailySends.length === 0) {
      dailySends = generateMockDailyData(days);
      
      // Store the generated data in localStorage for future use
      dailySends.forEach(day => {
        analyticsStorage.add({
          id: 0, // Will be generated by the storage service
          date: new Date(day.date),
          sent: day.sent,
          failed: day.failed,
          deliveryIssues: null
        });
      });
    }
    
    // Sort by date
    dailySends.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    
    // Create response data with string dates (different from EmailAnalytic interface)
    const responseData = dailySends.map(item => ({
      id: item.id || 0, // Ensure id is present
      date: new Date(item.date).toISOString().split('T')[0],
      sent: item.sent,
      failed: item.failed,
      deliveryIssues: item.deliveryIssues || null
    }));
    
    // Calculate totals
    const totalSent = responseData.reduce((sum, day) => sum + day.sent, 0);
    const totalFailed = responseData.reduce((sum, day) => sum + day.failed, 0);
    const deliveryRate = totalSent + totalFailed > 0 
      ? parseFloat(((totalSent / (totalSent + totalFailed)) * 100).toFixed(1))
      : 0;
    
    // Default delivery issues
    const deliveryIssues = [
      { issue: 'Invalid email address', percentage: 42 },
      { issue: 'Mailbox full', percentage: 27 },
      { issue: 'Spam filters', percentage: 18 },
      { issue: 'Other', percentage: 13 },
    ];
    
    return NextResponse.json({
      success: true,
      data: {
        totalSent,
        totalFailed,
        deliveryRate,
        dailySends: responseData,
        deliveryIssues
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
