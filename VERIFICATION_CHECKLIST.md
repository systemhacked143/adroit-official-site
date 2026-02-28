# Email Authentication System - Verification Checklist

Use this checklist to verify the email authentication system is properly installed and working.

## 📦 Installation Verification

### Backend Dependencies
- [ ] `npm install nodemailer` completed
- [ ] `backend/package.json` includes nodemailer
- [ ] `backend/node_modules/nodemailer` exists
- [ ] No installation errors in console

### Check with Command:
```bash
cd backend && npm list nodemailer
# Should show: nodemailer@^6.9.0 or similar
```

---

## 🔧 Configuration Verification

### Environment Files
- [ ] `backend/.env` exists
- [ ] `SMTP_HOST` configured
- [ ] `SMTP_PORT` configured (587 for TLS)
- [ ] `SMTP_USER` set to email address
- [ ] `SMTP_PASSWORD` set to app password (not regular password)
- [ ] `SENDER_EMAIL` configured
- [ ] `SENDER_NAME` configured
- [ ] `BETTER_AUTH_SECRET` set (random string, 20+ chars)
- [ ] `BETTER_AUTH_URL` matches backend URL
- [ ] `FRONTEND_URL` matches frontend URL

### Example Verification:
```bash
cd backend
cat .env | grep SMTP_
cat .env | grep BETTER_AUTH_
cat .env | grep FRONTEND_
```

---

## 📁 Backend Files Verification

### Core Authentication
- [ ] `backend/src/lib/auth.js` exists
- [ ] Contains `emailVerification` import
- [ ] Contains `emailAndPassword` configuration
- [ ] `requireEmailVerification: true` is set
- [ ] `emailService` is imported

### Email Service
- [ ] `backend/src/lib/emailService.js` exists
- [ ] Contains `sendVerificationEmail()` function
- [ ] Contains `sendWelcomeEmail()` function
- [ ] Contains `sendPasswordResetEmail()` function (optional)
- [ ] Creates nodemailer transporter

### Controllers
- [ ] `backend/src/controllers/authController.js` exists
- [ ] Contains `getMe()` export
- [ ] Contains `verifyEmail()` export

### Routes
- [ ] `backend/src/routes/auth.js` exists
- [ ] POST `/api/auth/verify-email` route defined
- [ ] `verifyEmail` controller imported

### File Verification:
```bash
# Check files exist
ls -la backend/src/lib/auth.js
ls -la backend/src/lib/emailService.js
ls -la backend/src/controllers/authController.js
ls -la backend/src/routes/auth.js
```

---

## 📱 Frontend Files Verification

### Pages
- [ ] `frontend/src/pages/Login.jsx` exists
- [ ] Contains `verificationSent` state
- [ ] Contains `handleSignUp()` function
- [ ] Shows verification message after signup
- [ ] Has updated UI for verification flow

- [ ] `frontend/src/pages/VerifyEmail.jsx` exists
- [ ] Handles URL `?token=` parameter
- [ ] Shows loading state
- [ ] Shows success state
- [ ] Shows error state
- [ ] Auto-redirects on success

### Routing
- [ ] `frontend/src/App.jsx` exists
- [ ] Imports `VerifyEmail` component
- [ ] Route `/verify-email` defined
- [ ] Route in authentication section (no layout)

### File Verification:
```bash
# Check files exist
ls -la frontend/src/pages/Login.jsx
ls -la frontend/src/pages/VerifyEmail.jsx
ls -la frontend/src/App.jsx
```

---

## 🧪 Functionality Testing

### Backend Start Check
```bash
cd backend
npm run dev
```

Look for these messages:
- [ ] "🔐 Google OAuth Config:" section appears
- [ ] "📧 Email Verification Config:" section appears
- [ ] "MongoDB connected" message
- [ ] No errors in console
- [ ] Server listening on port 5000

### Frontend Start Check
```bash
cd frontend
npm run dev
```

Look for these messages:
- [ ] "VITE v..." appears
- [ ] "http://localhost:5173" ready
- [ ] No compilation errors
- [ ] All imports resolve

---

## 🔐 Configuration Testing

