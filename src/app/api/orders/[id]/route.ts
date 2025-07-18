import { NextRequest, NextResponse } from 'next/server';
import { Order } from '@/db/schema';
import { orderStorage } from '@/lib/storage-service';

// GET a specific order with all related data
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    // Get the order from localStorage
    const order = orderStorage.getById(id);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PUT (update) an order
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Get the existing order
    const existingOrder = orderStorage.getById(id);
    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Create a copy of the order to update
    const updatedOrder = { ...existingOrder };
    
    // Update order data
    if (body.order) {
      const { 
        orderStatus, 
        orderTotal, 
        actualShipDate, 
        orderSource, 
        orderSummary 
      } = body.order;
      
      if (orderStatus !== undefined) updatedOrder.orderStatus = orderStatus;
      if (orderTotal !== undefined) updatedOrder.orderTotal = orderTotal;
      if (actualShipDate !== undefined) updatedOrder.actualShipDate = new Date(actualShipDate);
      if (orderSource !== undefined) updatedOrder.orderSource = orderSource;
      if (orderSummary !== undefined) updatedOrder.orderSummary = orderSummary;
      
      updatedOrder.updatedAt = new Date();
    }
    
    // Note: Order schema doesn't include shippingAddress or tracking as nested properties
    // These would need to be handled separately if needed
    
    // Save the updated order
    const result = orderStorage.update(id, updatedOrder);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE an order
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    // Delete the order from localStorage
    const success = orderStorage.delete(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}
