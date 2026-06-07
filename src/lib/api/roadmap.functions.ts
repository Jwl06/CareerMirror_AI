import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  assessmentProfileSchema,
  careerAnalysisSchema,
  roadmapProgressSchema,
  type RoadmapProgress,
} from "@/lib/assessment/schema";
import { getRoadmapStats, parseRoadmapProgress } from "@/lib/roadmap/utils";

export const updateRoadmapProgress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      assessmentId: z.string().uuid(),
      progress: roadmapProgressSchema,
    }),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: assessment, error: fetchError } = await supabase
      .from("assessments")
      .select("id, status")
      .eq("id", data.assessmentId)
      .eq("user_id", userId)
      .maybeSingle();

    if (fetchError) {
      throw new Error(fetchError.message);
    }
    if (!assessment) {
      throw new Error("Assessment not found.");
    }
    if (assessment.status !== "completed") {
      throw new Error("Roadmap progress is only available for completed assessments.");
    }

    const { error: updateError } = await supabase
      .from("assessments")
      .update({
        roadmap_progress: data.progress,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.assessmentId)
      .eq("user_id", userId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return data.progress satisfies RoadmapProgress;
  });

export const getRoadmapSummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: assessment, error } = await supabase
      .from("assessments")
      .select("id, status, profile, analysis, roadmap_progress, readiness_score, created_at")
      .eq("id", data.id)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }
    if (!assessment) {
      throw new Error("Assessment not found.");
    }
    if (assessment.status !== "completed" || !assessment.analysis) {
      throw new Error("Roadmap is not available for this assessment.");
    }

    const analysis = careerAnalysisSchema.parse(assessment.analysis);
    const profile = assessmentProfileSchema.parse(assessment.profile);
    const progress = parseRoadmapProgress(assessment.roadmap_progress);
    const stats = getRoadmapStats(analysis.roadmap, progress);

    return {
      assessmentId: assessment.id,
      targetRole: profile.targetRole,
      readinessScore: assessment.readiness_score,
      createdAt: assessment.created_at,
      roadmap: analysis.roadmap,
      progress,
      stats,
    };
  });

export type RoadmapSummary = Awaited<ReturnType<typeof getRoadmapSummary>>;
