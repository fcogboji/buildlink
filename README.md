# BuildLink MVP

BuildLink is a UK-focused full-stack marketplace + workflow app for homeowners and builders. It is structured as **four connected systems**:

1. **Acquisition** — marketing pages that build trust and sign-ups  
2. **Marketplace** — job posts, smart matching, quotes  
3. **Project management** — milestones, messages, project workspace  
4. **Payments & trust** — milestone/escrow records, Stripe subscriptions, admin moderation  

## Stack

- Next.js App Router  
- Clerk (auth)  
- Prisma + Neon/Postgres  
- Stripe (subscriptions; Connect + escrow in rollout)  
- Vercel-ready  

## Rendering (static vs dynamic)

Route segments that use **Clerk session**, **Prisma**, or **per-request redirects** set `export const dynamic = "force-dynamic"` in their **layout** (or route handler).  
**Next.js only accepts this as a literal in each file** — it cannot be re-exported from a shared module.

**Dynamic (ƒ)** — `dashboard/*`, `admin/*`, `homeowner/*`, `builder/*`, `onboarding/*`, `sign-in`, `sign-up`, Stripe API routes.  
**Static (○)** — marketing pages (`/`, `/about`, `/pricing`, …), `/login`/`/signup` redirects, and help pages (`/forgot-password`, `/verify-email`).

## Public (marketing)

| Route | Purpose |
|-------|---------|
| `/` | Landing |
| `/how-it-works` | Process & differentiation |
| `/pricing` | Builder pricing + Stripe checkout CTA |
| `/for-builders` | Builder value prop |
| `/for-homeowners` | Homeowner value prop |
| `/about`, `/contact` | Trust & support |
| `/privacy`, `/terms` | Legal placeholders (replace before launch) |

## Auth

| Route | Notes |
|-------|--------|
| `/sign-in`, `/sign-up` | Clerk hosted UI |
| `/login`, `/signup` | Aliases → Clerk |
| `/forgot-password`, `/verify-email` | Clerk-oriented help pages |

## Onboarding

| Route | Purpose |
|-------|---------|
| `/onboarding` | Role selection (homeowner vs builder) |
| `/onboarding/homeowner` | First job brief → `Job` |
| `/onboarding/builder` | Profile → `BuilderProfile` |

## Homeowner app (`/dashboard/homeowner`)

| Route | Purpose |
|-------|---------|
| `/dashboard/homeowner` | Overview |
| `/dashboard/homeowner/jobs` | Job list |
| `/dashboard/homeowner/jobs/new` | Post job |
| `/dashboard/homeowner/jobs/[id]` | Quotes, milestones, messages, accept quote |
| `/dashboard/homeowner/messages` | Job threads index |
| `/dashboard/homeowner/payments` | Milestones + payment rows |
| `/dashboard/homeowner/profile` | Account summary |

Legacy URLs **`/homeowner/jobs/*`** redirect to **`/dashboard/homeowner/jobs/*`**.

## Builder app (`/dashboard/builder`)

| Route | Purpose |
|-------|---------|
| `/dashboard/builder` | Overview |
| `/dashboard/builder/jobs/feed` | Matched job feed + quotes |
| `/dashboard/builder/jobs/[id]` | Project workspace (when assigned) |
| `/dashboard/builder/quotes` | Sent / accepted / rejected |
| `/dashboard/builder/projects` | Active projects |
| `/dashboard/builder/messages` | Threads |
| `/dashboard/builder/earnings` | Payment records |
| `/dashboard/builder/profile` | Portfolio + reviews |

Legacy **`/builder/leads`** → **`/dashboard/builder/jobs/feed`**, **`/builder/quotes`** → **`/dashboard/builder/quotes`**.

## Admin (`/admin`)

| Route | Purpose |
|-------|---------|
| `/admin` | Hub |
| `/admin/users` | Suspend users, verify builders |
| `/admin/jobs` | Flag jobs / disputes |
| `/admin/reviews` | Hide moderated reviews |
| `/admin/payments` | Payment / refund tracking |
| `/admin/disputes` | Dispute queue |
| `/admin/moderation` | Unified moderation queue + admin audit log |
| `/admin/analytics` | KPI counts |
| `/admin/diagnostics` | Operational diagnostics (rate-limit activity) |

## API

- `POST /api/stripe/checkout` — subscription (auth required)  
- `POST /api/stripe/webhook` — Stripe events  

## Database (Prisma)

Core models: `User`, `BuilderProfile`, `Job`, `Quote`, `Project`, `Milestone`, `Payment`, `Message`, `Review`.

After schema changes (or on a **new** Neon database), apply the schema — otherwise you’ll get errors like **“The table `public.User` does not exist”**:

```bash
npm run prisma:generate
npm run prisma:push
```

`prisma:push` loads **`.env.local` then `.env`** (via `dotenv-cli`) so `DATABASE_URL` is picked up the same way as Next.js.

If you only use `.env`, run: `npx prisma db push`.

## Environment variables

- **`.env.example`** — committed template (safe placeholders). Copy it and fill in real keys.
- **`.env.local`** — used by Next.js locally; **gitignored** (replace `xxx` values).

```bash
cp .env.example .env.local   # if you don’t already have .env.local
```

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_APP_URL` | Base URL for redirects (local + Vercel) |
| Clerk `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Auth |
| `ADMIN_EMAILS` | Optional comma list — DB `ADMIN` if not set via Clerk metadata |
| `DATABASE_URL` | Neon Postgres |
| `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET` | Server-side Stripe |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Publishable key (browser-safe; use when you add Stripe.js / Elements) |
| `RESEND_API_KEY`, `EMAIL_FROM` | Transactional notification emails |

### Admin role in Clerk (recommended)

Set **public metadata** on the user in [Clerk Dashboard](https://dashboard.clerk.com) → **Users** → select user → **Public metadata**:

```json
{ "role": "admin" }
```

Alternatively: `{ "isAdmin": true }`.

On the next request, `ensureUser()` syncs that to Prisma as `role: ADMIN`.  
Priority: **Clerk public metadata** → **`ADMIN_EMAILS`** env → default role.

### Admin role via env only

Set `ADMIN_EMAILS=your@email.com` in `.env.local` (comma-separated for several admins).

## Setup

```bash
npm install
# Configure env (see “Environment variables” above), then:
npm run prisma:generate
npm run prisma:push
npm run dev
```

## Vercel

- Set env vars (Clerk, `DATABASE_URL`, Stripe, `ADMIN_EMAILS`, `NEXT_PUBLIC_APP_URL`).  
- Clerk callback URLs for your domain.  
- Stripe webhook: `https://your-domain.com/api/stripe/webhook`.  

## Phase 2+ (not fully wired)

- **Stripe Connect** + true escrow per milestone  
- **Real-time messaging** (Pusher/Ably/parties)  
- **Push notifications**  
- **Search & filters** on job feed  
- **AI matching** on top of rule-based score  
# buildlink
