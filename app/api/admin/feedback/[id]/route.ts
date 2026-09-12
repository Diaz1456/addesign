import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const VALID_STATUSES = ["OPEN", "READ", "RESOLVED"];

type Params = { params: { id: string } };

export async function PATCH(request: Request, { params }: Params) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const status = String(body.status ?? "").toUpperCase();

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `Status must be one of: ${VALID_STATUSES.join(", ")}.` },
      { status: 400 }
    );
  }

  const existing = await prisma.feedback.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "Feedback not found." }, { status: 404 });
  }

  try {
    const feedback = await prisma.feedback.update({
      where: { id: params.id },
      data: { status },
    });
    return NextResponse.json({ feedback });
  } catch {
    return NextResponse.json(
      { error: "Could not update feedback." },
      { status: 500 }
    );
  }
}