import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'volunteer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock notifications data - replace with actual database queries
    const notifications = [
      {
        id: 'notif-1',
        type: 'task',
        title: 'New Medical Verification Available',
        message: 'A new urgent medical verification task has been posted in your area. The deadline is in 2 days.',
        timestamp: '2024-01-21T15:30:00Z',
        dismissed: false
      },
      {
        id: 'notif-2',
        type: 'verification',
        title: 'Verification Request Assigned',
        message: 'You have been assigned a housing assessment verification for the Rodriguez family.',
        timestamp: '2024-01-21T12:15:00Z',
        dismissed: false
      },
      {
        id: 'notif-3',
        type: 'message',
        title: 'New Message from City Medical Center',
        message: 'You have received a thank you message regarding your recent verification work.',
        timestamp: '2024-01-21T10:30:00Z',
        dismissed: false
      },
      {
        id: 'notif-4',
        type: 'update',
        title: 'Verification Report Approved',
        message: 'Your verification report for Family Support Assessment has been approved and processed.',
        timestamp: '2024-01-20T16:45:00Z',
        dismissed: false
      },
      {
        id: 'notif-5',
        type: 'urgent',
        title: 'Urgent: Missing Documentation',
        message: 'Please upload missing evidence for your recent housing verification within 24 hours.',
        timestamp: '2024-01-20T09:20:00Z',
        dismissed: false
      }
    ];

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Notifications API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
