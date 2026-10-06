import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ServiceCategory } from '../../types';
import { SafeImage } from '../common/SafeImage';

interface ServicesPreviewProps {
  onViewAllServices: () => void;
  onSelectCategory: (category: ServiceCategory) => void;
  onBookCategory: (category: ServiceCategory) => void;
}

interface CategoryCard {
  title: ServiceCategory;
  priceText: string;
  durationText: string;
  image: string;
  tagline: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    title: 'Hair',
    priceText: 'From $45',
    durationText: '30-90 min',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
    tagline: 'Cuts, Blowouts & Restorative Care',
  },
  {
    title: 'Barber',
    priceText: 'From $35',
    durationText: '30-60 min',
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80',
    tagline: 'Skin Fades & Hot Towel Shaves',
  },
  {
    title: 'Spa & Beauty',
    priceText: 'From $60',
    durationText: '45-120 min',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    tagline: 'Hydra Facials & Head Spa',
  },
  {
    title: 'Color & Highlights',
    priceText: 'From $85',
    durationText: '60-150 min',
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80',
    tagline: 'French Balayage & Glossing',
  },
  {
    title: 'Bridal',
    priceText: 'From $120',
    durationText: '90-180 min',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    tagline: 'Haute Coiffure & Veil Placement',
  },
];

export const ServicesPreview: React.FC<ServicesPreviewProps> = ({
  onViewAllServices,
  onSelectCategory,
  onBookCategory,
}) => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3">
          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-[#788C71] block mb-1.5">
              Our Services
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#16281E] font-medium tracking-tight">
              Look Good. Feel Amazing.
            </h2>
          </div>

          <button
            onClick={onViewAllServices}
            className="group flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-[#1E3527] hover:text-[#294734] transition shrink-0 self-start sm:self-auto"
          >
            <span>View All Services</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Swipe instruction hint on mobile screens */}
        <div className="flex sm:hidden items-center justify-between text-[11px] text-[#788C71] mb-3">
          <span>Swipe cards to explore</span>
          <span className="text-[10px] uppercase font-bold text-[#C6A364]">5 Signature Categories</span>
        </div>

        {/* 5 Cards Layout: Horizontal Snap Carousel on Mobile, 5-col Grid on Laptop */}
        <div className="flex overflow-x-auto snap-x snap-mandatory sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 pb-3 sm:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.title}
              onClick={() => onBookCategory(cat.title)}
              className="snap-center shrink-0 w-[78vw] max-w-[280px] sm:w-auto group cursor-pointer bg-[#F5F1E8] hover:bg-[#EFE9DC] active:bg-[#E8E1D2] border border-[#E5DECf] rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col active:scale-[0.98]"
            >
              {/* Image with subtle zoom on hover */}
              <div className="h-44 sm:h-48 w-full overflow-hidden relative bg-[#E2DBD0]">
                <SafeImage
                  src={cat.image}
                  alt={cat.title}
                  fallbackType={cat.title === 'Barber' ? 'barber' : cat.title === 'Spa & Beauty' ? 'spa' : 'hair'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition" />
                <span className="absolute top-3 left-3 bg-[#1E3527]/85 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  {cat.priceText}
                </span>
              </div>

              {/* Card Footer Info */}
              <div className="p-4 sm:p-5 flex items-center justify-between mt-auto">
                <div>
                  <h3 className="font-semibold text-base sm:text-lg text-[#16281E] group-hover:text-[#284934] transition">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#6F7D71] mt-0.5 font-medium">
                    {cat.durationText}
                  </p>
                </div>

                {/* Circle Arrow Action Button */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1E3527] text-white flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#14241A]">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
