'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Progress,
  Chip,
  Avatar,
  Tooltip,
} from '@heroui/react';
import {
  HeartIcon,
  ShareIcon,
  ClockIcon,
  UsersIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';

export default function CampaignCard({ campaign, variant = 'default' }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const {
    id,
    title,
    description,
    image,
    goalAmount,
    raisedAmount,
    category,
    urgency,
    daysRemaining,
    donorCount,
    creator,
  } = campaign;

  const progressPercentage = Math.min((raisedAmount / goalAmount) * 100, 100);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'critical':
        return 'danger';
      case 'high':
        return 'warning';
      case 'medium':
        return 'primary';
      default:
        return 'success';
    }
  };

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    // Add to favorites logic here
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSharing(true);
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: description,
          url: `${window.location.origin}/campaigns/${id}`,
        });
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(`${window.location.origin}/campaigns/${id}`);
        // Show toast notification
      }
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength).replace(/\s+\S*$/, '') + '...';
  };

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="w-full"
      >
        <Card className="card-hover">
          <CardBody className="p-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Image
                  src={image || '/images/placeholder-campaign.jpg'}
                  alt={title}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 truncate pr-2">
                    {truncateText(title, 50)}
                  </h3>
                  <Chip
                    size="sm"
                    color={getUrgencyColor(urgency)}
                    variant="flat"
                  >
                    {urgency}
                  </Chip>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {formatCurrency(raisedAmount)} raised
                    </span>
                    <span className="text-gray-600">
                      {progressPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <Progress
                    value={progressPercentage}
                    color="primary"
                    size="sm"
                    className="max-w-full"
                  />
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{donorCount} donors</span>
                    <span>{daysRemaining} days left</span>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="w-full"
    >
      <Card className="card-hover max-w-sm mx-auto h-full">
        <CardHeader className="p-0 relative">
          <div className="relative w-full h-48">
            <Image
              src={image || '/images/placeholder-campaign.jpg'}
              alt={title}
              fill
              className="object-cover rounded-t-lg"
            />
            <div className="absolute top-3 left-3">
              <Chip
                color={getUrgencyColor(urgency)}
                variant="solid"
                size="sm"
                className="font-medium"
                startContent={urgency === 'Critical' ? <ExclamationTriangleIcon className="w-3 h-3" /> : null}
              >
                {urgency}
              </Chip>
            </div>
            <div className="absolute top-3 right-3 flex gap-2">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                className="bg-white/80 backdrop-blur-sm"
                onPress={handleFavorite}
              >
                {isFavorited ? (
                  <HeartSolidIcon className="w-4 h-4 text-red-500" />
                ) : (
                  <HeartIcon className="w-4 h-4 text-gray-600" />
                )}
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                className="bg-white/80 backdrop-blur-sm"
                onPress={handleShare}
                isLoading={isSharing}
              >
                <ShareIcon className="w-4 h-4 text-gray-600" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardBody className="p-4 space-y-4">
          <div>
            <Link href={`/campaigns/${id}`}>
              <h3 className="font-bold text-lg text-gray-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                {title}
              </h3>
            </Link>
            <p className="text-gray-600 text-sm mt-2 line-clamp-3">
              {description}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(raisedAmount)}
                </p>
                <p className="text-sm text-gray-600">
                  raised of {formatCurrency(goalAmount)} goal
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  {progressPercentage.toFixed(0)}%
                </p>
                <p className="text-sm text-gray-600">funded</p>
              </div>
            </div>

            <Progress
              value={progressPercentage}
              color="primary"
              size="md"
              className="max-w-full"
            />

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <UsersIcon className="w-4 h-4" />
                <span>{donorCount} donors</span>
              </div>
              <div className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                <span>{daysRemaining} days left</span>
              </div>
            </div>

            {creator && (
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <Avatar
                  src={creator.profileImage}
                  name={creator.name}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {creator.name}
                  </p>
                  <p className="text-xs text-gray-500">Campaign Creator</p>
                </div>
              </div>
            )}
          </div>
        </CardBody>

        <CardFooter className="p-4 pt-0">
          <div className="flex gap-2 w-full">
            <Button
              as={Link}
              href={`/campaigns/${id}`}
              variant="flat"
              color="primary"
              className="flex-1"
            >
              Learn More
            </Button>
            <Button
              as={Link}
              href={`/campaigns/${id}/donate`}
              color="primary"
              className="flex-1 font-semibold"
            >
              Donate Now
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
