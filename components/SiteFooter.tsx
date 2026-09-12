import Link from "next/link";
import { Instagram, Linkedin, Mail, MapPin, Twitter } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-slate-darker text-snow/70">
      <div className="container-x py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white/5 text-brand-orange">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M3 21h18" />
                  <path d="M5 21V7l7-4 7 4v14" />
                  <path d="M9 21v-6h6v6" />
                </svg>
              </span>
              <span className="text-lg font-extrabold tracking-tight text-white">
                Aetheria<span className="text-brand-orange">.</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              A full-service engineering and design firm. We shape exterior
              architecture, choreograph interiors, and manufacture the pieces
              that make spaces feel intent.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="rounded-md bg-white/5 p-2 transition hover:bg-brand-orange hover:text-white"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/store" className="transition hover:text-white">Store</Link></li>
              <li><Link href="/#projects" className="transition hover:text-white">Projects</Link></li>
              <li><Link href="/contact" className="transition hover:text-white">Contact</Link></li>
              <li><Link href="/admin/login" className="transition hover:text-white">Admin</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white">
              Studio
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
                Level 4, Helios Works,
                <br />
                Copenhagen, Denmark
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-brand-orange" />
                hello@aetheria.design
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-snow/40 md:flex-row">
          <p>© {new Date().getFullYear()} Aetheria Designs. All rights reserved.</p>
          <p>Engineered with intent · Built on light.</p>
        </div>
      </div>
    </footer>
  );
}