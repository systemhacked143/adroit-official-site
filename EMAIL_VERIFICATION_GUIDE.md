# Email-Based Authentication System Documentation

## Overview

This document explains the email verification authentication system implemented in the AdroIT platform. Users must verify their email address before they can log in to the platform.

## System Architecture

### Components

1. **Backend (Node.js + Express + MongoDB)**
   - Better-Auth library with email verification plugin
   - Nodemailer for SMTP email sending
   - MongoDB for user and verification token storage

2. **Frontend (React)**
   - Login page with sign-up form
   - Email verification status page
   - Integration with better-auth-client

3. **Email Service**
   - SMTP configuration with nodemailer
   - HTML email templates
   - Automatic email sending on sign-up

## Authentication Flow

### Sign-Up Process

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User fills registration form (name, email, password)          │
├─────────────────────────────────────────────────────────────────┤
│ 2. Frontend sends POST /api/auth/signup request                  │
├─────────────────────────────────────────────────────────────────┤
│ 3. Backend creates user in database with unverified status       │
├─────────────────────────────────────────────────────────────────┤
│ 4. Email verification plugin generates unique token               │
├─────────────────────────────────────────────────────────────────┤
│ 5. Nodemailer sends verification email with link containing token │
├─────────────────────────────────────────────────────────────────┤
│ 6. Frontend shows "Check your email" message                     │
└─────────────────────────────────────────────────────────────────┘
```

### Email Verification Process

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User clicks verification link in email                        │
├─────────────────────────────────────────────────────────────────┤
│ 2. Browser navigates to /verify-email?token=<unique_token>       │
├─────────────────────────────────────────────────────────────────┤
│ 3. Frontend calls verification endpoint with token               │
├─────────────────────────────────────────────────────────────────┤
│ 4. Better-auth verifies token and marks email as verified        │
├─────────────────────────────────────────────────────────────────┤
│ 5. Welcome email is automatically sent to user                   │
├─────────────────────────────────────────────────────────────────┤
│ 6. User is automatically signed in                               │
├─────────────────────────────────────────────────────────────────┤
│ 7. Frontend redirects to login/dashboard                         │
└─────────────────────────────────────────────────────────────────┘
```

