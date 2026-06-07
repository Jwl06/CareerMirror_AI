import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, GitCompareArrows, Sparkles, Target, Zap } from "lucide-react";

export const Route = createFileRoute("/_authenticated/start")({
  head: () => ({
    meta: [{ title: "Get Started — CareerMirror AI" }],
  }),
  component: StartPage,
});

const assessmentModes = [
  {
    id: "full",
    icon: Target,
    title: "Full Career Mirror",
    description:
      "Complete a detailed profile assessment. AI compares you against an ideal industry candidate and builds your 4-month roadmap.",
    badge: "Recommended",
    available: true,
  },
  {
    id: "quick",
    icon: Zap,
    title: "Quick Skill Check",
    description:
      "A fast 5-minute scan of your top skills and biggest gaps — perfect when you're short on time.",
    badge: "Coming soon",
    available: false,
  },
  {
    id: "resume",
    icon: GitCompareArrows,
    title: "Resume Mirror",
    description:
      "Upload your resume and see a side-by-side comparison with what hiring managers expect for your target role.",
    badge: "Coming soon",
    available: false,
  },
] as const;

function StartPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3 text-primary" />
          Step 1 of your journey
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Choose your <span className="gradient-text">assessment mode</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Pick how you'd like CareerMirror to evaluate your profile. You can always run another
          assessment later.
        </p>
      </div>

      <div className="grid gap-4">
        {assessmentModes.map((mode) => (
          <div
            key={mode.id}
            className={`glass rounded-2xl p-6 transition ${
              mode.available ? "hover:translate-y-[-2px] hover:border-primary/30" : "opacity-70"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                <mode.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold">{mode.title}</h2>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      mode.available
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {mode.badge}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{mode.description}</p>
                {mode.available ? (
                  <Link
                    to="/assessment"
                    className="group mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                  >
                    Begin assessment
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </Link>
                ) : (
                  <p className="mt-4 text-xs text-muted-foreground">Available in a future update</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
