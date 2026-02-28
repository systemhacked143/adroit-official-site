import "dotenv/config";
import { generateVerificationToken } from "./src/lib/auth.js";

console.log("Testing email verification flow...");
console.log("EMAIL_SERVICE_URL:", process.env.EMAIL_SERVICE_URL || "http://localhost:3001");

try {
  const token = await generateVerificationToken(
    "test-user-123",
    "autoalpha10721@gmail.com",
    "Test User"
  );
  console.log("✅ Token generated:", token);
  console.log("Check email service queue: http://localhost:3001/queue");
} catch (error) {
  console.error("❌ Error:", error.message);
  console.error(error);
}

process.exit(0);
