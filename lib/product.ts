import type { Lang } from "@/lib/i18n";

export interface Localizable {
  name: string;
  nameAr?: string | null;
  description: string;
  descriptionAr?: string | null;
}

export function pName(p: Pick<Localizable, "name" | "nameAr">, lang: Lang): string {
  return lang === "ar" && p.nameAr ? p.nameAr : p.name;
}

export function pDescription(
  p: Pick<Localizable, "description" | "descriptionAr">,
  lang: Lang
): string {
  return lang === "ar" && p.descriptionAr ? p.descriptionAr : p.description;
}