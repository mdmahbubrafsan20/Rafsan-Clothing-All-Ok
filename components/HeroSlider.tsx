"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Banner } from "@/lib/banners";

const fallbackSlides = [
  {
    id: "fallback-1",
    image: "/fashion-placeholder.svg",
    alt: "Fashion collection 1",
    title: "Premium Fashion",
    description: "Discover our latest collection",
  },
  {
    id: "fallback-2",
    image: "/fashion-placeholder.svg",
    alt: "Fashion collection 2",
    title: "Modern Style",
    description: "Elevate your wardrobe",
  },
  {
    id: "fallback-3",
    image: "/fashion-placeholder.svg",
    alt: "Fashion collection 3",
    title: "Quality Materials",
    description: "Crafted with care",
  },
];

interface HeroSliderProps {
  /** Banners fetched server-side — no client-side data fetching needed. */
  banners: Banner[];
}

export default function HeroSlider({ banners }: HeroSliderProps) {
  const [index, setIndex] = useState(0);

  const slides = useMemo(() => {
    if (banners.length === 0) return fallbackSlides;
    return banners.map((b) => ({
      id: b.id,
      image: b.image_url,
      alt: b.title,
      title: b.title,
      description: b.description || "",
      link: b.link_url,
    }));
  }, [banners]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

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
    <div className="relative w-full h-[210px] sm:h-[220px] md:h-[280px] lg:h-[600px] overflow-hidden bg-gray-100 mb-4 md:mb-6 cursor-pointer">

      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Link
            href="/products"
            className="absolute inset-0 pointer-events-auto"
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className={`absolute w-full h-full object-cover object-center transition-opacity duration-700 ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </Link>
        </div>
      ))}

      {/* Navigation arrows */}
        <>
      <button
        onClick={goToPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/35 hover:bg-white/60 text-gray-800/80 p-1.5 rounded-full shadow-sm transition-all duration-200 z-10 hover:shadow"
        aria-label="Previous slide"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/35 hover:bg-white/60 text-gray-800/80 p-1.5 rounded-full shadow-sm transition-all duration-200 z-10 hover:shadow"
        aria-label="Next slide"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
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
      </>
    </div>
  );
}