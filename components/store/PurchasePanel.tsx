"use client";

import { useState } from "react";
import { Check, Minus, Plus, Ruler, Truck } from "lucide-react";
import type { Product } from "@prisma/client";
import { useCart } from "@/components/cart/CartProvider";
import { getClientLang, t } from "@/lib/i18n";
import { formatMoneyLang } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function PurchasePanel({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const lang = getClientLang();

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-slate/5 p-4 text-sm">
        <ul className="space-y-2 text-slate/70">
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-brand-orange" />{" "}
            {t(lang, "inStock")} — {t(lang, "shipsIn")}
          </li>
          <li className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-brand-orange" />{" "}
            {t(lang, "whiteGlove")}
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-md border border-slate/20">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="p-2.5 text-slate hover:text-brand-orange"
            aria-label={t(lang, "decreaseQty")}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center font-bold">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            className="p-2.5 text-slate hover:text-brand-orange"
            aria-label={t(lang, "increaseQty")}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={() => {
            addItem(
              {
                id: product.id,
                slug: product.slug,
                name: product.name,
                nameAr: product.nameAr ?? undefined,
                price: product.price,
                image: product.imageUrls[0],
              },
              qty
            );
            setAdded(true);
            window.setTimeout(() => setAdded(false), 1400);
          }}
          className={cn(
            "flex-1",
            added
              ? "btn bg-green-600 text-white hover:bg-green-700"
              : "btn-primary"
          )}
        >
          {added ? (
            <>
              <Check className="h-4 w-4" /> {t(lang, "addedToCart")}
            </>
          ) : (
            <>
              {t(lang, "addToCart")} — {formatMoneyLang(product.price * qty, lang)}
            </>
          )}
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate/50">
        <Ruler className="h-4 w-4" /> {t(lang, "cadNote")}
      </div>
    </div>
  );
}