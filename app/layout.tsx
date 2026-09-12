import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Suspense } from "react";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { AppChrome } from "@/components/AppChrome";
import { SiteFooter } from "@/components/SiteFooter";
import { LANG_COOKIE, normalizeLang } from "@/lib/i18n";

export const metadata: Metadata = {
  title: {
    default: "Aetheria Designs — Engineering & Interior Design",
    template: "%s · Aetheria Designs",
  },
  description:
    "Aetheria Designs is a full-service engineering and design firm crafting exterior architecture, interiors, and signature designer products.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = normalizeLang(cookies().get(LANG_COOKIE)?.value);
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <html lang={lang} dir={dir}>
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <AppChrome footer={<Suspense fallback={null}><SiteFooter /></Suspense>}>
            {children}
          </AppChrome>
        </CartProvider>
      </body>
    </html>
  );
}