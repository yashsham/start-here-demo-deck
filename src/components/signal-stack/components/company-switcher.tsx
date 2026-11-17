import { useState } from "react";
import { Building2, ChevronDown, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { companies, type CompanyName } from "../data";

export function CompanySwitcher({
  currentCompany,
  onCompanyChange,
}: {
  currentCompany: CompanyName;
  onCompanyChange: (company: CompanyName) => void;
}) {
  const current = companies.find((c) => c.name === currentCompany) ?? companies[0]!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-2 border-border/80 bg-card px-2.5 text-xs font-semibold text-foreground hover:bg-accent sm:px-3"
          aria-label="Select target company"
        >
          <span className="grid size-5 place-items-center rounded bg-brand-soft text-[10px] font-bold text-brand">
            {current.monogram}
          </span>
          <span className="max-w-[130px] truncate">{current.name}</span>
          <ChevronDown className="size-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[260px] p-1.5 shadow-lg">
        <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Target Workspaces
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />
        {companies.map((c) => (
          <DropdownMenuItem
            key={c.name}
            onClick={() => {
              onCompanyChange(c.name);
              toast.success(`Switched workspace to ${c.name}`, {
                description: c.industry,
              });
            }}
            className="flex cursor-pointer items-start gap-2.5 rounded-sm p-2 text-xs"
          >
            <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded bg-brand-soft text-[11px] font-bold text-brand">
              {c.monogram}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">{c.name}</span>
                {c.name === currentCompany && <Check className="size-3.5 text-success" />}
              </div>
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{c.domain}</p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
