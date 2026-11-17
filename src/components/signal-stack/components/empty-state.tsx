import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Layers } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = Layers,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`signal-panel flex flex-col items-center justify-center p-8 text-center sm:p-12 ${className}`}>
      <span className="grid size-12 place-items-center rounded-xl bg-secondary text-muted-foreground shadow-sm">
        <Icon className="size-6" />
      </span>
      <h3 className="signal-display mt-4 text-sm font-bold text-foreground sm:text-base">{title}</h3>
      <p className="mt-1.5 max-w-sm text-xs leading-5 text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
