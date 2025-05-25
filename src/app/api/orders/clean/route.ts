import { NextResponse } from 'next/server';
import { orderStorage } from '@/lib/storage-service';

// DELETE all orders (clean functionality)
export async function DELETE() {
  try {
    // Create a backup of the current orders in case this was a mistake
    const currentOrders = orderStorage.getAll();
    const timestamp = new Date().toISOString();
    
    // Store backup in localStorage (only client-side, but API will run on server)
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(`orders_backup_${timestamp}`, JSON.stringify(currentOrders));
      } catch (error) {
        console.error('Failed to create backup in localStorage:', error);
      }
    }
    
    // Clear all orders from the storage
    orderStorage.clear();
    
    return NextResponse.json({
      success: true,
      message: 'All orders have been removed from the system',
      timestamp,
    });
  } catch (error) {
    console.error('Error cleaning orders:', error);
    return NextResponse.json(
      { error: 'Failed to clean orders', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
