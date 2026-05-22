import { jsonError, jsonOk } from "@/lib/api/http";
import { isMongoConfigured } from "@/integrations/mongodb/client";
import { parseOtp, verifyLoginOtp } from "@/lib/auth/otp";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { findAdminByUsername } from "@/integrations/mongodb/admins";

export async function POST(request: Request) {
  if (!isMongoConfigured()) {
    return jsonError("MONGODB_URI is not configured", 503);
  }

  try {
    const body = await request.json();
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const otp = parseOtp(body.otp);

    if (!username || !password) {
      return jsonError("Username and password are required", 400);
    }

    if (!otp) {
      return jsonError("A valid 6-digit OTP is required", 400);
    }

    if (!verifyLoginOtp(otp)) {
      return jsonError("Invalid OTP", 401);
    }

    const admin = await findAdminByUsername(username);
    if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
      return jsonError("Invalid credentials", 401);
    }

    await createSession(admin.username);
    return jsonOk({ ok: true });
  } catch {
    return jsonError("Login failed", 500);
  }
}
