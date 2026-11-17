import type { ReactNode } from "react";
import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FilterToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  children?: ReactNode;
  onReset?: () => void;
  resultCount?: number;
}

export function FilterToolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Filter records…",
  children,
  onReset,
  resultCount,
}: FilterToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/80 bg-card p-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-2.5 min-w-0 flex-1">
        <div className="relative min-w-[200px] flex-1 max-w-[340px]">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-9 pl-8 text-xs bg-background"
          />
        </div>

        {children}

        {onReset && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-9 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3" />
            <span>Reset</span>
          </Button>
        )}
      </div>

      {typeof resultCount === "number" && (
        <span className="text-[11px] font-semibold text-muted-foreground shrink-0">
          {resultCount} item{resultCount !== 1 ? "s" : ""} found
        </span>
      )}
    </div>
  );
}
