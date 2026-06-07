import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StatusPanelProps = {
  icon: ReactNode;
  title: string;
  description: string;
  variant?: "default" | "loading" | "error" | "warning";
  actions?: ReactNode;
  className?: string;
};

const variantStyles = {
  default: "border-border",
  loading: "border-primary/20",
  error: "border-destructive/30",
  warning: "border-warning/30",
} as const;

export function StatusPanel({
  icon,
  title,
  description,
  variant = "default",
  actions,
  className,
}: StatusPanelProps) {
  return (
    <div
      className={cn(
        "glass mx-auto flex min-h-[40vh] max-w-lg flex-col items-center justify-center rounded-2xl border p-10 text-center",
        variantStyles[variant],
        className,
      )}
    >
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {actions && <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{actions}</div>}
    </div>
  );
}
