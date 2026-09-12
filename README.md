# Aetheria Designs

Full-stack engineering & interior design e-commerce platform. Next.js (App
Router), Tailwind CSS, Prisma + MongoDB, Cloudinary, Framer Motion, and
lucide-react. Deploys to Render as a single web service with a managed MongoDB
database.

Modern architectural aesthetic — deep slate grey, crisp white, and burnt orange.

## Features

**Public site**
- Split-view hero (Exterior ⇄ Interior), featured projects, best-seller slider
- Storefront with category filters, search, and sorting
- Product detail pages with image galleries
- Cart drawer + full cart page
- Checkout (simulated payment — structured so Stripe can be dropped in later)
- Contact form that saves inquiries to the database

**Admin panel** (`/admin`)
- Secure login with hashed (bcrypt) credentials, JW-signed session cookie
- Dashboard: unique visitors vs. page views, monthly revenue, pending/completed
  orders, recent orders + feedback
- Product CRUD with image upload (Cloudinary when configured, otherwise
  local `/public/uploads`)
- Orders log with status management
- Feedback log with OPEN / READ / RESOLVED states
- Settings: change admin password

## Tech stack

- Next.js 13.4 (App Router, TypeScript)
- Tailwind CSS 3
- Prisma 5 + MongoDB
- Cloudinary (image uploads)
- `bcryptjs` (password hashing), `jose` (signed session tokens)
- `framer-motion` (animations), `lucide-react` (icons)

> Next is pinned to 13.4.19 because newer versions ship a prebuilt SWC
> binary that requires the AVX instruction set; a CPU-first linter here
> (e.g. an older Intel Celeron) cannot run it. 13.4.19's SWC binary does
> not require AVX and works everywhere.

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
#   Set a strong AUTH_SECRET (openssl rand -base64 32)
#   Point DATABASE_URL at a MongoDB instance (local, Atlas, or Render)
#   Optionally change SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD
#   Optionally add CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET

# 3. Create the MongoDB schema
npx prisma db push

# 4. Seed an admin user + 5 sample products
npm run db:seed

# 5. Run the dev server
npm run dev
```

- Public store: <http://localhost:3000>
- Admin login: <http://localhost:3000/admin/login>

### Default admin credentials

After seeding with the default `.env`:

```
Email:    admin@aetheria.design
Password: AetheriaAdmin2024
```

> **Production note:** change the password from Settings and rotate
> `AUTH_SECRET`, `SEED_ADMIN_EMAIL`, and `SEED_ADMIN_PASSWORD` before deploying.

## Database schema

| Model      | Purpose                                             |
| ---------- | --------------------------------------------------- |
| `User`     | Admin credentials (email, bcrypt hash, role)        |
| `Product`  | Store items (name, slug, price, category, images)   |
| `Order`    | Checkout orders with customer + computed totals     |
| `OrderItem`| Line items belonging to an order                    |
| `Feedback` | Contact-form submissions with status                |
| `Analytics`| Page views keyed by visitor session id              |

Note: MongoDB supports native scalar lists, so `Product.imageUrls` is a plain
`string[]`. Cloudinary URLs are stored as-is; when Cloudinary env vars are unset
the admin upload API falls back to writing to the local filesystem
(`/public/uploads`) so local development works unchanged.

## Deploying to Render

[`render.yaml`](render.yaml) describes a web service plus a managed MongoDB
database (Blueprint). To deploy:

1. Fork / push this repository to GitHub.
2. In Render, **New → Blueprint**, select the repo, and follow the deploy.
   Render provisions:
   - an `aetheria-mongo` managed MongoDB database;
   - an `aetheria-designs` Node web service whose build runs
     `prisma generate` + `prisma db push` + `db:seed` + `next build`,
     with `DATABASE_URL` wired to the database's connection string and an
     auto-generated `AUTH_SECRET`.
3. In the service's **Environment** tab, add the Cloudinary values
   (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`)
   and set `NEXT_PUBLIC_CLOUDINARY_ENABLED=true`. These are deliberately
   marked `sync: false` so Render does not overwrite them.
4. The seeded `SEED_ADMIN_PASSWORD` is generated randomly by Render — read it
   from the service environment tab, log in at `/admin/login`, and change the
   password from Settings.

Notes:
- `prisma db push` is the schema path for MongoDB (Prisma Migrate does not
  support MongoDB).
- If the first build fails because the database was not ready, trigger a manual
  deploy from the Render dashboard after the `aetheria-mongo` database shows
  **Available**.
- For an existing Atlas cluster instead, just override the `DATABASE_URL`
  env var on the web service.

## Common tasks

```bash
npm run dev          # start development server
npm run build        # production build
npm run lint         # ESLint
npx prisma db push   # apply schema changes to the DB
npm run db:seed      # (re)seed admin + catalog
```

## Adding Stripe later

Payment is simulated in `/app/checkout/page.tsx` and the order is created by
`POST /api/checkout`. Wire Stripe there by:

1. Creating a PaymentIntent priced from the server-recomputed order total.
2. Confirming the client-side card, then setting `Order.status = "COMPLETED"` on
   the `payment_intent.succeeded` webhook (verify the signature server-side).