import React from 'react';
import { Star, Award, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { Staff } from '../../types';
import { SafeImage } from '../common/SafeImage';

interface StylistsPageProps {
  staffList: Staff[];
  onBookWithStaff: (staffId: string) => void;
}

export const StylistsPage: React.FC<StylistsPageProps> = ({ staffList, onBookWithStaff }) => {
  return (
    <div className="py-12 sm:py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#788C71]">
            Our Master Artisans
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-[#16281E]">
            Artists in Hair, Texture & Grooming
          </h1>
          <p className="text-sm sm:text-base text-[#657367] font-light leading-relaxed">
            Our internationally trained team brings passion, precision, and bespoke attention to every client consultation.
          </p>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {staffList.filter(s => s.is_active).map(staff => (
            <div
              key={staff.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#E5DECf] shadow-xs hover:shadow-md transition flex flex-col sm:flex-row group"
            >
              <div className="sm:w-2/5 h-64 sm:h-auto overflow-hidden relative bg-[#E2DBD0]">
                <SafeImage
                  src={staff.photo_url}
                  alt={staff.name}
                  fallbackType="stylist"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-[#14241A]/80 backdrop-blur-xs text-[#FAF7F2] px-2.5 py-1 rounded-full text-[10px] font-bold">
                  {staff.experience_years}+ Years Experience
                </div>
              </div>

              <div className="sm:w-3/5 p-6 sm:p-7 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider text-[#788C71] font-semibold">
                      {staff.title}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#C6A364]">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{staff.rating}</span>
                      <span className="text-[10px] text-[#788C71] font-normal">({staff.review_count})</span>
                    </div>
                  </div>

                  <h3 className="font-serif text-2xl font-semibold text-[#16281E] mt-1">
                    {staff.name}
                  </h3>

                  <p className="text-xs text-[#5C685E] leading-relaxed mt-2.5 font-light">
                    {staff.bio}
                  </p>

                  <div className="pt-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#788C71] block mb-1.5">
                      Signature Specialties:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {staff.specialties.map((spec, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-[#F2EDE1] text-[#3E4C40] px-2.5 py-1 rounded-md font-medium"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F0ECE1] flex items-center justify-between">
                  <span className="text-[11px] text-[#788C71]">
                    Hours: {staff.work_start_time} - {staff.work_end_time}
                  </span>
                  <button
                    onClick={() => onBookWithStaff(staff.id)}
                    className="flex items-center gap-2 bg-[#1E3527] hover:bg-[#14241A] text-white px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition shadow-xs"
                  >
                    <span>Book with {staff.name.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
