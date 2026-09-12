"use client";

import Link from "next/link";
import type { Product } from "@prisma/client";
import { getClientLang, catLabel } from "@/lib/i18n";
import { pName } from "@/lib/product";
import { formatMoneyLang } from "@/lib/utils";
import { AddToCartButton } from "./AddToCartButton";

export function ProductCard({ product }: { product: Product }) {
  const image = product.imageUrls[0];
  const lang = getClientLang();
  const name = pName(product, lang);

  return (
    <div className="group card relative overflow-hidden transition-shadow hover:shadow-lg">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="aspect-square overflow-hidden bg-slate/10">
          {image ? (
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate/20">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
            </div>
          )}
        </div>
      </Link>
      <span className="absolute left-4 top-4 rounded-full bg-slate-darker/80 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur">
        {catLabel(lang, product.category)}
      </span>

      <div className="p-5">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-bold text-slate-deep transition-colors group-hover:text-brand-orange">
            {name}
          </h3>
        </Link>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-extrabold text-slate-deep">
            {formatMoneyLang(product.price, lang)}
          </span>
          <AddToCartButton product={product} iconOnly display="icon" />
        </div>
      </div>
    </div>
  );
}