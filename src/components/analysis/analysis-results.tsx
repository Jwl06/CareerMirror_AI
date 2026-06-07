import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
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
  type RoadmapProgress,
} from "@/lib/assessment/schema";
import { RoadmapTracker } from "@/components/roadmap/roadmap-tracker";
import { PageHeader } from "@/components/ui/page-header";
import { StatusPanel } from "@/components/ui/status-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AnalysisResultsProps = {
  assessmentId: string;
  profile: AssessmentProfile;
  analysis: unknown;
  readinessScore: number | null;
  createdAt: string;
  roadmapProgress: RoadmapProgress | null;
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
  assessmentId,
  profile,
  analysis: rawAnalysis,
  readinessScore,
  createdAt,
  roadmapProgress,
}: AnalysisResultsProps) {
  const parsed = careerAnalysisSchema.safeParse(rawAnalysis);
  if (!parsed.success) {
    return (
      <StatusPanel
        variant="warning"
        icon={<AlertTriangle className="h-7 w-7 text-warning" />}
        title="Analysis unavailable"
        description="This assessment is still processing or the results could not be loaded. Check back from the dashboard in a moment."
        actions={
          <Link to="/dashboard">
            <Button variant="secondary" size="sm">
              Go to dashboard
            </Button>
          </Link>
        }
      />
    );
  }

  const analysis: CareerAnalysis = parsed.data;
  const score = readinessScore ?? analysis.readinessScore;

  return (
    <div className="page-enter mx-auto max-w-4xl space-y-6">
      <PageHeader
        back={{ to: "/dashboard", label: "Dashboard" }}
        title={
          <>
            Your <span className="gradient-text">Career Mirror</span>
          </>
        }
        subtitle={`${profile.targetRole} · ${new Date(createdAt).toLocaleDateString()}`}
        action={
          <div className="glass rounded-2xl px-6 py-4 text-center">
            <p className="text-xs font-medium text-muted-foreground">Readiness score</p>
            <p className={`text-5xl font-bold tabular-nums ${scoreColor(score)}`}>{score}</p>
            <p className="text-xs text-muted-foreground">out of 100</p>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        <Link to="/roadmap/$id" params={{ id: assessmentId }}>
          <Button variant="secondary" size="sm">
            <Map className="mr-2 h-4 w-4" />
            Track roadmap
          </Button>
        </Link>
        <Link to="/start">
          <Button variant="outline" size="sm">
            New assessment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="glass fade-in-up rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <h2 className="font-semibold">Executive summary</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{analysis.summary}</p>
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

        <TabsContent value="overview" className="fade-in-up space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {analysis.categoryScores.map((cat) => (
              <div key={cat.category} className="glass rounded-xl p-4 transition hover:border-primary/20">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{cat.category}</span>
                  <span className={`text-lg font-bold tabular-nums ${scoreColor(cat.score)}`}>
                    {cat.score}
                  </span>
                </div>
                <Progress value={cat.score} className="mb-2 h-1.5" />
                <p className="text-xs leading-relaxed text-muted-foreground">{cat.feedback}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="gaps" className="fade-in-up space-y-3">
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Prioritized gaps between you and an industry-ready candidate
          </div>
          {analysis.gaps.length === 0 ? (
            <div className="glass rounded-xl p-8 text-center">
              <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-primary" />
              <p className="font-medium">No major gaps identified</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Your profile aligns well with the target role. Focus on the roadmap to stay sharp.
              </p>
            </div>
          ) : (
            analysis.gaps.map((gap) => (
              <div key={gap.skill} className="glass rounded-xl p-5 transition hover:border-primary/20">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{gap.skill}</h3>
                  <Badge variant="outline" className={priorityStyles[gap.priority]}>
                    {gap.priority} priority
                  </Badge>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{gap.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Why it matters:</span>{" "}
                  {gap.whyItMatters}
                </p>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="mirror" className="fade-in-up">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="glass rounded-2xl p-6">
              <div className="mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Your profile</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {analysis.currentProfile.summary}
              </p>
              <ul className="mt-4 space-y-2">
                {analysis.currentProfile.strengths.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass rounded-2xl border border-primary/20 p-6">
              <div className="mb-4 flex items-center gap-2">
                <GitCompareArrows className="h-5 w-5 text-accent" />
                <h3 className="font-semibold">Ideal candidate</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {analysis.idealCandidate.summary}
              </p>
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

        <TabsContent value="roadmap" className="fade-in-up space-y-3">
          <RoadmapTracker
            assessmentId={assessmentId}
            roadmap={analysis.roadmap}
            initialProgress={roadmapProgress}
            compact
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
