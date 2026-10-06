import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, UserCheck, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { SalonSettings } from '../../types';
import { SafeImage } from '../common/SafeImage';

interface HeroSectionProps {
  onOpenBooking: () => void;
  onExploreServices: () => void;
  settings: SalonSettings;
}

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=85',
    headlinePrefix: 'Where Your Style',
    headlineHighlight: 'Becomes Your Signature.',
    subtext: 'Expert stylists. Premium services. A relaxing experience. Discover the best in hair, beauty and grooming at Demo Parlor.',
    floatingNote: "More than a salon, it's a lifestyle.",
  },
  {
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85',
    headlinePrefix: 'The Art of Haute Coiffure',
    headlineHighlight: '& Bespoke Color.',
    subtext: 'Precision French balayage, dimensional foils, and molecular gloss treatments tailored to your facial silhouette.',
    floatingNote: 'Confidence sculpted in every strand.',
  },
  {
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=85',
    headlinePrefix: 'Artisan Barbering',
    headlineHighlight: '& Head Spa Wellness.',
    subtext: 'Traditional straight-razor hot towel compresses, modern taper fades, and revitalizing Japanese scalp therapy.',
    floatingNote: 'Restorative luxury for the modern gentleman.',
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenBooking,
  onExploreServices,
  settings,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const touchStartX = useRef<number>(0);

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
  };

  const currentSlide = HERO_SLIDES[currentSlideIndex];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#F4EFE6] to-[#FAF7F2] border-b border-[#E8E2D5] py-8 sm:py-14 lg:py-20">
      {/* Background soft ambient accents */}
      <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-[#788C71]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 sm:w-80 h-72 sm:h-80 bg-[#1E3527]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-7 order-2 lg:order-1">
            {/* Eyebrow */}
            <div className="inline-block">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#788C71] bg-[#FAF7F2] px-3.5 py-1.5 rounded-full border border-[#DFD8CC] shadow-xs">
                Premium Salon & Barbershop
              </span>
            </div>

            {/* Main Headline with Serif Typography */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.5rem] leading-[1.15] text-[#16281E] font-medium tracking-tight">
              {currentSlide.headlinePrefix} <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#1E3527]">{currentSlide.headlineHighlight}</span>
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-lg text-[#556357] font-light leading-relaxed max-w-xl">
              {currentSlide.subtext}
            </p>

            {/* CTAs with mobile full-width optimization */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
              <button
                onClick={onOpenBooking}
                className="group flex items-center justify-center gap-3 bg-[#1E3527] hover:bg-[#14241A] active:scale-95 text-white px-6 sm:px-7 py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition"
              >
                <span>Book Your Appointment</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onExploreServices}
                className="px-6 py-3.5 rounded-full border border-[#2B3E30] text-[#1E3527] bg-transparent hover:bg-[#1E3527] hover:text-white active:scale-95 text-xs sm:text-sm font-medium tracking-wide text-center transition"
              >
                Explore Services
              </button>
            </div>

            {/* 3 Luxury Badges (Mobile-friendly responsive grid & Laptop layout) */}
            <div className="pt-5 sm:pt-6 border-t border-[#E5DECf] grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs text-[#465348]">
              <div className="flex items-center gap-2.5 bg-white/50 sm:bg-transparent p-2 sm:p-0 rounded-xl">
                <div className="w-7 h-7 sm:w-6 sm:h-6 rounded-full bg-[#E8E2D5] flex items-center justify-center text-[#1E3527] shrink-0">
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium text-[11px] sm:text-xs">Expert Professionals</span>
              </div>

              <div className="flex items-center gap-2.5 bg-white/50 sm:bg-transparent p-2 sm:p-0 rounded-xl">
                <div className="w-7 h-7 sm:w-6 sm:h-6 rounded-full bg-[#E8E2D5] flex items-center justify-center text-[#1E3527] shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium text-[11px] sm:text-xs">Premium Products</span>
              </div>

              <div className="flex items-center gap-2.5 bg-white/50 sm:bg-transparent p-2 sm:p-0 rounded-xl">
                <div className="w-7 h-7 sm:w-6 sm:h-6 rounded-full bg-[#E8E2D5] flex items-center justify-center text-[#1E3527] shrink-0">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium text-[11px] sm:text-xs">Clean & Safe Environment</span>
              </div>
            </div>
          </div>

          {/* Right Visual Image Card (Mobile swipe + laptop hover) */}
          <div className="lg:col-span-6 relative order-1 lg:order-2">
            <div 
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#E8E1D3] aspect-[4/3] sm:aspect-[14/11] border-4 border-white/80 select-none"
            >
              <SafeImage
                src={currentSlide.image}
                alt="Demo Salon Model Styling"
                fallbackType="hair"
                className="w-full h-full object-cover object-top transition duration-700 hover:scale-105"
              />

              {/* Gradient Vignette overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 pointer-events-none" />

              {/* Editorial cursive floating quote */}
              <div className="absolute top-5 sm:top-8 right-5 sm:right-8 text-right max-w-[180px] sm:max-w-[220px]">
                <p className="font-editorial italic text-xl sm:text-3xl text-white font-medium drop-shadow-md leading-tight">
                  "{currentSlide.floatingNote}"
                </p>
              </div>

              {/* Mobile-friendly Swipe Dots + Carousel controls */}
              <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 flex items-center gap-2.5 sm:gap-3 bg-[#14241A]/75 backdrop-blur-md px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/20 text-white text-xs shadow-lg">
                <button
                  onClick={prevSlide}
                  className="p-1 hover:text-[#C6A364] active:scale-90 transition focus:outline-none"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                <div className="flex items-center gap-1.5 px-1">
                  {HERO_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentSlideIndex 
                          ? 'w-4 bg-[#C6A364]' 
                          : 'w-1.5 bg-white/50'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  className="p-1 hover:text-[#C6A364] active:scale-90 transition focus:outline-none"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Bottom decorative badge */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 flex items-center gap-1.5 sm:gap-2 bg-white/90 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[#1E3527] text-[10px] sm:text-xs font-semibold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="hidden xs:inline">Open Today •</span>
                <span>Walk-ins & Bookings</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
