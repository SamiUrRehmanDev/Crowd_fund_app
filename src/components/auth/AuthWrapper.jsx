'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '@/types';
export default function AuthWrapper({ 
  children, 
  requireAuth = true, 
  allowedRoles = [], 
  redirectTo = '/auth/signin' 
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (requireAuth && status === 'unauthenticated') {
      router.push(redirectTo);
      return;
    }

    if (
      session && 
      allowedRoles.length > 0 && 
      !allowedRoles.includes(session.user.role)
    ) {
      // Redirect based on user role if they don't have access
      switch (session.user.role) {
        case UserRole.ADMIN:
          router.push('/admin');
          break;
        case UserRole.VOLUNTEER:
          router.push('/volunteer');
          break;
        case UserRole.DONEE:
          router.push('/donee');
          break;
        default:
          router.push('/donor');
      }
    }
  }, [session, status, requireAuth, allowedRoles, router, redirectTo]);

  // Show loading spinner while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if authentication is required but user is not authenticated
  if (requireAuth && status === 'unauthenticated') {
    return null;
  }

  // Don't render children if user doesn't have required role
  if (
    session && 
    allowedRoles.length > 0 && 
    !allowedRoles.includes(session.user.role)
  ) {
    return null;
  }

  return <>{children}</>;
}
