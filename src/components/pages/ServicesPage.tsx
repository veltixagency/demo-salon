import React, { useState } from 'react';
import { Clock, Search, ArrowRight, Sparkles } from 'lucide-react';
import { Service, ServiceCategory } from '../../types';
import { SafeImage } from '../common/SafeImage';

interface ServicesPageProps {
  services: Service[];
  onBookService: (serviceId: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ services, onBookService }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Hair', 'Barber', 'Color & Highlights', 'Spa & Beauty', 'Bridal'];

  const filtered = services.filter(service => {
    if (!service.is_active) return false;
    if (selectedCategory !== 'All' && service.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return service.name.toLowerCase().includes(q) || service.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="py-12 sm:py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#788C71]">
            Our Signature Menu
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-[#16281E]">
            Artisan Hair, Color & Wellness Rituals
          </h1>
          <p className="text-sm sm:text-base text-[#657367] font-light leading-relaxed">
            Every service is tailored with precision and organic botanicals to elevate your natural beauty.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F2EDE1] p-3 rounded-2xl border border-[#E3DCce]">
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-[#1E3527] text-white shadow-xs'
                    : 'bg-white/60 text-[#4A574C] hover:bg-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#788C71]" />
            <input
              type="text"
              placeholder="Search services or treatments..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#D5CDC0] text-xs text-[#1E2620] focus:outline-none"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(service => (
            <div
              key={service.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#E5DECf] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="h-52 w-full overflow-hidden relative bg-[#E8E2D5]">
                  <SafeImage
                    src={service.image_url}
                    alt={service.name}
                    fallbackType={service.category === 'Barber' ? 'barber' : service.category === 'Spa & Beauty' ? 'spa' : 'hair'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-[#1E3527]/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-xs">
                    {service.category}
                  </span>
                  {service.popular && (
                    <span className="absolute top-3 right-3 bg-[#C6A364] text-[#14241A] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                      Popular
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-2.5">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-serif text-lg font-semibold text-[#16281E] leading-snug">
                      {service.name}
                    </h3>
                  </div>

                  <p className="text-xs text-[#6F7D71] leading-relaxed line-clamp-3">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-[#788C71] pt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Duration: {service.duration_min} minutes</span>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3 border-t border-[#F0ECE1] flex items-center justify-between mt-auto">
                <div>
                  <span className="text-[10px] text-[#788C71] uppercase tracking-wider block">Investment</span>
                  <span className="font-serif font-bold text-xl text-[#1E3527]">${service.price}.00</span>
                </div>

                <button
                  onClick={() => onBookService(service.id)}
                  className="flex items-center gap-2 bg-[#1E3527] hover:bg-[#14241A] text-white px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition shadow-sm transform active:scale-95"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
