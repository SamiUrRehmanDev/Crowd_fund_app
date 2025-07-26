import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Campaign from '@/lib/models/Campaign';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get user with favorite campaigns
    const user = await User.findById(session.user.id)
      .populate({
        path: 'favoriteCampaigns',
        match: { 
          status: { $in: ['approved', 'live'] },
          deletedAt: { $exists: false }
        },
        select: 'title description category urgency goalAmount raisedAmount donorCount endDate images createdBy',
        populate: {
          path: 'createdBy',
          select: 'firstName lastName name'
        }
      });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Format favorite campaigns
    const favorites = user.favoriteCampaigns.map(campaign => {
      const daysLeft = Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24));
      
      return {
        id: campaign._id,
        title: campaign.title,
        description: campaign.description,
        category: campaign.category,
        urgency: campaign.urgency || 'Medium',
        goal: campaign.goalAmount,
        raised: campaign.raisedAmount || 0,
        donorCount: campaign.donorCount || 0,
        daysLeft: Math.max(0, daysLeft),
        endDate: campaign.endDate,
        image: campaign.images?.[0]?.url || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
        organizer: {
          name: campaign.createdBy?.name || `${campaign.createdBy?.firstName} ${campaign.createdBy?.lastName}` || 'Anonymous',
          verified: true
        },
        addedAt: new Date() // You might want to track when favorites were added
      };
    });

    return NextResponse.json({ favorites }, { status: 200 });

  } catch (error) {
    console.error('Favorites API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { campaignId } = await request.json();

    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if campaign exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Get user and check if already favorited
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.favoriteCampaigns.includes(campaignId)) {
      return NextResponse.json(
        { error: 'Campaign already in favorites' },
        { status: 400 }
      );
    }

    // Add to favorites
    user.favoriteCampaigns.push(campaignId);
    await user.save();

    const favorite = {
      id: campaignId,
      addedAt: new Date().toISOString(),
      donorId: session.user.id
    };

    return NextResponse.json({ 
      favorite,
      message: 'Campaign added to favorites'
    }, { status: 201 });

  } catch (error) {
    console.error('Add favorite API error:', error);
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
    const campaignId = searchParams.get('campaignId');

    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Remove from user's favorites
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $pull: { favoriteCampaigns: campaignId } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Campaign removed from favorites'
    }, { status: 200 });

  } catch (error) {
    console.error('Remove favorite API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
