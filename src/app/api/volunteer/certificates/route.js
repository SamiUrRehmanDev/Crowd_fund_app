import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'volunteer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock certificates data - replace with actual database queries
    const certificates = [
      {
        id: 'cert-1',
        type: 'completion',
        title: 'Medical Verification Specialist',
        description: 'Completed 15 medical verification tasks with 100% accuracy',
        issuedDate: '2024-01-20',
        taskCount: 15,
        category: 'medical',
        status: 'issued',
        downloadUrl: '/api/volunteer/certificates/cert-1/download'
      },
      {
        id: 'cert-2',
        type: 'hours',
        title: 'Gold Level Volunteer - 50 Hours',
        description: 'Achieved 50+ hours of volunteer service',
        issuedDate: '2024-01-15',
        hoursCompleted: 52,
        level: 'Gold',
        status: 'issued',
        downloadUrl: '/api/volunteer/certificates/cert-2/download'
      },
      {
        id: 'cert-3',
        type: 'impact',
        title: 'Community Impact Award',
        description: 'Exceptional service supporting 25+ families in need',
        issuedDate: '2024-01-10',
        impactMetric: '25 families helped',
        status: 'issued',
        downloadUrl: '/api/volunteer/certificates/cert-3/download'
      },
      {
        id: 'cert-4',
        type: 'specialty',
        title: 'Emergency Response Volunteer',
        description: 'Specialized training in emergency response protocols',
        issuedDate: '2024-01-05',
        specialization: 'Emergency Response',
        status: 'issued',
        downloadUrl: '/api/volunteer/certificates/cert-4/download'
      }
    ];

    return NextResponse.json({ certificates });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
