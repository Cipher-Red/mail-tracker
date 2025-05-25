import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'Using localStorage for data persistence',
      mode: 'localStorage'
    });
  } catch (error) {
    console.error('Storage check error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Storage check failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        mode: 'localStorage'
      },
      { status: 500 }
    );
  }
}
