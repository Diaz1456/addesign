import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

const VALID_CATEGORIES = ["Interior", "Exterior", "Structural", "Decor"];
const MAX_IMAGES = 6;

type Params = { params: { id: string } };

export async function PUT(request: Request, { params }: Params) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));

  const id = params.id;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const name = String(body.name ?? existing.name).trim() || existing.name;
  const description =
    String(body.description ?? existing.description).trim() || existing.description;
  const price = body.price !== undefined ? Number(body.price) : existing.price;
  const category = String(body.category ?? existing.category).trim() || existing.category;
  const featured =
    body.featured !== undefined ? Boolean(body.featured) : existing.featured;
  const stock = body.stock !== undefined ? Number(body.stock) : existing.stock;
  const imageUrls = Array.isArray(body.imageUrls)
    ? body.imageUrls
        .filter((u: unknown): u is string => typeof u === "string")
        .slice(0, MAX_IMAGES)
    : existing.imageUrls;

  if (!Number.isFinite(price) || price < 0) {
    return NextResponse.json(
      { error: "Please provide a valid price." },
      { status: 400 }
    );
  }
  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json(
      { error: `Category must be one of: ${VALID_CATEGORIES.join(", ")}.` },
      { status: 400 }
    );
  }

  try {
    let slug = existing.slug;
    if (body.name !== undefined && name !== existing.name) {
      slug = slugify(name) || existing.slug;
      const clash = await prisma.product.findFirst({
        where: { slug, id: { not: id } },
      });
      if (clash) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
    }

    const product = await prisma.product.update({
      where: { id },
      data: { name, slug, description, price, category, featured, stock, imageUrls },
    });
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json(
      { error: "Could not update the product." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Could not delete the product." },
      { status: 500 }
    );
  }
}