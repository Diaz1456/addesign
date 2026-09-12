import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_CONTENT,
  parseSettingValue,
  type ContentValue,
} from "@/lib/content-data";

export const dynamic = "force-dynamic";

function sanitizeValue(value: unknown): ContentValue {
  if (typeof value !== "object" || value === null) return { en: "", ar: "" };
  const v = value as { en?: unknown; ar?: unknown };
  return {
    en: typeof v.en === "string" ? v.en : "",
    ar: typeof v.ar === "string" ? v.ar : "",
  };
}

export async function GET() {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await prisma.siteSetting.findMany();
  const map: Record<string, ContentValue> = {};
  for (const key of Object.keys(DEFAULT_CONTENT)) {
    const row = rows.find((r) => r.key === key);
    const value = row ? parseSettingValue(row.value) : { en: "", ar: "" };
    map[key] = {
      en: value.en || DEFAULT_CONTENT[key].en,
      ar: value.ar || DEFAULT_CONTENT[key].ar,
    };
  }
  return NextResponse.json({ settings: map });
}

export async function PUT(request: Request) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const entries = body.settings as Record<string, unknown> | undefined;
  if (!entries || typeof entries !== "object") {
    return NextResponse.json(
      { error: "Provide a `settings` map of key → { en, ar }." },
      { status: 400 }
    );
  }

  try {
    for (const [key, raw] of Object.entries(entries)) {
      if (!(key in DEFAULT_CONTENT)) continue;
      const value = sanitizeValue(raw);
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: JSON.stringify(value) },
        create: { key, value: JSON.stringify(value) },
      });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Could not save site content." },
      { status: 500 }
    );
  }
}