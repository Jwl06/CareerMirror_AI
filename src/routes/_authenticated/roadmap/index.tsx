import { createFileRoute, redirect } from "@tanstack/react-router";

import { listAssessments } from "@/lib/api/assessment.functions";
import { getActiveAssessment, type DashboardAssessment } from "@/lib/dashboard/utils";

export const Route = createFileRoute("/_authenticated/roadmap/")({
  beforeLoad: async () => {
    const assessments = (await listAssessments()) as DashboardAssessment[];
    const active = getActiveAssessment(assessments);

    if (active?.kind === "active_plan") {
      throw redirect({
        to: "/roadmap/$id",
        params: { id: active.assessment.id },
      });
    }

    throw redirect({ to: "/dashboard" });
  },
});
