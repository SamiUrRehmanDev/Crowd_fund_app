import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'volunteer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const urgency = searchParams.get('urgency');
    const location = searchParams.get('location');
    const search = searchParams.get('search');

    // Mock data for volunteer tasks - replace with actual database queries
    let tasks = [
      {
        id: 'task-1',
        title: 'Medical Supply Verification',
        organization: 'City Medical Center',
        organizationRating: 4.9,
        location: 'Downtown District',
        urgency: 'high',
        category: 'medical',
        estimatedHours: 3,
        deadline: '2024-01-25',
        description: 'Verify medical supply needs for pediatric patients requiring specialized equipment',
        requirements: ['Medical background preferred', 'Valid ID required', 'Transportation available'],
        skillsRequired: ['Medical Knowledge', 'Attention to Detail'],
        posted: '2024-01-20T08:00:00Z',
        applicants: 12,
        maxVolunteers: 2
      },
      {
        id: 'task-2',
        title: 'Education Assessment',
        organization: 'Hope Academy',
        organizationRating: 4.7,
        location: 'North Side',
        urgency: 'medium',
        category: 'education',
        estimatedHours: 4,
        deadline: '2024-01-28',
        description: 'Assess educational needs and resources for underprivileged children',
        requirements: ['Education background', 'Background check', 'Child safety training'],
        skillsRequired: ['Education Assessment', 'Child Communication'],
        posted: '2024-01-19T14:30:00Z',
        applicants: 8,
        maxVolunteers: 3
      },
      {
        id: 'task-3',
        title: 'Housing Condition Verification',
        organization: 'Shelter Alliance',
        organizationRating: 4.6,
        location: 'West District',
        urgency: 'urgent',
        category: 'housing',
        estimatedHours: 2,
        deadline: '2024-01-23',
        description: 'Verify housing conditions and safety requirements for emergency assistance',
        requirements: ['Valid ID', 'Safety certification preferred'],
        skillsRequired: ['Building Assessment', 'Documentation'],
        posted: '2024-01-21T09:15:00Z',
        applicants: 5,
        maxVolunteers: 1
      },
      {
        id: 'task-4',
        title: 'Family Situation Assessment',
        organization: 'Family Support Network',
        organizationRating: 4.8,
        location: 'South District',
        urgency: 'medium',
        category: 'verification',
        estimatedHours: 3,
        deadline: '2024-01-30',
        description: 'Conduct comprehensive family needs assessment for emergency assistance',
        requirements: ['Social work background preferred', 'Background check required'],
        skillsRequired: ['Interview Skills', 'Empathy', 'Documentation'],
        posted: '2024-01-18T11:00:00Z',
        applicants: 15,
        maxVolunteers: 2
      },
      {
        id: 'task-5',
        title: 'Community Event Support',
        organization: 'Community Centers United',
        organizationRating: 4.5,
        location: 'Central District',
        urgency: 'low',
        category: 'community',
        estimatedHours: 6,
        deadline: '2024-02-05',
        description: 'Support community outreach event and assist with verification booths',
        requirements: ['Friendly personality', 'Reliable transportation'],
        skillsRequired: ['Customer Service', 'Organization'],
        posted: '2024-01-17T16:45:00Z',
        applicants: 22,
        maxVolunteers: 5
      }
    ];

    // Apply filters
    if (category && category !== 'all') {
      tasks = tasks.filter(task => task.category === category);
    }
    if (urgency && urgency !== 'all') {
      tasks = tasks.filter(task => task.urgency === urgency);
    }
    if (location) {
      tasks = tasks.filter(task => 
        task.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    if (search) {
      tasks = tasks.filter(task =>
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase()) ||
        task.organization.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Tasks API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'volunteer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { taskId, message } = await request.json();

    // Mock application submission - replace with actual database logic
    console.log(`Volunteer ${session.user.id} applied for task ${taskId} with message: ${message}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Application submitted successfully' 
    });
  } catch (error) {
    console.error('Task application error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
