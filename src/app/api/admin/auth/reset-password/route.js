import { NextResponse } from 'next/server';
import { AuthService } from '../../../../../lib/auth.js';
import AuditLog from '../../../../../lib/models/AuditLog.js';

export async function POST(request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const result = await AuthService.requestPasswordReset(email);
    
    // Log password reset request
    await AuditLog.create({
      action: 'admin_password_reset_requested',
      entity: 'User',
      entityId: null,
      performedBy: null,
      performedByRole: 'anonymous',
      description: `Password reset requested for: ${email}`,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      category: 'security',
      severity: 'low'
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { token, newPassword } = await request.json();
    
    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Reset token and new password are required' },
        { status: 400 }
      );
    }

    const result = await AuthService.resetPassword(token, newPassword);
    
    // Log successful password reset
    await AuditLog.create({
      action: 'admin_password_reset_completed',
      entity: 'User',
      entityId: null, // We don't have user ID at this point
      performedBy: null,
      performedByRole: 'anonymous',
      description: 'Admin password reset completed',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      category: 'security',
      severity: 'medium'
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
