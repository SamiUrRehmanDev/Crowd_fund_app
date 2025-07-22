import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'DONOR') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get donor details
    const donor = await User.findById(session.user.id);
    if (!donor) {
      return NextResponse.json(
        { error: 'Donor not found' },
        { status: 404 }
      );
    }

    // Mock data for dashboard - In a real app, this would come from actual donation/campaign collections
    const dashboardData = {
      stats: {
        totalDonations: 25,
        campaignsSupported: 12,
        totalAmount: 2450.00,
        impactScore: 850,
        proposalsSubmitted: 3,
        favoriteCampaigns: 8
      },
      recentDonations: [
        {
          id: 'don_001',
          campaignTitle: 'Emergency Surgery for Maria',
          amount: 150,
          date: '2024-07-15',
          status: 'completed',
          timeAgo: '2 days ago'
        },
        {
          id: 'don_002',
          campaignTitle: 'School Books for Rural Children',
          amount: 75,
          date: '2024-07-10',
          status: 'completed',
          timeAgo: '1 week ago'
        },
        {
          id: 'don_003',
          campaignTitle: 'Clean Water Project',
          amount: 200,
          date: '2024-07-05',
          status: 'completed',
          timeAgo: '2 weeks ago'
        }
      ],
      recommendedCampaigns: [
        {
          id: 'camp_001',
          title: 'Help Build a Community Center',
          category: 'Community',
          raised: 15000,
          goal: 25000,
          daysLeft: 30,
          urgency: 'Medium'
        },
        {
          id: 'camp_002',
          title: 'Medical Treatment for Children',
          category: 'Medical',
          raised: 8500,
          goal: 12000,
          daysLeft: 15,
          urgency: 'High'
        },
        {
          id: 'camp_003',
          title: 'Educational Scholarships',
          category: 'Education',
          raised: 3200,
          goal: 10000,
          daysLeft: 45,
          urgency: 'Low'
        }
      ],
      favoriteCampaigns: [
        {
          id: 'camp_001',
          title: 'Help Build a Community Center',
          category: 'Community'
        },
        {
          id: 'camp_004',
          title: 'Animal Shelter Support',
          category: 'Animal Welfare'
        },
        {
          id: 'camp_005',
          title: 'Disaster Relief Fund',
          category: 'Emergency'
        }
      ]
    };

    return NextResponse.json(dashboardData, { status: 200 });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
