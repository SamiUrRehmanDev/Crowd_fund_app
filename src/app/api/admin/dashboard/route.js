import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Campaign from '@/lib/models/Campaign';
import Donation from '@/lib/models/Donation';
import Task from '@/lib/models/Task';
import AuditLog from '@/lib/models/AuditLog';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '30d';
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (timeframe) {
      case '7d':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case '30d':
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case '90d':
        startDate = new Date(now.setDate(now.getDate() - 90));
        break;
      case '1y':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 30));
    }
    
    // Get overview statistics
    const [
      totalUsers,
      totalCampaigns,
      totalDonations,
      totalTasks,
      newUsers,
      newCampaigns,
      newDonations,
      activeCampaigns,
      pendingTasks,
      completedTasks,
      totalRaised,
      recentActivity
    ] = await Promise.all([
      // Total counts
      User.countDocuments({ deletedAt: { $exists: false } }),
      Campaign.countDocuments({ deletedAt: { $exists: false } }),
      Donation.countDocuments({}),
      Task.countDocuments({}),
      
      // New items in timeframe
      User.countDocuments({ 
        createdAt: { $gte: startDate },
        deletedAt: { $exists: false }
      }),
      Campaign.countDocuments({ 
        createdAt: { $gte: startDate },
        deletedAt: { $exists: false }
      }),
      Donation.countDocuments({ 
        createdAt: { $gte: startDate }
      }),
      
      // Status-based counts
      Campaign.countDocuments({ 
        status: { $in: ['live', 'approved'] },
        deletedAt: { $exists: false }
      }),
      Task.countDocuments({ 
        status: { $in: ['pending', 'assigned'] }
      }),
      Task.countDocuments({ 
        status: 'completed',
        completedAt: { $gte: startDate }
      }),
      
      // Financial data
      Donation.aggregate([
        { $match: { paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      
      // Recent activity
      AuditLog.find()
        .sort({ timestamp: -1 })
        .limit(10)
        .populate('performedBy', 'firstName lastName email role')
    ]);
    
    // User distribution by role
    const usersByRole = await User.aggregate([
      { $match: { deletedAt: { $exists: false } } },
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    
    // Campaign distribution by status
    const campaignsByStatus = await Campaign.aggregate([
      { $match: { deletedAt: { $exists: false } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Donation trends (daily for last 30 days)
    const donationTrends = await Donation.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          amount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Top campaigns by donations
    const topCampaigns = await Campaign.find({
      deletedAt: { $exists: false }
    })
      .sort({ raisedAmount: -1 })
      .limit(5)
      .populate('createdBy', 'firstName lastName')
      .select('title raisedAmount goalAmount stats createdBy');
    
    // Recent donations
    const recentDonations = await Donation.find({
      paymentStatus: 'completed'
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('donor', 'firstName lastName')
      .populate('campaign', 'title')
      .select('amount donor campaign createdAt isAnonymous');
    
    // System alerts (campaigns needing attention)
    const pendingCampaigns = await Campaign.countDocuments({
      status: 'pending',
      deletedAt: { $exists: false }
    });
    
    const flaggedCampaigns = await Campaign.countDocuments({
      'flaggedReasons.0': { $exists: true },
      deletedAt: { $exists: false }
    });
    
    const overdueTasks = await Task.countDocuments({
      deadline: { $lt: new Date() },
      status: { $nin: ['completed', 'cancelled'] }
    });
    
    const alerts = [];
    if (pendingCampaigns > 0) {
      alerts.push({
        type: 'warning',
        message: `${pendingCampaigns} campaigns pending approval`,
        count: pendingCampaigns,
        action: '/admin/campaigns?status=pending'
      });
    }
    if (flaggedCampaigns > 0) {
      alerts.push({
        type: 'error',
        message: `${flaggedCampaigns} campaigns flagged for review`,
        count: flaggedCampaigns,
        action: '/admin/campaigns?flagged=true'
      });
    }
    if (overdueTasks > 0) {
      alerts.push({
        type: 'warning',
        message: `${overdueTasks} tasks are overdue`,
        count: overdueTasks,
        action: '/admin/tasks?status=overdue'
      });
    }
    
    return NextResponse.json({
      overview: {
        totalUsers,
        totalCampaigns,
        totalDonations,
        totalTasks,
        newUsers,
        newCampaigns,
        newDonations,
        activeCampaigns,
        pendingTasks,
        completedTasks,
        totalRaised: totalRaised[0]?.total || 0
      },
      distributions: {
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        campaignsByStatus: campaignsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      },
      trends: {
        donations: donationTrends
      },
      topCampaigns,
      recentDonations,
      recentActivity,
      alerts,
      timeframe
    });
    
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
