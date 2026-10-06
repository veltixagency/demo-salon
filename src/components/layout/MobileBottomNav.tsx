import React from 'react';
import { Calendar, Phone, Scissors, Home, User, Sparkles } from 'lucide-react';
import { CustomerProfile, SalonSettings } from '../../types';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenBooking: () => void;
  currentUser: CustomerProfile | null;
  onOpenAuth: () => void;
  settings: SalonSettings;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
  onOpenBooking,
  currentUser,
  onOpenAuth,
  settings,
}) => {
  return (
    <aside 
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-xl border-t border-[#E3DCce] px-3 py-2 shadow-[0_-8px_25px_rgba(0,0,0,0.08)] flex items-center justify-between gap-1 safe-bottom transition-all"
    >
      {/* 1. Home */}
      <button
        onClick={() => {
          onNavigate('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 rounded-xl transition ${
          currentView === 'home' ? 'text-[#1E3527] font-bold' : 'text-[#6F7D71] hover:text-[#1E3527]'
        }`}
      >
        <Home className="w-4 h-4" />
        <span className="text-[10px] tracking-tight">Home</span>
      </button>

      {/* 2. Services */}
      <button
        onClick={() => {
          onNavigate('services');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 rounded-xl transition ${
          currentView === 'services' ? 'text-[#1E3527] font-bold' : 'text-[#6F7D71] hover:text-[#1E3527]'
        }`}
      >
        <Scissors className="w-4 h-4" />
        <span className="text-[10px] tracking-tight">Menu</span>
      </button>

      {/* 3. Central Big Action: Book Appointment */}
      <div className="flex-[1.8] px-1">
        <button
          onClick={onOpenBooking}
          className="w-full bg-[#1E3527] hover:bg-[#14241A] active:scale-95 text-white py-2.5 px-3 rounded-full flex items-center justify-center gap-1.5 shadow-md border border-[#2B4734] transition"
        >
          <Calendar className="w-3.5 h-3.5 text-[#C6A364]" />
          <span className="text-xs font-semibold tracking-wide whitespace-nowrap">
            Book Now
          </span>
        </button>
      </div>

      {/* 4. Call Concierge */}
      <a
        href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
        className="flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 rounded-xl text-[#6F7D71] hover:text-[#1E3527] transition"
      >
        <Phone className="w-4 h-4 text-[#C6A364]" />
        <span className="text-[10px] tracking-tight">Call</span>
      </a>

      {/* 5. Account / Portal */}
      <button
        onClick={() => {
          if (currentUser) {
            onNavigate(currentUser.role === 'admin' ? 'admin' : 'customer-portal');
          } else {
            onOpenAuth();
          }
        }}
        className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 rounded-xl transition ${
          currentView === 'customer-portal' || currentView === 'admin' 
            ? 'text-[#1E3527] font-bold' 
            : 'text-[#6F7D71] hover:text-[#1E3527]'
        }`}
      >
        <User className="w-4 h-4" />
        <span className="text-[10px] tracking-tight">
          {currentUser ? 'Account' : 'Login'}
        </span>
      </button>
    </aside>
  );
};
