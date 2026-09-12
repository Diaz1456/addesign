/* eslint-disable no-console */
/**
 * Seeds the database with an initial admin user and 5 sample products.
 *
 *   npm run db:seed
 *
 * Credentials come from .env (SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD).
 */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const ADMIN_EMAIL =
  process.env.SEED_ADMIN_EMAIL || "admin@aetheria.design";
const ADMIN_PASSWORD =
  process.env.SEED_ADMIN_PASSWORD || "AetheriaAdmin2024";
const ADMIN_NAME = process.env.SEED_ADMIN_NAME || "Aetheria Admin";

const PRODUCTS = [
  {
    name: "Modernist Lounge Chair",
    description:
      "A reissue of our studio's 2019 lounge chair. Kiln-dried oak frame with a hand-wrapped wool seat, cantilevered on a whisper-thin steel base with a powder-coat in deep slate. Designed for the reading corner of concrete lofts.",
    price: 1290,
    category: "Interior",
    featured: true,
    stock: 8,
    imageUrls: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=900&auto=format&fit=crop",
    ],
  },
  {
    name: "Parametric Facade Panel",
    description:
      "A pre-perforated anodized aluminium panel from the Helios Terraces project. Each sheet is CNC-cut to a gradient opening pattern that tunes daylight and privacy. Sold per panel — custom tessellations quoted per project.",
    price: 550,
    category: "Exterior",
    featured: true,
    stock: 24,
    imageUrls: [
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=900&auto=format&fit=crop",
    ],
  },
  {
    name: "Smart Lighting System",
    description:
      "Tunable-white linear system engineered for residential and studio interiors. Constant-current drivers, DALI dimming, and a brushed anodized profile that reads as a crisp architectural line. Includes the control bridge and app set-up.",
    price: 320,
    category: "Structural",
    featured: false,
    stock: 40,
    imageUrls: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=900&auto=format&fit=crop",
    ],
  },
  {
    name: "Concrete Grove Bench",
    description:
      "A precast concrete bench from the Concrete Grove campus, now available for private gardens and courtyards. Acid-washed finish with a subtle burned-orange pigment seam. Ships in two interlocking sections with a hidden steel connection.",
    price: 890,
    category: "Exterior",
    featured: true,
    stock: 6,
    imageUrls: [
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=900&auto=format&fit=crop",
    ],
  },
  {
    name: "Slate Ceramic Vessel Set",
    description:
      "A trio of hand-thrown stoneware vessels glazed in matte slate and ember. Each piece is thrown in our Copenhagen studio and slow-fired. Group them on a shelf or a dining table as an honest counterpoint to steel and glass.",
    price: 145,
    category: "Decor",
    featured: false,
    stock: 32,
    imageUrls: [
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=900&auto=format&fit=crop",
    ],
  },
];

async function main() {
  console.log("Seeding database…");

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { passwordHash, name: ADMIN_NAME },
    create: {
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log(`✔ Admin user ready: ${admin.email}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);

  for (const product of PRODUCTS) {
    const { name, ...data } = product;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    await prisma.product.upsert({
      where: { slug },
      update: {
        description: data.description,
        price: data.price,
        category: data.category,
        featured: data.featured,
        stock: data.stock,
        imageUrls: data.imageUrls,
      },
      create: {
        name,
        slug,
        description: data.description,
        price: data.price,
        category: data.category,
        featured: data.featured,
        stock: data.stock,
        imageUrls: data.imageUrls,
      },
    });
    console.log(`✔ Product: ${name}`);
  }

  console.log("\nSeeding complete. Start the app with `npm run dev`.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });