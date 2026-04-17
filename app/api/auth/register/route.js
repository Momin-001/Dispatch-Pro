import { eq, and } from "drizzle-orm";
import crypto from "crypto";
import { db } from "@/lib/db";
import {
  users,
  roles,
  passwordSetupTokens,
  userDocuments,
  verificationDocumentTypes,
} from "@/lib/db/schema";
import { hashToken } from "@/lib/auth/jwt";
import { createEmailTransporter } from "@/lib/email-transporter";
import { successResponse, errorResponse } from "@/lib/response.handle";
import { NEXT_PUBLIC_APP_URL, SMTP_USER } from "@/lib/constants";
import { uploadApplicationFile } from "@/lib/uploads/application-file";

const VALID_ROLES = ["driver", "dispatcher", "shipper", "owner_operator"];

/** Slugs must match `lib/db/seed/documents.js` */
const INITIAL_UPLOAD_SLUG_BY_ROLE = {
  driver: "driver-cdl-license",
  dispatcher: "dispatcher-resume",
};

const PROFILE_FIELD_NAMES = [
  "cdlNumber",
  "yearsExperience",
  "equipmentType",
  "companyName",
  "monthlyLoadEstimate",
  "region",
];

function emptyToNull(v) {
  if (v == null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

function profileFromFormData(formData) {
  const out = {};
  for (const key of PROFILE_FIELD_NAMES) {
    out[key] = emptyToNull(formData.get(key));
  }
  return out;
}

function profileFromBody(body) {
  const out = {};
  for (const key of PROFILE_FIELD_NAMES) {
    out[key] = emptyToNull(body?.[key]);
  }
  return out;
}

async function parseRequest(request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();

    const fileEntry = formData.get("file");
    const file =
      fileEntry &&
      typeof fileEntry === "object" &&
      typeof fileEntry.arrayBuffer === "function" &&
      fileEntry.size > 0
        ? fileEntry
        : null;

    return {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      roleName: formData.get("role"),
      ...profileFromFormData(formData),
      file,
    };
  }

  const body = await request.json();
  return {
    fullName: body.fullName,
    email: body.email,
    phone: body.phone,
    roleName: body.role,
    ...profileFromBody(body),
    file: null,
  };
}

export async function POST(request) {
  try {
    const parsed = await parseRequest(request);

    const {
      fullName,
      email,
      phone,
      roleName,
      file,
      cdlNumber,
      yearsExperience,
      equipmentType,
      shippmentType,
      companyName,
      monthlyLoadEstimate,
      region,
    } = parsed;

    if (!fullName || !email || !roleName) {
      return errorResponse("Full name, email, and role are required.", 400);
    }

    if (!VALID_ROLES.includes(roleName)) {
      return errorResponse("Invalid role.", 400);
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, String(email).toLowerCase().trim()))
      .limit(1);

    if (existingUser.length > 0) {
      return errorResponse("An account with this email already exists.", 409);
    }

    const [role] = await db
      .select()
      .from(roles)
      .where(eq(roles.name, roleName))
      .limit(1);

    if (!role) {
      return errorResponse("Role not found.", 400);
    }

    if (roleName === "shipper" && file) {
      return errorResponse("Shipper registration does not accept file uploads on this form.", 400);
    }

    let docTypeRow = null;
    let uploadResult = null;

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return errorResponse("File must be 5 MB or smaller.", 400);
      }

      const slug = INITIAL_UPLOAD_SLUG_BY_ROLE[roleName];
      const [docType] = await db
        .select()
        .from(verificationDocumentTypes)
        .where(
          and(
            eq(verificationDocumentTypes.slug, slug),
            eq(verificationDocumentTypes.roleId, role.id)
          )
        )
        .limit(1);

      if (!docType) {
        return errorResponse("Verification document type is not configured. Run database seed.", 500 );
      }

      docTypeRow = docType;

      const buffer = Buffer.from(await file.arrayBuffer());
      uploadResult = await uploadApplicationFile(buffer, {
        role: roleName,
        mimeType: file.type || "application/octet-stream",
        originalFilename: file.name,
      });
    }

    const rawToken = crypto.randomBytes(48).toString("hex");
    const tokenHash = hashToken(rawToken);

    const newUser = await db.transaction(async (tx) => {
      const [insertedUser] = await tx
        .insert(users)
        .values({
          fullName: String(fullName).trim(),
          email: String(email).toLowerCase().trim(),
          phone: String(phone).trim(),
          roleId: role.id,
          status: "pending_password",
          cdlNumber,
          yearsExperience,
          equipmentType,
          shippmentType,
          companyName,
          monthlyLoadEstimate,
          region,
        })
        .returning();

      await tx.insert(passwordSetupTokens).values({
        userId: insertedUser.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });

      if (uploadResult && docTypeRow) {
        await tx.insert(userDocuments).values({
          userId: insertedUser.id,
          docTypeId: docTypeRow.id,
          fileUrl: uploadResult.secure_url,
          cloudinaryPublicId: uploadResult.public_id,
          status: "pending",
          isOther: false,
        });
      }

      return insertedUser;
    });

    const transporter = createEmailTransporter();
    if (transporter) {
      const setPasswordUrl = `${NEXT_PUBLIC_APP_URL}/set-password?token=${rawToken}`;
      await transporter.sendMail({
        from: `"DispatchPro" <${SMTP_USER}>`,
        to: newUser.email,
        subject: "Set Up Your DispatchPro Password",
        html: `
          <h2>Welcome to DispatchPro, ${newUser.fullName}!</h2>
          <p>Your application has been received. Please set your password to continue:</p>
          <a href="${setPasswordUrl}" style="display:inline-block;padding:12px 24px;background:#00796B;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">
            Set Your Password
          </a>
          <p style="margin-top:16px;color:#666;">This link expires in 1 hour.</p>
        `,
      });
    }

    return successResponse(
      "Application submitted successfully. Check your email to set your password.",
      { userId: newUser.id }
    );
  } catch (error) {
    console.error("Register error:", error);
    return errorResponse("Something went wrong. Please try again.", 500);
  }
}
