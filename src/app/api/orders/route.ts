import { NextRequest, NextResponse } from 'next/server';
import { 
  Order,
  Customer,
  ShippingAddress,
  TrackingInfo,
  OrderItem
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
              city: orderData.shipToCity,
              state: orderData.shipToStateProvince,
              postalCode: orderData.shipToPostalCode,
              addedAt: new Date()
            });
            customerId = newCustomer.id;
          }
        }
        
        // Prepare order data
        const newOrder: Omit<Order, 'id'> = {
          customerOrderNumber: orderData.customerOrderNumber,
          customerId: customerId,
          orderTotal: typeof orderData.orderTotal === 'number' ? 
            orderData.orderTotal : 
            parseFloat(orderData.orderTotal) || 0,
          orderDate: new Date(),
          actualShipDate: orderData.actualShipDate ? new Date(orderData.actualShipDate) : null,
          orderStatus: 'new',
          orderSource: orderData.orderSource || null,
          orderSummary: orderData.orderSummary || null,
          createdAt: new Date(),
          updatedAt: new Date(),
          // Initialize related data
          shippingAddress: {
            id: 0, // Will be updated after saving
            orderId: 0, // Will be updated after saving
            shipToName: orderData.shipToName,
            shipToPhone: orderData.shipToPhone || null,
            shipToEmail: orderData.shipToEmail || null,
            shipToLine1: orderData.shipToLine1,
            shipToCity: orderData.shipToCity,
            shipToStateProvince: orderData.shipToStateProvince,
            shipToPostalCode: orderData.shipToPostalCode,
            shipToCountry: 'US'
          },
          tracking: [],
          items: []
        };
        
        // Save order to localStorage
        const savedOrder = orderStorage.add(newOrder);
        
        // Add tracking information
        const trackingInfos: TrackingInfo[] = [];
        if (orderData.trackingNumbers && Array.isArray(orderData.trackingNumbers)) {
          orderData.trackingNumbers.forEach((trackingNumber: string) => {
            if (trackingNumber) {
              trackingInfos.push({
                id: Date.now() + Math.floor(Math.random() * 1000),
                orderId: savedOrder.id,
                trackingNumber: trackingNumber,
                carrier: 'FedEx',
                trackingUrl: `https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNumber}`,
                lastUpdated: new Date()
              });
            }
          });
          
          // Update order with tracking info
          if (trackingInfos.length > 0) {
            savedOrder.tracking = trackingInfos;
          }
        }
        
        // Add order items if available
        const orderItems: OrderItem[] = [];
        if (orderData.items && Array.isArray(orderData.items)) {
          orderData.items.forEach((item: any) => {
            orderItems.push({
              id: Date.now() + Math.floor(Math.random() * 1000),
              orderId: savedOrder.id,
              productName: item.name || 'Unknown Product',
              quantity: item.quantity || 1,
              unitPrice: item.price || 0,
              sku: item.sku || null,
              productDescription: item.description || null
            });
          });
          
          // Update order with items
          if (orderItems.length > 0) {
            savedOrder.items = orderItems;
          }
        }
        
        // Update shipping address orderId
        if (savedOrder.shippingAddress) {
          savedOrder.shippingAddress.orderId = savedOrder.id;
          savedOrder.shippingAddress.id = Date.now() + Math.floor(Math.random() * 1000);
        }
        
        // Save the updated order back to localStorage
        const allOrders = orderStorage.getAll();
        const orderIndex = allOrders.findIndex(o => o.id === savedOrder.id);
        if (orderIndex >= 0) {
          allOrders[orderIndex] = savedOrder;
          orderStorage.save(allOrders);
        }
        
        results.push({
          order: savedOrder,
          shippingAddress: savedOrder.shippingAddress,
          tracking: savedOrder.tracking,
          items: savedOrder.items
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
