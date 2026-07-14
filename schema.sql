-- Supabase Schema for "Nan Sukjai" Tracking System

-- 1. Create custom enum types
CREATE TYPE risk_level AS ENUM ('green', 'yellow', 'red');
CREATE TYPE user_role AS ENUM ('doctor', 'social_worker', 'jhw', 'manager', 'admin');

-- 2. Create profiles table (extends auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role DEFAULT 'jhw'::user_role NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create clinics / hospitals reference table
CREATE TABLE clinics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL
);

-- 4. Create patients table
CREATE TABLE patients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    hn TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    dx TEXT NOT NULL, -- Diagnosis (e.g., F20.0)
    risk risk_level DEFAULT 'green'::risk_level NOT NULL,
    smi_v TEXT, -- SMI-V category
    followup_frequency TEXT NOT NULL, -- e.g., 'รายสัปดาห์', 'รายเดือน'
    village TEXT NOT NULL,
    house_no TEXT,
    moo TEXT,
    tambon TEXT,
    amphoe TEXT,
    province TEXT,
    hospital_id UUID REFERENCES clinics(id) ON DELETE SET NULL,
    pcu_id UUID REFERENCES clinics(id) ON DELETE SET NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    last_visit DATE,
    next_visit DATE,
    missed_appointments INTEGER DEFAULT 0 NOT NULL,
    med_adherence TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- 5. Create audit logs table
CREATE TABLE audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_hn TEXT,
    details TEXT,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Set up Row Level Security (RLS)

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone authenticated can read basic profiles, but only admins can update/approve
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Admins can update profiles" ON profiles FOR UPDATE USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Clinics: Everyone can view
CREATE POLICY "Clinics are viewable by everyone" ON clinics FOR SELECT USING (true);

-- Patients: Everyone can view, but only authorized roles can insert/update
CREATE POLICY "Patients are viewable by everyone" ON patients FOR SELECT USING (true);
CREATE POLICY "Authorized can insert patients" ON patients FOR INSERT WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) IN ('doctor', 'manager', 'admin')
);
CREATE POLICY "Authorized can update patients" ON patients FOR UPDATE USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) IN ('doctor', 'manager', 'admin')
);

-- Audit Logs: Insertable by anyone logged in, viewable only by admins
CREATE POLICY "Anyone can insert audit logs" ON audit_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- 7. Insert Initial Mock Data
-- Insert mock clinics
INSERT INTO clinics (name, latitude, longitude) VALUES 
('โรงพยาบาลน่าน', 18.79552, 100.78867),
('รพ.สต. ตะเคียนเตี้ย', 13.0162, 100.9610),
('รพ.สต. บางละมุง', 13.0385, 100.9312);
