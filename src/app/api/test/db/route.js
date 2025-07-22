import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test database connection
    await connectDB();
    console.log('✅ Database connection successful');
    
    // Test User model
    const userCount = await User.countDocuments();
    console.log('📊 Total users in database:', userCount);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection test successful',
      userCount: userCount
    });
    
  } catch (error) {
    console.error('❌ Database test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
