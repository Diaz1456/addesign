import type { Metadata } from "next";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const user = await requireAdmin();
  if (!user) redirect("/admin/login");

  return (
    <div className="max-w-2xl">
      <p className="kicker">Settings</p>
      <h1 className="mt-1 text-2xl font-extrabold text-slate-deep">Settings</h1>
      <p className="mt-1 text-sm text-slate/50">
        Manage your studio account.
      </p>

      <div className="card mt-8 p-6">
        <h2 className="font-bold text-slate-deep">Account</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between border-b border-slate/10 pb-3">
            <dt className="text-slate/50">Name</dt>
            <dd className="font-semibold text-slate-deep">{user.name}</dd>
          </div>
          <div className="flex justify-between border-b border-slate/10 pb-3">
            <dt className="text-slate/50">Email</dt>
            <dd className="font-semibold text-slate-deep">{user.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate/50">Role</dt>
            <dd className="font-semibold text-slate-deep">{user.role}</dd>
          </div>
        </dl>
      </div>

      <div className="card mt-6 p-6">
        <ChangePasswordForm />
      </div>
    </div>
  );
}