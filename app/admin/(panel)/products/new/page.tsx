import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Add Product" };

export default function NewProductPage() {
  return (
    <div>
      <p className="kicker">Catalog</p>
      <h1 className="mt-1 text-2xl font-extrabold text-slate-deep">
        Add New Product
      </h1>
      <p className="mt-1 text-sm text-slate/50">
        Stock a new design object in the store.
      </p>
      <div className="mt-8">
        <ProductForm />
      </div>
    </div>
  );
}