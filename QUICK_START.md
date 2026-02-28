# Email Authentication - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependency (Already Done ✅)
```bash
cd backend
npm install nodemailer
```

### Step 2: Configure SMTP in `.env`

Copy this to your `backend/.env` file and update with your credentials:

```env
# SMTP Configuration for Email Verification
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SENDER_EMAIL=noreply@adroit.com
SENDER_NAME=AdroIT
BETTER_AUTH_SECRET=your-secret-key-change-this
BETTER_AUTH_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

### Step 3: Get Gmail App Password (2 minutes)

1. Go to: https://myaccount.google.com/security
2. Click "2-Step Verification" (enable if not already)
3. Scroll down and find "App passwords"
4. Select "Mail" and "Windows Computer"
5. Copy the 16-character password
6. Paste in `SMTP_PASSWORD` in `.env`

### Step 4: Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Should see: "✓ Verification email" in logs
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Should see: http://localhost:5173 ready
```

### Step 5: Test the Flow (2 minutes)

1. **Open Login Page**: http://localhost:5173/login
2. **Sign Up**:
   - Click "Sign Up" tab
   - Enter: Name, Email, Password (8+ chars)
   - Click "Create Account"
3. **Check Email**:
   - Look in Gmail inbox
   - Check spam folder if not found
4. **Verify Email**:
   - Click link in email
   - See success message
5. **Login**:
   - Enter email + password
   - Should login successfully

---

## 📋 File Checklist

### ✅ Backend Files
- [x] `backend/.env` - Configured SMTP
- [x] `backend/src/lib/auth.js` - Email verification plugin
- [x] `backend/src/lib/emailService.js` - Email templates
- [x] `backend/src/controllers/authController.js` - Verification endpoint
- [x] `backend/src/routes/auth.js` - Verification route

### ✅ Frontend Files
- [x] `frontend/src/pages/Login.jsx` - Sign-up with email verification
- [x] `frontend/src/pages/VerifyEmail.jsx` - Verification page
- [x] `frontend/src/App.jsx` - Routes added

### ✅ Documentation
- [x] `EMAIL_VERIFICATION_GUIDE.md` - Complete guide
- [x] `IMPLEMENTATION_SUMMARY.md` - What was changed
- [x] `QUICK_START.md` - This file

---

## 🐛 Troubleshooting

### Email Not Received?

**Check 1: Backend Logs**
```
✓ Verification email sent to user@example.com
```
If you don't see this, check:
1. SMTP_HOST, SMTP_USER, SMTP_PASSWORD in `.env`
2. Backend terminal for error messages
3. Restart backend after updating `.env`

**Check 2: Gmail Settings**
- Is 2-Step Verification enabled?
- Did you use the correct App Password (not your Gmail password)?
- Is the app password 16 characters (with spaces)?

**Check 3: Spam Folder**
- Check Gmail spam folder
- Add sender email to contacts

### Verification Link Not Working?

1. Make sure token is complete (not truncated)
2. Link should look like: `http://localhost:5173/verify-email?token=abc123...`
3. Token expires after 24 hours
4. Try signing up again if expired

### Login Says "Please Verify Email"?

- Email hasn't been verified yet
- OR verification failed
- Try clicking the verification link again

---

## 📧 Testing Different Email Providers

### Gmail (Recommended for Dev)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
```

### Sendgrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.com
SMTP_PASSWORD=your-mailgun-password
```

### MailHog (Local Testing - No Email)
```
Note: MailHog is a local SMTP server (doesn' actually send emails)
Visit: http://localhost:1025 to see emails
```

---

## 🔐 Security Reminders

1. **Never commit** `.env` file to git
2. **Use strong** `BETTER_AUTH_SECRET` in production
3. **Use HTTPS** links in production
4. **Enable secure cookies** with `secure: true` in production
5. **Use app passwords** instead of Gmail password

---

## 🎯 Complete User Flow

```
┌─ SIGN UP PAGE
│  User enters: Name, Email, Password
│
├─ API CALL: POST /api/auth/signup
│  ├─ Backend creates user (unverified)
│  ├─ Generates verification token
│  └─ Sends verification email
│
├─ CHECK EMAIL PAGE
│  User sees: "We sent a link to your@email.com"
│
├─ USER CLICKS EMAIL LINK
│  ├─ Browser goes to: /verify-email?token=123abc
│  └─ Frontend calls: POST /api/auth/verify-email
│
├─ VERIFICATION PROCESSING
│  ├─ Backend marks email as verified
│  ├─ Sends welcome email
│  └─ Auto-signs in user
│
├─ SUCCESS PAGE
│  ├─ User sees: "Email verified!"
│  ├─ 2-second countdown
│  └─ Auto-redirects to /login
│
└─ READY TO USE
   User logged in and can access all features
```

---

## ✨ Features Implemented

- ✅ Email verification on sign-up
- ✅ 24-hour expiration tokens
- ✅ Automatic welcome email after verification
- ✅ Beautiful email templates (HTML + plain text)
- ✅ Auto sign-in after verification
- ✅ Prevents login until email verified
- ✅ Error handling and recovery
- ✅ SMTP configuration flexibility
- ✅ Security best practices
- ✅ Comprehensive documentation

---

## 📚 Full Documentation

For complete details, see:
- **Setup**: `EMAIL_VERIFICATION_GUIDE.md`
- **Changes Made**: `IMPLEMENTATION_SUMMARY.md`
- **This Guide**: `QUICK_START.md`

---

## 🎉 Ready to Deploy!

Your email authentication system is complete. To deploy:

1. See production checklist in `EMAIL_VERIFICATION_GUIDE.md`
2. Configure production SMTP service
3. Update environment variables
4. Test thoroughly before going live

---

## 💬 Need Help?

1. Check the documentation files
2. Review error messages in backend logs
3. Contact: adroit.rnsit@gmail.com

Happy authenticating! 🚀
