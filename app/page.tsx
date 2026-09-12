import { ArrowDown } from "lucide-react";
import { cookies } from "next/headers";
import { Hero } from "@/components/Hero";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { BestSellers } from "@/components/BestSellers";
import { StudioStrip } from "@/components/StudioStrip";
import { getContent } from "@/lib/content";
import { LANG_COOKIE, normalizeLang, t } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const lang = normalizeLang(cookies().get(LANG_COOKIE)?.value);
  const content = await getContent(lang);

  const featured = await prisma.product.findMany({
    where: { featured: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const bestSellers = await prisma.product.findMany({
    take: 8,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <>
      <Hero content={content} />
      <StudioStrip content={content} />
      <FeaturedProjects content={content} />

      {bestSellers.length > 0 && (
        <BestSellers products={bestSellers} content={content} />
      )}

      {featured.length === 0 && bestSellers.length === 0 && (
        <section className="container-x py-24 text-center">
          <p className="kicker">{t(lang, "homeEmptyKicker")}</p>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-deep">
            {t(lang, "homeEmptyTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-slate/60">
            {t(lang, "homeEmptyBody")}{" "}
            <code className="rounded bg-slate/5 px-1.5 py-0.5 font-mono text-sm text-brand-orange">
              npm run db:seed
            </code>{" "}
            .
          </p>
          <p className="mt-10 flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-slate/40">
            <ArrowDown className="h-4 w-4" /> {t(lang, "scrollToExplore")}
          </p>
        </section>
      )}
    </>
  );
}