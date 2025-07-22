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

    // Mock favorite campaigns - In a real app, this would query a Favorites model
    const favorites = [
      {
        id: 'camp_001',
        title: 'Emergency Surgery for Maria Lopez',
        description: 'Maria is a 35-year-old mother of three who urgently needs heart surgery.',
        category: 'Medical',
        urgency: 'Critical',
        goal: 25000,
        raised: 15750,
        donorCount: 187,
        endDate: '2024-09-15',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
        organizer: { name: 'Lopez Family', verified: true },
        addedAt: '2024-06-25'
      },
      {
        id: 'camp_003',
        title: 'Clean Water Project for Village',
        description: 'Installing a clean water system to provide safe drinking water for 500 families.',
        category: 'Community',
        urgency: 'High',
        goal: 45000,
        raised: 28900,
        donorCount: 324,
        endDate: '2024-10-01',
        image: 'https://images.unsplash.com/photo-1541919329513-35f7af297129?w=400',
        organizer: { name: 'Water for All Initiative', verified: true },
        addedAt: '2024-06-20'
      },
      {
        id: 'camp_004',
        title: 'Animal Shelter Emergency Fund',
        description: 'Local animal shelter needs urgent funding for medical care and housing.',
        category: 'Animal Welfare',
        urgency: 'Critical',
        goal: 15000,
        raised: 9800,
        donorCount: 156,
        endDate: '2024-08-15',
        image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
        organizer: { name: 'City Animal Shelter', verified: true },
        addedAt: '2024-06-15'
      }
    ];

    return NextResponse.json({ favorites }, { status: 200 });

  } catch (error) {
    console.error('Favorites API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    // In a real app, this would:
    // 1. Check if campaign exists
    // 2. Check if already favorited
    // 3. Create new favorite record

    // Mock response
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

export async function DELETE(request: NextRequest) {
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

    // In a real app, this would remove the favorite record from the database

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
