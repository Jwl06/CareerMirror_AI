import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageBackLinkProps = {
  to: string;
  label: string;
  className?: string;
};

export function PageBackLink({ to, label, className }: PageBackLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground transition hover:text-foreground",
        className,
      )}
    >
      <ArrowLeft className="h-3 w-3" />
      {label}
    </Link>
  );
}

type PageHeaderProps = {
  back?: PageBackLinkProps;
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function PageHeader({
  back,
  eyebrow,
  title,
  subtitle,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        {back && <PageBackLink to={back.to} label={back.label} />}
        {eyebrow}
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
