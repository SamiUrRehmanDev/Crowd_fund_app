import { NextResponse } from 'next/server';
import { AuthService } from '../../../../../lib/auth.js';

export async function GET(request) {
  try {
    // Get token from Authorization header or cookie
    const authHeader = request.headers.get('Authorization');
    const cookieStore = request.cookies;
    const tokenFromCookie = cookieStore.get('admin_token')?.value;
    
    const token = authHeader?.replace('Bearer ', '') || tokenFromCookie;
    
    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    // Verify token and get user
    const { user } = await AuthService.verifyAuth(token);

    return NextResponse.json({
      success: true,
      user,
      authenticated: true
    });

  } catch (error) {
    console.error('Verify auth error:', error);
    return NextResponse.json(
      { 
        error: error.message,
        authenticated: false 
      },
      { status: 401 }
    );
  }
}

export async function POST(request) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Refresh token
    const result = await AuthService.refreshToken(token);

    // Create response with new token
    const response = NextResponse.json({
      success: true,
      token: result.token,
      user: result.user
    });

    // Update cookie with new token
    response.cookies.set('admin_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/admin'
    });

    return response;

  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}
