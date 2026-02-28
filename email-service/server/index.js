import 'dotenv/config';
import { sendVerificationEmail, sendWelcomeEmail } from '../lib/emailService.js';

const PORT = process.env.EMAIL_SERVICE_PORT || 3001;

// Simple in-memory queue (for production, use Redis/Bull)
const emailQueue = [];
let processing = false;

/**
 * Add email to queue
 */
function queueEmail(type, data) {
  emailQueue.push({ type, data, timestamp: Date.now() });
  processQueue();
}

/**
 * Process email queue
 */
async function processQueue() {
  if (processing || emailQueue.length === 0) return;

  processing = true;
  console.log(`🔄 Starting queue processing... Queue length: ${emailQueue.length}`);

  while (emailQueue.length > 0) {
    const job = emailQueue.shift();
    
    try {
      console.log(`📧 Processing email job: ${job.type}`);
      console.log(`   To: ${job.data.email}`);
      
      switch (job.type) {
        case 'verification':
          console.log(`   Calling sendVerificationEmail...`);
          await sendVerificationEmail(
            job.data.email,
            job.data.name,
            job.data.token,
            job.data.verificationUrl
          );
          console.log(`✓ Verification email sent to ${job.data.email}`);
          break;

        case 'welcome':
          console.log(`   Calling sendWelcomeEmail...`);
          await sendWelcomeEmail(
            job.data.email,
            job.data.name
          );
          console.log(`✓ Welcome email sent to ${job.data.email}`);
          break;

        default:
          console.warn(`⚠ Unknown email type: ${job.type}`);
      }
    } catch (error) {
      console.error(`✗ Error processing email job:`, error.message);
      console.error(`  Full error:`, error);
      // Retry logic: add back to queue
      emailQueue.push({ ...job, retries: (job.retries || 0) + 1 });
      
      if ((job.retries || 0) < 3) {
        console.log(`⏳ Retrying in 5 seconds... (attempt ${(job.retries || 0) + 1}/3)`);
        await new Promise(r => setTimeout(r, 5000));
      } else {
        console.error(`❌ Email job failed after 3 retries`);
      }
    }
  }

  processing = false;
  console.log(`✓ Queue processing complete`);
}

// HTTP Server for receiving email requests
import express from 'express';
const app = express();
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'running',
    queueLength: emailQueue.length,
    processing 
  });
});

// Queue an email
app.post('/send', (req, res) => {
  console.log(`📬 POST /send endpoint called`);
  const { type, data } = req.body;
  
  console.log(`   Type: ${type}`);
  console.log(`   Data to: ${data?.email}`);

  if (!type || !data) {
    console.warn(`⚠ Missing type or data in request`);
    return res.status(400).json({ error: 'Missing type or data' });
  }

  console.log(`   Queueing email...`);
  queueEmail(type, data);
  const statusResponse = { status: 'queued', queueLength: emailQueue.length };
  console.log(`   Response: ${JSON.stringify(statusResponse)}`);
  res.json(statusResponse);
});

// Get queue status
app.get('/queue', (req, res) => {
  res.json({ jobs: emailQueue, processing });
});

app.listen(PORT, () => {
  console.log(`\n📧 Email Service running on port ${PORT}`);
  console.log(`✓ Health check: http://localhost:${PORT}/health`);
  console.log(`✓ POST to http://localhost:${PORT}/send to queue emails\n`);
});
