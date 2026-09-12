import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  OPEN: "bg-amber-100 text-amber-700",
  READ: "bg-blue-100 text-blue-700",
  RESOLVED: "bg-green-100 text-green-700",
  PENDING: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-600",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide",
        STYLES[status] || "bg-slate/10 text-slate/60"
      )}
    >
      {status}
    </span>
  );
}