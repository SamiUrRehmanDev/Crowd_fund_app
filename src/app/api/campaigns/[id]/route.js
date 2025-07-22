import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const campaignId = params.id;

    // Mock campaign data - In a real app, this would come from a Campaign model
    const campaigns = {
      'camp_001': {
        id: 'camp_001',
        title: 'Emergency Surgery for Maria Lopez',
        description: 'Maria is a 35-year-old mother of three who urgently needs heart surgery. The family cannot afford the medical expenses and is seeking community support to save her life.',
        fullDescription: `Maria Lopez is facing a life-threatening heart condition that requires immediate surgical intervention. As a devoted mother of three young children, she has always put her family first, working multiple jobs to support them despite her declining health.

The doctors have diagnosed her with severe coronary artery disease and have recommended emergency bypass surgery. Without this surgery, Maria's condition will continue to deteriorate rapidly. The medical team estimates the total cost of the surgery, including hospital stay and recovery, to be $25,000.

Maria's family has exhausted their savings and insurance will only cover a portion of the costs. They are turning to the community for help during this critical time. Every donation, no matter how small, brings Maria one step closer to receiving the life-saving treatment she desperately needs.

Your support will directly fund:
- Emergency heart surgery procedure
- Hospital stay and medical monitoring
- Post-surgery medications and rehabilitation
- Medical equipment and supplies

Maria's children are counting on their mother to recover and come home. With your help, we can make that happen.`,
        category: 'Medical',
        urgency: 'Critical',
        goal: 25000,
        raised: 15750,
        donorCount: 187,
        endDate: '2024-09-15',
        createdAt: '2024-06-15',
        updatedAt: '2024-06-28',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
        images: [
          'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
          'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800',
          'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800'
        ],
        organizer: {
          name: 'Lopez Family',
          verified: true,
          profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
          bio: 'Loving family seeking help for Maria\'s emergency surgery',
          joinedDate: '2024-06-01'
        },
        beneficiary: {
          name: 'Maria Lopez',
          age: 35,
          location: 'Phoenix, Arizona',
          condition: 'Severe Coronary Artery Disease'
        },
        tags: ['surgery', 'heart', 'mother', 'urgent'],
        updates: [
          {
            id: 'upd_001',
            date: '2024-06-28',
            title: 'Surgery Scheduled for Next Week',
            content: 'Great news! We have secured a surgery date for Maria next Monday. Thank you to everyone who has donated so far. We are 63% of the way to our goal!'
          },
          {
            id: 'upd_002',
            date: '2024-06-25',
            title: 'Medical Evaluation Complete',
            content: 'Maria has completed all pre-surgery evaluations. The medical team is ready to proceed once we reach our funding goal.'
          },
          {
            id: 'upd_003',
            date: '2024-06-20',
            title: 'Overwhelming Community Support',
            content: 'We are amazed by the generous support from our community. Every donation brings hope to Maria and her family.'
          }
        ],
        recentDonations: [
          { 
            id: 'don_001',
            donorName: 'Anonymous', 
            amount: 100, 
            timeAgo: '2 hours ago',
            message: 'Praying for Maria\'s recovery'
          },
          { 
            id: 'don_002',
            donorName: 'John Smith', 
            amount: 50, 
            timeAgo: '5 hours ago',
            message: 'Stay strong, Maria!'
          },
          { 
            id: 'don_003',
            donorName: 'Sarah Wilson', 
            amount: 75, 
            timeAgo: '1 day ago',
            message: 'Sending love and support'
          },
          { 
            id: 'don_004',
            donorName: 'Anonymous', 
            amount: 200, 
            timeAgo: '1 day ago',
            message: null
          },
          { 
            id: 'don_005',
            donorName: 'Community Group', 
            amount: 150, 
            timeAgo: '2 days ago',
            message: 'From all of us at the community center'
          }
        ],
        milestones: [
          {
            percentage: 25,
            reached: true,
            reachedDate: '2024-06-18',
            description: 'Initial medical consultations covered'
          },
          {
            percentage: 50,
            reached: true,
            reachedDate: '2024-06-22',
            description: 'Pre-surgery tests and evaluations funded'
          },
          {
            percentage: 75,
            reached: false,
            reachedDate: null,
            description: 'Surgery deposit secured'
          },
          {
            percentage: 100,
            reached: false,
            reachedDate: null,
            description: 'Full surgery and recovery costs covered'
          }
        ],
        status: 'active',
        isVerified: true,
        documents: [
          {
            name: 'Medical Report - Dr. Johnson',
            type: 'medical',
            verified: true
          },
          {
            name: 'Cost Estimate - Phoenix General Hospital',
            type: 'financial',
            verified: true
          }
        ]
      }
    };

    const campaign = campaigns[campaignId as keyof typeof campaigns];

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ campaign }, { status: 200 });

  } catch (error) {
    console.error('Campaign details API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
