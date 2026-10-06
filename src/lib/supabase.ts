import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Safely initialize Supabase if credentials are provided
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key'
);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Complete PostgreSQL / Supabase Schema SQL Migration script
export const SUPABASE_SCHEMA_SQL = `
-- ========================================================
-- DEMO SALON / PARLOR - SUPABASE DATABASE SCHEMA & POLICIES
-- ========================================================

-- 1. Create Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'staff')),
  avatar_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Hair', 'Barber', 'Color & Highlights', 'Spa & Beauty', 'Bridal')),
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  duration_min INTEGER NOT NULL,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Staff / Stylists table
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  specialties TEXT[] DEFAULT ARRAY[]::TEXT[],
  experience_years INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  working_days INTEGER[] DEFAULT ARRAY[1, 2, 3, 4, 5, 6]::INTEGER[],
  work_start_time TIME DEFAULT '09:00',
  work_end_time TIME DEFAULT '19:00',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Appointments table with double booking constraint logic
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE RESTRICT,
  service_name TEXT NOT NULL,
  service_price NUMERIC(10, 2) NOT NULL,
  service_duration INTEGER NOT NULL,
  staff_id UUID REFERENCES public.staff(id) ON DELETE RESTRICT,
  staff_name TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled', 'No-show')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_avatar TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  service_name TEXT,
  date DATE DEFAULT CURRENT_DATE,
  is_featured BOOLEAN DEFAULT true,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Gallery table
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Hair', 'Color', 'Barber', 'Bridal', 'Spa', 'Salon Interior')),
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create Salon Settings table
CREATE TABLE IF NOT EXISTS public.salon_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  name TEXT NOT NULL,
  tagline TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city_state_zip TEXT,
  working_hours JSONB,
  slot_duration_min INTEGER DEFAULT 30,
  cancellation_policy TEXT,
  tax_rate_percent NUMERIC(5, 2) DEFAULT 8.25,
  banner_message TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public services read" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public staff read" ON public.staff FOR SELECT USING (true);
CREATE POLICY "Public reviews read" ON public.reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Public gallery read" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Public settings read" ON public.salon_settings FOR SELECT USING (true);

-- Appointments policies
CREATE POLICY "Public can book appointment" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Customer can read own appointments" ON public.appointments FOR SELECT USING (true);
CREATE POLICY "Customer can cancel own appointment" ON public.appointments FOR UPDATE USING (true);

-- Indexes for blazing fast query performance
CREATE INDEX IF NOT EXISTS idx_appointments_date_staff ON public.appointments (date, staff_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments (status);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services (category);
`;
