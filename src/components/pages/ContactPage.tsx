import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, CheckCircle2, Send, MessageCircle } from 'lucide-react';
import { SalonSettings } from '../../types';
import { SafeImage } from '../common/SafeImage';

interface ContactPageProps {
  settings: SalonSettings;
  onOpenBooking: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings, onOpenBooking }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Consultation Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 3000);
  };

  return (
    <div className="py-12 sm:py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#788C71]">
            Concierge & Location
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-[#16281E]">
            Connect with Demo Parlor
          </h1>
          <p className="text-sm sm:text-base text-[#657367] font-light leading-relaxed">
            Our concierge team is at your disposal for appointments, bridal consultations, and personalized inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Contact Info & Map Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DECf] shadow-xs space-y-6">
              <h3 className="font-serif text-xl font-semibold text-[#16281E]">
                Flagship Sanctuary
              </h3>

              <div className="space-y-4 text-xs text-[#526054]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#EFECE5] text-[#1E3527] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#16281E] block">Address</span>
                    <span>{settings.address}</span><br />
                    <span>{settings.city_state_zip}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#EFECE5] text-[#1E3527] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#16281E] block">Direct Concierge</span>
                    <span>{settings.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#EFECE5] text-[#1E3527] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#16281E] block">Email Concierge</span>
                    <span>{settings.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#EFECE5] text-[#1E3527] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#16281E] block">Hours of Operation</span>
                    <p>{settings.working_hours.weekdays}</p>
                    <p>{settings.working_hours.saturday}</p>
                    <p>{settings.working_hours.sunday}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenBooking}
                  className="w-full bg-[#1E3527] text-white py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#14241A] transition shadow-xs"
                >
                  Schedule Your Appointment
                </button>
              </div>
            </div>

            {/* Stylized Map Mock Card */}
            <div className="rounded-3xl overflow-hidden border border-[#E5DECf] shadow-xs relative h-48 bg-[#E5DECf]">
              <SafeImage
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
                alt="Map Beverly Hills location"
                fallbackType="interior"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#1E3527]/20 flex items-center justify-center">
                <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-semibold text-[#1E3527] shadow-lg flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#C6A364]" />
                  <span>Beverly Hills, CA 90210</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Message Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-[#E5DECf] shadow-xs space-y-6">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-[#16281E]">
                Send a Message to the Concierge
              </h3>
              <p className="text-xs text-[#788C71] mt-1">
                Have questions regarding bridal parties, hair extensions, or color consultations? We respond within 2 hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-lg font-semibold text-emerald-900">
                  Message Dispatched
                </h4>
                <p className="text-xs text-emerald-700">
                  Our salon concierge will reach out to you shortly via phone or email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#4A574C] font-semibold mb-1">Your Full Name *</label>
                    <input
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Katherine Pierce"
                      className="w-full p-3 rounded-xl border border-[#D5CDC0] bg-[#FAF7F2] text-[#1E2620]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#4A574C] font-semibold mb-1">Email Address *</label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="katherine@example.com"
                      className="w-full p-3 rounded-xl border border-[#D5CDC0] bg-[#FAF7F2] text-[#1E2620]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#4A574C] font-semibold mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="(310) 555-0199"
                      className="w-full p-3 rounded-xl border border-[#D5CDC0] bg-[#FAF7F2] text-[#1E2620]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#4A574C] font-semibold mb-1">Inquiry Topic</label>
                    <select
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#D5CDC0] bg-[#FAF7F2] text-[#1E2620]"
                    >
                      <option value="General Consultation Inquiry">General Consultation Inquiry</option>
                      <option value="Bridal & Wedding Party Styling">Bridal & Wedding Party Styling</option>
                      <option value="Balayage & Color Correction">Balayage & Color Correction</option>
                      <option value="VIP Private Suite Booking">VIP Private Suite Booking</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#4A574C] font-semibold mb-1">Your Message or Questions *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Tell us what you're looking for, preferred date, or hair history..."
                    className="w-full p-3 rounded-xl border border-[#D5CDC0] bg-[#FAF7F2] text-[#1E2620]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-[#1E3527] hover:bg-[#14241A] text-white px-7 py-3 rounded-full font-semibold uppercase tracking-wider text-xs transition shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Inquiry to Concierge</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
