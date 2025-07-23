import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET() {
  try {
    await connectDB();
    
    const allUsers = await User.countDocuments({});
    const nonDeletedUsers = await User.countDocuments({ deletedAt: { $exists: false } });
    const deletedUsers = await User.countDocuments({ deletedAt: { $exists: true } });
    
    const usersByRole = await User.aggregate([
      { $match: { deletedAt: { $exists: false } } },
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    
    const usersByStatus = await User.aggregate([
      { $match: { deletedAt: { $exists: false } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const sampleUsers = await User.find({ deletedAt: { $exists: false } })
      .select('email role status createdAt deletedAt')
      .limit(5)
      .lean();

    return NextResponse.json({
      summary: {
        allUsers,
        nonDeletedUsers,
        deletedUsers
      },
      breakdowns: {
        byRole: usersByRole,
        byStatus: usersByStatus
      },
      sampleUsers
    });
  } catch (error) {
    console.error('Debug users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user debug info' },
      { status: 500 }
    );
  }
}
