import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb.js';
import User from '../../../../lib/models/User.js';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    console.log('🔍 Login attempt for email:', email);

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Connect to database
    console.log('🔗 Connecting to database...');
    await connectDB();
    console.log('✅ Database connected');

    // Find user by email
    console.log('🔍 Looking for user with email:', email.toLowerCase());
    const user = await User.findOne({ 
      email: email.toLowerCase() 
    }).select('+password');

    if (!user) {
      console.log('❌ User not found for email:', email);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('✅ User found:', { id: user._id, email: user.email, role: user.role });

    if (!user.isActive) {
      console.log('❌ User account is deactivated');
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 401 }
      );
    }

    // Verify password
    console.log('🔍 Verifying password...');
    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      console.log('❌ Invalid password for user:', email);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('✅ Password verified successfully');

    // Update last login
    console.log('📝 Updating last login...');
    user.lastLogin = new Date();
    await user.save();

    // Return user data (excluding password)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profileImage: user.profileImage,
      isEmailVerified: user.isEmailVerified,
      lastLogin: user.lastLogin,
    };

    console.log('✅ Login successful for user:', { id: userResponse.id, email: userResponse.email, role: userResponse.role });

    return NextResponse.json(
      { 
        message: 'Sign in successful',
        user: userResponse
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Sign in error:', error);
    
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
