"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Save } from "lucide-react";
import { CONTENT_FIELDS } from "@/lib/content-data";

type Settings = Record<string, { en: string; ar: string }>;

interface Status {
  type: "idle" | "saving" | "saved" | "error";
  message?: string;
}

export function SiteContentForm() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [status, setStatus] = useState<Status>({ type: "idle" });

  useEffect(() => {
    let active = true;
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((data) => {
        if (active) setSettings(data.settings ?? {});
      })
      .catch(() => {
        if (active) setStatus({ type: "error", message: "Failed to load content." });
      });
    return () => {
      active = false;
    };
  }, []);

  function set(key: string, lang: "en" | "ar", value: string) {
    setSettings((prev) =>
      prev
        ? { ...prev, [key]: { en: prev[key]?.en ?? "", ar: prev[key]?.ar ?? "", [lang]: value } }
        : prev
    );
  }

  async function handleSave() {
    if (!settings) return;
    setStatus({ type: "saving" });
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (!res.ok) throw new Error();
      setStatus({ type: "saved" });
      window.setTimeout(() => setStatus({ type: "idle" }), 2500);
    } catch {
      setStatus({ type: "error", message: "Could not save content." });
    }
  }

  if (!settings) {
    return (
      <div className="py-16 text-center text-slate/50">
        <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
        Loading content…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {CONTENT_FIELDS.map((group) => (
        <section key={group.group} className="card p-6">
          <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-slate-deep">
            {group.group}
          </h2>
          <div className="grid gap-5">
            {group.fields.map((field) => {
              const value = settings[field.key] ?? { en: "", ar: "" };
              const inputProps = (
                lang: "en" | "ar"
              ) => ({
                value: value[lang] ?? "",
                onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                  set(field.key, lang, e.target.value),
                className: "input",
              });
              return (
                <div key={field.key} className="grid gap-2 md:grid-cols-2">
                  <div>
                    <label className="label">
                      <span className="normal-case text-slate-deep">{field.label}</span>
                      <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-slate/40">
                        EN
                      </span>
                    </label>
                    {field.type === "long" ? (
                      <textarea rows={3} {...inputProps("en")} />
                    ) : (
                      <input {...inputProps("en")} />
                    )}
                  </div>
                  <div>
                    <label className="label">
                      <span className="normal-case text-slate-deep">{field.label}</span>
                      <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-brand-orange">
                        AR
                      </span>
                    </label>
                    {field.type === "long" ? (
                      <textarea rows={3} dir="rtl" lang="ar" {...inputProps("ar")} />
                    ) : (
                      <input dir="rtl" lang="ar" {...inputProps("ar")} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <div className="sticky bottom-4 flex items-center justify-end gap-3 rounded-xl border border-slate/10 bg-white/95 p-4 shadow-lg backdrop-blur">
        {status.type === "error" && (
          <p className="text-sm font-medium text-red-600">{status.message}</p>
        )}
        {status.type === "saved" && (
          <p className="flex items-center gap-1.5 text-sm font-medium text-green-600">
            <CheckCircle2 className="h-4 w-4" /> Saved — reload the website to see changes.
          </p>
        )}
        <button
          onClick={handleSave}
          disabled={status.type === "saving"}
          className="btn-primary"
        >
          {status.type === "saving" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving…
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Save content
            </>
          )}
        </button>
      </div>
    </div>
  );
}