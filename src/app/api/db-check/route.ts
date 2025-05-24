import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Test database connection with a simple query
    const result = await db.execute(sql`SELECT NOW()`);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      timestamp: result[0].now
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
