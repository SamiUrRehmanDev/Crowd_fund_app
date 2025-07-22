import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'volunteer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await request.json();

    // Mock notification settings update - replace with actual database logic
    console.log(`Updated notification settings for volunteer ${session.user.id}:`, settings);

    return NextResponse.json({ 
      success: true, 
      message: 'Notification settings updated successfully' 
    });
  } catch (error) {
    console.error('Notification settings update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
