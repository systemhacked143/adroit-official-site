import nodemailer from "nodemailer";

// Create transporter instance
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Send verification email with a unique verification link
 * @param {string} email - User's email address
 * @param {string} name - User's name
 * @param {string} verificationToken - Unique token for email verification
 * @param {string} verificationUrl - Full verification URL to include in email
 */
export const sendVerificationEmail = async (
  email,
  name,
  verificationToken,
  verificationUrl
) => {
  const mailOptions = {
    from: `${process.env.SENDER_NAME || "AdroIT"} <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: "Verify Your AdroIT Account",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #00d4ff, #a855f7); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
            .content { background: #f5f5f5; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { 
              display: inline-block; 
              background: linear-gradient(135deg, #00d4ff, #a855f7); 
              color: white; 
              padding: 12px 30px; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
              font-weight: 600;
            }
            .button:hover { opacity: 0.9; }
            .footer { color: #666; font-size: 12px; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 20px; }
            .token { background: #fff; padding: 15px; border-radius: 5px; font-family: monospace; text-align: center; margin: 20px 0; border: 1px solid #ddd; }
            .warning { background: #fff3cd; padding: 10px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Email Verification Required</h1>
            </div>
            <div class="content">
              <p>Hello <strong>${name}</strong>,</p>
              
              <p>Welcome to AdroIT! To complete your account registration and unlock full access to our platform, please verify your email address by clicking the button below:</p>
              
              <center>
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </center>
              
              <p>Or copy and paste this verification link in your browser:</p>
              <div class="token">${verificationUrl}</div>
              
              <p>This verification link will expire in <strong>24 hours</strong>.</p>
              
              <div class="warning">
                <strong>Security Tip:</strong> Never share this link or verification code with anyone. AdroIT staff will never ask for this information.
              </div>
              
              <p>If you didn't create an AdroIT account, please ignore this email or let us know immediately.</p>
              
              <p>Best regards,<br><strong>The AdroIT Team</strong></p>
              
              <div class="footer">
                <p>This email was sent to <strong>${email}</strong></p>
                <p>&copy; 2024 AdroIT. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hello ${name},

Welcome to AdroIT! To complete your account registration, please verify your email address by visiting this link:

${verificationUrl}

This verification link will expire in 24 hours.

If you didn't create an AdroIT account, please ignore this email.

Best regards,
The AdroIT Team
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✓ Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error(`✗ Error sending verification email to ${email}:`, error);
    throw error;
  }
};

/**
 * Send welcome email after successful verification
 * @param {string} email - User's email address
 * @param {string} name - User's name
 */
export const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: `${process.env.SENDER_NAME || "AdroIT"} <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: "Welcome to AdroIT!",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #00d4ff, #a855f7); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
            .content { background: #f5f5f5; padding: 30px; border-radius: 0 0 10px 10px; }
            .feature-list { list-style: none; padding: 0; }
            .feature-list li { padding: 10px 0; padding-left: 30px; position: relative; }
            .feature-list li:before { content: "✓"; position: absolute; left: 0; color: #00d4ff; font-weight: bold; }
            .button { 
              display: inline-block; 
              background: linear-gradient(135deg, #00d4ff, #a855f7); 
              color: white; 
              padding: 12px 30px; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
              font-weight: 600;
            }
            .button:hover { opacity: 0.9; }
            .footer { color: #666; font-size: 12px; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Account Verified Successfully!</h1>
            </div>
            <div class="content">
              <p>Hello <strong>${name}</strong>,</p>
              
              <p>Congratulations! Your email has been verified and your AdroIT account is now fully active. You can now:</p>
              
              <ul class="feature-list">
                <li>Access all club resources and materials</li>
                <li>Participate in events and activities</li>
                <li>Connect with other members</li>
                <li>Update your profile and preferences</li>
              </ul>
              
              <center>
                <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/resources" class="button">Explore Resources</a>
              </center>
              
              <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
              
              <p>Happy learning!<br><strong>The AdroIT Team</strong></p>
              
              <div class="footer">
                <p>This email was sent to <strong>${email}</strong></p>
                <p>&copy; 2024 AdroIT. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hello ${name},

Congratulations! Your email has been verified and your AdroIT account is now fully active.

You can now access all club resources, participate in events, and connect with other members.

Visit: ${process.env.FRONTEND_URL || "http://localhost:5173"}/resources

Best regards,
The AdroIT Team
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✓ Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error(`✗ Error sending welcome email to ${email}:`, error);
    throw error;
  }
};

/**
 * Send password reset email
 * @param {string} email - User's email address
 * @param {string} name - User's name
 * @param {string} resetUrl - Password reset URL
 */
export const sendPasswordResetEmail = async (email, name, resetUrl) => {
  const mailOptions = {
    from: `${process.env.SENDER_NAME || "AdroIT"} <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: "Reset Your AdroIT Password",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #00d4ff, #a855f7); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
            .content { background: #f5f5f5; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { 
              display: inline-block; 
              background: linear-gradient(135deg, #00d4ff, #a855f7); 
              color: white; 
              padding: 12px 30px; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
              font-weight: 600;
            }
            .button:hover { opacity: 0.9; }
            .footer { color: #666; font-size: 12px; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 20px; }
            .warning { background: #f8d7da; padding: 10px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f5c6cb; color: #721c24; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello <strong>${name}</strong>,</p>
              
              <p>We received a request to reset the password for your AdroIT account. Click the button below to create a new password:</p>
              
              <center>
                <a href="${resetUrl}" class="button">Reset Password</a>
              </center>
              
              <p>Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; background: white; padding: 10px; border-radius: 5px;">${resetUrl}</p>
              
              <p>This reset link will expire in <strong>1 hour</strong>.</p>
              
              <div class="warning">
                <strong>Didn't request this?</strong> If you didn't ask to reset your password, please ignore this email. Your account is still secure.
              </div>
              
              <p>Best regards,<br><strong>The AdroIT Team</strong></p>
              
              <div class="footer">
                <p>This email was sent to <strong>${email}</strong></p>
                <p>&copy; 2024 AdroIT. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hello ${name},

We received a request to reset the password for your AdroIT account. To create a new password, visit this link:

${resetUrl}

This reset link will expire in 1 hour.

If you didn't request this, please ignore this email.

Best regards,
The AdroIT Team
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✓ Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error(`✗ Error sending password reset email to ${email}:`, error);
    throw error;
  }
};

export default transporter;
