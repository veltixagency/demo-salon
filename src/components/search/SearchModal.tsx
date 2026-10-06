import React, { useState, useMemo } from 'react';
import { Search, X, Clock, ArrowRight, User, Scissors } from 'lucide-react';
import { Service, Staff } from '../../types';
import { SafeImage } from '../common/SafeImage';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  staffList: Staff[];
  onSelectService: (serviceId: string) => void;
  onSelectStaff: (staffId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  services,
  staffList,
  onSelectService,
  onSelectStaff,
}) => {
  const [query, setQuery] = useState('');

  const filteredServices = useMemo(() => {
    if (!query.trim()) return services.slice(0, 4);
    const q = query.toLowerCase();
    return services.filter(s => 
      s.is_active && (
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      )
    );
  }, [services, query]);

  const filteredStaff = useMemo(() => {
    if (!query.trim()) return staffList.slice(0, 3);
    const q = query.toLowerCase();
    return staffList.filter(st => 
      st.is_active && (
        st.name.toLowerCase().includes(q) ||
        st.title.toLowerCase().includes(q) ||
        st.specialties.some(sp => sp.toLowerCase().includes(q))
      )
    );
  }, [staffList, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E8E1D2] w-full max-w-xl overflow-hidden relative">
        
        {/* Search Input Bar */}
        <div className="p-4 bg-white border-b border-[#E5DECf] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#788C71] shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search treatments, cuts, balayage, stylists..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent border-none text-[#1E2620] focus:outline-none"
          />
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-[#788C71]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Services Section */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#788C71] flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5" />
              <span>Services & Rituals ({filteredServices.length})</span>
            </span>

            <div className="space-y-1.5">
              {filteredServices.map(srv => (
                <div
                  key={srv.id}
                  onClick={() => {
                    onSelectService(srv.id);
                    onClose();
                  }}
                  className="cursor-pointer p-3 rounded-xl bg-white hover:bg-[#F2EDE1] border border-[#EDE7DB] transition flex items-center justify-between group"
                >
                  <div>
                    <h4 className="font-semibold text-xs text-[#16281E] group-hover:text-[#1E3527]">
                      {srv.name}
                    </h4>
                    <span className="text-[11px] text-[#788C71]">
                      {srv.category} • {srv.duration_min} min • ${srv.price}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#788C71] group-hover:translate-x-1 group-hover:text-[#1E3527] transition" />
                </div>
              ))}
            </div>
          </div>

          {/* Stylists Section */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#788C71] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Stylists & Barbers ({filteredStaff.length})</span>
            </span>

            <div className="space-y-1.5">
              {filteredStaff.map(st => (
                <div
                  key={st.id}
                  onClick={() => {
                    onSelectStaff(st.id);
                    onClose();
                  }}
                  className="cursor-pointer p-3 rounded-xl bg-white hover:bg-[#F2EDE1] border border-[#EDE7DB] transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <SafeImage src={st.photo_url} alt={st.name} fallbackType="stylist" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <h4 className="font-semibold text-xs text-[#16281E]">{st.name}</h4>
                      <span className="text-[11px] text-[#788C71]">{st.title}</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#1E3527] group-hover:underline">
                    Book
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
