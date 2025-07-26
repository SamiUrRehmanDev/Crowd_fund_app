import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Campaign from '@/lib/models/Campaign';
import Donation from '@/lib/models/Donation';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'donor') {
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

    // Get donor's actual donations
    const donorDonations = await Donation.find({ 
      donor: session.user.id,
      paymentStatus: 'completed'
    })
    .populate('campaign', 'title category')
    .sort({ createdAt: -1 });

    // Calculate real stats
    const totalDonations = donorDonations.length;
    const totalAmount = donorDonations.reduce((sum, donation) => sum + donation.amount, 0);
    const campaignsSupported = [...new Set(donorDonations.map(d => d.campaign._id.toString()))].length;

    // Get donor's favorite campaigns (assuming we have a favorites field in User model or separate Favorites model)
    const favoriteCampaignIds = donor.favoriteCampaigns || [];
    const favoriteCampaigns = await Campaign.find({
      _id: { $in: favoriteCampaignIds },
      status: { $in: ['approved', 'live'] }
    }).select('title category');

    // Get donor's submitted proposals (campaigns created by the donor)
    const proposalsSubmitted = await Campaign.countDocuments({ 
      createdBy: session.user.id 
    });

    // Calculate impact score (can be based on total donations, campaigns supported, etc.)
    const impactScore = Math.round(totalAmount / 10) + (campaignsSupported * 50) + (proposalsSubmitted * 100);

    // Format recent donations
    const recentDonations = donorDonations.slice(0, 5).map(donation => {
      const daysDiff = Math.floor((new Date() - new Date(donation.createdAt)) / (1000 * 60 * 60 * 24));
      let timeAgo;
      if (daysDiff === 0) timeAgo = 'Today';
      else if (daysDiff === 1) timeAgo = '1 day ago';
      else if (daysDiff < 7) timeAgo = `${daysDiff} days ago`;
      else if (daysDiff < 30) timeAgo = `${Math.floor(daysDiff / 7)} weeks ago`;
      else timeAgo = `${Math.floor(daysDiff / 30)} months ago`;

      return {
        id: donation._id,
        campaignTitle: donation.campaign.title,
        amount: donation.amount,
        date: donation.createdAt.toISOString().split('T')[0],
        status: donation.paymentStatus,
        timeAgo
      };
    });

    // Get recommended campaigns (exclude campaigns user already donated to)
    const donatedCampaignIds = donorDonations.map(d => d.campaign._id);
    const recommendedCampaigns = await Campaign.find({
      _id: { $nin: donatedCampaignIds },
      status: { $in: ['approved', 'live'] },
      endDate: { $gt: new Date() }
    })
    .sort({ 
      urgency: -1, // Prioritize urgent campaigns
      createdAt: -1 
    })
    .limit(3)
    .select('title category goalAmount raisedAmount endDate urgency');

    // Format recommended campaigns
    const formattedRecommended = recommendedCampaigns.map(campaign => {
      const daysLeft = Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24));
      return {
        id: campaign._id,
        title: campaign.title,
        category: campaign.category,
        raised: campaign.raisedAmount || 0,
        goal: campaign.goalAmount,
        daysLeft: Math.max(0, daysLeft),
        urgency: campaign.urgency || 'Medium'
      };
    });

    // Format favorite campaigns
    const formattedFavorites = favoriteCampaigns.map(campaign => ({
      id: campaign._id,
      title: campaign.title,
      category: campaign.category
    }));

    const dashboardData = {
      stats: {
        totalDonations,
        campaignsSupported,
        totalAmount,
        impactScore,
        proposalsSubmitted,
        favoriteCampaigns: favoriteCampaigns.length
      },
      recentDonations,
      recommendedCampaigns: formattedRecommended,
      favoriteCampaigns: formattedFavorites
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
