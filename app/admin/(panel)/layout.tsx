import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  if (!user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-snow">
      <AdminSidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="min-h-screen px-6 py-8 lg:px-10">{children}</div>
      </div>
    </div>
  );
}