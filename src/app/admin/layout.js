'use client';

import React from 'react';
import AdminAuthProvider from '../../components/admin/AdminAuthProvider';

export default function AdminRootLayout({ children }) {
  return (
    <AdminAuthProvider>
      {children}
    </AdminAuthProvider>
  );
}
