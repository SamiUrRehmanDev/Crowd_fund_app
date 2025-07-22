import { NextResponse } from 'next/server';
import { AuthService } from '../../../../../lib/auth.js';
import AuditLog from '../../../../../lib/models/AuditLog.js';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get client information
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Attempt login
    const loginResult = await AuthService.login(email, password, ipAddress, userAgent);
    
    // Log successful login
    await AuditLog.create({
      action: 'admin_login_success',
      entity: 'User',
      entityId: loginResult.user._id,
      performedBy: loginResult.user._id,
      performedByRole: 'admin',
      description: `Admin login successful: ${email}`,
      ipAddress,
      userAgent,
      category: 'authentication',
      severity: 'low'
    });

    // Create response with secure cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: loginResult.user,
      token: loginResult.token
    });

    // Set HTTP-only cookie for token
    response.cookies.set('admin_token', loginResult.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    
    // Log failed login attempt
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    try {
      const { email } = await request.json();
      await AuditLog.create({
        action: 'admin_login_failed',
        entity: 'User',
        entityId: null,
        performedBy: null,
        performedByRole: 'anonymous',
        description: `Failed admin login attempt: ${email || 'unknown'}`,
        ipAddress,
        userAgent,
        category: 'security',
        severity: 'medium',
        metadata: { error: error.message }
      });
    } catch (auditError) {
      console.error('Audit log error:', auditError);
    }

    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}
