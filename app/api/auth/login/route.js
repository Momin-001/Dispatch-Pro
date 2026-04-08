import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, roles, rolePermissions, permissions } from "@/lib/db/schema";
import { comparePassword } from "@/lib/auth/password";
import { signAccessToken } from "@/lib/auth/jwt";
import { setAuthCookies } from "@/lib/auth/cookies";
import { errorResponse } from "@/lib/response.handle";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return errorResponse("Email and password are required.", 400);
    }

    const [user] = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        phone: users.phone,
        passwordHash: users.passwordHash,
        status: users.status,
        roleId: users.roleId,
        roleName: roles.name,
      })
      .from(users)
      .innerJoin(roles, eq(users.roleId, roles.id))
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (!user) {
      return errorResponse("Invalid email or password.", 401);
    }

    if (!user.passwordHash) {
      return errorResponse("Please set your password first. Check your email for the setup link.", 401);
    }

    const validPassword = await comparePassword(password, user.passwordHash);
    if (!validPassword) {
      return errorResponse("Invalid email or password.", 401);
    }

    if (user.status === "pending_password") {
      return errorResponse("Please set your password first. Check your email for the setup link.", 403);
    }

    if (user.status === "suspended") {
      return errorResponse("Your account has been suspended. Please contact support.", 403);
    }

    if (user.status === "rejected") {
      return errorResponse("Your application has been rejected. Please contact support.", 403);
    }

    const permKeys = (
      await db
        .select({
          key: permissions.key,
          enabled: rolePermissions.enabled,
        })
        .from(rolePermissions)
        .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
        .where(eq(rolePermissions.roleId, user.roleId))
    )
      .filter((r) => r.enabled)
      .map((r) => r.key);

    const tokenPayload = { userId: user.id, role: user.roleName };
    const accessToken = signAccessToken(tokenPayload);

    const responseData = {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.roleName,
        status: user.status,
      },
      permissions: permKeys,
      accessToken,
    };

    const response = NextResponse.json(
      { 
        success: true, 
        message: "Login successful.", 
        data: responseData 
      },
      { status: 200 }
    );

    setAuthCookies(response, accessToken);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("Something went wrong. Please try again.", 500);
  }
}
