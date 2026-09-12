"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getClientLang, t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const lang = getClientLang();
  const list = images.length > 0 ? images : [""];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-xl bg-slate/10">
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={list[active]}
            alt={`${alt} — ${t(lang, "viewImage")} ${active + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="h-full w-full object-cover"
          />
        </AnimatePresence>
        <span className="absolute end-4 top-4 rounded-full bg-slate-darker/70 px-3 py-1 text-xs font-bold text-white backdrop-blur">
          {active + 1} / {list.length}
        </span>
      </div>

      {list.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {list.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition",
                active === i
                  ? "border-brand-orange"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
              aria-label={`${t(lang, "viewImage")} ${i + 1}`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}