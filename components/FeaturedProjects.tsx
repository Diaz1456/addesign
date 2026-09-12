"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Project {
  title: string;
  tag: string;
  image: string;
  scope: string;
}

const PROJECTS: Project[] = [
  {
    title: "Helios Terraces",
    tag: "Exterior Architecture",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    scope: "Structural · Facade · Landscape",
  },
  {
    title: "The Quiet House",
    tag: "Interior Design",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    scope: "Interior · Lighting · Styling",
  },
  {
    title: "Concrete Grove",
    tag: "Mixed-Use Campus",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1200&auto=format&fit=crop",
    scope: "Structural · Public Realm",
  },
  {
    title: "Slate Loft",
    tag: "Interior Design",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop",
    scope: "Interior · Furniture · Decor",
  },
];

export function FeaturedProjects({ content }: { content: Record<string, string> }) {
  return (
    <section id="projects" className="py-20 lg:py-28">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker">{content.projectsKicker}</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-deep sm:text-4xl">
              {content.projectsTitle}
            </h2>
          </div>
          <Link
            href="/store"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange"
          >
            {content.projectsCta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROJECTS.map((project, i) => (
            <article
              key={project.title}
              className="group relative overflow-hidden rounded-xl bg-slate-deep"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-darker/90 via-slate-darker/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">
                  {project.tag}
                </p>
                <h3 className="mt-1 text-xl font-bold text-white">
                  {project.title}
                </h3>
                <p className="mt-1 text-xs text-snow/60">{project.scope}</p>
              </div>
              <span className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                {String(i + 1).padStart(2, "0")}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}