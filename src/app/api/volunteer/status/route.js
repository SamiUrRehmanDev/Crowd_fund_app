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

    const volunteer = await User.findById(session.user.id)
      .select('status lastStatusUpdate volunteerProfile')
      .lean();

    if (!volunteer) {
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }

    const volunteerStatus = {
      status: volunteer.status || 'active',
      lastUpdated: volunteer.lastStatusUpdate?.toISOString() || volunteer.updatedAt?.toISOString(),
      availability: volunteer.volunteerProfile?.availability || 'available'
    };

    return NextResponse.json(volunteerStatus);
  } catch (error) {
    console.error('Error fetching volunteer status:', error);
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

    const { status } = await request.json();
    
    if (!['active', 'inactive'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await connectDB();

    const updatedVolunteer = await User.findByIdAndUpdate(
      session.user.id,
      { 
        status,
        lastStatusUpdate: new Date()
      },
      { new: true }
    ).select('status lastStatusUpdate');

    if (!updatedVolunteer) {
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      status: updatedVolunteer.status,
      lastUpdated: updatedVolunteer.lastStatusUpdate?.toISOString(),
      message: `Volunteer status updated to ${status}`
    });
    
  } catch (error) {
    console.error('Error updating volunteer status:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}
