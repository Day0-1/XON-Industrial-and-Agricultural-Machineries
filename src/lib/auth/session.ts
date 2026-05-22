import { cookies } from "next/headers";
import {
  getSessionCookieName,
  signSessionToken,
  verifySessionToken,
} from "./token";

export async function createSession(username: string): Promise<void> {
  const token = await signSessionToken(username);
  const cookieStore = await cookies();
  cookieStore.set(getSessionCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(getSessionCookieName());
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

export { verifySessionToken } from "./token";
