import { createFileRoute, Link } from "@tanstack/react-router";
import { Construction } from "lucide-react";

export const Route = createFileRoute("/_authenticated/assessment")({
  head: () => ({
    meta: [{ title: "Assessment — CareerMirror AI" }],
  }),
  component: AssessmentPlaceholder,
});

function AssessmentPlaceholder() {
  return (
    <div className="mx-auto max-w-lg text-center">
      <div className="glass rounded-2xl p-10">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-accent/15 text-accent">
          <Construction className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-semibold">Career profile form</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The full assessment form and AI analysis are coming in the next milestone. For now,
          you've confirmed the protected app layout is working.
        </p>
        <Link
          to="/start"
          className="mt-6 inline-flex rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-secondary"
        >
          Back to start
        </Link>
      </div>
    </div>
  );
}
