# 📧 Email Setup Guide - Resend Integration

## ✅ What's Implemented

Your app now sends **real emails** using Resend API! The OTP is sent directly to the college email address.

---

## 🚀 Quick Setup (5 minutes)

### **Step 1: Create a Resend Account**

1. Go to [https://resend.com/signup](https://resend.com/signup)
2. Sign up with your email
3. Verify your email address

---

### **Step 2: Get Your API Key**

1. Log in to [Resend Dashboard](https://resend.com/api-keys)
2. Click **"Create API Key"**
3. Give it a name: `KMIT Materials`
4. Copy the API key (starts with `re_...`)

---

### **Step 3: Add to Environment Variables**

Open your `.env.local` file and update:

```env
# Email Configuration (Resend)
RESEND_API_KEY=re_your_actual_api_key_here
EMAIL_FROM=onboarding@resend.dev
```

**Important Notes:**
- For testing, use `onboarding@resend.dev` as the sender
- For production, you'll need to verify your own domain

---

### **Step 4: Restart Your Server**

```bash
# Stop the server (Ctrl+C)
npm run dev
```

---

### **Step 5: Test It!**

1. Go to `/materials/upload`
2. Sign in with Google
3. Enter a **real college email** (you have access to)
4. Click "Send Verification Code"
5. **Check your email inbox!** 📧
6. Enter the OTP and verify

---

## 🔄 How It Works

### **With RESEND_API_KEY configured:**
```
1. User enters college email
2. OTP generated
3. ✅ Email sent via Resend
4. User receives professional HTML email
5. User enters OTP
6. Verified! ✅
```

### **Without RESEND_API_KEY:**
```
1. User enters college email
2. OTP generated
3. ⚠️ Email NOT sent (logs to console instead)
4. OTP shown in terminal
5. User enters OTP
6. Verified! ✅
```

---

## 📧 Email Template

The email includes:
- Beautiful HTML design
- Large, easy-to-read OTP code
- 10-minute expiry notice
- Professional branding
- Responsive design

---

## 🌐 Domain Verification (For Production)

### **For Testing:**
Use `onboarding@resend.dev` - works immediately! ✅

### **For Production:**
To send from your own domain (e.g., `noreply@kmit.in`):

1. Go to [Resend Domains](https://resend.com/domains)
2. Click **"Add Domain"**
3. Enter your domain: `kmit.in`
4. Add the DNS records shown
5. Wait for verification (~5 minutes)
6. Update `.env.local`:
   ```env
   EMAIL_FROM=noreply@kmit.in
   ```

---

## 💰 Pricing (FREE!)

**Resend Free Tier:**
- ✅ 100 emails/day
- ✅ 3,000 emails/month
- ✅ Perfect for college projects!

---

## 🧪 Testing

### **Test with Real Email:**
```bash
# 1. Add your API key to .env.local
# 2. Restart server
# 3. Enter YOUR email (that you can check)
# 4. Check your inbox!
```

### **Test without Email:**
```bash
# 1. Leave RESEND_API_KEY empty or remove it
# 2. OTP will show in terminal
# 3. Copy from console
```

---

## 🔍 Troubleshooting

### **"Email not sent" message**
✅ Check if `RESEND_API_KEY` is set in `.env.local`  
✅ Restart your dev server  
✅ Check API key is valid (no extra spaces)

### **Email not received**
✅ Check spam/junk folder  
✅ Verify email address is correct  
✅ Wait 1-2 minutes (can be delayed)  
✅ Check [Resend Logs](https://resend.com/logs)

### **"Invalid API key" error**
✅ Make sure key starts with `re_`  
✅ Copy the full key without spaces  
✅ Create a new API key if needed

---

## 📊 Monitor Emails

Track all sent emails in [Resend Dashboard](https://resend.com/emails):
- See delivery status
- View email content
- Check bounce/errors
- Monitor usage

---

## 🎯 For Your Interview/Demo

**With Email (Recommended):**
> "We use Resend API to send transactional emails. When a user requests verification, they receive a professional HTML email with their OTP code. The system has fallback to console logging if email is not configured."

**Without Email (Still Fine):**
> "For the demo, OTPs are displayed in the console. In production, we'd integrate with an email service like Resend, SendGrid, or AWS SES. The architecture is already in place."

---

## 🚀 Production Checklist

Before deploying:
- [ ] Sign up for Resend
- [ ] Get API key
- [ ] Verify your domain (optional but recommended)
- [ ] Set `RESEND_API_KEY` in production environment
- [ ] Set `EMAIL_FROM` to your domain
- [ ] Test email sending
- [ ] Monitor delivery in Resend dashboard

---

## 🔐 Security Notes

- ✅ API key is server-side only (never exposed to client)
- ✅ Rate limiting handled by Resend
- ✅ Email content is HTML-escaped
- ✅ No sensitive data in emails (just OTP)

---

## ✨ Alternative Email Services

If you prefer different service:

**SendGrid:**
```typescript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
await sgMail.send({ from, to, subject, html });
```

**Nodemailer (Gmail):**
```typescript
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user, pass }
});
await transporter.sendMail({ from, to, subject, html });
```

**Current implementation uses Resend - simplest and most reliable! ✅**

---

**Your app is now production-ready for email sending!** 🎉
