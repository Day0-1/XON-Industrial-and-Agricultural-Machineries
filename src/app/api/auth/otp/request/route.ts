import { jsonError, jsonOk } from "@/lib/api/http";
import { sendAdminOtpEmail } from "@/lib/emailjs/send-admin-otp";
import { isOtpEmailConfigured } from "@/lib/emailjs/server-config";
import { verifyPassword } from "@/lib/auth/password";
import { findAdminByUsername } from "@/integrations/mongodb/admins";
import {
  createOtpChallenge,
  ensureAdminOtpIndexes,
  generateOtpCode,
} from "@/integrations/mongodb/admin-otp";
import { isMongoConfigured } from "@/integrations/mongodb/client";

export async function POST(request: Request) {
  if (!isMongoConfigured()) {
    return jsonError("MONGODB_URI is not configured", 503);
  }

  if (!isOtpEmailConfigured()) {
    return jsonError(
      "OTP email is not configured. Set ADMIN_OTP_EMAIL and EMAILJS_OTP_TEMPLATE_ID in .env.",
      503,
    );
  }

  try {
    const body = await request.json();
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!username || !password) {
      return jsonError("Username and password are required", 400);
    }

    const admin = await findAdminByUsername(username);
    if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
      return jsonError("Invalid credentials", 401);
    }

    await ensureAdminOtpIndexes();

    const otp = generateOtpCode();
    const challenge = await createOtpChallenge(admin.username, otp);

    try {
      await sendAdminOtpEmail(otp);
    } catch (emailErr) {
      if (process.env.NODE_ENV === "development") {
        console.error("OTP email error:", emailErr);
      }
      return jsonError(
        "Could not send verification code. Check EmailJS configuration.",
        503,
      );
    }

    return jsonOk({
      challengeId: challenge.challengeId,
      expiresAt: challenge.expiresAt.toISOString(),
    });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("OTP request error:", err);
    }
    return jsonError("Could not start sign-in", 500);
  }
}
