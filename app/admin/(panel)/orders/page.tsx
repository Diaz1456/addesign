import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { OrdersTable } from "@/components/admin/OrdersTable";

export const metadata: Metadata = { title: "Orders" };
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: { select: { name: true } } } },
    },
  });

  return (
    <div>
      <p className="kicker">Commerce</p>
      <h1 className="mt-1 text-2xl font-extrabold text-slate-deep">Orders</h1>
      <p className="mt-1 text-sm text-slate/50">
        {orders.length} {orders.length === 1 ? "order" : "orders"} received
        through checkout.
      </p>
      <div className="card mt-8 overflow-hidden">
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
}