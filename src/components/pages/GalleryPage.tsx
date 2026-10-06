import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { GalleryItem } from '../../types';
import { SafeImage } from '../common/SafeImage';

interface GalleryPageProps {
  galleryItems: GalleryItem[];
  onOpenBooking: () => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ galleryItems, onOpenBooking }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Hair', 'Color', 'Barber', 'Bridal', 'Spa', 'Salon Interior'];

  const filtered = galleryItems.filter(item => 
    selectedCategory === 'All' ? true : item.category === selectedCategory
  );

  return (
    <div className="py-12 sm:py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#788C71]">
            Our Visual Lookbook
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-[#16281E]">
            Portfolio of Transformations
          </h1>
          <p className="text-sm sm:text-base text-[#657367] font-light leading-relaxed">
            A curation of bespoke cuts, dimensional balayage, sharp fades, and tranquil spa rituals created in our salon.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex justify-center flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-[#1E3527] text-white shadow-xs'
                  : 'bg-[#EDE7DA] text-[#4A574C] hover:bg-[#E2DACB]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map(item => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item)}
              className="group cursor-pointer rounded-2xl overflow-hidden relative aspect-[3/4] bg-[#E5DECf] shadow-xs hover:shadow-lg transition-all duration-300"
            >
              <SafeImage
                src={item.image_url}
                alt={item.title}
                fallbackType={item.category === 'Barber' ? 'barber' : item.category === 'Salon Interior' ? 'interior' : 'hair'}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C6A364]">
                  {item.category}
                </span>
                <h4 className="font-serif text-base font-semibold leading-snug mt-1">
                  {item.title}
                </h4>
                {item.caption && (
                  <p className="text-[11px] text-[#D8E4D7] mt-1 line-clamp-2">
                    {item.caption}
                  </p>
                )}
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#FAF7F2] mt-3">
                  <ZoomIn className="w-3.5 h-3.5 text-[#C6A364]" />
                  <span>Click to expand</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Booking Callout */}
        <div className="bg-[#1E3527] rounded-3xl p-8 sm:p-10 text-white text-center max-w-3xl mx-auto space-y-4 shadow-xl">
          <h3 className="font-serif text-2xl sm:text-3xl font-medium">
            Inspired by a Look?
          </h3>
          <p className="text-xs sm:text-sm text-[#CAD6C7] max-w-lg mx-auto font-light leading-relaxed">
            Bring any photo to your appointment. Our stylists will customize the formula to harmonize with your features.
          </p>
          <button
            onClick={onOpenBooking}
            className="bg-[#C6A364] hover:bg-[#d8b577] text-[#14241A] font-semibold px-7 py-3 rounded-full text-xs uppercase tracking-wider transition shadow"
          >
            Schedule Consultation & Booking
          </button>
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-3xl w-full bg-[#14241A] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden bg-black">
              <SafeImage
                src={activeImage.image_url}
                alt={activeImage.title}
                fallbackType={activeImage.category === 'Barber' ? 'barber' : activeImage.category === 'Salon Interior' ? 'interior' : 'hair'}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C6A364] block">
                  {activeImage.category}
                </span>
                <h3 className="font-serif text-xl font-medium text-[#FAF7F2] mt-0.5">
                  {activeImage.title}
                </h3>
                {activeImage.caption && (
                  <p className="text-xs text-[#BFCEC0] mt-1">{activeImage.caption}</p>
                )}
              </div>

              <button
                onClick={() => {
                  setActiveImage(null);
                  onOpenBooking();
                }}
                className="bg-[#1E3527] hover:bg-[#284934] border border-[#C6A364]/40 text-white px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition shrink-0"
              >
                Book This Style
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
