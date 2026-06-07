import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { analyzeCareerProfile } from "@/lib/ai/gemini.server";
import {
  assessmentProfileSchema,
  type AssessmentProfile,
  type CareerAnalysis,
} from "@/lib/assessment/schema";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const submitAssessment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(assessmentProfileSchema)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const profile = data as AssessmentProfile;

    const { data: created, error: insertError } = await supabase
      .from("assessments")
      .insert({
        user_id: userId,
        status: "analyzing",
        profile,
      })
      .select("id")
      .single();

    if (insertError || !created) {
      throw new Error(insertError?.message ?? "Failed to create assessment.");
    }

    try {
      const analysis: CareerAnalysis = await analyzeCareerProfile(profile);

      const { error: updateError } = await supabase
        .from("assessments")
        .update({
          status: "completed",
          analysis,
          readiness_score: analysis.readinessScore,
          updated_at: new Date().toISOString(),
        })
        .eq("id", created.id)
        .eq("user_id", userId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      return { id: created.id };
    } catch (error) {
      await supabase
        .from("assessments")
        .update({
          status: "failed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", created.id)
        .eq("user_id", userId);

      throw error instanceof Error ? error : new Error("Analysis failed.");
    }
  });

export const getAssessment = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: assessment, error } = await supabase
      .from("assessments")
      .select("*")
      .eq("id", data.id)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }
    if (!assessment) {
      throw new Error("Assessment not found.");
    }

    return assessment;
  });

export const listAssessments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: assessments, error } = await supabase
      .from("assessments")
      .select(
        "id, status, readiness_score, profile, roadmap_progress, created_at, updated_at",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return assessments ?? [];
  });
