import { prisma } from "./prisma";

export interface DashboardStats {
  visitors: { today: number; thisMonth: number; allTime: number };
  views: { today: number; thisMonth: number; allTime: number };
  sales: {
    revenueThisMonth: number;
    ordersThisMonth: number;
    pending: number;
    completed: number;
  };
  recentOrders: Awaited<ReturnType<typeof getRecentOrders>>;
  recentFeedback: Awaited<ReturnType<typeof getRecentFeedback>>;
}

async function getRecentOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { items: { include: { product: true } } },
  });
}

async function getRecentFeedback() {
  return prisma.feedback.findMany({ orderBy: { createdAt: "desc" }, take: 6 });
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    sessionsAllTime,
    viewsAllTime,
    sessionsToday,
    viewsToday,
    sessionsThisMonth,
    viewsThisMonth,
    ordersThisMonth,
    pendingOrders,
    completedOrders,
    recentOrders,
    recentFeedback,
  ] = await Promise.all([
    prisma.analytics.groupBy({ by: ["sessionId"], _count: { _all: true } }),
    prisma.analytics.count(),
    prisma.analytics.groupBy({
      by: ["sessionId"],
      where: { timestamp: { gte: startOfToday } },
      _count: { _all: true },
    }),
    prisma.analytics.count({ where: { timestamp: { gte: startOfToday } } }),
    prisma.analytics.groupBy({
      by: ["sessionId"],
      where: { timestamp: { gte: startOfMonth } },
      _count: { _all: true },
    }),
    prisma.analytics.count({ where: { timestamp: { gte: startOfMonth } } }),
    prisma.order.aggregate({
      where: { createdAt: { gte: startOfMonth }, status: { not: "CANCELLED" } },
      _sum: { total: true },
      _count: true,
    }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "COMPLETED" } }),
    getRecentOrders(),
    getRecentFeedback(),
  ]);

  return {
    visitors: {
      today: sessionsToday.length,
      thisMonth: sessionsThisMonth.length,
      allTime: sessionsAllTime.length,
    },
    views: {
      today: viewsToday,
      thisMonth: viewsThisMonth,
      allTime: viewsAllTime,
    },
    sales: {
      revenueThisMonth: ordersThisMonth._sum.total ?? 0,
      ordersThisMonth: ordersThisMonth._count,
      pending: pendingOrders,
      completed: completedOrders,
    },
    recentOrders,
    recentFeedback,
  };
}