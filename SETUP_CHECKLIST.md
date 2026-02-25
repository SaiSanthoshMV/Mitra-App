# 🚀 QUICK SETUP CHECKLIST

## Before You Start

- [x] Code implementation complete
- [ ] Database tables created
- [ ] Environment variables configured
- [ ] Google OAuth settings updated
- [ ] System tested

---

## Step 1: Database Setup (5 minutes)

1. Open your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Open the file `supabase-setup.sql` in this project
4. Copy the entire SQL script
5. Paste and run it in Supabase SQL Editor
6. Verify both tables exist:
   - ✅ `users` (you already created this)
   - ✅ `email_verifications` (just created)

**Verification Query:**

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('users', 'email_verifications');
```

---

## Step 2: Environment Variables (2 minutes)

Check your `.env.local` file has all required variables:

```env
# NextAuth
NEXTAUTH_SECRET=xxxxx
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

**Missing any?** Check [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md) for details.

---

## Step 3: Google OAuth Configuration (3 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. **Important**: Remove any "Authorized domains" restrictions
6. Under "Authorized redirect URIs", ensure you have:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
7. Click **Save**

---

## Step 4: Install Dependencies (if needed)

```bash
npm install
```

---

## Step 5: Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Step 6: Test the Flow

### Test 1: Login with Personal Gmail

1. Navigate to `/materials/upload`
2. Click sign in
3. Use **any Gmail account** (not @kmit.edu.in)
4. ✅ Should successfully log in

### Test 2: College Email Verification

1. After login, you should see the verification screen
2. Enter a test college email: `test@kmit.edu.in`
3. Click "Send Verification Code"
4. **Check your terminal/console** - OTP will be logged in development mode
5. Enter the 6-digit OTP
6. ✅ Should show success message and reload

### Test 3: Upload Material

1. After verification, upload form should appear
2. Fill in the form and upload a test PDF
3. ✅ Material should upload successfully
4. Check database - `uploaded_by` should show college email

### Test 4: Public Access

1. Open `/materials` in an incognito window
2. ✅ Materials should be visible without login

---

## 🎉 Success Indicators

You'll know everything is working when:

- ✅ Can login with **any** Google account
- ✅ Verification screen appears for unverified users
- ✅ OTP is logged to console (dev mode)
- ✅ After verification, upload form appears
- ✅ Upload succeeds and saves college email
- ✅ Materials page is public

---

## 🐛 Common Issues

### "User not found"

**Cause**: Users table doesn't exist or lacks RLS policies  
**Fix**: Run the SQL script from `supabase-setup.sql`

### "Failed to send OTP"

**Cause**: Supabase email not configured  
**Fix**: For testing, use the OTP from console (logged in dev mode)

### "Unauthorized domain"

**Cause**: Google OAuth has domain restrictions  
**Fix**: Remove authorized domains in Google Cloud Console

### Session not updating

**Cause**: JWT not refreshing  
**Fix**: Page reload happens automatically after verification

---

## 📞 Need Help?

Read the full guide: [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md)

---

## ✅ Completed!

Once all tests pass, you're ready to deploy! 🚀

**Remember for production:**

- Update `NEXTAUTH_URL` to your production URL
- Add production redirect URI to Google OAuth
- Configure Supabase email service for real OTP delivery
- Add rate limiting on OTP generation
