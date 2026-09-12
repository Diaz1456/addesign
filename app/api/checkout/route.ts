import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface CheckoutItem {
  productId: string;
  quantity: number;
  price: number;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  const items = Array.isArray(body.items) ? (body.items as CheckoutItem[]) : [];
  const customer = (body.customer ?? {}) as Record<string, unknown>;

  const name = String(customer.name ?? "").trim();
  const email = String(customer.email ?? "").trim();
  const address = String(customer.address ?? "").trim();
  const city = String(customer.city ?? "").trim();
  const country = String(customer.country ?? "").trim();

  if (items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }
  if (!name || !email || !address || !city || !country) {
    return NextResponse.json(
      { error: "Please fill in your contact and delivery details." },
      { status: 400 }
    );
  }

  const totals = {
    subtotal: Number(body.innerSubtotal) || 0,
    shipping: Number(body.shipping) || 0,
    tax: Number(body.tax) || 0,
    total: Number(body.total) || 0,
  };

  if (totals.subtotal <= 0 || totals.total <= 0) {
    return NextResponse.json(
      { error: "Invalid order total." },
      { status: 400 }
    );
  }

  try {
    // Validate that every product exists and the client price matches the
    // database price (server-side price authority).
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: "A product in your cart is no longer available." },
          { status: 400 }
        );
      }
      if (product.price !== item.price) {
        return NextResponse.json(
          { error: "A price changed while you were shopping." },
          { status: 409 }
        );
      }
    }

    const order = await prisma.order.create({
      data: {
        customerName: name,
        customerEmail: email,
        customerPhone: String(customer.phone ?? "") || null,
        address,
        city,
        country,
        postalCode: String(customer.postalCode ?? "") || null,
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        tax: totals.tax,
        total: totals.total,
        status: "PENDING",
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ ok: true, order }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Could not place your order. Please try again." },
      { status: 500 }
    );
  }
}