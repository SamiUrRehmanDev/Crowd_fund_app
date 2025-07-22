import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb.js';
import { withAuth, requirePermissions } from '../../../../../lib/middleware.js';
import User from '../../../../../lib/models/User.js';
import Campaign from '../../../../../lib/models/Campaign.js';
import Donation from '../../../../../lib/models/Donation.js';
import Task from '../../../../../lib/models/Task.js';

async function handler(request) {
  try {
    await connectDB();

    // Get dashboard statistics
    const [
      totalUsers,
      totalCampaigns,
      activeCampaigns,
      totalDonations,
      totalRevenue,
      pendingApprovals,
      activeVolunteers,
      completedTasks,
      pendingTasks
    ] = await Promise.all([
      User.countDocuments(),
      Campaign.countDocuments(),
      Campaign.countDocuments({ status: 'live' }),
      Donation.countDocuments(),
      Donation.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).then(result => result[0]?.total || 0),
      Campaign.countDocuments({ status: 'pending' }),
      User.countDocuments({ role: 'volunteer', isActive: true }),
      Task.countDocuments({ status: 'completed' }),
      Task.countDocuments({ status: { $in: ['pending', 'in_progress'] } })
    ]);

    // Get recent growth data (last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

    const [
      newUsersLast30,
      newUsersLast60,
      newCampaignsLast30,
      newCampaignsLast60,
      donationsLast30,
      donationsLast60
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      User.countDocuments({ 
        createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } 
      }),
      Campaign.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Campaign.countDocuments({ 
        createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } 
      }),
      Donation.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Donation.countDocuments({ 
        createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } 
      })
    ]);

    // Calculate growth percentages
    const calculateGrowth = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const stats = {
      totalUsers,
      totalCampaigns,
      activeCampaigns,
      totalDonations,
      totalRevenue,
      pendingApprovals,
      activeVolunteers,
      completedTasks,
      pendingTasks,
      flaggedContent: 0, // TODO: Implement when content moderation is added
      growth: {
        users: calculateGrowth(newUsersLast30, newUsersLast60),
        campaigns: calculateGrowth(newCampaignsLast30, newCampaignsLast60),
        donations: calculateGrowth(donationsLast30, donationsLast60)
      }
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
