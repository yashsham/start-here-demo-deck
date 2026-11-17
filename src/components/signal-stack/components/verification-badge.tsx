import { ShieldCheck, HelpCircle, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type VerificationType = "Verified Fact" | "Operating Assumption" | "Public Stated Claim" | "Unverified";

const verificationConfig: Record<VerificationType, { bg: string; text: string; icon: typeof ShieldCheck }> = {
  "Verified Fact": { bg: "bg-success-soft", text: "text-success", icon: ShieldCheck },
  "Public Stated Claim": { bg: "bg-brand-soft", text: "text-brand", icon: FileText },
  "Operating Assumption": { bg: "bg-warning-soft", text: "text-warning", icon: HelpCircle },
  Unverified: { bg: "bg-muted", text: "text-muted-foreground", icon: HelpCircle },
};

export function VerificationBadge({ type, className = "" }: { type: VerificationType; className?: string }) {
  const config = verificationConfig[type] || verificationConfig.Unverified;
  const Icon = config.icon;

  return (
    <Badge
      variant="secondary"
      className={`inline-flex items-center gap-1.5 rounded-md border-0 px-2 py-0.5 text-[11px] font-semibold ${config.bg} ${config.text} ${className}`}
    >
      <Icon className="size-3 shrink-0" />
      <span>{type}</span>
    </Badge>
  );
}
