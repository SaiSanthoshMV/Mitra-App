# 🔧 TROUBLESHOOTING GUIDE - Verification Screen Not Showing

## Issue
After successful Google OAuth login, the college email verification screen is not appearing.

---

## 🔍 Debugging Steps

### Step 1: Check Server Console Logs

After logging in, check your terminal where `npm run dev` is running. You should see logs like:

```
OAuth Sign In: { email: 'your@gmail.com' }
Existing user check: { exists: false, error: undefined }
Creating new user record for: your@gmail.com
User record created successfully: { id: '...', google_email: '...', is_verified: false }
```

If you see errors here, note them down.

### Step 2: Visit Debug Page

1. After logging in, go to: `http://localhost:3000/debug/auth`
2. This page will show you:
   - Your session data
   - Your user record from database
   - All environment variables status

**Look for:**
- ✅ Session exists and has your email
- ✅ User record exists in database
- ✅ `is_verified` is `false`
- ✅ All environment variables are set

### Step 3: Check Database Directly

1. Open Supabase Dashboard
2. Go to Table Editor
3. Find the `users` table
4. Look for your email

**Expected:**
```
google_email: your@gmail.com
college_email: null
is_verified: false
```

If the row doesn't exist, there's a database write issue.

### Step 4: Verify Database Permissions

Run this in Supabase SQL Editor:

```sql
-- Check if users table exists
SELECT * FROM users LIMIT 1;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'users';

-- Try to insert a test user
INSERT INTO users (google_email, is_verified)
VALUES ('test@example.com', false)
RETURNING *;

-- Clean up test
DELETE FROM users WHERE google_email = 'test@example.com';
```

---

## ✅ Common Fixes

### Fix 1: Database Table Missing

If you get "relation 'users' does not exist":

```sql
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    google_email TEXT NOT NULL UNIQUE,
    college_email TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_google_email ON public.users(google_email);
CREATE INDEX IF NOT EXISTS idx_users_college_email ON public.users(college_email);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage all user records"
ON public.users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
```

### Fix 2: Missing Service Role Key

If you're using `NEXT_PUBLIC_SUPABASE_ANON_KEY` instead of `SUPABASE_SERVICE_ROLE_KEY`:

1. Go to Supabase Dashboard → Settings → API
2. Copy the `service_role` key (NOT the anon key)
3. Add to `.env.local`:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```
4. Restart your dev server

### Fix 3: RLS Policy Blocking Inserts

The service role key bypasses RLS, but if you're using anon key:

```sql
-- Allow anon to insert users (temporary for testing)
CREATE POLICY "Allow anon insert users"
ON public.users
FOR INSERT
TO anon
WITH CHECK (true);
```

**Better solution**: Use `SUPABASE_SERVICE_ROLE_KEY` as mentioned in Fix 2.

### Fix 4: Environment Variables Not Loading

1. Make sure `.env.local` exists in project root
2. Restart dev server completely:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```
3. Check the debug page to verify variables are loaded

### Fix 5: NextAuth Not Creating User

If the signIn callback isn't running:

1. Clear your browser cookies for `localhost`
2. Sign out completely
3. Sign in again
4. Watch the server console for logs

---

## 🧪 Manual Testing Script

Run this step-by-step:

```bash
# 1. Stop your dev server
# Ctrl+C

# 2. Clear Next.js cache
rm -rf .next

# 3. Restart dev server
npm run dev
```

Then in browser:
1. Clear all cookies for localhost
2. Go to `http://localhost:3000/materials/upload`
3. Sign in with Google
4. **Watch server console** for logs
5. Go to `http://localhost:3000/debug/auth`
6. Take a screenshot of the debug page
7. Check if user record exists

---

## 📊 Expected vs Actual

### Expected Flow:
```
1. Click "Upload" → Redirect to Google OAuth
2. Sign in with Google → OAuth Success
3. signIn callback runs → Creates user record
4. Redirect to /materials/upload
5. Page checks database → Finds user with is_verified=false
6. Shows verification UI ✅
```

### If Verification UI Doesn't Show:
```
Possible causes:
1. User record not created (check server logs)
2. Database query failing (check debug page)
3. Page is redirecting instead (check network tab)
4. User record has is_verified=true somehow (check database)
```

---

## 🔬 Detailed Debug Checklist

Run through this checklist:

- [ ] Server is running without errors
- [ ] Can access `http://localhost:3000`
- [ ] `.env.local` file exists with all required variables
- [ ] Supabase `users` table exists
- [ ] Can manually insert into `users` table
- [ ] Google OAuth is configured correctly
- [ ] After login, session exists (check debug page)
- [ ] After login, user record exists in database
- [ ] User record has `is_verified = false`
- [ ] Upload page is accessible after login
- [ ] Server console shows "User not verified, showing verification screen"
- [ ] Browser console has no errors
- [ ] Network tab shows no failed requests

---

## 🆘 Still Not Working?

Collect this information:

1. **Server Console Output** (copy the logs after login)
2. **Debug Page Screenshot** (`/debug/auth`)
3. **Database Screenshot** (users table)
4. **Browser Console Errors** (if any)
5. **Network Tab** (filter for `/materials/upload`)

Then check:
- Is the verification component being rendered? (View page source)
- Is there a JavaScript error preventing render?
- Is the page redirecting immediately?

---

## 💡 Quick Test

Try this simple test to isolate the issue:

**Create a test route**: `app/test-verification/page.tsx`

```tsx
import CollegeEmailVerification from '@/components/CollegeEmailVerification';

export default function TestPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <CollegeEmailVerification />
        </div>
    );
}
```

Visit `http://localhost:3000/test-verification`

- If verification UI shows → Issue is with auth flow
- If verification UI doesn't show → Issue is with component itself

---

## 📝 Next Steps After Fixing

Once verification screen appears:

1. Enter a college email: `yourname@kmit.edu.in`
2. Check server console for OTP (development mode)
3. Enter the 6-digit OTP
4. Page should reload
5. Upload form should appear

---

**Need Help?** Share the output from the debug page and server console logs.
