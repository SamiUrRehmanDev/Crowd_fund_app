import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'volunteer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock verification data - replace with actual database queries
    const verifications = {
      available: [
        {
          id: 'ver-1',
          title: 'Medical Equipment Verification',
          type: 'medical',
          urgency: 'high',
          requesterName: 'Dr. Sarah Chen',
          location: 'General Hospital - East Wing',
          requestDate: '2024-01-21T08:00:00Z',
          estimatedHours: 2,
          description: 'Verify medical equipment needs for cardiac unit expansion',
          requirements: [
            'Medical background preferred',
            'Valid identification required',
            'Ability to lift up to 25 lbs'
          ],
          attachments: [
            { name: 'equipment_list.pdf', type: 'document' },
            { name: 'facility_layout.jpg', type: 'image' }
          ]
        },
        {
          id: 'ver-2',
          title: 'Housing Safety Assessment',
          type: 'housing',
          urgency: 'urgent',
          requesterName: 'Maria Rodriguez',
          location: '1234 Oak Street, Apt 2B',
          requestDate: '2024-01-20T14:30:00Z',
          estimatedHours: 3,
          description: 'Assess housing conditions for family with young children',
          requirements: [
            'Safety inspection training preferred',
            'Valid driver\'s license',
            'Background check completed'
          ]
        }
      ],
      inProgress: [
        {
          id: 'ver-3',
          title: 'Education Resource Verification',
          type: 'education',
          urgency: 'medium',
          requesterName: 'Principal Johnson',
          location: 'Lincoln Elementary School',
          requestDate: '2024-01-19T10:15:00Z',
          estimatedHours: 4,
          description: 'Verify educational resources and learning material needs',
          acceptedDate: '2024-01-20T09:00:00Z',
          deadline: '2024-01-25T17:00:00Z'
        }
      ],
      submitted: [
        {
          id: 'ver-4',
          title: 'Family Support Assessment',
          type: 'family',
          urgency: 'medium',
          requesterName: 'Jennifer Davis',
          location: 'Community Center - Room 15',
          requestDate: '2024-01-15T11:20:00Z',
          completedDate: '2024-01-18T16:30:00Z',
          status: 'pending-review',
          report: {
            status: 'verified',
            findings: 'Family demonstrates genuine need for emergency assistance. Housing conditions are safe but overcrowded.',
            recommendations: 'Recommend priority placement for housing assistance program.'
          }
        }
      ],
      completed: [
        {
          id: 'ver-5',
          title: 'Medical Supply Verification',
          type: 'medical',
          urgency: 'high',
          requesterName: 'Nurse Patricia Wong',
          location: 'Community Health Clinic',
          requestDate: '2024-01-10T09:45:00Z',
          completedDate: '2024-01-12T14:20:00Z',
          status: 'verified',
          report: {
            status: 'verified',
            findings: 'All medical supplies verified as legitimate need. Clinic serving 200+ patients daily.',
            recommendations: 'Immediate supply delivery recommended. High-priority case.'
          }
        }
      ]
    };

    return NextResponse.json({ verifications });
  } catch (error) {
    console.error('Verifications API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
