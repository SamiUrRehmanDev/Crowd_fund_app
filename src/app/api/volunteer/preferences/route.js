import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'volunteer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock preferences data - replace with actual database queries
    const preferences = {
      isActive: true,
      availability: {
        monday: { morning: true, afternoon: false, evening: true, night: false },
        tuesday: { morning: true, afternoon: true, evening: false, night: false },
        wednesday: { morning: false, afternoon: true, evening: true, night: false },
        thursday: { morning: true, afternoon: false, evening: true, night: false },
        friday: { morning: true, afternoon: true, evening: false, night: false },
        saturday: { morning: false, afternoon: true, evening: true, night: false },
        sunday: { morning: false, afternoon: false, evening: false, night: false }
      },
      preferredTaskTypes: ['medical', 'verification'],
      maxHoursPerWeek: 15,
      travelRadius: 30,
      preferredLocations: ['Downtown District', 'North Side'],
      specialSkills: ['Medical Knowledge', 'Spanish Translation', 'CPR Certified'],
      languages: ['English', 'Spanish', 'French'],
      notifications: {
        email: true,
        sms: false,
        push: true,
      }
    };

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error('Preferences API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'volunteer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const preferences = await request.json();

    // Mock preference update - replace with actual database logic
    console.log(`Updated preferences for volunteer ${session.user.id}:`, preferences);

    return NextResponse.json({ 
      success: true, 
      message: 'Preferences updated successfully' 
    });
  } catch (error) {
    console.error('Preferences update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
