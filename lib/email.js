import nodemailer from "nodemailer";

// Create transporter
export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendPasswordResetEmail({ to, name, resetUrl }) {
  const mailOptions = {
    from: `"Gadgets BD" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Password Reset Request - Gadgets BD",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #131921; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .button { 
            display: inline-block; 
            background: #FF9900; 
            color: white; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 4px; 
            margin: 20px 0;
          }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>gadgets<span style="font-style: italic;">BD</span></h1>
          </div>
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hi ${name || "there"},</p>
            <p>We received a request to reset your password for your Gadgets BD account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #0066c0;">${resetUrl}</p>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
            <p>Thanks,<br>The Gadgets BD Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; ${new Date().getFullYear()} Gadgets BD. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Password Reset Request
      
      Hi ${name || "there"},
      
      We received a request to reset your password for your Gadgets BD account.
      
      Click the link below to reset your password:
      ${resetUrl}
      
      This link will expire in 1 hour.
      
      If you didn't request a password reset, you can safely ignore this email.
      
      Thanks,
      The Gadgets BD Team
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent to:", to);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send password reset email");
  }
}
