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

Open [http://localhost:8080](http://localhost:8080) — you'll see a placeholder page until the landing page milestone ships.

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
| Initialize project | ✅ Current |
| Design system & app shell | 🔜 |
| Landing page | 🔜 |
| Authentication | 🔜 |
| Assessment & AI analysis | 🔜 |
| Dashboard & progress tracking | 🔜 |

## License

Private portfolio project.
