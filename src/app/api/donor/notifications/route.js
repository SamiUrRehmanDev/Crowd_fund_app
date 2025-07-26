import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Notification from '@/lib/models/Notification';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get real notifications from database
    const notifications = await Notification.find({
      recipient: session.user.id,
      recipientRole: 'donor'
    })
    .populate('campaign', 'title')
    .populate('donation', 'amount')
    .sort({ createdAt: -1 })
    .limit(50); // Limit to last 50 notifications

    // Format notifications for frontend
    const formattedNotifications = notifications.map(notification => ({
      id: notification._id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      campaignId: notification.campaign?._id,
      campaignTitle: notification.campaign?.title || notification.metadata?.campaignTitle,
      amount: notification.metadata?.amount,
      milestone: notification.metadata?.milestone,
      paymentMethodLast4: notification.metadata?.paymentMethodLast4,
      donationId: notification.metadata?.donationId,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      icon: notification.icon,
      color: notification.color,
      timeAgo: notification.timeAgo,
      actionUrl: notification.actionUrl
    }));

    return NextResponse.json({ notifications: formattedNotifications }, { status: 200 });

  } catch (error) {
    console.error('Notifications API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { notificationId, action } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    await connectDB();

    if (action === 'mark_read') {
      if (!notificationId) {
        return NextResponse.json(
          { error: 'Notification ID is required for mark_read action' },
          { status: 400 }
        );
      }
      
      const notification = await Notification.findOneAndUpdate(
        { 
          _id: notificationId, 
          recipient: session.user.id 
        },
        { 
          isRead: true, 
          readAt: new Date(),
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!notification) {
        return NextResponse.json(
          { error: 'Notification not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ 
        message: 'Notification marked as read',
        notification 
      }, { status: 200 });
      
    } else if (action === 'mark_all_read') {
      await Notification.updateMany(
        { 
          recipient: session.user.id,
          isRead: false 
        }, 
        { 
          isRead: true,
          readAt: new Date(),
          updatedAt: new Date()
        }
      );
      
      return NextResponse.json({ 
        message: 'All notifications marked as read' 
      }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Update notifications API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');

    if (!notificationId) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const deletedNotification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: session.user.id
    });

    if (!deletedNotification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Notification deleted successfully' 
    }, { status: 200 });

  } catch (error) {
    console.error('Delete notification API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
