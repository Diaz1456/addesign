import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const VALID_STATUSES = ["PENDING", "COMPLETED", "CANCELLED"];

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

  const existing = await prisma.order.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  try {
    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status },
    });
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Could not update the order." }, { status: 500 });
  }
}