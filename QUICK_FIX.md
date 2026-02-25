# ⚡ QUICK FIX GUIDE

## Issue: Verification Screen Not Showing After Login

Follow these steps in order:

---

## Step 1: Check Your Database Table (2 minutes)

1. Open Supabase Dashboard
2. Go to **Table Editor**
3. Look for **`users`** table

### ❌ If table doesn't exist:

Run this in **SQL Editor**:

```sql
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    google_email TEXT NOT NULL UNIQUE,
    college_email TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_google_email ON public.users(google_email);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage all user records"
ON public.users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
```

Click **RUN** and verify the table now exists.

---

## Step 2: Add Service Role Key (1 minute)

1. In Supabase Dashboard, go to **Settings → API**
2. Find **`service_role`** key (NOT `anon` key)
3. Copy it
4. Open `.env.local` in your project
5. Add this line (or update if exists):

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key-here
```

6. **IMPORTANT**: Restart your dev server

```bash
# Press Ctrl+C to stop
npm run dev
```

---

## Step 3: Test the Flow (3 minutes)

1. **Clear browser cookies** for `localhost`
   - Open DevTools (F12)
   - Go to Application → Cookies
   - Delete all localhost cookies

2. Go to `http://localhost:3000/materials/upload`

3. Click **Sign in with Google**

4. Sign in with **any Gmail account**

5. **Watch your terminal** - You should see:
   ```
   OAuth Sign In: { email: 'your@gmail.com' }
   Creating new user record for: your@gmail.com
   User record created successfully: { ... }
   ```

6. After OAuth success, you should be redirected and see:
   - **✅ College email verification screen**
   - Title: "Verify Your College Email"
   - Input field for @kmit.edu.in email

---

## Step 4: Debug (if still not working)

Visit: `http://localhost:3000/debug/auth`

This page shows:
- Your session status
- Your user record
- Environment variables status

**Take a screenshot and check:**

### ✅ Good Signs:
```json
{
  "session": {
    "user": {
      "email": "your@gmail.com"
    }
  },
  "userData": {
    "google_email": "your@gmail.com",
    "is_verified": false
  }
}
```

### ❌ Bad Signs:
- Session is `null` → OAuth failed
- UserData is `null` → Database issue
- Environment variables missing → Config issue

---

## Common Issues & Instant Fixes

### Issue 1: "relation 'users' does not exist"
**Fix**: Run Step 1 SQL script

### Issue 2: Still redirecting after login
**Fix**: 
1. Check `.env.local` has `SUPABASE_SERVICE_ROLE_KEY`
2. Restart dev server
3. Clear cookies and try again

### Issue 3: No logs in terminal
**Fix**: 
1. Make sure dev server is running
2. Check for any startup errors
3. Verify `npm run dev` completed successfully

### Issue 4: "Cannot read property 'email' of undefined"
**Fix**:
1. Clear all localhost cookies
2. Sign out completely
3. Sign in again

### Issue 5: Blank page after login
**Fix**:
1. Open browser DevTools console (F12)
2. Check for JavaScript errors
3. Check Network tab for failed requests
4. Visit `/debug/auth` to see what's happening

---

## ✅ Success Indicators

You'll know it's working when:

1. **After login**: Terminal shows user creation logs
2. **On upload page**: You see the verification UI with email input
3. **Debug page**: Shows session + user data
4. **Database**: Has a row with your email and `is_verified=false`

---

## Next Steps After Verification Screen Shows

1. Enter college email: `yourname@kmit.edu.in`
2. Click "Send Verification Code"
3. **Check terminal** for OTP (in development mode):
   ```
   🔐 OTP for yourname@kmit.edu.in: 123456
   ```
4. Enter the 6-digit code
5. Click "Verify OTP"
6. Page reloads → Upload form appears ✅

---

## Still Having Issues?

Run this command and share the output:

```bash
# In your terminal
node -e "console.log({
  node: process.version,
  cwd: process.cwd(),
  env: {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasGoogleId: !!process.env.GOOGLE_CLIENT_ID,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET
  }
})"
```

Then:
1. Visit `/debug/auth` after logging in
2. Take a screenshot
3. Check server console for errors
4. Check Supabase logs (Dashboard → Logs)

---

**Most Common Solution**: Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` and restart server! 🚀
