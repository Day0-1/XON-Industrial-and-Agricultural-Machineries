import { createHash, randomBytes, randomInt, timingSafeEqual } from "crypto";
import { getDb, isMongoConfigured } from "./client";

const COLLECTION = "admin_otp_challenges";
const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

type OtpChallengeDocument = {
  challengeId: string;
  username: string;
  otpHash: string;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
};

export type OtpChallenge = {
  challengeId: string;
  username: string;
  expiresAt: Date;
};

function hashOtp(otp: string): string {
  const secret = process.env.AUTH_SECRET?.trim() ?? "xon-otp";
  return createHash("sha256").update(`${secret}:${otp}`).digest("hex");
}

export function generateOtpCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export function createChallengeId(): string {
  return randomBytes(24).toString("hex");
}

async function collection() {
  const db = await getDb();
  return db.collection<OtpChallengeDocument>(COLLECTION);
}

export async function createOtpChallenge(username: string, otp: string): Promise<OtpChallenge> {
  const challengeId = createChallengeId();
  const now = new Date();
  const doc: OtpChallengeDocument = {
    challengeId,
    username: username.trim().toLowerCase(),
    otpHash: hashOtp(otp),
    expiresAt: new Date(now.getTime() + OTP_TTL_MS),
    attempts: 0,
    createdAt: now,
  };

  const col = await collection();
  await col.deleteMany({ username: doc.username });
  await col.insertOne(doc);

  return {
    challengeId,
    username: doc.username,
    expiresAt: doc.expiresAt,
  };
}

export async function verifyOtpChallenge(
  challengeId: string,
  username: string,
  otp: string,
): Promise<"ok" | "invalid" | "expired" | "too_many_attempts" | "not_found"> {
  const col = await collection();
  const doc = await col.findOne({ challengeId });

  if (!doc) return "not_found";
  if (doc.username !== username.trim().toLowerCase()) return "not_found";
  if (doc.expiresAt.getTime() < Date.now()) {
    await col.deleteOne({ challengeId });
    return "expired";
  }
  if (doc.attempts >= MAX_ATTEMPTS) {
    await col.deleteOne({ challengeId });
    return "too_many_attempts";
  }

  const providedHash = hashOtp(otp);
  const a = Buffer.from(providedHash);
  const b = Buffer.from(doc.otpHash);
  const match = a.length === b.length && timingSafeEqual(a, b);

  if (!match) {
    await col.updateOne({ challengeId }, { $inc: { attempts: 1 } });
    return "invalid";
  }

  await col.deleteOne({ challengeId });
  return "ok";
}

export async function ensureAdminOtpIndexes(): Promise<void> {
  if (!isMongoConfigured()) return;
  const col = await collection();
  await col.createIndex({ challengeId: 1 }, { unique: true });
  await col.createIndex({ username: 1 });
  await col.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
}
