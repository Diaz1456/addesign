import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

const VALID_CATEGORIES = ["Interior", "Exterior", "Structural", "Decor"];
const MAX_IMAGES = 6;

export async function GET() {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));

  const name = String(body.name ?? "").trim();
  const nameAr = body.nameAr ? String(body.nameAr).trim() : null;
  const description = String(body.description ?? "").trim();
  const descriptionAr = body.descriptionAr ? String(body.descriptionAr).trim() : null;
  const price = Number(body.price);
  const category = String(body.category ?? "").trim();
  const featured = Boolean(body.featured);
  const stock = Number.isFinite(Number(body.stock)) ? Number(body.stock) : 10;
  const imageUrls = (Array.isArray(body.imageUrls) ? body.imageUrls : [])
    .filter((u: unknown): u is string => typeof u === "string")
    .slice(0, MAX_IMAGES);

  if (!name || !description) {
    return NextResponse.json(
      { error: "Name and description are required." },
      { status: 400 }
    );
  }
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
    let slug = slugify(name);
    if (!slug) slug = `product-${Date.now()}`;

    // Make the slug unique.
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

    const product = await prisma.product.create({
      data: {
        name,
        nameAr,
        slug,
        description,
        descriptionAr,
        price,
        category,
        featured,
        stock,
        imageUrls,
      },
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Could not create the product." },
      { status: 500 }
    );
  }
}