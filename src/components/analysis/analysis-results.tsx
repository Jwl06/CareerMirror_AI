import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  GitCompareArrows,
  Map,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

import {
  careerAnalysisSchema,
  type AssessmentProfile,
  type CareerAnalysis,
} from "@/lib/assessment/schema";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AnalysisResultsProps = {
  profile: AssessmentProfile;
  analysis: unknown;
  readinessScore: number | null;
  createdAt: string;
};

const priorityStyles = {
  high: "bg-destructive/15 text-destructive border-destructive/20",
  medium: "bg-warning/15 text-warning border-warning/20",
  low: "bg-muted text-muted-foreground border-border",
} as const;

function scoreColor(score: number) {
  if (score >= 75) return "text-primary";
  if (score >= 50) return "text-warning";
  return "text-destructive";
}

export function AnalysisResults({
  profile,
  analysis: rawAnalysis,
  readinessScore,
  createdAt,
}: AnalysisResultsProps) {
  const parsed = careerAnalysisSchema.safeParse(rawAnalysis);
  if (!parsed.success) {
    return (
      <div className="glass mx-auto max-w-lg rounded-2xl p-10 text-center">
        <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-warning" />
        <h1 className="text-xl font-semibold">Analysis unavailable</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This assessment is still processing or failed. Try again from the dashboard.
        </p>
        <Link to="/dashboard" className="mt-6 inline-flex text-sm text-primary hover:underline">
          Go to dashboard
        </Link>
      </div>
    );
  }

  const analysis: CareerAnalysis = parsed.data;
  const score = readinessScore ?? analysis.readinessScore;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            to="/dashboard"
            className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" />
            Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Your <span className="gradient-text">Career Mirror</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {profile.targetRole} · {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="glass rounded-2xl px-6 py-4 text-center">
          <p className="text-xs font-medium text-muted-foreground">Readiness score</p>
          <p className={`text-5xl font-bold ${scoreColor(score)}`}>{score}</p>
          <p className="text-xs text-muted-foreground">out of 100</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <h2 className="font-semibold">Executive summary</h2>
            <p className="mt-1 text-sm text-muted-foreground">{analysis.summary}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="glass w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="gaps">Gap analysis</TabsTrigger>
          <TabsTrigger value="mirror">Resume mirror</TabsTrigger>
          <TabsTrigger value="roadmap">4-month roadmap</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {analysis.categoryScores.map((cat) => (
              <div key={cat.category} className="glass rounded-xl p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{cat.category}</span>
                  <span className={`text-lg font-bold ${scoreColor(cat.score)}`}>{cat.score}</span>
                </div>
                <Progress value={cat.score} className="mb-2 h-1.5" />
                <p className="text-xs text-muted-foreground">{cat.feedback}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="gaps" className="space-y-3">
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Prioritized gaps between you and an industry-ready candidate
          </div>
          {analysis.gaps.map((gap) => (
            <div key={gap.skill} className="glass rounded-xl p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold">{gap.skill}</h3>
                <Badge variant="outline" className={priorityStyles[gap.priority]}>
                  {gap.priority} priority
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{gap.description}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Why it matters:</span>{" "}
                {gap.whyItMatters}
              </p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="mirror">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="glass rounded-2xl p-6">
              <div className="mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Your profile</h3>
              </div>
              <p className="text-sm text-muted-foreground">{analysis.currentProfile.summary}</p>
              <ul className="mt-4 space-y-2">
                {analysis.currentProfile.strengths.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass rounded-2xl p-6 border border-primary/20">
              <div className="mb-4 flex items-center gap-2">
                <GitCompareArrows className="h-5 w-5 text-accent" />
                <h3 className="font-semibold">Ideal candidate</h3>
              </div>
              <p className="text-sm text-muted-foreground">{analysis.idealCandidate.summary}</p>
              <ul className="mt-4 space-y-2">
                {analysis.idealCandidate.strengths.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-3">
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Map className="h-4 w-4 text-primary" />
            16-week personalized plan to close your gaps
          </div>
          <div className="grid gap-3">
            {analysis.roadmap.map((week) => (
              <div key={week.week} className="glass rounded-xl p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                    Week {week.week}
                  </Badge>
                  <span className="font-semibold">{week.title}</span>
                  <span className="text-xs text-muted-foreground">· {week.focusArea}</span>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {week.tasks.map((task) => (
                    <li key={task} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
