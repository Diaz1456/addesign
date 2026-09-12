import type { Lang } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_CONTENT,
  parseSettingValue,
  type ContentValue,
} from "@/lib/content-data";

export type { ContentValue };

/** Resolve localized site content, falling back to defaults for missing keys. */
export async function getContent(lang: Lang): Promise<Record<string, string>> {
  let rows: { key: string; value: string }[] = [];
  try {
    rows = await prisma.siteSetting.findMany();
  } catch {
    rows = [];
  }

  const map: Record<string, string> = {};
  for (const key of Object.keys(DEFAULT_CONTENT)) {
    const row = rows.find((r) => r.key === key);
    const value: ContentValue = row
      ? { ...DEFAULT_CONTENT[key], ...parseSettingValue(row.value) }
      : DEFAULT_CONTENT[key];
    map[key] = value[lang] || DEFAULT_CONTENT[key][lang] || "";
  }
  return map;
}