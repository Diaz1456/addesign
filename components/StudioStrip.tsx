import { Layers, Ruler, ShieldCheck, Sparkles } from "lucide-react";

const FEATURES = [
  {
    icon: Layers,
    title: "Interior & Exterior",
    body: "One practice, two disciplines. Facades, structure, interiors and objects designed in the same room.",
  },
  {
    icon: Ruler,
    title: "Engineered Precision",
    body: "Every curve and joint is stress-tested. Beauty that passes inspection and lasts decades.",
  },
  {
    icon: Sparkles,
    title: "Curated Objects",
    body: "Our store pieces are prototypes of our own projects — buy the same products we specify on site.",
  },
  {
    icon: ShieldCheck,
    title: "Client Led",
    body: "Inquiries become sessions, sessions become drawings, drawings become delivered projects.",
  },
];

export function StudioStrip() {
  return (
    <section className="bg-snow py-16 lg:py-20">
      <div className="container-x">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-bold text-slate-deep">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate/60">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}