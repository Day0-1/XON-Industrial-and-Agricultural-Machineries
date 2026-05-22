import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";
import { isMongoConfigured } from "@/integrations/mongodb/client";

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function requireMongo() {
  if (!isMongoConfigured()) {
    return jsonError("MONGODB_URI is not configured", 503);
  }
  return null;
}

export async function requireAdmin() {
  const mongo = requireMongo();
  if (mongo) return mongo;

  const ok = await isAuthenticated();
  if (!ok) {
    return jsonError("Unauthorized", 401);
  }
  return null;
}
