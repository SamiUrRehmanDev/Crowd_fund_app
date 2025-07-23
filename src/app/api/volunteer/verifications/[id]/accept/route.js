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

    // Mock verification acceptance - replace with actual database logic
    console.log(`Volunteer ${session.user.id} accepted verification ${id}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Verification accepted successfully' 
    });
  } catch (error) {
    console.error('Verification acceptance error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
