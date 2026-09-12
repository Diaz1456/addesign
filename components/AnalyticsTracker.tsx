"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Records a page view in the Analytics table whenever the route changes.
 * The session id cookie is created by the /api/visits handler so that views
 * can be grouped into unique visitors.
 */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    // ignore the very first load when we haven't even rendered a path yet
    if (!pathname || pathname === lastTracked.current) return;
    lastTracked.current = pathname;

    if (pathname.startsWith("/admin")) return;

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 4000);

    fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageUrl: pathname }),
      signal: controller.signal,
      keepalive: true,
    }).catch(() => {
      /* analytics are best-effort */
    });

    return () => window.clearTimeout(timeout);
  }, [pathname]);

  return null;
}