import type { Metadata } from "next";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getContent } from "@/lib/content";
import { LANG_COOKIE, normalizeLang } from "@/lib/i18n";
import { StoreClient } from "@/components/store/StoreClient";

export const metadata: Metadata = {
  title: "Store",
  description:
    "Shop signature design objects: furniture, facade panels, lighting, and structural pieces by Aetheria Designs.",
};

export const dynamic = "force-dynamic";

export default async function StorePage() {
  const lang = normalizeLang(cookies().get(LANG_COOKIE)?.value);
  const content = await getContent(lang);

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
      content={content}
      categories={categories.map((c) => ({
        name: c.category,
        count: c._count._all,
      }))}
    />
  );
}