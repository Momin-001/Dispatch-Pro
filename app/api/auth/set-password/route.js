import { eq, and, gt } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, passwordSetupTokens } from "@/lib/db/schema";
import { hashToken } from "@/lib/auth/jwt";
import { hashPassword } from "@/lib/auth/password";
import { successResponse, errorResponse } from "@/lib/response.handle";

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return errorResponse("Token and password are required.", 400);
    }

    if (password.length < 8) {
      return errorResponse("Password must be at least 8 characters.", 400);
    }

    const tokenHash = hashToken(token);

    const [tokenRecord] = await db
      .select()
      .from(passwordSetupTokens)
      .where(
        and(
          eq(passwordSetupTokens.tokenHash, tokenHash),
          eq(passwordSetupTokens.used, false),
          gt(passwordSetupTokens.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!tokenRecord) {
      return errorResponse("Invalid or expired token. Please request a new link.", 400);
    }

    const passwordHash = await hashPassword(password);

    await db
      .update(users)
      .set({
        passwordHash,
        status: "pending_approval",
        updatedAt: new Date(),
      })
      .where(eq(users.id, tokenRecord.userId));

    await db
      .update(passwordSetupTokens)
      .set({ used: true })
      .where(eq(passwordSetupTokens.id, tokenRecord.id));

    return successResponse("Password set successfully. You can now log in.");
  } catch (error) {
    console.error("Set password error:", error);
    return errorResponse("Something went wrong. Please try again.", 500);
  }
}
