import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton({ count = 3, type = "card" }: { count?: number; type?: "card" | "row" | "text" }) {
  if (type === "row") {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-md border border-border/60 p-3">
            <Skeleton className="size-9 rounded-md" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-16 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (type === "text") {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="signal-panel space-y-4 p-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="size-8 rounded-md" />
          </div>
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  );
}
