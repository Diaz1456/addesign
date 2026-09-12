"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function Hero({ content }: { content: Record<string, string> }) {
  return (
    <section className="relative overflow-hidden bg-slate-deep text-snow">
      <div className="absolute inset-0 opacity-25 [background:radial-gradient(circle_at_70%_20%,rgba(217,108,44,0.55),transparent_45%),radial-gradient(circle_at_20%_80%,rgba(217,108,44,0.25),transparent_40%)]" />
      <div className="container-x relative grid gap-10 py-20 md:grid-cols-2 md:py-28 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="kicker">{content.heroKicker}</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {content.heroTitlePre}{" "}
            <span className="text-brand-orange">{content.heroAccent}</span>{" "}
            {content.heroTitleAfter}
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-snow/70">
            {content.heroBody}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/store" className="btn-primary">
              {content.heroCtaPrimary} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/#projects" className="btn-outline border-snow/25 text-snow hover:border-brand-orange hover:text-brand-orange">
              {content.heroCtaSecondary}
            </Link>
          </div>
          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {[
              ["14+", content.statYears],
              ["240", content.statProjects],
              ["32", content.statAwards],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="text-3xl font-extrabold text-white">{value}</dd>
                <dd className="mt-1 text-xs uppercase tracking-wider text-snow/50">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative min-h-[340px] md:min-h-full"
        >
          <div className="absolute inset-0 grid grid-cols-2 gap-3">
            <div className="overflow-hidden rounded-xl">
              <img
                src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1200&auto=format&fit=crop"
                alt={content.heroKicker}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-10 flex flex-col gap-3">
              <div className="overflow-hidden rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop"
                  alt={content.heroBadgeTitle}
                  className="h-1/2 w-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&auto=format&fit=crop"
                  alt={content.heroBadgeSub}
                  className="h-1/2 w-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="absolute -bottom-4 left-1/2 w-40 -translate-x-1/2 rounded-lg bg-brand-orange px-4 py-3 text-center shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-white">
              {content.heroBadgeTitle}
            </p>
            <p className="text-[10px] text-white/80">{content.heroBadgeSub}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}