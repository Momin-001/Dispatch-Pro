import jwt from "jsonwebtoken";
import crypto from "crypto";
import { JWT_SECRET } from "@/lib/constants";

const ACCESS_TOKEN_EXPIRY = "1h";

export function signAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
