# 🔧 FIX: "Failed to generate verification code" Error

## 🎯 The Problem

The `email_verifications` table doesn't exist in your Supabase database yet!

---

## ✅ SOLUTION (Follow These Steps)

### **Step 1: Create the Missing Table** (2 minutes)

1. Open your **Supabase Dashboard**
2. Go to **SQL Editor** (left sidebar)
3. Click **"New Query"**
4. Copy and paste this entire SQL script:

```sql
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
```

5. Click **"RUN"** (or press Ctrl+Enter)
6. You should see: ✅ "Success. No rows returned"

---

### **Step 2: Verify the Table Was Created**

Run this query in SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'email_verifications';
```

You should see:
```
table_name
email_verifications
```

✅ If you see this, the table exists!

---

### **Step 3: Check Your Database Status**

Visit this URL in your browser (while your dev server is running):

```
http://localhost:3000/api/check-database
```

You should see a JSON response with:
```json
{
  "checks": {
    "users": { "exists": true },
    "email_verifications": { "exists": true }
  }
}
```

✅ Both should show `"exists": true`

---

### **Step 4: Test the Verification Flow**

1. Go to `http://localhost:3000/materials/upload`
2. Sign in with Google (if not already)
3. Enter college email: `yourname@kmit.edu.in`
4. Click **"Send Verification Code"**
5. **Check your terminal** - you should see:
   ```
   🔵 Send OTP API called
   🔵 Session check: { hasSession: true, email: '...' }
   🔵 College email received: yourname@kmit.edu.in
   🔵 Generated OTP: 123456
   🔵 Storing OTP in database...
   ✅ OTP stored successfully
   🔐 OTP for yourname@kmit.edu.in: 123456
   ✅ Send OTP completed successfully
   ```

6. You should now see the OTP input screen! ✅

---

## 🐛 If Still Not Working

### **Error: "relation 'email_verifications' does not exist"**

**Solution:** You didn't run the SQL script correctly. Go back to Step 1.

### **Error: "Failed to generate verification code"**

**Check terminal logs for the specific error:**

```bash
# Look for lines starting with ❌
❌ Error storing OTP: ...
❌ Full error details: ...
```

Common causes:
1. **Missing Service Role Key**: Add to `.env.local`:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
   
2. **Wrong Supabase URL/Key**: Double-check your `.env.local`

3. **RLS Policy Issues**: The SQL script should fix this

### **No logs in terminal**

Make sure:
- Dev server is running: `npm run dev`
- No errors on startup
- Browser console is open (F12) to see any client-side errors

---

## 📋 What I Fixed in the Code

### **1. Added Detailed Logging**

Now you'll see exactly where it fails:
- 🔵 Blue = Info logs
- ✅ Green = Success
- ❌ Red = Errors

### **2. Better Error Messages**

Instead of generic "Failed to generate verification code", you now see:
- The specific database error
- Full error details in console

### **3. Fixed Database Queries**

Changed `.single()` to `.maybeSingle()` to avoid errors when no results found.

### **4. Created Database Check Endpoint**

Visit `/api/check-database` to see if all tables exist.

---

## ✅ Success Checklist

After running the SQL script, you should have:

- [x] `email_verifications` table exists in Supabase
- [x] Table has proper RLS policies
- [x] `/api/check-database` shows both tables exist
- [x] Clicking "Send Verification Code" works
- [x] OTP appears in terminal
- [x] Can verify OTP and access upload form

---

## 🎯 Quick Summary

**Problem:** Missing database table  
**Solution:** Run the SQL script in Supabase  
**Time needed:** 2 minutes  
**Files to run:** `CREATE_EMAIL_VERIFICATIONS_TABLE.sql`  

---

## 📞 Still Need Help?

1. Check `/api/check-database` - screenshot the response
2. Check terminal logs after clicking "Send Code" - copy the error
3. Verify you ran the SQL script and saw "Success"
4. Make sure `SUPABASE_SERVICE_ROLE_KEY` is in `.env.local`

**The most common issue is simply forgetting to run the SQL script! 🚀**
