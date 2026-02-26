-- CRITICAL: Run this in Supabase SQL Editor NOW
-- This creates the email_verifications table required for OTP

-- Create email_verifications table
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

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_email_verifications_google_email 
ON public.email_verifications(google_email);

CREATE INDEX IF NOT EXISTS idx_email_verifications_college_email 
ON public.email_verifications(college_email);

-- Enable RLS
ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;

-- Allow service role to access all rows
CREATE POLICY "Service role can manage all verification records"
ON public.email_verifications
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create trigger for updated_at
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

-- Verify table was created
SELECT 'Table created successfully!' as status,
       COUNT(*) as row_count 
FROM public.email_verifications;
