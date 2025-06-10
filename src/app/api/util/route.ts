import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { model, messages, max_tokens, response_format } = body;

    // Mock AI response for now since we don't have real API keys
    // In production, this would call the actual Claude API
    
    const mockResponse = {
      content: JSON.stringify({
        name: "Professional Order Notification",
        subject: "Your Detroit Axle Order Has Shipped - Order {{orderNumber}}",
        preheader: "Your automotive parts are on the way!",
        content: `Dear {{customerName}},

Great news! Your Detroit Axle order has been shipped and is on its way to you.

📦 ORDER DETAILS:
• Order Number: {{orderNumber}}
• Ship Date: {{orderDate}}
• Tracking Number: {{trackingNumber}}
• Items: {{items}}

📍 SHIPPING ADDRESS:
{{address}}

🚚 TRACKING YOUR ORDER:
You can track your package using the tracking number above at fedex.com or by clicking the link in your tracking notification email.

❓ NEED HELP?
If you have any questions about your order, please contact our customer support team:
• Phone: 888-583-0255
• Email: support@detroitaxle.com

Thank you for choosing Detroit Axle for your automotive parts needs!

Best regards,
The Detroit Axle Team`
      })
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('Error in AI API:', error);
    return NextResponse.json(
      { error: 'Failed to generate template' },
      { status: 500 }
    );
  }
}
