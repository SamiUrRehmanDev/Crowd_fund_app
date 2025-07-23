// Test API route to verify basic functionality
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Admin users API is working',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Received POST request:', body);
    
    return NextResponse.json({ 
      message: 'POST endpoint is working',
      received: body
    });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
