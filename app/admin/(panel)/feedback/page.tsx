import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { FeedbackTable } from "@/components/admin/FeedbackTable";

export const metadata: Metadata = { title: "Feedback" };
export const dynamic = "force-dynamic";

export default async function AdminFeedbackPage() {
  const feedback = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <p className="kicker">Inbox</p>
      <h1 className="mt-1 text-2xl font-extrabold text-slate-deep">
        Feedback Log
      </h1>
      <p className="mt-1 text-sm text-slate/50">
        Every inquiry from the public contact form, saved directly to the
        database.
      </p>
      <div className="card mt-8 overflow-hidden">
        <FeedbackTable feedback={feedback} />
      </div>
    </div>
  );
}