import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ChevronRight, Layers, Package } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LANG_COOKIE, normalizeLang, t, catLabel } from "@/lib/i18n";
import { pName, pDescription } from "@/lib/product";
import { formatMoneyLang } from "@/lib/utils";
import { ProductGallery } from "@/components/store/ProductGallery";
import { PurchasePanel } from "@/components/store/PurchasePanel";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = normalizeLang(cookies().get(LANG_COOKIE)?.value);
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });
  if (!product) return { title: "Product" };
  return {
    title: pName(product, lang),
    description: pDescription(product, lang).slice(0, 160),
  };
}

export default async function ProductPage({ params }: Props) {
  const lang = normalizeLang(cookies().get(LANG_COOKIE)?.value);
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { category: product.category, id: { not: product.id } },
    take: 3,
  });

  const name = pName(product, lang);

  return (
    <>
      <div className="bg-white">
        <div className="container-x py-14 lg:py-20">
          <nav className="mb-8 flex items-center gap-1.5 text-sm text-slate/50">
            <Link href="/" className="hover:text-brand-orange">{t(lang, "home")}</Link>
            <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
            <Link href="/store" className="hover:text-brand-orange">{t(lang, "storeLink")}</Link>
            <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
            <span className="font-medium text-slate-deep">{name}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2">
            <ProductGallery images={product.imageUrls} alt={name} />

            <div className="flex flex-col">
              <span className="kicker">{catLabel(lang, product.category)}</span>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-deep sm:text-4xl">
                {name}
              </h1>
              <p className="mt-4 text-3xl font-extrabold text-brand-orange">
                {formatMoneyLang(product.price, lang)}
              </p>
              <p className="mt-6 leading-relaxed text-slate/70">
                {pDescription(product, lang)}
              </p>

              <div className="mt-8 border-t border-slate/10 pt-8">
                <PurchasePanel product={product} />
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-lg border border-slate/10 p-4">
                  <Package className="mb-2 h-5 w-5 text-brand-orange" />
                  <p className="font-bold text-slate-deep">
                    {t(lang, "detailEngineered")}
                  </p>
                  <p className="mt-1 text-slate/60">
                    {t(lang, "detailEngineeredBody")}
                  </p>
                </div>
                <div className="rounded-lg border border-slate/10 p-4">
                  <Layers className="mb-2 h-5 w-5 text-brand-orange" />
                  <p className="font-bold text-slate-deep">
                    {product.stock} {t(lang, "inStock")}
                  </p>
                  <p className="mt-1 text-slate/60">
                    {t(lang, "readyDispatch")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="container-x py-16">
          <h2 className="text-2xl font-extrabold text-slate-deep">
            {t(lang, "related")}
          </h2>
          <RelatedStrip products={related} />
        </div>
      )}
    </>
  );
}

type RelatedProducts = Awaited<ReturnType<typeof prisma.product.findMany>>;

function RelatedStrip({ products }: { products: RelatedProducts }) {
  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}