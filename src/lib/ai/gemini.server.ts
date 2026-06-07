import {
  assessmentProfileSchema,
  careerAnalysisSchema,
  type AssessmentProfile,
  type CareerAnalysis,
} from "@/lib/assessment/schema";

const LOVABLE_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const DEFAULT_MODEL = "google/gemini-2.5-flash";

function buildAnalysisPrompt(profile: AssessmentProfile): string {
  return `You are a career coach analyzing a candidate's profile against an ideal industry-ready candidate for their target role.

Return ONLY valid JSON matching this exact structure (no markdown, no code fences):
{
  "readinessScore": number (0-100),
  "summary": string (2-3 sentences),
  "categoryScores": [{ "category": string, "score": number, "feedback": string }] (5 categories: Technical Skills, Projects & Portfolio, Communication, Industry Knowledge, Career Positioning),
  "gaps": [{ "skill": string, "priority": "high"|"medium"|"low", "description": string, "whyItMatters": string }] (5-8 gaps),
  "idealCandidate": { "summary": string, "strengths": string[] },
  "currentProfile": { "summary": string, "strengths": string[] },
  "roadmap": [{ "week": number, "title": string, "focusArea": string, "tasks": string[] }] (16 weeks, 4-month plan)
}

Be specific to their target role and experience level. Roadmap tasks should be actionable and progressive.

Candidate profile:
${JSON.stringify(profile, null, 2)}`;
}

function buildMockAnalysis(profile: AssessmentProfile): CareerAnalysis {
  const baseScore =
    profile.experienceLevel === "student"
      ? 42
      : profile.experienceLevel === "entry"
        ? 52
        : profile.experienceLevel === "junior"
          ? 62
          : profile.experienceLevel === "mid"
            ? 72
            : 82;

  return {
    readinessScore: baseScore,
    summary: `You're on track toward ${profile.targetRole}, but there are clear gaps between your current profile and what hiring managers expect at the ${profile.experienceLevel} level. Focus on building depth in core skills and showcasing impact through projects.`,
    categoryScores: [
      {
        category: "Technical Skills",
        score: baseScore - 5,
        feedback: "Solid foundation, but depth in role-specific tools needs work.",
      },
      {
        category: "Projects & Portfolio",
        score: baseScore - 10,
        feedback: "Projects exist but need clearer outcomes and deployment links.",
      },
      {
        category: "Communication",
        score: baseScore + 5,
        feedback: "Profile shows awareness of career goals; practice articulating impact.",
      },
      {
        category: "Industry Knowledge",
        score: baseScore - 8,
        feedback: "Learn what top candidates in your target role actually ship in production.",
      },
      {
        category: "Career Positioning",
        score: baseScore - 3,
        feedback: "Sharpen your narrative around why you're the right fit for this role.",
      },
    ],
    gaps: [
      {
        skill: "Production-ready project delivery",
        priority: "high",
        description: "Projects should include live demos, tests, and README documentation.",
        whyItMatters: "Employers want proof you can ship, not just prototype.",
      },
      {
        skill: "Role-specific tech stack depth",
        priority: "high",
        description: `Go deeper on the core stack for ${profile.targetRole} beyond surface-level tutorials.`,
        whyItMatters: "Interview loops test practical depth, not breadth alone.",
      },
      {
        skill: "System design fundamentals",
        priority: "medium",
        description: "Understand trade-offs, scalability basics, and architecture patterns.",
        whyItMatters: "Even junior roles increasingly expect design thinking.",
      },
      {
        skill: "Open-source or collaborative contributions",
        priority: "medium",
        description: "Contribute to a repo or collaborate on a team project.",
        whyItMatters: "Shows you can work in real codebases with others.",
      },
      {
        skill: "Interview storytelling",
        priority: "low",
        description: "Practice STAR-format answers tied to your project outcomes.",
        whyItMatters: "Strong candidates lose offers when they can't explain their impact.",
      },
    ],
    idealCandidate: {
      summary: `An ideal ${profile.targetRole} candidate at the ${profile.experienceLevel} level ships polished projects, communicates trade-offs clearly, and demonstrates continuous learning.`,
      strengths: [
        "2–3 deployed projects with measurable impact",
        "Strong grasp of role-specific tools and best practices",
        "Clear GitHub/portfolio with readable code and docs",
        "Can explain technical decisions in interviews",
      ],
    },
    currentProfile: {
      summary: `${profile.fullName} is targeting ${profile.targetRole} with ${profile.yearsOfExperience} year(s) of experience. The profile shows motivation and foundational skills, with room to strengthen portfolio depth.`,
      strengths: [
        "Clear target role and career direction",
        "Relevant skills and project experience listed",
        "Self-awareness of areas to improve",
      ],
    },
    roadmap: Array.from({ length: 16 }, (_, i) => {
      const week = i + 1;
      const phases = [
        { title: "Audit & baseline", focus: "Role research", tasks: ["Study 5 job posts for your target role", "List must-have vs nice-to-have skills", "Score yourself honestly on each skill"] },
        { title: "Core skill sprint", focus: "Technical depth", tasks: ["Complete one advanced tutorial in your stack", "Build a small feature end-to-end", "Write a short blog post explaining what you learned"] },
        { title: "Portfolio upgrade", focus: "Projects", tasks: ["Pick your strongest project to polish", "Add tests and a deployment link", "Update README with problem, solution, and results"] },
        { title: "Gap closure", focus: "Priority gaps", tasks: ["Tackle your highest-priority gap skill", "Build a mini-project demonstrating it", "Get feedback from a peer or mentor"] },
      ];
      const phase = phases[Math.floor(i / 4)]!;
      return {
        week,
        title: `${phase.title} — Week ${((i % 4) + 1)}`,
        focusArea: phase.focus,
        tasks: phase.tasks.map((t) => `${t} (week ${week})`),
      };
    }),
  };
}

function extractJson(content: string): unknown {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced?.[1]?.trim() ?? trimmed;
  return JSON.parse(raw);
}

export async function analyzeCareerProfile(profile: AssessmentProfile): Promise<CareerAnalysis> {
  const validatedProfile = assessmentProfileSchema.parse(profile);
  const apiKey = process.env.LOVABLE_API_KEY;

  if (!apiKey) {
    console.warn("[AI] LOVABLE_API_KEY not set — using mock analysis for local development.");
    return careerAnalysisSchema.parse(buildMockAnalysis(validatedProfile));
  }

  const response = await fetch(LOVABLE_GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a career readiness analyst. Respond with valid JSON only — no markdown fences, no commentary.",
        },
        { role: "user", content: buildAnalysisPrompt(validatedProfile) },
      ],
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`AI gateway error (${response.status}): ${body.slice(0, 200)}`);
  }

  const payload = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("AI gateway returned an empty response.");
  }

  const parsed = extractJson(content);
  return careerAnalysisSchema.parse(parsed);
}
