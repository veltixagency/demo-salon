import React from 'react';
import { UserCheck, Sparkles, Wind, HeartHandshake, ArrowRight } from 'lucide-react';
import { SafeImage } from '../common/SafeImage';

interface ExperienceSectionProps {
  onLearnMore: () => void;
  onBookAppointment: () => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  onLearnMore,
  onBookAppointment,
}) => {
  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-[#F5F1E8] border-y border-[#E5DECf] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          
          {/* Left Column: Salon Interior Photo + Deep Forest Green Card */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Salon Interior Photo */}
            <div className="rounded-3xl overflow-hidden shadow-lg h-60 sm:h-auto min-h-[240px] sm:min-h-[300px] relative group">
              <SafeImage
                src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=80"
                alt="Demo Parlor Luxury Salon Interior"
                fallbackType="interior"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-medium text-[#1E3527] shadow-xs">
                Beverly Hills Flagship Sanctuary
              </div>
            </div>

            {/* Deep Green Experience Card (Exact match to image) */}
            <div className="bg-[#1E3527] text-[#FAF7F2] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
              <div>
                <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-[0.25em] text-[#A7BC9F] block mb-2 sm:mb-3">
                  The Demo Parlor Experience
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium leading-tight text-[#FAF7F2] mb-3 sm:mb-4">
                  Luxury Care, <br />
                  <span className="italic">Expert Hands.</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#CAD6C7] leading-relaxed font-light">
                  From modern cuts to rejuvenating treatments, we create a personalized experience just for you. Every detail is curated for calm and perfection.
                </p>
              </div>

              <div className="pt-6 sm:pt-8">
                <button
                  onClick={onLearnMore}
                  className="inline-flex items-center gap-2 border border-[#94A88E] text-[#FAF7F2] hover:bg-[#FAF7F2] hover:text-[#1E3527] active:scale-95 px-5 sm:px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition duration-300"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: WHY CHOOSE US (4 feature items + Barber photo with EST 2018 badge) */}
          <div className="lg:col-span-6 bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#E8E1D2] shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#788C71] block mb-5 sm:mb-6">
                Why Choose Us
              </span>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* 4 Feature Cards */}
                <div className="md:col-span-7 space-y-4 sm:space-y-5">
                  {/* Feature 1 */}
                  <div className="flex items-start gap-3 sm:gap-3.5">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#E8E2D5] text-[#1E3527] flex items-center justify-center shrink-0">
                      <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-[#16281E]">Skilled Professionals</h4>
                      <p className="text-[11px] sm:text-xs text-[#6F7D71] mt-0.5 leading-relaxed">
                        Certified & experienced stylists and master barbers with international academy training.
                      </p>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex items-start gap-3 sm:gap-3.5">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#E8E2D5] text-[#1E3527] flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-[#16281E]">Premium Products</h4>
                      <p className="text-[11px] sm:text-xs text-[#6F7D71] mt-0.5 leading-relaxed">
                        We use only the best salon-grade formulas from Oribe, Kérastase, and Davines.
                      </p>
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="flex items-start gap-3 sm:gap-3.5">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#E8E2D5] text-[#1E3527] flex items-center justify-center shrink-0">
                      <Wind className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-[#16281E]">Relaxing Atmosphere</h4>
                      <p className="text-[11px] sm:text-xs text-[#6F7D71] mt-0.5 leading-relaxed">
                        A calm, serene acoustic space to unwind with craft espresso or herbal infusion teas.
                      </p>
                    </div>
                  </div>

                  {/* Feature 4 */}
                  <div className="flex items-start gap-3 sm:gap-3.5">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#E8E2D5] text-[#1E3527] flex items-center justify-center shrink-0">
                      <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-[#16281E]">Personalized Service</h4>
                      <p className="text-[11px] sm:text-xs text-[#6F7D71] mt-0.5 leading-relaxed">
                        Tailored to your facial features, lifestyle, hair texture, and individual preferences.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Barber Photo with EST. 2018 Badge */}
                <div className="md:col-span-5 relative mt-2 md:mt-0">
                  <div className="rounded-2xl overflow-hidden aspect-[4/5] relative shadow-md">
                    <SafeImage
                      src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=700&q=80"
                      alt="Demo Parlor Barber Craft"
                      fallbackType="barber"
                      className="w-full h-full object-cover"
                    />

                    {/* Circular EST. 2018 Badge (Matching image) */}
                    <div className="absolute top-3 left-3 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#14241A] text-white flex flex-col items-center justify-center shadow-lg border border-[#C6A364]/40">
                      <span className="text-[7.5px] sm:text-[8px] uppercase tracking-wider text-[#A5B9A6] leading-none">Est.</span>
                      <span className="text-[10px] sm:text-[11px] font-bold text-[#FAF7F2] leading-none mt-0.5">2018</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom mini-bar */}
            <div className="pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-[#EAE3D5] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[11px] sm:text-xs text-[#788C71]">
                Zero crowding guarantee • Dedicated time slot booking
              </span>
              <button
                onClick={onBookAppointment}
                className="text-xs font-semibold text-[#1E3527] hover:underline self-start sm:self-auto"
              >
                Schedule Appointment →
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
