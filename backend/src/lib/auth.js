import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import crypto from "crypto";

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/club-members";
const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_URL || "http://localhost:3001";

const client = new MongoClient(MONGO_URI);
await client.connect();
const db = client.db();

console.log("🔐 Google OAuth Config:");
console.log("  CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "✓ Set" : "✗ Missing");
console.log(
  "  CLIENT_SECRET:",
  process.env.GOOGLE_CLIENT_SECRET ? "✓ Set" : "✗ Missing"
);
console.log("  BASE_URL:", process.env.BETTER_AUTH_URL || "http://localhost:5000");

console.log("📧 Email Service Config:");
console.log("  EMAIL_SERVICE_URL:", EMAIL_SERVICE_URL);
console.log("  SENDER_EMAIL:", process.env.SENDER_EMAIL || "Not configured");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  secret:
    process.env.BETTER_AUTH_SECRET || "super-secret-key-change-in-production",
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    // Disable email verification enforcement - we'll handle it ourselves
    sendVerificationEmail: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: true,
      },
      approved: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: true,
      },
      emailVerified: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      verificationToken: {
        type: "string",
        required: false,
        defaultValue: null,
        input: false,
      },
      verificationTokenExpires: {
        type: "number",
        required: false,
        defaultValue: null,
        input: false,
      },
      geminiApiKey: {
        type: "string",
        required: false,
        defaultValue: null,
        input: true,
      },
    },
  },
  trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:5173"],
});

/**
 * Generate a verification token and queue verification email via email service
 */
export const generateVerificationToken = async (userId, userEmail, userName) => {
  try {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Store token in database
    const usersCollection = db.collection("user");
    await usersCollection.updateOne(
      { id: userId },
      {
        $set: {
          verificationToken: token,
          verificationTokenExpires: expiresAt,
        },
      }
    );

    // Queue verification email via email service
    const verificationUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/verify-email?token=${token}`;

    const payload = {
      type: "verification",
      data: {
        email: userEmail,
        name: userName,
        token,
        verificationUrl,
      },
    };

    console.log(`🚀 Queuing verification email to ${userEmail}`);
    console.log(`   Email Service URL: ${EMAIL_SERVICE_URL}`);

    try {
      const response = await fetch(`${EMAIL_SERVICE_URL}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      console.log(`   Response Status: ${response.status}`);
      console.log(`   Response Body: ${responseText}`);

      if (!response.ok) {
        console.warn(`⚠ Email service returned status ${response.status}`);
      } else {
        console.log(`✓ Verification email queued for ${userEmail}`);
      }
    } catch (emailError) {
      console.error(`✗ Failed to queue verification email:`, emailError.message);
      console.error(emailError);
      // Don't throw - token is still stored, can retry later
    }

    return token;
  } catch (error) {
    console.error("Error generating verification token:", error);
    throw error;
  }
};

/**
 * Verify email token and mark user as verified
 */
export const verifyEmailToken = async (token) => {
  try {
    const usersCollection = db.collection("user");

    // Find user with matching token and non-expired token
    const user = await usersCollection.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Invalid or expired verification token");
    }

    // Mark email as verified and clear token
    await usersCollection.updateOne(
      { id: user.id },
      {
        $set: {
          emailVerified: true,
          verificationToken: null,
          verificationTokenExpires: null,
        },
      }
    );

    // Queue welcome email via email service
    try {
      await fetch(`${EMAIL_SERVICE_URL}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "welcome",
          data: {
            email: user.email,
            name: user.name || user.email,
          },
        }),
      });
      console.log(`✓ Welcome email queued for ${user.email}`);
    } catch (emailError) {
      console.error(`⚠ Failed to queue welcome email:`, emailError);
      // Don't throw - verification is still complete
    }

    console.log(`✓ Email verified for user: ${user.email}`);
    return user;
  } catch (error) {
    console.error("Error verifying email token:", error);
    throw error;
  }
};

export { db };
