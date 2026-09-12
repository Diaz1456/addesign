"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChartColumnBig,
  ClipboardList,
  Globe,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Package,
  Settings,
} from "lucide-react";
import type { User } from "@prisma/client";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/content", label: "Site Content", icon: Globe },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/feedback", label: "Feedback", icon: MessageSquareText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => ({}));
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="sticky top-0 flex h-screen w-16 shrink-0 flex-col border-r border-slate/10 bg-slate-darker md:w-64">
      <Link href="/admin/dashboard" className="flex items-center gap-2.5 px-4 py-6 md:px-6">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/5 text-brand-orange">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M3 21h18" />
            <path d="M5 21V7l7-4 7 4v14" />
            <path d="M9 21v-6h6v6" />
          </svg>
        </span>
        <span className="hidden text-sm font-extrabold tracking-tight text-white md:block">
          Aetheria<span className="text-brand-orange">.</span>
          <span className="ml-1.5 rounded bg-brand-orange/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-brand-orange">
            Admin
          </span>
        </span>
      </Link>

      <nav className="mt-2 flex-1 space-y-1 px-2 md:px-3">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin/products"
              ? pathname.startsWith("/admin/products")
              : pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-orange text-white"
                  : "text-snow/60 hover:bg-white/5 hover:text-white"
              )}
              title={label}
            >
              <Icon className="h-4.5 w-4.5 h-5 w-5 shrink-0" />
              <span className="hidden md:block">{label}</span>
              {href === "/admin/feedback" && (
                <span className="ml-auto hidden rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold md:block">
                  Log
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="mb-2 hidden items-center gap-3 rounded-md px-2 py-2 md:flex">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-orange text-xs font-bold text-white">
            {user.name.charAt(0).toUpperCase() || "A"}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {user.name}
            </p>
            <p className="truncate text-xs text-snow/40">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-snow/60 transition hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          <span className="hidden md:block">Sign out</span>
        </button>
      </div>
    </aside>
  );
}