"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import type { Product } from "@prisma/client";
import { formatMoney } from "@/lib/utils";

export function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function toggleFeatured(product: Product) {
    setBusyId(product.id);
    try {
      await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !product.featured }),
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function deleteProduct(product: Product) {
    if (
      !window.confirm(
        `Delete "${product.name}"? This cannot be undone. Orders referencing it are preserved.`
      )
    ) {
      return;
    }
    setBusyId(product.id);
    try {
      await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  if (products.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="font-semibold text-slate">No products yet</p>
        <p className="mt-1 text-sm text-slate/50">
          Add your first design object to stock the storefront.
        </p>
        <Link href="/admin/products/new" className="btn-primary mt-6">
          Add New Product
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate/10 bg-slate/5 text-left text-xs uppercase tracking-wider text-slate/50">
            <th className="px-5 py-3 font-semibold">Product</th>
            <th className="px-5 py-3 font-semibold">Category</th>
            <th className="px-5 py-3 font-semibold">Price</th>
            <th className="px-5 py-3 font-semibold">Stock</th>
            <th className="px-5 py-3 font-semibold">Featured</th>
            <th className="px-5 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate/10">
          {products.map((product) => (
            <tr
              key={product.id}
              className={`transition ${busyId === product.id ? "opacity-50" : "hover:bg-slate/5"}`}
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-md bg-slate/10">
                    {product.imageUrls[0] ? (
                      <img
                        src={product.imageUrls[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-slate/30">
                        —
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/product/${product.slug}`}
                      target="_blank"
                      className="truncate font-semibold text-slate-deep hover:text-brand-orange"
                    >
                      {product.name}
                    </Link>
                    <p className="truncate text-xs text-slate/50">
                      /{product.slug}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4">
                <span className="rounded-full bg-slate/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-slate/60">
                  {product.category}
                </span>
              </td>
              <td className="px-5 py-4 font-semibold text-slate-deep">
                {formatMoney(product.price)}
              </td>
              <td className="px-5 py-4 text-slate/60">{product.stock} left</td>
              <td className="px-5 py-4">
                <button
                  onClick={() => toggleFeatured(product)}
                  disabled={busyId === product.id}
                  className={`rounded-md p-1.5 transition ${
                    product.featured
                      ? "text-amber-500 hover:bg-amber-50"
                      : "text-slate/25 hover:bg-slate/10 hover:text-slate/50"
                  }`}
                  title={product.featured ? "Unfeature" : "Feature on homepage"}
                  aria-label={product.featured ? "Remove from featured" : "Feature product"}
                >
                  <Star className="h-4 w-4" fill={product.featured ? "currentColor" : "none"} />
                </button>
              </td>
              <td className="px-5 py-4">
                <div className="flex justify-end gap-1">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="rounded-md p-2 text-slate/50 transition hover:bg-slate/10 hover:text-brand-orange"
                    aria-label={`Edit ${product.name}`}
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => deleteProduct(product)}
                    disabled={busyId === product.id}
                    className="rounded-md p-2 text-slate/50 transition hover:bg-red-50 hover:text-red-500"
                    aria-label={`Delete ${product.name}`}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}