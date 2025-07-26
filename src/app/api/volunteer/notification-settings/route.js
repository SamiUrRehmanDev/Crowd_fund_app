import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'volunteer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id).lean();
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Default notification settings if none exist
    const defaultSettings = {
      email: true,
      push: true,
      sms: false,
      taskUpdates: true,
      newMessages: true,
      verificationRequests: true,
      systemAlerts: true,
      weeklyDigest: true
    };

    return NextResponse.json({
      settings: user.notificationSettings || defaultSettings
    });

  } catch (error) {
    console.error('Get notification settings error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'volunteer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { settings } = await request.json();

    if (!settings) {
      return NextResponse.json({ error: 'Settings data is required' }, { status: 400 });
    }

    await connectDB();

    // Update user's notification settings
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { 
        notificationSettings: settings,
        updatedAt: new Date()
      },
      { new: true, select: 'notificationSettings' }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Notification settings updated successfully',
      settings: updatedUser.notificationSettings
    });

  } catch (error) {
    console.error('Notification settings update error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}
