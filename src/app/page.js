'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlayIcon, 
  HeartIcon, 
  UsersIcon, 
  GlobeAltIcon, 
  ShieldCheckIcon, 
  TrophyIcon,
  MagnifyingGlassIcon,
  BellIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  const [stats, setStats] = useState({
    totalRaised: 2450000,
    totalDonors: 12500,
    activeCampaigns: 1200,
    volunteers: 850,
  });

  const [email, setEmail] = useState('');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleNewsletterSignup = async (e) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  const features = [
    {
      icon: ShieldCheckIcon,
      title: "100% Secure",
      description: "Bank-level security with SSL encryption and fraud protection for all transactions."
    },
    {
      icon: TrophyIcon,
      title: "Verified Campaigns",
      description: "All campaigns are thoroughly verified by our team before going live on the platform."
    },
    {
      icon: GlobeAltIcon,
      title: "Global Reach",
      description: "Support causes worldwide with multi-currency support and international payment methods."
    },
    {
      icon: HeartIcon,
      title: "Impact Tracking",
      description: "See exactly how your donations are used with detailed progress reports and updates."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Donor",
      message: "CrowdFund made it so easy to support causes I care about. The transparency and regular updates give me confidence my donations are making a real difference.",
      image: "/images/testimonials/sarah.jpg",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Campaign Creator",
      message: "When my family faced unexpected medical bills, CrowdFund helped us raise the funds we needed. The platform is user-friendly and the support team was incredible.",
      image: "/images/testimonials/michael.jpg",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalRaised: prev.totalRaised + Math.floor(Math.random() * 1000),
        totalDonors: prev.totalDonors + Math.floor(Math.random() * 5),
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <HeartIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient">CrowdFund</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/campaigns" className="text-gray-700 hover:text-blue-600 font-medium">
                Browse Campaigns
              </Link>
              <Link href="/campaigns/create" className="text-gray-700 hover:text-blue-600 font-medium">
                Start Campaign
              </Link>
              <Link href="/how-it-works" className="text-gray-700 hover:text-blue-600 font-medium">
                How It Works
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium">
                About
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-blue-600">
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
              <button className="text-gray-600 hover:text-blue-600">
                <BellIcon className="w-5 h-5" />
              </button>
              <Link 
                href="/auth/signin"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Empower Communities,
                <span className="text-yellow-300"> Change Lives</span>
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed">
                Join thousands of compassionate people making a difference through secure, transparent crowdfunding. Every donation matters, every story counts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/campaigns"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 text-lg rounded-lg transition-colors text-center"
                >
                  Start Donating
                </Link>
                <Link
                  href="/campaigns/create"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-3 text-lg rounded-lg transition-colors text-center"
                >
                  Create Campaign
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-2xl flex items-center justify-center">
                  <span className="text-white text-lg">Hero Image Placeholder</span>
                </div>
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="absolute inset-0 m-auto w-20 h-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                >
                  <PlayIcon className="w-8 h-8 text-white ml-1" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Floating donation button */}
        <motion.div
          className="fixed right-6 bottom-6 z-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
        >
          <Link
            href="/donate"
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-bounce-gentle"
          >
            <HeartIcon className="w-6 h-6" />
            <span>Donate Now</span>
          </Link>
        </motion.div>
      </section>

      {/* Impact Metrics */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">
                ${(stats.totalRaised / 1000000).toFixed(1)}M+
              </div>
              <p className="text-gray-600 text-lg">Funds Raised</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="text-4xl lg:text-5xl font-bold text-green-600 mb-2">
                {stats.totalDonors.toLocaleString()}+
              </div>
              <p className="text-gray-600 text-lg">Happy Donors</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="text-4xl lg:text-5xl font-bold text-purple-600 mb-2">
                {stats.activeCampaigns}+
              </div>
              <p className="text-gray-600 text-lg">Active Campaigns</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="text-4xl lg:text-5xl font-bold text-orange-600 mb-2">
                {stats.volunteers}+
              </div>
              <p className="text-gray-600 text-lg">Volunteers</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Making a difference is simple. Follow these three easy steps to start your journey of giving.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Discover Causes</h3>
              <p className="text-gray-600 text-lg">
                Browse through verified campaigns and find causes that resonate with your values and passion.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Make a Donation</h3>
              <p className="text-gray-600 text-lg">
                Contribute any amount securely through our encrypted payment system. Every dollar counts!
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Track Impact</h3>
              <p className="text-gray-600 text-lg">
                Receive updates on how your donation is being used and see the real impact you're making.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose CrowdFund?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to transparency, security, and making sure your donations create maximum impact.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white max-w-3xl mx-auto"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Stay Updated on Our Impact
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Get weekly updates on new campaigns, success stories, and ways to make a difference in your community.
            </p>
            
            <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg text-gray-900"
                required
              />
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <HeartIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">CrowdFund</span>
              </Link>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Empowering communities worldwide through transparent, secure crowdfunding.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Get Started</h3>
              <ul className="space-y-3">
                <li><Link href="/campaigns" className="text-gray-300 hover:text-white">Browse Campaigns</Link></li>
                <li><Link href="/campaigns/create" className="text-gray-300 hover:text-white">Start a Campaign</Link></li>
                <li><Link href="/how-it-works" className="text-gray-300 hover:text-white">How It Works</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-3">
                <li><Link href="/help" className="text-gray-300 hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white">Contact Us</Link></li>
                <li><Link href="/safety" className="text-gray-300 hover:text-white">Safety & Security</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
                <li><Link href="/careers" className="text-gray-300 hover:text-white">Careers</Link></li>
                <li><Link href="/press" className="text-gray-300 hover:text-white">Press</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} CrowdFund Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">How Your Donation Helps</h3>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Video Player Placeholder</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
