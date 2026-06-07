import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import {
  assessmentProfileSchema,
  experienceLevels,
  type AssessmentProfile,
} from "@/lib/assessment/schema";
import { submitAssessment } from "@/lib/api/assessment.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

const steps = [
  { id: "basics", title: "Basics", description: "Who you are and where you're headed" },
  { id: "skills", title: "Skills", description: "Your technical toolkit" },
  { id: "experience", title: "Experience", description: "Projects and work history" },
  { id: "links", title: "Links & goals", description: "Portfolio and aspirations" },
] as const;

const experienceLabels: Record<(typeof experienceLevels)[number], string> = {
  student: "Student",
  entry: "Entry level",
  junior: "Junior",
  mid: "Mid level",
  senior: "Senior",
};

type AssessmentFormProps = {
  onComplete: (assessmentId: string) => void;
};

export function AssessmentForm({ onComplete }: AssessmentFormProps) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<AssessmentProfile>({
    resolver: zodResolver(assessmentProfileSchema),
    defaultValues: {
      fullName: "",
      targetRole: "",
      experienceLevel: "student",
      yearsOfExperience: 0,
      education: "",
      skills: "",
      programmingLanguages: "",
      frameworks: "",
      tools: "",
      projects: "",
      workExperience: "",
      githubUrl: "",
      linkedinUrl: "",
      portfolioUrl: "",
      careerGoals: "",
      knownWeaknesses: "",
    },
    mode: "onTouched",
  });

  const progress = ((step + 1) / steps.length) * 100;

  const fieldsByStep: (keyof AssessmentProfile)[][] = [
    ["fullName", "targetRole", "experienceLevel", "yearsOfExperience", "education"],
    ["skills", "programmingLanguages", "frameworks", "tools"],
    ["projects", "workExperience"],
    ["githubUrl", "linkedinUrl", "portfolioUrl", "careerGoals", "knownWeaknesses"],
  ];

  const goNext = async () => {
    const fields = fieldsByStep[step]!;
    const valid = await form.trigger(fields);
    if (!valid) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const result = await submitAssessment({ data: values });
      toast.success("Analysis complete!");
      onComplete(result.id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit assessment.");
    } finally {
      setSubmitting(false);
    }
  });

  const { register, formState: { errors }, setValue, watch } = form;
  const experienceLevel = watch("experienceLevel");

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl">
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3 text-primary" />
          Step {step + 1} of {steps.length} · {steps[step]!.title}
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Your <span className="gradient-text">career profile</span>
        </h1>
        <p className="mt-2 text-muted-foreground">{steps[step]!.description}</p>
        <Progress value={progress} className="mt-4 h-1.5" />
      </div>

      <div className="glass rounded-2xl p-6 md:p-8">
        {step === 0 && (
          <div className="space-y-4">
            <Field label="Full name" error={errors.fullName?.message}>
              <Input {...register("fullName")} placeholder="Jane Doe" />
            </Field>
            <Field label="Target role" error={errors.targetRole?.message}>
              <Input {...register("targetRole")} placeholder="Frontend Developer, Data Analyst…" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Experience level" error={errors.experienceLevel?.message}>
                <Select
                  value={experienceLevel}
                  onValueChange={(v) =>
                    setValue("experienceLevel", v as AssessmentProfile["experienceLevel"], {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {experienceLabels[level]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Years of experience" error={errors.yearsOfExperience?.message}>
                <Input type="number" min={0} max={40} {...register("yearsOfExperience")} />
              </Field>
            </div>
            <Field label="Education" error={errors.education?.message}>
              <Input
                {...register("education")}
                placeholder="B.S. Computer Science, State University"
              />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <Field label="Top skills" error={errors.skills?.message}>
              <Textarea
                {...register("skills")}
                rows={3}
                placeholder="React, TypeScript, SQL, problem solving…"
              />
            </Field>
            <Field label="Programming languages" error={errors.programmingLanguages?.message}>
              <Input {...register("programmingLanguages")} placeholder="JavaScript, Python, Java" />
            </Field>
            <Field label="Frameworks & libraries" error={errors.frameworks?.message}>
              <Input {...register("frameworks")} placeholder="React, Node.js, Django" />
            </Field>
            <Field label="Tools & platforms" error={errors.tools?.message}>
              <Input {...register("tools")} placeholder="Git, Docker, AWS, Figma" />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Field label="Projects" error={errors.projects?.message}>
              <Textarea
                {...register("projects")}
                rows={5}
                placeholder="Describe 1–3 projects: what you built, tech used, and outcomes."
              />
            </Field>
            <Field label="Work experience (optional)" error={errors.workExperience?.message}>
              <Textarea
                {...register("workExperience")}
                rows={4}
                placeholder="Internships, part-time jobs, freelance work…"
              />
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Field label="GitHub URL (optional)" error={errors.githubUrl?.message}>
              <Input {...register("githubUrl")} placeholder="https://github.com/username" />
            </Field>
            <Field label="LinkedIn URL (optional)" error={errors.linkedinUrl?.message}>
              <Input {...register("linkedinUrl")} placeholder="https://linkedin.com/in/username" />
            </Field>
            <Field label="Portfolio URL (optional)" error={errors.portfolioUrl?.message}>
              <Input {...register("portfolioUrl")} placeholder="https://yoursite.dev" />
            </Field>
            <Field label="Career goals" error={errors.careerGoals?.message}>
              <Textarea
                {...register("careerGoals")}
                rows={3}
                placeholder="Where do you want to be in 1–2 years?"
              />
            </Field>
            <Field label="Known weaknesses (optional)" error={errors.knownWeaknesses?.message}>
              <Textarea
                {...register("knownWeaknesses")}
                rows={2}
                placeholder="Areas you already know you need to improve"
              />
            </Field>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button type="button" variant="ghost" onClick={goBack} disabled={step === 0 || submitting}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {step < steps.length - 1 ? (
            <Button type="button" onClick={goNext}>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={submitting} className="glow">
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Run AI analysis
                </>
              )}
            </Button>
          )}
        </div>

        {submitting && (
          <p className="mt-4 text-center text-xs text-muted-foreground">
            AI is comparing your profile to an ideal candidate — this may take up to 30 seconds.
          </p>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
