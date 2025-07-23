import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'volunteer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const reportData = await request.json();

    // Mock report submission - replace with actual database logic
    console.log(`Volunteer ${session.user.id} submitted report for verification ${id}:`, reportData);

    return NextResponse.json({ 
      success: true, 
      message: 'Report submitted successfully' 
    });
  } catch (error) {
    console.error('Report submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
