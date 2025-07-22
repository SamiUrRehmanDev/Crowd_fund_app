import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Mock notifications - In a real app, this would query a Notifications model
    const notifications = [
      {
        id: 'notif_001',
        type: 'donation_received',
        title: 'Your donation was successful',
        message: 'Your $100 donation to "Emergency Surgery for Maria Lopez" has been processed successfully.',
        campaignId: 'camp_001',
        campaignTitle: 'Emergency Surgery for Maria Lopez',
        amount: 100,
        isRead: false,
        createdAt: '2024-06-28T10:30:00Z',
        icon: 'CheckCircleIcon',
        color: 'green'
      },
      {
        id: 'notif_002',
        type: 'campaign_update',
        title: 'Campaign Update',
        message: 'Maria\'s surgery has been scheduled for next Monday. Thank you for your support!',
        campaignId: 'camp_001',
        campaignTitle: 'Emergency Surgery for Maria Lopez',
        isRead: false,
        createdAt: '2024-06-28T08:15:00Z',
        icon: 'InformationCircleIcon',
        color: 'blue'
      },
      {
        id: 'notif_003',
        type: 'milestone_reached',
        title: 'Milestone Reached!',
        message: 'The campaign "Clean Water Project for Village" has reached 50% of its goal!',
        campaignId: 'camp_003',
        campaignTitle: 'Clean Water Project for Village',
        milestone: 50,
        isRead: true,
        createdAt: '2024-06-27T16:45:00Z',
        icon: 'TrophyIcon',
        color: 'yellow'
      },
      {
        id: 'notif_004',
        type: 'proposal_status',
        title: 'Proposal Approved',
        message: 'Your case proposal "Medical Treatment for Cancer Patient" has been approved and is now live as a campaign.',
        proposalId: 'prop_1234567890',
        campaignId: 'camp_007',
        isRead: true,
        createdAt: '2024-06-25T14:20:00Z',
        icon: 'CheckBadgeIcon',
        color: 'green'
      },
      {
        id: 'notif_005',
        type: 'favorite_campaign_update',
        title: 'Favorite Campaign Update',
        message: 'One of your favorite campaigns "Animal Shelter Emergency Fund" received a large donation.',
        campaignId: 'camp_004',
        campaignTitle: 'Animal Shelter Emergency Fund',
        isRead: true,
        createdAt: '2024-06-24T11:30:00Z',
        icon: 'HeartIcon',
        color: 'red'
      },
      {
        id: 'notif_006',
        type: 'payment_method',
        title: 'Payment Method Added',
        message: 'You have successfully added a new payment method ending in 1234.',
        paymentMethodLast4: '1234',
        isRead: true,
        createdAt: '2024-06-23T09:15:00Z',
        icon: 'CreditCardIcon',
        color: 'blue'
      },
      {
        id: 'notif_007',
        type: 'receipt_available',
        title: 'Donation Receipt Available',
        message: 'Your donation receipt for $75 is now available for download.',
        donationId: 'pi_5566778899',
        amount: 75,
        campaignTitle: 'Animal Shelter Emergency Fund',
        isRead: true,
        createdAt: '2024-06-22T15:00:00Z',
        icon: 'DocumentIcon',
        color: 'gray'
      }
    ];

    return NextResponse.json({ notifications }, { status: 200 });

  } catch (error) {
    console.error('Notifications API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { notificationId, action } = await request.json();

    if (!notificationId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    // In a real app, this would update the notification in the database
    if (action === 'mark_read') {
      // await Notification.findByIdAndUpdate(notificationId, { isRead: true });
      return NextResponse.json({ 
        message: 'Notification marked as read' 
      }, { status: 200 });
    } else if (action === 'mark_all_read') {
      // await Notification.updateMany({ userId: session.user.id }, { isRead: true });
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

export async function DELETE(request: NextRequest) {
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

    // In a real app, this would delete the notification from the database
    // await Notification.findByIdAndDelete(notificationId);

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
