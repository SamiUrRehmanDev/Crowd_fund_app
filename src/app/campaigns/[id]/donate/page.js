'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import {
  CurrencyDollarIcon,
  HeartIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon
} from '@heroicons/react/24/solid';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500];

export default function DonatePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id;
  
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'donor') {
      router.push('/auth/signin');
      return;
    }

    if (campaignId) {
      fetchCampaign();
    }
  }, [session, status, router, campaignId]);

  const fetchCampaign = async () => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`);
      if (response.ok) {
        const data = await response.json();
        setCampaign(data.campaign);
      } else {
        router.push('/donor/campaigns');
      }
    } catch (error) {
      console.error('Error fetching campaign:', error);
      router.push('/donor/campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Campaign not found</h2>
          <p className="text-gray-600 mb-4">The campaign you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/donor/campaigns')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Campaigns
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min((campaign.raised / campaign.goal) * 100, 100);
  const remainingAmount = campaign.goal - campaign.raised;
  const daysLeft = Math.max(0, Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Campaign Details */}
          <div className="space-y-6">
            {/* Campaign Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="mb-4">
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {campaign.category}
                </span>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {campaign.title}
              </h1>
              
              <p className="text-gray-600 mb-6">
                {campaign.description}
              </p>

              {/* Campaign Image */}
              {campaign.image && (
                <div className="mb-6">
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Progress Section */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>${campaign.raised.toLocaleString()} raised</span>
                  <span>${campaign.goal.toLocaleString()} goal</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{progressPercentage.toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">Funded</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{campaign.donorCount || 0}</p>
                    <p className="text-sm text-gray-600">Donors</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{daysLeft}</p>
                    <p className="text-sm text-gray-600">Days Left</p>
                  </div>
                </div>
              </div>

              {/* Organizer Info */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Campaign Organizer</h3>
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 rounded-full p-2">
                    <UserGroupIcon className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{campaign.organizer?.name || 'Anonymous'}</p>
                    <p className="text-sm text-gray-600">Verified Organizer</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Donations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Recent Donations</h3>
              <div className="space-y-3">
                {campaign.recentDonations?.length > 0 ? (
                  campaign.recentDonations.slice(0, 5).map((donation, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <HeartSolidIcon className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{donation.donorName}</p>
                          <p className="text-sm text-gray-600">{donation.timeAgo}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-green-600">${donation.amount}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-4">No donations yet. Be the first!</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Donation Form */}
          <div className="lg:sticky lg:top-8">
            <Elements stripe={stripePromise}>
              <DonationForm 
                campaign={campaign} 
                onSuccess={(donation) => {
                  router.push(`/donor/donation-success?donation=${donation.id}`);
                }}
              />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
}

// Donation Form Component
function DonationForm({ campaign, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const { data: session } = useSession();
  
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showCardForm, setShowCardForm] = useState(false);
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donationMessage, setDonationMessage] = useState('');

  useEffect(() => {
    fetchSavedCards();
  }, []);

  const fetchSavedCards = async () => {
    try {
      const response = await fetch('/api/donor/payment-methods');
      if (response.ok) {
        const data = await response.json();
        setSavedCards(data.paymentMethods || []);
      }
    } catch (error) {
      console.error('Error fetching saved cards:', error);
    }
  };

  const handleAmountSelect = (selectedAmount) => {
    setAmount(selectedAmount.toString());
    setIsCustom(false);
    setCustomAmount('');
  };

  const handleCustomAmount = (value) => {
    setCustomAmount(value);
    setAmount(value);
    setIsCustom(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      setError('Payment system not loaded. Please try again.');
      return;
    }

    const donationAmount = parseFloat(amount);
    if (!donationAmount || donationAmount < 1) {
      setError('Minimum donation amount is $1');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Create payment intent
      const response = await fetch('/api/donations/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: campaign.id,
          amount: donationAmount,
          isAnonymous,
          message: donationMessage,
          saveCard,
          useExistingCard: selectedCard || null
        })
      });

      const { clientSecret, error: backendError } = await response.json();
      
      if (backendError) {
        setError(backendError);
        return;
      }

      let confirmResult;

      if (selectedCard && !showCardForm) {
        // Use existing payment method
        confirmResult = await stripe.confirmCardPayment(clientSecret, {
          payment_method: selectedCard
        });
      } else {
        // Use new card
        const cardElement = elements.getElement(CardElement);
        
        confirmResult = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: session.user.name,
              email: session.user.email,
            },
          },
          setup_future_usage: saveCard ? 'off_session' : undefined
        });
      }

      if (confirmResult.error) {
        setError(confirmResult.error.message);
      } else {
        // Payment succeeded
        const donation = confirmResult.paymentIntent;
        onSuccess(donation);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const finalAmount = parseFloat(amount) || 0;
  const stripeFee = Math.max(0.30, finalAmount * 0.029); // Stripe fee calculation
  const totalAmount = finalAmount + stripeFee;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
    >
      <div className="flex items-center space-x-2 mb-6">
        <HeartSolidIcon className="h-6 w-6 text-red-500" />
        <h2 className="text-xl font-semibold text-gray-900">Make a Donation</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose Amount
          </label>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {PRESET_AMOUNTS.map((presetAmount) => (
              <button
                key={presetAmount}
                type="button"
                onClick={() => handleAmountSelect(presetAmount)}
                className={`p-3 border rounded-lg text-center font-medium transition-colors ${
                  amount === presetAmount.toString() && !isCustom
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                ${presetAmount}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              placeholder="Custom amount"
              value={customAmount}
              onChange={(e) => handleCustomAmount(e.target.value)}
              min="1"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Donation Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Leave a message (optional)
          </label>
          <textarea
            value={donationMessage}
            onChange={(e) => setDonationMessage(e.target.value)}
            placeholder="Share why this cause matters to you..."
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={500}
          />
        </div>

        {/* Anonymous Option */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="anonymous"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
            Donate anonymously
          </label>
        </div>

        {/* Payment Method Selection */}
        {savedCards.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Method
            </label>
            <div className="space-y-2">
              {savedCards.map((card) => (
                <div key={card.id} className="flex items-center">
                  <input
                    type="radio"
                    id={card.id}
                    name="paymentMethod"
                    value={card.id}
                    checked={selectedCard === card.id && !showCardForm}
                    onChange={() => {
                      setSelectedCard(card.id);
                      setShowCardForm(false);
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor={card.id} className="ml-2 block text-sm text-gray-700">
                    **** **** **** {card.last4} ({card.brand.toUpperCase()})
                  </label>
                </div>
              ))}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="newCard"
                  name="paymentMethod"
                  checked={showCardForm}
                  onChange={() => {
                    setShowCardForm(true);
                    setSelectedCard('');
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="newCard" className="ml-2 block text-sm text-gray-700">
                  Use a new card
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Card Form */}
        {(showCardForm || savedCards.length === 0) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Card Information
            </label>
            <div className="border border-gray-300 rounded-lg p-3">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                  },
                }}
              />
            </div>
            
            <div className="mt-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="saveCard"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-700">
                  Save this card for future donations
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Fee Information */}
        {finalAmount > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between text-sm">
              <span>Donation amount:</span>
              <span>${finalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Processing fee:</span>
              <span>${stripeFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-medium">
              <span>Total charge:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ShieldCheckIcon className="h-5 w-5 text-green-500" />
          <span>Your payment information is secure and encrypted</span>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <XMarkIcon className="h-5 w-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!stripe || isProcessing || !amount || parseFloat(amount) < 1}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <HeartSolidIcon className="h-5 w-5" />
              <span>
                Donate ${finalAmount ? finalAmount.toFixed(2) : '0.00'}
              </span>
            </>
          )}
        </button>
      </form>

      {/* Trust Indicators */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <ShieldCheckIcon className="h-4 w-4" />
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircleIcon className="h-4 w-4" />
            <span>Stripe Secured</span>
          </div>
          <div className="flex items-center space-x-1">
            <ClockIcon className="h-4 w-4" />
            <span>Instant Receipt</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
