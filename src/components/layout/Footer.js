'use client';

import { useState } from 'react';
import { Button, Input, Divider } from '@heroui/react';
import {
  HeartIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import {
  TwitterIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  YouTubeIcon,
} from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSignup = async (e) => {
    e.preventDefault();
    if (email) {
      // Newsletter signup logic here
      console.log('Newsletter signup:', email);
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const footerLinks = {
    'Get Started': [
      { name: 'Browse Campaigns', href: '/campaigns' },
      { name: 'Start a Campaign', href: '/campaigns/create' },
      { name: 'How It Works', href: '/how-it-works' },
      { name: 'Pricing', href: '/pricing' },
    ],
    'Support': [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Community Guidelines', href: '/guidelines' },
      { name: 'Safety & Security', href: '/safety' },
    ],
    'Company': [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Partnerships', href: '/partnerships' },
    ],
    'Legal': [
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Accessibility', href: '/accessibility' },
    ],
  };

  const socialLinks = [
    { 
      name: 'Twitter', 
      href: 'https://twitter.com/crowdfund', 
      icon: TwitterIcon,
      color: 'hover:text-blue-400'
    },
    { 
      name: 'Facebook', 
      href: 'https://facebook.com/crowdfund', 
      icon: FacebookIcon,
      color: 'hover:text-blue-600'
    },
    { 
      name: 'Instagram', 
      href: 'https://instagram.com/crowdfund', 
      icon: InstagramIcon,
      color: 'hover:text-pink-500'
    },
    { 
      name: 'LinkedIn', 
      href: 'https://linkedin.com/company/crowdfund', 
      icon: LinkedInIcon,
      color: 'hover:text-blue-700'
    },
    { 
      name: 'YouTube', 
      href: 'https://youtube.com/crowdfund', 
      icon: YouTubeIcon,
      color: 'hover:text-red-500'
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-6 gap-8">
          {/* Brand and Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <HeartIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">CrowdFund</span>
            </Link>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering communities worldwide through transparent, secure crowdfunding. 
              Join thousands of compassionate people making a real difference in the world.
            </p>

            {/* Contact Information */}
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-4 h-4" />
                <span>support@crowdfund.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPinIcon className="w-4 h-4" />
                <span>123 Charity Lane, San Francisco, CA 94105</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Divider className="my-12 bg-gray-700" />

        {/* Newsletter Signup */}
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Stay Updated on Our Impact
            </h3>
            <p className="text-gray-300">
              Get weekly updates on new campaigns, success stories, and ways to make a difference.
            </p>
          </div>
          
          <div>
            <form onSubmit={handleNewsletterSignup} className="flex gap-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                classNames={{
                  input: "bg-gray-800 border-gray-600 text-white",
                  inputWrapper: "bg-gray-800 border-gray-600 hover:border-gray-500 focus-within:border-blue-500",
                }}
                required
              />
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6"
                disabled={isSubscribed}
              >
                {isSubscribed ? 'Subscribed!' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>

        <Divider className="my-12 bg-gray-700" />

        {/* Bottom Footer */}
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
          {/* Copyright */}
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} CrowdFund Platform. All rights reserved.
          </div>

          {/* Trust Badges */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">$</span>
              </div>
              <span>PCI Compliant</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex space-x-4">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <Link
                  key={social.name}
                  href={social.href}
                  className={`text-gray-400 ${social.color} transition-colors duration-200`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  <IconComponent className="w-6 h-6" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Emergency Support Banner */}
      <div className="bg-red-600 py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
            <div className="text-white">
              <span className="font-semibold">Crisis Support Available 24/7</span>
              <span className="ml-2 text-red-100">Call our emergency helpline</span>
            </div>
            <div className="mt-2 sm:mt-0">
              <Link
                href="tel:+1-800-HELP-NOW"
                className="text-white font-bold hover:text-red-100 transition-colors"
              >
                1-800-HELP-NOW
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
