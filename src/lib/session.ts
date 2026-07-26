import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "ai_jewellery_admin_session";
const alg = "HS256";

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function createAdminSession(username: string) {
  const token = await new SignJWT({ username, role: "admin" })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as { username: string; role: string };
  } catch {
    return null;
  }
}

export { SESSION_COOKIE };
