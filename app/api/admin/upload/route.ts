import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { writeFile } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/auth";
import { cloudinaryEnabled, uploadToCloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

const MAX_BYTES = 4 * 1024 * 1024; // 4MB

export async function POST(request: Request) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const dataUrl = typeof body.dataUrl === "string" ? body.dataUrl : "";
  const fallbackName = typeof body.name === "string" ? body.name : "";

  const match = dataUrl.match(/^data:(image\/(png|jpeg|jpg|webp|gif|avif));base64,(.+)$/s);
  if (!match) {
    return NextResponse.json(
      { error: "Please upload a valid image (PNG, JPEG, WebP, GIF or AVIF)." },
      { status: 400 }
    );
  }

  const [, mime, , b64] = match;
  const buffer = Buffer.from(b64, "base64");
  if (buffer.length === 0 || buffer.length > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image must be between 1 byte and 4MB." },
      { status: 400 }
    );
  }

  try {
    if (cloudinaryEnabled) {
      const url = await uploadToCloudinary(dataUrl);
      return NextResponse.json({ url }, { status: 201 });
    }

    const ext = (() => {
      switch (mime) {
        case "image/png": return "png";
        case "image/jpeg": return "jpg";
        case "image/webp": return "webp";
        case "image/gif": return "gif";
        case "image/avif": return "avif";
        default: return "png";
      }
    })();

    const safeName =
      fallbackName?.replace(/[^a-z0-9_-]/gi, "-").slice(0, 40) || "image";
    const fileName = `${randomUUID()}-${safeName}.${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    const target = path.join(dir, fileName);

    await writeFile(target, buffer);
    return NextResponse.json({ url: `/uploads/${fileName}` }, { status: 201 });
  } catch {
    return NextResponse.json(
      {
        error: cloudinaryEnabled
          ? "Could not upload the image to Cloudinary."
          : "Could not save the uploaded file.",
      },
      { status: 500 }
    );
  }
}