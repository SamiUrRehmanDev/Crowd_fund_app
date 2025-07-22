import { NextResponse } from 'next/server';
import { AuthService } from '../../../../../lib/auth.js';
import AuditLog from '../../../../../lib/models/AuditLog.js';

export async function POST(request) {
  try {
    // Get token from Authorization header or cookie
    const authHeader = request.headers.get('Authorization');
    const cookieStore = request.cookies;
    const tokenFromCookie = cookieStore.get('admin_token')?.value;
    
    const token = authHeader?.replace('Bearer ', '') || tokenFromCookie;
    
    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 400 }
      );
    }

    // Verify token to get user ID
    const { user } = await AuthService.verifyAuth(token);
    
    // Perform logout
    await AuthService.logout(user._id, token);
    
    // Log logout
    await AuditLog.create({
      action: 'admin_logout',
      entity: 'User',
      entityId: user._id,
      performedBy: user._id,
      performedByRole: 'admin',
      description: `Admin logout: ${user.email}`,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      category: 'authentication',
      severity: 'low'
    });

    // Create response and clear cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    // Clear the authentication cookie
    response.cookies.set('admin_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/admin'
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
