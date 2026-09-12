import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId } from "@/lib/session-id";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const pageUrl =
      typeof body.pageUrl === "string" && body.pageUrl.startsWith("/")
        ? body.pageUrl.slice(0, 500)
        : "/";
    const sessionId = getOrCreateSessionId();

    await prisma.analytics.create({ data: { pageUrl, sessionId } });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}