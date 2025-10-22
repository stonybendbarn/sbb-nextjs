# Stony Bend Barn — Website (Next.js + Vercel)

A modern, fast, and lightweight website for **Stony Bend Barn** (cutting boards, charcuterie boards, chess/cribbage, and more).  
Originally scaffolded with **v0**, now maintained in **GitHub** and deployed via **Vercel**.

## Tech Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Vercel (preview + production deploys)
- Resend (email: inquiries/custom orders)
- Stripe (e-commerce groundwork; production payments gated by env keys)
- **Shippo API** (real-time shipping rates)
- *(Optional)* S3 / Vercel Blob for large image hosting

## Features
- Product inventory & detail pages (images, dimensions, pricing)
- **Real-time shipping calculator** with Shippo API integration
- **Smart packaging logic** for accurate shipping costs
- **Insurance for orders over $100** (rounded to $100 increments)
- "Contact to Purchase" flow using Resend (server route + email template)
- **E-commerce ready**: Stripe keys & checkout routes wired; enable by adding live keys
- SEO basics (metadata, Open Graph, social share images)
- Responsive design with Tailwind
- Preview Deploys for every PR to validate changes before going live

## Shipping Integration
- **Shippo API** for real-time shipping rate calculation
- **Smart packaging** adds 2" to combined dimensions for accurate costs
- **Insurance calculation** for orders over $100 (Pirate Ship compatible)
- **$5 packaging cost** included in all shipping calculations
- **Fallback rates** when Shippo API unavailable
- **Local pickup option** always available at checkout

## Shipping Workflow
1. **Customer adds items to cart**
2. **Calculates shipping** using Shippo API with smart packaging
3. **Shows accurate rates** before checkout
4. **Prints labels** via Pirate Ship (manual process)
5. **Ships with calculated dimensions** and insurance

## Environment Variables
- `SHIPPO_API` - Shippo API key for shipping rate calculation
- `STRIPE_SECRET_KEY` - Stripe payments
- `RESEND_API_KEY` - Email notifications
- `DATABASE_URL` - Neon database connection

### Roadmap
- Multi-image carousel on Inventory tiles
- Cart drawer
- Swipe support on mobile
- **Pirate Ship label printing integration**
- **Shipping rate optimization** based on actual costs

## Repository Model (How We Work)
- **GitHub is the source of truth.**
- **Vercel** watches the repo:
  - Push/merge to a feature branch → **Preview Deployment**
  - Merge to `main` → **Production Deployment (LIVE)**
- **v0** is used as an assistant to generate components/edits that land as **Pull Requests** to this repo (no direct edits in Vercel).