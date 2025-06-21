import { NextRequest, NextResponse } from 'next/server';
import { 
  Order,
  Customer,
  ShippingAddress,
  TrackingInfo
} from '@/db/schema';
import { orderStorage, customerStorage, paginationStorage } from '@/lib/storage-service';

// GET all orders with related data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');
    
    // Get all orders from localStorage
    const ordersData = orderStorage.getAll();
    
    // Apply filters if provided
    let filteredOrders = ordersData;
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.orderStatus === status);
    }
    
    // Sort by createdAt in descending order
    filteredOrders.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Descending order
    });
    
    // Apply pagination
    const paginatedOrders = filteredOrders.slice(offset, offset + limit);
    
    // Store pagination state for later use
    paginationStorage.setPaginationState('orders', {
      page: Math.floor(offset / limit),
      pageSize: limit,
      totalItems: filteredOrders.length
    });
    
    return NextResponse.json({
      orders: paginatedOrders,
      pagination: {
        total: filteredOrders.length,
        limit,
        offset
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST new orders with related data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Expected an array of orders' },
        { status: 400 }
      );
    }

    const results = [];
    
    // Process each order
    for (const orderData of body) {
      try {
        // Validate required fields
        if (!orderData.customerOrderNumber || !orderData.shipToName) {
          throw new Error('Missing required fields: customerOrderNumber and shipToName are required');
        }
        
        // Handle customer data
        let customerId = null;
        if (orderData.shipToEmail) {
          // Check if customer exists
          const existingCustomers = customerStorage.getAll().filter(
            c => c.email === orderData.shipToEmail
          );
          
          if (existingCustomers.length > 0) {
            customerId = existingCustomers[0].id;
          } else {
            // Create new customer
            const newCustomer = customerStorage.add({
              name: orderData.shipToName,
              email: orderData.shipToEmail,
              phone: orderData.shipToPhone || null,
              address: orderData.shipToLine1,
              tags: [],
              notes: null,
              company: null,
              lastContact: null,
              addedAt: new Date()
            });
            customerId = newCustomer.id;
          }
        }
        
        // Prepare order data
        const newOrder: Omit<Order, 'id'> = {
          customerOrderNumber: orderData.customerOrderNumber,
          orderTotal: typeof orderData.orderTotal === 'string' ? 
            orderData.orderTotal : 
            String(orderData.orderTotal || 0),
          actualShipDate: orderData.actualShipDate ? new Date(orderData.actualShipDate) : null,
          orderStatus: 'new',
          orderSource: orderData.orderSource || null,
          orderSummary: orderData.orderSummary || null,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Save order to localStorage
        const savedOrder = orderStorage.add(newOrder);
        
        results.push({
          order: savedOrder,
          message: 'Order created successfully'
        });
      } catch (orderError) {
        console.error('Error processing individual order:', orderError);
        results.push({
          error: true,
          message: orderError instanceof Error ? orderError.message : 'Unknown error',
          orderData: {
            customerOrderNumber: orderData.customerOrderNumber,
            shipToName: orderData.shipToName
          }
        });
      }
    }
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error creating orders:', error);
    return NextResponse.json(
      { error: 'Failed to create orders', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
