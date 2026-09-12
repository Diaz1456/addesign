import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronRight, Layers, Package } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { ProductGallery } from "@/components/store/ProductGallery";
import { PurchasePanel } from "@/components/store/PurchasePanel";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });
  return {
    title: product?.name || "Product",
    description: product?.description?.slice(0, 160),
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { category: product.category, id: { not: product.id } },
    take: 3,
  });

  return (
    <>
      <div className="bg-white">
        <div className="container-x py-14 lg:py-20">
          <nav className="mb-8 flex items-center gap-1.5 text-sm text-slate/50">
            <Link href="/" className="hover:text-brand-orange">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/store" className="hover:text-brand-orange">Store</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-slate-deep">{product.name}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2">
            <ProductGallery images={product.imageUrls} alt={product.name} />

            <div className="flex flex-col">
              <span className="kicker">{product.category}</span>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-deep sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-4 text-3xl font-extrabold text-brand-orange">
                {formatMoney(product.price)}
              </p>
              <p className="mt-6 leading-relaxed text-slate/70">
                {product.description}
              </p>

              <div className="mt-8 border-t border-slate/10 pt-8">
                <PurchasePanel product={product} />
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-lg border border-slate/10 p-4">
                  <Package className="mb-2 h-5 w-5 text-brand-orange" />
                  <p className="font-bold text-slate-deep">Detail engineered</p>
                  <p className="mt-1 text-slate/60">
                    Materials specified and tested in our studio.
                  </p>
                </div>
                <div className="rounded-lg border border-slate/10 p-4">
                  <Layers className="mb-2 h-5 w-5 text-brand-orange" />
                  <p className="font-bold text-slate-deep">
                    {product.stock} in stock
                  </p>
                  <p className="mt-1 text-slate/60">
                    Ready for dispatch after fabrication.
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
            You may also like
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