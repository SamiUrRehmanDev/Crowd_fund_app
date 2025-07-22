import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb.js';

export async function GET(request) {
  try {
    await connectDB();
    
    return NextResponse.json({
      message: 'Database connection successful!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { error: 'Database connection failed', details: error.message },
      { status: 500 }
    );
  }
}
