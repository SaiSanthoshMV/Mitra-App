# 🎨 VISUAL FLOW DIAGRAM

## 📱 User Journey

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MATERIALS PAGE                               │
│                        (Public Access)                               │
│                                                                       │
│  [View All Materials] ────────────────► Anyone can view ✅           │
│  [Upload Material] ──────────────────► Requires verification         │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ Click "Upload"
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        UPLOAD PAGE                                   │
│                     (Protected Route)                                │
└─────────────────────────────────────────────────────────────────────┘
                                │
                   ┌────────────┴───────────┐
                   │                        │
            Not Logged In              Logged In
                   │                        │
                   ▼                        ▼
       ┌───────────────────┐    ┌─────────────────────┐
       │  Redirect to      │    │  Check Database:    │
       │  Google OAuth     │    │  is_verified?       │
       └───────────────────┘    └─────────────────────┘
                   │                        │
                   │                   ┌────┴─────┐
                   │                   │          │
                   │                false       true
                   │                   │          │
                   │                   ▼          ▼
                   │        ┌──────────────┐  ┌──────────────┐
                   │        │ VERIFICATION │  │ UPLOAD FORM  │
                   │        │    SCREEN    │  │   (Ready!)   │
                   │        └──────────────┘  └──────────────┘
                   │                   │
                   │                   │
                   ▼                   ▼
       ┌───────────────────────────────────────────┐
       │         GOOGLE OAUTH LOGIN                │
       │                                            │
       │  • Accepts ANY Google Account ✅           │
       │  • No domain restriction                  │
       │  • Creates user record (is_verified=false)│
       └───────────────────────────────────────────┘
                   │
                   │ Login Success
                   ▼
       ┌───────────────────────────────────────────┐
       │      COLLEGE EMAIL VERIFICATION           │
       │                                            │
       │  Step 1: Enter @kmit.edu.in email         │
       │  Step 2: Receive 6-digit OTP              │
       │  Step 3: Verify OTP                       │
       │  Step 4: Mark is_verified = true          │
       └───────────────────────────────────────────┘
                   │
                   │ Verification Success
                   ▼
       ┌───────────────────────────────────────────┐
       │         UPLOAD FORM UNLOCKED 🎉            │
       │                                            │
       │  • Upload materials                       │
       │  • Tracked by college email               │
       │  • Verified KMIT student ✅                │
       └───────────────────────────────────────────┘
```

---

## 🗄️ Database Flow

```
┌──────────────────────┐
│   FIRST LOGIN        │
│   (Google OAuth)     │
└──────────────────────┘
          │
          ▼
┌──────────────────────────────────────────┐
│  CREATE USER RECORD                      │
│  ─────────────────────────────────       │
│  google_email: user@gmail.com            │
│  college_email: NULL                     │
│  is_verified: false                      │
└──────────────────────────────────────────┘
          │
          │ Request verification
          ▼
┌──────────────────────────────────────────┐
│  CREATE VERIFICATION RECORD              │
│  ─────────────────────────────────       │
│  google_email: user@gmail.com            │
│  college_email: abc@kmit.edu.in          │
│  otp: 123456                             │
│  expires_at: NOW() + 10 minutes          │
│  verified: false                         │
└──────────────────────────────────────────┘
          │
          │ OTP verified successfully
          ▼
┌──────────────────────────────────────────┐
│  UPDATE USER RECORD                      │
│  ─────────────────────────────────       │
│  google_email: user@gmail.com            │
│  college_email: abc@kmit.edu.in ✅        │
│  is_verified: true ✅                     │
└──────────────────────────────────────────┘
          │
          │ Upload material
          ▼
┌──────────────────────────────────────────┐
│  CREATE MATERIAL RECORD                  │
│  ─────────────────────────────────       │
│  title: "Data Structures Notes"         │
│  subject: "CSE"                          │
│  semester: "Semester 3"                  │
│  uploaded_by: abc@kmit.edu.in ✅          │
│  file_url: https://...                   │
└──────────────────────────────────────────┘
```

---

## 🔐 Authentication Levels

```
┌─────────────────────────────────────────────────────────┐
│                    LEVEL 1: IDENTITY                     │
│                    (Google OAuth)                        │
│                                                           │
│  Purpose: WHO is the user?                               │
│  Method: Google OAuth (any email)                        │
│  Storage: google_email in database                       │
│  Access: Login to app ✅                                 │
└─────────────────────────────────────────────────────────┘
                           │
                           │ Authenticated
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  LEVEL 2: AUTHORIZATION                  │
│                 (College Email Verification)             │
│                                                           │
│  Purpose: ARE they a KMIT student?                       │
│  Method: OTP verification to @kmit.edu.in                │
│  Storage: college_email + is_verified in database        │
│  Access: Upload materials ✅                             │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 API Flow

### Send OTP API

```
POST /api/verify-email/send-otp
│
├─ Check: Is user logged in? (session)
│
├─ Validate: Is email @kmit.edu.in?
│
├─ Check: College email already used?
│
├─ Generate: 6-digit random OTP
│
├─ Store: Save to email_verifications table
│
├─ Send: Email via Supabase Auth
│         (or log to console in dev)
│
└─ Return: Success + OTP (dev mode only)
```

### Verify OTP API

```
POST /api/verify-email/verify-otp
│
├─ Check: Is user logged in? (session)
│
├─ Fetch: Verification record from database
│
├─ Validate: OTP matches?
│
├─ Check: OTP not expired?
│
├─ Update: Mark verification as complete
│
├─ Update: User record (is_verified = true)
│
└─ Return: Success message
```

