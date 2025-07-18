import React, { useState, useEffect } from 'react';

// Placeholder images (replace with your actual image paths)
import heroImage1 from '../assets/hero1.jpg';
import heroImage2 from '../assets/hero2.jpg';
import heroImage3 from '../assets/hero3.jpg';

const slides = [
  { id: 1, src: heroImage1, alt: 'Hero Image 1' },
  { id: 2, src: heroImage2, alt: 'Hero Image 2' },
  { id: 3, src: heroImage3, alt: 'Hero Image 3' },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Handle manual navigation
  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className='bg-white'>
    
    <div className="relative w-full h-[400px] sm:h-[400px] lg:h-[500px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.src}
            alt={slide.alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/1920x600';
            }}
          />
        </div>
      ))}

      {/* Transparent Arrow Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-3 rounded-full transition-all duration-200"
        aria-label="Previous Slide"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-3 rounded-full transition-all duration-200"
        aria-label="Next Slide"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            The Apostolic Vicariate of Nepal
          </h3>
          <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
            The Apostolic Vicariate of Nepal is a territorial jurisdiction of the Catholic Church covering the countries of the United Arab Emirates, the Sultanate of Oman, and the Republic of Yemen. The Apostolic Vicar is Bishop Paolo Martinelli OFM Cap., who hails from Italy, and has his seat in Abu Dhabi, the capital of the United Arab Emirates.{' '}
            <a
              href="#"
              className="text-primary hover:underline transition-colors duration-200"
              aria-label="Read more about the Apostolic Vicariate"
            >
              Read more...
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;