### Email Service Test
```bash
# Create a test file: test-email.js
# Add this code:

import { sendVerificationEmail } from './src/lib/emailService.js';

sendVerificationEmail(
  'your-test-email@gmail.com',
  'Test User',
  'test-token-12345',
  'http://localhost:5173/verify-email?token=test-token-12345'
).then(() => {
  console.log('✅ Email sent successfully');
  process.exit(0);
}).catch((err) => {
  console.error('❌ Email error:', err);
  process.exit(1);
});

# Run it:
cd backend
node test-email.js

# Expected output:
# ✓ Verification email sent to your-test-email@gmail.com
# ✅ Email sent successfully
```

---

## 🌐 UI Testing

### Login Page
1. [ ] Go to http://localhost:5173/login
2. [ ] See "Sign In" and "Sign Up" tabs
3. [ ] Click "Sign Up" tab
4. [ ] Form visible: Name field, Email field, Password field
5. [ ] All input fields functional

### Sign Up Flow
1. [ ] Fill form with test data:
   - Name: "Test User"
   - Email: "testuser@gmail.com"
   - Password: "TestPass123"
2. [ ] Click "Create Account" button
3. [ ] See loading spinner
4. [ ] After 2-3 seconds, see "Verify Your Email" screen
5. [ ] Email address displayed correctly
6. [ ] Verification instructions visible
7. [ ] "Back to Sign Up" button works

### Email Check
1. [ ] Check email inbox for verification email
2. [ ] Email from: `noreply@adroit.com` (or configured SENDER_EMAIL)
3. [ ] Subject: "Verify Your AdroIT Account"
4. [ ] Contains verification link
5. [ ] Link format: `http://localhost:5173/verify-email?token=abc123...`

### Email Verification Flow
1. [ ] Click verification link in email
2. [ ] Browser shows "Verifying..." page
3. [ ] See loading spinner
4. [ ] After 2-3 seconds, see "Email Verified!" message
5. [ ] See "Go to Login" button
6. [ ] Auto-redirect after 2 seconds (or click button)
7. [ ] Redirected to login page

### Login Test
1. [ ] Go to http://localhost:5173/login
2. [ ] Click "Sign In" tab
3. [ ] Enter verified email
4. [ ] Enter password
5. [ ] Click "Sign In"
6. [ ] See loading state briefly
7. [ ] Redirected to /resources (or dashboard)
8. [ ] Can access protected pages

---

## ❌ Error Cases Testing

### Case 1: Invalid Token
1. [ ] Go to: `http://localhost:5173/verify-email?token=invalid123`
2. [ ] Should show "Verification Failed" message
3. [ ] Should show error instructions
4. [ ] "Back to Sign Up" button available

### Case 2: Expired Token (>24 hours)
1. [ ] Try verifying with expired token
2. [ ] Should show "Link Expired" message
3. [ ] Should prompt to create new account
4. [ ] Support contact link visible

### Case 3: Missing Token
1. [ ] Go to: `http://localhost:5173/verify-email` (no token)
2. [ ] Should show "Invalid verification link" error
3. [ ] Should suggest signing up again

### Case 4: Login Before Verification
1. [ ] Sign up but don't verify email
2. [ ] Go to login page
3. [ ] Try logging in
4. [ ] Should show "Please verify email" error
5. [ ] Cannot access protected pages

### Case 5: Wrong Password
1. [ ] Use verified email account
2. [ ] Enter wrong password
3. [ ] Should show "Invalid password" error
4. [ ] Can try again

---

## 📊 Database Verification

### MongoDB Check (if using local MongoDB)
```bash
# Connect to MongoDB
mongo

# Select database
use club-members

# Check users collection
db.users.find().pretty()

# Look for:
# - email field (user's email)
# - emailVerified field (should be true after verification)
# - email_verified_at field (timestamp)
```

---

## 🔄 Complete Flow Test (5 minutes)

### Full Integration Test
1. [ ] Start backend: `npm run dev`
2. [ ] Start frontend: `npm run dev`
3. [ ] Open login page: http://localhost:5173/login
4. [ ] Sign up with new email
5. [ ] See verification message
6. [ ] Check email inbox
7. [ ] Click verification link
8. [ ] See success page
9. [ ] Go to login
10. [ ] Sign in with verified account
11. [ ] Access protected resources
12. [ ] Sign out works

