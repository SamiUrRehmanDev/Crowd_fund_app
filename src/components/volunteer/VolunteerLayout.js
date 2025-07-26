'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ClockIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  TrophyIcon,
  BellIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const menuItems = [
  {
    label: 'Dashboard',
    href: '/volunteer',
    icon: HomeIcon,
    description: 'Overview and stats'
  },
  {
    label: 'Find Tasks',
    href: '/volunteer/tasks',
    icon: ClipboardDocumentCheckIcon,
    description: 'Browse available tasks'
  },
  {
    label: 'Verifications',
    href: '/volunteer/verifications',
    icon: ShieldCheckIcon,
    description: 'Review and verify cases'
  },
  {
    label: 'Availability',
    href: '/volunteer/availability',
    icon: CalendarDaysIcon,
    description: 'Manage your schedule'
  },
  {
    label: 'Progress Reports',
    href: '/volunteer/reports',
    icon: DocumentTextIcon,
    description: 'Submit task progress'
  },
  {
    label: 'Certificates',
    href: '/volunteer/certificates',
    icon: TrophyIcon,
    description: 'View achievements'
  },
  {
    label: 'Communications',
    href: '/volunteer/communications',
    icon: ChatBubbleLeftRightIcon,
    description: 'Messages and alerts'
  },
  {
    label: 'Notifications',
    href: '/volunteer/notifications',
    icon: BellIcon,
    description: 'All notifications'
  }
];

export default function VolunteerLayout({ children }) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [volunteerStatus, setVolunteerStatus] = useState('active');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (session?.user?.role === 'volunteer') {
      fetchVolunteerStatus();
      fetchNotifications();
    }
  }, [session]);

  const fetchVolunteerStatus = async () => {
    try {
      const response = await fetch('/api/volunteer/status');
      if (response.ok) {
        const data = await response.json();
        setVolunteerStatus(data.status || 'active');
      } else {
        console.error('Failed to fetch volunteer status:', response.status);
        setVolunteerStatus('active'); // Default fallback
      }
    } catch (error) {
      console.error('Error fetching volunteer status:', error);
      setVolunteerStatus('active'); // Default fallback
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/volunteer/notifications?limit=5');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      } else {
        console.error('Failed to fetch notifications:', response.status);
        setNotifications([]); // Default fallback
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]); // Default fallback
    }
  };

  const toggleVolunteerStatus = async () => {
    const newStatus = volunteerStatus === 'active' ? 'inactive' : 'active';
    try {
      const response = await fetch('/api/volunteer/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        setVolunteerStatus(newStatus);
      } else {
        console.error('Failed to update volunteer status:', response.status);
      }
    } catch (error) {
      console.error('Error updating volunteer status:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:static lg:inset-0"
          >
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">VF</span>
                  </div>
                  <span className="ml-2 text-xl font-semibold text-gray-900">
                    Volunteer Portal
                  </span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <div>
                        <div>{item.label}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              {/* Volunteer Status */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Status</span>
                  <div className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium ${
                    volunteerStatus === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      volunteerStatus === 'active' ? 'bg-green-500' : 'bg-gray-500'
                    }`}></div>
                    <span className="capitalize">{volunteerStatus}</span>
                  </div>
                </div>
                <button
                  onClick={toggleVolunteerStatus}
                  className={`w-full text-xs px-3 py-1 rounded-md transition-colors ${
                    volunteerStatus === 'active'
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {volunteerStatus === 'active' ? 'Go Inactive' : 'Go Active'}
                </button>
              </div>

              {/* User info */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <UserCircleIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">{session?.user?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">Volunteer</p>
                    </div>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md"
                    title="Logout"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">
                {menuItems.find(item => pathname === item.href)?.label || 'Volunteer Portal'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => router.push('/volunteer/notifications')}
                  className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md relative"
                >
                  <BellIcon className="w-5 h-5" />
                  {notifications.filter(n => !n.isRead).length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              </div>

              {/* Profile */}
              <Link
                href="/profile"
                className="flex items-center space-x-2 p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md"
              >
                <UserCircleIcon className="w-5 h-5" />
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {session?.user?.name}
                </span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-purple-50 via-white to-blue-50">
          {children}
        </main>
      </div>
    </div>
  );
}