### Upload API

```
POST /api/upload
│
├─ Check: Is user logged in? (session)
│
├─ Fetch: User verification status
│
├─ Verify: is_verified = true?
│
├─ Validate: File type, size, etc.
│
├─ Upload: File to R2 storage
│
├─ Insert: Metadata to database
│         (uploaded_by = college_email)
│
└─ Return: Success + file data
```

---

## 📊 State Transitions

```
┌─────────────┐
│   GUEST     │ ──── Visit /materials ────► VIEW ONLY
└─────────────┘
       │
       │ Click "Upload"
       ▼
┌─────────────┐
│ ANONYMOUS   │ ──── Google Sign In ────► CREATE ACCOUNT
└─────────────┘
       │
       │ OAuth Success
       ▼
┌─────────────┐
│ AUTHENTICATED│ ──── is_verified=false ──► CANNOT UPLOAD
│ (Unverified)│                              (Show Verification UI)
└─────────────┘
       │
       │ Verify College Email
       ▼
┌─────────────┐
│ AUTHENTICATED│ ──── is_verified=true ───► CAN UPLOAD ✅
│  (Verified) │                              (Show Upload Form)
└─────────────┘
```

---

## 🎯 Security Checkpoints

```
Checkpoint 1: OAuth Login
├─ ✅ Valid Google account
└─ ✅ Creates user record

Checkpoint 2: Upload Page Access
├─ ✅ Valid session exists
└─ ❌ If no session → Redirect to login

Checkpoint 3: Verification UI
├─ ✅ User is logged in
├─ ✅ College email is @kmit.edu.in
└─ ✅ College email not already used

Checkpoint 4: Upload Form Access
├─ ✅ User is logged in
├─ ✅ User is verified (is_verified=true)
└─ ❌ If not verified → Show verification UI

Checkpoint 5: Upload API
├─ ✅ Valid session
├─ ✅ User exists in database
├─ ✅ User is verified
├─ ✅ Valid file type/size
└─ ✅ Save with college_email
```

---

## 🌈 Color-Coded Status

```
🔴 RED (Blocked)
└─ No session → Cannot access upload page

🟡 YELLOW (Partial Access)
└─ Logged in but unverified → See verification screen

🟢 GREEN (Full Access)
└─ Logged in + verified → Can upload materials

🔵 BLUE (Public)
└─ Materials viewing → Always accessible
```

---

## 📋 Database Tables Relationship

```
┌─────────────────────┐
│       users         │
├─────────────────────┤
│ id (PK)             │
│ google_email (UQ)   │─────┐
│ college_email       │     │
│ is_verified         │     │
│ created_at          │     │
└─────────────────────┘     │
                            │
                            │ Foreign Key Relationship
                            │ (Not enforced, logical only)
                            │
         ┌──────────────────┴──────────────────┐
         │                                      │
         ▼                                      ▼
┌─────────────────────┐            ┌─────────────────────┐
│ email_verifications │            │  study_materials    │
├─────────────────────┤            ├─────────────────────┤
│ id (PK)             │            │ id (PK)             │
│ google_email        │            │ title               │
│ college_email       │            │ subject             │
│ otp                 │            │ semester            │
│ expires_at          │            │ file_url            │
│ verified            │            │ uploaded_by ────────┼──► college_email
│ created_at          │            │ created_at          │    (from users table)
│ updated_at          │            └─────────────────────┘
└─────────────────────┘
```

---

## 🎬 Timeline of Events

```
T+0:00  User visits /materials
T+0:02  Clicks "Upload Material"
T+0:03  Redirected to Google OAuth
T+0:10  Signs in with personal Gmail
T+0:12  User record created (is_verified=false)
T+0:13  Shows verification screen
T+0:15  Enters college email (abc@kmit.edu.in)
T+0:16  Clicks "Send Verification Code"
T+0:17  OTP generated and stored
T+0:18  OTP sent to college email (or logged to console)
T+0:45  User checks email / console
T+0:46  Enters 6-digit OTP
T+0:47  Clicks "Verify OTP"
T+0:48  OTP validated, user marked as verified
T+0:49  Success message shown
T+0:51  Page reloads
T+0:52  Upload form appears ✅
T+1:00  User fills form and uploads material
T+1:05  Material saved with college_email
T+1:06  Success! Material is now public 🎉
```

---

## 🏗️ Component Hierarchy

```
app/
├── layout.tsx
│   └── SessionProvider (NextAuth)
│
├── materials/
│   ├── page.tsx (PUBLIC - No auth required)
│   │   └── MaterialsClient
│   │
│   └── upload/
│       └── page.tsx (PROTECTED - Auth required)
│           ├── Check session
│           ├── Fetch verification status
│           │
│           └── Conditional Render:
│               ├─ Not verified?
│               │  └── CollegeEmailVerification
│               │      ├── Email input
│               │      ├── OTP input
│               │      └── Success message
│               │
│               └─ Verified?
│                  └── UploadClient
│                      ├── File input
│                      ├── Form fields
│                      └── Upload button
│
└── api/
    ├── auth/[...nextauth]/route.ts
    │   ├── signIn callback (create user)
    │   ├── jwt callback (fetch verification)
    │   └── session callback (add to session)
    │
    ├── verify-email/
    │   ├── send-otp/route.ts
    │   └── verify-otp/route.ts
    │
    └── upload/route.ts
        ├── Check session
        ├── Check verification
        ├── Validate file
        ├── Upload to R2
        └── Save metadata
```

---

**This visual guide helps understand the complete flow at a glance! 👀**
