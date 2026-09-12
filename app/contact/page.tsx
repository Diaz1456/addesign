import { cookies } from "next/headers";
import { getContent } from "@/lib/content";
import { LANG_COOKIE, normalizeLang } from "@/lib/i18n";
import { ContactClient } from "@/components/ContactClient";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const lang = normalizeLang(cookies().get(LANG_COOKIE)?.value);
  const content = await getContent(lang);

  return <ContactClient content={content} />;
}