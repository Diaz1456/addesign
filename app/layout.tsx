import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { AppChrome } from "@/components/AppChrome";

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
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <AppChrome>{children}</AppChrome>
        </CartProvider>
      </body>
    </html>
  );
}