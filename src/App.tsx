import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { HeroSection } from './components/home/HeroSection';
import { ServicesPreview } from './components/home/ServicesPreview';
import { ExperienceSection } from './components/home/ExperienceSection';
import { SafeImage } from './components/common/SafeImage';
import { ServicesPage } from './components/pages/ServicesPage';
import { StylistsPage } from './components/pages/StylistsPage';
import { GalleryPage } from './components/pages/GalleryPage';
import { ReviewsPage } from './components/pages/ReviewsPage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { CustomerPortal } from './components/customer/CustomerPortal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { BookingModal } from './components/booking/BookingModal';
import { AuthModal } from './components/auth/AuthModal';
import { SearchModal } from './components/search/SearchModal';
import { DatabaseService, subscribeToDatabase } from './lib/database';
import { 
  Service, 
  Staff, 
  GalleryItem, 
  Review, 
  SalonSettings, 
  CustomerProfile, 
  ServiceCategory,
  Appointment 
} from './types';
import { Star, ArrowRight, MapPin, Phone, ShieldCheck, Sparkles } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<
    'home' | 'services' | 'stylists' | 'gallery' | 'about' | 'reviews' | 'contact' | 'customer-portal' | 'admin'
  >('home');

  // Application Data States
  const [services, setServices] = useState<Service[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<SalonSettings>(DatabaseService.getSettings());
  const [currentUser, setCurrentUser] = useState<CustomerProfile | null>(DatabaseService.getCurrentUser());

  // Modal Dialogs
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingServiceId, setBookingServiceId] = useState<string | undefined>();
  const [bookingStaffId, setBookingStaffId] = useState<string | undefined>();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync data with Database Service
  const reloadData = () => {
    setServices(DatabaseService.getActiveServices());
    setStaffList(DatabaseService.getActiveStaff());
    setGalleryItems(DatabaseService.getGallery());
    setReviews(DatabaseService.getApprovedReviews());
    setSettings(DatabaseService.getSettings());
    setCurrentUser(DatabaseService.getCurrentUser());
  };

  useEffect(() => {
    reloadData();
    const unsubscribe = subscribeToDatabase(reloadData);
    return () => unsubscribe();
  }, []);

  // Handlers
  const handleOpenBooking = (serviceId?: string, staffId?: string) => {
    setBookingServiceId(serviceId);
    setBookingStaffId(staffId);
    setIsBookingOpen(true);
  };

  const handleBookingCategory = (category: ServiceCategory) => {
    const matching = services.find(s => s.category === category);
    handleOpenBooking(matching?.id);
  };

  const handleLogout = () => {
    DatabaseService.setCurrentUser(null);
    setCurrentUser(null);
    if (currentView === 'admin' || currentView === 'customer-portal') {
      setCurrentView('home');
    }
  };

  const handleBookingSuccess = (apt: Appointment) => {
    // Reload state and allow user to view reservation
    reloadData();
  };

  // If currently in Admin view, render full admin ERP
  if (currentView === 'admin') {
    return (
      <AdminDashboard
        onLogout={handleLogout}
        onExitAdmin={() => setCurrentView('home')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1E2620] pb-16 lg:pb-0">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view: any) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenBooking={handleOpenBooking}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        settings={settings}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {currentView === 'home' && (
          <div>
            {/* 1. Hero Section matching image */}
            <HeroSection
              onOpenBooking={() => handleOpenBooking()}
              onExploreServices={() => setCurrentView('services')}
              settings={settings}
            />

            {/* 2. Services Preview (5 Category Cards matching image) */}
            <ServicesPreview
              onViewAllServices={() => setCurrentView('services')}
              onSelectCategory={cat => {
                setCurrentView('services');
              }}
              onBookCategory={handleBookingCategory}
            />

            {/* 3. The Demo Parlor Experience & Why Choose Us (Split Grid matching image) */}
            <ExperienceSection
              onLearnMore={() => setCurrentView('about')}
              onBookAppointment={() => handleOpenBooking()}
            />

            {/* 4. Master Stylists & Barbers Teaser */}
            <section className="py-16 sm:py-20 bg-[#FAF7F2]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#788C71] block mb-2">
                      Meet Our Artisans
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#16281E] font-medium tracking-tight">
                      Master Stylists & Barbers
                    </h2>
                  </div>
                  <button
                    onClick={() => setCurrentView('stylists')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#1E3527] hover:underline"
                  >
                    <span>View Entire Team</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
                  {staffList.slice(0, 4).map(stf => (
                    <div
                      key={stf.id}
                      className="bg-[#F5F1E8] rounded-2xl p-3 sm:p-5 border border-[#E5DECf] flex flex-col justify-between hover:shadow-md active:scale-[0.98] transition group"
                    >
                      <div>
                        <div className="aspect-square rounded-xl overflow-hidden mb-2.5 sm:mb-4 relative bg-[#E0D8CB]">
                          <SafeImage
                            src={stf.photo_url}
                            alt={stf.name}
                            fallbackType="stylist"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <span className="absolute bottom-2 left-2 bg-[#14241A]/85 backdrop-blur-xs text-white text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-medium">
                            {stf.experience_years} yrs exp
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
                          <h3 className="font-semibold text-xs sm:text-sm text-[#16281E] truncate">{stf.name}</h3>
                          <span className="text-[11px] sm:text-xs font-bold text-[#C6A364]">★ {stf.rating}</span>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-[#788C71] mt-0.5 truncate">{stf.title}</p>
                      </div>

                      <div className="pt-3 mt-2 border-t border-[#E8E1D2] flex justify-between items-center text-xs">
                        <span className="text-[9.5px] sm:text-[10px] text-[#526054] truncate max-w-[70px] sm:max-w-none">
                          {stf.specialties[0]}
                        </span>
                        <button
                          onClick={() => handleOpenBooking(undefined, stf.id)}
                          className="text-[11px] sm:text-xs font-semibold text-[#1E3527] hover:underline"
                        >
                          Book →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 5. Client Testimonials & Reviews Teaser */}
            <section className="py-16 sm:py-20 bg-[#F5F1E8] border-t border-[#E5DECf]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-xl mx-auto mb-12">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#788C71] block mb-2">
                    Verified Guest Reviews
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#16281E] font-medium tracking-tight">
                    Praised by Discerning Clients
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {reviews.slice(0, 3).map(rev => (
                    <div
                      key={rev.id}
                      className="bg-white rounded-3xl p-6 border border-[#E5DECf] shadow-xs flex flex-col justify-between space-y-4"
                    >
                      <div>
                        <div className="flex items-center gap-1 text-[#C6A364] mb-3">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <p className="text-xs sm:text-sm text-[#465348] font-light leading-relaxed italic">
                          "{rev.comment}"
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#F0ECE1] flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-xs text-[#16281E]">{rev.customer_name}</h4>
                          <span className="text-[10px] text-[#788C71]">{rev.service_name}</span>
                        </div>
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-10">
                  <button
                    onClick={() => setCurrentView('reviews')}
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1E3527] hover:underline"
                  >
                    <span>Read All 520+ Reviews</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </section>

            {/* 6. Location & Hours Banner */}
            <section className="py-12 bg-[#1E3527] text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center md:text-left">
                  <h3 className="font-serif text-2xl font-medium text-[#FAF7F2]">
                    Reserve Your Sanctuary Experience Today
                  </h3>
                  <p className="text-xs text-[#BFCEC0]">
                    1044 Luxury Blvd, Suite 200, Beverly Hills • Walk-ins & reservations welcome
                  </p>
                </div>

                <button
                  onClick={() => handleOpenBooking()}
                  className="bg-[#C6A364] hover:bg-[#d8b577] text-[#14241A] font-semibold px-8 py-3.5 rounded-full text-xs uppercase tracking-wider transition shadow-lg shrink-0 transform active:scale-95"
                >
                  Book Appointment Now
                </button>
              </div>
            </section>
          </div>
        )}

        {currentView === 'services' && (
          <ServicesPage
            services={services}
            onBookService={serviceId => handleOpenBooking(serviceId)}
          />
        )}

        {currentView === 'stylists' && (
          <StylistsPage
            staffList={staffList}
            onBookWithStaff={staffId => handleOpenBooking(undefined, staffId)}
          />
        )}

        {currentView === 'gallery' && (
          <GalleryPage
            galleryItems={galleryItems}
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {currentView === 'about' && (
          <AboutPage
            onOpenBooking={() => handleOpenBooking()}
            settings={settings}
          />
        )}

        {currentView === 'reviews' && (
          <ReviewsPage
            reviews={reviews}
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {currentView === 'contact' && (
          <ContactPage
            settings={settings}
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {currentView === 'customer-portal' && currentUser && (
          <CustomerPortal
            currentUser={currentUser}
            onOpenBooking={() => handleOpenBooking()}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(view: any) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenBooking={() => handleOpenBooking()}
        settings={settings}
      />

      {/* Floating Mobile Sticky Bottom Navigation (Mobile & Tablet) */}
      <MobileBottomNav
        currentView={currentView}
        onNavigate={(view: any) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenBooking={() => handleOpenBooking()}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        settings={settings}
      />

      {/* Interactive Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setBookingServiceId(undefined);
          setBookingStaffId(undefined);
        }}
        preselectedServiceId={bookingServiceId}
        preselectedStaffId={bookingStaffId}
        currentUser={currentUser}
        onBookingSuccess={handleBookingSuccess}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={user => {
          setCurrentUser(user);
          if (user.role === 'admin') {
            setCurrentView('admin');
          } else {
            setCurrentView('customer-portal');
          }
        }}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        services={services}
        staffList={staffList}
        onSelectService={srvId => handleOpenBooking(srvId)}
        onSelectStaff={stfId => handleOpenBooking(undefined, stfId)}
      />
    </div>
  );
}
