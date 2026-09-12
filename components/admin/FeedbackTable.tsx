"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Inbox } from "lucide-react";
import type { Feedback } from "@prisma/client";
import { StatusBadge } from "./StatusBadge";
import { formatDateTime } from "@/lib/utils";

const STATUSES = ["OPEN", "READ", "RESOLVED"] as const;

export function FeedbackTable({ feedback }: { feedback: Feedback[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function setStatus(item: Feedback, status: (typeof STATUSES)[number]) {
    setBusyId(item.id);
    try {
      await fetch(`/api/admin/feedback/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  if (feedback.length === 0) {
    return (
      <div className="flex flex-col items-center px-6 py-16 text-center">
        <Inbox className="mb-4 h-10 w-10 text-slate/20" />
        <p className="font-semibold text-slate">No messages yet</p>
        <p className="mt-1 text-sm text-slate/50">
          Contact form submissions will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate/10 bg-slate/5 text-left text-xs uppercase tracking-wider text-slate/50">
            <th className="px-5 py-3 font-semibold">From</th>
            <th className="px-5 py-3 font-semibold">Message</th>
            <th className="px-5 py-3 font-semibold">Received</th>
            <th className="px-5 py-3 font-semibold">Status</th>
            <th className="px-5 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate/10">
          {feedback.map((item) => (
            <tr
              key={item.id}
              className={`transition ${busyId === item.id ? "opacity-50" : "hover:bg-slate/5"}`}
            >
              <td className="px-5 py-4 align-top">
                <p className="font-semibold text-slate-deep">
                  {item.name}
                  {item.status === "OPEN" && (
                    <span className="ml-2 inline-block h-2 w-2 rounded-full bg-brand-orange align-middle" />
                  )}
                </p>
                <a
                  href={`mailto:${item.email}`}
                  className="text-xs text-brand-orange hover:underline"
                >
                  {item.email}
                </a>
              </td>
              <td className="max-w-md px-5 py-4 align-top">
                <p className="text-xs font-bold uppercase tracking-wide text-slate/40">
                  {item.subject || "General inquiry"}
                </p>
                <p className="mt-1 whitespace-pre-line leading-relaxed text-slate/70">
                  {item.message}
                </p>
              </td>
              <td className="px-5 py-4 align-top text-xs text-slate/50">
                {formatDateTime(item.createdAt)}
              </td>
              <td className="px-5 py-4 align-top">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-5 py-4 align-top">
                <div className="flex flex-wrap justify-end gap-1">
                  {STATUSES.map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatus(item, status)}
                      disabled={busyId === item.id || item.status === status}
                      className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition disabled:opacity-40 ${
                        item.status === status
                          ? "bg-slate-deep text-white"
                          : "bg-slate/10 text-slate/60 hover:bg-slate/20"
                      }`}
                    >
                      {status === "OPEN" ? "Open" : status === "READ" ? "Mark Read" : "Resolve"}
                    </button>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}