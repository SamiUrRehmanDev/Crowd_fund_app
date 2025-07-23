import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import AuditLog from '@/lib/models/AuditLog';
import { withAuth } from '@/lib/middleware';

export const GET = withAuth(async (request) => {
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
    
    console.log('Initial search params:', {
      page, limit, search, role, status, sortBy, sortOrder
    });
    
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
    
    console.log('Final query:', JSON.stringify(query, null, 2));
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Execute queries
    const [users, totalUsers, totalUsersInDB, totalNonDeletedUsers] = await Promise.all([
      User.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-password -passwordResetToken -passwordResetExpires')
        .lean(),
      User.countDocuments(query),
      User.countDocuments({}), // Total users including deleted
      User.countDocuments({ deletedAt: { $exists: false } }) // All non-deleted users
    ]);
    
    console.log('User query result:', {
      query,
      totalUsers, // Users matching current query
      totalUsersInDB, // All users in database
      totalNonDeletedUsers, // All non-deleted users
      usersCount: users.length,
      page,
      limit,
      skip,
      sampleUsers: users.slice(0, 3).map(u => ({ 
        email: u.email, 
        role: u.role, 
        status: u.status,
        deletedAt: u.deletedAt,
        createdAt: u.createdAt 
      }))
    });
    
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
});

export const POST = withAuth(async (request) => {
  try {
    console.log('POST /api/admin/users called');
    await connectDB();
    console.log('Database connected');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { 
      firstName, 
      lastName, 
      email, 
      role, 
      password,
      adminLevel,
      permissions 
    } = body;

    console.log('Extracted fields:', { firstName, lastName, email, role });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists with email:', email);
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
      password, // Will be hashed by the User model pre-save hook
      status: 'active',
      emailVerified: true // Admin created users are auto-verified
    };

    console.log('User data before admin fields:', userData);

    // Add admin-specific fields
    if (role === 'admin') {
      userData.adminLevel = adminLevel || 'moderator';
      userData.permissions = permissions || [];
      console.log('Added admin fields:', { adminLevel: userData.adminLevel, permissions: userData.permissions });
    }

    console.log('Final user data:', userData);

    const user = new User(userData);
    console.log('User instance created');
    
    await user.save();
    console.log('User saved successfully with ID:', user._id);
    
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
});
