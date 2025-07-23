import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'volunteer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock messages data - replace with actual database queries
    const messages = [
      {
        id: 'msg-1',
        type: 'organizations',
        sender: 'City Medical Center',
        subject: 'Thank you for your verification work',
        preview: 'We wanted to express our gratitude for your recent medical equipment verification...',
        content: 'Dear Volunteer,\n\nWe wanted to express our gratitude for your recent medical equipment verification. Your thorough assessment helped us secure the necessary funding for our cardiac unit expansion. The detailed report you provided was instrumental in demonstrating our genuine needs to the donors.\n\nThanks to your efforts, we can now serve more patients in our community.\n\nBest regards,\nDr. Sarah Chen\nChief Medical Officer',
        timestamp: '2024-01-21T10:30:00Z',
        read: false
      },
      {
        id: 'msg-2',
        type: 'volunteers',
        sender: 'John Martinez',
        subject: 'Housing verification tips',
        preview: 'Hi! I saw you recently started doing housing verifications. Here are some tips...',
        content: 'Hi there!\n\nI saw you recently started doing housing verifications. I\'ve been doing them for over a year now and wanted to share some helpful tips:\n\n1. Always bring a flashlight for dark areas\n2. Take photos of key structural elements\n3. Check water pressure and electrical outlets\n4. Document any safety hazards immediately\n\nFeel free to reach out if you have any questions!\n\nBest,\nJohn',
        timestamp: '2024-01-20T14:15:00Z',
        read: true
      },
      {
        id: 'msg-3',
        type: 'system',
        sender: 'CrowdFunding Platform',
        subject: 'New verification guidelines',
        preview: 'Important updates to our verification process have been implemented...',
        content: 'Dear Volunteers,\n\nWe have implemented important updates to our verification process:\n\n• New safety protocols for housing assessments\n• Updated documentation requirements\n• Enhanced training materials available\n• Revised urgency level definitions\n\nPlease review the updated guidelines in your volunteer portal.\n\nThank you for your continued service,\nVolunteer Coordination Team',
        timestamp: '2024-01-19T09:00:00Z',
        read: false
      }
    ];

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Messages API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'volunteer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const messageData = await request.json();

    // Mock message sending - replace with actual database logic
    console.log(`Volunteer ${session.user.id} sent message:`, messageData);

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully' 
    });
  } catch (error) {
    console.error('Message sending error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
