import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Edit Product" };
export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export default async function EditProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) notFound();

  return (
    <div>
      <p className="kicker">Catalog</p>
      <h1 className="mt-1 text-2xl font-extrabold text-slate-deep">
        Edit Product
      </h1>
      <p className="mt-1 text-sm text-slate/50">
        Update {product.name} — changes publish instantly.
      </p>
      <div className="mt-8">
        <ProductForm product={product} />
      </div>
    </div>
  );
}