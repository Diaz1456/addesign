import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));

  const current = String(body.currentPassword ?? "");
  const next = String(body.newPassword ?? "");
  const confirm = String(body.confirmPassword ?? "");

  if (!current || !next) {
    return NextResponse.json(
      { error: "Current and new password are required." },
      { status: 400 }
    );
  }
  if (next.length < 8) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters." },
      { status: 400 }
    );
  }
  if (next !== confirm) {
    return NextResponse.json(
      { error: "New password and confirmation do not match." },
      { status: 400 }
    );
  }

  const valid = await bcrypt.compare(current, user.passwordHash);
  if (!valid) {
    return NextResponse.json(
      { error: "Current password is incorrect." },
      { status: 400 }
    );
  }

  try {
    const passwordHash = await bcrypt.hash(next, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Could not update your password." },
      { status: 500 }
    );
  }
}