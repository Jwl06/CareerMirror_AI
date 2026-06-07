import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Target, GitCompareArrows, Map, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareerMirror AI — Become the professional you aspire to be" },
      {
        name: "description",
        content:
          "Compare your profile against an ideal industry-ready candidate and get a personalized AI-generated roadmap.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="container mx-auto flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold">
            CareerMirror<span className="text-primary"> AI</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground">
            Login
          </Link>
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Get Started
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div className="container mx-auto max-w-4xl px-6 pt-16 pb-24 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            Powered by AI · Built for students
          </div>
          <h1 className="text-5xl leading-[1.05] font-bold tracking-tight md:text-7xl">
            Become the <span className="gradient-text">Professional</span> You Aspire To Be
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Compare your profile against an ideal industry-ready candidate and get a personalized
            AI-generated roadmap.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/auth"
              search={{ mode: "signup" }}
              className="group glow inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:translate-y-[-1px]"
            >
              Get Started{" "}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/auth"
              className="rounded-xl border border-border bg-card/60 px-6 py-3 font-semibold backdrop-blur transition hover:bg-card"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto grid gap-4 px-6 pb-24 md:grid-cols-4">
        {[
          {
            icon: Target,
            title: "Find My Level",
            text: "AI-powered assessment of your current readiness.",
          },
          {
            icon: GitCompareArrows,
            title: "Resume Mirror",
            text: "Side-by-side comparison vs the ideal candidate.",
          },
          {
            icon: ShieldCheck,
            title: "Gap Analysis",
            text: "Know exactly what's missing and why it matters.",
          },
          {
            icon: Map,
            title: "4-Month Roadmap",
            text: "Personalized weekly tasks that move your score.",
          },
        ].map((f) => (
          <div key={f.title} className="glass rounded-2xl p-6 transition hover:translate-y-[-2px]">
            <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </section>

      <footer className="container mx-auto px-6 pb-10 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CareerMirror AI · Duolingo for career growth
      </footer>
    </div>
  );
}
