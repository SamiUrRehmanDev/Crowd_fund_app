'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardBody, Avatar, Button } from '@heroui/react';
import { StarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

export default function TestimonialSlider({ testimonials = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length, isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToTestimonial = (index) => {
    setCurrentIndex(index);
  };

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No testimonials available.</p>
      </div>
    );
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div 
      className="relative max-w-4xl mx-auto"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Card className="bg-white shadow-lg">
              <CardBody className="p-8 lg:p-12">
                <div className="text-center">
                  {/* Quote Icon */}
                  <div className="text-6xl text-blue-600 opacity-20 mb-4">
                    "
                  </div>

                  {/* Rating */}
                  {testimonials[currentIndex].rating && (
                    <div className="flex justify-center gap-1 mb-6">
                      {renderStars(testimonials[currentIndex].rating)}
                    </div>
                  )}

                  {/* Message */}
                  <blockquote className="text-lg lg:text-xl text-gray-700 italic leading-relaxed mb-8 max-w-3xl mx-auto">
                    "{testimonials[currentIndex].message}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex flex-col items-center">
                    <Avatar
                      src={testimonials[currentIndex].image}
                      name={testimonials[currentIndex].name}
                      size="lg"
                      className="mb-4"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-gray-600">
                        {testimonials[currentIndex].role}
                      </p>
                      {testimonials[currentIndex].company && (
                        <p className="text-sm text-gray-500">
                          {testimonials[currentIndex].company}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {testimonials.length > 1 && (
          <>
            <Button
              isIconOnly
              variant="flat"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm shadow-lg z-10"
              onPress={prevTestimonial}
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </Button>
            <Button
              isIconOnly
              variant="flat"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm shadow-lg z-10"
              onPress={nextTestimonial}
            >
              <ChevronRightIcon className="w-5 h-5" />
            </Button>
          </>
        )}
      </div>

      {/* Pagination Dots */}
      {testimonials.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-blue-600 scale-110'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {testimonials.length > 1 && isAutoPlaying && (
        <div className="w-full bg-gray-200 h-1 rounded-full mt-4 overflow-hidden">
          <motion.div
            className="h-full bg-blue-600 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 5, ease: 'linear' }}
            key={currentIndex}
          />
        </div>
      )}
    </div>
  );
}
