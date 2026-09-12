"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileUp,
  Loader2,
  Save,
  Trash2,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";
import type { Product } from "@prisma/client";

const CATEGORIES = ["Interior", "Exterior", "Structural", "Decor"];

interface Props {
  product?: Product;
}

export function ProductForm({ product }: Props) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [category, setCategory] = useState(product?.category ?? "Interior");
  const [stock, setStock] = useState(product ? String(product.stock) : "10");
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [images, setImages] = useState<string[]>(() =>
    product?.imageUrls ?? []
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");

    try {
      const added: string[] = [];
      for (const file of Array.from(files).slice(0, 6 - images.length)) {
        const reader = new FileReader();
        const dataUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataUrl, name: file.name }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.url) {
          added.push(data.url);
        } else {
          setError(data.error || "One of the images failed to upload.");
        }
      }
      if (added.length > 0) {
        setImages((prev) => [...prev, ...added].slice(0, 6));
      }
    } catch {
      setError("Could not read the selected file.");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock),
      featured,
      imageUrls: images,
    };

    try {
      const res = product
        ? await fetch(`/api/admin/products/${product.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not save the product.");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <div className="card p-6">
          <h2 className="font-bold text-slate-deep">Details</h2>
          <div className="mt-5 grid gap-5">
            <div>
              <label className="label" htmlFor="name">Product name</label>
              <input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="e.g. Parametric Facade Panel"
              />
            </div>
            <div>
              <label className="label" htmlFor="description">Description</label>
              <textarea
                id="description"
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input resize-none"
                placeholder="Materials, dimensions, finish details, and the story of the piece…"
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label className="label" htmlFor="price">Price (USD)</label>
                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="input"
                  placeholder="550"
                />
              </div>
              <div>
                <label className="label" htmlFor="stock">Stock</label>
                <input
                  id="stock"
                  type="number"
                  min="0"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label className="label" htmlFor="category">Category</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="btn-ghost">
            <ArrowLeft className="h-4 w-4" /> Cancel
          </Link>
          <button type="submit" disabled={saving || uploading} className="btn-primary">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {product ? "Save Changes" : "Create Product"}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="card p-6">
          <h2 className="font-bold text-slate-deep">Images</h2>
          <p className="mt-1 text-xs text-slate/50">
            Up to 6 images. First image is used as the thumbnail.
          </p>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={uploading || images.length >= 6}
            className="mt-4 flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate/20 bg-slate/5 px-4 py-8 text-sm font-semibold text-slate/60 transition hover:border-brand-orange hover:text-brand-orange disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" /> Uploading…
              </>
            ) : (
              <>
                <UploadCloud className="h-6 w-6" /> Click to upload images
              </>
            )}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          {images.length > 0 && (
            <ul className="mt-4 grid grid-cols-3 gap-3">
              {images.map((src, i) => (
                <li key={src} className="group relative">
                  <div className="aspect-square overflow-hidden rounded-lg bg-slate/10">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </div>
                  {i === 0 && (
                    <span className="absolute left-1.5 top-1.5 rounded bg-brand-orange px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setImages((prev) => prev.filter((img) => img !== src))
                    }
                    className="absolute right-1.5 top-1.5 rounded-md bg-slate-darker/70 p-1 text-white opacity-0 transition group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 flex items-center gap-1.5 text-xs text-slate/40">
            <FileUp className="h-3.5 w-3.5" /> {process.env.NEXT_PUBLIC_CLOUDINARY_ENABLED ? "Images are hosted on Cloudinary." : "Images are saved to /public/uploads."}
          </p>
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-slate-deep">Showcase</h2>
          <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-md p-2 transition hover:bg-slate/5">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-brand-orange"
            />
            <span className="text-sm">
              <span className="font-semibold text-slate-deep">
                Feature on homepage
              </span>
              <span className="block text-xs text-slate/50">
                Highlights this object in the landing page collection.
              </span>
            </span>
          </label>
        </div>
      </div>
    </form>
  );
}