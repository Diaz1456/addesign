import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { StoreClient } from "@/components/store/StoreClient";

export const metadata: Metadata = {
  title: "Store",
  description:
    "Shop signature design objects: furniture, facade panels, lighting, and structural pieces by Aetheria Designs.",
};

export const dynamic = "force-dynamic";

export default async function StorePage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.product.groupBy({
      by: ["category"],
      _count: { _all: true },
    }),
  ]);

  return (
    <StoreClient
      products={products}
      categories={categories.map((c) => ({
        name: c.category,
        count: c._count._all,
      }))}
    />
  );
}