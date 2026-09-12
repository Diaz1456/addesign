"use client";

import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { getClientLang, t } from "@/lib/i18n";
import { pName } from "@/lib/product";
import { formatMoneyLang } from "@/lib/utils";

export default function CartPage() {
  const { items, subtotal, removeItem, setQuantity } = useCart();
  const lang = getClientLang();
  const shipping = subtotal === 0 ? 0 : subtotal >= 500 ? 0 : 29;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container-x flex flex-col items-center py-32 text-center">
        <ShoppingCart className="mb-5 h-14 w-14 text-slate/20" />
        <h1 className="text-3xl font-extrabold text-slate-deep">
          {t(lang, "cartEmptyPage")}
        </h1>
        <p className="mt-2 max-w-sm text-slate/60">
          {t(lang, "cartEmptyPageBody")}
        </p>
        <Link href="/store" className="btn-primary mt-8">
          {t(lang, "browseStore")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x py-14 lg:py-20">
      <p className="kicker">{t(lang, "cartKicker")}</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-deep">
        {t(lang, "cartTitlePage")}
      </h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="card overflow-hidden">
          <ul className="divide-y divide-slate/10">
            {items.map((item) => {
              const name = pName(item, lang);
              return (
                <li key={item.id} className="flex gap-5 p-5">
                  <Link
                    href={`/product/${item.slug}`}
                    className="h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-slate/10"
                  >
                    <img
                      src={item.image}
                      alt={name}
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
                          {name}
                        </Link>
                        <p className="mt-0.5 text-sm font-bold text-brand-orange">
                          {formatMoneyLang(item.price, lang)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="rounded-md p-1.5 text-slate/40 transition hover:bg-red-50 hover:text-red-500"
                        aria-label={`${t(lang, "removeItem")} ${name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuantity(item.id, item.quantity - 1)}
                        className="rounded border border-slate/15 p-1.5 text-slate hover:border-brand-orange hover:text-brand-orange"
                        aria-label={t(lang, "decreaseQty")}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                        className="rounded border border-slate/15 p-1.5 text-slate hover:border-brand-orange hover:text-brand-orange"
                        aria-label={t(lang, "increaseQty")}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <span className="ms-auto font-bold text-slate-deep">
                        {formatMoneyLang(item.price * item.quantity, lang)}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <aside className="card h-fit p-6">
          <h2 className="text-lg font-bold text-slate-deep">
            {t(lang, "orderSummary")}
          </h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate/60">{t(lang, "subtotal")}</dt>
              <dd className="font-semibold">{formatMoneyLang(subtotal, lang)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate/60">{t(lang, "shipping")}</dt>
              <dd className="font-semibold">
                {shipping === 0 ? t(lang, "free") : formatMoneyLang(shipping, lang)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-slate/10 pt-3 text-base">
              <dt className="font-bold text-slate-deep">{t(lang, "total")}</dt>
              <dd className="font-extrabold text-brand-orange">
                {formatMoneyLang(total, lang)}
              </dd>
            </div>
          </dl>
          <Link href="/checkout" className="btn-primary mt-6 w-full">
            {t(lang, "proceedCheckout")}{" "}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
          <Link
            href="/store"
            className="mt-3 block text-center text-sm font-semibold text-slate/60 hover:text-brand-orange"
          >
            {t(lang, "continueShopping")}
          </Link>
        </aside>
      </div>
    </div>
  );
}