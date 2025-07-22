import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'volunteer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock data for volunteer dashboard - replace with actual database queries
    const dashboardData = {
      stats: {
        tasksCompleted: 47,
        hoursVolunteered: 156,
        rating: 4.8,
        livesImpacted: 23
      },
      availableTasks: [
        {
          id: 'task-1',
          title: 'Medical Supply Verification',
          organization: 'City Medical Center',
          location: 'Downtown District',
          urgency: 'high',
          type: 'medical',
          estimatedHours: 3,
          deadline: '2024-01-25',
          description: 'Verify medical supply needs for pediatric patients',
          requirements: ['Medical background preferred', 'Valid ID required']
        },
        {
          id: 'task-2',
          title: 'Education Assessment',
          organization: 'Hope Academy',
          location: 'North Side',
          urgency: 'medium',
          type: 'education',
          estimatedHours: 4,
          deadline: '2024-01-28',
          description: 'Assess educational needs for underprivileged children',
          requirements: ['Education background', 'Background check']
        }
      ],
      pendingVerifications: [
        {
          id: 'ver-1',
          title: 'Housing Condition Assessment',
          requester: 'Sarah Johnson',
          location: 'East District',
          urgency: 'urgent',
          assignedDate: '2024-01-20',
          deadline: '2024-01-24'
        }
      ],
      recentActivity: [
        {
          id: 'act-1',
          type: 'task_completed',
          title: 'Completed: Family Situation Verification',
          timestamp: '2024-01-18T10:30:00Z',
          details: 'Successfully verified housing needs for the Martinez family'
        },
        {
          id: 'act-2',
          type: 'rating_received',
          title: 'Received 5-star rating',
          timestamp: '2024-01-17T15:45:00Z',
          details: 'From Community Health Center for medical verification task'
        }
      ],
      achievements: [
        {
          id: 'ach-1',
          title: 'Verification Expert',
          description: 'Completed 50+ verifications',
          icon: 'shield',
          earned: true
        },
        {
          id: 'ach-2',
          title: 'Community Champion',
          description: 'Helped 25+ families',
          icon: 'heart',
          earned: true
        }
      ]
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
