"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, Search, SlidersHorizontal } from "lucide-react";
import type { Product } from "@prisma/client";
import { ProductCard } from "@/components/ProductCard";
import { cn } from "@/lib/utils";

interface Category {
  name: string;
  count: number;
}

interface StoreClientProps {
  products: Product[];
  categories: Category[];
}

const ALL = "All";

export function StoreClient({ products, categories }: StoreClientProps) {
  const [active, setActive] = useState<string>(ALL);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"newest" | "price-asc" | "price-desc">(
    "newest"
  );

  const filtered = useMemo(() => {
    let list = products.filter(
      (p) =>
        (active === ALL || p.category === active) &&
        p.name.toLowerCase().includes(query.toLowerCase())
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, active, query, sort]);

  return (
    <section className="py-14 lg:py-20">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="kicker">Shop</p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-deep">
              The Store
            </h1>
            <p className="mt-3 max-w-lg text-slate/60">
              Design objects engineered in our studio and specified in our own
              projects.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate/40" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search objects…"
                className="input w-56 pl-9"
                aria-label="Search products"
              />
            </div>
            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate/40" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="input w-44 appearance-none pl-9"
                aria-label="Sort products"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price · Low to High</option>
                <option value="price-desc">Price · High to Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-2 border-y border-slate/10 py-4">
          <button
            onClick={() => setActive(ALL)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              active === ALL
                ? "bg-slate-deep text-white"
                : "bg-slate/5 text-slate/70 hover:bg-slate/10"
            )}
          >
            All ({products.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => setActive(c.name)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                active === c.name
                  ? "bg-brand-orange text-white"
                  : "bg-slate/5 text-slate/70 hover:bg-slate/10"
              )}
            >
              {c.name} ({c.count})
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-slate/50">
          <LayoutGrid className="h-4 w-4" />
          {filtered.length} {filtered.length === 1 ? "product" : "products"}
        </div>

        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-semibold text-slate">No products match.</p>
            <p className="mt-1 text-sm text-slate/50">
              Try another category or search term.
            </p>
          </div>
        ) : (
          <motion.div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}