import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Campaign from '@/lib/models/Campaign';
import Donation from '@/lib/models/Donation';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'donee') {
      return NextResponse.json(
        { error: 'Unauthorized - Donee access required' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get user's campaigns
    const userCampaigns = await Campaign.find({ 
      createdBy: session.user.id 
    }).sort({ createdAt: -1 });

    // Calculate stats
    const stats = {
      totalCampaigns: userCampaigns.length,
      activeCampaigns: userCampaigns.filter(c => c.status === 'approved' || c.status === 'live').length,
      pendingCampaigns: userCampaigns.filter(c => c.status === 'pending').length,
      completedCampaigns: userCampaigns.filter(c => c.status === 'completed').length,
      totalRaised: 0,
      totalGoal: 0
    };

    // Calculate financial stats
    for (const campaign of userCampaigns) {
      stats.totalRaised += campaign.amountRaised || 0;
      stats.totalGoal += campaign.targetAmount || 0;
    }

    // Get recent donations for user's campaigns
    const campaignIds = userCampaigns.map(c => c._id);
    const recentDonations = await Donation.find({
      campaignId: { $in: campaignIds }
    })
    .populate('donorId', 'firstName lastName')
    .populate('campaignId', 'title')
    .sort({ createdAt: -1 })
    .limit(5);

    // Get active campaigns (approved/live)
    const activeRequests = userCampaigns.filter(c => 
      c.status === 'approved' || c.status === 'live' || c.status === 'pending'
    ).slice(0, 6);

    // Format recent activity
    const recentActivity = recentDonations.map(donation => ({
      id: donation._id,
      type: 'donation',
      title: `New donation received`,
      description: `${donation.donorId?.firstName || 'Anonymous'} donated $${donation.amount} to ${donation.campaignId?.title}`,
      amount: donation.amount,
      timestamp: donation.createdAt,
      campaignTitle: donation.campaignId?.title
    }));

    // Mock notifications (you can implement a proper notification system later)
    const notifications = [
      {
        id: 1,
        type: 'info',
        title: 'Welcome to your dashboard',
        message: 'Start by creating your first campaign to begin fundraising.',
        timestamp: new Date(),
        read: false
      }
    ];

    return NextResponse.json({
      stats,
      activeRequests,
      recentActivity,
      notifications
    });

  } catch (error) {
    console.error('Donee dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
