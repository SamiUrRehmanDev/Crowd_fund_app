import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: NextRequest) {
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

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Mock donation history - In a real app, this would query a Donation model
    const donations = [
      {
        id: 'pi_1234567890',
        campaignId: 'camp_001',
        campaignTitle: 'Emergency Surgery for Maria Lopez',
        amount: 100,
        status: 'completed',
        date: '2024-06-28',
        receiptUrl: '/api/donations/pi_1234567890/receipt',
        isRecurring: false,
        paymentMethod: '**** 4242',
        category: 'Medical'
      },
      {
        id: 'pi_0987654321',
        campaignId: 'camp_002',
        campaignTitle: 'School Books for Rural Children',
        amount: 50,
        status: 'completed',
        date: '2024-06-25',
        receiptUrl: '/api/donations/pi_0987654321/receipt',
        isRecurring: true,
        paymentMethod: '**** 4242',
        category: 'Education'
      },
      {
        id: 'pi_1122334455',
        campaignId: 'camp_003',
        campaignTitle: 'Clean Water Project for Village',
        amount: 200,
        status: 'completed',
        date: '2024-06-20',
        receiptUrl: '/api/donations/pi_1122334455/receipt',
        isRecurring: false,
        paymentMethod: '**** 1234',
        category: 'Community'
      },
      {
        id: 'pi_5566778899',
        campaignId: 'camp_004',
        campaignTitle: 'Animal Shelter Emergency Fund',
        amount: 75,
        status: 'completed',
        date: '2024-06-15',
        receiptUrl: '/api/donations/pi_5566778899/receipt',
        isRecurring: false,
        paymentMethod: '**** 4242',
        category: 'Animal Welfare'
      },
      {
        id: 'pi_9988776655',
        campaignId: 'camp_005',
        campaignTitle: 'Disaster Relief for Flood Victims',
        amount: 150,
        status: 'completed',
        date: '2024-06-10',
        receiptUrl: '/api/donations/pi_9988776655/receipt',
        isRecurring: false,
        paymentMethod: '**** 1234',
        category: 'Emergency'
      }
    ];

    return NextResponse.json({ donations }, { status: 200 });

  } catch (error) {
    console.error('Donations history API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
