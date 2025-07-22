import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AuthService } from './auth.js';

export function withAuth(handler, options = {}) {
  return async (request, context) => {
    try {
      // Get token from Authorization header or cookie
      const authHeader = request.headers.get('Authorization');
      const cookieStore = await cookies();
      const tokenFromCookie = cookieStore.get('admin_token')?.value;
      
      const token = authHeader?.replace('Bearer ', '') || tokenFromCookie;
      
      if (!token) {
        return NextResponse.json(
          { error: 'Access denied. No token provided.' },
          { status: 401 }
        );
      }

      // Verify token and get user
      const { user, decoded } = await AuthService.verifyAuth(token);
      
      // Check admin permissions
      if (user.role !== 'admin') {
        return NextResponse.json(
          { error: 'Access denied. Admin privileges required.' },
          { status: 403 }
        );
      }

      // Check specific permissions if required
      if (options.permissions && options.permissions.length > 0) {
        const hasPermission = options.permissions.some(permission => 
          user.permissions.includes(permission)
        );
        
        if (!hasPermission) {
          return NextResponse.json(
            { error: 'Access denied. Insufficient permissions.' },
            { status: 403 }
          );
        }
      }

      // Check admin level if required
      if (options.adminLevel) {
        const adminLevels = ['moderator', 'manager', 'super'];
        const userLevel = adminLevels.indexOf(user.adminLevel);
        const requiredLevel = adminLevels.indexOf(options.adminLevel);
        
        if (userLevel < requiredLevel) {
          return NextResponse.json(
            { error: 'Access denied. Higher admin level required.' },
            { status: 403 }
          );
        }
      }

      // Add user info to request for use in handler
      request.user = user;
      request.userId = user._id;
      request.adminLevel = user.adminLevel;
      request.permissions = user.permissions;

      // Call the original handler
      return handler(request, context);
      
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
  };
}

export function requirePermissions(...permissions) {
  return function(handler) {
    return withAuth(handler, { permissions });
  };
}

export function requireAdminLevel(adminLevel) {
  return function(handler) {
    return withAuth(handler, { adminLevel });
  };
}

// Rate limiting middleware
export function withRateLimit(handler, options = {}) {
  const { maxRequests = 100, windowMs = 15 * 60 * 1000 } = options; // 100 requests per 15 minutes
  const requests = new Map();

  return async (request, context) => {
    const ip = request.headers.get('x-forwarded-for') || 
              request.headers.get('x-real-ip') || 
              'unknown';
    
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old entries
    if (requests.has(ip)) {
      const userRequests = requests.get(ip).filter(time => time > windowStart);
      requests.set(ip, userRequests);
    }
    
    // Check rate limit
    const userRequests = requests.get(ip) || [];
    
    if (userRequests.length >= maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Add current request
    userRequests.push(now);
    requests.set(ip, userRequests);
    
    return handler(request, context);
  };
}

// CORS middleware for admin API
export function withCORS(handler, options = {}) {
  const {
    origin = process.env.ADMIN_FRONTEND_URL || 'http://localhost:3000',
    methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders = ['Content-Type', 'Authorization']
  } = options;

  return async (request, context) => {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': methods.join(', '),
          'Access-Control-Allow-Headers': allowedHeaders.join(', '),
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    const response = await handler(request, context);
    
    // Add CORS headers to response
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', methods.join(', '));
    response.headers.set('Access-Control-Allow-Headers', allowedHeaders.join(', '));
    
    return response;
  };
}

export default withAuth;
