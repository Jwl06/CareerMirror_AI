import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AssessmentForm } from "@/components/assessment/assessment-form";

export const Route = createFileRoute("/_authenticated/assessment")({
  head: () => ({
    meta: [{ title: "Assessment — CareerMirror AI" }],
  }),
  component: AssessmentPage,
});

function AssessmentPage() {
  const navigate = useNavigate();

  return (
    <AssessmentForm
      onComplete={(id) => {
        navigate({ to: "/analysis/$id", params: { id } });
      }}
    />
  );
}
