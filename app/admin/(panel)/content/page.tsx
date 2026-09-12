import type { Metadata } from "next";
import Link from "next/link";
import { SiteContentForm } from "@/components/admin/SiteContentForm";

export const metadata: Metadata = { title: "Site Content" };
export const dynamic = "force-dynamic";

export default function AdminContentPage() {
  return (
    <div>
      <div>
        <p className="kicker">Website</p>
        <h1 className="mt-1 text-2xl font-extrabold text-slate-deep">
          Site Content
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate/50">
          Edit the texts shown across the public website — each field stores
          both an English and an Arabic version. Changes appear after saving;
          visitors see the language they selected (Arabic is the default).
        </p>
      </div>

      <div className="mt-8">
        <SiteContentForm />
      </div>

      <div className="card mt-8 p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-deep">
          Products
        </h2>
        <p className="mt-2 text-sm text-slate/60">
          Product names, descriptions, prices, images and stock are managed in{" "}
          <Link href="/admin/products" className="font-semibold text-brand-orange hover:underline">
            Products
          </Link>
          . Each product also accepts optional Arabic name/description fields.
        </p>
      </div>
    </div>
  );
}