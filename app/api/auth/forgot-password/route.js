import { dbConnect } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import User from "@/models/User";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await dbConnect();

    // Find user by email (case-insensitive)
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    // Always return success for security (don't reveal if email exists)
    // But only send email if user actually exists
    if (user) {
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");

      // Hash the token before saving to database
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      // Save hashed token and expiry to user (expires in 1 hour)
      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      // Create reset URL with unhashed token
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

      // Send email
      await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetUrl,
      });
    }

    // Always return success (security best practice)
    return NextResponse.json({
      success: true,
      message: "If an account exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
