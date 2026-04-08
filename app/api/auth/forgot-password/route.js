import { eq } from "drizzle-orm";
import crypto from "crypto";
import { db } from "@/lib/db";
import { users, passwordSetupTokens } from "@/lib/db/schema";
import { hashToken } from "@/lib/auth/jwt";
import { createEmailTransporter } from "@/lib/email-transporter";
import { successResponse, errorResponse } from "@/lib/response.handle";
import { NEXT_PUBLIC_APP_URL } from "@/lib/constants";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return errorResponse("Email is required.", 400);
    }

    // Always return success to prevent email enumeration
    const genericSuccess = "If an account exists with this email, you will receive a password reset link.";

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (!user) {
      return successResponse(genericSuccess);
    }

    if (user.status === "suspended" || user.status === "rejected") {
      return successResponse(genericSuccess);
    }

    const rawToken = crypto.randomBytes(48).toString("hex");
    const tokenHash = hashToken(rawToken);

    await db.insert(passwordSetupTokens).values({
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    const transporter = createEmailTransporter();
    if (transporter) {
      const resetUrl = `${NEXT_PUBLIC_APP_URL}/set-password?token=${rawToken}`;
      await transporter.sendMail({
        from: `"DispatchPro" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: "Reset Your DispatchPro Password",
        html: `
          <h2>Password Reset Request</h2>
          <p>Hi ${user.fullName}, click the button below to reset your password:</p>
          <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#00796B;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">
            Reset Password
          </a>
          <p style="margin-top:16px;color:#666;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
        `,
      });
    }

    return successResponse(genericSuccess);
  } catch (error) {
    console.error("Forgot password error:", error);
    return errorResponse("Something went wrong. Please try again.", 500);
  }
}
