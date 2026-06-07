import { TrendingDown, TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { DashboardAssessment } from "@/lib/dashboard/utils";
import { getCompletedWithScores, getScoreDelta } from "@/lib/dashboard/utils";

const chartConfig = {
  score: {
    label: "Readiness score",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

type ScoreTrendChartProps = {
  assessments: DashboardAssessment[];
};

export function ScoreTrendChart({ assessments }: ScoreTrendChartProps) {
  const completedAsc = getCompletedWithScores(assessments);
  const completedDesc = [...completedAsc].reverse();
  const delta = getScoreDelta(completedDesc);

  const chartData = completedAsc.map((a, index) => ({
    label: new Date(a.created_at).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    score: a.readiness_score as number,
    index: index + 1,
  }));

  if (chartData.length === 0) {
    return (
      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold">Score trends</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Complete an assessment to start tracking your readiness score over time.
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">Score trends</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Readiness score across your completed assessments
          </p>
        </div>
        {delta != null && (
          <div
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${
              delta >= 0
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-destructive/30 bg-destructive/10 text-destructive"
            }`}
          >
            {delta >= 0 ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            {delta >= 0 ? "+" : ""}
            {delta} vs previous
          </div>
        )}
      </div>

      {chartData.length === 1 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 py-10 text-center">
          <p className="text-4xl font-bold text-primary">{chartData[0]!.score}</p>
          <p className="mt-1 text-sm text-muted-foreground">First readiness score recorded</p>
          <p className="mt-3 max-w-xs text-xs text-muted-foreground">
            Run another assessment later to see how your score changes over time.
          </p>
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="aspect-auto h-[240px] w-full">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={32}
            />
            <ChartTooltip
              cursor={{ stroke: "var(--color-border)", strokeWidth: 1 }}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const point = payload?.[0]?.payload as { label?: string; index?: number };
                    return point?.index
                      ? `Assessment ${point.index} · ${point.label ?? ""}`
                      : (point?.label ?? "");
                  }}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
              dot={{ fill: "var(--color-chart-1)", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      )}
    </div>
  );
}
