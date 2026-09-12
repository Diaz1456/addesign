import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import type { User } from "@prisma/client";

const SESSION_COOKIE = "aetheria_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 12; // 12 hours

const encoder = new TextEncoder();
const secret = () => encoder.encode(process.env.AUTH_SECRET || "dev-secret");

export interface SessionPayload {
  userId: string;
  email: string;
}

export async function createSession(user: User) {
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret());

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  cookies().set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getSessionUser(): Promise<User | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret());
    const userId = payload.userId as string;
    if (!userId) return null;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const user = await getSessionUser();
  return user;
}

export { SESSION_COOKIE, SESSION_MAX_AGE };