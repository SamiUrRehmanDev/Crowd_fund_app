import { NextResponse } from 'next/server';
import crypto from 'crypto';
// TODO: Re-enable MongoDB once packages are installed
// import connectDB from '../../../../lib/mongodb.js';
// import User from '../../../../lib/models/User.js';
// TODO: Re-enable email once packages are installed
// import { sendPasswordResetEmail } from '../../../../lib/email.js';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // TODO: Replace with real database lookup once MongoDB packages are installed
    // For now, simulate password reset email
    console.log('Password reset request for email:', email);

    // Always return success to prevent email enumeration attacks
    return NextResponse.json(
      { message: 'If an account with this email exists, we have sent a password reset link. (Demo mode - install authentication packages for real functionality)' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
