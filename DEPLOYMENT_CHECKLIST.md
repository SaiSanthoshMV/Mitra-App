# ✅ Production Deployment Checklist

## Before Deploying to Vercel

### 1. Environment Variables Setup in Vercel
```bash
✅ NEXTAUTH_URL=https://mitrakmit.vercel.app
✅ NEXTAUTH_SECRET=[Generate with: openssl rand -base64 32]
✅ GOOGLE_CLIENT_ID=[From Google Cloud Console]
✅ GOOGLE_CLIENT_SECRET=[From Google Cloud Console]
✅ SUPABASE_URL=[From Supabase Dashboard]
✅ SUPABASE_SERVICE_ROLE_KEY=[From Supabase Dashboard]
✅ NEXT_PUBLIC_SUPABASE_URL=[Same as SUPABASE_URL]
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY=[From Supabase Dashboard]
✅ R2_ACCOUNT_ID=[From Cloudflare Dashboard]
✅ R2_ACCESS_KEY_ID=[From Cloudflare R2]
✅ R2_SECRET_ACCESS_KEY=[From Cloudflare R2]
✅ R2_BUCKET_NAME=[Your bucket name]
✅ R2_PUBLIC_URL=[Your R2 public URL]
✅ RESEND_API_KEY=[From Resend Dashboard]
✅ RESEND_FROM_EMAIL=[Verified sender email]
```

### 2. Google OAuth Configuration
```
Go to: https://console.cloud.google.com
Navigate to: APIs & Services → Credentials
Add Authorized Redirect URI:
  ✅ https://mitrakmit.vercel.app/api/auth/callback/google
```

### 3. Cloudflare R2 CORS
```json
Add to R2 Bucket Settings → CORS Configuration:
{
  "AllowedOrigins": ["https://mitrakmit.vercel.app"],
  "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
  "AllowedHeaders": ["*"],
  "ExposeHeaders": ["ETag"],
  "MaxAgeSeconds": 3000
}
```

### 4. Database Tables (Supabase)
```
✅ users table exists with correct schema
✅ email_verifications table exists
✅ study_materials table exists
✅ RLS policies configured (if needed)
```

---

## Quick Deploy Commands

```bash
# Using Vercel CLI
vercel --prod

# Or push to GitHub (if auto-deploy is set up)
git push origin main
```

---

## Post-Deployment Tests

### Test 1: Authentication
1. Go to https://mitrakmit.vercel.app/materials
2. Click "Upload Material"
3. Sign in with Google
4. ✅ Should redirect successfully

### Test 2: Email Verification
1. After login, verify email prompt appears
2. Enter @kmit.edu.in email
3. Receive and enter OTP
4. ✅ Should verify successfully

### Test 3: Upload Material
1. Go to https://mitrakmit.vercel.app/materials/upload
2. Fill form and upload PDF
3. ✅ Should upload successfully

### Test 4: View Materials
1. Go to https://mitrakmit.vercel.app/materials
2. Use filters
3. Click "View" on material
4. ✅ Should preview PDF

---

## Common Issues & Quick Fixes

| Issue | Fix |
|-------|-----|
| "Invalid redirect URI" | Add Vercel URL to Google OAuth |
| "NEXTAUTH_URL not set" | Add to Vercel env vars |
| Upload fails | Check R2 CORS and credentials |
| Email not sent | Verify RESEND_API_KEY |
| Database errors | Check Supabase credentials |

---

## Code Status: ✅ READY

**No hardcoded localhost URLs found!**
- All API calls use relative paths (`/api/...`)
- All redirects use relative paths
- Environment-based configuration
- Production-ready code

---

## Monitoring After Deployment

1. **Vercel Dashboard**: Check deployment logs
2. **Vercel Analytics**: Monitor traffic
3. **Supabase Dashboard**: Check database activity
4. **Cloudflare R2**: Monitor storage usage

---

## Emergency Rollback

```bash
# If something goes wrong
vercel rollback
```

---

Last Updated: Ready for deployment to mitrakmit.vercel.app
