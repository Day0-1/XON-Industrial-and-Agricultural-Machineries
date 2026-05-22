import { timingSafeEqual } from "crypto";

const OTP_PATTERN = /^\d{6}$/;

export function isValidOtp(otp: string): boolean {
  return OTP_PATTERN.test(otp.trim());
}

export function parseOtp(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const otp = value.trim();
  return isValidOtp(otp) ? otp : null;
}

function safeOtpEqual(provided: string, expected: string): boolean {
  const a = Buffer.from(provided.trim());
  const b = Buffer.from(expected.trim());
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function verifySetupOtp(otp: string): boolean {
  const expected = process.env.ADMIN_SETUP_OTP?.trim();
  if (!expected || !isValidOtp(expected)) return false;
  return safeOtpEqual(otp, expected);
}

export function verifyLoginOtp(otp: string): boolean {
  const expected =
    process.env.ADMIN_LOGIN_OTP?.trim() ??
    process.env.ADMIN_SETUP_OTP?.trim();
  if (!expected || !isValidOtp(expected)) return false;
  return safeOtpEqual(otp, expected);
}
