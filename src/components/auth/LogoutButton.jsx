'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function LogoutButton({ 
  className = '', 
  children, 
  variant = 'button',
  redirectTo = '/'
}) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: redirectTo 
      });
      router.push(redirectTo);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (variant === 'link') {
    return (
      <button
        onClick={handleLogout}
        className={`inline-flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors ${className}`}
      >
        <ArrowRightOnRectangleIcon className="w-4 h-4" />
        <span>{children || 'Sign Out'}</span>
      </button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleLogout}
      className={`inline-flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-700 bg-white hover:bg-red-50 rounded-lg font-medium transition-colors ${className}`}
    >
      <ArrowRightOnRectangleIcon className="w-4 h-4" />
      <span>{children || 'Sign Out'}</span>
    </motion.button>
  );
}
