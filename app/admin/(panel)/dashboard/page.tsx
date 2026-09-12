import type { Metadata } from "next";
import {
  ArrowUpRight,
  CircleDollarSign,
  Clock3,
  Eye,
  MessagesSquare,
  PackageCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { getDashboardStats } from "@/lib/stats";
import { formatDateTime, formatMoney } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    {
      label: "Visitors today",
      value: stats.visitors.today,
      sub: `${stats.visitors.thisMonth} this month · ${stats.visitors.allTime} all-time`,
      icon: Users,
      tone: "bg-brand-orange/10 text-brand-orange",
    },
    {
      label: "Page views today",
      value: stats.views.today,
      sub: `${stats.views.thisMonth} this month · ${stats.views.allTime} all-time`,
      icon: Eye,
      tone: "bg-slate-deep/10 text-slate-deep",
    },
    {
      label: "Revenue this month",
      value: formatMoney(stats.sales.revenueThisMonth),
      sub: `${stats.sales.ordersThisMonth} orders placed`,
      icon: CircleDollarSign,
      tone: "bg-green-100 text-green-700",
    },
    {
      label: "Orders",
      value: stats.sales.pending + stats.sales.completed,
      sub: `${stats.sales.pending} pending · ${stats.sales.completed} completed`,
      icon: PackageCheck,
      tone: "bg-amber-100 text-amber-700",
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker">Overview</p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-deep">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate/50">
            A live snapshot of visitors, sales, and client activity.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate/50">
          <TrendingUp className="h-4 w-4 text-brand-orange" />
          Refreshes on every page load
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, sub, icon: Icon, tone }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate/50">
                {label}
              </p>
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}>
                <Icon className="h-4.5 w-4.5 h-5 w-5" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-slate-deep">{value}</p>
            <p className="mt-1 text-xs text-slate/50">{sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <div className="card overflow-hidden lg:col-span-3">
          <div className="flex items-center justify-between border-b border-slate/10 px-5 py-4">
            <h2 className="flex items-center gap-2 font-bold text-slate-deep">
              <Clock3 className="h-4 w-4 text-brand-orange" /> Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-orange hover:underline"
            >
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-slate/50">
              No orders yet. They appear here as customers check out.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate/10 text-left text-xs uppercase tracking-wider text-slate/50">
                  <th className="px-5 py-3 font-semibold">Order</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate/10">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate/5">
                    <td className="px-5 py-3 font-mono text-xs text-slate/60">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-deep">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-slate/50">
                        {formatDateTime(order.createdAt)}
                      </p>
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-deep">
                      {formatMoney(order.total)}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate/10 px-5 py-4">
            <h2 className="flex items-center gap-2 font-bold text-slate-deep">
              <MessagesSquare className="h-4 w-4 text-brand-orange" />
              Latest Feedback
            </h2>
            <Link
              href="/admin/feedback"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-orange hover:underline"
            >
              Open log <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {stats.recentFeedback.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-slate/50">
              No messages yet. Contact form submissions appear here.
            </p>
          ) : (
            <ul className="divide-y divide-slate/10">
              {stats.recentFeedback.map((f) => (
                <li key={f.id} className="px-5 py-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-slate-deep">{f.name}</p>
                    <StatusBadge status={f.status} />
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-sm text-slate/60">
                    {f.message}
                  </p>
                  <p className="mt-1 text-xs text-slate/40">
                    {f.email} · {formatDateTime(f.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}