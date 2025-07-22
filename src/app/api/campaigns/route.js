import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Mock campaign data - In a real app, this would come from a Campaign model
    const campaigns = [
      {
        id: 'camp_001',
        title: 'Emergency Surgery for Maria Lopez',
        description: 'Maria is a 35-year-old mother of three who urgently needs heart surgery. The family cannot afford the medical expenses and is seeking community support to save her life.',
        category: 'Medical',
        urgency: 'Critical',
        goal: 25000,
        raised: 15750,
        donorCount: 187,
        endDate: '2024-09-15',
        createdAt: '2024-06-15',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
        organizer: { name: 'Lopez Family', verified: true },
        tags: ['surgery', 'heart', 'mother', 'urgent'],
        recentDonations: [
          { donorName: 'Anonymous', amount: 100, timeAgo: '2 hours ago' },
          { donorName: 'John Smith', amount: 50, timeAgo: '5 hours ago' },
          { donorName: 'Sarah Wilson', amount: 75, timeAgo: '1 day ago' }
        ]
      },
      {
        id: 'camp_002',
        title: 'School Books for Rural Children',
        description: 'Providing essential textbooks and learning materials for 200 children in remote villages who lack access to quality educational resources.',
        category: 'Education',
        urgency: 'Medium',
        goal: 8000,
        raised: 5200,
        donorCount: 89,
        endDate: '2024-08-30',
        createdAt: '2024-05-20',
        image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400',
        organizer: { name: 'Rural Education Foundation', verified: true },
        tags: ['education', 'children', 'books', 'rural'],
        recentDonations: [
          { donorName: 'Education Supporter', amount: 200, timeAgo: '3 hours ago' },
          { donorName: 'Community Helper', amount: 25, timeAgo: '6 hours ago' }
        ]
      },
      {
        id: 'camp_003',
        title: 'Clean Water Project for Village',
        description: 'Installing a clean water system to provide safe drinking water for 500 families in a drought-affected region.',
        category: 'Community',
        urgency: 'High',
        goal: 45000,
        raised: 28900,
        donorCount: 324,
        endDate: '2024-10-01',
        createdAt: '2024-04-10',
        image: 'https://images.unsplash.com/photo-1541919329513-35f7af297129?w=400',
        organizer: { name: 'Water for All Initiative', verified: true },
        tags: ['water', 'community', 'health', 'infrastructure'],
        recentDonations: [
          { donorName: 'Water Advocate', amount: 500, timeAgo: '1 hour ago' },
          { donorName: 'Anonymous', amount: 150, timeAgo: '4 hours ago' }
        ]
      },
      {
        id: 'camp_004',
        title: 'Animal Shelter Emergency Fund',
        description: 'Local animal shelter needs urgent funding for medical care and housing for 150 rescued animals.',
        category: 'Animal Welfare',
        urgency: 'Critical',
        goal: 15000,
        raised: 9800,
        donorCount: 156,
        endDate: '2024-08-15',
        createdAt: '2024-06-01',
        image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
        organizer: { name: 'City Animal Shelter', verified: true },
        tags: ['animals', 'shelter', 'medical', 'rescue'],
        recentDonations: [
          { donorName: 'Animal Lover', amount: 75, timeAgo: '30 minutes ago' },
          { donorName: 'Pet Owner', amount: 40, timeAgo: '2 hours ago' }
        ]
      },
      {
        id: 'camp_005',
        title: 'Disaster Relief for Flood Victims',
        description: 'Providing immediate relief including food, shelter, and medical aid to families affected by recent flooding.',
        category: 'Emergency',
        urgency: 'Critical',
        goal: 35000,
        raised: 22100,
        donorCount: 278,
        endDate: '2024-08-01',
        createdAt: '2024-06-25',
        image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400',
        organizer: { name: 'Emergency Response Team', verified: true },
        tags: ['disaster', 'flood', 'emergency', 'relief'],
        recentDonations: [
          { donorName: 'Disaster Relief Fund', amount: 1000, timeAgo: '45 minutes ago' },
          { donorName: 'Community Group', amount: 250, timeAgo: '1 hour ago' }
        ]
      },
      {
        id: 'camp_006',
        title: 'Support for Elderly Care Center',
        description: 'Helping maintain quality care and services for 80 elderly residents who need daily assistance and medical care.',
        category: 'Elderly Care',
        urgency: 'Medium',
        goal: 20000,
        raised: 7500,
        donorCount: 67,
        endDate: '2024-09-30',
        createdAt: '2024-05-15',
        image: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=400',
        organizer: { name: 'Golden Years Care Center', verified: true },
        tags: ['elderly', 'care', 'medical', 'support'],
        recentDonations: [
          { donorName: 'Senior Supporter', amount: 100, timeAgo: '3 hours ago' },
          { donorName: 'Family Member', amount: 60, timeAgo: '5 hours ago' }
        ]
      }
    ];

    return NextResponse.json({ campaigns }, { status: 200 });

  } catch (error) {
    console.error('Campaigns API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
