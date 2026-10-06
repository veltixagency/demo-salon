import React from 'react';
import { ShieldCheck, Sparkles, Coffee, Heart, Award, ArrowRight } from 'lucide-react';
import { SalonSettings } from '../../types';
import { SafeImage } from '../common/SafeImage';

interface AboutPageProps {
  onOpenBooking: () => void;
  settings: SalonSettings;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenBooking, settings }) => {
  return (
    <div className="py-12 sm:py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#788C71]">
              The Demo Parlor Heritage
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-[#16281E] leading-tight">
              An Architectural Sanctuary for Hair & Wellness.
            </h1>
            <p className="text-sm sm:text-base text-[#526054] leading-relaxed font-light">
              Founded in 2018 in Beverly Hills, Demo Parlor was created to challenge the crowded, noisy salon model. We envisioned a tranquil retreat where guests receive undivided attention, bespoke precision artistry, and restorative scalp therapy without waiting rooms or hurried consultations.
            </p>
            <p className="text-sm sm:text-base text-[#526054] leading-relaxed font-light">
              Every appointment is scheduled on a dedicated time-grid to ensure zero crowding and complete privacy. Our artisans work with clean organic formulas, sustainably sourced botanicals, and Japanese scalp therapy rituals.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenBooking}
                className="bg-[#1E3527] hover:bg-[#14241A] text-white px-7 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition shadow"
              >
                Reserve Your Appointment
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] border-4 border-white">
              <SafeImage
                src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1000&q=80"
                alt="Salon Interior Architecture"
                fallbackType="interior"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[#1E3527] text-white p-5 rounded-2xl shadow-xl hidden sm:block border border-[#C6A364]/30 max-w-[240px]">
              <span className="font-serif text-2xl font-bold text-[#C6A364] block">EST. 2018</span>
              <p className="text-[11px] text-[#CAD6C7] mt-1">
                Seven years of setting the gold standard in bespoke hair artistry.
              </p>
            </div>
          </div>
        </div>

        {/* The 4 Pillars */}
        <div className="pt-8 border-t border-[#E5DECf]">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#788C71]">
              Our Guiding Principles
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#16281E] mt-1">
              Elevating the Salon Ritual
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-7 rounded-3xl border border-[#E5DECf] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#EFECE5] text-[#1E3527] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#16281E]">Zero-Crowding Protocol</h3>
              <p className="text-xs text-[#6F7D71] leading-relaxed">
                By enforcing strict appointment times and staff schedule buffers, our floor remains serene, spacious, and intimate at all times.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-[#E5DECf] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#EFECE5] text-[#1E3527] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#16281E]">Organic & Clean Formulas</h3>
              <p className="text-xs text-[#6F7D71] leading-relaxed">
                We partner with Davines, Oribe, and Olaplex. Ammonia-free glosses and biodynamic essential oils ensure vibrant health without compromise.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-[#E5DECf] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#EFECE5] text-[#1E3527] flex items-center justify-center">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#16281E]">Hospitality & Lounge Bar</h3>
              <p className="text-xs text-[#6F7D71] leading-relaxed">
                Complimentary artisanal pour-over coffee, oat milk lattes, and sparkling mineral water served in fine glassware for every guest.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