---

## 📈 Performance Checks

### Email Sending Speed
- [ ] Email sent within 2-3 seconds after signup
- [ ] No timeout errors
- [ ] No SMTP connection errors

### Verification Speed
- [ ] Verification completes within 1-2 seconds
- [ ] No database query errors
- [ ] Auto-redirect works smoothly

### Frontend Performance
- [ ] Login page loads instantly
- [ ] Verification page responds quickly
- [ ] No console JavaScript errors

---

## 🔒 Security Checks

### Token Security
- [ ] Tokens are unique (compare multiple signups)
- [ ] Tokens are long (20+ characters)
- [ ] Tokens expire after 24 hours
- [ ] Same token doesn't work twice

### Cookie Security (Chrome DevTools F12 > Application > Cookies)
- [ ] Session cookie present after login
- [ ] Cookie is httpOnly (cannot access via JS)
- [ ] Cookie has sameSite attribute
- [ ] Cookie has max age

### SMTP Security
- [ ] Credentials not logged in console
- [ ] No passwords in error messages
- [ ] SMTP_PASSWORD in .env is not hardcoded
- [ ] Environment variables loaded correctly

---

## 📚 Documentation Verification

### Files Present
- [ ] `EMAIL_VERIFICATION_GUIDE.md` exists
- [ ] `IMPLEMENTATION_SUMMARY.md` exists
- [ ] `QUICK_START.md` exists
- [ ] This checklist file

### Documentation Quality
- [ ] Setup instructions are clear
- [ ] Configuration examples provided
- [ ] Troubleshooting section complete
- [ ] Code examples accurate

---

## 🚀 Deployment Readiness

### Before Production
- [ ] All tests pass
- [ ] Error messages don't expose sensitive info
- [ ] Logging is appropriate (not too verbose)
- [ ] No hardcoded credentials
- [ ] .env file in .gitignore
- [ ] HTTPS configured for production
- [ ] Email service upgraded for volume
- [ ] Database backups configured
- [ ] Error monitoring set up

---

## ✅ Final Sign-Off

### Developer Checklist
- [ ] All files created and modified
- [ ] No syntax errors in code
- [ ] Dependencies installed
- [ ] Configuration complete
- [ ] Manual testing passed
- [ ] Error cases tested
- [ ] Database verified
- [ ] Documentation reviewed
- [ ] Ready for deployment

### Project Manager Checklist
- [ ] Feature requirements met
- [ ] Email template approved
- [ ] User experience satisfactory
- [ ] Support documentation provided
- [ ] Testing methodology understood
- [ ] Deployment plan clear

---

## 🐛 Quick Debugging Commands

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check if nodemailer installed
npm list nodemailer --prefix backend

# Test email configuration
node -e "import('dotenv/config'); console.log({host: process.env.SMTP_HOST, port: process.env.SMTP_PORT})"

# View backend logs
cd backend && npm run dev 2>&1 | grep -i "email\|auth\|error"

# Test MongoDB connection
mongosh mongodb://localhost:27017/club-members

# Clear browser cache
# Chrome: Ctrl+Shift+Delete
# Firefox: Ctrl+Shift+Delete
# Safari: Cmd+Shift+Delete
```

---

## 📞 Support Resources

- **Quick Start**: `QUICK_START.md` (5-minute setup)
- **Complete Guide**: `EMAIL_VERIFICATION_GUIDE.md` (full documentation)
- **Changes Made**: `IMPLEMENTATION_SUMMARY.md` (technical details)
- **This Checklist**: Verification checklist (you are here)

---

## ✨ Status Summary

| Item | Status | Notes |
|------|--------|-------|
| Code Implementation | ✅ Complete | All files created/modified |
| Dependencies | ✅ Complete | Nodemailer installed |
| Configuration | 🔄 In Progress | Awaiting SMTP setup |
| Testing | 🔄 In Progress | Manual testing needed |
| Documentation | ✅ Complete | All guides provided |
| Deployment | ⏳ Ready | When configuration done |

---

**System is ready for testing once SMTP credentials are configured! 🎉**

Next Step: Configure SMTP in `.env` and run through the Complete Flow Test.
