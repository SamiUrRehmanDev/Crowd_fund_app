import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import AuditLog from '@/lib/models/AuditLog';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Build query
    const query = { deletedAt: { $exists: false } };
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      query.role = role;
    }
    
    if (status) {
      query.status = status;
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Execute queries
    const [users, totalUsers] = await Promise.all([
      User.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-password -passwordResetToken -passwordResetExpires')
        .lean(),
      User.countDocuments(query)
    ]);
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalUsers / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return NextResponse.json({
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNextPage,
        hasPrevPage,
        limit
      }
    });
    
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { 
      firstName, 
      lastName, 
      email, 
      role, 
      password,
      adminLevel,
      permissions 
    } = body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }
    
    // Create new user
    const userData = {
      firstName,
      lastName,
      email,
      role,
      password, // Note: Should be hashed in real implementation
      status: 'active',
      emailVerified: true // Admin created users are auto-verified
    };
    
    // Add admin-specific fields
    if (role === 'admin') {
      userData.adminLevel = adminLevel || 'moderator';
      userData.permissions = permissions || [];
    }
    
    const user = new User(userData);
    await user.save();
    
    // Log the action
    await AuditLog.create({
      action: 'user_created',
      entity: 'User',
      entityId: user._id,
      performedBy: request.userId, // Should come from auth middleware
      performedByRole: 'admin',
      description: `Created new ${role} user: ${email}`,
      category: 'user_management',
      severity: 'medium'
    });
    
    // Return user without sensitive data
    const safeUser = user.toSafeObject();
    
    return NextResponse.json({
      message: 'User created successfully',
      user: safeUser
    }, { status: 201 });
    
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
