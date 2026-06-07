import { CheckCircle2, CircleAlert } from "lucide-react";
import { getReadinessLabel } from "../../features/firstClient/firstClientUtils.js";
import { cn } from "../../utils/cn.js";
import { Badge } from "../ui/Badge.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card.jsx";

export function ProviderReadinessScore({ missingItems = [], score = 0 }) {
  const value = Math.max(0, Math.min(100, Number(score) || 0));
  const label = getReadinessLabel(value);
  const isReady = value >= 70;

  return (
    <Card className="h-full" variant="bordered">
      <CardHeader>
        <Badge variant={isReady ? "green" : "secondary"}>{label}</Badge>
        <CardTitle>First-client readiness</CardTitle>
        <CardDescription>
          A practical score based on profile clarity, offers, proof assets, applications, availability, and discoverability.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-3">
          <span className="text-5xl font-black tracking-normal text-[#07030D]">{value}</span>
          <span className="pb-2 text-sm font-black text-[#6F657C]">/100</span>
        </div>
        <div
          aria-label={`Readiness score ${value} out of 100`}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={value}
          className="mt-5 h-3 overflow-hidden rounded-full bg-[#E9E2F3]"
          role="progressbar"
        >
          <div
            className={cn(
              "h-full rounded-full transition-all",
              isReady ? "bg-[#7C3AED]" : "bg-[#6D28D9]",
            )}
            style={{ width: `${value}%` }}
          />
        </div>
        <div className="mt-5 rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4">
          <p className="flex items-center gap-2 text-sm font-black text-[#07030D]">
            {missingItems.length === 0 ? (
              <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-[#7C3AED]" />
            ) : (
              <CircleAlert aria-hidden="true" className="h-4 w-4 text-[#6D28D9]" />
            )}
            {missingItems.length === 0 ? "Core setup is ready" : "Next setup gaps"}
          </p>
          {missingItems.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {missingItems.map((item) => (
                <Badge key={item} size="sm" variant="outline">
                  {String(item).replaceAll("_", " ")}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm leading-6 text-[#6F657C]">
              Keep applying to starter challenges and attach relevant proof where available.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
