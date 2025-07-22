'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    // Redirect logic
    if (!loading) {
      const isLoginPage = pathname === '/admin/login';
      const isAdminRoute = pathname.startsWith('/admin');

      if (!authenticated && isAdminRoute && !isLoginPage) {
        router.push('/admin/login');
      } else if (authenticated && isLoginPage) {
        router.push('/admin');
      }
    }
  }, [authenticated, loading, pathname, router]);

  const checkAuth = async () => {
    try {
      setLoading(true);
      
      // First check localStorage for cached user data
      const cachedUser = localStorage.getItem('admin_user');
      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
      }

      // Verify with server
      const response = await fetch('/api/admin/auth/verify', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setAuthenticated(true);
        
        // Update localStorage
        localStorage.setItem('admin_user', JSON.stringify(data.user));
      } else {
        // Clear invalid session
        setUser(null);
        setAuthenticated(false);
        localStorage.removeItem('admin_user');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setAuthenticated(false);
      localStorage.removeItem('admin_user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setAuthenticated(true);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state regardless of API response
      setUser(null);
      setAuthenticated(false);
      localStorage.removeItem('admin_user');
      router.push('/admin/login');
    }
  };

  const refreshToken = async () => {
    try {
      const response = await fetch('/api/admin/auth/verify', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        return true;
      } else {
        await logout();
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      await logout();
      return false;
    }
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.adminLevel === 'super') return true; // Super admin has all permissions
    return user.permissions && user.permissions.includes(permission);
  };

  const hasAdminLevel = (level) => {
    if (!user) return false;
    const levels = ['moderator', 'manager', 'super'];
    const userLevel = levels.indexOf(user.adminLevel);
    const requiredLevel = levels.indexOf(level);
    return userLevel >= requiredLevel;
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('admin_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    authenticated,
    login,
    logout,
    checkAuth,
    refreshToken,
    hasPermission,
    hasAdminLevel,
    updateUser
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthProvider;
