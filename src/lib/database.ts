import { 
  Service, 
  Staff, 
  Appointment, 
  Review, 
  GalleryItem, 
  SalonSettings, 
  CustomerProfile,
  AppointmentStatus 
} from '../types';
import { 
  INITIAL_SERVICES, 
  INITIAL_STAFF, 
  INITIAL_APPOINTMENTS, 
  INITIAL_REVIEWS, 
  INITIAL_GALLERY, 
  INITIAL_SETTINGS 
} from './initialData';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  SERVICES: 'demo_salon_services_v2',
  STAFF: 'demo_salon_staff_v2',
  APPOINTMENTS: 'demo_salon_appointments_v2',
  REVIEWS: 'demo_salon_reviews_v2',
  GALLERY: 'demo_salon_gallery_v2',
  SETTINGS: 'demo_salon_settings_v2',
  CUSTOMERS: 'demo_salon_customers_v2',
  AUTH_USER: 'demo_salon_current_user_v2',
};

// Listeners for real-time reactivity within the app
type Listener = () => void;
const listeners = new Set<Listener>();
export function subscribeToDatabase(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
function notifySubscribers() {
  listeners.forEach(fn => {
    try {
      fn();
    } catch (e) {
      console.error('Database subscriber error', e);
    }
  });
}

// Helpers for localStorage persistence
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (err) {
    console.warn(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifySubscribers();
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

export class DatabaseService {
  // Services
  static getServices(): Service[] {
    return loadFromStorage<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  }

  static getActiveServices(): Service[] {
    return this.getServices().filter(s => s.is_active);
  }

  static saveService(service: Partial<Service> & { name: string; price: number; duration_min: number; category: Service['category'] }): Service {
    const current = this.getServices();
    if (service.id) {
      const updated = current.map(s => s.id === service.id ? { ...s, ...service } as Service : s);
      saveToStorage(STORAGE_KEYS.SERVICES, updated);
      return updated.find(s => s.id === service.id)!;
    } else {
      const newService: Service = {
        id: `srv-${Date.now()}`,
        name: service.name,
        category: service.category,
        description: service.description || '',
        price: Number(service.price),
        duration_min: Number(service.duration_min),
        image_url: service.image_url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
        is_featured: Boolean(service.is_featured),
        is_active: service.is_active !== undefined ? service.is_active : true,
      };
      saveToStorage(STORAGE_KEYS.SERVICES, [newService, ...current]);
      return newService;
    }
  }

  static deleteService(id: string): void {
    const current = this.getServices();
    saveToStorage(STORAGE_KEYS.SERVICES, current.filter(s => s.id !== id));
  }

  // Staff
  static getStaff(): Staff[] {
    return loadFromStorage<Staff[]>(STORAGE_KEYS.STAFF, INITIAL_STAFF);
  }

  static getActiveStaff(): Staff[] {
    return this.getStaff().filter(s => s.is_active);
  }

  static saveStaff(staff: Partial<Staff> & { name: string; title: string }): Staff {
    const current = this.getStaff();
    if (staff.id) {
      const updated = current.map(s => s.id === staff.id ? { ...s, ...staff } as Staff : s);
      saveToStorage(STORAGE_KEYS.STAFF, updated);
      return updated.find(s => s.id === staff.id)!;
    } else {
      const newStaff: Staff = {
        id: `stf-${Date.now()}`,
        name: staff.name,
        title: staff.title,
        bio: staff.bio || 'Dedicated salon professional committed to perfection and care.',
        photo_url: staff.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        rating: 5.0,
        review_count: 1,
        specialties: staff.specialties || ['Styling', 'Haircare'],
        experience_years: staff.experience_years || 5,
        is_active: true,
        working_days: staff.working_days || [1, 2, 3, 4, 5, 6],
        work_start_time: staff.work_start_time || '09:00',
        work_end_time: staff.work_end_time || '18:30',
      };
      saveToStorage(STORAGE_KEYS.STAFF, [...current, newStaff]);
      return newStaff;
    }
  }

  static deleteStaff(id: string): void {
    const current = this.getStaff();
    saveToStorage(STORAGE_KEYS.STAFF, current.filter(s => s.id !== id));
  }

  // Appointments
  static getAppointments(): Appointment[] {
    return loadFromStorage<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  }

  static getAppointmentsForStaffAndDate(staffId: string, date: string): Appointment[] {
    return this.getAppointments().filter(
      apt => apt.staff_id === staffId && apt.date === date && apt.status !== 'Cancelled'
    );
  }

  /**
   * Generates valid time slots between start and end hours
   * and verifies whether the staff is scheduled and unblocked.
   * This strictly prevents double booking.
   */
  static getAvailableSlots(staffId: string, dateStr: string, durationMin: number = 45): { time: string; available: boolean; reason?: string }[] {
    const staffList = this.getStaff();
    const staff = staffList.find(s => s.id === staffId);
    if (!staff || !staff.is_active) {
      return [];
    }

    // Check staff's working day
    // In JS Date, getDay() returns 0 for Sunday, 1 for Monday, etc.
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const dayOfWeek = dateObj.getDay();

    if (!staff.working_days.includes(dayOfWeek)) {
      return [];
    }

    // Parse start and end hours
    const [startH, startM] = staff.work_start_time.split(':').map(Number);
    const [endH, endM] = staff.work_end_time.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    // Existing active bookings for this staff on this date
    const bookedAppointments = this.getAppointmentsForStaffAndDate(staffId, dateStr);

    const helperTimeToMinutes = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    const slots: { time: string; available: boolean; reason?: string }[] = [];
    const stepMin = 30; // 30-minute schedule grid

    for (let currentMin = startMinutes; currentMin + durationMin <= endMinutes; currentMin += stepMin) {
      const slotEndMin = currentMin + durationMin;
      const hours = Math.floor(currentMin / 60).toString().padStart(2, '0');
      const mins = (currentMin % 60).toString().padStart(2, '0');
      const timeLabel = `${hours}:${mins}`;

      // Check collision with any existing appointment
      let isColliding = false;
      for (const apt of bookedAppointments) {
        const aptStart = helperTimeToMinutes(apt.start_time);
        const aptEnd = helperTimeToMinutes(apt.end_time);

        // Check interval overlap: (SlotStart < AptEnd) && (SlotEnd > AptStart)
        if (currentMin < aptEnd && slotEndMin > aptStart) {
          isColliding = true;
          break;
        }
      }

      slots.push({
        time: timeLabel,
        available: !isColliding,
        reason: isColliding ? 'Reserved by another client' : undefined,
      });
    }

    return slots;
  }

  static createAppointment(data: {
    customer_id?: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    service_id: string;
    staff_id: string;
    date: string;
    start_time: string;
    notes?: string;
  }): { success: boolean; appointment?: Appointment; error?: string } {
    const services = this.getServices();
    const staffList = this.getStaff();

    const service = services.find(s => s.id === data.service_id);
    if (!service) return { success: false, error: 'Selected service was not found.' };

    const staff = staffList.find(s => s.id === data.staff_id);
    if (!staff) return { success: false, error: 'Selected stylist was not found.' };

    // Calculate end time
    const [h, m] = data.start_time.split(':').map(Number);
    const startMins = h * 60 + m;
    const endMins = startMins + service.duration_min;
    const endH = Math.floor(endMins / 60).toString().padStart(2, '0');
    const endM = (endMins % 60).toString().padStart(2, '0');
    const end_time = `${endH}:${endM}`;

    // Verify no double booking collision
    const existing = this.getAppointmentsForStaffAndDate(data.staff_id, data.date);
    for (const apt of existing) {
      const [ah, am] = apt.start_time.split(':').map(Number);
      const aStart = ah * 60 + am;
      const [aeh, aem] = apt.end_time.split(':').map(Number);
      const aEnd = aeh * 60 + aem;

      if (startMins < aEnd && endMins > aStart) {
        return {
          success: false,
          error: `Stylist ${staff.name} already has a booking at ${apt.start_time} - ${apt.end_time}. Please select another time.`,
        };
      }
    }

    // Generate unique booking code
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const booking_code = `DS-${randomSuffix}`;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}-${randomSuffix}`,
      booking_code,
      customer_id: data.customer_id,
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      customer_phone: data.customer_phone,
      service_id: service.id,
      service_name: service.name,
      service_price: service.price,
      service_duration: service.duration_min,
      staff_id: staff.id,
      staff_name: staff.name,
      date: data.date,
      start_time: data.start_time,
      end_time,
      status: 'Confirmed',
      notes: data.notes || '',
      created_at: new Date().toISOString(),
    };

    const currentAppointments = this.getAppointments();
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, [newAppointment, ...currentAppointments]);

    // Also update customer profile visits
    this.recordCustomerActivity({
      name: data.customer_name,
      email: data.customer_email,
      phone: data.customer_phone,
    });

    return { success: true, appointment: newAppointment };
  }

  static updateAppointmentStatus(id: string, status: AppointmentStatus): void {
    const current = this.getAppointments();
    const updated = current.map(a => a.id === id ? { ...a, status } : a);
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, updated);
  }

  static rescheduleAppointment(id: string, newDate: string, newStartTime: string): { success: boolean; error?: string } {
    const current = this.getAppointments();
    const target = current.find(a => a.id === id);
    if (!target) return { success: false, error: 'Appointment not found' };

    // Calculate new end time based on duration
    const [h, m] = newStartTime.split(':').map(Number);
    const startMins = h * 60 + m;
    const endMins = startMins + target.service_duration;
    const endH = Math.floor(endMins / 60).toString().padStart(2, '0');
    const endM = (endMins % 60).toString().padStart(2, '0');
    const newEndTime = `${endH}:${endM}`;

    // Check collision
    const existing = this.getAppointmentsForStaffAndDate(target.staff_id, newDate).filter(a => a.id !== id);
    for (const apt of existing) {
      const [ah, am] = apt.start_time.split(':').map(Number);
      const aStart = ah * 60 + am;
      const [aeh, aem] = apt.end_time.split(':').map(Number);
      const aEnd = aeh * 60 + aem;

      if (startMins < aEnd && endMins > aStart) {
        return { success: false, error: 'The selected rescheduled time slot is already booked.' };
      }
    }

    const updated = current.map(a => a.id === id ? { 
      ...a, 
      date: newDate, 
      start_time: newStartTime, 
      end_time: newEndTime,
      status: 'Confirmed' as AppointmentStatus,
    } : a);

    saveToStorage(STORAGE_KEYS.APPOINTMENTS, updated);
    return { success: true };
  }

  // Reviews
  static getReviews(): Review[] {
    return loadFromStorage<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  }

  static getApprovedReviews(): Review[] {
    return this.getReviews().filter(r => r.is_approved);
  }

  static addReview(review: Omit<Review, 'id' | 'date' | 'is_approved' | 'is_featured'>): Review {
    const current = this.getReviews();
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      is_approved: true, // auto-approve in demo
      is_featured: false,
    };
    saveToStorage(STORAGE_KEYS.REVIEWS, [newRev, ...current]);
    return newRev;
  }

  static toggleReviewStatus(id: string, field: 'is_approved' | 'is_featured'): void {
    const current = this.getReviews();
    const updated = current.map(r => r.id === id ? { ...r, [field]: !r[field] } : r);
    saveToStorage(STORAGE_KEYS.REVIEWS, updated);
  }

  static deleteReview(id: string): void {
    const current = this.getReviews();
    saveToStorage(STORAGE_KEYS.REVIEWS, current.filter(r => r.id !== id));
  }

  // Gallery
  static getGallery(): GalleryItem[] {
    return loadFromStorage<GalleryItem[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
  }

  static addGalleryItem(item: Omit<GalleryItem, 'id'>): GalleryItem {
    const current = this.getGallery();
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
    };
    saveToStorage(STORAGE_KEYS.GALLERY, [newItem, ...current]);
    return newItem;
  }

  static deleteGalleryItem(id: string): void {
    const current = this.getGallery();
    saveToStorage(STORAGE_KEYS.GALLERY, current.filter(g => g.id !== id));
  }

  // Settings
  static getSettings(): SalonSettings {
    return loadFromStorage<SalonSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }

  static saveSettings(settings: SalonSettings): void {
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
  }

  // Customers management
  static getCustomers(): CustomerProfile[] {
    const initialCustomers: CustomerProfile[] = [
      {
        id: 'usr-1',
        name: 'Genevieve Sterling',
        email: 'genevieve.s@example.com',
        phone: '(310) 849-2144',
        role: 'customer',
        total_visits: 6,
        notes: 'VIP Guest. Prefers cold sparkling water and quiet sessions.',
        created_at: '2026-02-14',
      },
      {
        id: 'usr-2',
        name: 'Alexander Hayes',
        email: 'a.hayes@example.com',
        phone: '(415) 392-8812',
        role: 'customer',
        total_visits: 4,
        notes: 'Executive styling client.',
        created_at: '2026-03-20',
      },
      {
        id: 'usr-3',
        name: 'Claire Kensington',
        email: 'claire.k@example.com',
        phone: '(310) 723-9941',
        role: 'customer',
        total_visits: 2,
        notes: 'Wedding guest styling.',
        created_at: '2026-07-11',
      }
    ];
    return loadFromStorage<CustomerProfile[]>(STORAGE_KEYS.CUSTOMERS, initialCustomers);
  }

  static recordCustomerActivity(client: { name: string; email: string; phone: string }): void {
    const customers = this.getCustomers();
    const existing = customers.find(c => c.email.toLowerCase() === client.email.toLowerCase());
    if (existing) {
      const updated = customers.map(c => c.id === existing.id ? {
        ...c,
        total_visits: (c.total_visits || 1) + 1,
        phone: client.phone || c.phone,
        name: client.name || c.name,
      } : c);
      saveToStorage(STORAGE_KEYS.CUSTOMERS, updated);
    } else {
      const newCust: CustomerProfile = {
        id: `usr-${Date.now()}`,
        name: client.name,
        email: client.email,
        phone: client.phone,
        role: 'customer',
        total_visits: 1,
        created_at: new Date().toISOString().split('T')[0],
      };
      saveToStorage(STORAGE_KEYS.CUSTOMERS, [...customers, newCust]);
    }
  }

  // Auth Session
  static getCurrentUser(): CustomerProfile | null {
    return loadFromStorage<CustomerProfile | null>(STORAGE_KEYS.AUTH_USER, null);
  }

  static setCurrentUser(user: CustomerProfile | null): void {
    saveToStorage(STORAGE_KEYS.AUTH_USER, user);
  }
}
