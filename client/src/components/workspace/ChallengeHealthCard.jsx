import { AlertCircle, CheckCircle2, CircleDashed, ClipboardCheck, ShieldCheck } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";
import { cn } from "../../utils/cn.js";
import { getChallengeHealth } from "../../features/workspace/workspaceUtils.js";

const healthIcons = {
  awaiting_review: ClipboardCheck,
  completed: CheckCircle2,
  healthy: ShieldCheck,
  needs_attention: AlertCircle,
  no_provider: CircleDashed,
};

const healthClasses = {
  bronze: "border-[#6D28D9]/20 bg-[#FEF3C7] text-[#6D28D9]",
  green: "border-[#A78BFA]/20 bg-[#F5F3FF] text-[#7C3AED]",
  neutral: "border-[#E9E2F3] bg-[#F8F4FF] text-[#6F657C]",
  olive: "border-[#7C3AED]/20 bg-[#F5F3FF] text-[#7C3AED]",
};

const badgeVariants = {
  bronze: "secondary",
  green: "green",
  neutral: "gray",
  olive: "primary",
};

export function ChallengeHealthCard({ challenge, className = "", compact = false }) {
  const health = getChallengeHealth(challenge);
  const Icon = healthIcons[health.key] || ShieldCheck;

  return (
    <div
      className={cn(
        "min-w-0 rounded-2xl border",
        compact ? "p-3" : "p-4",
        healthClasses[health.tone] || healthClasses.neutral,
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/80">
          <Icon aria-hidden="true" className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <Badge size="sm" variant={badgeVariants[health.tone] || "gray"}>
            {health.label}
          </Badge>
          {!compact ? (
            <p className="mt-2 text-sm leading-6 text-current/80">{health.description}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
