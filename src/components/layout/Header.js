'use client';

import { useState, useEffect } from 'react';
// TODO: Re-enable NextAuth hooks once installed
// import { useSession, signIn, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Badge,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
} from '@heroui/react';
import {
  HeartIcon,
  BellIcon,
  MagnifyingGlassIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';

export default function Header() {
  // TODO: Replace with useSession once NextAuth is installed
  const session = null;
  const status = 'unauthenticated';
  const { user, isAuthenticated, setUser, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(3);

  useEffect(() => {
    if (session?.user && !isAuthenticated) {
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        profileImage: session.user.profileImage,
      });
    }
  }, [session, isAuthenticated, setUser]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
    logout();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/campaigns?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Browse Campaigns', href: '/campaigns' },
    { name: 'Start a Campaign', href: '/campaigns/create' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Success Stories', href: '/stories' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const userMenuItems = isAuthenticated
    ? [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'My Campaigns', href: '/my-campaigns' },
        { name: 'My Donations', href: '/my-donations' },
        { name: 'Profile Settings', href: '/profile' },
        { name: 'Sign Out', action: handleSignOut },
      ]
    : [
        { name: 'Sign In', href: '/auth/signin' },
        { name: 'Sign Up', href: '/auth/signup' },
      ];

  return (
    <>
      <Navbar
        onMenuOpenChange={setIsMenuOpen}
        className="bg-white/95 backdrop-blur-md border-b border-gray-200"
        maxWidth="full"
        height="4rem"
      >
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="sm:hidden"
          />
          <NavbarBrand>
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <HeartIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient">CrowdFund</span>
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link
              href="/campaigns"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Browse Campaigns
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              href="/campaigns/create"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Start Campaign
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              href="/how-it-works"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              How It Works
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              About
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              isIconOnly
              variant="light"
              onPress={() => setIsSearchOpen(true)}
              className="text-gray-600 hover:text-blue-600"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </Button>
          </NavbarItem>

          {isAuthenticated ? (
            <>
              <NavbarItem>
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly variant="light" className="relative">
                      <Badge content={unreadCount} color="danger" size="sm">
                        <BellIcon className="w-5 h-5 text-gray-600" />
                      </Badge>
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Notifications">
                    <DropdownItem key="notification1">
                      New donation received on your campaign
                    </DropdownItem>
                    <DropdownItem key="notification2">
                      Campaign goal reached!
                    </DropdownItem>
                    <DropdownItem key="notification3">
                      Weekly impact report available
                    </DropdownItem>
                    <DropdownItem key="view-all">
                      <Link href="/notifications" className="w-full">
                        View All Notifications
                      </Link>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </NavbarItem>

              <NavbarItem>
                <Dropdown>
                  <DropdownTrigger>
                    <Avatar
                      as="button"
                      className="transition-transform"
                      src={user?.profileImage}
                      name={user?.name}
                      size="sm"
                    />
                  </DropdownTrigger>
                  <DropdownMenu aria-label="User menu actions">
                    <DropdownItem key="profile" textValue="Profile">
                      <div className="flex flex-col">
                        <span className="font-semibold">{user?.name}</span>
                        <span className="text-sm text-gray-500">{user?.email}</span>
                      </div>
                    </DropdownItem>
                    <DropdownItem key="dashboard">
                      <Link href="/dashboard" className="w-full flex items-center">
                        <UserIcon className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownItem>
                    <DropdownItem key="profile-settings">
                      <Link href="/profile" className="w-full flex items-center">
                        <Cog6ToothIcon className="w-4 h-4 mr-2" />
                        Profile Settings
                      </Link>
                    </DropdownItem>
                    <DropdownItem
                      key="logout"
                      color="danger"
                      onPress={handleSignOut}
                    >
                      <div className="flex items-center">
                        <ArrowRightStartOnRectangleIcon className="w-4 h-4 mr-2" />
                        Sign Out
                      </div>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </NavbarItem>
            </>
          ) : (
            <NavbarItem className="hidden lg:flex">
              <Button
                as={Link}
                href="/auth/signin"
                variant="flat"
                className="mr-2"
              >
                Sign In
              </Button>
            </NavbarItem>
          )}

          <NavbarItem>
            <Button
              as={Link}
              href={isAuthenticated ? "/campaigns/create" : "/auth/signup"}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {isAuthenticated ? "Start Campaign" : "Get Started"}
            </Button>
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.name}-${index}`}>
              <Link
                href={item.href}
                className="w-full text-gray-700 hover:text-blue-600 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            </NavbarMenuItem>
          ))}
          {!isAuthenticated && (
            <>
              <NavbarMenuItem>
                <Link
                  href="/auth/signin"
                  className="w-full text-blue-600 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Link
                  href="/auth/signup"
                  className="w-full text-blue-600 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </NavbarMenuItem>
            </>
          )}
        </NavbarMenu>
      </Navbar>

      {/* Search Modal */}
      <Modal
        isOpen={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        size="2xl"
        placement="top"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Search Campaigns
              </ModalHeader>
              <ModalBody className="pb-6">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    autoFocus
                    placeholder="Search for campaigns, causes, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                    startContent={<MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />}
                  />
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Search
                  </Button>
                </form>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Popular searches:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Medical', 'Education', 'Disaster Relief', 'Community', 'Animals'].map((tag) => (
                      <Button
                        key={tag}
                        size="sm"
                        variant="flat"
                        onPress={() => {
                          setSearchQuery(tag);
                          handleSearch({ preventDefault: () => {} });
                          onClose();
                        }}
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
