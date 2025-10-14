# Stony Bend Barn — Website (Next.js + Vercel)

A modern, fast, and lightweight website for **Stony Bend Barn** (cutting boards, charcuterie boards, chess/cribbage, and more).  
Originally scaffolded with **v0**, now maintained in **GitHub** and deployed via **Vercel**.

## Tech Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Vercel (preview + production deploys)
- Resend (email: inquiries/custom orders)
- Stripe (e-commerce groundwork; production payments gated by env keys)
- *(Optional)* S3 / Vercel Blob for large image hosting

## Features
- Product inventory & detail pages (images, dimensions, pricing)
- “Contact to Purchase” flow using Resend (server route + email template)
- **E-commerce ready**: Stripe keys & checkout routes wired; enable by adding live keys
- SEO basics (metadata, Open Graph, social share images)
- Responsive design with Tailwind
- Preview Deploys for every PR to validate changes before going live

### Roadmap
- Multi-image carousel on Inventory tiles
- Cart drawer
- Swipe support on mobile

## Repository Model (How We Work)
- **GitHub is the source of truth.**
- **Vercel** watches the repo:
  - Push/merge to a feature branch → **Preview Deployment**
  - Merge to `main` → **Production Deployment (LIVE)**
- **v0** is used as an assistant to generate components/edits that land as **Pull Requests** to this repo (no direct edits in Vercel).
