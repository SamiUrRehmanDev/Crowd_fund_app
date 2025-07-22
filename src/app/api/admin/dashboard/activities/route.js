import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb.js';
import { withAuth } from '../../../../../lib/middleware.js';
import AuditLog from '../../../../../lib/models/AuditLog.js';

async function handler(request) {
  try {
    await connectDB();

    // Get recent activities from audit logs
    const activities = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('userId', 'name email')
      .lean();

    // Format activities for display
    const formattedActivities = activities.map(activity => {
      let message = '';
      let type = 'info';

      switch (activity.action) {
        case 'login':
          message = `${activity.userId?.name || 'User'} logged in`;
          type = 'success';
          break;
        case 'logout':
          message = `${activity.userId?.name || 'User'} logged out`;
          type = 'info';
          break;
        case 'campaign_created':
          message = `New campaign created: ${activity.details?.title || 'Unknown'}`;
          type = 'success';
          break;
        case 'campaign_approved':
          message = `Campaign approved: ${activity.details?.title || 'Unknown'}`;
          type = 'success';
          break;
        case 'campaign_rejected':
          message = `Campaign rejected: ${activity.details?.title || 'Unknown'}`;
          type = 'warning';
          break;
        case 'user_created':
          message = `New user registered: ${activity.details?.email || 'Unknown'}`;
          type = 'success';
          break;
        case 'user_suspended':
          message = `User suspended: ${activity.details?.email || 'Unknown'}`;
          type = 'warning';
          break;
        case 'donation_received':
          message = `New donation received: $${activity.details?.amount || 0}`;
          type = 'success';
          break;
        case 'task_completed':
          message = `Task completed: ${activity.details?.title || 'Unknown'}`;
          type = 'success';
          break;
        case 'password_reset_request':
          message = `Password reset requested for: ${activity.details?.email || 'Unknown'}`;
          type = 'warning';
          break;
        case 'failed_login':
          message = `Failed login attempt for: ${activity.details?.email || 'Unknown'}`;
          type = 'error';
          break;
        default:
          message = `${activity.action.replace(/_/g, ' ')} by ${activity.userId?.name || 'System'}`;
          type = 'info';
      }

      return {
        id: activity._id,
        message,
        type,
        timestamp: formatTimestamp(activity.createdAt),
        rawData: activity
      };
    });

    return NextResponse.json(formattedActivities);

  } catch (error) {
    console.error('Dashboard activities error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard activities' },
      { status: 500 }
    );
  }
}

function formatTimestamp(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }

  return new Date(date).toLocaleDateString();
}

export const GET = withAuth(handler);
