export type ServiceCategory = 'Hair' | 'Barber' | 'Color & Highlights' | 'Spa & Beauty' | 'Bridal';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  price: number;
  duration_min: number;
  image_url: string;
  is_featured: boolean;
  is_active: boolean;
  popular?: boolean;
}

export interface Staff {
  id: string;
  name: string;
  title: string;
  bio: string;
  photo_url: string;
  rating: number;
  review_count: number;
  specialties: string[];
  experience_years: number;
  is_active: boolean;
  working_days: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  work_start_time: string; // "09:00"
  work_end_time: string; // "19:00"
  break_start_time?: string; // "13:00"
  break_end_time?: string; // "14:00"
}

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No-show';

export interface Appointment {
  id: string;
  booking_code: string;
  customer_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_id: string;
  service_name: string;
  service_price: number;
  service_duration: number;
  staff_id: string;
  staff_name: string;
  date: string; // YYYY-MM-DD
  start_time: string; // "10:30"
  end_time: string; // "11:30"
  status: AppointmentStatus;
  notes?: string;
  created_at: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  avatar_url?: string;
  notes?: string;
  total_visits?: number;
  created_at: string;
}

export interface Review {
  id: string;
  customer_name: string;
  customer_avatar?: string;
  rating: number;
  comment: string;
  service_name: string;
  date: string;
  is_featured: boolean;
  is_approved: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Hair' | 'Color' | 'Barber' | 'Bridal' | 'Spa' | 'Salon Interior';
  image_url: string;
  caption?: string;
}

export interface SalonSettings {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  city_state_zip: string;
  working_hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  slot_duration_min: number;
  cancellation_policy: string;
  tax_rate_percent: number;
  banner_message: string;
}
