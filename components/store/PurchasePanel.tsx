"use client";

import { useState } from "react";
import { Check, Minus, Plus, Ruler, Truck } from "lucide-react";
import type { Product } from "@prisma/client";
import { useCart } from "@/components/cart/CartProvider";
import { formatMoney } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function PurchasePanel({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-slate/5 p-4 text-sm">
        <ul className="space-y-2 text-slate/70">
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-brand-orange" /> In stock — ships in 3–5
            working days
          </li>
          <li className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-brand-orange" /> White-glove delivery on
            orders over $1,000
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-md border border-slate/20">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="p-2.5 text-slate hover:text-brand-orange"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center font-bold">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            className="p-2.5 text-slate hover:text-brand-orange"
            aria-label="Increase quantity"
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
              <Check className="h-4 w-4" /> Added to Cart
            </>
          ) : (
            <>
              Add {qty > 1 ? `${qty} ` : ""}to Cart —{" "}
              {formatMoney(product.price * qty)}
            </>
          )}
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate/50">
        <Ruler className="h-4 w-4" /> CAD files available on request
      </div>
    </div>
  );
}