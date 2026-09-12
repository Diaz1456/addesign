"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { getClientLang, t } from "@/lib/i18n";
import { pName } from "@/lib/product";
import { formatMoneyLang } from "@/lib/utils";

const SHIPPING_RATE = 29;

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<string | null>(null);
  const lang = getClientLang();

  const shipping = subtotal === 0 || subtotal >= 500 ? 0 : SHIPPING_RATE;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + shipping + tax;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ id, quantity, price }) => ({
            productId: id,
            quantity,
            price,
          })),
          customer: {
            name: form.get("name"),
            email: form.get("email"),
            phone: form.get("phone"),
            address: form.get("address"),
            city: form.get("city"),
            postalCode: form.get("postalCode"),
            country: form.get("country"),
          },
          innerSubtotal: subtotal,
          shipping,
          tax,
          total,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || t(lang, "orderPlacedError"));
        return;
      }

      clearCart();
      setPlaced(data.order.id as string);
    } catch {
      setError(t(lang, "orderPlacedError"));
    } finally {
      setLoading(false);
    }
  }

  if (placed) {
    return (
      <div className="container-x flex flex-col items-center py-28 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold text-slate-deep">
          {t(lang, "orderConfirmed")}
        </h1>
        <p className="mt-3 max-w-md text-slate/60">
          {t(lang, "orderConfirmedBody")}{" "}
          <span className="font-mono font-bold text-slate-deep">#{placed.slice(0, 8)}</span>
        </p>
        <Link href="/store" className="btn-primary mt-8">
          {t(lang, "continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x py-14 lg:py-20">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate/60 hover:text-brand-orange"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t(lang, "backToCart")}
      </Link>
      <p className="kicker mt-6">{t(lang, "checkoutKicker")}</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-deep">
        {t(lang, "placeOrderTitle")}
      </h1>
      <p className="mt-2 flex items-center gap-2 text-sm text-slate/50">
        <ShieldCheck className="h-4 w-4 text-brand-orange" /> {t(lang, "secureNote")}
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit} className="card max-w-2xl p-6 lg:p-8">
          <h2 className="text-lg font-bold text-slate-deep">{t(lang, "contact")}</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="name">{t(lang, "fullName")}</label>
              <input id="name" name="name" required className="input" placeholder="Alexis Morgan" />
            </div>
            <div>
              <label className="label" htmlFor="email">{t(lang, "email")}</label>
              <input id="email" name="email" type="email" required className="input" placeholder="alexis@example.com" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="phone">{t(lang, "phone")}</label>
              <input id="phone" name="phone" className="input" placeholder="+1 555 010 3000" />
            </div>
          </div>

          <h2 className="mt-8 text-lg font-bold text-slate-deep">{t(lang, "delivery")}</h2>
          <div className="mt-5 grid gap-5">
            <div>
              <label className="label" htmlFor="address">{t(lang, "street")}</label>
              <input id="address" name="address" required className="input" placeholder="12 Harvester Lane" />
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label className="label" htmlFor="city">{t(lang, "city")}</label>
                <input id="city" name="city" required className="input" placeholder="Copenhagen" />
              </div>
              <div>
                <label className="label" htmlFor="postalCode">{t(lang, "postal")}</label>
                <input id="postalCode" name="postalCode" className="input" placeholder="1058" />
              </div>
              <div>
                <label className="label" htmlFor="country">{t(lang, "country")}</label>
                <input id="country" name="country" required className="input" placeholder="Denmark" />
              </div>
            </div>
          </div>

          <h2 className="mt-8 text-lg font-bold text-slate-deep">{t(lang, "payment")}</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="card">{t(lang, "cardNumber")}</label>
              <input id="card" name="card" inputMode="numeric" placeholder="4242 4242 4242 4242" className="input" />
            </div>
            <div>
              <label className="label" htmlFor="expiry">{t(lang, "expiry")}</label>
              <input id="expiry" name="expiry" placeholder="MM/YY" className="input" />
            </div>
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs text-slate/50">
            <CreditCard className="h-4 w-4" /> {t(lang, "stripeNote")}
          </p>

          {error && (
            <p className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || items.length === 0}
            className="btn-primary mt-8 w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> {t(lang, "processing")}
              </>
            ) : (
              <>{t(lang, "pay")} {formatMoneyLang(total, lang)}</>
            )}
          </button>
        </form>

        <aside className="card h-fit p-6">
          <h2 className="text-lg font-bold text-slate-deep">{t(lang, "summary")}</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate text-slate/70">
                  {pName(item, lang)} × {item.quantity}
                </span>
                <span className="shrink-0 font-semibold">
                  {formatMoneyLang(item.price * item.quantity, lang)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-3 border-t border-slate/10 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate/60">{t(lang, "subtotal")}</dt>
              <dd className="font-semibold">{formatMoneyLang(subtotal, lang)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate/60">{t(lang, "shipping")}</dt>
              <dd className="font-semibold">{shipping === 0 ? t(lang, "free") : formatMoneyLang(shipping, lang)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate/60">{t(lang, "tax")}</dt>
              <dd className="font-semibold">{formatMoneyLang(tax, lang)}</dd>
            </div>
            <div className="flex justify-between border-t border-slate/10 pt-3 text-base">
              <dt className="font-bold text-slate-deep">{t(lang, "total")}</dt>
              <dd className="font-extrabold text-brand-orange">{formatMoneyLang(total, lang)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}