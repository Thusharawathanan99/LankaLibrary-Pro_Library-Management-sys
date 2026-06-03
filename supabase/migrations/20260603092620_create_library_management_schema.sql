/*
  # Ceylon Digital Library — Core Schema

  ## Overview
  This migration creates the complete database schema for the Library Management System.

  ## New Tables

  ### profiles
  - Extended user data for auth.users
  - Stores role (admin/staff/member), status, and contact info

  ### books
  - Library catalog with ISBN, category, author, publisher, quantity tracking

  ### borrowing_records
  - Tracks every book issue/return transaction with due dates and fine calculation

  ### fines
  - Fine records linked to overdue borrowing records

  ### notifications
  - System notifications and broadcasts

  ### system_settings
  - Key-value store for library configuration (fine_per_day, max_borrow_days, etc.)

  ## Security
  - RLS enabled on all tables
  - Admins can manage all records
  - Staff can manage books, borrowings, and members
  - Members can only read their own data
*/

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text UNIQUE NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'staff', 'member')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')),
  phone text DEFAULT '',
  member_id text UNIQUE,
  department text DEFAULT '',
  total_borrows integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Staff can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can insert profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Books table
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id text UNIQUE NOT NULL,
  title text NOT NULL,
  author text NOT NULL,
  isbn text UNIQUE NOT NULL,
  category text NOT NULL DEFAULT '',
  publisher text DEFAULT '',
  publication_year integer,
  quantity integer NOT NULL DEFAULT 1,
  available integer NOT NULL DEFAULT 1,
  description text DEFAULT '',
  cover_url text DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_available CHECK (available >= 0 AND available <= quantity)
);

ALTER TABLE books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view books"
  ON books FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Staff and admins can insert books"
  ON books FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
  );

CREATE POLICY "Staff and admins can update books"
  ON books FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')));

CREATE POLICY "Admins can delete books"
  ON books FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Borrowing records table
CREATE TABLE IF NOT EXISTS borrowing_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id text UNIQUE NOT NULL,
  book_id uuid NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
  member_id uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  issued_by uuid REFERENCES profiles(id),
  returned_by uuid REFERENCES profiles(id),
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date NOT NULL,
  return_date date,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'returned', 'overdue', 'lost')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE borrowing_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view own borrowing records"
  ON borrowing_records FOR SELECT
  TO authenticated
  USING (member_id = auth.uid());

CREATE POLICY "Staff and admins can view all records"
  ON borrowing_records FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
  );

CREATE POLICY "Staff and admins can insert records"
  ON borrowing_records FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
  );

CREATE POLICY "Staff and admins can update records"
  ON borrowing_records FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')));

-- Fines table
CREATE TABLE IF NOT EXISTS fines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  borrowing_record_id uuid NOT NULL REFERENCES borrowing_records(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount integer NOT NULL DEFAULT 0,
  days_overdue integer NOT NULL DEFAULT 0,
  paid boolean NOT NULL DEFAULT false,
  paid_at timestamptz,
  collected_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE fines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view own fines"
  ON fines FOR SELECT
  TO authenticated
  USING (member_id = auth.uid());

CREATE POLICY "Staff and admins can view all fines"
  ON fines FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')));

CREATE POLICY "Staff and admins can insert fines"
  ON fines FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')));

CREATE POLICY "Staff and admins can update fines"
  ON fines FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')));

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'overdue', 'system', 'member', 'user')),
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  is_broadcast boolean NOT NULL DEFAULT false,
  read boolean NOT NULL DEFAULT false,
  urgency text NOT NULL DEFAULT 'normal' CHECK (urgency IN ('normal', 'high', 'critical')),
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (
    recipient_id = auth.uid() OR is_broadcast = true
  );

CREATE POLICY "Admins can insert notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
  );

CREATE POLICY "Users can update own notification read status"
  ON notifications FOR UPDATE
  TO authenticated
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());

-- System settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  description text DEFAULT '',
  updated_by uuid REFERENCES profiles(id),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view settings"
  ON system_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update settings"
  ON system_settings FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can insert settings"
  ON system_settings FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Default settings
INSERT INTO system_settings (key, value, description) VALUES
  ('fine_per_day', '50', 'Fine amount per day in LKR'),
  ('max_borrow_days', '14', 'Maximum days a member can borrow a book'),
  ('max_renewals', '2', 'Maximum number of renewals per book'),
  ('session_timeout_minutes', '60', 'Admin session timeout in minutes')
ON CONFLICT (key) DO NOTHING;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);
CREATE INDEX IF NOT EXISTS idx_borrowing_member ON borrowing_records(member_id);
CREATE INDEX IF NOT EXISTS idx_borrowing_book ON borrowing_records(book_id);
CREATE INDEX IF NOT EXISTS idx_borrowing_status ON borrowing_records(status);
CREATE INDEX IF NOT EXISTS idx_borrowing_due_date ON borrowing_records(due_date);
CREATE INDEX IF NOT EXISTS idx_fines_member ON fines(member_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
