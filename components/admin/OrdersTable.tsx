"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, ShieldCheck } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { formatMoney } from "@/lib/utils";

type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  address: string;
  city: string;
  country: string;
  status: string;
  total: number;
  createdAt: string | Date;
  items: { productId: string; product: { name: string }; quantity: number }[];
};

const STATUSES = ["PENDING", "COMPLETED", "CANCELLED"] as const;

export function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function setStatus(orderId: string, status: (typeof STATUSES)[number]) {
    setBusyId(orderId);
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  if (orders.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <KeyRound className="mx-auto mb-4 h-10 w-10 text-slate/20" />
        <p className="font-semibold text-slate">No orders yet</p>
        <p className="mt-1 text-sm text-slate/50">
          Checkout orders will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate/10 bg-slate/5 text-left text-xs uppercase tracking-wider text-slate/50">
            <th className="px-5 py-3 font-semibold">Order</th>
            <th className="px-5 py-3 font-semibold">Customer</th>
            <th className="px-5 py-3 font-semibold">Items</th>
            <th className="px-5 py-3 font-semibold">Total</th>
            <th className="px-5 py-3 font-semibold">Status</th>
            <th className="px-5 py-3 text-right font-semibold">Mark</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate/10">
          {orders.map((order) => {
            const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
            const isExpanded = expanded === order.id;
            return (
              <FragmentRow
                key={order.id}
                order={order}
                itemCount={itemCount}
                isExpanded={isExpanded}
                busy={busyId === order.id}
                onToggle={() => setExpanded(isExpanded ? null : order.id)}
                onStatus={(status) => setStatus(order.id, status)}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function FragmentRow({
  order,
  itemCount,
  isExpanded,
  busy,
  onToggle,
  onStatus,
}: {
  order: Order;
  itemCount: number;
  isExpanded: boolean;
  busy: boolean;
  onToggle: () => void;
  onStatus: (status: (typeof STATUSES)[number]) => void;
}) {
  return (
    <Fragment>
      <tr
        className={`cursor-pointer transition ${busy ? "opacity-50" : "hover:bg-slate/5"}`}
        onClick={onToggle}
      >
        <td className="px-5 py-4">
          <p className="font-mono text-xs font-semibold text-slate-deep">
            #{order.id.slice(0, 8)}
          </p>
          <p className="mt-0.5 text-[11px] text-slate/50">
            {new Date(order.createdAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </td>
        <td className="px-5 py-4">
          <p className="font-semibold text-slate-deep">{order.customerName}</p>
          <p className="text-xs text-slate/50">{order.customerEmail}</p>
        </td>
        <td className="px-5 py-4">
          <span className="rounded-full bg-slate/10 px-2.5 py-1 text-xs font-semibold text-slate/70">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </td>
        <td className="px-5 py-4 font-extrabold text-slate-deep">
          {formatMoney(order.total)}
        </td>
        <td className="px-5 py-4">
          <StatusBadge status={order.status} />
        </td>
        <td className="px-5 py-4">
          <div className="flex justify-end gap-1">
            {STATUSES.filter((s) => s !== order.status).map((status) => (
              <button
                key={status}
                onClick={(e) => {
                  e.stopPropagation();
                  onStatus(status);
                }}
                disabled={busy}
                className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition disabled:opacity-40 ${
                  status === "COMPLETED"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : status === "CANCELLED"
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                }`}
              >
                {status === "COMPLETED" ? "Complete" : status === "CANCELLED" ? "Cancel" : "Pending"}
              </button>
            ))}
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-slate/5">
          <td colSpan={6} className="px-5 py-5">
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate/50">
                  Items
                </h4>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {order.items.map((i) => (
                    <li key={i.productId} className="text-slate/70">
                      {i.product.name} × {i.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate/50">
                  Delivery
                </h4>
                <p className="mt-2 text-sm text-slate/70">
                  {order.address}, {order.city}, {order.country}
                </p>
                {order.customerPhone && (
                  <p className="mt-1 text-sm text-slate/70">
                    Tel: {order.customerPhone}
                  </p>
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate/50">
                  Commerce
                </h4>
                <p className="mt-2 flex items-center gap-2 text-sm text-slate/70">
                  <ShieldCheck className="h-4 w-4 text-brand-orange" />
                  Payment simulated — Stripe-ready
                </p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </Fragment>
  );
}