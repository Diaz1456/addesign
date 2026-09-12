"use client";

import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { formatMoney } from "@/lib/utils";

export default function CartPage() {
  const { items, subtotal, removeItem, setQuantity } = useCart();
  const shipping = subtotal === 0 ? 0 : subtotal >= 500 ? 0 : 29;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container-x flex flex-col items-center py-32 text-center">
        <ShoppingCart className="mb-5 h-14 w-14 text-slate/20" />
        <h1 className="text-3xl font-extrabold text-slate-deep">
          Your cart is empty
        </h1>
        <p className="mt-2 max-w-sm text-slate/60">
          Objects from the studio await. Start with a best seller.
        </p>
        <Link href="/store" className="btn-primary mt-8">
          Browse the Store <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x py-14 lg:py-20">
      <p className="kicker">Cart</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-deep">
        Your Selection
      </h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="card overflow-hidden">
          <ul className="divide-y divide-slate/10">
            {items.map((item) => (
              <li key={item.id} className="flex gap-5 p-5">
                <Link
                  href={`/product/${item.slug}`}
                  className="h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-slate/10"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/product/${item.slug}`}
                        className="font-bold text-slate-deep hover:text-brand-orange"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-0.5 text-sm font-bold text-brand-orange">
                        {formatMoney(item.price)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="rounded-md p-1.5 text-slate/40 transition hover:bg-red-50 hover:text-red-500"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(item.id, item.quantity - 1)}
                      className="rounded border border-slate/15 p-1.5 text-slate hover:border-brand-orange hover:text-brand-orange"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(item.id, item.quantity + 1)}
                      className="rounded border border-slate/15 p-1.5 text-slate hover:border-brand-orange hover:text-brand-orange"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <span className="ml-auto font-bold text-slate-deep">
                      {formatMoney(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="card h-fit p-6">
          <h2 className="text-lg font-bold text-slate-deep">Order Summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate/60">Subtotal</dt>
              <dd className="font-semibold">{formatMoney(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate/60">Shipping</dt>
              <dd className="font-semibold">
                {shipping === 0 ? "Free" : formatMoney(shipping)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-slate/10 pt-3 text-base">
              <dt className="font-bold text-slate-deep">Total</dt>
              <dd className="font-extrabold text-brand-orange">
                {formatMoney(total)}
              </dd>
            </div>
          </dl>
          <Link href="/checkout" className="btn-primary mt-6 w-full">
            Proceed to Checkout <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/store"
            className="mt-3 block text-center text-sm font-semibold text-slate/60 hover:text-brand-orange"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}