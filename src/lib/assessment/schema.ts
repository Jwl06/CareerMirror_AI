import { z } from "zod";

export const experienceLevels = [
  "student",
  "entry",
  "junior",
  "mid",
  "senior",
] as const;

export const assessmentProfileSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  targetRole: z.string().min(2, "Target role is required"),
  experienceLevel: z.enum(experienceLevels),
  yearsOfExperience: z.coerce.number().min(0).max(40),
  education: z.string().min(2, "Education is required"),
  skills: z.string().min(2, "List at least a few skills"),
  programmingLanguages: z.string().min(1, "Required"),
  frameworks: z.string().optional().default(""),
  tools: z.string().optional().default(""),
  projects: z.string().min(10, "Describe at least one project"),
  workExperience: z.string().optional().default(""),
  githubUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  careerGoals: z.string().min(10, "Share your career goals"),
  knownWeaknesses: z.string().optional().default(""),
});

export type AssessmentProfile = z.infer<typeof assessmentProfileSchema>;

export const categoryScoreSchema = z.object({
  category: z.string(),
  score: z.number().min(0).max(100),
  feedback: z.string(),
});

export const gapSchema = z.object({
  skill: z.string(),
  priority: z.enum(["high", "medium", "low"]),
  description: z.string(),
  whyItMatters: z.string(),
});

export const roadmapWeekSchema = z.object({
  week: z.number().min(1).max(16),
  title: z.string(),
  focusArea: z.string(),
  tasks: z.array(z.string()).min(1),
});

export const careerAnalysisSchema = z.object({
  readinessScore: z.number().min(0).max(100),
  summary: z.string(),
  categoryScores: z.array(categoryScoreSchema).min(3),
  gaps: z.array(gapSchema).min(3),
  idealCandidate: z.object({
    summary: z.string(),
    strengths: z.array(z.string()).min(3),
  }),
  currentProfile: z.object({
    summary: z.string(),
    strengths: z.array(z.string()).min(2),
  }),
  roadmap: z.array(roadmapWeekSchema).min(8),
});

export type CareerAnalysis = z.infer<typeof careerAnalysisSchema>;
export type RoadmapWeek = z.infer<typeof roadmapWeekSchema>;

export const roadmapProgressSchema = z.object({
  startedAt: z.string().datetime(),
  currentWeek: z.number().min(1).max(16),
  completedTasks: z.array(z.string()),
});

export type RoadmapProgress = z.infer<typeof roadmapProgressSchema>;

export function createDefaultRoadmapProgress(): RoadmapProgress {
  return {
    startedAt: new Date().toISOString(),
    currentWeek: 1,
    completedTasks: [],
  };
}

export type AssessmentRecord = {
  id: string;
  user_id: string;
  status: "pending" | "analyzing" | "completed" | "failed";
  profile: AssessmentProfile;
  analysis: CareerAnalysis | null;
  readiness_score: number | null;
  roadmap_progress: RoadmapProgress | null;
  created_at: string;
  updated_at: string;
};
