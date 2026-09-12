import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const COOKIE_NAME = "aetheria_visitor";

/**
 * Returns (idempotent) a stable visitor session id for the current request.
 * Created once per unique browser and reused afterwards so that page views
 * can be grouped into unique sessions.
 */
export function getOrCreateSessionId(): string {
  const store = cookies();
  const existing = store.get(COOKIE_NAME)?.value;
  if (existing) return existing;

  const id = randomUUID();
  store.set(COOKIE_NAME, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return id;
}