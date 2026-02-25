# 🚀 Deployment Guide for mitrakmit.vercel.app

## ✅ Code is Ready!

Good news! Your code doesn't have hardcoded localhost URLs. All API calls use relative paths (`/api/...`), which will automatically work on any domain.

## 📋 Pre-Deployment Checklist

### 1. **Environment Variables in Vercel**

Go to your Vercel project settings → Environment Variables and add:

```env
# NextAuth Configuration
NEXTAUTH_URL=https://mitrakmit.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Cloudflare R2
R2_ACCOUNT_ID=your-r2-account-id
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=your-r2-public-url

# Resend (for email)
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=your-sender-email
```

> 💡 **Important**: Set these for "Production", "Preview", and "Development" environments in Vercel.

---

### 2. **Update Google OAuth Configuration**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Under **Authorized redirect URIs**, add:
   ```
   https://mitrakmit.vercel.app/api/auth/callback/google
   ```
6. Keep the localhost URL for local development:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
7. Click **Save**

---

### 3. **Verify Supabase Configuration**

Make sure your Supabase database has these tables:

#### `users` table:
```sql
- id (uuid, primary key)
- google_email (text, unique)
- college_email (text, nullable)
- is_verified (boolean, default false)
- created_at (timestamp)
```

#### `email_verifications` table:
```sql
- id (uuid, primary key)
- google_email (text, unique)
- college_email (text)
- otp (text)
- expires_at (timestamp)
- verified (boolean, default false)
- created_at (timestamp)
```

#### `study_materials` table:
```sql
- id (uuid, primary key)
- title (text)
- subject (text)
- semester (text)
- file_url (text)
- uploaded_by (text)
- created_at (timestamp)
```

---

### 4. **Cloudflare R2 CORS Configuration**

Your R2 bucket needs CORS settings to allow file uploads from your domain:

```json
[
  {
    "AllowedOrigins": [
      "https://mitrakmit.vercel.app",
      "http://localhost:3000"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE",
      "HEAD"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3000
  }
]
```

---

## 🔄 Deployment Steps

### Option A: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com)
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Add all environment variables (see section 1)
6. Click "Deploy"

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

---

## ✅ Post-Deployment Testing

After deployment, test these critical flows:

### 1. **Authentication Flow**
- [ ] Visit https://mitrakmit.vercel.app/materials
- [ ] Click "Upload Material" button
- [ ] Sign in with Google (any Google account)
- [ ] Verify successful login

### 2. **Email Verification Flow**
- [ ] After login, you should see email verification prompt
- [ ] Enter your @kmit.edu.in email
- [ ] Receive OTP (check email or terminal)
- [ ] Verify OTP successfully

### 3. **Upload Flow**
- [ ] Navigate to https://mitrakmit.vercel.app/materials/upload
- [ ] Fill in material details
- [ ] Upload a PDF file
- [ ] Verify successful upload
- [ ] Check if material appears in /materials page

### 4. **Materials Page**
- [ ] Visit https://mitrakmit.vercel.app/materials
- [ ] Verify materials are loading
- [ ] Test semester filter
- [ ] Test subject filter
- [ ] Click "View" on a material
- [ ] Test PDF preview
- [ ] Test download button

---

## 🐛 Troubleshooting

### Issue: "NEXTAUTH_URL environment variable is not set"
**Solution**: Add `NEXTAUTH_URL=https://mitrakmit.vercel.app` to Vercel environment variables

### Issue: "Unauthorized callback URL"
**Solution**: Add your Vercel URL to Google OAuth authorized redirect URIs

### Issue: Files not uploading to R2
**Solution**: 
1. Check R2 environment variables are set correctly
2. Verify R2 CORS configuration includes your Vercel domain
3. Check R2 bucket permissions

### Issue: Emails not sending
**Solution**:
1. Verify `RESEND_API_KEY` is set in Vercel
2. Check Resend dashboard for any errors
3. Verify sender email is verified in Resend

### Issue: Database errors
**Solution**:
1. Verify Supabase environment variables
2. Check Supabase service role key has proper permissions
3. Verify all tables exist with correct schema

---

## 🔒 Security Checklist

- [ ] `NEXTAUTH_SECRET` is a strong random string (generate with `openssl rand -base64 32`)
- [ ] All API keys are stored in Vercel environment variables (never in code)
- [ ] Supabase RLS (Row Level Security) policies are configured
- [ ] R2 bucket has public read access only for uploaded files
- [ ] CORS is restricted to your domain only

---

## 📊 Monitoring

After deployment, monitor:

1. **Vercel Deployment Logs**: Check for any build or runtime errors
2. **Vercel Analytics**: Track user activity and performance
3. **Supabase Dashboard**: Monitor database queries and errors
4. **Cloudflare R2 Metrics**: Track storage usage and bandwidth

---

## 🎉 Success Indicators

Your deployment is successful when:

✅ Users can sign in with Google  
✅ Email verification works with @kmit.edu.in emails  
✅ Materials can be uploaded successfully  
✅ Uploaded materials appear on the materials page  
✅ PDF preview works correctly  
✅ Download functionality works  
✅ Filters work properly (semester, subject)  

---

## 🔄 Continuous Deployment

Vercel automatically redeploys when you push to your main branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

---

## 📞 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Test on localhost first to isolate deployment-specific issues

---

**Last Updated**: Deployment preparation for mitrakmit.vercel.app  
**Status**: ✅ Code is production-ready
