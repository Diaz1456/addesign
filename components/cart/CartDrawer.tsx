"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { getClientLang, t } from "@/lib/i18n";
import { pName } from "@/lib/product";
import { formatMoneyLang } from "@/lib/utils";

export function CartDrawer() {
  const { items, subtotal, isOpen, closeCart, removeItem, setQuantity } =
    useCart();
  const lang = getClientLang();
  const isRTL = lang === "ar";
  const x = isRTL ? "-100%" : "100%";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-slate-darker/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x }}
            animate={{ x: 0 }}
            exit={{ x }}
            transition={{ type: "tween", duration: 0.3 }}
            className={`fixed top-0 z-50 flex h-full w-full max-w-md flex-col bg-snow shadow-2xl ${
              isRTL ? "left-0" : "right-0"
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate/10 px-6 py-5">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-brand-orange" />
                <h2 className="text-lg font-bold text-slate-deep">
                  {t(lang, "cartTitle")}
                </h2>
                <span className="rounded-full bg-slate-deep px-2 py-0.5 text-xs font-bold text-white">
                  {items.length}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="rounded-md p-2 text-slate/60 transition hover:bg-slate/10 hover:text-slate"
                aria-label={t(lang, "closeCart")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingCart className="mb-4 h-12 w-12 text-slate/20" />
                  <p className="font-semibold text-slate">
                    {t(lang, "cartEmpty")}
                  </p>
                  <p className="mt-1 text-sm text-slate/50">
                    {t(lang, "cartEmptyBody")}
                  </p>
                  <Link
                    href="/store"
                    onClick={closeCart}
                    className="btn-primary mt-6"
                  >
                    {t(lang, "exploreStore")}
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-slate/10">
                  {items.map((item) => {
                    const name = pName(item, lang);
                    return (
                      <li key={item.id} className="flex gap-4 py-4">
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image}
                            alt={name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/product/${item.slug}`}
                              onClick={closeCart}
                              className="text-sm font-semibold text-slate-deep hover:text-brand-orange"
                            >
                              {name}
                            </Link>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-slate/40 transition hover:text-red-500"
                              aria-label={`${t(lang, "removeItem")} ${name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="mt-0.5 text-sm font-bold text-brand-orange">
                            {formatMoneyLang(item.price, lang)}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              onClick={() => setQuantity(item.id, item.quantity - 1)}
                              className="rounded border border-slate/15 p-1 text-slate hover:border-brand-orange hover:text-brand-orange"
                              aria-label={t(lang, "decreaseQty")}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => setQuantity(item.id, item.quantity + 1)}
                              className="rounded border border-slate/15 p-1 text-slate hover:border-brand-orange hover:text-brand-orange"
                              aria-label={t(lang, "increaseQty")}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-slate/10 bg-white px-6 py-5">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-slate/60">{t(lang, "subtotal")}</span>
                  <span className="font-semibold text-slate-deep">
                    {formatMoneyLang(subtotal, lang)}
                  </span>
                </div>
                <p className="mb-4 text-xs text-slate/40">
                  {t(lang, "shippingNote")}
                </p>
                <div className="flex gap-3">
                  <Link href="/checkout" onClick={closeCart} className="btn-primary flex-1">
                    {t(lang, "checkout")}
                  </Link>
                  <Link href="/store" onClick={closeCart} className="btn-dark flex-1">
                    {t(lang, "continueShopping")}
                  </Link>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}