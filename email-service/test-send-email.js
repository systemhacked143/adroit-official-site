import "dotenv/config";
import { sendVerificationEmail } from "./lib/emailService.js";

console.log("📧 Testing email sending directly...");
console.log("  SMTP User:", process.env.SMTP_USER);
console.log("  Sender Email:", process.env.SENDER_EMAIL);

try {
  const result = await sendVerificationEmail(
    "autoalpha10721@gmail.com",
    "Test User",
    "token-123",
    "http://localhost:5173/verify-email?token=token-123"
  );
  console.log("✅ Email sent successfully!");
  console.log("Result:", result);
} catch (error) {
  console.error("❌ Email sending failed!");
  console.error("Error:", error.message);
  console.error("Code:", error.code);
  console.error("Response:", error.response);
  console.error("Full error:", error);
}

process.exit(0);
