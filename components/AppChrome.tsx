"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./SiteHeader";
import { CartDrawer } from "./cart/CartDrawer";
import { AnalyticsTracker } from "./AnalyticsTracker";

export function AppChrome({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <main className="min-h-screen bg-white">{children}</main>;
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      {footer}
      <CartDrawer />
      <AnalyticsTracker />
    </>
  );
}