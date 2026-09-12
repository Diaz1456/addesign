"use client";

import { useState } from "react";
import { Check, Plus, ShoppingBag } from "lucide-react";
import type { Product } from "@prisma/client";
import { useCart } from "@/components/cart/CartProvider";
import { cn } from "@/lib/utils";

interface Props {
  product: Product;
  display?: "icon" | "full";
  iconOnly?: boolean;
  className?: string;
}

export function AddToCartButton({
  product,
  className,
  display = "full",
}: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const image =
    product.imageUrls[0] ||
    "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=600&auto=format&fit=crop";

  const handleClick = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  if (display === "icon") {
    return (
      <button
        onClick={handleClick}
        aria-label={`Add ${product.name} to cart`}
        className={cn(
          "rounded-md p-2.5 text-white shadow-sm transition hover:bg-brand-ember",
          added ? "bg-green-600" : "bg-brand-orange",
          className
        )}
      >
        {added ? (
          <Check className="h-4 w-4" />
        ) : (
          <ShoppingBag className="h-4 w-4" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "btn",
        added ? "bg-green-600 text-white hover:bg-green-700" : "btn-primary",
        className
      )}
    >
      {added ? (
        <>
          <Check className="h-4 w-4" /> Added to Cart
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" /> Add to Cart
        </>
      )}
    </button>
  );
}