import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      emailNotifications, 
      campaignUpdates, 
      newsletter, 
      publicProfile 
    } = body;

    await connectDB();

    const user = await User.findOne({ 
      email: session.user.email 
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user settings
    user.preferences = {
      emailNotifications: Boolean(emailNotifications),
      campaignUpdates: Boolean(campaignUpdates),
      newsletter: Boolean(newsletter),
      publicProfile: Boolean(publicProfile),
    };
    user.updatedAt = new Date();

    await user.save();

    return NextResponse.json(
      { 
        message: 'Settings updated successfully',
        preferences: user.preferences
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
