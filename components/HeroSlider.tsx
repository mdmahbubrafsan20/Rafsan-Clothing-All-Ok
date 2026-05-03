"use client";

import { useState, useEffect } from "react";

const slides = [
  {
    id: 1,
    image: "/fashion-placeholder.svg",
    alt: "Fashion collection 1",
    title: "Premium Fashion",
    description: "Discover our latest collection",
  },
  {
    id: 2,
    image: "/fashion-placeholder.svg",
    alt: "Fashion collection 2",
    title: "Modern Style",
    description: "Elevate your wardrobe",
  },
  {
    id: 3,
    image: "/fashion-placeholder.svg",
    alt: "Fashion collection 3",
    title: "Quality Materials",
    description: "Crafted with care",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (i: number) => {
    setIndex(i);
  };

  const goToPrev = () => {
    setIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-[160px] sm:h-[220px] md:h-[280px] overflow-hidden bg-gray-100 dark:bg-zinc-900 mb-6 max-md:bg-white">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className={`absolute w-full h-full object-cover transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              {slide.title}
            </h2>
            <p className="text-sm sm:text-base md:text-lg max-w-xl">
              {slide.description}
            </p>
            <button className="mt-4 px-6 py-2 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors text-sm">
              Shop Now
            </button>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-colors"
        aria-label="Previous slide"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-colors"
        aria-label="Next slide"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === index ? "bg-white scale-125" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}