import { Layers, Ruler, ShieldCheck, Sparkles } from "lucide-react";

const ICONS = [Layers, Ruler, Sparkles, ShieldCheck];

export function StudioStrip({ content }: { content: Record<string, string> }) {
  const features = [
    { title: content.studioF1Title, body: content.studioF1Body },
    { title: content.studioF2Title, body: content.studioF2Body },
    { title: content.studioF3Title, body: content.studioF3Body },
    { title: content.studioF4Title, body: content.studioF4Body },
  ];

  return (
    <section className="bg-snow py-16 lg:py-20">
      <div className="container-x">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => {
            const Icon = ICONS[i];
            return (
              <div key={feature.title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-deep">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate/60">
                    {feature.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}