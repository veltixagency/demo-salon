import React from 'react';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Award, ShieldCheck } from 'lucide-react';
import { SalonSettings } from '../../types';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenBooking: () => void;
  settings: SalonSettings;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBooking, settings }) => {
  return (
    <footer className="bg-[#14241A] text-[#FAF7F2] border-t border-[#233B2B] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-14 border-b border-[#243A2C]">
          {/* Brand info */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#294734] flex items-center justify-center text-[#FAF7F2]">
                <svg className="w-5 h-5 text-[#FAF7F2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 22C12 16 16 11 20 9" />
                  <path d="M12 22C12 15 8 10 4 8" />
                  <path d="M12 22V6" />
                  <circle cx="12" cy="5" r="2" />
                </svg>
              </div>
              <div>
                <span className="font-serif text-2xl tracking-tight font-semibold block text-[#FAF7F2]">
                  {settings.name}
                </span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#A3B89E] font-medium block">
                  {settings.tagline}
                </span>
              </div>
            </div>
            <p className="text-sm text-[#BFCEC0] leading-relaxed font-light">
              Where your style becomes your signature. Bespoke precision cuts, master color artistry, artisan barbering, and revitalizing head spa rituals in the heart of the USA.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-[#C6A364] bg-[#1E3527] px-3 py-1.5 rounded-full border border-[#2B4734]">
                <Award className="w-3.5 h-3.5" />
                Best Luxury Salon 2024–2026
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-serif text-lg font-medium text-[#FAF7F2] mb-4 tracking-wide">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-[#BFCEC0]">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition">Home</button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition">Services & Pricing</button>
              </li>
              <li>
                <button onClick={() => onNavigate('stylists')} className="hover:text-white transition">Master Stylists & Barbers</button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} className="hover:text-white transition">Lookbook & Portfolio</button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition">Our Story & Philosophy</button>
              </li>
              <li>
                <button onClick={() => onNavigate('reviews')} className="hover:text-white transition">Client Testimonials</button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition">Contact & VIP Concierge</button>
              </li>
            </ul>
          </div>

          {/* Salon Hours & Location */}
          <div>
            <h4 className="font-serif text-lg font-medium text-[#FAF7F2] mb-4 tracking-wide">
              Hours & Location
            </h4>
            <div className="space-y-3 text-sm text-[#BFCEC0]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C6A364] shrink-0 mt-0.5" />
                <span>
                  {settings.address}<br />
                  {settings.city_state_zip}
                </span>
              </div>
              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-[#C6A364] shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p>{settings.working_hours.weekdays}</p>
                  <p>{settings.working_hours.saturday}</p>
                  <p>{settings.working_hours.sunday}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 pt-1">
                <Phone className="w-4 h-4 text-[#C6A364] shrink-0" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C6A364] shrink-0" />
                <span>{settings.email}</span>
              </div>
            </div>
          </div>

          {/* Book / Cancellation policy */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-medium text-[#FAF7F2] tracking-wide">
              Reserve Your Ritual
            </h4>
            <p className="text-xs text-[#BFCEC0] leading-relaxed">
              Appointments are tailored to avoid waiting time. Reserve in advance to ensure your preferred master stylist.
            </p>
            <button
              onClick={onOpenBooking}
              className="w-full bg-[#C6A364] hover:bg-[#d8b577] text-[#14241A] font-semibold py-3 px-5 rounded-full text-xs uppercase tracking-wider transition shadow"
            >
              Book An Appointment
            </button>
            <div className="bg-[#192D21] p-3 rounded-lg border border-[#233D2D]">
              <p className="text-[11px] text-[#A5B9A6] leading-tight flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C6A364] shrink-0 mt-0.5" />
                <span>{settings.cancellation_policy}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8FA391]">
          <p>© {new Date().getFullYear()} {settings.name}. All rights reserved. USA Flagship Salon.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('about')} className="hover:text-white transition">Privacy Notice</button>
            <button onClick={() => onNavigate('contact')} className="hover:text-white transition">Terms of Service</button>
            <button onClick={() => onNavigate('admin')} className="text-[#C6A364] hover:underline font-medium">Admin Portal</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
