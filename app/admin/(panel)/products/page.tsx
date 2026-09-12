import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductsTable } from "@/components/admin/ProductsTable";

export const metadata: Metadata = { title: "Products" };
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker">Catalog</p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-deep">
            Products
          </h1>
          <p className="mt-1 text-sm text-slate/50">
            {products.length} {products.length === 1 ? "object" : "objects"} in
            the store.
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Add New Product
        </Link>
      </div>

      <div className="card mt-8 overflow-hidden">
        <ProductsTable products={products} />
      </div>
    </div>
  );
}