"use client";

import { Languages } from "lucide-react";
import { getClientLang, setLangCookie, t, LANGS } from "@/lib/i18n";

export function LanguageSwitcher() {
  const current = getClientLang();
  const target = LANGS.find((l) => l !== current) ?? "en";

  return (
    <button
      onClick={() => {
        setLangCookie(target);
        window.location.reload();
      }}
      className="flex items-center gap-1.5 rounded-md px-2 py-2 text-sm font-semibold text-slate transition hover:text-brand-orange"
      aria-label={t(current, "switchLang")}
      title={t(current, "switchLang")}
    >
      <Languages className="h-4 w-4" />
      <span>{target === "ar" ? "عربي" : "EN"}</span>
    </button>
  );
}