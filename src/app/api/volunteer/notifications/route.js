import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Notification from '@/lib/models/Notification';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'volunteer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit')) || 50;
    const type = url.searchParams.get('type');
    const isRead = url.searchParams.get('isRead');

    // Build query filter
    const filter = { 
      recipient: session.user.id,
      recipientRole: 'volunteer'
    };
    
    if (type && type !== 'all') {
      filter.type = type;
    }
    
    if (isRead !== null && isRead !== undefined) {
      filter.isRead = isRead === 'true';
    }

    // Get notifications from database
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Format notifications
    const formattedNotifications = notifications.map(notif => ({
      id: notif._id.toString(),
      type: notif.type,
      title: notif.title,
      message: notif.message,
      taskType: notif.metadata?.taskType,
      isRead: notif.isRead,
      createdAt: notif.createdAt?.toISOString(),
      actionUrl: notif.actionUrl,
      urgency: notif.metadata?.urgency,
      metadata: notif.metadata
    }));

    // Get counts
    const totalCount = await Notification.countDocuments({ 
      recipient: session.user.id,
      recipientRole: 'volunteer' 
    });
    const unreadCount = await Notification.countDocuments({ 
      recipient: session.user.id,
      recipientRole: 'volunteer',
      isRead: false 
    });

    return NextResponse.json({
      notifications: formattedNotifications,
      pagination: {
        total: totalCount,
        unread: unreadCount,
        limit,
        hasMore: notifications.length === limit
      }
    });
  } catch (error) {
    console.error('Notifications API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}
