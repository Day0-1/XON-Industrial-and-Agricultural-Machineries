import { jsonError, jsonOk } from "@/lib/api/http";
import { parseOtp } from "@/lib/auth/otp";
import { createSession } from "@/lib/auth/session";
import { verifyOtpChallenge } from "@/integrations/mongodb/admin-otp";
import { isMongoConfigured } from "@/integrations/mongodb/client";

export async function POST(request: Request) {
  if (!isMongoConfigured()) {
    return jsonError("MONGODB_URI is not configured", 503);
  }

  try {
    const body = await request.json();
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const challengeId =
      typeof body.challengeId === "string" ? body.challengeId.trim() : "";
    const otp = parseOtp(body.otp);

    if (!username || !challengeId) {
      return jsonError("Username and verification session are required", 400);
    }

    if (!otp) {
      return jsonError("A valid 6-digit code is required", 400);
    }

    const result = await verifyOtpChallenge(challengeId, username, otp);

    switch (result) {
      case "ok":
        await createSession(username);
        return jsonOk({ ok: true });
      case "expired":
        return jsonError("Verification code expired. Go back and sign in again.", 401);
      case "too_many_attempts":
        return jsonError("Too many attempts. Go back and request a new code.", 401);
      case "invalid":
        return jsonError("Invalid verification code", 401);
      default:
        return jsonError("Verification session not found. Go back and sign in again.", 401);
    }
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("Login verify error:", err);
    }
    return jsonError("Login failed", 500);
  }
}
