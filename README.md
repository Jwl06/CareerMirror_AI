# CareerMirror AI

**Duolingo for career growth** — an AI-powered platform that helps students and early-career developers understand where they stand, identify skill gaps, and follow a personalized roadmap to industry readiness.

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
- A Supabase project (added in a later milestone)

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

## Planned User Flow

```
/  Landing page
  → /auth  Sign up or log in
  → /start  Choose assessment mode
  → /assessment  Complete career profile form
  → AI analysis
  → /analysis/:id  View scores, gaps, and roadmap
  → /dashboard  Assessment history and progress
```

## Project Status

| Milestone | Status |
|-----------|--------|
| Initialize project | ✅ Done |
| Design system & app shell | ✅ Done |
| Landing page | ✅ Current |
| Authentication | 🔜 |
| Assessment & AI analysis | 🔜 |
| Dashboard & progress tracking | 🔜 |

## License

Private portfolio project.
