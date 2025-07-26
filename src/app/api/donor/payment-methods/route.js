import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Mock saved payment methods - In a real app, this would query Stripe customer data
    const paymentMethods = [
      {
        id: 'pm_1234567890',
        type: 'card',
        card: {
          brand: 'visa',
          last4: '4242',
          expiryMonth: 12,
          expiryYear: 2025,
        },
        isDefault: true,
        createdAt: '2024-06-01'
      },
      {
        id: 'pm_0987654321',
        type: 'card',
        card: {
          brand: 'mastercard',
          last4: '1234',
          expiryMonth: 8,
          expiryYear: 2026,
        },
        isDefault: false,
        createdAt: '2024-05-15'
      }
    ];

    return NextResponse.json({ paymentMethods }, { status: 200 });

  } catch (error) {
    console.error('Payment methods API error:', error);
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

    const { paymentMethodId, setAsDefault } = await request.json();

    if (!paymentMethodId) {
      return NextResponse.json(
        { error: 'Payment method ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // In a real app, you would:
    // 1. Attach payment method to customer
    // 2. Set as default if requested
    // 3. Save to database

    // Mock response
    const savedPaymentMethod = {
      id: paymentMethodId,
      type: 'card',
      card: {
        brand: 'visa',
        last4: '4242',
        expiryMonth: 12,
        expiryYear: 2025,
      },
      isDefault: setAsDefault || false,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({ 
      paymentMethod: savedPaymentMethod,
      message: 'Payment method saved successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Save payment method API error:', error);
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
    const paymentMethodId = searchParams.get('id');

    if (!paymentMethodId) {
      return NextResponse.json(
        { error: 'Payment method ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // In a real app, you would detach the payment method from Stripe customer
    // await stripe.paymentMethods.detach(paymentMethodId);

    return NextResponse.json({ 
      message: 'Payment method removed successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Delete payment method API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
