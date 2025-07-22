import { NextResponse } from 'next/server';
import { AuthService } from '../../../lib/auth.js';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    console.log('Testing login for:', email);
    
    const result = await AuthService.login(email, password);
    
    console.log('Login successful:', result.user.email);
    
    return NextResponse.json({
      success: true,
      message: 'Login test successful',
      user: result.user
    });
    
  } catch (error) {
    console.error('Login test error:', error.message);
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        details: 'Check server logs for more details'
      },
      { status: 400 }
    );
  }
}
