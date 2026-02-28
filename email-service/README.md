# Email Service - Standalone Email Processing

This is a dedicated microservice for handling all email operations for AdroIT. Running it separately provides better separation of concerns, reliability, and scalability.

## ✅ Setup Complete!

The email service has been created with the following structure:

```
email-service/
├── server/
│   └── index.js           # Email service API server
├── lib/
│   └── emailService.js    # Email sending functions
├── package.json           # Dependencies
└── .env                   # SMTP configuration
```

## 🚀 How to Run

### Terminal 1: Email Service
```powershell
cd email-service
npm start
# or with auto-reload: npm run dev
```

Expected output:
```
📧 Email Service running on port 3001
✓ Health check: http://localhost:3001/health
✓ POST to http://localhost:3001/send to queue emails
```

### Terminal 2: Backend
```powershell
cd backend
npm run dev
# Will use the email service at http://localhost:3001
```

### Terminal 3: Frontend
```powershell
cd frontend
npm run dev
```

---

## 📧 Email Service API

### Health Check
```bash
GET http://localhost:3001/health
```

Response:
```json
{
  "status": "running",
  "queueLength": 0,
  "processing": false
}
```

### Queue an Email
```bash
POST http://localhost:3001/send
Content-Type: application/json

{
  "type": "verification",
  "data": {
    "email": "user@example.com",
    "name": "John Doe",
    "token": "abc123xyz",
    "verificationUrl": "http://localhost:5173/verify-email?token=abc123xyz"
  }
}
```

Supported email types:
- `verification` - Email verification on signup
- `welcome` - Welcome email after verification

### Get Queue Status
```bash
GET http://localhost:3001/queue
```

Response:
```json
{
  "jobs": [...],
  "processing": false
}
```

---

## 🔧 Configuration

The email service reads from `email-service/.env`:

```env
# SMTP Settings (same as backend)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noresponseplc@gmail.com
SMTP_PASSWORD=krieptvmensjodza
SENDER_EMAIL=noresponseplc@gmail.com
SENDER_NAME=AdroIT

# Frontend URL for email links
FRONTEND_URL=http://localhost:5173

# Email Service Port
EMAIL_SERVICE_PORT=3001
```

---

## 🔄 How It Works

1. **Backend receives signup request** → Creates user
2. **Backend calls email service API** → `POST /api/auth/send-verification-email`
3. **Email service queues the job** → Adds to processing queue
4. **Email service processes queue** → Sends verification email via SMTP
5. **User receives email** → Clicks verification link
6. **Email service sends welcome email** → After verification confirmed

---

## ✨ Features

✅ **Asynchronous Email Processing** - Emails don't block signup
✅ **Email Queue** - Handles multiple emails in sequence
✅ **Automatic Retry** - Retries failed emails up to 3 times
✅ **API Interface** - Easy integration with backend
✅ **Health Monitoring** - Check service status anytime
✅ **Separate Process** - Can be scaled independently

---

## 🧪 Testing

### Test Email Service Startup
```bash
curl http://localhost:3001/health
```

Should return: `{"status":"running","queueLength":0,"processing":false}`

### Test Queue an Email
```bash
curl -X POST http://localhost:3001/send \
  -H "Content-Type: application/json" \
  -d '{
    "type": "verification",
    "data": {
      "email": "test@gmail.com",
      "name": "Test User",
      "token": "test-token-123",
      "verificationUrl": "http://localhost:5173/verify-email?token=test-token-123"
    }
  }'
```

---

## 📋 Next Steps

1. **Update Backend** - Backend/VerifyEmail endpoints call this service
2. **Frontend Test** - Sign up and watch emails be queued and sent
3. **Production** - Deploy to separate server/container
4. **Scale** - Add Redis for distributed queue if needed

---

## 🚨 Troubleshooting

### Service won't start
```bash
# Check npm packages installed
ls email-service/node_modules

# If not, reinstall
cd email-service && npm install
```

### Emails not being sent
1. Check backend is calling `http://localhost:3001/send`
2. Verify SMTP credentials in `email-service/.env`
3. Check email service logs: `GET /health`

### Port 3001 already in use
```bash
# Change in email-service/.env
EMAIL_SERVICE_PORT=3002

# Then restart
npm start
```

---

## 🔒 Security Notes

- 🔐 SMTP credentials only in `.env` file
- ✅ No credentials logged or exposed
- 🔄 Uses secure TLS/STARTTLS connection
- 🚫 Add authentication to API in production

---

## 📦 Production Deployment

When deploying to production:

1. **Use a message queue** (Redis, RabbitMQ) instead of in-memory
2. **Add API authentication** - Validate requests from backend
3. **Monitor failures** - Log failed emails for investigation
4. **Scale horizontally** - Run multiple instances with shared queue
5. **Set up alerts** - Monitor queue size and processing time

---

**Email Service is ready!** ✨
