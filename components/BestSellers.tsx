"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpLeft, MoveLeft, MoveRight } from "lucide-react";
import { useRef, useState } from "react";
import type { Product } from "@prisma/client";
import { ProductCard } from "./ProductCard";

export function BestSellers({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: true });

  const updateScrollState = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScroll({
      left: el.scrollLeft > 8,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 8,
    });
  };

  const scroll = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
  };

  return (
    <section className="border-y border-slate/10 bg-white py-20 lg:py-28">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker">The Collection</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-deep sm:text-4xl">
              Best Sellers
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden gap-2 sm:flex">
              <button
                onClick={() => scroll("left")}
                disabled={!canScroll.left}
                className="rounded-md border border-slate/20 p-2 text-slate disabled:opacity-30"
                aria-label="Scroll left"
              >
                <MoveLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScroll.right}
                className="rounded-md border border-slate/20 p-2 text-slate disabled:opacity-30"
                aria-label="Scroll right"
              >
                <MoveRight className="h-4 w-4" />
              </button>
            </div>
            <Link
              href="/store"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange"
            >
              Shop all
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={updateScrollState}
        className="container-x mt-10 flex snap-x gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="w-[280px] shrink-0 snap-start sm:w-[300px]"
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}