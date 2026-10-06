import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  User, 
  Calendar, 
  Menu, 
  X, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  LogOut,
  ChevronRight,
  Scissors,
  Camera,
  Star
} from 'lucide-react';
import { CustomerProfile, SalonSettings } from '../../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenBooking: (serviceId?: string, staffId?: string) => void;
  onOpenAuth: () => void;
  onOpenSearch: () => void;
  currentUser: CustomerProfile | null;
  onLogout: () => void;
  settings: SalonSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenBooking,
  onOpenAuth,
  onOpenSearch,
  currentUser,
  onLogout,
  settings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Services', view: 'services' },
    { label: 'Our Team', view: 'stylists' },
    { label: 'Gallery', view: 'gallery' },
    { label: 'About', view: 'about' },
    { label: 'Reviews', view: 'reviews' },
    { label: 'Contact', view: 'contact' },
  ];

  const handleLinkClick = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E2D5] transition-all">
      {/* Top micro announcement bar */}
      <div className="bg-[#1E3527] text-[#FAF7F2] text-xs py-1.5 sm:py-2 px-3 sm:px-8 flex justify-between items-center transition-all">
        <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-[#DFD7C7]">
          <span className="flex items-center gap-1.5 hidden md:flex">
            <MapPin className="w-3.5 h-3.5 text-[#C6A364]" />
            {settings.address}, {settings.city_state_zip}
          </span>
          <a 
            href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
            className="flex items-center gap-1.5 hover:text-white transition"
          >
            <Phone className="w-3.5 h-3.5 text-[#C6A364]" />
            <span>{settings.phone}</span>
          </a>
          <span className="flex items-center gap-1.5 hidden lg:flex">
            <Clock className="w-3.5 h-3.5 text-[#C6A364]" />
            Mon–Sat: 9am–7:30pm
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#E2D5C1] font-medium text-[10px] sm:text-xs tracking-wide truncate max-w-[200px] sm:max-w-none">
            {settings.banner_message}
          </span>
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className="bg-[#C6A364] text-[#14241A] font-semibold text-[10px] sm:text-[11px] px-2 py-0.5 rounded uppercase tracking-wider hover:bg-[#d8b577] transition shrink-0"
            >
              Admin Mode
            </button>
          )}
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo matching the uploaded image */}
        <button 
          onClick={() => handleLinkClick('home')}
          className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-none"
        >
          {/* Elegant olive/botanical emblem */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1E3527] flex items-center justify-center text-[#FAF7F2] shadow-sm group-hover:bg-[#294734] transition shrink-0">
            <svg 
              className="w-4 h-4 sm:w-5 sm:h-5 text-[#FAF7F2]" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.75" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12A10 10 0 0 1 12 2Z" opacity="0.15" fill="currentColor" />
              <path d="M12 22C12 16 16 11 20 9" />
              <path d="M12 22C12 15 8 10 4 8" />
              <path d="M12 22V6" />
              <circle cx="12" cy="5" r="2" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl tracking-tight text-[#16281E] font-semibold leading-none group-hover:text-[#294734] transition">
              {settings.name}
            </span>
            <span className="text-[8.5px] sm:text-[9.5px] uppercase tracking-[0.22em] text-[#788C71] font-semibold mt-0.5 sm:mt-1">
              {settings.tagline}
            </span>
          </div>
        </button>

        {/* Desktop / Laptop Nav Links */}
        <nav className="hidden lg:flex items-center space-x-7 xl:space-x-8">
          {navLinks.map(link => {
            const isActive = currentView === link.view;
            return (
              <button
                key={link.view}
                onClick={() => handleLinkClick(link.view)}
                className={`text-sm font-medium transition-colors relative py-1.5 ${
                  isActive 
                    ? 'text-[#1E3527] font-semibold' 
                    : 'text-[#4A544C] hover:text-[#1E3527]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1E3527] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[#3D473F] hover:bg-[#EFECE5] active:bg-[#E5DECf] transition"
            title="Search services & stylists"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* User Account / Sign In */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => onNavigate(currentUser.role === 'admin' ? 'admin' : 'customer-portal')}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full border border-[#D5CDC0] bg-[#FAF7F2] hover:bg-[#F2ECE0] text-xs font-medium text-[#1E3527] transition"
              >
                <div className="w-5 h-5 rounded-full bg-[#1E3527] text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden sm:inline max-w-[85px] truncate">{currentUser.name.split(' ')[0]}</span>
                {currentUser.role === 'admin' && (
                  <span className="text-[9px] bg-[#1E3527] text-[#FAF7F2] px-1.5 py-0.5 rounded font-semibold hidden sm:inline">Admin</span>
                )}
              </button>
              <button
                onClick={onLogout}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[#788C71] hover:text-[#9A3412] hover:bg-[#FEE2E2]/50 transition"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="hidden sm:inline-flex px-4 py-2 rounded-full border border-[#D5CDC0] text-xs font-semibold text-[#1E3527] hover:border-[#1E3527] hover:bg-[#1E3527] hover:text-white transition tracking-wide"
            >
              Login
            </button>
          )}

          {/* Primary Book Appointment Button (Laptop/Desktop) */}
          <button
            onClick={() => onOpenBooking()}
            className="hidden sm:flex items-center gap-2 bg-[#1E3527] hover:bg-[#14241A] text-white px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium tracking-wide shadow-sm hover:shadow transition transform active:scale-95"
          >
            <span>Book Appointment</span>
            <svg 
              className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>

          {/* Mobile menu hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-[#1E3527] hover:bg-[#EFECE5] active:bg-[#E5DECf]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Luxury Mobile Menu Drawer with tactile cards & quick links */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F2] border-b border-[#E8E2D5] px-5 py-5 shadow-2xl animate-in slide-in-from-top duration-200 max-h-[82vh] overflow-y-auto">
          {/* Quick CTA banner */}
          <div className="mb-4 p-3.5 rounded-2xl bg-[#1E3527] text-white flex items-center justify-between shadow-md">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C6A364] block">
                Instant Reservation
              </span>
              <span className="font-serif text-sm font-semibold">Reserve Your Stylist</span>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="bg-[#C6A364] text-[#14241A] font-bold text-xs px-3.5 py-1.5 rounded-full shadow"
            >
              Book Now
            </button>
          </div>

          <div className="flex flex-col space-y-1">
            {navLinks.map(link => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.view}
                  onClick={() => handleLinkClick(link.view)}
                  className={`flex items-center justify-between text-left text-sm font-medium py-3 px-3 rounded-xl transition ${
                    isActive 
                      ? 'bg-[#EFECE5] text-[#1E3527] font-semibold' 
                      : 'text-[#3E4A40] hover:bg-[#F5F1E8]'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#A8B7A4]" />
                </button>
              );
            })}
          </div>

          {/* User profile / login section inside drawer */}
          <div className="pt-4 mt-3 border-t border-[#E8E2D5]">
            {currentUser ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onNavigate(currentUser.role === 'admin' ? 'admin' : 'customer-portal');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 rounded-xl bg-[#EFECE5] text-[#1E3527] font-semibold text-xs flex items-center justify-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-[#1E3527]" />
                  <span>{currentUser.role === 'admin' ? 'Open Admin Control' : 'My Appointments & Profile'}</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-xs text-red-600 font-medium"
                >
                  Sign Out of Account
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl border border-[#1E3527] text-[#1E3527] font-semibold text-xs text-center hover:bg-[#1E3527] hover:text-white transition"
              >
                Sign In / Guest Register
              </button>
            )}
          </div>

          {/* Quick contact info in mobile drawer */}
          <div className="mt-4 pt-3 border-t border-[#E8E2D5] text-xs text-[#6F7D71] space-y-1.5">
            <p className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C6A364]" />
              <span>{settings.address}, {settings.city_state_zip}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#C6A364]" />
              <span>{settings.phone}</span>
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