### Login Process

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User enters email and password on login page                  │
├─────────────────────────────────────────────────────────────────┤
│ 2. Frontend sends POST /api/auth/signin request                  │
├─────────────────────────────────────────────────────────────────┤
│ 3. Backend checks if email is verified                           │
├─────────────────────────────────────────────────────────────────┤
│ 4a. If NOT verified: Login fails with message                    │
│ 4b. If verified: Credentials checked, JWT token created          │
├─────────────────────────────────────────────────────────────────┤
│ 5. Session cookie set (httpOnly, secure)                         │
├─────────────────────────────────────────────────────────────────┤
│ 6. Frontend redirects to /resources (protected page)             │
└─────────────────────────────────────────────────────────────────┘
```

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SENDER_EMAIL=noreply@adroit.com
SENDER_NAME=AdroIT

# Better-Auth Configuration
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

#### Setting up Gmail for SMTP

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable "Less secure app access" OR use App Passwords
3. For App Passwords:
   - Go to Security settings
   - Enable 2-Step Verification
   - Create an "App password" for Mail (select "App" and "Windows Computer")
   - Use the generated 16-character password in SMTP_PASSWORD

#### Alternative Email Providers

- **Sendgrid**: Change SMTP_HOST to `smtp.sendgrid.net`, SMTP_PORT to `587`
- **Mailgun**: Change SMTP_HOST to `smtp.mailgun.org`, SMTP_PORT to `587`
- **AWS SES**: Change SMTP_HOST to `email-smtp.<region>.amazonaws.com`

## Email Templates

### 1. Verification Email (`emailService.js`)
- HTML and plain text versions
- Contains unique verification link
- Expires in 24 hours
- Professional branding with AdroIT colors

### 2. Welcome Email (Auto-sent after verification)
- Congratulates user
- Lists available features
- Link to resources page

### 3. Password Reset Email (Optional implementation)
- Reset link with token
- Expires in 1 hour
- Security warning

## Database Schema

### User Document
```javascript
{
  _id: ObjectId,
  email: String,          // User's email address
  name: String,           // User's full name
  emailVerified: Boolean, // Email verification status
  verificationToken: {
    token: String,        // Unique verification token
    expiresAt: Date       // Token expiration (24 hours)
  },
  password: String,       // Hashed password (bcrypt)
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Better-Auth Automatic Endpoints

Better-auth provides several automatic endpoints:

```
POST   /api/auth/signup          - Register new user
POST   /api/auth/signin          - Sign in user
POST   /api/auth/signout         - Sign out user
POST   /api/auth/verify-email    - Verify email with token
GET    /api/auth/me              - Get current user info
```

### Custom Endpoints

```
POST   /api/auth/verify-email    - Custom verification handler (wrapper)
```

## Frontend Implementation

### Login Page (`Login.jsx`)
- Sign-up and Sign-in tabs
- Email verification state handling
- Shows "Check your email" after signup
- Redirects to verification page when user clicks email link

### Verification Page (`VerifyEmail.jsx`)
- Handles query parameter `token` from email link
- Shows verification status (loading, success, error, expired)
- Auto-redirects to login on success
- Explains next steps if verification fails

## Testing

### Manual Testing

1. **Sign Up**
   ```
   - Go to http://localhost:5173/login
   - Click "Sign Up" tab
   - Fill form: Name, Email, Password (8+ chars)
   - Click "Create Account"
   - Verify success message shows correct email
   ```

2. **Check Email (Development)**
   ```
   - Use Gmail: Check inbox and spam folder
   - Use MailHog (local): http://localhost:1025
   - Check nodemailer console logs for errors
   ```

3. **Verify Email**
   ```
   - Click link in email
   - Should show loading state then success message
   - Should auto-redirect to login page
   - Try logging in with verified account
   ```

4. **Failed Cases**
   - Invalid/expired token → Shows error message
   - Missing token → Shows error message
   - Unverified account sign-in → Shows error "Please verify email"

### Unit Testing Files

Test cases to implement:
- Email sending on signup
- Token generation and validation
- Token expiration (24 hours)
- Auto sign-in after verification
- Login rejection for unverified emails
- Welcome email sending after verification

## Security Measures

### 1. Token Security
- Unique tokens generated with cryptographic randomness
- Tokens expire after 24 hours
- Single-use tokens (invalidated after verification)

### 2. Password Security
- Passwords hashed with bcrypt (10 salt rounds)
- No plain-text passwords stored

### 3. Email Security
- HTML emails include security warnings
- Plain text email for clients without HTML support
- HTTPS links in emails (when deployed)

### 4. Cookie Security
```javascript
{
  httpOnly: true,        // JavaScript cannot access cookie
  secure: true,          // HTTPS only in production
  sameSite: 'strict',    // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
}
```

### 5. SMTP Security
- Using TLS/STARTTLS encryption
- Credentials stored in environment variables
- Never log credentials

## Error Handling

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid verification link" | Token missing or invalid | Resend signup link |
| "Verification link expired" | Token older than 24 hours | Create new account |
| "Email already verified" | Already verified account | Try logging in |
| "Invalid email or password" | Wrong credentials OR email not verified | Verify email first |
| "SMTP Error: 535" | Invalid Gmail credentials | Check app password |
| "Email not sent" | Network/SMTP error | Check email service logs |

## Troubleshooting

### Emails Not Being Sent

1. **Check SMTP Configuration**
   ```bash
   node -e "console.log(process.env.SMTP_HOST, process.env.SENDER_EMAIL)"
   ```

2. **Check Nodemailer Logs**
   - Look for errors in terminal running backend
   - Error format: `✗ Error sending verification email to`

3. **Gmail Issues**
   - Verify "Less secure app access" is enabled
   - Check 2FA is set up for app passwords
   - Verify SMTP_PASSWORD is correctly copied (no extra spaces)

4. **Test Email Service**
   ```javascript
   // Add to backend test file
   import { sendVerificationEmail } from './src/lib/emailService.js';
   
   sendVerificationEmail(
     'test@example.com',
     'Test User',
     'test-token-123',
     'http://localhost:5173/verify-email?token=test-token-123'
   ).then(() => console.log('✓ Email sent')).catch(e => console.log('✗', e));
   ```

### Verification Token Issues

1. **Token Not Working**
   - Check token hasn't expired (24 hours)
   - Verify token matches exactly (case-sensitive)
   - Check database for token expiration

2. **Auto Sign-In Not Working**
   - Check `autoSignInAfterVerification` is true in auth.js
   - Check cookies are being set correctly
   - Check CORS settings in server.js

### Database Issues

```javascript
// Check user verification status in MongoDB
db.users.findOne({ email: "user@example.com" }, 
  { emailVerified: 1, email: 1 }
)
```

## Production Deployment

### Before Going Live

1. **Environment Variables**
   ```
   SMTP_HOST=<production email service>
   SMTP_USER=<production email>
   SMTP_PASSWORD=<production password>
   SENDER_EMAIL=noreply@yourdomain.com
   BETTER_AUTH_SECRET=<strong random secret>
   BETTER_AUTH_URL=https://yourdomain.com
   FRONTEND_URL=https://yourfrontend.com
   ```

2. **Security Checklist**
   - [ ] Use HTTPS everywhere
   - [ ] Enable secure cookies (secure: true)
   - [ ] Strong BETTER_AUTH_SECRET (32+ characters)
   - [ ] Email service configured with TLS/SSL
   - [ ] No hardcoded credentials in code

3. **Email Customization**
   - [ ] Update email templates with production branding
   - [ ] Use production domain in sender email
   - [ ] Update links to production URLs
   - [ ] Test email delivery to various providers

4. **Database Setup**
   - [ ] Enable MongoDB authentication
   - [ ] Set up automated backups
   - [ ] Create indexes on email field for faster verification

5. **Monitoring**
   - [ ] Set up email delivery logs
   - [ ] Monitor verification success rates
   - [ ] Track failed login attempts
   - [ ] Alert on SMTP errors

## Future Enhancements

### Potential Improvements

1. **Resend Verification Email**
   - Add endpoint to resend verification email
   - Rate limit (e.g., 5 resends per day)
   - Update token expiration time

2. **Email Verification Timeout**
   - After 30 days of unverified account, delete account
   - Send reminder emails at 7 and 14 days

3. **Two-Factor Authentication**
   - Add TOTP (Time-based OTP) support
   - SMS verification as backup
   - Recovery codes

4. **Social Authentication**
   - Auto-verify emails for OAuth providers (Google, GitHub)
   - Multiple email addresses
   - Email linking for existing accounts

5. **Advanced Analytics**
   - Track verification conversion rates
   - Identify issues with email providers
   - Monitor bounce rates

## Related Files

- **Backend**
  - `/src/lib/auth.js` - Better-auth configuration
  - `/src/lib/emailService.js` - Email sending functions
  - `/src/controllers/authController.js` - Email verification endpoint
  - `/src/routes/auth.js` - Authentication routes

- **Frontend**
  - `/src/pages/Login.jsx` - Sign-up and login page
  - `/src/pages/VerifyEmail.jsx` - Email verification page
  - `/src/lib/auth-client.js` - Better-auth client setup

- **Configuration**
  - `/.env` - Environment variables (local)
  - `/.env.example` - Example environment template

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review error messages in backend logs
3. Check GitHub Issues for similar problems
4. Contact: adroit.rnsit@gmail.com
