# CareerMirror AI

CareerMirror AI bridges the gap between the Current You and the Ideal You by analyzing your skills, projects, experiences, and achievements, then generating AI-powered recommendations and roadmaps to help you become the professional you aspire to be.

## Problem

Students often don't know how their profile compares to what employers expect. CareerMirror turns a detailed self-assessment into actionable scores, gap analysis, and a 4-month learning plan.

## Tech Stack

- **Frontend:** React 19, TanStack Router, TanStack Query, Tailwind CSS v4
- **UI:** shadcn/ui (Radix primitives)
- **Backend:** TanStack Start server functions (SSR)
- **Auth & DB:** Supabase (Auth + Postgres with RLS)
- **AI:** Google Gemini 2.5 Flash via Lovable AI Gateway

## Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 22+
- A [Supabase](https://supabase.com) project (or use the included `.env` for local dev)

## Getting Started

```bash
bun install
bun dev
```

Open [http://localhost:8080](http://localhost:8080) to view the marketing landing page.

## Design System

CareerMirror uses a **fixed dark theme** (no light-mode toggle) built on Tailwind CSS v4:

| Token | Role |
|-------|------|
| Deep navy background | App canvas with subtle radial ambient gradients |
| Vivid green (`primary`) | CTAs, success states, readiness scores |
| Electric violet (`accent`) | Highlights and secondary emphasis |
| Glass cards (`.glass`) | Frosted panels with backdrop blur |

**Typography:** Inter (body) + Space Grotesk (headings), loaded via Google Fonts.

**Utility classes:** `.glass`, `.glass-strong`, `.gradient-text`, `.glow`, `.glow-accent`

## Features (Landing Page)

| Feature | Description |
|---------|-------------|
| **Find My Level** | AI-powered assessment of your current career readiness |
| **Resume Mirror** | Side-by-side comparison vs an ideal industry candidate |
| **Gap Analysis** | Prioritized breakdown of what's missing and why it matters |
| **4-Month Roadmap** | Personalized weekly tasks to close your gaps |

**Tagline:** *Duolingo for career growth*

> Add a screenshot of the landing page to `docs/screenshots/landing.png` when capturing for your portfolio.

## Authentication

Email/password auth via Supabase at `/auth`:

- **Sign up** — `?mode=signup` creates an account and redirects to `/start`
- **Login** — default mode; redirects authenticated users away from `/auth`
- **Session sync** — auth state changes invalidate the router and query cache

### Environment Variables

| Variable | Required | Where |
|----------|----------|-------|
| `VITE_SUPABASE_URL` | Yes | Client |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Client |
| `SUPABASE_URL` | Yes | Server middleware |
| `SUPABASE_PUBLISHABLE_KEY` | Yes | Server middleware |
| `VITE_SUPABASE_PROJECT_ID` | Yes | Supabase project linking |
| `LOVABLE_API_KEY` | For AI | Server (Lovable AI Gateway) |

Copy `.env` and replace values with your own Supabase project credentials for production. When `LOVABLE_API_KEY` is not set, the app uses a mock analysis for local development.

### Database setup

Run the migrations in `supabase/migrations/` against your Supabase project (SQL Editor or Supabase CLI) to create the `assessments` table with RLS policies and the `roadmap_progress` column for task tracking.

## Planned User Flow

```
/  Landing page
  → /auth  Sign up or log in
  → /start  Choose assessment mode
  → /assessment  Complete career profile form
  → AI analysis
  → /analysis/:id  View scores, gaps, and roadmap
  → /roadmap/:id  Track weekly tasks and progress
  → /dashboard  Assessment history and progress
```

## Project Status

| Milestone | Status |
|-----------|--------|
| Initialize project | ✅ Done |
| Design system & app shell | ✅ Done |
| Landing page | ✅ Done |
| Authentication | ✅ Done |
| Protected app layout | ✅ Done |
| Assessment & AI analysis | ✅ Done |
| Career dashboard hub | ✅ Done |
| Progress tracking & roadmap visualization | ✅ Done |
| Interactive roadmap timeline & week navigator | ✅ Done |
| Authenticated UI polish pass | ✅ Done |

## License

Private portfolio project.
