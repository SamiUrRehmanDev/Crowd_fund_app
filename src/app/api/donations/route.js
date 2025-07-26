import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Donation from '@/lib/models/Donation';
import Campaign from '@/lib/models/Campaign';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { campaignId, amount, paymentMethodId, savePaymentMethod } = await request.json();

    // Validate required fields
    if (!campaignId || !amount || !paymentMethodId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
      metadata: {
        campaignId,
        donorId: session.user.id,
        donorEmail: session.user.email,
      },
      setup_future_usage: savePaymentMethod ? 'off_session' : undefined,
    });

    // Handle payment intent status
    if (paymentIntent.status === 'requires_action') {
      return NextResponse.json({
        requiresAction: true,
        clientSecret: paymentIntent.client_secret,
      });
    } else if (paymentIntent.status === 'succeeded') {
      // Create donation record in database
      // In a real app, this would save to a Donation model
      const donation = {
        id: paymentIntent.id,
        campaignId,
        donorId: session.user.id,
        amount,
        status: 'completed',
        paymentIntentId: paymentIntent.id,
        createdAt: new Date(),
        receiptUrl: `${process.env.NEXTAUTH_URL}/api/donations/${paymentIntent.id}/receipt`,
      };

      return NextResponse.json({
        success: true,
        donation,
        receiptUrl: donation.receiptUrl,
      });
    } else {
      return NextResponse.json(
        { error: 'Payment failed' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Donation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get user's donations from database
    const donations = await Donation.find({
      donor: session.user.id,
      paymentStatus: 'completed'
    })
    .populate('campaign', 'title category')
    .sort({ createdAt: -1 })
    .limit(50); // Limit to last 50 donations

    // Format donations for frontend
    const formattedDonations = donations.map(donation => ({
      id: donation._id,
      campaignId: donation.campaign._id,
      campaignTitle: donation.campaign.title,
      amount: donation.amount,
      status: donation.paymentStatus,
      date: donation.createdAt.toISOString().split('T')[0],
      receiptUrl: `/api/donations/${donation._id}/receipt`,
      isRecurring: donation.isRecurring || false,
      paymentMethod: `**** ${donation.paymentId ? donation.paymentId.slice(-4) : '****'}`,
      category: donation.campaign.category
    }));

    return NextResponse.json({ donations: formattedDonations }, { status: 200 });

  } catch (error) {
    console.error('Donations history API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
