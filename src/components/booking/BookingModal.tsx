import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle,
  Phone,
  Mail,
  FileText,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Service, Staff, Appointment, CustomerProfile } from '../../types';
import { DatabaseService } from '../../lib/database';
import { SafeImage } from '../common/SafeImage';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: string;
  preselectedStaffId?: string;
  currentUser: CustomerProfile | null;
  onBookingSuccess: (appointment: Appointment) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedServiceId,
  preselectedStaffId,
  currentUser,
  onBookingSuccess,
}) => {
  // Wizard steps: 1: Service, 2: Stylist, 3: Date & Time, 4: Customer Details, 5: Confirmation
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  
  // Data lists
  const [services, setServices] = useState<Service[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);

  // Selection states
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Customer details
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // Execution states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Load services and staff on open
  useEffect(() => {
    if (isOpen) {
      const activeServices = DatabaseService.getActiveServices();
      const activeStaff = DatabaseService.getActiveStaff();
      setServices(activeServices);
      setStaffList(activeStaff);

      if (preselectedServiceId) {
        setSelectedServiceId(preselectedServiceId);
        setStep(2);
      } else {
        setStep(1);
      }

      if (preselectedStaffId) {
        setSelectedStaffId(preselectedStaffId);
      }

      // Default date to tomorrow if not set
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const defaultDateStr = tomorrow.toISOString().split('T')[0];
      setSelectedDate(defaultDateStr);

      // Autofill if logged in
      if (currentUser) {
        setCustomerName(currentUser.name);
        setCustomerEmail(currentUser.email);
        setCustomerPhone(currentUser.phone || '');
      }

      setErrorMessage('');
      setConfirmedAppointment(null);
    }
  }, [isOpen, preselectedServiceId, preselectedStaffId, currentUser]);

  const selectedService = useMemo(() => 
    services.find(s => s.id === selectedServiceId), 
    [services, selectedServiceId]
  );

  const selectedStaff = useMemo(() => 
    staffList.find(s => s.id === selectedStaffId), 
    [staffList, selectedStaffId]
  );

  // Calculate available time slots for the selected staff, date, and service duration
  const availableSlots = useMemo(() => {
    if (!selectedStaffId || !selectedDate || !selectedService) return [];
    return DatabaseService.getAvailableSlots(
      selectedStaffId,
      selectedDate,
      selectedService.duration_min
    );
  }, [selectedStaffId, selectedDate, selectedService]);

  // Categories for filter
  const categories = ['All', 'Hair', 'Barber', 'Color & Highlights', 'Spa & Beauty', 'Bridal'];
  const filteredServices = services.filter(s => 
    selectedCategory === 'All' ? true : s.category === selectedCategory
  );

  // Generate next 14 bookable dates
  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dayOfWeek = d.getDay();

      // Check if selected staff works on this day
      const isStaffWorking = selectedStaff ? selectedStaff.working_days.includes(dayOfWeek) : true;

      dates.push({
        dateStr,
        dayName,
        monthDay,
        isStaffWorking,
      });
    }
    return dates;
  }, [selectedStaff]);

  if (!isOpen) return null;

  // Handle final confirmation
  const handleConfirmBooking = () => {
    if (!customerName || !customerEmail || !customerPhone) {
      setErrorMessage('Please fill in your name, email, and phone number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      const result = DatabaseService.createAppointment({
        customer_id: currentUser?.id,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        service_id: selectedServiceId,
        staff_id: selectedStaffId,
        date: selectedDate,
        start_time: selectedTime,
        notes: customerNotes,
      });

      setIsSubmitting(false);

      if (result.success && result.appointment) {
        setConfirmedAppointment(result.appointment);
        setStep(5);
        onBookingSuccess(result.appointment);

        // Fire celebratory luxury confetti
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#1E3527', '#C6A364', '#788C71', '#FAF7F2'],
          });
        } catch (e) {
          // ignore confetti fallback
        }
      } else {
        setErrorMessage(result.error || 'Unable to book. Please try another time slot.');
      }
    }, 400);
  };

  // Download .ics calendar event
  const handleDownloadICS = () => {
    if (!confirmedAppointment) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Demo Salon//Appointment//EN
BEGIN:VEVENT
SUMMARY:${confirmedAppointment.service_name} at Demo Parlor
DESCRIPTION:Stylist: ${confirmedAppointment.staff_name}\\nReference: ${confirmedAppointment.booking_code}\\nNotes: ${confirmedAppointment.notes || 'None'}
LOCATION:1044 Luxury Blvd, Suite 200, Beverly Hills, CA 90210
DTSTART:${confirmedAppointment.date.replace(/-/g, '')}T${confirmedAppointment.start_time.replace(':', '')}00
DTEND:${confirmedAppointment.date.replace(/-/g, '')}T${confirmedAppointment.end_time.replace(':', '')}00
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `demo-salon-${confirmedAppointment.booking_code}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] rounded-t-[28px] sm:rounded-3xl shadow-2xl border-t sm:border border-[#E8E1D2] w-full max-w-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col overflow-hidden relative">
        
        {/* Mobile handle indicator */}
        <div className="w-12 h-1 rounded-full bg-white/40 mx-auto mt-2 sm:hidden absolute top-0 left-0 right-0" />

        {/* Header with Title & Close */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 bg-[#1E3527] text-white flex items-center justify-between shrink-0">
          <div>
            <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[#C6A364] block">
              Concierge Reservation
            </span>
            <h2 className="font-serif text-lg sm:text-2xl font-medium tracking-tight text-[#FAF7F2]">
              {step === 5 ? 'Reservation Confirmed' : 'Book Your Appointment'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 flex items-center justify-center text-white transition"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Wizard Step Breadcrumbs (Steps 1-4) with scrollbar-none */}
        {step < 5 && (
          <div className="bg-[#F0ECE1] px-4 sm:px-6 py-2.5 sm:py-3 border-b border-[#E3DCce] flex items-center justify-between text-[11px] sm:text-xs font-medium text-[#657367] overflow-x-auto scrollbar-none gap-2">
            <div className={`flex items-center gap-1.5 shrink-0 ${step === 1 ? 'text-[#1E3527] font-bold' : ''}`}>
              <span className="w-5 h-5 rounded-full bg-[#1E3527] text-white flex items-center justify-center text-[10px]">1</span>
              <span>Service</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#B8C4B5] shrink-0" />
            <div className={`flex items-center gap-1.5 shrink-0 ${step === 2 ? 'text-[#1E3527] font-bold' : ''}`}>
              <span className={`w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-[#1E3527]' : 'bg-[#B8C4B5]'}`}>2</span>
              <span>Stylist</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#B8C4B5] shrink-0" />
            <div className={`flex items-center gap-1.5 shrink-0 ${step === 3 ? 'text-[#1E3527] font-bold' : ''}`}>
              <span className={`w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-[#1E3527]' : 'bg-[#B8C4B5]'}`}>3</span>
              <span>Date & Time</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#B8C4B5] shrink-0" />
            <div className={`flex items-center gap-1.5 shrink-0 ${step === 4 ? 'text-[#1E3527] font-bold' : ''}`}>
              <span className={`w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] ${step >= 4 ? 'bg-[#1E3527]' : 'bg-[#B8C4B5]'}`}>4</span>
              <span>Details</span>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 sm:space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Select Service */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-serif text-lg font-semibold text-[#16281E]">
                  Select Your Desired Treatment
                </h3>
                <p className="text-xs text-[#788C71]">
                  Filter by category or choose from our signature services menu.
                </p>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      selectedCategory === cat 
                        ? 'bg-[#1E3527] text-white shadow-xs' 
                        : 'bg-[#EDE7DA] text-[#4A574C] hover:bg-[#E2DACB]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Services List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {filteredServices.map(service => {
                  const isSelected = selectedServiceId === service.id;
                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedServiceId(service.id)}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        isSelected 
                          ? 'border-[#1E3527] bg-[#EFECE5] shadow-md ring-1 ring-[#1E3527]' 
                          : 'border-[#E5DECf] bg-white hover:border-[#788C71] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#788C71]">
                            {service.category}
                          </span>
                          <span className="font-serif font-bold text-base text-[#1E3527]">
                            ${service.price}
                          </span>
                        </div>
                        <h4 className="font-semibold text-sm text-[#16281E] leading-snug">
                          {service.name}
                        </h4>
                        <p className="text-xs text-[#6F7D71] mt-1 line-clamp-2">
                          {service.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#F0ECE1] text-[11px] text-[#788C71]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {service.duration_min} minutes
                        </span>
                        <span className="font-medium text-[#1E3527]">
                          {isSelected ? '✓ Selected' : 'Select'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Select Stylist */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-serif text-lg font-semibold text-[#16281E]">
                  Choose Your Master Stylist or Barber
                </h3>
                <p className="text-xs text-[#788C71]">
                  Each artisan specializes in specific hair textures and techniques.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {staffList.map(staff => {
                  const isSelected = selectedStaffId === staff.id;
                  return (
                    <div
                      key={staff.id}
                      onClick={() => setSelectedStaffId(staff.id)}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                        isSelected 
                          ? 'border-[#1E3527] bg-[#EFECE5] shadow-md ring-1 ring-[#1E3527]' 
                          : 'border-[#E5DECf] bg-white hover:border-[#788C71] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <SafeImage
                        src={staff.photo_url}
                        alt={staff.name}
                        fallbackType="stylist"
                        className="w-14 h-14 rounded-full object-cover shrink-0 border border-[#D5CDC0]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm text-[#16281E] truncate">{staff.name}</h4>
                          <span className="text-[11px] font-semibold text-[#C6A364] flex items-center gap-0.5">
                            ★ {staff.rating}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#788C71] truncate">{staff.title}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {staff.specialties.slice(0, 2).map((sp, i) => (
                            <span key={i} className="text-[9.5px] bg-[#EAE4D7] text-[#4A574C] px-1.5 py-0.5 rounded">
                              {sp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Select Date & Time Slot (Collision Free) */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-lg font-semibold text-[#16281E]">
                  Select Date & Time Slot
                </h3>
                <p className="text-xs text-[#788C71]">
                  Slots are strictly reserved to guarantee zero waiting and undivided focus.
                </p>
              </div>

              {/* Date Scroll Grid */}
              <div>
                <label className="text-xs font-semibold text-[#4A574C] block mb-2">
                  Select Date
                </label>
                <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none sm:grid sm:grid-cols-7">
                  {availableDates.map(item => {
                    const isSelected = selectedDate === item.dateStr;
                    return (
                      <button
                        key={item.dateStr}
                        disabled={!item.isStaffWorking}
                        onClick={() => {
                          setSelectedDate(item.dateStr);
                          setSelectedTime(''); // reset time on date switch
                        }}
                        className={`min-w-[62px] sm:min-w-0 p-2.5 sm:p-2 rounded-2xl sm:rounded-xl text-center flex flex-col items-center justify-center border transition active:scale-95 shrink-0 ${
                          !item.isStaffWorking
                            ? 'opacity-35 cursor-not-allowed bg-gray-100 border-gray-200'
                            : isSelected
                            ? 'bg-[#1E3527] text-white border-[#1E3527] shadow-sm font-semibold'
                            : 'bg-white border-[#E5DECf] text-[#2C382E] hover:border-[#788C71]'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold opacity-80">{item.dayName}</span>
                        <span className="text-xs sm:text-xs font-semibold mt-0.5">{item.monthDay}</span>
                        {!item.isStaffWorking && (
                          <span className="text-[9px] text-gray-400 mt-0.5">Off</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Available Slots */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#4A574C]">
                    Available Start Times for {selectedDate}
                  </label>
                  <span className="text-[11px] text-[#788C71]">
                    Duration: {selectedService?.duration_min} mins
                  </span>
                </div>

                {availableSlots.length === 0 ? (
                  <div className="p-6 text-center bg-[#F4EFE6] rounded-2xl border border-[#E5DECf] text-xs text-[#788C71]">
                    No open time slots available on this date for the selected stylist. Please select another date.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-2.5 max-h-48 overflow-y-auto p-1">
                    {availableSlots.map(slot => {
                      const isSelected = selectedTime === slot.time;
                      return (
                        <button
                          key={slot.time}
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-center transition active:scale-95 ${
                            !slot.available
                              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                              : isSelected
                              ? 'bg-[#1E3527] text-white border-[#1E3527] shadow-sm font-semibold'
                              : 'bg-white border-[#E5DECf] text-[#1E3527] hover:border-[#1E3527] hover:bg-[#FAF7F2]'
                          }`}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Customer Details & Summary */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-lg font-semibold text-[#16281E]">
                  Guest Information
                </h3>
                <p className="text-xs text-[#788C71]">
                  Provide your details for appointment confirmation and concierge notifications.
                </p>
              </div>

              {/* Booking Summary Box */}
              <div className="p-4 rounded-2xl bg-[#EFECE5] border border-[#DDD5C7] space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#68766A]">Treatment:</span>
                  <span className="font-semibold text-[#16281E]">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#68766A]">Artisan:</span>
                  <span className="font-semibold text-[#16281E]">{selectedStaff?.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#68766A]">Date & Time:</span>
                  <span className="font-semibold text-[#1E3527]">{selectedDate} at {selectedTime}</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-[#DDD5C7]">
                  <span className="text-[#68766A]">Total Investment:</span>
                  <span className="font-bold text-sm text-[#1E3527]">${selectedService?.price}.00</span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A574C] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="e.g. Eleanor Roosevelt"
                    className="w-full px-3.5 py-3 sm:py-2.5 rounded-xl border border-[#D5CDC0] bg-white text-sm sm:text-xs text-[#1E2620] focus:ring-1 focus:ring-[#1E3527] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A574C] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      placeholder="eleanor@example.com"
                      className="w-full px-3.5 py-3 sm:py-2.5 rounded-xl border border-[#D5CDC0] bg-white text-sm sm:text-xs text-[#1E2620] focus:ring-1 focus:ring-[#1E3527] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A574C] mb-1">Phone Number (SMS) *</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      placeholder="(310) 555-0199"
                      className="w-full px-3.5 py-3 sm:py-2.5 rounded-xl border border-[#D5CDC0] bg-white text-sm sm:text-xs text-[#1E2620] focus:ring-1 focus:ring-[#1E3527] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A574C] mb-1">Special Preferences or Notes (Optional)</label>
                  <textarea
                    rows={2}
                    value={customerNotes}
                    onChange={e => setCustomerNotes(e.target.value)}
                    placeholder="Allergies, beverage preference (espresso, sparkling water, herbal tea), or styling notes..."
                    className="w-full px-3.5 py-3 sm:py-2.5 rounded-xl border border-[#D5CDC0] bg-white text-sm sm:text-xs text-[#1E2620] focus:ring-1 focus:ring-[#1E3527] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Success & Confirmation */}
          {step === 5 && confirmedAppointment && (
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 rounded-full bg-[#1E3527] text-white flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8 text-[#C6A364]" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#788C71]">
                  Reservation Confirmed
                </span>
                <h3 className="font-serif text-2xl font-medium text-[#16281E] mt-1">
                  We Look Forward to Welcoming You
                </h3>
                <p className="text-xs text-[#6F7D71] mt-1">
                  A confirmation SMS & calendar notification have been generated.
                </p>
              </div>

              {/* Reference Voucher Card */}
              <div className="max-w-md mx-auto p-5 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm text-left space-y-2 text-xs">
                <div className="flex justify-between pb-2 border-b border-[#F0ECE1]">
                  <span className="text-[#788C71]">Booking Reference</span>
                  <span className="font-mono font-bold text-sm text-[#1E3527]">
                    {confirmedAppointment.booking_code}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#788C71]">Service</span>
                  <span className="font-semibold text-[#16281E]">{confirmedAppointment.service_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#788C71]">Stylist / Barber</span>
                  <span className="font-semibold text-[#16281E]">{confirmedAppointment.staff_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#788C71]">Date & Time</span>
                  <span className="font-semibold text-[#1E3527]">
                    {confirmedAppointment.date} at {confirmedAppointment.start_time} - {confirmedAppointment.end_time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#788C71]">Location</span>
                  <span className="text-[#16281E]">1044 Luxury Blvd, Beverly Hills</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#F0ECE1]">
                  <span className="text-[#788C71]">Status</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                    Confirmed
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleDownloadICS}
                  className="px-5 py-2.5 rounded-full bg-[#1E3527] hover:bg-[#14241A] text-white text-xs font-semibold tracking-wide transition shadow"
                >
                  Add to Calendar (.ICS)
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full border border-[#D5CDC0] text-[#1E3527] hover:bg-[#EFECE5] text-xs font-semibold tracking-wide transition"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons (Steps 1-4) */}
        {step < 5 && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-[#F2EDE1] border-t border-[#E3DCce] flex items-center justify-between shrink-0">
            {step > 1 ? (
              <button
                onClick={() => setStep((step - 1) as any)}
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2 rounded-full border border-[#D5CDC0] text-xs font-semibold text-[#4A574C] hover:bg-white active:scale-95 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {step === 1 && (
              <button
                disabled={!selectedServiceId}
                onClick={() => {
                  setErrorMessage('');
                  setStep(2);
                }}
                className="flex items-center gap-1.5 bg-[#1E3527] hover:bg-[#14241A] active:scale-95 disabled:opacity-40 text-white px-5 sm:px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide shadow-sm transition"
              >
                <span>Select Stylist</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {step === 2 && (
              <button
                disabled={!selectedStaffId}
                onClick={() => {
                  setErrorMessage('');
                  setStep(3);
                }}
                className="flex items-center gap-1.5 bg-[#1E3527] hover:bg-[#14241A] active:scale-95 disabled:opacity-40 text-white px-5 sm:px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide shadow-sm transition"
              >
                <span>Select Date & Time</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {step === 3 && (
              <button
                disabled={!selectedDate || !selectedTime}
                onClick={() => {
                  setErrorMessage('');
                  setStep(4);
                }}
                className="flex items-center gap-1.5 bg-[#1E3527] hover:bg-[#14241A] active:scale-95 disabled:opacity-40 text-white px-5 sm:px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide shadow-sm transition"
              >
                <span>Enter Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {step === 4 && (
              <button
                disabled={isSubmitting}
                onClick={handleConfirmBooking}
                className="flex items-center gap-1.5 bg-[#1E3527] hover:bg-[#14241A] active:scale-95 disabled:opacity-50 text-white px-6 sm:px-7 py-3 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide shadow-md transition"
              >
                {isSubmitting ? 'Confirming...' : 'Confirm Appointment'}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
