import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orderData, NewOrderData } from '@/db/schema';
import { desc } from 'drizzle-orm';

// GET all orders
export async function GET() {
  try {
    const orders = await db.select().from(orderData).orderBy(desc(orderData.processedAt));
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST new orders
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Expected an array of orders' },
        { status: 400 }
      );
    }

    const ordersToInsert: NewOrderData[] = body.map(order => ({
      customerOrderNumber: order.customerOrderNumber,
      shipToName: order.shipToName,
      shipToPhone: order.shipToPhone || null,
      shipToLine1: order.shipToLine1,
      shipToCity: order.shipToCity,
      shipToStateProvince: order.shipToStateProvince,
      shipToPostalCode: order.shipToPostalCode,
      orderTotal: order.orderTotal,
      actualShipDate: new Date(order.actualShipDate),
      trackingNumbers: order.trackingNumbers || [],
      orderSource: order.orderSource || null,
      orderSummary: order.orderSummary || null,
      processedAt: new Date(),
    }));

    const result = await db.insert(orderData).values(ordersToInsert).returning();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating orders:', error);
    return NextResponse.json(
      { error: 'Failed to create orders' },
      { status: 500 }
    );
  }
}
