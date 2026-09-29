# The Fragrance House

A luxury fragrance storefront for a Sri Lankan business, built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, PostgreSQL, Auth.js, and Zod.

The current storefront includes the premium responsive home, collection, product detail, and cart experience. Demo catalog content is intentionally local and clearly separated from the production database contract in `prisma/schema.prisma`.

## Requirements

- Node.js 20.9 or newer
- PostgreSQL 14 or newer
- npm

## Local setup

```bash
npm install
cp .env.example .env
# Set DATABASE_URL and AUTH_SECRET in .env
npx prisma generate
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

See `.env.example`. `DATABASE_URL` and `AUTH_SECRET` are required before enabling authenticated and database-backed flows. Store contact information, WhatsApp, delivery pricing, and bank transfer instructions are configuration values and must be reviewed before launch.

## Database

The Prisma schema models users, roles, addresses, products, independently stocked full-bottle and decant variants, carts, wishlists, orders, status history, coupons, reviews, subscribers, and store settings. In production, use migrations rather than `db push`:

```bash
npx prisma migrate dev --name init
npx prisma studio
```

Inventory is represented per variant. Order creation should re-read price and stock inside a database transaction and record a single stock deduction strategy; never trust client totals or deduct stock again on later status changes.

## Demo content

The initial UI uses development-only catalog data in `lib/catalog.ts` and remote Unsplash photography for visual prototyping. Replace these with approved product records and a production image provider such as Cloudinary or Supabase Storage before launch. Do not represent demo prices, stock, reviews, or claims as live business information.

## Production checklist

- Configure PostgreSQL, Auth.js credentials, secure cookies, and a strong `AUTH_SECRET`.
- Add server actions/API routes with Zod validation for auth, cart, checkout, coupons, reviews, newsletter, and admin operations.
- Add role-checked admin layouts and server-side authorization for every mutation.
- Add a transactional checkout service that recalculates prices, delivery, coupon discounts, and stock.
- Configure image upload validation and private-to-public asset handling.
- Review shipping, returns, privacy, terms, contact details, and payment instructions with the store owner.
- Add rate limiting, email/order notifications, payment gateway integration, backups, monitoring, and error reporting.

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run db:generate
npm run db:push
npm run db:studio
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# decantlab
