import { generateVerificationToken, verifyEmailToken } from "../lib/auth.js";

export const getMe = (req, res) => {
  res.json({ user: req.user });
};

/**
 * Send verification email to user
 * Called after signup to generate and send verification email
 */
export const sendVerificationEmail = async (req, res) => {
  try {
    const { userId, email, name } = req.body;

    console.log("📧 sendVerificationEmail endpoint called");
    console.log("  userId:", userId);
    console.log("  email:", email);
    console.log("  name:", name);

    if (!userId || !email) {
      return res.status(400).json({
        success: false,
        message: "User ID and email are required",
      });
    }

    await generateVerificationToken(userId, email, name || email);

    res.status(200).json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send verification email",
      error: error.message,
    });
  }
};

/**
 * Verify email with token
 * Called when user clicks verification link
 */
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
        error: "Missing token",
      });
    }

    const user = await verifyEmailToken(token);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);

    if (error.message.includes("expired")) {
      return res.status(410).json({
        success: false,
        message: "Verification link has expired",
        error: "Token expired",
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || "Failed to verify email",
      error: error.message,
    });
  }
};
