import { jsonError, jsonOk } from "@/lib/api/http";
import { isMongoConfigured } from "@/integrations/mongodb/client";
import { parseOtp, verifySetupOtp } from "@/lib/auth/otp";
import { hashPassword } from "@/lib/auth/password";
import {
  countAdmins,
  createAdmin,
  ensureAdminIndexes,
  findAdminByUsername,
} from "@/integrations/mongodb/admins";

export async function GET() {
  if (!isMongoConfigured()) {
    return jsonError("MONGODB_URI is not configured", 503);
  }

  try {
    const total = await countAdmins();
    return jsonOk({ needsSetup: total === 0 });
  } catch {
    return jsonError("Unable to check setup status", 500);
  }
}

export async function POST(request: Request) {
  if (!isMongoConfigured()) {
    return jsonError("MONGODB_URI is not configured", 503);
  }

  try {
    if ((await countAdmins()) > 0) {
      return jsonError("Admin account already exists", 403);
    }

    const body = await request.json();
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const otp = parseOtp(body.otp);

    if (!username || password.length < 8) {
      return jsonError("Username and password (min 8 characters) are required", 400);
    }

    if (!otp) {
      return jsonError("A valid 6-digit OTP is required", 400);
    }

    if (!verifySetupOtp(otp)) {
      return jsonError("Invalid OTP", 401);
    }

    if (await findAdminByUsername(username)) {
      return jsonError("Username already exists", 409);
    }

    await ensureAdminIndexes();
    const admin = await createAdmin({
      username,
      passwordHash: await hashPassword(password),
    });

    return jsonOk({ admin }, 201);
  } catch {
    return jsonError("Failed to create admin account", 500);
  }
}
