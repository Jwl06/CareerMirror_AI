import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, ClipboardList, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — CareerMirror AI" }],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Track your assessments, scores, and roadmap progress over time.
        </p>
      </div>

      <div className="glass rounded-2xl p-10 text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary/15 text-primary">
          <BarChart3 className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-semibold">No assessments yet</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          Complete your first career mirror assessment to see your readiness score, gap analysis,
          and personalized roadmap here.
        </p>
        <Link
          to="/start"
          className="glow mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <Sparkles className="h-4 w-4" />
          Start your first assessment
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { icon: BarChart3, label: "Readiness score", value: "—" },
          { icon: ClipboardList, label: "Assessments", value: "0" },
          { icon: Sparkles, label: "Roadmap weeks", value: "—" },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-4">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <stat.icon className="h-4 w-4" />
              <span className="text-xs font-medium">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
