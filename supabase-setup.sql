-- HYBRID AUTHENTICATION SYSTEM - SUPABASE TABLES SETUP
-- Run this in your Supabase SQL Editor

-- ============================================
-- TABLE 1: email_verifications
-- Stores OTP verification requests
-- ============================================

CREATE TABLE IF NOT EXISTS public.email_verifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    google_email TEXT NOT NULL UNIQUE,
    college_email TEXT NOT NULL,
    otp TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_verifications_google_email 
ON public.email_verifications(google_email);

CREATE INDEX IF NOT EXISTS idx_email_verifications_college_email 
ON public.email_verifications(college_email);

-- Enable RLS (Row Level Security)
ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;

-- Allow service role to access all rows
CREATE POLICY "Service role can manage all verification records"
ON public.email_verifications
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- VERIFY users TABLE EXISTS
-- (You mentioned you already created this)
-- ============================================

-- If you haven't created it yet, here's the structure:
-- 
-- CREATE TABLE IF NOT EXISTS public.users (
--     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--     google_email TEXT NOT NULL UNIQUE,
--     college_email TEXT,
--     is_verified BOOLEAN DEFAULT false,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );
--
-- CREATE INDEX IF NOT EXISTS idx_users_google_email ON public.users(google_email);
-- CREATE INDEX IF NOT EXISTS idx_users_college_email ON public.users(college_email);
-- 
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
--
-- CREATE POLICY "Service role can manage all user records"
-- ON public.users
-- FOR ALL
-- TO service_role
-- USING (true)
-- WITH CHECK (true);

-- ============================================
-- TRIGGER: Auto-update updated_at timestamp
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_email_verifications_updated_at
    BEFORE UPDATE ON public.email_verifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- CLEANUP: Remove expired OTPs (Optional)
-- Run this periodically or set up a cron job
-- ============================================

-- Delete verification records older than 24 hours
-- DELETE FROM public.email_verifications 
-- WHERE expires_at < NOW() - INTERVAL '24 hours';

-- ============================================
-- VERIFICATION QUERIES (For Testing)
-- ============================================

-- Check if tables exist
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('users', 'email_verifications');

-- View all users and their verification status
-- SELECT google_email, college_email, is_verified, created_at 
-- FROM public.users 
-- ORDER BY created_at DESC;

-- View active verification requests
-- SELECT google_email, college_email, otp, expires_at, verified, created_at
-- FROM public.email_verifications 
-- WHERE expires_at > NOW() 
-- ORDER BY created_at DESC;
